'use client';

/**
 * components/hubs/CircuitDetailModal.tsx
 * Comprehensive Detailed Modal for F1 Iconic Circuits with 3 Major Consolidated Tabs:
 * 1. Track Map & Geometry (Visual Layout Map, Authentic Atmosphere Photo, Elevation, G-Forces, Complete Turn-by-Turn Guide)
 * 2. Engineering & Strategy (Aero Tradeoffs, Kerbs, Brakes, Tyre Dynamics & Telemetry Deep Link)
 * 3. History & Drama (Iconic Races with Moment Photos, In-Depth Strategic Stories, Historical Regulations Impact & Citations)
 *
 * Fully unified styling with DriverDetailModal and TeamDetailModal.
 */

import React, { useState, useEffect, useRef } from 'react';
import type { CircuitProfile, Reference, TelemetryTarget } from '@/data/f1KnowledgeData';
import PhotoGalleryCarousel from '@/components/ui/PhotoGalleryCarousel';

interface CircuitDetailModalProps {
  circuit: CircuitProfile;
  allCircuits: CircuitProfile[];
  onSelectCircuit: (circuit: CircuitProfile) => void;
  onNavigateToTelemetry?: (target: TelemetryTarget) => void;
  onClose: () => void;
}

type CircuitTab = 'map' | 'engineering' | 'history';

