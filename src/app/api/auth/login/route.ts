import { NextRequest, NextResponse } from 'next/server';
import { validateDriverLogin, validateDispatcherLogin } from '@/lib/db/driver-service';
import { AuthSession } from '@/types/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { role } = body;

    if (role === 'driver') {
      const { nip, pin } = body;
      if (!nip || !pin) {
        return NextResponse.json({ error: 'NIP dan PIN wajib diisi' }, { status: 400 });
      }

      const driver = validateDriverLogin(nip, pin);
      if (!driver) {
        return NextResponse.json({ error: 'NIP atau PIN supir tidak valid' }, { status: 401 });
      }

      const session: AuthSession = {
        role: 'driver',
        driver,
        token: `drv_${driver.id}_${Date.now()}`,
      };

      return NextResponse.json({ success: true, session });
    }

    if (role === 'dispatcher') {
      const { username, password } = body;
      if (!username || !password) {
        return NextResponse.json({ error: 'Username dan Password wajib diisi' }, { status: 400 });
      }

      const dispatcher = validateDispatcherLogin(username, password);
      if (!dispatcher) {
        return NextResponse.json({ error: 'Username atau Password dispatcher salah' }, { status: 401 });
      }

      const session: AuthSession = {
        role: 'dispatcher',
        username: dispatcher.username,
        name: dispatcher.name,
        token: `disp_${Date.now()}`,
      };

      return NextResponse.json({ success: true, session });
    }

    return NextResponse.json({ error: 'Peran akun tidak valid' }, { status: 400 });
  } catch (err) {
    console.error('Error in /api/auth/login:', err);
    return NextResponse.json({ error: 'Terjadi kesalahan sistem' }, { status: 500 });
  }
}
