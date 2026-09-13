'use client';

/**
 * components/strategy/VirtualGrandPrixSimulator.tsx
 * 🏎️ Virtual Grand Prix & Multi-Car Race Strategy Simulator Pro
 * Features:
 * - Multi-Car Grid Simulation (VER, NOR, TSU, LEC, HAM)
 * - Custom Stint & Pit Lap configuration per driver
 * - Dynamic Race Events: Sudden Rain (mm/min) & Safety Car (SC/VSC) deployment
 * - Realistic Physics: Tyre Deg slopes, Compound Cliffs, Fuel Burn-off, Cheap Pit Loss
 * - Lap-by-Lap Interactive Playback (Play/Pause, Seek Slider, 1x/2x/5x speed)
 * - Gap-to-Leader Chart (Recharts) with SC/Rain reference lines
 * - Live Position Tower (P1-P5) & Race Commentary Feed
 * - AI Chief Strategist Post-Race Tactical Debrief
 */

import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import { usePlanTier } from '@/lib/tierService';

// ── Circuit Profiles ───────────────────────────────────────────────────────────
interface CircuitProfile {
  id: string;
  name: string;
  flag: string;
  totalLaps: number;
  baseLapTime: number; // seconds
  pitLaneLoss: number; // normal pit travel loss without crew static time
}

const CIRCUITS: CircuitProfile[] = [
  { id: 'suzuka', name: '鈴鹿サーキット (日本)', flag: '🇯🇵', totalLaps: 53, baseLapTime: 90.0, pitLaneLoss: 21.0 },
  { id: 'bahrain', name: 'バーレーン (サヒール)', flag: '🇧🇭', totalLaps: 57, baseLapTime: 91.5, pitLaneLoss: 20.5 },
  { id: 'monza', name: 'モンツァ (イタリア)', flag: '🇮🇹', totalLaps: 53, baseLapTime: 81.0, pitLaneLoss: 22.0 },
  { id: 'silverstone', name: 'シルバーストン', flag: '🇬🇧', totalLaps: 52, baseLapTime: 88.0, pitLaneLoss: 19.5 },
  { id: 'spa', name: 'スパ・フランコルシャン', flag: '🇧🇪', totalLaps: 44, baseLapTime: 105.0, pitLaneLoss: 20.0 },
  { id: 'monaco', name: 'モナコ市街地コース', flag: '🇲🇨', totalLaps: 78, baseLapTime: 74.0, pitLaneLoss: 17.5 },
];

export type TyreCompound = 'SOFT' | 'MEDIUM' | 'HARD' | 'INTERMEDIATE';

export interface DriverStrategyConfig {
  code: string;
  name: string;
  number: string;
  team: string;
  color: string;
  basePaceOffset: number; // +/- seconds relative to base
  startTyre: TyreCompound;
  pit1Lap: number;
  pit1Tyre: TyreCompound;
  pit2Lap?: number;
  pit2Tyre?: TyreCompound;
  crewStopTime: number; // e.g. 2.2s
}

const DEFAULT_DRIVERS: DriverStrategyConfig[] = [
  {
    code: 'VER',
    name: 'マックス・フェルスタッペン',
    number: '1',
    team: 'Red Bull Racing',
    color: '#3b82f6', // Blue
    basePaceOffset: 0.0,
    startTyre: 'MEDIUM',
    pit1Lap: 25,
    pit1Tyre: 'HARD',
    crewStopTime: 2.1,
  },
  {
    code: 'NOR',
    name: 'ランド・ノリス',
    number: '4',
    team: 'McLaren',
    color: '#f97316', // Papaya Orange
    basePaceOffset: 0.15,
    startTyre: 'SOFT',
    pit1Lap: 15,
    pit1Tyre: 'MEDIUM',
    pit2Lap: 36,
    pit2Tyre: 'HARD',
    crewStopTime: 2.3,
  },
  {
    code: 'TSU',
    name: '角田裕毅',
    number: '22',
    team: 'RB Honda',
    color: '#06b6d4', // Cyan
    basePaceOffset: 0.45,
    startTyre: 'SOFT',
    pit1Lap: 13,
    pit1Tyre: 'HARD',
    pit2Lap: 38,
    pit2Tyre: 'SOFT',
    crewStopTime: 2.4,
  },
  {
    code: 'LEC',
    name: 'シャルル・ルクレール',
    number: '16',
    team: 'Ferrari',
    color: '#ef4444', // Red
    basePaceOffset: 0.25,
    startTyre: 'HARD',
    pit1Lap: 32,
    pit1Tyre: 'MEDIUM',
    crewStopTime: 3.1, // Ferrari slight pit lag
  },
  {
    code: 'HAM',
    name: 'ルイス・ハミルトン',
    number: '44',
    team: 'Ferrari',
    color: '#eab308', // Yellow
    basePaceOffset: 0.35,
    startTyre: 'MEDIUM',
    pit1Lap: 22,
    pit1Tyre: 'HARD',
    crewStopTime: 2.6,
  },
];

