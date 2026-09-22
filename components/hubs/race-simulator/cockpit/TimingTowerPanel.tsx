'use client';

/**
 * components/hubs/race-simulator/cockpit/TimingTowerPanel.tsx
 * Column 1 (Left): Perpetual 22-Car FIA Live Timing Tower
 */

import React from 'react';
import { Users } from 'lucide-react';
import {
  TYRE_PROPERTIES,
  type ChallengeScenario,
  type SimSnapshot,
} from '@/lib/raceSimulationEngine';

export interface TimingTowerPanelProps {
  mobileConsoleView: 'tower' | 'monitor' | 'comms';
  timingTowerMode: 'gap' | 'int';
  setTimingTowerMode: (mode: 'gap' | 'int') => void;
  currentSnapshot?: SimSnapshot | null;
  activeScenario: ChallengeScenario;
  lapProgressPct: number;
}

export const TimingTowerPanel: React.FC<TimingTowerPanelProps> = ({
  mobileConsoleView,
  timingTowerMode,
  setTimingTowerMode,
  currentSnapshot,
  activeScenario,
  lapProgressPct,
}) => {
  const allCars = currentSnapshot?.cars || [];

  const renderCarCard = (car: typeof allCars[0]) => {
    const isTarget = car.code === activeScenario.playerConfig.code;
    const isTeammate = car.code === activeScenario.teammateConfig.code;
    const tyreProp = TYRE_PROPERTIES[car.tyreCompound];
    const isOvrWindow = car.position > 1 && car.gapToAhead <= 1.0;
    const isRetired = !!car.isRetired;

    const effectiveLapTime = currentSnapshot?.isSC
      ? Math.max(60, activeScenario.circuit.baseLapTime * 1.42)
      : Math.max(60, activeScenario.circuit.baseLapTime);
    const pitLossSec = currentSnapshot?.isSC ? 11.5 : 22.0;
    const effectiveGap = car.isPitting ? Math.max(0, car.gapToLeader - pitLossSec) : car.gapToLeader;
    const carTrackPct = ((lapProgressPct - (effectiveGap / effectiveLapTime) * 100) % 100 + 100) % 100;
    const isCarInPit = car.isPitting && (carTrackPct >= 90.0 || carTrackPct <= 4.0);
    const isCarOut = car.isPitting && (carTrackPct > 4.0 && carTrackPct <= 12.0);
    const isCarInLap = car.isPitting && (carTrackPct >= 78.0 && carTrackPct < 90.0);

    return (
      <div
        key={car.code}
        className={`px-1.5 py-1 rounded-lg flex items-center justify-between text-xs transition-all ${
          isRetired
            ? 'opacity-40 bg-slate-950/40 text-slate-500 border border-transparent'
            : isTarget
            ? 'bg-gradient-to-r from-red-950/90 via-red-900/30 to-slate-900 border border-red-500 shadow-sm ring-1 ring-red-400/40'
            : isTeammate
            ? 'bg-gradient-to-r from-emerald-950/70 via-emerald-900/20 to-slate-900 border border-emerald-500/50 shadow-sm'
            : 'bg-slate-900/80 hover:bg-slate-800/80 border border-white/5'
        }`}
      >
        {/* Left: Position, Team Stripe, Driver Code (Large), Target/Teammate Tag */}
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="w-[18px] text-right font-racing font-bold text-[10px] text-slate-400 tracking-tight shrink-0">
            {isRetired ? '-' : car.position}
          </span>
          <div
            className="w-0.5 h-3.5 rounded-full shrink-0"
            style={{ backgroundColor: isRetired ? '#475569' : car.color }}
          />
          <div className="flex items-center gap-1 flex-nowrap shrink-0">
            <span
              className={`font-mono font-black text-[12px] tracking-tight ${
                isRetired ? 'text-slate-500 line-through' : 'text-white'
              }`}
            >
              {car.code}
            </span>
          </div>
        </div>

        {/* Right: OVR, Tyre Compound, Gap / PIT / OUT */}
        <div className="flex items-center gap-1 font-mono shrink-0">
          {/* 2026 Manual Override Mode (OVR) Indicator */}
          {!isRetired && isOvrWindow && !car.isPitting && (
            <span
              className="text-[7px] font-mono font-bold text-cyan-400/80 shrink-0 leading-none"
              title="Manual Override Mode (2026年規定: 1秒以内追従時350kW電力ブースト)"
            >
              OVR
            </span>
          )}

          {/* Official Pirelli Tyre Badge & Age */}
          {!isRetired && (
            <div className="flex items-center gap-0.5 shrink-0 font-mono">
              <span
                className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[7.5px] font-black leading-none shadow-sm ${
                  car.tyreCompound === 'SOFT'
                    ? 'bg-[#FF1801] text-white'
                    : car.tyreCompound === 'MEDIUM'
                    ? 'bg-[#FFF500] text-black font-black'
                    : car.tyreCompound === 'HARD'
                    ? 'bg-[#FFFFFF] text-black font-black'
                    : car.tyreCompound === 'INTER'
                    ? 'bg-[#39B54A] text-white font-black'
                    : 'bg-[#00A0DE] text-white font-black'
                }`}
                title={`${car.tyreCompound} - Lap ${car.tyreAge} (${car.tyreWearPercent}% wear)`}
              >
                {car.tyreCompound[0]}
              </span>
              <span className="text-[8px] text-slate-400 font-bold tabular-nums">
                {car.tyreAge}
              </span>
            </div>
          )}

          {/* Gap / Interval / PIT / OUT Column */}
          <div className="text-right min-w-[36px]">
            {isRetired ? (
              <span className="px-1.5 py-0.2 rounded bg-rose-950/80 border border-rose-500/40 text-rose-300 text-[7.5px] font-mono font-extrabold tracking-wider inline-block">
                OUT
              </span>
            ) : isCarInPit ? (
              <span className="px-1 py-0.2 rounded bg-amber-500 text-slate-950 text-[7.5px] font-mono font-extrabold tracking-wider animate-pulse inline-block">
                PIT
              </span>
            ) : isCarOut ? (
              <span className="px-1 py-0.2 rounded bg-emerald-500 text-slate-950 text-[7.5px] font-mono font-extrabold tracking-wider inline-block">
                OUT
              </span>
            ) : isCarInLap ? (
              <span className="px-1 py-0.2 rounded bg-amber-600/90 text-amber-100 text-[7.5px] font-mono font-extrabold tracking-wider inline-block">
                IN-LAP
              </span>
            ) : timingTowerMode === 'gap' ? (
              <span className="font-bold text-white text-[10.5px] sm:text-[11px] tabular-nums font-mono tracking-tight leading-none">
                {car.position === 1 ? 'LEAD' : `+${car.gapToLeader.toFixed(1)}`}
              </span>
            ) : (
              <span className="font-bold text-white text-[10.5px] sm:text-[11px] tabular-nums font-mono tracking-tight leading-none">
                {car.position === 1 ? 'LEAD' : `Δ${car.gapToAhead.toFixed(1)}`}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`w-full ${mobileConsoleView === 'tower' ? 'block' : 'hidden lg:block'}`}>
      <div className="glass-card-premium p-1.5 sm:p-2 rounded-xl border border-white/10 space-y-1">
        {/* Header & Mode Switcher */}
        <div className="flex items-center justify-between gap-1 pb-1 border-b border-white/10">
          <div className="flex items-center gap-1.5 shrink-0">
            <Users className="w-3 h-3 text-cyan-400 shrink-0" />
            <span className="font-racing font-bold text-[11px] text-white tracking-wide">
              TIMING TOWER
            </span>
          </div>
          {/* Mode Switcher: GAP vs INT */}
          <div className="flex items-center gap-1 shrink-0">
            <div className="bg-slate-950 p-0.5 rounded border border-white/10 flex items-center gap-0.5 text-[8.5px] font-mono">
              <button
                type="button"
                onClick={() => setTimingTowerMode('gap')}
                className={`px-1.5 py-0.5 rounded font-bold transition-all ${
                  timingTowerMode === 'gap'
                    ? 'bg-cyan-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="首位とのギャップ (GAP / 秒)"
              >
                GAP
              </button>
              <button
                type="button"
                onClick={() => setTimingTowerMode('int')}
                className={`px-1.5 py-0.5 rounded font-bold transition-all ${
                  timingTowerMode === 'int'
                    ? 'bg-cyan-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="前車とのインターバル (INTERVAL / 秒)"
              >
                INT
              </button>
            </div>
          </div>
        </div>

        {/* 22-Car Timing Rows: Clean Professional Column */}
        <div className="space-y-0.5 max-h-[580px] overflow-y-auto pr-0.5">
          {allCars.map((car) => (
            <React.Fragment key={car.code}>
              {renderCarCard(car)}
              {car.position === 10 && (
                <div
                  className="flex items-center gap-1 my-0.5 px-0.5 select-none"
                  title="入賞圏内ボーダーライン (P10: 1pt獲得)"
                >
                  <div className="h-px flex-1 min-w-[6px] border-t border-dashed border-amber-500/40" />
                  <span className="text-[7px] font-racing font-bold text-amber-400/90 tracking-wider whitespace-nowrap px-1 py-0.2 rounded bg-amber-950/40 border border-amber-500/30 shrink-0">
                    PTS CUTOFF (P10)
                  </span>
                  <div className="h-px flex-1 min-w-[6px] border-t border-dashed border-amber-500/40" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TimingTowerPanel;
