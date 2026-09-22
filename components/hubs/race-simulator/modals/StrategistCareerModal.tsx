'use client';

import React from 'react';
import { Trophy, XCircle } from 'lucide-react';
import {
  F1_BADGES_CATALOG,
  type SavedCareerData,
  type F1Badge,
} from '@/lib/raceDebriefAnalysis';
import {
  PRESET_CHALLENGES,
  MISSION_CHALLENGES,
} from '@/lib/raceSimulationEngine';

interface StrategistCareerModalProps {
  isOpen: boolean;
  onClose: () => void;
  careerData: SavedCareerData;
  onSelectBadge: (badge: F1Badge) => void;
}

export const StrategistCareerModal: React.FC<StrategistCareerModalProps> = ({
  isOpen,
  onClose,
  careerData,
  onSelectBadge,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="max-w-2xl w-full glass-card-premium p-6 rounded-3xl border-2 border-red-500/60 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start pb-3 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-red-600 flex items-center justify-center text-2xl shadow-lg">
              🏆
            </div>
            <div>
              <div className="text-xs font-mono text-amber-300 font-bold">FIA STRATEGIST CAREER</div>
              <h3 className="font-racing font-bold text-white text-lg sm:text-xl">
                司令官ライセンス ＆ 獲得称号ミュージアム
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-white/10"
          >
            <XCircle className="w-6 h-6" />
          </button>
        </div>

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
            <div className="text-slate-400 text-[10px] font-mono">獲得称号</div>
            <div className="font-racing font-bold text-rose-400 text-sm mt-0.5">
              {careerData.unlockedBadgeIds.length} / {F1_BADGES_CATALOG.length}
            </div>
          </div>
        </div>

        {/* Trophy Room Section */}
        <div className="space-y-2 pt-2 border-t border-white/10">
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
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
        <div className="space-y-2 pt-2 border-t border-white/10">
          <div className="font-racing font-bold text-xs text-white flex justify-between items-center">
            <span>🎖️ 全称号コレクション ({careerData.unlockedBadgeIds.length}/{F1_BADGES_CATALOG.length})</span>
            <span className="text-[10px] text-slate-400 font-mono">タップで名言と歴史背景を表示</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-72 overflow-y-auto pr-1">
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

        <button
          type="button"
          onClick={onClose}
          className="btn-console w-full py-2.5 text-xs font-racing font-bold text-white text-center"
        >
          閉じる
        </button>
      </div>
    </div>
  );
};
