'use client';

/**
 * components/subscription/PitwallProModal.tsx
 * Pitwall Pro Subscription & Tier Upgrade Presentation Modal.
 * Offers monthly/annual options, feature comparison matrix,
 * and one-click simulated trial activation.
 */

import React, { useState } from 'react';
import {
  usePlanTier,
  PLAN_PRICING,
  TIER_FEATURE_COMPARISON,
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

  if (!isOpen) return null;

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
    setToastMessage('フリープランに変更しました。');
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-racing font-bold text-sm shadow-2xl animate-bounce">
          {toastMessage}
        </div>
      )}

      <div className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto bg-slate-950 rounded-3xl border border-amber-500/40 shadow-2xl shadow-amber-500/20 text-white flex flex-col">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-slate-900/80 hover:bg-slate-800 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          ✕
        </button>

        {/* Modal Header */}
        <div className="p-6 pb-4 bg-gradient-to-b from-amber-950/40 via-slate-900/80 to-slate-950 border-b border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 text-[10px] font-mono font-black tracking-widest uppercase shadow-md">
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
          <h2 className="text-2xl sm:text-3xl font-racing font-black text-white tracking-wide flex items-center gap-2">
            <span className="text-amber-400">💎</span>
            <span>Pitwall Pro メンバーシップ</span>
          </h2>
          <p className="text-xs text-slate-300 mt-1 leading-relaxed">
            ワンコイン（月額300円）でF1レースインテリジェンス・模擬レースシミュレーター・AI無制限アクセスをフル解放。
          </p>
        </div>

        {/* Plan Pricing Toggle */}
        <div className="p-6 space-y-6">
          {/* Plan Selector Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Annual */}
            <div
              onClick={() => setSelectedPlan('annual')}
              className={`relative p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                selectedPlan === 'annual'
                  ? 'bg-amber-950/30 border-amber-400 shadow-lg shadow-amber-500/20 ring-1 ring-amber-400/40'
                  : 'bg-slate-900/60 border-white/10 hover:border-white/25'
              }`}
            >
              <div className="absolute -top-3 right-3 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-red-500 text-slate-950 text-[10px] font-racing font-black uppercase">
                一番人気 ★ 2ヶ月無料
              </div>
              <div className="text-xs font-racing font-bold text-amber-300">
                {PLAN_PRICING.annual.name}
              </div>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl font-racing font-black text-white">¥3,000</span>
                <span className="text-xs text-slate-400 font-mono">/ 年</span>
              </div>
              <div className="text-[11px] text-emerald-400 font-mono mt-1 font-bold">
                月額換算 ¥250 / 月 (¥600 お得)
              </div>
            </div>

            {/* Monthly */}
            <div
              onClick={() => setSelectedPlan('monthly')}
              className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                selectedPlan === 'monthly'
                  ? 'bg-amber-950/30 border-amber-400 shadow-lg shadow-amber-500/20 ring-1 ring-amber-400/40'
                  : 'bg-slate-900/60 border-white/10 hover:border-white/25'
              }`}
            >
              <div className="text-xs font-racing font-bold text-slate-300">
                {PLAN_PRICING.monthly.name}
              </div>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl font-racing font-black text-white">¥300</span>
                <span className="text-xs text-slate-400 font-mono">/ 月</span>
              </div>
              <div className="text-[11px] text-slate-400 font-mono mt-1">
                いつでも解約可能 (缶コーヒー2本分)
              </div>
            </div>
          </div>

          {/* Action CTA Button */}
          <div>
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
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-xs">
                <div className="flex items-center gap-2 text-emerald-300 font-bold">
                  <span>👑 現在 Pitwall Pro メンバーです（全機能無制限）</span>
                </div>
                <button
                  type="button"
                  onClick={handleDowngradeToFree}
                  className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white font-mono transition-colors cursor-pointer"
                >
                  Freeへ戻す (テスト用)
                </button>
              </div>
            )}
            <p className="text-center text-[10px] font-mono text-slate-500 mt-2">
              ※ デモ環境では決済情報を入力することなく、ワンクリックでPro体験をお試しいただけます。
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
      </div>
    </div>
  );
}