export default function CircuitDetailModal({
  circuit,
  allCircuits,
  onSelectCircuit,
  onNavigateToTelemetry,
  onClose,
}: CircuitDetailModalProps) {
  const [activeTab, setActiveTab] = useState<CircuitTab>('map');
  const [highlightedRef, setHighlightedRef] = useState<string | null>(null);
  const [mapLoaded, setMapLoaded] = useState<boolean>(false);
  const [mapError, setMapError] = useState<boolean>(false);
  const [atmosphereLoaded, setAtmosphereLoaded] = useState<boolean>(false);
  const [atmosphereError, setAtmosphereError] = useState<boolean>(false);
  const modalContentRef = useRef<HTMLDivElement>(null);

  // Reset image states on circuit change
  useEffect(() => {
    setMapLoaded(false);
    setMapError(false);
    setAtmosphereLoaded(false);
    setAtmosphereError(false);
  }, [circuit.id]);

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
    setActiveTab('history');
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

  const mapAsset = circuit.visualAssets?.trackMap || circuit.visualMap;
  const atmosphereAsset = circuit.visualAssets?.atmosphereImage;

  const proxiedMapUrl = mapAsset?.imageUrl
    ? mapAsset.imageUrl.startsWith('/')
      ? mapAsset.imageUrl
      : `/api/image-proxy?url=${encodeURIComponent(mapAsset.imageUrl)}`
    : null;

  const proxiedAtmosphereUrl = atmosphereAsset?.imageUrl
    ? atmosphereAsset.imageUrl.startsWith('/')
      ? atmosphereAsset.imageUrl
      : `/api/image-proxy?url=${encodeURIComponent(atmosphereAsset.imageUrl)}`
    : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-fade-in">
      {/* Modal Card */}
      <div
        ref={modalContentRef}
        className="glass-card bg-slate-950/95 border border-white/15 w-full max-w-4xl max-h-[92vh] flex flex-col rounded-3xl shadow-2xl overflow-hidden relative"
        style={{ borderTopColor: '#38bdf8', borderTopWidth: 4 }}
      >
        {/* Top Navigation Bar: Prev / Next & Close */}
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
                {circuit.safetyCarProbability && (
                  <span className="bg-red-500/15 text-red-300 border border-red-500/30 px-2.5 py-0.5 rounded-full text-[10px] font-mono">
                    SC確率: {circuit.safetyCarProbability.split(' ')[0]}
                  </span>
                )}
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

        {/* 3 Main Sub-Tabs */}
        <div className="flex items-center gap-2 px-5 sm:px-6 pt-3 border-b border-white/10 bg-slate-900/40 overflow-x-auto">
          {(
            [
              ['map', '🏁 コース解剖 & ビジュアル'],
              ['engineering', '🔧 工学・セットアップ & 戦略'],
              ['history', `🏛️ 歴史的ドラマ & 名勝負 (${circuit.historicalMoments?.length || 0})`],
            ] as [CircuitTab, string][]
          ).map(([tab, label]) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2.5 px-4 text-xs font-racing font-bold transition-all border-b-2 flex-shrink-0 ${
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
          {/* ════════════════════════════════════════════════════════════
              TAB 1: TRACK MAP, ATMOSPHERE PHOTO & COMPLETE CORNER GUIDE
          ════════════════════════════════════════════════════════════ */}
          {activeTab === 'map' && (
            <div className="space-y-5 animate-fade-in">
              {/* Photo Gallery Carousel (Layout, Atmosphere, Action, Historic) */}
              {circuit.visualGallery && circuit.visualGallery.length > 0 && (
                <PhotoGalleryCarousel
                  items={circuit.visualGallery}
                  title="📸 CIRCUIT PHOTO & MAP GALLERY / コースギャラリー"
                  themeColor="#38bdf8"
                />
              )}

              {/* Dual Visual Gallery: Layout Map + Atmosphere Photo */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1. Track Layout Blueprint Map */}
                {proxiedMapUrl && !mapError && (
                  <div className="bg-slate-950/90 border border-white/10 rounded-2xl p-4 flex flex-col items-center justify-between relative shadow-inner overflow-hidden">
                    <span className="text-[10px] font-racing font-bold text-sky-400 uppercase tracking-wider self-start mb-2 flex items-center gap-1">
                      <span>🗺️</span>
                      <span>公式コースレイアウト図</span>
                    </span>

                    <div className="w-full h-44 sm:h-48 relative flex items-center justify-center my-auto">
                      {!mapLoaded && (
                        <div className="text-xs font-mono text-slate-500 animate-pulse">
                          コース図ロード中...
                        </div>
                      )}
                      <img
                        src={proxiedMapUrl}
                        alt={`${circuit.name} Track Layout Map`}
                        referrerPolicy="no-referrer"
                        onLoad={() => setMapLoaded(true)}
                        onError={() => setMapError(true)}
                        className={`max-h-full max-w-full object-contain filter invert hue-rotate-180 brightness-110 drop-shadow-[0_0_12px_rgba(56,189,248,0.25)] transition-opacity duration-300 ${
                          mapLoaded ? 'opacity-100' : 'opacity-0'
                        }`}
                      />
                    </div>

                    {mapAsset && (
                      <div className="w-full flex items-center justify-between text-[10px] text-slate-400 font-mono mt-2 pt-2 border-t border-white/5">
                        <span>FIA Official Blueprint</span>
                        <a
                          href={mapAsset.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-sky-300 flex items-center gap-1 transition-colors"
                        >
                          <span>Map: {mapAsset.credit} ({mapAsset.license})</span>
                          <span>↗</span>
                        </a>
                      </div>
                    )}
                  </div>
                )}

                {/* 2. Authentic Atmosphere Photo */}
                {proxiedAtmosphereUrl && !atmosphereError ? (
                  <div className="bg-slate-950/90 border border-white/10 rounded-2xl p-4 flex flex-col justify-between relative shadow-inner overflow-hidden">
                    <span className="text-[10px] font-racing font-bold text-amber-400 uppercase tracking-wider self-start mb-2 flex items-center gap-1">
                      <span>📸</span>
                      <span>サーキット景観 & 現場フォト</span>
                    </span>

                    <div className="w-full h-44 sm:h-48 relative rounded-xl overflow-hidden bg-slate-900 flex items-center justify-center">
                      {!atmosphereLoaded && (
                        <div className="text-xs font-mono text-slate-500 animate-pulse">
                          風景写真ロード中...
                        </div>
                      )}
                      <img
                        src={proxiedAtmosphereUrl}
                        alt={`${circuit.name} Atmosphere`}
                        referrerPolicy="no-referrer"
                        onLoad={() => setAtmosphereLoaded(true)}
                        onError={() => setAtmosphereError(true)}
                        className={`w-full h-full object-cover transition-opacity duration-300 hover:scale-105 transition-transform duration-500 ${
                          atmosphereLoaded ? 'opacity-100' : 'opacity-0'
                        }`}
                      />
                    </div>

                    {atmosphereAsset && (
                      <div className="w-full flex flex-col gap-1 text-[10px] text-slate-400 font-mono mt-2 pt-2 border-t border-white/5">
                        <span className="text-slate-200 font-semibold truncate">
                          {atmosphereAsset.caption || circuit.name}
                        </span>
                        <div className="flex items-center justify-between">
                          <span>Live Grand Prix Scene</span>
                          <a
                            href={atmosphereAsset.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-sky-300 flex items-center gap-1 transition-colors"
                          >
                            <span>Photo: {atmosphereAsset.credit} ({atmosphereAsset.license})</span>
                            <span>↗</span>
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-slate-950/60 border border-white/5 rounded-2xl p-4 flex flex-col items-center justify-center text-center space-y-2">
                    <span className="text-3xl">🏎️</span>
                    <span className="text-xs font-mono text-slate-400">
                      {circuit.name} Technical Profile
                    </span>
                    <p className="text-[11px] text-slate-500">
                      全{circuit.turns}ターン・DRSゾーン{circuit.drsZones}本
                    </p>
                  </div>
                )}
              </div>

              {/* Geometry Specs Badges (5-Grid) */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                <div className="bg-slate-900/80 border border-white/10 p-3 rounded-xl text-center">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                    📏 全長
                  </span>
                  <span className="text-lg font-bold font-mono text-white mt-0.5 block">
                    {circuit.lengthKm}
                  </span>
                  <span className="text-[9px] text-slate-500">km</span>
                </div>

                <div className="bg-slate-900/80 border border-white/10 p-3 rounded-xl text-center">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                    🏔️ 最大高低差
                  </span>
                  <span className="text-lg font-bold font-mono text-amber-400 mt-0.5 block">
                    {circuit.trackGeometry ? `${circuit.trackGeometry.elevationChangeMeters}m` : '--'}
                  </span>
                  <span className="text-[9px] text-slate-500">エレベーション</span>
                </div>

                <div className="bg-slate-900/80 border border-white/10 p-3 rounded-xl text-center">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                    🚀 最長ストレート
                  </span>
                  <span className="text-lg font-bold font-mono text-emerald-400 mt-0.5 block">
                    {circuit.trackGeometry ? `${circuit.trackGeometry.longestStraightMeters}m` : '--'}
                  </span>
                  <span className="text-[9px] text-slate-500">全開区間</span>
                </div>

                <div className="bg-slate-900/80 border border-white/10 p-3 rounded-xl text-center">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                    ⚡ 最大G負荷
                  </span>
                  <span className="text-lg font-bold font-mono text-purple-400 mt-0.5 block">
                    {circuit.trackGeometry ? `${circuit.trackGeometry.gForceMax.lateral}G` : '--'}
                  </span>
                  <span className="text-[9px] text-slate-500">横G (減速 {circuit.trackGeometry?.gForceMax.longitudinal}G)</span>
                </div>

                <div className="bg-slate-900/80 border border-white/10 p-3 rounded-xl text-center col-span-2 sm:col-span-1">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                    🔄 ターン / DRS
                  </span>
                  <span className="text-lg font-bold font-mono text-sky-400 mt-0.5 block">
                    {circuit.turns}T / {circuit.drsZones}本
                  </span>
                  <span className="text-[9px] text-slate-500">DRSゾーン</span>
                </div>
              </div>

              {/* Complete Turn-by-Turn Corner Guide Table */}
              <div className="bg-slate-950/70 border border-white/10 p-4 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-racing font-bold text-sky-300 uppercase tracking-wider flex items-center gap-1.5">
                    <span>🎯</span>
                    <span>全コーナー完全網羅名鑑 & 工学的攻略ガイド ({circuit.allCorners?.length || circuit.trackGeometry?.keyCorners.length || 0}セクション)</span>
                  </h4>
                  <span className="text-[10px] font-mono text-slate-500">Turn-by-Turn Telemetry Analysis</span>
                </div>

                <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                  {circuit.allCorners && circuit.allCorners.length > 0 ? (
                    circuit.allCorners.map((corner, idx) => (
                      <div
                        key={idx}
                        className="bg-slate-900/80 border border-white/5 hover:border-sky-500/30 p-3 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs transition-colors"
                      >
                        <div className="flex items-center gap-2.5 flex-shrink-0 sm:w-56">
                          <span className="font-mono text-[11px] font-black px-2 py-0.5 rounded bg-sky-950/80 text-sky-300 border border-sky-500/40">
                            {corner.number}
                          </span>
                          <span className="font-bold text-white text-xs truncate" title={corner.name}>
                            {corner.name}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="text-[10px] font-mono bg-purple-950/60 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded">
                            ⚙️ {corner.gearEstimated}
                          </span>
                          <span className="text-[10px] font-mono bg-emerald-950/60 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded">
                            💨 {corner.speedEstimated}
                          </span>
                        </div>

                        <p className="text-slate-300 text-[11px] leading-relaxed flex-1 sm:pl-3 sm:border-l border-white/5">
                          {corner.engineeringTip}
                        </p>
                      </div>
                    ))
                  ) : circuit.trackGeometry?.keyCorners ? (
                    circuit.trackGeometry.keyCorners.map((corner, idx) => (
                      <div
                        key={idx}
                        className="bg-slate-900/80 border border-white/5 p-3 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                      >
                        <div className="flex items-center gap-2.5 flex-shrink-0">
                          <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-sky-950/80 text-sky-300 border border-sky-500/40">
                            {corner.number}
                          </span>
                          <span className="font-bold text-white text-xs">{corner.name}</span>
                        </div>
                        <p className="text-slate-300 text-[11px] leading-relaxed flex-1 sm:pl-3 sm:border-l border-white/5">
                          {corner.characteristic}
                        </p>
                      </div>
                    ))
                  ) : null}
                </div>
              </div>

              {/* Characteristics Narrative */}
              <div className="bg-slate-900/80 border border-white/10 p-4 rounded-2xl space-y-2">
                <h4 className="text-xs font-racing font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <span>📜</span>
                  <span>レイアウトの特徴 & サーキット解説</span>
                </h4>
                <p className="text-xs text-slate-200 leading-relaxed">
                  {renderTextWithCitations(circuit.characteristics)}
                </p>
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════
              TAB 2: ENGINEERING & STRATEGY
          ════════════════════════════════════════════════════════════ */}
          {activeTab === 'engineering' && (
            <div className="space-y-5 animate-fade-in">
              {/* Setup Notes 3-Grid */}
              {circuit.setupNotes && (
                <div className="space-y-3">
                  <h4 className="text-xs font-racing font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                    <span>🔧</span>
                    <span>マシンセットアップ & 工学トレードオフ</span>
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="bg-slate-950/80 border border-sky-500/30 p-3.5 rounded-2xl space-y-1.5">
                      <span className="text-xs font-bold text-sky-400 block font-mono">
                        💨 空力トレードオフ
                      </span>
                      <p className="text-slate-300 text-xs leading-relaxed">
                        {circuit.setupNotes.aeroTradeoff}
                      </p>
                    </div>

                    <div className="bg-slate-950/80 border border-amber-500/30 p-3.5 rounded-2xl space-y-1.5">
                      <span className="text-xs font-bold text-amber-400 block font-mono">
                        ⚙️ 縁石・車高アプローチ
                      </span>
                      <p className="text-slate-300 text-xs leading-relaxed">
                        {circuit.setupNotes.kerbUsage}
                      </p>
                    </div>

                    <div className="bg-slate-950/80 border border-red-500/30 p-3.5 rounded-2xl space-y-1.5">
                      <span className="text-xs font-bold text-red-400 block font-mono">
                        🛑 ブレーキ負荷 & 冷却
                      </span>
                      <p className="text-slate-300 text-xs leading-relaxed">
                        {circuit.setupNotes.brakeDemands}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Strategy Metrics 4-Grid */}
              <div className="bg-slate-950/70 border border-white/10 p-4 rounded-2xl space-y-3">
                <h4 className="text-xs font-racing font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                  <span>🛞</span>
                  <span>戦略指標 & タイヤ力学</span>
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-slate-900/80 p-3 rounded-xl text-center border border-white/5">
                    <span className="text-[10px] text-slate-400 font-mono block">タイヤ負荷</span>
                    <strong className="text-base text-amber-400 font-mono mt-0.5 block">
                      {circuit.tyreStress}
                    </strong>
                    <span className="text-[9px] text-slate-500">デグラデーション注意</span>
                  </div>

                  <div className="bg-slate-900/80 p-3 rounded-xl text-center border border-white/5">
                    <span className="text-[10px] text-slate-400 font-mono block">標準ピットロス</span>
                    <strong className="text-base text-white font-mono mt-0.5 block">
                      約{circuit.typicalPitLossSec}秒
                    </strong>
                    <span className="text-[9px] text-slate-500">ストップ＆GO損失</span>
                  </div>

                  <div className="bg-slate-900/80 p-3 rounded-xl text-center border border-white/5">
                    <span className="text-[10px] text-slate-400 font-mono block">アンダーカット感度</span>
                    <strong className="text-base text-sky-400 font-mono mt-0.5 block">
                      {circuit.undercutImpact ? circuit.undercutImpact.split('（')[0] : '有効'}
                    </strong>
                    <span className="text-[9px] text-slate-500">新タイヤゲイン</span>
                  </div>

                  <div className="bg-slate-900/80 p-3 rounded-xl text-center border border-white/5">
                    <span className="text-[10px] text-slate-400 font-mono block">セーフティカー確率</span>
                    <strong className="text-base text-red-400 font-mono mt-0.5 block">
                      {circuit.safetyCarProbability ? circuit.safetyCarProbability.split(' ')[0] : '50%'}
                    </strong>
                    <span className="text-[9px] text-slate-500">荒れる展開の警戒度</span>
                  </div>
                </div>

                {circuit.undercutImpact && (
                  <p className="text-[11px] text-slate-300 bg-slate-900/50 p-2.5 rounded-xl border border-white/5">
                    💡 <strong className="text-sky-300">アンダーカット考察:</strong> {circuit.undercutImpact}
                  </p>
                )}
              </div>

              {/* Telemetry Deep Link Banner */}
              {circuit.telemetrySession && onNavigateToTelemetry && (
                <div className="bg-gradient-to-r from-blue-950/60 via-purple-950/40 to-slate-900/80 border border-sky-500/40 p-4 rounded-2xl space-y-3 shadow-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-racing font-bold text-sky-300 uppercase tracking-wider flex items-center gap-1.5">
                      <span>📊</span>
                      <span>実走行テレメトリーデータ連動</span>
                    </span>
                    <span className="text-[10px] font-mono bg-sky-900/60 text-sky-200 px-2 py-0.5 rounded border border-sky-500/30">
                      Season {circuit.telemetrySession.year}
                    </span>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    本サーキットの実走行テレメトリー（車速・スロットル開度・ギア段数・DRS区間トレース）をロードし、メイン分析ダッシュボードで詳細なコーナー別ログを確認できます。
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
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════
              TAB 3: HISTORY, DRAMA, MOMENT PHOTOS & REFERENCES
          ════════════════════════════════════════════════════════════ */}
          {activeTab === 'history' && (
            <div className="space-y-5 animate-fade-in">
              {/* Historical Moments Breakdown */}
              {circuit.historicalMoments && circuit.historicalMoments.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-xs font-racing font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                    <span>🏆</span>
                    <span>歴代の名勝負 & 歴史的事件録</span>
                  </h4>
                  <div className="space-y-4">
                    {circuit.historicalMoments.map((moment, idx) => (
                      <div
                        key={idx}
                        className="bg-slate-950/80 border border-white/10 rounded-2xl p-4 sm:p-5 space-y-3 shadow-md"
                      >
                        {/* Moment Header */}
                        <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
                          <div className="flex items-center gap-2.5">
                            <span className="font-mono text-xs font-black px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40">
                              {moment.year}
                            </span>
                            <span className="text-sm sm:text-base font-black text-white font-racing">
                              {moment.title}
                            </span>
                          </div>
                          <span className="text-[10px] font-mono text-slate-500">
                            HISTORIC CLASH #{idx + 1}
                          </span>
                        </div>

                        {/* Moment Photo if available */}
                        {moment.momentImage?.imageUrl && (
                          <div className="bg-slate-900/90 border border-white/10 rounded-xl p-3 flex flex-col sm:flex-row items-center gap-3">
                            <div className="w-full sm:w-36 h-28 rounded-lg overflow-hidden flex-shrink-0 bg-slate-950 flex items-center justify-center">
                              <img
                                src={
                                  moment.momentImage.imageUrl.startsWith('/')
                                    ? moment.momentImage.imageUrl
                                    : `/api/image-proxy?url=${encodeURIComponent(moment.momentImage.imageUrl)}`
                                }
                                alt={moment.momentImage.caption || moment.title}
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1 space-y-1 text-left">
                              <span className="text-[10px] font-racing font-bold text-amber-400 block uppercase">
                                📸 HISTORIC PHOTO
                              </span>
                              <p className="text-xs text-slate-200 font-medium">
                                {moment.momentImage.caption || moment.title}
                              </p>
                              <a
                                href={moment.momentImage.sourceUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[10px] text-slate-400 hover:text-sky-300 flex items-center gap-1 font-mono transition-colors"
                              >
                                <span>Photo: {moment.momentImage.credit} ({moment.momentImage.license})</span>
                                <span>↗</span>
                              </a>
                            </div>
                          </div>
                        )}

                        {/* Detailed Story Narrative */}
                        <div className="space-y-1.5">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
                            📖 当時の展開 & 戦略背景
                          </span>
                          <p className="text-xs text-slate-200 leading-relaxed">
                            {moment.detailedStory || moment.description}
                          </p>
                        </div>

                        {/* Historical Impact Box */}
                        {(moment.historicalImpact || moment.significance) && (
                          <div className="bg-purple-950/30 border border-purple-500/25 p-3 rounded-xl text-[11px] text-purple-200 space-y-1">
                            <div className="flex items-center gap-1.5 text-purple-400 font-bold font-racing">
                              <span>⚡</span>
                              <span>F1史・規則改定への決定打 (HISTORICAL IMPACT):</span>
                            </div>
                            <p className="text-slate-300 leading-relaxed">
                              {moment.historicalImpact || moment.significance}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* References Section */}
              <div className="space-y-3 pt-2">
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
