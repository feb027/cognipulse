'use client';

import React, { useState, useEffect } from 'react';
import { X, RefreshCw } from 'lucide-react';
import { DriverWithLatestAssessment, DriverStatus, DispatcherDecision, AssessmentRecord } from '@/types/fleet';
import { InspectionSummaryTab } from './InspectionSummaryTab';
import { InspectionFullMetricsTab } from './InspectionFullMetricsTab';
import { InspectionHistoryTab } from './InspectionHistoryTab';
import { getAuthHeader } from '@/hooks/use-auth-session';

interface FleetInspectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  driver: DriverWithLatestAssessment | null;
  onStatusUpdated: () => void;
}

type TabType = 'summary' | 'metrics' | 'history' | 'profile' | 'trips';

export function FleetInspectionModal({
  isOpen,
  onClose,
  driver,
  onStatusUpdated,
}: FleetInspectionModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('summary');
  const [dispatcherNote, setDispatcherNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [fullData, setFullData] = useState<any>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => {
    if (isOpen && driver?.id) {
      setActiveTab('summary');
      setLoadingDetails(true);
      fetch(`/api/assessments?driverId=${driver.id}`)
        .then((res) => res.json())
        .then((data) => setFullData(data))
        .catch((err) => console.error('Failed to load full inspection:', err))
        .finally(() => setLoadingDetails(false));
    } else {
      setFullData(null);
    }
  }, [isOpen, driver?.id]);

  if (!isOpen || !driver) return null;

  const latest = fullData?.latestAssessment || driver.latestAssessment || null;
  const historyList: AssessmentRecord[] = fullData?.assessments || (latest ? [latest] : []);
  const tripList = fullData?.trips || driver.recentTrips || [];

  const handleDecision = async (status: DriverStatus, decision: DispatcherDecision) => {
    setSubmitting(true);
    try {
      await fetch('/api/fleet', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
        body: JSON.stringify({
          driverId: driver.id,
          status,
          assessmentId: latest?.id,
          decision,
          notes: dispatcherNote || undefined,
        }),
      });
      onStatusUpdated();
      onClose();
    } catch (err) {
      console.error('Failed to update decision:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const tabs: { id: TabType; label: string }[] = [
    { id: 'summary', label: 'Ringkasan & Aksi' },
    { id: 'metrics', label: 'Hasil Asesmen' },
    { id: 'history', label: `Riwayat (${historyList.length})` },
    { id: 'profile', label: 'Profil & Medis' },
    { id: 'trips', label: 'Rute Travel' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      {/* Fixed height container to prevent layout jumping */}
      <div className="bg-white dark:bg-[#1C1C1E] rounded-3xl w-full max-w-2xl h-[600px] max-h-[92vh] flex flex-col border border-black/10 dark:border-white/10 shadow-2xl overflow-hidden animate-springUp">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-black/5 dark:border-white/10 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center font-bold text-xs text-zinc-800 dark:text-zinc-200">
              {driver.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-zinc-900 dark:text-white">{driver.name}</h3>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                  {driver.nip}
                </span>
              </div>
              <p className="text-[11px] text-zinc-500 font-medium">{driver.vehicle_type} • {driver.license_plate}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Tutup"
            className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 flex items-center justify-center text-zinc-500 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-black/5 dark:border-white/5 px-4 gap-1 pt-1.5 bg-zinc-50 dark:bg-zinc-900/40 text-xs font-semibold overflow-x-auto flex-shrink-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-2 px-3 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-apple-blue text-apple-blue'
                  : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Scrollable Body Content */}
        <div className="p-5 overflow-y-auto flex-1">
          {loadingDetails && !fullData ? (
            <div className="py-12 flex flex-col items-center justify-center text-zinc-400 gap-2">
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span className="text-xs">Memuat detail riwayat asesmen...</span>
            </div>
          ) : (
            <>
              {activeTab === 'summary' && (
                <InspectionSummaryTab
                  latest={latest}
                  dispatcherNote={dispatcherNote}
                  setDispatcherNote={setDispatcherNote}
                  submitting={submitting}
                  onDecision={handleDecision}
                />
              )}

              {activeTab === 'metrics' && <InspectionFullMetricsTab latest={latest} />}

              {activeTab === 'history' && <InspectionHistoryTab assessments={historyList} />}

              {activeTab === 'profile' && (
                <div className="space-y-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 space-y-1">
                    <span className="text-[10px] font-bold uppercase text-zinc-400">Alamat Domisili & Pool</span>
                    <p className="font-semibold text-zinc-900 dark:text-white">{driver.address}</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 space-y-1">
                    <span className="text-[10px] font-bold uppercase text-zinc-400">Riwayat Penyakit & Rekam Medis</span>
                    <p className="font-semibold text-zinc-900 dark:text-white">{driver.medical_history}</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 space-y-1">
                    <span className="text-[10px] font-bold uppercase text-zinc-400">Armada & Nomor Registrasi</span>
                    <p className="font-semibold text-zinc-900 dark:text-white">{driver.vehicle_type} ({driver.license_plate})</p>
                  </div>
                </div>
              )}

              {activeTab === 'trips' && (
                <div className="space-y-2 text-xs">
                  {tripList.length > 0 ? (
                    tripList.map((trip: any) => (
                      <div key={trip.id} className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/40 border border-black/5 dark:border-white/5 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-zinc-900 dark:text-white">{trip.route_name}</span>
                          <span className="font-mono text-[10px] text-zinc-500">{trip.distance_km} km</span>
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-zinc-500">
                          <span>Berangkat: {trip.departure_time}</span>
                          <span className="capitalize">{trip.status}</span>
                        </div>
                        {trip.notes && <p className="text-[11px] text-zinc-400 italic">"{trip.notes}"</p>}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-10 text-zinc-400">Belum ada riwayat rute perjalanan.</div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
