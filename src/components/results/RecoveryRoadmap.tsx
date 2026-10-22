'use client';

import React from 'react';
import { PrecisionRecoveryPrescription } from '@/types/gemini';
import { Droplets, Clock, ShieldCheck, AlertCircle, Coffee } from 'lucide-react';

interface RecoveryRoadmapProps {
  prescription: PrecisionRecoveryPrescription;
  severityLevel?: string;
}

export const RecoveryRoadmap: React.FC<RecoveryRoadmapProps> = ({
  prescription,
  severityLevel,
}) => {
  const isFit = severityLevel === 'fit';

  return (
    <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#1C1C1E] border border-black/5 dark:border-white/10 shadow-apple space-y-4 text-xs">
      <div className="flex items-center gap-2 border-b border-black/[0.04] dark:border-white/[0.08] pb-3">
        <div
          className={`w-6 h-6 rounded-full flex items-center justify-center ${
            isFit
              ? 'bg-apple-green/10 text-apple-green'
              : 'bg-apple-orange/10 text-apple-orange'
          }`}
        >
          {isFit ? <ShieldCheck className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
        </div>
        <div>
          <h3 className="font-bold text-zinc-900 dark:text-white text-sm">
            {isFit ? 'Protokol Kesiapan Jalan (Operational Readiness)' : 'Protokol Pemulihan & Mitigasi Risiko'}
          </h3>
          <span className="text-[10px] text-zinc-400 font-medium block">
            {isFit
              ? 'Panduan operasional supir sebelum keberangkatan lintas tol'
              : 'Intervensi pemulihan kognitif untuk memulihkan atensi refleks'}
          </span>
        </div>
      </div>

      {/* 3 Pillars */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* 1. Langkah Utama */}
        <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 space-y-1.5 border border-black/5 dark:border-white/5">
          <span
            className={`text-[10px] font-bold uppercase tracking-wider block ${
              isFit ? 'text-apple-green' : 'text-apple-orange'
            }`}
          >
            {isFit ? 'Status Kesiapan' : 'Tindakan Cepat'}
          </span>
          <p className="font-bold text-zinc-900 dark:text-white text-xs leading-snug">
            {prescription.immediateAction}
          </p>
          <span className="text-[10px] text-zinc-400 block font-medium">
            {isFit ? 'Kondisi prima siap operasional' : 'Dibutuhkan sebelum melanjutkan rute'}
          </span>
        </div>

        {/* 2. Bekal Hidrasi Kabin */}
        <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 space-y-1.5 border border-black/5 dark:border-white/5">
          <div className="flex items-center gap-1.5 text-apple-blue font-bold text-[10px] uppercase tracking-wider">
            <Droplets className="w-3.5 h-3.5" />
            <span>{isFit ? 'Bekal Hidrasi Kabin' : 'Kebutuhan Rehidrasi'}</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl sm:text-2xl font-black font-mono tabular-nums text-zinc-900 dark:text-white">
              {prescription.hydrationElectrolyteMl || 500}
            </span>
            <span className="text-xs text-apple-blue font-semibold">ml air</span>
          </div>
          <p className="text-[10px] text-zinc-400 font-medium">
            {isFit ? 'Sediakan di botol kabin kemudi' : 'Minum bertahap cegah penurunan fokus'}
          </p>
        </div>

        {/* 3. Batas Jam Mengemudi / Rest Area */}
        <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 space-y-1.5 border border-black/5 dark:border-white/5">
          <div className="flex items-center gap-1.5 text-apple-orange font-bold text-[10px] uppercase tracking-wider">
            <Coffee className="w-3.5 h-3.5" />
            <span>{isFit ? 'Batas Jam Nyetir' : 'Jeda Istirahat / Nap'}</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl sm:text-2xl font-black font-mono tabular-nums text-zinc-900 dark:text-white">
              {isFit ? '3–4' : prescription.recommendedScreenBreakMins || 20}
            </span>
            <span className="text-xs text-apple-orange font-semibold">
              {isFit ? 'jam maks' : 'menit jeda'}
            </span>
          </div>
          <p className="text-[10px] text-zinc-400 font-medium">
            {isFit ? 'Wajib jeda rest area tiap 3-4 jam' : 'Pejamkan mata di rest area terdekat'}
          </p>
        </div>
      </div>

      {/* Circadian & Route Protocol */}
      <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 flex items-start gap-2.5 border border-black/5 dark:border-white/5">
        <Clock className="w-4 h-4 text-apple-blue shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
            Protokol Jalur Tol & Waktu Sirkadian
          </span>
          <p className="text-zinc-600 dark:text-zinc-300 font-medium leading-relaxed text-xs">
            {prescription.circadianAlignmentNote}
          </p>
        </div>
      </div>
    </div>
  );
};
