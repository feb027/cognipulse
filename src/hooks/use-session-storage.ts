/**
 * Hook: useSessionStorage
 * Penyimpanan Local-First (UU PDP compliance) untuk riwayat tes kognitif, tren, dan kalibrasi perangkat.
 */

import { useState, useEffect } from 'react';
import { CompositeFatigueResult } from '@/types/assessment';
import { GeminiClinicalAnalysis } from '@/types/gemini';
import { PVTMetrics } from '@/types/pvt';
import { StroopMetrics } from '@/types/stroop';
import { MotorMetrics } from '@/types/motor';
import { CorsiMetrics } from '@/types/corsi';

export interface StoredSession {
  id: string;
  timestamp: string;
  cfi: CompositeFatigueResult;
  analysis: GeminiClinicalAnalysis;
  pvt?: PVTMetrics;
  stroop?: StroopMetrics;
  motor?: MotorMetrics;
  corsi?: CorsiMetrics;
}

const STORAGE_KEY = 'cognipulse_session_history';
const BASELINE_KEY = 'cognipulse_device_baseline_ms';

export const DEFAULT_SEEDED_HISTORY: StoredSession[] = [
  {
    id: 'seed-01',
    timestamp: '2026-09-28T08:30:00Z',
    cfi: { cfiScore: 22, impairmentTier: 'fit', subjectiveObjectiveDisparity: false, calculatedAt: '2026-09-28T08:30:00Z' },
    analysis: {
      differentialDiagnosis: { headlineTitle: 'Kesiapan Prima: Fokus & Refleks Cepat', primaryCause: 'Istirahat Malam Cukup & Sistem Saraf Segar', primaryType: 'optimal_vigilance', severityLevel: 'fit', confidenceScore: 0.96, clinicalRationale: 'Status kognitif prima setelah istirahat malam 7.5 jam.' },
      fourHourRiskForecast: { decisionErrorProbabilityIncrease: '+0%', reactionTimeDecayTrajectory: 'Stabil', criticalWarningAlert: null },
      precisionRecoveryPrescription: { immediateAction: 'Pertahankan ritme kerja produktif.', hydrationElectrolyteMl: 250, recommendedScreenBreakMins: 5, circadianAlignmentNote: 'Jendela kortisol pagi optimal.' },
      aiEngineVersion: 'gemini-3.8-flash',
      isFallback: false,
    },
    pvt: { totalTrials: 10, validTrials: 10, attentionalLapseCount: 0, falseStartCount: 0, meanReactionTimeMs: 215, medianReactionTimeMs: 212, responseSpeed: 4.65, lapseRatePercent: 0, slowestTenPercentRT: 245, fastestTenPercentRT: 195, performanceIndex: 100 },
    stroop: { totalTrials: 8, accuracyRate: 100, meanCongruentRT: 240, meanIncongruentRT: 290, interferenceCostMs: 50, inhibitoryControlScore: 95, commissionErrors: 0, omissionErrors: 0 },
    motor: { totalTaps: 48, durationSeconds: 10, cadenceTapsPerSecond: 4.8, meanInterTapIntervalMs: 208, itiStandardDeviationMs: 14, neuromuscularSteadinessScore: 96, fatigueDecaySlope: -0.005 },
  },
  {
    id: 'seed-02',
    timestamp: '2026-09-29T14:15:00Z',
    cfi: { cfiScore: 48, impairmentTier: 'mild_fatigue', subjectiveObjectiveDisparity: false, calculatedAt: '2026-09-29T14:15:00Z' },
    analysis: {
      differentialDiagnosis: { headlineTitle: 'Lelah Ringan: Dip Sirkadian Siang', primaryCause: 'Ketegangan Otot Motorik & Ngantuk Pasca Makan', primaryType: 'neuromuscular_exhaustion', severityLevel: 'mild_fatigue', confidenceScore: 0.92, clinicalRationale: 'Dip sirkadian pasca makan siang dan ketegangan otot motorik.' },
      fourHourRiskForecast: { decisionErrorProbabilityIncrease: '+18%', reactionTimeDecayTrajectory: 'Sedikit melambat', criticalWarningAlert: null },
      precisionRecoveryPrescription: { immediateAction: 'Peregangan fisik 5 menit & hidrasi.', hydrationElectrolyteMl: 300, recommendedScreenBreakMins: 10, circadianAlignmentNote: 'Post-prandial dip sirkadian normal.' },
      aiEngineVersion: 'gemini-3.8-flash',
      isFallback: false,
    },
    pvt: { totalTrials: 10, validTrials: 10, attentionalLapseCount: 1, falseStartCount: 0, meanReactionTimeMs: 310, medianReactionTimeMs: 300, responseSpeed: 3.22, lapseRatePercent: 10, slowestTenPercentRT: 380, fastestTenPercentRT: 250, performanceIndex: 78 },
    stroop: { totalTrials: 8, accuracyRate: 87.5, meanCongruentRT: 280, meanIncongruentRT: 370, interferenceCostMs: 90, inhibitoryControlScore: 82, commissionErrors: 1, omissionErrors: 0 },
    motor: { totalTaps: 40, durationSeconds: 10, cadenceTapsPerSecond: 4.0, meanInterTapIntervalMs: 250, itiStandardDeviationMs: 26, neuromuscularSteadinessScore: 78, fatigueDecaySlope: -0.018 },
  },
  {
    id: 'seed-03',
    timestamp: '2026-09-29T23:45:00Z',
    cfi: { cfiScore: 78, impairmentTier: 'critical_hazard', subjectiveObjectiveDisparity: true, calculatedAt: '2026-09-29T23:45:00Z' },
    analysis: {
      differentialDiagnosis: { headlineTitle: 'Kelelahan Kritis: Rawan Micro-Sleep', primaryCause: 'Lembur 10 Jam & Lapses Meningkat', primaryType: 'sleep_deprived_microsleep', severityLevel: 'critical_hazard', confidenceScore: 0.98, clinicalRationale: 'Akumulasi adenosin tinggi akibat lembur 10 jam. Lapses meningkat tajam.' },
      fourHourRiskForecast: { decisionErrorProbabilityIncrease: '+62%', reactionTimeDecayTrajectory: 'Degradasi curam', criticalWarningAlert: 'Hentikan aktivitas berisiko!' },
      precisionRecoveryPrescription: { immediateAction: 'Tidur pemulihan segera minimal 7 jam.', hydrationElectrolyteMl: 350, recommendedScreenBreakMins: 30, circadianAlignmentNote: 'Melatonin memuncak; sistem motorik melambat drastis.' },
      aiEngineVersion: 'gemini-3.8-flash',
      isFallback: false,
    },
    pvt: { totalTrials: 10, validTrials: 9, attentionalLapseCount: 4, falseStartCount: 1, meanReactionTimeMs: 440, medianReactionTimeMs: 420, responseSpeed: 2.27, lapseRatePercent: 40, slowestTenPercentRT: 520, fastestTenPercentRT: 310, performanceIndex: 38 },
    stroop: { totalTrials: 8, accuracyRate: 62.5, meanCongruentRT: 340, meanIncongruentRT: 510, interferenceCostMs: 170, inhibitoryControlScore: 52, commissionErrors: 3, omissionErrors: 0 },
    motor: { totalTaps: 32, durationSeconds: 10, cadenceTapsPerSecond: 3.2, meanInterTapIntervalMs: 312, itiStandardDeviationMs: 42, neuromuscularSteadinessScore: 50, fatigueDecaySlope: -0.035 },
  },
];

