'use client';

/**
 * components/hubs/NewsPaddockHub.tsx
 * Hub 2: Latest F1 News with Detailed Topic / Team / Driver Tag Filtering and Gemini AI 3-Line Summarizer.
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import type { F1NewsArticle, TeamTag, TopicTag } from '@/app/api/f1-news/route';

interface NewsPaddockHubProps {
  geminiApiKey?: string;
}

const TOPIC_ICONS: Record<TopicTag, { label: string; icon: string }> = {
  Aero: { label: '空力 (Aero)', icon: '💨' },
  PU: { label: 'パワーユニット (PU)', icon: '⚡' },
  Tyre: { label: 'タイヤ (Tyre)', icon: '🛞' },
  Strategy: { label: 'ピット戦略 (Strategy)', icon: '⏱️' },
  Contract: { label: '移籍/契約 (Contract)', icon: '🔄' },
  FIA: { label: 'FIA公式 (FIA)', icon: '⚖️' },
};

export default function NewsPaddockHub({ geminiApiKey = '' }: NewsPaddockHubProps) {
  const [articles, setArticles] = useState<F1NewsArticle[]>([]);
  const [isLoadingNews, setIsLoadingNews] = useState<boolean>(true);

  // Filters
  const [selectedTopic, setSelectedTopic] = useState<string>('ALL');
  const [selectedTeam, setSelectedTeam] = useState<string>('ALL');
  const [selectedDriver, setSelectedDriver] = useState<string>('ALL');
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
以下のF1ニュース記事（タイトル・概要・タグ）に基づき、日本のF1ファンやチームストラテジスト向けに、必ず以下の3項目フォーマットで【簡潔で鋭い3行スマート要約】を作成してください。

【記事情報】
タイトル: ${article.title}
概要: ${article.summary}
カテゴリ: ${article.category}
トピック: ${article.topics?.join(', ') ?? 'N/A'}
関連チーム: ${article.teams?.map((t) => t.name).join(', ') ?? 'なし'}
関連ドライバー: ${article.drivers?.join(', ') ?? 'なし'}
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

  // Reset all active filters
  const handleResetFilters = () => {
    setSelectedTopic('ALL');
    setSelectedTeam('ALL');
    setSelectedDriver('ALL');
    setSearchQuery('');
  };

  const hasActiveFilter =
    selectedTopic !== 'ALL' || selectedTeam !== 'ALL' || selectedDriver !== 'ALL' || searchQuery !== '';

  // Filtered Articles
  const filteredNews = useMemo(() => {
    return articles.filter((item) => {
      // Topic match
      const matchTopic =
        selectedTopic === 'ALL' || (item.topics && item.topics.includes(selectedTopic as TopicTag));

      // Team match
      const matchTeam =
        selectedTeam === 'ALL' || (item.teams && item.teams.some((t) => t.name === selectedTeam));

      // Driver match
      const matchDriver =
        selectedDriver === 'ALL' || (item.drivers && item.drivers.includes(selectedDriver));

      // Search text match
      const q = searchQuery.toLowerCase();
      const matchSearch =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.summary.toLowerCase().includes(q) ||
        item.source.toLowerCase().includes(q) ||
        (item.teams && item.teams.some((t) => t.name.toLowerCase().includes(q))) ||
        (item.drivers && item.drivers.some((d) => d.toLowerCase().includes(q)));

      return matchTopic && matchTeam && matchDriver && matchSearch;
    });
  }, [articles, selectedTopic, selectedTeam, selectedDriver, searchQuery]);

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
              LIVE PADDOCK & NEWS INTELLIGENCE
            </span>
          </div>
          <h2 className="text-xl font-racing font-black text-white tracking-wider">
            NEWS & PADDOCK INTELLIGENCE
          </h2>
          <p className="text-xs text-slate-400 max-w-xl">
            技術・空力・PU・タイヤ・移籍市場の詳細タグで即時フィルタリング。Gemini AIによる3行スマート要約に対応。
          </p>
        </div>

        {/* Search & Refresh Actions */}
        <div className="z-10 flex items-center gap-2 w-full md:w-auto">
          <input
            type="text"
            placeholder="キーワード・チーム・選手名..."
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

      {/* Detailed Topic Filter Pills */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-racing font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <span>🏷️</span>
            <span>TOPIC CATEGORIES</span>
          </span>

          {hasActiveFilter && (
            <button
              onClick={handleResetFilters}
              className="text-[11px] text-sky-400 hover:text-sky-300 font-medium flex items-center gap-1 transition-colors"
            >
              <span>✕</span>
              <span>フィルターをクリア</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setSelectedTopic('ALL')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all flex-shrink-0 border ${
              selectedTopic === 'ALL'
                ? 'bg-blue-600 text-white border-blue-400 font-bold shadow-md'
                : 'bg-slate-900/60 border-white/10 text-slate-400 hover:text-white hover:border-white/20'
            }`}
          >
            すべてのトピック
          </button>

          {(Object.keys(TOPIC_ICONS) as TopicTag[]).map((topic) => {
            const info = TOPIC_ICONS[topic];
            const isSelected = selectedTopic === topic;
            return (
              <button
                key={topic}
                onClick={() => setSelectedTopic(isSelected ? 'ALL' : topic)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex-shrink-0 border flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-sky-600 text-white border-sky-400 font-bold shadow-md'
                    : 'bg-slate-900/60 border-white/10 text-slate-300 hover:text-white hover:border-white/20'
                }`}
              >
                <span>{info.icon}</span>
                <span>{info.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Filter Chips (if team or driver is selected) */}
      {(selectedTeam !== 'ALL' || selectedDriver !== 'ALL') && (
        <div className="flex items-center gap-2 bg-slate-950/60 p-2 rounded-xl border border-white/10 text-xs">
          <span className="text-slate-500 font-mono text-[11px]">絞り込み中:</span>
          {selectedTeam !== 'ALL' && (
            <span className="bg-slate-800 text-white px-2 py-0.5 rounded-md border border-white/10 flex items-center gap-1 font-bold">
              <span>🏎️ {selectedTeam}</span>
              <button
                onClick={() => setSelectedTeam('ALL')}
                className="hover:text-red-400 ml-1 text-slate-400"
              >
                ✕
              </button>
            </span>
          )}
          {selectedDriver !== 'ALL' && (
            <span className="bg-slate-800 text-sky-300 px-2 py-0.5 rounded-md border border-sky-500/30 flex items-center gap-1 font-mono font-bold">
              <span>👤 {selectedDriver}</span>
              <button
                onClick={() => setSelectedDriver('ALL')}
                className="hover:text-red-400 ml-1 text-slate-400"
              >
                ✕
              </button>
            </span>
          )}
        </div>
      )}

      {/* Loading Skeleton */}
      {isLoadingNews && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="glass-card p-5 h-48 flex flex-col justify-between animate-pulse">
              <div className="space-y-2">
                <div className="w-24 h-4 bg-slate-800 rounded" />
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
            <div className="col-span-full glass-card p-12 text-center text-slate-500 text-xs flex flex-col items-center gap-3">
              <span className="text-3xl">📰</span>
              <span>選択したフィルターに該当するニュースが見つかりませんでした</span>
              <button
                onClick={handleResetFilters}
                className="mt-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-sky-400 rounded-lg text-xs font-medium border border-white/10"
              >
                フィルターをクリアして全件表示
              </button>
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
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${item.badgeColor}`}>
                        {item.category}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {item.source}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500 font-mono flex-shrink-0">
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

                  {/* Multi-Tags Row (Topics + Team Badges + Driver Badges) */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    {/* Topic Tags */}
                    {item.topics?.map((topic) => {
                      const info = TOPIC_ICONS[topic] ?? { label: topic, icon: '🏷️' };
                      const isActive = selectedTopic === topic;
                      return (
                        <button
                          key={topic}
                          onClick={() => setSelectedTopic(isActive ? 'ALL' : topic)}
                          className={`px-2 py-0.5 rounded-md text-[10px] font-medium border transition-all flex items-center gap-1 ${
                            isActive
                              ? 'bg-sky-500/30 text-sky-200 border-sky-400 font-bold'
                              : 'bg-slate-900/80 text-slate-300 border-white/10 hover:border-white/30'
                          }`}
                          title={`${info.label} で絞り込み`}
                        >
                          <span>{info.icon}</span>
                          <span>{topic}</span>
                        </button>
                      );
                    })}

                    {/* Team Badges */}
                    {item.teams?.map((team) => {
                      const isActive = selectedTeam === team.name;
                      return (
                        <button
                          key={team.name}
                          onClick={() => setSelectedTeam(isActive ? 'ALL' : team.name)}
                          className={`px-2 py-0.5 rounded-md text-[10px] font-bold border transition-all ${
                            isActive
                              ? 'ring-1 ring-white'
                              : 'hover:opacity-90'
                          }`}
                          style={{
                            color: team.color,
                            backgroundColor: team.bgColor,
                            borderColor: team.borderColor,
                          }}
                          title={`チーム: ${team.name} で絞り込み`}
                        >
                          🏎️ {team.name}
                        </button>
                      );
                    })}

                    {/* Driver Badges */}
                    {item.drivers?.map((drv) => {
                      const isActive = selectedDriver === drv;
                      return (
                        <button
                          key={drv}
                          onClick={() => setSelectedDriver(isActive ? 'ALL' : drv)}
                          className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold border transition-all ${
                            isActive
                              ? 'bg-sky-500/40 text-white border-sky-300 ring-1 ring-sky-400'
                              : 'bg-slate-900/90 text-sky-300 border-sky-500/30 hover:bg-slate-800'
                          }`}
                          title={`ドライバー: ${drv} で絞り込み`}
                        >
                          👤 {drv}
                        </button>
                      );
                    })}
                  </div>

                  {/* AI 3-Line Smart Summary Block (if generated) */}
                  {aiSummaries[item.id] && (
                    <div className="bg-purple-950/40 border border-purple-500/30 rounded-xl p-3 text-xs text-purple-200 mt-1.5 animate-fade-in flex flex-col gap-1.5 shadow-inner">
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
