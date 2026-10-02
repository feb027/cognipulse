/**
 * Results Component: GeminiDifferentialView
 * Menampilkan diagnosis diferensial bertenaga Gemini 3.8 Flash Clinical Reasoning.
 */

import React from 'react';
import { GeminiClinicalAnalysis } from '@/types/gemini';
import { Brain, Cpu, CheckCircle } from 'lucide-react';

interface GeminiDifferentialViewProps {
  analysis: GeminiClinicalAnalysis;
}

export const GeminiDifferentialView: React.FC<GeminiDifferentialViewProps> = ({
  analysis,
}) => {
  const { differentialDiagnosis, aiEngineVersion, isFallback } = analysis;

  const typeLabels = {
    optimal_vigilance: 'Mode Gacor • Fokus Prima & On-Fire',
    cognitive_overload: 'RAM Mental Overload • Butuh Refresh',
    sleep_deprived_microsleep: 'Baterai Drop • Kantuk Berat & Bengong',
    neuromuscular_exhaustion: 'Fisik Pegal • Otot & Saraf Lelah',
  };

  return (
    <div className="p-4 rounded-lg bg-zinc-900/90 border border-zinc-800 space-y-3">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-cyan-400" />
          <h3 className="text-sm font-bold text-zinc-100 font-sans tracking-tight uppercase">
            Diagnosis Diferensial Klinis
          </h3>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] font-mono">
          <Cpu className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-zinc-300">Engine:</span>
          <span className="text-cyan-300 font-semibold px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/80">
            {aiEngineVersion}
          </span>
          {isFallback && (
            <span className="text-amber-400 text-[10px] ml-1">[OFFLINE RESILIENCE]</span>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-zinc-400">Etiologi Utama:</span>
          <strong className="text-cyan-300 font-semibold">
            {typeLabels[differentialDiagnosis.primaryType] || differentialDiagnosis.primaryType}
          </strong>
        </div>

        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-zinc-400">Tingkat Keyakinan Klinis:</span>
          <div className="flex items-center gap-1 text-emerald-400">
            <CheckCircle className="w-3.5 h-3.5" />
            {(() => {
              const rawConf = differentialDiagnosis.confidenceScore ?? 0.9;
              const normalized = rawConf > 1 ? rawConf : rawConf * 100;
              const displayPct = Math.min(100, Math.max(0, Math.round(normalized)));
              return <span>{displayPct}%</span>;
            })()}
          </div>
        </div>

        <div className="pt-2 border-t border-zinc-800/80">
          <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block mb-1">
            Rasionalisasi Klinis & Neurofisiologis:
          </span>
          <p className="text-xs text-zinc-300 font-sans leading-relaxed bg-zinc-950/50 p-3 rounded border border-zinc-800/60">
            {differentialDiagnosis.clinicalRationale}
          </p>
        </div>
      </div>
    </div>
  );
};
