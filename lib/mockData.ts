/**
 * lib/mockData.ts
 * F1 Telemetry Analyzer - Typed Mock Data (Bahrain GP 2024)
 *
 * Ported and strictly typed version of the legacy mockData.js.
 * Used in Demo Mode and for offline development.
 */

import type {
  Session,
  Driver,
  Stint,
  Lap,
  TeamRadio,
  PitStop,
  RaceControlMessage,
} from './types';

import {
  F1_CATALOG_ALL_SESSIONS,
  getCatalogSessionsForYear,
  getDriversForYear,
  generateCatalogStints,
  generateCatalogRaceControl,
} from './f1GrandPrixCatalog';

import { resolveCircuitForSession, type CircuitBenchmark } from './circuitResolver';

export {
  getCatalogSessionsForYear,
  getDriversForYear,
  generateCatalogStints,
  generateCatalogRaceControl,
};

// ─────────────────────────────────────────────────────────────
// Sessions (All 4 Seasons: 2024, 2023, 2022, 2021)
// ─────────────────────────────────────────────────────────────

export const MOCK_SESSIONS: Session[] = F1_CATALOG_ALL_SESSIONS;

// ─────────────────────────────────────────────────────────────
// Drivers (keyed by session_key)
// ─────────────────────────────────────────────────────────────

export const MOCK_DRIVERS: Record<number, Driver[]> = {
  9161: [
    { driver_number: 1,  name_acronym: 'VER', first_name: 'Max',       last_name: 'Verstappen', full_name: 'Max Verstappen',   team_name: 'Red Bull Racing', team_colour: '3671C2' },
    { driver_number: 11, name_acronym: 'PER', first_name: 'Sergio',    last_name: 'Perez',      full_name: 'Sergio Perez',     team_name: 'Red Bull Racing', team_colour: '3671C2' },
    { driver_number: 55, name_acronym: 'SAI', first_name: 'Carlos',    last_name: 'Sainz',      full_name: 'Carlos Sainz',     team_name: 'Ferrari',         team_colour: 'E80020' },
    { driver_number: 16, name_acronym: 'LEC', first_name: 'Charles',   last_name: 'Leclerc',    full_name: 'Charles Leclerc',  team_name: 'Ferrari',         team_colour: 'E80020' },
    { driver_number: 63, name_acronym: 'RUS', first_name: 'George',    last_name: 'Russell',    full_name: 'George Russell',   team_name: 'Mercedes',        team_colour: '00A19B' },
    { driver_number: 4,  name_acronym: 'NOR', first_name: 'Lando',     last_name: 'Norris',     full_name: 'Lando Norris',     team_name: 'McLaren',         team_colour: 'FF8000' },
    { driver_number: 44, name_acronym: 'HAM', first_name: 'Lewis',     last_name: 'Hamilton',   full_name: 'Lewis Hamilton',   team_name: 'Mercedes',        team_colour: '00A19B' },
    { driver_number: 81, name_acronym: 'PIA', first_name: 'Oscar',     last_name: 'Piastri',    full_name: 'Oscar Piastri',    team_name: 'McLaren',         team_colour: 'FF8000' },
    { driver_number: 14, name_acronym: 'ALO', first_name: 'Fernando',  last_name: 'Alonso',     full_name: 'Fernando Alonso',  team_name: 'Aston Martin',    team_colour: '229971' },
    { driver_number: 18, name_acronym: 'STR', first_name: 'Lance',     last_name: 'Stroll',     full_name: 'Lance Stroll',     team_name: 'Aston Martin',    team_colour: '229971' },
    { driver_number: 24, name_acronym: 'ZHO', first_name: 'Guanyu',    last_name: 'Zhou',       full_name: 'Guanyu Zhou',      team_name: 'Kick Sauber',     team_colour: '52E252' },
    { driver_number: 20, name_acronym: 'MAG', first_name: 'Kevin',     last_name: 'Magnussen',  full_name: 'Kevin Magnussen',  team_name: 'Haas',            team_colour: 'B6BABD' },
    { driver_number: 3,  name_acronym: 'RIC', first_name: 'Daniel',    last_name: 'Ricciardo',  full_name: 'Daniel Ricciardo', team_name: 'RB',              team_colour: '6692FF' },
    { driver_number: 22, name_acronym: 'TSU', first_name: 'Yuki',      last_name: 'Tsunoda',    full_name: 'Yuki Tsunoda',    team_name: 'RB',              team_colour: '6692FF' },
    { driver_number: 23, name_acronym: 'ALB', first_name: 'Alexander', last_name: 'Albon',      full_name: 'Alexander Albon',  team_name: 'Williams',        team_colour: '64C4FF' },
    { driver_number: 27, name_acronym: 'HUL', first_name: 'Nico',      last_name: 'Hulkenberg', full_name: 'Nico Hulkenberg', team_name: 'Haas',            team_colour: 'B6BABD' },
    { driver_number: 31, name_acronym: 'OCO', first_name: 'Esteban',   last_name: 'Ocon',       full_name: 'Esteban Ocon',     team_name: 'Alpine',          team_colour: '0093CC' },
    { driver_number: 10, name_acronym: 'GAS', first_name: 'Pierre',    last_name: 'Gasly',      full_name: 'Pierre Gasly',     team_name: 'Alpine',          team_colour: '0093CC' },
    { driver_number: 77, name_acronym: 'BOT', first_name: 'Valtteri',  last_name: 'Bottas',    full_name: 'Valtteri Bottas',  team_name: 'Kick Sauber',     team_colour: '52E252' },
    { driver_number: 2,  name_acronym: 'SAR', first_name: 'Logan',     last_name: 'Sargeant',   full_name: 'Logan Sargeant',   team_name: 'Williams',        team_colour: '64C4FF' },
  ],
  9162: [
    { driver_number: 1,  name_acronym: 'VER', first_name: 'Max',     last_name: 'Verstappen', full_name: 'Max Verstappen',  team_name: 'Red Bull Racing', team_colour: '3671C2' },
    { driver_number: 16, name_acronym: 'LEC', first_name: 'Charles', last_name: 'Leclerc',    full_name: 'Charles Leclerc', team_name: 'Ferrari',         team_colour: 'E80020' },
    { driver_number: 63, name_acronym: 'RUS', first_name: 'George',  last_name: 'Russell',    full_name: 'George Russell',  team_name: 'Mercedes',        team_colour: '00A19B' },
    { driver_number: 4,  name_acronym: 'NOR', first_name: 'Lando',   last_name: 'Norris',     full_name: 'Lando Norris',    team_name: 'McLaren',         team_colour: 'FF8000' },
  ],
  9163: [
    { driver_number: 1,  name_acronym: 'VER', first_name: 'Max',    last_name: 'Verstappen', full_name: 'Max Verstappen', team_name: 'Red Bull Racing', team_colour: '3671C2' },
    { driver_number: 11, name_acronym: 'PER', first_name: 'Sergio', last_name: 'Perez',      full_name: 'Sergio Perez',   team_name: 'Red Bull Racing', team_colour: '3671C2' },
    { driver_number: 16, name_acronym: 'LEC', first_name: 'Charles',last_name: 'Leclerc',    full_name: 'Charles Leclerc',team_name: 'Ferrari',         team_colour: 'E80020' },
    { driver_number: 55, name_acronym: 'SAI', first_name: 'Carlos', last_name: 'Sainz',      full_name: 'Carlos Sainz',   team_name: 'Ferrari',         team_colour: 'E80020' },
    { driver_number: 4,  name_acronym: 'NOR', first_name: 'Lando',  last_name: 'Norris',     full_name: 'Lando Norris',   team_name: 'McLaren',         team_colour: 'FF8000' },
  ],
};

