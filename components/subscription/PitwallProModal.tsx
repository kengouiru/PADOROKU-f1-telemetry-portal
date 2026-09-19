'use client';

/**
 * components/subscription/PitwallProModal.tsx
 * Pitwall Pro Subscription & Tier Upgrade Presentation Modal.
 * Offers monthly/annual options, feature comparison matrix,
 * and one-click simulated trial activation.
 */

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  usePlanTier,
  PLAN_PRICING,
  TIER_FEATURE_COMPARISON,
  resetDailyAiUsage,
} from '@/lib/tierService';

interface PitwallProModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSelectedPlan?: 'monthly' | 'annual';
}

export default function PitwallProModal({
  isOpen,
  onClose,
  initialSelectedPlan = 'annual',
}: PitwallProModalProps) {
  const { isPro, changeTier, aiUsage } = usePlanTier();
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'annual'>(initialSelectedPlan);
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  const handleActivatePro = () => {
    setIsUpgrading(true);
    setTimeout(() => {
      changeTier('pro');
      setIsUpgrading(false);
      setToastMessage('🎉 Pitwall Pro へようこそ！ 全機能がアンロックされました。');
      setTimeout(() => {
        setToastMessage(null);
      }, 4000);
    }, 600);
  };

  const handleDowngradeToFree = () => {
    changeTier('free');
    setToastMessage('⚡ フリープランに切り替えました（AI相談: 1日3回制限 / 鈴鹿限定10周シミュレーター）');
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 animate-fadeIn overflow-y-auto">
      {/* Semi-transparent Backdrop with Click-to-Close */}
      <div
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[110] px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-racing font-bold text-sm shadow-2xl animate-bounce">
          {toastMessage}
        </div>
      )}

      {/* Modal Container: flex-col with min-h-0 and overflow-hidden so header & footer are sticky and never cut off */}
      <div className="relative z-10 w-full max-w-2xl max-h-[85vh] my-auto bg-slate-950 rounded-3xl border border-amber-500/40 shadow-2xl shadow-amber-500/20 text-white flex flex-col min-h-0 overflow-hidden">
        {/* Sticky Modal Header (Never scrolls away) */}
        <div className="p-4 sm:p-6 pb-3 sm:pb-4 bg-gradient-to-b from-amber-950/40 via-slate-900/90 to-slate-950 border-b border-white/10 flex items-start justify-between gap-4 shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
              <span className="px-2.5 sm:px-3 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 text-[10px] font-mono font-black tracking-widest uppercase shadow-md">
                PITWALL PRO MEMBERSHIP
              </span>
              {isPro ? (
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold">
                  ✓ PRO 会員有効中
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 text-[10px] font-mono">
                  FREE プラン利用中 ({aiUsage.remaining}/3 回)
                </span>
              )}
            </div>
            <h2 className="text-lg sm:text-2xl font-racing font-black text-white tracking-wide flex items-center gap-2">
              <span className="text-amber-400">💎</span>
              <span>Pitwall Pro メンバーシップ</span>
            </h2>
            <p className="text-[11px] sm:text-xs text-slate-300 mt-1 leading-relaxed">
              F1レースインテリジェンス・模擬レースシミュレーター・AI無制限アクセスをフル解放。
            </p>
          </div>

          {/* Prominent Header Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-900 hover:bg-slate-800 border border-white/15 hover:border-white/30 flex items-center justify-center text-slate-400 hover:text-white text-sm transition-all cursor-pointer shrink-0 shadow-sm"
            title="閉じる (Esc)"
            aria-label="閉じる"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Content Body with min-h-0 */}
        <div className="p-4 sm:p-6 space-y-5 sm:space-y-6 overflow-y-auto flex-1 min-h-0 no-scrollbar">
          {/* Plan Duration Selector (Monthly vs Annual) */}
          <div className="space-y-3">
            <div className="text-xs font-racing font-bold text-slate-300 tracking-wider uppercase">
              プラン選択
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Annual Plan Card */}
              <div
                onClick={() => setSelectedPlan('annual')}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
                  selectedPlan === 'annual'
                    ? 'border-amber-400 bg-amber-500/10 shadow-lg shadow-amber-500/10'
                    : 'border-white/10 bg-slate-900/60 hover:border-white/20'
                }`}
              >
                <div className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-racing font-black text-[9px] shadow-sm">
                  ★ 最も人気 (2ヶ月無料)
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-racing font-bold text-sm text-white">年額プラン</span>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold">¥600お得</span>
                  </div>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-2xl sm:text-3xl font-racing font-black text-amber-300">
                      ¥{PLAN_PRICING.annual.price.toLocaleString()}
                    </span>
                    <span className="text-xs font-mono text-slate-400">/年</span>
                  </div>
                  <p className="text-[11px] font-mono text-slate-400 mt-0.5">
                    (実質 ¥{PLAN_PRICING.annual.monthlyEquivalent}/月)
                  </p>
                </div>
                <div className="mt-3 pt-3 border-t border-white/10 flex items-center gap-1.5 text-xs text-slate-300">
                  <span className="text-amber-400">✓</span>
                  <span>いつでも解約可能</span>
                </div>
              </div>

              {/* Monthly Plan Card */}
              <div
                onClick={() => setSelectedPlan('monthly')}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                  selectedPlan === 'monthly'
                    ? 'border-amber-400 bg-amber-500/10 shadow-lg shadow-amber-500/10'
                    : 'border-white/10 bg-slate-900/60 hover:border-white/20'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-racing font-bold text-sm text-white">月額プラン</span>
                    <span className="text-[10px] font-mono text-slate-400">基本プラン</span>
                  </div>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-2xl sm:text-3xl font-racing font-black text-white">
                      ¥{PLAN_PRICING.monthly.price.toLocaleString()}
                    </span>
                    <span className="text-xs font-mono text-slate-400">/月</span>
                  </div>
                  <p className="text-[11px] font-mono text-slate-400 mt-0.5">
                    毎月自動更新 (縛りなし)
                  </p>
                </div>
                <div className="mt-3 pt-3 border-t border-white/10 flex items-center gap-1.5 text-xs text-slate-300">
                  <span className="text-amber-400">✓</span>
                  <span>1ヶ月からお気軽に</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action CTA & Test Switcher */}
          <div className="space-y-4">
            {/* Primary Upgrade CTA (when Free) or Pro Active Badge (when Pro) */}
            {!isPro ? (
              <button
                type="button"
                disabled={isUpgrading}
                onClick={handleActivatePro}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:brightness-110 text-slate-950 font-racing font-black text-base shadow-xl shadow-amber-500/30 active:scale-[0.99] transition-all flex items-center justify-center gap-2 uppercase tracking-wide cursor-pointer"
              >
                {isUpgrading ? (
                  <>
                    <span className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    <span>アップグレード処理中...</span>
                  </>
                ) : (
                  <>
                    <span>💎 7日間無料トライアルでProを開始 (¥300/月)</span>
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-950/20">
                      即時アンロック
                    </span>
                  </>
                )}
              </button>
            ) : (
              <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-emerald-300 font-bold">
                  <span className="text-base">👑</span>
                  <span>現在 Pitwall Pro メンバーです（全機能無制限）</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-bold text-[10px]">
                  PRO 有効中
                </span>
              </div>
            )}

            {/* Interactive Test Switcher: Toggle between Free and Pro with 1 Click */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-cyan-500/30 shadow-lg space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm">🧪</span>
                  <span className="text-xs font-racing font-bold text-cyan-300 tracking-wide uppercase">
                    プラン切り替えテスト（開発・動作確認用）
                  </span>
                </div>
                <span className="text-[10px] font-mono text-slate-400">
                  ワンクリックで即座に権限を切替
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* Free Tier Selector */}
                <button
                  type="button"
                  onClick={handleDowngradeToFree}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-1.5 ${
                    !isPro
                      ? 'bg-cyan-950/40 border-cyan-400/80 shadow-md ring-1 ring-cyan-400/50'
                      : 'bg-slate-950/60 border-white/10 hover:border-cyan-500/40 hover:bg-slate-900/60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-racing font-bold text-slate-200 flex items-center gap-1.5">
                      <span>⚡</span>
                      <span>Free (無料プラン)</span>
                    </span>
                    {!isPro ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                        ✓ 現在適用中
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono text-cyan-400 font-bold hover:underline">
                        Freeに切り替える ➔
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 font-mono">
                    AI相談: 1日3回制限 / 鈴鹿限定10周
                  </p>
                </button>

                {/* Pro Tier Selector */}
                <button
                  type="button"
                  onClick={handleActivatePro}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-1.5 ${
                    isPro
                      ? 'bg-amber-950/30 border-amber-400/80 shadow-md ring-1 ring-amber-400/50'
                      : 'bg-slate-950/60 border-white/10 hover:border-amber-500/40 hover:bg-slate-900/60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-racing font-bold text-amber-300 flex items-center gap-1.5">
                      <span>💎</span>
                      <span>Pitwall Pro (無制限)</span>
                    </span>
                    {isPro ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                        ✓ 現在適用中
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono text-amber-400 font-bold hover:underline">
                        Proに切り替える ➔
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 font-mono">
                    AI相談: 無制限 / 全24戦53周フルGP
                  </p>
                </button>
              </div>

              {/* Free Quota Reset Option for Testing */}
              {!isPro && (
                <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] font-mono">
                  <span className="text-slate-400">
                    本日の無料AI相談: <strong className="text-amber-400">{aiUsage.remaining} / {aiUsage.max} 回</strong> 残り
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      resetDailyAiUsage();
                      setToastMessage('🔄 本日の無料AI利用回数をリセットしました（残り3回）');
                      setTimeout(() => setToastMessage(null), 3000);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer border border-white/10 flex items-center gap-1 text-[10px]"
                  >
                    <span>🔄</span>
                    <span>利用枠をリセット</span>
                  </button>
                </div>
              )}
            </div>

            <p className="text-center text-[10px] font-mono text-slate-500">
              ※ デモ環境では決済情報を入力することなく、ワンクリックでFree/Proの動作確認を行えます。
            </p>
          </div>

          {/* Feature Comparison Table */}
          <div className="space-y-3 pt-2 border-t border-white/10">
            <div className="text-xs font-racing font-bold text-slate-300 tracking-wider uppercase">
              機能比較マトリクス
            </div>
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/60 text-xs font-mono">
              <div className="grid grid-cols-12 bg-slate-900 p-3 border-b border-white/10 text-slate-400 font-bold">
                <div className="col-span-5">機能</div>
                <div className="col-span-3 text-center">Free (無料)</div>
                <div className="col-span-4 text-center text-amber-400">Pitwall Pro</div>
              </div>

              {TIER_FEATURE_COMPARISON.map((feat, idx) => (
                <div
                  key={idx}
                  className={`grid grid-cols-12 p-3 items-center border-b border-white/5 last:border-0 ${
                    feat.highlight ? 'bg-amber-500/5' : ''
                  }`}
                >
                  <div className="col-span-5 font-medium text-slate-200">{feat.featureName}</div>
                  <div className="col-span-3 text-center text-slate-400 text-[11px]">
                    {feat.freeTier}
                  </div>
                  <div className="col-span-4 text-center text-amber-300 font-bold text-[11px]">
                    {feat.proTier}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Social Proof / Security Badge */}
          <div className="p-3.5 rounded-2xl bg-slate-900/40 border border-white/5 flex items-center justify-between text-[11px] font-mono text-slate-400">
            <div className="flex items-center gap-2">
              <span>🔒 256-bit SSL 安全暗号化通信</span>
              <span>•</span>
              <span>いつでも解約可能</span>
            </div>
            <span className="text-amber-400 font-bold">P1 PADOROKU 公式</span>
          </div>
        </div>

        {/* Sticky Modal Footer: Clear Close Action & Guarantee */}
        <div className="p-3.5 sm:px-6 bg-slate-900/95 border-t border-white/10 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
            <span className="hidden sm:inline">※ Escキーまたは枠外クリックでも閉じられます</span>
            <span className="sm:hidden">いつでも解約可能</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-racing font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 active:bg-slate-600 border border-white/15 hover:border-white/30 transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
          >
            <span>✕</span>
            <span>画面を閉じる</span>
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
