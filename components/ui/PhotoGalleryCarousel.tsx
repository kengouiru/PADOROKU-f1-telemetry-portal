'use client';

/**
 * components/ui/PhotoGalleryCarousel.tsx
 * Reusable Photo Gallery Carousel with Golden Aspect Ratio (16:10 / 3:2),
 * Smart Portrait Head-Detection (object-top), and Interactive Fullscreen Lightbox.
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import type { VisualGalleryItem } from '@/data/f1KnowledgeData';

interface PhotoGalleryCarouselProps {
  items: VisualGalleryItem[];
  title?: string;
  badgeColor?: string;
  themeColor?: string;
  aspectRatio?: '16/10' | '16/9' | '4/3' | '3/2';
  className?: string;
}

export default function PhotoGalleryCarousel({
  items,
  title,
  badgeColor,
  themeColor,
  aspectRatio = '16/10',
  className = '',
}: PhotoGalleryCarouselProps) {
  const activeColor = themeColor || badgeColor || '#38bdf8';
  const [activeIndex, setActiveIndex] = useState(0);
  const [loadedImages, setLoadedImages] = useState<{ [key: number]: boolean }>({});
  const [errorImages, setErrorImages] = useState<{ [key: number]: boolean }>({});
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Aspect ratio class mapping
  const aspectClass =
    aspectRatio === '16/9'
      ? 'aspect-[16/9]'
      : aspectRatio === '4/3'
      ? 'aspect-[4/3]'
      : aspectRatio === '3/2'
      ? 'aspect-[3/2]'
      : 'aspect-[16/10]';

  // Keyboard navigation for Lightbox
  useEffect(() => {
    if (lightboxIndex === null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setLightboxIndex(null);
      } else if (e.key === 'ArrowLeft') {
        setLightboxIndex((prev) => (prev !== null ? Math.max(0, prev - 1) : null));
      } else if (e.key === 'ArrowRight') {
        setLightboxIndex((prev) => (prev !== null ? Math.min(items.length - 1, prev + 1) : null));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, items.length]);

  // Track active slide on scroll
  const handleScroll = useCallback(() => {
    if (!scrollContainerRef.current || !items || items.length === 0) return;
    const container = scrollContainerRef.current;
    const scrollLeft = container.scrollLeft;
    const slideWidth = container.firstElementChild
      ? (container.firstElementChild as HTMLElement).clientWidth + 16
      : container.clientWidth * 0.7;
    const newIndex = Math.round(scrollLeft / slideWidth);
    if (newIndex >= 0 && newIndex < items.length && newIndex !== activeIndex) {
      setActiveIndex(newIndex);
    }
  }, [items, activeIndex]);

  // Scroll by direction
  const scrollToSlide = (index: number) => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const slide = container.children[index] as HTMLElement;
    if (slide) {
      slide.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      setActiveIndex(index);
    }
  };

  const handlePrev = () => {
    const prev = Math.max(0, activeIndex - 1);
    scrollToSlide(prev);
  };

  const handleNext = () => {
    const next = Math.min((items?.length || 1) - 1, activeIndex + 1);
    scrollToSlide(next);
  };

  if (!items || items.length === 0) return null;

  return (
    <>
      <div className={`space-y-3 ${className}`}>
        {/* Header with Title, Count, and Controls */}
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <span className="text-sm">📸</span>
            <h4 className="text-xs font-racing font-bold text-slate-200 uppercase tracking-wider">
              {title || 'PHOTO GALLERY & SCENES'}
            </h4>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-white/10">
              {items.length} PHOTOS
            </span>
          </div>

          {/* Numeric Counter & Nav Buttons */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono font-bold text-slate-400">
              <strong style={{ color: activeColor }}>{activeIndex + 1}</strong> / {items.length}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={handlePrev}
                disabled={activeIndex === 0}
                className="w-7 h-7 rounded-lg bg-slate-800/90 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-slate-200 flex items-center justify-center text-xs font-bold transition-all border border-white/10 shadow-sm cursor-pointer"
                title="前の写真"
              >
                ◀
              </button>
              <button
                onClick={handleNext}
                disabled={activeIndex === items.length - 1}
                className="w-7 h-7 rounded-lg bg-slate-800/90 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-slate-200 flex items-center justify-center text-xs font-bold transition-all border border-white/10 shadow-sm cursor-pointer"
                title="次の写真"
              >
                ▶
              </button>
            </div>
          </div>
        </div>

        {/* Carousel Container */}
        <div className="relative group">
          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="flex overflow-x-auto snap-x snap-mandatory gap-3.5 pb-2 scroll-smooth no-scrollbar"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {items.map((item, idx) => {
              const isLoaded = loadedImages[idx];
              const isError = errorImages[idx];
              const isCurrent = activeIndex === idx;
              const isPortrait = item.tag === 'Portrait' || item.tag === 'Paddock';
              const finalImageUrl = item.imageUrl.startsWith('/')
                ? item.imageUrl
                : `/api/image-proxy?url=${encodeURIComponent(item.imageUrl)}`;

              return (
                <div
                  key={idx}
                  onClick={() => setLightboxIndex(idx)}
                  className={`w-[85%] sm:w-[58%] md:w-[48%] ${aspectClass} min-h-[200px] sm:min-h-[230px] md:min-h-[250px] flex-shrink-0 snap-center rounded-2xl overflow-hidden bg-slate-950 border transition-all duration-300 relative shadow-lg cursor-pointer group/card ${
                    isCurrent
                      ? 'ring-1'
                      : 'border-white/10 opacity-90 hover:opacity-100'
                  }`}
                  style={{
                    borderColor: isCurrent ? activeColor : 'rgba(255, 255, 255, 0.1)',
                    boxShadow: isCurrent ? `0 0 16px ${activeColor}30` : undefined,
                  }}
                >
                  {/* Skeleton Loader */}
                  {!isLoaded && !isError && (
                    <div className="absolute inset-0 bg-slate-900 animate-pulse flex items-center justify-center">
                      <div className="flex items-center gap-1.5 text-slate-500 text-xs font-mono">
                        <span>🖼️</span>
                        <span>Loading...</span>
                      </div>
                    </div>
                  )}

                  {/* Main Image with Smart Head-Framing */}
                  {!isError ? (
                    <img
                      src={finalImageUrl}
                      alt={item.caption}
                      loading="lazy"
                      decoding="async"
                      referrerPolicy="no-referrer"
                      onLoad={() => setLoadedImages((prev) => ({ ...prev, [idx]: true }))}
                      onError={() => setErrorImages((prev) => ({ ...prev, [idx]: true }))}
                      className={`w-full h-full object-cover ${
                        isPortrait ? 'object-top' : 'object-center'
                      } transition-all duration-500 ${
                        isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                      } group-hover/card:scale-105`}
                    />
                  ) : (
                    <div className="w-full h-full bg-slate-900 flex flex-col items-center justify-center text-slate-500 text-xs font-mono p-4 text-center">
                      <span className="text-xl mb-1">📷</span>
                      <span>写真の読み込みに失敗しました</span>
                    </div>
                  )}

                  {/* Gradient Overlay for Top Badges & Bottom Readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 via-35% to-black/20 pointer-events-none" />

                  {/* Top-Left Tag Badge */}
                  {item.tag && (
                    <div className="absolute top-2.5 left-2.5 z-10">
                      <span
                        className="px-2 py-0.5 rounded-md text-[9px] sm:text-[10px] font-racing font-bold tracking-wider uppercase backdrop-blur-md shadow-sm border"
                        style={{
                          backgroundColor: 'rgba(15, 23, 42, 0.88)',
                          borderColor: activeColor,
                          color: activeColor,
                        }}
                      >
                        {item.tag}
                      </span>
                    </div>
                  )}

                  {/* Top-Right Lightbox Expand Hint */}
                  <div className="absolute top-2.5 right-2.5 z-10 opacity-70 group-hover/card:opacity-100 transition-opacity">
                    <span className="px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-white/90 text-[10px] font-mono border border-white/20 flex items-center gap-1 shadow">
                      <span>🔍</span>
                      <span className="hidden sm:inline">拡大</span>
                    </span>
                  </div>

                  {/* Bottom Metadata: Caption & Attribution */}
                  <div className="absolute bottom-0 inset-x-0 p-3 sm:p-3.5 flex flex-col gap-1 z-10">
                    <p className="text-xs sm:text-[13px] font-bold text-white leading-snug drop-shadow-md line-clamp-2">
                      {item.caption}
                    </p>
                    <div className="flex items-center justify-between text-[9px] sm:text-[10px] text-slate-300 font-mono pt-0.5">
                      <span className="truncate max-w-[150px] text-slate-400">
                        {item.license}
                      </span>
                      <a
                        href={item.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="hover:text-white text-slate-300 flex items-center gap-1 transition-colors bg-black/60 hover:bg-black/80 px-2 py-0.5 rounded border border-white/15"
                      >
                        <span>Photo: {item.credit}</span>
                        <span>↗</span>
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Dot Indicators */}
          <div className="flex items-center justify-center gap-1.5 pt-1.5">
            {items.map((_, idx) => (
              <button
                key={idx}
                onClick={() => scrollToSlide(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  activeIndex === idx
                    ? 'w-6'
                    : 'w-1.5 bg-slate-700 hover:bg-slate-500'
                }`}
                style={{
                  backgroundColor: activeIndex === idx ? activeColor : undefined,
                }}
                title={`写真 ${idx + 1} へ移動`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Lightbox Modal (Uncropped Full View) */}
      {lightboxIndex !== null && items[lightboxIndex] && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setLightboxIndex(null)}
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl w-full bg-slate-950/90 border border-white/20 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]"
          >
            {/* Lightbox Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-slate-900/80">
              <div className="flex items-center gap-2">
                <span className="text-sm">📸</span>
                <span
                  className="px-2 py-0.5 rounded text-[10px] font-racing font-bold uppercase tracking-wider border"
                  style={{
                    backgroundColor: `${activeColor}15`,
                    borderColor: activeColor,
                    color: activeColor,
                  }}
                >
                  {items[lightboxIndex].tag || 'GALLERY'}
                </span>
                <span className="text-xs font-mono text-slate-400">
                  {lightboxIndex + 1} / {items.length}
                </span>
              </div>
              <button
                onClick={() => setLightboxIndex(null)}
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-red-950/70 hover:text-red-400 text-slate-300 flex items-center justify-center text-sm font-bold transition-all border border-white/10 cursor-pointer"
                title="閉じる (Esc)"
              >
                ✕
              </button>
            </div>

            {/* Lightbox Main Image Area (Completely Uncropped with object-contain) */}
            <div className="relative flex-1 bg-black/95 flex items-center justify-center p-2 min-h-[300px] sm:min-h-[420px] overflow-hidden">
              <img
                src={
                  items[lightboxIndex].imageUrl.startsWith('/')
                    ? items[lightboxIndex].imageUrl
                    : `/api/image-proxy?url=${encodeURIComponent(items[lightboxIndex].imageUrl)}`
                }
                alt={items[lightboxIndex].caption}
                className="max-h-[70vh] max-w-full object-contain rounded-lg shadow-xl"
              />

              {/* Prev / Next Arrows */}
              {items.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setLightboxIndex((prev) => (prev !== null ? Math.max(0, prev - 1) : null))
                    }
                    disabled={lightboxIndex === 0}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/70 hover:bg-black/90 disabled:opacity-20 text-white flex items-center justify-center text-base font-bold transition-all border border-white/20 shadow-lg cursor-pointer"
                    title="前へ (←)"
                  >
                    ◀
                  </button>
                  <button
                    onClick={() =>
                      setLightboxIndex((prev) =>
                        prev !== null ? Math.min(items.length - 1, prev + 1) : null
                      )
                    }
                    disabled={lightboxIndex === items.length - 1}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/70 hover:bg-black/90 disabled:opacity-20 text-white flex items-center justify-center text-base font-bold transition-all border border-white/20 shadow-lg cursor-pointer"
                    title="次へ (→)"
                  >
                    ▶
                  </button>
                </>
              )}
            </div>

            {/* Lightbox Footer with Full Caption & Attribution */}
            <div className="p-3 sm:p-4 bg-slate-900/90 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="space-y-0.5">
                <p className="text-xs sm:text-sm font-bold text-white font-sans">
                  {items[lightboxIndex].caption}
                </p>
                <p className="text-[11px] text-slate-400 font-mono">
                  ライセンス: {items[lightboxIndex].license}
                </p>
              </div>
              <a
                href={items[lightboxIndex].sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-sky-400 hover:text-sky-300 text-xs font-mono border border-white/10 flex items-center gap-1.5 shrink-0 self-start sm:self-auto transition-colors"
              >
                <span>提供元: {items[lightboxIndex].credit}</span>
                <span>↗</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
