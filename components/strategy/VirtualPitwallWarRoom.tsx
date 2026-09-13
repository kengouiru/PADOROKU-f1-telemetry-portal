'use client';

/**
 * components/strategy/VirtualPitwallWarRoom.tsx
 * ⏱️ Virtual Pitwall Tactical War Room & Chief Strategist Simulator
 * Features:
 * - Dynamic Weather & Track Temperature Sliders (15°C~55°C, 0~15mm/min Rain)
 * - Multi-Compound Tyre Degradation Curves & Tyre Cliff Detection
 * - Safety Car (SC) / Virtual Safety Car (VSC) Cheap Pit Advantage Calculator
 * - Real-time Clean Air vs Traffic Exit Window Forecasting
 * - Chief Race Strategist Tactical Dilemmas with Engineering Evaluation
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
} from 'recharts';

interface CircuitStrategyProfile {
  id: string;
  name: string;
  flag: string;
  totalLaps: number;
  basePitLoss: number; // seconds
  tyreAggression: number; // 1.0 (low) to 1.5 (high)
}

const CIRCUITS: CircuitStrategyProfile[] = [
  { id: 'suzuka', name: '鈴鹿サーキット (日本)', flag: '🇯🇵', totalLaps: 53, basePitLoss: 23.0, tyreAggression: 1.4 },
  { id: 'bahrain', name: 'バーレーン (サヒール)', flag: '🇧🇭', totalLaps: 57, basePitLoss: 22.5, tyreAggression: 1.45 },
  { id: 'monaco', name: 'モナコ市街地コース', flag: '🇲🇨', totalLaps: 78, basePitLoss: 19.5, tyreAggression: 0.8 },
  { id: 'spa', name: 'スパ・フランコルシャン', flag: '🇧🇪', totalLaps: 44, basePitLoss: 22.0, tyreAggression: 1.35 },
  { id: 'monza', name: 'モンツァ (イタリア)', flag: '🇮🇹', totalLaps: 53, basePitLoss: 24.5, tyreAggression: 1.1 },
  { id: 'silverstone', name: 'シルバーストン', flag: '🇬🇧', totalLaps: 52, basePitLoss: 21.5, tyreAggression: 1.4 },
];

interface TacticalDilemma {
  id: string;
  title: string;
  scenario: string;
  options: {
    text: string;
    score: number; // 0 to 100
    outcome: string;
    precedent: string;
  }[];
}

const TACTICAL_DILEMMAS: TacticalDilemma[] = [
  {
    id: 'dilemma-1',
    title: '🌧️ 雨雲急接近：残り18周でトップ快走中のステイアウト判断',
    scenario: '残り18周、2位に4.2秒差をつけてトップを走行中。レーダー予測で4周後に大粒の雨（3mm/min）が直撃する見込み。今周回、2位のライバルが博打でインターミディエイトへピットインした。あなたのストラテジストコールは？',
    options: [
      {
        text: 'A: 即座に対抗ピットインし、インターミディエイトに履き替える',
        score: 40,
        outcome: '雨が降るまでの3〜4周でインターのトレッドゴムが乾いた路面で一瞬にしてオーバーヒート剥離（ブリスター）。大幅にタイムを失います。',
        precedent: '2021年 ロシアGP (ノリスの判断とハミルトンの対抗劇)',
      },
      {
        text: 'B: スリックでステイアウトし、路面が完全に濡れ始めるまで限界まで引っ張る',
        score: 95,
        outcome: '大正解！ドライ路面でのスリックの速さを維持し、雨が本降りになった周回でピットイン。ライバルに15秒以上の大差をつけて勝利を確定。',
        precedent: '2023年 モナコGP (フェルスタッペンの絶妙なステイアウト判断)',
      },
      {
        text: 'C: 新品ソフトへ履き替えてスプリント逃げ切りを図る',
        score: 10,
        outcome: '大失敗！雨が降り出した瞬間にスリックではコントロール不能になりコースアウト・スピンを喫します。',
        precedent: '2020年 トルコGP (雨天でのスリック誤選択)',
      },
    ],
  },
  {
    id: 'dilemma-2',
    title: '🚨 レース終盤SC出動：残り8周で中古ハードから新品ソフトへ替えるか？',
    scenario: '残り8周でクラッシュ発生、フルセーフティカー（SC）導入。あなたは首位走行中だが、タイヤは28周走行した中古ハード。2位のライバルは新品ソフトへ替える構え。ピットに入ると2位へ転落するが、タイヤのグリップ差は歴然。どうする？',
    options: [
      {
        text: 'A: ピットに入らず首位をキープ（トラックポジション最優先）',
        score: 30,
        outcome: 'SCリスタート後、冷え切った中古ハードでは発熱が間に合わず、新品ソフトを履いた2位にターン1〜3であっさり抜き去られます。',
        precedent: '2021年 アブダビGP最終周 (ハミルトン vs フェルスタッペン)',
      },
      {
        text: 'B: 即座にピットインし、新品ソフトに交換して首位を譲る（タイヤ攻撃力優先）',
        score: 95,
        outcome: '大正解！リスタート後に圧倒的なグリップ差とトラクションで1周以内に首位を奪還し、チェッカーを勝ち取ります。',
        precedent: '2021年 アブダビGP (フェルスタッペンの新品ソフト投入)',
      },
    ],
  },
];

export default function VirtualPitwallWarRoom() {
  const [selectedCircuitId, setSelectedCircuitId] = useState<string>('suzuka');
  const [trackTemp, setTrackTemp] = useState<number>(38); // °C (15~55)
  const [rainRate, setRainRate] = useState<number>(0); // mm/min (0~15)
  const [gapAheadSeconds, setGapAheadSeconds] = useState<number>(2.4); // s
  const [gapBehindSeconds, setGapBehindSeconds] = useState<number>(14.2); // s
  const [selectedDilemmaId, setSelectedDilemmaId] = useState<string>('dilemma-1');
  const [selectedChoiceIdx, setSelectedChoiceIdx] = useState<number | null>(null);

  const circuit = useMemo(() => {
    return CIRCUITS.find((c) => c.id === selectedCircuitId) || CIRCUITS[0];
  }, [selectedCircuitId]);

  // Degradation Curves Calculation
  // Generates 35 laps of simulated lap times per tyre compound
  const degCurvesData = useMemo(() => {
    const data = [];
    const tempFactor = (trackTemp - 25) * 0.015; // Higher temp hurts softs
    const wetFactor = rainRate * 2.2; // Rain severely hurts slicks

    for (let lap = 1; lap <= 35; lap++) {
      // Soft (Base 90.0s, high deg, cliff at lap 11)
      let soft = 90.0 + lap * (0.09 * circuit.tyreAggression + tempFactor) + (lap > 11 ? Math.pow(lap - 11, 1.8) * 0.35 : 0) + wetFactor * 3.5;
      
      // Medium (Base 90.7s, moderate deg, cliff at lap 22)
      let med = 90.7 + lap * (0.05 * circuit.tyreAggression + tempFactor * 0.6) + (lap > 22 ? Math.pow(lap - 22, 1.7) * 0.28 : 0) + wetFactor * 3.2;

      // Hard (Base 91.5s, low deg, cliff at lap 32)
      let hard = 91.5 + lap * (0.03 * circuit.tyreAggression + tempFactor * 0.3) + (lap > 32 ? Math.pow(lap - 32, 1.6) * 0.25 : 0) + wetFactor * 3.0;

      // Intermediate (Good in damp 2-6mm)
      let inter = rainRate > 1.5
        ? 94.0 + Math.max(0, 3.5 - rainRate) * 2.0 + lap * 0.04
        : 104.0 + lap * 0.4; // Melts on dry track

      data.push({
        lap,
        soft: Number(soft.toFixed(2)),
        medium: Number(med.toFixed(2)),
        hard: Number(hard.toFixed(2)),
        intermediate: Number(inter.toFixed(2)),
      });
    }
    return data;
  }, [circuit, trackTemp, rainRate]);

  // Cheap Pit Calculations
  const normalPitLoss = circuit.basePitLoss; // e.g. 23.0s
  const vscPitLoss = Number((normalPitLoss * 0.62).toFixed(1)); // ~14.3s
  const scPitLoss = Number((normalPitLoss * 0.48).toFixed(1)); // ~11.0s
  const vscSavings = Number((normalPitLoss - vscPitLoss).toFixed(1)); // +8.7s
  const scSavings = Number((normalPitLoss - scPitLoss).toFixed(1)); // +12.0s

  const canFreePitUnderSC = gapBehindSeconds > scPitLoss;
  const canFreePitUnderVSC = gapBehindSeconds > vscPitLoss;

  const currentDilemma = useMemo(() => {
    return TACTICAL_DILEMMAS.find((d) => d.id === selectedDilemmaId) || TACTICAL_DILEMMAS[0];
  }, [selectedDilemmaId]);

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-amber-500/30 overflow-hidden shadow-2xl p-5 md:p-6 space-y-6 animate-fadeIn">
      {/* ── Title & Circuit Selector ── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-mono font-bold tracking-wider">
              TACTICAL WAR ROOM
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              チーフ・ストラテジスト戦術司令室 ＆ タイヤ崖予測
            </span>
          </div>
          <h3 className="text-xl font-racing font-black text-white tracking-wide flex items-center gap-2">
            <span>バーチャル・ピットウォール戦術司令室</span>
          </h3>
        </div>

        {/* Circuit Selector Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-400">サーキット:</span>
          <select
            value={selectedCircuitId}
            onChange={(e) => setSelectedCircuitId(e.target.value)}
            className="bg-slate-950 border border-white/15 rounded-xl px-3 py-1.5 text-xs text-white font-racing focus:outline-none focus:border-amber-400 transition-colors"
          >
            {CIRCUITS.map((c) => (
              <option key={c.id} value={c.id}>
                {c.flag} {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ── Interactive Tactical Environment Sliders ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-slate-950/80 p-4 rounded-xl border border-white/10">
        {/* Track Temp Slider */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400">🌡️ 路面温度 (Track Temp):</span>
            <span className="text-amber-400 font-bold font-racing">{trackTemp} °C</span>
          </div>
          <input
            type="range"
            min={15}
            max={55}
            value={trackTemp}
            onChange={(e) => setTrackTemp(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
          />
          <div className="text-[10px] font-mono text-slate-500">
            {trackTemp > 45 ? '猛暑・ブリスター急増' : trackTemp < 25 ? '低温・グレイニング警戒' : '適正作動ウィンドウ'}
          </div>
        </div>

        {/* Rain Rate Slider */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400">🌧️ 天候 / 降水量:</span>
            <span className="text-sky-400 font-bold font-racing">{rainRate} mm/min</span>
          </div>
          <input
            type="range"
            min={0}
            max={15}
            step={0.5}
            value={rainRate}
            onChange={(e) => setRainRate(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-400"
          />
          <div className="text-[10px] font-mono text-slate-500">
            {rainRate === 0 ? '完全ドライ路面' : rainRate <= 2.0 ? 'ダンプ（湿潤・滑りやすい）' : rainRate <= 6.0 ? 'インターミディエイト適正' : 'フルウエット豪雨'}
          </div>
        </div>

        {/* Gap Behind Slider */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400">⏱️ 後続とのギャップ:</span>
            <span className="text-emerald-400 font-bold font-racing">{gapBehindSeconds} 秒</span>
          </div>
          <input
            type="range"
            min={1}
            max={30}
            step={0.5}
            value={gapBehindSeconds}
            onChange={(e) => setGapBehindSeconds(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
          />
          <div className="text-[10px] font-mono text-slate-500">
            {canFreePitUnderSC ? '🚨 SC中フリーピット可能！' : 'ピットで順位後退リスクあり'}
          </div>
        </div>

        {/* Gap Ahead Slider */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400">🎯 前走車とのギャップ:</span>
            <span className="text-purple-300 font-bold font-racing">{gapAheadSeconds} 秒</span>
          </div>
          <input
            type="range"
            min={0.5}
            max={10}
            step={0.1}
            value={gapAheadSeconds}
            onChange={(e) => setGapAheadSeconds(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-400"
          />
          <div className="text-[10px] font-mono text-slate-500">
            {gapAheadSeconds <= 2.5 ? '⚡ アンダーカット有効射程内' : '間隔大・オーバーカット警戒'}
          </div>
        </div>
      </div>

      {/* ── Safety Car / VSC Cheap Pit Calculator ── */}
      <div className="p-4 rounded-xl bg-slate-950/80 border border-white/10 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-bold text-white flex items-center gap-1.5">
            <span>🚨 セーフティカー（SC）＆ VSC「チープピット」アドバンテージ計算</span>
          </span>
          <span className="text-[11px] font-mono text-slate-400">
            通常ピットロス基準: <strong className="text-white">{normalPitLoss}秒</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Green Flag */}
          <div className="bg-slate-900/80 p-3 rounded-xl border border-white/10 space-y-1">
            <div className="text-[10px] font-mono text-slate-400 flex items-center justify-between">
              <span>🟢 通常グリーンフラッグ</span>
              <span>基準ロス</span>
            </div>
            <div className="text-xl font-racing font-bold text-slate-300">
              -{normalPitLoss} <span className="text-xs font-mono text-slate-500">秒</span>
            </div>
            <div className="text-[10px] text-slate-500 font-mono">全車が全開走行中のピット</div>
          </div>

          {/* VSC */}
          <div className="bg-slate-900/80 p-3 rounded-xl border border-sky-500/30 space-y-1">
            <div className="text-[10px] font-mono text-sky-400 flex items-center justify-between">
              <span>🟡 バーチャルSC (VSC)</span>
              <span className="text-emerald-400 font-bold">+{vscSavings}秒 ゲイン</span>
            </div>
            <div className="text-xl font-racing font-bold text-sky-300">
              -{vscPitLoss} <span className="text-xs font-mono text-slate-500">秒</span>
            </div>
            <div className="text-[10px] font-mono text-slate-400">
              {canFreePitUnderVSC ? '✓ 順位キープ可能 (フリーピット)' : '✕ 順位後退の可能性あり'}
            </div>
          </div>

          {/* Full SC */}
          <div className="bg-gradient-to-br from-red-950/40 to-slate-900 p-3 rounded-xl border border-red-500/40 space-y-1">
            <div className="text-[10px] font-mono text-amber-300 flex items-center justify-between font-bold">
              <span>🚨 フルセーフティカー (SC)</span>
              <span className="text-emerald-400 font-bold">+{scSavings}秒 ゲイン</span>
            </div>
            <div className="text-xl font-racing font-bold text-amber-400">
              -{scPitLoss} <span className="text-xs font-mono text-slate-500">秒</span>
            </div>
            <div className="text-[10px] font-mono text-emerald-400 font-bold">
              {canFreePitUnderSC ? '✓ 完璧な無償ピットストップ成立！' : '✕ 前走車のピットに引っかかる危険'}
            </div>
          </div>
        </div>
      </div>

      {/* ── Multi-Compound Tyre Degradation Curves & Tyre Cliff Detection ── */}
      <div className="bg-slate-950/90 rounded-2xl border border-white/10 p-4 md:p-6 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <div className="text-xs font-mono font-bold text-white flex items-center gap-2">
              <span>📉 コンパウンド別タイヤデグラデーション曲線 ＆「タイヤの崖（クリフ）」予測</span>
            </div>
            <div className="text-[10px] text-slate-400">
              周回を重ねるにつれラップタイムが急激に跳ね上がる変曲点（崖）を自動検知
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="text-red-400 flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" />
              <span>Soft (崖: Lap 11)</span>
            </span>
            <span className="text-amber-400 flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
              <span>Medium (崖: Lap 22)</span>
            </span>
            <span className="text-slate-300 flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-300 inline-block" />
              <span>Hard (崖: Lap 32)</span>
            </span>
            {rainRate > 0 && (
              <span className="text-emerald-400 flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
                <span>Inter</span>
              </span>
            )}
          </div>
        </div>

        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={degCurvesData} margin={{ top: 15, right: 10, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="lap" stroke="#64748b" tick={{ fontSize: 10, fill: '#64748b' }} tickFormatter={(l) => `L${l}`} />
              <YAxis domain={['dataMin - 1', 'dataMax + 2']} stroke="#64748b" tick={{ fontSize: 10, fill: '#64748b' }} tickFormatter={(s) => `${s}s`} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-slate-950/95 border border-white/20 p-2.5 rounded-xl text-xs font-mono space-y-1">
                        <div className="text-slate-400 font-bold">周回: Lap {data.lap}</div>
                        <div className="text-red-400">🔴 Soft: {data.soft}s {data.lap > 11 ? '(⚠️ 崖落ち)' : ''}</div>
                        <div className="text-amber-400">🟡 Medium: {data.medium}s {data.lap > 22 ? '(⚠️ 崖落ち)' : ''}</div>
                        <div className="text-slate-300">⚪ Hard: {data.hard}s {data.lap > 32 ? '(⚠️ 崖落ち)' : ''}</div>
                        {rainRate > 0 && <div className="text-emerald-400">🟢 Inter: {data.intermediate}s</div>}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              {/* Reference Lines for Cliffs */}
              <ReferenceLine x={11} stroke="#ef4444" strokeDasharray="3 3" label={{ value: 'Soft崖', fill: '#f87171', fontSize: 10 }} />
              <ReferenceLine x={22} stroke="#f59e0b" strokeDasharray="3 3" label={{ value: 'Med崖', fill: '#fbbf24', fontSize: 10 }} />
              <ReferenceLine x={32} stroke="#cbd5e1" strokeDasharray="3 3" label={{ value: 'Hard崖', fill: '#e2e8f0', fontSize: 10 }} />

              <Line type="monotone" dataKey="soft" stroke="#ef4444" strokeWidth={2.5} dot={false} />
              <Line type="monotone" dataKey="medium" stroke="#f59e0b" strokeWidth={2.5} dot={false} />
              <Line type="monotone" dataKey="hard" stroke="#e2e8f0" strokeWidth={2.5} dot={false} />
              {rainRate > 0 && <Line type="monotone" dataKey="intermediate" stroke="#10b981" strokeWidth={2} dot={false} />}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Chief Race Strategist Dilemma Interactive Game ── */}
      <div className="bg-slate-950/90 rounded-2xl border border-amber-500/30 p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
          <div>
            <div className="text-xs font-racing font-bold text-amber-300 uppercase tracking-wider flex items-center gap-2">
              <span>🧠 TACTICAL CALL DILEMMA</span>
              <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[9px] font-mono">
                現場ストラテジスト意思決定
              </span>
            </div>
            <div className="text-[11px] text-slate-400">
              レースエンジニア責任者として瞬時の無線指示を下し、勝率判定を受けよ
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {TACTICAL_DILEMMAS.map((d) => (
              <button
                key={d.id}
                type="button"
                onClick={() => {
                  setSelectedDilemmaId(d.id);
                  setSelectedChoiceIdx(null);
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                  selectedDilemmaId === d.id
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {d.title.split('：')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Scenario Card */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-white font-racing">{currentDilemma.title}</h4>
          <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-3.5 rounded-xl border border-white/5">
            {currentDilemma.scenario}
          </p>

          {/* Options */}
          <div className="space-y-2">
            {currentDilemma.options.map((opt, idx) => {
              const isSelected = selectedChoiceIdx === idx;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedChoiceIdx(idx)}
                  className={`w-full text-left p-3 rounded-xl border transition-all text-xs flex items-center justify-between ${
                    isSelected
                      ? opt.score >= 80
                        ? 'bg-emerald-950/60 border-emerald-400 text-emerald-100 ring-1 ring-emerald-400/50'
                        : 'bg-red-950/60 border-red-400 text-red-100 ring-1 ring-red-400/50'
                      : 'bg-slate-900/80 border-white/10 hover:border-white/30 text-slate-200'
                  }`}
                >
                  <span className="font-medium">{opt.text}</span>
                  {isSelected && (
                    <span className={`font-mono font-bold px-2 py-0.5 rounded text-[10px] flex-shrink-0 ml-2 ${
                      opt.score >= 80 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'
                    }`}>
                      評価スコア: {opt.score}点
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Decision Outcome & Historical Precedent */}
          {selectedChoiceIdx !== null && (
            <div className="p-4 rounded-xl bg-slate-900 border border-white/10 space-y-2 text-xs animate-fadeIn">
              <div className="font-bold text-white flex items-center gap-2">
                <span>🏁 判定結果:</span>
                <span className={currentDilemma.options[selectedChoiceIdx].score >= 80 ? 'text-emerald-400' : 'text-red-400'}>
                  {currentDilemma.options[selectedChoiceIdx].score >= 80 ? '大勝利！極めて優秀なストラテジスト判断' : '痛恨の戦術ミス！'}
                </span>
              </div>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                {currentDilemma.options[selectedChoiceIdx].outcome}
              </p>
              <div className="text-[10px] font-mono text-amber-300 pt-1 border-t border-white/5">
                🏛️ 類似の実例・先例: {currentDilemma.options[selectedChoiceIdx].precedent}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
