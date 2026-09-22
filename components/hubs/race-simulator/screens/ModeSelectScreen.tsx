'use client';

import React from 'react';
import {
  Award,
  Trophy,
  SlidersHorizontal,
  Zap,
  Flag,
  ShieldAlert,
  Compass,
  CheckCircle2,
  RotateCcw,
} from 'lucide-react';
import type { SavedCareerData } from '@/lib/raceDebriefAnalysis';
import {
  SIM_CIRCUITS,
  GRID_DRIVERS,
  PRESET_CHALLENGES,
  MISSION_CHALLENGES,
  type WeatherType,
  type IncidentFrequency,
  type ChallengeScenario,
} from '@/lib/raceSimulationEngine';
import type { GameMajorCategory, ChallengeModeType } from '../types';

export interface ModeSelectScreenProps {
  careerData: SavedCareerData;
  majorCategory: GameMajorCategory;
  setMajorCategory: (cat: GameMajorCategory) => void;
  gameMode: ChallengeModeType;
  setGameMode: (mode: ChallengeModeType) => void;
  presetIdx: number;
  selectedMissionIdx: number;
  customScenario: ChallengeScenario | null;
  setCustomScenario: (sc: ChallengeScenario | null) => void;
  selectedCircuitId: string;
  setSelectedCircuitId: (id: string) => void;
  selectedPlayerCode: string;
  setSelectedPlayerCode: (code: string) => void;
  sandboxLaps: number;
  setSandboxLaps: (laps: number) => void;
  sandboxWeather: WeatherType;
  setSandboxWeather: (w: WeatherType) => void;
  sandboxRainLap: number;
  setSandboxRainLap: (lap: number) => void;
  sandboxIncidentFreq: IncidentFrequency;
  setSandboxIncidentFreq: (freq: IncidentFrequency) => void;
  startPresetCrisis: (idx: number) => void;
  startSprintRace: (circuitId: string, playerCode: string) => void;
  startMission: (idx: number) => void;
  startProceduralCrisis: () => void;
  startSandboxMode: (overrides?: {
    circuitId?: string;
    playerCode?: string;
    totalLaps?: number;
    weatherType?: WeatherType;
    rainStartLap?: number;
    incidentFrequency?: IncidentFrequency;
  }) => void;
  onOpenCareerModal: () => void;
}

