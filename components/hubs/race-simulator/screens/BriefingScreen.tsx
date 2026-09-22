'use client';

import React from 'react';
import {
  CloudRain,
  Lock,
  Dices,
  Gauge,
  HelpCircle,
  Flag,
  ShieldAlert,
} from 'lucide-react';
import { PaddockLiveAtmosphere } from '@/components/pitwall/PaddockLiveAtmosphere';
import {
  BriefingSettingHelpModal,
  type BriefingHelpTopic,
} from '@/components/pitwall/BriefingSettingHelpModal';
import type { SavedCareerData } from '@/lib/raceDebriefAnalysis';
import {
  TYRE_PROPERTIES,
  type TyreCompound,
  type EnginePUMode,
  type ChallengeScenario,
  type DriverSimConfig,
  type WeatherType,
} from '@/lib/raceSimulationEngine';
import type { ChallengeModeType } from '../types';

export interface BriefingScreenProps {
  gameMode: ChallengeModeType;
  activeScenario: ChallengeScenario;
  setCustomScenario: (sc: ChallengeScenario | null) => void;
  resetGameState: () => void;
  effectivePlayerConfig: DriverSimConfig;
  customStartingTyre: TyreCompound | null;
  setCustomStartingTyre: (t: TyreCompound) => void;
  customInitialPuMode: EnginePUMode | null;
  setCustomInitialPuMode: (m: EnginePUMode) => void;
  setActivePuMode: (m: EnginePUMode) => void;
  customTargetBoxLap: number | null;
  setCustomTargetBoxLap: (lap: number) => void;
  effectiveTargetBoxLap: number;
  customTargetCompound: TyreCompound | null;
  setCustomTargetCompound: (c: TyreCompound) => void;
  nextCompoundChoice: TyreCompound;
  setNextCompoundChoice: (c: TyreCompound) => void;
  raceLengthMode: 'gp_short_25' | 'gp_full_100' | 'sprint';
  setRaceLengthMode: (m: 'gp_short_25' | 'gp_full_100' | 'sprint') => void;
  aiDifficulty: 'beginner' | 'standard' | 'master';
  setAiDifficulty: (d: 'beginner' | 'standard' | 'master') => void;
  userAssistLevel: 'assisted' | 'expert';
  setUserAssistLevel: (l: 'assisted' | 'expert') => void;
  careerData: SavedCareerData;
  briefingHelpTopic: BriefingHelpTopic | null;
  setBriefingHelpTopic: (t: BriefingHelpTopic | null) => void;
  handleRerollWeather: () => void;
  handleBackToModeSelect: () => void;
  handleStartRace: () => void;
}

