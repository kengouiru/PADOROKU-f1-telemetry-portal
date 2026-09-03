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
import DetailedTelemetryChart from '@/components/telemetry/DetailedTelemetryChart';
import SectorAnalysis from '@/components/SectorAnalysis';
import PitStrategySimulator from '@/components/PitStrategySimulator';

import NewsPaddockHub from '@/components/hubs/NewsPaddockHub';
import KnowledgeHistoryHub from '@/components/hubs/KnowledgeHistoryHub';
import RaceNotesReportHub from '@/components/hubs/RaceNotesReportHub';
import type { TelemetryTarget } from '@/data/f1KnowledgeData';

// ── App State ─────────────────────────────────────────────────────────────────

export type ActiveHub = 'telemetry' | 'news' | 'knowledge' | 'notes';

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
type MobileTab = 'telemetry' | 'news' | 'knowledge' | 'notes' | 'ai';
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
  const [activeHub, setActiveHub] = useState<ActiveHub>('telemetry');
  const [mobileTab, setMobileTab] = useState<MobileTab>('telemetry');
  const [rightPanelTab, setRightPanelTab] = useState<RightPanelTab>('ai');
  const [sidebarOpen, setSidebarOpen] = useState(false); // mobile sidebar drawer
  const [aiDrawerOpen, setAiDrawerOpen] = useState(false); // AI & Notebook slide drawer
  const [detailedTelemetryParams, setDetailedTelemetryParams] = useState<{
    circuitId: string;
    driver1: string;
    driver2: string;
  }>({
    circuitId: 'bahrain-international',
    driver1: 'VER',
    driver2: 'NOR',
  });

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
    // On mobile, switch to telemetry tab when lap is clicked
    if (mobileTab !== 'telemetry') setMobileTab('telemetry');
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
    if (mobileTab === 'ai') setMobileTab('notes');
  }, [mobileTab]);

  // Deep Telemetry Navigation handler from Knowledge Hub
  const handleNavigateToTelemetry = useCallback((target?: TelemetryTarget) => {
    setActiveHub('telemetry');
    setMobileTab('telemetry');

    if (!target) {
      setTimeout(() => {
        document.getElementById('detailed-telemetry-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 150);
      return;
    }

    const DRIVER_NUM_TO_CODE: Record<string, string> = {
      '1': 'VER',
      '44': 'HAM',
      '4': 'NOR',
      '16': 'LEC',
      '81': 'PIA',
      '55': 'SAI',
      '63': 'RUS',
      '11': 'PER',
      '14': 'ALO',
      '22': 'TSU',
    };

    const targetCode = target.targetDriver ? (DRIVER_NUM_TO_CODE[target.targetDriver] ?? 'VER') : 'VER';
    const otherCode = targetCode === 'VER' ? 'NOR' : 'VER';

    let circId = 'bahrain-international';
    if (target.meetingName?.includes('Japan') || target.meetingName?.includes('Suzuka')) circId = 'suzuka';
    else if (target.meetingName?.includes('Belgium') || target.meetingName?.includes('Spa')) circId = 'spa-francorchamps';
    else if (target.meetingName?.includes('Italy') || target.meetingName?.includes('Monza')) circId = 'monza';
    else if (target.meetingName?.includes('Britain') || target.meetingName?.includes('Silverstone')) circId = 'silverstone';
    else if (target.meetingName?.includes('Monaco')) circId = 'monaco';

    setDetailedTelemetryParams({
      circuitId: circId,
      driver1: targetCode,
      driver2: otherCode,
    });

    // Auto-select driver if specified and not selected
    if (target.targetDriver && !state.selectedDrivers.includes(target.targetDriver)) {
      setState(prev => ({
        ...prev,
        selectedDrivers: [...prev.selectedDrivers, target.targetDriver!],
      }));
    }

    // Scroll & focus to detailed telemetry section
    setTimeout(() => {
      document.getElementById('detailed-telemetry-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 200);

    // Scroll & focus timeline / chart to target lap
    if (target.targetLap) {
      const drv = target.targetDriver ?? state.selectedDrivers[0] ?? '1';
      setTimeout(() => {
        timelineRef.current?.scrollToLap(drv, target.targetLap!);
      }, 350);
    }
  }, [state.selectedDrivers]);


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

      {/* 3-Tier Synchronized Detailed Telemetry (Car Data Comparison) */}
      <section id="detailed-telemetry-section">
        <DetailedTelemetryChart
          initialCircuitId={detailedTelemetryParams.circuitId}
          initialDriver1Code={detailedTelemetryParams.driver1}
          initialDriver2Code={detailedTelemetryParams.driver2}
        />
      </section>

      {state.selectedDrivers.length > 0 && (
        <SectorAnalysis
          selectedDrivers={state.selectedDrivers}
          drivers={state.drivers}
          lapsCache={state.lapsCache}
        />
      )}

      {state.selectedDrivers.length > 0 && (
        <PitStrategySimulator
          selectedDrivers={state.selectedDrivers}
          drivers={state.drivers}
          lapsCache={state.lapsCache}
          stints={state.stints}
          geminiApiKey={state.geminiApiKey}
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
      <header className="flex-shrink-0 sticky top-0 z-30 border-b border-white/10 px-4 py-2.5 flex items-center justify-between gap-3 bg-slate-950/90 backdrop-blur-md">
        {/* Left: Logo + Session badge */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {/* Mobile menu toggle */}
          <button
            className="lg:hidden text-slate-400 hover:text-white text-lg"
            onClick={() => setSidebarOpen((v) => !v)}
            aria-label="Toggle sidebar"
          >
            ☰
          </button>

          {/* Logo */}
          <div className="w-7 h-7 bg-f1-red rounded flex items-center justify-center flex-shrink-0 shadow-md">
            <span className="font-racing text-white text-xs font-black">F1</span>
          </div>
          <div>
            <h1 className="font-racing text-sm font-bold text-white tracking-widest leading-tight hidden sm:block">
              F1 TELEMETRY ANALYZER
            </h1>
            <p className="text-slate-500 text-[11px] hidden md:block">
              {state.isDemoMode ? 'DEMO — 2024 Bahrain GP' : 'LIVE — OpenF1 API'}
            </p>
          </div>
        </div>

        {/* Center: Global Multi-Hub Navigation Pills (Desktop & Tablet) */}
        <nav className="hidden md:flex items-center bg-slate-900/90 rounded-2xl p-1 border border-white/10 shadow-inner">
          {(
            [
              ['telemetry', '🏎️ Telemetry & Live'],
              ['news', '📰 News & Paddock'],
              ['knowledge', '📚 Knowledge & History'],
              ['notes', '📝 Race Notes & Report'],
            ] as [ActiveHub, string][]
          ).map(([hub, label]) => (
            <button
              key={hub}
              onClick={() => setActiveHub(hub)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-racing font-bold transition-all ${
                activeHub === hub
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              {label}
            </button>
          ))}
        </nav>

        {/* Right: Driver Pills + AI Strategist Toggle */}
        <div className="flex items-center gap-2">
          {/* Selected driver pills (desktop) */}
          {activeHub === 'telemetry' && (
            <div className="hidden xl:flex items-center gap-1.5 mr-1">
              {state.selectedDrivers.map((num) => {
                const drv = state.drivers.find((d) => d.driver_number.toString() === num);
                const color = drv ? `#${drv.team_colour}` : '#38bdf8';
                return (
                  <span
                    key={num}
                    className="px-2 py-0.5 rounded-full text-xs font-racing font-bold border"
                    style={{ borderColor: `${color}60`, color, backgroundColor: `${color}15` }}
                  >
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
          )}

          {/* AI Strategist Toggle Button (Header) */}
          <button
            onClick={() => setAiDrawerOpen((v) => !v)}
            className={`px-3 py-1.5 rounded-xl text-xs font-racing font-bold flex items-center gap-1.5 transition-all shadow-md ${
              aiDrawerOpen
                ? 'bg-blue-600 text-white border border-blue-400 shadow-[0_0_12px_rgba(37,99,235,0.4)]'
                : 'bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-white/10 hover:border-white/25'
            }`}
          >
            <span>🤖</span>
            <span className="hidden sm:inline">AI STRATEGIST</span>
            {aiDrawerOpen && <span className="text-[10px] ml-0.5">✕</span>}
          </button>
        </div>
      </header>

      {/* ── DESKTOP Layout (lg+) ── */}
      <div className="hidden lg:flex flex-1 min-h-0 overflow-hidden relative">
        {/* Left Sidebar (Only visible in Telemetry Hub) */}
        {activeHub === 'telemetry' && (
          <aside className="w-56 flex-shrink-0 border-r border-white/10 p-4 overflow-y-auto bg-slate-950/50">
            {sidebarContent}
          </aside>
        )}

        {/* Main Hub Area */}
        <main className="flex-1 min-w-0 p-5 overflow-y-auto">
          {activeHub === 'telemetry' && analysisContent}
          {activeHub === 'news' && <NewsPaddockHub geminiApiKey={state.geminiApiKey} />}
          {activeHub === 'knowledge' && (
            <KnowledgeHistoryHub onNavigateToTelemetry={handleNavigateToTelemetry} />
          )}
          {activeHub === 'notes' && (
            <RaceNotesReportHub
              selectedDrivers={state.selectedDrivers}
              drivers={state.drivers}
              lapsCache={state.lapsCache}
              stints={state.stints}
              pitStopsCache={state.pitStopsCache}
              safetyCarPeriods={state.safetyCarPeriods}
              sessionName={state.currentSession?.session_name ?? '2024 Bahrain GP Race'}
              geminiApiKey={state.geminiApiKey}
            />
          )}
        </main>
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
          {mobileTab === 'telemetry' && analysisContent}
          {mobileTab === 'news' && <NewsPaddockHub geminiApiKey={state.geminiApiKey} />}
          {mobileTab === 'knowledge' && (
            <KnowledgeHistoryHub onNavigateToTelemetry={handleNavigateToTelemetry} />
          )}
          {mobileTab === 'notes' && (
            <RaceNotesReportHub
              selectedDrivers={state.selectedDrivers}
              drivers={state.drivers}
              lapsCache={state.lapsCache}
              stints={state.stints}
              pitStopsCache={state.pitStopsCache}
              safetyCarPeriods={state.safetyCarPeriods}
              sessionName={state.currentSession?.session_name ?? '2024 Bahrain GP Race'}
              geminiApiKey={state.geminiApiKey}
            />
          )}
          {mobileTab === 'ai' && aiContent}
        </div>

        {/* Bottom tab bar */}
        <nav className="flex-shrink-0 flex border-t border-white/10 bg-slate-950/90 backdrop-blur-sm safe-bottom">
          {(
            [
              ['telemetry', '🏎️', '分析'],
              ['news',      '📰', 'ニュース'],
              ['knowledge', '📚', 'ナレッジ'],
              ['notes',     '📝', 'ノート'],
              ['ai',        '🤖', 'AI'],
            ] as [MobileTab, string, string][]
          ).map(([tab, icon, label]) => (
            <button
              key={tab}
              onClick={() => {
                setMobileTab(tab);
                if (tab !== 'ai') setActiveHub(tab as ActiveHub);
              }}
              className={`flex-1 flex flex-col items-center py-2.5 gap-0.5 text-xs transition-colors ${
                mobileTab === tab ? 'text-white font-bold' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <span className="text-base">{icon}</span>
              <span className="text-[10px]">{label}</span>
              {mobileTab === tab && (
                <span className="w-6 h-0.5 bg-f1-red rounded-full mt-0.5" />
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* ── Slide-over AI Strategist & Notebook Drawer (Desktop & Tablet) ── */}
      {aiDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end animate-fade-in">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={() => setAiDrawerOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="relative z-10 w-full sm:w-[420px] md:w-[460px] h-full bg-slate-900/95 border-l border-white/15 shadow-2xl flex flex-col overflow-hidden animate-slide-left">
            {/* Drawer Header & Tabs */}
            <div className="flex items-center justify-between px-4 pt-4 pb-2 border-b border-white/10 bg-slate-950/60">
              {/* Tab switcher */}
              <div className="flex bg-slate-800/80 rounded-xl p-1 border border-white/10">
                {([['ai', '🤖 AI分析'], ['notebook', '📓 レースノート']] as [RightPanelTab, string][]).map(([tab, label]) => (
                  <button
                    key={tab}
                    onClick={() => setRightPanelTab(tab)}
                    className={`px-3 py-1 text-xs font-medium rounded-lg transition-all ${
                      rightPanelTab === tab
                        ? 'bg-blue-600 text-white font-bold shadow-md'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {/* Close Button */}
              <button
                onClick={() => setAiDrawerOpen(false)}
                className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center text-xs transition-colors"
                title="閉じる"
              >
                ✕
              </button>
            </div>

            {/* Drawer Content */}
            <div className="flex-1 min-h-0 flex flex-col overflow-hidden p-3 bg-slate-900/50">
              {rightPanelTab === 'ai' ? aiContent : notebookContent}
            </div>
          </div>
        </div>
      )}

      {/* ── Floating Action Button (FAB) (Visible when drawer is closed) ── */}
      {!aiDrawerOpen && (
        <button
          onClick={() => setAiDrawerOpen(true)}
          className="fixed bottom-6 right-6 z-40 hidden lg:flex items-center gap-2 px-4 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-racing font-bold text-xs shadow-2xl border border-white/20 transition-all hover:scale-105 active:scale-95 group"
          title="AIストラテジストを開く"
        >
          <span className="text-base group-hover:animate-bounce">🤖</span>
          <span>AI STRATEGIST</span>
        </button>
      )}
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
