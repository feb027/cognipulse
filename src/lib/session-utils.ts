import { AssessmentResult } from '@/types';
import { StoredSession } from '@/hooks/use-session-storage';
import { PVTMetrics } from '@/types/pvt';
import { StroopMetrics } from '@/types/stroop';
import { MotorMetrics } from '@/types/motor';

export const DEFAULT_FALLBACK_PVT: PVTMetrics = {
  totalTrials: 10,
  validTrials: 10,
  attentionalLapseCount: 0,
  falseStartCount: 0,
  meanReactionTimeMs: 240,
  medianReactionTimeMs: 235,
  responseSpeed: 4.16,
  lapseRatePercent: 0,
  slowestTenPercentRT: 280,
  fastestTenPercentRT: 210,
  performanceIndex: 85,
};

export const DEFAULT_FALLBACK_STROOP: StroopMetrics = {
  totalTrials: 8,
  accuracyRate: 100,
  meanCongruentRT: 260,
  meanIncongruentRT: 320,
  interferenceCostMs: 60,
  inhibitoryControlScore: 90,
  commissionErrors: 0,
  omissionErrors: 0,
};

export const DEFAULT_FALLBACK_MOTOR: MotorMetrics = {
  totalTaps: 40,
  durationSeconds: 10,
  cadenceTapsPerSecond: 4.0,
  meanInterTapIntervalMs: 250,
  itiStandardDeviationMs: 20,
  neuromuscularSteadinessScore: 88,
  fatigueDecaySlope: -0.01,
};

export function toAssessmentResult(session: StoredSession): AssessmentResult {
  return {
    cfi: session.cfi,
    pvt: session.pvt ?? DEFAULT_FALLBACK_PVT,
    stroop: session.stroop ?? DEFAULT_FALLBACK_STROOP,
    motor: session.motor ?? DEFAULT_FALLBACK_MOTOR,
    corsi: session.corsi,
    diagnosis: session.analysis,
    timestamp: session.timestamp,
  };
}
