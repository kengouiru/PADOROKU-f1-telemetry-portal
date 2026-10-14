'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { X, PlayCircle, Loader2, RadioReceiver, Volume2, ShieldAlert } from 'lucide-react';
import { fetchSessions, fetchTeamRadio, fetchDrivers, fetchRaceControl } from '@/lib/openf1Api';
import type { TeamRadio, Driver, Session, RaceControlMessage } from '@/lib/types';
import { constructorColour } from '@/lib/jolpicaRaceSummary';
import { getSeasonCalendar, type SeasonYear, toJapaneseGpName } from '@/data/f1SeasonData';

export function PostRaceReviewModal({
  round,
  seasonYear = '2026',
  gpName,
  onClose,
  inlineMode = false,
}: {
  round: number;
  seasonYear?: SeasonYear;
  gpName?: string;
  onClose: () => void;
  inlineMode?: boolean;
}) {
  const [session, setSession] = useState<Session | null>(null);
  const [radios, setRadios] = useState<TeamRadio[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [raceControl, setRaceControl] = useState<RaceControlMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        setLoading(true);
        const year = parseInt(seasonYear, 10) || 2026;
        const sessions = await fetchSessions(year);

        const sortedSessions = [...sessions].sort(
          (a, b) => new Date(a.date_start).getTime() - new Date(b.date_start).getTime()
        );
        const meetings = new Map<number, typeof sessions>();
        for (const s of sortedSessions) {
          if (!meetings.has(s.meeting_key)) meetings.set(s.meeting_key, []);
          meetings.get(s.meeting_key)!.push(s);
        }

        // Exclude Pre-Season Testing meetings
        const raceMeetings = Array.from(meetings.values()).filter((m) =>
          m.some((s) => s.session_name === 'Race' || s.session_name === 'Qualifying')
        );

        const calendar = getSeasonCalendar(seasonYear);
        const calRace = calendar.find((r) => r.round === round);
        let weekendSessions: typeof sessions | undefined;

        if (calRace?.targetDateUtc) {
          const targetMs = new Date(calRace.targetDateUtc).getTime();
          const FOUR_DAYS_MS = 4 * 24 * 60 * 60 * 1000;
          weekendSessions = raceMeetings.find((m) => {
            const raceS = m.find((s) => s.session_name === 'Race') || m[m.length - 1];
            return Math.abs(new Date(raceS.date_start).getTime() - targetMs) <= FOUR_DAYS_MS;
          });
        }
        if (!weekendSessions) {
          weekendSessions = raceMeetings[round - 1];
        }
        if (!weekendSessions) throw new Error('Meeting not found');

        const raceSession = weekendSessions.find((s) => s.session_name === 'Race');
        if (!raceSession) throw new Error('Race session not found');

        if (!active) return;
        setSession(raceSession);

        const [drv, rdo, rc] = await Promise.all([
          fetchDrivers(raceSession.session_key).catch(() => []),
          fetchTeamRadio(raceSession.session_key).catch(() => []),
          fetchRaceControl(raceSession.session_key).catch(() => []),
        ]);

        if (!active) return;
        setDrivers(drv);
        setRadios(rdo);
        setRaceControl(rc);
      } catch (e) {
        console.error(e);
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [round, seasonYear]);

  const driverMap = useMemo(() => new Map(drivers.map((d) => [d.driver_number, d])), [drivers]);

  // Combine Team Radios and Race Control Messages into a single timeline
  const timeline = useMemo(() => {
    type TimelineItem =
      | { type: 'radio'; time: number; date: Date; data: TeamRadio }
      | { type: 'race_control'; time: number; date: Date; data: RaceControlMessage };

    const items: TimelineItem[] = [];

    for (const r of radios) {
      items.push({ type: 'radio', time: new Date(r.date).getTime(), date: new Date(r.date), data: r });
    }
    for (const rc of raceControl) {
      items.push({ type: 'race_control', time: new Date(rc.date).getTime(), date: new Date(rc.date), data: rc });
    }

    return items.sort((a, b) => a.time - b.time);
  }, [radios, raceControl]);

  // Audio Playback
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);

  return (
    <div
      className={
        inlineMode
          ? 'w-full animate-fadeIn'
          : 'fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-black/80 backdrop-blur-sm'
      }
      onClick={inlineMode ? undefined : onClose}
    >
      <div
        className={
          inlineMode
            ? 'relative w-full flex flex-col bg-slate-950 border border-white/15 rounded-2xl shadow-xl overflow-hidden max-h-[760px]'
            : 'relative w-full max-w-4xl max-h-[90vh] flex flex-col bg-slate-950 border border-white/15 rounded-2xl shadow-2xl overflow-hidden'
        }
        onClick={inlineMode ? undefined : (e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-slate-900/70">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono text-[11px] font-bold">
                {seasonYear}年 第{round}戦
              </span>
              <h2 className="text-base sm:text-lg font-bold text-white font-racing">
                レース振り返り（FIA公式無線 ＆ レースコントロール記録）
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 font-mono">
              {gpName ? toJapaneseGpName(gpName) : session?.meeting_name || session?.location || `Round ${round}`} — OpenF1 Official Telemetry Archive ({radios.length}件のチーム無線 / {raceControl.length}件の競技運営記録)
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-2.5 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer flex items-center gap-1 text-xs font-mono border border-white/10"
          >
            <X className="w-4 h-4" />
            {inlineMode && <span>折りたたむ</span>}
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-white/10">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 text-slate-400">
              <Loader2 className="w-8 h-8 animate-spin mb-4 text-emerald-500" />
              <p>FIA公式テレメトリー・通信記録を取得中...</p>
            </div>
          ) : timeline.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-slate-500">
              <p>このセッションの通信記録は登録されていません。</p>
            </div>
          ) : (
            <div className="relative border-l-2 border-white/5 ml-4 pl-6 space-y-6">
              {timeline.map((item, idx) => {
                if (item.type === 'radio') {
                  const driver = driverMap.get(item.data.driver_number);
                  const isPlaying = playingAudio === item.data.recording_url;
                  return (
                    <div key={`radio-${idx}`} className="relative">
                      <div className="absolute -left-[35px] top-1.5 w-6 h-6 rounded-full bg-slate-800 border-2 border-slate-950 flex items-center justify-center">
                        <RadioReceiver className="w-3 h-3 text-slate-400" />
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="flex-1 rounded-xl bg-slate-900/80 border border-white/5 p-4 relative overflow-hidden group">
                          {/* Accent Color */}
                          <div
                            className="absolute left-0 top-0 bottom-0 w-1"
                            style={{ backgroundColor: constructorColour(driver?.team_name?.toLowerCase().replace(/ /g, '_') || '') }}
                          />
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-white">{driver?.name_acronym || `#${item.data.driver_number}`}</span>
                              <span className="text-xs text-slate-500">{driver?.team_name}</span>
                            </div>
                            <span className="text-[11px] text-slate-500 font-mono">
                              {item.date.toLocaleTimeString('ja-JP', { hour12: false, timeZone: 'UTC' })} UTC
                            </span>
                          </div>

                          <div className="mt-3 flex items-center justify-between">
                            <button
                              type="button"
                              onClick={() => {
                                if (isPlaying) {
                                  audioRef.current?.pause();
                                  audioRef.current = null;
                                  setPlayingAudio(null);
                                } else {
                                  audioRef.current?.pause();
                                  setPlayingAudio(item.data.recording_url);
                                  const audio = new Audio(item.data.recording_url);
                                  audioRef.current = audio;
                                  audio.play().catch(() => setPlayingAudio(null));
                                  audio.onended = () => setPlayingAudio(null);
                                }
                              }}
                              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                                isPlaying ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                              }`}
                            >
                              {isPlaying ? <Volume2 className="w-4 h-4 animate-pulse" /> : <PlayCircle className="w-4 h-4" />}
                              {isPlaying ? '再生中 (クリックで停止)' : 'チーム無線を再生'}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                } else {
                  return (
                    <div key={`rc-${idx}`} className="relative">
                      <div className="absolute -left-[35px] top-1.5 w-6 h-6 rounded-full bg-amber-500/20 border-2 border-slate-950 flex items-center justify-center">
                        <ShieldAlert className="w-3 h-3 text-amber-500" />
                      </div>
                      <div className="flex items-start gap-4 opacity-80">
                        <div className="flex-1 rounded-xl bg-amber-950/30 border border-amber-500/20 p-4">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-bold text-amber-500 font-racing">RACE CONTROL</span>
                            <span className="text-[10px] text-slate-500 font-mono">
                              {item.date.toLocaleTimeString('ja-JP', { hour12: false, timeZone: 'UTC' })} UTC
                            </span>
                          </div>
                          <p className="text-sm text-slate-300 uppercase tracking-wide">{item.data.message}</p>
                        </div>
                      </div>
                    </div>
                  );
                }
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
