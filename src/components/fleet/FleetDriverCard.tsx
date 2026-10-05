'use client';

import React from 'react';
import { Car, Gauge, ShieldCheck, AlertTriangle, ShieldAlert, ChevronRight, Clock } from 'lucide-react';
import { DriverWithLatestAssessment } from '@/types/fleet';

interface FleetDriverCardProps {
  driver: DriverWithLatestAssessment;
  onInspect: (driver: DriverWithLatestAssessment) => void;
}

export function FleetDriverCard({ driver, onInspect }: FleetDriverCardProps) {
  const latest = driver.latestAssessment;
  const isCritical = driver.status === 'stand_down';
  const isCaution = driver.status === 'caution';
  const isOnTrip = driver.status === 'on_trip';

  const statusBadge = isCritical ? (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-red-500/10 text-red-500 border border-red-500/20">
      <ShieldAlert className="w-3 h-3" /> Stand-Down
    </span>
  ) : isCaution ? (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20">
      <AlertTriangle className="w-3 h-3" /> Butuh Co-Driver
    </span>
  ) : isOnTrip ? (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-500/10 text-blue-500 border border-blue-500/20">
      <Car className="w-3 h-3" /> On-Trip
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
      <ShieldCheck className="w-3 h-3" /> Siap Solo
    </span>
  );

  return (
    <div className="p-4 rounded-2xl bg-white dark:bg-[#1C1C1E] border border-black/5 dark:border-white/10 shadow-sm hover:border-black/10 dark:hover:border-white/20 transition-all space-y-3">
      {/* Top Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center font-bold text-xs text-zinc-700 dark:text-zinc-200">
            {driver.nip.slice(-3)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-zinc-900 dark:text-white">{driver.name}</h4>
              <span className="text-[10px] font-mono text-zinc-400">({driver.age} th)</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-zinc-500">
              <span className="font-mono text-[11px] font-semibold text-zinc-700 dark:text-zinc-300">
                {driver.license_plate}
              </span>
              <span>•</span>
              <span className="truncate max-w-[140px] sm:max-w-none">{driver.vehicle_type}</span>
            </div>
          </div>
        </div>

        <div>{statusBadge}</div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-3 gap-2 py-2 px-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-black/5 dark:border-white/5 text-center">
        <div>
          <span className="text-[10px] font-semibold text-zinc-400 uppercase">Skor CFI</span>
          <div className="font-mono font-bold text-sm text-zinc-900 dark:text-white">
            {latest ? Math.round(latest.cfi_score) : '—'}
          </div>
        </div>
        <div>
          <span className="text-[10px] font-semibold text-zinc-400 uppercase">Refleks</span>
          <div className="font-mono font-bold text-sm text-zinc-900 dark:text-white">
            {latest ? `${Math.round(latest.pvt_mean_rt)} ms` : '—'}
          </div>
        </div>
        <div>
          <span className="text-[10px] font-semibold text-zinc-400 uppercase">Jarak Rem</span>
          <div className="font-mono font-bold text-sm text-zinc-900 dark:text-white">
            {latest ? `${latest.braking_distance_meters} m` : '—'}
          </div>
        </div>
      </div>

      {/* Footer & Action */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-1.5 text-[11px] text-zinc-500">
          <Clock className="w-3.5 h-3.5 text-zinc-400" />
          <span>
            {latest
              ? new Date(latest.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
              : 'Belum ada uji'}
          </span>
        </div>

        <button
          onClick={() => onInspect(driver)}
          className="inline-flex items-center gap-1 text-xs font-semibold text-apple-blue hover:text-apple-blue/80 transition-colors"
        >
          <span>Inspeksi Detail</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
