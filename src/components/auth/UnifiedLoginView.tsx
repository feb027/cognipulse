'use client';

import React, { useState } from 'react';
import { Truck, AlertCircle, Sparkles, ArrowRight, Sun, Moon } from 'lucide-react';
import { useTheme } from '@/components/theme/ThemeContext';
import { LoginPayload, AuthSession } from '@/types/auth';

interface UnifiedLoginViewProps {
  onLoginSuccess: (session: AuthSession) => void;
}

export function UnifiedLoginView({ onLoginSuccess }: UnifiedLoginViewProps) {
  const { theme, toggleTheme } = useTheme();
  const [role, setRole] = useState<'driver' | 'dispatcher'>('driver');
  const [driverNip, setDriverNip] = useState('');
  const [driverPin, setDriverPin] = useState('');
  const [adminUser, setAdminUser] = useState('');
  const [adminPass, setAdminPass] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fillDemoDriver = (nip: string) => {
    setDriverNip(nip);
    setDriverPin('1234');
    setError(null);
  };

  const fillDemoDispatcher = () => {
    setAdminUser('admin');
    setAdminPass('admin123');
    setError(null);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const payload: LoginPayload =
        role === 'driver'
          ? { role: 'driver', nip: driverNip.trim().toUpperCase(), pin: driverPin.trim() }
          : { role: 'dispatcher', username: adminUser.trim(), password: adminPass.trim() };

      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Autentikasi gagal');

      try {
        localStorage.setItem('cognipulse_auth_session', JSON.stringify(data.session));
      } catch {}

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('cognipulse_auth_change'));
      }

      onLoginSuccess(data.session);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan sistem');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#F2F2F7] dark:bg-black text-zinc-900 dark:text-zinc-100 transition-colors">
      <div className="relative w-full max-w-md p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1C1C1E] border border-black/5 dark:border-white/10 shadow-apple dark:shadow-2xl space-y-6 animate-springUp">
        {/* Top Floating Theme Switcher */}
        <button
          type="button"
          onClick={toggleTheme}
          aria-label="Ubah Tema"
          className="absolute top-6 right-6 w-8 h-8 rounded-full flex items-center justify-center bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 hover:scale-105 active:scale-95 transition-all"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-apple-yellow" /> : <Moon className="w-4 h-4 text-zinc-700" />}
        </button>

        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-apple-orange to-apple-red text-white shadow-lg shadow-apple-orange/20 mb-1">
            <Truck className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-white">CogniPulse Fleet</h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-xs mx-auto">
            Platform Asesmen Neurokognitif Kesiapan Mengemudi Travel Antarkota
          </p>
        </div>

        {/* Role Segmented Switcher */}
        <div className="grid grid-cols-2 p-1 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-black/5 dark:border-white/10 text-xs font-semibold">
          <button
            type="button"
            onClick={() => { setRole('driver'); setError(null); }}
            className={`py-2 rounded-xl transition-all ${role === 'driver' ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'}`}
          >
            Supir Travel
          </button>
          <button
            type="button"
            onClick={() => { setRole('dispatcher'); setError(null); }}
            className={`py-2 rounded-xl transition-all ${role === 'dispatcher' ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'}`}
          >
            Dispatcher Armada
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs flex items-center gap-2 animate-fadeIn">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-500" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          {role === 'driver' ? (
            <>
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">NIP Supir</label>
                <input
                  type="text"
                  placeholder="Contoh: TRV-001"
                  value={driverNip}
                  onChange={(e) => setDriverNip(e.target.value)}
                  className="w-full mt-1.5 px-3.5 py-2.5 text-xs rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:border-apple-blue outline-none text-zinc-900 dark:text-white font-mono placeholder-zinc-400 dark:placeholder-zinc-600"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">PIN Keamanan (4 Digit)</label>
                <input
                  type="password"
                  placeholder="••••"
                  maxLength={6}
                  value={driverPin}
                  onChange={(e) => setDriverPin(e.target.value)}
                  className="w-full mt-1.5 px-3.5 py-2.5 text-xs rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:border-apple-blue outline-none text-zinc-900 dark:text-white font-mono placeholder-zinc-400 dark:placeholder-zinc-600 tracking-widest"
                />
              </div>

              {/* Demo Driver Shortcuts */}
              <div className="pt-1 space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">Akun Supir Demo Cepat:</span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { nip: 'TRV-001', name: 'Budi (TRV-001)' },
                    { nip: 'TRV-002', name: 'Hendra (TRV-002)' },
                    { nip: 'TRV-004', name: 'Dimas (TRV-004)' },
                  ].map((d) => (
                    <button key={d.nip} type="button" onClick={() => fillDemoDriver(d.nip)} className="px-2.5 py-1 rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800/80 dark:hover:bg-zinc-800 text-[11px] text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700/50 font-mono">
                      {d.name}
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Username Dispatcher</label>
                <input
                  type="text"
                  placeholder="admin"
                  value={adminUser}
                  onChange={(e) => setAdminUser(e.target.value)}
                  className="w-full mt-1.5 px-3.5 py-2.5 text-xs rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:border-apple-blue outline-none text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={adminPass}
                  onChange={(e) => setAdminPass(e.target.value)}
                  className="w-full mt-1.5 px-3.5 py-2.5 text-xs rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:border-apple-blue outline-none text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600"
                />
              </div>

              <div className="pt-1">
                <button
                  type="button"
                  onClick={fillDemoDispatcher}
                  className="text-[11px] text-apple-blue hover:underline inline-flex items-center gap-1 font-medium"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Isi Akun Dispatcher Demo (admin / admin123)</span>
                </button>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 py-3 rounded-xl bg-apple-blue hover:bg-apple-blue/90 text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5 disabled:opacity-50 active:scale-[0.98]"
          >
            <span>{loading ? 'Memvalidasi...' : role === 'driver' ? 'Masuk ke Portal Supir' : 'Buka Konsol Armada'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
