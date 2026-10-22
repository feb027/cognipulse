'use client';

import React from 'react';
import { ShieldCheck, ShieldAlert, AlertTriangle, Gauge, MapPin, Coffee } from 'lucide-react';
import { TravelSafetyMetrics } from '@/types/gemini';

interface TravelSafetyReportCardProps {
  safety?: TravelSafetyMetrics;
  pvtReactionMs?: number;
}

export function TravelSafetyReportCard({ safety, pvtReactionMs }: TravelSafetyReportCardProps) {
  if (!safety) {
    const rtSec = (pvtReactionMs || 250) / 1000;
    const defaultDist = parseFloat((rtSec * 27.78).toFixed(1));
    return (
      <div className="p-4 rounded-2xl bg-white dark:bg-[#1C1C1E] border border-black/5 dark:border-white/10 shadow-sm space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-zinc-500 uppercase tracking-wider">
          <Gauge className="w-4 h-4 text-apple-blue shrink-0" />
          <span>Estimasi Keselamatan Pengereman Tol (100 km/jam)</span>
        </div>
        <p className="text-2xl font-bold font-mono tabular-nums text-zinc-900 dark:text-white">
          {defaultDist} <span className="text-xs font-normal text-zinc-500">meter jarak reaksi</span>
        </p>
      </div>
    );
  }

  const isCritical = safety.dispatcherRecommendation === 'stand_down' || safety.highwayMicrosleepRisk === 'kritis';
  const isCaution = safety.dispatcherRecommendation === 'wajib_co_driver' || safety.highwayMicrosleepRisk === 'waspada';

  const badgeColor = isCritical
    ? 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20'
    : isCaution
    ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
    : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';

  const recLabel =
    safety.dispatcherRecommendation === 'stand_down'
      ? 'Stand-Down (Dilarang Mengemudi)'
      : safety.dispatcherRecommendation === 'wajib_co_driver'
      ? 'Wajib Co-Driver (Pendamping)'
      : 'Siap Solo (Laik Jalan Mandiri)';

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#1C1C1E] border border-black/5 dark:border-white/10 shadow-sm space-y-3.5">
      {/* Header: Reflowable for mobile screens */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="flex items-center gap-2">
          {isCritical ? (
            <ShieldAlert className="w-4 h-4 text-red-500 shrink-0" />
          ) : isCaution ? (
            <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
          ) : (
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
          )}
          <span className="text-xs font-bold tracking-wider uppercase text-zinc-500 dark:text-zinc-400">
            Analisis Keselamatan Armada Travel
          </span>
        </div>
        <div className="self-start sm:self-auto">
          <span className={`inline-block px-3 py-1 rounded-full text-[11px] font-bold border ${badgeColor}`}>
            {recLabel}
          </span>
        </div>
      </div>

      {/* Grid: Jarak Pengereman & Risiko Microsleep */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-black/5 dark:border-white/5 space-y-1">
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-zinc-500">
            <Gauge className="w-3.5 h-3.5 text-apple-blue shrink-0" />
            <span>Jarak Reaksi (100 km/h)</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black font-mono tabular-nums text-zinc-900 dark:text-white">
              {safety.brakingDistanceMeters}
            </span>
            <span className="text-xs font-semibold text-zinc-400">meter</span>
          </div>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium">
            {safety.brakingHazardDeltaMeters > 0
              ? `+${safety.brakingHazardDeltaMeters}m lebih panjang dari normal`
              : 'Refleks pengereman optimal'}
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-black/5 dark:border-white/5 space-y-1">
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-zinc-500">
            <ShieldAlert className="w-3.5 h-3.5 text-apple-orange shrink-0" />
            <span>Risiko Microsleep Tol</span>
          </div>
          <div className="text-base font-bold capitalize text-zinc-900 dark:text-white">
            {safety.highwayMicrosleepRisk}
          </div>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium leading-snug">
            {safety.highwayHypnosisSusceptibility}
          </p>
        </div>
      </div>

      {/* Route & Rest Area notes */}
      <div className="space-y-2 pt-1 text-xs">
        <div className="flex items-start gap-2 text-zinc-600 dark:text-zinc-300">
          <MapPin className="w-3.5 h-3.5 mt-0.5 text-apple-blue shrink-0" />
          <span className="leading-relaxed">
            <strong className="text-zinc-900 dark:text-white font-semibold">Kesesuaian Rute:</strong>{' '}
            {safety.routeCompatibility}
          </span>
        </div>
        <div className="flex items-start gap-2 text-zinc-600 dark:text-zinc-300">
          <Coffee className="w-3.5 h-3.5 mt-0.5 text-apple-orange shrink-0" />
          <span className="leading-relaxed">
            <strong className="text-zinc-900 dark:text-white font-semibold">Protokol Istirahat:</strong>{' '}
            {safety.restAreaProtocol}
          </span>
        </div>
      </div>
    </div>
  );
}
