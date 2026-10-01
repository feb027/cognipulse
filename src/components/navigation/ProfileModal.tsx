'use client';

import React from 'react';
import { X, Sparkles, ShieldCheck, Zap } from 'lucide-react';
import { JURY_SCENARIOS, JuryScenario, DemoScenarioPackage } from '@/lib/demo-scenarios';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyScenario: (pkg: DemoScenarioPackage) => void;
  isSimulating?: boolean;
}

const SCENARIO_DESCRIPTIONS: Record<string, string> = {
  fresh: 'Tidur cukup 8 jam • Kognisi prima',
  overwork: 'Lembur koding 10 jam • Lapses tinggi',
  critical: 'Shift malam 14 jam • Risiko kecelakaan tinggi',
};

export function ProfileModal({
  isOpen,
  onClose,
  onApplyScenario,
  isSimulating = false,
}: ProfileModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-sm rounded-3xl bg-white dark:bg-[#1C1C1E] border border-black/10 dark:border-white/10 shadow-2xl p-5 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-apple-orange to-apple-red flex items-center justify-center text-white text-sm font-bold shadow-sm">
              CP
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white">Budi Santoso</h3>
              <p className="text-[11px] text-zinc-500 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-500" />
                Operator Personal • ID-8821
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Info Box */}
        <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-black/5 dark:border-white/5 space-y-1 text-xs">
          <div className="flex justify-between text-zinc-500 dark:text-zinc-400">
            <span>Standar Penilaian</span>
            <span className="font-semibold text-zinc-800 dark:text-zinc-200">ISO 10075 / NASA PVT</span>
          </div>
          <div className="flex justify-between text-zinc-500 dark:text-zinc-400">
            <span>Privasi Data</span>
            <span className="font-semibold text-zinc-800 dark:text-zinc-200">Local-First (Enkripsi On-Device)</span>
          </div>
        </div>

        {/* Preset Evaluasi Juri Section */}
        <div className="space-y-2 pt-1 border-t border-black/5 dark:border-white/5">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-600 dark:text-zinc-400">
            <Sparkles className="w-3.5 h-3.5 text-apple-blue" />
            <span>Preset Skenario Evaluasi Juri</span>
          </div>
          <p className="text-[11px] text-zinc-500 leading-snug">
            Pilih skenario telemetri siap pakai untuk demonstrasi penilaian cepat:
          </p>
          <div className="space-y-1.5 pt-1">
            {JURY_SCENARIOS.map((sc: JuryScenario) => (
              <button
                key={sc.id}
                disabled={isSimulating}
                onClick={() => {
                  onApplyScenario(sc.generate());
                  onClose();
                }}
                className="w-full text-left p-2.5 rounded-xl bg-zinc-100/80 dark:bg-zinc-800/80 hover:bg-apple-blue/10 hover:text-apple-blue dark:hover:bg-apple-blue/20 transition-all flex items-center justify-between text-xs font-medium text-zinc-800 dark:text-zinc-200 border border-black/5 dark:border-white/5 disabled:opacity-50"
              >
                <div>
                  <div className="font-semibold">{sc.title}</div>
                  <div className="text-[10px] text-zinc-500 dark:text-zinc-400 font-normal">
                    {SCENARIO_DESCRIPTIONS[sc.id] || 'Simulasi telemetri'}
                  </div>
                </div>
                <Zap className="w-3.5 h-3.5 text-apple-blue shrink-0 ml-2" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
