/**
 * Atomic UI: Badge
 * Status indicator klinis dengan kontras WCAG AA/AAA.
 */

import React from 'react';
import { ImpairmentTier } from '@/types/assessment';

interface BadgeProps {
  tier?: ImpairmentTier;
  label?: string;
  variant?: 'emerald' | 'amber' | 'crimson' | 'cyan' | 'neutral';
  pulse?: boolean;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  tier,
  label,
  variant,
  pulse = false,
  className = '',
}) => {
  // Resolve variant dari tier jika diberikan
  let resolvedVariant = variant || 'neutral';
  let resolvedText = label || 'STATUS';

  if (tier) {
    switch (tier) {
      case 'fit':
        resolvedVariant = 'emerald';
        resolvedText = label || 'FIT FOR DUTY';
        break;
      case 'mild_fatigue':
        resolvedVariant = 'amber';
        resolvedText = label || 'ELEVATED FATIGUE';
        break;
      case 'moderate_impairment':
        resolvedVariant = 'amber';
        resolvedText = label || 'MODERATE IMPAIRMENT';
        break;
      case 'critical_hazard':
        resolvedVariant = 'crimson';
        resolvedText = label || 'CRITICAL HAZARD';
        break;
    }
  }

  const colorStyles = {
    emerald: 'bg-emerald-950/60 text-emerald-400 border-emerald-800/80',
    amber: 'bg-amber-950/60 text-amber-400 border-amber-800/80',
    crimson: 'bg-rose-950/60 text-rose-400 border-rose-800/80',
    cyan: 'bg-cyan-950/60 text-cyan-400 border-cyan-800/80',
    neutral: 'bg-zinc-900 text-zinc-400 border-zinc-800',
  };

  const dotColors = {
    emerald: 'bg-emerald-400',
    amber: 'bg-amber-400',
    crimson: 'bg-rose-400',
    cyan: 'bg-cyan-400',
    neutral: 'bg-zinc-400',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-mono tracking-wider uppercase border font-semibold ${colorStyles[resolvedVariant]} ${className}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${dotColors[resolvedVariant]} ${
          pulse ? 'animate-pulse' : ''
        }`}
      />
      {resolvedText}
    </span>
  );
};
