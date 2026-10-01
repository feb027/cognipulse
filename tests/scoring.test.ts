/**
 * Automated Unit Tests for Cognitive Scoring Engines
 * Menguji validitas matematis formula Dinges PVT, Stroop, Motor Jitter, Corsi Span, dan CFI.
 */

import { describe, it, expect } from 'vitest';
import { calculatePVTMetrics } from '../src/lib/scoring/pvt-metrics';
import { calculateStroopMetrics } from '../src/lib/scoring/stroop-metrics';
import { calculateMotorMetrics } from '../src/lib/scoring/motor-metrics';
import { calculateCorsiMetrics } from '../src/lib/scoring/corsi-metrics';
import { calculateCompositeFatigueIndex } from '../src/lib/scoring/cfi-aggregator';
import { PVTTrial } from '../src/types/pvt';
import { StroopTrial } from '../src/types/stroop';
import { CorsiTrial } from '../src/types/corsi';
import { TapEvent } from '../src/types/motor';
import { UserContext } from '../src/types/assessment';

describe('PVT Dinges-Basner Metrics Engine', () => {
  it('menghitung metrik dengan benar pada kondisi operator prima (0 lapse)', () => {
    const trials: PVTTrial[] = [
      { trialIndex: 1, delayScheduledMs: 2000, stimulusRenderedAt: 1000, responseCapturedAt: 1220, reactionTimeMs: 220, isLapse: false, isFalseStart: false },
      { trialIndex: 2, delayScheduledMs: 2500, stimulusRenderedAt: 3000, responseCapturedAt: 3210, reactionTimeMs: 210, isLapse: false, isFalseStart: false },
      { trialIndex: 3, delayScheduledMs: 1800, stimulusRenderedAt: 5000, responseCapturedAt: 5240, reactionTimeMs: 240, isLapse: false, isFalseStart: false },
    ];

    const metrics = calculatePVTMetrics(trials);
    expect(metrics.totalTrials).toBe(3);
    expect(metrics.attentionalLapseCount).toBe(0);
    expect(metrics.falseStartCount).toBe(0);
    expect(metrics.meanReactionTimeMs).toBe(223);
    expect(metrics.responseSpeed).toBeGreaterThan(4.0);
    expect(metrics.performanceIndex).toBe(100);
  });

  it('mendeteksi attentional lapses (RT >= 355ms) dan false starts pada operator lelah', () => {
    const trials: PVTTrial[] = [
      { trialIndex: 1, delayScheduledMs: 2000, stimulusRenderedAt: 1000, responseCapturedAt: 1050, reactionTimeMs: 50, isLapse: false, isFalseStart: true },
      { trialIndex: 2, delayScheduledMs: 3000, stimulusRenderedAt: 3000, responseCapturedAt: 3450, reactionTimeMs: 450, isLapse: true, isFalseStart: false },
      { trialIndex: 3, delayScheduledMs: 2200, stimulusRenderedAt: 5000, responseCapturedAt: 5400, reactionTimeMs: 400, isLapse: true, isFalseStart: false },
      { trialIndex: 4, delayScheduledMs: 2800, stimulusRenderedAt: 7000, responseCapturedAt: 7260, reactionTimeMs: 260, isLapse: false, isFalseStart: false },
    ];

    const metrics = calculatePVTMetrics(trials);
    expect(metrics.attentionalLapseCount).toBe(2);
    expect(metrics.falseStartCount).toBe(1);
    expect(metrics.performanceIndex).toBeLessThan(50);
  });
});

describe('Stroop Inhibitory Control Engine', () => {
  it('memberikan penalti berat pada commission errors (gagal inhibisi No-Go)', () => {
    const trials: StroopTrial[] = [
      { trialIndex: 1, wordText: 'HIJAU', displayColor: '#22c55e', stimulusType: 'go_match', expectedAction: 'press', userAction: 'pressed', reactionTimeMs: 280, isCorrect: true },
      { trialIndex: 2, wordText: 'MERAH', displayColor: '#ef4444', stimulusType: 'no_go_mismatch', expectedAction: 'withhold', userAction: 'pressed', reactionTimeMs: 310, isCorrect: false, errorType: 'commission' },
      { trialIndex: 3, wordText: 'BIRU', displayColor: '#3b82f6', stimulusType: 'no_go_mismatch', expectedAction: 'withhold', userAction: 'pressed', reactionTimeMs: 300, isCorrect: false, errorType: 'commission' },
    ];

    const metrics = calculateStroopMetrics(trials);
    expect(metrics.commissionErrors).toBe(2);
    expect(metrics.inhibitoryControlScore).toBeLessThan(75);
  });
});

describe('Motor Tapping & Jitter Engine', () => {
  it('menghasilkan skor steadiness tinggi pada ketukan ritmik dengan jitter rendah', () => {
    const events: TapEvent[] = [
      { tapIndex: 1, timestampMs: 0, interTapIntervalMs: 0 },
      { tapIndex: 2, timestampMs: 250, interTapIntervalMs: 250 },
      { tapIndex: 3, timestampMs: 502, interTapIntervalMs: 252 },
      { tapIndex: 4, timestampMs: 751, interTapIntervalMs: 249 },
      { tapIndex: 5, timestampMs: 1003, interTapIntervalMs: 252 },
    ];

    const metrics = calculateMotorMetrics(events, 15);
    expect(metrics.itiStandardDeviationMs).toBeLessThan(5);
    expect(metrics.neuromuscularSteadinessScore).toBeGreaterThan(90);
  });
});

