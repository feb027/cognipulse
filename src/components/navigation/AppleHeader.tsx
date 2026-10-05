'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sun, Moon, Truck } from 'lucide-react';
import { useTheme } from '@/components/theme/ThemeContext';
import { DriverWithLatestAssessment } from '@/types/fleet';
import { ProfileDropdown } from './ProfileDropdown';

interface AppleHeaderProps {
  title: string;
  subtitle?: string;
  driver?: DriverWithLatestAssessment | null;
  isDispatcher?: boolean;
  onOpenProfileDetails: () => void;
  onOpenJuryPresets: () => void;
  onSeedDemo: () => void;
  onClearHistory: () => void;
  onLogout?: () => void;
}

export function AppleHeader({
  title,
  subtitle,
  driver,
  isDispatcher,
  onOpenProfileDetails,
  onOpenJuryPresets,
  onSeedDemo,
  onClearHistory,
  onLogout,
}: AppleHeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [todayHeader, setTodayHeader] = useState<string>('');

  useEffect(() => {
    try {
      const now = new Date();
      const datePart = new Intl.DateTimeFormat('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
      }).format(now).toUpperCase();
      setTodayHeader(`${datePart} • FIT-FOR-DUTY`);
    } catch {
      setTodayHeader('HARI INI • FIT-FOR-DUTY');
    }
  }, []);

  const avatarInitials = driver ? driver.name.slice(0, 2).toUpperCase() : 'CP';
  const ringColor = driver?.status === 'stand_down'
    ? 'ring-red-500'
    : driver?.status === 'caution'
    ? 'ring-amber-500'
    : driver?.status === 'ready'
    ? 'ring-emerald-500'
    : 'ring-white dark:ring-zinc-800';

  return (
    <header className="relative pt-6 pb-3 px-4 sm:px-6 max-w-4xl mx-auto w-full">
      {/* Top Meta Bar */}
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[11px] font-bold tracking-wider uppercase text-zinc-500 dark:text-zinc-400">
          {subtitle || todayHeader || 'FIT-FOR-DUTY MONITOR'}
        </span>
        <div className="flex items-center gap-2">
          {/* Konsol Armada Link - ONLY visible if dispatcher */}
          {isDispatcher && (
            <Link
              href="/fleet"
              aria-label="Buka Konsol Armada"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 text-xs font-semibold transition-all shadow-sm"
            >
              <Truck className="w-3.5 h-3.5 text-apple-blue" />
              <span className="hidden sm:inline">Konsol Armada</span>
            </Link>
          )}

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            aria-label="Ubah Tema"
            className="w-8 h-8 rounded-full flex items-center justify-center bg-zinc-200/80 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 hover:scale-105 active:scale-95 transition-all"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-apple-yellow" /> : <Moon className="w-4 h-4 text-zinc-700" />}
          </button>

          {/* Apple-style Profile Avatar */}
          <div className="relative">
            <button
              onClick={() => {
                if (driver) {
                  onOpenProfileDetails();
                } else {
                  setIsDropdownOpen(!isDropdownOpen);
                }
              }}
              aria-label="Menu Profil"
              className={`w-8 h-8 rounded-full bg-gradient-to-tr from-apple-orange to-apple-red flex items-center justify-center text-white text-xs font-bold shadow-sm ring-2 ${ringColor} hover:opacity-90 active:scale-95 transition-all`}
            >
              {avatarInitials}
            </button>

            {!driver && (
              <ProfileDropdown
                isOpen={isDropdownOpen}
                onClose={() => setIsDropdownOpen(false)}
                onOpenProfileDetails={onOpenProfileDetails}
                onOpenJuryPresets={onOpenJuryPresets}
                onSeedDemo={onSeedDemo}
                onClearHistory={onClearHistory}
              />
            )}
          </div>
        </div>
      </div>

      {/* Large Title */}
      <div className="flex items-baseline justify-between">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
          {title}
        </h1>
      </div>
    </header>
  );
}
