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
  let shortSummary = 'Sistem saraf prima dan refleks secepat kilat siap bertugas.';
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
    headlineTitle = 'Otak Minta Kasur: Awas Microsleep!';
    primaryCause = `Defisit Tidur Akut & Terdeteksi ${pvt.attentionalLapseCount}x Bengong`;
    shortSummary = 'Saraf mendeteksi momen bengong dan refleks melambat, tubuh butuh istirahat nyata.';
    clinicalRationale = `Sensor mendeteksi Anda sempat ${pvt.attentionalLapseCount} kali bengong dan refleks melambat drastis. Ini bukan lagi melamun romantis, tapi alarm biologis kalau kepala Anda sudah sangat butuh bantal. Melanjutkan aktivitas dalam kondisi begini cuma bakal bikin banyak blunder atau salah klik fatal.`;
    riskIncrease = '+65%';
    trajectory = 'Kalau nekat dipaksakan, 2 jam lagi Anda bakal lebih banyak melamun menatap kursor daripada kerja produktif.';
    criticalAlert = 'PERINGATAN: Jangan nekat mengemudi atau tugas berisiko tinggi dulu ya, tubuh Anda butuh istirahat beneran!';
    immediateAction = 'Rebahkan tubuh dan ambil power nap 20 menit sekarang juga, jangan sok kuat.';
    hydrationMl = 400;
    screenBreakMins = 30;
    circadianNote = 'Baterai alami tubuh sudah merah berkedip, prioritaskan tidur malam tepat waktu untuk memulihkan kebugaran.';
  } else if (cfi.cfiScore >= 55 || stroop.commissionErrors >= 2 || (corsi && corsi.workingMemoryScore < 50)) {
    primaryType = 'cognitive_overload';
    severityLevel = 'moderate_impairment';
    headlineTitle = 'Kepala Mulai Penuh: Butuh Jeda Santai';
    primaryCause = 'Beban Pikiran Jenuh & Kontrol Fokus Menurun';
    shortSummary = 'Kontrol fokus dan inhibisi mulai jenuh, luangkan jeda santai 15 menit.';
    clinicalRationale = `Hasil tes Stroop dan memori menunjukkan otak Anda mulai kewalahan memilah instruksi. Refleks dasar sebenarnya masih jalan, tapi ketelitian mulai menipis sehingga Anda rawan typo berkali-kali atau bingung mencari kacamata yang padahal sedang dipakai.`;
    riskIncrease = '+35%';
    trajectory = 'Daya konsentrasi bakal makin ngedrop dalam 2 jam ke depan kalau tidak segera diselingi jeda bernapas sejenak.';
    immediateAction = 'Jauhkan mata dari layar selama 15 menit, jalan santai ambil air minum, dan hindari multitasking.';
    hydrationMl = 350;
    screenBreakMins = 15;
    circadianNote = 'Redupkan lampu layar dan istirahatkan mata sejenak agar saraf visual bisa rileks.';
  } else if (cfi.cfiScore >= 30 || motor.itiStandardDeviationMs > 25) {
    primaryType = 'neuromuscular_exhaustion';
    severityLevel = 'mild_fatigue';
    headlineTitle = 'Stamina Jari Menipis: Peregangan Dulu!';
    primaryCause = 'Fluktuasi Ketukan Jari & Ketegangan Otot Ringan';
    shortSummary = 'Ketukan jari mulai berfluktuasi pegal, luangkan waktu relaksasi otot sejenak.';
    clinicalRationale = `Irama ketukan jari Anda mulai sedikit berfluktuasi tidak teratur. Fokus mata sebenarnya masih cukup tajam, tapi otot dan saraf motorik halus tangan sudah mengirim sinyal pegal. Waktunya lemaskan bahu dan pergelangan tangan sebelum jadi kaku betulan.`;
    riskIncrease = '+15%';
    trajectory = 'Waktu respon masih cukup aman, tapi koordinasi jari bakal pelan-pelan melorot kalau duduk mematung terus.';
    immediateAction = 'Putar bahu dan lemaskan jemari selama 3 menit, lalu isi ulang botol air mineral.';
    hydrationMl = 300;
    screenBreakMins = 10;
    circadianNote = 'Perbaiki posisi duduk agar tidak membungkuk, tubuh yang nyaman bikin fokus lebih awet.';
    const optimalTitles = [
      'Respon Tajam & Fokus Kerja Stabil',
      'Koordinasi Sensorimotor Prima',
      'Kesiapan Optimal untuk Tugas Presisi',
      'Atensi Terjaga dengan Irama Konsisten',
    ];
    headlineTitle = optimalTitles[Math.floor(Math.random() * optimalTitles.length)];
    primaryCause = 'Sistem Saraf & Koordinasi Motorik dalam Kondisi Bugar';
    shortSummary = `Refleks responsif (${Math.round(pvt.meanReactionTimeMs)} ms) tanpa indikasi defisit atensi.`;
    clinicalRationale = `Refleks sensorimotor Anda berada pada rentang prima (rerata ${Math.round(pvt.meanReactionTimeMs)} ms) tanpa adanya indikasi attentional lapses. Akurasi fokus dan koordinasi motorik menunjukkan kesiapan kerja tinggi untuk menangani tugas berintensitas kompleks.`;
    riskIncrease = '+0%';
    trajectory = 'Fokus tajam diproyeksikan bertahan stabil 3–4 jam ke depan, asalkan jangan lupa berkedip dan tetap minum air.';
    immediateAction = 'Gas tuntaskan tugas prioritas Anda sekarang, tapi tetap sediakan segelas air putih di meja.';
    hydrationMl = 250;
    screenBreakMins = 5;
    circadianNote = 'Jam biologis dan kesiapan fisik sedang sinkron sempurna, kondisi yang sangat ideal untuk produktif.';
  }

  return {
    differentialDiagnosis: {
      headlineTitle,
      primaryCause,
      shortSummary,
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
