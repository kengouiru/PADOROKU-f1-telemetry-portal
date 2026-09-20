'use client';

/**
 * components/telemetry/LiveTrackGpsRadar.tsx
 * 🏎️ Real-Time Circuit GPS Track Radar & Driver Motion Simulator
 *
 * Features:
 * - High-precision SVG circuit layout for all 24 Grand Prix tracks (Suzuka, Spa, Monaco, Jeddah, etc.).
 * - Dynamic auto-orientation: automatically rotates portrait tracks (like Jeddah/Melbourne) by 90° so they fill the widescreen canvas at maximum size.
 * - Dynamic bounding box calculation: eliminates wasted empty black margins and zooms in on the circuit.
 * - Minimum visual separation algorithm: guarantees all 22 cars are clearly visible with their 3-letter code and team livery color, even in 0.1s packs/trains.
 * - Localized HUD targeting reticle for the player (YOU) and teammate (TM) without orbital spinning artifacts.
 * - Real-time Turn & Sector detector (e.g. "📍 T7 ダンロップカーブ (Sector 2)").
 * - Pit Entry proximity gauge: remaining distance in meters & seconds to pit lane entrance.
 * - Pit Commitment Line alert (決断限界点) when approaching pit entry.
 * - Interactive 22-car running order bar: hover or click any driver to highlight them on the track.
 */

import React, { useMemo, useState, useEffect, useRef, useCallback } from 'react';
import {
  CIRCUIT_TRACK_MAPS,
  GENERIC_TRACK,
  interpolateTrackCoords,
  type CircuitTrackData,
  type CornerPin,
} from './TelemetryTrackMap';
import type { CarLapSimState } from '@/lib/raceSimulationEngine';
import {
  Navigation,
  AlertTriangle,
  Crosshair,
  ChevronRight,
  RotateCw,
  Users,
  Zap,
  Gauge,
  ShieldAlert,
} from 'lucide-react';

/**
 * Resolves simulation circuit ID to TelemetryTrackMap key
 */
export function resolveTrackMapKey(circuitId: string): string {
  const map: Record<string, string> = {
    melbourne: 'albert-park',
    bahrain: 'bahrain-international',
    monaco: 'circuit-de-monaco',
    barcelona: 'catalunya',
    spain: 'catalunya',
    austria: 'red-bull-ring',
    spielberg: 'red-bull-ring',
    britain: 'silverstone',
    hungary: 'hungaroring',
    belgium: 'spa',
    italy: 'monza',
    singapore: 'marina-bay',
    austin: 'cota',
    usa: 'cota',
    mexico: 'autodromo-hermanos-rodriguez',
    brazil: 'interlagos',
    sao_paulo: 'interlagos',
    abudhabi: 'yas-marina',
    netherlands: 'zandvoort',
    azerbaijan: 'baku',
    qatar: 'lusail',
  };
  return map[circuitId] || circuitId;
}

export interface LiveTrackGpsRadarProps {
  circuitId: string;
  circuitName: string;
  circuitLengthM?: number;
  baseLapTime?: number;
  cars: CarLapSimState[];
  playerCarCode: string;
  teammateCarCode: string;
  lapProgressPct: number; // 0 ~ 100% of current lap
  currentLap: number;
  totalLaps: number;
  isPlaying?: boolean;
  playbackSpeed?: number;
  isSC?: boolean;
  isScEnding?: boolean;
  isOvertakeActive?: boolean;
  showLeaderboard?: boolean;
  onMaximize?: () => void;
  className?: string;
}

