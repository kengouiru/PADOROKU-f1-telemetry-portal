'use client';

/**
 * components/hubs/DriverComparisonTool.tsx
 * Comprehensive 2-Driver Head-to-Head Comparison Tool:
 * - 6-Axis Radar Chart (Recharts) for Driving Style & Skill Breakdown
 * - Career & Season Stats Parallel Comparison with Winner Highlight
 * - Teammate Head-to-Head Record (Qualifying & Race battles when in same team)
 * - Deep Links: Drama Hub Rivalry Narrative & Live Telemetry Overlay
 */

import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  Tooltip,
} from 'recharts';
import {
  KNOWLEDGE_DRIVERS,
  KNOWLEDGE_TEAMS,
  type DriverProfile,
  type TelemetryTarget,
} from '@/data/f1KnowledgeData';
import {
  DRIVER_SKILL_RATINGS,
  TEAMMATE_HEAD_TO_HEAD_DATA,
  DRIVER_RIVALRY_MAPPING,
  type DriverSkills,
} from '@/data/driverComparisonData';

interface DriverComparisonToolProps {
  initialDriver1?: string;
  initialDriver2?: string;
  onNavigateToTelemetry?: (target?: TelemetryTarget) => void;
  onNavigateToDrama?: () => void;
  onSelectDriverDetail?: (driver: DriverProfile) => void;
}

const PRESET_MATCHUPS: { d1: string; d2: string; label: string; desc: string }[] = [
  { d1: 'VER', d2: 'NOR', label: 'VER vs NOR', desc: '新世代の頂上決戦' },
  { d1: 'HAM', d2: 'LEC', label: 'HAM vs LEC', desc: '跳ね馬同門頂上決戦' },
  { d1: 'RUS', d2: 'ANT', label: 'RUS vs ANT', desc: 'メルセデス新時代タッグ' },
  { d1: 'PER', d2: 'BOT', label: 'PER vs BOT', desc: 'キャデラック新チーム初代激突' },
  { d1: 'HUL', d2: 'BOR', label: 'HUL vs BOR', desc: 'アウディワークス初年度対決' },
  { d1: 'NOR', d2: 'PIA', label: 'NOR vs PIA', desc: 'マクラーレン内戦' },
  { d1: 'LEC', d2: 'SAI', label: 'LEC vs SAI', desc: '元フェラーリ盟友対決' },
  { d1: 'TSU', d2: 'LAW', label: 'TSU vs LAW', desc: 'RB同門・昇格争覇' },
  { d1: 'SEN', d2: 'PRO', label: 'SEN vs PRO', desc: '史上最大の伝説因縁' },
];

