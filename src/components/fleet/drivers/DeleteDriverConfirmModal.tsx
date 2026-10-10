'use client';

import React, { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { DriverWithLatestAssessment } from '@/types/fleet';
import { getAuthHeader } from '@/hooks/use-auth-session';

interface DeleteDriverConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  driver: DriverWithLatestAssessment | null;
  onDeleted: () => void;
}

export function DeleteDriverConfirmModal({
  isOpen,
  onClose,
  driver,
  onDeleted,
}: DeleteDriverConfirmModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !driver) return null;

  const handleDelete = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/drivers?id=${driver.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal menghapus supir');

      onDeleted();
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan sistem');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-[#1C1C1E] rounded-3xl w-full max-w-sm overflow-hidden border border-red-500/20 dark:border-red-500/30 shadow-2xl flex flex-col animate-springUp">
        <div className="px-5 py-4 border-b border-black/5 dark:border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2 text-red-500">
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            <h3 className="text-sm font-bold">Hapus Supir dari Sistem</h3>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 hover:text-zinc-900 dark:hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
            Apakah Anda yakin ingin menghapus supir <strong className="text-zinc-900 dark:text-white">{driver.name}</strong> ({driver.nip})? Tindakan ini bersifat permanen dan akan menghapus riwayat asesmen terkait.
          </p>

          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={loading}
              className="px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white text-xs font-semibold disabled:opacity-50 transition-all shadow-sm"
            >
              {loading ? 'Menghapus...' : 'Ya, Hapus Supir'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
