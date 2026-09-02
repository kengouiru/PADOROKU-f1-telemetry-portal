'use client';

/**
 * components/hubs/KnowledgeHistoryHub.tsx
 * Hub 3: F1 Knowledge & History with 5 Sub-Tabs, Academic In-Text Citations ([1]),
 * and Direct Telemetry Navigation Linking.
 */

import React, { useState, useRef } from 'react';
import {
  KNOWLEDGE_TEAMS,
  KNOWLEDGE_DRIVERS,
  KNOWLEDGE_CIRCUITS,
  KNOWLEDGE_STRATEGIES,
  KNOWLEDGE_HISTORY,
  type Reference,
  type TeamProfile,
  type DriverProfile,
  type CircuitProfile,
  type StrategyConcept,
  type HistoryArchive,
} from '@/data/f1KnowledgeData';

type SubTab = 'teams' | 'drivers' | 'circuits' | 'strategy' | 'history';

interface KnowledgeHistoryHubProps {
  onNavigateTelemetry?: (sessionKey?: number) => void;
}

export default function KnowledgeHistoryHub({ onNavigateTelemetry }: KnowledgeHistoryHubProps) {
  const [activeSubTab, setActiveSubTab] = useState<SubTab>('teams');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [highlightedRef, setHighlightedRef] = useState<string | null>(null);

  // Jump to Reference list & highlight target reference
  const handleCitationClick = (cardId: string, refId: number) => {
    const targetElementId = `ref-${cardId}-${refId}`;
    const el = document.getElementById(targetElementId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setHighlightedRef(targetElementId);
      setTimeout(() => setHighlightedRef(null), 3000);
    }
  };

  // Helper to parse "[1]", "[2]" into clickable citation badges
  const renderTextWithCitations = (text: string, cardId: string) => {
    const parts = text.split(/(\[\d+\])/g);
    return parts.map((part, idx) => {
      const match = part.match(/\[(\d+)\]/);
      if (match) {
        const refId = parseInt(match[1], 10);
        return (
          <button
            key={idx}
            onClick={() => handleCitationClick(cardId, refId)}
            className="inline-flex items-center px-1 mx-0.5 text-[10px] font-mono font-bold text-sky-400 bg-sky-950/60 hover:bg-sky-800/80 border border-sky-500/40 rounded transition-all cursor-pointer hover:scale-110"
            title={`参考文献 [${refId}] を確認`}
          >
            [{refId}]
          </button>
        );
      }
      return <span key={idx}>{part}</span>;
    });
  };

  // Render References Box at the bottom of a card
  const renderReferencesBox = (references: Reference[], cardId: string) => {
    if (!references || references.length === 0) return null;

    return (
      <div className="mt-3 pt-3 border-t border-white/10 bg-slate-950/40 rounded-xl p-3 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-racing font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <span>📚</span>
            <span>REFERENCES / 一次出典・公式文献</span>
          </span>
          <span className="text-[9px] text-slate-500 font-mono">Academic Verified</span>
        </div>

        <div className="space-y-1.5">
          {references.map((ref) => {
            const elId = `ref-${cardId}-${ref.id}`;
            const isHighlighted = highlightedRef === elId;
            return (
              <div
                key={ref.id}
                id={elId}
                className={`p-2 rounded-lg text-xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-1 border ${
                  isHighlighted
                    ? 'bg-amber-500/20 border-amber-400/80 ring-2 ring-amber-400/50 shadow-lg'
                    : 'bg-slate-900/60 border-white/5 hover:border-white/15'
                }`}
              >
                <div className="flex items-start gap-2">
                  <span className="font-mono text-[10px] font-bold text-sky-400 mt-0.5">
                    [{ref.id}]
                  </span>
                  <div>
                    <p className="text-slate-200 font-medium text-[11px] leading-tight">
                      {ref.title}
                    </p>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {ref.publisher} • 検証日: {ref.verifiedDate}
                    </span>
                  </div>
                </div>

                <a
                  href={ref.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sky-400 hover:text-sky-300 text-[10px] font-medium flex items-center gap-1 flex-shrink-0 self-end sm:self-center"
                >
                  <span>公式ドキュメントを開く</span>
                  <span>↗</span>
                </a>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-5 max-w-6xl mx-auto animate-fade-in">
      {/* Header Banner */}
      <div className="glass-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden">
        <div className="flex flex-col gap-1 z-10">
          <div className="flex items-center gap-2">
            <span className="text-xs font-racing font-bold text-sky-400 uppercase tracking-widest">
              ACADEMIC CITATIONS & ENCYCLOPEDIA
            </span>
          </div>
          <h2 className="text-xl font-racing font-black text-white tracking-wider">
            F1 KNOWLEDGE & HISTORICAL ARCHIVES
          </h2>
          <p className="text-xs text-slate-400 max-w-xl">
            FIA公式規則、チーム工学哲学、ドライバー特性、サーキットデータ、伝説の名勝負を一次出典（[1]）付きで体系化。
          </p>
        </div>

        {/* Search Bar */}
        <div className="z-10 w-full md:w-64">
          <input
            type="text"
            placeholder="ナレッジ内を検索..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900/80 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-400 transition-colors"
          />
        </div>
      </div>

      {/* 5 Main Sub-Tabs Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 bg-slate-950/60 p-1.5 rounded-2xl border border-white/10 shadow-inner">
        {(
          [
            ['teams', '🏎️ チーム紹介'],
            ['drivers', '👤 ドライバー名鑑'],
            ['circuits', '🏁 サーキット解説'],
            ['strategy', '🛞 戦略 & 規則'],
            ['history', '🏛️ 歴史アーカイブ'],
          ] as [SubTab, string][]
        ).map(([tab, label]) => (
          <button
            key={tab}
            onClick={() => {
              setActiveSubTab(tab);
              setSearchQuery('');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-racing font-bold transition-all flex-shrink-0 flex items-center gap-1.5 ${
              activeSubTab === tab
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── Sub-Tab 1: TEAMS ── */}
      {activeSubTab === 'teams' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
          {KNOWLEDGE_TEAMS.filter(
            (t) =>
              t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              t.philosophy.description.toLowerCase().includes(searchQuery.toLowerCase())
          ).map((team) => (
            <div
              key={team.id}
              className="glass-card p-5 flex flex-col justify-between gap-4 border-l-4"
              style={{ borderLeftColor: team.color }}
            >
              <div className="flex flex-col gap-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                      {team.base}
                    </span>
                    <h3 className="text-base font-bold text-white leading-tight">
                      {team.fullName}
                    </h3>
                    <span className="text-xs text-slate-400 font-mono">
                      代表: {team.teamPrincipal} • PU: {team.powerUnit}
                    </span>
                  </div>
                  <div className="bg-slate-900/90 px-2.5 py-1 rounded-xl border border-white/10 text-right">
                    <span className="text-xs font-bold text-amber-400 font-mono">
                      🏆 {team.constructorTitles}回
                    </span>
                    <span className="block text-[9px] text-slate-500">タイトル</span>
                  </div>
                </div>

                {/* Engineering Philosophy */}
                <div className="bg-slate-950/60 p-3.5 rounded-xl border border-white/5 space-y-2 text-xs">
                  <h4 className="text-[10px] font-racing font-bold text-sky-400 uppercase tracking-wider">
                    🛠️ 開発思想・エンジニアリング特性
                  </h4>
                  <p className="text-slate-200 leading-relaxed text-[11px]">
                    {renderTextWithCitations(team.philosophy.description, team.id)}
                  </p>
                  <div className="pt-2 border-t border-white/5 space-y-1 text-[11px] text-slate-400">
                    <div>
                      <strong className="text-slate-300 font-mono">空力焦点:</strong>{' '}
                      {team.philosophy.aeroFocus}
                    </div>
                    <div>
                      <strong className="text-slate-300 font-mono">サスペンション:</strong>{' '}
                      {team.philosophy.mechanicalFocus}
                    </div>
                  </div>
                </div>
              </div>

              {/* References Box */}
              {renderReferencesBox(team.references, team.id)}
            </div>
          ))}
        </div>
      )}

      {/* ── Sub-Tab 2: DRIVERS ── */}
      {activeSubTab === 'drivers' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
          {KNOWLEDGE_DRIVERS.filter(
            (d) =>
              d.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
              d.code.toLowerCase().includes(searchQuery.toLowerCase())
          ).map((driver) => (
            <div
              key={driver.id}
              className="glass-card p-5 flex flex-col justify-between gap-4 border-l-4"
              style={{ borderLeftColor: driver.teamColor }}
            >
              <div className="flex flex-col gap-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <span
                      className="text-sm font-racing font-bold px-2.5 py-1 rounded-xl border"
                      style={{
                        color: driver.teamColor,
                        borderColor: `${driver.teamColor}60`,
                        backgroundColor: `${driver.teamColor}15`,
                      }}
                    >
                      {driver.code} #{driver.number}
                    </span>
                    <div>
                      <h3 className="text-base font-bold text-white leading-tight">
                        {driver.fullName}
                      </h3>
                      <span className="text-xs text-slate-400 font-mono">
                        {driver.country} • {driver.team}
                      </span>
                    </div>
                  </div>

                  {driver.championships > 0 && (
                    <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full text-[10px] font-bold font-mono">
                      🏆 王座 {driver.championships}回
                    </span>
                  )}
                </div>

                {/* Driving Style Analysis */}
                <div className="bg-slate-950/60 p-3.5 rounded-xl border border-white/5 space-y-2 text-xs">
                  <h4 className="text-[10px] font-racing font-bold text-sky-400 uppercase tracking-wider">
                    🏎️ ドライビングスタイル＆操縦特性
                  </h4>
                  <p className="text-slate-300 leading-relaxed text-[11px]">
                    {driver.drivingStyle.summary}
                  </p>
                  <div className="pt-2 border-t border-white/5 space-y-1.5 text-[11px] text-slate-400">
                    <div>
                      <strong className="text-slate-300 font-mono">制動技術:</strong>{' '}
                      {renderTextWithCitations(driver.drivingStyle.brakingTechnique, driver.id)}
                    </div>
                    <div>
                      <strong className="text-slate-300 font-mono">タイヤ管理:</strong>{' '}
                      {renderTextWithCitations(driver.drivingStyle.tyreManagement, driver.id)}
                    </div>
                  </div>
                </div>

                {/* Career Milestones */}
                <div className="space-y-1 text-xs">
                  <h4 className="text-[10px] font-racing font-bold text-slate-400 uppercase tracking-wider">
                    🚩 キャリアの重要節目
                  </h4>
                  <ul className="space-y-1">
                    {driver.milestones.map((m, idx) => (
                      <li
                        key={idx}
                        className="bg-slate-900/60 p-2 rounded-lg text-[11px] text-slate-300 flex items-center justify-between border border-white/5"
                      >
                        <span>
                          <span className="text-slate-500 font-mono mr-2">{m.date}</span>
                          {m.event}
                        </span>
                        <button
                          onClick={() => handleCitationClick(driver.id, m.refId)}
                          className="text-[9px] font-mono text-sky-400 hover:underline flex-shrink-0 ml-2"
                        >
                          [{m.refId}]
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* References Box */}
              {renderReferencesBox(driver.references, driver.id)}
            </div>
          ))}
        </div>
      )}

      {/* ── Sub-Tab 3: CIRCUITS ── */}
      {activeSubTab === 'circuits' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
          {KNOWLEDGE_CIRCUITS.filter(
            (c) =>
              c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              c.country.toLowerCase().includes(searchQuery.toLowerCase())
          ).map((circuit) => (
            <div
              key={circuit.id}
              className="glass-card p-5 flex flex-col justify-between gap-4"
            >
              <div className="flex flex-col gap-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                      {circuit.country}
                    </span>
                    <h3 className="text-base font-bold text-white leading-tight">
                      {circuit.name}
                    </h3>
                    <span className="text-xs text-slate-400 font-mono">
                      {circuit.officialName}
                    </span>
                  </div>
                  <div className="bg-slate-900/80 px-2.5 py-1 rounded-xl border border-white/10 text-right">
                    <span className="text-xs font-bold text-sky-400 font-mono">
                      {circuit.lengthKm} km
                    </span>
                    <span className="block text-[9px] text-slate-500">
                      {circuit.turns}コーナー / DRS {circuit.drsZones}本
                    </span>
                  </div>
                </div>

                {/* Circuit Metrics Grid */}
                <div className="grid grid-cols-3 gap-2 bg-slate-950/60 p-2.5 rounded-xl border border-white/5 text-center text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 block">DF要求</span>
                    <strong className="text-slate-200 font-mono">{circuit.downforceLevel}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">タイヤ負荷</span>
                    <strong className="text-amber-400 font-mono">{circuit.tyreStress}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">想定ピットロス</span>
                    <strong className="text-sky-400 font-mono">{circuit.typicalPitLossSec}s</strong>
                  </div>
                </div>

                {/* Characteristics */}
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/40 p-3 rounded-xl border border-white/5">
                  {renderTextWithCitations(circuit.characteristics, circuit.id)}
                </p>

                {/* Lap Record & Telemetry Link */}
                <div className="flex items-center justify-between text-xs pt-2 border-t border-white/5">
                  <span className="text-[11px] text-slate-400">
                    ⏱️ コースレコード: <strong className="text-white font-mono">{circuit.lapRecord.time}</strong> ({circuit.lapRecord.driver})
                  </span>

                  {circuit.telemetrySession && onNavigateTelemetry && (
                    <button
                      onClick={() => onNavigateTelemetry(circuit.telemetrySession?.sessionKey)}
                      className="px-2.5 py-1 bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-500 hover:to-sky-500 text-white rounded-lg text-[10px] font-racing font-bold flex items-center gap-1 shadow-md transition-all"
                    >
                      <span>📊</span>
                      <span>テレメトリーで実データを確認</span>
                    </button>
                  )}
                </div>
              </div>

              {/* References Box */}
              {renderReferencesBox(circuit.references, circuit.id)}
            </div>
          ))}
        </div>
      )}

      {/* ── Sub-Tab 4: STRATEGY & REGULATIONS ── */}
      {activeSubTab === 'strategy' && (
        <div className="flex flex-col gap-4 animate-fade-in">
          {KNOWLEDGE_STRATEGIES.filter(
            (s) =>
              s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              s.description.toLowerCase().includes(searchQuery.toLowerCase())
          ).map((strat) => (
            <div
              key={strat.id}
              className="glass-card p-5 flex flex-col justify-between gap-4"
            >
              <div className="flex flex-col gap-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-racing font-bold text-sky-400 uppercase tracking-widest">
                      {strat.category}
                    </span>
                    <h3 className="text-base font-bold text-white leading-tight">
                      {strat.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">{strat.subtitle}</p>
                  </div>

                  {strat.telemetrySession && onNavigateTelemetry && (
                    <button
                      onClick={() => onNavigateTelemetry(strat.telemetrySession?.sessionKey)}
                      className="px-3 py-1.5 bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-500 hover:to-sky-500 text-white rounded-xl text-xs font-racing font-bold flex items-center gap-1.5 shadow-md transition-all"
                    >
                      <span>📊</span>
                      <span>テレメトリーでアンダーカットを見る</span>
                    </button>
                  )}
                </div>

                <p className="text-xs text-slate-200 leading-relaxed bg-slate-950/60 p-3.5 rounded-xl border border-white/5">
                  {renderTextWithCitations(strat.description, strat.id)}
                </p>

                {/* Key Takeaways */}
                <div>
                  <h4 className="text-[10px] font-racing font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    📌 戦略シミュレーションの重要公理
                  </h4>
                  <ul className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
                    {strat.keyTakeaways.map((takeaway, idx) => (
                      <li
                        key={idx}
                        className="bg-slate-900/80 p-2.5 rounded-xl border border-white/5 text-[11px] text-slate-300 flex items-start gap-1.5"
                      >
                        <span className="text-sky-400 font-bold">•</span>
                        <span>{takeaway}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* References Box */}
              {renderReferencesBox(strat.references, strat.id)}
            </div>
          ))}
        </div>
      )}

      {/* ── Sub-Tab 5: HISTORY ARCHIVE ── */}
      {activeSubTab === 'history' && (
        <div className="flex flex-col gap-4 animate-fade-in">
          {KNOWLEDGE_HISTORY.filter(
            (h) =>
              h.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              h.grandPrix.toLowerCase().includes(searchQuery.toLowerCase())
          ).map((item) => (
            <div
              key={item.id}
              className="glass-card p-5 flex flex-col justify-between gap-4"
            >
              <div className="flex flex-col gap-3">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded text-[10px] font-mono font-bold">
                        {item.year}
                      </span>
                      <span className="text-xs font-mono text-slate-400">
                        {item.grandPrix}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-white leading-tight mt-1">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-400">{item.subtitle}</p>
                  </div>
                </div>

                <p className="text-xs text-slate-200 leading-relaxed bg-slate-950/60 p-3.5 rounded-xl border border-white/5">
                  {renderTextWithCitations(item.strategicNarrative, item.id)}
                </p>

                <div className="bg-slate-900/80 p-2.5 rounded-xl border border-amber-500/20 text-xs flex items-center gap-2">
                  <span className="text-amber-400">🏆</span>
                  <span className="text-slate-200 font-medium text-[11px]">
                    {item.outcome}
                  </span>
                </div>
              </div>

              {/* References Box */}
              {renderReferencesBox(item.references, item.id)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
