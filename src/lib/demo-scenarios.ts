/**
 * Seeded Demo Scenarios for Quick Jury Evaluation
 * Memisahkan data mock skenario dari komponen UI untuk mematuhi mandat anti-monolith.
 */

import { PVTMetrics } from '@/types/pvt';
import { StroopMetrics } from '@/types/stroop';
import { MotorMetrics } from '@/types/motor';
import { CorsiMetrics } from '@/types/corsi';
import { UserContext, CompositeFatigueResult } from '@/types/assessment';

export interface DemoScenarioPackage {
  cfi: CompositeFatigueResult;
  pvt: PVTMetrics;
  stroop: StroopMetrics;
  motor: MotorMetrics;
  corsi?: CorsiMetrics;
  context: UserContext;
}

export const SCENARIO_FRESH_WORKER: DemoScenarioPackage = {
  pvt: {
    totalTrials: 6,
    validTrials: 6,
    meanReactionTimeMs: 215,
    medianReactionTimeMs: 212,
    responseSpeed: 4.65,
    attentionalLapseCount: 0,
    lapseRatePercent: 0,
    falseStartCount: 0,
    slowestTenPercentRT: 235,
    fastestTenPercentRT: 198,
    performanceIndex: 100,
  },
  stroop: {
    totalTrials: 8,
    accuracyRate: 100,
    meanCongruentRT: 260,
    meanIncongruentRT: 275,
    interferenceCostMs: 15,
    commissionErrors: 0,
    omissionErrors: 0,
    inhibitoryControlScore: 98,
  },
  motor: {
    totalTaps: 48,
    durationSeconds: 15,
    cadenceTapsPerSecond: 3.2,
    meanInterTapIntervalMs: 245,
    itiStandardDeviationMs: 3.8,
    fatigueDecaySlope: 0.02,
    neuromuscularSteadinessScore: 96,
  },
  corsi: {
    totalTrials: 4,
    correctTrials: 4,
    maxSpan: 6,
    sequenceAccuracyRate: 100,
    workingMemoryScore: 100,
  },
  context: {
    operatorId: 'JURY-DEMO-FRESH',
    shiftType: 'morning',
    hoursSleptLastNight: 8,
    hoursWorkedToday: 2,
    caffeineIntake: 'low',
    subjectiveFatigueScore: 1,
  },
  cfi: {
    cfiScore: 16,
    impairmentTier: 'fit',
    subjectiveObjectiveDisparity: false,
    calculatedAt: new Date().toISOString(),
  },
};

export const SCENARIO_DEV_OVERWORK: DemoScenarioPackage = {
  pvt: {
    totalTrials: 6,
    validTrials: 5,
    meanReactionTimeMs: 362,
    medianReactionTimeMs: 350,
    responseSpeed: 2.76,
    attentionalLapseCount: 3,
    lapseRatePercent: 60,
    falseStartCount: 1,
    slowestTenPercentRT: 440,
    fastestTenPercentRT: 285,
    performanceIndex: 33.3,
  },
  stroop: {
    totalTrials: 8,
    accuracyRate: 75,
    meanCongruentRT: 340,
    meanIncongruentRT: 410,
    interferenceCostMs: 70,
    commissionErrors: 2,
    omissionErrors: 0,
    inhibitoryControlScore: 55,
  },
  motor: {
    totalTaps: 34,
    durationSeconds: 15,
    cadenceTapsPerSecond: 2.3,
    meanInterTapIntervalMs: 310,
    itiStandardDeviationMs: 24.2,
    fatigueDecaySlope: 0.45,
    neuromuscularSteadinessScore: 60,
  },
  corsi: {
    totalTrials: 4,
    correctTrials: 2,
    maxSpan: 4,
    sequenceAccuracyRate: 50,
    workingMemoryScore: 68,
  },
  context: {
    operatorId: 'DEV-OVERWORK',
    shiftType: 'night_graveyard',
    hoursSleptLastNight: 4,
    hoursWorkedToday: 11,
    caffeineIntake: 'high',
    subjectiveFatigueScore: 2,
  },
  cfi: {
    cfiScore: 72,
    impairmentTier: 'moderate_impairment',
    subjectiveObjectiveDisparity: true,
    calculatedAt: new Date().toISOString(),
  },
};

export const SCENARIO_DRIVER_CRITICAL: DemoScenarioPackage = {
  pvt: {
    totalTrials: 6,
    validTrials: 4,
    meanReactionTimeMs: 485,
    medianReactionTimeMs: 470,
    responseSpeed: 2.06,
    attentionalLapseCount: 4,
    lapseRatePercent: 80,
    falseStartCount: 2,
    slowestTenPercentRT: 620,
    fastestTenPercentRT: 340,
    performanceIndex: 0,
  },
  stroop: {
    totalTrials: 8,
    accuracyRate: 50,
    meanCongruentRT: 410,
    meanIncongruentRT: 520,
    interferenceCostMs: 110,
    commissionErrors: 3,
    omissionErrors: 1,
    inhibitoryControlScore: 30,
  },
  motor: {
    totalTaps: 22,
    durationSeconds: 15,
    cadenceTapsPerSecond: 1.5,
    meanInterTapIntervalMs: 440,
    itiStandardDeviationMs: 42.5,
    fatigueDecaySlope: 0.85,
    neuromuscularSteadinessScore: 35,
  },
  corsi: {
    totalTrials: 4,
    correctTrials: 1,
    maxSpan: 3,
    sequenceAccuracyRate: 25,
    workingMemoryScore: 35,
  },
  context: {
    operatorId: 'DRIVER-CRITICAL',
    shiftType: 'night_graveyard',
    hoursSleptLastNight: 3,
    hoursWorkedToday: 14,
    caffeineIntake: 'high',
    subjectiveFatigueScore: 5,
  },
  cfi: {
    cfiScore: 89,
    impairmentTier: 'critical_hazard',
    subjectiveObjectiveDisparity: false,
    calculatedAt: new Date().toISOString(),
  },
};

export interface JuryScenario {
  id: string;
  title: string;
  generate: () => DemoScenarioPackage;
}

export const JURY_SCENARIOS: JuryScenario[] = [
  { id: 'fresh', title: 'Pekerja Bugar', generate: () => SCENARIO_FRESH_WORKER },
  { id: 'overwork', title: 'Programmer Begadang', generate: () => SCENARIO_DEV_OVERWORK },
  { id: 'critical', title: 'Sopir Truk Kritis', generate: () => SCENARIO_DRIVER_CRITICAL },
];
