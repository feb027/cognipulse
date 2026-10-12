import { describe, it, expect } from 'vitest';
import { NextRequest } from 'next/server';
import { createSessionToken, verifySessionToken, requireDispatcher } from '../src/lib/api-auth';
import { getDriverFullInspection } from '../src/lib/db/fleet-service';
import { stripPin } from '../src/lib/db/driver-service';

function makeRequestWithToken(token?: string): NextRequest {
  const headers = new Headers();
  if (token) {
    headers.set('authorization', `Bearer ${token}`);
  }
  return new NextRequest('http://localhost:3000/api/test', { headers });
}

describe('Session Security & Cryptographic Token Verification', () => {
  it('berhasil memvalidasi token dispatcher bertanda tangan HMAC', () => {
    const token = createSessionToken('dispatcher');
    expect(token).toMatch(/^disp_[a-z0-9]+_[a-f0-9]{16}$/);

    const req = makeRequestWithToken(token);
    const res = verifySessionToken(req);
    expect(res.valid).toBe(true);
    expect(res.role).toBe('dispatcher');
    expect(requireDispatcher(req)).toBe(true);
  });

  it('berhasil memvalidasi token supir bertanda tangan HMAC dengan ID driver', () => {
    const token = createSessionToken('driver', 42);
    expect(token).toMatch(/^drv_42_[a-z0-9]+_[a-f0-9]{16}$/);

    const req = makeRequestWithToken(token);
    const res = verifySessionToken(req);
    expect(res.valid).toBe(true);
    expect(res.role).toBe('driver');
    expect(res.driverId).toBe(42);
    expect(requireDispatcher(req)).toBe(false);
  });

  it('menolak token palsu tanpa tanda tangan yang sah (anti pemalsuan)', () => {
    // Token awalan disp_ tapi tanda tangan salah / tanpa tanda tangan
    const fakeTokens = [
      'disp_123',
      'disp_fake_signature',
      'disp_99999999_deadbeef12345678',
      'drv_1_123',
      'drv_1_99999999_fakehash1234567',
      '',
    ];

    for (const fake of fakeTokens) {
      const req = makeRequestWithToken(fake);
      const res = verifySessionToken(req);
      expect(res.valid).toBe(false);
      expect(res.role).toBeNull();
      expect(requireDispatcher(req)).toBe(false);
    }
  });

  it('menjamin field PIN tidak pernah bocor pada getDriverFullInspection', () => {
    const inspection = getDriverFullInspection(1);
    expect(inspection).not.toBeNull();
    if (inspection) {
      expect(inspection.driver).toBeDefined();
      expect((inspection.driver as any).pin).toBeUndefined();
    }
  });

  it('fungsi stripPin membersihkan field PIN dengan aman', () => {
    const testObj = { id: 1, name: 'Budi', pin: '1234', role: 'driver' };
    const stripped = stripPin(testObj);
    expect(stripped).toEqual({ id: 1, name: 'Budi', role: 'driver' });
    expect((stripped as any).pin).toBeUndefined();
  });
});
