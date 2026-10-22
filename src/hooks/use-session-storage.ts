/**
 * Hook: useSessionHistory
 * Penyimpanan Local-First + Sinkronisasi Cloud/Database Server per Akun Supir Travel.
 */

import { useState, useEffect, useCallback } from 'react';
import { CompositeFatigueResult } from '@/types/assessment';
import { GeminiClinicalAnalysis } from '@/types/gemini';
import { PVTMetrics } from '@/types/pvt';
import { StroopMetrics } from '@/types/stroop';
import { MotorMetrics } from '@/types/motor';
import { CorsiMetrics } from '@/types/corsi';
import { AssessmentRecord } from '@/types/fleet';
import { getAuthHeader } from '@/hooks/use-auth-session';
import { DEFAULT_SEEDED_HISTORY } from '@/lib/seeded-history';

export { DEFAULT_SEEDED_HISTORY };

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

function parseServerRecord(rec: AssessmentRecord): StoredSession | null {
  try {
    const raw = typeof rec.raw_json === 'string' ? JSON.parse(rec.raw_json) : rec.raw_json;
    if (!raw?.cfi || !raw?.analysis) return null;
    return {
      id: String(rec.id),
      timestamp: rec.timestamp,
      cfi: raw.cfi,
      analysis: raw.analysis,
      pvt: raw.pvt,
      stroop: raw.stroop,
      motor: raw.motor,
      corsi: raw.corsi,
    };
  } catch {
    return null;
  }
}

export function useSessionHistory(driverId?: number) {
  const [history, setHistory] = useState<StoredSession[]>([]);
  const [deviceBaselineMs, setDeviceBaselineMs] = useState<number>(230);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  const storageKey = driverId ? `${STORAGE_KEY}_driver_${driverId}` : STORAGE_KEY;

  // 1. Initial Load: Local Cache
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const stored = localStorage.getItem(storageKey);
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
  }, [storageKey]);

  // 2. Server Cloud Synchronization per Driver Account
  useEffect(() => {
    if (!driverId || typeof window === 'undefined') return;

    let isMounted = true;
    const syncWithServer = async () => {
      setIsSyncing(true);
      try {
        const headers = getAuthHeader();
        const res = await fetch(`/api/assessments?driverId=${driverId}`, { headers });
        if (!res.ok) return;

        const data = await res.json();
        if (data?.assessments && Array.isArray(data.assessments)) {
          const serverSessions = data.assessments
            .map(parseServerRecord)
            .filter((s: StoredSession | null): s is StoredSession => s !== null);

          if (isMounted && serverSessions.length > 0) {
            setHistory(serverSessions);
            try {
              localStorage.setItem(storageKey, JSON.stringify(serverSessions));
            } catch {}
          }
        }
      } catch (err) {
        console.warn('Gagal sinkronisasi riwayat dari server:', err);
      } finally {
        if (isMounted) setIsSyncing(false);
      }
    };

    syncWithServer();
    return () => {
      isMounted = false;
    };
  }, [driverId, storageKey]);

  const saveSession = useCallback(
    (
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

      setHistory((prev) => {
        const updated = [newSession, ...prev];
        try {
          localStorage.setItem(storageKey, JSON.stringify(updated));
        } catch {}
        return updated;
      });
    },
    [storageKey]
  );

  const clearHistory = useCallback(() => {
    setHistory([]);
    try {
      localStorage.removeItem(storageKey);
    } catch {}
  }, [storageKey]);

  const seedDemoHistory = useCallback(() => {
    setHistory(DEFAULT_SEEDED_HISTORY);
    try {
      localStorage.setItem(storageKey, JSON.stringify(DEFAULT_SEEDED_HISTORY));
    } catch {}
  }, [storageKey]);

  const updateBaseline = useCallback((ms: number) => {
    setDeviceBaselineMs(ms);
    try {
      localStorage.setItem(BASELINE_KEY, String(ms));
    } catch {}
  }, []);

  return {
    history,
    saveSession,
    clearHistory,
    seedDemoHistory,
    deviceBaselineMs,
    updateBaseline,
    isSyncing,
  };
}
