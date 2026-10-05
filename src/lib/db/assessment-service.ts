import { getDatabase } from './database';
import { AssessmentRecord, DriverStatus } from '@/types/fleet';
import { CompositeFatigueResult } from '@/types/assessment';
import { PVTMetrics } from '@/types/pvt';
import { StroopMetrics } from '@/types/stroop';
import { MotorMetrics } from '@/types/motor';
import { CorsiMetrics } from '@/types/corsi';
import { GeminiClinicalAnalysis } from '@/types/gemini';

export interface SaveAssessmentInput {
  driverId?: number;
  nip?: string;
  cfi: CompositeFatigueResult;
  pvt: PVTMetrics;
  stroop: StroopMetrics;
  motor: MotorMetrics;
  corsi?: CorsiMetrics;
  analysis: GeminiClinicalAnalysis;
}

export function saveAssessmentRecord(input: SaveAssessmentInput): AssessmentRecord {
  const db = getDatabase();

  let targetDriverId = input.driverId;
  if (!targetDriverId && input.nip) {
    const d = db.prepare('SELECT id FROM drivers WHERE nip = ?').get(input.nip) as { id: number } | undefined;
    if (d) targetDriverId = d.id;
  }
  if (!targetDriverId) {
    const firstDriver = db.prepare('SELECT id FROM drivers ORDER BY id ASC LIMIT 1').get() as { id: number };
    targetDriverId = firstDriver ? firstDriver.id : 1;
  }

  // Jarak reaksi pada 100 km/jam (27.78 m/s)
  const rtSeconds = input.pvt.meanReactionTimeMs / 1000;
  const brakingDistanceMeters = parseFloat((rtSeconds * 27.78).toFixed(1));

  let microsleepRisk: 'rendah' | 'waspada' | 'kritis' = 'rendah';
  if (input.cfi.cfiScore >= 70 || input.pvt.attentionalLapseCount >= 4) {
    microsleepRisk = 'kritis';
  } else if (input.cfi.cfiScore >= 45 || input.pvt.attentionalLapseCount >= 2) {
    microsleepRisk = 'waspada';
  }

  let dispatcherRecommendation = 'siap_solo';
  let nextStatus: DriverStatus = 'ready';

  if (microsleepRisk === 'kritis' || input.cfi.impairmentTier === 'critical_hazard') {
    dispatcherRecommendation = 'stand_down';
    nextStatus = 'stand_down';
  } else if (microsleepRisk === 'waspada' || input.cfi.impairmentTier === 'mild_fatigue') {
    dispatcherRecommendation = 'wajib_co_driver';
    nextStatus = 'caution';
  }

  const stmt = db.prepare(`
    INSERT INTO assessments (
      driver_id, timestamp, cfi_score, impairment_tier, is_fit_for_duty,
      pvt_mean_rt, pvt_lapses, stroop_accuracy, motor_cadence, corsi_max_span,
      braking_distance_meters, microsleep_risk, dispatcher_recommendation,
      dispatcher_decision, headline_title, short_summary, raw_json
    ) VALUES (
      @driver_id, @timestamp, @cfi_score, @impairment_tier, @is_fit_for_duty,
      @pvt_mean_rt, @pvt_lapses, @stroop_accuracy, @motor_cadence, @corsi_max_span,
      @braking_distance_meters, @microsleep_risk, @dispatcher_recommendation,
      @dispatcher_decision, @headline_title, @short_summary, @raw_json
    )
  `);

  const info = stmt.run({
    driver_id: targetDriverId,
    timestamp: new Date().toISOString(),
    cfi_score: input.cfi.cfiScore,
    impairment_tier: input.cfi.impairmentTier,
    is_fit_for_duty: input.cfi.impairmentTier !== 'critical_hazard' ? 1 : 0,
    pvt_mean_rt: input.pvt.meanReactionTimeMs,
    pvt_lapses: input.pvt.attentionalLapseCount,
    stroop_accuracy: input.stroop.accuracyRate,
    motor_cadence: input.motor.cadenceTapsPerSecond,
    corsi_max_span: input.corsi ? input.corsi.maxSpan : null,
    braking_distance_meters: brakingDistanceMeters,
    microsleep_risk: microsleepRisk,
    dispatcher_recommendation: dispatcherRecommendation,
    dispatcher_decision: dispatcherRecommendation === 'siap_solo' ? 'dispatched_solo' : 'pending',
    headline_title: input.analysis.differentialDiagnosis.headlineTitle || 'Hasil Uji Kebugaran Supir',
    short_summary: input.analysis.differentialDiagnosis.shortSummary || '',
    raw_json: JSON.stringify({
      analysis: input.analysis,
      cfi: input.cfi,
      pvt: input.pvt,
      stroop: input.stroop,
      motor: input.motor,
      corsi: input.corsi,
    }),
  });

  // Update current driver status in DB
  db.prepare('UPDATE drivers SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(
    nextStatus,
    targetDriverId
  );

  return db.prepare('SELECT * FROM assessments WHERE id = ?').get(info.lastInsertRowid) as AssessmentRecord;
}
