import { NextRequest, NextResponse } from 'next/server';
import { getAllDrivers, getDriverByNip, createDriver } from '@/lib/db/driver-service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const nip = searchParams.get('nip');

    if (nip) {
      const driver = getDriverByNip(nip);
      if (!driver) {
        return NextResponse.json({ error: 'Driver tidak ditemukan' }, { status: 404 });
      }
      return NextResponse.json({ driver });
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
    const { nip, name, age, vehicle_type, license_plate, address, medical_history } = body;

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
    });

    return NextResponse.json({ driver: newDriver }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/drivers:', error);
    return NextResponse.json({ error: 'Gagal mendaftarkan driver baru' }, { status: 500 });
  }
}
