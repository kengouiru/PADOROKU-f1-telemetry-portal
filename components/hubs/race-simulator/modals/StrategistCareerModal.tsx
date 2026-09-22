'use client';

/**
 * components/hubs/race-simulator/modals/StrategistCareerModal.tsx
 * 🏛️ FIA Strategist Career & Paddock Hall of Fame (パドック殿堂)
 *
 * Implements 3 Unified Tabs:
 * 1. 🎖️ 軍師称号＆戦術パーク (Strategist Titles & Paddock Aura Perks)
 * 2. 🏎️ 伝説の名車ギャラリー (Historic Legendary Cars 5-Axis Specs & Lore)
 * 3. 🏆 トロフィールーム＆称号バッジ (Career Milestones, Grade & Badges)
 */

import React, { useState } from 'react';
import { Trophy, XCircle, Award, Sparkles, Check, Lock } from 'lucide-react';
import {
  F1_BADGES_CATALOG,
  type SavedCareerData,
  type F1Badge,
} from '@/lib/raceDebriefAnalysis';
import {
  PRESET_CHALLENGES,
  MISSION_CHALLENGES,
} from '@/lib/raceSimulationEngine';
import {
  USER_TITLES_MASTER,
  type UserTitle,
} from '@/data/userTitlesData';
import {
  HISTORIC_LEGENDARY_CARS,
  type CarPerformanceProfile,
} from '@/data/carPerformanceData';

interface StrategistCareerModalProps {
  isOpen: boolean;
  onClose: () => void;
  careerData: SavedCareerData;
  onSelectBadge: (badge: F1Badge) => void;
  equippedTitleId?: string;
  onEquipTitle?: (titleId: string) => void;
}

type HallOfFameTab = 'titles' | 'legends' | 'trophies';

