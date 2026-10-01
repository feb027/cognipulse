/**
 * Atomic UI: HairlineDivider
 * Pembatas garis rambut 1px (anti-slop substitute untuk thick drop-shadows).
 */

import React from 'react';

interface HairlineDividerProps {
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

export const HairlineDivider: React.FC<HairlineDividerProps> = ({
  orientation = 'horizontal',
  className = '',
}) => {
  if (orientation === 'vertical') {
    return <div className={`w-[1px] bg-zinc-800 self-stretch ${className}`} />;
  }

  return <div className={`h-[1px] w-full bg-zinc-800 ${className}`} />;
};
