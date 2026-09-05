'use client';

/**
 * components/telemetry/TelemetryTrackMap.tsx
 * Interactive Circuit Mini-Map with Dynamic Telemetry Position Sync
 * 
 * Features:
 * - High-precision SVG circuit layout paths for Suzuka, Spa, Monza, Monaco, Silverstone, Bahrain, and generic tracks.
 * - Synchronized dynamic glowing pointers for Driver 1 and Driver 2 positioned at hover progress (0% ~ 100%).
 * - Clickable corner hotspot pins with tooltips that trigger telemetry zoom into specific corners.
 * - Interactive hover scrubbing: hovering or clicking along the track scrubs telemetry charts!
 */

import React, { useMemo } from 'react';

export interface CornerPin {
  number: string;
  name: string;
  pct: number; // 0 ~ 100%
  x: number;   // SVG viewBox coordinate (0 ~ 400)
  y: number;   // SVG viewBox coordinate (0 ~ 300)
}

export interface CircuitTrackData {
  name: string;
  svgPath: string;
  startFinish: { x: number; y: number };
  cornerPins: CornerPin[];
  // Interpolation waypoints along 0% ~ 100% distance progress
  waypoints: Array<{ pct: number; x: number; y: number }>;
}

export const CIRCUIT_TRACK_MAPS: Record<string, CircuitTrackData> = {
  'suzuka': {
    name: 'Suzuka International Racing Course',
    svgPath: 'M 190 270 L 260 270 C 310 270 330 250 310 220 C 290 190 280 160 290 130 C 295 110 285 90 260 85 C 240 80 230 100 220 120 C 210 140 200 130 190 110 C 180 90 160 80 140 90 C 120 100 110 130 130 150 C 150 170 180 180 200 170 C 210 165 220 175 210 190 C 190 220 160 210 140 190 C 115 165 80 170 70 200 C 60 235 90 250 120 240 L 170 270 Z',
    startFinish: { x: 190, y: 270 },
    cornerPins: [
      { number: 'T1-2', name: 'First Corner', pct: 15, x: 315, y: 230 },
      { number: 'S字', name: 'S-Curves (T3-T6)', pct: 25, x: 275, y: 110 },
      { number: 'T7', name: 'Dunlop Curve', pct: 33, x: 230, y: 88 },
      { number: 'T8-9', name: 'Degner Curve', pct: 41, x: 195, y: 125 },
      { number: 'T11', name: 'Hairpin', pct: 53, x: 120, y: 100 },
      { number: 'T13-14', name: 'Spoon Curve', pct: 68, x: 75, y: 200 },
      { number: 'T15', name: '130R', pct: 85, x: 140, y: 255 },
      { number: 'T16-17', name: 'Chicane (Casio Triangle)', pct: 94, x: 175, y: 270 },
    ],
    waypoints: [
      { pct: 0, x: 190, y: 270 },
      { pct: 10, x: 270, y: 270 },
      { pct: 15, x: 315, y: 230 },
      { pct: 20, x: 290, y: 170 },
      { pct: 25, x: 275, y: 110 },
      { pct: 33, x: 230, y: 88 },
      { pct: 41, x: 195, y: 125 },
      { pct: 47, x: 160, y: 95 },
      { pct: 53, x: 120, y: 100 },
      { pct: 60, x: 150, y: 160 },
      { pct: 68, x: 75, y: 200 },
      { pct: 75, x: 80, y: 235 },
      { pct: 85, x: 140, y: 255 },
      { pct: 94, x: 175, y: 270 },
      { pct: 100, x: 190, y: 270 },
    ],
  },
  'spa-francorchamps': {
    name: 'Circuit de Spa-Francorchamps',
    svgPath: 'M 100 240 L 140 240 C 160 240 170 220 160 200 C 150 180 170 170 190 175 L 260 190 C 290 200 310 190 320 170 C 330 150 310 130 280 120 L 250 110 C 230 100 220 80 230 60 C 240 40 270 40 290 50 L 340 75 C 360 85 370 70 360 50 C 340 20 290 20 250 25 L 180 35 C 140 40 120 70 110 100 L 95 150 C 80 190 80 220 100 240 Z',
    startFinish: { x: 100, y: 240 },
    cornerPins: [
      { number: 'T1', name: 'La Source', pct: 8, x: 165, y: 210 },
      { number: 'T2-4', name: 'Eau Rouge / Raidillon', pct: 22, x: 195, y: 175 },
      { number: 'T5-7', name: 'Les Combes / Malmedy', pct: 45, x: 315, y: 160 },
      { number: 'T8-9', name: 'Rivage / Bruxelles', pct: 55, x: 260, y: 115 },
      { number: 'T10-11', name: 'Pouhon', pct: 68, x: 225, y: 65 },
      { number: 'T12-13', name: 'Fagnes', pct: 79, x: 285, y: 50 },
      { number: 'T14-15', name: 'Stavelot', pct: 87, x: 355, y: 65 },
      { number: 'T18-19', name: 'Bus Stop Chicane', pct: 97, x: 95, y: 200 },
    ],
    waypoints: [
      { pct: 0, x: 100, y: 240 },
      { pct: 8, x: 165, y: 210 },
      { pct: 15, x: 180, y: 175 },
      { pct: 22, x: 195, y: 175 },
      { pct: 35, x: 270, y: 190 },
      { pct: 45, x: 315, y: 160 },
      { pct: 55, x: 260, y: 115 },
      { pct: 68, x: 225, y: 65 },
      { pct: 79, x: 285, y: 50 },
      { pct: 87, x: 355, y: 65 },
      { pct: 92, x: 220, y: 30 },
      { pct: 97, x: 95, y: 200 },
      { pct: 100, x: 100, y: 240 },
    ],
  },
  'monza': {
    name: 'Autodromo Nazionale Monza',
    svgPath: 'M 90 230 L 260 230 C 290 230 300 215 285 200 C 270 185 280 170 310 150 C 340 130 350 100 320 70 C 290 40 250 40 220 50 L 150 75 C 130 80 120 100 135 115 C 150 130 140 145 110 160 L 80 175 C 60 185 60 215 90 230 Z',
    startFinish: { x: 90, y: 230 },
    cornerPins: [
      { number: 'T1-2', name: 'Variante del Rettifilo', pct: 21, x: 285, y: 215 },
      { number: 'T3', name: 'Curva Grande', pct: 35, x: 320, y: 140 },
      { number: 'T4-5', name: 'Variante della Roggia', pct: 47, x: 310, y: 70 },
      { number: 'T6-7', name: 'Curva di Lesmo 1 & 2', pct: 59, x: 235, y: 50 },
      { number: 'T8-10', name: 'Variante Ascari', pct: 77, x: 135, y: 115 },
      { number: 'T11', name: 'Curva Parabolica (Alboreto)', pct: 94, x: 75, y: 195 },
    ],
    waypoints: [
      { pct: 0, x: 90, y: 230 },
      { pct: 12, x: 200, y: 230 },
      { pct: 21, x: 285, y: 215 },
      { pct: 35, x: 320, y: 140 },
      { pct: 47, x: 310, y: 70 },
      { pct: 59, x: 235, y: 50 },
      { pct: 68, x: 170, y: 70 },
      { pct: 77, x: 135, y: 115 },
      { pct: 86, x: 95, y: 165 },
      { pct: 94, x: 75, y: 195 },
      { pct: 100, x: 90, y: 230 },
    ],
  },
  'bahrain-international': {
    name: 'Bahrain International Circuit (Sakhir)',
    svgPath: 'M 180 260 L 260 260 C 290 260 300 240 280 220 L 240 180 C 230 170 240 150 265 140 L 320 120 C 340 110 335 85 305 85 L 230 85 C 205 85 195 105 180 120 L 140 160 C 120 180 100 170 95 145 C 90 120 110 100 130 95 L 170 85 C 190 80 190 50 160 50 L 100 50 C 60 50 45 80 55 120 L 80 210 C 95 260 140 260 180 260 Z',
    startFinish: { x: 180, y: 260 },
    cornerPins: [
      { number: 'T1', name: 'Schumacher Turn', pct: 17, x: 285, y: 235 },
      { number: 'T4', name: 'Turn 4', pct: 31, x: 240, y: 180 },
      { number: 'T5-7', name: 'Esses Section', pct: 46, x: 310, y: 100 },
      { number: 'T8', name: 'Hairpin Turn 8', pct: 57, x: 215, y: 85 },
      { number: 'T9-10', name: 'Tricky Downhill', pct: 70, x: 135, y: 165 },
      { number: 'T11', name: 'Turn 11 Sweeper', pct: 80, x: 95, y: 135 },
      { number: 'T13', name: 'Turn 13', pct: 88, x: 75, y: 65 },
      { number: 'T14-15', name: 'Final Complex', pct: 97, x: 120, y: 240 },
    ],
    waypoints: [
      { pct: 0, x: 180, y: 260 },
      { pct: 10, x: 240, y: 260 },
      { pct: 17, x: 285, y: 235 },
      { pct: 24, x: 260, y: 200 },
      { pct: 31, x: 240, y: 180 },
      { pct: 40, x: 285, y: 130 },
      { pct: 46, x: 310, y: 100 },
      { pct: 57, x: 215, y: 85 },
      { pct: 70, x: 135, y: 165 },
      { pct: 80, x: 95, y: 135 },
      { pct: 88, x: 75, y: 65 },
      { pct: 97, x: 120, y: 240 },
      { pct: 100, x: 180, y: 260 },
    ],
  },
  'silverstone': {
    name: 'Silverstone Circuit',
    svgPath: 'M 190 260 L 280 260 C 310 260 320 240 300 220 C 280 200 290 180 320 170 C 350 160 360 130 330 100 C 300 70 270 80 250 100 L 220 130 C 200 150 180 140 170 120 L 155 90 C 140 60 100 60 85 90 L 65 140 C 50 180 70 220 110 240 L 160 260 Z',
    startFinish: { x: 190, y: 260 },
    cornerPins: [
      { number: 'T1-2', name: 'Abbey / Farm', pct: 11, x: 305, y: 235 },
      { number: 'T3-5', name: 'Village / Loop', pct: 22, x: 300, y: 180 },
      { number: 'T6-7', name: 'Brooklands / Luffield', pct: 38, x: 335, y: 110 },
      { number: 'T9', name: 'Copse', pct: 53, x: 240, y: 110 },
      { number: 'T10-14', name: 'Maggotts / Becketts / Chapel', pct: 66, x: 165, y: 105 },
      { number: 'T15', name: 'Stowe', pct: 85, x: 75, y: 120 },
      { number: 'T16-18', name: 'Vale / Club', pct: 96, x: 120, y: 245 },
    ],
    waypoints: [
      { pct: 0, x: 190, y: 260 },
      { pct: 11, x: 305, y: 235 },
      { pct: 22, x: 300, y: 180 },
      { pct: 38, x: 335, y: 110 },
      { pct: 53, x: 240, y: 110 },
      { pct: 66, x: 165, y: 105 },
      { pct: 75, x: 110, y: 80 },
      { pct: 85, x: 75, y: 120 },
      { pct: 96, x: 120, y: 245 },
      { pct: 100, x: 190, y: 260 },
    ],
  },
  'monaco': {
    name: 'Circuit de Monaco',
    svgPath: 'M 140 250 L 220 250 C 250 250 260 230 240 210 L 200 180 C 190 170 200 150 230 140 L 290 120 C 320 110 320 80 290 70 L 210 60 C 180 55 160 70 150 90 L 140 120 C 130 150 100 160 80 140 C 60 120 70 90 90 80 L 110 75 C 130 70 130 40 100 40 L 60 40 C 30 40 20 70 30 110 L 50 180 C 65 230 100 250 140 250 Z',
    startFinish: { x: 140, y: 250 },
    cornerPins: [
      { number: 'T1', name: 'Sainte-Dévote', pct: 14, x: 245, y: 225 },
      { number: 'T3-4', name: 'Massenet & Casino', pct: 28, x: 285, y: 125 },
      { number: 'T5', name: 'Mirabeau Haute', pct: 40, x: 250, y: 65 },
      { number: 'T6', name: 'Grand Hotel Hairpin', pct: 48, x: 165, y: 75 },
      { number: 'T8', name: 'Portier', pct: 57, x: 135, y: 135 },
      { number: 'T10-11', name: 'Nouvelle Chicane', pct: 72, x: 70, y: 110 },
      { number: 'T12', name: 'Tabac', pct: 82, x: 95, y: 65 },
      { number: 'T13-16', name: 'Louis Chiron & Swimming Pool', pct: 90, x: 45, y: 130 },
      { number: 'T17-18', name: 'La Rascasse & Antony Noghès', pct: 98, x: 105, y: 235 },
    ],
    waypoints: [
      { pct: 0, x: 140, y: 250 },
      { pct: 14, x: 245, y: 225 },
      { pct: 28, x: 285, y: 125 },
      { pct: 40, x: 250, y: 65 },
      { pct: 48, x: 165, y: 75 },
      { pct: 57, x: 135, y: 135 },
      { pct: 72, x: 70, y: 110 },
      { pct: 82, x: 95, y: 65 },
      { pct: 90, x: 45, y: 130 },
      { pct: 98, x: 105, y: 235 },
      { pct: 100, x: 140, y: 250 },
    ],
  },
};

