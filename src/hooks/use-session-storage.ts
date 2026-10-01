/**
 * Hook: useSessionStorage
 * Penyimpanan Local-First (UU PDP compliance) untuk riwayat tes kognitif, tren, dan kalibrasi perangkat.
 */

import { useState, useEffect } from 'react';
import { CompositeFatigueResult } from '@/types/assessment';
import { GeminiClinicalAnalysis } from '@/types/gemini';

export interface StoredSession {
  id: string;
  timestamp: string;
  cfi: CompositeFatigueResult;
  analysis: GeminiClinicalAnalysis;
}

const STORAGE_KEY = 'cognipulse_session_history';
const BASELINE_KEY = 'cognipulse_device_baseline_ms';

export const DEFAULT_SEEDED_HISTORY: StoredSession[] = [
  {
    id: 'seed-01',
    timestamp: '2026-09-28T08:30:00Z',
    cfi: { cfiScore: 22, impairmentTier: 'fit', subjectiveObjectiveDisparity: false, calculatedAt: '2026-09-28T08:30:00Z' },
    analysis: {
      differentialDiagnosis: { primaryType: 'optimal_vigilance', severityLevel: 'fit', confidenceScore: 0.96, clinicalRationale: 'Status kognitif prima setelah istirahat malam 7.5 jam.' },
      fourHourRiskForecast: { decisionErrorProbabilityIncrease: '+0%', reactionTimeDecayTrajectory: 'Stabil', criticalWarningAlert: null },
      precisionRecoveryPrescription: { immediateAction: 'Pertahankan ritme kerja produktif.', hydrationElectrolyteMl: 250, recommendedScreenBreakMins: 5, circadianAlignmentNote: 'Jendela kortisol pagi optimal.' },
      aiEngineVersion: 'gemini-3.8-flash',
      isFallback: false,
    },
  },
  {
    id: 'seed-02',
    timestamp: '2026-09-29T14:15:00Z',
    cfi: { cfiScore: 48, impairmentTier: 'mild_fatigue', subjectiveObjectiveDisparity: false, calculatedAt: '2026-09-29T14:15:00Z' },
    analysis: {
      differentialDiagnosis: { primaryType: 'neuromuscular_exhaustion', severityLevel: 'mild_fatigue', confidenceScore: 0.92, clinicalRationale: 'Dip sirkadian pasca makan siang dan ketegangan otot motorik.' },
      fourHourRiskForecast: { decisionErrorProbabilityIncrease: '+18%', reactionTimeDecayTrajectory: 'Sedikit melambat', criticalWarningAlert: null },
      precisionRecoveryPrescription: { immediateAction: 'Peregangan fisik 5 menit & hidrasi.', hydrationElectrolyteMl: 300, recommendedScreenBreakMins: 10, circadianAlignmentNote: 'Post-prandial dip sirkadian normal.' },
      aiEngineVersion: 'gemini-3.8-flash',
      isFallback: false,
    },
  },
  {
    id: 'seed-03',
    timestamp: '2026-09-29T23:45:00Z',
    cfi: { cfiScore: 78, impairmentTier: 'critical_hazard', subjectiveObjectiveDisparity: true, calculatedAt: '2026-09-29T23:45:00Z' },
    analysis: {
      differentialDiagnosis: { primaryType: 'sleep_deprived_microsleep', severityLevel: 'critical_hazard', confidenceScore: 0.98, clinicalRationale: 'Akumulasi adenosin tinggi akibat lembur 10 jam. Lapses meningkat tajam.' },
      fourHourRiskForecast: { decisionErrorProbabilityIncrease: '+62%', reactionTimeDecayTrajectory: 'Degradasi curam', criticalWarningAlert: 'Hentikan aktivitas berisiko!' },
      precisionRecoveryPrescription: { immediateAction: 'Tidur pemulihan segera minimal 7 jam.', hydrationElectrolyteMl: 350, recommendedScreenBreakMins: 30, circadianAlignmentNote: 'Melatonin memuncak; sistem motorik melambat drastis.' },
      aiEngineVersion: 'gemini-3.8-flash',
      isFallback: false,
    },
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
        // Jangan auto-reseed mock data jika user membersihkan cache / baru pertama kali
        setHistory([]);
      }

      const baseline = localStorage.getItem(BASELINE_KEY);
      if (baseline) {
        setDeviceBaselineMs(Number(baseline));
      }
    } catch {
      // LocalStorage access restricted
    }
  }, []);

  const saveSession = (cfi: CompositeFatigueResult, analysis: GeminiClinicalAnalysis) => {
    const newSession: StoredSession = {
      id: `sess-${Date.now()}`,
      timestamp: new Date().toISOString(),
      cfi,
      analysis,
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
