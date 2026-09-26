'use client';

/**
 * components/hubs/DriverDetailModal.tsx
 * Comprehensive Detailed Modal/Drawer for F1 Drivers (Current & Legends).
 * Enhanced with clean CC-licensed portrait image with attribution via streaming image-proxy,
 * robust fallback badge, telemetry engineering signatures, mechanical preferences,
 * race engineers, number origins, and unified champagne gold (#D4AF37) for Legends.
 */

import React, { useState, useEffect, useRef } from 'react';
import type { DriverProfile, Reference, TelemetryTarget } from '@/data/f1KnowledgeData';
import { getDriverTraits, type DriverTraitDefinition } from '@/data/driverTraitsData';
import { getDriverSkills } from '@/data/driverSkillsData';
import PhotoGalleryCarousel from '@/components/ui/PhotoGalleryCarousel';
import { useUserPreferences } from '@/lib/userPreferences';
import SmartWikiText from '@/components/common/SmartWikiText';
import { getVaultRadiosByDriver, type VaultRadioItem } from '@/data/f1RadioVaultData';
import { getProxiedAudioUrl } from '@/lib/telemetryUtils';
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Star,
  SlidersHorizontal,
  Activity,
  X,
  Crown,
  Flag,
  ArrowRight,
  Globe,
  Trophy,
  BarChart2,
  BookOpen,
  FileText,
  Sparkles,
  Award,
  Timer,
  History,
  Shield,
  Zap,
  Check,
  Wrench,
  Scale,
  Gauge,
  Target,
  TrendingUp,
  AlertCircle,
  Disc,
  AlertTriangle,
  CloudRain,
  Brain,
  Key,
  Quote,
  Radio,
  User,
  Flame,
  Film,
  Play,
  Square,
  MessageSquare,
} from 'lucide-react';

export interface DriverDetailModalProps {
  driver: DriverProfile;
  allDrivers: DriverProfile[];
  onSelectDriver: (driver: DriverProfile) => void;
  onSelectTeamDetail?: (teamId: string) => void;
  onNavigateToTelemetry?: (target?: TelemetryTarget) => void;
  onCompareDriver?: (driverCode: string) => void;
  onClose: () => void;
}

type DetailTab = 'overview' | 'traits' | 'style' | 'bio' | 'references';

