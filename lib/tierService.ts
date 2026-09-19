'use client';

/**
 * lib/tierService.ts
 * Membership & Plan Tier Management Service (Free vs Pitwall Pro)
 * Controls user tier status, daily AI query quotas, and feature gating.
 */

import { useState, useEffect, useCallback } from 'react';

export type PlanTier = 'free' | 'pro';

export type TierFeatureId =
  | 'ai_unlimited'
  | 'virtual_gp_full'
  | 'telemetry_popout'
  | 'pro_quiz_archive'
  | 'ad_free';

export interface PlanPricing {
  id: 'monthly' | 'annual';
  name: string;
  price: number;
  period: string;
  monthlyEquivalent: number;
  discountText?: string;
  isPopular?: boolean;
}

export const PLAN_PRICING: Record<string, PlanPricing> = {
  monthly: {
    id: 'monthly',
    name: '月額プラン',
    price: 300,
    period: '月',
    monthlyEquivalent: 300,
  },
  annual: {
    id: 'annual',
    name: '年額プラン (2ヶ月無料)',
    price: 3000,
    period: '年',
    monthlyEquivalent: 250,
    discountText: '実質 2ヶ月無料 (¥600 お得)',
    isPopular: true,
  },
};

export interface TierFeatureComparison {
  featureName: string;
  freeTier: string;
  proTier: string;
  highlight?: boolean;
}

export const TIER_FEATURE_COMPARISON: TierFeatureComparison[] = [
  {
    featureName: 'AIストラテジスト相談',
    freeTier: '1日 3回まで',
    proTier: '無制限 (PRO UNLIMITED)',
    highlight: true,
  },
  {
    featureName: '模擬レースシミュレーター Pro',
    freeTier: '鈴鹿限定・10周体験版・3台',
    proTier: '全24戦・53周フルGP・全台・天候/SC/作戦無制限',
    highlight: true,
  },
  {
    featureName: 'F1クイズ検定＆アーカイブ',
    freeTier: '初級〜中級 (デイリー)',
    proTier: '全148問・マニアック難易度・解説全開放',
  },
  {
    featureName: '広告表示 & ファン特典',
    freeTier: 'FODスポンサー広告枠あり',
    proTier: '完全非表示 (Clean F1 Experience) + チーム推しゴールドバッジ',
    highlight: true,
  },
];

const STORAGE_TIER_KEY = 'f1_padoroku_user_tier';
const STORAGE_AI_QUOTA_KEY_PREFIX = 'f1_padoroku_ai_quota_';
export const FREE_DAILY_AI_LIMIT = 3;

function getTodayDateString(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

export function getUserTier(): PlanTier {
  if (typeof window === 'undefined') return 'free';
  try {
    const saved = localStorage.getItem(STORAGE_TIER_KEY);
    if (saved === 'pro') return 'pro';
    return 'free';
  } catch {
    return 'free';
  }
}

export function setUserTier(tier: PlanTier): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_TIER_KEY, tier);
    window.dispatchEvent(new CustomEvent('f1_tier_changed', { detail: { tier } }));
  } catch (e) {
    console.error('[TierService] Failed to set tier:', e);
  }
}

export function getDailyAiUsage(): { used: number; max: number; remaining: number; isUnlimited: boolean } {
  const tier = getUserTier();
  if (tier === 'pro') {
    return { used: 0, max: Infinity, remaining: Infinity, isUnlimited: true };
  }

  if (typeof window === 'undefined') {
    return { used: 0, max: FREE_DAILY_AI_LIMIT, remaining: FREE_DAILY_AI_LIMIT, isUnlimited: false };
  }

  try {
    const key = `${STORAGE_AI_QUOTA_KEY_PREFIX}${getTodayDateString()}`;
    const used = parseInt(localStorage.getItem(key) || '0', 10);
    const remaining = Math.max(0, FREE_DAILY_AI_LIMIT - used);
    return {
      used,
      max: FREE_DAILY_AI_LIMIT,
      remaining,
      isUnlimited: false,
    };
  } catch {
    return { used: 0, max: FREE_DAILY_AI_LIMIT, remaining: FREE_DAILY_AI_LIMIT, isUnlimited: false };
  }
}

export function consumeAiQuery(): boolean {
  const tier = getUserTier();
  if (tier === 'pro') return true;

  if (typeof window === 'undefined') return true;

  try {
    const key = `${STORAGE_AI_QUOTA_KEY_PREFIX}${getTodayDateString()}`;
    const current = parseInt(localStorage.getItem(key) || '0', 10);
    if (current >= FREE_DAILY_AI_LIMIT) {
      return false;
    }
    localStorage.setItem(key, String(current + 1));
    window.dispatchEvent(new CustomEvent('f1_ai_quota_updated', { detail: { used: current + 1 } }));
    return true;
  } catch {
    return true;
  }
}

export function resetDailyAiUsage(): void {
  if (typeof window === 'undefined') return;
  try {
    const key = `${STORAGE_AI_QUOTA_KEY_PREFIX}${getTodayDateString()}`;
    localStorage.removeItem(key);
    window.dispatchEvent(new CustomEvent('f1_ai_quota_updated', { detail: { used: 0 } }));
  } catch (e) {
    console.error('[TierService] Reset failed:', e);
  }
}

export function isFeatureAllowed(feature: TierFeatureId): boolean {
  const tier = getUserTier();
  if (tier === 'pro') return true;

  switch (feature) {
    case 'ai_unlimited':
    case 'virtual_gp_full':
    case 'pro_quiz_archive':
    case 'ad_free':
      return false;
    case 'telemetry_popout':
      return true; // Completely free for all users
    default:
      return true;
  }
}

export function usePlanTier() {
  const [tier, setTierState] = useState<PlanTier>('free');
  const [aiUsage, setAiUsage] = useState({
    used: 0,
    max: FREE_DAILY_AI_LIMIT,
    remaining: FREE_DAILY_AI_LIMIT,
    isUnlimited: false,
  });

  useEffect(() => {
    setTierState(getUserTier());
    setAiUsage(getDailyAiUsage());

    const handleTierChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ tier: PlanTier }>;
      const newTier = customEvent.detail?.tier || getUserTier();
      setTierState(newTier);
      setAiUsage(getDailyAiUsage());
    };

    const handleQuotaUpdate = () => {
      setAiUsage(getDailyAiUsage());
    };

    window.addEventListener('f1_tier_changed', handleTierChange);
    window.addEventListener('f1_ai_quota_updated', handleQuotaUpdate);
    window.addEventListener('storage', handleQuotaUpdate);

    return () => {
      window.removeEventListener('f1_tier_changed', handleTierChange);
      window.removeEventListener('f1_ai_quota_updated', handleQuotaUpdate);
      window.removeEventListener('storage', handleQuotaUpdate);
    };
  }, []);

  const changeTier = useCallback((newTier: PlanTier) => {
    setUserTier(newTier);
    setTierState(newTier);
    setAiUsage(getDailyAiUsage());
  }, []);

  return {
    tier,
    isPro: tier === 'pro',
    aiUsage,
    changeTier,
    consumeAi: consumeAiQuery,
    isFeatureAllowed,
  };
}
