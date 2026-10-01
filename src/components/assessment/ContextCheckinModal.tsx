'use client';

import React, { useState } from 'react';
import { UserContext, CaffeineIntake } from '@/types/assessment';

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

export const ContextCheckinModal: React.FC<ContextCheckinModalProps> = ({
  initialContext,
  onSubmit,
  onCancel,
}) => {
  const [hoursSlept, setHoursSlept] = useState<number>(initialContext?.hoursSleptLastNight || 7);
  const [caffeine, setCaffeine] = useState<CaffeineIntake>(initialContext?.caffeineIntake || 'low');
  const [subjective, setSubjective] = useState<number>(initialContext?.subjectiveFatigueScore || 2);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      operatorId: 'OP-' + Math.floor(100 + Math.random() * 900),
      shiftType: 'morning',
      hoursSleptLastNight: Number(hoursSlept),
      hoursWorkedToday: 6,
      caffeineIntake: caffeine,
      subjectiveFatigueScore: Number(subjective),
    });
  };

  return (
    <div className="w-full max-w-md mx-auto p-5 sm:p-6 bg-white dark:bg-[#1C1C1E] rounded-3xl shadow-apple border border-black/5 dark:border-white/10 text-zinc-900 dark:text-white space-y-4 animate-springUp">
      <div className="pb-2 border-b border-black/[0.04] dark:border-white/[0.08]">
        <h3 className="text-base font-bold tracking-tight">Kondisi Anda Hari Ini</h3>
        <p className="text-xs text-zinc-400 mt-0.5">3 pertanyaan cepat sebelum memulai tes.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 text-xs font-medium">
        {/* 1. Jam Tidur */}
        <div className="p-3 bg-zinc-50 dark:bg-zinc-800/60 rounded-2xl flex items-center justify-between">
          <div>
            <label className="text-xs text-zinc-600 dark:text-zinc-300 font-semibold block">
              Tidur Semalam
            </label>
            <span className="text-[11px] text-zinc-400">Berapa jam Anda tidur?</span>
          </div>
          <div className="flex items-center gap-1.5">
            <input
              type="number"
              min="1"
              max="14"
              step="0.5"
              value={hoursSlept}
              onChange={(e) => setHoursSlept(Number(e.target.value))}
              className="w-14 text-right bg-white dark:bg-zinc-700 px-2 py-1 rounded-xl font-bold text-base text-zinc-900 dark:text-white border border-black/5 dark:border-white/10 focus:outline-none"
            />
            <span className="text-xs font-bold text-zinc-500">Jam</span>
          </div>
        </div>

        {/* 2. Kafein */}
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

        {/* 3. Perasaan Saat Ini */}
        <div className="p-3 bg-zinc-50 dark:bg-zinc-800/60 rounded-2xl space-y-1.5">
          <div className="flex justify-between items-center text-xs">
            <span className="text-zinc-600 dark:text-zinc-300 font-semibold">Perasaan Anda Saat Ini:</span>
            <span className="font-bold text-apple-blue">
              {subjective <= 2 ? 'Segar' : subjective === 3 ? 'Biasa' : 'Lelah'}
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="5"
            value={subjective}
            onChange={(e) => setSubjective(Number(e.target.value))}
            className="w-full accent-apple-blue cursor-pointer h-2 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none"
          />
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
