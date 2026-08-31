/**
 * lib/telemetryUtils.ts
 * F1 Telemetry Analyzer - Pure Utility Functions
 *
 * Extracted from the legacy app.js. All functions here are pure
 * (no side effects, no DOM access) and fully typed, enabling
 * unit testing and reuse across components.
 */

import type {
  Lap,
  Stint,
  TeamRadio,
  RaceControlMessage,
  SafetyCarPeriod,
  TyreCompound,
  ChartDataPoint,
  Driver,
  DriverSectorSummary,
  SectorHighlight,
} from './types';

// ─────────────────────────────────────────────────────────────
// Color Constants
// ─────────────────────────────────────────────────────────────

export const TYRE_COLORS: Record<TyreCompound, string> = {
  SOFT: '#ff2e93',
  MEDIUM: '#ffd300',
  HARD: '#f0f0f0',
  INTERMEDIATE: '#39b54a',
  WET: '#00aeef',
  UNKNOWN: '#7a7a7a',
};

// ─────────────────────────────────────────────────────────────
// Color Helpers
// ─────────────────────────────────────────────────────────────

/**
 * Normalises a raw hex colour string (with or without '#') into
 * a CSS-safe `#rrggbb` string. Falls back to steel-blue default.
 */
export function formatColor(hex: string | null | undefined): string {
  if (!hex) return '#38bdf8'; // Default steel blue
  return hex.startsWith('#') ? hex : `#${hex}`;
}

/**
 * Returns the canonical tyre colour for a given compound label.
 */
export function getTyreColor(compound: string | null | undefined): string {
  if (!compound) return TYRE_COLORS.UNKNOWN;
  const key = compound.toUpperCase();
  if (key.includes('SOFT')) return TYRE_COLORS.SOFT;
  if (key.includes('MEDIUM')) return TYRE_COLORS.MEDIUM;
  if (key.includes('HARD')) return TYRE_COLORS.HARD;
  if (key.includes('INTER')) return TYRE_COLORS.INTERMEDIATE;
  if (key.includes('WET')) return TYRE_COLORS.WET;
  return TYRE_COLORS.UNKNOWN;
}

// ─────────────────────────────────────────────────────────────
// Lap Time Formatters
// ─────────────────────────────────────────────────────────────

/**
 * Formats a raw lap time in seconds to a human-readable `M:SS.mmm` string.
 * Returns `'N/A'` for invalid / missing values.
 */
export function formatLapTime(seconds: number | null | undefined): string {
  if (seconds === null || seconds === undefined || isNaN(seconds)) return 'N/A';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  const ms = Math.round((seconds - Math.floor(seconds)) * 1000);
  return `${mins}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(3, '0')}`;
}

/**
 * Formats a sector time in seconds to `SS.mmm` string.
 */
export function formatSectorTime(seconds: number | null | undefined): string {
  if (seconds === null || seconds === undefined || isNaN(seconds)) return 'N/A';
  return seconds.toFixed(3);
}

// ─────────────────────────────────────────────────────────────
// Core Telemetry Computations
// ─────────────────────────────────────────────────────────────

/**
 * Enriches raw lap records with tyre compound, age, and stint info
 * by joining against the session's stint data for a specific driver.
 *
 * Port of `enrichLapsWithStints()` from app.js.
 */
export function enrichLapsWithStints(
  laps: Lap[],
  stints: Stint[],
  driverNumber: number | string
): Lap[] {
  const driverNum = typeof driverNumber === 'string' ? parseInt(driverNumber, 10) : driverNumber;
  const driverStints = stints
    .filter((s) => s.driver_number === driverNum)
    .sort((a, b) => a.stint_number - b.stint_number);

  return laps.map((lap) => {
    const stint = driverStints.find(
      (s) =>
        lap.lap_number >= s.lap_start &&
        (s.lap_end === null || lap.lap_number <= s.lap_end)
    );

    if (!stint) {
      return { ...lap, compound: 'UNKNOWN' as TyreCompound, tyreAge: 0, stintNumber: '-' };
    }

    const compound = (stint.compound?.toUpperCase() ?? 'UNKNOWN') as TyreCompound;
    const tyreAge = stint.tyre_age_at_start + (lap.lap_number - stint.lap_start);

    return {
      ...lap,
      compound,
      tyreAge,
      stintNumber: stint.stint_number,
    };
  });
}

/**
 * Maps team radio recordings to specific lap numbers by comparing
 * radio timestamps against lap start timestamps.
 *
 * Port of `mapRadioRecordingsToLaps()` from app.js.
 */
