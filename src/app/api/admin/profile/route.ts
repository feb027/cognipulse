import { NextRequest, NextResponse } from 'next/server';
import { requireDispatcher } from '@/lib/api-auth';
import { getDispatcherProfile, updateDispatcherCredentials } from '@/lib/db/dispatcher-service';

export async function GET(req: NextRequest) {
  try {
    if (!requireDispatcher(req)) {
      return NextResponse.json({ error: 'Akses ditolak: Hanya dispatcher yang diizinkan' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const username = searchParams.get('username') || 'admin';
    const profile = getDispatcherProfile(username);

    if (!profile) {
      return NextResponse.json({ error: 'Profil admin tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json({ profile });
  } catch (err) {
    console.error('Error in GET /api/admin/profile:', err);
    return NextResponse.json({ error: 'Gagal memuat profil admin' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    if (!requireDispatcher(req)) {
      return NextResponse.json({ error: 'Akses ditolak: Hanya dispatcher yang diizinkan' }, { status: 403 });
    }

    const body = await req.json();
    const { currentUsername, currentPassword, newUsername, newPassword, newName } = body;

    if (!currentUsername) {
      return NextResponse.json({ error: 'Username admin saat ini wajib disertakan' }, { status: 400 });
    }

    if (!currentPassword && (newPassword || newUsername)) {
      return NextResponse.json(
        { error: 'Kata sandi saat ini wajib diisi untuk mengubah username atau kata sandi' },
        { status: 400 }
      );
    }

    const result = updateDispatcherCredentials({
      currentUsername,
      currentPassword,
      newUsername,
      newPassword,
      newName,
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error || 'Gagal memperbarui kredensial admin' }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      dispatcher: result.dispatcher,
    });
  } catch (err) {
    console.error('Error in PATCH /api/admin/profile:', err);
    return NextResponse.json({ error: 'Terjadi kesalahan sistem saat memperbarui profil admin' }, { status: 500 });
  }
}
