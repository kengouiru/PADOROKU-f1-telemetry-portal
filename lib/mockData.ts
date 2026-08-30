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

// ─────────────────────────────────────────────────────────────
// Sessions
// ─────────────────────────────────────────────────────────────

export const MOCK_SESSIONS: Session[] = [
  {
    session_key: 9161,
    meeting_key: 1234,
    meeting_official_name: 'Bahrain Grand Prix (デモ用サンプル)',
    session_name: 'Race',
    session_type: 'Race',
    date_start: '2024-03-02T15:00:00+03:00',
    year: 2024,
  },
  {
    session_key: 9162,
    meeting_key: 1234,
    meeting_official_name: 'Bahrain Grand Prix (デモ用サンプル)',
    session_name: 'Qualifying',
    session_type: 'Qualifying',
    date_start: '2024-03-01T19:00:00+03:00',
    year: 2024,
  },
  {
    session_key: 9163,
    meeting_key: 5678,
    meeting_official_name: 'Japanese Grand Prix (デモ用サンプル)',
    session_name: 'Race',
    session_type: 'Race',
    date_start: '2024-04-07T14:00:00+09:00',
    year: 2024,
  },
];

// ─────────────────────────────────────────────────────────────
// Drivers (keyed by session_key)
// ─────────────────────────────────────────────────────────────

