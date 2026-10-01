'use client';

import React from 'react';
import { X, Sparkles, Zap } from 'lucide-react';
import { JURY_SCENARIOS, JuryScenario, DemoScenarioPackage } from '@/lib/demo-scenarios';

interface JuryPresetModalProps {
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

export function JuryPresetModal({
  isOpen,
  onClose,
  onApplyScenario,
  isSimulating = false,
}: JuryPresetModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-sm rounded-3xl bg-white dark:bg-[#1C1C1E] border border-black/10 dark:border-white/10 shadow-2xl p-5 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-apple-orange/10 text-apple-orange flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white">Preset Skenario Juri</h3>
              <p className="text-[11px] text-zinc-400">Simulasi telemetri siap pakai untuk pengujian</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Preset List */}
        <div className="space-y-2">
          {JURY_SCENARIOS.map((sc: JuryScenario) => (
            <button
              key={sc.id}
              disabled={isSimulating}
              onClick={() => {
                onApplyScenario(sc.generate());
                onClose();
              }}
              className="w-full text-left p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/80 hover:bg-apple-blue/10 hover:text-apple-blue dark:hover:bg-apple-blue/20 transition-all flex items-center justify-between text-xs font-medium text-zinc-800 dark:text-zinc-200 border border-black/5 dark:border-white/5 disabled:opacity-50"
            >
              <div>
                <div className="font-semibold text-zinc-900 dark:text-white">{sc.title}</div>
                <div className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                  {SCENARIO_DESCRIPTIONS[sc.id] || 'Simulasi telemetri'}
                </div>
              </div>
              <Zap className="w-4 h-4 text-apple-orange shrink-0 ml-2" />
            </button>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-semibold text-xs hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
        >
          Batal
        </button>
      </div>
    </div>
  );
}
