/**
 * Deterministic Local Clinical Rule Engine (Tier 3 Fallback)
 * Menghasilkan diagnosis keselamatan transportasi komersial yang presisi dan profesional.
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
  let headlineTitle = 'Kesiapan Mengemudi Prima';
  let primaryCause = 'Refleks Responsif & Kewaspadaan Normal';
  let shortSummary = 'Sistem saraf dan refleks berada dalam rentang optimal untuk bertugas.';
  let clinicalRationale = '';

  let riskIncrease = '0% (Stabil)';
  let trajectory = 'Kestabilan refleks normal dan siap bertugas.';
  let criticalAlert: string | null = null;

  let immediateAction = 'Pengemudi siap diberangkatkan untuk tugas solo sesuai jadwal.';
  let hydrationMl = 250;
  let screenBreakMins = 5;
  let circadianNote = 'Irama biologis dan kesiapan fisik berada pada kondisi ideal.';

  if (cfi.cfiScore >= 75 || pvt.attentionalLapseCount >= 4) {
    primaryType = 'sleep_deprived_microsleep';
    severityLevel = 'critical_hazard';
    headlineTitle = 'Peringatan: Risiko Tinggi Microsleep';
    primaryCause = `Defisit Atensi Akut (${pvt.attentionalLapseCount}x Kelengahan Reaksi)`;
    shortSummary = 'Terdeteksi perlambatan respons kritis; pengemudi wajib stand-down dan dilarang mengemudi.';
    clinicalRationale = `Sensor mendeteksi ${pvt.attentionalLapseCount} kali kelengahan atensi (>500 ms) dan perlambatan waktu reaksi signifikan. Kondisi ini sangat berbahaya untuk perjalanan tol jarak jauh dan meningkatkan risiko tabrak belakang.`;
    riskIncrease = '+65%';
    trajectory = 'Kewaspadaan visual menurun tajam; risiko tertidur sesaat (microsleep) di jalur tol sangat tinggi.';
    criticalAlert = 'PERINGATAN KRITIS: Pengemudi dilarang mengemudi (Stand-Down). Wajib istirahat/tidur pemulihan minimal 1–2 jam.';
    immediateAction = 'Segera lakukan rotasi supir pengganti dan arahkan pengemudi ke ruang istirahat.';
    hydrationMl = 400;
    screenBreakMins = 45;
    circadianNote = 'Tekanan kantuk biologis akumulatif berada pada tingkat kritis, wajib pemulihan tidur penuh.';
  } else if (cfi.cfiScore >= 55 || stroop.commissionErrors >= 2 || (corsi && corsi.workingMemoryScore < 50)) {
    primaryType = 'cognitive_overload';
    severityLevel = 'moderate_impairment';
    headlineTitle = 'Kelelahan Sedang: Butuh Co-Driver';
    primaryCause = 'Penurunan Kontrol Atensi & Beban Kognitif Tinggi';
    shortSummary = 'Kontrol fokus dan ketelitian menurun; wajib didampingi co-driver untuk rute tol/jarak jauh.';
    clinicalRationale = `Hasil uji Stroop dan memori kerja menunjukkan kelelahan kognitif dan penurunan kontrol atensi selektif. Risiko keterlambatan antisipasi bahaya di jalan tol meningkat.`;
    riskIncrease = '+35%';
    trajectory = 'Daya konsentrasi diproyeksikan menurun dalam 1–2 jam ke depan tanpa jeda istirahat teratur.';
    immediateAction = 'Tugaskan co-driver untuk berbagi kemudi, atau ambil istirahat minimal 30 menit sebelum berangkat.';
    hydrationMl = 350;
    screenBreakMins = 20;
    circadianNote = 'Jauhkan mata dari distraksi visual dan istirahatkan mental sejenak sebelum memasuki jalan tol.';
  } else if (cfi.cfiScore >= 30 || motor.itiStandardDeviationMs > 25) {
    primaryType = 'neuromuscular_exhaustion';
    severityLevel = 'mild_fatigue';
    headlineTitle = 'Kelelahan Ringan Terdeteksi';
    primaryCause = 'Fluktuasi Waktu Reaksi & Ketegangan Motorik Ringan';
    shortSummary = 'Terdeteksi penurunan ritme respons motorik ringan; lakukan peregangan fisik sebelum jalan.';
    clinicalRationale = `Irama ketukan motorik menunjukkan sedikit fluktuasi ketegangan otot. Refleks visual masih dalam batas aman, namun butuh peregangan fisik agar kestabilan kendali kemudi tetap prima.`;
    riskIncrease = '+15%';
    trajectory = 'Refleks dasar stabil, namun potensi kelelahan dapat terakumulasi setelah 2 jam berkendara.';
    immediateAction = 'Lakukan peregangan otot bahu dan lengan selama 5 menit, serta konsumsi air mineral.';
    hydrationMl = 300;
    screenBreakMins = 10;
    circadianNote = 'Pastikan posisi duduk ergonomis dan rencanakan singgah di rest area berkala.';
  } else {
    headlineTitle = 'Kesiapan Mengemudi Prima';
    primaryCause = 'Sistem Saraf & Koordinasi Motorik dalam Kondisi Bugar';
    shortSummary = `Refleks responsif (${Math.round(pvt.meanReactionTimeMs)} ms) tanpa indikasi defisit atensi.`;
    clinicalRationale = `Refleks sensorimotor Anda berada pada rentang prima (rerata ${Math.round(pvt.meanReactionTimeMs)} ms) tanpa adanya indikasi attentional lapses. Akurasi fokus dan koordinasi motorik menunjukkan kesiapan kerja tinggi untuk menangani tugas rute antarkota.`;
    riskIncrease = '0% (Stabil)';
    trajectory = 'Fokus tajam diproyeksikan bertahan stabil 3–4 jam ke depan didukung hidrasi berkala dan kepatuhan waktu istirahat standar.';
    immediateAction = 'Pengemudi siap diberangkatkan untuk tugas solo sesuai rute penugasan.';
    hydrationMl = 250;
    screenBreakMins = 5;
    circadianNote = 'Jam biologis dan kesiapan fisik berada pada kondisi ideal untuk operasional perjalanan.';
  }

  // Khusus kompensasi adrenalin semu (0 jam tidur / kerja maraton tapi refleks fisik cepat)
  if (cfi.subjectiveObjectiveDisparity && cfi.impairmentTier === 'mild_fatigue' && pvt.attentionalLapseCount < 2) {
    headlineTitle = 'Waspada: Kompensasi Adrenalin Semu';
    primaryCause = 'Defisit Tidur Ekstrem / Jam Kerja Maraton';
    shortSummary = 'Refleks tampak responsif terpicu adrenalin, namun risiko microsleep mendadak tinggi. Wajib Co-Driver.';
    clinicalRationale = 'Meskipun respons motorik dan refleks saat ini tampak cepat, riwayat tanpa tidur (0 jam) atau kerja maraton memicu kompensasi saraf semu. Tekanan biologis kantuk (akumulasi adenosin) sangat tinggi dan rentan memicu kolaps fokus mendadak di jalan tol.';
    immediateAction = 'Wajib didampingi co-driver untuk berbagi kemudi, dan jadwalkan istirahat tidur setelah 1-2 jam perjalanan.';
    riskIncrease = '+25%';
    circadianNote = 'Hutang tidur biologis tinggi. Jangan biarkan pengemudi mengemudi sendirian tanpa pengawas.';
  }

  const rtSec = pvt.meanReactionTimeMs / 1000;
  const brakingDistanceMeters = parseFloat((rtSec * 27.78).toFixed(1));
  const brakingHazardDeltaMeters = parseFloat(Math.max(0, brakingDistanceMeters - 6.9).toFixed(1));
  const microsleepRisk: 'rendah' | 'waspada' | 'kritis' =
    pvt.attentionalLapseCount >= 4 || cfi.cfiScore >= 70 ? 'kritis' :
    pvt.attentionalLapseCount >= 2 || cfi.cfiScore >= 45 ? 'waspada' : 'rendah';
  const dispatcherRecommendation: 'siap_solo' | 'wajib_co_driver' | 'stand_down' =
    cfi.impairmentTier === 'critical_hazard' || microsleepRisk === 'kritis' ? 'stand_down' :
    cfi.impairmentTier === 'mild_fatigue' || microsleepRisk === 'waspada' ? 'wajib_co_driver' : 'siap_solo';

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
    travelSafety: {
      brakingDistanceMeters,
      brakingHazardDeltaMeters,
      highwayMicrosleepRisk: microsleepRisk,
      highwayHypnosisSusceptibility:
        microsleepRisk === 'kritis'
          ? 'Kerentanan sangat tinggi terhadap hipnosis tol lurus, refleks pengereman terancam hilang.'
          : microsleepRisk === 'waspada'
          ? 'Cenderung mengalami kelengahan pada medan tol monoton setelah 1 jam berkendara.'
          : 'Daya atensi stabil dalam mengantisipasi dinamika jalur bebas hambatan.',
      routeCompatibility:
        dispatcherRecommendation === 'stand_down'
          ? 'Tidak laik rute. Wajib istirahat tidur sebelum jadwal berikutnya.'
          : dispatcherRecommendation === 'wajib_co_driver'
          ? 'Hanya direkomendasikan untuk rute pendek dengan pendampingan co-driver.'
          : 'Sangat cocok untuk penugasan rute antarkota reguler maupun tol jarak jauh.',
      dispatcherRecommendation,
      restAreaProtocol:
        dispatcherRecommendation === 'stand_down'
          ? 'Segera parkir di rest area terdekat dan tidur minimal 90 menit.'
          : dispatcherRecommendation === 'wajib_co_driver'
          ? 'Wajib pergantian supir tiap 2 jam atau singgah di rest area KM terdekat.'
          : 'Istirahat berkala standar setiap 3-4 jam perjalanan.',
    },
    aiEngineVersion: 'gemini-3.5-flash-lite',
    isFallback: true,
  };
}
