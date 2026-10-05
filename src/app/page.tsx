'use client';

import React, { useState } from 'react';
import { AppleHeader } from '@/components/navigation/AppleHeader';
import { AppleTabBar, NavigationTab } from '@/components/navigation/AppleTabBar';
import { DriverProfileModal } from '@/components/navigation/DriverProfileModal';
import { JuryPresetModal } from '@/components/navigation/JuryPresetModal';
import { AppleHighlightsCard } from '@/components/dashboard/AppleHighlightsCard';
import { SummaryFavouritesFeed } from '@/components/dashboard/SummaryFavouritesFeed';
import { TrendHistoryView } from '@/components/dashboard/TrendHistoryView';
import { HistoryLogView } from '@/components/dashboard/HistoryLogView';
import { VitalDetailModal } from '@/components/dashboard/VitalDetailModal';
import { AssessmentWizard } from '@/components/assessment/AssessmentWizard';
import { AssessmentLandingCard } from '@/components/assessment/AssessmentLandingCard';
import { AssessmentResultView } from '@/components/results/AssessmentResultView';
import { UnifiedLoginView } from '@/components/auth/UnifiedLoginView';
import { useSessionHistory, StoredSession } from '@/hooks/use-session-storage';
import { useAuthSession } from '@/hooks/use-auth-session';
import { toAssessmentResult } from '@/lib/session-utils';
import { CompositeFatigueResult, UserContext, PVTMetrics, StroopMetrics, MotorMetrics, CorsiMetrics, GeminiClinicalAnalysis } from '@/types';
import { Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

export default function Home() {
  const { session, loading: authLoading, isLoggedIn, isDriver, logout } = useAuthSession();
  const [activeTab, setActiveTab] = useState<NavigationTab>('summary');
  const [isTestingActive, setIsTestingActive] = useState(false);
  const [isDriverProfileOpen, setIsDriverProfileOpen] = useState(false);
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

  if (authLoading) {
    return <div className="min-h-screen bg-[#F2F2F7] dark:bg-black flex items-center justify-center text-zinc-500 text-xs">Memuat sesi CogniPulse...</div>;
  }

  if (!isLoggedIn || !session) {
    return (
      <UnifiedLoginView
        onLoginSuccess={(sess) => {
          if (sess.role === 'dispatcher') {
            window.location.href = '/fleet';
          }
        }}
      />
    );
  }

  if (session.role === 'dispatcher') {
    return (
      <div className="min-h-screen bg-[#F2F2F7] dark:bg-black flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-apple-blue/20 flex items-center justify-center text-apple-blue">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Akun Dispatcher Terdeteksi</h2>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm">Anda masuk sebagai manajemen armada. Silakan buka konsol pengawasan supir travel.</p>
        <div className="flex gap-2">
          <button onClick={logout} className="px-4 py-2 rounded-xl text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">Ganti Akun</button>
          <a href="/fleet" className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-apple-blue hover:bg-apple-blue/90 inline-flex items-center gap-1.5 shadow-md">
            <span>Buka Konsol Armada</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    );
  }

  const activeDriver = session.driver;

  const handleAssessmentCompleted = async (
    cfi: CompositeFatigueResult, pvt: PVTMetrics, stroop: StroopMetrics,
    motor: MotorMetrics, context: UserContext, corsi?: CorsiMetrics
  ) => {
    setIsTestingActive(false);
    setActiveCfi(cfi); setActivePvt(pvt); setActiveStroop(stroop);
    setActiveMotor(motor); if (corsi) setActiveCorsi(corsi);
    setIsAiLoading(true);

    const driverContext = {
      nip: activeDriver.nip, name: activeDriver.name,
      vehicleType: activeDriver.vehicle_type, licensePlate: activeDriver.license_plate,
      activeRoute: activeDriver.activeTrip?.route_name || 'Lintas Tol Antarkota',
      medicalHistory: activeDriver.medical_history,
    };

    let analysisResult: GeminiClinicalAnalysis;
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cfi, pvt, stroop, motor, context, corsi, deviceBaselineMs, clientTimestamp: new Date().toISOString(), driverContext }),
      });
      const data = await res.json();
      analysisResult = data.analysis;
    } catch {
      const { generateLocalFallbackAnalysis } = await import('@/lib/ai/local-fallback-engine');
      analysisResult = generateLocalFallbackAnalysis(cfi, pvt, stroop, motor, corsi || undefined);
    } finally {
      setIsAiLoading(false);
    }

    setActiveAnalysis(analysisResult);
    saveSession(cfi, analysisResult, pvt, stroop, motor, corsi);

    try {
      await fetch('/api/assessments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ driverId: activeDriver.id, nip: activeDriver.nip, cfi, pvt, stroop, motor, corsi, analysis: analysisResult }),
      });
    } catch (e) {
      console.error('Failed to persist assessment:', e);
    }
  };

  const handleSelectHistorySession = (s: StoredSession) => {
    const res = toAssessmentResult(s);
    setActiveCfi(res.cfi); setActivePvt(res.pvt); setActiveStroop(res.stroop);
    setActiveMotor(res.motor); setActiveCorsi(res.corsi || null); setActiveAnalysis(res.diagnosis);
    setIsTestingActive(false); setActiveTab('assessment');
  };

  const latestResult = (activeCfi && activePvt && activeStroop && activeMotor && activeAnalysis)
    ? { cfi: activeCfi, pvt: activePvt, stroop: activeStroop, motor: activeMotor, corsi: activeCorsi || undefined, diagnosis: activeAnalysis, timestamp: new Date().toISOString() }
    : history.length > 0 ? toAssessmentResult(history[0]) : null;

  return (
    <div className={`min-h-screen transition-colors ${isTestingActive ? 'pb-4 sm:pb-6' : 'pb-36 sm:pb-32'}`}>
      <AppleHeader
        title={activeTab === 'summary' ? 'Ringkasan' : activeTab === 'assessment' ? 'Asesmen' : 'Riwayat'}
        driver={activeDriver}
        isDispatcher={false}
        onOpenProfileDetails={() => setIsDriverProfileOpen(true)}
        onOpenJuryPresets={() => setIsJuryPresetsOpen(true)}
        onSeedDemo={seedDemoHistory}
        onClearHistory={() => { clearHistory(); setActiveCfi(null); setActivePvt(null); setActiveStroop(null); setActiveMotor(null); setActiveAnalysis(null); }}
        onLogout={logout}
      />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 space-y-3.5">
        {activeTab === 'summary' && (
          <div className="space-y-3.5 animate-springUp">
            <AppleHighlightsCard latestResult={latestResult} onStartAssessment={() => { setActiveTab('assessment'); setIsTestingActive(true); }} />
            <SummaryFavouritesFeed latestResult={latestResult} onSelectVital={(key) => setSelectedVitalKey(key)} />
            <TrendHistoryView history={history} />
          </div>
        )}

        {activeTab === 'assessment' && (
          <div className="space-y-3.5 animate-springUp">
            {isTestingActive ? (
              <AssessmentWizard onAssessmentCompleted={handleAssessmentCompleted} onCancel={() => setIsTestingActive(false)} />
            ) : isAiLoading ? (
              <div className="p-10 rounded-3xl bg-white dark:bg-[#1C1C1E] border border-black/5 dark:border-white/10 shadow-apple flex flex-col items-center justify-center space-y-2.5 text-center my-6">
                <div className="w-10 h-10 rounded-full bg-apple-blue/10 flex items-center justify-center text-apple-blue animate-spin"><Sparkles className="w-5 h-5" /></div>
                <h3 className="text-sm font-bold text-zinc-900 dark:text-white">Menganalisis Kesiapan Tempuh Tol...</h3>
                <p className="text-xs text-zinc-500 max-w-xs font-medium">Memproses estimasi jarak pengereman dan risiko sirkadian pengemudi.</p>
              </div>
            ) : activeCfi && activePvt && activeStroop && activeMotor && activeAnalysis ? (
              <AssessmentResultView cfi={activeCfi} pvt={activePvt} stroop={activeStroop} motor={activeMotor} analysis={activeAnalysis} onRetest={() => setIsTestingActive(true)} />
            ) : (
              <AssessmentLandingCard onStart={() => setIsTestingActive(true)} baselineMs={deviceBaselineMs} />
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="animate-springUp">
            <HistoryLogView history={history} onSelectSession={handleSelectHistorySession} />
          </div>
        )}
      </main>

      {!isTestingActive && (
        <AppleTabBar activeTab={activeTab} onTabChange={(t) => { setIsTestingActive(false); setActiveTab(t); }} />
      )}

      <DriverProfileModal isOpen={isDriverProfileOpen} onClose={() => setIsDriverProfileOpen(false)} driver={activeDriver} onLogout={logout} />
      <JuryPresetModal isOpen={isJuryPresetsOpen} onClose={() => setIsJuryPresetsOpen(false)} onApplyScenario={async (pkg) => { setIsTestingActive(false); setActiveTab('assessment'); await handleAssessmentCompleted(pkg.cfi, pkg.pvt, pkg.stroop, pkg.motor, pkg.context, pkg.corsi); }} isSimulating={isAiLoading} />
      <VitalDetailModal vitalKey={selectedVitalKey} latestResult={latestResult} onClose={() => setSelectedVitalKey(null)} />
    </div>
  );
}
