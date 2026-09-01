'use client';

/**
 * components/TelemetryChart.tsx
 * Lap-time comparison chart with:
 *  - Safety Car / VSC / Red Flag shaded bands
 *  - Pit stop "P" markers
 *  - Team Radio "🎙️" pins at corresponding laps
 *  - Interactive Radio & Lap Context Popover Modal with Audio Player & AI Summary
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

interface ActiveRadioModal {
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
  const [activeModal, setActiveModal] = useState<ActiveRadioModal | null>(null);

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

  // ── Pit-stop "P" & Team Radio "🎙️" markers plugin ──────────────────────────

  const markersPlugin: Plugin<'line'> = useMemo(
    () => ({
      id: 'f1_markers',
      afterDatasetsDraw(chart) {
        const { ctx } = chart;
        chart.data.datasets.forEach((ds, dsIdx) => {
          const f1ds = ds as F1Dataset;
          if (!f1ds.driverNum) return;
          const driverNum = f1ds.driverNum;
          const pits = pitStopsCache[driverNum] ?? [];
          const radios = mappedRadios[driverNum] ?? [];
          const meta = chart.getDatasetMeta(dsIdx);

          // 1. Draw Pit Stop "P" Markers (Red circle)
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
            ctx.arc(el.x, el.y - 14, 7, 0, 2 * Math.PI);
            ctx.fill();
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 9px Inter,sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('P', el.x, el.y - 14);
            ctx.restore();
          });

          // 2. Draw Radio "🎙️" / "R" Markers (Cyan badge above point)
          const radioLapNumbers = new Set(
            radios
              .map((r) => r.lap_number)
              .filter((lap): lap is number => lap !== null && lap !== undefined)
          );

          radioLapNumbers.forEach((lapNum) => {
            const dataIdx = f1ds.data.findIndex(
              (d) => (d as ChartPoint).x === lapNum
            );
            if (dataIdx === -1) return;
            const el = meta.data[dataIdx] as { x: number; y: number } | undefined;
            if (!el) return;

            // Offset higher if pit stop also exists on this lap
            const hasPit = pits.some((p) => p.lap_number === lapNum);
            const yOffset = hasPit ? el.y - 30 : el.y - 15;

            ctx.save();
            // Outer glow / background
            ctx.fillStyle = '#0284c7';
            ctx.beginPath();
            ctx.arc(el.x, yOffset, 7.5, 0, 2 * Math.PI);
            ctx.fill();
            ctx.lineWidth = 1.5;
            ctx.strokeStyle = '#38bdf8';
            ctx.stroke();

            // Icon symbol
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 9px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('🎙', el.x, yOffset + 0.5);
            ctx.restore();
          });
        });
      },
    }),
    [pitStopsCache, mappedRadios]
  );

  // ── Open Radio / Context Popover ──────────────────────────────────────────

  const handlePointClick = (driverNum: string, lapNumber: number) => {
    // Trigger timeline scroll
    onLapClick?.(driverNum, lapNumber);

    // Check if radios exist on this lap
    const radiosOnLap = (mappedRadios[driverNum] ?? []).filter(
      (r) => r.lap_number === lapNumber
    );

    if (radiosOnLap.length > 0) {
      const driverInfo = drivers.find((d) => d.driver_number.toString() === driverNum);
      const rawLaps = lapsCache[driverNum] ?? [];
      const lapObj = rawLaps.find((l) => l.lap_number === lapNumber);
      const enriched = enrichLapsWithStints(rawLaps, stints, driverNum);
      const enrichedLap = enriched.find((l) => l.lap_number === lapNumber);

      setActiveModal({
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
          handlePointClick(ds.driverNum, pt.x);
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
          backgroundColor: 'rgba(8,12,30,0.97)',
          borderColor: 'rgba(255,255,255,0.12)',
          borderWidth: 1,
          titleColor: '#fff',
          bodyColor: 'rgba(255,255,255,0.65)',
          callbacks: {
            title: (items) => `Lap ${items[0]?.parsed?.x ?? '?'}`,
            label(ctx) {
              const raw = ctx.raw as ChartPoint;
              const hasRadio = (mappedRadios[raw.driverNum] ?? []).some(
                (r) => r.lap_number === raw.x
              );
              return [
                `  ${ctx.dataset.label}: ${formatLapTime(raw.y)}`,
                `  Tyre: ${raw.compound} (${raw.tyreAge}L old)`,
                ...(raw.s1 != null
                  ? [
                      `  S1 ${raw.s1.toFixed(3)}  S2 ${(raw.s2 ?? 0).toFixed(
                        3
                      )}  S3 ${(raw.s3 ?? 0).toFixed(3)}`,
                    ]
                  : []),
                ...(hasRadio ? ['  🎙️ チーム無線あり (クリックで再生・AI要約)'] : []),
              ];
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
    <div className="glass-card p-4 relative">
      {/* Title */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-racing font-bold text-white tracking-widest border-l-2 border-f1-red pl-2 uppercase">
          LAP TIME COMPARISON & TEAM RADIO
        </h3>
        <span className="text-xs text-slate-500 hidden sm:inline">
          🎙️マークをクリックで無線再生 & AI戦術要約
        </span>
      </div>

      {/* Chart canvas */}
      <div style={{ position: 'relative', width: '100%', height: 280 }}>
        <Line
          ref={chartRef}
          data={{ datasets: datasets as ChartDataset<'line', ChartPoint[]>[] }}
          options={options}
          plugins={[scPlugin, markersPlugin]}
        />
      </div>

      {/* Legend: SC bands & Markers */}
      <div className="flex flex-wrap gap-4 mt-3 text-xs text-slate-500 items-center">
        {safetyCarPeriods.length > 0 && (
          <>
            <span className="flex items-center gap-1.5">
              <span
                className="w-3 h-3 rounded-sm"
                style={{ background: 'rgba(251,146,60,0.35)' }}
              />
              SC帯
            </span>
            <span className="flex items-center gap-1.5">
              <span
                className="w-3 h-3 rounded-sm"
                style={{ background: 'rgba(250,204,21,0.25)' }}
              />
              VSC帯
            </span>
            <span className="flex items-center gap-1.5">
              <span
                className="w-3 h-3 rounded-sm"
                style={{ background: 'rgba(239,68,68,0.30)' }}
              />
              赤旗
            </span>
          </>
        )}
        <span className="flex items-center gap-1.5">
          <span className="inline-flex w-4 h-4 rounded-full bg-red-500 text-white text-xs items-center justify-center font-bold leading-none">
            P
          </span>
          ピットストップ
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-flex w-4 h-4 rounded-full bg-sky-600 text-white text-[10px] items-center justify-center font-bold leading-none border border-sky-400">
            🎙
          </span>
          チーム無線
        </span>
        <span className="flex items-center gap-1.5 ml-auto">
          <span className="inline-block w-3 h-3 rounded-full bg-pink-500" />
          SOFT
          <span className="inline-block w-3 h-3 rounded-full bg-yellow-400 ml-2" />
          MED
          <span className="inline-block w-3 h-3 rounded-full bg-gray-200 ml-2" />
          HARD
        </span>
      </div>

      {/* ── Radio Detail Modal Popover ───────────────────────────────────────── */}
      {activeModal && (
        <RadioDetailModal
          modal={activeModal}
          onClose={() => setActiveModal(null)}
          geminiApiKey={geminiApiKey}
          transcriptsCache={transcriptsCache}
          onTranscriptFetched={onTranscriptFetched}
        />
      )}
    </div>
  );
}

