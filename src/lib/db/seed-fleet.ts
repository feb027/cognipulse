import Database from 'better-sqlite3';

export function seedFleetDataIfNeeded(db: Database.Database) {
  const countRow = db.prepare('SELECT COUNT(*) as count FROM drivers').get() as { count: number };
  if (countRow && countRow.count > 0) return;

  const insertDriver = db.prepare(`
    INSERT INTO drivers (nip, name, age, vehicle_type, license_plate, address, medical_history, status)
    VALUES (@nip, @name, @age, @vehicle_type, @license_plate, @address, @medical_history, @status)
  `);

  const insertTrip = db.prepare(`
    INSERT INTO trip_history (driver_id, route_name, departure_time, arrival_time, distance_km, status, notes)
    VALUES (@driver_id, @route_name, @departure_time, @arrival_time, @distance_km, @status, @notes)
  `);

  const insertAssessment = db.prepare(`
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

  const seedTransaction = db.transaction(() => {
    // 1. Driver Budi Santoso
    const res1 = insertDriver.run({
      nip: 'TRV-001',
      name: 'Budi Santoso',
      age: 38,
      vehicle_type: 'Toyota HiAce Premio Luxury',
      license_plate: 'D 7182 AB',
      address: 'Jl. Dr. Djunjunan No. 142, Pasteur, Bandung',
      medical_history: 'Tidak ada riwayat kronis (Bugar)',
      status: 'ready',
    });
    const d1Id = res1.lastInsertRowid;
    insertTrip.run({ driver_id: d1Id, route_name: 'Bandung Pasteur - Bandara Soetta T3', departure_time: '08:00 WIB', arrival_time: '11:15 WIB', distance_km: 165, status: 'completed', notes: 'Jalur Tol Cipularang & JORR lancar.' });
    insertTrip.run({ driver_id: d1Id, route_name: 'Bandara Soetta - Bandung Pasteur', departure_time: '14:30 WIB', arrival_time: null, distance_km: 165, status: 'scheduled', notes: 'Jadwal penjemputan sore.' });
    insertAssessment.run({
      driver_id: d1Id,
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      cfi_score: 14.5, impairment_tier: 'fit', is_fit_for_duty: 1,
      pvt_mean_rt: 238, pvt_lapses: 0, stroop_accuracy: 96, motor_cadence: 6.4, corsi_max_span: 6,
      braking_distance_meters: 6.6, microsleep_risk: 'rendah', dispatcher_recommendation: 'siap_solo',
      dispatcher_decision: 'dispatched_solo',
      headline_title: 'Refleks Sensorimotor Tajam & Fokus Optimal',
      short_summary: 'Sistem saraf responsif dan daya konsentrasi sangat stabil untuk trayek jarak menengah.',
      raw_json: JSON.stringify({ note: 'Seed baseline' }),
    });

    // 2. Driver Hendra Wijaya
    const res2 = insertDriver.run({
      nip: 'TRV-002',
      name: 'Hendra Wijaya',
      age: 45,
      vehicle_type: 'Toyota Innova Zenix Hybrid',
      license_plate: 'B 2411 SQR',
      address: 'Jl. Tuparev No. 88, Cirebon Barat',
      medical_history: 'Hipertensi Ringan Terkontrol (Konsumsi Amlodipine rutin)',
      status: 'caution',
    });
    const d2Id = res2.lastInsertRowid;
    insertTrip.run({ driver_id: d2Id, route_name: 'Cirebon - Bandung Dipatiukur', departure_time: '06:00 WIB', arrival_time: '09:00 WIB', distance_km: 130, status: 'completed', notes: 'Tol Cisumdawu lancar.' });
    insertAssessment.run({
      driver_id: d2Id,
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      cfi_score: 48.0, impairment_tier: 'mild_fatigue', is_fit_for_duty: 1,
      pvt_mean_rt: 365, pvt_lapses: 2, stroop_accuracy: 82, motor_cadence: 4.8, corsi_max_span: 5,
      braking_distance_meters: 10.1, microsleep_risk: 'waspada', dispatcher_recommendation: 'wajib_co_driver',
      dispatcher_decision: 'co_driver_assigned',
      headline_title: 'Latensi Respon Meningkat: Waspada Bahaya Tol Cisumdawu',
      short_summary: 'Waktu reaksi melambat 127ms di atas batas aman, wajib co-driver atau istirahat 30 menit.',
      raw_json: JSON.stringify({ note: 'Seed caution' }),
    });

    // 3. Driver Asep Sunandar
    const res3 = insertDriver.run({
      nip: 'TRV-003',
      name: 'Asep Sunandar',
      age: 51,
      vehicle_type: 'Isuzu Elf Long Giga',
      license_plate: 'Z 1945 KA',
      address: 'Jl. RE Martadinata No. 54, Indihiang, Tasikmalaya',
      medical_history: 'Riwayat Asma Alergi Dingin & Kurang Tidur (Hanya 3.5 jam)',
      status: 'stand_down',
    });
    const d3Id = res3.lastInsertRowid;
    insertTrip.run({ driver_id: d3Id, route_name: 'Tasikmalaya - Jakarta Semanggi', departure_time: '01:00 WIB', arrival_time: '06:30 WIB', distance_km: 250, status: 'completed', notes: 'Perjalanan malam lintas Gentong.' });
    insertAssessment.run({
      driver_id: d3Id,
      timestamp: new Date(Date.now() - 1800000).toISOString(),
      cfi_score: 82.5, impairment_tier: 'critical_hazard', is_fit_for_duty: 0,
      pvt_mean_rt: 512, pvt_lapses: 5, stroop_accuracy: 64, motor_cadence: 3.1, corsi_max_span: 3,
      braking_distance_meters: 14.2, microsleep_risk: 'kritis', dispatcher_recommendation: 'stand_down',
      dispatcher_decision: 'stand_down_issued',
      headline_title: 'Defisit Atensi Akut: Risiko Fatal Microsleep Tol Cipularang',
      short_summary: 'Terdeteksi 5 kali jeda bengong (lapse) dan jarak pengereman bertambah 7.6 meter. Wajib istirahat tidur.',
      raw_json: JSON.stringify({ note: 'Seed stand_down' }),
    });

    // 4. Driver Dimas Prasetyo
    const res4 = insertDriver.run({
      nip: 'TRV-004',
      name: 'Dimas Prasetyo',
      age: 29,
      vehicle_type: 'Toyota HiAce Commuter',
      license_plate: 'D 1088 TRL',
      address: 'Jl. Ibrahim Adjie No. 201, Kiaracondong, Bandung',
      medical_history: 'Miopia Ringan (Wajib Kacamata saat mengemudi)',
      status: 'ready',
    });
    const d4Id = res4.lastInsertRowid;
    insertTrip.run({ driver_id: d4Id, route_name: 'Bandung Buahbatu - Jakarta Blok M', departure_time: '09:00 WIB', arrival_time: '12:00 WIB', distance_km: 152, status: 'completed', notes: 'Tol MBZ lancar.' });
    insertAssessment.run({
      driver_id: d4Id,
      timestamp: new Date(Date.now() - 5400000).toISOString(),
      cfi_score: 22.0, impairment_tier: 'fit', is_fit_for_duty: 1,
      pvt_mean_rt: 255, pvt_lapses: 0, stroop_accuracy: 92, motor_cadence: 6.1, corsi_max_span: 6,
      braking_distance_meters: 7.1, microsleep_risk: 'rendah', dispatcher_recommendation: 'siap_solo',
      dispatcher_decision: 'dispatched_solo',
      headline_title: 'Kesiapan Mengemudi Tinggi & Koordinasi Baik',
      short_summary: 'Metrik sensorik prima, siap penugasan rute padat tol layang MBZ.',
      raw_json: JSON.stringify({ note: 'Seed ready' }),
    });

    // 5. Driver Wahyu Hidayat
    const res5 = insertDriver.run({
      nip: 'TRV-005',
      name: 'Wahyu Hidayat',
      age: 42,
      vehicle_type: 'Mercedes-Benz Sprinter 315 CDI',
      license_plate: 'B 9021 WPK',
      address: 'Jl. Balai Pustaka Timur No. 12, Rawamangun, Jakarta',
      medical_history: 'Asam Urat Ringan Terkontrol',
      status: 'on_trip',
    });
    const d5Id = res5.lastInsertRowid;
    insertTrip.run({ driver_id: d5Id, route_name: 'Jakarta Rawamangun - Bandung Pasteur', departure_time: '13:00 WIB', arrival_time: null, distance_km: 155, status: 'in_transit', notes: 'Dalam perjalanan arah Bandung.' });
  });

  seedTransaction();
}
