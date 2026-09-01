'use client';

/**
 * app/page.tsx
 * F1 Telemetry Analyzer — Fully Integrated Dashboard
 *
 * Layout:
 *  Desktop (lg+): [Sidebar 56] | [Main flex-1] | [Right Panel 80 — AI + Notebook tabs]
 *  Tablet (md):   Sidebar collapses to icon drawer; main + right panel stack
 *  Mobile (<md):  Bottom tab bar: 分析 | AI | ノート
 *
 * Initial state: 2024 Bahrain GP Race, VER (#1) vs HAM (#44) instant display.
 */

import React, {
  useState, useEffect, useCallback, useRef, Suspense,
} from 'react';

import type {
  Session, Driver, Lap, Stint, TeamRadio, PitStop,
  RaceControlMessage, SafetyCarPeriod,
} from '@/lib/types';
import {
  MOCK_SESSIONS, MOCK_DRIVERS, MOCK_STINTS,
  MOCK_TEAM_RADIO, MOCK_PIT_STOPS, MOCK_RACE_CONTROL,
  MOCK_LAPS, generateMockLaps,
} from '@/lib/mockData';
import { detectSafetyCarPeriods, enrichLapsWithStints } from '@/lib/telemetryUtils';
import {
  fetchSessions, fetchDrivers, fetchStints, fetchRaceControl,
  fetchLaps, fetchTeamRadio, fetchPitStops, OpenF1Error,
} from '@/lib/openf1Api';

import Sidebar from '@/components/Sidebar';
import LapTable from '@/components/LapTable';
import TeamRadioTimeline, { type TeamRadioTimelineHandle } from '@/components/TeamRadioTimeline';
import AIStrategist from '@/components/AIStrategist';
import RaceNotebook, { type RaceNotebookHandle } from '@/components/RaceNotebook';

import TelemetryChart from '@/components/TelemetryChart';
import SectorAnalysis from '@/components/SectorAnalysis';

// ── App State ─────────────────────────────────────────────────────────────────

interface AppState {
  selectedYear: string;
  selectedMeetingKey: number | null;
  selectedSessionKey: number | null;
  sessions: Session[];
  currentSession: Session | null;
  drivers: Driver[];
  stints: Stint[];
  selectedDrivers: string[];
  lapsCache: Record<string, Lap[]>;
  teamRadioCache: Record<string, TeamRadio[]>;
  pitStopsCache: Record<string, PitStop[]>;
  raceControlMessages: RaceControlMessage[];
  safetyCarPeriods: SafetyCarPeriod[];
  isDemoMode: boolean;
  geminiApiKey: string;
  transcriptsCache: Record<string, { transcript: string; translation: string; category: string }>;
  isLoading: boolean;
}

// Mobile tab type
type MobileTab = 'analysis' | 'ai' | 'notebook';
// Desktop right-panel tab
type RightPanelTab = 'ai' | 'notebook';

const DEFAULT_SESSION_KEY = 9161;
const DEFAULT_MEETING_KEY = 1234;
const DEFAULT_YEAR = '2024';

function buildInitialState(): AppState {
  const stints = MOCK_STINTS[DEFAULT_SESSION_KEY] ?? [];
  const lapsCache: Record<string, Lap[]> = {};
  for (const [key, laps] of Object.entries(MOCK_LAPS)) {
    if (key.startsWith(`${DEFAULT_SESSION_KEY}_`)) {
      const driverNum = key.split('_')[1];
      lapsCache[driverNum] = enrichLapsWithStints(laps, stints, driverNum);
    }
  }

  const drivers = MOCK_DRIVERS[DEFAULT_SESSION_KEY] ?? [];
  const raceControlMessages = MOCK_RACE_CONTROL[DEFAULT_SESSION_KEY] ?? [];
  const allLaps = Object.values(lapsCache).flat();
  const safetyCarPeriods = detectSafetyCarPeriods(raceControlMessages, allLaps);

  const teamRadioCache: Record<string, TeamRadio[]> = {};
  const pitStopsCache: Record<string, PitStop[]> = {};
  for (const key of Object.keys(MOCK_TEAM_RADIO)) {
    if (key.startsWith(`${DEFAULT_SESSION_KEY}_`)) {
      teamRadioCache[key.split('_')[1]] = MOCK_TEAM_RADIO[key] ?? [];
    }
  }
  for (const key of Object.keys(MOCK_PIT_STOPS)) {
    if (key.startsWith(`${DEFAULT_SESSION_KEY}_`)) {
      pitStopsCache[key.split('_')[1]] = MOCK_PIT_STOPS[key] ?? [];
    }
  }

  const storedKey = typeof window !== 'undefined' ? (localStorage.getItem('gemini_api_key') ?? '') : '';
  const storedTranscripts = typeof window !== 'undefined'
    ? JSON.parse(localStorage.getItem('f1_transcripts_cache') ?? '{}') : {};

  const currentSession = MOCK_SESSIONS.find(s => s.session_key === DEFAULT_SESSION_KEY) ?? null;

  return {
    selectedYear: DEFAULT_YEAR,
    selectedMeetingKey: DEFAULT_MEETING_KEY,
    selectedSessionKey: DEFAULT_SESSION_KEY,
    sessions: MOCK_SESSIONS,
    currentSession,
    drivers,
    stints,
    selectedDrivers: ['1', '44'],
    lapsCache,
    teamRadioCache,
    pitStopsCache,
    raceControlMessages,
    safetyCarPeriods,
    isDemoMode: true,
    geminiApiKey: storedKey,
    transcriptsCache: storedTranscripts,
    isLoading: false,
  };
}

