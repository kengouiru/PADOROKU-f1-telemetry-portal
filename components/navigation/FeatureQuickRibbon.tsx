'use client';

import React from 'react';

interface FeatureQuickRibbonProps {
  onSelectFeature: (featureId: string) => void;
  onOpenDirectory: () => void;
  activeFeatureId?: string;
}

export default function FeatureQuickRibbon({
  onSelectFeature,
  onOpenDirectory,
  activeFeatureId,
}: FeatureQuickRibbonProps) {
  const quickChips = [
    {
      id: 'season_calendar',
      label: 'ホーム (2026日程)',
      icon: '🏠',
      highlight: true,
      tag: 'HOME',
      tagColor: 'bg-red-600 text-white',
    },
    {
      id: '2026_regulations',
      label: '2026新規定ラボ',
      icon: '🚀',
      highlight: true,
      tag: 'NEW',
      tagColor: 'bg-red-600 text-white',
    },
    {
      id: 'telemetry_delta',
      label: 'タイムデルタ(Δt)解析',
      icon: '🏁',
      highlight: true,
      tag: '2車比較',
      tagColor: 'bg-sky-600 text-white',
    },
    {
      id: 'war_room',
      label: '戦術司令室 (War Room)',
      icon: '🚨',
      highlight: true,
      tag: '天候・SC',
      tagColor: 'bg-amber-600 text-white',
    },
    {
      id: 'fod_news',
      label: 'FOD中継＆ニュース',
      icon: '📺',
      highlight: false,
      tag: '公式中継',
      tagColor: 'bg-emerald-600 text-white',
    },
    {
      id: 'quiz',
      label: '実況クイズ検定',
      icon: '🏆',
      highlight: false,
      tag: '音声演出',
      tagColor: 'bg-purple-600 text-white',
    },
  ];

  return (
    <div className="bg-slate-950/90 border-b border-white/10 px-3 py-1.5 backdrop-blur-md flex items-center justify-between gap-2 overflow-x-auto no-scrollbar shadow-sm">
      <div className="flex items-center gap-1.5 shrink-0">
        {/* All Features Guide Button */}
        <button
          type="button"
          onClick={onOpenDirectory}
          className="px-2.5 py-1 rounded-xl text-xs font-racing font-black bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-500 text-white shadow-md shadow-red-950/40 border border-red-400/40 flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
          title="全機能一覧・サイトマップとレビューガイドを開く"
        >
          <span className="text-sm">🧭</span>
          <span className="font-bold">全機能マップ</span>
          <span className="text-[9px] bg-white/20 px-1.5 py-0.2 rounded-full font-mono font-bold">
            GUIDE
          </span>
        </button>

        <span className="w-px h-4 bg-white/15 mx-0.5 hidden sm:inline-block" />
        <span className="text-[10px] font-mono text-slate-400 hidden xl:inline uppercase font-bold tracking-wider">
          クイックジャンプ:
        </span>
      </div>

      {/* Quick Jump Action Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
        {quickChips.map((chip) => {
          const isActive = activeFeatureId === chip.id;
          return (
            <button
              key={chip.id}
              type="button"
              onClick={() => onSelectFeature(chip.id)}
              className={`px-2.5 py-1 rounded-xl text-xs font-racing font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer shrink-0 border ${
                isActive
                  ? 'bg-white text-slate-950 border-white shadow-md font-black ring-1 ring-white/60'
                  : chip.highlight
                  ? 'bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white border-white/15 hover:border-white/30'
                  : 'bg-slate-950/60 hover:bg-slate-900 text-slate-400 hover:text-slate-200 border-white/5 hover:border-white/20'
              }`}
            >
              <span>{chip.icon}</span>
              <span>{chip.label}</span>
              {chip.tag && (
                <span className={`text-[8px] font-mono font-bold px-1 py-0.2 rounded ${chip.tagColor}`}>
                  {chip.tag}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
