'use client';

/**
 * components/hubs/DriversHub.tsx
 * Drivers Hub with 3 View Modes:
 * 1. 🏁 チーム別グループ表示 (Team Grouped View: 10 F1 Teams Paired Grid + Hall of Fame Legends) [Default Recommended]
 * 2. 👥 全ドライバー一覧 (Flat Grid with Status & Team Sub-Filters)
 * 3. 🏆 レジェンドのみ (Hall of Fame Legends Showcase)
 * Includes Free-word Search (AND search), Live Counter, Condition Reset, and DriverDetailModal.
 */

import React, { useState, useMemo } from 'react';
import {
  KNOWLEDGE_TEAMS,
  KNOWLEDGE_DRIVERS,
  type DriverProfile,
  type TeamProfile,
  type TelemetryTarget,
} from '@/data/f1KnowledgeData';
import DriverDetailModal from './DriverDetailModal';
import DriverComparisonTool from './DriverComparisonTool';
import { useUserPreferences } from '@/lib/userPreferences';
import { GRID_2026_TEAMS, GRID_2025_TEAMS } from '@/data/f1SeasonData';

export type DriverViewMode = 'grouped' | 'grid2026' | 'grid2025' | 'flat' | 'legends' | 'compare';
export type DriverStatusFilter = 'ALL' | 'Current' | 'Legend' | 'Favorites';

export interface DriversHubProps {
  searchQuery?: string;
  onClearSearch?: () => void;
  onSearchChange?: (q: string) => void;
  onNavigateToTelemetry?: (target?: TelemetryTarget) => void;
  onNavigateToDrama?: () => void;
}

