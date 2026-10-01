'use client';

import React from 'react';
import { GeminiClinicalAnalysis } from '@/types/gemini';
import { Brain, AlertOctagon, TrendingDown } from 'lucide-react';

interface DiagnosticReportCardProps {
  analysis: GeminiClinicalAnalysis;
}

export const DiagnosticReportCard: React.FC<DiagnosticReportCardProps> = ({
  analysis,
}) => {
  const { differentialDiagnosis, fourHourRiskForecast } = analysis;

  const typeLabels: Record<string, string> = {
    optimal_vigilance: 'Mode Gacor • Fokus Prima & On-Fire',
    cognitive_overload: 'RAM Mental Overload • Butuh Refresh',
    sleep_deprived_microsleep: 'Baterai Drop • Kantuk Berat & Bengong',
    neuromuscular_exhaustion: 'Fisik Pegal • Otot & Saraf Lelah',
  };

  return (
    <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#1C1C1E] border border-black/5 dark:border-white/10 shadow-apple space-y-4 text-xs">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-black/[0.04] dark:border-white/[0.08] pb-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-apple-purple/10 flex items-center justify-center text-apple-purple">
            <Brain className="w-3.5 h-3.5" />
          </div>
          <h3 className="font-bold text-zinc-900 dark:text-white text-sm">
            Hasil Diagnosis AI
          </h3>
        </div>

        <span className="text-zinc-500 font-medium text-[11px]">
          Tingkat Keyakinan: {Math.round(differentialDiagnosis.confidenceScore * 100)}%
        </span>
      </div>

      {/* Critical warning if present */}
      {fourHourRiskForecast.criticalWarningAlert && (
        <div className="flex items-center gap-2.5 p-3.5 rounded-2xl bg-apple-red/10 border border-apple-red/20 text-apple-red text-xs font-semibold">
          <AlertOctagon className="w-4 h-4 shrink-0" />
          <span>{fourHourRiskForecast.criticalWarningAlert}</span>
        </div>
      )}

      {/* Main Condition Pill */}
      <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 space-y-1">
        <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
          Penyebab Utama Kelelahan
        </span>
        <span className="font-bold text-zinc-900 dark:text-white text-sm block">
          {typeLabels[differentialDiagnosis.primaryType] || differentialDiagnosis.primaryType}
        </span>
      </div>

      {/* Short 2-Sentence Rationale */}
      <div className="space-y-1">
        <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
          Ringkasan Kondisi:
        </span>
        <p className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 text-zinc-700 dark:text-zinc-300 leading-relaxed text-xs font-medium">
          {differentialDiagnosis.clinicalRationale}
        </p>
      </div>

      {/* 4-Hour Trajectory */}
      <div className="pt-2 border-t border-black/[0.04] dark:border-white/[0.08] space-y-2">
        <div className="flex items-center gap-1.5 text-xs text-zinc-700 dark:text-zinc-300 font-bold">
          <TrendingDown className="w-3.5 h-3.5 text-apple-orange" />
          <span>Perkiraan 2–4 Jam ke Depan</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 space-y-0.5">
            <span className="text-[10px] font-bold text-zinc-400 uppercase block">
              Potensi Turunnya Performa
            </span>
            <span className="text-base sm:text-lg font-extrabold text-apple-orange">
              {fourHourRiskForecast.decisionErrorProbabilityIncrease}
            </span>
          </div>
          <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 space-y-0.5">
            <span className="text-[10px] font-bold text-zinc-400 uppercase block">
              Dampak pada Refleks
            </span>
            <p className="text-xs text-zinc-600 dark:text-zinc-300 font-medium leading-relaxed">
              {fourHourRiskForecast.reactionTimeDecayTrajectory}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
