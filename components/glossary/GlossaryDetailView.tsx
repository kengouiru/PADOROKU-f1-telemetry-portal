'use client';

/**
 * components/glossary/GlossaryDetailView.tsx
 * Dedicated Full-Page View for F1 Glossary Terms (F1用語大図解・解説ビュー)
 *
 * Rebuilt with:
 * 1. 2-Column Responsive Magazine Layout (Left: Deep Editorial Text; Right: Sticky Interactive Visual Deck)
 * 2. Strict reading ergonomic bounds (max-w-3xl, ~75ch) eliminating wide-screen text stretching
 * 3. Telemetry-grade color palette & Lucide SVG icons (Zero emoji noise)
 * 4. Animated SVG Visual Diagram, In-App Launchers, and Broadcast Radio Scenarios
 */

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Lightbulb,
  BookOpen,
  Radio,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Star,
  Activity,
  Compass,
  Sparkles,
} from 'lucide-react';
import {
  GLOSSARY_TERMS,
  type GlossaryTerm,
  type InAppLink,
} from '@/data/f1GlossaryData';
import GlossaryVisualDiagram from './GlossaryVisualDiagram';
import SmartWikiText from '@/components/common/SmartWikiText';

export interface GlossaryDetailViewProps {
  term: GlossaryTerm;
  onBack?: () => void;
  onSelectTerm?: (term: GlossaryTerm) => void;
  onNavigateToApp?: (action: InAppLink['action']) => void;
}

