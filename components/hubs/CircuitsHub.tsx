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
import { getCircuitWeather } from '@/data/f1WeatherData';

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
    'madrid',
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
    'madrid',
  ];
  const street = [
    'circuit-de-monaco',
    'baku',
    'singapore',
    'las-vegas',
    'jeddah',
    'miami',
    'albert-park',
    'madrid',
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

export const CIRCUIT_REAL_IMAGES: Record<string, string> = {
  'bahrain-international': '/images/circuits/circuit_bahrain_real.jpg',
  'suzuka': '/images/circuits/circuit_suzuka_real.jpg',
  'monza': '/images/circuits/circuit_monza_real.jpg',
  'spa-francorchamps': '/images/circuits/circuit_spa_real.jpg',
  'circuit-de-monaco': '/images/circuits/circuit_monaco_real.jpg',
  'silverstone': '/images/circuits/circuit_silverstone_real.jpg',
  'albert-park': '/images/circuits/circuit_albert_park_real.jpg',
  'shanghai': '/images/circuits/circuit_shanghai_real.jpg',
  'miami': '/images/circuits/circuit_miami_real.jpg',
  'imola': '/images/circuits/circuit_imola_real.jpg',
  'villeneuve': '/images/circuits/circuit_villeneuve_real.jpg',
  'catalunya': '/images/circuits/circuit_catalunya.jpg',
  'madrid': '/images/circuits/circuit_madrid.jpg',
  'redbull-ring': '/images/circuits/circuit_redbull_ring_real.jpg',
  'hungaroring': '/images/circuits/circuit_hungaroring.jpg',
  'zandvoort': '/images/circuits/circuit_zandvoort.jpg',
  'baku': '/images/circuits/circuit_baku_real.jpg',
  'singapore': '/images/circuits/circuit_singapore_real.jpg',
  'cota': '/images/circuits/circuit_cota_real.jpg',
  'mexico': '/images/circuits/circuit_mexico_real.jpg',
  'interlagos': '/images/circuits/circuit_interlagos_real.jpg',
  'las-vegas': '/images/circuits/circuit_las_vegas_real.jpg',
  'losail': '/images/circuits/circuit_losail_real.jpg',
  'yas-marina': '/images/circuits/circuit_yas_marina_real.jpg',
  'jeddah': '/images/circuits/circuit_jeddah_real.jpg',
};

export function getCircuitImage(circuit: CircuitProfile): string {
  if (CIRCUIT_REAL_IMAGES[circuit.id]) return CIRCUIT_REAL_IMAGES[circuit.id];
  if (circuit.visualMap?.imageUrl) return circuit.visualMap.imageUrl;
  return '/images/circuits/circuit_asset_1.png';
}

export function getCircuitDirection(circuitId: string): { label: string; icon: string } {
  const antiClockwise = [
    'baku',
    'cota',
    'interlagos',
    'yas-marina',
    'singapore',
    'jeddah',
    'miami',
    'las-vegas',
    'imola',
  ];
  if (circuitId === 'suzuka') return { label: '8の字立体交差', icon: '♾️' };
  if (antiClockwise.includes(circuitId)) return { label: '反時計回り', icon: '↺' };
  return { label: '時計回り', icon: '🔄' };
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
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedCircuitDetail, setSelectedCircuitDetail] = useState<CircuitProfile | null>(null);

  // Automatically select & open modal when initialCircuitId is supplied or from URL query param ?circuit=<id>
  useEffect(() => {
    if (initialCircuitId) {
      const found = KNOWLEDGE_CIRCUITS.find((c) => c.id === initialCircuitId);
      if (found) {
        setSelectedCircuitDetail(found);
        return;
      }
    }
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const circuitParam = params.get('circuit');
      if (circuitParam) {
        const found = KNOWLEDGE_CIRCUITS.find((c) => c.id === circuitParam);
        if (found) {
          setSelectedCircuitDetail(found);
        }
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

  const activeFilterCount =
    (regionFilter !== 'ALL' ? 1 : 0) + (characteristicFilter !== 'ALL' ? 1 : 0);

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

  // If a circuit detail is selected, render CircuitDetailModal as a Dedicated Full-Page View (matching DriverDetailModal and TeamDetailModal)
  if (selectedCircuitDetail) {
    return (
      <CircuitDetailModal
        circuit={selectedCircuitDetail}
        allCircuits={KNOWLEDGE_CIRCUITS}
        onSelectCircuit={(c) => setSelectedCircuitDetail(c)}
        onNavigateToTelemetry={onNavigateToTelemetry}
        onClose={() => {
          setSelectedCircuitDetail(null);
          if (typeof window !== 'undefined') {
            const cleanupUrl = new URL(window.location.href);
            cleanupUrl.searchParams.delete('circuit');
            window.history.replaceState(null, '', cleanupUrl.toString());
          }
        }}
      />
    );
  }

  return (
    <div className="flex flex-col gap-3 sm:gap-4 max-w-7xl mx-auto animate-fade-in pb-6 sm:pb-2">
      {/* ── 1. Compact Single-Row Action Bar ── */}
      <div className="glass-card-premium rounded-xl p-2.5 sm:p-3 shadow-md flex flex-wrap items-center justify-between gap-2.5 border border-white/10">
        {/* Left: Circuit Count Badge & Inline Quick Search */}
        <div className="flex items-center gap-2.5 flex-1 min-w-[240px]">
          <span className="text-xs font-mono font-bold bg-slate-900/90 px-2.5 py-1.5 rounded-lg border border-white/10 text-red-400 shrink-0">
            表示中: <strong className="text-white text-sm">{filteredCircuits.length}</strong> / {KNOWLEDGE_CIRCUITS.length} 件
          </span>

          <div className="relative flex-1 max-w-sm">
            <span className="absolute inset-y-0 left-0 flex items-center pl-2.5 pointer-events-none text-slate-400 text-xs">
              🔍
            </span>
            <input
              type="text"
              placeholder="コース名・国名・特性で検索..."
              value={effectiveSearch}
              onChange={handleSearchInputChange}
              className="w-full bg-slate-900/80 border border-white/10 rounded-lg pl-7 pr-7 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500/50 transition-colors"
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
        </div>

        {/* Right: Starred Quick Filter, Filter Tray Toggle, Reset */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Favorites quick toggle */}
          <button
            type="button"
            onClick={() => setOnlyFavorites((prev) => !prev)}
            className={`text-xs font-racing font-bold px-2.5 py-1.5 rounded-lg border transition-all flex items-center gap-1.5 shadow-sm cursor-pointer ${
              onlyFavorites
                ? 'bg-amber-500/25 border-amber-400 text-amber-300 ring-1 ring-amber-400/50'
                : 'bg-slate-900/80 border-white/10 text-slate-400 hover:text-amber-300 hover:border-amber-400/30'
            }`}
            title="お気に入りに登録したサーキットのみ表示"
          >
            <span>{onlyFavorites ? '★' : '☆'}</span>
            <span>推しコース ({prefs.favoriteCircuitIds?.length || 0})</span>
          </button>

          {/* Filter Tray Toggle Button with Badge */}
          <button
            type="button"
            onClick={() => setIsFilterOpen((prev) => !prev)}
            className={`text-xs font-racing font-bold px-3 py-1.5 rounded-lg border transition-all flex items-center gap-1.5 shadow-sm cursor-pointer ${
              isFilterOpen
                ? 'bg-red-600 text-white border-red-500/50 shadow-md shadow-red-950/40 ring-1 ring-red-400/40'
                : activeFilterCount > 0
                ? 'bg-red-950/70 border-red-500/40 text-red-200 hover:bg-red-900/70'
                : 'bg-slate-900/80 border-white/10 text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
            title="詳細フィルター（地域・コース特性）の開閉"
          >
            <span>⚙️</span>
            <span>絞り込み</span>
            {activeFilterCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-red-600 text-white text-[10px] font-mono flex items-center justify-center font-bold">
                {activeFilterCount}
              </span>
            )}
            <span className="text-[10px] transition-transform">{isFilterOpen ? '▲' : '▼'}</span>
          </button>

          {/* Reset all button if anything is filtered */}
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

      {/* ── 2. Collapsible Filter Tray (On-demand) ── */}
      {isFilterOpen && (
        <div className="glass-card-premium rounded-xl p-3 sm:p-4 border border-red-500/30 shadow-xl shadow-red-950/20 flex flex-col gap-3 animate-fade-in">
          <div className="flex items-center justify-between pb-2 border-b border-white/10 text-xs">
            <span className="font-racing font-bold text-slate-300 flex items-center gap-1.5">
              <span>⚙️</span>
              <span>サーキット絞り込み条件設定</span>
            </span>
            <button
              type="button"
              onClick={() => setIsFilterOpen(false)}
              className="text-slate-400 hover:text-white text-xs px-2 py-0.5 rounded hover:bg-white/10 transition-colors cursor-pointer"
            >
              閉じる ✕
            </button>
          </div>

          {/* Region Section */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <span className="text-[11px] font-racing font-bold text-slate-400 uppercase tracking-wider min-w-[70px] flex items-center gap-1">
              <span>🌐</span>
              <span>開催地域:</span>
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
              {REGION_OPTIONS.map((opt) => {
                const active = regionFilter === opt.key;
                return (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => setRegionFilter(opt.key)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-racing font-bold transition-all flex items-center gap-1 border shadow-sm cursor-pointer ${
                      active
                        ? 'bg-red-600 text-white border-red-500/50 shadow-md shadow-red-950/40 ring-1 ring-red-400/40'
                        : 'bg-slate-900/80 text-slate-400 border-white/5 hover:border-white/20 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <span>{opt.icon}</span>
                    <span>{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Characteristics Section */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 pt-2 border-t border-white/5">
            <span className="text-[11px] font-racing font-bold text-slate-400 uppercase tracking-wider min-w-[70px] flex items-center gap-1">
              <span>🏎️</span>
              <span>コース特性:</span>
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
              {CHARACTERISTIC_OPTIONS.map((opt) => {
                const active = characteristicFilter === opt.key;
                return (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => setCharacteristicFilter(opt.key)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-racing font-bold transition-all flex items-center gap-1 border shadow-sm cursor-pointer ${
                      active
                        ? 'bg-red-600 text-white border-red-500/50 shadow-md shadow-red-950/40 ring-1 ring-red-400/40'
                        : 'bg-slate-900/80 text-slate-400 border-white/5 hover:border-white/20 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <span>{opt.icon}</span>
                    <span>{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── 3. Active Filter Dismissible Chips Strip ── */}
      {(regionFilter !== 'ALL' || characteristicFilter !== 'ALL' || onlyFavorites || effectiveSearch.trim()) && (
        <div className="flex flex-wrap items-center gap-1.5 px-1 text-xs">
          <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1 mr-1">
            <span>🎯</span>
            <span>絞り込み中:</span>
          </span>
          {regionFilter !== 'ALL' && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-red-950/70 border border-red-500/40 text-red-200 text-[11px] font-mono">
              <span>{REGION_OPTIONS.find((r) => r.key === regionFilter)?.icon}</span>
              <span>{REGION_OPTIONS.find((r) => r.key === regionFilter)?.label}</span>
              <button
                type="button"
                onClick={() => setRegionFilter('ALL')}
                className="hover:text-white text-red-400 hover:bg-red-800/50 rounded px-1 ml-0.5 cursor-pointer"
                title="地域フィルター解除"
              >
                ✕
              </button>
            </span>
          )}
          {characteristicFilter !== 'ALL' && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-red-950/70 border border-red-500/40 text-red-200 text-[11px] font-mono">
              <span>{CHARACTERISTIC_OPTIONS.find((c) => c.key === characteristicFilter)?.icon}</span>
              <span>{CHARACTERISTIC_OPTIONS.find((c) => c.key === characteristicFilter)?.label}</span>
              <button
                type="button"
                onClick={() => setCharacteristicFilter('ALL')}
                className="hover:text-white text-red-400 hover:bg-red-800/50 rounded px-1 ml-0.5 cursor-pointer"
                title="コース特性フィルター解除"
              >
                ✕
              </button>
            </span>
          )}
          {onlyFavorites && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-950/80 border border-amber-500/40 text-amber-200 text-[11px] font-mono">
              <span>★ 推しコースのみ</span>
              <button
                type="button"
                onClick={() => setOnlyFavorites(false)}
                className="hover:text-white text-amber-400 hover:bg-amber-800/50 rounded px-1 ml-0.5 cursor-pointer"
                title="推しコース絞り込み解除"
              >
                ✕
              </button>
            </span>
          )}
          {effectiveSearch.trim() && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-800/90 border border-white/20 text-slate-200 text-[11px] font-mono">
              <span>&quot;{effectiveSearch}&quot;</span>
              <button
                type="button"
                onClick={handleClearLocalSearch}
                className="hover:text-white text-slate-400 hover:bg-white/10 rounded px-1 ml-0.5 cursor-pointer"
                title="検索キーワード解除"
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
            className="mt-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-racing font-bold transition-all shadow-md cursor-pointer"
          >
            フィルターをリセットする
          </button>
        </div>
      )}

      {/* ── 24 Circuits Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3">
        {filteredCircuits.map((circuit) => {
          const chars = getCircuitCharacteristics(circuit);
          const region = getCircuitRegion(circuit.id);
          const weather = getCircuitWeather(circuit.id);
          const imageUrl = getCircuitImage(circuit);
          const direction = getCircuitDirection(circuit.id);
          const elevation = circuit.trackGeometry?.elevationChangeMeters;

          return (
            <div
              key={circuit.id}
              onClick={() => setSelectedCircuitDetail(circuit)}
              className="glass-card-premium flex flex-col justify-between border border-white/10 hover:border-red-500/40 hover:shadow-xl hover:shadow-red-950/20 cursor-pointer transition-all duration-200 hover:-translate-y-1 group relative overflow-hidden rounded-2xl h-full"
            >
              {/* Top Banner Image with Aspect Ratio & Overlays */}
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-900">
                <img
                  src={imageUrl}
                  alt={circuit.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-90 group-hover:brightness-100"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-black/50" />

                {/* Floating Top Bar on Image */}
                <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between gap-1.5 z-10">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] font-mono px-2 py-0.5 bg-black/60 backdrop-blur-md text-white rounded-md border border-white/10 font-bold">
                      {circuit.country}
                    </span>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 bg-slate-900/80 backdrop-blur-md text-slate-300 rounded border border-white/10">
                      {region === 'EUROPE' && '🇪🇺 欧州'}
                      {region === 'ASIA_ME' && '🌏 アジア中東'}
                      {region === 'AMERICAS' && '🌎 米州'}
                      {region === 'OCEANIA' && '🦘 大洋州'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono font-bold text-white bg-black/70 backdrop-blur-md border border-white/10 px-2 py-0.5 rounded-md">
                      {circuit.lengthKm} km
                    </span>
                    {/* Favorite Star Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleCircuit(circuit.id);
                      }}
                      className={`w-7 h-7 rounded-lg flex items-center justify-center border backdrop-blur-md transition-all cursor-pointer ${
                        isFavoriteCircuit(circuit.id)
                          ? 'bg-amber-400/30 border-amber-400/70 text-amber-300 hover:bg-amber-400/40 shadow-sm'
                          : 'bg-black/60 border-white/15 text-slate-400 hover:text-amber-300 hover:border-amber-400/50'
                      }`}
                      title={isFavoriteCircuit(circuit.id) ? '推しコースから外す' : '推しコース (マイパドック) に登録'}
                    >
                      <span className="text-xs">{isFavoriteCircuit(circuit.id) ? '★' : '☆'}</span>
                    </button>
                  </div>
                </div>

                {/* Floating Bottom Bar on Image (Direction, Elevation, DRS) */}
                <div className="absolute bottom-2 inset-x-2.5 flex items-center justify-between text-[9.5px] font-mono text-slate-300 z-10">
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded bg-black/60 backdrop-blur-md border border-white/10 flex items-center gap-1">
                      <span>{direction.icon}</span>
                      <span>{direction.label}</span>
                    </span>
                    {elevation !== undefined && (
                      <span className="px-2 py-0.5 rounded bg-black/60 backdrop-blur-md border border-white/10 text-sky-300">
                        ⛰️ 高低差 {elevation}m
                      </span>
                    )}
                  </div>
                  <span className="px-2 py-0.5 rounded bg-black/60 backdrop-blur-md border border-white/10 text-purple-300 font-bold">
                    DRS {circuit.drsZones}区間
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-3.5 flex flex-col justify-between flex-1 gap-2.5">
                <div className="space-y-2">
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-red-400 transition-colors leading-snug">
                      {circuit.name}
                    </h3>
                    <p className="text-[10px] text-slate-400 font-mono truncate mt-0.5">
                      {circuit.officialName}
                    </p>
                  </div>

                  {/* Circuit Specs Badges */}
                  <div className="grid grid-cols-3 gap-1.5 bg-slate-950/60 p-2 rounded-xl border border-white/5 text-center text-[10px] font-mono">
                    <div>
                      <span className="text-slate-500 block text-[9px]">DF要求</span>
                      <strong className="text-slate-200">{circuit.downforceLevel}</strong>
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
                      <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                        ⚡ 超高速パワー
                      </span>
                    )}
                    {chars.includes('STREET') && (
                      <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20">
                        🏙️ 市街地ストリート
                      </span>
                    )}
                    {chars.includes('TECHNICAL') && (
                      <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                        🌀 高DFテクニカル
                      </span>
                    )}
                  </div>

                  {/* Characteristics snippet */}
                  <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed bg-slate-900/50 p-2 rounded-lg border border-white/5">
                    {circuit.characteristics.replace(/\[\d+\]/g, '').replace(/\\n/g, ' ')}
                  </p>

                  {/* Weather Pill */}
                  {weather && (
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-300 bg-white/[0.03] px-2 py-1 rounded-lg border border-white/5">
                      <span className="flex items-center gap-1">
                        <span>{weather.weatherIcon}</span>
                        <span>{weather.airTempC}℃</span>
                        <span className="text-amber-400">/ 路面{weather.trackTempC}℃</span>
                      </span>
                      <span className={weather.rainProb > 30 ? 'text-sky-400 font-bold' : 'text-slate-400'}>
                        ☔ {weather.rainProb}%
                      </span>
                    </div>
                  )}

                  {/* Lap Record Snippet */}
                  <div className="text-[10px] font-mono text-slate-400 flex items-center justify-between gap-1 bg-slate-950/40 px-2 py-1 rounded-lg border border-white/5">
                    <span className="whitespace-nowrap shrink-0">⏱️ レコード:</span>
                    <span className="text-amber-300 font-bold text-right text-[10.5px] truncate">
                      {circuit.lapRecord.time} <span className="text-slate-400 font-normal">({circuit.lapRecord.driver})</span>
                    </span>
                  </div>
                </div>

                {/* Card Footer with Quick Links + Telemetry CTA + Details */}
                <div className="flex items-center justify-between pt-2.5 border-t border-white/5 text-[11px] font-mono text-slate-400 gap-2">
                  <div className="flex items-center gap-1.5 flex-wrap min-w-0">
                    <span className="text-[10px] text-slate-400 shrink-0 font-bold">
                      {circuit.turns} ターン
                    </span>
                    {circuit.officialLinks?.website && (
                      <a
                        href={circuit.officialLinks.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-sky-300 border border-white/10 text-[9.5px] font-mono transition-all"
                        title={`${circuit.name} 公式Webサイト`}
                      >
                        <span>🌐</span>
                        <span>公式</span>
                        <span className="text-[8px]">↗</span>
                      </a>
                    )}
                    {circuit.officialLinks?.f1Official && (
                      <a
                        href={circuit.officialLinks.f1Official}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-red-300 border border-white/10 text-[9.5px] font-mono transition-all"
                        title={`${circuit.name} F1.com公式ガイド`}
                      >
                        <span className="text-red-500 font-bold text-[8.5px]">F1</span>
                        <span className="text-[8px]">↗</span>
                      </a>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {onNavigateToTelemetry && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (circuit.telemetrySession) {
                            onNavigateToTelemetry(circuit.telemetrySession);
                          } else {
                            onNavigateToTelemetry({ year: 2024, meetingName: circuit.name });
                          }
                        }}
                        className="px-2 py-1 rounded-lg bg-red-600/20 hover:bg-red-600/40 text-red-300 border border-red-500/30 text-[10px] font-racing font-bold flex items-center gap-1 transition-all cursor-pointer"
                        title="テレメトリーへジャンプ"
                      >
                        <span>📊</span>
                        <span>テレメトリー</span>
                      </button>
                    )}
                    <span className="text-red-400 group-hover:underline flex items-center gap-0.5 font-bold text-[11px] shrink-0">
                      <span>詳細</span>
                      <span>➔</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
