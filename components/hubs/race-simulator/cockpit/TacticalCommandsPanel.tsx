'use client';

/**
 * components/hubs/race-simulator/cockpit/TacticalCommandsPanel.tsx
 * Column 4 (Right): Comms, Live Feed & Tactical Commands (Radio dialogue, Rival intel, Pit strategy commands)
 */

import React from 'react';
import {
  Radio,
  Fuel,
  Zap,
  Flame,
  HelpCircle,
  Maximize2,
  AlertTriangle,
  Crosshair,
  ShieldAlert,
} from 'lucide-react';
import { playF1RadioChirp } from '@/lib/raceSimulationEngine';
import { ensureAudioContextResumed } from '@/lib/radioAudioEffect';
import type {
  SimSnapshot,
  TyreCompound,
  EnginePUMode,
  DriverRadioOption,
} from '@/lib/raceSimulationEngine';
import type { PitwallMonitor, RivalIntelReport, MobileConsoleView } from '../types';
import type { HelpCardType } from './TrackMapAndWeatherDeck';

export type RivalIntelCategory = 'all' | 'tyre' | 'ers' | 'telemetry' | 'radio_intercept' | 'pit_stop';

export interface TacticalCommandsPanelProps {
  mobileConsoleView: MobileConsoleView;
  currentSnapshot?: SimSnapshot | null;
  radioResponses: Record<string, string>;
  minimizeRadioPrompt: boolean;
  setMinimizeRadioPrompt: (min: boolean) => void;
  handleRadioResponse: (promptId: string, option: DriverRadioOption) => void;
  radioAudioEnabled: boolean;
  rivalIntelFilter: RivalIntelCategory;
  setRivalIntelFilter: (filter: RivalIntelCategory) => void;
  filteredRivalIntel: RivalIntelReport[];
  userAssistLevel: 'assisted' | 'expert';
  tacticalAssistGuidance: {
    type: string;
    icon: string;
    target: string;
    message: string;
  } | null;
  playerCar?: SimSnapshot['cars'][0];
  selectedIntelRivalId: string | null;
  setSelectedIntelRivalId: React.Dispatch<React.SetStateAction<string | null>>;
  activeHelpCard: HelpCardType;
  setActiveHelpCard: React.Dispatch<React.SetStateAction<HelpCardType>>;
  hoveredHelpCard: HelpCardType;
  setHoveredHelpCard: (card: HelpCardType) => void;
  setActiveMonitor: (monitor: PitwallMonitor) => void;
  pitProximity: {
    distanceMeters: number;
    secondsToPit: string;
    isApproaching: boolean;
    isCommitmentZone: boolean;
    isPittingNow?: boolean;
  };
  playerPitStatus: {
    isPlayerInPit: boolean;
    isPlayerInLap: boolean;
    isPlayerOut: boolean;
  };
  pitExitTraffic: {
    predictedExitPosition: number;
    trafficStatus: 'CLEAN_AIR' | 'IN_TRAFFIC' | 'CAUTION';
    gapAheadSeconds: number;
    aheadCarCode?: string;
    gapBehindSeconds?: number;
    behindCarCode?: string;
    pitLossSeconds: number;
  };
  nextCompoundChoice: TyreCompound;
  handleCompoundChange: (compound: TyreCompound) => void;
  boxQueuedForNextLap: boolean;
  handleToggleBoxNextLap: () => void;
  activePuMode: EnginePUMode;
  handlePuModeChange: (mode: EnginePUMode) => void;
  ersBoostUsedThisLap: boolean;
  ersEligibility: {
    eligible: boolean;
    reason: string;
    label: string;
  };
  handleToggleErs: () => void;
  onNavigateToLibrary?: (subTab: string, termId?: string) => void;
}

