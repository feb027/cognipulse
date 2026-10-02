'use client';

import React, { useState, useEffect } from 'react';
import { RotateCcw, ArrowRight, CheckCircle2 } from 'lucide-react';

interface CorsiTutorialProps {
  onStartRealTest: () => void;
}

export const CorsiTutorial: React.FC<CorsiTutorialProps> = ({ onStartRealTest }) => {
  const [tab, setTab] = useState<'demo' | 'practice'>('demo');
  const [demoStep, setDemoStep] = useState<number>(0);
  const [practicePhase, setPracticePhase] = useState<'showing' | 'recalling' | 'success'>('showing');
  const [practiceActiveBlock, setPracticeActiveBlock] = useState<number | null>(null);
  const [userTaps, setUserTaps] = useState<number[]>([]);
  const practiceSequence = [1, 7];

  useEffect(() => {
    if (tab !== 'demo') return;
    const interval = setInterval(() => { setDemoStep((p) => (p + 1) % 5); }, 1300);
    return () => clearInterval(interval);
  }, [tab]);

  const startPractice = () => {
    setPracticePhase('showing'); setUserTaps([]); setPracticeActiveBlock(practiceSequence[0]);
    setTimeout(() => {
      setPracticeActiveBlock(null);
      setTimeout(() => {
        setPracticeActiveBlock(practiceSequence[1]);
        setTimeout(() => { setPracticeActiveBlock(null); setPracticePhase('recalling'); }, 800);
      }, 300);
    }, 800);
  };

  const handleTap = (idx: number) => {
    if (practicePhase !== 'recalling') return;
    const next = [...userTaps, idx];
    setUserTaps(next);
    if (next.length === practiceSequence.length) {
      if (next[0] === practiceSequence[0] && next[1] === practiceSequence[1]) {
        setPracticePhase('success');
      } else {
        setTimeout(startPractice, 700);
      }
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 sm:p-6 rounded-3xl bg-white dark:bg-[#1C1C1E] border border-black/5 dark:border-white/10 shadow-apple space-y-3.5 animate-springUp">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-apple-purple">Tahap 3 • Panduan Memori Spasial</span>
          <h3 className="text-lg font-extrabold text-zinc-900 dark:text-white">Cara Main Uji Balok Corsi</h3>
        </div>
        <button onClick={onStartRealTest} className="text-[11px] font-bold text-zinc-400 hover:text-apple-purple transition-colors">
          Lewati Tutorial
        </button>
      </div>

      <div className="grid grid-cols-2 gap-1.5 p-1 rounded-2xl bg-zinc-100 dark:bg-zinc-800/60 text-xs font-bold">
        <button onClick={() => setTab('demo')} className={`py-2 rounded-xl transition-all ${tab === 'demo' ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm' : 'text-zinc-500'}`}>
          1. Animasi Demo
        </button>
        <button onClick={() => { setTab('practice'); startPractice(); }} className={`py-2 rounded-xl transition-all ${tab === 'practice' ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm' : 'text-zinc-500'}`}>
          2. Coba Latihan
        </button>
      </div>

      {tab === 'demo' ? (
        <div className="space-y-3.5">
          <div className="p-4 rounded-3xl bg-zinc-50 dark:bg-zinc-900/40 border border-black/5 dark:border-white/5 flex flex-col items-center justify-center space-y-3">
            <span className="inline-block px-3 py-0.5 rounded-full bg-apple-purple/10 text-apple-purple text-xs font-semibold">
              {demoStep <= 2 ? 'Langkah 1: Perhatikan Balok Menyala' : 'Langkah 2: Ketuk Urutan yang Sama'}
            </span>
            <div className="grid grid-cols-3 grid-rows-3 gap-2.5 sm:gap-3 w-full max-w-[240px] sm:max-w-[260px] aspect-square p-1">
              {Array.from({ length: 9 }).map((_, i) => {
                const isLit = (demoStep === 1 && i === 1) || (demoStep === 2 && i === 7);
                const isTapped = (demoStep === 3 && i === 1) || (demoStep >= 4 && (i === 1 || i === 7));
                return (
                  <div key={i} className={`aspect-square w-full h-full rounded-2xl border-2 transition-colors duration-150 flex items-center justify-center select-none ${
                    isLit ? 'bg-apple-purple text-white border-apple-purple ring-4 ring-apple-purple/30' : isTapped ? 'bg-apple-purple/15 border-apple-purple text-apple-purple' : 'bg-zinc-100 dark:bg-zinc-800/80 border-transparent'
                  }`}>
                    <div className="w-6 h-6 flex items-center justify-center pointer-events-none">
                      {isTapped ? <CheckCircle2 className="w-5 h-5 text-apple-purple" /> : <span className="w-2.5 h-2.5 rounded-full bg-zinc-300 dark:bg-zinc-600" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <p className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed font-medium">
            <strong>Aturan Utama:</strong> Hafalkan urutan balok yang menyala ungu. Saat giliran Anda, <strong>ketuk kotak yang sama</strong> dengan urutan persis!
          </p>
          <div className="flex gap-2">
            <button onClick={() => { setTab('practice'); startPractice(); }} className="flex-1 py-3 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-bold text-xs hover:bg-zinc-200 transition-colors inline-flex items-center justify-center gap-1.5">
              <span>Coba Latihan Sendiri</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button onClick={onStartRealTest} className="flex-1 py-3 rounded-full bg-apple-purple text-white font-bold text-xs shadow-sm hover:opacity-90 transition-opacity">
              Mulai Tes Resmi
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3.5">
          <div className="p-4 rounded-3xl bg-zinc-50 dark:bg-zinc-900/40 border border-black/5 dark:border-white/5 flex flex-col items-center justify-center space-y-3">
            <span className="inline-block px-3 py-0.5 rounded-full bg-apple-purple/10 text-apple-purple text-xs font-semibold">
              {practicePhase === 'showing' ? 'Perhatikan Balok Menyala...' : practicePhase === 'recalling' ? 'Giliran Anda: Ketuk Balok!' : 'Hebat! Urutan Sangat Tepat!'}
            </span>
            <div className="grid grid-cols-3 grid-rows-3 gap-2.5 sm:gap-3 w-full max-w-[240px] sm:max-w-[260px] aspect-square p-1">
              {Array.from({ length: 9 }).map((_, i) => {
                const isLit = practiceActiveBlock === i;
                const isTapped = userTaps.includes(i);
                return (
                  <button key={i} type="button" disabled={practicePhase !== 'recalling'} onClick={() => handleTap(i)} className={`aspect-square w-full h-full rounded-2xl border-2 transition-colors duration-150 flex items-center justify-center select-none ${
                    isLit ? 'bg-apple-purple text-white border-apple-purple ring-4 ring-apple-purple/30' : isTapped ? 'bg-apple-purple/15 border-apple-purple text-apple-purple' : 'bg-zinc-100 dark:bg-zinc-800/80 border-transparent hover:border-apple-purple/40 active:bg-zinc-200 dark:active:bg-zinc-700'
                  }`}>
                    <div className="w-6 h-6 flex items-center justify-center pointer-events-none">
                      {isTapped ? <CheckCircle2 className="w-5 h-5 text-apple-purple" /> : <span className="w-2.5 h-2.5 rounded-full bg-zinc-300 dark:bg-zinc-600" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={startPractice} className="px-4 py-3 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-bold text-xs hover:bg-zinc-200 transition-colors inline-flex items-center gap-1.5">
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Ulangi Latihan</span>
            </button>
            <button onClick={onStartRealTest} className="flex-1 py-3 rounded-full bg-apple-purple text-white font-bold text-xs shadow-apple hover:opacity-90 transition-opacity">
              Saya Mengerti • Mulai Asesmen
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