export default function DriversHub({
  searchQuery = '',
  onClearSearch,
  onSearchChange,
  onNavigateToTelemetry,
  onNavigateToDrama,
}: DriversHubProps) {
  const { prefs, isFavoriteDriver, toggleDriver } = useUserPreferences();
  const [viewMode, setViewMode] = useState<DriverViewMode>('grouped');
  const [driverStatusFilter, setDriverStatusFilter] = useState<DriverStatusFilter>('ALL');
  const [driverTeamFilter, setDriverTeamFilter] = useState<string>('ALL');
  const [localSearch, setLocalSearch] = useState<string>('');
  const [selectedDriverDetail, setSelectedDriverDetail] = useState<DriverProfile | null>(null);
  const [compareDriver1, setCompareDriver1] = useState<string>('VER');
  const [compareDriver2, setCompareDriver2] = useState<string>('NOR');

  // Helper map: driver code -> DriverProfile
  const driverMap = useMemo(() => {
    const map = new Map<string, DriverProfile>();
    KNOWLEDGE_DRIVERS.forEach((d) => map.set(d.code, d));
    return map;
  }, []);

  // Sync effective search
  const effectiveSearch = searchQuery || localSearch;

  // Filtered drivers for flat / search view
  const filteredDrivers = useMemo(() => {
    return KNOWLEDGE_DRIVERS.filter((d) => {
      const q = effectiveSearch.toLowerCase().trim();
      const matchesSearch =
        !q ||
        d.fullName.toLowerCase().includes(q) ||
        d.code.toLowerCase().includes(q) ||
        d.team.toLowerCase().includes(q) ||
        d.driverType.toLowerCase().includes(q) ||
        d.country.toLowerCase().includes(q);

      const matchesStatus =
        driverStatusFilter === 'ALL'
          ? true
          : driverStatusFilter === 'Favorites'
          ? isFavoriteDriver(d.code)
          : d.status === driverStatusFilter;

      const matchesTeam =
        driverTeamFilter === 'ALL' ||
        d.team.toLowerCase().includes(driverTeamFilter.toLowerCase());

      return matchesSearch && matchesStatus && matchesTeam;
    });
  }, [effectiveSearch, driverStatusFilter, driverTeamFilter, isFavoriteDriver]);

  // Legends list
  const legendDrivers = useMemo(() => {
    return KNOWLEDGE_DRIVERS.filter((d) => d.status === 'Legend');
  }, []);

  // Helper to check if a driver matches search query & status filter
  const isDriverMatchQuery = (d: DriverProfile) => {
    if (driverStatusFilter === 'Favorites' && !isFavoriteDriver(d.code)) return false;
    if (driverStatusFilter === 'Current' && d.status !== 'Current') return false;
    if (driverStatusFilter === 'Legend' && d.status !== 'Legend') return false;
    if (!effectiveSearch.trim()) return true;
    const q = effectiveSearch.toLowerCase().trim();
    return (
      d.fullName.toLowerCase().includes(q) ||
      d.code.toLowerCase().includes(q) ||
      d.team.toLowerCase().includes(q) ||
      d.driverType.toLowerCase().includes(q) ||
      d.country.toLowerCase().includes(q)
    );
  };

  const isFiltered =
    effectiveSearch.trim() !== '' ||
    driverStatusFilter !== 'ALL' ||
    (viewMode === 'flat' && driverTeamFilter !== 'ALL');

  const handleResetFilters = () => {
    setDriverStatusFilter('ALL');
    setDriverTeamFilter('ALL');
    setLocalSearch('');
    if (onClearSearch) {
      onClearSearch();
    }
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setLocalSearch(val);
    if (onSearchChange) {
      onSearchChange(val);
    }
  };

  const handleClearLocalSearch = () => {
    setLocalSearch('');
    if (onClearSearch) {
      onClearSearch();
    }
  };

  // Reusable Single Driver Card Component
  const renderDriverCard = (driver: DriverProfile) => {
    return (
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

            <div className="flex items-center gap-1.5">
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

              {/* Star Favorite Bookmark Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleDriver(driver.code);
                }}
                className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-all cursor-pointer ${
                  isFavoriteDriver(driver.code)
                    ? 'bg-amber-400/20 border-amber-400/60 text-amber-300 hover:bg-amber-400/30 shadow-sm'
                    : 'bg-slate-900/60 border-white/10 text-slate-500 hover:text-amber-300 hover:border-amber-400/40'
                }`}
                title={isFavoriteDriver(driver.code) ? '推しから外す' : '推し選手 (お気に入り) に登録'}
              >
                <span className="text-xs">{isFavoriteDriver(driver.code) ? '★' : '☆'}</span>
              </button>
            </div>
          </div>

          {/* Driver Name, Team & Portrait Photo */}
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              <h3 className="text-base font-bold text-white leading-tight group-hover:text-sky-300 transition-colors flex items-center gap-1.5">
                <span className="truncate">{driver.fullName}</span>
                {driver.status === 'Legend' && <span className="text-amber-400 text-xs">👑</span>}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5 truncate">{driver.team}</p>
            </div>
            {driver.visualAsset?.imageUrl && (
              <div className="w-12 h-12 rounded-xl overflow-hidden border border-white/10 shrink-0 bg-slate-800 shadow-md group-hover:border-sky-400/50 transition-colors">
                <img
                  src={driver.visualAsset.imageUrl}
                  alt={driver.fullName}
                  className="w-full h-full object-cover object-top"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            )}
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

          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setCompareDriver1(driver.code);
                setViewMode('compare');
              }}
              className="text-[10px] text-purple-300 hover:text-white font-racing flex items-center gap-0.5 hover:bg-purple-600/40 bg-purple-950/50 px-2 py-0.5 rounded border border-purple-500/30 transition-all shadow-sm"
              title="この選手を直接比較ツールに送る"
            >
              <span>⚔️ 比較</span>
            </button>
            <span className="text-sky-400 group-hover:translate-x-0.5 transition-transform font-bold text-xs flex items-center gap-0.5">
              <span>詳細</span>
              <span>➔</span>
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-4 animate-fade-in">
      {/* ── Top Bar: View Mode Switcher, Free-Word Search, Summary & Reset ── */}
      <div className="bg-slate-950/70 border border-white/10 rounded-2xl p-4 shadow-lg flex flex-col gap-3.5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* View Mode Toggle Buttons */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-900/90 p-1.5 rounded-xl border border-white/5">
            <button
              onClick={() => setViewMode('grouped')}
              className={`px-3.5 py-2 rounded-xl text-xs font-racing font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'grouped'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30 ring-1 ring-blue-400/50'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
              }`}
            >
              <span>🏁</span>
              <span>チーム別グループ表示</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-sky-400/20 text-sky-200 border border-sky-400/30 ml-0.5">
                推奨
              </span>
            </button>

            <button
              onClick={() => setViewMode('grid2026')}
              className={`px-3.5 py-2 rounded-xl text-xs font-racing font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'grid2026'
                  ? 'bg-red-600 text-white shadow-md shadow-red-500/30 ring-1 ring-red-400/50'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
              }`}
            >
              <span>🏎️</span>
              <span>2026年最新グリッド</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-red-400/20 text-red-200 border border-red-400/30 ml-0.5">
                11チーム新時代
              </span>
            </button>

            <button
              onClick={() => setViewMode('flat')}
              className={`px-3.5 py-2 rounded-xl text-xs font-racing font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'flat'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30 ring-1 ring-blue-400/50'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
              }`}
            >
              <span>👥</span>
              <span>全ドライバー一覧</span>
            </button>

            <button
              onClick={() => setViewMode('legends')}
              className={`px-3.5 py-2 rounded-xl text-xs font-racing font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'legends'
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-500/30 ring-1 ring-amber-400/50'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
              }`}
            >
              <span>🏆</span>
              <span>レジェンド</span>
            </button>

            <button
              onClick={() => setViewMode('compare')}
              className={`px-3.5 py-2 rounded-xl text-xs font-racing font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'compare'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-500/30 ring-1 ring-purple-400/50'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
              }`}
            >
              <span>⚔️</span>
              <span>2名直接比較</span>
            </button>
          </div>

          {/* Counter Badge & Reset Button */}
          <div className="flex items-center gap-2 self-end lg:self-auto flex-shrink-0">
            <span className="text-xs font-mono font-bold bg-slate-900 px-3 py-1.5 rounded-xl border border-white/10 text-sky-400">
              {viewMode === 'grouped' && (
                <>
                  表示中:{' '}
                  <strong className="text-white text-sm">全11チーム</strong> (現役22名 + レジェンド5名)
                </>
              )}
              {viewMode === 'flat' && (
                <>
                  表示中:{' '}
                  <strong className="text-white text-sm">{filteredDrivers.length}</strong> / {KNOWLEDGE_DRIVERS.length} 名
                </>
              )}
              {viewMode === 'legends' && (
                <>
                  表示中: 殿堂レジェンド{' '}
                  <strong className="text-white text-sm">{legendDrivers.length}</strong> 名
                </>
              )}
              {viewMode === 'compare' && (
                <>
                  表示中: <strong className="text-purple-300 text-sm">2名直接比較モード</strong> (レーダーチャート &amp; スタッツ)
                </>
              )}
            </span>

            {/* Quick Starred Only Filter Toggle */}
            {viewMode !== 'compare' && (
              <button
                onClick={() =>
                  setDriverStatusFilter((prev) =>
                    prev === 'Favorites' ? 'ALL' : 'Favorites'
                  )
                }
                className={`text-xs font-racing font-bold px-3 py-1.5 rounded-xl border transition-all flex items-center gap-1.5 shadow-sm cursor-pointer ${
                  driverStatusFilter === 'Favorites'
                    ? 'bg-amber-500/25 border-amber-400 text-amber-300 ring-1 ring-amber-400/50'
                    : 'bg-slate-900 border-white/10 text-slate-400 hover:text-amber-300 hover:border-amber-400/30'
                }`}
                title="お気に入りに登録した選手のみ表示"
              >
                <span>{driverStatusFilter === 'Favorites' ? '★' : '☆'}</span>
                <span>推し選手 ({prefs.favoriteDriverCodes?.length || 0})</span>
              </button>
            )}

            {isFiltered && (
              <button
                onClick={handleResetFilters}
                className="text-xs font-mono font-bold bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 px-3 py-1.5 rounded-xl transition-all flex items-center gap-1 shadow-sm active:scale-95 cursor-pointer"
                title="すべての絞り込み条件をリセット"
              >
                <span>✕</span>
                <span>条件リセット</span>
              </button>
            )}
          </div>
        </div>

        {/* Free-word Search Input Row (Only shown for list/grouped/legends modes) */}
        {viewMode !== 'compare' && (
          <div className="relative w-full">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400 text-xs">
              🔍
            </span>
            <input
              type="text"
              placeholder="ドライバー名・3文字略称・チーム・国籍で検索..."
              value={effectiveSearch}
              onChange={handleSearchInputChange}
              className="w-full bg-slate-900/90 border border-white/10 rounded-xl pl-8 pr-7 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-400 transition-colors"
            />
            {effectiveSearch && (
              <button
                onClick={handleClearLocalSearch}
                className="absolute inset-y-0 right-0 flex items-center pr-2.5 text-slate-400 hover:text-white text-xs cursor-pointer"
                title="検索条件をクリア"
              >
                ✕
              </button>
            )}
          </div>
        )}
      </div>

      {/* ── Sub-Filters for Flat Mode ── */}
      {viewMode === 'flat' && (
        <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950/60 p-3 rounded-2xl border border-white/10">
          {/* Status Filter Tabs */}
          <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-white/5">
            {(
              [
                ['ALL', '全選手'],
                ['Current', '🏁 現役グリッド'],
                ['Legend', '👑 歴代レジェンド'],
                ['Favorites', `⭐ 推し選手 (${prefs.favoriteDriverCodes?.length || 0})`],
              ] as [DriverStatusFilter, string][]
            ).map(([status, label]) => (
              <button
                key={status}
                onClick={() => setDriverStatusFilter(status)}
                className={`px-3 py-1 rounded-lg text-xs font-racing font-bold transition-all cursor-pointer ${
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
            {[
              'ALL',
              'Red Bull',
              'Ferrari',
              'McLaren',
              'Mercedes',
              'Aston Martin',
              'Alpine',
              'Williams',
              'RB',
              'Audi',
              'Haas',
              'Cadillac',
            ].map((t) => (
              <button
                key={t}
                onClick={() => setDriverTeamFilter(t)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition-all flex-shrink-0 cursor-pointer ${
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
      )}

      {/* ── MODE 1: 🏁 TEAM GROUPED VIEW (Default Recommended) ── */}
      {viewMode === 'grouped' && (
        <div className="flex flex-col gap-6">
          {KNOWLEDGE_TEAMS.map((team) => {
            // Get paired driver objects for this team
            const pairedDrivers = team.drivers
              .map((code) => driverMap.get(code))
              .filter((d): d is DriverProfile => !!d);

            // Check if any driver matches search filter
            const matchingDrivers = pairedDrivers.filter((d) => isDriverMatchQuery(d));
            const hasMatchingDriver =
              driverStatusFilter === 'Favorites'
                ? matchingDrivers.length > 0
                : !effectiveSearch.trim() ||
                  team.name.toLowerCase().includes(effectiveSearch.toLowerCase()) ||
                  team.fullName.toLowerCase().includes(effectiveSearch.toLowerCase()) ||
                  matchingDrivers.length > 0;

            if (!hasMatchingDriver) return null;

            return (
              <div
                key={team.id}
                className="bg-slate-950/60 border rounded-2xl p-4 sm:p-5 shadow-lg transition-all"
                style={{ borderColor: `${team.color}40` }}
              >
                {/* Team Header Section */}
                <div
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-3.5 border-b border-white/10 relative overflow-hidden rounded-xl p-3"
                  style={{
                    backgroundColor: `${team.color}10`,
                    borderLeft: `4px solid ${team.color}`,
                  }}
                >
                  {/* Left: Team Name, Full Name, Initial Badge */}
                  <div className="flex items-center gap-3">
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center font-racing font-black text-xs border shadow-sm flex-shrink-0"
                      style={{
                        color: team.color,
                        borderColor: `${team.color}80`,
                        backgroundColor: `${team.color}20`,
                      }}
                    >
                      {team.name.slice(0, 3).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base sm:text-lg font-racing font-bold text-white leading-tight">
                          {team.name}
                        </h3>
                        {team.constructorTitles > 0 && (
                          <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold">
                            🏆 コンストラクター {team.constructorTitles}冠
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">{team.fullName}</p>
                    </div>
                  </div>

                  {/* Right: Principal, Base, PU Badges */}
                  <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono text-slate-400">
                    <span className="bg-slate-900/90 border border-white/5 px-2.5 py-1 rounded-lg">
                      👔 代表: <strong className="text-slate-200">{team.teamPrincipal}</strong>
                    </span>
                    <span className="bg-slate-900/90 border border-white/5 px-2.5 py-1 rounded-lg">
                      ⚡ PU: <strong className="text-sky-300">{team.powerUnit}</strong>
                    </span>
                    <span className="bg-slate-900/90 border border-white/5 px-2.5 py-1 rounded-lg hidden md:inline">
                      📍 {team.base}
                    </span>
                  </div>
                </div>

                {/* Team Paired Drivers (2 Columns side by side) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(driverStatusFilter === 'Favorites' ? matchingDrivers : pairedDrivers).map((driver) => renderDriverCard(driver))}
                </div>
              </div>
            );
          })}

          {/* Dedicated Legends Section under the 10 teams */}
          {legendDrivers.some((d) => isDriverMatchQuery(d)) && (
            <div className="bg-gradient-to-r from-amber-950/30 via-slate-950/80 to-amber-950/30 border border-amber-500/40 rounded-2xl p-4 sm:p-5 shadow-xl mt-2">
              {/* Legends Section Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-3.5 border-b border-amber-500/20 p-3 rounded-xl bg-amber-500/10 border-l-4 border-l-amber-400">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center font-racing font-black text-xl border border-amber-400/60 bg-amber-400/20 text-amber-300 shadow-sm flex-shrink-0">
                    🏆
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-racing font-bold text-amber-300 leading-tight flex items-center gap-2">
                      <span>F1 HALL OF FAME / LEGENDS</span>
                      <span className="text-xs bg-amber-400/20 text-amber-200 border border-amber-400/40 px-2 py-0.5 rounded-full font-mono">
                        殿堂入りレジェンド
                      </span>
                    </h3>
                    <p className="text-xs text-slate-300 mt-0.5">
                      F1史上に不滅の足跡を刻んだ4名のワールドチャンピオン。セナ、シューマッハ、プロスト、ラウダの栄光。
                    </p>
                  </div>
                </div>
                <div className="text-xs font-mono text-amber-300/90 bg-slate-950/80 px-3 py-1.5 rounded-lg border border-amber-500/30 self-end sm:self-auto">
                  合計 18回 のドライバーズタイトル
                </div>
              </div>

              {/* Legends Grid (4 Columns) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {legendDrivers
                  .filter((d) => isDriverMatchQuery(d))
                  .map((driver) => renderDriverCard(driver))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── View Mode: 2026 OFFICIAL GRID (11 TEAMS x 2 DRIVERS = 22 DRIVERS) ── */}
      {viewMode === 'grid2026' && (
        <div className="flex flex-col gap-5 animate-fade-in">
          {/* 2026 Grid Header Banner */}
          <div className="bg-gradient-to-r from-red-950/40 via-slate-950 to-red-950/40 border border-red-500/30 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="px-2.5 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-mono font-bold uppercase tracking-wider">
                  2026 NEW ERA (11 TEAMS)
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  全11チーム 22名 正式確定ロスター
                </span>
              </div>
              <h2 className="text-xl md:text-2xl font-racing font-bold text-white tracking-wide">
                2026年 F1世界選手権 公式グリッド体制
              </h2>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                新PU規定＆アクティブエアロの幕開け、キャデラックF1チームの第11番目新規参戦、アウディ本格ワークス参入、ホンダ×アストンマーティン、レッドブル・フォード、メルセデス2年目キミ・アントネッリの快進撃など、歴史的変革を迎えた2026年全11チームの陣容。
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-xs font-mono text-slate-300">
                新規参入: <strong className="text-amber-400">Cadillac</strong> / ワークス: <strong className="text-sky-400">Audi</strong>
              </span>
            </div>
          </div>

          {/* 11 Teams Grid */}
          <div className="grid grid-cols-1 gap-4">
            {GRID_2026_TEAMS.map((team) => (
              <div
                key={team.teamName}
                className="glass-card rounded-2xl p-4 sm:p-5 border shadow-lg space-y-3.5 transition-all"
                style={{ borderLeftColor: team.teamColor, borderLeftWidth: '5px' }}
              >
                {/* Team Info Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center font-racing font-black text-xs border shadow-sm flex-shrink-0"
                      style={{
                        color: team.teamColor,
                        borderColor: `${team.teamColor}80`,
                        backgroundColor: `${team.teamColor}20`,
                      }}
                    >
                      {team.teamName.slice(0, 3).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-racing font-bold text-white leading-tight">
                        {team.teamName}
                      </h3>
                      <p className="text-xs text-slate-400 font-mono">{team.fullName}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-mono">
                    <span className="bg-slate-900/90 border border-white/5 px-2.5 py-1 rounded-lg text-slate-300">
                      ⚡ PU: <strong className="text-sky-300">{team.powerUnit}</strong>
                    </span>
                  </div>
                </div>

                {/* 2 Drivers Columns */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {team.drivers.map((drv) => {
                    const profile = driverMap.get(drv.code);
                    return (
                      <div
                        key={drv.code}
                        onClick={() => profile && setSelectedDriverDetail(profile)}
                        className={`bg-slate-900/80 hover:bg-slate-850 p-3.5 rounded-xl border border-white/5 hover:border-white/20 transition-all flex flex-col justify-between gap-2.5 shadow-sm group ${
                          profile ? 'cursor-pointer' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2.5">
                            <span
                              className="text-xs font-racing font-black px-2 py-0.5 rounded-lg border"
                              style={{
                                color: team.teamColor,
                                borderColor: `${team.teamColor}60`,
                                backgroundColor: `${team.teamColor}15`,
                              }}
                            >
                              #{drv.number} {drv.code}
                            </span>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="text-sm font-bold text-white">{drv.name}</span>
                                <span className="text-xs">{drv.flag}</span>
                              </div>
                              <span className="text-[11px] text-slate-400 font-mono">{drv.country}</span>
                            </div>
                          </div>

                          {/* Transfer / Rookie Badges */}
                          <div className="flex items-center gap-1">
                            {drv.isTransfer && (
                              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold font-mono">
                                ⚡ 2026移籍
                              </span>
                            )}
                            {drv.isRookie && (
                              <span className="px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/40 text-[10px] font-bold font-mono">
                                🌟 ルーキー
                              </span>
                            )}
                            {drv.code === 'TSU' && (
                              <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/40 text-[10px] font-bold font-mono">
                                🇯🇵 日本のエース
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Note Highlight */}
                        {drv.note && (
                          <div className="p-2 rounded-lg bg-white/[0.03] border border-white/5 text-[11px] text-slate-300 leading-relaxed">
                            <span>💡 </span>
                            <span className="text-slate-200">{drv.note}</span>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex items-center justify-between pt-1 border-t border-white/5 text-xs">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setCompareDriver1(drv.code);
                              setViewMode('compare');
                            }}
                            className="text-[10px] text-purple-300 hover:text-white font-racing flex items-center gap-0.5 bg-purple-950/40 hover:bg-purple-900/60 px-2 py-0.5 rounded border border-purple-500/30 transition-all"
                          >
                            <span>⚔️ 比較</span>
                          </button>

                          {profile && (
                            <span className="text-sky-400 group-hover:translate-x-0.5 transition-transform text-xs font-bold flex items-center gap-0.5">
                              <span>詳細プロフィール</span>
                              <span>➔</span>
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── MODE 2: 👥 FLAT GRID VIEW ── */}
      {viewMode === 'flat' && (
        <>
          {filteredDrivers.length === 0 ? (
            <div className="glass-card p-12 text-center flex flex-col items-center justify-center gap-3">
              <span className="text-4xl">👤</span>
              <h3 className="text-base font-bold text-white">
                条件に一致するドライバーが見つかりませんでした
              </h3>
              <p className="text-xs text-slate-400 max-w-md">
                ステータスやチーム、または検索キーワードの絞り込み条件を変更してください。
              </p>
              <button
                onClick={handleResetFilters}
                className="mt-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-racing font-bold transition-all shadow-md cursor-pointer"
              >
                フィルターをリセットする
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {filteredDrivers.map((driver) => renderDriverCard(driver))}
            </div>
          )}
        </>
      )}

      {/* ── MODE 3: 🏆 LEGENDS SHOWCASE VIEW ── */}
      {viewMode === 'legends' && (
        <div className="flex flex-col gap-4">
          <div className="bg-gradient-to-r from-amber-500/15 via-amber-600/10 to-transparent border border-amber-500/40 rounded-2xl p-4 sm:p-6 shadow-xl">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🏆</span>
              <div>
                <h3 className="text-lg font-racing font-bold text-amber-300">
                  F1 HISTORIC LEGENDS (殿堂入りレジェンド一覧)
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  モータースポーツの歴史を決定づけた偉大な4名のレジェンド。
                  テレメトリー比較、ドライビング技術論、歴史的アーカイブと直接リンクしています。
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {legendDrivers
              .filter((d) => isDriverMatchQuery(d))
              .map((driver) => renderDriverCard(driver))}
          </div>
        </div>
      )}

      {/* ── MODE 4: ⚔️ DRIVER COMPARISON TOOL ── */}
      {viewMode === 'compare' && (
        <DriverComparisonTool
          initialDriver1={compareDriver1}
          initialDriver2={compareDriver2}
          onNavigateToTelemetry={onNavigateToTelemetry}
          onNavigateToDrama={onNavigateToDrama}
          onSelectDriverDetail={(d) => setSelectedDriverDetail(d)}
        />
      )}

      {/* ── Driver Detail Modal ── */}
      {selectedDriverDetail && (
        <DriverDetailModal
          driver={selectedDriverDetail}
          allDrivers={
            viewMode === 'legends'
              ? legendDrivers
              : viewMode === 'flat'
              ? filteredDrivers
              : KNOWLEDGE_DRIVERS
          }
          onSelectDriver={(d) => setSelectedDriverDetail(d)}
          onNavigateToTelemetry={onNavigateToTelemetry}
          onCompareDriver={(code) => {
            setCompareDriver1(code);
            setViewMode('compare');
          }}
          onClose={() => setSelectedDriverDetail(null)}
        />
      )}
    </div>
  );
}
