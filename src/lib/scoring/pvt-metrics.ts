/**
 * Psychomotor Vigilance Task (PVT-B) Metrics Engine
 * Standar matematis: Dinges & Powell (1985), Basner & Dinges (2011).
 * Menggunakan Reciprocal Response Speed (1/RT), Attentional Lapses (>=355ms), dan False Starts.
 */

import { PVTTrial, PVTMetrics } from '@/types/pvt';

export const BRIEF_PVT_LAPSE_THRESHOLD_MS = 355; // Threshold lapse brief PVT 3 menit
export const FALSE_START_THRESHOLD_MS = 100; // Respon fisiologis mustahil < 100ms

export function calculatePVTMetrics(trials: PVTTrial[]): PVTMetrics {
  if (!trials || trials.length === 0) {
    return {
      totalTrials: 0,
      validTrials: 0,
      meanReactionTimeMs: 0,
      medianReactionTimeMs: 0,
      responseSpeed: 0,
      attentionalLapseCount: 0,
      lapseRatePercent: 0,
      falseStartCount: 0,
      slowestTenPercentRT: 0,
      fastestTenPercentRT: 0,
      performanceIndex: 0,
    };
  }

  const totalTrials = trials.length;
  const falseStarts = trials.filter(
    (t) => t.isFalseStart || t.reactionTimeMs < FALSE_START_THRESHOLD_MS
  );
  const validTrials = trials.filter(
    (t) => !t.isFalseStart && t.reactionTimeMs >= FALSE_START_THRESHOLD_MS
  );

  const falseStartCount = falseStarts.length;
  const validCount = validTrials.length;

  if (validCount === 0) {
    return {
      totalTrials,
      validTrials: 0,
      meanReactionTimeMs: 0,
      medianReactionTimeMs: 0,
      responseSpeed: 0,
      attentionalLapseCount: 0,
      lapseRatePercent: 0,
      falseStartCount,
      slowestTenPercentRT: 0,
      fastestTenPercentRT: 0,
      performanceIndex: 0,
    };
  }

  const rts = validTrials.map((t) => t.reactionTimeMs).sort((a, b) => a - b);
  const sumRT = rts.reduce((acc, v) => acc + v, 0);
  const meanReactionTimeMs = Math.round(sumRT / validCount);

  // Median RT
  const mid = Math.floor(validCount / 2);
  const medianReactionTimeMs =
    validCount % 2 !== 0 ? rts[mid] : Math.round((rts[mid - 1] + rts[mid]) / 2);

  // Reciprocal Response Speed: Mean 1/RT * 1000 (s^-1)
  const reciprocalSpeedSum = validTrials.reduce(
    (acc, t) => acc + 1000 / t.reactionTimeMs,
    0
  );
  const responseSpeed = Number((reciprocalSpeedSum / validCount).toFixed(2));

  // Attentional Lapses (RT >= 355ms)
  const lapses = validTrials.filter(
    (t) => t.reactionTimeMs >= BRIEF_PVT_LAPSE_THRESHOLD_MS
  );
  const attentionalLapseCount = lapses.length;
  const lapseRatePercent = Number(
    ((attentionalLapseCount / validCount) * 100).toFixed(1)
  );

  // 10% Tercepat & Terlambat
  const tenPercentCount = Math.max(1, Math.round(validCount * 0.1));
  const fastestRts = rts.slice(0, tenPercentCount);
  const slowestRts = rts.slice(-tenPercentCount);

  const fastestTenPercentRT = Math.round(
    fastestRts.reduce((a, b) => a + b, 0) / fastestRts.length
  );
  const slowestTenPercentRT = Math.round(
    slowestRts.reduce((a, b) => a + b, 0) / slowestRts.length
  );

  // Performance Index Formula Dinges: 1 - (Lapses + False Starts) / Total Trials
  const errorCount = attentionalLapseCount + falseStartCount;
  const rawPI = Math.max(0, 1 - errorCount / totalTrials);
  const performanceIndex = Number((rawPI * 100).toFixed(1));

  return {
    totalTrials,
    validTrials: validCount,
    meanReactionTimeMs,
    medianReactionTimeMs,
    responseSpeed,
    attentionalLapseCount,
    lapseRatePercent,
    falseStartCount,
    slowestTenPercentRT,
    fastestTenPercentRT,
    performanceIndex,
  };
}
