/**
 * lib/raceSimulationEngine.ts
 * 🏎️ High-Fidelity F1 Race Simulation & Tactical Physics Engine
 *
 * Implements:
 * - 24 Official Grand Prix Circuit Profiles
 * - Full 11 Teams & 22 Drivers with Teammate Dynamics
 * - Double-Stack Pit Stop queueing & penalty calculation (+4.5s)
 * - Dual-layer Tyre Thermodynamics (Surface temp vs Bulk/Core temp)
 * - Graining & Blistering threshold models
 * - Weather Doppler Radar (Cloud distance, approach vector, water depth mm & compound crossover)
 * - Interactive Driver Radio Dialogues with Decision Trees
 * - Web Audio API F1 Transceiver Radio Beep Synthesizer
 * - 3 Gameplay Modes: Sprint Full Race (15-19 laps), Crisis Moments (5-8 laps), Procedural Random Crises
 * - 100-Point 4-Axis Tactical Scoring Engine & Glossary/Library Keyword Linker
 */

import {
  playF1IncomingRadioChirp,
  playF1OutgoingRadioBeep,
  ensureAudioContextResumed,
} from './radioAudioEffect';

export {
  playF1IncomingRadioChirp,
  playF1OutgoingRadioBeep,
  ensureAudioContextResumed,
};

export type TyreCompound = 'SOFT' | 'MEDIUM' | 'HARD' | 'INTER' | 'WET';
export type DownforceSetup = 'low' | 'balanced' | 'high';
export type EnginePUMode = 'push' | 'standard' | 'conserve';
export type ERSStrategy = 'balanced' | 'attack' | 'recharge';
export type WeatherType = 'dry' | 'variable' | 'drizzle' | 'monsoon';
export type IncidentFrequency = 'none' | 'realistic' | 'high_chaos';
export type TeamOrderType = 'none' | 'swap' | 'defend';
export type TrackPhase = 'DRY' | 'DRYING_LINE' | 'DAMP' | 'WET' | 'FLOODED';
export type IncidentRiskLevel = 'LOW' | 'ELEVATED' | 'HIGH' | 'CRITICAL';

// ── Circuit Profiles (All 24 Official Grand Prix) ─────────────────────────────

export interface CircuitSimProfile {
  id: string;
  name: string;
  city: string;
  country: string;
  flag: string;
  totalLaps: number;
  sprintLaps: number; // For Sprint race mode
  circuitLengthM: number; // circuit length in meters (e.g. 5807 for Suzuka)
  baseLapTime: number; // in seconds (dry baseline)
  pitLaneLoss: number; // in seconds (travel loss without static service)
  tyreAggression: number; // 1.0 (gentle) to 1.6 (brutal wear)
  overtakeDifficulty: number; // 1.0 (easy like Monza) to 1.9 (Monaco)
}

export const SIM_CIRCUITS: CircuitSimProfile[] = [
  {
    id: 'melbourne',
    name: 'アルバート・パーク (オーストラリア)',
    city: 'Melbourne',
    country: 'Australia',
    flag: '🇦🇺',
    totalLaps: 58,
    sprintLaps: 19,
    circuitLengthM: 5278,
    baseLapTime: 78.5,
    pitLaneLoss: 20.0,
    tyreAggression: 1.25,
    overtakeDifficulty: 1.3,
  },
  {
    id: 'shanghai',
    name: '上海インターナショナル (中国)',
    city: 'Shanghai',
    country: 'China',
    flag: '🇨🇳',
    totalLaps: 56,
    sprintLaps: 19,
    circuitLengthM: 5451,
    baseLapTime: 94.0,
    pitLaneLoss: 22.5,
    tyreAggression: 1.4,
    overtakeDifficulty: 1.15,
  },
  {
    id: 'suzuka',
    name: '鈴鹿サーキット (日本)',
    city: 'Suzuka',
    country: 'Japan',
    flag: '🇯🇵',
    totalLaps: 53,
    sprintLaps: 17,
    circuitLengthM: 5807,
    baseLapTime: 90.0,
    pitLaneLoss: 22.0,
    tyreAggression: 1.5,
    overtakeDifficulty: 1.35,
  },
  {
    id: 'bahrain',
    name: 'バーレーン・インターナショナル',
    city: 'Sakhir',
    country: 'Bahrain',
    flag: '🇧🇭',
    totalLaps: 57,
    sprintLaps: 19,
    circuitLengthM: 5412,
    baseLapTime: 91.5,
    pitLaneLoss: 21.0,
    tyreAggression: 1.55,
    overtakeDifficulty: 1.15,
  },
  {
    id: 'jeddah',
    name: 'ジェッダ・コーニッシュ (サウジアラビア)',
    city: 'Jeddah',
    country: 'Saudi Arabia',
    flag: '🇸🇦',
    totalLaps: 50,
    sprintLaps: 16,
    circuitLengthM: 6174,
    baseLapTime: 88.5,
    pitLaneLoss: 19.5,
    tyreAggression: 1.05,
    overtakeDifficulty: 1.25,
  },
  {
    id: 'miami',
    name: 'マイアミ・インターナショナル (アメリカ)',
    city: 'Miami',
    country: 'USA',
    flag: '🇺🇸',
    totalLaps: 57,
    sprintLaps: 19,
    circuitLengthM: 5412,
    baseLapTime: 89.0,
    pitLaneLoss: 20.5,
    tyreAggression: 1.2,
    overtakeDifficulty: 1.2,
  },
  {
    id: 'imola',
    name: 'イモラ・サーキット (イタリア)',
    city: 'Imola',
    country: 'Italy',
    flag: '🇮🇹',
    totalLaps: 63,
    sprintLaps: 21,
    circuitLengthM: 4909,
    baseLapTime: 76.0,
    pitLaneLoss: 24.0,
    tyreAggression: 1.2,
    overtakeDifficulty: 1.6,
  },
  {
    id: 'monaco',
    name: 'モナコ市街地コース (モナコ)',
    city: 'Monte Carlo',
    country: 'Monaco',
    flag: '🇲🇨',
    totalLaps: 78,
    sprintLaps: 25,
    circuitLengthM: 3337,
    baseLapTime: 74.0,
    pitLaneLoss: 18.0,
    tyreAggression: 0.85,
    overtakeDifficulty: 1.9,
  },
  {
    id: 'barcelona',
    name: 'カタロニア・サーキット (スペイン)',
    city: 'Barcelona',
    country: 'Spain',
    flag: '🇪🇸',
    totalLaps: 66,
    sprintLaps: 22,
    circuitLengthM: 4657,
    baseLapTime: 76.5,
    pitLaneLoss: 21.0,
    tyreAggression: 1.45,
    overtakeDifficulty: 1.4,
  },
  {
    id: 'montreal',
    name: 'ジル・ヴィルヌーヴ (カナダ)',
    city: 'Montreal',
    country: 'Canada',
    flag: '🇨🇦',
    totalLaps: 70,
    sprintLaps: 23,
    circuitLengthM: 4361,
    baseLapTime: 73.0,
    pitLaneLoss: 18.5,
    tyreAggression: 1.1,
    overtakeDifficulty: 1.2,
  },
  {
    id: 'spielberg',
    name: 'レッドブル・リンク (オーストリア)',
    city: 'Spielberg',
    country: 'Austria',
    flag: '🇦🇹',
    totalLaps: 71,
    sprintLaps: 24,
    circuitLengthM: 4318,
    baseLapTime: 66.0,
    pitLaneLoss: 19.0,
    tyreAggression: 1.3,
    overtakeDifficulty: 1.1,
  },
  {
    id: 'silverstone',
    name: 'シルバーストン (イギリス)',
    city: 'Silverstone',
    country: 'UK',
    flag: '🇬🇧',
    totalLaps: 52,
    sprintLaps: 17,
    circuitLengthM: 5891,
    baseLapTime: 87.5,
    pitLaneLoss: 20.0,
    tyreAggression: 1.45,
    overtakeDifficulty: 1.2,
  },
  {
    id: 'spa',
    name: 'スパ・フランコルシャン (ベルギー)',
    city: 'Spa',
    country: 'Belgium',
    flag: '🇧🇪',
    totalLaps: 44,
    sprintLaps: 15,
    circuitLengthM: 7004,
    baseLapTime: 104.5,
    pitLaneLoss: 21.5,
    tyreAggression: 1.35,
    overtakeDifficulty: 1.1,
  },
  {
    id: 'hungaroring',
    name: 'ハンガロリンク (ハンガリー)',
    city: 'Budapest',
    country: 'Hungary',
    flag: '🇭🇺',
    totalLaps: 70,
    sprintLaps: 23,
    circuitLengthM: 4381,
    baseLapTime: 78.0,
    pitLaneLoss: 20.5,
    tyreAggression: 1.3,
    overtakeDifficulty: 1.65,
  },
  {
    id: 'zandvoort',
    name: 'ザントフォールト (オランダ)',
    city: 'Zandvoort',
    country: 'Netherlands',
    flag: '🇳🇱',
    totalLaps: 72,
    sprintLaps: 24,
    circuitLengthM: 4259,
    baseLapTime: 71.5,
    pitLaneLoss: 21.0,
    tyreAggression: 1.4,
    overtakeDifficulty: 1.55,
  },
  {
    id: 'monza',
    name: 'モンツァ・サーキット (イタリア)',
    city: 'Monza',
    country: 'Italy',
    flag: '🇮🇹',
    totalLaps: 53,
    sprintLaps: 18,
    circuitLengthM: 5793,
    baseLapTime: 81.0,
    pitLaneLoss: 23.5,
    tyreAggression: 1.1,
    overtakeDifficulty: 1.05,
  },
  {
    id: 'madrid',
    name: 'マドリング (スペイン・マドリード)',
    city: 'Madrid',
    country: 'Spain',
    flag: '🇪🇸',
    totalLaps: 55,
    sprintLaps: 18,
    circuitLengthM: 5474,
    baseLapTime: 86.0,
    pitLaneLoss: 21.0,
    tyreAggression: 1.25,
    overtakeDifficulty: 1.35,
  },
  {
    id: 'baku',
    name: 'バクー市街地コース (アゼルバイジャン)',
    city: 'Baku',
    country: 'Azerbaijan',
    flag: '🇦🇿',
    totalLaps: 51,
    sprintLaps: 17,
    circuitLengthM: 6003,
    baseLapTime: 102.0,
    pitLaneLoss: 21.0,
    tyreAggression: 1.1,
    overtakeDifficulty: 1.15,
  },
  {
    id: 'singapore',
    name: 'マリーナベイ市街地 (シンガポール)',
    city: 'Marina Bay',
    country: 'Singapore',
    flag: '🇸🇬',
    totalLaps: 62,
    sprintLaps: 20,
    circuitLengthM: 4940,
    baseLapTime: 96.0,
    pitLaneLoss: 25.0,
    tyreAggression: 1.25,
    overtakeDifficulty: 1.65,
  },
  {
    id: 'austin',
    name: 'サーキット・オブ・ジ・アメリカズ (COTA)',
    city: 'Austin',
    country: 'USA',
    flag: '🇺🇸',
    totalLaps: 56,
    sprintLaps: 19,
    circuitLengthM: 5513,
    baseLapTime: 96.5,
    pitLaneLoss: 20.5,
    tyreAggression: 1.4,
    overtakeDifficulty: 1.2,
  },
  {
    id: 'mexico',
    name: 'エルマノス・ロドリゲス (メキシコ)',
    city: 'Mexico City',
    country: 'Mexico',
    flag: '🇲🇽',
    totalLaps: 71,
    sprintLaps: 24,
    circuitLengthM: 4304,
    baseLapTime: 78.5,
    pitLaneLoss: 21.5,
    tyreAggression: 1.15,
    overtakeDifficulty: 1.3,
  },
  {
    id: 'interlagos',
    name: 'インテルラゴス (ブラジル)',
    city: 'São Paulo',
    country: 'Brazil',
    flag: '🇧🇷',
    totalLaps: 71,
    sprintLaps: 24,
    circuitLengthM: 4309,
    baseLapTime: 71.0,
    pitLaneLoss: 20.0,
    tyreAggression: 1.4,
    overtakeDifficulty: 1.15,
  },
  {
    id: 'las_vegas',
    name: 'ラスベガス・ストリップ (アメリカ)',
    city: 'Las Vegas',
    country: 'USA',
    flag: '🇺🇸',
    totalLaps: 50,
    sprintLaps: 16,
    circuitLengthM: 6201,
    baseLapTime: 93.0,
    pitLaneLoss: 19.5,
    tyreAggression: 1.05,
    overtakeDifficulty: 1.1,
  },
  {
    id: 'losail',
    name: 'ルサイル・インターナショナル (カタール)',
    city: 'Lusail',
    country: 'Qatar',
    flag: '🇶🇦',
    totalLaps: 57,
    sprintLaps: 19,
    circuitLengthM: 5419,
    baseLapTime: 84.0,
    pitLaneLoss: 23.0,
    tyreAggression: 1.6,
    overtakeDifficulty: 1.3,
  },
  {
    id: 'yas_marina',
    name: 'ヤス・マリーナ (アブダビ)',
    city: 'Abu Dhabi',
    country: 'UAE',
    flag: '🇦🇪',
    totalLaps: 58,
    sprintLaps: 19,
    circuitLengthM: 5281,
    baseLapTime: 86.0,
    pitLaneLoss: 21.0,
    tyreAggression: 1.25,
    overtakeDifficulty: 1.35,
  },
];

// ── Machine & Driver Strategy Configuration ────────────────────────────────────

export interface MachineSetup {
  downforce: DownforceSetup;
  puMode: EnginePUMode;
  ersStrategy: ERSStrategy;
}

export interface DriverSimConfig {
  code: string;
  name: string;
  number: string;
  team: string;
  color: string;
  teammateCode?: string;
  basePaceOffset: number; // +/- seconds relative to car baseline
  machineSetup: MachineSetup;
  startTyre: TyreCompound;
  pit1Lap: number;
  pit1Tyre: TyreCompound;
  pit2Lap?: number;
  pit2Tyre?: TyreCompound;
  crewStopTime: number;
  isPlayer?: boolean;
  // Scenario initial thermal & wear presets
  initialTyreAge?: number;
  initialTyreSurfaceTemp?: number;
  initialTyreCoreTemp?: number;
}

// ── Full 11 Teams Grid (2026/2025 Roster with Teammates) ───────────────────────

