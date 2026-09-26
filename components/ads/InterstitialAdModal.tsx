'use client';

/**
 * components/ads/InterstitialAdModal.tsx
 * 🏁 Pitwall Game Transition / Multi-Pattern Interstitial Modal
 * 
 * - Multi-sponsor rotation: Randomly selects from multiple authentic F1 partners
 *   (FANATEC Sim Gear, FOD Live Broadcast, F1 Official Store, F1 Technical Books).
 * - Interactive carousel with next/prev buttons and pagination dots.
 * - 3-second natural countdown with instant skip button.
 * - Frictionless Pitwall Pro upsell strip.
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  DEFAULT_MONETIZATION_SETTINGS,
  OFFICIAL_AFFILIATE_ITEMS,
  type AffiliateSlotConfig,
} from '@/lib/monetizationConfig';
import {
  Sparkles,
  ExternalLink,
  FastForward,
  ChevronLeft,
  ChevronRight,
  Tv,
  Gamepad2,
  ShoppingBag,
  BookOpen,
} from 'lucide-react';

interface InterstitialAdModalProps {
  isOpen: boolean;
  onProceed: () => void;
  onClose: () => void;
  onUpgradeClick?: () => void;
  isPro?: boolean;
}

// Multi-pattern sponsor catalog
const MULTI_SPONSORS: (AffiliateSlotConfig & { themeGradient: string; icon: React.ReactNode })[] = [
  {
    ...OFFICIAL_AFFILIATE_ITEMS.fanatec_sim,
    themeGradient: 'from-amber-950/60 via-slate-900 to-slate-950 border-amber-500/40',
    icon: <Gamepad2 className="w-5 h-5 text-amber-400" />,
  },
  {
    ...OFFICIAL_AFFILIATE_ITEMS.fod_broadcast,
    themeGradient: 'from-red-950/60 via-slate-900 to-slate-950 border-red-500/40',
    icon: <Tv className="w-5 h-5 text-red-400" />,
  },
  {
    ...OFFICIAL_AFFILIATE_ITEMS.f1_store_official,
    themeGradient: 'from-blue-950/60 via-slate-900 to-slate-950 border-blue-500/40',
    icon: <ShoppingBag className="w-5 h-5 text-blue-400" />,
  },
  {
    ...OFFICIAL_AFFILIATE_ITEMS.f1_magazine,
    themeGradient: 'from-emerald-950/60 via-slate-900 to-slate-950 border-emerald-500/40',
    icon: <BookOpen className="w-5 h-5 text-emerald-400" />,
  },
];

export default function InterstitialAdModal({
  isOpen,
  onProceed,
  onClose,
  onUpgradeClick,
  isPro = false,
}: InterstitialAdModalProps) {
  const [countdown, setCountdown] = useState<number>(3);
  const [sponsorIndex, setSponsorIndex] = useState<number>(0);

  // Randomize initial sponsor on modal open
  useEffect(() => {
    if (isOpen) {
      const randomIndex = Math.floor(Math.random() * MULTI_SPONSORS.length);
      setSponsorIndex(randomIndex);
    }
  }, [isOpen]);

  // If Pro user or if disabled, immediately proceed
  useEffect(() => {
    if (isOpen && (isPro || !DEFAULT_MONETIZATION_SETTINGS.enableGameInterstitialAd)) {
      onProceed();
    }
  }, [isOpen, isPro, onProceed]);

  // Countdown timer
  useEffect(() => {
    if (!isOpen || isPro) return;
    setCountdown(3);

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, isPro]);

  if (!isOpen || isPro || !DEFAULT_MONETIZATION_SETTINGS.enableGameInterstitialAd) return null;

  const currentSponsor = MULTI_SPONSORS[sponsorIndex] || MULTI_SPONSORS[0];

  const handlePrevSponsor = () => {
    setSponsorIndex((prev) => (prev === 0 ? MULTI_SPONSORS.length - 1 : prev - 1));
  };

  const handleNextSponsor = () => {
    setSponsorIndex((prev) => (prev === MULTI_SPONSORS.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg rounded-3xl bg-gradient-to-b from-slate-900 via-slate-950 to-black border border-white/20 p-6 shadow-2xl shadow-red-950/40 text-white space-y-4">
        
        {/* Header: Simulator Loading status & Pattern counter */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
            <span className="font-racing font-bold text-xs uppercase tracking-wider text-slate-300">
              PITWALL SIMULATOR LOADING...
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] text-slate-400">
              PR {sponsorIndex + 1}/{MULTI_SPONSORS.length}
            </span>
            <span className="font-mono text-xs text-amber-400 font-bold px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
              公式推奨
            </span>
          </div>
        </div>

        {/* Featured Sponsor Card (Multi-Pattern Carousel) */}
        <div className={`p-4 rounded-2xl bg-gradient-to-br ${currentSponsor.themeGradient} border space-y-3 relative overflow-hidden transition-all duration-300 shadow-lg`}>
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <div className="flex items-center gap-2">
              {currentSponsor.icon}
              <span className="text-amber-400 font-bold">{currentSponsor.badge}</span>
            </div>
            {/* Pattern Switchers */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handlePrevSponsor}
                className="p-1 rounded-lg bg-black/40 hover:bg-black/60 text-slate-300 hover:text-white transition-colors"
                title="前のスポンサー"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={handleNextSponsor}
                className="p-1 rounded-lg bg-black/40 hover:bg-black/60 text-slate-300 hover:text-white transition-colors"
                title="次のスポンサー"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <h3 className="font-racing font-bold text-base text-white">
            {currentSponsor.title}
          </h3>

          <p className="text-xs text-slate-300 leading-relaxed min-h-[36px]">
            {currentSponsor.description}
          </p>

          <a
            href={currentSponsor.affiliateUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs font-mono transition-all hover:scale-[1.01]"
          >
            <span>{currentSponsor.ctaText}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          {/* Dots Indicator */}
          <div className="flex items-center justify-center gap-1.5 pt-1">
            {MULTI_SPONSORS.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setSponsorIndex(i)}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === sponsorIndex ? 'bg-amber-400 w-4' : 'bg-white/20 hover:bg-white/40'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Pitwall Pro Upsell Strip */}
        <div className="p-2.5 rounded-xl bg-red-950/30 border border-red-500/20 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="text-slate-300 text-[11px]">
              ⭐ <strong>Pitwall Pro</strong>ならロード画面ゼロで即時起動！
            </span>
          </div>
          {onUpgradeClick && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onUpgradeClick();
              }}
              className="text-amber-300 hover:text-white underline text-[11px] font-mono shrink-0 font-bold"
            >
              詳細 ↗
            </button>
          )}
        </div>

        {/* Action Buttons: Countdown & Launch */}
        <div className="flex items-center gap-3 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white text-xs font-mono transition-colors"
          >
            閉じる
          </button>

          <button
            type="button"
            onClick={onProceed}
            className="flex-[2] py-2.5 px-4 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-racing font-bold text-xs tracking-wider uppercase shadow-lg shadow-red-950/60 flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <FastForward className="w-4 h-4" />
            <span>
              {countdown > 0 ? `ゲーム開始 (${countdown}s)` : 'シミュレーターを起動 ➔'}
            </span>
          </button>
        </div>

      </div>
    </div>
  );
}
