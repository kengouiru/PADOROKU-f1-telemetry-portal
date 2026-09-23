'use client';

/**
 * components/hubs/KnowledgeHistoryHub.tsx
 * Hub 3: F1 Knowledge & History with 5 Sub-Tabs, Compact Grid & Modal View for Drivers,
 * Academic In-Text Citations ([1]), Key Team Radio Embeds, and Deep Telemetry Session Navigation.
 */

import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  KNOWLEDGE_TEAMS,
  KNOWLEDGE_STRATEGIES,
  KNOWLEDGE_HISTORY,
  KNOWLEDGE_DRIVERS,
  KNOWLEDGE_CIRCUITS,
  type Reference,
  type TeamProfile,
  type StrategyConcept,
  type HistoryArchive,
  type EmbeddedRadio,
  type TelemetryTarget,
} from '@/data/f1KnowledgeData';
import { GLOSSARY_TERMS } from '@/data/f1GlossaryData';
import { TYRE_COMPOUNDS } from '@/data/tyreEncyclopediaData';
import { getProxiedAudioUrl } from '@/lib/telemetryUtils';
import TeamDetailModal from './TeamDetailModal';
import DriversHub from './DriversHub';
import CircuitsHub from './CircuitsHub';
import TyreEncyclopediaHub from './TyreEncyclopediaHub';
import F1DramaHub from './F1DramaHub';
import F1GlossaryHub from './F1GlossaryHub';
import F1RegulationsHub from './F1RegulationsHub';
import RulesGlossaryHub from './RulesGlossaryHub';
import DataSourceVerificationModal from './DataSourceVerificationModal';
import VirtualPitwallWarRoom from '@/components/strategy/VirtualPitwallWarRoom';
import { useUserPreferences } from '@/lib/userPreferences';
import { type InAppLink } from '@/data/f1GlossaryData';

export type SubTab = 'drivers' | 'teams' | 'circuits' | 'tyres' | 'rules' | 'glossary' | 'drama' | 'regulations' | 'strategy' | 'history';

