import { NextRequest, NextResponse } from 'next/server';
import { getFleetSummary, updateDriverStatus, updateDispatcherDecision } from '@/lib/db/fleet-service';
import { getAllDrivers } from '@/lib/db/driver-service';
import { requireDispatcher } from '@/lib/api-auth';
import { DriverStatus, DispatcherDecision } from '@/types/fleet';

export async function GET() {
  try {
    const summary = getFleetSummary();
    const drivers = getAllDrivers();
    return NextResponse.json({ summary, drivers });
  } catch (error) {
    console.error('Error in GET /api/fleet:', error);
    return NextResponse.json({ error: 'Gagal memuat konsol armada' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  // Hanya dispatcher yang boleh mengubah status atau keputusan penugasan
  if (!requireDispatcher(request)) {
    return NextResponse.json({ error: 'Akses ditolak: sesi dispatcher diperlukan' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { driverId, status, assessmentId, decision, notes } = body;

    let updated = false;

    if (driverId && status) {
      updated = updateDriverStatus(Number(driverId), status as DriverStatus);
    }

    if (assessmentId && decision) {
      updated = updateDispatcherDecision(Number(assessmentId), decision as DispatcherDecision, notes);
    }

    if (!updated) {
      return NextResponse.json({ error: 'Gagal memperbarui status atau parameter tidak lengkap' }, { status: 400 });
    }

    const summary = getFleetSummary();
    const drivers = getAllDrivers();

    return NextResponse.json({
      success: true,
      summary,
      drivers,
    });
  } catch (error) {
    console.error('Error in PATCH /api/fleet:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan sistem saat memperbarui' }, { status: 500 });
  }
}
