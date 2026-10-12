/**
 * lib/telemetrySessionLoader.ts
 *
 * Loads REAL session data from OpenF1 for the TELEMETRY tab.
 * There is deliberately no mock / synthetic fallback (GEMINI.md 第2部第4条):
 * if data cannot be fetched, callers must show an empty state with a retry action.
 */
import type { Session, Driver, Lap, Stint, TeamRadio, PitStop, RaceControlMessage, SafetyCarPeriod } from './types';
import {
  fetchSessions, fetchDrivers, fetchStints, fetchRaceControl,
  fetchLaps, fetchTeamRadio, fetchPitStops, fetchSessionResult,
  type SessionResultRow,
} from './openf1Api';
import { detectSafetyCarPeriods, enrichLapsWithStints } from './telemetryUtils';

export interface SessionBundle {
  session: Session;
  drivers: Driver[];
  stints: Stint[];
  raceControlMessages: RaceControlMessage[];
  selectedDrivers: string[];
  lapsCache: Record<string, Lap[]>;
  teamRadioCache: Record<string, TeamRadio[]>;
  pitStopsCache: Record<string, PitStop[]>;
  safetyCarPeriods: SafetyCarPeriod[];
}

export interface DriverPreference {
  favoriteDriverCode?: string;
  favoriteTeamId?: string;
}

const isRace = (s: Session) => s.session_name === 'Race' || s.session_type === 'Race';

/** Race sessions of a year that have finished and were not cancelled, newest first. */
export function completedRaces(sessions: Session[], now: Date = new Date()): Session[] {
  return sessions
    .filter(s => isRace(s) && !s.is_cancelled)
    .filter(s => new Date(s.date_end ?? s.date_start).getTime() < now.getTime())
    .sort((a, b) => new Date(b.date_start).getTime() - new Date(a.date_start).getTime());
}

/**
 * Finds the most recent race that already has an official classification.
 * Looks at the current year first, then the previous year (early season).
 */
export async function findLatestClassifiedRace(now: Date = new Date()): Promise<{
  year: number;
  sessions: Session[];
  race: Session;
  results: SessionResultRow[];
} | null> {
  for (const year of [now.getFullYear(), now.getFullYear() - 1]) {
    const sessions = await fetchSessions(year);
    const candidates = completedRaces(sessions, now).slice(0, 3);
    for (const race of candidates) {
      const results = await fetchSessionResult(race.session_key).catch(() => [] as SessionResultRow[]);
      if (results.some(r => r.position !== null)) {
        return { year, sessions, race, results };
      }
    }
  }
  return null;
}

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');

/** Maps the app's team ids (e.g. 'red-bull', 'redbull', 'rb') to an OpenF1 team_name test. */
function teamMatches(teamId: string, teamName: string): boolean {
  const id = norm(teamId);
  const name = norm(teamName);
  if (id === 'rb' || id === 'racingbulls' || id === 'vcarb') return name.includes('racingbulls') || name === 'rb' || name.includes('vcarb');
  if (id === 'redbull') return name.includes('redbull') && !name.includes('racingbulls');
  if (id === 'audi' || id === 'sauber' || id === 'kicksauber') return name.includes('audi') || name.includes('sauber');
  if (id === 'astonmartin') return name.includes('astonmartin');
  return name.includes(id);
}

/**
 * Default driver selection:
 *  - user has preferences → favourite driver + the two drivers of the favourite team (max 3)
 *  - otherwise → race winner and P2 from the official classification
 */
export function pickDefaultDrivers(
  drivers: Driver[],
  results: SessionResultRow[],
  pref: DriverPreference | null,
): string[] {
  const picked: string[] = [];
  const add = (n: number | undefined) => {
    if (n === undefined) return;
    const key = String(n);
    if (!picked.includes(key) && picked.length < 3) picked.push(key);
  };

  if (pref) {
    if (pref.favoriteDriverCode) {
      add(drivers.find(d => d.name_acronym?.toUpperCase() === pref.favoriteDriverCode!.toUpperCase())?.driver_number);
    }
    if (pref.favoriteTeamId) {
      drivers
        .filter(d => d.team_name && teamMatches(pref.favoriteTeamId!, d.team_name))
        .forEach(d => add(d.driver_number));
    }
  }

  if (picked.length === 0) {
    results
      .filter(r => r.position !== null)
      .sort((a, b) => (a.position as number) - (b.position as number))
      .slice(0, 2)
      .forEach(r => add(r.driver_number));
  }

  if (picked.length === 0) drivers.slice(0, 2).forEach(d => add(d.driver_number));
  return picked;
}

/** Loads laps / radio / pit stops for one driver. Missing data stays empty (never synthesised). */
export async function loadDriverTelemetry(sessionKey: number, driverNum: string, stints: Stint[]) {
  const n = parseInt(driverNum, 10);
  const [laps, radios, pits] = await Promise.all([
    fetchLaps(sessionKey, n).catch(() => [] as Lap[]),
    fetchTeamRadio(sessionKey, n).catch(() => [] as TeamRadio[]),
    fetchPitStops(sessionKey, n).catch(() => [] as PitStop[]),
  ]);
  return {
    laps: enrichLapsWithStints(laps, stints, driverNum),
    radios,
    pits,
  };
}

/**
 * Loads everything the TELEMETRY tab needs for one session.
 * Throws when the driver list cannot be obtained (caller shows empty state + retry).
 */
export async function loadSessionBundle(
  session: Session,
  chooseDrivers: (drivers: Driver[]) => string[],
): Promise<SessionBundle> {
  const sessionKey = session.session_key;
  const [drivers, stints, raceControlMessages] = await Promise.all([
    fetchDrivers(sessionKey),
    fetchStints(sessionKey).catch(() => [] as Stint[]),
    fetchRaceControl(sessionKey).catch(() => [] as RaceControlMessage[]),
  ]);
  if (!drivers.length) {
    throw new Error(`OpenF1 returned no drivers for session ${sessionKey}`);
  }

  const selectedDrivers = chooseDrivers(drivers);
  const lapsCache: Record<string, Lap[]> = {};
  const teamRadioCache: Record<string, TeamRadio[]> = {};
  const pitStopsCache: Record<string, PitStop[]> = {};

  const perDriver = await Promise.all(selectedDrivers.map(num => loadDriverTelemetry(sessionKey, num, stints)));
  selectedDrivers.forEach((num, i) => {
    lapsCache[num] = perDriver[i].laps;
    teamRadioCache[num] = perDriver[i].radios;
    pitStopsCache[num] = perDriver[i].pits;
  });

  const safetyCarPeriods = detectSafetyCarPeriods(raceControlMessages, Object.values(lapsCache).flat());

  return {
    session,
    drivers,
    stints,
    raceControlMessages,
    selectedDrivers,
    lapsCache,
    teamRadioCache,
    pitStopsCache,
    safetyCarPeriods,
  };
}
