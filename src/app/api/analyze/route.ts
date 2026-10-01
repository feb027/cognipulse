import { NextRequest, NextResponse } from 'next/server';
import { analyzeFatigueTelemetry } from '@/lib/ai/gemini-client';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { cfi, pvt, stroop, motor, context, corsi } = body;

    if (!cfi || !pvt || !stroop || !motor) {
      return NextResponse.json(
        { error: 'Missing required telemetry data' },
        { status: 400 }
      );
    }

    const analysis = await analyzeFatigueTelemetry(
      cfi,
      pvt,
      stroop,
      motor,
      context,
      undefined,
      corsi
    );

    return NextResponse.json({ analysis });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