// Generic Fallback Track
const GENERIC_TRACK: CircuitTrackData = {
  name: 'Standard Grand Prix Circuit',
  svgPath: 'M 100 240 L 260 240 C 320 240 330 200 290 170 L 230 130 C 200 110 220 70 270 70 L 310 70 C 340 70 340 40 300 40 L 150 40 C 90 40 70 80 80 130 L 70 190 C 60 230 80 240 100 240 Z',
  startFinish: { x: 100, y: 240 },
  cornerPins: [
    { number: 'T1', name: 'Sector 1 Entry', pct: 15, x: 290, y: 220 },
    { number: 'T2-4', name: 'Technical Esses', pct: 35, x: 245, y: 140 },
    { number: 'T6', name: 'Hairpin', pct: 55, x: 280, y: 60 },
    { number: 'T8-9', name: 'High-speed Sweeper', pct: 75, x: 120, y: 55 },
    { number: 'T11', name: 'Final Chicane', pct: 95, x: 75, y: 210 },
  ],
  waypoints: [
    { pct: 0, x: 100, y: 240 },
    { pct: 15, x: 290, y: 220 },
    { pct: 35, x: 245, y: 140 },
    { pct: 55, x: 280, y: 60 },
    { pct: 75, x: 120, y: 55 },
    { pct: 95, x: 75, y: 210 },
    { pct: 100, x: 100, y: 240 },
  ],
};

