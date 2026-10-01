'use client';

import React from 'react';
import { X } from 'lucide-react';
import { AssessmentResult } from '@/types';

interface VitalDetailModalProps {
  vitalKey: string | null;
  latestResult: AssessmentResult | null;
  onClose: () => void;
}

export function VitalDetailModal({
  vitalKey,
  latestResult,
  onClose,
}: VitalDetailModalProps) {
  if (!vitalKey) return null;

  const getMetricData = () => {
    switch (vitalKey) {
      case 'cfi':
        const cfi = latestResult?.cfi.cfiScore ?? 18;
        return {
          title: 'Tingkat Kelelahan Kognitif',
          value: `${cfi}`,
          unit: '/ 100 CFI',
          tier: cfi < 35 ? 'Optimal' : cfi < 70 ? 'Waspada' : 'Kritis',
          percent: Math.min(100, Math.max(5, cfi)),
          meaning: 'Indeks gabungan kecepatan respon saraf, kontrol inhibisi, dan stabilitas ritme motorik.',
          advice: 'Pertahankan hidrasi 250ml dan istirahat mata berkala jika mendekati zona waspada.',
        };
      case 'pvt':
        const rt = Math.round(latestResult?.pvt.meanReactionTimeMs ?? 218);
        return {
          title: 'Kecepatan Refleks Visual',
          value: `${rt}`,
          unit: 'ms',
          tier: rt < 260 ? 'Optimal' : rt < 355 ? 'Waspada' : 'Kritis',
          percent: Math.min(100, Math.max(5, ((rt - 180) / (450 - 180)) * 100)),
          meaning: 'Mengukur waktu transmisi impuls dari retina mata ke korteks motorik otak.',
          advice: 'Kelambatan refleks menambah jarak henti pengereman darurat dan risiko kelalaian tugas.',
        };
      case 'stroop':
        const acc = Math.round(latestResult?.stroop.accuracyRate ?? 96);
        return {
          title: 'Kontrol Inhibisi & Fokus',
          value: `${acc}`,
          unit: '% Akurasi',
          tier: acc >= 90 ? 'Optimal' : acc >= 70 ? 'Waspada' : 'Kritis',
          percent: Math.min(100, Math.max(5, 100 - acc + 10)),
          meaning: 'Daya tahan prefrontal untuk menahan respon impulsif dan memilah informasi bertentangan.',
          advice: 'Penurunan akurasi menandakan beban mental jenuh. Ambil jeda 10 menit tanpa layar.',
        };
      default:
        const sd = Math.round(latestResult?.motor.itiStandardDeviationMs ?? 18);
        return {
          title: 'Kestabilan Ritme Motorik',
          value: `±${sd}`,
          unit: 'ms Jitter',
          tier: sd <= 20 ? 'Optimal' : sd <= 35 ? 'Waspada' : 'Kritis',
          percent: Math.min(100, Math.max(5, (sd / 50) * 100)),
          meaning: 'Tingkat tremor dan keteraturan impuls saraf motorik halus pada jari tangan.',
          advice: 'Lakukan relaksasi peregangan jari dan pergelangan tangan untuk meredakan ketegangan fisik.',
        };
    }
  };

  const m = getMetricData();

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
      {/* Backdrop click */}
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      {/* Modern Apple Sheet Card */}
      <div className="relative w-full max-w-sm rounded-t-3xl sm:rounded-3xl bg-white dark:bg-[#1C1C1E] border border-black/10 dark:border-white/10 shadow-2xl p-6 space-y-5 animate-springUp z-10">
        {/* iOS Drag Indicator Handle on Mobile */}
        <div className="w-10 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700 mx-auto -mt-2 mb-2 sm:hidden" />

        <div className="flex items-start justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block mb-0.5">
              Parameter Klinis
            </span>
            <h3 className="text-lg font-extrabold tracking-tight text-zinc-900 dark:text-white">
              {m.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Big Apple Clean Display */}
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-black font-mono tracking-tight text-zinc-900 dark:text-white tabular-nums">
            {m.value}
          </span>
          <span className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">
            {m.unit}
          </span>
        </div>

        {/* Minimal Spectrum Range Bar */}
        <div className="space-y-1.5 pt-1">
          <div className="relative w-full h-2 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden flex">
            <div className="w-1/3 h-full bg-emerald-500/70" />
            <div className="w-1/3 h-full bg-amber-500/70" />
            <div className="w-1/3 h-full bg-rose-500/70" />
          </div>
          <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-zinc-400">
            <span className="text-emerald-500">Optimal</span>
            <span className="text-amber-500">Waspada</span>
            <span className="text-rose-500">Kritis</span>
          </div>
        </div>

        {/* Concise Description */}
        <div className="space-y-2 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400 pt-2 border-t border-black/5 dark:border-white/5">
          <p>{m.meaning}</p>
          <p className="text-[11px] text-zinc-500 font-medium">
            <strong className="text-zinc-800 dark:text-zinc-200 font-semibold">Tindakan: </strong>
            {m.advice}
          </p>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-bold text-xs hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
        >
          Selesai
        </button>
      </div>
    </div>
  );
}
