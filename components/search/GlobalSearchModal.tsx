'use client';

/**
 * components/search/GlobalSearchModal.tsx
 * Unified Global Search & Command Palette (Cmd/Ctrl + K):
 * Indexes Drivers, Teams, Circuits, Tyres, Glossary Terms, Dramatic Moments & Season Calendar.
 * Supports Instant Incremental Search, Category Badges, Keyboard Navigation & Deep-linking.
 */

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  KNOWLEDGE_DRIVERS,
  KNOWLEDGE_TEAMS,
  KNOWLEDGE_CIRCUITS,
  KNOWLEDGE_TYRES,
  KNOWLEDGE_DRAMA_MOMENTS,
  KNOWLEDGE_SEASON_STORIES,
} from '@/data/f1KnowledgeData';
import { GLOSSARY_TERMS } from '@/data/f1GlossaryData';
import { SEASON_2025_CALENDAR } from '@/data/f1SeasonData';

export type SearchCategory = 'ALL' | 'driver' | 'team' | 'circuit' | 'tyre' | 'glossary' | 'drama' | 'race';

export interface SearchResultItem {
  id: string;
  category: 'driver' | 'team' | 'circuit' | 'tyre' | 'glossary' | 'drama' | 'race';
  title: string;
  subtitle: string;
  badge: string;
  badgeBg: string;
  badgeText: string;
  icon: string;
  onSelect: () => void;
}

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (action: {
    appMode: 'season' | 'library';
    hub: 'season' | 'telemetry' | 'news' | 'knowledge' | 'notes';
    subTab?: 'drivers' | 'teams' | 'circuits' | 'tyres' | 'glossary' | 'drama';
    targetId?: string;
  }) => void;
}