export function mapRadioRecordingsToLaps(
  radios: TeamRadio[],
  laps: Lap[]
): TeamRadio[] {
  if (!laps.length || !radios.length) return [];

  const sortedLaps = [...laps].sort((a, b) => a.lap_number - b.lap_number);

  return radios
    .map((radio) => {
      if (!radio.date) return { ...radio, lap_number: null };

      const radioTime = new Date(radio.date).getTime();
      let matchedLapNumber: number | null = null;

      for (let i = 0; i < sortedLaps.length; i++) {
        const currentLap = sortedLaps[i];
        if (!currentLap.date_start) continue;

        const currentLapStart = new Date(currentLap.date_start).getTime();
        let currentLapEnd: number;

        if (i < sortedLaps.length - 1) {
          currentLapEnd = new Date(sortedLaps[i + 1].date_start).getTime();
        } else {
          const duration = ((currentLap.lap_duration ?? currentLap.lap_time ?? 95)) * 1000;
          currentLapEnd = currentLapStart + duration;
        }

        if (radioTime >= currentLapStart && radioTime < currentLapEnd) {
          matchedLapNumber = currentLap.lap_number;
          break;
        }
      }

      // Fallback: before first lap → lap 1; after last lap → last lap
      if (matchedLapNumber === null) {
        const firstLapStart = new Date(sortedLaps[0].date_start).getTime();
        matchedLapNumber =
          radioTime < firstLapStart
            ? 1
            : sortedLaps[sortedLaps.length - 1].lap_number;
      }

      return { ...radio, lap_number: matchedLapNumber };
    })
    .sort((a, b) => (a.lap_number ?? 0) - (b.lap_number ?? 0));
}

/**
 * Analyses race control messages and returns a list of safety car,
 * virtual safety car, and red flag periods expressed as lap ranges.
 *
 * Port of the safety car period detection logic from app.js.
 */
export function detectSafetyCarPeriods(
  messages: RaceControlMessage[],
  laps: Lap[]
): SafetyCarPeriod[] {
  const periods: SafetyCarPeriod[] = [];
  const maxLap = laps.length > 0 ? Math.max(...laps.map((l) => l.lap_number)) : 0;

  // Find all session lap-start boundaries keyed by lap_number for timestamp matching
  const lapMap = new Map<number, number>(); // lap_number → ms timestamp
  laps.forEach((l) => {
    if (l.date_start) lapMap.set(l.lap_number, new Date(l.date_start).getTime());
  });

  const sorted = [...messages].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  let activePeriod: SafetyCarPeriod | null = null;

  for (const msg of sorted) {
    const text = msg.message.toUpperCase();
    const lapNum = msg.lap_number ?? 0;

    if (!activePeriod) {
      if (
        msg.category === 'SafetyCar' &&
        (text.includes('DEPLOYED') || text.includes('SAFETY CAR'))
      ) {
        activePeriod = { startLap: lapNum, endLap: null, type: 'SC' };
      } else if (text.includes('VIRTUAL SAFETY CAR') && text.includes('DEPLOYED')) {
        activePeriod = { startLap: lapNum, endLap: null, type: 'VSC' };
      } else if (msg.flag === 'RED') {
        activePeriod = { startLap: lapNum, endLap: null, type: 'RED' };
      }
    } else {
      // Ending conditions
      const isEnding =
        text.includes('IN THIS LAP') ||
        text.includes('WITHDRAWN') ||
        text.includes('RESUMED') ||
        msg.flag === 'GREEN';

      if (isEnding) {
        activePeriod.endLap = Math.min(lapNum + 1, maxLap);
        periods.push({ ...activePeriod });
        activePeriod = null;
      }
    }
  }

  // Close any unclosed period at the last lap
  if (activePeriod) {
    activePeriod.endLap = maxLap;
    periods.push(activePeriod);
  }

  return periods;
}

/**
 * Converts enriched lap records into Chart.js compatible scatter-line data points.
 */
export function lapsToChartData(laps: Lap[]): ChartDataPoint[] {
  return laps
    .map((lap) => ({
      x: lap.lap_number,
      y: (lap.lap_duration ?? lap.lap_time ?? 0),
      compound: (lap.compound ?? 'UNKNOWN') as TyreCompound,
      tyreAge: lap.tyreAge ?? 0,
      s1: lap.duration_sector_1,
      s2: lap.duration_sector_2,
      s3: lap.duration_sector_3,
    }))
    .filter((d) => d.y > 0);
}

// ─────────────────────────────────────────────────────────────
// Sector & Speed Trap Calculations
// ─────────────────────────────────────────────────────────────

/**
 * Computes overall bests and per-driver best sector / speed trap metrics.
 */
