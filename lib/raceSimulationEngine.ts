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
}

// ── Full 11 Teams Grid (2026/2025 Roster with Teammates) ───────────────────────

export const GRID_DRIVERS: DriverSimConfig[] = [
  // RB Honda
  {
    code: 'TSU',
    name: '角田裕毅',
    number: '22',
    team: 'RB Honda',
    color: '#06b6d4',
    teammateCode: 'HAD',
    basePaceOffset: 0.3,
    machineSetup: { downforce: 'balanced', puMode: 'standard', ersStrategy: 'balanced' },
    startTyre: 'SOFT',
    pit1Lap: 14,
    pit1Tyre: 'HARD',
    crewStopTime: 2.3,
    isPlayer: true,
  },
  {
    code: 'HAD',
    name: 'イサック・ハジャー',
    number: '6',
    team: 'RB Honda',
    color: '#0284c7',
    teammateCode: 'TSU',
    basePaceOffset: 0.45,
    machineSetup: { downforce: 'balanced', puMode: 'standard', ersStrategy: 'balanced' },
    startTyre: 'MEDIUM',
    pit1Lap: 16,
    pit1Tyre: 'HARD',
    crewStopTime: 2.4,
  },
  // Red Bull Racing
  {
    code: 'VER',
    name: 'マックス・フェルスタッペン',
    number: '1',
    team: 'Red Bull Racing',
    color: '#3b82f6',
    teammateCode: 'LAW',
    basePaceOffset: 0.0,
    machineSetup: { downforce: 'balanced', puMode: 'standard', ersStrategy: 'balanced' },
    startTyre: 'MEDIUM',
    pit1Lap: 22,
    pit1Tyre: 'HARD',
    crewStopTime: 2.1,
  },
  {
    code: 'LAW',
    name: 'リアム・ローソン',
    number: '30',
    team: 'Red Bull Racing',
    color: '#1d4ed8',
    teammateCode: 'VER',
    basePaceOffset: 0.28,
    machineSetup: { downforce: 'balanced', puMode: 'standard', ersStrategy: 'balanced' },
    startTyre: 'MEDIUM',
    pit1Lap: 20,
    pit1Tyre: 'HARD',
    crewStopTime: 2.2,
  },
  // McLaren
  {
    code: 'NOR',
    name: 'ランド・ノリス',
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
    name: 'オスカー・ピアストリ',
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
    name: 'シャルル・ルクレール',
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
    name: 'ルイス・ハミルトン',
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
    name: 'ジョージ・ラッセル',
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
    name: 'キミ・アントネッリ',
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
    name: 'フェルナンド・アロンソ',
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
    name: 'ランス・ストロール',
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
    name: 'カルロス・サインツ',
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
    name: 'アレクサンダー・アルボン',
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
    name: 'ピエール・ガスリー',
    number: '10',
    team: 'Alpine',
    color: '#0090ff',
    teammateCode: 'DOO',
    basePaceOffset: 0.40,
    machineSetup: { downforce: 'balanced', puMode: 'standard', ersStrategy: 'balanced' },
    startTyre: 'MEDIUM',
    pit1Lap: 18,
    pit1Tyre: 'HARD',
    crewStopTime: 2.6,
  },
  {
    code: 'DOO',
    name: 'ジャック・ドゥーハン',
    number: '7',
    team: 'Alpine',
    color: '#0070cc',
    teammateCode: 'GAS',
    basePaceOffset: 0.52,
    machineSetup: { downforce: 'balanced', puMode: 'standard', ersStrategy: 'balanced' },
    startTyre: 'HARD',
    pit1Lap: 25,
    pit1Tyre: 'MEDIUM',
    crewStopTime: 2.7,
  },
  // Haas
  {
    code: 'OCO',
    name: 'エステバン・オコン',
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
    name: 'オリバー・ベアマン',
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
    name: 'ニコ・ヒュルケンベルグ',
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
    name: 'ガブリエル・ボルトレート',
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
    code: 'HER',
    name: 'コルトン・ハータ',
    number: '26',
    team: 'Cadillac F1',
    color: '#f59e0b',
    teammateCode: 'DRU',
    basePaceOffset: 0.46,
    machineSetup: { downforce: 'low', puMode: 'standard', ersStrategy: 'balanced' },
    startTyre: 'MEDIUM',
    pit1Lap: 18,
    pit1Tyre: 'HARD',
    crewStopTime: 2.6,
  },
  {
    code: 'DRU',
    name: 'フェリペ・ドルゴヴィッチ',
    number: '34',
    team: 'Cadillac F1',
    color: '#d97706',
    teammateCode: 'HER',
    basePaceOffset: 0.50,
    machineSetup: { downforce: 'low', puMode: 'standard', ersStrategy: 'balanced' },
    startTyre: 'SOFT',
    pit1Lap: 14,
    pit1Tyre: 'HARD',
    crewStopTime: 2.7,
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
  if (typeof window === 'undefined') return;
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const audioCtx = new AudioCtx();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1760, audioCtx.currentTime + 0.06);

    gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.005, audioCtx.currentTime + 0.1);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.1);
  } catch {
    // Suppress audio failure if blocked by browser policy
  }
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
  } = params;

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
      isRetired: boolean;
      retirementReason?: string;
      retirementLap?: number;
    }
  > = {};

  for (const d of drivers) {
    trackers[d.code] = {
      cumulativeTime: 0,
      currentTyre: d.startTyre,
      tyreAge: 0,
      pitCount: 0,
      puMode: d.machineSetup.puMode,
      ersBoostUsed: false,
      ersBatterySoc: 85,
      surfaceTemp: 100,
      coreTemp: 98,
      fuelKg: Math.round(totalLaps * 1.55 + 5),
      confidence: 88,
      plannedPit1: d.pit1Lap,
      plannedPit1Tyre: d.pit1Tyre,
      plannedPit2: d.pit2Lap,
      plannedPit2Tyre: d.pit2Tyre,
      isRetired: false,
      retirementReason: undefined,
      retirementLap: undefined,
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
      // Check if incident triggers
      let triggerIncident = false;
      if (scTriggerLap && currentLap === scTriggerLap) {
        triggerIncident = true;
      } else if (currentLap > 1 && currentLap < totalLaps && currentLap - lastIncidentLap >= 3) {
        // Roll against calculated risk
        const roll = Math.random() * 100;
        if (roll < incidentRiskPercent * 0.75) {
          triggerIncident = true;
        }
      }

      if (triggerIncident) {
        isSC = true;
        activeScLapsRemaining = 2; // 2 laps of SC
        lastIncidentLap = currentLap;

        // Choose victim car from non-retired AI cars
        const potentialVictims = drivers.filter((d) => !d.isPlayer && !trackers[d.code].isRetired);
        if (potentialVictims.length > 0) {
          const victim = potentialVictims[Math.floor(Math.random() * potentialVictims.length)];
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

    // Rain start / stop broadcasts & Driver Personality Radios
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
        const speakerCode = rainSpeakers[Math.floor(Math.random() * rainSpeakers.length)];
        const lines = DRIVER_RADIO_LINES[speakerCode]?.rain;
        if (lines && lines.length > 0) {
          const line = lines[Math.floor(Math.random() * lines.length)];
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

    // Track which cars pit this lap to detect double-stack
    const pittingCarsThisLap: string[] = [];

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

        const rainReactionLap = isMasterAI
          ? (rainStartLap || 99)
          : isBeginnerAI
          ? (rainStartLap || 99) + 2
          : (rainStartLap || 99) + (driver.code === 'VER' ? 0 : 1);

        if (currentLap === tracker.plannedPit1) {
          wantPit = true;
          targetTyre = tracker.plannedPit1Tyre;
        } else if (currentLap === tracker.plannedPit2) {
          wantPit = true;
          targetTyre = tracker.plannedPit2Tyre || 'HARD';
        } else if (weather.waterDepth >= 1.0 && tracker.currentTyre !== 'INTER' && tracker.currentTyre !== 'WET') {
          if (currentLap >= rainReactionLap) {
            wantPit = true;
            targetTyre = weather.waterDepth >= 4.0 ? 'WET' : 'INTER';
          }
        } else if (isSC && tracker.tyreAge > 14 && tracker.currentTyre !== 'SOFT') {
          wantPit = true;
          targetTyre = 'SOFT';
        } else if (isMasterAI && currentLap > 3) {
          const playerPittedPrevLap = playerOverrides[currentLap - 1]?.boxNextLap;
          if (playerPittedPrevLap && tracker.tyreAge > 12) {
            wantPit = true;
            targetTyre = 'HARD';
          }
        }
      }

      if (wantPit) pittingCarsThisLap.push(driver.code);
    }

    // Check double-stack between player and teammate
    let playerDoubleStackDelay = 0;
    let teammateDoubleStackDelay = 0;
    if (teammateDriver) {
      const playerPits = pittingCarsThisLap.includes(playerDriver.code);
      const teammatePits = pittingCarsThisLap.includes(teammateDriver.code);
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

    // Calculate lap physics for each car
    for (const driver of drivers) {
      const tracker = trackers[driver.code];
      const isPlayer = driver.code === playerDriver.code;

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

      const isPitting = pittingCarsThisLap.includes(driver.code);

      let lapPitLoss = 0;
      let staticCrewTime = 0;
      let note: string | undefined = undefined;

      if (isPitting) {
        tracker.pitCount += 1;
        const chosenTyre = isPlayer ? playerOverride.nextCompound || 'INTER' : tracker.currentTyre;
        tracker.currentTyre = chosenTyre;
        tracker.tyreAge = 0;
        tracker.surfaceTemp = 95;
        tracker.coreTemp = 90;

        staticCrewTime = driver.crewStopTime + (Math.random() * 0.4 - 0.2);
        if (isPlayer && playerDoubleStackDelay > 0) staticCrewTime += playerDoubleStackDelay;
        if (!isPlayer && driver.code === teammateDriver?.code && teammateDoubleStackDelay > 0) {
          staticCrewTime += teammateDoubleStackDelay;
        }

        const pitLaneLoss = isSC ? circuit.pitLaneLoss * 0.52 : circuit.pitLaneLoss;
        lapPitLoss = pitLaneLoss + staticCrewTime;
        note = isSC ? 'CHEAP PIT (SC)' : 'BOX STOP';

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

      // PU Mode modifier
      let puPaceMod = 0;
      if (tracker.puMode === 'push') {
        puPaceMod = -0.35;
        tracker.surfaceTemp += 2.5;
        tracker.coreTemp += 1.2;
        tracker.ersBatterySoc = Math.max(15, tracker.ersBatterySoc - 8);
      } else if (tracker.puMode === 'conserve') {
        puPaceMod = +0.45;
        tracker.surfaceTemp = Math.max(90, tracker.surfaceTemp - 2.0);
        tracker.ersBatterySoc = Math.min(100, tracker.ersBatterySoc + 6);
      } else {
        tracker.surfaceTemp += 0.5;
      }

      // ERS Boost modifier
      let ersPaceMod = 0;
      if (tracker.ersBoostUsed && tracker.ersBatterySoc > 20) {
        ersPaceMod = -0.65;
        tracker.ersBatterySoc = Math.max(5, tracker.ersBatterySoc - 22);
      }

      // Tyre wear & cliff calculation
      const wearMultiplier = tracker.tyreAge > tyreProp.cliffLap ? 3.2 : 1.0;
      const tyreWearPacePenalty = tracker.tyreAge * tyreProp.wearRate * circuit.tyreAggression * wearMultiplier;
      const wearPercent = Math.min(100, Math.round((tracker.tyreAge / (tyreProp.cliffLap * 1.5)) * 100));

      // Thermal warnings
      let thermalWarning: 'NONE' | 'GRAINING_RISK' | 'BLISTERING_WARNING' | 'OPTIMAL' = 'OPTIMAL';
      if (tracker.surfaceTemp > 128) {
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

      // Fuel burn off (lighter car = faster lap: -0.035s per lap)
      tracker.fuelKg = Math.max(2, tracker.fuelKg - 1.55);
      const fuelPaceBonus = -((totalLaps - currentLap) * 0.035);

      // Track evolution (22 cars laying down rubber every lap improves baseline grip by up to 0.25s)
      const trackEvolutionBonus = -Math.min(0.25, (currentLap / totalLaps) * 0.22);

      // SC pacing
      const scPaceAdd = isSC ? circuit.baseLapTime * 0.42 : 0;

      // Jitter
      const jitter = (Math.random() - 0.5) * 0.35;

      const lapDuration =
        baseLap +
        tyreProp.speedDelta +
        puPaceMod +
        ersPaceMod +
        tyreWearPacePenalty +
        waterPenalty +
        fuelPaceBonus +
        trackEvolutionBonus +
        scPaceAdd +
        lapPitLoss +
        jitter;

      tracker.cumulativeTime += lapDuration;

      if (!isSC && lapDuration < globalFastestLap.time && lapPitLoss === 0) {
        globalFastestLap = { code: driver.code, time: lapDuration, lap: currentLap };
      }

      const circuitLenM = 5400;
      const avgSpeedKmH = Math.round((circuitLenM / Math.max(35, lapDuration)) * 3.6);
      const currentSpeedKmH = isPitting ? 80 : isSC ? Math.min(155, Math.max(135, Math.round(avgSpeedKmH * 0.72))) : avgSpeedKmH;

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
      });
    }

    // Separate active cars and retired (DNF) cars
    const activeCars = lapCarStates.filter((c) => !c.isRetired);
    const retiredCars = lapCarStates.filter((c) => c.isRetired);

    // STRICT SAFETY CAR REGULATION: Position Freeze!
    if (isSC && currentLap > 1 && snapshots.length > 0) {
      const prevSnapshot = snapshots[snapshots.length - 1];
      const prevOrderMap = new Map<string, number>();
      prevSnapshot.cars.forEach((c) => prevOrderMap.set(c.code, c.position));

      activeCars.sort((a, b) => {
        if (a.isPitting && !b.isPitting) return 1;
        if (!a.isPitting && b.isPitting) return -1;
        return (prevOrderMap.get(a.code) || 99) - (prevOrderMap.get(b.code) || 99);
      });
    } else {
      activeCars.sort((a, b) => a.cumulativeTime - b.cumulativeTime);
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
        car.tyreSurfaceTemp = Math.min(145, car.tyreSurfaceTemp + 4);
      }
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
    });
  }

  return snapshots;
}

