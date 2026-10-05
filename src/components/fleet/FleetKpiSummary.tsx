'use client';

import React from 'react';
import { Users, ShieldCheck, AlertTriangle, ShieldAlert, Gauge, Activity } from 'lucide-react';
import { FleetSummary } from '@/types/fleet';

interface FleetKpiSummaryProps {
  summary: FleetSummary | null;
}

export function FleetKpiSummary({ summary }: FleetKpiSummaryProps) {
  if (!summary) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-24 rounded-2xl bg-zinc-200 dark:bg-zinc-800/50" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {/* 1. Total Supir & Armada */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#1C1C1E] border border-black/5 dark:border-white/10 shadow-sm space-y-1">
        <div className="flex items-center justify-between text-zinc-500">
          <span className="text-[11px] font-bold uppercase tracking-wider">Total Armada</span>
          <Users className="w-4 h-4 text-apple-blue" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-black font-mono tabular-nums text-zinc-900 dark:text-white">
            {summary.totalDrivers}
          </span>
          <span className="text-xs text-zinc-400 font-medium">unit travel</span>
        </div>
        <p className="text-[11px] text-zinc-500 font-medium">
          {summary.onTripCount} sedang dalam perjalanan
        </p>
      </div>

      {/* 2. Siap Jalan (Solo) */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#1C1C1E] border border-black/5 dark:border-white/10 shadow-sm space-y-1">
        <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400">
          <span className="text-[11px] font-bold uppercase tracking-wider">Laik Solo</span>
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-black font-mono tabular-nums text-emerald-600 dark:text-emerald-400">
            {summary.readyCount}
          </span>
          <span className="text-xs text-zinc-400 font-medium">supir fit</span>
        </div>
        <p className="text-[11px] text-emerald-600/80 dark:text-emerald-400/80 font-medium">
          {Math.round((summary.readyCount / (summary.totalDrivers || 1)) * 100)}% kesiapan armada
        </p>
      </div>

      {/* 3. Perlu Co-Driver / Waspada */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#1C1C1E] border border-black/5 dark:border-white/10 shadow-sm space-y-1">
        <div className="flex items-center justify-between text-amber-600 dark:text-amber-400">
          <span className="text-[11px] font-bold uppercase tracking-wider">Butuh Co-Driver</span>
          <AlertTriangle className="w-4 h-4 text-amber-500" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-black font-mono tabular-nums text-amber-600 dark:text-amber-400">
            {summary.cautionCount}
          </span>
          <span className="text-xs text-zinc-400 font-medium">waspada</span>
        </div>
        <p className="text-[11px] text-amber-600/80 dark:text-amber-400/80 font-medium">
          Wajib pendamping rute tol
        </p>
      </div>

      {/* 4. Stand-down & Rerata Pengereman */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#1C1C1E] border border-black/5 dark:border-white/10 shadow-sm space-y-1">
        <div className="flex items-center justify-between text-red-600 dark:text-red-400">
          <span className="text-[11px] font-bold uppercase tracking-wider">Stand-Down</span>
          <ShieldAlert className="w-4 h-4 text-red-500" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-black font-mono tabular-nums text-red-600 dark:text-red-400">
            {summary.standDownCount}
          </span>
          <span className="text-xs text-zinc-400 font-medium">dilarang jalan</span>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 font-mono">
          <Gauge className="w-3 h-3 text-apple-blue" />
          <span>Avg Rem: {summary.avgBrakingDistanceMeters}m</span>
        </div>
      </div>
    </div>
  );
}
