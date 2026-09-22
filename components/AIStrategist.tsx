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

import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import type { Driver, Lap, Stint, PitStop, Session } from '@/lib/types';
import { buildTelemetryContext } from '@/lib/telemetryContext';
import { playRadioSpeech, stopRadioSpeech } from '@/lib/radioAudioEffect';

import { usePlanTier } from '@/lib/tierService';
import { useGeminiApiKey } from '@/lib/apiKeyService';

// ── Types ──────────────────────────────────────────────────────────────────────

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  isStreaming?: boolean;
}

// ── Navigation Action Types ───────────────────────────────────────────────────

export interface NavAction {
  type:
    | 'telemetry'
    | 'stints'
    | 'pit_sim'
    | 'radio'
    | 'library_tyres'
    | 'library_circuits'
    | 'library_regulations'
    | 'library_glossary'
    | 'library_drama'
    | 'quiz';
  label: string;
  icon: string;
  circuitId?: string;
  driver1?: string;
  driver2?: string;
  lapNumber?: number;
  termId?: string;
}

export function parseNavActions(content: string): { cleanContent: string; actions: NavAction[] } {
  const actions: NavAction[] = [];
  const navRegex = /\[NAV:([^\]]+)\]/g;

  let match;
  while ((match = navRegex.exec(content)) !== null) {
    const rawTag = match[1].trim();
    const parts = rawTag.split(':');
    const category = parts[0];

    if (category === 'telemetry') {
      const circuitId = parts[1] || 'bahrain-international';
      const d1 = parts[2] || 'VER';
      const d2 = parts[3] || 'NOR';
      const lap = parts[4] ? parseInt(parts[4]) : undefined;
      const lapLabel = lap ? `Lap ${lap}: ` : '';
      actions.push({
        type: 'telemetry',
        icon: '🏎️',
        label: `${lapLabel}${d1} vs ${d2} テレメトリーを開く`,
        circuitId,
        driver1: d1,
        driver2: d2,
        lapNumber: lap,
      });
    } else if (category === 'stints') {
      actions.push({
        type: 'stints',
        icon: '🛞',
        label: 'タイヤ・スティント推移を見る',
      });
    } else if (category === 'pit_sim') {
      actions.push({
        type: 'pit_sim',
        icon: '⛽',
        label: 'ピット戦略シミュレーターを試す',
      });
    } else if (category === 'radio') {
      const lap = parts[1] ? parseInt(parts[1]) : undefined;
      const lapLabel = lap ? `(Lap ${lap})` : '';
      actions.push({
        type: 'radio',
        icon: '📻',
        label: `チーム無線タイムライン ${lapLabel}`.trim(),
        lapNumber: lap,
      });
    } else if (category === 'library') {
      const sub = parts[1];
      if (sub === 'tyres') {
        actions.push({ type: 'library_tyres', icon: '🛞', label: 'タイヤ大百科（C1〜C5性能解説）を開く' });
      } else if (sub === 'circuits') {
        const cId = parts[2];
        actions.push({ type: 'library_circuits', icon: '🗺️', label: `サーキット詳細ガイドを開く`, circuitId: cId });
      } else if (sub === 'regulations') {
        actions.push({ type: 'library_regulations', icon: '⚖️', label: 'FIA公式競技規則・ペナルティ基準を開く' });
      } else if (sub === 'glossary') {
        const termId = parts[2];
        actions.push({ type: 'library_glossary', icon: '📖', label: `用語図解・解説を開く`, termId });
      } else if (sub === 'drama') {
        actions.push({ type: 'library_drama', icon: '🎬', label: 'F1歴史的ドラマ・ライバル列伝を開く' });
      }
    } else if (category === 'quiz') {
      actions.push({ type: 'quiz', icon: '🏆', label: '関連F1クイズに挑戦する' });
    }
  }

  const cleanContent = content.replace(/\[NAV:[^\]]+\]/g, '').trimEnd();
  return { cleanContent, actions };
}

