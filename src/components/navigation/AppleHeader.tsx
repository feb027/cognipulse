'use client';

import React, { useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/components/theme/ThemeContext';
import { ProfileDropdown } from './ProfileDropdown';

interface AppleHeaderProps {
  title: string;
  subtitle?: string;
  onOpenProfileDetails: () => void;
  onOpenJuryPresets: () => void;
  onSeedDemo: () => void;
  onClearHistory: () => void;
}

export function AppleHeader({
  title,
  subtitle,
  onOpenProfileDetails,
  onOpenJuryPresets,
  onSeedDemo,
  onClearHistory,
}: AppleHeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <header className="relative pt-6 pb-3 px-4 sm:px-6 max-w-4xl mx-auto w-full">
      {/* Top Meta Bar: Date & Actions */}
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[11px] font-bold tracking-wider uppercase text-zinc-500 dark:text-zinc-400">
          {subtitle || 'RABU, 30 SEPTEMBER • FIT-FOR-DUTY'}
        </span>
        <div className="flex items-center gap-2">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            aria-label="Ubah Tema"
            className="w-8 h-8 rounded-full flex items-center justify-center bg-zinc-200/80 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 hover:scale-105 active:scale-95 transition-all"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-apple-yellow" />
            ) : (
              <Moon className="w-4 h-4 text-zinc-700" />
            )}
          </button>

          {/* Apple-style Profile Avatar with Animated Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              aria-label="Menu Profil & Skenario Juri"
              className="w-8 h-8 rounded-full bg-gradient-to-tr from-apple-orange to-apple-red flex items-center justify-center text-white text-xs font-bold shadow-sm ring-2 ring-white dark:ring-zinc-800 hover:opacity-90 active:scale-95 transition-all"
            >
              CP
            </button>

            <ProfileDropdown
              isOpen={isDropdownOpen}
              onClose={() => setIsDropdownOpen(false)}
              onOpenProfileDetails={onOpenProfileDetails}
              onOpenJuryPresets={onOpenJuryPresets}
              onSeedDemo={onSeedDemo}
              onClearHistory={onClearHistory}
            />
          </div>
        </div>
      </div>

      {/* Large Title khas Apple iOS */}
      <div className="flex items-baseline justify-between">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
          {title}
        </h1>
      </div>
    </header>
  );
}
