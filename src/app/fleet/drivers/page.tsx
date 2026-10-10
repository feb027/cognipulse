'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, UserPlus, Search, RefreshCw, LogOut, Sun, Moon, Users } from 'lucide-react';
import { useTheme } from '@/components/theme/ThemeContext';
import { DriverWithLatestAssessment, DriverStatus } from '@/types/fleet';
import { useAuthSession, getAuthHeader } from '@/hooks/use-auth-session';
import { UnifiedLoginView } from '@/components/auth/UnifiedLoginView';
import { FleetAccessDenied } from '@/components/fleet/FleetAccessDenied';
import { RegisterDriverModal } from '@/components/driver/RegisterDriverModal';
import { DriverManagementTable } from '@/components/fleet/drivers/DriverManagementTable';
import { EditDriverModal } from '@/components/fleet/drivers/EditDriverModal';
import { ChangePinModal } from '@/components/fleet/drivers/ChangePinModal';
import { DeleteDriverConfirmModal } from '@/components/fleet/drivers/DeleteDriverConfirmModal';

interface DriverWithPin extends DriverWithLatestAssessment {
  pin?: string;
}

export default function FleetDriversPage() {
  const { theme, toggleTheme } = useTheme();
  const { session, loading: authLoading, isLoggedIn, isDispatcher, logout, setSessionDirect } = useAuthSession();
  const [drivers, setDrivers] = useState<DriverWithPin[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | DriverStatus>('all');

  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [editingDriver, setEditingDriver] = useState<DriverWithPin | null>(null);
  const [pinTargetDriver, setPinTargetDriver] = useState<DriverWithPin | null>(null);
  const [deletingDriver, setDeletingDriver] = useState<DriverWithPin | null>(null);

  const loadDrivers = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/drivers?admin=true', {
        headers: getAuthHeader(),
      });
      const data = await res.json();
      if (res.ok && data.drivers) {
        setDrivers(data.drivers);
      }
    } catch (err) {
      console.error('Failed to load drivers for admin:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isDispatcher) loadDrivers();
  }, [isDispatcher]);

  if (authLoading) return <div className="min-h-screen flex items-center justify-center text-xs text-zinc-500">Memuat akses...</div>;
  if (!isLoggedIn || !session) return <UnifiedLoginView onLoginSuccess={(s) => setSessionDirect(s)} />;
  if (session.role !== 'dispatcher') return <FleetAccessDenied driverName={session.driver?.name} onLogout={logout} />;

  const filtered = drivers.filter((d) => {
    const matchStatus = statusFilter === 'all' || d.status === statusFilter;
    const matchSearch =
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.nip.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.license_plate.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div className="min-h-screen pb-24 transition-colors">
      <header className="relative pt-6 pb-3 px-4 sm:px-6 max-w-5xl mx-auto w-full">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Link href="/fleet" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 text-xs font-semibold hover:bg-zinc-200 transition-all">
              <ArrowLeft className="w-3.5 h-3.5 text-apple-blue" />
              <span>Monitoring Armada</span>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={toggleTheme} className="w-8 h-8 rounded-full flex items-center justify-center bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 hover:scale-105 active:scale-95 transition-all">
              {theme === 'dark' ? <Sun className="w-4 h-4 text-apple-yellow" /> : <Moon className="w-4 h-4 text-zinc-700" />}
            </button>
            <button onClick={loadDrivers} className="p-2 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-all" title="Perbarui Data">
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button onClick={() => setIsRegisterOpen(true)} className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-apple-blue text-white text-xs font-semibold hover:bg-apple-blue/90 transition-all shadow-sm">
              <UserPlus className="w-3.5 h-3.5" />
              <span>Tambah Supir</span>
            </button>
            <button onClick={logout} className="p-2 rounded-full bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-all" title="Logout">
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div>
          <span className="text-[11px] font-bold tracking-wider uppercase text-zinc-400">KONTROL PENUH DISPATCHER • {drivers.length} SUPIR TERDAFTAR</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white">Kelola Supir & Kredensial</h1>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 space-y-4">
        <div className="p-3.5 rounded-2xl bg-white dark:bg-[#1C1C1E] border border-black/5 dark:border-white/10 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 text-xs font-semibold">
            {[
              { id: 'all', label: 'Semua' },
              { id: 'ready', label: 'Siap Solo' },
              { id: 'caution', label: 'Wajib Co-Driver' },
              { id: 'stand_down', label: 'Stand-Down' },
              { id: 'on_trip', label: 'On-Trip' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id as any)}
                className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all ${
                  statusFilter === tab.id ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900' : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-zinc-400" />
            <input
              type="text"
              placeholder="Cari supir, NIP, plat..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-transparent focus:border-apple-blue outline-none text-zinc-900 dark:text-white placeholder-zinc-400 font-medium"
            />
          </div>
        </div>

        <DriverManagementTable
          drivers={filtered}
          onEdit={(d) => setEditingDriver(d)}
          onChangePin={(d) => setPinTargetDriver(d)}
          onDelete={(d) => setDeletingDriver(d)}
        />
      </main>

      <RegisterDriverModal isOpen={isRegisterOpen} onClose={() => setIsRegisterOpen(false)} onDriverCreated={loadDrivers} />
      <EditDriverModal isOpen={Boolean(editingDriver)} driver={editingDriver} onClose={() => setEditingDriver(null)} onDriverUpdated={loadDrivers} />
      <ChangePinModal isOpen={Boolean(pinTargetDriver)} driver={pinTargetDriver} onClose={() => setPinTargetDriver(null)} onPinUpdated={loadDrivers} />
      <DeleteDriverConfirmModal isOpen={Boolean(deletingDriver)} driver={deletingDriver} onClose={() => setDeletingDriver(null)} onDeleted={loadDrivers} />
    </div>
  );
}
