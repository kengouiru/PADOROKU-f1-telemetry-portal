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
import SmartWikiText from '@/components/common/SmartWikiText';
import { useUserPreferences } from '@/lib/userPreferences';
import { getCircuitWeather } from '@/data/f1WeatherData';
import { CIRCUIT_REAL_IMAGES } from './CircuitsHub';

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
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  const { isFavoriteCircuit, toggleCircuit } = useUserPreferences();
  const [activeTab, setActiveTab] = useState<CircuitTab>('map');
  const [highlightedRef, setHighlightedRef] = useState<string | null>(null);
  const [highlightedCorner, setHighlightedCorner] = useState<string | null>(null);
  const [atmosphereLoaded, setAtmosphereLoaded] = useState<boolean>(false);
  const [atmosphereError, setAtmosphereError] = useState<boolean>(false);
  const [activeCornerHover, setActiveCornerHover] = useState<string | null>(null);
  const [copiedUrl, setCopiedUrl] = useState<boolean>(false);
  const modalContentRef = useRef<HTMLDivElement>(null);
  const weather = getCircuitWeather(circuit.id);

  // Sync URL search params with ?circuit=<circuitId>
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('circuit', circuit.id);
      window.history.replaceState(null, '', url.toString());
    }

    return () => {
      if (typeof window !== 'undefined') {
        const cleanupUrl = new URL(window.location.href);
        cleanupUrl.searchParams.delete('circuit');
        window.history.replaceState(null, '', cleanupUrl.toString());
      }
    };
  }, [circuit.id]);

  const handleCopyShareUrl = () => {
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('circuit', circuit.id);
      navigator.clipboard.writeText(url.toString()).then(() => {
        setCopiedUrl(true);
        setTimeout(() => setCopiedUrl(false), 2000);
      });
    }
  };

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

  // Helper to parse "[1]", "[2]" and F1 technical/proper noun keywords into clickable links & citation badges
  const renderTextWithCitations = (text: string) => {
    if (!text) return null;
    return (
      <SmartWikiText
        text={text}
        excludeUrl={`/knowledge/circuits/${circuit.id}`}
        maxLinksPerTerm={1}
        onCitationClick={handleCitationClick}
      />
    );
  };

  // Helper for structured multi-chapter encyclopedic paragraphs with SmartWiki auto-linking
  const renderParagraphsWithCitations = (text: string) => {
    if (!text) return null;
    const paragraphs = text.split('\n\n').map((p) => p.trim()).filter(Boolean);
    if (paragraphs.length <= 1) {
      return renderTextWithCitations(text);
    }
    return (
      <div className="space-y-3">
        {paragraphs.map((p, idx) => (
          <p key={idx} className="leading-relaxed">
            {renderTextWithCitations(p)}
          </p>
        ))}
      </div>
    );
  };

  // Vector Track Map data from CIRCUIT_TRACK_MAPS
  const trackMapData = CIRCUIT_TRACK_MAPS[circuit.id] || CIRCUIT_TRACK_MAPS['suzuka'];

  // Atmosphere photo resolution: Prioritize verified authentic track photo from CIRCUIT_REAL_IMAGES
  const realTrackPhoto = CIRCUIT_REAL_IMAGES[circuit.id];
  const atmosphereAsset =
    circuit.visualAssets?.atmosphereImage ||
    circuit.visualGallery?.find((g) => g.tag === 'Atmosphere' || g.tag === 'Panoramic') ||
    circuit.visualGallery?.[0] ||
    circuit.visualMap;

  const rawAtmosphereUrl = realTrackPhoto || atmosphereAsset?.imageUrl;

  const proxiedAtmosphereUrl = rawAtmosphereUrl
    ? rawAtmosphereUrl.startsWith('/')
      ? rawAtmosphereUrl
      : `/api/image-proxy?url=${encodeURIComponent(rawAtmosphereUrl)}`
    : null;

  const atmosphereCaption: string = (atmosphereAsset && 'caption' in atmosphereAsset && typeof atmosphereAsset.caption === 'string') ? atmosphereAsset.caption : circuit.name;

  return (
    <div className="w-full max-w-[1800px] mx-auto animate-fade-in pb-16">
      {/* ── Solid Flush Sticky Top Navigation Bar: Compact Single-Row, Opaque bg-slate-950 ── */}
      <div className="sticky top-0 z-50 bg-slate-950 border-b border-white/15 px-3 sm:px-6 py-2.5 shadow-2xl flex items-center justify-between gap-3 mb-4 rounded-b-2xl">
        {/* Left: Return Button & Breadcrumbs */}
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-racing font-bold text-xs sm:text-sm flex items-center gap-1.5 border border-white/10 transition-all cursor-pointer shadow hover:scale-105 shrink-0"
            title="一覧に戻る (ESC)"
          >
            <span>◀</span>
            <span className="whitespace-nowrap">一覧に戻る</span>
          </button>
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400 font-mono truncate">
            <span>F1 百科事典</span>
            <span>&gt;</span>
            <span>サーキット名鑑</span>
            <span>&gt;</span>
            <span className="text-white font-bold truncate">{circuit.name}</span>
            <span className="text-slate-500 font-mono">({circuit.country})</span>
          </div>
        </div>

        {/* Right: Prev / Next Switcher & Compact Action Buttons (Single Row) */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Quick Prev / Next Switcher */}
          <div className="flex items-center bg-slate-900 border border-white/10 rounded-xl p-0.5">
            <button
              onClick={() => prevCircuit && onSelectCircuit(prevCircuit)}
              className="px-2 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-racing flex items-center gap-1 transition-all cursor-pointer border border-white/5"
              title="前のサーキット (←キー)"
            >
              <span>◀</span>
              <span className="font-mono font-bold truncate max-w-[80px] sm:max-w-none">{prevCircuit?.name}</span>
            </button>
            <div className="w-px h-3.5 bg-white/15" />
            <button
              onClick={() => nextCircuit && onSelectCircuit(nextCircuit)}
              className="px-2 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-racing flex items-center gap-1 transition-all cursor-pointer border border-white/5"
              title="次のサーキット (→キー)"
            >
              <span className="font-mono font-bold truncate max-w-[80px] sm:max-w-none">{nextCircuit?.name}</span>
              <span>▶</span>
            </button>
          </div>

          {/* Popout Separate Window Button */}
          <button
            type="button"
            onClick={() => {
              window.open(`/knowledge/circuits/${circuit.id}`, '_blank', 'width=1280,height=900,menubar=no,toolbar=no');
            }}
            className="px-2.5 py-1 rounded-xl bg-sky-950/80 hover:bg-sky-900 border border-sky-500/40 text-sky-300 hover:text-white text-xs font-racing flex items-center gap-1 transition-all cursor-pointer shadow-sm hover:scale-105"
            title="このサーキットを別ウィンドウで開く"
          >
            <span>別ウィンドウで開く</span>
            <span>↗</span>
          </button>

          {/* Copy Share URL Button */}
          <button
            onClick={handleCopyShareUrl}
            className={`px-2.5 py-1 rounded-xl text-xs font-racing flex items-center gap-1.5 transition-all cursor-pointer shadow-sm border ${
              copiedUrl
                ? 'bg-emerald-500/25 border-emerald-400/70 text-emerald-300'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border-white/10'
            }`}
            title="このサーキットの共有URLをコピー"
          >
            <span>{copiedUrl ? '✅' : '🔗'}</span>
            <span className="hidden sm:inline">
              {copiedUrl ? 'URLコピー完了' : '共有URL'}
            </span>
          </button>

          {/* Star Favorite Button */}
          <button
            onClick={() => toggleCircuit(circuit.id)}
            className={`px-2.5 py-1 rounded-xl text-xs font-racing flex items-center gap-1.5 transition-all cursor-pointer shadow-sm border ${
              isFavoriteCircuit(circuit.id)
                ? 'bg-amber-400/25 border-amber-400/70 text-amber-300 hover:bg-amber-400/35'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-amber-300 border-white/10'
            }`}
            title={isFavoriteCircuit(circuit.id) ? 'お気に入りから外す' : 'お気に入り (マイパドック) に登録'}
          >
            <span>{isFavoriteCircuit(circuit.id) ? '★' : '☆'}</span>
            <span className="hidden md:inline">
              {isFavoriteCircuit(circuit.id) ? '推しコース登録中' : '推しコース登録'}
            </span>
          </button>

          {onNavigateToTelemetry && (
            <button
              onClick={() => {
                if (circuit.telemetrySession) {
                  onNavigateToTelemetry(circuit.telemetrySession);
                } else {
                  onNavigateToTelemetry({ year: 2024, meetingName: circuit.name });
                }
              }}
              className="px-2.5 py-1 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-racing flex items-center gap-1 transition-all cursor-pointer shadow-sm hover:scale-105"
              title="このサーキットの実走テレメトリーを開く"
            >
              <span>📊</span>
              <span className="hidden md:inline">テレメトリー</span>
            </button>
          )}

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-all text-sm font-bold cursor-pointer"
            title="一覧に戻る (ESC)"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Main Full-Page Circuit Detail Card */}
      <div
        ref={modalContentRef}
        className="glass-card bg-slate-950/95 border border-white/15 w-full rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden relative"
        style={{ borderTopColor: '#38bdf8', borderTopWidth: 4 }}
      >
          {/* Modal Header: Circuit Name, Country, Specs Badge Bar */}
          <div className="p-3.5 sm:px-6 pb-3 border-b border-white/10 bg-slate-900/60 flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 flex-shrink-0">
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

              {/* Official External Links (Official Web / F1.com / Google Maps / X / Instagram) */}
              {circuit.officialLinks && (
                <div className="flex items-center gap-1.5 pt-1.5 flex-wrap">
                  {circuit.officialLinks.website && (
                    <a
                      href={circuit.officialLinks.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium text-slate-200 bg-slate-800/90 border border-white/10 hover:border-sky-400/50 hover:bg-sky-950/40 hover:text-sky-200 transition-all shadow-sm group"
                      title={`${circuit.name} 公式Webサイトを開く`}
                    >
                      <span>🌐</span>
                      <span>公式Webサイト</span>
                      <span className="text-[10px] text-slate-400 group-hover:text-sky-300">↗</span>
                    </a>
                  )}

                  {circuit.officialLinks.f1Official && (
                    <a
                      href={circuit.officialLinks.f1Official}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium text-slate-200 bg-slate-800/90 border border-white/10 hover:border-red-500/50 hover:bg-red-950/40 hover:text-red-200 transition-all shadow-sm group"
                      title={`${circuit.name} F1.com 公式サーキットガイドを開く`}
                    >
                      <span className="font-racing font-bold text-red-500">F1</span>
                      <span>公式ガイド</span>
                      <span className="text-[10px] text-slate-400 group-hover:text-red-300">↗</span>
                    </a>
                  )}

                  {circuit.officialLinks.googleMaps && (
                    <a
                      href={circuit.officialLinks.googleMaps}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium text-slate-200 bg-slate-800/90 border border-white/10 hover:border-emerald-500/50 hover:bg-emerald-950/40 hover:text-emerald-200 transition-all shadow-sm group"
                      title={`${circuit.name} Googleマップで現地を確認`}
                    >
                      <span>📍</span>
                      <span>Googleマップ</span>
                      <span className="text-[10px] text-slate-400 group-hover:text-emerald-300">↗</span>
                    </a>
                  )}

                  {circuit.officialLinks.xTwitter && (
                    <a
                      href={circuit.officialLinks.xTwitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium text-slate-300 bg-slate-800/90 border border-white/10 hover:border-white/30 hover:bg-slate-700/80 hover:text-white transition-all shadow-sm"
                      title={`${circuit.name} 公式X (Twitter) を開く`}
                    >
                      <span className="font-bold">𝕏</span>
                      <span className="text-[10px] text-slate-400">↗</span>
                    </a>
                  )}

                  {circuit.officialLinks.instagram && (
                    <a
                      href={circuit.officialLinks.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium text-slate-300 bg-slate-800/90 border border-white/10 hover:border-pink-500/50 hover:bg-gradient-to-r hover:from-[#f09433]/20 hover:via-[#dc2743]/20 hover:to-[#bc1888]/20 hover:text-white transition-all shadow-sm group"
                      title={`${circuit.name} 公式Instagramを開く`}
                    >
                      <svg className="w-3 h-3 text-pink-400 group-hover:scale-110 transition-transform flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                      <span className="text-[10px] text-slate-400 group-hover:text-pink-300">↗</span>
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* Quick Stats Badges */}
            <div className="grid grid-cols-4 gap-1.5 sm:flex sm:flex-wrap sm:items-center sm:gap-2 text-xs font-mono">
              <div className="bg-slate-800/80 p-2 sm:px-3 sm:py-1.5 rounded-xl border border-white/10 flex flex-col items-center text-center">
                <span className="text-[8px] sm:text-[9px] text-slate-400">全長</span>
                <strong className="text-sky-300 font-bold text-[11px] sm:text-xs">{circuit.lengthKm} km</strong>
              </div>

              <div className="bg-slate-800/80 p-2 sm:px-3 sm:py-1.5 rounded-xl border border-white/10 flex flex-col items-center text-center">
                <span className="text-[8px] sm:text-[9px] text-slate-400">コーナー</span>
                <strong className="text-emerald-300 font-bold text-[11px] sm:text-xs">{circuit.turns} ターン</strong>
              </div>

              <div className="bg-slate-800/80 p-2 sm:px-3 sm:py-1.5 rounded-xl border border-white/10 flex flex-col items-center text-center">
                <span className="text-[8px] sm:text-[9px] text-slate-400">DRS</span>
                <strong className="text-purple-300 font-bold text-[11px] sm:text-xs">{circuit.drsZones} 区間</strong>
              </div>

              <div className="bg-slate-800/80 p-2 sm:px-3 sm:py-1.5 rounded-xl border border-white/10 flex flex-col items-center text-center">
                <span className="text-[8px] sm:text-[9px] text-slate-400">レコード</span>
                <strong className="text-amber-300 font-bold text-[10px] sm:text-xs leading-tight">{circuit.lapRecord.time}</strong>
                <span className="text-[7px] sm:text-[8px] text-slate-400 truncate max-w-[70px] sm:max-w-[120px] hidden sm:inline">
                  {circuit.lapRecord.driver}
                </span>
              </div>
            </div>
          </div>

          {/* 3 Main Sub-Tabs (Sticky when scrolling) */}
          <div className="sticky top-0 z-20 flex items-center gap-2 px-3.5 sm:px-6 pt-2 sm:pt-2.5 border-b border-white/10 bg-slate-950/95 backdrop-blur-md overflow-x-auto flex-shrink-0 shadow-sm">
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
                className={`pb-2 px-3 sm:px-4 text-xs font-racing font-bold transition-all border-b-2 flex-shrink-0 cursor-pointer ${
                  activeTab === tab
                    ? 'text-sky-400 border-sky-400 font-black'
                    : 'text-slate-400 border-transparent hover:text-slate-200'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Tab Content Body */}
          <div className="p-3.5 sm:p-6 flex-1 space-y-4 sm:space-y-5">
          {/* ════════════════════════════════════════════════════════════
              TAB 1: TRACK MAP, ATMOSPHERE PHOTO & COMPLETE CORNER GUIDE
          ════════════════════════════════════════════════════════════ */}
          {activeTab === 'map' && (
            <div className="space-y-5 animate-fade-in">
              {/* Photo Gallery Carousel (Layout, Atmosphere, Action, Historic) - Compact & Elegant */}
              {circuit.visualGallery && circuit.visualGallery.length > 0 && (
                <PhotoGalleryCarousel
                  items={circuit.visualGallery}
                  title="📸 CIRCUIT PHOTO & MAP GALLERY / コースギャラリー"
                  themeColor="#38bdf8"
                  size="sm"
                  aspectRatio="16/10"
                />
              )}

              {/* Dual Visual Section: Interactive Vector SVG Track Map + Authentic Scenery Photo */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                {/* 1. High-Precision Vector SVG Track Map */}
                <div className="bg-slate-950/90 border border-sky-500/30 rounded-xl sm:rounded-2xl p-3 sm:p-3.5 flex flex-col justify-between relative shadow-inner overflow-hidden group">
                  <div className="flex items-center justify-between mb-1.5">
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

                  {/* Vector SVG Canvas - Compact height with pristine aspect ratio */}
                  <div className="w-full h-36 sm:h-40 md:h-44 relative flex items-center justify-center bg-slate-900/70 rounded-xl border border-white/5 p-2 overflow-hidden">
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
                  <div className="w-full flex items-center justify-between text-[10px] text-slate-400 font-mono mt-1.5 pt-1.5 border-t border-white/5">
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
                <div className="bg-slate-950/90 border border-white/10 rounded-xl sm:rounded-2xl p-3 sm:p-3.5 flex flex-col justify-between relative shadow-inner overflow-hidden">
                  <span className="text-[10px] font-racing font-bold text-amber-400 uppercase tracking-wider self-start mb-1.5 flex items-center gap-1">
                    <span>📸</span>
                    <span>サーキット景観 & 現場フォト</span>
                  </span>

                  <div className="w-full h-36 sm:h-40 md:h-44 relative rounded-xl overflow-hidden bg-slate-900 flex items-center justify-center">
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
                    <div className="w-full flex flex-col gap-0.5 text-[10px] text-slate-400 font-mono mt-1.5 pt-1.5 border-t border-white/5">
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

              {/* Geometry Specs Telemetry HUD Strip (High-density, space-efficient) */}
              <div className="bg-slate-950/80 border border-white/10 rounded-xl py-2.5 px-3 sm:px-4 shadow-sm grid grid-cols-2 sm:grid-cols-5 divide-y sm:divide-y-0 sm:divide-x divide-white/10 font-mono gap-y-2 sm:gap-y-0">
                <div className="text-center px-1">
                  <span className="text-[10px] text-slate-400 block tracking-wider font-sans">📏 コース全長</span>
                  <div className="flex items-baseline justify-center gap-0.5 mt-0.5">
                    <span className="text-sm sm:text-base font-bold text-white tabular-nums">{circuit.lengthKm}</span>
                    <span className="text-[10px] text-slate-500 font-sans">km</span>
                  </div>
                </div>

                <div className="text-center px-1">
                  <span className="text-[10px] text-slate-400 block tracking-wider font-sans">🏔️ 最大高低差</span>
                  <div className="flex items-baseline justify-center gap-0.5 mt-0.5">
                    <span className="text-sm sm:text-base font-bold text-amber-400 tabular-nums">
                      {circuit.trackGeometry ? circuit.trackGeometry.elevationChangeMeters : '--'}
                    </span>
                    <span className="text-[10px] text-slate-500 font-sans">m</span>
                  </div>
                </div>

                <div className="text-center px-1">
                  <span className="text-[10px] text-slate-400 block tracking-wider font-sans">🚀 最長直線</span>
                  <div className="flex items-baseline justify-center gap-0.5 mt-0.5">
                    <span className="text-sm sm:text-base font-bold text-emerald-400 tabular-nums">
                      {circuit.trackGeometry ? circuit.trackGeometry.longestStraightMeters : '--'}
                    </span>
                    <span className="text-[10px] text-slate-500 font-sans">m</span>
                  </div>
                </div>

                <div className="text-center px-1">
                  <span className="text-[10px] text-slate-400 block tracking-wider font-sans">⚡ 最大G負荷</span>
                  <div className="flex items-baseline justify-center gap-0.5 mt-0.5">
                    <span className="text-sm sm:text-base font-bold text-purple-400 tabular-nums">
                      {circuit.trackGeometry ? `${circuit.trackGeometry.gForceMax.lateral}G` : '--'}
                    </span>
                    {circuit.trackGeometry && (
                      <span className="text-[9px] text-slate-500 font-sans hidden md:inline ml-1">
                        (減速 {circuit.trackGeometry.gForceMax.longitudinal}G)
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-center px-1 col-span-2 sm:col-span-1">
                  <span className="text-[10px] text-slate-400 block tracking-wider font-sans">🔄 コーナー / DRS</span>
                  <div className="flex items-baseline justify-center gap-0.5 mt-0.5">
                    <span className="text-sm sm:text-base font-bold text-sky-400 tabular-nums">
                      {circuit.turns}T
                    </span>
                    <span className="text-slate-600 mx-1">/</span>
                    <span className="text-sm sm:text-base font-bold text-sky-300 tabular-nums">
                      {circuit.drsZones}区間
                    </span>
                  </div>
                </div>
              </div>

              {/* Circuit Characteristics & Engineering Profile */}
              {circuit.characteristics && (
                <div className="bg-slate-900/80 border border-white/10 p-4 rounded-2xl space-y-2.5">
                  <h4 className="text-xs font-racing font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                    <span>🏎️</span>
                    <span>サーキット特性 & 空力・タイヤ工学サマリー</span>
                  </h4>
                  <div className="text-xs text-slate-200 leading-relaxed font-sans">
                    {renderParagraphsWithCitations(circuit.characteristics)}
                  </div>
                </div>
              )}

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
                            {renderTextWithCitations(corner.engineeringTip)}
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
                          {renderTextWithCitations(corner.characteristic)}
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
                        {renderTextWithCitations(circuit.setupNotes.aeroTradeoff)}
                      </p>
                    </div>

                    <div className="bg-slate-950/80 border border-amber-500/30 p-3.5 rounded-2xl space-y-1.5">
                      <span className="text-xs font-bold text-amber-300 block font-mono">
                        ⚙️ 縁石・車高アプローチ
                      </span>
                      <p className="text-slate-300 text-xs leading-relaxed">
                        {renderTextWithCitations(circuit.setupNotes.kerbUsage)}
                      </p>
                    </div>

                    <div className="bg-slate-950/80 border border-red-500/30 p-3.5 rounded-2xl space-y-1.5">
                      <span className="text-xs font-bold text-red-400 block font-mono">
                        🛑 ブレーキ負荷 & 冷却
                      </span>
                      <p className="text-slate-300 text-xs leading-relaxed">
                        {renderTextWithCitations(circuit.setupNotes.brakeDemands)}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Circuit Weather & Meteorological Tactical Profile */}
              {weather && (
                <div className="bg-slate-950/80 border border-sky-500/30 p-4 rounded-2xl space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h4 className="text-xs font-racing font-bold text-sky-300 uppercase tracking-wider flex items-center gap-1.5">
                      <span>🌤️</span>
                      <span>気象・路面温度プロファイル & 戦術影響 ({weather.conditionText})</span>
                    </h4>
                    <span className="text-[10px] font-mono text-slate-400">
                      降水確率: <strong className={weather.rainProb > 30 ? 'text-sky-400' : 'text-slate-300'}>{weather.rainProb}%</strong>
                    </span>
                  </div>

                  <div className="bg-slate-900/90 border border-white/5 rounded-xl py-2 px-3 sm:px-4 shadow-sm grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-white/10 font-mono gap-y-2 sm:gap-y-0">
                    <div className="text-center px-1">
                      <span className="text-[10px] text-slate-400 block font-sans">気温 / 天候</span>
                      <div className="flex items-baseline justify-center gap-1 mt-0.5">
                        <span>{weather.weatherIcon}</span>
                        <span className="text-sm sm:text-base font-bold text-white tabular-nums">{weather.airTempC}℃</span>
                      </div>
                    </div>
                    <div className="text-center px-1">
                      <span className="text-[10px] text-slate-400 block font-sans">路面温度 (Track)</span>
                      <div className="flex items-baseline justify-center gap-1 mt-0.5">
                        <span>🔥</span>
                        <span className="text-sm sm:text-base font-bold text-amber-400 tabular-nums">{weather.trackTempC}℃</span>
                      </div>
                    </div>
                    <div className="text-center px-1">
                      <span className="text-[10px] text-slate-400 block font-sans">湿度 / 降水リスク</span>
                      <div className="flex items-baseline justify-center gap-1 mt-0.5">
                        <span>💧</span>
                        <span className="text-sm sm:text-base font-bold text-sky-300 tabular-nums">{weather.humidity}% / {weather.rainProb}%</span>
                      </div>
                    </div>
                    <div className="text-center px-1">
                      <span className="text-[10px] text-slate-400 block font-sans">風速 & 風向</span>
                      <div className="flex items-baseline justify-center gap-1 mt-0.5">
                        <span>💨</span>
                        <span className="text-xs sm:text-sm font-bold text-emerald-300 tabular-nums">{weather.windSpeedKmh}km/h</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 pt-1">
                    <div className="p-3 rounded-xl bg-slate-900/90 border border-sky-500/20 text-xs text-slate-300 leading-relaxed">
                      <strong className="text-sky-300 font-racing mr-1 block sm:inline">🏎️ レースエンジニア戦術分析:</strong>
                      <span>{renderTextWithCitations(weather.tacticalImpact)}</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div className="p-2.5 rounded-xl bg-amber-950/20 border border-amber-500/20 text-slate-300">
                        <strong className="text-amber-300 font-mono block text-[11px] mb-0.5">🛞 タイヤ作動・温度管理指針:</strong>
                        <span>{renderTextWithCitations(weather.tyreOperatingNote)}</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-purple-950/20 border border-purple-500/20 text-slate-300">
                        <strong className="text-purple-300 font-mono block text-[11px] mb-0.5">🌧️ 過去の雨天・波乱レース記録:</strong>
                        <span>{renderTextWithCitations(weather.historicalRainRaces)}</span>
                      </div>
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
                <div className="bg-slate-900/80 border border-white/5 rounded-xl py-2 px-3 sm:px-4 shadow-sm grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-white/10 font-mono gap-y-2 sm:gap-y-0">
                  <div className="text-center px-1">
                    <span className="text-[10px] text-slate-400 block font-sans">🛞 タイヤ負荷</span>
                    <div className="flex items-baseline justify-center gap-0.5 mt-0.5">
                      <strong className="text-sm sm:text-base text-amber-400 tabular-nums">
                        {circuit.tyreStress}
                      </strong>
                    </div>
                  </div>

                  <div className="text-center px-1">
                    <span className="text-[10px] text-slate-400 block font-sans">⏱️ 標準ピットロス</span>
                    <div className="flex items-baseline justify-center gap-0.5 mt-0.5">
                      <strong className="text-sm sm:text-base text-white tabular-nums">
                        約{circuit.typicalPitLossSec}
                      </strong>
                      <span className="text-[10px] text-slate-500 font-sans">秒</span>
                    </div>
                  </div>

                  <div className="text-center px-1">
                    <span className="text-[10px] text-slate-400 block font-sans">⚡ アンダーカット感度</span>
                    <div className="flex items-baseline justify-center gap-0.5 mt-0.5">
                      <strong className="text-sm sm:text-base text-sky-400 truncate">
                        {circuit.undercutImpact ? circuit.undercutImpact.split('（')[0] : '有効'}
                      </strong>
                    </div>
                  </div>

                  <div className="text-center px-1">
                    <span className="text-[10px] text-slate-400 block font-sans">⚠️ セーフティカー確率</span>
                    <div className="flex items-baseline justify-center gap-0.5 mt-0.5">
                      <strong className="text-sm sm:text-base text-red-400 tabular-nums">
                        {circuit.safetyCarProbability ? circuit.safetyCarProbability.split(' ')[0] : '50%'}
                      </strong>
                    </div>
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
                            {renderTextWithCitations(moment.significance || moment.historicalImpact || '')}
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

              {/* Official Links Banner */}
              {circuit.officialLinks && (
                <div className="mt-4 bg-slate-900/90 border border-white/10 p-4 rounded-2xl space-y-2.5 shadow-sm">
                  <h4 className="text-xs font-racing font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <span>🌐</span>
                    <span>公式サーキットWebサイト & F1公式ガイド & 所在地</span>
                  </h4>
                  <div className="flex items-center gap-2.5 flex-wrap">
                    {circuit.officialLinks.website && (
                      <a
                        href={circuit.officialLinks.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-white/10 text-xs font-medium text-slate-200 hover:text-white transition-all shadow-sm"
                      >
                        <span>🌐 公式Webサイト</span>
                        <span className="text-[10px] text-slate-400">↗</span>
                      </a>
                    )}
                    {circuit.officialLinks.f1Official && (
                      <a
                        href={circuit.officialLinks.f1Official}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-white/10 text-xs font-medium text-slate-200 hover:text-white transition-all shadow-sm"
                      >
                        <span className="font-racing font-bold text-red-500">F1</span>
                        <span>公式サーキットガイド</span>
                        <span className="text-[10px] text-slate-400">↗</span>
                      </a>
                    )}
                    {circuit.officialLinks.googleMaps && (
                      <a
                        href={circuit.officialLinks.googleMaps}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-white/10 text-xs font-medium text-slate-200 hover:text-white transition-all shadow-sm"
                      >
                        <span>📍 Googleマップ</span>
                        <span className="text-[10px] text-slate-400">↗</span>
                      </a>
                    )}
                    {circuit.officialLinks.xTwitter && (
                      <a
                        href={circuit.officialLinks.xTwitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-white/10 text-xs font-medium text-slate-300 hover:text-white transition-all shadow-sm"
                      >
                        <span className="font-bold">𝕏 (Twitter)</span>
                        <span className="text-[10px] text-slate-400">↗</span>
                      </a>
                    )}
                    {circuit.officialLinks.instagram && (
                      <a
                        href={circuit.officialLinks.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-white/10 text-xs font-medium text-slate-300 hover:text-white transition-all shadow-sm group"
                      >
                        <svg className="w-3.5 h-3.5 text-pink-400 group-hover:scale-110 transition-transform flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                        </svg>
                        <span>Instagram</span>
                        <span className="text-[10px] text-slate-400">↗</span>
                      </a>
                    )}
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

export { CircuitDetailModal as CircuitDetailView };
