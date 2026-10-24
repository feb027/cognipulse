import type ExcelJS from 'exceljs';
import { AssessmentRecord, TripHistory } from '@/types/fleet';
import {
  EXCEL_COLORS,
  THIN_BORDER,
  HEADER_BORDER,
  formatIndonesianDateTime,
  formatImpairmentLabel,
  formatDispatcherDecisionLabel,
  formatRecommendationLabel,
  applySemanticBadgeStyle,
} from './excel-styles';

export interface EnrichedTripRecord extends TripHistory {
  driver_nip?: string;
  driver_name?: string;
  vehicle_type?: string;
  license_plate?: string;
}

export function buildAssessmentLogsSheet(
  workbook: ExcelJS.Workbook,
  assessments: AssessmentRecord[]
) {
  const sheet = workbook.addWorksheet('2. Log Riwayat Asesmen K3', {
    views: [{ state: 'frozen', ySplit: 3 }],
    pageSetup: { orientation: 'landscape', fitToPage: true, fitToWidth: 1 },
  });

  // Title Row 1
  sheet.mergeCells('A1:T1');
  const title = sheet.getCell('A1');
  title.value = 'LOG HISTORIS ASESMEN NEUROKOGNITIF & AUDIT K3 PENGEMUDI (FORMAT TABULAR SIAP PIVOT TABLE)';
  title.font = { name: 'Segoe UI', size: 12, bold: true, color: { argb: EXCEL_COLORS.white } };
  title.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: EXCEL_COLORS.navyDark } };
  title.alignment = { vertical: 'middle', horizontal: 'left', indent: 1 };
  sheet.getRow(1).height = 26;

  const cols = [
    { header: 'ID Sesi', width: 9 },
    { header: 'Waktu Pengujian (WIB)', width: 22 },
    { header: 'NIP Supir', width: 13 },
    { header: 'Nama Pengemudi', width: 22 },
    { header: 'Unit Armada', width: 25 },
    { header: 'Plat Nomor', width: 14 },
    { header: 'Kesiapan Kerja (%)', width: 18 },
    { header: 'Skor CFI', width: 12 },
    { header: 'Kategori Kebugaran', width: 18 },
    { header: 'Laik Jalan', width: 13 },
    { header: 'PVT Mean RT (ms)', width: 17 },
    { header: 'PVT Lapses (x)', width: 15 },
    { header: 'Stroop Akurasi (%)', width: 18 },
    { header: 'Motorik (Hz)', width: 14 },
    { header: 'Corsi (Span)', width: 13 },
    { header: 'Rem Tol 100km/j (m)', width: 19 },
    { header: 'Risiko Microsleep', width: 17 },
    { header: 'Rekomendasi AI', width: 18 },
    { header: 'Keputusan Dispatcher', width: 23 },
    { header: 'Diagnosis & Catatan Evaluasi', width: 45 },
  ];

  cols.forEach((c, idx) => {
    sheet.getColumn(idx + 1).width = c.width;
  });

  const hRow = sheet.getRow(3);
  hRow.height = 25;
  cols.forEach((c, idx) => {
    const cell = hRow.getCell(idx + 1);
    cell.value = c.header;
    cell.font = { name: 'Segoe UI', size: 10, bold: true, color: { argb: EXCEL_COLORS.white } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: EXCEL_COLORS.tableHeader } };
    cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    cell.border = HEADER_BORDER;
  });

  sheet.autoFilter = 'A3:T3';

  assessments.forEach((a, idx) => {
    const row = sheet.getRow(4 + idx);
    row.height = 22;
    const readiness = Math.max(0, Math.min(100, Math.round(100 - a.cfi_score)));
    const isFit = a.is_fit_for_duty === 1;
    const summaryText = [a.headline_title, a.short_summary, a.dispatcher_notes ? `[Catatan: ${a.dispatcher_notes}]` : '']
      .filter(Boolean)
      .join(' — ');

    const rowData = [
      a.id,
      formatIndonesianDateTime(a.timestamp),
      a.driver_nip || '—',
      a.driver_name || '—',
      a.vehicle_type || '—',
      a.license_plate || '—',
      readiness,
      Number(a.cfi_score.toFixed(1)),
      formatImpairmentLabel(a.impairment_tier),
      isFit ? 'LAIK JALAN' : 'TIDAK LAIK',
      Math.round(a.pvt_mean_rt),
      a.pvt_lapses,
      Math.round(a.stroop_accuracy),
      Number(a.motor_cadence.toFixed(1)),
      a.corsi_max_span ?? 0,
      Number(a.braking_distance_meters.toFixed(1)),
      a.microsleep_risk.toUpperCase(),
      formatRecommendationLabel(a.dispatcher_recommendation),
      formatDispatcherDecisionLabel(a.dispatcher_decision),
      summaryText || 'Evaluasi rutin selesai.',
    ];

    const isEven = idx % 2 === 1;
    rowData.forEach((val, cIdx) => {
      const cell = row.getCell(cIdx + 1);
      cell.value = val;
      cell.font = { name: 'Segoe UI', size: 10, color: { argb: EXCEL_COLORS.textPrimary } };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: isEven ? EXCEL_COLORS.zebraEven : EXCEL_COLORS.white },
      };
      cell.border = THIN_BORDER;
      cell.alignment = {
        vertical: 'middle',
        horizontal: [0, 1, 2, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17].includes(cIdx) ? 'center' : 'left',
      };
    });

    const tierVar = a.impairment_tier === 'fit' ? 'emerald' : a.impairment_tier === 'critical_hazard' ? 'rose' : 'amber';
    applySemanticBadgeStyle(row.getCell(9), tierVar);
    applySemanticBadgeStyle(row.getCell(10), isFit ? 'emerald' : 'rose');
  });
}