interface StrategistMessage {
  role: 'user' | 'model';
  content: string;
}

// ── Props ──────────────────────────────────────────────────────────────────────

interface AIStrategistProps {
  selectedDrivers: string[];
  drivers: Driver[];
  lapsCache: Record<string, Lap[]>;
  stints: Stint[];
  pitStopsCache: Record<string, PitStop[]>;
  session?: Session | null;
  onAddToNotebook: (content: string, source: 'ai') => void;
  onRequireAuth?: () => void;
  onNavigate?: (action: NavAction) => void;
  onOpenUpgradeModal?: () => void;
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
  session,
  onAddToNotebook,
  onRequireAuth,
  onNavigate,
  onOpenUpgradeModal,
}: AIStrategistProps) {
  const { data: authSession } = useSession();
  const { isPro, aiUsage, consumeAi } = usePlanTier();

  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('f1_ai_chat_messages_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed.map((m: ChatMessage) => ({ ...m, isStreaming: false })));
        }
      }
    } catch (_) {}
  }, []);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [modelChoice, setModelChoice] = useState<'flash' | 'pro'>('flash');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);

  // Gemini API Key management via centralized service
  const [storedApiKey, setStoredApiKey] = useGeminiApiKey();
  const [tempApiKey, setTempApiKey] = useState<string>('');
  const [showKeyModal, setShowKeyModal] = useState(false);

  const apiKey = storedApiKey;

  useEffect(() => {
    setTempApiKey(apiKey);
  }, [apiKey]);

  // Persist chat messages across unmount, tab switches, and page reloads
  useEffect(() => {
    if (isStreaming) return;
    try {
      if (messages.length > 0) {
        localStorage.setItem('f1_ai_chat_messages_v1', JSON.stringify(messages));
      }
    } catch (_) {}
  }, [messages, isStreaming]);

  const handleSaveApiKey = () => {
    const trimmed = tempApiKey.trim();
    setStoredApiKey(trimmed);
    setShowKeyModal(false);
  };

  const handleClearApiKey = () => {
    setStoredApiKey('');
    setTempApiKey('');
    setShowKeyModal(false);
  };

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Stop radio speech on unmount
  useEffect(() => {
    return () => {
      stopRadioSpeech();
    };
  }, []);

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

    if (!isPro && aiUsage.remaining <= 0) {
      onOpenUpgradeModal?.();
      const userMsgId = `user_${Date.now()}`;
      const aiMsgId = `ai_${Date.now()}`;
      setMessages(prev => [
        ...prev,
        { id: userMsgId, role: 'user', content: trimmed },
        {
          id: aiMsgId,
          role: 'model',
          content: '💎 **本日の無料AI戦略相談枠（3回）の上限に達しました**\n\nAIストラテジストを回数無制限で活用するには、**「Pitwall Pro」**へアップグレードしてください。',
          isStreaming: false,
        },
      ]);
      setInput('');
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
      const effectiveKey = apiKey;
      if (effectiveKey) headers['x-gemini-key'] = effectiveKey;

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

      consumeAi();

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
          ? { ...m, isStreaming: false, content: `⚠️ エラー: ${msg}\n\nGemini API接続に問題が発生しました。しばらく時間を置いてお試しください。` }
          : m
        )
      );
    } finally {
      setIsStreaming(false);
      inputRef.current?.focus();
    }
  }, [isStreaming, messages, apiKey, getContext, modelChoice, authSession, onRequireAuth, isPro, aiUsage, consumeAi, onOpenUpgradeModal]);

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
    try {
      localStorage.removeItem('f1_ai_chat_messages_v1');
    } catch (_) {}
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
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Tier Quota Badge */}
            {isPro ? (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono font-bold flex items-center gap-1 shadow-sm">
                <span>💎</span>
                <span>PRO</span>
              </span>
            ) : (
              <button
                type="button"
                onClick={onOpenUpgradeModal}
                className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 border border-white/10 font-mono flex items-center gap-1 cursor-pointer transition-colors"
                title="無料プランの本日残り利用回数（クリックでPro詳細）"
              >
                <span>⚡ {aiUsage.remaining}/3回</span>
                <span className="text-amber-400 font-bold">UPGRADE</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                setTempApiKey(apiKey);
                setShowKeyModal(true);
              }}
              title={apiKey ? 'Gemini APIキー設定済み（クリックで変更）' : 'APIキー設定（現在デモAIモード稼働中・クリックで設定）'}
              className={`text-[11px] px-2 py-1 rounded border flex items-center gap-1 transition-all cursor-pointer ${
                apiKey
                  ? 'border-emerald-500/50 bg-emerald-950/40 text-emerald-300 hover:bg-emerald-950/70'
                  : 'border-white/10 bg-slate-800/80 text-slate-400 hover:text-slate-200 hover:border-white/20'
              }`}
            >
              <span>{apiKey ? '🟢 🔑 設定済' : '🔑 キー設定'}</span>
            </button>
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
              isSpeaking={speakingMsgId === msg.id}
              onToggleRadio={() => {
                if (speakingMsgId === msg.id) {
                  stopRadioSpeech();
                  setSpeakingMsgId(null);
                } else {
                  playRadioSpeech(msg.content, {
                    onStart: () => setSpeakingMsgId(msg.id),
                    onEnd: () => setSpeakingMsgId(null),
                    onError: () => setSpeakingMsgId(null),
                  });
                }
              }}
              onAddToNotebook={content => onAddToNotebook(content, 'ai')}
              onNavigate={onNavigate}
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

      {/* ── API Key Settings Modal ── */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-white/15 rounded-2xl p-5 max-w-md w-full shadow-2xl space-y-4 text-slate-200">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-racing font-bold text-sm text-white flex items-center gap-2">
                <span>🔑</span>
                <span>Gemini API キー設定</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowKeyModal(false)}
                className="text-slate-400 hover:text-white text-lg px-1.5 py-0.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs text-slate-300">
              <p>
                Google Gemini APIキーを設定すると、Google AI StudioのGemini 2.5 / 3.5モデルと直接通信して、より高度で自由なレース戦略推論が可能になります。
              </p>
              <div className="p-2.5 rounded-xl bg-slate-800/80 border border-white/10 text-[11px] space-y-1">
                <div className="flex items-center gap-1.5 font-bold">
                  {apiKey ? (
                    <span className="text-emerald-400">🟢 APIキー設定済み（Gemini実機通信）</span>
                  ) : (
                    <span className="text-amber-400">🟡 デモAIモード稼働中（APIキー不要）</span>
                  )}
                </div>
                <p className="text-slate-400 leading-relaxed">
                  ※APIキーが未設定でも、内蔵の「F1デモストラテジストAI」がシミュレーション回答と画面連動アクション（テレメトリー分析インスペクター等）を完全提供します。
                </p>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[11px] font-medium text-slate-300">
                Gemini API Key (AIzaSy...)
              </label>
              <input
                type="password"
                value={tempApiKey}
                onChange={e => setTempApiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full bg-slate-950 border border-white/15 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-sky-500 transition-colors font-mono"
              />
              <p className="text-[10px] text-slate-500">
                キーはお使いのブラウザのlocalStorageにのみ安全に保存され、第三者サーバーには保存されません。
              </p>
            </div>

            <div className="pt-1 text-right">
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-sky-400 hover:text-sky-300 underline inline-flex items-center gap-1"
              >
                <span>Google AI Studioで無料のAPIキーを取得 (Google公式)</span>
                <span>↗</span>
              </a>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-white/10">
              {apiKey ? (
                <button
                  type="button"
                  onClick={handleClearApiKey}
                  className="px-3 py-1.5 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 text-xs transition-colors cursor-pointer"
                >
                  キーを削除（デモに戻す）
                </button>
              ) : (
                <div />
              )}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowKeyModal(false)}
                  className="px-3 py-1.5 rounded-xl border border-white/10 hover:bg-white/5 text-slate-400 hover:text-slate-200 text-xs transition-colors cursor-pointer"
                >
                  キャンセル
                </button>
                <button
                  type="button"
                  onClick={handleSaveApiKey}
                  className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                >
                  保存する
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Message Bubble ─────────────────────────────────────────────────────────────

