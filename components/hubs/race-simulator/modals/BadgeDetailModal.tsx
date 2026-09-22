'use client';

import React from 'react';
import { XCircle } from 'lucide-react';
import type { F1Badge } from '@/lib/raceDebriefAnalysis';

interface BadgeDetailModalProps {
  badge: F1Badge | null;
  onClose: () => void;
}

export const BadgeDetailModal: React.FC<BadgeDetailModalProps> = ({ badge, onClose }) => {
  if (!badge) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="max-w-md w-full glass-card-premium p-5 rounded-3xl border-2 border-amber-500/60 shadow-2xl space-y-3.5">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-white/20 flex items-center justify-center text-2xl shadow-md">
              {badge.icon}
            </div>
            <div>
              <span className="px-2 py-0.5 rounded bg-amber-950 border border-amber-500/40 text-[10px] font-mono text-amber-300">
                {badge.categoryLabel} • {badge.rarity}
              </span>
              <h3 className="font-racing font-bold text-white text-base mt-1">
                {badge.name}
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10"
          >
            <XCircle className="w-5 h-5" />
          </button>
        </div>

        {/* Quote Box */}
        <div className="p-3 rounded-2xl bg-black/60 border border-amber-500/30 text-xs">
          <div className="text-amber-300 font-racing font-bold italic">
            {badge.historicalQuote}
          </div>
        </div>

        {/* Lore Box */}
        <div className="space-y-1 text-xs">
          <div className="font-racing font-bold text-slate-300">📖 歴史的背景・エピソード:</div>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            {badge.lore}
          </p>
        </div>

        {/* Unlock condition */}
        <div className="p-3 rounded-2xl bg-slate-900 border border-white/10 space-y-1 text-xs">
          <div className="font-racing font-bold text-slate-400">🎯 アンロック獲得条件:</div>
          <p className="text-white text-[11px] font-mono">
            {badge.unlockConditionText}
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="btn-console w-full py-2 text-xs font-racing font-bold text-white text-center"
        >
          閉じる
        </button>
      </div>
    </div>
  );
};