export function calculateDriverSectorSummaries(
  selectedDrivers: string[],
  drivers: Driver[],
  lapsCache: Record<string, Lap[]>
): {
  summaries: DriverSectorSummary[];
  overallBestS1: number | null;
  overallBestS2: number | null;
  overallBestS3: number | null;
  overallTopSpeedST: number | null;
} {
  let overallBestS1: number | null = null;
  let overallBestS2: number | null = null;
  let overallBestS3: number | null = null;
  let overallTopSpeedST: number | null = null;

  const summaries: DriverSectorSummary[] = selectedDrivers.map((driverNum) => {
    const rawLaps = lapsCache[driverNum] ?? [];
    const validLaps = rawLaps.filter((l) => (l.lap_duration ?? l.lap_time ?? 0) > 0 && (l.lap_duration ?? l.lap_time ?? 0) < 130);

    const info = drivers.find((d) => d.driver_number.toString() === driverNum);
    const driverName = info?.full_name ?? `Driver #${driverNum}`;
    const driverAcronym = info?.name_acronym ?? `#${driverNum}`;
    const teamColour = info ? formatColor(info.team_colour) : '#38bdf8';

    // Best sectors for this driver
    const s1List = validLaps.map((l) => l.duration_sector_1).filter((v): v is number => v !== null && v !== undefined && v > 0);
    const s2List = validLaps.map((l) => l.duration_sector_2).filter((v): v is number => v !== null && v !== undefined && v > 0);
    const s3List = validLaps.map((l) => l.duration_sector_3).filter((v): v is number => v !== null && v !== undefined && v > 0);
    const lapTimes = validLaps.map((l) => l.lap_duration ?? l.lap_time ?? 0).filter((v) => v > 0);

    const bestS1 = s1List.length > 0 ? Math.min(...s1List) : null;
    const bestS2 = s2List.length > 0 ? Math.min(...s2List) : null;
    const bestS3 = s3List.length > 0 ? Math.min(...s3List) : null;
    const actualBestLap = lapTimes.length > 0 ? Math.min(...lapTimes) : null;

    const theoreticalBestLap =
      bestS1 !== null && bestS2 !== null && bestS3 !== null
        ? Number((bestS1 + bestS2 + bestS3).toFixed(3))
        : null;

    // Top speeds
    const stList = validLaps.map((l) => l.speed_st).filter((v): v is number => v !== null && v !== undefined && v > 0);
    const i1List = validLaps.map((l) => l.speed_i1).filter((v): v is number => v !== null && v !== undefined && v > 0);
    const i2List = validLaps.map((l) => l.speed_i2).filter((v): v is number => v !== null && v !== undefined && v > 0);
    const flList = validLaps.map((l) => l.speed_fl).filter((v): v is number => v !== null && v !== undefined && v > 0);

    const topSpeedST = stList.length > 0 ? Math.max(...stList) : null;
    const topSpeedI1 = i1List.length > 0 ? Math.max(...i1List) : null;
    const topSpeedI2 = i2List.length > 0 ? Math.max(...i2List) : null;
    const topSpeedFL = flList.length > 0 ? Math.max(...flList) : null;

    // Update overall bests
    if (bestS1 !== null && (overallBestS1 === null || bestS1 < overallBestS1)) overallBestS1 = bestS1;
    if (bestS2 !== null && (overallBestS2 === null || bestS2 < overallBestS2)) overallBestS2 = bestS2;
    if (bestS3 !== null && (overallBestS3 === null || bestS3 < overallBestS3)) overallBestS3 = bestS3;
    if (topSpeedST !== null && (overallTopSpeedST === null || topSpeedST > overallTopSpeedST)) overallTopSpeedST = topSpeedST;

    return {
      driverNumber: driverNum,
      driverName,
      driverAcronym,
      teamColour,
      bestS1,
      bestS2,
      bestS3,
      theoreticalBestLap,
      actualBestLap,
      topSpeedST,
      topSpeedI1,
      topSpeedI2,
      topSpeedFL,
    };
  });

  return {
    summaries,
    overallBestS1,
    overallBestS2,
    overallBestS3,
    overallTopSpeedST,
  };
}

/**
 * Returns highlight status ('purple' | 'green' | 'yellow' | 'none') for a sector time.
 */
export function getSectorHighlight(
  val: number | null | undefined,
  personalBest: number | null | undefined,
  overallBest: number | null | undefined
): SectorHighlight {
  if (val === null || val === undefined || isNaN(val) || val <= 0) return 'none';
  if (overallBest !== null && overallBest !== undefined && Math.abs(val - overallBest) < 0.001) {
    return 'purple';
  }
  if (personalBest !== null && personalBest !== undefined && Math.abs(val - personalBest) < 0.001) {
    return 'green';
  }
  return 'yellow';
}

/**
 * Format speed in km/h.
 */
export function formatSpeed(speed: number | null | undefined): string {
  if (speed === null || speed === undefined || isNaN(speed) || speed <= 0) return '-';
  return `${speed.toFixed(1)} km/h`;
}

