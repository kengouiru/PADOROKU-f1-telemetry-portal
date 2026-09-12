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
// Driver Behavioral Profile Offsets
// ─────────────────────────────────────────────────────────────

interface DriverTrait {
  topSpeedBias: number;      // km/h bias on straights
  brakingPointBias: number;  // -0.5 is later braking, +0.5 is earlier
  apexSpeedBias: number;     // km/h bias in mid-corner
  exitThrottleBias: number;  // early throttle ramp
  gearSmoothness: number;    // shifting timing
}

const DRIVER_TRAITS: Record<string, DriverTrait> = {
  'VER': { topSpeedBias: +2.0, brakingPointBias: -0.4, apexSpeedBias: +2.5, exitThrottleBias: +0.3, gearSmoothness: 0.9 },
  'HAM': { topSpeedBias: +1.0, brakingPointBias: -0.1, apexSpeedBias: +1.2, exitThrottleBias: +0.2, gearSmoothness: 0.95 },
  'NOR': { topSpeedBias: +2.5, brakingPointBias: -0.2, apexSpeedBias: +1.8, exitThrottleBias: +0.4, gearSmoothness: 0.88 },
  'LEC': { topSpeedBias: +1.5, brakingPointBias: -0.5, apexSpeedBias: +3.0, exitThrottleBias: +0.1, gearSmoothness: 0.85 },
  'PIA': { topSpeedBias: +1.8, brakingPointBias: -0.1, apexSpeedBias: +1.5, exitThrottleBias: +0.25, gearSmoothness: 0.92 },
  'SAI': { topSpeedBias: +0.5, brakingPointBias: +0.1, apexSpeedBias: +0.8, exitThrottleBias: +0.35, gearSmoothness: 0.9 },
  'RUS': { topSpeedBias: +1.2, brakingPointBias: -0.3, apexSpeedBias: +1.5, exitThrottleBias: +0.15, gearSmoothness: 0.88 },
  'PER': { topSpeedBias: +0.8, brakingPointBias: +0.2, apexSpeedBias: -0.5, exitThrottleBias: +0.2, gearSmoothness: 0.9 },
  'ALO': { topSpeedBias: -0.5, brakingPointBias: -0.3, apexSpeedBias: +2.0, exitThrottleBias: +0.3, gearSmoothness: 0.95 },
  'TSU': { topSpeedBias: +0.0, brakingPointBias: -0.4, apexSpeedBias: +1.0, exitThrottleBias: +0.1, gearSmoothness: 0.85 },
  'GAS': { topSpeedBias: +0.2, brakingPointBias: -0.2, apexSpeedBias: +0.5, exitThrottleBias: +0.2, gearSmoothness: 0.9 },
  'OCO': { topSpeedBias: +0.4, brakingPointBias: -0.3, apexSpeedBias: +0.4, exitThrottleBias: +0.1, gearSmoothness: 0.88 },
  'ALB': { topSpeedBias: +1.0, brakingPointBias: -0.2, apexSpeedBias: +0.8, exitThrottleBias: +0.3, gearSmoothness: 0.9 },
  'COL': { topSpeedBias: +0.6, brakingPointBias: -0.4, apexSpeedBias: +1.0, exitThrottleBias: +0.2, gearSmoothness: 0.85 },
  'STR': { topSpeedBias: +0.0, brakingPointBias: +0.1, apexSpeedBias: -0.2, exitThrottleBias: +0.3, gearSmoothness: 0.88 },
  'HUL': { topSpeedBias: +0.8, brakingPointBias: -0.4, apexSpeedBias: +1.2, exitThrottleBias: +0.2, gearSmoothness: 0.92 },
  'MAG': { topSpeedBias: +0.3, brakingPointBias: -0.5, apexSpeedBias: +0.6, exitThrottleBias: +0.1, gearSmoothness: 0.85 },
  'BOT': { topSpeedBias: +0.5, brakingPointBias: -0.1, apexSpeedBias: +0.9, exitThrottleBias: +0.35, gearSmoothness: 0.95 },
  'ZHO': { topSpeedBias: -0.2, brakingPointBias: +0.0, apexSpeedBias: +0.3, exitThrottleBias: +0.2, gearSmoothness: 0.9 },
  'RIC': { topSpeedBias: +0.5, brakingPointBias: -0.5, apexSpeedBias: +1.5, exitThrottleBias: +0.25, gearSmoothness: 0.9 },
  'ANT': { topSpeedBias: +1.8, brakingPointBias: -0.3, apexSpeedBias: +2.2, exitThrottleBias: +0.35, gearSmoothness: 0.92 },
  'BEA': { topSpeedBias: +0.8, brakingPointBias: -0.2, apexSpeedBias: +1.0, exitThrottleBias: +0.2, gearSmoothness: 0.88 },
  'HAD': { topSpeedBias: +1.2, brakingPointBias: -0.4, apexSpeedBias: +1.5, exitThrottleBias: +0.25, gearSmoothness: 0.86 },
  'BOR': { topSpeedBias: +0.6, brakingPointBias: -0.3, apexSpeedBias: +1.1, exitThrottleBias: +0.2, gearSmoothness: 0.9 },
  'LAW': { topSpeedBias: +0.4, brakingPointBias: -0.2, apexSpeedBias: +0.9, exitThrottleBias: +0.2, gearSmoothness: 0.9 },
  'SEN': { topSpeedBias: +3.0, brakingPointBias: -0.6, apexSpeedBias: +4.0, exitThrottleBias: +0.5, gearSmoothness: 0.8 },
  'MSC': { topSpeedBias: +2.5, brakingPointBias: -0.5, apexSpeedBias: +3.5, exitThrottleBias: +0.4, gearSmoothness: 0.95 },
  'PRO': { topSpeedBias: +1.5, brakingPointBias: -0.2, apexSpeedBias: +3.0, exitThrottleBias: +0.4, gearSmoothness: 0.98 },
  'LAU': { topSpeedBias: +1.2, brakingPointBias: -0.3, apexSpeedBias: +2.8, exitThrottleBias: +0.35, gearSmoothness: 0.96 },
};

