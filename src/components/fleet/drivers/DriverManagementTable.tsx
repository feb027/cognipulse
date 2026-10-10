'use client';

import React from 'react';
import { KeyRound, Pencil, Trash2, Shield, Eye, EyeOff } from 'lucide-react';
import { DriverWithLatestAssessment, DriverStatus } from '@/types/fleet';

interface DriverWithPin extends DriverWithLatestAssessment {
  pin?: string;
}

interface DriverManagementTableProps {
  drivers: DriverWithPin[];
  onEdit: (driver: DriverWithPin) => void;
  onChangePin: (driver: DriverWithPin) => void;
  onDelete: (driver: DriverWithPin) => void;
}

function StatusBadge({ status }: { status: DriverStatus }) {
  const configs: Record<DriverStatus, { bg: string; text: string; label: string }> = {
    ready: { bg: 'bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400', label: 'Siap Solo' },
    caution: { bg: 'bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400', label: 'Wajib Co-Driver' },
    stand_down: { bg: 'bg-red-500/10 dark:bg-red-500/20 text-red-600 dark:text-red-400', label: 'Stand-Down' },
    on_trip: { bg: 'bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400', label: 'On-Trip' },
  };
  const c = configs[status] || configs.ready;
  return <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase ${c.bg}`}>{c.label}</span>;
}

export function DriverManagementTable({ drivers, onEdit, onChangePin, onDelete }: DriverManagementTableProps) {
  const [revealedPins, setRevealedPins] = React.useState<Record<number, boolean>>({});

  const togglePin = (id: number) => {
    setRevealedPins((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  if (drivers.length === 0) {
    return (
      <div className="p-8 text-center rounded-2xl bg-white dark:bg-[#1C1C1E] border border-black/5 dark:border-white/10 text-zinc-400 text-xs">
        Belum ada supir yang sesuai pencarian atau terdaftar di sistem.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl bg-white dark:bg-[#1C1C1E] border border-black/5 dark:border-white/10 shadow-sm">
      <table className="w-full text-left text-xs">
        <thead className="bg-zinc-50 dark:bg-zinc-900/60 border-b border-black/5 dark:border-white/10 text-[11px] font-bold uppercase tracking-wider text-zinc-400">
          <tr>
            <th className="py-3 px-4">Supir & NIP</th>
            <th className="py-3 px-4">Armada & Plat</th>
            <th className="py-3 px-4">Status</th>
            <th className="py-3 px-4">PIN Akses</th>
            <th className="py-3 px-4 text-right">Tindakan Admin</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-black/5 dark:divide-white/5">
          {drivers.map((driver) => {
            const isRevealed = revealedPins[driver.id];
            const pinValue = driver.pin || '1234';

            return (
              <tr key={driver.id} className="hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40 transition-colors">
                <td className="py-3 px-4">
                  <div className="font-bold text-zinc-900 dark:text-white flex items-center gap-1.5">
                    <span>{driver.name}</span>
                    <span className="text-[10px] font-normal text-zinc-400">({driver.age} thn)</span>
                  </div>
                  <div className="text-[11px] font-mono text-zinc-500">{driver.nip}</div>
                </td>

                <td className="py-3 px-4">
                  <div className="text-zinc-700 dark:text-zinc-300 font-medium">{driver.vehicle_type}</div>
                  <div className="text-[11px] font-mono text-zinc-400">{driver.license_plate}</div>
                </td>

                <td className="py-3 px-4">
                  <StatusBadge status={driver.status} />
                </td>

                <td className="py-3 px-4">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-mono text-xs">
                    <Shield className="w-3 h-3 text-apple-orange" />
                    <span>{isRevealed ? pinValue : '••••'}</span>
                    <button
                      type="button"
                      onClick={() => togglePin(driver.id)}
                      className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
                      title={isRevealed ? 'Sembunyikan PIN' : 'Lihat PIN'}
                    >
                      {isRevealed ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    </button>
                  </div>
                </td>

                <td className="py-3 px-4 text-right">
                  <div className="inline-flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => onChangePin(driver)}
                      className="p-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-semibold transition-all inline-flex items-center gap-1"
                      title="Ganti Password / PIN Supir"
                    >
                      <KeyRound className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline text-[11px]">Ubah PIN</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onEdit(driver)}
                      className="p-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 text-xs font-semibold transition-all inline-flex items-center gap-1"
                      title="Edit Data Supir"
                    >
                      <Pencil className="w-3.5 h-3.5 text-apple-blue" />
                      <span className="hidden sm:inline text-[11px]">Edit</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onDelete(driver)}
                      className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 text-xs font-semibold transition-all inline-flex items-center gap-1"
                      title="Hapus Supir"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline text-[11px]">Hapus</span>
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
