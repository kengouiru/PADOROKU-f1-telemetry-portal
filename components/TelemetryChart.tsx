'use client';

/**
 * components/TelemetryChart.tsx
 * Lap-time comparison chart with:
 *  - Clean timeline markers at chart bottom (does not obstruct telemetry lines)
 *  - Non-intrusive Inline Audio Player & AI Tactical Summary directly below chart
 *  - Quick radio lap jump pills
 *  - Tooltip preview of radio contents
 */

import React, { useMemo, useRef, useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
  type ChartOptions,
  type Plugin,
  type ChartDataset,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

import type { Driver, Lap, Stint, PitStop, SafetyCarPeriod, TeamRadio } from '@/lib/types';
import {
  enrichLapsWithStints,
  formatColor,
  getTyreColor,
  formatLapTime,
  lapsToChartData,
  mapRadioRecordingsToLaps,
} from '@/lib/telemetryUtils';

// ── Register Chart.js modules globally (idempotent) ───────────────────────────
ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend, Filler);

// ── Types ─────────────────────────────────────────────────────────────────────

interface ChartPoint {
  x: number;
  y: number;
  compound: string;
  tyreAge: number;
  s1: number | null;
  s2: number | null;
  s3: number | null;
  driverNum: string;
}

type F1Dataset = ChartDataset<'line', ChartPoint[]> & {
  originalColor: string;
  driverNum: string;
};

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
  const chartRef = useRef<ChartJS<'line', ChartPoint[]>>(null);
  const [activeRadioContext, setActiveRadioContext] = useState<ActiveRadioContext | null>(null);

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

  // ── Build datasets ─────────────────────────────────────────────────────────

  const datasets: F1Dataset[] = useMemo(() => {
    const teamColorCount: Record<string, number> = {};

    return selectedDrivers.map((driverNum) => {
      const raw = lapsCache[driverNum] ?? [];
      const enriched = enrichLapsWithStints(raw, stints, driverNum);
      const points: ChartPoint[] = lapsToChartData(enriched).map((p) => ({
        x: p.x,
        y: p.y,
        compound: p.compound,
        tyreAge: p.tyreAge,
        s1: p.s1,
        s2: p.s2,
        s3: p.s3,
        driverNum,
      }));

      const info = drivers.find((d) => d.driver_number.toString() === driverNum);
      const color = info ? formatColor(info.team_colour) : '#38bdf8';
      const code = info?.name_acronym ?? `#${driverNum}`;

      teamColorCount[color] = (teamColorCount[color] ?? 0) + 1;
      const idx = teamColorCount[color] - 1;
      const dashes: number[][] = [[], [6, 4], [2, 4]];

      return {
        label: `${code}  #${driverNum}`,
        data: points,
        borderColor: color,
        backgroundColor: color + '22',
        borderDash: dashes[idx] ?? [8, 4],
        borderWidth: 2.5,
        fill: false,
        tension: 0.2,
        pointBackgroundColor: points.map((p) => getTyreColor(p.compound)),
        pointBorderColor: points.map((p) => getTyreColor(p.compound)),
        pointRadius: 4,
        pointHoverRadius: 7,
        pointHoverBorderColor: '#fff',
        pointHoverBorderWidth: 2,
        originalColor: color,
        driverNum,
        parsing: false as never,
      } as F1Dataset;
    });
  }, [selectedDrivers, lapsCache, stints, drivers]);

  // ── Safety-car band plugin ────────────────────────────────────────────────

  const scPlugin: Plugin<'line'> = useMemo(
    () => ({
      id: 'f1_sc_bands',
      beforeDraw(chart) {
        if (!safetyCarPeriods.length) return;
        const { ctx, chartArea, scales } = chart;
        if (!chartArea || !scales.x) return;
        ctx.save();
        for (const p of safetyCarPeriods) {
          const x1 = scales.x.getPixelForValue(p.startLap);
          const x2 = scales.x.getPixelForValue(p.endLap ?? scales.x.max);
          ctx.fillStyle =
            p.type === 'RED'
              ? 'rgba(239,68,68,0.14)'
              : p.type === 'SC'
              ? 'rgba(251,146,60,0.12)'
              : 'rgba(250,204,21,0.10)';
          ctx.fillRect(x1, chartArea.top, x2 - x1, chartArea.height);
        }
        ctx.restore();
      },
    }),
    [safetyCarPeriods]
  );

  // ── Pit markers (on plot) & Radio Bottom Timeline Pins ─────────────────────

  const markersPlugin: Plugin<'line'> = useMemo(
    () => ({
      id: 'f1_markers',
      afterDatasetsDraw(chart) {
        const { ctx, chartArea, scales } = chart;
        if (!chartArea || !scales.x) return;

        // 1. Draw Pit Stop "P" Markers directly above lap points
        chart.data.datasets.forEach((ds, dsIdx) => {
          const f1ds = ds as F1Dataset;
          if (!f1ds.driverNum) return;
          const driverNum = f1ds.driverNum;
          const pits = pitStopsCache[driverNum] ?? [];
          const meta = chart.getDatasetMeta(dsIdx);

          pits.forEach((pit) => {
            const dataIdx = f1ds.data.findIndex(
              (d) => (d as ChartPoint).x === pit.lap_number
            );
            if (dataIdx === -1) return;
            const el = meta.data[dataIdx] as { x: number; y: number } | undefined;
            if (!el) return;
            ctx.save();
            ctx.fillStyle = '#ef4444';
            ctx.beginPath();
            ctx.arc(el.x, el.y - 13, 6.5, 0, 2 * Math.PI);
            ctx.fill();
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 8.5px Inter,sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('P', el.x, el.y - 13);
            ctx.restore();
          });
        });

        // 2. Draw Radio Pins neatly at the bottom timeline area (above X-axis)
        // Group radios by lap to avoid collision
        const radioLapsMap: Record<number, { driverNum: string; count: number }[]> = {};

        selectedDrivers.forEach((dNum) => {
          const radios = mappedRadios[dNum] ?? [];
          radios.forEach((r) => {
            if (r.lap_number) {
              if (!radioLapsMap[r.lap_number]) radioLapsMap[r.lap_number] = [];
              const existing = radioLapsMap[r.lap_number].find((x) => x.driverNum === dNum);
              if (existing) {
                existing.count++;
              } else {
                radioLapsMap[r.lap_number].push({ driverNum: dNum, count: 1 });
              }
            }
          });
        });

        const bottomY = chartArea.bottom - 12;

        Object.entries(radioLapsMap).forEach(([lapStr, driverEntries]) => {
          const lapNum = Number(lapStr);
          const xPos = scales.x.getPixelForValue(lapNum);
          if (xPos < chartArea.left || xPos > chartArea.right) return;

          ctx.save();

          // Subtle vertical guide line connecting bottom pin upward
          ctx.strokeStyle = 'rgba(56, 189, 248, 0.18)';
          ctx.lineWidth = 1;
          ctx.setLineDash([2, 3]);
          ctx.beginPath();
          ctx.moveTo(xPos, chartArea.top);
          ctx.lineTo(xPos, bottomY - 8);
          ctx.stroke();
          ctx.setLineDash([]);

          // Draw small radio pill at bottom
          driverEntries.forEach((entry, i) => {
            const driverInfo = drivers.find((d) => d.driver_number.toString() === entry.driverNum);
            const color = driverInfo ? formatColor(driverInfo.team_colour) : '#38bdf8';
            const offset = (i - (driverEntries.length - 1) / 2) * 14;

            ctx.fillStyle = '#0f172a';
            ctx.beginPath();
            ctx.arc(xPos + offset, bottomY, 7, 0, 2 * Math.PI);
            ctx.fill();

            ctx.lineWidth = 1.5;
            ctx.strokeStyle = color;
            ctx.beginPath();
            ctx.arc(xPos + offset, bottomY, 7, 0, 2 * Math.PI);
            ctx.stroke();

            ctx.fillStyle = color;
            ctx.font = 'bold 8px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('🎙', xPos + offset, bottomY + 0.5);
          });

          ctx.restore();
        });
      },
    }),
    [pitStopsCache, mappedRadios, selectedDrivers, drivers]
  );

  // ── Open Radio Context in Inline Panel ────────────────────────────────────

  const selectRadioContext = (driverNum: string, lapNumber: number) => {
    // Notify timeline scroll
    onLapClick?.(driverNum, lapNumber);

    const radiosOnLap = (mappedRadios[driverNum] ?? []).filter(
      (r) => r.lap_number === lapNumber
    );

    if (radiosOnLap.length > 0) {
      const driverInfo = drivers.find((d) => d.driver_number.toString() === driverNum);
      const rawLaps = lapsCache[driverNum] ?? [];
      const lapObj = rawLaps.find((l) => l.lap_number === lapNumber);
      const enriched = enrichLapsWithStints(rawLaps, stints, driverNum);
      const enrichedLap = enriched.find((l) => l.lap_number === lapNumber);

      setActiveRadioContext({
        driverNum,
        driverName: driverInfo?.full_name ?? `Driver #${driverNum}`,
        driverAcronym: driverInfo?.name_acronym ?? `#${driverNum}`,
        teamColour: driverInfo ? formatColor(driverInfo.team_colour) : '#38bdf8',
        lapNumber,
        lapDuration: lapObj?.lap_duration ?? lapObj?.lap_time ?? null,
        compound: (enrichedLap?.compound ?? 'UNKNOWN') as string,
        tyreAge: enrichedLap?.tyreAge ?? 0,
        radios: radiosOnLap,
      });
    }
  };

  // ── Chart options ─────────────────────────────────────────────────────────

  const options: ChartOptions<'line'> = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 300 },
      parsing: false,
      interaction: { mode: 'index', intersect: false },
      onClick(_, active) {
        if (!active.length) return;
        const { datasetIndex, index } = active[0];
        const ds = datasets[datasetIndex];
        const pt = ds?.data[index] as ChartPoint | undefined;
        if (ds && pt) {
          selectRadioContext(ds.driverNum, pt.x);
        }
      },
      scales: {
        x: {
          type: 'linear',
          title: {
            display: true,
            text: 'LAP',
            color: 'rgba(255,255,255,0.45)',
            font: { size: 11 },
          },
          ticks: { color: 'rgba(255,255,255,0.45)', maxTicksLimit: 16 },
          grid: { color: 'rgba(255,255,255,0.06)' },
        },
        y: {
          type: 'linear',
          suggestedMin: 88,
          suggestedMax: 130,
          title: {
            display: true,
            text: 'LAP TIME',
            color: 'rgba(255,255,255,0.45)',
            font: { size: 11 },
          },
          ticks: {
            color: 'rgba(255,255,255,0.45)',
            callback: (v) =>
              typeof v === 'number' ? formatLapTime(v) : String(v),
          },
          grid: { color: 'rgba(255,255,255,0.06)' },
        },
      },
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: {
            color: 'rgba(255,255,255,0.8)',
            font: { size: 11 },
            boxWidth: 20,
            padding: 14,
            usePointStyle: true,
          },
        },
        tooltip: {
          backgroundColor: 'rgba(8,12,30,0.96)',
          borderColor: 'rgba(255,255,255,0.12)',
          borderWidth: 1,
          titleColor: '#fff',
          bodyColor: 'rgba(255,255,255,0.7)',
          padding: 10,
          callbacks: {
            title: (items) => `Lap ${items[0]?.parsed?.x ?? '?'}`,
            label(ctx) {
              const raw = ctx.raw as ChartPoint;
              const dRadios = (mappedRadios[raw.driverNum] ?? []).filter(
                (r) => r.lap_number === raw.x
              );
              const lines = [
                `  ${ctx.dataset.label}: ${formatLapTime(raw.y)}`,
                `  Tyre: ${raw.compound} (${raw.tyreAge}L old)`,
              ];
              if (raw.s1 != null) {
                lines.push(
                  `  S1 ${raw.s1.toFixed(3)}  S2 ${(raw.s2 ?? 0).toFixed(
                    3
                  )}  S3 ${(raw.s3 ?? 0).toFixed(3)}`
                );
              }
              if (dRadios.length > 0) {
                const preview = dRadios[0].transcript
                  ? dRadios[0].transcript.slice(0, 38) + '...'
                  : '無線あり';
                lines.push(`  🎙️ 無線: "${preview}" (クリックで下部に再生展開)`);
              }
              return lines;
            },
          },
        },
      },
    }),
    [datasets, mappedRadios, drivers, lapsCache, stints]
  );

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
    <div className="glass-card p-4 flex flex-col gap-3 relative">
      {/* Title & Status */}
      <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
        <div>
          <h3 className="text-xs font-racing font-bold text-white tracking-widest border-l-2 border-f1-red pl-2 uppercase">
            LAP TIME COMPARISON & TEAM RADIO
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            グラフ下部の 🎙️ ピンまたは周回ピルをクリックすると、直下に音声とAI戦術要約が展開されます
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-3 text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="inline-flex w-3.5 h-3.5 rounded-full bg-red-500 text-white text-[9px] items-center justify-center font-bold leading-none">
              P
            </span>
            <span>ピット</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-flex w-3.5 h-3.5 rounded-full bg-slate-900 border border-sky-400 text-sky-400 text-[9px] items-center justify-center font-bold leading-none">
              🎙
            </span>
            <span>無線タイムライン</span>
          </span>
        </div>
      </div>

      {/* Chart Canvas Area */}
      <div style={{ position: 'relative', width: '100%', height: 280 }}>
        <Line
          ref={chartRef}
          data={{ datasets: datasets as ChartDataset<'line', ChartPoint[]>[] }}
          options={options}
          plugins={[scPlugin, markersPlugin]}
        />
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
  geminiApiKey: string;
  transcriptsCache: Record<string, { transcript: string; translation: string; aiSummary?: string; category: string }>;
  onTranscriptFetched?: (url: string, data: { transcript: string; translation: string; aiSummary?: string; category: string }) => void;
}

