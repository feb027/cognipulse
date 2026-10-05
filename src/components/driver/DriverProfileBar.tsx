'use client';

import React from 'react';
import { User, Car, ShieldCheck, AlertTriangle, ShieldAlert, ArrowRightLeft, UserPlus } from 'lucide-react';
import { DriverWithLatestAssessment } from '@/types/fleet';

interface DriverProfileBarProps {
  driver: DriverWithLatestAssessment | null;
  onOpenSelectModal: () => void;
  onOpenRegisterModal: () => void;
}

export function DriverProfileBar({ driver, onOpenSelectModal, onOpenRegisterModal }: DriverProfileBarProps) {
  if (!driver) {
    return (
      <div className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-[#1C1C1E] border border-black/5 dark:border-white/10 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-zinc-900 dark:text-white">Pilih Supir Travel</h4>
            <p className="text-xs text-zinc-500 font-medium">Identifikasi NIP sebelum memulai tes kebugaran 90 detik.</p>
          </div>
        </div>
        <button
          onClick={onOpenSelectModal}
          className="px-3.5 py-1.5 rounded-full bg-apple-blue text-white text-xs font-semibold hover:bg-apple-blue/90 transition-all shadow-sm"
        >
          Pilih NIP
        </button>
      </div>
    );
  }

  const isCritical = driver.status === 'stand_down';
  const isCaution = driver.status === 'caution';
  const isOnTrip = driver.status === 'on_trip';

  const statusBadge = isCritical ? (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-red-500/10 text-red-500 border border-red-500/20">
      <ShieldAlert className="w-3 h-3" /> Stand-Down
    </span>
  ) : isCaution ? (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20">
      <AlertTriangle className="w-3 h-3" /> Perlu Co-Driver
    </span>
  ) : isOnTrip ? (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-500/10 text-blue-500 border border-blue-500/20">
      <Car className="w-3 h-3" /> Dalam Perjalanan
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
      <ShieldCheck className="w-3 h-3" /> Siap Jalan (Solo)
    </span>
  );

  return (
    <div className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-[#1C1C1E] border border-black/5 dark:border-white/10 shadow-sm space-y-3">
      {/* Top Bar: Driver Identity & Switcher */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-zinc-100 dark:bg-zinc-800 border border-black/5 dark:border-white/5 flex items-center justify-center text-zinc-700 dark:text-zinc-200 font-bold text-sm">
            {driver.name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-zinc-900 dark:text-white leading-none">
                {driver.name}
              </h3>
              <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                {driver.nip}
              </span>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              Usia: <span className="font-semibold text-zinc-700 dark:text-zinc-300">{driver.age} th</span> • {driver.address}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button
            onClick={onOpenSelectModal}
            title="Ganti Supir"
            className="p-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 text-xs font-semibold transition-all inline-flex items-center gap-1 px-2.5"
          >
            <ArrowRightLeft className="w-3.5 h-3.5 text-apple-blue" />
            <span className="hidden sm:inline">Ganti</span>
          </button>
          <button
            onClick={onOpenRegisterModal}
            title="Tambah Supir Baru"
            className="p-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 text-xs font-semibold transition-all inline-flex items-center gap-1 px-2.5"
          >
            <UserPlus className="w-3.5 h-3.5 text-apple-green" />
            <span className="hidden sm:inline">Daftar</span>
          </button>
        </div>
      </div>

      {/* Detail Meta: Vehicle, Plate, Route & Medical */}
      <div className="pt-2 border-t border-black/5 dark:border-white/5 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
        <div className="flex items-center justify-between sm:justify-start sm:gap-2 text-zinc-600 dark:text-zinc-400">
          <div className="flex items-center gap-1.5">
            <Car className="w-3.5 h-3.5 text-apple-orange flex-shrink-0" />
            <span className="font-medium text-zinc-800 dark:text-zinc-200">{driver.vehicle_type}</span>
          </div>
          <span className="font-mono font-semibold px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-[11px]">
            {driver.license_plate}
          </span>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-2">
          <span className="text-[11px] text-zinc-400 truncate max-w-[200px]" title={driver.medical_history}>
            🩺 {driver.medical_history}
          </span>
          {statusBadge}
        </div>
      </div>
    </div>
  );
}
