'use client';

import React from 'react';
import { ChevronRight } from 'lucide-react';

interface AppleVitalsCardProps {
  icon: React.ReactNode;
  iconBgColor?: string;
  category: string;
  timestamp?: string;
  value: string | number;
  unit?: string;
  description?: string;
  statusBadge?: {
    text: string;
    bgClass: string;
    textClass: string;
  };
  pillBars?: number[]; // [0.4, 0.8, 0.6, 0.9, 0.5]
  barColor?: string;
  onClick?: () => void;
}

export function AppleVitalsCard({
  icon,
  iconBgColor = 'text-apple-blue bg-apple-blue/10',
  category,
  timestamp = 'Hari Ini',
  value,
  unit,
  description,
  statusBadge,
  pillBars,
  barColor = 'bg-apple-blue',
  onClick,
}: AppleVitalsCardProps) {
  return (
    <div
      onClick={onClick}
      className={`group relative bg-white dark:bg-[#1C1C1E] rounded-3xl p-4 sm:p-5 shadow-apple hover:shadow-appleHover border border-black/[0.04] dark:border-white/[0.08] transition-all duration-200 ${
        onClick ? 'cursor-pointer active:scale-[0.99]' : ''
      }`}
    >
      {/* Header bar: Icon + Title + Timestamp & Chevron */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`w-7 h-7 rounded-full flex items-center justify-center ${iconBgColor}`}>
            {icon}
          </div>
          <span className="text-sm font-semibold tracking-tight text-zinc-800 dark:text-zinc-200">
            {category}
          </span>
        </div>
        <div className="flex items-center gap-1 text-xs text-zinc-400 dark:text-zinc-500 font-medium">
          <span>{timestamp}</span>
          <ChevronRight className="w-4 h-4 text-zinc-300 dark:text-zinc-600 group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex items-end justify-between mt-1">
        <div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
              {value}
            </span>
            {unit && (
              <span className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">
                {unit}
              </span>
            )}
          </div>
          {description && (
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 line-clamp-1 font-medium">
              {description}
            </p>
          )}
        </div>

        {/* Status Badge or Mini Pill Bars */}
        {pillBars && pillBars.length > 0 ? (
          <div className="flex items-end gap-1 h-8 px-1 pb-0.5">
            {pillBars.map((height, idx) => (
              <div
                key={idx}
                className={`w-1.5 rounded-full transition-all duration-300 ${barColor}`}
                style={{ height: `${Math.max(15, Math.round(height * 100))}%` }}
              />
            ))}
          </div>
        ) : statusBadge ? (
          <span
            className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${statusBadge.bgClass} ${statusBadge.textClass}`}
          >
            {statusBadge.text}
          </span>
        ) : null}
      </div>
    </div>
  );
}
