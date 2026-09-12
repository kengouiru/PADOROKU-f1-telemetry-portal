'use client';

/**
 * components/ui/PhotoGalleryCarousel.tsx
 * Reusable Sneak-Peek Horizontal Photo Gallery Carousel for Drivers and Circuits.
 *
 * Features:
 * - Sneak-peek width (w-[85%] sm:w-[75%] md:w-[70%]) showing the next photo edge
 * - Snap-mandatory smooth scrolling with Left / Right navigation buttons
 * - Active dot indicator and numeric slide counter
 * - Streamed via /api/image-proxy with lazy loading & skeleton
 * - Overlay metadata with tag badge, rich caption, and photo attribution link
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import type { VisualGalleryItem } from '@/data/f1KnowledgeData';

interface PhotoGalleryCarouselProps {
  items: VisualGalleryItem[];
  title?: string;
  badgeColor?: string;
  themeColor?: string;
  className?: string;
}

export default function PhotoGalleryCarousel({
  items,
  title,
  badgeColor,
  themeColor,
  className = '',
}: PhotoGalleryCarouselProps) {
  const activeColor = themeColor || badgeColor || '#38bdf8';
  const [activeIndex, setActiveIndex] = useState(0);
  const [loadedImages, setLoadedImages] = useState<{ [key: number]: boolean }>({});
  const [errorImages, setErrorImages] = useState<{ [key: number]: boolean }>({});
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Track active slide on scroll
  const handleScroll = useCallback(() => {
    if (!scrollContainerRef.current || !items) return;
    const container = scrollContainerRef.current;
    const scrollLeft = container.scrollLeft;
    const slideWidth = container.firstElementChild
      ? (container.firstElementChild as HTMLElement).clientWidth + 12 // 12px gap
      : container.clientWidth * 0.75;
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

  // If no items, do not render
  if (!items || items.length === 0) return null;

  return (
    <div className={`space-y-2.5 ${className}`}>
      {/* Header with Title and Slide Counter */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span className="text-sm">📸</span>
          {title ? (
            <h4 className="text-xs font-racing font-bold text-slate-200 uppercase tracking-wider">
              {title}
            </h4>
          ) : (
            <h4 className="text-xs font-racing font-bold text-slate-200 uppercase tracking-wider">
              PHOTO GALLERY & SCENES
            </h4>
          )}
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-white/10">
            {items.length} PHOTOS
          </span>
        </div>

        {/* Numeric Counter & Nav Buttons */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono font-bold text-slate-400">
            <strong className="text-sky-400">{activeIndex + 1}</strong> / {items.length}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={handlePrev}
              disabled={activeIndex === 0}
              className="w-7 h-7 rounded-lg bg-slate-800/90 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-slate-200 flex items-center justify-center text-xs font-bold transition-all border border-white/10 shadow-sm"
              title="前の写真"
            >
              ◀
            </button>
            <button
              onClick={handleNext}
              disabled={activeIndex === items.length - 1}
              className="w-7 h-7 rounded-lg bg-slate-800/90 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-slate-200 flex items-center justify-center text-xs font-bold transition-all border border-white/10 shadow-sm"
              title="次の写真"
            >
              ▶
            </button>
          </div>
        </div>
      </div>

      {/* Horizontal Carousel Container with Sneak-Peek */}
      <div className="relative group">
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex overflow-x-auto snap-x snap-mandatory gap-3 pb-2 scroll-smooth no-scrollbar"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {items.map((item, idx) => {
            const isLoaded = loadedImages[idx];
            const isError = errorImages[idx];
            const isCurrent = activeIndex === idx;
            const finalImageUrl = item.imageUrl.startsWith('/')
              ? item.imageUrl
              : `/api/image-proxy?url=${encodeURIComponent(item.imageUrl)}`;

            return (
              <div
                key={idx}
                className={`w-[85%] sm:w-[75%] md:w-[72%] h-44 sm:h-56 flex-shrink-0 snap-center rounded-2xl overflow-hidden bg-slate-950 border transition-all duration-300 relative shadow-lg ${
                  isCurrent
                    ? 'ring-1'
                    : 'border-white/10 opacity-75 hover:opacity-95'
                }`}
                style={{
                  borderColor: isCurrent ? activeColor : 'rgba(255, 255, 255, 0.1)',
                  boxShadow: isCurrent ? `0 0 15px ${activeColor}30` : undefined,
                }}
              >
                {/* Skeleton Loader */}
                {!isLoaded && !isError && (
                  <div className="absolute inset-0 bg-slate-900 animate-pulse flex items-center justify-center">
                    <div className="flex flex-col items-center gap-2 text-slate-600 text-xs font-mono">
                      <span>🖼️</span>
                      <span>Loading photo...</span>
                    </div>
                  </div>
                )}

                {/* Main Image */}
                {!isError ? (
                  <img
                    src={finalImageUrl}
                    alt={item.caption}
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                    onLoad={() => setLoadedImages((prev) => ({ ...prev, [idx]: true }))}
                    onError={() => setErrorImages((prev) => ({ ...prev, [idx]: true }))}
                    className={`w-full h-full object-cover transition-all duration-500 ${
                      isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                    } group-hover:scale-105`}
                  />
                ) : (
                  <div className="w-full h-full bg-slate-900 flex flex-col items-center justify-center text-slate-500 text-xs font-mono p-4 text-center">
                    <span className="text-2xl mb-1">📷</span>
                    <span>写真の読み込みに失敗しました</span>
                  </div>
                )}

                {/* Dark Gradient Overlay for Readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none" />

                {/* Top Tag Badge */}
                {item.tag && (
                  <div className="absolute top-2.5 left-2.5">
                    <span
                      className="px-2.5 py-0.5 rounded-full text-[10px] font-racing font-bold tracking-wider uppercase backdrop-blur-md shadow-md border"
                      style={{
                        backgroundColor: 'rgba(15, 23, 42, 0.85)',
                        borderColor: activeColor,
                        color: activeColor,
                      }}
                    >
                      {item.tag}
                    </span>
                  </div>
                )}

                {/* Bottom Metadata: Caption & Attribution */}
                <div className="absolute bottom-0 inset-x-0 p-3 flex flex-col gap-1">
                  <p className="text-xs sm:text-sm font-bold text-white leading-snug drop-shadow-md line-clamp-2">
                    {item.caption}
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-slate-300 font-mono">
                    <span className="truncate max-w-[200px] text-slate-400">
                      {item.license}
                    </span>
                    <a
                      href={item.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-sky-300 text-slate-300 flex items-center gap-1 transition-colors bg-black/50 px-1.5 py-0.5 rounded border border-white/10"
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
              className={`h-1.5 rounded-full transition-all duration-300 ${
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
  );
}