export const ModeSelectScreen: React.FC<ModeSelectScreenProps> = ({
  careerData,
  majorCategory,
  setMajorCategory,
  gameMode,
  setGameMode,
  presetIdx,
  selectedMissionIdx,
  customScenario,
  setCustomScenario,
  selectedCircuitId,
  setSelectedCircuitId,
  selectedPlayerCode,
  setSelectedPlayerCode,
  sandboxLaps,
  setSandboxLaps,
  sandboxWeather,
  setSandboxWeather,
  sandboxRainLap,
  setSandboxRainLap,
  sandboxIncidentFreq,
  setSandboxIncidentFreq,
  startPresetCrisis,
  startSprintRace,
  startMission,
  startProceduralCrisis,
  startSandboxMode,
  onOpenCareerModal,
}) => {
  return (
    <div className="space-y-4 animate-in fade-in zoom-in-95 duration-300">
      {/* 1. Strategist Career Status Hero Card */}
      <div className="glass-card-premium p-4 sm:p-5 rounded-3xl border-2 border-red-500/40 shadow-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-red-950/30">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-600 via-rose-600 to-amber-600 flex items-center justify-center text-3xl shadow-xl shadow-red-950/60 border border-red-400/40 shrink-0">
              🏆
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-amber-400 font-bold tracking-wider uppercase">
                  FIA STRATEGIST LICENSE
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-red-600 text-white font-racing font-black text-xs shadow-md">
                  GRADE {careerData.grade}
                </span>
              </div>
              <h2 className="font-racing font-black text-white text-xl sm:text-2xl tracking-wide">
                F1 ピットウォール司令塔シミュレーター
              </h2>
              <p className="text-xs text-slate-300 mt-0.5">
                レース戦略の最高責任者として、22台が凌ぎを削る過酷なグランプリで栄冠を勝ち取れ。
              </p>
            </div>
          </div>

          {/* Career Stats Grid */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 shrink-0">
            <div className="px-3 py-2 rounded-xl bg-slate-950/80 border border-white/10 text-center min-w-[75px]">
              <div className="text-[10px] font-mono text-slate-400">累計CP</div>
              <div className="font-racing font-bold text-amber-400 text-sm sm:text-base">
                {careerData.totalCp.toLocaleString()}
              </div>
            </div>
            <div className="px-3 py-2 rounded-xl bg-slate-950/80 border border-amber-500/30 text-center min-w-[75px] shadow-sm">
              <div className="text-[10px] font-mono text-amber-400 font-bold">トロフィー</div>
              <div className="font-racing font-bold text-amber-300 text-sm sm:text-base flex items-center justify-center gap-1">
                <span>🏆</span>
                <span>{Object.keys(careerData.clearedScenarios || {}).length}</span>
                <span className="text-[10px] text-slate-400 font-normal">
                  ({Object.values(careerData.clearedScenarios || {}).filter(c => c.trophy === 'gold').length}金)
                </span>
              </div>
            </div>
            <div className="px-3 py-2 rounded-xl bg-slate-950/80 border border-white/10 text-center min-w-[75px]">
              <div className="text-[10px] font-mono text-slate-400">戦術バッジ</div>
              <div className="font-racing font-bold text-cyan-300 text-sm sm:text-base">
                {careerData.unlockedBadgeIds.length} / 25
              </div>
            </div>
            <div className="px-3 py-2 rounded-xl bg-slate-950/80 border border-white/10 text-center min-w-[75px]">
              <div className="text-[10px] font-mono text-slate-400">通算戦績</div>
              <div className="font-racing font-bold text-white text-sm sm:text-base">
                {careerData.totalWins}勝 / {careerData.totalRacesCompleted}戦
              </div>
            </div>
            <div className="px-3 py-2 rounded-xl bg-slate-950/80 border border-white/10 text-center min-w-[75px]">
              <div className="text-[10px] font-mono text-slate-400">最高得点</div>
              <div className="font-racing font-bold text-emerald-400 text-sm sm:text-base">
                {careerData.highestScore}点
              </div>
            </div>

            <button
              type="button"
              onClick={onOpenCareerModal}
              className="btn-console px-3.5 py-2.5 text-xs font-racing font-bold text-amber-300 border-amber-500/40 hover:bg-amber-950/60 flex items-center gap-1.5 shadow-lg shadow-amber-950/30"
            >
              <Award className="w-4 h-4 text-amber-400" />
              <span>キャリア手帳 ➔</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Major Category Selector (実践 vs 自由練習) */}
      <div className="glass-card-premium p-4 rounded-2xl border border-white/10 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
          <div>
            <span className="text-xs font-mono text-slate-400 font-bold uppercase tracking-wider block">
              SELECT GAME MODE / ゲームモード選択
            </span>
            <p className="text-xs text-slate-300">
              挑戦したいカテゴリーを選択してください。
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-white/10">
            <button
              type="button"
              onClick={() => {
                setMajorCategory('battle');
                if (gameMode === 'sandbox') {
                  startPresetCrisis(presetIdx);
                }
              }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-racing font-bold transition-all cursor-pointer ${
                majorCategory === 'battle'
                  ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md shadow-red-950 ring-1 ring-red-400/50'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Trophy className="w-3.5 h-3.5 text-yellow-400" />
              <span>⚔️ 実践モード (本番チャレンジ)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setMajorCategory('practice');
                startSandboxMode();
              }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-racing font-bold transition-all cursor-pointer ${
                majorCategory === 'practice'
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-950 ring-1 ring-cyan-400/50'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-300" />
              <span>🔬 自由練習 (Sandbox Lab)</span>
            </button>
          </div>
        </div>

        {/* Sub-modes for Battle */}
        {majorCategory === 'battle' ? (
          <div className="space-y-4">
            {/* Sub-mode Tab Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setGameMode('crisis');
                  setCustomScenario(null);
                }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-racing font-bold transition-all border cursor-pointer ${
                  gameMode === 'crisis' || gameMode === 'scenario'
                    ? 'bg-red-950/80 border-red-500 text-white shadow-lg shadow-red-950/50'
                    : 'bg-slate-900/80 border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>📜 名場面シナリオ (5-9周)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setGameMode('sprint');
                  startSprintRace(selectedCircuitId, selectedPlayerCode);
                }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-racing font-bold transition-all border cursor-pointer ${
                  gameMode === 'sprint'
                    ? 'bg-red-950/80 border-red-500 text-white shadow-lg shadow-red-950/50'
                    : 'bg-slate-900/80 border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                <Flag className="w-3.5 h-3.5 text-yellow-400" />
                <span>🏆 スプリント全周回 (15-20周)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setGameMode('mission');
                  startMission(selectedMissionIdx);
                }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-racing font-bold transition-all border cursor-pointer ${
                  gameMode === 'mission'
                    ? 'bg-purple-950/80 border-purple-500 text-white shadow-lg shadow-purple-950/50'
                    : 'bg-slate-900/80 border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5 text-purple-400" />
                <span>🎯 特務ミッション (特殊指令)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setGameMode('procedural');
                  startProceduralCrisis();
                }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-racing font-bold transition-all border cursor-pointer ${
                  gameMode === 'procedural'
                    ? 'bg-pink-950/80 border-pink-500 text-white shadow-lg shadow-pink-950/50'
                    : 'bg-slate-900/80 border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                <Compass className="w-3.5 h-3.5 text-pink-400" />
                <span>🎲 突発クライシス (一期一会)</span>
              </button>
            </div>

            {/* Sub-mode 1: Preset Scenarios Grid */}
            {(gameMode === 'crisis' || gameMode === 'scenario') && (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-racing text-slate-300 font-bold">
                    シナリオを選択してブリーフィングへ進む:
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    全{PRESET_CHALLENGES.length}シナリオ収録
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {PRESET_CHALLENGES.map((sc, idx) => {
                    const isActive = presetIdx === idx && !customScenario;
                    const clearRecord = careerData.clearedScenarios?.[sc.id];
                    return (
                      <button
                        key={sc.id}
                        type="button"
                        onClick={() => startPresetCrisis(idx)}
                        className={`text-left p-3.5 rounded-2xl border transition-all relative overflow-hidden flex flex-col justify-between gap-2.5 group cursor-pointer ${
                          isActive
                            ? 'bg-gradient-to-br from-red-950/80 to-slate-900 border-red-500 ring-2 ring-red-500 shadow-xl shadow-red-950/60'
                            : 'bg-slate-900/90 border-white/10 hover:border-red-500/60 hover:bg-slate-855'
                        }`}
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-xs font-mono text-slate-300 flex items-center gap-1.5">
                              <span className="text-base">{sc.circuit.flag}</span>
                              <span className="font-bold">{sc.circuit.name}</span>
                            </span>
                            <div className="flex items-center gap-1">
                              {clearRecord && (
                                <span
                                  className={`px-1.5 py-0.5 rounded text-[10px] font-racing font-bold flex items-center gap-0.5 shadow-sm ${
                                    clearRecord.trophy === 'gold'
                                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50'
                                      : clearRecord.trophy === 'silver'
                                      ? 'bg-slate-300/20 text-slate-200 border border-slate-400/50'
                                      : 'bg-amber-800/30 text-amber-400 border border-amber-700/50'
                                  }`}
                                >
                                  <span>{clearRecord.trophy === 'gold' ? '🏆 GOLD' : clearRecord.trophy === 'silver' ? '🥈 SILVER' : '🥉 BRONZE'}</span>
                                </span>
                              )}
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold ${
                                  sc.difficulty === 'hard'
                                    ? 'bg-red-900/60 text-red-300 border border-red-500/30'
                                    : sc.difficulty === 'normal'
                                    ? 'bg-amber-900/60 text-amber-300 border border-amber-500/30'
                                    : 'bg-emerald-900/60 text-emerald-300 border border-emerald-500/30'
                                }`}
                              >
                                {sc.difficulty}
                              </span>
                            </div>
                          </div>
                          <h4 className="font-racing font-bold text-white text-sm group-hover:text-red-400 transition-colors">
                            {sc.title}
                          </h4>
                          <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                            {sc.description}
                          </p>
                        </div>

                        <div className="flex items-center justify-between text-xs font-mono pt-2 border-t border-white/10 text-slate-400">
                          <span className="text-red-400 font-bold">目標: P{sc.targetPosition}以内</span>
                          <span>全{sc.totalLaps}周</span>
                          <span className="text-amber-300 flex items-center gap-1">
                            {clearRecord ? (
                              <span className="text-emerald-400 font-bold flex items-center gap-0.5">
                                <CheckCircle2 className="w-3 h-3 text-emerald-400" /> 制覇済
                              </span>
                            ) : (
                              <span>作戦室へ ➔</span>
                            )}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Sub-mode 2: Sprint Race Setup */}
            {gameMode === 'sprint' && (
              <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-950 to-red-950/40 border border-red-500/30 space-y-4">
                <div className="flex items-center gap-2">
                  <Flag className="w-5 h-5 text-yellow-400" />
                  <div>
                    <h4 className="font-racing font-bold text-white text-sm sm:text-base">
                      スプリントレース (15〜20周・本格周回バトル)
                    </h4>
                    <p className="text-xs text-slate-300">
                      サーキットと担当ドライバーを選択し、フルグリッド22台との戦略戦に挑みます。
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-slate-900 border border-white/10 space-y-1">
                    <label className="text-xs font-mono text-slate-400 block">開催サーキット</label>
                    <select
                      value={selectedCircuitId}
                      onChange={(e) => setSelectedCircuitId(e.target.value)}
                      className="w-full bg-slate-950 text-white font-racing font-bold text-sm p-2 rounded-lg border border-white/10 cursor-pointer focus:outline-none"
                    >
                      {SIM_CIRCUITS.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.flag} {c.name} ({c.country})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900 border border-white/10 space-y-1">
                    <label className="text-xs font-mono text-slate-400 block">担当自車ドライバー</label>
                    <select
                      value={selectedPlayerCode}
                      onChange={(e) => setSelectedPlayerCode(e.target.value)}
                      className="w-full bg-slate-950 text-white font-racing font-bold text-sm p-2 rounded-lg border border-white/10 cursor-pointer focus:outline-none"
                    >
                      {GRID_DRIVERS.map((d) => (
                        <option key={d.code} value={d.code}>
                          #{d.number} {d.name} ({d.team})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => startSprintRace(selectedCircuitId, selectedPlayerCode)}
                    className="btn-console-primary px-6 py-2.5 text-xs font-racing font-bold flex items-center gap-2 shadow-xl shadow-red-950"
                  >
                    <span>🚀 スプリントレース作戦室へ進む ➔</span>
                  </button>
                </div>
              </div>
            )}

            {/* Sub-mode 3: Grand Missions Grid */}
            {gameMode === 'mission' && (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-racing text-slate-300 font-bold">
                    特務ミッションを選択してブリーフィングへ進む:
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    全{MISSION_CHALLENGES.length}ミッション収録
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                  {MISSION_CHALLENGES.map((m, idx) => {
                    const isActive = selectedMissionIdx === idx && gameMode === 'mission';
                    const clearRecord = careerData.clearedScenarios?.[m.id];
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => startMission(idx)}
                        className={`text-left p-3.5 rounded-2xl border transition-all relative overflow-hidden flex flex-col justify-between gap-2.5 group cursor-pointer ${
                          isActive
                            ? 'bg-gradient-to-br from-purple-950/80 to-slate-900 border-purple-500 ring-2 ring-purple-500 shadow-xl shadow-purple-950/60'
                            : 'bg-slate-900/90 border-white/10 hover:border-purple-500/60 hover:bg-slate-855'
                        }`}
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-xs font-mono text-purple-300 font-bold flex items-center gap-1">
                              <span>#{m.playerConfig.number} {m.playerConfig.code}</span>
                            </span>
                            <div className="flex items-center gap-1">
                              {clearRecord && (
                                <span
                                  className={`px-1.5 py-0.5 rounded text-[10px] font-racing font-bold flex items-center gap-0.5 shadow-sm ${
                                    clearRecord.trophy === 'gold'
                                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50'
                                      : clearRecord.trophy === 'silver'
                                      ? 'bg-slate-300/20 text-slate-200 border border-slate-400/50'
                                      : 'bg-amber-800/30 text-amber-400 border border-amber-700/50'
                                  }`}
                                >
                                  <span>{clearRecord.trophy === 'gold' ? '🏆 GOLD' : clearRecord.trophy === 'silver' ? '🥈 SILVER' : '🥉 BRONZE'}</span>
                                </span>
                              )}
                              <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold bg-purple-900/60 text-purple-300 border border-purple-500/30">
                                {m.difficulty}
                              </span>
                            </div>
                          </div>
                          <h4 className="font-racing font-bold text-white text-sm group-hover:text-purple-400 transition-colors">
                            {m.title}
                          </h4>
                          <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                            {m.description}
                          </p>
                        </div>

                        <div className="flex items-center justify-between text-xs font-mono pt-2 border-t border-white/10 text-slate-400">
                          <span className="text-purple-300 font-bold">目標: P{m.targetPosition}以内</span>
                          <span>全{m.totalLaps}周</span>
                          <span className="text-purple-300">
                            {clearRecord ? (
                              <span className="text-emerald-400 font-bold flex items-center gap-0.5">
                                <CheckCircle2 className="w-3 h-3 text-emerald-400" /> 制覇済
                              </span>
                            ) : (
                              <span>作戦室へ ➔</span>
                            )}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Sub-mode 4: Procedural Crisis */}
            {gameMode === 'procedural' && (
              <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-950 to-pink-950/40 border border-pink-500/30 space-y-4">
                <div className="flex items-center gap-2">
                  <Compass className="w-5 h-5 text-pink-400" />
                  <div>
                    <h4 className="font-racing font-bold text-white text-sm sm:text-base">
                      突発クライシス (一期一会のランダム危機脱出)
                    </h4>
                    <p className="text-xs text-slate-300">
                      サーキット、天候急変、セーフティカー出動、前後のライバル状況がすべてランダムに生成される無限のシナリオです。
                    </p>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={startProceduralCrisis}
                    className="btn-console px-6 py-2.5 text-xs font-racing font-bold text-pink-300 border-pink-500/40 hover:bg-pink-950/60 flex items-center gap-2 shadow-xl shadow-pink-950"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>🎲 新しい突発危機を生成して作戦室へ ➔</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Practice / Sandbox Setup Panel */
          <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-950 to-cyan-950/30 border border-cyan-500/30 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-cyan-500/20">
              <div className="flex items-center gap-2">
                <span className="text-lg">🧪</span>
                <div>
                  <h4 className="font-racing font-bold text-white text-sm sm:text-base">
                    FREE PRACTICE & STRATEGY SANDBOX / 自由練習シミュレーション
                  </h4>
                  <p className="text-xs text-slate-300">
                    コース、自車、周回数、天候条件、SC頻度を完全自由にカスタムして検証できます。
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 text-xs">
              {/* Track */}
              <div className="p-2.5 rounded-xl bg-slate-900/90 border border-white/10 space-y-1">
                <label className="text-[10px] font-mono text-slate-400 block">サーキット</label>
                <select
                  value={selectedCircuitId}
                  onChange={(e) => {
                    setSelectedCircuitId(e.target.value);
                    startSandboxMode({ circuitId: e.target.value });
                  }}
                  className="w-full bg-transparent text-xs text-white font-racing font-bold focus:outline-none cursor-pointer"
                >
                  {SIM_CIRCUITS.map((c) => (
                    <option key={c.id} value={c.id} className="bg-slate-900 text-white">
                      {c.flag} {c.name.split(' ')[0]}
                    </option>
                  ))}
                </select>
              </div>

              {/* Driver */}
              <div className="p-2.5 rounded-xl bg-slate-900/90 border border-white/10 space-y-1">
                <label className="text-[10px] font-mono text-slate-400 block">自車ドライバー</label>
                <select
                  value={selectedPlayerCode}
                  onChange={(e) => {
                    setSelectedPlayerCode(e.target.value);
                    startSandboxMode({ playerCode: e.target.value });
                  }}
                  className="w-full bg-transparent text-xs text-white font-racing font-bold focus:outline-none cursor-pointer"
                >
                  {GRID_DRIVERS.map((d) => (
                    <option key={d.code} value={d.code} className="bg-slate-900 text-white">
                      #{d.number} {d.code} ({d.team.split(' ')[0]})
                    </option>
                  ))}
                </select>
              </div>

              {/* Laps */}
              <div className="p-2.5 rounded-xl bg-slate-900/90 border border-white/10 space-y-1">
                <label className="text-[10px] font-mono text-slate-400 block">周回数: {sandboxLaps}周</label>
                <select
                  value={sandboxLaps}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setSandboxLaps(val);
                    startSandboxMode({ totalLaps: val });
                  }}
                  className="w-full bg-transparent text-xs text-white font-mono focus:outline-none cursor-pointer"
                >
                  {[5, 8, 10, 15, 20].map((l) => (
                    <option key={l} value={l} className="bg-slate-900 text-white">
                      全{l}周
                    </option>
                  ))}
                </select>
              </div>

              {/* Weather */}
              <div className="p-2.5 rounded-xl bg-slate-900/90 border border-white/10 space-y-1">
                <label className="text-[10px] font-mono text-slate-400 block">天候</label>
                <select
                  value={sandboxWeather}
                  onChange={(e) => {
                    const val = e.target.value as WeatherType;
                    setSandboxWeather(val);
                    startSandboxMode({ weatherType: val });
                  }}
                  className="w-full bg-transparent text-xs text-white font-racing font-bold focus:outline-none cursor-pointer"
                >
                  <option value="dry" className="bg-slate-900 text-white">☀️ 快晴ドライ</option>
                  <option value="variable" className="bg-slate-900 text-white">⛅ 急変警戒</option>
                  <option value="drizzle" className="bg-slate-900 text-white">🌤️ 雨上がり</option>
                  <option value="monsoon" className="bg-slate-900 text-white">🌊 豪雨</option>
                </select>
              </div>

              {/* Rain Lap */}
              <div className="p-2.5 rounded-xl bg-slate-900/90 border border-white/10 space-y-1">
                <label className="text-[10px] font-mono text-slate-400 block">降雨周回</label>
                <select
                  value={sandboxRainLap}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setSandboxRainLap(val);
                    startSandboxMode({ rainStartLap: val });
                  }}
                  disabled={sandboxWeather === 'dry'}
                  className="w-full bg-transparent text-xs text-white font-mono focus:outline-none cursor-pointer disabled:opacity-40"
                >
                  {Array.from({ length: sandboxLaps }, (_, i) => i + 1).map((l) => (
                    <option key={l} value={l} className="bg-slate-900 text-white">
                      Lap {l}
                    </option>
                  ))}
                </select>
              </div>

              {/* Incident */}
              <div className="p-2.5 rounded-xl bg-slate-900/90 border border-white/10 space-y-1">
                <label className="text-[10px] font-mono text-slate-400 block">SC発生頻度</label>
                <select
                  value={sandboxIncidentFreq}
                  onChange={(e) => {
                    const val = e.target.value as IncidentFrequency;
                    setSandboxIncidentFreq(val);
                    startSandboxMode({ incidentFrequency: val });
                  }}
                  className="w-full bg-transparent text-xs text-white font-mono focus:outline-none cursor-pointer"
                >
                  <option value="none" className="bg-slate-900 text-white">OFF (なし)</option>
                  <option value="realistic" className="bg-slate-900 text-white">標準 (路面連動)</option>
                  <option value="high_chaos" className="bg-slate-900 text-white">カオス (多発)</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => startSandboxMode()}
                className="btn-console px-6 py-2.5 text-xs font-racing font-bold text-cyan-300 border-cyan-500/40 hover:bg-cyan-950/60 flex items-center gap-2 shadow-xl shadow-cyan-950"
              >
                <span>🔬 自由シミュレーション作戦室へ進む ➔</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
