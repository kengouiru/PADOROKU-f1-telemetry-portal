'use client';

/**
 * components/regulations/ChassisDownsizingVisualizer.tsx
 * 📐 2026 FIA "Nimble Car" Chassis Downsizing & Weight Reduction Visualizer
 * Visual top-down and dimension overlay comparing:
 * - Wheelbase (-200mm) & Overall Width (-100mm)
 * - Minimum car weight (-30kg target)
 * - Tyre footprint (-25mm front, -30mm rear)
 * - Cornering agility and dirty air reduction
 */

import React, { useState } from 'react';

export default function ChassisDownsizingVisualizer() {
  const [selectedOverlay, setSelectedOverlay] = useState<'both' | '2026' | '2025'>('both');

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-emerald-500/30 overflow-hidden shadow-2xl p-5 md:p-6 space-y-6">
      {/* ── Title Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold tracking-wider">
              NIMBLE CAR CONCEPT
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              シャシー小型軽量化＆機動性大改革
            </span>
          </div>
          <h3 className="text-xl font-racing font-black text-white tracking-wide">
            2026年 マシン寸法・軽量化（ニンブルカー）比較シミュレーター
          </h3>
        </div>

        {/* View Switcher */}
        <div className="flex items-center p-1 bg-slate-950/80 rounded-xl border border-white/10 self-start sm:self-auto shadow-inner">
          <button
            type="button"
            onClick={() => setSelectedOverlay('both')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-racing font-bold transition-all ${
              selectedOverlay === 'both'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>2025 vs 2026 比較</span>
          </button>
          <button
            type="button"
            onClick={() => setSelectedOverlay('2026')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-racing font-bold transition-all ${
              selectedOverlay === '2026'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>2026 新規定のみ</span>
          </button>
          <button
            type="button"
            onClick={() => setSelectedOverlay('2025')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-racing font-bold transition-all ${
              selectedOverlay === '2025'
                ? 'bg-slate-700 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>2025 旧規定のみ</span>
          </button>
        </div>
      </div>

      {/* ── Top-Down Footprint Comparison SVG ── */}
      <div className="bg-slate-950/90 rounded-2xl border border-white/10 p-4 md:p-6 flex flex-col items-center justify-center space-y-3">
        <div className="w-full flex items-center justify-between text-xs font-mono">
          <span className="text-slate-400">マシン上面投影フットプリント（外寸オーバーレイ）</span>
          <div className="flex items-center gap-4">
            {(selectedOverlay === 'both' || selectedOverlay === '2025') && (
              <div className="flex items-center gap-1.5 text-slate-400">
                <span className="w-3 h-2 border border-dashed border-slate-500 rounded-sm inline-block" />
                <span>2025年 巨大シャシー (全幅2000mm / WB 3600mm)</span>
              </div>
            )}
            {(selectedOverlay === 'both' || selectedOverlay === '2026') && (
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <span className="w-3 h-2 bg-emerald-500/30 border border-emerald-400 rounded-sm inline-block" />
                <span>2026年 ニンブルカー (全幅1900mm / WB 3400mm)</span>
              </div>
            )}
          </div>
        </div>

        {/* SVG Footprint */}
        <svg viewBox="0 0 760 300" className="w-full max-w-3xl h-auto" xmlns="http://www.w3.org/2000/svg">
          {/* Grid Centerline */}
          <line x1="50" y1="150" x2="710" y2="150" stroke="#334155" strokeWidth="1" strokeDasharray="5 5" />
          <text x="50" y="140" fill="#64748b" fontSize="10" fontFamily="monospace">FRONT NOSE</text>
          <text x="690" y="140" fill="#64748b" fontSize="10" fontFamily="monospace" textAnchor="end">REAR WING</text>

          {/* 2025 Outline (Grey / Dashed) */}
          {(selectedOverlay === 'both' || selectedOverlay === '2025') && (
            <g opacity="0.6">
              {/* Overall Bounding Box (Width 2000mm = 220px, WB 3600mm = 520px) */}
              <rect x="110" y="40" width="530" height="220" rx="20" fill="none" stroke="#64748b" strokeWidth="2" strokeDasharray="6 6" />
              {/* Front Wheels (305mm wide) */}
              <rect x="160" y="25" width="45" height="30" rx="3" fill="#334155" stroke="#94a3b8" strokeWidth="1" />
              <rect x="160" y="245" width="45" height="30" rx="3" fill="#334155" stroke="#94a3b8" strokeWidth="1" />
              {/* Rear Wheels (405mm wide) */}
              <rect x="535" y="20" width="50" height="40" rx="3" fill="#334155" stroke="#94a3b8" strokeWidth="1" />
              <rect x="535" y="240" width="50" height="40" rx="3" fill="#334155" stroke="#94a3b8" strokeWidth="1" />
              {/* Label */}
              <text x="375" y="55" fill="#94a3b8" fontSize="11" fontFamily="monospace" textAnchor="middle">
                2025 最大全幅: 2,000mm / ホイールベース: 3,600mm
              </text>
            </g>
          )}

          {/* 2026 Agile Outline (Emerald Solid) */}
          {(selectedOverlay === 'both' || selectedOverlay === '2026') && (
            <g>
              {/* 2026 Bounding Box (Width 1900mm = 200px, WB 3400mm = 480px) */}
              <rect
                x="130"
                y="50"
                width="480"
                height="200"
                rx="16"
                fill="rgba(16, 185, 129, 0.08)"
                stroke="#10b981"
                strokeWidth="2.5"
              />
              {/* Front Wheels (280mm wide: -25mm) */}
              <rect x="180" y="38" width="42" height="26" rx="3" fill="#047857" stroke="#34d399" strokeWidth="1.5" />
              <rect x="180" y="236" width="42" height="26" rx="3" fill="#047857" stroke="#34d399" strokeWidth="1.5" />
              {/* Rear Wheels (375mm wide: -30mm) */}
              <rect x="510" y="32" width="48" height="34" rx="3" fill="#047857" stroke="#34d399" strokeWidth="1.5" />
              <rect x="510" y="234" width="48" height="34" rx="3" fill="#047857" stroke="#34d399" strokeWidth="1.5" />

              {/* Sidepods & Cockpit Halo */}
              <path
                d="M 130 150 L 220 100 L 300 90 L 460 95 L 530 135 L 610 145 L 610 155 L 530 165 L 460 205 L 300 210 L 220 200 Z"
                fill="rgba(6, 78, 59, 0.4)"
                stroke="#059669"
                strokeWidth="1.5"
              />
              <circle cx="350" cy="150" r="14" fill="#10b981" opacity="0.6" />

              {/* Dimension Callouts */}
              <text x="375" y="275" fill="#34d399" fontSize="11" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                2026 ニンブルカー: 全幅 1,900mm (-100mm) / WB 3,400mm (-200mm)
              </text>
            </g>
          )}
        </svg>

        {/* Delta Summary Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full pt-2">
          <div className="bg-slate-900/80 p-2.5 rounded-xl border border-white/10 text-center">
            <div className="text-[10px] text-slate-400 font-mono">ホイールベース</div>
            <div className="text-base font-racing font-bold text-emerald-400">-200 mm</div>
            <div className="text-[10px] text-slate-500 font-mono">3,600 ➡️ 3,400mm</div>
          </div>
          <div className="bg-slate-900/80 p-2.5 rounded-xl border border-white/10 text-center">
            <div className="text-[10px] text-slate-400 font-mono">全幅 (Overall Width)</div>
            <div className="text-base font-racing font-bold text-emerald-400">-100 mm</div>
            <div className="text-[10px] text-slate-500 font-mono">2,000 ➡️ 1,900mm</div>
          </div>
          <div className="bg-slate-900/80 p-2.5 rounded-xl border border-white/10 text-center">
            <div className="text-[10px] text-slate-400 font-mono">最低重量 (Min Weight)</div>
            <div className="text-base font-racing font-bold text-emerald-400">-30 kg</div>
            <div className="text-[10px] text-slate-500 font-mono">798kg ➡️ 768kg目標</div>
          </div>
          <div className="bg-slate-900/80 p-2.5 rounded-xl border border-white/10 text-center">
            <div className="text-[10px] text-slate-400 font-mono">タイヤ幅 (前後縮小)</div>
            <div className="text-base font-racing font-bold text-emerald-400">前-25 / 後-30mm</div>
            <div className="text-[10px] text-slate-500 font-mono">F: 280mm / R: 375mm</div>
          </div>
        </div>
      </div>

      {/* ── Driver & Racing Impact ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        <div className="bg-slate-950/60 p-4 rounded-xl border border-white/5 space-y-1.5">
          <div className="font-bold text-sky-400 font-mono flex items-center gap-1.5">
            <span>🏁 モナコや鈴鹿シケインでの劇的な旋回機動性</span>
          </div>
          <p className="text-slate-300 leading-relaxed text-[11px]">
            現行の3,600mmホイールベースは歴代F1史上最も長く、「リムジンのように曲がらない」とドライバーから批判されていました。
            200mmの短縮と100mmの全幅スリム化により、モナコ市街地や鈴鹿の低速シケイン、シンガポールのタイトコーナーでの敏捷性（ヨーモーメントの低減）が大幅に向上し、ホイール・トゥ・ホイールの接近戦スペースが拡大します。
          </p>
        </div>

        <div className="bg-slate-950/60 p-4 rounded-xl border border-white/5 space-y-1.5">
          <div className="font-bold text-amber-400 font-mono flex items-center gap-1.5">
            <span>💨 ダーティエア（後方乱流）-30% 削減</span>
          </div>
          <p className="text-slate-300 leading-relaxed text-[11px]">
            グラウンドエフェクトフロアのトンネル幅を狭め、ディフューザーの拡大角度を抑制。
            マシン全体のダウンフォース総量を約30%落とし、後方に巻き上げる乱気流（ウェイクリフト）の幅を劇的に縮小。
            追従する後続車がフロントタイヤの熱ダレを起こさずに直後へ張り付ける環境が完成します。
          </p>
        </div>
      </div>
    </div>
  );
}
