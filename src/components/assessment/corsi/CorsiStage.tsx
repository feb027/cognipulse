'use client';

import React from 'react';
import { CorsiTrial } from '@/types/corsi';
import { useCorsiRunner } from '@/hooks/use-corsi-runner';
import { CheckCircle2 } from 'lucide-react';
import { CorsiTutorial } from '../tutorials/CorsiTutorial';

interface CorsiStageProps {
  onComplete: (trials: CorsiTrial[]) => void;
}

export const CorsiStage: React.FC<CorsiStageProps> = ({ onComplete }) => {
  const {
    phase,
    currentRound,
    totalRounds,
    activeHighlightBlock,
    userTaps,
    feedbackText,
    handleBlockTap,
    startTest,
  } = useCorsiRunner({ onComplete });

  if (phase === 'tutorial') {
    return <CorsiTutorial onStartRealTest={startTest} />;
  }

  return (
    <div className="w-full flex flex-col space-y-3">
      {/* Progress Pill */}
      <div className="flex items-center justify-between px-4 py-2 rounded-2xl bg-zinc-100 dark:bg-zinc-800/60 text-xs">
        <span className="font-bold text-zinc-700 dark:text-zinc-300">
          Memori Kerja Spasial
        </span>
        <div className="flex items-center gap-1.5">
          <span className="text-zinc-400 font-semibold text-[11px]">
            Ronde {currentRound}/{totalRounds}
          </span>
        </div>
      </div>

      {/* Main Arena */}
      <div className="relative w-full p-4 sm:p-7 rounded-3xl bg-white dark:bg-[#1C1C1E] border border-black/5 dark:border-white/10 shadow-apple flex flex-col items-center justify-center space-y-4 sm:space-y-5">
        <div className="text-center space-y-1">
          <span className="inline-block px-3 py-0.5 rounded-full bg-apple-purple/10 text-apple-purple text-xs font-semibold">
            {phase === 'demonstrating' ? 'Amati Balok' : phase === 'recalling' ? 'Giliran Anda' : 'Memproses'}
          </span>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
            {feedbackText}
          </p>
        </div>

        {/* 3x3 Grid: Responsive, Large Touch Targets, Strictly Uniform Size */}
        <div className="grid grid-cols-3 grid-rows-3 gap-3 sm:gap-4 w-full max-w-[310px] sm:max-w-[350px] aspect-square p-1">
          {Array.from({ length: 9 }).map((_, idx) => {
            const isHighlighted = activeHighlightBlock === idx;
            const isUserTapped = userTaps.includes(idx);

            return (
              <button
                key={idx}
                type="button"
                disabled={phase !== 'recalling'}
                onClick={() => handleBlockTap(idx)}
                aria-label={`Balok ${idx + 1}`}
                className={`aspect-square w-full h-full rounded-2xl border-2 transition-colors duration-150 flex items-center justify-center select-none ${
                  isHighlighted
                    ? 'bg-apple-purple text-white border-apple-purple shadow-apple ring-4 ring-apple-purple/30'
                    : isUserTapped
                    ? 'bg-apple-purple/15 border-apple-purple text-apple-purple'
                    : 'bg-zinc-100 dark:bg-zinc-800/80 border-transparent hover:border-apple-purple/40 active:bg-zinc-200 dark:active:bg-zinc-700'
                }`}
              >
                <div className="w-6 h-6 flex items-center justify-center pointer-events-none">
                  {isUserTapped ? (
                    <CheckCircle2 className="w-5 h-5 text-apple-purple" />
                  ) : (
                    <span className="w-2.5 h-2.5 rounded-full bg-zinc-300 dark:bg-zinc-600" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Hint footer */}
        <div className="text-[11px] text-zinc-400 text-center font-medium">
          {phase === 'recalling'
            ? 'Ketuk kotak yang tadi menyala dengan urutan yang sama'
            : 'Perhatikan posisi balok yang menyala ungu'}
        </div>
      </div>
    </div>
  );
};
