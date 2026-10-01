/**
 * Demo Component: JuryScenarioSimulator
 * Bilah simulasi instan 1-klik untuk memudahkan juri menguji akurasi AI dalam hitungan detik.
 */

import React from 'react';
import { Sparkles, Activity, AlertTriangle, Moon } from 'lucide-react';
import { PVTMetrics } from '@/types/pvt';
import { StroopMetrics } from '@/types/stroop';
import { MotorMetrics } from '@/types/motor';
import { UserContext, CompositeFatigueResult } from '@/types/assessment';
import {
  SCENARIO_FRESH_WORKER,
  SCENARIO_DEV_OVERWORK,
  SCENARIO_DRIVER_CRITICAL,
} from '@/lib/demo-scenarios';

interface JuryScenarioSimulatorProps {
  onLoadScenario: (
    cfi: CompositeFatigueResult,
    pvt: PVTMetrics,
    stroop: StroopMetrics,
    motor: MotorMetrics,
    context: UserContext
  ) => void;
}

export const JuryScenarioSimulator: React.FC<JuryScenarioSimulatorProps> = ({
  onLoadScenario,
}) => {
  const triggerScenario = (pkg: typeof SCENARIO_FRESH_WORKER) => {
    onLoadScenario(pkg.cfi, pkg.pvt, pkg.stroop, pkg.motor, pkg.context);
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2 px-3 rounded-lg bg-zinc-900/40 border border-zinc-800/60 text-xs">
      <div className="flex items-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
        <span className="text-zinc-400 text-xs font-sans">
          Simulasi Skenario Klinis:
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        <button
          type="button"
          onClick={() => triggerScenario(SCENARIO_FRESH_WORKER)}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-900 hover:bg-emerald-950/30 border border-zinc-800 hover:border-emerald-700/60 text-xs font-sans text-emerald-400 active:scale-[0.97] transition-all"
        >
          <Activity className="w-3 h-3 text-emerald-400" />
          <span>Bugar (CFI 16)</span>
        </button>

        <button
          type="button"
          onClick={() => triggerScenario(SCENARIO_DEV_OVERWORK)}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-900 hover:bg-amber-950/30 border border-zinc-800 hover:border-amber-700/60 text-xs font-sans text-amber-400 active:scale-[0.97] transition-all"
        >
          <Moon className="w-3 h-3 text-amber-400" />
          <span>Begadang (CFI 72)</span>
        </button>

        <button
          type="button"
          onClick={() => triggerScenario(SCENARIO_DRIVER_CRITICAL)}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-900 hover:bg-rose-950/30 border border-zinc-800 hover:border-rose-700/60 text-xs font-sans text-rose-400 active:scale-[0.97] transition-all"
        >
          <AlertTriangle className="w-3 h-3 text-rose-400" />
          <span>Kritis (CFI 89)</span>
        </button>
      </div>
    </div>
  );
};

