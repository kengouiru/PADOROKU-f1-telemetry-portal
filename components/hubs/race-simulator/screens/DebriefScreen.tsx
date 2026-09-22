'use client';

import React from 'react';
import {
  Trophy,
  Sparkles,
  RotateCcw,
  Target,
  Award,
  BookOpen,
  ExternalLink,
  Settings,
  Bot,
} from 'lucide-react';
import {
  STRATEGIST_ARCHETYPES,
  F1_BADGES_CATALOG,
  type SavedCareerData,
  type DiagnosticResult,
  type F1Badge,
  type BadgeCategory,
} from '@/lib/raceDebriefAnalysis';
import type {
  ChallengeScenario,
  TacticalScoreBreakdown,
} from '@/lib/raceSimulationEngine';
import type { TacticalTimelineEvent, SimulatorPhase } from '../types';

export interface DebriefScreenProps {
  tacticalScore: TacticalScoreBreakdown | null;
  diagnosticResult: DiagnosticResult | null;
  activeScenario: ChallengeScenario;
  playerCar?: { position: number };
  careerData: SavedCareerData;
  debriefTab: 'score' | 'archetype' | 'badges' | 'knowledge';
  setDebriefTab: (tab: 'score' | 'archetype' | 'badges' | 'knowledge') => void;
  badgeCategoryFilter: 'all' | BadgeCategory;
  setBadgeCategoryFilter: (cat: 'all' | BadgeCategory) => void;
  geminiDebrief: string | null;
  loadingGeminiDebrief: boolean;
  requestGeminiDebrief: () => void;
  resetGameState: () => void;
  tacticalEventTimeline: TacticalTimelineEvent[];
  onOpenUpgradeModal?: () => void;
  handleOpenIntel: (termId: string) => void;
  setSelectedBadgeForDetail: (badge: F1Badge | null) => void;
  setIsCareerModalOpen: (open: boolean) => void;
  handleRestartRace: () => void;
  handleBackToBriefing: () => void;
  handleBackToModeSelect: () => void;
  setSimulatorPhase: (phase: SimulatorPhase) => void;
}