export default function GlobalSearchModal({
  isOpen,
  onClose,
  onNavigate,
}: GlobalSearchModalProps) {
  const [mounted, setMounted] = useState(false);
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<SearchCategory>('ALL');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Focus input and reset on open
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setActiveCategory('ALL');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Global keyboard shortcut: Ctrl+K / Cmd+K and Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        // Handled in parent for toggle
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Build Master Search Index
  const allItems: SearchResultItem[] = useMemo(() => {
    const items: SearchResultItem[] = [];

    // 1. Drivers (現役 & レジェンド)
    KNOWLEDGE_DRIVERS.forEach((d) => {
      items.push({
        id: `driver-${d.code}`,
        category: 'driver',
        title: `${d.fullName} (${d.code})`,
        subtitle: `#${d.number} ${d.team} • ${d.country} • ${d.championships > 0 ? `${d.championships}冠` : '現役'}`,
        badge: '選手名鑑',
        badgeBg: 'bg-blue-500/20 border-blue-500/30',
        badgeText: 'text-blue-300',
        icon: '👤',
        onSelect: () => {
          onNavigate({ appMode: 'library', hub: 'knowledge', subTab: 'drivers', targetId: d.code });
          onClose();
        },
      });
    });

    // 2. Teams (全10チーム)
    KNOWLEDGE_TEAMS.forEach((t) => {
      items.push({
        id: `team-${t.id}`,
        category: 'team',
        title: t.name,
        subtitle: `${t.fullName} • PU: ${t.powerUnit} • ${t.constructorTitles}冠`,
        badge: 'チーム名鑑',
        badgeBg: 'bg-indigo-500/20 border-indigo-500/30',
        badgeText: 'text-indigo-300',
        icon: '🏎️',
        onSelect: () => {
          onNavigate({ appMode: 'library', hub: 'knowledge', subTab: 'teams', targetId: t.id });
          onClose();
        },
      });
    });

    // 3. Circuits (全24サーキット)
    KNOWLEDGE_CIRCUITS.forEach((c) => {
      items.push({
        id: `circuit-${c.id}`,
        category: 'circuit',
        title: c.name,
        subtitle: `${c.country} • 全長 ${c.lengthKm}km • コーナー数 ${c.turns}`,
        badge: 'コース解説',
        badgeBg: 'bg-sky-500/20 border-sky-500/30',
        badgeText: 'text-sky-300',
        icon: '🏁',
        onSelect: () => {
          onNavigate({ appMode: 'library', hub: 'knowledge', subTab: 'circuits', targetId: c.id });
          onClose();
        },
      });
    });

    // 4. Tyres (タイヤ大百科)
    KNOWLEDGE_TYRES.forEach((ty) => {
      items.push({
        id: `tyre-${ty.id}`,
        category: 'tyre',
        title: `タイヤ: ${ty.name}`,
        subtitle: `${ty.code} • ${ty.description}`,
        badge: 'タイヤ大百科',
        badgeBg: 'bg-amber-500/20 border-amber-500/30',
        badgeText: 'text-amber-300',
        icon: '🛞',
        onSelect: () => {
          onNavigate({ appMode: 'library', hub: 'knowledge', subTab: 'tyres' });
          onClose();
        },
      });
    });

    // Additional Tyre Strategy Concepts
    const tyreConcepts = [
      { id: 'tyre-undercut', title: 'アンダーカット (Undercut)', desc: '先にピットインして新品タイヤの速さで逆転する戦略', category: 'tyre' },
      { id: 'tyre-overcut', title: 'オーバーカット (Overcut)', desc: '相手がピットインした後にクリーンエアでプッシュする逆転戦略', category: 'tyre' },
      { id: 'tyre-degradation', title: 'デグラデーション (タイヤ劣化曲線)', desc: '走行周回によるグリップ低下率と燃料減少の相殺数理', category: 'tyre' },
      { id: 'tyre-graining', title: 'グレイニング (ささくれ摩耗)', desc: '低温路面で表面ゴムが毛羽立ちグリップを失う現象', category: 'tyre' },
      { id: 'tyre-blistering', title: 'ブリスター (内部沸騰)', desc: '高温過負荷で内部ゴムが沸騰し水疱が破裂する現象', category: 'tyre' },
    ];
    tyreConcepts.forEach((tc) => {
      items.push({
        id: tc.id,
        category: 'tyre',
        title: tc.title,
        subtitle: tc.desc,
        badge: 'タイヤ戦略',
        badgeBg: 'bg-amber-500/20 border-amber-500/30',
        badgeText: 'text-amber-300',
        icon: '🛞',
        onSelect: () => {
          onNavigate({ appMode: 'library', hub: 'knowledge', subTab: 'tyres' });
          onClose();
        },
      });
    });

    // 5. Glossary Terms (F1用語大辞典)
    GLOSSARY_TERMS.forEach((gt) => {
      items.push({
        id: `glossary-${gt.id}`,
        category: 'glossary',
        title: `${gt.term} (${gt.englishTerm})`,
        subtitle: `[${gt.category}] ${gt.summary}`,
        badge: 'F1用語辞典',
        badgeBg: 'bg-emerald-500/20 border-emerald-500/30',
        badgeText: 'text-emerald-300',
        icon: '🧠',
        onSelect: () => {
          onNavigate({ appMode: 'library', hub: 'knowledge', subTab: 'glossary', targetId: gt.id });
          onClose();
        },
      });
    });

    // 6. Dramatic Moments & Historical Races (ドラマ・歴史)
    KNOWLEDGE_DRAMA_MOMENTS.forEach((dm) => {
      items.push({
        id: `drama-${dm.id}`,
        category: 'drama',
        title: dm.title,
        subtitle: `${dm.year}年 ${dm.grandPrix} • ${dm.story}`,
        badge: 'ドラマ・歴史',
        badgeBg: 'bg-rose-500/20 border-rose-500/30',
        badgeText: 'text-rose-300',
        icon: '🎬',
        onSelect: () => {
          onNavigate({ appMode: 'library', hub: 'knowledge', subTab: 'drama', targetId: dm.id });
          onClose();
        },
      });
    });

    // 7. Season Stories
    KNOWLEDGE_SEASON_STORIES.forEach((ss) => {
      items.push({
        id: `story-${ss.id}`,
        category: 'drama',
        title: `${ss.seasonYear}年 ${ss.title}`,
        subtitle: ss.overview || ss.subtitle,
        badge: 'シーズンドラマ',
        badgeBg: 'bg-rose-500/20 border-rose-500/30',
        badgeText: 'text-rose-300',
        icon: '📖',
        onSelect: () => {
          onNavigate({ appMode: 'library', hub: 'knowledge', subTab: 'drama' });
          onClose();
        },
      });
    });

    // 8. 2025 Race Calendar (全24戦)
    SEASON_2025_CALENDAR.forEach((rc) => {
      items.push({
        id: `race-${rc.round}`,
        category: 'race',
        title: `第${rc.round}戦 ${rc.gpName} (${rc.country})`,
        subtitle: `${rc.dates} • ${rc.circuitName} ${rc.isSprint ? '• SPRINT戦' : ''}`,
        badge: '2025カレンダー',
        badgeBg: 'bg-red-500/20 border-red-500/30',
        badgeText: 'text-red-300',
        icon: '📅',
        onSelect: () => {
          onNavigate({ appMode: 'season', hub: 'season', targetId: String(rc.round) });
          onClose();
        },
      });
    });

    return items;
  }, [onNavigate, onClose]);

  // Filtered items based on query and category
  const filteredResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    return allItems.filter((item) => {
      // Category filter
      if (activeCategory !== 'ALL' && item.category !== activeCategory) {
        return false;
      }
      if (!q) return true;
      return (
        item.title.toLowerCase().includes(q) ||
        item.subtitle.toLowerCase().includes(q) ||
        item.badge.toLowerCase().includes(q)
      );
    });
  }, [allItems, query, activeCategory]);

  // Handle arrow keys and Enter
  const handleKeyDownList = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1 < filteredResults.length ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 >= 0 ? prev - 1 : filteredResults.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredResults[selectedIndex]) {
        filteredResults[selectedIndex].onSelect();
      }
    }
  };

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-start justify-center p-3 sm:p-6 pt-12 sm:pt-20 bg-black/80 backdrop-blur-md animate-fade-in text-white">
      {/* Click outside to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Container */}
      <div
        onKeyDown={handleKeyDownList}
        className="relative z-10 w-full max-w-2xl bg-slate-900/95 border border-white/20 rounded-3xl shadow-2xl flex flex-col max-h-[80vh] overflow-hidden animate-scale-up"
      >
        {/* Search Input Bar */}
        <div className="p-4 border-b border-white/10 bg-slate-950/90 flex items-center gap-3">
          <span className="text-lg text-slate-400">🔍</span>
          <input
            ref={inputRef}
            type="text"
            placeholder="選手・チーム・コース・タイヤ・用語・歴史を横断検索... (ESCで閉じる)"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            className="flex-1 bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none font-racing"
          />
          {query && (
            <button
              onClick={() => {
                setQuery('');
                setSelectedIndex(0);
              }}
              className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded bg-white/5"
            >
              クリア
            </button>
          )}
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center text-xs font-bold transition-all"
          >
            ✕
          </button>
        </div>

        {/* Category Filter Pills */}
        <div className="px-4 py-2 bg-slate-950/50 border-b border-white/5 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {(
            [
              ['ALL', 'すべて'],
              ['driver', '👤 選手'],
              ['team', '🏎️ チーム'],
              ['circuit', '🏁 コース'],
              ['tyre', '🛞 タイヤ'],
              ['glossary', '🧠 用語'],
              ['drama', '🎬 ドラマ'],
              ['race', '📅 カレンダー'],
            ] as [SearchCategory, string][]
          ).map(([cat, label]) => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                setSelectedIndex(0);
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-racing font-bold transition-all shrink-0 ${
                activeCategory === cat
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'bg-slate-900/60 text-slate-400 hover:text-white border border-white/5'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-2 divide-y divide-white/5">
          {filteredResults.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              <span className="text-2xl block mb-2">🔎</span>
              一致するコンテンツが見つかりませんでした。別のキーワードをお試しください。
            </div>
          ) : (
            filteredResults.map((item, index) => {
              const isSelected = index === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={item.onSelect}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`p-3 rounded-2xl cursor-pointer transition-all flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-sky-950/60 border border-sky-500/40 shadow-md'
                      : 'hover:bg-white/[0.03] border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-xl flex-shrink-0">{item.icon}</span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold border ${item.badgeBg} ${item.badgeText}`}
                        >
                          {item.badge}
                        </span>
                        <h4 className="text-xs sm:text-sm font-bold text-white truncate">
                          {item.title}
                        </h4>
                      </div>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 flex-shrink-0 text-[11px] text-sky-400 font-racing">
                    <span className="hidden sm:inline">開く</span>
                    <span>➔</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Hint */}
        <div className="px-4 py-2.5 bg-slate-950/90 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400 font-mono">
          <div className="flex items-center gap-2">
            <span>ヒット数: <strong className="text-white">{filteredResults.length}</strong> 件</span>
          </div>
          <div className="hidden sm:flex items-center gap-3 text-[10px]">
            <span>[↑][↓] 移動</span>
            <span>[Enter] 選択</span>
            <span>[ESC] 閉じる</span>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
