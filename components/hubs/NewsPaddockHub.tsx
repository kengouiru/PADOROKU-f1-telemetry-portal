'use client';

/**
 * components/hubs/NewsPaddockHub.tsx
 * Hub 2: Latest F1 News, Paddock Rumors, and FIA Bulletins.
 */

import React, { useState } from 'react';

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  category: 'RACE' | 'TECHNICAL' | 'PADDOCK' | 'FIA';
  date: string;
  readTime: string;
  badgeColor: string;
}

const MOCK_NEWS: NewsItem[] = [
  {
    id: 'news-1',
    title: 'レッドブル、次戦に向けたフロアアップデートの投入を決定 — ダウンフォース向上へ',
    summary: '高速コーナーでの安定性向上を目指し、アンダーフロア前端のベンチュリトンネル形状とエッジウィングの気流制御を改良した新型パッケージを投入予定。',
    category: 'TECHNICAL',
    date: '2時間前',
    readTime: '3分で読める',
    badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  },
  {
    id: 'news-2',
    title: 'フェラーリ、タイヤデグラデーション改善に向けサスペンションジオメトリを再評価',
    summary: 'ロングランにおけるリアタイヤのオーバーヒートを抑制するため、リアサスペンションのキネマティクス設定を見直す作業が進められている。',
    category: 'TECHNICAL',
    date: '4時間前',
    readTime: '4分で読める',
    badgeColor: 'bg-red-500/20 text-red-300 border-red-500/30',
  },
  {
    id: 'news-3',
    title: 'パドック速報：2025年ドライバー移籍市場の最新動向とシート争い',
    summary: '複数チームで契約更新と移籍をめぐる水面下の交渉が本格化。若手ドライバーの昇格シナリオとベテランの去就が注目を集める。',
    category: 'PADDOCK',
    date: '6時間前',
    readTime: '5分で読める',
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  },
  {
    id: 'news-4',
    title: 'FIA、トラックリミット監視システムの高精度AIカメラを今週末より試験導入',
    summary: 'ターン出口での白線踏み越え判定を自動化する高解像度コンピュータビジョンシステムを導入し、審理時間を大幅に短縮する方針を発表。',
    category: 'FIA',
    date: '1日前',
    readTime: '2分で読める',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  },
  {
    id: 'news-5',
    title: '週末のグランプリ決勝展望：2ストップ対1ストップの戦略分岐点',
    summary: '路面温度の低下が予想されるナイトセッションにおいて、ハードタイヤのウォームアップとアンダーカット効果が勝敗の鍵を握る。',
    category: 'RACE',
    date: '1日前',
    readTime: '4分で読める',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  },
];

export default function NewsPaddockHub() {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredNews = MOCK_NEWS.filter((item) => {
    const matchCat = selectedCategory === 'ALL' || item.category === selectedCategory;
    const matchSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="flex flex-col gap-5 max-w-6xl mx-auto animate-fade-in">
      {/* Header Banner */}
      <div className="glass-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden">
        <div className="flex flex-col gap-1 z-10">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-xs font-racing font-bold text-emerald-400 uppercase tracking-widest">
              LIVE PADDOCK FEED
            </span>
          </div>
          <h2 className="text-xl font-racing font-black text-white tracking-wider">
            NEWS & PADDOCK INTELLIGENCE
          </h2>
          <p className="text-xs text-slate-400 max-w-xl">
            FIA公式リリース、各チームの技術アップデート、ドライバーコメント、パドックの最新動向をリアルタイム配信。
          </p>
        </div>

        {/* Search Input */}
        <div className="z-10 w-full md:w-72">
          <input
            type="text"
            placeholder="キーワードでニュースを検索..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900/80 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-400 transition-colors"
          />
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          ['ALL', 'すべてのニュース'],
          ['TECHNICAL', '🔧 テクニカル / 開発'],
          ['RACE', '🏁 レース戦略 / 展望'],
          ['PADDOCK', '🎙️ パドック速報'],
          ['FIA', '📋 FIA公式裁定'],
        ].map(([cat, label]) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all flex-shrink-0 border ${
              selectedCategory === cat
                ? 'bg-blue-600 text-white border-blue-400 font-bold shadow-md'
                : 'bg-slate-900/60 border-white/10 text-slate-400 hover:text-white hover:border-white/20'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* News Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredNews.map((item) => (
          <div
            key={item.id}
            className="glass-card p-5 flex flex-col justify-between gap-3 hover:border-white/20 transition-all group"
          >
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${item.badgeColor}`}>
                  {item.category}
                </span>
                <span className="text-[11px] text-slate-500 font-mono">{item.date}</span>
              </div>
              <h3 className="text-sm font-bold text-white group-hover:text-sky-300 transition-colors leading-snug">
                {item.title}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {item.summary}
              </p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-white/5 text-[11px] text-slate-500">
              <span>⏱️ {item.readTime}</span>
              <span className="text-sky-400 group-hover:translate-x-0.5 transition-transform flex items-center gap-1 font-medium">
                <span>続きを読む</span>
                <span>➔</span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
