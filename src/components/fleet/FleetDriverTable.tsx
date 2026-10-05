'use client';

import React from 'react';
import { DriverWithLatestAssessment, DriverStatus } from '@/types/fleet';
import { ShieldCheck, AlertTriangle, ShieldAlert, Car, ChevronRight, Clock } from 'lucide-react';

interface FleetDriverTableProps {
  drivers: DriverWithLatestAssessment[];
  onInspect: (driver: DriverWithLatestAssessment) => void;
}

export function FleetDriverTable({ drivers, onInspect }: FleetDriverTableProps) {
  const getStatusBadge = (status: DriverStatus) => {
    switch (status) {
      case 'stand_down':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            Stand-Down
          </span>
        );
      case 'caution':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Co-Driver
          </span>
        );
      case 'on_trip':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 whitespace-nowrap">
            <Car className="w-3 h-3 text-apple-blue" />
            On-Trip
          </span>
        );
      case 'ready':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 whitespace-nowrap">
            <ShieldCheck className="w-3 h-3 text-emerald-500" />
            Siap Solo
          </span>
        );
    }
  };

  if (drivers.length === 0) {
    return (
      <div className="p-8 text-center rounded-2xl bg-white dark:bg-[#1C1C1E] border border-black/5 dark:border-white/10 text-xs text-zinc-500">
        Tidak ada data pengemudi yang cocok dengan filter.
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white dark:bg-[#1C1C1E] border border-black/5 dark:border-white/10 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-black/5 dark:border-white/5 bg-zinc-50/75 dark:bg-zinc-900/40 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
              <th className="py-3 px-4">Pengemudi & NIP</th>
              <th className="py-3 px-4">Armada Travel</th>
              <th className="py-3 px-4">Status Kesiapan</th>
              <th className="py-3 px-4 text-center">Skor CFI</th>
              <th className="py-3 px-4 text-center">Refleks PVT</th>
              <th className="py-3 px-4 text-center">Rem Tol</th>
              <th className="py-3 px-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5 dark:divide-white/5">
            {drivers.map((driver) => {
              const latest = driver.latestAssessment;
              return (
                <tr
                  key={driver.id}
                  onClick={() => onInspect(driver)}
                  className="hover:bg-zinc-50/80 dark:hover:bg-zinc-900/50 transition-colors cursor-pointer group"
                >
                  {/* Driver & NIP */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center font-bold text-xs text-zinc-800 dark:text-zinc-200 flex-shrink-0">
                        {driver.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-bold text-zinc-900 dark:text-white flex items-center gap-1.5">
                          <span>{driver.name}</span>
                          <span className="text-[10px] text-zinc-400 font-normal">({driver.age} th)</span>
                        </div>
                        <span className="font-mono text-[10px] text-zinc-500">{driver.nip}</span>
                      </div>
                    </div>
                  </td>

                  {/* Vehicle & Plate */}
                  <td className="py-3.5 px-4">
                    <div className="font-medium text-zinc-900 dark:text-zinc-200 truncate max-w-[150px]">
                      {driver.vehicle_type}
                    </div>
                    <span className="font-mono text-[10px] text-zinc-500 font-semibold">
                      {driver.license_plate}
                    </span>
                  </td>

                  {/* Status Badge */}
                  <td className="py-3.5 px-4">{getStatusBadge(driver.status)}</td>

                  {/* CFI Score */}
                  <td className="py-3.5 px-4 text-center">
                    <span className="font-mono font-bold text-sm tabular-nums text-zinc-900 dark:text-white">
                      {latest ? Math.round(latest.cfi_score) : '—'}
                    </span>
                    <span className="block text-[10px] text-zinc-400 capitalize">
                      {latest?.impairment_tier || 'Belum Uji'}
                    </span>
                  </td>

                  {/* PVT Reaction Time */}
                  <td className="py-3.5 px-4 text-center">
                    <span className="font-mono font-bold text-xs tabular-nums text-zinc-900 dark:text-white">
                      {latest ? `${Math.round(latest.pvt_mean_rt)} ms` : '—'}
                    </span>
                    {latest && (
                      <span className="block text-[10px] text-zinc-400">
                        {latest.pvt_lapses > 0 ? `${latest.pvt_lapses} lapse` : '0 lapse'}
                      </span>
                    )}
                  </td>

                  {/* Braking Distance */}
                  <td className="py-3.5 px-4 text-center">
                    <span className="font-mono font-bold text-xs tabular-nums text-apple-blue">
                      {latest ? `${latest.braking_distance_meters} m` : '—'}
                    </span>
                    <span className="block text-[10px] text-zinc-400">@ 100 km/h</span>
                  </td>

                  {/* Action */}
                  <td className="py-3.5 px-4 text-right">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onInspect(driver);
                      }}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 text-xs font-semibold transition-all group-hover:bg-apple-blue group-hover:text-white shadow-sm"
                    >
                      <span>Inspeksi</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