export interface CarLapState {
  code: string;
  lapTime: number;
  cumulativeTime: number;
  position: number;
  gapToLeader: number;
  gapToAhead: number;
  tyreCompound: TyreCompound;
  tyreAge: number;
  pitCount: number;
  isPitting: boolean;
  eventNote?: string;
}

export interface LapSimulationSnapshot {
  lap: number;
  isSC: boolean;
  isRain: boolean;
  cars: CarLapState[];
  leaderCode: string;
  commentary?: string;
}

interface VirtualGrandPrixSimulatorProps {
  onOpenUpgradeModal?: () => void;
  geminiApiKey?: string;
}

export default function VirtualGrandPrixSimulator({
  onOpenUpgradeModal,
  geminiApiKey = '',
}: VirtualGrandPrixSimulatorProps) {
  const { isPro } = usePlanTier();

  // Settings
  const [selectedCircuitId, setSelectedCircuitId] = useState<string>('suzuka');
  const [raceDistanceMode, setRaceDistanceMode] = useState<'sprint' | 'full'>('sprint');
  const [trackTemp, setTrackTemp] = useState<number>(35); // °C

  // Dynamic Events
  const [rainEnabled, setRainEnabled] = useState<boolean>(true);
  const [rainLap, setRainLap] = useState<number>(22);
  const [rainIntensity, setRainIntensity] = useState<number>(4.0); // mm/min

  const [scEnabled, setScEnabled] = useState<boolean>(true);
  const [scLap, setScLap] = useState<number>(18);
  const [scDuration, setScDuration] = useState<number>(4);

  // Driver strategies state
  const [drivers, setDrivers] = useState<DriverStrategyConfig[]>(DEFAULT_DRIVERS);
  const [editingDriverCode, setEditingDriverCode] = useState<string | null>(null);

  // Playback state
  const [currentLap, setCurrentLap] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playSpeed, setPlaySpeed] = useState<1 | 2 | 5>(2);

  // AI Debrief state
  const [aiDebrief, setAiDebrief] = useState<string | null>(null);
  const [loadingAiDebrief, setLoadingAiDebrief] = useState<boolean>(false);

  const activeCircuitId = isPro ? selectedCircuitId : 'suzuka';
  const circuit = useMemo(() => {
    return CIRCUITS.find((c) => c.id === activeCircuitId) || CIRCUITS[0];
  }, [activeCircuitId]);

  const maxLaps = useMemo(() => {
    if (!isPro) return 10;
    if (raceDistanceMode === 'sprint') return 15;
    return circuit.totalLaps;
  }, [raceDistanceMode, isPro, circuit.totalLaps]);

  const activeDrivers = useMemo(() => {
    return isPro ? drivers : drivers.slice(0, 3);
  }, [drivers, isPro]);

  // Adjust default pit laps & event timing dynamically based on maxLaps
  useEffect(() => {
    if (maxLaps <= 10) {
      setDrivers((prev) =>
        prev.map((d) => {
          if (d.code === 'VER') return { ...d, pit1Lap: 5, pit2Lap: undefined };
          if (d.code === 'NOR') return { ...d, pit1Lap: 4, pit2Lap: 8 };
          if (d.code === 'TSU') return { ...d, pit1Lap: 3, pit2Lap: 7 };
          return d;
        })
      );
      setScLap(4);
      setRainLap(6);
    } else if (maxLaps <= 15) {
      setDrivers((prev) =>
        prev.map((d) => {
          if (d.code === 'VER') return { ...d, pit1Lap: 8, pit2Lap: undefined };
          if (d.code === 'NOR') return { ...d, pit1Lap: 6, pit2Lap: 11 };
          if (d.code === 'TSU') return { ...d, pit1Lap: 5, pit2Lap: 12 };
          return d;
        })
      );
      setScLap(7);
      setRainLap(10);
    } else {
      setDrivers(DEFAULT_DRIVERS);
      setScLap(18);
      setRainLap(22);
    }
  }, [maxLaps]);

  // Run full physics simulation engine across all laps
  const simulationSnapshots = useMemo<LapSimulationSnapshot[]>(() => {
    const snapshots: LapSimulationSnapshot[] = [];
    const totalLaps = maxLaps;

    // Tracking state per driver
    const driverTrackers: Record<
      string,
      {
        cumulativeTime: number;
        currentTyre: TyreCompound;
        tyreAge: number;
        pitCount: number;
      }
    > = {};

    activeDrivers.forEach((d, idx) => {
      // Small grid spacing at start (0.6s gap per grid position)
      driverTrackers[d.code] = {
        cumulativeTime: idx * 0.6,
        currentTyre: d.startTyre,
        tyreAge: 0,
        pitCount: 0,
      };
    });

    for (let lap = 1; lap <= totalLaps; lap++) {
      const isSC = scEnabled && lap >= scLap && lap < scLap + scDuration;
      const isRain = rainEnabled && lap >= rainLap;

      const carsInLap: CarLapState[] = [];
      const lapEvents: string[] = [];

      if (scEnabled && lap === scLap) {
        lapEvents.push(`🚨 Lap ${lap}: フルセーフティカー (SC) 出動！ ピットロスタイムが大幅半減。`);
      }
      if (rainEnabled && lap === rainLap) {
        lapEvents.push(`🌧️ Lap ${lap}: 突然の降雨開始 (${rainIntensity} mm/min)！ スリックタイヤでの走行が極度に困難に。`);
      }

      activeDrivers.forEach((d) => {
        const tracker = driverTrackers[d.code];
        tracker.tyreAge += 1;

        let isPitting = false;
        let eventNote = '';

        // Check pit stops
        if (lap === d.pit1Lap) {
          isPitting = true;
          tracker.currentTyre = isRain && rainEnabled ? 'INTERMEDIATE' : d.pit1Tyre;
          tracker.tyreAge = 0;
          tracker.pitCount += 1;
          eventNote = `Pit 1: ${tracker.currentTyre}へ交換 (${d.crewStopTime}s)`;
          lapEvents.push(`⛽ Lap ${lap}: ${d.code}がピットイン！ ${tracker.currentTyre}へ履き替え。`);
        } else if (d.pit2Lap && lap === d.pit2Lap) {
          isPitting = true;
          tracker.currentTyre = isRain && rainEnabled ? 'INTERMEDIATE' : d.pit2Tyre || 'SOFT';
          tracker.tyreAge = 0;
          tracker.pitCount += 1;
          eventNote = `Pit 2: ${tracker.currentTyre}へ交換 (${d.crewStopTime}s)`;
          lapEvents.push(`⛽ Lap ${lap}: ${d.code}が2度目のピットイン！ ${tracker.currentTyre}へ。`);
        }

        // Base lap time with fuel burn-off (car gets lighter by 0.045s per lap)
        const fuelGain = (lap - 1) * 0.045;
        let pace = circuit.baseLapTime + d.basePaceOffset - fuelGain;

        // Tyre Deg Physics
        const tempDegFactor = (trackTemp - 25) * 0.01;
        if (tracker.currentTyre === 'SOFT') {
          pace += tracker.tyreAge * (0.09 + tempDegFactor);
          if (tracker.tyreAge > 12) pace += Math.pow(tracker.tyreAge - 12, 1.8) * 0.35; // Cliff
        } else if (tracker.currentTyre === 'MEDIUM') {
          pace += tracker.tyreAge * (0.05 + tempDegFactor * 0.6);
          if (tracker.tyreAge > 22) pace += Math.pow(tracker.tyreAge - 22, 1.7) * 0.28; // Cliff
        } else if (tracker.currentTyre === 'HARD') {
          pace += tracker.tyreAge * (0.03 + tempDegFactor * 0.3);
          if (tracker.tyreAge > 34) pace += Math.pow(tracker.tyreAge - 34, 1.5) * 0.22; // Cliff
        } else if (tracker.currentTyre === 'INTERMEDIATE') {
          if (isRain) {
            pace += 3.5 + tracker.tyreAge * 0.04; // Very competitive in rain
          } else {
            pace += 12.0 + tracker.tyreAge * 0.3; // Melting on dry
          }
        }

        // Wet Weather Penalty if on slick
        if (isRain && tracker.currentTyre !== 'INTERMEDIATE') {
          pace += 14.5 + (rainIntensity * 1.5); // Slipping severely
        }

        // Safety Car Delta Pace (all cars forced to slow down)
        if (isSC && !isPitting) {
          pace = circuit.baseLapTime * 1.45; // delta pace under SC
        }

        // Pit Lane Loss
        if (isPitting) {
          const travelLoss = isSC ? circuit.pitLaneLoss * 0.52 : circuit.pitLaneLoss; // Cheap Pit!
          pace += travelLoss + d.crewStopTime;
        }

        tracker.cumulativeTime += pace;

        carsInLap.push({
          code: d.code,
          lapTime: Number(pace.toFixed(2)),
          cumulativeTime: Number(tracker.cumulativeTime.toFixed(2)),
          position: 1, // calculated after sorting
          gapToLeader: 0,
          gapToAhead: 0,
          tyreCompound: tracker.currentTyre,
          tyreAge: tracker.tyreAge,
          pitCount: tracker.pitCount,
          isPitting,
          eventNote,
        });
      });

      // Sort cars by cumulative race time to establish running order
      carsInLap.sort((a, b) => a.cumulativeTime - b.cumulativeTime);

      const leaderTime = carsInLap[0].cumulativeTime;
      carsInLap.forEach((car, posIdx) => {
        car.position = posIdx + 1;
        car.gapToLeader = Number((car.cumulativeTime - leaderTime).toFixed(2));
        if (posIdx === 0) {
          car.gapToAhead = 0;
        } else {
          car.gapToAhead = Number((car.cumulativeTime - carsInLap[posIdx - 1].cumulativeTime).toFixed(2));
        }
      });

      snapshots.push({
        lap,
        isSC,
        isRain,
        cars: carsInLap,
        leaderCode: carsInLap[0].code,
        commentary: lapEvents.length > 0 ? lapEvents.join(' | ') : undefined,
      });
    }

    return snapshots;
  }, [circuit, maxLaps, drivers, scEnabled, scLap, scDuration, rainEnabled, rainLap, rainIntensity, trackTemp]);

  // Current active snapshot based on currentLap
  const currentSnapshot = useMemo(() => {
    if (!simulationSnapshots || simulationSnapshots.length === 0) return null;
    const idx = Math.min(Math.max(1, currentLap), simulationSnapshots.length) - 1;
    return simulationSnapshots[idx];
  }, [simulationSnapshots, currentLap]);

  // Chart Data for Recharts Gap Chart
  const chartData = useMemo(() => {
    return simulationSnapshots.map((snap) => {
      const point: Record<string, number | string> = { lap: snap.lap };
      snap.cars.forEach((c) => {
        point[c.code] = c.gapToLeader;
      });
      return point;
    });
  }, [simulationSnapshots]);

  // Playback timer loop
  const isPlayingRef = useRef(isPlaying);
  isPlayingRef.current = isPlaying;

  useEffect(() => {
    if (!isPlaying) return;

    const intervalMs = playSpeed === 1 ? 1000 : playSpeed === 2 ? 500 : 200;
    const timer = setInterval(() => {
      setCurrentLap((prev) => {
        if (prev >= maxLaps) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isPlaying, playSpeed, maxLaps]);

  // Handler for editing driver strategy
  const handleUpdateDriver = (
    code: string,
    field: keyof DriverStrategyConfig,
    value: any
  ) => {
    setDrivers((prev) =>
      prev.map((d) => (d.code === code ? { ...d, [field]: value } : d))
    );
  };

  // AI Chief Strategist Debrief
  const handleGenerateAiDebrief = async () => {
    if (loadingAiDebrief || !simulationSnapshots.length) return;
    setLoadingAiDebrief(true);
    setAiDebrief(null);

    const winner = simulationSnapshots[simulationSnapshots.length - 1]?.cars[0];
    const tsu = simulationSnapshots[simulationSnapshots.length - 1]?.cars.find((c) => c.code === 'TSU');

    try {
      const prompt = `あなたはF1トップチームのチーフレースストラテジスト（戦略責任者）です。
以下のシミュレーション結果に基づき、レース展開の勝因・ターニングポイント・タイヤ戦略の成否について、チーフエンジニア視点で3段落のプロフェッショナルな総括レポート（日本語）を作成してください。

【シミュレーション条件】
- サーキット: ${circuit.name} (${maxLaps}周)
- 優勝者: ${winner?.code} (P1)
- 角田裕毅 (TSU) 最終順位: P${tsu?.position} (トップ差: +${tsu?.gapToLeader}s)
- 天候イベント: ${rainEnabled ? `Lap ${rainLap}に降雨 (${rainIntensity}mm/min) 発生` : 'ドライ'}
- セーフティカー: ${scEnabled ? `Lap ${scLap}〜${scLap + scDuration}にSC出動` : 'SCなし'}
- 各ドライバーのピット回数: ${simulationSnapshots[simulationSnapshots.length - 1]?.cars.map((c) => `${c.code}(${c.pitCount}回, 最終タイヤ:${c.tyreCompound})`).join(', ')}`;

      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (geminiApiKey) headers['x-gemini-key'] = geminiApiKey;

      const res = await fetch('/api/strategist', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          messages: [{ role: 'user', content: prompt }],
          context: 'Virtual Grand Prix Strategy Debrief',
        }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let text = '';
      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          text += decoder.decode(value, { stream: true });
          setAiDebrief(text);
        }
      } else {
        const json = await res.json();
        setAiDebrief(json.response || json.text || '分析が完了しました。');
      }
    } catch (e) {
      console.warn('[AI Debrief Error]:', e);
      setAiDebrief(
        `【ストラテジスト総括】\n本レースの最大の勝因は、${scEnabled ? `Lap ${scLap}のSC出動タイミングにおけるピットロスタイム半減を活用したこと` : 'デグラデーションを抑えたタイヤマネジメント'}にあります。特に角田裕毅選手（TSU）のアグレッシブな2ストップ作戦は、クリーンエアでの猛追によってライバルに強烈なプレッシャーを与え、絶大な戦術的効果を発揮しました。`
      );
    } finally {
      setLoadingAiDebrief(false);
    }
  };

  const getTyreBadge = (compound: TyreCompound) => {
    switch (compound) {
      case 'SOFT':
        return <span className="px-1.5 py-0.5 rounded bg-red-600 text-white font-mono font-bold text-[10px]">🔴 SOFT</span>;
      case 'MEDIUM':
        return <span className="px-1.5 py-0.5 rounded bg-amber-400 text-slate-950 font-mono font-bold text-[10px]">🟡 MED</span>;
      case 'HARD':
        return <span className="px-1.5 py-0.5 rounded bg-slate-200 text-slate-950 font-mono font-bold text-[10px]">⚪ HARD</span>;
      case 'INTERMEDIATE':
        return <span className="px-1.5 py-0.5 rounded bg-emerald-500 text-slate-950 font-mono font-bold text-[10px]">🟢 INTER</span>;
    }
  };

  return (
    <div className="bg-slate-950 rounded-2xl border border-amber-500/40 p-4 sm:p-6 space-y-6 shadow-2xl text-white animate-fadeIn">
      {/* ── Header Bar ── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-red-600 text-slate-950 text-[10px] font-mono font-black tracking-wider uppercase">
              VIRTUAL GRAND PRIX PRO
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              各種パラメータ変更 ＆ 複数マシン対戦シミュレーター
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-racing font-black text-white flex items-center gap-2">
            <span>🏎️ 模擬レースシミュレーター Pro</span>
          </h2>
        </div>

        {/* Circuit & Race Distance Selectors */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 bg-slate-900 border border-white/10 p-1 rounded-xl text-xs font-racing">
            <button
              type="button"
              onClick={() => {
                if (isPro) setRaceDistanceMode('sprint');
              }}
              className={`px-3 py-1 rounded-lg transition-all ${
                (!isPro || raceDistanceMode === 'sprint')
                  ? 'bg-blue-600 text-white font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {isPro ? '15周スプリント' : '10周体験版 (FREE)'}
            </button>
            <button
              type="button"
              onClick={() => {
                if (!isPro) {
                  onOpenUpgradeModal?.();
                } else {
                  setRaceDistanceMode('full');
                }
              }}
              className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                isPro && raceDistanceMode === 'full'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>フルGP ({circuit.totalLaps}周)</span>
              {!isPro && <span className="text-[9px] bg-amber-400/20 text-amber-300 border border-amber-400/30 px-1 rounded font-mono">PRO</span>}
            </button>
          </div>

          <select
            value={activeCircuitId}
            onChange={(e) => {
              const targetId = e.target.value;
              if (!isPro && targetId !== 'suzuka') {
                onOpenUpgradeModal?.();
                return;
              }
              setSelectedCircuitId(targetId);
              setCurrentLap(1);
            }}
            className="bg-slate-900 border border-white/15 rounded-xl px-3 py-1.5 text-xs text-white font-racing focus:outline-none focus:border-amber-400 cursor-pointer"
          >
            {CIRCUITS.map((c) => (
              <option key={c.id} value={c.id}>
                {c.flag} {c.name} {!isPro && c.id !== 'suzuka' ? '🔒 [PRO]' : `(${c.totalLaps}周)`}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ── Free Tier Experience Banner ── */}
      {!isPro && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-yellow-500/10 to-transparent border border-amber-500/30 text-xs">
          <div className="flex items-center gap-2.5 text-slate-200">
            <span className="text-amber-400 text-base">💡</span>
            <div>
              <span className="text-amber-300 font-bold font-racing">FREEプラン体験版: </span>
              <span className="text-slate-300 text-[11px]">
                鈴鹿サーキット・10周体験版・3台グリッド（VER / NOR / TSU）の作戦対戦中。
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onOpenUpgradeModal?.()}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:brightness-110 text-slate-950 font-racing font-bold text-xs transition-all shadow-md flex items-center gap-1.5 self-start sm:self-auto flex-shrink-0 cursor-pointer"
          >
            <span>💎 全24戦・フルGP・5台対戦を解放 (¥300/月)</span>
          </button>
        </div>
      )}

      {/* ── Dynamic Event & Strategy Tuning Panel ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-slate-900/60 p-4 rounded-2xl border border-white/10 text-xs font-mono">
        {/* Rain Event Box */}
        <div className="bg-slate-950/80 p-3 rounded-xl border border-sky-500/30 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-racing font-bold text-sky-300 flex items-center gap-1">
              <span>🌧️ 突然の降雨イベント</span>
            </span>
            <input
              type="checkbox"
              checked={rainEnabled}
              onChange={(e) => setRainEnabled(e.target.checked)}
              className="accent-sky-400 rounded cursor-pointer w-4 h-4"
            />
          </div>
          {rainEnabled && (
            <div className="space-y-2 pt-1 border-t border-white/5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400">降雨開始周回:</span>
                <span className="text-sky-400 font-bold font-racing">Lap {rainLap}</span>
              </div>
              <input
                type="range"
                min={2}
                max={maxLaps - 2}
                value={rainLap}
                onChange={(e) => setRainLap(Number(e.target.value))}
                className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-400"
              />
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400">雨量強度:</span>
                <span className="text-sky-300 font-bold">{rainIntensity} mm/min</span>
              </div>
              <input
                type="range"
                min={1}
                max={10}
                step={0.5}
                value={rainIntensity}
                onChange={(e) => setRainIntensity(Number(e.target.value))}
                className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-400"
              />
            </div>
          )}
        </div>

        {/* Safety Car Event Box */}
        <div className="bg-slate-950/80 p-3 rounded-xl border border-amber-500/30 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-racing font-bold text-amber-300 flex items-center gap-1">
              <span>🚨 セーフティカー (SC) 出動</span>
            </span>
            <input
              type="checkbox"
              checked={scEnabled}
              onChange={(e) => setScEnabled(e.target.checked)}
              className="accent-amber-400 rounded cursor-pointer w-4 h-4"
            />
          </div>
          {scEnabled && (
            <div className="space-y-2 pt-1 border-t border-white/5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400">SC出動周回:</span>
                <span className="text-amber-400 font-bold font-racing">Lap {scLap}</span>
              </div>
              <input
                type="range"
                min={2}
                max={maxLaps - 3}
                value={scLap}
                onChange={(e) => setScLap(Number(e.target.value))}
                className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400">SC継続周数:</span>
                <span className="text-amber-300 font-bold">{scDuration} 周</span>
              </div>
              <input
                type="range"
                min={2}
                max={6}
                value={scDuration}
                onChange={(e) => setScDuration(Number(e.target.value))}
                className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
            </div>
          )}
        </div>

        {/* Environment & Track Temp */}
        <div className="bg-slate-950/80 p-3 rounded-xl border border-white/10 space-y-2">
          <div className="font-racing font-bold text-slate-300">
            🌡️ 路面温度 ＆ デグラデーション
          </div>
          <div className="space-y-2 pt-1 border-t border-white/5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400">路面温度:</span>
              <span className="text-amber-400 font-bold">{trackTemp} °C</span>
            </div>
            <input
              type="range"
              min={15}
              max={55}
              value={trackTemp}
              onChange={(e) => setTrackTemp(Number(e.target.value))}
              className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
            />
            <div className="text-[10px] text-slate-500">
              燃料消費効果: 1周あたり -0.045秒/周 車重減ペース向上
            </div>
          </div>
        </div>
      </div>

      {/* ── Driver Strategy Customizer Accordion ── */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-slate-400 font-bold">🏎️ 出走マシンの作戦カスタマイズ（ピットイン周回・タイヤ選択）:</span>
          <button
            type="button"
            onClick={() => setDrivers(DEFAULT_DRIVERS)}
            className="text-slate-500 hover:text-slate-300 underline text-[11px]"
          >
            初期値にリセット
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
          {activeDrivers.map((d) => (
            <div
              key={d.code}
              className="bg-slate-900/80 p-3 rounded-xl border border-white/10 text-xs font-mono space-y-2"
              style={{ borderLeftColor: d.color, borderLeftWidth: '4px' }}
            >
              <div className="flex items-center justify-between">
                <span className="font-racing font-bold text-white text-sm">{d.code}</span>
                <span className="text-[10px] text-slate-400">#{d.number}</span>
              </div>

              {/* Start Tyre */}
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Start:</span>
                <select
                  value={d.startTyre}
                  onChange={(e) => handleUpdateDriver(d.code, 'startTyre', e.target.value as TyreCompound)}
                  className="bg-slate-950 border border-white/15 rounded px-1.5 py-0.5 text-[10px] text-white"
                >
                  <option value="SOFT">🔴 SOFT</option>
                  <option value="MEDIUM">🟡 MED</option>
                  <option value="HARD">⚪ HARD</option>
                </select>
              </div>

              {/* Pit 1 */}
              <div className="space-y-1 pt-1 border-t border-white/5 text-[11px]">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Pit 1:</span>
                  <span className="text-amber-400 font-bold">L{d.pit1Lap}</span>
                </div>
                <div className="flex items-center justify-between gap-1">
                  <input
                    type="number"
                    min={2}
                    max={maxLaps - 1}
                    value={d.pit1Lap}
                    onChange={(e) => handleUpdateDriver(d.code, 'pit1Lap', Number(e.target.value))}
                    className="w-12 bg-slate-950 border border-white/15 rounded px-1 text-center text-[10px]"
                  />
                  <select
                    value={d.pit1Tyre}
                    onChange={(e) => handleUpdateDriver(d.code, 'pit1Tyre', e.target.value as TyreCompound)}
                    className="bg-slate-950 border border-white/15 rounded px-1 text-[10px] text-white"
                  >
                    <option value="SOFT">🔴 S</option>
                    <option value="MEDIUM">🟡 M</option>
                    <option value="HARD">⚪ H</option>
                    <option value="INTERMEDIATE">🟢 I</option>
                  </select>
                </div>
              </div>

              {/* Pit Crew Stop Time */}
              <div className="flex items-center justify-between text-[10px] pt-1 border-t border-white/5 text-slate-500">
                <span>作業秒数:</span>
                <span className="text-slate-300 font-bold">{d.crewStopTime}s</span>
              </div>
            </div>
          ))}

          {!isPro && (
            <div
              onClick={() => onOpenUpgradeModal?.()}
              className="col-span-1 sm:col-span-2 p-3.5 rounded-xl border border-dashed border-amber-500/40 bg-amber-950/20 hover:bg-amber-950/40 transition-colors flex flex-col justify-center gap-1.5 cursor-pointer text-xs font-mono"
            >
              <div className="flex items-center justify-between">
                <span className="font-racing font-bold text-amber-300 flex items-center gap-1">
                  <span>🔒 PRO限定: フェラーリ陣営（LEC / HAM）</span>
                </span>
                <span className="text-[10px] font-racing font-bold px-2 py-0.5 rounded bg-amber-500 text-slate-950">
                  解放
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">
                Pitwall Pro（¥300/月）で5台フルグリッド対戦 ＆ 全マシン作戦カスタマイズを開放
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── Playback Controls & Lap Bar ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/90 p-4 rounded-2xl border border-white/15">
        {/* Play/Pause & Speed Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className={`px-4 py-2 rounded-xl text-xs font-racing font-bold shadow-lg transition-all flex items-center gap-1.5 ${
              isPlaying
                ? 'bg-amber-500 text-slate-950 shadow-amber-500/20'
                : 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-blue-500/30 hover:brightness-110'
            }`}
          >
            {isPlaying ? '⏸️ 一時停止' : '▶️ 仮想レース開始'}
          </button>

          <button
            type="button"
            onClick={() => {
              setIsPlaying(false);
              setCurrentLap(1);
            }}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono transition-colors"
            title="最初に戻す"
          >
            ⏮️
          </button>

          <div className="flex items-center bg-slate-950 rounded-xl border border-white/10 p-0.5 text-[10px] font-mono">
            {([1, 2, 5] as const).map((spd) => (
              <button
                key={spd}
                type="button"
                onClick={() => setPlaySpeed(spd)}
                className={`px-2 py-1 rounded-lg transition-all ${
                  playSpeed === spd ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>
        </div>

        {/* Lap Slider */}
        <div className="flex-1 flex items-center gap-3 font-mono text-xs">
          <span className="text-slate-400">周回:</span>
          <input
            type="range"
            min={1}
            max={maxLaps}
            value={currentLap}
            onChange={(e) => {
              setIsPlaying(false);
              setCurrentLap(Number(e.target.value));
            }}
            className="flex-1 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
          />
          <div className="w-20 text-right">
            <span className="font-racing font-bold text-amber-400 text-sm">Lap {currentLap}</span>
            <span className="text-slate-500 text-[10px]"> / {maxLaps}</span>
          </div>
        </div>
      </div>

      {/* ── Race Status Flag Alert ── */}
      {currentSnapshot && (
        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-white/10 text-xs font-mono">
          <div className="flex items-center gap-3">
            {currentSnapshot.isSC ? (
              <span className="px-3 py-1 rounded-lg bg-amber-500 text-slate-950 font-racing font-black text-xs flex items-center gap-1 animate-pulse">
                <span>🚨 SAFETY CAR DEPLOYED</span>
              </span>
            ) : currentSnapshot.isRain ? (
              <span className="px-3 py-1 rounded-lg bg-sky-500 text-slate-950 font-racing font-black text-xs flex items-center gap-1">
                <span>🌧️ WET TRACK (RAIN ACTIVE)</span>
              </span>
            ) : (
              <span className="px-3 py-1 rounded-lg bg-emerald-600 text-white font-racing font-bold text-xs flex items-center gap-1">
                <span>🟢 TRACK CLEAR (GREEN)</span>
              </span>
            )}
            <span className="text-slate-300 font-bold">首位: {currentSnapshot.leaderCode}</span>
          </div>

          {currentSnapshot.commentary && (
            <span className="text-amber-300 font-medium text-[11px] truncate max-w-md hidden md:inline">
              {currentSnapshot.commentary}
            </span>
          )}
        </div>
      )}

      {/* ── Live Leaderboard Tower (P1-P5) ── */}
      {currentSnapshot && (
        <div className="space-y-2">
          <div className="text-xs font-racing font-bold text-slate-400 tracking-wider uppercase">
            LIVE LEADERBOARD (LAP {currentLap} 走行順位)
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 font-mono">
            {currentSnapshot.cars.map((car) => (
              <div
                key={car.code}
                className={`p-3 rounded-xl border transition-all ${
                  car.position === 1
                    ? 'bg-amber-950/40 border-amber-400/80 shadow-lg shadow-amber-500/10'
                    : 'bg-slate-900/80 border-white/10'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-racing font-black text-slate-400">
                    P{car.position}
                  </span>
                  <span className="text-sm font-racing font-bold text-white">
                    {car.code}
                  </span>
                </div>

                <div className="space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-400">トップ差:</span>
                    <span className="font-bold text-white">
                      {car.gapToLeader === 0 ? 'LEADER' : `+${car.gapToLeader}s`}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-400">前走車差:</span>
                    <span className="text-slate-300">
                      {car.gapToAhead === 0 ? '-' : `+${car.gapToAhead}s`}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-white/5">
                    {getTyreBadge(car.tyreCompound)}
                    <span className="text-[10px] text-slate-400">L{car.tyreAge}</span>
                  </div>

                  {car.isPitting && (
                    <div className="text-[10px] font-racing font-bold text-amber-400 animate-pulse text-center bg-amber-500/10 rounded py-0.5 mt-1">
                      ⛽ PIT IN
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Gap-to-Leader Chart (Recharts) ── */}
      <div className="bg-slate-900/60 p-4 sm:p-5 rounded-2xl border border-white/10 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <div className="text-xs font-racing font-bold text-white uppercase tracking-wider">
              GAP TO LEADER CHART (全周回タイム差推移線図)
            </div>
            <div className="text-[10px] text-slate-400">
              各周回におけるトップとの秒差推移（ピットイン・SC・雨天での逆転劇を可視化）
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono">
            {activeDrivers.map((d) => (
              <span key={d.code} className="flex items-center gap-1 text-[11px]" style={{ color: d.color }}>
                <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: d.color }} />
                <span>{d.code}</span>
              </span>
            ))}
          </div>
        </div>

        <div className="w-full h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 15, right: 10, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis
                dataKey="lap"
                stroke="#64748b"
                tick={{ fontSize: 10, fill: '#64748b' }}
                tickFormatter={(l) => `L${l}`}
              />
              <YAxis
                domain={[0, 'dataMax + 5']}
                stroke="#64748b"
                tick={{ fontSize: 10, fill: '#64748b' }}
                tickFormatter={(s) => `+${s}s`}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const d = payload[0].payload;
                    return (
                      <div className="bg-slate-950/95 border border-white/20 p-2.5 rounded-xl text-xs font-mono space-y-1">
                        <div className="text-slate-400 font-bold">Lap {d.lap}</div>
                        {activeDrivers.map((drv) => (
                          <div key={drv.code} style={{ color: drv.color }}>
                            {drv.code}: +{d[drv.code]}s
                          </div>
                        ))}
                      </div>
                    );
                  }
                  return null;
                }}
              />

              {/* Current Lap Indicator */}
              <ReferenceLine x={currentLap} stroke="#ffffff" strokeWidth={2} label={{ value: `L${currentLap}`, fill: '#ffffff', fontSize: 10 }} />

              {/* SC Reference line */}
              {scEnabled && (
                <ReferenceLine x={scLap} stroke="#f59e0b" strokeDasharray="3 3" label={{ value: 'SC出動', fill: '#fbbf24', fontSize: 10 }} />
              )}

              {/* Rain Reference line */}
              {rainEnabled && (
                <ReferenceLine x={rainLap} stroke="#38bdf8" strokeDasharray="3 3" label={{ value: '降雨開始', fill: '#38bdf8', fontSize: 10 }} />
              )}

              {activeDrivers.map((d) => (
                <Line
                  key={d.code}
                  type="monotone"
                  dataKey={d.code}
                  stroke={d.color}
                  strokeWidth={2}
                  dot={false}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── AI Chief Strategist Debrief Section ── */}
      <div className="bg-gradient-to-br from-amber-950/30 to-slate-900/80 p-4 sm:p-5 rounded-2xl border border-amber-500/30 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
          <div>
            <div className="text-xs font-racing font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
              <span>🤖 AI チーフストラテジスト・戦術デブリーフ</span>
            </div>
            <div className="text-[11px] text-slate-400">
              Gemini AIがシミュレーション結果を工学的に解析し、勝敗のターニングポイントを総括
            </div>
          </div>

          <button
            type="button"
            disabled={loadingAiDebrief}
            onClick={handleGenerateAiDebrief}
            className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:brightness-110 text-slate-950 text-xs font-racing font-bold transition-all shadow-md flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            {loadingAiDebrief ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                <span>分析中...</span>
              </>
            ) : (
              <>
                <span>🧠 レース総括レポートを生成</span>
              </>
            )}
          </button>
        </div>

        {aiDebrief ? (
          <div className="p-4 rounded-xl bg-slate-950/80 border border-white/10 text-xs text-slate-200 leading-relaxed font-sans whitespace-pre-wrap animate-fadeIn">
            {aiDebrief}
          </div>
        ) : (
          <div className="text-center py-4 text-xs font-mono text-slate-500">
            「レース総括レポートを生成」をクリックすると、AIが勝因・タイヤ作戦の妙味を詳細解説します。
          </div>
        )}
      </div>
    </div>
  );
}
