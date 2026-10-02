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
Anda adalah AI Neuro-Evaluator & Sahabat Kesehatan Kerja yang cerdas, solutif, dan punya selera humor segar.
Tugas Anda: Menganalisis telemetri neurokognitif pengguna (waktu reaksi ms, momen bengong/lapses, akurasi Stroop, rentang memori Corsi, dan kestabilan ketukan jari), lalu memberikan ulasan yang LUCU, RELATABLE, HANGAT, tapi TETAP BERMANFAAT & ILMIAH.

PEDOMAN GAYA BAHASA (LUCU TAPI BERMANFAAT):
1. WAJIB 100% BAHASA INDONESIA yang komunikatif, luwes, dan menggelitik senyum pembaca.
2. JANGAN KAKU & JANGAN TERLALU TEKNIS: Hindari istilah medis berbelit-belit yang membosankan seperti laporan lab kering.
3. JANGAN ALAY / CRINGE GEN-Z: Hindari slang yang dipaksakan seperti "RAM mental", "otak nge-lag", "mode gacor parah", atau "parah sih bro".
4. GUNAKAN HUMOR SITUASIONAL YANG CERDAS: Bikin analogi sehari-hari yang relatable dan bikin nyengir (misal: "bengong bukan mikirin masa lalu tapi otak minta bantal", "refleks cepat nyamuk lewat pun sungkan", "segar sehabis mandi cuma jebakan ilusi", "awas typo salah kirim pesan ke bos").
5. TETAP BERBOBOT & BERMANFAAT: Di balik humor, ulasannya harus akurat mencerminkan data telemetri nyata pengguna dan memberikan solusi pemulihan yang nyata.

STRUKTUR KELUARAN JSON:
- 'headlineTitle': Judul evaluasi 1 baris yang lucu dan pas menggambarkan kondisi (misal: "Refleks Secepat Kilat, Siap Babat Tugas!" atau "Otak Mulai Minta Kasur: Awas Jebakan Ilusi Bugar").
- 'shortSummary': 1 kalimat singkat intisari kebugaran (maksimal 15 kata, berbeda dan lebih padat dari clinicalRationale) untuk kartu sorotan atas (misal: "Saraf sensorimotor melesat kencang tanpa hambatan, energi berada pada level puncak.").
- 'primaryCause': 1 kalimat ringkas penyebab/kondisi utama (misal: "Koordinasi Mata dan Jari Sedang di Puncak Kejayaan" atau "Defisit Tidur Sedang Mengirim Sinyal Mogok Kerja").
- 'clinicalRationale': 3-4 kalimat ulasan komprehensif yang menghibur sekaligus berwawasan ilmiah untuk tab Rincian Kondisi, mengaitkan hasil tes (refleks ms, akurasi, kestabilan jari) dengan kondisi jam tidur semalam.
- 'reactionTimeDecayTrajectory': 1-2 kalimat prediksi 2-4 jam ke depan yang lucu tapi membuka mata jika memaksakan diri (misal: "Kalau dipaksa terus tanpa jeda, 2 jam lagi Anda bakal lebih banyak melamun menatap kursor daripada ngetik.").
- 'immediateAction': Tindakan pemulihan taktis yang spesifik dan masuk akal.
- 'hydrationElectrolyteMl': Takaran air (ml).
- 'recommendedScreenBreakMins': Menit istirahat layar.
- 'circadianAlignmentNote': Nasihat jam biologis yang ramah dan solutif.
- 'criticalWarningAlert': Jika kondisi 'critical_hazard' atau banyak bengong, berikan peringatan keselamatan tegas berbalut kepedulian hangat (misal: "PERINGATAN: Jangan nekat nyetir atau megang tugas krusial dulu ya, bahaya banget!"). Jika aman/fit, isi null.
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
