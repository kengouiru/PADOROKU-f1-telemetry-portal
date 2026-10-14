'use client';

/**
 * components/hubs/season/RaceWeekendBriefingCard.tsx
 * Race Weekend Intelligence Brief (観戦前3分・戦略＆物理インテリジェンスボード)
 *
 * Differentiator feature combining circuit geometry, Pirelli tyre stress / pit loss physics
 * (`lib/physicsConstants.ts`), 2026 Manual Override / X-Mode characteristics, and 1-click
 * Multi-Window Pop-out Telemetry & Pitwall Pro Analyst integration.
 */

import React from 'react';
import {
  Gauge,
  Timer,
  ShieldAlert,
  Zap,
  ExternalLink,
  Compass,
  Activity,
  Sparkles,
  Wrench,
} from 'lucide-react';
import { KNOWLEDGE_CIRCUITS } from '@/data/f1KnowledgeData';
import type { RaceWeekendSchedule, SeasonYear } from '@/data/f1SeasonData';
import {
  FUEL_EFFECT_S_PER_KG,
  MGU_K_MAX_POWER_KW,
  DEFAULT_GREEN_PIT_LOSS_S,
  SC_PIT_LOSS_FACTOR,
  BASE_UNDERCUT_GAIN_S,
} from '@/lib/physicsConstants';
import { openPitwallPopoutWindow } from '@/lib/pitwallBroadcastSync';

interface RaceWeekendBriefingCardProps {
  race: RaceWeekendSchedule;
  circuitId: string;
  seasonYear?: SeasonYear;
  isPro?: boolean;
  onOpenInlineTrackGuide?: () => void;
  onOpenInlineTab?: (tab: 'results' | 'review' | 'track_guide' | 'report') => void;
  onNavigateToTelemetry?: (gpName?: string) => void;
  onOpenUpgradeModal?: () => void;
}

