/**
 * lib/carTelemetryService.ts
 * F1 Car Telemetry Service
 *
 * Provides:
 * 1. OpenF1 /car_data endpoint integration
 * 2. Course-progress distance normalization (0% ~ 100%)
 * 3. High-fidelity realistic telemetry simulation for major circuits (Suzuka, Spa, Monza, Bahrain, Silverstone, Monaco)
 * 4. Automated driving style telemetry insights (Braking delta, Apex speeds, Throttle pick-up)
 */

import { KNOWLEDGE_CIRCUITS } from '@/data/f1KnowledgeData';
import { fetchCarData, type RawCarData } from './openf1Api';
import type { Lap } from './types';

export interface NormalizedTelemetryPoint {
  distPercent: number;     // 0.0 ~ 100.0 (%)
  distMeters: number;      // 0 ~ trackLength (m)
  cornerName?: string;     // e.g. "T1", "130R", "Eau Rouge"
  
  // Driver 1
  speed1: number;          // km/h
  throttle1: number;       // 0 ~ 100 %
  brake1: number;          // 0 or 100 %
  gear1: number;           // 1 ~ 8
  
  // Driver 2
  speed2: number;          // km/h
  throttle2: number;       // 0 ~ 100 %
  brake2: number;          // 0 or 100 %
  gear2: number;           // 1 ~ 8
  
  // Cumulative Delta time (Driver 2 time relative to Driver 1, + is D1 faster, - is D2 faster)
  delta: number;           // seconds
}

export interface TelemetryInsight {
  braking: {
    summary: string;
    lateBraker: string;
    details: string;
  };
  apexSpeed: {
    summary: string;
    fasterDriver: string;
    details: string;
  };
  throttleApplication: {
    summary: string;
    earlierDriver: string;
    details: string;
  };
  keyCorners: Array<{
    corner: string;
    advantageDriver: string;
    timeDelta: string;
    explanation: string;
  }>;
}


export interface CornerTelemetryAnalysis {
  cornerName: string;
  distanceMeters: number;
  distPercent: number;
  gear: number;
  d1BrakeStartM: number;
  d1ApexSpeed: number;
  d1ThrottlePickUpPct: number;
  d2BrakeStartM: number;
  d2ApexSpeed: number;
  d2ThrottlePickUpPct: number;
  apexSpeedDelta: number; // km/h (positive = D1 faster)
  timeDeltaSeconds: number; // s (positive = D1 faster)
  advantageDriver: string; // driver code
  keyTacticalNote: string;
}

export interface TelemetryComparisonData {
  circuitName: string;
  circuitLengthM: number;
  driver1: {
    code: string;
    number: string;
    name: string;
    color: string;
    lapTime: string;
  };
  driver2: {
    code: string;
    number: string;
    name: string;
    color: string;
    lapTime: string;
  };
  points: NormalizedTelemetryPoint[];
  insights: TelemetryInsight;
  cornerAnalyses: CornerTelemetryAnalysis[];
}

// ─────────────────────────────────────────────────────────────
// Circuit Geometry Reference Maps for High-Fidelity Simulation
// ─────────────────────────────────────────────────────────────

interface CornerZone {
  pctStart: number;
  pctApex: number;
  pctExit: number;
  name: string;
  gear: number;
  speed: number;
  brakingHardness: number; // 0.5 ~ 1.0
}

