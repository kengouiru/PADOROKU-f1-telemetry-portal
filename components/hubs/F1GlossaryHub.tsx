'use client';

/**
 * components/hubs/F1GlossaryHub.tsx
 * F1 Complete Glossary Hub (F1用語大辞典)
 * Filter by Category & Difficulty, Search Bar, 30-word summaries & Real Examples.
 */

import React, { useState, useMemo } from 'react';
import {
  GLOSSARY_TERMS,
  type GlossaryTerm,
  type GlossaryCategory,
} from '@/data/f1GlossaryData';

interface F1GlossaryHubProps {
  onSelectTerm?: (term: GlossaryTerm) => void;
}

export default function F1GlossaryHub({ onSelectTerm }: F1GlossaryHubProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<number | 'all'>('all');
  const [expandedTermId, setExpandedTermId] = useState<string | null>(GLOSSARY_TERMS[0].id);

  const categories: { id: string; label: string }[] = [
    { id: 'all', label: '🌟 全カテゴリー' },
    { id: 'car', label: '🏎️ マシン' },
    { id: 'tyre', label: '🛞 タイヤ' },
    { id: 'strategy', label: '⛽ 戦略' },
    { id: 'race', label: '🏁 レース' },
    { id: 'rule', label: '📏 規則・ペナルティ' },
    { id: 'engineering', label: '🔧 工学・PU' },
  ];

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

  return (
    <div className="flex flex-col gap-6 animate-fade-in text-white">
      {/* ── Sub Header ── */}
      <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-4 md:p-5 backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-racing font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                F1 INTELLIGENCE GLOSSARY
              </span>
              <span className="text-[10px] text-slate-400">BEGINNER TO EXPERT</span>
            </div>
            <h3 className="text-xl font-racing font-black tracking-wide text-white flex items-center gap-2">
              <span>🧠</span> F1用語大辞典 (初級〜上級・実例付き)
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              中継でよく聞く「パルクフェルメ」「ポーパシング」「アンダーカット」など、初心者が疑問に思う用語を30文字でズバッと要約。実例と難易度別で丸わかり。
            </p>
          </div>

          {/* Search Bar */}
          <div className="w-full md:w-72">
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-slate-400 text-xs">🔍</span>
              <input
                type="text"
                placeholder="用語を検索 (例: DRS, パルクフェルメ)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950/80 border border-white/15 rounded-xl pl-9 pr-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-white text-xs"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Filter Bar: Categories & Difficulty ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-950/70 p-3 rounded-2xl border border-white/10">
        {/* Category Pills */}
        <div className="flex flex-wrap gap-1.5 flex-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-racing font-bold transition-all ${
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
              key={String(lvl)}
              onClick={() => setSelectedLevel(lvl as number | 'all')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-racing font-bold transition-all ${
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

      {/* ── Terms Count ── */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <span>
          該当する用語: <strong className="text-white">{filteredTerms.length}</strong> 件
        </span>
        {searchQuery && (
          <span className="text-emerald-400">
            &ldquo;{searchQuery}&rdquo; の検索結果
          </span>
        )}
      </div>

      {/* ── Terms Grid / Accordion Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {filteredTerms.map((term: GlossaryTerm) => {
          const isExpanded = expandedTermId === term.id;
          return (
            <div
              key={term.id}
              className={`rounded-2xl border transition-all overflow-hidden ${
                isExpanded
                  ? 'bg-slate-900/90 border-emerald-500/50 shadow-xl shadow-emerald-950/20'
                  : 'bg-slate-900/50 border-white/10 hover:border-white/20 hover:bg-slate-800/40'
              }`}
            >
              {/* Card Header (Clickable) */}
              <div
                onClick={() => setExpandedTermId(isExpanded ? null : term.id)}
                className="p-4 cursor-pointer flex flex-col justify-between gap-2.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-racing font-bold px-2 py-0.5 rounded-full bg-slate-950 text-slate-300 border border-white/5">
                      {term.categoryLabel}
                    </span>
                    <span className="text-[10px] font-racing font-bold text-amber-400">
                      {'★'.repeat(term.level)}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400">
                    {isExpanded ? '▲ 閉じる' : '▼ 解説を見る'}
                  </span>
                </div>

                <div>
                  <h4 className="font-racing font-black text-base text-white">
                    {term.term}
                  </h4>
                  <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                    {term.englishTerm}
                  </div>
                </div>

                {/* 30-word Quick Summary */}
                <div className="bg-slate-950/70 p-2.5 rounded-xl border border-white/5 text-xs text-emerald-300/95 font-medium leading-relaxed">
                  <span className="font-racing font-bold text-emerald-400 mr-1.5">一言で:</span>
                  {term.summary}
                </div>
              </div>

              {/* Expanded Details */}
              {isExpanded && (
                <div className="px-4 pb-4 pt-1 flex flex-col gap-3 border-t border-white/10 animate-fade-in text-xs">
                  {/* Detailed Description */}
                  <div className="bg-slate-950/50 p-3 rounded-xl border border-white/5">
                    <span className="text-[10px] font-racing font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      詳しい解説
                    </span>
                    <p className="text-slate-200 leading-relaxed">{term.description}</p>
                  </div>

                  {/* Real Race Example */}
                  <div className="bg-emerald-950/20 p-3 rounded-xl border border-emerald-500/30 text-emerald-200">
                    <span className="text-[10px] font-racing font-bold text-emerald-400 uppercase tracking-wider block mb-1">
                      🎙️ 中継でよくある実例場面
                    </span>
                    <p className="italic leading-relaxed">{term.realExample}</p>
                  </div>

                  {/* Related Terms */}
                  {term.relatedTerms && term.relatedTerms.length > 0 && (
                    <div className="flex items-center gap-1.5 pt-1 text-[11px] text-slate-400">
                      <span>関連用語:</span>
                      <div className="flex flex-wrap gap-1">
                        {term.relatedTerms.map((rel, rIdx) => (
                          <button
                            key={rIdx}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSearchQuery(rel);
                            }}
                            className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border border-white/10 transition-colors"
                          >
                            {rel}
                          </button>
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
  );
}
