export * from './assessment';
export * from './gemini';
export * from './motor';
export * from './pvt';
export * from './stroop';
export * from './corsi';
export * from './team';
export * from './fleet';
export * from './auth';

import { CompositeFatigueResult } from './assessment';
import { PVTMetrics } from './pvt';
import { StroopMetrics } from './stroop';
import { MotorMetrics } from './motor';
import { CorsiMetrics } from './corsi';
import { GeminiClinicalAnalysis } from './gemini';

export interface AssessmentResult {
  cfi: CompositeFatigueResult;
  pvt: PVTMetrics;
  stroop: StroopMetrics;
  motor: MotorMetrics;
  corsi?: CorsiMetrics;
  diagnosis: GeminiClinicalAnalysis;
  timestamp: string;
}
