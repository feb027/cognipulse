/**
 * Cognitive Fatigue Index (CFI) Composite Aggregator
 * Mengintegrasikan telemetri PVT, Stroop, Motor Cadence, Corsi Working Memory, dan beban fisik.
 */

import { PVTMetrics } from '@/types/pvt';
import { StroopMetrics } from '@/types/stroop';
import { MotorMetrics } from '@/types/motor';
import { CorsiMetrics } from '@/types/corsi';
import { UserContext, CompositeFatigueResult, ImpairmentTier } from '@/types/assessment';

export function calculateCompositeFatigueIndex(
  pvt: PVTMetrics,
  stroop: StroopMetrics,
  motor: MotorMetrics,
  context?: UserContext,
  corsi?: CorsiMetrics
): CompositeFatigueResult {
  // 1. PVT Sub-Score: Lapses dan Kecepatan Respon
  const speedDeficit = Math.max(0, 4.5 - pvt.responseSpeed) * 20;
  const lapseDeficit = pvt.attentionalLapseCount * 18;
  const falseStartDeficit = pvt.falseStartCount * 8;
  const pvtFatigue = Math.min(100, Math.round(speedDeficit + lapseDeficit + falseStartDeficit));

  // 2. Stroop Sub-Score: Inhibisi Kognitif & Akurasi
  const stroopFatigue = Math.min(100, Math.round(100 - stroop.inhibitoryControlScore));

  // 3. Motor Sub-Score: Tremor / Jitter & Cadence Decay
  const jitterPenalty = Math.max(0, motor.itiStandardDeviationMs - 15) * 2.5;
  const motorFatigue = Math.min(100, Math.round((100 - motor.neuromuscularSteadinessScore) + jitterPenalty));

  // 4. Corsi Sub-Score (Memori Kerja Spasial): Penurunan kapasitas rentang memori
  const corsiFatigue = corsi ? Math.min(100, Math.round(100 - corsi.workingMemoryScore)) : 0;

  // 5. Contextual Modifier: Defisit tidur, jam kerja & beban fisik
  let contextModifier = 0;
  if (context) {
    if (context.hoursSleptLastNight < 6) {
      contextModifier += (6 - context.hoursSleptLastNight) * 8;
    }
    if (context.hoursWorkedToday > 7) {
      contextModifier += (context.hoursWorkedToday - 7) * 6;
    }
    if (context.heavyPhysicalLabor) {
      contextModifier += 18; // Beban kerja otot & energi setelah angkat beban berat
    }
    if (context.shiftType === 'night_graveyard') {
      contextModifier += 12; // Titik nadir sirkadian larut malam
    }
  }
  const boundedContext = Math.min(100, contextModifier);

  // Komposit CFI (0 - 100)
  const weightedCFI = corsi
    ? pvtFatigue * 0.30 + stroopFatigue * 0.20 + motorFatigue * 0.20 + corsiFatigue * 0.15 + boundedContext * 0.15
    : pvtFatigue * 0.35 + stroopFatigue * 0.25 + motorFatigue * 0.25 + boundedContext * 0.15;

  const cfiScore = Math.max(0, Math.min(100, Math.round(weightedCFI)));

  // Tentukan Impairment Tier
  let impairmentTier: ImpairmentTier = 'fit';
  if (cfiScore >= 70) {
    impairmentTier = 'critical_hazard';
  } else if (cfiScore >= 45) {
    impairmentTier = 'moderate_impairment';
  } else if (cfiScore >= 25) {
    impairmentTier = 'mild_fatigue';
  }

  // Deteksi Silent Fatigue / Adrenaline Masking Sehabis Mandi
  let subjectiveObjectiveDisparity = false;
  const hasHeavyExertion = Boolean(context?.heavyPhysicalLabor && (context?.hoursWorkedToday ?? 0) >= 7);
  if (context && context.subjectiveFatigueScore <= 2 && (cfiScore >= 40 || hasHeavyExertion)) {
    subjectiveObjectiveDisparity = true;
  }

  return {
    cfiScore,
    impairmentTier,
    subjectiveObjectiveDisparity,
    calculatedAt: new Date().toISOString(),
  };
}