/**
 * Linear interpolation to calculate (x, y) coordinates along track from distance percentage (0 ~ 100%)
 */
function interpolateTrackCoords(waypoints: Array<{ pct: number; x: number; y: number }>, pct: number): { x: number; y: number } {
  const clampedPct = Math.max(0, Math.min(100, pct));
  
  // Find surrounding waypoints
  for (let i = 0; i < waypoints.length - 1; i++) {
    const p1 = waypoints[i];
    const p2 = waypoints[i + 1];
    if (clampedPct >= p1.pct && clampedPct <= p2.pct) {
      const span = p2.pct - p1.pct;
      if (span === 0) return { x: p1.x, y: p1.y };
      const t = (clampedPct - p1.pct) / span;
      return {
        x: p1.x + (p2.x - p1.x) * t,
        y: p1.y + (p2.y - p1.y) * t,
      };
    }
  }

  return waypoints[waypoints.length - 1] || { x: 200, y: 150 };
}

interface TelemetryTrackMapProps {
  circuitId: string;
  hoverDistPercent: number | null;
  driver1: { code: string; color: string; name: string };
  driver2: { code: string; color: string; name: string };
  onSelectCorner?: (corner: { name: string; pct: number }) => void;
  activeCornerName?: string | null;
  className?: string;
}

