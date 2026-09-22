'use client';

/**
 * components/telemetry/AITelemetryInspectorModal.tsx
 * AI Insight Telemetry Inspector with Integrated Knowledge Companion
 * Features:
 * - Independent verification board for telemetry analysis (VER vs NOR etc.)
 * - AI Insight & Operational Guidance with auto-detected relevant term chips
 * - Side-by-side (Split View on Desktop, Drawer on Mobile) F1 Glossary & FIA Regulations
 * - Live SVG Visual Diagrams (Undercut, DRS, Slipstream, Porpoising, Apex, Degradation)
 * - Seamless in-place lookup without closing the telemetry modal
 */

import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import DetailedTelemetryChart from './DetailedTelemetryChart';
import { KNOWLEDGE_CIRCUITS, KNOWLEDGE_DRIVERS } from '@/data/f1KnowledgeData';
import { GLOSSARY_TERMS, type GlossaryTerm, type GlossaryCategory } from '@/data/f1GlossaryData';
import { REGULATION_ARTICLES, type RegulationCategory, type RegulationArticle } from '@/data/f1RegulationsData';
import GlossaryVisualDiagram from '@/components/glossary/GlossaryVisualDiagram';

export interface AITelemetryInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  circuitId?: string;
  driver1Code?: string;
  driver2Code?: string;
  lapNumber?: number;
  insightNotes?: string;
  onApplyToMain?: (params: { circuitId: string; driver1Code: string; driver2Code: string; lapNumber?: number }) => void;
}

/** Extract matching glossary terms from text (AI guidance / notes) */
function extractRelevantTerms(text: string): GlossaryTerm[] {
  if (!text) return [];
  const lower = text.toLowerCase();
  return GLOSSARY_TERMS.filter((term) => {
    if (lower.includes(term.id.toLowerCase())) return true;
    const cleanTerm = term.term.replace(/\(.*?\)/g, '').trim().toLowerCase();
    if (cleanTerm.length >= 2 && lower.includes(cleanTerm)) return true;
    const cleanEn = term.englishTerm.toLowerCase();
    if (cleanEn.length >= 3 && lower.includes(cleanEn)) return true;
    return false;
  }).slice(0, 8);
}

