'use client';

import React from 'react';
import { AssessmentRecord, DriverStatus, DispatcherDecision } from '@/types/fleet';
import { ShieldCheck, AlertTriangle, ShieldAlert } from 'lucide-react';

interface InspectionSummaryTabProps {
  latest: AssessmentRecord | null;
  dispatcherNote: string;
  setDispatcherNote: (note: string) => void;
  submitting: boolean;
  onDecision: (status: DriverStatus, decision: DispatcherDecision) => void;
}

export function InspectionSummaryTab({
  latest,
  dispatcherNote,
  setDispatcherNote,
  submitting,
  onDecision,
}: InspectionSummaryTabProps) {
  if (!latest) {
    return (
      <div className="text-center py-10 text-xs text-zinc-400">
        Supir belum pernah menjalani tes asesmen kebugaran di sistem.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* AI Headline Card */}
      <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-black/5 dark:border-white/5 space-y-1">
        <span className="text-[10px] font-bold tracking-wider text-apple-blue uppercase">
          Ringkasan Diagnosis Klinis
        </span>
        <h4 className="text-sm font-bold text-zinc-900 dark:text-white">
          {latest.headline_title}
        </h4>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
          {latest.short_summary}
        </p>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-4 gap-2 text-center">
        <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/40 border border-black/5 dark:border-white/5">
          <span className="text-[10px] font-semibold text-zinc-400">Skor CFI</span>
          <div className="text-lg font-black font-mono text-zinc-900 dark:text-white">
            {Math.round(latest.cfi_score)}
          </div>
        </div>
        <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/40 border border-black/5 dark:border-white/5">
          <span className="text-[10px] font-semibold text-zinc-400">Refleks PVT</span>
          <div className="text-lg font-black font-mono text-zinc-900 dark:text-white">
            {Math.round(latest.pvt_mean_rt)} ms
          </div>
        </div>
        <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/40 border border-black/5 dark:border-white/5">
          <span className="text-[10px] font-semibold text-zinc-400">Rem Tol</span>
          <div className="text-lg font-black font-mono text-apple-blue">
            {latest.braking_distance_meters} m
          </div>
        </div>
        <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/40 border border-black/5 dark:border-white/5">
          <span className="text-[10px] font-semibold text-zinc-400">Risiko</span>
          <div className="text-xs font-bold capitalize pt-1 text-zinc-900 dark:text-white">
            {latest.microsleep_risk}
          </div>
        </div>
      </div>

      {/* Action Section for Dispatcher */}
      <div className="pt-2 border-t border-black/5 dark:border-white/5 space-y-2.5">
        <label className="text-[11px] font-bold uppercase text-zinc-500">
          Instruksi Dispatcher Operasional
        </label>
        <input
          type="text"
          placeholder="Catatan penugasan (contoh: rute tol Cipularang, wajib istirahat KM 72)"
          value={dispatcherNote}
          onChange={(e) => setDispatcherNote(e.target.value)}
          className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:border-apple-blue outline-none text-zinc-900 dark:text-white placeholder-zinc-400"
        />
        <div className="grid grid-cols-3 gap-2 pt-1">
          <button
            onClick={() => onDecision('ready', 'dispatched_solo')}
            disabled={submitting}
            className="py-2.5 px-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all text-center shadow-sm disabled:opacity-50 inline-flex items-center justify-center gap-1.5"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Setujui Solo</span>
          </button>
          <button
            onClick={() => onDecision('caution', 'co_driver_assigned')}
            disabled={submitting}
            className="py-2.5 px-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all text-center shadow-sm disabled:opacity-50 inline-flex items-center justify-center gap-1.5"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Wajib Co-Driver</span>
          </button>
          <button
            onClick={() => onDecision('stand_down', 'stand_down_issued')}
            disabled={submitting}
            className="py-2.5 px-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all text-center shadow-sm disabled:opacity-50 inline-flex items-center justify-center gap-1.5"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Stand-Down</span>
          </button>
        </div>
      </div>
    </div>
  );
}
