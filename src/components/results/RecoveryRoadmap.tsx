'use client';

import React from 'react';
import { PrecisionRecoveryPrescription } from '@/types/gemini';
import { Pill, Droplets, MonitorOff, Clock } from 'lucide-react';

interface RecoveryRoadmapProps {
  prescription: PrecisionRecoveryPrescription;
}

export const RecoveryRoadmap: React.FC<RecoveryRoadmapProps> = ({ prescription }) => {
  return (
    <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#1C1C1E] border border-black/5 dark:border-white/10 shadow-apple space-y-4 text-xs">
      <div className="flex items-center gap-2 border-b border-black/[0.04] dark:border-white/[0.08] pb-3">
        <div className="w-6 h-6 rounded-full bg-apple-green/10 flex items-center justify-center text-apple-green">
          <Pill className="w-3.5 h-3.5" />
        </div>
        <h3 className="font-bold text-zinc-900 dark:text-white text-sm">
          Saran Pemulihan Tubuh
        </h3>
      </div>

      {/* 3 Pillars */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* 1. Langkah Utama */}
        <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 space-y-1.5">
          <span className="text-[10px] font-bold text-apple-green uppercase tracking-wider block">
            Langkah Utama
          </span>
          <p className="font-bold text-zinc-900 dark:text-white text-sm leading-snug">
            {prescription.immediateAction}
          </p>
          <span className="text-[11px] text-zinc-400 block font-medium">
            Untuk memulihkan energi
          </span>
        </div>

        {/* 2. Kebutuhan Air */}
        <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 space-y-1.5">
          <div className="flex items-center gap-1.5 text-apple-blue font-bold text-[10px] uppercase tracking-wider">
            <Droplets className="w-3.5 h-3.5" />
            <span>Kebutuhan Air</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-extrabold text-zinc-900 dark:text-white">
              {prescription.hydrationElectrolyteMl}
            </span>
            <span className="text-xs text-apple-blue font-semibold">ml air putih</span>
          </div>
          <p className="text-[11px] text-zinc-400 font-medium">
            Minum secara perlahan
          </p>
        </div>

        {/* 3. Istirahatkan Mata */}
        <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 space-y-1.5">
          <div className="flex items-center gap-1.5 text-apple-orange font-bold text-[10px] uppercase tracking-wider">
            <MonitorOff className="w-3.5 h-3.5" />
            <span>Istirahat Mata</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-extrabold text-zinc-900 dark:text-white">
              {prescription.recommendedScreenBreakMins}
            </span>
            <span className="text-xs text-apple-orange font-semibold">menit jeda</span>
          </div>
          <p className="text-[11px] text-zinc-400 font-medium">
            Alihkan pandangan dari layar
          </p>
        </div>
      </div>

      {/* Circadian Note */}
      <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 flex items-start gap-3">
        <Clock className="w-4 h-4 text-apple-blue shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
            Pengaturan Waktu Istirahat
          </span>
          <p className="text-zinc-600 dark:text-zinc-300 font-medium leading-relaxed text-xs">
            {prescription.circadianAlignmentNote}
          </p>
        </div>
      </div>
    </div>
  );
};
