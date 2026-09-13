'use client';

/**
 * components/regulations/ManualOverrideVisualizer.tsx
 * 🎯 2026 FIA Manual Override Mode (MOM) Interactive Visualizer
 * High-precision engineering simulator of the DRS replacement system:
 * - Velocity vs Electrical Output Taper Curve (290 km/h vs 337 km/h)
 * - Real-time power delta calculation (+160kW ~ +250kW advantage)
 * - Interactive 1,000m straightline drag race overtake simulator
 * - FIA Article 5.4.8 compliance rules
 */

import React, { useState, useMemo, useEffect } from 'react';

export default function ManualOverrideVisualizer() {
  const [inspectSpeed, setInspectSpeed] = useState<number>(320); // km/h
  const [isSimulatingRace, setIsSimulatingRace] = useState<boolean>(false);
  const [raceProgress, setRaceProgress] = useState<number>(0); // 0 to 100%

  // Calculate MGU-K output based on speed (FIA 2026 Regulations)
  const calculatePower = (speed: number, isMOM: boolean) => {
    if (speed < 290) return 350;

    if (!isMOM) {
      // Standard Taper: 290 km/h to 355 km/h
      if (speed >= 355) return 0;
      const ratio = (speed - 290) / (355 - 290);
      return Math.round(350 * (1 - ratio));
    } else {
      // MOM (Manual Override Mode): Full 350kW up to 337 km/h, then steep taper to 355 km/h
      if (speed <= 337) return 350;
      if (speed >= 355) return 0;
      const ratio = (speed - 337) / (355 - 337);
      return Math.round(350 * (1 - ratio));
    }
  };

  const powerStats = useMemo(() => {
    const leaderPower = calculatePower(inspectSpeed, false);
    const momPower = calculatePower(inspectSpeed, true);
    const deltaKw = momPower - leaderPower;
    const deltaHp = Math.round(deltaKw * 1.341);

    return {
      leaderPower,
      momPower,
      deltaKw,
      deltaHp,
    };
  }, [inspectSpeed]);

  // Race Simulation Loop
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isSimulatingRace) {
      setRaceProgress(0);
      const startTime = Date.now();
      const duration = 4000; // 4 seconds straight sprint

      const interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(100, (elapsed / duration) * 100);
        setRaceProgress(progress);

        if (progress >= 100) {
          clearInterval(interval);
          setIsSimulatingRace(false);
        }
      }, 30);

      return () => clearInterval(interval);
    }
  }, [isSimulatingRace]);

  // Relative positions in race sim
  // Leader: starts 15m ahead (0.15s), accelerates at standard rate
  // MOM car: starts behind, but gains acceleration due to +200kW boost above 290km/h
  const leaderPos = 15 + raceProgress * 0.75;
  const momPos = raceProgress * 0.95;

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-purple-500/30 overflow-hidden shadow-2xl p-5 md:p-6 space-y-6">
      {/* ── Title & Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-mono font-bold tracking-wider">
              FIA 2026 OVERTAKE WEAPON
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              DRS廃止後の新オーバーテイク規定「MOM」
            </span>
          </div>
          <h3 className="text-xl font-racing font-black text-white tracking-wide">
            マニュアル・オーバーライド・モード（MOM）電力減衰シミュレーター
          </h3>
        </div>

        <div className="px-3.5 py-1.5 rounded-xl bg-purple-950/50 border border-purple-500/30 text-xs font-mono text-purple-300">
          作動条件: <strong className="text-white">検知ポイントで先行車と1.0秒以内</strong>
        </div>
      </div>

      {/* ── Core Concept Strip ── */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-purple-950/40 via-slate-900 to-slate-950 border border-purple-500/30 text-xs space-y-2">
        <div className="flex items-center gap-2 font-bold text-purple-300 font-mono text-sm">
          <span>🎯</span>
          <span>MOM（Manual Override Mode）とは？</span>
        </div>
        <p className="text-slate-300 leading-relaxed text-[11px]">
          2026年からは全車がストレートでX-Mode（低ドラッグ空力）を使えるため、従来の「ウイングを開けるDRS」ではオーバーテイク差が生まれません。
          そこでFIAは<strong>「電気モーターの出力テーパー減衰速度」</strong>に格差を設ける新システムを導入しました。
          先行車は<strong>時速290km/hを超えると電力が漸減</strong>しますが、1秒以内に迫る追従車はMOMを発動することで<strong>時速337km/hまで350kWフルパワーを維持</strong>し、猛烈な追い抜き加速を得られます。
        </p>
      </div>

      {/* ── Interactive Velocity vs Electrical Power SVG Graph ── */}
      <div className="bg-slate-950/90 rounded-2xl border border-white/10 p-4 md:p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs font-mono font-bold text-white flex items-center gap-2">
            <span>📈 車速 vs MGU-K電力供給テーパー曲線（FIA公式規定ライン）</span>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-1.5 bg-slate-400 rounded-full" />
              <span className="text-slate-400">先行車 (290km/hから減衰)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-1.5 bg-purple-400 rounded-full shadow-sm shadow-purple-500" />
              <span className="text-purple-300 font-bold">MOM追従車 (337km/hまで350kW維持)</span>
            </div>
          </div>
        </div>

        {/* SVG Graph */}
        <div className="w-full flex justify-center">
          <svg viewBox="0 0 740 260" className="w-full max-w-3xl h-auto" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="momAdvantageArea" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgba(168, 85, 247, 0.4)" />
                <stop offset="100%" stopColor="rgba(168, 85, 247, 0.05)" />
              </linearGradient>
            </defs>

            {/* Grid Lines */}
            <line x1="60" y1="210" x2="700" y2="210" stroke="#334155" strokeWidth="1.5" />
            <line x1="60" y1="40" x2="60" y2="210" stroke="#334155" strokeWidth="1.5" />

            {/* Horizontal Grid */}
            <line x1="60" y1="50" x2="700" y2="50" stroke="#1e293b" strokeDasharray="4 4" />
            <text x="50" y="54" fill="#94a3b8" fontSize="10" fontFamily="monospace" textAnchor="end">350kW</text>

            <line x1="60" y1="95" x2="700" y2="95" stroke="#1e293b" strokeDasharray="4 4" />
            <text x="50" y="99" fill="#94a3b8" fontSize="10" fontFamily="monospace" textAnchor="end">250kW</text>

            <line x1="60" y1="140" x2="700" y2="140" stroke="#1e293b" strokeDasharray="4 4" />
            <text x="50" y="144" fill="#94a3b8" fontSize="10" fontFamily="monospace" textAnchor="end">150kW</text>

            <line x1="60" y1="210" x2="700" y2="210" stroke="#334155" strokeWidth="1.5" />
            <text x="50" y="214" fill="#94a3b8" fontSize="10" fontFamily="monospace" textAnchor="end">0kW</text>

            {/* X-Axis Speed Labels */}
            {/* 250km/h: x=60, 290km/h: x=240, 337km/h: x=510, 355km/h: x=640, 360km/h: x=680 */}
            <text x="60" y="228" fill="#64748b" fontSize="10" fontFamily="monospace" textAnchor="middle">250</text>
            <text x="240" y="228" fill="#f59e0b" fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle">290 km/h</text>
            <text x="510" y="228" fill="#a855f7" fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle">337 km/h</text>
            <text x="640" y="228" fill="#ef4444" fontSize="10" fontFamily="monospace" textAnchor="middle">355 km/h</text>
            <text x="690" y="228" fill="#64748b" fontSize="10" fontFamily="monospace" textAnchor="middle">360</text>

            {/* Vertical Marker Lines */}
            <line x1="240" y1="50" x2="240" y2="210" stroke="#f59e0b" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
            <line x1="510" y1="50" x2="510" y2="210" stroke="#a855f7" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
            <line x1="640" y1="50" x2="640" y2="210" stroke="#ef4444" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />

            {/* MOM Advantage Shaded Area (between leader curve and MOM curve) */}
            <path
              d="M 240 50 L 510 50 L 640 210 L 240 50 Z"
              fill="url(#momAdvantageArea)"
            />
            <text x="420" y="100" fill="#d8b4fe" fontSize="11" fontFamily="racing" fontWeight="bold" textAnchor="middle">
              ⚡ MOM 超絶アドバンテージ領域 (+150〜250kW)
            </text>

            {/* Curve 1: Leader (Baseline Taper) */}
            {/* (60,50) -> (240,50) -> (640,210) */}
            <path
              d="M 60 50 L 240 50 L 640 210"
              fill="none"
              stroke="#94a3b8"
              strokeWidth="3"
            />

            {/* Curve 2: Chaser with MOM */}
            {/* (60,50) -> (510,50) -> (640,210) */}
            <path
              d="M 60 50 L 510 50 L 640 210"
              fill="none"
              stroke="#c084fc"
              strokeWidth="4"
              strokeLinecap="round"
            />

            {/* Dynamic Interactive Speed Marker */}
            {/* map inspectSpeed (250 to 360) to x (60 to 680): ratio = (speed - 250) / 110 */}
            {(() => {
              const markerX = 60 + ((inspectSpeed - 250) / 110) * (680 - 60);
              const leaderY = 50 + (1 - powerStats.leaderPower / 350) * 160;
              const momY = 50 + (1 - powerStats.momPower / 350) * 160;

              return (
                <g>
                  {/* Vertical bar */}
                  <line x1={markerX} y1="40" x2={markerX} y2="210" stroke="#38bdf8" strokeWidth="2" strokeDasharray="2 2" />

                  {/* Leader Point */}
                  <circle cx={markerX} cy={leaderY} r="5" fill="#94a3b8" stroke="#fff" strokeWidth="1.5" />

                  {/* MOM Point */}
                  <circle cx={markerX} cy={momY} r="6" fill="#a855f7" stroke="#fff" strokeWidth="2" />

                  {/* Top Badge */}
                  <rect x={markerX - 35} y="15" width="70" height="20" rx="4" fill="#0284c7" />
                  <text x={markerX} y="29" fill="#fff" fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                    {inspectSpeed} km/h
                  </text>
                </g>
              );
            })()}
          </svg>
        </div>

        {/* Speed Slider */}
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-300">
              🎛️ 車速ポインター調整: <strong className="text-sky-400 font-racing text-sm">{inspectSpeed} km/h</strong>
            </span>
            <span className="text-purple-300">
              {inspectSpeed < 290
                ? '全車等倍フルブースト区間 (差なし)'
                : inspectSpeed <= 337
                ? '⚡ MOM最大ブースト差発生区間！'
                : '超高速域テーパー収束区間'}
            </span>
          </div>
          <input
            type="range"
            min={250}
            max={360}
            step={1}
            value={inspectSpeed}
            onChange={(e) => setInspectSpeed(Number(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-400"
          />
        </div>

        {/* Real-time Delta Readout Box */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          {/* Leader Power */}
          <div className="bg-slate-900/90 p-3.5 rounded-xl border border-white/10">
            <div className="text-[10px] font-mono text-slate-400 mb-1">先行車 MGU-K 出力</div>
            <div className="text-xl font-racing font-bold text-slate-300">
              {powerStats.leaderPower} <span className="text-xs font-mono text-slate-500">kW</span>
            </div>
            <div className="text-[10px] text-slate-500 font-mono mt-0.5">
              {inspectSpeed >= 290 ? '規定テーパーにより減衰中' : 'フル出力'}
            </div>
          </div>

          {/* MOM Power */}
          <div className="bg-slate-900/90 p-3.5 rounded-xl border border-purple-500/30">
            <div className="text-[10px] font-mono text-purple-300 mb-1">MOM追従車 MGU-K 出力</div>
            <div className="text-xl font-racing font-bold text-purple-300">
              {powerStats.momPower} <span className="text-xs font-mono text-purple-400/80">kW</span>
            </div>
            <div className="text-[10px] text-purple-400 font-mono mt-0.5">
              {inspectSpeed <= 337 ? 'フル350kWブースト継続！' : '最終段階テーパー'}
            </div>
          </div>

          {/* Power Delta Advantage */}
          <div className="bg-gradient-to-br from-purple-950/60 to-slate-900 p-3.5 rounded-xl border border-purple-500/40 shadow-inner">
            <div className="text-[10px] font-mono text-amber-300 mb-1 font-bold">⚡ MOMオーバーテイク出力差</div>
            <div className="text-xl font-racing font-bold text-amber-400">
              +{powerStats.deltaKw} kW <span className="text-xs font-mono text-amber-300">({powerStats.deltaHp} 馬力差)</span>
            </div>
            <div className="text-[10px] text-slate-300 font-mono mt-0.5">
              {powerStats.deltaKw > 0 ? '圧倒的なストレート推進力' : '同等出力'}
            </div>
          </div>
        </div>
      </div>

      {/* ── 1,000m Straight Drag Race Simulation ── */}
      <div className="bg-slate-950/80 rounded-xl border border-white/10 p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="text-xs font-mono font-bold text-white flex items-center gap-2">
              <span>🏎️💨 1,000mストレート MOMオーバーテイク実走シミュレーター</span>
            </div>
            <div className="text-[11px] text-slate-400">
              先行車（白）に対し、MOMを発動した追従車（紫）が300km/h超でどう逆転するかを検証
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsSimulatingRace(true)}
            disabled={isSimulatingRace}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-racing font-bold shadow-lg shadow-purple-500/30 flex items-center gap-2 disabled:opacity-50 transition-all"
          >
            <span>🚀</span>
            <span>{isSimulatingRace ? 'ストレート激走中...' : 'MOMを発動してバトル開始'}</span>
          </button>
        </div>

        {/* Track Sprint Visualizer */}
        <div className="relative h-28 bg-slate-900 rounded-xl border border-white/10 overflow-hidden flex flex-col justify-around p-3">
          {/* Distance Markers */}
          <div className="absolute top-1 left-0 right-0 flex justify-between px-4 text-[9px] font-mono text-slate-600 pointer-events-none">
            <span>コーナー脱出 (0m)</span>
            <span>300m</span>
            <span>600m (MOM威力炸裂)</span>
            <span>900m</span>
            <span>T1ブレーキングゾーン (1000m)</span>
          </div>

          {/* Lane 1: Leading Car */}
          <div className="relative h-8 flex items-center">
            <div
              style={{ left: `${Math.min(92, leaderPos)}%` }}
              className="absolute flex items-center gap-2 transition-all duration-75"
            >
              <div className="w-12 h-6 bg-slate-200 text-slate-950 text-[10px] font-racing font-bold rounded flex items-center justify-center shadow-md border border-slate-400">
                先行車
              </div>
              <span className="text-[9px] font-mono text-slate-400">
                {raceProgress > 60 ? '減衰中 (320km/h)' : '通常加速'}
              </span>
            </div>
          </div>

          {/* Dividing Dashed Line */}
          <div className="border-t border-dashed border-white/10" />

          {/* Lane 2: Chaser with MOM */}
          <div className="relative h-8 flex items-center">
            <div
              style={{ left: `${Math.min(92, momPos)}%` }}
              className="absolute flex items-center gap-2 transition-all duration-75"
            >
              <div className="w-14 h-6 bg-gradient-to-r from-purple-600 to-pink-500 text-white text-[10px] font-racing font-bold rounded flex items-center justify-center shadow-lg shadow-purple-500/50 border border-purple-300">
                MOM⚡
              </div>
              <span className="text-[9px] font-mono text-purple-300 font-bold">
                {raceProgress > 60 ? '348km/h 猛追！' : 'スリップストリーム'}
              </span>
            </div>
          </div>
        </div>

        <div className="text-[11px] font-mono text-slate-400 flex items-center justify-between">
          <span>※ レース結果: 300km/h以上で+200kW超の出力差が生じ、ブレーキングゾーン手前で綺麗にノーズをねじ込みます。</span>
          <span className="text-purple-300 font-bold">純粋なスキル＆エネルギー配分バトル</span>
        </div>
      </div>
    </div>
  );
}
