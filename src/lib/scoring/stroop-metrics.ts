/**
 * Cognitive Inhibitory Control & Stroop Metrics Engine
 * Mengukur tingkat akurasi inhibisi, kesalahan impulsif (commission), dan biaya interferensi.
 */

import { StroopTrial, StroopMetrics } from '@/types/stroop';

export function calculateStroopMetrics(trials: StroopTrial[]): StroopMetrics {
  if (!trials || trials.length === 0) {
    return {
      totalTrials: 0,
      accuracyRate: 0,
      meanCongruentRT: 0,
      meanIncongruentRT: 0,
      interferenceCostMs: 0,
      commissionErrors: 0,
      omissionErrors: 0,
      inhibitoryControlScore: 0,
    };
  }

  const totalTrials = trials.length;
  const correctTrials = trials.filter((t) => t.isCorrect);
  const accuracyRate = Number(((correctTrials.length / totalTrials) * 100).toFixed(1));

  // Commission errors: User menekan saat seharusnya No-Go (impulsif/kelelahan eksekutif)
  const commissionErrors = trials.filter(
    (t) => t.expectedAction === 'withhold' && t.userAction === 'pressed'
  ).length;

  // Omission errors: User tidak menekan saat Go (atensi hilang)
  const omissionErrors = trials.filter(
    (t) => t.expectedAction === 'press' && t.userAction === 'withheld'
  ).length;

  // RT untuk Congruent (Go-Match) vs Incongruent (No-Go / Mismatch)
  const congruentRTs = trials
    .filter((t) => t.stimulusType === 'go_match' && t.reactionTimeMs !== null)
    .map((t) => t.reactionTimeMs as number);

  const incongruentRTs = trials
    .filter((t) => t.stimulusType === 'no_go_mismatch' && t.reactionTimeMs !== null)
    .map((t) => t.reactionTimeMs as number);

  const meanCongruentRT =
    congruentRTs.length > 0
      ? Math.round(congruentRTs.reduce((a, b) => a + b, 0) / congruentRTs.length)
      : 0;

  const meanIncongruentRT =
    incongruentRTs.length > 0
      ? Math.round(incongruentRTs.reduce((a, b) => a + b, 0) / incongruentRTs.length)
      : 0;

  const interferenceCostMs = Math.max(0, meanIncongruentRT - meanCongruentRT);

  // Inhibitory Control Score (0 - 100)
  // Berkurang drastis akibat commission errors (tanda lelah kontrol otak)
  const penaltyCommission = commissionErrors * 15;
  const penaltyOmission = omissionErrors * 10;
  const penaltyInterference = Math.min(25, Math.round(interferenceCostMs / 8));

  const rawScore = 100 - (penaltyCommission + penaltyOmission + penaltyInterference);
  const inhibitoryControlScore = Math.max(0, Math.min(100, rawScore));

  return {
    totalTrials,
    accuracyRate,
    meanCongruentRT,
    meanIncongruentRT,
    interferenceCostMs,
    commissionErrors,
    omissionErrors,
    inhibitoryControlScore,
  };
}
