'use client';

import React, { useState } from 'react';
import { AssessmentPhase, UserContext, CompositeFatigueResult } from '@/types/assessment';
import { PVTTrial, PVTMetrics } from '@/types/pvt';
import { StroopTrial, StroopMetrics } from '@/types/stroop';
import { CorsiTrial, CorsiMetrics } from '@/types/corsi';
import { TapEvent, MotorMetrics } from '@/types/motor';
import { ContextCheckinModal } from './ContextCheckinModal';
import { PVTStage } from './pvt/PVTStage';
import { StroopStage } from './stroop/StroopStage';
import { CorsiStage } from './corsi/CorsiStage';
import { MotorStage } from './motor/MotorStage';
import { calculatePVTMetrics } from '@/lib/scoring/pvt-metrics';
import { calculateStroopMetrics } from '@/lib/scoring/stroop-metrics';
import { calculateCorsiMetrics } from '@/lib/scoring/corsi-metrics';
import { calculateMotorMetrics } from '@/lib/scoring/motor-metrics';
import { calculateCompositeFatigueIndex } from '@/lib/scoring/cfi-aggregator';
import { X, Sparkles } from 'lucide-react';

interface AssessmentWizardProps {
  onAssessmentCompleted: (
    cfi: CompositeFatigueResult,
    pvt: PVTMetrics,
    stroop: StroopMetrics,
    motor: MotorMetrics,
    context: UserContext,
    corsi?: CorsiMetrics
  ) => void;
  onCancel: () => void;
}

export const AssessmentWizard: React.FC<AssessmentWizardProps> = ({
  onAssessmentCompleted,
  onCancel,
}) => {
  const [phase, setPhase] = useState<AssessmentPhase>('context_checkin');
  const [context, setContext] = useState<UserContext>({
    operatorId: 'OP-LOCAL',
    shiftType: 'morning',
    hoursSleptLastNight: 7,
    hoursWorkedToday: 4,
    caffeineIntake: 'low',
    subjectiveFatigueScore: 2,
  });

  const [pvtTrials, setPvtTrials] = useState<PVTTrial[]>([]);
  const [stroopTrials, setStroopTrials] = useState<StroopTrial[]>([]);
  const [corsiTrials, setCorsiTrials] = useState<CorsiTrial[]>([]);

  const handleContextSubmit = (ctx: UserContext) => {
    setContext(ctx);
    setPhase('pvt_active');
  };

  const handlePVTComplete = (trials: PVTTrial[]) => {
    setPvtTrials(trials);
    setPhase('stroop_active');
  };

  const handleStroopComplete = (trials: StroopTrial[]) => {
    setStroopTrials(trials);
    setPhase('corsi_active');
  };

  const handleCorsiComplete = (trials: CorsiTrial[]) => {
    setCorsiTrials(trials);
    setPhase('motor_active');
  };

  const handleMotorComplete = (tapEvents: TapEvent[]) => {
    setPhase('computing_telemetry');

    setTimeout(() => {
      const pvtMetrics = calculatePVTMetrics(pvtTrials);
      const stroopMetrics = calculateStroopMetrics(stroopTrials);
      const corsiMetrics = calculateCorsiMetrics(corsiTrials);
      const motorMetrics = calculateMotorMetrics(tapEvents, 15);
      const compositeCFI = calculateCompositeFatigueIndex(
        pvtMetrics,
        stroopMetrics,
        motorMetrics,
        context,
        corsiMetrics
      );

      onAssessmentCompleted(compositeCFI, pvtMetrics, stroopMetrics, motorMetrics, context, corsiMetrics);
    }, 700);
  };

  const getStepInfo = () => {
    switch (phase) {
      case 'pvt_active':
        return { step: 1, label: 'Refleks Visual PVT' };
      case 'stroop_active':
        return { step: 2, label: 'Inhibisi Fokus Stroop' };
      case 'corsi_active':
        return { step: 3, label: 'Memori Kerja Spasial' };
      case 'motor_active':
        return { step: 4, label: 'Ritme Ketukan Motorik' };
      default:
        return null;
    }
  };

  const stepInfo = getStepInfo();

  return (
    <div className="w-full max-w-xl mx-auto px-1 sm:px-4 py-1 flex flex-col min-h-[calc(100dvh-7.5rem)] sm:min-h-[560px]">
      {/* Segmented Progress Bar (Tahap 1-4) */}
      {stepInfo && (
        <div className="mb-3 shrink-0">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
              Tahap {stepInfo.step} dari 4 • {stepInfo.label}
            </span>
            <button
              onClick={onCancel}
              className="w-7 h-7 rounded-full bg-zinc-200/80 dark:bg-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-300 hover:scale-105 active:scale-95 transition-transform"
              title="Batal"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="grid grid-cols-4 gap-1.5 h-1.5 w-full">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`rounded-full transition-all duration-300 ${
                  s <= stepInfo.step ? 'bg-apple-blue' : 'bg-zinc-200 dark:bg-zinc-800'
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {phase === 'context_checkin' && (
        <ContextCheckinModal
          initialContext={context}
          onSubmit={handleContextSubmit}
          onCancel={onCancel}
        />
      )}

      {phase === 'pvt_active' && <PVTStage onComplete={handlePVTComplete} />}
      {phase === 'stroop_active' && <StroopStage onComplete={handleStroopComplete} />}
      {phase === 'corsi_active' && <CorsiStage onComplete={handleCorsiComplete} />}
      {phase === 'motor_active' && <MotorStage onComplete={handleMotorComplete} />}

      {phase === 'computing_telemetry' && (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4 my-auto">
          <div className="w-12 h-12 rounded-full bg-apple-blue/10 flex items-center justify-center text-apple-blue animate-pulse">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
              Menghitung Kesiapan Kognitif 4-Modalitas...
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-xs mx-auto">
              Memproses PVT, Stroop, Memori Spasial Corsi, dan Ritme Motorik.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
