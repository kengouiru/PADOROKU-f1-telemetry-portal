'use client';

/**
 * components/telemetry/TelemetryDeltaAnalyzer.tsx
 * 🏎️ GPS Telemetry Delta (Δt) & Corner Apex Deep Matrix Analyzer
 * Features:
 * - High-precision GPS Time Delta trace (Δt) around the entire lap
 * - Corner-by-corner apex speed, braking start point, and throttle pick-up comparison table
 * - Dedicated Yuki Tsunoda (TSU) benchmark comparison presets (vs VER, LAW, NOR)
 * - AI Race Engineer debrief generator powered by Gemini
 */

import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import {
  generateNormalizedTelemetry,
  type TelemetryComparisonData,
  type CornerTelemetryAnalysis,
} from '@/lib/carTelemetryService';
import { KNOWLEDGE_CIRCUITS, KNOWLEDGE_DRIVERS } from '@/data/f1KnowledgeData';
import { getGeminiAuthHeaders } from '@/lib/apiKeyService';

interface TelemetryDeltaAnalyzerProps {
  initialCircuitId?: string;
  initialDriver1Code?: string;
  initialDriver2Code?: string;
  geminiApiKey?: string;
}

const PRESET_MATCHUPS = [
  { d1: 'TSU', d2: 'VER', label: '🇯🇵 角田裕毅 vs フェルスタッペン', desc: '王者とのブレーキング＆ボトム比較' },
  { d1: 'TSU', d2: 'LAW', label: '🏎️ 角田裕毅 vs ローソン', desc: 'RB同門・昇格争覇ベンチマーク' },
  { d1: 'TSU', d2: 'NOR', label: '⚡ 角田裕毅 vs ノリス', desc: 'マクラーレンエースとの旋回比較' },
  { d1: 'VER', d2: 'NOR', label: '🏆 フェルスタッペン vs ノリス', desc: '現役頂上決戦テレメトリー' },
  { d1: 'LEC', d2: 'HAM', label: '🔴 ルクレール vs ハミルトン', desc: '跳ね馬同門一発ペース対決' },
];

const SELECTABLE_CIRCUITS = [
  { id: 'suzuka', name: '鈴鹿サーキット (日本)', flag: '🇯🇵' },
  { id: 'bahrain-international', name: 'バーレーン・インターナショナル', flag: '🇧🇭' },
  { id: 'spa-francorchamps', name: 'スパ・フランコルシャン (ベルギー)', flag: '🇧🇪' },
  { id: 'monza', name: 'モンツァ・サーキット (イタリア)', flag: '🇮🇹' },
  { id: 'silverstone', name: 'シルバーストン (イギリス)', flag: '🇬🇧' },
  { id: 'monaco', name: 'モナコ市街地コース (モナコ)', flag: '🇲🇨' },
];

