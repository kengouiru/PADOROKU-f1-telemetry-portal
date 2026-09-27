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
import { KNOWLEDGE_CIRCUITS, type CircuitCornerDetail } from '@/data/f1KnowledgeData';
import { getCircuitAtmospherePhotos, type AtmospherePhoto } from '@/lib/circuitResolver';

export interface TrackCornerViewItem {
  index: number;
  number: string;
  name: string;
  pct: number;
  gearEstimated: string;
  speedEstimated: string;
  engineeringTip: string;
  elevM: number;
  gradientPct: number;
  sector: 1 | 2 | 3;
  gForceLat?: string;
  hasActiveAero?: boolean;
  hasOvertakePoint?: boolean;
  photoUrl: string;
  photoCaption: string;
  photoTag: string;
}

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

  // Selected Corner for Street View / Onboard Cockpit Perspective
  const [selectedCornerId, setSelectedCornerId] = useState<string | null>(null);

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

  // Encyclopedic Circuit Profile Lookup
  const circuitKnowledge = useMemo(() => {
    const normId = circuitId.toLowerCase().replace(/_/g, '-');
    return (
      KNOWLEDGE_CIRCUITS.find(
        (c) =>
          c.id === normId ||
          c.id.includes(normId) ||
          normId.includes(c.id) ||
          c.officialName.toLowerCase().includes(normId) ||
          c.name.toLowerCase().includes(normId)
      ) || null
    );
  }, [circuitId]);

  // Unified Track Corners List for Street View & Paddock Navigation
  const trackCorners = useMemo<TrackCornerViewItem[]>(() => {
    const rawAllCorners = circuitKnowledge?.allCorners || [];
    const pins = mapData.cornerPins || [];
    const totalTurns = trackInfo.turnCount || rawAllCorners.length || pins.length || 16;
    const atmosPhotos = getCircuitAtmospherePhotos(circuitId, gpName || trackInfo.officialName);

    // If encyclopedic allCorners exists, prioritize it:
    if (rawAllCorners.length > 0) {
      return rawAllCorners.map((ac, idx) => {
        // Find matching pin or estimate pct
        const matchingPin = pins.find(
          (p) => p.number.toLowerCase() === ac.number.toLowerCase()
        );
        const pct = matchingPin?.pct ?? Number((((idx + 1) / (rawAllCorners.length + 1)) * 100).toFixed(1));
        const elevM = projected3D?.getElevAtPct(pct) ?? 30;

        // Calculate local gradient
        const prevElev = projected3D?.getElevAtPct((pct - 1.5 + 100) % 100) ?? elevM;
        const nextElev = projected3D?.getElevAtPct((pct + 1.5) % 100) ?? elevM;
        const distDeltaM = (trackInfo.lengthKm * 1000) * 0.03;
        const gradientPct = Number((((nextElev - prevElev) / Math.max(10, distDeltaM)) * 100).toFixed(1));

        const sector: 1 | 2 | 3 = pct <= trackInfo.sectors.s1EndPct ? 1 : pct <= trackInfo.sectors.s2EndPct ? 2 : 3;

        // Check if adjacent to aero zone or overtake checkpoint
        const hasActiveAero = trackInfo.activeAeroZones.some((z) => Math.abs(z.startPct - pct) < 6 || Math.abs(z.endPct - pct) < 6);
        const hasOvertakePoint = trackInfo.overtakeCheckpoints.some((cp) => Math.abs(cp.brakingZonePct - pct) < 5);

        // Photo rotation
        const photo = sector === 1 ? atmosPhotos[0] : atmosPhotos[1];

        return {
          index: idx,
          number: ac.number,
          name: ac.name || `Turn ${idx + 1}`,
          pct,
          gearEstimated: ac.gearEstimated || '4th',
          speedEstimated: ac.speedEstimated || '180 km/h',
          engineeringTip: ac.engineeringTip || 'イン側のクリッピングポイントを的確に捉え、脱出トラクションを最大化。',
          elevM,
          gradientPct,
          sector,
          gForceLat: `${(3.6 + (idx % 5) * 0.3).toFixed(1)}G`,
          hasActiveAero,
          hasOvertakePoint,
          photoUrl: photo.url,
          photoCaption: photo.caption,
          photoTag: photo.tag
        };
      });
    }

    // Fallback: build from mapData.cornerPins or default turns
    const count = pins.length > 0 ? pins.length : totalTurns;
    const items: TrackCornerViewItem[] = [];

    for (let i = 0; i < count; i++) {
      const pin = pins[i];
      const turnNum = pin ? pin.number : `T${i + 1}`;
      const pct = pin ? pin.pct : Number((((i + 1) / (count + 1)) * 100).toFixed(1));
      const elevM = projected3D?.getElevAtPct(pct) ?? 30;
      const sector: 1 | 2 | 3 = pct <= trackInfo.sectors.s1EndPct ? 1 : pct <= trackInfo.sectors.s2EndPct ? 2 : 3;
      const photo = sector === 1 ? atmosPhotos[0] : atmosPhotos[1];

      items.push({
        index: i,
        number: turnNum,
        name: pin?.name || `コーナー ${i + 1}`,
        pct,
        gearEstimated: i % 3 === 0 ? '2nd' : i % 3 === 1 ? '4th' : '6th',
        speedEstimated: i % 3 === 0 ? '95 km/h' : i % 3 === 1 ? '175 km/h' : '240 km/h',
        engineeringTip: 'トレイルブレーキングで車首を旋回させ、エイペックスを踏み外さないライン取りが必須。',
        elevM,
        gradientPct: 1.2,
        sector,
        gForceLat: '4.2G',
        hasActiveAero: false,
        hasOvertakePoint: false,
        photoUrl: photo.url,
        photoCaption: photo.caption,
        photoTag: photo.tag
      });
    }

    return items;
  }, [circuitKnowledge, mapData.cornerPins, trackInfo, projected3D, circuitId, gpName]);

  // Active Corner for Modal
  const activeCornerForModal = useMemo(() => {
    if (!selectedCornerId) return null;
    return trackCorners.find((c) => c.number.toLowerCase() === selectedCornerId.toLowerCase()) || trackCorners[0] || null;
  }, [selectedCornerId, trackCorners]);

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

    return { coords, linePath, areaPath };
  }, [trackInfo.elevation]);

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

          {/* Street View Corner Intel Button */}
          <button
            type="button"
            onClick={() => {
              const firstCorner = trackCorners[0]?.number || 'T1';
              setSelectedCornerId(firstCorner);
            }}
            className="px-3.5 py-1.5 rounded-xl font-racing font-bold text-xs transition-all flex items-center gap-1.5 shadow-lg bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:brightness-110 text-white shadow-red-600/30 border border-red-500/40"
            title="Google Street View風の全コーナー景色・オンボード視界を開く"
          >
            <span>🏙️</span>
            <span>コーナー景色 (Street View)</span>
          </button>
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

            {/* Bottom-Left: Street View Hint */}
            <div className="absolute bottom-3 left-3 z-20 pointer-events-none flex flex-col gap-1">
              <div className="px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-md border border-white/10 text-[10px] font-mono text-slate-300 flex items-center gap-1.5 shadow-md">
                <span className="text-amber-400">💡</span>
                <span>Turn番号 (T1, T2...) を押すとリアルな景色を閲覧できます</span>
              </div>
            </div>

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
                        onClick={() => setSelectedCornerId(pin.number)}
                        onPointerEnter={() => {
                          setHoveredPoint({
                            x: pin.sX,
                            y: pin.sY,
                            label: `${pin.number}: ${pin.name || 'コーナー'} (クリックで景色を見る 👁️)`,
                            elevM: pin.elevM,
                            pct: pin.pct
                          });
                        }}
                        onPointerLeave={() => setHoveredPoint(null)}
                      >
                        {/* Vertical Leader Needle to track surface */}
                        <line x1="0" y1="0" x2="0" y2="-12" stroke={selectedCornerId === pin.number ? '#ef4444' : '#eab308'} strokeWidth="1.4" strokeDasharray="1.5 1.5" />
                        <circle r="2.5" fill={selectedCornerId === pin.number ? '#ef4444' : '#eab308'} />

                        {/* Floating Turn Badge */}
                        <g transform="translate(0, -20)" className="transition-transform group-hover:scale-125">
                          {selectedCornerId === pin.number && (
                            <circle r="14" fill="none" stroke="#ef4444" strokeWidth="2" className="animate-ping" opacity="0.75" />
                          )}
                          <rect
                            x={-badgeWidth / 2}
                            y="-8"
                            width={badgeWidth}
                            height="16"
                            rx="8"
                            fill={selectedCornerId === pin.number ? '#7f1d1d' : '#090d16'}
                            stroke={selectedCornerId === pin.number ? '#f87171' : '#eab308'}
                            strokeWidth={selectedCornerId === pin.number ? '2' : '1.4'}
                            className="shadow-md"
                          />
                          <text
                            x="0"
                            y="3"
                            textAnchor="middle"
                            fill={selectedCornerId === pin.number ? '#ffffff' : '#fef08a'}
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

          {/* 🏙️ Google Street View Turn Navigator Bar */}
          <div className="p-3 rounded-2xl bg-gradient-to-r from-black/85 via-slate-900/95 to-black/85 border border-white/10 space-y-2 shadow-xl">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-base">🏙️</span>
                <span className="font-racing font-bold text-xs text-white tracking-wide">
                  各コーナーの景色・オンボード視界 (STREET VIEW)
                </span>
                <span className="text-[10px] text-amber-400 font-mono hidden sm:inline">
                  • Turn番号を押すとリアルな景色・路面・攻略法が表示されます
                </span>
              </div>
              <span className="text-[10px] font-mono text-slate-400 bg-white/5 px-2.5 py-0.5 rounded-full border border-white/10">
                全 {trackCorners.length} コーナー
              </span>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
              {trackCorners.map((c) => {
                const isSelected = selectedCornerId === c.number;
                return (
                  <button
                    key={`turn-selector-${c.number}`}
                    type="button"
                    onClick={() => setSelectedCornerId(c.number)}
                    className={`px-2.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 whitespace-nowrap border shrink-0 ${
                      isSelected
                        ? 'bg-red-600 text-white border-red-500 shadow-md shadow-red-600/40 ring-1 ring-white/50 scale-105'
                        : 'bg-black/60 hover:bg-white/15 text-slate-300 border-white/10 hover:border-white/20'
                    }`}
                    title={`${c.number}: ${c.name} (推定速度: ${c.speedEstimated})`}
                  >
                    <span className="text-amber-300 font-black">{c.number}</span>
                    <span className="text-[10px] font-sans font-normal opacity-80 max-w-[85px] truncate">
                      {c.name}
                    </span>
                  </button>
                );
              })}
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

      {/* ─────────────────────────────────────────────────────────────
          4. GOOGLE STREET VIEW / ONBOARD CORNER PERSPECTIVE MODAL
          ───────────────────────────────────────────────────────────── */}
      {activeCornerForModal && (
        <CornerStreetViewModal
          circuitId={circuitId}
          circuitName={gpName || trackInfo.officialName}
          country={trackInfo.country}
          flag={trackInfo.flag}
          corners={trackCorners}
          activeCornerNumber={activeCornerForModal.number}
          onSelectCorner={(num) => setSelectedCornerId(num)}
          onClose={() => setSelectedCornerId(null)}
        />
      )}
    </div>
  );
}

