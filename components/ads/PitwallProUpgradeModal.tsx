'use client';

/**
 * components/ads/PitwallProUpgradeModal.tsx
 * 🏁 Pitwall Pro Subscription & Feature Showcase Modal
 * 
 * Showcases exclusive Pro benefits (Unlimited AI, Ad-Free, Popouts, Historical Data)
 * with a clean toggle to test Pro mode in the current development environment.
 */

import React from 'react';
import { DEFAULT_MONETIZATION_SETTINGS } from '@/lib/monetizationConfig';
import { X, Check, Sparkles, Shield, Zap, ExternalLink } from 'lucide-react';

interface PitwallProUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  isPro?: boolean;
  onTogglePro?: (newVal: boolean) => void;
}

export default function PitwallProUpgradeModal({
  isOpen,
  onClose,
  isPro = false,
  onTogglePro,
}: PitwallProUpgradeModalProps) {
  if (!isOpen) return null;

  const settings = DEFAULT_MONETIZATION_SETTINGS;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl rounded-3xl bg-gradient-to-b from-slate-900 via-slate-950 to-black border border-red-500/40 p-6 sm:p-8 shadow-2xl shadow-red-950/50 text-white space-y-6 max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-red-600/30 to-amber-600/30 border border-red-500/50 text-amber-300 font-racing font-bold text-xs uppercase tracking-widest shadow-md">
            <Sparkles className="w-3.5 h-3.5" />
            <span>F1 TELEMETRY PREMIUM</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black font-racing tracking-tight text-white">
            PITWALL <span className="text-red-500">PRO</span>
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
            F1ストラテジストの視点でレースを完全掌握。
            極限のデータ解析とAI戦略シミュレーションをあなたの手元に。
          </p>
        </div>

        {/* Price Tag */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-red-950/40 via-slate-900 to-slate-950 border border-white/10 text-center space-y-1">
          <div className="text-xs text-slate-400 font-mono uppercase tracking-wider">
            月額プラン（いつでも解約可能）
          </div>
          <div className="text-3xl sm:text-4xl font-black font-racing text-white flex items-baseline justify-center gap-1">
            <span className="text-2xl text-red-400">¥</span>
            <span>{settings.proPlanPriceJpy}</span>
            <span className="text-sm font-normal text-slate-400 font-mono">/ 月</span>
          </div>
          <p className="text-[11px] text-emerald-400 font-mono">
            ✨ 初回 14日間無料トライアル実施中
          </p>
        </div>

        {/* Feature List */}
        <div className="space-y-3">
          <h4 className="text-xs font-racing font-bold text-slate-400 uppercase tracking-wider">
            PRO 会員限定特典一覧
          </h4>

          <div className="grid grid-cols-1 gap-2.5">
            {settings.proPlanFeatures.map((feat, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:border-white/10 transition-colors"
              >
                <span className="text-xl shrink-0 mt-0.5">{feat.icon}</span>
                <div className="space-y-0.5">
                  <div className="font-racing font-bold text-xs sm:text-sm text-white">
                    {feat.title}
                  </div>
                  <div className="text-xs text-slate-400 leading-relaxed">
                    {feat.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Button & Dev Mode Toggle */}
        <div className="space-y-3 pt-2">
          {onTogglePro ? (
            <button
              type="button"
              onClick={() => {
                onTogglePro(!isPro);
                onClose();
              }}
              className={`w-full py-3 px-6 rounded-2xl font-racing font-bold text-sm uppercase tracking-wider transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2 ${
                isPro
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/20'
                  : 'bg-gradient-to-r from-red-600 via-rose-600 to-red-600 hover:from-red-500 hover:to-rose-500 text-white shadow-red-950/60'
              }`}
            >
              <Zap className="w-4 h-4" />
              <span>
                {isPro ? 'Proモードを解除して通常版に戻す' : 'Pitwall Pro を有効化して体験する（デモ）'}
              </span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="w-full py-3 px-6 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 text-white font-racing font-bold text-sm tracking-wider uppercase shadow-xl"
            >
              無料トライアルを開始する
            </button>
          )}

          <div className="flex items-center justify-center gap-4 text-[11px] text-slate-500 font-mono">
            <span className="flex items-center gap-1">
              <Shield className="w-3 h-3 text-emerald-400" />
              <span>いつでも即時解約可能</span>
            </span>
            <span>•</span>
            <span>安全なSSL暗号化決済</span>
          </div>
        </div>

      </div>
    </div>
  );
}
