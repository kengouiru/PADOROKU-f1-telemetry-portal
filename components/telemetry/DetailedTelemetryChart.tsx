'use client';

/**
 * components/telemetry/DetailedTelemetryChart.tsx
 * 3-Tier Synchronized Car Telemetry Comparison Chart (Speed, Pedals, Gear & Delta)
 *
 * Features:
 * - 3 synchronized charts via Recharts syncId:
 *   1. Speed Overlay (0~350 km/h) with Corner markers
 *   2. Pedals (Throttle 0~100% & Brake zones)
 *   3. Gear (1~8) & Lap Delta (+/- seconds)
 * - Synchronized vertical hover crosshair and rich tooltip across all 3 tiers
 * - Quick driver comparison presets (VER vs NOR, HAM vs LEC, VER vs HAM)
 * - Driving Style Decoded Intelligence Insights (Braking delta, Apex minimum speed, Throttle pick-up)
 */

import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
  AreaChart,
  Area,
} from 'recharts';
import {
  generateNormalizedTelemetry,
  type NormalizedTelemetryPoint,
  type TelemetryComparisonData,
} from '@/lib/carTelemetryService';
import { KNOWLEDGE_CIRCUITS, KNOWLEDGE_DRIVERS } from '@/data/f1KnowledgeData';

interface DetailedTelemetryChartProps {
  initialCircuitId?: string;
  initialDriver1Code?: string;
  initialDriver2Code?: string;
  className?: string;
}

