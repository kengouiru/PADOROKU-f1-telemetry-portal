'use client';

/**
 * components/hubs/RulesGlossaryHub.tsx
 * Unified Hub for F1 Regulations & Racing Glossary (規定・用語集)
 * Provides seamless 2-mode switching:
 *  - 🧠 用語辞典 (F1 Glossary: Scannable index list, SVG diagrams, term modals)
 *  - 📜 規定・ルール (FIA Regulations: Sporting/Technical rules, penalty guides, 2026 regs)
 */

import React, { useState, useEffect } from 'react';
import F1GlossaryHub from './F1GlossaryHub';
import F1RegulationsHub from './F1RegulationsHub';
import { type InAppLink, type GlossaryTerm } from '@/data/f1GlossaryData';
import type { TelemetryTarget } from '@/data/f1KnowledgeData';

export type RulesGlossaryMode = 'glossary' | 'regulations';

export interface RulesGlossaryHubProps {
  initialMode?: RulesGlossaryMode;
  initialGlossaryTermId?: string | null;
  onNavigateToApp?: (action: InAppLink['action']) => void;
  onNavigateToTab?: (tab: string) => void;
  onNavigateToTelemetry?: (target?: TelemetryTarget) => void;
  onSelectTerm?: (term: GlossaryTerm) => void;
}

export default function RulesGlossaryHub({
  initialMode = 'glossary',
  initialGlossaryTermId,
  onNavigateToApp,
  onNavigateToTab,
  onNavigateToTelemetry,
  onSelectTerm,
}: RulesGlossaryHubProps) {
  const [activeMode, setActiveMode] = useState<RulesGlossaryMode>(initialMode);

  // Sync mode if initialMode prop changes (e.g. navigation from other tabs)
  useEffect(() => {
    if (initialMode) {
      setActiveMode(initialMode);
    }
  }, [initialMode]);

  // If a glossary term is targeted, automatically switch to glossary mode
  useEffect(() => {
    if (initialGlossaryTermId) {
      setActiveMode('glossary');
    }
  }, [initialGlossaryTermId]);

  return (
    <div className="flex flex-col gap-5 text-white animate-fade-in">
      {/* ── Top Unified Mode Switcher Bar ── */}
      <div className="bg-slate-900/90 border border-white/10 rounded-2xl p-2.5 sm:p-3 shadow-xl backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center text-base shadow-inner">
            {activeMode === 'glossary' ? '🧠' : '📜'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-racing font-bold text-sky-400 tracking-wider uppercase">
                F1 RULES & TERMINOLOGY
              </span>
              <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-white/5 text-slate-400 border border-white/10">
                統合ナレッジ
              </span>
            </div>
            <p className="text-xs text-slate-300 font-medium">
              {activeMode === 'glossary'
                ? 'F1用語辞典：単語の意味・図解・実戦例を瞬時に検索'
                : 'FIA公式規則：競技規則・ペナルティ基準・2026年規定を体系的に確認'}
            </p>
          </div>
        </div>

        {/* 2-Mode Toggle Switch */}
        <div className="inline-flex bg-slate-950/90 p-1 rounded-xl border border-white/10 shadow-inner w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setActiveMode('glossary')}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-racing font-bold transition-all cursor-pointer ${
              activeMode === 'glossary'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-950/40 ring-1 ring-emerald-400/50'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <span>🧠</span>
            <span>用語辞典 (辞書・図解)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMode('regulations')}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-racing font-bold transition-all cursor-pointer ${
              activeMode === 'regulations'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-950/40 ring-1 ring-purple-400/50'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <span>📜</span>
            <span>規定・ルール (FIA公式)</span>
          </button>
        </div>
      </div>

      {/* ── Active Mode Content ── */}
      {activeMode === 'glossary' ? (
        <F1GlossaryHub
          initialTermId={initialGlossaryTermId}
          onSelectTerm={onSelectTerm}
          onNavigateToApp={(action) => {
            if (action.subTab === 'regulations') {
              setActiveMode('regulations');
              return;
            }
            onNavigateToApp?.(action);
          }}
        />
      ) : (
        <F1RegulationsHub
          onNavigateToTab={(tab) => {
            if (tab === 'glossary') {
              setActiveMode('glossary');
              return;
            }
            onNavigateToTab?.(tab);
          }}
        />
      )}
    </div>
  );
}
