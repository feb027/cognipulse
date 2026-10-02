'use client';

import React, { useState, useEffect, useRef } from 'react';
import { RotateCcw, ArrowRight, CheckCircle2, ShieldAlert } from 'lucide-react';

interface StroopTutorialProps {
  onStartRealTest: () => void;
}

export const StroopTutorial: React.FC<StroopTutorialProps> = ({ onStartRealTest }) => {
  const [tab, setTab] = useState<'demo' | 'practice'>('demo');
  const [demoScene, setDemoScene] = useState<'match' | 'mismatch'>('match');

  const [practiceStep, setPracticeStep] = useState<1 | 2>(1);
  const [practiceFeedback, setPracticeFeedback] = useState<string>('');
  const [isPracticeResolved, setIsPracticeResolved] = useState(false);
  const practiceHoldTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (tab !== 'demo') return;
    const interval = setInterval(() => {
      setDemoScene((prev) => (prev === 'match' ? 'mismatch' : 'match'));
    }, 2800);
    return () => clearInterval(interval);
  }, [tab]);

  const initPractice = (step: 1 | 2) => {
    if (practiceHoldTimeoutRef.current) clearTimeout(practiceHoldTimeoutRef.current);
    setPracticeStep(step);
    setIsPracticeResolved(false);
    if (step === 1) {
      setPracticeFeedback('Ronde 1: Kata & Warna Cocok. Coba ketuk tombol hijau!');
    } else {
      setPracticeFeedback('Ronde 2: Kata & Warna Beda! Tahan dan jangan ketuk selama 2 detik...');
      practiceHoldTimeoutRef.current = setTimeout(() => {
        setIsPracticeResolved(true);
        setPracticeFeedback('Sempurna! Anda berhasil menahan dan tidak terkecoh!');
      }, 2000);
    }
  };

  const handlePracticeTap = () => {
    if (practiceStep === 1) {
      setIsPracticeResolved(true);
      setPracticeFeedback('Benar Sekali! Kata "HIJAU" berwarna hijau memang harus diketuk.');
    } else {
      if (practiceHoldTimeoutRef.current) clearTimeout(practiceHoldTimeoutRef.current);
      setIsPracticeResolved(false);
      setPracticeFeedback('Oops, salah! Tinta Merah tapi katanya "BIRU". Seharusnya Anda TAHAN / JANGAN KETUK!');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#1C1C1E] border border-black/5 dark:border-white/10 shadow-apple space-y-4 animate-springUp">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-apple-purple">
            Tahap 2 • Panduan Inhibisi Stroop
          </span>
          <h3 className="text-lg font-extrabold text-zinc-900 dark:text-white">
            Cara Main Uji Fokus Warna
          </h3>
        </div>
        <button
          onClick={onStartRealTest}
          className="text-[11px] font-bold text-zinc-400 hover:text-apple-purple transition-colors"
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
          onClick={() => { setTab('practice'); initPractice(1); }}
          className={`py-2 rounded-xl transition-all ${tab === 'practice' ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm' : 'text-zinc-500'}`}
        >
          2. Coba Latihan
        </button>
      </div>

      {tab === 'demo' ? (
        <div className="space-y-4">
          <div className="relative h-44 rounded-2xl bg-zinc-950 flex flex-col items-center justify-center border border-zinc-800 p-4">
            {demoScene === 'match' ? (
              <div className="flex flex-col items-center space-y-2 text-center animate-fadeIn">
                <span className="text-4xl font-black tracking-tight" style={{ color: '#22c55e' }}>
                  HIJAU
                </span>
                <span className="text-[11px] text-zinc-400">Tinta Hijau = Kata HIJAU (Cocok)</span>
                <div className="px-4 py-1.5 rounded-full bg-apple-green text-white font-bold text-xs flex items-center gap-1.5 shadow-apple ring-4 ring-apple-green/30">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>KETUK TOMBOL</span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-2 text-center animate-fadeIn">
                <span className="text-4xl font-black tracking-tight" style={{ color: '#ef4444' }}>
                  BIRU
                </span>
                <span className="text-[11px] text-zinc-400">Tinta Merah ≠ Kata BIRU (Beda)</span>
                <div className="px-4 py-1.5 rounded-full bg-apple-orange text-white font-bold text-xs flex items-center gap-1.5 shadow-apple ring-4 ring-apple-orange/30">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>TAHAN • JANGAN KETUK</span>
                </div>
              </div>
            )}
          </div>
          <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed font-medium">
            <strong>Aturan Utama:</strong> Cocokkan warna tinta dengan bacaan katanya. Jika <strong>SAMA</strong>, ketuk tombol. Jika <strong>BEDA</strong>, diamkan jangan diketuk!
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => { setTab('practice'); initPractice(1); }}
              className="flex-1 py-3 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-bold text-xs hover:bg-zinc-200 transition-colors inline-flex items-center justify-center gap-1.5"
            >
              <span>Coba Latihan Sendiri</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onStartRealTest}
              className="flex-1 py-3 rounded-full bg-apple-purple text-white font-bold text-xs shadow-sm hover:opacity-90 transition-opacity"
            >
              Mulai Tes Resmi
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="h-44 rounded-2xl bg-zinc-950 flex flex-col items-center justify-center border border-zinc-800 p-4 text-center">
            {practiceStep === 1 ? (
              <div className="space-y-2">
                <span className="text-4xl font-black uppercase" style={{ color: '#22c55e' }}>
                  HIJAU
                </span>
                <p className="text-xs text-zinc-400">Tinta Hijau & Kata HIJAU</p>
              </div>
            ) : (
              <div className="space-y-2">
                <span className="text-4xl font-black uppercase" style={{ color: '#ef4444' }}>
                  KUNING
                </span>
                <p className="text-xs text-zinc-400">Tinta Merah tapi Kata KUNING</p>
              </div>
            )}
            <p className="text-[11px] font-medium text-apple-purple mt-2">{practiceFeedback}</p>
          </div>

          <button
            onClick={handlePracticeTap}
            className="w-full py-3.5 rounded-2xl bg-apple-green text-white font-bold text-xs shadow-apple active:scale-[0.98] transition-all"
          >
            COCOK (KETUK DI SINI)
          </button>

          <div className="flex gap-2">
            <button
              onClick={() => initPractice(practiceStep === 1 ? 2 : 1)}
              className="px-4 py-3 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-bold text-xs hover:bg-zinc-200 transition-colors inline-flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Ganti Contoh ({practiceStep === 1 ? 'Contoh 2' : 'Contoh 1'})</span>
            </button>
            <button
              onClick={onStartRealTest}
              className="flex-1 py-3 rounded-full bg-apple-purple text-white font-bold text-xs shadow-apple hover:opacity-90 transition-opacity"
            >
              Saya Mengerti • Mulai Asesmen
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
