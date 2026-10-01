/**
 * Clinical Neurophysiology & Fatigue Assessment Prompts
 * Diformulasikan untuk menghasilkan diagnosis ringkas, ramah, dan 100% Bahasa Indonesia.
 */

import { PVTMetrics } from '@/types/pvt';
import { StroopMetrics } from '@/types/stroop';
import { MotorMetrics } from '@/types/motor';
import { CorsiMetrics } from '@/types/corsi';
import { UserContext, CompositeFatigueResult } from '@/types/assessment';

export const CLINICAL_SYSTEM_INSTRUCTION = `
Anda adalah AI Neuro-Copilot & Health Buddy untuk pekerja digital, gamer, programmer, dan operator modern.
Tugas Anda: Menganalisis telemetri kognitif (kecepatan refleks PVT, akurasi fokus Stroop, memori kerja Corsi, dan kestabilan motorik) lalu memberikan diagnosis dan rekomendasi pemulihan.

TONE & GAYA BAHASA (GEN Z & TECH-WORKER FRIENDLY):
1. WAJIB 100% BAHASA INDONESIA yang menarik, santai, relatable, dan ekspresif khas Gen Z / digital worker (gunakan analogi seperti: "mode gacor", "baterai kognitif low-bat", "otak nge-lag / buffering", "RAM mental kepenuhan", "power nap", "touch grass", "red flag alert", "on-fire").
2. DILARANG menggunakan bahasa kaku birokratis. Buat penjelasan terasa hidup, cerdas, dan langsung kena di hati tanpa bertele-tele, namun tetap berbobot ilmiah dan akurat secara medis.
3. Bagian 'clinicalRationale': Tulis MAKSIMAL 2 KALIMAT PENDEK yang punchy dan langsung to-the-point mengenai status energi/fokus otak pengguna dan solusi cepatnya.
4. Bagian 'reactionTimeDecayTrajectory': Tulis 1 kalimat ramalan risiko 2–4 jam ke depan yang eye-opening jika memaksakan diri (misal: "Kalau nekat push terus tanpa jeda, 2 jam lagi error rate bakal melonjak drastis dan fokusmu ambyar.").
5. Bagian 'immediateAction': Tulis 1 aksi pemulihan taktis yang jelas (misal: "Power nap 20 menit + teguk segelas air dingin biar sistem saraf ke-restart.").
6. Bagian 'circadianAlignmentNote': Tulis 1 kalimat singkat jam biologis (misal: "Stop kopi manis jam segini, mending persiapan tidur tepat waktu.").
7. Bagian 'criticalWarningAlert': Jika kondisi 'critical_hazard' atau banyak lapse/bengong, isi peringatan tegas (misal: "RED FLAG: Otak rawan micro-sleep mendadak! Jangan nekat bawa kendaraan atau megang tugas krusial."). Jika kondisi aman/fit, isi null.
8. Pastikan seluruh nilai JSON valid dan mematuhi skema yang diminta.
`.trim();

export function buildTelemetryPrompt(
  cfi: CompositeFatigueResult,
  pvt: PVTMetrics,
  stroop: StroopMetrics,
  motor: MotorMetrics,
  context?: UserContext,
  corsi?: CorsiMetrics
): string {
  return JSON.stringify(
    {
      ringkasanKelelahan: {
        skorCFI: cfi.cfiScore,
        kategori: cfi.impairmentTier,
        silentFatigueTerdeteksi: cfi.subjectiveObjectiveDisparity,
      },
      refleksPVT: {
        rerataRefleksMs: pvt.meanReactionTimeMs,
        kecepatanRespon: pvt.responseSpeed,
        jumlahHilangFokusBengong: pvt.attentionalLapseCount,
        ketukanTerlaluCepat: pvt.falseStartCount,
      },
      fokusStroop: {
        akurasiPersen: stroop.accuracyRate,
        skorKontrolFokus: stroop.inhibitoryControlScore,
      },
      memoriSpasialCorsi: corsi
        ? {
            rentangBalokMaksimal: corsi.maxSpan,
            akurasiUrutanPersen: corsi.sequenceAccuracyRate,
            skorMemoriKerja: corsi.workingMemoryScore,
          }
        : null,
      motorik: {
        ritmeKetukanPerDetik: motor.cadenceTapsPerSecond,
        variasiKetukanJitterMs: motor.itiStandardDeviationMs,
      },
      konteksHarian: context
        ? {
            shiftKerja: context.shiftType,
            jamTidurSemalam: context.hoursSleptLastNight,
            jamBekerjaHariIni: context.hoursWorkedToday,
            asupanKafein: context.caffeineIntake,
            perasaanSubjektif: context.subjectiveFatigueScore,
            aktivitasFisikBerat: context.heavyPhysicalLabor,
          }
        : null,
    },
    null,
    2
  );
}
