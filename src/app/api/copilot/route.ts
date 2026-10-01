import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { CLINICAL_SYSTEM_INSTRUCTION } from '@/lib/ai/prompts';

export async function POST(req: NextRequest) {
  try {
    const { message, analysis, cfi } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({
        reply: `Berdasarkan skor CFI ${cfi?.cfiScore ?? 50}/100 dan status ${cfi?.impairmentTier ?? 'observasi'}, disarankan jeda layar 15 menit dan hidrasi cairan elektrolit sebelum kembali melanjutkan tugas.`,
      });
    }

    const ai = new GoogleGenAI({ apiKey });
    const prompt = `
Context:
Operator CFI Score: ${cfi?.cfiScore ?? 'N/A'}/100 (${cfi?.impairmentTier ?? 'N/A'})
Diagnosis: ${analysis?.differentialDiagnosis?.clinicalRationale ?? 'N/A'}
Prescription: ${analysis?.precisionRecoveryPrescription?.immediateAction ?? 'N/A'}

User Query: "${message}"

Answer as a clinical neurophysiologist in 2-3 concise, empathetic, medically-grounded sentences.
`.trim();

    const modelsToTry = [
      'gemini-3.5-flash-lite',
      'gemini-3.8-flash',
      'gemini-2.5-flash',
      'gemini-3.1-flash-lite',
      'gemini-2.5-flash-lite',
    ];

    for (const modelName of modelsToTry) {
      try {
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error(`Copilot timeout ${modelName}`)), 3500)
        );

        const callPromise = (async () => {
          const response = await ai.models.generateContent({
            model: modelName,
            contents: prompt,
            config: {
              systemInstruction: CLINICAL_SYSTEM_INSTRUCTION,
            },
          });
          return response.text;
        })();

        const text = await Promise.race([callPromise, timeoutPromise]);
        if (text) {
          return NextResponse.json({ reply: text });
        }
      } catch (e) {
        console.warn(`Copilot attempt with ${modelName} failed or timed out:`, e);
      }
    }

    return NextResponse.json({
      reply: `Berdasarkan skor CFI ${cfi?.cfiScore ?? 50}/100, prioritaskan jeda istirahat aktif 15 menit dan hidrasi elektrolit.`,
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Fallback consultation response';
    return NextResponse.json({
      reply: `[Konsultasi Medis Resilient]: Prioritas Anda adalah istirahat berkala untuk menurunkan kejenuhan reseptor saraf kognitif. (${errorMessage})`,
    });
  }
}