describe('Corsi Block-Tapping Spatial Memory Engine', () => {
  it('memberikan skor memori kerja prima pada subjek yang mampu mengingat span 6', () => {
    const trials: CorsiTrial[] = [
      { trialIndex: 1, spanLength: 3, targetSequence: [0, 1, 2], userSequence: [0, 1, 2], isCorrect: true, responseTimeMs: 1200 },
      { trialIndex: 2, spanLength: 4, targetSequence: [1, 3, 5, 7], userSequence: [1, 3, 5, 7], isCorrect: true, responseTimeMs: 1500 },
      { trialIndex: 3, spanLength: 5, targetSequence: [0, 2, 4, 6, 8], userSequence: [0, 2, 4, 6, 8], isCorrect: true, responseTimeMs: 1900 },
      { trialIndex: 4, spanLength: 6, targetSequence: [0, 1, 4, 7, 8, 2], userSequence: [0, 1, 4, 7, 8, 2], isCorrect: true, responseTimeMs: 2200 },
    ];

    const metrics = calculateCorsiMetrics(trials);
    expect(metrics.maxSpan).toBe(6);
    expect(metrics.sequenceAccuracyRate).toBe(100);
    expect(metrics.workingMemoryScore).toBe(100);
  });

  it('mendeteksi penurunan memori kerja pada operator yang gagal span panjang', () => {
    const trials: CorsiTrial[] = [
      { trialIndex: 1, spanLength: 3, targetSequence: [0, 1, 2], userSequence: [0, 1, 2], isCorrect: true, responseTimeMs: 1200 },
      { trialIndex: 2, spanLength: 4, targetSequence: [1, 3, 5, 7], userSequence: [1, 3, 2, 7], isCorrect: false, responseTimeMs: 1600 },
      { trialIndex: 3, spanLength: 5, targetSequence: [0, 2, 4, 6, 8], userSequence: [0, 3, 4], isCorrect: false, responseTimeMs: 1400 },
    ];

    const metrics = calculateCorsiMetrics(trials);
    expect(metrics.maxSpan).toBe(3);
    expect(metrics.sequenceAccuracyRate).toBeLessThan(50);
    expect(metrics.workingMemoryScore).toBeLessThan(60);
  });
});

describe('Composite Cognitive Fatigue Index (CFI) & Silent Fatigue', () => {
  it('mendeteksi Silent Fatigue saat user mengaku bugar tapi performa objektif drop', () => {
    const pvt = calculatePVTMetrics([
      { trialIndex: 1, delayScheduledMs: 2000, stimulusRenderedAt: 1000, responseCapturedAt: 1480, reactionTimeMs: 480, isLapse: true, isFalseStart: false },
      { trialIndex: 2, delayScheduledMs: 2000, stimulusRenderedAt: 3000, responseCapturedAt: 3510, reactionTimeMs: 510, isLapse: true, isFalseStart: false },
    ]);

    const stroop = calculateStroopMetrics([
      { trialIndex: 1, wordText: 'MERAH', displayColor: '#ef4444', stimulusType: 'no_go_mismatch', expectedAction: 'withhold', userAction: 'pressed', reactionTimeMs: 350, isCorrect: false, errorType: 'commission' },
    ]);

    const motor = calculateMotorMetrics([
      { tapIndex: 1, timestampMs: 0, interTapIntervalMs: 0 },
      { tapIndex: 2, timestampMs: 200, interTapIntervalMs: 200 },
      { tapIndex: 3, timestampMs: 500, interTapIntervalMs: 300 },
      { tapIndex: 4, timestampMs: 950, interTapIntervalMs: 450 },
    ], 15);

    const corsi = calculateCorsiMetrics([
      { trialIndex: 1, spanLength: 3, targetSequence: [0, 1, 2], userSequence: [0, 1, 2], isCorrect: true, responseTimeMs: 1200 },
      { trialIndex: 2, spanLength: 4, targetSequence: [1, 3, 5, 7], userSequence: [1, 2, 5], isCorrect: false, responseTimeMs: 1500 },
    ]);

    const context: UserContext = {
      operatorId: 'OP-01',
      shiftType: 'night_graveyard',
      hoursSleptLastNight: 4,
      hoursWorkedToday: 10,
      caffeineIntake: 'high',
      subjectiveFatigueScore: 1,
    };

    const result = calculateCompositeFatigueIndex(pvt, stroop, motor, context, corsi);
    expect(result.cfiScore).toBeGreaterThanOrEqual(60);
    expect(['moderate_impairment', 'critical_hazard']).toContain(result.impairmentTier);
    expect(result.subjectiveObjectiveDisparity).toBe(true);
  });
});
