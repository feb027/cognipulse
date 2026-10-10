import { getDatabase } from './database';

export interface DispatcherRecord {
  id: number;
  username: string;
  name: string;
  password?: string;
  created_at?: string;
  updated_at?: string;
}

export function validateDispatcherLogin(username: string, pass: string): { username: string; name: string } | null {
  const normalizedUser = username.trim().toLowerCase();
  const trimmedPass = pass.trim();

  // Kredensial akun admin TETAP (selalu valid dan tidak akan terganggu)
  if (normalizedUser === 'admin' && trimmedPass === 'admin123') {
    return { username: 'admin', name: 'Dispatcher Operasional Pusat' };
  }

  // Periksa jika ada akun dispatcher kustom tersimpan di database
  try {
    const db = getDatabase();
    const stmt = db.prepare('SELECT * FROM dispatchers WHERE LOWER(username) = ?');
    const record = stmt.get(normalizedUser) as DispatcherRecord | undefined;

    if (record && record.password && record.password === trimmedPass) {
      return { username: record.username, name: record.name };
    }
  } catch (err) {
    console.error('Error validating dispatcher login from db:', err);
  }

  return null;
}

export function getDispatcherProfile(username: string): { username: string; name: string } | null {
  const db = getDatabase();
  const normalizedUser = username.trim().toLowerCase();
  const stmt = db.prepare('SELECT username, name FROM dispatchers WHERE LOWER(username) = ?');
  const record = stmt.get(normalizedUser) as { username: string; name: string } | undefined;

  if (!record) {
    if (normalizedUser === 'admin') {
      return { username: 'admin', name: 'Dispatcher Operasional Pusat' };
    }
    return null;
  }

  return record;
}

export function updateDispatcherCredentials(params: {
  currentUsername: string;
  currentPassword?: string;
  newUsername?: string;
  newPassword?: string;
  newName?: string;
}): { success: boolean; error?: string; dispatcher?: { username: string; name: string } } {
  const db = getDatabase();
  const currentNormalized = params.currentUsername.trim().toLowerCase();

  const existing = db.prepare('SELECT * FROM dispatchers WHERE LOWER(username) = ?').get(currentNormalized) as DispatcherRecord | undefined;

  // Jika belum ada di tabel, insert fallback default dulu
  if (!existing) {
    if (currentNormalized === 'admin') {
      db.prepare("INSERT INTO dispatchers (username, password, name) VALUES ('admin', 'admin123', 'Dispatcher Operasional Pusat')").run();
    } else {
      return { success: false, error: 'Akun dispatcher tidak ditemukan' };
    }
  }

  const currentRecord = db.prepare('SELECT * FROM dispatchers WHERE LOWER(username) = ?').get(currentNormalized) as DispatcherRecord;

  // Verifikasi kata sandi saat ini jika diberikan
  if (params.currentPassword && currentRecord.password !== params.currentPassword.trim()) {
    return { success: false, error: 'Kata sandi saat ini tidak cocok' };
  }

  const targetUsername = params.newUsername ? params.newUsername.trim() : currentRecord.username;
  const targetPassword = params.newPassword ? params.newPassword.trim() : currentRecord.password;
  const targetName = params.newName ? params.newName.trim() : currentRecord.name;

  // Jika username berubah, pastikan username baru belum dipakai akun lain
  if (params.newUsername && params.newUsername.trim().toLowerCase() !== currentNormalized) {
    const checkDuplicate = db.prepare('SELECT id FROM dispatchers WHERE LOWER(username) = ? AND id != ?').get(
      params.newUsername.trim().toLowerCase(),
      currentRecord.id
    );
    if (checkDuplicate) {
      return { success: false, error: 'Username baru sudah digunakan akun lain' };
    }
  }

  db.prepare(`
    UPDATE dispatchers
    SET username = ?, password = ?, name = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(targetUsername, targetPassword, targetName, currentRecord.id);

  return {
    success: true,
    dispatcher: {
      username: targetUsername,
      name: targetName,
    },
  };
}
