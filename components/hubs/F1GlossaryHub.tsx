'use client';

/**
 * components/hubs/F1GlossaryHub.tsx
 * F1 Complete Glossary Hub (F1用語大辞典)
 * Redesigned with:
 * 1. Clean Scannable Index List (羅列レイアウト)
 * 2. Dedicated Detail Modal with Visual Diagrams (ビジュアル図解)
 * 3. In-App Navigation Links (ピットシミュレーター、テレメトリー、タイヤ大百科等)
 * 4. Deep-link auto-open via `initialTermId` (e.g. from AI Strategist)
 */

import React, { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  GLOSSARY_TERMS,
  type GlossaryTerm,
  type InAppLink,
} from '@/data/f1GlossaryData';
import GlossaryVisualDiagram from '@/components/glossary/GlossaryVisualDiagram';

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
  const [activeModalTerm, setActiveModalTerm] = useState<GlossaryTerm | null>(null);

  const categories: { id: string; label: string }[] = [
    { id: 'all', label: '🌟 全カテゴリー' },
    { id: 'car', label: '🏎️ マシン' },
    { id: 'tyre', label: '🛞 タイヤ' },
    { id: 'strategy', label: '⛽ 戦略' },
    { id: 'race', label: '🏁 レース' },
    { id: 'rule', label: '📏 規則・ペナルティ' },
    { id: 'engineering', label: '🔧 工学・PU' },
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

  // Navigate to previous/next term in modal
  const handleStepTerm = (delta: number) => {
    if (!activeModalTerm) return;
    const currentIndex = GLOSSARY_TERMS.findIndex((t) => t.id === activeModalTerm.id);
    if (currentIndex === -1) return;
    const nextIndex = (currentIndex + delta + GLOSSARY_TERMS.length) % GLOSSARY_TERMS.length;
    setActiveModalTerm(GLOSSARY_TERMS[nextIndex]);
  };

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
              <span className="text-[10px] text-slate-400">BEGINNER TO EXPERT</span>
            </div>
            <h3 className="text-xl font-racing font-black tracking-wide text-white flex items-center gap-2">
              <span>🧠</span> F1用語大辞典 (初級〜上級・図解＆実例付き)
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              「アンダーカット」「DRS」「ポーパシング」など気になる用語をクリックすると、専用の図解・解説・アプリ連携画面が展開されます。
            </p>
          </div>

          {/* Search Bar */}
          <div className="w-full md:w-72">
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-slate-400 text-xs">🔍</span>
              <input
                type="text"
                placeholder="用語を検索 (例: アンダーカット, DRS)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950/80 border border-white/15 rounded-xl pl-9 pr-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-white text-xs cursor-pointer"
                >
                  ✕
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

      {/* ── Terms Count & Quick Stats ── */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <span>
          該当する用語: <strong className="text-white">{filteredTerms.length}</strong> 件
          （クリックで専用の解説・ビジュアル図解が開きます）
        </span>
        {searchQuery && (
          <span className="text-emerald-400">
            &ldquo;{searchQuery}&rdquo; の検索結果
          </span>
        )}
      </div>

      {/* ── Scannable Index List (羅列レイアウト) ── */}
      <div className="flex flex-col gap-2">
        {filteredTerms.map((term: GlossaryTerm) => (
          <div
            key={term.id}
            onClick={() => {
              setActiveModalTerm(term);
              onSelectTerm?.(term);
            }}
            className="group p-3.5 sm:p-4 rounded-2xl bg-slate-900/50 hover:bg-slate-800/80 border border-white/10 hover:border-emerald-500/50 shadow-sm transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3"
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
            <div className="flex-1 text-xs text-slate-300 leading-relaxed sm:px-2">
              <span className="text-emerald-400 font-bold mr-1.5 sm:hidden">要約:</span>
              {term.summary}
            </div>

            {/* Right: Action Button */}
            <div className="flex items-center justify-end gap-2 sm:w-28 flex-shrink-0">
              <span className="text-[11px] font-racing font-bold text-slate-400 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all flex items-center gap-1">
                <span>詳細・図解</span>
                <span>➔</span>
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

      {/* ── Dedicated Term Detail Modal (専用詳細・ビジュアル図解画面) ── */}
      {activeModalTerm && (
        <GlossaryDetailModal
          term={activeModalTerm}
          onClose={() => setActiveModalTerm(null)}
          onStep={handleStepTerm}
          onSelectTermByName={(name) => {
            const match = GLOSSARY_TERMS.find(
              (t) => t.term === name || t.term.includes(name) || t.id === name
            );
            if (match) setActiveModalTerm(match);
          }}
          onNavigateToApp={onNavigateToApp}
        />
      )}
    </div>
  );
}

// ── Glossary Detail Modal Component ──────────────────────────────────────────

interface GlossaryDetailModalProps {
  term: GlossaryTerm;
  onClose: () => void;
  onStep: (delta: number) => void;
  onSelectTermByName: (name: string) => void;
  onNavigateToApp?: (action: InAppLink['action']) => void;
}

function GlossaryDetailModal({
  term,
  onClose,
  onStep,
  onSelectTermByName,
  onNavigateToApp,
}: GlossaryDetailModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const origOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = origOverflow;
    };
  }, []);

  // ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onStep(-1);
      if (e.key === 'ArrowRight') onStep(1);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onStep]);

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-fade-in text-slate-200">
      {/* Click backdrop to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Card with Fixed Header, Scrollable Body, and Fixed Footer */}
      <div className="relative z-10 w-full max-w-2xl max-h-[90vh] sm:max-h-[85vh] bg-slate-900 border border-emerald-500/50 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-scale-up">
        {/* Fixed Header (見出し固定：スクロールしても絶対に隠れない) */}
        <div className="flex-shrink-0 bg-slate-950/95 border-b border-white/10 px-5 py-4 sm:px-7 sm:py-5 flex items-start justify-between gap-3 rounded-t-3xl shadow-sm">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="text-xs font-racing font-bold px-2.5 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-500/40">
                {term.categoryLabel}
              </span>
              <span className="text-xs font-mono text-amber-400">
                {'★'.repeat(term.level)}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                {term.level === 1 ? '初級用語' : term.level === 2 ? '中級用語' : '上級用語'}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-racing font-black tracking-wide text-white leading-tight">
              {term.term}
            </h2>
            <p className="text-xs font-mono text-slate-400 mt-0.5">{term.englishTerm}</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white text-lg w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition-colors border border-white/10 cursor-pointer flex-shrink-0 shadow-sm"
            title="閉じる (Esc)"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Body Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-5">
          {/* 30-word Punchy Callout */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950/70 to-slate-900/90 border border-emerald-500/40 text-emerald-200 text-xs sm:text-sm font-medium leading-relaxed shadow-sm">
            <div className="flex items-center gap-1.5 font-racing font-bold text-emerald-400 mb-1 text-xs">
              <span>💡</span>
              <span>一言で言うと:</span>
            </div>
            {term.summary}
          </div>

          {/* Visual Diagram / Graphical Explanation */}
          <GlossaryVisualDiagram visualType={term.visualType} />

          {/* Detailed Explanation */}
          <div className="bg-slate-950/60 p-4 rounded-2xl border border-white/10 space-y-2 text-xs sm:text-sm">
            <span className="text-[11px] font-racing font-bold text-slate-400 tracking-wider uppercase block">
              📖 詳しいメカニズム・戦術解説
            </span>
            <p className="text-slate-200 leading-relaxed">{term.description}</p>
          </div>

          {/* Real Race Scenario / Commentary Quote */}
          {term.realExample && (
            <div className="bg-emerald-950/25 p-4 rounded-2xl border border-emerald-500/30 text-xs sm:text-sm">
              <span className="text-[11px] font-racing font-bold text-emerald-400 tracking-wider uppercase block mb-1">
                🎙️ 実戦・中継でのリアルな場面
              </span>
              <p className="italic text-emerald-200 leading-relaxed font-serif">
                {term.realExample}
              </p>
            </div>
          )}

          {/* In-App Deep Links */}
          {term.inAppLinks && term.inAppLinks.length > 0 && (
            <div className="space-y-2 pt-1">
              <span className="text-[11px] font-racing font-bold text-sky-400 tracking-wider uppercase block">
                🔗 このアプリで体験・深掘りする
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {term.inAppLinks.map((link, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      onClose();
                      onNavigateToApp?.(link.action);
                    }}
                    className="flex items-center justify-between p-2.5 px-3.5 rounded-xl bg-slate-800/80 hover:bg-sky-950/70 border border-white/10 hover:border-sky-500/50 text-slate-200 hover:text-sky-300 text-xs font-medium transition-all shadow-sm group cursor-pointer text-left"
                  >
                    <span className="flex items-center gap-2">
                      <span>{link.icon}</span>
                      <span>{link.label}</span>
                    </span>
                    <span className="text-sky-400 group-hover:translate-x-1 transition-transform">➔</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Related Terms */}
          {term.relatedTerms && term.relatedTerms.length > 0 && (
            <div className="flex items-center gap-2 pt-2 border-t border-white/10 text-xs text-slate-400">
              <span className="flex-shrink-0">関連用語:</span>
              <div className="flex flex-wrap gap-1.5">
                {term.relatedTerms.map((relName, rIdx) => (
                  <button
                    key={rIdx}
                    type="button"
                    onClick={() => onSelectTermByName(relName)}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-emerald-950/60 text-slate-300 hover:text-emerald-300 border border-white/10 hover:border-emerald-500/40 text-xs transition-colors cursor-pointer"
                  >
                    {relName}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Fixed Footer Navigation: Previous / Next */}
        <div className="flex-shrink-0 bg-slate-950/90 border-t border-white/10 px-5 py-3 sm:px-7 flex items-center justify-between text-xs rounded-b-3xl">
          <button
            type="button"
            onClick={() => onStep(-1)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-white/10 hover:bg-white/5 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <span>← 前の用語</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-500 hover:text-slate-300 text-xs transition-colors cursor-pointer"
          >
            一覧に戻る
          </button>

          <button
            type="button"
            onClick={() => onStep(1)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-white/10 hover:bg-white/5 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <span>次の用語 →</span>
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}


