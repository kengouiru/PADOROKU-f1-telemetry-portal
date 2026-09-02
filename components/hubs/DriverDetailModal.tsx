'use client';

/**
 * components/hubs/DriverDetailModal.tsx
 * Comprehensive Detailed Modal/Drawer for F1 Drivers (Current & Legends).
 * Supports In-Text Citations ([1]), Keyboard Navigation, and Multi-tab Deep Dive.
 */

import React, { useState, useEffect, useRef } from 'react';
import type { DriverProfile, Reference } from '@/data/f1KnowledgeData';

interface DriverDetailModalProps {
  driver: DriverProfile;
  allDrivers: DriverProfile[];
  onSelectDriver: (driver: DriverProfile) => void;
  onClose: () => void;
}

type DetailTab = 'overview' | 'style' | 'bio' | 'references';

export default function DriverDetailModal({
  driver,
  allDrivers,
  onSelectDriver,
  onClose,
}: DriverDetailModalProps) {
  const [activeTab, setActiveTab] = useState<DetailTab>('overview');
  const [highlightedRef, setHighlightedRef] = useState<string | null>(null);
  const modalContentRef = useRef<HTMLDivElement>(null);

  // Find currentIndex for Prev / Next navigation
  const currentIndex = allDrivers.findIndex((d) => d.id === driver.id);
  const prevDriver = currentIndex > 0 ? allDrivers[currentIndex - 1] : allDrivers[allDrivers.length - 1];
  const nextDriver = currentIndex < allDrivers.length - 1 ? allDrivers[currentIndex + 1] : allDrivers[0];

  // Keyboard navigation: Left/Right arrow keys for driver prev/next, Escape to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && prevDriver) onSelectDriver(prevDriver);
      if (e.key === 'ArrowRight' && nextDriver) onSelectDriver(nextDriver);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [prevDriver, nextDriver, onClose, onSelectDriver]);

  // Jump to Reference & highlight
  const handleCitationClick = (refId: number) => {
    setActiveTab('references');
    setTimeout(() => {
      const targetElementId = `modal-ref-${driver.id}-${refId}`;
      const el = document.getElementById(targetElementId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setHighlightedRef(targetElementId);
        setTimeout(() => setHighlightedRef(null), 3000);
      }
    }, 100);
  };

  // Helper to parse "[1]", "[2]" into clickable citation badges
  const renderTextWithCitations = (text: string) => {
    const parts = text.split(/(\[\d+\])/g);
    return parts.map((part, idx) => {
      const match = part.match(/\[(\d+)\]/);
      if (match) {
        const refId = parseInt(match[1], 10);
        return (
          <button
            key={idx}
            onClick={() => handleCitationClick(refId)}
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-fade-in">
      {/* Modal Card */}
      <div
        ref={modalContentRef}
        className="glass-card bg-slate-950/95 border border-white/15 w-full max-w-4xl max-h-[90vh] flex flex-col rounded-3xl shadow-2xl overflow-hidden relative"
        style={{ borderTopColor: driver.teamColor, borderTopWidth: 4 }}
      >
        {/* Top Navigation Bar: Prev / Next & Close */}
        <div className="p-4 sm:px-6 bg-slate-900/90 border-b border-white/10 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => prevDriver && onSelectDriver(prevDriver)}
              className="p-1.5 sm:px-3 sm:py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-racing flex items-center gap-1 transition-all"
              title="前の選手 (←キー)"
            >
              <span>◀</span>
              <span className="hidden sm:inline">{prevDriver?.code}</span>
            </button>
            <button
              onClick={() => nextDriver && onSelectDriver(nextDriver)}
              className="p-1.5 sm:px-3 sm:py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-racing flex items-center gap-1 transition-all"
              title="次の選手 (→キー)"
            >
              <span className="hidden sm:inline">{nextDriver?.code}</span>
              <span>▶</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-500 font-mono hidden md:inline">
              キーボード [←] [→] で選手切り替え / [ESC] で閉じる
            </span>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center text-sm font-bold transition-all hover:scale-105"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Driver Hero Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-b from-slate-900/60 to-transparent border-b border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex flex-col items-center justify-center font-racing font-black border shadow-lg flex-shrink-0"
              style={{
                color: driver.teamColor,
                borderColor: `${driver.teamColor}60`,
                backgroundColor: `${driver.teamColor}15`,
              }}
            >
              <span className="text-xl sm:text-2xl leading-none">#{driver.number}</span>
              <span className="text-xs sm:text-sm tracking-wider mt-0.5">{driver.code}</span>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-slate-400 font-mono">{driver.country}</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono border ${
                    driver.status === 'Legend'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                  }`}
                >
                  {driver.status === 'Legend' ? '👑 殿堂入りレジェンド' : '🏁 現役ドライバー'}
                </span>
                <span className="bg-slate-800/80 text-slate-300 px-2 py-0.5 rounded-full text-[10px] font-medium border border-white/10">
                  {driver.driverType}
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
                {driver.fullName}
              </h2>
              <p className="text-xs text-slate-400">
                <strong className="text-slate-300">{driver.team}</strong>
                {driver.nickname && <span className="ml-2 text-slate-500">({driver.nickname})</span>}
              </p>
            </div>
          </div>

          {/* Championship Trophy Banner */}
          {driver.championships > 0 && (
            <div className="bg-gradient-to-r from-amber-500/20 to-yellow-500/10 border border-amber-500/40 rounded-2xl p-3 px-4 flex items-center gap-3 self-start sm:self-auto flex-shrink-0">
              <span className="text-2xl sm:text-3xl">🏆</span>
              <div>
                <span className="text-xs font-racing font-bold text-amber-300 uppercase tracking-widest block">
                  WORLD CHAMPION
                </span>
                <span className="text-base sm:text-lg font-black text-white font-mono">
                  {driver.championships}回 王座
                </span>
                {driver.championshipYears && (
                  <span className="block text-[10px] text-amber-200/80 font-mono">
                    ({driver.championshipYears.join(', ')})
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Sub-Tabs */}
        <div className="flex items-center gap-2 px-5 sm:px-6 pt-3 border-b border-white/10 bg-slate-900/40 overflow-x-auto">
          {(
            [
              ['overview', '📊 プロフィール & 実績'],
              ['style', '🏎️ 走行スタイル & 技術'],
              ['bio', '📖 人物像 & エピソード'],
              ['references', `📚 参考文献 (${driver.references.length})`],
            ] as [DetailTab, string][]
          ).map(([tab, label]) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2.5 px-3 text-xs font-racing font-bold transition-all border-b-2 flex-shrink-0 ${
                activeTab === tab
                  ? 'text-sky-400 border-sky-400 font-black'
                  : 'text-slate-400 border-transparent hover:text-slate-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Scrollable Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-5">
          {/* TAB 1: OVERVIEW & CAREER STATS */}
          {activeTab === 'overview' && (
            <div className="space-y-5 animate-fade-in">
              {/* Stats 4-Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-slate-900/80 border border-white/10 p-3.5 rounded-2xl text-center">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                    🏁 参戦数
                  </span>
                  <span className="text-xl font-bold font-mono text-white mt-1 block">
                    {driver.entries}
                  </span>
                  <span className="text-[9px] text-slate-500">グランプリ</span>
                </div>
                <div className="bg-slate-900/80 border border-white/10 p-3.5 rounded-2xl text-center">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                    🥇 優勝数
                  </span>
                  <span className="text-xl font-bold font-mono text-amber-400 mt-1 block">
                    {driver.wins}
                  </span>
                  <span className="text-[9px] text-slate-500">
                    勝率 {((driver.wins / driver.entries) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="bg-slate-900/80 border border-white/10 p-3.5 rounded-2xl text-center">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                    🍾 表彰台
                  </span>
                  <span className="text-xl font-bold font-mono text-sky-400 mt-1 block">
                    {driver.podiums}
                  </span>
                  <span className="text-[9px] text-slate-500">回獲得</span>
                </div>
                <div className="bg-slate-900/80 border border-white/10 p-3.5 rounded-2xl text-center">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                    ⏱️ ポールポジション
                  </span>
                  <span className="text-xl font-bold font-mono text-purple-400 mt-1 block">
                    {driver.polePositions}
                  </span>
                  <span className="text-[9px] text-slate-500">回獲得</span>
                </div>
              </div>

              {/* Bio Meta Grid */}
              <div className="bg-slate-950/60 border border-white/10 p-4 rounded-2xl grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
                <div>
                  <span className="text-slate-500 block text-[10px]">生年月日</span>
                  <span className="text-slate-200">{driver.birthDate}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">出身地</span>
                  <span className="text-slate-200">{driver.birthPlace}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">F1デビュー</span>
                  <span className="text-slate-200">{driver.f1Debut}</span>
                </div>
              </div>

              {/* Career Milestones Timeline */}
              <div className="space-y-2">
                <h4 className="text-xs font-racing font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <span>🚩</span>
                  <span>キャリアの重要節目タイムライン</span>
                </h4>
                <div className="space-y-2">
                  {driver.milestones.map((m, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-900/60 border border-white/5 p-3 rounded-xl flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-sky-400 text-[11px] bg-sky-950/60 px-2 py-0.5 rounded border border-sky-500/30 flex-shrink-0">
                          {m.date}
                        </span>
                        <span className="text-slate-200 font-medium">{m.event}</span>
                      </div>
                      <button
                        onClick={() => handleCitationClick(m.refId)}
                        className="text-[10px] font-mono text-sky-400 hover:underline flex-shrink-0 bg-slate-800 px-1.5 py-0.5 rounded"
                      >
                        [{m.refId}]
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DRIVING STYLE */}
          {activeTab === 'style' && (
            <div className="space-y-4 animate-fade-in">
              <div className="bg-slate-900/80 border border-white/10 p-4 rounded-2xl space-y-2">
                <h4 className="text-xs font-racing font-bold text-sky-400 uppercase tracking-wider">
                  🏁 操縦特性サマリー
                </h4>
                <p className="text-xs text-slate-200 leading-relaxed">
                  {driver.drivingStyle.summary}
                </p>
              </div>

              {/* Key Traits Badges */}
              <div className="space-y-2">
                <h4 className="text-xs font-racing font-bold text-slate-400 uppercase tracking-wider">
                  ⚡ 主なドライビングの特徴
                </h4>
                <div className="flex flex-wrap gap-2">
                  {driver.drivingStyle.traits.map((trait, idx) => (
                    <span
                      key={idx}
                      className="bg-slate-800/80 text-sky-200 border border-sky-500/30 px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 shadow-sm"
                    >
                      <span className="text-sky-400 font-bold">✓</span>
                      <span>{trait}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Braking & Tyre Deep Dive */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                <div className="bg-slate-950/60 border border-white/5 p-4 rounded-2xl space-y-1.5">
                  <span className="text-xs font-racing font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    <span>🛑</span>
                    <span>進入制動・ブレーキング技術</span>
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {renderTextWithCitations(driver.drivingStyle.brakingTechnique)}
                  </p>
                </div>

                <div className="bg-slate-950/60 border border-white/5 p-4 rounded-2xl space-y-1.5">
                  <span className="text-xs font-racing font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                    <span>🛞</span>
                    <span>タイヤライフ・熱管理</span>
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {renderTextWithCitations(driver.drivingStyle.tyreManagement)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: BIOGRAPHY & EPISODES */}
          {activeTab === 'bio' && (
            <div className="space-y-4 animate-fade-in">
              {/* Iconic Quote */}
              <div className="bg-gradient-to-r from-blue-950/60 to-purple-950/60 border border-blue-500/30 p-4 rounded-2xl space-y-1.5 shadow-lg">
                <span className="text-[10px] font-racing font-bold text-sky-400 uppercase tracking-wider">
                  💬 象徴的名言 / ICONIC QUOTE
                </span>
                <p className="text-sm font-serif italic text-white leading-relaxed">
                  {driver.biography.iconicQuote}
                </p>
              </div>

              {/* Personality & Character */}
              <div className="bg-slate-900/80 border border-white/10 p-4 rounded-2xl space-y-1.5">
                <h4 className="text-xs font-racing font-bold text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
                  <span>👤</span>
                  <span>人物像・レースでの振る舞い</span>
                </h4>
                <p className="text-xs text-slate-200 leading-relaxed">
                  {driver.biography.personality}
                </p>
              </div>

              {/* Off-Track Passions */}
              <div className="bg-slate-900/80 border border-white/10 p-4 rounded-2xl space-y-1.5">
                <h4 className="text-xs font-racing font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
                  <span>🌿</span>
                  <span>レース外の素顔・ライフスタイル</span>
                </h4>
                <p className="text-xs text-slate-200 leading-relaxed">
                  {driver.biography.offTrack}
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: REFERENCES & PRIMARY SOURCES */}
          {activeTab === 'references' && (
            <div className="space-y-3 animate-fade-in">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-racing font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <span>📚</span>
                  <span>一次出典・公式文献アーカイブ</span>
                </h4>
                <span className="text-[10px] font-mono text-slate-500">Academic Verified</span>
              </div>

              <div className="space-y-2">
                {driver.references.map((ref) => {
                  const elId = `modal-ref-${driver.id}-${ref.id}`;
                  const isHighlighted = highlightedRef === elId;
                  return (
                    <div
                      key={ref.id}
                      id={elId}
                      className={`p-3 rounded-xl text-xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2 border ${
                        isHighlighted
                          ? 'bg-amber-500/20 border-amber-400/80 ring-2 ring-amber-400/50 shadow-lg'
                          : 'bg-slate-900/70 border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <span className="font-mono text-xs font-bold text-sky-400 mt-0.5">
                          [{ref.id}]
                        </span>
                        <div>
                          <p className="text-slate-200 font-semibold text-xs leading-snug">
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
                        className="text-sky-400 hover:text-sky-300 text-xs font-medium flex items-center gap-1 flex-shrink-0 self-end sm:self-center bg-slate-800/80 px-2.5 py-1 rounded-lg border border-white/5 hover:border-sky-500/40"
                      >
                        <span>公式ドキュメントを開く</span>
                        <span>↗</span>
                      </a>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
