'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, ArrowRight, CheckCircle2 } from 'lucide-react';

interface PVTTutorialProps {
  onStartRealTest: () => void;
}

export const PVTTutorial: React.FC<PVTTutorialProps> = ({ onStartRealTest }) => {
  const [tab, setTab] = useState<'demo' | 'practice'>('demo');
  const [demoState, setDemoState] = useState<'waiting' | 'stimulus' | 'tapped'>('waiting');
  const [practicePhase, setPracticePhase] = useState<'idle' | 'waiting' | 'stimulus' | 'feedback'>('idle');
  const [practiceFeedback, setPracticeFeedback] = useState<string>('');
  const [practiceRt, setPracticeRt] = useState<number | null>(null);
  const stimulusTimerRef = useRef<NodeJS.Timeout | null>(null);
  const stimulusStartTimeRef = useRef<number>(0);

  useEffect(() => {
    if (tab !== 'demo') return;
    let isMounted = true;
    const cycle = () => {
      if (!isMounted) return;
      setDemoState('waiting');
      setTimeout(() => {
        if (!isMounted) return;
        setDemoState('stimulus');
        setTimeout(() => {
          if (!isMounted) return;
          setDemoState('tapped');
          setTimeout(cycle, 1800);
        }, 500);
      }, 1600);
    };
    cycle();
    return () => { isMounted = false; };
  }, [tab]);

  const startPracticeRound = () => {
    if (stimulusTimerRef.current) clearTimeout(stimulusTimerRef.current);
    setPracticePhase('waiting'); setPracticeFeedback('Tunggu sampai lingkaran berubah menjadi HIJAU...'); setPracticeRt(null);
    stimulusTimerRef.current = setTimeout(() => {
      stimulusStartTimeRef.current = performance.now();
      setPracticePhase('stimulus'); setPracticeFeedback('SEKARANG! KETUK LAYAR!');
    }, 1500 + Math.random() * 1000);
  };

  const handlePracticeTap = () => {
    if (practicePhase === 'waiting') {
      if (stimulusTimerRef.current) clearTimeout(stimulusTimerRef.current);
      setPracticePhase('feedback'); setPracticeFeedback('Terlalu Cepat! Anda mengetuk sebelum hijau muncul. Coba ulangi lagi.');
    } else if (practicePhase === 'stimulus') {
      const rt = Math.round(performance.now() - stimulusStartTimeRef.current);
      setPracticeRt(rt); setPracticePhase('feedback');
      setPracticeFeedback(`Bagus Sekali! Waktu reaksi Anda ${rt} ms. Anda sudah siap!`);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 sm:p-6 rounded-3xl bg-white dark:bg-[#1C1C1E] border border-black/5 dark:border-white/10 shadow-apple space-y-3.5 animate-springUp">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-apple-orange">Tahap 1 • Panduan Refleks PVT</span>
          <h3 className="text-lg font-extrabold text-zinc-900 dark:text-white">Cara Main Uji Refleks Cepat</h3>
        </div>
        <button onClick={onStartRealTest} className="text-[11px] font-bold text-zinc-400 hover:text-apple-orange transition-colors">
          Lewati Tutorial
        </button>
      </div>

      <div className="grid grid-cols-2 gap-1.5 p-1 rounded-2xl bg-zinc-100 dark:bg-zinc-800/60 text-xs font-bold">
        <button onClick={() => setTab('demo')} className={`py-2 rounded-xl transition-all ${tab === 'demo' ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm' : 'text-zinc-500'}`}>
          1. Animasi Demo
        </button>
        <button onClick={() => { setTab('practice'); startPracticeRound(); }} className={`py-2 rounded-xl transition-all ${tab === 'practice' ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm' : 'text-zinc-500'}`}>
          2. Coba Latihan
        </button>
      </div>

      {tab === 'demo' ? (
        <div className="space-y-3.5">
          <div className="relative h-56 sm:h-64 rounded-3xl bg-zinc-50 dark:bg-zinc-900/40 flex flex-col items-center justify-center overflow-hidden border border-black/5 dark:border-white/5">
            {demoState === 'waiting' && (
              <div className="flex flex-col items-center space-y-2 text-center animate-pulse">
                <div className="w-20 h-20 rounded-full border-2 border-dashed border-zinc-300 dark:border-zinc-700 flex items-center justify-center">
                  <span className="text-xs font-bold text-zinc-400">Siaga...</span>
                </div>
                <span className="text-xs text-zinc-400 font-medium">Tunggu hingga lingkaran hijau muncul</span>
              </div>
            )}
            {demoState === 'stimulus' && (
              <div className="flex flex-col items-center space-y-2 text-center">
                <div className="w-24 h-24 rounded-full bg-apple-green flex items-center justify-center text-white font-mono font-black text-2xl shadow-apple ring-8 ring-apple-green/20 animate-scaleIn">
                  218
                </div>
                <span className="text-xs text-apple-green font-bold uppercase tracking-wider animate-bounce">KETUK SEKARANG!</span>
              </div>
            )}
            {demoState === 'tapped' && (
              <div className="relative flex flex-col items-center space-y-2 text-center">
                <div className="w-24 h-24 rounded-full bg-apple-green/15 border-2 border-apple-green flex items-center justify-center text-apple-green">
                  <CheckCircle2 className="w-10 h-10 text-apple-green" />
                </div>
                <span className="text-xs text-apple-green font-bold">Respon Terekam: 218 ms (Cepat)</span>
              </div>
            )}
          </div>
          <p className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed font-medium">
            <strong>Aturan Sederhana:</strong> Tunggu dengan tenang. Begitu lingkaran berubah jadi <strong>HIJAU</strong>, langsung ketuk layar secepat refleks Anda!
          </p>
          <div className="flex gap-2">
            <button onClick={() => { setTab('practice'); startPracticeRound(); }} className="flex-1 py-3 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-bold text-xs hover:bg-zinc-200 transition-colors inline-flex items-center justify-center gap-1.5">
              <span>Coba Latihan Sendiri</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button onClick={onStartRealTest} className="flex-1 py-3 rounded-full bg-apple-orange text-white font-bold text-xs shadow-sm hover:opacity-90 transition-opacity">
              Mulai Tes Resmi
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3.5">
          <div onPointerDown={practicePhase === 'idle' ? startPracticeRound : handlePracticeTap} role="button" tabIndex={0} className="h-56 sm:h-64 rounded-3xl bg-zinc-50 dark:bg-zinc-900/40 flex flex-col items-center justify-center select-none cursor-pointer border border-black/5 dark:border-white/5 p-4 text-center active:scale-[0.99] transition-transform">
            {practicePhase === 'idle' && (
              <div className="space-y-2">
                <Play className="w-10 h-10 text-apple-orange mx-auto" />
                <p className="text-xs text-zinc-700 dark:text-zinc-300 font-bold">Ketuk di sini untuk mulai latihan</p>
              </div>
            )}
            {practicePhase === 'waiting' && (
              <div className="w-20 h-20 rounded-full border-2 border-dashed border-amber-500/80 flex items-center justify-center animate-pulse">
                <span className="text-xs font-bold text-amber-500">Siaga...</span>
              </div>
            )}
            {practicePhase === 'stimulus' && (
              <div className="w-24 h-24 rounded-full bg-apple-green flex items-center justify-center text-white font-black text-sm shadow-apple ring-8 ring-apple-green/20 animate-ping">
                KETUK!
              </div>
            )}
            {practicePhase === 'feedback' && (
              <div className="space-y-1.5">
                <div className={`text-base font-extrabold font-mono ${practiceRt ? 'text-apple-green' : 'text-apple-red'}`}>
                  {practiceRt ? `${practiceRt} ms` : 'Klik Terlalu Awal'}
                </div>
                <p className="text-xs text-zinc-500 max-w-xs">{practiceFeedback}</p>
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <button onClick={startPracticeRound} className="px-4 py-3 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-bold text-xs hover:bg-zinc-200 transition-colors inline-flex items-center gap-1.5">
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Ulangi Latihan</span>
            </button>
            <button onClick={onStartRealTest} className="flex-1 py-3 rounded-full bg-apple-orange text-white font-bold text-xs shadow-apple hover:opacity-90 transition-opacity">
              Saya Mengerti • Mulai Asesmen
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
