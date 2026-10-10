'use client';

import React, { useState } from 'react';
import { X, ShieldCheck, AlertCircle, CheckCircle2 } from 'lucide-react';
import { PasswordInput } from '@/components/auth/PasswordInput';
import { getAuthHeader } from '@/hooks/use-auth-session';

interface AdminSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUsername: string;
  currentName: string;
  onProfileUpdated: (updated: { username: string; name: string }) => void;
}

export function AdminSettingsModal({
  isOpen,
  onClose,
  currentUsername,
  currentName,
  onProfileUpdated,
}: AdminSettingsModalProps) {
  const [username, setUsername] = useState(currentUsername);
  const [name, setName] = useState(currentName);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!currentPassword) {
      setError('Kata sandi saat ini wajib dimasukkan untuk mengonfirmasi perubahan.');
      return;
    }

    if (newPassword && newPassword.length < 6) {
      setError('Kata sandi baru minimal harus 6 karakter.');
      return;
    }

    if (newPassword && newPassword !== confirmPassword) {
      setError('Konfirmasi kata sandi baru tidak cocok.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/admin/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
        body: JSON.stringify({
          currentUsername,
          currentPassword,
          newUsername: username.trim(),
          newName: name.trim(),
          newPassword: newPassword ? newPassword.trim() : undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal memperbarui kredensial');

      setSuccess('Kredensial admin berhasil diperbarui!');
      onProfileUpdated(data.dispatcher);

      // Perbarui sesi lokal
      try {
        const stored = localStorage.getItem('cognipulse_auth_session');
        if (stored) {
          const sess = JSON.parse(stored);
          sess.username = data.dispatcher.username;
          sess.name = data.dispatcher.name;
          localStorage.setItem('cognipulse_auth_session', JSON.stringify(sess));
          window.dispatchEvent(new Event('cognipulse_auth_change'));
        }
      } catch {}

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
      <div className="bg-white dark:bg-[#1C1C1E] rounded-3xl w-full max-w-md overflow-hidden border border-black/10 dark:border-white/10 shadow-2xl flex flex-col max-h-[90vh] animate-springUp">
        <div className="px-5 py-4 border-b border-black/5 dark:border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-apple-blue" />
            <h3 className="text-base font-bold text-zinc-900 dark:text-white">Kelola Akun Dispatcher / Admin</h3>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 hover:text-zinc-900 dark:hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 overflow-y-auto">
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

          <div>
            <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Nama Dispatcher</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mt-1.5 px-3.5 py-2 text-xs rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-transparent focus:border-apple-blue outline-none text-zinc-900 dark:text-white"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Username Admin</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full mt-1.5 px-3.5 py-2 text-xs rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-transparent focus:border-apple-blue outline-none text-zinc-900 dark:text-white font-mono"
            />
          </div>

          <div className="pt-2 border-t border-black/5 dark:border-white/10 space-y-3">
            <PasswordInput
              id="admin-current-pass"
              label="Kata Sandi Saat Ini *"
              placeholder="Masukkan kata sandi lama"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />

            <PasswordInput
              id="admin-new-pass"
              label="Kata Sandi Baru (Kosongkan jika tidak diubah)"
              placeholder="Minimal 6 karakter"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />

            {newPassword && (
              <PasswordInput
                id="admin-confirm-pass"
                label="Konfirmasi Kata Sandi Baru *"
                placeholder="Ulangi kata sandi baru"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            )}
          </div>

          <div className="pt-3 flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors">
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-xl bg-apple-blue hover:bg-apple-blue/90 text-white text-xs font-semibold disabled:opacity-50 transition-all shadow-sm"
            >
              {loading ? 'Menyimpan...' : 'Perbarui Kredensial'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
