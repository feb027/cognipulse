import { getDatabase } from './database';
import { Driver, DriverWithLatestAssessment, TripHistory, AssessmentRecord } from '@/types/fleet';
import { validateDispatcherLogin as validateDispatcherLoginCore } from './dispatcher-service';

/** Hapus field `pin` sebelum data driver dikirim keluar server. */
function stripPin<T extends Record<string, unknown>>(obj: T): Omit<T, 'pin'> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { pin, ...safe } = obj as T & { pin?: unknown };
  return safe as Omit<T, 'pin'>;
}

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
    return stripPin({
      ...driver,
      latestAssessment,
      activeTrip,
      assessmentsCount: countRow?.count || 0,
    });
  }) as DriverWithLatestAssessment[];
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

  return stripPin({
    ...driver,
    latestAssessment: latestAssessment || null,
    activeTrip: recentTrips[0] || null,
    recentTrips,
  }) as DriverWithLatestAssessment;
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
  pin?: string;
}): Driver {
  const db = getDatabase();
  const stmt = db.prepare(`
    INSERT INTO drivers (nip, name, age, vehicle_type, license_plate, address, medical_history, status, pin)
    VALUES (@nip, @name, @age, @vehicle_type, @license_plate, @address, @medical_history, @status, @pin)
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
    pin: data.pin?.trim() || '1234',
  });

  const created = db.prepare('SELECT * FROM drivers WHERE id = ?').get(info.lastInsertRowid) as Driver;
  return stripPin(created) as Driver;
}

export function validateDriverLogin(nip: string, pin: string): DriverWithLatestAssessment | null {
  const normalizedNip = nip.trim().toUpperCase();
  const db = getDatabase();
  const raw = db.prepare('SELECT pin FROM drivers WHERE nip = ?').get(normalizedNip) as { pin?: string } | undefined;
  if (!raw) return null;

  const validPin = raw.pin || '1234';
  if (pin.trim() === validPin) {
    return getDriverByNip(normalizedNip);
  }
  return null;
}

export function validateDispatcherLogin(username: string, pass: string): { username: string; name: string } | null {
  return validateDispatcherLoginCore(username, pass);
}

export function getAllDriversForAdmin(): (DriverWithLatestAssessment & { pin: string })[] {
  const db = getDatabase();
  const drivers = db.prepare('SELECT * FROM drivers ORDER BY id ASC').all() as (Driver & { pin: string })[];

  return drivers.map((driver) => {
    const latestAssessment = db.prepare(`
      SELECT * FROM assessments WHERE driver_id = ? ORDER BY timestamp DESC, id DESC LIMIT 1
    `).get(driver.id) as AssessmentRecord | undefined;

    return {
      ...driver,
      pin: driver.pin || '1234',
      latestAssessment: latestAssessment || null,
      activeTrip: null,
      assessmentsCount: 0,
    };
  });
}

export function updateDriver(
  id: number,
  data: {
    name?: string;
    age?: number;
    vehicle_type?: string;
    license_plate?: string;
    address?: string;
    medical_history?: string;
    status?: string;
    pin?: string;
  }
): Driver | null {
  const db = getDatabase();
  const current = db.prepare('SELECT * FROM drivers WHERE id = ?').get(id) as Driver & { pin?: string };
  if (!current) return null;

  const updatedName = data.name !== undefined ? data.name.trim() : current.name;
  const updatedAge = data.age !== undefined ? Number(data.age) : current.age;
  const updatedVeh = data.vehicle_type !== undefined ? data.vehicle_type.trim() : current.vehicle_type;
  const updatedPlate = data.license_plate !== undefined ? data.license_plate.toUpperCase().trim() : current.license_plate;
  const updatedAddr = data.address !== undefined ? data.address.trim() : current.address;
  const updatedMed = data.medical_history !== undefined ? data.medical_history.trim() : current.medical_history;
  const updatedStatus = data.status !== undefined ? data.status : current.status;
  const updatedPin = data.pin !== undefined ? String(data.pin).trim() : (current.pin || '1234');

  db.prepare(`
    UPDATE drivers 
    SET name = ?, age = ?, vehicle_type = ?, license_plate = ?, address = ?, medical_history = ?, status = ?, pin = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(updatedName, updatedAge, updatedVeh, updatedPlate, updatedAddr, updatedMed, updatedStatus, updatedPin, id);

  const updated = db.prepare('SELECT * FROM drivers WHERE id = ?').get(id) as Driver;
  return stripPin(updated) as Driver;
}

export function updateDriverPin(id: number, newPin: string): boolean {
  const db = getDatabase();
  const res = db.prepare('UPDATE drivers SET pin = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(newPin.trim(), id);
  return (res?.changes ?? 0) > 0;
}

export function deleteDriver(id: number): boolean {
  const db = getDatabase();
  const res = db.prepare('DELETE FROM drivers WHERE id = ?').run(id);
  return (res?.changes ?? 0) > 0;
}