interface CornerStreetViewModalProps {
  circuitId: string;
  circuitName: string;
  country: string;
  flag: string;
  corners: TrackCornerViewItem[];
  activeCornerNumber: string;
  onSelectCorner: (num: string) => void;
  onClose: () => void;
}

function CornerStreetViewModal({
  circuitId,
  circuitName,
  country,
  flag,
  corners,
  activeCornerNumber,
  onSelectCorner,
  onClose
}: CornerStreetViewModalProps) {
  const [viewAngle, setViewAngle] = useState<'onboard' | 'trackside' | 'panoramic'>('onboard');

  const currentIndex = corners.findIndex(
    (c) => c.number.toLowerCase() === activeCornerNumber.toLowerCase()
  );
  const activeCorner = corners[currentIndex] || corners[0];
  const prevCorner = corners[(currentIndex - 1 + corners.length) % corners.length];
  const nextCorner = corners[(currentIndex + 1) % corners.length];

  const photos = useMemo(() => getCircuitAtmospherePhotos(circuitId, circuitName), [circuitId, circuitName]);

  // Current photo according to viewAngle
  const currentPhoto = useMemo(() => {
    if (viewAngle === 'onboard') {
      return photos[1] || photos[0];
    } else if (viewAngle === 'trackside') {
      return photos[0];
    } else {
      const cleanId = circuitId.toLowerCase().replace(/_/g, '-');
      return {
        url: `/images/circuits/circuit_${cleanId.replace(/-/g, '_')}_real.jpg`,
        caption: `${circuitName} のサーキット全景と雄大なロケーション`,
        tag: 'パノラマ全景'
      };
    }
  }, [viewAngle, photos, circuitId, circuitName]);

  // Keyboard navigation (← / → to navigate, ESC to close)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        onSelectCorner(prevCorner.number);
      } else if (e.key === 'ArrowRight') {
        onSelectCorner(nextCorner.number);
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [prevCorner, nextCorner, onSelectCorner, onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl max-h-[95vh] bg-slate-950 rounded-2xl border border-white/20 shadow-2xl flex flex-col overflow-hidden text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-white/10 bg-black/60 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{flag}</span>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-red-600 text-white font-racing font-bold text-[10px] tracking-wider uppercase shadow-sm">
                  STREET VIEW 360°
                </span>
                <span className="text-xs text-slate-400 font-mono hidden sm:inline">
                  {circuitName} • {country}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-racing font-black text-white flex items-center gap-2 mt-0.5">
                <span className="text-amber-400">{activeCorner.number}</span>
                <span>{activeCorner.name}</span>
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-400 hidden sm:inline">
              [{currentIndex + 1} / {corners.length}]
            </span>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-all text-sm font-mono"
              title="閉じる (ESC)"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto space-y-4 p-3 sm:p-5">
          {/* Main Visual Stage (Street View & Cockpit Camera Perspective) */}
          <div className="relative w-full h-[320px] sm:h-[420px] md:h-[480px] rounded-2xl overflow-hidden border border-white/15 bg-black shadow-2xl select-none group">
            {/* Real Photographic Background */}
            <img
              src={currentPhoto.url}
              alt={`${activeCorner.number} ${activeCorner.name}`}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />

            {/* Cinematic Vignette & Visor Tint Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/60 pointer-events-none" />

            {/* Street View HUD Lines & Crosshair Overlays */}
            <div className="absolute inset-0 pointer-events-none opacity-30">
              {/* Center Horizon Line */}
              <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-sky-400/40" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full border border-sky-400/30" />
            </div>

            {/* Top-Left: Compass & Sector Marker */}
            <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-black/80 backdrop-blur-md border border-white/15 text-xs font-mono">
                <span className="text-amber-400 font-bold">🧭 STREET VIEW COMPASS</span>
                <span className="text-slate-400">|</span>
                <span className="text-white">SECTOR {activeCorner.sector}</span>
                <span className="text-slate-400">|</span>
                <span className="text-sky-300 font-bold">{activeCorner.pct.toFixed(1)}%</span>
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-lg bg-black/70 backdrop-blur-md border border-white/10 text-[11px] font-mono">
                <span>↕️ 標高 {activeCorner.elevM.toFixed(1)}m</span>
                <span className="text-slate-500">•</span>
                <span className={activeCorner.gradientPct >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                  勾配 {activeCorner.gradientPct >= 0 ? `+${activeCorner.gradientPct}%` : `${activeCorner.gradientPct}%`}
                </span>
              </div>
            </div>

            {/* Top-Right: Camera View Angle Switcher */}
            <div className="absolute top-3 right-3 z-10 flex items-center gap-1 p-1 rounded-xl bg-black/80 backdrop-blur-md border border-white/15 text-xs font-racing font-bold">
              <button
                type="button"
                onClick={() => setViewAngle('onboard')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  viewAngle === 'onboard'
                    ? 'bg-red-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="ドライバーの視界・エイペックス進入目線"
              >
                📸 オンボード目線
              </button>
              <button
                type="button"
                onClick={() => setViewAngle('trackside')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  viewAngle === 'trackside'
                    ? 'bg-red-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="スタンド・路面サイドからのリアル景観"
              >
                🏟️ トラックサイド
              </button>
              <button
                type="button"
                onClick={() => setViewAngle('panoramic')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  viewAngle === 'panoramic'
                    ? 'bg-red-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="サーキット全景・空撮視点"
              >
                🚁 全景
              </button>
            </div>

            {/* Center Street View Left & Right Arrow Buttons */}
            <button
              type="button"
              onClick={() => onSelectCorner(prevCorner.number)}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 p-3 rounded-2xl bg-black/60 hover:bg-red-600 text-white backdrop-blur-md border border-white/20 hover:border-red-400 transition-all shadow-2xl flex items-center gap-2 group/btn"
              title={`前のコーナー (${prevCorner.number})`}
            >
              <span className="text-lg font-bold group-hover/btn:-translate-x-0.5 transition-transform">◀</span>
              <div className="text-left hidden md:block">
                <span className="text-[10px] font-mono text-slate-300 block">PREV</span>
                <span className="text-xs font-racing font-black text-amber-300">{prevCorner.number}</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => onSelectCorner(nextCorner.number)}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 p-3 rounded-2xl bg-black/60 hover:bg-red-600 text-white backdrop-blur-md border border-white/20 hover:border-red-400 transition-all shadow-2xl flex items-center gap-2 group/btn"
              title={`次のコーナー (${nextCorner.number})`}
            >
              <div className="text-right hidden md:block">
                <span className="text-[10px] font-mono text-slate-300 block">NEXT</span>
                <span className="text-xs font-racing font-black text-amber-300">{nextCorner.number}</span>
              </div>
              <span className="text-lg font-bold group-hover/btn:translate-x-0.5 transition-transform">▶</span>
            </button>

            {/* Bottom HUD Telemetry Ribbon Overlay */}
            <div className="absolute bottom-3 left-3 right-3 z-10 p-3 rounded-xl bg-black/85 backdrop-blur-md border border-white/15 flex flex-wrap items-center justify-between gap-3 shadow-2xl font-mono">
              <div className="flex items-center gap-4 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block">推奨ギア</span>
                  <span className="text-sm font-black text-amber-400">{activeCorner.gearEstimated}</span>
                </div>
                <div className="w-[1px] h-6 bg-white/15" />
                <div>
                  <span className="text-[10px] text-slate-400 block">推定通過速度</span>
                  <span className="text-sm font-black text-emerald-400">{activeCorner.speedEstimated}</span>
                </div>
                <div className="w-[1px] h-6 bg-white/15" />
                <div>
                  <span className="text-[10px] text-slate-400 block">横方向負荷 (G)</span>
                  <span className="text-sm font-black text-rose-400">{activeCorner.gForceLat || '4.2G'}</span>
                </div>
              </div>

              {/* 2026 Aero / MOM Flag */}
              <div className="flex items-center gap-2 text-[11px]">
                {activeCorner.hasActiveAero && (
                  <span className="px-2 py-0.5 rounded-lg bg-emerald-500/25 border border-emerald-500/40 text-emerald-300 font-bold">
                    🚀 X-Mode 直結ストレート
                  </span>
                )}
                {activeCorner.hasOvertakePoint && (
                  <span className="px-2 py-0.5 rounded-lg bg-amber-500/25 border border-amber-500/40 text-amber-300 font-bold">
                    🎯 MOM 追い抜き激戦地
                  </span>
                )}
                <span className="text-[10px] text-slate-400 hidden sm:inline">
                  {currentPhoto.caption}
                </span>
              </div>
            </div>
          </div>

          {/* Tactical Engineering Tip & Paddock Intel */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 via-neutral-900 to-black border border-white/10 space-y-2.5 shadow-xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <div className="flex items-center gap-2">
                <span className="text-lg">💡</span>
                <h4 className="font-racing font-bold text-sm text-white">
                  レーシングエンジニアの攻略指南 ＆ リアル路面特性
                </h4>
              </div>
              <span className="text-[10px] font-mono text-amber-400 font-bold">
                FIA RACING INTEL
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
              {activeCorner.engineeringTip}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 text-[11px] font-mono">
              <div className="p-2 rounded-xl bg-black/50 border border-white/5">
                <span className="text-[10px] text-slate-400 block">🛑 ブレーキング指標</span>
                <span className="text-slate-200">
                  {parseInt(activeCorner.speedEstimated) > 220
                    ? '100m看板直前からのフル制動・トレイルブレーキ'
                    : '短い踏力で素早くノーズをインに向ける姿勢作り'}
                </span>
              </div>
              <div className="p-2 rounded-xl bg-black/50 border border-white/5">
                <span className="text-[10px] text-slate-400 block">🏁 縁石（カーブ）の使い方</span>
                <span className="text-slate-200">
                  イン側縁石はフラットに乗せ、脱出時の外側ソーセージ縁石底付きを警戒。
                </span>
              </div>
              <div className="p-2 rounded-xl bg-black/50 border border-white/5">
                <span className="text-[10px] text-slate-400 block">⚡ 加速トラクション</span>
                <span className="text-slate-200">
                  ステアリングを素早く戻しながら350kW MGU-K出力をタイヤ限界まで注ぎ込む。
                </span>
              </div>
            </div>
          </div>

          {/* Corner Quick Jumper Bar (All Turns) */}
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 px-1">
              <span>🗺️ 全コーナーをジャンプ切替 (STREET VIEW JUMP):</span>
              <span className="text-[10px] text-slate-500 hidden sm:inline">キーボード [←] [→] でコーナー移動 | [ESC] で閉じる</span>
            </div>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-thin">
              {corners.map((c) => {
                const isSelected = c.number === activeCorner.number;
                return (
                  <button
                    key={`modal-jump-${c.number}`}
                    type="button"
                    onClick={() => onSelectCorner(c.number)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all border shrink-0 ${
                      isSelected
                        ? 'bg-red-600 text-white border-red-500 shadow-md shadow-red-600/40 ring-2 ring-white/60 scale-105'
                        : 'bg-black/60 hover:bg-white/15 text-slate-300 border-white/10'
                    }`}
                  >
                    <span>{c.number}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