export default function DriverComparisonTool({
  initialDriver1 = 'VER',
  initialDriver2 = 'NOR',
  onNavigateToTelemetry,
  onNavigateToDrama,
  onSelectDriverDetail,
}: DriverComparisonToolProps) {
  const [driver1Code, setDriver1Code] = useState<string>(initialDriver1);
  const [driver2Code, setDriver2Code] = useState<string>(initialDriver2);

  const driver1 = useMemo(() => {
    return KNOWLEDGE_DRIVERS.find((d) => d.code === driver1Code) || KNOWLEDGE_DRIVERS[0];
  }, [driver1Code]);

  const driver2 = useMemo(() => {
    return KNOWLEDGE_DRIVERS.find((d) => d.code === driver2Code) || KNOWLEDGE_DRIVERS[1];
  }, [driver2Code]);

  const color1 = driver1.teamColor || '#ef4444';
  const color2 = driver2.teamColor || '#38bdf8';

  // Radar Data calculation
  const skills1: DriverSkills = DRIVER_SKILL_RATINGS[driver1.code] || {
    qualifying: 85, racePace: 85, tyreManagement: 85, wetWeather: 85, overtaking: 85, consistency: 85,
  };
  const skills2: DriverSkills = DRIVER_SKILL_RATINGS[driver2.code] || {
    qualifying: 85, racePace: 85, tyreManagement: 85, wetWeather: 85, overtaking: 85, consistency: 85,
  };

  const radarData = useMemo(() => {
    return [
      { axis: '予選一発', d1: skills1.qualifying, d2: skills2.qualifying, fullMark: 100 },
      { axis: 'レースペース', d1: skills1.racePace, d2: skills2.racePace, fullMark: 100 },
      { axis: 'タイヤ保全', d1: skills1.tyreManagement, d2: skills2.tyreManagement, fullMark: 100 },
      { axis: '雨天適性', d1: skills1.wetWeather, d2: skills2.wetWeather, fullMark: 100 },
      { axis: 'バトル力', d1: skills1.overtaking, d2: skills2.overtaking, fullMark: 100 },
      { axis: '安定感', d1: skills1.consistency, d2: skills2.consistency, fullMark: 100 },
    ];
  }, [skills1, skills2]);

  // Teammate Head-to-Head record (if exists)
  const teammateRecord = useMemo(() => {
    return TEAMMATE_HEAD_TO_HEAD_DATA.find(
      (m) =>
        (m.driver1Code === driver1.code && m.driver2Code === driver2.code) ||
        (m.driver1Code === driver2.code && m.driver2Code === driver1.code)
    );
  }, [driver1.code, driver2.code]);

  // Check if rivalry exists
  const rivalryKey = `${driver1.code}-${driver2.code}`;
  const hasRivalry = Boolean(DRIVER_RIVALRY_MAPPING[rivalryKey]);

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fade-in">
      {/* ── 1. Presets Header Bar ── */}
      <div className="glass-card p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 border border-white/10">
        <div>
          <span className="text-[10px] font-racing font-bold text-sky-400 uppercase tracking-widest block">
            HEAD-TO-HEAD COMPARISON TOOL
          </span>
          <h2 className="text-lg font-racing font-bold text-white flex items-center gap-2">
            <span>⚔️</span>
            <span>ドライバー直接比較＆スタイル分析</span>
          </h2>
        </div>

        {/* Quick Presets Pills */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          <span className="text-[11px] text-slate-400 font-mono hidden sm:inline mr-1">注目対決:</span>
          {PRESET_MATCHUPS.map((p) => {
            const isCurrent =
              (driver1Code === p.d1 && driver2Code === p.d2) ||
              (driver1Code === p.d2 && driver2Code === p.d1);
            return (
              <button
                key={p.label}
                onClick={() => {
                  setDriver1Code(p.d1);
                  setDriver2Code(p.d2);
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-racing font-bold transition-all flex items-center gap-1 ${
                  isCurrent
                    ? 'bg-sky-600 text-white shadow-md shadow-sky-500/30 ring-1 ring-sky-400/40'
                    : 'bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800 border border-white/5'
                }`}
                title={p.desc}
              >
                <span>{p.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── 2. Driver Selector Cards (Side-by-Side) ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Driver 1 Card */}
        <div
          className="glass-card p-5 border-t-4 transition-all shadow-lg relative overflow-hidden"
          style={{ borderTopColor: color1 }}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-racing font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/10 text-slate-300">
              DRIVER 1
            </span>
            <select
              value={driver1Code}
              onChange={(e) => setDriver1Code(e.target.value)}
              className="bg-slate-900 text-white text-xs rounded-lg px-2.5 py-1.5 border border-white/20 focus:outline-none focus:border-sky-400"
            >
              <optgroup label="現役ドライバー (2026)">
                {KNOWLEDGE_DRIVERS.filter((d) => d.status === 'Current').map((d) => (
                  <option key={d.code} value={d.code} disabled={d.code === driver2Code}>
                    #{d.number} {d.fullName} ({d.team})
                  </option>
                ))}
              </optgroup>
              <optgroup label="殿堂レジェンド">
                {KNOWLEDGE_DRIVERS.filter((d) => d.status === 'Legend').map((d) => (
                  <option key={d.code} value={d.code} disabled={d.code === driver2Code}>
                    🏆 {d.fullName}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>

          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center font-racing font-black text-2xl border shadow-md flex-shrink-0"
              style={{
                color: color1,
                borderColor: `${color1}80`,
                backgroundColor: `${color1}15`,
              }}
            >
              {driver1.number}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-slate-400">{driver1.country}</span>
                <span className="text-[11px] font-mono text-slate-400 font-bold">[{driver1.code}]</span>
              </div>
              <h3 className="text-lg font-bold text-white truncate leading-tight mt-0.5">
                {driver1.fullName}
              </h3>
              <p className="text-xs text-slate-300 font-medium truncate mt-0.5">
                {driver1.team}
              </p>
            </div>
          </div>

          {onSelectDriverDetail && (
            <button
              onClick={() => onSelectDriverDetail(driver1)}
              className="mt-3 text-[11px] text-sky-400 hover:text-sky-300 flex items-center gap-1 font-medium hover:underline"
            >
              <span>プロフィール詳細を見る</span>
              <span>➔</span>
            </button>
          )}
        </div>

        {/* Driver 2 Card */}
        <div
          className="glass-card p-5 border-t-4 transition-all shadow-lg relative overflow-hidden"
          style={{ borderTopColor: color2 }}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-racing font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/10 text-slate-300">
              DRIVER 2
            </span>
            <select
              value={driver2Code}
              onChange={(e) => setDriver2Code(e.target.value)}
              className="bg-slate-900 text-white text-xs rounded-lg px-2.5 py-1.5 border border-white/20 focus:outline-none focus:border-sky-400"
            >
              <optgroup label="現役ドライバー (2026)">
                {KNOWLEDGE_DRIVERS.filter((d) => d.status === 'Current').map((d) => (
                  <option key={d.code} value={d.code} disabled={d.code === driver1Code}>
                    #{d.number} {d.fullName} ({d.team})
                  </option>
                ))}
              </optgroup>
              <optgroup label="殿堂レジェンド">
                {KNOWLEDGE_DRIVERS.filter((d) => d.status === 'Legend').map((d) => (
                  <option key={d.code} value={d.code} disabled={d.code === driver1Code}>
                    🏆 {d.fullName}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>

          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center font-racing font-black text-2xl border shadow-md flex-shrink-0"
              style={{
                color: color2,
                borderColor: `${color2}80`,
                backgroundColor: `${color2}15`,
              }}
            >
              {driver2.number}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-slate-400">{driver2.country}</span>
                <span className="text-[11px] font-mono text-slate-400 font-bold">[{driver2.code}]</span>
              </div>
              <h3 className="text-lg font-bold text-white truncate leading-tight mt-0.5">
                {driver2.fullName}
              </h3>
              <p className="text-xs text-slate-300 font-medium truncate mt-0.5">
                {driver2.team}
              </p>
            </div>
          </div>

          {onSelectDriverDetail && (
            <button
              onClick={() => onSelectDriverDetail(driver2)}
              className="mt-3 text-[11px] text-sky-400 hover:text-sky-300 flex items-center gap-1 font-medium hover:underline"
            >
              <span>プロフィール詳細を見る</span>
              <span>➔</span>
            </button>
          )}
        </div>
      </div>

      {/* ── 3. Radar Chart & Skill Ratings ── */}
      <div className="glass-card p-6 border border-white/10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4 border-b border-white/10 pb-3">
          <div>
            <span className="text-[10px] font-racing font-bold text-amber-400 uppercase tracking-widest block">
              6-AXIS DRIVING SKILL RADAR
            </span>
            <h3 className="text-base font-racing font-bold text-white">
              ドライビングスタイル多角形比較
            </h3>
          </div>
          <div className="flex items-center gap-4 text-xs font-racing font-bold">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: color1 }} />
              <span className="text-white">{driver1.fullName}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: color2 }} />
              <span className="text-white">{driver2.fullName}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Radar Chart Display */}
          <div className="lg:col-span-7 h-72 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis
                  dataKey="axis"
                  tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }}
                />
                <PolarRadiusAxis angle={30} domain={[60, 100]} tick={{ fill: '#64748b', fontSize: 9 }} />
                <Radar
                  name={driver1.fullName}
                  dataKey="d1"
                  stroke={color1}
                  fill={color1}
                  fillOpacity={0.4}
                />
                <Radar
                  name={driver2.fullName}
                  dataKey="d2"
                  stroke={color2}
                  fill={color2}
                  fillOpacity={0.4}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: 'rgba(255,255,255,0.1)',
                    borderRadius: '0.75rem',
                    fontSize: '12px',
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Skill Breakdown Table */}
          <div className="lg:col-span-5 space-y-2 text-xs">
            {radarData.map((row) => {
              const diff = row.d1 - row.d2;
              return (
                <div
                  key={row.axis}
                  className="p-2 rounded-xl bg-slate-900/60 border border-white/5 flex items-center justify-between"
                >
                  <span className="text-slate-300 font-medium">{row.axis}</span>
                  <div className="flex items-center gap-3 font-mono font-bold">
                    <span style={{ color: color1 }}>{row.d1}</span>
                    <span className="text-[10px] text-slate-500 font-normal">vs</span>
                    <span style={{ color: color2 }}>{row.d2}</span>
                    <span
                      className={`text-[10px] w-8 text-right font-bold ${
                        diff > 0 ? 'text-emerald-400' : diff < 0 ? 'text-rose-400' : 'text-slate-400'
                      }`}
                    >
                      {diff > 0 ? `+${diff}` : diff === 0 ? '±0' : diff}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── 4. Career Stats Side-by-Side Comparison ── */}
      <div className="glass-card p-6 border border-white/10">
        <h3 className="text-sm font-racing font-bold text-white uppercase tracking-wider mb-4 border-b border-white/10 pb-2 flex items-center gap-2">
          <span>📊</span>
          <span>通算キャリアスタッツ比較</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 text-[11px] font-racing">
                <th className="py-2.5 px-3 text-left w-1/3">指標</th>
                <th className="py-2.5 px-3 text-center w-1/3" style={{ color: color1 }}>
                  {driver1.fullName}
                </th>
                <th className="py-2.5 px-3 text-center w-1/3" style={{ color: color2 }}>
                  {driver2.fullName}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono">
              {[
                { label: '🏆 ワールドチャンピオン', v1: driver1.championships, v2: driver2.championships, suffix: '回' },
                { label: '🏁 通算グランプリ出走', v1: driver1.entries, v2: driver2.entries, suffix: '戦' },
                { label: '🥇 通算勝利数', v1: driver1.wins, v2: driver2.wins, suffix: '勝' },
                { label: '🥈 通算表彰台', v1: driver1.podiums, v2: driver2.podiums, suffix: '回' },
                { label: '⚡ ポールポジション', v1: driver1.polePositions, v2: driver2.polePositions, suffix: '回' },
              ].map((row, idx) => {
                const isD1Ahead = row.v1 > row.v2;
                const isD2Ahead = row.v2 > row.v1;
                return (
                  <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-2.5 px-3 text-slate-300 font-sans font-medium">{row.label}</td>
                    <td
                      className={`py-2.5 px-3 text-center font-bold text-sm ${
                        isD1Ahead ? 'text-amber-400 bg-amber-500/10 rounded-lg' : 'text-slate-300'
                      }`}
                    >
                      {row.v1.toLocaleString()} {row.suffix}
                    </td>
                    <td
                      className={`py-2.5 px-3 text-center font-bold text-sm ${
                        isD2Ahead ? 'text-amber-400 bg-amber-500/10 rounded-lg' : 'text-slate-300'
                      }`}
                    >
                      {row.v2.toLocaleString()} {row.suffix}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── 5. Teammate Head-to-Head (if available) ── */}
      {teammateRecord && (
        <div className="glass-card p-6 border-l-4 border-l-purple-500 border border-white/10 bg-gradient-to-r from-purple-950/20 to-transparent">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-racing font-bold text-purple-400 uppercase tracking-widest flex items-center gap-1.5">
              <span>🏎️</span>
              <span>同一チーム直接対決記録（{teammateRecord.teamName} / {teammateRecord.years}）</span>
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              全{teammateRecord.racesCount}戦
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3">
            {/* Quali Battle */}
            <div className="p-3 rounded-xl bg-slate-900/80 border border-white/10">
              <div className="text-[11px] text-slate-400 mb-1 flex items-center justify-between">
                <span>予選勝敗 (Qualifying)</span>
                <span className="font-mono text-xs text-white font-bold">
                  {driver1.code === teammateRecord.driver1Code
                    ? `${teammateRecord.qualiScore[0]} - ${teammateRecord.qualiScore[1]}`
                    : `${teammateRecord.qualiScore[1]} - ${teammateRecord.qualiScore[0]}`}
                </span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden flex">
                <div
                  className="h-full transition-all"
                  style={{
                    backgroundColor: color1,
                    width: `${(teammateRecord.qualiScore[0] / (teammateRecord.qualiScore[0] + teammateRecord.qualiScore[1])) * 100}%`,
                  }}
                />
                <div
                  className="h-full transition-all"
                  style={{
                    backgroundColor: color2,
                    width: `${(teammateRecord.qualiScore[1] / (teammateRecord.qualiScore[0] + teammateRecord.qualiScore[1])) * 100}%`,
                  }}
                />
              </div>
            </div>

            {/* Race Battle */}
            <div className="p-3 rounded-xl bg-slate-900/80 border border-white/10">
              <div className="text-[11px] text-slate-400 mb-1 flex items-center justify-between">
                <span>決勝先着勝敗 (Race Finish)</span>
                <span className="font-mono text-xs text-white font-bold">
                  {driver1.code === teammateRecord.driver1Code
                    ? `${teammateRecord.raceScore[0]} - ${teammateRecord.raceScore[1]}`
                    : `${teammateRecord.raceScore[1]} - ${teammateRecord.raceScore[0]}`}
                </span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden flex">
                <div
                  className="h-full transition-all"
                  style={{
                    backgroundColor: color1,
                    width: `${(teammateRecord.raceScore[0] / (teammateRecord.raceScore[0] + teammateRecord.raceScore[1])) * 100}%`,
                  }}
                />
                <div
                  className="h-full transition-all"
                  style={{
                    backgroundColor: color2,
                    width: `${(teammateRecord.raceScore[1] / (teammateRecord.raceScore[0] + teammateRecord.raceScore[1])) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/40 p-3 rounded-lg border border-white/5 font-sans">
            {teammateRecord.summary}
          </p>
        </div>
      )}

      {/* ── 6. Action Links: Drama Hub & Telemetry ── */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 glass-card border border-white/10 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-950 mb-8 sm:mb-2">
        <div>
          <h4 className="text-xs font-racing font-bold text-white">
            さらなる深掘り分析・ドラマ体験
          </h4>
          <p className="text-[11px] text-slate-400">
            {hasRivalry
              ? 'この2人にはF1史に残る宿命の因縁ストーリーが存在します。'
              : '2人のマシン挙動の違いを実テレメトリーデータで比較検証できます。'}
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {hasRivalry && onNavigateToDrama && (
            <button
              onClick={onNavigateToDrama}
              className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-racing font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
            >
              <span>🎬</span>
              <span>因縁ドラマを読む</span>
              <span>➔</span>
            </button>
          )}
          {onNavigateToTelemetry && (
            <button
              onClick={() => onNavigateToTelemetry({ year: 2024, meetingName: 'Bahrain Grand Prix' })}
              className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-racing font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
            >
              <span>📊</span>
              <span>テレメトリー比較へ</span>
              <span>➔</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
