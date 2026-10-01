/**
 * Motor Tapping & Neuromuscular Cadence Types
 * Mengukur variabilitas ketukan motorik halus (jitter) dan penurunan tempo (decay).
 */

export interface TapEvent {
  tapIndex: number;
  timestampMs: number; // Timestamp performance.now()
  interTapIntervalMs: number; // Jeda antar ketukan (ms)
}

export interface MotorMetrics {
  totalTaps: number;
  durationSeconds: number;
  cadenceTapsPerSecond: number;
  meanInterTapIntervalMs: number;
  itiStandardDeviationMs: number; // Jitter / variabilitas ritme ketukan
  fatigueDecaySlope: number; // Koefisien kemiringan regresi tempo ketukan
  neuromuscularSteadinessScore: number; // 0 - 100
}
