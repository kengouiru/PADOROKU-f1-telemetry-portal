import { describe, it, expect } from 'vitest';
import { parseRaceSummary } from './jolpicaRaceSummary';

const drv = (code: string, given: string, family: string) => ({ code, givenName: given, familyName: family });
const results = {
  MRData: { RaceTable: { Races: [{
    raceName: 'Bahrain Grand Prix in Malaysia',
    Results: [
      { position: '1', status: 'Finished', Driver: drv('VER', 'Max', 'Verstappen'), Constructor: { constructorId: 'red_bull', name: 'Red Bull' }, Time: { time: '1:47:14.808' }, FastestLap: { rank: '1', lap: '55', Time: { time: '1:38.220' } } },
      { position: '2', status: 'Finished', Driver: drv('ANT', 'Andrea Kimi', 'Antonelli'), Constructor: { constructorId: 'mercedes', name: 'Mercedes' }, Time: { time: '+2.307' }, FastestLap: { rank: '2', lap: '50', Time: { time: '1:38.589' } } },
      { position: '3', status: 'Finished', Driver: drv('HAM', 'Lewis', 'Hamilton'), Constructor: { constructorId: 'ferrari', name: 'Ferrari' }, Time: { time: '+4.919' } },
      { position: '4', status: 'Lapped', Driver: drv('NOR', 'Lando', 'Norris'), Constructor: { constructorId: 'mclaren', name: 'McLaren' } },
    ],
  }] } },
};
const quali = { MRData: { RaceTable: { Races: [{ QualifyingResults: [
  { position: '1', Driver: drv('VER', 'Max', 'Verstappen'), Q1: '1:36.477', Q2: '1:35.696', Q3: '1:35.130' },
] }] } } };

describe('parseRaceSummary', () => {
  it('extracts podium, pole (Q3) and fastest lap (rank 1)', () => {
    const s = parseRaceSummary(results, quali, '2026', 16)!;
    expect(s.podium.map((p) => p.code)).toEqual(['VER', 'ANT', 'HAM']);
    expect(s.podium[1].note).toBe('+2.307');
    expect(s.pole).toEqual({ code: 'VER', time: '1:35.130' });
    expect(s.fastestLap).toEqual({ code: 'VER', time: '1:38.220', lap: 55 });
  });
  it('returns null when no results (race not run yet)', () => {
    expect(parseRaceSummary({ MRData: { RaceTable: { Races: [] } } }, null, '2026', 17)).toBeNull();
  });
  it('pole is null when qualifying is unavailable', () => {
    expect(parseRaceSummary(results, null, '2026', 16)!.pole).toBeNull();
  });
});
