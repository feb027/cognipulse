/**
 * Layout Component: NavigationTabs
 * Segmented control bar untuk navigasi 3 mode aplikasi.
 */

import React from 'react';
import { Activity, TrendingUp, Users } from 'lucide-react';

export type TabView = 'assessment' | 'trends' | 'b2b_team';

interface NavigationTabsProps {
  activeTab: TabView;
  onTabChange: (tab: TabView) => void;
}

export const NavigationTabs: React.FC<NavigationTabsProps> = ({
  activeTab,
  onTabChange,
}) => {
  return (
    <nav className="flex p-1 bg-zinc-900/90 border border-zinc-800 rounded-xl overflow-x-auto text-xs">
      <button
        type="button"
        onClick={() => onTabChange('assessment')}
        className={`flex-1 min-w-[110px] sm:min-w-[130px] flex items-center justify-center gap-2 py-2 px-3 rounded-lg font-medium transition-all ${
          activeTab === 'assessment'
            ? 'bg-zinc-800 text-zinc-100 shadow-sm border border-zinc-700/70 font-semibold'
            : 'text-zinc-400 hover:text-zinc-200'
        }`}
      >
        <Activity className="w-3.5 h-3.5 text-cyan-400" />
        <span>Asesmen (75s)</span>
      </button>

      <button
        type="button"
        onClick={() => onTabChange('trends')}
        className={`flex-1 min-w-[110px] sm:min-w-[130px] flex items-center justify-center gap-2 py-2 px-3 rounded-lg font-medium transition-all ${
          activeTab === 'trends'
            ? 'bg-zinc-800 text-zinc-100 shadow-sm border border-zinc-700/70 font-semibold'
            : 'text-zinc-400 hover:text-zinc-200'
        }`}
      >
        <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
        <span>Tren Sirkadian</span>
      </button>

      <button
        type="button"
        onClick={() => onTabChange('b2b_team')}
        className={`flex-1 min-w-[110px] sm:min-w-[130px] flex items-center justify-center gap-2 py-2 px-3 rounded-lg font-medium transition-all ${
          activeTab === 'b2b_team'
            ? 'bg-zinc-800 text-zinc-100 shadow-sm border border-zinc-700/70 font-semibold'
            : 'text-zinc-400 hover:text-zinc-200'
        }`}
      >
        <Users className="w-3.5 h-3.5 text-cyan-400" />
        <span>Monitor Tim</span>
      </button>
    </nav>
  );
};
