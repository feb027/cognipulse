'use client';

import React from 'react';
import { Users, ShieldCheck, AlertTriangle, ShieldAlert, Gauge } from 'lucide-react';
import { FleetSummary } from '@/types/fleet';

interface FleetMetricsStripProps {
  summary: FleetSummary | null;
}

export function FleetMetricsStrip({ summary }: FleetMetricsStripProps) {
  if (!summary) {
    return (
      <div className="h-16 rounded-2xl bg-zinc-200/60 dark:bg-zinc-800/40 animate-pulse border border-black/5 dark:border-white/5" />
    );
  }

  const readyPercentage = Math.round(
    (summary.readyCount / (summary.totalDrivers || 1)) * 100
  );

  return (
    <div className="rounded-2xl bg-white dark:bg-[#1C1C1E] border border-black/5 dark:border-white/10 shadow-sm overflow-hidden">
      <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-black/5 dark:divide-white/5">
        {/* Total Armada */}
        <div className="p-3.5 sm:p-4 space-y-1">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Total Armada</span>
            <Users className="w-3.5 h-3.5 text-zinc-500" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl sm:text-2xl font-black font-mono tabular-nums text-zinc-900 dark:text-white">
              {summary.totalDrivers}
            </span>
            <span className="text-[11px] text-zinc-500 font-medium">unit</span>
          </div>
          <p className="text-[10px] text-zinc-400">
            {summary.onTripCount} unit aktif di rute
          </p>
        </div>

        {/* Siap Jalan / Solo */}
        <div className="p-3.5 sm:p-4 space-y-1">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Siap Solo</span>
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl sm:text-2xl font-black font-mono tabular-nums text-emerald-600 dark:text-emerald-400">
              {summary.readyCount}
            </span>
            <span className="text-[11px] text-zinc-500 font-medium">({readyPercentage}%)</span>
          </div>
          <p className="text-[10px] text-zinc-400">
            Kebugaran neurokognitif optimal
          </p>
        </div>

        {/* Butuh Pendamping Co-Driver */}
        <div className="p-3.5 sm:p-4 space-y-1">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">Wajib Co-Driver</span>
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl sm:text-2xl font-black font-mono tabular-nums text-amber-600 dark:text-amber-400">
              {summary.cautionCount}
            </span>
            <span className="text-[11px] text-zinc-500 font-medium">supir</span>
          </div>
          <p className="text-[10px] text-zinc-400">
            Kelelahan ringan / rute malam
          </p>
        </div>

        {/* Stand-Down & Kinematika */}
        <div className="p-3.5 sm:p-4 space-y-1">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[10px] font-bold uppercase tracking-wider text-red-600 dark:text-red-400">Stand-Down</span>
            <ShieldAlert className="w-3.5 h-3.5 text-red-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl sm:text-2xl font-black font-mono tabular-nums text-red-600 dark:text-red-400">
              {summary.standDownCount}
            </span>
            <div className="inline-flex items-center gap-1 text-[11px] font-mono text-zinc-500">
              <Gauge className="w-3 h-3 text-apple-blue" />
              <span>Rem {summary.avgBrakingDistanceMeters}m</span>
            </div>
          </div>
          <p className="text-[10px] text-zinc-400">
            Dilarang mengemudi (RT &gt; 355ms)
          </p>
        </div>
      </div>
    </div>
  );
}
