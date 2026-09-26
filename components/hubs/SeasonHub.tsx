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
} from '@/data/f1SeasonData';
import { getWeatherByRound, getCircuitWeather } from '@/data/f1WeatherData';
import { getGrandPrixReportByRound, getGrandPrixReportByCircuitId } from '@/data/f1GrandPrixReportsData';
import F1BroadcastTrackGuide from '@/components/circuits/F1BroadcastTrackGuide';
import { useCountdown } from '@/lib/useCountdown';
import { getCircuitTimezoneInfo, formatDualSessionTime } from '@/lib/circuitTimezones';

interface SeasonHubProps {
  onNavigateToTelemetry?: (gpName?: string) => void;
  onNavigateToTyres?: () => void;
  onNavigateToDrama?: () => void;
  onNavigateToGlossary?: () => void;
  onNavigateToCircuit?: (circuitId: string) => void;
  onNavigateToDriver?: (driverCode: string) => void;
  onNavigateToTeam?: (teamId: string) => void;
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
  if (name.includes('セパン') || name.includes('sepang') || name.includes('マレーシア')) return 'sepang';
  return 'suzuka';
}

export function getTeamIdFromName(name: string): string {
  const n = name.toLowerCase();
  if (n.includes('red bull') || n.includes('レッドブル')) return 'redbull';
  if (n.includes('ferrari') || n.includes('フェラーリ')) return 'ferrari';
  if (n.includes('mclaren') || n.includes('マクラーレン')) return 'mclaren';
  if (n.includes('mercedes') || n.includes('メルセデス')) return 'mercedes';
  if (n.includes('aston') || n.includes('アストン')) return 'aston-martin';
  if (n.includes('alpine') || n.includes('アルピーヌ')) return 'alpine';
  if (n.includes('williams') || n.includes('ウィリアムズ')) return 'williams';
  if (n.includes('rb') || n.includes('レーシングブルズ') || n.includes('cash app') || n.includes('レーシング・ブルズ')) return 'rb';
  if (n.includes('audi') || n.includes('アウディ') || n.includes('sauber') || n.includes('ザウバー')) return 'audi';
  if (n.includes('haas') || n.includes('ハース')) return 'haas';
  if (n.includes('cadillac') || n.includes('キャデラック')) return 'cadillac';
  return 'ferrari';
}


interface RaceCountdownCardProps {
  targetDateUtc: string;
  dates: string;
  circuitId?: string;
  country?: string;
  city?: string;
  gpName?: string;
}

