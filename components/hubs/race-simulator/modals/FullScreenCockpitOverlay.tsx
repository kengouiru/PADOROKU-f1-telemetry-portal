'use client';

/**
 * components/hubs/race-simulator/modals/FullScreenCockpitOverlay.tsx
 * Full-screen pitwall command cockpit overlay mode (全画面司令塔モード)
 */

import React from 'react';
import {
  Gamepad2,
  Pause,
  Play,
  Volume2,
  VolumeX,
  Maximize2,
  Award,
  Settings,
  BookOpen,
  Minimize2,
  Users,
  Radio,
  Fuel,
  Zap,
  Flame,
  CloudRain,
} from 'lucide-react';
import LiveTrackGpsRadar from '@/components/telemetry/LiveTrackGpsRadar';
import { ensureAudioContextResumed } from '@/lib/radioAudioEffect';
import type {
  ChallengeScenario,
  SimSnapshot,
  TyreCompound,
  EnginePUMode,
  DriverRadioOption,
} from '@/lib/raceSimulationEngine';
import type { SavedCareerData } from '@/lib/raceDebriefAnalysis';

export interface FullScreenCockpitOverlayProps {
  isFullScreenCockpit: boolean;
  setIsFullScreenCockpit: (open: boolean) => void;
  activeScenario: ChallengeScenario;
  challengeLap: number;
  challengePlaying: boolean;
  handleResumeOrPlay: () => void;
  playbackSpeed: number;
  setPlaybackSpeed: (speed: number) => void;
  radioAudioEnabled: boolean;
  setRadioAudioEnabled: (enabled: boolean) => void;
  careerData: SavedCareerData;
  setIsCareerModalOpen: (open: boolean) => void;
  setIsScenarioDrawerOpen: (open: boolean) => void;
  setChallengePlaying: (playing: boolean) => void;
  standaloneMode?: boolean;
  onNavigateToLibrary?: (subTab: string, termId?: string) => void;
  currentSnapshot?: SimSnapshot | null;
  selectedCarCode: string | null;
  setSelectedCarCode: (code: string | null) => void;
  ersBoostUsedThisLap: boolean;
  activePuMode: EnginePUMode;
  lapProgressPct: number;
  pitExitTraffic: {
    predictedExitPosition: number;
    gapAheadSeconds: number;
    gapBehindSeconds: number;
  };
  boxQueuedForNextLap: boolean;
  handleToggleBoxNextLap: () => void;
  nextCompoundChoice: TyreCompound;
  handleCompoundChange: (compound: TyreCompound) => void;
  handleToggleErs: () => void;
  handlePuModeChange: (mode: EnginePUMode) => void;
  handleRadioResponse: (promptId: string, option: DriverRadioOption) => void;
}

