'use client';

/**
 * components/hubs/DramaDetailModal.tsx
 * Full-Screen High-Impact Deep-Dive Modal for F1 Dramatic Moments & Season Storylines.
 * Features:
 * - High-contrast racing theme with golden & rose glowing accents
 * - Dedicated cockpit radio callout block with audio wave styling
 * - 3-Chapter Narrative Arc:
 *   【第1章：絶望と逆境の序曲】
 *   【第2章：奇跡の逆転劇とチェッカー】
 *   【第3章：その後の歴史的余波】
 * - Keyboard navigation (Left/Right arrow keys for cycling, ESC to close)
 */

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import type { DramaticMoment, SeasonStoryline } from '@/data/f1DramaData';
import SmartWikiText from '@/components/common/SmartWikiText';

export interface DramaDetailModalProps {
  moment?: DramaticMoment;
  allMoments?: DramaticMoment[];
  onSelectMoment?: (moment: DramaticMoment) => void;
  storyline?: SeasonStoryline;
  onClose: () => void;
}

export default function DramaDetailModal({
  moment,
  allMoments = [],
  onSelectMoment,
  storyline,
  onClose,
}: DramaDetailModalProps) {
  const [mounted, setMounted] = useState(false);
  const [activeStoryChapter, setActiveStoryChapter] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Moment cycle navigation
  const currentMomentIndex = moment ? allMoments.findIndex((m) => m.id === moment.id) : -1;
  const prevMoment = currentMomentIndex > 0 ? allMoments[currentMomentIndex - 1] : allMoments[allMoments.length - 1];
  const nextMoment = currentMomentIndex < allMoments.length - 1 ? allMoments[currentMomentIndex + 1] : allMoments[0];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (moment && onSelectMoment) {
        if (e.key === 'ArrowLeft' && prevMoment) onSelectMoment(prevMoment);
        if (e.key === 'ArrowRight' && nextMoment) onSelectMoment(nextMoment);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [moment, prevMoment, nextMoment, onClose, onSelectMoment]);

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
            {moment ? (
              <>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                  <span>🏆</span>
                  <span>{moment.year}年 {moment.grandPrix}</span>
                </span>
                <span className="px-2.5 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-white/10 text-[11px] font-mono">
                  {moment.badge}
                </span>
                <span className="px-2 py-0.5 rounded bg-rose-600/20 text-rose-300 border border-rose-500/30 text-[10px] font-mono font-bold">
                  {moment.tag}
                </span>
              </>
            ) : storyline ? (
              <>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 flex items-center gap-1">
                  <span>👑</span>
                  <span>{storyline.seasonYear}年 シーズン叙事詩</span>
                </span>
                <span className="px-2.5 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-white/10 text-[11px] font-mono">
                  全{storyline.chapters.length}章
                </span>
              </>
            ) : null}
          </div>

          <div className="flex items-center gap-2">
            {moment && (
              <span className="text-[10px] text-slate-500 font-mono hidden md:inline">
                [←] [→] で名場面切替 / [ESC] 閉じる
              </span>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-all text-sm font-bold cursor-pointer"
              title="閉じる (ESC)"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto flex-1 p-4 sm:p-6 space-y-6">
          {/* ── Case 1: DRAMATIC MOMENT ── */}
          {moment && (
            <div className="space-y-6 animate-fade-in">
              {/* Moment Header */}
              <div className="bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-950 p-5 sm:p-6 rounded-2xl border border-amber-500/30 shadow-lg">
                <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                  <span className="text-xs font-racing font-bold text-amber-400 tracking-wider uppercase">
                    LEGENDARY HISTORIC MOMENT
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    主役: <strong className="text-white">{moment.hero}</strong> ({moment.team})
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-racing font-black text-white tracking-wide">
                  {moment.title}
                </h2>
              </div>

              {/* Radio Quote Highlight Box */}
              {moment.radioQuote && (
                <div className="bg-gradient-to-r from-amber-950/40 via-slate-950 to-slate-900 border-l-4 border-amber-400 p-4 sm:p-5 rounded-r-2xl shadow-inner space-y-2">
                  <div className="flex items-center justify-between text-xs font-racing font-bold text-amber-400">
                    <span className="flex items-center gap-1.5">
                      <span>🎙️</span>
                      <span>HISTORIC COCKPIT RADIO / 魂の実況・無線コール</span>
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      Speaker: {moment.radioSpeaker || moment.hero}
                    </span>
                  </div>
                  <p className="text-base sm:text-lg text-amber-200 font-semibold italic leading-relaxed">
                    &ldquo;{moment.radioQuote}&rdquo;
                  </p>
                </div>
              )}

              {/* 3-Chapter Narrative Breakdown */}
              <div className="space-y-4">
                {/* Chapter 1: The Drama & Story */}
                <div className="bg-slate-950/70 border border-white/10 p-5 rounded-2xl space-y-2">
                  <h4 className="text-xs font-racing font-bold text-rose-400 uppercase tracking-wider flex items-center gap-2">
                    <span className="w-5 h-5 rounded bg-rose-600/20 text-rose-300 border border-rose-500/30 flex items-center justify-center font-mono text-xs">
                      1
                    </span>
                    <span>奇跡と熱狂の背景ストーリー (Storyline & Crisis)</span>
                  </h4>
                  <div className="text-sm text-slate-200 leading-relaxed font-sans pt-1">
                    <SmartWikiText text={moment.story} />
                  </div>
                </div>

                {/* Chapter 2: Outcome & Climax */}
                <div className="bg-slate-950/70 border border-white/10 p-5 rounded-2xl space-y-2">
                  <h4 className="text-xs font-racing font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                    <span className="w-5 h-5 rounded bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 flex items-center justify-center font-mono text-xs">
                      2
                    </span>
                    <span>レース結果と劇的チェッカー (Dramatic Outcome)</span>
                  </h4>
                  <div className="text-sm text-slate-200 leading-relaxed font-sans pt-1">
                    <SmartWikiText text={moment.outcome} />
                  </div>
                </div>

                {/* Chapter 3: Aftermath & Legacy */}
                <div className="bg-slate-950/70 border border-white/10 p-5 rounded-2xl space-y-2">
                  <h4 className="text-xs font-racing font-bold text-sky-400 uppercase tracking-wider flex items-center gap-2">
                    <span className="w-5 h-5 rounded bg-sky-600/20 text-sky-300 border border-sky-500/30 flex items-center justify-center font-mono text-xs">
                      3
                    </span>
                    <span>その後のモータースポーツ史への影響 (Historical Aftermath)</span>
                  </h4>
                  <div className="text-sm text-slate-200 leading-relaxed font-sans pt-1">
                    <SmartWikiText text={moment.aftermath} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Case 2: SEASON STORYLINE ── */}
          {storyline && (
            <div className="space-y-6 animate-fade-in">
              {/* Season Hero Card */}
              <div className="bg-gradient-to-r from-rose-950/40 via-slate-900 to-slate-950 p-5 sm:p-6 rounded-2xl border border-rose-500/30 shadow-lg">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-racing font-bold px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40">
                    {storyline.seasonYear} GRAND SEASON EPIC
                  </span>
                  <span className="text-xs text-slate-400 font-racing">{storyline.subtitle}</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-racing font-black text-white tracking-wide">
                  {storyline.title}
                </h2>
                <p className="text-xs sm:text-sm text-rose-200/90 italic mt-1.5 font-medium">
                  &ldquo;{storyline.tagline}&rdquo;
                </p>

                {/* Champions Bar */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 text-xs font-mono">
                  <div className="bg-slate-950/80 p-3 rounded-xl border border-white/10 flex items-center gap-2">
                    <span className="text-lg">🏆</span>
                    <div>
                      <span className="text-slate-400 text-[10px] block">ドライバーズ王者:</span>
                      <strong className="text-white">{storyline.champion}</strong>
                    </div>
                  </div>
                  <div className="bg-slate-950/80 p-3 rounded-xl border border-white/10 flex items-center gap-2">
                    <span className="text-lg">🏎️</span>
                    <div>
                      <span className="text-slate-400 text-[10px] block">コンストラクターズ王者:</span>
                      <strong className="text-white">{storyline.constructorsChampion}</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Season Overview */}
              <div className="bg-slate-950/70 border border-white/10 p-5 rounded-2xl">
                <h4 className="text-xs font-racing font-bold text-amber-400 uppercase tracking-wider mb-2">
                  シーズン総括
                </h4>
                <div className="text-sm text-slate-200 leading-relaxed font-sans">
                  <SmartWikiText text={storyline.overview} />
                </div>
              </div>

              {/* Chapter Timeline Tabs */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {storyline.chapters.map((ch, idx) => (
                    <button
                      key={ch.chapterNumber}
                      onClick={() => setActiveStoryChapter(idx)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-racing font-bold shrink-0 transition-all cursor-pointer ${
                        activeStoryChapter === idx
                          ? 'bg-rose-600 text-white shadow-md'
                          : 'bg-slate-800/80 text-slate-400 hover:text-white border border-white/5'
                      }`}
                    >
                      第{ch.chapterNumber}章: {ch.title}
                    </button>
                  ))}
                </div>

                {/* Active Chapter Details */}
                {(() => {
                  const ch = storyline.chapters[activeStoryChapter] || storyline.chapters[0];
                  return (
                    <div className="bg-slate-950/80 border border-rose-500/20 rounded-2xl p-5 space-y-4">
                      <div className="flex items-center justify-between border-b border-white/10 pb-3">
                        <div>
                          <span className="text-xs font-mono text-rose-400 font-bold">
                            第{ch.chapterNumber}章
                          </span>
                          <h3 className="text-lg font-bold text-white mt-0.5">{ch.title}</h3>
                        </div>
                        <span className="text-xs font-mono text-slate-400 bg-slate-900 px-2.5 py-1 rounded border border-white/5">
                          {ch.races}
                        </span>
                      </div>

                      <div className="text-sm text-slate-200 leading-relaxed font-sans">
                        <SmartWikiText text={ch.story} />
                      </div>

                      <div className="bg-slate-900/90 p-4 rounded-xl border border-white/5 space-y-1">
                        <span className="text-xs font-racing font-bold text-amber-400 flex items-center gap-1.5">
                          <span>⚡</span>
                          <span>決定打となった瞬間:</span>
                        </span>
                        <p className="text-xs text-slate-300 leading-relaxed font-sans">
                          <SmartWikiText text={ch.pivotalMoment} />
                        </p>
                      </div>

                      {ch.radioOrQuote && (
                        <div className="bg-slate-900/60 p-3.5 rounded-xl border border-sky-500/30 text-xs italic text-sky-200 font-medium">
                          {ch.radioOrQuote}
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>

              {/* Season Aftermath */}
              {storyline.aftermath && (
                <div className="bg-slate-950/70 border border-white/10 p-5 rounded-2xl">
                  <h4 className="text-xs font-racing font-bold text-sky-400 uppercase tracking-wider mb-2">
                    その後の歴史的余波 &amp; レガシー
                  </h4>
                  <div className="text-sm text-slate-200 leading-relaxed font-sans">
                    <SmartWikiText text={storyline.aftermath} />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer (Moment Navigation) */}
        {moment && (
          <div className="px-4 sm:px-6 py-3 border-t border-white/10 bg-slate-950/90 flex items-center justify-between text-xs font-mono text-slate-400">
            <button
              onClick={() => onSelectMoment && onSelectMoment(prevMoment)}
              className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"
            >
              <span>← 前の名場面:</span>
              <span className="text-slate-300 font-bold truncate max-w-[140px] sm:max-w-[220px]">
                {prevMoment.title}
              </span>
            </button>

            <button
              onClick={() => onSelectMoment && onSelectMoment(nextMoment)}
              className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer ml-auto"
            >
              <span>次の名場面:</span>
              <span className="text-slate-300 font-bold truncate max-w-[140px] sm:max-w-[220px]">
                {nextMoment.title}
              </span>
              <span>→</span>
            </button>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
