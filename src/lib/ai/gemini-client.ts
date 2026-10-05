/**
 * Gemini 3.8 Flash Client with Dual-Engine Fallback
 * Menggunakan official SDK @google/genai dengan batas waktu (timeout 3.5 detik).
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
const COOLDOWN_DURATION_MS = 30_000;

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
  }
): Promise<GeminiClinicalAnalysis> {
  const apiKey =
    apiKeyOverride ||
    process.env.GEMINI_API_KEY ||
    process.env.NEXT_PUBLIC_GEMINI_API_KEY;

  if (!apiKey) {
    return generateLocalFallbackAnalysis(cfi, pvt, stroop, motor, corsi);
  }

  const prompt = buildTelemetryPrompt(cfi, pvt, stroop, motor, context, corsi, options);
  const candidateModels = [
    'gemini-3.8-flash',
    'gemini-3.5-flash-lite',
    'gemini-3.1-flash-lite',
    'gemini-3.5-flash',
  ];

  const now = Date.now();
  const activeModels = candidateModels.filter(
    (m) => (modelCooldownMap.get(m) || 0) <= now
  );
  const modelsToTry = activeModels.length > 0 ? activeModels : candidateModels;

  console.log(`[AI Cascade] Memulai evaluasi klinis. Urutan model: ${modelsToTry.join(' -> ')}`);
  const ai = new GoogleGenAI({ apiKey });

  for (let i = 0; i < modelsToTry.length; i++) {
    const modelName = modelsToTry[i];
    const startTime = Date.now();
    try {
      console.log(`[AI Cascade] Tahap ${i + 1}/${modelsToTry.length}: Mencoba ${modelName}...`);
      const timeoutMs = modelName === 'gemini-3.5-flash' ? 8000 : 5000;
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
            temperature: 0.2,
          },
        });
        return response.text;
      })();

      const text = await Promise.race([callPromise, timeoutPromise]);
      if (text) {
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
      modelCooldownMap.set(modelName, Date.now() + COOLDOWN_DURATION_MS);
      const errMsg = err instanceof Error ? err.message : String(err);
      console.warn(`[AI Cascade] Model ${modelName} gagal (${errMsg}). Beralih bertahap ke model berikutnya...`);
    }
  }

  console.warn('[AI Cascade] Seluruh model Gemini cloud tidak merespons. Mengaktifkan Local Deterministic Fallback Engine.');
  return generateLocalFallbackAnalysis(cfi, pvt, stroop, motor, corsi);
}
