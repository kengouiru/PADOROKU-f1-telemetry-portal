'use client';

/**
 * components/TeamRadioTimeline.tsx
 * Multi-column timeline: team radio recordings, pit stops, FIA race control messages.
 * Enhanced with audio seek-bar player and Gemini AI tactical context summary.
 */

import React, { useState, useRef, useCallback, useEffect, useMemo, useImperativeHandle, forwardRef } from 'react';
import type { Driver, Lap, TeamRadio, PitStop, RaceControlMessage } from '@/lib/types';
import { formatColor, mapRadioRecordingsToLaps, formatLapTime, getProxiedAudioUrl } from '@/lib/telemetryUtils';

// ── Types ───────────────────────────────────────────────────────────────────

type FilterType = 'ALL' | 'PIT' | 'TYRE' | 'PACE' | 'SAFETY' | 'STRATEGY' | 'FIA';

interface TimelineEvent {
  id: string;
  lap_number: number | null;
  date: string;
  eventType: 'radio' | 'pit' | 'fia';
  driverNumber?: string;
  // radio fields
  recording_url?: string;
  transcript?: string;
  translation?: string;
  aiSummary?: string;
  category?: string;
  // pit fields
  stop_duration?: number;
  lane_duration?: number;
  // fia fields
  message?: string;
  flag?: string | null;
  fiaCategory?: string;
}

export interface TeamRadioTimelineHandle {
  scrollToLap: (driverNum: string, lapNumber: number) => void;
}

interface TeamRadioTimelineProps {
  selectedDrivers: string[];
  teamRadioCache: Record<string, TeamRadio[]>;
  pitStopsCache: Record<string, PitStop[]>;
  raceControlMessages: RaceControlMessage[];
  drivers: Driver[];
  lapsCache: Record<string, Lap[]>;
  geminiApiKey: string;
  transcriptsCache: Record<string, { transcript: string; translation: string; aiSummary?: string; category: string }>;
  onTranscriptFetched: (url: string, data: { transcript: string; translation: string; aiSummary?: string; category: string }) => void;
}

// ── Category filter config ───────────────────────────────────────────────────

const FILTER_LABELS: Record<FilterType, string> = {
  ALL: 'すべて', PIT: 'PIT', TYRE: 'TYRE', PACE: 'PACE',
  SAFETY: 'SAFETY', STRATEGY: 'STRAT', FIA: 'FIA',
};

const CATEGORY_BADGE_COLORS: Record<string, string> = {
  PIT:      'bg-red-500/20 text-red-300 border-red-500/30',
  TYRE:     'bg-yellow-500/20 text-yellow-200 border-yellow-500/30',
  PACE:     'bg-blue-500/20 text-blue-200 border-blue-500/30',
  SAFETY:   'bg-orange-500/20 text-orange-200 border-orange-500/30',
  STRATEGY: 'bg-purple-500/20 text-purple-200 border-purple-500/30',
  FIA:      'bg-slate-500/20 text-slate-300 border-slate-500/30',
  DEFAULT:  'bg-slate-700/40 text-slate-400 border-slate-600/30',
};

function flagColor(flag: string | null | undefined): string {
  if (!flag) return '';
  const f = flag.toUpperCase();
  if (f.includes('RED')) return 'bg-red-900/30 border-red-500/40';
  if (f.includes('YELLOW')) return 'bg-yellow-900/20 border-yellow-500/30';
  if (f.includes('GREEN')) return 'bg-green-900/20 border-green-500/30';
  if (f.includes('BLACK AND WHITE')) return 'bg-slate-800/60 border-slate-400/40';
  return '';
}

function formatTime(iso: string): string {
  try {
    return new Date(iso).toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  } catch { return iso; }
}

// ── Main Component ────────────────────────────────────────────────────────────