// ─────────────────────────────────────────────────────────────
// Stints (keyed by session_key)
// ─────────────────────────────────────────────────────────────

export const MOCK_STINTS: Record<number, Stint[]> = {
  9161: [
    // 1. Max Verstappen (P1)
    { driver_number: 1,  stint_number: 1, lap_start: 1,  lap_end: 17, compound: 'SOFT',   tyre_age_at_start: 0 },
    { driver_number: 1,  stint_number: 2, lap_start: 18, lap_end: 36, compound: 'HARD',   tyre_age_at_start: 0 },
    { driver_number: 1,  stint_number: 3, lap_start: 37, lap_end: 57, compound: 'SOFT',   tyre_age_at_start: 0 },
    // 2. Sergio Perez (P2)
    { driver_number: 11, stint_number: 1, lap_start: 1,  lap_end: 12, compound: 'SOFT',   tyre_age_at_start: 0 },
    { driver_number: 11, stint_number: 2, lap_start: 13, lap_end: 36, compound: 'HARD',   tyre_age_at_start: 0 },
    { driver_number: 11, stint_number: 3, lap_start: 37, lap_end: 57, compound: 'SOFT',   tyre_age_at_start: 0 },
    // 3. Carlos Sainz (P3)
    { driver_number: 55, stint_number: 1, lap_start: 1,  lap_end: 14, compound: 'SOFT',   tyre_age_at_start: 0 },
    { driver_number: 55, stint_number: 2, lap_start: 15, lap_end: 35, compound: 'HARD',   tyre_age_at_start: 0 },
    { driver_number: 55, stint_number: 3, lap_start: 36, lap_end: 57, compound: 'HARD',   tyre_age_at_start: 0 },
    // 4. Charles Leclerc (P4)
    { driver_number: 16, stint_number: 1, lap_start: 1,  lap_end: 11, compound: 'SOFT',   tyre_age_at_start: 0 },
    { driver_number: 16, stint_number: 2, lap_start: 12, lap_end: 34, compound: 'HARD',   tyre_age_at_start: 0 },
    { driver_number: 16, stint_number: 3, lap_start: 35, lap_end: 57, compound: 'HARD',   tyre_age_at_start: 0 },
    // 5. George Russell (P5)
    { driver_number: 63, stint_number: 1, lap_start: 1,  lap_end: 11, compound: 'SOFT',   tyre_age_at_start: 0 },
    { driver_number: 63, stint_number: 2, lap_start: 12, lap_end: 31, compound: 'HARD',   tyre_age_at_start: 0 },
    { driver_number: 63, stint_number: 3, lap_start: 32, lap_end: 57, compound: 'HARD',   tyre_age_at_start: 0 },
    // 6. Lando Norris (P6)
    { driver_number: 4,  stint_number: 1, lap_start: 1,  lap_end: 13, compound: 'SOFT',   tyre_age_at_start: 0 },
    { driver_number: 4,  stint_number: 2, lap_start: 14, lap_end: 33, compound: 'HARD',   tyre_age_at_start: 0 },
    { driver_number: 4,  stint_number: 3, lap_start: 34, lap_end: 57, compound: 'HARD',   tyre_age_at_start: 0 },
    // 7. Lewis Hamilton (P7)
    { driver_number: 44, stint_number: 1, lap_start: 1,  lap_end: 12, compound: 'SOFT',   tyre_age_at_start: 0 },
    { driver_number: 44, stint_number: 2, lap_start: 13, lap_end: 33, compound: 'HARD',   tyre_age_at_start: 0 },
    { driver_number: 44, stint_number: 3, lap_start: 34, lap_end: 57, compound: 'HARD',   tyre_age_at_start: 0 },
    // 8. Oscar Piastri (P8)
    { driver_number: 81, stint_number: 1, lap_start: 1,  lap_end: 12, compound: 'SOFT',   tyre_age_at_start: 0 },
    { driver_number: 81, stint_number: 2, lap_start: 13, lap_end: 34, compound: 'HARD',   tyre_age_at_start: 0 },
    { driver_number: 81, stint_number: 3, lap_start: 35, lap_end: 57, compound: 'HARD',   tyre_age_at_start: 0 },
    // 9. Fernando Alonso (P9)
    { driver_number: 14, stint_number: 1, lap_start: 1,  lap_end: 15, compound: 'SOFT',   tyre_age_at_start: 0 },
    { driver_number: 14, stint_number: 2, lap_start: 16, lap_end: 41, compound: 'HARD',   tyre_age_at_start: 0 },
    { driver_number: 14, stint_number: 3, lap_start: 42, lap_end: 57, compound: 'HARD',   tyre_age_at_start: 0 },
    // 10. Lance Stroll (P10)
    { driver_number: 18, stint_number: 1, lap_start: 1,  lap_end: 1,  compound: 'SOFT',   tyre_age_at_start: 0 },
    { driver_number: 18, stint_number: 2, lap_start: 2,  lap_end: 27, compound: 'HARD',   tyre_age_at_start: 0 },
    { driver_number: 18, stint_number: 3, lap_start: 28, lap_end: 57, compound: 'HARD',   tyre_age_at_start: 0 },
    // 11. Guanyu Zhou (P11)
    { driver_number: 24, stint_number: 1, lap_start: 1,  lap_end: 9,  compound: 'SOFT',   tyre_age_at_start: 0 },
    { driver_number: 24, stint_number: 2, lap_start: 10, lap_end: 28, compound: 'HARD',   tyre_age_at_start: 0 },
    { driver_number: 24, stint_number: 3, lap_start: 29, lap_end: 57, compound: 'HARD',   tyre_age_at_start: 0 },
    // 12. Kevin Magnussen (P12)
    { driver_number: 20, stint_number: 1, lap_start: 1,  lap_end: 12, compound: 'SOFT',   tyre_age_at_start: 0 },
    { driver_number: 20, stint_number: 2, lap_start: 13, lap_end: 32, compound: 'HARD',   tyre_age_at_start: 0 },
    { driver_number: 20, stint_number: 3, lap_start: 33, lap_end: 57, compound: 'HARD',   tyre_age_at_start: 0 },
    // 13. Daniel Ricciardo (P13)
    { driver_number: 3,  stint_number: 1, lap_start: 1,  lap_end: 13, compound: 'SOFT',   tyre_age_at_start: 0 },
    { driver_number: 3,  stint_number: 2, lap_start: 14, lap_end: 35, compound: 'HARD',   tyre_age_at_start: 0 },
    { driver_number: 3,  stint_number: 3, lap_start: 36, lap_end: 57, compound: 'SOFT',   tyre_age_at_start: 0 },
    // 14. Yuki Tsunoda (P14)
    { driver_number: 22, stint_number: 1, lap_start: 1,  lap_end: 14, compound: 'SOFT',   tyre_age_at_start: 0 },
    { driver_number: 22, stint_number: 2, lap_start: 15, lap_end: 34, compound: 'HARD',   tyre_age_at_start: 0 },
    { driver_number: 22, stint_number: 3, lap_start: 35, lap_end: 57, compound: 'HARD',   tyre_age_at_start: 0 },
    // 15. Alexander Albon (P15)
    { driver_number: 23, stint_number: 1, lap_start: 1,  lap_end: 15, compound: 'SOFT',   tyre_age_at_start: 0 },
    { driver_number: 23, stint_number: 2, lap_start: 16, lap_end: 35, compound: 'HARD',   tyre_age_at_start: 0 },
    { driver_number: 23, stint_number: 3, lap_start: 36, lap_end: 57, compound: 'HARD',   tyre_age_at_start: 0 },
    // 16. Nico Hulkenberg (P16)
    { driver_number: 27, stint_number: 1, lap_start: 1,  lap_end: 1,  compound: 'SOFT',   tyre_age_at_start: 0 },
    { driver_number: 27, stint_number: 2, lap_start: 2,  lap_end: 20, compound: 'HARD',   tyre_age_at_start: 0 },
    { driver_number: 27, stint_number: 3, lap_start: 21, lap_end: 42, compound: 'HARD',   tyre_age_at_start: 0 },
    { driver_number: 27, stint_number: 4, lap_start: 43, lap_end: 57, compound: 'SOFT',   tyre_age_at_start: 0 },
    // 17. Esteban Ocon (P17)
    { driver_number: 31, stint_number: 1, lap_start: 1,  lap_end: 10, compound: 'SOFT',   tyre_age_at_start: 0 },
    { driver_number: 31, stint_number: 2, lap_start: 11, lap_end: 30, compound: 'HARD',   tyre_age_at_start: 0 },
    { driver_number: 31, stint_number: 3, lap_start: 31, lap_end: 57, compound: 'HARD',   tyre_age_at_start: 0 },
    // 18. Pierre Gasly (P18)
    { driver_number: 10, stint_number: 1, lap_start: 1,  lap_end: 15, compound: 'SOFT',   tyre_age_at_start: 0 },
    { driver_number: 10, stint_number: 2, lap_start: 16, lap_end: 32, compound: 'HARD',   tyre_age_at_start: 0 },
    { driver_number: 10, stint_number: 3, lap_start: 33, lap_end: 57, compound: 'HARD',   tyre_age_at_start: 0 },
    // 19. Valtteri Bottas (P19)
    { driver_number: 77, stint_number: 1, lap_start: 1,  lap_end: 12, compound: 'SOFT',   tyre_age_at_start: 0 },
    { driver_number: 77, stint_number: 2, lap_start: 13, lap_end: 30, compound: 'HARD',   tyre_age_at_start: 0 },
    { driver_number: 77, stint_number: 3, lap_start: 31, lap_end: 57, compound: 'HARD',   tyre_age_at_start: 0 },
    // 20. Logan Sargeant (P20)
    { driver_number: 2,  stint_number: 1, lap_start: 1,  lap_end: 13, compound: 'SOFT',   tyre_age_at_start: 0 },
    { driver_number: 2,  stint_number: 2, lap_start: 14, lap_end: 34, compound: 'HARD',   tyre_age_at_start: 0 },
    { driver_number: 2,  stint_number: 3, lap_start: 35, lap_end: 57, compound: 'HARD',   tyre_age_at_start: 0 },
  ],
  9162: [
    { driver_number: 1,  stint_number: 1, lap_start: 1, lap_end: 5, compound: 'SOFT', tyre_age_at_start: 0 },
    { driver_number: 16, stint_number: 1, lap_start: 1, lap_end: 5, compound: 'SOFT', tyre_age_at_start: 0 },
  ],
  9163: [
    { driver_number: 1, stint_number: 1, lap_start: 1,  lap_end: 18, compound: 'MEDIUM', tyre_age_at_start: 0 },
    { driver_number: 1, stint_number: 2, lap_start: 19, lap_end: 38, compound: 'MEDIUM', tyre_age_at_start: 0 },
    { driver_number: 1, stint_number: 3, lap_start: 39, lap_end: 53, compound: 'HARD',   tyre_age_at_start: 0 },
  ],
};