export const FullScreenCockpitOverlay: React.FC<FullScreenCockpitOverlayProps> = ({
  isFullScreenCockpit,
  setIsFullScreenCockpit,
  activeScenario,
  challengeLap,
  challengePlaying,
  handleResumeOrPlay,
  playbackSpeed,
  setPlaybackSpeed,
  radioAudioEnabled,
  setRadioAudioEnabled,
  careerData,
  setIsCareerModalOpen,
  setIsScenarioDrawerOpen,
  setChallengePlaying,
  standaloneMode = false,
  onNavigateToLibrary,
  currentSnapshot,
  selectedCarCode,
  setSelectedCarCode,
  ersBoostUsedThisLap,
  activePuMode,
  lapProgressPct,
  pitExitTraffic,
  boxQueuedForNextLap,
  handleToggleBoxNextLap,
  nextCompoundChoice,
  handleCompoundChange,
  handleToggleErs,
  handlePuModeChange,
  handleRadioResponse,
}) => {
  if (!isFullScreenCockpit) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/98 backdrop-blur-3xl p-3 sm:p-4 flex flex-col overflow-y-auto lg:overflow-hidden text-slate-100 animate-in fade-in duration-200">
      {/* Cockpit Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2.5 border-b border-white/10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-cyan-950 border border-cyan-500/50 flex items-center justify-center">
              <Gamepad2 className="w-4 h-4 text-cyan-400 animate-pulse" />
            </div>
            <span className="font-racing font-bold text-sm sm:text-base text-white tracking-wider">
              F1 PITWALL COCKPIT
            </span>
          </div>
          <span className="text-xs font-mono text-cyan-300 font-bold px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/40">
            {activeScenario.circuit.name}
          </span>
          <span className="text-xs font-mono text-slate-300">
            LAP {challengeLap} / {activeScenario.totalLaps}
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Play / Pause */}
          <button
            type="button"
            onClick={handleResumeOrPlay}
            className={`btn-console px-3 py-1 text-xs font-racing font-bold flex items-center gap-1.5 ${
              challengePlaying
                ? 'bg-amber-950 text-amber-300 border-amber-500/60'
                : 'bg-emerald-950 text-emerald-300 border-emerald-500/60'
            }`}
          >
            {challengePlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{challengePlaying ? 'PAUSE' : 'PLAY'}</span>
          </button>

          {/* Playback Speed */}
          <div className="flex items-center gap-0.5 bg-slate-900 px-1 py-0.5 rounded-lg border border-white/10 text-[10px] font-mono">
            {[0.5, 1, 2, 5, 10].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setPlaybackSpeed(s)}
                className={`px-1.5 py-0.5 rounded font-bold ${
                  playbackSpeed === s ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>

          {/* Radio Audio Toggle */}
          <button
            type="button"
            onClick={() => setRadioAudioEnabled(!radioAudioEnabled)}
            className="p-1.5 rounded-lg bg-slate-900 border border-white/10 text-slate-300 hover:text-white"
            title={radioAudioEnabled ? '無線音声を消音' : '無線音声を有効化'}
          >
            {radioAudioEnabled ? (
              <Volume2 className="w-4 h-4 text-cyan-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-500" />
            )}
          </button>

          {/* Native Fullscreen Toggle Button (F11) */}
          <button
            type="button"
            onClick={() => {
              if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen().catch(() => {});
              } else {
                if (document.exitFullscreen) {
                  document.exitFullscreen().catch(() => {});
                }
              }
            }}
            className="btn-console px-2.5 py-1 text-xs font-mono font-bold bg-slate-900 border border-white/10 text-cyan-300 hover:text-white flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
            title="PC画面全体のネイティブ全画面表示 (F11)"
          >
            <Maximize2 className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">全画面 (F11)</span>
          </button>

          {/* Career & Badges Museum Button */}
          <button
            type="button"
            onClick={() => setIsCareerModalOpen(true)}
            className="btn-console flex items-center gap-1 text-xs px-2.5 py-1 bg-amber-950/60 border-amber-500/40 text-amber-300 hover:text-white transition-all shadow-sm"
            title="FIAライセンス等級・累積CP・称号カタログを開く"
          >
            <Award className="w-3.5 h-3.5 text-yellow-400" />
            <span suppressHydrationWarning className="font-racing text-[10px] font-bold">
              {careerData.grade === 'S' ? '👑 S' : `GRADE ${careerData.grade}`}
            </span>
          </button>

          {/* Mode & Strategy Settings Button */}
          <button
            type="button"
            onClick={() => {
              setIsFullScreenCockpit(false);
              setIsScenarioDrawerOpen(true);
            }}
            className="btn-console flex items-center gap-1 text-xs px-2.5 py-1 bg-slate-900 border border-white/20 text-cyan-300 hover:text-white hover:border-cyan-400 transition-all shadow-sm"
            title="全24コース・全22ドライバー選択・サンドボックス・作戦設定を開く"
          >
            <Settings className="w-3.5 h-3.5 text-cyan-400" />
            <span>⚙️ モード・作戦設定</span>
          </button>

          {/* F1 Library / Tyres Knowledge Research Button (一時停止して大百科へ) */}
          <button
            type="button"
            onClick={() => {
              setChallengePlaying(false);
              if (standaloneMode) {
                window.open('/?hub=knowledge&subTab=tyres', '_blank');
              } else {
                setIsFullScreenCockpit(false);
                onNavigateToLibrary?.('tyres');
              }
            }}
            className="btn-console px-3 py-1 text-xs font-mono font-bold bg-indigo-950/80 border-indigo-500/60 text-indigo-200 hover:bg-indigo-900 hover:text-white flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
            title="レースを一時停止してF1大百科（タイヤ特性・用語）を調べる"
          >
            <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">📚 F1大百科</span>
          </button>

          {/* Return to Full Command Console Button */}
          <button
            type="button"
            onClick={() => {
              setIsFullScreenCockpit(false);
            }}
            className="btn-console px-3 py-1 text-xs font-mono font-bold bg-slate-900 border border-white/20 text-slate-200 hover:text-white flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
            title="全モニター（熱解析・チームオーダー・無線・詳細設定）が揃ったフル作戦室に戻る"
          >
            <Minimize2 className="w-3.5 h-3.5 text-slate-400" />
            <span>🎛️ フル作戦室 (ESC)</span>
          </button>
        </div>
      </div>

      {/* Cockpit 3-Column Command Center */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-3 pt-3 overflow-hidden min-h-0">
        {/* Left: Timing Tower (lg:col-span-3) */}
        <div className="lg:col-span-3 flex flex-col gap-2 overflow-hidden h-full">
          <div className="flex-1 bg-slate-900/90 rounded-2xl border border-white/10 p-3 flex flex-col overflow-hidden shadow-xl">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10 text-xs font-mono font-bold text-slate-400">
              <span className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-cyan-400" />
                <span>FIA TIMING TOWER</span>
              </span>
              <span>GAP / 速度</span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 scrollbar-thin">
              {currentSnapshot?.cars.map((car) => {
                const isPlayer = car.code === activeScenario.playerConfig.code;
                const isTeammate = car.code === activeScenario.teammateConfig.code;
                const isSelected = selectedCarCode === car.code;
                const displaySpeed =
                  car.currentSpeedKmH ||
                  Math.round((5400 / Math.max(60, car.lapTime || 90)) * 3.6);

                return (
                  <div
                    key={car.code}
                    role="button"
                    tabIndex={0}
                    onClick={() => setSelectedCarCode(selectedCarCode === car.code ? null : car.code)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setSelectedCarCode(selectedCarCode === car.code ? null : car.code);
                      }
                    }}
                    className={`w-full px-2.5 py-1.5 rounded-xl text-left text-xs font-mono flex items-center justify-between transition-all border cursor-pointer ${
                      car.isRetired
                        ? 'bg-red-950/20 border-red-900/40 text-slate-500 opacity-60'
                        : isPlayer
                        ? ersBoostUsedThisLap || activePuMode === 'push'
                          ? 'bg-purple-950/60 border-purple-500 text-purple-200 font-bold shadow-sm'
                          : 'bg-red-950/50 border-red-500/80 text-white font-bold shadow-sm'
                        : isTeammate
                        ? 'bg-emerald-950/40 border-emerald-500/60 text-emerald-200'
                        : isSelected
                        ? 'bg-sky-950/60 border-sky-400 text-sky-200 font-bold'
                        : 'bg-slate-900/60 border-white/5 text-slate-300 hover:bg-slate-800/80 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className={`w-6 text-[11px] font-racing font-bold shrink-0 ${
                          car.isRetired ? 'text-red-400' : 'text-slate-400'
                        }`}
                      >
                        {car.isRetired ? 'DNF' : `P${car.position}`}
                      </span>
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: car.isRetired ? '#64748b' : car.color }}
                      />
                      <span className="font-bold text-xs truncate">{car.code}</span>
                      <span className="px-1.5 py-0.2 rounded bg-slate-800 text-[9px] font-bold text-amber-300 shrink-0">
                        {car.tyreCompound} ({car.tyreAge}L)
                      </span>
                      {isPlayer && (
                        <span
                          className={`px-1 py-0.2 rounded text-[8px] font-black ${
                            ersBoostUsedThisLap || activePuMode === 'push'
                              ? 'bg-purple-600 text-white'
                              : 'bg-red-600 text-white'
                          }`}
                        >
                          {ersBoostUsedThisLap || activePuMode === 'push' ? 'YOU⚡OT' : 'YOU'}
                        </span>
                      )}
                      {(() => {
                        const effectiveLapTime = currentSnapshot?.isSC ? Math.max(60, activeScenario.circuit.baseLapTime * 1.42) : Math.max(60, activeScenario.circuit.baseLapTime);
                        const pitLossSec = currentSnapshot?.isSC ? 11.5 : 22.0;
                        const effectiveGap = car.isPitting ? Math.max(0, car.gapToLeader - pitLossSec) : car.gapToLeader;
                        const carTrackPct = ((lapProgressPct - (effectiveGap / effectiveLapTime) * 100) % 100 + 100) % 100;
                        const isCarInPit = car.isPitting && (carTrackPct >= 90.0 || carTrackPct <= 4.0);
                        const isCarInLap = car.isPitting && (carTrackPct >= 78.0 && carTrackPct < 90.0);
                        if (isCarInPit) {
                          return (
                            <span className="px-1 py-0.2 rounded bg-amber-500 text-slate-950 text-[8px] font-black animate-pulse">
                              PIT
                            </span>
                          );
                        }
                        if (isCarInLap) {
                          return (
                            <span className="px-1 py-0.2 rounded bg-amber-600/90 text-amber-100 text-[8px] font-bold">
                              IN-LAP
                            </span>
                          );
                        }
                        return null;
                      })()}
                    </div>

                    <div className="text-right shrink-0">
                      {car.isRetired ? (
                        <span className="text-[9px] text-red-400 font-bold">
                          {car.retirementReason || 'リタイア'}
                        </span>
                      ) : (
                        <div className="flex flex-col items-end leading-none">
                          <span className="text-[11px] text-slate-200 font-bold">
                            {car.position === 1 ? 'LEAD' : `+${car.gapToLeader.toFixed(1)}s`}
                          </span>
                          <span className="text-[9px] text-slate-400">{displaySpeed} km/h</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Pit Exit Window Mini Card */}
          <div className="bg-slate-900/90 rounded-xl border border-white/10 p-2.5 text-xs font-mono shrink-0">
            <div className="flex items-center justify-between text-[11px] mb-1">
              <span className="text-slate-400">想定復帰順位:</span>
              <span className="font-racing font-bold text-sm text-cyan-300">
                P{pitExitTraffic.predictedExitPosition}
              </span>
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-400">
              <span>前方ギャップ: +{pitExitTraffic.gapAheadSeconds.toFixed(1)}s</span>
              <span>後方ギャップ: +{pitExitTraffic.gapBehindSeconds.toFixed(1)}s</span>
            </div>
          </div>
        </div>

        {/* Center: Huge Circuit Radar (lg:col-span-6) */}
        <div className="lg:col-span-6 flex flex-col h-full overflow-hidden">
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
            className="h-full border-cyan-500/30 shadow-2xl"
          />
        </div>

        {/* Right: Tactical Command & Telemetry Deck (lg:col-span-3) */}
        <div className="lg:col-span-3 flex flex-col gap-2 overflow-y-auto pr-1 scrollbar-thin h-full">
          {/* Box Call Action Button (with Speech Audio!) */}
          <div className="bg-slate-900/90 rounded-2xl border border-white/10 p-3 space-y-2.5 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="font-racing font-bold text-xs text-white flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-amber-400" /> PIT STRATEGY
              </span>
              <span
                className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold ${
                  boxQueuedForNextLap
                    ? 'bg-amber-500 text-slate-950 animate-pulse'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {boxQueuedForNextLap ? 'BOX QUEUED' : 'STAY OUT'}
              </span>
            </div>

            <button
              type="button"
              onClick={() => {
                ensureAudioContextResumed();
                handleToggleBoxNextLap();
              }}
              className={`w-full py-2.5 px-3 rounded-xl font-racing font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg ${
                boxQueuedForNextLap
                  ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/30 animate-pulse'
                  : 'bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white shadow-red-950/50'
              }`}
            >
              <Fuel className="w-4 h-4" />
              <span>{boxQueuedForNextLap ? '⚠️ CANCEL BOX CALL' : '🚨 BOX THIS / NEXT LAP'}</span>
            </button>

            {/* Tyre Compound Selector */}
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-slate-400 block">交換予定タイヤ:</span>
              <div className="grid grid-cols-4 gap-1">
                {(['SOFT', 'MEDIUM', 'HARD', 'INTER'] as const).map((comp) => (
                  <button
                    key={comp}
                    type="button"
                    onClick={() => handleCompoundChange(comp)}
                    className={`py-1 rounded-lg text-xs font-racing font-bold border transition-all ${
                      nextCompoundChoice === comp
                        ? comp === 'SOFT'
                          ? 'bg-red-950 text-red-300 border-red-500'
                          : comp === 'MEDIUM'
                          ? 'bg-yellow-950 text-yellow-300 border-yellow-500'
                          : comp === 'HARD'
                          ? 'bg-slate-800 text-white border-white'
                          : 'bg-emerald-950 text-emerald-300 border-emerald-500'
                        : 'bg-slate-950 text-slate-400 border-white/5 hover:text-white'
                    }`}
                  >
                    {comp}
                  </button>
                ))}
              </div>
            </div>

            {/* ERS & PU Mode Buttons */}
            <div className="grid grid-cols-2 gap-1.5 pt-1">
              <button
                type="button"
                onClick={handleToggleErs}
                className={`py-1.5 px-2 rounded-lg text-xs font-racing font-bold flex items-center justify-center gap-1 border transition-all ${
                  ersBoostUsedThisLap
                    ? 'bg-purple-950 text-purple-300 border-purple-500 shadow-md shadow-purple-950 animate-pulse'
                    : 'bg-slate-950 text-slate-400 border-white/10 hover:text-white'
                }`}
              >
                <Zap className="w-3.5 h-3.5 text-purple-400" />
                <span>{ersBoostUsedThisLap ? 'ERS BOOST ON' : 'ERS OVERTAKE'}</span>
              </button>

              <button
                type="button"
                onClick={() => handlePuModeChange(activePuMode === 'push' ? 'standard' : 'push')}
                className={`py-1.5 px-2 rounded-lg text-xs font-racing font-bold flex items-center justify-center gap-1 border transition-all ${
                  activePuMode === 'push'
                    ? 'bg-red-950 text-red-300 border-red-500 shadow-md shadow-red-950 animate-pulse'
                    : 'bg-slate-950 text-slate-400 border-white/10 hover:text-white'
                }`}
              >
                <Flame className="w-3.5 h-3.5 text-red-400" />
                <span>{activePuMode === 'push' ? 'PU: PUSH' : 'PU: STD'}</span>
              </button>
            </div>
          </div>

          {/* Rain Radar & Crossover in Fullscreen */}
          <div className="bg-slate-900/90 rounded-2xl border border-white/10 p-3 space-y-2 text-xs font-mono shadow-xl">
            <div className="flex items-center justify-between">
              <span className="font-racing font-bold text-white flex items-center gap-1.5">
                <CloudRain className="w-3.5 h-3.5 text-cyan-400" /> WEATHER DOPPLER
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-800 text-cyan-300 font-bold text-[10px]">
                {currentSnapshot?.rainRadar.waterDepthMm.toFixed(2)} mm
              </span>
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-400">
              <span>路面状態:</span>
              <span className="font-bold text-slate-200">
                {currentSnapshot?.rainRadar.trackPhase === 'DRY'
                  ? '☀️ 完全ドライ'
                  : currentSnapshot?.rainRadar.trackPhase === 'DAMP'
                  ? '🌦️ ダンプ (滑りやすい)'
                  : currentSnapshot?.rainRadar.trackPhase === 'WET'
                  ? '🌧️ ウェット (水膜)'
                  : '⚡ ドライライン形成中'}
              </span>
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-400">
              <span>推奨タイヤ:</span>
              <span className="font-bold text-amber-300">
                {currentSnapshot?.rainRadar.crossover.currentBestCompound}
              </span>
            </div>
          </div>

          {/* Live Radio Dialogue in Fullscreen */}
          {currentSnapshot?.activeRadioPrompt && (
            <div className="bg-gradient-to-br from-amber-950/60 to-slate-900 rounded-2xl border border-amber-500/50 p-3 space-y-2 shadow-xl animate-in fade-in">
              <div className="flex items-center gap-2 text-xs font-racing font-bold text-amber-300">
                <Radio className="w-4 h-4 text-amber-400 animate-pulse" />
                <span>{currentSnapshot.activeRadioPrompt.speaker} からの緊急無線</span>
              </div>
              <p className="text-xs text-slate-200 bg-black/40 p-2 rounded-lg border border-white/5 font-mono">
                &quot;{currentSnapshot.activeRadioPrompt.message}&quot;
              </p>
              <div className="space-y-1">
                {currentSnapshot.activeRadioPrompt.options.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() =>
                      handleRadioResponse(currentSnapshot.activeRadioPrompt!.id, opt)
                    }
                    className="w-full text-left p-2 rounded-lg text-xs font-mono bg-slate-800/80 hover:bg-amber-600 hover:text-slate-950 text-slate-200 border border-white/10 transition-all"
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FullScreenCockpitOverlay;
