'use client';

import React from 'react';
import { RotateCcw } from 'lucide-react';
import { CompositeFatigueResult } from '@/types/assessment';
import { PVTMetrics } from '@/types/pvt';
import { StroopMetrics } from '@/types/stroop';
import { MotorMetrics } from '@/types/motor';
import { GeminiClinicalAnalysis } from '@/types/gemini';
import { ResultSummaryHeader } from './ResultSummaryHeader';
import { TravelSafetyReportCard } from './TravelSafetyReportCard';
import { TelemetryBreakdown } from './TelemetryBreakdown';
import { ClinicalDetailsTabs } from './ClinicalDetailsTabs';

interface AssessmentResultViewProps {
  cfi: CompositeFatigueResult;
  pvt: PVTMetrics;
  stroop: StroopMetrics;
  motor: MotorMetrics;
  analysis: GeminiClinicalAnalysis;
  onRetest: () => void;
}

export function AssessmentResultView({
  cfi,
  pvt,
  stroop,
  motor,
  analysis,
  onRetest,
}: AssessmentResultViewProps) {
  return (
    <div className="space-y-3.5">
      <div className="flex justify-between items-center px-1">
        <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
          Hasil Evaluasi Supir Travel
        </span>
        <button
          onClick={onRetest}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 text-xs font-semibold transition-all"
        >
          <RotateCcw className="w-3.5 h-3.5 text-apple-blue" />
          <span>Uji Ulang</span>
        </button>
      </div>
      <ResultSummaryHeader cfi={cfi} analysis={analysis} />
      <TravelSafetyReportCard safety={analysis.travelSafety} pvtReactionMs={pvt.meanReactionTimeMs} />
      <TelemetryBreakdown pvt={pvt} stroop={stroop} motor={motor} />
      <ClinicalDetailsTabs analysis={analysis} cfi={cfi} />
    </div>
  );
}
