'use client';

import React, { useState } from 'react';
import { X, UserPlus, AlertCircle } from 'lucide-react';
import { DriverWithLatestAssessment } from '@/types/fleet';
import { PasswordInput } from '@/components/auth/PasswordInput';
import { getAuthHeader } from '@/hooks/use-auth-session';

interface RegisterDriverModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDriverCreated: (newDriver: DriverWithLatestAssessment) => void;
}

export function RegisterDriverModal({ isOpen, onClose, onDriverCreated }: RegisterDriverModalProps) {
  const [form, setForm] = useState({
    nip: '', name: '', age: '',
    pin: '1234',
    vehicle_type: 'Toyota HiAce Premio', license_plate: '',
    address: '', medical_history: 'Tidak ada riwayat kronis (Bugar)',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nip || !form.name || !form.age || !form.license_plate || !form.address) {
      setError('Mohon lengkapi semua kolom bertanda bintang (*)');
      return;
    }
    setLoading(true); setError(null);

    try {
      const res = await fetch('/api/drivers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
        body: JSON.stringify({
          nip: form.nip.toUpperCase().trim(),
          name: form.name.trim(),
          age: parseInt(form.age, 10),
          pin: form.pin.trim() || '1234',
          vehicle_type: form.vehicle_type.trim(),
          license_plate: form.license_plate.toUpperCase().trim(),
          address: form.address.trim(),
          medical_history: form.medical_history.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal mendaftarkan supir');
      onDriverCreated(data.driver);
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan sistem');
    } finally {
      setLoading(false);
    }
  };

  const update = (field: string, val: string) => setForm((prev) => ({ ...prev, [field]: val }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-[#1C1C1E] rounded-3xl w-full max-w-lg overflow-hidden border border-black/10 dark:border-white/10 shadow-2xl flex flex-col max-h-[90vh] animate-springUp">
        <div className="px-5 py-4 border-b border-black/5 dark:border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-apple-blue" />
            <h3 className="text-base font-bold text-zinc-900 dark:text-white">Tambah Driver Travel Baru</h3>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-3 overflow-y-auto">
          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-zinc-500 uppercase">NIP Driver *</label>
              <input type="text" placeholder="TRV-006" value={form.nip} onChange={(e) => update('nip', e.target.value)} className="w-full mt-1 px-3 py-2 text-xs rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-transparent focus:border-apple-blue outline-none text-zinc-900 dark:text-white font-mono" />
            </div>
            <div>
              <label className="text-[11px] font-bold text-zinc-500 uppercase">Usia *</label>
              <input type="number" placeholder="35" value={form.age} onChange={(e) => update('age', e.target.value)} className="w-full mt-1 px-3 py-2 text-xs rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-transparent focus:border-apple-blue outline-none text-zinc-900 dark:text-white" />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-zinc-500 uppercase">Nama Lengkap *</label>
            <input type="text" placeholder="Rian Ardiansyah" value={form.name} onChange={(e) => update('name', e.target.value)} className="w-full mt-1 px-3 py-2 text-xs rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-transparent focus:border-apple-blue outline-none text-zinc-900 dark:text-white" />
          </div>

          <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/60 dark:border-zinc-800 space-y-1">
            <PasswordInput
              id="register-driver-pin"
              name="pin"
              label="PIN / Kata Sandi Masuk Supir *"
              placeholder="Contoh: 1234"
              maxLength={6}
              isMono
              value={form.pin}
              onChange={(e) => update('pin', e.target.value)}
            />
            <p className="text-[10px] text-zinc-500 dark:text-zinc-400">
              Kata sandi/PIN 4-6 digit yang digunakan supir untuk login. Bisa dilihat/diperiksa dengan menekan ikon mata.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-zinc-500 uppercase">Armada *</label>
              <input type="text" value={form.vehicle_type} onChange={(e) => update('vehicle_type', e.target.value)} className="w-full mt-1 px-3 py-2 text-xs rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-transparent focus:border-apple-blue outline-none text-zinc-900 dark:text-white" />
            </div>
            <div>
              <label className="text-[11px] font-bold text-zinc-500 uppercase">Plat Nomor *</label>
              <input type="text" placeholder="D 1892 XYZ" value={form.license_plate} onChange={(e) => update('license_plate', e.target.value)} className="w-full mt-1 px-3 py-2 text-xs rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-transparent focus:border-apple-blue outline-none text-zinc-900 dark:text-white font-mono" />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-zinc-500 uppercase">Alamat Domisili *</label>
            <input type="text" placeholder="Bandung / Pool Pasteur" value={form.address} onChange={(e) => update('address', e.target.value)} className="w-full mt-1 px-3 py-2 text-xs rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-transparent focus:border-apple-blue outline-none text-zinc-900 dark:text-white" />
          </div>

          <div>
            <label className="text-[11px] font-bold text-zinc-500 uppercase">Riwayat Medis / Penyakit</label>
            <input type="text" value={form.medical_history} onChange={(e) => update('medical_history', e.target.value)} className="w-full mt-1 px-3 py-2 text-xs rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-transparent focus:border-apple-blue outline-none text-zinc-900 dark:text-white" />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-500 hover:text-zinc-900 dark:hover:text-white">Batal</button>
            <button type="submit" disabled={loading} className="px-4 py-2 rounded-xl bg-apple-blue hover:bg-apple-blue/90 text-white text-xs font-semibold disabled:opacity-50 transition-all shadow-sm">
              {loading ? 'Menyimpan...' : 'Simpan ke Database'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
