'use client';

/**
 * components/radio/TeamRadioVaultModal.tsx
 * Legendary F1 Team Radio Vault Modal.
 * Audio Player, Category Filters, English/Japanese Transcripts, Tactical Context & Deep Links.
 */

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  VAULT_TEAM_RADIOS,
  RADIO_CATEGORY_CONFIG,
  type RadioCategory,
  type VaultRadioItem,
} from '@/data/f1RadioVaultData';
import { getProxiedAudioUrl } from '@/lib/telemetryUtils';

interface TeamRadioVaultModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToDrama?: () => void;
}

export default function TeamRadioVaultModal({
  isOpen,
  onClose,
  onNavigateToDrama,
}: TeamRadioVaultModalProps) {
  const [mounted, setMounted] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | RadioCategory>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [activePlayingId, setActivePlayingId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Keyboard escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Clean up audio on unmount or radio change
  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setActivePlayingId(null);
  };

  useEffect(() => {
    if (!isOpen) stopAudio();
  }, [isOpen]);

  const handlePlayToggle = (radio: VaultRadioItem) => {
    if (!radio.audioUrl) return;

    if (activePlayingId === radio.id && isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
      return;
    }

    if (activePlayingId !== radio.id) {
      stopAudio();
      setActivePlayingId(radio.id);

      const audio = new Audio(getProxiedAudioUrl(radio.audioUrl));
      audioRef.current = audio;

      audio.onloadedmetadata = () => setDuration(audio.duration || 12);
      audio.ontimeupdate = () => setCurrentTime(audio.currentTime || 0);
      audio.onended = () => {
        setIsPlaying(false);
        setCurrentTime(0);
      };
      audio.play().catch(() => setIsPlaying(false));
      setIsPlaying(true);
    } else {
      audioRef.current?.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setCurrentTime(val);
    if (audioRef.current) {
      audioRef.current.currentTime = val;
    }
  };

  // Filtered radios
  const filteredRadios = useMemo(() => {
    return VAULT_TEAM_RADIOS.filter((r) => {
      if (selectedCategory !== 'ALL' && r.category !== selectedCategory) return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        r.title.toLowerCase().includes(q) ||
        r.speaker.toLowerCase().includes(q) ||
        r.team.toLowerCase().includes(q) ||
        r.gpName.toLowerCase().includes(q) ||
        r.transcriptEn.toLowerCase().includes(q) ||
        r.transcriptJa.toLowerCase().includes(q) ||
        r.tags.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [selectedCategory, searchQuery]);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="glass-card bg-slate-950/95 border border-sky-500/30 w-full max-w-4xl max-h-[92vh] flex flex-col rounded-3xl shadow-2xl overflow-hidden relative">
        {/* Top Header */}
        <div className="p-4 sm:px-6 bg-slate-900/90 border-b border-white/10 flex items-center justify-between gap-3 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500/20 to-rose-500/20 border border-amber-500/40 flex items-center justify-center text-xl shadow-inner">
              🎙️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-racing font-bold text-white leading-tight">
                  伝説のチーム無線ベスト集 (RADIO VAULT)
                </h2>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full font-mono">
                  全{VAULT_TEAM_RADIOS.length}選
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                F1史を揺るがした名言・絶叫・爆笑の無線を日英対訳＆戦術解説付きで追体験
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              stopAudio();
              onClose();
            }}
            className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center text-sm font-bold transition-all cursor-pointer"
            title="閉じる (Esc)"
          >
            ✕
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-3 sm:px-6 bg-slate-950/70 border-b border-white/5 space-y-3 flex-shrink-0">
          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setSelectedCategory('ALL')}
              className={`px-3 py-1.5 rounded-xl text-xs font-racing font-bold transition-all cursor-pointer border ${
                selectedCategory === 'ALL'
                  ? 'bg-blue-600 text-white border-blue-400 shadow-md shadow-blue-500/30'
                  : 'bg-slate-900 text-slate-400 border-white/5 hover:text-white hover:bg-slate-800'
              }`}
            >
              すべて ({VAULT_TEAM_RADIOS.length})
            </button>
            {(Object.keys(RADIO_CATEGORY_CONFIG) as RadioCategory[]).map((cat) => {
              const cfg = RADIO_CATEGORY_CONFIG[cat];
              const count = VAULT_TEAM_RADIOS.filter((r) => r.category === cat).length;
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-racing font-bold transition-all cursor-pointer border flex items-center gap-1.5 ${
                    isActive
                      ? 'shadow-md ring-1 ring-white/30'
                      : 'bg-slate-900 text-slate-400 border-white/5 hover:text-white hover:bg-slate-800'
                  }`}
                  style={{
                    backgroundColor: isActive ? cfg.bg : undefined,
                    borderColor: isActive ? cfg.color : undefined,
                    color: isActive ? cfg.color : undefined,
                  }}
                >
                  <span>{cfg.icon}</span>
                  <span>{cfg.label}</span>
                  <span className="text-[10px] font-mono opacity-80">({count})</span>
                </button>
              );
            })}
          </div>

          {/* Search Input */}
          <div className="relative w-full">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-500 text-xs">
              🔍
            </span>
            <input
              type="text"
              placeholder="ドライバー名、レース、フレーズ、名言で検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-white/10 rounded-xl pl-8 pr-7 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 flex items-center pr-2.5 text-slate-400 hover:text-white text-xs cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Scrollable Radio Cards Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {filteredRadios.length === 0 ? (
            <div className="glass-card p-12 text-center flex flex-col items-center justify-center gap-3">
              <span className="text-4xl">📻</span>
              <h3 className="text-base font-bold text-white">該当する無線が見つかりませんでした</h3>
              <p className="text-xs text-slate-400">検索キーワードまたはカテゴリーを変更してください。</p>
            </div>
          ) : (
            filteredRadios.map((radio) => {
              const isThisPlaying = activePlayingId === radio.id && isPlaying;
              const catCfg = RADIO_CATEGORY_CONFIG[radio.category];

              return (
                <div
                  key={radio.id}
                  className="bg-slate-900/60 hover:bg-slate-900/90 border border-white/10 hover:border-white/20 rounded-2xl p-4 sm:p-5 transition-all shadow-md space-y-3.5 relative overflow-hidden"
                  style={{ borderLeftColor: radio.teamColor, borderLeftWidth: 4 }}
                >
                  {/* Card Top Row: Speaker, Team, Year & Category Badge */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{radio.icon}</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm sm:text-base font-racing font-bold text-white leading-tight">
                            {radio.speaker}
                          </h3>
                          <span
                            className="text-[10px] font-mono px-2 py-0.5 rounded-full border"
                            style={{
                              borderColor: `${radio.teamColor}50`,
                              color: radio.teamColor,
                              backgroundColor: `${radio.teamColor}15`,
                            }}
                          >
                            {radio.team}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-400 font-mono">
                          {radio.year}年 {radio.gpName}
                        </span>
                      </div>
                    </div>

                    <span
                      className="text-[10px] font-racing font-bold px-2.5 py-1 rounded-lg border"
                      style={{
                        backgroundColor: catCfg.bg,
                        borderColor: catCfg.color,
                        color: catCfg.color,
                      }}
                    >
                      {catCfg.label}
                    </span>
                  </div>

                  {/* English Original Transcript in Quote Block */}
                  <div className="p-3 bg-slate-950/80 rounded-xl border border-white/5 space-y-1">
                    <span className="text-[9px] font-racing font-bold text-slate-400 uppercase tracking-widest block">
                      ORIGINAL TEAM RADIO / 英語原文
                    </span>
                    <p className="text-xs sm:text-sm font-mono font-bold text-amber-300 italic leading-relaxed">
                      &ldquo;{radio.transcriptEn}&rdquo;
                    </p>
                  </div>

                  {/* Japanese Translation */}
                  <div className="p-2.5 bg-slate-900/80 rounded-xl border border-white/5 space-y-0.5">
                    <span className="text-[9px] font-racing font-bold text-slate-400 uppercase tracking-widest block">
                      JAPANESE TRANSLATION / 日本語訳
                    </span>
                    <p className="text-xs text-slate-200 leading-relaxed font-medium">
                      {radio.transcriptJa}
                    </p>
                  </div>

                  {/* Context & Background Story */}
                  <div className="text-xs text-slate-300 bg-black/40 p-3 rounded-xl border border-white/5 space-y-1">
                    <span className="text-[10px] font-racing font-bold text-sky-400 flex items-center gap-1">
                      <span>📖</span>
                      <span>戦術背景とエピソード</span>
                    </span>
                    <p className="text-[11px] leading-relaxed text-slate-300">{radio.contextJa}</p>
                  </div>

                  {/* Audio Player Bar & Action Controls */}
                  <div className="pt-2 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    {/* Audio Player Controls */}
                    <div className="flex flex-wrap items-center gap-2.5 flex-1">
                      {radio.audioUrl ? (
                        <>
                          <button
                            onClick={() => handlePlayToggle(radio)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-racing font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm ${
                              isThisPlaying
                                ? 'bg-amber-500 text-black shadow-amber-500/40 animate-pulse'
                                : 'bg-blue-600 hover:bg-blue-500 text-white'
                            }`}
                          >
                            <span>{isThisPlaying ? '⏸ 一時停止' : '▶ 実音声再生'}</span>
                          </button>

                          {/* Seek Bar when this audio is playing/active */}
                          {activePlayingId === radio.id ? (
                            <div className="flex items-center gap-2 flex-1 max-w-xs">
                              <span className="text-[10px] font-mono text-slate-400 w-8">
                                {currentTime.toFixed(1)}s
                              </span>
                              <input
                                type="range"
                                min={0}
                                max={duration || 12}
                                step={0.1}
                                value={currentTime}
                                onChange={handleSeek}
                                className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-400"
                              />
                              <span className="text-[10px] font-mono text-slate-500 w-8">
                                {duration ? `${duration.toFixed(1)}s` : '--'}
                              </span>
                            </div>
                          ) : (
                            <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                              <span>🔊</span>
                              <span>F1生中継オンボード実音声</span>
                            </span>
                          )}
                        </>
                      ) : null}

                      {radio.officialClipUrl && (
                        <a
                          href={radio.officialClipUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-xl text-xs font-racing font-bold bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/40 hover:border-red-400 flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
                          title="F1公式アーカイブ映像・実音声を別タブで再生"
                        >
                          <span>🎬 公式アーカイブ映像・実音声</span>
                          <span className="text-[10px]">↗</span>
                        </a>
                      )}

                      {!radio.audioUrl && (
                        <span className="text-[10px] text-slate-400 font-mono">
                          ※歴史的アーカイブ（FOM著作権保護のため公式クリップ連携）
                        </span>
                      )}
                    </div>

                    {/* Right: Tag chips & Drama link */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {radio.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="text-[9px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-white/5"
                        >
                          #{tag}
                        </span>
                      ))}

                      {onNavigateToDrama && (
                        <button
                          onClick={() => {
                            stopAudio();
                            onClose();
                            onNavigateToDrama();
                          }}
                          className="text-[10px] font-racing text-purple-300 hover:text-white flex items-center gap-0.5 px-2 py-1 rounded bg-purple-950/40 border border-purple-500/30 hover:bg-purple-900/60 transition-all cursor-pointer"
                        >
                          <span>🎬 ドラマHub</span>
                          <span>➔</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
