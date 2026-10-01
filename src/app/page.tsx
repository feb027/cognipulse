'use client';

import React, { useState } from 'react';
import { AppleHeader } from '@/components/navigation/AppleHeader';
import { AppleTabBar, NavigationTab } from '@/components/navigation/AppleTabBar';
import { ProfileDetailsModal } from '@/components/navigation/ProfileDetailsModal';
import { JuryPresetModal } from '@/components/navigation/JuryPresetModal';
import { AppleHighlightsCard } from '@/components/dashboard/AppleHighlightsCard';
import { SummaryFavouritesFeed } from '@/components/dashboard/SummaryFavouritesFeed';
import { TrendHistoryView } from '@/components/dashboard/TrendHistoryView';
import { HistoryLogView } from '@/components/dashboard/HistoryLogView';
import { VitalDetailModal } from '@/components/dashboard/VitalDetailModal';
import { AssessmentWizard } from '@/components/assessment/AssessmentWizard';
import { AssessmentLandingCard } from '@/components/assessment/AssessmentLandingCard';
import { ResultSummaryHeader } from '@/components/results/ResultSummaryHeader';
import { TelemetryBreakdown } from '@/components/results/TelemetryBreakdown';
import { ClinicalDetailsTabs } from '@/components/results/ClinicalDetailsTabs';
import { useSessionHistory } from '@/hooks/use-session-storage';
import { CompositeFatigueResult, UserContext } from '@/types/assessment';
import { PVTMetrics } from '@/types/pvt';
import { StroopMetrics } from '@/types/stroop';
import { MotorMetrics } from '@/types/motor';
import { CorsiMetrics } from '@/types/corsi';
import { GeminiClinicalAnalysis } from '@/types/gemini';
import { DemoScenarioPackage } from '@/lib/demo-scenarios';
import { RotateCcw, Sparkles } from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState<NavigationTab>('summary');
  const [isTestingActive, setIsTestingActive] = useState(false);
  const [isProfileDetailsOpen, setIsProfileDetailsOpen] = useState(false);
  const [isJuryPresetsOpen, setIsJuryPresetsOpen] = useState(false);
  const [selectedVitalKey, setSelectedVitalKey] = useState<string | null>(null);

  const [activeCfi, setActiveCfi] = useState<CompositeFatigueResult | null>(null);
  const [activePvt, setActivePvt] = useState<PVTMetrics | null>(null);
  const [activeStroop, setActiveStroop] = useState<StroopMetrics | null>(null);
  const [activeMotor, setActiveMotor] = useState<MotorMetrics | null>(null);
  const [activeCorsi, setActiveCorsi] = useState<CorsiMetrics | null>(null);
  const [activeAnalysis, setActiveAnalysis] = useState<GeminiClinicalAnalysis | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const { history, saveSession, clearHistory, seedDemoHistory, deviceBaselineMs } = useSessionHistory();

  const handleAssessmentCompleted = async (
    cfi: CompositeFatigueResult,
    pvt: PVTMetrics,
    stroop: StroopMetrics,
    motor: MotorMetrics,
    context: UserContext,
    corsi?: CorsiMetrics
  ) => {
    setIsTestingActive(false);
    setActiveCfi(cfi);
    setActivePvt(pvt);
    setActiveStroop(stroop);
    setActiveMotor(motor);
    if (corsi) setActiveCorsi(corsi);
    setIsAiLoading(true);

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cfi, pvt, stroop, motor, context, corsi }),
      });
      const data = await res.json();
      setActiveAnalysis(data.analysis);
      saveSession(cfi, data.analysis);
    } catch {
      const { generateLocalFallbackAnalysis } = await import('@/lib/ai/local-fallback-engine');
      const fallback = generateLocalFallbackAnalysis(cfi, pvt, stroop, motor, corsi || undefined);
      setActiveAnalysis(fallback);
      saveSession(cfi, fallback);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleClearAllHistory = () => {
    clearHistory();
    setActiveCfi(null);
    setActivePvt(null);
    setActiveStroop(null);
    setActiveMotor(null);
    setActiveCorsi(null);
    setActiveAnalysis(null);
  };

  const handleApplyScenario = async (pkg: DemoScenarioPackage) => {
    setIsTestingActive(false);
    setActiveTab('assessment');
    await handleAssessmentCompleted(pkg.cfi, pkg.pvt, pkg.stroop, pkg.motor, pkg.context, pkg.corsi);
  };

  const latestResult = activeCfi && activePvt && activeStroop && activeMotor && activeAnalysis
    ? { cfi: activeCfi, pvt: activePvt, stroop: activeStroop, motor: activeMotor, corsi: activeCorsi || undefined, diagnosis: activeAnalysis, timestamp: new Date().toISOString() }
    : null;

  return (
    <div className="min-h-screen pb-36 sm:pb-32 transition-colors">
      <AppleHeader
        title={activeTab === 'summary' ? 'Ringkasan' : activeTab === 'assessment' ? 'Asesmen' : 'Riwayat'}
        onOpenProfileDetails={() => setIsProfileDetailsOpen(true)}
        onOpenJuryPresets={() => setIsJuryPresetsOpen(true)}
        onSeedDemo={seedDemoHistory}
        onClearHistory={handleClearAllHistory}
      />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 space-y-3.5">
        {activeTab === 'summary' && (
          <div className="space-y-3.5 animate-springUp">
            <AppleHighlightsCard
              latestResult={latestResult}
              onStartAssessment={() => {
                setActiveTab('assessment');
                setIsTestingActive(true);
              }}
            />
            <SummaryFavouritesFeed
              latestResult={latestResult}
              onSelectVital={(key) => setSelectedVitalKey(key)}
            />
            <TrendHistoryView history={history} />
          </div>
        )}

        {activeTab === 'assessment' && (
          <div className="space-y-3.5 animate-springUp">
            {isTestingActive ? (
              <AssessmentWizard
                onAssessmentCompleted={handleAssessmentCompleted}
                onCancel={() => setIsTestingActive(false)}
              />
            ) : isAiLoading ? (
              <div className="p-10 rounded-3xl bg-white dark:bg-[#1C1C1E] border border-black/5 dark:border-white/10 shadow-apple flex flex-col items-center justify-center space-y-2.5 text-center my-6">
                <div className="w-10 h-10 rounded-full bg-apple-blue/10 flex items-center justify-center text-apple-blue animate-spin">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-zinc-900 dark:text-white">Menganalisis Kesiapan Tubuh...</h3>
                <p className="text-xs text-zinc-500 max-w-xs font-medium">Memproses kecepatan respon dan kestabilan fokus Anda.</p>
              </div>
            ) : activeCfi && activePvt && activeStroop && activeMotor && activeAnalysis ? (
              <div className="space-y-3.5">
                <div className="flex justify-between items-center px-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Hasil Tes Kelelahan</span>
                  <button
                    onClick={() => setIsTestingActive(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 text-xs font-semibold transition-all"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-apple-blue" />
                    <span>Uji Ulang</span>
                  </button>
                </div>
                <ResultSummaryHeader cfi={activeCfi} />
                <TelemetryBreakdown pvt={activePvt} stroop={activeStroop} motor={activeMotor} />
                <ClinicalDetailsTabs analysis={activeAnalysis} cfi={activeCfi} />
              </div>
            ) : (
              <AssessmentLandingCard
                onStart={() => setIsTestingActive(true)}
                baselineMs={deviceBaselineMs}
              />
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="animate-springUp">
            <HistoryLogView history={history} />
          </div>
        )}
      </main>

      <AppleTabBar activeTab={activeTab} onTabChange={(t) => { setIsTestingActive(false); setActiveTab(t); }} />

      <ProfileDetailsModal isOpen={isProfileDetailsOpen} onClose={() => setIsProfileDetailsOpen(false)} baselineMs={deviceBaselineMs} />
      <JuryPresetModal isOpen={isJuryPresetsOpen} onClose={() => setIsJuryPresetsOpen(false)} onApplyScenario={handleApplyScenario} isSimulating={isAiLoading} />
      <VitalDetailModal vitalKey={selectedVitalKey} latestResult={latestResult} onClose={() => setSelectedVitalKey(null)} />
    </div>
  );
}
