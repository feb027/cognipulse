/**
 * Gemini Multi-Model & Multi-Key Cascade Client
 * Mendukung Key Rotation Pool (comma-separated keys) dan Dual-Engine Fault Tolerance.
 */

import { GoogleGenAI } from '@google/genai';
import { GeminiClinicalAnalysis } from '@/types/gemini';
import { CompositeFatigueResult, UserContext } from '@/types/assessment';
import { PVTMetrics } from '@/types/pvt';
import { StroopMetrics } from '@/types/stroop';
import { MotorMetrics } from '@/types/motor';
import { CorsiMetrics } from '@/types/corsi';
import { CLINICAL_SYSTEM_INSTRUCTION, buildTelemetryPrompt } from './prompts';
import { GEMINI_CLINICAL_ANALYSIS_SCHEMA } from './json-schema';
import { generateLocalFallbackAnalysis } from './local-fallback-engine';

const modelCooldownMap = new Map<string, number>();
const COOLDOWN_DURATION_MS = 15_000;
let roundRobinKeyIndex = 0;

function getApiKeyPool(override?: string): string[] {
  const raw =
    override ||
    process.env.GEMINI_API_KEY ||
    process.env.NEXT_PUBLIC_GEMINI_API_KEY ||
    '';
  return raw
    .split(',')
    .map((k) => k.trim())
    .filter(Boolean);
}

export async function analyzeFatigueTelemetry(
  cfi: CompositeFatigueResult,
  pvt: PVTMetrics,
  stroop: StroopMetrics,
  motor: MotorMetrics,
  context?: UserContext,
  apiKeyOverride?: string,
  corsi?: CorsiMetrics,
  options?: {
    deviceBaselineMs?: number;
    clientTimestamp?: string;
    driverContext?: {
      nip?: string;
      name?: string;
      vehicleType?: string;
      licensePlate?: string;
      activeRoute?: string;
      medicalHistory?: string;
    };
  }
): Promise<GeminiClinicalAnalysis> {
  const apiKeys = getApiKeyPool(apiKeyOverride);
  if (apiKeys.length === 0) {
    return generateLocalFallbackAnalysis(cfi, pvt, stroop, motor, corsi);
  }

  const prompt = buildTelemetryPrompt(cfi, pvt, stroop, motor, context, corsi, options);
  const candidateModels = ['gemini-3.5-flash-lite', 'gemini-3.5-flash', 'gemini-3.8-flash'];

  const now = Date.now();
  const activeModels = candidateModels.filter(
    (m) => (modelCooldownMap.get(m) || 0) <= now
  );
  const modelsToTry = activeModels.length > 0 ? activeModels : candidateModels;

  console.log(`[AI Cascade] Memulai evaluasi klinis. Urutan model: ${modelsToTry.join(' -> ')} | Total Keys di Pool: ${apiKeys.length}`);

  for (let i = 0; i < modelsToTry.length; i++) {
    const modelName = modelsToTry[i];
    const startTime = Date.now();

    // Round-robin key selection with quota failover
    for (let k = 0; k < Math.min(apiKeys.length, 3); k++) {
      const selectedKey = apiKeys[(roundRobinKeyIndex + k) % apiKeys.length];
      const ai = new GoogleGenAI({ apiKey: selectedKey });

      try {
        console.log(`[AI Cascade] Tahap ${i + 1}/${modelsToTry.length}: Mencoba ${modelName} (Key #${(roundRobinKeyIndex + k) % apiKeys.length + 1})...`);
        const timeoutMs = 9500;
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error(`Model ${modelName} timeout (${timeoutMs}ms)`)), timeoutMs)
        );

        const callPromise = (async () => {
          const response = await ai.models.generateContent({
            model: modelName,
            contents: prompt,
            config: {
              systemInstruction: CLINICAL_SYSTEM_INSTRUCTION,
              responseMimeType: 'application/json',
              responseSchema: GEMINI_CLINICAL_ANALYSIS_SCHEMA,
              temperature: 0.65,
            },
          });
          return response.text;
        })();

        const text = await Promise.race([callPromise, timeoutPromise]);
        if (text) {
          roundRobinKeyIndex++;
          const parsed = JSON.parse(text) as GeminiClinicalAnalysis;
          if (parsed.differentialDiagnosis) {
            const raw = parsed.differentialDiagnosis.confidenceScore ?? 0.9;
            parsed.differentialDiagnosis.confidenceScore = raw > 1 ? raw / 100 : raw;
          }
          const durationMs = Date.now() - startTime;
          console.log(`[AI Cascade] SUKSES! Model ${modelName} berhasil menghasilkan diagnosis klinis dalam ${durationMs}ms.`);
          return {
            ...parsed,
            aiEngineVersion: `${modelName}`,
            isFallback: false,
          };
        }
      } catch (err: unknown) {
        const errMsg = err instanceof Error ? err.message : String(err);
        const isQuotaError = errMsg.includes('429') || errMsg.includes('RESOURCE_EXHAUSTED');

        if (isQuotaError && apiKeys.length > 1 && k < apiKeys.length - 1) {
          console.warn(`[AI Cascade] Key #${(roundRobinKeyIndex + k) % apiKeys.length + 1} terkena kuota/rate limit. Mencoba key berikutnya di pool...`);
          continue; // Try next key for same model
        }

        modelCooldownMap.set(modelName, Date.now() + COOLDOWN_DURATION_MS);
        console.warn(`[AI Cascade] Model ${modelName} gagal (${errMsg}). Beralih bertahap ke model berikutnya...`);
        break; // Move to next model
      }
    }
  }

  console.warn('[AI Cascade] Seluruh model Gemini cloud tidak merespons. Mengaktifkan Local Deterministic Fallback Engine.');
  return generateLocalFallbackAnalysis(cfi, pvt, stroop, motor, corsi);
}
