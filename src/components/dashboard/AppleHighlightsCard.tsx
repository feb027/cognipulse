'use client';

import React from 'react';
import { Sparkles, ArrowRight, AlertTriangle } from 'lucide-react';
import { AssessmentResult } from '@/types';

interface AppleHighlightsCardProps {
  latestResult: AssessmentResult | null;
  onStartAssessment: () => void;
}

export const AppleHighlightsCard: React.FC<AppleHighlightsCardProps> = ({
  latestResult,
  onStartAssessment,
}) => {
  const isHealthy = !latestResult || latestResult.cfi.impairmentTier === 'fit';
  const isSilentFatigue = Boolean(latestResult?.cfi.subjectiveObjectiveDisparity);

  return (
    <div className="relative overflow-hidden bg-white dark:bg-[#1C1C1E] rounded-3xl p-5 sm:p-6 shadow-apple border border-black/[0.04] dark:border-white/[0.08] mb-3">
      {/* Background Soft Glow */}
      <div
        className={`absolute -top-16 -right-16 w-40 h-40 rounded-full blur-3xl pointer-events-none opacity-20 ${
          isSilentFatigue
            ? 'bg-apple-red'
            : isHealthy
            ? 'bg-apple-green'
            : 'bg-apple-yellow'
        }`}
      />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-apple-purple/10 flex items-center justify-center text-apple-purple">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-apple-purple">
              Kondisi Kognitif Anda
            </span>
          </div>
          {latestResult && (
            <span className="text-[11px] text-zinc-400 font-medium">
              {new Date(latestResult.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
        </div>

        {/* 2-Sentence Concise & Friendly Rationale */}
        <div className="mb-3.5">
          <p className="text-base sm:text-lg font-bold tracking-tight text-zinc-900 dark:text-white leading-relaxed">
            {latestResult
              ? latestResult.diagnosis.differentialDiagnosis.clinicalRationale
              : 'Belum ada data evaluasi hari ini. Luangkan 75 detik untuk memeriksa kesiapan refleks dan fokus Anda.'}
          </p>

          {isSilentFatigue && (
            <div className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-apple-red/10 text-apple-red text-xs font-semibold">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
              <span>Peringatan: Tubuh mulai lelah meski Anda merasa segar.</span>
            </div>
          )}
        </div>

        {/* Bottom Action Only - Zero Clutter */}
        <div className="flex justify-end pt-1">
          <button
            onClick={onStartAssessment}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-xs font-bold hover:opacity-90 active:scale-95 transition-all shadow-sm"
          >
            <span>{latestResult ? 'Uji Ulang' : 'Mulai Asesmen'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