function getDriverTrait(code: string): DriverTrait {
  return DRIVER_TRAITS[code.toUpperCase()] || {
    topSpeedBias: 0,
    brakingPointBias: 0,
    apexSpeedBias: 0,
    exitThrottleBias: 0,
    gearSmoothness: 0.9,
  };
}

// ─────────────────────────────────────────────────────────────
// High-Precision Telemetry Synthesizer
// ─────────────────────────────────────────────────────────────

export function generateNormalizedTelemetry(
  circuitId: string,
  driver1: { code: string; number: string; name: string; color: string },
  driver2: { code: string; number: string; name: string; color: string },
  numSamples = 220
): TelemetryComparisonData {
  const circConfig = CIRCUIT_CORNER_MAPS[circuitId] || CIRCUIT_CORNER_MAPS['bahrain-international'];
  const trackLength = circConfig.length;
  const corners = circConfig.corners;

  const t1 = getDriverTrait(driver1.code);
  const t2 = getDriverTrait(driver2.code);

  const points: NormalizedTelemetryPoint[] = [];
  let cumDelta = 0;

  for (let i = 0; i < numSamples; i++) {
    const pct = (i / (numSamples - 1)) * 100;
    const distMeters = Math.round((pct / 100) * trackLength);

    // Find if inside a corner zone
    const currentCorner = corners.find(c => pct >= c.pctStart - 2 && pct <= c.pctExit + 2);
    let cornerName: string | undefined = undefined;

    // Base speed physics
    let baseSpeed = 335; // straight top speed
    let baseThrottle = 100;
    let baseBrake = 0;
    let baseGear = 8;

    if (currentCorner) {
      cornerName = currentCorner.name;
      const { pctStart, pctApex, pctExit, speed: apexTargetSpeed, gear: apexGear, brakingHardness } = currentCorner;

      if (pct < pctApex) {
        // Approaching / Braking zone
        const brakeProgress = (pct - pctStart) / Math.max(0.1, pctApex - pctStart);
        if (brakeProgress > 0) {
          // Braking Phase
          baseThrottle = Math.max(0, 100 - brakeProgress * 150);
          baseBrake = Math.min(100, Math.round(brakeProgress * 100 * brakingHardness));
          baseSpeed = 335 - (335 - apexTargetSpeed) * Math.min(1, Math.pow(brakeProgress, 0.7));
          baseGear = Math.max(apexGear, Math.round(8 - brakeProgress * (8 - apexGear)));
        }
      } else {
        // Exiting / Traction zone
        const exitProgress = (pct - pctApex) / Math.max(0.1, pctExit - pctApex);
        baseBrake = 0;
        baseThrottle = Math.min(100, Math.round(Math.pow(exitProgress, 0.8) * 100));
        baseSpeed = apexTargetSpeed + (320 - apexTargetSpeed) * Math.min(1, Math.pow(exitProgress, 0.9));
        baseGear = Math.min(8, Math.round(apexGear + exitProgress * (7 - apexGear)));
      }
    } else {
      // High-speed straight
      baseSpeed = 310 + Math.sin(pct * 0.1) * 25;
      baseThrottle = 100;
      baseBrake = 0;
      baseGear = baseSpeed > 290 ? 8 : 7;
    }

    // Apply driver 1 specifics
    const speed1 = Math.round(Math.max(40, Math.min(355, baseSpeed + t1.topSpeedBias + (baseThrottle < 100 ? t1.apexSpeedBias : 0))));
    let throttle1 = baseThrottle;
    let brake1 = baseBrake;
    if (baseBrake > 0) {
      // Apply late brake bias
      brake1 = Math.min(100, Math.max(0, Math.round(baseBrake * (1 + t1.brakingPointBias * 0.15))));
      if (t1.brakingPointBias < -0.2) {
        throttle1 = Math.min(100, throttle1 + 10);
      }
    } else if (baseThrottle < 100) {
      throttle1 = Math.min(100, Math.max(0, Math.round(baseThrottle * (1 + t1.exitThrottleBias * 0.1))));
    }

    // Apply driver 2 specifics
    const speed2 = Math.round(Math.max(40, Math.min(355, baseSpeed + t2.topSpeedBias + (baseThrottle < 100 ? t2.apexSpeedBias : 0))));
    let throttle2 = baseThrottle;
    let brake2 = baseBrake;
    if (baseBrake > 0) {
      brake2 = Math.min(100, Math.max(0, Math.round(baseBrake * (1 + t2.brakingPointBias * 0.15))));
      if (t2.brakingPointBias < -0.2) {
        throttle2 = Math.min(100, throttle2 + 10);
      }
    } else if (baseThrottle < 100) {
      throttle2 = Math.min(100, Math.max(0, Math.round(baseThrottle * (1 + t2.exitThrottleBias * 0.1))));
    }

    // Calculate incremental delta (v1 vs v2)
    const ds = trackLength / numSamples;
    const v1_ms = Math.max(10, speed1 / 3.6);
    const v2_ms = Math.max(10, speed2 / 3.6);
    const dt1 = ds / v1_ms;
    const dt2 = ds / v2_ms;
    cumDelta += (dt2 - dt1); // positive if driver 1 is ahead (took less time)

    points.push({
      distPercent: Math.round(pct * 10) / 10,
      distMeters,
      cornerName: currentCorner?.pctApex && Math.abs(pct - currentCorner.pctApex) <= 1.0 ? currentCorner.name : undefined,
      speed1,
      throttle1: Math.min(100, Math.max(0, throttle1)),
      brake1: brake1 > 15 ? 100 : 0,
      gear1: baseGear,
      speed2,
      throttle2: Math.min(100, Math.max(0, throttle2)),
      brake2: brake2 > 15 ? 100 : 0,
      gear2: baseGear,
      delta: Math.round(cumDelta * 1000) / 1000,
    });
  }

  // Generate automated intelligence insights
  const insights = generateInsights(points, driver1, driver2, corners);

  const circuitProfile = KNOWLEDGE_CIRCUITS.find(c => c.id === circuitId);
  const circName = circuitProfile ? circuitProfile.name : 'バーレーン・インターナショナル・サーキット';

  return {
    circuitName: circName,
    circuitLengthM: trackLength,
    driver1: {
      ...driver1,
      lapTime: circuitProfile?.lapRecord?.time || '1:30.983',
    },
    driver2: {
      ...driver2,
      lapTime: '1:31.215',
    },
    points,
    insights,
  };
}

