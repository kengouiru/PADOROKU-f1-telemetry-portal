'use client';

/**
 * components/hubs/TyreEncyclopediaHub.tsx
 * F1 Tyre Complete Encyclopedia (F1タイヤ大百科)
 * Fully covers the 3 Layers:
 * - Layer 1 (初心者): タイヤの基本 (5色, なぜ交換するのか, 断面図SVG, 22秒ピットロスの真実)
 * - Layer 2 (中級者): 戦略を読む (アンダーカット実例, ウォームアップ, クリフ予兆, デイvsナイト, SC判断マトリクス)
 * - Layer 3 (玄人向け): データで読むタイヤ (デグラ曲線数理, テレメトリー連携, ドライバー比較, ピレリ公式データ, C1-C6, グレイニング/ブリスター, 3大歴史事件)
 */

import React, { useState } from 'react';
import {
  TYRE_COMPOUNDS,
  PIRELLI_COMPOUNDS,
  TYRE_TROUBLE_GUIDE,
  STRATEGY_CONCEPTS,
  TEAM_TYRE_TENDENCIES,
  TYRE_CROSS_SECTION_LAYERS,
  PIT_STOP_BREAKDOWN,
  PIT_STOP_FACTS,
  TYRE_WARMUP_GUIDE,
  TYRE_CLIFF_GUIDE,
  TRACK_TEMP_STRATEGY,
  SAFETY_CAR_DECISION_MATRIX,
  DRIVER_TYRE_STYLES,
  HISTORIC_TYRE_DRAMAS,
  type TyreCompoundInfo,
  type PirelliHardnessLevel,
  type TyreTroubleGuide,
  type TyreCrossSectionLayer,
  type DriverTyreStyle,
  type HistoricTyreDrama,
} from '@/data/tyreEncyclopediaData';
import { type TelemetryTarget } from '@/data/f1KnowledgeData';

type LayerType = 'beginner' | 'intermediate' | 'expert';

interface TyreEncyclopediaHubProps {
  onNavigateToTelemetry?: (target?: TelemetryTarget) => void;
}