export const GRID_DRIVERS: DriverSimConfig[] = [
  // Racing Bulls (RB)
  {
    code: 'TSU',
    name: 'Yuki Tsunoda',
    number: '22',
    team: 'Racing Bulls',
    color: '#06b6d4',
    teammateCode: 'LAW',
    basePaceOffset: 0.28,
    machineSetup: { downforce: 'balanced', puMode: 'standard', ersStrategy: 'balanced' },
    startTyre: 'SOFT',
    pit1Lap: 14,
    pit1Tyre: 'HARD',
    crewStopTime: 2.3,
    isPlayer: true,
  },
  {
    code: 'LAW',
    name: 'Liam Lawson',
    number: '30',
    team: 'Racing Bulls',
    color: '#0284c7',
    teammateCode: 'TSU',
    basePaceOffset: 0.35,
    machineSetup: { downforce: 'balanced', puMode: 'standard', ersStrategy: 'balanced' },
    startTyre: 'MEDIUM',
    pit1Lap: 16,
    pit1Tyre: 'HARD',
    crewStopTime: 2.4,
  },
  // Red Bull Racing
  {
    code: 'VER',
    name: 'Max Verstappen',
    number: '1',
    team: 'Red Bull Racing',
    color: '#3b82f6',
    teammateCode: 'HAD',
    basePaceOffset: 0.0,
    machineSetup: { downforce: 'balanced', puMode: 'standard', ersStrategy: 'balanced' },
    startTyre: 'MEDIUM',
    pit1Lap: 22,
    pit1Tyre: 'HARD',
    crewStopTime: 2.1,
  },
  {
    code: 'HAD',
    name: 'Isack Hadjar',
    number: '6',
    team: 'Red Bull Racing',
    color: '#1d4ed8',
    teammateCode: 'VER',
    basePaceOffset: 0.30,
    machineSetup: { downforce: 'balanced', puMode: 'standard', ersStrategy: 'balanced' },
    startTyre: 'MEDIUM',
    pit1Lap: 20,
    pit1Tyre: 'HARD',
    crewStopTime: 2.2,
  },
  // McLaren
  {
    code: 'NOR',
    name: 'Lando Norris',
    number: '4',
    team: 'McLaren',
    color: '#f97316',
    teammateCode: 'PIA',
    basePaceOffset: 0.08,
    machineSetup: { downforce: 'high', puMode: 'standard', ersStrategy: 'balanced' },
    startTyre: 'MEDIUM',
    pit1Lap: 21,
    pit1Tyre: 'HARD',
    crewStopTime: 2.2,
  },
  {
    code: 'PIA',
    name: 'Oscar Piastri',
    number: '81',
    team: 'McLaren',
    color: '#fb923c',
    teammateCode: 'NOR',
    basePaceOffset: 0.15,
    machineSetup: { downforce: 'high', puMode: 'standard', ersStrategy: 'balanced' },
    startTyre: 'MEDIUM',
    pit1Lap: 23,
    pit1Tyre: 'HARD',
    crewStopTime: 2.3,
  },
  // Ferrari
  {
    code: 'LEC',
    name: 'Charles Leclerc',
    number: '16',
    team: 'Ferrari',
    color: '#ef4444',
    teammateCode: 'HAM',
    basePaceOffset: 0.12,
    machineSetup: { downforce: 'balanced', puMode: 'standard', ersStrategy: 'balanced' },
    startTyre: 'SOFT',
    pit1Lap: 15,
    pit1Tyre: 'HARD',
    crewStopTime: 2.5,
  },
  {
    code: 'HAM',
    name: 'Lewis Hamilton',
    number: '44',
    team: 'Ferrari',
    color: '#b91c1c',
    teammateCode: 'LEC',
    basePaceOffset: 0.18,
    machineSetup: { downforce: 'balanced', puMode: 'standard', ersStrategy: 'balanced' },
    startTyre: 'HARD',
    pit1Lap: 28,
    pit1Tyre: 'MEDIUM',
    crewStopTime: 2.4,
  },
  // Mercedes
  {
    code: 'RUS',
    name: 'George Russell',
    number: '63',
    team: 'Mercedes',
    color: '#22c55e',
    teammateCode: 'ANT',
    basePaceOffset: 0.14,
    machineSetup: { downforce: 'low', puMode: 'standard', ersStrategy: 'balanced' },
    startTyre: 'MEDIUM',
    pit1Lap: 19,
    pit1Tyre: 'HARD',
    crewStopTime: 2.3,
  },
  {
    code: 'ANT',
    name: 'Kimi Antonelli',
    number: '12',
    team: 'Mercedes',
    color: '#16a34a',
    teammateCode: 'RUS',
    basePaceOffset: 0.22,
    machineSetup: { downforce: 'low', puMode: 'standard', ersStrategy: 'balanced' },
    startTyre: 'SOFT',
    pit1Lap: 13,
    pit1Tyre: 'HARD',
    crewStopTime: 2.4,
  },
  // Aston Martin
  {
    code: 'ALO',
    name: 'Fernando Alonso',
    number: '14',
    team: 'Aston Martin',
    color: '#059669',
    teammateCode: 'STR',
    basePaceOffset: 0.32,
    machineSetup: { downforce: 'balanced', puMode: 'standard', ersStrategy: 'balanced' },
    startTyre: 'MEDIUM',
    pit1Lap: 18,
    pit1Tyre: 'HARD',
    crewStopTime: 2.4,
  },
  {
    code: 'STR',
    name: 'Lance Stroll',
    number: '18',
    team: 'Aston Martin',
    color: '#047857',
    teammateCode: 'ALO',
    basePaceOffset: 0.55,
    machineSetup: { downforce: 'balanced', puMode: 'standard', ersStrategy: 'balanced' },
    startTyre: 'HARD',
    pit1Lap: 27,
    pit1Tyre: 'MEDIUM',
    crewStopTime: 2.6,
  },
  // Williams
  {
    code: 'SAI',
    name: 'Carlos Sainz',
    number: '55',
    team: 'Williams',
    color: '#0284c7',
    teammateCode: 'ALB',
    basePaceOffset: 0.38,
    machineSetup: { downforce: 'low', puMode: 'standard', ersStrategy: 'balanced' },
    startTyre: 'MEDIUM',
    pit1Lap: 17,
    pit1Tyre: 'HARD',
    crewStopTime: 2.5,
  },
  {
    code: 'ALB',
    name: 'Alexander Albon',
    number: '23',
    team: 'Williams',
    color: '#0369a1',
    teammateCode: 'SAI',
    basePaceOffset: 0.42,
    machineSetup: { downforce: 'low', puMode: 'standard', ersStrategy: 'balanced' },
    startTyre: 'HARD',
    pit1Lap: 26,
    pit1Tyre: 'MEDIUM',
    crewStopTime: 2.5,
  },
  // Alpine
  {
    code: 'GAS',
    name: 'Pierre Gasly',
    number: '10',
    team: 'Alpine',
    color: '#0090ff',
    teammateCode: 'COL',
    basePaceOffset: 0.40,
    machineSetup: { downforce: 'balanced', puMode: 'standard', ersStrategy: 'balanced' },
    startTyre: 'MEDIUM',
    pit1Lap: 18,
    pit1Tyre: 'HARD',
    crewStopTime: 2.6,
  },
  {
    code: 'COL',
    name: 'Franco Colapinto',
    number: '43',
    team: 'Alpine',
    color: '#0070cc',
    teammateCode: 'GAS',
    basePaceOffset: 0.45,
    machineSetup: { downforce: 'balanced', puMode: 'standard', ersStrategy: 'balanced' },
    startTyre: 'HARD',
    pit1Lap: 25,
    pit1Tyre: 'MEDIUM',
    crewStopTime: 2.7,
  },
  // Haas
  {
    code: 'OCO',
    name: 'Esteban Ocon',
    number: '31',
    team: 'Haas',
    color: '#dc2626',
    teammateCode: 'BEA',
    basePaceOffset: 0.42,
    machineSetup: { downforce: 'low', puMode: 'standard', ersStrategy: 'balanced' },
    startTyre: 'MEDIUM',
    pit1Lap: 17,
    pit1Tyre: 'HARD',
    crewStopTime: 2.6,
  },
  {
    code: 'BEA',
    name: 'Oliver Bearman',
    number: '87',
    team: 'Haas',
    color: '#b91c1c',
    teammateCode: 'OCO',
    basePaceOffset: 0.48,
    machineSetup: { downforce: 'low', puMode: 'standard', ersStrategy: 'balanced' },
    startTyre: 'SOFT',
    pit1Lap: 13,
    pit1Tyre: 'HARD',
    crewStopTime: 2.5,
  },
  // Audi Revolut
  {
    code: 'HUL',
    name: 'Nico Hulkenberg',
    number: '27',
    team: 'Audi Revolut',
    color: '#10b981',
    teammateCode: 'BOR',
    basePaceOffset: 0.44,
    machineSetup: { downforce: 'balanced', puMode: 'standard', ersStrategy: 'balanced' },
    startTyre: 'MEDIUM',
    pit1Lap: 19,
    pit1Tyre: 'HARD',
    crewStopTime: 2.6,
  },
  {
    code: 'BOR',
    name: 'Gabriel Bortoleto',
    number: '5',
    team: 'Audi Revolut',
    color: '#059669',
    teammateCode: 'HUL',
    basePaceOffset: 0.54,
    machineSetup: { downforce: 'balanced', puMode: 'standard', ersStrategy: 'balanced' },
    startTyre: 'HARD',
    pit1Lap: 27,
    pit1Tyre: 'MEDIUM',
    crewStopTime: 2.7,
  },
  // Cadillac Formula 1 Team (2026 Works Entry)
  {
    code: 'PER',
    name: 'Sergio Perez',
    number: '11',
    team: 'Cadillac F1',
    color: '#f59e0b',
    teammateCode: 'BOT',
    basePaceOffset: 0.38,
    machineSetup: { downforce: 'low', puMode: 'standard', ersStrategy: 'balanced' },
    startTyre: 'MEDIUM',
    pit1Lap: 18,
    pit1Tyre: 'HARD',
    crewStopTime: 2.5,
  },
  {
    code: 'BOT',
    name: 'Valtteri Bottas',
    number: '77',
    team: 'Cadillac F1',
    color: '#d97706',
    teammateCode: 'PER',
    basePaceOffset: 0.40,
    machineSetup: { downforce: 'low', puMode: 'standard', ersStrategy: 'balanced' },
    startTyre: 'SOFT',
    pit1Lap: 14,
    pit1Tyre: 'HARD',
    crewStopTime: 2.5,
  },
];

export const DEFAULT_SIM_GRID = GRID_DRIVERS;

// ── Commentary & Telemetry Types ──────────────────────────────────────────────

export interface CommentaryMessage {
  id: string;
  lap: number;
  type: 'broadcast' | 'radio' | 'incident' | 'overtake';
  speaker: string;
  text: string;
  timestamp?: string;
}

export interface CarLapSimState {
  code: string;
  name: string;
  number: string;
  team: string;
  color: string;
  isPlayer: boolean;
  lap: number;
  lapTime: number;
  cumulativeTime: number;
  position: number;
  gapToLeader: number;
  gapToAhead: number;
  tyreCompound: TyreCompound;
  tyreAge: number;
  tyreWearPercent: number; // 0 to 100%
  tyreSurfaceTemp: number; // 85 to 140 °C
  tyreCoreTemp: number; // 85 to 120 °C
  brakeTemp: number; // 400 to 950 °C
  thermalWarning: 'NONE' | 'GRAINING_RISK' | 'BLISTERING_WARNING' | 'OPTIMAL';
  puMode: EnginePUMode;
  ersBoostUsed: boolean;
  ersBatterySoc: number; // 10 to 100 %
  fuelRemainingKg: number; // e.g. 100 down to 3 kg
  driverConfidence: number; // 50 to 99 %
  pitCount: number;
  isPitting: boolean;
  pitStopDuration?: number;
  isRetired?: boolean;
  retirementReason?: string;
  retirementLap?: number;
  currentSpeedKmH?: number;
  eventNote?: string;
  teammateGapSeconds?: number;
  doubleStackDelay?: number; // e.g. 4.5s
  inDrsTrain?: boolean;
  inDirtyAir?: boolean;
  pointsAwarded?: number; // 25, 18, 15, 12, 10, 8, 6, 4, 2, 1 for P1-P10
  // FIA Sporting Regulations & Telemetry Additions
  compoundsUsed?: TyreCompound[];
  mandatoryTwoCompoundsMet?: boolean;
  trackLimitsCount?: number;
  pendingPenaltySeconds?: number;
  drsAvailable?: boolean;
}

export interface RainRadarStatus {
  distanceKm: number; // 0 to 15 km
  speedKmH: number; // approach vector
  etaMinutes: number;
  waterDepthMm: number; // 0 to 8 mm
  intensity: 'none' | 'light' | 'moderate' | 'heavy' | 'monsoon';
  trackPhase: TrackPhase;
  dryingRateMmPerLap: number; // e.g. 0.35 mm/lap
  dryLineWidthPercent: number; // 0 to 100%
  incidentRiskPercent: number; // 5 to 80%
  incidentRiskLevel: IncidentRiskLevel;
  trackTempC: number;
  crossover: {
    currentBestCompound: TyreCompound;
    slickViable: boolean;
    interViable: boolean;
    wetViable: boolean;
  };
}

export interface DriverRadioPrompt {
  id: string;
  triggerLap: number;
  speaker: string;
  speakerCode: string;
  urgency: 'routine' | 'urgent' | 'critical';
  message: string;
  options: {
    id: string;
    label: string;
    actionType: 'box' | 'stay' | 'pu_mode' | 'team_order' | 'tyre_save';
    targetCompound?: TyreCompound;
    targetPUMode?: EnginePUMode;
    effectText: string;
    confidenceDelta: number;
    moraleDelta: number;
  }[];
}

export interface TeammateStatus {
  code: string;
  name: string;
  position: number;
  gapToPlayer: number;
  tyreCompound: TyreCompound;
  tyreWearPercent: number;
  isPitting: boolean;
  doubleStackRisk: boolean;
}

export interface SimSnapshot {
  lap: number;
  isSC: boolean;
  isVSC: boolean;
  isScEnding?: boolean;
  trackTemp: number; // °C
  waterDepthMm: number; // mm
  weatherDescription: string;
  cars: CarLapSimState[];
  leaderCode: string;
  fastestLap: { code: string; time: number; lap: number };
  commentaryFeed: CommentaryMessage[];
  rainRadar: RainRadarStatus;
  activeRadioPrompt?: DriverRadioPrompt;
  teammateStatus?: TeammateStatus;
  fiaRuleStatus?: {
    mandatoryDryTireMet: boolean;
    compoundsUsed: TyreCompound[];
    pendingPenalties: number;
    trackLimitsCount: number;
  };
}

export interface PlayerTacticalCommand {
  boxNextLap: boolean;
  nextCompound: TyreCompound;
  puMode: EnginePUMode;
  ersOvertakeActive: boolean;
  teamOrder?: TeamOrderType;
}

// ── Baseline Tyre Properties ──────────────────────────────────────────────────

export const TYRE_PROPERTIES: Record<
  TyreCompound,
  {
    label: string;
    color: string;
    speedDelta: number;
    wearRate: number;
    cliffLap: number;
    optimalWaterRange: [number, number];
  }
> = {
  SOFT: {
    label: 'Soft',
    color: '#ef4444',
    speedDelta: -0.65,
    wearRate: 0.12,
    cliffLap: 16,
    optimalWaterRange: [0.0, 0.4],
  },
  MEDIUM: {
    label: 'Medium',
    color: '#eab308',
    speedDelta: 0.0,
    wearRate: 0.07,
    cliffLap: 26,
    optimalWaterRange: [0.0, 0.6],
  },
  HARD: {
    label: 'Hard',
    color: '#f8fafc',
    speedDelta: 0.55,
    wearRate: 0.04,
    cliffLap: 40,
    optimalWaterRange: [0.0, 0.7],
  },
  INTER: {
    label: 'Intermediate',
    color: '#22c55e',
    speedDelta: 2.8,
    wearRate: 0.09,
    cliffLap: 25,
    optimalWaterRange: [0.8, 3.8],
  },
  WET: {
    label: 'Full Wet',
    color: '#3b82f6',
    speedDelta: 6.5,
    wearRate: 0.06,
    cliffLap: 30,
    optimalWaterRange: [3.5, 12.0],
  },
};

// ── Web Audio F1 Radio Chirp Synthesizer ──────────────────────────────────────

export function playF1RadioChirp() {
  playF1IncomingRadioChirp();
}

// ── Traffic & Pit Exit Predictor ──────────────────────────────────────────────

export function calculatePitExitTraffic(
  cars: CarLapSimState[],
  playerCode: string,
  circuit: CircuitSimProfile,
  isSC: boolean
): {
  predictedExitPosition: number;
  gapAheadSeconds: number;
  aheadCarCode?: string;
  gapBehindSeconds: number;
  behindCarCode?: string;
  trafficStatus: 'CLEAN_AIR' | 'IN_TRAFFIC' | 'CAUTION';
  pitLossSeconds: number;
} {
  const player = cars.find((c) => c.code === playerCode);
  if (!player) {
    return {
      predictedExitPosition: 1,
      gapAheadSeconds: 0,
      gapBehindSeconds: 0,
      trafficStatus: 'CLEAN_AIR',
      pitLossSeconds: 22.0,
    };
  }

  const pitLoss = isSC ? circuit.pitLaneLoss * 0.52 + 2.3 : circuit.pitLaneLoss + 2.3;
  const simulatedPlayerCumulative = player.cumulativeTime + pitLoss;

  const otherCars = cars.filter((c) => c.code !== playerCode);
  let exitPos = 1;
  let aheadCar: CarLapSimState | undefined = undefined;
  let behindCar: CarLapSimState | undefined = undefined;

  for (const car of otherCars) {
    if (car.cumulativeTime < simulatedPlayerCumulative) {
      exitPos += 1;
      aheadCar = car;
    } else {
      if (!behindCar) behindCar = car;
    }
  }

  const gapAhead = aheadCar ? Number((simulatedPlayerCumulative - aheadCar.cumulativeTime).toFixed(1)) : 0;
  const gapBehind = behindCar ? Number((behindCar.cumulativeTime - simulatedPlayerCumulative).toFixed(1)) : 0;

  const inTraffic = aheadCar !== undefined && gapAhead < 1.4;
  const trafficStatus = inTraffic ? 'IN_TRAFFIC' : gapAhead < 2.5 ? 'CAUTION' : 'CLEAN_AIR';

  return {
    predictedExitPosition: exitPos,
    gapAheadSeconds: gapAhead,
    aheadCarCode: aheadCar?.code,
    gapBehindSeconds: gapBehind,
    behindCarCode: behindCar?.code,
    trafficStatus,
    pitLossSeconds: Number(pitLoss.toFixed(1)),
  };
}

// ── Helper Formatter ──────────────────────────────────────────────────────────

export function formatTimeSeconds(sec: number): string {
  if (!sec || isNaN(sec) || sec <= 0) return '0:00.000';
  const m = Math.floor(sec / 60);
  const s = (sec % 60).toFixed(3);
  return `${m}:${Number(s) < 10 ? '0' : ''}${s}`;
}

// ── Driver Personality Radio Lines ──────────────────────────────────────────

export const DRIVER_RADIO_LINES: Record<
  string,
  { rain: string[]; deadTyres: string[]; sc: string[]; push: string[] }
