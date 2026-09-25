'use client';

/**
 * components/hubs/HistoryDetailModal.tsx
 * Full-Screen High-Impact Deep-Dive Modal for F1 History Archives & Iconic Grand Prix Battles.
 * Features:
 * - 4 Consolidated Tabs:
 *   1. 🏛️ 戦術全史 & 勝負の分水嶺 (Detailed Narrative, Crucial Turning Points & Outcome)
 *   2. 🎙️ 緊迫のチーム無線交信 (Team Radio Player, Transcript & Translation)
 *   3. 📊 実走テレメトリー追体験 (Historic Telemetry Session Data & Direct Link)
 *   4. 📚 一次引用文献 (Academic Primary Citations)
 * - Keyboard navigation (Left/Right to cycle, ESC to close)
 */

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import type { HistoryArchive, TelemetryTarget } from '@/data/f1KnowledgeData';
import SmartWikiText from '@/components/common/SmartWikiText';

export interface HistoryDetailModalProps {
  historyItem: HistoryArchive;
  allHistory: HistoryArchive[];
  onSelectHistory: (item: HistoryArchive) => void;
  onNavigateToTelemetry?: (target?: TelemetryTarget) => void;
  onClose: () => void;
}

type HistoryModalTab = 'narrative' | 'radios' | 'telemetry' | 'citations';

