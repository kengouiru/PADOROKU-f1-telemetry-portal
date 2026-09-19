'use client';

import React, { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useUserPreferences } from '@/lib/userPreferences';
import { KNOWLEDGE_TEAMS, KNOWLEDGE_DRIVERS } from '@/data/f1KnowledgeData';
import ProfileSettingsModal from '@/components/auth/ProfileSettingsModal';
import { usePlanTier } from '@/lib/tierService';

export interface AppNavigationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeHub: string;
  appMode: string;
  librarySubTab: string;
  detailedTelemetryTab?: string;
  pitStrategyViewMode?: string;
  onSelectFeature: (featureId: string) => void;
  onOpenAuthModal?: () => void;
  onOpenUpgradeModal?: () => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: string;
  badge?: string;
  badgeColor?: string;
  keywords?: string;
  isSubItem?: boolean;
}

interface NavGroup {
  groupTitle: string;
  groupIcon: string;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    groupTitle: 'メインハブ (5大画面)',
    groupIcon: '🏁',
    items: [
      {
        id: 'season_calendar',
        label: 'シーズン観戦 ＆ カレンダー',
        icon: '📅',
        badge: 'SEASON',
        badgeColor: 'bg-red-600/30 text-red-300 border border-red-500/30',
        keywords: 'カレンダー 日程 順位表 スケジュール ホーム 2026',
      },
      {
        id: 'telemetry_laps',
        label: '実戦テレメトリー分析',
        icon: '📊',
        badge: 'TELEMETRY',
        badgeColor: 'bg-red-600/30 text-red-300 border border-red-500/30',
        keywords: 'テレメトリー ラップタイム 車速 比較 ペース',
      },
      {
        id: 'virtual_gp',
        label: 'ピットウォール司令塔',
        icon: '🎮',
        badge: 'PITWALL',
        badgeColor: 'bg-red-600/30 text-red-300 border border-red-500/30',
        keywords: 'ピットウォール シミュレーター 戦術 指揮 司令室',
      },
      {
        id: 'fod_news',
        label: 'パドックニュース ＆ FOD中継',
        icon: '📰',
        badge: 'NEWS',
        badgeColor: 'bg-red-600/30 text-red-300 border border-red-500/30',
        keywords: 'ニュース 放送日程 FOD フジテレビ パドック',
      },
      {
        id: 'library',
        label: 'F1大百科 ＆ ナレッジ',
        icon: '📚',
        badge: 'LIBRARY',
        badgeColor: 'bg-sky-600/30 text-sky-300 border border-sky-500/30',
        keywords: '百科事典 ライブラリ ナレッジ 知識',
      },
    ],
  },
  {
    groupTitle: 'F1大百科ダイレクト目次',
    groupIcon: '🏎️',
    items: [
      {
        id: 'drivers',
        label: '選手名鑑 (全22名・レジェンド)',
        icon: '👤',
        isSubItem: true,
        keywords: 'ドライバー 選手名鑑 角田 フェルスタッペン ハミルトン',
      },
      {
        id: 'teams',
        label: 'チーム名鑑 (全11チーム・PU)',
        icon: '🏎️',
        isSubItem: true,
        keywords: 'コンストラクター チーム レッドブル フェラーリ アウディ ホンダ',
      },
      {
        id: 'circuits',
        label: 'サーキット解説 (全24コース)',
        icon: '🏁',
        isSubItem: true,
        keywords: 'コース サーキット 鈴鹿 モナコ スパ DRS',
      },
      {
        id: 'tyres',
        label: 'タイヤ大百科 (ピレリ C1〜C5)',
        icon: '🛞',
        isSubItem: true,
        keywords: 'タイヤ ピレリ コンパウンド 作動温度 摩耗 デグラデーション',
      },
      {
        id: 'glossary',
        label: 'F1用語辞典 (図解・80語+)',
        icon: '🧠',
        isSubItem: true,
        keywords: '用語 辞書 解説 アペックス アンダーカット トウ スリップストリーム',
      },
      {
        id: 'fia_rules',
        label: 'FIA公式規則 ＆ 2026年規定',
        icon: '⚖️',
        badge: '2026規定',
        badgeColor: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
        isSubItem: true,
        keywords: 'ルール 規則 FIA 2026 新規定 スチュワード ペナルティ',
      },
      {
        id: 'drama',
        label: '名勝負ドラマ ＆ 歴史無線',
        icon: '🎬',
        isSubItem: true,
        keywords: '名勝負 ドラマ 歴史 無線 クラシック 確執 アーカイブ',
      },
    ],
  },
  {
    groupTitle: '専門ツール ＆ 分析機能',
    groupIcon: '🛠️',
    items: [
      {
        id: 'telemetry_delta',
        label: 'タイムデルタ(Δt) ＆ コーナー解析',
        icon: '⏱️',
        badge: 'Δt',
        badgeColor: 'bg-sky-600/30 text-sky-300 border border-sky-500/30',
        keywords: 'デルタ コーナー GPS タイム差 エイペックス',
      },
      {
        id: 'stint_visualizer',
        label: '全車タイヤスティント ＆ 戦略',
        icon: '🛞',
        badge: 'Stint',
        badgeColor: 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/30',
        keywords: 'スティント タイヤ履歴 ピットイン 戦略',
      },
      {
        id: 'team_radios',
        label: 'チーム無線 ＆ AIリアルタイム要約',
        icon: '🎙️',
        badge: 'Radio',
        badgeColor: 'bg-purple-600/30 text-purple-300 border border-purple-500/30',
        keywords: '無線 チームラジオ 音声 文字起こし AI 翻訳',
      },
      {
        id: 'ai_strategist',
        label: 'AIチーフレースストラテジスト',
        icon: '🤖',
        badge: 'AI',
        badgeColor: 'bg-blue-600/30 text-blue-300 border border-blue-500/30',
        keywords: 'AI ストラテジスト アナリスト 作戦 戦略 Gemini',
      },
      {
        id: 'race_notes',
        label: 'レースノート ＆ 総括レポート',
        icon: '📝',
        keywords: 'ノート メモ レポート 観戦記録',
      },
      {
        id: 'quiz',
        label: 'F1検定クイズ (実況音声演出)',
        icon: '🏆',
        badge: 'Quiz',
        badgeColor: 'bg-amber-600/30 text-amber-300 border border-amber-500/30',
        keywords: 'クイズ 検定 音声 実況 148問',
      },
    ],
  },
];

