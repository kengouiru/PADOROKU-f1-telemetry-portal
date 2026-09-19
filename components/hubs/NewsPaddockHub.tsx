'use client';

/**
 * components/hubs/NewsPaddockHub.tsx
 * Hub 2: Latest F1 News with Detailed Topic / Team / Driver Tag Filtering,
 * FOD / Fuji TV NEXT Domestic Official Broadcast Timetable,
 * Primary Source Authority Badges, and Generation Backup Integration.
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import type { F1NewsArticle, TeamTag, TopicTag, NewsAuthorityLevel } from '@/app/api/f1-news/route';
import { SEASON_2026_CALENDAR, getNextUpcomingRound, type RaceWeekendSchedule } from '@/data/f1SeasonData';
import { getGeminiAuthHeaders } from '@/lib/apiKeyService';

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

const AUTHORITY_CONFIG: Record<
  NewsAuthorityLevel,
  { label: string; icon: string; badgeClass: string; desc: string }
> = {
  FIA_OFFICIAL: {
    label: 'FIA公式発表',
    icon: '👑',
    badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/40 ring-1 ring-amber-500/20',
    desc: 'FIA世界モータースポーツ評議会・競技規則一次文書',
  },
  CONSTRUCTOR_OFFICIAL: {
    label: 'チーム公式プレス',
    icon: '🏎️',
    badgeClass: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
    desc: 'コンストラクター公式リリース・首脳陣声明',
  },
  BROADCAST_PRIMARY: {
    label: 'FOD/国際中継一次情報',
    icon: '📺',
    badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 ring-1 ring-emerald-500/20',
    desc: '国内公式中継FOD / フジテレビNEXT / F1 TV Pro速報',
  },
  PADDOCK_INTEL: {
    label: 'パドック現地速報',
    icon: '📰',
    badgeClass: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    desc: '現地特派ジャーナリスト取材・関係者証言',
  },
};

export default function NewsPaddockHub({ geminiApiKey = '' }: NewsPaddockHubProps) {
  const [articles, setArticles] = useState<F1NewsArticle[]>([]);
  const [isLoadingNews, setIsLoadingNews] = useState<boolean>(true);

  // Filters
  const [selectedTopic, setSelectedTopic] = useState<string>('ALL');
  const [selectedAuthority, setSelectedAuthority] = useState<string>('ALL');
  const [selectedTeam, setSelectedTeam] = useState<string>('ALL');
  const [selectedDriver, setSelectedDriver] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);

  // AI Summaries per article ID
  const [aiSummaries, setAiSummaries] = useState<Record<string, string>>({});
  const [loadingAiSummary, setLoadingAiSummary] = useState<Record<string, boolean>>({});

  // Active Calendar (starts with fallback, upgraded via /api/f1-calendar)
  const [calendar, setCalendar] = useState<RaceWeekendSchedule[]>(SEASON_2026_CALENDAR);

  // Fetch official calendar from API to ensure exact synchronization with SeasonHub
  useEffect(() => {
    let cancelled = false;
    async function loadOfficialCalendar() {
      try {
        const res = await fetch('/api/f1-calendar?year=2026', {
          signal: AbortSignal.timeout(8000),
        });
        if (res.ok) {
          const data = await res.json();
          if (!cancelled && data.races && data.races.length > 0) {
            setCalendar(data.races);
          }
        }
      } catch (e) {
        // Fallback to static SEASON_2026_CALENDAR
      }
    }
    loadOfficialCalendar();
    return () => { cancelled = true; };
  }, []);

  // Upcoming Grand Prix for Broadcaster Timetable
  const upcomingRound = useMemo(() => {
    const roundNum = getNextUpcomingRound(calendar);
    return calendar.find((r) => r.round === roundNum) || calendar[0];
  }, [calendar]);

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
以下のF1ニュース記事（タイトル・概要・タグ）に基づき、国内F1ファンやチームストラテジスト向けに、必ず以下の3項目フォーマットで【簡潔で鋭い3行スマート要約】を作成してください。国内中継基準はFOD / フジテレビNEXTに準拠してください。

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
・【今後の注目点】（週末のセッションや中継での着目点を1文で）`;

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...getGeminiAuthHeaders(),
      };

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
    setSelectedAuthority('ALL');
    setSelectedTeam('ALL');
    setSelectedDriver('ALL');
    setSearchQuery('');
  };

  const hasActiveFilter =
    selectedTopic !== 'ALL' ||
    selectedAuthority !== 'ALL' ||
    selectedTeam !== 'ALL' ||
    selectedDriver !== 'ALL' ||
    searchQuery !== '';

  const activeFilterCount =
    (selectedAuthority !== 'ALL' ? 1 : 0) +
    (selectedTopic !== 'ALL' ? 1 : 0);

  // Filtered Articles
  const filteredNews = useMemo(() => {
    return articles.filter((item) => {
      // Topic match
      const matchTopic =
        selectedTopic === 'ALL' || (item.topics && item.topics.includes(selectedTopic as TopicTag));

      // Authority match
      const auth = item.authorityLevel || 'PADDOCK_INTEL';
      const matchAuthority = selectedAuthority === 'ALL' || auth === selectedAuthority;

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

      return matchTopic && matchAuthority && matchTeam && matchDriver && matchSearch;
    });
  }, [articles, selectedTopic, selectedAuthority, selectedTeam, selectedDriver, searchQuery]);

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
    <div className="flex flex-col gap-3 sm:gap-4 max-w-6xl mx-auto animate-fade-in pb-8">
      {/* ── 1. Domestic Official Broadcaster (FOD / Fuji TV NEXT) Live Schedule Banner ── */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-sky-950/50 border border-sky-500/30 p-3.5 sm:p-4 shadow-lg">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-racing font-bold tracking-wider uppercase shadow-md shadow-red-600/30">
                国内独占生中継
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30 text-[10px] font-mono font-bold">
                FOD (フジテレビオンデマンド) / フジテレビNEXT
              </span>
              <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                全セッション日本語完全生中継
              </span>
            </div>

            <h2 className="text-lg sm:text-xl font-racing font-bold text-white tracking-wide flex items-center gap-2">
              <span>{upcomingRound.flag}</span>
              <span>次戦: 第{upcomingRound.round}戦 {upcomingRound.gpName}</span>
              <span className="text-xs font-mono text-slate-400 font-normal hidden sm:inline">
                ({upcomingRound.circuitName})
              </span>
            </h2>

            <p className="text-[11px] text-slate-300 max-w-2xl leading-relaxed">
              全{calendar.length}戦のフリー走行・予選・スプリント・決勝を完全生中継。
              解説陣（川井一仁、森脇基恭、米家峰起、中野信治、松田次生）によるピットレーン深層分析と一次情報をリアルタイムでお届けします。
            </p>
          </div>

          {/* Broadcast Action Links */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-1.5 flex-shrink-0">
            <a
              href="https://fod.fujitv.co.jp/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-racing font-bold shadow-md shadow-red-600/30 flex items-center justify-center gap-1.5 transition-all"
            >
              <span>📺 FOD LIVE配信を見る</span>
              <span className="text-[10px]">↗</span>
            </a>
            <div className="text-[9px] font-mono text-slate-400 text-center">
              見逃し配信・追っかけ再生対応
            </div>
          </div>
        </div>

        {/* Timetable Cards */}
        <div className="mt-3 pt-3 border-t border-white/10">
          <div className="text-[10px] sm:text-[11px] font-mono text-slate-400 font-bold mb-1.5 flex items-center justify-between">
            <span>🗓️ 日本時間（JST）放送タイムテーブル: {upcomingRound.dates}</span>
            <span className="text-slate-500 font-normal">{upcomingRound.pirelliCompounds}</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-1.5">
            {upcomingRound.scheduleJst.map((item, idx) => (
              <div
                key={idx}
                className={`p-1.5 sm:p-2 rounded-lg border transition-colors ${
                  idx === upcomingRound.scheduleJst.length - 1
                    ? 'bg-red-950/30 border-red-500/40 text-red-200 ring-1 ring-red-500/20'
                    : 'bg-slate-900/70 border-white/10 text-slate-200'
                }`}
              >
                <div className="text-[9px] font-mono text-slate-400 font-bold truncate">
                  {item.session}
                </div>
                <div className="text-xs font-racing font-bold text-white mt-0.5 truncate">
                  {item.dayTime}
                </div>
                <div className="text-[9px] font-mono text-emerald-400 mt-0.5 flex items-center gap-1">
                  <span>●</span> <span>FOD生配信</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── 2. Header & Action Toolbar ── */}
      <div className="glass-card-premium p-2.5 sm:p-3 rounded-xl flex flex-wrap items-center justify-between gap-2.5 border border-white/10 shadow-md">
        {/* Left: Title & Count */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <h2 className="text-sm sm:text-base font-racing font-bold text-white tracking-wider">
              最新ニュース ＆ パドックインテリジェンス
            </h2>
          </div>
          <span className="text-xs font-mono font-bold bg-slate-900/90 px-2.5 py-1 rounded-lg border border-white/10 text-sky-400">
            表示中: <strong className="text-white text-sm">{filteredNews.length}</strong> / {articles.length} 件
          </span>
        </div>

        {/* Right: Search, Filter Toggle, Backup, Refresh */}
        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          {/* Search Input */}
          <div className="relative w-40 sm:w-52">
            <span className="absolute inset-y-0 left-0 flex items-center pl-2.5 pointer-events-none text-slate-400 text-xs">
              🔍
            </span>
            <input
              type="text"
              placeholder="キーワード・選手名..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900/80 border border-white/10 rounded-lg pl-7 pr-6 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-400 transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 flex items-center pr-2 text-slate-400 hover:text-white text-xs cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          {/* Filter Tray Toggle Button */}
          <button
            type="button"
            onClick={() => setIsFilterOpen((prev) => !prev)}
            className={`text-xs font-racing font-bold px-3 py-1.5 rounded-lg border transition-all flex items-center gap-1.5 shadow-sm cursor-pointer ${
              isFilterOpen
                ? 'bg-sky-600 text-white border-sky-400 shadow-sky-500/30 ring-1 ring-sky-400/50'
                : activeFilterCount > 0
                ? 'bg-sky-950/80 border-sky-500/50 text-sky-300 hover:bg-sky-900/80'
                : 'bg-slate-900/80 border-white/10 text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
            title="格付け・トピック絞り込みの開閉"
          >
            <span>⚙️</span>
            <span>絞り込み</span>
            {activeFilterCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-sky-500 text-white text-[10px] font-mono flex items-center justify-center font-bold">
                {activeFilterCount}
              </span>
            )}
            <span className="text-[10px]">{isFilterOpen ? '▲' : '▼'}</span>
          </button>

          {/* Refresh Button */}
          <button
            type="button"
            onClick={fetchNews}
            disabled={isLoadingNews}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-white/10 transition-colors flex items-center justify-center shrink-0 disabled:opacity-50 cursor-pointer"
            title="ニュースを再取得"
          >
            <span className={isLoadingNews ? 'animate-spin' : ''}>🔄</span>
          </button>

          {hasActiveFilter && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="text-xs font-mono font-bold bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 px-2 py-1.5 rounded-lg transition-all flex items-center gap-1 shadow-sm active:scale-95 cursor-pointer"
              title="すべての絞り込み条件をリセット"
            >
              <span>✕</span>
              <span className="hidden sm:inline">リセット</span>
            </button>
          )}
        </div>
      </div>

      {/* ── Collapsible Filter Tray (On-demand) ── */}
      {isFilterOpen && (
        <div className="glass-card-premium rounded-xl p-3 sm:p-4 border border-sky-500/30 shadow-xl flex flex-col gap-3 animate-fade-in">
          <div className="flex items-center justify-between pb-2 border-b border-white/10 text-xs">
            <span className="font-racing font-bold text-slate-300 flex items-center gap-1.5">
              <span>⚙️</span>
              <span>ニュース格付け ＆ トピック絞り込み条件</span>
            </span>
            <button
              type="button"
              onClick={() => setIsFilterOpen(false)}
              className="text-slate-400 hover:text-white text-xs px-2 py-0.5 rounded hover:bg-white/10 transition-colors cursor-pointer"
            >
              閉じる ✕
            </button>
          </div>

          {/* Section 1: Authority */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <span className="text-[11px] font-racing font-bold text-slate-400 uppercase tracking-wider min-w-[90px] flex items-center gap-1">
              <span>🛡️</span>
              <span>一次情報格付け:</span>
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={() => setSelectedAuthority('ALL')}
                className={`px-2.5 py-1 rounded-lg text-xs font-racing font-bold transition-all cursor-pointer ${
                  selectedAuthority === 'ALL'
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'bg-slate-900/80 text-slate-400 hover:text-white border border-white/5'
                }`}
              >
                全ソース
              </button>
              {(Object.keys(AUTHORITY_CONFIG) as NewsAuthorityLevel[]).map((level) => {
                const conf = AUTHORITY_CONFIG[level];
                const isSel = selectedAuthority === level;
                return (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setSelectedAuthority(isSel ? 'ALL' : level)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all flex items-center gap-1 border cursor-pointer ${
                      isSel
                        ? 'bg-slate-800 text-white border-sky-400 shadow-sm font-bold ring-1 ring-sky-400/40'
                        : 'bg-slate-900/60 border-white/5 text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <span>{conf.icon}</span>
                    <span>{conf.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: Topic Categories */}
          <div className="flex flex-col sm:flex-row sm:items-start gap-2 pt-2 border-t border-white/5">
            <span className="text-[11px] font-racing font-bold text-slate-400 uppercase tracking-wider min-w-[90px] flex items-center gap-1 pt-1">
              <span>🏷️</span>
              <span>トピック分野:</span>
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={() => setSelectedTopic('ALL')}
                className={`px-2.5 py-1 rounded-lg text-xs font-racing font-bold transition-all cursor-pointer ${
                  selectedTopic === 'ALL'
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'bg-slate-900/80 text-slate-400 hover:text-white border border-white/5'
                }`}
              >
                すべて
              </button>
              {(Object.keys(TOPIC_ICONS) as TopicTag[]).map((tag) => {
                const isSel = selectedTopic === tag;
                const info = TOPIC_ICONS[tag];
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setSelectedTopic(isSel ? 'ALL' : tag)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all border cursor-pointer flex items-center gap-1 ${
                      isSel
                        ? 'bg-slate-800 text-sky-300 border-sky-400 font-bold ring-1 ring-sky-400/40'
                        : 'bg-slate-900/60 border-white/5 text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <span>{info.icon}</span>
                    <span>{info.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── Active Filter Dismissible Chips Strip ── */}
      {hasActiveFilter && (
        <div className="flex flex-wrap items-center gap-1.5 px-1 text-xs">
          <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1 mr-1">
            <span>🎯</span>
            <span>絞り込み中:</span>
          </span>
          {selectedAuthority !== 'ALL' && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-950/80 border border-blue-500/40 text-blue-200 text-[11px] font-mono">
              <span>{AUTHORITY_CONFIG[selectedAuthority as NewsAuthorityLevel]?.icon}</span>
              <span>{AUTHORITY_CONFIG[selectedAuthority as NewsAuthorityLevel]?.label}</span>
              <button
                type="button"
                onClick={() => setSelectedAuthority('ALL')}
                className="hover:text-white text-blue-400 hover:bg-blue-800/50 rounded px-1 ml-0.5 cursor-pointer"
                title="格付け解除"
              >
                ✕
              </button>
            </span>
          )}
          {selectedTopic !== 'ALL' && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-sky-950/80 border border-sky-500/40 text-sky-200 text-[11px] font-mono">
              <span>{TOPIC_ICONS[selectedTopic as TopicTag]?.icon} {TOPIC_ICONS[selectedTopic as TopicTag]?.label}</span>
              <button
                type="button"
                onClick={() => setSelectedTopic('ALL')}
                className="hover:text-white text-sky-400 hover:bg-sky-800/50 rounded px-1 ml-0.5 cursor-pointer"
                title="トピック解除"
              >
                ✕
              </button>
            </span>
          )}
          {selectedTeam !== 'ALL' && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-800 border border-white/10 text-white text-[11px] font-mono">
              <span>🏎️ {selectedTeam}</span>
              <button
                type="button"
                onClick={() => setSelectedTeam('ALL')}
                className="hover:text-red-400 ml-1 text-slate-400 cursor-pointer"
                title="チーム解除"
              >
                ✕
              </button>
            </span>
          )}
          {selectedDriver !== 'ALL' && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-800 border border-sky-500/30 text-sky-300 text-[11px] font-mono font-bold">
              <span>👤 {selectedDriver}</span>
              <button
                type="button"
                onClick={() => setSelectedDriver('ALL')}
                className="hover:text-red-400 ml-1 text-slate-400 cursor-pointer"
                title="選手解除"
              >
                ✕
              </button>
            </span>
          )}
          {searchQuery && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-sky-950/80 border border-sky-500/40 text-sky-200 text-[11px] font-mono">
              <span>&quot;{searchQuery}&quot;</span>
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="hover:text-white text-sky-400 hover:bg-sky-800/50 rounded px-1 ml-0.5 cursor-pointer"
                title="検索解除"
              >
                ✕
              </button>
            </span>
          )}
          <button
            type="button"
            onClick={handleResetFilters}
            className="text-[11px] text-rose-400 hover:text-rose-300 underline ml-1 cursor-pointer font-mono"
          >
            すべて解除
          </button>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 sm:gap-3">
          {filteredNews.length === 0 ? (
            <div className="col-span-full glass-card p-8 text-center text-slate-500 text-xs flex flex-col items-center gap-2">
              <span className="text-2xl">📰</span>
              <span>選択したフィルターに該当するニュースが見つかりませんでした</span>
              <button
                type="button"
                onClick={handleResetFilters}
                className="mt-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-sky-400 rounded-lg text-xs font-medium border border-white/10"
              >
                フィルターをクリアして全件表示
              </button>
            </div>
          ) : (
            filteredNews.map((item) => {
              const auth = item.authorityLevel || 'PADDOCK_INTEL';
              const authConfig = AUTHORITY_CONFIG[auth] || AUTHORITY_CONFIG.PADDOCK_INTEL;

              return (
                <div
                  key={item.id}
                  className="glass-card-premium p-3.5 sm:p-4 rounded-xl flex flex-col justify-between gap-2.5 hover:border-white/20 transition-all group relative overflow-hidden"
                >
                  <div className="flex flex-col gap-2">
                    {/* Source Authority & Category Header */}
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {/* Primary Source Authority Badge */}
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold border flex items-center gap-1 ${authConfig.badgeClass}`}
                          title={authConfig.desc}
                        >
                          <span>{authConfig.icon}</span>
                          <span>{authConfig.label}</span>
                        </span>

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
                            type="button"
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
                            type="button"
                            onClick={() => setSelectedTeam(isActive ? 'ALL' : team.name)}
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold border transition-all ${
                              isActive ? 'ring-1 ring-white' : 'hover:opacity-90'
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
                            type="button"
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
                        type="button"
                        onClick={() => handleGenerateSummary(item)}
                        disabled={loadingAiSummary[item.id]}
                        className="h-7 px-2.5 rounded-lg bg-purple-900/40 hover:bg-purple-900/60 border border-purple-500/30 text-purple-200 text-[11px] font-medium flex items-center gap-1.5 transition-all disabled:opacity-50 whitespace-nowrap shrink-0 cursor-pointer"
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
                      <span className="text-[10px] text-emerald-400 flex items-center gap-1 whitespace-nowrap shrink-0">
                        <span>✓</span>
                        <span>要約展開中</span>
                      </span>
                    )}

                    {/* External Read Original Article Link */}
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sky-400 hover:text-sky-300 text-xs font-medium flex items-center gap-1 group-hover:translate-x-0.5 transition-transform ml-auto whitespace-nowrap shrink-0"
                    >
                      <span>元記事を読む</span>
                      <span>↗</span>
                    </a>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
