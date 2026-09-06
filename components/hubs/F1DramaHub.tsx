'use client';

/**
 * components/hubs/F1DramaHub.tsx
 * F1 Drama & Storylines Hub (F1人間ドラマ・因縁録)
 * Serial drama format for beginners and hardcore fans to immerse in the emotional narratives of Formula 1.
 */

import React, { useState } from 'react';
import {
  F1_DRAMA_EPISODES,
  PADDOCK_CONNECTIONS,
  type DramaEpisode,
  type DramaCategory,
  type RelationshipConnection,
} from '@/data/f1DramaData';

type FilterType = 'all' | DramaCategory | 'map';

export default function F1DramaHub() {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [selectedEpisodeId, setSelectedEpisodeId] = useState<string>(F1_DRAMA_EPISODES[0].id);

  const filteredEpisodes =
    activeFilter === 'all' || activeFilter === 'map'
      ? F1_DRAMA_EPISODES
      : F1_DRAMA_EPISODES.filter((ep: DramaEpisode) => ep.category === activeFilter);

  const selectedEpisode =
    F1_DRAMA_EPISODES.find((ep: DramaEpisode) => ep.id === selectedEpisodeId) || F1_DRAMA_EPISODES[0];

  return (
    <div className="flex flex-col gap-6 animate-fade-in text-white">
      {/* ── Sub Header ── */}
      <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-4 md:p-5 backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-racing font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30">
                F1 HUMAN DRAMA &amp; SAGAS
              </span>
              <span className="text-[10px] text-slate-400">NETFLIX &amp; PADDOCK NARRATIVES</span>
            </div>
            <h3 className="text-xl font-racing font-black tracking-wide text-white flex items-center gap-2">
              <span>🎬</span> F1人間ドラマ &amp; 因縁・感動の物語録
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              「F1は単なるマシンの競技ではなく、生身の人間の壮絶な連続ドラマである」。歴史に刻まれた世紀の死闘、親友の裏切り、どん底からの贖罪、そしてパドックの相関関係を物語として追体験。
            </p>
          </div>

          {/* Filter Navigation Pills */}
          <div className="flex flex-wrap gap-1 bg-slate-950/80 p-1.5 rounded-xl border border-white/10 self-start md:self-auto">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-racing font-bold transition-all ${
                activeFilter === 'all'
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              🌟 全エピソード
            </button>
            <button
              onClick={() => setActiveFilter('rivalry')}
              className={`px-3 py-1.5 rounded-lg text-xs font-racing font-bold transition-all ${
                activeFilter === 'rivalry'
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              ⚔️ 宿命のライバル
            </button>
            <button
              onClick={() => setActiveFilter('civil_war')}
              className={`px-3 py-1.5 rounded-lg text-xs font-racing font-bold transition-all ${
                activeFilter === 'civil_war'
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              🥊 チーム内紛
            </button>
            <button
              onClick={() => setActiveFilter('triumph')}
              className={`px-3 py-1.5 rounded-lg text-xs font-racing font-bold transition-all ${
                activeFilter === 'triumph'
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              🏆 感動の贖罪・初優勝
            </button>
            <button
              onClick={() => setActiveFilter('saga')}
              className={`px-3 py-1.5 rounded-lg text-xs font-racing font-bold transition-all ${
                activeFilter === 'saga'
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              ♟️ 激動サガ
            </button>
            <button
              onClick={() => setActiveFilter('map')}
              className={`px-3 py-1.5 rounded-lg text-xs font-racing font-bold transition-all flex items-center gap-1 ${
                activeFilter === 'map'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                  : 'text-sky-400 hover:text-sky-200 hover:bg-slate-900/60'
              }`}
            >
              <span>🧭</span>
              <span>パドック相関図</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── VIEW: PADDOCK RELATIONSHIP CHEMISTRY MAP ── */}
      {activeFilter === 'map' ? (
        <div className="flex flex-col gap-6 animate-fade-in">
          <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-5">
            <h4 className="text-base font-racing font-black text-white flex items-center gap-2 mb-1">
              <span>🧭</span> F1現役パドック 人間関係・相関関係図 (Who&#39;s Who in the Paddock)
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              F1は世界でわずか20人しかシートを持たない極限の閉鎖社会。同じカート時代から戦ってきた親友、血を分けた師弟、チーム内の激しい確執など、コース外の人間ドラマがレースの面白さを何倍にも膨らませます。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {PADDOCK_CONNECTIONS.map((rel: RelationshipConnection, idx: number) => {
              return (
                <div
                  key={idx}
                  className="bg-slate-900/80 border border-white/10 rounded-2xl p-5 flex flex-col justify-between gap-4 hover:border-white/20 transition-all relative overflow-hidden"
                >
                  <div
                    className="absolute top-0 left-0 right-0 h-1"
                    style={{ backgroundColor: rel.color }}
                  />

                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-slate-800 border border-white/20 flex items-center justify-center font-racing font-bold text-xs text-white">
                          {rel.source}
                        </div>
                        <span className="text-xs text-slate-500 font-bold">⇄</span>
                        <div className="w-8 h-8 rounded-full bg-slate-800 border border-white/20 flex items-center justify-center font-racing font-bold text-xs text-white">
                          {rel.target}
                        </div>
                      </div>

                      <span
                        className="text-[10px] font-bold px-2.5 py-0.5 rounded-full"
                        style={{
                          backgroundColor: `${rel.color}20`,
                          color: rel.color,
                          border: `1px solid ${rel.color}40`,
                        }}
                      >
                        {rel.label}
                      </span>
                    </div>

                    <p className="text-xs text-slate-200 leading-relaxed">{rel.description}</p>
                  </div>

                  <div className="text-[10px] text-slate-500 border-t border-white/5 pt-2 flex items-center justify-between">
                    <span>関係タイプ: {rel.relationType.toUpperCase()}</span>
                    <span className="text-slate-400">2025 Paddock Map</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* ── VIEW: DRAMA EPISODE SELECTOR & DEEP NARRATIVE ── */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Episode List (4 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-3">
            <div className="text-xs font-racing font-bold text-slate-400 uppercase tracking-wider mb-0.5">
              ドラマシリーズ一覧 ({filteredEpisodes.length}作品)
            </div>

            <div className="flex flex-col gap-2.5 max-h-[750px] overflow-y-auto pr-1">
              {filteredEpisodes.map((episode: DramaEpisode) => {
                const isSelected = episode.id === selectedEpisodeId;
                return (
                  <button
                    key={episode.id}
                    onClick={() => setSelectedEpisodeId(episode.id)}
                    className={`p-4 rounded-2xl border text-left transition-all flex flex-col gap-2 ${
                      isSelected
                        ? 'bg-slate-800/90 border-rose-500 shadow-lg shadow-rose-950/40 scale-[1.01]'
                        : 'bg-slate-900/50 border-white/10 hover:border-white/20 hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-racing font-bold px-2 py-0.5 rounded-full bg-slate-950 text-slate-300 border border-white/5">
                        {episode.era}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          episode.category === 'rivalry'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                            : episode.category === 'civil_war'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            : episode.category === 'triumph'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                        }`}
                      >
                        {episode.categoryLabel}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-racing font-bold text-sm text-white line-clamp-1">
                        {episode.title}
                      </h4>
                      <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                        {episode.subtitle}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-400 border-t border-white/5 pt-2 mt-1">
                      <div className="flex items-center gap-1.5">
                        {episode.protagonists.map((p, pIdx) => (
                          <span
                            key={pIdx}
                            className="font-racing font-bold px-1.5 py-0.5 rounded bg-slate-950 text-slate-300 border border-white/5"
                          >
                            {p.name}
                          </span>
                        ))}
                      </div>
                      <span className="text-slate-500">全{episode.acts.length}幕</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Selected Episode Storybook (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-5">
            <div className="bg-slate-900/80 border border-white/10 rounded-2xl p-6 flex flex-col gap-6 shadow-xl relative overflow-hidden">
              {/* Header Banner */}
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="text-[10px] font-racing font-bold px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40">
                    {selectedEpisode.categoryLabel}
                  </span>
                  <span className="text-xs text-slate-400 font-racing">{selectedEpisode.era}</span>
                </div>
                <h2 className="text-2xl font-racing font-black text-white tracking-wide">
                  {selectedEpisode.title}
                </h2>
                <p className="text-xs text-slate-300 mt-1 font-medium italic">
                  &ldquo;{selectedEpisode.tagline}&rdquo;
                </p>
              </div>

              {/* Overview */}
              <div className="bg-slate-950/60 p-4 rounded-xl border border-white/5">
                <p className="text-xs text-slate-300 leading-relaxed">{selectedEpisode.overview}</p>
              </div>

              {/* Protagonists Banner */}
              <div>
                <div className="text-[10px] font-racing font-bold text-slate-400 uppercase tracking-wider mb-2">
                  登場人物 (PROTAGONISTS)
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedEpisode.protagonists.map((p, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-950/70 p-3 rounded-xl border border-white/5 flex items-center gap-3"
                    >
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center font-racing font-black text-xs border"
                        style={{
                          backgroundColor: '#090d16',
                          borderColor: p.color,
                          color: p.color,
                        }}
                      >
                        {p.code}
                      </div>
                      <div>
                        <div className="font-racing font-bold text-xs text-white">{p.name}</div>
                        <div className="text-[10px] text-slate-400">
                          {p.team} • {p.role}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* The 3 Acts Timeline (起承転結・全幕) */}
              <div>
                <div className="text-[10px] font-racing font-bold text-amber-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <span>📜</span> 物語の全幕展開 (THE ACTS)
                </div>
                <div className="flex flex-col gap-4">
                  {selectedEpisode.acts.map((act) => (
                    <div
                      key={act.actNumber}
                      className="relative pl-6 border-l-2 border-slate-700 hover:border-rose-500 transition-colors"
                    >
                      {/* Timeline Dot */}
                      <div className="absolute -left-[9px] top-0.5 w-4 h-4 rounded-full bg-slate-950 border-2 border-rose-500 flex items-center justify-center text-[9px] font-bold text-white">
                        {act.actNumber}
                      </div>

                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-racing font-bold text-xs text-white">
                          第{act.actNumber}幕: {act.actTitle}
                        </h4>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed mb-2">
                        {act.description}
                      </p>

                      <div className="bg-slate-950/80 p-2.5 rounded-lg border border-white/5 text-[11px] text-rose-300">
                        <span className="font-bold text-rose-400">決定打の瞬間: </span>
                        {act.pivotalMoment}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Iconic Quotes & Radio Embeds */}
              {selectedEpisode.iconicQuotes.length > 0 && (
                <div>
                  <div className="text-[10px] font-racing font-bold text-sky-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                    <span>🎙️</span> 歴史を揺るがした名言・無線ログ (ICONIC QUOTES)
                  </div>
                  <div className="flex flex-col gap-2.5">
                    {selectedEpisode.iconicQuotes.map((q, qIdx) => (
                      <div
                        key={qIdx}
                        className="bg-slate-950/90 border border-sky-500/30 rounded-xl p-3.5 relative overflow-hidden"
                      >
                        <div className="text-xs font-semibold text-white italic leading-relaxed mb-1">
                          {q.quote}
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-white/5">
                          <span className="font-racing font-bold text-sky-300">
                            — {q.speaker}
                          </span>
                          <span className="text-slate-500">{q.context}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Decisive Grand Prix */}
              <div className="bg-slate-950/90 border border-amber-500/30 rounded-xl p-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-racing font-bold text-amber-400 uppercase tracking-wider">
                    🏁 決着の舞台 (DECISIVE GRAND PRIX)
                  </span>
                  <span className="text-xs font-racing font-bold text-white">
                    {selectedEpisode.decisiveGrandPrix.gp}
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1 mb-2">
                  {selectedEpisode.decisiveGrandPrix.summary}
                </p>
                <div className="text-[11px] text-amber-300 font-medium">
                  {selectedEpisode.decisiveGrandPrix.videoOrRadioHighlight}
                </div>
              </div>

              {/* Aftermath & Why It Matters */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-white/10">
                <div className="bg-slate-950/50 p-3.5 rounded-xl border border-white/5">
                  <div className="text-[10px] font-racing font-bold text-slate-400 uppercase tracking-wider mb-1">
                    その後のパドックへの影響
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {selectedEpisode.aftermath}
                  </p>
                </div>

                <div className="bg-slate-950/50 p-3.5 rounded-xl border border-white/5">
                  <div className="text-[10px] font-racing font-bold text-rose-400 uppercase tracking-wider mb-1">
                    なぜこのドラマが心に刺さるのか？
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {selectedEpisode.whyItMatters}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
