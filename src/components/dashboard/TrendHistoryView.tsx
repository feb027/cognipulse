'use client';

import React from 'react';
import { StoredSession } from '@/hooks/use-session-storage';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
} from 'recharts';
import { TrendingUp } from 'lucide-react';

interface TrendHistoryViewProps {
  history: StoredSession[];
}

export const TrendHistoryView: React.FC<TrendHistoryViewProps> = ({ history }) => {
  const chartData = history
    .slice()
    .reverse()
    .map((item) => ({
      time: new Date(item.timestamp).toLocaleDateString([], {
        weekday: 'short',
        hour: '2-digit',
        minute: '2-digit',
      }),
      cfi: item.cfi.cfiScore,
    }));

  return (
    <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#1C1C1E] border border-black/5 dark:border-white/10 shadow-apple space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-black/[0.04] dark:border-white/[0.08] pb-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-apple-blue/10 flex items-center justify-center text-apple-blue">
            <TrendingUp className="w-3.5 h-3.5" />
          </div>
          <h3 className="font-bold text-zinc-900 dark:text-white text-sm">
            Grafik Tren Kelelahan
          </h3>
        </div>
        <div className="flex items-center gap-3 text-xs font-medium text-zinc-500">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-apple-green inline-block" />
            Bugar (&lt;30)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-apple-red inline-block" />
            Lelah (&gt;65)
          </span>
        </div>
      </div>

      <div className="h-56 sm:h-64 w-full">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <XAxis dataKey="time" stroke="#8E8E93" fontSize={11} tickLine={false} />
              <YAxis domain={[0, 100]} stroke="#8E8E93" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  borderColor: 'rgba(0,0,0,0.08)',
                  borderRadius: '16px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  fontSize: '12px',
                  fontWeight: 600,
                }}
              />
              <ReferenceLine y={30} stroke="#34C759" strokeDasharray="3 3" />
              <ReferenceLine y={65} stroke="#FF2D55" strokeDasharray="3 3" />
              <Line
                type="monotone"
                dataKey="cfi"
                stroke="#007AFF"
                strokeWidth={3}
                dot={{ fill: '#007AFF', r: 4, strokeWidth: 2, stroke: '#FFFFFF' }}
                activeDot={{ r: 6, fill: '#007AFF' }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex flex-col items-center justify-center p-6 text-center space-y-1.5">
            <span className="text-xs font-bold text-zinc-400">
              Belum Ada Rekaman Sesi
            </span>
            <p className="text-xs text-zinc-500 max-w-xs font-medium">
              Selesaikan asesmen untuk melihat grafik riwayat kebugaran Anda.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
