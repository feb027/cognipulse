/**
 * Results Component: FourHourRiskRadar
 * Proyeksi trajektori risiko penurunan performa dan probabilitas error 2-4 jam ke depan.
 */

import React from 'react';
import { FourHourRiskForecast } from '@/types/gemini';
import { TrendingDown, AlertOctagon } from 'lucide-react';

interface FourHourRiskRadarProps {
  forecast: FourHourRiskForecast;
}

export const FourHourRiskRadar: React.FC<FourHourRiskRadarProps> = ({ forecast }) => {
  return (
    <div className="p-4 rounded-lg bg-zinc-900/90 border border-zinc-800 space-y-3">
      <div className="flex items-center gap-2 border-b border-zinc-800 pb-2">
        <TrendingDown className="w-5 h-5 text-amber-400" />
        <h3 className="text-sm font-bold text-zinc-100 font-sans tracking-tight uppercase">
          Proyeksi Risiko Kerja 2–4 Jam ke Depan
        </h3>
      </div>

      {forecast.criticalWarningAlert && (
        <div className="flex items-center gap-2 p-2.5 rounded bg-rose-950/60 border border-rose-800 text-rose-300 text-xs font-mono font-semibold">
          <AlertOctagon className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{forecast.criticalWarningAlert}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
        <div className="p-3 rounded bg-zinc-950/60 border border-zinc-800/80">
          <span className="text-[10px] text-zinc-400 uppercase block mb-1">
            Lonjakan Probabilitas Error:
          </span>
          <span className="text-xl font-bold text-amber-400">
            {forecast.decisionErrorProbabilityIncrease}
          </span>
        </div>

        <div className="p-3 rounded bg-zinc-950/60 border border-zinc-800/80">
          <span className="text-[10px] text-zinc-400 uppercase block mb-1">
            Trajektori Waktu Reaksi:
          </span>
          <p className="text-xs text-zinc-300 font-sans leading-relaxed">
            {forecast.reactionTimeDecayTrajectory}
          </p>
        </div>
      </div>
    </div>
  );
};
