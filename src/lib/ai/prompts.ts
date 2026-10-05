/**
 * Travel Fleet & Driver Neurocognitive Assessment Prompts
 * Khusus dirancang untuk evaluasi keselamatan transportasi darat & armada travel.
 */

import { PVTMetrics } from '@/types/pvt';
import { StroopMetrics } from '@/types/stroop';
import { MotorMetrics } from '@/types/motor';
import { CorsiMetrics } from '@/types/corsi';
import { UserContext, CompositeFatigueResult } from '@/types/assessment';
import { getCircadianMetadata } from './circadian';

export const CLINICAL_SYSTEM_INSTRUCTION = `
Anda adalah AI Lead Safety Evaluator & Neuro-Kognitif Konsultan Armada Travel Antarkota.
Tugas Anda: Menganalisis kesiapan kerja supir travel komersial berdasarkan telemetri neurokognitif (waktu reaksi pengereman ms, attentional lapses/bengong, kontrol fokus Stroop, kapasitas spasial Corsi, stabilitas motorik, jam sirkadian, serta rute kendaraan).

PEDOMAN KESELAMATAN JALAN RAYA & ARMADA TRAVEL:
1. ESTIMASI JARAK REAKSI PENGEREMAN TOL:
   - Pada kecepatan tol 100 km/jam (27.78 m/s), jarak tempuh sebelum kaki supir menginjak pedal rem dihitung dari meanReactionTimeMs: Jarak (m) = (meanReactionTimeMs / 1000) * 27.78.
   - Reaksi prima normal (~250ms) = 6.9 meter.
   - Jika reaksi 360ms = 10.0 meter (bahaya delta +3.1m). Jika >450ms = >12.5 meter (risiko tabrak belakang fatal).
2. RISIKO MICROSLEEP & HIPNOSIS JALAN TOL:
   - Attentional lapse count (bengong >500ms) menandakan risiko tinggi microsleep di jalan tol panjang (Cipali, Cipularang, Trans-Jawa).
3. REKOMENDASI DISPATCHER:
   - Tentukan secara tegas: 'siap_solo' (kondisi prima), 'wajib_co_driver' (ada penurunan refleks ringan/sedang), atau 'stand_down' (dilarang jalan, wajib tidur).
4. PROTOKOL REST AREA: Berikan saran spesifik km rest area atau batas maksimal mengemudi (maks 2-3 jam sebelum rotasi).
5. BAHASA & ANTI-KLISE: Gunakan 100% Bahasa Indonesia profesional, tegas, humanis. JANGAN gunakan frasa klise seperti "Refleks Secepat Kilat" atau "Fokus Membara".
`.trim();

export interface DriverEvaluationContext {
  nip?: string;
  name?: string;
  vehicleType?: string;
  licensePlate?: string;
  activeRoute?: string;
  medicalHistory?: string;
}

export function buildTelemetryPrompt(
  cfi: CompositeFatigueResult,
  pvt: PVTMetrics,
  stroop: StroopMetrics,
  motor: MotorMetrics,
  context?: UserContext,
  corsi?: CorsiMetrics,
  options?: {
    deviceBaselineMs?: number;
    clientTimestamp?: string;
    driverContext?: DriverEvaluationContext;
  }
): string {
  const circadian = getCircadianMetadata(options?.clientTimestamp);
  const spreadMs = Math.round(pvt.slowestTenPercentRT - pvt.fastestTenPercentRT);
  const rtSeconds = pvt.meanReactionTimeMs / 1000;
  const estimatedBrakingMeters = parseFloat((rtSeconds * 27.78).toFixed(1));

  return JSON.stringify(
    {
      konteksArmadaTravel: options?.driverContext || {
        nama: 'Supir Travel Antarkota',
        armada: 'Toyota HiAce Premio',
        rute: 'Lintas Tol Antarkota',
      },
      kronobiologiDanWaktu: {
        jamUji: circadian.timeFormatted,
        hari: circadian.dayName,
        faseSirkadian: circadian.phase,
        catatanKronobiologi: circadian.clinicalNote,
      },
      ringkasanKelelahan: {
        skorCFI: cfi.cfiScore,
        kategori: cfi.impairmentTier,
        laikJalan: cfi.impairmentTier !== 'critical_hazard',
      },
      telemetriKecepatanPengereman: {
        rerataRefleksMs: pvt.meanReactionTimeMs,
        estimasiJarakReaksiTol100kmh: `${estimatedBrakingMeters} meter`,
        jumlahHilangFokusBengong: pvt.attentionalLapseCount,
        ketukanTerlaluCepat: pvt.falseStartCount,
        variabilitasEkstremMs: spreadMs,
      },
      kontrolFokusStroop: {
        akurasiPersen: stroop.accuracyRate,
        skorKontrolFokus: stroop.inhibitoryControlScore,
      },
      memoriSpasialCorsi: corsi
        ? {
            rentangBalokMaksimal: corsi.maxSpan,
            akurasiUrutanPersen: corsi.sequenceAccuracyRate,
          }
        : null,
      koordinasiMotorikJemari: {
        ritmeKetukanPerDetik: motor.cadenceTapsPerSecond,
        jitterStabilitasMs: motor.itiStandardDeviationMs,
      },
      konteksKesehatanSupir: context
        ? {
            jamTidurSemalam: context.hoursSleptLastNight,
            jamBekerjaHariIni: context.hoursWorkedToday,
            asupanKafein: context.caffeineIntake,
            perasaanSubjektif: context.subjectiveFatigueScore,
          }
        : null,
    },
    null,
    2
  );
}
