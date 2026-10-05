'use client';

import React from 'react';
import { AssessmentRecord } from '@/types/fleet';
import { Activity, Brain, Zap, Gauge, ShieldAlert, Sparkles, CheckCircle2 } from 'lucide-react';

interface InspectionFullMetricsTabProps {
  latest: AssessmentRecord | null;
}

export function InspectionFullMetricsTab({ latest }: InspectionFullMetricsTabProps) {
  if (!latest) {
    return (
      <div className="text-center py-12 text-xs text-zinc-400">
        Supir belum pernah menjalani uji asesmen di sistem.
      </div>
    );
  }

  // Parse raw_json if available for deeper clinical reasoning
  let parsedJson: any = null;
  if (latest.raw_json) {
    try {
      parsedJson = JSON.parse(latest.raw_json);
    } catch {}
  }

  const analysis = parsedJson?.analysis;
  const reasoning = analysis?.differentialDiagnosis?.clinicalReasoning || latest.short_summary;
  const recommendations = analysis?.differentialDiagnosis?.recommendedActions || [
    'Pastikan hidrasi cairan tercukupi sebelum rute tol.',
    'Lakukan jeda istirahat berkala setiap 2 jam perjalanan.',
  ];

  return (
    <div className="space-y-4">
      {/* AI Clinical Diagnosis Summary */}
      <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-black/5 dark:border-white/5 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-apple-blue text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Diagnosis Klinis AI (Gemini Engine)</span>
          </div>
          <span className="text-[10px] font-mono text-zinc-400">
            {new Date(latest.timestamp).toLocaleString('id-ID')}
          </span>
        </div>
        <h4 className="text-sm font-bold text-zinc-900 dark:text-white">
          {latest.headline_title || 'Kondisi Kesiapan Mengemudi'}
        </h4>
        <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
          {reasoning}
        </p>

        {recommendations.length > 0 && (
          <div className="pt-2 border-t border-black/5 dark:border-white/5 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
              Rekomendasi Tindakan Medis:
            </span>
            <ul className="space-y-1">
              {recommendations.map((rec: string, i: number) => (
                <li key={i} className="text-[11px] text-zinc-500 flex items-start gap-1.5">
                  <CheckCircle2 className="w-3 h-3 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* 4 Neurocognitive Modality Vitals Grid */}
      <div className="space-y-1.5">
        <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
          Telemetri 4 Modalitas Neurokognitif
        </span>
        <div className="grid grid-cols-2 gap-2 text-xs">
          {/* 1. NASA PVT */}
          <div className="p-3 rounded-xl bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/5 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="font-semibold text-[11px]">NASA PVT-B</span>
              <Zap className="w-3.5 h-3.5 text-amber-500" />
            </div>
            <div className="font-mono font-bold text-base text-zinc-900 dark:text-white">
              {Math.round(latest.pvt_mean_rt)} ms
            </div>
            <span className="text-[10px] text-zinc-500">
              Lapses: {latest.pvt_lapses || 0} (&ge;355ms)
            </span>
          </div>

          {/* 2. Stroop Test */}
          <div className="p-3 rounded-xl bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/5 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="font-semibold text-[11px]">Stroop Inhibisi</span>
              <Brain className="w-3.5 h-3.5 text-apple-blue" />
            </div>
            <div className="font-mono font-bold text-base text-zinc-900 dark:text-white">
              {Math.round(latest.stroop_accuracy)}%
            </div>
            <span className="text-[10px] text-zinc-500">Akurasi respon kortikal</span>
          </div>

          {/* 3. Motor Tapping */}
          <div className="p-3 rounded-xl bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/5 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="font-semibold text-[11px]">Motor Cadence</span>
              <Activity className="w-3.5 h-3.5 text-emerald-500" />
            </div>
            <div className="font-mono font-bold text-base text-zinc-900 dark:text-white">
              {latest.motor_cadence.toFixed(1)} taps/s
            </div>
            <span className="text-[10px] text-zinc-500">Kecepatan motorik jari</span>
          </div>

          {/* 4. Braking & Kinematics */}
          <div className="p-3 rounded-xl bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/5 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="font-semibold text-[11px]">Jarak Rem Tol</span>
              <Gauge className="w-3.5 h-3.5 text-red-500" />
            </div>
            <div className="font-mono font-bold text-base text-apple-blue">
              {latest.braking_distance_meters} m
            </div>
            <span className="text-[10px] text-zinc-500">
              @ 100 km/h (Risiko: {latest.microsleep_risk})
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
