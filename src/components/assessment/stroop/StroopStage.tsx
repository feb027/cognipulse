'use client';

import React, { useState } from 'react';
import { StroopTrial } from '@/types/stroop';
import { useStroopRunner } from '@/hooks/use-stroop-runner';
import { StroopFeedback } from './StroopFeedback';
import { StroopTutorial } from '../tutorials/StroopTutorial';

interface StroopStageProps {
  onComplete: (trials: StroopTrial[]) => void;
}

export const StroopStage: React.FC<StroopStageProps> = ({ onComplete }) => {
  const [showTutorial, setShowTutorial] = useState(true);

  const {
    phase,
    currentTrialNumber,
    totalTrialsGoal,
    currentWord,
    currentColor,
    feedback,
    startTest,
    handleUserPress,
  } = useStroopRunner({ totalTrialsGoal: 8, onComplete });

  const handleStart = () => {
    setShowTutorial(false);
    startTest();
  };

  if (showTutorial) {
    return <StroopTutorial onStartRealTest={handleStart} />;
  }

  return (
    <div
      style={{ touchAction: 'none' }}
      className="w-full flex-1 min-h-[calc(100dvh-12.5rem)] sm:min-h-[500px] flex flex-col justify-between py-1 select-none"
    >
      {/* Sub-Progress Trial Dots */}
      <div className="flex items-center justify-between px-3.5 py-2 rounded-2xl bg-zinc-100/80 dark:bg-zinc-800/60 text-xs backdrop-blur-sm">
        <span className="font-bold text-zinc-700 dark:text-zinc-300">
          Uji Fokus Warna & Kata (Stroop)
        </span>

        <div className="flex items-center gap-1.5">
          {Array.from({ length: totalTrialsGoal }).map((_, idx) => (
            <span
              key={idx}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                idx + 1 === currentTrialNumber
                  ? 'bg-apple-purple scale-125 ring-2 ring-apple-purple/30'
                  : idx + 1 < currentTrialNumber
                  ? 'bg-apple-green'
                  : 'bg-zinc-300 dark:bg-zinc-600'
              }`}
            />
          ))}
          <span className="text-zinc-400 font-semibold ml-1.5 text-[11px] font-mono tabular-nums">
            {currentTrialNumber}/{totalTrialsGoal}
          </span>
        </div>
      </div>

      {/* Natural Eye-Level Stimulus Display */}
      <div
        onPointerDown={handleUserPress}
        role="button"
        tabIndex={0}
        aria-label="Area Stimulus Stroop"
        className="flex-1 flex flex-col items-center justify-center py-6 sm:py-8 cursor-pointer"
      >
        {phase === 'stimulus' || phase === 'feedback' ? (
          <div className="flex flex-col items-center justify-center space-y-3">
            <span
              style={{ color: currentColor }}
              className="text-6xl sm:text-7xl font-black tracking-tight select-none uppercase transition-transform scale-105 drop-shadow-sm"
            >
              {currentWord}
            </span>
            <StroopFeedback feedback={feedback} />
          </div>
        ) : (
          <span className="text-xs text-zinc-400 font-medium tracking-wide animate-pulse">
            Menyiapkan kata berikutnya...
          </span>
        )}
      </div>

      {/* Bottom Thumb Zone Action Area */}
      <div className="w-full space-y-2 pt-2">
        <div className="text-center text-xs text-zinc-500 dark:text-zinc-400 font-medium py-1">
          Jika WARNA = KATA ➔ <span className="text-apple-green font-bold">KETUK</span> &bull; Jika BEDA ➔ <span className="text-apple-orange font-bold">TAHAN</span>
        </div>

        <button
          onPointerDown={handleUserPress}
          aria-label="Tombol Cocok Warna dan Kata"
          className="w-full py-5 text-sm sm:text-base font-bold bg-apple-green hover:opacity-95 text-white rounded-3xl shadow-apple active:scale-[0.98] transition-all cursor-pointer"
        >
          COCOK (WARNA = KATA)
        </button>
      </div>
    </div>
  );
};