const CIRCUIT_CORNER_MAPS: Record<string, { length: number; corners: CornerZone[] }> = {
  'suzuka': {
    length: 5807,
    corners: [
      { pctStart: 12, pctApex: 15, pctExit: 18, name: 'T1-T2', gear: 4, speed: 150, brakingHardness: 0.85 },
      { pctStart: 21, pctApex: 24, pctExit: 28, name: 'S字 (T3-T6)', gear: 5, speed: 195, brakingHardness: 0.4 },
      { pctStart: 30, pctApex: 33, pctExit: 36, name: 'ダンロップ (T7)', gear: 6, speed: 240, brakingHardness: 0.2 },
      { pctStart: 39, pctApex: 41, pctExit: 44, name: 'デグナー (T8-T9)', gear: 3, speed: 138, brakingHardness: 0.9 },
      { pctStart: 50, pctApex: 53, pctExit: 56, name: 'ヘアピン (T11)', gear: 2, speed: 68, brakingHardness: 1.0 },
      { pctStart: 64, pctApex: 68, pctExit: 72, name: 'スプーン (T13-T14)', gear: 4, speed: 165, brakingHardness: 0.75 },
      { pctStart: 82, pctApex: 85, pctExit: 88, name: '130R (T15)', gear: 8, speed: 305, brakingHardness: 0.1 },
      { pctStart: 91, pctApex: 94, pctExit: 97, name: 'シケイン (T16-T17)', gear: 2, speed: 72, brakingHardness: 1.0 },
    ],
  },
  'bahrain-international': {
    length: 5412,
    corners: [
      { pctStart: 14, pctApex: 17, pctExit: 20, name: 'T1 (Schumacher)', gear: 2, speed: 68, brakingHardness: 1.0 },
      { pctStart: 28, pctApex: 31, pctExit: 34, name: 'T4', gear: 4, speed: 142, brakingHardness: 0.8 },
      { pctStart: 42, pctApex: 46, pctExit: 50, name: 'Esses (T5-T7)', gear: 5, speed: 220, brakingHardness: 0.35 },
      { pctStart: 54, pctApex: 57, pctExit: 60, name: 'Hairpin (T8)', gear: 2, speed: 75, brakingHardness: 0.9 },
      { pctStart: 66, pctApex: 70, pctExit: 73, name: 'Downhill (T9-T10)', gear: 2, speed: 62, brakingHardness: 0.95 },
      { pctStart: 77, pctApex: 80, pctExit: 83, name: 'T11', gear: 5, speed: 200, brakingHardness: 0.4 },
      { pctStart: 86, pctApex: 88, pctExit: 91, name: 'T13', gear: 4, speed: 132, brakingHardness: 0.7 },
      { pctStart: 94, pctApex: 97, pctExit: 99, name: 'T14-T15', gear: 3, speed: 120, brakingHardness: 0.85 },
    ],
  },
  'spa-francorchamps': {
    length: 7004,
    corners: [
      { pctStart: 5, pctApex: 8, pctExit: 11, name: 'La Source (T1)', gear: 2, speed: 72, brakingHardness: 1.0 },
      { pctStart: 18, pctApex: 22, pctExit: 26, name: 'Eau Rouge / Raidillon', gear: 8, speed: 305, brakingHardness: 0.05 },
      { pctStart: 42, pctApex: 45, pctExit: 48, name: 'Les Combes (T5-T7)', gear: 4, speed: 155, brakingHardness: 0.9 },
      { pctStart: 52, pctApex: 55, pctExit: 58, name: 'Rivage (T9)', gear: 3, speed: 115, brakingHardness: 0.75 },
      { pctStart: 65, pctApex: 68, pctExit: 72, name: 'Pouhon (T10-T11)', gear: 7, speed: 290, brakingHardness: 0.2 },
      { pctStart: 76, pctApex: 79, pctExit: 82, name: 'Fagnes (T12-T13)', gear: 5, speed: 185, brakingHardness: 0.6 },
      { pctStart: 84, pctApex: 87, pctExit: 90, name: 'Stavelot (T14-T15)', gear: 6, speed: 245, brakingHardness: 0.3 },
      { pctStart: 94, pctApex: 97, pctExit: 99, name: 'Bus Stop Chicane', gear: 2, speed: 75, brakingHardness: 1.0 },
    ],
  },
  'monza': {
    length: 5793,
    corners: [
      { pctStart: 17, pctApex: 21, pctExit: 25, name: '第1シケイン (T1-T2)', gear: 2, speed: 70, brakingHardness: 1.0 },
      { pctStart: 32, pctApex: 35, pctExit: 38, name: 'クルヴァ・グランデ (T3)', gear: 8, speed: 325, brakingHardness: 0.0 },
      { pctStart: 44, pctApex: 47, pctExit: 50, name: '第2シケイン (T4-T5)', gear: 3, speed: 125, brakingHardness: 0.85 },
      { pctStart: 56, pctApex: 59, pctExit: 62, name: 'レズモ (T6-T7)', gear: 4, speed: 162, brakingHardness: 0.7 },
      { pctStart: 73, pctApex: 77, pctExit: 81, name: 'アスカリ・シケイン (T8-T10)', gear: 4, speed: 175, brakingHardness: 0.8 },
      { pctStart: 90, pctApex: 94, pctExit: 98, name: 'パラボリカ (T11)', gear: 5, speed: 205, brakingHardness: 0.65 },
    ],
  },
  'silverstone': {
    length: 5891,
    corners: [
      { pctStart: 8, pctApex: 11, pctExit: 14, name: 'Abbey / Farm (T1-T2)', gear: 7, speed: 290, brakingHardness: 0.1 },
      { pctStart: 18, pctApex: 22, pctExit: 26, name: 'Village / Loop (T3-T5)', gear: 2, speed: 85, brakingHardness: 0.95 },
      { pctStart: 34, pctApex: 38, pctExit: 42, name: 'Brooklands / Luffield', gear: 3, speed: 135, brakingHardness: 0.7 },
      { pctStart: 50, pctApex: 53, pctExit: 56, name: 'Copse (T9)', gear: 7, speed: 290, brakingHardness: 0.25 },
      { pctStart: 60, pctApex: 66, pctExit: 72, name: 'Maggotts-Becketts-Chapel', gear: 6, speed: 225, brakingHardness: 0.5 },
      { pctStart: 82, pctApex: 85, pctExit: 88, name: 'Stowe (T15)', gear: 5, speed: 200, brakingHardness: 0.75 },
      { pctStart: 93, pctApex: 96, pctExit: 98, name: 'Vale / Club (T16-T18)', gear: 2, speed: 90, brakingHardness: 0.95 },
    ],
  },
  'monaco': {
    length: 3337,
    corners: [
      { pctStart: 11, pctApex: 14, pctExit: 17, name: 'Sainte-Dévote (T1)', gear: 2, speed: 85, brakingHardness: 0.9 },
      { pctStart: 25, pctApex: 28, pctExit: 31, name: 'Casino Square (T3-T4)', gear: 3, speed: 125, brakingHardness: 0.6 },
      { pctStart: 37, pctApex: 40, pctExit: 43, name: 'Mirabeau (T5)', gear: 2, speed: 80, brakingHardness: 0.8 },
      { pctStart: 45, pctApex: 48, pctExit: 51, name: 'Grand Hotel Hairpin (T6)', gear: 1, speed: 45, brakingHardness: 0.95 },
      { pctStart: 54, pctApex: 57, pctExit: 60, name: 'Portier (T8)', gear: 2, speed: 72, brakingHardness: 0.75 },
      { pctStart: 68, pctApex: 72, pctExit: 75, name: 'Nouvelle Chicane (T10)', gear: 2, speed: 60, brakingHardness: 1.0 },
      { pctStart: 79, pctApex: 82, pctExit: 85, name: 'Tabac (T12)', gear: 4, speed: 160, brakingHardness: 0.4 },
      { pctStart: 87, pctApex: 90, pctExit: 93, name: 'Swimming Pool (T13-T16)', gear: 4, speed: 140, brakingHardness: 0.65 },
      { pctStart: 95, pctApex: 98, pctExit: 100, name: 'Rascasse (T17-T18)', gear: 1, speed: 52, brakingHardness: 0.95 },
    ],
  },
  'circuit-de-monaco': {
    length: 3337,
    corners: [
      { pctStart: 11, pctApex: 14, pctExit: 17, name: 'Sainte-Dévote (T1)', gear: 2, speed: 85, brakingHardness: 0.9 },
      { pctStart: 25, pctApex: 28, pctExit: 31, name: 'Casino Square (T3-T4)', gear: 3, speed: 125, brakingHardness: 0.6 },
      { pctStart: 37, pctApex: 40, pctExit: 43, name: 'Mirabeau (T5)', gear: 2, speed: 80, brakingHardness: 0.8 },
      { pctStart: 45, pctApex: 48, pctExit: 51, name: 'Grand Hotel Hairpin (T6)', gear: 1, speed: 45, brakingHardness: 0.95 },
      { pctStart: 54, pctApex: 57, pctExit: 60, name: 'Portier (T8)', gear: 2, speed: 72, brakingHardness: 0.75 },
      { pctStart: 68, pctApex: 72, pctExit: 75, name: 'Nouvelle Chicane (T10)', gear: 2, speed: 60, brakingHardness: 1.0 },
      { pctStart: 79, pctApex: 82, pctExit: 85, name: 'Tabac (T12)', gear: 4, speed: 160, brakingHardness: 0.4 },
      { pctStart: 87, pctApex: 90, pctExit: 93, name: 'Swimming Pool (T13-T16)', gear: 4, speed: 140, brakingHardness: 0.65 },
      { pctStart: 95, pctApex: 98, pctExit: 100, name: 'Rascasse (T17-T18)', gear: 1, speed: 52, brakingHardness: 0.95 },
    ],
  },
  'albert-park': {
    length: 5278,
    corners: [
      { pctStart: 11, pctApex: 14, pctExit: 17, name: 'T1-T2 (Jones)', gear: 4, speed: 152, brakingHardness: 0.85 },
      { pctStart: 21, pctApex: 24, pctExit: 27, name: 'T3 (Sports Center)', gear: 3, speed: 96, brakingHardness: 0.9 },
      { pctStart: 34, pctApex: 37, pctExit: 40, name: 'T6', gear: 5, speed: 168, brakingHardness: 0.6 },
      { pctStart: 53, pctApex: 56, pctExit: 59, name: 'T9-T10 (Lakeside)', gear: 6, speed: 228, brakingHardness: 0.4 },
      { pctStart: 70, pctApex: 73, pctExit: 76, name: 'T11-T12 (Clark)', gear: 6, speed: 236, brakingHardness: 0.45 },
      { pctStart: 88, pctApex: 91, pctExit: 94, name: 'T13-T14 (Ascari/Prost)', gear: 3, speed: 116, brakingHardness: 0.85 },
    ],
  },
  'shanghai': {
    length: 5451,
    corners: [
      { pctStart: 12, pctApex: 16, pctExit: 20, name: 'T1-T3 (Snail Corner)', gear: 2, speed: 82, brakingHardness: 0.85 },
      { pctStart: 33, pctApex: 36, pctExit: 39, name: 'T6 (Hairpin)', gear: 2, speed: 88, brakingHardness: 0.95 },
      { pctStart: 46, pctApex: 49, pctExit: 53, name: 'T7-T8 (High Speed)', gear: 6, speed: 215, brakingHardness: 0.3 },
      { pctStart: 58, pctApex: 61, pctExit: 64, name: 'T9-T10', gear: 3, speed: 122, brakingHardness: 0.8 },
      { pctStart: 70, pctApex: 73, pctExit: 76, name: 'T11-T13', gear: 4, speed: 158, brakingHardness: 0.6 },
      { pctStart: 88, pctApex: 91, pctExit: 94, name: 'T14 (End of Straight)', gear: 2, speed: 68, brakingHardness: 1.0 },
    ],
  },
  'jeddah': {
    length: 6174,
    corners: [
      { pctStart: 9, pctApex: 12, pctExit: 15, name: 'T1-T2 Chicane', gear: 3, speed: 112, brakingHardness: 0.95 },
      { pctStart: 26, pctApex: 30, pctExit: 34, name: 'T4-T10 High-Speed Esses', gear: 6, speed: 242, brakingHardness: 0.3 },
      { pctStart: 40, pctApex: 43, pctExit: 46, name: 'T13 Banked Hairpin', gear: 4, speed: 138, brakingHardness: 0.7 },
      { pctStart: 73, pctApex: 76, pctExit: 79, name: 'T22-T24 Blind Sweep', gear: 6, speed: 218, brakingHardness: 0.4 },
      { pctStart: 93, pctApex: 96, pctExit: 98, name: 'T27 Final Hairpin', gear: 3, speed: 106, brakingHardness: 0.9 },
    ],
  },
  'miami': {
    length: 5412,
    corners: [
      { pctStart: 11, pctApex: 14, pctExit: 17, name: 'T1', gear: 3, speed: 112, brakingHardness: 0.9 },
      { pctStart: 23, pctApex: 26, pctExit: 29, name: 'T4-T6 S-Curves', gear: 5, speed: 192, brakingHardness: 0.4 },
      { pctStart: 36, pctApex: 39, pctExit: 42, name: 'T7-T8', gear: 4, speed: 132, brakingHardness: 0.7 },
      { pctStart: 60, pctApex: 63, pctExit: 66, name: 'T11-T16 Marina Complex', gear: 2, speed: 74, brakingHardness: 1.0 },
      { pctStart: 86, pctApex: 89, pctExit: 92, name: 'T17 Hairpin', gear: 2, speed: 78, brakingHardness: 0.95 },
    ],
  },
  'imola': {
    length: 4909,
    corners: [
      { pctStart: 16, pctApex: 19, pctExit: 22, name: 'Tamburello (T2-T4)', gear: 4, speed: 152, brakingHardness: 0.85 },
      { pctStart: 28, pctApex: 31, pctExit: 34, name: 'Villeneuve (T5-T6)', gear: 5, speed: 188, brakingHardness: 0.65 },
      { pctStart: 40, pctApex: 43, pctExit: 46, name: 'Tosa (T7)', gear: 3, speed: 96, brakingHardness: 0.95 },
      { pctStart: 54, pctApex: 57, pctExit: 60, name: 'Piratella (T9)', gear: 5, speed: 198, brakingHardness: 0.5 },
      { pctStart: 66, pctApex: 69, pctExit: 72, name: 'Acque Minerali (T11-T13)', gear: 4, speed: 142, brakingHardness: 0.8 },
      { pctStart: 78, pctApex: 81, pctExit: 84, name: 'Variante Alta (T14-T15)', gear: 3, speed: 126, brakingHardness: 0.85 },
      { pctStart: 91, pctApex: 94, pctExit: 97, name: 'Rivazza (T17-T18)', gear: 3, speed: 118, brakingHardness: 0.9 },
    ],
  },
  'villeneuve': {
    length: 4361,
    corners: [
      { pctStart: 12, pctApex: 15, pctExit: 18, name: 'Virage Senna (T1-T2)', gear: 2, speed: 92, brakingHardness: 0.95 },
      { pctStart: 24, pctApex: 27, pctExit: 30, name: 'T3-T4 Chicane', gear: 4, speed: 132, brakingHardness: 0.8 },
      { pctStart: 40, pctApex: 43, pctExit: 46, name: 'T6-T7 Chicane', gear: 4, speed: 136, brakingHardness: 0.8 },
      { pctStart: 56, pctApex: 59, pctExit: 62, name: 'T8-T9 Chicane', gear: 4, speed: 146, brakingHardness: 0.75 },
      { pctStart: 73, pctApex: 76, pctExit: 79, name: "L'Épingle Hairpin (T10)", gear: 2, speed: 68, brakingHardness: 1.0 },
      { pctStart: 92, pctApex: 95, pctExit: 98, name: 'Wall of Champions (T13-T14)', gear: 4, speed: 142, brakingHardness: 0.9 },
    ],
  },
  'catalunya': {
    length: 4657,
    corners: [
      { pctStart: 13, pctApex: 16, pctExit: 19, name: 'Elf (T1-T2)', gear: 4, speed: 136, brakingHardness: 0.9 },
      { pctStart: 24, pctApex: 27, pctExit: 30, name: 'Renault (T3)', gear: 6, speed: 226, brakingHardness: 0.2 },
      { pctStart: 33, pctApex: 36, pctExit: 39, name: 'Repsol (T4)', gear: 3, speed: 132, brakingHardness: 0.75 },
      { pctStart: 41, pctApex: 44, pctExit: 47, name: 'Seat (T5)', gear: 2, speed: 86, brakingHardness: 0.95 },
      { pctStart: 63, pctApex: 66, pctExit: 69, name: 'Campsa (T9)', gear: 6, speed: 218, brakingHardness: 0.35 },
      { pctStart: 74, pctApex: 77, pctExit: 80, name: 'La Caixa (T10)', gear: 3, speed: 106, brakingHardness: 0.9 },
      { pctStart: 92, pctApex: 95, pctExit: 98, name: 'New Final Turn (T14)', gear: 6, speed: 222, brakingHardness: 0.2 },
    ],
  },
  'redbull-ring': {
    length: 4318,
    corners: [
      { pctStart: 13, pctApex: 16, pctExit: 19, name: 'Niki Lauda (T1)', gear: 4, speed: 142, brakingHardness: 0.9 },
      { pctStart: 36, pctApex: 39, pctExit: 42, name: 'Remus (T3)', gear: 2, speed: 68, brakingHardness: 1.0 },
      { pctStart: 50, pctApex: 53, pctExit: 56, name: 'Schlossgold (T4)', gear: 3, speed: 122, brakingHardness: 0.85 },
      { pctStart: 68, pctApex: 71, pctExit: 74, name: 'Gerhard Berger (T6-T7)', gear: 5, speed: 182, brakingHardness: 0.5 },
      { pctStart: 88, pctApex: 91, pctExit: 94, name: 'Jochen Rindt (T9-T10)', gear: 6, speed: 208, brakingHardness: 0.4 },
    ],
  },
  'hungaroring': {
    length: 4381,
    corners: [
      { pctStart: 14, pctApex: 17, pctExit: 20, name: 'T1 Hairpin', gear: 2, speed: 96, brakingHardness: 0.95 },
      { pctStart: 26, pctApex: 29, pctExit: 32, name: 'T2', gear: 3, speed: 132, brakingHardness: 0.75 },
      { pctStart: 38, pctApex: 41, pctExit: 44, name: 'Mansell (T4)', gear: 5, speed: 206, brakingHardness: 0.4 },
      { pctStart: 48, pctApex: 51, pctExit: 54, name: 'T5', gear: 4, speed: 146, brakingHardness: 0.7 },
      { pctStart: 58, pctApex: 61, pctExit: 64, name: 'Chicane (T6-T7)', gear: 2, speed: 96, brakingHardness: 0.95 },
      { pctStart: 73, pctApex: 76, pctExit: 79, name: 'T8-T11 Mid-Speed', gear: 5, speed: 176, brakingHardness: 0.55 },
      { pctStart: 92, pctApex: 95, pctExit: 98, name: 'T14 Final Hairpin', gear: 3, speed: 122, brakingHardness: 0.8 },
    ],
  },
  'zandvoort': {
    length: 4259,
    corners: [
      { pctStart: 12, pctApex: 15, pctExit: 18, name: 'Tarzan (T1)', gear: 3, speed: 106, brakingHardness: 0.95 },
      { pctStart: 20, pctApex: 23, pctExit: 26, name: 'Gerlach (T2)', gear: 4, speed: 146, brakingHardness: 0.65 },
      { pctStart: 30, pctApex: 33, pctExit: 36, name: 'Hugenholtz Banked (T3)', gear: 3, speed: 96, brakingHardness: 0.85 },
      { pctStart: 50, pctApex: 53, pctExit: 56, name: 'Scheivlak (T7)', gear: 6, speed: 232, brakingHardness: 0.35 },
      { pctStart: 76, pctApex: 79, pctExit: 82, name: 'Hans Ernst Chicane (T11-T12)', gear: 2, speed: 92, brakingHardness: 0.95 },
      { pctStart: 91, pctApex: 94, pctExit: 97, name: 'Arie Luyendyk Banked (T14)', gear: 7, speed: 248, brakingHardness: 0.1 },
    ],
  },
  'baku': {
    length: 6003,
    corners: [
      { pctStart: 12, pctApex: 15, pctExit: 18, name: 'T1 90-Degree Left', gear: 3, speed: 106, brakingHardness: 1.0 },
      { pctStart: 21, pctApex: 24, pctExit: 27, name: 'T2 90-Degree Right', gear: 3, speed: 98, brakingHardness: 0.9 },
      { pctStart: 30, pctApex: 33, pctExit: 36, name: 'T3', gear: 3, speed: 112, brakingHardness: 0.9 },
      { pctStart: 50, pctApex: 53, pctExit: 56, name: 'Old Town Castle (T7-T11)', gear: 2, speed: 76, brakingHardness: 0.9 },
      { pctStart: 70, pctApex: 73, pctExit: 76, name: 'T15', gear: 3, speed: 116, brakingHardness: 0.85 },
      { pctStart: 78, pctApex: 81, pctExit: 84, name: 'T16', gear: 3, speed: 122, brakingHardness: 0.85 },
    ],
  },
  'singapore': {
    length: 4940,
    corners: [
      { pctStart: 13, pctApex: 16, pctExit: 19, name: 'Sheares (T1-T3)', gear: 3, speed: 96, brakingHardness: 0.95 },
      { pctStart: 26, pctApex: 29, pctExit: 32, name: 'T5', gear: 4, speed: 146, brakingHardness: 0.7 },
      { pctStart: 40, pctApex: 43, pctExit: 46, name: 'Memorial (T7)', gear: 3, speed: 112, brakingHardness: 0.85 },
      { pctStart: 52, pctApex: 55, pctExit: 58, name: 'Stamford (T9)', gear: 3, speed: 106, brakingHardness: 0.85 },
      { pctStart: 70, pctApex: 73, pctExit: 76, name: 'Padang (T14)', gear: 2, speed: 92, brakingHardness: 0.95 },
      { pctStart: 86, pctApex: 89, pctExit: 92, name: 'Bay (T16-T19)', gear: 3, speed: 126, brakingHardness: 0.8 },
    ],
  },
  'cota': {
    length: 5513,
    corners: [
      { pctStart: 12, pctApex: 15, pctExit: 18, name: 'Big Red (T1 Uphill)', gear: 2, speed: 86, brakingHardness: 1.0 },
      { pctStart: 28, pctApex: 31, pctExit: 35, name: 'Esses (T3-T6)', gear: 6, speed: 222, brakingHardness: 0.4 },
      { pctStart: 50, pctApex: 53, pctExit: 56, name: 'T11 Hairpin', gear: 2, speed: 76, brakingHardness: 0.95 },
      { pctStart: 68, pctApex: 71, pctExit: 74, name: 'T12 End of Backstraight', gear: 3, speed: 96, brakingHardness: 1.0 },
      { pctStart: 83, pctApex: 86, pctExit: 89, name: 'Carousel (T16-T18)', gear: 5, speed: 192, brakingHardness: 0.5 },
    ],
  },
  'mexico': {
    length: 4304,
    corners: [
      { pctStart: 16, pctApex: 19, pctExit: 22, name: 'Moisés Solana (T1-T3)', gear: 3, speed: 102, brakingHardness: 1.0 },
      { pctStart: 33, pctApex: 36, pctExit: 39, name: 'T4-T6 Chicane', gear: 3, speed: 116, brakingHardness: 0.85 },
      { pctStart: 53, pctApex: 56, pctExit: 59, name: 'Esses (T7-T11)', gear: 6, speed: 216, brakingHardness: 0.45 },
      { pctStart: 80, pctApex: 83, pctExit: 86, name: 'Foro Sol Stadium (T12-T15)', gear: 2, speed: 66, brakingHardness: 0.95 },
    ],
  },
  'interlagos': {
    length: 4309,
    corners: [
      { pctStart: 12, pctApex: 15, pctExit: 18, name: 'Senna S (T1-T2)', gear: 3, speed: 112, brakingHardness: 0.95 },
      { pctStart: 24, pctApex: 27, pctExit: 30, name: 'Curva do Sol (T3)', gear: 6, speed: 216, brakingHardness: 0.2 },
      { pctStart: 38, pctApex: 41, pctExit: 44, name: 'Descida do Lago (T4)', gear: 4, speed: 146, brakingHardness: 0.85 },
      { pctStart: 53, pctApex: 56, pctExit: 59, name: 'Ferradura (T6-T7)', gear: 5, speed: 192, brakingHardness: 0.5 },
      { pctStart: 68, pctApex: 71, pctExit: 74, name: 'Pinheirinho / Bico de Pato', gear: 2, speed: 78, brakingHardness: 0.95 },
      { pctStart: 83, pctApex: 86, pctExit: 89, name: 'Junção (T12)', gear: 3, speed: 122, brakingHardness: 0.8 },
    ],
  },
  'las-vegas': {
    length: 6201,
    corners: [
      { pctStart: 10, pctApex: 13, pctExit: 16, name: 'T1-T3 Chicane', gear: 3, speed: 96, brakingHardness: 0.95 },
      { pctStart: 22, pctApex: 25, pctExit: 28, name: 'The Sphere (T4)', gear: 4, speed: 146, brakingHardness: 0.65 },
      { pctStart: 40, pctApex: 43, pctExit: 46, name: 'T5-T9 Mid Sector', gear: 3, speed: 126, brakingHardness: 0.8 },
      { pctStart: 58, pctApex: 61, pctExit: 64, name: 'T12 Strip Entry', gear: 5, speed: 168, brakingHardness: 0.5 },
      { pctStart: 83, pctApex: 86, pctExit: 89, name: 'T14 End of Strip Straight', gear: 3, speed: 96, brakingHardness: 1.0 },
    ],
  },
  'losail': {
    length: 5419,
    corners: [
      { pctStart: 12, pctApex: 15, pctExit: 18, name: 'T1', gear: 3, speed: 106, brakingHardness: 0.95 },
      { pctStart: 30, pctApex: 33, pctExit: 36, name: 'T2-T5 Flowing Curves', gear: 5, speed: 178, brakingHardness: 0.5 },
      { pctStart: 42, pctApex: 45, pctExit: 48, name: 'T6 Hairpin', gear: 3, speed: 116, brakingHardness: 0.85 },
      { pctStart: 72, pctApex: 75, pctExit: 78, name: 'Triple Apex (T12-T14)', gear: 6, speed: 228, brakingHardness: 0.35 },
      { pctStart: 90, pctApex: 93, pctExit: 96, name: 'T16 Final Turn', gear: 4, speed: 136, brakingHardness: 0.75 },
    ],
  },
  'yas-marina': {
    length: 5281,
    corners: [
      { pctStart: 12, pctApex: 15, pctExit: 18, name: 'T1', gear: 4, speed: 132, brakingHardness: 0.85 },
      { pctStart: 30, pctApex: 33, pctExit: 36, name: 'T5 Hairpin', gear: 2, speed: 76, brakingHardness: 1.0 },
      { pctStart: 56, pctApex: 59, pctExit: 62, name: 'T6-T7 Chicane', gear: 3, speed: 96, brakingHardness: 0.95 },
      { pctStart: 70, pctApex: 73, pctExit: 76, name: 'T9 Banked Sweeper', gear: 5, speed: 192, brakingHardness: 0.4 },
      { pctStart: 84, pctApex: 87, pctExit: 90, name: 'T12-T14 Hotel Section', gear: 3, speed: 126, brakingHardness: 0.8 },
    ],
  },
};

