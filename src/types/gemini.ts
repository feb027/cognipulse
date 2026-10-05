/**
 * Gemini 3.8 Flash Clinical Reasoning & Response Schemas
 * Kontrak keluaran terstruktur (JSON Schema) untuk diagnosis klinis dan proyeksi risiko kelelahan.
 */

export interface DifferentialDiagnosis {
  headlineTitle?: string;
  primaryCause?: string;
  shortSummary?: string;
  primaryType:
    | 'cognitive_overload'
    | 'sleep_deprived_microsleep'
    | 'neuromuscular_exhaustion'
    | 'optimal_vigilance';
  severityLevel: 'fit' | 'mild_fatigue' | 'moderate_impairment' | 'critical_hazard';
  confidenceScore: number; // 0.0 - 1.0
  clinicalRationale: string;
}

export interface FourHourRiskForecast {
  decisionErrorProbabilityIncrease: string; // Misal: "+42%"
  reactionTimeDecayTrajectory: string;
  criticalWarningAlert: string | null;
}

export interface PrecisionRecoveryPrescription {
  immediateAction: string; // Misal: "15-minute Non-Sleep Deep Rest (NSDR)"
  hydrationElectrolyteMl: number;
  recommendedScreenBreakMins: number;
  circadianAlignmentNote: string;
}

export interface TravelSafetyMetrics {
  brakingDistanceMeters: number;
  brakingHazardDeltaMeters: number;
  highwayMicrosleepRisk: 'rendah' | 'waspada' | 'kritis';
  highwayHypnosisSusceptibility: string;
  routeCompatibility: string;
  dispatcherRecommendation: 'siap_solo' | 'wajib_co_driver' | 'stand_down';
  restAreaProtocol: string;
}

export interface GeminiClinicalAnalysis {
  differentialDiagnosis: DifferentialDiagnosis;
  fourHourRiskForecast: FourHourRiskForecast;
  precisionRecoveryPrescription: PrecisionRecoveryPrescription;
  travelSafety?: TravelSafetyMetrics;
  aiEngineVersion: string; // "gemini-3.8-flash"
  isFallback: boolean;
}

export interface CopilotChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
}
