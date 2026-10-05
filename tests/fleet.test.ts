/**
 * Travel Fleet & Database Integration Unit Tests
 */

import { describe, it, expect } from 'vitest';
import { getAllDrivers, getDriverByNip, createDriver } from '../src/lib/db/driver-service';
import { getFleetSummary, updateDriverStatus, updateDispatcherDecision } from '../src/lib/db/fleet-service';
import { saveAssessmentRecord } from '../src/lib/db/assessment-service';
import { calculatePVTMetrics } from '../src/lib/scoring/pvt-metrics';
import { calculateStroopMetrics } from '../src/lib/scoring/stroop-metrics';
import { calculateMotorMetrics } from '../src/lib/scoring/motor-metrics';
import { calculateCompositeFatigueIndex } from '../src/lib/scoring/cfi-aggregator';
import { generateLocalFallbackAnalysis } from '../src/lib/ai/local-fallback-engine';

describe('Travel Fleet Management & SQLite Persistence', () => {
  it('berhasil memuat seluruh supir terdaftar dari database SQLite', () => {
    const drivers = getAllDrivers();
    expect(drivers.length).toBeGreaterThanOrEqual(5);

    const budi = drivers.find((d) => d.nip === 'TRV-001');
    expect(budi).toBeDefined();
    expect(budi?.name).toBe('Budi Santoso');
    expect(budi?.vehicle_type).toContain('HiAce');
  });

  it('berhasil mendapatkan profil supir berdasarkan NIP beserta riwayat rute', () => {
    const driver = getDriverByNip('TRV-001');
    expect(driver).not.toBeNull();
    expect(driver?.license_plate).toBe('D 7182 AB');
    expect(driver?.activeTrip).toBeDefined();
  });

  it('menghitung KPI ringkasan armada dengan metrik pengereman dan status operasional', () => {
    const summary = getFleetSummary();
    expect(summary.totalDrivers).toBeGreaterThanOrEqual(5);
    expect(summary.readyCount).toBeGreaterThan(0);
    expect(summary.avgBrakingDistanceMeters).toBeGreaterThan(0);
    expect(['optimal', 'elevated', 'high_risk']).toContain(summary.fleetAlertLevel);
  });

  it('berhasil menyimpan asesmen baru, mengkalkulasi jarak rem tol, dan memperbarui status supir', () => {
    const pvt = {
      meanReactionTimeMs: 240,
      fastestTenPercentRT: 200,
      slowestTenPercentRT: 280,
      attentionalLapseCount: 0,
      falseStartCount: 0,
      standardDeviationMs: 15,
      responseSpeed: 4.16,
    };
    const stroop = {
      accuracyRate: 98,
      commissionErrors: 0,
      omissionErrors: 0,
      incongruentMeanLatencyMs: 400,
      congruentMeanLatencyMs: 350,
      stroopEffectCostMs: 50,
      inhibitoryControlScore: 95,
    };
    const motor = {
      cadenceTapsPerSecond: 6.5,
      totalTaps: 98,
      itiStandardDeviationMs: 12,
      cadenceDriftRate: 0.01,
      rhythmStabilityScore: 92,
    };
    const cfi = {
      cfiScore: 12,
      impairmentTier: 'fit' as const,
      subjectiveObjectiveDisparity: false,
      calculatedAt: new Date().toISOString(),
    };
    const analysis = generateLocalFallbackAnalysis(cfi, pvt, stroop, motor);

    const record = saveAssessmentRecord({
      nip: 'TRV-001',
      cfi,
      pvt,
      stroop,
      motor,
      analysis,
    });

    expect(record.id).toBeDefined();
    expect(record.braking_distance_meters).toBeGreaterThan(6.0);
    expect(record.dispatcher_recommendation).toBe('siap_solo');

    // Supir harus berstatus ready
    const updated = getDriverByNip('TRV-001');
    expect(updated?.status).toBe('ready');
  });

  it('memperbarui status dispatcher dan persetujuan tugas secara persisten', () => {
    const driver = getDriverByNip('TRV-002');
    expect(driver).not.toBeNull();
    if (!driver) return;

    const success = updateDriverStatus(driver.id, 'ready');
    expect(success).toBe(true);

    const refreshed = getDriverByNip('TRV-002');
    expect(refreshed?.status).toBe('ready');

    // Kembalikan ke caution untuk konsistensi demo
    updateDriverStatus(driver.id, 'caution');
  });
});