export const BriefingScreen: React.FC<BriefingScreenProps> = ({
  gameMode,
  activeScenario,
  setCustomScenario,
  resetGameState,
  effectivePlayerConfig,
  customStartingTyre,
  setCustomStartingTyre,
  customInitialPuMode,
  setCustomInitialPuMode,
  setActivePuMode,
  customTargetBoxLap,
  setCustomTargetBoxLap,
  effectiveTargetBoxLap,
  customTargetCompound,
  setCustomTargetCompound,
  nextCompoundChoice,
  setNextCompoundChoice,
  raceLengthMode,
  setRaceLengthMode,
  aiDifficulty,
  setAiDifficulty,
  userAssistLevel,
  setUserAssistLevel,
  careerData,
  briefingHelpTopic,
  setBriefingHelpTopic,
  handleRerollWeather,
  handleBackToModeSelect,
  handleStartRace,
}) => {
  return (
    <div className="space-y-4 animate-in fade-in zoom-in-95 duration-300">
      {/* Briefing Header Banner */}
      <div className="glass-card-premium p-4 rounded-2xl border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-slate-950 via-slate-900 to-red-950/40">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-base">📋</span>
            <span className="font-racing font-black text-white text-base sm:text-lg tracking-wider">
              TACTICAL BRIEFING & MACHINE SETUP / 作戦ブリーフィング
            </span>
            <span className="px-2 py-0.5 rounded bg-red-600 text-white text-[10px] font-racing font-bold uppercase">
              {gameMode.toUpperCase()}
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            レース前の作戦会議。コース特性と天候レーダーを精査し、初期タイヤ・PUモード・ピット戦略を策定してください。
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleBackToModeSelect}
            className="btn-console px-3.5 py-2 text-xs font-racing font-bold text-slate-300 hover:text-white flex items-center gap-1.5"
          >
            <span>◀</span>
            <span>モード選択へ戻る</span>
          </button>
        </div>
      </div>

      {/* 🏎️ Paddock Live Cam & Garage Bay Atmosphere */}
      <PaddockLiveAtmosphere
        teamName={effectivePlayerConfig.team}
        driverCode={effectivePlayerConfig.code}
        circuitName={activeScenario.circuit.name}
        startTyre={effectivePlayerConfig.startTyre}
        puMode={effectivePlayerConfig.machineSetup.puMode}
      />

      {/* Two-Column Briefing & Setup Deck */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Circuit Specs, Objectives & Weather Radar */}
        <div className="lg:col-span-5 space-y-3">
          {/* Mission Target & Circuit Overview */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{activeScenario.circuit.flag}</span>
                <div>
                  <h3 className="font-racing font-bold text-white text-base">
                    {activeScenario.circuit.name}
                  </h3>
                  <div className="text-[11px] font-mono text-slate-400">
                    {activeScenario.circuit.country} • 全長 {(activeScenario.circuit.circuitLengthM / 1000).toFixed(3)}km
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="px-2.5 py-1 rounded-xl bg-red-950/80 border border-red-500/40 text-red-300 font-racing font-bold text-xs">
                  目標: P{activeScenario.targetPosition} 以内
                </span>
                <div className="flex items-center gap-1">
                  {careerData.clearedScenarios?.[activeScenario.id] && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-racing font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1 shadow-sm">
                      <span>
                        {careerData.clearedScenarios[activeScenario.id].trophy === 'gold'
                          ? '🏆 GOLD'
                          : careerData.clearedScenarios[activeScenario.id].trophy === 'silver'
                          ? '🥈 SILVER'
                          : '🥉 BRONZE'}
                      </span>
                      <span>獲得済</span>
                    </span>
                  )}
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold ${
                      activeScenario.difficulty === 'hard'
                        ? 'bg-red-900/60 text-red-300 border border-red-500/30'
                        : activeScenario.difficulty === 'normal'
                        ? 'bg-amber-900/60 text-amber-300 border border-amber-500/30'
                        : 'bg-emerald-900/60 text-emerald-300 border border-emerald-500/30'
                    }`}
                  >
                    難易度: {activeScenario.difficulty}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-white/10 space-y-1">
              <div className="text-[11px] font-racing font-bold text-amber-300">
                {activeScenario.title}
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {activeScenario.description}
              </p>
            </div>

            {/* Circuit Specs Matrix */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
              <div className="p-2 rounded-lg bg-slate-950/60 border border-white/5">
                <div className="text-[10px] text-slate-400">ピットロスタイム</div>
                <div className="text-cyan-300 font-bold">{activeScenario.circuit.pitLaneLoss}s</div>
              </div>
              <div className="p-2 rounded-lg bg-slate-950/60 border border-white/5">
                <div className="text-[10px] text-slate-400">オーバーテイク</div>
                <div className="text-amber-300 font-bold capitalize">{activeScenario.circuit.overtakeDifficulty}</div>
              </div>
              <div className="p-2 rounded-lg bg-slate-950/60 border border-white/5">
                <div className="text-[10px] text-slate-400">タイヤ攻撃性</div>
                <div className="text-rose-300 font-bold capitalize">{activeScenario.circuit.tyreAggression}</div>
              </div>
            </div>
          </div>

          {/* Weather Radar & SC Risk Forecast */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-racing font-bold text-white text-xs flex items-center gap-1.5">
                  <CloudRain className="w-4 h-4 text-sky-400" /> 天候ドップラーレーダー予報
                </span>
                {activeScenario.lockedSettings?.weather && (
                  <span className="px-1.5 py-0.2 rounded bg-amber-950/80 border border-amber-500/40 text-[9px] font-mono text-amber-300 flex items-center gap-0.5">
                    <Lock className="w-2.5 h-2.5" /> シナリオ固定
                  </span>
                )}
              </div>
              {!activeScenario.lockedSettings?.weather && (
                <button
                  type="button"
                  onClick={handleRerollWeather}
                  className="btn-console px-2 py-1 text-[11px] text-cyan-300 border-cyan-500/30 hover:bg-cyan-950/50 flex items-center gap-1"
                  title="天候やSC確率を再抽選"
                >
                  <Dices className="w-3.5 h-3.5 text-cyan-400" />
                  <span>🎲 天候再抽選</span>
                </button>
              )}
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-white/10 space-y-2">
              <div className="flex items-center gap-2 text-xs">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-400 animate-ping" />
                <span className="text-slate-200 font-mono text-[11px] leading-relaxed">
                  {activeScenario.weatherForecast.radarDesc}
                </span>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-mono text-slate-400">
                  <span>降水確率: {activeScenario.weatherForecast.rainProbabilityPercent}%</span>
                  <span>
                    {activeScenario.actualRainLap
                      ? `Lap ${activeScenario.actualRainLap} 前後に雨雲到達`
                      : 'セッション中の降雨なし'}
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-sky-500 to-blue-600 transition-all duration-500"
                    style={{ width: `${activeScenario.weatherForecast.rainProbabilityPercent}%` }}
                  />
                </div>
              </div>
            </div>

            {activeScenario.lockedSettings?.weather && activeScenario.lockedSettings.lockReason && (
              <div className="p-2 rounded-lg bg-amber-950/40 border border-amber-500/30 text-[10px] font-mono text-amber-300/90 flex items-start gap-1.5">
                <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span>{activeScenario.lockedSettings.lockReason}</span>
              </div>
            )}

            {/* Weather Customizer Controls */}
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className={`p-2 rounded-lg bg-slate-950/80 border border-white/5 space-y-1 ${activeScenario.lockedSettings?.weather ? 'opacity-60' : ''}`}>
                <span className="text-[10px] font-mono text-slate-400 block flex items-center justify-between">
                  <span>天候タイプ</span>
                  {activeScenario.lockedSettings?.weather && <Lock className="w-2.5 h-2.5 text-amber-400" />}
                </span>
                <select
                  value={activeScenario.startWeather}
                  disabled={Boolean(activeScenario.lockedSettings?.weather)}
                  onChange={(e) => {
                    const newWeather = e.target.value as WeatherType;
                    const hasRain = newWeather !== 'dry';
                    const rainLap = hasRain ? Math.max(2, Math.floor(activeScenario.totalLaps * 0.4)) : undefined;
                    const intensity = newWeather === 'monsoon' ? 4.5 : newWeather === 'drizzle' ? 1.5 : hasRain ? 2.5 : 0;
                    const updated: ChallengeScenario = {
                      ...activeScenario,
                      id: `${activeScenario.id}_custom_${Date.now()}`,
                      startWeather: newWeather,
                      weatherForecast: {
                        radarDesc: newWeather === 'monsoon'
                          ? '豪雨モンスーン警戒。路面水量4.5mm到達予想。'
                          : newWeather === 'drizzle'
                          ? '雨上がりダンプ路面。急速ドライライン形成予想。'
                          : hasRain
                          ? `雨雲接近中。Lap ${rainLap}前後に降雨予想。`
                          : '快晴ドライコンディション。天候安定。',
                        estimatedLapMin: rainLap ? Math.max(1, rainLap - 1) : 99,
                        estimatedLapMax: rainLap ? Math.min(activeScenario.totalLaps, rainLap + 2) : 99,
                        rainProbabilityPercent: hasRain ? 85 : 5,
                      },
                      actualRainLap: rainLap,
                      actualRainIntensity: intensity,
                    };
                    setCustomScenario(updated);
                    resetGameState();
                  }}
                  className="w-full bg-transparent text-xs text-white font-racing font-bold focus:outline-none cursor-pointer disabled:cursor-not-allowed"
                >
                  <option value="dry" className="bg-slate-900 text-white">☀️ 快晴</option>
                  <option value="variable" className="bg-slate-900 text-white">⛅ 急変</option>
                  <option value="drizzle" className="bg-slate-900 text-white">🌤️ ダンプ</option>
                  <option value="monsoon" className="bg-slate-900 text-white">🌊 豪雨</option>
                </select>
              </div>

              <div className={`p-2 rounded-lg bg-slate-950/80 border border-white/5 space-y-1 ${activeScenario.lockedSettings?.rainLap || activeScenario.lockedSettings?.weather ? 'opacity-60' : ''}`}>
                <span className="text-[10px] font-mono text-slate-400 block flex items-center justify-between">
                  <span>降雨周回</span>
                  {(activeScenario.lockedSettings?.rainLap || activeScenario.lockedSettings?.weather) && <Lock className="w-2.5 h-2.5 text-amber-400" />}
                </span>
                <select
                  value={activeScenario.actualRainLap || 99}
                  disabled={Boolean(activeScenario.lockedSettings?.rainLap || activeScenario.lockedSettings?.weather)}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    const updated: ChallengeScenario = {
                      ...activeScenario,
                      id: `${activeScenario.id}_custom_${Date.now()}`,
                      actualRainLap: val === 99 ? undefined : val,
                      actualRainIntensity: val === 99 ? 0 : (activeScenario.actualRainIntensity || 2.5),
                    };
                    setCustomScenario(updated);
                    resetGameState();
                  }}
                  className="w-full bg-transparent text-xs text-white font-mono focus:outline-none cursor-pointer disabled:cursor-not-allowed"
                >
                  <option value={99}>降雨なし</option>
                  {Array.from({ length: activeScenario.totalLaps }, (_, i) => i + 1).map((l) => (
                    <option key={l} value={l} className="bg-slate-900 text-white">
                      Lap {l}
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-2 rounded-lg bg-slate-950/80 border border-white/5 space-y-1">
                <span className="text-[10px] font-mono text-slate-400 block">SC危険度</span>
                <select
                  value={activeScenario.scProbability > 0.7 ? 'high' : activeScenario.scProbability > 0.3 ? 'normal' : 'low'}
                  onChange={(e) => {
                    const prob = e.target.value === 'high' ? 0.85 : e.target.value === 'normal' ? 0.45 : 0.1;
                    const updated: ChallengeScenario = {
                      ...activeScenario,
                      id: `${activeScenario.id}_custom_${Date.now()}`,
                      scProbability: prob,
                      actualScLap: prob > 0.4 ? Math.max(2, Math.floor(activeScenario.totalLaps * 0.5)) : undefined,
                    };
                    setCustomScenario(updated);
                    resetGameState();
                  }}
                  className="w-full bg-transparent text-xs text-white font-mono focus:outline-none cursor-pointer"
                >
                  <option value="low" className="bg-slate-900 text-white">低 (安全)</option>
                  <option value="normal" className="bg-slate-900 text-white">中 (標準)</option>
                  <option value="high" className="bg-slate-900 text-white">高 (波乱)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Machine Strategy & Difficulty Setup */}
        <div className="lg:col-span-7 space-y-3">
          {/* Machine Initial Setup Deck */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-white/10 space-y-3">
            <span className="font-racing font-bold text-white text-xs flex items-center gap-1.5">
              <Gauge className="w-4 h-4 text-red-400" /> マシン初期戦術セットアップ
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {/* Starting Tyre Selector */}
              <div className="p-3 rounded-xl bg-slate-950/80 border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-racing text-slate-300 font-bold text-[11px] flex items-center gap-1">
                    <span>スタート装着タイヤ</span>
                    {activeScenario.lockedSettings?.startTyre && (
                      <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-amber-950/80 border border-amber-500/40 text-amber-300 flex items-center gap-0.5">
                        <Lock className="w-2.5 h-2.5" /> 固定
                      </span>
                    )}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono text-emerald-400 font-bold">
                      {effectivePlayerConfig.startTyre}
                    </span>
                    <button
                      type="button"
                      onClick={() => setBriefingHelpTopic('start_tyre')}
                      className="p-0.5 rounded text-slate-400 hover:text-cyan-300 hover:bg-slate-800 transition-all cursor-pointer"
                      title="スタートタイヤの戦術・ルール解説"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-5 gap-1 pt-1">
                  {(['SOFT', 'MEDIUM', 'HARD', 'INTER', 'WET'] as TyreCompound[]).map((cmp) => {
                    const isSelected = effectivePlayerConfig.startTyre === cmp;
                    const isLocked = Boolean(activeScenario.lockedSettings?.startTyre);
                    const prop = TYRE_PROPERTIES[cmp];
                    return (
                      <button
                        key={cmp}
                        type="button"
                        disabled={isLocked}
                        onClick={() => !isLocked && setCustomStartingTyre(cmp)}
                        className={`p-2 rounded-lg flex flex-col items-center gap-1 border transition-all text-center ${
                          isSelected
                            ? 'bg-red-950 border-red-500 text-white shadow-lg ring-1 ring-red-500'
                            : isLocked
                            ? 'bg-slate-950/40 border-white/5 text-slate-600 opacity-30 cursor-not-allowed'
                            : 'bg-slate-900 border-white/10 text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer'
                        }`}
                        title={
                          isLocked
                            ? `${cmp} (シナリオ前提条件として固定されています)`
                            : `${cmp} (${prop.label}): 適正水深 ${prop.optimalWaterRange[0]}〜${prop.optimalWaterRange[1]}mm`
                        }
                      >
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: prop.color }}
                        />
                        <span className="font-racing font-bold text-[10px]">{cmp}</span>
                      </button>
                    );
                  })}
                </div>

                {activeScenario.lockedSettings?.startTyre && activeScenario.lockedSettings.lockReason ? (
                  <div className="p-2 rounded-lg bg-amber-950/40 border border-amber-500/30 text-[10px] font-mono text-amber-300/90 flex items-start gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <span>{activeScenario.lockedSettings.lockReason}</span>
                  </div>
                ) : (
                  <p className="text-[10px] text-slate-400 font-mono leading-tight">
                    {effectivePlayerConfig.startTyre === 'SOFT'
                      ? '序盤ハイペースだがデグラ大。アンダーカット推奨。'
                      : effectivePlayerConfig.startTyre === 'MEDIUM'
                      ? '最善のバランス。天候変化への柔軟性が高い。'
                      : effectivePlayerConfig.startTyre === 'HARD'
                      ? '長寿スティント。雨待ちステイアウトに適す。'
                      : effectivePlayerConfig.startTyre === 'INTER'
                      ? '降雨・ダンプ路面用 (水深0.8〜4.0mm)。'
                      : '豪雨用 (水深3.5mm以上)。'}
                  </p>
                )}
              </div>

              {/* Target Pit Stop Strategy */}
              <div className="p-3 rounded-xl bg-slate-950/80 border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-racing text-slate-300 font-bold text-[11px]">
                    予定ピット戦略
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono text-amber-400 font-bold">
                      LAP {customTargetBoxLap || effectiveTargetBoxLap} ➔ {customTargetCompound || nextCompoundChoice}
                    </span>
                    <button
                      type="button"
                      onClick={() => setBriefingHelpTopic('pit_strategy')}
                      className="p-0.5 rounded text-slate-400 hover:text-cyan-300 hover:bg-slate-800 transition-all cursor-pointer"
                      title="ピットストップ・アンダーカット戦術解説"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <span className="text-[10px] text-slate-400 shrink-0">目標周回:</span>
                  <select
                    value={customTargetBoxLap || effectiveTargetBoxLap}
                    onChange={(e) => setCustomTargetBoxLap(Number(e.target.value))}
                    className="bg-slate-900 border border-white/10 rounded-lg px-2 py-1 text-xs text-white font-mono"
                  >
                    {Array.from({ length: activeScenario.totalLaps }, (_, i) => i + 1).map((l) => (
                      <option key={l} value={l}>
                        LAP {l} {l === activeScenario.actualRainLap ? '(雨予想)' : ''}
                      </option>
                    ))}
                  </select>

                  <span className="text-[10px] text-slate-400 shrink-0">➔</span>
                  <select
                    value={customTargetCompound || nextCompoundChoice}
                    onChange={(e) => {
                      setCustomTargetCompound(e.target.value as TyreCompound);
                      setNextCompoundChoice(e.target.value as TyreCompound);
                    }}
                    className="bg-slate-900 border border-white/10 rounded-lg px-2 py-1 text-xs text-white font-racing font-bold"
                  >
                    {(['SOFT', 'MEDIUM', 'HARD', 'INTER', 'WET'] as TyreCompound[]).map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <p className="text-[10px] text-slate-400 font-mono leading-tight">
                  ※戦略目標プランです。レース中の「BOX BOX」ボタンまたは無線指示によってピットインを実行します（勝手に自動ピットインすることはありません）。
                </p>
              </div>

              {/* Initial PU Mode */}
              <div className="p-3 rounded-xl bg-slate-950/80 border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-racing text-slate-300 font-bold text-[11px]">
                    初期PUモード
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">
                      {effectivePlayerConfig.machineSetup.puMode}
                    </span>
                    <button
                      type="button"
                      onClick={() => setBriefingHelpTopic('pu_mode')}
                      className="p-0.5 rounded text-slate-400 hover:text-cyan-300 hover:bg-slate-800 transition-all cursor-pointer"
                      title="PUモード・電力マネジメント解説"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-1 pt-1">
                  {[
                    { id: 'push', label: 'PUSH ⚡', desc: '序盤猛攻' },
                    { id: 'standard', label: 'STD 🏎️', desc: '巡航標準' },
                    { id: 'conserve', label: 'SAVE 🌱', desc: 'タイヤ温存' },
                  ].map((mode) => {
                    const isCurrent = effectivePlayerConfig.machineSetup.puMode === mode.id;
                    return (
                      <button
                        key={mode.id}
                        type="button"
                        onClick={() => {
                          setCustomInitialPuMode(mode.id as EnginePUMode);
                          setActivePuMode(mode.id as EnginePUMode);
                        }}
                        className={`p-2 rounded-lg text-center border transition-all cursor-pointer ${
                          isCurrent
                            ? 'bg-cyan-950 border-cyan-500 text-cyan-200 shadow-md font-bold'
                            : 'bg-slate-900 border-white/10 text-slate-400 hover:text-white'
                        }`}
                      >
                        <div className="font-racing text-[10px]">{mode.label}</div>
                        <div className="text-[9px] text-slate-400">{mode.desc}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Downforce & Driver Info */}
              <div className="p-3 rounded-xl bg-slate-950/80 border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-racing text-slate-300 font-bold text-[11px]">
                    自車セッティング情報
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    {effectivePlayerConfig.team}
                  </span>
                </div>

                <div className="space-y-1 pt-1 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-slate-400">ドライバー:</span>
                    <span className="text-white font-bold">#{effectivePlayerConfig.number} {effectivePlayerConfig.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">ダウンフォース:</span>
                    <span className="text-cyan-300 font-bold">{effectivePlayerConfig.machineSetup.downforce.toUpperCase()} DF</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">クリア目標:</span>
                    <span className="text-amber-400 font-bold">P{activeScenario.targetPosition} 以内</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 🏁 Race Distance & Regulation Mode Selector */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-racing font-bold text-white text-xs flex items-center gap-1.5">
                <Flag className="w-4 h-4 text-red-500" /> レース距離 ＆ FIAレギュレーション
              </span>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-cyan-400 font-bold">
                  {raceLengthMode === 'gp_short_25'
                    ? '短縮GP (25%距離・ピット戦略必須)'
                    : raceLengthMode === 'gp_full_100'
                    ? 'フルGP (100%距離・本格リアル物理)'
                    : 'スプリント (無交換スプリント)'}
                </span>
                <button
                  type="button"
                  onClick={() => setBriefingHelpTopic('race_distance')}
                  className="p-0.5 rounded text-slate-400 hover:text-cyan-300 hover:bg-slate-800 transition-all cursor-pointer"
                  title="レース距離とレギュレーション解説"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              {/* Option 1: 25% Short GP (Recommended) */}
              <button
                type="button"
                onClick={() => setRaceLengthMode('gp_short_25')}
                className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                  raceLengthMode === 'gp_short_25'
                    ? 'bg-red-950/80 border-red-500 text-white shadow-lg ring-1 ring-red-400/50'
                    : 'bg-slate-950/80 border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                <div className="flex items-center justify-between pb-1">
                  <span className="font-racing font-bold text-xs text-red-400">
                    🏁 短縮グランプリ (25%)
                  </span>
                  <span className="px-1.5 py-0.2 rounded bg-red-600/80 text-[9px] font-mono font-bold text-white">
                    オススメ
                  </span>
                </div>
                <div className="text-[10px] text-slate-300 font-mono">
                  周回: 約14〜18周 (所要5〜8分)
                </div>
                <div className="text-[9px] text-slate-400 mt-1 leading-tight">
                  🛞 スケール摩耗 3.2倍 ＆ <strong>2種ドライタイヤ義務</strong>。短時間でアンダーカットやピットウィンドウの戦略駆け引きを凝縮！
                </div>
              </button>

              {/* Option 2: 100% Full GP */}
              <button
                type="button"
                onClick={() => setRaceLengthMode('gp_full_100')}
                className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                  raceLengthMode === 'gp_full_100'
                    ? 'bg-purple-950/80 border-purple-500 text-white shadow-lg ring-1 ring-purple-400/50'
                    : 'bg-slate-950/80 border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                <div className="flex items-center justify-between pb-1">
                  <span className="font-racing font-bold text-xs text-purple-400">
                    🏆 フルグランプリ (100%)
                  </span>
                  <span className="px-1.5 py-0.2 rounded bg-purple-600/80 text-[9px] font-mono font-bold text-white">
                    本格派
                  </span>
                </div>
                <div className="text-[10px] text-slate-300 font-mono">
                  周回: 50〜78周 (10x速で約8分)
                </div>
                <div className="text-[9px] text-slate-400 mt-1 leading-tight">
                  🏎️ リアル1.0倍摩耗 ＆ 燃料減衰（100kg→0kg）。5x/10x/20xの高速シミュレーションと自動ポーズで完全なF1司令塔を体験！
                </div>
              </button>

              {/* Option 3: Sprint Race */}
              <button
                type="button"
                onClick={() => setRaceLengthMode('sprint')}
                className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                  raceLengthMode === 'sprint'
                    ? 'bg-amber-950/80 border-amber-500 text-white shadow-lg ring-1 ring-amber-400/50'
                    : 'bg-slate-950/80 border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                <div className="flex items-center justify-between pb-1">
                  <span className="font-racing font-bold text-xs text-amber-400">
                    ⚡ スプリントレース
                  </span>
                  <span className="px-1.5 py-0.2 rounded bg-amber-600/80 text-[9px] font-mono font-bold text-white">
                    超接近戦
                  </span>
                </div>
                <div className="text-[10px] text-slate-300 font-mono">
                  周回: 15〜19周 (所要4〜6分)
                </div>
                <div className="text-[9px] text-slate-400 mt-1 leading-tight">
                  🔥 ピット義務なし ＆ 1.0倍摩耗。全車フラットアウトでタイヤクリフとDRSトレインを防衛する超接近バトル！
                </div>
              </button>
            </div>
          </div>

          {/* AI Difficulty & User Assist Deck */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-white/10 space-y-3">
            <span className="font-racing font-bold text-white text-xs flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-amber-400" /> 難易度 ＆ 操作アシスト設定
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {/* AI Difficulty */}
              <div className="p-3 rounded-xl bg-slate-950/80 border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-racing text-slate-300 font-bold text-[11px]">
                    AIライバル難易度
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono text-amber-400 font-bold">
                      {aiDifficulty === 'master' ? '🏆 金トロフィー確定' : aiDifficulty === 'standard' ? '🥈 銀トロフィー狙い' : '🥉 銅トロフィー狙い'}
                    </span>
                    <button
                      type="button"
                      onClick={() => setBriefingHelpTopic('ai_difficulty')}
                      className="p-0.5 rounded text-slate-400 hover:text-cyan-300 hover:bg-slate-800 transition-all cursor-pointer"
                      title="AI難易度とトロフィー解説"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  {([
                    { id: 'beginner', label: '初級', icon: '🌱', desc: '🥉 銅狙い' },
                    { id: 'standard', label: '標準', icon: '🏎️', desc: '🥈 銀狙い' },
                    { id: 'master', label: '達人', icon: '🏆', desc: '🏆 金確定' },
                  ] as const).map((lvl) => (
                    <button
                      key={lvl.id}
                      type="button"
                      onClick={() => setAiDifficulty(lvl.id)}
                      className={`p-2 rounded-lg text-center border font-racing font-bold transition-all cursor-pointer ${
                        aiDifficulty === lvl.id
                          ? lvl.id === 'master'
                            ? 'bg-purple-950 border-purple-500 text-white shadow-md ring-1 ring-purple-400'
                            : lvl.id === 'standard'
                            ? 'bg-blue-950 border-blue-500 text-white shadow-md ring-1 ring-blue-400'
                            : 'bg-emerald-950 border-emerald-500 text-white shadow-md ring-1 ring-emerald-400'
                          : 'bg-slate-900 border-white/10 text-slate-400 hover:text-white'
                      }`}
                    >
                      <div className="text-base">{lvl.icon}</div>
                      <div className="text-[10px]">{lvl.label}</div>
                      <div className="text-[8px] text-slate-400 font-normal mt-0.5">{lvl.desc}</div>
                    </button>
                  ))}
                </div>
                <p className="text-[9px] text-slate-400 font-mono leading-tight">
                  ※クリア時の順位（P1優勝で🏆金）または達人AIクリアで金トロフィーを獲得できます。
                </p>
              </div>

              {/* Assist Mode */}
              <div className="p-3 rounded-xl bg-slate-950/80 border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-racing text-slate-300 font-bold text-[11px]">
                    操作アシストモード
                  </span>
                  <button
                    type="button"
                    onClick={() => setBriefingHelpTopic('user_assist')}
                    className="p-0.5 rounded text-slate-400 hover:text-cyan-300 hover:bg-slate-800 transition-all cursor-pointer"
                    title="操作アシストモード解説"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setUserAssistLevel('assisted')}
                    className={`p-2 rounded-lg text-left border font-racing font-bold transition-all cursor-pointer ${
                      userAssistLevel === 'assisted'
                        ? 'bg-emerald-950 border-emerald-500 text-emerald-300 shadow-md'
                        : 'bg-slate-900 border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-1 text-[11px]">
                      <span>🔰</span>
                      <span>アシストあり</span>
                    </div>
                    <div className="text-[9px] text-slate-400 font-normal mt-0.5">
                      計器注視点のガイダンス表示
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setUserAssistLevel('expert')}
                    className={`p-2 rounded-lg text-left border font-racing font-bold transition-all cursor-pointer ${
                      userAssistLevel === 'expert'
                        ? 'bg-cyan-950 border-cyan-500 text-cyan-300 shadow-md'
                        : 'bg-slate-900 border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-1 text-[11px]">
                      <span>🎯</span>
                      <span>エキスパート</span>
                    </div>
                    <div className="text-[9px] text-slate-400 font-normal mt-0.5">
                      助言なし・生計器データ勝負
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Bar: Start Race Button */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-red-950 border border-red-500/40 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-xl">
            🏁
          </div>
          <div>
            <div className="text-white font-racing font-bold text-sm">
              作戦策定完了 — ピットウォール司令室へ
            </div>
            <div className="text-xs text-slate-400 font-mono">
              全{activeScenario.totalLaps}周 • 目標順位 P{activeScenario.targetPosition} • スタートタイヤ {effectivePlayerConfig.startTyre} • 初期PU {effectivePlayerConfig.machineSetup.puMode.toUpperCase()}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <button
            type="button"
            onClick={handleBackToModeSelect}
            className="btn-console px-4 py-2.5 text-xs font-racing font-bold text-slate-300 hover:text-white"
          >
            ◀ モード選択へ戻る
          </button>

          <button
            type="button"
            onClick={handleStartRace}
            className="btn-console-primary px-8 py-3 text-sm font-racing font-black tracking-wider flex items-center gap-2 shadow-2xl shadow-red-950 hover:scale-105 transition-all animate-pulse"
          >
            <span>🚀 ピットウォールへ着席 (レース開始) ▶</span>
          </button>
        </div>
      </div>

      {/* ℹ️ Briefing Setting Interactive Help Modal */}
      <BriefingSettingHelpModal
        topic={briefingHelpTopic}
        onClose={() => setBriefingHelpTopic(null)}
      />
    </div>
  );
};
