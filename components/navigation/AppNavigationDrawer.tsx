'use client';

import React, { useState, useEffect } from 'react';
import type { Session, Driver } from '@/lib/types';
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
  // Session & Driver selectors (Optional inside drawer)
  sessionProps?: {
    selectedYear: string;
    onYearChange: (year: string) => void;
    selectedMeetingKey: number | null;
    onMeetingChange: (meetingKey: number) => void;
    selectedSessionKey: number | null;
    onSessionChange: (sessionKey: number) => void;
    sessions: Session[];
    drivers: Driver[];
    selectedDrivers: string[];
    onDriverToggle: (num: string, checked: boolean) => void;
    isDemoMode: boolean;
    isLoading: boolean;
  };
}

interface NavItem {
  id: string;
  label: string;
  icon: string;
  badge?: string;
  badgeColor?: string;
  description?: string;
}

interface NavGroup {
  groupTitle: string;
  groupIcon: string;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    groupTitle: 'ホーム ＆ メイン画面',
    groupIcon: '🏠',
    items: [
      {
        id: 'season_calendar',
        label: 'ホーム（2026年レースカレンダー＆観戦）',
        icon: '🏠',
        badge: 'HOME',
        badgeColor: 'bg-red-600 text-white',
        description: '全24戦日程・カウントダウン・ドライバー＆チーム順位表・最新ニュース',
      },
    ],
  },
  {
    groupTitle: '注目・最新機能ラボ',
    groupIcon: '🔥',
    items: [
      {
        id: 'virtual_gp',
        label: '模擬レースシミュレーター Pro',
        icon: '🏎️',
        badge: 'PRO',
        badgeColor: 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black',
        description: 'パラメータ変更・複数台レース・降雨/SC逆転劇・AI総括',
      },
      {
        id: 'telemetry_delta',
        label: 'タイムデルタ(Δt) ＆ コーナー解析',
        icon: '🏁',
        badge: '2車比較',
        badgeColor: 'bg-sky-600 text-white',
        description: 'GPS累積タイム差・全15コーナーApex速度・AIデブリーフ',
      },
      {
        id: 'war_room',
        label: '戦術司令室 (Pitwall War Room)',
        icon: '🚨',
        badge: '戦術',
        badgeColor: 'bg-amber-600 text-white',
        description: '天候雨量・路面温度・タイヤ崖検知・SCピット損得計算',
      },
      {
        id: 'fod_news',
        label: 'FOD公式中継 ＆ パドックニュース',
        icon: '📺',
        badge: '公式中継',
        badgeColor: 'bg-emerald-600 text-white',
        description: 'フジテレビNEXT/FOD放送日程・一次情報格付けバッジ',
      },
      {
        id: 'quiz',
        label: 'F1検定クイズ (実況音声演出)',
        icon: '🏆',
        badge: '実況演出',
        badgeColor: 'bg-purple-600 text-white',
        description: '全4難易度・148問・エンジン音＆ピット無線エフェクト',
      },
    ],
  },
  {
    groupTitle: 'レース観戦 ＆ テレメトリー',
    groupIcon: '🏎️',
    items: [
      {
        id: 'season_calendar',
        label: 'レースカレンダー ＆ シーズン観戦',
        icon: '📅',
        description: '2026年全24戦カレンダー・次戦カウントダウン・概要',
      },
      {
        id: 'telemetry_laps',
        label: 'テレメトリー・ラップペース比較',
        icon: '📊',
        description: '周回ごとのラップタイム推移・ファステストラップ',
      },
      {
        id: 'stint_visualizer',
        label: '全車タイヤスティント ＆ 戦略',
        icon: '🛞',
        description: '全ドライバーのタイヤ履歴・ピットタイミング一元化',
      },
      {
        id: 'position_changes',
        label: '周回別順位変動チャート',
        icon: '📈',
        description: 'スタートからチェッカーまでの順位アップダウン',
      },
      {
        id: 'sector_analysis',
        label: 'セクター別タイム解析 (S1/S2/S3)',
        icon: '⏱️',
        description: 'セクターごとの最速ドライバーとタイム差比較',
      },
      {
        id: 'team_radios',
        label: 'チーム無線タイムライン ＆ AI文字起こし',
        icon: '🎙️',
        description: '緊迫のレース中生無線音声・AI日本語翻訳と要約',
      },
    ],
  },
  {
    groupTitle: 'F1大百科 ＆ 歴史ライブラリ',
    groupIcon: '📚',
    items: [
      {
        id: 'drivers',
        label: '選手名鑑 (ドライバーハブ)',
        icon: '👤',
        description: '現役全22名・スタイル・戦績・名言・バイオグラフィー',
      },
      {
        id: 'teams',
        label: 'チーム名鑑 (コンストラクター＆PU)',
        icon: '🏎️',
        description: 'アウディ・ホンダ含む全11チームの開発哲学とマシン',
      },
      {
        id: 'circuits',
        label: 'コース解説 (全24サーキット)',
        icon: '🏁',
        description: '鈴鹿・モナコ・スパ等のセクター特性・DRSゾーン',
      },
      {
        id: 'tyres',
        label: 'タイヤ大百科 (ピレリC1〜C5)',
        icon: '🛞',
        description: 'コンパウンド特性・作動温度レンジ・劣化メカニズム',
      },
      {
        id: 'glossary',
        label: 'F1用語辞典 (図解・辞書)',
        icon: '🧠',
        description: 'SVG図解付きで初心者の疑問を解決する80語以上の辞書',
      },
      {
        id: 'fia_rules',
        label: 'FIA公式規則 ＆ 2026年新規定解説',
        icon: '⚖️',
        description: '競技・技術規則・2026年新規定図解(アクティブ空力/PU)・スチュワード判定基準',
      },
      {
        id: 'drama',
        label: '名勝負ドラマ ＆ 歴史無線アーカイブ',
        icon: '🎬',
        description: 'F1史に残る名勝負・確執・無線バトルを当時の生音声で',
      },
    ],
  },
  {
    groupTitle: 'AIアシスタント ＆ ノート',
    groupIcon: '🤖',
    items: [
      {
        id: 'ai_strategist',
        label: 'AIチーフレースストラテジスト',
        icon: '🤖',
        badge: 'Gemini',
        badgeColor: 'bg-blue-600 text-white',
        description: 'レース状況をもとにピット戦略をリアルタイム提案',
      },
      {
        id: 'race_notes',
        label: 'レースノート ＆ 自動レポート',
        icon: '📝',
        description: '自分だけの観戦メモ保存・AIによるレース総括レポート',
      },
    ],
  },
  {
    groupTitle: '個人設定 ＆ カスタマイズ',
    groupIcon: '⚙️',
    items: [
      {
        id: 'pitwall_pro',
        label: 'Pitwall Pro メンバーシップ管理',
        icon: '💎',
        badge: 'UPGRADE',
        badgeColor: 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black',
        description: '月額/年額プラン比較・AI無制限・シミュレーター完全開放',
      },
      {
        id: 'profile_settings',
        label: '推しチーム ＆ プロフィール設定',
        icon: '⚙️',
        badge: 'カスタム',
        badgeColor: 'bg-amber-600 text-white',
        description: '応援チームカラー・推しドライバー・アバター・表示名設定',
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
  sessionProps,
}: AppNavigationDrawerProps) {
  const { data: session } = useSession();
  const { isPro } = usePlanTier();
  const { prefs } = useUserPreferences();
  const [sessionPickerOpen, setSessionPickerOpen] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [avatarError, setAvatarError] = useState(false);

  const user = session?.user;
  const activeAvatar = prefs.customAvatarUrl || user?.image || '';
  const activeDisplayName = prefs.displayName || user?.name || (user ? 'Pro User' : 'ゲスト');

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
    if (id === 'virtual_gp') {
      return activeHub === 'telemetry' && pitStrategyViewMode === 'virtual_gp';
    }
    if (id === 'telemetry_delta') {
      return activeHub === 'telemetry' && detailedTelemetryTab === 'delta_matrix';
    }
    if (id === 'war_room') {
      return activeHub === 'telemetry' && pitStrategyViewMode === 'war_room';
    }
    if (id === 'fod_news') {
      return activeHub === 'news';
    }
    if (id === 'season_calendar') {
      return appMode === 'season' && activeHub === 'season';
    }
    if (id === 'telemetry_laps') {
      return activeHub === 'telemetry' && detailedTelemetryTab !== 'delta_matrix' && pitStrategyViewMode !== 'war_room' && pitStrategyViewMode !== 'virtual_gp';
    }
    if (id === 'drivers' || id === 'teams' || id === 'circuits' || id === 'tyres' || id === 'drama' || id === 'glossary') {
      return appMode === 'library' && librarySubTab === id;
    }
    if (id === 'fia_rules' || id === '2026_regulations') {
      return appMode === 'library' && (librarySubTab === 'rules' || librarySubTab === 'regulations');
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
        (item.description && item.description.toLowerCase().includes(q))
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
        <div className="flex-1 min-h-0 overflow-y-auto p-3 space-y-4 no-scrollbar">
          {filteredGroups.map((group, gIdx) => (
            <div key={gIdx} className="space-y-1">
              {/* Group Title */}
              <div className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-racing font-bold text-slate-400 uppercase tracking-wider">
                <span>{group.groupIcon}</span>
                <span>{group.groupTitle}</span>
              </div>

              {/* Items in Group */}
              <div className="space-y-1">
                {group.items.map((item) => {
                  const isActive = getIsActive(item.id);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        if (item.id === 'profile_settings') {
                          setProfileModalOpen(true);
                          return;
                        }
                        if (item.id === 'pitwall_pro') {
                          onOpenUpgradeModal?.();
                          onClose();
                          return;
                        }
                        onSelectFeature(item.id);
                        onClose();
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl transition-all flex items-start gap-2.5 cursor-pointer border ${
                        isActive
                          ? 'bg-gradient-to-r from-red-600/20 via-red-600/10 to-transparent border-red-500/50 text-white shadow-sm ring-1 ring-red-500/30'
                          : 'bg-slate-900/40 hover:bg-slate-800/70 border-white/5 hover:border-white/15 text-slate-300 hover:text-white'
                      }`}
                    >
                      <span className="text-base mt-0.5 shrink-0">{item.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1.5">
                          <span
                            className={`text-xs font-racing font-bold truncate ${
                              isActive ? 'text-red-400' : 'text-slate-200'
                            }`}
                          >
                            {item.label}
                          </span>
                          {item.badge && (
                            <span
                              className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded shrink-0 ${
                                item.badgeColor || 'bg-slate-800 text-slate-300'
                              }`}
                            >
                              {item.badge}
                            </span>
                          )}
                        </div>
                        {item.description && (
                          <p className="text-[10px] text-slate-400 leading-tight mt-0.5 line-clamp-1">
                            {item.description}
                          </p>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Collapsible Session & Driver Filter Tool (Inside Drawer) */}
          {sessionProps && (
            <div className="pt-2 border-t border-white/10 space-y-2">
              <button
                type="button"
                onClick={() => setSessionPickerOpen((prev) => !prev)}
                className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl bg-slate-900/60 hover:bg-slate-900 border border-white/5 text-xs font-racing font-bold text-slate-300 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  <span>⚙️</span>
                  <span>テレメトリーセッション・出走選択</span>
                </div>
                <span className="text-slate-500 font-mono text-[10px]">
                  {sessionPickerOpen ? '▲ 閉じる' : '▼ 展開'}
                </span>
              </button>

              {sessionPickerOpen && (
                <div className="p-3 rounded-2xl bg-slate-900/80 border border-white/10 space-y-2.5 text-xs animate-fade-in">
                  {/* Year */}
                  <div>
                    <label className="text-[10px] font-mono text-slate-400 block mb-1">
                      開催年 (YEAR)
                    </label>
                    <select
                      value={sessionProps.selectedYear}
                      onChange={(e) => sessionProps.onYearChange(e.target.value)}
                      className="w-full bg-slate-950 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white"
                    >
                      {['2026', '2025', '2024', '2023', '2022', '2021'].map((y) => (
                        <option key={y} value={y}>
                          {y}年
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Meeting */}
                  <div>
                    <label className="text-[10px] font-mono text-slate-400 block mb-1">
                      グランプリ (GRAND PRIX)
                    </label>
                    <select
                      value={sessionProps.selectedMeetingKey ?? ''}
                      onChange={(e) => sessionProps.onMeetingChange(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white"
                    >
                      {sessionProps.sessions.map((s) => (
                        <option key={s.meeting_key} value={s.meeting_key}>
                          {s.meeting_name || `Round ${s.meeting_key}`}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      onSelectFeature('telemetry_laps');
                      onClose();
                    }}
                    className="w-full py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-racing font-bold text-xs transition-colors cursor-pointer shadow-sm mt-1"
                  >
                    テレメトリー画面へ適用 ➔
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Drawer User Profile & Settings Footer (Discord/Slack/Notion Style) ── */}
        <div className="p-3 border-t border-white/10 bg-slate-950/95 backdrop-blur-md shrink-0">
          {session?.user ? (
            <div className="space-y-2.5">
              {/* User Identity Row */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
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
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="font-racing font-bold text-xs text-white truncate">
                        {activeDisplayName}
                      </p>
                      <span className={`px-1.5 py-0.2 rounded text-[8px] font-racing font-black ${
                        isPro
                          ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 shadow-sm'
                          : 'bg-slate-800 text-slate-400 border border-white/10'
                      }`}>
                        {isPro ? 'PRO' : 'FREE'}
                      </span>
                    </div>
                    {selectedTeam && (
                      <p className="text-[10px] font-mono truncate" style={{ color: selectedTeam.color }}>
                        🏁 {selectedTeam.name}
                      </p>
                    )}
                  </div>
                </div>

                {/* Quick Icon Actions */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => setProfileModalOpen(true)}
                    className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/10 hover:border-amber-500/40 transition-all cursor-pointer shadow-sm"
                    title="プロフィール・推しチーム設定 (⚙️)"
                    aria-label="設定"
                  >
                    <span className="text-sm">⚙️</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => signOut()}
                    className="p-1.5 rounded-lg bg-slate-900 hover:bg-rose-950/60 text-slate-400 hover:text-rose-300 border border-white/10 hover:border-rose-500/30 transition-all cursor-pointer shadow-sm"
                    title="ログアウト"
                    aria-label="ログアウト"
                  >
                    <span className="text-sm">🚪</span>
                  </button>
                </div>
              </div>

              {/* Push button to open Settings */}
              <button
                type="button"
                onClick={() => setProfileModalOpen(true)}
                className="w-full py-1.5 px-3 rounded-xl bg-slate-900/90 hover:bg-slate-850 text-slate-200 hover:text-white border border-white/10 hover:border-amber-500/30 text-xs font-racing font-bold transition-all flex items-center justify-between cursor-pointer group shadow-sm"
              >
                <div className="flex items-center gap-2">
                  <span className="text-amber-400">⚙️</span>
                  <span>推しチーム・プロフィール設定</span>
                </div>
                <span className="text-[10px] text-slate-400 group-hover:text-amber-300 font-mono">
                  編集 ➔
                </span>
              </button>

              {!isPro && (
                <button
                  type="button"
                  onClick={() => {
                    onOpenUpgradeModal?.();
                    onClose();
                  }}
                  className="w-full mt-2 py-1.5 px-3 rounded-xl bg-gradient-to-r from-amber-500/20 via-yellow-400/20 to-red-500/20 border border-amber-500/40 text-amber-300 text-xs font-racing font-bold flex items-center justify-between cursor-pointer hover:brightness-125 transition-all shadow-sm"
                >
                  <div className="flex items-center gap-1.5">
                    <span>💎</span>
                    <span>Pitwall Pro へアップグレード</span>
                  </div>
                  <span className="text-[10px] font-mono text-amber-400">➔</span>
                </button>
              )}
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
        <ProfileSettingsModal onClose={() => setProfileModalOpen(false)} />
      )}
    </div>
  );
}
