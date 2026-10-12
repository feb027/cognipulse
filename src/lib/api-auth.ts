import { NextRequest } from 'next/server';
import crypto from 'crypto';

const SESSION_SECRET = process.env.SESSION_SECRET || 'cognipulse-travel-session-hmac-2026';

function sign(payload: string): string {
  return crypto.createHmac('sha256', SESSION_SECRET).update(payload).digest('hex').slice(0, 16);
}

/**
 * Buat token sesi bertanda tangan (HMAC-SHA256).
 */
export function createSessionToken(role: 'dispatcher' | 'driver', identifier?: string | number): string {
  const ts = Date.now().toString(36);
  if (role === 'dispatcher') {
    const payload = `disp_${ts}`;
    return `${payload}_${sign(payload)}`;
  }
  const payload = `drv_${identifier ?? '0'}_${ts}`;
  return `${payload}_${sign(payload)}`;
}

export interface SessionVerificationResult {
  valid: boolean;
  role: 'driver' | 'dispatcher' | null;
  driverId?: number;
}

/**
 * Verifikasi token sesi dari header Authorization.
 * Format token bertanda tangan:
 * - Dispatcher: Bearer disp_<ts>_<sig>
 * - Driver: Bearer drv_<id>_<ts>_<sig>
 */
export function verifySessionToken(req: NextRequest): SessionVerificationResult {
  const authHeader = req.headers.get('authorization') || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';

  if (!token) return { valid: false, role: null };

  const parts = token.split('_');

  // Dispatcher: disp_<ts>_<sig>
  if (parts[0] === 'disp' && parts.length === 3) {
    const [prefix, ts, sig] = parts;
    const expectedSig = sign(`${prefix}_${ts}`);
    if (sig === expectedSig) {
      return { valid: true, role: 'dispatcher' };
    }
    return { valid: false, role: null };
  }

  // Driver: drv_<id>_<ts>_<sig>
  if (parts[0] === 'drv' && parts.length === 4) {
    const [prefix, id, ts, sig] = parts;
    const expectedSig = sign(`${prefix}_${id}_${ts}`);
    if (sig === expectedSig) {
      return { valid: true, role: 'driver', driverId: Number(id) };
    }
    return { valid: false, role: null };
  }

  return { valid: false, role: null };
}

export function requireDispatcher(req: NextRequest): boolean {
  const { valid, role } = verifySessionToken(req);
  return valid && role === 'dispatcher';
}

export function requireAuth(req: NextRequest): SessionVerificationResult {
  return verifySessionToken(req);
}
