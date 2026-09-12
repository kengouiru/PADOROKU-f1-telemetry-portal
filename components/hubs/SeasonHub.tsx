'use client';

/**
 * components/hubs/SeasonHub.tsx
 * 🏁 Formula 1 Season Weekend Companion & Calendar Hub
 * Features:
 *  - 2026 Current Season & 2025 Archive Season Switcher with Auto-Rollover Detection
 *  - Automatic Next GP Resolution based on current date
 *  - Live Ticking Countdown (Days, Hours, Min, Sec)
 *  - Full JST Weekend Schedule (FP, Quali, Sprint, Race in Japan Time)
 *  - Race Calendar (All 24 GPs with flags, Pirelli compounds, Sprint badges)
 *  - Championship Standings (2026 Live Standings & 2025 Annual Finals)
 *  - Grid Showcase (2026 New PU Regs & Audi/Honda Works vs 2025 Grid)
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  type SeasonYear,
  getActiveSeasonYear,
  getSeasonCalendar,
  getSeasonGrid,
  getDriverStandings,
  getConstructorStandings,
  getNextUpcomingRound,
  isSeasonConcluded,
  type RaceWeekendSchedule,
  type DriverStanding,
  type ConstructorStanding,
  type GridTeam,
} from '@/data/f1SeasonData';
import { getWeatherByRound, getCircuitWeather } from '@/data/f1WeatherData';
import { getGrandPrixReportByRound, getGrandPrixReportByCircuitId } from '@/data/f1GrandPrixReportsData';

interface SeasonHubProps {
  onNavigateToTelemetry?: (gpName?: string) => void;
  onNavigateToTyres?: () => void;
  onNavigateToDrama?: () => void;
  onNavigateToGlossary?: () => void;
  onNavigateToCircuit?: (circuitId: string) => void;
}

export function getCircuitIdForRace(race: RaceWeekendSchedule): string {
  const name = (race.gpName + ' ' + race.circuitName).toLowerCase();
  if (name.includes('アルバート') || name.includes('albert') || name.includes('オーストラリア')) return 'albert-park';
  if (name.includes('上海') || name.includes('shanghai') || name.includes('中国')) return 'shanghai';
  if (name.includes('鈴鹿') || name.includes('suzuka') || name.includes('日本')) return 'suzuka';
  if (name.includes('サヒール') || name.includes('bahrain') || name.includes('バーレーン')) return 'bahrain-international';
  if (name.includes('ジェッダ') || name.includes('jeddah') || name.includes('サウジ')) return 'jeddah';
  if (name.includes('マイアミ') || name.includes('miami')) return 'miami';
  if (name.includes('イモラ') || name.includes('imola')) return 'imola';
  if (name.includes('モナコ') || name.includes('monaco') || name.includes('モンテカルロ')) return 'circuit-de-monaco';
  if (name.includes('マドリード') || name.includes('madrid') || name.includes('マドリング')) return 'madrid';
  if (name.includes('カタロニア') || name.includes('catalunya') || name.includes('バルセロナ') || name.includes('スペイン')) return 'catalunya';
  if (name.includes('カナダ') || name.includes('モントリオール') || name.includes('ジル') || name.includes('villeneuve')) return 'villeneuve';
  if (name.includes('オーストリア') || name.includes('レッドブル・リンク') || name.includes('redbull')) return 'redbull-ring';
  if (name.includes('シルバーストン') || name.includes('silverstone') || name.includes('イギリス')) return 'silverstone';
  if (name.includes('スパ') || name.includes('spa') || name.includes('ベルギー')) return 'spa-francorchamps';
  if (name.includes('ハンガロリンク') || name.includes('hungaroring') || name.includes('ハンガリー') || name.includes('ブダペスト')) return 'hungaroring';
  if (name.includes('ザントフォールト') || name.includes('zandvoort') || name.includes('オランダ')) return 'zandvoort';
  if (name.includes('モンツァ') || name.includes('monza') || name.includes('イタリア')) return 'monza';
  if (name.includes('バクー') || name.includes('baku') || name.includes('アゼルバイジャン')) return 'baku';
  if (name.includes('シンガポール') || name.includes('singapore') || name.includes('マリーナベイ')) return 'singapore';
  if (name.includes('アメリカ') || name.includes('オースティン') || name.includes('cota')) return 'cota';
  if (name.includes('メキシコ') || name.includes('mexico')) return 'mexico';
  if (name.includes('サンパウロ') || name.includes('ブラジル') || name.includes('インテルラゴス') || name.includes('interlagos')) return 'interlagos';
  if (name.includes('ラスベガス') || name.includes('vegas')) return 'las-vegas';
  if (name.includes('カタール') || name.includes('ルサイル') || name.includes('losail')) return 'losail';
  if (name.includes('アブダビ') || name.includes('ヤス') || name.includes('yas')) return 'yas-marina';
  return 'suzuka';
}


type MainTab = 'calendar' | 'standings' | 'grid';

export default function SeasonHub({
  onNavigateToTelemetry,
  onNavigateToTyres,
  onNavigateToDrama,
  onNavigateToGlossary,
  onNavigateToCircuit,
}: SeasonHubProps) {
  // Season State: Defaults to current active season (2026)
  const [selectedSeason, setSelectedSeason] = useState<SeasonYear>(() => getActiveSeasonYear());
  const [activeTab, setActiveTab] = useState<MainTab>('calendar');
  const [standingsType, setStandingsType] = useState<'drivers' | 'constructors'>('drivers');
  const [calendarFilter, setCalendarFilter] = useState<'all' | 'sprint'>('all');
  const [showSeasonInfo, setShowSeasonInfo] = useState<boolean>(false);

  // Active season calendar & grid
  const activeCalendar = useMemo(() => getSeasonCalendar(selectedSeason), [selectedSeason]);
  const activeGrid = useMemo(() => getSeasonGrid(selectedSeason), [selectedSeason]);
  const activeDriverStandings = useMemo(() => getDriverStandings(selectedSeason), [selectedSeason]);
  const activeConstructorStandings = useMemo(() => getConstructorStandings(selectedSeason), [selectedSeason]);
  const seasonEnded = useMemo(() => isSeasonConcluded(activeCalendar), [activeCalendar]);

  // Selected Round: Auto-defaults to the next upcoming race of that season
  const [selectedRound, setSelectedRound] = useState<number>(() => {
    const defaultYear = getActiveSeasonYear();
    const cal = getSeasonCalendar(defaultYear);
    return getNextUpcomingRound(cal);
  });

  // Handle Season Switching
  const handleSeasonChange = (year: SeasonYear) => {
    setSelectedSeason(year);
    const cal = getSeasonCalendar(year);
    // When switching season, set focus to next upcoming round or Round 1
    setSelectedRound(getNextUpcomingRound(cal));
  };

  // Selected Race Weekend
  const selectedRace = useMemo(() => {
    return activeCalendar.find((r) => r.round === selectedRound) || activeCalendar[0];
  }, [activeCalendar, selectedRound]);

  const selectedCircuitId = useMemo(() => {
    return getCircuitIdForRace(selectedRace);
  }, [selectedRace]);

  const selectedWeather = useMemo(() => {
    return getCircuitWeather(selectedCircuitId) || getWeatherByRound(selectedRound);
  }, [selectedCircuitId, selectedRound]);

  const selectedReport = useMemo(() => {
    return getGrandPrixReportByCircuitId(selectedCircuitId) || getGrandPrixReportByRound(selectedRound);
  }, [selectedCircuitId, selectedRound]);

  // Live Countdown timer calculation
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
      return activeCalendar.filter((r) => r.isSprint);
    }
    return activeCalendar;
  }, [activeCalendar, calendarFilter]);

  const maxDriverPoints = activeDriverStandings[0]?.points || 1;
  const maxTeamPoints = activeConstructorStandings[0]?.points || 1;

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* ─────────────────────────────────────────────────────────────
          0. SEASON SWITCHER & SMART ROLLOVER STATUS BAR
          ───────────────────────────────────────────────────────────── */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-r from-slate-900/95 via-slate-950/90 to-slate-900/95 border border-white/10 shadow-xl backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-racing font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <span>📅</span>
              <span>シーズン選択:</span>
            </span>
            <div className="inline-flex items-center p-1 bg-black/50 rounded-xl border border-white/10">
              <button
                type="button"
                onClick={() => handleSeasonChange('2026')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-racing font-bold transition-all flex items-center gap-2 ${
                  selectedSeason === '2026'
                    ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                </span>
                <span>2026年 (現行シーズン)</span>
              </button>
              <button
                type="button"
                onClick={() => handleSeasonChange('2025')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-racing font-bold transition-all flex items-center gap-1.5 ${
                  selectedSeason === '2025'
                    ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>🏛️</span>
                <span>2025年 (アーカイブ)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Status & Info Trigger */}
        <div className="flex items-center gap-2 justify-between md:justify-end">
          {selectedSeason === '2026' ? (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 font-mono text-[11px] shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <span className="truncate">
                {seasonEnded
                  ? '2026シーズン全24戦終了 / 王者決定'
                  : `第${selectedRace.round}戦 ${selectedRace.gpName} (${selectedRace.circuitName})`}
              </span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-white/10 text-slate-300 font-mono text-[11px]">
              <span>🏆</span>
              <span>2025シーズン全24戦終了 / マクラーレン WCC制覇</span>
            </div>
          )}

          <button
            type="button"
            onClick={() => setShowSeasonInfo(!showSeasonInfo)}
            className={`px-2.5 py-1.5 rounded-xl border text-xs font-racing font-bold transition-all flex items-center gap-1 shrink-0 ${
              showSeasonInfo
                ? 'bg-sky-600/30 border-sky-400/50 text-sky-200'
                : 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-400 hover:text-white'
            }`}
            title="シーズン自動移行の設計と仕組み"
          >
            <span>ℹ️</span>
            <span className="hidden sm:inline">自動切替の仕組み</span>
          </button>
        </div>
      </div>

      {/* Season Rollover Architecture Explanation Card */}
      {showSeasonInfo && (
        <div className="p-4 rounded-2xl bg-sky-950/40 border border-sky-500/30 shadow-xl space-y-3 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">🤖</span>
              <h4 className="font-racing font-bold text-sm text-sky-200">
                PADOROKU シーズン自動判定＆移行アーキテクチャ
              </h4>
            </div>
            <button
              onClick={() => setShowSeasonInfo(false)}
              className="text-slate-400 hover:text-white text-xs font-mono"
            >
              ✕ 閉じる
            </button>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            本アプリは端末の現在日時（<span className="font-mono text-amber-300">new Date()</span>）とFIA公式グランプリ日程（targetDateUtc）をリアルタイムに照合し、以下のインテリジェントな自動化を行っています。
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1 text-xs">
            <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
              <div className="font-racing font-bold text-emerald-400 flex items-center gap-1">
                <span>⚡</span>
                <span>1. 次戦自動フォーカス</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                現行シーズン中（3月〜11月）は、未完了の最初のレース（次回開催GP）を自動検出してトップ画面に表示し、秒刻みのカウントダウンを作動させます。
              </p>
            </div>
            <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
              <div className="font-racing font-bold text-amber-400 flex items-center gap-1">
                <span>🏁</span>
                <span>2. シーズン終了＆オフシーズン</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                第24戦アブダビGPが終了すると、自動的に「年間リザルト確定」モードへシフト。冬季オフシーズン中も年間王者や獲得ポイントを明瞭に表示します。
              </p>
            </div>
            <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
              <div className="font-racing font-bold text-sky-400 flex items-center gap-1">
                <span>🔄</span>
                <span>3. 年越し・新シーズン自動移行</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                新年の到来や新シーズン日程の登録に伴い、デフォルト画面が次年度へ自動移行。過去シーズンはワンタップでアーカイブとして常時アクセス可能です。
              </p>
            </div>
          </div>
        </div>
      )}

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
                🏁 {selectedSeason}年 第{selectedRace.round}戦 / 全24戦
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
                {selectedRace.scheduleJst.map((s) => (
                  <div
                    key={s.session}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03] border border-white/5 text-xs"
                  >
                    <span className="text-slate-300 font-medium">{s.session}</span>
                    <span className="font-mono font-bold text-amber-300">{s.dayTime}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Weather & Track Condition Widget */}
            {selectedWeather && (
              <div className="mt-4 pt-3 border-t border-white/10">
                <div className="flex flex-wrap items-center justify-between gap-1 mb-2">
                  <div className="text-[11px] font-racing font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                    <span>🌤️ 気象・路面コンディション予報</span>
                    <span className="text-[10px] text-slate-400 font-mono">({selectedWeather.conditionText})</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">
                    降水確率: <span className={selectedWeather.rainProb > 30 ? 'text-sky-400 font-bold' : 'text-slate-300'}>{selectedWeather.rainProb}%</span>
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div className="bg-white/[0.03] border border-white/5 p-2.5 rounded-xl text-center">
                    <span className="text-[10px] text-slate-400 block font-mono">気温 / 天候</span>
                    <span className="text-sm font-bold text-white font-mono mt-0.5 block">
                      {selectedWeather.weatherIcon} {selectedWeather.airTempC}℃
                    </span>
                  </div>
                  <div className="bg-white/[0.03] border border-white/5 p-2.5 rounded-xl text-center">
                    <span className="text-[10px] text-slate-400 block font-mono">路面温度 (Track)</span>
                    <span className="text-sm font-bold text-amber-400 font-mono mt-0.5 block">
                      🔥 {selectedWeather.trackTempC}℃
                    </span>
                  </div>
                  <div className="bg-white/[0.03] border border-white/5 p-2.5 rounded-xl text-center">
                    <span className="text-[10px] text-slate-400 block font-mono">湿度 / 降水リスク</span>
                    <span className="text-sm font-bold text-sky-300 font-mono mt-0.5 block">
                      💧 {selectedWeather.humidity}% / {selectedWeather.rainProb}%
                    </span>
                  </div>
                  <div className="bg-white/[0.03] border border-white/5 p-2.5 rounded-xl text-center">
                    <span className="text-[10px] text-slate-400 block font-mono">風速・風向き</span>
                    <span className="text-xs font-bold text-emerald-300 font-mono mt-1 block truncate" title={selectedWeather.windDirection}>
                      💨 {selectedWeather.windSpeedKmh}km/h
                    </span>
                  </div>
                </div>
                <div className="mt-2.5 p-2.5 rounded-xl bg-sky-950/40 border border-sky-500/20 text-[11px] text-slate-300 leading-relaxed flex items-start gap-2">
                  <span className="text-sky-400 flex-shrink-0 text-sm">💡</span>
                  <div>
                    <span className="font-bold text-sky-300 mr-1.5 font-racing">工学的戦術サマリー:</span>
                    <span>{selectedWeather.tacticalImpact}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right: Countdown Clock & Quick Actions */}
          <div className="flex flex-col items-center lg:items-end gap-4 min-w-[260px]">
            <div className="w-full bg-black/40 p-4 rounded-2xl border border-white/10 text-center shadow-inner">
              {timeLeft.isPast ? (
                <div className="space-y-2 py-1">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-racing font-bold">
                    <span>🏁</span>
                    <span>レース完走 / リザルト確定</span>
                  </div>
                  <div className="text-xs text-slate-300 font-medium">
                    公式決勝レース終了・アーカイブ保管済み
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    開催日程: {selectedRace.dates}
                  </div>
                </div>
              ) : (
                <>
                  <div className="text-[10px] font-racing font-bold text-slate-400 uppercase tracking-widest mb-1.5 flex items-center justify-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    <span>決勝スタートまで</span>
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
                </>
              )}
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
                  onClick={() => onNavigateToCircuit(selectedCircuitId)}
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
          1.5 DEEP RACE REPORT & PROFILE (FOR SELECTED ROUND)
          ───────────────────────────────────────────────────────────── */}
      {selectedReport && (
        <div className="bg-slate-900/80 rounded-2xl border border-white/10 p-5 md:p-6 space-y-5 shadow-xl animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">🏆</span>
              <div>
                <h3 className="text-base md:text-lg font-racing font-bold text-white tracking-wide">
                  {selectedRace.gpName} : 戦術エンジニアリングプロファイル ＆ コースレコード
                </h3>
                <p className="text-xs text-slate-400">
                  勝敗を分けるピット戦略、公式コースレコード、および今季のタイヤ・セーフティカー戦術指標
                </p>
              </div>
            </div>
            <span className="self-start sm:self-auto px-2.5 py-1 rounded-full bg-red-500/20 text-red-300 border border-red-500/30 text-xs font-mono font-bold">
              ROUND {selectedReport.round} ANALYSIS
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* 1. Track Record Podium Profile */}
            <div className="space-y-3 bg-slate-950/60 p-4 rounded-xl border border-white/5">
              <div className="text-xs font-mono font-bold text-amber-400 flex items-center gap-1.5">
                <span>🥇</span>
                <span>直近表彰台データ &amp; 実績</span>
              </div>
              <div className="space-y-2">
                {selectedReport.result2024.podium.map((p, idx) => (
                  <div
                    key={p.code}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-white/[0.03] border border-white/5"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                        idx === 0 ? 'bg-amber-400 text-slate-950' : idx === 1 ? 'bg-slate-300 text-slate-950' : 'bg-amber-700 text-white'
                      }`}>
                        {idx + 1}
                      </span>
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.teamColor }} />
                      <span className="font-racing font-bold text-white text-xs">{p.code}</span>
                      <span className="text-xs text-slate-300">{p.name}</span>
                    </div>
                    <div className="text-right text-[10px] font-mono text-slate-400">
                      <span>{p.team}</span>
                      <span className="ml-2 text-slate-500">P{p.grid}発 / {p.pitStops}停</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pole & FL */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/5 text-xs font-mono">
                <div className="bg-slate-900/80 p-2 rounded-lg">
                  <div className="text-[10px] text-slate-400">⏱️ ポールポジション</div>
                  <div className="font-bold text-white text-xs mt-0.5">{selectedReport.result2024.polePosition.code}</div>
                  <div className="text-amber-400 text-[11px]">{selectedReport.result2024.polePosition.time}</div>
                </div>
                <div className="bg-slate-900/80 p-2 rounded-lg">
                  <div className="text-[10px] text-slate-400">⚡ 最速ラップ (FL)</div>
                  <div className="font-bold text-white text-xs mt-0.5">{selectedReport.result2024.fastestLap.code} (L{selectedReport.result2024.fastestLap.lap})</div>
                  <div className="text-purple-400 text-[11px]">{selectedReport.result2024.fastestLap.time}</div>
                </div>
              </div>
            </div>

            {/* 2. Decisive Winning Tactics & Drama */}
            <div className="space-y-3 bg-slate-950/60 p-4 rounded-xl border border-white/5 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1.5">
                  <span>🎯</span>
                  <span>勝敗を分けた決定的戦略 &amp; ターニングポイント</span>
                </div>
                <div className="bg-slate-900/80 p-3 rounded-lg border border-emerald-500/20">
                  <div className="text-[10px] font-bold text-emerald-300 mb-1">勝者のピット戦略:</div>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    {selectedReport.result2024.winningStrategy}
                  </p>
                </div>
                <div className="bg-slate-900/80 p-3 rounded-lg border border-red-500/20">
                  <div className="text-[10px] font-bold text-red-300 mb-1">レースの決定的ドラマ:</div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {selectedReport.result2024.strategicTurningPoint}
                  </p>
                </div>
              </div>
              <div className="text-[11px] font-mono text-slate-400 pt-2 border-t border-white/5 flex items-center justify-between">
                <span>🚨 セーフティカー出動実績:</span>
                <span className="text-amber-300 font-bold">{selectedReport.result2024.safetyCarDeployments}</span>
              </div>
            </div>

            {/* 3. Tactical Profile & Track Records */}
            <div className="space-y-3 bg-slate-950/60 p-4 rounded-xl border border-white/5 flex flex-col justify-between">
              <div>
                <div className="text-xs font-mono font-bold text-blue-400 flex items-center gap-1.5 mb-2.5">
                  <span>📊</span>
                  <span>戦術エンジニアリング指標</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-slate-400">タイヤ摩耗度 (Degradation)</span>
                      <span className="font-bold text-amber-400 font-mono">Level {selectedReport.tacticalProfile.tyreDegradationIndex} / 5</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full" style={{ width: `${selectedReport.tacticalProfile.tyreDegradationIndex * 20}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-slate-400">オーバーテイク難易度</span>
                      <span className="font-bold text-sky-400 font-mono">Level {selectedReport.tacticalProfile.overtakeDifficultyIndex} / 5</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-sky-500 rounded-full" style={{ width: `${selectedReport.tacticalProfile.overtakeDifficultyIndex * 20}%` }} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-2 text-[11px] font-mono">
                    <div className="bg-slate-900/60 p-2 rounded border border-white/5">
                      <span className="text-slate-500 block text-[10px]">SC発生確率</span>
                      <span className="font-bold text-amber-300">{selectedReport.tacticalProfile.safetyCarProbabilityPercent}%</span>
                    </div>
                    <div className="bg-slate-900/60 p-2 rounded border border-white/5">
                      <span className="text-slate-500 block text-[10px]">ピットロス</span>
                      <span className="font-bold text-white">{selectedReport.tacticalProfile.pitLossSeconds}秒</span>
                    </div>
                  </div>
                  <div className="bg-slate-900/80 p-2.5 rounded-lg border border-blue-500/20 text-xs text-slate-300 mt-2 leading-relaxed">
                    <span className="font-bold text-blue-300">戦術展望: </span>
                    {selectedReport.tacticalProfile.projectedStrategy}
                  </div>
                </div>
              </div>

              {/* Records footnote */}
              <div className="text-[10px] font-mono text-slate-400 pt-2 border-t border-white/5 flex flex-wrap justify-between gap-1">
                <span>🏆 決勝レコード: {selectedReport.circuitRecords.raceLapRecord.time} ({selectedReport.circuitRecords.raceLapRecord.driver})</span>
                <span className="text-slate-500">最多勝: {selectedReport.circuitRecords.mostWinsDriver}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          2. NAVIGATION TABS (CALENDAR / STANDINGS / GRID)
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
            <span>{selectedSeason}年 カレンダー (全24戦)</span>
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
            <span>{selectedSeason}年 順位表・ランキング</span>
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
            <span>{selectedSeason}年 参戦グリッド・PU体制</span>
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
              <span>因縁・ドラマ録</span>
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
              const gpWeather = getWeatherByRound(gp.round);
              const isGpPast = new Date(gp.targetDateUtc).getTime() <= new Date().getTime();

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
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] font-racing font-bold text-slate-400 uppercase">
                          Round {gp.round}
                        </span>
                        {isGpPast ? (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-slate-800 text-slate-400 border border-white/10">
                            終了
                          </span>
                        ) : (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            予定
                          </span>
                        )}
                      </div>
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

                    {/* Weather Pill */}
                    {gpWeather && (
                      <div className="flex items-center justify-between text-[10px] font-mono text-slate-300 bg-white/[0.03] px-2 py-1 rounded-md border border-white/5">
                        <span className="flex items-center gap-1">
                          <span>{gpWeather.weatherIcon}</span>
                          <span>{gpWeather.airTempC}℃</span>
                          <span className="text-amber-400">/ 路面{gpWeather.trackTempC}℃</span>
                        </span>
                        <span className={gpWeather.rainProb > 30 ? 'text-sky-400 font-bold' : 'text-slate-400'}>
                          ☔ {gpWeather.rainProb}%
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-[11px]">
                    <span className="font-mono text-slate-300">{gp.dates.replace(/^202[0-9]年\s*/, '')}</span>
                    {onNavigateToCircuit ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onNavigateToCircuit(getCircuitIdForRace(gp));
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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-2">
                <span>🏆</span>
                <span>
                  {selectedSeason === '2026'
                    ? '2026シーズン 暫定選手権ランキング (第15戦 モンツァ終了時点)'
                    : '2025シーズン 年間確定選手権ランキング (全24戦終了 / マクラーレンWCC)'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {selectedSeason === '2026'
                  ? '新PU規定元年。メルセデスの超新星アントネッリが首位を快走、第11チーム・キャデラック参戦で白熱する22台の選手権'
                  : 'ノリスが悲願の初戴冠、マクラーレンが1998年以来となるコンストラクターズタイトルを奪還'}
              </p>
            </div>
            <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-lg border border-white/10 text-xs self-start sm:self-auto">
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
                    {activeDriverStandings.map((d) => {
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
                    {activeConstructorStandings.map((team) => {
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
          TAB CONTENT: 3. GRID SHOWCASE
          ───────────────────────────────────────────────────────────── */}
      {activeTab === 'grid' && (
        <div className="space-y-4">
          <div className="text-xs text-slate-400 leading-relaxed">
            {selectedSeason === '2026' ? (
              <span>
                <strong className="text-white">2026年 新レギュレーション参戦布陣:</strong> ドイツの名門<strong className="text-red-400">アウディ</strong>とアメリカの巨頭<strong className="text-amber-400">キャデラック（第11チーム）</strong>のF1正式参戦、<strong className="text-emerald-400">アストンマーティン×ホンダ完全ワークス</strong>体制始動、そして<strong className="text-blue-400">レッドブル×フォード新PU</strong>の夜明け！全11チーム・22台が織りなす新時代。
              </span>
            ) : (
              <span>
                <strong className="text-white">2025年 参戦体制アーカイブ:</strong> ルイス・ハミルトンの跳ね馬電撃移籍、カルロス・サインツのウィリアムズ加入、そしてアントネッリやベアマンら大型ルーキーの鮮烈な挑戦。
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeGrid.map((team) => (
              <div
                key={team.teamName}
                className="p-4 rounded-xl border border-white/10 bg-slate-900/60 hover:border-white/20 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2 border-b border-white/10 pb-2">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3.5 h-3.5 rounded-full shadow-sm"
                        style={{ backgroundColor: team.teamColor }}
                      />
                      <h3 className="font-racing font-bold text-base text-white">{team.teamName}</h3>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 px-2 py-0.5 rounded bg-white/5 border border-white/5 truncate max-w-[140px]">
                      {team.fullName}
                    </span>
                  </div>

                  {/* Team Principal & PU specs pill */}
                  <div className="flex flex-wrap items-center gap-1.5 mb-3 text-[10px] font-mono">
                    <span className="bg-slate-950/80 border border-white/10 px-2 py-0.5 rounded text-slate-300">
                      👔 代表: <strong className="text-slate-100">{team.teamPrincipal}</strong>
                    </span>
                    <span className="bg-slate-950/80 border border-white/10 px-2 py-0.5 rounded text-slate-300">
                      ⚡ PU: <strong className="text-sky-300">{team.powerUnit}</strong>
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
