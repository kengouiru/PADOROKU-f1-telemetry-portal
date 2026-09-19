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
  const [isFilterOpen, setIsFilterOpen] = useState(false);
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

  const activeFilterCount =
    (driverStatusFilter !== 'ALL' && driverStatusFilter !== 'Favorites' ? 1 : 0) +
    (driverTeamFilter !== 'ALL' ? 1 : 0);

  const isFiltered =
    effectiveSearch.trim() !== '' ||
    driverStatusFilter !== 'ALL' ||
    driverTeamFilter !== 'ALL';

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
        className="glass-card-premium p-3 sm:p-3.5 flex flex-col justify-between gap-2.5 border-l-4 cursor-pointer hover:border-sky-400 hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 shadow-md group relative overflow-hidden rounded-xl h-full"
        style={{ borderLeftColor: driver.teamColor }}
      >
        <div className="space-y-2">
          {/* Card Top: Number, Code, Country, Title Badge */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className="text-xs font-racing font-black px-2.5 py-0.5 rounded-md border f1-badge-chamfer shadow-sm"
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
          <div className="flex items-center justify-between gap-2.5">
            <div className="min-w-0 flex-1">
              <h3 className="text-sm sm:text-base font-bold text-white leading-tight group-hover:text-sky-300 transition-colors flex items-center gap-1.5">
                <span className="truncate">{driver.fullName}</span>
                {driver.status === 'Legend' && <span className="text-amber-400 text-xs">👑</span>}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5 truncate">{driver.team}</p>
            </div>
            {driver.visualAsset?.imageUrl && (
              <div className="w-10 h-10 rounded-lg overflow-hidden border border-white/10 shrink-0 bg-slate-800 shadow-md group-hover:border-sky-400/50 transition-colors">
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

        {/* Card Bottom: Standardized Stats Grid (Fixed 3-Column Uniform Width & Height) */}
        <div className="space-y-2 pt-1 border-t border-white/5">
          <div className="grid grid-cols-3 gap-1 py-1 px-1.5 rounded-lg bg-slate-950/70 border border-white/5 text-center text-[10px] font-mono whitespace-nowrap">
            <div className="flex items-center justify-center gap-1">
              <span className="text-slate-500">勝</span>
              <strong className="text-amber-400 font-bold tabular-nums">{driver.wins}</strong>
            </div>
            <div className="flex items-center justify-center gap-1 border-x border-white/10">
              <span className="text-slate-500">登壇</span>
              <strong className="text-sky-400 font-bold tabular-nums">{driver.podiums}</strong>
            </div>
            <div className="flex items-center justify-center gap-1">
              <span className="text-slate-500">PP</span>
              <strong className="text-purple-400 font-bold tabular-nums">{driver.polePositions}</strong>
            </div>
          </div>

          {/* Action Row: Unified Height & No-Wrap Buttons */}
          <div className="flex items-center justify-between text-xs">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setCompareDriver1(driver.code);
                setViewMode('compare');
              }}
              className="h-6 px-2.5 rounded-md text-[10px] font-racing font-bold text-purple-300 hover:text-white bg-purple-950/50 hover:bg-purple-900/70 border border-purple-500/40 transition-all shadow-sm flex items-center gap-1 whitespace-nowrap shrink-0 cursor-pointer"
              title="この選手を直接比較ツールに送る"
            >
              <span>⚔️ 比較</span>
            </button>
            <span className="text-sky-400 group-hover:translate-x-0.5 transition-transform font-bold text-xs flex items-center gap-0.5 whitespace-nowrap shrink-0">
              <span>詳細</span>
              <span>➔</span>
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-3 sm:gap-4 max-w-7xl mx-auto animate-fade-in pb-6 sm:pb-2">
      {/* ── Top Bar: View Mode Switcher, Free-Word Search, Summary & Reset ── */}
      <div className="glass-card-premium rounded-xl p-3 sm:p-3.5 shadow-md flex flex-col gap-2.5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2.5">
          {/* View Mode Toggle Buttons */}
          <div className="flex flex-wrap items-center gap-1 bg-slate-900/90 p-1 rounded-lg border border-white/5">
            <button
              onClick={() => setViewMode('grouped')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-racing font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'grouped'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30 ring-1 ring-blue-400/50'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
              }`}
            >
              <span>🏁</span>
              <span>チーム別グループ</span>
              <span className="text-[9px] px-1 py-0.2 rounded bg-sky-400/20 text-sky-200 border border-sky-400/30 ml-0.5">
                推奨
              </span>
            </button>

            <button
              onClick={() => setViewMode('grid2026')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-racing font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'grid2026'
                  ? 'bg-red-600 text-white shadow-md shadow-red-500/30 ring-1 ring-red-400/50'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
              }`}
            >
              <span>🏎️</span>
              <span>2026年最新グリッド</span>
              <span className="text-[9px] px-1 py-0.2 rounded bg-red-400/20 text-red-200 border border-red-400/30 ml-0.5">
                11チーム
              </span>
            </button>

            <button
              onClick={() => setViewMode('flat')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-racing font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'flat'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30 ring-1 ring-blue-400/50'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
              }`}
            >
              <span>👥</span>
              <span>全ドライバー</span>
            </button>

            <button
              onClick={() => setViewMode('legends')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-racing font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
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
              className={`px-2.5 py-1.5 rounded-lg text-xs font-racing font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'compare'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-500/30 ring-1 ring-purple-400/50'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
              }`}
            >
              <span>⚔️</span>
              <span>2名直接比較</span>
            </button>
          </div>

          {/* Counter Badge */}
          <div className="flex items-center gap-2 self-end lg:self-auto shrink-0">
            <span className="text-xs font-mono font-bold bg-slate-900 px-3 py-1.5 rounded-xl border border-white/10 text-sky-400">
              {viewMode === 'grouped' && (
                <>
                  表示中: <strong className="text-white text-sm">全11チーム</strong> (27名)
                </>
              )}
              {viewMode === 'grid2026' && (
                <>
                  表示中: <strong className="text-white text-sm">2026年グリッド 11チーム</strong> (22名)
                </>
              )}
              {viewMode === 'flat' && (
                <>
                  表示中: <strong className="text-white text-sm">{filteredDrivers.length}</strong> / {KNOWLEDGE_DRIVERS.length} 名
                </>
              )}
              {viewMode === 'legends' && (
                <>
                  表示中: 殿堂レジェンド <strong className="text-white text-sm">{legendDrivers.length}</strong> 名
                </>
              )}
              {viewMode === 'compare' && (
                <>
                  表示中: <strong className="text-purple-300 text-sm">2名直接比較モード</strong>
                </>
              )}
            </span>
          </div>
        </div>

        {/* Row 2: Search Input, Starred Quick Toggle, Filter Tray Toggle, Reset */}
        {viewMode !== 'compare' && (
          <div className="flex flex-wrap items-center justify-between gap-2.5">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[220px] max-w-md">
              <span className="absolute inset-y-0 left-0 flex items-center pl-2.5 pointer-events-none text-slate-400 text-xs">
                🔍
              </span>
              <input
                type="text"
                placeholder="ドライバー名・3文字略称・チーム・国籍で検索..."
                value={effectiveSearch}
                onChange={handleSearchInputChange}
                className="w-full bg-slate-900/80 border border-white/10 rounded-lg pl-7 pr-7 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-400 transition-colors"
              />
              {effectiveSearch && (
                <button
                  type="button"
                  onClick={handleClearLocalSearch}
                  className="absolute inset-y-0 right-0 flex items-center pr-2 text-slate-400 hover:text-white text-xs cursor-pointer"
                  title="検索条件をクリア"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Starred Toggle */}
              <button
                type="button"
                onClick={() =>
                  setDriverStatusFilter((prev) =>
                    prev === 'Favorites' ? 'ALL' : 'Favorites'
                  )
                }
                className={`text-xs font-racing font-bold px-2.5 py-1.5 rounded-lg border transition-all flex items-center gap-1.5 shadow-sm cursor-pointer ${
                  driverStatusFilter === 'Favorites'
                    ? 'bg-amber-500/25 border-amber-400 text-amber-300 ring-1 ring-amber-400/50'
                    : 'bg-slate-900/80 border-white/10 text-slate-400 hover:text-amber-300 hover:border-amber-400/30'
                }`}
                title="お気に入りに登録した選手のみ表示"
              >
                <span>{driverStatusFilter === 'Favorites' ? '★' : '☆'}</span>
                <span>推し選手 ({prefs.favoriteDriverCodes?.length || 0})</span>
              </button>

              {/* Filter Tray Toggle Button */}
              <button
                type="button"
                onClick={() => setIsFilterOpen((prev) => !prev)}
                className={`text-xs font-racing font-bold px-3 py-1.5 rounded-lg border transition-all flex items-center gap-1.5 shadow-sm cursor-pointer ${
                  isFilterOpen
                    ? 'bg-blue-600 text-white border-blue-400 shadow-blue-500/30 ring-1 ring-blue-400/50'
                    : activeFilterCount > 0
                    ? 'bg-blue-950/80 border-blue-500/50 text-blue-300 hover:bg-blue-900/80'
                    : 'bg-slate-900/80 border-white/10 text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
                title="詳細フィルター（ステータス・所属チーム）の開閉"
              >
                <span>⚙️</span>
                <span>絞り込み</span>
                {activeFilterCount > 0 && (
                  <span className="w-4 h-4 rounded-full bg-blue-500 text-white text-[10px] font-mono flex items-center justify-center font-bold">
                    {activeFilterCount}
                  </span>
                )}
                <span className="text-[10px]">{isFilterOpen ? '▲' : '▼'}</span>
              </button>

              {isFiltered && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="text-xs font-mono font-bold bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 px-2.5 py-1.5 rounded-lg transition-all flex items-center gap-1 shadow-sm active:scale-95 cursor-pointer"
                  title="すべての絞り込み条件をリセット"
                >
                  <span>✕</span>
                  <span className="hidden sm:inline">リセット</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── Collapsible Filter Tray (On-demand) ── */}
      {isFilterOpen && viewMode !== 'compare' && (
        <div className="glass-card-premium rounded-xl p-3 sm:p-4 border border-blue-500/30 shadow-xl flex flex-col gap-3 animate-fade-in">
          <div className="flex items-center justify-between pb-2 border-b border-white/10 text-xs">
            <span className="font-racing font-bold text-slate-300 flex items-center gap-1.5">
              <span>⚙️</span>
              <span>ドライバー絞り込み条件設定</span>
            </span>
            <button
              type="button"
              onClick={() => setIsFilterOpen(false)}
              className="text-slate-400 hover:text-white text-xs px-2 py-0.5 rounded hover:bg-white/10 transition-colors cursor-pointer"
            >
              閉じる ✕
            </button>
          </div>

          {/* Status Filter */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <span className="text-[11px] font-racing font-bold text-slate-400 uppercase tracking-wider min-w-[70px] flex items-center gap-1">
              <span>👤</span>
              <span>ステータス:</span>
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { key: 'ALL' as DriverStatusFilter, label: '全選手' },
                { key: 'Current' as DriverStatusFilter, label: '🏁 現役グリッド' },
                { key: 'Legend' as DriverStatusFilter, label: '👑 歴代レジェンド' },
              ].map((opt) => {
                const active = driverStatusFilter === opt.key;
                return (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => setDriverStatusFilter(opt.key)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-racing font-bold transition-all flex items-center gap-1 border shadow-sm cursor-pointer ${
                      active
                        ? 'bg-blue-600 text-white border-blue-400 shadow-blue-500/20 ring-1 ring-blue-400/40'
                        : 'bg-slate-900/80 text-slate-400 border-white/5 hover:border-white/20 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Team Filter */}
          <div className="flex flex-col sm:flex-row sm:items-start gap-2 pt-2 border-t border-white/5">
            <span className="text-[11px] font-racing font-bold text-slate-400 uppercase tracking-wider min-w-[70px] flex items-center gap-1 pt-1">
              <span>🏎️</span>
              <span>所属チーム:</span>
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
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
              ].map((t) => {
                const active = driverTeamFilter === t;
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setDriverTeamFilter(t)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all flex items-center gap-1 border shadow-sm cursor-pointer ${
                      active
                        ? 'bg-sky-600 text-white border-sky-400 shadow-sky-500/20 ring-1 ring-sky-400/40 font-bold'
                        : 'bg-slate-900/80 text-slate-400 border-white/5 hover:border-white/20 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── Active Filter Dismissible Chips Strip ── */}
      {viewMode !== 'compare' && (driverStatusFilter !== 'ALL' || driverTeamFilter !== 'ALL' || effectiveSearch.trim()) && (
        <div className="flex flex-wrap items-center gap-1.5 px-1 text-xs">
          <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1 mr-1">
            <span>🎯</span>
            <span>絞り込み中:</span>
          </span>
          {driverStatusFilter !== 'ALL' && driverStatusFilter !== 'Favorites' && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-950/80 border border-blue-500/40 text-blue-200 text-[11px] font-mono">
              <span>{driverStatusFilter === 'Current' ? '🏁 現役' : '👑 レジェンド'}</span>
              <button
                type="button"
                onClick={() => setDriverStatusFilter('ALL')}
                className="hover:text-white text-blue-400 hover:bg-blue-800/50 rounded px-1 ml-0.5 cursor-pointer"
                title="ステータス解除"
              >
                ✕
              </button>
            </span>
          )}
          {driverStatusFilter === 'Favorites' && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-950/80 border border-amber-500/40 text-amber-200 text-[11px] font-mono">
              <span>★ 推し選手のみ</span>
              <button
                type="button"
                onClick={() => setDriverStatusFilter('ALL')}
                className="hover:text-white text-amber-400 hover:bg-amber-800/50 rounded px-1 ml-0.5 cursor-pointer"
                title="推し解除"
              >
                ✕
              </button>
            </span>
          )}
          {driverTeamFilter !== 'ALL' && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-sky-950/80 border border-sky-500/40 text-sky-200 text-[11px] font-mono">
              <span>🏎️ {driverTeamFilter}</span>
              <button
                type="button"
                onClick={() => setDriverTeamFilter('ALL')}
                className="hover:text-white text-sky-400 hover:bg-sky-800/50 rounded px-1 ml-0.5 cursor-pointer"
                title="チーム解除"
              >
                ✕
              </button>
            </span>
          )}
          {effectiveSearch.trim() && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-sky-950/80 border border-sky-500/40 text-sky-200 text-[11px] font-mono">
              <span>&quot;{effectiveSearch}&quot;</span>
              <button
                type="button"
                onClick={handleClearLocalSearch}
                className="hover:text-white text-sky-400 hover:bg-sky-800/50 rounded px-1 ml-0.5 cursor-pointer"
                title="検索解除"
              >
                ✕
              </button>
            </span>
          )}
          <button
            type="button"
            onClick={handleResetFilters}
            className="text-[11px] text-rose-400 hover:text-rose-300 underline ml-1 cursor-pointer font-mono"
          >
            すべて解除
          </button>
        </div>
      )}

      {/* ── MODE 1: 🏁 TEAM GROUPED VIEW (Default Recommended) ── */}
      {viewMode === 'grouped' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5 sm:gap-4 items-stretch">
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
                className="glass-card-premium border rounded-xl p-3 sm:p-3.5 shadow-md transition-all flex flex-col justify-between"
                style={{ borderColor: `${team.color}40` }}
              >
                {/* Team Header Section (Slim Single-Line Header) */}
                <div className="flex items-center justify-between gap-2 pb-2 mb-2 border-b border-white/10">
                  {/* Left: Team Color Pill, Name, Titles */}
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="w-2.5 h-4 rounded-full shrink-0 shadow-sm"
                      style={{ backgroundColor: team.color }}
                    />
                    <h3 className="text-sm sm:text-base font-racing font-bold text-white leading-tight truncate">
                      {team.name}
                    </h3>
                    {team.constructorTitles > 0 && (
                      <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold shrink-0">
                        🏆 {team.constructorTitles}冠
                      </span>
                    )}
                  </div>

                  {/* Right: Principal & PU Badges */}
                  <div className="flex items-center justify-end gap-1.5 text-[10px] font-mono text-slate-400 shrink-0">
                    <span className="bg-slate-900/90 border border-white/5 px-2 py-0.5 rounded-md hidden sm:inline whitespace-nowrap">
                      👔 <strong className="text-slate-200">{team.teamPrincipal}</strong>
                    </span>
                    <span className="bg-slate-900/90 border border-white/5 px-2 py-0.5 rounded-md whitespace-nowrap">
                      ⚡ <strong className="text-sky-300">{team.powerUnit}</strong>
                    </span>
                  </div>
                </div>

                {/* Team Paired Drivers (2 Columns side by side) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 flex-1">
                  {(driverStatusFilter === 'Favorites' ? matchingDrivers : pairedDrivers).map((driver) => renderDriverCard(driver))}
                </div>
              </div>
            );
          })}

          {/* Dedicated Legends Section under the 10 teams */}
          {legendDrivers.some((d) => isDriverMatchQuery(d)) && (
            <div className="col-span-1 lg:col-span-2 bg-gradient-to-r from-amber-950/30 via-slate-950/80 to-amber-950/30 border border-amber-500/40 rounded-2xl p-4 sm:p-5 shadow-xl mt-2">
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch">
            {GRID_2026_TEAMS.map((team) => (
              <div
                key={team.teamName}
                className="glass-card rounded-2xl p-3.5 sm:p-4 border shadow-lg transition-all flex flex-col justify-between gap-3"
                style={{ borderLeftColor: team.teamColor, borderLeftWidth: '5px' }}
              >
                {/* Team Info Bar (Slim Single-Line Header) */}
                <div className="flex items-center justify-between gap-2 pb-2 mb-2 border-b border-white/10">
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="w-2.5 h-4 rounded-full shrink-0 shadow-sm"
                      style={{ backgroundColor: team.teamColor }}
                    />
                    <h3 className="text-sm sm:text-base font-racing font-bold text-white leading-tight truncate">
                      {team.teamName}
                    </h3>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs font-mono shrink-0">
                    <span className="bg-slate-900/90 border border-white/5 px-2 py-0.5 rounded-lg text-slate-300 text-[10px] whitespace-nowrap">
                      ⚡ <strong className="text-sky-300">{team.powerUnit}</strong>
                    </span>
                  </div>
                </div>

                {/* 2 Drivers Columns */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 flex-1">
                  {team.drivers.map((drv) => {
                    const profile = driverMap.get(drv.code);
                    return (
                      <div
                        key={drv.code}
                        onClick={() => profile && setSelectedDriverDetail(profile)}
                        className={`bg-slate-900/80 hover:bg-slate-850 p-3 rounded-xl border border-white/5 hover:border-white/20 transition-all flex flex-col justify-between gap-2 shadow-sm group h-full ${
                          profile ? 'cursor-pointer' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <span
                              className="text-xs font-racing font-black px-2 py-0.5 rounded-lg border shrink-0"
                              style={{
                                color: team.teamColor,
                                borderColor: `${team.teamColor}60`,
                                backgroundColor: `${team.teamColor}15`,
                              }}
                            >
                              #{drv.number} {drv.code}
                            </span>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className="text-sm font-bold text-white truncate">{drv.name}</span>
                                <span className="text-xs shrink-0">{drv.flag}</span>
                              </div>
                              <span className="text-[11px] text-slate-400 font-mono truncate">{drv.country}</span>
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

                        {/* Actions: Unified Fixed Height & No-Wrap Buttons */}
                        <div className="flex items-center justify-between pt-1 border-t border-white/5 text-xs">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setCompareDriver1(drv.code);
                              setViewMode('compare');
                            }}
                            className="h-6 px-2.5 rounded-md text-[10px] font-racing font-bold text-purple-300 hover:text-white bg-purple-950/50 hover:bg-purple-900/70 border border-purple-500/40 transition-all shadow-sm flex items-center gap-1 whitespace-nowrap shrink-0 cursor-pointer"
                            title="この選手を直接比較ツールに送る"
                          >
                            <span>⚔️ 比較</span>
                          </button>

                          {profile && (
                            <span className="text-sky-400 group-hover:translate-x-0.5 transition-transform text-xs font-bold flex items-center gap-0.5 whitespace-nowrap shrink-0">
                              <span>詳細</span>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
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
