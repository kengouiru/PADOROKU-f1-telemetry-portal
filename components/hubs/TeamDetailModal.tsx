'use client';

/**
 * components/hubs/TeamDetailModal.tsx
 * Comprehensive Detailed Modal for F1 Constructors/Teams.
 * Enhanced in Step 2 with:
 * - 🌿 チーム系統樹 & 系譜 (Full historical lineage tree from origin to current era)
 * - 📐 2026マシン諸元 & PU工学スペック (Chassis code, 350kW MGU-K, Active Aero Z/X mode, Weight 768kg)
 * - 🏆 歴代変遷 (2016-2026) ＆ リザーブ枠 (Season-by-season table linking to DriverDetailModal)
 * - 📊 チーム内テレメトリー直接比較 (Deep telemetry launch comparing Driver 1 vs Driver 2)
 * - 🏭 ファクトリー & 組織体系
 * - 📚 一次出典・公式技術リリース
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import type { TeamProfile, Reference, TelemetryTarget } from '@/data/f1KnowledgeData';
import { getTeamLineage, getTeamCarSpecs, type TeamLineageRecord, type CarTechnicalSpecs } from '@/data/f1TeamLineageData';
import { HISTORICAL_SEASONS_DATA, type HistoricalGridTeam, type HistoricalGridDriver } from '@/data/f1HistoricalGrids';
import PhotoGalleryCarousel from '@/components/ui/PhotoGalleryCarousel';
import { useUserPreferences } from '@/lib/userPreferences';
import SmartWikiText from '@/components/common/SmartWikiText';

export interface TeamDetailModalProps {
  team: TeamProfile;
  allTeams: TeamProfile[];
  onSelectTeam: (team: TeamProfile) => void;
  onSelectDriverDetail?: (driverCode: string) => void;
  onNavigateToTelemetry?: (target?: TelemetryTarget) => void;
  onClose: () => void;
}

type TeamTab = 'lineage' | 'engineering' | 'history' | 'factory' | 'references';

const HISTORICAL_TEAM_ID_MAP: Record<string, string[]> = {
  mercedes: ['mercedes'],
  'red-bull': ['red-bull'],
  ferrari: ['ferrari'],
  mclaren: ['mclaren'],
  'aston-martin': ['aston-martin', 'racing-point', 'force-india'],
  alpine: ['alpine', 'renault'],
  williams: ['williams'],
  rb: ['rb', 'alphatauri', 'toro-rosso'],
  audi: ['audi', 'sauber', 'alfa-romeo'],
  haas: ['haas'],
  cadillac: ['cadillac'],
};

export default function TeamDetailModal({
  team,
  allTeams,
  onSelectTeam,
  onSelectDriverDetail,
  onNavigateToTelemetry,
  onClose,
}: TeamDetailModalProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  const { isFavoriteTeam, toggleTeam } = useUserPreferences();
  const [activeTab, setActiveTab] = useState<TeamTab>('lineage');
  const [highlightedRef, setHighlightedRef] = useState<string | null>(null);
  const modalContentRef = useRef<HTMLDivElement>(null);

  const themeColor = team.color || '#38bdf8';
  const lineageRecord = useMemo(() => getTeamLineage(team.id), [team.id]);
  const carSpecs = useMemo(() => getTeamCarSpecs(team.id), [team.id]);

  // Find currentIndex for Prev / Next navigation
  const currentIndex = allTeams.findIndex((t) => t.id === team.id);
  const prevTeam = currentIndex > 0 ? allTeams[currentIndex - 1] : allTeams[allTeams.length - 1];
  const nextTeam = currentIndex < allTeams.length - 1 ? allTeams[currentIndex + 1] : allTeams[0];

  // 2016-2026 Historical Seasons for this team
  const matchingSeasons = useMemo(() => {
    const targetIds = HISTORICAL_TEAM_ID_MAP[team.id] || [team.id];
    const seasons: { year: number; teamData: HistoricalGridTeam; eraName: string }[] = [];
    const years = [2026, 2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016];
    years.forEach((yr) => {
      const s = HISTORICAL_SEASONS_DATA[yr];
      if (s) {
        const t = s.teams.find((tm) => targetIds.includes(tm.teamId));
        if (t) {
          seasons.push({ year: yr, teamData: t, eraName: s.eraName });
        }
      }
    });
    return seasons;
  }, [team.id]);

  // Keyboard navigation: Left/Right arrow keys for prev/next, Escape to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && prevTeam) onSelectTeam(prevTeam);
      if (e.key === 'ArrowRight' && nextTeam) onSelectTeam(nextTeam);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [prevTeam, nextTeam, onClose, onSelectTeam]);

  // Jump to Reference & highlight
  const handleCitationClick = (refId: number) => {
    setActiveTab('references');
    setTimeout(() => {
      const targetElementId = `team-ref-${team.id}-${refId}`;
      const el = document.getElementById(targetElementId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setHighlightedRef(targetElementId);
        setTimeout(() => setHighlightedRef(null), 3000);
      }
    }, 100);
  };

  // Helper to parse "[1]", "[2]" into clickable citation badges
  const renderTextWithCitations = (text: string) => {
    const parts = text.split(/(\[\d+\])/g);
    return parts.map((part, idx) => {
      const match = part.match(/\[(\d+)\]/);
      if (match) {
        const refId = parseInt(match[1], 10);
        return (
          <button
            key={idx}
            onClick={() => handleCitationClick(refId)}
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

  if (!mounted) return null;

  return (
    <div className="w-full max-w-[1800px] mx-auto animate-fade-in pb-16">
      {/* ── Solid Flush Sticky Top Navigation Bar: Compact Single-Row, Opaque bg-slate-950, Zero Peeking Ghosting ── */}
      <div className="sticky top-0 z-50 bg-slate-950 border-b border-white/15 px-3 sm:px-6 py-2.5 shadow-2xl flex items-center justify-between gap-3 mb-4 rounded-b-2xl">
        {/* Left: Return Button & Breadcrumbs */}
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-racing font-bold text-xs sm:text-sm flex items-center gap-1.5 border border-white/10 transition-all cursor-pointer shadow hover:scale-105 shrink-0"
            title="一覧に戻る (ESC)"
          >
            <span>◀</span>
            <span className="whitespace-nowrap">一覧に戻る</span>
          </button>
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400 font-mono truncate">
            <span>F1 百科事典</span>
            <span>&gt;</span>
            <span>チーム名鑑</span>
            <span>&gt;</span>
            <span className="text-white font-bold truncate">{team.name}</span>
          </div>
        </div>

        {/* Right: Prev / Next Switcher & Compact Action Buttons (Single Row) */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Quick Prev / Next Switcher */}
          <div className="flex items-center bg-slate-900 border border-white/10 rounded-xl p-0.5">
            <button
              onClick={() => prevTeam && onSelectTeam(prevTeam)}
              className="px-2 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-racing flex items-center gap-1 transition-all cursor-pointer border border-white/5"
              title="前のチーム (←キー)"
            >
              <span>◀</span>
              <span className="font-mono font-bold truncate max-w-[80px] sm:max-w-none">{prevTeam?.name}</span>
            </button>
            <div className="w-px h-3.5 bg-white/15" />
            <button
              onClick={() => nextTeam && onSelectTeam(nextTeam)}
              className="px-2 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-racing flex items-center gap-1 transition-all cursor-pointer border border-white/5"
              title="次のチーム (→キー)"
            >
              <span className="font-mono font-bold truncate max-w-[80px] sm:max-w-none">{nextTeam?.name}</span>
              <span>▶</span>
            </button>
          </div>

          {/* Popout Separate Window Button */}
          <button
            type="button"
            onClick={() => {
              window.open(`/knowledge/teams/${team.id}`, '_blank', 'width=1280,height=900,menubar=no,toolbar=no');
            }}
            className="px-2.5 py-1 rounded-xl bg-sky-950/80 hover:bg-sky-900 border border-sky-500/40 text-sky-300 hover:text-white text-xs font-racing flex items-center gap-1 transition-all cursor-pointer shadow-sm hover:scale-105"
            title="このチームを別ウィンドウで開く"
          >
            <span>別ウィンドウで開く</span>
            <span>↗</span>
          </button>

          {/* Quick Telemetry Compare Action Button */}
          {onNavigateToTelemetry && team.drivers.length >= 2 && (
            <button
              onClick={() => {
                onNavigateToTelemetry({
                  year: 2026,
                  targetDriver: team.drivers[0],
                  targetDriver2: team.drivers[1],
                });
                onClose();
              }}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-racing font-bold bg-blue-600/90 hover:bg-blue-500 text-white shadow-sm border border-blue-400/40 transition-all hover:scale-105 cursor-pointer"
              title={`${team.drivers[0]} と ${team.drivers[1]} のテレメトリー直接比較画面を開く`}
            >
              <span>📊</span>
              <span className="hidden md:inline">テレメトリー比較</span>
            </button>
          )}

          {/* Star Favorite Button */}
          <button
            onClick={() => toggleTeam(team.id)}
            className={`px-2.5 py-1 rounded-xl text-xs font-racing flex items-center gap-1 transition-all cursor-pointer shadow-sm border ${
              isFavoriteTeam(team.id)
                ? 'bg-amber-400/25 border-amber-400/70 text-amber-300 hover:bg-amber-400/35'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-amber-300 border-white/10'
            }`}
            title={isFavoriteTeam(team.id) ? '推しチームから外す' : '推しチーム (マイパドック) に登録'}
          >
            <span>{isFavoriteTeam(team.id) ? '★' : '☆'}</span>
            <span className="hidden md:inline">
              {isFavoriteTeam(team.id) ? '推し' : '推し登録'}
            </span>
          </button>

          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center text-xs font-bold transition-all cursor-pointer border border-white/10 shrink-0"
            title="一覧へ戻る (ESC)"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Main Full-Width Team Card */}
      <div
        ref={modalContentRef}
        className="glass-card bg-slate-950/95 border border-white/15 w-full flex flex-col rounded-3xl shadow-2xl overflow-hidden relative"
        style={{ borderTopColor: themeColor, borderTopWidth: 4 }}
      >
        {/* Container: Wraps Hero Header, Sticky Sub-Tabs & Content */}
        <div className="flex flex-col">
          {/* Team Hero Header */}
          <div className="p-3.5 sm:p-6 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 bg-gradient-to-b from-slate-900/60 to-transparent flex-shrink-0">
            <div className="flex items-start sm:items-center gap-3 sm:gap-4">
              <div
                className="w-14 h-14 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl flex flex-col items-center justify-center font-racing font-black border shadow-xl flex-shrink-0"
                style={{
                  color: themeColor,
                  borderColor: `${themeColor}80`,
                  backgroundColor: `${themeColor}15`,
                }}
              >
                <span className="text-xl sm:text-3xl font-black">{team.name.slice(0, 3).toUpperCase()}</span>
              </div>

              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                  <span className="text-[11px] sm:text-xs text-slate-400 font-mono">{team.base}</span>
                  <span className="bg-slate-800/90 text-slate-300 px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold font-mono border border-white/10">
                    ⚡ {team.powerUnit}
                  </span>
                  <span className="bg-blue-950/60 text-sky-300 px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-mono border border-sky-500/30">
                    代表: {team.teamPrincipal}
                  </span>
                  {lineageRecord && (
                    <span className="bg-emerald-950/60 text-emerald-300 px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-mono border border-emerald-500/30">
                      ルーツ: {lineageRecord.originYear}年〜
                    </span>
                  )}
                </div>

                <h2 className="text-lg sm:text-2xl font-black text-white leading-tight truncate">
                  {team.fullName}
                </h2>

                <div className="flex items-center gap-1.5 pt-0.5 flex-wrap">
                  <span className="text-[10px] sm:text-[11px] text-slate-400 font-mono">2026 DRIVERS:</span>
                  {team.drivers.map((d) => (
                    <button
                      key={d}
                      onClick={() => onSelectDriverDetail && onSelectDriverDetail(d)}
                      className="px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-mono font-bold border transition-all hover:scale-105 cursor-pointer"
                      style={{
                        color: themeColor,
                        borderColor: `${themeColor}50`,
                        backgroundColor: `${themeColor}12`,
                      }}
                      title={`${d} のドライバー詳細を開く`}
                    >
                      {d} ➔
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Constructor Titles Banner */}
            {team.constructorTitles > 0 ? (
              <div className="rounded-xl sm:rounded-2xl p-2.5 sm:p-3 px-3.5 sm:px-4 flex items-center gap-2.5 sm:gap-3 self-start sm:self-auto flex-shrink-0 border shadow-md bg-amber-500/10 border-amber-500/30">
                <span className="text-2xl sm:text-3xl">🏆</span>
                <div>
                  <span className="text-[10px] sm:text-xs font-racing font-bold uppercase tracking-widest text-amber-400 block">
                    CONSTRUCTOR CHAMPION
                  </span>
                  <span className="text-xs sm:text-base font-black text-white font-mono">
                    {team.constructorTitles}回 制覇
                  </span>
                </div>
              </div>
            ) : (
              <div className="rounded-xl sm:rounded-2xl p-2.5 sm:p-3 px-3.5 sm:px-4 flex items-center gap-2 self-start sm:self-auto flex-shrink-0 bg-slate-900/60 border border-white/10 text-[11px] sm:text-xs text-slate-400 font-mono">
                <span>🏁</span>
                <span>コンストラクターズ参戦中</span>
              </div>
            )}
          </div>

          {/* Modal Sub-Tabs (Sticky when scrolling) */}
          <div className="sticky top-0 z-20 flex items-center gap-2 px-3.5 sm:px-6 pt-2 sm:pt-2.5 border-b border-white/10 bg-slate-950/95 backdrop-blur-md overflow-x-auto flex-shrink-0 shadow-sm">
            {(
              [
                ['lineage', '🌿 チーム系統樹 & 系譜'],
                ['engineering', '📐 2026マシン諸元 & 空力哲学'],
                ['history', '🏆 歴代変遷 (2016-2026) & 名車'],
                ['factory', '🏭 ファクトリー & 組織体系'],
                ['references', `📚 参考文献 (${team.references.length})`],
              ] as [TeamTab, string][]
            ).map(([tab, label]) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-2 px-2.5 sm:px-3 text-xs font-racing font-bold transition-all border-b-2 flex-shrink-0 cursor-pointer ${
                  activeTab === tab
                    ? 'text-sky-400 border-sky-400 font-black'
                    : 'text-slate-400 border-transparent hover:text-slate-200'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Tab Content Body */}
          <div className="p-3.5 sm:p-6 flex-1 space-y-4 sm:space-y-5">
            {/* ── TAB 1: TEAM LINEAGE (系統樹 & 歴史的ルーツ) ── */}
            {activeTab === 'lineage' && (
              <div className="space-y-5 animate-fade-in">
                {lineageRecord ? (
                  <>
                    {/* Lineage Summary Banner */}
                    <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">🌿</span>
                          <h3 className="text-sm font-racing font-bold text-white tracking-wide">
                            {lineageRecord.currentName} — 歴史的ルーツと継承
                          </h3>
                        </div>
                        <p className="text-xs text-slate-300">
                          創始者: <strong className="text-white">{lineageRecord.founder}</strong> • 起源: <strong className="text-white">{lineageRecord.originYear}年</strong> • 本拠地: <span className="font-mono text-slate-300">{lineageRecord.headquarters}</span>
                        </p>
                      </div>

                      <div className="flex items-center gap-3 bg-slate-950/60 px-3.5 py-2 rounded-xl border border-white/10 shrink-0">
                        <div className="text-center">
                          <span className="text-[10px] text-amber-400 font-racing font-bold block">WCC王座</span>
                          <span className="text-base font-black text-white font-mono">{lineageRecord.allTimeTitles.constructors}回</span>
                        </div>
                        <div className="w-px h-6 bg-white/10" />
                        <div className="text-center">
                          <span className="text-[10px] text-yellow-400 font-racing font-bold block">WDC王座</span>
                          <span className="text-base font-black text-white font-mono">{lineageRecord.allTimeTitles.drivers}回</span>
                        </div>
                      </div>
                    </div>

                    {/* Timeline Tree Nodes */}
                    <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-sky-400 before:via-blue-500 before:to-emerald-400">
                      {lineageRecord.lineageChain.map((node, idx) => {
                        const isLatest = idx === lineageRecord.lineageChain.length - 1;
                        return (
                          <div key={idx} className="relative group">
                            {/* Node Dot Marker */}
                            <div
                              className={`absolute -left-6 sm:-left-8 top-1.5 w-6 h-6 rounded-full border-2 flex items-center justify-center text-[10px] font-bold shadow-md transition-all group-hover:scale-125 ${
                                isLatest
                                  ? 'bg-sky-500 border-white text-white ring-4 ring-sky-500/20'
                                  : 'bg-slate-900 border-sky-400 text-sky-400'
                              }`}
                            >
                              {idx + 1}
                            </div>

                            {/* Node Card */}
                            <div
                              className={`p-4 rounded-2xl border transition-all ${
                                isLatest
                                  ? 'bg-slate-900/90 border-sky-500/40 shadow-xl'
                                  : 'bg-slate-950/80 border-white/10 hover:border-white/20'
                              }`}
                            >
                              {/* Node Header */}
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 border-b border-white/5 pb-2.5">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="px-2.5 py-0.5 rounded-full text-xs font-racing font-bold bg-sky-950/80 text-sky-300 border border-sky-500/40 font-mono">
                                    {node.period}
                                  </span>
                                  <span className="text-base font-black text-white flex items-center gap-1.5">
                                    <span>{node.flag}</span>
                                    <span>{node.teamName}</span>
                                  </span>
                                  <span className="text-xs text-slate-400 font-mono">({node.fullName})</span>
                                </div>

                                <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                                  <span>📍 {node.base}</span>
                                </div>
                              </div>

                              {/* Node Technical & Personnel Details */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 text-xs">
                                <div className="space-y-1">
                                  <span className="text-[11px] font-racing text-slate-400 flex items-center gap-1">
                                    <span>⚡</span>
                                    <span>パワーユニット / エンジン:</span>
                                  </span>
                                  <div className="flex flex-wrap gap-1">
                                    {node.powerUnits.map((pu, puIdx) => (
                                      <span
                                        key={puIdx}
                                        className="bg-slate-900 text-slate-200 px-2 py-0.5 rounded text-[11px] font-mono border border-white/10"
                                      >
                                        {pu}
                                      </span>
                                    ))}
                                  </div>
                                </div>

                                <div className="space-y-1">
                                  <span className="text-[11px] font-racing text-slate-400 flex items-center gap-1">
                                    <span>👥</span>
                                    <span>主要キーパーソン:</span>
                                  </span>
                                  <p className="text-slate-200 font-sans text-[11px]">
                                    {node.keyPersonnel.join(', ')}
                                  </p>
                                </div>
                              </div>

                              {/* Notable Drivers */}
                              <div className="pt-2.5 space-y-1">
                                <span className="text-[11px] font-racing text-slate-400 flex items-center gap-1">
                                  <span>🏎️</span>
                                  <span>代表的ドライバー:</span>
                                </span>
                                <div className="flex flex-wrap gap-1.5">
                                  {node.notableDrivers.map((drv, drvIdx) => (
                                    <span
                                      key={drvIdx}
                                      className="px-2 py-0.5 rounded-md text-[11px] font-sans font-medium bg-slate-900/90 text-slate-300 border border-white/10"
                                    >
                                      {drv}
                                    </span>
                                  ))}
                                </div>
                              </div>

                              {/* Championships (if any) */}
                              {(node.championships.constructors > 0 || node.championships.drivers > 0) && (
                                <div className="mt-2.5 p-2 px-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-3 text-xs">
                                  <span className="text-amber-400 font-bold">🏆 この時代の王座実績:</span>
                                  <div className="flex items-center gap-3 font-mono font-bold text-amber-300">
                                    {node.championships.constructors > 0 && (
                                      <span>コンストラクターズ: {node.championships.constructors}回</span>
                                    )}
                                    {node.championships.drivers > 0 && (
                                      <span>ドライバーズ: {node.championships.drivers}回</span>
                                    )}
                                  </div>
                                </div>
                              )}

                              {/* Iconic Car Callout */}
                              {node.iconicCar && (
                                <div className="mt-2.5 p-2.5 rounded-xl bg-sky-950/40 border border-sky-500/20 text-xs space-y-0.5">
                                  <div className="font-racing font-bold text-sky-400 flex items-center gap-1.5">
                                    <span>🏎️</span>
                                    <span>象徴的名車: {node.iconicCar.model}</span>
                                  </div>
                                  <p className="text-[11px] text-slate-300 leading-snug">
                                    <SmartWikiText text={node.iconicCar.description} excludeUrl={`/knowledge/teams/${team.id}`} />
                                  </p>
                                </div>
                              )}

                              {/* Historical Summary */}
                              <p className="text-xs text-slate-300 leading-relaxed mt-2.5 pt-2 border-t border-white/5 font-sans">
                                <SmartWikiText text={node.summary} excludeUrl={`/knowledge/teams/${team.id}`} />
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                ) : (
                  <div className="p-6 text-center text-slate-400 bg-slate-900/40 rounded-2xl border border-white/10">
                    系統樹データを準備中です。
                  </div>
                )}
              </div>
            )}

            {/* ── TAB 2: 2026 CAR TECHNICAL SPECS & AERODYNAMICS ── */}
            {activeTab === 'engineering' && (
              <div className="space-y-5 animate-fade-in">
                {/* 2026 Technical Specs Sheet */}
                {carSpecs && (
                  <div className="bg-slate-900/80 border border-white/10 rounded-2xl p-4 sm:p-5 space-y-4 shadow-lg">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                      <div>
                        <span className="text-[10px] font-racing font-bold uppercase tracking-wider text-sky-400 block">
                          2026 FIA REGULATION TECHNICAL DATA SHEET
                        </span>
                        <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                          <span>🏎️</span>
                          <span>{carSpecs.chassisCode} — シャシー ＆ パワーユニット工学諸元</span>
                        </h3>
                      </div>
                      <span className="text-xs font-mono px-2.5 py-1 rounded-lg bg-emerald-950/60 text-emerald-300 border border-emerald-500/30 self-start sm:self-auto">
                        350kW MGU-K 新規定対応
                      </span>
                    </div>

                    {/* 6-Grid Technical Specs */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      <div className="p-3 rounded-xl bg-slate-950/70 border border-white/10 space-y-1">
                        <span className="text-[10px] font-racing text-slate-400 block">⚡ POWER UNIT 型式</span>
                        <span className="text-xs font-bold text-white font-mono block leading-tight">{carSpecs.powerUnitName}</span>
                        <span className="text-[10px] text-slate-400 font-sans block">{carSpecs.iceSpecs}</span>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-950/70 border border-white/10 space-y-1">
                        <span className="text-[10px] font-racing text-sky-400 block">🔋 HYBRID ERS 出力</span>
                        <span className="text-xs font-bold text-sky-300 font-mono block">350 kW ({carSpecs.ersPowerKw} kW / 476 hp)</span>
                        <span className="text-[10px] text-slate-400 font-sans block">合算総出力: {carSpecs.totalHorsepower}</span>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-950/70 border border-white/10 space-y-1">
                        <span className="text-[10px] font-racing text-amber-400 block">🌪️ ACTIVE AERODYNAMICS</span>
                        <span className="text-xs font-bold text-amber-300 font-sans block leading-tight">Z-mode (高DF) / X-mode (低ドラッグ)</span>
                        <span className="text-[10px] text-slate-400 font-sans block">
                          <SmartWikiText text={carSpecs.activeAero} excludeUrl={`/knowledge/teams/${team.id}`} />
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-950/70 border border-white/10 space-y-1">
                        <span className="text-[10px] font-racing text-slate-400 block">⚖️ 最低重量 ＆ 寸法</span>
                        <span className="text-xs font-bold text-white font-mono block">{carSpecs.weightKg} kg (30kg軽量化)</span>
                        <span className="text-[10px] text-slate-400 font-mono block">WB {carSpecs.wheelbaseMm}mm / 全幅 {carSpecs.widthMm}mm</span>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-950/70 border border-white/10 space-y-1">
                        <span className="text-[10px] font-racing text-emerald-400 block">🌱 持続可能燃料 ＆ 流量規定</span>
                        <span className="text-xs font-bold text-emerald-300 font-sans block">100% アドバンスド持続可能燃料</span>
                        <span className="text-[10px] text-slate-400 font-mono block">
                          <SmartWikiText text={carSpecs.fuelRegulation} excludeUrl={`/knowledge/teams/${team.id}`} />
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-950/70 border border-white/10 space-y-1">
                        <span className="text-[10px] font-racing text-purple-400 block">⚙️ トランスミッション ＆ ブレーキ</span>
                        <span className="text-xs font-bold text-purple-300 font-sans block">{carSpecs.gearbox}</span>
                        <span className="text-[10px] text-slate-400 font-sans block">{carSpecs.brakes}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Direct Telemetry Comparison CTA Banner */}
                {onNavigateToTelemetry && team.drivers.length >= 2 && (
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-950/70 via-slate-900 to-indigo-950/70 border border-blue-500/40 flex flex-col sm:flex-row items-center justify-between gap-3.5 shadow-lg">
                    <div className="space-y-1">
                      <h4 className="text-xs sm:text-sm font-racing font-bold text-sky-300 flex items-center gap-2">
                        <span>📊</span>
                        <span>チーム内テレメトリー直接比較 ({team.drivers[0]} vs {team.drivers[1]})</span>
                      </h4>
                      <p className="text-[11px] text-slate-300">
                        {team.fullName} の2名のドライバーによる実測スロットルワーク、ブレーキングG、トップスピード差を即座に解析できます。
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        onNavigateToTelemetry({
                          year: 2026,
                          targetDriver: team.drivers[0],
                          targetDriver2: team.drivers[1],
                        });
                        onClose();
                      }}
                      className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-racing font-bold text-xs shadow-md transition-all flex items-center gap-1.5 shrink-0 hover:scale-105 cursor-pointer"
                    >
                      <span>🏎️ 2台のテレメトリーを比較</span>
                      <span>➔</span>
                    </button>
                  </div>
                )}

                {/* Philosophy Overview */}
                <div className="bg-slate-900/80 border border-white/10 p-4 rounded-2xl space-y-2">
                  <h4 className="text-xs font-racing font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                    <span>📐</span>
                    <span>開発哲学サマリー</span>
                  </h4>
                  <p className="text-xs text-slate-200 leading-relaxed font-sans">
                    {renderTextWithCitations(team.philosophy.description)}
                  </p>
                </div>

                {/* Aero vs Mechanical Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  <div className="bg-slate-950/80 border border-sky-500/30 p-4 rounded-2xl space-y-2">
                    <h4 className="text-xs font-racing font-bold text-sky-300 uppercase tracking-wider flex items-center gap-1.5">
                      <span>💨</span>
                      <span>空力コンセプト & フロア負圧</span>
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed font-sans">
                      {team.philosophy.aeroFocus}
                    </p>
                  </div>

                  <div className="bg-slate-950/80 border border-amber-500/30 p-4 rounded-2xl space-y-2">
                    <h4 className="text-xs font-racing font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                      <span>⚙️</span>
                      <span>サスペンション & メカニカル接地力</span>
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed font-sans">
                      {team.philosophy.mechanicalFocus}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* ── TAB 3: 2016-2026 HISTORICAL SEASONS & ICONIC CARS ── */}
            {activeTab === 'history' && (
              <div className="space-y-5 animate-fade-in">
                {/* 2016-2026 Historical Roster Matrix */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-racing font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                      <span>🏆</span>
                      <span>2016〜2026年 歴代シーズン体制 ＆ 所属ドライバー変遷</span>
                    </h4>
                    <span className="text-[10px] font-mono text-slate-400">計{matchingSeasons.length}シーズン記録</span>
                  </div>

                  <div className="space-y-2.5">
                    {matchingSeasons.map(({ year, teamData, eraName }) => (
                      <div
                        key={year}
                        className="p-3 sm:p-3.5 rounded-2xl bg-slate-900/80 border border-white/10 hover:border-white/20 transition-all space-y-2.5"
                      >
                        {/* Year Banner */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-white/5 pb-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="px-2 py-0.5 rounded-lg text-xs font-black font-mono bg-sky-950 text-sky-300 border border-sky-500/40">
                              {year}年
                            </span>
                            <span className="text-sm font-bold text-white font-racing">
                              {teamData.fullName}
                            </span>
                            <span className="text-[11px] font-mono text-slate-400">
                              ⚡ {teamData.powerUnit}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
                            {teamData.finalRank ? (
                              <span className="px-2 py-0.5 rounded bg-slate-800 border border-white/10">
                                順位: <strong>{teamData.finalRank}位</strong> {teamData.points ? `(${teamData.points} pts)` : ''}
                              </span>
                            ) : (
                              <span className="text-slate-400">参戦中</span>
                            )}
                          </div>
                        </div>

                        {/* Drivers Roster */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {teamData.drivers.map((drv, drvIdx) => (
                            <div
                              key={drvIdx}
                              onClick={() => onSelectDriverDetail && onSelectDriverDetail(drv.code)}
                              className="p-2 rounded-xl bg-slate-950/70 border border-white/5 hover:border-sky-500/40 transition-all flex items-center justify-between gap-2 cursor-pointer group"
                              title={`${drv.name} のプロファイルを開く`}
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <span className="text-base">{drv.flag}</span>
                                <div className="min-w-0">
                                  <div className="flex items-center gap-1.5">
                                    <span className="font-bold text-xs text-white group-hover:text-sky-300 transition-colors truncate">
                                      {drv.name}
                                    </span>
                                    {drv.number && (
                                      <span className="text-[10px] font-mono text-slate-400">#{drv.number}</span>
                                    )}
                                  </div>
                                  {drv.note && (
                                    <p className="text-[10px] text-slate-400 truncate">{drv.note}</p>
                                  )}
                                </div>
                              </div>
                              <span className="text-[10px] font-mono font-bold text-sky-400 group-hover:translate-x-0.5 transition-transform shrink-0">
                                ➔
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Reserves Section (if any) */}
                        {teamData.reserves && teamData.reserves.length > 0 && (
                          <div className="pt-1 flex items-center gap-1.5 flex-wrap text-[11px]">
                            <span className="text-[10px] font-racing text-slate-400">🛡️ リザーブ/開発:</span>
                            {teamData.reserves.map((res, resIdx) => (
                              <button
                                key={resIdx}
                                onClick={() => onSelectDriverDetail && onSelectDriverDetail(res.code)}
                                className="px-2 py-0.5 rounded-lg text-[10px] font-mono bg-slate-950 text-slate-300 border border-white/10 hover:border-sky-400/40 hover:text-sky-300 transition-all cursor-pointer"
                                title={`${res.name} の情報を見る`}
                              >
                                {res.flag} {res.name}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Photo Gallery Carousel (Historic Cars & Factory) */}
                {team.visualGallery && team.visualGallery.length > 0 && (
                  <PhotoGalleryCarousel
                    items={team.visualGallery}
                    title="📸 HISTORIC CARS & FACTORY GALLERY"
                    themeColor={themeColor}
                  />
                )}

                {/* Historic Milestones */}
                <div className="bg-slate-950/60 border border-white/10 p-4 rounded-2xl space-y-2">
                  <h4 className="text-xs font-racing font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <span>🏎️</span>
                    <span>F1における歴史的マイルストーン</span>
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    {team.name} は長年にわたりF1の技術革新をリードし、空力効率やサスペンション構造、パワーユニットの熱効率において数々のベンチマークを築いてきた。
                  </p>
                </div>
              </div>
            )}

            {/* ── TAB 4: FACTORY & STRUCTURE ── */}
            {activeTab === 'factory' && (
              <div className="space-y-4 animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  <div className="bg-slate-900/80 border border-white/10 p-4 rounded-2xl space-y-2">
                    <h4 className="text-xs font-racing font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                      <span>📍</span>
                      <span>本拠地ファクトリー & 開発拠点</span>
                    </h4>
                    <p className="text-sm font-bold text-white">{team.base}</p>
                    <p className="text-xs text-slate-300 leading-relaxed font-sans">
                      最新鋭の風洞実験施設やドライバー・イン・ザ・ループ（DiL）シミュレータを備え、グランプリ週末もファクトリー側とリアルタイムでテレメトリを交信。
                    </p>
                  </div>

                  <div className="bg-slate-900/80 border border-white/10 p-4 rounded-2xl space-y-2">
                    <h4 className="text-xs font-racing font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                      <span>⚡</span>
                      <span>パワーユニット & テクニカル体制</span>
                    </h4>
                    <p className="text-sm font-bold text-white">{team.powerUnit}</p>
                    <p className="text-xs text-slate-300 leading-relaxed font-sans">
                      チーム代表: <strong className="text-slate-100">{team.teamPrincipal}</strong>
                    </p>
                  </div>
                </div>

                {/* Drivers Card Grid */}
                <div className="bg-slate-950/70 border border-white/10 p-4 rounded-2xl space-y-2.5">
                  <h4 className="text-xs font-racing font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <span>🏎️</span>
                    <span>2026年 正式参戦ドライバー・ラインナップ</span>
                  </h4>
                  <div className="flex flex-wrap gap-2.5">
                    {team.drivers.map((dCode) => (
                      <button
                        key={dCode}
                        onClick={() => onSelectDriverDetail && onSelectDriverDetail(dCode)}
                        className="bg-slate-900 px-4 py-2.5 rounded-xl border border-white/10 hover:border-sky-500/40 flex items-center gap-2 shadow-sm transition-all hover:scale-105 cursor-pointer"
                        title={`${dCode} の詳細を開く`}
                      >
                        <span
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: themeColor }}
                        />
                        <span className="font-racing font-bold text-sm text-white">{dCode}</span>
                        <span className="text-xs text-sky-400">➔</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── TAB 5: REFERENCES & PRIMARY SOURCES ── */}
            {activeTab === 'references' && (
              <div className="space-y-3 animate-fade-in">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-racing font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <span>📚</span>
                    <span>一次出典・公式技術リリース</span>
                  </h4>
                  <span className="text-[10px] font-mono text-slate-500">Academic Verified</span>
                </div>

                <div className="space-y-2">
                  {team.references.map((ref) => {
                    const elId = `team-ref-${team.id}-${ref.id}`;
                    const isHighlighted = highlightedRef === elId;
                    return (
                      <div
                        key={ref.id}
                        id={elId}
                        className={`p-3 rounded-xl text-xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2 border ${
                          isHighlighted
                            ? 'bg-amber-500/20 border-amber-400/80 ring-2 ring-amber-400/50 shadow-lg'
                            : 'bg-slate-900/70 border-white/10 hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-start gap-2.5">
                          <span className="font-mono text-xs font-bold text-sky-400 mt-0.5">
                            [{ref.id}]
                          </span>
                          <div>
                            <p className="text-slate-200 font-semibold text-xs leading-snug">
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
                          className="text-sky-400 hover:text-sky-300 text-xs font-medium flex items-center gap-1 flex-shrink-0 self-end sm:self-center bg-slate-800/80 px-2.5 py-1 rounded-lg border border-white/5 hover:border-sky-500/40"
                        >
                          <span>公式ドキュメントを開く</span>
                          <span>↗</span>
                        </a>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export { TeamDetailModal as TeamDetailView };