export default function TelemetryTrackMap({
  circuitId,
  hoverDistPercent,
  driver1,
  driver2,
  onSelectCorner,
  activeCornerName,
  className = '',
}: TelemetryTrackMapProps) {
  // Resolve circuit data
  const trackData = useMemo(() => {
    return CIRCUIT_TRACK_MAPS[circuitId] || GENERIC_TRACK;
  }, [circuitId]);

  // Interpolate car positions on track
  const currentPct = hoverDistPercent !== null ? hoverDistPercent : 0;
  const carPos = useMemo(() => {
    return interpolateTrackCoords(trackData.waypoints, currentPct);
  }, [trackData.waypoints, currentPct]);

  // Slight offset for driver 2 so both markers are distinguishable when overlapping
  const car1Pos = carPos;
  const car2Pos = { x: carPos.x + 3.5, y: carPos.y - 3.5 };

  return (
    <div className={`relative bg-slate-950/90 rounded-2xl border border-white/10 p-3 sm:p-4 flex flex-col items-center justify-between ${className}`}>
      {/* Header bar */}
      <div className="w-full flex items-center justify-between gap-2 pb-2 border-b border-white/10 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping" />
          <span className="font-racing font-bold text-white tracking-wide truncate max-w-[200px]">
            {trackData.name}
          </span>
        </div>
        <div className="font-mono text-[11px] text-slate-400">
          TRACK PROGRESS: <span className="text-sky-300 font-bold">{Math.round(currentPct)}%</span>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="relative w-full aspect-[4/3] max-w-[420px] my-2 flex items-center justify-center">
        <svg
          viewBox="0 0 400 300"
          className="w-full h-full filter drop-shadow-[0_0_15px_rgba(14,165,233,0.15)]"
        >
          <defs>
            {/* Glow filters */}
            <filter id="glow-d1" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor={driver1.color} />
            </filter>
            <filter id="glow-d2" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor={driver2.color} />
            </filter>
            <linearGradient id="trackGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#818cf8" stopOpacity="0.8" />
            </linearGradient>
          </defs>

          {/* Track Underlay Road Shadow */}
          <path
            d={trackData.svgPath}
            fill="none"
            stroke="#0f172a"
            strokeWidth="18"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Track Asphalt Border */}
          <path
            d={trackData.svgPath}
            fill="none"
            stroke="#334155"
            strokeWidth="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Track Center Racing Line */}
          <path
            d={trackData.svgPath}
            fill="none"
            stroke="url(#trackGrad)"
            strokeWidth="3.5"
            strokeDasharray="4 2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="opacity-75"
          />

          {/* Start/Finish Line */}
          <circle
            cx={trackData.startFinish.x}
            cy={trackData.startFinish.y}
            r="4.5"
            fill="#ffffff"
            stroke="#10b981"
            strokeWidth="2"
          />
          <text
            x={trackData.startFinish.x + 8}
            y={trackData.startFinish.y + 4}
            fontSize="8"
            fontFamily="monospace"
            fill="#10b981"
            fontWeight="bold"
          >
            S/F
          </text>

          {/* Clickable Corner Pins */}
          {trackData.cornerPins.map((corner) => {
            const isSelected = activeCornerName === corner.name;
            return (
              <g
                key={corner.number}
                className="cursor-pointer group"
                onClick={() => onSelectCorner?.({ name: corner.name, pct: corner.pct })}
              >
                {/* Hotspot circle */}
                <circle
                  cx={corner.x}
                  cy={corner.y}
                  r={isSelected ? '9' : '6'}
                  fill={isSelected ? '#f59e0b' : '#1e293b'}
                  stroke={isSelected ? '#fbbf24' : '#64748b'}
                  strokeWidth={isSelected ? '2.5' : '1.5'}
                  className="transition-all duration-200 group-hover:scale-125"
                />
                <text
                  x={corner.x}
                  y={corner.y + 2.5}
                  textAnchor="middle"
                  fontSize={isSelected ? '7.5' : '6.5'}
                  fontWeight="bold"
                  fontFamily="sans-serif"
                  fill={isSelected ? '#000000' : '#ffffff'}
                  className="pointer-events-none select-none"
                >
                  {corner.number}
                </text>

                {/* Hover corner name tooltip */}
                <title>{`${corner.number}: ${corner.name} (${corner.pct}%) - クリックでズーム`}</title>
              </g>
            );
          })}

          {/* Synchronized Hover Pointers (Driver 1 & Driver 2) */}
          {hoverDistPercent !== null && (
            <>
              {/* Driver 1 Pulse Marker */}
              <circle
                cx={car1Pos.x}
                cy={car1Pos.y}
                r="7"
                fill={driver1.color}
                filter="url(#glow-d1)"
                className="animate-pulse"
              />
              <circle
                cx={car1Pos.x}
                cy={car1Pos.y}
                r="3.5"
                fill="#ffffff"
              />

              {/* Driver 2 Pulse Marker */}
              <circle
                cx={car2Pos.x}
                cy={car2Pos.y}
                r="7"
                fill={driver2.color}
                filter="url(#glow-d2)"
                className="animate-pulse"
              />
              <circle
                cx={car2Pos.x}
                cy={car2Pos.y}
                r="3.5"
                fill="#ffffff"
              />
            </>
          )}
        </svg>

        {/* Legend Overlay at corner */}
        <div className="absolute bottom-1 left-2 bg-slate-900/80 backdrop-blur-md rounded-lg p-1.5 border border-white/10 flex items-center gap-2.5 text-[10px] font-mono">
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: driver1.color }} />
            <span className="text-white font-bold">{driver1.code}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: driver2.color }} />
            <span className="text-white font-bold">{driver2.code}</span>
          </div>
        </div>
      </div>

      {/* Footer Instructions / Corner Click hint */}
      <div className="w-full pt-2 border-t border-white/10 text-center">
        <p className="text-[11px] text-slate-400 font-mono flex items-center justify-center gap-1">
          <span>💡</span>
          <span>コーナーピンをクリックでテレメトリーをズーム解析</span>
        </p>
      </div>
    </div>
  );
}
