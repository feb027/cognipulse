/**
 * Types for Corsi Block-Tapping Test (Spatial Working Memory)
 * Mengukur kapasitas memori kerja spasial dan daya tahan fokus prefrontal.
 */

export interface CorsiTrial {
  trialIndex: number;
  spanLength: number;
  targetSequence: number[]; // Indeks blok 0-8
  userSequence: number[];
  isCorrect: boolean;
  responseTimeMs: number;
}

export interface CorsiMetrics {
  totalTrials: number;
  correctTrials: number;
  maxSpan: number; // Panjang urutan maksimal yang berhasil diulang
  sequenceAccuracyRate: number; // Persentase ketepatan urutan (0-100%)
  workingMemoryScore: number; // Skor memori kerja normalisasi (0-100)
}
