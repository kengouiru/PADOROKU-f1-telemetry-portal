'use client';

/**
 * components/hubs/SeasonHub.tsx
 * 🏁 2025 Formula 1 Season Weekend Companion & Hub
 * Features:
 *  - Next GP Live Countdown (Days, Hours, Min, Sec)
 *  - Full JST Weekend Schedule (FP, Quali, Sprint, Race in Japan Time)
 *  - 2025 Race Calendar (All 24 GPs with flags, Pirelli compounds, Sprint badges)
 *  - Championship Standings (2024 Final & 2025 live form with interactive bars)
 *  - 2025 Grid Showcase (10 teams x 2 drivers, transfer highlights like Hamilton/Ferrari, Sainz/Williams, 6 rookies)
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  SEASON_2025_CALENDAR,
  DRIVER_STANDINGS_2024,
  CONSTRUCTOR_STANDINGS_2024,
  GRID_2025_TEAMS,
  type RaceWeekendSchedule,
  type DriverStanding,
  type ConstructorStanding,
  type Grid2025Team,
} from '@/data/f1SeasonData';

interface SeasonHubProps {
  onNavigateToTelemetry?: (gpName?: string) => void;
  onNavigateToTyres?: () => void;
  onNavigateToDrama?: () => void;
  onNavigateToGlossary?: () => void;
  onNavigateToCircuit?: (circuitId: string) => void;
}

const ROUND_TO_CIRCUIT_ID: Record<number, string> = {
  1: 'albert-park',
  2: 'shanghai',
  3: 'suzuka',
  4: 'bahrain-international',
  5: 'jeddah',
  6: 'miami',
  7: 'imola',
  8: 'circuit-de-monaco',
  9: 'catalunya',
  10: 'villeneuve',
  11: 'redbull-ring',
  12: 'silverstone',
  13: 'hungaroring',
  14: 'spa-francorchamps',
  15: 'zandvoort',
  16: 'monza',
  17: 'baku',
  18: 'singapore',
  19: 'cota',
  20: 'mexico',
  21: 'interlagos',
  22: 'las-vegas',
  23: 'losail',
  24: 'yas-marina',
};

type MainTab = 'calendar' | 'standings' | 'grid';

export default function SeasonHub({
  onNavigateToTelemetry,
  onNavigateToTyres,
  onNavigateToDrama,
  onNavigateToGlossary,
  onNavigateToCircuit,
}: SeasonHubProps) {
  const [activeTab, setActiveTab] = useState<MainTab>('calendar');
  const [selectedRound, setSelectedRound] = useState<number>(1);
  const [standingsType, setStandingsType] = useState<'drivers' | 'constructors'>('drivers');
  const [calendarFilter, setCalendarFilter] = useState<'all' | 'sprint'>('all');

  // Selected Race Weekend
  const selectedRace = useMemo(() => {
    return SEASON_2025_CALENDAR.find((r) => r.round === selectedRound) || SEASON_2025_CALENDAR[0];
  }, [selectedRound]);

  // Countdown timer calculation
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isPast: boolean;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0, isPast: false });

  useEffect(() => {
    const calculateTime = () => {
      const targetTime = new Date(selectedRace.targetDateUtc).getTime();
      const now = new Date().getTime();
      const difference = targetTime - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true });
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);
        setTimeLeft({ days, hours, minutes, seconds, isPast: false });
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [selectedRace]);

  // Filtered calendar
  const filteredCalendar = useMemo(() => {
    if (calendarFilter === 'sprint') {
      return SEASON_2025_CALENDAR.filter((r) => r.isSprint);
    }
    return SEASON_2025_CALENDAR;
  }, [calendarFilter]);

  const maxDriverPoints = DRIVER_STANDINGS_2024[0]?.points || 1;
  const maxTeamPoints = CONSTRUCTOR_STANDINGS_2024[0]?.points || 1;

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* ─────────────────────────────────────────────────────────────
          1. NEXT RACE HERO & JST SCHEDULE BANNER
          ───────────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-950 to-neutral-950 p-6 md:p-8 shadow-2xl">
        {/* Background glow & accents */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row gap-6 lg:items-center lg:justify-between">
          {/* Left: Race Information */}
          <div className="space-y-3 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-racing font-bold tracking-wider uppercase bg-red-500/20 text-red-400 border border-red-500/30">
                🏁 第{selectedRace.round}戦 / 全24戦
              </span>
              {selectedRace.isSprint && (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-racing font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse">
                  ⚡ スプリント開催週
                </span>
              )}
              <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                📅 {selectedRace.dates}
              </span>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-3xl md:text-4xl">{selectedRace.flag}</span>
              <h1 className="text-2xl md:text-3xl font-racing font-black text-white tracking-tight">
                {selectedRace.gpName}
              </h1>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
              <span className="font-semibold text-slate-200">
                📍 {selectedRace.circuitName} ({selectedRace.city}, {selectedRace.country})
              </span>
              <span className="text-slate-500">|</span>
              <span>🛣️ 全長: {selectedRace.lengthKm.toFixed(3)} km</span>
              <span className="text-slate-500">|</span>
              <span>🔄 決勝: {selectedRace.laps} 周</span>
              <span className="text-slate-500">|</span>
              <span className="text-amber-400 font-mono">🛞 {selectedRace.pirelliCompounds}</span>
            </div>

            {/* JST Weekend Timetable */}
            <div className="mt-4 pt-3 border-t border-white/10">
              <div className="text-[11px] font-racing font-bold text-red-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <span>⏰ 日本時間 (JST) セッション予定</span>
                <span className="text-[10px] text-slate-500 font-normal">※生中継観戦用</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {selectedRace.scheduleJst.map((s, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03] border border-white/5 text-xs"
                  >
                    <span className="text-slate-300 font-medium">{s.session}</span>
                    <span className="font-mono font-bold text-amber-300">{s.dayTime}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Countdown Clock & Quick Actions */}
          <div className="flex flex-col items-center lg:items-end gap-4 min-w-[260px]">
            <div className="w-full bg-black/40 p-4 rounded-2xl border border-white/10 text-center shadow-inner">
              <div className="text-[10px] font-racing font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                決勝スタートまで
              </div>
              <div className="grid grid-cols-4 gap-1.5 font-mono text-center">
                <div className="p-2 rounded-lg bg-white/5 border border-white/5">
                  <div className="text-xl md:text-2xl font-black text-white">{timeLeft.days}</div>
                  <div className="text-[9px] text-slate-400 uppercase">DAYS</div>
                </div>
                <div className="p-2 rounded-lg bg-white/5 border border-white/5">
                  <div className="text-xl md:text-2xl font-black text-amber-400">{timeLeft.hours}</div>
                  <div className="text-[9px] text-slate-400 uppercase">HOURS</div>
                </div>
                <div className="p-2 rounded-lg bg-white/5 border border-white/5">
                  <div className="text-xl md:text-2xl font-black text-white">{timeLeft.minutes}</div>
                  <div className="text-[9px] text-slate-400 uppercase">MIN</div>
                </div>
                <div className="p-2 rounded-lg bg-white/5 border border-white/5">
                  <div className="text-xl md:text-2xl font-black text-red-400 animate-pulse">{timeLeft.seconds}</div>
                  <div className="text-[9px] text-slate-400 uppercase">SEC</div>
                </div>
              </div>
              <div className="mt-2 text-[10px] text-slate-400 flex items-center justify-center gap-1">
                <span>🎯</span>
                <span>ターゲット: {selectedRace.dates.split('-')[1]?.trim() || selectedRace.dates}</span>
              </div>
            </div>

            {/* Quick Actions for Race Viewers */}
            <div className="flex items-center gap-2 w-full">
              {onNavigateToTelemetry && (
                <button
                  onClick={() => onNavigateToTelemetry(selectedRace.gpName)}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-racing font-bold text-xs shadow-lg shadow-red-600/20 transition-all flex items-center justify-center gap-1.5"
                >
                  <span>🏎️</span>
                  <span>テレメトリー分析へ</span>
                </button>
              )}
              {onNavigateToTyres && (
                <button
                  onClick={onNavigateToTyres}
                  className="py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white font-racing font-bold text-xs transition-all flex items-center justify-center gap-1"
                  title="タイヤ戦略・コンパウンド解説を見る"
                >
                  <span>🛞</span>
                  <span className="hidden sm:inline">タイヤ戦略</span>
                </button>
              )}
              {onNavigateToCircuit && (
                <button
                  onClick={() => onNavigateToCircuit(ROUND_TO_CIRCUIT_ID[selectedRace.round] || 'suzuka')}
                  className="py-2.5 px-3 rounded-xl bg-sky-600/20 hover:bg-sky-600/30 border border-sky-500/30 text-sky-300 hover:text-white font-racing font-bold text-xs transition-all flex items-center justify-center gap-1 shadow-sm"
                  title="サーキット諸元・コース解説を見る"
                >
                  <span>🏁</span>
                  <span className="hidden sm:inline">コース解説</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. NAVIGATION TABS (CALENDAR / STANDINGS / 2025 GRID)
          ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900/80 border border-white/10">
          <button
            onClick={() => setActiveTab('calendar')}
            className={`px-4 py-2 rounded-lg text-xs font-racing font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'calendar'
                ? 'bg-red-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>📅</span>
            <span>2025 レースカレンダー (24戦)</span>
          </button>
          <button
            onClick={() => setActiveTab('standings')}
            className={`px-4 py-2 rounded-lg text-xs font-racing font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'standings'
                ? 'bg-red-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>🏆</span>
            <span>順位表・ランキング</span>
          </button>
          <button
            onClick={() => setActiveTab('grid')}
            className={`px-4 py-2 rounded-lg text-xs font-racing font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'grid'
                ? 'bg-red-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>👥</span>
            <span>2025 参戦グリッド・チーム</span>
          </button>
        </div>

        {/* Action button to open drama or glossary */}
        <div className="flex items-center gap-2">
          {onNavigateToGlossary && (
            <button
              onClick={onNavigateToGlossary}
              className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-racing font-bold transition-all flex items-center gap-1"
            >
              <span>🔍</span>
              <span>用語辞典を開く</span>
            </button>
          )}
          {onNavigateToDrama && (
            <button
              onClick={onNavigateToDrama}
              className="px-3 py-1.5 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-racing font-bold transition-all flex items-center gap-1"
            >
              <span>🎬</span>
              <span>今季の因縁・ドラマ録</span>
            </button>
          )}
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          TAB CONTENT: 1. CALENDAR
          ───────────────────────────────────────────────────────────── */}
      {activeTab === 'calendar' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs">
            <div className="text-slate-400">
              各グランプリをクリックすると、上部のカウントダウン＆日本時間予定表が切り替わります。
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCalendarFilter('all')}
                className={`px-2.5 py-1 rounded-md text-xs ${
                  calendarFilter === 'all'
                    ? 'bg-slate-700 text-white font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                全24戦
              </button>
              <button
                onClick={() => setCalendarFilter('sprint')}
                className={`px-2.5 py-1 rounded-md text-xs flex items-center gap-1 ${
                  calendarFilter === 'sprint'
                    ? 'bg-amber-600 text-white font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>⚡</span>
                <span>スプリント戦のみ (6)</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {filteredCalendar.map((gp) => {
              const isSelected = gp.round === selectedRound;
              return (
                <div
                  key={gp.round}
                  onClick={() => setSelectedRound(gp.round)}
                  className={`cursor-pointer p-4 rounded-xl border transition-all text-left flex flex-col justify-between ${
                    isSelected
                      ? 'bg-red-950/40 border-red-500/60 ring-1 ring-red-500/40 shadow-lg shadow-red-950/50 scale-[1.01]'
                      : 'bg-slate-900/60 hover:bg-slate-800/70 border-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-racing font-bold text-slate-400 uppercase">
                        Round {gp.round}
                      </span>
                      <div className="flex items-center gap-1">
                        {gp.isSprint && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            SPRINT
                          </span>
                        )}
                        <span className="text-base">{gp.flag}</span>
                      </div>
                    </div>

                    <div>
                      <h3
                        className={`font-racing font-bold text-sm leading-tight ${
                          isSelected ? 'text-red-300' : 'text-white'
                        }`}
                      >
                        {gp.gpName}
                      </h3>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">{gp.circuitName}</p>
                    </div>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-[11px]">
                    <span className="font-mono text-slate-300">{gp.dates.replace('2025年 ', '')}</span>
                    {onNavigateToCircuit ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onNavigateToCircuit(ROUND_TO_CIRCUIT_ID[gp.round] || 'suzuka');
                        }}
                        className="text-[10px] text-sky-400 hover:text-sky-300 flex items-center gap-1 font-mono font-medium hover:underline bg-sky-950/40 px-2 py-0.5 rounded border border-sky-500/20"
                        title="サーキット詳細を見る"
                      >
                        <span>🏁 コース解説</span>
                        <span>➔</span>
                      </button>
                    ) : (
                      <span className="text-[10px] text-amber-400 font-mono">{gp.pirelliCompounds}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          TAB CONTENT: 2. STANDINGS
          ───────────────────────────────────────────────────────────── */}
      {activeTab === 'standings' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-xs text-slate-400">
              2024年 最終確定ランキング ＆ 2025年 開幕シミュレーション
            </div>
            <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-lg border border-white/10 text-xs">
              <button
                onClick={() => setStandingsType('drivers')}
                className={`px-3 py-1 rounded font-racing font-bold ${
                  standingsType === 'drivers'
                    ? 'bg-red-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                ドライバー順位
              </button>
              <button
                onClick={() => setStandingsType('constructors')}
                className={`px-3 py-1 rounded font-racing font-bold ${
                  standingsType === 'constructors'
                    ? 'bg-red-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                コンストラクター順位
              </button>
            </div>
          </div>

          {standingsType === 'drivers' ? (
            <div className="rounded-xl border border-white/10 overflow-hidden bg-slate-900/60">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/80 text-slate-400 font-racing uppercase text-[10px] border-b border-white/10">
                    <tr>
                      <th className="py-3 px-3 text-center w-12">順位</th>
                      <th className="py-3 px-3">ドライバー</th>
                      <th className="py-3 px-3">所属チーム</th>
                      <th className="py-3 px-3 text-center w-16">勝利数</th>
                      <th className="py-3 px-3 text-center w-16">表彰台</th>
                      <th className="py-3 px-4 text-right w-44">ポイント</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {DRIVER_STANDINGS_2024.map((d) => {
                      const percentage = (d.points / maxDriverPoints) * 100;
                      return (
                        <tr
                          key={d.position}
                          className="hover:bg-white/[0.03] transition-colors group"
                        >
                          <td className="py-3 px-3 text-center font-mono font-bold text-slate-300">
                            {d.position === 1 ? (
                              <span className="text-amber-400 text-sm">👑 1</span>
                            ) : d.position <= 3 ? (
                              <span className="text-white font-bold">{d.position}</span>
                            ) : (
                              <span className="text-slate-400">{d.position}</span>
                            )}
                          </td>
                          <td className="py-3 px-3 font-semibold text-white group-hover:text-red-300 transition-colors">
                            <span className="font-mono text-slate-400 mr-1.5">[{d.driverCode}]</span>
                            {d.driverName}
                          </td>
                          <td className="py-3 px-3 text-slate-300 flex items-center gap-2">
                            <span
                              className="w-2.5 h-2.5 rounded-full inline-block shrink-0"
                              style={{ backgroundColor: d.teamColor }}
                            />
                            <span>{d.team}</span>
                          </td>
                          <td className="py-3 px-3 text-center font-mono text-slate-300">
                            {d.wins > 0 ? (
                              <span className="text-amber-300 font-bold">{d.wins}勝</span>
                            ) : (
                              <span className="text-slate-600">-</span>
                            )}
                          </td>
                          <td className="py-3 px-3 text-center font-mono text-slate-300">
                            {d.podiums > 0 ? (
                              <span className="text-slate-200">{d.podiums}回</span>
                            ) : (
                              <span className="text-slate-600">-</span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-2.5">
                              <div className="w-24 h-2 bg-slate-800 rounded-full overflow-hidden hidden sm:block">
                                <div
                                  className="h-full rounded-full transition-all duration-500"
                                  style={{
                                    width: `${percentage}%`,
                                    backgroundColor: d.teamColor,
                                  }}
                                />
                              </div>
                              <span className="font-mono font-bold text-white text-sm w-12 text-right">
                                {d.points} pt
                              </span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-white/10 overflow-hidden bg-slate-900/60">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/80 text-slate-400 font-racing uppercase text-[10px] border-b border-white/10">
                    <tr>
                      <th className="py-3 px-3 text-center w-12">順位</th>
                      <th className="py-3 px-3">チーム名</th>
                      <th className="py-3 px-3">パワーユニット (PU)</th>
                      <th className="py-3 px-3 text-center w-16">勝利数</th>
                      <th className="py-3 px-4 text-right w-44">総獲得ポイント</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {CONSTRUCTOR_STANDINGS_2024.map((team) => {
                      const percentage = (team.points / maxTeamPoints) * 100;
                      return (
                        <tr
                          key={team.position}
                          className="hover:bg-white/[0.03] transition-colors group"
                        >
                          <td className="py-3 px-3 text-center font-mono font-bold text-slate-300">
                            {team.position === 1 ? (
                              <span className="text-amber-400 text-sm">🏆 1</span>
                            ) : (
                              team.position
                            )}
                          </td>
                          <td className="py-3 px-3 font-semibold text-white flex items-center gap-2">
                            <span
                              className="w-3 h-3 rounded-md shrink-0 shadow-sm"
                              style={{ backgroundColor: team.teamColor }}
                            />
                            <span>{team.teamName}</span>
                          </td>
                          <td className="py-3 px-3 font-mono text-slate-400">{team.powerUnit}</td>
                          <td className="py-3 px-3 text-center font-mono text-slate-300">
                            {team.wins > 0 ? (
                              <span className="text-amber-300 font-bold">{team.wins}勝</span>
                            ) : (
                              <span className="text-slate-600">-</span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-2.5">
                              <div className="w-28 h-2 bg-slate-800 rounded-full overflow-hidden hidden sm:block">
                                <div
                                  className="h-full rounded-full transition-all duration-500"
                                  style={{
                                    width: `${percentage}%`,
                                    backgroundColor: team.teamColor,
                                  }}
                                />
                              </div>
                              <span className="font-mono font-bold text-white text-sm w-14 text-right">
                                {team.points} pt
                              </span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          TAB CONTENT: 3. 2025 GRID SHOWCASE
          ───────────────────────────────────────────────────────────── */}
      {activeTab === 'grid' && (
        <div className="space-y-4">
          <div className="text-xs text-slate-400">
            2025年 全10チーム・20名のドライバー布陣。ハミルトンの跳ね馬移籍、サインツのウィリアムズ加入、そして前代未聞の大型ルーキー陣に注目！
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {GRID_2025_TEAMS.map((team, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-white/10 bg-slate-900/60 hover:border-white/20 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3 border-b border-white/10 pb-2.5">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3.5 h-3.5 rounded-full shadow-sm"
                        style={{ backgroundColor: team.teamColor }}
                      />
                      <h3 className="font-racing font-bold text-base text-white">{team.teamName}</h3>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 px-2 py-0.5 rounded bg-white/5 border border-white/5">
                      PU: {team.powerUnit}
                    </span>
                  </div>

                  <div className="space-y-2">
                    {team.drivers.map((driver) => (
                      <div
                        key={driver.number}
                        className="p-2.5 rounded-lg bg-black/40 border border-white/5 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="font-mono font-black text-xs text-slate-400 w-6 text-center">
                            #{driver.number}
                          </span>
                          <span className="text-base">{driver.flag}</span>
                          <div>
                            <div className="font-semibold text-xs text-white flex items-center gap-1.5">
                              <span>{driver.name}</span>
                              <span className="text-[10px] font-mono text-slate-400">
                                ({driver.code})
                              </span>
                            </div>
                            {driver.note && (
                              <div className="text-[10px] text-amber-300/90 mt-0.5 font-medium">
                                {driver.note}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          {driver.isTransfer && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                              NEW TEAM
                            </span>
                          )}
                          {driver.isRookie && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                              ROOKIE
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
