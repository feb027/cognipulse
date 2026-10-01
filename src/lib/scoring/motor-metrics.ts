/**
 * Motor Tapping & Neuromuscular Cadence Engine
 * Mengukur variabilitas jeda antar-ketukan (Inter-Tap Interval Jitter) dan perlambatan tempo motorik.
 */

import { TapEvent, MotorMetrics } from '@/types/motor';

export function calculateMotorMetrics(
  tapEvents: TapEvent[],
  durationSeconds: number = 15
): MotorMetrics {
  const totalTaps = tapEvents.length;

  if (totalTaps < 4) {
    return {
      totalTaps,
      durationSeconds,
      cadenceTapsPerSecond: 0,
      meanInterTapIntervalMs: 0,
      itiStandardDeviationMs: 0,
      fatigueDecaySlope: 0,
      neuromuscularSteadinessScore: 0,
    };
  }

  // Inter-Tap Intervals (abaikan tap pertama karena belum ada jeda sebelumnya)
  const itis = tapEvents.slice(1).map((t) => t.interTapIntervalMs).filter((v) => v > 0);
  const itiCount = itis.length;

  if (itiCount === 0) {
    return {
      totalTaps,
      durationSeconds,
      cadenceTapsPerSecond: 0,
      meanInterTapIntervalMs: 0,
      itiStandardDeviationMs: 0,
      fatigueDecaySlope: 0,
      neuromuscularSteadinessScore: 0,
    };
  }

  const sumITI = itis.reduce((a, b) => a + b, 0);
  const meanInterTapIntervalMs = Math.round(sumITI / itiCount);
  const cadenceTapsPerSecond = Number((totalTaps / durationSeconds).toFixed(1));

  // Hitung Standard Deviation ITI (Jitter)
  const variance =
    itis.reduce((acc, val) => acc + Math.pow(val - meanInterTapIntervalMs, 2), 0) /
    itiCount;
  const itiStandardDeviationMs = Number(Math.sqrt(variance).toFixed(1));

  // Hitung Linear Regression Slope: Tren perubahan ITI sepanjang waktu
  // Slope positif = ITI membesar = tempo melambat (tanda kelelahan neuromuskular)
  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumX2 = 0;

  for (let i = 0; i < itiCount; i++) {
    const x = i;
    const y = itis[i];
    sumX += x;
    sumY += y;
    sumXY += x * y;
    sumX2 += x * x;
  }

  const denominator = itiCount * sumX2 - sumX * sumX;
  const fatigueDecaySlope =
    denominator !== 0
      ? Number(((itiCount * sumXY - sumX * sumY) / denominator).toFixed(2))
      : 0;

  // Neuromuscular Steadiness Score (0 - 100)
  // Jitter ideal < 15ms. Jitter > 50ms mengindikasikan tremor atau kelelahan.
  const jitterPenalty = Math.min(50, Math.round(itiStandardDeviationMs * 0.9));
  const decayPenalty = fatigueDecaySlope > 0 ? Math.min(30, Math.round(fatigueDecaySlope * 10)) : 0;
  const rawScore = 100 - (jitterPenalty + decayPenalty);
  const neuromuscularSteadinessScore = Math.max(0, Math.min(100, rawScore));

  return {
    totalTaps,
    durationSeconds,
    cadenceTapsPerSecond,
    meanInterTapIntervalMs,
    itiStandardDeviationMs,
    fatigueDecaySlope,
    neuromuscularSteadinessScore,
  };
}
