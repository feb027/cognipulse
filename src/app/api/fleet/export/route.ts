import { NextRequest, NextResponse } from 'next/server';
import ExcelJS from 'exceljs';
import { requireDispatcher } from '@/lib/api-auth';
import { getFleetSummary, getDriverFullInspection } from '@/lib/db/fleet-service';
import { getAllDrivers } from '@/lib/db/driver-service';
import { AssessmentRecord } from '@/types/fleet';
import { buildFleetSummarySheet } from '@/lib/export/sheet-fleet-summary';
import {
  buildAssessmentLogsSheet,
  buildTripHistorySheet,
  EnrichedTripRecord,
} from '@/lib/export/sheet-assessment-logs';

export async function GET(request: NextRequest) {
  try {
    if (!requireDispatcher(request)) {
      return NextResponse.json(
        { error: 'Akses ditolak: sesi dispatcher diperlukan untuk mengunduh laporan' },
        { status: 401 }
      );
    }

    const summary = getFleetSummary();
    const drivers = getAllDrivers();

    const allAssessments: AssessmentRecord[] = [];
    const allTrips: EnrichedTripRecord[] = [];

    for (const d of drivers) {
      const full = getDriverFullInspection(d.id);
      if (!full) continue;

      for (const a of full.assessments) {
        allAssessments.push({
          ...a,
          driver_nip: d.nip,
          driver_name: d.name,
          vehicle_type: d.vehicle_type,
          license_plate: d.license_plate,
        });
      }

      for (const t of full.trips) {
        allTrips.push({
          ...t,
          driver_nip: d.nip,
          driver_name: d.name,
          vehicle_type: d.vehicle_type,
          license_plate: d.license_plate,
        });
      }
    }

    allAssessments.sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime() || b.id - a.id
    );
    allTrips.sort((a, b) => b.id - a.id);

    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'CogniPulse Fleet Management System';
    workbook.lastModifiedBy = 'Dispatcher Operasional';
    workbook.created = new Date();
    workbook.modified = new Date();

    buildFleetSummarySheet(workbook, summary, drivers);
    buildAssessmentLogsSheet(workbook, allAssessments);
    buildTripHistorySheet(workbook, allTrips);

    const buffer = await workbook.xlsx.writeBuffer();
    const dateStamp = new Date().toISOString().slice(0, 10);
    const fileName = `Laporan_Armada_CogniPulse_${dateStamp}.xlsx`;

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    console.error('Error generating Fleet Excel export:', error);
    return NextResponse.json(
      { error: 'Gagal menghasilkan berkas laporan Excel' },
      { status: 500 }
    );
  }
}
