'use client';

import React from 'react';
import { X } from 'lucide-react';

interface ProfileDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  baselineMs: number;
}

export function ProfileDetailsModal({
  isOpen,
  onClose,
  baselineMs,
}: ProfileDetailsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-sm rounded-3xl bg-white dark:bg-[#1C1C1E] border border-black/10 dark:border-white/10 shadow-2xl p-6 space-y-5 animate-springUp">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold tracking-wider uppercase text-zinc-400">
              Identitas Operator
            </span>
            <h3 className="text-xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
              Budi Santoso
            </h3>
            <p className="text-xs text-zinc-500">ID: OPERATOR-8821</p>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Apple Clean Key-Value List (Zero Icons, Pure Typography) */}
        <div className="divide-y divide-black/5 dark:divide-white/5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-black/5 dark:border-white/5 overflow-hidden text-xs">
          <div className="p-3.5 flex items-center justify-between">
            <span className="text-zinc-500 dark:text-zinc-400 font-medium">Status Kebugaran</span>
            <span className="font-bold text-emerald-500">Fit-For-Duty Aktif</span>
          </div>

          <div className="p-3.5 flex items-center justify-between">
            <span className="text-zinc-500 dark:text-zinc-400 font-medium">Kalibrasi Layar</span>
            <span className="font-mono font-bold text-zinc-800 dark:text-zinc-200 tabular-nums">
              {baselineMs} ms
            </span>
          </div>

          <div className="p-3.5 flex items-center justify-between">
            <span className="text-zinc-500 dark:text-zinc-400 font-medium">Standar Evaluasi</span>
            <span className="font-semibold text-zinc-800 dark:text-zinc-200">ISO 10075 / NASA PVT</span>
          </div>

          <div className="p-3.5 flex items-center justify-between">
            <span className="text-zinc-500 dark:text-zinc-400 font-medium">Penyimpanan Data</span>
            <span className="font-semibold text-zinc-800 dark:text-zinc-200">Terenkripsi di Perangkat</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-full bg-apple-blue hover:opacity-90 active:scale-95 text-white font-bold text-xs shadow-sm transition-all"
        >
          Selesai
        </button>
      </div>
    </div>
  );
}