// ─────────────────────────────────────────────────────────────
// Team Radio (keyed by "sessionKey_driverNumber")
// ─────────────────────────────────────────────────────────────

export const MOCK_TEAM_RADIO: Record<string, TeamRadio[]> = {
  '9161_1': [
    {
      date: '2024-03-02T15:03:45.000Z',
      recording_url: 'https://livetiming.formula1.com/static/2023/2023-09-17_Singapore_Grand_Prix/2023-09-16_Qualifying/TeamRadio/MAXVER01_1_20230916_141749.mp3',
      driver_number: 1,
      session_key: 9161,
      category: 'PACE',
      transcript: 'Okay Max, clean start. Let\'s build the gap. Debris at turn 4, take care.',
      translation: 'マックス、クリーンなスタートだ。ギャップを広げよう。ターン4にデブリがあるから気をつけて。',
      aiSummary: 'オープニングラップでトップを維持したフェルスタッペンに対し、DRS圏外へ逃げるためのプッシュ指示とデブリ警告。',
    },
    {
      date: '2024-03-02T15:09:50.000Z',
      recording_url: 'https://livetiming.formula1.com/static/2023/2023-09-17_Singapore_Grand_Prix/2023-09-16_Qualifying/TeamRadio/MAXVER01_1_20230916_142555.mp3',
      driver_number: 1,
      session_key: 9161,
      category: 'TYRE',
      transcript: 'How are the tyres Max? - Yeah, tyres are good, pace is stable. No issues.',
      translation: '「マックス、タイヤの状態はどう？」-『タイヤは良好、ペースも安定している。問題ない。』',
      aiSummary: '第1スティント中盤のデグラデーション確認。ペース低下がなくプランA（想定通りのスティント長）を維持。',
    },
    {
      date: '2024-03-02T15:17:30.000Z',
      recording_url: 'https://livetiming.formula1.com/static/2023/2023-09-17_Singapore_Grand_Prix/2023-09-16_Qualifying/TeamRadio/MAXVER01_1_20230916_142903.mp3',
      driver_number: 1,
      session_key: 9161,
      category: 'STRATEGY',
      transcript: 'Okay Max, gap to Perez is 8.4 seconds. Keep managing the pace. Plan A.',
      translation: 'マックス、ペレスとの差は8.4秒だ。ペースマネジメントを続けてくれ。プランAで行く。',
      aiSummary: '2位ペレスとのギャップが安全圏（8秒以上）に達したため、タイヤ温存モードへの移行を指示。',
    },
    {
      date: '2024-03-02T15:28:30.000Z',
      recording_url: 'https://livetiming.formula1.com/static/2023/2023-09-17_Singapore_Grand_Prix/2023-09-16_Qualifying/TeamRadio/MAXVER01_1_20230916_144953.mp3',
      driver_number: 1,
      session_key: 9161,
      category: 'PIT',
      transcript: 'Box this lap Max, box this lap. Hards are ready.',
      translation: 'この周でピットインだマックス。ハードタイヤを準備している。',
      aiSummary: '予定通りのピットウィンドウ到達。アンダーカットを防ぎつつ第2スティントのハードタイヤへ交換。',
    },
    {
      date: '2024-03-02T15:30:10.000Z',
      recording_url: 'https://livetiming.formula1.com/static/2023/2023-09-17_Singapore_Grand_Prix/2023-09-16_Qualifying/TeamRadio/MAXVER01_1_20230916_145526.mp3',
      driver_number: 1,
      session_key: 9161,
      category: 'PACE',
      transcript: 'Pace post-pit is good. Next car is Bottas, 2 seconds ahead. Push now.',
      translation: 'ピットアウト後のペースは良好だ。前はボッタス、差は2秒。プッシュしろ。',
      aiSummary: 'ピットアウト後のトラフィック処理指示。新品ハードの初期ウォームアップ良好を確認。',
    },
    {
      date: '2024-03-02T15:59:55.000Z',
      recording_url: 'https://livetiming.formula1.com/static/2023/2023-09-17_Singapore_Grand_Prix/2023-09-16_Qualifying/TeamRadio/MAXVER01_1_20230916_141749.mp3',
      driver_number: 1,
      session_key: 9161,
      category: 'PIT',
      transcript: 'Box box, box for Softs, push now.',
      translation: 'ピットインだ。ソフトタイヤを履く、今プッシュしろ。',
      aiSummary: 'ファイナルスティント用ソフトタイヤへの2ストップ目。ファステストラップ獲得を狙う最終アタック体制。',
    },
    {
      date: '2024-03-02T16:29:00.000Z',
      recording_url: 'https://livetiming.formula1.com/static/2023/2023-09-17_Singapore_Grand_Prix/2023-09-16_Qualifying/TeamRadio/MAXVER01_1_20230916_142555.mp3',
      driver_number: 1,
      session_key: 9161,
      category: 'PACE',
      transcript: 'Outstanding drive Max! One lap to go, keep it on track.',
      translation: '素晴らしい走りだマックス！残り1周、コース上に留めてくれ。',
      aiSummary: '独走勝利目前でのチェッカーコントロール指示。',
    },
  ],
  '9161_44': [
    {
      date: '2024-03-02T15:03:45.000Z',
      recording_url: 'https://livetiming.formula1.com/static/2023/2023-09-17_Singapore_Grand_Prix/2023-09-16_Qualifying/TeamRadio/LEWHAM01_44_20230916_142617.mp3',
      driver_number: 44,
      session_key: 9161,
      category: 'TYRE',
      transcript: 'Struggling to warm up the Softs. Rear grip is low.',
      translation: 'ソフトタイヤを温めるのに苦労している。リヤのグリップが低い。',
      aiSummary: 'スタート直後のリアタイヤ熱入れ不足とトラクション不足をエンジニアへ報告。',
    },
    {
      date: '2024-03-02T15:08:20.000Z',
      recording_url: 'https://livetiming.formula1.com/static/2023/2023-09-17_Singapore_Grand_Prix/2023-09-16_Qualifying/TeamRadio/LEWHAM01_44_20230916_153501.mp3',
      driver_number: 44,
      session_key: 9161,
      category: 'PACE',
      transcript: 'Verstappen is pulling away. I have no pace. - Copy Lewis, checking engine parameters.',
      translation: '『フェルスタッペンが引き離していく。ペースが上がらない。』-「了解ルイス、エンジンデータを確認中だ。」',
      aiSummary: 'トップとのラップタイム差が0.6秒/周に拡大し、PUモードとデプロイ設定の確認を要請。',
    },
    {
      date: '2024-03-02T15:18:10.000Z',
      recording_url: 'https://livetiming.formula1.com/static/2023/2023-09-17_Singapore_Grand_Prix/2023-09-16_Qualifying/TeamRadio/LEWHAM01_44_20230916_142617.mp3',
      driver_number: 44,
      session_key: 9161,
      category: 'TYRE',
      transcript: 'Tires are dropping off. Left front is graining.',
      translation: 'タイヤの性能が落ちてきた。左フロントにグレーニングが出ている。',
      aiSummary: 'フロントタイヤの劣化が進みタイムが1秒近くドロップしたため、早期ピット（アンダーカット）を模索。',
    },
    {
      date: '2024-03-02T15:25:20.000Z',
      recording_url: 'https://livetiming.formula1.com/static/2023/2023-09-17_Singapore_Grand_Prix/2023-09-16_Qualifying/TeamRadio/LEWHAM01_44_20230916_153501.mp3',
      driver_number: 44,
      session_key: 9161,
      category: 'PIT',
      transcript: 'Box box, box box. Hards ready.',
      translation: 'ピットインだ。ハードタイヤを用意している。',
      aiSummary: 'フェラーリ勢（ルクレール）の前に出るためのアンダーカット発動指示。',
    },
    {
      date: '2024-03-02T15:38:00.000Z',
      recording_url: 'https://livetiming.formula1.com/static/2023/2023-09-17_Singapore_Grand_Prix/2023-09-16_Qualifying/TeamRadio/LEWHAM01_44_20230916_142617.mp3',
      driver_number: 44,
      session_key: 9161,
      category: 'STRATEGY',
      transcript: 'Pace looks matched to Leclerc. Let\'s consolidate.',
      translation: 'ペースはレクレールと同等だ。ポジションを固めよう。',
      aiSummary: 'ピット後にアンダーカットが成功し2位浮上。タイヤマネジメントを継続しポジションキープを図る。',
    },
    {
      date: '2024-03-02T16:27:00.000Z',
      recording_url: 'https://livetiming.formula1.com/static/2023/2023-09-17_Singapore_Grand_Prix/2023-09-16_Qualifying/TeamRadio/LEWHAM01_44_20230916_153501.mp3',
      driver_number: 44,
      session_key: 9161,
      category: 'PACE',
      transcript: 'Excellent job Lewis, P2. That\'s a solid recovery.',
      translation: 'よくやったルイス、P2獲得だ。堅実なリカバリーだ。',
      aiSummary: '予選グリッドからの逆転P2フィニッシュを労う無線。',
    },
  ],
  '9161_16': [
    {
      date: '2024-03-02T15:04:10.000Z',
      recording_url: 'https://livetiming.formula1.com/static/2023/2023-09-17_Singapore_Grand_Prix/2023-09-16_Qualifying/TeamRadio/CHALEC01_16_20230916_140111.mp3',
      driver_number: 16,
      session_key: 9161,
      category: 'SAFETY',
      transcript: 'Yellow flag sector 2. Turn 8 clear now.',
      translation: 'セクター2でイエローフラッグ。ターン8は現在はクリア。',
      aiSummary: '前方マシンのスピンに伴うセクター2黄旗状況の確認。',
    },
    {
      date: '2024-03-02T15:15:30.000Z',
      recording_url: 'https://livetiming.formula1.com/static/2023/2023-09-17_Singapore_Grand_Prix/2023-09-16_Qualifying/TeamRadio/CHALEC01_16_20230916_151616.mp3',
      driver_number: 16,
      session_key: 9161,
      category: 'TYRE',
      transcript: 'Struggling with front locking. Brake balance is forward.',
      translation: 'フロントのロックアップに苦労している。ブレーキバランスが前寄りだ。',
      aiSummary: 'ブレーキ温度上昇によるフロントロック頻発の訴え。BBALのリア側オフセット調整を指示。',
    },
  ],
};

