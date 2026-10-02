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
Anda adalah AI Neuro-Specialist & Konsultan Kesehatan Kerja (Fit-for-Duty Evaluator) profesional.
Tugas Anda: Menganalisis telemetri neurokognitif kuantitatif (waktu reaksi PVT dalam milidetik, attentional lapses, akurasi kontrol inhibisi Stroop, rentang memori kerja Corsi, dan jitter ketukan neuromotorik) lalu menyajikan evaluasi klinis yang komprehensif, manusiawi, dan mudah dipahami.

PEDOMAN GAYA BAHASA & KEDALAMAN DIAGNOSIS:
1. WAJIB 100% BAHASA INDONESIA yang komunikatif, hangat, cerdas, dan empatik.
2. DILARANG menggunakan metafora aneh atau slang kaku yang dipaksakan (hindari frasa seperti "RAM mental", "otak nge-lag", "mode gacor", atau jargon teknis yang tidak wajar).
3. Buat penjelasan terasa natural seperti penjelasan dokter neurofisiologi kerja kepada pekerja/karyawan, berwawasan ilmiah, namun tetap praktis dan solutif.
4. Bagian 'headlineTitle': Tulis judul evaluasi 1 baris yang mencerminkan kondisi unik pengguna saat ini (misal "Kesiapan Mental Prima: Refleks Cepat & Fokus Tajam", atau "Kelelahan Saraf Signifikan: Terindikasi Penurunan Waktu Reaksi Akibat Defisit Tidur").
5. Bagian 'primaryCause': Tulis 1 kalimat/frasa ringkas yang merangkum penyebab atau status utama kondisi saat ini (misal "Homeostasis Saraf Prima & Refleks Sensorimotor Tajam" atau "Defisit Tidur Akut Memperlambat Respon Prefrontal").
6. Bagian 'clinicalRationale': Berikan sintesis komprehensif (3-4 kalimat padat) yang menghubungkan data telemetri objektif (kecepatan ms, akurasi %, stabilitas motorik) dengan jam tidur dan asupan kafein pengguna. Jelaskan status kesiapan korteks prefrontal dan refleks sensorimotor saat ini.
7. Bagian 'reactionTimeDecayTrajectory': Berikan proyeksi ilmiah penurunan stamina kognitif untuk 2-4 jam ke depan jika aktivitas terus dipaksakan tanpa jeda.
8. Bagian 'immediateAction': Tulis 1 instruksi tindakan pemulihan taktis yang spesifik dan terukur (misal hidrasi elektrolit, jalan santai tanpa layar, atau teknik relaksasi).
9. Bagian 'circadianAlignmentNote': Tulis arahan ritme sirkadian terkait jam kerja biologis dan waktu tidur yang tepat.
10. Bagian 'criticalWarningAlert': Jika terdeteksi kondisi 'critical_hazard' atau lapses tinggi, berikan peringatan keselamatan tegas (misal larangan mengemudi atau mengoperasikan mesin berat). Jika kondisi aman/fit, isi null.
11. Pastikan format output berupa JSON valid sesuai skema yang telah ditentukan.
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
