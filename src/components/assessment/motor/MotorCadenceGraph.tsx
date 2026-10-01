/**
 * Motor Component: MotorCadenceGraph
 * Visualisasi mini batang kestabilan jeda antar ketukan (Inter-Tap Intervals).
 */

import React from 'react';

interface MotorCadenceGraphProps {
  recentIntervals: number[];
}

export const MotorCadenceGraph: React.FC<MotorCadenceGraphProps> = ({
  recentIntervals,
}) => {
  if (recentIntervals.length === 0) {
    return (
      <div className="h-12 flex items-center justify-center text-[10px] font-mono text-zinc-400">
        [BELUM ADA KETUKAN TERCATAT]
      </div>
    );
  }

  const maxVal = Math.max(...recentIntervals, 500);

  return (
    <div className="flex items-end justify-center gap-1 h-12 w-full px-4 py-1 bg-zinc-950/60 rounded border border-zinc-800/80">
      {recentIntervals.map((iti, idx) => {
        const heightPercent = Math.min(100, Math.round((iti / maxVal) * 100));
        return (
          <div
            key={idx}
            style={{ height: `${heightPercent}%` }}
            className="w-2 rounded-t bg-cyan-500/80 transition-all duration-75"
            title={`${iti} ms`}
          />
        );
      })}
    </div>
  );
};
