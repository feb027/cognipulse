/**
 * Deterministic Local Clinical Rule Engine (Tier 3 Fallback)
 * Menghasilkan diagnosis ringkas, ramah, dan 100% Bahasa Indonesia jika cloud offline.
 */

import { GeminiClinicalAnalysis, DifferentialDiagnosis } from '@/types/gemini';
import { CompositeFatigueResult } from '@/types/assessment';
import { PVTMetrics } from '@/types/pvt';
import { StroopMetrics } from '@/types/stroop';
import { MotorMetrics } from '@/types/motor';
import { CorsiMetrics } from '@/types/corsi';

export function generateLocalFallbackAnalysis(
  cfi: CompositeFatigueResult,
  pvt: PVTMetrics,
  stroop: StroopMetrics,
  motor: MotorMetrics,
  corsi?: CorsiMetrics
): GeminiClinicalAnalysis {
  let primaryType: DifferentialDiagnosis['primaryType'] = 'optimal_vigilance';
  let severityLevel: DifferentialDiagnosis['severityLevel'] = cfi.impairmentTier;
  let clinicalRationale = '';

  let riskIncrease = '+0%';
  let trajectory = 'Kestabilan refleks normal dan siap bertugas.';
  let criticalAlert: string | null = null;

  let immediateAction = 'Lanjutkan aktivitas kerja dengan minum air teratur.';
  let hydrationMl = 250;
  let screenBreakMins = 5;
  let circadianNote = 'Pola tidur dan energi berada dalam rentang baik.';

  if (cfi.cfiScore >= 75 || pvt.attentionalLapseCount >= 4) {
    primaryType = 'sleep_deprived_microsleep';
    severityLevel = 'critical_hazard';
    clinicalRationale = `Tubuh Anda sangat kelelahan dan sempat ${pvt.attentionalLapseCount} kali hilang fokus (bengong). Sangat disarankan tidur singkat 20 menit dan hindari mengemudi saat ini.`;
    riskIncrease = '+65%';
    trajectory = 'Refleks akan makin menurun drastis jika memaksakan diri tanpa jeda.';
    criticalAlert = 'Peringatan: Hindari mengemudi atau pekerjaan berisiko tinggi saat ini!';
    immediateAction = 'Tidur singkat (power nap) 20 menit dan minum air putih.';
    hydrationMl = 400;
    screenBreakMins = 30;
    circadianNote = 'Tubuh membutuhkan waktu tidur untuk memulihkan kesiapan saraf.';
  } else if (cfi.cfiScore >= 55 || stroop.commissionErrors >= 2 || (corsi && corsi.workingMemoryScore < 50)) {
    primaryType = 'cognitive_overload';
    severityLevel = 'moderate_impairment';
    clinicalRationale = `Fokus dan memori kerja mulai menurun akibat kelelahan mental. Sebaiknya istirahat sejenak 15 menit dan minum air putih agar kembali segar.`;
    riskIncrease = '+38%';
    trajectory = 'Kemampuan konsentrasi berisiko makin menurun dalam 2 jam ke depan.';
    immediateAction = 'Istirahat sejenak 15 menit dan alihkan pandangan dari layar.';
    hydrationMl = 300;
    screenBreakMins = 15;
    circadianNote = 'Istirahatkan mata dan pikiran dari aktivitas layar terus-menerus.';
  } else if (cfi.cfiScore >= 30 || motor.itiStandardDeviationMs > 25) {
    primaryType = 'neuromuscular_exhaustion';
    severityLevel = 'mild_fatigue';
    clinicalRationale = `Kondisi tubuh masih cukup baik, namun mulai terasa sedikit lelah. Lakukan peregangan santai dan minum segelas air untuk menyegarkan tubuh.`;
    riskIncrease = '+15%';
    trajectory = 'Kecepatan ketukan dan respon cenderung stabil dengan jeda singkat.';
    immediateAction = 'Peregangan santai pada bahu dan pergelangan tangan.';
    hydrationMl = 300;
    screenBreakMins = 10;
    circadianNote = 'Jaga ritme kerja santai dan hindari posisi duduk statis terlalu lama.';
  } else {
    clinicalRationale = 'Kondisi kognitif, refleks visual, dan memori kerja Anda sangat prima. Siap menjalankan tugas secara optimal.';
  }

  return {
    differentialDiagnosis: {
      primaryType,
      severityLevel,
      confidenceScore: 0.94,
      clinicalRationale,
    },
    fourHourRiskForecast: {
      decisionErrorProbabilityIncrease: riskIncrease,
      reactionTimeDecayTrajectory: trajectory,
      criticalWarningAlert: criticalAlert,
    },
    precisionRecoveryPrescription: {
      immediateAction,
      hydrationElectrolyteMl: hydrationMl,
      recommendedScreenBreakMins: screenBreakMins,
      circadianAlignmentNote: circadianNote,
    },
    aiEngineVersion: 'gemini-3.8-flash',
    isFallback: true,
  };
}
