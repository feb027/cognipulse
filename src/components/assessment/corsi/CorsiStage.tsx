'use client';

import React from 'react';
import { CorsiTrial } from '@/types/corsi';
import { useCorsiRunner } from '@/hooks/use-corsi-runner';
import { CheckCircle2 } from 'lucide-react';

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
    return (
      <div className="w-full max-w-md mx-auto p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#1C1C1E] border border-black/5 dark:border-white/10 shadow-apple space-y-4 animate-springUp">
        <div className="space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-apple-purple">
            Tahap 3 • Memori Spasial
          </span>
          <h3 className="text-xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
            Uji Urutan Balok
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
            Tes ini mengukur kapasitas memori kerja visual dan daya konsentrasi otak.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-black/5 dark:border-white/5 space-y-2.5 text-xs text-zinc-700 dark:text-zinc-300">
          <div className="flex items-start gap-2.5">
            <span className="w-5 h-5 rounded-full bg-apple-purple text-white flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">1</span>
            <span>Perhatikan beberapa kotak yang akan <strong>menyala ungu</strong> secara bergantian.</span>
          </div>
          <div className="flex items-start gap-2.5">
            <span className="w-5 h-5 rounded-full bg-apple-purple text-white flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">2</span>
            <span>Setelah selesai menyala, <strong>ketuk kotak-kotak tersebut</strong> dengan urutan yang sama persis.</span>
          </div>
        </div>

        <button
          onClick={startTest}
          className="w-full py-3 rounded-full bg-apple-purple hover:opacity-90 active:scale-95 text-white font-bold text-xs shadow-sm transition-all"
        >
          Saya Mengerti • Mulai Uji
        </button>
      </div>
    );
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

        {/* 3x3 Grid of Corsi Blocks */}
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
                className={`rounded-2xl border transition-all duration-150 flex items-center justify-center select-none ${
                  isHighlighted
                    ? 'bg-apple-purple text-white border-apple-purple scale-105 shadow-apple ring-4 ring-apple-purple/30'
                    : isUserTapped
                    ? 'bg-apple-purple/20 border-apple-purple text-apple-purple scale-95'
                    : 'bg-zinc-100 dark:bg-zinc-800/80 border-black/5 dark:border-white/10 hover:border-apple-purple/40 active:scale-95'
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
