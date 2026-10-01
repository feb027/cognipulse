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
Anda adalah dokter spesialis kebugaran kerja dan saraf kognitif.
Tugas Anda menganalisis data refleks (PVT), fokus (Stroop), memori kerja (Corsi), dan ketukan (Motor) pengguna.

ATURAN WAJIB FORMAT KELUARAN:
1. WAJIB 100% MENGGUNAKAN BAHASA INDONESIA YANG SEDERHANA, JELAS, DAN RAMAH.
2. DILARANG KERAS MENGGUNAKAN BAHASA INGGRIS ATAU PARAGRAF PANJANG.
3. Bagian 'clinicalRationale': Tulis MAKSIMAL 2 KALIMAT PENDEK yang langsung ke inti kondisi tubuh dan saran tindakan. Gunakan istilah sehari-hari (contoh: gunakan 'hilang fokus / bengong', 'refleks melambat', 'kurang tidur', 'memori kerja drop').
4. Bagian 'reactionTimeDecayTrajectory': Tulis 1 kalimat pendek bahasa Indonesia, misal: "Refleks akan terus melambat jika tidak segera beristirahat."
5. Bagian 'immediateAction': Tulis 1 tindakan praktis bahasa Indonesia, misal: "Tidur singkat (power nap) 20 menit dan minum segelas air putih."
6. Bagian 'circadianAlignmentNote': Tulis 1 kalimat singkat bahasa Indonesia, misal: "Hindari kopi tambahan mendekati jam tidur utama Anda."
7. Pastikan seluruh nilai JSON valid dan mematuhi skema yang diminta.
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