export const TacticalCommandsPanel: React.FC<TacticalCommandsPanelProps> = ({
  mobileConsoleView,
  currentSnapshot,
  radioResponses,
  minimizeRadioPrompt,
  setMinimizeRadioPrompt,
  handleRadioResponse,
  radioAudioEnabled,
  rivalIntelFilter,
  setRivalIntelFilter,
  filteredRivalIntel,
  userAssistLevel,
  tacticalAssistGuidance,
  selectedIntelRivalId,
  setSelectedIntelRivalId,
  activeHelpCard,
  setActiveHelpCard,
  hoveredHelpCard,
  setHoveredHelpCard,
  setActiveMonitor,
  pitProximity,
  playerPitStatus,
  pitExitTraffic,
  nextCompoundChoice,
  handleCompoundChange,
  boxQueuedForNextLap,
  handleToggleBoxNextLap,
  activePuMode,
  handlePuModeChange,
  ersBoostUsedThisLap,
  ersEligibility,
  handleToggleErs,
  playerCar,
  onNavigateToLibrary,
}) => {
  return (
    <div className={`w-full min-w-0 space-y-2.5 ${mobileConsoleView === 'comms' || mobileConsoleView === 'integrated' ? 'block' : 'hidden lg:block'}`}>
      {/* ── 1. ACTIVE EMERGENCY RADIO PROMPT (Prominent Alert Above Commands) ── */}
            {/* 1. Active Radio Prompt Overlay (Tactical Override - Covers Intel without breaking layout) */}
            {currentSnapshot?.activeRadioPrompt && !radioResponses[currentSnapshot.activeRadioPrompt.id] && !minimizeRadioPrompt && (
              <div className="relative z-30 mb-2 rounded-2xl bg-gradient-to-b from-red-950/98 via-slate-950/98 to-slate-950/98 border-2 border-red-500/90 p-3 sm:p-3.5 flex flex-col justify-between backdrop-blur-xl shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between pb-1.5 border-b border-red-500/40 shrink-0">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                    <span className="font-racing font-bold text-red-300 text-xs tracking-wider uppercase flex items-center gap-1.5">
                      <Radio className="w-3.5 h-3.5 text-red-400" />
                      緊急戦略判断 // {currentSnapshot.activeRadioPrompt.urgency.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-racing font-bold text-white px-2 py-0.5 rounded bg-red-900/60 border border-red-400/40">
                      {currentSnapshot.activeRadioPrompt.speaker}
                    </span>
                    <button
                      type="button"
                      onClick={() => setMinimizeRadioPrompt(true)}
                      className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
                      title="インテル情報を一時確認（プロンプトを最小化）"
                    >
                      📊 INTEL確認
                    </button>
                  </div>
                </div>

                {/* Message Body */}
                <div className="py-2.5 px-3 rounded-xl bg-black/60 border border-red-500/20 text-xs sm:text-sm text-white font-mono leading-relaxed my-auto shadow-inner">
                  <p className="text-slate-100">{currentSnapshot.activeRadioPrompt.message}</p>
                </div>

                {/* Option Buttons */}
                <div className="grid grid-cols-1 gap-1.5 pt-1.5 border-t border-red-500/30 shrink-0">
                  {currentSnapshot.activeRadioPrompt.options.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => {
                        handleRadioResponse(currentSnapshot.activeRadioPrompt!.id, opt);
                        setMinimizeRadioPrompt(false);
                      }}
                      className="p-2 sm:p-2.5 rounded-xl bg-slate-900/90 hover:bg-red-900/50 border border-red-500/40 hover:border-red-400 text-left transition-all cursor-pointer group shadow-md active:scale-[0.98]"
                    >
                      <div className="text-xs font-racing font-bold text-white group-hover:text-red-200 flex items-center justify-between">
                        <span>{opt.label}</span>
                        <span className="text-[10px] text-red-400 group-hover:text-white font-mono">選択 ▶</span>
                      </div>
                      <div className="text-[10px] text-slate-300 mt-0.5 font-sans">{opt.effectText}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Minimized Banner if user wants to peek at Intel data */}
            {currentSnapshot?.activeRadioPrompt && !radioResponses[currentSnapshot.activeRadioPrompt.id] && minimizeRadioPrompt && (
              <div className="mb-1.5 p-1.5 rounded-lg bg-red-950/90 border border-red-500 flex items-center justify-between text-xs animate-pulse shrink-0">
                <span className="text-[10px] font-racing text-red-200 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                  🚨 緊急判断待機中: {currentSnapshot.activeRadioPrompt.speaker}
                </span>
                <button
                  type="button"
                  onClick={() => setMinimizeRadioPrompt(false)}
                  className="px-2 py-0.5 rounded bg-red-600 hover:bg-red-500 text-white text-[9.5px] font-racing font-bold shadow cursor-pointer transition-colors"
                >
                  判断画面を開く ▶
                </button>
              </div>
            )}

      {/* ── 2. DOCKED PIT STRATEGY & TACTICAL COMMANDS (Unified Single Card) ── */}
          {/* ── DOCKED PIT STRATEGY & TACTICAL COMMANDS (Unified Single Card) ── */}
          <div className={`glass-card-premium p-2 sm:p-2.5 rounded-xl border border-white/10 space-y-2 shadow-lg backdrop-blur-md transition-all min-h-[238px] flex flex-col justify-between ${
            activeHelpCard === 'pit_exit' || hoveredHelpCard === 'pit_exit' ? 'relative z-50' : 'relative z-20 hover:z-40'
          }`}>
            {/* Header */}
            <div className="flex items-center justify-between pb-1 border-b border-white/10">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="font-racing text-xs font-bold text-white flex items-center gap-1.5 whitespace-nowrap">
                  <Crosshair className="w-3.5 h-3.5 text-cyan-400 shrink-0" /> PIT STRATEGY &amp; COMMANDS
                </span>
                {/* Help button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveHelpCard(activeHelpCard === 'pit_exit' ? null : 'pit_exit');
                  }}
                  onMouseEnter={() => setHoveredHelpCard('pit_exit')}
                  onMouseLeave={() => setHoveredHelpCard(null)}
                  className={`w-3.5 h-3.5 rounded-full border text-[9px] font-mono font-bold flex items-center justify-center transition-all shadow-sm shrink-0 ${
                    activeHelpCard === 'pit_exit' || hoveredHelpCard === 'pit_exit'
                      ? 'bg-cyan-400 text-slate-950 border-cyan-300 ring-2 ring-cyan-400/50'
                      : 'bg-slate-800 hover:bg-cyan-950 border-white/20 hover:border-cyan-400 text-slate-400 hover:text-cyan-300'
                  }`}
                  title="クリックで解説を固定表示 / ホバーで確認"
                >
                  ?
                </button>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[8.5px] font-mono font-bold whitespace-nowrap ${
                    pitExitTraffic.trafficStatus === 'CLEAN_AIR'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                      : pitExitTraffic.trafficStatus === 'CAUTION'
                      ? 'bg-amber-950 text-amber-300 border border-amber-500/40'
                      : 'bg-red-950 text-red-300 border border-red-500/40'
                  }`}
                >
                  {pitExitTraffic.trafficStatus === 'CLEAN_AIR'
                    ? '🟢 CLEAR AIR'
                    : pitExitTraffic.trafficStatus === 'CAUTION'
                    ? '🟡 CAUTION'
                    : '🔴 TRAFFIC'}
                </span>
                <button
                  type="button"
                  onClick={() => setActiveMonitor('timing')}
                  className="p-0.5 rounded text-slate-400 hover:text-white hover:bg-slate-800"
                  title="拡大フォーカス"
                >
                  <Maximize2 className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Pit Entry Proximity Strip (Relocated to Pit Strategy Command Center) */}
            <div className="flex items-center justify-between gap-1 px-2 py-1 rounded-lg bg-slate-900/90 border border-white/10 text-[10.5px] font-mono whitespace-nowrap overflow-hidden">
              <div className="flex items-center gap-1.5 min-w-0">
                <Fuel className="w-3 h-3 text-amber-400 shrink-0" />
                <span className="text-slate-400 text-[10px] shrink-0">ピット入口まで:</span>
                <span className="font-bold text-white text-xs tabular-nums shrink-0">
                  {pitProximity.distanceMeters.toLocaleString()} m
                </span>
                <span className="text-slate-400 text-[9.5px] shrink-0">
                  (約{pitProximity.secondsToPit}秒)
                </span>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                {playerCar?.isPitting ? (
                  playerPitStatus.isPlayerInPit ? (
                    <span className="px-1.5 py-0.2 rounded-full bg-amber-950/80 text-amber-300 border border-amber-500/60 text-[9px] font-racing font-bold flex items-center gap-1 animate-pulse">
                      <span>🛞 IN PIT LANE (作業中)</span>
                    </span>
                  ) : playerPitStatus.isPlayerOut ? (
                    <span className="px-1.5 py-0.2 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/60 text-[9px] font-racing font-bold flex items-center gap-1">
                      <span>🏁 OUT-LAP (コース復帰中)</span>
                    </span>
                  ) : playerPitStatus.isPlayerInLap ? (
                    <span className="px-1.5 py-0.2 rounded-full bg-amber-950/80 text-amber-300 border border-amber-500/60 text-[9px] font-racing font-bold flex items-center gap-1">
                      <span>🟡 IN-LAP (BOX THIS LAP)</span>
                    </span>
                  ) : (
                    <span className="px-1.5 py-0.2 rounded-full bg-emerald-950/60 text-emerald-300 border border-emerald-500/40 text-[9px] font-mono font-bold flex items-center gap-1">
                      <span>🟢 ON TRACK (インラップ走行中)</span>
                    </span>
                  )
                ) : pitProximity.isCommitmentZone ? (
                  <span className="px-1.5 py-0.2 rounded-full bg-red-950 text-red-200 border border-red-500/80 text-[9px] font-racing font-bold animate-pulse flex items-center gap-1 shadow-md shadow-red-950">
                    <AlertTriangle className="w-2.5 h-2.5 text-red-400" />
                    <span>🚨 COMMITMENT (限界点)</span>
                  </span>
                ) : pitProximity.isApproaching ? (
                  <span className="px-1.5 py-0.2 rounded-full bg-amber-950/80 text-amber-300 border border-amber-500/60 text-[9px] font-racing font-bold flex items-center gap-1">
                    <span>🟡 APPROACHING PIT</span>
                  </span>
                ) : (
                  <span className="px-1.5 py-0.2 rounded-full bg-emerald-950/60 text-emerald-300 border border-emerald-500/40 text-[9px] font-mono font-bold flex items-center gap-1">
                    <span>🟢 ON TRACK (巡航中)</span>
                  </span>
                )}
              </div>
            </div>

            {/* 1. Pit Exit Traffic Window (Concise F1 Timing) */}
            <div className="grid grid-cols-2 gap-1 p-1.5 rounded-lg bg-slate-900/90 border border-white/10 text-xs font-mono">
              <div className="flex items-baseline justify-between pr-1">
                <span className="text-[9.5px] text-slate-400 font-bold">EXIT:</span>
                <span className="font-racing font-bold text-sm text-white">
                  P{pitExitTraffic.predictedExitPosition}
                </span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-[9.5px] text-slate-400 font-bold">LOSS:</span>
                <span className="font-mono font-bold text-xs text-amber-400">
                  {pitExitTraffic.pitLossSeconds}s <span className="text-[8px] text-slate-400 font-normal">({currentSnapshot?.isSC ? 'SC' : 'NORM'})</span>
                </span>
              </div>
              <div className="flex items-baseline justify-between pr-1">
                <span className="text-[9.5px] text-slate-400 font-bold">AHEAD:</span>
                <span className="font-mono font-bold text-[10px] text-white truncate max-w-[100px]">
                  {pitExitTraffic.aheadCarCode
                    ? `+${pitExitTraffic.gapAheadSeconds}s (${pitExitTraffic.aheadCarCode})`
                    : 'LEADER'}
                </span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-[9.5px] text-slate-400 font-bold">BEHIND:</span>
                <span className="font-mono font-bold text-[10px] text-white truncate max-w-[100px]">
                  {pitExitTraffic.behindCarCode
                    ? `+${pitExitTraffic.gapBehindSeconds}s (${pitExitTraffic.behindCarCode})`
                    : 'CLEAR'}
                </span>
              </div>
            </div>

            {/* 2. 1-Click Tyre Compound Switcher (Changeable right up until Pit In) */}
            <div className="flex items-center justify-between gap-1.5 bg-slate-900/90 p-1.5 rounded-xl border border-white/10">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="text-[9px] font-mono text-slate-400 shrink-0">次タイヤ:</span>
                <div className="flex items-center gap-1">
                  {(['SOFT', 'MEDIUM', 'HARD', 'INTER', 'WET'] as TyreCompound[]).map((cmp) => {
                    const isSelected = nextCompoundChoice === cmp;
                    const color =
                      cmp === 'SOFT'
                        ? '#ef4444'
                        : cmp === 'MEDIUM'
                        ? '#eab308'
                        : cmp === 'HARD'
                        ? '#f8fafc'
                        : cmp === 'INTER'
                        ? '#10b981'
                        : '#3b82f6';
                    const label = cmp === 'SOFT' ? 'S' : cmp === 'MEDIUM' ? 'M' : cmp === 'HARD' ? 'H' : cmp === 'INTER' ? 'I' : 'W';
                    return (
                      <button
                        key={cmp}
                        type="button"
                        disabled={playerCar?.isPitting}
                        onClick={() => handleCompoundChange(cmp)}
                        className={`px-2 py-0.5 rounded text-[10px] font-racing font-bold border transition-all cursor-pointer flex items-center gap-1 ${
                          isSelected
                            ? 'bg-white/15 border-white text-white shadow-sm ring-1 ring-white/50 scale-105'
                            : 'bg-slate-950/60 border-white/10 text-slate-400 hover:text-white hover:border-white/30'
                        } ${playerCar?.isPitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                        title={`${cmp}: クリックで即座に交換タイヤを変更 (PIT IN直前まで変更可能)`}
                      >
                        <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: color }} />
                        <span>{label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
              <span className="text-[9px] font-mono text-slate-400 shrink-0 font-bold">
                {nextCompoundChoice}
              </span>
            </div>

            {/* 3. Quick Action Command Grid: BOX BOX / PU MODE / ERS BOOST */}
            <div className="grid grid-cols-3 gap-1.5">
              {/* 1. BOX BOX Pit Call Button */}
              <button
                type="button"
                disabled={playerPitStatus.isPlayerInPit}
                onClick={() => {
                  ensureAudioContextResumed();
                  handleToggleBoxNextLap();
                }}
                className={`p-1.5 rounded-xl border text-left cursor-pointer transition-all shadow-sm ${
                  playerCar?.isPitting
                    ? playerPitStatus.isPlayerInPit
                      ? 'bg-amber-950/70 border-amber-500/50 text-amber-200 cursor-not-allowed animate-pulse'
                      : playerPitStatus.isPlayerOut
                      ? 'bg-emerald-950/60 border-emerald-500/60 text-emerald-200'
                      : playerPitStatus.isPlayerInLap
                      ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white border-amber-400 ring-2 ring-amber-500/50'
                      : boxQueuedForNextLap
                      ? 'bg-gradient-to-r from-emerald-600 to-green-600 text-white border-emerald-400 ring-2 ring-emerald-500/50 shadow-emerald-950/50'
                      : 'bg-slate-900 hover:bg-red-950/60 border-white/10 hover:border-red-500/40 text-slate-300 hover:text-white'
                    : boxQueuedForNextLap
                    ? 'bg-gradient-to-r from-emerald-600 to-green-600 text-white border-emerald-400 ring-2 ring-emerald-500/50 shadow-emerald-950/50'
                    : pitProximity.isCommitmentZone
                    ? 'bg-red-950/90 hover:bg-red-900 border-red-500 text-white ring-2 ring-red-500/60 animate-pulse'
                    : 'bg-slate-900 hover:bg-red-950/60 border-white/10 hover:border-red-500/40 text-slate-300 hover:text-white'
                }`}
                title={
                  playerCar?.isPitting
                    ? playerPitStatus.isPlayerInPit
                      ? '現在ピット作業中'
                      : playerPitStatus.isPlayerOut
                      ? 'ピット出口からコース復帰中'
                      : playerPitStatus.isPlayerInLap
                      ? 'インラップ走行中（ピット進入中）'
                      : boxQueuedForNextLap
                      ? '次回ピット指示済み（クリックでキャンセル）'
                      : 'ピットイン指示を出す (BOX BOX)'
                    : boxQueuedForNextLap
                    ? 'ピット指示済み（クリックでキャンセル）'
                    : 'ピットイン指示を出す (BOX BOX)'
                }
              >
                <div className="text-[8px] font-mono opacity-80">
                  {playerCar?.isPitting
                    ? playerPitStatus.isPlayerInPit
                      ? 'IN PIT'
                      : playerPitStatus.isPlayerOut
                      ? 'OUT-LAP'
                      : playerPitStatus.isPlayerInLap
                      ? 'IN-LAP'
                      : boxQueuedForNextLap
                      ? 'ORDERED'
                      : 'PIT IN'
                    : boxQueuedForNextLap
                    ? 'ORDERED'
                    : pitProximity.isCommitmentZone
                    ? '⚠️ COMMIT!'
                    : 'PIT IN'}
                </div>
                <div className="text-[10.5px] font-racing font-bold truncate">
                  {playerCar?.isPitting
                    ? playerPitStatus.isPlayerInPit
                      ? '🛞 PITTING'
                      : playerPitStatus.isPlayerOut
                      ? '🏁 OUT-LAP'
                      : playerPitStatus.isPlayerInLap
                      ? '🏁 BOXING (IN-LAP)'
                      : boxQueuedForNextLap
                      ? '✅ BOX BOX'
                      : '🛞 "BOX BOX"'
                    : boxQueuedForNextLap
                    ? '✅ BOX BOX'
                    : '🛞 "BOX BOX"'}
                </div>
              </button>

              {/* 2. PU Mode Switcher */}
              <button
                type="button"
                onClick={() => {
                  const next =
                    activePuMode === 'push'
                      ? 'conserve'
                      : activePuMode === 'conserve'
                      ? 'standard'
                      : 'push';
                  handlePuModeChange(next);
                  if (radioAudioEnabled) playF1RadioChirp();
                }}
                className={`p-1.5 rounded-xl border text-left cursor-pointer transition-all ${
                  activePuMode === 'push'
                    ? 'bg-rose-950 border-rose-500 text-rose-200 ring-1 ring-rose-500'
                    : activePuMode === 'conserve'
                    ? 'bg-emerald-950 border-emerald-500 text-emerald-200 ring-1 ring-emerald-500'
                    : 'bg-slate-900 hover:bg-slate-800 border-white/10 text-slate-300'
                }`}
                title={
                  activePuMode === 'push'
                    ? 'PUSH稼働中: -0.55sペース短縮 / +12km/h最高速 / バッテリー-18%放電 / タイヤ+4.5°C上昇 (クリックでSAVEへ)'
                    : activePuMode === 'conserve'
                    ? 'SAVE稼働中: +0.65sペース抑制 / -10km/h最高速 / バッテリー+22%急速充電 / タイヤ-4.0°C冷却 (クリックでSTDへ)'
                    : 'STD稼働中: 均衡ペース / プラマイゼロ放電 / 標準タイヤ摩耗 (クリックでPUSHへ)'
                }
              >
                <div className="text-[8px] font-mono text-slate-400 flex items-center justify-between">
                  <span>ENGINE</span>
                  <span className="text-[7.5px] font-bold">
                    {activePuMode === 'push' ? '放電▼' : activePuMode === 'conserve' ? '回生▲' : '均衡'}
                  </span>
                </div>
                <div className="text-[10.5px] font-racing font-bold truncate">
                  {activePuMode === 'push' ? '⚡ PUSH' : activePuMode === 'conserve' ? '🌱 SAVE' : '🏎️ STD'}
                </div>
              </button>

              {/* 3. ERS Boost Overtake Toggle */}
              <button
                type="button"
                disabled={!ersBoostUsedThisLap && !ersEligibility.eligible}
                onClick={() => {
                  if (ersBoostUsedThisLap || ersEligibility.eligible) {
                    handleToggleErs();
                    if (radioAudioEnabled) playF1RadioChirp();
                  }
                }}
                className={`p-1.5 rounded-xl border text-left transition-all ${
                  ersBoostUsedThisLap
                    ? 'bg-cyan-950 border-cyan-400 text-cyan-200 ring-2 ring-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.5)] cursor-pointer animate-pulse'
                    : ersEligibility.eligible
                    ? 'bg-emerald-950/90 hover:bg-emerald-900 border-emerald-400 text-emerald-200 ring-1 ring-emerald-500/50 cursor-pointer animate-pulse'
                    : 'bg-slate-900/60 border-white/5 text-slate-500 cursor-not-allowed opacity-60'
                }`}
                title={
                  ersBoostUsedThisLap
                    ? 'ERSオーバーテイク稼働中（クリックで解除）'
                    : ersEligibility.reason
                }
              >
                <div className="text-[8px] font-mono opacity-80 flex items-center justify-between">
                  <span>OVERTAKE</span>
                  {ersBoostUsedThisLap ? (
                    <span className="text-cyan-300 font-bold">ON</span>
                  ) : ersEligibility.eligible ? (
                    <span className="text-emerald-400 font-bold">&le;1.0s</span>
                  ) : null}
                </div>
                <div className="text-[10px] font-racing font-bold truncate">
                  {ersBoostUsedThisLap
                    ? '⚡ BOOST ON'
                    : ersEligibility.eligible
                    ? '🟢 READY'
                    : ersEligibility.label}
                </div>
              </button>
            </div>

            {/* Popover overlay: positioned relative to card, elevated to z-50 */}
            {(activeHelpCard === 'pit_exit' || hoveredHelpCard === 'pit_exit') && (
              <div
                style={{ backgroundColor: '#020617' }}
                className="absolute inset-x-1 bottom-2 p-3 rounded-2xl bg-slate-950 border border-cyan-500/80 shadow-[0_25px_60px_rgba(0,0,0,1)] z-50 text-left max-h-[380px] overflow-y-auto scrollbar-thin transition-all duration-150 animate-in fade-in zoom-in-95 ring-1 ring-cyan-500/50"
                onMouseEnter={() => setHoveredHelpCard('pit_exit')}
                onMouseLeave={() => setHoveredHelpCard(null)}
              >
                <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-white/10">
                  <div className="flex items-center gap-1.5">
                    <HelpCircle className="w-4 h-4 text-cyan-400" />
                    <span className="font-racing text-xs font-bold text-cyan-300">PIT STRATEGY &amp; COMMANDS 戦術判断ガイド</span>
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
                      ピットインを行った場合、<strong className="text-white">「コース復帰時に何位・誰の前後何秒差で戻るか」</strong>をリアルタイムにシミュレーション予測し、即座にタイヤ選択とピット指示（BOX BOX）を実行する計器です。
                    </p>
                  </div>

                  <div>
                    <div className="font-bold text-emerald-300 flex items-center gap-1 mb-0.5">
                      <span>📊</span> <span>各指標の見方と判断基準</span>
                    </div>
                    <ul className="space-y-1 text-slate-400">
                      <li>
                        <strong className="text-white">・EXIT (想定復帰 P○):</strong> ピットアウト直後に合流する予測順位。「手前の集団に呑まれるか、単独で走れるか」を見極めます。
                      </li>
                      <li>
                        <strong className="text-amber-300">・LOSS (所要ロス / 通常22s前後・SC時14s前後):</strong> ピット制限速度走行とタイヤ交換作業で失うタイム。<strong className="text-amber-200">セーフティカー（SC）中はコース上の全車が減速するため、ピットロスが約8〜10秒短縮（チープピット）</strong>されます。SC導入時に即ピットに入るのが圧倒的に有利な理由です。
                      </li>
                      <li>
                        <strong className="text-emerald-300">・CLEAR AIR (緑):</strong> 前走車との差が十分（+3.0秒以上）ある状態。新品タイヤの強力なグリップを邪魔されずに100%発揮し、前を走るライバルを「アンダーカット」で逆転できます。
                      </li>
                      <li>
                        <strong className="text-red-300">・TRAFFIC (赤) / CAUTION (黄):</strong> 遅いバックマーカーや中団集団の真後ろ（+1.0秒以内）に復帰してしまう状態。新品タイヤでも抜けずにタイムを失うため、<strong className="text-amber-200">「ステイアウト」して前が開くまで引っ張る（オーバーカット）</strong>のが定石です。
                      </li>
                      <li>
                        <strong className="text-cyan-300">・AHEAD / BEHIND (前走車差 / 後続車差):</strong> ピットアウト直後の前走車・後続車とのタイム差。相手ドライバーの略称（例: VER, HAM）も表示されます。
                      </li>
                    </ul>
                  </div>

                  <div className="pt-1 border-t border-white/10">
                    <div className="font-bold text-sky-300 flex items-center gap-1 mb-0.5">
                      <span>⚡</span> <span>推奨アクション</span>
                    </div>
                    <p className="text-slate-300">
                      <strong className="text-emerald-300">CLEAR AIR</strong> または <strong className="text-amber-300">SC導入</strong> ➔ 次タイヤを選んで即座に <span className="px-1 py-0.2 rounded bg-red-900/60 border border-red-500/50 text-white font-mono font-bold">BOX BOX</span> を押す！<br />
                      <strong className="text-red-400">TRAFFIC</strong> ➔ ピットインを1〜2周遅らせ、コース上のギャップが開くのを待つ。
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

      {/* ── 3. MISSION CONTROL INTEL (Rival Espionage & Shared Analytics) ── */}
      <div className={`glass-card-premium p-2.5 sm:p-3 rounded-2xl border border-white/10 shadow-lg backdrop-blur-md flex flex-col h-[388px] relative overflow-hidden ${mobileConsoleView === 'integrated' ? 'hidden lg:flex' : 'flex'}`}>
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-1.5 pb-1.5 border-b border-white/10 shrink-0">
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                </span>
                <span className="font-racing text-xs font-bold text-white flex items-center gap-1 tracking-wider">
                  <ShieldAlert className="w-3.5 h-3.5 text-cyan-400" /> MISSION CONTROL INTEL
                </span>
                <span className="text-[8px] font-mono text-cyan-300 bg-cyan-950/60 border border-cyan-500/30 px-1 py-0.2 rounded">
                  分析班共有
                </span>
              </div>

              {/* Filter Chips */}
              <div className="flex items-center bg-slate-900/90 p-0.5 rounded-lg border border-white/10 text-[8.5px] font-racing">
                {(['all', 'tyre', 'telemetry', 'radio_intercept', 'ers', 'pit_stop'] as const).map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setRivalIntelFilter(filter)}
                    className={`px-1.5 py-0.5 rounded font-bold transition-all cursor-pointer ${
                      rivalIntelFilter === filter
                        ? 'bg-cyan-950 text-cyan-200 border border-cyan-500/50 shadow-sm font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                    title={
                      filter === 'all'
                        ? '全インテル表示'
                        : filter === 'tyre'
                        ? 'ライバルタイヤ監視'
                        : filter === 'telemetry'
                        ? '最高速・セクター解析'
                        : filter === 'radio_intercept'
                        ? '敵無線傍受・ブラフ看破'
                        : filter === 'ers'
                        ? 'ERS・クリッピング監視'
                        : 'ピット作業速報'
                    }
                  >
                    {filter === 'all'
                      ? 'ALL'
                      : filter === 'tyre'
                      ? '🛞 タイヤ'
                      : filter === 'telemetry'
                      ? '⚡ 最高速'
                      : filter === 'radio_intercept'
                      ? '📻 傍受'
                      : filter === 'ers'
                      ? '🔋 ERS'
                      : '⏱️ PIT'}
                  </button>
                ))}
              </div>
            </div>

            {/* Tactical Assist Mode Guidance Banner (Threat Radar Enhanced) */}
            {userAssistLevel === 'assisted' && tacticalAssistGuidance && (
              <div
                className={`mt-1.5 p-2 rounded-xl border text-xs shadow-sm shrink-0 animate-in fade-in duration-200 ${
                  tacticalAssistGuidance.type === 'undercut_threat'
                    ? 'bg-gradient-to-r from-red-950/95 via-slate-900 to-red-950/80 border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.35)] animate-pulse'
                    : tacticalAssistGuidance.type === 'overcut_window'
                    ? 'bg-gradient-to-r from-emerald-950/95 via-slate-900 to-emerald-950/80 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.35)]'
                    : 'bg-gradient-to-r from-cyan-950/90 via-slate-900 to-cyan-950/70 border-cyan-500/40'
                }`}
              >
                <div
                  className={`flex items-center justify-between text-[10px] font-racing pb-1 border-b ${
                    tacticalAssistGuidance.type === 'undercut_threat'
                      ? 'text-red-300 border-red-500/30'
                      : tacticalAssistGuidance.type === 'overcut_window'
                      ? 'text-emerald-300 border-emerald-500/30'
                      : 'text-cyan-300 border-cyan-500/20'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-bold">
                    <span>{tacticalAssistGuidance.icon}</span>
                    <span>
                      {tacticalAssistGuidance.type === 'undercut_threat'
                        ? 'TACTICAL ALERT (アンダーカット迎撃警報)'
                        : tacticalAssistGuidance.type === 'overcut_window'
                        ? 'TACTICAL WINDOW (オーバーカット好機)'
                        : 'TACTICAL ASSIST GUIDE (計器確認ガイダンス)'}
                    </span>
                  </div>
                  <span
                    className={`font-mono text-[8.5px] px-1.5 py-0.5 rounded border font-bold ${
                      tacticalAssistGuidance.type === 'undercut_threat'
                        ? 'text-red-300 bg-red-950 border-red-500/40'
                        : tacticalAssistGuidance.type === 'overcut_window'
                        ? 'text-emerald-300 bg-emerald-950 border-emerald-500/40'
                        : 'text-cyan-400 bg-cyan-950 border-cyan-500/30'
                    }`}
                  >
                    {tacticalAssistGuidance.target}
                  </span>
                </div>
                <div className="text-[10px] text-slate-100 mt-1 leading-relaxed font-sans">
                  {tacticalAssistGuidance.message}
                </div>
              </div>
            )}

            {/* Reports Stream */}
            <div className="space-y-1.5 overflow-y-auto pr-1 flex-1 min-h-0 pt-1.5">
              {filteredRivalIntel.length === 0 ? (
                <div className="py-4 text-center text-xs font-mono text-slate-500">
                  現在このカテゴリの共有インテルはありません
                </div>
              ) : (
                filteredRivalIntel.map((report) => {
                  const isExpanded = selectedIntelRivalId === report.id;
                  const isHigh = report.priority === 'high';
                  const isTyre = report.category === 'tyre';
                  const isTelem = report.category === 'telemetry';
                  const isRadio = report.category === 'radio_intercept';
                  const isErs = report.category === 'ers';

                  const borderAccentColor = isHigh
                    ? 'border-l-rose-500'
                    : isTyre
                    ? 'border-l-emerald-400'
                    : isTelem
                    ? 'border-l-cyan-400'
                    : isRadio
                    ? 'border-l-amber-400'
                    : isErs
                    ? 'border-l-purple-400'
                    : 'border-l-sky-400';

                  return (
                    <div
                      key={report.id}
                      className={`p-2 rounded-xl bg-slate-900/90 border border-white/10 border-l-[3px] ${borderAccentColor} hover:border-white/20 transition-all shadow-sm`}
                    >
                      <div className="flex items-center justify-between text-[9px] mb-0.5">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {/* Role Title */}
                          <span className="font-racing font-bold text-white text-[10.5px]">
                            {report.analystRole}
                          </span>
                          {/* Target Car Badge */}
                          <span
                            className="px-1.5 py-0.2 rounded font-mono font-bold text-[8.5px] border bg-slate-800/80 text-white flex items-center gap-1"
                            style={{ borderColor: `${report.targetCarColor}60` }}
                          >
                            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: report.targetCarColor }} />
                            <span>{report.targetCarCode} (P{report.targetCarPos})</span>
                          </span>
                        </div>

                        {/* Subtle Monochrome Lap & Confidence Meta (No colorful pills) */}
                        <div className="flex items-center gap-1.5 text-[9px] font-mono text-slate-400">
                          <span>L{report.lap}</span>
                          <span className="text-slate-600">·</span>
                          <span className={report.confidence === 'suspect_bluff' ? 'text-amber-400 font-bold' : 'text-slate-400'}>
                            {report.confidenceLabel}
                          </span>
                        </div>
                      </div>

                      {/* Summary Text (Enhanced font-sans with bold numbers) */}
                      <div className="text-[11.5px] font-sans text-slate-100 leading-snug">
                        {report.summary}
                      </div>

                      {/* Action / Detail Strip: Sleek ghost link */}
                      <div className="flex items-center justify-end pt-1 border-t border-white/5 text-[9px] mt-1">
                        <button
                          type="button"
                          onClick={() => setSelectedIntelRivalId(isExpanded ? null : report.id)}
                          className="text-slate-400 hover:text-cyan-300 font-mono transition-colors flex items-center gap-1 cursor-pointer py-0.5 text-[9px]"
                        >
                          <span>詳細データ</span>
                          <span className="text-[8px]">{isExpanded ? '▲' : '▼'}</span>
                        </button>
                      </div>

                      {/* Expanded Raw Telemetry Drawer */}
                      {isExpanded && (
                        <div className="p-2 mt-1.5 rounded-lg bg-slate-950/90 border border-cyan-500/30 space-y-1 text-[9.5px] font-mono text-slate-300 animate-in fade-in duration-200">
                          <div className="flex items-center justify-between pb-1 border-b border-white/10 font-racing font-bold text-cyan-400">
                            <span>{report.targetCarName} ({report.targetCarCode}) 生データ解析</span>
                            <span>P{report.targetCarPos}</span>
                          </div>
                          <div className="grid grid-cols-2 gap-1.5 pt-0.5">
                            <div>
                              <span className="text-slate-400">直近ラップ: </span>
                              <span className="text-white font-bold">{report.rawTelemetry.lapTimes.join(' ➔ ')}</span>
                            </div>
                            <div>
                              <span className="text-slate-400">最高速 (ST): </span>
                              <span className="text-white font-bold">{report.rawTelemetry.speedTrapKmh} km/h</span>
                              <span className={report.rawTelemetry.playerDeltaSpeedKmh > 0 ? 'text-rose-400 ml-1' : 'text-emerald-400 ml-1'}>
                                (自車比 {report.rawTelemetry.playerDeltaSpeedKmh > 0 ? '+' : ''}{report.rawTelemetry.playerDeltaSpeedKmh}km/h)
                              </span>
                            </div>
                            <div>
                              <span className="text-slate-400">タイヤ: </span>
                              <span className="text-amber-300 font-bold">
                                {report.rawTelemetry.tyreCompound} ({report.rawTelemetry.tyreAge}周 / 摩耗{report.rawTelemetry.tyreWearPercent}%)
                              </span>
                            </div>
                            <div>
                              <span className="text-slate-400">ERS残量: </span>
                              <span className={report.rawTelemetry.ersBatterySoc < 30 ? 'text-rose-400 font-bold' : 'text-cyan-300 font-bold'}>
                                {report.rawTelemetry.ersBatterySoc}% {report.rawTelemetry.ersBatterySoc < 30 ? '(クリッピング注意)' : ''}
                              </span>
                            </div>
                          </div>
                          <div className="text-[8.5px] text-slate-400 pt-0.5 flex justify-between items-center border-t border-white/5">
                            <span>自車との差: <strong className="text-white">{report.rawTelemetry.gapToPlayerSec.toFixed(1)}秒</strong> ({report.rawTelemetry.isAhead ? '前走' : '後続'})</span>
                            {report.rawTelemetry.pitStopDuration && (
                              <span className="text-amber-300 font-bold">ピット静止: {report.rawTelemetry.pitStopDuration}s</span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
      </div>
    </div>
  );
};

export default TacticalCommandsPanel;
