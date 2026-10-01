/**
 * B2B Team Readiness & Shift Monitor Types
 * Agregasi anonim kesiapan operasional tim kerja/shift.
 */

import { ImpairmentTier } from './assessment';

export interface TeamMemberFatigue {
  anonymousId: string; // Misal: "DEV-04", "OP-12", "DRIVER-07"
  roleTitle: string;
  shiftBadge: string;
  cfiScore: number; // 0 - 100
  tier: ImpairmentTier;
  reactionLatencyMs: number;
  lapsesRecorded: number;
  lastAssessedTime: string;
}

export interface TeamShiftSummary {
  teamName: string;
  totalAssessed: number;
  fitPercentage: number;
  cautionPercentage: number;
  highRiskPercentage: number;
  averageCFI: number;
  recommendedShiftIntervention: string;
}
