'use client';

/**
 * components/hubs/F1RegulationsHub.tsx
 * 🏛️ FIA Formula 1 Official Regulations & Rules Deep-Dive Hub
 * Features:
 * - 4 Key Regulation Pillars (Sporting, Technical, 2026 Next-Gen, Driving Standards)
 * - Real-time Keyword Filter & Category Switcher
 * - In-depth Engineering & Pitwall Tactical Analysis
 * - Telemetry & Sensor Impact Insights
 * - Historical Stewards Case Studies (2021 Abu Dhabi, 2023 COTA Plank DSQ, 2021 Silverstone Copse)
 * - Official Penalty & Limit Quick Reference
 */

import React, { useState, useMemo } from 'react';
import Regulations2026SimulatorSuite from '@/components/regulations/Regulations2026SimulatorSuite';
import {
  REGULATION_CATEGORIES,
  REGULATION_ARTICLES,
  type RegulationCategory,
  type RegulationArticle,
} from '@/data/f1RegulationsData';
import SmartWikiText from '@/components/common/SmartWikiText';

interface F1RegulationsHubProps {
  onNavigateToTab?: (tab: string) => void;
}

export default function F1RegulationsHub({ onNavigateToTab }: F1RegulationsHubProps) {
  const [selectedCategory, setSelectedCategory] = useState<RegulationCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedArticleId, setExpandedArticleId] = useState<string | null>(REGULATION_ARTICLES[0].id);
  const [show2026Simulator, setShow2026Simulator] = useState<boolean>(true);

  // Filtered Articles
  const filteredArticles = useMemo(() => {
    return REGULATION_ARTICLES.filter((art) => {
      const matchesCat = selectedCategory === 'all' || art.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchesCat;

      const matchesSearch =
        art.title.toLowerCase().includes(q) ||
        art.subtitle.toLowerCase().includes(q) ||
        art.summary.toLowerCase().includes(q) ||
        art.badge.toLowerCase().includes(q) ||
        (art.articleNumber && art.articleNumber.toLowerCase().includes(q)) ||
        art.keyPoints.some((kp) => kp.toLowerCase().includes(q)) ||
        art.inDepthAnalysis.toLowerCase().includes(q);

      return matchesCat && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* ── Hero Banner ── */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-red-950/40 border border-red-500/20 p-6 md:p-8 shadow-xl">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-mono font-bold tracking-wider">
                FIA OFFICIAL RULEBOOK
              </span>
              <span className="px-2 py-0.5 rounded bg-white/10 text-slate-300 text-xs font-mono">
                2024 - 2026 EDITION
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-racing font-bold text-white tracking-wide">
              FIA 公式ルール &amp; レギュレーション大百科
            </h2>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl leading-relaxed">
              レースの勝敗を分ける競技規則（SC・タイヤ義務・ペナルティ）、マシンの限界を規定する技術規則（最低車重・プランク・PU基数制限）、そして2026年次世代大変革（MGU-K 350kW・アクティブ空力）の全貌を完全網羅。
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-950/60 p-3 rounded-xl border border-white/10 flex-shrink-0">
            <div className="text-center px-3 py-1">
              <div className="text-lg font-racing font-bold text-amber-400">4大柱</div>
              <div className="text-[10px] text-slate-400 font-mono">競技・技術・2026・審議</div>
            </div>
            <div className="text-center px-3 py-1 border-l border-white/10">
              <div className="text-lg font-racing font-bold text-blue-400">798kg</div>
              <div className="text-[10px] text-slate-400 font-mono">最低重量基準</div>
            </div>
            <div className="text-center px-3 py-1 border-l border-white/10">
              <div className="text-lg font-racing font-bold text-purple-400">350kW</div>
              <div className="text-[10px] text-slate-400 font-mono">2026年 MGU-K</div>
            </div>
            <div className="text-center px-3 py-1 border-l border-white/10">
              <div className="text-lg font-racing font-bold text-emerald-400">9.0mm</div>
              <div className="text-[10px] text-slate-400 font-mono">プランク摩耗限界</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Category Selectors & Search ── */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-900/80 rounded-xl border border-white/10">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              selectedCategory === 'all'
                ? 'bg-red-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            🏁 全規則 ({REGULATION_ARTICLES.length})
          </button>
          {REGULATION_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                selectedCategory === cat.id
                  ? 'bg-red-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.name.split(' (')[0]}</span>
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px]">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="規則名、ペナルティ、条文で検索..."
            className="w-full bg-slate-900/90 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* ── Category Overview Cards (When "ALL" is selected and no search) ── */}
      {selectedCategory === 'all' && !searchQuery && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {REGULATION_CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className="group cursor-pointer bg-slate-900/60 hover:bg-slate-800/80 border border-white/10 hover:border-white/25 rounded-xl p-4 transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">{cat.icon}</span>
                <span className="text-[10px] font-mono text-slate-500 group-hover:text-red-400 transition-colors">
                  開く ↗
                </span>
              </div>
              <h3 className="font-racing font-bold text-white text-sm mb-1 group-hover:text-red-300 transition-colors">
                {cat.name}
              </h3>
              <p className="text-slate-400 text-xs line-clamp-2 leading-relaxed">
                {cat.description}
              </p>
            </div>
          ))}
        </div>
      )}

            {/* ── 2026 Next-Gen Simulator Lab Toggle & Showcase ── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setShow2026Simulator(!show2026Simulator)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-600/30 to-purple-600/30 hover:from-red-600/40 hover:to-purple-600/40 border border-red-500/40 text-xs font-racing font-bold text-white flex items-center gap-2 shadow-lg transition-all"
          >
            <span>🚀 2026年 次世代規定 インタラクティブ・シミュレーター群</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 font-mono">
              {show2026Simulator ? '▲ 格納する' : '▼ 展開して体験する'}
            </span>
          </button>
          {selectedCategory !== 'future2026' && (
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('future2026');
                setShow2026Simulator(true);
              }}
              className="text-xs text-red-400 hover:text-red-300 font-mono hidden sm:inline-block"
            >
              2026規定カテゴリーを開く ↗
            </button>
          )}
        </div>

        {(show2026Simulator || selectedCategory === 'future2026') && (
          <Regulations2026SimulatorSuite />
        )}
      </div>

      {/* ── Articles List ── */}
      <div className="space-y-4">
        {filteredArticles.length === 0 ? (
          <div className="text-center py-12 bg-slate-900/40 rounded-2xl border border-white/5">
            <div className="text-3xl mb-2">🔍</div>
            <p className="text-slate-300 text-sm font-bold">該当するレギュレーションが見つかりませんでした</p>
            <p className="text-slate-500 text-xs mt-1">別のキーワードでお試しいただくか、カテゴリ選択を切り替えてください</p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="mt-4 px-4 py-1.5 rounded-lg bg-red-600 text-white text-xs font-bold hover:bg-red-500"
            >
              条件をリセット
            </button>
          </div>
        ) : (
          filteredArticles.map((art) => {
            const isExpanded = expandedArticleId === art.id;
            return (
              <div
                key={art.id}
                className={`bg-slate-900/80 rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isExpanded
                    ? 'border-red-500/40 shadow-xl shadow-red-950/20 ring-1 ring-red-500/20'
                    : 'border-white/10 hover:border-white/20'
                }`}
              >
                {/* Accordion Header */}
                <div
                  onClick={() => setExpandedArticleId(isExpanded ? null : art.id)}
                  className="p-5 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-3 select-none"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/30 text-[10px] font-mono font-bold">
                        {art.badge}
                      </span>
                      {art.articleNumber && (
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-mono border border-white/5">
                          {art.articleNumber}
                        </span>
                      )}
                      <span className="text-[10px] text-slate-500 font-mono">
                        {art.category === 'sporting' ? '📜 競技規則' : art.category === 'technical' ? '🔧 技術規則' : art.category === 'future2026' ? '🚀 2026年規定' : '⚖️ 審議基準'}
                      </span>
                    </div>

                    <h3 className="text-base md:text-lg font-bold text-white tracking-wide">
                      {art.title}
                    </h3>
                    <p className="text-slate-400 text-xs">
                      {art.subtitle}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-slate-400 hidden sm:inline-block">
                      {isExpanded ? '閉じる' : '詳細を解剖'}
                    </span>
                    <span
                      className={`w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center text-xs text-slate-300 transition-transform duration-200 ${
                        isExpanded ? 'rotate-180 bg-red-600 text-white' : ''
                      }`}
                    >
                      ▼
                    </span>
                  </div>
                </div>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="border-t border-white/10 bg-slate-950/60 p-5 md:p-6 space-y-6 animate-fadeIn">
                    {/* Summary */}
                    <div className="bg-slate-900/90 rounded-xl p-4 border border-white/5">
                      <div className="text-xs font-mono text-slate-400 mb-1 font-bold">📋 概要と骨子</div>
                      <p className="text-slate-200 text-xs md:text-sm leading-relaxed">
                        {art.summary}
                      </p>
                    </div>

                    {/* Key Points Grid */}
                    <div>
                      <div className="text-xs font-mono text-red-400 mb-2.5 font-bold flex items-center gap-1.5">
                        <span>⚡</span>
                        <span>知っておくべき重要条項 &amp; ルール</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                        {art.keyPoints.map((kp, idx) => (
                          <div
                            key={idx}
                            className="bg-slate-900/60 rounded-xl p-3 border border-white/5 flex items-start gap-2.5"
                          >
                            <span className="w-5 h-5 rounded-full bg-red-500/20 text-red-400 font-mono text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                              {idx + 1}
                            </span>
                            <p className="text-slate-300 text-xs leading-relaxed">
                              <SmartWikiText text={kp} />
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* In-depth Tactical Analysis & Telemetry */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {/* Deep Dive */}
                      <div className="bg-gradient-to-br from-slate-900 to-slate-900/60 rounded-xl p-4 border border-amber-500/20">
                        <div className="text-xs font-mono text-amber-400 mb-1.5 font-bold flex items-center gap-1.5">
                          <span>🔭</span>
                          <span>ピットウォール戦術 &amp; 工学的深層分析</span>
                        </div>
                        <p className="text-slate-300 text-xs leading-relaxed">
                          <SmartWikiText text={art.inDepthAnalysis} />
                        </p>
                      </div>

                      {/* Telemetry Impact */}
                      <div className="bg-gradient-to-br from-slate-900 to-slate-900/60 rounded-xl p-4 border border-blue-500/20">
                        <div className="text-xs font-mono text-blue-400 mb-1.5 font-bold flex items-center gap-1.5">
                          <span>📊</span>
                          <span>テレメトリーデータ・波形への直接的影響</span>
                        </div>
                        <p className="text-slate-300 text-xs leading-relaxed">
                          <SmartWikiText text={art.telemetryTacticalImpact} />
                        </p>
                      </div>
                    </div>

                    {/* Historical Case Study (if exists) */}
                    {art.historicalCaseStudy && (
                      <div className="bg-red-950/20 border border-red-500/30 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-2 py-0.5 rounded bg-red-600 text-white font-mono text-[10px] font-bold">
                            HISTORIC PRECEDENT / 判例
                          </span>
                          <span className="text-white font-bold text-xs">
                            {art.historicalCaseStudy.title} ({art.historicalCaseStudy.year} {art.historicalCaseStudy.gp})
                          </span>
                        </div>
                        <p className="text-slate-300 text-xs leading-relaxed mb-2">
                          <SmartWikiText text={art.historicalCaseStudy.description} />
                        </p>
                        <div className="bg-slate-900/80 rounded-lg p-2.5 border border-white/5 text-[11px] text-amber-300">
                          <span className="font-bold">🏁 FIA規則への影響・裁定結果: </span>
                          <SmartWikiText text={art.historicalCaseStudy.outcome} />
                        </div>
                      </div>
                    )}

                    {/* Penalties / Limits Table (if exists) */}
                    {art.penaltyOrLimitSummary && art.penaltyOrLimitSummary.length > 0 && (
                      <div>
                        <div className="text-xs font-mono text-slate-400 mb-2 font-bold">
                          ⚖️ 違反時のペナルティ・制限値サマリー
                        </div>
                        <div className="overflow-x-auto rounded-xl border border-white/10">
                          <table className="w-full text-xs text-left">
                            <thead className="bg-slate-900 text-slate-400 font-mono text-[10px] uppercase">
                              <tr>
                                <th className="px-4 py-2">違反・検査対象</th>
                                <th className="px-4 py-2">判定基準・閾値</th>
                                <th className="px-4 py-2">公式処分・結果</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 bg-slate-950/80 text-slate-200">
                              {art.penaltyOrLimitSummary.map((item, pIdx) => (
                                <tr key={pIdx} className="hover:bg-white/5 transition-colors">
                                  <td className="px-4 py-2.5 font-bold text-white">{item.label}</td>
                                  <td className="px-4 py-2.5 font-mono text-slate-400">{item.value}</td>
                                  <td className="px-4 py-2.5 font-semibold text-red-400">{item.consequence}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
