'use client';

/**
 * components/hubs/StrategyDetailModal.tsx
 * Comprehensive Deep-Dive Modal for F1 Pit Strategy Concepts & Mathematical Models.
 * Features:
 * - 4 Consolidated Tabs:
 *   1. 📐 戦略公理 & 数理モデル (Theory, Formulations, Strategic Axioms)
 *   2. 🎙️ 象徴的ピット無線ログ (Team Radio Player, Transcript & Translation)
 *   3. 📊 実走テレメトリー再現 (Telemetry Session Data & Direct Link)
 *   4. 📚 一次引用文献 (Academic References with links)
 * - Keyboard navigation (Left/Right to cycle, ESC to close)
 */

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import type { StrategyConcept, TelemetryTarget, EmbeddedRadio } from '@/data/f1KnowledgeData';
import SmartWikiText from '@/components/common/SmartWikiText';
import { getProxiedAudioUrl } from '@/lib/telemetryUtils';

export interface StrategyDetailModalProps {
  strategy: StrategyConcept;
  allStrategies: StrategyConcept[];
  onSelectStrategy: (strat: StrategyConcept) => void;
  onNavigateToTelemetry?: (target?: TelemetryTarget) => void;
  onClose: () => void;
}

type StrategyModalTab = 'theory' | 'radios' | 'telemetry' | 'citations';

