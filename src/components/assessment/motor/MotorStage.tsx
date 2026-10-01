'use client';

import React from 'react';
import { TapEvent } from '@/types/motor';
import { useMotorRunner } from '@/hooks/use-motor-runner';
import { MotorCadenceGraph } from './MotorCadenceGraph';
import { Fingerprint, Play } from 'lucide-react';

interface MotorStageProps {
  onComplete: (events: TapEvent[]) => void;
}

export const MotorStage: React.FC<MotorStageProps> = ({ onComplete }) => {
  const {
    isActive,
    timeLeft,
    tapCount,
    recentIntervals,
    startTappingSession,
    recordTap,
  } = useMotorRunner({ durationSeconds: 15, onComplete });

  return (
    <div className="w-full flex flex-col space-y-3">
      {/* Header Info Bar */}
      <div className="flex items-center justify-between px-4 py-2 rounded-2xl bg-zinc-100 dark:bg-zinc-800/60 text-xs">
        <span className="font-bold text-zinc-700 dark:text-zinc-300">
          Uji Kestabilan Ketukan (15 Detik)
        </span>

        <div className="flex items-center gap-1.5">
          <span className="text-zinc-400 font-medium text-[11px]">Sisa:</span>
          <span className="px-2.5 py-0.5 rounded-full bg-white dark:bg-zinc-700 font-bold text-apple-teal text-xs shadow-sm">
            {timeLeft}s
          </span>
        </div>
      </div>

      {/* Main Interactive Tap Area */}
      <div className="relative w-full p-6 rounded-3xl bg-white dark:bg-[#1C1C1E] border border-black/5 dark:border-white/10 shadow-apple flex flex-col items-center justify-center space-y-4">
        {!isActive && timeLeft === 15 ? (
          <div className="flex flex-col items-center justify-center py-6 space-y-4 text-center max-w-sm">
            <div className="w-14 h-14 rounded-full bg-apple-teal/10 flex items-center justify-center text-apple-teal">
              <Fingerprint className="w-7 h-7" />
            </div>
            <div className="space-y-1.5">
              <h4 className="text-base font-bold text-zinc-900 dark:text-white">
                Ketukan Ritmis Teratur
              </h4>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium">
                Ketuk tombol secara <strong>teratur dan konstan</strong> selama 15 detik. Tes ini mendeteksi variasi tremor motorik mikro pada jari.
              </p>
            </div>
            <button
              onClick={startTappingSession}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-apple-teal hover:opacity-90 active:scale-95 text-white font-bold text-xs shadow-apple transition-all"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Mulai Ketukan (15s)</span>
            </button>
          </div>
        ) : (
          <div className="w-full flex flex-col items-center space-y-4">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
                {tapCount}
              </span>
              <span className="text-xs text-zinc-400 font-semibold uppercase">Ketukan</span>
            </div>

            <MotorCadenceGraph recentIntervals={recentIntervals} />

            <button
              onPointerDown={recordTap}
              aria-label="Tombol Ketukan Ritmis"
              style={{ touchAction: 'none' }}
              className="w-full h-44 sm:h-48 rounded-3xl bg-zinc-50 dark:bg-zinc-800/60 hover:bg-zinc-100 dark:hover:bg-zinc-800 border-2 border-apple-teal/30 active:border-apple-teal active:scale-[0.98] transition-all flex flex-col items-center justify-center select-none cursor-pointer"
            >
              <Fingerprint className="w-12 h-12 text-apple-teal mb-2 pointer-events-none" />
              <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-wider pointer-events-none">
                Ketuk Teratur di Sini
              </span>
              <span className="text-[11px] text-zinc-400 font-medium mt-0.5 pointer-events-none">
                Pertahankan tempo yang stabil
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
