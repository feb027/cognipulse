import fs from 'fs';
import path from 'path';

export interface DatabaseState {
  drivers: any[];
  dispatchers: any[];
  trip_history: any[];
  assessments: any[];
}

const DATA_FILE = path.join(process.cwd(), 'data', 'travel_fleet.json');

function loadState(): DatabaseState {
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, 'utf-8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.error('Failed to read travel_fleet.json:', err);
  }
  return { drivers: [], dispatchers: [], trip_history: [], assessments: [] };
}

function saveState(state: DatabaseState) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(state, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to save travel_fleet.json:', err);
  }
}

let globalState = loadState();

export class JsonDatabase {
  pragma() {}
  exec() {}
  transaction<T extends (...args: any[]) => any>(fn: T): T {
    return ((...args: any[]) => fn(...args)) as T;
  }

  prepare(sql: string) {
    const cleanSql = sql.replace(/\s+/g, ' ').trim();
    return {
      run: (...params: any[]) => this.executeRun(cleanSql, params),
      get: (...params: any[]) => this.executeGet(cleanSql, params),
      all: (...params: any[]) => this.executeAll(cleanSql, params),
    };
  }

  private executeRun(sql: string, params: any[]): { changes: number; lastInsertRowid: number } {
    const firstParam = params[0];
    const isNamed = firstParam && typeof firstParam === 'object' && !Array.isArray(firstParam);

    if (sql.includes('INSERT INTO drivers')) {
      const p = isNamed ? firstParam : {};
      const newId = (globalState.drivers.length ? Math.max(...globalState.drivers.map((d) => d.id)) : 0) + 1;
      const driver = {
        id: newId,
        nip: (p.nip || params[0] || '').toUpperCase().trim(),
        name: p.name || params[1] || '',
        age: Number(p.age || params[2] || 30),
        vehicle_type: p.vehicle_type || params[3] || '',
        license_plate: (p.license_plate || params[4] || '').toUpperCase().trim(),
        address: p.address || params[5] || '',
        medical_history: p.medical_history || params[6] || 'Tidak ada riwayat kronis',
        status: p.status || params[7] || 'ready',
        pin: p.pin || params[8] || '1234',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      globalState.drivers.push(driver);
      saveState(globalState);
      return { changes: 1, lastInsertRowid: newId };
    }

    if (sql.includes('INSERT INTO trip_history')) {
      const p = isNamed ? firstParam : {};
      const newId = (globalState.trip_history.length ? Math.max(...globalState.trip_history.map((t) => t.id)) : 0) + 1;
      const trip = {
        id: newId,
        driver_id: p.driver_id ?? params[0],
        route_name: p.route_name || params[1] || '',
        departure_time: p.departure_time || params[2] || '',
        arrival_time: p.arrival_time ?? params[3] ?? null,
        distance_km: Number(p.distance_km || params[4] || 0),
        status: p.status || params[5] || 'completed',
        notes: p.notes || params[6] || '',
        created_at: new Date().toISOString(),
      };
      globalState.trip_history.push(trip);
      saveState(globalState);
      return { changes: 1, lastInsertRowid: newId };
    }

    if (sql.includes('INSERT INTO assessments')) {
      const p = isNamed ? firstParam : {};
      const newId = (globalState.assessments.length ? Math.max(...globalState.assessments.map((a) => a.id)) : 0) + 1;
      const ass = {
        id: newId,
        driver_id: p.driver_id ?? params[0],
        timestamp: p.timestamp || new Date().toISOString(),
        cfi_score: Number(p.cfi_score || 0),
        impairment_tier: p.impairment_tier || 'fit',
        is_fit_for_duty: Number(p.is_fit_for_duty ?? 1),
        pvt_mean_rt: Number(p.pvt_mean_rt || 240),
        pvt_lapses: Number(p.pvt_lapses || 0),
        stroop_accuracy: Number(p.stroop_accuracy || 100),
        motor_cadence: Number(p.motor_cadence || 6),
        corsi_max_span: Number(p.corsi_max_span || 6),
        braking_distance_meters: Number(p.braking_distance_meters || 7),
        microsleep_risk: p.microsleep_risk || 'rendah',
        dispatcher_recommendation: p.dispatcher_recommendation || 'siap_solo',
        dispatcher_decision: p.dispatcher_decision || 'pending',
        dispatcher_notes: p.dispatcher_notes || null,
        headline_title: p.headline_title || '',
        short_summary: p.short_summary || '',
        raw_json: p.raw_json || '{}',
      };
      globalState.assessments.push(ass);
      saveState(globalState);
      return { changes: 1, lastInsertRowid: newId };
    }

    if (sql.includes('INSERT INTO dispatchers')) {
      const p = isNamed ? firstParam : {};
      const newId = (globalState.dispatchers.length ? Math.max(...globalState.dispatchers.map((d) => d.id)) : 0) + 1;
      const disp = {
        id: newId,
        username: p.username || params[0] || 'admin',
        password: p.password || params[1] || 'admin123',
        name: p.name || params[2] || 'Dispatcher Operasional Pusat',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      globalState.dispatchers.push(disp);
      saveState(globalState);
      return { changes: 1, lastInsertRowid: newId };
    }

    if (sql.includes('UPDATE drivers SET pin =')) {
      const [pin, driverId] = params;
      const target = globalState.drivers.find((d) => d.id === Number(driverId));
      if (target) {
        target.pin = String(pin).trim();
        target.updated_at = new Date().toISOString();
        saveState(globalState);
        return { changes: 1, lastInsertRowid: target.id };
      }
    }

    if (sql.includes('UPDATE drivers SET status =')) {
      const [status, driverId] = params;
      const target = globalState.drivers.find((d) => d.id === Number(driverId));
      if (target) {
        target.status = status;
        target.updated_at = new Date().toISOString();
        saveState(globalState);
        return { changes: 1, lastInsertRowid: target.id };
      }
    }

    if (sql.includes('UPDATE drivers SET')) {
      const isNamed = firstParam && typeof firstParam === 'object' && !Array.isArray(firstParam);
      if (isNamed) {
        const target = globalState.drivers.find((d) => d.id === Number(firstParam.id));
        if (target) {
          if (firstParam.name !== undefined) target.name = firstParam.name;
          if (firstParam.age !== undefined) target.age = Number(firstParam.age);
          if (firstParam.vehicle_type !== undefined) target.vehicle_type = firstParam.vehicle_type;
          if (firstParam.license_plate !== undefined) target.license_plate = firstParam.license_plate;
          if (firstParam.address !== undefined) target.address = firstParam.address;
          if (firstParam.medical_history !== undefined) target.medical_history = firstParam.medical_history;
          if (firstParam.status !== undefined) target.status = firstParam.status;
          if (firstParam.pin !== undefined) target.pin = String(firstParam.pin).trim();
          target.updated_at = new Date().toISOString();
          saveState(globalState);
          return { changes: 1, lastInsertRowid: target.id };
        }
      } else {
        const id = params[params.length - 1];
        const target = globalState.drivers.find((d) => d.id === Number(id));
        if (target) {
          if (params[0] !== undefined) target.name = params[0];
          if (params[1] !== undefined) target.age = Number(params[1]);
          if (params[2] !== undefined) target.vehicle_type = params[2];
          if (params[3] !== undefined) target.license_plate = params[3];
          if (params[4] !== undefined) target.address = params[4];
          if (params[5] !== undefined) target.medical_history = params[5];
          if (params[6] !== undefined) target.status = params[6];
          target.updated_at = new Date().toISOString();
          saveState(globalState);
          return { changes: 1, lastInsertRowid: target.id };
        }
      }
    }

    if (sql.includes('DELETE FROM drivers WHERE id =')) {
      const driverId = Number(params[0]);
      const initialLen = globalState.drivers.length;
      globalState.drivers = globalState.drivers.filter((d) => d.id !== driverId);
      globalState.assessments = globalState.assessments.filter((a) => a.driver_id !== driverId);
      globalState.trip_history = globalState.trip_history.filter((t) => t.driver_id !== driverId);
      saveState(globalState);
      return { changes: initialLen - globalState.drivers.length, lastInsertRowid: 0 };
    }

    if (sql.includes('UPDATE dispatchers')) {
      const [username, password, name, id] = params;
      const target = globalState.dispatchers.find((d) => d.id === Number(id));
      if (target) {
        target.username = username;
        target.password = password;
        target.name = name;
        target.updated_at = new Date().toISOString();
        saveState(globalState);
        return { changes: 1, lastInsertRowid: target.id };
      }
    }

    if (sql.includes('UPDATE assessments SET dispatcher_decision =')) {
      const [decision, notes, id] = params;
      const target = globalState.assessments.find((a) => a.id === Number(id));
      if (target) {
        target.dispatcher_decision = decision;
        if (notes) target.dispatcher_notes = notes;
        saveState(globalState);
        return { changes: 1, lastInsertRowid: target.id };
      }
    }

    return { changes: 0, lastInsertRowid: 0 };
  }

  private executeGet(sql: string, params: any[]): any {
    if (sql.includes('SELECT COUNT(*) as count FROM drivers')) {
      return { count: globalState.drivers.length };
    }
    if (sql.includes('SELECT COUNT(*) as count FROM dispatchers')) {
      return { count: globalState.dispatchers.length };
    }
    if (sql.includes('SELECT COUNT(*) as count FROM assessments WHERE driver_id = ?')) {
      const driverId = Number(params[0]);
      return { count: globalState.assessments.filter((a) => a.driver_id === driverId).length };
    }
    if (sql.includes('SELECT pin FROM drivers WHERE nip = ?')) {
      const nip = String(params[0] || '').toUpperCase();
      const driver = globalState.drivers.find((d) => d.nip.toUpperCase() === nip);
      return driver ? { pin: driver.pin || '1234' } : undefined;
    }
    if (sql.includes('SELECT * FROM drivers WHERE nip = ?')) {
      const nip = String(params[0] || '').toUpperCase();
      return globalState.drivers.find((d) => d.nip.toUpperCase() === nip);
    }
    if (sql.includes('SELECT * FROM drivers WHERE id = ?')) {
      const id = Number(params[0]);
      return globalState.drivers.find((d) => d.id === id);
    }
    if (sql.includes('SELECT id FROM drivers WHERE nip = ?')) {
      const nip = String(params[0] || '').toUpperCase();
      const driver = globalState.drivers.find((d) => d.nip.toUpperCase() === nip);
      return driver ? { id: driver.id } : undefined;
    }
    if (sql.includes('SELECT id FROM drivers ORDER BY id ASC LIMIT 1')) {
      return globalState.drivers[0] ? { id: globalState.drivers[0].id } : undefined;
    }
    if (sql.includes('SELECT * FROM assessments WHERE driver_id = ? ORDER BY timestamp DESC, id DESC LIMIT 1')) {
      const driverId = Number(params[0]);
      const list = globalState.assessments
        .filter((a) => a.driver_id === driverId)
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime() || b.id - a.id);
      return list[0];
    }
    if (sql.includes('SELECT * FROM assessments WHERE id = ?')) {
      const id = Number(params[0]);
      return globalState.assessments.find((a) => a.id === id);
    }
    if (sql.includes('SELECT AVG(pvt_mean_rt)')) {
      if (!globalState.assessments.length) return { avg_rt: 260, avg_braking: 7.2 };
      const totalRt = globalState.assessments.reduce((acc, a) => acc + (a.pvt_mean_rt || 260), 0);
      const totalBr = globalState.assessments.reduce((acc, a) => acc + (a.braking_distance_meters || 7.2), 0);
      return {
        avg_rt: Math.round(totalRt / globalState.assessments.length),
        avg_braking: parseFloat((totalBr / globalState.assessments.length).toFixed(1)),
      };
    }
    if (sql.includes('FROM dispatchers WHERE LOWER(username) = ?')) {
      const u = String(params[0] || '').toLowerCase();
      const found = globalState.dispatchers.find((d) => d.username.toLowerCase() === u);
      if (found) return found;
      if (u === 'admin') return { id: 1, username: 'admin', password: 'admin123', name: 'Dispatcher Operasional Pusat' };
      return undefined;
    }
    return undefined;
  }

  private executeAll(sql: string, params: any[]): any[] {
    if (sql.includes('SELECT * FROM drivers ORDER BY id ASC') || sql.includes('SELECT * FROM drivers')) {
      return [...globalState.drivers].sort((a, b) => a.id - b.id);
    }
    if (sql.includes('SELECT status FROM drivers')) {
      return globalState.drivers.map((d) => ({ status: d.status }));
    }
    if (sql.includes('FROM trip_history WHERE driver_id = ?')) {
      const driverId = Number(params[0]);
      const list = globalState.trip_history.filter((t) => t.driver_id === driverId).sort((a, b) => b.id - a.id);
      if (sql.includes('LIMIT 1')) return list.slice(0, 1);
      if (sql.includes('LIMIT 5')) return list.slice(0, 5);
      return list;
    }
    if (sql.includes('FROM assessments WHERE driver_id = ?')) {
      const driverId = Number(params[0]);
      return globalState.assessments
        .filter((a) => a.driver_id === driverId)
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }
    return [];
  }
}
