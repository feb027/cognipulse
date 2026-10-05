'use client';

import React, { useState } from 'react';
import { X, Search, User, Car, Check, UserPlus } from 'lucide-react';
import { DriverWithLatestAssessment } from '@/types/fleet';

interface DriverSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  drivers: DriverWithLatestAssessment[];
  selectedDriver: DriverWithLatestAssessment | null;
  onSelectDriver: (driver: DriverWithLatestAssessment) => void;
  onOpenRegisterModal: () => void;
}

export function DriverSelectionModal({
  isOpen,
  onClose,
  drivers,
  selectedDriver,
  onSelectDriver,
  onOpenRegisterModal,
}: DriverSelectionModalProps) {
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const filtered = drivers.filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.nip.toLowerCase().includes(search.toLowerCase()) ||
      d.license_plate.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-[#1C1C1E] rounded-3xl w-full max-w-lg overflow-hidden border border-black/10 dark:border-white/10 shadow-2xl flex flex-col max-h-[85vh] animate-springUp">
        {/* Header */}
        <div className="px-5 py-4 border-b border-black/5 dark:border-white/10 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-white">Pilih Supir Travel</h3>
            <p className="text-xs text-zinc-500 font-medium">Pilih profil supir untuk merekam asesmen ke database.</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search & Actions */}
        <div className="p-4 border-b border-black/5 dark:border-white/5 space-y-2.5">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-zinc-400" />
            <input
              type="text"
              placeholder="Cari berdasarkan NIP, nama, atau plat nomor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-zinc-100 dark:bg-zinc-800/80 border border-transparent focus:border-apple-blue outline-none text-zinc-900 dark:text-white placeholder-zinc-400 font-medium"
            />
          </div>
        </div>

        {/* Driver List */}
        <div className="overflow-y-auto p-4 space-y-2 flex-1 divide-y divide-black/5 dark:divide-white/5">
          {filtered.length === 0 ? (
            <div className="text-center py-8 text-zinc-400 text-xs">
              Tidak ada supir yang cocok dengan pencarian "{search}".
            </div>
          ) : (
            filtered.map((driver) => {
              const isSelected = selectedDriver?.id === driver.id;
              return (
                <button
                  key={driver.id}
                  onClick={() => {
                    onSelectDriver(driver);
                    onClose();
                  }}
                  className={`w-full text-left p-3 rounded-2xl flex items-center justify-between transition-all pt-3 ${
                    isSelected
                      ? 'bg-apple-blue/10 dark:bg-apple-blue/20 border border-apple-blue/30'
                      : 'hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-300 font-bold text-xs flex-shrink-0">
                      {driver.nip.slice(-3)}
                    </div>
                    <div className="truncate">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-zinc-900 dark:text-white truncate">
                          {driver.name}
                        </span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-500">
                          {driver.nip}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-zinc-500 mt-0.5">
                        <span className="flex items-center gap-1">
                          <Car className="w-3 h-3 text-zinc-400" />
                          {driver.vehicle_type}
                        </span>
                        <span>•</span>
                        <span className="font-mono text-zinc-600 dark:text-zinc-300">{driver.license_plate}</span>
                      </div>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="w-6 h-6 rounded-full bg-apple-blue text-white flex items-center justify-center flex-shrink-0">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  )}
                </button>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-black/5 dark:border-white/10 bg-zinc-50 dark:bg-zinc-900/40 flex items-center justify-between">
          <span className="text-xs text-zinc-500 font-medium">
            Total {drivers.length} supir terdaftar
          </span>
          <button
            onClick={() => {
              onClose();
              onOpenRegisterModal();
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-xs font-semibold hover:opacity-90 transition-all"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Tambah Driver Baru</span>
          </button>
        </div>
      </div>
    </div>
  );
}
