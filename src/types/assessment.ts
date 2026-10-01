/**
 * CogniPulse Core Assessment Types
 * Sentralisasi tipe data sesi asesmen kognitif, konteks operator, dan state wizard.
 */

export type AssessmentPhase =
  | 'idle'
  | 'context_checkin'
  | 'pvt_intro'
  | 'pvt_active'
  | 'stroop_intro'
  | 'stroop_active'
  | 'corsi_active'
  | 'motor_intro'
  | 'motor_active'
  | 'computing_telemetry'
  | 'completed';

export type ShiftType = 'morning' | 'afternoon' | 'night_graveyard' | 'extended_overtime';

export type CaffeineIntake = 'none' | 'low' | 'moderate' | 'high';

export interface UserContext {
  operatorId: string;
  shiftType: ShiftType;
  hoursSleptLastNight: number;
  hoursWorkedToday: number;
  caffeineIntake: CaffeineIntake;
  subjectiveFatigueScore: number; // Skala 1 (Sangat Segar) - 5 (Sangat Lelah)
  heavyPhysicalLabor?: boolean; // Aktivitas fisik berat / angkat barang hari ini
  deviceBaselineMs?: number;
}

export type ImpairmentTier = 'fit' | 'mild_fatigue' | 'moderate_impairment' | 'critical_hazard';

export interface CompositeFatigueResult {
  cfiScore: number; // 0 - 100 (0 = Prima, 100 = Kelelahan Parah)
  impairmentTier: ImpairmentTier;
  subjectiveObjectiveDisparity: boolean; // True jika merasa segar tapi tes drop
  calculatedAt: string;
}
