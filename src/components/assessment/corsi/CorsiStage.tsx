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
      <div className="relative w-full p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1C1C1E] border border-black/5 dark:border-white/10 shadow-apple flex flex-col items-center justify-center space-y-5">
        <div className="text-center space-y-1">
          <span className="inline-block px-3 py-0.5 rounded-full bg-apple-purple/10 text-apple-purple text-xs font-semibold">
            {phase === 'demonstrating' ? 'Amati Balok' : phase === 'recalling' ? 'Giliran Anda' : 'Memproses'}
          </span>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
            {feedbackText}
          </p>
        </div>

        {/* 3x3 Grid of Corsi Blocks (Rock-solid non-moving buttons) */}
        <div className="grid grid-cols-3 gap-3.5 sm:gap-4 w-64 h-64 sm:w-72 sm:h-72 p-2">
          {Array.from({ length: 9 }).map((_, idx) => {
            const isHighlighted = activeHighlightBlock === idx;
            const isUserTapped = userTaps.includes(idx);

            return (
              <button
                key={idx}
                disabled={phase !== 'recalling'}
                onClick={() => handleBlockTap(idx)}
                aria-label={`Balok ${idx + 1}`}
                className={`rounded-2xl border transition-colors duration-150 flex items-center justify-center select-none w-full h-full ${
                  isHighlighted
                    ? 'bg-apple-purple text-white border-apple-purple shadow-apple ring-4 ring-apple-purple/30'
                    : isUserTapped
                    ? 'bg-apple-purple/20 border-apple-purple text-apple-purple'
                    : 'bg-zinc-100 dark:bg-zinc-800/80 border-black/5 dark:border-white/10 hover:border-apple-purple/40 active:bg-zinc-200 dark:active:bg-zinc-700'
                }`}
              >
                {isUserTapped ? (
                  <CheckCircle2 className="w-5 h-5 text-apple-purple" />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-zinc-300 dark:bg-zinc-600" />
                )}
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
