'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';

interface AuthButtonProps {
  onOpenAuthModal: () => void;
}

export default function AuthButton({ onOpenAuthModal }: AuthButtonProps) {
  const { data: session, status } = useSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);
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

  // Authenticated state with dropdown
  if (session && session.user) {
    const user = session.user;
    const initial = (user.name || user.email || 'U').charAt(0).toUpperCase();

    return (
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen((v) => !v)}
          className="flex items-center gap-1.5 p-1 pl-1.5 pr-2 rounded-xl bg-slate-900/90 hover:bg-slate-850 border border-amber-500/30 text-white transition-all shadow-md cursor-pointer group flex-shrink-0"
          title="アカウント設定 & メンバー情報"
        >
          {/* User Avatar */}
          {user.image && !avatarError ? (
            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg overflow-hidden border border-amber-400/50 flex-shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={user.image}
                alt={user.name || 'User'}
                className="w-full h-full object-cover object-top"
                onError={() => setAvatarError(true)}
              />
            </div>
          ) : (
            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-amber-500 text-slate-950 font-racing font-bold text-xs flex items-center justify-center flex-shrink-0">
              {initial}
            </div>
          )}

          {/* User Name & Pro Badge */}
          <div className="flex items-center gap-1">
            <span className="text-[11px] sm:text-xs font-racing font-bold max-w-[65px] sm:max-w-[120px] truncate hidden xs:inline">
              {user.name || 'Pro User'}
            </span>
            <span className="px-1.5 py-0.2 rounded text-[9px] font-racing font-black bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 shadow-sm">
              PRO
            </span>
          </div>

          <span className="text-[9px] text-slate-400 group-hover:text-white transition-colors">
            ▼
          </span>
        </button>

        {/* Dropdown Menu */}
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-slate-900/95 border border-white/15 p-2.5 shadow-2xl backdrop-blur-md z-50 space-y-2 text-xs animate-fade-in">
            <div className="px-2 py-1.5 border-b border-white/10 space-y-0.5">
              <p className="font-racing font-bold text-white truncate">{user.name || 'Pro User'}</p>
              <p className="font-mono text-[10px] text-slate-400 truncate">{user.email}</p>
              <div className="pt-1 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] font-racing text-emerald-300 font-semibold">
                  AI 戦略アナリスト 有効
                </span>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={() => {
                setDropdownOpen(false);
                signOut();
              }}
              className="w-full text-left px-2.5 py-2 rounded-xl text-red-300 hover:bg-red-500/15 hover:text-red-200 transition-colors flex items-center gap-2 font-racing font-bold cursor-pointer"
            >
              <span>🚪</span>
              <span>ログアウト</span>
            </button>
          </div>
        )}
      </div>
    );
  }

  // Unauthenticated state: Login / Sign-up Button
  return (
    <button
      onClick={onOpenAuthModal}
      className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-gradient-to-r from-sky-500/20 to-blue-600/20 hover:from-sky-500/30 hover:to-blue-600/30 text-sky-300 hover:text-white border border-sky-500/40 text-[11px] sm:text-xs font-racing font-bold transition-all shadow-md flex items-center gap-1 sm:gap-1.5 cursor-pointer flex-shrink-0"
    >
      <span>🔑</span>
      <span className="hidden sm:inline">ログイン / サインアップ</span>
      <span className="sm:hidden">ログイン</span>
    </button>
  );
}