> = {
  VER: {
    rain: [
      'Mate, it is getting quite wet out here! What is the radar saying?!',
      'The grip is completely disappearing, mate! We need to think about inters!',
    ],
    deadTyres: [
      'Mate, these tyres are completely gone! I cannot turn the car!',
      'Tyres are dead. Box me, box me!',
    ],
    sc: ['Is the delta positive? Make sure we keep the tyre temps up.', 'Safety car? Are we boxing?!'],
    push: ['Full push now mate, let\'s go!', 'Simply lovely, pushing to the maximum!'],
  },
  LEC: {
    rain: [
      'Noooo! It is raining heavily in sector 2! Are we boxing or staying?!',
      'Track is very slippery, losing grip on corner entry!',
    ],
    deadTyres: [
      'I am losing the rear everywhere! What is Plan C?!',
      'Tyres are giving up, front right is completely grained!',
    ],
    sc: ['Safety Car! Please tell me we pit! Copy?', 'Safety car deployed, check the pit window!'],
    push: ['Pushing maximum!', 'Understood, attacking now!'],
  },
  HAM: {
    rain: ['It\'s raining quite a bit out here, Bono!', 'Track is losing grip fast, feels like intermediate conditions!'],
    deadTyres: ['My tyres are dead, Bono!', 'There is a lot of vibration from the front tyres!'],
    sc: ['Safety Car deployed. Check the gap behind, Bono!', 'Are we boxing under the Safety Car?'],
    push: ['Hammer time!', 'Leave me to it, pushing now!'],
  },
  ALO: {
    rain: ['The rain is here. I have more pace in hand, tell me when to box!', 'Full wet conditions coming, prepare the pit crew!'],
    deadTyres: ['No grip left, maximum tyre management needed.', 'Box this lap! Don\'t leave me out here!'],
    sc: ['Safety Car! We must take the cheap pit stop now!', 'Copy SC. This is our strategic opportunity!'],
    push: ['Aha! GP2 engine feeling on the straight, but pushing 100%!', 'Understood, time to make magic happen!'],
  },
  TSU: {
    rain: ['Traffic and rain!! Come on, what tyre are we taking?!', 'It is super wet on turn 1!! Box me!!'],
    deadTyres: ['Tyres are completely dead, mate!! Box box!!', 'Zero grip! The car is sliding everywhere!!'],
    sc: ['Safety Car, copy! Tell me what to do!', 'Safety car out! Let\'s go for the cheap pit!'],
    push: ['YEAH!! Let\'s go!! Pushing like hell!!', 'Understood, pushing flat out!!'],
  },
  NOR: {
    rain: ['It\'s raining hard! Are other cars pitting?!', 'Aquaplaning on the main straight! We need inters!'],
    deadTyres: ['Tyres are dropping off. We need to think about boxing.', 'Front left is dead, losing front-end grip.'],
    sc: ['Safety car deployed, copy that. Keep me updated on deltas.', 'Cheap pit window open under SC!'],
    push: ['Pushing now mate! Let\'s hunt them down!', 'Radio check, head down and push!'],
  },
  PIA: {
    rain: ['Rain confirmed in sector 3. Standing water is building.', 'Slick grip dropping fast, inters look viable.'],
    deadTyres: ['Tyre degradation reaching cliff. Box recommended.', 'Understood, tyres losing peak grip.'],
    sc: ['Safety car copy. Pit window open.', 'Maintaining delta under Safety Car.'],
    push: ['Understood. Calm and steady, pushing.', 'Pace is good, closing the gap.'],
  },
};

// ── Deterministic Pseudo-Random Number Generator (Mulberry32) ───────────────────

