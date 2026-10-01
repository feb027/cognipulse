/**
 * Dashboard Component: BaselineCalibrationCard
 * Menampilkan status kalibrasi baseline perangkat untuk mitigasi hardware latency noise.
 */

import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Sliders, CheckCircle2, RotateCcw } from 'lucide-react';

interface BaselineCalibrationCardProps {
  currentBaselineMs: number;
  onUpdateBaseline: (ms: number) => void;
}

export const BaselineCalibrationCard: React.FC<BaselineCalibrationCardProps> = ({
  currentBaselineMs,
  onUpdateBaseline,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempMs, setTempMs] = useState(currentBaselineMs);

  const handleSave = () => {
    onUpdateBaseline(tempMs);
    setIsEditing(false);
  };

  return (
    <div className="p-4 rounded-lg bg-zinc-900 border border-zinc-800 space-y-3 text-xs">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-cyan-400" />
          <h4 className="font-mono font-bold text-zinc-200 uppercase tracking-tight">
            Kalibrasi Baseline Perangkat (Within-Subject Normalization)
          </h4>
        </div>
        <span className="text-emerald-400 font-mono flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5" />
          Terkalibrasi
        </span>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-4 font-mono">
        <div>
          <span className="text-zinc-400 block text-[11px] mb-0.5">
            WAKTU REAKSI BASELINE OPERATOR (KONDISI SEGAR):
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-cyan-300 tabular-nums">
              {currentBaselineMs} ms
            </span>
            <span className="text-zinc-500 text-[10px]">± 12ms standar normal</span>
          </div>
        </div>

        {isEditing ? (
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="150"
              max="400"
              value={tempMs}
              onChange={(e) => setTempMs(Number(e.target.value))}
              className="w-20 px-2 py-1 bg-zinc-950 border border-zinc-700 rounded text-center text-zinc-100 font-mono text-xs focus:border-cyan-500 focus:outline-none"
            />
            <Button size="sm" variant="primary" onClick={handleSave}>
              Simpan
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setIsEditing(false)}>
              Batal
            </Button>
          </div>
        ) : (
          <Button size="sm" variant="secondary" onClick={() => setIsEditing(true)}>
            <RotateCcw className="w-3.5 h-3.5 mr-1 text-zinc-400" />
            Kalibrasi Ulang
          </Button>
        )}
      </div>

      <p className="text-[11px] text-zinc-400 font-sans leading-relaxed pt-1 border-t border-zinc-800/80">
        Prinsip <em>Within-Subject Calibration</em> memastikan disparitas hardware (layar 60Hz vs 144Hz) tidak mempengaruhi penilaian; sistem hanya mengukur deviasi relatif (Δ) penurunan performa saraf Anda.
      </p>
    </div>
  );
};