// ── Challenge Scenarios & Procedural Generator ────────────────────────────────

export interface ChallengeScenario {
  id: string;
  title: string;
  tag: string;
  circuit: CircuitSimProfile;
  totalLaps: number;
  targetPosition: number;
  difficulty: 'easy' | 'normal' | 'hard';
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
    gameMode: 'crisis',
    description:
      '雨上がりのシルバーストン。インターでスタートしたが、太陽が照り急速にレコードラインが乾燥中。インターの熱ダレに耐えきれなくなる前に、誰よりも早くスリックへ飛び込む英断を下せ！',
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
    rivals: GRID_DRIVERS.filter(d => d.code !== 'RUS' && d.code !== 'ANT'),
    startWeather: 'drizzle',
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
    gameMode: 'crisis',
    description:
      '角田裕毅(P5)として出走。鈴鹿の空に低気圧が急速接近中。何周目に雨雲が到達するか見極め、ライバルより1周早くインターへ履き替えてポディウム(P3以内)を奪い取れ！',
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
    gameMode: 'crisis',
    description:
      'フェルスタッペン(P2)を追うノリス(P2スタート)。モンツァの高速ストレートで前走車のダーティエアを避け、完璧なピットインでクリーンエアに抜け出し逆転優勝を果たせ！',
    playerConfig: {
      ...GRID_DRIVERS[4], // NOR
      basePaceOffset: 0.05,
      startTyre: 'SOFT',
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
    gameMode: 'crisis',
    description:
      'フェラーリのルクレール(P3)として出走。ケメルストレートでクラッシュ発生、SC出動！相方ハミルトンと同時にピットに入るとダブルスタック待機(+4.5秒)が発生する。どちらを優先するか英断を下せ！',
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
    gameMode: 'crisis',
    description:
      'モナコ市街地戦。前走車フェルスタッペンがピットイン！クリーンエアの中で猛プッシュしてインラップ最速を叩き出し、ピット出口で前に出るオーバーカットを完遂せよ！',
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
    gameMode: 'crisis',
    description:
      '熱帯夜のシンガポール。クラッシュ多発によるSC出動率極大のコース。周囲がステイアウトする中、あえてソフトタイヤに履き替えて終盤の超攻撃的オーバーテイクで表彰台を奪い取れ！',
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
    gameMode: 'mission',
    description:
      '2026年新規参入キャデラックF1のコルトン・ハータとしてP22(最後尾)から出走。混戦の中団DRSトレインと他車のピットタイミング隙間を縫い、奇跡の「激戦区1ポイント(P10)」をもぎ取れ！',
    playerConfig: {
      ...GRID_DRIVERS[20], // HER (#26 Cadillac)
      basePaceOffset: 0.45,
      startTyre: 'HARD',
      pit1Lap: 99,
      isPlayer: true,
    },
    teammateConfig: {
      ...GRID_DRIVERS[21], // DRU (#34 Cadillac)
      basePaceOffset: 0.6,
      startTyre: 'MEDIUM',
      pit1Lap: 99,
    },
    rivals: GRID_DRIVERS.filter((d) => d.code !== 'HER' && d.code !== 'DRU'),
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
    gameMode: 'mission',
    description:
      '首位を走るルクレール。ライバルが新品タイヤで猛追する中、あえてピットに入らず摩耗75%のハードタイヤでチェッカーまで逃げ切れるか？！表面・内部温度の超精密管理が試される！',
    playerConfig: {
      ...GRID_DRIVERS[6], // LEC
      basePaceOffset: 0.05,
      startTyre: 'HARD',
      pit1Lap: 99,
      isPlayer: true,
    },
    teammateConfig: {
      ...GRID_DRIVERS[7], // HAM
      basePaceOffset: 0.15,
      startTyre: 'SOFT',
      pit1Lap: 99,
    },
    rivals: GRID_DRIVERS.filter((d) => d.code !== 'LEC' && d.code !== 'HAM'),
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
    gameMode: 'mission',
    description:
      'マクラーレンのピットウォール司令官としてノリス(P1)とピアストリ(P2)を指揮。背後からフェルスタッペン(P3)が急接近！相方へのチームオーダー（ブロック/順位入替）を適切に駆使し1-2フィニッシュを完全達成せよ！',
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
    gameMode: 'mission',
    description:
      '雨上がりのインテルラゴス。路面水深1.2mm、全車がインターミディエイトを履く中、あえてソフトスリックでスタート！濡れた路面で滑るマシンを手懐け、乾き始めたレコードラインで圧倒的タイム差を削り取れ！',
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
    rivals: GRID_DRIVERS.filter((d) => d.code !== 'VER' && d.code !== 'LAW'),
    startWeather: 'drizzle',
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
  const finalPos = playerCar ? playerCar.position : 5;

  let pitTiming = 20;
  let traffic = 20;
  let tyreEnergy = 20;
  let chaosTeam = 20;

  const decisions: TacticalScoreBreakdown['keyDecisions'] = [];
  const keywordSet = new Set<string>();

  // Check pit timing vs rain
  if (scenario.actualRainLap && scenario.actualRainLap < scenario.totalLaps) {
    const rainLap = scenario.actualRainLap;
    const playerPitted = Object.keys(playerOverrides).some(
      (l) => Number(l) <= rainLap + 2 && playerOverrides[Number(l)].boxNextLap
    );
    if (playerPitted) {
      pitTiming += 5;
      chaosTeam += 4;
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
    } else {
      pitTiming -= 8;
      decisions.push({
        lap: rainLap + 1,
        title: '雨天時のステイアウト過多によるハイドロプレーニング',
        verdict: 'costly',
        impactSeconds: -9.2,
        description: '路面水量が2.0mmを超えた状態でスリックタイヤのまま周回を重ね、1周あたり4秒以上の大出血を招いた。',
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
      pitTiming += 4;
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

  // Position bonus
  if (finalPos <= scenario.targetPosition) {
    pitTiming = Math.min(25, pitTiming + 2);
    traffic = Math.min(25, traffic + 3);
    chaosTeam = Math.min(25, chaosTeam + 2);
  } else {
    traffic = Math.max(10, traffic - 4);
    chaosTeam = Math.max(10, chaosTeam - 3);
  }

  const total = Math.min(100, Math.max(35, pitTiming + traffic + tyreEnergy + chaosTeam));
  const rank: TacticalScoreBreakdown['rank'] =
    total >= 94 ? 'S+' : total >= 86 ? 'S' : total >= 75 ? 'A' : total >= 65 ? 'B' : total >= 50 ? 'C' : 'D';

  const summary = `総合評価 ${total}点 (Rank ${rank})。最終順位 P${finalPos} (目標 P${scenario.targetPosition})。ピット窓口適正度 ${pitTiming}/25点、トラフィック回避度 ${traffic}/25点、タイヤ・熱管理 ${tyreEnergy}/25点、突発適応・チームワーク ${chaosTeam}/25点。`;

  keywordSet.add('clean-air');
  keywordSet.add('dirty-air');
  keywordSet.add('team-order');

  return {
    totalScore: total,
    rank,
    pitTimingScore: pitTiming,
    trafficScore: traffic,
    tyreEnergyScore: tyreEnergy,
    chaosTeamScore: chaosTeam,
    keyDecisions: decisions,
    tacticalSummary: summary,
    linkedKeywords: Array.from(keywordSet),
  };
}
