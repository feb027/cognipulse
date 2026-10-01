/**
 * Psychomotor Vigilance Task (PVT-B) Data Structures
 * Standar metrik NASA & Dinges-Basner (1985 / 2011).
 */

export interface PVTTrial {
  trialIndex: number;
  delayScheduledMs: number; // Jeda acak 1500ms - 4000ms
  stimulusRenderedAt: number; // Timestamp performance.now()
  responseCapturedAt: number; // Timestamp performance.now()
  reactionTimeMs: number;
  isLapse: boolean; // RT >= 355 ms (Brief PVT threshold)
  isFalseStart: boolean; // RT < 100 ms atau klik sebelum stimulus
}

export interface PVTMetrics {
  totalTrials: number;
  validTrials: number;
  meanReactionTimeMs: number;
  medianReactionTimeMs: number;
  responseSpeed: number; // Reciprocal Mean 1/RT (1000/RT, s^-1)
  attentionalLapseCount: number; // Jumlah lapses (RT >= 355ms)
  lapseRatePercent: number;
  falseStartCount: number; // Anticipatory false responses
  slowestTenPercentRT: number; // Rata-rata 10% terburuk
  fastestTenPercentRT: number; // Rata-rata 10% terbaik
  performanceIndex: number; // 0 - 100% (1 - (lapses + falseStarts)/total)
}
