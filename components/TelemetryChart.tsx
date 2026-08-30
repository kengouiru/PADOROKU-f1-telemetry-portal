'use client';

/**
 * components/TelemetryChart.tsx  [REWRITE — react-chartjs-2 + explicit registration]
 *
 * Uses react-chartjs-2 <Line /> with all Chart.js modules registered upfront.
 * Container has explicit pixel height to prevent canvas collapse.
 */

import React, { useMemo, useRef } from 'react';
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

import type { Driver, Lap, Stint, PitStop, SafetyCarPeriod } from '@/lib/types';
import {
  enrichLapsWithStints,
  formatColor,
  getTyreColor,
  formatLapTime,
  lapsToChartData,
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
  safetyCarPeriods: SafetyCarPeriod[];
  onLapClick?: (driverNum: string, lapNumber: number) => void;
}

// ── Component ──────────────────────────────────────────────────────────────────

export default function TelemetryChart({
  selectedDrivers,
  lapsCache,
  drivers,
  stints,
  pitStopsCache,
  safetyCarPeriods,
  onLapClick,
}: TelemetryChartProps) {
  const chartRef = useRef<ChartJS<'line', ChartPoint[]>>(null);

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
        // Required for parsing: false
        parsing: false as never,
      } as F1Dataset;
    });
  }, [selectedDrivers, lapsCache, stints, drivers]);

  // ── Safety-car band plugin ────────────────────────────────────────────────

  const scPlugin: Plugin<'line'> = useMemo(() => ({
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
          p.type === 'RED' ? 'rgba(239,68,68,0.14)' :
          p.type === 'SC'  ? 'rgba(251,146,60,0.12)' :
                             'rgba(250,204,21,0.10)';
        ctx.fillRect(x1, chartArea.top, x2 - x1, chartArea.height);
      }
      ctx.restore();
    },
  }), [safetyCarPeriods]);

  // ── Pit-stop "P" marker plugin ────────────────────────────────────────────

  const pitPlugin: Plugin<'line'> = useMemo(() => ({
    id: 'f1_pit_markers',
    afterDatasetsDraw(chart) {
      const { ctx } = chart;
      chart.data.datasets.forEach((ds, dsIdx) => {
        const f1ds = ds as F1Dataset;
        if (!f1ds.driverNum) return;
        const pits = pitStopsCache[f1ds.driverNum] ?? [];
        if (!pits.length) return;
        const meta = chart.getDatasetMeta(dsIdx);
        pits.forEach((pit) => {
          const dataIdx = f1ds.data.findIndex((d) => (d as ChartPoint).x === pit.lap_number);
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
      });
    },
  }), [pitStopsCache]);

  // ── Chart options ─────────────────────────────────────────────────────────

  const options: ChartOptions<'line'> = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 300 },
    parsing: false,
    interaction: { mode: 'index', intersect: false },
    onClick(_, active) {
      if (!active.length || !onLapClick) return;
      const { datasetIndex, index } = active[0];
      const ds = datasets[datasetIndex];
      const pt = ds?.data[index] as ChartPoint | undefined;
      if (ds && pt) onLapClick(ds.driverNum, pt.x);
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
          callback: (v) => typeof v === 'number' ? formatLapTime(v) : String(v),
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
            return [
              `  ${ctx.dataset.label}: ${formatLapTime(raw.y)}`,
              `  Tyre: ${raw.compound} (${raw.tyreAge}L old)`,
              ...(raw.s1 != null
                ? [`  S1 ${raw.s1.toFixed(3)}  S2 ${(raw.s2 ?? 0).toFixed(3)}  S3 ${(raw.s3 ?? 0).toFixed(3)}`]
                : []),
            ];
          },
        },
      },
    },
  }), [datasets, onLapClick]);

  // ── Empty state ───────────────────────────────────────────────────────────

  if (selectedDrivers.length === 0) {
    return (
      <div className="glass-card flex flex-col items-center justify-center gap-3 text-slate-500" style={{ height: 320 }}>
        <span className="text-4xl">📈</span>
        <span className="text-sm">ドライバーを選択してラップタイムをプロット</span>
      </div>
    );
  }

  return (
    <div className="glass-card p-4">
      {/* Title */}
      <h3 className="text-xs font-racing font-bold text-white tracking-widest border-l-2 border-f1-red pl-2 mb-4 uppercase">
        LAP TIME COMPARISON
      </h3>

      {/* Chart canvas — explicit pixel height prevents canvas collapse */}
      <div style={{ position: 'relative', width: '100%', height: 280 }}>
        <Line
          ref={chartRef}
          data={{ datasets: datasets as ChartDataset<'line', ChartPoint[]>[] }}
          options={options}
          plugins={[scPlugin, pitPlugin]}
        />
      </div>

      {/* Legend: SC bands & Pit markers */}
      <div className="flex flex-wrap gap-4 mt-3 text-xs text-slate-500">
        {safetyCarPeriods.length > 0 && (
          <>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm" style={{ background: 'rgba(251,146,60,0.35)' }} />
              SC帯
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm" style={{ background: 'rgba(250,204,21,0.25)' }} />
              VSC帯
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm" style={{ background: 'rgba(239,68,68,0.30)' }} />
              赤旗
            </span>
          </>
        )}
        <span className="flex items-center gap-1.5">
          <span className="inline-flex w-4 h-4 rounded-full bg-red-500 text-white text-xs items-center justify-center font-bold leading-none">P</span>
          ピットストップ
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-full bg-pink-500" />SOFT
          <span className="inline-block w-3 h-3 rounded-full bg-yellow-400 ml-2" />MED
          <span className="inline-block w-3 h-3 rounded-full bg-gray-200 ml-2" />HARD
        </span>
      </div>
    </div>
  );
}
