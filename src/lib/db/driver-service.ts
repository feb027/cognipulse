import { getDatabase } from './database';
import { Driver, DriverWithLatestAssessment, TripHistory, AssessmentRecord } from '@/types/fleet';

export function getAllDrivers(): DriverWithLatestAssessment[] {
  const db = getDatabase();
  const drivers = db.prepare('SELECT * FROM drivers ORDER BY id ASC').all() as Driver[];

  const getLatestAssessment = db.prepare(`
    SELECT * FROM assessments 
    WHERE driver_id = ? 
    ORDER BY timestamp DESC, id DESC 
    LIMIT 1
  `);

  const getActiveTrip = db.prepare(`
    SELECT * FROM trip_history 
    WHERE driver_id = ? 
    ORDER BY id DESC 
    LIMIT 1
  `);

  const countAssessments = db.prepare(`
    SELECT COUNT(*) as count FROM assessments WHERE driver_id = ?
  `);

  return drivers.map((driver) => {
    const latestAssessment = (getLatestAssessment.get(driver.id) as AssessmentRecord) || null;
    const activeTrip = (getActiveTrip.get(driver.id) as TripHistory) || null;
    const countRow = countAssessments.get(driver.id) as { count: number };
    return {
      ...driver,
      latestAssessment,
      activeTrip,
      assessmentsCount: countRow?.count || 0,
    };
  });
}

export function getDriverByNip(nip: string): DriverWithLatestAssessment | null {
  const db = getDatabase();
  const driver = db.prepare('SELECT * FROM drivers WHERE nip = ?').get(nip) as Driver | undefined;
  if (!driver) return null;

  const latestAssessment = db.prepare(`
    SELECT * FROM assessments WHERE driver_id = ? ORDER BY timestamp DESC, id DESC LIMIT 1
  `).get(driver.id) as AssessmentRecord | undefined;

  const recentTrips = db.prepare(`
    SELECT * FROM trip_history WHERE driver_id = ? ORDER BY id DESC LIMIT 5
  `).all(driver.id) as TripHistory[];

  return {
    ...driver,
    latestAssessment: latestAssessment || null,
    activeTrip: recentTrips[0] || null,
    recentTrips,
  };
}

export function createDriver(data: {
  nip: string;
  name: string;
  age: number;
  vehicle_type: string;
  license_plate: string;
  address: string;
  medical_history: string;
  status?: string;
}): Driver {
  const db = getDatabase();
  const stmt = db.prepare(`
    INSERT INTO drivers (nip, name, age, vehicle_type, license_plate, address, medical_history, status)
    VALUES (@nip, @name, @age, @vehicle_type, @license_plate, @address, @medical_history, @status)
  `);

  const info = stmt.run({
    nip: data.nip.trim().toUpperCase(),
    name: data.name.trim(),
    age: data.age,
    vehicle_type: data.vehicle_type.trim(),
    license_plate: data.license_plate.trim().toUpperCase(),
    address: data.address.trim(),
    medical_history: data.medical_history.trim() || 'Tidak ada riwayat kronis',
    status: data.status || 'ready',
  });

  return db.prepare('SELECT * FROM drivers WHERE id = ?').get(info.lastInsertRowid) as Driver;
}
