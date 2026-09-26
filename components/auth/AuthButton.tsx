'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useUserPreferences } from '@/lib/userPreferences';
import { usePlanTier } from '@/lib/tierService';
import { KNOWLEDGE_TEAMS, KNOWLEDGE_DRIVERS } from '@/data/f1KnowledgeData';
import ProfileSettingsModal from './ProfileSettingsModal';

interface AuthButtonProps {
  onOpenAuthModal: () => void;
  onOpenUpgradeModal?: () => void;
}

export default function AuthButton({ onOpenAuthModal, onOpenUpgradeModal }: AuthButtonProps) {
  const { data: session, status } = useSession();
  const { prefs } = useUserPreferences();
  const { isPro, aiUsage } = usePlanTier();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Loading skeleton state
  if (status === 'loading') {
    return (
      <div className="w-24 h-8 rounded-xl bg-slate-900/80 animate-pulse border border-white/5" />
    );
  }

  // Determine active avatar & name (custom preference takes priority over session defaults)
  const user = session?.user;
  const isProUser = isPro;

  const activeAvatar = prefs.customAvatarUrl || user?.image || '';
  const activeDisplayName = prefs.displayName || user?.name || (isProUser ? 'Pro User' : 'Free User');

  const selectedTeam = KNOWLEDGE_TEAMS.find((t) => t.id === prefs.favoriteTeamId);
  const selectedDriver = KNOWLEDGE_DRIVERS.find((d) => d.code === prefs.favoriteDriverCode);
  const teamColor = selectedTeam?.color || '#38bdf8';

  // If user is not signed in
  if (!session || !session.user) {
    return (
      <>
        <button
          onClick={onOpenAuthModal}
          className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/10 hover:border-white/20 text-slate-200 text-xs font-racing font-bold transition-all shadow-md cursor-pointer flex-shrink-0"
        >
          <span>🔑</span>
          <span>ログイン</span>
        </button>
        {profileModalOpen && (
          <ProfileSettingsModal onClose={() => setProfileModalOpen(false)} />
        )}
      </>
    );
  }

  // Authenticated state with rich dropdown
  const initial = (activeDisplayName || 'U').charAt(0).toUpperCase();

  return (
    <>
      <div className="relative shrink-0" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen((v) => !v)}
          className={`flex items-center gap-1.5 p-1 pl-1.5 pr-2 rounded-xl bg-slate-900/90 hover:bg-slate-850 border text-white transition-all shadow-md cursor-pointer group flex-shrink-0 ${
            isProUser ? 'border-amber-500/30' : 'border-white/15'
          }`}
          title="アカウント設定 & 個人設定"
        >
          {/* User Avatar */}
          {activeAvatar && !avatarError ? (
            <div
              className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg overflow-hidden border shadow-sm flex-shrink-0"
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
            <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-lg font-racing font-bold text-xs flex items-center justify-center flex-shrink-0 ${
              isProUser ? 'bg-amber-500 text-slate-950' : 'bg-slate-700 text-white'
            }`}>
              {initial}
            </div>
          )}

          {/* User Name & Role Badge */}
          <div className="flex items-center gap-1 shrink-0">
            <span suppressHydrationWarning className="text-[11px] sm:text-xs font-racing font-bold max-w-[90px] sm:max-w-[120px] md:max-w-[150px] truncate hidden sm:inline">
              {activeDisplayName}
            </span>
            {isProUser ? (
              <span suppressHydrationWarning className="px-1.5 py-0.2 rounded text-[9px] font-racing font-black bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 shadow-sm">
                PRO
              </span>
            ) : (
              <span suppressHydrationWarning className="px-1.5 py-0.2 rounded text-[9px] font-racing font-bold bg-slate-800 text-slate-300 border border-white/10">
                FREE
              </span>
            )}
          </div>

          <span className="text-[9px] text-slate-400 group-hover:text-white transition-colors">
            ▼
          </span>
        </button>

        {/* Dropdown Menu */}
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-slate-900/95 border border-white/15 p-2.5 shadow-2xl backdrop-blur-md z-50 space-y-2 text-xs animate-fade-in">
            {/* User Details */}
            <div className="px-2 py-1.5 border-b border-white/10 space-y-1">
              <div className="flex items-center justify-between">
                <p className="font-racing font-bold text-white truncate max-w-[140px]">
                  {activeDisplayName}
                </p>
                {isProUser ? (
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-racing font-black bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950">
                    PRO
                  </span>
                ) : (
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-racing font-bold bg-slate-800 text-slate-300 border border-white/10">
                    FREE
                  </span>
                )}
              </div>
              <p className="font-mono text-[10px] text-slate-400 truncate">{user?.email}</p>

              {/* Favourites Tags */}
              <div className="pt-1 flex items-center gap-1.5 flex-wrap">
                {selectedTeam && (
                  <span
                    className="px-2 py-0.5 rounded text-[9px] font-racing font-bold border"
                    style={{
                      backgroundColor: `${selectedTeam.color}20`,
                      borderColor: `${selectedTeam.color}50`,
                      color: selectedTeam.color,
                    }}
                  >
                    🏁 {selectedTeam.name}
                  </span>
                )}
                {selectedDriver && (
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-racing font-bold bg-slate-800 border border-white/10 text-slate-300">
                    🏎️ #{selectedDriver.number} {selectedDriver.code}
                  </span>
                )}
              </div>

              {/* Tier status indicator */}
              <div className="pt-1 flex items-center justify-between">
                {isProUser ? (
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[10px] font-racing text-emerald-300 font-semibold">
                      AI 戦略アナリスト 無制限
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center justify-between w-full text-[10px] font-mono">
                    <span className="text-amber-400 font-semibold">
                      AI相談: 残り {aiUsage.remaining}/{aiUsage.max}回
                    </span>
                    <span className="text-slate-400">
                      無料プラン
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Profile Settings Button */}
            <button
              onClick={() => {
                setDropdownOpen(false);
                setProfileModalOpen(true);
              }}
              className="w-full text-left px-2.5 py-2 rounded-xl text-slate-200 hover:bg-slate-800 hover:text-white transition-colors flex items-center gap-2 font-racing font-bold cursor-pointer"
            >
              <span>⚙️</span>
              <span>プロフィール・推し設定</span>
            </button>

            {/* Plan Settings / Test Toggle Button */}
            <button
              onClick={() => {
                setDropdownOpen(false);
                onOpenUpgradeModal?.();
              }}
              className="w-full text-left px-2.5 py-2 rounded-xl text-slate-200 hover:bg-slate-800 hover:text-white transition-colors flex items-center justify-between font-racing font-bold cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <span>💎</span>
                <span>プラン確認・切替テスト</span>
              </div>
              <span
                className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold ${
                  isPro ? 'bg-amber-500/20 text-amber-300' : 'bg-cyan-500/20 text-cyan-300'
                }`}
              >
                {isPro ? 'PRO' : 'FREE'}
              </span>
            </button>

            {/* Logout Button */}
            <button
              onClick={() => {
                setDropdownOpen(false);
                signOut();
              }}
              className="w-full text-left px-2.5 py-2 rounded-xl text-red-300 hover:bg-red-500/15 hover:text-red-200 transition-colors flex items-center gap-2 font-racing font-bold cursor-pointer border-t border-white/5 pt-2"
            >
              <span>🚪</span>
              <span>ログアウト</span>
            </button>
          </div>
        )}
      </div>

      {/* Profile Settings Modal */}
      {profileModalOpen && (
        <ProfileSettingsModal
          onClose={() => setProfileModalOpen(false)}
          onOpenUpgradeModal={onOpenUpgradeModal}
        />
      )}
    </>
  );
}
