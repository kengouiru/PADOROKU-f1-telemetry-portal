'use client';

/**
 * components/radio/TeamRadioVaultView.tsx
 * Reusable Team Radio Vault View component.
 * Can be embedded directly inside F1DramaHub (as Pillar 5) or inside TeamRadioVaultModal.
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  VAULT_TEAM_RADIOS,
  RADIO_CATEGORY_CONFIG,
  type RadioCategory,
  type VaultRadioItem,
} from '@/data/f1RadioVaultData';
import { getProxiedAudioUrl } from '@/lib/telemetryUtils';

export interface TeamRadioVaultViewProps {
  onNavigateToDrama?: () => void;
  isInsideModal?: boolean;
}

export default function TeamRadioVaultView({
  onNavigateToDrama,
  isInsideModal = false,
}: TeamRadioVaultViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | RadioCategory>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [activePlayingId, setActivePlayingId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Clean up audio on unmount
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
    return () => stopAudio();
  }, []);

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

  const filteredRadios = VAULT_TEAM_RADIOS.filter((r) => {
    if (selectedCategory !== 'ALL' && r.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        r.title.toLowerCase().includes(q) ||
        r.speaker.toLowerCase().includes(q) ||
        r.gpName.toLowerCase().includes(q) ||
        r.transcriptJa.toLowerCase().includes(q) ||
        r.transcriptEn.toLowerCase().includes(q) ||
        r.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="flex flex-col gap-5 text-white">
      {/* Header Banner (only when viewed as inline page) */}
      {!isInsideModal && (
        <div className="bg-gradient-to-r from-emerald-950/60 via-slate-900/80 to-teal-950/60 border border-emerald-500/20 rounded-2xl p-5 shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-racing font-bold text-emerald-400 tracking-wider uppercase flex items-center gap-1.5 mb-1">
                <span>🎙️</span>
                <span>LEGENDARY TEAM RADIO VAULT / 人間ドラマの極地</span>
              </span>
              <h4 className="text-lg font-racing font-black text-white">
                F1史を刻んだ伝説のチーム無線ベストセレクション
              </h4>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                時速300km/h超の極限コックピットから放たれる怒号、爆笑の珍言、涙の初戴冠、そして冷徹なチームオーダー。生の感情が凝縮された不朽の名言集。
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-emerald-300 bg-emerald-950/80 border border-emerald-500/30 px-3 py-1 rounded-xl">
                全{VAULT_TEAM_RADIOS.length}エピソード収録
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-950/70 border border-white/10 rounded-2xl p-3 px-4 shadow-sm">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`px-3 py-1 rounded-xl text-xs font-racing font-bold transition-all shrink-0 ${
              selectedCategory === 'ALL'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-900/80 text-slate-400 hover:text-white border border-white/5'
            }`}
          >
            すべて ({VAULT_TEAM_RADIOS.length})
          </button>
          {(Object.keys(RADIO_CATEGORY_CONFIG) as RadioCategory[]).map((cat) => {
            const count = VAULT_TEAM_RADIOS.filter((r) => r.category === cat).length;
            const cfg = RADIO_CATEGORY_CONFIG[cat];
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-xl text-xs font-racing font-bold transition-all shrink-0 flex items-center gap-1 ${
                  selectedCategory === cat
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-900/80 text-slate-400 hover:text-white border border-white/5'
                }`}
              >
                <span>{cfg.icon}</span>
                <span>{cfg.label.replace(/^.*?\s/, '')}</span>
                <span className="text-[10px] opacity-70 font-mono">({count})</span>
              </button>
            );
          })}
        </div>

        <div className="relative sm:w-64">
          <input
            type="text"
            placeholder="選手・GP・名言で検索..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900/90 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1.5 text-xs text-slate-400 hover:text-white"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Radios Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredRadios.map((radio) => {
          const isThisPlaying = activePlayingId === radio.id && isPlaying;
          const catCfg = RADIO_CATEGORY_CONFIG[radio.category];

          return (
            <div
              key={radio.id}
              className="bg-slate-900/70 hover:bg-slate-900/90 border border-white/10 hover:border-white/20 rounded-2xl p-5 flex flex-col justify-between gap-4 transition-all shadow-md relative overflow-hidden"
              style={{ borderLeftColor: radio.teamColor, borderLeftWidth: 4 }}
            >
              <div className="space-y-3">
                {/* Top Row: Speaker, Year, GP & Category Badge */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{radio.icon}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-racing font-black text-white text-base">
                          {radio.speaker}
                        </h4>
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
                    className="text-[10px] font-racing font-bold px-2.5 py-1 rounded-lg border flex-shrink-0"
                    style={{
                      backgroundColor: catCfg.bg,
                      borderColor: catCfg.color,
                      color: catCfg.color,
                    }}
                  >
                    {catCfg.label}
                  </span>
                </div>

                {/* Original Quote */}
                <div className="p-3 bg-slate-950/80 rounded-xl border border-white/5 space-y-1">
                  <span className="text-[9px] font-racing font-bold text-slate-400 uppercase tracking-wider block">
                    ORIGINAL TEAM RADIO / 英語原文
                  </span>
                  <p className="text-xs sm:text-sm font-mono font-bold text-amber-300 italic leading-relaxed">
                    &ldquo;{radio.transcriptEn}&rdquo;
                  </p>
                </div>

                {/* Japanese Translation */}
                <div className="p-3 bg-slate-900/80 rounded-xl border border-white/5 space-y-0.5">
                  <span className="text-[9px] font-racing font-bold text-slate-400 uppercase tracking-wider block">
                    JAPANESE TRANSLATION / 日本語訳
                  </span>
                  <p className="text-xs text-slate-200 leading-relaxed font-medium">
                    {radio.transcriptJa}
                  </p>
                </div>

                {/* Context & Background */}
                <div className="text-xs bg-black/40 p-3 rounded-xl border border-white/5 space-y-1">
                  <span className="text-[10px] font-racing font-bold text-sky-400 flex items-center gap-1">
                    <span>📖</span>
                    <span>戦術背景とエピソード</span>
                  </span>
                  <p className="text-[11px] leading-relaxed text-slate-300">
                    {radio.contextJa}
                  </p>
                </div>
              </div>

              {/* Audio Player & Official Clip Controls */}
              <div className="pt-3 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2 flex-1">
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
                      onClick={onNavigateToDrama}
                      className="text-[10px] font-racing text-rose-400 hover:text-rose-300 hover:underline flex items-center gap-0.5 ml-1"
                    >
                      <span>ドラマHub</span>
                      <span>➔</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
