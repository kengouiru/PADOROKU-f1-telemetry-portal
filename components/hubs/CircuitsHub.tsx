'use client';

/**
 * components/hubs/CircuitsHub.tsx
 * Circuits Hub with Region & Characteristics Quick Filter Pills,
 * Integrated Free-word Search, Live Result Counter, Condition Reset, and Detail Modal.
 */

import React, { useState, useMemo, useEffect } from 'react';
import {
  KNOWLEDGE_CIRCUITS,
  type CircuitProfile,
  type TelemetryTarget,
} from '@/data/f1KnowledgeData';
import CircuitDetailModal from './CircuitDetailModal';
import { useUserPreferences } from '@/lib/userPreferences';

export type CircuitRegion = 'ALL' | 'EUROPE' | 'ASIA_ME' | 'AMERICAS' | 'OCEANIA';
export type CircuitCharacteristic = 'ALL' | 'POWER' | 'STREET' | 'TECHNICAL';

export interface CircuitsHubProps {
  searchQuery?: string;
  initialCircuitId?: string;
  onClearSearch?: () => void;
  onSearchChange?: (q: string) => void;
  onNavigateToTelemetry?: (target?: TelemetryTarget) => void;
}

const REGION_OPTIONS: { key: CircuitRegion; label: string; icon: string }[] = [
  { key: 'ALL', label: 'すべて', icon: '🌐' },
  { key: 'EUROPE', label: 'ヨーロッパ', icon: '🇪🇺' },
  { key: 'ASIA_ME', label: 'アジア・中東', icon: '🌏' },
  { key: 'AMERICAS', label: '南北アメリカ', icon: '🌎' },
  { key: 'OCEANIA', label: 'オセアニア', icon: '🦘' },
];

const CHARACTERISTIC_OPTIONS: { key: CircuitCharacteristic; label: string; icon: string }[] = [
  { key: 'ALL', label: 'すべて', icon: '🏎️' },
  { key: 'POWER', label: '超高速・パワー', icon: '⚡' },
  { key: 'STREET', label: '市街地ストリート', icon: '🏙️' },
  { key: 'TECHNICAL', label: 'テクニカル・高DF', icon: '🌀' },
];

export function getCircuitRegion(circuitId: string): CircuitRegion {
  const europe = [
    'monza',
    'imola',
    'spa-francorchamps',
    'circuit-de-monaco',
    'silverstone',
    'catalunya',
    'redbull-ring',
    'hungaroring',
    'zandvoort',
  ];
  const asiaMe = [
    'bahrain-international',
    'suzuka',
    'shanghai',
    'baku',
    'singapore',
    'losail',
    'yas-marina',
    'jeddah',
  ];
  const americas = [
    'miami',
    'villeneuve',
    'cota',
    'mexico',
    'interlagos',
    'las-vegas',
  ];
  const oceania = ['albert-park'];

  if (europe.includes(circuitId)) return 'EUROPE';
  if (asiaMe.includes(circuitId)) return 'ASIA_ME';
  if (americas.includes(circuitId)) return 'AMERICAS';
  if (oceania.includes(circuitId)) return 'OCEANIA';
  return 'EUROPE';
}

export function getCircuitCharacteristics(circuit: CircuitProfile): CircuitCharacteristic[] {
  const power = [
    'monza',
    'spa-francorchamps',
    'silverstone',
    'baku',
    'las-vegas',
    'jeddah',
    'redbull-ring',
    'villeneuve',
  ];
  const street = [
    'circuit-de-monaco',
    'baku',
    'singapore',
    'las-vegas',
    'jeddah',
    'miami',
    'albert-park',
  ];
  const technical = [
    'suzuka',
    'hungaroring',
    'zandvoort',
    'catalunya',
    'imola',
    'cota',
    'losail',
    'bahrain-international',
    'shanghai',
    'mexico',
    'interlagos',
    'yas-marina',
  ];

  const res: CircuitCharacteristic[] = [];
  if (power.includes(circuit.id) || circuit.downforceLevel === 'Low') {
    res.push('POWER');
  }
  if (
    street.includes(circuit.id) ||
    circuit.characteristics.includes('市街地') ||
    circuit.name.includes('市街地') ||
    circuit.characteristics.includes('公道')
  ) {
    res.push('STREET');
  }
  if (
    technical.includes(circuit.id) ||
    circuit.downforceLevel === 'High' ||
    circuit.downforceLevel === 'Medium-High'
  ) {
    res.push('TECHNICAL');
  }
  return res;
}