export function useSessionHistory() {
  const [history, setHistory] = useState<StoredSession[]>([]);
  const [deviceBaselineMs, setDeviceBaselineMs] = useState<number>(230);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setHistory(JSON.parse(stored));
      } else {
        setHistory([]);
      }

      const baseline = localStorage.getItem(BASELINE_KEY);
      if (baseline) {
        setDeviceBaselineMs(Number(baseline));
      }
    } catch {}
  }, []);

  const saveSession = (
    cfi: CompositeFatigueResult,
    analysis: GeminiClinicalAnalysis,
    pvt?: PVTMetrics,
    stroop?: StroopMetrics,
    motor?: MotorMetrics,
    corsi?: CorsiMetrics
  ) => {
    const newSession: StoredSession = {
      id: `sess-${Date.now()}`,
      timestamp: new Date().toISOString(),
      cfi,
      analysis,
      pvt,
      stroop,
      motor,
      corsi,
    };

    const updated = [newSession, ...history];
    setHistory(updated);

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {}
  };

  const clearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  };

  const seedDemoHistory = () => {
    setHistory(DEFAULT_SEEDED_HISTORY);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SEEDED_HISTORY));
    } catch {}
  };

  const updateBaseline = (ms: number) => {
    setDeviceBaselineMs(ms);
    try {
      localStorage.setItem(BASELINE_KEY, String(ms));
    } catch {}
  };

  return { history, saveSession, clearHistory, seedDemoHistory, deviceBaselineMs, updateBaseline };
}
