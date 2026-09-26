'use client';

/**
 * components/ads/RewardAdModal.tsx
 * 🏁 Rewarded Ad Experience for AI Strategist Quota Recovery
 * 
 * Users voluntarily watch a 3-second official sponsor showcase (FOD, Fanatec, etc.)
 * in exchange for +2 AI strategy consultations.
 * Covers API inference cost while giving users a positive, opt-in reward experience.
 */

import React, { useState, useEffect } from 'react';
import { OFFICIAL_AFFILIATE_ITEMS } from '@/lib/monetizationConfig';
import { Sparkles, CheckCircle2, Gift, Play, ExternalLink } from 'lucide-react';

interface RewardAdModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRewardGranted: (bonusCount: number) => void;
  onUpgradeClick?: () => void;
}

export default function RewardAdModal({
  isOpen,
  onClose,
  onRewardGranted,
  onUpgradeClick,
}: RewardAdModalProps) {
  const [secondsLeft, setSecondsLeft] = useState<number>(3);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen) {
      setSecondsLeft(3);
      setIsCompleted(false);
      return;
    }

    setSecondsLeft(3);
    setIsCompleted(false);

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsCompleted(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const sponsor = OFFICIAL_AFFILIATE_ITEMS.fanatec_sim;

  const handleClaim = () => {
    onRewardGranted(2);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md rounded-3xl bg-gradient-to-b from-slate-900 via-slate-950 to-black border border-amber-500/40 p-6 shadow-2xl shadow-amber-950/40 text-white space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <Gift className="w-4 h-4 text-amber-400" />
            <span className="font-racing font-bold text-xs uppercase tracking-wider text-amber-300">
              REWARD CONSULTATION BONUS
            </span>
          </div>
          <span className="text-[10px] font-mono text-slate-400">
            {isCompleted ? '🎉 視聴完了' : `⏳ 残り ${secondsLeft}秒`}
          </span>
        </div>

        {/* Sponsor Content */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-900 border border-white/10 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span className="text-amber-400 font-bold">{sponsor.badge}</span>
            <span className="text-[11px] text-slate-500">スポンサー提供</span>
          </div>

          <h3 className="font-racing font-bold text-base text-white">
            {sponsor.title}
          </h3>

          <p className="text-xs text-slate-300 leading-relaxed">
            {sponsor.description}
          </p>

          <a
            href={sponsor.affiliateUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 w-full py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-slate-200 text-xs font-mono transition-colors"
          >
            <span>公式ストアを見る ↗</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Pro Upsell Strip */}
        <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between text-[11px] text-slate-400">
          <span>⭐ <strong>Pitwall Pro</strong>なら回数無制限・広告ゼロ</span>
          {onUpgradeClick && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onUpgradeClick();
              }}
              className="text-amber-300 hover:text-white underline font-mono font-bold"
            >
              Pro詳細 ↗
            </button>
          )}
        </div>

        {/* Action Button */}
        <div className="pt-1">
          {isCompleted ? (
            <button
              type="button"
              onClick={handleClaim}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-racing font-bold text-xs tracking-wider uppercase shadow-lg shadow-emerald-950/60 flex items-center justify-center gap-2 transition-all active:scale-95 animate-pulse"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>ボーナスを受け取る (+2回 質問枠追加)</span>
            </button>
          ) : (
            <button
              type="button"
              disabled
              className="w-full py-3 px-4 rounded-xl bg-slate-800/60 border border-white/10 text-slate-400 font-racing font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 cursor-not-allowed"
            >
              <span>スポンサー案内を視聴中... ({secondsLeft}s)</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
