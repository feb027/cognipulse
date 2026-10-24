/**
 * Travel Fleet & Database Integration Unit Tests
 */

import { describe, it, expect } from 'vitest';
import ExcelJS from 'exceljs';
import { getAllDrivers, getDriverByNip } from '../src/lib/db/driver-service';
import { getFleetSummary, updateDriverStatus, getDriverFullInspection } from '../src/lib/db/fleet-service';
import { saveAssessmentRecord } from '../src/lib/db/assessment-service';
import { generateLocalFallbackAnalysis } from '../src/lib/ai/local-fallback-engine';
import { buildFleetSummarySheet } from '../src/lib/export/sheet-fleet-summary';
import { buildAssessmentLogsSheet, buildTripHistorySheet } from '../src/lib/export/sheet-assessment-logs';

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
    const analysis = generateLocalFallbackAnalysis(cfi, pvt as any, stroop as any, motor as any);

    const record = saveAssessmentRecord({
      nip: 'TRV-001',
      cfi,
      pvt: pvt as any,
      stroop: stroop as any,
      motor: motor as any,
      analysis,
    });

    expect(record.id).toBeDefined();
    expect(record.braking_distance_meters).toBeGreaterThan(6.0);
    expect(record.dispatcher_recommendation).toBe('siap_solo');

    const updated = getDriverByNip('TRV-001');
    expect(updated?.status).toBe('ready');
  });

  it('memvalidasi autentikasi supir dan kredensial dispatcher perusahaan', async () => {
    const { validateDriverLogin, validateDispatcherLogin } = await import('../src/lib/db/driver-service');

    const validDriver = validateDriverLogin('TRV-001', '1234');
    expect(validDriver).not.toBeNull();
    expect(validDriver?.name).toBe('Budi Santoso');

    const invalidDriver = validateDriverLogin('TRV-001', '9999');
    expect(invalidDriver).toBeNull();

    const validDispatcher = validateDispatcherLogin('admin', 'admin123');
    expect(validDispatcher).not.toBeNull();
    expect(validDispatcher?.username).toBe('admin');

    const invalidDispatcher = validateDispatcherLogin('admin', 'wrongpass');
    expect(invalidDispatcher).toBeNull();
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

  it('berhasil menghasilkan workbook Excel (.xlsx) 3-Sheet terformat untuk laporan perusahaan', async () => {
    const summary = getFleetSummary();
    const drivers = getAllDrivers();
    const full = getDriverFullInspection(drivers[0].id);

    const workbook = new ExcelJS.Workbook();
    buildFleetSummarySheet(workbook, summary, drivers);
    buildAssessmentLogsSheet(workbook, full?.assessments || []);
    buildTripHistorySheet(workbook, full?.trips || []);

    expect(workbook.worksheets.length).toBe(3);
    expect(workbook.worksheets[0].name).toBe('1. Status & KPI Armada');
    expect(workbook.worksheets[1].name).toBe('2. Log Riwayat Asesmen K3');
    expect(workbook.worksheets[2].name).toBe('3. Jadwal & Riwayat Rute');

    const buffer = await workbook.xlsx.writeBuffer();
    expect(buffer.byteLength).toBeGreaterThan(5000);
  });
});
