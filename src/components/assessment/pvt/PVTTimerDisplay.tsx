'use client';

import React from 'react';

interface PVTTimerDisplayProps {
  liveMs: number | null;
  feedbackText: string | null;
  phase: 'waiting' | 'stimulus' | 'feedback' | 'finished';
}

export const PVTTimerDisplay: React.FC<PVTTimerDisplayProps> = ({
  liveMs,
  feedbackText,
  phase,
}) => {
  if (phase === 'waiting') {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 animate-fadeIn">
        <div className="relative w-24 h-24 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-2 border-zinc-200 dark:border-zinc-700 animate-ping opacity-30" />
          <div className="w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-800/80 border border-black/5 dark:border-white/10 flex items-center justify-center shadow-sm">
            <div className="w-4 h-4 rounded-full bg-apple-orange/80 animate-pulse" />
          </div>
        </div>
        <p className="text-zinc-500 dark:text-zinc-400 font-semibold text-xs tracking-tight">
          Fokus pada layar... Tunggu sinyal hijau
        </p>
      </div>
    );
  }

  if (phase === 'feedback' && feedbackText) {
    const isFalseStart = feedbackText.includes('FALSE');
    const isLapse = feedbackText.includes('LAPSE');

    const msMatch = feedbackText.match(/\d+/);
    const msValue = msMatch ? msMatch[0] : (liveMs !== null ? String(liveMs) : null);

    if (isFalseStart) {
      return (
        <div className="flex flex-col items-center justify-center space-y-2.5 animate-springUp">
          <div className="w-32 h-32 rounded-full flex flex-col items-center justify-center text-white shadow-applePill transition-transform bg-apple-red">
            <span className="text-sm font-bold text-center px-3 leading-snug">
              Terlalu Cepat
            </span>
          </div>
          <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
            Hindari menekan sebelum warna hijau muncul
          </span>
        </div>
      );
    }

    if (isLapse) {
      return (
        <div className="flex flex-col items-center justify-center space-y-2.5 animate-springUp">
          <div className="w-32 h-32 rounded-full flex flex-col items-center justify-center text-white shadow-applePill transition-transform bg-apple-orange">
            <span className="text-3xl font-extrabold font-mono tracking-tight tabular-nums">
              {msValue ?? '500+'}
            </span>
            <span className="text-[11px] font-bold text-white/90">milidetik</span>
            <span className="text-[10px] font-bold text-white/80 uppercase tracking-wider mt-0.5">
              Respon Lambat
            </span>
          </div>
          <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
            Refleks tercatat • Terdeteksi jeda atensi (&ge;500ms)
          </span>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center space-y-2.5 animate-springUp">
        <div className="w-32 h-32 rounded-full flex flex-col items-center justify-center text-white shadow-applePill transition-transform bg-apple-green">
          <span className="text-3xl font-extrabold font-mono tracking-tight tabular-nums">
            {msValue ?? feedbackText.replace(' ms', '')}
          </span>
          <span className="text-[11px] font-bold text-white/80">milidetik</span>
        </div>
        <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
          Refleks tercatat • Respon optimal
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-3 animate-springUp">
      <div className="w-32 h-32 rounded-full bg-apple-green text-white shadow-applePill flex flex-col items-center justify-center scale-105 active:scale-95 transition-transform duration-75">
        <span className="text-4xl font-extrabold font-mono tracking-tight tabular-nums">
          {liveMs ?? 0}
        </span>
        <span className="text-[11px] font-bold text-white/90 uppercase tracking-wider">
          Ketuk Sekarang!
        </span>
      </div>
    </div>
  );
};