export default function TyreEncyclopediaHub({ onNavigateToTelemetry }: TyreEncyclopediaHubProps) {
  const [activeLayer, setActiveLayer] = useState<LayerType>('beginner');

  // Layer 1 State
  const [selectedCompoundId, setSelectedCompoundId] = useState<string>('soft');
  const [selectedLayerId, setSelectedLayerId] = useState<string>('tread');

  // Layer 2 State (Simulator)
  const [freshTyreAdvantage, setFreshTyreAdvantage] = useState<number>(1.6);
  const [rivalTyreDegradation, setRivalTyreDegradation] = useState<number>(0.8);
  const [gapBeforePit, setGapBeforePit] = useState<number>(1.8);

  // Layer 3 State
  const [selectedTroubleId, setSelectedTroubleId] = useState<string>('graining');
  const [selectedDramaId, setSelectedDramaId] = useState<string>('turkey-2020');

  const selectedCompound =
    TYRE_COMPOUNDS.find((c) => c.id === selectedCompoundId) || TYRE_COMPOUNDS[0];
  const selectedCrossLayer =
    TYRE_CROSS_SECTION_LAYERS.find((l) => l.id === selectedLayerId) ||
    TYRE_CROSS_SECTION_LAYERS[0];
  const selectedTrouble =
    TYRE_TROUBLE_GUIDE.find((t) => t.id === selectedTroubleId) || TYRE_TROUBLE_GUIDE[0];
  const selectedDrama =
    HISTORIC_TYRE_DRAMAS.find((d) => d.id === selectedDramaId) || HISTORIC_TYRE_DRAMAS[0];

  // Simulator Math
  const netOneLapGain = Number((freshTyreAdvantage + rivalTyreDegradation).toFixed(2));
  const undercutSuccessful = netOneLapGain > gapBeforePit;
  const marginAfterPit = Number((netOneLapGain - gapBeforePit).toFixed(2));

  return (
    <div className="flex flex-col gap-6 animate-fade-in text-white">
      {/* ── Sub Header / 3-Layer Segmented Nav ── */}
      <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-4 md:p-5 backdrop-blur-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-racing font-bold px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-400 border border-pink-500/30">
                PIRELLI FORMULA 1 TECHNICAL MASTERCLASS
              </span>
              <span className="text-[10px] text-slate-400">2025 REGULATIONS</span>
            </div>
            <h3 className="text-xl font-racing font-black tracking-wide text-white flex items-center gap-2">
              <span>🛞</span> F1タイヤ大百科 (3レイヤー完全体系)
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              「初心者向け基礎」「中級者向け戦略」「玄人向けデータ＆歴史」の3段階で、F1の勝敗の8割を支配するタイヤのすべてを体感。
            </p>
          </div>

          {/* 3 Layer Navigation Buttons */}
          <div className="flex flex-wrap gap-1.5 bg-slate-950/80 p-1.5 rounded-2xl border border-white/10 self-start lg:self-auto shadow-inner">
            <button
              onClick={() => setActiveLayer('beginner')}
              className={`px-3.5 py-2 rounded-xl text-xs font-racing font-bold transition-all flex items-center gap-1.5 ${
                activeLayer === 'beginner'
                  ? 'bg-gradient-to-r from-blue-600 to-sky-600 text-white shadow-lg shadow-blue-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <span>🔰</span>
              <span>初級：タイヤの基本</span>
            </button>
            <button
              onClick={() => setActiveLayer('intermediate')}
              className={`px-3.5 py-2 rounded-xl text-xs font-racing font-bold transition-all flex items-center gap-1.5 ${
                activeLayer === 'intermediate'
                  ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg shadow-amber-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <span>🧭</span>
              <span>中級：戦略を読む</span>
            </button>
            <button
              onClick={() => setActiveLayer('expert')}
              className={`px-3.5 py-2 rounded-xl text-xs font-racing font-bold transition-all flex items-center gap-1.5 ${
                activeLayer === 'expert'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <span>🔬</span>
              <span>玄人：データで読む</span>
            </button>
          </div>
        </div>
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          LAYER 1: 初心者向け — 「タイヤの基本」
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {activeLayer === 'beginner' && (
        <div className="flex flex-col gap-6 animate-fade-in">
          {/* Section: Why change tyres? */}
          <div className="bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-slate-950 border border-white/10 rounded-2xl p-5 md:p-6 shadow-xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-racing font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                BEGINNER CRUCIAL QUESTION
              </span>
            </div>
            <h3 className="text-lg font-racing font-black text-white flex items-center gap-2 mb-2">
              <span>❓</span> そもそも「なぜレース中にタイヤ交換をするのか？」
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed max-w-4xl mb-5">
              「20秒以上もタイムを損してまで、なぜタイヤを替えるの？」という疑問。理由は明確な3つの柱があります。
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-slate-950/70 p-4 rounded-xl border border-white/5 flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🚀</span>
                  <h4 className="text-xs font-racing font-bold text-sky-400">1. 速さの維持 (数理)</h4>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  古タイヤで毎周2秒遅く走るより、22秒ロスしてでも新品タイヤで1周2秒速く走る方が、305km走破のトータル所要時間が圧倒的に短くなります。
                </p>
              </div>

              <div className="bg-slate-950/70 p-4 rounded-xl border border-white/5 flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-xl">💥</span>
                  <h4 className="text-xs font-racing font-bold text-rose-400">2. バースト（破裂）防止</h4>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  厚さ5mmのトレッドゴムが摩耗して1.5mm以下になると、内部のベルト層が露出し、時速300km/hで走行中にタイヤが破裂する致命的な危険が生じます。
                </p>
              </div>

              <div className="bg-slate-950/70 p-4 rounded-xl border border-white/5 flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-xl">📜</span>
                  <h4 className="text-xs font-racing font-bold text-amber-400">3. FIA規則（2種類義務）</h4>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  ドライ（晴れ）の決勝レースでは、全ドライバーが「2種類以上のドライタイヤ」を使用する義務があります。違反した場合は即座に失格処分となります。
                </p>
              </div>
            </div>

            {/* 4-Step Tyre Life Cycle Timeline */}
            <div className="bg-slate-950/90 p-4.5 rounded-xl border border-white/10">
              <div className="text-xs font-racing font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <span>🔄</span> タイヤが辿る4つのステージ（デグラデーションとクリフの推移）
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="bg-slate-900/90 p-3 rounded-lg border-t-2 border-sky-400 flex flex-col gap-1">
                  <div className="text-[10px] font-racing font-bold text-sky-400">STAGE 1: 新品投入</div>
                  <div className="text-xs font-bold text-white">アウトラップ＆熱入れ</div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    タイヤウォーマー（70℃）から出た直後はまだ滑りやすい。1周かけて100℃の適正作動域に熱を入れる。
                  </p>
                </div>

                <div className="bg-slate-900/90 p-3 rounded-lg border-t-2 border-emerald-400 flex flex-col gap-1">
                  <div className="text-[10px] font-racing font-bold text-emerald-400">STAGE 2: 最速期</div>
                  <div className="text-xs font-bold text-white">スイートスポット (最頂点)</div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    トレッドゴムが路面のアスファルト凹凸に最大限食い込み、ドライバーが全開でプッシュできる黄金期間。
                  </p>
                </div>

                <div className="bg-slate-900/90 p-3 rounded-lg border-t-2 border-amber-400 flex flex-col gap-1">
                  <div className="text-[10px] font-racing font-bold text-amber-400">STAGE 3: 摩耗期</div>
                  <div className="text-xs font-bold text-white">熱ダレ＆デグラデーション</div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    ゴム表面が削れ、熱容量が低下。1周ごとに約0.1秒ずつタイムが遅くなり始める。タイヤマネジメントの勝負。
                  </p>
                </div>

                <div className="bg-slate-900/90 p-3 rounded-lg border-t-2 border-rose-500 flex flex-col gap-1">
                  <div className="text-[10px] font-racing font-bold text-rose-400">STAGE 4: 限界点</div>
                  <div className="text-xs font-bold text-white">ザ・クリフ (崖の崩落)</div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    ゴムが限界まで薄くなり突然グリップが蒸発。1周あたり2〜3秒急落するため、即ピットインが必要。
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Section: 5 Major Compounds Selector */}
          <div className="flex flex-col gap-4">
            <h4 className="text-sm font-racing font-bold text-slate-300 flex items-center gap-2">
              <span>タイヤの種類と色（ドライ3種・ウェット2種）：</span>
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {TYRE_COMPOUNDS.map((compound) => {
                const isSelected = compound.id === selectedCompoundId;
                return (
                  <button
                    key={compound.id}
                    onClick={() => setSelectedCompoundId(compound.id)}
                    className={`relative p-4 rounded-2xl border text-left transition-all flex flex-col justify-between h-36 ${
                      isSelected
                        ? 'bg-slate-800/90 border-2 shadow-lg shadow-black/50 scale-[1.02]'
                        : 'bg-slate-900/50 border-white/10 hover:border-white/20 hover:bg-slate-800/40'
                    }`}
                    style={{
                      borderColor: isSelected ? compound.color : undefined,
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center font-racing font-black text-xs border-2 shadow-sm"
                        style={{
                          backgroundColor: '#111827',
                          color: compound.color,
                          borderColor: compound.color,
                        }}
                      >
                        {compound.code[0]}
                      </div>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-black/40 text-slate-300">
                        {compound.tag}
                      </span>
                    </div>

                    <div>
                      <div className="font-racing font-bold text-sm text-white">{compound.name}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{compound.estimatedLaps}</div>
                    </div>

                    <div className="flex items-center gap-1">
                      <div className="text-[9px] text-slate-500">グリップ</div>
                      <div className="flex-1 h-1.5 bg-slate-700/50 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${(compound.gripLevel / 5) * 100}%`,
                            backgroundColor: compound.color,
                          }}
                        />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Selected Compound Deep Detail Card */}
            <div
              className="bg-slate-900/80 border-2 rounded-2xl p-5 md:p-6 transition-all relative overflow-hidden"
              style={{ borderColor: selectedCompound.color }}
            >
              <div className="flex flex-col lg:flex-row gap-6 justify-between">
                <div className="flex-1 flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center font-racing font-black text-lg border-2 shadow-md"
                      style={{
                        backgroundColor: '#0f172a',
                        color: selectedCompound.color,
                        borderColor: selectedCompound.color,
                      }}
                    >
                      {selectedCompound.code}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl font-racing font-black text-white">
                          {selectedCompound.name}
                        </h3>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-slate-200">
                          {selectedCompound.tag} コンパウンド
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        作動温度域: <span className="text-white font-medium">{selectedCompound.workingRange}</span>
                      </p>
                    </div>
                  </div>

                  <p className="text-sm text-slate-200 leading-relaxed">
                    {selectedCompound.description}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-1">
                    <div className="bg-slate-950/60 p-3 rounded-xl border border-white/5">
                      <div className="text-[10px] font-racing font-bold text-amber-400 uppercase tracking-wider mb-1">
                        🎯 戦術的役割 (Tactical Role)
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {selectedCompound.tacticalRole}
                      </p>
                    </div>

                    <div className="bg-slate-950/60 p-3 rounded-xl border border-white/5">
                      <div className="text-[10px] font-racing font-bold text-sky-400 uppercase tracking-wider mb-1">
                        🌤️ 投入される理想環境 (Ideal Conditions)
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {selectedCompound.idealConditions}
                      </p>
                    </div>
                  </div>

                  <div className="bg-slate-950/80 p-3.5 rounded-xl border border-white/10 flex items-start gap-2.5">
                    <span className="text-lg">📊</span>
                    <div>
                      <span className="text-[11px] font-racing font-bold text-white">テレメトリー上の固有挙動:</span>
                      <p className="text-xs text-slate-400 mt-0.5">{selectedCompound.telemetrySignature}</p>
                    </div>
                  </div>
                </div>

                <div className="w-full lg:w-72 bg-slate-950/80 p-5 rounded-xl border border-white/10 flex flex-col justify-center gap-4">
                  <h4 className="text-xs font-racing font-bold text-slate-300 uppercase tracking-wider border-b border-white/10 pb-2">
                    コンパウンド・パラメータ
                  </h4>

                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">瞬間最大グリップ</span>
                      <span className="font-bold text-white">{selectedCompound.gripLevel} / 5</span>
                    </div>
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${(selectedCompound.gripLevel / 5) * 100}%`,
                          backgroundColor: selectedCompound.color,
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">耐摩耗性・ライフ寿命</span>
                      <span className="font-bold text-white">{selectedCompound.durabilityLevel} / 5</span>
                    </div>
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${(selectedCompound.durabilityLevel / 5) * 100}%`,
                          backgroundColor: '#38bdf8',
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">熱入れ速度</span>
                      <span className="font-bold text-white">{selectedCompound.warmupSpeed} / 5</span>
                    </div>
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${(selectedCompound.warmupSpeed / 5) * 100}%`,
                          backgroundColor: '#fbbf24',
                        }}
                      />
                    </div>
                  </div>

                  <div className="mt-2 pt-2 border-t border-white/5 text-[11px] text-slate-400 text-center">
                    標準想定スティント: <span className="text-white font-bold">{selectedCompound.estimatedLaps}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section: Interactive Tyre Cross-Section SVG */}
          <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-5 md:p-6 flex flex-col gap-5">
            <div>
              <div className="text-xs font-racing font-bold text-sky-400 uppercase tracking-wider mb-1">
                TYRE CROSS-SECTION ANATOMY
              </div>
              <h3 className="text-lg font-racing font-black text-white">
                ビジュアル解説：18インチF1タイヤの断面図
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                図の各層またはボタンをタップして、時速350km/hと5Gを支えるハイテク構造を検証してください。
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              {/* SVG Visual (5 cols) */}
              <div className="lg:col-span-5 bg-slate-950/80 border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center relative overflow-hidden">
                <div className="w-full max-w-[300px] aspect-square relative flex items-center justify-center">
                  <svg viewBox="0 0 300 300" className="w-full h-full drop-shadow-2xl">
                    <circle cx="150" cy="150" r="48" fill="#1e293b" stroke="#64748b" strokeWidth="3" />
                    <circle cx="150" cy="150" r="28" fill="#0f172a" stroke="#94a3b8" strokeWidth="2" />
                    <text x="150" y="146" textAnchor="middle" fill="#94a3b8" fontSize="8" fontFamily="sans-serif" fontWeight="bold">
                      18-INCH BBS
                    </text>
                    <text x="150" y="158" textAnchor="middle" fill="#64748b" fontSize="7" fontFamily="sans-serif">
                      MAGNESIUM RIM
                    </text>

                    {/* Dry Nitrogen Gas */}
                    <circle
                      cx="150"
                      cy="150"
                      r="82"
                      fill={selectedLayerId === 'gas' ? '#06b6d430' : '#06b6d410'}
                      stroke={selectedLayerId === 'gas' ? '#06b6d4' : '#0891b240'}
                      strokeWidth={selectedLayerId === 'gas' ? '3' : '1'}
                      className="cursor-pointer transition-all hover:fill-cyan-500/30"
                      onClick={() => setSelectedLayerId('gas')}
                    />

                    {/* Bead */}
                    <circle
                      cx="150"
                      cy="150"
                      r="58"
                      fill="none"
                      stroke={selectedLayerId === 'bead' ? '#c084fc' : '#a855f7'}
                      strokeWidth={selectedLayerId === 'bead' ? '8' : '5'}
                      strokeDasharray="12 4"
                      className="cursor-pointer transition-all hover:stroke-purple-400"
                      onClick={() => setSelectedLayerId('bead')}
                    />

                    {/* Sidewall */}
                    <circle
                      cx="150"
                      cy="150"
                      r="92"
                      fill="none"
                      stroke={selectedLayerId === 'sidewall' ? '#34d399' : '#10b981'}
                      strokeWidth={selectedLayerId === 'sidewall' ? '9' : '6'}
                      className="cursor-pointer transition-all hover:stroke-emerald-400"
                      onClick={() => setSelectedLayerId('sidewall')}
                    />

                    {/* Carcass */}
                    <circle
                      cx="150"
                      cy="150"
                      r="104"
                      fill="none"
                      stroke={selectedLayerId === 'carcass' ? '#60a5fa' : '#38bdf8'}
                      strokeWidth={selectedLayerId === 'carcass' ? '8' : '5'}
                      strokeDasharray="4 2"
                      className="cursor-pointer transition-all hover:stroke-sky-400"
                      onClick={() => setSelectedLayerId('carcass')}
                    />

                    {/* Belt */}
                    <circle
                      cx="150"
                      cy="150"
                      r="115"
                      fill="none"
                      stroke={selectedLayerId === 'belt' ? '#fbbf24' : '#f59e0b'}
                      strokeWidth={selectedLayerId === 'belt' ? '8' : '5'}
                      className="cursor-pointer transition-all hover:stroke-amber-400"
                      onClick={() => setSelectedLayerId('belt')}
                    />

                    {/* Tread */}
                    <circle
                      cx="150"
                      cy="150"
                      r="128"
                      fill="none"
                      stroke={selectedLayerId === 'tread' ? '#f43f5e' : '#ff2e93'}
                      strokeWidth={selectedLayerId === 'tread' ? '12' : '8'}
                      className="cursor-pointer transition-all hover:stroke-pink-400"
                      onClick={() => setSelectedLayerId('tread')}
                    />
                  </svg>
                </div>
              </div>

              {/* Layer Info (7 cols) */}
              <div className="lg:col-span-7 flex flex-col gap-3">
                <div className="flex flex-wrap gap-1.5">
                  {TYRE_CROSS_SECTION_LAYERS.map((layer: TyreCrossSectionLayer) => {
                    const isSelected = layer.id === selectedLayerId;
                    return (
                      <button
                        key={layer.id}
                        onClick={() => setSelectedLayerId(layer.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-racing font-bold transition-all flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-slate-800 text-white border-2 shadow-md'
                            : 'bg-slate-900/50 text-slate-400 border border-white/10 hover:text-white'
                        }`}
                        style={{ borderColor: isSelected ? layer.color : undefined }}
                      >
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: layer.color }} />
                        <span>{layer.name.split(' (')[0]}</span>
                      </button>
                    );
                  })}
                </div>

                <div
                  className="bg-slate-950/80 border-2 rounded-2xl p-5 flex flex-col gap-3 transition-all"
                  style={{ borderColor: selectedCrossLayer.color }}
                >
                  <div>
                    <h4 className="font-racing font-black text-base text-white">{selectedCrossLayer.name}</h4>
                    <p className="text-xs text-slate-300 mt-1">{selectedCrossLayer.role}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs border-t border-white/10 pt-2">
                    <div>
                      <span className="text-slate-400 text-[10px]">素材:</span>
                      <div className="text-slate-200">{selectedCrossLayer.material}</div>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px]">規格:</span>
                      <div className="text-slate-200">{selectedCrossLayer.thicknessOrSpec}</div>
                    </div>
                  </div>
                  <div className="bg-slate-900 p-3 rounded-lg text-xs text-amber-300 border border-amber-500/20">
                    <strong className="text-amber-400 block mb-0.5">技術の極意:</strong>
                    {selectedCrossLayer.engineeringFact}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section: Pit Stop Anatomy & 22-second loss */}
          <div className="bg-slate-900/80 border border-white/10 rounded-2xl p-5 md:p-6 flex flex-col gap-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-white/10 pb-4">
              <div>
                <div className="text-xs font-racing font-bold text-amber-400 uppercase tracking-wider mb-1">
                  PIT STOP ANATOMY
                </div>
                <h3 className="text-lg font-racing font-black text-white">
                  ピットストップって何秒？ 2秒台の世界記録〜平均22秒ピットロスの意味
                </h3>
              </div>
              <div className="bg-amber-500/10 border border-amber-500/30 px-3.5 py-1.5 rounded-xl text-center self-start md:self-auto">
                <span className="text-[10px] text-amber-300 font-racing font-bold block">WORLD RECORD</span>
                <span className="text-base font-racing font-black text-white">
                  {PIT_STOP_FACTS.worldRecord.team}: {PIT_STOP_FACTS.worldRecord.time}
                </span>
              </div>
            </div>

            {/* Breakdown Steps */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              {PIT_STOP_BREAKDOWN.map((step, idx) => (
                <div key={idx} className="bg-slate-950/80 p-4 rounded-xl border border-white/10 flex flex-col justify-between gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">{step.icon}</span>
                    <span className="text-sm font-racing font-black text-sky-400">+{step.timeSeconds}秒</span>
                  </div>
                  <div>
                    <h5 className="font-racing font-bold text-xs text-white">{step.stage}</h5>
                    <div className="text-[10px] text-slate-400 mb-1">{step.speed}</div>
                    <p className="text-[11px] text-slate-300">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Cheap Pit Stop */}
            <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-xl p-4 flex items-start gap-3">
              <span className="text-2xl">💡</span>
              <div>
                <h5 className="font-racing font-bold text-xs text-emerald-300 mb-1">
                  セーフティカー中の「激安ピット（約11秒ロス）」のカラクリ
                </h5>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {PIT_STOP_FACTS.cheapPitExplanation}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          LAYER 2: 中級者向け — 「戦略を読む」
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {activeLayer === 'intermediate' && (
        <div className="flex flex-col gap-6 animate-fade-in">
          {/* Section: Undercut vs Overcut with Bahrain 2024 Example */}
          <div className="bg-slate-900/80 border border-white/10 rounded-2xl p-6 flex flex-col gap-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-racing font-bold px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-400 border border-sky-500/30">
                  REAL-WORLD CASE STUDY
                </span>
              </div>
              <h3 className="text-lg font-racing font-black text-white">
                アンダーカット vs オーバーカットの真実 (2024年バーレーンGP実例付き)
              </h3>
              <p className="text-xs text-slate-400 mt-1 max-w-3xl leading-relaxed">
                バーレーン・サヒールのように「粗いアスファルトでタイヤの劣化が極めて激しい」サーキットでは、新品タイヤのアウトラップが古タイヤに対して1周あたり1.5秒〜2.0秒も速くなります。
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {STRATEGY_CONCEPTS.map((concept) => (
                <div
                  key={concept.id}
                  className="bg-slate-950/70 border border-white/10 rounded-2xl p-5 flex flex-col justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-racing font-black text-base text-white">{concept.name}</h4>
                      <span
                        className="text-[10px] font-bold px-2.5 py-0.5 rounded-full"
                        style={{
                          backgroundColor: `${concept.color}20`,
                          color: concept.color,
                          border: `1px solid ${concept.color}40`,
                        }}
                      >
                        {concept.badge}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed mb-3">{concept.coreRule}</p>
                    <div className="bg-slate-900 p-3 rounded-xl border border-white/5 mb-3 text-xs text-slate-300">
                      <span className="text-slate-400 text-[10px] block mb-0.5">逆転メカニズム:</span>
                      {concept.deltaMechanism}
                    </div>
                  </div>
                  <div className="text-[11px] bg-slate-900/90 p-2.5 rounded-lg border border-white/5 text-slate-300">
                    <span className="font-bold text-sky-400">実例: </span>
                    {concept.famousExample}
                  </div>
                </div>
              ))}
            </div>

            {/* Interactive Calculator */}
            <div className="bg-slate-950/90 border border-sky-500/30 rounded-2xl p-5 shadow-xl">
              <h4 className="text-sm font-racing font-black text-white mb-2 flex items-center gap-2">
                <span>⚡</span> アンダーカット逆転デルタ・シミュレーター
              </h4>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="flex flex-col gap-3">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-300">ピット前ギャップ</span>
                      <span className="font-bold text-sky-400 font-racing">{gapBeforePit.toFixed(1)} 秒</span>
                    </div>
                    <input
                      type="range"
                      min="0.5"
                      max="5.0"
                      step="0.1"
                      value={gapBeforePit}
                      onChange={(e) => setGapBeforePit(parseFloat(e.target.value))}
                      className="w-full accent-sky-400 bg-slate-800 rounded-lg h-2"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-300">新品タイヤのアウトラップ・ゲイン</span>
                      <span className="font-bold text-emerald-400 font-racing">+{freshTyreAdvantage.toFixed(1)} 秒/周</span>
                    </div>
                    <input
                      type="range"
                      min="0.5"
                      max="3.0"
                      step="0.1"
                      value={freshTyreAdvantage}
                      onChange={(e) => setFreshTyreAdvantage(parseFloat(e.target.value))}
                      className="w-full accent-emerald-400 bg-slate-800 rounded-lg h-2"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-300">相手の古タイヤ劣化タイム落ち</span>
                      <span className="font-bold text-amber-400 font-racing">+{rivalTyreDegradation.toFixed(1)} 秒</span>
                    </div>
                    <input
                      type="range"
                      min="0.1"
                      max="2.5"
                      step="0.1"
                      value={rivalTyreDegradation}
                      onChange={(e) => setRivalTyreDegradation(parseFloat(e.target.value))}
                      className="w-full accent-amber-400 bg-slate-800 rounded-lg h-2"
                    />
                  </div>
                </div>

                <div className="bg-slate-900 rounded-xl p-4 border border-white/10 flex flex-col justify-between">
                  <div
                    className={`p-3 rounded-xl border flex items-center gap-3 ${
                      undercutSuccessful
                        ? 'bg-emerald-950/30 border-emerald-500/50 text-emerald-300'
                        : 'bg-rose-950/30 border-rose-500/50 text-rose-300'
                    }`}
                  >
                    <span className="text-2xl">{undercutSuccessful ? '🏎️💨' : '🛑'}</span>
                    <div>
                      <div className="text-sm font-racing font-black">
                        {undercutSuccessful
                          ? `アンダーカット成功！ 約 ${marginAfterPit} 秒 前で復帰`
                          : `アンダーカット失敗... 約 ${Math.abs(marginAfterPit)} 秒 届かず`}
                      </div>
                      <p className="text-[11px] opacity-90 mt-0.5">
                        1周あたりの純逆転力: +{netOneLapGain}秒（必要ギャップ: {gapBeforePit.toFixed(1)}秒）
                      </p>
                    </div>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-2">
                    ※ 相手が翌周ピットに入った際のピット出口合流時点での予測タイム差です。
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section: Tyre Warming Up (アウトラップの走り方) */}
          <div className="bg-slate-900/80 border border-white/10 rounded-2xl p-6 flex flex-col gap-4">
            <div>
              <div className="text-xs font-racing font-bold text-amber-400 uppercase tracking-wider mb-1">
                OUT-LAP WARMUP TECHNIQUE
              </div>
              <h3 className="text-lg font-racing font-black text-white">
                タイヤウォーミングアップ：アウトラップの走り方がなぜ重要か
              </h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                {TYRE_WARMUP_GUIDE.overview}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {TYRE_WARMUP_GUIDE.phases.map((phase, idx) => (
                <div key={idx} className="bg-slate-950/80 p-4 rounded-xl border border-white/10 flex flex-col justify-between gap-2">
                  <div>
                    <h5 className="font-racing font-bold text-xs text-amber-300 mb-1">{phase.title}</h5>
                    <p className="text-xs text-slate-200 leading-relaxed mb-2">{phase.action}</p>
                    <div className="text-[11px] text-slate-400 bg-slate-900 p-2 rounded-lg mb-2">
                      <strong className="text-slate-300">理由: </strong>{phase.reason}
                    </div>
                  </div>
                  <div className="text-[10px] text-rose-400 border-t border-white/5 pt-1">
                    ⚠️ リスク: {phase.risk}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section: Tyre Cliff (崖のメカニズムと予兆) */}
          <div className="bg-slate-900/80 border border-white/10 rounded-2xl p-6 flex flex-col gap-4">
            <div>
              <div className="text-xs font-racing font-bold text-rose-400 uppercase tracking-wider mb-1">
                THE CLIFF PHENOMENON
              </div>
              <h3 className="text-lg font-racing font-black text-white">{TYRE_CLIFF_GUIDE.title}</h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">{TYRE_CLIFF_GUIDE.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {TYRE_CLIFF_GUIDE.symptoms.map((item, idx) => (
                <div key={idx} className="bg-slate-950/80 p-4 rounded-xl border border-rose-500/20 flex flex-col gap-1.5">
                  <div className="flex items-center gap-2 text-rose-400 font-racing font-bold text-xs">
                    <span>⚠️ 予兆 {idx + 1}:</span>
                    <span>{item.sign}</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Section: Track Temp (Day vs Night Races) */}
          <div className="bg-slate-900/80 border border-white/10 rounded-2xl p-6 flex flex-col gap-4">
            <h3 className="text-lg font-racing font-black text-white">{TRACK_TEMP_STRATEGY.title}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-950/80 p-5 rounded-xl border border-amber-500/30 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-racing font-bold text-sm text-amber-400">{TRACK_TEMP_STRATEGY.dayRaces.title}</h4>
                  <span className="text-xs font-mono bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded">
                    {TRACK_TEMP_STRATEGY.dayRaces.trackTemp}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400">
                  代表例: {TRACK_TEMP_STRATEGY.dayRaces.examples.join(', ')}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed mt-1">
                  {TRACK_TEMP_STRATEGY.dayRaces.dynamics}
                </p>
              </div>

              <div className="bg-slate-950/80 p-5 rounded-xl border border-sky-500/30 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-racing font-bold text-sm text-sky-400">{TRACK_TEMP_STRATEGY.nightRaces.title}</h4>
                  <span className="text-xs font-mono bg-sky-500/20 text-sky-300 px-2 py-0.5 rounded">
                    {TRACK_TEMP_STRATEGY.nightRaces.trackTemp}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400">
                  代表例: {TRACK_TEMP_STRATEGY.nightRaces.examples.join(', ')}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed mt-1">
                  {TRACK_TEMP_STRATEGY.nightRaces.dynamics}
                </p>
              </div>
            </div>
          </div>

          {/* Section: Safety Car Strategy Matrix */}
          <div className="bg-slate-900/80 border border-white/10 rounded-2xl p-6 flex flex-col gap-4">
            <div>
              <div className="text-xs font-racing font-bold text-emerald-400 uppercase tracking-wider mb-1">
                DECISION MATRIX
              </div>
              <h3 className="text-lg font-racing font-black text-white">{SAFETY_CAR_DECISION_MATRIX.title}</h3>
              <p className="text-xs text-slate-300 mt-0.5">{SAFETY_CAR_DECISION_MATRIX.description}</p>
            </div>

            <div className="flex flex-col gap-2.5">
              {SAFETY_CAR_DECISION_MATRIX.rules.map((rule, idx) => (
                <div key={idx} className="bg-slate-950/80 p-4 rounded-xl border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="flex-1">
                    <div className="text-[11px] font-racing font-bold text-slate-400 mb-0.5">状況 {idx + 1}:</div>
                    <div className="text-xs font-bold text-white mb-1">{rule.scenario}</div>
                    <p className="text-xs text-slate-300 leading-relaxed">{rule.reason}</p>
                  </div>
                  <div className="bg-slate-900 px-4 py-2 rounded-xl border border-white/10 font-racing font-bold text-xs text-center min-w-[140px]">
                    <span className="text-[10px] text-slate-400 block">ストラテジスト判断</span>
                    <span className={rule.action.includes('BOX') ? 'text-emerald-400' : 'text-amber-400'}>
                      {rule.action}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          LAYER 3: 玄人向け — 「データで読むタイヤ」
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {activeLayer === 'expert' && (
        <div className="flex flex-col gap-6 animate-fade-in">
          {/* Section: Degradation Curve & Telemetry Navigation */}
          <div className="bg-gradient-to-r from-purple-950/40 via-slate-900/80 to-slate-950 border border-purple-500/30 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-racing font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  MATHEMATICAL TELEMETRY LINK
                </span>
              </div>
              <h3 className="text-xl font-racing font-black text-white">
                デグラデーション曲線の数理：燃料軽重効果との相殺
              </h3>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                F1マシンは燃料消費により「1周あたり約0.06秒」自然に速くなります。一方でタイヤ摩耗により「1周あたり約0.10秒」遅くなります。この差し引き（正味約0.04秒のタイム落ち）が真のデグラデーションです。
              </p>
            </div>

            {onNavigateToTelemetry && (
              <button
                onClick={() => onNavigateToTelemetry()}
                className="px-5 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-racing font-black text-xs flex items-center gap-2 shadow-lg shadow-purple-900/40 active:scale-95 transition-all self-start md:self-auto whitespace-nowrap"
              >
                <span>📊</span>
                <span>テレメトリー分析で実デグラを見る</span>
                <span>➔</span>
              </button>
            )}
          </div>

          {/* Section: Driver Tyre Management Styles (VER/HAM/NOR/PER) */}
          <div className="bg-slate-900/80 border border-white/10 rounded-2xl p-6 flex flex-col gap-4">
            <div>
              <div className="text-xs font-racing font-bold text-purple-400 uppercase tracking-wider mb-1">
                DRIVER TELEMETRY STYLES
              </div>
              <h3 className="text-lg font-racing font-black text-white">
                タイヤに優しいドライバー vs アグレッシブなドライバー (VER / HAM / NOR / PER)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                同じマシンでも、ドライバーのステアリング舵角の滑らかさとペダル操作でタイヤ寿命は10周以上変わります。
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {DRIVER_TYRE_STYLES.map((driver, idx) => (
                <div key={idx} className="bg-slate-950/80 p-5 rounded-2xl border border-white/10 flex flex-col justify-between gap-3">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-racing font-black text-base text-white">{driver.driver}</h4>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                        {driver.styleCategory}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono mb-2">{driver.team}</div>
                    <p className="text-xs text-slate-300 leading-relaxed mb-3">{driver.technique}</p>
                  </div>
                  <div className="bg-slate-900 p-3 rounded-xl border border-white/5 text-xs text-purple-300">
                    <strong className="text-purple-400 block mb-0.5">走法の真髄:</strong>
                    {driver.secret}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section: Pirelli C1-C6 Spectrum */}
          <div className="bg-slate-900/80 border border-white/10 rounded-2xl p-6 flex flex-col gap-4">
            <div>
              <div className="text-xs font-racing font-bold text-sky-400 uppercase tracking-wider mb-1">
                PIRELLI OFFICIAL ALLOCATION
              </div>
              <h3 className="text-lg font-racing font-black text-white">
                Pirelli公式データの見方 ＆ C1〜C6 スペクトラム (2025新導入C6)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                FIAとピレリがグランプリごとに発行する公式テクニカルシートの全6コンパウンド特性一覧です。
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {PIRELLI_COMPOUNDS.map((item: PirelliHardnessLevel) => {
                const isC6 = item.code === 'C6';
                return (
                  <div
                    key={item.code}
                    className={`p-4 rounded-xl border flex flex-col justify-between gap-2 ${
                      isC6
                        ? 'bg-purple-950/30 border-purple-500/50'
                        : 'bg-slate-950/80 border-white/10'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-racing font-black text-lg text-white">{item.code}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                          {item.hardness}
                        </span>
                      </div>
                      <div className="text-xs font-bold text-slate-200 mb-1">{item.name}</div>
                      <div className="text-[11px] text-slate-400 mb-2">作動温度: {item.workingTemp}</div>
                      <p className="text-[11px] text-slate-300 leading-relaxed">{item.characteristic}</p>
                    </div>
                    <div className="text-[10px] text-slate-400 border-t border-white/5 pt-2">
                      耐摩耗性: {item.abrasionResistance}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section: Diagnostics (Graining vs Blistering) */}
          <div className="bg-slate-900/80 border border-white/10 rounded-2xl p-6 flex flex-col gap-4">
            <h3 className="text-lg font-racing font-black text-white">
              タイヤトラブル熱診断：グレイニング vs ブリスター
            </h3>
            <div className="flex gap-2">
              {TYRE_TROUBLE_GUIDE.map((trouble) => {
                const isSelected = trouble.id === selectedTroubleId;
                return (
                  <button
                    key={trouble.id}
                    onClick={() => setSelectedTroubleId(trouble.id)}
                    className={`flex-1 p-3.5 rounded-xl border font-racing text-left transition-all flex items-center justify-between ${
                      isSelected
                        ? trouble.id === 'graining'
                          ? 'bg-amber-950/30 border-amber-500/60'
                          : 'bg-rose-950/30 border-rose-500/60'
                        : 'bg-slate-950/50 border-white/10 hover:bg-slate-900/50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl">{trouble.icon}</span>
                      <div>
                        <div className="font-black text-xs text-white">{trouble.name}</div>
                        <div className="text-[10px] text-slate-400">{trouble.englishName}</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/40 text-slate-300">
                      {trouble.severity}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="bg-slate-950/90 border border-white/10 rounded-xl p-5 flex flex-col gap-3">
              <div className="text-xs text-slate-300 leading-relaxed">
                <strong className="text-white block mb-1">発生メカニズム:</strong>
                {selectedTrouble.mechanism}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-900 p-3 rounded-lg">
                  <span className="text-amber-400 font-bold block mb-1">⚠️ 主な原因:</span>
                  <ul className="list-disc list-inside text-slate-300 space-y-0.5">
                    {selectedTrouble.causes.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </div>
                <div className="bg-slate-900 p-3 rounded-lg">
                  <span className="text-rose-400 font-bold block mb-1">📡 テレメトリー＆無線兆候:</span>
                  <ul className="list-disc list-inside text-slate-300 space-y-0.5">
                    {selectedTrouble.telemetrySymptoms.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="bg-slate-900/80 p-3 rounded-lg text-xs text-emerald-300 border border-emerald-500/20">
                <strong className="text-emerald-400 block mb-0.5">ピットウォールでの処方箋:</strong>
                {selectedTrouble.driverRemedy}
              </div>
            </div>
          </div>

          {/* Section: 2025 Team Tyre Aggression */}
          <div className="bg-slate-900/80 border border-white/10 rounded-2xl p-6 flex flex-col gap-4">
            <h3 className="text-lg font-racing font-black text-white">
              2025年グリッド チーム別サスペンション幾何とタイヤ攻撃性
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {TEAM_TYRE_TENDENCIES.map((t) => (
                <div key={t.teamId} className="bg-slate-950/80 p-4 rounded-xl border border-white/10 flex flex-col justify-between gap-2">
                  <div className="flex items-center justify-between">
                    <h5 className="font-racing font-bold text-sm text-white">{t.teamName}</h5>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                      {t.tyreAggression}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{t.summary}</p>
                  <div className="text-[10px] text-slate-400 border-t border-white/5 pt-1">
                    幾何: {t.suspensionKinematics}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section: 3 Historic Tyre Dramas */}
          <div className="bg-slate-900/80 border border-white/10 rounded-2xl p-6 flex flex-col gap-4">
            <div>
              <div className="text-xs font-racing font-bold text-rose-400 uppercase tracking-wider mb-1">
                HISTORIC TYRE CRUCIBLES
              </div>
              <h3 className="text-lg font-racing font-black text-white">
                F1史を揺るがした3大歴史的タイヤ事件アーカイブ
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {HISTORIC_TYRE_DRAMAS.map((drama) => {
                const isSelected = drama.id === selectedDramaId;
                return (
                  <button
                    key={drama.id}
                    onClick={() => setSelectedDramaId(drama.id)}
                    className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between gap-2 ${
                      isSelected
                        ? 'bg-rose-950/30 border-rose-500 shadow-md'
                        : 'bg-slate-950/60 border-white/10 hover:bg-slate-900/60'
                    }`}
                  >
                    <div>
                      <span className="text-[10px] font-racing font-bold px-2 py-0.5 rounded-full bg-slate-900 text-slate-400 border border-white/5 mb-1.5 inline-block">
                        {drama.year} {drama.grandPrix}
                      </span>
                      <h4 className="font-racing font-bold text-xs text-white">{drama.title}</h4>
                    </div>
                    <div className="text-[10px] text-slate-400 border-t border-white/5 pt-1">
                      主人公: {drama.hero}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="bg-slate-950/90 border border-white/10 rounded-xl p-5 flex flex-col gap-3">
              <div>
                <span className="text-[10px] font-racing font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300">
                  {selectedDrama.year}年 {selectedDrama.grandPrix}
                </span>
                <h4 className="text-base font-racing font-black text-white mt-1">{selectedDrama.title}</h4>
                <div className="text-xs text-emerald-400 font-bold mt-0.5">結果: {selectedDrama.outcome}</div>
              </div>

              <p className="text-xs text-slate-200 leading-relaxed bg-slate-900/60 p-3.5 rounded-lg border border-white/5">
                {selectedDrama.summary}
              </p>

              <div className="bg-slate-900 p-3 rounded-lg text-xs text-amber-300 border border-amber-500/20">
                <strong className="text-amber-400 block mb-0.5">残された工学的・戦略的教訓:</strong>
                {selectedDrama.engineeringLesson}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
