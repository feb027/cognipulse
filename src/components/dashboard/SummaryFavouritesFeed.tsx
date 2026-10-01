'use client';

import React from 'react';
import { Heart, Zap, Brain, Activity } from 'lucide-react';
import { AssessmentResult } from '@/types';
import { AppleVitalsCard } from './AppleVitalsCard';

interface SummaryFavouritesFeedProps {
  latestResult: AssessmentResult | null;
  onSelectVital?: (vitalKey: string) => void;
}

export function SummaryFavouritesFeed({
  latestResult,
  onSelectVital,
}: SummaryFavouritesFeedProps) {
  const hasData = Boolean(latestResult);

  const cfiScore = latestResult ? latestResult.cfi.cfiScore : '--';
  const tier = latestResult ? latestResult.cfi.impairmentTier : 'fit';
  const meanRT = latestResult ? Math.round(latestResult.pvt.meanReactionTimeMs) : '--';
  const lapses = latestResult ? latestResult.pvt.attentionalLapseCount : 0;
  const stroopAcc = latestResult ? Math.round(latestResult.stroop.accuracyRate) : '--';
  const motorHz = latestResult ? latestResult.motor.cadenceTapsPerSecond.toFixed(1) : '--';
  const jitterSD = latestResult ? Math.round(latestResult.motor.itiStandardDeviationMs) : 0;

  const getTierLabel = () => {
    if (!hasData) {
      return { text: 'Belum Diuji', badgeBg: 'bg-zinc-100 dark:bg-zinc-800', textCol: 'text-zinc-400', desc: 'Mulai asesmen untuk mengukur' };
    }
    switch (tier) {
      case 'fit':
        return { text: 'Prima', badgeBg: 'bg-apple-green/10', textCol: 'text-apple-green', desc: 'Kondisi tubuh bugar' };
      case 'critical_hazard':
        return { text: 'Kritis', badgeBg: 'bg-apple-red/10', textCol: 'text-apple-red', desc: 'Kelelahan tingkat tinggi' };
      default:
        return { text: 'Sedang', badgeBg: 'bg-apple-yellow/10', textCol: 'text-apple-yellow', desc: 'Mulai terasa lelah' };
    }
  };

  const tierInfo = getTierLabel();

  return (
    <div className="space-y-2.5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* 1. Kebugaran Kognitif (CFI) */}
        <AppleVitalsCard
          icon={<Heart className="w-4 h-4 text-apple-red" />}
          iconBgColor="bg-apple-red/10 text-apple-red"
          category="Tingkat Kelelahan"
          value={cfiScore}
          unit={hasData ? '/ 100' : ''}
          description={tierInfo.desc}
          statusBadge={{ text: tierInfo.text, bgClass: tierInfo.badgeBg, textClass: tierInfo.textCol }}
          pillBars={hasData && typeof cfiScore === 'number' ? [0.2, 0.4, 0.35, 0.25, 0.3, 0.18, cfiScore / 100] : undefined}
          barColor={typeof cfiScore === 'number' && cfiScore < 40 ? 'bg-apple-green' : typeof cfiScore === 'number' && cfiScore < 70 ? 'bg-apple-yellow' : 'bg-apple-red'}
          onClick={() => onSelectVital?.('cfi')}
        />

        {/* 2. Kecepatan Refleks */}
        <AppleVitalsCard
          icon={<Zap className="w-4 h-4 text-apple-orange" />}
          iconBgColor="bg-apple-orange/10 text-apple-orange"
          category="Kecepatan Refleks"
          value={meanRT}
          unit={hasData ? 'ms' : ''}
          description={hasData ? (lapses === 0 ? 'Fokus terjaga baik' : `${lapses}x hilang fokus`) : 'Menunggu uji refleks visual'}
          pillBars={hasData && typeof meanRT === 'number' ? [0.6, 0.55, 0.7, 0.5, 0.65, 0.48, Math.min(1, meanRT / 400)] : undefined}
          barColor="bg-apple-orange"
          onClick={() => onSelectVital?.('pvt')}
        />

        {/* 3. Akurasi Fokus */}
        <AppleVitalsCard
          icon={<Brain className="w-4 h-4 text-apple-purple" />}
          iconBgColor="bg-apple-purple/10 text-apple-purple"
          category="Akurasi Fokus"
          value={stroopAcc}
          unit={hasData ? '%' : ''}
          description={hasData ? 'Ketepatan respon warna & kata' : 'Menunggu uji inhibisi kata'}
          pillBars={hasData && typeof stroopAcc === 'number' ? [0.9, 0.85, 0.95, 0.9, 1, stroopAcc / 100] : undefined}
          barColor="bg-apple-purple"
          onClick={() => onSelectVital?.('stroop')}
        />

        {/* 4. Ketukan Motorik */}
        <AppleVitalsCard
          icon={<Activity className="w-4 h-4 text-apple-teal" />}
          iconBgColor="bg-apple-teal/10 text-apple-teal"
          category="Kestabilan Ketukan"
          value={motorHz}
          unit={hasData ? 'Hz' : ''}
          description={hasData ? `Variasi ketukan: ±${jitterSD} ms` : 'Menunggu uji ritme motorik'}
          pillBars={hasData ? [0.5, 0.6, 0.55, 0.7, 0.65, 0.6] : undefined}
          barColor="bg-apple-teal"
          onClick={() => onSelectVital?.('motor')}
        />
      </div>
    </div>
  );
}