// ── Interactive Radio & AI Tactical Summary Modal ──────────────────────────────

interface RadioDetailModalProps {
  modal: ActiveRadioModal;
  onClose: () => void;
  geminiApiKey: string;
  transcriptsCache: Record<string, { transcript: string; translation: string; aiSummary?: string; category: string }>;
  onTranscriptFetched?: (url: string, data: { transcript: string; translation: string; aiSummary?: string; category: string }) => void;
}

function RadioDetailModal({
  modal,
  onClose,
  geminiApiKey,
  transcriptsCache,
  onTranscriptFetched,
}: RadioDetailModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-slate-900 border border-white/15 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
        {/* Header */}
        <div
          className="p-4 border-b border-white/10 flex items-center justify-between"
          style={{ borderLeftWidth: 4, borderLeftColor: modal.teamColour }}
        >
          <div className="flex items-center gap-2.5">
            <span
              className="font-racing font-bold text-sm px-2 py-0.5 rounded border"
              style={{
                borderColor: `${modal.teamColour}60`,
                color: modal.teamColour,
                backgroundColor: `${modal.teamColour}15`,
              }}
            >
              {modal.driverAcronym}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-white font-bold text-sm">
                  {modal.driverName}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  #{modal.driverNum}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                <span>周回: Lap {modal.lapNumber}</span>
                <span>•</span>
                <span>タイム: {formatLapTime(modal.lapDuration)}</span>
                <span>•</span>
                <span>タイヤ: {modal.compound} ({modal.tyreAge}L)</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors text-sm"
          >
            ✕
          </button>
        </div>

        {/* Content list */}
        <div className="p-4 overflow-y-auto space-y-4 flex-1">
          <div className="text-xs font-racing font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <span>🎙️</span>
            <span>TEAM RADIO MESSAGES ON LAP {modal.lapNumber} ({modal.radios.length}件)</span>
          </div>

          {modal.radios.map((radio, idx) => (
            <RadioPlayCard
              key={idx}
              radio={radio}
              modal={modal}
              geminiApiKey={geminiApiKey}
              transcriptCache={radio.recording_url ? transcriptsCache[radio.recording_url] : undefined}
              onTranscriptFetched={onTranscriptFetched}
            />
          ))}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-950/60 border-t border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium transition-colors"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Audio Player + Tactical AI Summary Card ───────────────────────────────────

function RadioPlayCard({
  radio,
  modal,
  geminiApiKey,
  transcriptCache,
  onTranscriptFetched,
}: {
  radio: TeamRadio;
  modal: ActiveRadioModal;
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

  // Audio initialize & listener
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

      const lapContext = `Lap ${modal.lapNumber}, Lap Time: ${formatLapTime(
        modal.lapDuration
      )}, Tyre: ${modal.compound} (${modal.tyreAge} laps old)`;

      const res = await fetch('/api/transcribe', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          audioUrl: radio.recording_url,
          driverNumber: Number(modal.driverNum),
          driverName: modal.driverName,
          lapNumber: modal.lapNumber,
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
    <div className="bg-slate-800/60 border border-white/10 rounded-xl p-3.5 flex flex-col gap-3">
      {/* Category Badge & Time */}
      <div className="flex items-center justify-between">
        <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider bg-blue-500/20 text-blue-300 border border-blue-500/30">
          {category}
        </span>
        <span className="text-[11px] text-slate-500 font-mono">
          {radio.date ? new Date(radio.date).toLocaleTimeString('ja-JP') : ''}
        </span>
      </div>

      {/* Audio Player Controls */}
      {radio.recording_url && (
        <div className="bg-slate-900/80 rounded-lg p-2.5 border border-white/5 flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <button
              onClick={togglePlay}
              className="w-8 h-8 rounded-full bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center text-xs transition-colors flex-shrink-0"
            >
              {isPlaying ? '⏸' : '▶'}
            </button>
            {/* Seek bar */}
            <div className="flex-1 flex flex-col gap-1">
              <input
                type="range"
                min={0}
                max={duration || 100}
                step={0.1}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>{currentTime.toFixed(1)}s</span>
                <span>{duration ? `${duration.toFixed(1)}s` : '--'}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Transcripts (English & Japanese) */}
      <div className="space-y-1 text-xs">
        {transcript ? (
          <>
            <p className="text-white font-medium italic">"{transcript}"</p>
            {translation && <p className="text-slate-300">🗣 {translation}</p>}
          </>
        ) : (
          <p className="text-slate-500 italic text-xs">文字起こし未取得</p>
        )}
      </div>

      {/* AI Tactical Intent Summary */}
      {aiSummary ? (
        <div className="bg-purple-950/30 border border-purple-500/30 rounded-lg p-2.5 text-xs text-purple-200 flex flex-col gap-1">
          <span className="text-[10px] font-bold text-purple-400 flex items-center gap-1 uppercase tracking-wider">
            <span>✨</span>
            <span>AI 戦術意図・背景解説</span>
          </span>
          <p className="leading-relaxed text-slate-200">{aiSummary}</p>
        </div>
      ) : (
        <div className="pt-1">
          <button
            onClick={handleFetchAi}
            disabled={isLoadingAi || !radio.recording_url}
            className="w-full py-1.5 px-3 rounded-lg bg-gradient-to-r from-purple-900/50 to-blue-900/50 hover:from-purple-900/70 hover:to-blue-900/70 border border-purple-500/40 text-purple-200 text-xs font-medium flex items-center justify-center gap-1.5 transition-all disabled:opacity-50"
          >
            {isLoadingAi ? (
              <>
                <span className="w-3 h-3 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
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
  );
}
