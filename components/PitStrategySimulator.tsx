'use client';

/**
 * components/PitStrategySimulator.tsx
 * Interactive Pit Window & Undercut / Traffic Simulation Component.
 * Computes:
 *  - Pit exit track position & traffic congestion forecasting (Clean Air vs Traffic)
 *  - Real-time Undercut success probability & Overcut viability
 *  - Interactive Pit Loss (s) & Fresh Tyre Gain sliders
 *  - Integrated Gemini AI Strategy Advisor trigger
 */

import React, { useState, useMemo, useEffect } from 'react';
import type { Driver, Lap, Stint, TyreCompound, PitSimulationResult } from '@/lib/types';
import { simulatePitStrategy, getTyreColor } from '@/lib/telemetryUtils';
import VirtualPitwallWarRoom from '@/components/strategy/VirtualPitwallWarRoom';
import VirtualGrandPrixSimulator from '@/components/strategy/VirtualGrandPrixSimulator';

interface PitStrategySimulatorProps {
  selectedDrivers: string[];
  drivers: Driver[];
  lapsCache: Record<string, Lap[]>;
  stints: Stint[];
  geminiApiKey?: string;
  initialViewMode?: 'basic' | 'war_room' | 'virtual_gp';
  onOpenUpgradeModal?: () => void;
}

