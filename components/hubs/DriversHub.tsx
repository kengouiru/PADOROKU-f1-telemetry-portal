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

export type DriverViewMode = 'grouped' | 'flat' | 'legends';
export type DriverStatusFilter = 'ALL' | 'Current' | 'Legend';

export interface DriversHubProps {
  searchQuery?: string;
  onClearSearch?: () => void;
  onSearchChange?: (q: string) => void;
  onNavigateToTelemetry?: (target?: TelemetryTarget) => void;
}

export default function DriversHub({
  searchQuery = '',
  onClearSearch,
  onSearchChange,
  onNavigateToTelemetry,
}: DriversHubProps) {
  const [viewMode, setViewMode] = useState<DriverViewMode>('grouped');
  const [driverStatusFilter, setDriverStatusFilter] = useState<DriverStatusFilter>('ALL');
  const [driverTeamFilter, setDriverTeamFilter] = useState<string>('ALL');
  const [localSearch, setLocalSearch] = useState<string>('');
  const [selectedDriverDetail, setSelectedDriverDetail] = useState<DriverProfile | null>(null);

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
        driverStatusFilter === 'ALL' || d.status === driverStatusFilter;

      const matchesTeam =
        driverTeamFilter === 'ALL' ||
        d.team.toLowerCase().includes(driverTeamFilter.toLowerCase());

      return matchesSearch && matchesStatus && matchesTeam;
    });
  }, [effectiveSearch, driverStatusFilter, driverTeamFilter]);

  // Legends list
  const legendDrivers = useMemo(() => {
    return KNOWLEDGE_DRIVERS.filter((d) => d.status === 'Legend');
  }, []);

  // Helper to check if a driver matches search query
  const isDriverMatchQuery = (d: DriverProfile) => {
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
    (viewMode === 'flat' && (driverStatusFilter !== 'ALL' || driverTeamFilter !== 'ALL'));

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
              <span>レジェンドのみ</span>
            </button>
          </div>

          {/* Counter Badge & Reset Button */}
          <div className="flex items-center gap-2 self-end lg:self-auto flex-shrink-0">
            <span className="text-xs font-mono font-bold bg-slate-900 px-3 py-1.5 rounded-xl border border-white/10 text-sky-400">
              {viewMode === 'grouped' && (
                <>
                  表示中:{' '}
                  <strong className="text-white text-sm">全10チーム</strong> (現役20名 + レジェンド4名)
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
            </span>

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

        {/* Free-word Search Input Row */}
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
              'Sauber',
              'Haas',
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
            const hasMatchingDriver =
              !effectiveSearch.trim() ||
              team.name.toLowerCase().includes(effectiveSearch.toLowerCase()) ||
              team.fullName.toLowerCase().includes(effectiveSearch.toLowerCase()) ||
              pairedDrivers.some((d) => isDriverMatchQuery(d));

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
                  {pairedDrivers.map((driver) => renderDriverCard(driver))}
                </div>
              </div>
            );
          })}

          {/* Dedicated Legends Section under the 10 teams */}
          {(!effectiveSearch.trim() ||
            legendDrivers.some((d) => isDriverMatchQuery(d))) && (
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
          onClose={() => setSelectedDriverDetail(null)}
        />
      )}
    </div>
  );
}
