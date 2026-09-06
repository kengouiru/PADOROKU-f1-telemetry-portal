'use client';

/**
 * components/hubs/TeamDetailModal.tsx
 * Comprehensive Detailed Modal for F1 Constructors/Teams.
 * Follows the 2-layer design architecture matching DriverDetailModal,
 * with keyboard left/right navigation, factory details, aerodynamic philosophy,
 * historical milestones, and academic citations.
 */

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import type { TeamProfile, Reference } from '@/data/f1KnowledgeData';
import PhotoGalleryCarousel from '@/components/ui/PhotoGalleryCarousel';

interface TeamDetailModalProps {
  team: TeamProfile;
  allTeams: TeamProfile[];
  onSelectTeam: (team: TeamProfile) => void;
  onClose: () => void;
}

type TeamTab = 'factory' | 'engineering' | 'history' | 'references';

export default function TeamDetailModal({
  team,
  allTeams,
  onSelectTeam,
  onClose,
}: TeamDetailModalProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  const [activeTab, setActiveTab] = useState<TeamTab>('factory');
  const [highlightedRef, setHighlightedRef] = useState<string | null>(null);
  const modalContentRef = useRef<HTMLDivElement>(null);

  const themeColor = team.color || '#38bdf8';

  // Find currentIndex for Prev / Next navigation
  const currentIndex = allTeams.findIndex((t) => t.id === team.id);
  const prevTeam = currentIndex > 0 ? allTeams[currentIndex - 1] : allTeams[allTeams.length - 1];
  const nextTeam = currentIndex < allTeams.length - 1 ? allTeams[currentIndex + 1] : allTeams[0];

  // Keyboard navigation: Left/Right arrow keys for prev/next, Escape to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && prevTeam) onSelectTeam(prevTeam);
      if (e.key === 'ArrowRight' && nextTeam) onSelectTeam(nextTeam);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [prevTeam, nextTeam, onClose, onSelectTeam]);

  // Jump to Reference & highlight
  const handleCitationClick = (refId: number) => {
    setActiveTab('references');
    setTimeout(() => {
      const targetElementId = `team-ref-${team.id}-${refId}`;
      const el = document.getElementById(targetElementId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setHighlightedRef(targetElementId);
        setTimeout(() => setHighlightedRef(null), 3000);
      }
    }, 100);
  };

  // Helper to parse "[1]", "[2]" into clickable citation badges
  const renderTextWithCitations = (text: string) => {
    const parts = text.split(/(\[\d+\])/g);
    return parts.map((part, idx) => {
      const match = part.match(/\[(\d+)\]/);
      if (match) {
        const refId = parseInt(match[1], 10);
        return (
          <button
            key={idx}
            onClick={() => handleCitationClick(refId)}
            className="inline-flex items-center px-1 mx-0.5 text-[10px] font-mono font-bold text-sky-400 bg-sky-950/60 hover:bg-sky-800/80 border border-sky-500/40 rounded transition-all cursor-pointer hover:scale-110"
            title={`参考文献 [${refId}] を確認`}
          >
            [{refId}]
          </button>
        );
      }
      return <span key={idx}>{part}</span>;
    });
  };

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in">
      {/* Modal Card */}
      <div
        ref={modalContentRef}
        className="glass-card bg-slate-950/95 border border-white/15 w-full max-w-4xl max-h-[92vh] flex flex-col rounded-3xl shadow-2xl overflow-hidden relative"
        style={{ borderTopColor: themeColor, borderTopWidth: 4 }}
      >
        {/* Top Navigation Bar */}
        <div className="p-3 sm:px-6 bg-slate-900/90 border-b border-white/10 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => prevTeam && onSelectTeam(prevTeam)}
              className="px-2.5 py-1 sm:px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-racing flex items-center gap-1.5 transition-all"
              title="前のチーム (←キー)"
            >
              <span>◀</span>
              <span className="font-mono font-bold">{prevTeam?.name}</span>
            </button>
            <button
              onClick={() => nextTeam && onSelectTeam(nextTeam)}
              className="px-2.5 py-1 sm:px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-racing flex items-center gap-1.5 transition-all"
              title="次のチーム (→キー)"
            >
              <span className="font-mono font-bold">{nextTeam?.name}</span>
              <span>▶</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[10px] text-slate-500 font-mono hidden md:inline">
              キーボード [←] [→] でチーム切り替え / [ESC] で閉じる
            </span>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center text-sm font-bold transition-all hover:scale-105"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Team Hero Header */}
        <div className="p-5 sm:p-6 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-b from-slate-900/60 to-transparent">
          <div className="flex items-start sm:items-center gap-4">
            <div
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex flex-col items-center justify-center font-racing font-black border shadow-xl flex-shrink-0"
              style={{
                color: themeColor,
                borderColor: `${themeColor}80`,
                backgroundColor: `${themeColor}15`,
              }}
            >
              <span className="text-2xl sm:text-3xl font-black">{team.name.slice(0, 3).toUpperCase()}</span>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-slate-400 font-mono">{team.base}</span>
                <span className="bg-slate-800/90 text-slate-300 px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono border border-white/10">
                  ⚡ {team.powerUnit}
                </span>
                <span className="bg-blue-950/60 text-sky-300 px-2 py-0.5 rounded-full text-[10px] font-mono border border-sky-500/30">
                  代表: {team.teamPrincipal}
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
                {team.fullName}
              </h2>

              <div className="flex items-center gap-1.5 pt-0.5">
                <span className="text-[11px] text-slate-400 font-mono">DRIVERS:</span>
                {team.drivers.map((d) => (
                  <span
                    key={d}
                    className="px-2 py-0.5 rounded-md text-[11px] font-mono font-bold border"
                    style={{
                      color: themeColor,
                      borderColor: `${themeColor}50`,
                      backgroundColor: `${themeColor}12`,
                    }}
                  >
                    {d}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Constructor Titles Banner */}
          {team.constructorTitles > 0 ? (
            <div
              className="rounded-2xl p-3 px-4 flex items-center gap-3 self-start sm:self-auto flex-shrink-0 border shadow-lg bg-amber-500/10 border-amber-500/30"
            >
              <span className="text-3xl">🏆</span>
              <div>
                <span className="text-xs font-racing font-bold uppercase tracking-widest text-amber-400 block">
                  CONSTRUCTOR CHAMPION
                </span>
                <span className="text-base sm:text-lg font-black text-white font-mono">
                  {team.constructorTitles}回 制覇
                </span>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl p-3 px-4 flex items-center gap-2 self-start sm:self-auto flex-shrink-0 bg-slate-900/60 border border-white/10 text-xs text-slate-400 font-mono">
              <span>🏁</span>
              <span>コンストラクターズ参戦中</span>
            </div>
          )}
        </div>

        {/* Modal Sub-Tabs */}
        <div className="flex items-center gap-2 px-5 sm:px-6 pt-3 border-b border-white/10 bg-slate-900/40 overflow-x-auto flex-shrink-0">
          {(
            [
              ['factory', '🏭 ファクトリー & 組織体系'],
              ['engineering', '📐 空力 & シャシー工学哲学'],
              ['history', '🏆 歴史 & 歴代マシン'],
              ['references', `📚 参考文献 (${team.references.length})`],
            ] as [TeamTab, string][]
          ).map(([tab, label]) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2.5 px-3 text-xs font-racing font-bold transition-all border-b-2 flex-shrink-0 ${
                activeTab === tab
                  ? 'text-sky-400 border-sky-400 font-black'
                  : 'text-slate-400 border-transparent hover:text-slate-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Scrollable Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-5">
          {/* TAB 1: FACTORY & STRUCTURE */}
          {activeTab === 'factory' && (
            <div className="space-y-4 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                <div className="bg-slate-900/80 border border-white/10 p-4 rounded-2xl space-y-2">
                  <h4 className="text-xs font-racing font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                    <span>📍</span>
                    <span>本拠地ファクトリー & 開発拠点</span>
                  </h4>
                  <p className="text-sm font-bold text-white">{team.base}</p>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    最新鋭の風洞実験施設やドライバー・イン・ザ・ループ（DiL）シミュレータを備え、グランプリ週末もファクトリー側とリアルタイムでテレメトリを交信。
                  </p>
                </div>

                <div className="bg-slate-900/80 border border-white/10 p-4 rounded-2xl space-y-2">
                  <h4 className="text-xs font-racing font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    <span>⚡</span>
                    <span>パワーユニット & テクニカル体制</span>
                  </h4>
                  <p className="text-sm font-bold text-white">{team.powerUnit}</p>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    チーム代表: <strong className="text-slate-100">{team.teamPrincipal}</strong>
                  </p>
                </div>
              </div>

              {/* Drivers Card Grid */}
              <div className="bg-slate-950/70 border border-white/10 p-4 rounded-2xl space-y-2.5">
                <h4 className="text-xs font-racing font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <span>🏎️</span>
                  <span>所属ドライバー・ラインナップ</span>
                </h4>
                <div className="flex flex-wrap gap-2.5">
                  {team.drivers.map((dCode) => (
                    <div
                      key={dCode}
                      className="bg-slate-900 px-4 py-2.5 rounded-xl border border-white/10 flex items-center gap-2 shadow-sm"
                    >
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: themeColor }}
                      />
                      <span className="font-racing font-bold text-sm text-white">{dCode}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: AERODYNAMICS & ENGINEERING */}
          {activeTab === 'engineering' && (
            <div className="space-y-4 animate-fade-in">
              {/* Philosophy Overview */}
              <div className="bg-slate-900/80 border border-white/10 p-4 rounded-2xl space-y-2">
                <h4 className="text-xs font-racing font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                  <span>📐</span>
                  <span>開発哲学サマリー</span>
                </h4>
                <p className="text-xs text-slate-200 leading-relaxed">
                  {renderTextWithCitations(team.philosophy.description)}
                </p>
              </div>

              {/* Aero vs Mechanical Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                <div className="bg-slate-950/80 border border-sky-500/30 p-4 rounded-2xl space-y-2">
                  <h4 className="text-xs font-racing font-bold text-sky-300 uppercase tracking-wider flex items-center gap-1.5">
                    <span>💨</span>
                    <span>空力コンセプト & フロア負圧</span>
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {team.philosophy.aeroFocus}
                  </p>
                </div>

                <div className="bg-slate-950/80 border border-amber-500/30 p-4 rounded-2xl space-y-2">
                  <h4 className="text-xs font-racing font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                    <span>⚙️</span>
                    <span>サスペンション & メカニカル接地力</span>
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {team.philosophy.mechanicalFocus}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: HISTORY & ICONIC CARS */}
          {activeTab === 'history' && (
            <div className="space-y-4 animate-fade-in">
              {/* Photo Gallery Carousel (Historic Cars & Factory) */}
              {team.visualGallery && team.visualGallery.length > 0 && (
                <PhotoGalleryCarousel
                  items={team.visualGallery}
                  title="📸 HISTORIC CARS & FACTORY GALLERY"
                  themeColor={themeColor}
                />
              )}

              <div className="bg-slate-900/80 border border-white/10 p-4 rounded-2xl space-y-2">
                <h4 className="text-xs font-racing font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <span>🏆</span>
                  <span>栄光のタイトル獲得史</span>
                </h4>
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-black text-white font-mono">{team.constructorTitles}</span>
                  <span className="text-xs text-slate-300">
                    コンストラクターズ・ワールドチャンピオンシップ制覇
                  </span>
                </div>
              </div>

              {/* Team Milestones / Highlights */}
              <div className="bg-slate-950/60 border border-white/10 p-4 rounded-2xl space-y-2">
                <h4 className="text-xs font-racing font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <span>🏎️</span>
                  <span>F1における歴史的マイルストーン</span>
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {team.name} は長年にわたりF1の技術革新をリードし、空力効率やサスペンション構造、パワーユニットの熱効率において数々のベンチマークを築いてきた。
                </p>
              </div>

              {/* Visual Gallery Cards: Historic Cars & Factory */}
              {team.visualGallery && team.visualGallery.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-xs font-racing font-bold text-sky-300 uppercase tracking-wider flex items-center gap-1.5">
                    <span>📸</span>
                    <span>歴代名車 & ファクトリーフォトコレクション</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {team.visualGallery.map((item, idx) => (
                      <div
                        key={idx}
                        className="bg-slate-950/80 border border-white/10 rounded-2xl overflow-hidden shadow-lg hover:border-sky-500/40 transition-all flex flex-col justify-between"
                      >
                        <div className="relative aspect-video w-full bg-slate-900">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={item.imageUrl}
                            alt={item.caption}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                          {item.tag && (
                            <span
                              className="absolute top-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold border backdrop-blur-md"
                              style={{
                                color: themeColor,
                                borderColor: `${themeColor}60`,
                                backgroundColor: '#020617cc',
                              }}
                            >
                              {item.tag}
                            </span>
                          )}
                        </div>
                        <div className="p-3 space-y-1.5 flex-1 flex flex-col justify-between">
                          <p className="text-xs font-bold text-white leading-snug">
                            {item.caption}
                          </p>
                          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 border-t border-white/5 pt-1.5">
                            <span className="truncate max-w-[140px]">Photo: {item.credit}</span>
                            <span className="text-[9px] bg-slate-800 px-1.5 py-0.5 rounded flex-shrink-0">{item.license}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: REFERENCES & PRIMARY SOURCES */}
          {activeTab === 'references' && (
            <div className="space-y-3 animate-fade-in">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-racing font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <span>📚</span>
                  <span>一次出典・公式技術リリース</span>
                </h4>
                <span className="text-[10px] font-mono text-slate-500">Academic Verified</span>
              </div>

              <div className="space-y-2">
                {team.references.map((ref) => {
                  const elId = `team-ref-${team.id}-${ref.id}`;
                  const isHighlighted = highlightedRef === elId;
                  return (
                    <div
                      key={ref.id}
                      id={elId}
                      className={`p-3 rounded-xl text-xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2 border ${
                        isHighlighted
                          ? 'bg-amber-500/20 border-amber-400/80 ring-2 ring-amber-400/50 shadow-lg'
                          : 'bg-slate-900/70 border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <span className="font-mono text-xs font-bold text-sky-400 mt-0.5">
                          [{ref.id}]
                        </span>
                        <div>
                          <p className="text-slate-200 font-semibold text-xs leading-snug">
                            {ref.title}
                          </p>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {ref.publisher} • 検証日: {ref.verifiedDate}
                          </span>
                        </div>
                      </div>

                      <a
                        href={ref.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sky-400 hover:text-sky-300 text-xs font-medium flex items-center gap-1 flex-shrink-0 self-end sm:self-center bg-slate-800/80 px-2.5 py-1 rounded-lg border border-white/5 hover:border-sky-500/40"
                      >
                        <span>公式ドキュメントを開く</span>
                        <span>↗</span>
                      </a>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