export const MOCK_DRIVERS: Record<number, Driver[]> = {
  9161: [
    { driver_number: 1,  name_acronym: 'VER', first_name: 'Max',      last_name: 'Verstappen', full_name: 'Max Verstappen',   team_name: 'Red Bull Racing', team_colour: '3671C2' },
    { driver_number: 11, name_acronym: 'PER', first_name: 'Sergio',   last_name: 'Perez',      full_name: 'Sergio Perez',     team_name: 'Red Bull Racing', team_colour: '3671C2' },
    { driver_number: 16, name_acronym: 'LEC', first_name: 'Charles',  last_name: 'Leclerc',    full_name: 'Charles Leclerc',  team_name: 'Ferrari',         team_colour: 'E80020' },
    { driver_number: 55, name_acronym: 'SAI', first_name: 'Carlos',   last_name: 'Sainz',      full_name: 'Carlos Sainz',     team_name: 'Ferrari',         team_colour: 'E80020' },
    { driver_number: 63, name_acronym: 'RUS', first_name: 'George',   last_name: 'Russell',    full_name: 'George Russell',   team_name: 'Mercedes',        team_colour: '00A19B' },
    { driver_number: 44, name_acronym: 'HAM', first_name: 'Lewis',    last_name: 'Hamilton',   full_name: 'Lewis Hamilton',   team_name: 'Mercedes',        team_colour: '00A19B' },
    { driver_number: 4,  name_acronym: 'NOR', first_name: 'Lando',    last_name: 'Norris',     full_name: 'Lando Norris',     team_name: 'McLaren',         team_colour: 'FF8000' },
    { driver_number: 81, name_acronym: 'PIA', first_name: 'Oscar',    last_name: 'Piastri',    full_name: 'Oscar Piastri',    team_name: 'McLaren',         team_colour: 'FF8000' },
    { driver_number: 14, name_acronym: 'ALO', first_name: 'Fernando', last_name: 'Alonso',     full_name: 'Fernando Alonso',  team_name: 'Aston Martin',    team_colour: '229971' },
    { driver_number: 18, name_acronym: 'STR', first_name: 'Lance',    last_name: 'Stroll',     full_name: 'Lance Stroll',     team_name: 'Aston Martin',    team_colour: '229971' },
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
    { driver_number: 1,  stint_number: 1, lap_start: 1,  lap_end: 17, compound: 'MEDIUM', tyre_age_at_start: 0 },
    { driver_number: 1,  stint_number: 2, lap_start: 18, lap_end: 37, compound: 'HARD',   tyre_age_at_start: 0 },
    { driver_number: 1,  stint_number: 3, lap_start: 38, lap_end: 57, compound: 'SOFT',   tyre_age_at_start: 0 },
    { driver_number: 44, stint_number: 1, lap_start: 1,  lap_end: 15, compound: 'SOFT',   tyre_age_at_start: 0 },
    { driver_number: 44, stint_number: 2, lap_start: 16, lap_end: 34, compound: 'HARD',   tyre_age_at_start: 0 },
    { driver_number: 44, stint_number: 3, lap_start: 35, lap_end: 57, compound: 'MEDIUM', tyre_age_at_start: 0 },
    { driver_number: 16, stint_number: 1, lap_start: 1,  lap_end: 14, compound: 'MEDIUM', tyre_age_at_start: 0 },
    { driver_number: 16, stint_number: 2, lap_start: 15, lap_end: 35, compound: 'HARD',   tyre_age_at_start: 0 },
    { driver_number: 16, stint_number: 3, lap_start: 36, lap_end: 57, compound: 'HARD',   tyre_age_at_start: 0 },
    { driver_number: 4,  stint_number: 1, lap_start: 1,  lap_end: 16, compound: 'MEDIUM', tyre_age_at_start: 0 },
    { driver_number: 4,  stint_number: 2, lap_start: 17, lap_end: 36, compound: 'HARD',   tyre_age_at_start: 0 },
    { driver_number: 4,  stint_number: 3, lap_start: 37, lap_end: 57, compound: 'HARD',   tyre_age_at_start: 0 },
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
    { date: '2024-03-02T15:03:45.000Z', recording_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',  driver_number: 1,  session_key: 9161, category: 'PACE',     transcript: 'Okay Max, clean start. Let\'s build the gap. Debris at turn 4, take care.', translation: 'マックス、クリーンなスタートだ。ギャップを広げよう。ターン4にデブリがあるから気をつけて。' },
    { date: '2024-03-02T15:09:50.000Z', recording_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',  driver_number: 1,  session_key: 9161, category: 'TYRE',     transcript: 'How are the tyres Max? - Yeah, tyres are good, pace is stable. No issues.', translation: '「マックス、タイヤの状態はどう？」-『タイヤは良好、ペースも安定している。問題ない。』' },
    { date: '2024-03-02T15:17:30.000Z', recording_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',  driver_number: 1,  session_key: 9161, category: 'STRATEGY', transcript: 'Okay Max, gap to Perez is 8.4 seconds. Keep managing the pace. Plan A.', translation: 'マックス、ペレスとの差は8.4秒だ。ペースマネジメントを続けてくれ。プランAで行く。' },
    { date: '2024-03-02T15:28:30.000Z', recording_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',  driver_number: 1,  session_key: 9161, category: 'PIT',      transcript: 'Box this lap Max, box this lap. Hards are ready.', translation: 'この周でピットインだマックス。ハードタイヤを準備している。' },
    { date: '2024-03-02T15:30:10.000Z', recording_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',  driver_number: 1,  session_key: 9161, category: 'PACE',     transcript: 'Pace post-pit is good. Next car is Bottas, 2 seconds ahead. Push now.', translation: 'ピットアウト後のペースは良好だ。前はボッタス、差は2秒。プッシュしろ。' },
    { date: '2024-03-02T15:59:55.000Z', recording_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',  driver_number: 1,  session_key: 9161, category: 'PIT',      transcript: 'Box box, box for Softs, push now.', translation: 'ピットインだ。ソフトタイヤを履く、今プッシュしろ。' },
    { date: '2024-03-02T16:29:00.000Z', recording_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',  driver_number: 1,  session_key: 9161, category: 'PACE',     transcript: 'Outstanding drive Max! One lap to go, keep it on track.', translation: '素晴らしい走りだマックス！残り1周、コース上に留めてくれ。' },
  ],
  '9161_44': [
    { date: '2024-03-02T15:03:45.000Z', recording_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3',  driver_number: 44, session_key: 9161, category: 'TYRE',     transcript: 'Struggling to warm up the Softs. Rear grip is low.', translation: 'ソフトタイヤを温めるのに苦労している。リヤのグリップが低い。' },
    { date: '2024-03-02T15:08:20.000Z', recording_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3', driver_number: 44, session_key: 9161, category: 'PACE',     transcript: 'Verstappen is pulling away. I have no pace. - Copy Lewis, checking engine parameters.', translation: '『フェルスタッペンが引き離していく。ペースが上がらない。』-「了解ルイス、エンジンデータを確認中だ。」' },
    { date: '2024-03-02T15:18:10.000Z', recording_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3', driver_number: 44, session_key: 9161, category: 'TYRE',     transcript: 'Tires are dropping off. Left front is graining.', translation: 'タイヤの性能が落ちてきた。左フロントにグレーニングが出ている。' },
    { date: '2024-03-02T15:25:20.000Z', recording_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3', driver_number: 44, session_key: 9161, category: 'PIT',      transcript: 'Box box, box box. Hards ready.', translation: 'ピットインだ。ハードタイヤを用意している。' },
    { date: '2024-03-02T15:38:00.000Z', recording_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3', driver_number: 44, session_key: 9161, category: 'STRATEGY', transcript: 'Pace looks matched to Leclerc. Let\'s consolidate.', translation: 'ペースはレクレールと同等だ。ポジションを固めよう。' },
    { date: '2024-03-02T16:27:00.000Z', recording_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3', driver_number: 44, session_key: 9161, category: 'PACE',     transcript: 'Excellent job Lewis, P2. That\'s a solid recovery.', translation: 'よくやったルイス、P2獲得だ。堅実なリカバリーだ。' },
  ],
  '9161_16': [
    { date: '2024-03-02T15:04:10.000Z', recording_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3', driver_number: 16, session_key: 9161, category: 'SAFETY', transcript: 'Yellow flag sector 2. Turn 8 clear now.', translation: 'セクター2でイエローフラッグ。ターン8は現在はクリア。' },
    { date: '2024-03-02T15:15:30.000Z', recording_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3', driver_number: 16, session_key: 9161, category: 'TYRE',   transcript: 'Struggling with front locking. Brake balance is forward.', translation: 'フロントのロックアップに苦労している。ブレーキバランスが前寄りだ。' },
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
 * Generates deterministic-style mock lap data for a driver in session 9161.
 * Uses a seeded variance simulation to avoid randomness across renders.
 */
export function generateMockLaps(
  driverNumber: number,
  sessionKey: number = 9161
): Lap[] {
  const profile = LAP_PROFILES[driverNumber] ?? {
    baseTime: 98.0,
    degradation: 0.07,
    pit1Lap: 17,
    pit2Lap: 37,
    postPit1Boost: 1.2,
    postPit2Boost: 1.2,
  };

  const totalLaps = 57;
  const baseTimestamp = new Date('2024-03-02T15:03:00.000Z').getTime();
  let timeAccumulator = baseTimestamp;
  let baseTime = profile.baseTime;
  const laps: Lap[] = [];

  // Seed-based pseudo-variance (deterministic for SSR consistency)
  const seed = (n: number) => Math.sin(n * 9301 + driverNumber * 49297) * 0.5;

  for (let i = 1; i <= totalLaps; i++) {
    let lapTime = baseTime - i * profile.degradation;
    const variance = seed(i) * 0.5;
    lapTime += variance;

    // Pit stop laps: inflate lap time
    if (i === profile.pit1Lap) {
      lapTime = profile.baseTime + 5.0;
    } else if (i === profile.pit1Lap + 1) {
      lapTime = profile.baseTime + 22.0;
      baseTime -= profile.postPit1Boost;
    } else if (i === profile.pit2Lap) {
      lapTime = profile.baseTime + 4.5;
    } else if (i === profile.pit2Lap + 1) {
      lapTime = profile.baseTime + 21.5;
      baseTime -= profile.postPit2Boost;
    }

    laps.push({
      lap_number: i,
      lap_duration: lapTime,
      date_start: new Date(timeAccumulator).toISOString(),
      duration_sector_1: 30.2 - i * 0.02 + seed(i + 100) * 0.3,
      duration_sector_2: 41.5 - i * 0.04 + seed(i + 200) * 0.5,
      duration_sector_3: 24.8 - i * 0.02 + seed(i + 300) * 0.2,
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