export interface KnowledgeHistoryHubProps {
  onNavigateToTelemetry?: (target?: TelemetryTarget) => void;
  initialSubTab?: SubTab;
  activeSubTab?: SubTab;
  onSubTabChange?: (tab: SubTab) => void;
  targetCircuitId?: string;
  initialDramaTab?: 'storylines' | 'moments' | 'rivalries' | 'paddock' | 'radios';
  initialGlossaryTermId?: string | null;
  onNavigateToApp?: (action: InAppLink['action']) => void;
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

export type PuFilter = 'ALL' | 'Ferrari' | 'Mercedes' | 'RedBullFord' | 'Honda' | 'Audi';

export const PU_OPTIONS: { key: PuFilter; label: string; count: number; badgeColor: string; pillColor: string }[] = [
  { key: 'ALL', label: 'ALL (全11チーム)', count: 11, badgeColor: 'border-white/20 text-slate-200', pillColor: 'bg-white/10' },
  { key: 'Ferrari', label: 'Ferrari PU', count: 3, badgeColor: 'border-red-500/40 text-red-300', pillColor: 'bg-red-500/20' },
  { key: 'Mercedes', label: 'Mercedes PU', count: 4, badgeColor: 'border-teal-500/40 text-teal-300', pillColor: 'bg-teal-500/20' },
  { key: 'RedBullFord', label: 'RB Ford PU', count: 2, badgeColor: 'border-sky-500/40 text-sky-300', pillColor: 'bg-sky-500/20' },
  { key: 'Honda', label: 'Honda Works', count: 1, badgeColor: 'border-rose-500/40 text-rose-300', pillColor: 'bg-rose-500/20' },
  { key: 'Audi', label: 'Audi Works', count: 1, badgeColor: 'border-amber-500/40 text-amber-300', pillColor: 'bg-amber-500/20' },
];

export const POPULAR_TOPICS: { label: string; subTab: SubTab; q: string }[] = [
  { label: 'アンダーカット', subTab: 'strategy', q: 'アンダーカット' },
  { label: '2026年新PU規定', subTab: 'rules', q: '2026' },
  { label: '角田裕毅', subTab: 'drivers', q: '角田' },
  { label: 'ホンダWorks', subTab: 'teams', q: 'honda' },
  { label: '鈴鹿サーキット', subTab: 'circuits', q: 'suzuka' },
  { label: 'タイヤ熱入れ', subTab: 'tyres', q: '熱入れ' },
  { label: 'アブダビ2021最終周', subTab: 'history', q: '2021' },
];

export function getPuBadgeInfo(pu: string) {
  const p = pu.toLowerCase();
  if (p.includes('honda')) return { label: 'Honda Works (HRC)', color: 'bg-rose-950/70 border-rose-500/40 text-rose-300' };
  if (p.includes('ford') || p.includes('red bull')) return { label: 'Red Bull Ford Powertrains', color: 'bg-sky-950/70 border-sky-500/40 text-sky-300' };
  if (p.includes('audi')) return { label: 'Audi Works E-Performance', color: 'bg-amber-950/70 border-amber-500/40 text-amber-300' };
  if (p.includes('ferrari')) return { label: 'Ferrari Works / Customer', color: 'bg-red-950/70 border-red-500/40 text-red-300' };
  return { label: 'Mercedes-AMG M17', color: 'bg-teal-950/70 border-teal-500/40 text-teal-300' };
}

export default function KnowledgeHistoryHub({
  onNavigateToTelemetry,
  initialSubTab = 'drivers',
  activeSubTab: controlledSubTab,
  onSubTabChange,
  targetCircuitId,
  initialDramaTab,
  initialGlossaryTermId,
  onNavigateToApp,
}: KnowledgeHistoryHubProps) {
  const [internalSubTab, setInternalSubTab] = useState<SubTab>(initialSubTab);
  const activeSubTab = controlledSubTab ?? internalSubTab;
  const setActiveSubTab = (tab: SubTab) => {
    if (onSubTabChange) onSubTabChange(tab);
    setInternalSubTab(tab);
  };
  const { prefs, isFavoriteTeam, toggleTeam } = useUserPreferences();
  const [teamsFilterStarred, setTeamsFilterStarred] = useState(false);
  const [puFilter, setPuFilter] = useState<'ALL' | 'Ferrari' | 'Mercedes' | 'RedBullFord' | 'Honda' | 'Audi'>('ALL');
  const [isPuFilterOpen, setIsPuFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [universalQuery, setUniversalQuery] = useState<string>('');
  const [searchFocused, setSearchFocused] = useState<boolean>(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const [selectedTeamDetail, setSelectedTeamDetail] = useState<TeamProfile | null>(null);
  const [highlightedRef, setHighlightedRef] = useState<string | null>(null);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);

  // Close search dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Universal Cross-Encyclopedia Search Index
  const searchResults = useMemo(() => {
    if (!universalQuery.trim()) return [];
    const q = universalQuery.toLowerCase().trim();
    const results: {
      id: string;
      categoryBadge: string;
      categoryBadgeColor: string;
      title: string;
      subtitle: string;
      onSelect: () => void;
    }[] = [];

    // 1. Drivers
    KNOWLEDGE_DRIVERS.forEach((d) => {
      if (
        d.fullName.toLowerCase().includes(q) ||
        d.code.toLowerCase().includes(q) ||
        d.team.toLowerCase().includes(q) ||
        (d.nickname && d.nickname.toLowerCase().includes(q))
      ) {
        results.push({
          id: `driver-${d.code}`,
          categoryBadge: '👤 選手',
          categoryBadgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
          title: `${d.fullName} (${d.code})`,
          subtitle: `${d.team} • #${d.number}`,
          onSelect: () => {
            setActiveSubTab('drivers');
            setSearchQuery(d.fullName);
            setUniversalQuery('');
            setSearchFocused(false);
          },
        });
      }
    });

    // 2. Teams
    KNOWLEDGE_TEAMS.forEach((t) => {
      if (
        t.name.toLowerCase().includes(q) ||
        t.fullName.toLowerCase().includes(q) ||
        t.powerUnit.toLowerCase().includes(q) ||
        t.base.toLowerCase().includes(q)
      ) {
        results.push({
          id: `team-${t.id}`,
          categoryBadge: '🏎️ チーム',
          categoryBadgeColor: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
          title: t.name,
          subtitle: `PU: ${t.powerUnit} • 代表: ${t.teamPrincipal}`,
          onSelect: () => {
            setSelectedTeamDetail(t);
            setActiveSubTab('teams');
            setUniversalQuery('');
            setSearchFocused(false);
          },
        });
      }
    });

    // 3. Circuits
    KNOWLEDGE_CIRCUITS.forEach((c) => {
      if (
        c.name.toLowerCase().includes(q) ||
        c.officialName.toLowerCase().includes(q) ||
        c.country.toLowerCase().includes(q) ||
        c.characteristics.toLowerCase().includes(q)
      ) {
        results.push({
          id: `circuit-${c.id}`,
          categoryBadge: '🏁 コース',
          categoryBadgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
          title: c.name,
          subtitle: `${c.country} • 全長 ${(c.lengthKm).toFixed(3)}km • ${c.characteristics}`,
          onSelect: () => {
            setActiveSubTab('circuits');
            setSearchQuery(c.name);
            setUniversalQuery('');
            setSearchFocused(false);
          },
        });
      }
    });

    // 4. Tyres
    TYRE_COMPOUNDS.forEach((t) => {
      if (
        t.name.toLowerCase().includes(q) ||
        t.code.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.idealConditions.toLowerCase().includes(q)
      ) {
        results.push({
          id: `tyre-${t.id}`,
          categoryBadge: '🛞 タイヤ',
          categoryBadgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
          title: t.name,
          subtitle: `${t.workingRange} • ${t.idealConditions}`,
          onSelect: () => {
            setActiveSubTab('tyres');
            setUniversalQuery('');
            setSearchFocused(false);
          },
        });
      }
    });

    // 5. Strategy
    KNOWLEDGE_STRATEGIES.forEach((s) => {
      if (
        s.title.toLowerCase().includes(q) ||
        s.subtitle.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q)
      ) {
        results.push({
          id: `strat-${s.id}`,
          categoryBadge: '⏱️ 作戦室',
          categoryBadgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
          title: s.title,
          subtitle: s.subtitle,
          onSelect: () => {
            setActiveSubTab('strategy');
            setSearchQuery(s.title);
            setUniversalQuery('');
            setSearchFocused(false);
          },
        });
      }
    });

    // 6. Glossary & Rules
    GLOSSARY_TERMS.forEach((g) => {
      if (
        g.term.toLowerCase().includes(q) ||
        g.englishTerm.toLowerCase().includes(q) ||
        g.summary.toLowerCase().includes(q) ||
        g.description.toLowerCase().includes(q)
      ) {
        results.push({
          id: `glossary-${g.id}`,
          categoryBadge: '⚖️ 用語',
          categoryBadgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
          title: `${g.term} (${g.englishTerm})`,
          subtitle: g.summary,
          onSelect: () => {
            setActiveSubTab('rules');
            if (onNavigateToApp) {
              onNavigateToApp({ hub: 'knowledge', subTab: 'glossary' });
            }
            setUniversalQuery('');
            setSearchFocused(false);
          },
        });
      }
    });

    // 7. History
    KNOWLEDGE_HISTORY.forEach((h) => {
      if (
        h.title.toLowerCase().includes(q) ||
        h.grandPrix.toLowerCase().includes(q) ||
        h.strategicNarrative.toLowerCase().includes(q)
      ) {
        results.push({
          id: `hist-${h.id}`,
          categoryBadge: '🏛️ 歴史',
          categoryBadgeColor: 'bg-amber-600/20 text-amber-200 border-amber-500/30',
          title: `${h.year} ${h.grandPrix}`,
          subtitle: h.title,
          onSelect: () => {
            setActiveSubTab('history');
            setSearchQuery(h.title);
            setUniversalQuery('');
            setSearchFocused(false);
          },
        });
      }
    });

    return results.slice(0, 10);
  }, [universalQuery, onNavigateToApp]);

  // Filtered Teams with PU Supplier Filter & Starred Filter
  const filteredTeams = useMemo(() => {
    return KNOWLEDGE_TEAMS.filter((t) => {
      if (teamsFilterStarred && !isFavoriteTeam(t.id)) return false;

      if (puFilter === 'Ferrari' && !t.powerUnit.toLowerCase().includes('ferrari')) return false;
      if (puFilter === 'Mercedes' && !t.powerUnit.toLowerCase().includes('mercedes')) return false;
      if (puFilter === 'RedBullFord' && !t.powerUnit.toLowerCase().includes('ford') && !t.powerUnit.toLowerCase().includes('red bull')) return false;
      if (puFilter === 'Honda' && !t.powerUnit.toLowerCase().includes('honda')) return false;
      if (puFilter === 'Audi' && !t.powerUnit.toLowerCase().includes('audi')) return false;

      const q = (universalQuery || searchQuery).toLowerCase().trim();
      if (q) {
        return (
          t.name.toLowerCase().includes(q) ||
          t.fullName.toLowerCase().includes(q) ||
          t.powerUnit.toLowerCase().includes(q) ||
          t.base.toLowerCase().includes(q) ||
          t.philosophy.description.toLowerCase().includes(q) ||
          t.drivers.some((d) => d.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [teamsFilterStarred, puFilter, universalQuery, searchQuery, isFavoriteTeam]);

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
    <div className="flex flex-col gap-3 sm:gap-4 max-w-6xl mx-auto pb-6 sm:pb-2">
      {/* ── Prominent Universal Library Command Bar ── */}
      <div ref={searchContainerRef} className="relative z-30">
        <div className="glass-card-premium p-2.5 sm:p-3 rounded-2xl flex items-center gap-3 border border-white/10 shadow-xl backdrop-blur-md">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-red-600/30 to-rose-600/30 border border-red-500/40 flex items-center justify-center text-sm shrink-0 shadow-inner">
            🔍
          </div>
          <input
            type="text"
            value={universalQuery}
            onChange={(e) => {
              setUniversalQuery(e.target.value);
              setSearchFocused(true);
            }}
            onFocus={() => setSearchFocused(true)}
            placeholder="F1大百科 全横断検索 (選手 / チーム / PU / コース / タイヤ / 戦略 / 用語 / 歴史)..."
            className="flex-1 bg-transparent text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none font-mono"
          />
          {universalQuery && (
            <button
              type="button"
              onClick={() => {
                setUniversalQuery('');
                setSearchQuery('');
              }}
              className="w-6 h-6 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center text-xs cursor-pointer transition-colors"
              title="検索クリア"
            >
              ✕
            </button>
          )}
          <div className="hidden md:flex items-center gap-2 border-l border-white/10 pl-3">
            <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
              <span>🛡️</span>
              <span>FIA・FOM公式準拠</span>
            </span>
            <button
              type="button"
              onClick={() => setIsVerificationModalOpen(true)}
              className="btn-console text-[10px] py-1 px-2.5 text-emerald-300 border-emerald-500/30 hover:border-emerald-400 cursor-pointer flex items-center gap-1.5"
            >
              <span>出典検証</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </button>
          </div>
        </div>

        {/* Dropdown Instant Search Matches & Popular Topics when Focused */}
        {searchFocused && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-slate-950/95 border border-sky-500/40 rounded-2xl shadow-2xl backdrop-blur-xl p-2.5 max-h-96 overflow-y-auto z-50 animate-fade-in divide-y divide-white/5">
            {universalQuery.trim().length === 0 ? (
              <div className="p-2 space-y-2">
                <div className="text-[11px] font-racing font-bold text-slate-300 flex items-center gap-1.5 px-1">
                  <span>🔥</span>
                  <span>注目トピック (ワンクリックで即座にジャンプ)</span>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {POPULAR_TOPICS.map((topic) => (
                    <button
                      key={topic.label}
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => {
                        setActiveSubTab(topic.subTab);
                        setSearchQuery(topic.q);
                        setUniversalQuery('');
                        setSearchFocused(false);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-sky-300 border border-white/10 hover:border-sky-500/40 text-xs font-mono transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <span className="text-red-400">#</span>
                      <span>{topic.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                <div className="text-[10px] font-mono font-bold text-slate-400 px-2.5 py-1.5 flex items-center justify-between">
                  <span>検索結果 ({searchResults.length}件)</span>
                  <span>クリックで直接ジャンプ</span>
                </div>
                {searchResults.length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-400">
                    該当する情報が見つかりませんでした。別のキーワード（例: 角田, アンダーカット, 鈴鹿）をお試しください。
                  </div>
                ) : (
                  searchResults.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={item.onSelect}
                      className="w-full p-2.5 rounded-xl hover:bg-white/5 flex items-center justify-between gap-3 text-left transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border shrink-0 ${item.categoryBadgeColor}`}>
                          {item.categoryBadge}
                        </span>
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-white group-hover:text-sky-300 transition-colors truncate">
                            {item.title}
                          </div>
                          <div className="text-[11px] text-slate-400 truncate">
                            {item.subtitle}
                          </div>
                        </div>
                      </div>
                      <span className="text-xs text-slate-500 group-hover:text-sky-400 transition-colors shrink-0">
                        ➔
                      </span>
                    </button>
                  ))
                )}
              </>
            )}
          </div>
        )}
      </div>

      <DataSourceVerificationModal
        isOpen={isVerificationModalOpen}
        onClose={() => setIsVerificationModalOpen(false)}
      />

      {/* ── Sub-Tab: TYRES ENCYCLOPEDIA ── */}
      {activeSubTab === 'tyres' && <TyreEncyclopediaHub onNavigateToTelemetry={onNavigateToTelemetry} />}

      {/* ── Sub-Tab: F1 DRAMA & STORYLINES ── */}
      {activeSubTab === 'drama' && <F1DramaHub initialTab={initialDramaTab} />}

      {/* ── Sub-Tab: RULES & GLOSSARY (規定・用語集 統合ハブ) ── */}
      {(activeSubTab === 'rules' || activeSubTab === 'glossary' || activeSubTab === 'regulations') && (
        <RulesGlossaryHub
          initialMode={activeSubTab === 'regulations' ? 'regulations' : 'glossary'}
          initialGlossaryTermId={initialGlossaryTermId}
          onNavigateToApp={onNavigateToApp}
          onNavigateToTab={(tab) => {
            if (tab === 'glossary' || tab === 'regulations' || tab === 'rules') {
              setActiveSubTab('rules');
            } else {
              setActiveSubTab(tab as SubTab);
            }
          }}
          onNavigateToTelemetry={onNavigateToTelemetry}
        />
      )}

      {/* ── Sub-Tab 1: TEAMS (Compact Grid + Collapsible PU Filter + Detail Modal) ── */}
      {activeSubTab === 'teams' && (
        selectedTeamDetail ? (
          <TeamDetailModal
            team={selectedTeamDetail}
            allTeams={KNOWLEDGE_TEAMS}
            onSelectTeam={(t) => setSelectedTeamDetail(t)}
            onSelectDriverDetail={() => {
              setActiveSubTab('drivers');
              setSelectedTeamDetail(null);
            }}
            onNavigateToTelemetry={onNavigateToTelemetry}
            onClose={() => setSelectedTeamDetail(null)}
          />
        ) : (
          <div className="flex flex-col gap-3 animate-fade-in">
          {/* Sleek Compact Action Bar */}
          <div className="glass-card-premium rounded-xl p-2.5 sm:p-3 shadow-md flex flex-wrap items-center justify-between gap-2.5 border border-white/10">
            {/* Left: Title & Count */}
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="text-sm sm:text-base font-racing font-bold text-white tracking-wide flex items-center gap-1.5">
                <span>🏎️</span>
                <span>F1チーム名鑑</span>
              </h2>
              <span className="text-xs font-mono font-bold bg-slate-900/90 px-2.5 py-1 rounded-lg border border-white/10 text-sky-400">
                表示中: <strong className="text-white text-sm">{filteredTeams.length}</strong> / {KNOWLEDGE_TEAMS.length} チーム
              </span>
              {searchQuery && (
                <span className="text-[11px] text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-white/10">
                  &quot;{searchQuery}&quot;
                </span>
              )}
            </div>

            {/* Right: Starred Filter, PU Filter Tray Toggle, Reset */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setTeamsFilterStarred((prev) => !prev)}
                className={`text-xs font-racing font-bold px-2.5 py-1.5 rounded-lg border transition-all flex items-center gap-1.5 shadow-sm cursor-pointer ${
                  teamsFilterStarred
                    ? 'bg-amber-500/25 border-amber-400 text-amber-300 ring-1 ring-amber-400/50'
                    : 'bg-slate-900/80 border-white/10 text-slate-400 hover:text-amber-300 hover:border-amber-400/30'
                }`}
                title="推しチームのみ絞り込み"
              >
                <span>{teamsFilterStarred ? '★' : '☆'}</span>
                <span>推しチーム ({prefs.favoriteTeamIds?.length || 0})</span>
              </button>

              <button
                type="button"
                onClick={() => setIsPuFilterOpen((prev) => !prev)}
                className={`text-xs font-racing font-bold px-3 py-1.5 rounded-lg border transition-all flex items-center gap-1.5 shadow-sm cursor-pointer ${
                  isPuFilterOpen
                    ? 'bg-red-600 text-white border-red-400 shadow-red-500/30 ring-1 ring-red-400/50'
                    : puFilter !== 'ALL'
                    ? 'bg-red-950/80 border-red-500/50 text-red-300 hover:bg-red-900/80'
                    : 'bg-slate-900/80 border-white/10 text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
                title="PU供給元フィルターの開閉"
              >
                <span>⚡</span>
                <span>PU供給元</span>
                {puFilter !== 'ALL' && (
                  <span className="w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-mono flex items-center justify-center font-bold">
                    1
                  </span>
                )}
                <span className="text-[10px]">{isPuFilterOpen ? '▲' : '▼'}</span>
              </button>

              {(puFilter !== 'ALL' || teamsFilterStarred || searchQuery) && (
                <button
                  type="button"
                  onClick={() => {
                    setPuFilter('ALL');
                    setTeamsFilterStarred(false);
                    setSearchQuery('');
                  }}
                  className="text-xs font-mono font-bold bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 px-2.5 py-1.5 rounded-lg transition-all flex items-center gap-1 shadow-sm active:scale-95 cursor-pointer"
                  title="すべての絞り込み条件をリセット"
                >
                  <span>✕</span>
                  <span className="hidden sm:inline">リセット</span>
                </button>
              )}
            </div>
          </div>

          {/* Collapsible PU Filter Tray */}
          {isPuFilterOpen && (
            <div className="glass-card-premium rounded-xl p-3 sm:p-3.5 border border-red-500/30 shadow-xl flex flex-col gap-2.5 animate-fade-in">
              <div className="flex items-center justify-between pb-1.5 border-b border-white/10 text-xs">
                <span className="font-racing font-bold text-slate-300 flex items-center gap-1.5">
                  <span>⚡</span>
                  <span>2026年パワーユニット (PU) 供給元を選択</span>
                </span>
                <button
                  type="button"
                  onClick={() => setIsPuFilterOpen(false)}
                  className="text-slate-400 hover:text-white text-xs px-2 py-0.5 rounded hover:bg-white/10 transition-colors cursor-pointer"
                >
                  閉じる ✕
                </button>
              </div>
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                {PU_OPTIONS.map((opt) => {
                  const isActive = puFilter === opt.key;
                  return (
                    <button
                      key={opt.key}
                      type="button"
                      onClick={() => setPuFilter(opt.key)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                        isActive
                          ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md shadow-red-950/40 border border-red-500/40 ring-1 ring-red-400/40'
                          : 'bg-slate-900/80 text-slate-300 hover:text-white hover:bg-white/10 border border-white/5'
                      }`}
                    >
                      <span>{opt.label}</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isActive ? 'bg-white/20 text-white' : opt.pillColor}`}>
                        {opt.count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Active PU Filter Chips Strip */}
          {(puFilter !== 'ALL' || teamsFilterStarred || searchQuery) && (
            <div className="flex flex-wrap items-center gap-1.5 px-1 text-xs">
              <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1 mr-1">
                <span>🎯</span>
                <span>絞り込み中:</span>
              </span>
              {puFilter !== 'ALL' && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-red-950/80 border border-red-500/40 text-red-200 text-[11px] font-mono">
                  <span>⚡ {PU_OPTIONS.find((p) => p.key === puFilter)?.label}</span>
                  <button
                    type="button"
                    onClick={() => setPuFilter('ALL')}
                    className="hover:text-white text-red-400 hover:bg-red-800/50 rounded px-1 ml-0.5 cursor-pointer"
                    title="PUフィルター解除"
                  >
                    ✕
                  </button>
                </span>
              )}
              {teamsFilterStarred && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-950/80 border border-amber-500/40 text-amber-200 text-[11px] font-mono">
                  <span>★ 推しチームのみ</span>
                  <button
                    type="button"
                    onClick={() => setTeamsFilterStarred(false)}
                    className="hover:text-white text-amber-400 hover:bg-amber-800/50 rounded px-1 ml-0.5 cursor-pointer"
                    title="推しチーム絞り込み解除"
                  >
                    ✕
                  </button>
                </span>
              )}
              {searchQuery && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-sky-950/80 border border-sky-500/40 text-sky-200 text-[11px] font-mono">
                  <span>&quot;{searchQuery}&quot;</span>
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="hover:text-white text-sky-400 hover:bg-sky-800/50 rounded px-1 ml-0.5 cursor-pointer"
                    title="検索解除"
                  >
                    ✕
                  </button>
                </span>
              )}
              <button
                type="button"
                onClick={() => {
                  setPuFilter('ALL');
                  setTeamsFilterStarred(false);
                  setSearchQuery('');
                }}
                className="text-[11px] text-rose-400 hover:text-rose-300 underline ml-1 cursor-pointer font-mono"
              >
                すべて解除
              </button>
            </div>
          )}

          {/* Teams Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredTeams.map((team) => {
              const puInfo = getPuBadgeInfo(team.powerUnit);
              return (
                <div
                  key={team.id}
                  onClick={() => setSelectedTeamDetail(team)}
                  className="glass-card-premium p-3.5 sm:p-4 rounded-xl flex flex-col justify-between gap-3 border-l-4 cursor-pointer hover:border-sky-400 hover:bg-slate-900/95 transition-all hover:scale-[1.01] shadow-lg group relative overflow-hidden"
                  style={{ borderLeftColor: team.color }}
                >
                  <div className="space-y-2.5">
                    {/* Card Header: Initial Badge, Name, Titles & Favorite Star */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center font-racing font-black text-xs border shadow-sm shrink-0"
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
                            📍 {team.base.split(',')[0]}
                          </span>
                          <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-sky-300 transition-colors leading-tight">
                            {team.name}
                          </h3>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {team.constructorTitles > 0 && (
                          <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold flex items-center gap-1">
                            <span>🏆</span>
                            <span>{team.constructorTitles}冠</span>
                          </span>
                        )}

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleTeam(team.id);
                          }}
                          className={`w-7 h-7 rounded-lg flex items-center justify-center border transition-all cursor-pointer ${
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

                    {/* PU Supplier & Principal Badges */}
                    <div className="flex flex-wrap gap-1.5 text-[11px] font-mono">
                      <span className={`px-2 py-0.5 rounded-lg border text-[10px] font-bold ${puInfo.color}`}>
                        ⚡ {team.powerUnit}
                      </span>
                      <span className="bg-slate-900/80 px-2 py-0.5 rounded-lg text-slate-300 border border-white/5 text-[10px]">
                        👔 {team.teamPrincipal}
                      </span>
                    </div>

                    {/* Drivers Lineup */}
                    <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
                      <span className="text-[10px]">ドライバー:</span>
                      {team.drivers.map((d) => (
                        <span
                          key={d}
                          className="px-2 py-0.5 rounded-md bg-slate-800/90 text-white font-bold border border-white/10 text-[10px]"
                        >
                          🏎️ {d}
                        </span>
                      ))}
                    </div>

                    {/* Engineering & Philosophy Highlights */}
                    <div className="space-y-1 bg-slate-950/60 p-2.5 rounded-xl border border-white/5 text-[11px]">
                      <div className="flex items-start gap-1.5 text-slate-300">
                        <span className="text-sky-400 shrink-0 font-bold">🌪️ 空力:</span>
                        <span className="text-slate-200 line-clamp-1">{team.philosophy.aeroFocus}</span>
                      </div>
                      <div className="flex items-start gap-1.5 text-slate-300">
                        <span className="text-amber-400 shrink-0 font-bold">⚙️ 車体:</span>
                        <span className="text-slate-200 line-clamp-1">{team.philosophy.mechanicalFocus}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[11px] font-mono text-slate-400">
                    <span className="text-[10px] text-slate-500 whitespace-nowrap">
                      📚 一次出典: {team.references.length}件
                    </span>
                    <span className="text-sky-400 group-hover:underline flex items-center gap-1 font-bold text-xs whitespace-nowrap shrink-0">
                      <span>詳細スペック・歴史を見る</span>
                      <span className="transition-transform group-hover:translate-x-0.5">➔</span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          </div>
        )
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
        <div className="flex flex-col gap-3 animate-fade-in">
          {/* Sleek Action Header */}
          <div className="glass-card-premium px-3.5 py-2.5 rounded-xl flex items-center justify-between gap-2.5 border border-white/10 shadow-sm">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="text-sm sm:text-base font-racing font-bold text-white tracking-wide flex items-center gap-2">
                <span>⏱️</span>
                <span>F1作戦司令室 ＆ レース戦略公理</span>
              </h2>
              <span className="text-[10px] font-mono text-slate-400 hidden md:inline">
                アンダーカット・SC戦略の数理・生無線ログ・実走テレメトリー再現
              </span>
            </div>
            {searchQuery && (
              <div className="flex items-center gap-2 bg-slate-900/80 px-2.5 py-1 rounded-lg border border-white/10 shrink-0 text-xs">
                <span className="text-slate-400">&quot;{searchQuery}&quot;</span>
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="text-sky-400 hover:text-white ml-1 cursor-pointer"
                >
                  ✕
                </button>
              </div>
            )}
          </div>

          {/* Interactive Pitwall Strategy Simulator */}
          <div className="space-y-2">
            <div className="flex items-center justify-between pb-1 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="text-base">⏱️</span>
                <h3 className="font-racing font-bold text-sm text-white tracking-wider uppercase">
                  VIRTUAL PITWALL WAR ROOM / インタラクティブ作戦シミュレーター
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-sky-950 text-sky-300 border border-sky-500/30">
                理論実践ビジュアル
              </span>
            </div>
            <VirtualPitwallWarRoom />
          </div>

          <div className="flex items-center gap-2 pt-2 border-b border-white/10 pb-1.5">
            <span className="text-base">📚</span>
            <h3 className="font-racing font-bold text-sm text-white tracking-wider uppercase">
              STRATEGY CONCEPTS & ARCHIVE / レース戦略公理・重要原則
            </h3>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5 sm:gap-4 items-stretch">
            {KNOWLEDGE_STRATEGIES.filter(
              (s) =>
                s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                s.description.toLowerCase().includes(searchQuery.toLowerCase())
            ).map((strat) => (
              <div
                key={strat.id}
                className="glass-card-premium p-4 sm:p-5 rounded-2xl flex flex-col justify-between gap-3.5 shadow-xl h-full border border-white/10"
              >
                <div className="flex flex-col gap-3">
                  <div>
                    <span className="text-[10px] font-racing font-bold text-sky-400 uppercase tracking-widest bg-sky-950/60 px-2 py-0.5 rounded-full border border-sky-500/30">
                      {strat.category}
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-white leading-tight mt-1.5">
                      {strat.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">{strat.subtitle}</p>
                  </div>

                  <p className="text-xs text-slate-200 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-white/5">
                    {renderTextWithCitations(strat.description, strat.id)}
                  </p>

                  {/* Key Takeaways */}
                  <div>
                    <h4 className="text-[10px] font-racing font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                      📌 戦略シミュレーションの重要公理
                    </h4>
                    <ul className="grid grid-cols-1 gap-1.5 text-xs">
                      {strat.keyTakeaways.map((takeaway, idx) => (
                        <li
                          key={idx}
                          className="bg-slate-900/80 p-2 rounded-lg border border-white/5 text-[11px] text-slate-300 flex items-start gap-2"
                        >
                          <span className="text-sky-400 font-bold">•</span>
                          <span>{takeaway}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Embedded Key Team Radio Logs */}
                  {strat.keyRadios && strat.keyRadios.length > 0 && (
                    <div className="space-y-1.5 pt-2 border-t border-white/10">
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

                  {/* Hero Telemetry Banner CTA */}
                  {strat.telemetrySession && onNavigateToTelemetry && (
                    <div className="mt-1 bg-gradient-to-r from-sky-950/70 via-slate-900/90 to-indigo-950/70 border border-sky-500/40 rounded-xl p-3 flex flex-col sm:flex-row items-center justify-between gap-2.5 shadow-md">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-base shrink-0">
                          📊
                        </div>
                        <div>
                          <div className="text-[10px] font-racing font-bold text-sky-300 uppercase tracking-wider">
                            実走テレメトリー再現解析
                          </div>
                          <div className="text-xs text-slate-200 font-mono">
                            {strat.telemetrySession.year} {strat.telemetrySession.meetingName} • Lap {strat.telemetrySession.targetLap} • #{strat.telemetrySession.targetDriver}
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => onNavigateToTelemetry(strat.telemetrySession)}
                        className="btn-console-primary text-xs py-1.5 px-3.5 font-bold flex items-center gap-1.5 shadow-sm shrink-0 cursor-pointer"
                      >
                        <span>実走データを解析</span>
                        <span>➔</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* References Box */}
                {renderReferencesBox(strat.references, strat.id)}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Sub-Tab 5: HISTORY ARCHIVE ── */}
      {activeSubTab === 'history' && (
        <div className="flex flex-col gap-3 animate-fade-in">
          {/* Sleek Action Header */}
          <div className="glass-card-premium px-3.5 py-2.5 rounded-xl flex items-center justify-between gap-2.5 border border-white/10 shadow-sm">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="text-sm sm:text-base font-racing font-bold text-white tracking-wide flex items-center gap-2">
                <span>🏛️</span>
                <span>歴史アーカイブ ＆ 伝説の名勝負録</span>
              </h2>
              <span className="text-[10px] font-mono text-slate-400 hidden md:inline">
                生チーム無線ログ（🎙️）と実走テレメトリー連携付き名勝負
              </span>
            </div>
            {searchQuery && (
              <div className="flex items-center gap-2 bg-slate-900/80 px-2.5 py-1 rounded-lg border border-white/10 shrink-0 text-xs">
                <span className="text-slate-400">&quot;{searchQuery}&quot;</span>
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="text-sky-400 hover:text-white ml-1 cursor-pointer"
                >
                  ✕
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5 sm:gap-4 items-stretch">
            {KNOWLEDGE_HISTORY.filter(
              (h) =>
                h.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                h.grandPrix.toLowerCase().includes(searchQuery.toLowerCase())
            ).map((item) => (
              <div
                key={item.id}
                className="glass-card-premium p-4 sm:p-5 rounded-2xl flex flex-col justify-between gap-3.5 shadow-xl h-full border border-white/10"
              >
                <div className="flex flex-col gap-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold">
                          {item.year}
                        </span>
                        <span className="text-xs font-mono text-slate-400">
                          {item.grandPrix}
                        </span>
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-white leading-tight mt-1.5">
                        {item.title}
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">{item.subtitle}</p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-200 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-white/5">
                    {renderTextWithCitations(item.strategicNarrative, item.id)}
                  </p>

                  <div className="bg-slate-900/80 p-2.5 rounded-xl border border-amber-500/20 text-xs flex items-center gap-2">
                    <span className="text-amber-400 text-sm">🏆</span>
                    <span className="text-slate-200 font-medium text-[11px]">
                      {item.outcome}
                    </span>
                  </div>

                  {/* Embedded Key Team Radio Logs */}
                  {item.keyRadios && item.keyRadios.length > 0 && (
                    <div className="space-y-1.5 pt-2 border-t border-white/10">
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

                  {/* Hero Telemetry Banner */}
                  {item.telemetrySession && onNavigateToTelemetry && (
                    <div className="mt-1 bg-gradient-to-r from-amber-950/60 via-slate-900/90 to-rose-950/60 border border-amber-500/40 rounded-xl p-3 flex flex-col sm:flex-row items-center justify-between gap-2.5 shadow-md">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-base shrink-0">
                          🏁
                        </div>
                        <div>
                          <div className="text-[10px] font-racing font-bold text-amber-300 uppercase tracking-wider">
                            {item.year} {item.grandPrix} 実走テレメトリー再現
                          </div>
                          <div className="text-xs text-slate-200 font-mono">
                            Lap {item.telemetrySession.targetLap} • Driver #{item.telemetrySession.targetDriver} 走行データを検証
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => onNavigateToTelemetry(item.telemetrySession)}
                        className="btn-console text-xs py-1.5 px-3.5 text-amber-300 border-amber-500/40 hover:border-amber-400 hover:bg-amber-500/20 font-bold flex items-center gap-1.5 shadow-sm shrink-0 cursor-pointer"
                      >
                        <span>テレメトリーを追体験</span>
                        <span>➔</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* References Box */}
                {renderReferencesBox(item.references, item.id)}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
