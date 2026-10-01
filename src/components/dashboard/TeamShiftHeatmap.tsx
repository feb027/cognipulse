'use client';

import React, { useState } from 'react';
import { TeamMemberFatigue } from '@/types/team';
import { Users, AlertCircle } from 'lucide-react';

const INITIAL_TEAM: TeamMemberFatigue[] = [
  { anonymousId: 'DEV-01', roleTitle: 'Frontend Engineer', shiftBadge: 'Pagi', cfiScore: 18, tier: 'fit', reactionLatencyMs: 215, lapsesRecorded: 0, lastAssessedTime: '08:45' },
  { anonymousId: 'DEV-04', roleTitle: 'DevOps / On-Call', shiftBadge: 'Malam', cfiScore: 78, tier: 'critical_hazard', reactionLatencyMs: 440, lapsesRecorded: 4, lastAssessedTime: '03:10' },
  { anonymousId: 'OP-12', roleTitle: 'Data Center Operator', shiftBadge: 'Malam', cfiScore: 68, tier: 'moderate_impairment', reactionLatencyMs: 380, lapsesRecorded: 3, lastAssessedTime: '02:50' },
  { anonymousId: 'LOG-03', roleTitle: 'Fleet Logistics Lead', shiftBadge: 'Siang', cfiScore: 28, tier: 'fit', reactionLatencyMs: 228, lapsesRecorded: 0, lastAssessedTime: '13:30' },
  { anonymousId: 'LOG-07', roleTitle: 'Heavy Vehicle Driver', shiftBadge: 'Malam', cfiScore: 84, tier: 'critical_hazard', reactionLatencyMs: 495, lapsesRecorded: 5, lastAssessedTime: '04:15' },
  { anonymousId: 'QA-02', roleTitle: 'Automation Tester', shiftBadge: 'Pagi', cfiScore: 34, tier: 'mild_fatigue', reactionLatencyMs: 260, lapsesRecorded: 1, lastAssessedTime: '09:15' },
];

export const TeamShiftHeatmap: React.FC = () => {
  const [teamMembers] = useState<TeamMemberFatigue[]>(INITIAL_TEAM);

  const total = teamMembers.length;
  const fitCount = teamMembers.filter((m) => m.tier === 'fit').length;
  const cautionCount = teamMembers.filter((m) => m.tier === 'mild_fatigue' || m.tier === 'moderate_impairment').length;
  const criticalCount = teamMembers.filter((m) => m.tier === 'critical_hazard').length;
  const avgCFI = Math.round(teamMembers.reduce((acc, m) => acc + m.cfiScore, 0) / total);

  const getTierBadge = (tier: string) => {
    switch (tier) {
      case 'fit':
        return <span className="px-2 py-0.5 rounded-full bg-apple-green/10 text-apple-green text-[11px] font-bold">Prima</span>;
      case 'critical_hazard':
        return <span className="px-2 py-0.5 rounded-full bg-apple-red/10 text-apple-red text-[11px] font-bold">Kritis</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full bg-apple-orange/10 text-apple-orange text-[11px] font-bold">Lelah Sedang</span>;
    }
  };

  return (
    <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#1C1C1E] border border-black/5 dark:border-white/10 shadow-apple space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-black/[0.04] dark:border-white/[0.08] pb-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-apple-blue/10 flex items-center justify-center text-apple-blue">
            <Users className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="font-bold text-zinc-900 dark:text-white text-sm">
              Kesiapan Tim Kerja
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
          <span>Rerata Tim:</span>
          <span className="font-bold text-apple-orange">{avgCFI}/100</span>
        </div>
      </div>

      {/* Aggregate Score Bar */}
      <div className="grid grid-cols-3 gap-3 text-xs">
        <div className="p-3.5 rounded-2xl bg-apple-green/10 space-y-0.5">
          <span className="text-[10px] font-bold text-apple-green uppercase block">Siap Kerja</span>
          <span className="text-xl sm:text-2xl font-extrabold text-apple-green">{Math.round((fitCount / total) * 100)}%</span>
          <span className="text-[11px] text-zinc-500 font-medium block">({fitCount} orang)</span>
        </div>
        <div className="p-3.5 rounded-2xl bg-apple-orange/10 space-y-0.5">
          <span className="text-[10px] font-bold text-apple-orange uppercase block">Lelah Sedang</span>
          <span className="text-xl sm:text-2xl font-extrabold text-apple-orange">{Math.round((cautionCount / total) * 100)}%</span>
          <span className="text-[11px] text-zinc-500 font-medium block">({cautionCount} orang)</span>
        </div>
        <div className="p-3.5 rounded-2xl bg-apple-red/10 space-y-0.5">
          <span className="text-[10px] font-bold text-apple-red uppercase block">Kritis</span>
          <span className="text-xl sm:text-2xl font-extrabold text-apple-red">{Math.round((criticalCount / total) * 100)}%</span>
          <span className="text-[11px] text-zinc-500 font-medium block">({criticalCount} orang)</span>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-black/[0.04] dark:border-white/[0.08]">
        <table className="w-full text-left text-xs">
          <thead className="bg-zinc-50 dark:bg-zinc-800/60 text-zinc-400 font-bold uppercase text-[10px] border-b border-black/[0.04] dark:border-white/[0.08]">
            <tr>
              <th className="p-3">ID Tim</th>
              <th className="p-3">Peran</th>
              <th className="p-3">Shift</th>
              <th className="p-3">Refleks</th>
              <th className="p-3">Hilang Fokus</th>
              <th className="p-3">Skor</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/[0.04] dark:divide-white/[0.08] font-medium text-zinc-800 dark:text-zinc-200">
            {teamMembers.map((m) => (
              <tr key={m.anonymousId} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30">
                <td className="p-3 font-bold text-apple-blue">{m.anonymousId}</td>
                <td className="p-3 text-zinc-600 dark:text-zinc-300">{m.roleTitle}</td>
                <td className="p-3 text-zinc-400">{m.shiftBadge}</td>
                <td className="p-3">{m.reactionLatencyMs} ms</td>
                <td className="p-3 text-apple-red font-semibold">{m.lapsesRecorded}x</td>
                <td className="p-3 font-bold">{m.cfiScore}</td>
                <td className="p-3">{getTierBadge(m.tier)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Actionable Note */}
      <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 flex items-start gap-3 text-xs">
        <AlertCircle className="w-4 h-4 text-apple-orange shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="font-bold text-zinc-900 dark:text-white block">
            Catatan untuk Pengawas:
          </span>
          <p className="text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed">
            Rekan <strong>DEV-04</strong> dan <strong>LOG-07</strong> menunjukkan tanda kantuk berat berulang. Disarankan segera memberikan waktu istirahat tidur minimal 20 menit sebelum melanjutkan tugas.
          </p>
        </div>
      </div>
    </div>
  );
};
