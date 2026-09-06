'use client';

/**
 * components/hubs/KnowledgeHistoryHub.tsx
 * Hub 3: F1 Knowledge & History with 5 Sub-Tabs, Compact Grid & Modal View for Drivers,
 * Academic In-Text Citations ([1]), Key Team Radio Embeds, and Deep Telemetry Session Navigation.
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  KNOWLEDGE_TEAMS,
  KNOWLEDGE_STRATEGIES,
  KNOWLEDGE_HISTORY,
  type Reference,
  type TeamProfile,
  type StrategyConcept,
  type HistoryArchive,
  type EmbeddedRadio,
  type TelemetryTarget,
} from '@/data/f1KnowledgeData';
import { getProxiedAudioUrl } from '@/lib/telemetryUtils';
import TeamDetailModal from './TeamDetailModal';
import DriversHub from './DriversHub';
import CircuitsHub from './CircuitsHub';
import TyreEncyclopediaHub from './TyreEncyclopediaHub';
import F1DramaHub from './F1DramaHub';
import F1GlossaryHub from './F1GlossaryHub';
import F1RegulationsHub from './F1RegulationsHub';
import { useUserPreferences } from '@/lib/userPreferences';

export type SubTab = 'drivers' | 'teams' | 'circuits' | 'tyres' | 'glossary' | 'drama' | 'regulations' | 'strategy' | 'history';

export interface KnowledgeHistoryHubProps {
  onNavigateToTelemetry?: (target?: TelemetryTarget) => void;
  initialSubTab?: SubTab;
  activeSubTab?: SubTab;
  onSubTabChange?: (tab: SubTab) => void;
  targetCircuitId?: string;
  initialDramaTab?: 'storylines' | 'moments' | 'rivalries' | 'paddock' | 'radios';
}

/** Individual Team Radio Audio Player with Play/Pause and Seek Bar */
function EmbeddedRadioCard({ radio }: { radio: EmbeddedRadio }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioError, setAudioError] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!radio.audioUrl) return;
    setAudioError(false);
    const audio = new Audio(getProxiedAudioUrl(radio.audioUrl));
    audioRef.current = audio;

    audio.onloadedmetadata = () => setDuration(audio.duration || 0);
    audio.ontimeupdate = () => setCurrentTime(audio.currentTime || 0);
    audio.onerror = () => {
      setAudioError(true);
      setIsPlaying(false);
    };
    audio.onended = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, [radio.audioUrl]);

  const togglePlay = () => {
    if (!audioRef.current || audioError) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => setAudioError(true));
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setCurrentTime(val);
    if (audioRef.current) audioRef.current.currentTime = val;
  };

  const isPitWall = radio.speaker === 'PIT WALL';

  return (
    <div className="bg-slate-950/70 border border-white/10 rounded-xl p-3.5 flex flex-col gap-2.5 shadow-inner">
      {/* Radio Header: Lap badge + Speaker badge */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="bg-slate-800 text-sky-400 border border-sky-500/30 px-2 py-0.5 rounded text-[10px] font-mono font-bold">
            {radio.lap}
          </span>
          <span
            className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase border ${
              isPitWall
                ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
            }`}
          >
            {isPitWall ? '📡 PIT WALL' : '🏎️ DRIVER'}
          </span>
          <span className="text-xs font-bold text-white leading-tight">
            {radio.speakerName}
          </span>
        </div>

        {radio.audioUrl && !audioError && (
          <button
            onClick={togglePlay}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold font-mono transition-all shadow-md active:scale-95"
          >
            <span>{isPlaying ? '⏸ 一時停止' : '▶ 音声再生'}</span>
          </button>
        )}
      </div>

      {/* Audio Seek Bar (if audio available) */}
      {radio.audioUrl && !audioError && (
        <div className="flex items-center gap-2 bg-slate-900/80 px-2.5 py-1 rounded-lg border border-white/5 text-[10px] font-mono">
          <span className="text-slate-400 w-8">{currentTime.toFixed(1)}s</span>
          <input
            type="range"
            min={0}
            max={duration || 10}
            step={0.1}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-400"
          />
          <span className="text-slate-500 w-8">{duration ? `${duration.toFixed(1)}s` : '--'}</span>
        </div>
      )}

      {/* Transcript (English & Japanese) */}
      <div className="space-y-1 text-xs">
        <p className="text-slate-200 font-mono text-[11px] italic bg-slate-900/50 p-2 rounded-lg border border-white/5">
          &ldquo;{radio.transcript}&rdquo;
        </p>
        <p className="text-sky-200/90 text-xs pl-1">
          💬 {radio.translation}
        </p>
      </div>

      {/* Strategic Tactical Impact Context */}
      <div className="bg-purple-950/30 border border-purple-500/20 p-2 rounded-lg text-[11px] text-purple-200 flex items-start gap-1.5">
        <span className="text-purple-400 font-bold">⚡ 戦略的決定打:</span>
        <span className="text-slate-300 leading-snug">{radio.strategicContext}</span>
      </div>
    </div>
  );
}

export default function KnowledgeHistoryHub({
  onNavigateToTelemetry,
  initialSubTab = 'drivers',
  activeSubTab: controlledSubTab,
  onSubTabChange,
  targetCircuitId,
  initialDramaTab,
}: KnowledgeHistoryHubProps) {
  const [internalSubTab, setInternalSubTab] = useState<SubTab>(initialSubTab);
  const activeSubTab = controlledSubTab ?? internalSubTab;
  const setActiveSubTab = (tab: SubTab) => {
    if (onSubTabChange) onSubTabChange(tab);
    setInternalSubTab(tab);
  };
  const { prefs, isFavoriteTeam, toggleTeam } = useUserPreferences();
  const [teamsFilterStarred, setTeamsFilterStarred] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTeamDetail, setSelectedTeamDetail] = useState<TeamProfile | null>(null);
  const [highlightedRef, setHighlightedRef] = useState<string | null>(null);

  // Jump to Reference list & highlight target reference
  const handleCitationClick = (cardId: string, refId: number) => {
    const targetElementId = `ref-${cardId}-${refId}`;
    const el = document.getElementById(targetElementId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setHighlightedRef(targetElementId);
      setTimeout(() => setHighlightedRef(null), 3000);
    }
  };

  // Helper to parse "[1]", "[2]" into clickable citation badges
  const renderTextWithCitations = (text: string, cardId: string) => {
    const parts = text.split(/(\[\d+\])/g);
    return parts.map((part, idx) => {
      const match = part.match(/\[(\d+)\]/);
      if (match) {
        const refId = parseInt(match[1], 10);
        return (
          <button
            key={idx}
            onClick={() => handleCitationClick(cardId, refId)}
            className="inline-flex items-center px-1 mx-0.5 text-[10px] font-mono font-bold text-sky-400 bg-sky-950/60 hover:bg-sky-800/80 border border-sky-500/40 rounded transition-all cursor-pointer hover:scale-110"
            title={`参考文献 [${refId}] を確認`}
          >
            [{refId}]
          </button>
        );
      }
      return <span key={idx}>{part}</span>;
    });
  };

  // Render References Box at the bottom of a card
  const renderReferencesBox = (references: Reference[], cardId: string) => {
    if (!references || references.length === 0) return null;

    return (
      <div className="mt-3 pt-3 border-t border-white/10 bg-slate-950/40 rounded-xl p-3 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-racing font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <span>📚</span>
            <span>REFERENCES / 一次出典・公式文献</span>
          </span>
          <span className="text-[9px] text-slate-500 font-mono">Academic Verified</span>
        </div>

        <div className="space-y-1.5">
          {references.map((ref) => {
            const elId = `ref-${cardId}-${ref.id}`;
            const isHighlighted = highlightedRef === elId;
            return (
              <div
                key={ref.id}
                id={elId}
                className={`p-2 rounded-lg text-xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-1 border ${
                  isHighlighted
                    ? 'bg-amber-500/20 border-amber-400/80 ring-2 ring-amber-400/50 shadow-lg'
                    : 'bg-slate-900/60 border-white/5 hover:border-white/15'
                }`}
              >
                <div className="flex items-start gap-2">
                  <span className="font-mono text-[10px] font-bold text-sky-400 mt-0.5">
                    [{ref.id}]
                  </span>
                  <div>
                    <p className="text-slate-200 font-medium text-[11px] leading-tight">
                      {ref.title}
                    </p>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {ref.publisher} • 検証日: {ref.verifiedDate}
                    </span>
                  </div>
                </div>

                <a
                  href={ref.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sky-400 hover:text-sky-300 text-[10px] font-medium flex items-center gap-1 flex-shrink-0 self-end sm:self-center"
                >
                  <span>公式ドキュメントを開く</span>
                  <span>↗</span>
                </a>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-5 max-w-6xl mx-auto">

      {/* Header Banner (Shown specifically for Teams, Strategy & History search) */}
      {(activeSubTab === 'teams' || activeSubTab === 'strategy' || activeSubTab === 'history') && (
        <div className="glass-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden">
          <div className="flex flex-col gap-1 z-10">
            <div className="flex items-center gap-2">
              <span className="text-xs font-racing font-bold text-sky-400 uppercase tracking-widest">
                ACADEMIC CITATIONS & DEEP TELEMETRY LINKING
              </span>
            </div>
            <h2 className="text-xl font-racing font-black text-white tracking-wider">
              {activeSubTab === 'teams'
                ? 'F1 CONSTRUCTOR TEAMS & PHILOSOPHIES'
                : activeSubTab === 'strategy'
                ? 'STRATEGY & TECHNICAL REGULATIONS'
                : 'HISTORICAL ARCHIVES & LEGENDARY BATTLES'}
            </h2>
            <p className="text-xs text-slate-400 max-w-xl">
              {activeSubTab === 'teams'
                ? 'FIA公式規則に基づく全10チームの工学哲学、歴代マシン、PU仕様およびファクトリー詳細を体系化。'
                : activeSubTab === 'strategy'
                ? '空力グラウンドエフェクト、タイヤ劣化理論、セーフティカー規則などを公式文献付きで詳解。'
                : 'F1史を揺るがした名勝負を当時の生チーム無線ログ（🎙️）と実テレメトリー連携付きで追体験。'}
            </p>
          </div>

          {/* Search Bar */}
          <div className="z-10 w-full md:w-64">
            <input
              type="text"
              placeholder={`${activeSubTab === 'teams' ? 'チーム' : activeSubTab === 'strategy' ? '戦略・規則' : '歴史アーカイブ'}内を検索...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900/80 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-400 transition-colors"
            />
          </div>
        </div>
      )}

      {/* ── Sub-Tab: TYRES ENCYCLOPEDIA ── */}
      {activeSubTab === 'tyres' && <TyreEncyclopediaHub onNavigateToTelemetry={onNavigateToTelemetry} />}

      {/* ── Sub-Tab: F1 DRAMA & STORYLINES ── */}
      {activeSubTab === 'drama' && <F1DramaHub initialTab={initialDramaTab} />}

      {/* ── Sub-Tab: F1 GLOSSARY ── */}
      {activeSubTab === 'glossary' && <F1GlossaryHub />}

      {/* ── Sub-Tab: FIA REGULATIONS & RULES ── */}
      {activeSubTab === 'regulations' && <F1RegulationsHub onNavigateToTab={(tab) => setActiveSubTab(tab as SubTab)} />}

      {/* ── Sub-Tab 1: TEAMS (Compact Grid + Detail Modal) ── */}
      {activeSubTab === 'teams' && (
        <div className="flex flex-col gap-4 animate-fade-in">
          {/* Teams Filter & Counter Bar */}
          <div className="flex items-center justify-between gap-3 bg-slate-950/70 border border-white/10 rounded-2xl p-3 px-4 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-slate-300">
                F1 2025 全10コンストラクター
              </span>
            </div>
            <button
              onClick={() => setTeamsFilterStarred((prev) => !prev)}
              className={`text-xs font-racing font-bold px-3 py-1.5 rounded-xl border transition-all flex items-center gap-1.5 shadow-sm cursor-pointer ${
                teamsFilterStarred
                  ? 'bg-amber-500/25 border-amber-400 text-amber-300 ring-1 ring-amber-400/50'
                  : 'bg-slate-900 border-white/10 text-slate-400 hover:text-amber-300 hover:border-amber-400/30'
              }`}
              title="推しチームのみ絞り込み"
            >
              <span>{teamsFilterStarred ? '★' : '☆'}</span>
              <span>推しチーム ({prefs.favoriteTeamIds?.length || 0})</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {KNOWLEDGE_TEAMS.filter((t) => {
              if (teamsFilterStarred && !isFavoriteTeam(t.id)) return false;
              return (
                t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                t.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                t.philosophy.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                t.base.toLowerCase().includes(searchQuery.toLowerCase())
              );
            }).map((team) => (
              <div
                key={team.id}
                onClick={() => setSelectedTeamDetail(team)}
                className="glass-card p-4 flex flex-col justify-between gap-3 border-l-4 cursor-pointer hover:border-sky-400 hover:bg-slate-900/90 transition-all hover:scale-[1.02] shadow-md group relative overflow-hidden"
                style={{ borderLeftColor: team.color }}
              >
                <div className="space-y-2.5">
                  {/* Card Header: Initial Badge, Name, Titles & Favorite Star */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center font-racing font-black text-xs border shadow-sm flex-shrink-0"
                        style={{
                          color: team.color,
                          borderColor: `${team.color}60`,
                          backgroundColor: `${team.color}15`,
                        }}
                      >
                        {team.name.slice(0, 3).toUpperCase()}
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-mono block">
                          {team.base.split(',')[0]}
                        </span>
                        <h3 className="text-sm font-bold text-white group-hover:text-sky-300 transition-colors leading-tight">
                          {team.name}
                        </h3>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {team.constructorTitles > 0 && (
                        <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold flex items-center gap-1">
                          <span>🏆</span>
                          <span>{team.constructorTitles}冠</span>
                        </span>
                      )}

                      {/* Favorite Star Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleTeam(team.id);
                        }}
                        className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-all cursor-pointer ${
                          isFavoriteTeam(team.id)
                            ? 'bg-amber-400/20 border-amber-400/60 text-amber-300 hover:bg-amber-400/30 shadow-sm'
                            : 'bg-slate-900/60 border-white/10 text-slate-500 hover:text-amber-300 hover:border-amber-400/40'
                        }`}
                        title={isFavoriteTeam(team.id) ? '推しチームから外す' : '推しチーム (マイパドック) に登録'}
                      >
                        <span className="text-xs">{isFavoriteTeam(team.id) ? '★' : '☆'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Quick specs pill bar */}
                  <div className="flex flex-wrap gap-1 text-[10px] font-mono">
                    <span className="bg-slate-900/80 px-2 py-0.5 rounded-md text-slate-300 border border-white/5">
                      PU: <strong className="text-sky-300">{team.powerUnit}</strong>
                    </span>
                    <span className="bg-slate-900/80 px-2 py-0.5 rounded-md text-slate-300 border border-white/5">
                      代表: <strong className="text-slate-200">{team.teamPrincipal}</strong>
                    </span>
                  </div>

                  {/* Drivers badge list */}
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400">
                    <span>ドライバー:</span>
                    {team.drivers.map((d) => (
                      <span
                        key={d}
                        className="px-1.5 py-0.5 rounded bg-slate-800 text-white font-bold border border-white/10"
                      >
                        {d}
                      </span>
                    ))}
                  </div>

                  {/* Philosophy summary snippet */}
                  <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed bg-slate-950/40 p-2 rounded-lg border border-white/5">
                    {team.philosophy.description.replace(/\[\d+\]/g, '')}
                  </p>
                </div>

                {/* Card Footer: Detail Link */}
                <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[11px] font-mono text-slate-400">
                  <span className="text-[10px] text-slate-500">
                    一次出典: {team.references.length}件
                  </span>
                  <span className="text-sky-400 group-hover:underline flex items-center gap-0.5 font-bold">
                    <span>詳細解説を見る</span>
                    <span>➔</span>
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Team Detail Modal */}
          {selectedTeamDetail && (
            <TeamDetailModal
              team={selectedTeamDetail}
              allTeams={KNOWLEDGE_TEAMS}
              onSelectTeam={(t) => setSelectedTeamDetail(t)}
              onClose={() => setSelectedTeamDetail(null)}
            />
          )}
        </div>
      )}

      {/* ── Sub-Tab 2: DRIVERS (Team Grouped / Flat / Legends + Detail Modal) ── */}
      {activeSubTab === 'drivers' && (
        <DriversHub
          searchQuery={searchQuery}
          onClearSearch={() => setSearchQuery('')}
          onNavigateToTelemetry={onNavigateToTelemetry}
          onNavigateToDrama={() => setActiveSubTab('drama')}
        />
      )}

      {/* ── Sub-Tab 3: CIRCUITS (Quick Region/Characteristic Filters + Detail Modal) ── */}
      {activeSubTab === 'circuits' && (
        <CircuitsHub
          searchQuery={searchQuery}
          initialCircuitId={targetCircuitId}
          onClearSearch={() => setSearchQuery('')}
          onNavigateToTelemetry={onNavigateToTelemetry}
        />
      )}

      {/* ── Sub-Tab 4: STRATEGY & REGULATIONS ── */}
      {activeSubTab === 'strategy' && (
        <div className="flex flex-col gap-4 animate-fade-in">
          {KNOWLEDGE_STRATEGIES.filter(
            (s) =>
              s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              s.description.toLowerCase().includes(searchQuery.toLowerCase())
          ).map((strat) => (
            <div
              key={strat.id}
              className="glass-card p-5 flex flex-col justify-between gap-4"
            >
              <div className="flex flex-col gap-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-racing font-bold text-sky-400 uppercase tracking-widest">
                      {strat.category}
                    </span>
                    <h3 className="text-base font-bold text-white leading-tight">
                      {strat.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">{strat.subtitle}</p>
                  </div>

                  {strat.telemetrySession && onNavigateToTelemetry && (
                    <button
                      onClick={() => onNavigateToTelemetry(strat.telemetrySession)}
                      className="px-3.5 py-1.5 bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-500 hover:to-sky-500 text-white rounded-xl text-xs font-racing font-bold flex items-center gap-1.5 shadow-md transition-all active:scale-95"
                    >
                      <span>📊</span>
                      <span>テレメトリーでアンダーカットを見る</span>
                      <span>➔</span>
                    </button>
                  )}
                </div>

                <p className="text-xs text-slate-200 leading-relaxed bg-slate-950/60 p-3.5 rounded-xl border border-white/5">
                  {renderTextWithCitations(strat.description, strat.id)}
                </p>

                {/* Key Takeaways */}
                <div>
                  <h4 className="text-[10px] font-racing font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    📌 戦略シミュレーションの重要公理
                  </h4>
                  <ul className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
                    {strat.keyTakeaways.map((takeaway, idx) => (
                      <li
                        key={idx}
                        className="bg-slate-900/80 p-2.5 rounded-xl border border-white/5 text-[11px] text-slate-300 flex items-start gap-1.5"
                      >
                        <span className="text-sky-400 font-bold">•</span>
                        <span>{takeaway}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Embedded Key Team Radio Logs */}
                {strat.keyRadios && strat.keyRadios.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-white/10">
                    <h4 className="text-[10px] font-racing font-bold text-purple-300 uppercase tracking-wider flex items-center gap-1">
                      <span>🎙️</span>
                      <span>KEY TEAM RADIO / 象徴的チーム無線ログ</span>
                    </h4>
                    <div className="space-y-2">
                      {strat.keyRadios.map((radio) => (
                        <EmbeddedRadioCard key={radio.id} radio={radio} />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* References Box */}
              {renderReferencesBox(strat.references, strat.id)}
            </div>
          ))}
        </div>
      )}

      {/* ── Sub-Tab 5: HISTORY ARCHIVE ── */}
      {activeSubTab === 'history' && (
        <div className="flex flex-col gap-4 animate-fade-in">
          {KNOWLEDGE_HISTORY.filter(
            (h) =>
              h.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              h.grandPrix.toLowerCase().includes(searchQuery.toLowerCase())
          ).map((item) => (
            <div
              key={item.id}
              className="glass-card p-5 flex flex-col justify-between gap-4"
            >
              <div className="flex flex-col gap-3">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded text-[10px] font-mono font-bold">
                        {item.year}
                      </span>
                      <span className="text-xs font-mono text-slate-400">
                        {item.grandPrix}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-white leading-tight mt-1">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-400">{item.subtitle}</p>
                  </div>
                </div>

                <p className="text-xs text-slate-200 leading-relaxed bg-slate-950/60 p-3.5 rounded-xl border border-white/5">
                  {renderTextWithCitations(item.strategicNarrative, item.id)}
                </p>

                <div className="bg-slate-900/80 p-2.5 rounded-xl border border-amber-500/20 text-xs flex items-center gap-2">
                  <span className="text-amber-400">🏆</span>
                  <span className="text-slate-200 font-medium text-[11px]">
                    {item.outcome}
                  </span>
                </div>

                {/* Embedded Key Team Radio Logs */}
                {item.keyRadios && item.keyRadios.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-white/10">
                    <h4 className="text-[10px] font-racing font-bold text-purple-300 uppercase tracking-wider flex items-center gap-1">
                      <span>🎙️</span>
                      <span>KEY TEAM RADIO / 象徴的チーム無線ログ</span>
                    </h4>
                    <div className="space-y-2">
                      {item.keyRadios.map((radio) => (
                        <EmbeddedRadioCard key={radio.id} radio={radio} />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* References Box */}
              {renderReferencesBox(item.references, item.id)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