export default function PitStrategySimulator({
  selectedDrivers,
  drivers,
  lapsCache,
  stints,
  geminiApiKey = '',
  initialViewMode,
  onOpenUpgradeModal,
}: PitStrategySimulatorProps) {
  const [pitLoss, setPitLoss] = useState<number>(22.5);
  const [freshGain, setFreshGain] = useState<number>(1.4);
  const [targetCompound, setTargetCompound] = useState<TyreCompound>('HARD');
  const [viewMode, setViewMode] = useState<'basic' | 'war_room' | 'virtual_gp'>(initialViewMode || 'basic');

  useEffect(() => {
    if (initialViewMode) {
      setViewMode(initialViewMode);
    }
  }, [initialViewMode]);

  // AI Strategy advice state per driver
  const [aiAdvice, setAiAdvice] = useState<Record<string, string>>({});
  const [loadingAi, setLoadingAi] = useState<Record<string, boolean>>({});

  // Compute simulation results
  const results: PitSimulationResult[] = useMemo(() => {
    return simulatePitStrategy(selectedDrivers, drivers, lapsCache, stints, {
      pitLossSeconds: pitLoss,
      freshTyreDeltaPerLap: freshGain,
      targetCompound,
    });
  }, [selectedDrivers, drivers, lapsCache, stints, pitLoss, freshGain, targetCompound]);

  // Request AI Strategic advice for a driver
  const handleFetchAiAdvice = async (result: PitSimulationResult) => {
    const num = result.driverNum;
    if (loadingAi[num]) return;

    setLoadingAi((prev) => ({ ...prev, [num]: true }));

    try {
      const prompt = `あなたはF1のチーフレースストラテジストです。
以下のテレメトリおよびピットシミュレーション状況に基づき、${result.driverName} (#${result.driverNum}) に対する【今周回のピットイン判断（アンダーカットを仕掛けるべきか／ステイアウトすべきか）】と【推奨理由】を日本語で3〜4文で簡潔・論理的にアドバイスしてください。

【シミュレーションデータ】
- 現在の周回: Lap ${result.currentLap}
- 現在の順位: P${result.currentPosition}
- 装着タイヤ: ${result.currentTyreCompound} (${result.currentTyreAge}周走行)
- ピット後想定復帰順位: P${result.predictedExitPosition}
- コース復帰時トラフィック: ${result.trafficStatus === 'CLEAN_AIR' ? 'クリーンエア（クリアラップ）' : result.trafficStatus === 'IN_TRAFFIC' ? `トラフィックに遭遇 (${result.aheadDriverAcronym}の後方 ${result.gapAheadSeconds}秒)` : `近接 (${result.aheadDriverAcronym}の後方 ${result.gapAheadSeconds}秒)`}
- 前走車に対するアンダーカット成功確率: ${result.undercutSuccessProb}%
- オーバーカット推奨度: ${result.overcutViability}
- ピットロスタイム: ${result.pitLossSeconds}秒
- 新品${result.targetCompound}タイヤの想定ゲイン: +${result.freshTyreDeltaPerLap}秒/周`;

      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (geminiApiKey) headers['x-gemini-key'] = geminiApiKey;

      const res = await fetch('/api/strategist', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          messages: [{ role: 'user', content: prompt }],
        }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      // Read streaming or text response
      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let text = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          text += decoder.decode(value, { stream: true });
          setAiAdvice((prev) => ({ ...prev, [num]: text }));
        }
      } else {
        const json = await res.json();
        text = json.response ?? json.text ?? '';
        setAiAdvice((prev) => ({ ...prev, [num]: text }));
      }
    } catch (e) {
      console.warn('[Pit AI Strategy] Error:', e);
      setAiAdvice((prev) => ({
        ...prev,
        [num]: 'AI戦略アドバイスの取得に失敗しました。時間をおいて再試行してください。',
      }));
    } finally {
      setLoadingAi((prev) => ({ ...prev, [num]: false }));
    }
  };

  if (selectedDrivers.length === 0) {
    return null;
  }

  return (
    <div className="glass-card p-4 flex flex-col gap-4">
      {/* ── Mode Switcher Bar ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-2 bg-slate-950/80 rounded-2xl border border-white/10 shadow-lg">
        <div className="flex items-center gap-2">
          <span className="text-lg">🧠</span>
          <div className="text-xs font-racing font-bold text-white uppercase tracking-wider">
            RACE STRATEGY INTELLIGENCE
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-900 rounded-xl border border-white/10">
          <button
            type="button"
            onClick={() => setViewMode('basic')}
            className={`px-3 py-1.5 rounded-lg text-xs font-racing font-bold transition-all flex items-center gap-1.5 ${
              viewMode === 'basic'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>⏱️ 基本ピット窓口</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('war_room')}
            className={`px-3 py-1.5 rounded-lg text-xs font-racing font-bold transition-all flex items-center gap-1.5 ${
              viewMode === 'war_room'
                ? 'bg-gradient-to-r from-amber-500 to-red-600 text-white shadow-md shadow-amber-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>🚨 戦術司令室</span>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          </button>
          <button
            type="button"
            onClick={() => setViewMode('virtual_gp')}
            className={`px-3 py-1.5 rounded-lg text-xs font-racing font-bold transition-all flex items-center gap-1.5 ${
              viewMode === 'virtual_gp'
                ? 'bg-gradient-to-r from-amber-500 via-yellow-400 to-red-500 text-slate-950 font-black shadow-md shadow-amber-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>🏎️ 模擬レース Pro</span>
            <span className="text-[9px] bg-amber-400/20 text-amber-300 border border-amber-400/30 px-1 rounded font-mono">PRO</span>
          </button>
        </div>
      </div>

      {viewMode === 'virtual_gp' ? (
        <VirtualGrandPrixSimulator
          onOpenUpgradeModal={onOpenUpgradeModal}
          geminiApiKey={geminiApiKey}
        />
      ) : viewMode === 'war_room' ? (
        <VirtualPitwallWarRoom />
      ) : (
        <>
      {/* Title & Interactive Sliders */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-3">
        <div>
          <h3 className="text-xs font-racing font-bold text-white tracking-widest border-l-2 border-f1-red pl-2 uppercase">
            PIT WINDOW & STRATEGY SIMULATION
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            トラフィック・コース復帰位置予測 ＆ アンダーカット成功確率シミュレーション
          </p>
        </div>

        {/* Sliders & Compound Selector */}
        <div className="flex flex-wrap items-center gap-4 bg-slate-950/60 border border-white/10 p-2.5 rounded-xl text-xs">
          {/* Pit Loss Slider */}
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-mono text-[11px]">Pit Loss:</span>
            <input
              type="range"
              min={19.0}
              max={26.0}
              step={0.5}
              value={pitLoss}
              onChange={(e) => setPitLoss(Number(e.target.value))}
              className="w-20 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <span className="font-mono text-white font-bold text-[11px] w-10">
              {pitLoss.toFixed(1)}s
            </span>
          </div>

          {/* Fresh Tyre Delta Slider */}
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-mono text-[11px]">New Tyre Gain:</span>
            <input
              type="range"
              min={0.5}
              max={2.5}
              step={0.1}
              value={freshGain}
              onChange={(e) => setFreshGain(Number(e.target.value))}
              className="w-20 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-green-500"
            />
            <span className="font-mono text-green-400 font-bold text-[11px] w-12">
              +{freshGain.toFixed(1)}s/L
            </span>
          </div>

          {/* Target Compound Selector */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-mono text-[11px]">Target:</span>
            {(['HARD', 'MEDIUM', 'SOFT'] as TyreCompound[]).map((comp) => (
              <button
                key={comp}
                onClick={() => setTargetCompound(comp)}
                className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all border ${
                  targetCompound === comp
                    ? 'bg-blue-600 border-blue-400 text-white shadow-sm'
                    : 'bg-slate-900 border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                {comp}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Driver Simulation Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {results.map((r) => {
          const currentTyreColor = getTyreColor(r.currentTyreCompound);
          const targetTyreColor = getTyreColor(r.targetCompound);

          // Traffic Status badge config
          const isClean = r.trafficStatus === 'CLEAN_AIR';
          const isTraffic = r.trafficStatus === 'IN_TRAFFIC';

          const trafficBadgeClass = isClean
            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
            : isTraffic
            ? 'bg-red-500/20 text-red-300 border-red-500/30'
            : 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';

          const trafficText = isClean
            ? '🟢 クリーンエア (クリア復帰)'
            : isTraffic
            ? `🔴 トラフィック遭遇 (${r.aheadDriverAcronym ?? '前方'} 後方 ${r.gapAheadSeconds ?? 0}s)`
            : `🟡 近接ギャップ (${r.aheadDriverAcronym ?? '前方'} 後方 ${r.gapAheadSeconds ?? 0}s)`;

          return (
            <div
              key={r.driverNum}
              className="bg-slate-900/80 border border-white/10 rounded-2xl p-4 flex flex-col gap-3 relative overflow-hidden shadow-lg"
            >
              {/* Top team accent */}
              <div
                className="absolute top-0 left-0 right-0 h-1"
                style={{ backgroundColor: r.teamColour }}
              />

              {/* Driver Header & Position Shift */}
              <div className="flex items-center justify-between mt-1">
                <div className="flex items-center gap-2">
                  <span
                    className="font-racing font-bold text-xs px-2 py-0.5 rounded border"
                    style={{
                      borderColor: `${r.teamColour}60`,
                      color: r.teamColour,
                      backgroundColor: `${r.teamColour}15`,
                    }}
                  >
                    {r.driverAcronym}
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-white leading-tight truncate">
                      {r.driverName}
                    </h4>
                    <span className="text-[10px] text-slate-400 font-mono">
                      Lap {r.currentLap} 時点
                    </span>
                  </div>
                </div>

                {/* Position Delta Badge: P1 -> P4 */}
                <div className="flex items-center gap-1.5 bg-slate-950/80 px-2.5 py-1 rounded-xl border border-white/5 font-mono text-xs">
                  <span className="text-slate-400">P{r.currentPosition}</span>
                  <span className="text-slate-600">➔</span>
                  <span className="text-sky-400 font-bold">P{r.predictedExitPosition}</span>
                  <span className="text-[10px] text-slate-500">復帰</span>
                </div>
              </div>

              {/* Traffic Forecaster Status */}
              <div className={`px-2.5 py-1.5 rounded-xl border text-xs font-medium flex items-center justify-between ${trafficBadgeClass}`}>
                <span className="truncate">{trafficText}</span>
              </div>

              {/* Undercut Success Probability & Progress Bar */}
              <div className="bg-slate-950/60 rounded-xl p-2.5 border border-white/5 flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 flex items-center gap-1 text-[11px]">
                    <span>⚡</span>
                    <span>アンダーカット成功確率</span>
                  </span>
                  <span
                    className={`font-mono font-bold text-xs ${
                      r.undercutSuccessProb >= 70
                        ? 'text-emerald-400'
                        : r.undercutSuccessProb >= 40
                        ? 'text-yellow-400'
                        : 'text-red-400'
                    }`}
                  >
                    {r.undercutSuccessProb}%
                  </span>
                </div>

                {/* Bar */}
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 rounded-full ${
                      r.undercutSuccessProb >= 70
                        ? 'bg-gradient-to-r from-emerald-500 to-green-400'
                        : r.undercutSuccessProb >= 40
                        ? 'bg-gradient-to-r from-yellow-500 to-amber-400'
                        : 'bg-gradient-to-r from-red-500 to-rose-400'
                    }`}
                    style={{ width: `${r.undercutSuccessProb}%` }}
                  />
                </div>

                <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-0.5">
                  <span>オーバーカット推奨度: <strong className="text-slate-300">{r.overcutViability}</strong></span>
                  <span>想定ゲイン: <strong className="text-green-400">+{r.freshTyreDeltaPerLap}s/L</strong></span>
                </div>
              </div>

              {/* Tyre Transition Info */}
              <div className="flex items-center justify-between text-xs bg-slate-950/40 p-2 rounded-xl border border-white/5">
                <div className="flex items-center gap-1.5">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: currentTyreColor }}
                  />
                  <span className="text-slate-300 font-mono text-[11px]">
                    {r.currentTyreCompound} ({r.currentTyreAge}L)
                  </span>
                </div>
                <span className="text-slate-600 font-bold">➔</span>
                <div className="flex items-center gap-1.5">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: targetTyreColor }}
                  />
                  <span className="text-white font-bold font-mono text-[11px]">
                    {r.targetCompound} (新品)
                  </span>
                </div>
              </div>

              {/* AI Strategic Decision Advice */}
              {aiAdvice[r.driverNum] ? (
                <div className="bg-purple-950/30 border border-purple-500/30 rounded-xl p-2.5 text-xs text-purple-200 flex flex-col gap-1 animate-fade-in">
                  <span className="text-[10px] font-bold text-purple-400 flex items-center gap-1 uppercase tracking-wider">
                    <span>✨</span>
                    <span>AI ストラテジスト戦術判断</span>
                  </span>
                  <p className="leading-relaxed text-slate-200 text-[11px]">
                    {aiAdvice[r.driverNum]}
                  </p>
                </div>
              ) : (
                <button
                  onClick={() => handleFetchAiAdvice(r)}
                  disabled={loadingAi[r.driverNum]}
                  className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-purple-900/40 to-blue-900/40 hover:from-purple-900/60 hover:to-blue-900/60 border border-purple-500/30 text-purple-200 text-xs font-medium flex items-center justify-center gap-1.5 transition-all disabled:opacity-50 mt-auto shadow-md"
                >
                  {loadingAi[r.driverNum] ? (
                    <>
                      <span className="w-3 h-3 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
                      <span>AI戦術判断を生成中...</span>
                    </>
                  ) : (
                    <>
                      <span>✨</span>
                      <span>Geminiでピットイン推奨理由を生成</span>
                    </>
                  )}
                </button>
              )}
            </div>
          );
        })}
      </div>
        </>
      )}
    </div>
  );
}
