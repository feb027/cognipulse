'use client';

import React from 'react';

interface ProfileDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenProfileDetails: () => void;
  onOpenJuryPresets: () => void;
  onSeedDemo: () => void;
  onClearHistory: () => void;
}

export function ProfileDropdown({
  isOpen,
  onClose,
  onOpenProfileDetails,
  onOpenJuryPresets,
  onSeedDemo,
  onClearHistory,
}: ProfileDropdownProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Invisible backdrop to capture outside clicks reliably */}
      <div
        className="fixed inset-0 z-40"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Apple-style Smooth Dropdown */}
      <div className="absolute right-0 top-full mt-2 z-50 w-64 rounded-2xl bg-white/95 dark:bg-[#1C1C1E]/95 backdrop-blur-xl border border-black/10 dark:border-white/10 shadow-2xl p-2 space-y-1 origin-top-right animate-dropdownEnter text-zinc-900 dark:text-white">
        {/* Profile Header (Clickable to view details) */}
        <button
          onClick={() => {
            onOpenProfileDetails();
            onClose();
          }}
          className="w-full p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-left flex items-center justify-between group"
        >
          <div>
            <div className="text-xs font-bold text-zinc-900 dark:text-white group-hover:text-apple-blue transition-colors">
              Budi Santoso
            </div>
            <div className="text-[11px] text-zinc-500 dark:text-zinc-400">
              Operator • ID-8821
            </div>
          </div>
          <span className="text-[11px] font-semibold text-apple-blue">
            Lihat Profil
          </span>
        </button>

        {/* Action Items - Clean Minimal Apple Typography (No Icons) */}
        <div className="pt-1 border-t border-black/5 dark:border-white/5 space-y-0.5 text-xs font-medium">
          <button
            onClick={() => {
              onOpenJuryPresets();
              onClose();
            }}
            className="w-full px-3 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-left flex flex-col"
          >
            <span className="font-semibold text-zinc-900 dark:text-zinc-100">
              Preset Skenario Juri
            </span>
            <span className="text-[10px] text-zinc-500 dark:text-zinc-400">
              Simulasi bugar, lembur, atau kritis
            </span>
          </button>

          <button
            onClick={() => {
              onSeedDemo();
              onClose();
            }}
            className="w-full px-3 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-left text-zinc-700 dark:text-zinc-300"
          >
            Muat Data Demo Evaluasi
          </button>

          <button
            onClick={() => {
              onClearHistory();
              onClose();
            }}
            className="w-full px-3 py-2 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 text-rose-600 dark:text-rose-400 transition-colors text-left"
          >
            Bersihkan Riwayat Lokal
          </button>
        </div>
      </div>
    </>
  );
}
