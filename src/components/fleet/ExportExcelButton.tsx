'use client';

import React, { useState } from 'react';
import { FileSpreadsheet, Loader2 } from 'lucide-react';
import { getAuthHeader } from '@/hooks/use-auth-session';

interface ExportExcelButtonProps {
  label?: string;
}

export function ExportExcelButton({ label = 'Export Excel' }: ExportExcelButtonProps) {
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    if (exporting) return;
    setExporting(true);
    try {
      const res = await fetch('/api/fleet/export', {
        method: 'GET',
        headers: getAuthHeader(),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Gagal mengunduh berkas Excel');
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      const dateStr = new Date().toISOString().slice(0, 10);
      a.href = url;
      a.download = `Laporan_Armada_CogniPulse_${dateStr}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Excel export failed:', error);
      alert(error instanceof Error ? error.message : 'Gagal mengekspor data ke Excel');
    } finally {
      setExporting(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleExport}
      disabled={exporting}
      title="Unduh Laporan Lengkap Armada & Riwayat K3 (.xlsx)"
      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-all shadow-sm disabled:opacity-60 active:scale-95"
    >
      {exporting ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : (
        <FileSpreadsheet className="w-3.5 h-3.5" />
      )}
      <span>{exporting ? 'Menyiapkan Excel...' : label}</span>
    </button>
  );
}
