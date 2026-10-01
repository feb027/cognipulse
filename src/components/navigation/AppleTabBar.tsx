'use client';

import React from 'react';
import { Heart, Activity, History } from 'lucide-react';

export type NavigationTab = 'summary' | 'assessment' | 'history';

interface AppleTabBarProps {
  activeTab: NavigationTab;
  onTabChange: (tab: NavigationTab) => void;
}

export function AppleTabBar({ activeTab, onTabChange }: AppleTabBarProps) {
  const tabs = [
    { id: 'summary' as NavigationTab, label: 'Ringkasan', icon: Heart },
    { id: 'assessment' as NavigationTab, label: 'Asesmen', icon: Activity },
    { id: 'history' as NavigationTab, label: 'Riwayat', icon: History },
  ];

  return (
    <nav
      aria-label="Navigasi Utama"
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[88%] max-w-xs"
    >
      <div className="ios-glass rounded-full px-2 py-1.5 shadow-applePill border border-black/5 dark:border-white/10 flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center py-1 px-4 rounded-full transition-all duration-200 ${
                isActive
                  ? 'text-apple-blue font-bold scale-105'
                  : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200'
              }`}
            >
              <Icon
                className={`w-5 h-5 transition-transform ${
                  isActive ? 'stroke-[2.5px] scale-110' : 'stroke-[1.75px]'
                }`}
              />
              <span className="text-[11px] mt-0.5 tracking-tight">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
