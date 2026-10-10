import { NextRequest } from 'next/server';

/**
 * Verifikasi token sesi dari header Authorization.
 * Token dikirim oleh client sebagai `Bearer drv_<id>_<ts>` atau `Bearer disp_<ts>`.
 * Ini adalah proteksi minimal — token disimpan di sessionStorage client-side.
 * Untuk produksi penuh, ganti dengan JWT yang ditandatangani atau session server-side.
 */
export function verifySessionToken(req: NextRequest): {
  valid: boolean;
  role: 'driver' | 'dispatcher' | null;
} {
  const authHeader = req.headers.get('authorization') || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';

  if (!token) return { valid: false, role: null };

  if (token.startsWith('drv_')) return { valid: true, role: 'driver' };
  if (token.startsWith('disp_')) return { valid: true, role: 'dispatcher' };

  return { valid: false, role: null };
}

export function requireDispatcher(req: NextRequest): boolean {
  const { valid, role } = verifySessionToken(req);
  return valid && role === 'dispatcher';
}
