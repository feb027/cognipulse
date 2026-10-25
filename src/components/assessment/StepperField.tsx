'use client';

import React from 'react';

export interface StepperProps {
  label: string;
  sublabel: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onStep: (delta: number) => void;
  onChange: (val: number) => void;
}

export function StepperField({
  label,
  sublabel,
  value,
  min,
  max,
  step,
  onStep,
  onChange,
}: StepperProps) {
  const btnClass =
    'w-9 h-9 rounded-xl bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-100 font-bold text-lg flex items-center justify-center shadow-sm active:scale-90 disabled:opacity-30 disabled:pointer-events-none transition-all touch-manipulation';

  return (
    <div className="p-3 bg-zinc-50 dark:bg-zinc-800/60 rounded-2xl flex items-center justify-between">
      <div>
        <label className="text-xs text-zinc-600 dark:text-zinc-300 font-semibold block">{label}</label>
        <span className="text-[11px] text-zinc-400">{sublabel}</span>
      </div>
      <div className="flex items-center bg-zinc-200/70 dark:bg-zinc-700/60 p-1 rounded-2xl border border-black/5 dark:border-white/10 touch-manipulation">
        <button
          type="button"
          onClick={() => onStep(-1)}
          disabled={value <= min}
          aria-label={`Kurangi ${label}`}
          className={btnClass}
        >
          −
        </button>
        <div className="flex items-center justify-center px-1.5 min-w-16">
          <input
            type="number"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => {
              const v = parseFloat(e.target.value);
              onChange(isNaN(v) ? min : Math.min(max, Math.max(min, v)));
            }}
            className="w-10 text-center font-mono font-bold text-sm bg-transparent text-zinc-900 dark:text-white tabular-nums outline-none p-0 focus:ring-1 focus:ring-apple-blue rounded"
            aria-label={`Input angka ${label}`}
          />
          <span className="font-sans text-[11px] font-medium text-zinc-400 select-none ml-0.5">jam</span>
        </div>
        <button
          type="button"
          onClick={() => onStep(1)}
          disabled={value >= max}
          aria-label={`Tambah ${label}`}
          className={btnClass}
        >
          +
        </button>
      </div>
    </div>
  );
}
