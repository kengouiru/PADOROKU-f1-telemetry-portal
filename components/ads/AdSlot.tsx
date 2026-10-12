'use client';

/**
 * components/ads/AdSlot.tsx
 * Elegant, Racing-Dark Contextual Ad & Official Affiliate Slot.
 * 
 * - Seamlessly integrates with the telemetry dark aesthetic.
 * - Disappears entirely when `isPro` is true or if disabled in `monetizationConfig`.
 * - Clearly marked with polite "PR / 公式パートナー" badges.
 */

import React from 'react';
import {
  DEFAULT_MONETIZATION_SETTINGS,
  OFFICIAL_AFFILIATE_ITEMS,
  type AffiliateSlotConfig,
} from '@/lib/monetizationConfig';
import { ExternalLink, Sparkles, ShieldCheck } from 'lucide-react';

export type AdSlotPosition = 'sidebar' | 'season_banner' | 'news_infeed' | 'library_gear';

interface AdSlotProps {
  position: AdSlotPosition;
  isPro?: boolean;
  overrideItem?: Partial<AffiliateSlotConfig>;
  className?: string;
  onUpgradeClick?: () => void;
}

export default function AdSlot({
  position,
  isPro = false,
  overrideItem,
  className = '',
  onUpgradeClick,
}: AdSlotProps) {
  // Pro users never see ads
  if (isPro) return null;

  // Check centralized feature toggles
  const settings = DEFAULT_MONETIZATION_SETTINGS;
  if (position === 'sidebar' && !settings.enableSidebarAd) return null;
  if (position === 'season_banner' && !settings.enableSeasonBroadcastAd) return null;
  if (position === 'news_infeed' && !settings.enableNewsInfeedAd) return null;
  if (position === 'library_gear' && !settings.enableLibraryProductAd) return null;

  // Select appropriate contextual partner item
  let baseItem: AffiliateSlotConfig = OFFICIAL_AFFILIATE_ITEMS.fod_broadcast;
  if (position === 'sidebar') baseItem = OFFICIAL_AFFILIATE_ITEMS.fanatec_sim;
  if (position === 'season_banner') baseItem = OFFICIAL_AFFILIATE_ITEMS.fod_broadcast;
  if (position === 'news_infeed') baseItem = OFFICIAL_AFFILIATE_ITEMS.f1_magazine;
  if (position === 'library_gear') baseItem = OFFICIAL_AFFILIATE_ITEMS.f1_store_official;

  const item = { ...baseItem, ...overrideItem };

  // 1. Sidebar Mini Variant
  if (position === 'sidebar') {
    return (
      <div className={`p-2.5 rounded-xl bg-slate-900/90 border border-white/10 hover:border-amber-500/40 transition-all text-xs group relative overflow-hidden shadow-md shadow-black/40 ${className}`}>
        <div className="flex items-center justify-between gap-1 mb-1 text-[11px] text-slate-400 font-mono">
          <span className="flex items-center gap-1 text-amber-400 font-bold">
            <Sparkles className="w-3 h-3" />
            <span>PR / 公式推奨</span>
          </span>
          <span className="text-slate-500 text-[11px] hover:text-slate-400 cursor-pointer" onClick={onUpgradeClick}>
            Proで非表示
          </span>
        </div>
        <div className="font-racing font-bold text-white text-[11px] truncate mb-0.5 group-hover:text-amber-300 transition-colors">
          {item.title}
        </div>
        <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed mb-2">
          {item.description}
        </p>
        <a
          href={item.affiliateUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-1.5 w-full py-1.5 px-2 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-[11px] font-bold font-mono transition-colors"
        >
          <span>{item.ctaText}</span>
        </a>
      </div>
    );
  }

  // 2. Season Banner Variant (Compact Ribbon)
  if (position === 'season_banner') {
    return (
      <div className={`px-4 py-2.5 rounded-xl bg-slate-900/80 border border-red-500/30 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 transition-colors hover:bg-slate-900 ${className}`}>
        <div className="flex items-center gap-3 w-full sm:w-auto overflow-hidden">
          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-600/20 text-red-400 border border-red-500/30 whitespace-nowrap">
            公式配信パートナー
          </span>
          <span className="text-[11px] text-slate-300 truncate">
            <strong className="text-slate-200 font-normal">{item.title}</strong>
            <span className="hidden md:inline text-slate-500 ml-2">| {item.description}</span>
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
          <a
            href={item.affiliateUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded-lg bg-red-950 hover:bg-red-900 border border-red-500/30 text-red-300 font-bold text-[11px] transition-colors"
          >
            <span>{item.ctaText}</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          {onUpgradeClick && (
            <button
              type="button"
              onClick={onUpgradeClick}
              className="text-[10px] text-slate-500 hover:text-slate-400 transition-colors hidden sm:block"
            >
              Proで非表示
            </button>
          )}
        </div>
      </div>
    );
  }

  // 3. News Infeed Card Variant (Blends cleanly with news grid)
  if (position === 'news_infeed') {
    return (
      <div className={`p-4 rounded-2xl bg-gradient-to-br from-slate-900/90 to-slate-950 border border-amber-500/25 shadow-md hover:border-amber-500/40 transition-all flex flex-col justify-between ${className}`}>
        <div>
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-2">
            <span className="px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30 font-bold">
              {item.badge}
            </span>
            <span className="text-slate-500">PR スポンサー提供</span>
          </div>
          <h4 className="font-racing font-bold text-sm text-white mb-1.5 leading-snug">
            {item.title}
          </h4>
          <p className="text-xs text-slate-400 leading-relaxed mb-3">
            {item.description}
          </p>
        </div>
        <a
          href={item.affiliateUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-amber-300 border border-amber-500/30 text-xs font-mono font-bold transition-all"
        >
          <span>{item.ctaText}</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    );
  }

  // 4. Library Gear Variant (Curated 4-Card Multi-Partner Showcase)
  const libraryItems = [
    {
      ...OFFICIAL_AFFILIATE_ITEMS.f1_store_official,
      badge: '公式チームギア',
      themeBorder: 'border-slate-400/30 hover:border-slate-400/50',
      badgeBg: 'bg-slate-400/15 text-slate-200 border-slate-400/30',
      buttonBg: 'bg-slate-400/15 hover:bg-slate-400/25 border-slate-400/30 text-slate-100',
    },
    {
      ...OFFICIAL_AFFILIATE_ITEMS.fanatec_sim,
      badge: 'プロ仕様SIMギア',
      themeBorder: 'border-amber-500/30 hover:border-amber-500/50',
      badgeBg: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
      buttonBg: 'bg-amber-500/15 hover:bg-amber-500/25 border-amber-500/30 text-amber-200',
    },
    {
      ...OFFICIAL_AFFILIATE_ITEMS.f1_magazine,
      badge: '技術解説・専門誌',
      themeBorder: 'border-emerald-500/30 hover:border-emerald-500/50',
      badgeBg: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
      buttonBg: 'bg-emerald-500/15 hover:bg-emerald-500/25 border-emerald-500/30 text-emerald-200',
    },
    {
      ...OFFICIAL_AFFILIATE_ITEMS.fod_broadcast,
      badge: '公式中継 ＆ F1 TV',
      themeBorder: 'border-red-500/30 hover:border-red-500/50',
      badgeBg: 'bg-red-500/15 text-red-300 border-red-500/30',
      buttonBg: 'bg-red-500/15 hover:bg-red-500/25 border-red-500/30 text-red-200',
    },
  ];

  return (
    <div className={`p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950 border border-white/10 shadow-xl ${className}`}>
      {/* Section Header */}
      <div className="flex items-center justify-between gap-2 mb-3.5 pb-2.5 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-3.5 bg-red-500 rounded-full" />
          <h4 className="font-racing font-bold text-xs sm:text-sm text-white tracking-wide">
            OFFICIAL PARTNERS & RECOMMENDED GEAR / 公式推奨パートナー＆ギア
          </h4>
          <span className="hidden md:inline-block text-[11px] text-slate-400 font-mono">
            (大百科・ナレッジ連携)
          </span>
        </div>
        {onUpgradeClick && (
          <button
            type="button"
            onClick={onUpgradeClick}
            className="text-[11px] text-slate-500 hover:text-slate-300 font-mono transition-colors shrink-0"
          >
            Pitwall Proなら非表示
          </button>
        )}
      </div>

      {/* 4-Card Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {libraryItems.map((gear) => (
          <div
            key={gear.id}
            className={`p-3.5 rounded-xl bg-slate-900/80 border ${gear.themeBorder} transition-all duration-200 flex flex-col justify-between shadow-md group`}
          >
            <div>
              <div className="flex items-center justify-between gap-1 mb-2">
                <span className={`text-[11px] font-mono px-2 py-0.5 rounded border font-bold ${gear.badgeBg}`}>
                  {gear.badge}
                </span>
                <span className="text-[11px] text-slate-500 font-mono">公式推奨</span>
              </div>
              <h5 className="font-racing font-bold text-white text-xs mb-1.5 group-hover:text-amber-300 transition-colors line-clamp-1">
                {gear.title}
              </h5>
              <p className="text-[11px] text-slate-400 leading-relaxed mb-3 line-clamp-2">
                {gear.description}
              </p>
            </div>
            <a
              href={gear.affiliateUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg border text-xs font-mono font-bold transition-all hover:scale-[1.02] ${gear.buttonBg}`}
            >
              <span>{gear.ctaText}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
