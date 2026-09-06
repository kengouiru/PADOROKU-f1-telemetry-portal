'use client';

/**
 * components/glossary/QuickGlossaryModal.tsx
 * Quick Search Popover / Modal for instantly looking up F1 terms during race viewing.
 * Rendered via createPortal to prevent z-index issues.
 */

import React, { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { GLOSSARY_TERMS, type GlossaryTerm } from '@/data/f1GlossaryData';

interface QuickGlossaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
}

export default function QuickGlossaryModal({
  isOpen,
  onClose,
  initialQuery = '',
}: QuickGlossaryModalProps) {
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedTerm, setSelectedTerm] = useState<GlossaryTerm | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setSearchQuery(initialQuery);
      setSelectedTerm(null);
    }
  }, [isOpen, initialQuery]);

  const filteredTerms = useMemo(() => {
    if (!searchQuery.trim()) return GLOSSARY_TERMS.slice(0, 10);
    return GLOSSARY_TERMS.filter(
      (t) =>
        t.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.englishTerm.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.summary.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in text-white">
      {/* Backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Card */}
      <div className="relative z-10 w-full max-w-2xl bg-slate-900/95 border border-white/20 rounded-3xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden animate-scale-up">
        {/* Header with Search Input */}
        <div className="p-4 border-b border-white/10 bg-slate-950/80 flex items-center gap-3">
          <span className="text-xl">🔍</span>
          <input
            type="text"
            autoFocus
            placeholder="F1用語を今すぐ検索 (DRS, パルクフェルメ, アンダーカット)..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setSelectedTerm(null);
            }}
            className="flex-1 bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none font-medium"
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedTerm(null);
              }}
              className="text-xs text-slate-400 hover:text-white px-2 py-1"
            >
              クリア
            </button>
          )}
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center text-sm font-bold transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
          {/* If a term is selected, show its full detail card */}
          {selectedTerm ? (
            <div className="bg-slate-950 border-2 border-emerald-500/50 rounded-2xl p-5 flex flex-col gap-3.5 animate-fade-in">
              <button
                onClick={() => setSelectedTerm(null)}
                className="text-xs text-emerald-400 hover:underline flex items-center gap-1 self-start font-bold"
              >
                ◀ 検索結果一覧に戻る
              </button>

              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <div>
                  <h3 className="text-xl font-racing font-black text-white">{selectedTerm.term}</h3>
                  <div className="text-xs text-slate-400 font-mono">{selectedTerm.englishTerm}</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                    {selectedTerm.categoryLabel}
                  </span>
                  <span className="text-[10px] text-amber-400 font-bold">
                    {'★'.repeat(selectedTerm.level)}
                  </span>
                </div>
              </div>

              <div className="bg-emerald-950/30 p-3 rounded-xl border border-emerald-500/30 text-xs text-emerald-200 leading-relaxed font-medium">
                <strong className="text-emerald-400 block mb-0.5">30文字要約:</strong>
                {selectedTerm.summary}
              </div>

              <div className="text-xs text-slate-200 leading-relaxed bg-slate-900/60 p-3 rounded-xl border border-white/5">
                <strong className="text-slate-400 text-[10px] block mb-1">詳しい解説:</strong>
                {selectedTerm.description}
              </div>

              <div className="text-xs text-sky-200 leading-relaxed bg-sky-950/20 p-3 rounded-xl border border-sky-500/30 italic">
                <strong className="text-sky-400 text-[10px] block mb-1">中継での実例場面:</strong>
                {selectedTerm.realExample}
              </div>
            </div>
          ) : (
            /* Results List */
            <div className="flex flex-col gap-2">
              <div className="text-[10px] font-racing font-bold text-slate-400 uppercase tracking-wider px-1">
                {searchQuery ? `検索結果 (${filteredTerms.length}件)` : '注目の頻出用語'}
              </div>

              {filteredTerms.length === 0 ? (
                <div className="text-center py-10 text-slate-500 text-xs">
                  該当する用語が見つかりませんでした。別のキーワードでお試しください。
                </div>
              ) : (
                filteredTerms.map((term) => (
                  <button
                    key={term.id}
                    onClick={() => setSelectedTerm(term)}
                    className="p-3.5 rounded-xl bg-slate-950/60 hover:bg-slate-800/80 border border-white/10 text-left transition-all flex items-center justify-between group"
                  >
                    <div className="flex flex-col gap-0.5 pr-2">
                      <div className="flex items-center gap-2">
                        <h4 className="font-racing font-bold text-sm text-white group-hover:text-emerald-300 transition-colors">
                          {term.term}
                        </h4>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-900 text-slate-400 border border-white/5">
                          {term.categoryLabel.split(' ')[0]}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 line-clamp-1 mt-0.5">
                        {term.summary}
                      </p>
                    </div>

                    <span className="text-xs text-emerald-400 group-hover:translate-x-1 transition-transform">
                      ➔
                    </span>
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-white/10 bg-slate-950/90 text-center text-[11px] text-slate-400">
          全用語の体系的学習は「📚 F1大百科モード」の用語大辞典をご覧ください
        </div>
      </div>
    </div>,
    document.body
  );
}
