import type ExcelJS from 'exceljs';
import { DriverWithLatestAssessment, FleetSummary } from '@/types/fleet';
import {
  EXCEL_COLORS,
  THIN_BORDER,
  HEADER_BORDER,
  formatIndonesianDateTime,
  formatDriverStatusLabel,
  formatImpairmentLabel,
  formatDispatcherDecisionLabel,
  applySemanticBadgeStyle,
} from './excel-styles';

export function buildFleetSummarySheet(
  workbook: ExcelJS.Workbook,
  summary: FleetSummary,
  drivers: DriverWithLatestAssessment[]
) {
  const sheet = workbook.addWorksheet('1. Status & KPI Armada', {
    views: [{ state: 'frozen', ySplit: 7 }],
    pageSetup: { orientation: 'landscape', fitToPage: true, fitToWidth: 1 },
  });

  // 1. Corporate Title Banner (Row 1 & Row 2)
  sheet.mergeCells('A1:W1');
  const titleCell = sheet.getCell('A1');
  titleCell.value = 'LAPORAN EKSEKUTIF KESIAPAN KERJA & KESELAMATAN ARMADA — COGNIPULSE FLEET';
  titleCell.font = { name: 'Segoe UI', size: 13, bold: true, color: { argb: EXCEL_COLORS.white } };
  titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: EXCEL_COLORS.navyDark } };
  titleCell.alignment = { vertical: 'middle', horizontal: 'left', indent: 1 };
  sheet.getRow(1).height = 28;

  sheet.mergeCells('A2:W2');
  const subCell = sheet.getCell('A2');
  subCell.value = `Dicetak Otomatis: ${formatIndonesianDateTime(new Date().toISOString())}  |  Standar Evaluasi Neurokognitif K3 Transportasi Darat (PVT, Stroop, Corsi, Motorik)`;
  subCell.font = { name: 'Segoe UI', size: 9.5, italic: true, color: { argb: 'FFCBD5E1' } };
  subCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: EXCEL_COLORS.slateHeader } };
  subCell.alignment = { vertical: 'middle', horizontal: 'left', indent: 1 };
  sheet.getRow(2).height = 20;

  // 2. KPI Summary Strip (Row 4 Labels, Row 5 Values)
  const kpiItems = [
    { col: 'B', label: 'TOTAL ARMADA', val: `${summary.totalDrivers} Unit`, variant: 'neutral' as const },
    { col: 'D', label: 'SIAP SOLO (LAYAK)', val: `${summary.readyCount} Supir`, variant: 'emerald' as const },
    { col: 'F', label: 'WAJIB CO-DRIVER', val: `${summary.cautionCount} Supir`, variant: 'amber' as const },
    { col: 'H', label: 'STAND-DOWN (KRITIS)', val: `${summary.standDownCount} Supir`, variant: 'rose' as const },
    { col: 'J', label: 'SEDANG ON-TRIP', val: `${summary.onTripCount} Unit`, variant: 'blue' as const },
    { col: 'L', label: 'RERATA REFLEKS PVT', val: `${summary.avgReactionTimeMs} ms`, variant: 'neutral' as const },
    { col: 'N', label: 'RERATA REM TOL (100KM/J)', val: `${summary.avgBrakingDistanceMeters} m`, variant: 'neutral' as const },
  ];

  sheet.getRow(4).height = 18;
  sheet.getRow(5).height = 24;

  kpiItems.forEach((item) => {
    const lbl = sheet.getCell(`${item.col}4`);
    lbl.value = item.label;
    lbl.font = { name: 'Segoe UI', size: 8.5, bold: true, color: { argb: EXCEL_COLORS.textMuted } };
    lbl.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: EXCEL_COLORS.kpiCardBg } };
    lbl.alignment = { vertical: 'middle', horizontal: 'center' };
    lbl.border = THIN_BORDER;

    const val = sheet.getCell(`${item.col}5`);
    val.value = item.val;
    applySemanticBadgeStyle(val, item.variant);
    val.font = { ...val.font, size: 11, bold: true };
    val.border = THIN_BORDER;
  });

  // 3. Master Driver Table Header (Row 7)
  const headers = [
    { header: 'No', width: 6 },
    { header: 'NIP Supir', width: 13 },
    { header: 'Nama Pengemudi', width: 22 },
    { header: 'Usia (Thn)', width: 11 },
    { header: 'Unit Armada Kendaraan', width: 26 },
    { header: 'Plat Nomor', width: 14 },
    { header: 'Status Operasional', width: 18 },
    { header: 'Rute Perjalanan Aktif', width: 32 },
    { header: 'Jarak Rute (km)', width: 15 },
    { header: 'Kesiapan Kerja (%)', width: 18 },
    { header: 'Skor CFI', width: 12 },
    { header: 'Kategori Kebugaran', width: 18 },
    { header: 'Refleks PVT (ms)', width: 16 },
    { header: 'Jeda Fokus (Lapse)', width: 17 },
    { header: 'Akurasi Stroop (%)', width: 18 },
    { header: 'Ritme Motorik (Hz)', width: 18 },
    { header: 'Memori Corsi (Span)', width: 18 },
    { header: 'Jarak Rem Tol 100km/j (m)', width: 24 },
    { header: 'Risiko Microsleep', width: 17 },
    { header: 'Keputusan Dispatcher', width: 24 },
    { header: 'Waktu Asesmen Terakhir', width: 22 },
    { header: 'Riwayat Medis & Catatan', width: 32 },
    { header: 'Alamat Pool / Domisili', width: 34 },
  ];

  headers.forEach((h, idx) => {
    sheet.getColumn(idx + 1).width = h.width;
  });

  const headerRow = sheet.getRow(7);
  headerRow.height = 26;
  headers.forEach((h, idx) => {
    const cell = headerRow.getCell(idx + 1);
    cell.value = h.header;
    cell.font = { name: 'Segoe UI', size: 10, bold: true, color: { argb: EXCEL_COLORS.white } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: EXCEL_COLORS.tableHeader } };
    cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    cell.border = HEADER_BORDER;
  });

  sheet.autoFilter = 'A7:W7';

  // 4. Populate Driver Rows (Row 8+)
  drivers.forEach((d, idx) => {
    const rowIdx = 8 + idx;
    const row = sheet.getRow(rowIdx);
    row.height = 22;
    const latest = d.latestAssessment;
    const readiness = latest ? Math.max(0, Math.min(100, Math.round(100 - latest.cfi_score))) : null;

    const values = [
      idx + 1,
      d.nip,
      d.name,
      d.age,
      d.vehicle_type,
      d.license_plate,
      formatDriverStatusLabel(d.status),
      d.activeTrip?.route_name || 'Belum Ditentukan',
      d.activeTrip?.distance_km ?? null,
      readiness,
      latest ? Number(latest.cfi_score.toFixed(1)) : null,
      latest ? formatImpairmentLabel(latest.impairment_tier) : 'Belum Uji',
      latest ? Math.round(latest.pvt_mean_rt) : null,
      latest ? latest.pvt_lapses : null,
      latest ? Math.round(latest.stroop_accuracy) : null,
      latest ? Number(latest.motor_cadence.toFixed(1)) : null,
      latest?.corsi_max_span ?? null,
      latest ? Number(latest.braking_distance_meters.toFixed(1)) : null,
      latest ? latest.microsleep_risk.toUpperCase() : '—',
      latest ? formatDispatcherDecisionLabel(latest.dispatcher_decision) : 'Belum Ada',
      formatIndonesianDateTime(latest?.timestamp),
      d.medical_history || 'Tidak ada riwayat kronis',
      d.address || '—',
    ];

    const isEven = idx % 2 === 1;
    values.forEach((v, colZeroIdx) => {
      const cell = row.getCell(colZeroIdx + 1);
      cell.value = v !== null && v !== undefined ? v : '—';
      cell.font = { name: 'Segoe UI', size: 10, color: { argb: EXCEL_COLORS.textPrimary } };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: isEven ? EXCEL_COLORS.zebraEven : EXCEL_COLORS.white },
      };
      cell.border = THIN_BORDER;
      cell.alignment = {
        vertical: 'middle',
        horizontal: [0, 1, 3, 5, 8, 9, 10, 12, 13, 14, 15, 16, 17, 20].includes(colZeroIdx) ? 'center' : 'left',
      };
    });

    // Apply Semantic Badge Colors to Status (Col 7), Kategori Kebugaran (Col 12), Microsleep (Col 19)
    const statusVariant = d.status === 'ready' ? 'emerald' : d.status === 'caution' ? 'amber' : d.status === 'stand_down' ? 'rose' : 'blue';
    applySemanticBadgeStyle(row.getCell(7), statusVariant);

    if (latest) {
      const tierVar = latest.impairment_tier === 'fit' ? 'emerald' : latest.impairment_tier === 'critical_hazard' ? 'rose' : 'amber';
      applySemanticBadgeStyle(row.getCell(12), tierVar);

      const msVar = latest.microsleep_risk === 'rendah' ? 'emerald' : latest.microsleep_risk === 'kritis' ? 'rose' : 'amber';
      applySemanticBadgeStyle(row.getCell(19), msVar);
    }
  });
}