export default function StrategyDetailModal({
  strategy,
  allStrategies,
  onSelectStrategy,
  onNavigateToTelemetry,
  onClose,
}: StrategyDetailModalProps) {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<StrategyModalTab>('theory');

  useEffect(() => {
    setMounted(true);
  }, []);

  // Cycle navigation
  const currentIndex = allStrategies.findIndex((s) => s.id === strategy.id);
  const prevStrategy = currentIndex > 0 ? allStrategies[currentIndex - 1] : allStrategies[allStrategies.length - 1];
  const nextStrategy = currentIndex < allStrategies.length - 1 ? allStrategies[currentIndex + 1] : allStrategies[0];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && prevStrategy) onSelectStrategy(prevStrategy);
      if (e.key === 'ArrowRight' && nextStrategy) onSelectStrategy(nextStrategy);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [prevStrategy, nextStrategy, onClose, onSelectStrategy]);

  if (!mounted) return null;

  const categoryColorMap: Record<string, { label: string; badge: string }> = {
    TIRE_DEG: { label: 'タイヤデグラデーション工学', badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40' },
    PIT_STRATEGY: { label: 'ピットウィンドウ & アンダーカット数理', badge: 'bg-sky-500/20 text-sky-300 border-sky-500/40' },
    AERO_GROUND_EFFECT: { label: 'グラウンドエフェクト & 空力戦略', badge: 'bg-purple-500/20 text-purple-300 border-purple-500/40' },
    FIA_SAFETY_CAR: { label: 'セーフティカー & VSC確率工学', badge: 'bg-rose-500/20 text-rose-300 border-rose-500/40' },
  };

  const catMeta = categoryColorMap[strategy.category] || {
    label: strategy.category,
    badge: 'bg-slate-700 text-slate-300 border-slate-600',
  };

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl max-h-[92vh] bg-slate-900/95 border border-white/15 rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-white/10 bg-slate-950/80">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold border ${catMeta.badge} flex items-center gap-1`}>
              <span>⏱️</span>
              <span>{catMeta.label}</span>
            </span>
            {strategy.telemetrySession && (
              <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px] font-mono font-bold">
                実走テレメトリー連動
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-500 font-mono hidden md:inline">
              [←] [→] で戦略切替 / [ESC] 閉じる
            </span>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-all text-sm font-bold cursor-pointer"
              title="閉じる (ESC)"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Modal Header */}
        <div className="px-4 sm:px-6 py-4 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-white/10">
          <h2 className="text-xl sm:text-2xl font-racing font-bold text-white tracking-wide">
            {strategy.title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 leading-relaxed">
            {strategy.subtitle}
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="sticky top-0 z-20 flex items-center gap-2 px-4 sm:px-6 pt-2 border-b border-white/10 bg-slate-950/95 backdrop-blur-md overflow-x-auto flex-shrink-0">
          {(
            [
              ['theory', '📐 戦略公理 & 数理モデル'],
              ['radios', `🎙️ 生無線交信ログ (${strategy.keyRadios?.length || 0})`],
              ['telemetry', '📊 実走テレメトリー再現'],
              ['citations', `📚 一次引用文献 (${strategy.references?.length || 0})`],
            ] as [StrategyModalTab, string][]
          ).map(([tab, label]) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2.5 px-3 text-xs font-racing font-bold transition-all border-b-2 flex-shrink-0 cursor-pointer ${
                activeTab === tab
                  ? 'text-sky-400 border-sky-400 font-black'
                  : 'text-slate-400 border-transparent hover:text-slate-200 hover:border-slate-600'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Scrollable Body Content */}
        <div className="overflow-y-auto flex-1 p-4 sm:p-6 space-y-6">
          {/* TAB 1: THEORY & FORMULAS */}
          {activeTab === 'theory' && (
            <div className="space-y-6 animate-fade-in">
              {/* Detailed Description */}
              <div className="bg-slate-950/70 border border-white/10 p-5 rounded-2xl space-y-3">
                <h4 className="text-xs font-racing font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <span>🔬</span>
                  <span>戦略工学的背景 &amp; アルゴリズム解剖</span>
                </h4>
                <div className="text-sm text-slate-200 leading-relaxed font-sans space-y-3">
                  <SmartWikiText text={strategy.description} />
                </div>
              </div>

              {/* Mathematical Formulation Card */}
              <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/40 border border-indigo-500/30 p-5 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-racing font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                    <span>∑</span>
                    <span>ストラテジストが計算する数理モデル (Tactical Math)</span>
                  </h4>
                  <span className="text-[10px] font-mono text-indigo-300 bg-indigo-950 px-2 py-0.5 rounded border border-indigo-500/30">
                    Pitwall Formula
                  </span>
                </div>

                <div className="bg-slate-950/80 p-4 rounded-xl border border-white/10 font-mono text-xs text-sky-300 overflow-x-auto space-y-1.5">
                  <div className="text-slate-400 text-[10px] font-sans">【実効ピットデルタ計算式】</div>
                  <div className="text-sm font-bold text-white">
                    ΔT = (T_pit_in + T_stationary + T_pit_out) - T_flying_lap
                  </div>
                  <div className="text-[11px] text-slate-400 font-sans pt-1">
                    通常時: 約 20.0s 〜 24.5s ／ SC/VSC導入時: 約 9.5s 〜 12.0s（デルタが約50〜55%に圧縮）
                  </div>
                </div>
              </div>

              {/* Key Axioms / Takeaways */}
              <div className="bg-slate-950/70 border border-white/10 p-5 rounded-2xl space-y-3">
                <h4 className="text-xs font-racing font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                  <span>📌</span>
                  <span>レースエンジニアリングの絶対公理</span>
                </h4>
                <div className="space-y-2">
                  {strategy.keyTakeaways.map((takeaway, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-900/80 p-3 rounded-xl border border-white/5 flex items-start gap-2.5"
                    >
                      <span className="w-5 h-5 rounded-full bg-sky-500/20 text-sky-400 border border-sky-500/30 text-xs font-mono font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <p className="text-xs sm:text-sm text-slate-200 leading-relaxed flex-1 font-sans">
                        <SmartWikiText text={takeaway} />
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: RADIOS */}
          {activeTab === 'radios' && (
            <div className="space-y-4 animate-fade-in">
              {strategy.keyRadios && strategy.keyRadios.length > 0 ? (
                strategy.keyRadios.map((radio) => {
                  const isPitWall = radio.speaker === 'PIT WALL';
                  return (
                    <div
                      key={radio.id}
                      className={`p-4 rounded-2xl border transition-all ${
                        isPitWall
                          ? 'bg-slate-900/80 border-sky-500/30'
                          : 'bg-slate-900/80 border-amber-500/30'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
                              isPitWall
                                ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                                : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                            }`}
                          >
                            {radio.speaker}
                          </span>
                          <span className="text-xs font-bold text-white">{radio.speakerName}</span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded">
                          Lap {radio.lap}
                        </span>
                      </div>

                      <blockquote className="text-sm font-mono text-white bg-slate-950/80 p-3 rounded-xl border border-white/5 italic mb-2">
                        &ldquo;{radio.transcript}&rdquo;
                      </blockquote>

                      <div className="text-xs text-slate-300 font-sans mb-2">
                        <strong className="text-slate-400">和訳: </strong>
                        {radio.translation}
                      </div>

                      <div className="text-[11px] text-slate-400 font-sans bg-white/[0.02] p-2 rounded-lg border border-white/5">
                        <strong className="text-slate-300">戦略的背景: </strong>
                        {radio.strategicContext}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-8 text-center bg-slate-950/50 rounded-2xl border border-white/5 text-slate-400 text-xs">
                  本戦略に紐づく特定の無線アーカイブはありません。
                </div>
              )}
            </div>
          )}

          {/* TAB 3: TELEMETRY */}
          {activeTab === 'telemetry' && (
            <div className="space-y-6 animate-fade-in">
              {strategy.telemetrySession ? (
                <div className="bg-slate-950/70 border border-sky-500/30 p-5 rounded-2xl space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-racing font-bold text-sky-400 uppercase tracking-widest block">
                        TELEMETRY REPLAY SESSION
                      </span>
                      <h3 className="text-lg font-bold text-white mt-1">
                        {strategy.telemetrySession.year}年 {strategy.telemetrySession.meetingName}
                      </h3>
                    </div>
                    <span className="px-2.5 py-1 rounded bg-sky-950 text-sky-300 border border-sky-500/40 text-xs font-mono font-bold">
                      Lap {strategy.telemetrySession.targetLap}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
                    この戦略が実際に勝敗を分けたセッションの実走テレメトリーデータ（車速・スロットル・ブレーキング・ギア段数・タイヤ摩耗デルタ）がアーカイブされています。
                  </p>

                  {onNavigateToTelemetry && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onNavigateToTelemetry(strategy.telemetrySession);
                      }}
                      className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-racing font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
                    >
                      <span>📊</span>
                      <span>テレメトリーダッシュボードで実走ログを直接解析する ➔</span>
                    </button>
                  )}
                </div>
              ) : (
                <div className="p-8 text-center bg-slate-950/50 rounded-2xl border border-white/5 text-slate-400 text-xs">
                  本戦略に紐づくテレメトリーセッションは設定されていません。
                </div>
              )}
            </div>
          )}

          {/* TAB 4: CITATIONS */}
          {activeTab === 'citations' && (
            <div className="space-y-3 animate-fade-in">
              {strategy.references && strategy.references.length > 0 ? (
                strategy.references.map((ref) => (
                  <div
                    key={ref.id}
                    className="p-3.5 rounded-xl bg-slate-950/70 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                  >
                    <div className="flex items-start gap-2.5">
                      <span className="font-mono text-xs font-bold text-sky-400 mt-0.5">
                        [{ref.id}]
                      </span>
                      <div>
                        <p className="text-xs sm:text-sm font-bold text-white">{ref.title}</p>
                        <span className="text-[11px] text-slate-400 font-mono">
                          {ref.publisher} • 検証日: {ref.verifiedDate}
                        </span>
                      </div>
                    </div>
                    {ref.url && (
                      <a
                        href={ref.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sky-400 hover:text-sky-300 text-xs font-bold font-mono flex items-center gap-1 shrink-0 self-end sm:self-center"
                      >
                        <span>公式文書を開く</span>
                        <span>↗</span>
                      </a>
                    )}
                  </div>
                ))
              ) : (
                <div className="p-8 text-center bg-slate-950/50 rounded-2xl border border-white/5 text-slate-400 text-xs">
                  登録された引用文献はありません。
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-4 sm:px-6 py-3 border-t border-white/10 bg-slate-950/90 flex items-center justify-between text-xs font-mono text-slate-400">
          <button
            onClick={() => onSelectStrategy(prevStrategy)}
            className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"
          >
            <span>← 前の戦略:</span>
            <span className="text-slate-300 font-bold truncate max-w-[140px] sm:max-w-[220px]">
              {prevStrategy.title}
            </span>
          </button>

          <button
            onClick={() => onSelectStrategy(nextStrategy)}
            className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer ml-auto"
          >
            <span>次の戦略:</span>
            <span className="text-slate-300 font-bold truncate max-w-[140px] sm:max-w-[220px]">
              {nextStrategy.title}
            </span>
            <span>→</span>
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
