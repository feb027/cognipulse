import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { CLINICAL_SYSTEM_INSTRUCTION } from '@/lib/ai/prompts';

export async function POST(req: NextRequest) {
  try {
    const { message, analysis, cfi } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({
        reply: `Santai bro/sis! Berdasarkan skor CFI kamu (${cfi?.cfiScore ?? 50}/100), baterai kognitif kamu lagi butuh charging. Mending jeda layar 15 menit, teguk air putih dingin, dan stretching santai sebelum lanjut grinding ya!`,
      });
    }

    const ai = new GoogleGenAI({ apiKey });
    const prompt = `
Konteks Pengguna:
- Skor Kelelahan CFI: ${cfi?.cfiScore ?? 50}/100 (${cfi?.impairmentTier ?? 'observasi'})
- Diagnosis: ${analysis?.differentialDiagnosis?.clinicalRationale ?? 'N/A'}
- Saran Pemulihan: ${analysis?.precisionRecoveryPrescription?.immediateAction ?? 'N/A'}

Pertanyaan Pengguna: "${message}"

Instruksi:
Jawablah sebagai AI Neuro-Copilot & Health Buddy profesional bergaya Gen Z yang santai, suportif, relatable ("Halo bro/sis", "baterai kognitif", "recharge", "otak nge-lag", "grinding"), namun tetap berbobot neurosains dalam 2-3 kalimat padat.
`.trim();

    const modelsToTry = [
      'gemini-3.8-flash',
      'gemini-3.7-flash',
      'gemini-3.6-flash',
      'gemini-3.5-flash',
      'gemini-3.5-flash-lite',
      'gemini-3.1-flash-lite',
    ];

    const COPILOT_SYSTEM_INSTRUCTION = `
Anda adalah AI Neuro-Copilot & Health Buddy profesional untuk operator dan digital worker.
Gaya bicara: Santai, asyik, ramah, dan suportif khas Gen Z / tech-savvy worker.
Format: Teks percakapan biasa (JANGAN gunakan JSON atau code block).
Panjang: 2-3 kalimat ringkas dan jelas yang langsung menjawab pertanyaan dan memberi saran pemulihan yang tepat sasaran.
`.trim();

    for (const modelName of modelsToTry) {
      try {
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error(`Copilot timeout ${modelName}`)), 7500)
        );

        const callPromise = (async () => {
          const response = await ai.models.generateContent({
            model: modelName,
            contents: prompt,
            config: {
              systemInstruction: COPILOT_SYSTEM_INSTRUCTION,
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
      reply: `Baterai kognitif kamu lagi butuh recharge (CFI ${cfi?.cfiScore ?? 50}/100). Prioritaskan jeda layar 15 menit dan minum air putih dingin biar fokusmu kembali gacor!`,
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Fallback consultation response';
    return NextResponse.json({
      reply: `Baterai kognitifmu lagi agak low-bat nih. Ambil jeda istirahat sejenak dan minum air putih biar saraf kognitif kembali fresh! (${errorMessage})`,
    });
  }
}

