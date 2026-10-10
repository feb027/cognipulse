'use client';

import React, { useState, useEffect } from 'react';
import { X, KeyRound, AlertCircle, CheckCircle2, Sparkles } from 'lucide-react';
import { PasswordInput } from '@/components/auth/PasswordInput';
import { getAuthHeader } from '@/hooks/use-auth-session';
import { DriverWithLatestAssessment } from '@/types/fleet';

interface ChangePinModalProps {
  isOpen: boolean;
  onClose: () => void;
  driver: (DriverWithLatestAssessment & { pin?: string }) | null;
  onPinUpdated: () => void;
}

export function ChangePinModal({ isOpen, onClose, driver, onPinUpdated }: ChangePinModalProps) {
  const [newPin, setNewPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (driver) {
      setNewPin(driver.pin || '1234');
      setError(null);
      setSuccess(null);
    }
  }, [driver]);

  if (!isOpen || !driver) return null;

  const handleGenerateRandom = () => {
    const random = Math.floor(1000 + Math.random() * 9000).toString();
    setNewPin(random);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPin.trim()) {
      setError('PIN baru wajib diisi');
      return;
    }
    if (newPin.trim().length < 4) {
      setError('PIN minimal harus 4 digit/karakter');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/drivers', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
        body: JSON.stringify({
          id: driver.id,
          pin: newPin.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal mengubah PIN supir');

      setSuccess(`PIN untuk ${driver.name} berhasil diubah ke: ${newPin.trim()}`);
      onPinUpdated();
      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan sistem');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-[#1C1C1E] rounded-3xl w-full max-w-sm overflow-hidden border border-black/10 dark:border-white/10 shadow-2xl flex flex-col animate-springUp">
        <div className="px-5 py-4 border-b border-black/5 dark:border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-apple-orange" />
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white">Ubah Password / PIN Supir</h3>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 hover:text-zinc-900 dark:hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900/80 border border-zinc-200/60 dark:border-zinc-800 text-xs space-y-1">
            <div className="font-bold text-zinc-900 dark:text-white">{driver.name}</div>
            <div className="text-zinc-500 font-mono text-[11px]">NIP: {driver.nip} • {driver.vehicle_type}</div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs flex items-center gap-2 animate-fadeIn">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>{success}</span>
            </div>
          )}

          <div className="space-y-2">
            <PasswordInput
              id="change-driver-pin"
              label="Kata Sandi / PIN Baru (4-6 Karakter) *"
              placeholder="Contoh: 1234"
              maxLength={6}
              isMono
              value={newPin}
              onChange={(e) => setNewPin(e.target.value)}
              required
            />

            <div className="flex items-center justify-between pt-1 text-[11px]">
              <button
                type="button"
                onClick={handleGenerateRandom}
                className="text-apple-blue hover:underline inline-flex items-center gap-1 font-medium transition-colors"
              >
                <Sparkles className="w-3 h-3" />
                <span>Buat PIN 4-Digit Acak</span>
              </button>
              <button
                type="button"
                onClick={() => setNewPin('1234')}
                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
              >
                Reset ke 1234
              </button>
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors">
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-xl bg-apple-blue hover:bg-apple-blue/90 text-white text-xs font-semibold disabled:opacity-50 transition-all shadow-sm"
            >
              {loading ? 'Menyimpan...' : 'Simpan PIN Baru'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
