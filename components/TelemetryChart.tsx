'use client';

/**
 * components/TelemetryChart.tsx
 * Multi-mode F1 Telemetry Chart powered by Recharts:
 *  1. Lap Times (Laps vs Lap Duration)
 *  2. Gap / Delta (Laps vs Gap relative to reference driver)
 *  3. Stint Pace (Tyre Age vs Lap Duration & Degradation)
 *
 * Unified with Recharts (bundle reduction ~250KB):
 *  - Safety Car / VSC shaded bands (ReferenceArea)
 *  - Pit stop markers & interactive points
 *  - Rich F1 Cyberpunk-styled Tooltip with tyre compounds & sector splits
 *  - Inline Team Radio Player & Gemini AI Tactical Summary
 *  - Quick radio lap jump pills
 */

import React, { useMemo, useState, useCallback, useEffect, useRef } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ReferenceArea,
  ReferenceLine,
  CartesianGrid,
} from 'recharts';

import type { Driver, Lap, Stint, PitStop, SafetyCarPeriod, TeamRadio, TyreCompound } from '@/lib/types';
import {
  enrichLapsWithStints,
  formatColor,
  getTyreColor,
  formatLapTime,
  lapsToChartData,
  mapRadioRecordingsToLaps,
  calculateCumulativeGaps,
  calculateStintDegradation,
  getProxiedAudioUrl,
} from '@/lib/telemetryUtils';
import { getGeminiAuthHeaders } from '@/lib/apiKeyService';

export type ChartMode = 'laps' | 'gap' | 'stint';

interface TelemetryChartProps {
  selectedDrivers: string[];
  lapsCache: Record<string, Lap[]>;
  drivers: Driver[];
  stints: Stint[];
  pitStopsCache: Record<string, PitStop[]>;
  teamRadioCache?: Record<string, TeamRadio[]>;
  safetyCarPeriods: SafetyCarPeriod[];
  onLapClick?: (driverNum: string, lapNumber: number) => void;
  geminiApiKey?: string;
  transcriptsCache?: Record<string, { transcript: string; translation: string; aiSummary?: string; category: string }>;
  onTranscriptFetched?: (url: string, data: { transcript: string; translation: string; aiSummary?: string; category: string }) => void;
}

interface ActiveRadioContext {
  driverNum: string;
  driverName: string;
  driverAcronym: string;
  teamColour: string;
  lapNumber: number;
  lapDuration: number | null;
  compound: string;
  tyreAge: number;
  radios: TeamRadio[];
}

interface ChartTooltipEntry {
  dataKey?: string | number | ((obj: unknown) => unknown);
  name?: string | number;
  value?: number | string | readonly (number | string)[] | null;
  color?: string;
  payload?: Record<string, unknown>;
}

interface DotCustomProps {
  key?: React.Key | null;
  cx?: number;
  cy?: number;
  payload?: Record<string, unknown>;
}

interface LapDriverMeta {
  compound: string;
  tyreAge?: number;
  s1?: number | null;
  s2?: number | null;
  s3?: number | null;
  hasRadio?: boolean;
  isPit?: boolean;
}

