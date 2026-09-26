'use client';

/**
 * components/hubs/F1GlossaryHub.tsx
 * F1 Complete Glossary Hub (F1用語大辞典)
 * Redesigned with:
 * 1. Clean Scannable Index List (羅列レイアウト)
 * 2. Dedicated Full-Page View with Interactive SVG Diagrams
 * 3. In-App Navigation Links (ピットシミュレーター、テレメトリー、タイヤ大百科等)
 * 4. Zero emoji clutter - Precision typography and Lucide SVG icons
 */

import React, { useState, useMemo, useEffect } from 'react';
import { Search, X, BookOpen, ChevronRight, Star, LayoutGrid, List } from 'lucide-react';
import {
  GLOSSARY_TERMS,
  type GlossaryTerm,
  type InAppLink,
} from '@/data/f1GlossaryData';
import GlossaryDetailView from '@/components/glossary/GlossaryDetailView';

interface F1GlossaryHubProps {
  initialTermId?: string | null;
  onSelectTerm?: (term: GlossaryTerm) => void;
  onNavigateToApp?: (action: InAppLink['action']) => void;
}

export default function F1GlossaryHub({
  initialTermId,
  onSelectTerm,
  onNavigateToApp,
}: F1GlossaryHubProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<number | 'all'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeModalTerm, setActiveModalTerm] = useState<GlossaryTerm | null>(null);

  const categories: { id: string; label: string }[] = [
    { id: 'all', label: '全カテゴリー' },
    { id: 'car', label: 'マシン・車体' },
    { id: 'tyre', label: 'タイヤ・グリップ' },
    { id: 'strategy', label: '戦略・ピット' },
    { id: 'race', label: 'レース・フラッグ' },
    { id: 'rule', label: '規則・ペナルティ' },
    { id: 'engineering', label: '工学・パワーユニット' },
  ];

  // Auto-open target term if initialTermId is provided (e.g. from AI navigation)
  useEffect(() => {
    if (initialTermId) {
      const match = GLOSSARY_TERMS.find(
        (t) =>
          t.id.toLowerCase() === initialTermId.toLowerCase() ||
          t.term.toLowerCase().includes(initialTermId.toLowerCase()) ||
          t.englishTerm.toLowerCase().includes(initialTermId.toLowerCase())
      );
      if (match) {
        setActiveModalTerm(match);
      }
    }
  }, [initialTermId]);

  const filteredTerms = useMemo(() => {
    return GLOSSARY_TERMS.filter((term) => {
      const matchesSearch =
        term.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
        term.englishTerm.toLowerCase().includes(searchQuery.toLowerCase()) ||
        term.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        term.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === 'all' || term.category === selectedCategory;

      const matchesLevel =
        selectedLevel === 'all' || term.level === selectedLevel;

      return matchesSearch && matchesCategory && matchesLevel;
    });
  }, [searchQuery, selectedCategory, selectedLevel]);

  // Dedicated Full-Page View for Active Term (Eliminating Modal Overlay)
  if (activeModalTerm) {
    return (
      <GlossaryDetailView
        term={activeModalTerm}
        onBack={() => setActiveModalTerm(null)}
        onSelectTerm={(t) => setActiveModalTerm(t)}
        onNavigateToApp={onNavigateToApp}
      />
    );
  }

  return (
    <div className="flex flex-col gap-5 text-white animate-fade-in">
      {/* ── Sub Header ── */}
      <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-4 md:p-5 backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-racing font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                F1 INTELLIGENCE GLOSSARY
              </span>
              <span className="text-[10px] text-slate-400 font-mono">BEGINNER TO EXPERT</span>
            </div>
            <h3 className="text-xl font-racing font-black tracking-wide text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-400" />
              <span>F1用語大辞典 (初級〜上級・図解＆実例付き)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl font-sans">
              「アンダーカット」「DRS」「ポーパシング」など気になる用語をクリックすると、専用の図解・解説・アプリ連携画面が展開されます。
            </p>
          </div>

          {/* Search Bar */}
          <div className="w-full md:w-72">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="用語を検索 (例: アンダーカット, DRS)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950/80 border border-white/15 rounded-xl pl-9 pr-8 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Sticky Filter Bar: Categories & Difficulty ── */}
      <div className="sticky top-0 z-20 bg-slate-950/95 p-3 rounded-2xl border border-white/15 backdrop-blur-md shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Category Pills */}
        <div className="flex flex-wrap gap-1.5 flex-1">
          {categories.map((cat) => (
            <button
              type="button"
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-racing font-bold transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 bg-slate-900/30'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Level Pills */}
        <div className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-white/10 self-start md:self-auto">
          <span className="text-[10px] font-racing font-bold text-slate-400 px-2">難易度:</span>
          {[
            ['all', 'すべて'],
            [1, '★ 初級'],
            [2, '★★ 中級'],
            [3, '★★★ 上級'],
          ].map(([lvl, label]) => (
            <button
              type="button"
              key={String(lvl)}
              onClick={() => setSelectedLevel(lvl as number | 'all')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-racing font-bold transition-all cursor-pointer ${
                selectedLevel === lvl
                  ? 'bg-slate-800 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Terms Count & View Switcher ── */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1 font-mono flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span>
            該当する用語: <strong className="text-white font-bold">{filteredTerms.length}</strong> 件
            （クリックで専用の解説・ビジュアル図解が開きます）
          </span>
          {searchQuery && (
            <span className="text-emerald-400">
              &ldquo;{searchQuery}&rdquo; の検索結果
            </span>
          )}
        </div>

        {/* View Mode Toggle: Grid (Default) vs Compact List */}
        <div className="flex items-center gap-1 bg-slate-900/80 p-0.5 rounded-xl border border-white/10">
          <button
            type="button"
            onClick={() => setViewMode('grid')}
            className={`px-2.5 py-1 rounded-lg text-xs font-racing font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              viewMode === 'grid'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/40 border border-emerald-400/40'
                : 'text-slate-400 hover:text-white'
            }`}
            title="グリッド表示 (カード型・横幅活用)"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span className="text-[11px] hidden sm:inline">グリッド</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('list')}
            className={`px-2.5 py-1 rounded-lg text-xs font-racing font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              viewMode === 'list'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/40 border border-emerald-400/40'
                : 'text-slate-400 hover:text-white'
            }`}
            title="リスト表示"
          >
            <List className="w-3.5 h-3.5" />
            <span className="text-[11px] hidden sm:inline">リスト</span>
          </button>
        </div>
      </div>

      {/* ── Responsive Multi-Column Grid Cards (Wide-Screen Optimized) ── */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3.5">
          {filteredTerms.map((term: GlossaryTerm) => (
            <div
              key={term.id}
              onClick={() => {
                setActiveModalTerm(term);
                onSelectTerm?.(term);
              }}
              className="group relative flex flex-col justify-between p-4 rounded-2xl bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-slate-950/90 hover:from-slate-850 hover:to-slate-900 border border-white/10 hover:border-emerald-500/50 shadow-md hover:shadow-xl hover:shadow-emerald-950/25 transition-all duration-200 cursor-pointer hover:-translate-y-0.5"
            >
              <div>
                {/* Top Badges Strip */}
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <span className="text-[10px] font-racing font-bold px-2.5 py-0.5 rounded-full bg-slate-950/90 text-slate-300 border border-white/10 group-hover:border-emerald-500/30 transition-colors">
                    {term.categoryLabel}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {term.visualType && term.visualType !== 'default' && (
                      <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                        図解あり
                      </span>
                    )}
                    <span className="text-[10px] font-mono text-amber-400 tracking-tight">
                      {'★'.repeat(term.level)}
                    </span>
                  </div>
                </div>

                {/* Term Name & English Term */}
                <h4 className="font-racing font-bold text-sm text-white group-hover:text-emerald-300 transition-colors leading-snug line-clamp-1 mb-0.5">
                  {term.term}
                </h4>
                <div className="text-[10px] font-mono text-slate-400 mb-2 truncate">
                  {term.englishTerm}
                </div>

                {/* Summary Description (3 lines clamp) */}
                <p className="text-xs text-slate-300/90 leading-relaxed font-sans line-clamp-3">
                  {term.summary}
                </p>
              </div>

              {/* Bottom Action Strip */}
              <div className="mt-3.5 pt-2.5 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-racing font-bold text-slate-400 group-hover:text-emerald-400 transition-colors">
                <span className="text-[10px] font-mono text-slate-500 group-hover:text-slate-400">
                  {term.relatedTerms && term.relatedTerms.length > 0 ? `#${term.relatedTerms[0]}` : '詳細解説・実例'}
                </span>
                <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span>詳細・図解</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}

          {filteredTerms.length === 0 && (
            <div className="col-span-full p-8 text-center bg-slate-900/40 rounded-2xl border border-white/10 text-slate-400 text-xs">
              「{searchQuery}」に一致する用語は見つかりませんでした。別のキーワードでお試しください。
            </div>
          )}
        </div>
      ) : (
        /* Scannable Compact List View */
        <div className="flex flex-col gap-2">
          {filteredTerms.map((term: GlossaryTerm) => (
            <div
              key={term.id}
              onClick={() => {
                setActiveModalTerm(term);
                onSelectTerm?.(term);
              }}
              className="group p-3 sm:p-3.5 rounded-2xl bg-slate-900/50 hover:bg-slate-800/80 border border-white/10 hover:border-emerald-500/50 shadow-sm transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              {/* Left: Term Name & Category */}
              <div className="flex items-start sm:items-center gap-3 sm:w-72 flex-shrink-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] font-racing font-bold px-2 py-0.5 rounded-full bg-slate-950 text-slate-300 border border-white/10">
                    {term.categoryLabel}
                  </span>
                  <span className="text-[10px] font-mono text-amber-400">
                    {'★'.repeat(term.level)}
                  </span>
                </div>
                <div>
                  <h4 className="font-racing font-bold text-sm text-white group-hover:text-emerald-300 transition-colors">
                    {term.term}
                  </h4>
                  <div className="text-[10px] font-mono text-slate-400">
                    {term.englishTerm}
                  </div>
                </div>
              </div>

              {/* Middle: 30-word Punchy Summary */}
              <div className="flex-1 text-xs text-slate-300 leading-relaxed sm:px-2 font-sans">
                <span className="text-emerald-400 font-bold mr-1.5 sm:hidden">要約:</span>
                {term.summary}
              </div>

              {/* Right: Action Button */}
              <div className="flex items-center justify-end gap-2 sm:w-28 flex-shrink-0">
                <span className="text-[11px] font-racing font-bold text-slate-400 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all flex items-center gap-1">
                  <span>詳細・図解</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}

          {filteredTerms.length === 0 && (
            <div className="p-8 text-center bg-slate-900/40 rounded-2xl border border-white/10 text-slate-400 text-xs">
              「{searchQuery}」に一致する用語は見つかりませんでした。別のキーワードでお試しください。
            </div>
          )}
        </div>
      )}

    </div>
  );
}
