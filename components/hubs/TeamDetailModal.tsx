'use client';

/**
 * components/hubs/TeamDetailModal.tsx
 * Comprehensive Detailed Modal for F1 Constructors/Teams.
 * Enhanced in Step 2 with:
 * - チーム系統樹 & 系譜 (Full historical lineage tree from origin to current era)
 * - 2026マシン諸元 & PU工学スペック (Chassis code, 350kW MGU-K, Active Aero Z/X mode, Weight 768kg)
 * - 歴代変遷 (2016-2026) ＆ リザーブ枠 (Season-by-season table linking to DriverDetailModal)
 * - チーム内テレメトリー直接比較 (Deep telemetry launch comparing Driver 1 vs Driver 2)
 * - ファクトリー & 組織体系
 * - 一次出典・公式技術リリース
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import type { TeamProfile, Reference, TelemetryTarget } from '@/data/f1KnowledgeData';
import { getTeamLineage, getTeamCarSpecs, type TeamLineageRecord, type CarTechnicalSpecs } from '@/data/f1TeamLineageData';
import { HISTORICAL_SEASONS_DATA, type HistoricalGridTeam, type HistoricalGridDriver } from '@/data/f1HistoricalGrids';
import PhotoGalleryCarousel from '@/components/ui/PhotoGalleryCarousel';
import { useUserPreferences } from '@/lib/userPreferences';
import SmartWikiText from '@/components/common/SmartWikiText';
import {
  Building2,
  Cpu,
  Users,
  Award,
  Trophy,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  History,
  GitBranch,
  BookOpen,
  Sparkles,
  Wind,
  Layers,
  MapPin,
  Flag,
  Activity,
  Star,
  X,
  ExternalLink,
  BatteryCharging,
  Scale,
  Droplets,
  Cog,
  Flame,
  Zap,
} from 'lucide-react';

export interface TeamDetailModalProps {
  team: TeamProfile;
  allTeams: TeamProfile[];
  onSelectTeam: (team: TeamProfile) => void;
  onSelectDriverDetail?: (driverCode: string) => void;
  onNavigateToTelemetry?: (target?: TelemetryTarget) => void;
  onClose: () => void;
}

type TeamTab = 'lineage' | 'engineering' | 'roster' | 'references';

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

const TEAM_FUEL_PARTNERS: Record<string, { partner: string; fuelName: string; note: string }> = {
  ferrari: { partner: 'Shell (シェル)', fuelName: 'Shell V-Power 100% Advanced E-Fuel', note: 'スクーデリアとの75年以上に及ぶパートナーシップ。新燃焼室プレチャンバー技術に最適化。' },
  mercedes: { partner: 'PETRONAS (ペトロナス)', fuelName: 'PETRONAS Primax 100% Sustainable', note: '2014年ハイブリッド時代の8連覇を支えたペトロナスとの共同研究による超高効率合成燃料。' },
  'red-bull': { partner: 'ExxonMobil / Mobil 1', fuelName: 'Mobil 1 Synergy 100% Sustainable', note: 'ミルトンキーンズのRed Bull Ford Powertrains専用ラボで調合される高エネルギー密度燃料。' },
  mclaren: { partner: 'PETRONAS (ペトロナス)', fuelName: 'PETRONAS Primax (Mercedes Works Spec)', note: 'メルセデスPUワークス仕様と同一のペトロナス製高効率持続可能燃料を使用。' },
  'aston-martin': { partner: 'Aramco (アラムコ)', fuelName: 'Aramco 100% Advanced Synthetic E-Fuel', note: '世界最大のエネルギー企業アラムコとホンダHRCが共同開発。ニューウェイ空力と排熱効率を極限調和。' },
  alpine: { partner: 'Castrol / BP', fuelName: 'Castrol EDGE 100% Sustainable Fuel', note: 'ビリー＝シャティヨンとエンストン双方の知見を結集した高オクタン価カーボンニュートラル燃料。' },
  williams: { partner: 'PETRONAS (ペトロナス)', fuelName: 'PETRONAS Primax (Mercedes Spec)', note: 'メルセデス・パワートレインズの供給プロトコルに準拠した最新規格燃料。' },
  rb: { partner: 'ExxonMobil / Mobil 1', fuelName: 'Mobil 1 Synergy (Red Bull Ford Spec)', note: 'シニアチーム（Red Bull）と同一のフォード製PU対応持続可能燃料。' },
  audi: { partner: 'BP / Castrol (BPワークス)', fuelName: 'BP E-Fuel Advanced Formula 1', note: 'アウディF1のフルワークスパートナーとしてBPが独占開発。ノイブルク製独自PU専用調合。' },
  haas: { partner: 'Shell (シェル)', fuelName: 'Shell V-Power (Ferrari Customer Spec)', note: 'フェラーリPUに最適化されたシェルの第2世代バイオマス合成燃料。' },
  cadillac: { partner: 'Shell (シェル) / GM Tech', fuelName: 'Shell V-Power (Ferrari PU Transition Spec)', note: 'フェラーリPUカスタマー契約に基づくシェル供給。将来のGM自社製PUへ向けたデータ蓄積を並行。' },
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
  const fuelPartner = TEAM_FUEL_PARTNERS[team.id];

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

  // Helper to parse keywords and "[1]", "[2]" into clickable links and citation badges
  const renderTextWithCitations = (text: string) => {
    return (
      <SmartWikiText
        text={text}
        excludeUrl={`/knowledge/teams/${team.id}`}
        onCitationClick={handleCitationClick}
      />
    );
  };

  // Helper for structured multi-chapter encyclopedic paragraphs
  const renderParagraphsWithCitations = (text: string) => {
    if (!text) return null;
    const paragraphs = text.split('\n\n').map((p) => p.trim()).filter(Boolean);
    if (paragraphs.length <= 1) {
      return renderTextWithCitations(text);
    }
    return (
      <div className="space-y-2.5">
        {paragraphs.map((p, idx) => (
          <p key={idx} className="leading-relaxed">
            {renderTextWithCitations(p)}
          </p>
        ))}
      </div>
    );
  };

  // Helper for structured multi-chapter philosophy in 2-column magazine layout
  const renderPhilosophyChapters = (descriptionText: string) => {
    if (!descriptionText) return null;
    const rawParts = descriptionText.split('\n\n').map((p) => p.trim()).filter(Boolean);
    if (rawParts.length <= 1) {
      return (
        <div className="bg-slate-900/80 border border-white/10 p-4 rounded-2xl space-y-2">
          <h4 className="text-xs font-racing font-bold uppercase tracking-wider flex items-center gap-1.5" style={{ color: themeColor }}>
            <Cpu className="w-3.5 h-3.5 shrink-0" style={{ color: themeColor }} />
            <span>開発哲学サマリー</span>
          </h4>
          <div className="text-xs text-slate-200 leading-relaxed font-sans max-w-4xl">
            <SmartWikiText text={descriptionText} excludeUrl={`/knowledge/teams/${team.id}`} onCitationClick={handleCitationClick} />
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-racing font-bold uppercase tracking-wider flex items-center gap-1.5" style={{ color: themeColor }}>
            <Cpu className="w-3.5 h-3.5 shrink-0" style={{ color: themeColor }} />
            <span>開発哲学サマリー (Engineering Philosophy)</span>
          </h4>
          <span className="text-[10px] font-mono text-slate-400">2章構成・テクニカル解析</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {rawParts.map((part, idx) => {
            const match = part.match(/^([【\[].+?[】\]])\s*([\s\S]*)$/);
            const heading = match ? match[1] : `【第${idx + 1}章：テクニカル・フィロソフィー】`;
            const body = match ? match[2] : part;
            return (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 hover:border-white/20 transition-all space-y-2 flex flex-col justify-between shadow-md"
                style={{ borderTopColor: themeColor, borderTopWidth: 3 }}
              >
                <div>
                  <h5 className="text-xs font-racing font-bold text-white flex items-center gap-1.5 leading-snug">
                    <span style={{ color: themeColor }}>§{idx + 1}</span>
                    <span>{heading}</span>
                  </h5>
                  <div className="text-xs text-slate-300 leading-relaxed font-sans mt-2.5">
                    <SmartWikiText text={body} excludeUrl={`/knowledge/teams/${team.id}`} onCitationClick={handleCitationClick} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
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
            <ChevronLeft className="w-4 h-4" />
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
              <ChevronLeft className="w-3.5 h-3.5" />
              <span className="font-mono font-bold truncate max-w-[80px] sm:max-w-none">{prevTeam?.name}</span>
            </button>
            <div className="w-px h-3.5 bg-white/15" />
            <button
              onClick={() => nextTeam && onSelectTeam(nextTeam)}
              className="px-2 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-racing flex items-center gap-1 transition-all cursor-pointer border border-white/5"
              title="次のチーム (→キー)"
            >
              <span className="font-mono font-bold truncate max-w-[80px] sm:max-w-none">{nextTeam?.name}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Popout Separate Window Button */}
          <button
            type="button"
            onClick={() => {
              window.open(`/knowledge/teams/${team.id}`, '_blank', 'width=1280,height=900,menubar=no,toolbar=no');
            }}
            className="px-2.5 py-1 rounded-xl bg-sky-950/80 hover:bg-sky-900 border border-sky-500/40 text-sky-300 hover:text-white text-xs font-racing flex items-center gap-1.5 transition-all cursor-pointer shadow-sm hover:scale-105"
            title="このチームを別ウィンドウで開く"
          >
            <span>別ウィンドウで開く</span>
            <ExternalLink className="w-3 h-3 text-sky-400" />
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
              <Activity className="w-3.5 h-3.5 text-white" />
              <span className="hidden md:inline">テレメトリー比較</span>
            </button>
          )}

          {/* Star Favorite Button */}
          <button
            onClick={() => toggleTeam(team.id)}
            className={`px-2.5 py-1 rounded-xl text-xs font-racing flex items-center gap-1.5 transition-all cursor-pointer shadow-sm border ${
              isFavoriteTeam(team.id)
                ? 'bg-amber-400/25 border-amber-400/70 text-amber-300 hover:bg-amber-400/35'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-amber-300 border-white/10'
            }`}
            title={isFavoriteTeam(team.id) ? '推しチームから外す' : '推しチーム (マイパドック) に登録'}
          >
            <Star className={`w-3.5 h-3.5 ${isFavoriteTeam(team.id) ? 'fill-amber-400 text-amber-400' : 'text-slate-400'}`} />
            <span className="hidden md:inline">
              {isFavoriteTeam(team.id) ? '推し' : '推し登録'}
            </span>
          </button>

          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center text-xs font-bold transition-all cursor-pointer border border-white/10 shrink-0"
            title="一覧へ戻る (ESC)"
          >
            <X className="w-3.5 h-3.5" />
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
                <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap text-slate-400">
                  <span className="text-[11px] sm:text-xs font-mono flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                    {team.base}
                  </span>
                  <span className="bg-blue-950/60 text-sky-300 px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-mono border border-sky-500/30 flex items-center gap-1">
                    <Users className="w-2.5 h-2.5 text-sky-400 shrink-0" />
                    代表: {team.teamPrincipal}
                  </span>
                  {lineageRecord && (
                    <span className="bg-emerald-950/60 text-emerald-300 px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-mono border border-emerald-500/30 flex items-center gap-1">
                      <GitBranch className="w-2.5 h-2.5 text-emerald-400 shrink-0" />
                      ルーツ: {lineageRecord.originYear}年〜
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-baseline gap-2 sm:gap-2.5">
                  <h2 className="text-lg sm:text-2xl font-black text-white leading-tight">
                    {team.fullName}
                  </h2>
                  {team.powerUnit && (
                    <span
                      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-white/[0.06] border border-white/10 text-[10px] sm:text-[11px] font-mono text-slate-300 shrink-0"
                      title={`パワーユニット: ${team.powerUnit}`}
                    >
                      <span className="text-[9px] font-bold tracking-wider text-slate-400 font-racing">PU</span>
                      <span className="text-slate-200 font-semibold">{team.powerUnit}</span>
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5 pt-0.5 flex-wrap">
                  <span className="text-[10px] sm:text-[11px] text-slate-400 font-mono">2026 DRIVERS:</span>
                  {team.drivers.map((d) => (
                    <button
                      key={d}
                      onClick={() => onSelectDriverDetail && onSelectDriverDetail(d)}
                      className="px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-mono font-bold border transition-all hover:scale-105 cursor-pointer inline-flex items-center gap-1"
                      style={{
                        color: themeColor,
                        borderColor: `${themeColor}50`,
                        backgroundColor: `${themeColor}12`,
                      }}
                      title={`${d} のドライバー詳細を開く`}
                    >
                      <span>{d}</span>
                      <ArrowRight className="w-2.5 h-2.5 opacity-70" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Constructor Titles Banner */}
            {team.constructorTitles > 0 ? (
              <div className="rounded-xl sm:rounded-2xl p-2.5 sm:p-3 px-3.5 sm:px-4 flex items-center gap-2.5 sm:gap-3 self-start sm:self-auto flex-shrink-0 border shadow-md bg-amber-500/10 border-amber-500/30">
                <Trophy className="w-6 h-6 sm:w-7 sm:h-7 text-amber-400 shrink-0" />
                <div>
                  <span className="text-[10px] sm:text-xs font-racing font-bold uppercase tracking-widest text-amber-400 block">
                    CONSTRUCTOR CHAMPION
                  </span>
                  <span className="text-xs sm:text-base font-black text-white font-mono">
                    {team.constructorTitles}冠 制覇
                  </span>
                </div>
              </div>
            ) : (
              <div className="rounded-xl sm:rounded-2xl p-2.5 sm:p-3 px-3.5 sm:px-4 flex items-center gap-2 self-start sm:self-auto flex-shrink-0 bg-slate-900/60 border border-white/10 text-[11px] sm:text-xs text-slate-400 font-mono">
                <Flag className="w-4 h-4 text-slate-400 shrink-0" />
                <span>コンストラクターズ参戦中</span>
              </div>
            )}
          </div>

          {/* Modal Sub-Tabs (Sticky below top nav bar when scrolling) */}
          <div className="sticky top-[48px] z-40 flex items-center gap-2 px-3.5 sm:px-6 pt-2 sm:pt-2.5 border-b border-white/15 bg-slate-950 overflow-x-auto flex-shrink-0 shadow-md">
            {(
              [
                ['lineage', 'チーム系譜 & 歴代マシン', GitBranch],
                ['engineering', '2026諸元 & 空力哲学', Cpu],
                ['roster', '組織体制 & 歴代ドライバー (2016-2026)', Users],
                ['references', `参考文献 (${team.references.length})`, BookOpen],
              ] as [TeamTab, string, React.ComponentType<{ className?: string }>][]
            ).map(([tab, label, IconComponent]) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-2 px-2.5 sm:px-3 text-xs font-racing font-bold transition-all border-b-2 flex items-center gap-1.5 flex-shrink-0 cursor-pointer ${
                    isActive
                      ? 'font-black'
                      : 'text-slate-400 border-transparent hover:text-slate-200'
                  }`}
                  style={isActive ? {
                    color: themeColor,
                    borderColor: themeColor,
                    textShadow: `0 0 16px ${themeColor}60`,
                  } : undefined}
                >
                  <IconComponent className="w-3.5 h-3.5 shrink-0" />
                  <span>{label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab Content Body */}
          <div className="p-3.5 sm:p-6 flex-1 space-y-4 sm:space-y-5">
            {/* ── TAB 1: TEAM LINEAGE (系統樹 & 歴代マシンギャラリー) ── */}
            {activeTab === 'lineage' && (
              <div className="space-y-5 animate-fade-in">
                {lineageRecord ? (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                    {/* Left / Main Column: Era Timeline Tree (7 cols on lg, 8 cols on xl) */}
                    <div className="lg:col-span-7 xl:col-span-8 space-y-4">
                      {/* Lineage Summary Banner */}
                      <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <GitBranch className="w-4 h-4 text-emerald-400 shrink-0" />
                            <h3 className="text-sm font-racing font-bold text-white tracking-wide">
                              {lineageRecord.currentName} — 歴史的ルーツと継承
                            </h3>
                          </div>
                          <p className="text-xs text-slate-300">
                            創始者: <strong className="text-white">{lineageRecord.founder}</strong> • 起源: <strong className="text-white">{lineageRecord.originYear}年</strong> • 本拠地: <span className="font-mono text-slate-300">{lineageRecord.headquarters}</span>
                          </p>
                        </div>

                        <div className="flex items-center gap-2 bg-slate-950/70 px-3 py-1.5 rounded-xl border border-white/10 shrink-0 text-xs font-mono">
                          <span className="text-slate-400">系譜変遷:</span>
                          <span className="font-bold text-white">{lineageRecord.lineageChain.length}世代</span>
                        </div>
                      </div>

                      {/* Timeline Tree Nodes */}
                      <div
                        className="relative pl-6 sm:pl-8 space-y-5 before:absolute before:left-3 sm:before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-sky-400 before:via-blue-500 before:to-emerald-400"
                      >
                        {lineageRecord.lineageChain.map((node, idx) => {
                          const isLatest = idx === lineageRecord.lineageChain.length - 1;
                          return (
                            <div key={idx} className="relative group">
                              {/* Node Dot Marker */}
                              <div
                                className={`absolute -left-6 sm:-left-8 top-2 w-6 h-6 rounded-full border-2 flex items-center justify-center text-[10px] font-bold shadow-md transition-all group-hover:scale-125`}
                                style={isLatest ? {
                                  backgroundColor: themeColor,
                                  borderColor: '#ffffff',
                                  color: '#ffffff',
                                  boxShadow: `0 0 12px ${themeColor}80`,
                                } : {
                                  backgroundColor: '#020617',
                                  borderColor: themeColor,
                                  color: themeColor,
                                }}
                              >
                                {idx + 1}
                              </div>

                              {/* Node Card */}
                              <div
                                className={`p-4 rounded-2xl border transition-all space-y-3 ${
                                  isLatest
                                    ? 'bg-slate-900/90 shadow-xl'
                                    : 'bg-slate-950/80 border-white/10 hover:border-white/20'
                                }`}
                                style={isLatest ? { borderColor: `${themeColor}60` } : undefined}
                              >
                                {/* Node Header */}
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 border-b border-white/5 pb-2.5">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span
                                      className="px-2.5 py-0.5 rounded-full text-xs font-racing font-bold font-mono border"
                                      style={{
                                        color: themeColor,
                                        borderColor: `${themeColor}40`,
                                        backgroundColor: `${themeColor}15`,
                                      }}
                                    >
                                      {node.period}
                                    </span>
                                    <span className="text-base font-black text-white flex items-center gap-1.5">
                                      <span className="px-1.5 py-0.2 rounded bg-white/5 border border-white/10 text-xs font-mono">{node.flag}</span>
                                      <span>{node.teamName}</span>
                                    </span>
                                    <span className="text-xs text-slate-400 font-mono">({node.fullName})</span>
                                  </div>

                                  <div className="flex items-center gap-1 text-xs font-mono text-slate-400">
                                    <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                                    <span>{node.base}</span>
                                  </div>
                                </div>

                                {/* Node Technical & Personnel Details (2-col grid) */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                                  <div className="space-y-1">
                                    <span className="text-[11px] font-racing text-slate-400 flex items-center gap-1.5">
                                      <Cpu className="w-3 h-3 text-slate-400 shrink-0" />
                                      <span className="font-mono uppercase text-[10px]">PU / エンジン:</span>
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
                                    <span className="text-[11px] font-racing text-slate-400 flex items-center gap-1.5">
                                      <Users className="w-3 h-3 text-slate-400 shrink-0" />
                                      <span className="font-mono uppercase text-[10px]">主要キーパーソン:</span>
                                    </span>
                                    <p className="text-slate-200 font-sans text-[11px] leading-relaxed">
                                      {node.keyPersonnel.join(', ')}
                                    </p>
                                  </div>
                                </div>

                                {/* Notable Drivers */}
                                <div className="space-y-1">
                                  <span className="text-[11px] font-racing text-slate-400 flex items-center gap-1.5">
                                    <Flag className="w-3 h-3 text-slate-400 shrink-0" />
                                    <span className="font-mono uppercase text-[10px]">代表的ドライバー:</span>
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

                                {/* Championships Won in this era (if any) */}
                                {(node.championships.constructors > 0 || node.championships.drivers > 0) && (
                                  <div className="p-2.5 px-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between text-xs flex-wrap gap-2">
                                    <span className="text-amber-400 font-bold flex items-center gap-1.5">
                                      <Trophy className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                                      <span>この時代の王座獲得実績:</span>
                                    </span>
                                    <div className="flex items-center gap-3 font-mono font-bold text-amber-300">
                                      {node.championships.constructors > 0 && (
                                        <span>コンストラクターズ: {node.championships.constructors}冠</span>
                                      )}
                                      {node.championships.drivers > 0 && (
                                        <span>ドライバーズ: {node.championships.drivers}冠</span>
                                      )}
                                    </div>
                                  </div>
                                )}

                                {/* Iconic Historic Car Showcase Card */}
                                {node.iconicCar && (
                                  <div
                                    className="p-3 rounded-xl bg-slate-900/90 border text-xs space-y-1"
                                    style={{ borderColor: `${themeColor}35` }}
                                  >
                                    <div className="font-racing font-bold text-xs flex items-center gap-1.5" style={{ color: themeColor }}>
                                      <Sparkles className="w-3 h-3 shrink-0" />
                                      <span>象徴的名車: {node.iconicCar.model}</span>
                                    </div>
                                    <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
                                      <SmartWikiText text={node.iconicCar.description} excludeUrl={`/knowledge/teams/${team.id}`} onCitationClick={handleCitationClick} />
                                    </p>
                                  </div>
                                )}

                                {/* Historical Summary (Bounded comfortable line length) */}
                                <div className="pt-2 border-t border-white/5 text-xs text-slate-300 leading-relaxed font-sans">
                                  <SmartWikiText text={node.summary} excludeUrl={`/knowledge/teams/${team.id}`} onCitationClick={handleCitationClick} />
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Right Column: Photo Gallery Carousel & Hall of Fame Showcase (5 cols on lg, 4 cols on xl) */}
                    <div className="lg:col-span-5 xl:col-span-4 space-y-4 lg:sticky lg:top-[100px]">
                      {/* Photo Gallery Carousel */}
                      {team.visualGallery && team.visualGallery.length > 0 && (
                        <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-3.5 shadow-xl space-y-2">
                          <PhotoGalleryCarousel
                            items={team.visualGallery}
                            title="歴代名車 & ファクトリーギャラリー"
                            themeColor={themeColor}
                            size="sm"
                            aspectRatio="16/10"
                          />
                        </div>
                      )}

                      {/* Championship Hall of Fame & Heritage Stats Card */}
                      <div
                        className="rounded-2xl border bg-gradient-to-br from-slate-900/90 via-slate-950 to-neutral-950 p-4 shadow-xl space-y-3.5"
                        style={{ borderColor: `${themeColor}40` }}
                      >
                        <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                          <h4 className="text-xs font-racing font-bold text-white flex items-center gap-1.5 uppercase tracking-wider">
                            <Award className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                            <span>栄光の殿堂 & チーム歴代記録</span>
                          </h4>
                          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-slate-300">
                            F1 HERITAGE
                          </span>
                        </div>

                        {/* Title Badges */}
                        <div className="grid grid-cols-2 gap-2 text-center">
                          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30">
                            <span className="text-[10px] text-amber-400 font-racing font-bold block uppercase">
                              CONSTRUCTORS
                            </span>
                            <span className="text-lg font-black text-white font-mono">
                              {lineageRecord.allTimeTitles.constructors}冠
                            </span>
                          </div>
                          <div className="p-2.5 rounded-xl bg-yellow-500/10 border border-yellow-500/30">
                            <span className="text-[10px] text-yellow-400 font-racing font-bold block uppercase">
                              DRIVERS
                            </span>
                            <span className="text-lg font-black text-white font-mono">
                              {lineageRecord.allTimeTitles.drivers}冠
                            </span>
                          </div>
                        </div>

                        {/* Heritage Fast Facts */}
                        <div className="space-y-2 text-xs font-mono">
                          <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-white/5">
                            <span className="text-slate-400">創設年 / 起源:</span>
                            <span className="text-white font-bold">{lineageRecord.originYear}年 ({lineageRecord.founder.split(' ')[0]})</span>
                          </div>
                          <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-white/5">
                            <span className="text-slate-400">開発拠点:</span>
                            <span className="text-white font-bold truncate max-w-[180px]">{team.base}</span>
                          </div>
                          <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-white/5">
                            <span className="text-slate-400">2026年 PU:</span>
                            <span className="text-white font-bold truncate max-w-[180px]">{team.powerUnit}</span>
                          </div>
                          <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-white/5">
                            <span className="text-slate-400">チーム代表:</span>
                            <span className="text-white font-bold">{team.teamPrincipal}</span>
                          </div>
                        </div>

                        {/* Lineage Progression Mini-Pill */}
                        <div className="pt-1 border-t border-white/5 space-y-1">
                          <span className="text-[10px] text-slate-400 font-mono block">チーム変遷の歩み:</span>
                          <div className="flex items-center gap-1.5 flex-wrap text-[11px] font-racing">
                            {lineageRecord.lineageChain.map((n, nIdx) => (
                              <React.Fragment key={nIdx}>
                                <span className={`px-2 py-0.5 rounded text-[10px] border ${
                                  nIdx === lineageRecord.lineageChain.length - 1
                                    ? 'bg-white/10 text-white font-bold border-white/20'
                                    : 'bg-slate-900 text-slate-400 border-white/5'
                                }`}>
                                  {n.teamName}
                                </span>
                                {nIdx < lineageRecord.lineageChain.length - 1 && (
                                  <ArrowRight className="w-2.5 h-2.5 text-slate-600 shrink-0" />
                                )}
                              </React.Fragment>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
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
                        <span className="text-[10px] font-racing font-bold uppercase tracking-wider text-sky-400 block" style={{ color: themeColor }}>
                          2026 FIA REGULATION TECHNICAL DATA SHEET
                        </span>
                        <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                          <Cpu className="w-4 h-4 text-sky-400 shrink-0" />
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
                        <span className="text-[10px] font-racing text-slate-400 flex items-center gap-1">
                          <Cpu className="w-3 h-3 text-slate-400 shrink-0" />
                          <span>POWER UNIT 型式</span>
                        </span>
                        <span className="text-xs font-bold text-white font-mono block leading-tight">{carSpecs.powerUnitName}</span>
                        <span className="text-[10px] text-slate-400 font-sans block">{carSpecs.iceSpecs}</span>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-950/70 border border-white/10 space-y-1">
                        <span className="text-[10px] font-racing text-sky-400 flex items-center gap-1">
                          <BatteryCharging className="w-3 h-3 text-sky-400 shrink-0" />
                          <span>HYBRID ERS 出力</span>
                        </span>
                        <span className="text-xs font-bold text-sky-300 font-mono block">350 kW ({carSpecs.ersPowerKw} kW / 476 hp)</span>
                        <span className="text-[10px] text-slate-400 font-sans block">合算総出力: {carSpecs.totalHorsepower}</span>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-950/70 border border-white/10 space-y-1">
                        <span className="text-[10px] font-racing text-amber-400 flex items-center gap-1">
                          <Wind className="w-3 h-3 text-amber-400 shrink-0" />
                          <span>ACTIVE AERODYNAMICS</span>
                        </span>
                        <span className="text-xs font-bold text-amber-300 font-sans block leading-tight">Z-mode (高DF) / X-mode (低ドラッグ)</span>
                        <span className="text-[10px] text-slate-400 font-sans block">
                          <SmartWikiText text={carSpecs.activeAero} excludeUrl={`/knowledge/teams/${team.id}`} />
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-950/70 border border-white/10 space-y-1">
                        <span className="text-[10px] font-racing text-slate-400 flex items-center gap-1">
                          <Scale className="w-3 h-3 text-slate-400 shrink-0" />
                          <span>最低重量 ＆ 寸法</span>
                        </span>
                        <span className="text-xs font-bold text-white font-mono block">{carSpecs.weightKg} kg (30kg軽量化)</span>
                        <span className="text-[10px] text-slate-400 font-mono block">WB {carSpecs.wheelbaseMm}mm / 全幅 {carSpecs.widthMm}mm</span>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-950/70 border border-white/10 space-y-1">
                        <span className="text-[10px] font-racing text-emerald-400 flex items-center gap-1">
                          <Droplets className="w-3 h-3 text-emerald-400 shrink-0" />
                          <span>持続可能燃料 ＆ 流量規定</span>
                        </span>
                        <span className="text-xs font-bold text-emerald-300 font-sans block">100% アドバンスド持続可能燃料</span>
                        <span className="text-[10px] text-slate-400 font-mono block">
                          <SmartWikiText text={carSpecs.fuelRegulation} excludeUrl={`/knowledge/teams/${team.id}`} />
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-950/70 border border-white/10 space-y-1">
                        <span className="text-[10px] font-racing text-purple-400 flex items-center gap-1">
                          <Cog className="w-3 h-3 text-purple-400 shrink-0" />
                          <span>トランスミッション ＆ ブレーキ</span>
                        </span>
                        <span className="text-xs font-bold text-purple-300 font-sans block">{carSpecs.gearbox}</span>
                        <span className="text-[10px] text-slate-400 font-sans block">{carSpecs.brakes}</span>
                      </div>
                    </div>

                    {/* 2026 Power Split & Energy Deployment Architecture */}
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950/40 border border-white/10 space-y-3.5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                        <div className="flex items-center gap-2">
                          <Activity className="w-4 h-4 text-cyan-400 shrink-0" />
                          <h4 className="text-xs font-racing font-bold text-white uppercase tracking-wider">
                            2026 パワーユニット 50:50 出力配分 ＆ エネルギー回生構造
                          </h4>
                        </div>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-500/30">
                          MGU-H撤廃 / 回生電力8.5倍化
                        </span>
                      </div>

                      {/* Visual Dual Power Split Bar */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-[11px] font-mono">
                          <span className="text-orange-400 font-bold flex items-center gap-1.5">
                            <Flame className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                            <span>1.6L V6 ICE内燃機関 (~400 kW / 53%)</span>
                          </span>
                          <span className="text-cyan-300 font-bold flex items-center gap-1.5">
                            <span>MGU-K 電動モーター (350 kW / 47%)</span>
                            <Zap className="w-3.5 h-3.5 text-cyan-300 shrink-0" />
                          </span>
                        </div>
                        <div className="h-4 w-full bg-slate-800 rounded-full overflow-hidden flex border border-white/10 p-0.5">
                          <div
                            className="h-full bg-gradient-to-r from-red-600 via-orange-500 to-amber-500 rounded-l-full relative flex items-center justify-center text-[9px] font-bold font-mono text-white transition-all shadow-[0_0_12px_rgba(239,68,68,0.4)]"
                            style={{ width: '53.3%' }}
                          >
                            <span className="drop-shadow">ICE 53.3% (~540 PS)</span>
                          </div>
                          <div
                            className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-r-full relative flex items-center justify-center text-[9px] font-bold font-mono text-white transition-all shadow-[0_0_12px_rgba(56,189,248,0.4)]"
                            style={{ width: '46.7%' }}
                          >
                            <span className="drop-shadow">MGU-K 46.7% (476 PS)</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-slate-400 font-sans">
                          <span>3,000 MJ/h エネルギー流量制限 (100% E-Fuel)</span>
                          <span>旧規定120kWから約3倍増 / 1周最大9MJ回生可能</span>
                        </div>
                      </div>

                      {/* Technical Features: Active Aero & E-Fuel Partner */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                        {/* Active Aero Modes */}
                        <div className="p-3 rounded-xl bg-slate-950/70 border border-white/5 space-y-2">
                          <span className="text-[10px] font-racing text-amber-300 flex items-center gap-1.5 font-bold">
                            <Wind className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                            <span>空力モード切替 ＆ MOM (Manual Override)</span>
                          </span>
                          <div className="grid grid-cols-2 gap-2 text-[11px]">
                            <div className="p-2 rounded-lg bg-slate-900/90 border border-amber-500/20">
                              <span className="text-amber-400 font-bold block font-racing">Z-MODE</span>
                              <span className="text-[10px] text-slate-300 block font-bold">コーナリング高DF</span>
                              <span className="text-[9px] text-slate-400 block">前・後翼通常迎角で最大コーナリング速度を確保</span>
                            </div>
                            <div className="p-2 rounded-lg bg-slate-900/90 border border-sky-500/20">
                              <span className="text-sky-400 font-bold block font-racing">X-MODE</span>
                              <span className="text-[10px] text-slate-300 block font-bold">ストレート低ドラッグ</span>
                              <span className="text-[9px] text-slate-400 block">ウイング迎角低減で全車直線でドラッグ55%削減</span>
                            </div>
                          </div>
                          <div className="text-[10px] text-slate-300 bg-purple-950/40 border border-purple-500/20 p-2 rounded-lg">
                            <span className="font-bold text-purple-300 font-racing">MOM (マニュアル・オーバーライド): </span>
                            前方車両と1秒以内で電気ブーストが起動。337km/hまでフルパワー供給を維持しオーバーテイクを演出。
                          </div>
                        </div>

                        {/* Sustainable Fuel Partner */}
                        {fuelPartner && (
                          <div className="p-3 rounded-xl bg-slate-950/70 border border-emerald-500/20 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-racing text-emerald-400 flex items-center gap-1.5 font-bold">
                                <Droplets className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                <span>公式持続可能燃料パートナー</span>
                              </span>
                              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                                100% E-Fuel
                              </span>
                            </div>
                            <div className="p-2.5 rounded-lg bg-slate-900/90 border border-white/5 space-y-1">
                              <div className="text-xs font-bold text-white font-racing">
                                {fuelPartner.partner}
                              </div>
                              <div className="text-[11px] font-mono text-emerald-300 font-medium">
                                {fuelPartner.fuelName}
                              </div>
                              <p className="text-[10px] text-slate-300 font-sans leading-relaxed pt-1">
                                {fuelPartner.note}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Direct Telemetry Comparison CTA Banner */}
                {onNavigateToTelemetry && team.drivers.length >= 2 && (
                  <div
                    className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border flex flex-col sm:flex-row items-center justify-between gap-3.5 shadow-lg"
                    style={{ borderColor: `${themeColor}40` }}
                  >
                    <div className="space-y-1">
                      <h4 className="text-xs sm:text-sm font-racing font-bold text-white flex items-center gap-2">
                        <Activity className="w-4 h-4 text-sky-400 shrink-0" />
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
                      className="px-4 py-2 rounded-xl text-white font-racing font-bold text-xs shadow-md transition-all flex items-center gap-1.5 shrink-0 hover:scale-105 cursor-pointer"
                      style={{
                        backgroundColor: themeColor,
                        color: '#ffffff',
                      }}
                    >
                      <Activity className="w-3.5 h-3.5" />
                      <span>2台のテレメトリーを比較</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                )}

                {/* Structured 2-Column Editorial Philosophy Chapters (Eliminates full-width text wall) */}
                {renderPhilosophyChapters(team.philosophy.description)}

                {/* Aero vs Mechanical Grid (2-Column) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  <div className="bg-slate-950/80 border border-sky-500/30 p-4 rounded-2xl space-y-2">
                    <h4 className="text-xs font-racing font-bold text-sky-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Wind className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                      <span>空力コンセプト & フロア負圧</span>
                    </h4>
                    <div className="text-xs text-slate-300 leading-relaxed font-sans">
                      {renderParagraphsWithCitations(team.philosophy.aeroFocus)}
                    </div>
                  </div>

                  <div className="bg-slate-950/80 border border-amber-500/30 p-4 rounded-2xl space-y-2">
                    <h4 className="text-xs font-racing font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Cog className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>サスペンション & メカニカル接地力</span>
                    </h4>
                    <div className="text-xs text-slate-300 leading-relaxed font-sans">
                      {renderParagraphsWithCitations(team.philosophy.mechanicalFocus)}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── TAB 3: 組織体制 ＆ 歴代所属ドライバー (2016-2026) ── */}
            {activeTab === 'roster' && (
              <div className="space-y-5 animate-fade-in">
                {/* 1. Factory & Management Cockpit (3-Column Grid) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                  <div className="bg-slate-900/80 border border-white/10 p-4 rounded-2xl space-y-2">
                    <h4 className="text-xs font-racing font-bold uppercase tracking-wider flex items-center gap-1.5" style={{ color: themeColor }}>
                      <Building2 className="w-3.5 h-3.5 shrink-0" style={{ color: themeColor }} />
                      <span>本拠地ファクトリー & 開発拠点</span>
                    </h4>
                    <p className="text-sm font-bold text-white font-mono">{team.base}</p>
                    <p className="text-xs text-slate-300 leading-relaxed font-sans">
                      最新鋭の風洞実験施設やドライバー・イン・ザ・ループ（DiL）シミュレータを備え、グランプリ週末もファクトリー側とリアルタイムでテレメトリを交信。
                    </p>
                  </div>

                  <div className="bg-slate-900/80 border border-white/10 p-4 rounded-2xl space-y-2">
                    <h4 className="text-xs font-racing font-bold uppercase tracking-wider flex items-center gap-1.5 text-slate-300">
                      <Cpu className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                      <span>パワーユニット & パートナー体制</span>
                    </h4>
                    <p className="text-sm font-bold text-white font-mono">{team.powerUnit}</p>
                    <p className="text-xs text-slate-300 leading-relaxed font-sans">
                      {fuelPartner ? (
                        <span>{fuelPartner.partner} の100%持続可能燃料を採用。専用ラボで調合される高エネルギー密度E-Fuelと極限調和。</span>
                      ) : (
                        <span>ワークス体制による最新鋭パワーユニット供給と自社開発体制。</span>
                      )}
                    </p>
                  </div>

                  <div className="bg-slate-900/80 border border-white/10 p-4 rounded-2xl space-y-2">
                    <h4 className="text-xs font-racing font-bold uppercase tracking-wider flex items-center gap-1.5 text-slate-300">
                      <Users className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                      <span>チーム首脳陣 & 指揮系統</span>
                    </h4>
                    <p className="text-sm font-bold text-white">代表: {team.teamPrincipal}</p>
                    <p className="text-xs text-slate-300 leading-relaxed font-sans">
                      レースオペレーション、トラックサイドストラテジー、チーフエンジニア陣を統括し、ピット戦略と車体開発を一貫指揮。
                    </p>
                  </div>
                </div>

                {/* 2. 2026 Regular Drivers Spotlight */}
                <div
                  className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border space-y-3.5 shadow-lg"
                  style={{ borderColor: `${themeColor}40` }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 border-b border-white/10 pb-2.5">
                    <div>
                      <h4 className="text-xs font-racing font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                        <span>2026年 正式参戦ドライバー・ラインナップ</span>
                      </h4>
                      <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                        現行シーズンを戦う2名のレギュラードライバー ＆ 開発・リザーブ陣
                      </p>
                    </div>
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
                        className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-racing font-bold text-xs shadow-md transition-all flex items-center gap-1.5 self-start sm:self-auto cursor-pointer hover:scale-105"
                      >
                        <Activity className="w-3.5 h-3.5 text-white" />
                        <span>2台のテレメトリー直接比較</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  {/* Drivers Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {team.drivers.map((dCode) => {
                      // Lookup driver details from matchingSeasons 2026 if available
                      const latestSeason = matchingSeasons[0];
                      const matchedDriver = latestSeason?.teamData?.drivers.find(d => d.code === dCode);
                      return (
                        <div
                          key={dCode}
                          onClick={() => onSelectDriverDetail && onSelectDriverDetail(dCode)}
                          className="p-3.5 rounded-xl bg-slate-900/90 border border-white/10 hover:border-white/20 transition-all flex items-center justify-between gap-3 cursor-pointer group hover:scale-[1.01]"
                          style={{ borderLeftColor: themeColor, borderLeftWidth: 4 }}
                          title={`${matchedDriver?.name || dCode} のドライバー詳細を開く`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <span className="px-2 py-1 rounded-lg bg-white/5 border border-white/10 font-mono text-xs text-slate-200 font-bold shrink-0">
                              {matchedDriver?.flag || dCode}
                            </span>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-racing font-black text-sm sm:text-base text-white group-hover:text-sky-300 transition-colors">
                                  {matchedDriver?.name || dCode}
                                </span>
                                {matchedDriver?.number && (
                                  <span className="px-1.5 py-0.2 rounded bg-white/10 text-white font-mono font-bold text-xs">
                                    #{matchedDriver.number}
                                  </span>
                                )}
                                <span className="px-1.5 py-0.2 rounded font-mono text-[10px] font-bold text-slate-300 border border-white/10">
                                  {dCode}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-400 font-sans truncate mt-0.5">
                                {matchedDriver?.note || `${team.name} レギュラードライバー`}
                              </p>
                            </div>
                          </div>

                          <span className="text-xs font-mono font-bold text-sky-400 group-hover:translate-x-1 transition-transform shrink-0 flex items-center gap-0.5">
                            <span>詳細</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Reserves */}
                  {matchingSeasons[0]?.teamData?.reserves && matchingSeasons[0].teamData.reserves.length > 0 && (
                    <div className="pt-2 border-t border-white/5 flex items-center gap-2 flex-wrap text-xs">
                      <span className="text-[11px] font-mono text-slate-400 font-semibold uppercase tracking-wider">
                        RESERVE / 開発ドライバー:
                      </span>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {matchingSeasons[0].teamData.reserves.map((res, rIdx) => (
                          <button
                            key={rIdx}
                            onClick={() => onSelectDriverDetail && onSelectDriverDetail(res.code)}
                            className="px-2.5 py-1 rounded-lg text-xs font-mono bg-slate-950 text-slate-200 border border-white/10 hover:border-sky-400/40 hover:text-sky-300 transition-all cursor-pointer flex items-center gap-1.5"
                            title={`${res.name} のドライバー詳細を開く`}
                          >
                            <span className="px-1 py-0.2 rounded bg-white/5 border border-white/5 text-[10px]">
                              {res.flag}
                            </span>
                            <span>{res.name}</span>
                            <span className="text-[10px] text-slate-400">({res.code})</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* 3. 2016-2026 Historical Seasons Matrix (2-Column Responsive Grid) */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-racing font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                      <History className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>2016〜2026年 歴代シーズン体制 ＆ 成績変遷 (Season-by-Season)</span>
                    </h4>
                    <span className="text-[10px] font-mono text-slate-400">計{matchingSeasons.length}シーズン記録</span>
                  </div>

                  {/* 2-Column Responsive Grid: Eliminates horizontal void! */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {matchingSeasons.map(({ year, teamData, eraName }) => (
                      <div
                        key={year}
                        className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/10 hover:border-white/20 transition-all space-y-2.5 flex flex-col justify-between"
                      >
                        {/* Year & Spec Header: Power Unit Inline (Compact & Refined, No Emoji) */}
                        <div className="flex items-center justify-between gap-1.5 border-b border-white/5 pb-2">
                          <div className="flex items-center gap-2 flex-wrap min-w-0">
                            <span
                              className="px-2 py-0.5 rounded-md text-xs font-black font-mono border shrink-0"
                              style={{
                                color: themeColor,
                                borderColor: `${themeColor}40`,
                                backgroundColor: `${themeColor}15`,
                              }}
                            >
                              {year}年
                            </span>
                            <span className="text-xs font-bold text-white font-racing tracking-wide truncate max-w-[180px]" title={teamData.fullName}>
                              {teamData.fullName}
                            </span>
                            <span
                              className="text-[10px] font-mono text-slate-300 bg-white/5 px-1.5 py-0.5 rounded border border-white/5 flex items-center gap-1 truncate max-w-[200px]"
                              title={`パワーユニット: ${teamData.powerUnit}`}
                            >
                              <span className="text-slate-500 font-semibold font-racing text-[9px]">PU</span>
                              <span className="truncate">{teamData.powerUnit}</span>
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5 text-xs font-mono shrink-0">
                            {teamData.finalRank ? (
                              <span className="px-2 py-0.5 rounded bg-slate-800/90 border border-white/10 text-[11px] text-slate-300">
                                順位: <strong className="text-white">{teamData.finalRank}位</strong> {teamData.points ? `(${teamData.points} pts)` : ''}
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                                参戦中
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Drivers Roster (Stacked or 2 Mini Cards) */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {teamData.drivers.map((drv, drvIdx) => (
                            <div
                              key={drvIdx}
                              onClick={() => onSelectDriverDetail && onSelectDriverDetail(drv.code)}
                              className="p-2 rounded-xl bg-slate-950/70 border border-white/5 hover:border-sky-500/40 transition-all flex items-center justify-between gap-1.5 cursor-pointer group"
                              title={`${drv.name} のプロファイルを開く`}
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] font-mono text-slate-300 shrink-0 leading-none">
                                  {drv.flag}
                                </span>
                                <div className="min-w-0">
                                  <div className="flex items-center gap-1">
                                    <span className="font-bold text-xs text-white group-hover:text-sky-300 transition-colors truncate">
                                      {drv.name}
                                    </span>
                                    {drv.number && (
                                      <span className="text-[9px] font-mono text-slate-400">#{drv.number}</span>
                                    )}
                                  </div>
                                  {drv.note && (
                                    <p className="text-[9px] text-slate-400 truncate">{drv.note}</p>
                                  )}
                                </div>
                              </div>
                              <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-sky-400 group-hover:translate-x-0.5 transition-all shrink-0" />
                            </div>
                          ))}
                        </div>

                        {/* Reserves Section (if any) */}
                        {teamData.reserves && teamData.reserves.length > 0 && (
                          <div className="pt-1 border-t border-white/5 flex items-center gap-1.5 flex-wrap text-[10px]">
                            <span className="text-slate-400 font-mono text-[10px] uppercase font-semibold">RESERVE:</span>
                            {teamData.reserves.map((res, resIdx) => (
                              <button
                                key={resIdx}
                                onClick={() => onSelectDriverDetail && onSelectDriverDetail(res.code)}
                                className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-950 text-slate-300 border border-white/10 hover:border-sky-400/40 hover:text-sky-300 transition-all cursor-pointer flex items-center gap-1"
                                title={`${res.name} の情報を見る`}
                              >
                                <span className="text-[9px]">{res.flag}</span>
                                <span>{res.name}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
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
                    <BookOpen className="w-3.5 h-3.5 text-slate-400 shrink-0" />
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
                          <ExternalLink className="w-2.5 h-2.5" />
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
