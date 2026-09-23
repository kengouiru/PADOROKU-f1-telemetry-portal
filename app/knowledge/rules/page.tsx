'use client';

/**
 * app/knowledge/rules/page.tsx
 * Dedicated Standalone Page for FIA Formula 1 Official Regulations & Rules Hub
 * Covers Sporting Regulations, Technical Regulations, 2026 Next-Gen Engine/Aero,
 * and Driving Standards & Stewards Guidelines.
 */

import React from 'react';
import { useRouter } from 'next/navigation';
import F1RegulationsHub from '@/components/hubs/F1RegulationsHub';

export default function RegulationsRulesPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-3 sm:p-6 flex flex-col">
      <div className="w-full max-w-[1800px] mx-auto space-y-4 animate-fade-in pb-16">
        {/* Top Navigation Bar: Solid Flush Sticky Top Navigation Bar */}
        <div className="sticky top-0 z-50 bg-slate-950 border-b border-white/15 px-3 sm:px-6 py-2.5 shadow-2xl flex items-center justify-between gap-3 mb-4 rounded-b-2xl">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => {
                if (typeof window !== 'undefined' && window.opener) {
                  window.close();
                } else {
                  router.push('/?hub=knowledge');
                }
              }}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-racing font-bold text-xs sm:text-sm flex items-center gap-1.5 border border-white/10 transition-all cursor-pointer shadow hover:scale-105 shrink-0"
              title="百科事典トップへ戻る"
            >
              <span>◀</span>
              <span>百科事典へ戻る</span>
            </button>
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400 font-mono truncate">
              <span>F1 百科事典</span>
              <span>&gt;</span>
              <span className="text-white font-bold">🏛️ レギュレーション・公式規則</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                window.open('/knowledge/rules', '_blank', 'width=1280,height=900,menubar=no,toolbar=no');
              }}
              className="px-2.5 py-1 rounded-xl bg-sky-950/70 hover:bg-sky-900 border border-sky-500/40 text-sky-300 hover:text-white text-xs font-racing flex items-center gap-1 transition-all cursor-pointer shadow-sm hover:scale-105"
              title="このページを別ウィンドウで開く"
            >
              <span>別ウィンドウで開く</span>
              <span>↗</span>
            </button>
          </div>
        </div>

        {/* Regulations Hub Body */}
        <div className="glass-card bg-slate-950/95 border border-white/15 p-4 sm:p-6 rounded-3xl shadow-2xl">
          <F1RegulationsHub onNavigateToTab={(tab) => router.push(`/?hub=${tab}`)} />
        </div>
      </div>
    </div>
  );
}