// ─────────────────────────────────────────────────────────────
// Race Control Messages (keyed by session_key)
// ─────────────────────────────────────────────────────────────

export const MOCK_RACE_CONTROL: Record<number, RaceControlMessage[]> = {
  9161: [
    { date: '2024-03-02T15:03:05.000Z', lap_number: 1,  category: 'SessionStatus', message: 'DRS DISABLED',                                     flag: null },
    { date: '2024-03-02T15:05:00.000Z', lap_number: 2,  category: 'Drs',           message: 'DRS ENABLED',                                      flag: null },
    { date: '2024-03-02T15:25:00.000Z', lap_number: 15, category: 'SafetyCar',     message: 'SAFETY CAR DEPLOYED',                               flag: 'YELLOW' },
    { date: '2024-03-02T15:30:00.000Z', lap_number: 18, category: 'SafetyCar',     message: 'SAFETY CAR IN THIS LAP',                            flag: 'GREEN' },
    { date: '2024-03-02T15:31:30.000Z', lap_number: 19, category: 'Drs',           message: 'DRS ENABLED',                                       flag: null },
    { date: '2024-03-02T15:45:00.000Z', lap_number: 28, category: 'Flag',          message: 'TRACK LIMITS WARNING FOR HAMILTON',                  flag: 'BLACK AND WHITE' },
    { date: '2024-03-02T15:58:00.000Z', lap_number: 36, category: 'CarEvent',      message: 'CAR 16 UNDER INVESTIGATION FOR SPEEDING IN PIT LANE', flag: null },
    { date: '2024-03-02T16:00:00.000Z', lap_number: 37, category: 'CarEvent',      message: '5 SECOND TIME PENALTY FOR CAR 16',                  flag: null },
  ],
};

