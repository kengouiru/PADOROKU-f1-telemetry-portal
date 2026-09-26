'use client';

/**
 * components/hubs/SessionResultsModal.tsx
 * Formula 1 Official Timing Sheet & Session Classification Modal.
 *
 * STRICT POLICY:
 * - If a session is unheld (未開催), state the facts only (session schedule, local/JST time, circuit).
 * - Output ZERO fake/simulated data. Do NOT substitute past data.
 * - No excuses, no defensive text. Simple, factual, and dignified.
 * - If a session is completed with official records, display the authentic classification table.
 */

import React, { useState, useEffect, useMemo } from 'react';
import type { RaceWeekendSchedule } from '@/data/f1SeasonData';
import { getCircuitTimezoneInfo, formatDualSessionTime } from '@/lib/circuitTimezones';
import { getSessionClassification, type SessionResultData, type SessionDriverResult } from '@/lib/sessionResultsService';

interface SessionResultsModalProps {
  isOpen: boolean;
  onClose: () => void;
  race: RaceWeekendSchedule;
  circuitId: string;
  initialSessionName: string;
  seasonYear: string;
  onNavigateToTelemetry?: (gpName: string) => void;
  onNavigateToDriver?: (driverCode: string) => void;
}

export default function SessionResultsModal({
  isOpen,
  onClose,
  race,
  circuitId,
  initialSessionName,
  seasonYear,
  onNavigateToTelemetry,
  onNavigateToDriver,
}: SessionResultsModalProps) {
  // Current active session within modal
  const [activeSession, setActiveSession] = useState<string>(initialSessionName);

  // Circuit timezone info
  const tzInfo = useMemo(() => {
    return getCircuitTimezoneInfo(circuitId, race.country, race.city);
  }, [circuitId, race.country, race.city]);

  // Sync activeSession when initialSessionName changes
  useEffect(() => {
    if (initialSessionName) {
      setActiveSession(initialSessionName);
    }
  }, [initialSessionName]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Fetch verified classification data for this session
  const sessionData: SessionResultData = useMemo(() => {
    return getSessionClassification(seasonYear, race.round, activeSession, 101.5, circuitId);
  }, [seasonYear, race.round, activeSession, circuitId]);

  // Schedule string for active session
  const activeScheduleObj = race.scheduleJst.find((s) => s.session === activeSession);
  const dualTime = useMemo(() => {
    if (!activeScheduleObj) return null;
    return formatDualSessionTime(activeScheduleObj.session, activeScheduleObj.dayTime, tzInfo);
  }, [activeScheduleObj, tzInfo]);

  const isUpcoming = sessionData.status === 'upcoming' || sessionData.results.length === 0;

  const isQualifying = sessionData.sessionType === 'qualifying' || activeSession.includes('予選');
  const hasQTimes = sessionData.results.some((r) => r.q1Time || r.q2Time || r.q3Time);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative flex flex-col w-full max-w-4xl max-h-[92vh] bg-slate-950 border border-white/15 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        {/* ─── MODAL HEADER ─── */}
        <div className="relative z-10 px-4 sm:px-6 py-3.5 sm:py-4 border-b border-white/10 bg-slate-900/90 flex flex-col gap-2.5">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="text-2xl sm:text-3xl shrink-0">{race.flag}</span>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-red-500/20 text-red-300 border border-red-500/30">
                    ROUND {race.round}
                  </span>
                  <h2 className="text-base sm:text-xl font-black text-white truncate">
                    {race.gpName}
                  </h2>
                  <span className="text-xs text-slate-400 font-mono hidden md:inline truncate">
                    {race.circuitName}
                  </span>
                </div>
              </div>
            </div>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 sm:p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/10 transition-all cursor-pointer"
              title="閉じる (Esc)"
            >
              <span className="text-lg leading-none">✕</span>
            </button>
          </div>

          {/* ─── HORIZONTAL SESSION SWITCHER TABS ─── */}
          <div className="flex items-center justify-between gap-2 flex-wrap pt-1">
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
              {race.scheduleJst.map((s) => {
                const isActive = s.session === activeSession;
                const isFinal = s.session.includes('決勝') && !s.session.includes('スプリント');
                return (
                  <button
                    key={s.session}
                    type="button"
                    onClick={() => setActiveSession(s.session)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-racing font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                      isActive
                        ? isFinal
                          ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md shadow-red-950/50 border border-red-500/50'
                          : 'bg-white text-slate-950 shadow-md shadow-white/10'
                        : 'bg-slate-900 hover:bg-slate-850 text-slate-300 hover:text-white border border-white/10'
                    }`}
                  >
                    <span>{isFinal ? '🏁' : s.session.includes('予選') ? '⏱️' : '🏎️'}</span>
                    <span>{s.session}</span>
                  </button>
                );
              })}
            </div>

            {/* Session Time Badge */}
            {dualTime && (
              <div className="text-[11px] font-mono text-slate-300 flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-lg border border-white/10 shrink-0">
                <span className="text-red-400 font-bold">JST:</span>
                <span>{dualTime.jstDay} {dualTime.jstTime}</span>
                <span className="text-slate-500">/</span>
                <span className="text-sky-300">現地:</span>
                <span>{dualTime.localTime} {dualTime.tzAbbr}</span>
              </div>
            )}
          </div>
        </div>

        {/* ─── MODAL BODY ─── */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-4">
          {isUpcoming ? (
            /* ─────────────────────────────────────────────────────────────
               FACTUAL UNHELD SESSION CARD (ZERO DATA, PURE FACTS)
               ───────────────────────────────────────────────────────────── */
            <div className="py-8 text-center space-y-5 max-w-lg mx-auto">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800 text-slate-300 border border-white/10 text-xs font-mono">
                <span className="w-2 h-2 rounded-full bg-slate-400" />
                <span>未開催</span>
              </div>

              <div className="space-y-1">
                <h3 className="text-xl sm:text-2xl font-black text-white font-racing">
                  {activeSession}
                </h3>
                <p className="text-sm text-slate-300 font-sans">
                  このセッションはまだ開催されていません。
                </p>
              </div>

              {dualTime && (
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-xs font-mono text-left space-y-2.5">
                  <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider pb-1.5 border-b border-white/5">
                    開催スケジュール
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-slate-400">日本時間 (JST):</span>
                    <span className="text-white font-bold text-sm">{dualTime.jstDay} {dualTime.jstTime}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-slate-400">現地時間 ({dualTime.tzAbbr}):</span>
                    <span className="text-sky-300 font-bold">{dualTime.localDay || dualTime.jstDay} {dualTime.localTime}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3 pt-1.5 border-t border-white/5">
                    <span className="text-slate-400">サーキット:</span>
                    <span className="text-slate-200">{race.circuitName}（{race.city || race.country}）</span>
                  </div>
                </div>
              )}

              <p className="text-xs text-slate-500 font-mono">
                ※ 公式セッション終了後にリザルトが反映されます。
              </p>

              <div className="pt-2 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-white/10 text-xs font-racing font-bold transition-all cursor-pointer"
                >
                  閉じる
                </button>
              </div>
            </div>
          ) : (
            /* ─────────────────────────────────────────────────────────────
               COMPLETED SESSION CLASSIFICATION TIMING SHEET (FACTUAL OFFICIAL DATA)
               ───────────────────────────────────────────────────────────── */
            <div className="space-y-3.5 animate-fadeIn">
              {/* Highlight summary cards: Pole or Fastest Lap */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {sessionData.polePosition && (
                  <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500/15 to-transparent border border-amber-500/30 flex items-center justify-between gap-2 shadow-sm">
                    <div>
                      <div className="text-[10px] font-mono text-amber-300 font-bold uppercase">POLE POSITION</div>
                      <div className="text-sm font-black text-white font-mono mt-0.5">
                        {sessionData.polePosition.driverName}
                      </div>
                    </div>
                    <span className="font-mono text-xs font-bold text-amber-300 px-2 py-1 rounded bg-amber-500/20">
                      {sessionData.polePosition.time}
                    </span>
                  </div>
                )}

                {sessionData.fastestLap && (
                  <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500/15 to-transparent border border-purple-500/30 flex items-center justify-between gap-2 shadow-sm">
                    <div>
                      <div className="text-[10px] font-mono text-purple-300 font-bold uppercase">FASTEST LAP</div>
                      <div className="text-sm font-black text-white font-mono mt-0.5">
                        {sessionData.fastestLap.driverName}
                      </div>
                    </div>
                    <span className="font-mono text-xs font-bold text-purple-300 px-2 py-1 rounded bg-purple-500/20">
                      {sessionData.fastestLap.time}
                    </span>
                  </div>
                )}

                {sessionData.airTempC && sessionData.trackTempC && (
                  <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-between gap-2 shadow-sm">
                    <div>
                      <div className="text-[10px] font-mono text-slate-400 font-bold uppercase">TRACK CONDITION</div>
                      <div className="text-xs font-bold text-slate-200 mt-0.5">
                        気温 {sessionData.airTempC}℃ / 路面 {sessionData.trackTempC}℃
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-slate-300 px-2 py-1 rounded bg-white/5 border border-white/10">
                      DRY
                    </span>
                  </div>
                )}
              </div>

              {/* CLASSIFICATION TABLE */}
              <div className="rounded-xl border border-white/10 overflow-hidden bg-slate-900/60 shadow-lg">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-slate-950/90 text-slate-400 uppercase text-[10px] tracking-wider border-b border-white/10">
                      <tr>
                        <th className="py-2.5 px-3 w-14 text-center">POS</th>
                        <th className="py-2.5 px-2 w-10 text-center">NO</th>
                        <th className="py-2.5 px-3 min-w-[160px]">DRIVER</th>
                        <th className="py-2.5 px-3 hidden sm:table-cell min-w-[140px]">TEAM</th>
                        {isQualifying && hasQTimes ? (
                          <>
                            <th className="py-2.5 px-2 text-right">Q1</th>
                            <th className="py-2.5 px-2 text-right">Q2</th>
                            <th className="py-2.5 px-2 text-right">Q3</th>
                          </>
                        ) : (
                          <>
                            <th className="py-2.5 px-3 text-right">TIME / RETIREMENT</th>
                            <th className="py-2.5 px-3 text-right">GAP</th>
                          </>
                        )}
                        <th className="py-2.5 px-2 text-center w-12 hidden md:table-cell">LAPS</th>
                        {sessionData.sessionType === 'race' && (
                          <th className="py-2.5 px-3 text-center w-14 text-emerald-400">PTS</th>
                        )}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.06]">
                      {sessionData.results.map((row: SessionDriverResult) => {
                        let posBadge = 'text-slate-300 bg-white/5';
                        if (row.position === 1) posBadge = 'text-amber-300 bg-amber-500/20 font-black border border-amber-500/40';
                        else if (row.position === 2) posBadge = 'text-slate-200 bg-slate-400/20 font-bold border border-slate-300/40';
                        else if (row.position === 3) posBadge = 'text-amber-500 bg-amber-700/20 font-bold border border-amber-600/40';

                        const isRet = row.status === 'RETIRED';
                        const isDsq = row.status === 'DSQ';

                        return (
                          <tr
                            key={row.driverCode}
                            className={`hover:bg-white/[0.04] transition-colors ${
                              isRet ? 'opacity-75 bg-red-950/10' : isDsq ? 'opacity-60 bg-red-950/20' : ''
                            }`}
                          >
                            <td className="py-2 px-3 text-center">
                              <span className={`inline-block w-6 h-6 leading-6 rounded-md text-center text-xs ${posBadge}`}>
                                {isDsq ? 'DSQ' : isRet ? 'DNF' : row.position}
                              </span>
                            </td>

                            <td className="py-2 px-2 text-center text-slate-500 font-bold">
                              {row.driverNumber}
                            </td>

                            <td className="py-2 px-3">
                              <div className="flex items-center gap-2">
                                <span
                                  className="w-1.5 h-4 rounded-full shrink-0"
                                  style={{ backgroundColor: row.teamColor }}
                                />
                                <div className="min-w-0">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (onNavigateToDriver) {
                                        onClose();
                                        onNavigateToDriver(row.driverCode);
                                      }
                                    }}
                                    className="text-white hover:text-red-400 font-bold hover:underline transition-colors text-xs text-left truncate flex items-center gap-1.5 cursor-pointer"
                                  >
                                    <span>{row.driverName}</span>
                                    <span className="text-[10px] text-slate-400 font-mono font-normal">
                                      ({row.driverCode})
                                    </span>
                                    {row.isFastestLap && (
                                      <span className="text-[9px] px-1 py-0.2 rounded bg-purple-500/20 text-purple-300 font-mono font-bold">
                                        FL
                                      </span>
                                    )}
                                  </button>
                                  {row.retireReason && (
                                    <div className="text-[10px] text-red-400 font-sans truncate">
                                      {row.retireReason}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </td>

                            <td className="py-2 px-3 hidden sm:table-cell text-slate-300 truncate">
                              <span>{row.teamName}</span>
                            </td>

                            {isQualifying && hasQTimes ? (
                              <>
                                <td className="py-2 px-2 text-right font-mono text-slate-300 text-[11px]">
                                  {row.q1Time || '-'}
                                </td>
                                <td className="py-2 px-2 text-right font-mono text-slate-300 text-[11px]">
                                  {row.q2Time || '-'}
                                </td>
                                <td className="py-2 px-2 text-right font-mono text-white font-bold text-[11px]">
                                  {row.q3Time || row.bestLapTime || '-'}
                                </td>
                              </>
                            ) : (
                              <>
                                <td className="py-2 px-3 text-right font-bold text-white font-mono">
                                  <span>{row.bestLapTime}</span>
                                </td>
                                <td className="py-2 px-3 text-right font-mono text-slate-300">
                                  <span className={row.gapToLeader === 'LEADER' || row.gapToLeader === 'POLE' ? 'text-amber-400 font-bold' : ''}>
                                    {row.gapToLeader}
                                  </span>
                                </td>
                              </>
                            )}

                            <td className="py-2 px-2 text-center text-slate-400 hidden md:table-cell">
                              {row.lapsCompleted > 0 ? row.lapsCompleted : '-'}
                            </td>

                            {sessionData.sessionType === 'race' && (
                              <td className="py-2 px-3 text-center font-bold">
                                {row.points && row.points > 0 ? (
                                  <span className="text-emerald-400">+{row.points}</span>
                                ) : (
                                  <span className="text-slate-600">-</span>
                                )}
                              </td>
                            )}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ─── MODAL FOOTER ─── */}
        <div className="relative z-10 px-4 sm:px-6 py-3 border-t border-white/10 bg-slate-900/90 flex items-center justify-between gap-3 flex-wrap">
          <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1.5 flex-wrap">
            {isUpcoming ? (
              <span className="text-slate-500">セッション未開催</span>
            ) : (
              <>
                <span className="text-emerald-400 font-bold">✓ 公式リザルト</span>
                <span className="text-slate-600">|</span>
                <span>出典: {sessionData.dataSource || 'FIA Formula 1 Official Timing / Jolpica Ergast API'}</span>
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            {!isUpcoming && onNavigateToTelemetry && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onNavigateToTelemetry(race.gpName);
                }}
                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-racing font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span>🏎️</span>
                <span>テレメトリー詳細分析</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-white/10 text-xs font-racing font-bold transition-all cursor-pointer"
            >
              閉じる
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
