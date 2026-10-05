'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldAlert } from 'lucide-react';

interface FleetAccessDeniedProps {
  driverName?: string;
  driverNip?: string;
  onLogout: () => void;
}

export function FleetAccessDenied({ driverName, driverNip, onLogout }: FleetAccessDeniedProps) {
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 text-center space-y-4">
      <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500">
        <ShieldAlert className="w-6 h-6" />
      </div>
      <h2 className="text-xl font-bold text-white">Akses Dibatasi: Khusus Dispatcher Perusahaan</h2>
      <p className="text-xs text-zinc-400 max-w-sm">
        Akun supir {driverName && `(${driverName} - ${driverNip}) `}tidak memiliki izin untuk mengawasi atau mengubah status armada travel.
      </p>
      <div className="flex gap-2">
        <button
          onClick={onLogout}
          className="px-4 py-2 rounded-xl text-xs text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800"
        >
          Ganti Akun
        </button>
        <Link
          href="/"
          className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-apple-blue hover:bg-apple-blue/90 shadow-md"
        >
          Kembali ke Portal Supir
        </Link>
      </div>
    </div>
  );
}