export default function HistoryDetailModal({
  historyItem,
  allHistory,
  onSelectHistory,
  onNavigateToTelemetry,
  onClose,
}: HistoryDetailModalProps) {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<HistoryModalTab>('narrative');

  useEffect(() => {
    setMounted(true);
  }, []);

  // Cycle navigation
  const currentIndex = allHistory.findIndex((h) => h.id === historyItem.id);
  const prevHistory = currentIndex > 0 ? allHistory[currentIndex - 1] : allHistory[allHistory.length - 1];
  const nextHistory = currentIndex < allHistory.length - 1 ? allHistory[currentIndex + 1] : allHistory[0];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && prevHistory) onSelectHistory(prevHistory);
      if (e.key === 'ArrowRight' && nextHistory) onSelectHistory(nextHistory);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [prevHistory, nextHistory, onClose, onSelectHistory]);

  if (!mounted) return null;

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
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
              <span>🏛️</span>
              <span>{historyItem.year}年 {historyItem.grandPrix}</span>
            </span>
            {historyItem.telemetrySession && (
              <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px] font-mono font-bold">
                テレメトリー再現
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-500 font-mono hidden md:inline">
              [←] [→] で名勝負切替 / [ESC] 閉じる
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
        <div className="px-4 sm:px-6 py-4 bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-950 border-b border-white/10">
          <h2 className="text-xl sm:text-2xl font-racing font-bold text-white tracking-wide">
            {historyItem.title}
          </h2>
          <p className="text-xs sm:text-sm text-amber-200/80 mt-1 leading-relaxed">
            {historyItem.subtitle}
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="sticky top-0 z-20 flex items-center gap-2 px-4 sm:px-6 pt-2 border-b border-white/10 bg-slate-950/95 backdrop-blur-md overflow-x-auto flex-shrink-0">
          {(
            [
              ['narrative', '🏛️ 戦術全史 & 勝負の分水嶺'],
              ['radios', `🎙️ 緊迫の生交信ログ (${historyItem.keyRadios?.length || 0})`],
              ['telemetry', '📊 実走テレメトリー追体験'],
              ['citations', `📚 一次引用文献 (${historyItem.references?.length || 0})`],
            ] as [HistoryModalTab, string][]
          ).map(([tab, label]) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2.5 px-3 text-xs font-racing font-bold transition-all border-b-2 flex-shrink-0 cursor-pointer ${
                activeTab === tab
                  ? 'text-amber-400 border-amber-400 font-black'
                  : 'text-slate-400 border-transparent hover:text-slate-200 hover:border-slate-600'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Scrollable Body Content */}
        <div className="overflow-y-auto flex-1 p-4 sm:p-6 space-y-6">
          {/* TAB 1: NARRATIVE */}
          {activeTab === 'narrative' && (
            <div className="space-y-6 animate-fade-in">
              {/* Outcome Badge */}
              <div className="bg-slate-950/80 border border-amber-500/30 p-4 rounded-xl flex items-center gap-3">
                <span className="text-2xl">🏆</span>
                <div>
                  <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest block font-bold">
                    RACE VERDICT / 最終決着
                  </span>
                  <p className="text-sm font-bold text-white mt-0.5">{historyItem.outcome}</p>
                </div>
              </div>

              {/* Detailed Narrative */}
              <div className="bg-slate-950/70 border border-white/10 p-5 rounded-2xl space-y-3">
                <h4 className="text-xs font-racing font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <span>📖</span>
                  <span>戦術ドキュメント &amp; 勝敗の分岐点</span>
                </h4>
                <div className="text-sm text-slate-200 leading-relaxed font-sans space-y-3">
                  <SmartWikiText text={historyItem.strategicNarrative} />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: RADIOS */}
          {activeTab === 'radios' && (
            <div className="space-y-4 animate-fade-in">
              {historyItem.keyRadios && historyItem.keyRadios.length > 0 ? (
                historyItem.keyRadios.map((radio) => {
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
                  本名勝負に紐づく特定の無線アーカイブはありません。
                </div>
              )}
            </div>
          )}

          {/* TAB 3: TELEMETRY */}
          {activeTab === 'telemetry' && (
            <div className="space-y-6 animate-fade-in">
              {historyItem.telemetrySession ? (
                <div className="bg-slate-950/70 border border-amber-500/30 p-5 rounded-2xl space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-racing font-bold text-amber-400 uppercase tracking-widest block">
                        HISTORIC TELEMETRY REPLAY
                      </span>
                      <h3 className="text-lg font-bold text-white mt-1">
                        {historyItem.year}年 {historyItem.grandPrix}
                      </h3>
                    </div>
                    <span className="px-2.5 py-1 rounded bg-amber-950 text-amber-300 border border-amber-500/40 text-xs font-mono font-bold">
                      Lap {historyItem.telemetrySession.targetLap}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
                    歴史の転換点となったラップの実走テレメトリーデータを読み込み、ドライバーのステアリング・スロットルワークと速度差を詳細に追体験できます。
                  </p>

                  {onNavigateToTelemetry && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onNavigateToTelemetry(historyItem.telemetrySession);
                      }}
                      className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-racing font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
                    >
                      <span>📊</span>
                      <span>実走テレメトリーログを追体験解析する ➔</span>
                    </button>
                  )}
                </div>
              ) : (
                <div className="p-8 text-center bg-slate-950/50 rounded-2xl border border-white/5 text-slate-400 text-xs">
                  本名勝負に紐づくテレメトリーセッションは設定されていません。
                </div>
              )}
            </div>
          )}

          {/* TAB 4: CITATIONS */}
          {activeTab === 'citations' && (
            <div className="space-y-3 animate-fade-in">
              {historyItem.references && historyItem.references.length > 0 ? (
                historyItem.references.map((ref) => (
                  <div
                    key={ref.id}
                    className="p-3.5 rounded-xl bg-slate-950/70 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                  >
                    <div className="flex items-start gap-2.5">
                      <span className="font-mono text-xs font-bold text-amber-400 mt-0.5">
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
            onClick={() => onSelectHistory(prevHistory)}
            className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"
          >
            <span>← 前の名勝負:</span>
            <span className="text-slate-300 font-bold truncate max-w-[140px] sm:max-w-[220px]">
              {prevHistory.title}
            </span>
          </button>

          <button
            onClick={() => onSelectHistory(nextHistory)}
            className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer ml-auto"
          >
            <span>次の名勝負:</span>
            <span className="text-slate-300 font-bold truncate max-w-[140px] sm:max-w-[220px]">
              {nextHistory.title}
            </span>
            <span>→</span>
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