export default function RaceWeekendBriefingCard({
  race,
  circuitId,
  onOpenInlineTrackGuide,
  onOpenInlineTab,
  onNavigateToTelemetry,
  onOpenUpgradeModal,
}: RaceWeekendBriefingCardProps) {
  const circuitDetail = React.useMemo(
    () => KNOWLEDGE_CIRCUITS.find((c) => c.id === circuitId),
    [circuitId]
  );

  // Derive deterministic, physics-grounded circuit strategy metrics from circuitDetail & physicsConstants
  const lengthKm = race.lengthKm || circuitDetail?.lengthKm || 5.2;
  const cornersCount = circuitDetail?.turns || 18;
  const cornerDensity = cornersCount / Math.max(3.3, lengthKm);

  // Pit loss uses circuit's typicalPitLossSec or physicsConstants baseline
  const greenPitLossSec = Number(
    (
      circuitDetail?.typicalPitLossSec ||
      DEFAULT_GREEN_PIT_LOSS_S +
        (circuitId.includes('singapore') || circuitId.includes('imola') ? 5.2 : circuitId.includes('monaco') ? -2.0 : 0.8)
    ).toFixed(1)
  );
  const scPitLossSec = Number((greenPitLossSec * SC_PIT_LOSS_FACTOR).toFixed(1));
  const scTimeSavedSec = Number((greenPitLossSec - scPitLossSec).toFixed(1));

  // Undercut effect scales with tyre abrasion / corner density
  const undercutDeltaSec = Number(
    (BASE_UNDERCUT_GAIN_S + (cornerDensity > 3.6 ? 0.55 : cornerDensity > 3.0 ? 0.25 : -0.15)).toFixed(2)
  );

  // Fuel penalty per 10kg on this circuit length
  const fuel10KgPenaltySec = Number(((10 * FUEL_EFFECT_S_PER_KG * lengthKm) / 5.0).toFixed(2));

  const keyCorner = circuitDetail?.trackGeometry?.keyCorners?.[0];

  return (
    <section className="rounded-2xl bg-slate-900/90 border border-white/10 p-4 sm:p-5 shadow-xl space-y-4">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-red-600/20 border border-red-500/40 flex items-center justify-center shrink-0">
            <Gauge className="w-4 h-4 text-red-400" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-red-400">
                RACE WEEKEND INTELLIGENCE BRIEF
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-800 border border-white/10 text-[11px] font-mono text-slate-300">
                物理定数モデル算出 (`physicsConstants.ts`)
              </span>
            </div>
            <h3 className="text-sm sm:text-base font-bold text-white mt-0.5">
              {race.gpName} 観戦・戦略3分ブリーフィング（勝敗を分ける4大物理指標）
            </h3>
          </div>
        </div>

        {/* Multi-Monitor Pop-out & Inline Quick Switchers */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => {
              if (onOpenInlineTrackGuide) onOpenInlineTrackGuide();
              else if (onOpenInlineTab) onOpenInlineTab('track_guide');
            }}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-white/10 text-xs font-racing font-bold transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Compass className="w-3.5 h-3.5 text-slate-300" />
            <span>コース攻略を展開</span>
          </button>

          <button
            type="button"
            onClick={() =>
              openPitwallPopoutWindow(
                `/popout/telemetry?circuit=${encodeURIComponent(circuitId)}&d1=VER&d2=LEC`
              )
            }
            className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white border border-red-400/40 text-xs font-racing font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-md shadow-red-950/40"
            title="サブモニターや中継の横に置ける独立テレメトリー比較ウィンドウを開きます（メイン画面とリアルタイム同期）"
          >
            <Activity className="w-3.5 h-3.5" />
            <span>2画面テレメトリー窓を起動</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* 4 Physics & Strategy KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* 1. Pit Loss & SC Save */}
        <div className="rounded-xl bg-slate-950/80 border border-white/10 p-3.5 space-y-1.5">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span className="flex items-center gap-1.5">
              <Timer className="w-3.5 h-3.5 text-red-400" />
              <span>PIT STOP LOSS</span>
            </span>
            <span className="text-[11px] text-emerald-400 font-bold tabular-nums whitespace-nowrap">
              SC時 -{scTimeSavedSec}s 得
            </span>
          </div>
          <div className="flex items-baseline gap-2 tabular-nums whitespace-nowrap">
            <span className="text-xl font-racing font-black text-white">{greenPitLossSec}s</span>
            <span className="text-xs text-slate-400 font-mono">/ SC下 {scPitLossSec}s</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            通常ピットイン時の平均ロスタイム。VSC/SC導入時のフリーストップ効果が極めて高い設計。
          </p>
        </div>

        {/* 2. Undercut Potency */}
        <div className="rounded-xl bg-slate-950/80 border border-white/10 p-3.5 space-y-1.5">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>UNDERCUT DELTA</span>
            </span>
            <span className="text-[11px] text-amber-300 font-bold whitespace-nowrap">
              {undercutDeltaSec >= 1.85 ? 'アンダーカット強力' : 'オーバーカット有効'}
            </span>
          </div>
          <div className="flex items-baseline gap-2 tabular-nums whitespace-nowrap">
            <span className="text-xl font-racing font-black text-white">+{undercutDeltaSec}s</span>
            <span className="text-xs text-slate-400 font-mono">/ Out-Lap 1周差</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            新品タイヤ投入1周目のウォームアップと旧タイヤ摩耗差から算出される1周あたりの逆転幅。
          </p>
        </div>

        {/* 3. Fuel & 2026 ERS Override */}
        <div className="rounded-xl bg-slate-950/80 border border-white/10 p-3.5 space-y-1.5">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span className="flex items-center gap-1.5">
              <Wrench className="w-3.5 h-3.5 text-emerald-400" />
              <span>2026 PU & FUEL</span>
            </span>
            <span className="text-[11px] text-slate-300 font-mono tabular-nums whitespace-nowrap">
              MGU-K {MGU_K_MAX_KW_LABEL}
            </span>
          </div>
          <div className="flex items-baseline gap-2 tabular-nums whitespace-nowrap">
            <span className="text-xl font-racing font-black text-white">-{fuel10KgPenaltySec}s</span>
            <span className="text-xs text-slate-400 font-mono">/ 燃料10kg消費ごと</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            1秒以内追従時の Manual Override（350kW電力維持）と直線Xモードによるオーバーテイク支援。
          </p>
        </div>

        {/* 4. Key Corner & Telemetry Focus */}
        <div className="rounded-xl bg-slate-950/80 border border-white/10 p-3.5 space-y-1.5">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span className="flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
              <span>KEY TELEMETRY ZONE</span>
            </span>
            <span className="text-[11px] text-slate-300 font-mono tabular-nums whitespace-nowrap">
              全{cornersCount}コーナー
            </span>
          </div>
          <div className="text-sm font-bold text-white truncate">
            {keyCorner ? `Turn ${keyCorner.number}: ${keyCorner.name}` : `${race.circuitName} 勝負区間`}
          </div>
          <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
            {keyCorner?.characteristic || 'ブレーキング開始位置とエイペックス最低車速（ボトムスピード）の差がラップタイムを左右します。'}
          </p>
        </div>
      </div>

      {/* Contextual Pro Analyst Banner (Non-Intrusive Monetization Bar) */}
      <div className="rounded-xl bg-slate-950/90 border border-white/10 px-4 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-2 text-xs text-slate-300">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            <strong className="text-white">PRO ANALYST 連携：</strong>
            このサーキットの3段テレメトリー波形比較・全20台ピットウォール戦略シミュレーション・AI深掘り無線解析をシームレスに実行できます。
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {onNavigateToTelemetry && (
            <button
              type="button"
              onClick={() => onNavigateToTelemetry(race.gpName)}
              className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-racing font-bold border border-white/10 transition-colors cursor-pointer whitespace-nowrap"
            >
              TELEMETRYタブで開く
            </button>
          )}
          {onOpenUpgradeModal && (
            <button
              type="button"
              onClick={onOpenUpgradeModal}
              className="px-3 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 text-xs font-racing font-bold transition-colors cursor-pointer whitespace-nowrap"
            >
              Pitwall Pro 特典を見る
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

const MGU_K_MAX_KW_LABEL = `${MGU_K_MAX_POWER_KW}kW`;
