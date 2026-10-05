/**
 * Jolpica (Ergast-compatible) race summary fetcher.
 *
 * Used when a race has finished but the static data in sessionResultsService
 * has not been updated yet. Source: https://api.jolpi.ca/ergast/f1/ (CORS enabled).
 * Returns null on any failure — callers must show an empty state, never a guess
 * (GEMINI.md 第2部第4条).
 */

const JOLPICA_BASE = 'https://api.jolpi.ca/ergast/f1';

export interface RaceSummaryEntry {
  position: number;
  code: string;
  name: string;
  team: string;
  constructorId: string;
  /** Winner: total race time. Others: gap ("+2.307") or status ("+1 Lap", "DNF"). */
  note: string;
}

export interface RaceSummary {
  season: string;
  round: number;
  raceName: string;
  podium: RaceSummaryEntry[];
  pole: { code: string; time: string } | null;
  fastestLap: { code: string; time: string; lap: number } | null;
  source: string;
}

/** Official team livery colours (approximate hex used across F1 media). Neutral fallback. */
const CONSTRUCTOR_COLOURS: Record<string, string> = {
  red_bull: '#3671C6',
  mercedes: '#27F4D2',
  ferrari: '#E8002D',
  mclaren: '#FF8000',
  aston_martin: '#229971',
  alpine: '#0093CC',
  williams: '#64C4FF',
  rb: '#6692FF',
  haas: '#B6BABD',
  sauber: '#52E252',
  audi: '#52E252',
  cadillac: '#C0C0C0',
};

export function constructorColour(constructorId: string): string {
  return CONSTRUCTOR_COLOURS[constructorId] ?? '#94a3b8';
}

interface ErgastDriver { code?: string; givenName: string; familyName: string }
interface ErgastConstructor { constructorId: string; name: string }
interface ErgastResult {
  position: string;
  status: string;
  Driver: ErgastDriver;
  Constructor: ErgastConstructor;
  Time?: { time: string };
  FastestLap?: { rank?: string; lap: string; Time?: { time: string } };
}
interface ErgastQuali { position: string; Driver: ErgastDriver; Q1?: string; Q2?: string; Q3?: string }

async function getJson(url: string, signal?: AbortSignal): Promise<unknown | null> {
  try {
    const res = await fetch(url, { signal });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

function driverCode(d: ErgastDriver): string {
  return d.code ?? d.familyName.slice(0, 3).toUpperCase();
}

/** Pure parser (exported for tests). */
export function parseRaceSummary(resultsJson: unknown, qualiJson: unknown, season: string, round: number): RaceSummary | null {
  const races = (resultsJson as { MRData?: { RaceTable?: { Races?: Array<{ raceName: string; Results?: ErgastResult[] }> } } })
    ?.MRData?.RaceTable?.Races;
  const race = races?.[0];
  if (!race?.Results?.length) return null;

  const results = race.Results;
  const podium: RaceSummaryEntry[] = results.slice(0, 3).map((r) => ({
    position: Number(r.position),
    code: driverCode(r.Driver),
    name: `${r.Driver.givenName} ${r.Driver.familyName}`,
    team: r.Constructor.name,
    constructorId: r.Constructor.constructorId,
    note: r.Time?.time ?? r.status,
  }));

  const flRow = results.find((r) => r.FastestLap?.rank === '1' && r.FastestLap.Time?.time);
  const fastestLap = flRow?.FastestLap?.Time
    ? { code: driverCode(flRow.Driver), time: flRow.FastestLap.Time.time, lap: Number(flRow.FastestLap.lap) }
    : null;

  const q = (qualiJson as { MRData?: { RaceTable?: { Races?: Array<{ QualifyingResults?: ErgastQuali[] }> } } })
    ?.MRData?.RaceTable?.Races?.[0]?.QualifyingResults?.find((x) => x.position === '1');
  const poleTime = q ? (q.Q3 || q.Q2 || q.Q1) : undefined;
  const pole = q && poleTime ? { code: driverCode(q.Driver), time: poleTime } : null;

  return {
    season,
    round,
    raceName: race.raceName,
    podium,
    pole,
    fastestLap,
    source: 'Jolpica F1 API (Ergast互換)',
  };
}

export async function fetchRaceSummary(season: string, round: number, signal?: AbortSignal): Promise<RaceSummary | null> {
  const [results, quali] = await Promise.all([
    getJson(`${JOLPICA_BASE}/${season}/${round}/results.json`, signal),
    getJson(`${JOLPICA_BASE}/${season}/${round}/qualifying.json`, signal),
  ]);
  return parseRaceSummary(results, quali, season, round);
}
