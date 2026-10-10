'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';

interface DemoAccountShortcutsProps {
  role: 'driver' | 'dispatcher';
  onSelectDriver: (nip: string) => void;
  onSelectDispatcher: () => void;
}

const DEMO_DRIVERS = [
  { nip: 'TRV-001', name: 'Budi (TRV-001)' },
  { nip: 'TRV-002', name: 'Hendra (TRV-002)' },
  { nip: 'TRV-004', name: 'Dimas (TRV-004)' },
];

export function DemoAccountShortcuts({
  role,
  onSelectDriver,
  onSelectDispatcher,
}: DemoAccountShortcutsProps) {
  if (role === 'driver') {
    return (
      <div className="pt-1 space-y-1.5">
        <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
          Akun Supir Demo Cepat:
        </span>
        <div className="flex flex-wrap gap-1.5">
          {DEMO_DRIVERS.map((d) => (
            <button
              key={d.nip}
              type="button"
              onClick={() => onSelectDriver(d.nip)}
              className="px-2.5 py-1 rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800/80 dark:hover:bg-zinc-800 text-[11px] text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700/50 font-mono transition-colors"
            >
              {d.name}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="pt-1">
      <button
        type="button"
        onClick={onSelectDispatcher}
        className="text-[11px] text-apple-blue hover:underline inline-flex items-center gap-1 font-medium transition-colors"
      >
        <Sparkles className="w-3 h-3" />
        <span>Isi Akun Dispatcher Demo (admin / admin123)</span>
      </button>
    </div>
  );
}