// ── Main Component ─────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const [state, setState] = useState<AppState>(buildInitialState);
  const [mobileTab, setMobileTab] = useState<MobileTab>('analysis');
  const [rightPanelTab, setRightPanelTab] = useState<RightPanelTab>('ai');
  const [sidebarOpen, setSidebarOpen] = useState(false); // mobile sidebar drawer

  const timelineRef = useRef<TeamRadioTimelineHandle>(null);
  const notebookRef = useRef<RaceNotebookHandle>(null);

  // Persist Gemini key
  useEffect(() => {
    if (state.geminiApiKey) localStorage.setItem('gemini_api_key', state.geminiApiKey);
  }, [state.geminiApiKey]);

  // Persist transcripts cache
  useEffect(() => {
    localStorage.setItem('f1_transcripts_cache', JSON.stringify(state.transcriptsCache));
  }, [state.transcriptsCache]);

  // Background live API fetch on mount
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const liveSessions = await fetchSessions(parseInt(state.selectedYear));
        if (cancelled || !liveSessions.length) return;
        setState(prev => ({ ...prev, sessions: liveSessions, isDemoMode: false }));
      } catch (e) {
        if (e instanceof OpenF1Error && e.code === 'RATE_LIMIT') {
          console.warn('[API] Rate limited — demo mode');
        }
      }
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Handlers ────────────────────────────────────────────────────────────────

  const handleYearChange = useCallback(async (year: string) => {
    setState(prev => ({ ...prev, selectedYear: year, isLoading: true }));
    try {
      const liveSessions = await fetchSessions(parseInt(year));
      const sessions = liveSessions.length > 0 ? liveSessions : MOCK_SESSIONS.filter(s => s.year === parseInt(year));
      const firstMeeting = sessions[0]?.meeting_key ?? null;
      setState(prev => ({
        ...prev, sessions, selectedMeetingKey: firstMeeting,
        selectedSessionKey: null, currentSession: null,
        drivers: [], selectedDrivers: [], lapsCache: {},
        teamRadioCache: {}, pitStopsCache: {},
        raceControlMessages: [], safetyCarPeriods: [],
        isDemoMode: liveSessions.length === 0, isLoading: false,
      }));
    } catch {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const handleMeetingChange = useCallback((key: number) => {
    setState(prev => ({
      ...prev, selectedMeetingKey: key, selectedSessionKey: null,
      currentSession: null, drivers: [], selectedDrivers: [],
      lapsCache: {}, teamRadioCache: {}, pitStopsCache: {},
      raceControlMessages: [], safetyCarPeriods: [],
    }));
  }, []);

  const handleSessionChange = useCallback(async (sessionKey: number) => {
    setState(prev => ({ ...prev, selectedSessionKey: sessionKey, isLoading: true, selectedDrivers: [] }));

    let drivers: Driver[] = [];
    let stints: Stint[] = [];
    let raceControlMessages: RaceControlMessage[] = [];
    let isDemoMode = false;
    let currentSession: Session | null = null;

    try {
      [drivers, stints, raceControlMessages] = await Promise.all([
        fetchDrivers(sessionKey), fetchStints(sessionKey), fetchRaceControl(sessionKey),
      ]);
    } catch {
      isDemoMode = true;
      drivers = MOCK_DRIVERS[sessionKey] ?? [];
      stints = MOCK_STINTS[sessionKey] ?? [];
      raceControlMessages = MOCK_RACE_CONTROL[sessionKey] ?? [];
    }

    currentSession =
      MOCK_SESSIONS.find(s => s.session_key === sessionKey) ??
      { session_key: sessionKey, session_name: 'Session', session_type: 'Race', meeting_key: 0, date_start: '', year: 2024 };

    const lapsCache: Record<string, Lap[]> = {};
    for (const drv of drivers) {
      const num = drv.driver_number.toString();
      const mk = `${sessionKey}_${drv.driver_number}`;
      if (MOCK_LAPS[mk]) lapsCache[num] = enrichLapsWithStints(MOCK_LAPS[mk], stints, num);
    }

    const allLaps = Object.values(lapsCache).flat();
    const safetyCarPeriods = detectSafetyCarPeriods(raceControlMessages, allLaps);

    const teamRadioCache: Record<string, TeamRadio[]> = {};
    const pitStopsCache: Record<string, PitStop[]> = {};
    for (const drv of drivers) {
      const num = drv.driver_number.toString();
      const mk = `${sessionKey}_${drv.driver_number}`;
      teamRadioCache[num] = MOCK_TEAM_RADIO[mk] ?? [];
      pitStopsCache[num] = MOCK_PIT_STOPS[mk] ?? [];
    }

    setState(prev => ({
      ...prev, drivers, stints, raceControlMessages, safetyCarPeriods,
      lapsCache, teamRadioCache, pitStopsCache, currentSession,
      isDemoMode: prev.isDemoMode || isDemoMode, isLoading: false,
    }));
  }, []);

  const handleDriverToggle = useCallback(async (driverNum: string, checked: boolean) => {
    setState(prev => {
      if (!checked) return { ...prev, selectedDrivers: prev.selectedDrivers.filter(n => n !== driverNum) };
      if (prev.selectedDrivers.length >= 3) return prev;
      return { ...prev, selectedDrivers: [...prev.selectedDrivers, driverNum] };
    });

    if (!checked || !state.selectedSessionKey) return;

    try {
      const [laps, radios, pits] = await Promise.all([
        fetchLaps(state.selectedSessionKey, parseInt(driverNum)).catch(() => null),
        fetchTeamRadio(state.selectedSessionKey, parseInt(driverNum)).catch(() => null),
        fetchPitStops(state.selectedSessionKey, parseInt(driverNum)).catch(() => null),
      ]);
      setState(prev => {
        const mk = `${state.selectedSessionKey}_${driverNum}`;
        const enriched = laps?.length
          ? enrichLapsWithStints(laps, prev.stints, driverNum)
          : (MOCK_LAPS[mk] ? enrichLapsWithStints(MOCK_LAPS[mk], prev.stints, driverNum) : generateMockLaps(parseInt(driverNum), state.selectedSessionKey!));
        const allLaps = { ...prev.lapsCache, [driverNum]: enriched };
        return {
          ...prev,
          lapsCache: { ...prev.lapsCache, [driverNum]: enriched },
          teamRadioCache: { ...prev.teamRadioCache, [driverNum]: radios?.length ? radios : (prev.teamRadioCache[driverNum] ?? []) },
          pitStopsCache: { ...prev.pitStopsCache, [driverNum]: pits?.length ? pits : (prev.pitStopsCache[driverNum] ?? []) },
          safetyCarPeriods: detectSafetyCarPeriods(prev.raceControlMessages, Object.values(allLaps).flat()),
        };
      });
    } catch (e) {
      console.warn(`[Driver ${driverNum}] load error:`, e);
    }
  }, [state.selectedSessionKey]);

  const handleLapClick = useCallback((driverNum: string, lapNumber: number) => {
    timelineRef.current?.scrollToLap(driverNum, lapNumber);
    // On mobile, switch to analysis tab when lap is clicked
    if (mobileTab !== 'analysis') setMobileTab('analysis');
  }, [mobileTab]);

  const handleTranscriptFetched = useCallback(
    (url: string, data: { transcript: string; translation: string; category: string }) => {
      setState(prev => ({ ...prev, transcriptsCache: { ...prev.transcriptsCache, [url]: data } }));
    }, []
  );

  const handleAddToNotebook = useCallback((content: string, source: 'ai') => {
    notebookRef.current?.addNote(content, source);
    // Switch to notebook tab so user sees the added note
    setRightPanelTab('notebook');
    if (mobileTab === 'ai') setMobileTab('notebook');
  }, [mobileTab]);

  // Session tag for notebook entries
  const sessionTag = state.currentSession
    ? `${state.currentSession.year} — ${state.currentSession.meeting_official_name?.replace('(デモ用サンプル)', '').trim() ?? ''} ${state.currentSession.session_name}`
    : undefined;

  // ── Shared content blocks ─────────────────────────────────────────────────

  const sidebarContent = (
    <Sidebar
      selectedYear={state.selectedYear}
      onYearChange={handleYearChange}
      selectedMeetingKey={state.selectedMeetingKey}
      onMeetingChange={handleMeetingChange}
      selectedSessionKey={state.selectedSessionKey}
      onSessionChange={handleSessionChange}
      sessions={state.sessions}
      drivers={state.drivers}
      selectedDrivers={state.selectedDrivers}
      onDriverToggle={handleDriverToggle}
      geminiApiKey={state.geminiApiKey}
      onGeminiKeyChange={key => setState(prev => ({ ...prev, geminiApiKey: key }))}
      isDemoMode={state.isDemoMode}
      isLoading={state.isLoading}
    />
  );

  const analysisContent = (
    <div className="flex flex-col gap-5">
      <TelemetryChart
        selectedDrivers={state.selectedDrivers}
        lapsCache={state.lapsCache}
        drivers={state.drivers}
        stints={state.stints}
        pitStopsCache={state.pitStopsCache}
        teamRadioCache={state.teamRadioCache}
        safetyCarPeriods={state.safetyCarPeriods}
        onLapClick={handleLapClick}
        geminiApiKey={state.geminiApiKey}
        transcriptsCache={state.transcriptsCache}
        onTranscriptFetched={handleTranscriptFetched}
      />

      {state.selectedDrivers.length > 0 && (
        <SectorAnalysis
          selectedDrivers={state.selectedDrivers}
          drivers={state.drivers}
          lapsCache={state.lapsCache}
        />
      )}

      {state.selectedDrivers.length > 0 && (
        <section>
          <SectionTitle>LAP DETAIL TABLE</SectionTitle>
          <LapTable
            selectedDrivers={state.selectedDrivers}
            lapsCache={state.lapsCache}
            drivers={state.drivers}
            stints={state.stints}
          />
        </section>
      )}

      <section>
        <TeamRadioTimeline
          ref={timelineRef}
          selectedDrivers={state.selectedDrivers}
          teamRadioCache={state.teamRadioCache}
          pitStopsCache={state.pitStopsCache}
          raceControlMessages={state.raceControlMessages}
          drivers={state.drivers}
          lapsCache={state.lapsCache}
          geminiApiKey={state.geminiApiKey}
          transcriptsCache={state.transcriptsCache}
          onTranscriptFetched={handleTranscriptFetched}
        />
      </section>
    </div>
  );

  const aiContent = (
    // flex-1 so h-full works inside the right panel's flex-col chain
    <div className="flex-1 min-h-0 flex flex-col lg:h-full min-h-[480px] p-3">
      <AIStrategist
        selectedDrivers={state.selectedDrivers}
        drivers={state.drivers}
        lapsCache={state.lapsCache}
        stints={state.stints}
        pitStopsCache={state.pitStopsCache}
        geminiApiKey={state.geminiApiKey}
        session={state.currentSession}
        onAddToNotebook={handleAddToNotebook}
      />
    </div>
  );

  const notebookContent = (
    <div className="flex-1 min-h-0 flex flex-col lg:h-full min-h-[480px] p-3">
      <RaceNotebook ref={notebookRef} sessionTag={sessionTag} />
    </div>
  );

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen flex flex-col bg-f1-gradient">

      {/* ── Header (sticky) ── */}
      <header className="flex-shrink-0 sticky top-0 z-30 border-b border-white/10 px-4 py-2.5 flex items-center gap-3 bg-slate-950/85 backdrop-blur-md">
        {/* Mobile menu toggle */}
        <button
          className="lg:hidden text-slate-400 hover:text-white text-lg"
          onClick={() => setSidebarOpen(v => !v)}
          aria-label="Toggle sidebar"
        >
          ☰
        </button>

        {/* Logo */}
        <div className="w-7 h-7 bg-f1-red rounded flex items-center justify-center flex-shrink-0">
          <span className="font-racing text-white text-xs font-black">F1</span>
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="font-racing text-sm font-bold text-white tracking-widest leading-tight truncate">
            F1 TELEMETRY ANALYZER
          </h1>
          <p className="text-slate-500 text-xs hidden sm:block">
            {state.isDemoMode ? 'DEMO — 2024 Bahrain GP' : 'LIVE — OpenF1 API'}
          </p>
        </div>

        {/* Selected driver pills (desktop) */}
        <div className="hidden sm:flex items-center gap-1.5">
          {state.selectedDrivers.map(num => {
            const drv = state.drivers.find(d => d.driver_number.toString() === num);
            const color = drv ? `#${drv.team_colour}` : '#38bdf8';
            return (
              <span key={num} className="px-2 py-0.5 rounded-full text-xs font-racing font-bold border"
                style={{ borderColor: `${color}60`, color, backgroundColor: `${color}15` }}>
                {drv?.name_acronym ?? `#${num}`}
              </span>
            );
          })}
          {state.isLoading && (
            <span className="text-xs text-slate-500 flex items-center gap-1">
              <span className="w-3 h-3 border border-slate-500 border-t-transparent rounded-full animate-spin" />
            </span>
          )}
        </div>
      </header>

      {/* ── DESKTOP Layout (lg+) ── */}
      <div className="hidden lg:flex flex-1 min-h-0 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-56 flex-shrink-0 border-r border-white/10 p-4 overflow-y-auto bg-slate-950/50">
          {sidebarContent}
        </aside>

        {/* Main */}
        <main className="flex-1 min-w-0 p-5 overflow-y-auto">
          {analysisContent}
        </main>

        {/* Right Panel — AI + Notebook */}
        <div className="w-80 flex-shrink-0 border-l border-white/10 flex flex-col bg-slate-950/30">
          {/* Tab bar */}
          <div className="flex border-b border-white/10 flex-shrink-0">
            {([['ai', '🤖 AI分析'], ['notebook', '📓 ノート']] as [RightPanelTab, string][]).map(([tab, label]) => (
              <button
                key={tab}
                onClick={() => setRightPanelTab(tab)}
                className={`flex-1 py-2.5 text-xs font-medium transition-colors ${
                  rightPanelTab === tab
                    ? 'text-white border-b-2 border-f1-red'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          {/* Panel content — flex-col so child h-full works */}
          <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
            {rightPanelTab === 'ai' ? aiContent : notebookContent}
          </div>
        </div>
      </div>

      {/* ── MOBILE / TABLET Layout (<lg) ── */}
      <div className="lg:hidden flex flex-1 flex-col min-h-0">
        {/* Mobile sidebar drawer overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-40 flex">
            <div
              className="absolute inset-0 bg-black/60"
              onClick={() => setSidebarOpen(false)}
            />
            <aside className="relative z-50 w-72 bg-slate-900 border-r border-white/10 p-4 overflow-y-auto h-full">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-racing text-white tracking-widest">SETTINGS</span>
                <button onClick={() => setSidebarOpen(false)} className="text-slate-400 text-lg">✕</button>
              </div>
              {sidebarContent}
            </aside>
          </div>
        )}

        {/* Tab content */}
        <div className="flex-1 min-h-0 overflow-y-auto p-4">
          {mobileTab === 'analysis' && analysisContent}
          {mobileTab === 'ai' && aiContent}
          {mobileTab === 'notebook' && notebookContent}
        </div>

        {/* Bottom tab bar */}
        <nav className="flex-shrink-0 flex border-t border-white/10 bg-slate-950/90 backdrop-blur-sm safe-bottom">
          {([
            ['analysis', '📈', '分析'],
            ['ai',       '🤖', 'AI'],
            ['notebook', '📓', 'ノート'],
          ] as [MobileTab, string, string][]).map(([tab, icon, label]) => (
            <button
              key={tab}
              onClick={() => setMobileTab(tab)}
              className={`flex-1 flex flex-col items-center py-2.5 gap-0.5 text-xs transition-colors ${
                mobileTab === tab ? 'text-white' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <span className="text-base">{icon}</span>
              <span className="text-xs">{label}</span>
              {mobileTab === tab && (
                <span className="w-6 h-0.5 bg-f1-red rounded-full mt-0.5" />
              )}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-xs font-racing font-bold text-white tracking-widest border-l-2 border-f1-red pl-2 mb-3 uppercase">
      {children}
    </h3>
  );
}

function ChartSkeleton() {
  return (
    <div className="glass-card h-72 flex items-center justify-center text-slate-500 text-sm animate-pulse">
      グラフを読み込み中...
    </div>
  );
}
