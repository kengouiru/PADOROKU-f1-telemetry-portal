/**
 * lib/openf1Api.ts
 * F1 Telemetry Analyzer - Typed OpenF1 API Client
 *
 * Typed fetch wrappers for all OpenF1 v1 endpoints used in the app.
 * In Phase 2, these calls will be proxied through Next.js API Routes
 * (app/api/) to hide rate limiting and enable server-side caching.
 */

import type {
  Session,
  Driver,
  Lap,
  Stint,
  TeamRadio,
  PitStop,
  RaceControlMessage,
} from './types';

const DEFAULT_TIMEOUT_MS = 3500;

// ─────────────────────────────────────────────────────────────
// Fetch Helper
// ─────────────────────────────────────────────────────────────

/** Helper to format target URL through /api/openf1 BFF proxy */
function toProxyUrl(endpoint: string, queryParams: string): string {
  if (typeof window !== 'undefined') {
    // In browser: use relative proxy endpoint
    return `/api/openf1?endpoint=${endpoint}${queryParams ? `&${queryParams}` : ''}`;
  }
  // Server-side: direct OpenF1
  return `https://api.openf1.org/v1/${endpoint}${queryParams ? `?${queryParams}` : ''}`;
}

/** Fetch with AbortController timeout. Throws on non-OK or timeout. */
async function fetchWithTimeout<T>(
  url: string,
  timeoutMs = DEFAULT_TIMEOUT_MS
): Promise<T> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(id);

    if (response.status === 429) {
      throw new OpenF1Error('RATE_LIMIT', 429, url);
    }
    if (response.status === 401) {
      throw new OpenF1Error('UNAUTHORIZED', 401, url);
    }
    if (response.status === 404) {
      return [] as unknown as T; // Treat 404 as empty dataset
    }
    if (!response.ok) {
      throw new OpenF1Error(`HTTP_${response.status}`, response.status, url);
    }

    return response.json() as Promise<T>;
  } catch (err) {
    clearTimeout(id);
    if ((err as Error).name === 'AbortError') {
      throw new OpenF1Error('TIMEOUT', 0, url);
    }
    throw err;
  }
}

/** Typed error class for OpenF1 API failures */
export class OpenF1Error extends Error {
  constructor(
    public code: 'RATE_LIMIT' | 'UNAUTHORIZED' | 'TIMEOUT' | `HTTP_${number}`,
    public status: number,
    public url: string
  ) {
    super(`OpenF1 API error [${code}] at ${url}`);
    this.name = 'OpenF1Error';
  }
}

// ─────────────────────────────────────────────────────────────
// Session & Meeting Queries
// ─────────────────────────────────────────────────────────────

/** Fetch all sessions for a given calendar year */
export async function fetchSessions(year: number): Promise<Session[]> {
  return fetchWithTimeout<Session[]>(toProxyUrl('sessions', `year=${year}`));
}

/** Fetch a single session by its key */
export async function fetchSession(sessionKey: number): Promise<Session[]> {
  return fetchWithTimeout<Session[]>(toProxyUrl('sessions', `session_key=${sessionKey}`));
}

// ─────────────────────────────────────────────────────────────
// Driver Queries
// ─────────────────────────────────────────────────────────────

/** Fetch all drivers for a specific session */
export async function fetchDrivers(sessionKey: number): Promise<Driver[]> {
  return fetchWithTimeout<Driver[]>(toProxyUrl('drivers', `session_key=${sessionKey}`));
}

// ─────────────────────────────────────────────────────────────
// Telemetry Queries
// ─────────────────────────────────────────────────────────────

/** Fetch lap records for a driver in a session */
export async function fetchLaps(
  sessionKey: number,
  driverNumber: number
): Promise<Lap[]> {
  return fetchWithTimeout<Lap[]>(
    toProxyUrl('laps', `session_key=${sessionKey}&driver_number=${driverNumber}`)
  );
}

/** Fetch stint records for a session (all drivers) */
export async function fetchStints(sessionKey: number): Promise<Stint[]> {
  return fetchWithTimeout<Stint[]>(toProxyUrl('stints', `session_key=${sessionKey}`));
}

/** Fetch team radio recordings for a driver in a session */
export async function fetchTeamRadio(
  sessionKey: number,
  driverNumber: number
): Promise<TeamRadio[]> {
  return fetchWithTimeout<TeamRadio[]>(
    toProxyUrl('team_radio', `session_key=${sessionKey}&driver_number=${driverNumber}`)
  );
}

/** Fetch pit stop records for a driver in a session */
export async function fetchPitStops(
  sessionKey: number,
  driverNumber: number
): Promise<PitStop[]> {
  return fetchWithTimeout<PitStop[]>(
    toProxyUrl('pit', `session_key=${sessionKey}&driver_number=${driverNumber}`)
  );
}

/** Fetch all race control messages for a session */
export async function fetchRaceControl(
  sessionKey: number
): Promise<RaceControlMessage[]> {
  return fetchWithTimeout<RaceControlMessage[]>(
    toProxyUrl('race_control', `session_key=${sessionKey}`)
  );
}

// ─────────────────────────────────────────────────────────────
// Convenience: Sequential load (avoids 429 rate limiting)
// ─────────────────────────────────────────────────────────────

/** Inserts a delay between sequential API calls */
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Loads all session-level data sequentially with a delay between
 * each request to avoid triggering OpenF1 rate limits.
 *
 * Returns raw data arrays; enrichment is performed by telemetryUtils.
 */
export async function loadSessionData(sessionKey: number): Promise<{
  drivers: Driver[];
  stints: Stint[];
  raceControl: RaceControlMessage[];
}> {
  const drivers = await fetchDrivers(sessionKey);
  await delay(150);

  const stints = await fetchStints(sessionKey);
  await delay(150);

  const raceControl = await fetchRaceControl(sessionKey);

  return { drivers, stints, raceControl };
}

/**
 * Loads all driver-specific data sequentially.
 */
export async function loadDriverData(
  sessionKey: number,
  driverNumber: number
): Promise<{
  laps: Lap[];
  teamRadio: TeamRadio[];
  pitStops: PitStop[];
}> {
  const laps = await fetchLaps(sessionKey, driverNumber);
  await delay(150);

  const teamRadio = await fetchTeamRadio(sessionKey, driverNumber);
  await delay(150);

  const pitStops = await fetchPitStops(sessionKey, driverNumber);

  return { laps, teamRadio, pitStops };
}

export interface RawCarData {
  brake: number;
  date: string;
  driver_number: number;
  meeting_key: number;
  n_gear: number;
  rpm: number;
  session_key: number;
  speed: number;
  throttle: number;
  drs?: number;
}

/**
 * Fetch raw car data (speed, throttle, brake, gear, rpm) from OpenF1 /car_data
 */
export async function fetchCarData(
  sessionKey: number,
  driverNumber: number,
  dateStart?: string,
  dateEnd?: string
): Promise<RawCarData[]> {
  let q = `session_key=${sessionKey}&driver_number=${driverNumber}`;
  if (dateStart) q += `&date>=${encodeURIComponent(dateStart)}`;
  if (dateEnd) q += `&date<=${encodeURIComponent(dateEnd)}`;
  return fetchWithTimeout<RawCarData[]>(toProxyUrl('car_data', q), 5000);
}
