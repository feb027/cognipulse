'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, UserPlus, Search, RefreshCw, LogOut } from 'lucide-react';
import { FleetSummary, DriverWithLatestAssessment, DriverStatus } from '@/types/fleet';
import { FleetKpiSummary } from '@/components/fleet/FleetKpiSummary';
import { FleetDriverCard } from '@/components/fleet/FleetDriverCard';
import { FleetInspectionModal } from '@/components/fleet/FleetInspectionModal';
import { RegisterDriverModal } from '@/components/driver/RegisterDriverModal';
import { FleetAccessDenied } from '@/components/fleet/FleetAccessDenied';
import { UnifiedLoginView } from '@/components/auth/UnifiedLoginView';
import { useAuthSession } from '@/hooks/use-auth-session';

export default function FleetPage() {
  const { session, loading: authLoading, isLoggedIn, isDispatcher, logout } = useAuthSession();
  const [summary, setSummary] = useState<FleetSummary | null>(null);
  const [drivers, setDrivers] = useState<DriverWithLatestAssessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'all' | DriverStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDriver, setSelectedDriver] = useState<DriverWithLatestAssessment | null>(null);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  const loadFleetData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/fleet');
      const data = await res.json();
      if (res.ok) {
        setSummary(data.summary);
        setDrivers(data.drivers);
      }
    } catch (err) {
      console.error('Failed to load fleet data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isDispatcher) loadFleetData();
  }, [isDispatcher]);

  if (authLoading) {
    return <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-500 text-xs">Memuat hak akses dispatcher...</div>;
  }

  if (!isLoggedIn || !session) {
    return <UnifiedLoginView onLoginSuccess={(sess) => { if (sess.role !== 'dispatcher') window.location.href = '/'; }} />;
  }

  if (session.role !== 'dispatcher') {
    return (
      <FleetAccessDenied
        driverName={session.role === 'driver' ? session.driver.name : undefined}
        driverNip={session.role === 'driver' ? session.driver.nip : undefined}
        onLogout={logout}
      />
    );
  }

  const filteredDrivers = drivers.filter((d) => {
    const matchesStatus = statusFilter === 'all' || d.status === statusFilter;
    const matchesSearch =
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.nip.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.license_plate.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="min-h-screen pb-24 transition-colors">
      <header className="relative pt-6 pb-3 px-4 sm:px-6 max-w-5xl mx-auto w-full">
        <div className="flex items-center justify-between mb-2">
          <Link href="/" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 text-xs font-semibold hover:bg-zinc-200 transition-all">
            <ArrowLeft className="w-3.5 h-3.5 text-apple-blue" />
            <span>Mode Supir</span>
          </Link>
          <div className="flex items-center gap-2">
            <button onClick={loadFleetData} className="p-2 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-all" title="Perbarui Data">
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button onClick={() => setIsRegisterOpen(true)} className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-apple-blue text-white text-xs font-semibold hover:bg-apple-blue/90 transition-all shadow-sm">
              <UserPlus className="w-3.5 h-3.5" />
              <span>Tambah Supir</span>
            </button>
            <button onClick={logout} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-500/10 text-red-500 text-xs font-semibold hover:bg-red-500/20 transition-all border border-red-500/20" title="Logout Dispatcher">
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>

        <div>
          <span className="text-[11px] font-bold tracking-wider uppercase text-zinc-400">DISPATCHER CONTROL CENTER • {session.name}</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white">Konsol Armada Travel</h1>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 space-y-4">
        <FleetKpiSummary summary={summary} />

        <div className="p-3.5 rounded-2xl bg-white dark:bg-[#1C1C1E] border border-black/5 dark:border-white/10 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 text-xs font-semibold">
            {[
              { id: 'all', label: 'Semua' },
              { id: 'ready', label: 'Siap Solo' },
              { id: 'caution', label: 'Wajib Co-Driver' },
              { id: 'stand_down', label: 'Stand-Down' },
              { id: 'on_trip', label: 'On-Trip' },
            ].map((tab) => (
              <button key={tab.id} onClick={() => setStatusFilter(tab.id as any)} className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all ${statusFilter === tab.id ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900' : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'}`}>
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-zinc-400" />
            <input type="text" placeholder="Cari supir atau plat..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-transparent focus:border-apple-blue outline-none text-zinc-900 dark:text-white placeholder-zinc-400 font-medium" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredDrivers.map((driver) => (
            <FleetDriverCard key={driver.id} driver={driver} onInspect={(d) => setSelectedDriver(d)} />
          ))}
        </div>
      </main>

      <FleetInspectionModal isOpen={Boolean(selectedDriver)} driver={selectedDriver} onClose={() => setSelectedDriver(null)} onStatusUpdated={loadFleetData} />
      <RegisterDriverModal isOpen={isRegisterOpen} onClose={() => setIsRegisterOpen(false)} onDriverCreated={() => loadFleetData()} />
    </div>
  );
}