function MessageBubble({
  message,
  isSpeaking = false,
  onToggleRadio,
  onAddToNotebook,
  onNavigate,
}: {
  message: ChatMessage;
  isSpeaking?: boolean;
  onToggleRadio?: () => void;
  onAddToNotebook: (content: string) => void;
  onNavigate?: (action: NavAction) => void;
}) {
  const isUser = message.role === 'user';

  const { cleanContent, actions } = useMemo(() => {
    if (isUser || !message.content) {
      return { cleanContent: message.content, actions: [] };
    }
    return parseNavActions(message.content);
  }, [isUser, message.content]);

  return (
    <div className={`flex flex-col gap-1.5 ${isUser ? 'items-end' : 'items-start'}`}>
      <div
        className={`max-w-[92%] text-xs leading-relaxed whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 shadow-sm ${
          isUser
            ? 'bg-blue-600/90 text-white rounded-br-sm'
            : 'bg-slate-800/85 text-slate-200 rounded-bl-sm border border-white/10'
        }`}
      >
        {message.isStreaming && !cleanContent
          ? <ThinkingDots />
          : cleanContent}
        {message.isStreaming && cleanContent && (
          <span className="inline-block w-1.5 h-3.5 bg-blue-400 ml-0.5 animate-pulse rounded-sm align-text-bottom" />
        )}
      </div>

      {/* Interactive Navigation Action Chips (Direct App Jumps) */}
      {!isUser && !message.isStreaming && actions.length > 0 && (
        <div className="flex flex-wrap gap-1.5 max-w-[92%] px-1 mt-0.5">
          {actions.map((act: NavAction, idx: number) => (
            <button
              key={idx}
              type="button"
              onClick={() => onNavigate?.(act)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-950/90 via-indigo-950/80 to-blue-900/70 hover:from-blue-900 hover:to-indigo-850 border border-blue-400/40 hover:border-blue-300 text-blue-200 hover:text-white text-xs font-racing font-bold shadow-md transition-all cursor-pointer group active:scale-95"
            >
              <span className="text-sm group-hover:scale-110 transition-transform">{act.icon}</span>
              <span>{act.label}</span>
              <span className="text-[11px] text-blue-400 group-hover:translate-x-0.5 transition-transform">➔</span>
            </button>
          ))}
        </div>
      )}

      {/* AI message actions */}
      {!isUser && !message.isStreaming && cleanContent && (
        <div className="flex items-center gap-2 px-1 mt-0.5">
          {onToggleRadio && (
            <button
              type="button"
              onClick={onToggleRadio}
              className={`text-xs px-2 py-0.5 rounded-lg border transition-all flex items-center gap-1 font-mono cursor-pointer ${
                isSpeaking
                  ? 'bg-red-600 text-white border-red-400 animate-pulse shadow-sm shadow-red-500/40'
                  : 'text-amber-300 hover:text-white bg-amber-950/50 border-amber-500/30 hover:bg-amber-900/60'
              }`}
              title="レースエンジニア風のチーム無線音声で聴く"
            >
              <span>{isSpeaking ? '⏹️' : '📻'}</span>
              <span>{isSpeaking ? '交信中...' : '無線音声'}</span>
            </button>
          )}
          <button
            onClick={() => onAddToNotebook(cleanContent)}
            className="text-xs text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
          >
            📝 ノートに追加
          </button>
          <button
            onClick={() => navigator.clipboard.writeText(cleanContent)}
            className="text-xs text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
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