export default function DriverDetailModal({
  driver,
  allDrivers,
  onSelectDriver,
  onSelectTeamDetail,
  onNavigateToTelemetry,
  onCompareDriver,
  onClose,
}: DriverDetailModalProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  const { isFavoriteDriver, toggleDriver } = useUserPreferences();
  const [activeTab, setActiveTab] = useState<DetailTab>('overview');
  const [highlightedRef, setHighlightedRef] = useState<string | null>(null);
  const [imgLoaded, setImgLoaded] = useState<boolean>(false);
  const [imgError, setImgError] = useState<boolean>(false);
  const modalContentRef = useRef<HTMLDivElement>(null);

  // Reset image state on driver change
  useEffect(() => {
    setImgLoaded(false);
    setImgError(false);
  }, [driver.id]);

  const isLegend = driver.status === 'Legend';
  const themeColor = isLegend ? '#D4AF37' : driver.teamColor;
  const driverTraits = getDriverTraits(driver.code);
  const driverSkills = getDriverSkills(driver.code);
  const driverRadios = React.useMemo(() => getVaultRadiosByDriver(driver.code), [driver.code]);

  const [activeRadioId, setActiveRadioId] = useState<string | null>(null);
  const [isRadioPlaying, setIsRadioPlaying] = useState(false);
  const radioAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (radioAudioRef.current) {
        radioAudioRef.current.pause();
        radioAudioRef.current = null;
      }
    };
  }, []);

  const handlePlayRadio = (radio: VaultRadioItem) => {
    if (!radio.audioUrl) return;
    if (activeRadioId === radio.id && isRadioPlaying) {
      radioAudioRef.current?.pause();
      setIsRadioPlaying(false);
      return;
    }
    if (activeRadioId !== radio.id) {
      if (radioAudioRef.current) radioAudioRef.current.pause();
      setActiveRadioId(radio.id);
      const audio = new Audio(getProxiedAudioUrl(radio.audioUrl));
      radioAudioRef.current = audio;
      audio.onended = () => setIsRadioPlaying(false);
      audio.play().catch(() => setIsRadioPlaying(false));
      setIsRadioPlaying(true);
    } else {
      radioAudioRef.current?.play().catch(() => {});
      setIsRadioPlaying(true);
    }
  };

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

  // Helper to parse keywords and "[1]", "[2]" into clickable links and citation badges
  const renderTextWithCitations = (text: string) => {
    return (
      <SmartWikiText
        text={text}
        excludeUrl={`/knowledge/drivers/${driver.code}`}
        onCitationClick={handleCitationClick}
      />
    );
  };

  // Helper for structured multi-chapter encyclopedic paragraphs
  const renderParagraphsWithCitations = (text: string) => {
    if (!text) return null;
    const paragraphs = text.split('\n\n').map((p) => p.trim()).filter(Boolean);
    if (paragraphs.length <= 1) {
      return renderTextWithCitations(text);
    }
    return (
      <div className="space-y-2.5">
        {paragraphs.map((p, idx) => (
          <p key={idx} className="leading-relaxed">
            {renderTextWithCitations(p)}
          </p>
        ))}
      </div>
    );
  };

  const getInstagramHandle = (url?: string) => {
    if (!url) return null;
    const match = url.match(/instagram\.com\/([^/?#]+)/);
    return match ? `@${match[1]}` : 'Official Instagram';
  };

  const proxiedImageUrl = driver.visualAsset?.imageUrl
    ? driver.visualAsset.imageUrl.startsWith('/')
      ? driver.visualAsset.imageUrl
      : `/api/image-proxy?url=${encodeURIComponent(driver.visualAsset.imageUrl)}`
    : null;

  if (!mounted) return null;

  return (
    <div className="w-full max-w-[1800px] mx-auto animate-fade-in pb-16">
      {/* ── Solid Flush Sticky Top Navigation Bar: Compact Single-Row, Opaque bg-slate-950, Zero Peeking Ghosting ── */}
      <div className="sticky top-0 z-50 bg-slate-950 border-b border-white/15 px-3 sm:px-6 py-2.5 shadow-2xl flex items-center justify-between gap-3 mb-4 rounded-b-2xl">
        {/* Left: Return Button & Breadcrumbs */}
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-racing font-bold text-xs sm:text-sm flex items-center gap-1.5 border border-white/10 transition-all cursor-pointer shadow hover:scale-105 shrink-0"
            title="一覧に戻る (ESC)"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="whitespace-nowrap">一覧に戻る</span>
          </button>
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400 font-mono truncate">
            <span>F1 百科事典</span>
            <span>&gt;</span>
            <span>ドライバー名鑑</span>
            <span>&gt;</span>
            <span className="text-white font-bold truncate">{driver.fullName}</span>
            <span className="text-slate-500 font-mono">({driver.code})</span>
          </div>
        </div>

        {/* Right: Prev / Next Switcher & Compact Action Buttons (Single Row) */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Quick Prev / Next Switcher */}
          <div className="flex items-center bg-slate-900 border border-white/10 rounded-xl p-0.5">
            <button
              onClick={() => prevDriver && onSelectDriver(prevDriver)}
              className="px-2 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-racing flex items-center gap-1 transition-all cursor-pointer border border-white/5"
              title="前の選手 (←キー)"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span className="font-mono font-bold">{prevDriver?.code}</span>
            </button>
            <div className="w-px h-3.5 bg-white/15" />
            <button
              onClick={() => nextDriver && onSelectDriver(nextDriver)}
              className="px-2 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-racing flex items-center gap-1 transition-all cursor-pointer border border-white/5"
              title="次の選手 (→キー)"
            >
              <span className="font-mono font-bold">{nextDriver?.code}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Popout Separate Window Button */}
          <button
            type="button"
            onClick={() => {
              window.open(`/knowledge/drivers/${driver.code}`, '_blank', 'width=1280,height=900,menubar=no,toolbar=no');
            }}
            className="px-2.5 py-1 rounded-xl bg-sky-950/80 hover:bg-sky-900 border border-sky-500/40 text-sky-300 hover:text-white text-xs font-racing flex items-center gap-1.5 transition-all cursor-pointer shadow-sm hover:scale-105"
            title="この選手を別ウィンドウで開く"
          >
            <span>別ウィンドウで開く</span>
            <ExternalLink className="w-3 h-3" />
          </button>

          {/* Star Favorite Button */}
          <button
            onClick={() => toggleDriver(driver.code)}
            className={`px-2.5 py-1 rounded-xl text-xs font-racing flex items-center gap-1.5 transition-all cursor-pointer shadow-sm border ${
              isFavoriteDriver(driver.code)
                ? 'bg-amber-400/25 border-amber-400/70 text-amber-300 hover:bg-amber-400/35'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-amber-300 border-white/10'
            }`}
            title={isFavoriteDriver(driver.code) ? 'お気に入りから外す' : 'お気に入り (マイパドック) に登録'}
          >
            <Star
              className={`w-3.5 h-3.5 ${
                isFavoriteDriver(driver.code) ? 'fill-amber-400 text-amber-400' : 'text-slate-400'
              }`}
            />
            <span className="hidden md:inline">
              {isFavoriteDriver(driver.code) ? '推し' : '推し登録'}
            </span>
          </button>

          {onCompareDriver && (
            <button
              onClick={() => {
                onClose();
                onCompareDriver(driver.code);
              }}
              className="px-2.5 py-1 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/40 text-purple-200 text-xs font-racing flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
              title="この選手を直接比較ツールに送る"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span className="hidden md:inline">2名比較</span>
            </button>
          )}

          {onNavigateToTelemetry && (
            <button
              onClick={() => {
                onClose();
                onNavigateToTelemetry({
                  year: 2026,
                  targetDriver: driver.code,
                  meetingName: 'Japan',
                });
              }}
              className="px-2.5 py-1 rounded-xl bg-blue-600/40 hover:bg-blue-600/70 border border-blue-500/50 text-sky-200 text-xs font-racing flex items-center gap-1.5 transition-all cursor-pointer shadow-sm hover:scale-105"
              title="このドライバーのテレメトリー分析画面へ移動"
            >
              <Activity className="w-3.5 h-3.5" />
              <span className="hidden md:inline">テレメトリー</span>
            </button>
          )}

          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer border border-white/10 shrink-0"
            title="一覧へ戻る (ESC)"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Full-Width Driver Card */}
      <div
        ref={modalContentRef}
        className="glass-card bg-slate-950/95 border border-white/15 w-full flex flex-col rounded-3xl shadow-2xl overflow-hidden relative"
        style={{ borderTopColor: themeColor, borderTopWidth: 4 }}
      >
        {/* Container: Wraps Hero Header, Sticky Sub-Tabs & Content */}
        <div className="flex flex-col">
          {/* Driver Hero Header */}
          <div
            className={`p-3.5 sm:p-6 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 flex-shrink-0 ${
              isLegend
                ? 'bg-gradient-to-r from-amber-950/40 via-yellow-950/20 to-slate-900/40'
                : 'bg-gradient-to-b from-slate-900/60 to-transparent'
            }`}
          >
            <div className="flex items-center gap-3 sm:gap-5">
              {/* Driver Portrait Image Area */}
              <div className="flex flex-col items-center flex-shrink-0">
                <div
                  className="w-16 h-20 sm:w-24 sm:h-28 rounded-xl sm:rounded-2xl overflow-hidden border shadow-xl bg-slate-900 relative flex items-center justify-center"
                  style={{ borderColor: `${themeColor}80` }}
                >
                  {/* Fallback Badge (rendered under image or if error) */}
                  <div
                    className="absolute inset-0 flex flex-col items-center justify-center font-racing font-black"
                    style={{
                      color: themeColor,
                      backgroundColor: `${themeColor}18`,
                    }}
                  >
                    <span className="text-xl sm:text-3xl leading-none">#{driver.number}</span>
                    <span className="text-[10px] sm:text-xs tracking-wider mt-1">{driver.code}</span>
                  </div>

                  {/* Actual Portrait Image via safe Proxy */}
                  {proxiedImageUrl && !imgError && (
                    <img
                      src={proxiedImageUrl}
                      alt={driver.fullName}
                      loading="lazy"
                      decoding="async"
                      referrerPolicy="no-referrer"
                      onLoad={() => setImgLoaded(true)}
                      onError={() => setImgError(true)}
                      className={`absolute inset-0 w-full h-full object-cover object-top filter brightness-95 transition-opacity duration-300 ${
                        imgLoaded ? 'opacity-100' : 'opacity-0'
                      }`}
                    />
                  )}

                  {/* Floating Number Badge */}
                  {imgLoaded && !imgError && (
                    <div
                      className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded-md text-[9px] sm:text-[10px] font-racing font-black bg-black/85 backdrop-blur-sm border shadow-sm"
                      style={{ color: themeColor, borderColor: `${themeColor}60` }}
                    >
                      #{driver.number}
                    </div>
                  )}
                </div>

                {/* CC Attribution Link */}
                {driver.visualAsset && (
                  <a
                    href={driver.visualAsset.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-0.5 text-[8px] sm:text-[9px] text-slate-400 hover:text-sky-300 font-mono flex items-center gap-0.5 transition-colors max-w-[80px] sm:max-w-[100px] truncate"
                    title={`撮影: ${driver.visualAsset.credit} (${driver.visualAsset.license})`}
                  >
                    <span>Photo: {driver.visualAsset.credit}</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                )}
              </div>

              {/* Driver Title & Identity */}
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                  <span className="text-[11px] sm:text-xs text-slate-400 font-mono">{driver.country}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold font-mono border ${
                      isLegend
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-sm'
                        : 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                    }`}
                  >
                    {isLegend ? (
                      <span className="inline-flex items-center gap-1">
                        <Crown className="w-3 h-3 text-amber-400" />
                        <span>殿堂入り F1 LEGEND</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1">
                        <Flag className="w-3 h-3 text-emerald-400" />
                        <span>現役ドライバー</span>
                      </span>
                    )}
                  </span>
                  <span className="bg-slate-800/90 text-slate-300 px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-medium border border-white/10 whitespace-nowrap">
                    {driver.driverType}
                  </span>
                </div>

                <h2 className="text-lg sm:text-2xl font-black text-white leading-tight flex items-center gap-2 flex-wrap">
                  <span className="break-words">{driver.fullName}</span>
                  {isLegend && <Crown className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 inline ml-1 shrink-0" />}
                </h2>
                <div className="text-xs text-slate-400 flex items-center gap-1.5 pt-0.5 flex-wrap">
                  <span className="text-slate-500 font-mono text-[11px]">所属:</span>
                  {onSelectTeamDetail ? (
                    <button
                      type="button"
                      onClick={() => onSelectTeamDetail(driver.team)}
                      className="text-slate-200 hover:text-sky-300 font-bold hover:underline cursor-pointer flex items-center gap-1 transition-colors text-left"
                      title={`${driver.team} のチーム詳細・系譜を見る`}
                    >
                      <span>{driver.team}</span>
                      <ArrowRight className="w-2.5 h-2.5 text-sky-400" />
                    </button>
                  ) : (
                    <strong className="text-slate-200">{driver.team}</strong>
                  )}
                  {driver.nickname && <span className="ml-1 text-slate-400">({driver.nickname})</span>}
                </div>

                {/* Official Social Links (Instagram / X / Web) */}
                {driver.socialLinks && (
                  <div className="flex items-center gap-1.5 pt-0.5 flex-wrap">
                    {driver.socialLinks.instagram && (
                      <a
                        href={driver.socialLinks.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[11px] sm:text-xs font-medium text-slate-200 bg-slate-800/80 border border-white/10 hover:border-pink-500/50 hover:bg-gradient-to-r hover:from-[#f09433]/20 hover:via-[#dc2743]/20 hover:to-[#bc1888]/20 hover:text-white transition-all shadow-sm group"
                        title={`${driver.fullName} 公式Instagramを開く`}
                      >
                        <svg className="w-3 h-3 text-pink-400 group-hover:scale-110 transition-transform flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                        </svg>
                        <span className="font-mono text-[10px] sm:text-xs">{getInstagramHandle(driver.socialLinks.instagram)}</span>
                        <ExternalLink className="w-2.5 h-2.5 text-slate-400 group-hover:text-pink-300" />
                      </a>
                    )}

                    {driver.socialLinks.xTwitter && (
                      <a
                        href={driver.socialLinks.xTwitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[11px] sm:text-xs font-medium text-slate-400 bg-slate-800/80 border border-white/10 hover:border-white/30 hover:bg-slate-700/80 hover:text-white transition-all shadow-sm"
                        title={`${driver.fullName} 公式X (Twitter) を開く`}
                      >
                        <span className="text-slate-300 font-bold">𝕏</span>
                        <ExternalLink className="w-2.5 h-2.5 text-slate-400" />
                      </a>
                    )}

                    {driver.socialLinks.website && (
                      <a
                        href={driver.socialLinks.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[11px] sm:text-xs font-medium text-slate-400 bg-slate-800/80 border border-white/10 hover:border-sky-400/40 hover:bg-sky-950/40 hover:text-sky-200 transition-all shadow-sm"
                        title={`${driver.fullName} 公式Webサイトを開く`}
                      >
                        <Globe className="w-3.5 h-3.5 text-sky-400" />
                        <ExternalLink className="w-2.5 h-2.5 text-slate-400" />
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Championship Trophy Banner */}
            {driver.championships > 0 && (
              <div
                className="rounded-xl sm:rounded-2xl p-2 sm:p-3 px-3 sm:px-4 flex items-center gap-2.5 sm:gap-3 self-start sm:self-auto flex-shrink-0 border shadow-md"
                style={{
                  backgroundColor: isLegend ? 'rgba(212, 175, 55, 0.15)' : 'rgba(245, 158, 11, 0.12)',
                  borderColor: `${themeColor}60`,
                }}
              >
                <Trophy className="w-6 h-6 sm:w-8 sm:h-8 text-amber-400 shrink-0" />
                <div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span
                      className="text-[10px] sm:text-xs font-racing font-bold uppercase tracking-widest block"
                      style={{ color: themeColor }}
                    >
                      {isLegend ? 'LEGEND' : 'WORLD CHAMPION'}
                    </span>
                    <span className="text-xs sm:text-base font-black text-white font-mono">
                      {driver.championships}冠 達成
                    </span>
                  </div>
                  {driver.championshipYears && (
                    <span className="block text-[9px] sm:text-[10px] text-amber-200/90 font-mono">
                      ({driver.championshipYears.join(', ')})
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Modal Sub-Tabs (Sticky below top nav bar when scrolling) */}
          <div className="sticky top-[48px] z-40 flex items-center gap-2 px-3.5 sm:px-6 pt-2 sm:pt-2.5 border-b border-white/15 bg-slate-950 overflow-x-auto flex-shrink-0 shadow-md">
            {(
              [
                { id: 'overview', label: 'プロフィール & 実績', icon: BarChart2 },
                { id: 'style', label: '走行スタイル & 技術', icon: Activity },
                { id: 'bio', label: '人物像 & エピソード', icon: BookOpen },
                { id: 'references', label: `参考文献 (${driver.references.length})`, icon: FileText },
                { id: 'traits', label: `ゲーム特性 (${driverTraits.length})`, icon: Sparkles },
              ] as { id: DetailTab; label: string; icon: React.ComponentType<{ className?: string }> }[]
            ).map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`pb-2 px-2.5 sm:px-3 text-xs font-racing font-bold transition-all border-b-2 flex-shrink-0 cursor-pointer flex items-center gap-1.5 ${
                    activeTab === tab.id
                      ? 'text-sky-400 border-sky-400 font-black'
                      : 'text-slate-400 border-transparent hover:text-slate-200'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Active Tab Body Content */}
          <div className="p-3.5 sm:p-6 flex-1 space-y-4 sm:space-y-5">
          {/* TAB 1: OVERVIEW & CAREER STATS */}
          {activeTab === 'overview' && (
            <div className="space-y-5 animate-fade-in">
              {/* Photo Gallery Carousel (Filtered for relevant driver action/paddock photos only) */}
              {(() => {
                const cleanGallery = (driver.visualGallery || []).filter((item) => {
                  // Exclude exact duplicate of header portrait
                  if (driver.visualAsset?.imageUrl && item.imageUrl === driver.visualAsset.imageUrl) return false;
                  // Exclude generic factory buildings or circuit grandstands erroneously placed in driver profile
                  if (item.tag === 'Factory' || item.tag === 'Circuit') return false;
                  if (item.imageUrl.includes('factory') || item.imageUrl.includes('circuit_')) return false;
                  return true;
                });

                if (cleanGallery.length === 0) return null;

                return (
                  <PhotoGalleryCarousel
                    items={cleanGallery}
                    title="DRIVER PHOTO & ACTION GALLERY / ギャラリー"
                    themeColor={themeColor}
                    size="sm"
                    aspectRatio="16/10"
                  />
                );
              })()}

              {/* Detailed Career Biography Narrative */}
              <div className="bg-slate-900/80 border border-white/10 p-4 rounded-2xl space-y-2.5">
                <h4 className="text-xs font-racing font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-sky-400" />
                  <span>キャリア総括 ＆ レース人生の軌跡</span>
                </h4>
                <div className="text-xs text-slate-200 leading-relaxed">
                  {renderParagraphsWithCitations(driver.careerSummary)}
                </div>
              </div>


              {/* Career Stats Telemetry HUD Strip (High-density, space-efficient, professional) */}
              <div className="bg-slate-950/80 border border-white/10 rounded-xl py-2 px-3 sm:px-4 shadow-sm flex items-center justify-between divide-x divide-white/10 font-mono">
                {/* 参戦数 */}
                <div className="flex-1 text-center px-1">
                  <span className="text-[10px] sm:text-[11px] text-slate-400 tracking-wider font-sans flex items-center justify-center gap-1">
                    <Flag className="w-3 h-3 text-slate-400" />
                    <span>出走数</span>
                  </span>
                  <div className="flex items-baseline justify-center gap-0.5 mt-0.5">
                    <span className="text-base sm:text-lg font-bold text-white tabular-nums">
                      {driver.entries}
                    </span>
                    <span className="text-[10px] text-slate-500 font-sans">戦</span>
                  </div>
                </div>

                {/* 勝利数 */}
                <div className="flex-1 text-center px-1">
                  <span className="text-[10px] sm:text-[11px] text-slate-400 tracking-wider font-sans flex items-center justify-center gap-1">
                    <Trophy className="w-3 h-3 text-amber-400" />
                    <span>勝利数</span>
                  </span>
                  <div className="flex items-baseline justify-center gap-0.5 mt-0.5">
                    <span
                      className={`text-base sm:text-lg font-bold tabular-nums ${
                        driver.wins > 0 ? 'text-amber-400' : 'text-slate-500'
                      }`}
                      style={driver.wins > 0 ? { color: themeColor } : undefined}
                    >
                      {driver.wins}
                    </span>
                    <span className="text-[10px] text-slate-500 font-sans">勝</span>
                    {driver.wins > 0 && driver.entries > 0 && (
                      <span className="text-[9px] text-slate-400 ml-1 hidden md:inline">
                        ({((driver.wins / driver.entries) * 100).toFixed(1)}%)
                      </span>
                    )}
                  </div>
                </div>

                {/* 表彰台 */}
                <div className="flex-1 text-center px-1">
                  <span className="text-[10px] sm:text-[11px] text-slate-400 tracking-wider font-sans flex items-center justify-center gap-1">
                    <Award className="w-3 h-3 text-slate-300" />
                    <span>表彰台</span>
                  </span>
                  <div className="flex items-baseline justify-center gap-0.5 mt-0.5">
                    <span
                      className={`text-base sm:text-lg font-bold tabular-nums ${
                        driver.podiums > 0 ? 'text-sky-400' : 'text-slate-500'
                      }`}
                    >
                      {driver.podiums}
                    </span>
                    <span className="text-[10px] text-slate-500 font-sans">回</span>
                  </div>
                </div>

                {/* PP */}
                <div className="flex-1 text-center px-1">
                  <span className="text-[10px] sm:text-[11px] text-slate-400 tracking-wider font-sans flex items-center justify-center gap-1">
                    <Timer className="w-3 h-3 text-slate-400" />
                    <span>PP</span>
                  </span>
                  <div className="flex items-baseline justify-center gap-0.5 mt-0.5">
                    <span
                      className={`text-base sm:text-lg font-bold tabular-nums ${
                        driver.polePositions > 0 ? 'text-purple-400' : 'text-slate-500'
                      }`}
                    >
                      {driver.polePositions}
                    </span>
                    <span className="text-[10px] text-slate-500 font-sans">回</span>
                  </div>
                </div>

                {/* 王座 (if championships > 0) */}
                {driver.championships > 0 && (
                  <div className="flex-1 text-center px-1">
                    <span className="text-[10px] sm:text-[11px] text-amber-400 tracking-wider font-sans flex items-center justify-center gap-1">
                      <Crown className="w-3 h-3 text-amber-400" />
                      <span>王座</span>
                    </span>
                    <div className="flex items-baseline justify-center gap-0.5 mt-0.5">
                      <span className="text-base sm:text-lg font-black text-amber-300 tabular-nums">
                        {driver.championships}
                      </span>
                      <span className="text-[10px] text-amber-400/80 font-sans">冠</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Bio Meta Grid with Number Origin */}
              <div className="bg-slate-950/60 border border-white/10 p-4 rounded-2xl space-y-3 font-mono">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
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

                {driver.numberOrigin && (
                  <div className="pt-2 border-t border-white/5 flex items-start gap-2 text-xs">
                    <span className="text-amber-400 font-bold flex-shrink-0">CAR #{driver.number} の由来:</span>
                    <span className="text-slate-300">
                      <SmartWikiText text={driver.numberOrigin} excludeUrl={`/knowledge/drivers/${driver.code}`} />
                    </span>
                  </div>
                )}
              </div>

              {/* Career Season History Timeline (2016-2026 or all-time) */}
              {driver.seasonHistory && driver.seasonHistory.length > 0 && (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-racing font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                      <History className="w-4 h-4 text-sky-400" />
                      <span>歴代シーズン軌跡・在籍体制 ({driver.seasonHistory.length} シーズン)</span>
                    </h4>
                    <span className="text-[10px] font-mono text-slate-400">
                      {driver.seasonHistory[driver.seasonHistory.length - 1].year}年 〜 {driver.seasonHistory[0].year}年
                    </span>
                  </div>

                  <div className="space-y-1.5 max-h-[360px] overflow-y-auto pr-1 scrollbar-thin">
                    {driver.seasonHistory.map((sh, idx) => {
                      const is2026Ongoing = sh.year === 2026;
                      const isChampion = sh.finalPosition === 1 && !is2026Ongoing;
                      const isPodiumYear = sh.finalPosition && sh.finalPosition <= 3;
                      return (
                        <div
                          key={`${sh.year}-${idx}`}
                          className={`p-2.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono transition-all ${
                            isChampion
                              ? 'bg-amber-950/40 border-amber-500/60 shadow-sm'
                              : is2026Ongoing && sh.finalPosition === 1
                              ? 'bg-emerald-950/30 border-emerald-500/40 shadow-sm'
                              : isPodiumYear
                              ? 'bg-slate-900/90 border-sky-500/40'
                              : 'bg-slate-900/60 border-white/5 hover:border-white/15'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            {/* Year Badge */}
                            <span className="px-2 py-0.5 rounded font-racing font-bold text-xs bg-slate-950 border border-white/10 text-white shrink-0">
                              {sh.year}年
                            </span>

                            {/* Role Badge */}
                            <span
                              className={`px-1.5 py-0.5 rounded text-[9.5px] font-racing font-bold shrink-0 border ${
                                sh.role === 'Regular'
                                  ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
                                  : sh.role === 'Reserve'
                                  ? 'bg-sky-950/80 text-sky-300 border-sky-500/40'
                                  : sh.role === 'Test'
                                  ? 'bg-purple-950/80 text-purple-300 border-purple-500/40'
                                  : sh.role === 'Junior'
                                  ? 'bg-amber-950/80 text-amber-300 border-amber-500/40'
                                  : 'bg-slate-800 text-slate-300 border-white/10'
                              }`}
                            >
                              {sh.role === 'Regular' ? (
                                'REGULAR'
                              ) : sh.role === 'Reserve' ? (
                                <span className="inline-flex items-center gap-1">
                                  <Shield className="w-2.5 h-2.5 text-sky-300" />
                                  <span>RESERVE</span>
                                </span>
                              ) : sh.role === 'Test' ? (
                                'TEST'
                              ) : sh.role === 'Junior' ? (
                                'JUNIOR'
                              ) : (
                                'OTHER'
                              )}
                            </span>

                            {/* Team Name */}
                            {onSelectTeamDetail ? (
                              <button
                                type="button"
                                onClick={() => onSelectTeamDetail(sh.teamId || sh.team)}
                                className="font-bold text-slate-100 hover:text-sky-300 truncate text-xs hover:underline cursor-pointer flex items-center gap-1 text-left"
                                title={`${sh.team} のチーム詳細を見る`}
                              >
                                <span>{sh.team}</span>
                                <ArrowRight className="w-2.5 h-2.5 text-sky-400" />
                              </button>
                            ) : (
                              <span className="font-bold text-slate-100 truncate text-xs">
                                {sh.team}
                              </span>
                            )}

                            {/* Car Number */}
                            {sh.carNumber && (
                              <span className="text-[10px] text-slate-400 bg-slate-800 px-1 rounded shrink-0">
                                #{sh.carNumber}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto text-[11px]">
                            {/* Results & Standing */}
                            {sh.finalPosition && sh.finalPosition <= 30 && (
                              <span
                                className={`font-racing font-bold ${
                                  isChampion
                                    ? 'text-amber-300 flex items-center gap-1 font-black'
                                    : is2026Ongoing && sh.finalPosition === 1
                                    ? 'text-emerald-300 font-bold'
                                    : isPodiumYear
                                    ? 'text-sky-300'
                                    : 'text-slate-300'
                                }`}
                              >
                                {isChampion ? (
                                  <span className="inline-flex items-center gap-1">
                                    <Crown className="w-3 h-3 text-amber-400" />
                                    <span>年間王者 P1</span>
                                  </span>
                                ) : is2026Ongoing ? (
                                  `暫定 P${sh.finalPosition} (進行中)`
                                ) : (
                                  `年間 P${sh.finalPosition}`
                                )}
                              </span>
                            )}

                            {sh.points !== undefined && (
                              <span className="text-slate-400 text-[10.5px]">
                                {sh.points} pts
                              </span>
                            )}

                            {sh.wins && sh.wins > 0 ? (
                              <span className="text-amber-400 font-bold text-[10.5px] inline-flex items-center gap-1">
                                <Trophy className="w-3 h-3 text-amber-400" />
                                <span>{sh.wins}勝</span>
                              </span>
                            ) : null}

                            {/* Note */}
                            {sh.note && (
                              <span
                                className="text-[10px] text-slate-400 max-w-[200px] truncate hidden md:inline"
                                title={sh.note}
                              >
                                {sh.note}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Career Milestones Timeline */}
              <div className="space-y-2">
                <h4 className="text-xs font-racing font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Flag className="w-3.5 h-3.5 text-slate-400" />
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

          {/* TAB 2: DRIVING STYLE & ENGINEERING */}
          {activeTab === 'style' && (
            <div className="space-y-4 animate-fade-in">
              <div className="bg-slate-900/80 border border-white/10 p-4 rounded-2xl space-y-2">
                <h4 className="text-xs font-racing font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-sky-400" />
                  <span>操縦特性サマリー</span>
                </h4>
                <div className="text-xs text-slate-200 leading-relaxed">
                  {renderParagraphsWithCitations(driver.drivingStyle.summary)}
                </div>
              </div>

              {/* Key Traits Badges */}
              <div className="space-y-2">
                <h4 className="text-xs font-racing font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>主なドライビングの特徴</span>
                </h4>
                <div className="flex flex-wrap gap-2">
                  {driver.drivingStyle.traits.map((trait, idx) => (
                    <span
                      key={idx}
                      className="bg-slate-800/80 text-sky-200 border border-sky-500/30 px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 shadow-sm"
                    >
                      <Check className="w-3.5 h-3.5 text-sky-400" />
                      <span>{trait}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Mechanical Preferences Block */}
              {driver.engineeringPreference && (
                <div className="bg-slate-950/80 border border-amber-500/30 p-4 rounded-2xl space-y-3">
                  <h4 className="text-xs font-racing font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Wrench className="w-4 h-4 text-amber-400" />
                    <span>マシンセットアップ & メカニカル嗜好</span>
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                    <div className="bg-slate-900/70 p-3 rounded-xl border border-white/5 space-y-1">
                      <span className="text-amber-400 font-bold block text-[11px] flex items-center gap-1">
                        <Scale className="w-3.5 h-3.5 text-amber-400" />
                        <span>車体バランス</span>
                      </span>
                      <p className="text-slate-300 text-[11px] leading-relaxed">
                        <SmartWikiText text={driver.engineeringPreference.setupBalance} excludeUrl={`/knowledge/drivers/${driver.code}`} />
                      </p>
                    </div>
                    <div className="bg-slate-900/70 p-3 rounded-xl border border-white/5 space-y-1">
                      <span className="text-amber-400 font-bold block text-[11px] flex items-center gap-1">
                        <Gauge className="w-3.5 h-3.5 text-amber-400" />
                        <span>ペダルタッチ・制動感</span>
                      </span>
                      <p className="text-slate-300 text-[11px] leading-relaxed">
                        <SmartWikiText text={driver.engineeringPreference.pedalFeel} excludeUrl={`/knowledge/drivers/${driver.code}`} />
                      </p>
                    </div>
                    <div className="bg-slate-900/70 p-3 rounded-xl border border-white/5 space-y-1">
                      <span className="text-amber-400 font-bold block text-[11px] flex items-center gap-1">
                        <Target className="w-3.5 h-3.5 text-amber-400" />
                        <span>ステアリングフィール</span>
                      </span>
                      <p className="text-slate-300 text-[11px] leading-relaxed">
                        <SmartWikiText text={driver.engineeringPreference.steeringWeight} excludeUrl={`/knowledge/drivers/${driver.code}`} />
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Telemetry Engineering Signature (Deep Dive) */}
              <div className="bg-slate-900/90 border border-white/10 p-4 rounded-2xl space-y-2.5 shadow-md">
                <h4 className="text-xs font-racing font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-sky-400" />
                  <span>テレメトリー工学解析・ステアリング＆ペダル波形特性</span>
                </h4>
                <div className="text-xs text-slate-200 leading-relaxed font-mono text-[11px]">
                  {renderParagraphsWithCitations(driver.drivingStyle.telemetrySignature)}
                </div>

                {onNavigateToTelemetry && (
                  <button
                    onClick={() => {
                      onClose();
                      onNavigateToTelemetry({ year: 2024, targetDriver: String(driver.number) });
                    }}
                    className="w-full mt-2 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-300 hover:text-white font-racing font-bold text-xs flex items-center justify-center gap-2 border border-white/10 transition-all cursor-pointer shadow-sm active:scale-95"
                  >
                    <Activity className="w-3.5 h-3.5" />
                    <span>このドライバーの車速・ペダル重ね合わせテレメトリーを見る</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Preferred Circuit Types */}
              <div className="bg-slate-950/60 border border-white/10 p-4 rounded-2xl space-y-2">
                <h4 className="text-xs font-racing font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Target className="w-4 h-4 text-slate-300" />
                  <span>得意とするサーキット特性・レイアウト</span>
                </h4>
                <ul className="space-y-1.5">
                  {driver.drivingStyle.preferredCircuitTypes.map((cType, idx) => (
                    <li
                      key={idx}
                      className="bg-slate-900/60 px-3 py-1.5 rounded-lg border border-white/5 text-xs text-slate-300 flex items-center gap-2"
                    >
                      <span className="text-sky-400 font-bold">•</span>
                      <span>{cType}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Braking & Tyre Deep Dive */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                <div className="bg-slate-950/60 border border-white/5 p-4 rounded-2xl space-y-1.5">
                  <span className="text-xs font-racing font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                    <span>進入制動・ブレーキング技術</span>
                  </span>
                  <div className="text-xs text-slate-300 leading-relaxed">
                    {renderParagraphsWithCitations(driver.drivingStyle.brakingTechnique)}
                  </div>
                </div>

                <div className="bg-slate-950/60 border border-white/5 p-4 rounded-2xl space-y-1.5">
                  <span className="text-xs font-racing font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Disc className="w-3.5 h-3.5 text-emerald-400" />
                    <span>タイヤライフ・熱管理</span>
                  </span>
                  <div className="text-xs text-slate-300 leading-relaxed">
                    {renderParagraphsWithCitations(driver.drivingStyle.tyreManagement)}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: GAME TRAITS & GAMEPLAY PARAMETERS (Moved after references) */}
          {activeTab === 'traits' && (
            <div className="space-y-4 animate-fade-in">
              <div className="bg-slate-900/90 border border-white/10 p-4 rounded-2xl space-y-2.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h4 className="text-xs font-racing font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>ゲーム特性・特殊能力 (Game Traits)</span>
                  </h4>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-amber-300/90 bg-amber-950/50 border border-amber-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <AlertTriangle className="w-2.5 h-2.5 text-amber-400" />
                      <span>ゲーム専用パラメータ</span>
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full border border-white/10">
                      全 {driverTraits.length} スキル保有
                    </span>
                  </div>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  過去の名勝負、事件、性格ドラマ、無線交信から着想を得て設計された本アプリのゲーム専用パラメータです。
                  レースシミュレーター走行中に特定条件（天候、コース、ギャップ、ピット状況）を満たすと動的に発動し、マシンとチームに補正を与えます。
                </p>
                {/* Legend explaining the 3 tiers */}
                <div className="flex flex-wrap items-center gap-3 pt-2 text-[11px] font-mono border-t border-white/5">
                  <span className="inline-flex items-center gap-1 text-amber-300 font-bold">
                    <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.8)]" />
                    APEX GOLD: 固有伝説スキル
                  </span>
                  <span className="inline-flex items-center gap-1 text-cyan-300 font-bold">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(34,211,238,0.8)]" />
                    TITANIUM TACTICAL: 実戦戦術スキル
                  </span>
                  <span className="inline-flex items-center gap-1 text-rose-300 font-bold">
                    <span className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_6px_rgba(244,63,94,0.8)]" />
                    HAZARD VOLATILITY: リスク・感情要因
                  </span>
                </div>
              </div>

              {/* 5-Axis Driver Core Performance Profile */}
              <div className="bg-slate-900/90 border border-sky-500/20 p-4 rounded-2xl space-y-3 shadow-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-sky-300" />
                    <h5 className="text-xs font-racing font-bold text-sky-300 uppercase tracking-wider">
                      ドライバー基本能力 (5-Axis Ratings)
                    </h5>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono text-slate-400 uppercase">総合能力</span>
                    <span className="text-sm font-racing font-black text-amber-300 bg-amber-950/60 border border-amber-500/30 px-2.5 py-0.5 rounded-lg">
                      {driverSkills.overallRating}
                    </span>
                  </div>
                </div>

                {/* 5 Skill Progress Bars */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  {/* Raw Pace */}
                  <div className="bg-black/40 p-2.5 rounded-xl border border-white/5 space-y-1">
                    <div className="flex justify-between text-[10px] font-mono">
                      <span className="text-slate-300 font-bold flex items-center gap-1">
                        <Timer className="w-3 h-3 text-sky-400" />
                        <span>一発の速さ (Raw Pace)</span>
                      </span>
                      <span className="text-sky-300 font-black">{driverSkills.skills.rawPace} / 99</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-sky-500 to-blue-400 rounded-full" style={{ width: `${driverSkills.skills.rawPace}%` }} />
                    </div>
                  </div>

                  {/* Tyre Management */}
                  <div className="bg-black/40 p-2.5 rounded-xl border border-white/5 space-y-1">
                    <div className="flex justify-between text-[10px] font-mono">
                      <span className="text-slate-300 font-bold flex items-center gap-1">
                        <Disc className="w-3 h-3 text-emerald-400" />
                        <span>タイヤ管理 (Tyre Mgmt)</span>
                      </span>
                      <span className="text-emerald-300 font-black">{driverSkills.skills.tyreManagement} / 99</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full" style={{ width: `${driverSkills.skills.tyreManagement}%` }} />
                    </div>
                  </div>

                  {/* Wet Weather */}
                  <div className="bg-black/40 p-2.5 rounded-xl border border-white/5 space-y-1">
                    <div className="flex justify-between text-[10px] font-mono">
                      <span className="text-slate-300 font-bold flex items-center gap-1">
                        <CloudRain className="w-3 h-3 text-cyan-400" />
                        <span>雨天適応 (Wet Weather)</span>
                      </span>
                      <span className="text-cyan-300 font-black">{driverSkills.skills.wetWeather} / 99</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full" style={{ width: `${driverSkills.skills.wetWeather}%` }} />
                    </div>
                  </div>

                  {/* Racecraft */}
                  <div className="bg-black/40 p-2.5 rounded-xl border border-white/5 space-y-1">
                    <div className="flex justify-between text-[10px] font-mono">
                      <span className="text-slate-300 font-bold flex items-center gap-1">
                        <SlidersHorizontal className="w-3 h-3 text-amber-400" />
                        <span>バトル・接近戦 (Racecraft)</span>
                      </span>
                      <span className="text-amber-300 font-black">{driverSkills.skills.racecraft} / 99</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-amber-500 to-orange-400 rounded-full" style={{ width: `${driverSkills.skills.racecraft}%` }} />
                    </div>
                  </div>

                  {/* Consistency */}
                  <div className="bg-black/40 p-2.5 rounded-xl border border-white/5 space-y-1 sm:col-span-2">
                    <div className="flex justify-between text-[10px] font-mono">
                      <span className="text-slate-300 font-bold flex items-center gap-1">
                        <Brain className="w-3 h-3 text-purple-400" />
                        <span>精神力・安定度 (Consistency)</span>
                      </span>
                      <span className="text-purple-300 font-black">{driverSkills.skills.consistency} / 99</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-purple-500 to-pink-400 rounded-full" style={{ width: `${driverSkills.skills.consistency}%` }} />
                    </div>
                  </div>
                </div>

                <div className="text-[11px] font-mono text-slate-300 bg-slate-950/40 p-2.5 rounded-xl border border-white/5 flex items-start gap-1.5">
                  <span className="text-sky-400 font-bold flex-shrink-0 flex items-center gap-1">
                    <Key className="w-3 h-3 text-sky-400" />
                    <span>特性サマリー:</span>
                  </span>
                  <span>{driverSkills.keyStrength}</span>
                </div>
              </div>

              {/* Trait Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {driverTraits.map((trait) => (
                  <div
                    key={trait.id}
                    className={`p-4 rounded-2xl border flex flex-col justify-between space-y-3 transition-all ${
                      trait.tier === 'APEX_GOLD'
                        ? 'bg-gradient-to-br from-amber-950/40 via-yellow-950/20 to-slate-900/90 border-amber-400/70 shadow-[0_0_15px_rgba(251,191,36,0.15)]'
                        : trait.tier === 'TITANIUM_TACTICAL'
                        ? 'bg-gradient-to-br from-cyan-950/30 via-slate-900/80 to-slate-950/90 border-cyan-400/50 shadow-[0_0_12px_rgba(34,211,238,0.1)]'
                        : 'bg-gradient-to-br from-rose-950/30 via-slate-900/80 to-slate-950/90 border-rose-500/50 shadow-[0_0_12px_rgba(244,63,94,0.1)]'
                    }`}
                  >
                    <div className="space-y-2">
                      {/* Card Header: Icon, Name & Tier Badge */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl flex-shrink-0">{trait.icon}</span>
                          <div>
                            <h5
                              className={`text-sm font-racing font-black tracking-wide ${
                                trait.tier === 'APEX_GOLD'
                                  ? 'text-amber-300'
                                  : trait.tier === 'TITANIUM_TACTICAL'
                                  ? 'text-cyan-300'
                                  : 'text-rose-300'
                              }`}
                            >
                              {trait.name}
                            </h5>
                            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">
                              {trait.category.replace(/_/g, ' ')}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1 flex-shrink-0">
                          <span
                            className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-md uppercase tracking-wider border ${
                              trait.tier === 'APEX_GOLD'
                                ? 'bg-amber-400/20 text-amber-200 border-amber-400/50 shadow-sm'
                                : trait.tier === 'TITANIUM_TACTICAL'
                                ? 'bg-cyan-400/20 text-cyan-200 border-cyan-400/50 shadow-sm'
                                : 'bg-rose-500/20 text-rose-200 border-rose-500/50 shadow-sm'
                            }`}
                          >
                            {trait.tier.replace(/_/g, ' ')}
                          </span>
                          <span
                            className={`text-[8.5px] font-mono font-bold px-1.5 py-0.5 rounded border ${
                              trait.triggerType === 'GUARANTEED'
                                ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40'
                                : 'bg-purple-950/60 text-purple-300 border-purple-500/40'
                            }`}
                          >
                            {trait.triggerType === 'GUARANTEED' ? (
                              <span className="inline-flex items-center gap-1">
                                <Check className="w-2.5 h-2.5 text-emerald-400" />
                                <span>確定発動</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1">
                                <Sparkles className="w-2.5 h-2.5 text-purple-400" />
                                <span>確率発動 ({Math.round((trait.baseActivationChance ?? 0.5) * 100)}%)</span>
                              </span>
                            )}
                          </span>
                        </div>
                      </div>

                      {/* Tactical Effect Box */}
                      <div className="bg-black/40 border border-white/5 p-2.5 rounded-xl space-y-1">
                        <div className="flex items-center gap-1 text-[10px] font-mono font-bold text-slate-300">
                          <Zap className="w-3 h-3 text-amber-400" />
                          <span>発動条件:</span>
                          <span className="text-white ml-0.5">{trait.triggerConditionText}</span>
                        </div>
                        <div className="flex items-start gap-1 text-[11px] text-slate-200 leading-relaxed font-mono">
                          <span className="text-emerald-400 font-bold flex-shrink-0">効果:</span>
                          <span>{trait.tacticalEffectDescription}</span>
                        </div>
                      </div>

                      {/* Historical Origin Narrative (The Lore / Encyclopedia Link) */}
                      <div className="space-y-1 pt-1">
                        <span className="text-[10px] font-racing font-bold text-amber-400/90 uppercase tracking-wider flex items-center gap-1">
                          <BookOpen className="w-3 h-3 text-amber-400" />
                          <span>史実の名勝負・ドラマの背景</span>
                        </span>
                        <p className="text-xs text-slate-300 leading-relaxed italic bg-slate-950/40 p-2.5 rounded-xl border border-white/5">
                          &ldquo;{trait.originHistory}&rdquo;
                        </p>
                      </div>

                      {/* Quote if available */}
                      {trait.quote && (
                        <div className="text-[11px] font-mono text-sky-300/90 bg-sky-950/30 border border-sky-500/20 p-2 rounded-lg flex items-center gap-1.5">
                          <Quote className="w-3 h-3 text-sky-400 shrink-0" />
                          <span>{trait.quote}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: BIOGRAPHY, ICONIC RACES & RIVALRIES */}
          {activeTab === 'bio' && (
            <div className="space-y-5 animate-fade-in">
              {/* Race Engineer Block */}
              {driver.raceEngineer && (
                <div className="bg-gradient-to-r from-blue-950/40 via-slate-900/80 to-slate-950/60 border border-sky-500/30 p-4 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-racing font-bold text-sky-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Radio className="w-4 h-4 text-sky-300" />
                      <span>相棒レースエンジニア & 無線交信連携</span>
                    </h4>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-900/60 text-sky-200 border border-sky-500/40 font-bold">
                      CALLSIGN: &quot;{driver.raceEngineer.callsign}&quot;
                    </span>
                  </div>
                  <div className="text-xs space-y-1">
                    <p className="text-slate-100 font-semibold flex items-center gap-2">
                      <span>担当: {driver.raceEngineer.name}</span>
                    </p>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      {renderTextWithCitations(driver.raceEngineer.dynamic)}
                    </p>
                  </div>
                </div>
              )}

              {/* Multiple Iconic Quotes */}
              <div className="space-y-2">
                <h4 className="text-xs font-racing font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Quote className="w-4 h-4 text-sky-400" />
                  <span>象徴的名言集 / ICONIC QUOTES</span>
                </h4>
                <div className="space-y-2">
                  {driver.biography.quotes.map((quote, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-900/90 border-l-2 border-l-sky-400 border border-white/10 p-3.5 rounded-r-xl text-xs font-serif italic text-slate-200 shadow-sm"
                    >
                      {quote}
                    </div>
                  ))}
                </div>
              </div>

              {/* Personality & Character */}
              <div className="bg-slate-900/80 border border-white/10 p-4 rounded-2xl space-y-1.5">
                <h4 className="text-xs font-racing font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                  <User className="w-4 h-4 text-sky-400" />
                  <span>人物像・レースでの振る舞い</span>
                </h4>
                <div className="text-xs text-slate-200 leading-relaxed">
                  {renderParagraphsWithCitations(driver.biography.personality)}
                </div>
              </div>

              {/* Rivalries & History */}
              <div className="bg-slate-900/80 border border-white/10 p-4 rounded-2xl space-y-1.5">
                <h4 className="text-xs font-racing font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-amber-400" />
                  <span>ライバル関係史・パドックの人間模様</span>
                </h4>
                <div className="text-xs text-slate-200 leading-relaxed">
                  {renderParagraphsWithCitations(driver.biography.rivalries)}
                </div>
              </div>

              {/* Top 3 Iconic Races Breakdown */}
              {driver.biography.iconicRaces && driver.biography.iconicRaces.length > 0 && (
                <div className="space-y-2.5">
                  <h4 className="text-xs font-racing font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Trophy className="w-4 h-4 text-amber-400" />
                    <span>キャリアを象徴する伝説のレース (Defining Races)</span>
                  </h4>
                  <div className="space-y-3">
                    {driver.biography.iconicRaces.map((race, idx) => (
                      <div
                        key={idx}
                        className="bg-slate-900/90 border border-white/10 rounded-2xl p-4 space-y-2 hover:border-slate-500/40 transition-all"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-white font-racing">
                            {race.gp} ({race.year})
                          </span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-sky-300 border border-white/10">
                            MASTERCLASS #{idx + 1}
                          </span>
                        </div>
                        <div className="text-xs text-slate-300 leading-relaxed font-sans">
                          {renderParagraphsWithCitations(race.description)}
                        </div>
                        <div className="bg-slate-950/70 border border-white/5 p-2.5 rounded-xl text-[11px] text-slate-300 flex items-start gap-1.5 font-sans">
                          <span className="text-amber-400 font-bold shrink-0 flex items-center gap-1">
                            <Zap className="w-3 h-3 text-amber-400" />
                            <span>戦術的決定打:</span>
                          </span>
                          <span className="text-slate-300">{renderParagraphsWithCitations(race.tacticalMasterclass)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Driver's Curated Legendary Team Radios (Pillar from Radio Vault) */}
              {driverRadios.length > 0 && (
                <div className="space-y-3 pt-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-racing font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Radio className="w-4 h-4 text-sky-400" />
                      <span>伝説のチーム無線アーカイブ ({driverRadios.length}件)</span>
                    </h4>
                    <span className="text-[10px] font-mono text-slate-400">
                      日本語訳・実況コンテキスト付
                    </span>
                  </div>

                  <div className="space-y-3">
                    {driverRadios.map((radio) => (
                      <div
                        key={radio.id}
                        className="p-4 rounded-2xl bg-slate-900/90 border border-white/10 space-y-2.5 shadow-md hover:border-slate-600 transition-all"
                      >
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-racing font-bold text-white">
                              {radio.title}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-white/10">
                              {radio.gpName} ({radio.year})
                            </span>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-sky-300 border border-white/10">
                              {radio.categoryLabel}
                            </span>
                          </div>
                        </div>

                        {/* Transcripts */}
                        <div className="space-y-1.5 p-3 rounded-xl bg-black/40 border border-white/5 font-mono">
                          <div className="text-xs text-sky-200 italic">
                            &ldquo;{radio.transcriptEn}&rdquo;
                          </div>
                          <div className="text-xs text-slate-200 font-sans">
                            {radio.transcriptJa}
                          </div>
                        </div>

                        {/* Context with Citations */}
                        <div className="text-[11px] text-slate-300 leading-relaxed font-sans">
                          {renderTextWithCitations(radio.contextJa)}
                        </div>

                        {/* Actions: Audio Player & Official Clip */}
                        <div className="flex items-center gap-2 pt-1 flex-wrap">
                          {radio.audioUrl && (
                            <button
                              onClick={() => handlePlayRadio(radio)}
                              className={`px-3 py-1.5 rounded-xl text-xs font-racing font-bold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer ${
                                activeRadioId === radio.id && isRadioPlaying
                                  ? 'bg-rose-600 text-white animate-pulse'
                                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10'
                              }`}
                            >
                              {activeRadioId === radio.id && isRadioPlaying ? (
                                <>
                                  <Square className="w-3 h-3 fill-current" />
                                  <span>停止</span>
                                </>
                              ) : (
                                <>
                                  <Play className="w-3 h-3 fill-current" />
                                  <span>実況音声を再生</span>
                                </>
                              )}
                            </button>
                          )}
                          {radio.officialClipUrl && (
                            <a
                              href={radio.officialClipUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1.5 rounded-xl text-xs font-racing font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-white/10 flex items-center gap-1.5 transition-all"
                            >
                              <Film className="w-3.5 h-3.5 text-rose-400" />
                              <span>公式ハイライト映像</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Off-Track Passions */}
              <div className="bg-slate-900/80 border border-white/10 p-4 rounded-2xl space-y-1.5">
                <h4 className="text-xs font-racing font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <User className="w-4 h-4 text-emerald-400" />
                  <span>レース外の素顔・ライフスタイル</span>
                </h4>
                <div className="text-xs text-slate-200 leading-relaxed">
                  {renderTextWithCitations(driver.biography.offTrack)}
                </div>
              </div>

              {/* Official Social Links Banner */}
              {driver.socialLinks && (
                <div className="bg-slate-900/90 border border-white/10 p-4 rounded-2xl space-y-2.5 shadow-sm">
                  <h4 className="text-xs font-racing font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Radio className="w-4 h-4 text-sky-400" />
                    <span>公式SNS & オフィシャルWebサイト</span>
                  </h4>
                  <div className="flex items-center gap-2.5 flex-wrap">
                    {driver.socialLinks.instagram && (
                      <a
                        href={driver.socialLinks.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-white/10 text-xs font-medium text-slate-200 hover:text-white transition-all shadow-sm group"
                      >
                        <svg className="w-4 h-4 text-pink-400 group-hover:scale-110 transition-transform flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                        </svg>
                        <span className="font-mono">{getInstagramHandle(driver.socialLinks.instagram)}</span>
                        <ExternalLink className="w-2.5 h-2.5 text-slate-400 group-hover:text-slate-200" />
                      </a>
                    )}
                    {driver.socialLinks.xTwitter && (
                      <a
                        href={driver.socialLinks.xTwitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-white/10 text-xs font-medium text-slate-300 hover:text-white transition-all shadow-sm"
                      >
                        <span className="font-bold">𝕏 (Twitter)</span>
                        <ExternalLink className="w-2.5 h-2.5 text-slate-400" />
                      </a>
                    )}
                    {driver.socialLinks.website && (
                      <a
                        href={driver.socialLinks.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-white/10 text-xs font-medium text-slate-300 hover:text-white transition-all shadow-sm"
                      >
                        <Globe className="w-3.5 h-3.5 text-sky-400" />
                        <span>公式Webサイト</span>
                        <ExternalLink className="w-2.5 h-2.5 text-slate-400" />
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: REFERENCES & PRIMARY SOURCES */}
          {activeTab === 'references' && (
            <div className="space-y-3 animate-fade-in">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-racing font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-sky-400" />
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
                        <ExternalLink className="w-2.5 h-2.5" />
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
    </div>
  );
}

export { DriverDetailModal as DriverDetailView };
