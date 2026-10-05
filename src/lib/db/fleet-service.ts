import { getDatabase } from './database';
import { FleetSummary, Driver, AssessmentRecord, TripHistory, DriverStatus, DispatcherDecision } from '@/types/fleet';

export function getFleetSummary(): FleetSummary {
  const db = getDatabase();

  const drivers = db.prepare('SELECT status FROM drivers').all() as { status: string }[];
  const totalDrivers = drivers.length;
  const readyCount = drivers.filter((d) => d.status === 'ready').length;
  const cautionCount = drivers.filter((d) => d.status === 'caution').length;
  const standDownCount = drivers.filter((d) => d.status === 'stand_down').length;
  const onTripCount = drivers.filter((d) => d.status === 'on_trip').length;

  const avgStats = db.prepare(`
    SELECT AVG(pvt_mean_rt) as avg_rt, AVG(braking_distance_meters) as avg_braking
    FROM (
      SELECT a.pvt_mean_rt, a.braking_distance_meters
      FROM assessments a
      INNER JOIN (
        SELECT driver_id, MAX(id) as max_id
        FROM assessments
        GROUP BY driver_id
      ) latest ON a.id = latest.max_id
    )
  `).get() as { avg_rt: number | null; avg_braking: number | null };

  const avgReactionTimeMs = Math.round(avgStats?.avg_rt || 260);
  const avgBrakingDistanceMeters = parseFloat((avgStats?.avg_braking || 7.2).toFixed(1));

  let fleetAlertLevel: FleetSummary['fleetAlertLevel'] = 'optimal';
  if (standDownCount > 0 || cautionCount >= 2) {
    fleetAlertLevel = 'high_risk';
  } else if (cautionCount > 0) {
    fleetAlertLevel = 'elevated';
  }

  return {
    totalDrivers,
    readyCount,
    cautionCount,
    standDownCount,
    onTripCount,
    avgReactionTimeMs,
    avgBrakingDistanceMeters,
    fleetAlertLevel,
  };
}

export function updateDriverStatus(driverId: number, status: DriverStatus): boolean {
  const db = getDatabase();
  const res = db.prepare('UPDATE drivers SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(status, driverId);
  return res.changes > 0;
}

export function updateDispatcherDecision(
  assessmentId: number,
  decision: DispatcherDecision,
  notes?: string
): boolean {
  const db = getDatabase();
  const res = db.prepare(`
    UPDATE assessments 
    SET dispatcher_decision = ?, dispatcher_notes = COALESCE(?, dispatcher_notes)
    WHERE id = ?
  `).run(decision, notes || null, assessmentId);
  return res.changes > 0;
}

export function getDriverFullInspection(driverId: number) {
  const db = getDatabase();
  const driver = db.prepare('SELECT * FROM drivers WHERE id = ?').get(driverId) as Driver | undefined;
  if (!driver) return null;

  const assessments = db.prepare(`
    SELECT * FROM assessments WHERE driver_id = ? ORDER BY timestamp DESC, id DESC
  `).all(driverId) as AssessmentRecord[];

  const trips = db.prepare(`
    SELECT * FROM trip_history WHERE driver_id = ? ORDER BY id DESC
  `).all(driverId) as TripHistory[];

  return {
    driver,
    assessments,
    trips,
    latestAssessment: assessments[0] || null,
  };
}
