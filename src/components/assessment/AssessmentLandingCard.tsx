'use client';

import React from 'react';
import { Play, Zap, Brain, Activity, Clock, Grid3X3 } from 'lucide-react';

interface AssessmentLandingCardProps {
  onStart: () => void;
  baselineMs: number;
}

export const AssessmentLandingCard: React.FC<AssessmentLandingCardProps> = ({
  onStart,
}) => {
  return (
    <div className="p-5 sm:p-7 rounded-3xl bg-white dark:bg-[#1C1C1E] border border-black/5 dark:border-white/10 shadow-apple space-y-5">
      {/* Header Info */}
      <div className="space-y-1.5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-apple-blue/10 text-apple-blue text-xs font-semibold">
          <Clock className="w-3.5 h-3.5" />
          <span>Tes Cepat 90 Detik</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
          Cek Kebugaran & Refleks
        </h2>
        <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed max-w-lg">
          4 tes singkat terstandarisasi untuk memeriksa kecepatan respon visual, kontrol fokus, memori kerja, dan kestabilan motorik.
        </p>
      </div>

      {/* 4 Step Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 space-y-1">
          <div className="flex items-center gap-1.5 text-apple-orange font-bold text-xs">
            <Zap className="w-3.5 h-3.5" />
            <span>1. Refleks</span>
          </div>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium leading-snug">
            Ketuk layar saat stimulus muncul.
          </p>
        </div>

        <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 space-y-1">
          <div className="flex items-center gap-1.5 text-apple-purple font-bold text-xs">
            <Brain className="w-3.5 h-3.5" />
            <span>2. Fokus Warna</span>
          </div>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium leading-snug">
            Inhibisi kata dan warna tinta.
          </p>
        </div>

        <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 space-y-1">
          <div className="flex items-center gap-1.5 text-apple-blue font-bold text-xs">
            <Grid3X3 className="w-3.5 h-3.5" />
            <span>3. Memori Kerja</span>
          </div>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium leading-snug">
            Ulangi urutan balok spasial.
          </p>
        </div>

        <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 space-y-1">
          <div className="flex items-center gap-1.5 text-apple-teal font-bold text-xs">
            <Activity className="w-3.5 h-3.5" />
            <span>4. Ketukan Ritme</span>
          </div>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium leading-snug">
            Ketuk tempo stabil 15 detik.
          </p>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex justify-end pt-2 border-t border-black/[0.04] dark:border-white/[0.08]">
        <button
          onClick={onStart}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-apple-blue hover:opacity-90 active:scale-95 text-white font-bold text-xs shadow-sm transition-all"
        >
          <Play className="w-4 h-4 fill-white" />
          <span>Mulai Tes Sekarang</span>
        </button>
      </div>
    </div>
  );
};
