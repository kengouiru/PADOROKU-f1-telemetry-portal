/**
 * lib/telemetryContext.ts
 * Build a structured text summary of selected drivers' telemetry data
 * to use as context when calling the Gemini AI Strategist.
 */

import type { Driver, Lap, Stint, PitStop, Session } from './types';
import { formatLapTime } from './telemetryUtils';

export interface TelemetryContextInput {
  session?: Session | null;
  selectedDrivers: string[];
  drivers: Driver[];
  lapsCache: Record<string, Lap[]>;
  stints: Stint[];
  pitStopsCache: Record<string, PitStop[]>;
}

export function buildTelemetryContext(input: TelemetryContextInput): string {
  const { session, selectedDrivers, drivers, lapsCache, stints, pitStopsCache } = input;

  const lines: string[] = [];

  // Session header
  if (session) {
    lines.push(`Session: ${session.meeting_official_name ?? session.meeting_name ?? 'F1 Session'} — ${session.session_name} (${session.year})`);
  } else {
    lines.push('Session: 2024 Bahrain Grand Prix — Race (Demo Data)');
  }
  lines.push('');

  if (selectedDrivers.length === 0) {
    lines.push('No drivers selected.');
    return lines.join('\n');
  }

  // Per-driver summary
  for (const driverNum of selectedDrivers) {
    const driver = drivers.find(d => d.driver_number.toString() === driverNum);
    const laps = lapsCache[driverNum] ?? [];
    const driverStints = stints.filter(s => s.driver_number === parseInt(driverNum));
    const pitStops = pitStopsCache[driverNum] ?? [];

    const name = driver ? `${driver.name_acronym} (${driver.first_name} ${driver.last_name}, ${driver.team_name})` : `Driver #${driverNum}`;
    lines.push(`=== ${name} ===`);

    if (laps.length === 0) {
      lines.push('  Lap data not available.');
      lines.push('');
      continue;
    }

    // Valid lap times (exclude pit laps > 110s)
    const validLaps = laps.filter(l => {
      const t = l.lap_duration ?? l.lap_time ?? 0;
      return t > 0 && t < 110;
    });

    const allTimes = validLaps.map(l => l.lap_duration ?? l.lap_time ?? 0);
    const bestTime = allTimes.length > 0 ? Math.min(...allTimes) : null;
    const avgTime = allTimes.length > 0 ? allTimes.reduce((a, b) => a + b, 0) / allTimes.length : null;

    const bestLap = validLaps.find(l => (l.lap_duration ?? l.lap_time) === bestTime);

    lines.push(`  Total laps: ${laps.length}`);
    if (bestTime !== null) lines.push(`  Best lap:   ${formatLapTime(bestTime)} (Lap ${bestLap?.lap_number ?? '?'})`);
    if (avgTime !== null) lines.push(`  Avg pace:   ${formatLapTime(avgTime)} (clean laps only)`);
    lines.push('');

    // Stints
    if (driverStints.length > 0) {
      lines.push('  Stints:');
      const sortedStints = [...driverStints].sort((a, b) => a.stint_number - b.stint_number);
      for (const stint of sortedStints) {
        const stintLaps = validLaps.filter(l =>
          l.lap_number >= stint.lap_start &&
          (stint.lap_end === null || l.lap_number <= (stint.lap_end ?? Infinity))
        );
        const stintBest = stintLaps.length > 0
          ? Math.min(...stintLaps.map(l => l.lap_duration ?? l.lap_time ?? 0))
          : null;
        const lapRange = `Laps ${stint.lap_start}–${stint.lap_end ?? '?'}`;
        const age = stint.tyre_age_at_start > 0 ? ` (used ${stint.tyre_age_at_start}L)` : '';
        const best = stintBest ? ` best: ${formatLapTime(stintBest)}` : '';
        lines.push(`    Stint ${stint.stint_number}: ${stint.compound}${age}, ${lapRange}${best}`);
      }
      lines.push('');
    }

    // Degradation analysis (compare first 5 vs last 5 clean laps of each stint)
    if (driverStints.length > 0) {
      lines.push('  Degradation per stint (first 5 → last 5 laps Δ):');
      const sortedStints = [...driverStints].sort((a, b) => a.stint_number - b.stint_number);
      for (const stint of sortedStints) {
        const stintLaps = validLaps
          .filter(l => l.lap_number >= stint.lap_start && (stint.lap_end === null || l.lap_number <= (stint.lap_end ?? Infinity)))
          .sort((a, b) => a.lap_number - b.lap_number);

        if (stintLaps.length < 4) continue;

        const firstPortion = stintLaps.slice(1, 4);  // skip out lap
        const lastPortion = stintLaps.slice(-3);
        const avgFirst = firstPortion.reduce((s, l) => s + (l.lap_duration ?? l.lap_time ?? 0), 0) / firstPortion.length;
        const avgLast = lastPortion.reduce((s, l) => s + (l.lap_duration ?? l.lap_time ?? 0), 0) / lastPortion.length;
        const delta = avgLast - avgFirst;
        const sign = delta >= 0 ? '+' : '';
        lines.push(`    Stint ${stint.stint_number} (${stint.compound}): ${sign}${delta.toFixed(3)}s`);
      }
      lines.push('');
    }

    // Pit stops
    if (pitStops.length > 0) {
      lines.push('  Pit stops:');
      for (const pit of pitStops) {
        lines.push(`    Lap ${pit.lap_number}: stationary ${pit.stop_duration.toFixed(1)}s, pit lane ${pit.lane_duration.toFixed(1)}s`);
      }
      lines.push('');
    } else {
      lines.push('  Pit stops: none recorded');
      lines.push('');
    }
  }

  // Inter-driver comparison (if 2+ drivers)
  if (selectedDrivers.length >= 2) {
    lines.push('=== COMPARISON ===');
    const driverTimes: { num: string; name: string; best: number | null; avg: number | null }[] = selectedDrivers.map(num => {
      const laps = (lapsCache[num] ?? []).filter(l => {
        const t = l.lap_duration ?? l.lap_time ?? 0;
        return t > 0 && t < 110;
      });
      const times = laps.map(l => l.lap_duration ?? l.lap_time ?? 0);
      const drv = drivers.find(d => d.driver_number.toString() === num);
      return {
        num,
        name: drv?.name_acronym ?? `#${num}`,
        best: times.length > 0 ? Math.min(...times) : null,
        avg: times.length > 0 ? times.reduce((a, b) => a + b, 0) / times.length : null,
      };
    });

    const [a, b] = driverTimes;
    if (a.best !== null && b.best !== null) {
      const bestDelta = a.best - b.best;
      const sign = bestDelta >= 0 ? '+' : '';
      lines.push(`  Best lap gap (${a.name} vs ${b.name}): ${sign}${bestDelta.toFixed(3)}s`);
    }
    if (a.avg !== null && b.avg !== null) {
      const avgDelta = a.avg - b.avg;
      const sign = avgDelta >= 0 ? '+' : '';
      lines.push(`  Avg pace gap  (${a.name} vs ${b.name}): ${sign}${avgDelta.toFixed(3)}s`);
    }
  }

  return lines.join('\n');
}