// ─────────────────────────────────────────────────────────────
// Pit Stops (keyed by "sessionKey_driverNumber")
// ─────────────────────────────────────────────────────────────

export const MOCK_PIT_STOPS: Record<string, PitStop[]> = {
  '9161_1': [
    { date: '2024-03-02T15:28:30.000Z', lap_number: 17, stop_duration: 2.4, lane_duration: 22.1, driver_number: 1,  session_key: 9161 },
    { date: '2024-03-02T15:59:55.000Z', lap_number: 37, stop_duration: 2.2, lane_duration: 21.8, driver_number: 1,  session_key: 9161 },
  ],
  '9161_44': [
    { date: '2024-03-02T15:25:20.000Z', lap_number: 15, stop_duration: 2.8, lane_duration: 23.4, driver_number: 44, session_key: 9161 },
    { date: '2024-03-02T15:54:10.000Z', lap_number: 34, stop_duration: 2.5, lane_duration: 22.5, driver_number: 44, session_key: 9161 },
  ],
  '9161_16': [
    { date: '2024-03-02T15:23:45.000Z', lap_number: 14, stop_duration: 3.1, lane_duration: 23.8, driver_number: 16, session_key: 9161 },
    { date: '2024-03-02T15:56:05.000Z', lap_number: 35, stop_duration: 2.7, lane_duration: 22.7, driver_number: 16, session_key: 9161 },
  ],
};

