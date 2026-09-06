'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useSession } from 'next-auth/react';
import {
  KNOWLEDGE_TEAMS,
  KNOWLEDGE_DRIVERS,
  type DriverProfile,
  type TeamProfile,
} from '@/data/f1KnowledgeData';
import { useUserPreferences, getUserPreferences, saveUserPreferences, type UserPreferences } from '@/lib/userPreferences';

interface ProfileSettingsModalProps {
  onClose: () => void;
}

const FAN_TYPES = [
  '🏎️ 推し活・ドラマ派',
  '📊 データ分析・テレメトリー派',
  '🔰 F1初心者・勉強中',
  '🏁 古参レースファン',
  '🕹️ シムレース・eSports派',
];

export default function ProfileSettingsModal({ onClose }: ProfileSettingsModalProps) {
  const { data: session } = useSession();
  const { prefs, update } = useUserPreferences();
  const [mounted, setMounted] = useState(false);

  // Local form state initialized directly from stored preferences
  const [displayName, setDisplayName] = useState(() => {
    const current = getUserPreferences();
    return current.displayName || prefs.displayName || session?.user?.name || '';
  });
  const [customAvatarUrl, setCustomAvatarUrl] = useState(() => {
    const current = getUserPreferences();
    return current.customAvatarUrl || prefs.customAvatarUrl || session?.user?.image || '';
  });
  const [favoriteTeamId, setFavoriteTeamId] = useState(() => {
    const current = getUserPreferences();
    return current.favoriteTeamId || prefs.favoriteTeamId || 'ferrari';
  });
  const [favoriteDriverCode, setFavoriteDriverCode] = useState(() => {
    const current = getUserPreferences();
    return current.favoriteDriverCode || prefs.favoriteDriverCode || 'HAM';
  });
  const [fanType, setFanType] = useState(() => {
    const current = getUserPreferences();
    return current.fanType || prefs.fanType || '推し活・ドラマ派';
  });
  const [activeSubTab, setActiveSubTab] = useState<'avatar' | 'favorites' | 'plan'>('avatar');
  const [savedNotice, setSavedNotice] = useState(false);

  // Sync state whenever modal mounts or preferences change
  useEffect(() => {
    setMounted(true);
    const current = getUserPreferences();
    if (current.displayName) setDisplayName(current.displayName);
    if (current.customAvatarUrl) setCustomAvatarUrl(current.customAvatarUrl);
    if (current.favoriteTeamId) setFavoriteTeamId(current.favoriteTeamId);
    if (current.favoriteDriverCode) setFavoriteDriverCode(current.favoriteDriverCode);
    if (current.fanType) setFanType(current.fanType);
  }, []);

  // Keyboard escape to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const selectedTeam = KNOWLEDGE_TEAMS.find((t) => t.id === favoriteTeamId);
  const selectedDriver = KNOWLEDGE_DRIVERS.find((d) => d.code === favoriteDriverCode);
  const themeColor = selectedTeam?.color || '#38bdf8';

  const handleSave = () => {
    const payload = {
      displayName,
      customAvatarUrl,
      favoriteTeamId,
      favoriteDriverCode,
      fanType,
    };
    // Save to localStorage immediately
    saveUserPreferences(payload);
    // Notify React hook
    update(payload);
    setSavedNotice(true);
    setTimeout(() => {
      setSavedNotice(false);
      onClose();
    }, 600);
  };

  const handleSelectDriverAsAvatar = (driver: DriverProfile) => {
    if (driver.visualAsset?.imageUrl) {
      setCustomAvatarUrl(driver.visualAsset.imageUrl);
      setFavoriteDriverCode(driver.code);
    }
  };

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in">
      {/* Modal Card */}
      <div
        className="glass-card bg-slate-950/95 border border-white/15 w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl shadow-2xl overflow-hidden relative"
        style={{ borderTopColor: themeColor, borderTopWidth: 4 }}
      >
        {/* Modal Header */}
        <div className="p-4 sm:px-6 bg-slate-900/90 border-b border-white/10 flex items-center justify-between gap-3 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center text-sm shadow-md border"
              style={{
                backgroundColor: `${themeColor}20`,
                borderColor: `${themeColor}60`,
                color: themeColor,
              }}
            >
              ⚙️
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-racing font-bold text-white leading-tight">
                メンバープロフィール & 個人設定
              </h2>
              <p className="text-[10px] text-slate-400 font-mono">
                アイコン、推しチーム・推し選手、表示名のカスタマイズ
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center text-sm font-bold transition-all cursor-pointer"
            title="閉じる (ESC)"
          >
            ✕
          </button>
        </div>

        {/* Current User Overview Card */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900/80 via-slate-900/40 to-slate-950/80 border-b border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 w-full sm:w-auto">
            {/* Live Avatar Preview */}
            <div
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden border-2 shadow-xl bg-slate-800 flex-shrink-0 relative group"
              style={{ borderColor: themeColor }}
            >
              {customAvatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={customAvatarUrl}
                  alt="Avatar"
                  className="w-full h-full object-cover object-top"
                />
              ) : (
                <div className="w-full h-full bg-amber-500 text-slate-950 font-racing font-bold text-xl flex items-center justify-center">
                  {(displayName || 'U').charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-racing font-bold text-white truncate">
                  {displayName || session?.user?.name || 'Pro User'}
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-racing font-black bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 shadow-sm flex-shrink-0">
                  PRO
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono truncate">
                {session?.user?.email || 'demo@f1telemetry.pro'}
              </p>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                {selectedTeam && (
                  <span
                    className="px-2 py-0.5 rounded-full text-[10px] font-racing font-bold border"
                    style={{
                      backgroundColor: `${selectedTeam.color}20`,
                      borderColor: `${selectedTeam.color}60`,
                      color: selectedTeam.color,
                    }}
                  >
                    🏁 {selectedTeam.name}
                  </span>
                )}
                {selectedDriver && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-racing font-bold bg-slate-800 border border-white/10 text-slate-200">
                    🏎️ #{selectedDriver.number} {selectedDriver.code}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="text-right flex-shrink-0 hidden sm:block">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-racing font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              AI 戦略アナリスト 有効
            </span>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 p-2 px-4 sm:px-6 bg-slate-900/60 border-b border-white/10 text-xs">
          <button
            onClick={() => setActiveSubTab('avatar')}
            className={`px-3 py-1.5 rounded-xl font-racing font-bold transition-all cursor-pointer ${
              activeSubTab === 'avatar'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            👤 アイコン選択
          </button>
          <button
            onClick={() => setActiveSubTab('favorites')}
            className={`px-3 py-1.5 rounded-xl font-racing font-bold transition-all cursor-pointer ${
              activeSubTab === 'favorites'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            ❤️ 推しチーム & 選手
          </button>
          <button
            onClick={() => setActiveSubTab('plan')}
            className={`px-3 py-1.5 rounded-xl font-racing font-bold transition-all cursor-pointer ${
              activeSubTab === 'plan'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            ⭐ プラン & 特典
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-5">
          {/* ── SUB-TAB 1: AVATAR PICKER ── */}
          {activeSubTab === 'avatar' && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-racing font-bold text-slate-300 mb-1.5 block">
                  表示名 (ユーザー名)
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="お好きな表示名を入力..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs font-racing focus:outline-none focus:border-sky-400 transition-colors"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-racing font-bold text-slate-300">
                    F1ドライバーのポートレートからアイコンを選ぶ (全30名)
                  </label>
                  <span className="text-[10px] text-slate-400 font-mono">
                    クリックで即時プレビュー反映
                  </span>
                </div>

                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2.5 max-h-[300px] overflow-y-auto p-2 bg-slate-900/60 rounded-2xl border border-white/5">
                  {KNOWLEDGE_DRIVERS.map((driver) => {
                    const isSelected = customAvatarUrl === driver.visualAsset?.imageUrl;
                    return (
                      <button
                        key={driver.id}
                        onClick={() => handleSelectDriverAsAvatar(driver)}
                        className={`flex flex-col items-center gap-1.5 p-2 rounded-xl border transition-all cursor-pointer group ${
                          isSelected
                            ? 'bg-sky-500/20 border-sky-400 shadow-lg scale-105'
                            : 'bg-slate-800/40 border-white/5 hover:bg-slate-800 hover:border-white/20'
                        }`}
                        title={`${driver.fullName} (${driver.team})`}
                      >
                        <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl overflow-hidden bg-slate-900 relative shadow-sm">
                          {driver.visualAsset?.imageUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={driver.visualAsset.imageUrl}
                              alt={driver.fullName}
                              className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform"
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center font-racing font-bold text-xs text-white">
                              {driver.code}
                            </div>
                          )}
                          {isSelected && (
                            <div className="absolute inset-0 bg-sky-500/30 flex items-center justify-center text-white text-xs font-bold">
                              ✓
                            </div>
                          )}
                        </div>
                        <span className="text-[10px] font-racing font-bold text-slate-300 truncate max-w-full text-center">
                          {driver.code}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ── SUB-TAB 2: FAVORITES ── */}
          {activeSubTab === 'favorites' && (
            <div className="space-y-4">
              {/* Favorite Team */}
              <div>
                <label className="text-xs font-racing font-bold text-slate-300 mb-2 block">
                  🏁 推しチーム (応援するコンストラクター)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {KNOWLEDGE_TEAMS.map((team) => {
                    const isSelected = favoriteTeamId === team.id;
                    return (
                      <button
                        key={team.id}
                        onClick={() => setFavoriteTeamId(team.id)}
                        className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'shadow-lg scale-[1.02]'
                            : 'bg-slate-900/60 border-white/5 hover:bg-slate-800/80 hover:border-white/15'
                        }`}
                        style={{
                          backgroundColor: isSelected ? `${team.color}25` : undefined,
                          borderColor: isSelected ? team.color : undefined,
                        }}
                      >
                        <div className="flex items-center gap-1.5 mb-1">
                          <span
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: team.color }}
                          />
                          <span className="text-xs font-racing font-bold text-white truncate">
                            {team.name}
                          </span>
                        </div>
                        <p className="text-[9px] text-slate-400 font-mono truncate">
                          {team.powerUnit}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Favorite Driver */}
              <div>
                <label className="text-xs font-racing font-bold text-slate-300 mb-2 block">
                  🏎️ 推しドライバー (一番応援している選手)
                </label>
                <select
                  value={favoriteDriverCode}
                  onChange={(e) => setFavoriteDriverCode(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs font-racing focus:outline-none focus:border-sky-400 transition-colors"
                >
                  {KNOWLEDGE_DRIVERS.map((d) => (
                    <option key={d.id} value={d.code}>
                      #{d.number} {d.fullName} ({d.team})
                    </option>
                  ))}
                </select>
              </div>

              {/* Fan Style */}
              <div>
                <label className="text-xs font-racing font-bold text-slate-300 mb-2 block">
                  🏷️ 応援スタイル / ファンタイプ
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {FAN_TYPES.map((type) => {
                    const isSelected = fanType === type;
                    return (
                      <button
                        key={type}
                        onClick={() => setFanType(type)}
                        className={`p-2.5 rounded-xl border text-xs font-racing font-bold text-center transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-blue-600 text-white border-blue-400 shadow-md'
                            : 'bg-slate-900/60 border-white/5 text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        {type}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ── SUB-TAB 3: PLAN ── */}
          {activeSubTab === 'plan' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-950/40 via-yellow-900/20 to-slate-900 border border-amber-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🏆</span>
                    <div>
                      <h4 className="text-sm font-racing font-bold text-amber-300">
                        PADOROKU PRO MEMBERSHIP
                      </h4>
                      <p className="text-[10px] text-slate-400 font-mono">
                        プレミアム分析＆AIストラテジスト完全アクセス
                      </p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-racing font-black bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-950 shadow-md">
                    ACTIVE
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-2 border-t border-amber-500/20">
                  <div className="flex items-center gap-2 text-slate-200">
                    <span className="text-emerald-400">✓</span>
                    <span>AIストラテジスト（レース戦略リアルタイム予測）</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-200">
                    <span className="text-emerald-400">✓</span>
                    <span>チーム無線リアルタイム文字起こし＆AI戦術要約</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-200">
                    <span className="text-emerald-400">✓</span>
                    <span>3層同期Car Telemetry詳細テレメトリー分析</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-200">
                    <span className="text-emerald-400">✓</span>
                    <span>レースノート保存＆Markdownエクスポート</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3.5 sm:px-6 bg-slate-900/90 border-t border-white/10 flex items-center justify-between gap-3 flex-shrink-0">
          <div>
            {savedNotice && (
              <span className="text-xs font-racing font-bold text-emerald-400 flex items-center gap-1 animate-fade-in">
                <span>✓</span>
                <span>設定を保存しました！</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-racing text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              キャンセル
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 rounded-xl text-xs font-racing font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/30 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>💾</span>
              <span>設定を保存</span>
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
