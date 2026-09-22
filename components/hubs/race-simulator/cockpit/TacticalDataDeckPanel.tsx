'use client';

/**
 * components/hubs/race-simulator/cockpit/TacticalDataDeckPanel.tsx
 * Column 3 (Center-Right): Tactical Data Deck (Pit Exit, Weather & Telemetry)
 */

import React from 'react';
import {
  Maximize2,
  HelpCircle,
  Radio,
  Volume2,
  VolumeX,
  Wind,
  TrendingDown,
  Gauge,
  Flame,
  CloudRain,
  Crosshair,
} from 'lucide-react';
import {
  TYRE_PROPERTIES,
  playF1RadioChirp,
  type ChallengeScenario,
  type SimSnapshot,
  type EnginePUMode,
} from '@/lib/raceSimulationEngine';
import type { PitwallMonitor } from '../types';
import type { HelpCardType } from './TrackMapAndWeatherDeck';

export type LiveFeedFilterType = 'all' | 'radio' | 'incident' | 'overtake' | 'broadcast';

export interface LiveTelemetryData {
  tyres: {
    FL: { surf: number; core: number };
    FR: { surf: number; core: number };
    RL: { surf: number; core: number };
    RR: { surf: number; core: number };
  };
  brakeTemp: number;
  ersBatterySoc: number;
  waterDepthMm: number;
  liveSpeedKmH: number;
  puMode: EnginePUMode;
  ersDeployStatus: string;
}

export interface TacticalDataDeckPanelProps {
  mobileConsoleView: 'tower' | 'monitor' | 'comms';
  activeMonitor: PitwallMonitor;
  setActiveMonitor: (monitor: PitwallMonitor) => void;
  filteredFeed: NonNullable<SimSnapshot['commentaryFeed']>;
  onOpenAiStrategist?: () => void;
  radioAudioEnabled: boolean;
  setRadioAudioEnabled: (enabled: boolean) => void;
  liveFeedFilter: LiveFeedFilterType;
  setLiveFeedFilter: (filter: LiveFeedFilterType) => void;
  activeHelpCard: HelpCardType;
  setActiveHelpCard: React.Dispatch<React.SetStateAction<HelpCardType>>;
  hoveredHelpCard: HelpCardType;
  setHoveredHelpCard: (card: HelpCardType) => void;
  onNavigateToLibrary?: (subTab: string, termId?: string) => void;
  playerCar?: SimSnapshot['cars'][0];
  liveTelemetry: LiveTelemetryData | null;
  currentSnapshot?: SimSnapshot | null;
  activeScenario: ChallengeScenario;
  challengeLap: number;
  ersBoostUsedThisLap: boolean;
  activePuMode: EnginePUMode;
  pitExitTraffic: {
    predictedExitPosition: number;
    trafficStatus: 'CLEAN_AIR' | 'IN_TRAFFIC' | 'CAUTION';
    gapAheadSeconds: number;
    aheadCarCode?: string;
    gapBehindSeconds?: number;
    behindCarCode?: string;
    pitLossSeconds: number;
  };
}