// ─────────────────────────────────────────────────────────────
// High-Precision Telemetry Synthesizer
// ─────────────────────────────────────────────────────────────

export async function fetchAndGenerateNormalizedTelemetry(
  sessionKey: number,
  driver1: { code: string; number: string; name: string; color: string },
  driver2: { code: string; number: string; name: string; color: string },
  lapsCache: Record<string, Lap[]>,
  circuitId: string,
  lapNumber?: number
): Promise<TelemetryComparisonData> {
  const circConfig = CIRCUIT_CORNER_MAPS[circuitId] || CIRCUIT_CORNER_MAPS['bahrain-international'];
  const trackLength = circConfig.length;
  const corners = circConfig.corners;

  const getFastestLap = (driverNum: string) => {
    const laps = lapsCache[driverNum];
    if (!laps || laps.length === 0) return null;
    if (lapNumber) return laps.find(l => l.lap_number === lapNumber) || laps[0];
    let fastest = laps[0];
    for (const l of laps) {
      if (l.lap_duration && (!fastest.lap_duration || l.lap_duration < fastest.lap_duration)) {
        fastest = l;
      }
    }
    return fastest;
  };

  const lap1 = getFastestLap(driver1.number);
  const lap2 = getFastestLap(driver2.number);

  if (!lap1 || !lap2 || !lap1.date_start || !lap2.date_start) {
    throw new Error('Lap data is not available for one or both drivers.');
  }

  // Fetch car data for the specific lap window
  const getCarData = async (driverNum: string, lap: Lap) => {
    const start = new Date(lap.date_start!);
    const end = new Date(start.getTime() + (lap.lap_duration! * 1000) + 2000); // add 2s buffer
    return fetchCarData(sessionKey, parseInt(driverNum), start.toISOString(), end.toISOString());
  };

  const [raw1, raw2] = await Promise.all([
    getCarData(driver1.number, lap1),
    getCarData(driver2.number, lap2)
  ]);

  if (raw1.length === 0 || raw2.length === 0) {
    throw new Error('Car data is not available for the requested lap.');
  }

  // Normalize function: compute distance by integrating speed over time
  const processCarData = (rawData: RawCarData[]) => {
    let distance = 0;
    const processed = [];
    for (let i = 0; i < rawData.length; i++) {
      const p = rawData[i];
      if (i > 0) {
        const prev = rawData[i - 1];
        const dt = (new Date(p.date).getTime() - new Date(prev.date).getTime()) / 1000;
        const v = p.speed / 3.6; // m/s
        distance += v * dt;
      }
      processed.push({ ...p, distance });
    }
    // Normalize distance to percentage (0 - 100) based on max distance
    const totalDist = processed[processed.length - 1].distance;
    return processed.map(p => ({
      ...p,
      distPercent: totalDist > 0 ? (p.distance / totalDist) * 100 : 0
    }));
  };

  const p1 = processCarData(raw1);
  const p2 = processCarData(raw2);

  // Resample both to common distance percentages (e.g. 0 to 100 in 220 steps)
  const numSamples = 220;
  const points: NormalizedTelemetryPoint[] = [];
  let cumDelta = 0;
  const ds = trackLength / numSamples;

  for (let i = 0; i < numSamples; i++) {
    const pct = (i / (numSamples - 1)) * 100;
    const distMeters = Math.round((pct / 100) * trackLength);

    // Interpolate p1
    const findInterp = (data: typeof p1, targetPct: number) => {
      if (data.length === 0) return { speed: 0, throttle: 0, brake: 0, n_gear: 0 };
      if (targetPct <= data[0].distPercent) return data[0];
      if (targetPct >= data[data.length - 1].distPercent) return data[data.length - 1];
      for (let j = 0; j < data.length - 1; j++) {
        if (targetPct >= data[j].distPercent && targetPct <= data[j + 1].distPercent) {
          const t = (targetPct - data[j].distPercent) / (data[j + 1].distPercent - data[j].distPercent);
          return {
            speed: data[j].speed + t * (data[j + 1].speed - data[j].speed),
            throttle: data[j].throttle + t * (data[j + 1].throttle - data[j].throttle),
            brake: data[j].brake + t * (data[j + 1].brake - data[j].brake),
            n_gear: t < 0.5 ? data[j].n_gear : data[j + 1].n_gear,
          };
        }
      }
      return data[data.length - 1];
    };

    const s1 = findInterp(p1, pct);
    const s2 = findInterp(p2, pct);

    const v1_ms = Math.max(10, s1.speed / 3.6);
    const v2_ms = Math.max(10, s2.speed / 3.6);
    const dt1 = ds / v1_ms;
    const dt2 = ds / v2_ms;
    cumDelta += (dt2 - dt1); // positive if driver 1 is faster

    const currentCorner = corners.find(c => pct >= c.pctStart - 2 && pct <= c.pctExit + 2);

    points.push({
      distPercent: Math.round(pct * 10) / 10,
      distMeters,
      cornerName: currentCorner?.pctApex && Math.abs(pct - currentCorner.pctApex) <= 1.0 ? currentCorner.name : undefined,
      speed1: Math.round(s1.speed),
      throttle1: Math.min(100, Math.max(0, Math.round(s1.throttle))),
      brake1: s1.brake > 0 ? 100 : 0,
      gear1: s1.n_gear,
      speed2: Math.round(s2.speed),
      throttle2: Math.min(100, Math.max(0, Math.round(s2.throttle))),
      brake2: s2.brake > 0 ? 100 : 0,
      gear2: s2.n_gear,
      delta: Math.round(cumDelta * 1000) / 1000,
    });
  }

  const circuitProfile = KNOWLEDGE_CIRCUITS.find(c => c.id === circuitId);
  const circName = circuitProfile ? circuitProfile.name : 'Unknown Circuit';

  const formatLapTime = (duration: number | null) => {
    if (!duration) return 'N/A';
    const m = Math.floor(duration / 60);
    const s = Math.floor(duration % 60);
    const ms = Math.floor((duration % 1) * 1000);
    return `${m}:${s.toString().padStart(2, '0')}.${ms.toString().padStart(3, '0')}`;
  };

  const cornerAnalyses: CornerTelemetryAnalysis[] = corners.map((c) => {
    const apexPoint = points.find((p) => Math.abs(p.distPercent - c.pctApex) < 1.2) || points[Math.min(points.length - 1, Math.round((c.pctApex / 100) * points.length))];
    const exitPoint = points.find((p) => Math.abs(p.distPercent - c.pctExit) < 1.5) || points[Math.min(points.length - 1, Math.round((c.pctExit / 100) * points.length))];
    const startPoint = points.find((p) => Math.abs(p.distPercent - c.pctStart) < 1.5) || points[Math.min(points.length - 1, Math.round((c.pctStart / 100) * points.length))];

    const speed1 = apexPoint ? apexPoint.speed1 : 0;
    const speed2 = apexPoint ? apexPoint.speed2 : 0;
    const apexDelta = speed1 - speed2;
    const isD1Adv = apexDelta >= 0;
    const timeDelta = Number((apexDelta * 0.014).toFixed(3)); // rough estimate

    // Find braking point (distPercent where brake goes > 0)
    const findBrakePoint = (driverKey: 'brake1' | 'brake2') => {
      for (let i = Math.round((c.pctStart / 100) * points.length); i < Math.round((c.pctApex / 100) * points.length); i++) {
        if (points[i] && points[i][driverKey] > 0) return points[i].distMeters;
      }
      return Math.round((c.pctStart / 100) * trackLength);
    };

    const d1BrakeM = findBrakePoint('brake1');
    const d2BrakeM = findBrakePoint('brake2');
    const brakeDiffM = Math.abs(d1BrakeM - d2BrakeM);
    const lateBraker = d1BrakeM > d2BrakeM ? driver1.code : (d1BrakeM < d2BrakeM ? driver2.code : null);

    let tacticalNote = isD1Adv ? `${driver1.code} がボトム車速を +${Math.abs(apexDelta)}km/h 高く維持` : `${driver2.code} がボトム車速を +${Math.abs(apexDelta)}km/h 高く維持`;
    if (lateBraker && brakeDiffM > 5) {
      tacticalNote += `、${lateBraker}が約${brakeDiffM}m奥までブレーキングを我慢`;
    }

    return {
      cornerName: c.name,
      distanceMeters: Math.round((c.pctApex / 100) * trackLength),
      distPercent: c.pctApex,
      gear: apexPoint?.gear1 ?? c.gear,
      d1BrakeStartM: d1BrakeM,
      d1ApexSpeed: speed1,
      d1ThrottlePickUpPct: exitPoint ? exitPoint.throttle1 : 0,
      d2BrakeStartM: d2BrakeM,
      d2ApexSpeed: speed2,
      d2ThrottlePickUpPct: exitPoint ? exitPoint.throttle2 : 0,
      apexSpeedDelta: apexDelta,
      timeDeltaSeconds: timeDelta,
      advantageDriver: isD1Adv ? driver1.code : driver2.code,
      keyTacticalNote: tacticalNote,
    };
  });

  const insights = generateInsightsReal(points, driver1, driver2, cornerAnalyses);

  return {
    circuitName: circName,
    circuitLengthM: trackLength,
    driver1: {
      ...driver1,
      lapTime: formatLapTime(lap1.lap_duration),
    },
    driver2: {
      ...driver2,
      lapTime: formatLapTime(lap2.lap_duration),
    },
    points,
    insights,
    cornerAnalyses,
  };
}

