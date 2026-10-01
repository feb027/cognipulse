/**
 * UI: EthicsDisclaimerModal
 * Transparansi etika medis (Fitness-for-Duty Non-Diagnostic) & Kepatuhan UU PDP Indonesia No. 27/2022.
 */

import React from 'react';
import { Button } from './Button';
import { ShieldCheck, AlertCircle, X } from 'lucide-react';

interface EthicsDisclaimerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EthicsDisclaimerModal: React.FC<EthicsDisclaimerModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg p-6 bg-zinc-900 border border-zinc-700 rounded-lg shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-100"
          aria-label="Tutup"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded bg-cyan-950/80 border border-cyan-800 text-cyan-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-zinc-100 tracking-tight">
              Protokol Etika Medis & Privasi Data
            </h3>
            <span className="text-xs font-mono text-zinc-400">
              STANDAR ICONFEST 2026 // KEPATUHAN UU PDP NO. 27/2022
            </span>
          </div>
        </div>

        <div className="space-y-3 text-xs text-zinc-300 leading-relaxed font-sans border-t border-b border-zinc-800 py-3 my-2">
          <div className="flex gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p>
              <strong className="text-zinc-100">Bukan Alat Diagnosis Penyakit:</strong> CogniPulse dirancang khusus sebagai sistem skrining kesiapan kerja kognitif (<em>Operational Fitness-for-Duty</em>) dan deteksi kelelahan saraf transien. Sistem ini tidak menggantikan evaluasi medis klinis formal oleh dokter spesialis.
            </p>
          </div>

          <div className="flex gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <p>
              <strong className="text-zinc-100">Zero-PII & Local-First Privacy:</strong> Seluruh riwayat asesmen dan waktu reaksi disimpan secara lokal di browser Anda. Transmisi ke cloud Gemini AI murni berupa vektor angka statistik tanpa nama, identitas KTP, atau data pribadi yang dapat diidentifikasi.
            </p>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button variant="primary" size="sm" onClick={onClose}>
            Saya Memahami & Setuju
          </Button>
        </div>
      </div>
    </div>
  );
};
