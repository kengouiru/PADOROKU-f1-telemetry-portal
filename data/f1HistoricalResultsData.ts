/**
 * data/f1HistoricalResultsData.ts
 * Formula 1 Complete Historical Classifications (2018 - 2025).
 *
 * WHY: Originally a 92,468-line (2.42 MB) TypeScript literal object that bloated the initial
 * client bundle and slowed down `tsc --noEmit`. Now modularized into per-year JSON chunks
 * (`data/chunks/historical/results-YYYY.json`) loaded on demand via dynamic import (GEMINI.md 3,000-line rule).
 */

export interface HistoricalDriverSessionRecord {
  pos: number;
  no: number;
  code: string;
  name: string;
  team: string;
  color: string;
  time: string;
  gap: string;
  laps?: number;
  pts?: number;
  status?: 'FINISHED' | 'RETIRED' | 'DNS' | 'DSQ';
  isFL?: boolean;
  q1?: string;
  q2?: string;
  q3?: string;
}

export interface HistoricalGrandPrixResults {
  round: number;
  raceName: string;
  circuitName: string;
  city: string;
  country: string;
  date: string;
  race: {
    fastestLap: { code: string; name: string; time: string; lap: number } | null;
    results: HistoricalDriverSessionRecord[];
  };
  qualifying: {
    pole: { code: string; name: string; time: string } | null;
    results: HistoricalDriverSessionRecord[];
  };
}

const HISTORICAL_CACHE: Record<number, Record<number, HistoricalGrandPrixResults>> = {};
const IN_FLIGHT_LOADS: Partial<Record<number, Promise<Record<number, HistoricalGrandPrixResults> | null>>> = {};

/**
 * Dynamically loads a single historical season's full classification JSON chunk on demand.
 */
export async function preloadHistoricalSeasonResults(
  year: number | string
): Promise<Record<number, HistoricalGrandPrixResults> | null> {
  const y = typeof year === 'string' ? parseInt(year, 10) : year;
  if (isNaN(y) || y < 2018 || y > 2025) return null;
  if (HISTORICAL_CACHE[y]) return HISTORICAL_CACHE[y];
  if (IN_FLIGHT_LOADS[y]) return IN_FLIGHT_LOADS[y]!;

  const loadPromise = (async () => {
    try {
      let mod: unknown;
      switch (y) {
        case 2018:
          mod = await import('./chunks/historical/results-2018.json');
          break;
        case 2019:
          mod = await import('./chunks/historical/results-2019.json');
          break;
        case 2020:
          mod = await import('./chunks/historical/results-2020.json');
          break;
        case 2021:
          mod = await import('./chunks/historical/results-2021.json');
          break;
        case 2022:
          mod = await import('./chunks/historical/results-2022.json');
          break;
        case 2023:
          mod = await import('./chunks/historical/results-2023.json');
          break;
        case 2024:
          mod = await import('./chunks/historical/results-2024.json');
          break;
        case 2025:
          mod = await import('./chunks/historical/results-2025.json');
          break;
        default:
          return null;
      }
      const modObj = mod as { default?: Record<string, HistoricalGrandPrixResults> };
      const rawData = (modObj.default || mod) as Record<string, HistoricalGrandPrixResults>;
      const normalized: Record<number, HistoricalGrandPrixResults> = {};
      for (const [k, v] of Object.entries(rawData)) {
        normalized[Number(k)] = v;
      }
      HISTORICAL_CACHE[y] = normalized;
      return normalized;
    } catch (err) {
      console.warn(`Failed to load historical results chunk for ${y}:`, err);
      return null;
    } finally {
      delete IN_FLIGHT_LOADS[y];
    }
  })();

  IN_FLIGHT_LOADS[y] = loadPromise;
  return loadPromise;
}

/**
 * Synchronous lookup from the in-memory historical results cache.
 * If the year chunk is not yet cached, triggers background preload automatically.
 */
export function getHistoricalRaceResults(
  year: number | string,
  round: number
): HistoricalGrandPrixResults | null {
  const y = typeof year === 'string' ? parseInt(year, 10) : year;
  if (isNaN(y) || y < 2018 || y > 2025) return null;
  if (!HISTORICAL_CACHE[y]) {
    void preloadHistoricalSeasonResults(y);
    return null;
  }
  return HISTORICAL_CACHE[y][round] || null;
}
