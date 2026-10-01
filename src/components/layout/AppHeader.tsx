/**
 * Layout Component: AppHeader
 * Header navigasi atas CogniPulse dengan indikator versi dan protokol etika.
 */

import React from 'react';
import { Button } from '@/components/ui/Button';
import { BrainCircuit, ShieldCheck } from 'lucide-react';

interface AppHeaderProps {
  onOpenEthics: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ onOpenEthics }) => {
  return (
    <header className="flex items-center justify-between gap-3 border-b border-zinc-800/80 pb-3.5">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-cyan-400 shrink-0">
          <BrainCircuit className="w-5 h-5 text-cyan-400" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-sans font-bold tracking-tight text-zinc-100">
              CogniPulse
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 text-[10px] font-mono text-zinc-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              CLINICAL V1.0
            </span>
          </div>
          <p className="text-xs text-zinc-400 font-sans">
            Platform Neuro-Telemetri & Kesiapan Kognitif
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs">
        <Button
          size="sm"
          variant="secondary"
          onClick={onOpenEthics}
          className="text-xs font-sans text-zinc-300 border-zinc-800 hover:border-zinc-700"
        >
          <ShieldCheck className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />
          <span className="hidden sm:inline">Etika & Privasi</span>
          <span className="sm:hidden">Privasi</span>
        </Button>
        <span className="hidden md:inline-flex px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 text-[11px] font-mono">
          ICONFEST 2026
        </span>
      </div>
    </header>
  );
};
