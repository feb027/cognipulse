'use client';

import React from 'react';
import { PVTMetrics } from '@/types/pvt';
import { StroopMetrics } from '@/types/stroop';
import { MotorMetrics } from '@/types/motor';
import { Activity } from 'lucide-react';

interface TelemetryBreakdownProps {
  pvt: PVTMetrics;
  stroop: StroopMetrics;
  motor: MotorMetrics;
}

export const TelemetryBreakdown: React.FC<TelemetryBreakdownProps> = ({
  pvt,
  stroop,
  motor,
}) => {
  const getSpeedColor = (s: number) => (s >= 4.0 ? 'text-apple-green' : s >= 3.0 ? 'text-apple-orange' : 'text-apple-red');
  const getLapseColor = (l: number) => (l === 0 ? 'text-apple-green' : l <= 2 ? 'text-apple-orange' : 'text-apple-red');
  const getStroopColor = (sc: number) => (sc >= 80 ? 'text-apple-purple' : sc >= 60 ? 'text-apple-orange' : 'text-apple-red');
  const getJitterColor = (j: number) => (j < 15 ? 'text-apple-teal' : j < 30 ? 'text-apple-orange' : 'text-apple-red');

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-700 dark:text-zinc-300 px-1">
        <Activity className="w-3.5 h-3.5 text-apple-blue" />
        <span>Rincian Hasil Tes</span>
      </div>

      {/* 4-Channel Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-black/5 dark:divide-white/10 bg-white dark:bg-[#1C1C1E] border border-black/5 dark:border-white/10 rounded-3xl overflow-hidden shadow-apple">
        {/* Channel 1: Kecepatan Refleks */}
        <div className="p-4 space-y-1">
          <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
            Kecepatan Refleks
          </span>
          <div className="flex items-baseline gap-1">
            <span className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${getSpeedColor(pvt.responseSpeed)}`}>
              {pvt.responseSpeed}
            </span>
            <span className="text-xs font-semibold text-zinc-400">s⁻¹</span>
          </div>
          <span className="text-[11px] text-zinc-500 dark:text-zinc-400 block font-medium">
            Rerata: {pvt.meanReactionTimeMs} ms
          </span>
        </div>

        {/* Channel 2: Hilang Fokus (Bengong) */}
        <div className="p-4 space-y-1">
          <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
            Hilang Fokus
          </span>
          <div className="flex items-baseline gap-1">
            <span className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${getLapseColor(pvt.attentionalLapseCount)}`}>
              {pvt.attentionalLapseCount}
            </span>
            <span className="text-xs font-semibold text-zinc-400">x</span>
          </div>
          <span className="text-[11px] text-zinc-500 dark:text-zinc-400 block font-medium">
            {pvt.attentionalLapseCount === 0 ? 'Fokus terjaga' : 'Terlambat merespon'}
          </span>
        </div>

        {/* Channel 3: Akurasi Respon */}
        <div className="p-4 space-y-1">
          <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
            Akurasi Respon
          </span>
          <div className="flex items-baseline gap-1">
            <span className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${getStroopColor(stroop.inhibitoryControlScore)}`}>
              {stroop.inhibitoryControlScore}
            </span>
            <span className="text-xs font-semibold text-zinc-400">/100</span>
          </div>
          <span className="text-[11px] text-zinc-500 dark:text-zinc-400 block font-medium">
            Ketepatan: {stroop.accuracyRate}%
          </span>
        </div>

        {/* Channel 4: Variasi Ketukan */}
        <div className="p-4 space-y-1">
          <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
            Variasi Ketukan
          </span>
          <div className="flex items-baseline gap-1">
            <span className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${getJitterColor(motor.itiStandardDeviationMs)}`}>
              ±{motor.itiStandardDeviationMs}
            </span>
            <span className="text-xs font-semibold text-zinc-400">ms</span>
          </div>
          <span className="text-[11px] text-zinc-500 dark:text-zinc-400 block font-medium">
            {motor.itiStandardDeviationMs < 20 ? 'Ketukan stabil' : 'Ketukan berfluktuasi'}
          </span>
        </div>
      </div>
    </div>
  );
};
