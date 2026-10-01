/**
 * Atomic UI: TelemetryDisplay
 * Render data angka telemetri dengan font monospace tabular dan hierarki label laboratorium.
 */

import React from 'react';

interface TelemetryDisplayProps {
  label: string;
  value: string | number;
  unit?: string;
  subValue?: string;
  highlightVariant?: 'emerald' | 'amber' | 'crimson' | 'cyan' | 'neutral';
  className?: string;
}

export const TelemetryDisplay: React.FC<TelemetryDisplayProps> = ({
  label,
  value,
  unit,
  subValue,
  highlightVariant = 'neutral',
  className = '',
}) => {
  const textColors = {
    emerald: 'text-emerald-400',
    amber: 'text-amber-400',
    crimson: 'text-rose-400',
    cyan: 'text-cyan-400',
    neutral: 'text-zinc-100',
  };

  return (
    <div className={`flex flex-col p-3 rounded bg-zinc-900/70 border border-zinc-800/80 ${className}`}>
      <span className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase mb-1">
        {label}
      </span>
      <div className="flex items-baseline gap-1.5">
        <span
          className={`text-2xl font-mono font-bold tracking-tight tabular-nums ${textColors[highlightVariant]}`}
        >
          {value}
        </span>
        {unit && <span className="text-xs font-mono text-zinc-400">{unit}</span>}
      </div>
      {subValue && (
        <span className="text-[11px] font-mono text-zinc-400 mt-1 truncate">
          {subValue}
        </span>
      )}
    </div>
  );
};
