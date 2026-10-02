'use client';

import React, { useState, useEffect } from 'react';
import { Fingerprint, RotateCcw, ArrowRight, Activity } from 'lucide-react';

interface MotorTutorialProps {
  onStartRealTest: () => void;
}

export const MotorTutorial: React.FC<MotorTutorialProps> = ({ onStartRealTest }) => {
  const [tab, setTab] = useState<'demo' | 'practice'>('demo');
  const [pulse, setPulse] = useState(false);

  const [practiceTaps, setPracticeTaps] = useState<number[]>([]);
  const [practiceFeedback, setPracticeFeedback] = useState<string>('Ketuk tombol 5 kali dengan ketukan santai & stabil.');

  useEffect(() => {
    if (tab !== 'demo') return;
    const interval = setInterval(() => {
      setPulse((p) => !p);
    }, 450);
    return () => clearInterval(interval);
  }, [tab]);

  const handlePracticeTap = () => {
    const now = performance.now();
    const next = [...practiceTaps, now];
    setPracticeTaps(next);

    if (next.length === 1) {
      setPracticeFeedback('Bagus! Lanjutkan 4 ketukan lagi dengan tempo yang sama.');
    } else if (next.length < 5) {
      const interval = Math.round(next[next.length - 1] - next[next.length - 2]);
      setPracticeFeedback(`Ketukan ${next.length}/5 (Jeda: ${interval} ms). Pertahankan irama!`);
    } else {
      setPracticeFeedback('Sempurna! Anda sudah menguasai ritme konstan. Siap tes resmi!');
    }
  };

  const resetPractice = () => {
    setPracticeTaps([]);
    setPracticeFeedback('Ketuk tombol 5 kali dengan ketukan santai & stabil.');
  };

  return (
    <div className="w-full max-w-md mx-auto p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#1C1C1E] border border-black/5 dark:border-white/10 shadow-apple space-y-4 animate-springUp">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-apple-teal">
            Tahap 4 • Panduan Ketukan Motorik
          </span>
          <h3 className="text-lg font-extrabold text-zinc-900 dark:text-white">
            Cara Main Uji Kestabilan Ketukan
          </h3>
        </div>
        <button
          onClick={onStartRealTest}
          className="text-[11px] font-bold text-zinc-400 hover:text-apple-teal transition-colors"
        >
          Lewati Tutorial
        </button>
      </div>

      <div className="grid grid-cols-2 gap-1.5 p-1 rounded-2xl bg-zinc-100 dark:bg-zinc-800/60 text-xs font-bold">
        <button
          onClick={() => setTab('demo')}
          className={`py-2 rounded-xl transition-all ${tab === 'demo' ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm' : 'text-zinc-500'}`}
        >
          1. Animasi Demo
        </button>
        <button
          onClick={() => { setTab('practice'); resetPractice(); }}
          className={`py-2 rounded-xl transition-all ${tab === 'practice' ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm' : 'text-zinc-500'}`}
        >
          2. Coba Latihan
        </button>
      </div>

      {tab === 'demo' ? (
        <div className="space-y-4">
          <div className="h-44 rounded-2xl bg-zinc-950 flex flex-col items-center justify-center border border-zinc-800 p-4">
            <div className="relative flex items-center justify-center">
              <div
                className={`w-20 h-20 rounded-full border-2 border-apple-teal/50 flex items-center justify-center transition-all duration-300 ${
                  pulse ? 'scale-110 bg-apple-teal/20 shadow-apple ring-4 ring-apple-teal/30' : 'scale-95 bg-transparent'
                }`}
              >
                <Fingerprint className="w-10 h-10 text-apple-teal" />
              </div>
              {pulse && (
                <div className="absolute w-28 h-28 rounded-full border border-apple-teal/40 animate-ping pointer-events-none" />
              )}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-apple-teal font-bold mt-3">
              <Activity className="w-3.5 h-3.5" />
              <span>Irama Stabil: Tik... Tik... Tik...</span>
            </div>
          </div>
          <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed font-medium">
            <strong>Kunci Utama:</strong> Jangan mengetuk secepat kilat atau terburu-buru! Ketuklah dengan <strong>tempo santai dan konstan</strong> layaknya detak jarum jam.
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => { setTab('practice'); resetPractice(); }}
              className="flex-1 py-3 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-bold text-xs hover:bg-zinc-200 transition-colors inline-flex items-center justify-center gap-1.5"
            >
              <span>Coba Latihan Sendiri</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onStartRealTest}
              className="flex-1 py-3 rounded-full bg-apple-teal text-white font-bold text-xs shadow-sm hover:opacity-90 transition-opacity"
            >
              Mulai Tes Resmi
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="h-44 rounded-2xl bg-zinc-950 flex flex-col items-center justify-center border border-zinc-800 p-4 text-center">
            <span className="text-3xl font-black font-mono text-apple-teal mb-1">
              {practiceTaps.length}/5
            </span>
            <p className="text-xs text-zinc-300 font-semibold">{practiceFeedback}</p>
          </div>

          <button
            onPointerDown={practiceTaps.length < 5 ? handlePracticeTap : undefined}
            style={{ touchAction: 'none' }}
            disabled={practiceTaps.length >= 5}
            className={`w-full py-4 rounded-2xl border-2 font-bold text-xs transition-all flex items-center justify-center gap-2 ${
              practiceTaps.length >= 5
                ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400 border-transparent cursor-default'
                : 'bg-zinc-50 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border-apple-teal/30 hover:border-apple-teal active:scale-[0.98]'
            }`}
          >
            <Fingerprint className="w-5 h-5 text-apple-teal" />
            <span>{practiceTaps.length >= 5 ? 'Latihan Selesai!' : 'Ketuk Ritme di Sini'}</span>
          </button>

          <div className="flex gap-2">
            <button
              onClick={resetPractice}
              className="px-4 py-3 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-bold text-xs hover:bg-zinc-200 transition-colors inline-flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Ulangi Latihan</span>
            </button>
            <button
              onClick={onStartRealTest}
              className="flex-1 py-3 rounded-full bg-apple-teal text-white font-bold text-xs shadow-apple hover:opacity-90 transition-opacity"
            >
              Saya Mengerti • Mulai Asesmen
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