export default function AITelemetryInspectorModal({
  isOpen,
  onClose,
  circuitId = 'bahrain-international',
  driver1Code = 'VER',
  driver2Code = 'NOR',
  lapNumber,
  insightNotes,
  onApplyToMain,
}: AITelemetryInspectorModalProps) {
  const [mounted, setMounted] = useState(false);

  // Knowledge Companion State
  const [isKnowledgeOpen, setIsKnowledgeOpen] = useState(false);
  const [knowledgeTab, setKnowledgeTab] = useState<'glossary' | 'regulations'>('glossary');
  const [selectedTerm, setSelectedTerm] = useState<GlossaryTerm | null>(null);
  const [glossarySearch, setGlossarySearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<GlossaryCategory | 'all'>('all');
  const [selectedRegCategory, setSelectedRegCategory] = useState<RegulationCategory | 'all'>('all');
  const [expandedArticleId, setExpandedArticleId] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      const orig = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = orig;
      };
    }
  }, [isOpen]);

  // Extract terms relevant to this AI advice
  const relevantTerms = useMemo(() => {
    return extractRelevantTerms(insightNotes || '');
  }, [insightNotes]);

  // Filtered glossary terms
  const filteredTerms = useMemo(() => {
    return GLOSSARY_TERMS.filter((term) => {
      const matchesSearch =
        !glossarySearch.trim() ||
        term.term.toLowerCase().includes(glossarySearch.toLowerCase()) ||
        term.englishTerm.toLowerCase().includes(glossarySearch.toLowerCase()) ||
        term.summary.toLowerCase().includes(glossarySearch.toLowerCase()) ||
        term.description.toLowerCase().includes(glossarySearch.toLowerCase());

      const matchesCat =
        selectedCategory === 'all' || term.category === selectedCategory;

      return matchesSearch && matchesCat;
    });
  }, [glossarySearch, selectedCategory]);

  // Filtered regulations articles
  const filteredArticles = useMemo(() => {
    return REGULATION_ARTICLES.filter((art) => {
      const matchesCat = selectedRegCategory === 'all' || art.category === selectedRegCategory;
      const q = glossarySearch.toLowerCase().trim();
      if (!q) return matchesCat;
      return (
        matchesCat &&
        (art.title.toLowerCase().includes(q) ||
          art.summary.toLowerCase().includes(q) ||
          art.keyPoints.some((k) => k.toLowerCase().includes(q)))
      );
    });
  }, [selectedRegCategory, glossarySearch]);

  const handlePopOut = () => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams();
    if (circuitId) params.set('circuit', circuitId);
    if (driver1Code) params.set('d1', driver1Code);
    if (driver2Code) params.set('d2', driver2Code);
    if (lapNumber) params.set('lap', String(lapNumber));
    if (insightNotes) params.set('notes', insightNotes);

    const url = `/popout/telemetry?${params.toString()}`;
    const width = 1280;
    const height = 850;
    const left = Math.max(0, Math.round((window.screen.width - width) / 2));
    const top = Math.max(0, Math.round((window.screen.height - height) / 2));

    window.open(
      url,
      'F1TelemetryInspectorPopout',
      `width=${width},height=${height},left=${left},top=${top},menubar=no,toolbar=no,location=no,status=no,resizable=yes,scrollbars=yes`
    );
    onClose();
  };

  if (!isOpen || !mounted) return null;

  const circuit = KNOWLEDGE_CIRCUITS.find((c) => c.id === circuitId);
  const d1 = KNOWLEDGE_DRIVERS.find((d) => d.code === driver1Code);
  const d2 = KNOWLEDGE_DRIVERS.find((d) => d.code === driver2Code);

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 md:p-5 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />
      <div className="relative z-10 w-full max-w-7xl max-h-[92vh] bg-slate-950/95 border border-blue-500/40 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-white">
        
        {/* ── Fixed Modal Header ── */}
        <div className="flex-shrink-0 bg-slate-950/95 border-b border-white/10 p-3 sm:p-4 md:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-t-3xl">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-blue-600/20 border border-blue-400/40 flex items-center justify-center text-lg shadow-inner flex-shrink-0">
              🤖
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-racing font-bold text-blue-400 tracking-widest uppercase">
                  AI INSIGHT INSPECTOR
                </span>
                <span className="px-2 py-0.5 rounded-full bg-blue-950/80 border border-blue-500/30 text-[10px] font-mono text-blue-300">
                  独立分析ボード
                </span>
                {lapNumber && (
                  <span className="px-2 py-0.5 rounded-full bg-red-950/80 border border-red-500/30 text-[10px] font-mono text-red-300 font-bold">
                    Lap {lapNumber}
                  </span>
                )}
              </div>
              <h2 className="text-sm sm:text-base font-racing font-bold text-white truncate">
                {circuit?.name ?? 'サーキットテレメトリー'} : {d1?.fullName ?? driver1Code} vs {d2?.fullName ?? driver2Code}
              </h2>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap self-end sm:self-auto flex-shrink-0">
            {/* Knowledge Companion Toggle Button */}
            <button
              type="button"
              onClick={() => setIsKnowledgeOpen((prev) => !prev)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-racing font-bold transition-all cursor-pointer shadow-sm ${
                isKnowledgeOpen
                  ? 'bg-emerald-600 text-white border-emerald-400 shadow-md shadow-emerald-950/40 ring-1 ring-emerald-300/40'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-white/10 hover:border-emerald-500/30'
              }`}
              title="テレメトリーを見ながら用語や公式規定を確認できます"
            >
              <span>📖</span>
              <span>用語・ルール確認</span>
              {isKnowledgeOpen ? (
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              ) : (
                relevantTerms.length > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono border border-emerald-500/30">
                    {relevantTerms.length}
                  </span>
                )
              )}
            </button>

            {/* Separate Window Pop-out Button */}
            <button
              type="button"
              onClick={handlePopOut}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-950/80 hover:bg-purple-900 border border-purple-500/40 hover:border-purple-300 text-purple-200 hover:text-white text-xs font-racing font-bold transition-all shadow-sm cursor-pointer"
              title="マルチモニターや別画面で作業するために新しいウィンドウで開きます"
            >
              <span className="text-sm">↗</span>
              <span className="hidden sm:inline">別ウィンドウで分離</span>
              <span className="sm:hidden">分離</span>
            </button>

            {onApplyToMain && (
              <button
                type="button"
                onClick={() => {
                  onApplyToMain({ circuitId, driver1Code, driver2Code, lapNumber });
                  onClose();
                }}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-950/70 hover:bg-emerald-900 border border-emerald-500/40 hover:border-emerald-400 text-emerald-300 text-xs font-racing font-bold transition-all shadow-sm cursor-pointer"
                title="現在見ているメイン画面にこの設定を読み込みます"
              >
                <span>📌</span>
                <span className="hidden md:inline">メイン画面に適用</span>
                <span className="md:hidden">適用</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-racing font-bold transition-all border border-white/10 cursor-pointer"
              title="モーダルを閉じる"
            >
              ✕ 閉じる
            </button>
          </div>
        </div>

        {/* ── Main Modal Body: Split View (Left: Telemetry, Right: Knowledge) ── */}
        <div className="flex-1 flex flex-col lg:flex-row min-h-0 overflow-hidden relative">
          
          {/* ── Left / Primary Area: Telemetry Chart & AI Guidance ── */}
          <div className="flex-1 min-w-0 overflow-y-auto p-3 sm:p-5 space-y-4">
            {/* Notice Banner */}
            <div className="px-3.5 py-2 rounded-xl bg-blue-950/40 border border-blue-500/20 text-xs text-slate-300 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-sm">💡</span>
                <span>
                  <strong>独立検証ボード：</strong>
                  ドライバー切り替えやコーナー拡大（ズーム）など自由に操作できます。メイン画面の設定はそのまま保持されます。
                </span>
              </div>
            </div>

            {/* AI Insight & Operational Guidance Banner */}
            {insightNotes && (
              <div className="rounded-2xl bg-gradient-to-r from-blue-950/80 via-slate-900/90 to-indigo-950/80 border border-blue-500/40 p-3.5 shadow-md space-y-2 animate-fade-in">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-base">🤖</span>
                    <span className="font-racing font-bold text-xs text-blue-300 tracking-wide uppercase">
                      AIストラテジストの着眼ポイント ＆ 操作ガイド
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 bg-slate-900/80 px-2 py-0.5 rounded border border-white/5">
                    AI Guidance
                  </span>
                </div>

                <div className="text-xs text-slate-200 leading-relaxed whitespace-pre-wrap pl-6 border-l-2 border-blue-400/50 my-1 font-sans">
                  {insightNotes}
                </div>

                {/* Relevant Term Quick Chips */}
                {relevantTerms.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-white/10 mt-1">
                    <span className="text-[10px] font-racing font-bold text-sky-400 flex items-center gap-1 flex-shrink-0">
                      <span>💡</span>
                      <span>解説内の重要用語（クリックで確認）:</span>
                    </span>
                    {relevantTerms.map((term) => (
                      <button
                        key={term.id}
                        type="button"
                        onClick={() => {
                          setSelectedTerm(term);
                          setKnowledgeTab('glossary');
                          setIsKnowledgeOpen(true);
                        }}
                        className="px-2 py-0.5 rounded-lg text-[11px] font-mono font-bold bg-slate-800/90 hover:bg-emerald-950/90 text-slate-300 hover:text-emerald-300 border border-white/10 hover:border-emerald-500/40 transition-all flex items-center gap-1 cursor-pointer shadow-sm active:scale-95"
                      >
                        <span>🧠</span>
                        <span>{term.term.split(' ')[0]}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Interactive Detailed Telemetry Chart */}
            <div className="bg-slate-900/60 rounded-2xl border border-white/10 p-2 sm:p-4">
              <DetailedTelemetryChart
                initialCircuitId={circuitId}
                initialDriver1Code={driver1Code}
                initialDriver2Code={driver2Code}
              />
            </div>
          </div>

          {/* ── Right / Knowledge Panel (Side-by-side on Desktop, Drawer on Mobile) ── */}
          {isKnowledgeOpen && (
            <div
              className="w-full lg:w-[420px] flex-shrink-0 border-t lg:border-t-0 lg:border-l border-white/10 bg-slate-900/98 backdrop-blur-xl flex flex-col h-auto lg:h-full max-h-[50vh] lg:max-h-full overflow-hidden shadow-2xl animate-fade-in z-20"
            >
              {/* Panel Header */}
              <div className="p-3 border-b border-white/10 bg-slate-950/90 flex items-center justify-between gap-2 flex-shrink-0">
                <div className="flex items-center gap-2">
                  <span className="text-base">{knowledgeTab === 'glossary' ? '🧠' : '📜'}</span>
                  <span className="font-racing font-bold text-xs text-white">
                    {knowledgeTab === 'glossary' ? 'F1用語リファレンス' : 'FIA公式規則リファレンス'}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  {/* Mode Pill Toggle */}
                  <div className="inline-flex bg-slate-900 p-0.5 rounded-lg border border-white/10 text-[10px] font-racing font-bold">
                    <button
                      type="button"
                      onClick={() => setKnowledgeTab('glossary')}
                      className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                        knowledgeTab === 'glossary'
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      用語
                    </button>
                    <button
                      type="button"
                      onClick={() => setKnowledgeTab('regulations')}
                      className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                        knowledgeTab === 'regulations'
                          ? 'bg-purple-600 text-white shadow-sm'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      規定
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsKnowledgeOpen(false)}
                    className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center text-xs transition-colors cursor-pointer"
                    title="パネルを閉じる"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Search Box */}
              <div className="p-2.5 border-b border-white/5 bg-slate-950/50 flex-shrink-0">
                <div className="relative">
                  <span className="absolute left-3 top-2 text-slate-500 text-xs">🔍</span>
                  <input
                    type="text"
                    placeholder={
                      knowledgeTab === 'glossary'
                        ? '用語を即座に検索 (DRS, ボトムスピード)...'
                        : '規則・ペナルティを検索...'
                    }
                    value={glossarySearch}
                    onChange={(e) => {
                      setGlossarySearch(e.target.value);
                      if (selectedTerm) setSelectedTerm(null);
                    }}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl pl-8 pr-7 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 transition-colors font-medium"
                  />
                  {glossarySearch && (
                    <button
                      type="button"
                      onClick={() => setGlossarySearch('')}
                      className="absolute right-2.5 top-1.5 text-slate-400 hover:text-white text-xs cursor-pointer"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {/* Scrollable Content Area */}
              <div className="flex-1 overflow-y-auto p-3 space-y-3">
                {/* ── Mode 1: Glossary ── */}
                {knowledgeTab === 'glossary' && (
                  <>
                    {/* If a term is selected: Detail View */}
                    {selectedTerm ? (
                      <div className="space-y-3 animate-fade-in">
                        <button
                          type="button"
                          onClick={() => setSelectedTerm(null)}
                          className="text-xs text-emerald-400 hover:underline flex items-center gap-1 font-bold cursor-pointer"
                        >
                          ◀ 用語一覧に戻る
                        </button>

                        <div className="bg-slate-950 border border-emerald-500/40 rounded-2xl p-3.5 space-y-2.5 shadow-inner">
                          <div className="flex items-start justify-between gap-2 border-b border-white/10 pb-2">
                            <div>
                              <h3 className="text-sm sm:text-base font-racing font-black text-white leading-tight">
                                {selectedTerm.term}
                              </h3>
                              <div className="text-[11px] text-slate-400 font-mono">
                                {selectedTerm.englishTerm}
                              </div>
                            </div>
                            <div className="flex items-center gap-1 flex-shrink-0">
                              <span className="text-[9px] px-2 py-0.5 rounded-full bg-slate-900 text-slate-300 border border-white/10">
                                {selectedTerm.categoryLabel}
                              </span>
                              <span className="text-[9px] text-amber-400 font-bold">
                                {'★'.repeat(selectedTerm.level)}
                              </span>
                            </div>
                          </div>

                          {/* 30-word Beginner Summary */}
                          <div className="bg-emerald-950/30 p-2.5 rounded-xl border border-emerald-500/30 text-xs text-emerald-200 leading-relaxed font-medium">
                            <strong className="text-emerald-400 block text-[10px] mb-0.5">30文字要約:</strong>
                            {selectedTerm.summary}
                          </div>

                          {/* Visual Diagram (if available) */}
                          {selectedTerm.visualType && (
                            <div className="pt-1">
                              <GlossaryVisualDiagram visualType={selectedTerm.visualType} />
                            </div>
                          )}

                          {/* Detailed Explanation */}
                          <div className="text-xs text-slate-200 leading-relaxed bg-slate-900/60 p-2.5 rounded-xl border border-white/5">
                            <strong className="text-slate-400 text-[10px] block mb-1">工学・戦術解説:</strong>
                            {selectedTerm.description}
                          </div>

                          {/* Real Race Quote */}
                          <div className="text-xs text-sky-200 leading-relaxed bg-sky-950/20 p-2.5 rounded-xl border border-sky-500/30 italic">
                            <strong className="text-sky-400 text-[10px] block mb-1">中継での実例・無線:</strong>
                            {selectedTerm.realExample}
                          </div>

                          {/* Related Terms */}
                          {selectedTerm.relatedTerms && selectedTerm.relatedTerms.length > 0 && (
                            <div className="flex flex-wrap items-center gap-1 pt-2 border-t border-white/10 text-[11px]">
                              <span className="text-slate-400 text-[10px]">関連:</span>
                              {selectedTerm.relatedTerms.map((rt, rIdx) => {
                                const found = GLOSSARY_TERMS.find((t) => t.term.includes(rt));
                                return (
                                  <button
                                    key={rIdx}
                                    type="button"
                                    onClick={() => {
                                      if (found) setSelectedTerm(found);
                                      else setGlossarySearch(rt);
                                    }}
                                    className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] border border-white/5 cursor-pointer"
                                  >
                                    {rt}
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      /* Term List View */
                      <div className="space-y-2.5">
                        {/* Category Pills */}
                        <div className="flex flex-wrap gap-1">
                          {[
                            ['all', 'すべて'],
                            ['engineering', '🔧 工学'],
                            ['strategy', '⛽ 戦略'],
                            ['car', '🏎️ マシン'],
                            ['tyre', '🛞 タイヤ'],
                            ['race', '🏁 レース'],
                            ['rule', '📏 規則'],
                          ].map(([cat, label]) => (
                            <button
                              key={cat}
                              type="button"
                              onClick={() => setSelectedCategory(cat as GlossaryCategory | 'all')}
                              className={`px-2 py-1 rounded-lg text-[10px] font-racing font-bold transition-all cursor-pointer ${
                                selectedCategory === cat
                                  ? 'bg-emerald-600 text-white shadow-xs'
                                  : 'bg-slate-950/60 text-slate-400 hover:text-white border border-white/5'
                              }`}
                            >
                              {label}
                            </button>
                          ))}
                        </div>

                        {/* Terms Count */}
                        <div className="text-[10px] font-mono text-slate-400 px-1">
                          {filteredTerms.length}件の用語
                        </div>

                        {/* Term Cards */}
                        <div className="space-y-1.5">
                          {filteredTerms.map((term) => (
                            <button
                              key={term.id}
                              type="button"
                              onClick={() => setSelectedTerm(term)}
                              className="w-full text-left p-2.5 rounded-xl bg-slate-950/70 hover:bg-slate-800/80 border border-white/5 hover:border-emerald-500/30 transition-all flex items-center justify-between group cursor-pointer"
                            >
                              <div className="min-w-0 pr-2">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span className="font-racing font-bold text-xs text-white group-hover:text-emerald-300 transition-colors">
                                    {term.term}
                                  </span>
                                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-900 text-slate-400 border border-white/5">
                                    {term.categoryLabel.split(' ')[0]}
                                  </span>
                                </div>
                                <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                                  {term.summary}
                                </p>
                              </div>
                              <span className="text-xs text-emerald-400 group-hover:translate-x-0.5 transition-transform flex-shrink-0">
                                ➔
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* ── Mode 2: Regulations ── */}
                {knowledgeTab === 'regulations' && (
                  <div className="space-y-2.5">
                    {/* Category Filter */}
                    <div className="flex flex-wrap gap-1">
                      {[
                        ['all', '全規則'],
                        ['sporting', '📜 競技'],
                        ['technical', '🔧 技術'],
                        ['future2026', '🚀 2026'],
                        ['guidelines', '⚖️ 審議'],
                      ].map(([cat, label]) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setSelectedRegCategory(cat as RegulationCategory | 'all')}
                          className={`px-2 py-1 rounded-lg text-[10px] font-racing font-bold transition-all cursor-pointer ${
                            selectedRegCategory === cat
                              ? 'bg-purple-600 text-white shadow-xs'
                              : 'bg-slate-950/60 text-slate-400 hover:text-white border border-white/5'
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>

                    {/* Articles List */}
                    <div className="space-y-2">
                      {filteredArticles.map((art) => {
                        const isExpanded = expandedArticleId === art.id;
                        return (
                          <div
                            key={art.id}
                            className="rounded-xl border border-white/10 bg-slate-950/70 overflow-hidden"
                          >
                            <button
                              type="button"
                              onClick={() => setExpandedArticleId(isExpanded ? null : art.id)}
                              className="w-full text-left p-2.5 flex items-start justify-between gap-2 hover:bg-white/5 transition-colors cursor-pointer"
                            >
                              <div>
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-purple-950/60 border border-purple-500/30 text-purple-300 font-mono font-bold">
                                    {art.badge}
                                  </span>
                                  {art.articleNumber && (
                                    <span className="text-[9px] text-slate-500 font-mono">
                                      {art.articleNumber}
                                    </span>
                                  )}
                                </div>
                                <h4 className="font-racing font-bold text-xs text-white mt-1">
                                  {art.title}
                                </h4>
                                <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                                  {art.summary}
                                </p>
                              </div>
                              <span className="text-xs text-purple-400 mt-1">
                                {isExpanded ? '▲' : '▼'}
                              </span>
                            </button>

                            {isExpanded && (
                              <div className="p-3 border-t border-white/10 bg-slate-900/60 space-y-2 text-xs">
                                <div className="text-slate-200 leading-relaxed">
                                  {art.summary}
                                </div>

                                {/* Key points */}
                                <div className="space-y-1 bg-slate-950/60 p-2 rounded-lg border border-white/5">
                                  <div className="text-[10px] font-bold text-purple-300">要点ポイント:</div>
                                  <ul className="list-disc list-inside text-[11px] text-slate-300 space-y-0.5">
                                    {art.keyPoints.map((kp, kIdx) => (
                                      <li key={kIdx}>{kp}</li>
                                    ))}
                                  </ul>
                                </div>

                                {/* Telemetry tactical impact */}
                                <div className="bg-blue-950/30 p-2 rounded-lg border border-blue-500/20 text-[11px] text-blue-200">
                                  <strong className="text-blue-300 block text-[10px]">🏎️ テレメトリー＆戦術への影響:</strong>
                                  {art.telemetryTacticalImpact}
                                </div>

                                {/* Penalties summary */}
                                {art.penaltyOrLimitSummary && art.penaltyOrLimitSummary.length > 0 && (
                                  <div className="pt-1">
                                    <div className="text-[10px] font-mono text-slate-400 mb-1 font-bold">
                                      ⚖️ ペナルティ基準サマリー:
                                    </div>
                                    <div className="space-y-1">
                                      {art.penaltyOrLimitSummary.map((p, pIdx) => (
                                        <div
                                          key={pIdx}
                                          className="flex items-center justify-between text-[10px] bg-slate-950/80 p-1.5 rounded border border-white/5"
                                        >
                                          <span className="text-white font-bold">{p.label}</span>
                                          <span className="text-red-400 font-semibold">{p.consequence}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