export function createSeededRng(seed: number) {
  let s = Math.floor(seed) >>> 0;
  return function () {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function hashStringToSeed(str: string): number {
  let hash = 2166136261;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

// ── Grand Prix Simulation Engine ──────────────────────────────────────────────

export function runFullGrandPrixSimulation(params: {
  circuit: CircuitSimProfile;
  totalLaps: number;
  drivers: DriverSimConfig[];
  weatherType: WeatherType;
  rainStartLap?: number;
  rainIntensityMm?: number;
  incidentFrequency: IncidentFrequency;
  scTriggerLap?: number;
  playerOverrides?: Record<number, Partial<PlayerTacticalCommand>>;
  driverRadioResponses?: Record<string, string>; // promptId -> optionId
  aiDifficulty?: 'beginner' | 'standard' | 'master';
  incidentRiskMultiplier?: number;
  raceLengthMode?: 'sprint' | 'gp_short_25' | 'gp_full_100';
}): SimSnapshot[] {
  const {
    circuit,
    totalLaps,
    drivers,
    weatherType,
    rainStartLap = 999,
    rainIntensityMm = 0,
    incidentFrequency,
    scTriggerLap,
    playerOverrides = {},
    driverRadioResponses = {},
    aiDifficulty = 'standard',
    incidentRiskMultiplier = 1.0,
    raceLengthMode = 'gp_short_25',
  } = params;

  // Base deterministic seed derived from scenario constants (guarantees zero random drift on tactical tweaks)
  const baseSeedStr = `${circuit.id}-${totalLaps}-${weatherType}-${rainStartLap}-${scTriggerLap ?? 'nosc'}-${incidentFrequency}-${aiDifficulty}-${raceLengthMode}`;
  const baseSeed = hashStringToSeed(baseSeedStr);

  const snapshots: SimSnapshot[] = [];

  // Trackers for driver progression
  const trackers: Record<
    string,
    {
      cumulativeTime: number;
      currentTyre: TyreCompound;
      tyreAge: number;
      pitCount: number;
      puMode: EnginePUMode;
      ersBoostUsed: boolean;
      ersBatterySoc: number;
      surfaceTemp: number;
      coreTemp: number;
      fuelKg: number;
      confidence: number;
      plannedPit1: number;
      plannedPit1Tyre: TyreCompound;
      plannedPit2?: number;
      plannedPit2Tyre?: TyreCompound;
      lastPitLap?: number;
      isRetired: boolean;
      retirementReason?: string;
      retirementLap?: number;
      // FIA Sporting Regulations & Penalty Tracking
      compoundsUsed: TyreCompound[];
      trackLimitsCount: number;
      pendingPenaltySeconds: number;
      servedPenaltySeconds: number;
    }
  > = {};

  for (const d of drivers) {
    trackers[d.code] = {
      cumulativeTime: 0,
      currentTyre: d.startTyre,
      tyreAge: d.initialTyreAge ?? 0,
      pitCount: 0,
      puMode: d.machineSetup.puMode,
      ersBoostUsed: false,
      ersBatterySoc: 85,
      surfaceTemp: d.initialTyreSurfaceTemp ?? 100,
      coreTemp: d.initialTyreCoreTemp ?? 98,
      fuelKg: Math.round(totalLaps * 1.55 + 5),
      confidence: 88,
      plannedPit1: d.pit1Lap,
      plannedPit1Tyre: d.pit1Tyre,
      plannedPit2: d.pit2Lap,
      plannedPit2Tyre: d.pit2Tyre,
      lastPitLap: undefined,
      isRetired: false,
      retirementReason: undefined,
      retirementLap: undefined,
      compoundsUsed: [d.startTyre],
      trackLimitsCount: 0,
      pendingPenaltySeconds: 0,
      servedPenaltySeconds: 0,
    };
  }

  let globalFastestLap = { code: drivers[0].code, time: 999.0, lap: 1 };
  const globalCommentary: CommentaryMessage[] = [];

  // ── Dynamic Track Environment & Physics State ──────────────────────────────
  let currentWaterDepth = weatherType === 'drizzle' ? 1.4 : weatherType === 'monsoon' ? 5.2 : 0;
  let currentTrackTemp = weatherType === 'dry' ? 36.0 : 22.5;
  let isCurrentlyRaining = weatherType === 'drizzle' || weatherType === 'monsoon';
  let activeScLapsRemaining = 0;
  let lastIncidentLap = -99;
  let wasRainingPrevLap = false;
  let wasScActivePrevLap = false;

  const playerDriver = drivers.find((d) => d.isPlayer) || drivers[0];
  const teammateDriver = drivers.find((d) => d.team === playerDriver.team && d.code !== playerDriver.code);

  // ── Step Through Each Lap ──────────────────────────────────────────────────
  for (let currentLap = 1; currentLap <= totalLaps; currentLap++) {
    // 1. Dynamic Precipitation & Track Drying Physics
    let cloudDistance = 99;
    let dryingRate = 0;

    if (weatherType === 'dry') {
      currentWaterDepth = 0;
      isCurrentlyRaining = false;
      cloudDistance = 99;
      currentTrackTemp = 36.0 + Math.sin(currentLap * 0.4) * 1.5;
    } else if (weatherType === 'drizzle') {
      isCurrentlyRaining = true;
      cloudDistance = 0;
      currentTrackTemp = 23.0;
      currentWaterDepth = Math.min(1.8, currentWaterDepth + 0.25);
    } else if (weatherType === 'monsoon') {
      isCurrentlyRaining = true;
      cloudDistance = 0;
      currentTrackTemp = 20.0;
      currentWaterDepth = Math.min(6.5, currentWaterDepth + 1.1);
    } else {
      // Variable Weather
      const rainEndLap = (rainStartLap || 99) + 4; // 4 laps of rain
      if (currentLap < rainStartLap) {
        cloudDistance = Math.max(0.5, (rainStartLap - currentLap) * 1.8);
        isCurrentlyRaining = false;
        currentWaterDepth = 0;
        currentTrackTemp = 34.0;
      } else if (currentLap >= rainStartLap && currentLap <= rainEndLap) {
        // Rain is actively falling
        isCurrentlyRaining = true;
        cloudDistance = 0;
        currentTrackTemp = Math.max(20.0, currentTrackTemp - 2.8);
        const targetRainDepth = Math.min(rainIntensityMm, (currentLap - rainStartLap + 1) * (rainIntensityMm / 2.0));
        currentWaterDepth = Math.min(rainIntensityMm, Math.max(currentWaterDepth, targetRainDepth));
      } else {
        // Rain has stopped! Dynamic drying begins
        isCurrentlyRaining = false;
        cloudDistance = 99;
        // Sun emerges through clouds: track temperature climbs
        currentTrackTemp = Math.min(34.0, currentTrackTemp + 2.4);
        
        // Evaporation: based on track temperature (higher temp = faster drying)
        const evapRate = Math.max(0.08, (currentTrackTemp - 16.0) * 0.016);
        // 22-Car displacement: 22 F1 cars clearing ~60L of water per second from racing line
        const carDisplacement = (drivers.length / 22) * 0.22;
        dryingRate = Number((evapRate + carDisplacement).toFixed(2));
        currentWaterDepth = Math.max(0, Number((currentWaterDepth - dryingRate).toFixed(2)));
      }
    }

    // 2. Determine Track Phase & Racing Line Dry Width
    let trackPhase: TrackPhase = 'DRY';
    let dryLineWidthPercent = 100;

    if (currentWaterDepth > 4.0) {
      trackPhase = 'FLOODED';
      dryLineWidthPercent = 0;
    } else if (currentWaterDepth >= 2.2) {
      trackPhase = 'WET';
      dryLineWidthPercent = 0;
    } else if (currentWaterDepth >= 1.0) {
      trackPhase = 'DAMP';
      dryLineWidthPercent = Math.min(40, Math.round(((2.2 - currentWaterDepth) / 1.2) * 40));
    } else if (currentWaterDepth >= 0.25) {
      trackPhase = 'DRYING_LINE';
      // Record line clears rapidly while off-line remains damp
      dryLineWidthPercent = Math.min(95, Math.round(40 + ((1.0 - currentWaterDepth) / 0.75) * 55));
    } else {
      trackPhase = 'DRY';
      dryLineWidthPercent = 100;
    }

    // 3. Dynamic Incident / Safety Car Risk Evaluation
    let calculatedRisk = incidentFrequency === 'high_chaos' ? 14 : incidentFrequency === 'none' ? 1 : 5;
    // Water depth penalty
    if (currentWaterDepth > 4.0) calculatedRisk += 52; // Monsoon aquaplaning
    else if (currentWaterDepth >= 2.2) calculatedRisk += 32; // Wet standing water
    else if (currentWaterDepth >= 1.0) calculatedRisk += 16; // Damp slippery braking
    else if (trackPhase === 'DRYING_LINE') calculatedRisk += 10; // Stepping off dry line onto damp patch

    // Circuit difficulty bonus
    calculatedRisk += (circuit.overtakeDifficulty - 1.0) * 12;

    // Check cars on grid running mismatched tyres (slicks in wet dramatically spike crash risk!)
    let slickCarsInWetCount = 0;
    for (const d of drivers) {
      const t = trackers[d.code];
      if (!t.isRetired && currentWaterDepth >= 1.0 && (t.currentTyre === 'SOFT' || t.currentTyre === 'MEDIUM' || t.currentTyre === 'HARD')) {
        slickCarsInWetCount += 1;
      }
    }
    calculatedRisk += slickCarsInWetCount * 12;

    const incidentRiskPercent = Math.min(90, Math.max(4, Math.round(calculatedRisk * incidentRiskMultiplier)));
    const incidentRiskLevel: IncidentRiskLevel =
      incidentRiskPercent >= 55 ? 'CRITICAL' : incidentRiskPercent >= 32 ? 'HIGH' : incidentRiskPercent >= 16 ? 'ELEVATED' : 'LOW';

    // 4. Dynamic SC Triggering
    let isSC = false;
    let isScEnding = false;
    const isVSC = false;
    if (activeScLapsRemaining > 0) {
      isSC = true;
      activeScLapsRemaining -= 1;
      if (activeScLapsRemaining === 0) {
        isScEnding = true;
        globalCommentary.unshift({
          id: `sc-end-${currentLap}`,
          lap: currentLap,
          type: 'incident',
          speaker: 'FIA RACE CONTROL',
          text: '🟢 SAFETY CAR IN THIS LAP — デブリ回収完了。レースは今周回終了後に再開！グリーンフラッグ！',
        });
      }
    } else {
      // Check if incident triggers with deterministic PRNG
      let triggerIncident = false;
      const incidentRng = createSeededRng(baseSeed ^ (currentLap * 10007) ^ 0x1a2b3c4d);
      if (scTriggerLap && currentLap === scTriggerLap) {
        triggerIncident = true;
      } else if (currentLap > 1 && currentLap < totalLaps && currentLap - lastIncidentLap >= 3) {
        // Roll against calculated risk deterministically
        const roll = incidentRng() * 100;
        if (roll < incidentRiskPercent * 0.75) {
          triggerIncident = true;
        }
      }

      if (triggerIncident) {
        isSC = true;
        activeScLapsRemaining = 2; // 2 laps of SC
        lastIncidentLap = currentLap;

        // Choose victim car from non-retired AI cars deterministically
        const potentialVictims = drivers.filter((d) => !d.isPlayer && !trackers[d.code].isRetired);
        if (potentialVictims.length > 0) {
          const victim = potentialVictims[Math.floor(incidentRng() * potentialVictims.length)];
          const victimTracker = trackers[victim.code];
          victimTracker.isRetired = true;
          victimTracker.retirementLap = currentLap;

          let reason = '💥 クラッシュ';
          if (currentWaterDepth > 2.0) {
            reason = '💥 クラッシュ (ハイドロプレーニング)';
            globalCommentary.unshift({
              id: `sc-wet-${currentLap}`,
              lap: currentLap,
              type: 'incident',
              speaker: 'FIA RACE CONTROL',
              text: `🚨 SAFETY CAR DEPLOYED — ${victim.name} がターン3の川（ハイドロプレーニング）に足をすくわれスピン・クラッシュ！リタイア（DNF）！チープピットの好機！`,
            });
          } else if (trackPhase === 'DRYING_LINE') {
            reason = '💥 クラッシュ (濡れた路面でスピン)';
            globalCommentary.unshift({
              id: `sc-dryline-${currentLap}`,
              lap: currentLap,
              type: 'incident',
              speaker: 'FIA RACE CONTROL',
              text: `🚨 SAFETY CAR DEPLOYED — ${victim.name} が濡れたオフラインを踏んでコントロールを喪失、ウォールに大破接触！リタイア（DNF）！`,
            });
          } else {
            reason = '💥 デブリ接触・サスペンション破損';
            globalCommentary.unshift({
              id: `sc-dry-${currentLap}`,
              lap: currentLap,
              type: 'incident',
              speaker: 'FIA RACE CONTROL',
              text: `🚨 SAFETY CAR DEPLOYED — ${victim.name} がデブリに乗りサスペンション破損、コースサイドにストップ！リタイア（DNF）！`,
            });
          }
          victimTracker.retirementReason = reason;

          // Victim Driver Radio
          const radioLine = DRIVER_RADIO_LINES[victim.code]?.deadTyres[0] || 'I am in the wall, mate. Car is completely broken.';
          globalCommentary.unshift({
            id: `radio-dnf-${victim.code}-${currentLap}`,
            lap: currentLap,
            type: 'radio',
            speaker: `${victim.name} (${victim.code})`,
            text: `📻 "${radioLine}"`,
          });
        }
      }
    }

    // Safety Car Green Flag Restart Broadcast & Radio
    if (!isSC && wasScActivePrevLap) {
      globalCommentary.unshift({
        id: `sc-restart-${currentLap}`,
        lap: currentLap,
        type: 'incident',
        speaker: 'FIA RACE CONTROL',
        text: '🟢 GREEN FLAG — レース再開！セーフティカー退避。全車ターン1へ向け一斉加速！ローリングスタート！',
      });
      if (!trackers[playerDriver.code]?.isRetired) {
        globalCommentary.unshift({
          id: `radio-restart-${playerDriver.code}-${currentLap}`,
          lap: currentLap,
          type: 'radio',
          speaker: `${playerDriver.team} RACE ENGINEER`,
          text: `📻 "Safety Car is in! Warm the tyres, green flag at the line! Push now!"`,
        });
      }
    }
    wasScActivePrevLap = isSC;

    // Rain start / stop broadcasts & Driver Personality Radios (deterministic)
    if (isCurrentlyRaining && !wasRainingPrevLap) {
      globalCommentary.unshift({
        id: `rain-start-${currentLap}`,
        lap: currentLap,
        type: 'broadcast',
        speaker: 'F1 LIVE BROADCAST',
        text: `🌧️ ターン1付近で雨が降り始めました！路面水量 ${currentWaterDepth.toFixed(1)}mm。インターミディエイトへの交換判断が迫られます！`,
      });

      const rainSpeakers = ['VER', 'LEC', 'HAM', 'TSU', 'NOR', 'ALO'].filter((c) => !trackers[c]?.isRetired);
      if (rainSpeakers.length > 0) {
        const radioRng = createSeededRng(baseSeed ^ (currentLap * 20011) ^ 0x4d3c2b1a);
        const speakerCode = rainSpeakers[Math.floor(radioRng() * rainSpeakers.length)];
        const lines = DRIVER_RADIO_LINES[speakerCode]?.rain;
        if (lines && lines.length > 0) {
          const line = lines[Math.floor(radioRng() * lines.length)];
          const speakerDriver = drivers.find((d) => d.code === speakerCode);
          globalCommentary.unshift({
            id: `radio-rain-${speakerCode}-${currentLap}`,
            lap: currentLap,
            type: 'radio',
            speaker: `${speakerDriver?.name || speakerCode} (${speakerCode})`,
            text: `📻 "${line}"`,
          });
        }
      }
    } else if (!isCurrentlyRaining && wasRainingPrevLap) {
      globalCommentary.unshift({
        id: `rain-stop-${currentLap}`,
        lap: currentLap,
        type: 'broadcast',
        speaker: 'F1 LIVE BROADCAST',
        text: `🌤️ 雨雲が抜け太陽が照り始めました！路面温度 ${currentTrackTemp.toFixed(0)}℃。走行ラインから急速に乾き始めています（ドライライン形成中）！`,
      });
    }
    wasRainingPrevLap = isCurrentlyRaining;

    const weatherDesc = isCurrentlyRaining
      ? `🌧️ 降雨中 (水深 ${currentWaterDepth.toFixed(1)}mm)`
      : trackPhase === 'DRYING_LINE'
      ? `⚡ ドライライン形成中 (乾燥幅 ${dryLineWidthPercent}%, 水深 ${currentWaterDepth.toFixed(1)}mm)`
      : trackPhase === 'DAMP'
      ? `🌤️ 雨上がり・ダンプ路面 (水深 ${currentWaterDepth.toFixed(1)}mm)`
      : trackPhase === 'WET'
      ? `🌊 全面ウェット (水深 ${currentWaterDepth.toFixed(1)}mm)`
      : `☀️ ドライ (路面温度 ${currentTrackTemp.toFixed(0)}℃)`;

    const weather = {
      waterDepth: currentWaterDepth,
      desc: weatherDesc,
      isRaining: isCurrentlyRaining,
      radarDistance: cloudDistance,
    };
    const trackTemp = currentTrackTemp;

    const playerOverride = playerOverrides[currentLap] || {};
    const lapCarStates: CarLapSimState[] = [];

    // Track which cars pit this lap and what compound they choose
    const pittingCarsThisLap = new Map<string, TyreCompound>();

    for (const driver of drivers) {
      const tracker = trackers[driver.code];
      if (tracker.isRetired) continue;

      const isPlayer = driver.code === playerDriver.code;

      let wantPit = false;
      let targetTyre: TyreCompound = tracker.currentTyre;

      if (isPlayer) {
        if (playerOverride.puMode) tracker.puMode = playerOverride.puMode;
        if (playerOverride.ersOvertakeActive !== undefined) tracker.ersBoostUsed = playerOverride.ersOvertakeActive;
        if (playerOverride.boxNextLap) {
          wantPit = true;
          targetTyre = playerOverride.nextCompound || 'INTER';
        }
      } else {
        // AI Driver Strategy Logic based on AI Difficulty setting
        const isMasterAI = aiDifficulty === 'master';
        const isBeginnerAI = aiDifficulty === 'beginner';

        const driverLag = (hashStringToSeed(driver.code) % 3);
        const rainReactionLap = isMasterAI
          ? (rainStartLap || 99) + (driver.code === 'VER' ? 0 : driverLag)
          : isBeginnerAI
          ? (rainStartLap || 99) + 2 + driverLag
          : (rainStartLap || 99) + (driver.code === 'VER' ? 0 : driverLag);

        // Avoid simultaneous teammate double-stacking unless water depth is flooding
        const isTeammatePitting = driver.teammateCode && pittingCarsThisLap.has(driver.teammateCode);
        const MAX_AI_PITTING_PER_LAP = weather.waterDepth >= 4.0 ? 12 : 5;
        const pitLaneCrowded = pittingCarsThisLap.size >= MAX_AI_PITTING_PER_LAP;

        if (currentLap === tracker.plannedPit1) {
          if ((!isTeammatePitting && !pitLaneCrowded) || weather.waterDepth > 3.5) {
            wantPit = true;
            targetTyre = tracker.plannedPit1Tyre;
          }
        } else if (currentLap === tracker.plannedPit2) {
          if ((!isTeammatePitting && !pitLaneCrowded) || weather.waterDepth > 3.5) {
            wantPit = true;
            targetTyre = tracker.plannedPit2Tyre || 'HARD';
          }
        } else if (weather.waterDepth >= 1.0 && tracker.currentTyre !== 'INTER' && tracker.currentTyre !== 'WET') {
          if (currentLap >= rainReactionLap && (!tracker.lastPitLap || currentLap > tracker.lastPitLap + 1)) {
            if ((!isTeammatePitting && !pitLaneCrowded) || weather.waterDepth >= 2.5) {
              wantPit = true;
              targetTyre = weather.waterDepth >= 4.0 ? 'WET' : 'INTER';
            }
          }
        } else if (weather.waterDepth < 0.85 && (tracker.currentTyre === 'INTER' || tracker.currentTyre === 'WET')) {
          // Drying track crossover: switch from wet/inter back to slicks
          const dryReactionLap = isMasterAI
            ? (rainStartLap ? rainStartLap + 3 : currentLap) + driverLag
            : isBeginnerAI
            ? (rainStartLap ? rainStartLap + 5 : currentLap + 2) + driverLag
            : (rainStartLap ? rainStartLap + 4 : currentLap + 1) + driverLag;
          if (currentLap >= dryReactionLap && tracker.tyreAge >= 2 && (!tracker.lastPitLap || currentLap > tracker.lastPitLap + 1)) {
            if (!isTeammatePitting && !pitLaneCrowded) {
              wantPit = true;
              targetTyre = 'MEDIUM';
            }
          }
        } else if (isSC && tracker.tyreAge > 12 && tracker.currentTyre !== 'SOFT') {
          if (!isTeammatePitting && !pitLaneCrowded) {
            wantPit = true;
            targetTyre = 'SOFT';
          }
        } else if (isMasterAI && currentLap > 3) {
          const playerPittedPrevLap = playerOverrides[currentLap - 1]?.boxNextLap;
          if (playerPittedPrevLap && tracker.tyreAge > 12 && (!tracker.lastPitLap || currentLap > tracker.lastPitLap + 1)) {
            if (!isTeammatePitting && !pitLaneCrowded) {
              wantPit = true;
              targetTyre = 'HARD';
            }
          }
        }
      }

      if (wantPit) pittingCarsThisLap.set(driver.code, targetTyre);
    }

    // Check double-stack between player and teammate
    let playerDoubleStackDelay = 0;
    let teammateDoubleStackDelay = 0;
    if (teammateDriver) {
      const playerPits = pittingCarsThisLap.has(playerDriver.code);
      const teammatePits = pittingCarsThisLap.has(teammateDriver.code);
      if (playerPits && teammatePits) {
        const playerTime = trackers[playerDriver.code].cumulativeTime;
        const tmTime = trackers[teammateDriver.code].cumulativeTime;
        if (playerTime < tmTime) {
          teammateDoubleStackDelay = 4.5;
          globalCommentary.unshift({
            id: `ds-${currentLap}`,
            lap: currentLap,
            type: 'radio',
            speaker: `${playerDriver.team} PITWALL`,
            text: `⚠️ ダブルスタック発生！${playerDriver.name}を先行ピット。${teammateDriver.name}に+4.5秒のピットボックス待機が発生！`,
          });
        } else {
          playerDoubleStackDelay = 4.5;
          globalCommentary.unshift({
            id: `ds-${currentLap}`,
            lap: currentLap,
            type: 'radio',
            speaker: `${playerDriver.team} PITWALL`,
            text: `⚠️ ダブルスタック発生！${teammateDriver.name}が先行。${playerDriver.name}の作業待機で+4.5秒ロス！`,
          });
        }
      }
    }

    // Calculate lap physics for each car with deterministic PRNG per driver
    for (let dIdx = 0; dIdx < drivers.length; dIdx++) {
      const driver = drivers[dIdx];
      const tracker = trackers[driver.code];
      const isPlayer = driver.code === playerDriver.code;
      const crewRng = createSeededRng(baseSeed ^ (currentLap * 10007) ^ (dIdx * 3571) ^ 0x99cc99cc);
      const trackLimitsRng = createSeededRng(baseSeed ^ (currentLap * 10007) ^ (dIdx * 3571) ^ 0x77bb77bb);
      const jitterRng = createSeededRng(baseSeed ^ (currentLap * 10007) ^ (dIdx * 3571) ^ 0x55aa55aa);

      if (tracker.isRetired) {
        lapCarStates.push({
          code: driver.code,
          name: driver.name,
          number: driver.number,
          team: driver.team,
          color: driver.color,
          isPlayer,
          lap: tracker.retirementLap || currentLap,
          lapTime: 0,
          cumulativeTime: tracker.cumulativeTime + 999999,
          position: 22,
          gapToLeader: 0,
          gapToAhead: 0,
          tyreCompound: tracker.currentTyre,
          tyreAge: tracker.tyreAge,
          tyreWearPercent: 100,
          tyreSurfaceTemp: 40,
          tyreCoreTemp: 40,
          brakeTemp: 50,
          thermalWarning: 'NONE',
          puMode: 'standard',
          ersBoostUsed: false,
          ersBatterySoc: 0,
          fuelRemainingKg: tracker.fuelKg,
          driverConfidence: 0,
          pitCount: tracker.pitCount,
          isPitting: false,
          isRetired: true,
          retirementReason: tracker.retirementReason,
          retirementLap: tracker.retirementLap,
          currentSpeedKmH: 0,
          eventNote: 'DNF',
        });
        continue;
      }

      const isPitting = pittingCarsThisLap.has(driver.code);

      let lapPitLoss = 0;
      let staticCrewTime = 0;
      let note: string | undefined = undefined;

      if (isPitting) {
        tracker.pitCount += 1;
        tracker.lastPitLap = currentLap;
        const targetTyre = pittingCarsThisLap.get(driver.code) || 'INTER';
        const chosenTyre = isPlayer ? playerOverride.nextCompound || 'INTER' : targetTyre;
        tracker.currentTyre = chosenTyre;
        if (!tracker.compoundsUsed.includes(chosenTyre)) {
          tracker.compoundsUsed.push(chosenTyre);
        }
        tracker.tyreAge = 0;
        tracker.surfaceTemp = 95;
        tracker.coreTemp = 90;

        staticCrewTime = driver.crewStopTime + (crewRng() * 0.4 - 0.2);

        // FIA Penalty Serving: Mechanics must stand back and wait before working on the car
        if (tracker.pendingPenaltySeconds > 0) {
          staticCrewTime += tracker.pendingPenaltySeconds;
          tracker.servedPenaltySeconds += tracker.pendingPenaltySeconds;
          tracker.pendingPenaltySeconds = 0;
          note = 'BOX STOP (SERVED 5s PENALTY)';
        }

        if (isPlayer && playerDoubleStackDelay > 0) staticCrewTime += playerDoubleStackDelay;
        if (!isPlayer && driver.code === teammateDriver?.code && teammateDoubleStackDelay > 0) {
          staticCrewTime += teammateDoubleStackDelay;
        }

        const pitLaneLoss = isSC ? circuit.pitLaneLoss * 0.52 : circuit.pitLaneLoss;
        lapPitLoss = pitLaneLoss + staticCrewTime;
        if (!note) note = isSC ? 'CHEAP PIT (SC)' : 'BOX STOP';

        globalCommentary.unshift({
          id: `pit-${driver.code}-${currentLap}`,
          lap: currentLap,
          type: 'broadcast',
          speaker: 'PIT LANE MONITOR',
          text: `🛞 ${driver.name} (${driver.team}) がピットイン！作業時間 ${staticCrewTime.toFixed(1)}秒で ${chosenTyre} を装着！`,
        });
      } else {
        tracker.tyreAge += 1;
      }

      // Physics factors
      const tyreProp = TYRE_PROPERTIES[tracker.currentTyre];
      const baseLap = circuit.baseLapTime + driver.basePaceOffset;

      // PU Mode modifier & ERS Battery Management (High-impact tactical trade-offs)
      let puPaceMod = 0;
      if (tracker.puMode === 'push') {
        puPaceMod = -0.55; // aggressive high-combustion engine attack
        tracker.surfaceTemp += 4.5; // noticeable thermal rise (leads to blister if sustained)
        tracker.coreTemp += 2.0;
        tracker.ersBatterySoc = Math.max(6, tracker.ersBatterySoc - 18); // rapid electrical drain
      } else if (tracker.puMode === 'conserve') {
        puPaceMod = +0.65; // lift & coast pacing
        tracker.surfaceTemp = Math.max(88, tracker.surfaceTemp - 4.0); // rapid tyre cooling into optimal zone
        tracker.coreTemp = Math.max(88, tracker.coreTemp - 2.2);
        tracker.ersBatterySoc = Math.min(98, tracker.ersBatterySoc + 22); // heavy MGU-K regen under braking
      } else {
        // Standard mode: realistic lap oscillation (-3% on straights, +2% in braking zones)
        tracker.surfaceTemp += 0.5;
        const lapRegen = (currentLap % 2 === 0 ? -3 : +2);
        tracker.ersBatterySoc = Math.min(95, Math.max(35, tracker.ersBatterySoc + lapRegen));
      }

      // ERS Boost modifier (Manual Override Mode / Overtake)
      let ersPaceMod = 0;
      if (tracker.ersBoostUsed && tracker.ersBatterySoc > 15) {
        ersPaceMod = -0.75;
        // Heavy discharge: drains 35% battery in a single lap of full deployment!
        tracker.ersBatterySoc = Math.max(5, tracker.ersBatterySoc - 35);
      }

      // Team Order physics
      let teamOrderPaceMod = 0;
      if (playerOverride.teamOrder && teammateDriver) {
        if (driver.code === teammateDriver.code) {
          if (playerOverride.teamOrder === 'swap') {
            // Teammate yields position cleanly to player (+0.8s lift)
            const playerTime = trackers[playerDriver.code].cumulativeTime;
            const tmTime = tracker.cumulativeTime;
            if (tmTime <= playerTime + 2.0) {
              teamOrderPaceMod = +0.8;
              if (!note) note = 'TEAM ORDER (SWAP)';
            }
          } else if (playerOverride.teamOrder === 'defend') {
            if (!note) note = 'TEAM ORDER (DEFEND)';
          }
        }
      }

      // Tyre wear & cliff calculation with race length mode scaling
      const is25Percent = raceLengthMode === 'gp_short_25';
      const isFullGp = raceLengthMode === 'gp_full_100';
      const wearScale = is25Percent ? 3.2 : 1.0;
      const effectiveCliff = Math.max(5, Math.round(tyreProp.cliffLap / (is25Percent ? 2.5 : 1.0)));
      const wearMultiplier = tracker.tyreAge > effectiveCliff ? 3.2 : 1.0;
      const tyreWearPacePenalty = tracker.tyreAge * tyreProp.wearRate * circuit.tyreAggression * wearMultiplier * wearScale;
      const wearPercent = Math.min(100, Math.round((tracker.tyreAge / (effectiveCliff * 1.5)) * 100));

      // Thermal warnings
      let thermalWarning: 'NONE' | 'GRAINING_RISK' | 'BLISTERING_WARNING' | 'OPTIMAL' = 'OPTIMAL';
      if (tracker.surfaceTemp > 125) {
        thermalWarning = 'BLISTERING_WARNING';
      } else if (tracker.surfaceTemp < 88 && tracker.puMode === 'push') {
        thermalWarning = 'GRAINING_RISK';
      }

      // Water depth & tyre mismatch penalty (crossover physics & drying line)
      let waterPenalty = 0;
      const [optMin, optMax] = tyreProp.optimalWaterRange;
      if (weather.waterDepth > optMax) {
        const delta = weather.waterDepth - optMax;
        waterPenalty = delta * 2.8; // severe aquaplaning for slicks in wet
      } else if (weather.waterDepth < optMin) {
        const delta = optMin - weather.waterDepth;
        waterPenalty = delta * 1.4; // wets destroying themselves in dry
        // On drying line, inter/wet rubber shreds and overheats on dry asphalt
        const dryLineHeatBonus = trackPhase === 'DRYING_LINE' ? 4.5 * (dryLineWidthPercent / 100) : 3.0;
        tracker.surfaceTemp += dryLineHeatBonus;
      }

      // If running slick on drying line, pushing carries small slide penalty if straying off dry line
      if (trackPhase === 'DRYING_LINE' && (tracker.currentTyre === 'SOFT' || tracker.currentTyre === 'MEDIUM' || tracker.currentTyre === 'HARD')) {
        if (tracker.puMode === 'push') {
          waterPenalty += 0.25; // damp offline sliding
        }
      }

      // Fuel burn off (lighter car = faster lap: -0.033s per lap)
      const lapFuelBurn = isFullGp ? 1.75 : 1.55;
      tracker.fuelKg = Math.max(2, tracker.fuelKg - lapFuelBurn);
      const fuelPaceBonus = -((totalLaps - currentLap) * 0.033);

      // Track limits simulation (push mode on dry track risks track limits)
      if (tracker.puMode === 'push' && !isSC && trackLimitsRng() < 0.05) {
        tracker.trackLimitsCount += 1;
        if (tracker.trackLimitsCount === 3) {
          globalCommentary.unshift({
            id: `tl-bw-${driver.code}-${currentLap}`,
            lap: currentLap,
            type: 'incident',
            speaker: 'FIA RACE CONTROL',
            text: `⚫⚪ BLACK & WHITE FLAG — ${driver.name} (${driver.code}) トラックリミット3回警告！次の逸脱で5秒ペナルティ！`,
          });
        } else if (tracker.trackLimitsCount >= 4 && tracker.pendingPenaltySeconds === 0) {
          tracker.pendingPenaltySeconds = 5;
          globalCommentary.unshift({
            id: `tl-pen-${driver.code}-${currentLap}`,
            lap: currentLap,
            type: 'incident',
            speaker: 'FIA RACE CONTROL',
            text: `⚠️ 5-SECOND TIME PENALTY — ${driver.name} (${driver.code}) トラックリミット複数回違反により5秒ペナルティ裁定！次回ピットで静止待機義務。`,
          });
        }
      }

      // FIA 2-Dry-Compound Rule Check
      const slickCompounds = tracker.compoundsUsed.filter(c => c === 'SOFT' || c === 'MEDIUM' || c === 'HARD');
      const distinctSlicks = new Set(slickCompounds);
      const hadWetConditions = weatherType === 'drizzle' || weatherType === 'monsoon' || (rainStartLap && currentLap >= rainStartLap);
      const mandatoryTwoCompoundsMet = hadWetConditions || distinctSlicks.size >= 2;

      if (currentLap === totalLaps && !mandatoryTwoCompoundsMet && !tracker.isRetired && raceLengthMode !== 'sprint') {
        note = 'DSQ (FIA Art. 30.5: 2種ドライタイヤ義務違反)';
      }

      // Track evolution (22 cars laying down rubber every lap improves baseline grip by up to 0.25s)
      const trackEvolutionBonus = -Math.min(0.25, (currentLap / totalLaps) * 0.22);

      // 1. Standing start launch & initial grid slot stagger on Lap 1:
      const isOpeningLap = currentLap === 1;
      let standingStartPenalty = 0;
      if (isOpeningLap) {
        // Find driver's initial grid position (0 to 21)
        const gridIdx = drivers.findIndex((d) => d.code === driver.code);
        // Physical grid slot offset: P1 starts at slot 1, P22 starts ~160m behind (+0.15s per slot)
        const gridStagger = gridIdx * 0.15;
        // Midfield bottlenecking through Turn 1 and Sector 1 accordion deceleration:
        const t1Bottleneck = gridIdx > 2 ? Math.min(10.5, (gridIdx - 2) * 0.65) : 0;
        // Base standing start acceleration loss from 0 km/h: +4.2s
        standingStartPenalty = 4.2 + gridStagger + t1Bottleneck;
      }

      // 2. Natural Midfield Traffic & Dirty Air Pace Differentiation on laps 2-5:
      let trafficPaceMod = 0;
      if (!isOpeningLap && !isSC && currentLap <= 6) {
        const gridIdx = drivers.findIndex((d) => d.code === driver.code);
        if (gridIdx >= 4 && gridIdx <= 16) {
          trafficPaceMod = 0.35 + (gridIdx % 3) * 0.15;
        } else if (gridIdx > 16) {
          trafficPaceMod = 0.65;
        }
      }

      // SC pacing & deterministic micro-jitter
      const jitter = (jitterRng() - 0.5) * 0.35;

      let lapDuration: number;
      if (isSC) {
        // Under Safety Car, the leader is pinned to the SC Delta pace (~140 km/h):
        // Trailing cars far back can drive up to the maximum SC delta (~1.38x vs 1.42x)
        // to smoothly and gradually catch up to the back of the queue:
        const prevLeaderCode = Object.entries(trackers).sort((a, b) => a[1].cumulativeTime - b[1].cumulativeTime)[0]?.[0];
        const isScLeader = driver.code === (prevLeaderCode || drivers[0].code);
        const scDeltaRatio = isScLeader ? 1.42 : 1.38;
        const scDeltaLap = circuit.baseLapTime * scDeltaRatio + (jitterRng() - 0.5) * 0.05;
        lapDuration = scDeltaLap + lapPitLoss;
      } else {
        lapDuration =
          baseLap +
          standingStartPenalty +
          trafficPaceMod +
          tyreProp.speedDelta +
          puPaceMod +
          ersPaceMod +
          teamOrderPaceMod +
          tyreWearPacePenalty +
          waterPenalty +
          fuelPaceBonus +
          trackEvolutionBonus +
          lapPitLoss +
          jitter;
      }

      tracker.cumulativeTime += lapDuration;

      if (!isSC && lapDuration < globalFastestLap.time && lapPitLoss === 0) {
        globalFastestLap = { code: driver.code, time: lapDuration, lap: currentLap };
      }

      const circuitLenM = circuit.circuitLengthM || 5400;
      const avgSpeedKmH = Math.round((circuitLenM / Math.max(35, lapDuration)) * 3.6);
      let currentSpeedKmH: number;
      if (isPitting) {
        currentSpeedKmH = 80;
      } else if (isSC) {
        currentSpeedKmH = Math.min(155, Math.max(135, Math.round(avgSpeedKmH * 0.72)));
      } else {
        const baseTopSpeed =
          circuit.id === 'monza' ? 354 : circuit.id === 'spa' ? 342 : circuit.id === 'silverstone' ? 336 : 328;
        const puSpeedDelta = tracker.puMode === 'push' ? 12 : tracker.puMode === 'conserve' ? -10 : 0;
        const ersSpeedDelta = tracker.ersBoostUsed ? 14 : 0;
        currentSpeedKmH = Math.round(
          baseTopSpeed + puSpeedDelta + ersSpeedDelta - driver.basePaceOffset * 8 + (jitterRng() - 0.5) * 4
        );
      }

      lapCarStates.push({
        code: driver.code,
        name: driver.name,
        number: driver.number,
        team: driver.team,
        color: driver.color,
        isPlayer,
        lap: currentLap,
        lapTime: Number(lapDuration.toFixed(3)),
        cumulativeTime: tracker.cumulativeTime,
        position: 1,
        gapToLeader: 0,
        gapToAhead: 0,
        tyreCompound: tracker.currentTyre,
        tyreAge: tracker.tyreAge,
        tyreWearPercent: wearPercent,
        tyreSurfaceTemp: Math.round(tracker.surfaceTemp),
        tyreCoreTemp: Math.round(tracker.coreTemp),
        brakeTemp: Math.round(520 + (tracker.puMode === 'push' ? 180 : 0) + jitter * 40),
        thermalWarning,
        puMode: tracker.puMode,
        ersBoostUsed: tracker.ersBoostUsed,
        ersBatterySoc: Math.round(tracker.ersBatterySoc),
        fuelRemainingKg: Number(tracker.fuelKg.toFixed(1)),
        driverConfidence: Math.round(tracker.confidence),
        pitCount: tracker.pitCount,
        isPitting,
        pitStopDuration: staticCrewTime > 0 ? Number(staticCrewTime.toFixed(1)) : undefined,
        currentSpeedKmH,
        eventNote: note,
        compoundsUsed: [...tracker.compoundsUsed],
        mandatoryTwoCompoundsMet,
        trackLimitsCount: tracker.trackLimitsCount,
        pendingPenaltySeconds: tracker.pendingPenaltySeconds,
        drsAvailable: false,
      });
    }

    // Separate active cars and retired (DNF) cars
    const activeCars = lapCarStates.filter((c) => !c.isRetired);
    const retiredCars = lapCarStates.filter((c) => c.isRetired);

    // Under Safety Car and normal racing, track order is naturally determined by cumulativeTime!
    activeCars.sort((a, b) => a.cumulativeTime - b.cumulativeTime);

    // Pack bunching occurs ONLY on the restart preparation lap (when SC is called in this lap):
    if (isSC && isScEnding && activeCars.length > 0) {
      const scLeaderTime = activeCars[0].cumulativeTime;
      let runningTime = scLeaderTime;
      activeCars.forEach((car, idx) => {
        if (idx === 0) {
          car.cumulativeTime = scLeaderTime;
        } else {
          const rawGap = car.cumulativeTime - activeCars[idx - 1].cumulativeTime;
          // Smoothly compress to restart queue spacing (0.85s to 1.35s)
          const restartGap = Math.min(Math.max(0.85, rawGap * 0.4), 1.35);
          runningTime += restartGap;
          car.cumulativeTime = Number(runningTime.toFixed(3));
        }
        const trk = trackers[car.code];
        if (trk) {
          trk.cumulativeTime = car.cumulativeTime;
        }
      });
    }

    // Apply Team Order 'defend' effect on the car immediately behind teammate
    if (playerOverride.teamOrder === 'defend' && teammateDriver) {
      const tmIdx = activeCars.findIndex((c) => c.code === teammateDriver.code);
      if (tmIdx >= 0 && tmIdx < activeCars.length - 1) {
        const carBehind = activeCars[tmIdx + 1];
        if (carBehind && carBehind.code !== playerDriver.code) {
          carBehind.cumulativeTime += 0.6;
          carBehind.lapTime = Number((carBehind.lapTime + 0.6).toFixed(3));
          if (!carBehind.eventNote) carBehind.eventNote = 'HELD UP BY DEFENSE';
        }
      }
    }

    const leaderTime = activeCars[0]?.cumulativeTime || 0;
    const FIA_POINTS_TABLE = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1];

    activeCars.forEach((car, idx) => {
      car.position = idx + 1;
      car.gapToLeader = Number((car.cumulativeTime - leaderTime).toFixed(2));
      const aheadTime = idx === 0 ? leaderTime : activeCars[idx - 1].cumulativeTime;
      car.gapToAhead = Number((car.cumulativeTime - aheadTime).toFixed(2));
      car.pointsAwarded = FIA_POINTS_TABLE[idx] || 0;

      // Dirty Air detection: within 1.2s behind ahead car
      const inDirtyAir = idx > 0 && car.gapToAhead <= 1.2;
      car.inDirtyAir = inDirtyAir;

      if (inDirtyAir) {
        const carTracker = trackers[car.code];
        if (carTracker) {
          carTracker.surfaceTemp = Math.min(145, carTracker.surfaceTemp + 3.0);
          car.tyreSurfaceTemp = Math.round(carTracker.surfaceTemp);
        } else {
          car.tyreSurfaceTemp = Math.min(145, car.tyreSurfaceTemp + 3.0);
        }
        if (car.tyreSurfaceTemp > 125) {
          car.thermalWarning = 'BLISTERING_WARNING';
        }
      }

      // DRS Available detection: within 1.0s behind ahead car, dry/damp, Lap >= 2, no SC
      const drsAvailable = idx > 0 && car.gapToAhead <= 1.0 && currentLap >= 2 && !isSC && weather.waterDepth < 0.8;
      car.drsAvailable = drsAvailable;
    });

    retiredCars.forEach((car, idx) => {
      car.position = activeCars.length + idx + 1;
      car.pointsAwarded = 0;
    });

    const allOrderedCars = [...activeCars, ...retiredCars];

    // Detect DRS Trains: when 3 or more consecutive cars each have gapToAhead <= 1.0s
    for (let i = 1; i < activeCars.length - 1; i++) {
      if (activeCars[i].gapToAhead <= 1.0 && activeCars[i + 1].gapToAhead <= 1.0) {
        activeCars[i].inDrsTrain = true;
        activeCars[i + 1].inDrsTrain = true;
        if (i > 0 && activeCars[i - 1].gapToAhead <= 1.0) {
          activeCars[i - 1].inDrsTrain = true;
        }
      }
    }

    // Teammate status for player
    let teammateStatus: TeammateStatus | undefined = undefined;
    if (teammateDriver) {
      const tmCar = activeCars.find((c) => c.code === teammateDriver.code);
      const playerCar = activeCars.find((c) => c.code === playerDriver.code);
      if (tmCar && playerCar) {
        const gap = Number((tmCar.cumulativeTime - playerCar.cumulativeTime).toFixed(1));
        teammateStatus = {
          code: tmCar.code,
          name: tmCar.name,
          position: tmCar.position,
          gapToPlayer: gap,
          tyreCompound: tmCar.tyreCompound,
          tyreWearPercent: tmCar.tyreWearPercent,
          isPitting: tmCar.isPitting,
          doubleStackRisk: Math.abs(gap) < 3.5 && (isSC || weather.waterDepth > 1.0),
        };
      }
    }

    // Rain Radar Crossover & Track Drying State
    const radar: RainRadarStatus = {
      distanceKm: Number(weather.radarDistance.toFixed(1)),
      speedKmH: 32,
      etaMinutes: Number((weather.radarDistance / 0.5).toFixed(1)),
      waterDepthMm: Number(weather.waterDepth.toFixed(1)),
      intensity:
        weather.waterDepth > 4.5
          ? 'monsoon'
          : weather.waterDepth > 2.5
          ? 'heavy'
          : weather.waterDepth > 0.8
          ? 'moderate'
          : weather.waterDepth > 0
          ? 'light'
          : 'none',
      trackPhase,
      dryingRateMmPerLap: dryingRate,
      dryLineWidthPercent,
      incidentRiskPercent,
      incidentRiskLevel,
      trackTempC: Math.round(trackTemp),
      crossover: {
        currentBestCompound: weather.waterDepth >= 4.0 ? 'WET' : weather.waterDepth >= 1.0 ? 'INTER' : 'MEDIUM',
        slickViable: weather.waterDepth < 1.0,
        interViable: weather.waterDepth >= 0.8 && weather.waterDepth <= 4.2,
        wetViable: weather.waterDepth >= 3.5,
      },
    };

    // Trigger interactive radio dialogue if conditions match
    let activeRadio: DriverRadioPrompt | undefined = undefined;
    const playerCarCurrent = activeCars.find((c) => c.code === playerDriver.code);

    // ── Dynamic Driver & Race Engineer Team Radio Feed Generation ──
    if (playerCarCurrent) {
      if (currentLap === 1) {
        globalCommentary.unshift({
          id: `radio-start-${currentLap}`,
          lap: currentLap,
          type: 'radio',
          speaker: `${playerDriver.name} (Cockpit)`,
          text: `📻 「スタート成功、ターン1を抜けた！タイヤのウォームアップに集中している、マシンのバランスは良好だ。」`,
        });
      }

      if (isSC && currentLap === scTriggerLap) {
        globalCommentary.unshift({
          id: `radio-sc-deploy-${currentLap}`,
          lap: currentLap,
          type: 'radio',
          speaker: 'RACE ENGINEER',
          text: `📻 「Safety Car deployed, Safety Car deployed. ステアリングのデルタを守れ。ピットの準備は整っている。」`,
        });
      }

      if (isScEnding) {
        globalCommentary.unshift({
          id: `radio-sc-ending-${currentLap}`,
          lap: currentLap,
          type: 'radio',
          speaker: 'RACE ENGINEER',
          text: `📻 「Safety Car in this lap! 今周回でSC退出、再開だ！タイヤとブレーキ温度を上げろ、ライン1までオーバーテイク禁止だ。」`,
        });
      }

      if (playerCarCurrent.isPitting) {
        globalCommentary.unshift({
          id: `radio-pit-exit-${currentLap}`,
          lap: currentLap,
          type: 'radio',
          speaker: 'RACE ENGINEER',
          text: `📻 「Box完了！新品の${playerCarCurrent.tyreCompound}だ。クリアトラックだ、アウトラップ全力でプッシュしろ (Hammer time)!」`,
        });
      }

      if (weather.isRaining && weather.waterDepth >= 0.8 && weather.waterDepth <= 1.8 && currentLap === rainStartLap) {
        globalCommentary.unshift({
          id: `radio-rain-start-${currentLap}`,
          lap: currentLap,
          type: 'radio',
          speaker: `${playerDriver.name} (Cockpit)`,
          text: `📻 「バイザーに雨粒が強く当たり始めた！セクター2のターンでリアのスライドが出ている、路面が滑るぞ！」`,
        });
      }

      if (playerCarCurrent.drsAvailable && playerCarCurrent.position > 1 && currentLap % 3 === 0) {
        const carAhead = activeCars[playerCarCurrent.position - 2];
        const aheadCode = carAhead ? carAhead.code : '前走車';
        globalCommentary.unshift({
          id: `radio-drs-chase-${currentLap}`,
          lap: currentLap,
          type: 'radio',
          speaker: 'RACE ENGINEER',
          text: `📻 「${aheadCode}のDRS圏内 (+${playerCarCurrent.gapToAhead.toFixed(1)}s) だ！ストレートでOVR/OTボタンを使って仕掛けろ！」`,
        });
      } else if (playerCarCurrent.position > 1 && playerCarCurrent.gapToAhead <= 1.0 && (currentLap === 4 || currentLap === 8)) {
        globalCommentary.unshift({
          id: `radio-chase-driver-${currentLap}`,
          lap: currentLap,
          type: 'radio',
          speaker: `${playerDriver.name} (Cockpit)`,
          text: `📻 「スリップストリームに入っている！立ち上がりトラクションが良い、次のブレーキングゾーンで狙う！」`,
        });
      }

      if (playerCarCurrent.tyreSurfaceTemp >= 115 && currentLap % 4 === 1 && !isSC) {
        globalCommentary.unshift({
          id: `radio-tyre-temp-${currentLap}`,
          lap: currentLap,
          type: 'radio',
          speaker: `${playerDriver.name} (Cockpit)`,
          text: `📻 「タイヤの表面温度が高すぎる、リアがルーズになってきた！少し冷却したい！」`,
        });
      } else if (playerCarCurrent.tyreWearPercent >= 65 && currentLap % 5 === 2) {
        globalCommentary.unshift({
          id: `radio-tyre-wear-${currentLap}`,
          lap: currentLap,
          type: 'radio',
          speaker: 'RACE ENGINEER',
          text: `📻 「タイヤデグラデーション注意。ターン進入で少しリフト＆コーストを入れて、ピットウィンドウまで持たせろ。」`,
        });
      }
    }

    if (playerCarCurrent) {
      if (weather.radarDistance <= 3.0 && weather.radarDistance > 0 && !weather.isRaining && currentLap === Math.max(1, (rainStartLap || 99) - 1)) {
        activeRadio = {
          id: `radio-rain-${currentLap}`,
          triggerLap: currentLap,
          speaker: `${playerDriver.name} (#${playerDriver.number})`,
          speakerCode: playerDriver.code,
          urgency: 'urgent',
          message: '無線:「第2セクターで雨粒が見える！風も強くなってきた。今すぐインターに変えるか、それとも1周様子を見るか？！」',
          options: [
            {
              id: 'box-inter',
              label: '🛞 BOX NOW! インターに交換 (奇襲アンダーカット)',
              actionType: 'box',
              targetCompound: 'INTER',
              effectText: 'ピットイン指示。新品インターへ交換し雨の立ち上がりで急加速を狙う。',
              confidenceDelta: +10,
              moraleDelta: +15,
            },
            {
              id: 'stay-dry',
              label: '🛑 STAY OUT! ドライタイヤで粘れ (スリック維持)',
              actionType: 'stay',
              effectText: 'ステイアウト。雨雲の通過または路面水量1.0mm到達まで耐える。',
              confidenceDelta: -5,
              moraleDelta: 0,
            },
            {
              id: 'conserve-wait',
              label: '🌱 エンジン温存・タイヤ冷却で路面悪化に備えろ',
              actionType: 'pu_mode',
              targetPUMode: 'conserve',
              effectText: 'PUセーブモードに切り替え、雨が本降りになるまで安全マージンを確保。',
              confidenceDelta: +5,
              moraleDelta: +5,
            },
          ],
        };
      } else if (
        trackPhase === 'DRYING_LINE' &&
        currentWaterDepth <= 0.85 &&
        (playerCarCurrent.tyreCompound === 'INTER' || playerCarCurrent.tyreCompound === 'WET') &&
        !driverRadioResponses[`radio-drying-${currentLap}`]
      ) {
        // Drying track crossover decision radio
        activeRadio = {
          id: `radio-drying-${currentLap}`,
          triggerLap: currentLap,
          speaker: `${playerDriver.name} (#${playerDriver.number})`,
          speakerCode: playerDriver.code,
          urgency: 'urgent',
          message: '無線:「レコードラインが完全に乾いてきた！インターが熱ダレでグリップが抜けている！今すぐスリックに履き替えるか、それとも水たまりを探して冷やすか？！」',
          options: [
            {
              id: 'box-slick',
              label: '🛞 BOX NOW! ソフトに履き替え (スリック最速化)',
              actionType: 'box',
              targetCompound: 'SOFT',
              effectText: 'ドライラインの急速形成に合わせ、スリックへ先手勝負。オフラインの濡れに注意。',
              confidenceDelta: +12,
              moraleDelta: +10,
            },
            {
              id: 'find-puddles',
              label: '💧 ラインを外して水たまりでインターを冷やせ (ステイ)',
              actionType: 'stay',
              effectText: 'ステイアウト指示。ストレートでウェットパッチを踏みタイヤ温度を抑えながら周回。',
              confidenceDelta: +5,
              moraleDelta: +5,
            },
            {
              id: 'conserve-tyres',
              label: '🌱 エンジン・タイヤをセーブして安全マージン確保',
              actionType: 'pu_mode',
              targetPUMode: 'conserve',
              effectText: 'PUセーブモードに切り替え、スリックへの確実なクロスオーバーを待つ。',
              confidenceDelta: 0,
              moraleDelta: 0,
            },
          ],
        };
      } else if (isSC && currentLap === scTriggerLap) {
        activeRadio = {
          id: `radio-sc-${currentLap}`,
          triggerLap: currentLap,
          speaker: `${playerDriver.name} (#${playerDriver.number})`,
          speakerCode: playerDriver.code,
          urgency: 'critical',
          message: '無線:「SCが出た！今ピットに入ればタイムロスは半分だ！Boxするのか、ステイでポジションを守るのか？！」',
          options: [
            {
              id: 'sc-box-soft',
              label: '🛞 BOX NOW! 新品ソフトでリスタート奇襲 (チープピット)',
              actionType: 'box',
              targetCompound: 'SOFT',
              effectText: 'SCチープピットを活用し、11秒の低ロスでタイヤを新調。',
              confidenceDelta: +12,
              moraleDelta: +20,
            },
            {
              id: 'sc-stay',
              label: '🛡️ STAY OUT! トラックポジションを死守せよ',
              actionType: 'stay',
              effectText: 'ステイアウトして順位をキープ。リスタートで前を押さえ込む。',
              confidenceDelta: 0,
              moraleDelta: +5,
            },
          ],
        };
      } else if (playerCarCurrent.tyreWearPercent > 75 && currentLap % 4 === 0) {
        activeRadio = {
          id: `radio-cliff-${currentLap}`,
          triggerLap: currentLap,
          speaker: `${playerDriver.name} (#${playerDriver.number})`,
          speakerCode: playerDriver.code,
          urgency: 'routine',
          message: '無線:「リアタイヤのバイブレーションが酷い！クリフに落ちかけているぞ。このスティントを引っ張るのか？」',
          options: [
            {
              id: 'cliff-box',
              label: '🛞 BOX NOW! フレッシュタイヤへ交換',
              actionType: 'box',
              targetCompound: 'HARD',
              effectText: '直ちにピットイン。アンダーカットでタイムロスを最小化。',
              confidenceDelta: +8,
              moraleDelta: +10,
            },
            {
              id: 'cliff-manage',
              label: '🌱 リフト＆コーストでタイヤをマネジメントせよ',
              actionType: 'tyre_save',
              effectText: 'スライドを抑えて走行し、ピットウィンドウまで延命。',
              confidenceDelta: -5,
              moraleDelta: -5,
            },
          ],
        };
      }
    }

    const playerTracker = trackers[playerDriver.code];
    const playerSlicks = playerTracker?.compoundsUsed.filter((c) => c === 'SOFT' || c === 'MEDIUM' || c === 'HARD') || [];
    const playerMandatoryMet =
      weatherType === 'drizzle' ||
      weatherType === 'monsoon' ||
      (rainStartLap && currentLap >= rainStartLap) ||
      new Set(playerSlicks).size >= 2;

    snapshots.push({
      lap: currentLap,
      isSC,
      isVSC,
      isScEnding,
      trackTemp,
      waterDepthMm: weather.waterDepth,
      weatherDescription: weather.desc,
      cars: allOrderedCars,
      leaderCode: activeCars[0]?.code || drivers[0].code,
      fastestLap: globalFastestLap,
      commentaryFeed: [...globalCommentary],
      rainRadar: radar,
      activeRadioPrompt: activeRadio,
      teammateStatus,
      fiaRuleStatus: {
        mandatoryDryTireMet: playerMandatoryMet,
        compoundsUsed: playerTracker ? [...playerTracker.compoundsUsed] : [playerDriver.startTyre],
        pendingPenalties: playerTracker?.pendingPenaltySeconds || 0,
        trackLimitsCount: playerTracker?.trackLimitsCount || 0,
      },
    });
  }

  return snapshots;
}

// ── Challenge Scenarios & Procedural Generator ────────────────────────────────

export interface ScenarioLockedSettings {
  startTyre?: boolean;
  weather?: boolean;
  rainLap?: boolean;
  lockReason?: string;
}

export interface ChallengeScenario {
  id: string;
  title: string;
  tag: string;
  circuit: CircuitSimProfile;
  totalLaps: number;
  targetPosition: number;
  difficulty: 'easy' | 'normal' | 'hard';
  defaultAiDifficulty?: 'beginner' | 'standard' | 'master';
  lockedSettings?: ScenarioLockedSettings;
  description: string;
  gameMode: 'sprint' | 'crisis' | 'procedural' | 'sandbox' | 'mission';
  majorCategory?: 'practice' | 'battle';
  playerConfig: DriverSimConfig;
  teammateConfig: DriverSimConfig;
  rivals: DriverSimConfig[];
  startWeather: WeatherType;
  weatherForecast: {
    radarDesc: string;
    estimatedLapMin: number;
    estimatedLapMax: number;
    rainProbabilityPercent: number;
  };
  actualRainLap?: number;
  actualRainIntensity?: number;
  scProbability: number;
  actualScLap?: number;
  hiddenTireWearMultiplier: number;
}

export const PRESET_CHALLENGES: ChallengeScenario[] = [
  {
    id: 'silverstone_drying_gamble',
    title: '🌤️ シルバーストン: 雨上がりとドライラインのギャンブル',
    tag: '路面乾燥・スリック決断',
    circuit: SIM_CIRCUITS[11], // Silverstone
    totalLaps: 8,
    targetPosition: 2,
    difficulty: 'hard',
    defaultAiDifficulty: 'master',
    lockedSettings: {
      startTyre: true,
      weather: true,
      rainLap: true,
      lockReason: '雨上がり路面でのスリック決断シナリオのため、初期インター装着および天候はシナリオ指定固定です。',
    },
    gameMode: 'crisis',
    description:
      '雨上がりのシルバーストン。立ち込める濃霧と雲間から射し込む陽光により、コプスからマゴッツ・ベケッツにかけてのアスファルトが急速に黒光りし始めている。ジョージ・ラッセルから無線が入る――「インターのゴムがオーバーヒートで千切れそうだ！スリックはまだ早いのか？！」。路面水深は1.2mmから0.6mmへ急減中。ライバルが様子見する中、誰よりも早くスリックへ飛び込み、2周で10秒を稼ぎ出す伝説のアンダーカットを断行せよ！',
    playerConfig: {
      ...GRID_DRIVERS[8], // RUS
      basePaceOffset: 0.1,
      startTyre: 'INTER',
      pit1Lap: 99,
      isPlayer: true,
    },
    teammateConfig: {
      ...GRID_DRIVERS[9], // ANT
      basePaceOffset: 0.25,
      startTyre: 'INTER',
      pit1Lap: 99,
    },
    rivals: GRID_DRIVERS.filter(d => d.code !== 'RUS' && d.code !== 'ANT').map(d => ({ ...d, startTyre: 'INTER' as TyreCompound, pit1Lap: 99 })),
    startWeather: 'variable',
    weatherForecast: {
      radarDesc: '雨雲通過。気温24℃、急激に天候回復。2周目以降ドライライン急速形成予想。',
      estimatedLapMin: 99,
      estimatedLapMax: 99,
      rainProbabilityPercent: 10,
    },
    actualRainLap: 1,
    actualRainIntensity: 1.6,
    scProbability: 0.45,
    hiddenTireWearMultiplier: 1.25,
  },
  {
    id: 'suzuka_rain_gamble',
    title: '🌧️ 鈴鹿: ゲリラ豪雨とインター乗り換えギャンブル',
    tag: '天候急変・アンダーカット',
    circuit: SIM_CIRCUITS[2], // Suzuka
    totalLaps: 8,
    targetPosition: 3,
    difficulty: 'normal',
    defaultAiDifficulty: 'standard',
    lockedSettings: {
      weather: true,
      rainLap: true,
      lockReason: 'ゲリラ豪雨の接近タイミングを見極めるシナリオのため、天候シナリオは固定されています。',
    },
    gameMode: 'crisis',
    description:
      '鈴鹿サーキットの空を覆い尽くす巨大な雨雲。スプーンカーブの観客席が次々とポンチョを羽織り始めた。無線スピーカーから角田裕毅の鬼気迫る声が響く――「バイザーに雨粒が当たってる！西コースはすでに濡れ始めてるぞ！」。天候ドップラーレーダーは2周以内の土砂降りを警告。首位集団とのギャップは2.4秒。濡れゆく路面でスリックを極限までコントロールし、ライバルがピットに殺到する1周前にインターへ換装して母国鈴鹿の表彰台（P3以内）をもぎ取れ！',
    playerConfig: {
      ...GRID_DRIVERS[0], // TSU
      basePaceOffset: 0.2,
      startTyre: 'SOFT',
      pit1Lap: 99,
      isPlayer: true,
    },
    teammateConfig: {
      ...GRID_DRIVERS[1], // HAD
      basePaceOffset: 0.45,
      startTyre: 'MEDIUM',
      pit1Lap: 99,
    },
    rivals: GRID_DRIVERS.filter(d => d.code !== 'TSU' && d.code !== 'HAD'),
    startWeather: 'dry',
    weatherForecast: {
      radarDesc: '南西より巨大な雨雲接近中。4〜6周目前後に降雨到達予想（確率85%）。',
      estimatedLapMin: 4,
      estimatedLapMax: 6,
      rainProbabilityPercent: 85,
    },
    actualRainLap: 4,
    actualRainIntensity: 2.8,
    scProbability: 0.3,
    hiddenTireWearMultiplier: 1.15,
  },
  {
    id: 'monza_undercut_ambush',
    title: '⚡ モンツァ: アンダーカット急襲とクリーンエア脱出',
    tag: 'ピットウィンドウ・トラフィック',
    circuit: SIM_CIRCUITS[15], // Monza
    totalLaps: 9,
    targetPosition: 1,
    difficulty: 'hard',
    defaultAiDifficulty: 'master',
    lockedSettings: {
      startTyre: true,
      weather: true,
      lockReason: 'アンダーカット急襲シナリオのため、ソフトタイヤ・快晴条件で固定されています。',
    },
    gameMode: 'crisis',
    description:
      'ティフォシの地響きのような咆哮が轟く超高速の聖地モンツァ。P2ランド・ノリス（マクラーレン）の視界を塞ぐのは首位フェルスタッペンのリアウイング。超接近戦のダーティエアによりフロントタイヤの表面温度は125℃を超え、悲鳴を上げている。最高速350km/hのストレートではDRSを使っても抜ききれない……勝機はピットストップのみ。完璧なインラップを叩き出し、ピットクルーによる2.2秒の神業作業でクリーンエアへ脱出、逆転優勝を飾れ！',
    playerConfig: {
      ...GRID_DRIVERS[4], // NOR
      basePaceOffset: 0.05,
      startTyre: 'SOFT',
      pit1Lap: 99,
      isPlayer: true,
      initialTyreSurfaceTemp: 126,
      initialTyreCoreTemp: 112,
      initialTyreAge: 7,
    },
    teammateConfig: {
      ...GRID_DRIVERS[5], // PIA
      basePaceOffset: 0.15,
      startTyre: 'MEDIUM',
      pit1Lap: 99,
    },
    rivals: GRID_DRIVERS.filter(d => d.code !== 'NOR' && d.code !== 'PIA').map(d =>
      d.code === 'VER'
        ? { ...d, initialTyreAge: 7, initialTyreSurfaceTemp: 106, initialTyreCoreTemp: 102 }
        : d
    ),
    startWeather: 'dry',
    weatherForecast: {
      radarDesc: '終日快晴。路面温度44℃（高温によるタイヤデグラデーション注意）。',
      estimatedLapMin: 99,
      estimatedLapMax: 99,
      rainProbabilityPercent: 0,
    },
    actualRainLap: 999,
    actualRainIntensity: 0,
    scProbability: 0.2,
    hiddenTireWearMultiplier: 1.35,
  },
  {
    id: 'spa_sc_double_stack',
    title: '🚨 スパ: 突発SCとダブルスタックの戦術ジレンマ',
    tag: 'SCチープピット・ダブルスタック',
    circuit: SIM_CIRCUITS[12], // Spa
    totalLaps: 7,
    targetPosition: 2,
    difficulty: 'normal',
    defaultAiDifficulty: 'standard',
    lockedSettings: {
      weather: true,
      lockReason: '突発SC発生シナリオのため、天候は固定されています。',
    },
    gameMode: 'crisis',
    description:
      '深いアルデンヌの森にエンジン音が木霊するスパ・フランコルシャン。ケメルストレートで激しいクラッシュが発生し、レースコントロールから赤白の閃光と共に「SAFETY CAR DEPLOYED」が宣言された！フェラーリのルクレール（P3）とハミルトン（P4）がランデブー走行中。同時にピットへ飛び込めば2台目に4.5秒の静止待機（ダブルスタック）が発生する。どちらを優先し、どちらをステイアウトさせるか――瞬時の決断が名門跳ね馬の運命を決める！',
    playerConfig: {
      ...GRID_DRIVERS[6], // LEC
      basePaceOffset: 0.1,
      startTyre: 'MEDIUM',
      pit1Lap: 99,
      isPlayer: true,
    },
    teammateConfig: {
      ...GRID_DRIVERS[7], // HAM
      basePaceOffset: 0.15,
      startTyre: 'HARD',
      pit1Lap: 99,
    },
    rivals: GRID_DRIVERS.filter(d => d.code !== 'LEC' && d.code !== 'HAM'),
    startWeather: 'dry',
    weatherForecast: {
      radarDesc: 'アルデンヌの森に低気圧停滞。SC出動確率極めて高い(90%)。',
      estimatedLapMin: 99,
      estimatedLapMax: 99,
      rainProbabilityPercent: 30,
    },
    actualRainLap: 999,
    actualRainIntensity: 0,
    scProbability: 0.95,
    actualScLap: 3,
    hiddenTireWearMultiplier: 1.2,
  },
  {
    id: 'monaco_overcut_chess',
    title: '🇲🇨 モナコ: 鉄壁のオーバーカットとトラックポジション死守',
    tag: 'モナコ市街地・オーバーカット',
    circuit: SIM_CIRCUITS.find(c => c.id === 'monaco') || SIM_CIRCUITS[6],
    totalLaps: 7,
    targetPosition: 1,
    difficulty: 'hard',
    defaultAiDifficulty: 'master',
    lockedSettings: {
      weather: true,
      lockReason: 'モナコ市街地戦のため、天候は快晴固定です。',
    },
    gameMode: 'crisis',
    description:
      '1ミリのミスも許されないモナコ公国の隘路。ガードレールにタイヤを擦りながら首位を猛追するルクレール。前走車のフェルスタッペンが突如ピットロードへ滑り込んだ！オーバーテイクが物理的に不可能なモナコで勝つ唯一の手段――それはクリーンエアとなった今、タイヤの残りグリップを全て絞り出して異次元のインラップ最速タイムを叩き出す「オーバーカット」。ピット出口のサント・デボーテで前に出ろ！',
    playerConfig: {
      ...GRID_DRIVERS[6], // LEC
      basePaceOffset: 0.05,
      startTyre: 'MEDIUM',
      pit1Lap: 99,
      isPlayer: true,
    },
    teammateConfig: {
      ...GRID_DRIVERS[7], // HAM
      basePaceOffset: 0.15,
      startTyre: 'HARD',
      pit1Lap: 99,
    },
    rivals: GRID_DRIVERS.filter(d => d.code !== 'LEC' && d.code !== 'HAM'),
    startWeather: 'dry',
    weatherForecast: {
      radarDesc: '終日快晴。狭隘な市街地のためオーバーテイク困難度MAX(1.9)。',
      estimatedLapMin: 99,
      estimatedLapMax: 99,
      rainProbabilityPercent: 0,
    },
    actualRainLap: 999,
    actualRainIntensity: 0,
    scProbability: 0.75,
    actualScLap: 5,
    hiddenTireWearMultiplier: 1.05,
  },
  {
    id: 'singapore_chaos_sc',
    title: '🇸🇬 シンガポール: ナイトレースの多重SCとタイヤ逆張り',
    tag: 'マリーナベイ・SC多発逆張り',
    circuit: SIM_CIRCUITS.find(c => c.id === 'singapore') || SIM_CIRCUITS[17],
    totalLaps: 8,
    targetPosition: 3,
    difficulty: 'normal',
    defaultAiDifficulty: 'standard',
    lockedSettings: {
      weather: true,
      lockReason: 'ナイトレースのSC多発シナリオのため、天候は固定されています。',
    },
    gameMode: 'crisis',
    description:
      '気温31℃・湿度80%、熱帯夜のマリーナベイ市街地サーキット。過酷なブレーキ熱と肉体疲労でクラッシュが連発し、セーフティカーが頻発する大波乱の展開。アストンマーティンのフェルナンド・アロンソを擁するピットウォールに緊迫が走る。周囲が安全策でハードのままステイアウトを選ぶ中、あえて新品ソフトタイヤを履く超攻撃的ギャンブルを決断。終盤のリスタートでDRSを乱舞させ、電光石火のオーバーテイク劇を演じろ！',
    playerConfig: {
      ...GRID_DRIVERS[10], // ALO
      basePaceOffset: 0.1,
      startTyre: 'MEDIUM',
      pit1Lap: 99,
      isPlayer: true,
    },
    teammateConfig: {
      ...GRID_DRIVERS[11], // STR
      basePaceOffset: 0.3,
      startTyre: 'HARD',
      pit1Lap: 99,
    },
    rivals: GRID_DRIVERS.filter(d => d.code !== 'ALO' && d.code !== 'STR'),
    startWeather: 'dry',
    weatherForecast: {
      radarDesc: '気温31℃、湿度80%の過酷なナイトセッション。SC出動確率極めて高い。',
      estimatedLapMin: 99,
      estimatedLapMax: 99,
      rainProbabilityPercent: 15,
    },
    actualRainLap: 999,
    actualRainIntensity: 0,
    scProbability: 0.95,
    actualScLap: 4,
    hiddenTireWearMultiplier: 1.25,
  },
  {
    id: 'suzuka_double_stack_dilemma',
    title: '🇯🇵 鈴鹿: チームメイト同時ピット！ダブルスタック回避とピット順位の極限決断',
    tag: 'ダブルスタック回避・チームオーダー',
    circuit: SIM_CIRCUITS[2], // Suzuka
    totalLaps: 8,
    targetPosition: 2,
    difficulty: 'hard',
    defaultAiDifficulty: 'master',
    lockedSettings: {
      startTyre: true,
      weather: true,
      lockReason: 'チームメイトとのダブルスタック戦略決断のため、初期条件は固定されています。',
    },
    gameMode: 'crisis',
    description:
      '伝統の鈴鹿サーキット。角田裕毅（P3）とチームメイト（P4）がわずか1.8秒差のランデブー走行で表彰台圏内を猛追中。Lap 4のシケインで他車クラッシュが発生し、電光掲示板に黄色旗と「SAFETY CAR DEPLOYED」が点滅！「Box Box！2台とも入れるのか？！」とピットから緊迫の無線。同一周回で同時にピットインさせれば、2台目に約4.5秒の待機ロスが発生し、後続のライバル群に飲み込まれてしまう！チームオーダーで順位を入れ替えるか、先入れ・後入れをずらすか――名門ピットウォールの真価が試される！',
    playerConfig: {
      ...GRID_DRIVERS[0], // TSU
      basePaceOffset: 0.1,
      startTyre: 'SOFT',
      pit1Lap: 99,
      isPlayer: true,
    },
    teammateConfig: {
      ...GRID_DRIVERS[1], // HAD
      basePaceOffset: 0.18,
      startTyre: 'SOFT',
      pit1Lap: 99,
    },
    rivals: GRID_DRIVERS.filter(d => d.code !== 'TSU' && d.code !== 'HAD'),
    startWeather: 'dry',
    weatherForecast: {
      radarDesc: '鈴鹿上空は晴れ時々曇り。Lap 4前後に高確率でSC出動予想（85%）。',
      estimatedLapMin: 99,
      estimatedLapMax: 99,
      rainProbabilityPercent: 10,
    },
    actualRainLap: 999,
    actualRainIntensity: 0,
    scProbability: 0.95,
    actualScLap: 4,
    hiddenTireWearMultiplier: 1.2,
  },
  {
    id: 'spa_weather_chaos_kemmel',
    title: '🇧🇪 スパ: 名物スパ・ウェザー！急激な豪雨とケメルストレート迎撃',
    tag: 'スパ・ウェザー急変・極限豪雨',
    circuit: SIM_CIRCUITS[12], // Spa
    totalLaps: 7,
    targetPosition: 1,
    difficulty: 'hard',
    defaultAiDifficulty: 'master',
    lockedSettings: {
      weather: true,
      rainLap: true,
      lockReason: '急激なスパ・ウェザー豪雨に見舞われるシナリオのため、天候設定は固定されています。',
    },
    gameMode: 'crisis',
    description:
      '世界屈指の難コース、スパ・フランコルシャン。オールージュを駆け抜けた直後、ケメルストレートからブランシモンにかけて巨大な雷雲が直撃！セクター1はまだ乾いているが、セクター2以降は路面水深が瞬く間に1.0mmから3.5mmのヘビーウェット領域へ急変！「前が全く見えない！アクアプレーニングでコントロール不能だ！」と絶叫が無線に響く。スリックのまま1周耐えるか、インターで奇襲するか、あるいはフルウェットで安全マージンをとるか――天候レーダーのミリ単位の水深を見極めて逆転優勝を勝ち取れ！',
    playerConfig: {
      ...GRID_DRIVERS[4], // NOR (McLaren)
      basePaceOffset: 0.05,
      startTyre: 'MEDIUM',
      pit1Lap: 99,
      isPlayer: true,
    },
    teammateConfig: {
      ...GRID_DRIVERS[5], // PIA
      basePaceOffset: 0.15,
      startTyre: 'MEDIUM',
      pit1Lap: 99,
    },
    rivals: GRID_DRIVERS.filter(d => d.code !== 'NOR' && d.code !== 'PIA'),
    startWeather: 'dry',
    weatherForecast: {
      radarDesc: 'アルデンヌ上空に局地雷雨。Lap 3で急激な豪雨（水深3.5mm突破）到達予想（95%）。',
      estimatedLapMin: 3,
      estimatedLapMax: 4,
      rainProbabilityPercent: 95,
    },
    actualRainLap: 3,
    actualRainIntensity: 3.6,
    scProbability: 0.4,
    hiddenTireWearMultiplier: 1.3,
  },
  {
    id: 'madrid_inaugural_duel',
    title: '🇪🇸 マドリング初開催！新設ハイブリッド公道＆超高速バンク迎撃戦',
    tag: '2026新設コース・バンク迎撃',
    circuit: SIM_CIRCUITS.find(c => c.id === 'madrid') || SIM_CIRCUITS[11],
    totalLaps: 8,
    targetPosition: 5,
    difficulty: 'hard',
    defaultAiDifficulty: 'master',
    lockedSettings: {
      startTyre: true,
      weather: true,
      lockReason: 'マドリング初開催記念シナリオのため、初期条件は固定されています。',
    },
    gameMode: 'crisis',
    description:
      '2026年F1世界選手権の最大の目玉、新設「マドリング（IFEMAマドリード市街地コース）」初開催！市街地特有の直角コーナーと傾斜10度の超高速バンクが融合した世界初のハイブリッド公道レイアウト。猛暑44℃の路面温度下、角田裕毅（P7）が前方のフェラーリ・アストンマーティンを猛追中。Lap 4で市街地セクションにて他車接触によるバーチャルセーフティカー（VSC）が発生！熱ダレするタイヤをチープピットで救うか、ステイアウトしてバンクのドラフティングで仕留めるか？！',
    playerConfig: {
      ...GRID_DRIVERS[0], // TSU
      basePaceOffset: 0.12,
      startTyre: 'MEDIUM',
      pit1Lap: 99,
      isPlayer: true,
    },
    teammateConfig: {
      ...GRID_DRIVERS[1], // LAW
      basePaceOffset: 0.25,
      startTyre: 'HARD',
      pit1Lap: 99,
    },
    rivals: GRID_DRIVERS.filter(d => d.code !== 'TSU' && d.code !== 'LAW'),
    startWeather: 'dry',
    weatherForecast: {
      radarDesc: 'マドリード上空は雲ひとつない快晴。路面温度44℃。Lap 4前後に高確率でVSC出動予想（80%）。',
      estimatedLapMin: 99,
      estimatedLapMax: 99,
      rainProbabilityPercent: 0,
    },
    actualRainLap: 999,
    actualRainIntensity: 0,
    scProbability: 0.7,
    hiddenTireWearMultiplier: 1.25,
  },
];


// ── Tactical Mission Mode Challenges ──────────────────────────────────────────
export const MISSION_CHALLENGES: ChallengeScenario[] = [
  {
    id: 'cadillac_p22_miracle',
    title: '🏁【特務】キャデラックの奇跡: 最後尾P22から執念のP10入賞',
    tag: '新興チーム・入賞ボーダー突破',
    circuit: SIM_CIRCUITS[8], // Montreal
    totalLaps: 9,
    targetPosition: 10,
    difficulty: 'hard',
    defaultAiDifficulty: 'master',
    lockedSettings: {
      startTyre: true,
      weather: true,
      lockReason: '最後尾からの奇跡ミッションのため、ハードタイヤ固定です。',
    },
    gameMode: 'mission',
    description:
      '2026年、世界最高峰F1に挑む新規参入チーム「キャデラックF1」。セルジオ・ペレスが駆る11号車は予選トラブルにより無情の最後尾P22グリッドに沈んだ。ジル・ヴィルヌーヴのタイトなシケインで繰り広げられる中団グループの激しいDRSトレイン。タイヤを極限まで保たせ、他車がピットに飛び込む隙間を突いてポジションを挽回。チームの歴史に永遠に刻まれる奇跡の「初参戦・初ポイント（P10）」を奪い取れ！',
    playerConfig: {
      ...GRID_DRIVERS[20], // PER (#11 Cadillac)
      basePaceOffset: 0.45,
      startTyre: 'HARD',
      pit1Lap: 99,
      isPlayer: true,
    },
    teammateConfig: {
      ...GRID_DRIVERS[21], // BOT (#77 Cadillac)
      basePaceOffset: 0.55,
      startTyre: 'MEDIUM',
      pit1Lap: 99,
    },
    rivals: GRID_DRIVERS.filter((d) => d.code !== 'PER' && d.code !== 'BOT'),
    startWeather: 'dry',
    weatherForecast: {
      radarDesc: 'ジル・ヴィルヌーヴ・サーキット。中団が大混戦。SC波乱の兆候あり。',
      estimatedLapMin: 99,
      estimatedLapMax: 99,
      rainProbabilityPercent: 25,
    },
    scProbability: 0.7,
    actualScLap: 4,
    hiddenTireWearMultiplier: 1.15,
  },
  {
    id: 'no_pit_gamble_monza',
    title: '🛞【特務】タイヤ無交換の奇蹟: デグラデーション限界で残り6周を守り切れ',
    tag: 'タイヤ温存・ノーピット死守',
    circuit: SIM_CIRCUITS[15], // Monza
    totalLaps: 6,
    targetPosition: 1,
    difficulty: 'hard',
    defaultAiDifficulty: 'master',
    lockedSettings: {
      startTyre: true,
      weather: true,
      lockReason: 'タイヤ無交換・ノーピット死守ミッションのため、ハードタイヤ固定です。',
    },
    gameMode: 'mission',
    description:
      '超高速モンツァの終盤戦。首位を独走するシャルル・ルクレールだが、履いているハードタイヤの摩耗率はすでに75%のクリフ手前。背後からは新品ソフトを履いたライバルたちが毎周1.5秒ずつ差を詰めて迫り来る！「もうグリップが残っていない、どうする？！」ピットに入れば確実に表彰台圏外へ転落する。残りはわずか6周。表面温度とタイヤブリスターを極限でコントロールし、タイヤ無交換（ノーピット）で逃げ切れるか？！',
    playerConfig: {
      ...GRID_DRIVERS[6], // LEC
      basePaceOffset: 0.05,
      startTyre: 'HARD',
      pit1Lap: 99,
      isPlayer: true,
      initialTyreAge: 32,
      initialTyreSurfaceTemp: 126,
      initialTyreCoreTemp: 114,
    },
    teammateConfig: {
      ...GRID_DRIVERS[7], // HAM
      basePaceOffset: 0.15,
      startTyre: 'SOFT',
      pit1Lap: 99,
      initialTyreAge: 1,
      initialTyreSurfaceTemp: 104,
      initialTyreCoreTemp: 100,
    },
    rivals: GRID_DRIVERS.filter((d) => d.code !== 'LEC' && d.code !== 'HAM').map(d =>
      d.code === 'VER' || d.code === 'NOR'
        ? { ...d, startTyre: 'SOFT' as TyreCompound, pit1Lap: 99, initialTyreAge: 1, initialTyreSurfaceTemp: 105, initialTyreCoreTemp: 101 }
        : d
    ),
    startWeather: 'dry',
    weatherForecast: {
      radarDesc: '超高速モンツァ。路面温度42℃。タイヤ表面温度のオーバーヒートに警戒。',
      estimatedLapMin: 99,
      estimatedLapMax: 99,
      rainProbabilityPercent: 0,
    },
    scProbability: 0.1,
    hiddenTireWearMultiplier: 1.4,
  },
  {
    id: 'papaya_rules_1_2',
    title: '👥【特務】パパヤ・ルール: マクラーレン1-2フィニッシュを死守せよ',
    tag: 'チームオーダー・ワンツー独占',
    circuit: SIM_CIRCUITS[14], // Zandvoort
    totalLaps: 8,
    targetPosition: 1,
    difficulty: 'normal',
    defaultAiDifficulty: 'standard',
    lockedSettings: {
      startTyre: true,
      weather: true,
      lockReason: '1-2フィニッシュ死守ミッションのため、ミディアムタイヤ固定です。',
    },
    gameMode: 'mission',
    description:
      '北海の強風が吹き荒れるザントフォールト。マクラーレンがP1ノリス、P2ピアストリのワンツー体制を構築。しかし、背後わずか1秒差には鬼神の如きペースで迫るフェルスタッペン（レッドブル）の影！「パパヤ・ルール（同士討ち厳禁・チーム最優先）」のもと、ピットウォールは2人の若き才能をどう操るのか。スワップか、それともピアストリを盾にしてブロックさせるか。冷徹なチームオーダーで1-2フィニッシュを完遂せよ！',
    playerConfig: {
      ...GRID_DRIVERS[4], // NOR
      basePaceOffset: 0.05,
      startTyre: 'MEDIUM',
      pit1Lap: 99,
      isPlayer: true,
    },
    teammateConfig: {
      ...GRID_DRIVERS[5], // PIA
      basePaceOffset: 0.08,
      startTyre: 'MEDIUM',
      pit1Lap: 99,
    },
    rivals: GRID_DRIVERS.filter((d) => d.code !== 'NOR' && d.code !== 'PIA'),
    startWeather: 'dry',
    weatherForecast: {
      radarDesc: '北海からの海風が強いザントフォールト。トラックポジション最優先。',
      estimatedLapMin: 99,
      estimatedLapMax: 99,
      rainProbabilityPercent: 15,
    },
    scProbability: 0.4,
    hiddenTireWearMultiplier: 1.15,
  },
  {
    id: 'slick_on_damp_madness',
    title: '⚡【特務】雨天スリック逆張り: ダンプ路面を滑走し大逆転勝利せよ',
    tag: '逆張りスリック・限界走行',
    circuit: SIM_CIRCUITS[20], // Interlagos
    totalLaps: 7,
    targetPosition: 1,
    difficulty: 'hard',
    defaultAiDifficulty: 'master',
    lockedSettings: {
      startTyre: true,
      weather: true,
      lockReason: 'ダンプ路面スリック逆張りミッションのため、ソフトタイヤおよび天候は固定です。',
    },
    gameMode: 'mission',
    description:
      'スコール直後のインテルラゴス。路面水深1.2mm、スターティンググリッドに並ぶ全車が緑のインターミディエイトを装着する中、マックス・フェルスタッペンのマシンだけが深紅のソフトスリックを履いてグリッドに静止している。正気の沙汰とは思えないギャンブル。濡れた路面で暴れる野獣のようなF1マシンを手懐け、乾き始めたレコードラインで毎周3秒のタイム差を削り取れ！',
    playerConfig: {
      ...GRID_DRIVERS[2], // VER
      basePaceOffset: 0.0,
      startTyre: 'SOFT',
      pit1Lap: 99,
      isPlayer: true,
    },
    teammateConfig: {
      ...GRID_DRIVERS[3], // LAW
      basePaceOffset: 0.2,
      startTyre: 'INTER',
      pit1Lap: 99,
    },
    rivals: GRID_DRIVERS.filter((d) => d.code !== 'VER' && d.code !== 'LAW').map(d => ({ ...d, startTyre: 'INTER' as TyreCompound, pit1Lap: 99 })),
    startWeather: 'variable',
    weatherForecast: {
      radarDesc: 'スコール通過後。急速にドライラインが形成される見込み。オフライン濡れ注意。',
      estimatedLapMin: 99,
      estimatedLapMax: 99,
      rainProbabilityPercent: 20,
    },
    actualRainLap: 1,
    actualRainIntensity: 1.2,
    scProbability: 0.5,
    hiddenTireWearMultiplier: 1.3,
  },
];

// Weather re-roll helper for any scenario
export function rerollScenarioWeather(base: ChallengeScenario): ChallengeScenario {
  const weatherChoices: WeatherType[] = ['dry', 'variable', 'drizzle', 'monsoon'];
  const newWeather = weatherChoices[Math.floor(Math.random() * weatherChoices.length)];
  const hasRain = newWeather !== 'dry';
  const rainLap = hasRain ? Math.max(2, Math.floor(Math.random() * Math.max(2, base.totalLaps - 1)) + 1) : undefined;
  const rainIntensity =
    newWeather === 'monsoon' ? 4.2 : newWeather === 'drizzle' ? 1.4 : hasRain ? 2.5 : 0;
  const scProb = Math.random() < 0.35 ? 0.85 : Math.random() < 0.7 ? 0.45 : 0.15;
  const scLap = scProb > 0.4 ? Math.max(2, Math.floor(Math.random() * base.totalLaps) + 1) : undefined;

  let radarDesc = '快晴ドライコンディション。天候安定。';
  if (newWeather === 'monsoon') {
    radarDesc = `猛烈なモンスーン豪雨警戒！${rainLap ? `Lap ${rainLap}付近` : '序盤'}に豪雨直撃予測。`;
  } else if (newWeather === 'drizzle') {
    radarDesc = `雨上がりダンプ路面。乾きゆくレコードラインを見極めよ。`;
  } else if (newWeather === 'variable') {
    radarDesc = `雨雲が接近中。${rainLap ? `Lap ${rainLap}前後に降雨到達の可能性高し。` : '突発降雨警戒。'}`;
  }

  return {
    ...base,
    id: `${base.id}_reroll_${Date.now()}`,
    startWeather: newWeather,
    weatherForecast: {
      radarDesc,
      estimatedLapMin: rainLap ? Math.max(1, rainLap - 1) : 99,
      estimatedLapMax: rainLap ? Math.min(base.totalLaps, rainLap + 2) : 99,
      rainProbabilityPercent: hasRain ? Math.floor(Math.random() * 35) + 65 : 10,
    },
    actualRainLap: rainLap,
    actualRainIntensity: rainIntensity,
    scProbability: scProb,
    actualScLap: scLap,
  };
}

// Sandbox (Practice) scenario generator
export function generateSandboxScenario(params: {
  circuitId: string;
  playerCode: string;
  totalLaps?: number;
  weatherType?: WeatherType;
  rainStartLap?: number;
  rainIntensityMm?: number;
  incidentFrequency?: IncidentFrequency;
  scLap?: number;
}): ChallengeScenario {
  const circuit = SIM_CIRCUITS.find((c) => c.id === params.circuitId) || SIM_CIRCUITS[2];
  const playerBase = GRID_DRIVERS.find((d) => d.code === params.playerCode) || GRID_DRIVERS[0];
  const tmBase =
    GRID_DRIVERS.find((d) => d.team === playerBase.team && d.code !== playerBase.code) || GRID_DRIVERS[1];
  const rivals = GRID_DRIVERS.filter((d) => d.code !== playerBase.code && d.code !== tmBase.code);
  const laps = params.totalLaps || 10;
  const weather = params.weatherType || 'dry';
  const hasRain = weather !== 'dry';
  const rainIntensity =
    params.rainIntensityMm ??
    (weather === 'monsoon' ? 4.5 : weather === 'drizzle' ? 1.5 : hasRain ? 2.5 : 0);
  const rainLap = params.rainStartLap ?? (hasRain ? Math.max(2, Math.floor(laps * 0.4)) : undefined);
  const scProb =
    params.incidentFrequency === 'high_chaos' ? 0.9 : params.incidentFrequency === 'realistic' ? 0.45 : 0.05;

  let radarDesc = 'フリー練習セッション。天候・路面状況は指定カスタム値に固定。';
  if (weather === 'monsoon') radarDesc = `【練習】豪雨モンスーンテスト (水量 ${rainIntensity.toFixed(1)}mm)`;
  else if (weather === 'drizzle') radarDesc = `【練習】雨上がりダンプ＆乾燥ラインテスト (水量 ${rainIntensity.toFixed(1)}mm)`;
  else if (weather === 'variable')
    radarDesc = `【練習】降雨急変テスト (Lap ${rainLap || 3}雨量 ${rainIntensity.toFixed(1)}mm)`;

  return {
    id: `sandbox_${circuit.id}_${Date.now()}`,
    title: `🔬 ${circuit.name} 戦略サンドボックス (全${laps}周)`,
    tag: '自由練習・シミュレーション',
    circuit,
    totalLaps: laps,
    targetPosition: 1,
    difficulty: 'normal',
    gameMode: 'sandbox',
    description: `${circuit.name}での自由戦略実験モード。天候・周回数・路面状況を自在に変更し、タイヤ熱力学や22台排水乾燥、ピットタイミングの予行演習を行えます。`,
    playerConfig: {
      ...playerBase,
      startTyre: weather === 'monsoon' ? 'WET' : weather === 'drizzle' ? 'INTER' : 'MEDIUM',
      pit1Lap: 99,
      isPlayer: true,
    },
    teammateConfig: {
      ...tmBase,
      startTyre: weather === 'monsoon' ? 'WET' : 'SOFT',
      pit1Lap: 99,
    },
    rivals,
    startWeather: weather,
    weatherForecast: {
      radarDesc,
      estimatedLapMin: rainLap ? Math.max(1, rainLap - 1) : 99,
      estimatedLapMax: rainLap ? Math.min(laps, rainLap + 2) : 99,
      rainProbabilityPercent: hasRain ? 90 : 5,
    },
    actualRainLap: rainLap,
    actualRainIntensity: rainIntensity,
    scProbability: scProb,
    actualScLap: params.scLap,
    hiddenTireWearMultiplier: 1.1,
  };
}

// Sprint full race generator
export function generateSprintRaceScenario(circuitId: string, playerCode: string = 'TSU'): ChallengeScenario {
  const circuit = SIM_CIRCUITS.find((c) => c.id === circuitId) || SIM_CIRCUITS[2];
  const playerBase = GRID_DRIVERS.find((d) => d.code === playerCode) || GRID_DRIVERS[0];
  const tmBase = GRID_DRIVERS.find((d) => d.team === playerBase.team && d.code !== playerBase.code) || GRID_DRIVERS[1];
  const otherDrivers = GRID_DRIVERS.filter((d) => d.code !== playerBase.code && d.code !== tmBase.code);

  return {
    id: `sprint_${circuit.id}_${playerBase.code}`,
    title: `🏆 ${circuit.name} スプリント決勝 (全${circuit.sprintLaps}周)`,
    tag: 'スプリント全周回',
    circuit,
    totalLaps: circuit.sprintLaps,
    targetPosition: 3,
    difficulty: 'normal',
    gameMode: 'sprint',
    description: `${circuit.name}のスプリントレース完全制覇！タイヤ無交換または奇襲ピット、全${circuit.sprintLaps}周をトップストラテジストとして完全指揮せよ！`,
    playerConfig: {
      ...playerBase,
      startTyre: 'MEDIUM',
      pit1Lap: 99,
      isPlayer: true,
    },
    teammateConfig: {
      ...tmBase,
      startTyre: 'SOFT',
      pit1Lap: 99,
    },
    rivals: otherDrivers,
    startWeather: 'dry',
    weatherForecast: {
      radarDesc: 'スプリントセッション。気温26℃、天候安定。',
      estimatedLapMin: 99,
      estimatedLapMax: 99,
      rainProbabilityPercent: 20,
    },
    scProbability: 0.4,
    hiddenTireWearMultiplier: 1.1,
  };
}

// Procedural random scenario generator
export function generateProceduralScenario(): ChallengeScenario {
  const randCircuit = SIM_CIRCUITS[Math.floor(Math.random() * SIM_CIRCUITS.length)];
  const randPlayer = GRID_DRIVERS[Math.floor(Math.random() * GRID_DRIVERS.length)];
  const randTeammate = GRID_DRIVERS.find((d) => d.team === randPlayer.team && d.code !== randPlayer.code) || GRID_DRIVERS[1];
  const randRivals = GRID_DRIVERS.filter((d) => d.code !== randPlayer.code && d.code !== randTeammate.code);

  const hasRain = Math.random() > 0.45;
  const laps = Math.floor(Math.random() * 4) + 6; // 6 to 9 laps
  const rainLap = hasRain ? Math.floor(laps * 0.4) + 1 : undefined;

  return {
    id: `procedural_${Date.now()}`,
    title: `🎲 ${randCircuit.name} 突発クライシス (一期一会)`,
    tag: '無限ランダム生成',
    circuit: randCircuit,
    totalLaps: laps,
    targetPosition: 2,
    difficulty: 'normal',
    gameMode: 'procedural',
    description: `${randCircuit.name}で突発的なレース危機が発生！${randPlayer.name}の司令塔として、リアルタイムに変化する状況へ臨機応変に対応せよ。`,
    playerConfig: {
      ...randPlayer,
      startTyre: 'MEDIUM',
      pit1Lap: 99,
      isPlayer: true,
    },
    teammateConfig: {
      ...randTeammate,
      startTyre: 'SOFT',
      pit1Lap: 99,
    },
    rivals: randRivals,
    startWeather: hasRain ? 'variable' : 'dry',
    weatherForecast: {
      radarDesc: hasRain ? 'レーダー上に散発的な降水エコーあり。急変警戒。' : '快晴ドライコンディション。',
      estimatedLapMin: hasRain ? Math.max(2, (rainLap || 3) - 1) : 99,
      estimatedLapMax: hasRain ? (rainLap || 3) + 2 : 99,
      rainProbabilityPercent: hasRain ? 75 : 10,
    },
    actualRainLap: rainLap,
    actualRainIntensity: hasRain ? 2.5 : 0,
    scProbability: Math.random() > 0.5 ? 0.8 : 0.2,
    actualScLap: Math.random() > 0.5 ? 4 : undefined,
    hiddenTireWearMultiplier: 1.2,
  };
}

// ── AI 100-Point Tactical Scoring & Glossary Linker ───────────────────────────

export interface TacticalScoreBreakdown {
  totalScore: number;
  rank: 'S+' | 'S' | 'A' | 'B' | 'C' | 'D';
  pitTimingScore: number; // 0 to 25
  trafficScore: number; // 0 to 25
  tyreEnergyScore: number; // 0 to 25
  chaosTeamScore: number; // 0 to 25
  keyDecisions: {
    lap: number;
    title: string;
    verdict: 'optimal' | 'good' | 'costly' | 'blunder';
    impactSeconds: number;
    description: string;
    linkedKeywords: string[];
  }[];
  tacticalSummary: string;
  linkedKeywords: string[];
}

export function evaluateTacticalScore(
  snapshots: SimSnapshot[],
  scenario: ChallengeScenario,
  playerOverrides: Record<number, Partial<PlayerTacticalCommand>>,
  radioChoices: Record<string, string>
): TacticalScoreBreakdown {
  const lastSnap = snapshots[snapshots.length - 1];
  const playerCar = lastSnap?.cars.find((c) => c.code === scenario.playerConfig.code);
  const finalPos = playerCar ? playerCar.position : 20;

  const decisions: TacticalScoreBreakdown['keyDecisions'] = [];
  const keywordSet = new Set<string>();

  // 1. Position Delta & Target Achievement Score (Max 25 points)
  let positionScore = 20;
  if (finalPos <= scenario.targetPosition) {
    const bonus = (scenario.targetPosition - finalPos) * 2.5;
    positionScore = Math.min(25, 20 + bonus);
  } else {
    const drop = finalPos - scenario.targetPosition;
    positionScore = Math.max(0, 20 - drop * 2.5);
  }

  // 2. Pit Timing & Crossover Score (Max 25 points)
  let pitTiming = 18;
  if (scenario.actualRainLap && scenario.actualRainLap < scenario.totalLaps) {
    const rainLap = scenario.actualRainLap;
    const playerPittedOptimal = Object.keys(playerOverrides).some(
      (l) => Number(l) <= rainLap + 1 && playerOverrides[Number(l)].boxNextLap
    );
    const playerPittedLate = Object.keys(playerOverrides).some(
      (l) => Number(l) === rainLap + 2 && playerOverrides[Number(l)].boxNextLap
    );

    if (playerPittedOptimal) {
      pitTiming = 25;
      decisions.push({
        lap: rainLap,
        title: 'クロスオーバー直後の即時インター乗り換え',
        verdict: 'optimal',
        impactSeconds: +6.8,
        description: '路面水量の急増（クロスオーバー）を的確に察知し、ライバルに先駆けてピットイン。圧倒的なアウトラップペースで順位を奪取。',
        linkedKeywords: ['crossover', 'undercut'],
      });
      keywordSet.add('crossover');
      keywordSet.add('undercut');
    } else if (playerPittedLate) {
      pitTiming = 10;
      decisions.push({
        lap: rainLap + 2,
        title: 'ピットイン判断の遅れ（1周ステイアウト過多）',
        verdict: 'costly',
        impactSeconds: -4.5,
        description: '雨の強まりに対してピット判断が1周遅れ、スリックタイヤで水たまりを踏みタイムロスを喫した。',
        linkedKeywords: ['crossover'],
      });
      keywordSet.add('crossover');
    } else {
      pitTiming = 0; // Never pitted for wet tyres in rain!
      decisions.push({
        lap: rainLap + 1,
        title: '豪雨時のスリック走行強行（致命的判断ミス）',
        verdict: 'costly',
        impactSeconds: -18.5,
        description: '路面水量が2.0mmを超えた状態でスリックのまま周回を強行。ハイドロプレーニングにより1周あたり5秒以上の大出血を招いた。',
        linkedKeywords: ['crossover', 'degradation'],
      });
      keywordSet.add('crossover');
      keywordSet.add('degradation');
    }
  }

  // Check SC cheap pit
  if (scenario.actualScLap) {
    const scLap = scenario.actualScLap;
    const pitUnderSc = playerOverrides[scLap]?.boxNextLap || playerOverrides[scLap + 1]?.boxNextLap;
    if (pitUnderSc) {
      pitTiming = Math.min(25, pitTiming + 5);
      decisions.push({
        lap: scLap,
        title: 'セーフティカー時のチープピット敢行',
        verdict: 'optimal',
        impactSeconds: +11.2,
        description: '通常22秒のピットロスが11秒に半減するチープピットの窓を完璧に活用。失うはずだったポジションを守り抜いた。',
        linkedKeywords: ['cheap-pit', 'double-stack'],
      });
      keywordSet.add('cheap-pit');
      keywordSet.add('double-stack');
    }
  }

  // 3. Traffic Management (Max 25 points)
  let traffic = 18;
  if (finalPos <= scenario.targetPosition) {
    traffic = 22;
  } else if (finalPos >= 16) {
    // Fell back into backend traffic pack
    traffic = 4;
  } else {
    traffic = Math.max(8, 18 - (finalPos - scenario.targetPosition) * 1.5);
  }

  // 4. Tyre & Thermal Management (Max 25 points)
  let tyreEnergy = 18;
  if (playerCar) {
    if (playerCar.tyreWearPercent > 80) {
      tyreEnergy = 2; // Cliff blown
    } else if (playerCar.thermalWarning === 'OPTIMAL') {
      tyreEnergy = 24;
    } else if (playerCar.thermalWarning === 'BLISTERING_WARNING') {
      tyreEnergy = 8;
    }
  }
  if (finalPos >= 16) {
    tyreEnergy = Math.min(tyreEnergy, 6);
  }

  const total = Math.min(100, Math.max(0, Math.round(positionScore + pitTiming + traffic + tyreEnergy)));
  const rank: TacticalScoreBreakdown['rank'] =
    total >= 94 ? 'S+' : total >= 86 ? 'S' : total >= 75 ? 'A' : total >= 65 ? 'B' : total >= 50 ? 'C' : 'D';

  const summary = `総合評価 ${total}点 (Rank ${rank})。最終順位 P${finalPos} (目標 P${scenario.targetPosition})。順位達成度 ${positionScore.toFixed(0)}/25点、ピット戦略適正度 ${pitTiming}/25点、トラフィック回避度 ${traffic}/25点、タイヤ・熱管理 ${tyreEnergy}/25点。`;

  keywordSet.add('clean-air');
  keywordSet.add('dirty-air');
  keywordSet.add('team-order');

  return {
    totalScore: total,
    rank,
    pitTimingScore: pitTiming,
    trafficScore: traffic,
    tyreEnergyScore: tyreEnergy,
    chaosTeamScore: Math.round(positionScore),
    keyDecisions: decisions,
    tacticalSummary: summary,
    linkedKeywords: Array.from(keywordSet),
  };
}
