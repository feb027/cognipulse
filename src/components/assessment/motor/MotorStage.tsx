'use client';

import React, { useState } from 'react';
import { TapEvent } from '@/types/motor';
import { useMotorRunner } from '@/hooks/use-motor-runner';
import { MotorCadenceGraph } from './MotorCadenceGraph';
import { Fingerprint } from 'lucide-react';
import { MotorTutorial } from '../tutorials/MotorTutorial';

interface MotorStageProps {
  onComplete: (events: TapEvent[]) => void;
}

export const MotorStage: React.FC<MotorStageProps> = ({ onComplete }) => {
  const [showTutorial, setShowTutorial] = useState(true);

  const {
    isActive,
    timeLeft,
    tapCount,
    recentIntervals,
    startTappingSession,
    recordTap,
  } = useMotorRunner({ durationSeconds: 15, onComplete });

  const handleStartRealTest = () => {
    setShowTutorial(false);
    startTappingSession();
  };

  if (showTutorial && !isActive) {
    return <MotorTutorial onStartRealTest={handleStartRealTest} />;
  }

  return (
    <div
      style={{ touchAction: 'none' }}
      className="w-full flex-1 min-h-[calc(100dvh-12.5rem)] sm:min-h-[500px] flex flex-col justify-between py-1 select-none"
    >
      {/* Header Info Bar */}
      <div className="flex items-center justify-between px-3.5 py-2 rounded-2xl bg-zinc-100/80 dark:bg-zinc-800/60 text-xs backdrop-blur-sm">
        <span className="font-bold text-zinc-700 dark:text-zinc-300">
          Uji Kestabilan Ketukan (15 Detik)
        </span>

        <div className="flex items-center gap-1.5">
          <span className="text-zinc-400 font-medium text-[11px]">Sisa:</span>
          <span className="px-2.5 py-0.5 rounded-full bg-apple-teal/15 font-bold text-apple-teal text-xs">
            {timeLeft}s
          </span>
        </div>
      </div>

      {/* Eye-Level Cadence Biofeedback */}
      <div className="flex-1 flex flex-col items-center justify-center py-4 sm:py-6 space-y-3 pointer-events-none">
        <div className="flex items-baseline gap-2">
          <span className="text-5xl font-black text-zinc-900 dark:text-white font-mono tabular-nums tracking-tight">
            {tapCount}
          </span>
          <span className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">Ketukan</span>
        </div>

        <div className="w-full max-w-xs">
          <MotorCadenceGraph recentIntervals={recentIntervals} />
        </div>
      </div>

      {/* Massive Bottom Thumb Zone Tap Target */}
      <div className="w-full pt-2">
        <button
          onPointerDown={recordTap}
          aria-label="Tombol Ketukan Ritmis"
          style={{ touchAction: 'none' }}
          className="w-full h-44 sm:h-52 rounded-3xl bg-zinc-100 dark:bg-zinc-800/80 hover:bg-zinc-200/70 dark:hover:bg-zinc-800 border-2 border-apple-teal/30 active:border-apple-teal active:bg-apple-teal/15 active:scale-[0.98] transition-all flex flex-col items-center justify-center select-none cursor-pointer shadow-apple"
        >
          <Fingerprint className="w-12 h-12 text-apple-teal mb-2 pointer-events-none" />
          <span className="text-sm font-bold text-zinc-800 dark:text-zinc-100 uppercase tracking-wider pointer-events-none">
            Ketuk Teratur di Sini
          </span>
          <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium mt-0.5 pointer-events-none">
            Pertahankan tempo ritmik yang stabil
          </span>
        </button>
      </div>
    </div>
  );
};

