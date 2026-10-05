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
        confidenceScore: {
          type: "NUMBER",
          description: "Nilai desimal antara 0.0 sampai 1.0 (contoh 0.88, BUKAN 88)",
        },
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
    travelSafety: {
      type: "OBJECT",
      properties: {
        brakingDistanceMeters: {
          type: "NUMBER",
          description: "Jarak reaksi pengereman mobil pada 100 km/jam dalam meter",
        },
        brakingHazardDeltaMeters: {
          type: "NUMBER",
          description: "Selisih jarak bahaya dibanding reaksi normal",
        },
        highwayMicrosleepRisk: {
          type: "STRING",
          enum: ["rendah", "waspada", "kritis"],
        },
        highwayHypnosisSusceptibility: { type: "STRING" },
        routeCompatibility: { type: "STRING" },
        dispatcherRecommendation: {
          type: "STRING",
          enum: ["siap_solo", "wajib_co_driver", "stand_down"],
        },
        restAreaProtocol: { type: "STRING" },
      },
      required: [
        "brakingDistanceMeters",
        "brakingHazardDeltaMeters",
        "highwayMicrosleepRisk",
        "highwayHypnosisSusceptibility",
        "routeCompatibility",
        "dispatcherRecommendation",
        "restAreaProtocol",
      ],
    },
  },
  required: [
    "differentialDiagnosis",
    "fourHourRiskForecast",
    "precisionRecoveryPrescription",
    "travelSafety",
  ],
};
