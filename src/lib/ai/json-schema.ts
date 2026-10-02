/**
 * Gemini 3.8 Flash Structured JSON Schema Definition
 * Mengunci format JSON dari Gemini agar selalu kompatibel dengan tipe GeminiClinicalAnalysis.
 */

export const GEMINI_CLINICAL_ANALYSIS_SCHEMA = {
  type: "OBJECT",
  properties: {
    differentialDiagnosis: {
      type: "OBJECT",
      properties: {
        headlineTitle: { type: "STRING" },
        primaryCause: { type: "STRING" },
        shortSummary: { type: "STRING" },
        primaryType: {
          type: "STRING",
          enum: [
            "cognitive_overload",
            "sleep_deprived_microsleep",
            "neuromuscular_exhaustion",
            "optimal_vigilance",
          ],
        },
        severityLevel: {
          type: "STRING",
          enum: ["fit", "mild_fatigue", "moderate_impairment", "critical_hazard"],
        },
        confidenceScore: { type: "NUMBER" },
        clinicalRationale: { type: "STRING" },
      },
      required: [
        "headlineTitle",
        "primaryCause",
        "shortSummary",
        "primaryType",
        "severityLevel",
        "confidenceScore",
        "clinicalRationale",
      ],
    },
    fourHourRiskForecast: {
      type: "OBJECT",
      properties: {
        decisionErrorProbabilityIncrease: { type: "STRING" },
        reactionTimeDecayTrajectory: { type: "STRING" },
        criticalWarningAlert: { type: "STRING", nullable: true },
      },
      required: ["decisionErrorProbabilityIncrease", "reactionTimeDecayTrajectory"],
    },
    precisionRecoveryPrescription: {
      type: "OBJECT",
      properties: {
        immediateAction: { type: "STRING" },
        hydrationElectrolyteMl: { type: "NUMBER" },
        recommendedScreenBreakMins: { type: "NUMBER" },
        circadianAlignmentNote: { type: "STRING" },
      },
      required: [
        "immediateAction",
        "hydrationElectrolyteMl",
        "recommendedScreenBreakMins",
        "circadianAlignmentNote",
      ],
    },
  },
  required: [
    "differentialDiagnosis",
    "fourHourRiskForecast",
    "precisionRecoveryPrescription",
  ],
};
