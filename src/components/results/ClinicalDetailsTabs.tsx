'use client';

import React, { useState } from 'react';
import { GeminiClinicalAnalysis } from '@/types/gemini';
import { CompositeFatigueResult } from '@/types/assessment';
import { DiagnosticReportCard } from './DiagnosticReportCard';
import { RecoveryRoadmap } from './RecoveryRoadmap';
import { Brain, HeartPulse } from 'lucide-react';

interface ClinicalDetailsTabsProps {
  analysis: GeminiClinicalAnalysis;
  cfi: CompositeFatigueResult;
}

type DetailTab = 'diagnosis' | 'recovery';

export const ClinicalDetailsTabs: React.FC<ClinicalDetailsTabsProps> = ({
  analysis,
}) => {
  const [activeTab, setActiveTab] = useState<DetailTab>('diagnosis');

  return (
    <div className="space-y-3">
      {/* iOS Segmented Control (2 Tabs) */}
      <div className="flex p-1 bg-zinc-200/80 dark:bg-zinc-800/80 rounded-2xl">
        <button
          type="button"
          onClick={() => setActiveTab('diagnosis')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'diagnosis'
              ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm'
              : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
          }`}
        >
          <Brain className="w-3.5 h-3.5 text-apple-purple" />
          <span>Diagnosis & Risiko</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('recovery')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'recovery'
              ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm'
              : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
          }`}
        >
          <HeartPulse className="w-3.5 h-3.5 text-apple-green" />
          <span>Saran Pemulihan</span>
        </button>
      </div>

      {/* Tab Panels */}
      <div className="animate-springUp">
        {activeTab === 'diagnosis' && <DiagnosticReportCard analysis={analysis} />}
        {activeTab === 'recovery' && (
          <RecoveryRoadmap prescription={analysis.precisionRecoveryPrescription} />
        )}
      </div>
    </div>
  );
};
