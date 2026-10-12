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
import RewardAdModal from '@/components/ads/RewardAdModal';

// ── Types ──────────────────────────────────────────────────────────────────────

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  isStreaming?: boolean;
  attachment?: { data: string; mimeType: string; name: string };
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
        icon: '',
        label: `${lapLabel}${d1} vs ${d2} テレメトリーを開く`,
        circuitId,
        driver1: d1,
        driver2: d2,
        lapNumber: lap,
      });
    } else if (category === 'stints') {
      actions.push({
        type: 'stints',
        icon: '',
        label: 'タイヤ・スティント推移を見る',
      });
    } else if (category === 'pit_sim') {
      actions.push({
        type: 'pit_sim',
        icon: '',
        label: 'ピット戦略シミュレーターを試す',
      });
    } else if (category === 'radio') {
      const lap = parts[1] ? parseInt(parts[1]) : undefined;
      const lapLabel = lap ? `(Lap ${lap})` : '';
      actions.push({
        type: 'radio',
        icon: '',
        label: `チーム無線タイムライン ${lapLabel}`.trim(),
        lapNumber: lap,
      });
    } else if (category === 'library') {
      const sub = parts[1];
      if (sub === 'tyres') {
        actions.push({ type: 'library_tyres', icon: '', label: 'タイヤ大百科（C1〜C5性能解説）を開く' });
      } else if (sub === 'circuits') {
        const cId = parts[2];
        actions.push({ type: 'library_circuits', icon: '', label: `サーキット詳細ガイドを開く`, circuitId: cId });
      } else if (sub === 'regulations') {
        actions.push({ type: 'library_regulations', icon: '', label: 'FIA公式競技規則・ペナルティ基準を開く' });
      } else if (sub === 'glossary') {
        const termId = parts[2];
        actions.push({ type: 'library_glossary', icon: '', label: `用語図解・解説を開く`, termId });
      } else if (sub === 'drama') {
        actions.push({ type: 'library_drama', icon: '', label: 'F1歴史的ドラマ・ライバル列伝を開く' });
      }
    } else if (category === 'quiz') {
      actions.push({ type: 'quiz', icon: '', label: '関連F1クイズに挑戦する' });
    }
  }

  const cleanContent = content.replace(/\[NAV:[^\]]+\]/g, '').trimEnd();
  return { cleanContent, actions };
}

