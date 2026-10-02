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
    <div className="w-full flex flex-col space-y-3">
      {/* Progress Pill Bar */}
      <div className="flex items-center justify-between px-4 py-2 rounded-2xl bg-zinc-100 dark:bg-zinc-800/60 text-xs">
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
          <span className="text-zinc-400 font-semibold ml-1.5 text-[11px]">
            {currentTrialNumber}/{totalTrialsGoal}
          </span>
        </div>
      </div>

      {/* Main Stimulus Screen */}
      <div
        onPointerDown={handleUserPress}
        role="button"
        tabIndex={0}
        aria-label="Area Respon Stroop"
        style={{ touchAction: 'none' }}
        className="relative w-full h-72 sm:h-80 flex flex-col items-center justify-center p-6 rounded-3xl bg-white dark:bg-[#1C1C1E] border border-black/5 dark:border-white/10 shadow-apple select-none cursor-pointer active:scale-[0.99] transition-all"
      >
        {phase === 'stimulus' || phase === 'feedback' ? (
          <div className="flex flex-col items-center justify-center space-y-3">
            <span
              style={{ color: currentColor }}
              className="text-6xl sm:text-7xl font-black tracking-tight select-none uppercase transition-transform scale-105"
            >
              {currentWord}
            </span>
            <StroopFeedback feedback={feedback} />
          </div>
        ) : (
          <span className="text-xs text-zinc-400 font-medium tracking-wide animate-pulse">
            Menyiapkan kata...
          </span>
        )}

        <div className="absolute bottom-4 text-xs text-zinc-500 dark:text-zinc-400 text-center px-4 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800/80 font-semibold">
          Jika WARNA = KATA ➔ <span className="text-apple-green font-bold">KETUK</span> &bull; Jika BEDA ➔ <span className="text-apple-orange font-bold">TAHAN</span>
        </div>
      </div>

      {/* Action Button */}
      <div className="flex justify-center pt-1">
        <button
          onPointerDown={handleUserPress}
          className="w-full py-4 text-sm font-bold bg-apple-green hover:opacity-95 text-white rounded-2xl shadow-apple active:scale-[0.97] transition-all"
        >
          COCOK (KETUK LAYAR)
        </button>
      </div>
    </div>
  );
};
