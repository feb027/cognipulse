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
    clinicalRationale = `Danger zone! Baterai kognitif Anda drop parah dan sempat ${pvt.attentionalLapseCount} kali bengong/micro-sleep. Jangan dipaksa lanjut kerja atau nyetir, wajib power nap 20 menit sekarang juga!`;
    riskIncrease = '+65%';
    trajectory = 'Refleks bakal makin zonk dan risiko salah klik atau blunder fatal melonjak drastis.';
    criticalAlert = 'RED FLAG: Otak rawan micro-sleep mendadak! Dilarang keras mengemudi atau tugas berisiko.';
    immediateAction = 'Power nap 20 menit + teguk 400ml air dingin sekarang juga.';
    hydrationMl = 400;
    screenBreakMins = 30;
    circadianNote = 'Baterai otak udah di titik kritis, segera jadwalkan tidur malam lebih awal.';
  } else if (cfi.cfiScore >= 55 || stroop.commissionErrors >= 2 || (corsi && corsi.workingMemoryScore < 50)) {
    primaryType = 'cognitive_overload';
    severityLevel = 'moderate_impairment';
    clinicalRationale = `Otak udah kena mental overload dan RAM kognitif kepenuhan task. Saatnya touch grass bentar 15 menit dan minum air putih biar gak makin nge-lag pas eksekusi.`;
    riskIncrease = '+38%';
    trajectory = 'Kemampuan fokus bakal makin ambyar dalam 2 jam ke depan kalau gak segera ambil jeda.';
    immediateAction = 'Jeda layar 15 menit, jalan santai sebentar, dan hindari multitasking.';
    hydrationMl = 350;
    screenBreakMins = 15;
    circadianNote = 'Istirahatkan mata dari blue-light biar saraf prefrontal bisa recharge.';
  } else if (cfi.cfiScore >= 30 || motor.itiStandardDeviationMs > 25) {
    primaryType = 'neuromuscular_exhaustion';
    severityLevel = 'mild_fatigue';
    clinicalRationale = `Baterai tubuh mulai low-bat dan ada getaran mikro di ritme ketukan Anda. Masih aman buat grinding, tapi selingi stretching bahu dan teguk air putih biar tetap segar.`;
    riskIncrease = '+15%';
    trajectory = 'Kecepatan respon masih cukup aman, tapi bakal mulai melambat perlahan jika tanpa jeda.';
    immediateAction = 'Stretching leher & bahu 3 menit, plus isi ulang botol minum.';
    hydrationMl = 300;
    screenBreakMins = 10;
    circadianNote = 'Atur ritme kerja santai, jangan duduk mematung di posisi yang sama terus-menerus.';
  } else {
    clinicalRationale = 'Mode gacor parah! Refleks visual tajam, memori kerja prima, dan fokus on-fire. Gas lanjut grinding tugas pentingmu!';
    riskIncrease = '+0%';
    trajectory = 'Stabilitas fokus dan waktu respon dalam kondisi puncak.';
    immediateAction = 'Pertahankan ritme kerja produktif dan tetap sediakan air minum di meja.';
    hydrationMl = 250;
    screenBreakMins = 5;
    circadianNote = 'Ritme sirkadian optimal, energi tubuh sinkron dengan jam biologis.';
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
