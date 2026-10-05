'use client';

import React from 'react';
import { X, Car, LogOut, ShieldCheck, AlertTriangle, ShieldAlert, MapPin, Activity } from 'lucide-react';
import { DriverWithLatestAssessment } from '@/types/fleet';

interface DriverProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  driver: DriverWithLatestAssessment | null;
  onLogout: () => void;
}

export function DriverProfileModal({
  isOpen,
  onClose,
  driver,
  onLogout,
}: DriverProfileModalProps) {
  if (!isOpen || !driver) return null;

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-[#1C1C1E] rounded-3xl w-full max-w-md overflow-hidden border border-black/10 dark:border-white/10 shadow-2xl flex flex-col max-h-[90vh] animate-springUp">
        {/* Header */}
        <div className="px-5 py-4 border-b border-black/5 dark:border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-apple-orange to-apple-red flex items-center justify-center text-white font-bold text-sm shadow-sm">
              {driver.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-zinc-900 dark:text-white leading-none">
                  {driver.name}
                </h3>
                <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                  {driver.nip}
                </span>
              </div>
              <p className="text-xs text-zinc-500 mt-1">{driver.age} Tahun • Supir Travel Aktif</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Profile Content */}
        <div className="p-5 overflow-y-auto space-y-3.5 text-xs">
          <div className="flex items-center justify-between p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-black/5 dark:border-white/5">
            <span className="font-medium text-zinc-500">Status Kelayakan Saat Ini:</span>
            {statusBadge}
          </div>

          <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-black/5 dark:border-white/5 space-y-1">
            <span className="text-[10px] font-bold uppercase text-zinc-400">Unit Armada & Plat Kendaraan</span>
            <div className="flex items-center justify-between pt-0.5">
              <span className="font-semibold text-zinc-900 dark:text-white flex items-center gap-1.5">
                <Car className="w-3.5 h-3.5 text-apple-orange" />
                {driver.vehicle_type}
              </span>
              <span className="font-mono font-bold px-2 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200">
                {driver.license_plate}
              </span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-black/5 dark:border-white/5 space-y-1">
            <span className="text-[10px] font-bold uppercase text-zinc-400">Alamat Pangkalan / Pool</span>
            <p className="font-medium text-zinc-800 dark:text-zinc-200">{driver.address}</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-black/5 dark:border-white/5 space-y-1">
            <span className="text-[10px] font-bold uppercase text-zinc-400">Riwayat Medis & Catatan Kesehatan</span>
            <p className="font-medium text-zinc-800 dark:text-zinc-200">🩺 {driver.medical_history}</p>
          </div>

          {driver.activeTrip && (
            <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-black/5 dark:border-white/5 space-y-1">
              <span className="text-[10px] font-bold uppercase text-zinc-400">Rute Perjalanan Aktif</span>
              <p className="font-semibold text-zinc-900 dark:text-white flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-apple-blue" />
                {driver.activeTrip.route_name} ({driver.activeTrip.distance_km} km)
              </p>
            </div>
          )}
        </div>

        {/* Footer: Logout */}
        <div className="p-4 border-t border-black/5 dark:border-white/10 bg-zinc-50 dark:bg-zinc-900/40 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
          >
            Tutup
          </button>
          <button
            onClick={() => {
              onClose();
              onLogout();
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 font-semibold text-xs transition-all border border-red-500/20"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Keluar dari Akun</span>
          </button>
        </div>
      </div>
    </div>
  );
}
