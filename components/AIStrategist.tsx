'use client';

/**
 * components/AIStrategist.tsx  [REWRITE]
 *
 * Layout strategy:
 *  - Header (quick buttons + model select): always visible, flex-shrink-0
 *  - Chat history: max-h-[380px] overflow-y-auto (grows, then scrolls)
 *  - Input bar: always at bottom, flex-shrink-0
 *
 * This avoids relying on `h-full` height inheritance which breaks
 * when the parent flex chain is misconfigured.
 */

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import type { Driver, Lap, Stint, PitStop, Session } from '@/lib/types';
import type { StrategistMessage } from '@/app/api/strategist/route';
import { buildTelemetryContext } from '@/lib/telemetryContext';

// ── Types ──────────────────────────────────────────────────────────────────────

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  isStreaming?: boolean;
}

interface AIStrategistProps {
  selectedDrivers: string[];
  drivers: Driver[];
  lapsCache: Record<string, Lap[]>;
  stints: Stint[];
  pitStopsCache: Record<string, PitStop[]>;
  geminiApiKey: string;
  session?: Session | null;
  onAddToNotebook: (content: string, source: 'ai') => void;
  onRequireAuth?: () => void;
}

// ── Quick prompts ──────────────────────────────────────────────────────────────

const QUICK_PROMPTS = [
  {
    icon: '⚡',
    label: 'デグラデーション',
    prompt: '各ドライバーのタイヤデグラデーション（劣化ペース）を比較・分析してください。スティントごとに具体的な数値を使って説明してください。',
  },
  {
    icon: '⛽',
    label: 'ピット戦略',
    prompt: 'ピット戦略（アンダーカット・オーバーカット）の観点からレースを分析してください。誰の戦略が最も効果的でしたか？',
  },
  {
    icon: '🎯',
    label: 'ターニングポイント',
    prompt: 'このレースの勝負所・ターニングポイントはどこでしたか？ラップタイムデータから順位変動の可能性がある局面を解説してください。',
  },
] as const;

// ── Main Component ─────────────────────────────────────────────────────────────

