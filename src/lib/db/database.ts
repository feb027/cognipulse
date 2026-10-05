import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { seedFleetDataIfNeeded } from './seed-fleet';

let dbInstance: Database.Database | null = null;

export function getDatabase(): Database.Database {
  if (dbInstance) return dbInstance;

  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const dbPath = path.join(dataDir, 'travel_fleet.db');
  dbInstance = new Database(dbPath);

  // WAL mode for fast concurrent reads and writes
  dbInstance.pragma('journal_mode = WAL');
  dbInstance.pragma('foreign_keys = ON');

  initSchema(dbInstance);
  try {
    seedFleetDataIfNeeded(dbInstance);
  } catch (err) {
    console.error('Failed to seed fleet data:', err);
  }
  return dbInstance;
}

function initSchema(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS drivers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nip TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      age INTEGER NOT NULL,
      vehicle_type TEXT NOT NULL,
      license_plate TEXT NOT NULL,
      address TEXT NOT NULL,
      medical_history TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'ready',
      pin TEXT NOT NULL DEFAULT '1234',
      avatar TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS trip_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      driver_id INTEGER NOT NULL REFERENCES drivers(id) ON DELETE CASCADE,
      route_name TEXT NOT NULL,
      departure_time TEXT NOT NULL,
      arrival_time TEXT,
      distance_km REAL NOT NULL,
      status TEXT NOT NULL DEFAULT 'completed',
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS assessments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      driver_id INTEGER NOT NULL REFERENCES drivers(id) ON DELETE CASCADE,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      cfi_score REAL NOT NULL,
      impairment_tier TEXT NOT NULL,
      is_fit_for_duty INTEGER NOT NULL,
      pvt_mean_rt REAL NOT NULL,
      pvt_lapses INTEGER NOT NULL,
      stroop_accuracy REAL NOT NULL,
      motor_cadence REAL NOT NULL,
      corsi_max_span INTEGER,
      braking_distance_meters REAL NOT NULL,
      microsleep_risk TEXT NOT NULL,
      dispatcher_recommendation TEXT NOT NULL,
      dispatcher_decision TEXT DEFAULT 'pending',
      dispatcher_notes TEXT,
      headline_title TEXT,
      short_summary TEXT,
      raw_json TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_drivers_nip ON drivers(nip);
    CREATE INDEX IF NOT EXISTS idx_assessments_driver ON assessments(driver_id);
    CREATE INDEX IF NOT EXISTS idx_trips_driver ON trip_history(driver_id);
  `);

  try {
    db.exec("ALTER TABLE drivers ADD COLUMN pin TEXT DEFAULT '1234'");
  } catch {
    // Column already exists
  }
}