export function buildTripHistorySheet(
  workbook: ExcelJS.Workbook,
  trips: EnrichedTripRecord[]
) {
  const sheet = workbook.addWorksheet('3. Jadwal & Riwayat Rute', {
    views: [{ state: 'frozen', ySplit: 3 }],
  });

  sheet.mergeCells('A1:J1');
  const title = sheet.getCell('A1');
  title.value = 'DAFTAR PENUGASAN RUTE TRAVEL & LOG JARAK TEMPUH ARMADA';
  title.font = { name: 'Segoe UI', size: 12, bold: true, color: { argb: EXCEL_COLORS.white } };
  title.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: EXCEL_COLORS.navyDark } };
  title.alignment = { vertical: 'middle', horizontal: 'left', indent: 1 };
  sheet.getRow(1).height = 26;

  const cols = [
    { header: 'ID Rute', width: 9 },
    { header: 'NIP Supir', width: 13 },
    { header: 'Nama Pengemudi', width: 22 },
    { header: 'Unit Armada', width: 25 },
    { header: 'Plat Nomor', width: 14 },
    { header: 'Nama Rute Perjalanan', width: 34 },
    { header: 'Jarak Tempuh (km)', width: 18 },
    { header: 'Jam Berangkat', width: 16 },
    { header: 'Status Perjalanan', width: 18 },
    { header: 'Catatan Operasional', width: 36 },
  ];

  cols.forEach((c, idx) => {
    sheet.getColumn(idx + 1).width = c.width;
  });

  const hRow = sheet.getRow(3);
  hRow.height = 24;
  cols.forEach((c, idx) => {
    const cell = hRow.getCell(idx + 1);
    cell.value = c.header;
    cell.font = { name: 'Segoe UI', size: 10, bold: true, color: { argb: EXCEL_COLORS.white } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: EXCEL_COLORS.tableHeader } };
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
    cell.border = HEADER_BORDER;
  });

  sheet.autoFilter = 'A3:J3';

  trips.forEach((t, idx) => {
    const row = sheet.getRow(4 + idx);
    row.height = 21;
    const statusLabel = t.status === 'completed' ? 'Selesai' : t.status === 'in_transit' ? 'Dalam Perjalanan' : 'Terjadwal';
    const vals = [
      t.id,
      t.driver_nip || '—',
      t.driver_name || '—',
      t.vehicle_type || '—',
      t.license_plate || '—',
      t.route_name,
      t.distance_km,
      t.departure_time || '—',
      statusLabel,
      t.notes || '—',
    ];
    const isEven = idx % 2 === 1;
    vals.forEach((v, cIdx) => {
      const cell = row.getCell(cIdx + 1);
      cell.value = v;
      cell.font = { name: 'Segoe UI', size: 10, color: { argb: EXCEL_COLORS.textPrimary } };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: isEven ? EXCEL_COLORS.zebraEven : EXCEL_COLORS.white } };
      cell.border = THIN_BORDER;
      cell.alignment = { vertical: 'middle', horizontal: [0, 1, 4, 6, 7, 8].includes(cIdx) ? 'center' : 'left' };
    });
    const stVar = t.status === 'completed' ? 'emerald' : t.status === 'in_transit' ? 'blue' : 'amber';
    applySemanticBadgeStyle(row.getCell(9), stVar);
  });
}
