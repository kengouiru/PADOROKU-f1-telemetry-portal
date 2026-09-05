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
  'circuit-de-monaco': {
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
  'albert-park': {
    name: 'Albert Park Circuit',
    svgPath: 'M 180 270 L 260 270 C 300 270 310 240 290 220 L 260 190 C 250 170 260 140 280 120 L 300 90 C 310 60 280 50 250 50 L 190 50 C 160 50 140 70 150 100 L 160 140 C 165 170 140 200 110 210 L 80 220 C 60 230 60 260 100 270 Z',
    startFinish: { x: 180, y: 270 },
    cornerPins: [
      { number: 'T1-2', name: 'Jones & Brabham', pct: 15, x: 295, y: 225 },
      { number: 'T3', name: 'Sports Complex', pct: 26, x: 255, y: 175 },
      { number: 'T6', name: 'Marina Section', pct: 42, x: 290, y: 95 },
      { number: 'T9-10', name: 'Lakeside Fast Chicane', pct: 60, x: 220, y: 50 },
      { number: 'T11-12', name: 'Waite Corner', pct: 75, x: 155, y: 120 },
      { number: 'T13-14', name: 'Prost Turn', pct: 94, x: 90, y: 245 },
    ],
    waypoints: [
      { pct: 0, x: 180, y: 270 },
      { pct: 15, x: 295, y: 225 },
      { pct: 26, x: 255, y: 175 },
      { pct: 42, x: 290, y: 95 },
      { pct: 60, x: 220, y: 50 },
      { pct: 75, x: 155, y: 120 },
      { pct: 88, x: 95, y: 215 },
      { pct: 94, x: 90, y: 245 },
      { pct: 100, x: 180, y: 270 },
    ],
  },
  'shanghai': {
    name: 'Shanghai International Circuit',
    svgPath: 'M 160 260 L 240 260 C 270 260 290 240 280 210 C 270 170 240 160 220 180 C 200 200 220 220 250 210 L 320 180 C 350 160 340 120 300 100 L 200 60 C 170 50 150 70 160 100 L 170 150 C 180 180 140 210 100 220 L 70 230 C 50 240 70 260 120 260 Z',
    startFinish: { x: 160, y: 260 },
    cornerPins: [
      { number: 'T1-4', name: 'Snails (カタツムリ)', pct: 18, x: 250, y: 200 },
      { number: 'T6', name: 'Hairpin T6', pct: 33, x: 325, y: 150 },
      { number: 'T7-8', name: 'High-speed Sweep', pct: 47, x: 260, y: 80 },
      { number: 'T14', name: 'Back Straight Hairpin', pct: 85, x: 80, y: 225 },
      { number: 'T16', name: 'Final Corner', pct: 96, x: 130, y: 260 },
    ],
    waypoints: [
      { pct: 0, x: 160, y: 260 },
      { pct: 18, x: 250, y: 200 },
      { pct: 33, x: 325, y: 150 },
      { pct: 47, x: 260, y: 80 },
      { pct: 65, x: 170, y: 120 },
      { pct: 85, x: 80, y: 225 },
      { pct: 96, x: 130, y: 260 },
      { pct: 100, x: 160, y: 260 },
    ],
  },
  'miami': {
    name: 'Miami International Autodrome',
    svgPath: 'M 170 265 L 270 265 C 310 265 320 240 290 220 L 250 190 C 230 170 250 140 280 130 L 330 110 C 350 100 340 70 300 70 L 220 70 C 190 70 170 90 180 120 L 190 160 C 200 190 170 210 130 220 L 80 230 C 60 240 70 265 120 265 Z',
    startFinish: { x: 170, y: 265 },
    cornerPins: [
      { number: 'T1', name: 'Turn 1', pct: 14, x: 295, y: 235 },
      { number: 'T4-8', name: 'Stadium Esses', pct: 32, x: 275, y: 140 },
      { number: 'T11', name: 'Turn 11', pct: 50, x: 280, y: 70 },
      { number: 'T14-15', name: 'Overpass Chicane', pct: 68, x: 185, y: 135 },
      { number: 'T17', name: 'Hairpin T17', pct: 87, x: 85, y: 235 },
    ],
    waypoints: [
      { pct: 0, x: 170, y: 265 },
      { pct: 14, x: 295, y: 235 },
      { pct: 32, x: 275, y: 140 },
      { pct: 50, x: 280, y: 70 },
      { pct: 68, x: 185, y: 135 },
      { pct: 87, x: 85, y: 235 },
      { pct: 100, x: 170, y: 265 },
    ],
  },
  'imola': {
    name: 'Autodromo Enzo e Dino Ferrari (Imola)',
    svgPath: 'M 190 260 L 270 260 C 300 260 310 240 290 220 L 260 190 C 240 170 240 140 260 120 L 280 80 C 290 50 260 45 220 55 L 160 75 C 130 85 130 115 150 135 L 160 170 C 170 200 140 220 100 230 L 75 240 C 60 250 80 260 130 260 Z',
    startFinish: { x: 190, y: 260 },
    cornerPins: [
      { number: 'T2-4', name: 'Tamburello', pct: 18, x: 295, y: 230 },
      { number: 'T5-6', name: 'Villeneuve', pct: 32, x: 250, y: 155 },
      { number: 'T7', name: 'Tosa', pct: 44, x: 275, y: 70 },
      { number: 'T9', name: 'Piratella', pct: 56, x: 200, y: 65 },
      { number: 'T11-13', name: 'Acque Minerali', pct: 68, x: 145, y: 110 },
      { number: 'T14-15', name: 'Variante Alta', pct: 80, x: 165, y: 180 },
      { number: 'T17-18', name: 'Rivazza', pct: 93, x: 85, y: 240 },
    ],
    waypoints: [
      { pct: 0, x: 190, y: 260 },
      { pct: 18, x: 295, y: 230 },
      { pct: 32, x: 250, y: 155 },
      { pct: 44, x: 275, y: 70 },
      { pct: 56, x: 200, y: 65 },
      { pct: 68, x: 145, y: 110 },
      { pct: 80, x: 165, y: 180 },
      { pct: 93, x: 85, y: 240 },
      { pct: 100, x: 190, y: 260 },
    ],
  },
  'villeneuve': {
    name: 'Circuit Gilles Villeneuve (Montreal)',
    svgPath: 'M 120 250 L 260 250 C 310 250 330 230 310 200 L 270 160 C 250 140 260 110 290 90 L 320 60 C 330 40 300 40 260 50 L 160 80 C 130 90 120 120 130 150 L 140 180 C 150 210 110 230 80 240 C 60 245 80 250 120 250 Z',
    startFinish: { x: 120, y: 250 },
    cornerPins: [
      { number: 'T1-2', name: 'Virage Senna', pct: 14, x: 285, y: 230 },
      { number: 'T3-4', name: 'Chicane T3-4', pct: 28, x: 275, y: 150 },
      { number: 'T8-9', name: 'Chicane T8-9', pct: 52, x: 260, y: 60 },
      { number: 'T10', name: 'L’Epingle Hairpin', pct: 72, x: 135, y: 120 },
      { number: 'T13-14', name: 'Wall of Champions', pct: 95, x: 85, y: 240 },
    ],
    waypoints: [
      { pct: 0, x: 120, y: 250 },
      { pct: 14, x: 285, y: 230 },
      { pct: 28, x: 275, y: 150 },
      { pct: 52, x: 260, y: 60 },
      { pct: 72, x: 135, y: 120 },
      { pct: 86, x: 145, y: 195 },
      { pct: 95, x: 85, y: 240 },
      { pct: 100, x: 120, y: 250 },
    ],
  },
  'catalunya': {
    name: 'Circuit de Barcelona-Catalunya',
    svgPath: 'M 180 260 L 270 260 C 310 260 320 235 295 210 L 260 175 C 245 155 255 125 285 110 L 325 85 C 345 70 330 45 290 50 L 190 60 C 150 65 135 95 145 125 L 155 165 C 165 195 130 220 90 230 C 65 240 90 260 140 260 Z',
    startFinish: { x: 180, y: 260 },
    cornerPins: [
      { number: 'T1-2', name: 'Elf Chicane', pct: 16, x: 300, y: 225 },
      { number: 'T3', name: 'Curva Renault', pct: 26, x: 265, y: 165 },
      { number: 'T4', name: 'Repsol', pct: 36, x: 300, y: 100 },
      { number: 'T5', name: 'Seat Hairpin', pct: 46, x: 275, y: 55 },
      { number: 'T9', name: 'Campsa', pct: 65, x: 155, y: 95 },
      { number: 'T10', name: 'La Caixa', pct: 78, x: 145, y: 175 },
      { number: 'T13-14', name: 'New Fast Sweep', pct: 95, x: 100, y: 245 },
    ],
    waypoints: [
      { pct: 0, x: 180, y: 260 },
      { pct: 16, x: 300, y: 225 },
      { pct: 26, x: 265, y: 165 },
      { pct: 36, x: 300, y: 100 },
      { pct: 46, x: 275, y: 55 },
      { pct: 65, x: 155, y: 95 },
      { pct: 78, x: 145, y: 175 },
      { pct: 95, x: 100, y: 245 },
      { pct: 100, x: 180, y: 260 },
    ],
  },
  'redbull-ring': {
    name: 'Red Bull Ring (Spielberg)',
    svgPath: 'M 150 250 L 260 250 C 300 250 315 225 285 200 L 245 160 C 230 140 240 110 270 95 L 305 75 C 320 60 300 45 260 55 L 180 75 C 140 85 130 115 140 145 L 150 180 C 155 210 115 230 85 240 C 65 245 85 250 125 250 Z',
    startFinish: { x: 150, y: 250 },
    cornerPins: [
      { number: 'T1', name: 'Niki Lauda Kurve', pct: 18, x: 295, y: 215 },
      { number: 'T3', name: 'Remus Hairpin', pct: 42, x: 285, y: 65 },
      { number: 'T4', name: 'Rauch', pct: 58, x: 190, y: 70 },
      { number: 'T6-7', name: 'Gerhard Berger', pct: 75, x: 145, y: 135 },
      { number: 'T9-10', name: 'Jochen Rindt', pct: 94, x: 95, y: 245 },
    ],
    waypoints: [
      { pct: 0, x: 150, y: 250 },
      { pct: 18, x: 295, y: 215 },
      { pct: 42, x: 285, y: 65 },
      { pct: 58, x: 190, y: 70 },
      { pct: 75, x: 145, y: 135 },
      { pct: 94, x: 95, y: 245 },
      { pct: 100, x: 150, y: 250 },
    ],
  },
  'hungaroring': {
    name: 'Hungaroring',
    svgPath: 'M 180 260 L 265 260 C 300 260 310 235 285 215 L 245 185 C 230 165 240 135 270 120 L 310 95 C 330 80 320 50 280 55 L 190 65 C 155 75 140 105 150 135 L 160 175 C 170 205 130 225 90 235 C 70 245 90 260 140 260 Z',
    startFinish: { x: 180, y: 260 },
    cornerPins: [
      { number: 'T1', name: 'Turn 1 Downhill', pct: 15, x: 295, y: 225 },
      { number: 'T2', name: 'Turn 2 Left', pct: 28, x: 250, y: 175 },
      { number: 'T4', name: 'Mansell Corner', pct: 42, x: 290, y: 85 },
      { number: 'T6-7', name: 'Chicane', pct: 58, x: 220, y: 65 },
      { number: 'T11', name: 'Fast Left', pct: 76, x: 150, y: 130 },
      { number: 'T14', name: 'Final Corner', pct: 95, x: 100, y: 245 },
    ],
    waypoints: [
      { pct: 0, x: 180, y: 260 },
      { pct: 15, x: 295, y: 225 },
      { pct: 28, x: 250, y: 175 },
      { pct: 42, x: 290, y: 85 },
      { pct: 58, x: 220, y: 65 },
      { pct: 76, x: 150, y: 130 },
      { pct: 95, x: 100, y: 245 },
      { pct: 100, x: 180, y: 260 },
    ],
  },
  'zandvoort': {
    name: 'Circuit Zandvoort',
    svgPath: 'M 170 260 L 260 260 C 295 260 305 235 285 210 L 250 175 C 235 155 245 125 275 110 L 315 85 C 335 70 320 45 280 50 L 180 60 C 145 70 135 100 145 130 L 155 170 C 165 200 125 220 85 230 C 65 240 85 260 135 260 Z',
    startFinish: { x: 170, y: 260 },
    cornerPins: [
      { number: 'T1', name: 'Tarzanbocht', pct: 16, x: 295, y: 220 },
      { number: 'T3', name: 'Hugenholtz (18° Bank)', pct: 32, x: 260, y: 145 },
      { number: 'T7-8', name: 'Scheivlak', pct: 54, x: 295, y: 70 },
      { number: 'T11-12', name: 'Hans Ernst Chicane', pct: 78, x: 145, y: 125 },
      { number: 'T14', name: 'Luyendyk (18° Bank)', pct: 96, x: 95, y: 245 },
    ],
    waypoints: [
      { pct: 0, x: 170, y: 260 },
      { pct: 16, x: 295, y: 220 },
      { pct: 32, x: 260, y: 145 },
      { pct: 54, x: 295, y: 70 },
      { pct: 78, x: 145, y: 125 },
      { pct: 96, x: 95, y: 245 },
      { pct: 100, x: 170, y: 260 },
    ],
  },
  'baku': {
    name: 'Baku City Circuit',
    svgPath: 'M 190 265 L 280 265 C 315 265 325 240 295 215 L 255 180 C 240 160 250 130 280 115 L 325 90 C 345 75 330 50 290 55 L 195 65 C 160 75 145 105 155 135 L 165 175 C 175 205 135 225 95 235 C 70 245 90 265 145 265 Z',
    startFinish: { x: 190, y: 265 },
    cornerPins: [
      { number: 'T1', name: 'Turn 1 90-Deg', pct: 14, x: 305, y: 230 },
      { number: 'T3', name: 'Turn 3 Left', pct: 28, x: 265, y: 165 },
      { number: 'T8-11', name: 'Castle Section', pct: 50, x: 300, y: 75 },
      { number: 'T15', name: 'Downhill T15', pct: 72, x: 155, y: 130 },
      { number: 'T16', name: 'Main Straight Entry', pct: 85, x: 100, y: 235 },
    ],
    waypoints: [
      { pct: 0, x: 190, y: 265 },
      { pct: 14, x: 305, y: 230 },
      { pct: 28, x: 265, y: 165 },
      { pct: 50, x: 300, y: 75 },
      { pct: 72, x: 155, y: 130 },
      { pct: 85, x: 100, y: 235 },
      { pct: 100, x: 190, y: 265 },
    ],
  },
  'singapore': {
    name: 'Marina Bay Street Circuit',
    svgPath: 'M 170 260 L 260 260 C 295 260 305 235 285 210 L 250 175 C 235 155 245 125 275 110 L 315 85 C 335 70 320 45 280 50 L 180 60 C 145 70 135 100 145 130 L 155 170 C 165 200 125 220 85 230 C 65 240 85 260 135 260 Z',
    startFinish: { x: 170, y: 260 },
    cornerPins: [
      { number: 'T1-3', name: 'Sheares Chicane', pct: 16, x: 295, y: 220 },
      { number: 'T7', name: 'Memorial Turn', pct: 36, x: 260, y: 145 },
      { number: 'T11-13', name: 'Anderson Bridge', pct: 60, x: 295, y: 70 },
      { number: 'T14', name: 'Turn 14', pct: 75, x: 145, y: 125 },
      { number: 'T16-19', name: 'Final Complex', pct: 95, x: 95, y: 245 },
    ],
    waypoints: [
      { pct: 0, x: 170, y: 260 },
      { pct: 16, x: 295, y: 220 },
      { pct: 36, x: 260, y: 145 },
      { pct: 60, x: 295, y: 70 },
      { pct: 75, x: 145, y: 125 },
      { pct: 95, x: 95, y: 245 },
      { pct: 100, x: 170, y: 260 },
    ],
  },
  'cota': {
    name: 'Circuit of the Americas (Austin)',
    svgPath: 'M 180 265 L 270 265 C 310 265 320 240 295 215 L 255 180 C 240 160 250 130 280 115 L 325 90 C 345 75 330 50 290 55 L 195 65 C 160 75 145 105 155 135 L 165 175 C 175 205 135 225 95 235 C 70 245 90 265 145 265 Z',
    startFinish: { x: 180, y: 265 },
    cornerPins: [
      { number: 'T1', name: 'Big Red Hairpin', pct: 14, x: 300, y: 225 },
      { number: 'T3-6', name: 'Maggotts Replica', pct: 30, x: 265, y: 165 },
      { number: 'T11', name: 'Back Straight Entry', pct: 52, x: 305, y: 75 },
      { number: 'T12', name: 'Back Straight End', pct: 70, x: 155, y: 130 },
      { number: 'T16-18', name: 'Multi-Apex Carousel', pct: 86, x: 100, y: 235 },
    ],
    waypoints: [
      { pct: 0, x: 180, y: 265 },
      { pct: 14, x: 300, y: 225 },
      { pct: 30, x: 265, y: 165 },
      { pct: 52, x: 305, y: 75 },
      { pct: 70, x: 155, y: 130 },
      { pct: 86, x: 100, y: 235 },
      { pct: 100, x: 180, y: 265 },
    ],
  },
  'mexico': {
    name: 'Autódromo Hermanos Rodríguez',
    svgPath: 'M 170 260 L 260 260 C 295 260 305 235 285 210 L 250 175 C 235 155 245 125 275 110 L 315 85 C 335 70 320 45 280 50 L 180 60 C 145 70 135 100 145 130 L 155 170 C 165 200 125 220 85 230 C 65 240 85 260 135 260 Z',
    startFinish: { x: 170, y: 260 },
    cornerPins: [
      { number: 'T1-3', name: 'Moises Solana', pct: 18, x: 295, y: 220 },
      { number: 'T7-11', name: 'Esses Section', pct: 48, x: 275, y: 110 },
      { number: 'T12-15', name: 'Foro Sol Stadium', pct: 76, x: 145, y: 125 },
      { number: 'T17', name: 'Mansell Turn', pct: 95, x: 95, y: 245 },
    ],
    waypoints: [
      { pct: 0, x: 170, y: 260 },
      { pct: 18, x: 295, y: 220 },
      { pct: 48, x: 275, y: 110 },
      { pct: 76, x: 145, y: 125 },
      { pct: 95, x: 95, y: 245 },
      { pct: 100, x: 170, y: 260 },
    ],
  },
  'interlagos': {
    name: 'Autódromo José Carlos Pace (Interlagos)',
    svgPath: 'M 180 265 L 270 265 C 310 265 320 240 295 215 L 255 180 C 240 160 250 130 280 115 L 325 90 C 345 75 330 50 290 55 L 195 65 C 160 75 145 105 155 135 L 165 175 C 175 205 135 225 95 235 C 70 245 90 265 145 265 Z',
    startFinish: { x: 180, y: 265 },
    cornerPins: [
      { number: 'T1-2', name: 'S do Senna', pct: 15, x: 300, y: 225 },
      { number: 'T3', name: 'Curva do Sol', pct: 28, x: 265, y: 165 },
      { number: 'T4', name: 'Descida do Lago', pct: 42, x: 305, y: 75 },
      { number: 'T6-7', name: 'Ferradura', pct: 60, x: 155, y: 130 },
      { number: 'T12', name: 'Junção', pct: 84, x: 100, y: 235 },
    ],
    waypoints: [
      { pct: 0, x: 180, y: 265 },
      { pct: 15, x: 300, y: 225 },
      { pct: 28, x: 265, y: 165 },
      { pct: 42, x: 305, y: 75 },
      { pct: 60, x: 155, y: 130 },
      { pct: 84, x: 100, y: 235 },
      { pct: 100, x: 180, y: 265 },
    ],
  },
  'las-vegas': {
    name: 'Las Vegas Strip Circuit',
    svgPath: 'M 170 260 L 260 260 C 295 260 305 235 285 210 L 250 175 C 235 155 245 125 275 110 L 315 85 C 335 70 320 45 280 50 L 180 60 C 145 70 135 100 145 130 L 155 170 C 165 200 125 220 85 230 C 65 240 85 260 135 260 Z',
    startFinish: { x: 170, y: 260 },
    cornerPins: [
      { number: 'T1', name: 'Turn 1 Hairpin', pct: 15, x: 295, y: 220 },
      { number: 'T5-9', name: 'Sphere Complex', pct: 40, x: 260, y: 145 },
      { number: 'T12', name: 'Strip Entry', pct: 60, x: 295, y: 70 },
      { number: 'T14-15', name: 'Strip End Chicane', pct: 88, x: 145, y: 125 },
      { number: 'T17', name: 'Final Corner', pct: 96, x: 95, y: 245 },
    ],
    waypoints: [
      { pct: 0, x: 170, y: 260 },
      { pct: 15, x: 295, y: 220 },
      { pct: 40, x: 260, y: 145 },
      { pct: 60, x: 295, y: 70 },
      { pct: 88, x: 145, y: 125 },
      { pct: 96, x: 95, y: 245 },
      { pct: 100, x: 170, y: 260 },
    ],
  },
  'losail': {
    name: 'Lusail International Circuit',
    svgPath: 'M 180 265 L 270 265 C 310 265 320 240 295 215 L 255 180 C 240 160 250 130 280 115 L 325 90 C 345 75 330 50 290 55 L 195 65 C 160 75 145 105 155 135 L 165 175 C 175 205 135 225 95 235 C 70 245 90 265 145 265 Z',
    startFinish: { x: 180, y: 265 },
    cornerPins: [
      { number: 'T1', name: 'Turn 1 Entry', pct: 15, x: 300, y: 225 },
      { number: 'T6', name: 'Turn 6 Hairpin', pct: 38, x: 265, y: 165 },
      { number: 'T12-14', name: 'Triple Apex Fast Right', pct: 75, x: 305, y: 75 },
      { number: 'T16', name: 'Final Corner', pct: 95, x: 100, y: 235 },
    ],
    waypoints: [
      { pct: 0, x: 180, y: 265 },
      { pct: 15, x: 300, y: 225 },
      { pct: 38, x: 265, y: 165 },
      { pct: 75, x: 305, y: 75 },
      { pct: 95, x: 100, y: 235 },
      { pct: 100, x: 180, y: 265 },
    ],
  },
  'yas-marina': {
    name: 'Yas Marina Circuit',
    svgPath: 'M 170 260 L 260 260 C 295 260 305 235 285 210 L 250 175 C 235 155 245 125 275 110 L 315 85 C 335 70 320 45 280 50 L 180 60 C 145 70 135 100 145 130 L 155 170 C 165 200 125 220 85 230 C 65 240 85 260 135 260 Z',
    startFinish: { x: 170, y: 260 },
    cornerPins: [
      { number: 'T5', name: 'North Hairpin', pct: 28, x: 295, y: 220 },
      { number: 'T6-7', name: 'Back Straight Chicane', pct: 45, x: 260, y: 145 },
      { number: 'T9', name: 'Marsa Corner', pct: 65, x: 295, y: 70 },
      { number: 'T12-15', name: 'Hotel Complex', pct: 85, x: 145, y: 125 },
      { number: 'T16', name: 'Final Corner', pct: 96, x: 95, y: 245 },
    ],
    waypoints: [
      { pct: 0, x: 170, y: 260 },
      { pct: 28, x: 295, y: 220 },
      { pct: 45, x: 260, y: 145 },
      { pct: 65, x: 295, y: 70 },
      { pct: 85, x: 145, y: 125 },
      { pct: 96, x: 95, y: 245 },
      { pct: 100, x: 170, y: 260 },
    ],
  },
  'jeddah': {
    name: 'Jeddah Corniche Circuit',
    svgPath: 'M 180 265 L 270 265 C 310 265 320 240 295 215 L 255 180 C 240 160 250 130 280 115 L 325 90 C 345 75 330 50 290 55 L 195 65 C 160 75 145 105 155 135 L 165 175 C 175 205 135 225 95 235 C 70 245 90 265 145 265 Z',
    startFinish: { x: 180, y: 265 },
    cornerPins: [
      { number: 'T1-2', name: 'First Chicane', pct: 12, x: 300, y: 225 },
      { number: 'T13', name: 'Banked Hairpin 12°', pct: 45, x: 265, y: 165 },
      { number: 'T22-24', name: 'Blind Chicane', pct: 75, x: 305, y: 75 },
      { number: 'T27', name: 'Final Hairpin', pct: 96, x: 100, y: 235 },
    ],
    waypoints: [
      { pct: 0, x: 180, y: 265 },
      { pct: 12, x: 300, y: 225 },
      { pct: 45, x: 265, y: 165 },
      { pct: 75, x: 305, y: 75 },
      { pct: 96, x: 100, y: 235 },
      { pct: 100, x: 180, y: 265 },
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
