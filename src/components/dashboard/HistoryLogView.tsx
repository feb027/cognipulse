'use client';

import React from 'react';
import { StoredSession } from '@/hooks/use-session-storage';
import { Clock, ShieldAlert, CheckCircle2, AlertTriangle, AlertOctagon } from 'lucide-react';

interface HistoryLogViewProps {
  history: StoredSession[];
}

export function HistoryLogView({ history }: HistoryLogViewProps) {
  if (!history || history.length === 0) {
    return (
      <div className="p-8 text-center rounded-3xl bg-white dark:bg-[#1C1C1E] border border-black/5 dark:border-white/10 my-4">
        <Clock className="w-8 h-8 text-zinc-400 mx-auto mb-2 opacity-50" />
        <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">Belum Ada Riwayat Tes</h3>
        <p className="text-xs text-zinc-500 mt-1 max-w-xs mx-auto">
          Selesaikan asesmen kebugaran untuk mulai mencatat riwayat performa harian Anda.
        </p>
      </div>
    );
  }

  const getTierInfo = (tier: string) => {
    switch (tier) {
      case 'fit':
        return { label: 'Bugar / Prima', color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20', icon: CheckCircle2 };
      case 'mild_fatigue':
        return { label: 'Lelah Ringan', color: 'text-amber-500 bg-amber-500/10 border-amber-500/20', icon: AlertTriangle };
      case 'moderate_impairment':
        return { label: 'Lelah Sedang', color: 'text-orange-500 bg-orange-500/10 border-orange-500/20', icon: AlertTriangle };
      default:
        return { label: 'Kritis / Waspada', color: 'text-rose-500 bg-rose-500/10 border-rose-500/20', icon: AlertOctagon };
    }
  };

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(d);
    } catch {
      return isoString;
    }
  };

  return (
    <div className="space-y-3 pb-8">
      <div className="px-1 flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-zinc-900 dark:text-white">Riwayat Asesmen</h2>
          <p className="text-xs text-zinc-500">Catatan kesiapan kerja dan kelelahan tersimpan lokal.</p>
        </div>
        <span className="text-xs font-medium text-zinc-400 font-mono">
          {history.length} Sesi
        </span>
      </div>

      <div className="divide-y divide-black/5 dark:divide-white/5 rounded-3xl bg-white dark:bg-[#1C1C1E] border border-black/5 dark:border-white/10 overflow-hidden shadow-apple">
        {history.map((session) => {
          const tier = getTierInfo(session.cfi.impairmentTier);
          const Icon = tier.icon;
          return (
            <div key={session.id} className="p-4 sm:p-5 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${tier.color}`}>
                      <Icon className="w-3 h-3" />
                      {tier.label}
                    </span>
                    {session.cfi.subjectiveObjectiveDisparity && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                        <ShieldAlert className="w-2.5 h-2.5" />
                        Masking Terdeteksi
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1 pt-0.5">
                    <Clock className="w-3 h-3 text-zinc-400" />
                    {formatDate(session.timestamp)}
                  </p>
                </div>

                <div className="text-right">
                  <div className="text-lg font-black font-mono tracking-tight text-zinc-900 dark:text-white">
                    {session.cfi.cfiScore}
                    <span className="text-xs font-normal text-zinc-400">/100</span>
                  </div>
                  <span className="text-[10px] text-zinc-400 uppercase tracking-wider block">Skor CFI</span>
                </div>
              </div>

              <div className="mt-2.5 pt-2.5 border-t border-black/5 dark:border-white/5 space-y-1">
                <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300 leading-relaxed">
                  {session.analysis?.differentialDiagnosis?.clinicalRationale || 'Analisis kebugaran reguler.'}
                </p>
                {session.analysis?.precisionRecoveryPrescription?.immediateAction && (
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                    <span className="font-semibold text-zinc-600 dark:text-zinc-300">Rekomendasi: </span>
                    {session.analysis.precisionRecoveryPrescription.immediateAction}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
