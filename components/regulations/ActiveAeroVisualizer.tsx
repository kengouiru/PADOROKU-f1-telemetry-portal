'use client';

/**
 * components/regulations/ActiveAeroVisualizer.tsx
 * 🏎️ 2026 FIA Active Aerodynamics (X-Mode vs Z-Mode) Interactive Visualizer
 * High-precision engineering simulator demonstrating:
 * - Active front wing and rear wing flap deflection
 * - Drag reduction (-55%) & Top Speed delta (+25 km/h)
 * - Cornering downforce (Z-Mode) vs Straightline low-drag (X-Mode)
 * - Mathematical aerodynamic force calculations at variable speeds
 */

import React, { useState, useMemo } from 'react';

type AeroMode = 'Z-MODE' | 'X-MODE';

export default function ActiveAeroVisualizer() {
  const [mode, setMode] = useState<AeroMode>('Z-MODE');
  const [simSpeed, setSimSpeed] = useState<number>(280); // km/h
  const [showAirflow, setShowAirflow] = useState<boolean>(true);

  // Aerodynamic coefficients & calculations
  // Reference: FIA 2026 Technical Regulations & Aerodynamic Simulation Models
  const isZMode = mode === 'Z-MODE';

  const stats = useMemo(() => {
    // Air density at 20°C sea level: ~1.205 kg/m^3
    const rho = 1.205;
    const v = simSpeed / 3.6; // m/s
    const q = 0.5 * rho * v * v; // Dynamic pressure (Pa)

    // Base aero coefficients
    const cL = isZMode ? 3.4 : 1.53; // Downforce coefficient (~55% drop in X-Mode)
    const cD = isZMode ? 1.05 : 0.472; // Drag coefficient (~55% drag reduction in X-Mode)
    const refArea = 1.45; // m^2 frontal area

    const downforceN = q * cL * refArea;
    const downforceKg = Math.round(downforceN / 9.80665);
    const dragN = Math.round(q * cD * refArea);

    const wingFrontAngle = isZMode ? 32 : 8; // degrees
    const wingRearAngle = isZMode ? 36 : 5; // degrees

    const topSpeedEstimate = isZMode ? 330 : 355; // km/h on 1km straight
    const dragReductionPct = 55;

    return {
      downforceKg,
      dragN,
      wingFrontAngle,
      wingRearAngle,
      topSpeedEstimate,
      dragReductionPct,
      cL: cL.toFixed(2),
      cD: cD.toFixed(3),
    };
  }, [isZMode, simSpeed]);

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-sky-500/30 overflow-hidden shadow-2xl p-5 md:p-6 space-y-6">
      {/* ── Title & Status Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-400 border border-sky-500/30 text-[10px] font-mono font-bold tracking-wider">
              FIA 2026 ACTIVE AERO SIMULATOR
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              可変空力デバイス（DRS廃止・前後連動フラップ）
            </span>
          </div>
          <h3 className="text-xl font-racing font-black text-white tracking-wide flex items-center gap-2">
            <span>アクティブ・エアロダイナミクス可変シミュレーター</span>
          </h3>
        </div>

        {/* Mode Switcher Buttons */}
        <div className="flex items-center p-1 bg-slate-950/80 rounded-xl border border-white/10 self-start sm:self-auto shadow-inner">
          <button
            type="button"
            onClick={() => setMode('Z-MODE')}
            className={`px-4 py-2 rounded-lg text-xs font-racing font-bold transition-all flex items-center gap-2 ${
              isZMode
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/40 ring-1 ring-blue-400'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <span>🛡️ Z-MODE</span>
            <span className="text-[10px] opacity-80 font-mono font-normal">(旋回/高ダウンフォース)</span>
          </button>
          <button
            type="button"
            onClick={() => setMode('X-MODE')}
            className={`px-4 py-2 rounded-lg text-xs font-racing font-bold transition-all flex items-center gap-2 ${
              !isZMode
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/40 ring-1 ring-emerald-300'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <span>🚀 X-MODE</span>
            <span className="text-[10px] opacity-80 font-mono font-normal">(直線/低ドラッグ)</span>
          </button>
        </div>
      </div>

      {/* ── Mode Description Strip ── */}
      <div
        className={`p-3.5 rounded-xl border transition-all ${
          isZMode
            ? 'bg-blue-950/30 border-blue-500/30 text-blue-200'
            : 'bg-emerald-950/30 border-emerald-500/30 text-emerald-200'
        }`}
      >
        <div className="flex items-start gap-3">
          <span className="text-xl mt-0.5">{isZMode ? '🌀' : '⚡'}</span>
          <div className="text-xs space-y-1">
            <div className="font-bold flex items-center gap-2">
              <span className="font-mono text-sm">{mode}:</span>
              <span>
                {isZMode
                  ? 'コーナリング旋回モード（前後ウイング最大迎角・常時高ダウンフォース）'
                  : 'ストレート低ドラッグモード（空気抵抗 -55% 削減・前後フラップ同時開放）'}
              </span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              {isZMode
                ? 'コーナー区間で旋回Gとタイヤ接地荷重を最大化。前後のアクティブフラップを立てて高いダウンフォースを発生させ、高速コーナーで5G超の圧倒的旋回グリップを確保します。'
                : 'DRSに代わり、先行車・後続車の区別なくストレート区間で発動可能。リアウイングだけでなくフロントフラップも同時に寝かせることで、極限の空力前後バランスを保ったままドラッグを55%削減します。'}
            </p>
          </div>
        </div>
      </div>

      {/* ── Visual Animated Diagram (SVG Car Silhouette & Wings) ── */}
      <div className="relative bg-slate-950/90 rounded-2xl border border-white/10 p-4 md:p-6 overflow-hidden">
        {/* Controls Overlay */}
        <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowAirflow(!showAirflow)}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-mono border transition-all ${
              showAirflow
                ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                : 'bg-slate-800/80 text-slate-400 border-white/10'
            }`}
          >
            {showAirflow ? '気流パーティクル: ON' : '気流パーティクル: OFF'}
          </button>
        </div>

        {/* Dynamic Canvas Container */}
        <div className="w-full flex flex-col items-center justify-center">
          <svg
            viewBox="0 0 800 280"
            className="w-full max-w-3xl h-auto drop-shadow-xl"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="carBodyGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#1e293b" />
                <stop offset="50%" stopColor="#334155" />
                <stop offset="100%" stopColor="#0f172a" />
              </linearGradient>

              <linearGradient id="flowZGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(56, 189, 248, 0.8)" />
                <stop offset="100%" stopColor="rgba(99, 102, 241, 0.2)" />
              </linearGradient>

              <linearGradient id="flowXGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(52, 211, 153, 0.9)" />
                <stop offset="100%" stopColor="rgba(20, 184, 166, 0.3)" />
              </linearGradient>
            </defs>

            {/* Track / Ground Plane */}
            <line x1="20" y1="250" x2="780" y2="250" stroke="#334155" strokeWidth="2" strokeDasharray="6 6" />
            <text x="750" y="244" fill="#64748b" fontSize="10" fontFamily="monospace" textAnchor="end">
              ROAD SURFACE (GROUND EFFECT FLOOR)
            </text>

            {/* ── Animated Airflow Streamlines ── */}
            {showAirflow && (
              <g className="airflow-vectors opacity-80">
                {/* Upper Streamline */}
                <path
                  d={
                    isZMode
                      ? 'M 30 110 Q 220 80 400 95 Q 560 110 650 60 Q 700 45 780 140'
                      : 'M 30 110 Q 220 90 400 95 Q 560 98 670 100 Q 720 102 780 105'
                  }
                  fill="none"
                  stroke={isZMode ? 'url(#flowZGrad)' : 'url(#flowXGrad)'}
                  strokeWidth={isZMode ? '3' : '2'}
                  strokeDasharray={isZMode ? '8 6' : '16 6'}
                  className="animate-flow"
                >
                  <animate
                    attributeName="stroke-dashoffset"
                    values="100;0"
                    dur={isZMode ? '1.2s' : '0.6s'}
                    repeatCount="indefinite"
                  />
                </path>

                {/* Mid Streamline over Cockpit & Airbox */}
                <path
                  d={
                    isZMode
                      ? 'M 30 140 Q 240 120 440 115 Q 580 115 655 85 Q 710 70 780 170'
                      : 'M 30 140 Q 240 135 440 125 Q 580 120 670 118 Q 720 118 780 120'
                  }
                  fill="none"
                  stroke={isZMode ? 'url(#flowZGrad)' : 'url(#flowXGrad)'}
                  strokeWidth={isZMode ? '4' : '2'}
                  strokeDasharray={isZMode ? '10 6' : '18 6'}
                >
                  <animate
                    attributeName="stroke-dashoffset"
                    values="120;0"
                    dur={isZMode ? '1.1s' : '0.5s'}
                    repeatCount="indefinite"
                  />
                </path>

                {/* Lower Streamline through Underfloor Venturi Tunnels */}
                <path
                  d="M 30 230 Q 220 230 400 235 Q 580 238 680 220 Q 730 200 780 185"
                  fill="none"
                  stroke={isZMode ? '#38bdf8' : '#34d399'}
                  strokeWidth="2.5"
                  strokeDasharray="12 6"
                >
                  <animate
                    attributeName="stroke-dashoffset"
                    values="100;0"
                    dur={isZMode ? '1.4s' : '0.8s'}
                    repeatCount="indefinite"
                  />
                </path>

                {/* Z-Mode High Downforce Vortices (Turbulent Drag) */}
                {isZMode && (
                  <g className="downforce-indicators" opacity="0.9">
                    {/* Rear Downforce Arrow */}
                    <path d="M 680 50 L 680 120 M 670 105 L 680 120 L 690 105" stroke="#ef4444" strokeWidth="3" fill="none" />
                    <text x="695" y="90" fill="#f87171" fontSize="11" fontFamily="monospace" fontWeight="bold">
                      極大リアダウンフォース
                    </text>

                    {/* Front Downforce Arrow */}
                    <path d="M 170 110 L 170 170 M 162 155 L 170 170 L 178 155" stroke="#ef4444" strokeWidth="2.5" fill="none" />
                    <text x="110" y="100" fill="#f87171" fontSize="10" fontFamily="monospace" fontWeight="bold">
                      フロント荷重
                    </text>
                  </g>
                )}

                {/* X-Mode Slipstream Straight Arrow */}
                {!isZMode && (
                  <g className="speed-indicators" opacity="0.9">
                    <path d="M 690 110 L 760 110 M 745 102 L 760 110 L 745 118" stroke="#10b981" strokeWidth="3" fill="none" />
                    <text x="690" y="95" fill="#34d399" fontSize="11" fontFamily="monospace" fontWeight="bold">
                      -55% 低ドラッグ加速
                    </text>
                  </g>
                )}
              </g>
            )}

            {/* ── Car Chassis Side Silhouette ── */}
            {/* Nosecone & Front Wing Main Plane */}
            <path
              d="M 100 220 L 150 215 L 250 190 L 320 185 L 360 150 L 440 145 L 530 155 L 630 175 L 700 185 L 710 225 L 100 225 Z"
              fill="url(#carBodyGrad)"
              stroke="#475569"
              strokeWidth="2"
            />

            {/* Cockpit Halo & Driver Helmet */}
            <circle cx="390" cy="165" r="14" fill="#fbbf24" stroke="#d97706" strokeWidth="2" />
            <path d="M 370 170 Q 400 155 430 175" fill="none" stroke="#94a3b8" strokeWidth="4" strokeLinecap="round" />

            {/* Wheels (2026: 18-inch wheels with slightly narrower tyres) */}
            {/* Front Wheel */}
            <circle cx="210" cy="225" r="32" fill="#0f172a" stroke="#64748b" strokeWidth="5" />
            <circle cx="210" cy="225" r="16" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />
            <circle cx="210" cy="225" r="5" fill="#e2e8f0" />

            {/* Rear Wheel */}
            <circle cx="610" cy="225" r="34" fill="#0f172a" stroke="#64748b" strokeWidth="5" />
            <circle cx="610" cy="225" r="16" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />
            <circle cx="610" cy="225" r="5" fill="#e2e8f0" />

            {/* ── Active Front Wing Flap (Rotates!) ── */}
            <g transform="translate(130, 205)">
              <g
                transform={`rotate(${isZMode ? -24 : -4})`}
                style={{ transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)' }}
              >
                {/* Front Active Flap Element */}
                <rect x="-25" y="-3" width="30" height="6" rx="2" fill={isZMode ? '#38bdf8' : '#34d399'} stroke="#fff" strokeWidth="1" />
              </g>
              {/* Front Endplate & Wing Base */}
              <rect x="-35" y="-12" width="6" height="24" rx="2" fill="#64748b" />
              <text x="-40" y="32" fill="#94a3b8" fontSize="9" fontFamily="monospace">
                FW Flap: {stats.wingFrontAngle}°
              </text>
            </g>

            {/* ── Active Rear Wing (Rotates & Flattens!) ── */}
            <g transform="translate(685, 125)">
              {/* Rear Endplate Pillar */}
              <path d="M -15 95 L -5 0 L 20 0 L 15 95 Z" fill="#334155" stroke="#475569" strokeWidth="1" />
              
              {/* Lower Main Beam (Fixed) */}
              <rect x="-18" y="25" width="45" height="6" rx="2" fill="#475569" />

              {/* Upper Active Flap (Movable) */}
              <g
                transform={`rotate(${isZMode ? -34 : -6})`}
                style={{ transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)' }}
              >
                <rect
                  x="-20"
                  y="-5"
                  width="48"
                  height="8"
                  rx="2"
                  fill={isZMode ? '#60a5fa' : '#34d399'}
                  stroke="#ffffff"
                  strokeWidth="1.5"
                  className="drop-shadow-md"
                />
              </g>
              <text x="-35" y="-15" fill={isZMode ? '#93c5fd' : '#6ee7b7'} fontSize="10" fontFamily="monospace" fontWeight="bold">
                RW Upper: {stats.wingRearAngle}°
              </text>
            </g>
          </svg>
        </div>

        {/* Wing Actuator Status Callout */}
        <div className="flex flex-wrap items-center justify-between gap-2 mt-4 pt-3 border-t border-white/10 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-300">前後フラップ同期油圧アクチュエーター: 正常同調稼働中</span>
          </div>
          <div className="text-slate-400">
            フェイルセーフ規定: <span className="text-amber-300">アクチュエーター失陥時は即座にZ-Modeへ安全復帰</span>
          </div>
        </div>
      </div>

      {/* ── Real-time Aero Metrics & Interactive Speed Slider ── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-bold text-slate-300 flex items-center gap-1.5">
            <span>🎛️ 車速シミュレーションスライダー:</span>
            <span className="text-sky-400 text-sm font-racing">{simSpeed} km/h</span>
          </span>
          <span className="text-[11px] text-slate-400 font-mono">
            {simSpeed < 180 ? '低速〜中速コーナー区間' : simSpeed < 280 ? '高速コーナー区間' : 'メインストレート超高速域'}
          </span>
        </div>

        <input
          type="range"
          min={100}
          max={360}
          step={5}
          value={simSpeed}
          onChange={(e) => setSimSpeed(Number(e.target.value))}
          className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-400"
        />

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
          {/* Downforce */}
          <div className="bg-slate-950/70 p-3.5 rounded-xl border border-white/10">
            <div className="text-[10px] font-mono text-slate-400 mb-1 flex items-center justify-between">
              <span>実ダウンフォース荷重</span>
              <span className="text-xs">{isZMode ? '🌀' : '📉'}</span>
            </div>
            <div className="text-xl font-racing font-bold text-white">
              {stats.downforceKg.toLocaleString()} <span className="text-xs text-slate-400 font-mono">kgf</span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono mt-1">
              CL係数: {stats.cL} ({isZMode ? '旋回最大化' : '-55% 開放'})
            </div>
          </div>

          {/* Drag Force */}
          <div className="bg-slate-950/70 p-3.5 rounded-xl border border-white/10">
            <div className="text-[10px] font-mono text-slate-400 mb-1 flex items-center justify-between">
              <span>空気抵抗 (Drag Force)</span>
              <span className="text-xs">{isZMode ? '🛑' : '⚡'}</span>
            </div>
            <div className={`text-xl font-racing font-bold ${isZMode ? 'text-amber-400' : 'text-emerald-400'}`}>
              {stats.dragN.toLocaleString()} <span className="text-xs text-slate-400 font-mono">N</span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono mt-1">
              CD係数: {stats.cD} ({isZMode ? '標準抵抗' : 'ドラッグ -55%'})
            </div>
          </div>

          {/* Top Speed Delta */}
          <div className="bg-slate-950/70 p-3.5 rounded-xl border border-white/10">
            <div className="text-[10px] font-mono text-slate-400 mb-1 flex items-center justify-between">
              <span>ストレート最高速予測</span>
              <span className="text-xs">🏁</span>
            </div>
            <div className="text-xl font-racing font-bold text-sky-400">
              {stats.topSpeedEstimate} <span className="text-xs text-slate-400 font-mono">km/h</span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono mt-1">
              デルタ: {isZMode ? '基準値' : '+25 km/h アドバンテージ'}
            </div>
          </div>

          {/* DRS Replacement Note */}
          <div className="bg-slate-950/70 p-3.5 rounded-xl border border-white/10">
            <div className="text-[10px] font-mono text-slate-400 mb-1 flex items-center justify-between">
              <span>DRSシステムとの比較</span>
              <span className="text-xs">⚖️</span>
            </div>
            <div className="text-sm font-racing font-bold text-purple-300 mt-1">
              全車自由展開型
            </div>
            <div className="text-[10px] text-slate-400 font-mono mt-1">
              1秒以内条件なし (先行車も使用可能)
            </div>
          </div>
        </div>
      </div>

      {/* ── Engineering Deep-Dive Q&A for Connoisseurs ── */}
      <div className="bg-slate-950/60 rounded-xl p-4 border border-white/5 space-y-2.5 text-xs text-slate-300">
        <div className="font-bold text-amber-300 font-mono text-sm flex items-center gap-1.5">
          <span>🧠</span>
          <span>玄人向け工学解説：なぜリアだけでなく「フロントウイングも可変」なのか？</span>
        </div>
        <p className="leading-relaxed text-slate-300">
          2025年までのDRSはリアウイングの上部フラップのみを開いていました。しかし2026年規定で求められる55%もの巨大なドラッグ削減をリアウイング単体で行うと、
          <strong>「ダウンフォースの前後バランス（空力中心・Aero Balance）が急激に前輪へ70%以上偏る」</strong>という致命的な危険が生じます。
          ストレートの時速300km/h超から減速する際、強烈なオーバーステアが発生してマシンがスピンするリスクがあるため、
          <strong>FIAはフロントウイングフラップも同時に連動して寝かせる（ダウンフォースを前後同時に均等削減する）義務付け</strong>を行いました。
        </p>
      </div>
    </div>
  );
}
