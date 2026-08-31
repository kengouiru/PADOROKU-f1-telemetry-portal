'use client';

/**
 * components/SectorAnalysis.tsx
 * Sector & Speed Trap Comparison (Phase 2)
 *
 * Features:
 * - Sector 1, 2, 3 Best times with Overall Best (Purple) & Personal Best (Green) highlights
 * - Theoretical Best Lap (Best S1 + S2 + S3) vs Actual Best Lap comparison
 * - Speed Trap (ST, I1, I2, FL) top speeds with visual comparative bar
 * - Delta breakdown between selected drivers
 */

import React, { useMemo } from 'react';
import type { Driver, Lap } from '@/lib/types';
import {
  calculateDriverSectorSummaries,
  formatSectorTime,
  formatLapTime,
  formatSpeed,
} from '@/lib/telemetryUtils';

interface SectorAnalysisProps {
  selectedDrivers: string[];
  drivers: Driver[];
  lapsCache: Record<string, Lap[]>;
}

export default function SectorAnalysis({
  selectedDrivers,
  drivers,
  lapsCache,
}: SectorAnalysisProps) {
  const { summaries, overallBestS1, overallBestS2, overallBestS3, overallTopSpeedST } =
    useMemo(
      () => calculateDriverSectorSummaries(selectedDrivers, drivers, lapsCache),
      [selectedDrivers, drivers, lapsCache]
    );

  if (selectedDrivers.length === 0) {
    return null;
  }

  // Find max speed across all to scale bar
  const maxST = Math.max(...summaries.map((s) => s.topSpeedST ?? 0), 335);

  return (
    <div className="glass-card p-4 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
        <div>
          <h3 className="text-xs font-racing font-bold text-white tracking-widest border-l-2 border-f1-red pl-2 uppercase">
            SECTOR & SPEED TRAP COMPARISON
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            セクター別自己ベスト・全体ベスト（紫）および最高速比較
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
            <span className="text-purple-300 font-medium">Overall Best</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]" />
            <span className="text-emerald-300 font-medium">Personal Best</span>
          </span>
        </div>
      </div>

      {/* Driver Sector Cards Grid */}
      <div
        className={`grid gap-3.5 ${
          summaries.length === 1
            ? 'grid-cols-1'
            : summaries.length === 2
            ? 'grid-cols-1 md:grid-cols-2'
            : 'grid-cols-1 md:grid-cols-3'
        }`}
      >
        {summaries.map((summary) => {
          const isS1Overall =
            summary.bestS1 !== null &&
            overallBestS1 !== null &&
            Math.abs(summary.bestS1 - overallBestS1) < 0.001;
          const isS2Overall =
            summary.bestS2 !== null &&
            overallBestS2 !== null &&
            Math.abs(summary.bestS2 - overallBestS2) < 0.001;
          const isS3Overall =
            summary.bestS3 !== null &&
            overallBestS3 !== null &&
            Math.abs(summary.bestS3 - overallBestS3) < 0.001;

          const theoreticalDelta =
            summary.actualBestLap !== null && summary.theoreticalBestLap !== null
              ? Number((summary.actualBestLap - summary.theoreticalBestLap).toFixed(3))
              : null;

          return (
            <div
              key={summary.driverNumber}
              className="bg-slate-900/60 border border-white/10 rounded-xl p-3.5 flex flex-col gap-3 relative overflow-hidden"
              style={{
                borderLeftWidth: 3,
                borderLeftColor: summary.teamColour,
              }}
            >
              {/* Driver header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="font-racing font-bold text-sm px-2 py-0.5 rounded border"
                    style={{
                      borderColor: `${summary.teamColour}60`,
                      color: summary.teamColour,
                      backgroundColor: `${summary.teamColour}15`,
                    }}
                  >
                    {summary.driverAcronym}
                  </span>
                  <span className="text-xs font-bold text-white truncate max-w-[130px]">
                    {summary.driverName}
                  </span>
                </div>
                <span className="text-xs text-slate-500 font-mono">
                  #{summary.driverNumber}
                </span>
              </div>

              {/* Sectors (S1 / S2 / S3) Row */}
              <div className="grid grid-cols-3 gap-2 text-center">
                {/* Sector 1 */}
                <div
                  className={`rounded-lg p-2 border flex flex-col items-center justify-center transition-all ${
                    isS1Overall
                      ? 'bg-purple-950/40 border-purple-500/50 text-purple-200 shadow-[0_0_12px_rgba(168,85,247,0.2)]'
                      : summary.bestS1
                      ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
                      : 'bg-slate-800/40 border-white/5 text-slate-500'
                  }`}
                >
                  <span className="text-[10px] text-slate-400 uppercase font-medium">
                    Sector 1
                  </span>
                  <span className="font-mono text-xs font-bold mt-0.5">
                    {formatSectorTime(summary.bestS1)}
                  </span>
                  {isS1Overall && (
                    <span className="text-[9px] text-purple-400 font-bold tracking-wider">
                      PURPLE
                    </span>
                  )}
                </div>

                {/* Sector 2 */}
                <div
                  className={`rounded-lg p-2 border flex flex-col items-center justify-center transition-all ${
                    isS2Overall
                      ? 'bg-purple-950/40 border-purple-500/50 text-purple-200 shadow-[0_0_12px_rgba(168,85,247,0.2)]'
                      : summary.bestS2
                      ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
                      : 'bg-slate-800/40 border-white/5 text-slate-500'
                  }`}
                >
                  <span className="text-[10px] text-slate-400 uppercase font-medium">
                    Sector 2
                  </span>
                  <span className="font-mono text-xs font-bold mt-0.5">
                    {formatSectorTime(summary.bestS2)}
                  </span>
                  {isS2Overall && (
                    <span className="text-[9px] text-purple-400 font-bold tracking-wider">
                      PURPLE
                    </span>
                  )}
                </div>

                {/* Sector 3 */}
                <div
                  className={`rounded-lg p-2 border flex flex-col items-center justify-center transition-all ${
                    isS3Overall
                      ? 'bg-purple-950/40 border-purple-500/50 text-purple-200 shadow-[0_0_12px_rgba(168,85,247,0.2)]'
                      : summary.bestS3
                      ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
                      : 'bg-slate-800/40 border-white/5 text-slate-500'
                  }`}
                >
                  <span className="text-[10px] text-slate-400 uppercase font-medium">
                    Sector 3
                  </span>
                  <span className="font-mono text-xs font-bold mt-0.5">
                    {formatSectorTime(summary.bestS3)}
                  </span>
                  {isS3Overall && (
                    <span className="text-[9px] text-purple-400 font-bold tracking-wider">
                      PURPLE
                    </span>
                  )}
                </div>
              </div>

              {/* Lap Times: Actual vs Theoretical */}
              <div className="bg-slate-950/40 rounded-lg p-2.5 border border-white/5 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-400 text-[10px] block">
                    THEORETICAL BEST
                  </span>
                  <span className="font-mono font-bold text-slate-200 text-xs">
                    {formatLapTime(summary.theoreticalBestLap)}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 text-[10px] block">
                    ACTUAL BEST LAP
                  </span>
                  <div className="flex items-center gap-1.5 justify-end">
                    <span className="font-mono font-bold text-white text-xs">
                      {formatLapTime(summary.actualBestLap)}
                    </span>
                    {theoreticalDelta !== null && theoreticalDelta > 0 && (
                      <span className="text-[10px] text-amber-400 font-mono">
                        (+{theoreticalDelta.toFixed(3)}s)
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Speed Traps */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400 flex items-center gap-1">
                    <span>⚡ Speed Trap (ST)</span>
                    {summary.topSpeedST &&
                      overallTopSpeedST &&
                      Math.abs(summary.topSpeedST - overallTopSpeedST) < 0.1 && (
                        <span className="text-[9px] text-purple-400 font-bold">TOP</span>
                      )}
                  </span>
                  <span className="font-mono font-bold text-slate-200">
                    {formatSpeed(summary.topSpeedST)}
                  </span>
                </div>
                {/* Speed bar */}
                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.max(
                        ((summary.topSpeedST ?? 0) / maxST) * 100,
                        5
                      )}%`,
                      backgroundColor: summary.teamColour,
                    }}
                  />
                </div>

                {/* Sub speed traps (I1, I2, FL) */}
                <div className="grid grid-cols-3 gap-1 pt-1 text-[10px] text-slate-400 text-center font-mono">
                  <div className="bg-slate-800/50 rounded py-1 border border-white/5">
                    <span className="text-slate-500 block text-[9px]">I1</span>
                    <span className="text-slate-300 font-bold">
                      {summary.topSpeedI1 ? `${summary.topSpeedI1.toFixed(0)}` : '-'}
                    </span>
                  </div>
                  <div className="bg-slate-800/50 rounded py-1 border border-white/5">
                    <span className="text-slate-500 block text-[9px]">I2</span>
                    <span className="text-slate-300 font-bold">
                      {summary.topSpeedI2 ? `${summary.topSpeedI2.toFixed(0)}` : '-'}
                    </span>
                  </div>
                  <div className="bg-slate-800/50 rounded py-1 border border-white/5">
                    <span className="text-slate-500 block text-[9px]">FL</span>
                    <span className="text-slate-300 font-bold">
                      {summary.topSpeedFL ? `${summary.topSpeedFL.toFixed(0)}` : '-'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Direct Head-to-Head Delta (When 2+ drivers selected) */}
      {summaries.length >= 2 && (
        <div className="bg-slate-900/40 border border-white/10 rounded-xl p-3 flex flex-col gap-2">
          <span className="text-[11px] font-racing font-bold text-slate-300 uppercase tracking-wider">
            HEAD-TO-HEAD SECTOR DELTA ({summaries[0].driverAcronym} vs{' '}
            {summaries[1].driverAcronym})
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            {/* S1 Delta */}
            <DeltaCard
              label="S1 GAP"
              valA={summaries[0].bestS1}
              valB={summaries[1].bestS1}
              acronymA={summaries[0].driverAcronym}
              acronymB={summaries[1].driverAcronym}
              unit="s"
            />
            {/* S2 Delta */}
            <DeltaCard
              label="S2 GAP"
              valA={summaries[0].bestS2}
              valB={summaries[1].bestS2}
              acronymA={summaries[0].driverAcronym}
              acronymB={summaries[1].driverAcronym}
              unit="s"
            />
            {/* S3 Delta */}
            <DeltaCard
              label="S3 GAP"
              valA={summaries[0].bestS3}
              valB={summaries[1].bestS3}
              acronymA={summaries[0].driverAcronym}
              acronymB={summaries[1].driverAcronym}
              unit="s"
            />
            {/* Speed Trap Delta */}
            <DeltaCard
              label="ST GAP"
              valA={summaries[0].topSpeedST}
              valB={summaries[1].topSpeedST}
              acronymA={summaries[0].driverAcronym}
              acronymB={summaries[1].driverAcronym}
              unit="km/h"
              isSpeed
            />
          </div>
        </div>
      )}
    </div>
  );
}

function DeltaCard({
  label,
  valA,
  valB,
  acronymA,
  acronymB,
  unit,
  isSpeed = false,
}: {
  label: string;
  valA: number | null;
  valB: number | null;
  acronymA: string;
  acronymB: string;
  unit: string;
  isSpeed?: boolean;
}) {
  if (valA === null || valB === null) {
    return (
      <div className="bg-slate-800/40 rounded-lg p-2 border border-white/5 text-center">
        <span className="text-[10px] text-slate-500 uppercase">{label}</span>
        <span className="block text-slate-500 font-mono mt-0.5">-</span>
      </div>
    );
  }

  const delta = isSpeed ? valA - valB : valA - valB;
  const isFasterA = isSpeed ? delta > 0 : delta < 0;
  const isFasterB = isSpeed ? delta < 0 : delta > 0;
  const absDelta = Math.abs(delta);

  const leaderAcronym = isFasterA ? acronymA : isFasterB ? acronymB : '=';

  return (
    <div className="bg-slate-800/40 rounded-lg p-2 border border-white/5 flex flex-col items-center justify-center text-center">
      <span className="text-[10px] text-slate-400 uppercase font-medium">{label}</span>
      <div className="flex items-center gap-1.5 mt-0.5">
        <span className="font-mono font-bold text-white text-xs">
          {absDelta.toFixed(isSpeed ? 1 : 3)} {unit}
        </span>
        <span
          className={`text-[10px] font-racing font-bold px-1 py-0.2 rounded ${
            isFasterA
              ? 'bg-blue-900/60 text-blue-300 border border-blue-500/30'
              : isFasterB
              ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-500/30'
              : 'text-slate-400'
          }`}
        >
          {leaderAcronym}
        </span>
      </div>
    </div>
  );
}
