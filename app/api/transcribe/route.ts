/**
 * app/api/transcribe/route.ts
 * BFF Proxy — Gemini Team Radio Transcription & Tactical AI Summary
 *
 * Accepts audio URL + lap telemetry context, returns transcript, Japanese translation,
 * category classification, and strategic race context summary.
 *
 * Model priority (Flash): gemini-3.5-flash-lite → gemini-3.5-flash → gemini-2.5-flash → gemini-2.5-flash-lite → gemini-flash-latest
 */

import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { auth } from '@/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export interface TranscribeRequest {
  audioUrl: string;
  driverNumber?: number;
  driverName?: string;
  lapNumber?: number;
  lapContext?: string; // Telemetry context (e.g. tyre compound, tyre age, lap time delta)
}

export interface TranscribeResponse {
  transcript: string;
  translation: string;
  aiSummary: string;
  category: 'PIT' | 'TYRE' | 'PACE' | 'SAFETY' | 'STRATEGY';
}

const FLASH_MODELS = [
  'gemini-3.5-flash-lite',
  'gemini-3.5-flash',
  'gemini-2.5-flash',
  'gemini-2.5-flash-lite',
  'gemini-flash-latest',
];

const CATEGORY_KEYWORDS: Record<TranscribeResponse['category'], string[]> = {
  PIT:      ['box', 'pit', 'stop', 'undercut', 'overcut', 'ピット', '入る'],
  TYRE:     ['tyre', 'tire', 'compound', 'soft', 'medium', 'hard', 'graining', 'blister', 'タイヤ', 'グリップ'],
  SAFETY:   ['safety car', 'vsc', 'virtual', 'yellow', 'red flag', 'セーフティカー', 'フラッグ', 'sc'],
  STRATEGY: ['plan', 'strategy', 'gap', 'push', 'manage', 'fuel', 'engine mode', 'mode', 'プラン', 'ストラテジー'],
  PACE:     ['pace', 'lap', 'sector', 'push', 'good', 'well done', 'ペース', 'タイム'],
};

function classifyCategory(text: string): TranscribeResponse['category'] {
  const lower = text.toLowerCase();
  for (const [cat, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some(kw => lower.includes(kw))) {
      return cat as TranscribeResponse['category'];
    }
  }
  return 'PACE';
}

const ALLOWED_AUDIO_HOSTS = ['livetiming.formula1.com', 'api.openf1.org', 'openf1.org'];

async function fetchAudioAsBase64(url: string): Promise<{ data: string; mimeType: string }> {
  let parsedUrl: URL;
  try {
    parsedUrl = new URL(url);
  } catch {
    throw new Error('Invalid audio URL');
  }
  if (!ALLOWED_AUDIO_HOSTS.includes(parsedUrl.hostname)) {
    throw new Error('Audio URL is not from an allowed host');
  }

  const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
  if (!res.ok) throw new Error(`Audio fetch failed: ${res.status}`);

  const contentLength = res.headers.get('content-length');
  if (contentLength && parseInt(contentLength, 10) > 10 * 1024 * 1024) {
    throw new Error('Audio file is too large (max 10MB)');
  }

  const contentType = res.headers.get('content-type') ?? 'audio/mpeg';
  const mimeType = contentType.split(';')[0].trim();

  const buffer = await res.arrayBuffer();
  if (buffer.byteLength > 10 * 1024 * 1024) {
    throw new Error('Audio file is too large (max 10MB)');
  }
  const data = Buffer.from(buffer).toString('base64');
  return { data, mimeType };
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized: チーム無線AI解析の利用にはログイン（またはデモアカウント）が必要です。' },
        { status: 401 }
      );
    }

    const body = (await req.json()) as TranscribeRequest;
    const { audioUrl, driverName, lapNumber, lapContext } = body;

    if (!audioUrl) {
      return NextResponse.json({ error: 'audioUrl is required' }, { status: 400 });
    }

    const apiKey =
      process.env.GEMINI_API_KEY ??
      req.headers.get('x-gemini-key') ??
      '';

    if (!apiKey) {
      return NextResponse.json({ error: 'GEMINI_API_KEY not configured' }, { status: 503 });
    }

    // Fetch audio and convert to base64
    const { data, mimeType } = await fetchAudioAsBase64(audioUrl);

    const genAI = new GoogleGenerativeAI(apiKey);

    const contextSection = lapContext
      ? `\n\n--- RACE TELEMETRY CONTEXT AT THIS MOMENT ---
Driver: ${driverName ?? 'Driver'}
Lap: ${lapNumber ?? 'Unknown'}
Context: ${lapContext}
--- END CONTEXT ---`
      : '';

    const prompt = `You are an elite Formula 1 race engineer and strategist.
Listen to this team radio clip and analyze it with the provided telemetry context.

${contextSection}

Provide:
1. transcript: Accurate verbatim English transcript of the radio message.
2. translation: Natural Japanese translation of what was said.
3. aiSummary: 1-2 sentence concise Japanese tactical explanation of the driver/engineer's strategic intent, considering the race context (e.g. why they are boxing, managing tyres, reacting to a delta, etc.).
4. category: Exactly one of "PIT", "TYRE", "PACE", "SAFETY", "STRATEGY".

Respond ONLY in this exact JSON format (no markdown code fences, no extra text):
{
  "transcript": "<verbatim english transcript>",
  "translation": "<natural japanese translation>",
  "aiSummary": "<tactical context & intent in Japanese>",
  "category": "<one of: PIT, TYRE, PACE, SAFETY, STRATEGY>"
}`;

    let lastError: Error = new Error('No models available');
    let text = '';

    for (const modelName of FLASH_MODELS) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent([
          prompt,
          { inlineData: { data, mimeType } },
        ]);
        text = result.response.text().trim();
        break; // Success!
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        const isUnavailable =
          msg.includes('404') ||
          msg.toLowerCase().includes('not found') ||
          msg.toLowerCase().includes('no longer available') ||
          msg.toLowerCase().includes('deprecated');

        console.warn(`[transcribe] Model "${modelName}" failed (${isUnavailable ? 'unavailable' : 'error'}): ${msg}`);
        if (isUnavailable) {
          lastError = err instanceof Error ? err : new Error(msg);
          continue;
        }
        throw err;
      }
    }

    if (!text) {
      throw lastError;
    }

    // Parse JSON response
    let parsed: TranscribeResponse;
    try {
      const jsonText = text.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();
      parsed = JSON.parse(jsonText) as TranscribeResponse;
      if (!parsed.aiSummary) {
        parsed.aiSummary = parsed.translation;
      }
    } catch {
      // Fallback: extract from raw text
      parsed = {
        transcript: text,
        translation: '(翻訳の解析に失敗しました)',
        aiSummary: text,
        category: classifyCategory(text),
      };
    }

    return NextResponse.json(parsed);
  } catch (err) {
    console.error('[/api/transcribe] Error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