export default function TelemetryDeltaAnalyzer({
  initialCircuitId = 'suzuka',
  initialDriver1Code = 'TSU',
  initialDriver2Code = 'VER',
  geminiApiKey = '',
}: TelemetryDeltaAnalyzerProps) {
  const [circuitId, setCircuitId] = useState(initialCircuitId);
  const [driver1Code, setDriver1Code] = useState(initialDriver1Code);
  const [driver2Code, setDriver2Code] = useState(initialDriver2Code);

  // AI Debrief State
  const [aiDebrief, setAiDebrief] = useState<string | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState<boolean>(false);

  // Driver definitions
  const d1 = useMemo(() => {
    const found = KNOWLEDGE_DRIVERS.find((d) => d.code === driver1Code);
    return found
      ? { code: found.code, number: String(found.number), name: found.fullName, color: found.teamColor }
      : { code: 'TSU', number: '22', name: 'Yuki Tsunoda', color: '#38bdf8' };
  }, [driver1Code]);

  const d2 = useMemo(() => {
    const found = KNOWLEDGE_DRIVERS.find((d) => d.code === driver2Code);
    return found
      ? { code: found.code, number: String(found.number), name: found.fullName, color: found.teamColor }
      : { code: 'VER', number: '1', name: 'Max Verstappen', color: '#1e40af' };
  }, [driver2Code]);

  // Telemetry computation
  const telemetryData: TelemetryComparisonData = useMemo(() => {
    return generateNormalizedTelemetry(circuitId, d1, d2);
  }, [circuitId, d1, d2]);

  const { points, cornerAnalyses, circuitName, circuitLengthM } = telemetryData;

  // Final lap delta
  const finalDelta = points.length > 0 ? points[points.length - 1].delta : 0;
  const isD1OverallFaster = finalDelta >= 0;

  // Key corner reference markers
  const cornerMarkers = useMemo(() => {
    return cornerAnalyses || [];
  }, [cornerAnalyses]);

  // Request Gemini AI Debrief
  const handleGenerateAiDebrief = async () => {
    if (isLoadingAi) return;
    setIsLoadingAi(true);

    try {
      const topCorners = cornerAnalyses?.slice(0, 5) || [];
      const cornerSummaryText = topCorners
        .map(
          (c) =>
            `・${c.cornerName}: ${d1.code}(${c.d1ApexSpeed}km/h) vs ${d2.code}(${c.d2ApexSpeed}km/h), 差: ${c.apexSpeedDelta > 0 ? '+' : ''}${c.apexSpeedDelta}km/h, 優勢: ${c.advantageDriver} (${c.keyTacticalNote})`
        )
        .join('\n');

      const prompt = `あなたはF1のチーフレースエンジニア（データアナリスト）です。
以下の実テレメトリー比較データ（${circuitName}）に基づき、${d1.name} (${d1.code}) と ${d2.name} (${d2.code}) のドライビングスタイルおよびタイム差発生メカニズムについて、国内の熱心なF1ファン・技術志向ファンに向けて【超本格的で論理的なエンジニア・デブリーフ（分析レポート）】を作成してください。

【サーキット】: ${circuitName} (全長: ${circuitLengthM}m)
【総合タイム差】: ${d1.code}基準で ${finalDelta > 0 ? '+' : ''}${finalDelta.toFixed(3)} 秒 (${isD1OverallFaster ? `${d1.code}が先行` : `${d2.code}が先行`})
【主要コーナー詳細マトリクス】:
${cornerSummaryText}

【出力構成】:
1. 🏁 【総合ラップタイム総括】：どこでタイム差が決まったか（ストレート最高速 vs 低中速コーナーの旋回G）
2. 🏎️ 【${d1.code}の走法解剖】：ブレーキングの進入姿勢、トレイルブレーキ、スロットル全開タイミングの長所と課題
3. ⚡ 【${d2.code}の走法解剖】：マシンの向きの変え方、エイペックス速度、脱出トラクションの比較
4. 🛠️ 【次セッションへのセットアップ提言】：車高・フロントウイング角・デフ設定への具体的推奨`;

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...getGeminiAuthHeaders(),
      };

      const res = await fetch('/api/strategist', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          messages: [{ role: 'user', content: prompt }],
        }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let text = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          text += decoder.decode(value, { stream: true });
          setAiDebrief(text);
        }
      } else {
        const json = await res.json();
        text = json.response ?? json.text ?? '';
        setAiDebrief(text);
      }
    } catch (e) {
      console.warn('[AI Telemetry Debrief Error]:', e);
      setAiDebrief('⚠️ AIエンジニアデブリーフの生成に失敗しました。しばらく時間を置いてお試しください。');
    } finally {
      setIsLoadingAi(false);
    }
  };

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-sky-500/30 overflow-hidden shadow-2xl p-5 md:p-6 space-y-6 animate-fadeIn">
      {/* ── Title & Preset Matchups ── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-400 border border-sky-500/30 text-[10px] font-mono font-bold tracking-wider">
              TELEMETRY DELTA & APEX MATRIX
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              GPSタイムデルタ線図 ＆ コーナー別ボトム速度解剖室
            </span>
          </div>
          <h3 className="text-xl font-racing font-black text-white tracking-wide flex items-center gap-2">
            <span>テレメトリーデルタ（Δt）＆ コーナー詳細解析</span>
          </h3>
        </div>

        {/* Circuit Selector Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-400">サーキット:</span>
          <select
            value={circuitId}
            onChange={(e) => setCircuitId(e.target.value)}
            className="bg-slate-950 border border-white/15 rounded-xl px-3 py-1.5 text-xs text-white font-racing focus:outline-none focus:border-sky-400 transition-colors"
          >
            {SELECTABLE_CIRCUITS.map((c) => (
              <option key={c.id} value={c.id}>
                {c.flag} {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ── Preset Comparison Matchup Pills ── */}
      <div className="flex flex-col gap-2">
        <div className="text-[11px] font-mono text-slate-400 font-bold flex items-center gap-1.5">
          <span>⚡</span>
          <span>注目ドライバー・直接対決プリセット（角田裕毅 特集）:</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {PRESET_MATCHUPS.map((p, idx) => {
            const isSelected = driver1Code === p.d1 && driver2Code === p.d2;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setDriver1Code(p.d1);
                  setDriver2Code(p.d2);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-racing font-bold transition-all border flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-sky-600 text-white border-sky-400 shadow-md shadow-sky-500/30 ring-1 ring-sky-300'
                    : 'bg-slate-950/80 text-slate-300 border-white/10 hover:border-white/30 hover:bg-slate-800'
                }`}
                title={p.desc}
              >
                <span>{p.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Lap Stats Summary Banner ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-slate-950/80 border border-white/10">
        {/* Driver 1 */}
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center font-racing font-bold text-white shadow-md border border-white/20 text-sm"
            style={{ backgroundColor: d1.color }}
          >
            {d1.code}
          </div>
          <div>
            <div className="text-xs font-racing font-bold text-white">{d1.name}</div>
            <div className="text-[10px] font-mono text-slate-400">想定ラップ: {telemetryData.driver1.lapTime}</div>
          </div>
        </div>

        {/* Delta Gauge */}
        <div className="flex flex-col items-center justify-center border-y sm:border-y-0 sm:border-x border-white/10 py-2 sm:py-0">
          <div className="text-[10px] font-mono text-slate-400">1周の積算タイム差 (Δt)</div>
          <div
            className={`text-2xl font-racing font-black tracking-wider ${
              isD1OverallFaster ? 'text-emerald-400' : 'text-amber-400'
            }`}
          >
            {isD1OverallFaster ? `+${finalDelta.toFixed(3)}s` : `${finalDelta.toFixed(3)}s`}
          </div>
          <div className="text-[10px] font-mono text-slate-400">
            {isD1OverallFaster ? `${d1.code} が ${Math.abs(finalDelta).toFixed(3)}秒 先行` : `${d2.code} が ${Math.abs(finalDelta).toFixed(3)}秒 先行`}
          </div>
        </div>

        {/* Driver 2 */}
        <div className="flex items-center gap-3 justify-end sm:justify-start">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center font-racing font-bold text-white shadow-md border border-white/20 text-sm"
            style={{ backgroundColor: d2.color }}
          >
            {d2.code}
          </div>
          <div>
            <div className="text-xs font-racing font-bold text-white">{d2.name}</div>
            <div className="text-[10px] font-mono text-slate-400">想定ラップ: {telemetryData.driver2.lapTime}</div>
          </div>
        </div>
      </div>

      {/* ── Interactive GPS Cumulative Delta Trace (Δt) Graph ── */}
      <div className="bg-slate-950/90 rounded-2xl border border-white/10 p-4 md:p-6 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="text-xs font-mono font-bold text-white flex items-center gap-2">
            <span>📈 累積タイムデルタ波形（コース進行距離 0m ➡️ {circuitLengthM}m）</span>
          </div>
          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="text-emerald-400 flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500/80 inline-block" />
              <span>{d1.code} ゲイン区間 (プラス)</span>
            </span>
            <span className="text-amber-400 flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-sm bg-amber-500/80 inline-block" />
              <span>{d2.code} ゲイン区間 (マイナス)</span>
            </span>
          </div>
        </div>

        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={points} margin={{ top: 15, right: 10, left: -20, bottom: 5 }}>
              <defs>
                <linearGradient id="deltaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="50%" stopColor="#38bdf8" stopOpacity={0.1} />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity={0.4} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis
                dataKey="distMeters"
                stroke="#64748b"
                tick={{ fontSize: 10, fill: '#64748b' }}
                tickFormatter={(m) => `${m}m`}
              />
              <YAxis
                stroke="#64748b"
                tick={{ fontSize: 10, fill: '#64748b' }}
                domain={[-0.4, 0.4]}
                tickFormatter={(v) => `${v > 0 ? '+' : ''}${v}s`}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-slate-950/95 border border-white/20 p-2.5 rounded-xl shadow-2xl text-xs font-mono space-y-1">
                        <div className="text-slate-400">距離: {data.distMeters}m ({data.distPercent}%)</div>
                        {data.cornerName && (
                          <div className="text-sky-300 font-bold">📍 コーナー: {data.cornerName}</div>
                        )}
                        <div className="text-white font-bold flex items-center gap-2">
                          <span>Δt:</span>
                          <span className={data.delta >= 0 ? 'text-emerald-400' : 'text-amber-400'}>
                            {data.delta >= 0 ? `+${data.delta}s` : `${data.delta}s`}
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-3 text-[11px] pt-1 border-t border-white/10">
                          <span style={{ color: d1.color }}>{d1.code}: {data.speed1} km/h (Thr: {data.throttle1}%)</span>
                          <span style={{ color: d2.color }}>{d2.code}: {data.speed2} km/h (Thr: {data.throttle2}%)</span>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <ReferenceLine y={0} stroke="#475569" strokeWidth={1.5} />
              {cornerMarkers.map((c, idx) => (
                <ReferenceLine
                  key={idx}
                  x={c.distanceMeters}
                  stroke="#38bdf8"
                  strokeDasharray="2 2"
                  opacity={0.5}
                />
              ))}
              <Area
                type="monotone"
                dataKey="delta"
                stroke="#38bdf8"
                strokeWidth={2.5}
                fill="url(#deltaGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Corner-by-Corner Telemetry Matrix Table ── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-xs font-mono font-bold text-white flex items-center gap-2">
            <span>🏁 全コーナー別 エイペックスボトム速度＆制動点マトリクス</span>
          </div>
          <div className="text-[11px] font-mono text-slate-400">
            {circuitName} 全コーナー完全照合
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-white/10 bg-slate-950/80">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-900 text-slate-400 font-mono text-[10px] uppercase border-b border-white/10">
              <tr>
                <th className="px-3 py-2.5">コーナー名</th>
                <th className="px-3 py-2.5">ギア</th>
                <th className="px-3 py-2.5">{d1.code} ボトム速</th>
                <th className="px-3 py-2.5">{d2.code} ボトム速</th>
                <th className="px-3 py-2.5">速度差 (Delta)</th>
                <th className="px-3 py-2.5">優勢ドライバー</th>
                <th className="px-3 py-2.5">区間Δt</th>
                <th className="px-3 py-2.5">レースエンジニア戦術ノート</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-200">
              {cornerAnalyses?.map((c, idx) => {
                const isD1Ahead = c.advantageDriver === d1.code;
                return (
                  <tr key={idx} className="hover:bg-white/5 transition-colors">
                    <td className="px-3 py-2.5 font-bold text-white flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-sky-400" />
                      <span>{c.cornerName}</span>
                    </td>
                    <td className="px-3 py-2.5 font-mono text-slate-400">{c.gear}速</td>
                    <td className="px-3 py-2.5 font-mono font-bold" style={{ color: d1.color }}>
                      {c.d1ApexSpeed} <span className="text-[10px] font-normal text-slate-500">km/h</span>
                    </td>
                    <td className="px-3 py-2.5 font-mono font-bold" style={{ color: d2.color }}>
                      {c.d2ApexSpeed} <span className="text-[10px] font-normal text-slate-500">km/h</span>
                    </td>
                    <td className="px-3 py-2.5 font-mono font-bold">
                      <span className={c.apexSpeedDelta >= 0 ? 'text-emerald-400' : 'text-amber-400'}>
                        {c.apexSpeedDelta >= 0 ? `+${c.apexSpeedDelta}` : c.apexSpeedDelta} km/h
                      </span>
                    </td>
                    <td className="px-3 py-2.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-racing font-bold ${
                          isD1Ahead
                            ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        }`}
                      >
                        {c.advantageDriver}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 font-mono">
                      <span className={c.timeDeltaSeconds >= 0 ? 'text-emerald-400' : 'text-amber-400'}>
                        {c.timeDeltaSeconds >= 0 ? `+${c.timeDeltaSeconds}s` : `${c.timeDeltaSeconds}s`}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-slate-300 text-[11px] leading-tight">
                      {c.keyTacticalNote}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── AI Race Engineer Debrief Box ── */}
      <div className="bg-slate-950/90 rounded-2xl border border-purple-500/30 p-5 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="text-xs font-racing font-bold text-purple-300 uppercase tracking-wider flex items-center gap-2">
              <span>🎙️ AI CHIEF RACE ENGINEER DEBRIEF</span>
              <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-200 border border-purple-500/30 text-[9px] font-mono">
                ピットウォール無線解析
              </span>
            </div>
            <div className="text-[11px] text-slate-400">
              テレメトリー波形に基づき、担当チーフエンジニア視点で走法とタイム差を論理的に解説
            </div>
          </div>

          <button
            type="button"
            onClick={handleGenerateAiDebrief}
            disabled={isLoadingAi}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-racing font-bold shadow-lg shadow-purple-500/30 flex items-center gap-2 disabled:opacity-50 transition-all flex-shrink-0"
          >
            {isLoadingAi ? (
              <>
                <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>データ解析中...</span>
              </>
            ) : (
              <>
                <span>✨</span>
                <span>エンジニア・デブリーフを生成</span>
              </>
            )}
          </button>
        </div>

        {/* Debrief Output */}
        {aiDebrief && (
          <div className="bg-purple-950/30 rounded-xl p-4 border border-purple-500/20 text-xs text-slate-200 leading-relaxed whitespace-pre-wrap font-sans space-y-2 animate-fadeIn shadow-inner">
            {aiDebrief}
          </div>
        )}
      </div>
    </div>
  );
}
