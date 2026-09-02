'use client';

/**
 * components/hubs/KnowledgeHistoryHub.tsx
 * Hub 3: F1 Knowledge & History with 5 Sub-Tabs, Compact Grid & Modal View for Drivers,
 * Academic In-Text Citations ([1]), Key Team Radio Embeds, and Deep Telemetry Session Navigation.
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  KNOWLEDGE_TEAMS,
  KNOWLEDGE_DRIVERS,
  KNOWLEDGE_CIRCUITS,
  KNOWLEDGE_STRATEGIES,
  KNOWLEDGE_HISTORY,
  type Reference,
  type TeamProfile,
  type DriverProfile,
  type CircuitProfile,
  type StrategyConcept,
  type HistoryArchive,
  type EmbeddedRadio,
  type TelemetryTarget,
} from '@/data/f1KnowledgeData';
import { getProxiedAudioUrl } from '@/lib/telemetryUtils';
import DriverDetailModal from './DriverDetailModal';

type SubTab = 'teams' | 'drivers' | 'circuits' | 'strategy' | 'history';
type DriverStatusFilter = 'ALL' | 'Current' | 'Legend';

interface KnowledgeHistoryHubProps {
  onNavigateToTelemetry?: (target?: TelemetryTarget) => void;
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

export default function KnowledgeHistoryHub({ onNavigateToTelemetry }: KnowledgeHistoryHubProps) {
  const [activeSubTab, setActiveSubTab] = useState<SubTab>('teams');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [driverStatusFilter, setDriverStatusFilter] = useState<DriverStatusFilter>('ALL');
  const [driverTeamFilter, setDriverTeamFilter] = useState<string>('ALL');
  const [selectedDriverDetail, setSelectedDriverDetail] = useState<DriverProfile | null>(null);
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

  // Filtered drivers logic
  const filteredDrivers = KNOWLEDGE_DRIVERS.filter((d) => {
    const matchesSearch =
      d.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.team.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.driverType.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = driverStatusFilter === 'ALL' || d.status === driverStatusFilter;
    const matchesTeam = driverTeamFilter === 'ALL' || d.team.toLowerCase().includes(driverTeamFilter.toLowerCase());

    return matchesSearch && matchesStatus && matchesTeam;
  });

  return (
    <div className="flex flex-col gap-5 max-w-6xl mx-auto animate-fade-in">
      {/* Header Banner */}
      <div className="glass-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden">
        <div className="flex flex-col gap-1 z-10">
          <div className="flex items-center gap-2">
            <span className="text-xs font-racing font-bold text-sky-400 uppercase tracking-widest">
              ACADEMIC CITATIONS & DEEP TELEMETRY LINKING
            </span>
          </div>
          <h2 className="text-xl font-racing font-black text-white tracking-wider">
            F1 KNOWLEDGE & HISTORICAL ARCHIVES
          </h2>
          <p className="text-xs text-slate-400 max-w-xl">
            FIA公式規則、全10チーム工学哲学、ドライバー詳細名鑑、サーキットデータ、伝説の名勝負を生無線ログ（🎙️）と実テレメトリー連携付きで体系化。
          </p>
        </div>

        {/* Search Bar */}
        <div className="z-10 w-full md:w-64">
          <input
            type="text"
            placeholder="ナレッジ内を検索..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900/80 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-400 transition-colors"
          />
        </div>
      </div>

      {/* 5 Main Sub-Tabs Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 bg-slate-950/60 p-1.5 rounded-2xl border border-white/10 shadow-inner">
        {(
          [
            ['teams', '🏎️ チーム紹介 (全10チーム)'],
            ['drivers', '👤 ドライバー名鑑 (詳細ビュー)'],
            ['circuits', '🏁 サーキット解説'],
            ['strategy', '🛞 戦略 & 規則'],
            ['history', '🏛️ 歴史アーカイブ'],
          ] as [SubTab, string][]
        ).map(([tab, label]) => (
          <button
            key={tab}
            onClick={() => {
              setActiveSubTab(tab);
              setSearchQuery('');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-racing font-bold transition-all flex-shrink-0 flex items-center gap-1.5 ${
              activeSubTab === tab
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── Sub-Tab 1: TEAMS ── */}
      {activeSubTab === 'teams' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
          {KNOWLEDGE_TEAMS.filter(
            (t) =>
              t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              t.philosophy.description.toLowerCase().includes(searchQuery.toLowerCase())
          ).map((team) => (
            <div
              key={team.id}
              className="glass-card p-5 flex flex-col justify-between gap-4 border-l-4"
              style={{ borderLeftColor: team.color }}
            >
              <div className="flex flex-col gap-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                      {team.base}
                    </span>
                    <h3 className="text-base font-bold text-white leading-tight">
                      {team.fullName}
                    </h3>
                    <span className="text-xs text-slate-400 font-mono">
                      代表: {team.teamPrincipal} • PU: {team.powerUnit}
                    </span>
                  </div>
                  <div className="bg-slate-900/90 px-2.5 py-1 rounded-xl border border-white/10 text-right">
                    <span className="text-xs font-bold text-amber-400 font-mono">
                      🏆 {team.constructorTitles}回
                    </span>
                    <span className="block text-[9px] text-slate-500">タイトル</span>
                  </div>
                </div>

                {/* Engineering Philosophy */}
                <div className="bg-slate-950/60 p-3.5 rounded-xl border border-white/5 space-y-2 text-xs">
                  <h4 className="text-[10px] font-racing font-bold text-sky-400 uppercase tracking-wider">
                    🛠️ 開発思想・エンジニアリング特性
                  </h4>
                  <p className="text-slate-200 leading-relaxed text-[11px]">
                    {renderTextWithCitations(team.philosophy.description, team.id)}
                  </p>
                  <div className="pt-2 border-t border-white/5 space-y-1 text-[11px] text-slate-400">
                    <div>
                      <strong className="text-slate-300 font-mono">空力焦点:</strong>{' '}
                      {team.philosophy.aeroFocus}
                    </div>
                    <div>
                      <strong className="text-slate-300 font-mono">サスペンション:</strong>{' '}
                      {team.philosophy.mechanicalFocus}
                    </div>
                  </div>
                </div>
              </div>

              {/* References Box */}
              {renderReferencesBox(team.references, team.id)}
            </div>
          ))}
        </div>
      )}

      {/* ── Sub-Tab 2: DRIVERS (Compact Grid + Detail Modal) ── */}
      {activeSubTab === 'drivers' && (
        <div className="flex flex-col gap-4 animate-fade-in">
          {/* Driver Filters Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950/60 p-3 rounded-2xl border border-white/10">
            {/* Status Filter Tabs */}
            <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-white/5">
              {(
                [
                  ['ALL', '全選手'],
                  ['Current', '🏁 現役グリッド'],
                  ['Legend', '👑 歴代レジェンド'],
                ] as [DriverStatusFilter, string][]
              ).map(([status, label]) => (
                <button
                  key={status}
                  onClick={() => setDriverStatusFilter(status)}
                  className={`px-3 py-1 rounded-lg text-xs font-racing font-bold transition-all ${
                    driverStatusFilter === status
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Team Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-0.5 text-xs">
              <span className="text-[10px] text-slate-500 font-mono mr-1">TEAM:</span>
              {['ALL', 'Red Bull', 'Ferrari', 'McLaren', 'Mercedes', 'Aston Martin', 'RB'].map((t) => (
                <button
                  key={t}
                  onClick={() => setDriverTeamFilter(t)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition-all flex-shrink-0 ${
                    driverTeamFilter === t
                      ? 'bg-slate-700 text-sky-400 font-bold border border-sky-400/40'
                      : 'bg-slate-900/60 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Compact Driver Grid Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filteredDrivers.map((driver) => (
              <div
                key={driver.id}
                onClick={() => setSelectedDriverDetail(driver)}
                className="glass-card p-4 flex flex-col justify-between gap-3 border-l-4 cursor-pointer hover:border-sky-400 hover:bg-slate-900/90 transition-all hover:scale-[1.02] shadow-md group relative overflow-hidden"
                style={{ borderLeftColor: driver.teamColor }}
              >
                <div className="space-y-2">
                  {/* Card Top: Number, Code, Country, Title Badge */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className="text-xs font-racing font-black px-2 py-0.5 rounded-lg border"
                        style={{
                          color: driver.teamColor,
                          borderColor: `${driver.teamColor}60`,
                          backgroundColor: `${driver.teamColor}15`,
                        }}
                      >
                        #{driver.number} {driver.code}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">{driver.country}</span>
                    </div>

                    {driver.status === 'Legend' ? (
                      <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full text-[10px] font-bold font-mono flex items-center gap-1 shadow-sm">
                        <span>👑</span>
                        <span>殿堂入り ({driver.championships}冠)</span>
                      </span>
                    ) : driver.championships > 0 ? (
                      <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full text-[10px] font-bold font-mono flex items-center gap-1">
                        <span>🏆</span>
                        <span>{driver.championships}冠</span>
                      </span>
                    ) : null}
                  </div>

                  {/* Driver Name & Team */}
                  <div>
                    <h3 className="text-base font-bold text-white leading-tight group-hover:text-sky-300 transition-colors flex items-center gap-1.5">
                      <span>{driver.fullName}</span>
                      {driver.status === 'Legend' && <span className="text-amber-400 text-xs">👑</span>}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">{driver.team}</p>
                  </div>


                  {/* Driver Type Tag */}
                  <div className="bg-slate-950/60 px-2.5 py-1 rounded-lg border border-white/5 text-[11px] text-sky-200/90 truncate">
                    🏷️ {driver.driverType}
                  </div>
                </div>

                {/* Card Bottom: Quick Stats Bar & Action Indicator */}
                <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <div className="flex items-center gap-3">
                    <span>
                      勝: <strong className="text-amber-400">{driver.wins}</strong>
                    </span>
                    <span>
                      登壇: <strong className="text-sky-400">{driver.podiums}</strong>
                    </span>
                    <span>
                      PP: <strong className="text-purple-400">{driver.polePositions}</strong>
                    </span>
                  </div>

                  <span className="text-sky-400 group-hover:translate-x-1 transition-transform font-bold text-xs flex items-center gap-0.5">
                    <span>詳細</span>
                    <span>➔</span>
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Driver Detail Modal */}
          {selectedDriverDetail && (
            <DriverDetailModal
              driver={selectedDriverDetail}
              allDrivers={filteredDrivers}
              onSelectDriver={(d) => setSelectedDriverDetail(d)}
              onClose={() => setSelectedDriverDetail(null)}
            />
          )}
        </div>
      )}

      {/* ── Sub-Tab 3: CIRCUITS ── */}
      {activeSubTab === 'circuits' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
          {KNOWLEDGE_CIRCUITS.filter(
            (c) =>
              c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              c.country.toLowerCase().includes(searchQuery.toLowerCase())
          ).map((circuit) => (
            <div
              key={circuit.id}
              className="glass-card p-5 flex flex-col justify-between gap-4"
            >
              <div className="flex flex-col gap-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                      {circuit.country}
                    </span>
                    <h3 className="text-base font-bold text-white leading-tight">
                      {circuit.name}
                    </h3>
                    <span className="text-xs text-slate-400 font-mono">
                      {circuit.officialName}
                    </span>
                  </div>
                  <div className="bg-slate-900/80 px-2.5 py-1 rounded-xl border border-white/10 text-right">
                    <span className="text-xs font-bold text-sky-400 font-mono">
                      {circuit.lengthKm} km
                    </span>
                    <span className="block text-[9px] text-slate-500">
                      {circuit.turns}コーナー / DRS {circuit.drsZones}本
                    </span>
                  </div>
                </div>

                {/* Circuit Metrics Grid */}
                <div className="grid grid-cols-3 gap-2 bg-slate-950/60 p-2.5 rounded-xl border border-white/5 text-center text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 block">DF要求</span>
                    <strong className="text-slate-200 font-mono">{circuit.downforceLevel}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">タイヤ負荷</span>
                    <strong className="text-amber-400 font-mono">{circuit.tyreStress}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">想定ピットロス</span>
                    <strong className="text-sky-400 font-mono">{circuit.typicalPitLossSec}s</strong>
                  </div>
                </div>

                {/* Characteristics */}
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/40 p-3 rounded-xl border border-white/5">
                  {renderTextWithCitations(circuit.characteristics, circuit.id)}
                </p>

                {/* Lap Record & Deep Telemetry Link Button */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs pt-2 border-t border-white/5">
                  <span className="text-[11px] text-slate-400">
                    ⏱️ コースレコード: <strong className="text-white font-mono">{circuit.lapRecord.time}</strong> ({circuit.lapRecord.driver})
                  </span>

                  {circuit.telemetrySession && onNavigateToTelemetry && (
                    <button
                      onClick={() => onNavigateToTelemetry(circuit.telemetrySession)}
                      className="px-3 py-1.5 bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-500 hover:to-sky-500 text-white rounded-xl text-xs font-racing font-bold flex items-center gap-1.5 shadow-md transition-all self-start sm:self-auto active:scale-95"
                    >
                      <span>📊</span>
                      <span>テレメトリーで実データを確認</span>
                      <span>➔</span>
                    </button>
                  )}
                </div>
              </div>

              {/* References Box */}
              {renderReferencesBox(circuit.references, circuit.id)}
            </div>
          ))}
        </div>
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
