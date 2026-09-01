'use client';

/**
 * components/hubs/NewsPaddockHub.tsx
 * Hub 2: Latest F1 News, Paddock Rumors, and Gemini AI 3-Line Smart Summarizer.
 */

import React, { useState, useEffect, useCallback } from 'react';

export interface F1NewsArticle {
  id: string;
  title: string;
  summary: string;
  link: string;
  source: string;
  pubDate: string;
  category: 'TECHNICAL' | 'PADDOCK' | 'RACE' | 'FIA';
  badgeColor: string;
}

interface NewsPaddockHubProps {
  geminiApiKey?: string;
}

export default function NewsPaddockHub({ geminiApiKey = '' }: NewsPaddockHubProps) {
  const [articles, setArticles] = useState<F1NewsArticle[]>([]);
  const [isLoadingNews, setIsLoadingNews] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // AI Summaries per article ID
  const [aiSummaries, setAiSummaries] = useState<Record<string, string>>({});
  const [loadingAiSummary, setLoadingAiSummary] = useState<Record<string, boolean>>({});

  // Fetch News from BFF API
  const fetchNews = useCallback(async () => {
    setIsLoadingNews(true);
    try {
      const res = await fetch('/api/f1-news');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setArticles(data.articles ?? []);
    } catch (e) {
      console.warn('[News Fetch Error]:', e);
    } finally {
      setIsLoadingNews(false);
    }
  }, []);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  // Generate 3-Line Smart Summary via Gemini AI
  const handleGenerateSummary = async (article: F1NewsArticle) => {
    if (loadingAiSummary[article.id] || aiSummaries[article.id]) return;

    setLoadingAiSummary((prev) => ({ ...prev, [article.id]: true }));

    try {
      const prompt = `あなたはF1のチーフレースアナリストです。
以下のF1ニュース記事（タイトル・概要）に基づき、日本のF1ファンやチームストラテジスト向けに、必ず以下の3項目フォーマットで【簡潔で鋭い3行スマート要約】を作成してください。

【記事情報】
タイトル: ${article.title}
概要: ${article.summary}
カテゴリ: ${article.category}
ソース: ${article.source}

【出力フォーマット】
・【概要】（何が発表/発生したのかを1文で）
・【戦術/技術的影響】（マシンパフォーマンス、タイヤ、戦略への影響を1文で）
・【今後の注目点】（週末のセッションや今後の展望を1文で）`;

      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (geminiApiKey) headers['x-gemini-key'] = geminiApiKey;

      const res = await fetch('/api/strategist', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          messages: [{ role: 'user', content: prompt }],
        }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let text = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          text += decoder.decode(value, { stream: true });
          setAiSummaries((prev) => ({ ...prev, [article.id]: text }));
        }
      } else {
        const json = await res.json();
        text = json.response ?? json.text ?? '';
        setAiSummaries((prev) => ({ ...prev, [article.id]: text }));
      }
    } catch (e) {
      console.warn('[News AI Summary Error]:', e);
      setAiSummaries((prev) => ({
        ...prev,
        [article.id]: '・【概要】要約の生成に失敗しました。\n・【戦術/技術的影響】時間をおいて再試行してください。\n・【今後の注目点】APIキー設定を確認してください。',
      }));
    } finally {
      setLoadingAiSummary((prev) => ({ ...prev, [article.id]: false }));
    }
  };

  const filteredNews = articles.filter((item) => {
    const matchCat = selectedCategory === 'ALL' || item.category === selectedCategory;
    const matchSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.source.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const formatRelativeTime = (iso: string) => {
    try {
      const diffMs = Date.now() - new Date(iso).getTime();
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      if (diffHours < 1) return '数十分前';
      if (diffHours < 24) return `${diffHours}時間前`;
      return `${Math.floor(diffHours / 24)}日前`;
    } catch {
      return '本日';
    }
  };

  return (
    <div className="flex flex-col gap-5 max-w-6xl mx-auto animate-fade-in">
      {/* Header Banner */}
      <div className="glass-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden">
        <div className="flex flex-col gap-1 z-10">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-xs font-racing font-bold text-emerald-400 uppercase tracking-widest">
              LIVE PADDOCK & NEWS FEED
            </span>
          </div>
          <h2 className="text-xl font-racing font-black text-white tracking-wider">
            NEWS & PADDOCK INTELLIGENCE
          </h2>
          <p className="text-xs text-slate-400 max-w-xl">
            FIA公式発表、技術アップデート、ドライバー市場のパドック動向を配信。Gemini AIによる3行スマート要約に対応。
          </p>
        </div>

        {/* Search & Refresh Actions */}
        <div className="z-10 flex items-center gap-2 w-full md:w-auto">
          <input
            type="text"
            placeholder="キーワードやチーム名で検索..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-64 bg-slate-900/80 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-400 transition-colors"
          />
          <button
            onClick={fetchNews}
            disabled={isLoadingNews}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-white/10 transition-colors flex items-center justify-center flex-shrink-0 disabled:opacity-50"
            title="ニュースを再取得"
          >
            <span className={isLoadingNews ? 'animate-spin' : ''}>🔄</span>
          </button>
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

      {/* Loading Skeleton */}
      {isLoadingNews && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="glass-card p-5 h-44 flex flex-col justify-between animate-pulse">
              <div className="space-y-2">
                <div className="w-20 h-4 bg-slate-800 rounded" />
                <div className="w-full h-5 bg-slate-800 rounded" />
                <div className="w-4/5 h-3 bg-slate-800/60 rounded" />
              </div>
              <div className="w-1/3 h-4 bg-slate-800/40 rounded" />
            </div>
          ))}
        </div>
      )}

      {/* News Grid */}
      {!isLoadingNews && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredNews.length === 0 ? (
            <div className="col-span-full glass-card p-12 text-center text-slate-500 text-xs flex flex-col items-center gap-2">
              <span className="text-3xl">📰</span>
              <span>該当するニュースが見つかりませんでした</span>
            </div>
          ) : (
            filteredNews.map((item) => (
              <div
                key={item.id}
                className="glass-card p-5 flex flex-col justify-between gap-3 hover:border-white/20 transition-all group relative overflow-hidden"
              >
                <div className="flex flex-col gap-2.5">
                  {/* Category, Source, and Date Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${item.badgeColor}`}>
                        {item.category}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {item.source}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500 font-mono">
                      {formatRelativeTime(item.pubDate)}
                    </span>
                  </div>

                  {/* Title & Summary */}
                  <h3 className="text-sm font-bold text-white group-hover:text-sky-300 transition-colors leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {item.summary}
                  </p>

                  {/* AI 3-Line Smart Summary Block (if generated) */}
                  {aiSummaries[item.id] && (
                    <div className="bg-purple-950/40 border border-purple-500/30 rounded-xl p-3 text-xs text-purple-200 mt-1 animate-fade-in flex flex-col gap-1.5 shadow-inner">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-purple-300 uppercase tracking-wider flex items-center gap-1">
                          <span>✨</span>
                          <span>AI 3行スマート要約</span>
                        </span>
                        <span className="text-[9px] text-purple-400/80 font-mono">Gemini 3.5</span>
                      </div>
                      <div className="space-y-1 text-[11px] text-slate-200 leading-relaxed whitespace-pre-wrap font-sans">
                        {aiSummaries[item.id]}
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Action Buttons */}
                <div className="flex items-center justify-between pt-3 border-t border-white/5 text-xs">
                  {/* AI Summarize Button */}
                  {!aiSummaries[item.id] ? (
                    <button
                      onClick={() => handleGenerateSummary(item)}
                      disabled={loadingAiSummary[item.id]}
                      className="py-1 px-2.5 rounded-lg bg-purple-900/40 hover:bg-purple-900/60 border border-purple-500/30 text-purple-200 text-[11px] font-medium flex items-center gap-1.5 transition-all disabled:opacity-50"
                    >
                      {loadingAiSummary[item.id] ? (
                        <>
                          <span className="w-2.5 h-2.5 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
                          <span>AI要約中...</span>
                        </>
                      ) : (
                        <>
                          <span>✨</span>
                          <span>AIで3行要約</span>
                        </>
                      )}
                    </button>
                  ) : (
                    <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                      <span>✓</span>
                      <span>要約展開中</span>
                    </span>
                  )}

                  {/* External Read Original Article Link */}
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sky-400 hover:text-sky-300 text-xs font-medium flex items-center gap-1 group-hover:translate-x-0.5 transition-transform ml-auto"
                  >
                    <span>元記事を読む</span>
                    <span>↗</span>
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
