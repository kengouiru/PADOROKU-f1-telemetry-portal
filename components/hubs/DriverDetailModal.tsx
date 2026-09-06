'use client';

/**
 * components/hubs/DriverDetailModal.tsx
 * Comprehensive Detailed Modal/Drawer for F1 Drivers (Current & Legends).
 * Enhanced with clean CC-licensed portrait image with attribution via streaming image-proxy,
 * robust fallback badge, telemetry engineering signatures, mechanical preferences,
 * race engineers, number origins, and unified champagne gold (#D4AF37) for Legends.
 */

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import type { DriverProfile, Reference, TelemetryTarget } from '@/data/f1KnowledgeData';
import PhotoGalleryCarousel from '@/components/ui/PhotoGalleryCarousel';
import { useUserPreferences } from '@/lib/userPreferences';

interface DriverDetailModalProps {
  driver: DriverProfile;
  allDrivers: DriverProfile[];
  onSelectDriver: (driver: DriverProfile) => void;
  onNavigateToTelemetry?: (target?: TelemetryTarget) => void;
  onCompareDriver?: (driverCode: string) => void;
  onClose: () => void;
}

type DetailTab = 'overview' | 'style' | 'bio' | 'references';

export default function DriverDetailModal({
  driver,
  allDrivers,
  onSelectDriver,
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

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in">
      {/* Modal Card */}
      <div
        ref={modalContentRef}
        className="glass-card bg-slate-950/95 border border-white/15 w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden relative"
        style={{ borderTopColor: themeColor, borderTopWidth: 4 }}
      >
        {/* Top Navigation Bar: Prev / Next & Close */}
        <div className="p-2.5 sm:px-6 bg-slate-900/90 border-b border-white/10 flex items-center justify-between gap-2 flex-shrink-0">
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
            <button
              onClick={() => prevDriver && onSelectDriver(prevDriver)}
              className="px-2 py-1 sm:px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-racing flex items-center gap-1 transition-all cursor-pointer"
              title="前の選手 (←キー)"
            >
              <span>◀</span>
              <span className="font-mono font-bold truncate">{prevDriver?.code}</span>
            </button>
            <button
              onClick={() => nextDriver && onSelectDriver(nextDriver)}
              className="px-2 py-1 sm:px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-racing flex items-center gap-1 transition-all cursor-pointer"
              title="次の選手 (→キー)"
            >
              <span className="font-mono font-bold truncate">{nextDriver?.code}</span>
              <span>▶</span>
            </button>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
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
              <span>{isFavoriteDriver(driver.code) ? '★' : '☆'}</span>
              <span className="hidden sm:inline">
                {isFavoriteDriver(driver.code) ? '推し登録中' : '推し登録'}
              </span>
            </button>

            {onCompareDriver && (
              <button
                onClick={() => {
                  onClose();
                  onCompareDriver(driver.code);
                }}
                className="px-2.5 py-1 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/40 text-purple-200 text-xs font-racing flex items-center gap-1 transition-all cursor-pointer shadow-sm"
                title="この選手を直接比較ツールに送る"
              >
                <span>⚔️</span>
                <span className="hidden sm:inline">2名直接比較</span>
              </button>
            )}
            <span className="text-[10px] text-slate-500 font-mono hidden md:inline">
              キーボード [←] [→] で選手切り替え / [ESC] で閉じる
            </span>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center text-sm font-bold transition-all cursor-pointer"
              title="閉じる (ESC)"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Driver Hero Header */}
        <div
          className={`p-5 sm:p-6 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
            isLegend
              ? 'bg-gradient-to-r from-amber-950/40 via-yellow-950/20 to-slate-900/40'
              : 'bg-gradient-to-b from-slate-900/60 to-transparent'
          }`}
        >
          <div className="flex items-center gap-4 sm:gap-5">
            {/* Driver Portrait Image Area */}
            <div className="flex flex-col items-center flex-shrink-0">
              <div
                className="w-20 h-24 sm:w-24 sm:h-28 rounded-2xl overflow-hidden border shadow-xl bg-slate-900 relative flex items-center justify-center"
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
                  <span className="text-2xl sm:text-3xl leading-none">#{driver.number}</span>
                  <span className="text-xs tracking-wider mt-1">{driver.code}</span>
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
                    className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded-md text-[10px] font-racing font-black bg-black/85 backdrop-blur-sm border shadow-sm"
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
                  className="mt-1 text-[9px] text-slate-400 hover:text-sky-300 font-mono flex items-center gap-0.5 transition-colors max-w-[100px] truncate"
                  title={`撮影: ${driver.visualAsset.credit} (${driver.visualAsset.license})`}
                >
                  <span>Photo: {driver.visualAsset.credit}</span>
                  <span className="text-[8px]">↗</span>
                </a>
              )}
            </div>

            {/* Driver Title & Identity */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-slate-400 font-mono">{driver.country}</span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono border ${
                    isLegend
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-sm'
                      : 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                  }`}
                >
                  {isLegend ? '👑 殿堂入り F1 LEGEND' : '🏁 現役ドライバー'}
                </span>
                <span className="bg-slate-800/90 text-slate-300 px-2 py-0.5 rounded-full text-[10px] font-medium border border-white/10">
                  {driver.driverType}
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-white leading-tight flex items-center gap-2">
                <span>{driver.fullName}</span>
                {isLegend && <span className="text-amber-400 text-lg">👑</span>}
              </h2>
              <p className="text-xs text-slate-400">
                <strong className="text-slate-200">{driver.team}</strong>
                {driver.nickname && <span className="ml-2 text-slate-400">({driver.nickname})</span>}
              </p>

              {/* Official Social Links (Instagram / X / Web) */}
              {driver.socialLinks && (
                <div className="flex items-center gap-2 pt-1 flex-wrap">
                  {driver.socialLinks.instagram && (
                    <a
                      href={driver.socialLinks.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium text-slate-200 bg-slate-800/80 border border-white/10 hover:border-pink-500/50 hover:bg-gradient-to-r hover:from-[#f09433]/20 hover:via-[#dc2743]/20 hover:to-[#bc1888]/20 hover:text-white transition-all shadow-sm group"
                      title={`${driver.fullName} 公式Instagramを開く`}
                    >
                      <svg className="w-3.5 h-3.5 text-pink-400 group-hover:scale-110 transition-transform flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                      <span className="font-mono">{getInstagramHandle(driver.socialLinks.instagram)}</span>
                      <span className="text-[10px] text-slate-400 group-hover:text-pink-300">↗</span>
                    </a>
                  )}

                  {driver.socialLinks.xTwitter && (
                    <a
                      href={driver.socialLinks.xTwitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium text-slate-400 bg-slate-800/80 border border-white/10 hover:border-white/30 hover:bg-slate-700/80 hover:text-white transition-all shadow-sm"
                      title={`${driver.fullName} 公式X (Twitter) を開く`}
                    >
                      <span className="text-slate-300 font-bold">𝕏</span>
                      <span className="text-[10px] text-slate-400">↗</span>
                    </a>
                  )}

                  {driver.socialLinks.website && (
                    <a
                      href={driver.socialLinks.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium text-slate-400 bg-slate-800/80 border border-white/10 hover:border-sky-400/40 hover:bg-sky-950/40 hover:text-sky-200 transition-all shadow-sm"
                      title={`${driver.fullName} 公式Webサイトを開く`}
                    >
                      <span>🌐</span>
                      <span className="text-[10px] text-slate-400">↗</span>
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Championship Trophy Banner */}
          {driver.championships > 0 && (
            <div
              className="rounded-2xl p-3 px-4 flex items-center gap-3 self-start sm:self-auto flex-shrink-0 border shadow-lg"
              style={{
                backgroundColor: isLegend ? 'rgba(212, 175, 55, 0.15)' : 'rgba(245, 158, 11, 0.12)',
                borderColor: `${themeColor}60`,
              }}
            >
              <span className="text-3xl">🏆</span>
              <div>
                <span
                  className="text-xs font-racing font-bold uppercase tracking-widest block"
                  style={{ color: themeColor }}
                >
                  {isLegend ? 'LEGENDARY WORLD CHAMPION' : 'WORLD CHAMPION'}
                </span>
                <span className="text-base sm:text-lg font-black text-white font-mono">
                  {driver.championships}回 王座
                </span>
                {driver.championshipYears && (
                  <span className="block text-[10px] text-amber-200/90 font-mono">
                    ({driver.championshipYears.join(', ')})
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Sub-Tabs */}
        <div className="flex items-center gap-2 px-5 sm:px-6 pt-3 border-b border-white/10 bg-slate-900/40 overflow-x-auto flex-shrink-0">
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
              {/* Photo Gallery Carousel (3-5 Photos with Sneak Peek) */}
              {(driver.visualGallery && driver.visualGallery.length > 0) ? (
                <PhotoGalleryCarousel
                  items={driver.visualGallery}
                  title="📸 DRIVER PHOTO & ACTION GALLERY / ギャラリー"
                  themeColor={themeColor}
                />
              ) : driver.visualAsset ? (
                <PhotoGalleryCarousel
                  items={[
                    {
                      imageUrl: driver.visualAsset.imageUrl,
                      caption: driver.visualAsset.caption,
                      tag: 'Portrait',
                      credit: driver.visualAsset.credit,
                      license: driver.visualAsset.license,
                      sourceUrl: driver.visualAsset.sourceUrl,
                    },
                  ]}
                  title="📸 DRIVER PHOTO / ポートレート"
                  themeColor={themeColor}
                />
              ) : null}

              {/* Detailed Career Biography Narrative */}
              <div className="bg-slate-900/80 border border-white/10 p-4 rounded-2xl space-y-2">
                <h4 className="text-xs font-racing font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                  <span>📜</span>
                  <span>キャリア総括 ＆ レース人生の軌跡</span>
                </h4>
                <p className="text-xs text-slate-200 leading-relaxed">
                  {renderTextWithCitations(driver.careerSummary)}
                </p>
              </div>

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
                  <span
                    className="text-xl font-bold font-mono mt-1 block"
                    style={{ color: themeColor }}
                  >
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
                    <span className="text-amber-400 font-bold flex-shrink-0">#️⃣ カーナンバー #{driver.number} の由来:</span>
                    <span className="text-slate-300">{driver.numberOrigin}</span>
                  </div>
                )}
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

          {/* TAB 2: DRIVING STYLE & ENGINEERING */}
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

              {/* Mechanical Preferences Block */}
              {driver.engineeringPreference && (
                <div className="bg-slate-950/80 border border-amber-500/30 p-4 rounded-2xl space-y-3">
                  <h4 className="text-xs font-racing font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                    <span>🔧</span>
                    <span>マシンセットアップ & メカニカル嗜好</span>
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                    <div className="bg-slate-900/70 p-3 rounded-xl border border-white/5 space-y-1">
                      <span className="text-amber-400 font-bold block text-[11px]">⚖️ 車体バランス</span>
                      <p className="text-slate-300 text-[11px] leading-relaxed">
                        {driver.engineeringPreference.setupBalance}
                      </p>
                    </div>
                    <div className="bg-slate-900/70 p-3 rounded-xl border border-white/5 space-y-1">
                      <span className="text-amber-400 font-bold block text-[11px]">🦶 ペダルタッチ・制動感</span>
                      <p className="text-slate-300 text-[11px] leading-relaxed">
                        {driver.engineeringPreference.pedalFeel}
                      </p>
                    </div>
                    <div className="bg-slate-900/70 p-3 rounded-xl border border-white/5 space-y-1">
                      <span className="text-amber-400 font-bold block text-[11px]">🎯 ステアリングフィール</span>
                      <p className="text-slate-300 text-[11px] leading-relaxed">
                        {driver.engineeringPreference.steeringWeight}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Telemetry Engineering Signature (Deep Dive) */}
              <div className="bg-gradient-to-r from-blue-950/40 via-purple-950/30 to-slate-900/60 border border-sky-500/30 p-4 rounded-2xl space-y-2 shadow-inner">
                <h4 className="text-xs font-racing font-bold text-sky-300 uppercase tracking-wider flex items-center gap-1.5">
                  <span>📈</span>
                  <span>テレメトリー工学解析・ステアリング＆ペダル波形特性</span>
                </h4>
                <p className="text-xs text-slate-200 leading-relaxed font-mono text-[11px]">
                  {driver.drivingStyle.telemetrySignature}
                </p>

                {onNavigateToTelemetry && (
                  <button
                    onClick={() => {
                      onClose();
                      onNavigateToTelemetry({ year: 2024, targetDriver: String(driver.number) });
                    }}
                    className="w-full mt-2 py-2 px-3 rounded-xl bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-500 hover:to-sky-500 text-white font-racing font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
                  >
                    <span>📊</span>
                    <span>このドライバーの車速・ペダル重ね合わせテレメトリーを見る ➔</span>
                  </button>
                )}
              </div>

              {/* Preferred Circuit Types */}
              <div className="bg-slate-950/60 border border-white/10 p-4 rounded-2xl space-y-2">
                <h4 className="text-xs font-racing font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <span>🎯</span>
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

          {/* TAB 3: BIOGRAPHY, ICONIC RACES & RIVALRIES */}
          {activeTab === 'bio' && (
            <div className="space-y-5 animate-fade-in">
              {/* Race Engineer Block */}
              {driver.raceEngineer && (
                <div className="bg-gradient-to-r from-blue-950/40 via-slate-900/80 to-slate-950/60 border border-sky-500/30 p-4 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-racing font-bold text-sky-300 uppercase tracking-wider flex items-center gap-1.5">
                      <span>📻</span>
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
                      {driver.raceEngineer.dynamic}
                    </p>
                  </div>
                </div>
              )}

              {/* Multiple Iconic Quotes */}
              <div className="space-y-2">
                <h4 className="text-xs font-racing font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                  <span>💬</span>
                  <span>象徴的名言集 / ICONIC QUOTES</span>
                </h4>
                <div className="space-y-2">
                  {driver.biography.quotes.map((quote, idx) => (
                    <div
                      key={idx}
                      className="bg-gradient-to-r from-blue-950/40 to-slate-900/60 border border-blue-500/20 p-3.5 rounded-xl text-xs font-serif italic text-sky-100 shadow-sm"
                    >
                      {quote}
                    </div>
                  ))}
                </div>
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

              {/* Rivalries & History */}
              <div className="bg-slate-900/80 border border-white/10 p-4 rounded-2xl space-y-1.5">
                <h4 className="text-xs font-racing font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                  <span>⚔️</span>
                  <span>ライバル関係史・パドックの人間模様</span>
                </h4>
                <p className="text-xs text-slate-200 leading-relaxed">
                  {driver.biography.rivalries}
                </p>
              </div>

              {/* Top 3 Iconic Races Breakdown */}
              {driver.biography.iconicRaces && driver.biography.iconicRaces.length > 0 && (
                <div className="space-y-2.5">
                  <h4 className="text-xs font-racing font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <span>🏆</span>
                    <span>キャリアを象徴する伝説のレース</span>
                  </h4>
                  <div className="space-y-3">
                    {driver.biography.iconicRaces.map((race, idx) => (
                      <div
                        key={idx}
                        className="bg-slate-950/70 border border-white/10 rounded-2xl p-4 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-white font-racing">
                            {race.gp} ({race.year})
                          </span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-900/40 text-blue-300 border border-blue-500/30">
                            MASTERCLASS #{idx + 1}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          {race.description}
                        </p>
                        <div className="bg-purple-950/30 border border-purple-500/20 p-2.5 rounded-xl text-[11px] text-purple-200 flex items-start gap-1.5">
                          <span className="text-purple-400 font-bold">⚡ 戦術的決定打:</span>
                          <span className="text-slate-300">{race.tacticalMasterclass}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

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

              {/* Official Social Links Banner */}
              {driver.socialLinks && (
                <div className="bg-gradient-to-r from-pink-950/20 via-slate-900/80 to-purple-950/20 border border-pink-500/20 p-4 rounded-2xl space-y-2.5 shadow-sm">
                  <h4 className="text-xs font-racing font-bold text-pink-300 uppercase tracking-wider flex items-center gap-1.5">
                    <span>📱</span>
                    <span>公式SNS & オフィシャルWebサイト</span>
                  </h4>
                  <div className="flex items-center gap-2.5 flex-wrap">
                    {driver.socialLinks.instagram && (
                      <a
                        href={driver.socialLinks.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-pink-500/40 text-xs font-medium text-slate-200 hover:text-white hover:border-pink-400 hover:bg-gradient-to-r hover:from-[#f09433]/25 hover:via-[#dc2743]/25 hover:to-[#bc1888]/25 transition-all shadow-sm group"
                      >
                        <svg className="w-4 h-4 text-pink-400 group-hover:scale-110 transition-transform flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                        </svg>
                        <span className="font-mono">{getInstagramHandle(driver.socialLinks.instagram)}</span>
                        <span className="text-[10px] text-pink-400 group-hover:text-pink-300">↗</span>
                      </a>
                    )}
                    {driver.socialLinks.xTwitter && (
                      <a
                        href={driver.socialLinks.xTwitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-white/10 text-xs font-medium text-slate-300 hover:text-white hover:border-white/30 transition-all shadow-sm"
                      >
                        <span className="font-bold">𝕏 (Twitter)</span>
                        <span className="text-[10px] text-slate-400">↗</span>
                      </a>
                    )}
                    {driver.socialLinks.website && (
                      <a
                        href={driver.socialLinks.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-white/10 text-xs font-medium text-slate-300 hover:text-sky-200 hover:border-sky-500/40 transition-all shadow-sm"
                      >
                        <span>🌐 公式Webサイト</span>
                        <span className="text-[10px] text-slate-400">↗</span>
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
    </div>,
    document.body
  );
}