// ─────────────────────────────────────────────────────────────
// Lap Data Generator (runtime — deterministic based on driver)
// ─────────────────────────────────────────────────────────────

interface DriverLapProfile {
  baseTime: number;
  degradation: number;       // seconds per lap
  pit1Lap: number;
  pit2Lap: number;
  postPit1Boost: number;     // reduction to baseTime after pit 1
  postPit2Boost: number;
}

const LAP_PROFILES: Record<number, DriverLapProfile> = {
  1:  { baseTime: 96.5, degradation: 0.08,  pit1Lap: 17, pit2Lap: 37, postPit1Boost: 1.5, postPit2Boost: 1.5 },
  44: { baseTime: 97.2, degradation: 0.07,  pit1Lap: 15, pit2Lap: 34, postPit1Boost: 1.4, postPit2Boost: 1.6 },
  16: { baseTime: 97.4, degradation: 0.07,  pit1Lap: 14, pit2Lap: 35, postPit1Boost: 1.4, postPit2Boost: 1.5 },
  4:  { baseTime: 97.3, degradation: 0.072, pit1Lap: 16, pit2Lap: 36, postPit1Boost: 1.3, postPit2Boost: 1.4 },
};

/**
 * Generates deterministic-style mock lap data for a driver in a session.
 * Automatically synchronizes with circuit benchmarks (lap times, sector ratios, total laps, pit laps).
 */
