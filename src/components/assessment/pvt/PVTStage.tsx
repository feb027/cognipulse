'use client';

import React, { useState } from 'react';
import { PVTTrial } from '@/types/pvt';
import { usePVTRunner } from '@/hooks/use-pvt-runner';
import { PVTTimerDisplay } from './PVTTimerDisplay';
import { PVTTutorial } from '../tutorials/PVTTutorial';

interface PVTStageProps {
  onComplete: (trials: PVTTrial[]) => void;
}

export const PVTStage: React.FC<PVTStageProps> = ({ onComplete }) => {
  const [showTutorial, setShowTutorial] = useState(true);

  const {
    phase,
    currentTrialNumber,
    totalTrialsGoal,
    liveDisplayMs,
    feedbackMessage,
    startNextTrial,
    handlePointerResponse,
  } = usePVTRunner({ totalTrialsGoal: 6, onComplete });

  const handleStartRealTest = () => {
    setShowTutorial(false);
    startNextTrial();
  };

  if (showTutorial) {
    return <PVTTutorial onStartRealTest={handleStartRealTest} />;
  }

  return (
    <div className="w-full flex flex-col space-y-3">
      {/* Progress Pill Bar */}
      <div className="flex items-center justify-between px-4 py-2 rounded-2xl bg-zinc-100 dark:bg-zinc-800/60 text-xs">
        <span className="font-bold text-zinc-700 dark:text-zinc-300">
          Uji Refleks Cepat (PVT)
        </span>

        <div className="flex items-center gap-1.5">
          {Array.from({ length: totalTrialsGoal }).map((_, idx) => (
            <span
              key={idx}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                idx + 1 === currentTrialNumber
                  ? 'bg-apple-orange scale-125 ring-2 ring-apple-orange/30'
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

      {/* Immersive Zen Stage Canvas */}
      <div
        onPointerDown={handlePointerResponse}
        role="button"
        tabIndex={0}
        aria-label="Area Respon PVT"
        style={{ touchAction: 'none' }}
        className="relative w-full h-80 sm:h-96 flex flex-col items-center justify-center p-6 rounded-3xl select-none cursor-pointer bg-white dark:bg-[#1C1C1E] border border-black/5 dark:border-white/10 shadow-apple active:scale-[0.99] transition-all"
      >
        <PVTTimerDisplay
          liveMs={liveDisplayMs}
          feedbackText={feedbackMessage}
          phase={phase}
        />

        <div className="absolute bottom-4 text-xs font-semibold text-zinc-400 dark:text-zinc-500 text-center px-4">
          Ketuk layar di mana saja segera setelah lingkaran hijau muncul
        </div>
      </div>
    </div>
  );
};