function InlineRadioPlayer({
  context,
  onClose,
  geminiApiKey,
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
  geminiApiKey,
  transcriptCache,
  onTranscriptFetched,
}: {
  radio: TeamRadio;
  context: ActiveRadioContext;
  geminiApiKey: string;
  transcriptCache?: { transcript: string; translation: string; aiSummary?: string; category: string };
  onTranscriptFetched?: (url: string, data: { transcript: string; translation: string; aiSummary?: string; category: string }) => void;
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const transcript = transcriptCache?.transcript ?? radio.transcript ?? '';
  const translation = transcriptCache?.translation ?? radio.translation ?? '';
  const aiSummary = transcriptCache?.aiSummary ?? radio.aiSummary ?? '';
  const category = (transcriptCache?.category ?? radio.category ?? 'PACE').toUpperCase();

  useEffect(() => {
    if (!radio.recording_url) return;
    const audio = new Audio(radio.recording_url);
    audioRef.current = audio;

    audio.onloadedmetadata = () => setDuration(audio.duration || 0);
    audio.ontimeupdate = () => setCurrentTime(audio.currentTime || 0);
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
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = val;
      setCurrentTime(val);
    }
  };

  // Trigger Gemini AI Tactical Summary
  const handleFetchAi = async () => {
    if (!radio.recording_url || isLoadingAi) return;
    setIsLoadingAi(true);

    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (geminiApiKey) headers['x-gemini-key'] = geminiApiKey;

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
      {/* Audio Player */}
      {radio.recording_url && (
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
      )}

      {/* Transcript, Translation, & AI Tactical Intent Summary */}
      <div className="flex-1 flex flex-col gap-1.5 text-xs">
        <div className="flex items-center gap-2">
          <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30 font-racing">
            {category}
          </span>
          <span className="text-slate-500 text-[10px] font-mono">
            {radio.date ? new Date(radio.date).toLocaleTimeString('ja-JP') : ''}
          </span>
        </div>

        {transcript && (
          <div className="space-y-0.5">
            <p className="text-white font-medium italic">"{transcript}"</p>
            {translation && <p className="text-slate-300 text-[11px]">🗣 {translation}</p>}
          </div>
        )}

        {/* AI Tactical Intent Summary */}
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
