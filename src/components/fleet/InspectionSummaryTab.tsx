'use client';

import React from 'react';
import { AssessmentRecord, DriverStatus, DispatcherDecision } from '@/types/fleet';
import { ShieldCheck, AlertTriangle, ShieldAlert, Car, Building2 } from 'lucide-react';

interface InspectionSummaryTabProps {
  latest: AssessmentRecord | null;
  currentStatus?: DriverStatus;
  dispatcherNote: string;
  setDispatcherNote: (note: string) => void;
  submitting: boolean;
  onDecision: (status: DriverStatus, decision: DispatcherDecision) => void;
}

export function InspectionSummaryTab({
  latest,
  currentStatus = 'ready',
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

        {/* Status Evaluasi Kelaikan Medis */}
        <div className="grid grid-cols-3 gap-2 pt-1">
          <button
            onClick={() => onDecision('ready', 'dispatched_solo')}
            disabled={submitting}
            className={`py-2.5 px-2 rounded-xl text-white text-xs font-bold transition-all text-center shadow-sm disabled:opacity-50 inline-flex items-center justify-center gap-1.5 ${
              currentStatus === 'ready' ? 'bg-emerald-600 ring-2 ring-emerald-400/50' : 'bg-emerald-600 hover:bg-emerald-700'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Setujui Solo</span>
          </button>
          <button
            onClick={() => onDecision('caution', 'co_driver_assigned')}
            disabled={submitting}
            className={`py-2.5 px-2 rounded-xl text-white text-xs font-bold transition-all text-center shadow-sm disabled:opacity-50 inline-flex items-center justify-center gap-1.5 ${
              currentStatus === 'caution' ? 'bg-amber-600 ring-2 ring-amber-400/50' : 'bg-amber-600 hover:bg-amber-700'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Wajib Co-Driver</span>
          </button>
          <button
            onClick={() => onDecision('stand_down', 'stand_down_issued')}
            disabled={submitting}
            className={`py-2.5 px-2 rounded-xl text-white text-xs font-bold transition-all text-center shadow-sm disabled:opacity-50 inline-flex items-center justify-center gap-1.5 ${
              currentStatus === 'stand_down' ? 'bg-red-600 ring-2 ring-red-400/50' : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Stand-Down</span>
          </button>
        </div>

        {/* Tombol Aksi Operasional Perjalanan (On-Trip / Tiba di Pool) */}
        <div className="pt-1.5">
          {currentStatus === 'on_trip' ? (
            <button
              type="button"
              onClick={() => onDecision('ready', 'pending')}
              disabled={submitting}
              className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all text-center shadow-sm disabled:opacity-50 inline-flex items-center justify-center gap-2"
            >
              <Building2 className="w-4 h-4" />
              <span>Armada Tiba di Pool</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onDecision('on_trip', 'dispatched_solo')}
              disabled={submitting || currentStatus === 'stand_down'}
              className="w-full py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-200 dark:disabled:bg-zinc-800 disabled:text-zinc-400 text-white text-xs font-bold transition-all text-center shadow-sm disabled:opacity-50 inline-flex items-center justify-center gap-2"
            >
              <Car className="w-4 h-4" />
              <span>Berangkatkan Armada</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
