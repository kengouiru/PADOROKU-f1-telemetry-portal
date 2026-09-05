'use client';

/**
 * components/telemetry/TelemetryViewer.tsx
 * Professional F1 Telemetry Intelligence Viewer
 * Synchronized 3-tier telemetry comparison, delta-coupled ghost car visualization,
 * brake pedal heatmaps, and automatic apex speed insights.
 */

import DetailedTelemetryChart, { type DetailedTelemetryChartProps } from './DetailedTelemetryChart';

export type TelemetryViewerProps = DetailedTelemetryChartProps;
export const TelemetryViewer = DetailedTelemetryChart;
export default DetailedTelemetryChart;
