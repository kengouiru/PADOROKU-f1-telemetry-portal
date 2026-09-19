'use client';

/**
 * components/LapTable.tsx
 * Professional Dual-Pane Workstation: Tabbed lap detail table per driver
 * with fixed column widths, Sector Best highlights (Green/Purple), Speed Trap data,
 * and Driver Sector & Pace Mastery analytics card.
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
  formatSpeed,
  formatColor,
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

  // Compute sector summaries for highlights & right companion card
  const { summaries, overallBestS1, overallBestS2, overallBestS3, overallTopSpeedST } = useMemo(
    () => calculateDriverSectorSummaries(selectedDrivers, drivers, lapsCache),
    [selectedDrivers, drivers, lapsCache]
  );

  const currentSummary = summaries.find((s) => s.driverNumber === currentTab);
  const currentDriver = drivers.find((d) => d.driver_number.toString() === currentTab);
  const driverColor = currentDriver ? formatColor(currentDriver.team_colour) : '#38bdf8';

  if (selectedDrivers.length === 0) return null;

  const laps = currentTab ? enrichedLaps[currentTab] ?? [] : [];

  // Find best lap for purple/star highlight and lap number
  const validLaps = laps.filter((l) => {
    const t = l.lap_duration ?? l.lap_time ?? 0;
    return t > 0 && t < 150;
  });
  
  let bestLapObj: Lap | null = null;
  let bestTime: number | null = null;
  for (const l of validLaps) {
    const t = l.lap_duration ?? l.lap_time ?? 0;
    if (bestTime === null || t < bestTime) {
      bestTime = t;
      bestLapObj = l;
    }
  }

  // Sort descending (latest lap first)
  const sorted = [...laps].sort((a, b) => b.lap_number - a.lap_number);

  // Driver Stints Analytics
  const driverStints = stints
    .filter((s) => s.driver_number.toString() === currentTab)
    .sort((a, b) => a.stint_number - b.stint_number);

  // Stint pace metrics
  const stintStats = driverStints.map((stint) => {
    const stintLaps = laps.filter((l) => {
      if (l.stintNumber !== undefined && l.stintNumber !== null) {
        return Number(l.stintNumber) === stint.stint_number;
      }
      return (
        l.lap_number >= stint.lap_start &&
        (stint.lap_end === null || l.lap_number <= stint.lap_end)
      );
    });

    const validPaceLaps = stintLaps.filter((l) => {
      const t = l.lap_duration ?? l.lap_time ?? 0;
      return t > 0 && t < 125;
    });

    const avgTime =
      validPaceLaps.length > 0
        ? validPaceLaps.reduce((acc, l) => acc + (l.lap_duration ?? l.lap_time ?? 0), 0) /
          validPaceLaps.length
        : null;

    return {
      ...stint,
      totalLaps: stintLaps.length,
      avgLapTime: avgTime,
      compoundColor: getTyreColor(stint.compound),
    };
  });

  const theoreticalDelta =
    currentSummary?.actualBestLap !== null &&
    currentSummary?.actualBestLap !== undefined &&
    currentSummary?.theoreticalBestLap !== null &&
    currentSummary?.theoreticalBestLap !== undefined
      ? Number((currentSummary.actualBestLap - currentSummary.theoreticalBestLap).toFixed(3))
      : null;

  return (
    <div className="glass-card p-3 sm:p-4 overflow-hidden flex flex-col gap-3.5">
      {/* Driver Tabs Header & Legend */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-2.5">
        <div className="flex flex-wrap items-center gap-1.5">
          {selectedDrivers.map((num) => {
            const driver = drivers.find((d) => d.driver_number.toString() === num);
            const color = driver?.team_colour ? `#${driver.team_colour}` : '#38bdf8';
            const isActive = currentTab === num;
            return (
              <button
                key={num}
                onClick={() => setActiveTab(num)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-racing tracking-wider transition-all flex items-center gap-2 border ${
                  isActive
                    ? 'bg-white/10 text-white font-bold border-white/25 shadow-sm ring-1 ring-white/15'
                    : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border-white/5 hover:border-white/15'
                }`}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: color }}
                />
                <span>{driver?.name_acronym ?? `#${num}`}</span>
                {isActive && (
                  <span className="text-[10px] font-mono text-slate-400">
                    ({laps.length}L)
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400">
          <span className="flex items-center gap-1.5 text-purple-300">
            <span className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_6px_rgba(168,85,247,0.8)]" />
            <span>セッション最速 (Purple)</span>
          </span>
          <span className="flex items-center gap-1.5 text-emerald-300">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(34,197,94,0.8)]" />
            <span>自己ベスト (Green)</span>
          </span>
        </div>
      </div>

      {/* Dual-Pane Layout: Table (8 cols) + Driver Telemetry Mastery Card (4 cols) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-3.5 items-start">
        {/* Left Pane: Lap Detail Table (Bounded columns, high-density) */}
        <div className="xl:col-span-8 rounded-xl border border-white/10 overflow-hidden bg-slate-950/40 shadow-inner">
          <div className="overflow-x-auto max-h-[580px] overflow-y-auto">
            {laps.length === 0 ? (
              <div className="text-center text-slate-500 text-sm py-12 font-mono">
                周回データが存在しません
              </div>
            ) : (
              <table className="w-full text-xs border-collapse">
                <thead className="sticky top-0 bg-slate-900/95 backdrop-blur-md z-10">
                  <tr className="text-slate-400 text-left border-b border-white/10 select-none">
                    <th className="w-12 px-2.5 py-2 font-medium text-center font-racing">LAP</th>
                    <th className="w-24 px-3 py-2 font-medium text-center font-racing">TIME</th>
                    <th className="w-18 px-2.5 py-2 font-medium text-right font-mono">S1</th>
                    <th className="w-18 px-2.5 py-2 font-medium text-right font-mono">S2</th>
                    <th className="w-18 px-2.5 py-2 font-medium text-right font-mono">S3</th>
                    <th className="w-22 px-2.5 py-2 font-medium text-right font-mono">ST (km/h)</th>
                    <th className="w-14 px-2 py-2 font-medium text-center">TYRE</th>
                    <th className="w-14 px-2 py-2 font-medium text-center">STINT</th>
                    <th className="w-14 px-2 py-2 font-medium text-center">AGE</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
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
                        className={`transition-colors ${
                          isBest
                            ? 'bg-purple-950/40 text-purple-200 font-semibold'
                            : 'hover:bg-white/[0.04]'
                        }`}
                      >
                        <td className="w-12 px-2.5 py-1.5 text-center font-mono">
                          <span className={isBest ? 'text-purple-300 font-bold' : 'text-slate-300'}>
                            {lap.lap_number}
                          </span>
                          {isBest && <span className="ml-0.5 text-purple-400 text-[10px]">★</span>}
                        </td>
                        <td className="w-24 px-3 py-1.5 text-center font-racing">
                          <span
                            className={
                              isBest
                                ? 'text-purple-300 font-bold'
                                : isPit
                                ? 'text-slate-500'
                                : 'text-white'
                            }
                          >
                            {lapTime ? formatLapTime(lapTime) : 'PIT'}
                          </span>
                        </td>
                        {/* S1 */}
                        <td
                          className={`w-18 px-2.5 py-1.5 text-right font-mono ${
                            s1Highlight === 'purple'
                              ? 'text-purple-300 font-bold bg-purple-950/40'
                              : s1Highlight === 'green'
                              ? 'text-emerald-300 font-semibold bg-emerald-950/30'
                              : 'text-slate-300'
                          }`}
                        >
                          {formatSectorTime(lap.duration_sector_1)}
                        </td>
                        {/* S2 */}
                        <td
                          className={`w-18 px-2.5 py-1.5 text-right font-mono ${
                            s2Highlight === 'purple'
                              ? 'text-purple-300 font-bold bg-purple-950/40'
                              : s2Highlight === 'green'
                              ? 'text-emerald-300 font-semibold bg-emerald-950/30'
                              : 'text-slate-300'
                          }`}
                        >
                          {formatSectorTime(lap.duration_sector_2)}
                        </td>
                        {/* S3 */}
                        <td
                          className={`w-18 px-2.5 py-1.5 text-right font-mono ${
                            s3Highlight === 'purple'
                              ? 'text-purple-300 font-bold bg-purple-950/40'
                              : s3Highlight === 'green'
                              ? 'text-emerald-300 font-semibold bg-emerald-950/30'
                              : 'text-slate-300'
                          }`}
                        >
                          {formatSectorTime(lap.duration_sector_3)}
                        </td>
                        {/* Speed Trap */}
                        <td className="w-22 px-2.5 py-1.5 text-right font-mono text-slate-300">
                          {lap.speed_st ? `${lap.speed_st.toFixed(1)}` : '-'}
                        </td>
                        {/* Tyre */}
                        <td className="w-14 px-2 py-1.5 text-center">
                          <span
                            className="inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold text-slate-950 shadow-sm"
                            style={{ backgroundColor: tyreColor }}
                            title={compound}
                          >
                            {COMPOUND_LABEL[compound] ?? '?'}
                          </span>
                        </td>
                        <td className="w-14 px-2 py-1.5 text-center font-mono text-slate-400">
                          {lap.stintNumber ?? '-'}
                        </td>
                        <td className="w-14 px-2 py-1.5 text-center font-mono text-slate-400">
                          {lap.tyreAge !== undefined ? `${lap.tyreAge}L` : '-'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          {/* Table Footer Summary Bar */}
          <div className="p-2 px-3 bg-slate-900/80 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-slate-400">
            <div>
              <span>全周回数: </span>
              <span className="text-white font-bold">{laps.length} Laps</span>
              <span className="mx-2 text-slate-600">•</span>
              <span>有効ラップ: </span>
              <span className="text-emerald-400 font-bold">{validLaps.length} Laps</span>
            </div>
            {bestTime && bestLapObj && (
              <div className="flex items-center gap-1.5 text-purple-300">
                <span>自己ベスト:</span>
                <span className="font-racing font-bold text-white">
                  {formatLapTime(bestTime)}
                </span>
                <span className="text-purple-400 font-sans text-[10px]">
                  (Lap {bestLapObj.lap_number})
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right Pane: Driver Sector & Pace Mastery Companion Card */}
        <div className="xl:col-span-4 flex flex-col gap-3">
          {/* Driver Profile Header */}
          <div
            className="glass-card-premium p-3 sm:p-3.5 rounded-xl flex items-center justify-between border-l-4"
            style={{ borderLeftColor: driverColor }}
          >
            <div>
              <div className="flex items-center gap-2">
                <span
                  className="font-racing font-bold text-xs px-2 py-0.5 rounded border"
                  style={{
                    borderColor: `${driverColor}60`,
                    color: driverColor,
                    backgroundColor: `${driverColor}15`,
                  }}
                >
                  {currentDriver?.name_acronym ?? `#${currentTab}`}
                </span>
                <span className="text-xs font-mono text-slate-400">
                  #{currentTab}
                </span>
              </div>
              <h4 className="text-sm font-bold text-white mt-1 leading-tight">
                {currentDriver?.full_name ?? `Driver #${currentTab}`}
              </h4>
              <p className="text-[11px] text-slate-400 font-mono">
                {currentDriver?.team_name ?? 'F1 Constructor'}
              </p>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 block">
                Top Speed ST
              </span>
              <span className="text-sm font-mono font-bold text-sky-400">
                {formatSpeed(currentSummary?.topSpeedST)}
              </span>
            </div>
          </div>

          {/* Theoretical Best vs Actual Best Lap Analysis */}
          <div className="glass-card-premium p-3.5 rounded-xl flex flex-col gap-2.5">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <h4 className="text-xs font-racing font-bold text-white tracking-wider flex items-center gap-1.5">
                <span>⏱️</span>
                <span>IDEAL LAP VS ACTUAL / 理想理論ラップ解析</span>
              </h4>
              <span className="text-[10px] font-mono text-slate-400">
                S1+S2+S3合算
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="bg-slate-900/70 p-2.5 rounded-lg border border-white/5">
                <span className="text-[10px] font-mono text-slate-400 block">
                  実走最速ラップ
                </span>
                <span className="text-sm font-racing font-bold text-white block mt-0.5">
                  {formatLapTime(currentSummary?.actualBestLap)}
                </span>
              </div>

              <div className="bg-slate-900/70 p-2.5 rounded-lg border border-purple-500/20">
                <span className="text-[10px] font-mono text-purple-300 block">
                  理論上最速 (Ideal Lap)
                </span>
                <span className="text-sm font-racing font-bold text-purple-300 block mt-0.5">
                  {formatLapTime(currentSummary?.theoreticalBestLap)}
                </span>
              </div>
            </div>

            {theoreticalDelta !== null && theoreticalDelta > 0 ? (
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-2 flex items-center justify-between text-xs font-mono">
                <span className="text-amber-300 text-[11px]">
                  理論タイムとの乖離 (潜在短縮余地):
                </span>
                <span className="text-amber-400 font-bold">
                  Δ -{theoreticalDelta.toFixed(3)}s
                </span>
              </div>
            ) : (
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-2 text-center text-xs font-mono text-emerald-300">
                完璧なアタック: 理論値と同等のペースを実走で記録
              </div>
            )}
          </div>

          {/* Sector Best Splits Breakdown */}
          <div className="glass-card-premium p-3.5 rounded-xl flex flex-col gap-2.5">
            <h4 className="text-xs font-racing font-bold text-white tracking-wider border-b border-white/10 pb-2 flex items-center gap-1.5">
              <span>🎯</span>
              <span>SECTOR BEST SPLITS / 各セクター自己ベスト</span>
            </h4>

            <div className="grid grid-cols-3 gap-2">
              {/* S1 */}
              <div className="bg-slate-900/80 p-2 rounded-lg border border-white/5 flex flex-col items-center">
                <span className="text-[10px] font-mono text-slate-400">SECTOR 1</span>
                <span
                  className={`text-xs font-mono font-bold mt-1 ${
                    overallBestS1 !== null &&
                    currentSummary?.bestS1 !== null &&
                    currentSummary?.bestS1 !== undefined &&
                    Math.abs(currentSummary.bestS1 - overallBestS1) < 0.001
                      ? 'text-purple-300'
                      : 'text-emerald-300'
                  }`}
                >
                  {formatSectorTime(currentSummary?.bestS1)}
                </span>
              </div>

              {/* S2 */}
              <div className="bg-slate-900/80 p-2 rounded-lg border border-white/5 flex flex-col items-center">
                <span className="text-[10px] font-mono text-slate-400">SECTOR 2</span>
                <span
                  className={`text-xs font-mono font-bold mt-1 ${
                    overallBestS2 !== null &&
                    currentSummary?.bestS2 !== null &&
                    currentSummary?.bestS2 !== undefined &&
                    Math.abs(currentSummary.bestS2 - overallBestS2) < 0.001
                      ? 'text-purple-300'
                      : 'text-emerald-300'
                  }`}
                >
                  {formatSectorTime(currentSummary?.bestS2)}
                </span>
              </div>

              {/* S3 */}
              <div className="bg-slate-900/80 p-2 rounded-lg border border-white/5 flex flex-col items-center">
                <span className="text-[10px] font-mono text-slate-400">SECTOR 3</span>
                <span
                  className={`text-xs font-mono font-bold mt-1 ${
                    overallBestS3 !== null &&
                    currentSummary?.bestS3 !== null &&
                    currentSummary?.bestS3 !== undefined &&
                    Math.abs(currentSummary.bestS3 - overallBestS3) < 0.001
                      ? 'text-purple-300'
                      : 'text-emerald-300'
                  }`}
                >
                  {formatSectorTime(currentSummary?.bestS3)}
                </span>
              </div>
            </div>
          </div>

          {/* Stint Performance & Tyre Degradation Breakdown */}
          {stintStats.length > 0 && (
            <div className="glass-card-premium p-3.5 rounded-xl flex flex-col gap-2.5">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <h4 className="text-xs font-racing font-bold text-white tracking-wider flex items-center gap-1.5">
                  <span>🛞</span>
                  <span>STINT PERFORMANCE / スティント別ペース推移</span>
                </h4>
                <span className="text-[10px] font-mono text-slate-400">
                  {stintStats.length} Stints
                </span>
              </div>

              <div className="space-y-2">
                {stintStats.map((stint) => (
                  <div
                    key={stint.stint_number}
                    className="p-2 rounded-lg bg-slate-900/70 border border-white/5 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold text-slate-950 shadow-sm"
                        style={{ backgroundColor: stint.compoundColor }}
                      >
                        {COMPOUND_LABEL[stint.compound.toUpperCase()] ?? stint.compound[0]}
                      </span>
                      <div>
                        <span className="font-mono font-bold text-white">
                          Stint {stint.stint_number}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono ml-1.5">
                          L{stint.lap_start} - {stint.lap_end ?? '現在'} ({stint.totalLaps}周)
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 font-mono block">
                        平均ペース
                      </span>
                      <span className="font-racing font-bold text-white">
                        {stint.avgLapTime ? formatLapTime(stint.avgLapTime) : '-'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