export const StrategistCareerModal: React.FC<StrategistCareerModalProps> = ({
  isOpen,
  onClose,
  careerData,
  onSelectBadge,
  equippedTitleId = 'rookie_tactician',
  onEquipTitle,
}) => {
  const [activeTab, setActiveTab] = useState<HallOfFameTab>('titles');

  if (!isOpen) return null;

  const titlesList: UserTitle[] = Object.values(USER_TITLES_MASTER);
  const historicCars: CarPerformanceProfile[] = Object.values(HISTORIC_LEGENDARY_CARS);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="max-w-3xl w-full glass-card-premium p-4 sm:p-6 rounded-3xl border-2 border-amber-500/50 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
        {/* Header Bar */}
        <div className="flex justify-between items-start pb-3 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-amber-500 via-orange-600 to-red-600 flex items-center justify-center text-2xl shadow-lg">
              🏛️
            </div>
            <div>
              <div className="text-[10px] sm:text-xs font-mono text-amber-300 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <span>FIA PADDOCK HALL OF FAME</span>
                <span className="text-[9px] bg-amber-500/20 text-amber-200 px-1.5 py-0.2 rounded border border-amber-500/30">
                  GRADE {careerData.grade}
                </span>
              </div>
              <h3 className="font-racing font-bold text-white text-base sm:text-xl">
                パドック殿堂 ＆ 軍師称号・名車ミュージアム
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
          >
            <XCircle className="w-6 h-6" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-3 gap-1 p-1 rounded-2xl bg-slate-900 border border-white/10 text-xs font-racing font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('titles')}
            className={`py-2 px-1 rounded-xl text-center flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'titles'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>🎖️</span>
            <span className="truncate">軍師称号・オーラ ({titlesList.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('legends')}
            className={`py-2 px-1 rounded-xl text-center flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'legends'
                ? 'bg-red-500/20 text-red-300 border border-red-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>🏎️</span>
            <span className="truncate">伝説の名車 (5台)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('trophies')}
            className={`py-2 px-1 rounded-xl text-center flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'trophies'
                ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>🏆</span>
            <span className="truncate">トロフィー・戦歴</span>
          </button>
        </div>

        {/* ════════════════════════════════════════════════════════════════════════
            TAB 1: 🎖️ 軍師称号＆戦術パーク
            ════════════════════════════════════════════════════════════════════════ */}
        {activeTab === 'titles' && (
          <div className="space-y-3 animate-in fade-in duration-200">
            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-amber-500/20 text-xs space-y-1.5">
              <div className="flex items-center gap-1.5 text-amber-300 font-racing font-bold">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>歴戦のストラテジスト・オーラ（称号パーク効果）</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed font-mono">
                ピットウォールでの経験やF1検定クイズの正解実績によって解放される戦略称号です。
                装備した称号に応じて、レース中の勝負所スキル（狂気の狩人、HAMMER TIME等）の確率発動率に
                <strong className="text-emerald-400"> +1%〜+5% の控えめな幸運補正</strong>やピットミス抑制効果が付与されます。
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[58vh] overflow-y-auto pr-1">
              {titlesList.map((title) => {
                const isEquipped = equippedTitleId === title.id;
                // Unlock logic: rookie is always unlocked, other titles unlocked if cleared relevant criteria or unlocked
                const isUnlocked =
                  title.id === 'rookie_tactician' ||
                  careerData.unlockedBadgeIds.includes(title.achievementKey || '') ||
                  (title.id === 'weather_oracle' && careerData.totalRacesCompleted >= 1) ||
                  (title.id === 'undercut_specialist' && careerData.totalWins >= 1) ||
                  (title.id === 'legendary_pitwall' && careerData.totalWins >= 3);

                return (
                  <div
                    key={title.id}
                    className={`p-3.5 rounded-2xl border flex flex-col justify-between space-y-3 transition-all ${
                      isEquipped
                        ? 'bg-gradient-to-br from-amber-950/60 via-slate-900/90 to-slate-950/95 border-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.25)]'
                        : isUnlocked
                        ? 'bg-slate-900/80 border-white/10 hover:border-amber-500/40'
                        : 'bg-slate-950/60 border-white/5 opacity-60'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{title.icon}</span>
                          <div>
                            <div className="font-racing font-bold text-xs text-white flex items-center gap-1.5">
                              <span>{title.name}</span>
                              {isEquipped && (
                                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
                                  装備中
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] font-mono text-slate-400">
                              {title.badgeLabel}
                            </span>
                          </div>
                        </div>

                        <span
                          className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-md border ${
                            title.rarity === 'LEGENDARY'
                              ? 'bg-amber-400/20 text-amber-200 border-amber-400/50'
                              : title.rarity === 'EPIC'
                              ? 'bg-purple-500/20 text-purple-200 border-purple-500/50'
                              : title.rarity === 'RARE'
                              ? 'bg-sky-500/20 text-sky-200 border-sky-500/50'
                              : 'bg-slate-700/40 text-slate-300 border-slate-600/40'
                          }`}
                        >
                          {title.rarity}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-300 leading-relaxed">
                        {title.description}
                      </p>

                      <div className="bg-black/40 border border-white/5 p-2 rounded-xl text-[10px] font-mono space-y-0.5">
                        <div className="text-emerald-400 font-bold flex items-center gap-1">
                          <span>⚡ オーラ補正:</span>
                          <span>{title.tacticalPerk.description}</span>
                        </div>
                        <div className="text-slate-400">
                          <span>🎯 解放条件: {title.unlockConditionText}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                      {isUnlocked ? (
                        isEquipped ? (
                          <div className="w-full py-1.5 text-center text-[10px] font-racing font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 rounded-xl flex items-center justify-center gap-1">
                            <Check className="w-3.5 h-3.5" />
                            <span>ピットウォールにオーラ適用中</span>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => onEquipTitle?.(title.id)}
                            className="w-full py-1.5 text-center text-[11px] font-racing font-bold text-amber-300 bg-amber-950/60 hover:bg-amber-900/60 border border-amber-500/40 rounded-xl transition-all shadow-sm active:scale-95"
                          >
                            この称号を装備する ➔
                          </button>
                        )
                      ) : (
                        <div className="w-full py-1.5 text-center text-[10px] font-mono text-slate-500 bg-slate-900/40 border border-white/5 rounded-xl flex items-center justify-center gap-1">
                          <Lock className="w-3 h-3 text-slate-600" />
                          <span>未解放（実績クリアで解除）</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════════════
            TAB 2: 🏎️ 伝説の名車ギャラリー
            ════════════════════════════════════════════════════════════════════════ */}
        {activeTab === 'legends' && (
          <div className="space-y-3 animate-in fade-in duration-200">
            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-red-500/20 text-xs space-y-1.5">
              <div className="flex items-center gap-1.5 text-red-400 font-racing font-bold">
                <span>🏁</span>
                <span>F1黄金期・歴史的レジェンドマシン（5台）</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed font-mono">
                架空のキメラ改造パーツではなく、史実のコンストラクター総合パッケージとして精密再現。
                キャリア実績を解除することでアンロックされ、サンドボックスモード等で現行2026年規定マシンと混走シミュレーションが可能です。
              </p>
            </div>

            <div className="space-y-3 max-h-[58vh] overflow-y-auto pr-1">
              {historicCars.map((car) => {
                const isCarUnlocked =
                  careerData.totalWins >= 1 ||
                  Object.keys(careerData.clearedScenarios || {}).length >= 1;

                return (
                  <div
                    key={car.id}
                    className="p-4 rounded-2xl bg-gradient-to-br from-slate-900/90 via-slate-950/90 to-black border border-white/10 space-y-3 shadow-md"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-racing font-black text-sm sm:text-base text-amber-300">
                            {car.name} ({car.year})
                          </h4>
                          <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-red-950/60 text-red-300 border border-red-500/30 font-bold uppercase">
                            LEGEND
                          </span>
                        </div>
                        <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                          PU: {car.engineSupplier} | 総合レーティング: <strong className="text-white text-xs">{car.overallRating}</strong>
                        </div>
                      </div>

                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-white/10">
                        {car.constructorName}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed italic bg-black/40 p-2.5 rounded-xl border border-white/5">
                      &ldquo;{car.description}&rdquo;
                    </p>

                    {/* 5-Axis Performance Bars */}
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
                      <div className="bg-slate-900/80 p-2 rounded-xl border border-white/5 text-center">
                        <span className="text-[9px] font-mono text-slate-400 block truncate">最高速 (Power)</span>
                        <span className="text-xs font-racing font-bold text-sky-400 mt-0.5 block">{car.stats.topSpeed}</span>
                        <div className="h-1 w-full bg-slate-800 rounded-full mt-1 overflow-hidden">
                          <div className="h-full bg-sky-400 rounded-full" style={{ width: `${car.stats.topSpeed}%` }} />
                        </div>
                      </div>
                      <div className="bg-slate-900/80 p-2 rounded-xl border border-white/5 text-center">
                        <span className="text-[9px] font-mono text-slate-400 block truncate">高速空力 (Aero)</span>
                        <span className="text-xs font-racing font-bold text-blue-400 mt-0.5 block">{car.stats.highSpeedAero}</span>
                        <div className="h-1 w-full bg-slate-800 rounded-full mt-1 overflow-hidden">
                          <div className="h-full bg-blue-400 rounded-full" style={{ width: `${car.stats.highSpeedAero}%` }} />
                        </div>
                      </div>
                      <div className="bg-slate-900/80 p-2 rounded-xl border border-white/5 text-center">
                        <span className="text-[9px] font-mono text-slate-400 block truncate">低速グリップ</span>
                        <span className="text-xs font-racing font-bold text-emerald-400 mt-0.5 block">{car.stats.lowSpeedGrip}</span>
                        <div className="h-1 w-full bg-slate-800 rounded-full mt-1 overflow-hidden">
                          <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${car.stats.lowSpeedGrip}%` }} />
                        </div>
                      </div>
                      <div className="bg-slate-900/80 p-2 rounded-xl border border-white/5 text-center">
                        <span className="text-[9px] font-mono text-slate-400 block truncate">タイヤ保全</span>
                        <span className="text-xs font-racing font-bold text-amber-400 mt-0.5 block">{car.stats.tyrePreservation}</span>
                        <div className="h-1 w-full bg-slate-800 rounded-full mt-1 overflow-hidden">
                          <div className="h-full bg-amber-400 rounded-full" style={{ width: `${car.stats.tyrePreservation}%` }} />
                        </div>
                      </div>
                      <div className="bg-slate-900/80 p-2 rounded-xl border border-white/5 text-center col-span-2 sm:col-span-1">
                        <span className="text-[9px] font-mono text-slate-400 block truncate">追従性 (Dirty Air)</span>
                        <span className="text-xs font-racing font-bold text-purple-400 mt-0.5 block">{car.stats.dirtyAirTolerance}</span>
                        <div className="h-1 w-full bg-slate-800 rounded-full mt-1 overflow-hidden">
                          <div className="h-full bg-purple-400 rounded-full" style={{ width: `${car.stats.dirtyAirTolerance}%` }} />
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/5 text-[10px] font-mono">
                      <div className="text-slate-400">
                        <span className="text-amber-400 font-bold">🔑 解除実績:</span> {car.unlockRequirementText}
                      </div>
                      <span className={`px-2 py-0.5 rounded font-bold ${
                        isCarUnlocked
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-slate-800 text-slate-500'
                      }`}>
                        {isCarUnlocked ? '🟢 解除済み (サンドボックス搭乗可能)' : '🔒 ロック中'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════════════
            TAB 3: 🏆 トロフィールーム＆ライセンス
            ════════════════════════════════════════════════════════════════════════ */}
        {activeTab === 'trophies' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* Career Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
              <div className="p-2.5 rounded-2xl bg-slate-900 border border-white/10 text-center">
                <div className="text-slate-400 text-[10px] font-mono">ライセンス等級</div>
                <div className="font-racing font-bold text-amber-300 text-sm mt-0.5">
                  GRADE {careerData.grade}
                </div>
              </div>
              <div className="p-2.5 rounded-2xl bg-slate-900 border border-white/10 text-center">
                <div className="text-slate-400 text-[10px] font-mono">累積 Command Points</div>
                <div className="font-racing font-bold text-white text-sm mt-0.5">
                  {careerData.totalCp} CP
                </div>
              </div>
              <div className="p-2.5 rounded-2xl bg-slate-900 border border-amber-500/30 text-center shadow-sm">
                <div className="text-amber-400 text-[10px] font-mono font-bold">トロフィー</div>
                <div className="font-racing font-bold text-amber-300 text-sm mt-0.5">
                  🏆 {Object.keys(careerData.clearedScenarios || {}).length}冠
                </div>
              </div>
              <div className="p-2.5 rounded-2xl bg-slate-900 border border-white/10 text-center">
                <div className="text-slate-400 text-[10px] font-mono">総参戦 / 勝利</div>
                <div className="font-racing font-bold text-emerald-400 text-sm mt-0.5">
                  {careerData.totalRacesCompleted}戦 / {careerData.totalWins}勝
                </div>
              </div>
              <div className="p-2.5 rounded-2xl bg-slate-900 border border-white/10 text-center">
                <div className="text-slate-400 text-[10px] font-mono">獲得称号バッジ</div>
                <div className="font-racing font-bold text-rose-400 text-sm mt-0.5">
                  {careerData.unlockedBadgeIds.length} / {F1_BADGES_CATALOG.length}
                </div>
              </div>
            </div>

            {/* Trophy Room Section */}
            <div className="space-y-2 pt-1 border-t border-white/10">
              <div className="font-racing font-bold text-xs text-white flex justify-between items-center">
                <span className="flex items-center gap-1.5 text-amber-300">
                  <Trophy className="w-4 h-4 text-amber-400" />
                  トロフィールーム ({Object.keys(careerData.clearedScenarios || {}).length}冠 達成)
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  金: {Object.values(careerData.clearedScenarios || {}).filter((c) => c.trophy === 'gold').length} / 
                  銀: {Object.values(careerData.clearedScenarios || {}).filter((c) => c.trophy === 'silver').length} / 
                  銅: {Object.values(careerData.clearedScenarios || {}).filter((c) => c.trophy === 'bronze').length}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-44 overflow-y-auto pr-1">
                {[...PRESET_CHALLENGES, ...MISSION_CHALLENGES].map((sc) => {
                  const clear = careerData.clearedScenarios?.[sc.id];
                  return (
                    <div
                      key={sc.id}
                      className={`p-2.5 rounded-2xl border text-xs flex items-center justify-between transition-all ${
                        clear
                          ? clear.trophy === 'gold'
                            ? 'bg-amber-950/40 border-amber-500/50 text-amber-200 shadow-sm'
                            : clear.trophy === 'silver'
                            ? 'bg-slate-800/60 border-slate-400/50 text-slate-200'
                            : 'bg-amber-900/30 border-amber-700/40 text-amber-300'
                          : 'bg-slate-950/60 border-white/5 text-slate-500 opacity-50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xl">
                          {clear
                            ? clear.trophy === 'gold'
                              ? '🏆'
                              : clear.trophy === 'silver'
                              ? '🥈'
                              : '🥉'
                            : '🔒'}
                        </span>
                        <div>
                          <div className="font-racing font-bold text-xs line-clamp-1">
                            {sc.title.replace(/^[^a-zA-Z0-9\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]+/, '')}
                          </div>
                          <div className="text-[10px] font-mono text-slate-400">
                            {clear
                              ? `P${clear.finalPosition}達成 (${clear.score}点 / AI:${
                                  clear.aiDifficulty === 'master'
                                    ? '達人'
                                    : clear.aiDifficulty === 'standard'
                                    ? '標準'
                                    : '初級'
                                })`
                              : '未クリア (CHALLENGE)'}
                          </div>
                        </div>
                      </div>
                      {clear && (
                        <span
                          className={`text-[9px] font-racing font-bold px-1.5 py-0.5 rounded uppercase ${
                            clear.trophy === 'gold'
                              ? 'bg-amber-500/30 text-amber-300 border border-amber-500/50'
                              : clear.trophy === 'silver'
                              ? 'bg-slate-400/30 text-slate-200 border border-slate-400/50'
                              : 'bg-amber-800/40 text-amber-400 border border-amber-700/50'
                          }`}
                        >
                          {clear.trophy}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* All Badges Museum list */}
            <div className="space-y-2 pt-1 border-t border-white/10">
              <div className="font-racing font-bold text-xs text-white flex justify-between items-center">
                <span>🎖️ 名言称号バッジ ({careerData.unlockedBadgeIds.length}/{F1_BADGES_CATALOG.length})</span>
                <span className="text-[10px] text-slate-400 font-mono">タップで名言と歴史背景を表示</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                {F1_BADGES_CATALOG.map((badge) => {
                  const isUnlocked = careerData.unlockedBadgeIds.includes(badge.id);
                  return (
                    <div
                      key={badge.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => onSelectBadge(badge)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          onSelectBadge(badge);
                        }
                      }}
                      className={`p-2.5 rounded-2xl border text-xs flex items-center justify-between cursor-pointer transition-all ${
                        isUnlocked
                          ? `${badge.rarityColor} hover:brightness-125`
                          : 'bg-slate-950/60 border-white/5 text-slate-600 opacity-60'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-xl">{badge.icon}</span>
                        <div>
                          <div className={`font-racing font-bold text-xs ${isUnlocked ? 'text-white' : 'text-slate-500'}`}>
                            {badge.name}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            {isUnlocked ? badge.historicalQuote.slice(0, 24) + '...' : '🔒 未獲得'}
                          </div>
                        </div>
                      </div>
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-black/40 text-slate-300">
                        {badge.rarity}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={onClose}
          className="btn-console w-full py-2.5 text-xs font-racing font-bold text-white text-center rounded-xl"
        >
          殿堂を閉じる
        </button>
      </div>
    </div>
  );
};

export default StrategistCareerModal;