export default function DetailedTelemetryChart({
  initialCircuitId = 'bahrain-international',
  initialDriver1Code = 'VER',
  initialDriver2Code = 'NOR',
  className = '',
}: DetailedTelemetryChartProps) {
  const [selectedCircuit, setSelectedCircuit] = useState(initialCircuitId);
  const [driver1Code, setDriver1Code] = useState(initialDriver1Code);
  const [driver2Code, setDriver2Code] = useState(initialDriver2Code);
  const [activeTab, setActiveTab] = useState<'chart' | 'insights'>('chart');

  // Driver definitions
  const d1 = useMemo(() => {
    const found = KNOWLEDGE_DRIVERS.find((d) => d.code === driver1Code);
    return found
      ? { code: found.code, number: String(found.number), name: found.fullName, color: found.teamColor }
      : { code: 'VER', number: '1', name: 'Max Verstappen', color: '#3b82f6' };
  }, [driver1Code]);

  const d2 = useMemo(() => {
    const found = KNOWLEDGE_DRIVERS.find((d) => d.code === driver2Code);
    return found
      ? { code: found.code, number: String(found.number), name: found.fullName, color: found.teamColor }
      : { code: 'NOR', number: '4', name: 'Lando Norris', color: '#f97316' };
  }, [driver2Code]);

  // Compute telemetry comparison data
  const telemetryData: TelemetryComparisonData = useMemo(() => {
    return generateNormalizedTelemetry(selectedCircuit, d1, d2);
  }, [selectedCircuit, d1, d2]);

  const { points, insights, circuitName, circuitLengthM } = telemetryData;

  // Extract key corner points for reference lines
  const cornerMarkers = useMemo(() => {
    return points.filter((p) => p.cornerName);
  }, [points]);

  // Quick preset matchups
  const applyPreset = (c1: string, c2: string) => {
    setDriver1Code(c1);
    setDriver2Code(c2);
  };

  return (
    <div className={`glass-card bg-slate-950/95 border border-white/10 rounded-3xl p-4 sm:p-6 shadow-2xl space-y-6 ${className}`}>
      {/* Top Header: Title & Circuit/Driver Selectors */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-sky-500/20 text-sky-300 border border-sky-500/40">
              CAR DATA COMPARISON
            </span>
            <span className="text-xs font-mono text-slate-400">
              3段同期テレメトリー (Speed / Pedals / Gear & Delta)
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-racing font-black text-white mt-1 flex items-center gap-2">
            <span>⚡ 詳細テレメトリー重ね合わせ比較</span>
            <span className="text-sm font-mono text-slate-400">({circuitName})</span>
          </h3>
        </div>

        {/* Quick Matchup Presets */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] font-mono text-slate-500 mr-1 hidden sm:inline">人気対決:</span>
          <button
            onClick={() => applyPreset('VER', 'NOR')}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
              driver1Code === 'VER' && driver2Code === 'NOR'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
            }`}
          >
            VER vs NOR
          </button>
          <button
            onClick={() => applyPreset('HAM', 'LEC')}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
              driver1Code === 'HAM' && driver2Code === 'LEC'
                ? 'bg-red-600 text-white shadow-md'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
            }`}
          >
            HAM vs LEC
          </button>
          <button
            onClick={() => applyPreset('VER', 'HAM')}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
              driver1Code === 'VER' && driver2Code === 'HAM'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
            }`}
          >
            VER vs HAM
          </button>
          <button
            onClick={() => applyPreset('TSU', 'ALO')}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
              driver1Code === 'TSU' && driver2Code === 'ALO'
                ? 'bg-amber-600 text-white shadow-md'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
            }`}
          >
            TSU vs ALO
          </button>
        </div>
      </div>

      {/* Selectors Bar: Driver 1 vs Driver 2 & Circuit */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-900/60 p-3 rounded-2xl border border-white/5">
        {/* Driver 1 Selector */}
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-8 rounded-full flex-shrink-0"
            style={{ backgroundColor: d1.color }}
          />
          <div className="flex-1">
            <span className="text-[10px] font-mono text-slate-400 block uppercase">基準ドライバー 1</span>
            <select
              value={driver1Code}
              onChange={(e) => setDriver1Code(e.target.value)}
              className="w-full bg-slate-950 border border-white/10 rounded-xl px-2.5 py-1 text-xs font-bold text-white font-racing focus:outline-none focus:border-sky-500"
            >
              {KNOWLEDGE_DRIVERS.map((d) => (
                <option key={d.code} value={d.code}>
                  #{d.number} {d.code} - {d.fullName}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Driver 2 Selector */}
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-8 rounded-full flex-shrink-0"
            style={{ backgroundColor: d2.color }}
          />
          <div className="flex-1">
            <span className="text-[10px] font-mono text-slate-400 block uppercase">比較ドライバー 2</span>
            <select
              value={driver2Code}
              onChange={(e) => setDriver2Code(e.target.value)}
              className="w-full bg-slate-950 border border-white/10 rounded-xl px-2.5 py-1 text-xs font-bold text-white font-racing focus:outline-none focus:border-sky-500"
            >
              {KNOWLEDGE_DRIVERS.map((d) => (
                <option key={d.code} value={d.code}>
                  #{d.number} {d.code} - {d.fullName}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Circuit Selector */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-sky-950/60 border border-sky-500/30 flex items-center justify-center text-sm flex-shrink-0">
            🏁
          </div>
          <div className="flex-1">
            <span className="text-[10px] font-mono text-slate-400 block uppercase">対象サーキット</span>
            <select
              value={selectedCircuit}
              onChange={(e) => setSelectedCircuit(e.target.value)}
              className="w-full bg-slate-950 border border-white/10 rounded-xl px-2.5 py-1 text-xs font-bold text-white font-racing focus:outline-none focus:border-sky-500"
            >
              {KNOWLEDGE_CIRCUITS.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.country})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Driver Legend Badges */}
      <div className="flex items-center justify-between gap-3 px-2 flex-wrap">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span
              className="w-3.5 h-3.5 rounded-md shadow-sm border border-white/20"
              style={{ backgroundColor: d1.color }}
            />
            <span className="font-racing font-bold text-xs text-white">
              {d1.name} (#{d1.number})
            </span>
            <span className="text-[10px] font-mono text-slate-400">Best: {telemetryData.driver1.lapTime}</span>
          </div>

          <span className="text-slate-600 font-mono">VS</span>

          <div className="flex items-center gap-2">
            <span
              className="w-3.5 h-3.5 rounded-md shadow-sm border border-white/20"
              style={{ backgroundColor: d2.color }}
            />
            <span className="font-racing font-bold text-xs text-white">
              {d2.name} (#{d2.number})
            </span>
            <span className="text-[10px] font-mono text-slate-400">Best: {telemetryData.driver2.lapTime}</span>
          </div>
        </div>

        <div className="text-[11px] font-mono text-slate-400 flex items-center gap-2">
          <span>横軸: コース進行度 (0% 〜 100% / {circuitLengthM}m)</span>
          <span className="hidden md:inline text-slate-600">|</span>
          <span className="hidden md:inline text-emerald-400 font-medium">✨ 3段完全同期カーソル</span>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3-TIER SYNCHRONIZED CHARTS (syncId="f1-telemetry-car-data")
      ───────────────────────────────────────────────────────────── */}
      <div className="space-y-2 bg-slate-950/80 rounded-2xl p-3 sm:p-4 border border-white/5">
        {/* ── TIER 1: SPEED OVERLAY (km/h) ────────────────────────── */}
        <div>
          <div className="flex items-center justify-between mb-1 px-1">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-racing font-bold text-sky-400">① SPEED</span>
              <span className="text-[10px] font-mono text-slate-400">車速重ね合わせ (0 ~ 350 km/h)</span>
            </div>
            <span className="text-[10px] font-mono text-slate-500">Unit: km/h</span>
          </div>

          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={points}
                syncId="f1-telemetry-car-data"
                margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                <XAxis
                  dataKey="distPercent"
                  hide
                  domain={[0, 100]}
                />
                <YAxis
                  domain={[40, 360]}
                  stroke="#94a3b8"
                  fontSize={10}
                  tickCount={5}
                />
                <Tooltip
                  content={<CustomTelemetryTooltip d1={d1} d2={d2} mode="speed" />}
                />

                {/* Corner Markers */}
                {cornerMarkers.map((marker, idx) => (
                  <ReferenceLine
                    key={idx}
                    x={marker.distPercent}
                    stroke="#475569"
                    strokeDasharray="2 2"
                    label={{
                      value: marker.cornerName,
                      position: 'insideTop',
                      fill: '#94a3b8',
                      fontSize: 9,
                      fontWeight: 'bold',
                    }}
                  />
                ))}

                {/* Driver 1 Speed */}
                <Line
                  type="monotone"
                  dataKey="speed1"
                  name={d1.code}
                  stroke={d1.color}
                  strokeWidth={2.2}
                  dot={false}
                  isAnimationActive={false}
                />
                {/* Driver 2 Speed */}
                <Line
                  type="monotone"
                  dataKey="speed2"
                  name={d2.code}
                  stroke={d2.color}
                  strokeWidth={2.2}
                  strokeDasharray="4 2"
                  dot={false}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ── TIER 2: PEDALS (Throttle % & Brake) ─────────────────── */}
        <div className="pt-2 border-t border-white/5">
          <div className="flex items-center justify-between mb-1 px-1">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-racing font-bold text-emerald-400">② PEDALS</span>
              <span className="text-[10px] font-mono text-slate-400">スロットル開度 (0~100%) & ブレーキ急減速帯</span>
            </div>
            <span className="text-[10px] font-mono text-slate-500">Throttle % / Brake</span>
          </div>

          <div className="h-32 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={points}
                syncId="f1-telemetry-car-data"
                margin={{ top: 5, right: 10, left: -15, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                <XAxis dataKey="distPercent" hide domain={[0, 100]} />
                <YAxis domain={[0, 105]} stroke="#94a3b8" fontSize={10} tickCount={3} />
                <Tooltip content={<CustomTelemetryTooltip d1={d1} d2={d2} mode="pedals" />} />

                {/* Brake filled zones */}
                <Area
                  type="stepAfter"
                  dataKey="brake1"
                  name={`${d1.code} Brake`}
                  stroke="transparent"
                  fill="#ef4444"
                  fillOpacity={0.25}
                  isAnimationActive={false}
                />
                <Area
                  type="stepAfter"
                  dataKey="brake2"
                  name={`${d2.code} Brake`}
                  stroke="transparent"
                  fill="#f59e0b"
                  fillOpacity={0.2}
                  isAnimationActive={false}
                />

                {/* Throttle lines */}
                <Line
                  type="monotone"
                  dataKey="throttle1"
                  name={`${d1.code} Throttle`}
                  stroke={d1.color}
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive={false}
                />
                <Line
                  type="monotone"
                  dataKey="throttle2"
                  name={`${d2.code} Throttle`}
                  stroke={d2.color}
                  strokeWidth={2}
                  strokeDasharray="3 2"
                  dot={false}
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ── TIER 3: GEAR & DELTA (Time difference) ─────────────── */}
        <div className="pt-2 border-t border-white/5">
          <div className="flex items-center justify-between mb-1 px-1">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-racing font-bold text-purple-400">③ GEAR & DELTA</span>
              <span className="text-[10px] font-mono text-slate-400">シフト段数 (1~8) & 累積タイム差 (Delta sec)</span>
            </div>
            <span className="text-[10px] font-mono text-slate-500">Gear / Delta (s)</span>
          </div>

          <div className="h-32 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={points}
                syncId="f1-telemetry-car-data"
                margin={{ top: 5, right: 10, left: -15, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                <XAxis
                  dataKey="distPercent"
                  unit="%"
                  stroke="#94a3b8"
                  fontSize={10}
                  domain={[0, 100]}
                />
                {/* Left Axis: Gear */}
                <YAxis
                  yAxisId="left"
                  domain={[1, 8]}
                  ticks={[1, 3, 5, 7, 8]}
                  stroke="#94a3b8"
                  fontSize={10}
                />
                {/* Right Axis: Delta */}
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  domain={[-0.5, 0.5]}
                  stroke="#a855f7"
                  fontSize={10}
                  tickFormatter={(val) => `${val > 0 ? '+' : ''}${val}s`}
                />
                <Tooltip content={<CustomTelemetryTooltip d1={d1} d2={d2} mode="gearDelta" />} />
                <ReferenceLine yAxisId="right" y={0} stroke="#64748b" strokeDasharray="2 2" />

                {/* Driver 1 Gear */}
                <Line
                  yAxisId="left"
                  type="stepAfter"
                  dataKey="gear1"
                  stroke={d1.color}
                  strokeWidth={1.8}
                  dot={false}
                  isAnimationActive={false}
                />
                {/* Driver 2 Gear */}
                <Line
                  yAxisId="left"
                  type="stepAfter"
                  dataKey="gear2"
                  stroke={d2.color}
                  strokeWidth={1.8}
                  strokeDasharray="2 2"
                  dot={false}
                  isAnimationActive={false}
                />

                {/* Delta Time Area/Line */}
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="delta"
                  name="Delta"
                  stroke="#a855f7"
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          DRIVING STYLE DECODED INSIGHTS CARDS
      ───────────────────────────────────────────────────────────── */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-racing font-bold text-white flex items-center gap-2">
            <span>🧠</span>
            <span>ドライビングスタイル解読インサイト</span>
          </h4>
          <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-white/10">
            自動解析テレメトリー所見
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Card 1: Braking Delta */}
          <div className="bg-slate-900/80 border border-red-500/20 rounded-2xl p-4 space-y-2 shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-racing font-bold text-red-400 flex items-center gap-1.5">
                <span>🛑</span>
                <span>ブレーキング開始ポイントの差</span>
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-red-950 text-red-300 border border-red-500/30">
                LATE BRAKER: {insights.braking.lateBraker}
              </span>
            </div>
            <p className="text-xs font-bold text-white">
              {insights.braking.summary}
            </p>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              {insights.braking.details}
            </p>
          </div>

          {/* Card 2: Apex Minimum Speed */}
          <div className="bg-slate-900/80 border border-sky-500/20 rounded-2xl p-4 space-y-2 shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-racing font-bold text-sky-400 flex items-center gap-1.5">
                <span>🌀</span>
                <span>コーナー最小旋回速度 (ボトムスピード)</span>
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-500/30">
                APEX KING: {insights.apexSpeed.fasterDriver}
              </span>
            </div>
            <p className="text-xs font-bold text-white">
              {insights.apexSpeed.summary}
            </p>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              {insights.apexSpeed.details}
            </p>
          </div>

          {/* Card 3: Traction & Throttle */}
          <div className="bg-slate-900/80 border border-emerald-500/20 rounded-2xl p-4 space-y-2 shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-racing font-bold text-emerald-400 flex items-center gap-1.5">
                <span>⚡</span>
                <span>立ち上がりトラクション (フルスロットル到達)</span>
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                EARLY PICKUP: {insights.throttleApplication.earlierDriver}
              </span>
            </div>
            <p className="text-xs font-bold text-white">
              {insights.throttleApplication.summary}
            </p>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              {insights.throttleApplication.details}
            </p>
          </div>
        </div>

        {/* Key Corners Tactical Breakdown */}
        {insights.keyCorners && insights.keyCorners.length > 0 && (
          <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-3.5 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-racing font-bold text-amber-300 flex items-center gap-1">
                <span>🎯</span>
                <span>主要コーナー別 タイム差発生要因の解明</span>
              </span>
              <span className="text-[10px] font-mono text-slate-400">Telemetry Breakdown</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
              {insights.keyCorners.map((kc, idx) => (
                <div key={idx} className="bg-slate-950/80 border border-white/5 rounded-xl p-2.5 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-racing font-bold text-xs text-white">{kc.corner}</span>
                    <span className="font-mono text-[10px] font-bold text-amber-400">
                      {kc.advantageDriver} ({kc.timeDelta})
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-300 leading-tight">
                    {kc.explanation}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Synchronized Tooltip Component
// ─────────────────────────────────────────────────────────────

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number | string;
    dataKey: string;
    name: string;
    color: string;
    payload: NormalizedTelemetryPoint;
  }>;
  label?: number;
  d1: { code: string; color: string };
  d2: { code: string; color: string };
  mode: 'speed' | 'pedals' | 'gearDelta';
}

function CustomTelemetryTooltip({ active, payload, d1, d2 }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;

  const data: NormalizedTelemetryPoint = payload[0].payload;

  return (
    <div className="bg-slate-900/95 border border-white/15 backdrop-blur-md rounded-xl p-3 shadow-2xl text-xs space-y-2 min-w-[200px]">
      <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
        <span className="font-racing font-bold text-white">
          進行度 {data.distPercent}% ({data.distMeters}m)
        </span>
        {data.cornerName && (
          <span className="font-racing font-bold text-amber-300 text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 border border-amber-500/40">
            {data.cornerName}
          </span>
        )}
      </div>

      {/* Driver 1 Stats */}
      <div className="flex items-center justify-between" style={{ color: d1.color }}>
        <span className="font-racing font-bold">#{d1.code}:</span>
        <div className="font-mono text-[11px] flex items-center gap-2">
          <span>{data.speed1} km/h</span>
          <span className="text-slate-400">|</span>
          <span>Thr {data.throttle1}%</span>
          <span className="text-slate-400">|</span>
          <span>{data.gear1}速</span>
          {data.brake1 > 0 && <span className="text-red-400 font-bold">BRK</span>}
        </div>
      </div>

      {/* Driver 2 Stats */}
      <div className="flex items-center justify-between" style={{ color: d2.color }}>
        <span className="font-racing font-bold">#{d2.code}:</span>
        <div className="font-mono text-[11px] flex items-center gap-2">
          <span>{data.speed2} km/h</span>
          <span className="text-slate-400">|</span>
          <span>Thr {data.throttle2}%</span>
          <span className="text-slate-400">|</span>
          <span>{data.gear2}速</span>
          {data.brake2 > 0 && <span className="text-amber-400 font-bold">BRK</span>}
        </div>
      </div>

      {/* Delta */}
      <div className="border-t border-white/10 pt-1 flex items-center justify-between font-mono text-[11px]">
        <span className="text-slate-400">Delta ({d1.code}基準):</span>
        <span className={data.delta >= 0 ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
          {data.delta >= 0 ? `+${data.delta}s (${d1.code}先行)` : `${data.delta}s (${d2.code}先行)`}
        </span>
      </div>
    </div>
  );
}
