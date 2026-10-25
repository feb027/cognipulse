'use client';

import React from 'react';
import { AssessmentResult } from '@/types';
import { useBottomSheetDrag } from '@/hooks/use-bottom-sheet-drag';

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
  const { sheetRef, backdropRef, triggerClose, dragHandleProps } = useBottomSheetDrag({
    isOpen: Boolean(vitalKey),
    onClose,
    threshold: 60,
  });

  if (!vitalKey) return null;

  const getMetricData = () => {
    switch (vitalKey) {
      case 'cfi': {
        const cfi = latestResult?.cfi.cfiScore ?? 18;
        const readiness = 100 - cfi;
        return {
          title: 'Kesiapan Kognitif & Kelelahan',
          value: `${readiness}%`,
          unit: `(CFI: ${cfi})`,
          tier: cfi < 35 ? 'Optimal' : cfi < 70 ? 'Waspada' : 'Kritis',
          percent: Math.min(95, Math.max(5, cfi)),
          meaning: 'Indeks komposit kebugaran kerja mengintegrasikan kecepatan respon saraf, kontrol inhibisi, dan stabilitas ritme motorik.',
          advice: 'Pertahankan hidrasi kabin 500ml dan lakukan jeda istirahat berkala tiap 3-4 jam perjalanan tol.',
        };
      }
      case 'pvt': {
        const rt = Math.round(latestResult?.pvt.meanReactionTimeMs ?? 218);
        return {
          title: 'Kecepatan Refleks Visual',
          value: `${rt}`,
          unit: 'ms',
          tier: rt < 260 ? 'Optimal' : rt < 355 ? 'Waspada' : 'Kritis',
          percent: Math.min(95, Math.max(5, ((rt - 180) / (450 - 180)) * 100)),
          meaning: 'Mengukur waktu transmisi impuls dari visual jalan raya ke respon pengereman motorik supir.',
          advice: 'Kelambatan refleks menambah jarak henti pengereman darurat dan risiko tabrak belakang di jalan tol.',
        };
      }
      case 'stroop': {
        const acc = Math.round(latestResult?.stroop.accuracyRate ?? 96);
        return {
          title: 'Kontrol Inhibisi & Fokus',
          value: `${acc}`,
          unit: '% Akurasi',
          tier: acc >= 90 ? 'Optimal' : acc >= 70 ? 'Waspada' : 'Kritis',
          percent: Math.min(95, Math.max(5, 100 - acc + 10)),
          meaning: 'Daya tahan prefrontal cortex untuk mempertahankan konsentrasi stabil dan menyaring distraksi saat berkendara.',
          advice: 'Penurunan akurasi menandakan beban mental jenuh. Segera lakukan rotasi supir atau istirahat di rest area.',
        };
      }
      default: {
        const sd = Math.round(latestResult?.motor.itiStandardDeviationMs ?? 18);
        return {
          title: 'Kestabilan Ritme Motorik',
          value: `±${sd}`,
          unit: 'ms Jitter',
          tier: sd <= 20 ? 'Optimal' : sd <= 35 ? 'Waspada' : 'Kritis',
          percent: Math.min(95, Math.max(5, (sd / 50) * 100)),
          meaning: 'Tingkat tremor dan keteraturan impuls saraf motorik halus saat mengendalikan kemudi.',
          advice: 'Lakukan peregangan otot lengan, bahu, dan pergelangan tangan untuk meredakan ketegangan fisik berkendara.',
        };
      }
    }
  };

  const m = getMetricData();

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop: Hardware-friendly, no heavy blur on mobile */}
      <div
        ref={backdropRef}
        onClick={triggerClose}
        className="fixed inset-0 bg-black/50 sm:backdrop-blur-sm animate-fadeIn transition-opacity will-change-[opacity]"
        aria-hidden="true"
      />

      {/* Modern Apple Sheet Card: Mobile slides from bottom; Desktop stays centered with subtle fade */}
      <div
        ref={sheetRef}
        {...dragHandleProps}
        className="relative w-full max-w-sm rounded-t-3xl sm:rounded-3xl bg-white dark:bg-[#1C1C1E] border border-black/10 dark:border-white/10 shadow-lg p-6 space-y-4 z-10 will-change-transform sm:animate-fadeIn cursor-grab active:cursor-grabbing touch-none sm:touch-auto select-none"
      >
        {/* iOS Drag Handle Area on Mobile (swipe/pull down from anywhere to dismiss) */}
        <div className="w-full pt-1 pb-3 -mt-3 flex justify-center touch-none select-none sm:hidden pointer-events-none">
          <div className="w-12 h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-600 transition-colors" />
        </div>

        <div className="flex items-start justify-between gap-2">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block mb-0.5">
              Parameter Klinis
            </span>
            <h3 className="text-lg font-extrabold tracking-tight text-zinc-900 dark:text-white">
              {m.title}
            </h3>
          </div>
          <span
            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border shrink-0 ${
              m.tier === 'Optimal'
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                : m.tier === 'Waspada'
                ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
            }`}
          >
            {m.tier}
          </span>
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

        {/* Minimal Spectrum Range Bar with Centered Dynamic Needle Indicator */}
        <div className="space-y-1.5 pt-1">
          <div className="relative w-full py-2 flex items-center">
            {/* Tri-Color Spectrum Line */}
            <div className="w-full h-2.5 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden flex shadow-inner">
              <div className="w-1/3 h-full bg-emerald-500/80" />
              <div className="w-1/3 h-full bg-amber-500/80" />
              <div className="w-1/3 h-full bg-rose-500/80" />
            </div>

            {/* Centered Needle Pin Indicator */}
            <div
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 pointer-events-none transition-all duration-300 z-10"
              style={{ left: `${Math.min(97, Math.max(3, m.percent))}%` }}
            >
              <div className="w-4 h-4 rounded-full bg-white dark:bg-zinc-900 border-2 border-zinc-900 dark:border-white shadow-md flex items-center justify-center ring-2 ring-black/5 dark:ring-white/10">
                <div
                  className={`w-1.5 h-1.5 rounded-full ${
                    m.tier === 'Optimal'
                      ? 'bg-emerald-500'
                      : m.tier === 'Waspada'
                      ? 'bg-amber-500'
                      : 'bg-rose-500'
                  }`}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-zinc-400">
            <span className={m.tier === 'Optimal' ? 'text-emerald-500 font-extrabold' : 'text-zinc-400'}>
              Optimal
            </span>
            <span className={m.tier === 'Waspada' ? 'text-amber-500 font-extrabold' : 'text-zinc-400'}>
              Waspada
            </span>
            <span className={m.tier === 'Kritis' ? 'text-rose-500 font-extrabold' : 'text-zinc-400'}>
              Kritis
            </span>
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

        {/* Apple Style Full Width Close Button */}
        <button
          onClick={triggerClose}
          className="w-full py-2.5 rounded-2xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold text-xs hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors shadow-sm active:scale-[0.98]"
        >
          Selesai
        </button>
      </div>
    </div>
  );
}
