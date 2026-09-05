'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
}

export default function AuthModal({
  isOpen,
  onClose,
  title = 'F1 Intelligence メンバー認証',
  description = 'AI戦略アナリストおよびチーム無線AI解析は認証メンバー専用機能です。',
}: AuthModalProps) {
  const [email, setEmail] = useState('demo@f1telemetry.pro');
  const [password, setPassword] = useState('f1pro2024');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setErrorMessage('認証に失敗しました。メールアドレスまたはパスワードを確認してください。');
      } else {
        onClose();
      }
    } catch {
      setErrorMessage('ログイン中にエラーが発生しました。');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemoLogin = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const res = await signIn('credentials', {
        email: 'demo@f1telemetry.pro',
        password: 'f1pro2024',
        redirect: false,
      });

      if (res?.error) {
        setErrorMessage('デモログインに失敗しました。');
      } else {
        onClose();
      }
    } catch {
      setErrorMessage('デモログインエラーが発生しました。');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      await signIn('google', { redirect: false });
      onClose();
    } catch {
      setErrorMessage('Googleログイン中にエラーが発生しました。');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-slate-900/95 border border-white/15 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5 text-white">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
          aria-label="Close modal"
        >
          ✕
        </button>

        {/* Header */}
        <div className="space-y-1.5 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-f1-red/20 border border-f1-red/40 text-2xl shadow-lg">
            🏎️
          </div>
          <h2 className="text-xl font-racing font-black text-white tracking-wide">
            {title}
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto">
            {description}
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/30 text-red-300 text-xs text-center font-mono">
            ⚠️ {errorMessage}
          </div>
        )}

        {/* Quick Demo Login (Recommended for Reviewers & Testing) */}
        <div className="bg-gradient-to-r from-blue-950/50 to-sky-950/50 p-3.5 rounded-2xl border border-sky-500/30 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-mono">
            <span className="text-sky-300 font-bold flex items-center gap-1">
              <span>⚡</span>
              <span>評価・即時テスト用</span>
            </span>
            <span className="text-slate-400">1-Click Pro Access</span>
          </div>
          <button
            onClick={handleQuickDemoLogin}
            disabled={isLoading}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white text-xs font-racing font-bold shadow-lg shadow-sky-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>🚀</span>
                <span>デモアカウントで今すぐログイン (Pro権限)</span>
              </>
            )}
          </button>
          <p className="text-[10px] text-slate-400 text-center font-mono">
            demo@f1telemetry.pro / f1pro2024 (入力不要でワンクリック)
          </p>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 text-xs text-slate-500 font-mono">
          <div className="flex-1 h-px bg-white/10" />
          <span>または 認証情報でサインイン</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleCredentialsSubmit} className="space-y-3">
          <div>
            <label className="text-[11px] font-mono text-slate-400 block mb-1">
              メールアドレス
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-slate-950/80 border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-sky-500 transition-colors"
              placeholder="user@example.com"
            />
          </div>

          <div>
            <label className="text-[11px] font-mono text-slate-400 block mb-1">
              パスワード
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-slate-950/80 border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-sky-500 transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-racing font-bold border border-white/10 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <span>🔑 メールアドレスでサインイン</span>
            )}
          </button>
        </form>

        {/* Google OAuth Button */}
        <button
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className="w-full py-2 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-mono font-medium border border-white/5 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <span>🌐</span>
          <span>Googleアカウントでサインイン</span>
        </button>

        {/* Footer Note */}
        <p className="text-[10px] text-slate-500 text-center font-mono">
          ※ サーキット・ドライバー名鑑・テレメトリー閲覧は未ログインでも利用可能です。
        </p>
      </div>
    </div>
  );
}
