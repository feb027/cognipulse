import type ExcelJS from 'exceljs';

export const EXCEL_COLORS = {
  navyDark: 'FF0F172A',
  slateHeader: 'FF1E293B',
  tableHeader: 'FF18181B',
  zebraEven: 'FFF8FAFC',
  white: 'FFFFFFFF',
  borderLight: 'FFE2E8F0',
  borderMedium: 'FFCBD5E1',
  textPrimary: 'FF0F172A',
  textMuted: 'FF64748B',
  emeraldBg: 'FFDCFCE7',
  emeraldText: 'FF166534',
  amberBg: 'FFFEF3C7',
  amberText: 'FF92400E',
  roseBg: 'FFFEE2E2',
  roseText: 'FF991B1B',
  blueBg: 'FFDBEAFE',
  blueText: 'FF1E40AF',
  kpiCardBg: 'FFF1F5F9',
};

export const THIN_BORDER: Partial<ExcelJS.Borders> = {
  top: { style: 'thin', color: { argb: EXCEL_COLORS.borderLight } },
  left: { style: 'thin', color: { argb: EXCEL_COLORS.borderLight } },
  bottom: { style: 'thin', color: { argb: EXCEL_COLORS.borderLight } },
  right: { style: 'thin', color: { argb: EXCEL_COLORS.borderLight } },
};

export const HEADER_BORDER: Partial<ExcelJS.Borders> = {
  top: { style: 'thin', color: { argb: EXCEL_COLORS.borderMedium } },
  left: { style: 'thin', color: { argb: EXCEL_COLORS.borderMedium } },
  bottom: { style: 'medium', color: { argb: EXCEL_COLORS.navyDark } },
  right: { style: 'thin', color: { argb: EXCEL_COLORS.borderMedium } },
};

export function formatIndonesianDateTime(iso?: string | null): string {
  if (!iso) return 'Belum Diuji';
  try {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return iso;
    return new Intl.DateTimeFormat('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(d) + ' WIB';
  } catch {
    return iso;
  }
}

export function formatDriverStatusLabel(status?: string): string {
  switch (status) {
    case 'ready':
      return 'Siap Solo';
    case 'caution':
      return 'Wajib Co-Driver';
    case 'stand_down':
      return 'Stand-Down';
    case 'on_trip':
      return 'On-Trip';
    default:
      return status || 'Siap Solo';
  }
}

export function formatImpairmentLabel(tier?: string): string {
  switch (tier) {
    case 'fit':
      return 'Bugar';
    case 'mild_fatigue':
      return 'Lelah Ringan';
    case 'moderate_impairment':
      return 'Lelah Sedang';
    case 'critical_hazard':
      return 'Kritis';
    default:
      return tier ? tier.replace(/_/g, ' ') : 'Belum Uji';
  }
}

export function formatDispatcherDecisionLabel(decision?: string): string {
  switch (decision) {
    case 'dispatched_solo':
      return 'Disetujui Jalan Solo';
    case 'co_driver_assigned':
      return 'Ditugaskan Co-Driver';
    case 'stand_down_issued':
      return 'Dilarang Jalan (Stand-Down)';
    case 'pending':
      return 'Menunggu Keputusan';
    default:
      return decision || 'Menunggu Keputusan';
  }
}

export function formatRecommendationLabel(rec?: string): string {
  switch (rec) {
    case 'siap_solo':
      return 'Siap Solo';
    case 'wajib_co_driver':
      return 'Wajib Co-Driver';
    case 'stand_down':
      return 'Stand-Down';
    default:
      return rec || '—';
  }
}

export function applySemanticBadgeStyle(
  cell: ExcelJS.Cell,
  variant: 'emerald' | 'amber' | 'rose' | 'blue' | 'neutral'
) {
  const map = {
    emerald: { bg: EXCEL_COLORS.emeraldBg, fg: EXCEL_COLORS.emeraldText },
    amber: { bg: EXCEL_COLORS.amberBg, fg: EXCEL_COLORS.amberText },
    rose: { bg: EXCEL_COLORS.roseBg, fg: EXCEL_COLORS.roseText },
    blue: { bg: EXCEL_COLORS.blueBg, fg: EXCEL_COLORS.blueText },
    neutral: { bg: EXCEL_COLORS.kpiCardBg, fg: EXCEL_COLORS.textMuted },
  };
  const chosen = map[variant];
  cell.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: chosen.bg },
  };
  cell.font = {
    name: 'Segoe UI',
    size: 10,
    bold: true,
    color: { argb: chosen.fg },
  };
  cell.alignment = { vertical: 'middle', horizontal: 'center' };
}