export default function LiveTrackGpsRadar({
  circuitId,
  circuitName,
  circuitLengthM = 5400,
  baseLapTime = 90.0,
  cars,
  playerCarCode,
  teammateCarCode,
  lapProgressPct,
  currentLap,
  totalLaps,
  isPlaying = false,
  playbackSpeed = 1,
  isSC = false,
  isScEnding = false,
  isOvertakeActive = false,
  showLeaderboard = false,
  onMaximize,
  className = '',
}: LiveTrackGpsRadarProps) {
  const [hoveredCar, setHoveredCar] = useState<CarLapSimState | null>(null);
  const [selectedCarCode, setSelectedCarCode] = useState<string | null>(null);
  const [hoveredCorner, setHoveredCorner] = useState<CornerPin | null>(null);

  // Resolve track map data
  const trackData: CircuitTrackData = useMemo(() => {
    const key = resolveTrackMapKey(circuitId);
    return CIRCUIT_TRACK_MAPS[key] || GENERIC_TRACK;
  }, [circuitId]);

  // Compute raw bounding box of waypoints
  const rawBbox = useMemo(() => {
    const pts = trackData.waypoints;
    if (!pts || pts.length === 0) {
      return { minX: 50, maxX: 350, minY: 50, maxY: 250, width: 300, height: 200, cx: 200, cy: 150 };
    }
    let minX = 9999, maxX = -9999, minY = 9999, maxY = -9999;
    pts.forEach((p) => {
      if (p.x < minX) minX = p.x;
      if (p.x > maxX) maxX = p.x;
      if (p.y < minY) minY = p.y;
      if (p.y > maxY) maxY = p.y;
    });
    const width = maxX - minX;
    const height = maxY - minY;
    return {
      minX,
      maxX,
      minY,
      maxY,
      width,
      height,
      cx: (minX + maxX) / 2,
      cy: (minY + maxY) / 2,
    };
  }, [trackData.waypoints]);

  // Auto-detect if track is portrait/tall (like Jeddah: height 228 vs width 50)
  // Default to rotated if height > width * 1.15 to maximize screen area
  const isPortraitTrack = useMemo(() => {
    return rawBbox.height > rawBbox.width * 1.15;
  }, [rawBbox]);

  const [isRotated, setIsRotated] = useState<boolean>(() => isPortraitTrack);

  // Keep rotation in sync when circuitId changes
  const [prevCircuitId, setPrevCircuitId] = useState<string>(circuitId);
  if (circuitId !== prevCircuitId) {
    setPrevCircuitId(circuitId);
    setIsRotated(isPortraitTrack);
  }

  // Dynamic ViewBox: snug bounding box with minimal padding so track expands to fill SVG
  const dynamicViewBox = useMemo(() => {
    const pad = 14; // snug padding around track to maximize circuit scale
    if (isRotated) {
      // Rotated by -90° around (cx, cy):
      // new X span = old height, new Y span = old width
      const rotatedWidth = rawBbox.height;
      const rotatedHeight = rawBbox.width;
      const minX = rawBbox.cx - rotatedWidth / 2 - pad;
      const minY = rawBbox.cy - rotatedHeight / 2 - pad;
      const width = rotatedWidth + pad * 2;
      const height = rotatedHeight + pad * 2;
      return `${minX} ${minY} ${width} ${height}`;
    } else {
      const minX = rawBbox.minX - pad;
      const minY = rawBbox.minY - pad;
      const width = rawBbox.width + pad * 2;
      const height = rawBbox.height + pad * 2;
      return `${minX} ${minY} ${width} ${height}`;
    }
  }, [rawBbox, isRotated]);

  // Track SVG Path Ref for 100% mathematically exact path tracking via getPointAtLength
  const trackPathRef = useRef<SVGPathElement | null>(null);
  const [pathLength, setPathLength] = useState<number>(0);

  // Measure path length when SVG path is mounted / changes
  useEffect(() => {
    if (trackPathRef.current) {
      try {
        const len = trackPathRef.current.getTotalLength();
        if (len > 0) {
          setPathLength(len);
        }
      } catch {
        // fallback
      }
    }
  }, [trackData.svgPath]);

  // Exact point on SVG path (guarantees 100% accurate road following)
  const getExactTrackPoint = useCallback(
    (pct: number): { x: number; y: number } => {
      const clampedPct = Math.max(0, Math.min(100, pct));
      if (trackPathRef.current && pathLength > 0) {
        try {
          const targetDist = (clampedPct / 100) * pathLength;
          const pt = trackPathRef.current.getPointAtLength(targetDist);
          return { x: pt.x, y: pt.y };
        } catch {
          // fallback
        }
      }
      return interpolateTrackCoords(trackData.waypoints, clampedPct);
    },
    [trackData.waypoints, pathLength]
  );

  // Dedicated Pit Lane Geometry (parallel to main straight from 92% to 8%)
  const pitLaneGeometry = useMemo(() => {
    const pEntry = getExactTrackPoint(92.0);
    const pExit = getExactTrackPoint(8.0);
    const pMidRaw = trackData.startFinish;

    // Normal vector perpendicular to the main straight
    const dx = pExit.x - pEntry.x;
    const dy = pExit.y - pEntry.y;
    const len = Math.hypot(dx, dy) || 1;
    const nx = -dy / len;
    const ny = dx / len;

    // Offset direction away from track center
    const toCenterX = rawBbox.cx - pMidRaw.x;
    const toCenterY = rawBbox.cy - pMidRaw.y;
    const dot = nx * toCenterX + ny * toCenterY;
    const sign = dot < 0 ? 1 : -1;

    const offset = 14 * sign;
    const pEntryOffset = { x: pEntry.x + nx * 4 * sign, y: pEntry.y + ny * 4 * sign };
    const pMidOffset = { x: pMidRaw.x + nx * offset, y: pMidRaw.y + ny * offset };
    const pExitOffset = { x: pExit.x + nx * 4 * sign, y: pExit.y + ny * 4 * sign };

    const svgPath = `M ${pEntry.x} ${pEntry.y} Q ${pEntryOffset.x} ${pEntryOffset.y} ${pMidOffset.x} ${pMidOffset.y} Q ${pExitOffset.x} ${pExitOffset.y} ${pExit.x} ${pExit.y}`;

    // Quadratic Bézier curve interpolation along pit lane:
    // t = 0.0 -> pEntry, t = 0.5 -> pMidOffset (pit box), t = 1.0 -> pExit
    const getPitLanePoint = (t: number): { x: number; y: number } => {
      const clampedT = Math.max(0, Math.min(1, t));
      if (clampedT <= 0.5) {
        const u = clampedT / 0.5;
        const invU = 1 - u;
        return {
          x: invU * invU * pEntry.x + 2 * invU * u * pEntryOffset.x + u * u * pMidOffset.x,
          y: invU * invU * pEntry.y + 2 * invU * u * pEntryOffset.y + u * u * pMidOffset.y,
        };
      } else {
        const u = (clampedT - 0.5) / 0.5;
        const invU = 1 - u;
        return {
          x: invU * invU * pMidOffset.x + 2 * invU * u * pExitOffset.x + u * u * pExit.x,
          y: invU * invU * pMidOffset.y + 2 * invU * u * pExitOffset.y + u * u * pExit.y,
        };
      }
    };

    return {
      pEntry,
      pExit,
      pMid: pMidOffset,
      pEntryOffset,
      pExitOffset,
      getPitLanePoint,
      svgPath,
    };
  }, [getExactTrackPoint, trackData.startFinish, rawBbox]);

  // 60 FPS continuous animation loop for butter-smooth car movement along the circuit
  const [animatedPct, setAnimatedPct] = useState<number>(lapProgressPct);
  const lastTimeRef = useRef<number>(typeof performance !== 'undefined' ? performance.now() : 0);

  useEffect(() => {
    if (!isPlaying) {
      setAnimatedPct(lapProgressPct);
      return;
    }

    let animFrameId: number;
    const animate = (now: number) => {
      const dt = (now - lastTimeRef.current) / 1000;
      lastTimeRef.current = now;
      const speed = playbackSpeed || 1;
      // During Safety Car, lap time slows down by +42% (avg ~145 km/h)
      const effectiveBaseTime = isSC ? (baseLapTime || 90.0) * 1.42 : (baseLapTime || 90.0);
      const lapDurationSec = Math.max(2, effectiveBaseTime / speed);
      setAnimatedPct((prev) => {
        const next = prev + (dt / lapDurationSec) * 100;
        return next >= 100 ? next % 100 : next;
      });
      animFrameId = requestAnimationFrame(animate);
    };

    lastTimeRef.current = performance.now();
    animFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animFrameId);
  }, [isPlaying, playbackSpeed, baseLapTime, lapProgressPct, isSC]);

  // Leader's progress (0% ~ 100%) driven continuously at 60 FPS during playback
  const leaderPct = Math.max(0, Math.min(100, isPlaying ? animatedPct : lapProgressPct));

  // Compute positions for all cars with CUMULATIVE MINIMUM VISUAL DISPERSION algorithm
  // Uses exact SVG path tracking and dedicated pit lane placement!
  const carTrackPositions = useMemo(() => {
    if (!cars || cars.length === 0) return [];

    // Separate active and retired cars
    const activeCars = cars.filter((c) => !c.isRetired);
    const retiredCars = cars.filter((c) => !!c.isRetired);

    // Sort active cars by position (P1 to P22)
    const sorted = [...activeCars].sort((a, b) => a.position - b.position);

    const activeList = sorted.map((car, idx) => {
      const isPlayer = car.code === playerCarCode;
      const isTeammate = car.code === teammateCarCode;

      let carPct = 0;
      if (idx === 0 || car.position === 1) {
        carPct = leaderPct;
      } else {
        // Minimum visual separation: at least idx * 2.8% behind the leader
        // or their actual natural gap behind the leader, whichever is larger!
        const minRequiredBehind = idx * 2.8;
        const naturalBehind = (car.gapToLeader / Math.max(60, baseLapTime)) * 100;
        const actualBehind = Math.max(minRequiredBehind, naturalBehind);
        carPct = ((leaderPct - actualBehind) % 100 + 100) % 100;
      }

      // Normal track coordinate via 100% exact SVG path tracking
      let finalCoord = getExactTrackPoint(carPct);
      let isInPitLane = false;
      let isInPitBox = false;

      // Realistic Dynamic Pit Lane Transit & Service Motion:
      // When a car pits this lap, it traverses the track, turns into pit entry (92%),
      // travels through the pit lane, stops at pit box (start/finish), and exits at 8%.
      // This eliminates the bug where pitted cars remain frozen in the pit box.
      if (car.isPitting) {
        const pitOffset = (idx % 6 - 2.5) * 5;

        if (carPct >= 90.0 && carPct < 92.0) {
          // 1. Approaching & peeling off into pit entry
          const u = (carPct - 90.0) / 2.0;
          const trackPt = getExactTrackPoint(carPct);
          const pitPt = pitLaneGeometry.getPitLanePoint(0.0);
          finalCoord = {
            x: trackPt.x * (1 - u) + pitPt.x * u,
            y: trackPt.y * (1 - u) + pitPt.y * u,
          };
          isInPitLane = true;
        } else if (carPct >= 92.0) {
          // 2. First half of pit lane (Entry 92% -> Pit Box 100%)
          const t = ((carPct - 92.0) / 8.0) * 0.5; // 0.0 -> 0.5
          const pitPt = pitLaneGeometry.getPitLanePoint(t);
          const offsetFactor = Math.min(1, t / 0.4);
          finalCoord = {
            x: pitPt.x + pitOffset * offsetFactor,
            y: pitPt.y + pitOffset * 0.15 * offsetFactor,
          };
          isInPitLane = true;
          if (carPct >= 96.0) isInPitBox = true;
        } else if (carPct <= 8.0) {
          // 3. Second half of pit lane (Pit Box 0% -> Exit 8%)
          const t = 0.5 + (carPct / 8.0) * 0.5; // 0.5 -> 1.0
          const pitPt = pitLaneGeometry.getPitLanePoint(t);
          const offsetFactor = Math.max(0, 1 - (t - 0.5) / 0.4);
          finalCoord = {
            x: pitPt.x + pitOffset * offsetFactor,
            y: pitPt.y + pitOffset * 0.15 * offsetFactor,
          };
          isInPitLane = true;
          if (carPct <= 2.0) isInPitBox = true;
        } else if (carPct > 8.0 && carPct < 10.0) {
          // 4. Merging back from pit exit (8%) onto racing line (10%)
          const u = (carPct - 8.0) / 2.0;
          const pitPt = pitLaneGeometry.getPitLanePoint(1.0);
          const trackPt = getExactTrackPoint(carPct);
          finalCoord = {
            x: pitPt.x * (1 - u) + trackPt.x * u,
            y: pitPt.y * (1 - u) + trackPt.y * u,
          };
          isInPitLane = true;
        } else {
          // 5. On track driving normally before reaching pit entry
          finalCoord = getExactTrackPoint(carPct);
        }
      }

      return {
        car,
        pct: carPct,
        coord: finalCoord,
        isPlayer,
        isTeammate,
        isInPitLane,
        isInPitBox,
        isRetired: false,
      };
    });

    // Retired cars: park off-track near incident zone with hazard status
    // In real F1 broadcasts & GPS tracking, a retired car is shown at the incident site for 1-2 laps
    // while marshals and the recovery crane / SC are active. Once recovered behind barriers,
    // it is cleared from the active circuit radar (while remaining visible in the Timing Tower as DNF).
    const retiredList = retiredCars
      .filter((car) => {
        const retLap = car.retirementLap ?? currentLap;
        return currentLap <= retLap + 1;
      })
      .map((car, idx) => {
        const isPlayer = car.code === playerCarCode;
        const isTeammate = car.code === teammateCarCode;
        const parkPct = (45 + idx * 8) % 100;
        const baseCoord = getExactTrackPoint(parkPct);
        return {
          car,
          pct: parkPct,
          coord: { x: baseCoord.x + 12, y: baseCoord.y + 12 },
          isPlayer,
          isTeammate,
          isInPitLane: false,
          isInPitBox: false,
          isRetired: true,
        };
      });

    return [...activeList, ...retiredList];
  }, [cars, leaderPct, baseLapTime, getExactTrackPoint, pitLaneGeometry, playerCarCode, teammateCarCode, currentLap]);

  // Find player car position and progress
  const playerCarData = useMemo(() => {
    return carTrackPositions.find((c) => c.isPlayer) || carTrackPositions[0];
  }, [carTrackPositions]);

  const playerPct = playerCarData?.pct || leaderPct;

  // Real-time Current Turn & Sector Detector
  const currentTurnInfo = useMemo(() => {
    const pins = trackData.cornerPins;
    if (!pins || pins.length === 0) {
      return {
        name: 'メインストレート',
        turnNumber: 'S/F',
        sector: playerPct < 33.3 ? 1 : playerPct < 66.6 ? 2 : 3,
        nearestPin: null,
      };
    }

    let closestPin: CornerPin | null = null;
    let minDiff = 999;

    for (const pin of pins) {
      const diff = Math.abs(pin.pct - playerPct);
      if (diff < minDiff) {
        minDiff = diff;
        closestPin = pin;
      }
    }

    const sector = playerPct < 33.3 ? 1 : playerPct < 66.6 ? 2 : 3;

    if (closestPin && minDiff <= 7.0) {
      return {
        name: closestPin.name,
        turnNumber: closestPin.number,
        sector,
        nearestPin: closestPin,
      };
    }

    return {
      name: sector === 1 ? 'セクター1 高速区間' : sector === 2 ? 'セクター2 テクニカル区間' : 'セクター3 最終セクション',
      turnNumber: `S${sector}`,
      sector,
      nearestPin: null,
    };
  }, [trackData.cornerPins, playerPct]);



  // Active highlighted car (either hovered or clicked)
  const activeInspectCar = hoveredCar || (selectedCarCode ? cars.find((c) => c.code === selectedCarCode) : null);

  return (
    <div
      className={`glass-card-premium p-2 sm:p-2.5 rounded-xl space-y-1.5 relative overflow-hidden flex flex-col transition-all duration-300 ${
        isSC
          ? isScEnding
            ? 'border-2 border-emerald-400/90 shadow-[0_0_35px_rgba(16,185,129,0.35)]'
            : 'border-2 border-amber-400/90 shadow-[0_0_35px_rgba(245,158,11,0.35)]'
          : 'border border-white/10 shadow-xl'
      } ${className}`}
    >
      {/* Top Header: Title, Circuit, Turn & Sector, Rotation Toggle, Maximize */}
      <div className="flex flex-wrap items-center justify-between gap-1.5 pb-1.5 border-b border-white/10">
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-1">
            <Navigation className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-racing font-bold text-xs text-white tracking-wide">
              LIVE CIRCUIT GPS RADAR
            </span>
          </div>
          <span className="text-[9.5px] font-mono text-slate-400 hidden sm:inline">
            ({trackData.name})
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Active Turn & Sector Badge */}
          <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-lg bg-slate-900 border border-white/10 text-[10px] font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            <span className="font-racing font-bold text-cyan-300">
              {currentTurnInfo.turnNumber}
            </span>
            <span className="text-slate-300 text-[10.5px] truncate max-w-[120px] sm:max-w-[180px]">
              {currentTurnInfo.name}
            </span>
            <span className="px-1 py-0.2 rounded bg-slate-800 text-[8.5px] font-bold text-slate-400 ml-0.5">
              SEC {currentTurnInfo.sector}
            </span>
          </div>

          {/* Orientation Rotation Toggle */}
          <button
            type="button"
            onClick={() => setIsRotated(!isRotated)}
            className={`px-1.5 py-0.5 rounded-lg text-[9.5px] font-mono font-bold flex items-center gap-1 transition-all border ${
              isRotated
                ? 'bg-cyan-950 text-cyan-300 border-cyan-500/50 shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-white border-white/10'
            }`}
            title="コース向きを90度回転（横長画面に合わせて最大化拡大）"
          >
            <RotateCw className={`w-2.5 h-2.5 text-cyan-400 transition-transform ${isRotated ? 'rotate-90' : ''}`} />
            <span>{isRotated ? '画面最大化 (横)' : '真北基準 (縦)'}</span>
          </button>

          {onMaximize && (
            <button
              type="button"
              onClick={onMaximize}
              className="p-0.5 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="マップを全画面拡大フォーカス"
            >
              <Crosshair className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Safety Car Status Alert Banner (F1 Broadcast Realistic Graphic) */}
      {isSC && (
        <div
          className={`flex items-center justify-between px-2.5 py-1 rounded-lg border text-xs font-mono transition-all ${
            isScEnding
              ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-200 shadow-md shadow-emerald-950/40'
              : 'bg-amber-950/80 border-amber-500/50 text-amber-200 shadow-md shadow-amber-950/40'
          }`}
          title={
            isScEnding
              ? 'SAFETY CAR IN THIS LAP: リスタート準備・全車加速態勢'
              : 'SAFETY CAR DEPLOYED: 追越禁止・全車隊列走行・デルタタイム速度規制遵守'
          }
        >
          <div className="flex items-center gap-2 min-w-0">
            <span
              className={`px-1.5 py-0.5 rounded text-[10px] font-black tracking-wider shrink-0 ${
                isScEnding ? 'bg-emerald-500 text-black' : 'bg-amber-400 text-black'
              }`}
            >
              SC
            </span>
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="relative flex h-1.5 w-1.5 shrink-0">
                <span
                  className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                    isScEnding ? 'bg-emerald-400' : 'bg-amber-400'
                  }`}
                />
                <span
                  className={`relative inline-flex rounded-full h-1.5 w-1.5 ${
                    isScEnding ? 'bg-emerald-400' : 'bg-amber-400'
                  }`}
                />
              </span>
              <span className="text-[11px] font-bold tracking-wider uppercase truncate text-white">
                {isScEnding ? 'SAFETY CAR IN THIS LAP' : 'SAFETY CAR DEPLOYED'}
              </span>
            </div>
          </div>

          <span
            className={`text-[9px] font-mono font-bold tracking-wider px-1.5 py-0.5 rounded border shrink-0 ${
              isScEnding
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
            }`}
          >
            {isScEnding ? 'RESTART' : 'DELTA TIME'}
          </span>
        </div>
      )}



      {/* ── Main Cockpit Area: Integrated Left Leaderboard + Center Large SVG Circuit ── */}
      <div className={`flex flex-col lg:flex-row gap-2.5 items-stretch ${showLeaderboard ? 'min-h-[320px] sm:min-h-[360px] lg:min-h-[420px]' : ''}`}>
        {/* Left Leaderboard Tower (P1 to P22 + DNF) */}
        {showLeaderboard && (
          <div className="w-full lg:w-52 shrink-0 flex flex-col bg-slate-950/90 rounded-xl border border-white/10 p-2 overflow-hidden shadow-inner">
            <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-white/10 text-[10px] font-mono font-bold text-slate-400">
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3 text-cyan-400" />
                <span>順位 / DRIVER</span>
              </span>
              <span>GAP / 速度</span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-1 pr-1 scrollbar-thin max-h-[160px] sm:max-h-[220px] lg:max-h-[380px]">
              {carTrackPositions.map(({ car, isPlayer, isTeammate, isRetired }) => {
                const isSelected = activeInspectCar?.code === car.code;
                const displaySpeed =
                  car.currentSpeedKmH ||
                  Math.round((circuitLengthM / Math.max(60, car.lapTime || baseLapTime)) * 3.6);

                return (
                  <button
                    key={car.code}
                    type="button"
                    onClick={() => setSelectedCarCode(car.code === selectedCarCode ? null : car.code)}
                    onMouseEnter={() => setHoveredCar(car)}
                    onMouseLeave={() => setHoveredCar(null)}
                    className={`w-full px-2 py-1 rounded-lg text-left text-xs font-mono flex items-center justify-between transition-all border cursor-pointer ${
                      isRetired
                        ? 'bg-red-950/20 border-red-900/40 text-slate-500 opacity-60'
                        : isPlayer
                        ? isOvertakeActive
                          ? 'bg-purple-950/60 border-purple-500 text-purple-200 font-bold shadow-sm'
                          : 'bg-red-950/50 border-red-500/80 text-white font-bold shadow-sm'
                        : isTeammate
                        ? 'bg-emerald-950/40 border-emerald-500/60 text-emerald-200'
                        : isSelected
                        ? 'bg-sky-950/60 border-sky-400 text-sky-200 font-bold'
                        : 'bg-slate-900/60 border-white/5 text-slate-300 hover:bg-slate-800/80 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span
                        className={`w-5 text-[11px] font-racing font-bold shrink-0 ${
                          isRetired ? 'text-red-400' : 'text-slate-400'
                        }`}
                      >
                        {isRetired ? 'DNF' : `P${car.position}`}
                      </span>
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: isRetired ? '#64748b' : car.color }}
                      />
                      <span className="font-bold text-[11px] truncate">{car.code}</span>
                      {isPlayer && (
                        <span
                          className={`px-1 py-0.2 rounded text-[8px] font-black ${
                            isOvertakeActive ? 'bg-purple-600 text-white' : 'bg-red-600 text-white'
                          }`}
                        >
                          {isOvertakeActive ? 'YOU⚡OT' : 'YOU'}
                        </span>
                      )}
                      {isTeammate && !isPlayer && (
                        <span className="px-1 py-0.2 rounded bg-emerald-700 text-white text-[8px] font-black">
                          TM
                        </span>
                      )}
                      {car.isPitting && (
                        <span className="px-1 py-0.2 rounded bg-amber-500 text-slate-950 text-[8px] font-black animate-pulse">
                          PIT
                        </span>
                      )}
                    </div>

                    <div className="text-right shrink-0">
                      {isRetired ? (
                        <span className="text-[9px] text-red-400 font-bold">リタイア</span>
                      ) : (
                        <div className="flex flex-col items-end leading-none">
                          <span className="text-[10px] text-slate-300 font-bold">
                            {car.position === 1 ? 'LEAD' : `+${car.gapToLeader.toFixed(1)}s`}
                          </span>
                          <span className="text-[9px] text-slate-400">{displaySpeed} km/h</span>
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* SVG Circuit Canvas with Moving Drivers (Expanded view with minimal padding) */}
        <div className="flex-1 relative aspect-[16/10] sm:aspect-[16/9] min-h-[240px] sm:min-h-[285px] max-h-[390px] flex items-center justify-center overflow-hidden bg-slate-950/80 rounded-xl border border-white/5">
          <svg
            viewBox={dynamicViewBox}
            className="w-full h-full filter drop-shadow-[0_0_15px_rgba(6,182,212,0.12)]"
          >
            <defs>
              {/* Glow Filters */}
              <filter id="glow-player" x="-50%" y="-50%" width="200%" height="200%">
                <feDropShadow dx="0" dy="0" stdDeviation="2.5" floodColor="#ef4444" />
              </filter>
              <filter id="glow-tm" x="-50%" y="-50%" width="200%" height="200%">
                <feDropShadow dx="0" dy="0" stdDeviation="2" floodColor="#10b981" />
              </filter>
              <filter id="glow-pit-entry" x="-50%" y="-50%" width="200%" height="200%">
                <feDropShadow dx="0" dy="0" stdDeviation="2" floodColor="#f59e0b" />
              </filter>
              <filter id="glow-car-focus" x="-50%" y="-50%" width="200%" height="200%">
                <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#38bdf8" />
              </filter>
              <linearGradient id="liveTrackGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.8" />
              </linearGradient>
            </defs>

            {/* Master Circuit Group (Rotated if portrait) */}
            <g transform={isRotated ? `rotate(-90 ${rawBbox.cx} ${rawBbox.cy})` : undefined}>
              {/* Track Underlay Road Shadow */}
              <path
                d={trackData.svgPath}
                fill="none"
                stroke="#090d16"
                strokeWidth="14"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Track Asphalt Surface */}
              <path
                d={trackData.svgPath}
                fill="none"
                stroke="#1e293b"
                strokeWidth="8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Luminous Racing Line (Attached ref for 100% exact getPointAtLength tracking) */}
              <path
                ref={trackPathRef}
                d={trackData.svgPath}
                fill="none"
                stroke="url(#liveTrackGrad)"
                strokeWidth="2.4"
                strokeDasharray="4 2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="opacity-85"
              />

              {/* Start / Finish Line */}
              <g transform={`translate(${trackData.startFinish.x}, ${trackData.startFinish.y})`}>
                <circle cx={0} cy={0} r="3.2" fill="#ffffff" stroke="#10b981" strokeWidth="1.5" />
                <g transform={isRotated ? 'rotate(90)' : undefined}>
                  <text
                    x={5}
                    y={2.5}
                    fontSize="5.5"
                    fontFamily="monospace"
                    fill="#10b981"
                    fontWeight="bold"
                  >
                    S/F
                  </text>
                </g>
              </g>

              {/* Dedicated Pit Lane */}
              <path
                d={pitLaneGeometry.svgPath}
                fill="none"
                stroke="#334155"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d={pitLaneGeometry.svgPath}
                fill="none"
                stroke="#f59e0b"
                strokeWidth="1.0"
                strokeDasharray="3 2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="opacity-80"
              />

              {/* Pit Box Stop Area */}
              <g transform={`translate(${pitLaneGeometry.pMid.x}, ${pitLaneGeometry.pMid.y})`}>
                <rect
                  x="-6"
                  y="-6"
                  width="12"
                  height="12"
                  rx="2.5"
                  fill="#0f172a"
                  stroke="#f59e0b"
                  strokeWidth="1.2"
                />
                <g transform={isRotated ? 'rotate(90)' : undefined}>
                  <text
                    x="0"
                    y="2"
                    textAnchor="middle"
                    fontSize="4.5"
                    fontFamily="monospace"
                    fontWeight="black"
                    fill="#f59e0b"
                  >
                    BOX
                  </text>
                </g>
              </g>

              {/* Pit Entry Indicator (~92% on track) */}
              {(() => {
                const pitCoord = getExactTrackPoint(92.0);
                return (
                  <g
                    className="cursor-pointer"
                    filter="url(#glow-pit-entry)"
                    transform={`translate(${pitCoord.x}, ${pitCoord.y})`}
                  >
                    <title>ピットレーン入口 (PIT ENTRY)</title>
                    <circle cx={0} cy={0} r="3" fill="#f59e0b" stroke="#ffffff" strokeWidth="1.0" />
                    <g transform={isRotated ? 'rotate(90)' : undefined}>
                      <text
                        x={-5}
                        y={-5}
                        fontSize="5"
                        fontFamily="monospace"
                        fill="#f59e0b"
                        fontWeight="bold"
                        textAnchor="end"
                      >
                        PIT IN
                      </text>
                    </g>
                  </g>
                );
              })()}

              {/* Corner Pins with turn numbers */}
              {trackData.cornerPins.map((corner) => {
                const isNearPlayer = currentTurnInfo.nearestPin?.number === corner.number;
                return (
                  <g
                    key={corner.number}
                    className="cursor-pointer select-none"
                    transform={`translate(${corner.x}, ${corner.y})`}
                    onMouseEnter={() => setHoveredCorner(corner)}
                    onMouseLeave={() => setHoveredCorner(null)}
                  >
                    <circle
                      cx={0}
                      cy={0}
                      r={isNearPlayer ? 5.5 : 4.0}
                      fill={isNearPlayer ? '#0284c7' : '#0f172a'}
                      stroke={isNearPlayer ? '#38bdf8' : '#475569'}
                      strokeWidth={isNearPlayer ? 1.5 : 0.8}
                      className="transition-all duration-300"
                    />
                    <g transform={isRotated ? 'rotate(90)' : undefined}>
                      <text
                        x={0}
                        y={1.6}
                        textAnchor="middle"
                        fontSize={isNearPlayer ? 5 : 4}
                        fontWeight="bold"
                        fontFamily="sans-serif"
                        fill={isNearPlayer ? '#ffffff' : '#94a3b8'}
                      >
                        {corner.number}
                      </text>
                    </g>
                    <title>{`${corner.number}: ${corner.name} (${corner.pct}%)`}</title>
                  </g>
                );
              })}

              {/* Lead Safety Car (leads pack ahead of P1 during SC) */}
              {isSC && (() => {
                const scPct = (leaderPct + 2.5) % 100;
                const scCoord = getExactTrackPoint(scPct);
                return (
                  <g
                    transform={`translate(${scCoord.x}, ${scCoord.y})`}
                    className="cursor-pointer select-none"
                  >
                    <circle
                      cx={0}
                      cy={0}
                      r={5.5}
                      fill="#ca8a04"
                      stroke="#ffffff"
                      strokeWidth="1.4"
                      className="animate-pulse"
                    />
                    <g transform={isRotated ? 'rotate(90)' : undefined}>
                      <rect
                        x="-8"
                        y="-11"
                        width="16"
                        height="8"
                        rx="2"
                        fill="#78350f"
                        stroke="#fef08a"
                        strokeWidth="0.8"
                      />
                      <text
                        x="0"
                        y="-5.5"
                        textAnchor="middle"
                        fontSize="4.5"
                        fontFamily="monospace"
                        fontWeight="black"
                        fill="#fef08a"
                      >
                        {isScEnding ? 'SC IN' : 'SC'}
                      </text>
                    </g>
                    <title>{isScEnding ? 'SAFETY CAR IN THIS LAP' : 'OFFICIAL FIA SAFETY CAR'}</title>
                  </g>
                );
              })()}

              {/* ── Driver Moving Dots (ALL 22 CARS) - Refined Compact Proportions ── */}
              {carTrackPositions.map(({ car, coord, isPlayer, isTeammate, isInPitLane, isInPitBox, isRetired }) => {
                const isInspected = activeInspectCar?.code === car.code;
                const dotRadius = isPlayer ? 4.8 : isTeammate ? 4.2 : 3.6;

                return (
                  <g
                    key={car.code}
                    className="cursor-pointer"
                    transform={`translate(${coord.x}, ${coord.y})`}
                    onMouseEnter={() => setHoveredCar(car)}
                    onMouseLeave={() => setHoveredCar(null)}
                    onClick={() => setSelectedCarCode(car.code === selectedCarCode ? null : car.code)}
                  >
                    {/* Player Car Reticle (YOU) - Fixed HUD Crosshair */}
                    {isPlayer && (
                      <g filter="url(#glow-player)">
                        <circle
                          cx={0}
                          cy={0}
                          r={8.5}
                          fill="none"
                          stroke={isOvertakeActive ? '#a855f7' : '#ef4444'}
                          strokeWidth={isOvertakeActive ? 2 : 1.5}
                          className="animate-pulse"
                        />
                        {/* 4 Corner Crosshair Ticks */}
                        <line
                          x1={-11}
                          y1={0}
                          x2={-8}
                          y2={0}
                          stroke={isOvertakeActive ? '#a855f7' : '#ef4444'}
                          strokeWidth="1.2"
                        />
                        <line
                          x1={8}
                          y1={0}
                          x2={11}
                          y2={0}
                          stroke={isOvertakeActive ? '#a855f7' : '#ef4444'}
                          strokeWidth="1.2"
                        />
                        <line
                          x1={0}
                          y1={-11}
                          x2={0}
                          y2={-8}
                          stroke={isOvertakeActive ? '#a855f7' : '#ef4444'}
                          strokeWidth="1.2"
                        />
                        <line
                          x1={0}
                          y1={8}
                          x2={0}
                          y2={11}
                          stroke={isOvertakeActive ? '#a855f7' : '#ef4444'}
                          strokeWidth="1.2"
                        />
                      </g>
                    )}

                    {/* Teammate Car Reticle (TM) */}
                    {isTeammate && !isPlayer && (
                      <circle
                        cx={0}
                        cy={0}
                        r={6.8}
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="1.2"
                        filter="url(#glow-tm)"
                      />
                    )}

                    {/* Inspected Car Focus Ring */}
                    {isInspected && !isPlayer && (
                      <circle
                        cx={0}
                        cy={0}
                        r={7.5}
                        fill="none"
                        stroke="#38bdf8"
                        strokeWidth="1.5"
                        filter="url(#glow-car-focus)"
                        className="animate-pulse"
                      />
                    )}

                    {/* Retired Car Hazard Ring */}
                    {isRetired && (
                      <circle
                        cx={0}
                        cy={0}
                        r={6.5}
                        fill="none"
                        stroke="#ef4444"
                        strokeWidth="1.2"
                        className="animate-pulse"
                      />
                    )}

                    {/* Main Driver Colored Circle (Clean Solid Ring) */}
                    <circle
                      cx={0}
                      cy={0}
                      r={isInspected ? dotRadius + 1.2 : dotRadius}
                      fill={isRetired ? '#475569' : car.color}
                      stroke={
                        isPlayer
                          ? isOvertakeActive
                            ? '#d8b4fe'
                            : '#ffffff'
                          : '#ffffff'
                      }
                      strokeWidth={isPlayer ? (isOvertakeActive ? 2 : 1.6) : 1.0}
                      className="transition-all duration-200 shadow-md"
                    />

                    {/* Pitting Amber Halo Ring */}
                    {car.isPitting && (
                      <circle
                        cx={0}
                        cy={0}
                        r={dotRadius + 2.4}
                        fill="none"
                        stroke="#f59e0b"
                        strokeWidth="1.4"
                        className="animate-pulse"
                      />
                    )}

                    {/* Text Badge Group (Counter-rotated so text stays horizontal) */}
                    <g transform={isRotated ? 'rotate(90)' : undefined}>
                      {isRetired ? (
                        <g transform="translate(0, -8)">
                          <rect
                            x="-10"
                            y="-4"
                            width="20"
                            height="8"
                            rx="2"
                            fill="#7f1d1d"
                            stroke="#ef4444"
                            strokeWidth="0.8"
                          />
                          <text
                            x="0"
                            y="2"
                            textAnchor="middle"
                            fontSize="4.8"
                            fontFamily="monospace"
                            fontWeight="black"
                            fill="#ffffff"
                          >
                            DNF
                          </text>
                        </g>
                      ) : isPlayer ? (
                        <g transform="translate(0, -9)">
                          <rect
                            x={isOvertakeActive ? '-14' : '-11'}
                            y="-4.5"
                            width={isOvertakeActive ? '28' : '22'}
                            height="9"
                            rx="2.5"
                            fill={isOvertakeActive ? '#6b21a8' : '#dc2626'}
                            stroke={isOvertakeActive ? '#d8b4fe' : '#ffffff'}
                            strokeWidth="0.8"
                            className="shadow-md"
                          />
                          <text
                            x="0"
                            y="2"
                            textAnchor="middle"
                            fontSize={isOvertakeActive ? '5' : '5.5'}
                            fontFamily="monospace"
                            fontWeight="black"
                            fill="#ffffff"
                          >
                            {isOvertakeActive ? 'YOU⚡OT' : 'YOU'}
                          </text>
                        </g>
                      ) : isTeammate ? (
                        <g transform="translate(0, -8)">
                          <rect
                            x="-9"
                            y="-4"
                            width="18"
                            height="8"
                            rx="2"
                            fill="#059669"
                            stroke="#ffffff"
                            strokeWidth="0.7"
                            className="shadow-md"
                          />
                          <text
                            x="0"
                            y="1.8"
                            textAnchor="middle"
                            fontSize="4.5"
                            fontFamily="monospace"
                            fontWeight="bold"
                            fill="#ffffff"
                          >
                            TM
                          </text>
                        </g>
                      ) : car.position === 1 ? (
                        <g transform="translate(0, -7.5)">
                          <rect
                            x="-8"
                            y="-3.5"
                            width="16"
                            height="7.5"
                            rx="2"
                            fill="#0f172a"
                            stroke={car.isPitting ? '#f59e0b' : '#eab308'}
                            strokeWidth={car.isPitting ? 1.0 : 0.8}
                          />
                          <text
                            x="0"
                            y="1.8"
                            textAnchor="middle"
                            fontSize="4.5"
                            fontFamily="monospace"
                            fontWeight="black"
                            fill={car.isPitting ? '#f59e0b' : '#eab308'}
                          >
                            P1
                          </text>
                        </g>
                      ) : (
                        <g transform="translate(0, -7)">
                          <rect
                            x="-8"
                            y="-3.5"
                            width="16"
                            height="7"
                            rx="2"
                            fill="#020617"
                            stroke={car.isPitting ? '#f59e0b' : car.color}
                            strokeWidth={car.isPitting ? 1.0 : 0.7}
                            opacity="0.92"
                          />
                          <text
                            x="0"
                            y="1.6"
                            textAnchor="middle"
                            fontSize="4.2"
                            fontFamily="monospace"
                            fontWeight="bold"
                            fill={car.isPitting ? '#f59e0b' : '#ffffff'}
                          >
                            {car.code}
                          </text>
                        </g>
                      )}

                      {/* Pit Stop Servicing Indicator on Track */}
                      {isInPitBox && (
                        <g transform="translate(0, 9.5)">
                          <rect
                            x="-11"
                            y="-3.5"
                            width="22"
                            height="7"
                            rx="2"
                            fill="#f59e0b"
                            stroke="#ffffff"
                            strokeWidth="0.8"
                            className="shadow-md"
                          />
                          <text
                            x="0"
                            y="1.6"
                            textAnchor="middle"
                            fontSize="3.8"
                            fontFamily="monospace"
                            fontWeight="black"
                            fill="#020617"
                          >
                            {car.pitStopDuration ? `STOP ${car.pitStopDuration}s` : 'PIT STOP'}
                          </text>
                        </g>
                      )}
                    </g>

                    {/* SVG Native Tooltip */}
                    <title>{`${
                      isRetired
                        ? `DNF | ${car.name} (${car.code}) - ${car.retirementReason || 'リタイア'}`
                        : `P${car.position} | ${car.name} (${car.code}) - ${car.team} - ${car.tyreCompound} (${car.tyreAge}L) - GAP: +${car.gapToLeader.toFixed(1)}s`
                    }`}</title>
                  </g>
                );
              })}
            </g>
          </svg>

          {/* Floating Legend / Quick Status at bottom-left */}
          <div className="absolute bottom-1.5 left-1.5 bg-slate-950/90 backdrop-blur-md rounded px-1.5 py-0.5 border border-white/10 flex items-center gap-1.5 text-[9px] font-mono shadow-md">
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
              <span className="text-white font-bold">YOU ({playerCarCode})</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="text-slate-300 font-bold">TM ({teammateCarCode})</span>
            </div>
            {isSC && (
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                <span className="text-amber-300 font-bold">SC</span>
              </div>
            )}
          </div>

          {/* Floating Hovered/Selected Driver Inspection Card at bottom-right */}
          {activeInspectCar && (
            <div className="absolute bottom-1.5 right-1.5 bg-slate-900/95 backdrop-blur-md rounded-lg px-2 py-1 border border-white/15 text-[11px] font-mono shadow-xl flex items-center gap-1.5 animate-in fade-in duration-150">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: activeInspectCar.color }} />
              <span className="font-racing font-bold text-white text-xs">
                {activeInspectCar.isRetired ? 'DNF' : `P${activeInspectCar.position}`} {activeInspectCar.code}
              </span>
              <span className="text-slate-400 text-[10px]">
                {activeInspectCar.isRetired
                  ? activeInspectCar.retirementReason || 'リタイア'
                  : activeInspectCar.position === 1
                  ? 'LEAD'
                  : `+${activeInspectCar.gapToLeader.toFixed(1)}s`}
              </span>
              {!activeInspectCar.isRetired && (
                <>
                  <span className="px-1 py-0.2 rounded bg-slate-800 text-amber-300 font-bold text-[9px]">
                    {activeInspectCar.tyreCompound} ({activeInspectCar.tyreAge}L)
                  </span>
                  <span className="text-cyan-300 font-bold text-[9px]">
                    {activeInspectCar.currentSpeedKmH || 220} km/h
                  </span>
                </>
              )}
              {activeInspectCar.isPitting && (
                <span className="px-1 py-0.2 rounded bg-amber-500 text-slate-950 font-bold text-[8px] animate-pulse">
                  PIT
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Interactive 22-Car Running Order Strip (Click or hover any car to highlight!) ── */}
      <div className="space-y-0.5">
        <div className="flex justify-between items-center text-[9px] font-mono text-slate-400">
          <span className="flex items-center gap-1">
            <Users className="w-2.5 h-2.5 text-cyan-400" />
            <span>全出走グリッド動態一覧 (クリックでマップ上フォーカス):</span>
          </span>
          <span className="text-slate-400 text-[8.5px]">
            {cars.filter((c) => !c.isRetired).length} 台走行中
          </span>
        </div>

        <div className="flex items-center gap-1 overflow-x-auto pb-0.5 scrollbar-thin">
          {carTrackPositions.map(({ car, isPlayer, isTeammate }) => {
            const isSelected = activeInspectCar?.code === car.code;
            return (
              <button
                key={car.code}
                type="button"
                onClick={() => setSelectedCarCode(car.code === selectedCarCode ? null : car.code)}
                onMouseEnter={() => setHoveredCar(car)}
                onMouseLeave={() => setHoveredCar(null)}
                className={`px-1.5 py-0.2 rounded text-[9px] font-mono shrink-0 flex items-center gap-1 border transition-all cursor-pointer ${
                  isPlayer
                    ? 'bg-red-950/80 border-red-500 text-white font-bold shadow-sm'
                    : isTeammate
                    ? 'bg-emerald-950/80 border-emerald-500 text-white font-bold shadow-sm'
                    : isSelected
                    ? 'bg-sky-950 border-sky-400 text-sky-200 font-bold shadow-sm'
                    : 'bg-slate-900/90 border-white/5 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: car.color }} />
                <span className="font-racing font-bold text-[8.5px]">P{car.position}</span>
                <span className="font-bold">{car.code}</span>
                {car.isPitting && (
                  <span className="px-0.5 rounded bg-amber-500 text-slate-950 text-[7px] font-black">PIT</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Track Progress Ribbon (0% to 100%) */}
      <div className="space-y-0.5">
        <div className="flex justify-between items-center text-[9px] font-mono text-slate-400">
          <span className="flex items-center gap-1">
            <span>START</span>
            <ChevronRight className="w-2 h-2 text-slate-600" />
            <span className={playerPct < 33.3 ? 'text-cyan-300 font-bold' : ''}>S1</span>
            <ChevronRight className="w-2 h-2 text-slate-600" />
            <span className={playerPct >= 33.3 && playerPct < 66.6 ? 'text-cyan-300 font-bold' : ''}>S2</span>
            <ChevronRight className="w-2 h-2 text-slate-600" />
            <span className={playerPct >= 66.6 ? 'text-cyan-300 font-bold' : ''}>S3</span>
          </span>
          <span className="font-bold text-slate-300">
            周回進捗: <span className="text-cyan-300">{Math.round(playerPct)}%</span> (LAP {currentLap}/{totalLaps})
          </span>
        </div>

        {/* Progress bar track */}
        <div className="relative w-full h-1.5 rounded-full bg-slate-900 border border-white/10 overflow-visible">
          {/* Sector 1, 2, 3 separators */}
          <div className="absolute top-0 bottom-0 left-[33.3%] w-px bg-white/20 z-0" />
          <div className="absolute top-0 bottom-0 left-[66.6%] w-px bg-white/20 z-0" />

          {/* Pit entry marker (~93%) */}
          <div
            className="absolute top-0 bottom-0 left-[93%] w-1 bg-amber-400 z-10"
            title="ピットレーン入口 (93%)"
          />

          {/* Progress fill */}
          <div
            className="h-full rounded-full bg-gradient-to-r from-sky-500 via-cyan-400 to-blue-600 transition-all duration-300"
            style={{ width: `${playerPct}%` }}
          />

          {/* Moving Player Needle */}
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-red-600 border-2 border-white shadow-md z-20 transition-all duration-300"
            style={{ left: `${playerPct}%` }}
          >
            <div className="w-0.5 h-0.5 rounded-full bg-white mx-auto mt-0.5" />
          </div>
        </div>
      </div>
    </div>
  );
}
