'use client';

/**
 * components/LapTable.tsx
 * Tabbed lap detail table per driver with Sector Best highlights (Green/Purple)
 * and Speed Trap data.
 */

import React, { useState, useMemo } from 'react';
import type { Driver, Lap, Stint } from '@/lib/types';
import {
  enrichLapsWithStints,
  formatLapTime,
  formatSectorTime,
  getTyreColor,
  calculateDriverSectorSummaries,
  getSectorHighlight,
} from '@/lib/telemetryUtils';

interface LapTableProps {
  selectedDrivers: string[];
  lapsCache: Record<string, Lap[]>;
  drivers: Driver[];
  stints: Stint[];
}

const COMPOUND_LABEL: Record<string, string> = {
  SOFT: 'S',
  MEDIUM: 'M',
  HARD: 'H',
  INTERMEDIATE: 'I',
  WET: 'W',
  UNKNOWN: '?',
};

export default function LapTable({
  selectedDrivers,
  lapsCache,
  drivers,
  stints,
}: LapTableProps) {
  const [activeTab, setActiveTab] = useState<string | null>(
    selectedDrivers[0] ?? null
  );

  // Keep active tab in sync when drivers change
  const currentTab = selectedDrivers.includes(activeTab ?? '')
    ? activeTab
    : selectedDrivers[0] ?? null;

  const enrichedLaps = useMemo(() => {
    const result: Record<string, Lap[]> = {};
    for (const num of selectedDrivers) {
      const raw = lapsCache[num] ?? [];
      result[num] = enrichLapsWithStints(raw, stints, num);
    }
    return result;
  }, [selectedDrivers, lapsCache, stints]);

  // Compute sector summaries for highlights
  const { summaries, overallBestS1, overallBestS2, overallBestS3 } = useMemo(
    () => calculateDriverSectorSummaries(selectedDrivers, drivers, lapsCache),
    [selectedDrivers, drivers, lapsCache]
  );

  const currentSummary = summaries.find((s) => s.driverNumber === currentTab);

  if (selectedDrivers.length === 0) return null;

  const laps = currentTab ? enrichedLaps[currentTab] ?? [] : [];

  // Find best lap for purple/star highlight
  const validTimes = laps
    .map((l) => l.lap_duration ?? l.lap_time ?? 0)
    .filter((t) => t > 0);
  const bestTime = validTimes.length > 0 ? Math.min(...validTimes) : null;

  // Sort descending (latest lap first)
  const sorted = [...laps].sort((a, b) => b.lap_number - a.lap_number);

  return (
    <div className="glass-card overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-white/10">
        {selectedDrivers.map((num) => {
          const driver = drivers.find((d) => d.driver_number.toString() === num);
          const color = driver?.team_colour ? `#${driver.team_colour}` : '#38bdf8';
          const isActive = currentTab === num;
          return (
            <button
              key={num}
              onClick={() => setActiveTab(num)}
              className={`px-4 py-2.5 text-xs font-racing tracking-wider transition-colors relative flex items-center gap-2 ${
                isActive ? 'text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: color }}
              />
              {driver?.name_acronym ?? `#${num}`}
              {isActive && (
                <span
                  className="absolute bottom-0 left-0 right-0 h-0.5"
                  style={{ backgroundColor: color }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Table */}
      <div className="overflow-x-auto max-h-72 overflow-y-auto">
        {laps.length === 0 ? (
          <div className="text-center text-slate-500 text-sm py-8">
            周回データが存在しません
          </div>
        ) : (
          <table className="w-full text-xs">
            <thead className="sticky top-0 bg-slate-900/90 backdrop-blur-sm z-10">
              <tr className="text-slate-400 text-left border-b border-white/10">
                <th className="px-3 py-2 font-medium">LAP</th>
                <th className="px-3 py-2 font-medium font-racing">TIME</th>
                <th className="px-3 py-2 font-medium">S1</th>
                <th className="px-3 py-2 font-medium">S2</th>
                <th className="px-3 py-2 font-medium">S3</th>
                <th className="px-3 py-2 font-medium">ST (km/h)</th>
                <th className="px-3 py-2 font-medium">TYRE</th>
                <th className="px-3 py-2 font-medium">STINT</th>
                <th className="px-3 py-2 font-medium">AGE</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((lap) => {
                const lapTime = lap.lap_duration ?? lap.lap_time;
                const isBest = bestTime !== null && lapTime === bestTime;
                const isPit =
                  lapTime !== null && lapTime !== undefined && lapTime > 110;
                const compound = lap.compound ?? 'UNKNOWN';
                const tyreColor = getTyreColor(compound);

                const s1Highlight = getSectorHighlight(
                  lap.duration_sector_1,
                  currentSummary?.bestS1,
                  overallBestS1
                );
                const s2Highlight = getSectorHighlight(
                  lap.duration_sector_2,
                  currentSummary?.bestS2,
                  overallBestS2
                );
                const s3Highlight = getSectorHighlight(
                  lap.duration_sector_3,
                  currentSummary?.bestS3,
                  overallBestS3
                );

                return (
                  <tr
                    key={lap.lap_number}
                    className={`border-b border-white/5 hover:bg-white/5 transition-colors ${
                      isBest ? 'bg-purple-900/20' : ''
                    }`}
                  >
                    <td
                      className={`px-3 py-1.5 font-bold ${
                        isBest ? 'text-purple-300' : 'text-slate-200'
                      }`}
                    >
                      {lap.lap_number}
                      {isBest && <span className="ml-1 text-purple-400">★</span>}
                    </td>
                    <td
                      className={`px-3 py-1.5 font-racing font-medium ${
                        isBest
                          ? 'text-purple-300 font-bold'
                          : isPit
                          ? 'text-slate-500'
                          : 'text-white'
                      }`}
                    >
                      {lapTime ? formatLapTime(lapTime) : 'PIT'}
                    </td>
                    {/* S1 */}
                    <td
                      className={`px-3 py-1.5 font-mono ${
                        s1Highlight === 'purple'
                          ? 'text-purple-300 font-bold bg-purple-950/30'
                          : s1Highlight === 'green'
                          ? 'text-emerald-300 font-semibold bg-emerald-950/20'
                          : 'text-slate-300'
                      }`}
                    >
                      {formatSectorTime(lap.duration_sector_1)}
                    </td>
                    {/* S2 */}
                    <td
                      className={`px-3 py-1.5 font-mono ${
                        s2Highlight === 'purple'
                          ? 'text-purple-300 font-bold bg-purple-950/30'
                          : s2Highlight === 'green'
                          ? 'text-emerald-300 font-semibold bg-emerald-950/20'
                          : 'text-slate-300'
                      }`}
                    >
                      {formatSectorTime(lap.duration_sector_2)}
                    </td>
                    {/* S3 */}
                    <td
                      className={`px-3 py-1.5 font-mono ${
                        s3Highlight === 'purple'
                          ? 'text-purple-300 font-bold bg-purple-950/30'
                          : s3Highlight === 'green'
                          ? 'text-emerald-300 font-semibold bg-emerald-950/20'
                          : 'text-slate-300'
                      }`}
                    >
                      {formatSectorTime(lap.duration_sector_3)}
                    </td>
                    {/* Speed Trap */}
                    <td className="px-3 py-1.5 font-mono text-slate-300">
                      {lap.speed_st ? `${lap.speed_st.toFixed(1)}` : '-'}
                    </td>
                    {/* Tyre */}
                    <td className="px-3 py-1.5">
                      <span
                        className="inline-flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold text-slate-900"
                        style={{ backgroundColor: tyreColor }}
                        title={compound}
                      >
                        {COMPOUND_LABEL[compound] ?? '?'}
                      </span>
                    </td>
                    <td className="px-3 py-1.5 text-slate-400">
                      {lap.stintNumber ?? '-'}
                    </td>
                    <td className="px-3 py-1.5 text-slate-400">
                      {lap.tyreAge !== undefined ? `${lap.tyreAge}L` : '-'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
