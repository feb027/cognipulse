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
    <div
      onPointerDown={handlePointerResponse}
      style={{ touchAction: 'none' }}
      className="w-full flex-1 min-h-[calc(100dvh-12.5rem)] sm:min-h-[500px] flex flex-col justify-between py-1 select-none cursor-pointer"
    >
      {/* Sub-Progress Trial Dots */}
      <div className="flex items-center justify-between px-3.5 py-2 rounded-2xl bg-zinc-100/80 dark:bg-zinc-800/60 text-xs backdrop-blur-sm">
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
          <span className="text-zinc-400 font-semibold ml-1.5 text-[11px] font-mono tabular-nums">
            {currentTrialNumber}/{totalTrialsGoal}
          </span>
        </div>
      </div>

      {/* Natural Eye-Level Stimulus Display */}
      <div className="flex-1 flex flex-col items-center justify-center py-6 sm:py-8 pointer-events-none">
        <PVTTimerDisplay
          liveMs={liveDisplayMs}
          feedbackText={feedbackMessage}
          phase={phase}
        />
      </div>

      {/* Ergonomic Bottom Thumb Zone Tap Target */}
      <div className="w-full pt-2">
        <div
          role="button"
          tabIndex={0}
          aria-label="Area Ketukan Respon PVT"
          className={`w-full py-5 sm:py-6 px-4 rounded-3xl border transition-all text-center flex flex-col items-center justify-center ${
            phase === 'stimulus'
              ? 'bg-apple-green text-white border-apple-green shadow-apple ring-4 ring-apple-green/20 scale-[1.01]'
              : 'bg-zinc-100/90 dark:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300 border-zinc-200/80 dark:border-zinc-700/60'
          }`}
        >
          <span className="text-sm font-bold uppercase tracking-wider">
            {phase === 'stimulus' ? 'KETUK SEKARANG!' : 'Area Ketukan Jempol'}
          </span>
          <span className="text-[11px] opacity-75 font-medium mt-0.5">
            {phase === 'stimulus'
              ? 'Sentuh layar di mana saja seketika'
              : 'Tahan jari di sini, ketuk begitu hijau muncul'}
          </span>
        </div>
      </div>
    </div>
  );
};

