'use client';

/**
 * components/hubs/race-simulator/cockpit/TrackMapAndWeatherDeck.tsx
 * Column 2 (Center-Left): Live Circuit GPS Track Radar & Lower Deck (Weather Doppler + Team Orders)
 */

import React from 'react';
import {
  CloudRain,
  HelpCircle,
  Maximize2,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import LiveTrackGpsRadar from '@/components/telemetry/LiveTrackGpsRadar';
import type {
  ChallengeScenario,
  SimSnapshot,
  EnginePUMode,
  TeamOrderType,
} from '@/lib/raceSimulationEngine';
import type { PitwallMonitor, MobileConsoleView } from '../types';

export type HelpCardType = 'weather' | 'pit_exit' | 'telemetry' | null;

export interface TrackMapAndWeatherDeckProps {
  mobileConsoleView: MobileConsoleView;
  activeScenario: ChallengeScenario;
  currentSnapshot?: SimSnapshot | null;
  lapProgressPct: number;
  challengeLap: number;
  challengePlaying: boolean;
  playbackSpeed: number;
  ersBoostUsedThisLap: boolean;
  activePuMode: EnginePUMode;
  setIsFullScreenCockpit: (full: boolean) => void;
  activeHelpCard: HelpCardType;
  setActiveHelpCard: React.Dispatch<React.SetStateAction<HelpCardType>>;
  hoveredHelpCard: HelpCardType;
  setHoveredHelpCard: (card: HelpCardType) => void;
  setActiveMonitor: (monitor: PitwallMonitor) => void;
  onNavigateToLibrary?: (subTab: string, termId?: string) => void;
  teammateCar?: SimSnapshot['cars'][0];
  activeTeamOrder: TeamOrderType;
  handleTeamOrder: (order: TeamOrderType) => void;
}

export const TrackMapAndWeatherDeck: React.FC<TrackMapAndWeatherDeckProps> = ({
  mobileConsoleView,
  activeScenario,
  currentSnapshot,
  lapProgressPct,
  challengeLap,
  challengePlaying,
  playbackSpeed,
  ersBoostUsedThisLap,
  activePuMode,
  setIsFullScreenCockpit,
  activeHelpCard,
  setActiveHelpCard,
  hoveredHelpCard,
  setHoveredHelpCard,
  setActiveMonitor,
  onNavigateToLibrary,
  teammateCar,
  activeTeamOrder,
  handleTeamOrder,
}) => {
  return (
    <div className={`w-full min-w-0 space-y-2.5 ${mobileConsoleView === 'monitor' || mobileConsoleView === 'integrated' ? 'block' : 'hidden lg:block'}`}>
      <LiveTrackGpsRadar
        circuitId={activeScenario.circuit.id}
        circuitName={activeScenario.circuit.name}
        circuitLengthM={5400}
        baseLapTime={activeScenario.circuit.baseLapTime}
        cars={currentSnapshot?.cars || []}
        playerCarCode={activeScenario.playerConfig.code}
        teammateCarCode={activeScenario.teammateConfig.code}
        lapProgressPct={lapProgressPct}
        currentLap={challengeLap}
        totalLaps={activeScenario.totalLaps}
        isPlaying={challengePlaying}
        playbackSpeed={playbackSpeed}
        isSC={currentSnapshot?.isSC}
        isScEnding={currentSnapshot?.isScEnding}
        isOvertakeActive={ersBoostUsedThisLap || activePuMode === 'push'}
        showLeaderboard={false}
        onMaximize={() => setIsFullScreenCockpit(true)}
      />

      {/* ── LOWER DECK: WEATHER (LEFT) & TEAM ORDERS (RIGHT) ── */}
      <div className={`gap-2 ${mobileConsoleView === 'integrated' ? 'hidden lg:grid grid-cols-1 md:grid-cols-2' : 'grid grid-cols-1 md:grid-cols-2'}`}>
        {/* 1. WEATHER (Balanced Fit - No Clipping) */}
        <div className={`glass-card-premium p-2.5 rounded-xl border border-white/10 space-y-2 flex flex-col justify-start transition-all ${
          activeHelpCard === 'weather' || hoveredHelpCard === 'weather' ? 'relative z-50' : 'relative z-10 hover:z-40'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <CloudRain className="w-3.5 h-3.5 text-cyan-400" />
              <span className="font-racing font-bold text-xs text-white">WEATHER DOPPLER</span>
            </div>
            <div className="flex items-center gap-1">
              {/* Help button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveHelpCard((prev) => (prev === 'weather' ? null : 'weather'));
                }}
                onMouseEnter={() => setHoveredHelpCard('weather')}
                onMouseLeave={() => setHoveredHelpCard(null)}
                className={`p-1 rounded-md transition-all cursor-pointer ${
                  activeHelpCard === 'weather'
                    ? 'bg-cyan-500/30 text-cyan-300 border border-cyan-400/50'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
                title="天候ドップラーレーダー・クロスオーバーの戦略解説を見る"
                aria-label="天候レーダーのヘルプを表示"
              >
                <HelpCircle className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setActiveMonitor('weather')}
                className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
                title="天候レーダーを全画面拡大"
              >
                <Maximize2 className="w-3 h-3" />
              </button>
            </div>
          </div>

          {currentSnapshot?.rainRadar && (
            <div className="flex items-center gap-2.5">
              {/* Circular animated radar scope (48px) with concentric distance rings */}
              <div className="relative w-12 h-12 rounded-full bg-slate-950 border border-cyan-500/40 overflow-hidden shrink-0 flex items-center justify-center shadow-inner">
                {/* Concentric distance rings */}
                <div className="absolute inset-1.5 rounded-full border border-cyan-500/20" />
                <div className="absolute inset-3 rounded-full border border-cyan-500/20" />
                <div className="absolute w-full h-[0.5px] bg-cyan-500/20" />
                <div className="absolute h-full w-[0.5px] bg-cyan-500/20" />
                {/* Center dot (circuit) */}
                <div className="w-1 h-1 rounded-full bg-cyan-400 z-10" />
                {/* Sweeping beam */}
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background:
                      'conic-gradient(from 0deg, transparent 0deg, transparent 300deg, rgba(6,182,212,0.15) 340deg, rgba(6,182,212,0.5) 360deg)',
                    animation: 'spin 3s linear infinite',
                  }}
                />
                {/* Rain cloud representation if raining */}
                {currentSnapshot.rainRadar.waterDepthMm > 0 && (
                  <div
                    className="absolute rounded-full pointer-events-none animate-pulse"
                    style={{
                      width: `${Math.min(36, 14 + currentSnapshot.rainRadar.waterDepthMm * 8)}px`,
                      height: `${Math.min(36, 14 + currentSnapshot.rainRadar.waterDepthMm * 8)}px`,
                      backgroundColor:
                        currentSnapshot.rainRadar.waterDepthMm > 4
                          ? 'rgba(59, 130, 246, 0.45)'
                          : currentSnapshot.rainRadar.waterDepthMm > 1.5
                          ? 'rgba(16, 185, 129, 0.4)'
                          : 'rgba(234, 179, 8, 0.35)',
                      filter: 'blur(3px)',
                    }}
                  />
                )}
              </div>

              {/* Radar Stats (Compact & clear with Rain Countdown) */}
              <div className="flex-1 min-w-0 space-y-0.5 text-xs font-mono">
                {/* Lap Countdown to Rain */}
                {(() => {
                  const rainLap = activeScenario.actualRainLap ?? activeScenario.weatherForecast?.estimatedLapMin;
                  const currentLap = challengeLap;
                  if (rainLap && currentLap < rainLap) {
                    const lapsUntilRain = rainLap - currentLap;
                    return (
                      <div className="flex items-center justify-between text-[10px] px-1.5 py-0.5 rounded bg-sky-950/80 border border-sky-500/40 text-sky-300 font-bold">
                        <span className="flex items-center gap-1">
                          <CloudRain className="w-2.5 h-2.5 animate-bounce" /> 降雨予測:
                        </span>
                        <span>あと {lapsUntilRain} 周</span>
                      </div>
                    );
                  }
                  return null;
                })()}

                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">路面水量:</span>
                  <span className="font-racing font-bold text-white">
                    {currentSnapshot.rainRadar.waterDepthMm.toFixed(2)} mm
                  </span>
                </div>
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-slate-400">推奨:</span>
                  <span
                    className={`font-racing font-bold px-1 rounded text-[9.5px] ${
                      currentSnapshot.rainRadar.crossover.currentBestCompound === 'WET'
                        ? 'bg-blue-600 text-white'
                        : currentSnapshot.rainRadar.crossover.currentBestCompound === 'INTER'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-yellow-500 text-slate-950'
                    }`}
                  >
                    {currentSnapshot.rainRadar.crossover.currentBestCompound}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Compound Crossover Spectrum Bar (Tightly fit) */}
          {currentSnapshot?.rainRadar && (
            <div className="space-y-0.5 pt-0.5 border-t border-white/5">
              <div className="flex items-center justify-between text-[8.5px] font-racing text-slate-400">
                <span>SLICK (&lt;1.5mm)</span>
                <span>INTER (1.5-4.0mm)</span>
                <span>WET (&gt;4.0mm)</span>
              </div>
              <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden flex relative border border-white/10">
                <div className="w-[30%] bg-gradient-to-r from-amber-500 to-yellow-400 h-full" />
                <div className="w-[50%] bg-gradient-to-r from-emerald-500 to-teal-400 h-full" />
                <div className="w-[20%] bg-gradient-to-r from-blue-500 to-indigo-600 h-full" />
                {/* Current Water Depth Marker Needle */}
                <div
                  className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_6px_#fff] transition-all duration-300"
                  style={{
                    left: `${Math.min(98, Math.max(2, (currentSnapshot.rainRadar.waterDepthMm / 6.0) * 100))}%`,
                  }}
                />
              </div>
            </div>
          )}

          {/* Popover overlay: positioned relative to card, elevated to z-50 */}
          {(activeHelpCard === 'weather' || hoveredHelpCard === 'weather') && (
            <div
              className="absolute left-0 right-0 top-full mt-1.5 p-3 rounded-xl bg-slate-950/98 border border-cyan-500/60 shadow-2xl backdrop-blur-xl z-50 animate-in fade-in zoom-in-95 duration-150 text-xs font-mono space-y-2 text-slate-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
                <span className="font-racing font-bold text-xs text-cyan-400 flex items-center gap-1.5">
                  <CloudRain className="w-3.5 h-3.5 text-cyan-400" />
                  天候レーダー・クロスオーバー解説
                </span>
                <button
                  type="button"
                  onClick={() => setActiveHelpCard(null)}
                  className="text-slate-400 hover:text-white text-xs px-1 font-bold"
                  aria-label="閉じる"
                >
                  ✕
                </button>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-300">
                F1では路面水量（水深mm）によりラップタイムの逆転現象（クロスオーバー）が発生します。
              </p>
              <div className="space-y-1 bg-slate-900/80 p-2 rounded-lg border border-white/5 text-[10px]">
                <div className="flex items-center justify-between">
                  <span className="text-amber-400 font-bold">スリック限界: 1.5mm</span>
                  <span className="text-slate-400">これ以上でインター有利</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-emerald-400 font-bold">インター適正: 1.5〜4.0mm</span>
                  <span className="text-slate-400">排水性とグリップの均衡</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-blue-400 font-bold">フルウェット域: 4.0mm以上</span>
                  <span className="text-slate-400">ハイドロプレーニング回避</span>
                </div>
              </div>
              <div className="pt-1 flex items-center justify-between text-[10px]">
                <span className="text-slate-400">作戦ヒント:</span>
                <button
                  type="button"
                  onClick={() => {
                    setActiveHelpCard(null);
                    onNavigateToLibrary?.('tyres');
                  }}
                  className="text-cyan-400 hover:underline font-bold"
                >
                  F1大百科でタイヤ特性を学ぶ ➔
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 2. TEAM ORDERS (Compact) */}
        <div className="glass-card-premium p-2.5 rounded-xl border border-white/10 space-y-2 flex flex-col justify-start">
          <div className="flex items-center justify-between">
            <span className="font-racing font-bold text-xs text-white">TEAM ORDERS</span>
            <span className="text-[10px] font-mono text-slate-400">
              同僚: {activeScenario.teammateConfig.code} (P{teammateCar?.position || '-'})
            </span>
          </div>

          {/* Double Stack Risk Warning (if active) */}
          {currentSnapshot?.teammateStatus?.doubleStackRisk && (
            <div className="p-1.5 rounded-lg bg-amber-950/80 border border-amber-500/50 flex items-center gap-1.5 text-[10px] text-amber-300 font-racing animate-pulse">
              <AlertCircle className="w-3 h-3 text-amber-400 shrink-0" />
              <span>同周ピットで約3.5秒の同時作業待機ロスが発生します</span>
            </div>
          )}

          <div className="space-y-1 text-xs">
            <button
              type="button"
              onClick={() => handleTeamOrder('swap')}
              className={`w-full py-1.5 px-2.5 rounded-lg border text-left transition-all flex justify-between items-center cursor-pointer ${
                activeTeamOrder === 'swap'
                  ? 'bg-amber-950/90 border-amber-500 text-amber-200'
                  : 'bg-slate-900 hover:bg-slate-800 border-white/10 text-slate-300'
              }`}
              title="同僚にポジションを譲らせる、または前に行かせる"
            >
              <div className="flex flex-col">
                <span className="font-racing font-bold text-[10.5px]">🔀 順位入替 (Swap Positions)</span>
                <span className="text-[9px] text-slate-400 font-mono">作戦違いの同僚を先に行かせる</span>
              </div>
              {activeTeamOrder === 'swap' && <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
            </button>

            <button
              type="button"
              onClick={() => handleTeamOrder('defend')}
              className={`w-full py-1.5 px-2.5 rounded-lg border text-left transition-all flex justify-between items-center cursor-pointer ${
                activeTeamOrder === 'defend'
                  ? 'bg-cyan-950/90 border-cyan-500 text-cyan-200'
                  : 'bg-slate-900 hover:bg-slate-800 border-white/10 text-slate-300'
              }`}
              title="同士討ち（同士接触）を防ぐため順位をキープさせる"
            >
              <div className="flex flex-col">
                <span className="font-racing font-bold text-[10.5px]">🛡️ 順位キープ (Hold Position)</span>
                <span className="text-[9px] text-slate-400 font-mono">同士討ちリスクをゼロにする</span>
              </div>
              {activeTeamOrder === 'defend' && <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />}
            </button>

            <button
              type="button"
              onClick={() => handleTeamOrder('none')}
              className={`w-full py-1.5 px-2.5 rounded-lg border text-left transition-all flex justify-between items-center cursor-pointer ${
                activeTeamOrder === 'none'
                  ? 'bg-slate-800 border-white/30 text-white'
                  : 'bg-slate-900 hover:bg-slate-800 border-white/10 text-slate-400'
              }`}
              title="チームオーダーなしで自由に競わせる"
            >
              <span className="font-racing font-bold text-[10.5px]">🏁 自由競争 (Normal Racing)</span>
              {activeTeamOrder === 'none' && <CheckCircle2 className="w-3.5 h-3.5 text-slate-300 shrink-0" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackMapAndWeatherDeck;
