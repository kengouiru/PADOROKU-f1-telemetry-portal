'use client';

/**
 * components/hubs/CircuitsHub.tsx
 * Circuits Hub with Region & Characteristics Quick Filter Pills,
 * Search Filter, Result Counter, Reset Action, and Detail Modal.
 */

import React, { useState, useMemo } from 'react';
import {
  KNOWLEDGE_CIRCUITS,
  type CircuitProfile,
  type TelemetryTarget,
} from '@/data/f1KnowledgeData';
import CircuitDetailModal from './CircuitDetailModal';

export type CircuitRegion = 'ALL' | 'EUROPE' | 'ASIA_ME' | 'AMERICAS' | 'OCEANIA';
export type CircuitCharacteristic = 'ALL' | 'POWER' | 'STREET' | 'TECHNICAL';

export interface CircuitsHubProps {
  searchQuery?: string;
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
  onClearSearch,
  onSearchChange,
  onNavigateToTelemetry,
}: CircuitsHubProps) {
  const [regionFilter, setRegionFilter] = useState<CircuitRegion>('ALL');
  const [characteristicFilter, setCharacteristicFilter] = useState<CircuitCharacteristic>('ALL');
  const [selectedCircuitDetail, setSelectedCircuitDetail] = useState<CircuitProfile | null>(null);

  const filteredCircuits = useMemo(() => {
    return KNOWLEDGE_CIRCUITS.filter((c) => {
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
      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          c.name.toLowerCase().includes(q) ||
          c.country.toLowerCase().includes(q) ||
          c.officialName.toLowerCase().includes(q) ||
          c.characteristics.toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    });
  }, [regionFilter, characteristicFilter, searchQuery]);

  const isFiltered =
    regionFilter !== 'ALL' ||
    characteristicFilter !== 'ALL' ||
    searchQuery.trim() !== '';

  const handleResetFilters = () => {
    setRegionFilter('ALL');
    setCharacteristicFilter('ALL');
    if (onClearSearch) {
      onClearSearch();
    }
  };

  return (
    <div className="flex flex-col gap-4 animate-fade-in">
      {/* ── Filter Bar Section ── */}
      <div className="bg-slate-950/70 border border-white/10 rounded-2xl p-4 shadow-lg flex flex-col gap-3.5">
        {/* Top Controls: Region Pills & Summary Badge */}
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
                  className={`px-3 py-1.5 rounded-xl text-xs font-racing font-bold transition-all flex items-center gap-1.5 border shadow-sm ${
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

          {/* Result Count & Reset Button */}
          <div className="flex items-center gap-2 self-end md:self-auto flex-shrink-0">
            <span className="text-xs font-mono font-bold bg-slate-900 px-3 py-1.5 rounded-xl border border-white/10 text-sky-400">
              該当件数:{' '}
              <strong className="text-white text-sm">
                {filteredCircuits.length}
              </strong>{' '}
              / {KNOWLEDGE_CIRCUITS.length} 件
            </span>

            {isFiltered && (
              <button
                onClick={handleResetFilters}
                className="text-xs font-mono font-bold bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 px-3 py-1.5 rounded-xl transition-all flex items-center gap-1 shadow-sm active:scale-95"
                title="すべての絞り込みを解除"
              >
                <span>✕</span>
                <span>リセット</span>
              </button>
            )}
          </div>
        </div>

        {/* Bottom Controls: Characteristic Pills & Active Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-racing font-bold text-slate-400 uppercase tracking-wider mr-1 flex items-center gap-1">
              <span>🏎️</span>
              <span>特性:</span>
            </span>
            {CHARACTERISTIC_OPTIONS.map((opt) => {
              const active = characteristicFilter === opt.key;
              return (
                <button
                  key={opt.key}
                  onClick={() => setCharacteristicFilter(opt.key)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-racing font-bold transition-all flex items-center gap-1.5 border shadow-sm ${
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

          {/* Quick Active Filter Indicator */}
          <div className="text-[11px] font-mono text-slate-500 hidden lg:block">
            {regionFilter !== 'ALL' && (
              <span className="mr-2 text-sky-300">
                地域: {REGION_OPTIONS.find((r) => r.key === regionFilter)?.label}
              </span>
            )}
            {characteristicFilter !== 'ALL' && (
              <span className="text-purple-300">
                特性: {CHARACTERISTIC_OPTIONS.find((c) => c.key === characteristicFilter)?.label}
              </span>
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
            className="mt-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-racing font-bold transition-all shadow-md"
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
                  <span className="text-[11px] font-mono font-bold text-sky-400 bg-sky-950/60 border border-sky-500/30 px-2 py-0.5 rounded-md flex-shrink-0">
                    {circuit.lengthKm} km
                  </span>
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
