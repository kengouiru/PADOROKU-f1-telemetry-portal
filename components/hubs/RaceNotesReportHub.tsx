'use client';

/**
 * components/hubs/RaceNotesReportHub.tsx
 * Hub 4: Race Observation Notes, Strategy Logging, and Session Summary AI Report Generator.
 */

import React, { useState, useEffect } from 'react';
import type { Driver, Lap, Stint, PitStop, SafetyCarPeriod } from '@/lib/types';
import { formatLapTime } from '@/lib/telemetryUtils';
import { getGeminiAuthHeaders } from '@/lib/apiKeyService';

interface RaceNotesReportHubProps {
  selectedDrivers: string[];
  drivers: Driver[];
  lapsCache: Record<string, Lap[]>;
  stints: Stint[];
  pitStopsCache: Record<string, PitStop[]>;
  safetyCarPeriods: SafetyCarPeriod[];
  sessionName?: string;
}

export default function RaceNotesReportHub({
  selectedDrivers,
  drivers,
  lapsCache,
  stints,
  pitStopsCache,
  safetyCarPeriods,
  sessionName = '2024 Bahrain GP Race',
}: RaceNotesReportHubProps) {
  const storageKey = `f1_race_notes_${sessionName}`;
  const [noteContent, setNoteContent] = useState<string>('');
  const [aiReport, setAiReport] = useState<string>('');
  const [isGeneratingAi, setIsGeneratingAi] = useState<boolean>(false);
  const [saveStatus, setSaveStatus] = useState<string>('保存済み');

  // Load saved notes from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        setNoteContent(saved);
      } else {
        // Default starter template
        setNoteContent(`# 📝 レース観戦ノート — ${sessionName}\n\n## 🏁 レース序盤 (Lap 1 - 15)\n- \n\n## 🛞 ピットストップ＆戦略分岐 (Lap 16 - 35)\n- \n\n## 🏆 レース終盤＆総括 (Lap 36 - Finish)\n- \n`);
      }
    }
  }, [storageKey, sessionName]);

  const handleContentChange = (val: string) => {
    setNoteContent(val);
    setSaveStatus('保存中...');
    if (typeof window !== 'undefined') {
      localStorage.setItem(storageKey, val);
      setTimeout(() => setSaveStatus('保存済み'), 400);
    }
  };

  // Generate Session Summary Report via Gemini AI
  const handleGenerateAiReport = async () => {
    if (isGeneratingAi) return;
    setIsGeneratingAi(true);

    try {
      // Build session context
      const driverSummaries = selectedDrivers.map((num) => {
        const drv = drivers.find((d) => d.driver_number.toString() === num);
        const laps = lapsCache[num] ?? [];
        const pits = pitStopsCache[num] ?? [];
        const bestLap = laps.length > 0 ? Math.min(...laps.map((l) => l.lap_duration ?? 999)) : null;
        return `- ${drv?.full_name ?? num} (#${num}): 総周回数 ${laps.length}L, 自己ベスト ${formatLapTime(bestLap)}, ピット回数 ${pits.length}回`;
      });

      const scInfo = safetyCarPeriods.length > 0
        ? safetyCarPeriods.map((sc) => `SC/VSC: Lap ${sc.startLap} - ${sc.endLap ?? 'Finish'} (${sc.type})`).join(', ')
        : 'SC導入なし';

      const prompt = `あなたはトップクラスのF1チーフレースアナリストです。
以下のセッションデータおよびユーザーの観戦メモを踏まえ、【${sessionName}】の【レース総括分析レポート】を美しいMarkdownフォーマットで作成してください。

【セッション概要】
- セッション名: ${sessionName}
- セーフティカー出動状況: ${scInfo}
- 注目ドライバーのスタッツ:
${driverSummaries.join('\n')}

【ユーザー観戦メモ】
${noteContent}

【レポート作成構成】
1. 🏁 レースサマリー（勝敗の決定打・レース展開の要約）
2. ⚡ タイヤ戦略とアンダーカット成否の分析
3. 🏎️ 各ドライバーのペース比較とセクターパフォーマンス評価
4. 💡 次戦に向けた総括と技術的課題`;

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
          setAiReport(text);
        }
      } else {
        const json = await res.json();
        text = json.response ?? json.text ?? '';
        setAiReport(text);
      }
    } catch (e) {
      console.warn('[AI Report Gen Error]:', e);
      setAiReport('レポート生成に失敗しました。Gemini APIキーの設定を確認の上、再試行してください。');
    } finally {
      setIsGeneratingAi(false);
    }
  };

  // Export as Markdown File
  const handleExportMarkdown = () => {
    const fullText = `${noteContent}\n\n---\n\n# 🤖 Gemini AI レース総括レポート\n\n${aiReport || '（AIレポート未生成）'}`;
    const blob = new Blob([fullText], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `F1_Report_${sessionName.replace(/\s+/g, '_')}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col gap-5 max-w-6xl mx-auto animate-fade-in">
      {/* Header Banner */}
      <div className="glass-card-premium p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden rounded-2xl shadow-xl">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-purple-500 via-sky-500 to-f1-red" />
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-racing font-bold text-sky-400 uppercase tracking-widest">
              REPORTING & INTELLIGENCE
            </span>
          </div>
          <h2 className="text-xl font-racing font-black text-white tracking-wider">
            RACE NOTES & AI EXECUTIVE REPORT
          </h2>
          <p className="text-xs text-slate-400 max-w-xl mt-1">
            リアルタイム観戦メモの記録、テレメトリ連動メモ、およびGeminiによるレース総括レポートの自動生成。
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={handleGenerateAiReport}
            disabled={isGeneratingAi}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold font-racing flex items-center gap-2 shadow-lg shadow-purple-600/30 ring-1 ring-purple-400/40 transition-all cursor-pointer disabled:opacity-50"
          >
            {isGeneratingAi ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
                <span>AIレポート作成中...</span>
              </>
            ) : (
              <>
                <span>✨</span>
                <span>AIレース総括レポートを生成</span>
              </>
            )}
          </button>
          <button
            onClick={handleExportMarkdown}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-racing font-bold border border-white/10 transition-colors flex items-center gap-1.5 shadow-md cursor-pointer"
            title="Markdownとしてエクスポート"
          >
            <span>📥</span>
            <span>.md 保存</span>
          </button>
        </div>
      </div>

      {/* 2-Column Layout: Left (Editable Notes), Right (Generated AI Report) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Left: Notes Editor */}
        <div className="glass-card-premium p-5 flex flex-col gap-3 min-h-[460px] rounded-2xl shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
            <h3 className="text-xs font-racing font-bold text-white tracking-wider uppercase flex items-center gap-1.5">
              <span>📝</span>
              <span>LIVE OBSERVATION NOTES</span>
            </h3>
            <span className="text-[11px] text-emerald-400 font-mono flex items-center gap-1">
              <span>●</span>
              <span>{saveStatus}</span>
            </span>
          </div>
          <textarea
            value={noteContent}
            onChange={(e) => handleContentChange(e.target.value)}
            placeholder="ここにラップごとの気付きや無線内容、タイヤ状況をメモ..."
            className="w-full flex-1 bg-slate-950/60 border border-white/10 rounded-xl p-3.5 text-xs text-slate-200 font-mono leading-relaxed focus:outline-none focus:border-sky-400 transition-colors resize-none"
          />
        </div>

        {/* Right: AI Executive Report */}
        <div className="glass-card-premium p-5 flex flex-col gap-3 min-h-[460px] rounded-2xl shadow-lg border-purple-500/20 relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
            <h3 className="text-xs font-racing font-bold text-purple-300 tracking-wider uppercase flex items-center gap-1.5">
              <span>🤖</span>
              <span>AI EXECUTIVE SUMMARY REPORT</span>
            </h3>
            {aiReport && (
              <span className="text-[10px] text-purple-400 bg-purple-950/40 border border-purple-500/30 px-2 py-0.5 rounded-full font-mono">
                Gemini 生成完了
              </span>
            )}
          </div>

          <div className="flex-1 bg-slate-950/60 border border-white/10 rounded-xl p-4 overflow-y-auto max-h-[500px]">
            {aiReport ? (
              <div className="prose prose-invert prose-xs text-xs text-slate-200 leading-relaxed whitespace-pre-wrap font-sans space-y-3">
                {aiReport}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 gap-3 py-16">
                <span className="text-3xl">🤖</span>
                <p className="text-xs max-w-xs leading-relaxed">
                  上部の「✨ AIレース総括レポートを生成」をクリックすると、テレメトリと観戦メモを統合した総括分析レポートがここに表示されます。
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
