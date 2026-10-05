'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { DriverWithLatestAssessment, DriverStatus, DispatcherDecision } from '@/types/fleet';
import { InspectionAssessmentTab } from './InspectionAssessmentTab';

interface FleetInspectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  driver: DriverWithLatestAssessment | null;
  onStatusUpdated: () => void;
}

export function FleetInspectionModal({
  isOpen,
  onClose,
  driver,
  onStatusUpdated,
}: FleetInspectionModalProps) {
  const [activeTab, setActiveTab] = useState<'assessment' | 'profile' | 'trips'>('assessment');
  const [dispatcherNote, setDispatcherNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen || !driver) return null;

  const latest = driver.latestAssessment;

  const handleDecision = async (status: DriverStatus, decision: DispatcherDecision) => {
    setSubmitting(true);
    try {
      await fetch('/api/fleet', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
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
      console.error('Failed to update dispatcher decision:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-[#1C1C1E] rounded-3xl w-full max-w-xl overflow-hidden border border-black/10 dark:border-white/10 shadow-2xl flex flex-col max-h-[92vh] animate-springUp">
        {/* Header */}
        <div className="px-5 py-4 border-b border-black/5 dark:border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center font-bold text-sm text-zinc-800 dark:text-zinc-200">
              {driver.nip.slice(-3)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-zinc-900 dark:text-white">{driver.name}</h3>
                <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                  {driver.nip}
                </span>
              </div>
              <p className="text-xs text-zinc-500 font-medium">{driver.vehicle_type} • {driver.license_plate}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-black/5 dark:border-white/5 px-4 gap-2 pt-2 bg-zinc-50 dark:bg-zinc-900/40 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('assessment')}
            className={`pb-2.5 px-3 border-b-2 transition-all ${activeTab === 'assessment' ? 'border-apple-blue text-apple-blue' : 'border-transparent text-zinc-500'}`}
          >
            Hasil Uji Kebugaran
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-2.5 px-3 border-b-2 transition-all ${activeTab === 'profile' ? 'border-apple-blue text-apple-blue' : 'border-transparent text-zinc-500'}`}
          >
            Profil & Rekam Medis
          </button>
          <button
            onClick={() => setActiveTab('trips')}
            className={`pb-2.5 px-3 border-b-2 transition-all ${activeTab === 'trips' ? 'border-apple-blue text-apple-blue' : 'border-transparent text-zinc-500'}`}
          >
            Riwayat Perjalanan
          </button>
        </div>

        {/* Body Content */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {activeTab === 'assessment' && (
            <InspectionAssessmentTab
              latest={latest || null}
              dispatcherNote={dispatcherNote}
              setDispatcherNote={setDispatcherNote}
              submitting={submitting}
              onDecision={handleDecision}
            />
          )}

          {activeTab === 'profile' && (
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 space-y-1">
                <span className="text-[10px] font-bold uppercase text-zinc-400">Alamat Domisili & Pool</span>
                <p className="font-semibold text-zinc-900 dark:text-white">{driver.address}</p>
              </div>
              <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 space-y-1">
                <span className="text-[10px] font-bold uppercase text-zinc-400">Riwayat Penyakit & Kondisi Medis</span>
                <p className="font-semibold text-zinc-900 dark:text-white">{driver.medical_history}</p>
              </div>
              <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 space-y-1">
                <span className="text-[10px] font-bold uppercase text-zinc-400">Armada & Nomor Registrasi</span>
                <p className="font-semibold text-zinc-900 dark:text-white">{driver.vehicle_type} ({driver.license_plate})</p>
              </div>
            </div>
          )}

          {activeTab === 'trips' && (
            <div className="space-y-2 text-xs">
              {driver.recentTrips && driver.recentTrips.length > 0 ? (
                driver.recentTrips.map((trip) => (
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
                <div className="text-center py-8 text-zinc-400">Belum ada riwayat rute perjalanan.</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