export default function AppNavigationDrawer({
  isOpen,
  onClose,
  activeHub,
  appMode,
  librarySubTab,
  detailedTelemetryTab,
  pitStrategyViewMode,
  onSelectFeature,
  onOpenAuthModal,
  onOpenUpgradeModal,
}: AppNavigationDrawerProps) {
  const { data: session } = useSession();
  const { isPro } = usePlanTier();
  const { prefs } = useUserPreferences();
  const [searchFilter, setSearchFilter] = useState('');
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [profileModalTab, setProfileModalTab] = useState<'avatar' | 'favorites' | 'plan'>('avatar');
  const [avatarError, setAvatarError] = useState(false);

  const user = session?.user;
  const activeAvatar = prefs.customAvatarUrl || user?.image || '';
  const activeDisplayName = prefs.displayName || user?.name || (user ? (isPro ? 'Pro User' : 'Free User') : 'ゲスト');

  const selectedTeam = KNOWLEDGE_TEAMS.find((t) => t.id === prefs.favoriteTeamId);
  const selectedDriver = KNOWLEDGE_DRIVERS.find((d) => d.code === prefs.favoriteDriverCode);
  const teamColor = selectedTeam?.color || '#38bdf8';
  const initial = (activeDisplayName || 'U').charAt(0).toUpperCase();

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent background scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Determine active item ID
  const getIsActive = (id: string): boolean => {
    if (id === 'season_calendar') {
      return appMode === 'season' && activeHub === 'season';
    }
    if (id === 'telemetry_laps') {
      return (
        appMode === 'season' &&
        activeHub === 'telemetry' &&
        detailedTelemetryTab !== 'delta_matrix'
      );
    }
    if (id === 'telemetry_delta') {
      return (
        appMode === 'season' &&
        activeHub === 'telemetry' &&
        detailedTelemetryTab === 'delta_matrix'
      );
    }
    if (id === 'virtual_gp' || id === 'war_room' || id === 'race_simulator') {
      return activeHub === 'simulator';
    }
    if (id === 'fod_news') {
      return activeHub === 'news';
    }
    if (id === 'library' || id === 'knowledge') {
      return appMode === 'library' && activeHub === 'knowledge';
    }
    if (
      id === 'drivers' ||
      id === 'teams' ||
      id === 'circuits' ||
      id === 'tyres' ||
      id === 'drama' ||
      id === 'glossary'
    ) {
      return appMode === 'library' && activeHub === 'knowledge' && librarySubTab === id;
    }
    if (id === 'fia_rules' || id === '2026_regulations') {
      return (
        appMode === 'library' &&
        activeHub === 'knowledge' &&
        (librarySubTab === 'rules' || librarySubTab === 'regulations')
      );
    }
    if (id === 'race_notes') {
      return activeHub === 'notes';
    }
    return false;
  };

  const filteredGroups = NAV_GROUPS.map((group) => {
    const q = searchFilter.toLowerCase().trim();
    if (!q) return group;
    const items = group.items.filter(
      (item) =>
        item.label.toLowerCase().includes(q) ||
        (item.keywords && item.keywords.toLowerCase().includes(q))
    );
    return { ...group, items };
  }).filter((group) => group.items.length > 0);

  return (
    <div className="fixed inset-0 z-50 flex animate-fade-in">
      {/* Semi-transparent Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-out Sidebar Panel */}
      <aside className="relative w-84 sm:w-96 max-w-[85vw] h-full bg-slate-950 border-r border-white/10 shadow-2xl flex flex-col z-10 animate-slide-in-left overflow-hidden text-white">
        {/* Drawer Header */}
        <div className="p-4 border-b border-white/10 bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => {
              onSelectFeature('season_calendar');
              onClose();
            }}
            className="flex items-center gap-2.5 text-left cursor-pointer group select-none hover:opacity-95 transition-all p-1.5 -ml-1 rounded-xl hover:bg-white/5"
            title="ホーム画面（2026年シーズン観戦カレンダー）に戻る"
            aria-label="ホーム画面に戻る"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-red-600 via-red-500 to-rose-700 flex items-center justify-center font-racing font-black text-white text-xs shadow-md shadow-red-950/40 border border-red-400/40 group-hover:border-red-300 group-hover:scale-105 transition-all">
              P1
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="font-racing font-bold text-sm tracking-wider text-white group-hover:text-red-400 transition-colors">
                  PADOROKU
                </h2>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-red-600/30 text-red-300 border border-red-500/30 flex items-center gap-0.5">
                  <span>🏠</span>
                  <span>ホーム</span>
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono group-hover:text-slate-300">
                全機能ナビゲーション・目次
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/10 text-slate-400 hover:text-white flex items-center justify-center text-sm transition-all cursor-pointer shadow-sm"
            title="メニューを閉じる (Esc)"
          >
            ✕
          </button>
        </div>

        {/* Quick Search Filter */}
        <div className="p-3 border-b border-white/5 bg-slate-900/60">
          <div className="relative">
            <input
              type="text"
              placeholder="メニュー内を検索..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full bg-slate-950/90 border border-white/10 rounded-xl px-3 py-1.5 pl-8 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500 transition-colors"
            />
            <span className="absolute left-2.5 top-1.5 text-xs text-slate-500">🔍</span>
            {searchFilter && (
              <button
                type="button"
                onClick={() => setSearchFilter('')}
                className="absolute right-2.5 top-1.5 text-xs text-slate-400 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Navigation List Body */}
        <div className="flex-1 min-h-0 overflow-y-auto p-3 space-y-3.5 no-scrollbar">
          {filteredGroups.map((group, gIdx) => (
            <div key={gIdx} className="space-y-1">
              {/* Group Title */}
              <div className="flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-racing font-bold text-slate-400 uppercase tracking-wider">
                <span>{group.groupIcon}</span>
                <span>{group.groupTitle}</span>
              </div>

              {/* Items in Group */}
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const isActive = getIsActive(item.id);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        onSelectFeature(item.id);
                        onClose();
                      }}
                      title={item.keywords || item.label}
                      className={`group/btn w-full text-left px-2.5 py-1.5 rounded-lg transition-all flex items-center justify-between gap-2 cursor-pointer border ${
                        item.isSubItem ? 'ml-3 w-[calc(100%-12px)]' : ''
                      } ${
                        isActive
                          ? 'bg-gradient-to-r from-red-600/25 via-red-600/10 to-transparent border-red-500/50 text-white shadow-sm ring-1 ring-red-500/30 font-bold'
                          : 'bg-slate-900/40 hover:bg-slate-800/70 border-transparent hover:border-white/10 text-slate-300 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-sm shrink-0 w-4 text-center">{item.icon}</span>
                        <span
                          className={`text-xs font-racing font-bold truncate ${
                            isActive ? 'text-red-400' : 'text-slate-300 group-hover/btn:text-white'
                          }`}
                        >
                          {item.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {item.badge && (
                          <span
                            className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded shrink-0 ${
                              item.badgeColor || 'bg-slate-800 text-slate-300'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                        <span
                          className={`text-[10px] transition-transform ${
                            isActive
                              ? 'text-red-400 font-bold'
                              : 'text-slate-600 group-hover/btn:text-slate-400 group-hover/btn:translate-x-0.5'
                          }`}
                        >
                          ›
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* ── Drawer User Profile & Settings Footer (Discord/Slack/Linear Style) ── */}
        <div className="p-2.5 border-t border-white/10 bg-slate-950/95 backdrop-blur-md shrink-0">
          {session?.user ? (
            <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-slate-900/50 hover:bg-slate-900 border border-white/5 hover:border-white/15 transition-all group">
              {/* Clickable User Card -> Opens Personal Settings Modal */}
              <button
                type="button"
                onClick={() => {
                  setProfileModalTab('avatar');
                  setProfileModalOpen(true);
                }}
                className="flex items-center gap-2.5 min-w-0 text-left cursor-pointer flex-1 group/user select-none"
                title="個人設定画面（プロフィール・推しチーム・プラン）を開く"
              >
                {/* User Avatar */}
                {activeAvatar && !avatarError ? (
                  <div
                    className="w-8 h-8 rounded-lg overflow-hidden border shadow-sm shrink-0"
                    style={{ borderColor: teamColor }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={activeAvatar}
                      alt={activeDisplayName}
                      className="w-full h-full object-cover object-top"
                      onError={() => setAvatarError(true)}
                    />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 font-racing font-bold text-xs flex items-center justify-center shrink-0 shadow-sm">
                    {initial}
                  </div>
                )}

                {/* User Names & Badges */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <p className="font-racing font-bold text-xs text-white truncate group-hover/user:text-amber-300 transition-colors">
                      {activeDisplayName}
                    </p>
                    <span
                      className={`px-1.5 py-0.2 rounded text-[8px] font-racing font-black ${
                        isPro
                          ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 shadow-sm'
                          : 'bg-slate-800 text-slate-400 border border-white/10'
                      }`}
                    >
                      {isPro ? 'PRO' : 'FREE'}
                    </span>
                  </div>
                  {selectedTeam ? (
                    <p className="text-[10px] font-mono truncate" style={{ color: selectedTeam.color }}>
                      🏁 {selectedTeam.name}
                    </p>
                  ) : (
                    <p className="text-[10px] font-mono text-slate-400 group-hover/user:text-slate-300">
                      個人設定を開く ➔
                    </p>
                  )}
                </div>
              </button>

              {/* Quick Icon Actions */}
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setProfileModalTab('avatar');
                    setProfileModalOpen(true);
                  }}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-white/10 hover:border-amber-500/40 transition-all cursor-pointer shadow-sm"
                  title="個人設定画面を開く (⚙️)"
                  aria-label="個人設定"
                >
                  <span className="text-sm">⚙️</span>
                </button>
                <button
                  type="button"
                  onClick={() => signOut()}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950/60 text-slate-400 hover:text-rose-300 border border-white/10 hover:border-rose-500/30 transition-all cursor-pointer shadow-sm"
                  title="ログアウト"
                  aria-label="ログアウト"
                >
                  <span className="text-sm">🚪</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-mono text-[11px] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-slate-500" />
                  <span>ゲスト利用中</span>
                </span>
                <span className="text-[10px] font-mono text-slate-500">Escで閉じる</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (onOpenAuthModal) {
                    onOpenAuthModal();
                  }
                  onClose();
                }}
                className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-500 text-white font-racing font-bold text-xs transition-all shadow-md shadow-red-950/40 border border-red-400/30 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>🔑</span>
                <span>ログイン / メンバー登録</span>
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Settings Modal Portal inside Drawer */}
      {profileModalOpen && (
        <ProfileSettingsModal
          onClose={() => setProfileModalOpen(false)}
          initialTab={profileModalTab}
          onOpenUpgradeModal={onOpenUpgradeModal}
        />
      )}
    </div>
  );
}
