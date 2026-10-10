'use client';

import React, { useState, useEffect } from 'react';
import { X, Pencil, AlertCircle } from 'lucide-react';
import { DriverWithLatestAssessment, DriverStatus } from '@/types/fleet';
import { getAuthHeader } from '@/hooks/use-auth-session';

interface EditDriverModalProps {
  isOpen: boolean;
  onClose: () => void;
  driver: DriverWithLatestAssessment | null;
  onDriverUpdated: () => void;
}

export function EditDriverModal({ isOpen, onClose, driver, onDriverUpdated }: EditDriverModalProps) {
  const [form, setForm] = useState({
    name: '', age: '', vehicle_type: '', license_plate: '', address: '', medical_history: '', status: 'ready' as DriverStatus,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (driver) {
      setForm({
        name: driver.name || '',
        age: String(driver.age || 30),
        vehicle_type: driver.vehicle_type || '',
        license_plate: driver.license_plate || '',
        address: driver.address || '',
        medical_history: driver.medical_history || '',
        status: driver.status || 'ready',
      });
      setError(null);
    }
  }, [driver]);

  if (!isOpen || !driver) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.age || !form.license_plate || !form.address) {
      setError('Mohon lengkapi semua kolom bertanda bintang (*)');
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
          name: form.name.trim(),
          age: parseInt(form.age, 10),
          vehicle_type: form.vehicle_type.trim(),
          license_plate: form.license_plate.toUpperCase().trim(),
          address: form.address.trim(),
          medical_history: form.medical_history.trim(),
          status: form.status,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal memperbarui data supir');

      onDriverUpdated();
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
            <Pencil className="w-5 h-5 text-apple-blue" />
            <h3 className="text-base font-bold text-zinc-900 dark:text-white">Edit Data Supir ({driver.nip})</h3>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 hover:text-zinc-900 dark:hover:text-white">
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
              <label className="text-[11px] font-bold text-zinc-500 uppercase">Nama Lengkap *</label>
              <input type="text" value={form.name} onChange={(e) => update('name', e.target.value)} className="w-full mt-1 px-3 py-2 text-xs rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-transparent focus:border-apple-blue outline-none text-zinc-900 dark:text-white" />
            </div>
            <div>
              <label className="text-[11px] font-bold text-zinc-500 uppercase">Usia *</label>
              <input type="number" value={form.age} onChange={(e) => update('age', e.target.value)} className="w-full mt-1 px-3 py-2 text-xs rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-transparent focus:border-apple-blue outline-none text-zinc-900 dark:text-white" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-zinc-500 uppercase">Armada Kendaraan *</label>
              <input type="text" value={form.vehicle_type} onChange={(e) => update('vehicle_type', e.target.value)} className="w-full mt-1 px-3 py-2 text-xs rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-transparent focus:border-apple-blue outline-none text-zinc-900 dark:text-white" />
            </div>
            <div>
              <label className="text-[11px] font-bold text-zinc-500 uppercase">Plat Nomor *</label>
              <input type="text" value={form.license_plate} onChange={(e) => update('license_plate', e.target.value)} className="w-full mt-1 px-3 py-2 text-xs rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-transparent focus:border-apple-blue outline-none text-zinc-900 dark:text-white font-mono" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-zinc-500 uppercase">Status Operasional</label>
              <select value={form.status} onChange={(e) => update('status', e.target.value)} className="w-full mt-1 px-3 py-2 text-xs rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-transparent focus:border-apple-blue outline-none text-zinc-900 dark:text-white">
                <option value="ready">Siap Solo (Ready)</option>
                <option value="caution">Wajib Co-Driver (Caution)</option>
                <option value="stand_down">Stand-Down (Istirahat)</option>
                <option value="on_trip">On-Trip (Sedang Jalan)</option>
              </select>
            </div>
            <div>
              <label className="text-[11px] font-bold text-zinc-500 uppercase">Alamat Domisili *</label>
              <input type="text" value={form.address} onChange={(e) => update('address', e.target.value)} className="w-full mt-1 px-3 py-2 text-xs rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-transparent focus:border-apple-blue outline-none text-zinc-900 dark:text-white" />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-zinc-500 uppercase">Riwayat Medis / Penyakit</label>
            <input type="text" value={form.medical_history} onChange={(e) => update('medical_history', e.target.value)} className="w-full mt-1 px-3 py-2 text-xs rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-transparent focus:border-apple-blue outline-none text-zinc-900 dark:text-white" />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-500 hover:text-zinc-900 dark:hover:text-white">Batal</button>
            <button type="submit" disabled={loading} className="px-4 py-2 rounded-xl bg-apple-blue hover:bg-apple-blue/90 text-white text-xs font-semibold disabled:opacity-50 transition-all shadow-sm">
              {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
