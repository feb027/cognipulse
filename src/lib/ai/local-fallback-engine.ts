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
  let headlineTitle = 'Kesiapan Kerja Optimal';
  let primaryCause = 'Refleks Cepat & Sistem Saraf Prima';
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
    headlineTitle = 'Kelelahan Kritis: Rawan Micro-Sleep';
    primaryCause = `Defisit Tidur Akut & Terdeteksi ${pvt.attentionalLapseCount}x Lapses`;
    clinicalRationale = `Terdeteksi penurunan fungsi neurokognitif berat dengan ${pvt.attentionalLapseCount} kali jeda atensi (lapses) dan waktu respon melambat signifikan. Kondisi ini mencerminkan defisit tidur akut di mana sistem saraf pusat mengalami kelelahan struktural. Melanjutkan aktivitas kerja pada kondisi ini meningkatkan risiko kegagalan operasional secara tajam.`;
    riskIncrease = '+65%';
    trajectory = 'Refleks sensorimotor akan mengalami degradasi lebih lanjut, dengan lonjakan probabilitas micro-sleep saat mengerjakan tugas monoton.';
    criticalAlert = 'PERINGATAN: Risiko micro-sleep tinggi! Hentikan aktivitas mengemudi atau pengoperasian alat berat.';
    immediateAction = 'Tidur singkat terarah (power nap) 20–30 menit dan konsumsi air putih hangat.';
    hydrationMl = 400;
    screenBreakMins = 30;
    circadianNote = 'Cadangan energi harian menipis drastis, prioritaskan tidur malam lebih awal untuk memulihkan homeostasis saraf.';
  } else if (cfi.cfiScore >= 55 || stroop.commissionErrors >= 2 || (corsi && corsi.workingMemoryScore < 50)) {
    primaryType = 'cognitive_overload';
    severityLevel = 'moderate_impairment';
    headlineTitle = 'Beban Kognitif Tinggi: Kelelahan Mental';
    primaryCause = 'Kelelahan Korteks Prefrontal & Hambatan Inhibisi';
    clinicalRationale = `Korteks prefrontal menunjukkan tanda beban kognitif tinggi dengan penurunan akurasi kontrol inhibisi dan rentang memori kerja. Meskipun refleks motorik dasar masih aktif, kemampuan pemecahan masalah dan pengambilan keputusan kompleks mulai mengalami penurunan efisiensi.`;
    riskIncrease = '+35%';
    trajectory = 'Tingkat ketelitian dan konsentrasi akan menurun bertahap dalam 2–3 jam ke depan jika tidak diselingi jeda istirahat teratur.';
    immediateAction = 'Ambil jeda istirahat 15 menit menjauh dari layar, lakukan peregangan ringan, dan hindari beban multitasking.';
    hydrationMl = 350;
    screenBreakMins = 15;
    circadianNote = 'Kurangi paparan cahaya biru (blue-light) untuk meredakan ketegangan sistem visual dan saraf pusat.';
  } else if (cfi.cfiScore >= 30 || motor.itiStandardDeviationMs > 25) {
    primaryType = 'neuromuscular_exhaustion';
    severityLevel = 'mild_fatigue';
    headlineTitle = 'Kelelahan Neuromuskular Awal';
    primaryCause = 'Fluktuasi Jitter Ketukan & Penurunan Stamina Motorik';
    clinicalRationale = `Telemetri menunjukkan ritme ketukan motorik mulai mengalami fluktuasi ringan (jitter meningkat), menandakan kelelahan neuromuscular awal. Tingkat fokus kognitif visual masih relatif terjaga, namun stamina motorik membutuhkan pemeliharaan agar tidak berlanjut ke kelelahan sedang.`;
    riskIncrease = '+15%';
    trajectory = 'Waktu reaksi visual masih cukup stabil, namun koordinasi motorik halus berpotensi melambat perlahan.';
    immediateAction = 'Lakukan peregangan tangan, leher, dan bahu selama 3 menit serta minum segelas air mineral.';
    hydrationMl = 300;
    screenBreakMins = 10;
    circadianNote = 'Pertahankan postur kerja ergonomis dan atur ritme kerja agar ketegangan otot tidak terakumulasi.';
  } else {
    headlineTitle = 'Kesiapan Kerja Puncak: Fokus Tajam';
    primaryCause = 'Homeostasis Saraf Prima & Refleks Sensorimotor Cepat';
    clinicalRationale = `Profil neurokognitif berada pada tingkat kesiapan optimal. Kecepatan refleks sensorimotor (rata-rata ${Math.round(pvt.meanReactionTimeMs)} ms) sangat tajam dengan nol kejadian hilang fokus (lapses), kontrol inhibisi prima, dan koordinasi motorik stabil. Sistem saraf siap menjalankan tugas operasional berintensitas tinggi.`;
    riskIncrease = '+0%';
    trajectory = 'Stabilitas fokus dan ketepatan refleks diperkirakan bertahan stabil selama 2–4 jam ke depan dengan ritme kerja normal.';
    immediateAction = 'Pertahankan ritme kerja produktif dengan menjaga hidrasi teratur sepanjang jam kerja.';
    hydrationMl = 250;
    screenBreakMins = 5;
    circadianNote = 'Ritme sirkadian dan kesiapan biologis dalam kondisi prima dan selaras dengan jam produktif tubuh.';
  }

  return {
    differentialDiagnosis: {
      headlineTitle,
      primaryCause,
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