export function generateMockLaps(
  driverNumber: number,
  sessionKey: number = 9161,
  benchmark?: CircuitBenchmark
): Lap[] {
  const profile = LAP_PROFILES[driverNumber] ?? {
    baseTime: 98.0,
    degradation: 0.07,
    pit1Lap: 17,
    pit2Lap: 37,
    postPit1Boost: 1.2,
    postPit2Boost: 1.2,
  };

  const catalogSession = F1_CATALOG_ALL_SESSIONS.find((s) => s.session_key === sessionKey);
  const activeBenchmark = benchmark ?? resolveCircuitForSession(catalogSession);

  const totalLaps = activeBenchmark ? activeBenchmark.totalLaps : 57;
  const baseTimestamp = new Date(catalogSession?.date_start ?? '2024-03-02T15:03:00.000Z').getTime();
  let timeAccumulator = baseTimestamp;

  // Driver skill offset relative to benchmark (e.g. Verstappen is slightly faster, rookie slightly slower)
  const driverOffset = (driverNumber === 1 ? -0.4 : driverNumber === 4 ? -0.3 : driverNumber === 16 ? -0.25 : driverNumber === 44 ? -0.2 : (driverNumber % 5) * 0.15);
  const baseBenchmarkTime = activeBenchmark ? activeBenchmark.baseLapTimeSec : profile.baseTime;
  let baseTime = baseBenchmarkTime + driverOffset;
  const degradation = profile.degradation * (baseBenchmarkTime / 98.0);
  const pit1Lap = activeBenchmark ? activeBenchmark.pit1Lap : profile.pit1Lap;
  const pit2Lap = activeBenchmark ? activeBenchmark.pit2Lap : profile.pit2Lap;
  const topSpeed = activeBenchmark ? activeBenchmark.topSpeedKmh : 330;

  const laps: Lap[] = [];
  const seed = (n: number) => Math.sin(n * 9301 + driverNumber * 49297 + sessionKey * 31) * 0.5;

  for (let i = 1; i <= totalLaps; i++) {
    let lapTime = baseTime - i * degradation;
    const variance = seed(i) * 0.5;
    lapTime += variance;

    // Pit stop laps: inflate lap time
    if (i === pit1Lap) {
      lapTime = baseTime + 5.0;
    } else if (i === pit1Lap + 1) {
      lapTime = baseTime + 22.0;
      baseTime -= profile.postPit1Boost;
    } else if (i === pit2Lap) {
      lapTime = baseTime + 4.5;
    } else if (i === pit2Lap + 1) {
      lapTime = baseTime + 21.5;
      baseTime -= profile.postPit2Boost;
    }

    const baseSpeedST = topSpeed + (driverNumber === 1 ? 2.5 : driverNumber === 16 ? 1.0 : -1.0);
    const baseSpeedI1 = topSpeed * 0.90;
    const baseSpeedI2 = topSpeed * 0.78;
    const baseSpeedFL = topSpeed * 0.89;
    const fuelSpeedBonus = i * 0.12;

    const s1Base = baseTime * 0.31;
    const s2Base = baseTime * 0.42;
    const s3Base = baseTime * 0.27;

    laps.push({
      lap_number: i,
      lap_duration: Number(lapTime.toFixed(3)),
      date_start: new Date(timeAccumulator).toISOString(),
      duration_sector_1: Number((s1Base - i * 0.015 + seed(i + 100) * 0.25).toFixed(3)),
      duration_sector_2: Number((s2Base - i * 0.025 + seed(i + 200) * 0.35).toFixed(3)),
      duration_sector_3: Number((s3Base - i * 0.015 + seed(i + 300) * 0.20).toFixed(3)),
      speed_i1: Number((baseSpeedI1 + fuelSpeedBonus + seed(i + 400) * 3.0).toFixed(1)),
      speed_i2: Number((baseSpeedI2 + fuelSpeedBonus * 0.6 + seed(i + 500) * 3.5).toFixed(1)),
      speed_fl: Number((baseSpeedFL + fuelSpeedBonus + seed(i + 600) * 2.5).toFixed(1)),
      speed_st: Number((baseSpeedST + fuelSpeedBonus + seed(i + 700) * 3.0).toFixed(1)),
      driver_number: driverNumber,
      session_key: sessionKey,
    });

    timeAccumulator += lapTime * 1000;
  }

  return laps;
}

// Pre-generate lap data for the primary Bahrain Race session
export const MOCK_LAPS: Record<string, Lap[]> = {
  '9161_1':  generateMockLaps(1),
  '9161_44': generateMockLaps(44),
  '9161_16': generateMockLaps(16),
  '9161_4':  generateMockLaps(4),
};
