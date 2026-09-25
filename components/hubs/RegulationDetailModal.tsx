'use client';

/**
 * components/hubs/RegulationDetailModal.tsx
 * Comprehensive Deep Research Modal for FIA Formula 1 Official Regulations.
 * Features:
 * - 3 Consolidated Tabs:
 *   1. 📜 規則条文 & ペナルティ基準 (Official Rules, Key Points, Penalty Matrices)
 *   2. 🔧 工学解析 & センサー測定技術 (Sensors, Telemetry Impact, Engineering Dynamics)
 *   3. ⚖️ 歴史的判例 & スチュワード裁定 (Famous Case Studies, Stewards Verdicts & Legacy)
 * - Keyboard navigation (Left/Right arrow keys for cycling, ESC to close)
 * - Fully accessible design adhering to F1 Telemetry Portal theme
 */

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import type { RegulationArticle, RegulationCategory } from '@/data/f1RegulationsData';
import SmartWikiText from '@/components/common/SmartWikiText';

export interface RegulationDetailModalProps {
  article: RegulationArticle;
  allArticles: RegulationArticle[];
  onSelectArticle: (article: RegulationArticle) => void;
  onClose: () => void;
}

type RegulationModalTab = 'rules' | 'telemetry' | 'case_study';

export default function RegulationDetailModal({
  article,
  allArticles,
  onSelectArticle,
  onClose,
}: RegulationDetailModalProps) {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<RegulationModalTab>('rules');

  useEffect(() => {
    setMounted(true);
  }, []);

  // Cycle navigation
  const currentIndex = allArticles.findIndex((a) => a.id === article.id);
  const prevArticle = currentIndex > 0 ? allArticles[currentIndex - 1] : allArticles[allArticles.length - 1];
  const nextArticle = currentIndex < allArticles.length - 1 ? allArticles[currentIndex + 1] : allArticles[0];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && prevArticle) onSelectArticle(prevArticle);
      if (e.key === 'ArrowRight' && nextArticle) onSelectArticle(nextArticle);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [prevArticle, nextArticle, onClose, onSelectArticle]);

  if (!mounted) return null;

  const categoryNameMap: Record<RegulationCategory, { label: string; icon: string; badgeColor: string }> = {
    sporting: { label: 'スポーティング規則 (競技規則)', icon: '📜', badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40' },
    technical: { label: 'テクニカル規則 (技術規則)', icon: '🔧', badgeColor: 'bg-sky-500/20 text-sky-300 border-sky-500/40' },
    future2026: { label: '2026年 次世代規定', icon: '🚀', badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40' },
    guidelines: { label: 'FIA審議ガイドライン', icon: '⚖️', badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40' },
  };

  const catMeta = categoryNameMap[article.category] || { label: 'FIA規則', icon: '📋', badgeColor: 'bg-slate-700 text-slate-300 border-slate-600' };

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/80 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl max-h-[92vh] bg-slate-900/95 border border-white/15 rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-white/10 bg-slate-950/80">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold border ${catMeta.badgeColor} flex items-center gap-1`}>
              <span>{catMeta.icon}</span>
              <span>{catMeta.label}</span>
            </span>
            {article.articleNumber && (
              <span className="px-2.5 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-white/10 text-[11px] font-mono">
                {article.articleNumber}
              </span>
            )}
            <span className="px-2 py-0.5 rounded bg-red-600/20 text-red-300 border border-red-500/30 text-[10px] font-mono font-bold">
              {article.badge}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-500 font-mono hidden md:inline">
              [←] [→] で切替 / [ESC] 閉じる
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
            {article.title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 leading-relaxed">
            {article.subtitle}
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="sticky top-0 z-20 flex items-center gap-2 px-4 sm:px-6 pt-2 border-b border-white/10 bg-slate-950/95 backdrop-blur-md overflow-x-auto flex-shrink-0">
          {(
            [
              ['rules', '📜 規則条文 & ペナルティ基準'],
              ['telemetry', '🔧 工学解析 & センサー測定技術'],
              ['case_study', `⚖️ 歴史的判例 & 裁定録 ${article.historicalCaseStudy ? '(1件)' : ''}`],
            ] as [RegulationModalTab, string][]
          ).map(([tab, label]) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2.5 px-3 text-xs font-racing font-bold transition-all border-b-2 flex-shrink-0 cursor-pointer ${
                activeTab === tab
                  ? 'text-red-400 border-red-500 font-black'
                  : 'text-slate-400 border-transparent hover:text-slate-200 hover:border-slate-600'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Scrollable Body Content */}
        <div className="overflow-y-auto flex-1 p-4 sm:p-6 space-y-6">
          {/* TAB 1: RULES & PENALTIES */}
          {activeTab === 'rules' && (
            <div className="space-y-6 animate-fade-in">
              {/* Summary Box */}
              <div className="bg-slate-950/70 border border-white/10 p-4 sm:p-5 rounded-2xl">
                <h4 className="text-xs font-racing font-bold text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <span>📌</span>
                  <span>規則要約 (Rule Overview)</span>
                </h4>
                <p className="text-sm text-slate-200 leading-relaxed font-sans">
                  <SmartWikiText text={article.summary} />
                </p>
              </div>

              {/* Core Key Points */}
              <div className="bg-slate-950/70 border border-white/10 p-4 sm:p-5 rounded-2xl space-y-3">
                <h4 className="text-xs font-racing font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                  <span>📋</span>
                  <span>公式運用ルール・重要条項</span>
                </h4>
                <div className="space-y-2.5">
                  {article.keyPoints.map((point, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 bg-slate-900/70 p-3 rounded-xl border border-white/5"
                    >
                      <span className="w-5 h-5 rounded-full bg-red-600/20 text-red-400 border border-red-500/30 text-xs font-mono font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <p className="text-xs sm:text-sm text-slate-200 leading-relaxed flex-1 font-sans">
                        <SmartWikiText text={point} />
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Penalty and Limits Table */}
              {article.penaltyOrLimitSummary && article.penaltyOrLimitSummary.length > 0 && (
                <div className="bg-slate-950/70 border border-white/10 p-4 sm:p-5 rounded-2xl space-y-3">
                  <h4 className="text-xs font-racing font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                    <span>⚠️</span>
                    <span>違反時の罰則基準 &amp; 許容限界値</span>
                  </h4>
                  <div className="overflow-x-auto rounded-xl border border-white/10">
                    <table className="w-full text-left text-xs font-mono">
                      <thead className="bg-slate-900/90 text-slate-400 border-b border-white/10">
                        <tr>
                          <th className="py-2.5 px-3">違反項目 / 測定対象</th>
                          <th className="py-2.5 px-3">規定値 / 違反基準</th>
                          <th className="py-2.5 px-3">スチュワード判定・ペナルティ</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {article.penaltyOrLimitSummary.map((item, i) => (
                          <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                            <td className="py-2.5 px-3 font-bold text-white whitespace-nowrap">
                              {item.label}
                            </td>
                            <td className="py-2.5 px-3 text-amber-300 font-bold">
                              {item.value}
                            </td>
                            <td className="py-2.5 px-3 text-red-400 font-bold">
                              {item.consequence}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: ENGINEERING & SENSORS */}
          {activeTab === 'telemetry' && (
            <div className="space-y-6 animate-fade-in">
              {/* In-depth Analysis */}
              <div className="bg-slate-950/70 border border-white/10 p-4 sm:p-5 rounded-2xl space-y-3">
                <h4 className="text-xs font-racing font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                  <span>🔬</span>
                  <span>工学的解剖 &amp; ピットウォール戦術分析</span>
                </h4>
                <div className="bg-slate-900/60 p-4 rounded-xl border border-white/5 text-xs sm:text-sm text-slate-200 leading-relaxed font-sans space-y-3">
                  <SmartWikiText text={article.inDepthAnalysis} />
                </div>
              </div>

              {/* Telemetry & Sensor Impact */}
              <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950/40 border border-blue-500/30 p-4 sm:p-5 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-racing font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                    <span>📡</span>
                    <span>テレメトリー挙動 &amp; FIAセンサー測定プロトコル</span>
                  </h4>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    Live Telemetry Linked
                  </span>
                </div>

                <div className="bg-slate-950/80 p-4 rounded-xl border border-white/10 text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
                  <SmartWikiText text={article.telemetryTacticalImpact} />
                </div>

                {/* Technical Sensor Spotlight */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 text-[11px] font-mono">
                  <div className="bg-slate-900/80 p-2.5 rounded-xl border border-white/5">
                    <span className="text-slate-400 block text-[9.5px]">測定方式</span>
                    <strong className="text-sky-300">FIA標準規格センサー</strong>
                  </div>
                  <div className="bg-slate-900/80 p-2.5 rounded-xl border border-white/5">
                    <span className="text-slate-400 block text-[9.5px]">データ伝送</span>
                    <strong className="text-amber-300">ECU暗号化リアルタイム</strong>
                  </div>
                  <div className="bg-slate-900/80 p-2.5 rounded-xl border border-white/5">
                    <span className="text-slate-400 block text-[9.5px]">失格基準</span>
                    <strong className="text-rose-400">マージンゼロ絶対判定</strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CASE STUDY & STEWARDS VERDICTS */}
          {activeTab === 'case_study' && (
            <div className="space-y-6 animate-fade-in">
              {article.historicalCaseStudy ? (
                <div className="bg-slate-950/70 border border-white/10 p-4 sm:p-5 rounded-2xl space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-mono font-bold">
                        {article.historicalCaseStudy.year}年
                      </span>
                      <span className="text-xs font-mono text-slate-400">
                        {article.historicalCaseStudy.gp}
                      </span>
                    </div>
                    <span className="text-xs font-racing font-bold text-red-400">
                      公式審議録 &amp; 判例
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-white tracking-wide">
                    {article.historicalCaseStudy.title}
                  </h3>

                  <div className="space-y-3">
                    <div>
                      <h5 className="text-[11px] font-mono text-slate-400 mb-1">【事件の経緯】</h5>
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-900/60 p-3.5 rounded-xl border border-white/5 font-sans">
                        <SmartWikiText text={article.historicalCaseStudy.description} />
                      </p>
                    </div>

                    <div>
                      <h5 className="text-[11px] font-mono text-emerald-400 mb-1">【スチュワード裁定 &amp; その後の規則改正】</h5>
                      <p className="text-xs sm:text-sm text-slate-200 leading-relaxed bg-slate-900/80 p-3.5 rounded-xl border border-emerald-500/30 font-sans">
                        <SmartWikiText text={article.historicalCaseStudy.outcome} />
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center bg-slate-950/50 rounded-2xl border border-white/5 text-slate-400 text-xs">
                  本規則に紐づく特定の歴史的ケーススタディは現在アーカイブ編集中です。
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-4 sm:px-6 py-3 border-t border-white/10 bg-slate-950/90 flex items-center justify-between text-xs font-mono text-slate-400">
          <button
            onClick={() => onSelectArticle(prevArticle)}
            className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"
          >
            <span>← 前の条文:</span>
            <span className="text-slate-300 font-bold truncate max-w-[140px] sm:max-w-[220px]">
              {prevArticle.title}
            </span>
          </button>

          <button
            onClick={() => onSelectArticle(nextArticle)}
            className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer ml-auto"
          >
            <span>次の条文:</span>
            <span className="text-slate-300 font-bold truncate max-w-[140px] sm:max-w-[220px]">
              {nextArticle.title}
            </span>
            <span>→</span>
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
