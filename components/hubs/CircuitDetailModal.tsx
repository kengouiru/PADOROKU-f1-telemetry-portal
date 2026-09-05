'use client';

/**
 * components/hubs/CircuitDetailModal.tsx
 * Comprehensive Detailed Modal for F1 Circuits with 3 Major Consolidated Tabs:
 * 1. Track Map & Geometry (Interactive Vector SVG Track Map with Corner Pins, Authentic Scenery Photo, Elevation, G-Forces, Complete Turn-by-Turn Guide)
 * 2. Engineering & Strategy (Aero Tradeoffs, Kerbs, Brakes, Tyre Dynamics & Telemetry Deep Link)
 * 3. History & Drama (Iconic Historical Moments with Detailed Narratives & Citations)
 *
 * Fully unified styling with DriverDetailModal and TeamDetailModal.
 */

import React, { useState, useEffect, useRef } from 'react';
import type { CircuitProfile, Reference, TelemetryTarget } from '@/data/f1KnowledgeData';
import { CIRCUIT_TRACK_MAPS } from '@/components/telemetry/TelemetryTrackMap';
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
  const [highlightedCorner, setHighlightedCorner] = useState<string | null>(null);
  const [atmosphereLoaded, setAtmosphereLoaded] = useState<boolean>(false);
  const [atmosphereError, setAtmosphereError] = useState<boolean>(false);
  const [activeCornerHover, setActiveCornerHover] = useState<string | null>(null);
  const modalContentRef = useRef<HTMLDivElement>(null);

  // Reset image states on circuit change
  useEffect(() => {
    setAtmosphereLoaded(false);
    setAtmosphereError(false);
    setHighlightedCorner(null);
    setActiveCornerHover(null);
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

  // Jump to Corner in list
  const scrollToCorner = (cornerNumber: string) => {
    const cleanNum = cornerNumber.replace(/\s+/g, '');
    const targetElementId = `corner-row-${circuit.id}-${cleanNum}`;
    const el = document.getElementById(targetElementId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setHighlightedCorner(cleanNum);
      setTimeout(() => setHighlightedCorner(null), 3000);
    }
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

  // Vector Track Map data from CIRCUIT_TRACK_MAPS
  const trackMapData = CIRCUIT_TRACK_MAPS[circuit.id] || CIRCUIT_TRACK_MAPS['suzuka'];

  // Atmosphere photo resolution: Check atmosphereImage, visualGallery, or visualMap
  const atmosphereAsset =
    circuit.visualAssets?.atmosphereImage ||
    circuit.visualGallery?.find((g) => g.tag === 'Atmosphere' || g.tag === 'Panoramic') ||
    circuit.visualGallery?.[0] ||
    circuit.visualMap;

  const proxiedAtmosphereUrl = atmosphereAsset?.imageUrl
    ? atmosphereAsset.imageUrl.startsWith('/')
      ? atmosphereAsset.imageUrl
      : `/api/image-proxy?url=${encodeURIComponent(atmosphereAsset.imageUrl)}`
    : null;

  const atmosphereCaption: string = (atmosphereAsset && 'caption' in atmosphereAsset && typeof atmosphereAsset.caption === 'string') ? atmosphereAsset.caption : circuit.name;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-5 bg-black/80 backdrop-blur-md animate-fade-in">
      {/* Modal Card */}
      <div
        ref={modalContentRef}
        className="glass-card bg-slate-950/95 border border-white/15 w-full max-w-5xl max-h-[92vh] flex flex-col rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden relative"
        style={{ borderTopColor: '#38bdf8', borderTopWidth: 4 }}
      >
        {/* Top Navigation Bar: Prev / Next & Close */}
        <div className="p-2.5 sm:px-6 bg-slate-900/90 border-b border-white/10 flex items-center justify-between gap-2 flex-shrink-0">
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
            <button
              onClick={() => prevCircuit && onSelectCircuit(prevCircuit)}
              className="px-2 py-1 sm:px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-racing flex items-center gap-1 transition-all cursor-pointer max-w-[130px] sm:max-w-none"
              title="前のサーキット (←キー)"
            >
              <span>◀</span>
              <span className="font-mono font-bold truncate">{prevCircuit?.name}</span>
            </button>
            <button
              onClick={() => nextCircuit && onSelectCircuit(nextCircuit)}
              className="px-2 py-1 sm:px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-racing flex items-center gap-1 transition-all cursor-pointer max-w-[130px] sm:max-w-none"
              title="次のサーキット (→キー)"
            >
              <span className="font-mono font-bold truncate">{nextCircuit?.name}</span>
              <span>▶</span>
            </button>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <span className="text-[10px] text-slate-500 font-mono hidden md:inline">
              キーボード [←] [→] でサーキット切り替え / [ESC] で閉じる
            </span>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-all text-sm font-bold cursor-pointer"
              title="閉じる (ESC)"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Modal Header: Circuit Name, Country, Specs Badge Bar */}
        <div className="p-5 sm:px-6 pb-3 border-b border-white/10 bg-slate-900/60 flex flex-col md:flex-row md:items-center justify-between gap-4 flex-shrink-0">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-widest flex items-center gap-1">
                <span>📍</span>
                <span>{circuit.country}</span>
              </span>
              <span className="text-xs font-mono font-bold bg-sky-950/80 text-sky-300 border border-sky-500/40 px-2 py-0.5 rounded">
                FIA Grade 1
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-racing font-black text-white tracking-wide">
              {circuit.name}
            </h2>
            <p className="text-xs text-slate-400 font-mono">{circuit.officialName}</p>
          </div>

          {/* Quick Stats Badges */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
            <div className="bg-slate-800/80 px-3 py-1.5 rounded-xl border border-white/10 flex flex-col items-center">
              <span className="text-[9px] text-slate-400">コース全長</span>
              <strong className="text-sky-300 font-bold">{circuit.lengthKm} km</strong>
            </div>

            <div className="bg-slate-800/80 px-3 py-1.5 rounded-xl border border-white/10 flex flex-col items-center">
              <span className="text-[9px] text-slate-400">総コーナー数</span>
              <strong className="text-emerald-300 font-bold">{circuit.turns} ターン</strong>
            </div>

            <div className="bg-slate-800/80 px-3 py-1.5 rounded-xl border border-white/10 flex flex-col items-center">
              <span className="text-[9px] text-slate-400">DRSゾーン</span>
              <strong className="text-purple-300 font-bold">{circuit.drsZones} 区間</strong>
            </div>

            <div className="bg-slate-800/80 px-3 py-1.5 rounded-xl border border-white/10 flex flex-col items-center">
              <span className="text-[9px] text-slate-400">コースレコード</span>
              <strong className="text-amber-300 font-bold">{circuit.lapRecord.time}</strong>
              <span className="text-[8px] text-slate-400 truncate max-w-[120px]">
                {circuit.lapRecord.driver} ({circuit.lapRecord.year})
              </span>
            </div>
          </div>
        </div>

        {/* 3 Main Sub-Tabs */}
        <div className="flex items-center gap-2 px-5 sm:px-6 pt-3 border-b border-white/10 bg-slate-900/40 overflow-x-auto flex-shrink-0">
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

              {/* Dual Visual Section: Interactive Vector SVG Track Map + Authentic Scenery Photo */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1. High-Precision Vector SVG Track Map */}
                <div className="bg-slate-950/90 border border-sky-500/30 rounded-2xl p-4 flex flex-col justify-between relative shadow-inner overflow-hidden group">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-racing font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                      <span>🗺️</span>
                      <span>公式コースレイアウト図 (GPS準拠ベクター)</span>
                    </span>
                    <div className="flex items-center gap-2 text-[10px] font-mono">
                      <span className="text-slate-400">
                        {circuit.lengthKm}km • {circuit.turns}T
                      </span>
                      <a
                        href={`/images/circuits/maps/${circuit.id}.svg`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sky-400 hover:text-sky-300 hover:underline flex items-center gap-0.5 font-bold ml-1"
                        title="公式SVGベクターマップを別タブで表示"
                      >
                        <span>公式SVG</span>
                        <span>↗</span>
                      </a>
                    </div>
                  </div>

                  {/* Vector SVG Canvas */}
                  <div className="w-full h-48 sm:h-52 relative flex items-center justify-center bg-slate-900/70 rounded-xl border border-white/5 p-2 overflow-hidden">
                    <svg
                      viewBox="0 0 400 300"
                      className="w-full h-full filter drop-shadow-[0_0_12px_rgba(56,189,248,0.3)] select-none"
                    >
                      {/* Outer Glow Path */}
                      <path
                        d={trackMapData.svgPath}
                        fill="none"
                        stroke="rgba(56, 189, 248, 0.2)"
                        strokeWidth="12"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      {/* Main Track Path */}
                      <path
                        d={trackMapData.svgPath}
                        fill="none"
                        stroke="#38bdf8"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />

                      {/* Start / Finish Line Marker */}
                      <circle
                        cx={trackMapData.startFinish.x}
                        cy={trackMapData.startFinish.y}
                        r="6"
                        fill="#22c55e"
                        stroke="#ffffff"
                        strokeWidth="2"
                      />

                      {/* Key Corner Interactive Pins */}
                      {trackMapData.cornerPins.map((pin, i) => {
                        const isHovered = activeCornerHover === pin.number;
                        return (
                          <g
                            key={i}
                            className="cursor-pointer transition-all"
                            onMouseEnter={() => setActiveCornerHover(pin.number)}
                            onMouseLeave={() => setActiveCornerHover(null)}
                            onClick={() => scrollToCorner(pin.number)}
                          >
                            <circle
                              cx={pin.x}
                              cy={pin.y}
                              r={isHovered ? '9' : '7'}
                              fill={isHovered ? '#f59e0b' : '#0f172a'}
                              stroke={isHovered ? '#ffffff' : '#f59e0b'}
                              strokeWidth="1.5"
                              className="transition-all"
                            />
                            <text
                              x={pin.x}
                              y={pin.y + 3}
                              textAnchor="middle"
                              fill={isHovered ? '#ffffff' : '#fbbf24'}
                              fontSize="7.5"
                              fontWeight="bold"
                              fontFamily="monospace"
                            >
                              {pin.number.replace('T', '')}
                            </text>
                          </g>
                        );
                      })}
                    </svg>

                    {/* Active Corner Tooltip overlay */}
                    {activeCornerHover && (
                      <div className="absolute top-2 left-2 bg-slate-950/90 border border-amber-400/60 px-2 py-1 rounded-md text-[10px] font-mono text-amber-300 shadow-md">
                        {trackMapData.cornerPins.find((p) => p.number === activeCornerHover)?.name || activeCornerHover}
                      </div>
                    )}
                  </div>

                  {/* Map Footer: Legend & Jump Tip */}
                  <div className="w-full flex items-center justify-between text-[10px] text-slate-400 font-mono mt-2 pt-2 border-t border-white/5">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
                      <span>S/F ライン</span>
                      <span className="w-2 h-2 rounded-full bg-amber-500 inline-block ml-2"></span>
                      <span>主要ターンピン</span>
                    </span>
                    <span className="text-sky-400 hover:underline">
                      ピンをクリックで解説へ移動 ➔
                    </span>
                  </div>
                </div>

                {/* 2. Authentic Atmosphere Scene Photo */}
                <div className="bg-slate-950/90 border border-white/10 rounded-2xl p-4 flex flex-col justify-between relative shadow-inner overflow-hidden">
                  <span className="text-[10px] font-racing font-bold text-amber-400 uppercase tracking-wider self-start mb-2 flex items-center gap-1">
                    <span>📸</span>
                    <span>サーキット景観 & 現場フォト</span>
                  </span>

                  <div className="w-full h-48 sm:h-52 relative rounded-xl overflow-hidden bg-slate-900 flex items-center justify-center">
                    {!atmosphereLoaded && !atmosphereError && (
                      <div className="text-xs font-mono text-slate-500 animate-pulse">
                        風景写真ロード中...
                      </div>
                    )}
                    {proxiedAtmosphereUrl && !atmosphereError ? (
                      <img
                        src={proxiedAtmosphereUrl}
                        alt={`${circuit.name} Atmosphere`}
                        loading="lazy"
                        decoding="async"
                        referrerPolicy="no-referrer"
                        onLoad={() => setAtmosphereLoaded(true)}
                        onError={() => setAtmosphereError(true)}
                        className={`w-full h-full object-cover transition-all duration-500 hover:scale-105 ${
                          atmosphereLoaded ? 'opacity-100' : 'opacity-0'
                        }`}
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center p-4 text-center">
                        <span className="text-3xl">🏎️</span>
                        <span className="text-xs font-mono text-slate-400 mt-1">
                          {circuit.name} Live Grand Prix
                        </span>
                      </div>
                    )}
                  </div>

                  {atmosphereAsset && (
                    <div className="w-full flex flex-col gap-0.5 text-[10px] text-slate-400 font-mono mt-2 pt-2 border-t border-white/5">
                      <span className="text-slate-200 font-semibold truncate">
                        {atmosphereCaption}
                      </span>
                      <div className="flex items-center justify-between">
                        <span>Live Grand Prix Scene</span>
                        {atmosphereAsset.credit && (
                          <span className="text-slate-400">
                            Photo: {atmosphereAsset.credit} ({atmosphereAsset.license || 'CC'})
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
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
                  <span className="text-[9px] text-slate-500">
                    横G (減速 {circuit.trackGeometry?.gForceMax.longitudinal}G)
                  </span>
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
                    <span>
                      全コーナー完全網羅名鑑 & 工学的攻略ガイド (
                      {circuit.allCorners?.length || circuit.trackGeometry?.keyCorners.length || 0}
                      セクション)
                    </span>
                  </h4>
                  <span className="text-[10px] font-mono text-slate-500">
                    Turn-by-Turn Engineering Analysis
                  </span>
                </div>

                <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                  {circuit.allCorners && circuit.allCorners.length > 0 ? (
                    circuit.allCorners.map((corner, idx) => {
                      const cleanNum = corner.number.replace(/\s+/g, '');
                      const isHighlighted = highlightedCorner === cleanNum;

                      return (
                        <div
                          key={idx}
                          id={`corner-row-${circuit.id}-${cleanNum}`}
                          className={`p-3 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs transition-all border ${
                            isHighlighted
                              ? 'bg-amber-500/20 border-amber-400 ring-2 ring-amber-400/50 shadow-lg'
                              : 'bg-slate-900/80 border-white/5 hover:border-sky-500/30'
                          }`}
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
                      );
                    })
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
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════
              TAB 2: ENGINEERING, SETUPS, TYRE DYNAMICS & TELEMETRY
          ════════════════════════════════════════════════════════════ */}
          {activeTab === 'engineering' && (
            <div className="space-y-5 animate-fade-in">
              {/* Engineering Setup Notes 3-Grid */}
              {circuit.setupNotes && (
                <div className="space-y-3">
                  <h4 className="text-xs font-racing font-bold text-sky-300 uppercase tracking-wider flex items-center gap-1.5">
                    <span>🔧</span>
                    <span>マシンセットアップ & 工学的最適化指針</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="bg-slate-950/80 border border-sky-500/30 p-3.5 rounded-2xl space-y-1.5">
                      <span className="text-xs font-bold text-sky-300 block font-mono">
                        💨 空力トレードオフ (Downforce)
                      </span>
                      <p className="text-slate-300 text-xs leading-relaxed">
                        {circuit.setupNotes.aeroTradeoff}
                      </p>
                    </div>

                    <div className="bg-slate-950/80 border border-amber-500/30 p-3.5 rounded-2xl space-y-1.5">
                      <span className="text-xs font-bold text-amber-300 block font-mono">
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
                                loading="lazy"
                                decoding="async"
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
                              {moment.momentImage.credit && (
                                <span className="text-[10px] font-mono text-slate-400">
                                  Photo: {moment.momentImage.credit} ({moment.momentImage.license})
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Description */}
                        <p className="text-xs text-slate-300 leading-relaxed font-medium">
                          {renderTextWithCitations(moment.description)}
                        </p>

                        {/* Detailed Story Narrative */}
                        {moment.detailedStory && (
                          <div className="bg-slate-900/60 p-3.5 rounded-xl border border-white/5 space-y-1.5">
                            <span className="text-[10px] font-mono font-bold text-amber-400 uppercase block tracking-wider">
                              📖 レース展開 & 劇的結末の全真相
                            </span>
                            <p className="text-xs text-slate-200 leading-relaxed">
                              {renderTextWithCitations(moment.detailedStory)}
                            </p>
                          </div>
                        )}

                        {/* Significance / Impact */}
                        <div className="bg-amber-950/20 border border-amber-500/20 p-2.5 rounded-xl text-xs text-amber-200 flex items-start gap-1.5">
                          <span className="font-bold text-amber-400">⚡ 歴史的意義:</span>
                          <span className="text-slate-300 leading-snug">
                            {moment.significance || moment.historicalImpact}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* References Section */}
              {circuit.references && circuit.references.length > 0 && (
                <div className="mt-4 pt-4 border-t border-white/10 bg-slate-950/60 rounded-2xl p-4 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-racing font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <span>📚</span>
                      <span>REFERENCES / 一次出典・FIA公式文献・公認アーカイブログ</span>
                    </span>
                    <span className="text-[9px] text-slate-500 font-mono">Academic Verified</span>
                  </div>

                  <div className="space-y-1.5">
                    {circuit.references.map((ref) => {
                      const elId = `circuit-ref-${circuit.id}-${ref.id}`;
                      const isHighlighted = highlightedRef === elId;
                      return (
                        <div
                          key={ref.id}
                          id={elId}
                          className={`p-2.5 rounded-xl text-xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-1 border ${
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
                            className="text-sky-400 hover:text-sky-300 text-[10px] font-medium flex items-center gap-1 flex-shrink-0 self-end sm:self-center font-mono"
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
          )}
        </div>
      </div>
    </div>
  );
}
