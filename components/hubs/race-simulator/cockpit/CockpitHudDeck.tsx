'use client';

/**
 * components/hubs/race-simulator/cockpit/CockpitHudDeck.tsx
 * Unified Tactical Command & FIA HUD Deck (Ultra-Compact 2-Tier) + Mobile Toggle
 */

import React from 'react';
import {
  Pause,
  Play,
  RotateCcw,
  Bot,
  ShieldAlert,
  CloudRain,
} from 'lucide-react';
import type {
  ChallengeScenario,
  SimSnapshot,
  TyreCompound,
  EnginePUMode,
} from '@/lib/raceSimulationEngine';

export interface CockpitHudDeckProps {
  challengeLap: number;
  setChallengeLap: (lap: number | ((prev: number) => number)) => void;
  resumedLapsRef: React.MutableRefObject<Set<number>>;
  challengePlaying: boolean;
  handleResumeOrPlay: () => void;
  activeScenario: ChallengeScenario;
  playbackSpeed: number;
  setPlaybackSpeed: (speed: number) => void;
  resetGameState: () => void;
  lapTimeRemainingMs: number;
  customStartingTyre: TyreCompound | null;
  customInitialPuMode: EnginePUMode | null;
  currentSnapshot?: SimSnapshot | null;
  playerCar?: SimSnapshot['cars'][0];
  aiDifficulty: 'beginner' | 'standard' | 'master';
  userAssistLevel: 'assisted' | 'expert';
  setUserAssistLevel: (level: 'assisted' | 'expert') => void;
  raceLengthMode: 'gp_short_25' | 'gp_full_100' | 'sprint';
  pitExitTraffic: {
    predictedExitPosition: number;
    trafficStatus: 'CLEAN_AIR' | 'IN_TRAFFIC' | 'CAUTION';
    gapAheadSeconds: number;
    aheadCarCode?: string;
    pitLossSeconds: number;
  };
  weatherRerollNotification: string | null;
  setWeatherRerollNotification: (notif: string | null) => void;
  autoPauseAlert?: string | null;
  setAutoPauseAlert?: (alert: string | null) => void;
  mobileConsoleView: 'tower' | 'monitor' | 'comms';
  setMobileConsoleView: (view: 'tower' | 'monitor' | 'comms') => void;
  radioResponses: Record<string, string>;
}

