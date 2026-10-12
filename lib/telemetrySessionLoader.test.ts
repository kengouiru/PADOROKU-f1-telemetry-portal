import { describe, it, expect } from 'vitest';
import { pickDefaultDrivers, completedRaces } from './telemetrySessionLoader';
import type { Driver, Session } from './types';

const drv = (n: number, code: string, team: string): Driver => ({
  driver_number: n, name_acronym: code, first_name: '', last_name: '', full_name: code,
  team_name: team, team_colour: '000000',
});

const drivers = [
  drv(1, 'NOR', 'McLaren'), drv(81, 'PIA', 'McLaren'),
  drv(16, 'LEC', 'Ferrari'), drv(44, 'HAM', 'Ferrari'),
  drv(3, 'VER', 'Red Bull Racing'), drv(6, 'HAD', 'Red Bull Racing'),
  drv(30, 'LAW', 'Racing Bulls'), drv(41, 'LIN', 'Racing Bulls'),
];
const results = [
  { session_key: 1, driver_number: 23, position: null, dnf: true },
  { session_key: 1, driver_number: 16, position: 2 },
  { session_key: 1, driver_number: 3, position: 1 },
  { session_key: 1, driver_number: 1, position: 3 },
];

describe('pickDefaultDrivers', () => {
  it('uses winner and P2 when no preference, ignoring null positions', () => {
    expect(pickDefaultDrivers(drivers, results, null)).toEqual(['3', '16']);
  });

  it('uses favourite driver + favourite team drivers', () => {
    expect(pickDefaultDrivers(drivers, results, { favoriteDriverCode: 'HAM', favoriteTeamId: 'mclaren' }))
      .toEqual(['44', '1', '81']);
  });

  it('does not duplicate when favourite driver is in favourite team', () => {
    expect(pickDefaultDrivers(drivers, results, { favoriteDriverCode: 'LEC', favoriteTeamId: 'ferrari' }))
      .toEqual(['16', '44']);
  });

  it('distinguishes Red Bull Racing from Racing Bulls', () => {
    expect(pickDefaultDrivers(drivers, results, { favoriteTeamId: 'red-bull' })).toEqual(['3', '6']);
    expect(pickDefaultDrivers(drivers, results, { favoriteTeamId: 'rb' })).toEqual(['30', '41']);
  });

  it('falls back to winner/P2 when preference matches nobody in the session', () => {
    expect(pickDefaultDrivers(drivers, results, { favoriteDriverCode: 'XXX', favoriteTeamId: 'nonexistent' }))
      .toEqual(['3', '16']);
  });
});

describe('completedRaces', () => {
  const s = (key: number, start: string, extra: Partial<Session> = {}): Session => ({
    session_key: key, session_name: 'Race', session_type: 'Race', meeting_key: key,
    date_start: start, date_end: start, year: 2026, ...extra,
  });
  it('excludes cancelled and future races, newest first', () => {
    const now = new Date('2026-10-05T00:00:00Z');
    const list = completedRaces([
      s(1, '2026-04-12T15:00:00Z', { is_cancelled: true }),
      s(2, '2026-09-26T11:00:00Z'),
      s(3, '2026-10-11T12:00:00Z'),
      s(4, '2026-10-04T07:00:00Z'),
      s(5, '2026-10-03T07:00:00Z', { session_name: 'Qualifying', session_type: 'Qualifying' }),
    ], now);
    expect(list.map(x => x.session_key)).toEqual([4, 2]);
  });
});
