import { NextRequest, NextResponse } from 'next/server';
import { saveAssessmentRecord } from '@/lib/db/assessment-service';
import { getDriverFullInspection } from '@/lib/db/fleet-service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const driverId = searchParams.get('driverId');

    if (!driverId) {
      return NextResponse.json({ error: 'Parameter driverId diperlukan' }, { status: 400 });
    }

    const data = getDriverFullInspection(Number(driverId));
    if (!data) {
      return NextResponse.json({ error: 'Driver tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in GET /api/assessments:', error);
    return NextResponse.json({ error: 'Gagal memuat detail asesmen' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { driverId, nip, cfi, pvt, stroop, motor, corsi, analysis } = body;

    if (!cfi || !pvt || !stroop || !motor || !analysis) {
      return NextResponse.json({ error: 'Payload asesmen tidak lengkap' }, { status: 400 });
    }

    const record = saveAssessmentRecord({
      driverId: driverId ? Number(driverId) : undefined,
      nip,
      cfi,
      pvt,
      stroop,
      motor,
      corsi,
      analysis,
    });

    return NextResponse.json({ success: true, record }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/assessments:', error);
    return NextResponse.json({ error: 'Gagal menyimpan rekaman asesmen' }, { status: 500 });
  }
}
