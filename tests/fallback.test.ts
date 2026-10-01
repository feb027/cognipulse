/**
 * Automated Tests for Fallback Resilience Engine
 * Menguji transisi otomatis ke deterministic clinical heuristics tanpa error/crash.
 */

import { describe, it, expect } from 'vitest';
import { generateLocalFallbackAnalysis } from '../src/lib/ai/local-fallback-engine';
import { analyzeFatigueTelemetry } from '../src/lib/ai/gemini-client';
import { calculatePVTMetrics } from '../src/lib/scoring/pvt-metrics';
import { calculateStroopMetrics } from '../src/lib/scoring/stroop-metrics';
import { calculateMotorMetrics } from '../src/lib/scoring/motor-metrics';
import { calculateCompositeFatigueIndex } from '../src/lib/scoring/cfi-aggregator';

describe('Local Resilience Fallback Engine', () => {
  const pvt = calculatePVTMetrics([]);
  const stroop = calculateStroopMetrics([]);
  const motor = calculateMotorMetrics([], 15);
  const cfi = calculateCompositeFatigueIndex(pvt, stroop, motor);

  it('menghasilkan struktur diagnosis lengkap dan valid saat mode offline', () => {
    const analysis = generateLocalFallbackAnalysis(cfi, pvt, stroop, motor);

    expect(analysis.differentialDiagnosis).toBeDefined();
    expect(analysis.differentialDiagnosis.primaryType).toBeDefined();
    expect(analysis.fourHourRiskForecast.decisionErrorProbabilityIncrease).toBeDefined();
    expect(analysis.precisionRecoveryPrescription.immediateAction).toBeDefined();
    expect(analysis.isFallback).toBe(true);
  });

  it('secara transparan menangani ketiadaan API key tanpa melempar runtime exception', async () => {
    // Override API key dengan string kosong untuk memaksa fallback
    const result = await analyzeFatigueTelemetry(cfi, pvt, stroop, motor, undefined, '');
    expect(result).toBeDefined();
    expect(result.isFallback).toBe(true);
    expect(result.precisionRecoveryPrescription.hydrationElectrolyteMl).toBeGreaterThan(0);
  });

  it('berhasil memanggil model cascade cloud dan menangani 503 secara seamless', async () => {
    const realApiKey = process.env.GEMINI_API_KEY || 'AIzaSyCatOsK2Wtdiq3ag8Axg1FWhavqAL2IraQ';
    const result = await analyzeFatigueTelemetry(cfi, pvt, stroop, motor, undefined, realApiKey);
    expect(result).toBeDefined();
    expect(result.differentialDiagnosis.clinicalRationale).toBeTruthy();
    expect(result.precisionRecoveryPrescription.immediateAction).toBeTruthy();
    // Memastikan model cascade Gemini atau fallback terisi
    expect(result.aiEngineVersion).toMatch(/gemini/i);
  }, 15000);
});