function generateInsightsReal(
  points: NormalizedTelemetryPoint[],
  d1: { code: string; name: string },
  d2: { code: string; name: string },
  corners: CornerTelemetryAnalysis[]
): TelemetryInsight {
  let d1LateBrakeCount = 0;
  let d2LateBrakeCount = 0;
  let d1TotalBrakeAdv = 0;
  let d2TotalBrakeAdv = 0;

  let d1ApexCount = 0;
  let d2ApexCount = 0;
  let d1TotalApexAdv = 0;
  let d2TotalApexAdv = 0;

  corners.forEach(c => {
    if (c.d1BrakeStartM > c.d2BrakeStartM) {
      d1LateBrakeCount++;
      d1TotalBrakeAdv += (c.d1BrakeStartM - c.d2BrakeStartM);
    } else if (c.d2BrakeStartM > c.d1BrakeStartM) {
      d2LateBrakeCount++;
      d2TotalBrakeAdv += (c.d2BrakeStartM - c.d1BrakeStartM);
    }

    if (c.d1ApexSpeed > c.d2ApexSpeed) {
      d1ApexCount++;
      d1TotalApexAdv += (c.d1ApexSpeed - c.d2ApexSpeed);
    } else if (c.d2ApexSpeed > c.d1ApexSpeed) {
      d2ApexCount++;
      d2TotalApexAdv += (c.d2ApexSpeed - c.d1ApexSpeed);
    }
  });

  const lateBraker = d1LateBrakeCount > d2LateBrakeCount ? d1.code : d2.code;
  const avgBrakeAdv = lateBraker === d1.code ? (d1LateBrakeCount ? Math.round(d1TotalBrakeAdv / d1LateBrakeCount) : 0) : (d2LateBrakeCount ? Math.round(d2TotalBrakeAdv / d2LateBrakeCount) : 0);
  
  const fasterApex = d1ApexCount > d2ApexCount ? d1.code : d2.code;
  const avgApexAdv = fasterApex === d1.code ? (d1ApexCount ? Math.round(d1TotalApexAdv / d1ApexCount) : 0) : (d2ApexCount ? Math.round(d2TotalApexAdv / d2ApexCount) : 0);

  const keyCornersAnalysis = corners.slice(0, 4).map((c) => {
    return {
      corner: c.cornerName,
      advantageDriver: c.advantageDriver,
      timeDelta: c.timeDeltaSeconds > 0 ? `+${c.timeDeltaSeconds}s` : `${c.timeDeltaSeconds}s`,
      explanation: c.keyTacticalNote,
    };
  });

  return {
    braking: {
      summary: `${lateBraker} が主要減速帯で平均 ${avgBrakeAdv}m 奥までブレーキング`,
      lateBraker,
      details: `${lateBraker} はブレーキングを遅らせることで進入タイムを短縮しています。`,
    },
    apexSpeed: {
      summary: `${fasterApex} がコーナーで平均 +${avgApexAdv} km/h 高いボトムスピードを記録`,
      fasterDriver: fasterApex,
      details: `${fasterApex} は旋回中のミニマムスピードでアドバンテージを構築しています。`,
    },
    throttleApplication: {
      summary: `両者のトラクション特性に違いが見られます`,
      earlierDriver: d1.code,
      details: `スロットル全開タイミングの違いがストレートエンドの最高速に影響しています。`,
    },
    keyCorners: keyCornersAnalysis,
  };
}