export const DebriefScreen: React.FC<DebriefScreenProps> = ({
  tacticalScore,
  diagnosticResult,
  activeScenario,
  playerCar,
  careerData,
  debriefTab,
  setDebriefTab,
  badgeCategoryFilter,
  setBadgeCategoryFilter,
  geminiDebrief,
  loadingGeminiDebrief,
  requestGeminiDebrief,
  resetGameState,
  tacticalEventTimeline,
  onOpenUpgradeModal,
  handleOpenIntel,
  setSelectedBadgeForDetail,
  setIsCareerModalOpen,
  handleRestartRace,
  handleBackToBriefing,
  handleBackToModeSelect,
  setSimulatorPhase,
}) => {
  return (
    <div className="space-y-4 animate-in fade-in zoom-in-95 duration-300">
      {tacticalScore ? (
        <>
          <div className="p-5 rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-red-950/50 border-2 border-red-500/60 shadow-2xl space-y-4">
            {/* 1. Header Banner: Mission Result & FIA Rank */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-red-600 via-rose-600 to-amber-600 flex items-center justify-center shadow-xl shadow-red-950/60 border border-red-400/40 shrink-0">
                  <Trophy className="w-7 h-7 text-yellow-300 animate-bounce" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-racing font-black text-white text-lg sm:text-2xl tracking-wider">
                      {playerCar && playerCar.position <= activeScenario.targetPosition
                        ? '🏆 MISSION ACCOMPLISHED'
                        : '⚠️ MISSION FAILED'}
                    </span>
                    <span className="px-3 py-0.5 rounded-full bg-red-600 font-racing font-black text-white text-xs tracking-widest shadow-md">
                      RANK {tacticalScore.rank}
                    </span>
                    {diagnosticResult && (
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[11px] font-racing font-bold flex items-center gap-1">
                        <span>{diagnosticResult.archetype.icon}</span>
                        <span>{diagnosticResult.archetype.name.split('】')[1] || diagnosticResult.archetype.name}</span>
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-300 mt-1 flex flex-wrap items-center gap-2">
                    <span>
                      最終順位: <strong className="text-white font-racing text-sm font-bold">P{playerCar?.position}</strong> (目標 P{activeScenario.targetPosition})
                    </span>
                    <span>•</span>
                    <span>
                      総合得点: <strong className="text-red-400 font-racing text-sm font-bold">{tacticalScore.totalScore}点</strong> / 100
                    </span>
                    <span>•</span>
                    <span className="text-amber-300 font-mono">
                      +{diagnosticResult?.totalCpEarnedThisRace || 100} CP 獲得
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={requestGeminiDebrief}
                  disabled={loadingGeminiDebrief}
                  className="btn-console-primary px-4 py-2 text-xs flex items-center gap-2 shadow-lg"
                >
                  <Sparkles className="w-4 h-4 text-yellow-300" />
                  {loadingGeminiDebrief ? 'AI軍師が総括作成中...' : '🤖 AI軍師の総括解説'}
                </button>
                <button
                  type="button"
                  onClick={resetGameState}
                  className="btn-console px-3 py-2 text-xs text-slate-300 hover:text-white"
                  title="レースをリセットして再挑戦"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* 1.5 Trophy Award Celebration Banner */}
            {careerData.clearedScenarios?.[activeScenario.id] && playerCar && playerCar.position <= activeScenario.targetPosition && (
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-950/90 via-yellow-950/80 to-slate-900 border-2 border-amber-400/80 shadow-xl shadow-amber-950/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in zoom-in-95 duration-300">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center text-3xl shadow-lg shrink-0">
                    {careerData.clearedScenarios[activeScenario.id].trophy === 'gold'
                      ? '🏆'
                      : careerData.clearedScenarios[activeScenario.id].trophy === 'silver'
                      ? '🥈'
                      : '🥉'}
                  </div>
                  <div>
                    <div className="text-xs font-racing font-bold text-amber-300 tracking-wider">
                      SCENARIO TROPHY EARNED! (シナリオ制覇トロフィー獲得)
                    </div>
                    <div className="text-sm font-racing font-black text-white flex items-center gap-2 mt-0.5">
                      <span className="uppercase text-amber-200 font-bold">
                        {careerData.clearedScenarios[activeScenario.id].trophy === 'gold'
                          ? '🏆 GOLD TROPHY'
                          : careerData.clearedScenarios[activeScenario.id].trophy === 'silver'
                          ? '🥈 SILVER TROPHY'
                          : '🥉 BRONZE TROPHY'}
                      </span>
                      <span className="text-xs text-slate-300 font-mono">
                        (最終順位: P{careerData.clearedScenarios[activeScenario.id].finalPosition} / 目標: P{activeScenario.targetPosition}以内)
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsCareerModalOpen(true)}
                  className="px-3.5 py-2 rounded-xl bg-amber-400 text-slate-950 font-racing font-black text-xs hover:bg-amber-300 transition-colors shrink-0 cursor-pointer shadow-md flex items-center gap-1.5"
                >
                  <Trophy className="w-3.5 h-3.5" />
                  <span>トロフィールームを見る ➔</span>
                </button>
              </div>
            )}

            {/* 2. New Badges Alert Banner (if any newly unlocked this race) */}
            {diagnosticResult && diagnosticResult.unlockedBadgesThisRace.length > 0 && (
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-950/80 via-red-950/80 to-slate-900 border-2 border-amber-500/60 shadow-lg shadow-amber-950/50 animate-pulse flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">🎉</span>
                  <div>
                    <div className="text-xs font-racing font-bold text-amber-300 tracking-wider">
                      NEW TITLES UNLOCKED! (新規称号 {diagnosticResult.unlockedBadgesThisRace.length}件 獲得)
                    </div>
                    <div className="flex flex-wrap items-center gap-1.5 mt-1">
                      {diagnosticResult.unlockedBadgesThisRace.map((badge) => (
                        <button
                          type="button"
                          key={badge.id}
                          onClick={() => {
                            setSelectedBadgeForDetail(badge);
                            setDebriefTab('badges');
                          }}
                          className="px-2 py-0.5 rounded-lg bg-black/60 border border-amber-400/40 text-[11px] font-racing font-bold text-amber-200 cursor-pointer hover:bg-amber-950 transition-colors text-left"
                        >
                          {badge.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setDebriefTab('badges')}
                  className="px-3 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-racing font-black text-xs hover:bg-amber-400 transition-colors shrink-0 cursor-pointer"
                >
                  称号コレクションを見る ➔
                </button>
              </div>
            )}

            {/* 3. Debrief Navigation Tabs */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900/90 border border-white/10 overflow-x-auto text-xs font-racing">
              <button
                type="button"
                onClick={() => setDebriefTab('score')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-bold whitespace-nowrap transition-all ${
                  debriefTab === 'score'
                    ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Target className="w-3.5 h-3.5" />
                <span>🎯 総合採点 ＆ 勝敗分岐</span>
              </button>

              <button
                type="button"
                onClick={() => setDebriefTab('archetype')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-bold whitespace-nowrap transition-all ${
                  debriefTab === 'archetype'
                    ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>🧠 司令官性格診断</span>
                {diagnosticResult && (
                  <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[10px]">
                    {diagnosticResult.archetype.icon}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setDebriefTab('badges')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-bold whitespace-nowrap transition-all ${
                  debriefTab === 'badges'
                    ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Award className="w-3.5 h-3.5" />
                <span>🎖️ 称号 ＆ 絶望バッジ</span>
                <span className="px-1.5 py-0.2 rounded bg-white/10 text-[10px] font-mono">
                  {careerData.unlockedBadgeIds.length}/{F1_BADGES_CATALOG.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setDebriefTab('knowledge')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-bold whitespace-nowrap transition-all ${
                  debriefTab === 'knowledge'
                    ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>📚 大百科スマート学習</span>
              </button>
            </div>

            {/* ── TAB 1: 総合採点 ＆ 勝敗分岐 (Score & Key Decisions) ── */}
            {debriefTab === 'score' && (
              <div className="space-y-4">
                {/* 4-Axis Tactical Breakdown Bars */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-white/10 shadow-sm">
                    <div className="flex justify-between text-xs text-slate-300">
                      <span>ピット窓口適正度</span>
                      <span className="font-racing font-bold text-red-400">
                        {tacticalScore.pitTimingScore} / 25
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden mt-2.5">
                      <div
                        className="h-full bg-gradient-to-r from-red-600 to-rose-500 transition-all duration-500"
                        style={{ width: `${(tacticalScore.pitTimingScore / 25) * 100}%` }}
                      />
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1.5 font-mono">アンダーカット・SCチープピット活用</div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-white/10 shadow-sm">
                    <div className="flex justify-between text-xs text-slate-300">
                      <span>トラフィック回避度</span>
                      <span className="font-racing font-bold text-amber-400">
                        {tacticalScore.trafficScore} / 25
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden mt-2.5">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 transition-all duration-500"
                        style={{ width: `${(tacticalScore.trafficScore / 25) * 100}%` }}
                      />
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1.5 font-mono">クリーンエア合流窓の確保</div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-white/10 shadow-sm">
                    <div className="flex justify-between text-xs text-slate-300">
                      <span>タイヤ・熱管理</span>
                      <span className="font-racing font-bold text-emerald-400">
                        {tacticalScore.tyreEnergyScore} / 25
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden mt-2.5">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-green-400 transition-all duration-500"
                        style={{ width: `${(tacticalScore.tyreEnergyScore / 25) * 100}%` }}
                      />
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1.5 font-mono">表層・内部コア二層熱制御</div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-white/10 shadow-sm">
                    <div className="flex justify-between text-xs text-slate-300">
                      <span>突発適応・チームワーク</span>
                      <span className="font-racing font-bold text-cyan-400">
                        {tacticalScore.chaosTeamScore} / 25
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden mt-2.5">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-500 to-blue-400 transition-all duration-500"
                        style={{ width: `${(tacticalScore.chaosTeamScore / 25) * 100}%` }}
                      />
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1.5 font-mono">無線対応・ダブルスタック回避</div>
                  </div>
                </div>

                {/* Key Decisions Delta list */}
                {tacticalScore.keyDecisions.length > 0 && (
                  <div className="space-y-2">
                    <span className="font-racing font-bold text-xs text-white flex items-center gap-2">
                      <span>🎯 勝敗を分けた主要な戦術判断（タイム損得 Delta）</span>
                    </span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                      {tacticalScore.keyDecisions.map((dec, i) => (
                        <div
                          key={i}
                          className={`p-3.5 rounded-2xl border text-xs space-y-1.5 transition-all ${
                            dec.verdict === 'optimal'
                              ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                              : 'bg-red-950/40 border-red-500/40 text-red-200'
                          }`}
                        >
                          <div className="flex justify-between items-center font-racing font-bold">
                            <span className="flex items-center gap-1.5">
                              <span>{dec.verdict === 'optimal' ? '✅' : '⚠️'}</span>
                              <span>LAP {dec.lap}: {dec.title}</span>
                            </span>
                            <span
                              className={`font-mono font-black text-sm ${
                                dec.impactSeconds > 0 ? 'text-emerald-400' : 'text-red-400'
                              }`}
                            >
                              {dec.impactSeconds > 0 ? '+' : ''}
                              {dec.impactSeconds}s
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
                            {dec.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tactical Decision Timeline */}
                <div className="p-4 rounded-2xl bg-slate-900/90 border border-white/10 space-y-3 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-base">⏱️</span>
                      <span className="font-racing font-bold text-xs sm:text-sm text-white">
                        周回別 戦術判断タイムライン (Tactical Command Log)
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-white/10 text-slate-300">
                        {tacticalEventTimeline.length} 件の記録
                      </span>
                    </div>
                  </div>

                  {tacticalEventTimeline.length === 0 ? (
                    <div className="p-3.5 rounded-xl bg-slate-950/60 border border-dashed border-white/10 text-center text-xs text-slate-400 font-mono">
                      レース中の指示変更なし（初期戦略プラン通りに完走）
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                      {tacticalEventTimeline.map((item) => (
                        <div
                          key={item.id}
                          className="p-2.5 rounded-xl bg-slate-950/80 border border-white/5 flex items-center justify-between text-xs font-mono"
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="text-base">{item.icon}</span>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="px-1.5 py-0.2 rounded bg-red-950 border border-red-500/40 text-red-300 font-bold text-[10px]">
                                  LAP {item.lap}
                                </span>
                                <span className="font-racing font-bold text-white text-xs">
                                  {item.title}
                                </span>
                              </div>
                              <div className="text-[11px] text-slate-300 font-sans mt-0.5">
                                {item.detail}
                              </div>
                            </div>
                          </div>
                          <span className="text-[10px] text-slate-400 shrink-0">
                            {item.timestamp}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Gemini AI Tactical Debrief Card */}
                {geminiDebrief && (
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-950/40 to-slate-900 border border-purple-500/40 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-racing font-bold text-purple-300">
                      <Bot className="w-4 h-4 text-purple-400" />
                      <span>AIチーフストラテジストからの総括デブリーフィング</span>
                    </div>
                    <div className="p-3 rounded-xl bg-black/40 border border-white/5 text-xs text-slate-200 leading-relaxed font-sans whitespace-pre-wrap">
                      {geminiDebrief}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── TAB 2: 司令官性格診断 (Strategist Archetype Diagnosis) ── */}
            {debriefTab === 'archetype' && diagnosticResult && (
              <div className="space-y-4 animate-in fade-in duration-300">
                <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-950/40 to-slate-900 border border-amber-500/40 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-white/20 flex items-center justify-center text-3xl shadow-lg">
                      {diagnosticResult.archetype.icon}
                    </div>
                    <div>
                      <div className="text-xs font-mono text-amber-300 font-bold uppercase tracking-wider">
                        STRATEGIST ARCHETYPE DIAGNOSIS
                      </div>
                      <h3 className="font-racing font-bold text-white text-lg sm:text-xl">
                        {diagnosticResult.archetype.name}
                      </h3>
                      <div className="text-xs text-slate-300 font-racing">
                        {diagnosticResult.archetype.englishTitle}
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-200 leading-relaxed font-sans bg-black/40 p-3 rounded-xl border border-white/5">
                    {diagnosticResult.archetype.summary}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div className="p-3 rounded-xl bg-slate-950/80 border border-white/5 space-y-1 text-xs">
                      <div className="text-emerald-400 font-racing font-bold">強み・長所:</div>
                      <p className="text-slate-300 text-[11px] leading-relaxed font-sans">
                        {diagnosticResult.archetype.strengths.join(' / ')}
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-950/80 border border-white/5 space-y-1 text-xs">
                      <div className="text-amber-400 font-racing font-bold">弱点・注意点:</div>
                      <p className="text-slate-300 text-[11px] leading-relaxed font-sans">
                        {diagnosticResult.archetype.weaknesses.join(' / ')}
                      </p>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-slate-400 font-mono text-[10px]">歴史的背景: </span>
                      <span className="font-racing font-bold text-white">{diagnosticResult.archetype.historicalContext}</span>
                    </div>
                    <div className="text-[11px] text-amber-300 font-racing italic">
                      {diagnosticResult.archetype.catchphrase}
                    </div>
                  </div>
                </div>

                {/* All Archetypes Catalog */}
                <div className="space-y-2">
                  <div className="text-xs font-racing font-bold text-slate-300">
                    全司令官アーキタイプ一覧:
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                    {Object.values(STRATEGIST_ARCHETYPES).map((arch) => {
                      const isCurrent = arch.id === diagnosticResult.archetype.id;
                      return (
                        <div
                          key={arch.id}
                          className={`p-3 rounded-xl border text-xs space-y-1.5 transition-all ${
                            isCurrent
                              ? 'bg-amber-950/60 border-amber-500 shadow-md ring-1 ring-amber-400'
                              : 'bg-slate-900/60 border-white/5 text-slate-400'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{arch.icon}</span>
                            <div className="font-racing font-bold text-white text-xs">
                              {arch.name}
                            </div>
                          </div>
                          <p className="text-[10px] text-slate-300 line-clamp-2 leading-relaxed font-sans">
                            {arch.englishTitle}
                          </p>
                          <div className="text-[9px] text-slate-400 font-mono line-clamp-1">
                            {arch.catchphrase}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* ── TAB 3: 称号 ＆ 絶望バッジ (F1 Badges Museum) ── */}
            {debriefTab === 'badges' && (
              <div className="space-y-3 animate-in fade-in duration-300">
                {/* Badge Category Filter Tabs */}
                <div className="flex flex-wrap items-center gap-1.5 text-xs font-racing pb-1">
                  {([
                    { id: 'all' as const, label: 'ALL (すべて)' },
                    { id: 'masterstroke' as const, label: '🏆 神采配 (Masterstroke)' },
                    { id: 'quote_meme' as const, label: '📻 名言・ミーム (Meme & Quote)' },
                    { id: 'despair_trauma' as const, label: '💀 絶望・トラウマ (Despair)' },
                  ]).map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setBadgeCategoryFilter(cat.id)}
                      className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                        badgeCategoryFilter === cat.id
                          ? 'bg-red-600 border-red-500 text-white shadow-md font-bold'
                          : 'bg-slate-900/80 border-white/10 text-slate-400 hover:text-white'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {F1_BADGES_CATALOG
                    .filter((b) => badgeCategoryFilter === 'all' || b.category === badgeCategoryFilter)
                    .map((badge) => {
                      const isUnlocked = careerData.unlockedBadgeIds.includes(badge.id);
                      const isNewlyUnlocked = diagnosticResult?.unlockedBadgesThisRace.some((b) => b.id === badge.id);

                      return (
                        <div
                          key={badge.id}
                          role="button"
                          tabIndex={0}
                          onClick={() => setSelectedBadgeForDetail(badge)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              setSelectedBadgeForDetail(badge);
                            }
                          }}
                          className={`p-3 rounded-2xl border text-xs flex flex-col justify-between transition-all cursor-pointer select-none group ${
                            isUnlocked
                              ? `${badge.rarityColor} hover:brightness-125 shadow-md`
                              : 'bg-slate-950/70 border-white/5 text-slate-600 opacity-60 hover:opacity-80'
                          } ${isNewlyUnlocked ? 'ring-2 ring-amber-400 animate-pulse' : ''}`}
                        >
                          <div>
                            <div className="flex items-center justify-between pb-1.5">
                              <span className="text-xl">{badge.icon}</span>
                              <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded ${
                                isUnlocked ? 'bg-black/50 text-white font-bold' : 'bg-slate-900 text-slate-500'
                              }`}>
                                {badge.rarity}
                              </span>
                            </div>
                            <div className={`font-racing font-bold text-xs mt-1 ${
                              isUnlocked ? 'text-white' : 'text-slate-500'
                            }`}>
                              {badge.name}
                            </div>
                            <div className="text-[10px] text-slate-400 line-clamp-2 mt-1">
                              {isUnlocked ? badge.historicalQuote : '🔒 ' + badge.unlockConditionText}
                            </div>
                          </div>

                          <div className="pt-2 text-[9px] font-mono flex items-center justify-between text-slate-400 mt-2 border-t border-white/5">
                            <span>{badge.categoryLabel}</span>
                            <span className="text-amber-400/80 group-hover:text-amber-300">詳細 ➔</span>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}

            {/* ── TAB 4: 大百科スマート学習 (Pedagogical Links) ── */}
            {debriefTab === 'knowledge' && (
              <div className="space-y-3 animate-in fade-in duration-300">
                <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-white/10 text-xs leading-relaxed space-y-1.5">
                  <span className="text-xs font-racing font-bold text-slate-200 flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-red-400" />
                    戦術理解を深めて次戦へ活かす — 関連F1大百科・工学解説:
                  </span>
                  <p className="text-slate-400 text-[11px]">
                    今回のレース展開や失着・成功に関係する戦術理論です。タップするとF1大百科の解説ポップアップを開きます。
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {tacticalScore.linkedKeywords.map((kw) => (
                    <button
                      key={kw}
                      type="button"
                      onClick={() => handleOpenIntel(kw)}
                      className="p-3 rounded-2xl bg-red-950/40 hover:bg-red-900/60 border border-red-500/40 text-left transition-all cursor-pointer group shadow-sm flex items-center justify-between"
                    >
                      <div>
                        <div className="font-racing font-bold text-white text-xs group-hover:text-red-300 flex items-center gap-1.5">
                          <span>💡</span>
                          <span>{kw.replace('-', ' ').toUpperCase()}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          F1大百科で理論・数式・実戦例を読む
                        </div>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-red-400 opacity-60 group-hover:opacity-100" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── Debrief Action Bar (Restart, Tweak Strategy, Change Mode) ── */}
          <div className="p-4 rounded-2xl bg-slate-900/95 border border-white/15 shadow-xl flex flex-wrap items-center justify-between gap-3 backdrop-blur-md">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <span>レース総括完了</span>
              <span className="text-slate-600">•</span>
              <span>獲得CP: <strong className="text-amber-400 font-racing">+{diagnosticResult?.totalCpEarnedThisRace || 0} CP</strong></span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleRestartRace}
                className="btn-console px-3.5 py-2 text-xs font-racing font-bold text-cyan-300 border-cyan-500/40 hover:bg-cyan-950/60 flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>🔄 同じ設定でリスタート</span>
              </button>

              <button
                type="button"
                onClick={handleBackToBriefing}
                className="btn-console px-3.5 py-2 text-xs font-racing font-bold text-amber-300 border-amber-500/40 hover:bg-amber-950/60 flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>⚙️ 作戦を修正して再挑戦</span>
              </button>

              <button
                type="button"
                onClick={handleBackToModeSelect}
                className="btn-console-primary px-4 py-2 text-xs font-racing font-bold flex items-center gap-1.5 transition-all shadow-md shadow-red-950 cursor-pointer"
              >
                <Trophy className="w-3.5 h-3.5 text-yellow-300" />
                <span>🏆 モード選択に戻る</span>
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="p-8 rounded-3xl bg-slate-950/90 border border-white/10 text-center space-y-4">
          <div className="text-5xl">🏁</div>
          <h3 className="text-xl font-racing font-bold text-white">まだレース結果がありません</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            レースを完走すると、ここにFIA戦術評価、判断タイムライン、司令官アーキタイプ診断、AI軍師の総括解説が表示されます。
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => setSimulatorPhase('race')}
              className="btn-console px-5 py-2.5 text-xs font-racing font-bold text-cyan-300 border-cyan-500/40 cursor-pointer"
            >
              ピットウォールに戻る
            </button>
            <button
              type="button"
              onClick={handleBackToModeSelect}
              className="btn-console-primary px-5 py-2.5 text-xs font-racing font-bold cursor-pointer"
            >
              モード選択に戻る
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