export default function AIStrategist({
  selectedDrivers,
  drivers,
  lapsCache,
  stints,
  pitStopsCache,
  geminiApiKey,
  session,
  onAddToNotebook,
  onRequireAuth,
}: AIStrategistProps) {
  const { data: authSession } = useSession();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [modelChoice, setModelChoice] = useState<'flash' | 'pro'>('flash');

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  // Build telemetry context for Gemini
  const getContext = useCallback(
    () => buildTelemetryContext({ session, selectedDrivers, drivers, lapsCache, stints, pitStopsCache }),
    [session, selectedDrivers, drivers, lapsCache, stints, pitStopsCache]
  );

  // Core: send message and stream response
  const sendMessage = useCallback(async (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed || isStreaming) return;

    if (!authSession?.user) {
      onRequireAuth?.();
      return;
    }

    const userMsgId = `user_${Date.now()}`;
    const aiMsgId = `ai_${Date.now()}`;

    const userMsg: ChatMessage = { id: userMsgId, role: 'user', content: trimmed };
    const aiMsg: ChatMessage = { id: aiMsgId, role: 'model', content: '', isStreaming: true };

    setMessages(prev => [...prev, userMsg, aiMsg]);
    setInput('');
    setIsStreaming(true);

    // Build history for API (exclude the blank AI placeholder)
    const history: StrategistMessage[] = [
      ...messages.map(m => ({ role: m.role, content: m.content })),
      { role: 'user', content: trimmed },
    ];

    abortRef.current = new AbortController();

    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (geminiApiKey) headers['x-gemini-key'] = geminiApiKey;

      const res = await fetch('/api/strategist', {
        method: 'POST',
        headers,
        signal: abortRef.current.signal,
        body: JSON.stringify({ messages: history, context: getContext(), model: modelChoice }),
      });

      if (res.status === 401) {
        onRequireAuth?.();
        throw new Error('ログインが必要です。メンバーログインまたはデモアカウントでサインインしてください。');
      }

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
        throw new Error(errJson.error ?? `HTTP ${res.status}`);
      }
      if (!res.body) throw new Error('No response body from server');

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = '';

      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        const snapshot = acc;
        setMessages(prev =>
          prev.map(m => m.id === aiMsgId ? { ...m, content: snapshot } : m)
        );
      }

      setMessages(prev =>
        prev.map(m => m.id === aiMsgId ? { ...m, isStreaming: false, content: acc } : m)
      );
    } catch (err) {
      if ((err as Error).name === 'AbortError') return;
      const msg = err instanceof Error ? err.message : 'Unknown error';
      setMessages(prev =>
        prev.map(m => m.id === aiMsgId
          ? { ...m, isStreaming: false, content: `⚠️ エラー: ${msg}\n\nGemini API キーをサイドバーの「AI SETTINGS」に設定してください。` }
          : m
        )
      );
    } finally {
      setIsStreaming(false);
      inputRef.current?.focus();
    }
  }, [isStreaming, messages, geminiApiKey, getContext, modelChoice, authSession, onRequireAuth]);

  const handleStop = () => {
    abortRef.current?.abort();
    setIsStreaming(false);
    setMessages(prev => prev.map(m => m.isStreaming ? { ...m, isStreaming: false } : m));
  };

  const handleClear = () => {
    abortRef.current?.abort();
    setMessages([]);
    setIsStreaming(false);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Enter without Shift → send
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const noDrivers = selectedDrivers.length === 0;

  return (
    <div className="glass-card flex flex-col overflow-hidden">

      {/* ── Header ── */}
      <div className="flex-shrink-0 px-4 pt-4 pb-3 border-b border-white/10">
        {/* Title row */}
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-racing font-bold text-white tracking-widest border-l-2 border-f1-red pl-2 uppercase">
            AI STRATEGIST
          </h3>
          <div className="flex items-center gap-2">
            <select
              value={modelChoice}
              onChange={e => setModelChoice(e.target.value as 'flash' | 'pro')}
              className="text-xs bg-slate-800 border border-white/10 text-slate-300 rounded px-2 py-1 focus:outline-none cursor-pointer"
            >
              <option value="flash">Flash ⚡</option>
              <option value="pro">Pro 🎯</option>
            </select>
            {messages.length > 0 && (
              <button
                onClick={handleClear}
                className="text-xs text-slate-500 hover:text-slate-300 transition-colors px-1"
              >
                クリア
              </button>
            )}
          </div>
        </div>

        {/* Quick prompt buttons */}
        <div className="flex gap-1.5 flex-wrap">
          {QUICK_PROMPTS.map(qp => (
            <button
              key={qp.label}
              onClick={() => sendMessage(qp.prompt)}
              disabled={isStreaming || noDrivers}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full border text-xs font-medium transition-colors ${
                noDrivers || isStreaming
                  ? 'border-white/5 text-slate-600 cursor-not-allowed'
                  : 'border-white/15 text-slate-300 hover:border-blue-500/60 hover:text-blue-300 hover:bg-blue-500/10 cursor-pointer'
              }`}
            >
              <span>{qp.icon}</span>
              <span>{qp.label}</span>
            </button>
          ))}
        </div>

        {noDrivers && (
          <p className="text-xs text-slate-600 mt-2">← ドライバーを選択してAI分析を開始</p>
        )}
      </div>

      {/* ── Chat history ── max-h so it scrolls, doesn't need parent h-full */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-3 flex flex-col gap-3"
        style={{ maxHeight: 380, minHeight: 100 }}
      >
        {!authSession?.user && (
          <div className="p-3 mb-2 rounded-2xl bg-gradient-to-r from-blue-950/70 to-indigo-950/70 border border-sky-500/40 text-xs text-sky-200 flex items-center justify-between gap-3 shadow-lg">
            <div className="space-y-0.5">
              <p className="font-racing font-bold text-white flex items-center gap-1.5">
                <span>🔒</span>
                <span>PROメンバー専用機能</span>
              </p>
              <p className="text-[11px] text-slate-300">
                AI戦略アナリストの利用にはログイン（またはデモアカウント）が必要です。
              </p>
            </div>
            <button
              onClick={() => onRequireAuth?.()}
              className="flex-shrink-0 px-3 py-1.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-racing font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              ログイン
            </button>
          </div>
        )}

        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-24 text-slate-600 text-xs gap-2 text-center">
            <span className="text-2xl">🏎</span>
            <span>上のボタンで即時分析、または<br />下の入力欄から自由に質問できます</span>
          </div>
        ) : (
          messages.map(msg => (
            <MessageBubble
              key={msg.id}
              message={msg}
              onAddToNotebook={content => onAddToNotebook(content, 'ai')}
            />
          ))
        )}
      </div>

      {/* ── Input bar (always visible) ── */}
      <div className="flex-shrink-0 border-t border-white/10 p-3 bg-slate-900/30">
        <div className="flex gap-2 items-end">
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={noDrivers ? 'ドライバーを選択してください...' : 'テレメトリについて質問... (Enter 送信 / Shift+Enter 改行)'}
            disabled={isStreaming || noDrivers}
            rows={2}
            className="flex-1 bg-slate-800/70 border border-white/10 text-slate-200 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500/50 placeholder:text-slate-600 resize-none disabled:opacity-50"
          />
          {isStreaming ? (
            <button
              type="button"
              onClick={handleStop}
              className="flex-shrink-0 px-3 py-2 h-10 text-xs bg-red-600/90 hover:bg-red-500 text-white rounded-lg transition-colors font-medium"
            >
              ⏹ 停止
            </button>
          ) : (
            <button
              type="button"
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || noDrivers}
              className="flex-shrink-0 px-3 py-2 h-10 text-xs bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500 text-white rounded-lg transition-colors font-medium"
            >
              ✈ 送信
            </button>
          )}
        </div>
        <p className="text-xs text-slate-700 mt-1">Enter: 送信 ／ Shift+Enter: 改行</p>
      </div>
    </div>
  );
}

// ── Message Bubble ─────────────────────────────────────────────────────────────

function MessageBubble({
  message,
  onAddToNotebook,
}: {
  message: ChatMessage;
  onAddToNotebook: (content: string) => void;
}) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex flex-col gap-1 ${isUser ? 'items-end' : 'items-start'}`}>
      <div
        className={`max-w-[90%] text-xs leading-relaxed whitespace-pre-wrap rounded-2xl px-3 py-2 ${
          isUser
            ? 'bg-blue-600/85 text-white rounded-br-sm'
            : 'bg-slate-700/70 text-slate-200 rounded-bl-sm border border-white/8'
        }`}
      >
        {message.isStreaming && !message.content
          ? <ThinkingDots />
          : message.content}
        {message.isStreaming && message.content && (
          <span className="inline-block w-1.5 h-3.5 bg-blue-400 ml-0.5 animate-pulse rounded-sm align-text-bottom" />
        )}
      </div>

      {/* AI message actions */}
      {!isUser && !message.isStreaming && message.content && (
        <div className="flex gap-3 px-1">
          <button
            onClick={() => onAddToNotebook(message.content)}
            className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
          >
            📝 ノートに追加
          </button>
          <button
            onClick={() => navigator.clipboard.writeText(message.content)}
            className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
          >
            コピー
          </button>
        </div>
      )}
    </div>
  );
}

// ── Thinking animation ─────────────────────────────────────────────────────────

function ThinkingDots() {
  return (
    <span className="flex gap-1 items-center h-4">
      {[0, 1, 2].map(i => (
        <span
          key={i}
          className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </span>
  );
}