export default function CircuitsHub({
  searchQuery = '',
  initialCircuitId,
  onClearSearch,
  onSearchChange,
  onNavigateToTelemetry,
}: CircuitsHubProps) {
  const { prefs, isFavoriteCircuit, toggleCircuit } = useUserPreferences();
  const [regionFilter, setRegionFilter] = useState<CircuitRegion>('ALL');
  const [characteristicFilter, setCharacteristicFilter] = useState<CircuitCharacteristic>('ALL');
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [localSearch, setLocalSearch] = useState<string>('');
  const [selectedCircuitDetail, setSelectedCircuitDetail] = useState<CircuitProfile | null>(null);

  // Automatically select & open modal when initialCircuitId is supplied
  useEffect(() => {
    if (initialCircuitId) {
      const found = KNOWLEDGE_CIRCUITS.find((c) => c.id === initialCircuitId);
      if (found) {
        setSelectedCircuitDetail(found);
      }
    }
  }, [initialCircuitId]);

  // Sync effective search between prop and local state
  const effectiveSearch = searchQuery || localSearch;

  const filteredCircuits = useMemo(() => {
    return KNOWLEDGE_CIRCUITS.filter((c) => {
      // Favorite filter
      if (onlyFavorites && !isFavoriteCircuit(c.id)) {
        return false;
      }
      // Region filter
      if (regionFilter !== 'ALL' && getCircuitRegion(c.id) !== regionFilter) {
        return false;
      }
      // Characteristic filter
      if (characteristicFilter !== 'ALL') {
        const chars = getCircuitCharacteristics(c);
        if (!chars.includes(characteristicFilter)) {
          return false;
        }
      }
      // Free word search filter (AND logic: Name, Country, Official Name, Characteristics)
      if (effectiveSearch.trim()) {
        const q = effectiveSearch.toLowerCase().trim();
        const matches =
          c.name.toLowerCase().includes(q) ||
          c.country.toLowerCase().includes(q) ||
          c.officialName.toLowerCase().includes(q) ||
          c.characteristics.toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    });
  }, [regionFilter, characteristicFilter, effectiveSearch, onlyFavorites, isFavoriteCircuit]);

  const isFiltered =
    regionFilter !== 'ALL' ||
    characteristicFilter !== 'ALL' ||
    onlyFavorites ||
    effectiveSearch.trim() !== '';

  const handleResetFilters = () => {
    setRegionFilter('ALL');
    setCharacteristicFilter('ALL');
    setOnlyFavorites(false);
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

  return (
    <div className="flex flex-col gap-4 animate-fade-in">
      {/* ── Quick Filter Bar Section ── */}
      <div className="bg-slate-950/70 border border-white/10 rounded-2xl p-4 shadow-lg flex flex-col gap-3.5">
        {/* Row 1: Region Pills, Counter Badge & Reset Button */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-white/5 pb-3">
          {/* Region Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-racing font-bold text-slate-400 uppercase tracking-wider mr-1 flex items-center gap-1">
              <span>🌐</span>
              <span>地域:</span>
            </span>
            {REGION_OPTIONS.map((opt) => {
              const active = regionFilter === opt.key;
              return (
                <button
                  key={opt.key}
                  onClick={() => setRegionFilter(opt.key)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-racing font-bold transition-all flex items-center gap-1.5 border shadow-sm cursor-pointer ${
                    active
                      ? 'bg-blue-600 text-white border-blue-400 shadow-blue-500/20'
                      : 'bg-slate-900/80 text-slate-400 border-white/5 hover:border-white/20 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <span>{opt.icon}</span>
                  <span>{opt.label}</span>
                </button>
              );
            })}
          </div>

          {/* Result Counter & Condition Reset */}
          <div className="flex items-center gap-2 self-end md:self-auto flex-shrink-0">
            <span className="text-xs font-mono font-bold bg-slate-900 px-3 py-1.5 rounded-xl border border-white/10 text-sky-400">
              表示中:{' '}
              <strong className="text-white text-sm">
                {filteredCircuits.length}
              </strong>{' '}
              / {KNOWLEDGE_CIRCUITS.length} 件
            </span>

            {/* Quick Starred Only Filter Toggle */}
            <button
              onClick={() => setOnlyFavorites((prev) => !prev)}
              className={`text-xs font-racing font-bold px-3 py-1.5 rounded-xl border transition-all flex items-center gap-1.5 shadow-sm cursor-pointer ${
                onlyFavorites
                  ? 'bg-amber-500/25 border-amber-400 text-amber-300 ring-1 ring-amber-400/50'
                  : 'bg-slate-900 border-white/10 text-slate-400 hover:text-amber-300 hover:border-amber-400/30'
              }`}
              title="お気に入りに登録したサーキットのみ表示"
            >
              <span>{onlyFavorites ? '★' : '☆'}</span>
              <span>推しコース ({prefs.favoriteCircuitIds?.length || 0})</span>
            </button>

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

        {/* Row 2: Characteristic Pills & Inline Free-Word Search Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Characteristic Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-racing font-bold text-slate-400 uppercase tracking-wider mr-1 flex items-center gap-1">
              <span>🏎️</span>
              <span>コース特性:</span>
            </span>
            {CHARACTERISTIC_OPTIONS.map((opt) => {
              const active = characteristicFilter === opt.key;
              return (
                <button
                  key={opt.key}
                  onClick={() => setCharacteristicFilter(opt.key)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-racing font-bold transition-all flex items-center gap-1.5 border shadow-sm cursor-pointer ${
                    active
                      ? 'bg-purple-600 text-white border-purple-400 shadow-purple-500/20'
                      : 'bg-slate-900/80 text-slate-400 border-white/5 hover:border-white/20 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <span>{opt.icon}</span>
                  <span>{opt.label}</span>
                </button>
              );
            })}
          </div>

          {/* Inline Free-word Search Input */}
          <div className="relative w-full lg:w-72">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400 text-xs">
              🔍
            </span>
            <input
              type="text"
              placeholder="コース名・国名で検索..."
              value={effectiveSearch}
              onChange={handleSearchInputChange}
              className="w-full bg-slate-900/90 border border-white/10 rounded-xl pl-8 pr-7 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-400 transition-colors"
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
      </div>

      {/* ── Empty State ── */}
      {filteredCircuits.length === 0 && (
        <div className="glass-card p-12 text-center flex flex-col items-center justify-center gap-3">
          <span className="text-4xl">🏁</span>
          <h3 className="text-base font-bold text-white">
            条件に一致するサーキットが見つかりませんでした
          </h3>
          <p className="text-xs text-slate-400 max-w-md">
            地域やコース特性、または検索キーワードの絞り込み条件を変更してください。
          </p>
          <button
            onClick={handleResetFilters}
            className="mt-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-racing font-bold transition-all shadow-md cursor-pointer"
          >
            フィルターをリセットする
          </button>
        </div>
      )}

      {/* ── 24 Circuits Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {filteredCircuits.map((circuit) => {
          const chars = getCircuitCharacteristics(circuit);
          const region = getCircuitRegion(circuit.id);

          return (
            <div
              key={circuit.id}
              onClick={() => setSelectedCircuitDetail(circuit)}
              className="glass-card p-4 flex flex-col justify-between gap-3 border-l-4 border-l-sky-500 cursor-pointer hover:border-sky-400 hover:bg-slate-900/90 transition-all hover:scale-[1.02] shadow-md group relative overflow-hidden"
            >
              <div className="space-y-2.5">
                {/* Card Header: Country, Name, Length */}
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-slate-400 font-mono block truncate">
                        {circuit.country}
                      </span>
                      <span className="text-[9px] font-mono px-1.5 py-0.2 bg-slate-800/80 text-slate-400 rounded border border-white/5">
                        {region === 'EUROPE' && '🇪🇺 欧州'}
                        {region === 'ASIA_ME' && '🌏 アジア中東'}
                        {region === 'AMERICAS' && '🌎 米州'}
                        {region === 'OCEANIA' && '🦘 大洋州'}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-white group-hover:text-sky-300 transition-colors leading-tight mt-0.5 truncate">
                      {circuit.name}
                    </h3>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <span className="text-[11px] font-mono font-bold text-sky-400 bg-sky-950/60 border border-sky-500/30 px-2 py-0.5 rounded-md">
                      {circuit.lengthKm} km
                    </span>
                    {/* Favorite Star Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleCircuit(circuit.id);
                      }}
                      className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-all cursor-pointer ${
                        isFavoriteCircuit(circuit.id)
                          ? 'bg-amber-400/20 border-amber-400/60 text-amber-300 hover:bg-amber-400/30 shadow-sm'
                          : 'bg-slate-900/60 border-white/10 text-slate-500 hover:text-amber-300 hover:border-amber-400/40'
                      }`}
                      title={isFavoriteCircuit(circuit.id) ? '推しコースから外す' : '推しコース (マイパドック) に登録'}
                    >
                      <span className="text-xs">{isFavoriteCircuit(circuit.id) ? '★' : '☆'}</span>
                    </button>
                  </div>
                </div>

                {/* Circuit Specs Badges */}
                <div className="grid grid-cols-3 gap-1.5 bg-slate-950/50 p-2 rounded-xl border border-white/5 text-center text-[10px] font-mono">
                  <div>
                    <span className="text-slate-500 block text-[9px]">DF要求</span>
                    <strong className="text-sky-300">{circuit.downforceLevel}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[9px]">タイヤ負荷</span>
                    <strong className="text-amber-400">{circuit.tyreStress}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[9px]">ピットロス</span>
                    <strong className="text-slate-200">約{circuit.typicalPitLossSec}s</strong>
                  </div>
                </div>

                {/* Characteristics Tag Pills */}
                <div className="flex flex-wrap items-center gap-1">
                  {chars.includes('POWER') && (
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30">
                      ⚡ 超高速
                    </span>
                  )}
                  {chars.includes('STREET') && (
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-purple-500/15 text-purple-300 border border-purple-500/30">
                      🏙️ 市街地
                    </span>
                  )}
                  {chars.includes('TECHNICAL') && (
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                      🌀 高DF技術
                    </span>
                  )}
                </div>

                {/* Characteristics snippet */}
                <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed bg-slate-900/40 p-2 rounded-lg border border-white/5">
                  {circuit.characteristics.replace(/\[\d+\]/g, '')}
                </p>

                {/* Lap Record Snippet */}
                <div className="text-[10px] font-mono text-slate-400 flex items-center justify-between">
                  <span>⏱️ レコード:</span>
                  <span className="text-slate-200 font-bold truncate ml-1">
                    {circuit.lapRecord.time} ({circuit.lapRecord.driver})
                  </span>
                </div>
              </div>

              {/* Card Footer */}
              <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[11px] font-mono text-slate-400">
                <span className="text-[10px] text-slate-500">
                  {circuit.turns} ターン / DRS {circuit.drsZones}
                </span>
                <span className="text-sky-400 group-hover:underline flex items-center gap-0.5 font-bold">
                  <span>詳細解説を見る</span>
                  <span>➔</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Circuit Detail Modal */}
      {selectedCircuitDetail && (
        <CircuitDetailModal
          circuit={selectedCircuitDetail}
          allCircuits={KNOWLEDGE_CIRCUITS}
          onSelectCircuit={(c) => setSelectedCircuitDetail(c)}
          onNavigateToTelemetry={onNavigateToTelemetry}
          onClose={() => setSelectedCircuitDetail(null)}
        />
      )}
    </div>
  );
}
