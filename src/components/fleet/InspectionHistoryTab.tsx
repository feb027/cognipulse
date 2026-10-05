'use client';

import React from 'react';
import { AssessmentRecord } from '@/types/fleet';
import { Clock, ShieldCheck, AlertTriangle, ShieldAlert, CheckCircle } from 'lucide-react';

interface InspectionHistoryTabProps {
  assessments: AssessmentRecord[];
  onSelectRecord?: (record: AssessmentRecord) => void;
}

export function InspectionHistoryTab({ assessments, onSelectRecord }: InspectionHistoryTabProps) {
  if (!assessments || assessments.length === 0) {
    return (
      <div className="text-center py-12 text-xs text-zinc-400">
        Belum ada rekaman riwayat asesmen sebelumnya untuk supir ini.
      </div>
    );
  }

  const getDecisionBadge = (decision?: string) => {
    switch (decision) {
      case 'dispatched_solo':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="w-3 h-3" /> Solo
          </span>
        );
      case 'co_driver_assigned':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <AlertTriangle className="w-3 h-3" /> Co-Driver
          </span>
        );
      case 'stand_down_issued':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/10 text-red-600 dark:text-red-400">
            <ShieldAlert className="w-3 h-3" /> Stand-Down
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-500">
            Menunggu
          </span>
        );
    }
  };

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between text-[11px] text-zinc-400 font-semibold px-1">
        <span>Riwayat Asesmen Kebugaran Terdaftar</span>
        <span>{assessments.length} sesi tercatat</span>
      </div>

      <div className="space-y-2">
        {assessments.map((item, idx) => (
          <div
            key={item.id || idx}
            onClick={() => onSelectRecord && onSelectRecord(item)}
            className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/40 border border-black/5 dark:border-white/5 hover:border-black/10 dark:hover:border-white/10 transition-all space-y-2"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-zinc-400 flex-shrink-0" />
                <span className="text-xs font-bold text-zinc-900 dark:text-white">
                  {new Date(item.timestamp).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}{' '}
                  •{' '}
                  {new Date(item.timestamp).toLocaleTimeString('id-ID', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
              <div>{getDecisionBadge(item.dispatcher_decision)}</div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center py-1 px-2 rounded-xl bg-white dark:bg-zinc-900/60 text-xs">
              <div>
                <span className="text-[10px] text-zinc-400 block">Skor CFI</span>
                <span className="font-mono font-bold text-zinc-900 dark:text-white">
                  {Math.round(item.cfi_score)}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-zinc-400 block">Refleks</span>
                <span className="font-mono font-bold text-zinc-900 dark:text-white">
                  {Math.round(item.pvt_mean_rt)} ms
                </span>
              </div>
              <div>
                <span className="text-[10px] text-zinc-400 block">Rem Tol</span>
                <span className="font-mono font-bold text-apple-blue">
                  {item.braking_distance_meters} m
                </span>
              </div>
            </div>

            {item.headline_title && (
              <p className="text-[11px] text-zinc-500 truncate">
                {item.headline_title}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
