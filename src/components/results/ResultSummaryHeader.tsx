'use client';

import React from 'react';
import { CompositeFatigueResult } from '@/types/assessment';
import { AlertTriangle } from 'lucide-react';

interface ResultSummaryHeaderProps {
  cfi: CompositeFatigueResult;
}

export const ResultSummaryHeader: React.FC<ResultSummaryHeaderProps> = ({ cfi }) => {
  const fatigueScore = Math.max(0, Math.min(100, cfi.cfiScore));
  const readinessScore = Math.max(0, Math.min(100, 100 - cfi.cfiScore));
  const radius = 44;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (readinessScore / 100) * circumference;

  const getTierInfo = () => {
    switch (cfi.impairmentTier) {
      case 'fit':
        return {
          stroke: '#34C759',
          textColor: 'text-apple-green',
          title: 'Kesiapan Kerja Optimal (Prima)',
          badge: 'Kondisi Bugar',
          badgeClass: 'bg-apple-green/10 text-apple-green',
          desc: 'Refleks sensorimotor sangat responsif, atensi sustained stabil, dan siap menjalankan tugas berintensitas tinggi.',
        };
      case 'critical_hazard':
        return {
          stroke: '#FF2D55',
          textColor: 'text-apple-red',
          title: 'Kesiapan Rendah (Kelelahan Kritis)',
          badge: 'Kritis',
          badgeClass: 'bg-apple-red/10 text-apple-red',
          desc: 'Refleks melambat signifikan dan terindikasi risiko lapses/micro-sleep. Wajib stand-down dan istirahat.',
        };
      default:
        return {
          stroke: '#FF9500',
          textColor: 'text-apple-orange',
          title: 'Kesiapan Cukup (Perlu Waspada)',
          badge: 'Waspada',
          badgeClass: 'bg-apple-yellow/10 text-apple-yellow',
          desc: 'Kecepatan reaksi mulai menurun secara bertahap. Disarankan mengambil jeda pemulihan singkat.',
        };
    }
  };

  const tier = getTierInfo();

  return (
    <section className="bg-white dark:bg-[#1C1C1E] rounded-3xl p-5 sm:p-6 shadow-apple border border-black/[0.04] dark:border-white/[0.08] space-y-3.5">
      {/* Silent Fatigue Alert */}
      {cfi.subjectiveObjectiveDisparity && (
        <div className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-apple-red/10 border border-apple-red/20 text-xs">
          <AlertTriangle className="w-4 h-4 text-apple-red shrink-0 mt-0.5" />
          <p className="text-zinc-700 dark:text-zinc-200 leading-relaxed font-medium">
            <strong className="text-apple-red font-bold">Peringatan Silent Fatigue:</strong> Secara subjektif Anda merasa segar, namun telemetri objektif mendeteksi penurunan refleks atau kontrol inhibisi. Hindari memaksakan diri pada tugas berisiko tinggi.
          </p>
        </div>
      )}

      {/* Ring Gauge & Verdict */}
      <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
        {/* Dial Circle */}
        <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 108 108">
            <circle
              cx="54"
              cy="54"
              r={radius}
              stroke="currentColor"
              strokeWidth={strokeWidth}
              fill="none"
              className="text-zinc-100 dark:text-zinc-800"
            />
            <circle
              cx="54"
              cy="54"
              r={radius}
              stroke={tier.stroke}
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="none"
              className="transition-all duration-700 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className={`text-2xl sm:text-3xl font-extrabold tracking-tight font-mono tabular-nums ${tier.textColor}`}>
              {readinessScore}
            </span>
            <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">
              Kesiapan
            </span>
          </div>
        </div>

        {/* Verdict Details */}
        <div className="space-y-1 text-center sm:text-left flex-1 min-w-0">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <span className="text-xs font-semibold text-zinc-400">
              Kesiapan Kerja
            </span>
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${tier.badgeClass}`}>
              {tier.badge}
            </span>
            <span className="text-[11px] font-mono text-zinc-400 dark:text-zinc-500">
              • Kelelahan: {fatigueScore}%
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-extrabold tracking-tight text-zinc-900 dark:text-white break-words">
            {tier.title}
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed">
            {tier.desc}
          </p>
        </div>
      </div>
    </section>
  );
};
