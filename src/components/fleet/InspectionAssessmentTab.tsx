'use client';

import React from 'react';
import { AssessmentRecord, DriverStatus, DispatcherDecision } from '@/types/fleet';

interface InspectionAssessmentTabProps {
  latest: AssessmentRecord | null;
  dispatcherNote: string;
  setDispatcherNote: (note: string) => void;
  submitting: boolean;
  onDecision: (status: DriverStatus, decision: DispatcherDecision) => void;
}

export function InspectionAssessmentTab({
  latest,
  dispatcherNote,
  setDispatcherNote,
  submitting,
  onDecision,
}: InspectionAssessmentTabProps) {
  if (!latest) {
    return (
      <div className="text-center py-10 text-xs text-zinc-400">
        Supir belum pernah menjalani tes asesmen kebugaran di sistem.
      </div>
    );
  }

  return (
    <div className="space-y-3.5">
      {/* AI Headline Card */}
      <div className="p-3.5 rounded-2xl bg-zinc-100 dark:bg-zinc-800/60 border border-black/5 dark:border-white/5 space-y-1">
        <span className="text-[10px] font-bold tracking-wider text-apple-blue uppercase">
          Diagnosis AI Keselamatan Tol
        </span>
        <h4 className="text-sm font-bold text-zinc-900 dark:text-white">
          {latest.headline_title}
        </h4>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          {latest.short_summary}
        </p>
      </div>

      {/* 4 Modality Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
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
          <span className="text-[10px] font-semibold text-zinc-400">Jarak Rem Tol</span>
          <div className="text-lg font-black font-mono text-apple-blue">
            {latest.braking_distance_meters} m
          </div>
        </div>
        <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/40 border border-black/5 dark:border-white/5">
          <span className="text-[10px] font-semibold text-zinc-400">Risiko Microsleep</span>
          <div className="text-xs font-bold capitalize pt-1 text-zinc-900 dark:text-white">
            {latest.microsleep_risk}
          </div>
        </div>
      </div>

      {/* Action Section for Dispatcher */}
      <div className="pt-2 border-t border-black/5 dark:border-white/5 space-y-2">
        <label className="text-[11px] font-bold uppercase text-zinc-500">
          Instruksi Dispatcher Operasional
        </label>
        <input
          type="text"
          placeholder="Catatan penugasan (misal: rute tol Cipularang, wajib istirahat KM 72)"
          value={dispatcherNote}
          onChange={(e) => setDispatcherNote(e.target.value)}
          className="w-full px-3 py-2 text-xs rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-transparent focus:border-apple-blue outline-none text-zinc-900 dark:text-white"
        />
        <div className="grid grid-cols-3 gap-2 pt-1">
          <button
            onClick={() => onDecision('ready', 'dispatched_solo')}
            disabled={submitting}
            className="py-2.5 px-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all text-center shadow-sm disabled:opacity-50"
          >
            Setujui Solo
          </button>
          <button
            onClick={() => onDecision('caution', 'co_driver_assigned')}
            disabled={submitting}
            className="py-2.5 px-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all text-center shadow-sm disabled:opacity-50"
          >
            Wajib Co-Driver
          </button>
          <button
            onClick={() => onDecision('stand_down', 'stand_down_issued')}
            disabled={submitting}
            className="py-2.5 px-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all text-center shadow-sm disabled:opacity-50"
          >
            Tolak / Stand-Down
          </button>
        </div>
      </div>
    </div>
  );
}