const RaceCountdownCard = React.memo(function RaceCountdownCard({
  targetDateUtc,
  dates,
  circuitId,
  country,
  city,
  gpName,
}: RaceCountdownCardProps) {
  const timeLeft = useCountdown(targetDateUtc);

  // Compute accurate dual-time race start string
  const targetFormatted = useMemo(() => {
    if (!targetDateUtc) return dates;
    try {
      const d = new Date(targetDateUtc);
      const tz = getCircuitTimezoneInfo(circuitId, country, city);
      const m = d.getMonth() + 1;
      const day = d.getDate();
      const days = ['日', '月', '火', '水', '木', '金', '土'];
      const dow = days[d.getDay()];
      const hh = String(d.getHours()).padStart(2, '0');
      const mm = String(d.getMinutes()).padStart(2, '0');

      let localH = d.getHours() + tz.diffFromJstHours;
      if (localH < 0) localH += 24;
      else if (localH >= 24) localH -= 24;
      const localHStr = String(localH).padStart(2, '0');

      if (tz.utcOffset === 9) {
        return `${m}/${day} (${dow}) ${hh}:${mm} JST`;
      }
      return `${m}/${day} (${dow}) ${hh}:${mm} JST / 現地 ${localHStr}:${mm} ${tz.tzAbbr}`;
    } catch {
      return dates;
    }
  }, [targetDateUtc, circuitId, country, city, dates]);

  if (!timeLeft.mounted) {
    return (
      <div className="w-full bg-slate-950/90 p-3 sm:p-3.5 rounded-2xl border border-white/10 text-center shadow-lg relative overflow-hidden backdrop-blur-md">
        <div className="text-[10px] font-mono font-bold text-slate-400 mb-2 flex items-center justify-center gap-1.5 uppercase tracking-wider">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          <span>決勝スタートまで (Race Countdown)</span>
        </div>
        <div className="grid grid-cols-4 gap-1.5 font-mono text-center">
          <div className="p-2 rounded-xl bg-slate-900/90 border border-white/[0.08] shadow-inner">
            <div className="font-mono font-black text-xl sm:text-2xl text-white/30">--</div>
            <div className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest mt-0.5">DAYS</div>
          </div>
          <div className="p-2 rounded-xl bg-slate-900/90 border border-white/[0.08] shadow-inner">
            <div className="font-mono font-black text-xl sm:text-2xl text-white/30">--</div>
            <div className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest mt-0.5">HOURS</div>
          </div>
          <div className="p-2 rounded-xl bg-slate-900/90 border border-white/[0.08] shadow-inner">
            <div className="font-mono font-black text-xl sm:text-2xl text-white/30">--</div>
            <div className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest mt-0.5">MIN</div>
          </div>
          <div className="p-2 rounded-xl bg-slate-900/90 border border-white/[0.08] shadow-inner">
            <div className="font-mono font-black text-xl sm:text-2xl text-red-500/30">--</div>
            <div className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest mt-0.5">SEC</div>
          </div>
        </div>
        <div className="mt-2.5 pt-2 border-t border-white/[0.06] text-[11px] text-slate-400 font-mono flex items-center justify-center gap-1 truncate">
          <span className="text-red-400">🎯</span>
          <span className="truncate">決勝: {targetFormatted}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-slate-950/90 p-3 sm:p-3.5 rounded-2xl border border-white/10 text-center shadow-lg relative overflow-hidden backdrop-blur-md">
      {timeLeft.isPast ? (
        <div className="space-y-2 py-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-xs font-racing font-bold">
            <span>🏁</span>
            <span>レース完走 / リザルト確定</span>
          </div>
          <div className="text-xs text-slate-300 font-medium">
            公式決勝レース終了・アーカイブ保管済み
          </div>
          <div className="text-[11px] text-slate-400 font-mono">
            開催日程: {dates}
          </div>
        </div>
      ) : (
        <>
          <div className="text-[10px] font-mono font-bold text-slate-400 mb-2 flex items-center justify-center gap-1.5 uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            <span>決勝スタートまで (Race Countdown)</span>
          </div>
          <div className="grid grid-cols-4 gap-1.5 font-mono text-center">
            <div className="p-2 rounded-xl bg-slate-900/90 border border-white/[0.08] shadow-inner">
              <div className="font-mono font-black text-xl sm:text-2xl text-white" suppressHydrationWarning>{timeLeft.days}</div>
              <div className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest mt-0.5">DAYS</div>
            </div>
            <div className="p-2 rounded-xl bg-slate-900/90 border border-white/[0.08] shadow-inner">
              <div className="font-mono font-black text-xl sm:text-2xl text-white" suppressHydrationWarning>{timeLeft.hours}</div>
              <div className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest mt-0.5">HOURS</div>
            </div>
            <div className="p-2 rounded-xl bg-slate-900/90 border border-white/[0.08] shadow-inner">
              <div className="font-mono font-black text-xl sm:text-2xl text-white" suppressHydrationWarning>{timeLeft.minutes}</div>
              <div className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest mt-0.5">MIN</div>
            </div>
            <div className="p-2 rounded-xl bg-slate-900/90 border border-white/[0.08] shadow-inner">
              <div className="font-mono font-black text-xl sm:text-2xl text-red-500 animate-pulse" suppressHydrationWarning>{timeLeft.seconds}</div>
              <div className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest mt-0.5">SEC</div>
            </div>
          </div>
          <div className="mt-2.5 pt-2 border-t border-white/[0.06] text-[11px] text-slate-300 font-mono flex items-center justify-center gap-1.5 truncate">
            <span className="text-red-400">🎯</span>
            <span className="text-slate-400 font-sans">決勝:</span>
            <span className="text-white font-bold truncate">{targetFormatted}</span>
          </div>
        </>
      )}
    </div>
  );
});

type MainTab = 'calendar' | 'track_analysis' | 'standings' | 'grid';

export default function SeasonHub({
  onNavigateToTelemetry,
  onNavigateToTyres,
  onNavigateToDrama,
  onNavigateToGlossary,
  onNavigateToCircuit,
  onNavigateToDriver,
  onNavigateToTeam,
}: SeasonHubProps) {
  // Season State: Defaults to current active season (2026)
  const [selectedSeason, setSelectedSeason] = useState<SeasonYear>(() => getActiveSeasonYear());
  const [activeTab, setActiveTab] = useState<MainTab>('calendar');
  const [calendarFilter, setCalendarFilter] = useState<'all' | 'sprint'>('all');
  const [showSeasonInfo, setShowSeasonInfo] = useState<boolean>(false);
  const [heroSubView, setHeroSubView] = useState<'schedule' | 'weather'>('schedule');

  // Active season calendar & grid — starts with local data, upgradeable via API
  const localCalendar = useMemo(() => getSeasonCalendar(selectedSeason), [selectedSeason]);
  const [liveCalendar, setLiveCalendar] = useState<RaceWeekendSchedule[] | null>(null);
  const [calendarSource, setCalendarSource] = useState<'local' | 'api'>('local');

  // Fetch official calendar from API
  useEffect(() => {
    if (selectedSeason !== '2026') {
      setLiveCalendar(null);
      setCalendarSource('local');
      return;
    }

    let cancelled = false;

    async function fetchCalendar() {
      try {
        const res = await fetch(`/api/f1-calendar?year=2026`, {
          signal: AbortSignal.timeout(12000),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (cancelled) return;

        const apiRaces: RaceWeekendSchedule[] = data.races;

        // Ground truth: localCalendar has verified Sunday race dates, local schedules & circuits.
        // Supplement with API dynamic data (e.g. isCancelled status from OpenF1)
        const merged = localCalendar.map((localRace) => {
          const apiMatch = apiRaces.find((l) => l.round === localRace.round);
          return {
            ...localRace,
            isCancelled: apiMatch?.isCancelled ?? localRace.isCancelled ?? false,
          };
        });

        setLiveCalendar(merged);
        setCalendarSource('api');
        if (!userHasSelectedRoundRef.current) {
          setSelectedRound(getNextUpcomingRound(merged));
        }
      } catch (err) {
        console.warn('[SeasonHub] API calendar fetch failed, using local data:', err);
        setLiveCalendar(null);
        setCalendarSource('local');
      }
    }

    fetchCalendar();
    return () => { cancelled = true; };
  }, [selectedSeason, localCalendar]);

  const activeCalendar = liveCalendar || localCalendar;
  const activeGrid = useMemo(() => getSeasonGrid(selectedSeason), [selectedSeason]);
  const activeDriverStandings = useMemo(() => getDriverStandings(selectedSeason), [selectedSeason]);
  const activeConstructorStandings = useMemo(() => getConstructorStandings(selectedSeason), [selectedSeason]);
  const seasonEnded = useMemo(() => isSeasonConcluded(activeCalendar), [activeCalendar]);

  const userHasSelectedRoundRef = React.useRef(false);

  // Selected Round: Auto-defaults to the next upcoming race of that season
  const [selectedRound, setSelectedRound] = useState<number>(() => {
    const defaultYear = getActiveSeasonYear();
    const cal = getSeasonCalendar(defaultYear);
    return getNextUpcomingRound(cal);
  });

  // Handle Season Switching
  const handleSeasonChange = (year: SeasonYear) => {
    setSelectedSeason(year);
    userHasSelectedRoundRef.current = false;
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

  const currentTzInfo = useMemo(() => {
    return getCircuitTimezoneInfo(selectedCircuitId, selectedRace?.country, selectedRace?.city);
  }, [selectedCircuitId, selectedRace]);

  const selectedWeather = useMemo(() => {
    return getCircuitWeather(selectedCircuitId) || getWeatherByRound(selectedRound);
  }, [selectedCircuitId, selectedRound]);

  const selectedReport = useMemo(() => {
    return getGrandPrixReportByCircuitId(selectedCircuitId) || getGrandPrixReportByRound(selectedRound);
  }, [selectedCircuitId, selectedRound]);

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
    <div className="space-y-3 sm:space-y-4 pb-8 animate-fade-in max-w-7xl mx-auto">
      {/* ─────────────────────────────────────────────────────────────
          0. SEASON SWITCHER & SMART ROLLOVER STATUS BAR
          ───────────────────────────────────────────────────────────── */}
      <div className="p-2.5 sm:p-3 rounded-2xl bg-gradient-to-r from-slate-900/95 via-slate-950/90 to-slate-900/95 border border-white/10 shadow-lg backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-2.5">
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
          1. NEXT RACE HERO & DUAL-TIME SCHEDULE BANNER (Professional Cockpit Edition)
          ───────────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/95 via-slate-950 to-neutral-950 p-4 sm:p-5 shadow-2xl">
        {/* Background subtle atmospheric red glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        <div className="relative z-10 flex flex-col lg:flex-row gap-5 items-stretch justify-between">
          {/* Left Column: Race Header, Circuit Metadata, Dual-Time Schedule */}
          <div className="space-y-3.5 flex-1 min-w-0">
            {/* Top row: Status Badges Strip */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold tracking-wider uppercase bg-red-500/15 text-red-400 border border-red-500/30 shadow-sm flex items-center gap-1.5">
                <span>🏁</span>
                <span>{selectedSeason}年 第{selectedRace.round}戦 / 全{activeCalendar.length}戦</span>
              </span>
              {selectedRace.isSprint && (
                <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                  <span>⚡</span>
                  <span>SPRINT WEEKEND</span>
                </span>
              )}
              <span className="px-2.5 py-1 rounded-full text-xs font-mono text-slate-300 bg-white/5 border border-white/10 flex items-center gap-1.5">
                <span>📅</span>
                <span>{selectedRace.dates}</span>
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-mono text-sky-300 bg-sky-500/10 border border-sky-500/25 flex items-center gap-1.5">
                <span>🌐</span>
                <span>{currentTzInfo.tzAbbr} ({currentTzInfo.diffLabel})</span>
              </span>
            </div>

            {/* Main Title Row: Clean Flag + Authoritative Typography */}
            <div className="flex items-center gap-3.5">
              <span className="text-3xl sm:text-4xl shrink-0 drop-shadow-md">{selectedRace.flag}</span>
              <div className="min-w-0">
                <div className="flex items-baseline gap-2.5 flex-wrap">
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight leading-tight">
                    {selectedRace.gpName}
                  </h1>
                  <span className="font-mono text-xs font-semibold text-slate-400 tracking-wider uppercase">
                    {selectedRace.circuitName}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Specs Ribbon: Clean Structured Pills */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300 font-mono">
              <span className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08] text-slate-200 font-medium flex items-center gap-1.5 shadow-sm">
                <span>📍</span>
                <span>{selectedRace.city}、{selectedRace.country}</span>
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08] text-slate-300 flex items-center gap-1.5 shadow-sm">
                <span>🛣️</span>
                <span>コース全長: <strong className="text-white font-bold">{selectedRace.lengthKm.toFixed(3)} km</strong></span>
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08] text-slate-300 flex items-center gap-1.5 shadow-sm">
                <span>🔄</span>
                <span>決勝ラップ数: <strong className="text-white font-bold">{selectedRace.laps} 周</strong></span>
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08] text-slate-300 flex items-center gap-1.5 shadow-sm">
                <span>🛞</span>
                <span>タイヤ割当: <strong className="text-slate-100 font-sans font-semibold">{selectedRace.pirelliCompounds}</strong></span>
              </span>
            </div>

            {/* Sub-view switcher: Dual Timetable vs Weather */}
            <div className="pt-2.5 border-t border-white/10 space-y-2.5">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-1 bg-slate-950/90 p-1 rounded-xl border border-white/10 shadow-inner">
                  <button
                    type="button"
                    onClick={() => setHeroSubView('schedule')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-racing font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      heroSubView === 'schedule'
                        ? 'bg-red-600 text-white shadow-md shadow-red-950/50'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span>⏱️</span>
                    <span>公式タイムテーブル ({selectedRace.scheduleJst.length}セッション)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setHeroSubView('weather')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-racing font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      heroSubView === 'weather'
                        ? 'bg-sky-600 text-white shadow-md shadow-sky-950/50'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span>🌤️</span>
                    <span>気象・路面予測 {selectedWeather ? `(${selectedWeather.airTempC}℃)` : ''}</span>
                  </button>
                </div>

                {heroSubView === 'schedule' ? (
                  <div className="flex items-center gap-2 text-[11px] font-mono">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-slate-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                      <span>JST (日本時間: 生中継観戦用)</span>
                    </span>
                    <span className="text-slate-500">/</span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-sky-500/10 border border-sky-500/20 text-sky-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                      <span>現地時間 ({currentTzInfo.tzAbbr})</span>
                    </span>
                  </div>
                ) : selectedWeather ? (
                  <span className="text-[11px] text-slate-400 font-mono">
                    降水確率: <strong className={selectedWeather.rainProb > 30 ? 'text-sky-400' : 'text-slate-300'}>{selectedWeather.rainProb}%</strong>
                  </span>
                ) : null}
              </div>

              {/* View 1: Professional Dual-Time Session Timetable Cards */}
              {heroSubView === 'schedule' && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 animate-fadeIn">
                  {selectedRace.scheduleJst.map((s) => {
                    const dual = formatDualSessionTime(s.session, s.dayTime, currentTzInfo);
                    return (
                      <div
                        key={s.session}
                        className={`flex flex-col justify-between p-2.5 sm:p-3 rounded-xl border transition-all ${
                          dual.isFinalRace
                            ? 'bg-gradient-to-b from-red-950/35 via-slate-900/90 to-slate-950 border-red-500/40 shadow-md shadow-red-950/20 ring-1 ring-red-500/20'
                            : 'bg-slate-900/80 hover:bg-slate-850 border-white/[0.08] hover:border-white/20'
                        }`}
                      >
                        {/* Session Card Header */}
                        <div className="flex items-center justify-between gap-1 pb-1.5 border-b border-white/[0.06]">
                          <span
                            className={`text-xs font-mono font-bold tracking-wider uppercase truncate ${
                              dual.isFinalRace ? 'text-red-400' : 'text-slate-300'
                            }`}
                          >
                            {dual.isFinalRace ? '🏁 決勝' : s.session}
                          </span>
                          {dual.isFinalRace ? (
                            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-red-600 text-white font-bold tracking-wider shrink-0">
                              FINAL
                            </span>
                          ) : s.session.includes('予選') ? (
                            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-white/10 text-slate-300 font-medium shrink-0">
                              QUALI
                            </span>
                          ) : null}
                        </div>

                        {/* JST (日本時間 - Primary) */}
                        <div className="py-2">
                          <div className="flex items-center gap-1 text-[10px] font-mono text-slate-400 mb-0.5">
                            <span className="px-1 py-0.2 rounded bg-red-500/20 text-red-300 font-bold text-[9px]">JST</span>
                            <span>日本時間</span>
                          </div>
                          <div className="text-white font-mono font-bold text-sm sm:text-base tracking-tight leading-tight">
                            <span className="text-slate-300 mr-1 text-xs font-normal">{dual.jstDay}</span>
                            <span className="text-white font-black">{dual.jstTime}</span>
                          </div>
                        </div>

                        {/* Local Track Time (現地時間 - Secondary) */}
                        <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono">
                          <div className="flex items-center gap-1 text-slate-400 truncate">
                            <span className="text-[9px] px-1 py-0.2 rounded bg-sky-950/60 text-sky-400 border border-sky-500/20 shrink-0">
                              現地
                            </span>
                            <span className="truncate">{dual.localDay} {dual.localTime}</span>
                          </div>
                          <span className="text-[10px] text-sky-400 font-semibold shrink-0 ml-1">
                            {dual.tzAbbr}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* View 2: Weather & Track Condition */}
              {heroSubView === 'weather' && selectedWeather && (
                <div className="space-y-2.5 animate-fadeIn">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <div className="bg-slate-900/80 border border-white/[0.08] p-2.5 rounded-xl text-center shadow-sm">
                      <span className="text-[10px] text-slate-400 block font-mono">気温 / 天候</span>
                      <span className="text-sm sm:text-base font-bold text-white font-mono mt-0.5 block">
                        {selectedWeather.weatherIcon} {selectedWeather.airTempC}℃
                      </span>
                    </div>
                    <div className="bg-slate-900/80 border border-white/[0.08] p-2.5 rounded-xl text-center shadow-sm">
                      <span className="text-[10px] text-slate-400 block font-mono">路面温度 (Track)</span>
                      <span className="text-sm sm:text-base font-bold text-amber-400 font-mono mt-0.5 block">
                        🔥 {selectedWeather.trackTempC}℃
                      </span>
                    </div>
                    <div className="bg-slate-900/80 border border-white/[0.08] p-2.5 rounded-xl text-center shadow-sm">
                      <span className="text-[10px] text-slate-400 block font-mono">湿度 / 降水リスク</span>
                      <span className="text-sm sm:text-base font-bold text-sky-300 font-mono mt-0.5 block">
                        💧 {selectedWeather.humidity}% / {selectedWeather.rainProb}%
                      </span>
                    </div>
                    <div className="bg-slate-900/80 border border-white/[0.08] p-2.5 rounded-xl text-center shadow-sm">
                      <span className="text-[10px] text-slate-400 block font-mono">風速・風向き</span>
                      <span className="text-xs sm:text-sm font-bold text-emerald-300 font-mono mt-0.5 block truncate" title={selectedWeather.windDirection}>
                        💨 {selectedWeather.windSpeedKmh}km/h
                      </span>
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-sky-950/40 border border-sky-500/20 text-xs text-slate-300 leading-snug flex items-center gap-2 shadow-sm">
                    <span className="text-sky-400 text-sm flex-shrink-0">💡</span>
                    <span className="font-bold text-sky-300 font-racing">戦術影響:</span>
                    <span className="truncate">{selectedWeather.tacticalImpact}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Countdown Cockpit & Action Suite */}
          <div className="flex flex-col justify-between gap-3 w-full lg:w-[320px] shrink-0">
            <RaceCountdownCard
              targetDateUtc={selectedRace.targetDateUtc}
              dates={selectedRace.dates}
              circuitId={selectedCircuitId}
              country={selectedRace.country}
              city={selectedRace.city}
              gpName={selectedRace.gpName}
            />

            {/* Quick Actions Grid (2x2 Balanced Suite) */}
            <div className="grid grid-cols-2 gap-2 w-full">
              {onNavigateToTelemetry && (
                <button
                  type="button"
                  onClick={() => onNavigateToTelemetry(selectedRace.gpName)}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-racing font-bold text-xs shadow-md shadow-red-950/40 transition-all cursor-pointer group"
                  title="テレメトリー分析を開く"
                >
                  <span className="group-hover:scale-110 transition-transform">🏎️</span>
                  <span>テレメトリー</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => setActiveTab('track_analysis')}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white border border-white/10 hover:border-sky-500/40 font-racing font-bold text-xs transition-all cursor-pointer group shadow-sm"
                title="3Dコース標高図・戦術プロファイルを見る"
              >
                <span className="group-hover:scale-110 transition-transform">🏁</span>
                <span>コース詳細</span>
              </button>
              {onNavigateToCircuit && (
                <button
                  type="button"
                  onClick={() => onNavigateToCircuit(selectedCircuitId)}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white border border-white/10 hover:border-amber-500/40 font-racing font-bold text-xs transition-all cursor-pointer group shadow-sm"
                  title="大百科のサーキット完全解剖・名鑑を開く"
                >
                  <span className="group-hover:scale-110 transition-transform">📚</span>
                  <span>大百科解剖</span>
                </button>
              )}
              {onNavigateToTyres && (
                <button
                  type="button"
                  onClick={onNavigateToTyres}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white border border-white/10 hover:border-white/20 font-racing font-bold text-xs transition-all cursor-pointer group shadow-sm"
                  title="タイヤ戦略・コンパウンド解説を見る"
                >
                  <span className="group-hover:scale-110 transition-transform">🛞</span>
                  <span>タイヤ戦略</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. NAVIGATION TABS (CALENDAR / TRACK / STANDINGS / GRID)
          ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900/80 border border-white/10 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveTab('calendar')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-racing font-bold transition-all flex items-center gap-1.5 shrink-0 whitespace-nowrap cursor-pointer ${
              activeTab === 'calendar'
                ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md shadow-red-950/40 border border-red-500/40'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <span>📅</span>
            <span>カレンダー (全{activeCalendar.length}戦)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('track_analysis')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-racing font-bold transition-all flex items-center gap-1.5 shrink-0 whitespace-nowrap cursor-pointer ${
              activeTab === 'track_analysis'
                ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md shadow-red-950/40 border border-red-500/40'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <span>🏁</span>
            <span>コース・戦術解析</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('standings')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-racing font-bold transition-all flex items-center gap-1.5 shrink-0 whitespace-nowrap cursor-pointer ${
              activeTab === 'standings'
                ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md shadow-red-950/40 border border-red-500/40'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <span>🏆</span>
            <span>選手権ランキング</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('grid')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-racing font-bold transition-all flex items-center gap-1.5 shrink-0 whitespace-nowrap cursor-pointer ${
              activeTab === 'grid'
                ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md shadow-red-950/40 border border-red-500/40'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <span>👥</span>
            <span>参戦体制・グリッド</span>
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
          <div className="flex items-center justify-between text-xs flex-wrap gap-2">
            <div className="flex items-center gap-2 text-slate-400">
              <span>各グランプリをクリックすると、上部のカウントダウン＆日本時間予定表が切り替わります。</span>
              {calendarSource === 'api' && (
                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  📡 LIVE DATA
                </span>
              )}
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
                全{activeCalendar.length}戦
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
                <span>スプリント戦のみ ({activeCalendar.filter(r => r.isSprint).length})</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5">
            {filteredCalendar.map((gp) => {
              const isSelected = gp.round === selectedRound;
              const isGpPast = new Date(gp.targetDateUtc).getTime() <= new Date().getTime();

              return (
                <div
                  key={gp.round}
                  onClick={() => {
                    userHasSelectedRoundRef.current = true;
                    setSelectedRound(gp.round);
                  }}
                  className={`cursor-pointer p-2.5 sm:p-3 rounded-xl border transition-all text-left flex flex-col justify-between group ${
                    isSelected
                      ? 'bg-red-950/40 border-red-500/70 ring-1 ring-red-500/50 shadow-md shadow-red-950/60 scale-[1.01]'
                      : 'bg-slate-900/60 hover:bg-slate-800/80 border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className={`space-y-1 ${gp.isCancelled ? 'opacity-50' : ''}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                          ROUND {gp.round}
                        </span>
                        {gp.isCancelled ? (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-red-500/20 text-red-300 border border-red-500/30">
                            中止
                          </span>
                        ) : isGpPast ? (
                          <span suppressHydrationWarning className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-slate-800 text-slate-400 border border-white/10">
                            終了
                          </span>
                        ) : (
                          <span suppressHydrationWarning className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            予定
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        {gp.isSprint && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 font-racing">
                            ⚡ SPRINT
                          </span>
                        )}
                        <span className="text-sm sm:text-base">{gp.flag}</span>
                      </div>
                    </div>

                    <div>
                      <h3
                        className={`font-racing font-bold text-xs sm:text-sm leading-tight transition-colors truncate ${
                          gp.isCancelled ? 'line-through text-slate-500' :
                          isSelected ? 'text-red-300' : 'text-white group-hover:text-red-300'
                        }`}
                      >
                        {gp.gpName}
                      </h3>
                      <p className="text-[10px] sm:text-[11px] text-slate-400 truncate mt-0.5">{gp.circuitName}</p>
                      {gp.replacementNote && (
                        <p className="text-[9px] text-amber-400 mt-0.5 truncate">{gp.replacementNote}</p>
                      )}
                    </div>
                  </div>

                  <div className="mt-2 pt-1.5 border-t border-white/5 flex items-center justify-between text-[11px] font-mono">
                    <span className="text-slate-400">{gp.dates.replace(/^202[0-9]年\s*/, '')}</span>
                    <div className="flex items-center gap-1.5">
                      {gp.pirelliCompounds && (
                        <span className="text-[10px] text-amber-400/90 font-semibold">{gp.pirelliCompounds}</span>
                      )}
                      {onNavigateToCircuit && !gp.isCancelled && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onNavigateToCircuit(getCircuitIdForRace(gp));
                          }}
                          className="px-1.5 py-0.5 rounded bg-sky-950/60 hover:bg-sky-900 border border-sky-500/30 text-sky-300 hover:text-white text-[10px] font-racing transition-colors cursor-pointer"
                          title={`${gp.circuitName} の大百科コース解剖を開く`}
                        >
                          🏁 解剖
                        </button>
                      )}
                      <span className={`text-[10px] font-racing ${isSelected ? 'text-red-400 font-bold' : 'text-slate-600 group-hover:text-slate-400'}`}>
                        {isSelected ? '● 選択中' : '選択 ➔'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          TAB CONTENT: 1.5 TRACK & TACTICAL ANALYSIS
          ───────────────────────────────────────────────────────────── */}
      {activeTab === 'track_analysis' && (
        <div className="space-y-6 animate-fade-in">
          {/* Header Bar for selected round */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-gradient-to-r from-slate-900/90 to-slate-950/90 border border-white/10 shadow-lg">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">{selectedRace.flag}</span>
              <div>
                <h3 className="font-racing font-bold text-sm sm:text-base text-white flex items-center gap-2">
                  <span>第{selectedRace.round}戦 {selectedRace.gpName}</span>
                  <span className="text-xs font-mono text-slate-400 font-normal">({selectedRace.circuitName})</span>
                </h3>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  公式コース諸元・3D標高プロファイル ＆ 戦術エンジニアリング詳細データ
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('calendar')}
              className="btn-console text-xs"
            >
              <span>📅 カレンダーから他のレースを選ぶ</span>
            </button>
          </div>

          {/* 3D Elevation & Broadcast Track Guide */}
          <F1BroadcastTrackGuide
            circuitId={selectedCircuitId}
            gpName={selectedRace.gpName}
            round={selectedRace.round}
          />

          {/* Deep Race Report & Profile (For Selected Round) */}
          {selectedReport && (
            <div className="bg-slate-900/80 rounded-2xl border border-white/10 p-5 md:p-6 space-y-5 shadow-xl">
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
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          TAB CONTENT: 2. STANDINGS
          ───────────────────────────────────────────────────────────── */}
      {activeTab === 'standings' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-2.5">
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-2">
                <span>🏆</span>
                <span>
                  {selectedSeason === '2026'
                    ? '2026シーズン 想定シミュレーション・暫定選手権 (※シーズン未終了・タイトル未確定)'
                    : '2025シーズン 年間確定選手権ランキング (全24戦終了 / マクラーレンWCC)'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {selectedSeason === '2026'
                  ? '新PU規定元年。2026年シーズンは未終了のため本ランキングはシミュレーション想定値です（全11チーム・22名体制）。世界王者は未確定です。'
                  : 'ノリスが悲願の初戴冠、マクラーレンが1998年以来となるコンストラクターズタイトルを奪還'}
              </p>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-950/40 border border-red-500/30 text-red-300 font-mono text-[11px] self-start sm:self-auto shadow-sm">
              <span>{selectedSeason === '2026' ? '🏁 2026シミュレーション (タイトル未確定)' : '🏁 2025確定 WDC ＆ WCC ダッシュボード'}</span>
            </div>
          </div>

          {/* ── DUAL PARALLEL DASHBOARD (WDC 7 cols + WCC 5 cols) ── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-start animate-fade-in">
              {/* Left Column (7 cols): Drivers' Championship Table */}
              <div className="lg:col-span-7 space-y-2">
                <div className="flex items-center justify-between px-1">
                  <span className="font-racing font-bold text-xs text-white uppercase tracking-wider flex items-center gap-1.5">
                    <span>🏎️</span>
                    <span>ドライバーズ選手権 (全{activeDriverStandings.length}名)</span>
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">P1-P10 入賞圏</span>
                </div>
                <div className="rounded-xl border border-white/10 overflow-hidden bg-slate-900/70 shadow-md">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs table-auto">
                      <thead className="bg-slate-950/90 text-slate-400 font-racing uppercase text-[10px] border-b border-white/10">
                        <tr>
                          <th className="py-2 px-2 text-center w-10">順位</th>
                          <th className="py-2 px-2">選手名</th>
                          <th className="py-2 px-2">所属チーム</th>
                          <th className="py-2 px-1.5 text-center w-10">勝</th>
                          <th className="py-2 px-1.5 text-center w-10">登壇</th>
                          <th className="py-2 px-2.5 text-right w-24">ポイント</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {activeDriverStandings.map((d) => {
                          const percentage = (d.points / maxDriverPoints) * 100;
                          return (
                            <tr
                              key={d.position}
                              className={`hover:bg-white/[0.04] transition-colors group ${
                                d.position === 10 ? 'border-b-2 border-b-sky-500/30' : ''
                              }`}
                            >
                              <td className="py-1.5 px-2 text-center font-mono font-bold text-slate-300">
                                {d.position === 1 ? (
                                  <span className="text-amber-400 text-xs font-black">👑 1</span>
                                ) : d.position <= 3 ? (
                                  <span className="text-white font-bold">{d.position}</span>
                                ) : (
                                  <span className="text-slate-400">{d.position}</span>
                                )}
                              </td>
                              <td className="py-1.5 px-2 font-semibold text-white group-hover:text-red-300 transition-colors">
                                {onNavigateToDriver ? (
                                  <button
                                    type="button"
                                    onClick={() => onNavigateToDriver(d.driverCode)}
                                    className="flex items-center gap-1.5 min-w-0 text-left hover:text-sky-300 hover:underline cursor-pointer transition-colors"
                                    title={`${d.driverName} の大百科詳細を開く`}
                                  >
                                    <span className="font-mono text-slate-400 text-[10px] shrink-0">[{d.driverCode}]</span>
                                    <span className="truncate max-w-[140px] sm:max-w-[180px]">{d.driverName}</span>
                                    <span className="text-[9px] text-sky-400 opacity-0 group-hover:opacity-100 transition-opacity">➔</span>
                                  </button>
                                ) : (
                                  <div className="flex items-center gap-1.5 min-w-0">
                                    <span className="font-mono text-slate-400 text-[10px] shrink-0">[{d.driverCode}]</span>
                                    <span className="truncate max-w-[140px] sm:max-w-[180px]">{d.driverName}</span>
                                  </div>
                                )}
                              </td>
                              <td className="py-1.5 px-2 text-slate-300">
                                <div className="flex items-center gap-1.5 min-w-0">
                                  <span
                                    className="w-2 h-2 rounded-full inline-block shrink-0"
                                    style={{ backgroundColor: d.teamColor }}
                                  />
                                  <span className="truncate max-w-[110px] sm:max-w-[150px] text-[11px] text-slate-300">{d.team}</span>
                                </div>
                              </td>
                              <td className="py-1.5 px-1.5 text-center font-mono text-slate-300 text-[11px]">
                                {d.wins > 0 ? (
                                  <span className="text-amber-300 font-bold">{d.wins}</span>
                                ) : (
                                  <span className="text-slate-600">-</span>
                                )}
                              </td>
                              <td className="py-1.5 px-1.5 text-center font-mono text-slate-300 text-[11px]">
                                {d.podiums > 0 ? (
                                  <span className="text-slate-200">{d.podiums}</span>
                                ) : (
                                  <span className="text-slate-600">-</span>
                                )}
                              </td>
                              <td className="py-1.5 px-2.5 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  <div className="w-12 h-1 bg-slate-800 rounded-full overflow-hidden hidden sm:block">
                                    <div
                                      className="h-full rounded-full"
                                      style={{
                                        width: `${percentage}%`,
                                        backgroundColor: d.teamColor,
                                      }}
                                    />
                                  </div>
                                  <span className="font-mono font-bold text-white text-xs text-right whitespace-nowrap">
                                    {d.points} <span className="text-[9px] text-slate-400">pt</span>
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
              </div>

              {/* Right Column (5 cols): Constructors' Standings Table + Title Fight Card */}
              <div className="lg:col-span-5 space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between px-1">
                    <span className="font-racing font-bold text-xs text-white uppercase tracking-wider flex items-center gap-1.5">
                      <span>🏆</span>
                      <span>コンストラクターズ (全{activeConstructorStandings.length}組)</span>
                    </span>
                  </div>
                  <div className="rounded-xl border border-white/10 overflow-hidden bg-slate-900/70 shadow-md">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs table-auto">
                        <thead className="bg-slate-950/90 text-slate-400 font-racing uppercase text-[10px] border-b border-white/10">
                          <tr>
                            <th className="py-2 px-2 text-center w-10">順位</th>
                            <th className="py-2 px-2">チーム名</th>
                            <th className="py-2 px-2">PU</th>
                            <th className="py-2 px-1.5 text-center w-10">勝</th>
                            <th className="py-2 px-2.5 text-right w-24">獲得点</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {activeConstructorStandings.map((team) => {
                            const percentage = (team.points / maxTeamPoints) * 100;
                            return (
                              <tr
                                key={team.position}
                                className="hover:bg-white/[0.04] transition-colors group"
                              >
                                <td className="py-1.5 px-2 text-center font-mono font-bold text-slate-300">
                                  {team.position === 1 ? (
                                    <span className="text-amber-400 text-xs font-black">🏆 1</span>
                                  ) : (
                                    team.position
                                  )}
                                </td>
                                <td className="py-1.5 px-2 font-semibold text-white group-hover:text-red-300 transition-colors">
                                  {onNavigateToTeam ? (
                                    <button
                                      type="button"
                                      onClick={() => onNavigateToTeam(getTeamIdFromName(team.teamName))}
                                      className="flex items-center gap-1.5 min-w-0 text-left hover:text-sky-300 hover:underline cursor-pointer transition-colors"
                                      title={`${team.teamName} の大百科詳細を開く`}
                                    >
                                      <span
                                        className="w-2 h-2 rounded-sm shrink-0 shadow-sm"
                                        style={{ backgroundColor: team.teamColor }}
                                      />
                                      <span className="truncate max-w-[130px] sm:max-w-[160px]">{team.teamName}</span>
                                      <span className="text-[9px] text-sky-400 opacity-0 group-hover:opacity-100 transition-opacity">➔</span>
                                    </button>
                                  ) : (
                                    <div className="flex items-center gap-1.5 min-w-0">
                                      <span
                                        className="w-2 h-2 rounded-sm shrink-0 shadow-sm"
                                        style={{ backgroundColor: team.teamColor }}
                                      />
                                      <span className="truncate max-w-[130px] sm:max-w-[160px]">{team.teamName}</span>
                                    </div>
                                  )}
                                </td>
                                <td className="py-1.5 px-2 font-mono text-slate-400 text-[10px] truncate max-w-[90px]">
                                  {team.powerUnit}
                                </td>
                                <td className="py-1.5 px-1.5 text-center font-mono text-slate-300 text-[11px]">
                                  {team.wins > 0 ? (
                                    <span className="text-amber-300 font-bold">{team.wins}</span>
                                  ) : (
                                    <span className="text-slate-600">-</span>
                                  )}
                                </td>
                                <td className="py-1.5 px-2.5 text-right">
                                  <div className="flex items-center justify-end gap-1.5">
                                    <div className="w-12 h-1 bg-slate-800 rounded-full overflow-hidden hidden sm:block">
                                      <div
                                        className="h-full rounded-full"
                                        style={{
                                          width: `${percentage}%`,
                                          backgroundColor: team.teamColor,
                                        }}
                                      />
                                    </div>
                                    <span className="font-mono font-bold text-white text-xs text-right whitespace-nowrap">
                                      {team.points} <span className="text-[9px] text-slate-400">pt</span>
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
                </div>

                {/* Title Fight Intelligence & Gap Analysis Card */}
                <div className="glass-card-premium p-3 sm:p-3.5 rounded-xl border border-amber-500/20 shadow-md space-y-2.5">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm">🎯</span>
                      <h4 className="font-racing font-bold text-xs text-white uppercase tracking-wider">
                        TITLE FIGHT INTELLIGENCE / 王座争い分析
                      </h4>
                    </div>
                    <span className="text-[10px] font-mono text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                      {selectedSeason === '2026' ? '2026想定（タイトル未確定）' : '2025確定結果'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    <div className="p-2 rounded-lg bg-slate-950/60 border border-white/5 space-y-1">
                      <span className="text-[10px] text-slate-400 block font-sans">
                        {selectedSeason === '2026' ? '🏎️ WDC 想定首位マージン' : '🏎️ 2025 WDC 王者'}
                      </span>
                      <div className="font-bold text-white text-xs truncate">
                        {activeDriverStandings[0]?.driverName.split(' ')[0]}
                      </div>
                      <div className="text-emerald-400 text-[11px] font-bold">
                        +{activeDriverStandings[0]?.points - (activeDriverStandings[1]?.points || 0)} pt <span className="text-[9px] text-slate-400 font-normal">{selectedSeason === '2026' ? 'リード (未確定)' : '差で戴冠'}</span>
                      </div>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-950/60 border border-white/5 space-y-1">
                      <span className="text-[10px] text-slate-400 block font-sans">
                        {selectedSeason === '2026' ? '🏆 WCC 想定首位マージン' : '🏆 2025 WCC 王者'}
                      </span>
                      <div className="font-bold text-white text-xs truncate">
                        {activeConstructorStandings[0]?.teamName.split(' ')[0]}
                      </div>
                      <div className="text-emerald-400 text-[11px] font-bold">
                        +{activeConstructorStandings[0]?.points - (activeConstructorStandings[1]?.points || 0)} pt <span className="text-[9px] text-slate-400 font-normal">{selectedSeason === '2026' ? 'リード (未確定)' : '差で戴冠'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-300 bg-slate-950/40 p-2 rounded-lg border border-white/5 leading-relaxed">
                    {selectedSeason === '2026' ? (
                      <>
                        💡 <strong className="text-sky-300 font-racing">2026シーズン展望 (シミュレーション):</strong> 2026年シーズンは現在未終了であり、全戦の公式結果・年間王者は未確定です。本数値はFIA公式参戦11チーム・22名に基づくプレシーズンシミュレーション想定です。
                      </>
                    ) : (
                      <>
                        💡 <strong className="text-sky-300 font-racing">2025シーズン総括:</strong> ランド・ノリスが自身初のドライバーズチャンピオンを獲得。マクラーレンが1998年以来となるコンストラクターズ選手権を制覇しました。
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 sm:gap-3">
            {activeGrid.map((team) => (
              <div
                key={team.teamName}
                className="p-3 rounded-xl border border-white/10 bg-slate-900/60 hover:border-white/20 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5 border-b border-white/10 pb-1.5">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full shadow-sm"
                        style={{ backgroundColor: team.teamColor }}
                      />
                      <h3 className="font-racing font-bold text-sm sm:text-base text-white">{team.teamName}</h3>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 px-2 py-0.5 rounded bg-white/5 border border-white/5 truncate max-w-[140px]">
                      {team.fullName}
                    </span>
                  </div>

                  {/* Team Principal & PU specs pill */}
                  <div className="flex flex-wrap items-center gap-1.5 mb-2 text-[10px] font-mono">
                    <span className="bg-slate-950/80 border border-white/10 px-2 py-0.5 rounded text-slate-300">
                      👔 代表: <strong className="text-slate-100">{team.teamPrincipal}</strong>
                    </span>
                    <span className="bg-slate-950/80 border border-white/10 px-2 py-0.5 rounded text-slate-300">
                      ⚡ PU: <strong className="text-sky-300">{team.powerUnit}</strong>
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    {team.drivers.map((driver) => (
                      <div
                        key={driver.number}
                        className="p-2 rounded-lg bg-black/40 border border-white/5 flex items-center justify-between"
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