interface StrategistMessage {
  role: 'user' | 'model';
  content: string;
  attachment?: { data: string; mimeType: string; name: string };
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
    icon: '',
    label: 'デグラデーション',
    prompt: '各ドライバーのタイヤデグラデーション（劣化ペース）を比較・分析してください。スティントごとに具体的な数値を使って説明してください。',
  },
  {
    icon: '',
    label: 'ピット戦略',
    prompt: 'ピット戦略（アンダーカット・オーバーカット）の観点からレースを分析してください。誰の戦略が最も効果的でしたか？',
  },
  {
    icon: '',
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
  const { isPro, aiUsage, consumeAi, addBonus } = usePlanTier();
  const [showRewardModal, setShowRewardModal] = useState<boolean>(false);
  const [useUltraRegulations, setUseUltraRegulations] = useState<boolean>(false);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [attachedFile, setAttachedFile] = useState<{ file: File; base64: string } | null>(null);

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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Str = event.target?.result as string;
      setAttachedFile({ file, base64: base64Str });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

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
  const sendMessage = useCallback(async (textToSend: string, options?: { includeRaw?: boolean }) => {
    const trimmed = textToSend.trim();
    if (!trimmed || isStreaming) return;
    const includeRaw = options?.includeRaw ?? false;

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
          content: `**本日のAI戦略相談枠（無料分）の上限に達しました**

ヘッダーの「+2回」ボタンから公式スポンサー案内を視聴すると質問枠を即座に回復できます。
また、回数無制限で活用するには**「Pitwall Pro」**へアップグレードしてください。`,
          isStreaming: false,
        },
      ]);
      setInput('');
      return;
    }

    const userMsgId = `user_${Date.now()}`;
    const aiMsgId = `ai_${Date.now()}`;

    const attachmentPayload = attachedFile ? {
      data: attachedFile.base64.replace(/^data:.*?;base64,/, ''),
      mimeType: attachedFile.file.type,
      name: attachedFile.file.name,
    } : undefined;

    const userMsg: ChatMessage = { id: userMsgId, role: 'user', content: trimmed, attachment: attachmentPayload };
    const aiMsg: ChatMessage = { id: aiMsgId, role: 'model', content: '', isStreaming: true };

    setMessages(prev => [...prev, userMsg, aiMsg]);
    setInput('');
    setAttachedFile(null);
    setIsStreaming(true);

    // Build history for API (exclude the blank AI placeholder)
    const history: StrategistMessage[] = [
      ...messages.map(m => ({ role: m.role, content: m.content, attachment: m.attachment })),
      { role: 'user', content: trimmed, attachment: attachmentPayload },
    ];

    abortRef.current = new AbortController();

    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      const effectiveKey = apiKey;
      if (effectiveKey) headers['x-gemini-key'] = effectiveKey;

      let rawTelemetryData = undefined;
      if (includeRaw) {
        rawTelemetryData = JSON.stringify({
          lapsCache,
          stints,
          pitStopsCache,
          selectedDrivers,
        });
      }

      const res = await fetch('/api/strategist', {
        method: 'POST',
        headers,
        signal: abortRef.current.signal,
        body: JSON.stringify({ 
          messages: history, 
          context: getContext(), 
          model: modelChoice,
          includeFiaRegulations: useUltraRegulations,
          rawTelemetryData 
        }),
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
          ? { ...m, isStreaming: false, content: `エラー: ${msg}\n\nGemini API接続に問題が発生しました。しばらく時間を置いてお試しください。` }
          : m
        )
      );
    } finally {
      setIsStreaming(false);
      inputRef.current?.focus();
    }
  }, [isStreaming, messages, attachedFile, apiKey, getContext, modelChoice, authSession, onRequireAuth, isPro, aiUsage, consumeAi, onOpenUpgradeModal, useUltraRegulations, lapsCache, stints, pitStopsCache, selectedDrivers]);

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
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono font-bold flex items-center gap-1 shadow-sm">
                <span>PRO</span>
              </span>
            ) : (
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={onOpenUpgradeModal}
                  className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 border border-white/10 font-mono flex items-center gap-1 cursor-pointer transition-colors"
                  title="無料プランの本日残り利用回数（クリックでPro詳細）"
                >
                  <span>{aiUsage.remaining}/{aiUsage.max}回</span>
                  <span className="text-amber-400 font-bold">PRO</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowRewardModal(true)}
                  className="text-[11px] px-2 py-0.5 rounded-full bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 font-mono font-bold flex items-center gap-1 cursor-pointer transition-colors"
                  title="公式スポンサー案内を見て質問回数を+2回回復する"
                >
                  <span>+2回</span>
                </button>
              </div>
            )}

            
            <select
              value={modelChoice}
              onChange={e => setModelChoice(e.target.value as 'flash' | 'pro')}
              className="text-xs bg-slate-800 border border-white/10 text-slate-300 rounded px-2 py-1 focus:outline-none cursor-pointer"
            >
              <option value="flash">Flash </option>
              <option value="pro">Pro </option>
            </select>
            <label className="flex items-center gap-1.5 cursor-pointer group pl-1">
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  checked={useUltraRegulations}
                  onChange={(e) => setUseUltraRegulations(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-7 h-4 bg-slate-700 rounded-full peer-checked:bg-indigo-600 transition-colors"></div>
                <div className="absolute left-[2px] top-[2px] bg-white w-3 h-3 rounded-full transition-transform peer-checked:translate-x-3"></div>
              </div>
              <span className="text-xs font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400 hidden sm:inline-block">
                📚 2026 FIA Regulations <span className="text-[10px] bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-900 px-1.5 py-0.5 rounded font-black tracking-wider shadow-[0_0_5px_rgba(251,191,36,0.6)] ml-1">PRO</span>
              </span>
              <span className="text-xs font-bold text-indigo-400 sm:hidden">
                📚 <span className="text-[9px] bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-900 px-1 py-0.5 rounded font-black shadow-[0_0_5px_rgba(251,191,36,0.6)] ml-1">PRO</span>
              </span>
            </label>
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
                  : 'border-white/15 text-slate-300 hover:border-slate-400/60 hover:text-slate-200 hover:bg-slate-400/10 cursor-pointer'
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
          <div className="p-3 mb-2 rounded-2xl bg-gradient-to-r from-slate-900/70 to-slate-900/70 border border-slate-400/40 text-xs text-slate-100 flex items-center justify-between gap-3 shadow-lg">
            <div className="space-y-0.5">
              <p className="font-racing font-bold text-white flex items-center gap-1.5">
                <span>PROメンバー専用機能</span>
              </p>
              <p className="text-[11px] text-slate-300">
                AI戦略アナリストの利用にはログイン（またはデモアカウント）が必要です。
              </p>
            </div>
            <button
              onClick={() => onRequireAuth?.()}
              className="flex-shrink-0 px-3 py-1.5 rounded-xl bg-gradient-to-r from-slate-400 to-slate-500 hover:from-slate-300 hover:to-slate-400 text-white font-racing font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              ログイン
            </button>
          </div>
        )}

        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-24 text-slate-600 text-xs gap-2 text-center">
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
        {attachedFile && (
          <div className="flex items-center gap-2 mb-2 px-3 py-1.5 bg-slate-800/80 rounded-lg w-max border border-slate-700/50">
            <span className="text-xs text-slate-300 truncate max-w-[200px]" title={attachedFile.file.name}>
              📎 {attachedFile.file.name}
            </span>
            <button
              type="button"
              onClick={() => setAttachedFile(null)}
              className="text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center gap-2">
          <input
            type="file"
            accept="image/*,audio/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex-shrink-0 p-2 h-10 w-10 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors cursor-pointer flex items-center justify-center"
            title="ファイルを添付"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13" /></svg>
          </button>
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={noDrivers ? "ドライバーを選択してください..." : "質問を入力..."}
            disabled={isStreaming || noDrivers}
            rows={2}
            className="flex-1 bg-slate-800/70 border border-white/10 text-slate-200 text-xs rounded-lg px-3 py-2.5 focus:outline-none focus:border-slate-400/50 placeholder:text-slate-600 resize-none disabled:opacity-50 h-10 leading-relaxed"
          />
          </div>
          <div className="flex justify-end gap-2 items-center w-full">
          {isStreaming ? (
            <button
              type="button"
              onClick={handleStop}
              className="flex-shrink-0 px-3 py-2 h-10 text-xs bg-red-600/90 hover:bg-red-500 text-white rounded-lg transition-colors font-medium"
            >
              停止
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={() => sendMessage(input, { includeRaw: true })}
                disabled={!input.trim() || noDrivers}
                title="生データを含めて送信"
                className="flex-shrink-0 px-2.5 py-2 h-10 text-xs bg-indigo-600/90 hover:bg-indigo-500 disabled:bg-slate-700 disabled:text-slate-500 text-white rounded-lg transition-colors font-medium flex items-center justify-center gap-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1"><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" /></svg><span className="hidden sm:inline">DATA</span><span className="ml-1 text-[9px] font-black bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-900 px-1 rounded-sm shadow-[0_0_8px_rgba(251,191,36,0.5)] tracking-wide">PRO</span>
              </button>
              <button
                type="button"
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || noDrivers}
                className="flex-shrink-0 px-3 py-2 h-10 text-xs bg-slate-500 hover:bg-slate-400 disabled:bg-slate-700 disabled:text-slate-500 text-white rounded-lg transition-colors font-medium"
              >
                送信
              </button>
            </>
          )}
          </div>
        </div>
        <p className="text-xs text-slate-700 mt-1">Enter: 送信 ／ Shift+Enter: 改行</p>
      </div>

      {/* ── API Key Settings Modal ── */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-white/15 rounded-2xl p-5 max-w-md w-full shadow-2xl space-y-4 text-slate-200">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-racing font-bold text-sm text-white flex items-center gap-2">
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
                    <span className="text-emerald-400">APIキー設定済み（Gemini実機通信）</span>
                  ) : (
                    <span className="text-amber-400">デモAIモード稼働中（APIキー不要）</span>
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
                className="w-full bg-slate-950 border border-white/15 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-slate-400 transition-colors font-mono"
              />
              <p className="text-[11px] text-slate-500">
                キーはお使いのブラウザのlocalStorageにのみ安全に保存され、第三者サーバーには保存されません。
              </p>
            </div>

            <div className="pt-1 text-right">
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-slate-300 hover:text-slate-200 underline inline-flex items-center gap-1"
              >
                <span>Google AI Studioで無料のAPIキーを取得 (Google公式)</span>
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
                  className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-slate-400 to-slate-500 hover:from-slate-300 hover:to-slate-400 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                >
                  保存する
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Rewarded Ad Modal for Quota Recovery ── */}
      <RewardAdModal
        isOpen={showRewardModal}
        onClose={() => setShowRewardModal(false)}
        onRewardGranted={(bonus) => {
          addBonus(bonus);
        }}
        onUpgradeClick={onOpenUpgradeModal}
      />
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
            ? 'bg-slate-500/90 text-white rounded-br-sm'
            : 'bg-slate-800/85 text-slate-200 rounded-bl-sm border border-white/10'
        }`}
      >
        {message.isStreaming && !cleanContent
          ? <ThinkingDots />
          : cleanContent}
        {message.isStreaming && cleanContent && (
          <span className="inline-block w-1.5 h-3.5 bg-slate-300 ml-0.5 animate-pulse rounded-sm align-text-bottom" />
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
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-slate-900/90 via-slate-900/80 to-slate-800/70 hover:from-slate-800 hover:to-indigo-850 border border-slate-300/40 hover:border-slate-200 text-slate-100 hover:text-white text-xs font-racing font-bold shadow-md transition-all cursor-pointer group active:scale-95"
            >
              <span className="text-sm group-hover:scale-110 transition-transform">{act.icon}</span>
              <span>{act.label}</span>
              <span className="text-[11px] text-slate-300 group-hover:translate-x-0.5 transition-transform">➔</span>
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
              <span>{isSpeaking ? '' : ''}</span>
              <span>{isSpeaking ? '交信中...' : '無線音声'}</span>
            </button>
          )}
          <button
            onClick={() => onAddToNotebook(cleanContent)}
            className="text-xs text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
          >
            ノートに追加
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
