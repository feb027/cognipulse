/**
 * Cognitive Inhibitory Control & Stroop Paradigm Types
 * Mengukur selective attention dan prefrontal executive inhibition.
 */

export type StroopStimulusType = 'go_match' | 'no_go_mismatch';

export interface StroopTrial {
  trialIndex: number;
  wordText: string; // Misal: "MERAH", "HIJAU", "BIRU"
  displayColor: string; // Misal: CSS color "#ef4444", "#22c55e"
  stimulusType: StroopStimulusType;
  expectedAction: 'press' | 'withhold';
  userAction: 'pressed' | 'withheld';
  reactionTimeMs: number | null;
  isCorrect: boolean;
  errorType?: 'commission' | 'omission';
}

export interface StroopMetrics {
  totalTrials: number;
  accuracyRate: number; // 0 - 100%
  meanCongruentRT: number;
  meanIncongruentRT: number;
  interferenceCostMs: number; // Incongruent RT - Congruent RT
  commissionErrors: number; // Menekan pada No-Go (Impulsive/Decision Fatigue)
  omissionErrors: number; // Gagal menekan pada Go
  inhibitoryControlScore: number; // 0 - 100
}
