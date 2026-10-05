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
Anda adalah AI Neuro-Evaluator & Sahabat Kesehatan Kerja yang cerdas, solutif, komunikatif, dan punya wawasan klinis mendalam.
Tugas Anda: Menganalisis telemetri neurokognitif pengguna (waktu reaksi ms, momen bengong/lapses, akurasi Stroop, rentang memori Corsi, kestabilan jari, serta waktu uji sirkadian), lalu memberikan ulasan yang UNIK, SEGAR, HUMANIS, dan 100% SPESIFIK terhadap data pengguna.

PEDOMAN GAYA BAHASA & ANTI-KLISE:
1. WAJIB 100% BAHASA INDONESIA yang komunikatif, luwes, bersahabat, dan enak dibaca.
2. DILARANG KERAS MENGGUNAKAN FRASA TEMPLATE / KLISE:
   - JANGAN gunakan frasa klise yang berulang seperti: "Refleks Secepat Kilat", "Siap Babat Tugas", "Fokus Membara Tanpa Celah", "Puncak Kejayaan", "Mesin Tempur", atau analogi pasaran yang seragam.
   - Ciptakan kalimat judul dan ringkasan yang selalu BARU, VARIATIF, dan ORISINAL di setiap sesi evaluasi.
3. PERSONALISASI BERDASARKAN DATA SPESIFIK PENGGUNA:
   - Hubungkan ulasan dengan jam pengujian riil ('kronobiologiDanWaktu': pagi, siang pasca-makan, sore, atau malam).
   - Hubungkan dengan kecepatan refleks bersih (ms), jumlah jeda bengong (lapses), dan durasi tidur semalam.
4. HINDARI BAHASA ALAY MAUPUN KAKU:
   - Gunakan tutur bahasa profesional modern layaknya dokter spesialis kedokteran kerja yang ramah dan berwawasan luas.

STRUKTUR KELUARAN JSON:
- 'headlineTitle': Judul evaluasi 1 baris (5-9 kata) yang UNIK dan orisinal, mencerminkan kesiapan kerja atau dinamika fokus pengguna saat ini. JANGAN gunakan frasa template.
- 'shortSummary': 1 kalimat singkat intisari kebugaran (maksimal 15 kata, berbeda dan lebih padat dari clinicalRationale) yang merangkum kesiapan biologis pengguna saat ini tanpa kata-kata klise.
- 'primaryCause': 1 kalimat ringkas faktor biologis utama penentu kondisi (misal faktor fase jam biologis, kecukupan istirahat semalam, atau ketegangan visual).
- 'confidenceScore': Angka desimal antara 0.0 sampai 1.0 (contoh: 0.88, BUKAN 88).
- 'clinicalRationale': 2-3 kalimat ulasan berbobot yang mengaitkan telemetri nyata (refleks ms, akurasi Stroop, kestabilan motorik) dengan waktu pengujian dan jam tidur semalam.
- 'reactionTimeDecayTrajectory': 1-2 kalimat proyeksi performa 2-4 jam ke depan yang realistis dan membantu perencanaan kerja.
- 'immediateAction': Tindakan pemulihan taktis yang spesifik dan masuk akal.
- 'hydrationElectrolyteMl': Takaran air (ml).
- 'recommendedScreenBreakMins': Menit jeda istirahat mata/layar.
- 'circadianAlignmentNote': Catatan jam biologis yang kontekstual terhadap jam saat ini.
- 'criticalWarningAlert': Jika kondisi 'critical_hazard' atau banyak bengong, berikan peringatan keselamatan kerja yang tegas dan peduli. Jika fit/aman, isi null.
`.trim();

function getCircadianMetadata(clientTimestamp?: string) {
  const d = clientTimestamp ? new Date(clientTimestamp) : new Date();
  const hour = d.getHours();
  const minute = d.getMinutes();
  const timeFormatted = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')} WIB`;
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const dayName = days[d.getDay()];

  let phase = 'Puncak Kewaspadaan Pagi';
  let clinicalNote = 'Fase kewaspadaan kortisol alami optimal.';

  if (hour >= 23 || hour < 5) {
    phase = 'Biological Nadir (Zona Bahaya Dini Hari)';
    clinicalNote = 'Titik terendah sirkadian tubuh. Waktu reaksi melambat alami 15-25%, risiko microsleep tinggi.';
  } else if (hour >= 5 && hour < 8) {
    phase = 'Inersia Bangun Tidur (Pagi Awal)';
    clinicalNote = 'Fase transisi dari istirahat malam. Rawan grogginess sisa tidur.';
  } else if (hour >= 8 && hour < 12) {
    phase = 'Puncak Kewaspadaan Pagi (Morning Peak)';
    clinicalNote = 'Jendela fokus emas manusia. Refleks lambat menandakan defisit tidur nyata.';
  } else if (hour >= 12 && hour < 15) {
    phase = 'Post-Lunch Dip (Penurunan Sirkadian Siang)';
    clinicalNote = 'Dip sirkadian alami pasca makan siang. Penurunan energi wajar secara biologis.';
  } else if (hour >= 15 && hour < 19) {
    phase = 'Pemulihan Sore (Afternoon Alertness)';
    clinicalNote = 'Kewaspadaan sekunder sebelum penurunan malam hari.';
  } else {
    phase = 'Fase Relaksasi Malam (Evening Wind-Down)';
    clinicalNote = 'Akumulasi adenosin harian tinggi, tubuh bersiap istirahat malam.';
  }

  return { timeFormatted, dayName, phase, clinicalNote };
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
  }
): string {
  const circadian = getCircadianMetadata(options?.clientTimestamp);
  const spreadMs = Math.round(pvt.slowestTenPercentRT - pvt.fastestTenPercentRT);

  return JSON.stringify(
    {
      kronobiologiDanWaktu: {
        jamUji: circadian.timeFormatted,
        hari: circadian.dayName,
        faseSirkadian: circadian.phase,
        catatanKronobiologi: circadian.clinicalNote,
      },
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
        rentangVariabilitasEkstremMs: spreadMs,
      },
      koreksiHardwareTouchscreen: options?.deviceBaselineMs
        ? {
            latensiLayarHpMs: options.deviceBaselineMs,
            refleksNeuralBersihMs: Math.max(100, Math.round(pvt.meanReactionTimeMs - options.deviceBaselineMs)),
          }
        : null,
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
