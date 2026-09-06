'use client';

/**
 * components/hubs/F1DramaHub.tsx
 * F1 Human Drama, Season Storylines, Iconic Rivalries, Emotional Moments & Paddock Chemistry
 * The core emotional differentiator of the F1 Telemetry Portal.
 */

import React, { useState } from 'react';
import {
  SEASON_STORYLINES,
  RIVALRIES,
  DRAMATIC_MOMENTS,
  PADDOCK_DYNAMICS,
  type SeasonStoryline,
  type Rivalry,
  type DramaticMoment,
  type PaddockRelationship,
} from '@/data/f1DramaData';
import TeamRadioVaultView from '@/components/radio/TeamRadioVaultView';

export type DramaTab = 'storylines' | 'moments' | 'rivalries' | 'paddock' | 'radios';

export interface F1DramaHubProps {
  initialTab?: DramaTab;
}

export default function F1DramaHub({ initialTab = 'storylines' }: F1DramaHubProps) {
  const [activeTab, setActiveTab] = useState<DramaTab>(initialTab);

  React.useEffect(() => {
    if (initialTab) setActiveTab(initialTab);
  }, [initialTab]);

  // Storyline state
  const [selectedSeasonId, setSelectedSeasonId] = useState<string>(SEASON_STORYLINES[0].id);
  const [activeChapterIndex, setActiveChapterIndex] = useState<number>(0);

  // Moments state
  const [selectedMomentId, setSelectedMomentId] = useState<string>(DRAMATIC_MOMENTS[0].id);

  // Rivalries state
  const [selectedRivalryId, setSelectedRivalryId] = useState<string>(RIVALRIES[0].id);

  const selectedSeason =
    SEASON_STORYLINES.find((s) => s.id === selectedSeasonId) || SEASON_STORYLINES[0];
  const selectedMoment =
    DRAMATIC_MOMENTS.find((m) => m.id === selectedMomentId) || DRAMATIC_MOMENTS[0];
  const selectedRivalry =
    RIVALRIES.find((r) => r.id === selectedRivalryId) || RIVALRIES[0];

  return (
    <div className="flex flex-col gap-5 text-white">
      {/* ── Sub Header Introduction ── */}
      <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-4 md:p-5 backdrop-blur-md">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-racing font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30">
            F1 HUMAN DRAMA &amp; SAGAS
          </span>
          <span className="text-[10px] text-slate-400">NETFLIX &amp; PADDOCK NARRATIVES</span>
        </div>
        <h3 className="text-xl font-racing font-black tracking-wide text-white flex items-center gap-2">
          <span>🎬</span> F1ドラマ・歴史＆感動の物語録
        </h3>
        <p className="text-xs text-slate-400 mt-1 max-w-2xl">
          「F1はマシンの競技ではなく、人間の葛藤と情熱が織りなす連続ドラマである」。シーズン通史、歴史的名勝負、宿命のライバル、そしてパドック相関図を完全網羅。
        </p>
      </div>

      {/* ── Sticky 4-Pillars Navigation Bar (Pinned on scroll!) ── */}
      <div className="sticky top-0 z-20 bg-slate-950/95 border border-white/15 rounded-2xl p-2.5 md:p-3 backdrop-blur-md shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <span className="text-base">🎬</span>
          <span className="text-xs font-racing font-bold text-slate-200">ドラマ・歴史:</span>
          <span className="text-[11px] text-rose-400 font-mono font-bold">
            {activeTab === 'storylines'
              ? '【連載】シーズン通史'
              : activeTab === 'moments'
              ? '【名場面】感動と歴史'
              : activeTab === 'rivalries'
              ? '【対決】因縁のライバル'
              : activeTab === 'paddock'
              ? '【相関図】パドック関係性'
              : '【名言】伝説のチーム無線'}
          </span>
        </div>

        {/* 5 Pillars Segmented Navigation */}
        <div className="flex items-center gap-1.5 bg-slate-900/90 p-1 rounded-xl border border-white/10 shadow-inner overflow-x-auto">
          <button
            onClick={() => {
              setActiveTab('storylines');
              const mainEl = document.querySelector('main');
              if (mainEl) mainEl.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-racing font-bold transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'storylines'
                ? 'bg-gradient-to-r from-rose-600 to-red-600 text-white shadow-md shadow-rose-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <span>🎬</span>
            <span>連続ドラマ本編</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('moments');
              const mainEl = document.querySelector('main');
              if (mainEl) mainEl.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-racing font-bold transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'moments'
                ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-md shadow-amber-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <span>😭</span>
            <span>感動の名場面・歴史</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('rivalries');
              const mainEl = document.querySelector('main');
              if (mainEl) mainEl.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-racing font-bold transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'rivalries'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md shadow-purple-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <span>🔥</span>
            <span>宿命のライバル</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('paddock');
              const mainEl = document.querySelector('main');
              if (mainEl) mainEl.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-racing font-bold transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'paddock'
                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md shadow-blue-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <span>📊</span>
            <span>パドック相関図</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('radios');
              const mainEl = document.querySelector('main');
              if (mainEl) mainEl.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-racing font-bold transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'radios'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <span>🎙️</span>
            <span>伝説の無線 (16選)</span>
          </button>
        </div>
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          PILLAR 1: シーズンストーリーライン (連続ドラマ本編)
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {activeTab === 'storylines' && (
        <div className="flex flex-col gap-6 animate-fade-in">
          {/* Season Selector Banner */}
          <div className="flex flex-wrap gap-2">
            {SEASON_STORYLINES.map((season) => {
              const isSelected = season.id === selectedSeasonId;
              return (
                <button
                  key={season.id}
                  onClick={() => {
                    setSelectedSeasonId(season.id);
                    setActiveChapterIndex(0);
                  }}
                  className={`px-4 py-2.5 rounded-xl border text-xs font-racing font-bold transition-all flex items-center gap-2 ${
                    isSelected
                      ? 'bg-rose-950/40 border-rose-500 text-white shadow-lg shadow-rose-950/30'
                      : 'bg-slate-900/50 border-white/10 text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <span className="text-sm">
                    {season.seasonYear === '2024' ? '👑' : season.seasonYear === '2021' ? '⚔️' : '🏛️'}
                  </span>
                  <span>{season.title}</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-black/40 text-slate-400">
                    全{season.chapters.length}章
                  </span>
                </button>
              );
            })}
          </div>

          {/* Season Overview Card */}
          <div className="bg-gradient-to-r from-rose-950/30 via-slate-900/80 to-slate-950 border border-rose-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-racing font-bold px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40">
                {selectedSeason.seasonYear} GRAND SEASON EPIC
              </span>
              <span className="text-xs text-slate-400 font-racing">{selectedSeason.subtitle}</span>
            </div>
            <h2 className="text-2xl font-racing font-black text-white tracking-wide">
              {selectedSeason.title}
            </h2>
            <p className="text-xs text-rose-200/90 font-medium italic mt-1 mb-4">
              &ldquo;{selectedSeason.tagline}&rdquo;
            </p>
            <p className="text-xs text-slate-300 leading-relaxed max-w-4xl bg-slate-950/60 p-4 rounded-xl border border-white/5">
              {selectedSeason.overview}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4 text-xs">
              <div className="bg-slate-950/80 p-3 rounded-lg border border-white/5 flex items-center gap-2">
                <span className="text-lg">🏆</span>
                <div>
                  <span className="text-slate-400 text-[10px] block">ドライバーズ王者:</span>
                  <strong className="text-white">{selectedSeason.champion}</strong>
                </div>
              </div>
              <div className="bg-slate-950/80 p-3 rounded-lg border border-white/5 flex items-center gap-2">
                <span className="text-lg">🏎️</span>
                <div>
                  <span className="text-slate-400 text-[10px] block">コンストラクターズ王者:</span>
                  <strong className="text-white">{selectedSeason.constructorsChampion}</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Chapters Timeline & Viewer */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Chapter Selection Nav (4 cols) */}
            <div className="lg:col-span-4 flex flex-col gap-2">
              <div className="text-xs font-racing font-bold text-slate-400 uppercase tracking-wider mb-1">
                章立てタイムライン (全{selectedSeason.chapters.length}章)
              </div>
              <div className="flex flex-col gap-2">
                {selectedSeason.chapters.map((chapter, idx) => {
                  const isSelected = idx === activeChapterIndex;
                  return (
                    <button
                      key={chapter.chapterNumber}
                      onClick={() => setActiveChapterIndex(idx)}
                      className={`p-3.5 rounded-xl border text-left transition-all flex flex-col gap-1 ${
                        isSelected
                          ? 'bg-rose-950/40 border-rose-500 shadow-md scale-[1.01]'
                          : 'bg-slate-900/50 border-white/10 hover:bg-slate-800/40 text-slate-400'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-racing font-bold px-2 py-0.5 rounded bg-black/40 text-rose-300">
                          第{chapter.chapterNumber}章
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">{chapter.races.split(' 〜 ')[0]}</span>
                      </div>
                      <h4 className="font-racing font-bold text-xs text-white line-clamp-1 mt-0.5">
                        {chapter.title}
                      </h4>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active Chapter Reading Room (8 cols) */}
            <div className="lg:col-span-8 bg-slate-900/80 border border-white/10 rounded-2xl p-6 flex flex-col gap-4 shadow-xl">
              {(() => {
                const currentChapter = selectedSeason.chapters[activeChapterIndex] || selectedSeason.chapters[0];
                return (
                  <>
                    <div className="border-b border-white/10 pb-3">
                      <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                        <span className="text-rose-400 font-racing font-bold">
                          第{currentChapter.chapterNumber}章
                        </span>
                        <span className="font-mono">{currentChapter.races}</span>
                      </div>
                      <h3 className="text-xl font-racing font-black text-white">
                        {currentChapter.title}
                      </h3>
                    </div>

                    <p className="text-sm text-slate-200 leading-relaxed bg-slate-950/50 p-4 rounded-xl border border-white/5">
                      {currentChapter.story}
                    </p>

                    <div className="bg-slate-950/80 p-3.5 rounded-xl border border-rose-500/20 flex flex-col gap-1 text-xs">
                      <div className="text-rose-400 font-racing font-bold flex items-center gap-1.5">
                        <span>⚡</span>
                        <span>決定打となった瞬間 (Pivotal Moment):</span>
                      </div>
                      <p className="text-slate-300 leading-relaxed">{currentChapter.pivotalMoment}</p>
                    </div>

                    {currentChapter.radioOrQuote && (
                      <div className="bg-slate-950/90 p-3.5 rounded-xl border border-sky-500/30 text-xs italic text-sky-200 font-medium">
                        {currentChapter.radioOrQuote}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs text-slate-400">
                      <button
                        disabled={activeChapterIndex === 0}
                        onClick={() => setActiveChapterIndex((i) => Math.max(0, i - 1))}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-white font-racing"
                      >
                        ◀ 前の章へ
                      </button>
                      <span>
                        {activeChapterIndex + 1} / {selectedSeason.chapters.length}
                      </span>
                      <button
                        disabled={activeChapterIndex === selectedSeason.chapters.length - 1}
                        onClick={() => setActiveChapterIndex((i) => Math.min(selectedSeason.chapters.length - 1, i + 1))}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-white font-racing"
                      >
                        次の章へ ▶
                      </button>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          PILLAR 2: 感動の名シーン集 (涙と熱狂のハイライト)
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {activeTab === 'moments' && (
        <div className="flex flex-col gap-6 animate-fade-in">
          {/* Moments Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {DRAMATIC_MOMENTS.map((moment) => {
              const isSelected = moment.id === selectedMomentId;
              return (
                <button
                  key={moment.id}
                  onClick={() => setSelectedMomentId(moment.id)}
                  className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between h-36 ${
                    isSelected
                      ? 'bg-amber-950/40 border-amber-500 shadow-lg shadow-amber-950/40 scale-[1.02]'
                      : 'bg-slate-900/50 border-white/10 hover:border-white/20 hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-racing font-bold px-2 py-0.5 rounded bg-black/40 text-amber-300">
                      {moment.year}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">{moment.tag}</span>
                  </div>

                  <div>
                    <h4 className="font-racing font-bold text-xs text-white line-clamp-2">
                      {moment.title}
                    </h4>
                    <p className="text-[10px] text-slate-400 mt-1">{moment.hero}</p>
                  </div>

                  <div className="text-[10px] text-amber-400 font-bold flex items-center gap-1">
                    <span>詳細を見る</span>
                    <span>➔</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Moment Deep Narrative Card */}
          <div className="bg-slate-900/90 border-2 border-amber-500/40 rounded-2xl p-6 shadow-2xl flex flex-col gap-5 relative overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-white/10 pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-racing font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {selectedMoment.badge}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">{selectedMoment.grandPrix}</span>
                </div>
                <h3 className="text-2xl font-racing font-black text-white">{selectedMoment.title}</h3>
                <p className="text-xs text-slate-300 mt-1">
                  主役: <strong className="text-white">{selectedMoment.hero}</strong> ({selectedMoment.team})
                </p>
              </div>

              <div className="bg-slate-950 px-4 py-2 rounded-xl border border-white/10 text-center self-start md:self-auto">
                <span className="text-[10px] text-slate-400 font-racing">LEGENDARY YEAR</span>
                <div className="text-xl font-racing font-black text-amber-400">{selectedMoment.year}</div>
              </div>
            </div>

            {/* Iconic Radio Callout Bubble */}
            <div className="bg-gradient-to-r from-amber-950/40 via-slate-950 to-slate-950 border-l-4 border-amber-500 p-4 rounded-xl flex flex-col gap-1 shadow-inner">
              <div className="text-[10px] font-racing font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
                <span>🎙️</span>
                <span>HISTORIC RADIO / 実況・無線コール</span>
              </div>
              <p className="text-sm text-amber-200 font-semibold italic leading-relaxed">
                {selectedMoment.radioQuote}
              </p>
            </div>

            {/* Narrative Story */}
            <div className="bg-slate-950/60 p-5 rounded-xl border border-white/5">
              <h4 className="text-xs font-racing font-bold text-slate-300 uppercase tracking-wider mb-2">
                奇跡と熱狂の背景ストーリー
              </h4>
              <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-line">
                {selectedMoment.story}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-950/80 p-4 rounded-xl border border-white/5">
                <span className="text-[10px] font-racing font-bold text-emerald-400 uppercase tracking-wider block mb-1">
                  レース結果と劇的結末
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">{selectedMoment.outcome}</p>
              </div>
              <div className="bg-slate-950/80 p-4 rounded-xl border border-white/5">
                <span className="text-[10px] font-racing font-bold text-sky-400 uppercase tracking-wider block mb-1">
                  その後のモータースポーツへの影響
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">{selectedMoment.aftermath}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          PILLAR 3: 宿命のライバル対決 (直接激突カード)
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {activeTab === 'rivalries' && (
        <div className="flex flex-col gap-6 animate-fade-in">
          {/* Rivalry Selector Pills */}
          <div className="flex flex-wrap gap-2">
            {RIVALRIES.map((rivalry) => {
              const isSelected = rivalry.id === selectedRivalryId;
              return (
                <button
                  key={rivalry.id}
                  onClick={() => setSelectedRivalryId(rivalry.id)}
                  className={`px-4 py-2.5 rounded-xl border text-xs font-racing font-bold transition-all flex items-center gap-2 ${
                    isSelected
                      ? 'bg-purple-950/40 border-purple-500 text-white shadow-lg shadow-purple-950/30'
                      : 'bg-slate-900/50 border-white/10 text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <span>⚔️</span>
                  <span>{rivalry.driver1.code} vs {rivalry.driver2.code}</span>
                </button>
              );
            })}
          </div>

          {/* Active Rivalry Head-to-Head Card */}
          <div className="bg-slate-900/90 border border-white/10 rounded-2xl p-6 flex flex-col gap-6 shadow-xl">
            {/* Title */}
            <div>
              <span className="text-[10px] font-racing font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                HEAD-TO-HEAD RIVALRY
              </span>
              <h3 className="text-2xl font-racing font-black text-white mt-1">{selectedRivalry.name}</h3>
              <p className="text-xs text-slate-400 mt-0.5">{selectedRivalry.subtitle}</p>
            </div>

            {/* VS Clash Banner */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative">
              {/* Driver 1 */}
              <div
                className="bg-slate-950/80 p-5 rounded-2xl border-2 flex flex-col justify-between gap-3"
                style={{ borderColor: selectedRivalry.driver1.color }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center font-racing font-black text-lg border-2 shadow-md"
                    style={{
                      color: selectedRivalry.driver1.color,
                      borderColor: selectedRivalry.driver1.color,
                      backgroundColor: '#0c1322',
                    }}
                  >
                    {selectedRivalry.driver1.code}
                  </div>
                  <div>
                    <h4 className="font-racing font-black text-base text-white">{selectedRivalry.driver1.name}</h4>
                    <p className="text-xs text-slate-400">{selectedRivalry.driver1.team}</p>
                  </div>
                </div>
                <div className="text-xs text-slate-300 pt-2 border-t border-white/5">
                  タイトル獲得数: <strong className="text-white">{selectedRivalry.driver1.titles}回</strong>
                </div>
              </div>

              {/* Driver 2 */}
              <div
                className="bg-slate-950/80 p-5 rounded-2xl border-2 flex flex-col justify-between gap-3"
                style={{ borderColor: selectedRivalry.driver2.color }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center font-racing font-black text-lg border-2 shadow-md"
                    style={{
                      color: selectedRivalry.driver2.color,
                      borderColor: selectedRivalry.driver2.color,
                      backgroundColor: '#0c1322',
                    }}
                  >
                    {selectedRivalry.driver2.code}
                  </div>
                  <div>
                    <h4 className="font-racing font-black text-base text-white">{selectedRivalry.driver2.name}</h4>
                    <p className="text-xs text-slate-400">{selectedRivalry.driver2.team}</p>
                  </div>
                </div>
                <div className="text-xs text-slate-300 pt-2 border-t border-white/5">
                  タイトル獲得数: <strong className="text-white">{selectedRivalry.driver2.titles}回</strong>
                </div>
              </div>
            </div>

            {/* Nature of Rivalry */}
            <div className="bg-slate-950/60 p-4 rounded-xl border border-white/5 flex flex-col gap-1.5">
              <span className="text-[10px] font-racing font-bold text-purple-400 uppercase tracking-wider">
                対決の力学と本質
              </span>
              <p className="text-xs text-slate-200 leading-relaxed">{selectedRivalry.nature}</p>
            </div>

            {/* Defining Moment */}
            <div className="bg-slate-950/80 p-4 rounded-xl border border-rose-500/30 flex flex-col gap-1.5">
              <span className="text-[10px] font-racing font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1">
                <span>💥</span> 決定的な激突シーン
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">{selectedRivalry.definingMoment}</p>
            </div>

            {/* Quote */}
            <div className="bg-slate-950 p-3.5 rounded-xl border border-white/10 text-xs text-purple-200 italic">
              {selectedRivalry.quote}
            </div>
          </div>
        </div>
      )}

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          PILLAR 4: パドック人間関係相関図 (権力構造と育成)
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {activeTab === 'paddock' && (
        <div className="flex flex-col gap-6 animate-fade-in">
          <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-5">
            <h4 className="text-base font-racing font-black text-white flex items-center gap-2 mb-1">
              <span>📊</span> F1パドック 権力構造と育成プログラムの系譜
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              コース上のバトルを動かしているのは、チーム代表の政治力、ドライバー育成アカデミーのサバイバル、そしてチームメイト同士の激しい心理戦です。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {PADDOCK_DYNAMICS.map((dynamic) => (
              <div
                key={dynamic.id}
                className="bg-slate-900/80 border border-white/10 rounded-2xl p-5 flex flex-col justify-between gap-4 relative overflow-hidden"
              >
                <div
                  className="absolute top-0 left-0 right-0 h-1"
                  style={{ backgroundColor: dynamic.badgeColor }}
                />

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-racing font-black text-sm text-white">{dynamic.title}</h4>
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor: `${dynamic.badgeColor}20`,
                        color: dynamic.badgeColor,
                        border: `1px solid ${dynamic.badgeColor}40`,
                      }}
                    >
                      {dynamic.category.toUpperCase()}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed mb-3">{dynamic.description}</p>

                  {/* Members */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {dynamic.members.map((m, mIdx) => (
                      <div
                        key={mIdx}
                        className="bg-slate-950 px-2.5 py-1.5 rounded-lg border border-white/5 text-[11px] flex items-center gap-1.5"
                      >
                        <span className="font-racing font-bold text-white">{m.name}</span>
                        <span className="text-[10px] text-slate-400">({m.role})</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-950/80 p-3 rounded-xl border border-white/5 text-xs text-slate-300">
                  <strong className="text-sky-400 block mb-0.5">人間関係の力学:</strong>
                  {dynamic.dynamics}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          PILLAR 5: 伝説のチーム無線ベスト集 (Team Radio Vault)
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {activeTab === 'radios' && (
        <div className="animate-fade-in">
          <TeamRadioVaultView />
        </div>
      )}
    </div>
  );
}
