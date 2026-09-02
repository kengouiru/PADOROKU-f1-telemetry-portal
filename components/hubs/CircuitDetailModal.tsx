'use client';

/**
 * components/hubs/CircuitDetailModal.tsx
 * Comprehensive Detailed Modal for F1 Iconic Circuits.
 * Follows the 2-layer design architecture matching DriverDetailModal & TeamDetailModal,
 * with keyboard left/right navigation, technical setup tradeoffs, strategy dynamics,
 * telemetry deep linking, and academic primary citations.
 */

import React, { useState, useEffect, useRef } from 'react';
import type { CircuitProfile, Reference, TelemetryTarget } from '@/data/f1KnowledgeData';

interface CircuitDetailModalProps {
  circuit: CircuitProfile;
  allCircuits: CircuitProfile[];
  onSelectCircuit: (circuit: CircuitProfile) => void;
  onNavigateToTelemetry?: (target: TelemetryTarget) => void;
  onClose: () => void;
}

type CircuitTab = 'specs' | 'setup' | 'strategy' | 'telemetry';

export default function CircuitDetailModal({
  circuit,
  allCircuits,
  onSelectCircuit,
  onNavigateToTelemetry,
  onClose,
}: CircuitDetailModalProps) {
  const [activeTab, setActiveTab] = useState<CircuitTab>('specs');
  const [highlightedRef, setHighlightedRef] = useState<string | null>(null);
  const modalContentRef = useRef<HTMLDivElement>(null);

  // Find currentIndex for Prev / Next navigation
  const currentIndex = allCircuits.findIndex((c) => c.id === circuit.id);
  const prevCircuit = currentIndex > 0 ? allCircuits[currentIndex - 1] : allCircuits[allCircuits.length - 1];
  const nextCircuit = currentIndex < allCircuits.length - 1 ? allCircuits[currentIndex + 1] : allCircuits[0];

  // Keyboard navigation: Left/Right arrow keys for prev/next, Escape to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && prevCircuit) onSelectCircuit(prevCircuit);
      if (e.key === 'ArrowRight' && nextCircuit) onSelectCircuit(nextCircuit);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [prevCircuit, nextCircuit, onClose, onSelectCircuit]);

  // Jump to Reference & highlight
  const handleCitationClick = (refId: number) => {
    setActiveTab('telemetry');
    setTimeout(() => {
      const targetElementId = `circuit-ref-${circuit.id}-${refId}`;
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
        className="glass-card bg-slate-950/95 border border-white/15 w-full max-w-4xl max-h-[92vh] flex flex-col rounded-3xl shadow-2xl overflow-hidden relative"
        style={{ borderTopColor: '#38bdf8', borderTopWidth: 4 }}
      >
        {/* Top Navigation Bar */}
        <div className="p-3 sm:px-6 bg-slate-900/90 border-b border-white/10 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => prevCircuit && onSelectCircuit(prevCircuit)}
              className="px-2.5 py-1 sm:px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-racing flex items-center gap-1.5 transition-all"
              title="前のサーキット (←キー)"
            >
              <span>◀</span>
              <span className="font-mono font-bold">{prevCircuit?.name}</span>
            </button>
            <button
              onClick={() => nextCircuit && onSelectCircuit(nextCircuit)}
              className="px-2.5 py-1 sm:px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-racing flex items-center gap-1.5 transition-all"
              title="次のサーキット (→キー)"
            >
              <span className="font-mono font-bold">{nextCircuit?.name}</span>
              <span>▶</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[10px] text-slate-500 font-mono hidden md:inline">
              キーボード [←] [→] でサーキット切り替え / [ESC] で閉じる
            </span>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center text-sm font-bold transition-all hover:scale-105"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Circuit Hero Header */}
        <div className="p-5 sm:p-6 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-b from-slate-900/60 to-transparent">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex flex-col items-center justify-center font-racing font-black border border-sky-500/40 bg-sky-500/10 text-sky-400 shadow-xl flex-shrink-0">
              <span className="text-3xl sm:text-4xl">🏁</span>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-slate-400 font-mono">{circuit.country}</span>
                <span className="bg-sky-500/20 text-sky-300 border border-sky-500/40 px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono">
                  DF: {circuit.downforceLevel}
                </span>
                <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono">
                  タイヤ負荷: {circuit.tyreStress}
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
                {circuit.name}
              </h2>
              <p className="text-xs text-slate-400 font-mono">{circuit.officialName}</p>
            </div>
          </div>

          {/* Lap Record Banner */}
          <div className="rounded-2xl p-3 px-4 flex items-center gap-3 self-start sm:self-auto flex-shrink-0 bg-slate-900/80 border border-white/10 shadow-lg">
            <span className="text-2xl">⏱️</span>
            <div>
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">
                ALL-TIME LAP RECORD
              </span>
              <span className="text-base font-black text-sky-400 font-mono">
                {circuit.lapRecord.time}
              </span>
              <span className="block text-[10px] text-slate-400 font-mono">
                {circuit.lapRecord.driver} ({circuit.lapRecord.year})
              </span>
            </div>
          </div>
        </div>

        {/* Modal Sub-Tabs */}
        <div className="flex items-center gap-2 px-5 sm:px-6 pt-3 border-b border-white/10 bg-slate-900/40 overflow-x-auto">
          {(
            [
              ['specs', '🏁 サーキット諸元'],
              ['setup', '🔧 セットアップ & 空力要件'],
              ['strategy', '🛞 戦略指標 & タイヤ力学'],
              ['telemetry', `📊 テレメトリー連動 & 文献 (${circuit.references.length})`],
            ] as [CircuitTab, string][]
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
          {/* TAB 1: SPECS & CHARACTERISTICS */}
          {activeTab === 'specs' && (
            <div className="space-y-4 animate-fade-in">
              {/* Specs 4-Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-slate-900/80 border border-white/10 p-3.5 rounded-2xl text-center">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                    📏 コース全長
                  </span>
                  <span className="text-xl font-bold font-mono text-white mt-1 block">
                    {circuit.lengthKm}
                  </span>
                  <span className="text-[9px] text-slate-500">km</span>
                </div>
                <div className="bg-slate-900/80 border border-white/10 p-3.5 rounded-2xl text-center">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                    🔄 コーナー数
                  </span>
                  <span className="text-xl font-bold font-mono text-sky-400 mt-1 block">
                    {circuit.turns}
                  </span>
                  <span className="text-[9px] text-slate-500">ターン</span>
                </div>
                <div className="bg-slate-900/80 border border-white/10 p-3.5 rounded-2xl text-center">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                    🚀 DRSゾーン
                  </span>
                  <span className="text-xl font-bold font-mono text-emerald-400 mt-1 block">
                    {circuit.drsZones}
                  </span>
                  <span className="text-[9px] text-slate-500">箇所</span>
                </div>
                <div className="bg-slate-900/80 border border-white/10 p-3.5 rounded-2xl text-center">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                    ⏱️ 標準ピットロス
                  </span>
                  <span className="text-xl font-bold font-mono text-amber-400 mt-1 block">
                    約{circuit.typicalPitLossSec}
                  </span>
                  <span className="text-[9px] text-slate-500">秒</span>
                </div>
              </div>

              {/* Characteristics Narrative */}
              <div className="bg-slate-900/80 border border-white/10 p-4 rounded-2xl space-y-2">
                <h4 className="text-xs font-racing font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                  <span>📜</span>
                  <span>レイアウトの特徴 & サーキット解説</span>
                </h4>
                <p className="text-xs text-slate-200 leading-relaxed">
                  {renderTextWithCitations(circuit.characteristics)}
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: SETUP & AERODYNAMICS */}
          {activeTab === 'setup' && (
            <div className="space-y-4 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                <div className="bg-slate-950/80 border border-sky-500/30 p-4 rounded-2xl space-y-2">
                  <h4 className="text-xs font-racing font-bold text-sky-300 uppercase tracking-wider flex items-center gap-1.5">
                    <span>💨</span>
                    <span>ダウンフォース要求 & 最高速トレードオフ</span>
                  </h4>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white font-mono">レベル:</span>
                    <span className="bg-sky-500/20 text-sky-300 px-2.5 py-0.5 rounded-lg border border-sky-500/40 text-xs font-bold font-mono">
                      {circuit.downforceLevel} Downforce
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    ストレート最高速とコーナリンググリップの妥協点を極限まで追求するエアロパッケージが要求される。
                  </p>
                </div>

                <div className="bg-slate-950/80 border border-amber-500/30 p-4 rounded-2xl space-y-2">
                  <h4 className="text-xs font-racing font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                    <span>⚙️</span>
                    <span>サスペンション & 縁石アタック</span>
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    縁石（ソーセージカーブ）に乗った際のフロアボトミングを防ぎつつ、高速コーナーでの車高安定性を保つサスペンション剛性の両立が重要。
                  </p>
                </div>
              </div>

              {/* Brake & Cooling demands */}
              <div className="bg-slate-900/80 border border-white/10 p-4 rounded-2xl space-y-2">
                <h4 className="text-xs font-racing font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <span>🛑</span>
                  <span>ブレーキング負荷 & 冷却マネジメント</span>
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  ハードブレーキングゾーンでのブレーキディスク温度管理、および高温下でのキャリパー冷却とタイヤ熱伝導のコントロールが勝敗を分ける。
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: STRATEGY & TYRES */}
          {activeTab === 'strategy' && (
            <div className="space-y-4 animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-slate-900/80 border border-white/10 p-3.5 rounded-2xl text-center">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                    🛞 タイヤ負荷レベル
                  </span>
                  <span className="text-lg font-bold font-mono text-amber-400 mt-1 block">
                    {circuit.tyreStress}
                  </span>
                  <span className="text-[9px] text-slate-500">デグラデーション注意</span>
                </div>
                <div className="bg-slate-900/80 border border-white/10 p-3.5 rounded-2xl text-center">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                    ⏱️ ピットロスタイム
                  </span>
                  <span className="text-lg font-bold font-mono text-white mt-1 block">
                    約{circuit.typicalPitLossSec}秒
                  </span>
                  <span className="text-[9px] text-slate-500">ストップ＆ゴー</span>
                </div>
                <div className="bg-slate-900/80 border border-white/10 p-3.5 rounded-2xl text-center">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                    ⚡ アンダーカット効果
                  </span>
                  <span className="text-lg font-bold font-mono text-sky-400 mt-1 block">
                    極めて有効
                  </span>
                  <span className="text-[9px] text-slate-500">新品タイヤゲイン大</span>
                </div>
              </div>

              {/* Strategy Blueprint */}
              <div className="bg-slate-950/70 border border-white/10 p-4 rounded-2xl space-y-2">
                <h4 className="text-xs font-racing font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                  <span>⏱️</span>
                  <span>典型的なレース戦略パターン</span>
                </h4>
                <p className="text-xs text-slate-200 leading-relaxed">
                  路面温度とタイヤのデグラデーション傾きに応じて、1ストップ（Medium ➔ Hard）または攻撃的2ストップ（Soft ➔ Medium ➔ Hard）が交錯。クリーンエアを確保するピットアウト位置が決定的に重要。
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: TELEMETRY LINK & REFERENCES */}
          {activeTab === 'telemetry' && (
            <div className="space-y-4 animate-fade-in">
              {/* Telemetry Deep Link Banner */}
              {circuit.telemetrySession && onNavigateToTelemetry && (
                <div className="bg-gradient-to-r from-blue-950/60 via-purple-950/40 to-slate-900/80 border border-sky-500/40 p-4 rounded-2xl space-y-3 shadow-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-racing font-bold text-sky-300 uppercase tracking-wider flex items-center gap-1.5">
                      <span>📊</span>
                      <span>テレメトリー実走行データ連携</span>
                    </span>
                    <span className="text-[10px] font-mono bg-sky-900/60 text-sky-200 px-2 py-0.5 rounded border border-sky-500/30">
                      Season {circuit.telemetrySession.year}
                    </span>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    本サーキットの公式実走行テレメトリー（車速・スロットル・ギア・DRS区間ログ）を、メインのテレメトリー分析画面にロードして詳細解析します。
                  </p>
                  <button
                    onClick={() => {
                      onClose();
                      if (circuit.telemetrySession) {
                        onNavigateToTelemetry(circuit.telemetrySession);
                      }
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-racing font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all hover:scale-[1.01]"
                  >
                    <span>📊 テレメトリーで実データを確認 ➔</span>
                  </button>
                </div>
              )}

              {/* References List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-racing font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <span>📚</span>
                    <span>一次出典・FIA公式サーキットドキュメント</span>
                  </h4>
                  <span className="text-[10px] font-mono text-slate-500">Academic Verified</span>
                </div>

                <div className="space-y-2">
                  {circuit.references.map((ref) => {
                    const elId = `circuit-ref-${circuit.id}-${ref.id}`;
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