export const CockpitHudDeck: React.FC<CockpitHudDeckProps> = ({
  challengeLap,
  setChallengeLap,
  resumedLapsRef,
  challengePlaying,
  handleResumeOrPlay,
  activeScenario,
  playbackSpeed,
  setPlaybackSpeed,
  resetGameState,
  lapTimeRemainingMs,
  customStartingTyre,
  customInitialPuMode,
  currentSnapshot,
  playerCar,
  aiDifficulty,
  userAssistLevel,
  setUserAssistLevel,
  raceLengthMode,
  pitExitTraffic,
  weatherRerollNotification,
  setWeatherRerollNotification,
  autoPauseAlert,
  setAutoPauseAlert,
  mobileConsoleView,
  setMobileConsoleView,
  radioResponses,
}) => {
  return (
    <>
      {/* ── UNIFIED TACTICAL COMMAND & FIA HUD DECK (Ultra-Compact 2-Tier) ── */}
      <div className="px-2.5 py-1.5 rounded-xl bg-slate-950/95 border border-white/10 shadow-lg backdrop-blur-md space-y-1.5">
        {/* Tier 1: Playback Controls, Lap Progress, Car Status, Flags & Toggles */}
        <div className="flex flex-wrap items-center justify-between gap-1.5 text-xs">
          {/* Left: Lap Controls & Speed */}
          <div className="flex items-center gap-1 flex-wrap">
            <button
              type="button"
              onClick={() => {
                const prevLap = Math.max(1, challengeLap - 1);
                resumedLapsRef.current.delete(prevLap);
                setChallengeLap(prevLap);
              }}
              disabled={challengeLap <= 1}
              className="btn-console text-[11px] px-1.5 py-0.5 disabled:opacity-30"
              title="1周戻る"
            >
              ◀
            </button>

            <button
              type="button"
              onClick={handleResumeOrPlay}
              className={`px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-xl text-xs flex items-center gap-1.5 font-racing font-bold shadow-md cursor-pointer transition-all ${
                challengePlaying
                  ? 'bg-amber-600 hover:bg-amber-500 text-white ring-2 ring-amber-400/60 shadow-amber-950/60'
                  : 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white shadow-red-950/60 ring-1 ring-red-400/50'
              }`}
            >
              {challengePlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5 fill-current" /> PAUSE
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" /> {challengeLap >= activeScenario.totalLaps ? 'REPLAY' : 'PLAY'}
                </>
              )}
            </button>

            {/* Speed Selector */}
            <div className="flex items-center gap-0.5 bg-slate-900 p-0.5 rounded-lg border border-white/10 text-[9px] font-racing">
              {[
                { val: 0.5, label: '0.5x' },
                { val: 1, label: '1x' },
                { val: 2, label: '2x' },
                { val: 5, label: '5x' },
                { val: 10, label: '10x' },
                { val: 20, label: '20x' },
              ].map((spd) => (
                <button
                  key={spd.val}
                  type="button"
                  onClick={() => setPlaybackSpeed(spd.val)}
                  className={`px-1 py-0.2 rounded ${
                    playbackSpeed === spd.val
                      ? 'bg-red-600 text-white font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {spd.label}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={resetGameState}
              className="btn-console text-xs px-1.5 py-0.5 text-slate-400 hover:text-white"
              title="リセット"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>

          {/* Center: Lap Progress + Driver/Tyre/PU Badges */}
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="font-racing font-bold text-white text-[11px]">
              LAP {challengeLap}/{activeScenario.totalLaps}
            </span>
            {challengePlaying && (
              <span className="text-[10px] text-amber-300 font-mono">
                ({(lapTimeRemainingMs / 1000).toFixed(1)}s)
              </span>
            )}
            <div className="w-16 sm:w-20 h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-red-600 to-rose-500 transition-all duration-300"
                style={{ width: `${(challengeLap / activeScenario.totalLaps) * 100}%` }}
              />
            </div>
            {/* Quick Car Info */}
            <div className="hidden sm:flex items-center gap-1 text-[10px]">
              <span className="px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 font-mono">
                🏎️ {activeScenario.playerConfig.code}
              </span>
              <span className="px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 font-mono">
                🛞 {customStartingTyre || activeScenario.playerConfig.startTyre}
              </span>
              <span className="px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 font-mono">
                🔥 {(customInitialPuMode || activeScenario.playerConfig.machineSetup.puMode).toUpperCase()}
              </span>
            </div>
          </div>

          {/* Right: Race Control Status, Weather Reroll, AI Difficulty, Assist */}
          <div className="flex items-center gap-1.5 text-[10px] font-mono flex-wrap">
            {/* Safety Car status */}
            <span
              className={`px-1.5 py-0.5 rounded font-bold font-racing ${
                currentSnapshot?.isScEnding
                  ? 'bg-emerald-500 text-slate-950 animate-pulse shadow-sm shadow-emerald-500/50'
                  : currentSnapshot?.isSC
                  ? 'bg-yellow-500 text-slate-950 animate-pulse'
                  : currentSnapshot?.isVSC
                  ? 'bg-amber-600 text-white'
                  : 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
              }`}
            >
              {currentSnapshot?.isScEnding
                ? '🟢 SC IN THIS LAP'
                : currentSnapshot?.isSC
                ? '🟡 SC'
                : currentSnapshot?.isVSC
                ? '🟠 VSC'
                : '🟢 GREEN'}
            </span>

            {/* SC risk */}
            {currentSnapshot?.rainRadar && (
              <span
                className={`px-1.5 py-0.5 rounded text-[9px] font-bold border ${
                  currentSnapshot.rainRadar.incidentRiskLevel === 'CRITICAL'
                    ? 'bg-red-950 text-red-300 border-red-500 animate-pulse'
                    : currentSnapshot.rainRadar.incidentRiskLevel === 'HIGH'
                    ? 'bg-amber-950 text-amber-300 border-amber-500'
                    : 'bg-slate-900 text-slate-400 border-white/10'
                }`}
              >
                SC {currentSnapshot.rainRadar.incidentRiskPercent}%
              </span>
            )}

            {/* AI Difficulty Status Tag */}
            <span
              className="px-1.5 py-0.5 rounded text-[10px] font-racing font-bold bg-slate-900 border border-white/10 text-slate-300 flex items-center gap-1"
              title="AIライバル難易度"
            >
              <Bot className="w-3 h-3 text-cyan-400" />
              <span>
                {aiDifficulty === 'master' ? '🏆 達人' : aiDifficulty === 'standard' ? '🏎️ 標準' : '🌱 初級'}
              </span>
            </span>

            {/* User Tactical Assist Mode */}
            <div className="flex items-center gap-0.5 bg-slate-900/90 px-1 py-0.5 rounded-lg border border-white/10 shadow-inner text-[9.5px] font-racing">
              <button
                type="button"
                onClick={() => setUserAssistLevel('assisted')}
                className={`px-1 py-0.2 rounded font-bold transition-all flex items-center gap-0.5 cursor-pointer ${
                  userAssistLevel === 'assisted'
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/50 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="🔰 アシストあり"
              >
                <span>🔰</span>
                <span className="hidden sm:inline">アシスト</span>
              </button>
              <button
                type="button"
                onClick={() => setUserAssistLevel('expert')}
                className={`px-1 py-0.2 rounded font-bold transition-all flex items-center gap-0.5 cursor-pointer ${
                  userAssistLevel === 'expert'
                    ? 'bg-slate-800 text-cyan-300 border border-cyan-500/50 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="🎯 エキスパート"
              >
                <span>🎯</span>
                <span className="hidden sm:inline">エキスパート</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tier 2: FIA Sporting Regulations & Pit Window Prediction (Slim Sub-Strip) */}
        {currentSnapshot && playerCar && (
          <div className="pt-1 border-t border-white/10 flex flex-wrap items-center justify-between gap-1.5 text-[10.5px] font-mono">
            {/* Left: FIA Art. 30.5 Mandatory 2 Compounds Rule Status & Track Limits */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="font-racing text-[10px] font-bold text-slate-300 flex items-center gap-1">
                <ShieldAlert className="w-3 h-3 text-cyan-400" /> FIA規則:
              </span>
              {(() => {
                const fia = currentSnapshot.fiaRuleStatus;
                const isMet = fia?.mandatoryDryTireMet;
                const used = fia?.compoundsUsed || [playerCar.tyreCompound];
                const isSprint = raceLengthMode === 'sprint';
                return (
                  <div className="flex flex-wrap items-center gap-1">
                    {!isSprint ? (
                      <span
                        className={`px-1.5 py-0.2 rounded text-[9.5px] font-bold flex items-center gap-1 ${
                          isMet
                            ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40'
                            : 'bg-amber-950/80 text-amber-300 border border-amber-500/40 animate-pulse'
                        }`}
                      >
                        <span>🛞 2種ドライタイヤ義務 (Art. 30.5):</span>
                        <span className="font-mono font-black">{used.join(' ➔ ')}</span>
                        <span>{isMet ? '【達成済 ✅】' : '【ピット必須 ⚠️】'}</span>
                      </span>
                    ) : (
                      <span className="px-1.5 py-0.2 rounded text-[9.5px] font-bold bg-amber-950/80 text-amber-300 border border-amber-500/40">
                        ⚡ スプリント (ピット義務なし)
                      </span>
                    )}

                    {/* DRS Status */}
                    <span
                      className={`px-1.5 py-0.2 rounded text-[9.5px] font-bold ${
                        playerCar.drsAvailable
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40 animate-pulse'
                          : 'bg-slate-900 text-slate-500 border border-white/5'
                      }`}
                    >
                      ⚡ DRS: {playerCar.drsAvailable ? 'OPEN (<1.0s) 🟢' : 'DISABLED 🔒'}
                    </span>

                    {/* Track Limits */}
                    <span
                      className={`px-1.5 py-0.2 rounded text-[9.5px] ${
                        (fia?.trackLimitsCount || 0) >= 3
                          ? 'bg-red-950 text-red-300 border border-red-500/50 animate-pulse'
                          : (fia?.trackLimitsCount || 0) > 0
                          ? 'bg-yellow-950 text-yellow-300 border border-yellow-500/40'
                          : 'bg-slate-900 text-slate-400'
                      }`}
                    >
                      TL: {fia?.trackLimitsCount || 0}/3
                      {(fia?.pendingPenalties || 0) > 0 && ` (+${fia?.pendingPenalties}s)`}
                    </span>
                  </div>
                );
              })()}
            </div>

            {/* Right: Pit Window & Traffic Predictor (Clean Air Finder) */}
            {pitExitTraffic && (
              <div className="flex items-center gap-1.5 bg-slate-900/90 px-2 py-0.5 rounded-lg border border-white/10 text-[10px]">
                <span className="text-slate-400 font-racing font-bold">
                  🚪 ピット出口予測:
                </span>
                <span className="font-bold text-white">
                  P{pitExitTraffic.predictedExitPosition} 復帰
                </span>
                <span
                  className={`px-1 py-0.2 rounded text-[9px] font-bold ${
                    pitExitTraffic.trafficStatus === 'CLEAN_AIR'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                      : pitExitTraffic.trafficStatus === 'IN_TRAFFIC'
                      ? 'bg-red-950 text-red-300 border border-red-500/50 animate-pulse'
                      : 'bg-yellow-950 text-yellow-300 border border-yellow-500/40'
                  }`}
                >
                  {pitExitTraffic.trafficStatus === 'CLEAN_AIR'
                    ? '🟢 クリーンエア'
                    : pitExitTraffic.trafficStatus === 'IN_TRAFFIC'
                    ? `⚠️ 混戦 (+${pitExitTraffic.gapAheadSeconds}s ${pitExitTraffic.aheadCarCode || ''})`
                    : `🟡 要注意 (+${pitExitTraffic.gapAheadSeconds}s)`}
                </span>
                <span className="text-[9px] text-slate-400">
                  (ロス約{pitExitTraffic.pitLossSeconds}s)
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Weather Flash Notification */}
      {weatherRerollNotification && (
        <div className="px-3 py-1.5 rounded-xl bg-sky-950/80 border border-sky-500/50 text-sky-200 text-xs font-mono flex items-center justify-between animate-in fade-in duration-200 shadow-sm">
          <div className="flex items-center gap-1.5">
            <CloudRain className="w-3.5 h-3.5 text-sky-400 animate-bounce" />
            <span>{weatherRerollNotification}</span>
          </div>
          <button
            type="button"
            onClick={() => setWeatherRerollNotification(null)}
            className="text-sky-400 hover:text-white text-xs px-1 font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* ── END HUD DECK ── */}

      {/* ── Mobile View Toggle (screens < lg) ── */}
      <div className="grid grid-cols-3 lg:hidden gap-1 p-1 rounded-xl bg-slate-900 border border-white/10 text-xs font-racing font-bold">
        <button
          type="button"
          onClick={() => setMobileConsoleView('tower')}
          className={`py-1.5 rounded-lg text-center transition-all ${
            mobileConsoleView === 'tower' ? 'bg-red-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
          }`}
        >
          🏁 順位タワー
        </button>
        <button
          type="button"
          onClick={() => setMobileConsoleView('monitor')}
          className={`py-1.5 rounded-lg text-center transition-all ${
            mobileConsoleView === 'monitor' ? 'bg-red-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
          }`}
        >
          🖥️ コース・データ
        </button>
        <button
          type="button"
          onClick={() => setMobileConsoleView('comms')}
          className={`py-1.5 rounded-lg text-center transition-all relative ${
            mobileConsoleView === 'comms' ? 'bg-red-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
          }`}
        >
          <span>📻 無線・BOX</span>
          {currentSnapshot?.activeRadioPrompt && !radioResponses[currentSnapshot.activeRadioPrompt.id] && (
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500 animate-ping" />
          )}
        </button>
      </div>
    </>
  );
};

export default CockpitHudDeck;