export default function TelemetryChart({
  selectedDrivers,
  lapsCache,
  drivers,
  stints,
  pitStopsCache,
  teamRadioCache = {},
  safetyCarPeriods,
  onLapClick,
  geminiApiKey = '',
  transcriptsCache = {},
  onTranscriptFetched,
}: TelemetryChartProps) {
  const [chartMode, setChartMode] = useState<ChartMode>('laps');
  const [activeRadioContext, setActiveRadioContext] = useState<ActiveRadioContext | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // ── Mapped Radios per Driver ───────────────────────────────────────────────
  const mappedRadios = useMemo(() => {
    const res: Record<string, TeamRadio[]> = {};
    for (const num of selectedDrivers) {
      const raw = teamRadioCache[num] ?? [];
      const laps = lapsCache[num] ?? [];
      res[num] = mapRadioRecordingsToLaps(raw, laps);
    }
    return res;
  }, [selectedDrivers, teamRadioCache, lapsCache]);

  // All radios across selected drivers for quick pills
  const allRadiosList = useMemo(() => {
    const list: { driverNum: string; radio: TeamRadio; driver: Driver | undefined }[] = [];
    selectedDrivers.forEach((num) => {
      const dRadios = mappedRadios[num] ?? [];
      const driver = drivers.find((d) => d.driver_number.toString() === num);
      dRadios.forEach((r) => {
        if (r.lap_number) {
          list.push({ driverNum: num, radio: r, driver });
        }
      });
    });
    return list.sort((a, b) => (a.radio.lap_number ?? 0) - (b.radio.lap_number ?? 0));
  }, [selectedDrivers, mappedRadios, drivers]);

  // Select a radio context to open inline player
  const selectRadioContext = useCallback(
    (driverNum: string, lapNumber: number) => {
      const driver = drivers.find((d) => d.driver_number.toString() === driverNum);
      const dRadios = (mappedRadios[driverNum] ?? []).filter((r) => r.lap_number === lapNumber);
      const lap = (lapsCache[driverNum] ?? []).find((l) => l.lap_number === lapNumber);

      let compound: string = lap?.compound ?? 'UNKNOWN';
      let tyreAge: number = lap?.tyreAge ?? 0;
      if (!lap?.compound) {
        const driverStints = stints.filter((s) => s.driver_number?.toString() === driverNum);
        for (const st of driverStints) {
          if (lapNumber >= st.lap_start && (st.lap_end == null || lapNumber <= st.lap_end)) {
            compound = st.compound ?? 'UNKNOWN';
            tyreAge = lapNumber - st.lap_start + 1;
            break;
          }
        }
      }

      setActiveRadioContext({
        driverNum,
        driverName: driver?.full_name ?? `#${driverNum}`,
        driverAcronym: driver?.name_acronym ?? `#${driverNum}`,
        teamColour: driver ? formatColor(driver.team_colour) : '#38bdf8',
        lapNumber,
        lapDuration: lap?.lap_duration ?? lap?.lap_time ?? null,
        compound,
        tyreAge,
        radios: dRadios.length > 0 ? dRadios : [
          {
            session_key: 0,
            date: new Date().toISOString(),
            driver_number: Number(driverNum),
            recording_url: '',
            transcript: '（この周回の音声データはありません）',
            translation: '',
            category: 'PACE',
            lap_number: lapNumber,
          },
        ],
      });

      onLapClick?.(driverNum, lapNumber);
    },
    [drivers, mappedRadios, lapsCache, stints, onLapClick]
  );

  // ── 1. Recharts Data for "Lap Times" mode ──────────────────────────────────
  const { lapTimesData, lapDriversConfig } = useMemo(() => {
    const lapMap = new Map<number, Record<string, any>>();
    const configs: { code: string; num: string; color: string; dash: string }[] = [];
    const teamColorCount: Record<string, number> = {};

    selectedDrivers.forEach((driverNum) => {
      const raw = lapsCache[driverNum] ?? [];
      const enriched = enrichLapsWithStints(raw, stints, driverNum);
      const pts = lapsToChartData(enriched);
      const info = drivers.find((d) => d.driver_number.toString() === driverNum);
      const color = info ? formatColor(info.team_colour) : '#38bdf8';
      const code = info?.name_acronym ?? `#${driverNum}`;

      teamColorCount[color] = (teamColorCount[color] ?? 0) + 1;
      const idx = teamColorCount[color] - 1;
      const dashes = ['', '5 5', '2 2'];

      configs.push({
        code,
        num: driverNum,
        color,
        dash: dashes[idx] || '4 4',
      });

      pts.forEach((p) => {
        if (!lapMap.has(p.x)) {
          lapMap.set(p.x, { lap: p.x });
        }
        const row = lapMap.get(p.x)!;
        row[code] = p.y;
        row[`${code}_meta`] = {
          compound: p.compound,
          tyreAge: p.tyreAge,
          s1: p.s1,
          s2: p.s2,
          s3: p.s3,
          driverNum,
          hasRadio: (mappedRadios[driverNum] ?? []).some((r) => r.lap_number === p.x),
          isPit: (pitStopsCache[driverNum] ?? []).some((pit) => pit.lap_number === p.x),
        };
      });
    });

    const data = Array.from(lapMap.values()).sort((a, b) => a.lap - b.lap);
    return { lapTimesData: data, lapDriversConfig: configs };
  }, [selectedDrivers, lapsCache, stints, drivers, mappedRadios, pitStopsCache]);

  // ── 2. Recharts Data for "Gap / Delta" mode ────────────────────────────────
  const { gapData, gapDriversConfig, refDriverCode } = useMemo(() => {
    const { series, referenceDriverNum } = calculateCumulativeGaps(
      selectedDrivers,
      drivers,
      lapsCache,
      stints
    );

    const refInfo = drivers.find((d) => d.driver_number.toString() === referenceDriverNum);
    const refCode = refInfo?.name_acronym ?? `#${referenceDriverNum}`;

    const lapMap = new Map<number, Record<string, any>>();
    const configs: { code: string; num: string; color: string; isRef: boolean; label: string }[] = [];

    series.forEach((s) => {
      const isRef = s.isReference;
      configs.push({
        code: s.driverAcronym,
        num: s.driverNum,
        color: s.teamColour,
        isRef,
        label: isRef ? `${s.driverAcronym} (基準: 0.0s)` : `${s.driverAcronym} vs ${refCode}`,
      });

      s.points.forEach((p) => {
        if (!lapMap.has(p.x)) {
          lapMap.set(p.x, { lap: p.x });
        }
        const row = lapMap.get(p.x)!;
        row[s.driverAcronym] = p.y;
        row[`${s.driverAcronym}_meta`] = {
          compound: p.compound,
          tyreAge: p.tyreAge,
          driverNum: s.driverNum,
          gapDelta: p.gapDelta,
          hasRadio: (mappedRadios[s.driverNum] ?? []).some((r) => r.lap_number === p.x),
        };
      });
    });

    const data = Array.from(lapMap.values()).sort((a, b) => a.lap - b.lap);
    return { gapData: data, gapDriversConfig: configs, refDriverCode: refCode };
  }, [selectedDrivers, drivers, lapsCache, stints, mappedRadios]);

  // ── 3. Recharts Data for "Stint Pace" mode ─────────────────────────────────
  const { stintData, stintConfigs } = useMemo(() => {
    const stintSeries = calculateStintDegradation(
      selectedDrivers,
      drivers,
      lapsCache,
      stints
    );

    const ageMap = new Map<number, Record<string, any>>();
    const configs: { key: string; label: string; color: string; dash: string; driverNum: string }[] = [];

    stintSeries.forEach((st) => {
      const key = `${st.driverAcronym}_S${st.stintNumber}`;
      const isOdd = st.stintNumber % 2 === 1;

      configs.push({
        key,
        label: `${st.driverAcronym} S${st.stintNumber} (${st.compound})`,
        color: st.teamColour,
        dash: isOdd ? '' : '6 4',
        driverNum: st.driverNum,
      });

      st.points.forEach((p) => {
        if (!ageMap.has(p.x)) {
          ageMap.set(p.x, { tyreAge: p.x });
        }
        const row = ageMap.get(p.x)!;
        row[key] = p.y;
        row[`${key}_meta`] = {
          compound: st.compound,
          lapNumber: p.lapNumber,
          driverNum: st.driverNum,
          degDelta: p.deltaFromStintStart,
        };
      });
    });

    const data = Array.from(ageMap.values()).sort((a, b) => a.tyreAge - b.tyreAge);
    return { stintData: data, stintConfigs: configs };
  }, [selectedDrivers, drivers, lapsCache, stints]);

  // ── Empty state ───────────────────────────────────────────────────────────
  if (selectedDrivers.length === 0) {
    return (
      <div
        className="glass-card flex flex-col items-center justify-center gap-3 text-slate-500"
        style={{ height: 320 }}
      >
        <span className="text-4xl">📈</span>
        <span className="text-sm">ドライバーを選択してラップタイムをプロット</span>
      </div>
    );
  }

  return (
    <div className="glass-card-premium p-4 sm:p-5 flex flex-col gap-3.5 relative overflow-hidden rounded-2xl shadow-2xl">
      {/* F1 Red gradient accent line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-red-600 via-rose-500 to-amber-500" />

      {/* Title & Mode Switcher Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-white/10 pb-3">
        <div>
          <h3 className="text-xs font-racing font-bold text-white tracking-widest border-l-2 border-f1-red pl-2 uppercase flex items-center gap-2">
            <span>{chartMode === 'laps'
              ? 'LAP TIME COMPARISON'
              : chartMode === 'gap'
              ? 'GAP / DELTA TO REFERENCE'
              : 'STINT & TYRE DEGRADATION'}</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5 font-mono">
            {chartMode === 'laps' && '周回ごとのラップタイム推移とセーフティカー・無線連動'}
            {chartMode === 'gap' && `基準ドライバー (${refDriverCode}) に対するタイム差（秒）の推移・アンダーカット分析`}
            {chartMode === 'stint' && 'タイヤ周回数（Tyre Age）に応じたデグラデーション（劣化傾向）の比較'}
          </p>
        </div>

        {/* Mode Switcher Pills */}
        <div className="flex bg-slate-950/90 rounded-xl p-1 border border-white/10 self-start sm:self-auto shadow-inner">
          {(
            [
              ['laps', '📈 Lap Times'],
              ['gap', '⏱️ Gap / Delta'],
              ['stint', '🛞 Stint Pace'],
            ] as [ChartMode, string][]
          ).map(([mode, label]) => (
            <button
              key={mode}
              onClick={() => setChartMode(mode)}
              className={`px-3 py-1.5 rounded-lg text-xs font-racing font-bold transition-all cursor-pointer ${
                chartMode === mode
                  ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white font-bold shadow-md shadow-red-600/30 ring-1 ring-red-400/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Recharts Chart Area */}
      <div style={{ position: 'relative', width: '100%', height: 300 }}>
        {isMounted ? (
          <ResponsiveContainer width="100%" height="100%">
            {chartMode === 'laps' ? (
              <LineChart data={lapTimesData} margin={{ top: 12, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} />
                <XAxis
                  dataKey="lap"
                  stroke="#94a3b8"
                  fontSize={11}
                  tickFormatter={(v) => `L${v}`}
                  dy={4}
                />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={11}
                  domain={['auto', 'auto']}
                  tickFormatter={(v) => formatLapTime(v)}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (!active || !payload?.length) return null;
                    return (
                      <div className="bg-slate-950/95 border border-white/15 rounded-xl p-3 shadow-2xl backdrop-blur-md text-xs font-mono min-w-[220px]">
                        <div className="border-b border-white/10 pb-1.5 mb-2 flex items-center justify-between">
                          <span className="font-racing font-bold text-white tracking-wider">
                            LAP {label}
                          </span>
                          <span className="text-[10px] text-slate-400">TELEMETRY</span>
                        </div>
                        <div className="space-y-2">
                          {payload.map((entry: ChartTooltipEntry) => {
                            const code = String(entry.dataKey ?? '');
                            const meta = entry.payload ? (entry.payload[`${code}_meta`] as LapDriverMeta | undefined) : null;
                            if (!meta || entry.value == null) return null;
                            const tyreCol = getTyreColor(meta.compound);
                            return (
                              <div key={code} className="flex flex-col gap-0.5">
                                <div className="flex items-center justify-between gap-3">
                                  <span className="font-bold" style={{ color: entry.color }}>
                                    {code}
                                  </span>
                                  <span className="text-white font-bold">
                                    {formatLapTime(typeof entry.value === 'number' ? entry.value : Number(entry.value))}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                                  <span
                                    className="px-1 py-0.2 rounded text-[9px] font-bold border"
                                    style={{
                                      borderColor: `${tyreCol}66`,
                                      color: tyreCol,
                                      backgroundColor: `${tyreCol}1a`,
                                    }}
                                  >
                                    {meta.compound} ({meta.tyreAge}L)
                                  </span>
                                  {meta.s1 != null && (
                                    <span>
                                      S1: {meta.s1.toFixed(1)} S2: {(meta.s2 ?? 0).toFixed(1)} S3: {(meta.s3 ?? 0).toFixed(1)}
                                    </span>
                                  )}
                                  {meta.hasRadio && (
                                    <span className="text-amber-400 font-bold">🎙️ RADIO</span>
                                  )}
                                  {meta.isPit && (
                                    <span className="text-red-400 font-bold">🅿️ PIT</span>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  }}
                />
                <Legend
                  wrapperStyle={{ paddingTop: 8, fontSize: 11 }}
                  formatter={(value) => <span className="text-slate-300 font-bold text-xs">{value}</span>}
                />

                {/* Safety Car / VSC shaded zones */}
                {safetyCarPeriods.map((p, idx) => (
                  <ReferenceArea
                    key={idx}
                    x1={p.startLap}
                    x2={p.endLap ?? undefined}
                    fill={p.type === 'RED' ? '#ef4444' : p.type === 'SC' ? '#f97316' : '#eab308'}
                    fillOpacity={0.12}
                    strokeOpacity={0.3}
                  />
                ))}

                {/* Driver Lines */}
                {lapDriversConfig.map((cfg) => (
                  <Line
                    key={cfg.code}
                    type="monotone"
                    dataKey={cfg.code}
                    name={cfg.code}
                    stroke={cfg.color}
                    strokeDasharray={cfg.dash}
                    strokeWidth={2.5}
                    dot={(props: DotCustomProps) => {
                      const meta = props.payload ? (props.payload[`${cfg.code}_meta`] as LapDriverMeta | undefined) : null;
                      if (!meta) return <circle key={props.key} cx={props.cx} cy={props.cy} r={2} fill={cfg.color} />;
                      const tyreCol = getTyreColor(meta.compound);
                      const lapNum = Number((props.payload as { lap?: number })?.lap ?? 0);
                      if (meta.hasRadio || meta.isPit) {
                        return (
                          <circle
                            key={props.key}
                            cx={props.cx}
                            cy={props.cy}
                            r={5}
                            fill={meta.isPit ? '#ef4444' : '#38bdf8'}
                            stroke="#fff"
                            strokeWidth={1.5}
                            className="cursor-pointer"
                            onClick={() => selectRadioContext(cfg.num, lapNum)}
                          />
                        );
                      }
                      return (
                        <circle
                          key={props.key}
                          cx={props.cx}
                          cy={props.cy}
                          r={3}
                          fill={tyreCol}
                          stroke={cfg.color}
                          strokeWidth={1}
                          className="cursor-pointer"
                          onClick={() => selectRadioContext(cfg.num, lapNum)}
                        />
                      );
                    }}
                    activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2 }}
                    connectNulls
                  />
                ))}
              </LineChart>
            ) : chartMode === 'gap' ? (
              <LineChart data={gapData} margin={{ top: 12, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} />
                <XAxis
                  dataKey="lap"
                  stroke="#94a3b8"
                  fontSize={11}
                  tickFormatter={(v) => `L${v}`}
                  dy={4}
                />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={11}
                  domain={['auto', 'auto']}
                  tickFormatter={(v) => `${v > 0 ? '+' : ''}${v.toFixed(1)}s`}
                />
                <ReferenceLine y={0} stroke="#94a3b8" strokeDasharray="3 3" />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (!active || !payload?.length) return null;
                    return (
                      <div className="bg-slate-950/95 border border-white/15 rounded-xl p-3 shadow-2xl backdrop-blur-md text-xs font-mono min-w-[200px]">
                        <div className="border-b border-white/10 pb-1.5 mb-2 flex items-center justify-between">
                          <span className="font-racing font-bold text-white">LAP {label}</span>
                          <span className="text-[10px] text-slate-400">GAP TO {refDriverCode}</span>
                        </div>
                        <div className="space-y-1.5">
                          {payload.map((entry: ChartTooltipEntry) => {
                            const code = String(entry.dataKey ?? '');
                            if (entry.value == null) return null;
                            const valNum = Number(entry.value);
                            return (
                              <div key={code} className="flex items-center justify-between gap-3">
                                <span className="font-bold" style={{ color: entry.color }}>
                                  {code}
                                </span>
                                <span className="text-white font-bold">
                                  {valNum === 0 ? '基準 (0.0s)' : `+${valNum.toFixed(2)}s`}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  }}
                />
                <Legend
                  wrapperStyle={{ paddingTop: 8, fontSize: 11 }}
                  formatter={(value) => <span className="text-slate-300 font-bold text-xs">{value}</span>}
                />

                {/* Driver Lines */}
                {gapDriversConfig.map((cfg) => (
                  <Line
                    key={cfg.code}
                    type="monotone"
                    dataKey={cfg.code}
                    name={cfg.label}
                    stroke={cfg.color}
                    strokeDasharray={cfg.isRef ? '3 3' : ''}
                    strokeWidth={cfg.isRef ? 1.5 : 2.5}
                    dot={{ r: cfg.isRef ? 1 : 3, fill: cfg.color }}
                    activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2 }}
                    connectNulls
                  />
                ))}
              </LineChart>
            ) : (
              <LineChart data={stintData} margin={{ top: 12, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} />
                <XAxis
                  dataKey="tyreAge"
                  stroke="#94a3b8"
                  fontSize={11}
                  tickFormatter={(v) => `${v}L`}
                  dy={4}
                />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={11}
                  domain={['auto', 'auto']}
                  tickFormatter={(v) => formatLapTime(v)}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (!active || !payload?.length) return null;
                    return (
                      <div className="bg-slate-950/95 border border-white/15 rounded-xl p-3 shadow-2xl backdrop-blur-md text-xs font-mono min-w-[210px]">
                        <div className="border-b border-white/10 pb-1.5 mb-2 flex items-center justify-between">
                          <span className="font-racing font-bold text-white">TYRE AGE: {label} LAPS</span>
                        </div>
                        <div className="space-y-1.5">
                          {payload.map((entry: ChartTooltipEntry) => {
                            if (entry.value == null) return null;
                            const keyStr = String(entry.dataKey ?? '');
                            return (
                              <div key={keyStr} className="flex items-center justify-between gap-3">
                                <span className="font-bold text-[11px]" style={{ color: entry.color }}>
                                  {entry.name}
                                </span>
                                <span className="text-white font-bold">
                                  {formatLapTime(typeof entry.value === 'number' ? entry.value : Number(entry.value))}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  }}
                />
                <Legend
                  wrapperStyle={{ paddingTop: 8, fontSize: 11 }}
                  formatter={(value) => <span className="text-slate-300 font-bold text-xs">{value}</span>}
                />

                {/* Stint Lines */}
                {stintConfigs.map((cfg) => (
                  <Line
                    key={cfg.key}
                    type="monotone"
                    dataKey={cfg.key}
                    name={cfg.label}
                    stroke={cfg.color}
                    strokeDasharray={cfg.dash}
                    strokeWidth={2.5}
                    dot={{ r: 3, fill: cfg.color }}
                    activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2 }}
                    connectNulls
                  />
                ))}
              </LineChart>
            )}
          </ResponsiveContainer>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-900/40 rounded-xl border border-white/5 animate-pulse">
            <span className="text-xs font-mono text-slate-500">チャート読み込み中...</span>
          </div>
        )}
      </div>

      {/* Quick Radio Lap Jump Bar (Pills directly below chart) */}
      {allRadiosList.length > 0 && (
        <div className="bg-slate-950/40 border border-white/5 rounded-xl p-2 flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-[10px] text-slate-500 font-racing uppercase tracking-wider flex-shrink-0 flex items-center gap-1">
            <span>🎙️</span>
            <span>無線の周回:</span>
          </span>
          <div className="flex items-center gap-1.5 flex-nowrap">
            {allRadiosList.map(({ driverNum, radio, driver }, idx) => {
              const color = driver ? formatColor(driver.team_colour) : '#38bdf8';
              const isSelected =
                activeRadioContext?.driverNum === driverNum &&
                activeRadioContext?.lapNumber === radio.lap_number;

              return (
                <button
                  key={idx}
                  onClick={() => selectRadioContext(driverNum, radio.lap_number!)}
                  className={`px-2 py-0.5 rounded-lg border text-[11px] font-mono transition-all flex items-center gap-1 flex-shrink-0 ${
                    isSelected
                      ? 'bg-sky-500/20 border-sky-400 text-white shadow-[0_0_10px_rgba(56,189,248,0.4)]'
                      : 'bg-slate-900/80 border-white/10 text-slate-300 hover:border-white/30 hover:bg-slate-800'
                  }`}
                  style={{
                    borderLeftWidth: 3,
                    borderLeftColor: color,
                  }}
                  title={`Lap ${radio.lap_number}: ${driver?.name_acronym} - ${radio.transcript ?? ''}`}
                >
                  <span className="font-bold" style={{ color }}>
                    {driver?.name_acronym}
                  </span>
                  <span>L{radio.lap_number}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── INLINE Team Radio & Tactical AI Summary Player (Directly Below Chart) ── */}
      {activeRadioContext && (
        <InlineRadioPlayer
          context={activeRadioContext}
          onClose={() => setActiveRadioContext(null)}
          geminiApiKey={geminiApiKey}
          transcriptsCache={transcriptsCache}
          onTranscriptFetched={onTranscriptFetched}
        />
      )}
    </div>
  );
}

// ── Inline Radio Player & AI Tactical Summary Component ────────────────────────

interface InlineRadioPlayerProps {
  context: ActiveRadioContext;
  onClose: () => void;
  geminiApiKey?: string;
  transcriptsCache: Record<string, { transcript: string; translation: string; aiSummary?: string; category: string }>;
  onTranscriptFetched?: (url: string, data: { transcript: string; translation: string; aiSummary?: string; category: string }) => void;
}

function InlineRadioPlayer({
  context,
  onClose,
  geminiApiKey = '',
  transcriptsCache,
  onTranscriptFetched,
}: InlineRadioPlayerProps) {
  return (
    <div className="bg-slate-900/90 border border-sky-500/30 rounded-2xl p-4 shadow-xl flex flex-col gap-3 transition-all duration-300 animate-fade-in relative overflow-hidden">
      {/* Background accent line */}
      <div
        className="absolute top-0 left-0 bottom-0 w-1.5"
        style={{ backgroundColor: context.teamColour }}
      />

      {/* Header with lap telemetry context and close button */}
      <div className="flex items-center justify-between pl-2 border-b border-white/10 pb-2.5">
        <div className="flex items-center gap-2.5 flex-wrap">
          <span
            className="font-racing font-bold text-xs px-2 py-0.5 rounded border"
            style={{
              borderColor: `${context.teamColour}60`,
              color: context.teamColour,
              backgroundColor: `${context.teamColour}15`,
            }}
          >
            {context.driverAcronym}
          </span>
          <span className="text-white font-bold text-sm">
            {context.driverName}
          </span>
          <span className="text-xs text-slate-400 font-mono">
            #{context.driverNum}
          </span>
          <span className="text-slate-600 hidden sm:inline">•</span>
          <div className="flex items-center gap-2 text-xs text-slate-300 font-mono bg-slate-950/60 px-2 py-0.5 rounded border border-white/5">
            <span className="text-sky-400 font-bold">Lap {context.lapNumber}</span>
            <span>⏱️ {formatLapTime(context.lapDuration)}</span>
            <span>🛞 {context.compound} ({context.tyreAge}L)</span>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="text-xs text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1"
        >
          <span>✕</span>
          <span className="hidden sm:inline">閉じる</span>
        </button>
      </div>

      {/* Radio items on this lap */}
      <div className="space-y-3 pl-2">
        {context.radios.map((radio, idx) => (
          <InlineRadioItem
            key={idx}
            radio={radio}
            context={context}
            geminiApiKey={geminiApiKey}
            transcriptCache={radio.recording_url ? transcriptsCache[radio.recording_url] : undefined}
            onTranscriptFetched={onTranscriptFetched}
          />
        ))}
      </div>
    </div>
  );
}

function InlineRadioItem({
  radio,
  context,
  geminiApiKey = '',
  transcriptCache,
  onTranscriptFetched,
}: {
  radio: TeamRadio;
  context: ActiveRadioContext;
  geminiApiKey?: string;
  transcriptCache?: { transcript: string; translation: string; aiSummary?: string; category: string };
  onTranscriptFetched?: (url: string, data: { transcript: string; translation: string; aiSummary?: string; category: string }) => void;
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const transcript = transcriptCache?.transcript ?? radio.transcript ?? '';
  const translation = transcriptCache?.translation ?? radio.translation ?? '';
  const aiSummary = transcriptCache?.aiSummary ?? radio.aiSummary ?? '';
  const category = (transcriptCache?.category ?? radio.category ?? 'PACE').toUpperCase();

  useEffect(() => {
    if (!radio.recording_url) return;
    setAudioError(false);
    const audio = new Audio(getProxiedAudioUrl(radio.recording_url));
    audioRef.current = audio;

    audio.onloadedmetadata = () => setDuration(audio.duration || 0);
    audio.ontimeupdate = () => setCurrentTime(audio.currentTime || 0);
    audio.onerror = () => {
      setAudioError(true);
      setIsPlaying(false);
    };
    audio.onended = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, [radio.recording_url]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          setAudioError(false);
        })
        .catch(() => {
          setAudioError(true);
          setIsPlaying(false);
        });
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = val;
      setCurrentTime(val);
    }
  };

  const handleFetchAi = async () => {
    if (!radio.recording_url || isLoadingAi) return;
    setIsLoadingAi(true);

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...getGeminiAuthHeaders(),
      };

      const lapContext = `Lap ${context.lapNumber}, Lap Time: ${formatLapTime(
        context.lapDuration
      )}, Tyre: ${context.compound} (${context.tyreAge} laps old)`;

      const res = await fetch('/api/transcribe', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          audioUrl: radio.recording_url,
          driverNumber: Number(context.driverNum),
          driverName: context.driverName,
          lapNumber: context.lapNumber,
          lapContext,
        }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as {
        transcript: string;
        translation: string;
        aiSummary: string;
        category: string;
      };

      onTranscriptFetched?.(radio.recording_url, data);
    } catch (e) {
      console.warn('[Radio AI] Failed:', e);
    } finally {
      setIsLoadingAi(false);
    }
  };

  return (
    <div className="bg-slate-950/70 border border-white/10 rounded-xl p-3 flex flex-col md:flex-row gap-3 md:items-center">
      {/* Audio Player or Error / Missing Fallback */}
      {radio.recording_url && !audioError ? (
        <div className="flex items-center gap-2.5 bg-slate-900/90 px-3 py-2 rounded-xl border border-white/5 md:w-64 flex-shrink-0">
          <button
            onClick={togglePlay}
            className="w-8 h-8 rounded-full bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center text-xs transition-colors flex-shrink-0 shadow-md"
          >
            {isPlaying ? '⏸' : '▶'}
          </button>
          <div className="flex-1 flex flex-col gap-0.5">
            <input
              type="range"
              min={0}
              max={duration || 100}
              step={0.1}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <div className="flex justify-between text-[9px] text-slate-500 font-mono">
              <span>{currentTime.toFixed(1)}s</span>
              <span>{duration ? `${duration.toFixed(1)}s` : '--'}</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2 bg-slate-900/60 px-3 py-2 rounded-xl border border-yellow-500/20 md:w-64 flex-shrink-0 text-slate-400 text-xs">
          <span className="text-yellow-400">⚠️</span>
          <span className="text-[11px]">
            {audioError ? '音声ファイル読込不可' : '音声データなし'}
          </span>
        </div>
      )}

      {/* Transcript, Translation, & AI Tactical Intent Summary */}
      <div className="flex-1 flex flex-col gap-1.5 text-xs">
        <div className="flex items-center gap-2">
          <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30 font-racing">
            {category}
          </span>
          <span suppressHydrationWarning className="text-slate-500 text-[10px] font-mono">
            {radio.date ? new Date(radio.date).toLocaleTimeString('ja-JP', { timeZone: 'Asia/Tokyo' }) : ''}
          </span>
        </div>

        {transcript && (
          <div className="space-y-0.5">
            <p className="text-white font-medium italic">&ldquo;{transcript}&rdquo;</p>
            {translation && <p className="text-slate-300 text-[11px]">🗣 {translation}</p>}
          </div>
        )}

        {aiSummary ? (
          <div className="bg-purple-950/30 border border-purple-500/30 rounded-lg p-2 text-xs text-purple-200 mt-0.5">
            <span className="text-[10px] font-bold text-purple-400 block mb-0.5 uppercase tracking-wider">
              ✨ AI 戦術意図・背景解説
            </span>
            <p className="leading-relaxed text-slate-200 text-[11px]">{aiSummary}</p>
          </div>
        ) : (
          <div className="pt-0.5">
            <button
              onClick={handleFetchAi}
              disabled={isLoadingAi || !radio.recording_url}
              className="py-1 px-2.5 rounded-lg bg-purple-900/40 hover:bg-purple-900/60 border border-purple-500/40 text-purple-200 text-[11px] font-medium flex items-center gap-1.5 transition-all disabled:opacity-50"
            >
              {isLoadingAi ? (
                <>
                  <span className="w-2.5 h-2.5 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
                  <span>AI戦術要約を生成中...</span>
                </>
              ) : (
                <>
                  <span>✨</span>
                  <span>Geminiで無線意図・戦術背景を要約</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