const TeamRadioTimeline = forwardRef<TeamRadioTimelineHandle, TeamRadioTimelineProps>(function TeamRadioTimeline(
  { selectedDrivers, teamRadioCache, pitStopsCache, raceControlMessages, drivers, lapsCache, geminiApiKey, transcriptsCache, onTranscriptFetched },
  ref
) {
  const [activeFilter, setActiveFilter] = useState<FilterType>('ALL');
  const [loadingUrls, setLoadingUrls] = useState<Set<string>>(new Set());
  const cardRefs = useRef<Record<string, Record<number, HTMLDivElement | null>>>({});

  useImperativeHandle(ref, () => ({
    scrollToLap(driverNum: string, lapNumber: number) {
      const card = cardRefs.current[driverNum]?.[lapNumber];
      if (card) {
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        card.classList.remove('ring-2', 'ring-sky-400');
        void card.offsetWidth;
        card.classList.add('ring-2', 'ring-sky-400');
        setTimeout(() => card.classList.remove('ring-2', 'ring-sky-400'), 2500);
      }
    },
  }));

  // Build event list per driver
  const buildEvents = useCallback(
    (driverNum: string): TimelineEvent[] => {
      const laps = lapsCache[driverNum] ?? [];
      const radios = mapRadioRecordingsToLaps(teamRadioCache[driverNum] ?? [], laps);
      const pits = pitStopsCache[driverNum] ?? [];

      const events: TimelineEvent[] = [
        ...radios.map((r, i) => ({
          id: `radio_${driverNum}_${i}`,
          lap_number: r.lap_number ?? null,
          date: r.date,
          eventType: 'radio' as const,
          driverNumber: driverNum,
          recording_url: r.recording_url,
          transcript: r.transcript,
          translation: r.translation,
          aiSummary: r.aiSummary,
          category: r.category,
        })),
        ...pits.map((p, i) => ({
          id: `pit_${driverNum}_${i}`,
          lap_number: p.lap_number,
          date: p.date,
          eventType: 'pit' as const,
          driverNumber: driverNum,
          stop_duration: p.stop_duration,
          lane_duration: p.lane_duration,
        })),
      ];

      return events.sort((a, b) => (a.lap_number ?? 0) - (b.lap_number ?? 0));
    },
    [lapsCache, teamRadioCache, pitStopsCache]
  );

  // FIA events (shared across all columns)
  const fiaEvents = useMemo(
    () =>
      raceControlMessages.map((m, i) => ({
        id: `fia_${i}`,
        lap_number: m.lap_number,
        date: m.date,
        eventType: 'fia' as const,
        message: m.message,
        flag: m.flag,
        fiaCategory: m.category,
      })),
    [raceControlMessages]
  );

  // Transcription fetch via BFF with lap telemetry context
  const fetchTranscript = useCallback(
    async (url: string, driverNum?: string, lapNumber?: number | null) => {
      if (transcriptsCache[url] || loadingUrls.has(url)) return;
      setLoadingUrls(prev => new Set(prev).add(url));
      try {
        const endpoint = '/api/transcribe';
        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
        if (geminiApiKey) headers['x-gemini-key'] = geminiApiKey;

        const driverInfo = drivers.find(d => d.driver_number.toString() === driverNum);
        const lap = driverNum && lapNumber ? (lapsCache[driverNum] ?? []).find(l => l.lap_number === lapNumber) : null;
        const lapContext = lap
          ? `Lap ${lapNumber}, Lap Time: ${formatLapTime(lap.lap_duration ?? lap.lap_time)}, Tyre: ${lap.compound ?? 'UNKNOWN'} (${lap.tyreAge ?? 0} laps old)`
          : undefined;

        const res = await fetch(endpoint, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            audioUrl: url,
            driverNumber: driverNum ? Number(driverNum) : undefined,
            driverName: driverInfo?.full_name,
            lapNumber: lapNumber ?? undefined,
            lapContext,
          }),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = (await res.json()) as { transcript: string; translation: string; aiSummary?: string; category: string };
        onTranscriptFetched(url, data);
      } catch (e) {
        console.warn('[Transcribe] Failed:', e);
      } finally {
        setLoadingUrls(prev => { const s = new Set(prev); s.delete(url); return s; });
      }
    },
    [geminiApiKey, transcriptsCache, loadingUrls, onTranscriptFetched, drivers, lapsCache]
  );

  if (selectedDrivers.length === 0) {
    return (
      <div className="glass-card p-6 flex flex-col items-center justify-center min-h-40 text-slate-500 text-sm gap-2">
        <span className="text-3xl">🎙</span>
        <span>ドライバーを選択すると、チーム無線がここに表示されます</span>
      </div>
    );
  }

  const colCount = selectedDrivers.length;
  const gridClass = colCount === 1 ? 'grid-cols-1' : colCount === 2 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-3';

  // FIA section always at top if any FIA events
  const visibleFia = activeFilter === 'ALL' || activeFilter === 'FIA' ? fiaEvents : [];

  return (
    <div className="glass-card overflow-hidden flex flex-col gap-0">
      {/* Section Header + Filter Pills */}
      <div className="px-4 pt-4 pb-3 border-b border-white/10">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-racing font-bold text-white tracking-widest border-l-2 border-f1-red pl-2 uppercase">
            TEAM RADIO & PIT STOP TIMELINE
          </h3>
          <span className="text-xs text-slate-500 hidden sm:inline">
            🎙️ 音声再生・Gemini戦術意図要約対応
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {(Object.keys(FILTER_LABELS) as FilterType[]).map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-3 py-1 text-xs rounded-full border transition-colors font-medium ${
                activeFilter === f
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : 'bg-slate-800/60 border-white/10 text-slate-400 hover:border-white/20 hover:text-slate-200'
              }`}
            >
              {FILTER_LABELS[f]}
            </button>
          ))}
        </div>
      </div>

      {/* FIA Race Control Messages (shared) */}
      {visibleFia.length > 0 && (
        <div className="px-4 py-2 bg-slate-900/60 border-b border-white/5 flex flex-col gap-1.5 max-h-32 overflow-y-auto">
          {visibleFia.map((ev: TimelineEvent) => (
            <div
              key={ev.id}
              className={`flex items-start gap-2 text-xs px-2 py-1.5 rounded border ${flagColor(ev.flag) || 'border-slate-700/40'}`}
            >
              <span className="text-slate-500 flex-shrink-0 font-mono mt-0.5">L{ev.lap_number ?? '-'}</span>
              <span className="text-slate-300 flex-1">{ev.message}</span>
              {ev.flag && (
                <span className="text-xs text-slate-400 flex-shrink-0">{ev.flag}</span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Multi-column grid */}
      <div className={`grid ${gridClass} divide-y md:divide-y-0 md:divide-x divide-white/5 flex-1 min-h-0`}>
        {selectedDrivers.map(driverNum => {
          const driver = drivers.find(d => d.driver_number.toString() === driverNum);
          const color = driver ? formatColor(driver.team_colour) : '#38bdf8';
          const events = buildEvents(driverNum);

          // Filter events
          const filtered = events.filter(ev => {
            if (activeFilter === 'ALL') return true;
            if (activeFilter === 'FIA') return false; // FIA shown in shared area
            if (activeFilter === 'PIT') return ev.eventType === 'pit' || ev.category === 'PIT';
            return ev.category === activeFilter;
          });

          return (
            <div key={driverNum} className="flex flex-col min-h-0">
              {/* Column header */}
              <div
                className="p-3 border-b border-white/5 flex items-center justify-between bg-slate-900/40"
                style={{ borderLeftWidth: 3, borderLeftColor: color }}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="font-racing font-bold text-xs px-1.5 py-0.5 rounded border"
                    style={{ borderColor: `${color}60`, color, backgroundColor: `${color}15` }}
                  >
                    {driver?.name_acronym ?? `#${driverNum}`}
                  </span>
                  <span className="text-xs font-bold text-white truncate max-w-[120px]">
                    {driver?.full_name ?? `Driver #${driverNum}`}
                  </span>
                </div>
                <span className="text-xs text-slate-500 font-mono">
                  {filtered.length}件
                </span>
              </div>

              {/* Event card list */}
              <div className="p-3 overflow-y-auto max-h-96 flex flex-col gap-2.5 flex-1">
                {filtered.length === 0 ? (
                  <div className="text-center text-slate-600 text-xs py-8">
                    該当するイベントはありません
                  </div>
                ) : (
                  filtered.map(ev => (
                    <TimelineCard
                      key={ev.id}
                      event={ev}
                      driverColor={color}
                      transcript={ev.recording_url ? transcriptsCache[ev.recording_url] : undefined}
                      isLoadingTranscript={ev.recording_url ? loadingUrls.has(ev.recording_url) : false}
                      onFetchTranscript={url => fetchTranscript(url, driverNum, ev.lap_number)}
                      cardRef={el => {
                        if (!cardRefs.current[driverNum]) cardRefs.current[driverNum] = {};
                        if (ev.lap_number != null) {
                          cardRefs.current[driverNum][ev.lap_number] = el;
                        }
                      }}
                    />
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});

export default TeamRadioTimeline;

// ── Timeline Card ─────────────────────────────────────────────────────────────

interface CardTranscript {
  transcript: string;
  translation: string;
  aiSummary?: string;
  category: string;
}

interface TimelineCardProps {
  event: TimelineEvent;
  driverColor: string;
  transcript?: CardTranscript;
  isLoadingTranscript: boolean;
  onFetchTranscript: (url: string) => void;
  cardRef: (el: HTMLDivElement | null) => void;
}

function TimelineCard({ event, driverColor, transcript, isLoadingTranscript, onFetchTranscript, cardRef }: TimelineCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioError, setAudioError] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const finalTranscript = transcript?.transcript ?? event.transcript ?? '';
  const finalTranslation = transcript?.translation ?? event.translation ?? '';
  const finalAiSummary = transcript?.aiSummary ?? event.aiSummary ?? '';
  const finalCategory = (transcript?.category ?? event.category ?? '').toUpperCase();

  const badgeClass = CATEGORY_BADGE_COLORS[finalCategory] ?? CATEGORY_BADGE_COLORS.DEFAULT;

  // Audio setup
  useEffect(() => {
    if (!event.recording_url) return;
    setAudioError(false);
    const audio = new Audio(getProxiedAudioUrl(event.recording_url));
    audioRef.current = audio;

    audio.onloadedmetadata = () => setDuration(audio.duration || 0);
    audio.ontimeupdate = () => setCurrentTime(audio.currentTime || 0);
    audio.onerror = () => {
      setAudioError(true);
      setIsPlaying(false);
    };
    audio.onended = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, [event.recording_url]);

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          setAudioError(false);
        })
        .catch(() => {
          setAudioError(true);
          setIsPlaying(false);
        });
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = val;
      setCurrentTime(val);
    }
  };

  if (event.eventType === 'pit') {
    return (
      <div
        ref={cardRef}
        className="bg-red-950/30 border border-red-500/25 rounded-xl p-3 text-xs transition-all"
      >
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-xs">P</span>
            <span className="font-racing text-red-300 font-bold">PIT STOP</span>
            <span className="text-slate-400 font-mono">Lap {event.lap_number}</span>
          </div>
          <span className="text-slate-500 font-mono text-[11px]">{formatTime(event.date)}</span>
        </div>
        <div className="flex gap-4 text-slate-300 mt-1">
          <span>
            <span className="text-slate-500">停車: </span>
            <span className="font-mono font-bold text-white">{event.stop_duration?.toFixed(1)}s</span>
          </span>
          <span>
            <span className="text-slate-500">ロスタイム: </span>
            <span className="font-mono">{event.lane_duration?.toFixed(1)}s</span>
          </span>
        </div>
      </div>
    );
  }

  if (event.eventType === 'radio') {
    return (
      <div
        ref={cardRef}
        className="bg-slate-900/60 border border-white/10 rounded-xl p-3 text-xs transition-all hover:border-white/20 flex flex-col gap-2.5"
      >
        {/* Header row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {finalCategory && (
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider ${badgeClass}`}>
                {finalCategory}
              </span>
            )}
            <span className="text-slate-400 font-mono font-bold">L{event.lap_number ?? '?'}</span>
          </div>
          <span className="text-slate-500 text-[11px] font-mono">{formatTime(event.date)}</span>
        </div>

        {/* Audio Player or Fallback */}
        {event.recording_url && !audioError ? (
          <div className="bg-slate-950/70 rounded-lg p-2 border border-white/5 flex items-center gap-2.5">
            <button
              onClick={toggleAudio}
              className="w-7 h-7 rounded-full bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center text-[10px] transition-colors flex-shrink-0"
            >
              {isPlaying ? '⏸' : '▶'}
            </button>
            <div className="flex-1 flex flex-col gap-0.5">
              <input
                type="range"
                min={0}
                max={duration || 100}
                step={0.1}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <div className="flex justify-between text-[9px] text-slate-500 font-mono">
                <span>{currentTime.toFixed(1)}s</span>
                <span>{duration ? `${duration.toFixed(1)}s` : '--'}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-slate-950/40 rounded-lg px-2.5 py-1.5 border border-yellow-500/20 flex items-center gap-1.5 text-slate-400 text-[11px]">
            <span className="text-yellow-400">⚠️</span>
            <span>{audioError ? '音声ファイル読込不可（テキスト要約のみ）' : '音声データなし（テキスト要約のみ）'}</span>
          </div>
        )}

        {/* Transcript & Translation */}
        {finalTranscript ? (
          <div className="space-y-1">
            <p className="text-white font-medium italic text-xs leading-relaxed">"{finalTranscript}"</p>
            {finalTranslation && (
              <p className="text-slate-300 text-xs leading-relaxed">🗣 {finalTranslation}</p>
            )}
          </div>
        ) : isLoadingTranscript ? (
          <div className="text-purple-300 text-xs italic flex items-center gap-1.5">
            <span className="w-3 h-3 border border-purple-400 border-t-transparent rounded-full animate-spin" />
            <span>Geminiで文字起こし ＆ AI戦術要約中...</span>
          </div>
        ) : (
          <div className="text-slate-500 text-xs flex items-center justify-between pt-0.5">
            <span>未解析</span>
            {event.recording_url && (
              <button
                onClick={() => onFetchTranscript(event.recording_url!)}
                className="text-purple-400 hover:text-purple-300 underline font-medium flex items-center gap-1"
              >
                <span>✨</span>
                <span>AI戦術要約を生成</span>
              </button>
            )}
          </div>
        )}

        {/* Tactical AI Summary */}
        {finalAiSummary && (
          <div className="bg-purple-950/30 border border-purple-500/30 rounded-lg p-2.5 text-xs text-purple-200 flex flex-col gap-1">
            <span className="text-[10px] font-bold text-purple-400 flex items-center gap-1 uppercase tracking-wider">
              <span>✨</span>
              <span>AI 戦術意図・背景解説</span>
            </span>
            <p className="leading-relaxed text-slate-200 text-[11px]">{finalAiSummary}</p>
          </div>
        )}
      </div>
    );
  }

  return null;
}