export default function GlossaryDetailView({
  term,
  onBack,
  onSelectTerm,
  onNavigateToApp,
}: GlossaryDetailViewProps) {
  const router = useRouter();

  // Prev / Next term calculation
  const currentIndex = GLOSSARY_TERMS.findIndex((t) => t.id === term.id);
  const prevTerm =
    currentIndex > 0 ? GLOSSARY_TERMS[currentIndex - 1] : GLOSSARY_TERMS[GLOSSARY_TERMS.length - 1];
  const nextTerm =
    currentIndex < GLOSSARY_TERMS.length - 1 ? GLOSSARY_TERMS[currentIndex + 1] : GLOSSARY_TERMS[0];

  // Keyboard navigation: Left/Right arrow keys for term prev/next, Escape to back
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (onBack) onBack();
      }
      if (e.key === 'ArrowLeft' && prevTerm) {
        if (onSelectTerm) onSelectTerm(prevTerm);
        else router.push(`/knowledge/glossary/${prevTerm.id}`);
      }
      if (e.key === 'ArrowRight' && nextTerm) {
        if (onSelectTerm) onSelectTerm(nextTerm);
        else router.push(`/knowledge/glossary/${nextTerm.id}`);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [prevTerm, nextTerm, onBack, onSelectTerm, router]);

  const handleOpenNewWindow = () => {
    window.open(
      `/knowledge/glossary/${term.id}`,
      '_blank',
      'width=1280,height=900,menubar=no,toolbar=no'
    );
  };

  const handleBackAction = () => {
    if (onBack) {
      onBack();
    } else if (typeof window !== 'undefined' && window.opener) {
      window.close();
    } else {
      router.push('/?hub=knowledge');
    }
  };

  const handleStepTo = (target: GlossaryTerm) => {
    if (onSelectTerm) {
      onSelectTerm(target);
    } else {
      router.push(`/knowledge/glossary/${target.id}`);
    }
  };

  return (
    <div className="w-full max-w-[1800px] mx-auto animate-fade-in pb-16">
      {/* ── Solid Flush Sticky Top Navigation Bar ── */}
      <div className="sticky top-0 z-50 bg-slate-950 border-b border-white/15 px-3 sm:px-6 py-2.5 shadow-2xl flex items-center justify-between gap-3 mb-4 rounded-b-2xl">
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <button
            type="button"
            onClick={handleBackAction}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-racing font-bold text-xs sm:text-sm flex items-center gap-1.5 border border-white/10 transition-all cursor-pointer shadow hover:scale-105 shrink-0"
            title="用語一覧に戻る"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="whitespace-nowrap">用語一覧に戻る</span>
          </button>

          <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400 font-mono truncate">
            <span>F1 百科事典</span>
            <span>&gt;</span>
            <span>用語大辞典</span>
            <span>&gt;</span>
            <span className="text-white font-bold truncate">{term.term.split('(')[0].trim()}</span>
          </div>
        </div>

        {/* Action Controls: Prev/Next & Popout Window */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Prev / Next Term Switcher */}
          <div className="flex items-center bg-slate-900 border border-white/10 rounded-xl p-0.5">
            <button
              type="button"
              onClick={() => handleStepTo(prevTerm)}
              className="px-2 py-1 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 text-xs font-mono flex items-center gap-1 transition-all cursor-pointer"
              title={`前の用語: ${prevTerm.term}`}
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span className="hidden md:inline truncate max-w-[100px]">{prevTerm.term.split('(')[0]}</span>
            </button>
            <div className="w-px h-3.5 bg-white/15" />
            <button
              type="button"
              onClick={() => handleStepTo(nextTerm)}
              className="px-2 py-1 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 text-xs font-mono flex items-center gap-1 transition-all cursor-pointer"
              title={`次の用語: ${nextTerm.term}`}
            >
              <span className="hidden md:inline truncate max-w-[100px]">{nextTerm.term.split('(')[0]}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Open in Separate Window Popout Button */}
          <button
            type="button"
            onClick={handleOpenNewWindow}
            className="px-2.5 py-1 rounded-xl bg-sky-950/80 hover:bg-sky-900 border border-sky-500/40 text-sky-300 hover:text-white text-xs font-racing flex items-center gap-1.5 transition-all cursor-pointer shadow-sm hover:scale-105"
            title="この用語解説を別ウィンドウ（新しいタブ）で開く"
          >
            <span>別ウィンドウで開く</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* ── Main Term Container: 2-Column Responsive Layout ── */}
      <div className="glass-card bg-slate-950/95 border border-emerald-500/40 rounded-3xl shadow-2xl p-4 sm:p-7">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* ── Left Column: Editorial & Deep Analytical Insights (Bounded Width) ── */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-4">
            {/* Term Header */}
            <div className="border-b border-white/10 pb-4">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="text-xs font-racing font-bold px-3 py-1 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-500/40">
                  {term.categoryLabel}
                </span>
                <div className="flex items-center gap-0.5 text-amber-400">
                  {Array.from({ length: term.level }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-[11px] text-slate-400 font-mono">
                  {term.level === 1 ? '初級用語' : term.level === 2 ? '中級用語' : '上級エンジニアリング'}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-racing font-black tracking-wide text-white leading-tight">
                {term.term}
              </h1>
              <p className="text-sm font-mono text-slate-400 mt-1">{term.englishTerm}</p>
            </div>

            {/* 30-word Punchy Summary Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-slate-950 border border-emerald-500/40 text-emerald-200 text-sm font-medium leading-relaxed shadow-md">
              <div className="flex items-center gap-1.5 font-racing font-bold text-emerald-400 mb-1.5 text-xs">
                <Lightbulb className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>一言で言うと:</span>
              </div>
              <div className="font-sans leading-relaxed text-slate-200">
                <SmartWikiText
                  text={term.summary}
                  excludeUrl={`/knowledge/glossary/${term.id}`}
                />
              </div>
            </div>

            {/* Detailed Mechanism & Tactical Explanation (Bounded Reading Width) */}
            <div className="bg-slate-900/70 p-5 rounded-2xl border border-white/10 space-y-3">
              <div className="flex items-center gap-1.5 text-xs font-racing font-bold text-slate-300 tracking-wider uppercase">
                <BookOpen className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                <span>詳しいメカニズム・戦術解説</span>
              </div>
              <div className="text-slate-200 text-xs sm:text-sm leading-relaxed font-sans max-w-3xl space-y-3">
                <SmartWikiText
                  text={term.description}
                  excludeUrl={`/knowledge/glossary/${term.id}`}
                />
              </div>
            </div>

            {/* Real Race Scenario / Broadcast Commentary Quote */}
            {term.realExample && (
              <div className="bg-emerald-950/25 p-5 rounded-2xl border border-emerald-500/30 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-racing font-bold text-emerald-400 tracking-wider uppercase">
                  <Radio className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>実戦・中継でのリアルな場面</span>
                </div>
                <div className="italic text-emerald-200 text-xs sm:text-sm leading-relaxed font-sans bg-slate-950/50 p-3.5 rounded-xl border border-emerald-500/20">
                  <SmartWikiText
                    text={term.realExample}
                    excludeUrl={`/knowledge/glossary/${term.id}`}
                  />
                </div>
              </div>
            )}

            {/* Related Terms Cloud */}
            {term.relatedTerms && term.relatedTerms.length > 0 && (
              <div className="pt-3 border-t border-white/10 flex flex-col sm:flex-row sm:items-center gap-3 text-xs text-slate-400">
                <div className="font-bold text-slate-300 flex items-center gap-1.5 shrink-0">
                  <Compass className="w-3.5 h-3.5 text-teal-400" />
                  <span>関連用語:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {term.relatedTerms.map((relName, rIdx) => {
                    const match = GLOSSARY_TERMS.find(
                      (t) => t.term === relName || t.term.includes(relName) || t.id === relName
                    );
                    return (
                      <button
                        key={rIdx}
                        type="button"
                        onClick={() => {
                          if (match) {
                            handleStepTo(match);
                          }
                        }}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-emerald-950/60 text-slate-300 hover:text-emerald-300 border border-white/10 hover:border-emerald-500/40 text-xs transition-colors cursor-pointer"
                      >
                        {relName}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* ── Right Column: Sticky Visual Diagram & Interactive Launchers ── */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-4 lg:sticky lg:top-[70px]">
            {/* Visual Diagram / Graphical Explanation */}
            <div className="bg-slate-900/90 rounded-2xl border border-white/10 p-3.5 shadow-md overflow-hidden">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-racing font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-sky-400" />
                  <span>ビジュアル構造図解</span>
                </span>
                <span className="text-[9px] font-mono text-slate-400">Interactive SVG</span>
              </div>
              <GlossaryVisualDiagram visualType={term.visualType} />
            </div>

            {/* In-App Interactive Deep Links */}
            {term.inAppLinks && term.inAppLinks.length > 0 && (
              <div className="bg-slate-950/80 rounded-2xl border border-white/10 p-4 space-y-3 shadow-md">
                <span className="text-xs font-racing font-bold text-sky-400 tracking-wider uppercase flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-sky-400" />
                  <span>アプリ内連動・実体験</span>
                </span>
                <div className="space-y-2">
                  {term.inAppLinks.map((link, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        if (onNavigateToApp) {
                          onNavigateToApp(link.action);
                        } else {
                          router.push('/?hub=telemetry');
                        }
                      }}
                      className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-900/90 hover:bg-sky-950/80 border border-white/10 hover:border-sky-500/50 text-slate-200 hover:text-sky-300 text-xs font-medium transition-all shadow-sm group cursor-pointer text-left"
                    >
                      <span className="flex items-center gap-2">
                        <Activity className="w-3.5 h-3.5 text-sky-400 group-hover:scale-110 transition-transform" />
                        <span>{link.label}</span>
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-sky-400 group-hover:translate-x-1 transition-transform" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Term Metadata & Level Overview Card */}
            <div className="bg-slate-900/60 rounded-2xl border border-white/5 p-3.5 space-y-2 text-xs font-mono text-slate-400">
              <div className="flex items-center justify-between pb-1.5 border-b border-white/5">
                <span className="font-sans text-[10px] text-slate-500">カテゴリー</span>
                <span className="text-slate-200 font-bold">{term.categoryLabel}</span>
              </div>
              <div className="flex items-center justify-between pb-1.5 border-b border-white/5">
                <span className="font-sans text-[10px] text-slate-500">難易度レベル</span>
                <span className="text-amber-400 font-bold">Level {term.level} / 3</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-sans text-[10px] text-slate-500">英名</span>
                <span className="text-slate-300 font-sans">{term.englishTerm}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
