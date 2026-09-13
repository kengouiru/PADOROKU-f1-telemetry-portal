'use client';

/**
 * components/circuits/F1BroadcastTrackGuide.tsx
 * 🎬 Formula 1 Official Broadcast Track Guide with True 3D Elevation Geometry
 * 
 * Major Upgrades:
 * 1. True 3D Circuit Geometry (Z-axis elevation lift):
 *    - Each waypoint is projected with its real-world physical elevation altitude.
 *    - High points physically rise up into the 3D air; low points dip down.
 * 2. 3D Elevation Curtain / Wall (立体標高ウォール):
 *    - Translucent gradient extrusion connecting the elevated track ribbon down to ground datum.
 * 3. On-Model 3D Floating Elevation Pins:
 *    - Peak altitude (🏔️ 最高地点 +102m), Lowest altitude (🌊 最低地点), and Max Gradient (📈 最大勾配)
 *      floating directly above the corners on the circuit model itself with vertical guide lines!
 * 4. Elevation Heatmap vs Sector Color Mode:
 *    - Toggle between official Sector colors (Gold/Cyan/Pink) and Elevation Gradient (Deep Blue -> Cyan -> Amber -> Crimson).
 * 5. Smooth 60fps Mouse & Touch Drag-to-Rotate with 2D / 3D Broadcast Angle presets.
 * 6. De-cluttered bottom Elevation Cross-Section HUD.
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  getBroadcastTrackData,
  type BroadcastTrackInfo,
  type ActiveAeroZone,
  type OvertakeCheckpoint
} from '@/data/f1BroadcastTrackData';
import {
  CIRCUIT_TRACK_MAPS,
  type CircuitTrackData
} from '@/components/telemetry/TelemetryTrackMap';

interface F1BroadcastTrackGuideProps {
  circuitId: string;
  gpName?: string;
  round?: number;
  className?: string;
}

// Official F1 Sector Colors
const SECTOR_COLORS = {
  s1: '#eab308', // Gold
  s2: '#06b6d4', // Cyan
  s3: '#ec4899', // Magenta
};

// Helper: interpolate color along elevation ratio (0.0 to 1.0)
function getElevationColor(hNorm: number): string {
  if (hNorm < 0.25) {
    return '#38bdf8'; // Blue / Cyan
  } else if (hNorm < 0.5) {
    return '#34d399'; // Emerald
  } else if (hNorm < 0.75) {
    return '#fbbf24'; // Amber / Yellow
  } else {
    return '#f43f5e'; // Rose / Crimson
  }
}

export default function F1BroadcastTrackGuide({
  circuitId,
  gpName,
  round,
  className = ''
}: F1BroadcastTrackGuideProps) {
  // Track Metadata (Elevation, Sectors, 2026 Aero, MOM)
  const trackInfo = useMemo(() => getBroadcastTrackData(circuitId), [circuitId]);

  // Base 2D Coordinates & Waypoints
  const mapData = useMemo<CircuitTrackData>(() => {
    if (CIRCUIT_TRACK_MAPS[circuitId]) {
      return CIRCUIT_TRACK_MAPS[circuitId];
    }
    if (trackInfo.customPath && trackInfo.customWaypoints) {
      return {
        name: trackInfo.officialName,
        svgPath: trackInfo.customPath,
        startFinish: { x: trackInfo.customWaypoints[0]?.x ?? 200, y: trackInfo.customWaypoints[0]?.y ?? 150 },
        cornerPins: [],
        waypoints: trackInfo.customWaypoints
      };
    }
    return CIRCUIT_TRACK_MAPS['suzuka'] || {
      name: 'Grand Prix Circuit',
      svgPath: 'M 100 150 L 300 150 L 250 250 L 120 230 Z',
      startFinish: { x: 100, y: 150 },
      cornerPins: [],
      waypoints: [
        { pct: 0, x: 100, y: 150 },
        { pct: 33, x: 300, y: 150 },
        { pct: 66, x: 250, y: 250 },
        { pct: 100, x: 100, y: 150 }
      ]
    };
  }, [circuitId, trackInfo]);

  // 3D Camera Angles
  const [rotX, setRotX] = useState<number>(54); // Pitch tilt (15° ~ 75°)
  const [rotZ, setRotZ] = useState<number>(-20); // Yaw rotation (-180° ~ 180°)
  const [zoom, setZoom] = useState<number>(1.0); // 0.85 ~ 1.4
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragStartRef = useRef<{ x: number; y: number; rotX: number; rotZ: number }>({
    x: 0,
    y: 0,
    rotX: 54,
    rotZ: -20
  });

  // Layer & Visual Display Modes
  const [colorMode, setColorMode] = useState<'sector' | 'elevation'>('elevation');
  const [showElevationWall, setShowElevationWall] = useState<boolean>(true);
  const [showElevationPins, setShowElevationPins] = useState<boolean>(true);
  const [showActiveAero, setShowActiveAero] = useState<boolean>(true);
  const [showOvertakeMOM, setShowOvertakeMOM] = useState<boolean>(true);
  const [showCornerPins, setShowCornerPins] = useState<boolean>(true);

  // Hovered corner / waypoint tooltip
  const [hoveredPoint, setHoveredPoint] = useState<{
    x: number;
    y: number;
    label: string;
    elevM: number;
    pct: number;
  } | null>(null);

  // Live Run Simulation
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<1 | 2>(1);
  const [carProgress, setCarProgress] = useState<number>(0); // 0 ~ 100%
  const animFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  // Camera preset handlers
  const applyPreset = (mode: '2d' | '3d' | 'reset') => {
    if (mode === '2d') {
      setRotX(0);
      setRotZ(0);
      setZoom(1.0);
    } else if (mode === '3d') {
      setRotX(54);
      setRotZ(-22);
      setZoom(1.05);
    } else {
      setRotX(54);
      setRotZ(-20);
      setZoom(1.0);
    }
  };

  // Drag interaction handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      rotX,
      rotZ
    };
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;

    const newRotZ = Math.round(dragStartRef.current.rotZ + dx * 0.45);
    const newRotX = Math.min(78, Math.max(10, Math.round(dragStartRef.current.rotX - dy * 0.35)));

    setRotZ(newRotZ);
    setRotX(newRotX);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isDragging) {
      setIsDragging(false);
      try {
        (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
      } catch {
        // Ignored
      }
    }
  };

  // Mouse Wheel Zoom
  const handleWheel = (e: React.WheelEvent) => {
    // Zoom in/out with mouse wheel scroll
    const delta = e.deltaY < 0 ? 0.12 : -0.12;
    setZoom((z) => Math.min(2.5, Math.max(0.6, Number((z + delta).toFixed(2)))));
  };

  // Touch Pinch-to-Zoom
  const touchDistanceRef = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      touchDistanceRef.current = Math.hypot(dx, dy);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && touchDistanceRef.current !== null) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const currentDist = Math.hypot(dx, dy);
      const diff = (currentDist - touchDistanceRef.current) * 0.006;
      touchDistanceRef.current = currentDist;
      setZoom((z) => Math.min(2.5, Math.max(0.6, Number((z + diff).toFixed(2)))));
    }
  };

  const handleTouchEnd = () => {
    touchDistanceRef.current = null;
  };

  // ──────────────────────────────────────────────────────────────────────────
  // 3D PROJECTION MATHEMATICS WITH VERTICAL ELEVATION LIFT
  // ──────────────────────────────────────────────────────────────────────────
  const projected3D = useMemo(() => {
    const rawWaypoints = mapData.waypoints;
    if (!rawWaypoints || rawWaypoints.length === 0) return null;

    const cx = 250;
    const cy = 185;
    const radX = (rotX * Math.PI) / 180;
    const radZ = (rotZ * Math.PI) / 180;
    const cameraDist = 480;

    const minElev = trackInfo.elevation.lowestM;
    const maxElev = trackInfo.elevation.highestM;
    const diffM = Math.max(1, trackInfo.elevation.diffM);

    // Height amplitude in visual pixels based on circuit steepness
    const maxHeightPx = diffM >= 70 ? 65 : diffM >= 35 ? 52 : 36;
    const zBase = -0.35 * maxHeightPx; // Ground datum plane

    const prof = trackInfo.elevation.profile;

    // Helper: find elevation in meters for a given progress %
    const getElevAtPct = (p: number) => {
      if (!prof || prof.length === 0) return minElev;
      for (let j = 0; j < prof.length - 1; j++) {
        if (p >= prof[j].distPct && p <= prof[j + 1].distPct) {
          const span = (prof[j + 1].distPct - prof[j].distPct) || 1;
          const t = (p - prof[j].distPct) / span;
          return prof[j].elevationM + (prof[j + 1].elevationM - prof[j].elevationM) * t;
        }
      }
      return prof[prof.length - 1].elevationM;
    };

    // Helper: 3D Point projection
    const projectPoint = (x2d: number, y2d: number, zVal: number) => {
      // Center coordinates around (200, 150)
      const X = x2d - 200;
      const Y = y2d - 150;

      // Rotate around Z axis (yaw)
      const x1 = X * Math.cos(radZ) - Y * Math.sin(radZ);
      const y1 = X * Math.sin(radZ) + Y * Math.cos(radZ);
      const z1 = zVal;

      // Rotate around X axis (pitch)
      const x2 = x1;
      const y2 = y1 * Math.cos(radX) - z1 * Math.sin(radX);
      const z2 = y1 * Math.sin(radX) + z1 * Math.cos(radX);

      // Perspective scale factor
      const scale = (cameraDist / (cameraDist + y2 * 0.5)) * zoom;
      const sX = cx + x2 * scale;
      const sY = cy - z2 * scale; // Note inverted Z for upward lift

      return { sX, sY, scale, depth: y2 };
    };

    // Project all waypoints
    let highestPoint = { pct: 0, sX: 0, sY: 0, elevM: -9999 };
    let lowestPoint = { pct: 0, sX: 0, sY: 0, elevM: 9999 };

    const pts3D = rawWaypoints.map((pt, i) => {
      const elevM = getElevAtPct(pt.pct);
      const hNorm = Math.max(0, Math.min(1, (elevM - minElev) / diffM)); // 0.0 ~ 1.0
      const Z = (hNorm - 0.25) * maxHeightPx;

      const trackProj = projectPoint(pt.x, pt.y, Z);
      const baseProj = projectPoint(pt.x, pt.y, zBase);

      if (elevM > highestPoint.elevM) {
        highestPoint = { pct: pt.pct, sX: trackProj.sX, sY: trackProj.sY, elevM };
      }
      if (elevM < lowestPoint.elevM) {
        lowestPoint = { pct: pt.pct, sX: trackProj.sX, sY: trackProj.sY, elevM };
      }

      // Determine sector
      const sector = pt.pct <= trackInfo.sectors.s1EndPct ? 's1' : pt.pct <= trackInfo.sectors.s2EndPct ? 's2' : 's3';

      return {
        pct: pt.pct,
        elevM,
        hNorm,
        sX: trackProj.sX,
        sY: trackProj.sY,
        baseX: baseProj.sX,
        baseY: baseProj.sY,
        sector,
        elevColor: getElevationColor(hNorm),
        scale: trackProj.scale
      };
    });

    // Generate vertical 3D Wall Quads between elevated track and base datum
    const wallQuads: Array<{
      points: string;
      hNorm: number;
      fill: string;
    }> = [];

    for (let i = 0; i < pts3D.length; i++) {
      const p1 = pts3D[i];
      const p2 = pts3D[(i + 1) % pts3D.length];

      const quadPoints = `${p1.sX.toFixed(1)},${p1.sY.toFixed(1)} ${p2.sX.toFixed(1)},${p2.sY.toFixed(1)} ${p2.baseX.toFixed(1)},${p2.baseY.toFixed(1)} ${p1.baseX.toFixed(1)},${p1.baseY.toFixed(1)}`;
      const avgH = (p1.hNorm + p2.hNorm) / 2;
      const fill = colorMode === 'elevation' ? getElevationColor(avgH) : '#0284c7';

      wallQuads.push({
        points: quadPoints,
        hNorm: avgH,
        fill
      });
    }

    // Base ground shadow path
    const baseShadowPath = `M ${pts3D.map((p) => `${p.baseX.toFixed(1)},${p.baseY.toFixed(1)}`).join(' L ')} Z`;

    // Elevated track line path
    const trackLinePath = `M ${pts3D.map((p) => `${p.sX.toFixed(1)},${p.sY.toFixed(1)}`).join(' L ')} Z`;

    // Project Corner Pins
    const cornerPins3D = mapData.cornerPins.map((pin) => {
      const elevM = getElevAtPct(pin.pct);
      const hNorm = (elevM - minElev) / diffM;
      const Z = (hNorm - 0.25) * maxHeightPx;
      const proj = projectPoint(pin.x, pin.y, Z);
      return {
        number: pin.number,
        name: pin.name,
        pct: pin.pct,
        elevM,
        sX: proj.sX,
        sY: proj.sY
      };
    });

    // Project Active Aero Zones
    const aeroZones3D = trackInfo.activeAeroZones.map((zone) => {
      let filtered: typeof pts3D = [];
      if (zone.startPct < zone.endPct) {
        filtered = pts3D.filter((p) => p.pct >= zone.startPct && p.pct <= zone.endPct);
      } else {
        // When wrapping around the Start/Finish line (e.g. 73% -> 100% -> 0% -> 10%):
        // Part 1: from startPct up to 100%
        const part1 = pts3D.filter((p) => p.pct >= zone.startPct);
        // Part 2: from 0% up to endPct
        const part2 = pts3D.filter((p) => p.pct <= zone.endPct);
        filtered = [...part1, ...part2];
      }
      if (filtered.length < 2) return null;
      const d = `M ${filtered.map((p) => `${p.sX.toFixed(1)},${p.sY.toFixed(1)}`).join(' L ')}`;
      const mid = filtered[Math.floor(filtered.length / 2)] || filtered[0];
      return { ...zone, d, mid };
    }).filter((item): item is NonNullable<typeof item> => item !== null);

    // Project Overtake Checkpoints
    const overtakePins3D = trackInfo.overtakeCheckpoints.map((cp) => {
      const pDetect = pts3D.find((p) => p.pct >= cp.detectionPct) || pts3D[0];
      const pBrake = pts3D.find((p) => p.pct >= cp.brakingZonePct) || pts3D[0];
      return {
        ...cp,
        detectCoord: { sX: pDetect.sX, sY: pDetect.sY },
        brakeCoord: { sX: pBrake.sX, sY: pBrake.sY }
      };
    });

    return {
      pts3D,
      wallQuads,
      baseShadowPath,
      trackLinePath,
      highestPoint,
      lowestPoint,
      cornerPins3D,
      aeroZones3D,
      overtakePins3D,
      projectPoint,
      getElevAtPct,
      maxHeightPx,
      minElev,
      maxElev,
      diffM
    };
  }, [mapData, trackInfo, rotX, rotZ, zoom, colorMode]);

  // Car Position in 3D Space
  const car3D = useMemo(() => {
    if (!projected3D) return null;
    const pts = projected3D.pts3D;
    const p = ((carProgress % 100) + 100) % 100;

    let idx = pts.findIndex((pt) => pt.pct >= p);
    if (idx <= 0) idx = 1;
    const p1 = pts[idx - 1] || pts[0];
    const p2 = pts[idx] || pts[pts.length - 1];

    const span = (p2.pct - p1.pct) || 1;
    const t = Math.max(0, Math.min(1, (p - p1.pct) / span));

    const sX = p1.sX + (p2.sX - p1.sX) * t;
    const sY = p1.sY + (p2.sY - p1.sY) * t;
    const elevM = p1.elevM + (p2.elevM - p1.elevM) * t;

    return { sX, sY, elevM, p };
  }, [projected3D, carProgress]);

  // Dynamic Car Aero Mode
  const carAeroStatus = useMemo(() => {
    const p = carProgress;
    for (const zone of trackInfo.activeAeroZones) {
      const match = zone.startPct < zone.endPct ? (p >= zone.startPct && p <= zone.endPct) : (p >= zone.startPct || p <= zone.endPct);
      if (match) {
        return {
          mode: 'X-MODE',
          label: 'X-MODE 🚀 (Low Drag -55%)',
          bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50',
          speedKmh: Math.round(318 + Math.sin(p * 0.1) * 20)
        };
      }
    }
    for (const cp of trackInfo.overtakeCheckpoints) {
      if (Math.abs(p - cp.brakingZonePct) < 3.0) {
        return {
          mode: 'BRAKE',
          label: 'BRAKE 🛑 (Energy Regen)',
          bg: 'bg-rose-500/20 text-rose-300 border-rose-500/50',
          speedKmh: Math.round(108 + (p % 10) * 8)
        };
      }
    }
    return {
      mode: 'Z-MODE',
      label: 'Z-MODE 🛡️ (High Downforce)',
      bg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50',
      speedKmh: Math.round(210 + (p % 15) * 5)
    };
  }, [carProgress, trackInfo]);

  // Live Run Animation Loop
  useEffect(() => {
    if (!isPlaying) {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      return;
    }
    const step = (time: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = time;
      const dt = (time - lastTimeRef.current) / 1000;
      lastTimeRef.current = time;

      const speedFactor = (100 / 16) * playbackSpeed;
      setCarProgress((prev) => (prev + dt * speedFactor) % 100);

      animFrameRef.current = requestAnimationFrame(step);
    };

    animFrameRef.current = requestAnimationFrame(step);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      lastTimeRef.current = 0;
    };
  }, [isPlaying, playbackSpeed]);

  // Cleaned Elevation Profile Ribbon (De-cluttered)
  const elevationRibbon = useMemo(() => {
    const prof = trackInfo.elevation.profile;
    if (!prof || prof.length === 0) return null;

    const minElev = trackInfo.elevation.lowestM;
    const maxElev = trackInfo.elevation.highestM;
    const span = Math.max(1, maxElev - minElev);

    const w = 600;
    const h = 75;
    const padY = 12;

    const coords = prof.map((pt) => {
      const x = (pt.distPct / 100) * w;
      const normY = (pt.elevationM - minElev) / span;
      const y = h - padY - normY * (h - padY * 2);
      return { x, y, pt };
    });

    const linePath = `M ${coords.map((c) => `${c.x.toFixed(1)},${c.y.toFixed(1)}`).join(' L ')}`;
    const areaPath = `${linePath} L ${w} ${h} L 0 ${h} Z`;

    const carP = carProgress;
    let carNormY = 0.5;
    for (let i = 0; i < prof.length - 1; i++) {
      if (carP >= prof[i].distPct && carP <= prof[i + 1].distPct) {
        const segSpan = prof[i + 1].distPct - prof[i].distPct || 1;
        const t = (carP - prof[i].distPct) / segSpan;
        const elev = prof[i].elevationM + (prof[i + 1].elevationM - prof[i].elevationM) * t;
        carNormY = (elev - minElev) / span;
        break;
      }
    }
    const carRibbonX = (carP / 100) * w;
    const carRibbonY = h - padY - carNormY * (h - padY * 2);

    return { coords, linePath, areaPath, carRibbonX, carRibbonY };
  }, [trackInfo.elevation, carProgress]);

  return (
    <div
      className={`rounded-2xl border border-white/10 bg-gradient-to-br from-slate-950 via-slate-900/90 to-neutral-950 p-4 sm:p-6 shadow-2xl space-y-5 overflow-hidden ${className}`}
    >
      {/* ─────────────────────────────────────────────────────────────
          1. F1 OFFICIAL BROADCAST HEADER BANNER
          ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-red-600/90 text-white font-racing font-bold text-[11px] tracking-wider uppercase shadow-md shadow-red-600/30">
              <span>🎬</span>
              <span>FORMULA 1 OFFICIAL BROADCAST</span>
            </span>
            <span className="px-2 py-0.5 rounded-md bg-sky-500/20 border border-sky-500/30 text-sky-300 font-mono text-[10px] font-bold flex items-center gap-1">
              <span>⛰️</span>
              <span>3D ELEVATION TERRAIN INTEL</span>
            </span>
            {round && (
              <span className="px-2 py-0.5 rounded-md bg-amber-500/20 border border-amber-500/30 text-amber-300 font-mono text-[10px] font-bold">
                ROUND {round}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2.5 pt-0.5">
            <span className="text-2xl sm:text-3xl">{trackInfo.flag}</span>
            <div>
              <h2 className="text-xl sm:text-2xl font-racing font-black text-white tracking-tight flex items-center gap-2">
                <span>{gpName || trackInfo.officialName}</span>
              </h2>
              <p className="text-xs text-slate-400 font-medium">
                {trackInfo.officialName} • {trackInfo.country}
              </p>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Preset Buttons */}
          <div className="inline-flex items-center p-1 bg-black/60 rounded-xl border border-white/10">
            <button
              type="button"
              onClick={() => applyPreset('2d')}
              className={`px-2.5 py-1 rounded-lg text-xs font-racing font-bold transition-all ${
                rotX === 0 ? 'bg-red-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
              title="真上からの2D平面表示"
            >
              2D 平面
            </button>
            <button
              type="button"
              onClick={() => applyPreset('3d')}
              className={`px-2.5 py-1 rounded-lg text-xs font-racing font-bold transition-all ${
                rotX > 20 ? 'bg-red-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
              title="F1中継風の立体斜め見下ろし3Dアングル"
            >
              3D 中継アングル
            </button>
            <button
              type="button"
              onClick={() => applyPreset('reset')}
              className="px-2 py-1 rounded-lg text-xs text-slate-400 hover:text-white transition-all font-mono"
              title="視点角度をリセット"
            >
              🔄
            </button>
          </div>

          {/* Zoom Controls */}
          <div className="inline-flex items-center p-1 bg-black/60 rounded-xl border border-white/10 font-mono text-xs">
            <button
              type="button"
              onClick={() => setZoom((z) => Math.max(0.85, Number((z - 0.1).toFixed(2))))}
              className="px-2 py-1 text-slate-400 hover:text-white"
              title="縮小"
            >
              －
            </button>
            <span className="px-1 text-[10px] text-slate-500 font-bold">{Math.round(zoom * 100)}%</span>
            <button
              type="button"
              onClick={() => setZoom((z) => Math.min(1.4, Number((z + 0.1).toFixed(2))))}
              className="px-2 py-1 text-slate-400 hover:text-white"
              title="拡大"
            >
              ＋
            </button>
          </div>

          {/* Live Run Preview Button */}
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className={`px-3.5 py-1.5 rounded-xl font-racing font-bold text-xs transition-all flex items-center gap-1.5 shadow-lg ${
              isPlaying
                ? 'bg-amber-500 text-black shadow-amber-500/30 animate-pulse'
                : 'bg-white/10 hover:bg-white/20 border border-white/15 text-white'
            }`}
          >
            <span>{isPlaying ? '⏸️ 一時停止' : '▶️ 走行プレビュー'}</span>
          </button>
          {isPlaying && (
            <button
              type="button"
              onClick={() => setPlaybackSpeed((s) => (s === 1 ? 2 : 1))}
              className="px-2 py-1.5 rounded-xl bg-black/60 border border-white/10 text-amber-400 font-mono text-xs font-bold"
              title="再生速度切替"
            >
              {playbackSpeed}x
            </button>
          )}
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. MAIN STAGE: TRUE 3D CIRCUIT MODEL WITH ELEVATION GEOMETRY
          ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* 3D Viewport Stage (8 cols) */}
        <div className="lg:col-span-8 flex flex-col space-y-3">
          <div
            className="relative w-full h-[400px] sm:h-[450px] rounded-2xl bg-gradient-to-b from-black/85 via-slate-950 to-black/95 border border-white/10 overflow-hidden select-none cursor-grab active:cursor-grabbing flex items-center justify-center shadow-inner"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            onWheel={handleWheel}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Ambient Lighting & Depth Perspective Grid */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(56,189,248,0.08)_0%,transparent_70%)] pointer-events-none" />
            <div
              className="absolute inset-0 opacity-15 pointer-events-none"
              style={{
                backgroundImage:
                  'linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)',
                backgroundSize: '36px 36px'
              }}
            />

            {/* Top-Left: 3D Angle Indicator & Elevation Delta Badge */}
            <div className="absolute top-3 left-3 z-20 flex flex-col gap-1.5 pointer-events-none">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-black/75 backdrop-blur-md border border-white/15 text-[10px] font-mono text-slate-300">
                  🔄 3D視点: <span className="text-amber-400 font-bold">X:{rotX}°</span> <span className="text-sky-400 font-bold">Z:{rotZ}°</span>
                </span>
                <span className="hidden sm:inline-block px-2 py-1 rounded-lg bg-black/60 border border-white/5 text-[9px] font-mono text-slate-400">
                  ドラッグで立体360°回転
                </span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-amber-500/20 border border-amber-500/30 text-amber-300 text-[10px] font-mono font-bold w-fit">
                <span>↕️ コース高低差: {trackInfo.elevation.diffM.toFixed(1)}m</span>
              </div>
            </div>

            {/* Top-Right: Layer Toggles & Color Mode */}
            <div className="absolute top-3 right-3 z-20 flex flex-wrap items-center gap-1.5 pointer-events-auto">
              {/* Color Mode Toggle */}
              <div className="inline-flex items-center p-0.5 bg-black/70 rounded-lg border border-white/10 text-[10px] font-racing font-bold">
                <button
                  type="button"
                  onClick={() => setColorMode('elevation')}
                  className={`px-2 py-1 rounded-md transition-all ${
                    colorMode === 'elevation'
                      ? 'bg-rose-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="標高グラデーション表示（低地:青〜高地:赤）"
                >
                  ⛰️ 標高カラー
                </button>
                <button
                  type="button"
                  onClick={() => setColorMode('sector')}
                  className={`px-2 py-1 rounded-md transition-all ${
                    colorMode === 'sector'
                      ? 'bg-amber-500 text-black font-bold shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="セクター1〜3別色分け"
                >
                  🎨 セクター
                </button>
              </div>

              {/* 3D Wall Toggle */}
              <button
                type="button"
                onClick={() => setShowElevationWall(!showElevationWall)}
                className={`px-2 py-1 rounded-lg text-[10px] font-racing font-bold transition-all border ${
                  showElevationWall
                    ? 'bg-sky-500/25 text-sky-300 border-sky-500/50'
                    : 'bg-black/50 text-slate-500 border-white/5'
                }`}
                title="地面からの立体標高ウォール（カーテン）表示"
              >
                🏢 3Dウォール
              </button>

              {/* Elevation Pins Toggle */}
              <button
                type="button"
                onClick={() => setShowElevationPins(!showElevationPins)}
                className={`px-2 py-1 rounded-lg text-[10px] font-racing font-bold transition-all border ${
                  showElevationPins
                    ? 'bg-amber-500/25 text-amber-300 border-amber-500/50'
                    : 'bg-black/50 text-slate-500 border-white/5'
                }`}
                title="最高峰・最低点・急勾配のフローティングピン"
              >
                🏔️ 標高ピン
              </button>

              {/* 2026 Aero X-Mode Toggle */}
              <button
                type="button"
                onClick={() => setShowActiveAero(!showActiveAero)}
                className={`px-2 py-1 rounded-lg text-[10px] font-racing font-bold transition-all border ${
                  showActiveAero
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : 'bg-black/50 text-slate-500 border-white/5'
                }`}
                title="2026アクティブ空力 X-Modeゾーン"
              >
                🟩 X-Mode
              </button>

              {/* Turn Numbers Toggle */}
              <button
                type="button"
                onClick={() => setShowCornerPins(!showCornerPins)}
                className={`px-2 py-1 rounded-lg text-[10px] font-racing font-bold transition-all border ${
                  showCornerPins
                    ? 'bg-amber-500/25 text-amber-300 border-amber-500/50'
                    : 'bg-black/50 text-slate-500 border-white/5'
                }`}
                title="各コーナー・ターン番号（T1, T2...）の表示"
              >
                📍 ターン番号
              </button>

              {/* 2026 MOM Toggle */}
              <button
                type="button"
                onClick={() => setShowOvertakeMOM(!showOvertakeMOM)}
                className={`px-2 py-1 rounded-lg text-[10px] font-racing font-bold transition-all border ${
                  showOvertakeMOM
                    ? 'bg-orange-500/25 text-orange-300 border-orange-500/50'
                    : 'bg-black/50 text-slate-500 border-white/5'
                }`}
                title="MOMオーバーテイク検知地点の表示"
              >
                🎯 MOM検知
              </button>
            </div>

            {/* Bottom-Left: Live Car Telemetry Status */}
            {isPlaying && (
              <div className="absolute bottom-3 left-3 z-20 pointer-events-none flex flex-col gap-1 animate-fade-in">
                <div className={`px-2.5 py-1 rounded-lg border text-xs font-mono font-bold backdrop-blur-md ${carAeroStatus.bg}`}>
                  {carAeroStatus.label}
                </div>
                <div className="px-2.5 py-0.5 rounded-lg bg-black/80 border border-white/10 text-[11px] font-mono text-white flex items-center gap-2">
                  <span>🏎️ {carAeroStatus.speedKmh} km/h</span>
                  <span className="text-slate-500">|</span>
                  <span>LAP: {Math.round(carProgress)}%</span>
                  {car3D && (
                    <>
                      <span className="text-slate-500">|</span>
                      <span>標高: <span className="text-amber-300 font-bold">{car3D.elevM.toFixed(1)}m</span></span>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Hover Tooltip on 3D Track */}
            {hoveredPoint && (
              <div
                className="absolute z-30 pointer-events-none px-2 py-1 rounded-md bg-black/90 border border-white/20 text-[10px] font-mono shadow-xl backdrop-blur-md"
                style={{ left: Math.min(360, hoveredPoint.x + 12), top: Math.max(10, hoveredPoint.y - 32) }}
              >
                <div className="font-bold text-white flex items-center gap-1">
                  <span>{hoveredPoint.label}</span>
                </div>
                <div className="text-amber-300">標高: {hoveredPoint.elevM.toFixed(1)}m</div>
              </div>
            )}

            {/* ─────────────────────────────────────────────────────────
                THE TRUE 3D SVG STAGE (WITH Z-ELEVATION LIFT & WALLS)
                ───────────────────────────────────────────────────────── */}
            {projected3D && (
              <svg
                viewBox="0 0 500 370"
                className="w-full h-full overflow-visible"
              >
                <defs>
                  {/* Glowing neon filters */}
                  <filter id="glow-elev" x="-30%" y="-30%" width="160%" height="160%">
                    <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#38bdf8" floodOpacity="0.7" />
                  </filter>
                  <filter id="glow-aero" x="-30%" y="-30%" width="160%" height="160%">
                    <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor="#22c55e" floodOpacity="0.9" />
                  </filter>
                  <linearGradient id="wall-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0284c7" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#0284c7" stopOpacity="0.05" />
                  </linearGradient>
                </defs>

                {/* 1. Base Ground Shadow Path (The flat datum footprint) */}
                <path
                  d={projected3D.baseShadowPath}
                  fill="rgba(15, 23, 42, 0.4)"
                  stroke="rgba(56, 189, 248, 0.2)"
                  strokeWidth="3"
                  strokeDasharray="4 4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* 2. 3D Elevation Vertical Curtain (Walls connecting track down to datum) */}
                {showElevationWall && (
                  <g className="opacity-90">
                    {projected3D.wallQuads.map((quad, idx) => (
                      <polygon
                        key={`wall-quad-${idx}`}
                        points={quad.points}
                        fill={quad.fill}
                        fillOpacity="0.22"
                        stroke={quad.fill}
                        strokeOpacity="0.35"
                        strokeWidth="0.6"
                      />
                    ))}
                  </g>
                )}

                {/* 3. Elevated Track Ribbon in 3D (Segments rendered according to color mode) */}
                <g>
                  {projected3D.pts3D.map((p, idx) => {
                    const nextP = projected3D.pts3D[(idx + 1) % projected3D.pts3D.length];
                    const strokeColor = colorMode === 'elevation'
                      ? p.elevColor
                      : SECTOR_COLORS[p.sector as keyof typeof SECTOR_COLORS];

                    return (
                      <line
                        key={`elev-seg-${idx}`}
                        x1={p.sX}
                        y1={p.sY}
                        x2={nextP.sX}
                        y2={nextP.sY}
                        stroke={strokeColor}
                        strokeWidth="5"
                        strokeLinecap="round"
                        className="cursor-pointer transition-colors"
                        onPointerEnter={() => {
                          setHoveredPoint({
                            x: p.sX,
                            y: p.sY,
                            label: `地点 (${p.pct.toFixed(0)}%)`,
                            elevM: p.elevM,
                            pct: p.pct
                          });
                        }}
                        onPointerLeave={() => setHoveredPoint(null)}
                      />
                    );
                  })}
                </g>

                {/* 4. Active Aero Zones (2026 X-Mode Glowing Overlays) */}
                {showActiveAero &&
                  projected3D.aeroZones3D.map((zone) => (
                    <g key={`aero-3d-${zone.id}`}>
                      <path
                        d={zone.d}
                        fill="none"
                        stroke="#22c55e"
                        strokeWidth="7"
                        strokeDasharray="6 4"
                        strokeLinecap="round"
                        filter="url(#glow-aero)"
                        className="animate-pulse"
                      />
                      {/* X-Mode Floating Badge */}
                      <g transform={`translate(${zone.mid.sX}, ${zone.mid.sY - 14})`}>
                        <rect x="-22" y="-7" width="44" height="14" rx="3" fill="#052e16" stroke="#22c55e" strokeWidth="1" />
                        <text x="0" y="3" textAnchor="middle" fill="#4ade80" fontSize="7" fontFamily="monospace" fontWeight="bold">
                          X-MODE
                        </text>
                      </g>
                    </g>
                  ))}

                {/* 5. Overtake Checkpoints & MOM Triggers */}
                {showOvertakeMOM &&
                  projected3D.overtakePins3D.map((cp) => (
                    <g key={`overtake-3d-${cp.id}`}>
                      {/* MOM Target Marker */}
                      <g transform={`translate(${cp.detectCoord.sX}, ${cp.detectCoord.sY})`}>
                        <circle r="6" fill="none" stroke="#f59e0b" strokeWidth="1.5" className="animate-ping" opacity="0.6" />
                        <circle r="4" fill="#f59e0b" stroke="#ffffff" strokeWidth="1" />
                        <rect x="8" y="-7" width="56" height="13" rx="3" fill="#18181b" stroke="#f59e0b" strokeWidth="1" />
                        <text x="36" y="2" textAnchor="middle" fill="#fbbf24" fontSize="6.5" fontFamily="monospace" fontWeight="bold">
                          🎯 MOM検知
                        </text>
                      </g>
                      {/* Braking Target */}
                      <g transform={`translate(${cp.brakeCoord.sX}, ${cp.brakeCoord.sY})`}>
                        <polygon points="0,-5 4,3 -4,3" fill="#ef4444" stroke="#ffffff" strokeWidth="0.8" />
                        <text x="0" y="10" textAnchor="middle" fill="#fca5a5" fontSize="6" fontFamily="monospace" fontWeight="bold">
                          BRAKE
                        </text>
                      </g>
                    </g>
                  ))}

                {/* 6. ON-MODEL 3D FLOATING ELEVATION PINS */}
                {showElevationPins && (
                  <>
                    {/* 🏔️ PEAK ELEVATION PIN */}
                    <g transform={`translate(${projected3D.highestPoint.sX}, ${projected3D.highestPoint.sY})`}>
                      {/* Vertical Leader Line */}
                      <line x1="0" y1="0" x2="0" y2="-28" stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="2 2" />
                      <circle r="3.5" fill="#f43f5e" stroke="#ffffff" strokeWidth="1" />
                      {/* Floating Badge */}
                      <g transform="translate(0, -32)">
                        <rect x="-56" y="-9" width="112" height="18" rx="4" fill="#1e1b4b" stroke="#f43f5e" strokeWidth="1.5" className="shadow-lg" />
                        <text x="0" y="3" textAnchor="middle" fill="#fda4af" fontSize="7.5" fontFamily="monospace" fontWeight="bold">
                          🏔️ 最高地点 {projected3D.highestPoint.elevM.toFixed(1)}m (+{projected3D.diffM.toFixed(1)}m)
                        </text>
                      </g>
                    </g>

                    {/* 🌊 LOWEST ELEVATION PIN */}
                    <g transform={`translate(${projected3D.lowestPoint.sX}, ${projected3D.lowestPoint.sY})`}>
                      <line x1="0" y1="0" x2="0" y2="24" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="2 2" />
                      <circle r="3.5" fill="#38bdf8" stroke="#ffffff" strokeWidth="1" />
                      <g transform="translate(0, 32)">
                        <rect x="-48" y="-9" width="96" height="18" rx="4" fill="#082f49" stroke="#38bdf8" strokeWidth="1.5" />
                        <text x="0" y="3" textAnchor="middle" fill="#7dd3fc" fontSize="7.5" fontFamily="monospace" fontWeight="bold">
                          🌊 最低地点 {projected3D.lowestPoint.elevM.toFixed(1)}m
                        </text>
                      </g>
                    </g>

                    {/* 📈 MAX GRADIENT CALLOUT */}
                    <g transform={`translate(${projected3D.highestPoint.sX + 40}, ${projected3D.highestPoint.sY + 10})`}>
                      <rect x="-35" y="-7" width="70" height="14" rx="3" fill="#064e3b" stroke="#10b981" strokeWidth="1" />
                      <text x="0" y="3" textAnchor="middle" fill="#6ee7b7" fontSize="7" fontFamily="monospace" fontWeight="bold">
                        📈 勾配 +{trackInfo.elevation.maxGradientPct}%
                      </text>
                    </g>
                  </>
                )}

                {/* 7. Enhanced Turn Number Pins (T1, T2...) */}
                {showCornerPins &&
                  projected3D.cornerPins3D.map((pin) => {
                    const isLong = pin.number.length > 3;
                    const badgeWidth = isLong ? 32 : pin.number.length > 2 ? 26 : 20;
                    return (
                      <g
                        key={`corner-3d-${pin.number}`}
                        transform={`translate(${pin.sX}, ${pin.sY})`}
                        className="cursor-pointer group select-none"
                        onPointerEnter={() => {
                          setHoveredPoint({
                            x: pin.sX,
                            y: pin.sY,
                            label: `${pin.number}: ${pin.name || 'コーナー'}`,
                            elevM: pin.elevM,
                            pct: pin.pct
                          });
                        }}
                        onPointerLeave={() => setHoveredPoint(null)}
                      >
                        {/* Vertical Leader Needle to track surface */}
                        <line x1="0" y1="0" x2="0" y2="-12" stroke="#eab308" strokeWidth="1.2" strokeDasharray="1.5 1.5" />
                        <circle r="2" fill="#eab308" />

                        {/* Floating Turn Badge */}
                        <g transform="translate(0, -20)">
                          <rect
                            x={-badgeWidth / 2}
                            y="-8"
                            width={badgeWidth}
                            height="16"
                            rx="8"
                            fill="#090d16"
                            stroke="#eab308"
                            strokeWidth="1.4"
                            className="shadow-md"
                          />
                          <text
                            x="0"
                            y="3"
                            textAnchor="middle"
                            fill="#fef08a"
                            fontSize="7"
                            fontFamily="monospace"
                            fontWeight="black"
                          >
                            {pin.number}
                          </text>
                        </g>
                      </g>
                    );
                  })}

                {/* 8. Animated Car Light Pulse in 3D */}
                {isPlaying && car3D && (
                  <g transform={`translate(${car3D.sX}, ${car3D.sY})`}>
                    <circle r="12" fill={carAeroStatus.mode === 'X-MODE' ? '#22c55e' : '#ef4444'} opacity="0.35" className="animate-ping" />
                    <circle r="6" fill={carAeroStatus.mode === 'X-MODE' ? '#4ade80' : '#f87171'} stroke="#ffffff" strokeWidth="1.5" />
                    <circle r="2.5" fill="#ffffff" />
                  </g>
                )}
              </svg>
            )}

            {/* Floating On-Canvas Zoom HUD Controls (Bottom-Right) */}
            <div className="absolute bottom-3 right-3 z-20 flex items-center gap-1.5 p-1 bg-black/85 backdrop-blur-md rounded-xl border border-white/15 shadow-2xl font-mono text-xs select-none">
              <button
                type="button"
                onClick={() => setZoom((z) => Math.max(0.6, Number((z - 0.15).toFixed(2))))}
                className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/25 text-slate-200 hover:text-white flex items-center justify-center font-bold text-sm transition-all shadow-sm"
                title="縮小 (ズームアウト)"
              >
                －
              </button>
              <button
                type="button"
                onClick={() => setZoom(1.0)}
                className="px-2 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-sky-300 font-bold text-[11px] flex items-center justify-center transition-all shadow-sm"
                title="標準倍率 (100%) にリセット"
              >
                {Math.round(zoom * 100)}%
              </button>
              <button
                type="button"
                onClick={() => setZoom((z) => Math.min(2.5, Number((z + 0.15).toFixed(2))))}
                className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/25 text-slate-200 hover:text-white flex items-center justify-center font-bold text-sm transition-all shadow-sm"
                title="拡大 (ズームイン)"
              >
                ＋
              </button>
            </div>

            {/* Bottom-Center: Zoom Gesture Hint */}
            <div className="hidden sm:block absolute bottom-3 left-1/2 -translate-x-1/2 z-20 pointer-events-none px-2.5 py-0.5 rounded-full bg-black/75 border border-white/10 text-[9px] font-mono text-slate-300 shadow">
              🖱️ ホイールスクロール / ピンチで拡大縮小 (0.6x〜2.5x)
            </div>
          </div>

          {/* Elevation Gradient Spectrum Legend (when in elevation color mode) */}
          {colorMode === 'elevation' ? (
            <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-1.5 font-racing font-bold text-slate-300">
                <span>⛰️ 標高スペクトラム:</span>
              </div>
              <div className="flex items-center gap-2 flex-1 max-w-md">
                <span className="text-[10px] font-mono text-sky-300">{trackInfo.elevation.lowestM.toFixed(1)}m (低地)</span>
                <div
                  className="flex-1 h-2.5 rounded-full border border-white/10"
                  style={{
                    background: 'linear-gradient(to right, #38bdf8, #34d399, #fbbf24, #f43f5e)'
                  }}
                />
                <span className="text-[10px] font-mono text-rose-300 font-bold">{trackInfo.elevation.highestM.toFixed(1)}m (最高峰)</span>
              </div>
            </div>
          ) : (
            /* Sector Legend Bar */
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2 rounded-xl bg-yellow-500/10 border border-yellow-500/30">
                <div className="font-racing font-bold text-yellow-400 flex items-center justify-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                  <span>SECTOR 1 (0%〜{trackInfo.sectors.s1EndPct}%)</span>
                </div>
                <p className="text-[10px] text-slate-400 truncate mt-0.5">{trackInfo.sectors.s1Description}</p>
              </div>
              <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30">
                <div className="font-racing font-bold text-cyan-400 flex items-center justify-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                  <span>SECTOR 2 ({trackInfo.sectors.s1EndPct}%〜{trackInfo.sectors.s2EndPct}%)</span>
                </div>
                <p className="text-[10px] text-slate-400 truncate mt-0.5">{trackInfo.sectors.s2Description}</p>
              </div>
              <div className="p-2 rounded-xl bg-pink-500/10 border border-pink-500/30">
                <div className="font-racing font-bold text-pink-400 flex items-center justify-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-pink-400" />
                  <span>SECTOR 3 ({trackInfo.sectors.s2EndPct}%〜100%)</span>
                </div>
                <p className="text-[10px] text-slate-400 truncate mt-0.5">{trackInfo.sectors.s3Description}</p>
              </div>
            </div>
          )}
        </div>

        {/* Circuit Intel & 2026 Telemetry Specs (4 cols) */}
        <div className="lg:col-span-4 flex flex-col space-y-3">
          {/* Telemetry Specs Card */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-white/10 space-y-3 shadow-md flex-1">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <h3 className="text-xs font-racing font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <span>📊</span>
                <span>CIRCUIT TELEMETRY INTEL</span>
              </h3>
              <span className="text-[10px] font-mono text-emerald-400 font-bold">2026 FIA DATA</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2 rounded-xl bg-black/40 border border-white/5">
                <span className="text-[10px] text-slate-400 block">サーキット全長</span>
                <span className="text-sm font-black text-white">{trackInfo.lengthKm.toFixed(3)} km</span>
              </div>
              <div className="p-2 rounded-xl bg-black/40 border border-white/5">
                <span className="text-[10px] text-slate-400 block">決勝周回数</span>
                <span className="text-sm font-black text-white">{trackInfo.laps} LAPS</span>
              </div>
              <div className="p-2 rounded-xl bg-black/40 border border-white/5">
                <span className="text-[10px] text-slate-400 block">コーナー数</span>
                <span className="text-sm font-bold text-slate-200">
                  {trackInfo.turnCount} <span className="text-[10px] text-slate-400">(右{trackInfo.turnRightCount}/左{trackInfo.turnLeftCount})</span>
                </span>
              </div>
              <div className="p-2 rounded-xl bg-black/40 border border-white/5">
                <span className="text-[10px] text-slate-400 block">全開率 (Full Throttle)</span>
                <span className="text-sm font-bold text-amber-400">{trackInfo.telemetrySpecs.fullThrottlePct}%</span>
              </div>
              <div className="p-2 rounded-xl bg-black/40 border border-white/5">
                <span className="text-[10px] text-slate-400 block">予想最高速 (MOM作動)</span>
                <span className="text-sm font-bold text-emerald-400">{trackInfo.speedTrap.expectedSpeedKmh} km/h</span>
              </div>
              <div className="p-2 rounded-xl bg-black/40 border border-white/5">
                <span className="text-[10px] text-slate-400 block">周回変速回数</span>
                <span className="text-sm font-bold text-slate-300">約 {trackInfo.telemetrySpecs.gearChangesPerLap} 回</span>
              </div>
            </div>

            {/* Engineering Demands Breakdown */}
            <div className="space-y-1.5 pt-1 text-[11px]">
              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-400">タイヤ負荷 (Tyre Stress):</span>
                <span className="font-bold font-mono text-rose-400">{trackInfo.telemetrySpecs.tyreStress}</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-400">ダウンフォース要求:</span>
                <span className="font-bold font-mono text-sky-400">{trackInfo.telemetrySpecs.downforceLevel}</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-400">制動エネルギー (Braking):</span>
                <span className="font-bold font-mono text-amber-400">{trackInfo.telemetrySpecs.brakingEnergy}</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-400">ピットストップ損失時間:</span>
                <span className="font-bold font-mono text-emerald-400">約 {trackInfo.telemetrySpecs.pitlaneTimeLossSec}秒</span>
              </div>
            </div>
          </div>

          {/* 2026 Regulations Highlights Card */}
          <div className="p-3.5 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 space-y-2 text-xs">
            <div className="font-racing font-bold text-emerald-300 flex items-center gap-1.5">
              <span>🚀</span>
              <span>2026年規定 アクティブ空力 ＆ MOM概要</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              DRSに代わり、ストレートで全車一律に空力抵抗を55%落とす<span className="text-emerald-400 font-bold">「X-Mode」</span>と、前走車から1.0秒以内の検知で追加電気出力を解放する<span className="text-amber-400 font-bold">「MOM (マニュアル・オーバーライド)」</span>が導入されます。
            </p>
            <div className="text-[10px] font-mono text-emerald-400 bg-black/40 p-1.5 rounded-lg border border-emerald-500/20">
              • 本サーキットのアクティブ空力区間: <span className="font-bold text-white">{trackInfo.activeAeroZones.length} 箇所</span>
              <br />
              • MOM検知ポイント: <span className="font-bold text-white">{trackInfo.overtakeCheckpoints.length} 箇所</span>
            </div>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. ELEVATION PROFILE HUD (すっきり整頓された標高断面図)
          ───────────────────────────────────────────────────────────── */}
      <div className="p-4 sm:p-5 rounded-2xl bg-black/60 border border-white/10 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-lg">⛰️</span>
            <div>
              <h4 className="font-racing font-bold text-sm text-white flex items-center gap-2">
                <span>標高プロファイル断面図 (CIRCUIT ELEVATION PROFILE)</span>
              </h4>
              <p className="text-[11px] text-slate-400">
                {trackInfo.elevation.climbLocation}
              </p>
            </div>
          </div>

          {/* Key Elevation Metrics Badges */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
            <div className="px-2.5 py-1 rounded-xl bg-white/5 border border-white/10 text-slate-300">
              <span>↕️ 最大高低差: </span>
              <span className="text-amber-300 font-bold">{trackInfo.elevation.diffM.toFixed(1)}m</span>
            </div>
            <div className="px-2.5 py-1 rounded-xl bg-white/5 border border-white/10 text-slate-300">
              <span>🏔️ 最高標高: </span>
              <span className="text-rose-300 font-bold">{trackInfo.elevation.highestM.toFixed(1)}m</span>
            </div>
            <div className="px-2.5 py-1 rounded-xl bg-white/5 border border-white/10 text-slate-300">
              <span>🌊 最低標高: </span>
              <span className="text-cyan-300 font-bold">{trackInfo.elevation.lowestM.toFixed(1)}m</span>
            </div>
            <div className="px-2.5 py-1 rounded-xl bg-white/5 border border-white/10 text-slate-300">
              <span>📈 最大勾配: </span>
              <span className="text-emerald-300 font-bold">+{trackInfo.elevation.maxGradientPct.toFixed(1)}%</span>
            </div>
          </div>
        </div>

        {/* De-cluttered SVG Elevation Waveform Chart */}
        {elevationRibbon && (
          <div className="relative w-full h-[85px] sm:h-[100px] bg-slate-950/80 rounded-xl p-2 border border-white/5 overflow-hidden">
            <svg viewBox="0 0 600 75" preserveAspectRatio="none" className="w-full h-full">
              <defs>
                <linearGradient id="elevation-gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="0" y1="20" x2="600" y2="20" stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
              <line x1="0" y1="45" x2="600" y2="45" stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
              <line x1="0" y1="70" x2="600" y2="70" stroke="rgba(255,255,255,0.06)" />

              {/* Area Fill */}
              <path d={elevationRibbon.areaPath} fill="url(#elevation-gradient)" />

              {/* Line Stroke */}
              <path d={elevationRibbon.linePath} fill="none" stroke="#38bdf8" strokeWidth="2.5" />

              {/* Clean Key Landmark Badges (Start, Peak, Lowest, Finish only) */}
              {elevationRibbon.coords.map((c, i) => {
                const isStart = i === 0;
                const isFinish = i === elevationRibbon.coords.length - 1;
                const isPeak = c.pt.elevationM === trackInfo.elevation.highestM;
                const isLowest = c.pt.elevationM === trackInfo.elevation.lowestM;

                if (!isStart && !isFinish && !isPeak && !isLowest) return null;

                return (
                  <g key={`elev-node-${i}`} transform={`translate(${c.x}, ${c.y})`}>
                    <circle r="3" fill={isPeak ? '#f43f5e' : isLowest ? '#38bdf8' : '#eab308'} stroke="#ffffff" strokeWidth="1" />
                    {isPeak && (
                      <text x="0" y="-8" textAnchor="middle" fill="#fda4af" fontSize="7" fontFamily="monospace" fontWeight="bold">
                        ▲ 最高峰 {c.pt.elevationM.toFixed(1)}m
                      </text>
                    )}
                    {isLowest && (
                      <text x="0" y="14" textAnchor="middle" fill="#7dd3fc" fontSize="7" fontFamily="monospace" fontWeight="bold">
                        ▼ 最低点 {c.pt.elevationM.toFixed(1)}m
                      </text>
                    )}
                  </g>
                );
              })}

              {/* Live Car Tracking Marker on Ribbon */}
              {isPlaying && (
                <g transform={`translate(${elevationRibbon.carRibbonX}, ${elevationRibbon.carRibbonY})`}>
                  <circle r="5" fill="#ef4444" stroke="#ffffff" strokeWidth="1.5" className="animate-ping" />
                  <circle r="3.5" fill="#ef4444" stroke="#ffffff" strokeWidth="1" />
                </g>
              )}
            </svg>

            {/* Bottom Axis Labels */}
            <div className="flex items-center justify-between text-[9px] font-mono text-slate-400 px-1 pt-0.5">
              <span>🏁 START (0%)</span>
              <span>S1 スプリット ({trackInfo.sectors.s1EndPct}%)</span>
              <span>S2 スプリット ({trackInfo.sectors.s2EndPct}%)</span>
              <span>🏁 FINISH (100%)</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
