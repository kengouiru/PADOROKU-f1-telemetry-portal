'use client';

/**
 * components/regulations/Regulations2026SimulatorSuite.tsx
 * 🚀 Complete 2026 Next-Gen Formula 1 Interactive Engineering Simulator Suite
 * Houses:
 * 1. Active Aerodynamics (X-Mode vs Z-Mode)
 * 2. 50:50 Power Unit Revolution (ICE 400kW + MGU-K 350kW)
 * 3. Manual Override Mode (MOM Velocity Taper Overtake)
 * 4. Nimble Car Chassis Downsizing (-200mm, -100mm, -30kg)
 */

import React, { useState } from 'react';
import ActiveAeroVisualizer from './ActiveAeroVisualizer';
import NextGenPowerUnitVisualizer from './NextGenPowerUnitVisualizer';
import ManualOverrideVisualizer from './ManualOverrideVisualizer';
import ChassisDownsizingVisualizer from './ChassisDownsizingVisualizer';

export type SimulatorTab = 'aero' | 'pu' | 'mom' | 'chassis';

export default function Regulations2026SimulatorSuite() {
  const [activeSimTab, setActiveSimTab] = useState<SimulatorTab>('aero');

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* Top Simulator Selection Strip */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-red-950/30 p-2 md:p-3 rounded-2xl border border-red-500/30 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2 px-2">
          <span className="text-lg">🚀</span>
          <div>
            <div className="text-xs font-racing font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span>2026 NEXT-GEN INTERACTIVE LAB</span>
              <span className="px-1.5 py-0.2 rounded bg-red-500/20 text-red-400 border border-red-500/30 text-[9px] font-mono">
                FIA公式数値準拠
              </span>
            </div>
            <div className="text-[11px] text-slate-400">
              文章だけでなく、動く図解とスライダーで2026年大改革の真髄を体験
            </div>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 bg-slate-950/80 p-1.5 rounded-xl border border-white/10">
          <button
            type="button"
            onClick={() => setActiveSimTab('aero')}
            className={`px-3 py-2 rounded-lg text-xs font-racing font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeSimTab === 'aero'
                ? 'bg-sky-600 text-white shadow-md shadow-sky-500/30 ring-1 ring-sky-300'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <span>💨</span>
            <span>可変空力 (X/Z)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSimTab('pu')}
            className={`px-3 py-2 rounded-lg text-xs font-racing font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeSimTab === 'pu'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-500/30 ring-1 ring-amber-300'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <span>⚡</span>
            <span>50:50 PU革命</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSimTab('mom')}
            className={`px-3 py-2 rounded-lg text-xs font-racing font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeSimTab === 'mom'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-500/30 ring-1 ring-purple-300'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <span>🎯</span>
            <span>MOM 追い抜き</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSimTab('chassis')}
            className={`px-3 py-2 rounded-lg text-xs font-racing font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeSimTab === 'chassis'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/30 ring-1 ring-emerald-300'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <span>📐</span>
            <span>車体小型化</span>
          </button>
        </div>
      </div>

      {/* Simulator Component View */}
      <div className="transition-all duration-300">
        {activeSimTab === 'aero' && <ActiveAeroVisualizer />}
        {activeSimTab === 'pu' && <NextGenPowerUnitVisualizer />}
        {activeSimTab === 'mom' && <ManualOverrideVisualizer />}
        {activeSimTab === 'chassis' && <ChassisDownsizingVisualizer />}
      </div>
    </div>
  );
}