export const TacticalDataDeckPanel: React.FC<TacticalDataDeckPanelProps> = ({
  mobileConsoleView,
  activeMonitor,
  setActiveMonitor,
  filteredFeed,
  onOpenAiStrategist,
  radioAudioEnabled,
  setRadioAudioEnabled,
  liveFeedFilter,
  setLiveFeedFilter,
  activeHelpCard,
  setActiveHelpCard,
  hoveredHelpCard,
  setHoveredHelpCard,
  onNavigateToLibrary,
  playerCar,
  liveTelemetry,
  currentSnapshot,
  activeScenario,
  challengeLap,
  ersBoostUsedThisLap,
  activePuMode,
  pitExitTraffic,
}) => {
  return (
        <div className={`w-full min-w-0 space-y-2.5 ${mobileConsoleView === 'monitor' ? 'block' : 'hidden lg:block'}`}>
          {/* Back button only when a monitor is maximized */}
          {activeMonitor !== 'all' && (
            <div className="flex items-center justify-between bg-slate-950/90 p-1.5 rounded-xl border border-white/10 shadow-sm">
              <button
                type="button"
                onClick={() => setActiveMonitor('all')}
                className="btn-console text-[10px] font-mono text-cyan-300 hover:text-white py-1 px-2 border-cyan-500/30 flex items-center gap-1 cursor-pointer"
              >
                ◀ 全データ表示に戻る
              </button>
            </div>
          )}

          {/* Active Data Display Area */}
          <div className="space-y-2.5">
            {/* ── INTEGRATED TACTICAL DATA (Default: Traffic, Weather, and Telemetry All Visible) ── */}
            {(activeMonitor === 'all' || activeMonitor === 'track') && (
              <div className="space-y-2.5">
                {/* 1. LIVE RACE FEED & TEAM RADIO (Positioned side-by-side with MISSION CONTROL INTEL in Column 4) */}
                <div className="glass-card-premium p-2.5 sm:p-3 rounded-2xl border border-white/10 shadow-lg backdrop-blur-md flex flex-col h-[388px]">
                  <div className="flex flex-wrap items-center justify-between gap-1.5 pb-2 border-b border-white/10 shrink-0">
                    <div className="flex items-center gap-2">
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
                      </span>
                      <span className="font-racing text-xs font-bold text-white flex items-center gap-1 tracking-wider">
                        <Radio className="w-3.5 h-3.5 text-rose-400" /> LIVE RACE &amp; RADIO
                      </span>
                      <span className="text-[9px] font-mono text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded border border-white/10">
                        L{challengeLap}/{activeScenario.totalLaps}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      {/* AI Strategist Trigger */}
                      {onOpenAiStrategist && (
                        <button
                          type="button"
                          onClick={onOpenAiStrategist}
                          className="p-1 px-1.5 rounded-lg border text-[10px] bg-sky-950/40 border-sky-500/30 text-sky-300 hover:text-white hover:border-sky-400 flex items-center gap-1 transition-all cursor-pointer"
                          title="AI STRATEGY (AIストラテジスト軍師を開く)"
                        >
                          <span className="text-[10px]">🤖</span>
                          <span className="font-racing font-bold text-[9px] hidden sm:inline">AI</span>
                        </button>
                      )}

                      {/* Audio Toggle */}
                      <button
                        type="button"
                        onClick={() => {
                          const next = !radioAudioEnabled;
                          setRadioAudioEnabled(next);
                          if (next) playF1RadioChirp();
                        }}
                        className={`p-1 rounded-lg border text-[10px] transition-all cursor-pointer ${
                          radioAudioEnabled
                            ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300'
                            : 'bg-slate-900 border-white/10 text-slate-500'
                        }`}
                        title={radioAudioEnabled ? '無線音: ON' : '無線音: 消音中'}
                      >
                        {radioAudioEnabled ? <Volume2 className="w-3 h-3 text-slate-200" /> : <VolumeX className="w-3 h-3 text-slate-500" />}
                      </button>

                      {/* Filter Chips */}
                      <div className="flex items-center bg-slate-900/90 p-0.5 rounded-lg border border-white/10 text-[8.5px] font-racing">
                        {(['all', 'radio', 'incident', 'overtake', 'broadcast'] as const).map((filter) => (
                          <button
                            key={filter}
                            type="button"
                            onClick={() => setLiveFeedFilter(filter)}
                            className={`px-1.5 py-0.5 rounded font-bold transition-all cursor-pointer ${
                              liveFeedFilter === filter
                                ? 'bg-slate-700 text-white border border-white/20 shadow-sm'
                                : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            {filter === 'all'
                              ? 'ALL'
                              : filter === 'radio'
                              ? '📻 無線'
                              : filter === 'incident'
                              ? '⚠️ 警告'
                              : filter === 'overtake'
                              ? '⚔️ 追越'
                              : '🏁 FIA'}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Streaming Feed List */}
                  <div className="space-y-1.5 overflow-y-auto pr-1 flex-1 min-h-0 pt-1.5">
                    {filteredFeed.length === 0 ? (
                      <div className="py-4 text-center text-xs font-mono text-slate-500">
                        交信・実況ログはありません
                      </div>
                    ) : (
                      filteredFeed.map((msg, idx) => {
                        const isLatest = idx === 0;
                        const isRadio = msg.type === 'radio';
                        const isIncident = msg.type === 'incident';
                        const isOvertake = msg.type === 'overtake';

                        return (
                          <div
                            key={msg.id}
                            className={`p-2 sm:p-2.5 rounded-xl transition-all border ${
                              isIncident
                                ? 'border-white/10 border-l-[3px] border-l-rose-500 bg-slate-900/90'
                                : isRadio
                                ? 'border-white/10 border-l-[3px] border-l-amber-400 bg-slate-900/90'
                                : isOvertake
                                ? 'border-white/10 border-l-[3px] border-l-sky-400 bg-slate-900/90'
                                : 'border-white/10 border-l-[3px] border-l-slate-400 bg-slate-900/90'
                            } ${isLatest ? 'ring-1 ring-white/20 shadow-md' : 'hover:border-white/20'}`}
                          >
                            <div className="flex items-center justify-between mb-1 text-[9px] font-racing">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span
                                  className={`px-1.5 py-0.2 rounded font-mono font-bold uppercase tracking-wider text-[8px] ${
                                    isIncident
                                      ? 'bg-rose-950 text-rose-300 border border-rose-500/40'
                                      : isRadio
                                      ? 'bg-amber-950 text-amber-300 border border-amber-500/40'
                                      : isOvertake
                                      ? 'bg-sky-950 text-sky-300 border border-sky-500/40'
                                      : 'bg-slate-800 text-slate-300 border border-white/10'
                                  }`}
                                >
                                  {isIncident
                                    ? '⚠️ INCIDENT'
                                    : isRadio
                                    ? '📻 RADIO'
                                    : isOvertake
                                    ? '⚔️ OVERTAKE'
                                    : '🏁 FIA BROADCAST'}
                                </span>
                                <span className="font-racing font-bold text-white text-[11px]">{msg.speaker}</span>
                                {isLatest && (
                                  <span className="px-1 py-0.2 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[7.5px] font-mono font-bold animate-pulse">
                                    LATEST
                                  </span>
                                )}
                              </div>
                              <span className="text-slate-400 font-mono text-[9px]">L{msg.lap}</span>
                            </div>
                            <div className={`text-xs font-sans leading-relaxed ${isRadio ? 'text-amber-100/90 italic font-medium' : 'text-slate-100'}`}>
                              {msg.text}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* 2. Bottom Deck: CAR TELEMETRY & 4-TYRE THERMALS (Compact & Actionable) */}
                <div className={`glass-card-premium p-2 sm:p-2.5 rounded-xl border border-white/10 space-y-2 transition-all min-h-[238px] flex flex-col justify-between ${
                  activeHelpCard === 'telemetry' || hoveredHelpCard === 'telemetry' ? 'relative z-50' : 'relative z-0 hover:z-30'
                }`}>
                  <div className="flex items-center justify-between gap-1 overflow-visible">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <Flame className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span className="font-racing text-xs font-bold text-white truncate" title="CAR TELEMETRY & TYRE THERMALS">
                        CAR TELEMETRY
                      </span>
                      {/* Help button (shrink-0 ensures it is NEVER pushed off or hidden) */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveHelpCard(activeHelpCard === 'telemetry' ? null : 'telemetry');
                        }}
                        onMouseEnter={() => setHoveredHelpCard('telemetry')}
                        onMouseLeave={() => setHoveredHelpCard(null)}
                        className={`w-3.5 h-3.5 rounded-full border text-[9px] font-mono font-bold flex items-center justify-center transition-all shadow-sm shrink-0 ${
                          activeHelpCard === 'telemetry' || hoveredHelpCard === 'telemetry'
                            ? 'bg-amber-400 text-slate-950 border-amber-300 ring-2 ring-amber-400/50'
                            : 'bg-slate-800 hover:bg-amber-950 border-white/20 hover:border-amber-400 text-slate-400 hover:text-amber-300'
                        }`}
                        title="クリックで解説を固定表示 / ホバーで確認"
                      >
                        ?
                      </button>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      {(() => {
                        const tyreCodes = ['FL', 'FR', 'RL', 'RR'] as const;
                        const surfs = tyreCodes.map((code) =>
                          liveTelemetry?.tyres[code]?.surf ?? playerCar?.tyreSurfaceTemp ?? 100
                        );
                        const maxSurf = Math.max(...surfs);
                        const minSurf = Math.min(...surfs);
                        const isBlistering = maxSurf > 125 || (playerCar?.thermalWarning === 'BLISTERING_WARNING' && maxSurf >= 120);
                        const isGraining = !isBlistering && (minSurf < 88 || playerCar?.thermalWarning === 'GRAINING_RISK');
                        return (
                          <span
                            className={`px-1.5 py-0.2 rounded-full text-[8.5px] font-mono font-bold whitespace-nowrap shrink-0 ${
                              isBlistering
                                ? 'bg-red-950 text-red-300 border border-red-500/40 animate-pulse'
                                : isGraining
                                ? 'bg-amber-950 text-amber-300 border border-amber-500/40'
                                : 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                            }`}
                          >
                            {isBlistering
                              ? '🔴 BLISTERING'
                              : isGraining
                              ? '🟡 GRAINING'
                              : '🟢 OPTIMAL'}
                          </span>
                        );
                      })()}
                      <button
                        type="button"
                        onClick={() => setActiveMonitor('thermals')}
                        className="p-0.5 rounded text-slate-400 hover:text-white hover:bg-slate-800 shrink-0"
                        title="拡大フォーカス"
                      >
                        <Maximize2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* 4 Tyre Cards with Surface vs Core Temps (Live Real-time Dynamic Feedback) */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                    {[
                      { code: 'FL' as const, label: '前左' },
                      { code: 'FR' as const, label: '前右' },
                      { code: 'RL' as const, label: '後左' },
                      { code: 'RR' as const, label: '後右' },
                    ].map((tyre) => {
                      const liveData = liveTelemetry?.tyres[tyre.code];
                      const surf = liveData ? liveData.surf : (playerCar?.tyreSurfaceTemp || 100);
                      const core = liveData ? liveData.core : (playerCar?.tyreCoreTemp || 98);
                      const isOverheat = surf > 125;
                      const isCold = surf < 88;
                      return (
                        <div
                          key={tyre.code}
                          className={`p-1.5 sm:p-2 rounded-xl border transition-all ${
                            isOverheat
                              ? 'border-red-500/60 bg-red-950/20'
                              : isCold
                              ? 'border-cyan-500/60 bg-cyan-950/20'
                              : 'border-white/10 bg-slate-900/90'
                          }`}
                        >
                          <div className="flex justify-between items-center pb-1 border-b border-white/10">
                            <div className="flex items-baseline gap-1 min-w-0">
                              <span className="font-racing font-bold text-white text-[11px] leading-none">{tyre.code}</span>
                              <span className="text-[8px] text-slate-400 font-mono leading-none">({tyre.label})</span>
                            </div>
                            <span
                              className={`px-1 py-0.2 rounded text-[7.5px] font-bold shrink-0 ${
                                isOverheat
                                  ? 'bg-red-600 text-white animate-pulse'
                                  : isCold
                                  ? 'bg-cyan-600 text-white'
                                  : 'bg-emerald-600 text-white'
                              }`}
                            >
                              {isOverheat ? 'HOT' : isCold ? 'COLD' : 'OPT'}
                            </span>
                          </div>
                          <div className="mt-1 space-y-0.5 text-[10px] sm:text-[10.5px] font-mono leading-tight">
                            <div className="flex justify-between items-center">
                              <span className="text-slate-400 text-[9.5px]">表面:</span>
                              <span className={`font-bold transition-all ${isOverheat ? 'text-red-400' : isCold ? 'text-cyan-400' : 'text-emerald-400'}`}>
                                {surf.toFixed(0)}°C
                              </span>
                            </div>
                            <div className="flex justify-between items-center text-slate-300">
                              <span className="text-slate-400 text-[9.5px]">内部:</span>
                              <span className="font-bold">{core.toFixed(0)}°C</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Aero Wake (Dirty Air) & Tyre Degradation Metrics */}
                  {(() => {
                    const gapAhead = playerCar?.gapToAhead ?? 99;
                    const isLeader = playerCar?.position === 1;
                    const isDirtyAir = !isLeader && gapAhead > 0 && gapAhead <= 1.2;
                    const downforceLossPercent = isDirtyAir ? Math.min(24, Math.max(12, Math.round(15 + (1.2 - gapAhead) * 10))) : 0;

                    const compound = playerCar?.tyreCompound || 'MEDIUM';
                    const baseDegMap: Record<string, number> = {
                      SOFT: 0.18,
                      MEDIUM: 0.12,
                      HARD: 0.08,
                      INTER: 0.15,
                      WET: 0.14,
                    };
                    const baseDeg = baseDegMap[compound] || 0.12;
                    const ageFactor = 1 + (playerCar?.tyreAge || 0) * 0.035;
                    const tempFactor = (playerCar?.tyreSurfaceTemp || 100) > 125 ? 1.4 : 1.0;
                    const degRatePerLap = (baseDeg * ageFactor * tempFactor).toFixed(2);

                    const wearPerLapMap: Record<string, number> = {
                      SOFT: 4.8,
                      MEDIUM: 3.2,
                      HARD: 2.2,
                      INTER: 3.5,
                      WET: 3.0,
                    };
                    const wearRate = wearPerLapMap[compound] || 3.0;
                    const currentWear = playerCar?.tyreWearPercent || 15;
                    const lapsToCliff = Math.max(0, Math.round((75 - currentWear) / wearRate));
                    const isAtCliff = currentWear >= 75;

                    return (
                      <div className="p-1.5 rounded-xl bg-slate-950/80 border border-white/10 text-xs font-mono space-y-1">
                        {/* Row 1: Aero Wake / Dirty Air */}
                        <div className="flex items-center justify-between text-[10px]">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <Wind className={`w-3.5 h-3.5 shrink-0 ${isDirtyAir ? 'text-amber-400 animate-pulse' : 'text-sky-400'}`} />
                            <span className="text-slate-400 shrink-0">空力気流:</span>
                            <span
                              className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                                isDirtyAir
                                  ? 'bg-amber-950 text-amber-300 border border-amber-500/50'
                                  : 'bg-emerald-950 text-emerald-300 border border-emerald-500/50'
                              }`}
                              title={isDirtyAir ? `前走車直後（${gapAhead.toFixed(1)}s）の乱気流によりダウンフォースが低下` : '理想的なクリーンエア環境'}
                            >
                              {isDirtyAir ? `⚠️ DIRTY AIR (-${downforceLossPercent}% DF)` : '🟢 CLEAN AIR (理想空力)'}
                            </span>
                          </div>
                          <span className="text-[9px] text-slate-400 font-mono shrink-0 ml-1">
                            {isDirtyAir ? `前走差 +${gapAhead.toFixed(1)}s` : isLeader ? '首位独走' : `前走差 +${gapAhead.toFixed(1)}s`}
                          </span>
                        </div>

                        {/* Row 2: Tyre Degradation & Cliff Prediction */}
                        <div className="flex items-center justify-between text-[10px] pt-1 border-t border-white/5">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <TrendingDown className={`w-3.5 h-3.5 shrink-0 ${isAtCliff ? 'text-red-400' : 'text-amber-400'}`} />
                            <span className="text-slate-400 shrink-0">デグラデーション:</span>
                            <span className="font-mono font-bold text-white text-[10.5px] shrink-0">
                              +{degRatePerLap}s<span className="text-[8.5px] text-slate-400">/周</span>
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0 ml-1">
                            <span className="text-[9.5px] text-slate-400">クリフ:</span>
                            <span
                              className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                                isAtCliff
                                  ? 'bg-red-950 text-red-300 border border-red-500/80 animate-pulse'
                                  : lapsToCliff <= 2
                                  ? 'bg-amber-950 text-amber-300 border border-amber-500/50'
                                  : 'bg-slate-800 text-emerald-300'
                              }`}
                              title={isAtCliff ? 'タイヤ性能が急激に失われるクリフに突入。直ちにBOX推奨' : `摩耗75%のクリフまであと約${lapsToCliff}周`}
                            >
                              {isAtCliff ? '🚨 限界 (要BOX)' : `約 ${lapsToCliff} 周`}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  {/* 5 Sub-system Telemetry Readouts with Live Speedometer and PU Flow */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 pt-0.5">
                    {/* 1. Live Speedometer */}
                    <div className="p-1.5 sm:p-2 rounded-xl bg-slate-900/90 border border-white/10 flex flex-col justify-between">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold text-slate-400">SPEED</span>
                        <span className="text-[8.5px] font-mono font-bold text-cyan-400 animate-pulse">● LIVE</span>
                      </div>
                      <div className="flex items-baseline gap-1 mt-0.5">
                        <span className="font-racing font-bold text-sm sm:text-base text-white">
                          {liveTelemetry?.liveSpeedKmH ?? 285}
                        </span>
                        <span className="text-[9px] text-slate-400 font-mono">km/h</span>
                      </div>
                      <div className="mt-0.5 text-[8.5px] sm:text-[9px] font-mono whitespace-nowrap overflow-hidden">
                        {ersBoostUsedThisLap ? (
                          <span className="text-cyan-300 font-bold animate-pulse">🔥 BOOST</span>
                        ) : (activePuMode || playerCar?.puMode) === 'push' ? (
                          <span className="text-rose-400 font-bold">⚡ PUSH +12</span>
                        ) : (activePuMode || playerCar?.puMode) === 'conserve' ? (
                          <span className="text-emerald-400 font-bold">🌱 L&amp;C -10</span>
                        ) : (
                          <span className="text-slate-400">STD ペース</span>
                        )}
                      </div>
                    </div>

                    {/* 2. PU Mode & Energy Flow Status */}
                    <div className="p-1.5 sm:p-2 rounded-xl bg-slate-900/90 border border-white/10 flex flex-col justify-between">
                      <span className="text-[10px] font-mono font-bold text-slate-400">PU MODE</span>
                      <div className="flex items-baseline gap-1 mt-0.5">
                        <span
                          className={`font-racing font-bold text-sm sm:text-base ${
                            (activePuMode || playerCar?.puMode) === 'push'
                              ? 'text-rose-400'
                              : (activePuMode || playerCar?.puMode) === 'conserve'
                              ? 'text-emerald-400'
                              : 'text-slate-200'
                          }`}
                        >
                          {(activePuMode || playerCar?.puMode) === 'push'
                            ? '⚡ PUSH'
                            : (activePuMode || playerCar?.puMode) === 'conserve'
                            ? '🌱 SAVE'
                            : 'STD'}
                        </span>
                      </div>
                      <div className="mt-0.5 text-[8.5px] sm:text-[9px] font-mono font-bold text-slate-300 whitespace-nowrap overflow-hidden">
                        {liveTelemetry?.ersDeployStatus || 'BALANCED'}
                      </div>
                    </div>

                    {/* 3. ERS Battery SOC with Flow Rate */}
                    <div className="p-1.5 sm:p-2 rounded-xl bg-slate-900/90 border border-white/10 flex flex-col justify-between">
                      <span className="text-[10px] font-mono font-bold text-slate-400">ERS SOC</span>
                      <div className="flex items-baseline gap-1 mt-0.5">
                        <span className="font-racing font-bold text-sm sm:text-base text-cyan-400 block transition-all">
                          {liveTelemetry?.ersBatterySoc ?? (playerCar?.ersBatterySoc || 85)}%
                        </span>
                      </div>
                      <div className="mt-0.5 text-[8.5px] sm:text-[9px] font-mono whitespace-nowrap overflow-hidden">
                        {(activePuMode || playerCar?.puMode) === 'push' ? (
                          <span className="text-rose-300 font-bold">-18%/周 (消費)</span>
                        ) : (activePuMode || playerCar?.puMode) === 'conserve' ? (
                          <span className="text-emerald-300 font-bold">+22%/周 (充電)</span>
                        ) : (
                          <span className="text-slate-400">±0%/周 (均衡)</span>
                        )}
                      </div>
                    </div>

                    {/* 4. Brake Temp */}
                    <div className="p-1.5 sm:p-2 rounded-xl bg-slate-900/90 border border-white/10 flex flex-col justify-between">
                      <span className="text-[10px] font-mono font-bold text-slate-400">BRAKE</span>
                      <div className="flex items-baseline gap-1 mt-0.5">
                        <span
                          className={`font-racing font-bold text-sm sm:text-base block transition-all ${
                            (liveTelemetry?.brakeTemp ?? (playerCar?.brakeTemp || 540)) > 620
                              ? 'text-red-400'
                              : (liveTelemetry?.brakeTemp ?? (playerCar?.brakeTemp || 540)) > 550
                              ? 'text-amber-400'
                              : 'text-emerald-400'
                          }`}
                        >
                          {liveTelemetry?.brakeTemp ?? (playerCar?.brakeTemp || 540)}°C
                        </span>
                      </div>
                      <span className="text-[8.5px] sm:text-[9px] font-mono text-slate-400 block mt-0.5 whitespace-nowrap overflow-hidden">
                        適正 400-650°C
                      </span>
                    </div>

                    {/* 5. Fuel & Confidence */}
                    <div className="p-1.5 sm:p-2 rounded-xl bg-slate-900/90 border border-white/10 col-span-2 sm:col-span-1 flex flex-col justify-between">
                      <span className="text-[10px] font-mono font-bold text-slate-400">FUEL</span>
                      <div className="flex items-baseline gap-1 mt-0.5">
                        <span className="font-racing font-bold text-sm sm:text-base text-emerald-400">
                          {playerCar?.fuelRemainingKg || 25.0}
                        </span>
                        <span className="text-[9px] text-slate-400 font-mono">kg</span>
                      </div>
                      <span className="text-[8.5px] sm:text-[9px] font-mono text-slate-300 block mt-0.5 whitespace-nowrap overflow-hidden">
                        信頼度 {playerCar?.driverConfidence || 90}%
                      </span>
                    </div>
                  </div>

                  {/* Popover overlay for Telemetry: positioned relative to card, elevated to z-50, expands upwards from bottom-2 */}
                  {(activeHelpCard === 'telemetry' || hoveredHelpCard === 'telemetry') && (
                    <div
                      style={{ backgroundColor: '#020617' }}
                      className="absolute inset-x-1 bottom-2 p-3 rounded-2xl bg-slate-950 border border-amber-500/80 shadow-[0_25px_60px_rgba(0,0,0,1)] z-50 text-left max-h-[380px] overflow-y-auto scrollbar-thin transition-all duration-150 animate-in fade-in zoom-in-95 ring-1 ring-amber-500/50"
                      onMouseEnter={() => setHoveredHelpCard('telemetry')}
                      onMouseLeave={() => setHoveredHelpCard(null)}
                    >
                      <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-white/10">
                        <div className="flex items-center gap-1.5">
                          <HelpCircle className="w-4 h-4 text-amber-400" />
                          <span className="font-racing text-xs font-bold text-amber-300">TELEMETRY &amp; THERMALS 戦術判断ガイド</span>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveHelpCard(null);
                            setHoveredHelpCard(null);
                          }}
                          className="text-slate-400 hover:text-white text-xs px-1.5 py-0.5 rounded hover:bg-slate-800"
                          title="閉じる"
                        >
                          ✕
                        </button>
                      </div>
                      <div className="space-y-2 text-[10px] text-slate-300 leading-relaxed">
                        <div>
                          <div className="font-bold text-amber-300 flex items-center gap-1 mb-0.5">
                            <span>🎯</span> <span>このデータは何を見るのか？</span>
                          </div>
                          <p className="text-slate-400">
                            4輪タイヤの「表面温度」と「内部温度」、およびブレーキ・ERS（電気エネルギー）・燃料の健全性をリアルタイムに監視する計器です。
                          </p>
                        </div>

                        <div>
                          <div className="font-bold text-emerald-300 flex items-center gap-1 mb-0.5">
                            <span>📊</span> <span>各指標の見方と判断基準</span>
                          </div>
                          <ul className="space-y-1 text-slate-400">
                            <li>
                              <strong className="text-emerald-300">・88°C 〜 125°C【OPT (最適作動域)】:</strong> タイヤのゴムが路面に最も食いつく状態。全力アタックやオーバーテイクが可能です。
                            </li>
                            <li>
                              <strong className="text-red-400">・125°C 超【HOT (過熱警告・ブリスターリスク)】:</strong> 表面が溶け始め、熱ダレ（Overheating）でグリップが急低下。ゴム内部に気泡が生じる「ブリスター」が発生しタイヤ寿命が削られます。直ちにペースを落とし、スライドを抑えて冷却が必要です。
                            </li>
                            <li>
                              <strong className="text-cyan-300">・88°C 未満【COLD (温度低下・グレイニングリスク)】:</strong> 冷えたゴムが路面に引き裂かれ、表面がささくれ立つ「グレイニング」が発生。アンダーステアやロックアップが多発します。
                            </li>
                            <li>
                              <strong className="text-amber-300">・💨 ダーティエア (DIRTY AIR / 乱流):</strong> 前走車の1.2秒以内を追従すると、前走車の乱気流によりダウンフォースが約15〜22%低下。前輪が滑りやすくなり表面温度が急上昇します。オーバーテイクを仕掛ける時以外は、少し間隔（1.5秒以上）を空けてクリーンエアを吸わせるか、直ちに <span className="text-purple-300 font-bold">ERS BOOST</span> を使って一気に抜き去る判断が必要です。
                            </li>
                            <li>
                              <strong className="text-sky-300">・📉 デグラデーション (秒/周) ＆ クリフ:</strong> タイヤゴムの摩耗に伴う1周あたりのペース低下値。摩耗率が約75%に達すると「クリフ（崖）」に落ち、1周あたり1〜2秒以上急落します。<span className="text-amber-300 font-bold">「クリフまであと2周」</span>に達したら、次周の <span className="text-red-300 font-bold">BOX BOX</span> を準備してください。
                            </li>
                            <li>
                              <strong className="text-cyan-400">・ERS バッテリー SOC (%):</strong> ハイブリッドの蓄電量（0〜100%）。<strong className="text-cyan-200">80%以上</strong>あればストレートで「ERS BOOST」を全開投入してオーバーテイクや防衛が可能。30%以下ならチャージ優先。
                            </li>
                            <li>
                              <strong className="text-amber-300">・ブレーキ温度 (°C):</strong> 400〜800°Cが適正。900°Cを超えるとフェード（制動力喪失）、400°C未満は効きが悪化。
                            </li>
                          </ul>
                        </div>

                        <div className="pt-1 border-t border-white/10">
                          <div className="font-bold text-sky-300 flex items-center gap-1 mb-0.5">
                            <span>⚡</span> <span>推奨アクション</span>
                          </div>
                          <p className="text-slate-300">
                            前走車の直後で <strong className="text-amber-300">DIRTY AIR</strong> ➔ 抜くなら <span className="px-1 py-0.2 rounded bg-purple-950 border border-purple-500/50 text-purple-300 font-mono font-bold">ERS BOOST</span> で即座に仕留める。抜けないなら1.5s離してタイヤ冷却！<br />
                            タイヤが <strong className="text-red-400">HOT</strong> または <strong className="text-red-400">BLISTERING</strong> ➔ PUモードを <span className="px-1 py-0.2 rounded bg-emerald-950 border border-emerald-500/50 text-emerald-300 font-mono font-bold">CONSERVE</span> にしてタイヤ保護・冷却！<br />
                            タイヤ <strong className="text-red-400">CLIFF限界</strong> ➔ 次のタイヤを決めて <span className="px-1 py-0.2 rounded bg-red-900/60 border border-red-500/50 text-white font-mono font-bold">BOX BOX</span>！
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Monitor 1: Pit Exit Traffic Window Radar */}
            {activeMonitor === 'timing' && (
              <div className="glass-card-premium p-3 sm:p-4 rounded-2xl border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-racing text-sm font-bold text-white flex items-center gap-2">
                    <Crosshair className="w-4 h-4 text-cyan-400" /> PIT EXIT WINDOW RADAR
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                      pitExitTraffic.trafficStatus === 'CLEAN_AIR'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                        : pitExitTraffic.trafficStatus === 'CAUTION'
                        ? 'bg-amber-950 text-amber-300 border border-amber-500/40'
                        : 'bg-red-950 text-red-300 border border-red-500/40'
                    }`}
                  >
                    {pitExitTraffic.trafficStatus === 'CLEAN_AIR'
                      ? '🟢 CLEAN AIR (クリアエア)'
                      : pitExitTraffic.trafficStatus === 'CAUTION'
                      ? '🟡 CAUTION (接戦)'
                      : '🔴 IN TRAFFIC (乱気流渋滞)'}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-white/10 space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">想定復帰順位:</span>
                    <span className="font-racing font-bold text-lg text-white">
                      P{pitExitTraffic.predictedExitPosition}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">ピット所要ロス:</span>
                    <span className="font-mono font-bold text-amber-400">
                      {pitExitTraffic.pitLossSeconds}秒 (
                      {currentSnapshot?.isSC ? 'SCチープピット' : '通常ピット'})
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">前走車とのギャップ:</span>
                    <span className="font-mono font-bold text-white">
                      {pitExitTraffic.aheadCarCode
                        ? `+${pitExitTraffic.gapAheadSeconds}s (${pitExitTraffic.aheadCarCode}の後方)`
                        : '前走車なし (首位復帰)'}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">後続車とのギャップ:</span>
                    <span className="font-mono font-bold text-white">
                      {pitExitTraffic.behindCarCode
                        ? `+${pitExitTraffic.gapBehindSeconds}s (${pitExitTraffic.behindCarCode}の前方)`
                        : '後続車なし'}
                    </span>
                  </div>
                </div>

                {/* Tactical Hint */}
                <div className="p-2.5 rounded-xl bg-slate-950/90 border border-white/5 text-[11px] text-slate-300 leading-relaxed">
                  💡 <span className="font-bold text-white">ストラテジストのアドバイス:</span>{' '}
                  {pitExitTraffic.trafficStatus === 'CLEAN_AIR'
                    ? 'ピットアウト後は前後に2秒以上のクリアエアがあります。新品タイヤのアウトラップで爆発的なアンダーカットが期待できます！'
                    : '中団グループのダーティエアに復帰するリスク大。タイヤが熱ダレする恐れがあるため、ステイアウトでオーバーカットを狙う手もあります。'}
                </div>
              </div>
            )}

            {/* MONITOR 2: CAR TELEMETRY & DUAL-LAYER TYRE THERMALS */}
            {activeMonitor === 'thermals' && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {/* 4 Tyre Cards with Surface vs Core Temps */}
                  {[
                    { code: 'FL' as const, label: '前左' },
                    { code: 'FR' as const, label: '前右' },
                    { code: 'RL' as const, label: '後左' },
                    { code: 'RR' as const, label: '後右' },
                  ].map((tyre) => {
                    const liveData = liveTelemetry?.tyres[tyre.code];
                    const surf = liveData ? liveData.surf : (playerCar?.tyreSurfaceTemp || 100);
                    const core = liveData ? liveData.core : (playerCar?.tyreCoreTemp || 98);
                    const isOverheat = surf > 125;
                    const isCold = surf < 88;
                    return (
                      <div
                        key={tyre.code}
                        className={`glass-card-premium p-2.5 sm:p-3 rounded-2xl border ${
                          isOverheat
                            ? 'border-red-500/60 bg-red-950/20'
                            : isCold
                            ? 'border-cyan-500/60 bg-cyan-950/20'
                            : 'border-white/10'
                        }`}
                      >
                        <div className="flex justify-between items-center text-[10px] sm:text-xs text-slate-300 pb-1.5 border-b border-white/10">
                          <div className="flex items-baseline gap-1.5">
                            <span className="font-racing font-bold text-white text-sm leading-none">{tyre.code}</span>
                            <span className="text-[10px] text-slate-400 font-mono leading-none">({tyre.label})</span>
                          </div>
                          <span
                            className={`px-1 py-0.2 rounded text-[9px] font-bold ${
                                isOverheat
                                  ? 'bg-red-600 text-white animate-pulse'
                                  : isCold
                                  ? 'bg-cyan-600 text-white'
                                  : 'bg-emerald-600 text-white'
                              }`}
                            >
                              {isOverheat ? 'OVERHEAT' : isCold ? 'COLD' : 'OPT'}
                            </span>
                          </div>

                          <div className="mt-2 space-y-1 text-xs">
                            <div className="flex justify-between text-[11px]">
                              <span className="text-slate-400">表面温度:</span>
                              <span
                                className={`font-mono font-bold ${
                                  isOverheat
                                    ? 'text-red-400'
                                    : isCold
                                    ? 'text-cyan-400'
                                    : 'text-emerald-400'
                                }`}
                              >
                                {surf.toFixed(0)}°C
                              </span>
                            </div>
                            <div className="flex justify-between text-[11px]">
                              <span className="text-slate-400">内部コア:</span>
                              <span className="font-mono text-slate-300">{core.toFixed(0)}°C</span>
                            </div>
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>

                {/* Sub-system Telemetry Readouts */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-white/10">
                    <span className="text-[10px] font-mono text-slate-400">ブレーキ温度 (4輪)</span>
                    <div className="font-racing font-bold text-base text-amber-400 mt-0.5">
                      {playerCar?.brakeTemp || 540}°C
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-900 border border-white/10">
                    <span className="text-[10px] font-mono text-slate-400">ERS バッテリー SOC</span>
                    <div className="font-racing font-bold text-base text-cyan-400 mt-0.5">
                      {playerCar?.ersBatterySoc || 85}%
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-900 border border-white/10">
                    <span className="text-[10px] font-mono text-slate-400">残燃料搭載量</span>
                    <div className="font-racing font-bold text-base text-emerald-400 mt-0.5">
                      {playerCar?.fuelRemainingKg || 25.0} kg
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-900 border border-white/10">
                    <span className="text-[10px] font-mono text-slate-400">ドライバー信頼度</span>
                    <div className="font-racing font-bold text-base text-white mt-0.5">
                      {playerCar?.driverConfidence || 90}%
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* MONITOR 3: WEATHER, TRACK DRYING & INCIDENT RISK */}
            {activeMonitor === 'weather' && (
              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Doppler Radar */}
                  <div className="glass-card-premium p-3.5 rounded-2xl border border-white/10 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="font-racing text-sm font-bold text-white flex items-center gap-1.5">
                        <CloudRain className="w-4 h-4 text-sky-400" /> DOPPLER RAIN RADAR
                      </span>
                      <span className="px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-500/30 text-[10px] font-mono font-bold uppercase">
                        {currentSnapshot?.rainRadar.intensity || 'DRY'}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-950 border border-white/10 flex flex-col sm:flex-row items-center gap-3">
                      {/* Animated Circular Radar Screen */}
                      <div className="relative w-28 h-28 shrink-0 rounded-full border-2 border-sky-500/30 bg-radial from-sky-950/40 via-slate-950 to-slate-950 overflow-hidden shadow-inner flex items-center justify-center">
                        <div className="absolute inset-1.5 rounded-full border border-sky-500/20 border-dashed" />
                        <div className="absolute inset-4 rounded-full border border-sky-500/25 border-dashed" />
                        <div className="absolute inset-x-0 top-1/2 h-px bg-sky-500/20" />
                        <div className="absolute inset-y-0 left-1/2 w-px bg-sky-500/20" />
                        <span className="absolute top-0.5 text-[7px] font-mono font-bold text-slate-500">N</span>
                        <div className="absolute inset-0 rounded-full animate-[spin_3.5s_linear_infinite] pointer-events-none origin-center opacity-40 bg-[conic-gradient(from_0deg,transparent_0_300deg,rgba(56,189,248,0.4)_360deg)]" />
                        <div className="relative z-10 w-2 h-2 rounded-full bg-red-500 shadow-md shadow-red-500/80 ring-2 ring-red-400 animate-pulse" />
                        {(() => {
                          const radar = currentSnapshot?.rainRadar;
                          if (!radar || radar.distanceKm === undefined) return null;
                          if (radar.distanceKm === 0) {
                            return <div className="absolute inset-2 rounded-full bg-sky-500/20 border-2 border-sky-400/50 animate-ping pointer-events-none" />;
                          }
                          const maxDist = 15;
                          const norm = Math.min(1, radar.distanceKm / maxDist);
                          const radiusPx = 40;
                          const xOffset = -norm * radiusPx * 0.707;
                          const yOffset = norm * radiusPx * 0.707;
                          return (
                            <div
                              className="absolute z-10 flex flex-col items-center justify-center transition-all duration-700"
                              style={{ transform: `translate(${xOffset}px, ${yOffset}px)` }}
                            >
                              <div className="w-4 h-4 rounded-full bg-sky-400/30 border border-sky-400 flex items-center justify-center animate-pulse shadow-sm shadow-sky-400/50">
                                <CloudRain className="w-2.5 h-2.5 text-sky-300" />
                              </div>
                              <span className="text-[7px] font-mono font-bold text-sky-300 whitespace-nowrap bg-slate-900/90 px-1 rounded mt-0.5">
                                {radar.distanceKm}km
                              </span>
                            </div>
                          );
                        })()}
                      </div>

                      {/* Radar Stats */}
                      <div className="flex-1 min-w-0 space-y-1 text-xs w-full">
                        <div className="flex justify-between">
                          <span className="text-slate-400">雨雲距離:</span>
                          <span className="font-mono font-bold text-white">
                            {currentSnapshot?.rainRadar.distanceKm! > 10
                              ? '>10km'
                              : currentSnapshot?.rainRadar.distanceKm === 0
                              ? '頭上 (降雨中)'
                              : `${currentSnapshot?.rainRadar.distanceKm} km`}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">到達予測 (ETA):</span>
                          <span className="font-mono font-bold text-amber-400">
                            {currentSnapshot?.rainRadar.etaMinutes! > 0
                              ? `約${currentSnapshot?.rainRadar.etaMinutes}分後`
                              : currentSnapshot?.rainRadar.distanceKm === 0
                              ? '現在通過中'
                              : '接近中'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">路面水量:</span>
                          <span className="font-mono font-bold text-sky-400">
                            {currentSnapshot?.rainRadar.waterDepthMm} mm
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">路面温度:</span>
                          <span className="font-mono font-bold text-amber-400">
                            {currentSnapshot?.rainRadar.trackTempC || 30}°C
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Compound Crossover Spectrum */}
                  <div className="glass-card-premium p-3.5 rounded-2xl border border-white/10 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="font-racing text-sm font-bold text-white flex items-center gap-1.5">
                        <Gauge className="w-4 h-4 text-emerald-400" /> TYRE CROSSOVER
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        SLICK ⇄ INTER ⇄ WET
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-900 border border-white/10 space-y-2 text-xs">
                      <div>
                        <div className="flex justify-between text-[11px] mb-1 font-mono">
                          <span className="text-slate-400">水深スペクトラム</span>
                          <span className="font-bold text-sky-300">
                            {currentSnapshot?.rainRadar.waterDepthMm.toFixed(1)} mm
                          </span>
                        </div>

                        <div className="relative pt-3 pb-1">
                          {(() => {
                            const depth = currentSnapshot?.rainRadar.waterDepthMm || 0;
                            const maxScale = 5.0;
                            const pct = Math.min(100, Math.max(0, (depth / maxScale) * 100));
                            return (
                              <div
                                className="absolute top-0 -translate-x-1/2 flex flex-col items-center transition-all duration-500 z-10"
                                style={{ left: `${pct}%` }}
                              >
                                <span className="text-[8px] font-mono font-black text-white bg-red-600 px-1 py-0.2 rounded shadow-md ring-1 ring-white/50">
                                  {depth.toFixed(1)}mm
                                </span>
                                <span className="text-red-500 text-[8px] -mt-0.5 leading-none">▼</span>
                              </div>
                            );
                          })()}

                          <div className="w-full h-2.5 rounded-full overflow-hidden flex shadow-inner border border-white/10">
                            <div className="h-full bg-gradient-to-r from-red-500 via-amber-400 to-yellow-300" style={{ width: '16%' }} title="SLICK: 0.0〜0.8mm" />
                            <div className="h-full bg-gradient-to-r from-emerald-500 via-green-400 to-teal-400" style={{ width: '64%' }} title="INTER: 0.8〜4.0mm" />
                            <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-600" style={{ width: '20%' }} title="WET: 4.0mm+" />
                          </div>
                        </div>
                      </div>

                      {/* Strategic Crossover Recommendation */}
                      <div className="p-2 rounded-lg bg-slate-950 border border-white/5 text-[11px] font-mono leading-relaxed text-slate-300">
                        {(() => {
                          const depth = currentSnapshot?.rainRadar.waterDepthMm || 0;
                          const currentTyre = playerCar?.tyreCompound || 'MEDIUM';
                          if (depth > 4.0) {
                            return <p className="text-blue-300 font-bold">🚨 ヘビーウェット（水深4.0mm突破）。フルウェット（🔵 WET）必須。</p>;
                          }
                          if (depth >= 0.8) {
                            if (currentTyre === 'SOFT' || currentTyre === 'MEDIUM' || currentTyre === 'HARD') {
                              return <p className="text-emerald-300 font-bold">⚡ スリックからインターミディエイト（🟢 INTER）への履き替え推奨！</p>;
                            }
                            return <p className="text-emerald-300">🟢 インターミディエイト最適ウィンドウ。安定してラップを刻めます。</p>;
                          }
                          if (depth < 0.8 && depth > 0.3) {
                            if (currentTyre === 'INTER' || currentTyre === 'WET') {
                              return <p className="text-amber-300 font-bold">⚡ スリックタイヤへのクロスオーバー境界。アンダーカット決断の好機！</p>;
                            }
                            return <p className="text-slate-200">☀️ スリックタイヤ適合域。レコードラインは十分なグリップがあります。</p>;
                          }
                          return <p className="text-slate-300">☀️ 完全ドライ。スリックタイヤのグリップが100%発揮されます。</p>;
                        })()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

  );
};

export default TacticalDataDeckPanel;
