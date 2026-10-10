'use client';

import React, { useState, useRef } from 'react';
import { UserContext, CaffeineIntake, ShiftType } from '@/types/assessment';

interface ContextCheckinModalProps {
  initialContext?: UserContext;
  onSubmit: (context: UserContext) => void;
  onCancel: () => void;
}

const CAFFEINE_LABELS: Record<CaffeineIntake, string> = {
  none: 'Nol',
  low: '1 Cangkir',
  moderate: '2-3 Cangkir',
  high: 'Banyak',
};

const SHIFT_LABELS: Record<ShiftType, string> = {
  morning: 'Pagi',
  afternoon: 'Sore',
  night_graveyard: 'Malam',
  extended_overtime: 'Lembur',
};

export const ContextCheckinModal: React.FC<ContextCheckinModalProps> = ({
  initialContext,
  onSubmit,
  onCancel,
}) => {
  const [hoursSlept, setHoursSlept] = useState<number>(initialContext?.hoursSleptLastNight || 7);
  const [hoursWorked, setHoursWorked] = useState<number>(initialContext?.hoursWorkedToday || 6);
  const [shiftType, setShiftType] = useState<ShiftType>(initialContext?.shiftType || 'morning');
  const [caffeine, setCaffeine] = useState<CaffeineIntake>(initialContext?.caffeineIntake || 'low');
  const [subjective, setSubjective] = useState<number>(initialContext?.subjectiveFatigueScore || 2);
  const [heavyLabor, setHeavyLabor] = useState<boolean>(initialContext?.heavyPhysicalLabor || false);

  const sleptStepRef = useRef<number>(0);
  const workedStepRef = useRef<number>(0);

  const makeStepHandler = (
    setter: React.Dispatch<React.SetStateAction<number>>,
    stepRef: React.MutableRefObject<number>,
    step: number,
    min: number,
    max: number,
  ) => (delta: number) => {
    const now = Date.now();
    // Debounce 180 ms — mencegah double-event pada layar sentuh
    if (now - stepRef.current < 180) return;
    stepRef.current = now;
    setter((prev) => {
      const next = +(prev + delta * step).toFixed(1);
      return Math.min(max, Math.max(min, next));
    });
  };

  const handleSleptStep = makeStepHandler(setHoursSlept, sleptStepRef, 0.5, 1, 14);
  const handleWorkedStep = makeStepHandler(setHoursWorked, workedStepRef, 1, 0, 18);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      operatorId: 'OP-' + Math.floor(100 + Math.random() * 900),
      shiftType,
      hoursSleptLastNight: Number(hoursSlept),
      hoursWorkedToday: Number(hoursWorked),
      caffeineIntake: caffeine,
      subjectiveFatigueScore: Number(subjective),
      heavyPhysicalLabor: heavyLabor,
    });
  };

  return (
    <div className="w-full max-w-md mx-auto p-5 sm:p-6 bg-white dark:bg-[#1C1C1E] rounded-3xl shadow-apple border border-black/5 dark:border-white/10 text-zinc-900 dark:text-white space-y-4 animate-springUp">
      <div className="pb-2 border-b border-black/[0.04] dark:border-white/[0.08]">
        <h3 className="text-base font-bold tracking-tight">Kondisi Anda Hari Ini</h3>
        <p className="text-xs text-zinc-400 mt-0.5">6 pertanyaan cepat sebelum memulai tes.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3.5 text-xs font-medium">

        {/* 1. Jam Tidur */}
        <div className="p-3 bg-zinc-50 dark:bg-zinc-800/60 rounded-2xl flex items-center justify-between">
          <div>
            <label className="text-xs text-zinc-600 dark:text-zinc-300 font-semibold block">
              Tidur Semalam
            </label>
            <span className="text-[11px] text-zinc-400">Berapa jam Anda tidur?</span>
          </div>
          <div className="flex items-center bg-zinc-200/70 dark:bg-zinc-700/60 p-1 rounded-2xl border border-black/5 dark:border-white/10 touch-manipulation select-none">
            <button
              type="button"
              onClick={() => handleSleptStep(-1)}
              disabled={hoursSlept <= 1}
              aria-label="Kurangi jam tidur"
              className="w-9 h-9 rounded-xl bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-100 font-bold text-lg flex items-center justify-center shadow-sm active:scale-90 disabled:opacity-30 disabled:pointer-events-none transition-all touch-manipulation"
            >
              −
            </button>
            <span className="min-w-16 px-1.5 text-center font-mono font-bold text-sm text-zinc-900 dark:text-white tabular-nums select-none">
              {hoursSlept} <span className="font-sans text-[11px] font-medium text-zinc-400">jam</span>
            </span>
            <button
              type="button"
              onClick={() => handleSleptStep(1)}
              disabled={hoursSlept >= 14}
              aria-label="Tambah jam tidur"
              className="w-9 h-9 rounded-xl bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-100 font-bold text-lg flex items-center justify-center shadow-sm active:scale-90 disabled:opacity-30 disabled:pointer-events-none transition-all touch-manipulation"
            >
              +
            </button>
          </div>
        </div>

        {/* 2. Jam Kerja Hari Ini */}
        <div className="p-3 bg-zinc-50 dark:bg-zinc-800/60 rounded-2xl flex items-center justify-between">
          <div>
            <label className="text-xs text-zinc-600 dark:text-zinc-300 font-semibold block">
              Jam Kerja Hari Ini
            </label>
            <span className="text-[11px] text-zinc-400">Sudah berapa jam bekerja?</span>
          </div>
          <div className="flex items-center bg-zinc-200/70 dark:bg-zinc-700/60 p-1 rounded-2xl border border-black/5 dark:border-white/10 touch-manipulation select-none">
            <button
              type="button"
              onClick={() => handleWorkedStep(-1)}
              disabled={hoursWorked <= 0}
              aria-label="Kurangi jam kerja"
              className="w-9 h-9 rounded-xl bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-100 font-bold text-lg flex items-center justify-center shadow-sm active:scale-90 disabled:opacity-30 disabled:pointer-events-none transition-all touch-manipulation"
            >
              −
            </button>
            <span className="min-w-16 px-1.5 text-center font-mono font-bold text-sm text-zinc-900 dark:text-white tabular-nums select-none">
              {hoursWorked} <span className="font-sans text-[11px] font-medium text-zinc-400">jam</span>
            </span>
            <button
              type="button"
              onClick={() => handleWorkedStep(1)}
              disabled={hoursWorked >= 18}
              aria-label="Tambah jam kerja"
              className="w-9 h-9 rounded-xl bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-100 font-bold text-lg flex items-center justify-center shadow-sm active:scale-90 disabled:opacity-30 disabled:pointer-events-none transition-all touch-manipulation"
            >
              +
            </button>
          </div>
        </div>

        {/* 3. Tipe Shift */}
        <div>
          <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-300 mb-1.5">
            Tipe Shift Saat Ini
          </label>
          <div className="grid grid-cols-4 gap-1 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-2xl text-center">
            {(Object.keys(SHIFT_LABELS) as ShiftType[]).map((s) => (
              <button
                type="button"
                key={s}
                onClick={() => setShiftType(s)}
                className={`py-2 rounded-xl text-xs font-semibold transition-all ${
                  shiftType === s
                    ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm'
                    : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
                }`}
              >
                {SHIFT_LABELS[s]}
              </button>
            ))}
          </div>
        </div>

        {/* 4. Kafein */}
        <div>
          <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-300 mb-1.5">
            Konsumsi Kopi / Kafein Hari Ini
          </label>
          <div className="grid grid-cols-4 gap-1 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-2xl text-center">
            {(['none', 'low', 'moderate', 'high'] as CaffeineIntake[]).map((cf) => (
              <button
                type="button"
                key={cf}
                onClick={() => setCaffeine(cf)}
                className={`py-2 rounded-xl text-xs font-semibold transition-all ${
                  caffeine === cf
                    ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm'
                    : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
                }`}
              >
                {CAFFEINE_LABELS[cf]}
              </button>
            ))}
          </div>
        </div>

        {/* 5. Perasaan Saat Ini */}
        <div>
          <div className="flex justify-between items-center text-xs mb-1.5">
            <span className="text-zinc-600 dark:text-zinc-300 font-semibold">
              Perasaan Anda Saat Ini
            </span>
            <span className="font-bold text-apple-blue">
              {subjective <= 2 ? 'Segar' : subjective === 3 ? 'Biasa' : 'Lelah'}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-1 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-2xl text-center">
            {[
              { val: 1, label: 'Segar' },
              { val: 3, label: 'Biasa' },
              { val: 5, label: 'Lelah' },
            ].map((item) => (
              <button
                type="button"
                key={item.val}
                onClick={() => setSubjective(item.val)}
                className={`py-2 rounded-xl text-xs font-semibold transition-all ${
                  (item.val === 1 && subjective <= 2) ||
                  (item.val === 3 && subjective === 3) ||
                  (item.val === 5 && subjective >= 4)
                    ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm'
                    : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* 6. Aktivitas Fisik Berat */}
        <div
          role="checkbox"
          aria-checked={heavyLabor}
          tabIndex={0}
          onClick={() => setHeavyLabor((v) => !v)}
          onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') setHeavyLabor((v) => !v); }}
          className={`p-3 rounded-2xl flex items-center justify-between cursor-pointer border transition-all ${
            heavyLabor
              ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-300 dark:border-amber-700'
              : 'bg-zinc-50 dark:bg-zinc-800/60 border-black/5 dark:border-white/10'
          }`}
        >
          <div>
            <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-300 block">
              Aktivitas Fisik Berat
            </span>
            <span className="text-[11px] text-zinc-400">
              Angkat beban, bongkar muat, atau pekerjaan fisik intens hari ini.
            </span>
          </div>
          <div
            className={`w-10 h-6 rounded-full relative transition-colors flex-shrink-0 ${
              heavyLabor ? 'bg-amber-500' : 'bg-zinc-300 dark:bg-zinc-600'
            }`}
          >
            <span
              className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                heavyLabor ? 'translate-x-4' : 'translate-x-0.5'
              }`}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2.5 pt-2 border-t border-black/[0.04] dark:border-white/[0.08]">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-full text-zinc-500 font-semibold text-xs hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            Batal
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-full bg-apple-blue text-white font-bold text-xs hover:opacity-90 active:scale-95 shadow-sm transition-all"
          >
            Mulai Asesmen
          </button>
        </div>
      </form>
    </div>
  );
};
