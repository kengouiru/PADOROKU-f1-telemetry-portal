/**
 * app/api/strategist/route.ts
 * BFF — Gemini AI Race Strategist (Streaming)
 *
 * Model priority (Flash): gemini-3.5-flash-lite → gemini-3.5-flash → gemini-2.5-flash → gemini-2.5-flash-lite → gemini-flash-latest
 * Model priority (Pro):   gemini-3.1-pro → gemini-2.5-pro → gemini-pro-latest → gemini-3.5-flash
 * Auto-retries with next model name on 404 / model not found / deprecated model.
 */

import { NextRequest } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { auth } from '@/auth';

export const runtime = 'nodejs';

export interface StrategistMessage {
  role: 'user' | 'model';
  content: string;
}

export interface StrategistRequest {
  messages: StrategistMessage[];
  /** Pre-built telemetry context summary */
  context: string;
  /** 'flash' (default) | 'pro' */
  model?: 'flash' | 'pro';
}

// ── Model name candidates (tried in order) ─────────────────────────────────────
const FLASH_MODELS = [
  'gemini-3.5-flash-lite',
  'gemini-3.5-flash',
  'gemini-2.5-flash',
  'gemini-2.5-flash-lite',
  'gemini-flash-latest',
];

const PRO_MODELS = [
  'gemini-3.1-pro',
  'gemini-2.5-pro',
  'gemini-pro-latest',
  'gemini-3.5-flash',
];

// ── System Prompt ──────────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are an expert Formula 1 race strategist and data analyst.
You are analyzing real telemetry data provided below.
Always respond in Japanese (日本語) unless the user explicitly asks for English.
Be specific, data-driven, and insightful. Reference actual lap numbers, lap times, and driver names from the data.
Keep responses focused and concise (under 500 characters) unless the user asks for more detail.`;

// ── Helper: try multiple model names with auto-retry on 404 / deprecation ───────
async function tryModels(
  genAI: GoogleGenerativeAI,
  candidates: string[],
  fn: (modelName: string) => Promise<ReadableStream>
): Promise<{ stream: ReadableStream; modelUsed: string }> {
  let lastError: Error = new Error('No models available');

  for (const name of candidates) {
    try {
      const stream = await fn(name);
      return { stream, modelUsed: name };
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      const isUnavailable =
        msg.includes('404') ||
        msg.toLowerCase().includes('not found') ||
        msg.toLowerCase().includes('no longer available') ||
        msg.toLowerCase().includes('deprecated');

      console.warn(`[strategist] Model "${name}" failed (${isUnavailable ? 'unavailable' : 'error'}): ${msg}`);
      if (isUnavailable) {
        lastError = err instanceof Error ? err : new Error(msg);
        continue; // try next model
      }
      throw err; // non-404 errors (auth, quota, etc.) are re-thrown immediately
    }
  }

  throw lastError;
}

// ── POST handler ───────────────────────────────────────────────────────────────
export async function POST(req: NextRequest): Promise<Response> {
  try {
    // ── Session Guard ──
    const session = await auth();
    if (!session?.user) {
      return Response.json(
        { error: 'Unauthorized: AI戦略アナリストの利用にはメンバー認証（ログイン）が必要です。' },
        { status: 401 }
      );
    }

    const body = (await req.json()) as StrategistRequest;
    const { messages, context, model: modelChoice = 'flash' } = body;

    if (!messages?.length) {
      return Response.json({ error: 'messages required' }, { status: 400 });
    }

    const apiKey =
      process.env.GEMINI_API_KEY ??
      req.headers.get('x-gemini-key') ??
      '';

    if (!apiKey) {
      return Response.json({ error: 'GEMINI_API_KEY not configured' }, { status: 503 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const candidates = modelChoice === 'pro' ? PRO_MODELS : FLASH_MODELS;

    // Build full context string (prepended to first user message only)
    const systemContext = `${SYSTEM_PROMPT}\n\n--- TELEMETRY DATA ---\n${context}\n--- END DATA ---`;

    const history = messages.slice(0, -1).map(m => ({
      role: m.role as 'user' | 'model',
      parts: [{ text: m.content }],
    }));

    const lastMsg = messages[messages.length - 1];
    const userContent =
      history.length === 0
        ? `${systemContext}\n\n${lastMsg.content}`
        : lastMsg.content;

    // Try each model candidate until one works
    const { stream } = await tryModels(genAI, candidates, async (modelName) => {
      const model = genAI.getGenerativeModel({ model: modelName });
      const chat = model.startChat({ history });
      const result = await chat.sendMessageStream(userContent);

      return new ReadableStream({
        async start(controller) {
          try {
            for await (const chunk of result.stream) {
              const text = chunk.text();
              if (text) controller.enqueue(new TextEncoder().encode(text));
            }
          } catch (e) {
            controller.error(e);
          } finally {
            controller.close();
          }
        },
      });
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
        'X-Accel-Buffering': 'no',
        'Cache-Control': 'no-store',
      },
    });
  } catch (err) {
    console.error('[/api/strategist] Fatal:', err);
    const message = err instanceof Error ? err.message : 'Unknown error';
    const status = message.includes('API_KEY') || message.includes('403') ? 403
                 : message.includes('404') || message.includes('not found') || message.includes('available') ? 404
                 : 500;
    return Response.json({ error: message }, { status });
  }
}
