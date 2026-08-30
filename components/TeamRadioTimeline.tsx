'use client';

/**
 * components/TeamRadioTimeline.tsx
 * Multi-column timeline: team radio recordings, pit stops, FIA race control messages.
 * Supports category filter pills and audio playback.
 */

import React, { useState, useRef, useCallback, useEffect, useImperativeHandle, forwardRef } from 'react';
import type { Driver, Lap, TeamRadio, PitStop, RaceControlMessage } from '@/lib/types';
import { formatColor, mapRadioRecordingsToLaps } from '@/lib/telemetryUtils';

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
  transcriptsCache: Record<string, { transcript: string; translation: string; category: string }>;
  onTranscriptFetched: (url: string, data: { transcript: string; translation: string; category: string }) => void;
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
  const columnRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const cardRefs = useRef<Record<string, Record<number, HTMLDivElement | null>>>({});

  useImperativeHandle(ref, () => ({
    scrollToLap(driverNum: string, lapNumber: number) {
      const card = cardRefs.current[driverNum]?.[lapNumber];
      if (card) {
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        card.classList.remove('ring-2', 'ring-yellow-400');
        void card.offsetWidth;
        card.classList.add('ring-2', 'ring-yellow-400');
        setTimeout(() => card.classList.remove('ring-2', 'ring-yellow-400'), 2000);
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

  // Transcription fetch via BFF
  const fetchTranscript = useCallback(
    async (url: string) => {
      if (transcriptsCache[url] || loadingUrls.has(url)) return;
      setLoadingUrls(prev => new Set(prev).add(url));
      try {
        const endpoint = '/api/transcribe';
        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
        if (geminiApiKey) headers['x-gemini-key'] = geminiApiKey;
        const res = await fetch(endpoint, {
          method: 'POST',
          headers,
          body: JSON.stringify({ audioUrl: url }),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json() as { transcript: string; translation: string; category: string };
        onTranscriptFetched(url, data);
      } catch (e) {
        console.warn('[Transcribe] Failed:', e);
      } finally {
        setLoadingUrls(prev => { const s = new Set(prev); s.delete(url); return s; });
      }
    },
    [geminiApiKey, transcriptsCache, loadingUrls, onTranscriptFetched]
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
  const gridClass = colCount === 1 ? 'grid-cols-1' : colCount === 2 ? 'grid-cols-2' : 'grid-cols-3';

  // FIA section always at top if any FIA events
  const visibleFia = activeFilter === 'ALL' || activeFilter === 'FIA' ? fiaEvents : [];

  return (
    <div className="glass-card overflow-hidden flex flex-col gap-0">
      {/* Section Header + Filter Pills */}
      <div className="px-4 pt-4 pb-3 border-b border-white/10">
        <h3 className="text-xs font-racing font-bold text-white tracking-widest border-l-2 border-f1-red pl-2 mb-3 uppercase">
          TEAM RADIO & EVENTS
        </h3>
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
          {visibleFia.map(ev => (
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
      <div className={`grid ${gridClass} divide-x divide-white/5 flex-1 min-h-0`}>
        {selectedDrivers.map(driverNum => {
          const driver = drivers.find(d => d.driver_number.toString() === driverNum);
          const color = driver ? formatColor(driver.team_colour) : '#38bdf8';
          const events = buildEvents(driverNum);

          // Filter events
          const filtered = events.filter(ev => {
            if (activeFilter === 'ALL') return true;
            if (activeFilter === 'FIA') return false; // shown separately
            if (ev.eventType === 'pit') return activeFilter === 'PIT';
            if (ev.eventType === 'radio') return ev.category === activeFilter;
            return false;
          });

          if (!cardRefs.current[driverNum]) cardRefs.current[driverNum] = {};

          return (
            <div key={driverNum} className="flex flex-col min-h-0">
              {/* Column Header */}
              <div
                className="px-3 py-2 text-xs font-racing font-bold border-b border-white/10 flex items-center gap-2 flex-shrink-0"
                style={{ color }}
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                {driver?.name_acronym ?? `#${driverNum}`}
                <span className="text-slate-500 font-normal ml-1">#{driverNum}</span>
              </div>

              {/* Cards scroll area */}
              <div
                ref={el => { columnRefs.current[driverNum] = el; }}
                className="overflow-y-auto flex-1 p-2 flex flex-col gap-2 max-h-80"
              >
                {filtered.length === 0 ? (
                  <div className="text-slate-600 text-xs text-center py-6">イベントなし</div>
                ) : (
                  filtered.map(ev => (
                    <TimelineCard
                      key={ev.id}
                      event={ev}
                      driverColor={color}
                      transcript={ev.recording_url ? transcriptsCache[ev.recording_url] : undefined}
                      isLoadingTranscript={ev.recording_url ? loadingUrls.has(ev.recording_url) : false}
                      onFetchTranscript={fetchTranscript}
                      cardRef={el => {
                        if (ev.lap_number !== null && ev.lap_number !== undefined) {
                          cardRefs.current[driverNum] ??= {};
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
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const finalTranscript = transcript?.transcript ?? event.transcript ?? '';
  const finalTranslation = transcript?.translation ?? event.translation ?? '';
  const finalCategory = (transcript?.category ?? event.category ?? '').toUpperCase();

  const badgeClass = CATEGORY_BADGE_COLORS[finalCategory] ?? CATEGORY_BADGE_COLORS.DEFAULT;

  const toggleAudio = () => {
    if (!event.recording_url) return;
    if (!audioRef.current) {
      audioRef.current = new Audio(event.recording_url);
      audioRef.current.onended = () => setIsPlaying(false);
    }
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }
  };

  // Cleanup audio on unmount
  useEffect(() => {
    return () => { audioRef.current?.pause(); };
  }, []);

  if (event.eventType === 'pit') {
    return (
      <div
        ref={cardRef}
        className="bg-red-950/30 border border-red-500/25 rounded-lg p-2.5 text-xs transition-all"
      >
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-1.5">
            <span className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-xs">P</span>
            <span className="font-racing text-red-300 font-bold">PIT STOP</span>
            <span className="text-slate-500">Lap {event.lap_number}</span>
          </div>
          <span className="text-slate-500">{formatTime(event.date)}</span>
        </div>
        <div className="flex gap-3 text-slate-300 mt-1">
          <span>
            <span className="text-slate-500">停車: </span>
            <span className="font-mono font-bold">{event.stop_duration?.toFixed(1)}s</span>
          </span>
          <span>
            <span className="text-slate-500">ピット: </span>
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
        className="bg-slate-800/50 border border-white/8 rounded-lg p-2.5 text-xs transition-all hover:border-white/15"
      >
        {/* Header row */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            {finalCategory && (
              <span className={`px-1.5 py-0.5 rounded border text-xs font-medium ${badgeClass}`}>
                {finalCategory}
              </span>
            )}
            <span className="text-slate-500">L{event.lap_number ?? '?'}</span>
          </div>
          <span className="text-slate-600 text-xs">{formatTime(event.date)}</span>
        </div>

        {/* Transcript */}
        {finalTranscript ? (
          <>
            <p className="text-slate-100 text-xs leading-relaxed mb-1">{finalTranscript}</p>
            {finalTranslation && (
              <p className="text-slate-400 text-xs leading-relaxed">{finalTranslation}</p>
            )}
          </>
        ) : isLoadingTranscript ? (
          <div className="text-slate-500 text-xs italic">文字起こし中...</div>
        ) : (
          <div className="text-slate-600 text-xs italic">
            テキストなし
            {event.recording_url && (
              <button
                onClick={() => onFetchTranscript(event.recording_url!)}
                className="ml-2 text-blue-400 hover:text-blue-300 underline"
              >
                AIで文字起こし
              </button>
            )}
          </div>
        )}

        {/* Audio player */}
        {event.recording_url && (
          <div className="mt-2 flex items-center gap-2">
            <button
              onClick={toggleAudio}
              className="flex items-center gap-1.5 px-2 py-1 rounded bg-slate-700/60 hover:bg-slate-600/60 text-slate-300 text-xs transition-colors"
            >
              {isPlaying ? '⏸' : '▶'} {isPlaying ? '再生中' : '再生'}
            </button>
            {isPlaying && (
              <div className="flex gap-0.5 items-center h-4">
                {[1,2,3,4,5].map(i => (
                  <div
                    key={i}
                    className="w-0.5 bg-blue-400 rounded-full animate-pulse"
                    style={{
                      height: `${8 + (i % 3) * 4}px`,
                      animationDelay: `${i * 0.1}s`,
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  return null;
}

// useMemo wrapper for fiaEvents (needed inside the component)
function useMemo<T>(factory: () => T, deps: React.DependencyList): T {
  return React.useMemo(factory, deps);
}