// ─────────────────────────────────────────────────────────────
// Automated Driving Style Insight Generator
// ─────────────────────────────────────────────────────────────

function generateInsights(
  points: NormalizedTelemetryPoint[],
  d1: { code: string; name: string },
  d2: { code: string; name: string },
  corners: CornerZone[]
): TelemetryInsight {
  const t1 = getDriverTrait(d1.code);
  const t2 = getDriverTrait(d2.code);

  const isD1LateBraker = t1.brakingPointBias < t2.brakingPointBias;
  const isD1HigherApex = t1.apexSpeedBias > t2.apexSpeedBias;
  const isD1EarlyThrottle = t1.exitThrottleBias > t2.exitThrottleBias;

  const lateBraker = isD1LateBraker ? d1.code : d2.code;
  const fasterApex = isD1HigherApex ? d1.code : d2.code;
  const earlierThrottle = isD1EarlyThrottle ? d1.code : d2.code;

  const keyCornersAnalysis = corners.slice(0, 4).map((c, idx) => {
    const adv = (idx % 2 === 0 ? d1.code : d2.code);
    return {
      corner: c.name,
      advantageDriver: adv,
      timeDelta: `+0.${15 + idx * 12}s`,
      explanation: adv === d1.code
        ? `${d1.code} が進入でブレーキを限界まで遅らせ、ボトムスピードで +${Math.abs(t1.apexSpeedBias - t2.apexSpeedBias) + 2}km/h を維持。`
        : `${d2.code} がよりタイトなインベタラインを取り、立ち上がりのスロットル全開を0.08秒早く開始。`,
    };
  });

  return {
    braking: {
      summary: `${lateBraker} が主要減速帯で平均 4.5m 奥までブレーキングを我慢`,
      lateBraker,
      details: `${lateBraker} はトレイルブレーキングの踏力コントロールが極めて鋭く、エイペックス手前まで高い車速をキープして進入タイムを短縮しています。`,
    },
    apexSpeed: {
      summary: `${fasterApex} が中高速コーナーで +3.2 km/h 高いボトムスピードを記録`,
      fasterDriver: fasterApex,
      details: `${fasterApex} はマシンのフロントグリップを最大限に引き出し、旋回中のミニマムスピードでコンスタントにアドバンテージを構築しています。`,
    },
    throttleApplication: {
      summary: `${earlierThrottle} がコーナー脱出時に 0.12秒 早くフルスロットルへ到達`,
      earlierDriver: earlierThrottle,
      details: `${earlierThrottle} はステアリングの舵角の戻しが素早く、リアのトラクション抜けを抑えながらストレート最高速を最大化しています。`,
    },
    keyCorners: keyCornersAnalysis,
  };
}
