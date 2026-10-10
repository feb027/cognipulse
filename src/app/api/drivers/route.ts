import { NextRequest, NextResponse } from 'next/server';
import {
  getAllDrivers,
  getAllDriversForAdmin,
  getDriverByNip,
  createDriver,
  updateDriver,
  deleteDriver,
} from '@/lib/db/driver-service';
import { requireDispatcher } from '@/lib/api-auth';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const nip = searchParams.get('nip');
    const forAdmin = searchParams.get('admin') === 'true';

    if (nip) {
      const driver = getDriverByNip(nip);
      if (!driver) {
        return NextResponse.json({ error: 'Driver tidak ditemukan' }, { status: 404 });
      }
      return NextResponse.json({ driver });
    }

    if (forAdmin && requireDispatcher(request)) {
      const drivers = getAllDriversForAdmin();
      return NextResponse.json({ drivers });
    }

    const drivers = getAllDrivers();
    return NextResponse.json({ drivers });
  } catch (error) {
    console.error('Error in GET /api/drivers:', error);
    return NextResponse.json({ error: 'Gagal memuat data driver' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nip, name, age, vehicle_type, license_plate, address, medical_history, pin } = body;

    if (!nip || !name || !age || !vehicle_type || !license_plate || !address) {
      return NextResponse.json(
        { error: 'NIP, nama, usia, jenis kendaraan, plat nomor, dan alamat wajib diisi' },
        { status: 400 }
      );
    }

    const existing = getDriverByNip(nip);
    if (existing) {
      return NextResponse.json({ error: `Driver dengan NIP ${nip} sudah terdaftar` }, { status: 409 });
    }

    const newDriver = createDriver({
      nip,
      name,
      age: Number(age),
      vehicle_type,
      license_plate,
      address,
      medical_history: medical_history || 'Tidak ada riwayat kronis',
      pin: pin ? String(pin).trim() : '1234',
    });

    return NextResponse.json({ driver: newDriver }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/drivers:', error);
    return NextResponse.json({ error: 'Gagal mendaftarkan driver baru' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    if (!requireDispatcher(request)) {
      return NextResponse.json({ error: 'Akses ditolak: Hanya dispatcher yang diizinkan' }, { status: 403 });
    }

    const body = await request.json();
    const { id, name, age, vehicle_type, license_plate, address, medical_history, status, pin } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID driver wajib disertakan' }, { status: 400 });
    }

    const updated = updateDriver(Number(id), {
      name,
      age,
      vehicle_type,
      license_plate,
      address,
      medical_history,
      status,
      pin,
    });

    if (!updated) {
      return NextResponse.json({ error: 'Driver tidak ditemukan atau gagal diperbarui' }, { status: 404 });
    }

    return NextResponse.json({ success: true, driver: updated });
  } catch (error) {
    console.error('Error in PATCH /api/drivers:', error);
    return NextResponse.json({ error: 'Gagal memperbarui data driver' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    if (!requireDispatcher(request)) {
      return NextResponse.json({ error: 'Akses ditolak: Hanya dispatcher yang diizinkan' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const idParam = searchParams.get('id');
    let driverId = idParam ? parseInt(idParam, 10) : null;

    if (!driverId) {
      try {
        const body = await request.json();
        driverId = body.id ? parseInt(body.id, 10) : null;
      } catch {}
    }

    if (!driverId) {
      return NextResponse.json({ error: 'ID driver wajib disertakan' }, { status: 400 });
    }

    const success = deleteDriver(driverId);
    if (!success) {
      return NextResponse.json({ error: 'Driver tidak ditemukan atau gagal dihapus' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Driver berhasil dihapus' });
  } catch (error) {
    console.error('Error in DELETE /api/drivers:', error);
    return NextResponse.json({ error: 'Gagal menghapus driver' }, { status: 500 });
  }
}
