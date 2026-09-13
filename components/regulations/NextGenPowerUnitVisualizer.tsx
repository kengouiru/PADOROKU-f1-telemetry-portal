'use client';

/**
 * components/regulations/NextGenPowerUnitVisualizer.tsx
 * ⚡ 2026 FIA Next-Gen Power Unit (50:50 Power Revolution) Interactive Visualizer
 * High-precision engineering comparison demonstrating:
 * - 50:50 ICE vs MGU-K electrical split (400kW ICE + 350kW MGU-K)
 * - Complete abolition of MGU-H
 * - 100% sustainable drop-in e-fuels & 3,000 MJ/h energy-based fuel flow
 * - 8.5 MJ/lap energy recovery capacity
 * - Dynamic throttle deploy vs heavy braking regen modes
 */

import React, { useState } from 'react';

type PUGeneration = '2026' | '2025';
type OperationState = 'DEPLOY' | 'REGEN' | 'COAST';

export default function NextGenPowerUnitVisualizer() {
  const [generation, setGeneration] = useState<PUGeneration>('2026');
  const [operation, setOperation] = useState<OperationState>('DEPLOY');

  const is2026 = generation === '2026';

  // Engineering specs comparison
  const iceKw = is2026 ? 400 : 560; // 535hp vs 750hp
  const mgukKw = is2026 ? 350 : 120; // 470hp vs 160hp
  const totalKw = iceKw + mgukKw; // ~750kW (~1005hp) vs ~680kW + MGU-H (~1000hp)
  const icePct = Math.round((iceKw / totalKw) * 100);
  const mgukPct = Math.round((mgukKw / totalKw) * 100);

  const regenMaxMj = is2026 ? 8.5 : 2.0; // MJ per lap from braking
  const fuelRate = is2026 ? '3,000 MJ/h (約70kg/h)' : '100 kg/h';
  const fuelType = is2026 ? '100% 持続可能非化石燃料 (E-Fuel)' : '10% 先進バイオ混合 (E10)';
  const mguhStatus = is2026 ? '完全廃止 (0kW / コスト半減)' : '搭載 (熱エネルギー無制限回生)';

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-amber-500/30 overflow-hidden shadow-2xl p-5 md:p-6 space-y-6">
      {/* ── Title & Generation Switcher ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-mono font-bold tracking-wider">
              2026 POWER UNIT REVOLUTION
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              内燃機関 50% : 電気モーター 50% の大変革
            </span>
          </div>
          <h3 className="text-xl font-racing font-black text-white tracking-wide">
            2026年 次世代パワーユニット（PU）比較シミュレーター
          </h3>
        </div>

        {/* Generation Toggle */}
        <div className="flex items-center p-1 bg-slate-950/80 rounded-xl border border-white/10 self-start sm:self-auto shadow-inner">
          <button
            type="button"
            onClick={() => setGeneration('2026')}
            className={`px-4 py-2 rounded-lg text-xs font-racing font-bold transition-all flex items-center gap-1.5 ${
              is2026
                ? 'bg-gradient-to-r from-amber-500 to-red-600 text-white shadow-lg shadow-amber-500/30 ring-1 ring-amber-400'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <span>🚀 2026年 新規定 (50:50)</span>
          </button>
          <button
            type="button"
            onClick={() => setGeneration('2025')}
            className={`px-4 py-2 rounded-lg text-xs font-racing font-bold transition-all flex items-center gap-1.5 ${
              !is2026
                ? 'bg-gradient-to-r from-slate-700 to-slate-600 text-white shadow-lg ring-1 ring-slate-400'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <span>現行規定 (80:20 + MGU-H)</span>
          </button>
        </div>
      </div>

      {/* ── Power Output Split Bar ── */}
      <div className="bg-slate-950/80 p-5 rounded-xl border border-white/10 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs font-mono font-bold text-slate-300">
            📊 最大システム出力配分比率（ICE vs MGU-K）:
          </span>
          <span className="text-xs font-mono text-amber-300">
            合計ピーク出力: <strong>{totalKw} kW</strong> (約 <strong>{Math.round(totalKw * 1.341)} hp / 1,000馬力超</strong>)
          </span>
        </div>

        {/* The Split Bar */}
        <div className="h-8 w-full bg-slate-900 rounded-xl overflow-hidden flex border border-white/15 p-0.5 shadow-inner">
          {/* ICE Portion */}
          <div
            style={{ width: `${icePct}%` }}
            className="h-full bg-gradient-to-r from-orange-600 to-red-600 rounded-l-lg flex items-center justify-between px-3 text-[11px] font-mono font-bold text-white transition-all duration-500"
          >
            <span>🔥 内燃機関 (ICE): {iceKw}kW</span>
            <span>{icePct}%</span>
          </div>

          {/* MGU-K Portion */}
          <div
            style={{ width: `${mgukPct}%` }}
            className="h-full bg-gradient-to-r from-cyan-500 to-teal-400 rounded-r-lg flex items-center justify-between px-3 text-[11px] font-mono font-bold text-slate-950 transition-all duration-500"
          >
            <span>⚡ MGU-K: {mgukKw}kW</span>
            <span>{mgukPct}%</span>
          </div>
        </div>

        {/* Legend & Explanations */}
        <div className="flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-400 pt-1">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-sm bg-orange-600 inline-block" />
            <span>1.6L V6 ターボICE: {iceKw}kW (約{Math.round(iceKw * 1.341)}馬力)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-sm bg-cyan-400 inline-block" />
            <span>電気駆動 MGU-K: {mgukKw}kW (約{Math.round(mgukKw * 1.341)}馬力, {is2026 ? '旧来の約3倍出力' : '旧規定'})</span>
          </div>
        </div>
      </div>

      {/* ── Real-time Dynamic Energy Flow Simulator ── */}
      <div className="bg-slate-950/90 rounded-2xl border border-white/10 p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="text-xs font-mono font-bold text-white flex items-center gap-2">
              <span>🔄 パワートレイン・エネルギーフロー視覚シミュレーション</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              走行状態を切り替えて、ICE・MGU-K・バッテリー間のエネルギー移動を確認
            </div>
          </div>

          {/* Operation Selector */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-900 rounded-xl border border-white/10 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setOperation('DEPLOY')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                operation === 'DEPLOY'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              ⚡ 全開加速 (Deploy)
            </button>
            <button
              type="button"
              onClick={() => setOperation('REGEN')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                operation === 'REGEN'
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🛑 フル回生 (Regen)
            </button>
            <button
              type="button"
              onClick={() => setOperation('COAST')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                operation === 'COAST'
                  ? 'bg-sky-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🔋 燃費温存 (Coast)
            </button>
          </div>
        </div>

        {/* Interactive Energy Flow Diagram (SVG) */}
        <div className="w-full flex justify-center py-2">
          <svg viewBox="0 0 760 210" className="w-full max-w-2xl h-auto" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="flowDeployGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#ef4444" />
              </linearGradient>
              <linearGradient id="flowRegenGrad" x1="100%" y1="0%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
            </defs>

            {/* Component 1: Fuel Tank (100% Sustainable Fuel) */}
            <rect x="30" y="40" width="130" height="120" rx="12" fill="#1e293b" stroke="#f59e0b" strokeWidth="2" />
            <text x="95" y="70" fill="#fcd34d" fontSize="11" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
              {is2026 ? '100% E-FUEL' : 'E10 FUEL'}
            </text>
            <text x="95" y="90" fill="#94a3b8" fontSize="10" fontFamily="sans-serif" textAnchor="middle">
              合成非化石燃料
            </text>
            <text x="95" y="115" fill="#e2e8f0" fontSize="11" fontFamily="monospace" textAnchor="middle">
              {is2026 ? '3,000 MJ/h' : '100 kg/h'}
            </text>
            <text x="95" y="135" fill="#f59e0b" fontSize="9" fontFamily="monospace" textAnchor="middle">
              {is2026 ? '約-30% 省燃費' : '旧来流量'}
            </text>

            {/* Component 2: 1.6L V6 Turbo ICE */}
            <rect x="230" y="40" width="150" height="120" rx="12" fill="#1e293b" stroke="#ef4444" strokeWidth="2" />
            <text x="305" y="70" fill="#fca5a5" fontSize="12" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
              1.6L V6 TURBO
            </text>
            <text x="305" y="90" fill="#94a3b8" fontSize="10" fontFamily="sans-serif" textAnchor="middle">
              内燃機関 (ICE)
            </text>
            <text x="305" y="118" fill="#f87171" fontSize="15" fontFamily="racing" fontWeight="bold" textAnchor="middle">
              {iceKw} kW
            </text>
            <text x="305" y="138" fill="#cbd5e1" fontSize="10" fontFamily="monospace" textAnchor="middle">
              (約 {Math.round(iceKw * 1.341)} 馬力)
            </text>

            {/* Component 3: 350kW MGU-K & Battery Store */}
            <rect x="450" y="40" width="150" height="120" rx="12" fill="#1e293b" stroke="#06b6d4" strokeWidth="2" />
            <text x="525" y="70" fill="#67e8f9" fontSize="12" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
              MGU-K (350kW)
            </text>
            <text x="525" y="90" fill="#94a3b8" fontSize="10" fontFamily="sans-serif" textAnchor="middle">
              モータージェネレーター
            </text>
            <text x="525" y="118" fill="#22d3ee" fontSize="15" fontFamily="racing" fontWeight="bold" textAnchor="middle">
              {operation === 'REGEN' ? `+${mgukKw} kW 回生` : `${mgukKw} kW 駆動`}
            </text>
            <text x="525" y="138" fill="#cbd5e1" fontSize="10" fontFamily="monospace" textAnchor="middle">
              ES容量: {is2026 ? '8.5 MJ/lap' : '2.0 MJ/lap'}
            </text>

            {/* Component 4: Rear Driven Wheels */}
            <circle cx="685" cy="100" r="38" fill="#0f172a" stroke="#64748b" strokeWidth="5" />
            <circle cx="685" cy="100" r="18" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />
            <text x="685" y="104" fill="#fff" fontSize="10" fontFamily="monospace" textAnchor="middle">
              REAR
            </text>
            <text x="685" y="155" fill="#94a3b8" fontSize="10" fontFamily="monospace" textAnchor="middle">
              後輪駆動軸
            </text>

            {/* Energy Transfer Flow Arrows */}
            {/* Fuel -> ICE */}
            <path d="M 160 100 L 230 100" stroke="#f59e0b" strokeWidth="3" strokeDasharray="4 4" />

            {/* ICE -> Wheel */}
            {operation === 'DEPLOY' && (
              <path d="M 380 90 L 647 90" stroke="#ef4444" strokeWidth="3" strokeDasharray="6 4">
                <animate attributeName="stroke-dashoffset" values="40;0" dur="0.8s" repeatCount="indefinite" />
              </path>
            )}

            {/* MGU-K -> Wheel (Deploy) */}
            {operation === 'DEPLOY' && (
              <path d="M 600 110 L 647 110" stroke="#22d3ee" strokeWidth="4" strokeDasharray="6 4">
                <animate attributeName="stroke-dashoffset" values="40;0" dur="0.5s" repeatCount="indefinite" />
              </path>
            )}

            {/* Wheel -> MGU-K (Regen) */}
            {operation === 'REGEN' && (
              <path d="M 647 100 L 600 100" stroke="#10b981" strokeWidth="5" strokeDasharray="8 4">
                <animate attributeName="stroke-dashoffset" values="0;40" dur="0.5s" repeatCount="indefinite" />
              </path>
            )}

            {/* Status Annotation */}
            <text x="380" y="195" fill={operation === 'REGEN' ? '#34d399' : operation === 'DEPLOY' ? '#f59e0b' : '#38bdf8'} fontSize="11" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
              {operation === 'DEPLOY'
                ? `全開加速展開中: ICE(${iceKw}kW) + MGU-K(${mgukKw}kW) = 合計 ${totalKw}kW (約${Math.round(totalKw * 1.341)}馬力) 爆発的推進力`
                : operation === 'REGEN'
                ? `フルブレーキ急減速中: 350kW MGU-Kが後輪運動エネルギーを最大8.5MJ/lapで急速電気変換`
                : 'リフト＆コースト温存中: 燃料消費ゼロ・電力を温存しオーバーライド用エネルギーを確保'}
            </text>
          </svg>
        </div>
      </div>

      {/* ── Key Technical Specifications Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* MGU-K */}
        <div className="bg-slate-950/70 p-4 rounded-xl border border-white/10 space-y-1">
          <div className="text-[10px] font-mono text-cyan-400 flex items-center justify-between font-bold">
            <span>MGU-K 出力</span>
            <span>⚡ +192%</span>
          </div>
          <div className="text-xl font-racing font-bold text-white">
            {is2026 ? '350 kW' : '120 kW'}
          </div>
          <div className="text-[11px] text-slate-400 leading-tight">
            {is2026 ? '約470馬力。旧規定の約3倍に到達し、加速の主役に躍り出ます。' : '約160馬力。補助的なアシストに留まる。'}
          </div>
        </div>

        {/* MGU-H */}
        <div className="bg-slate-950/70 p-4 rounded-xl border border-white/10 space-y-1">
          <div className="text-[10px] font-mono text-amber-400 flex items-center justify-between font-bold">
            <span>MGU-H (熱回生)</span>
            <span>{is2026 ? '❌ 廃止' : '⭕ 搭載'}</span>
          </div>
          <div className="text-xl font-racing font-bold text-white">
            {is2026 ? '完全撤廃' : '超高回転軸'}
          </div>
          <div className="text-[11px] text-slate-400 leading-tight">
            {is2026 ? '複雑な排熱ターボ回生を廃止し、AudiやFord等の新規参入を促す。' : '10万回転超の排熱回生。開発費高騰の元凶に。'}
          </div>
        </div>

        {/* Fuel & E-Fuel */}
        <div className="bg-slate-950/70 p-4 rounded-xl border border-white/10 space-y-1">
          <div className="text-[10px] font-mono text-emerald-400 flex items-center justify-between font-bold">
            <span>燃料レギュレーション</span>
            <span>🌱 Net Zero</span>
          </div>
          <div className="text-sm font-racing font-bold text-white mt-1">
            {is2026 ? '100% 非化石合成' : 'E10 バイオ混合'}
          </div>
          <div className="text-[11px] text-slate-400 leading-tight">
            {is2026 ? '大気中CO2と再生可能電力から作られるドロップイン型持続可能燃料。' : '化石ガソリン90% + エタノール10%。'}
          </div>
        </div>

        {/* Max Regen */}
        <div className="bg-slate-950/70 p-4 rounded-xl border border-white/10 space-y-1">
          <div className="text-[10px] font-mono text-purple-400 flex items-center justify-between font-bold">
            <span>周回あたり回生量</span>
            <span>🔋 大容量化</span>
          </div>
          <div className="text-xl font-racing font-bold text-white">
            {is2026 ? '8.5 MJ / Lap' : '2.0 MJ / Lap'}
          </div>
          <div className="text-[11px] text-slate-400 leading-tight">
            {is2026 ? 'ブレーキングだけで旧来の4倍超の電力を回収し、次直線へ蓄積。' : '回収エネルギーに上限があり展開に制約。'}
          </div>
        </div>
      </div>

      {/* ── Engineering Deep-Dive for Connoisseurs ── */}
      <div className="bg-slate-950/60 rounded-xl p-4 border border-white/5 space-y-2 text-xs text-slate-300">
        <div className="font-bold text-amber-300 font-mono text-sm flex items-center gap-1.5">
          <span>🧠</span>
          <span>玄人向け工学解説：MGU-H撤廃で「ターボラグ」はどう克服されるのか？</span>
        </div>
        <p className="leading-relaxed text-slate-300">
          現行PUでは、MGU-Hの電動モーターがターボシャフトを瞬時に強制回転させることで「ターボラグ（過給遅延）」を完全に消し去っていました。
          2026年にMGU-Hが廃止されると、低回転からの加速時にターボ過給圧が立ち上がるまでのタイムラグが理論上発生します。
          この問題を解決するのが<strong>350kWへと巨大化したMGU-Kの瞬発トルク</strong>です。コーナー立ち上がり瞬間に電気モーターが瞬時に大トルクを叩き込み、
          エンジン過給が立ち上がるまでのギャップを完全に埋める電子制御マッピング（エレクトリック・トルクフィル）が各ワークスPU陣営（フェラーリ、メルセデス、ホンダ、レッドブルフォード、アウディ）の最大の腕の見せ所となります。
        </p>
      </div>
    </div>
  );
}
