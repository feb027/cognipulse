/**
 * Corsi Block-Tapping Metrics Calculator
 * Menghitung kapasitas memori kerja spasial (Visuospatial Working Memory Span).
 * Murni logika komputasi matematika tanpa JSX sesuai prinsip SRP.
 */

import { CorsiTrial, CorsiMetrics } from '@/types/corsi';

export function calculateCorsiMetrics(trials: CorsiTrial[]): CorsiMetrics {
  if (!trials || trials.length === 0) {
    return {
      totalTrials: 0,
      correctTrials: 0,
      maxSpan: 0,
      sequenceAccuracyRate: 0,
      workingMemoryScore: 50,
    };
  }

  const totalTrials = trials.length;
  const correctTrials = trials.filter((t) => t.isCorrect).length;
  const sequenceAccuracyRate = Math.round((correctTrials / totalTrials) * 100);

  // Cari span tertinggi yang dijawab benar
  const correctSpans = trials.filter((t) => t.isCorrect).map((t) => t.spanLength);
  const maxSpan = correctSpans.length > 0 ? Math.max(...correctSpans) : 0;

  // Hitung Skor Memori Kerja (0 - 100)
  // Standar klinis: Dewasa bugar span 5-6 (Skor 90-100)
  // Lelah / kurang tidur span 3-4 (Skor 50-75)
  // Gangguan berat span <= 2 (Skor < 40)
  let baseScore = 50;
  if (maxSpan >= 6) {
    baseScore = 100;
  } else if (maxSpan === 5) {
    baseScore = 90;
  } else if (maxSpan === 4) {
    baseScore = 75;
  } else if (maxSpan === 3) {
    baseScore = 55;
  } else if (maxSpan > 0) {
    baseScore = 35;
  } else {
    baseScore = 20;
  }

  // Modulasi dengan akurasi urutan keseluruhan
  const workingMemoryScore = Math.min(
    100,
    Math.max(0, Math.round(baseScore * 0.7 + sequenceAccuracyRate * 0.3))
  );

  return {
    totalTrials,
    correctTrials,
    maxSpan,
    sequenceAccuracyRate,
    workingMemoryScore,
  };
}
