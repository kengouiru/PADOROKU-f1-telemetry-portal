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
import StintVisualizer from '@/components/telemetry/StintVisualizer';
import PositionChangeChart from '@/components/telemetry/PositionChangeChart';
import SectorAnalysis from '@/components/SectorAnalysis';
import PitStrategySimulator from '@/components/PitStrategySimulator';

import NewsPaddockHub from '@/components/hubs/NewsPaddockHub';
import KnowledgeHistoryHub, { type SubTab } from '@/components/hubs/KnowledgeHistoryHub';
import RaceNotesReportHub from '@/components/hubs/RaceNotesReportHub';
import SeasonHub from '@/components/hubs/SeasonHub';
import QuickGlossaryModal from '@/components/glossary/QuickGlossaryModal';
import GlobalSearchModal from '@/components/search/GlobalSearchModal';
import F1QuizModal from '@/components/quiz/F1QuizModal';
import type { TelemetryTarget } from '@/data/f1KnowledgeData';

import AuthButton from '@/components/auth/AuthButton';
import AuthModal from '@/components/auth/AuthModal';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';

// ── App State ─────────────────────────────────────────────────────────────────

export type AppMode = 'season' | 'library';
export type ActiveHub = 'season' | 'telemetry' | 'news' | 'knowledge' | 'notes';

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
    geminiApiKey: '',
    transcriptsCache: storedTranscripts,
    isLoading: false,
  };
}

// ── Main Component ─────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const [state, setState] = useState<AppState>(buildInitialState);
  const [appMode, setAppMode] = useState<AppMode>('season');
  const [activeHub, setActiveHub] = useState<ActiveHub>('season');
  const [librarySubTab, setLibrarySubTab] = useState<SubTab>('drivers');
  const [quickGlossaryOpen, setQuickGlossaryOpen] = useState(false);
  const [globalSearchOpen, setGlobalSearchOpen] = useState(false);
  const [targetDramaTab, setTargetDramaTab] = useState<'storylines' | 'moments' | 'rivalries' | 'paddock' | 'radios' | undefined>(undefined);
  const [quizModalOpen, setQuizModalOpen] = useState(false);
  const [mobileTab, setMobileTab] = useState<MobileTab>('telemetry');
  const [rightPanelTab, setRightPanelTab] = useState<RightPanelTab>('ai');
  const [sidebarOpen, setSidebarOpen] = useState(false); // mobile sidebar drawer
  const [aiDrawerOpen, setAiDrawerOpen] = useState(false); // AI & Notebook slide drawer
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalConfig, setAuthModalConfig] = useState<{ title?: string; description?: string }>({});
  const [detailedTelemetryParams, setDetailedTelemetryParams] = useState<{
    circuitId: string;
    driver1: string;
    driver2: string;
  }>({
    circuitId: 'bahrain-international',
    driver1: 'VER',
    driver2: 'NOR',
  });
  const [targetCircuitId, setTargetCircuitId] = useState<string | undefined>(undefined);

  const timelineRef = useRef<TeamRadioTimelineHandle>(null);
  const notebookRef = useRef<RaceNotebookHandle>(null);
  const desktopScrollRef = useRef<HTMLElement>(null);
  const mobileScrollRef = useRef<HTMLDivElement>(null);

  // Global Ctrl+K / Cmd+K shortcut listener for Global Search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setGlobalSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleRequireAuth = useCallback((title?: string, description?: string) => {
    setAuthModalConfig({
      title: title ?? 'F1 Intelligence メンバー認証',
      description: description ?? 'AI戦略アナリストおよびチーム無線AI解析は認証メンバー専用機能です。',
    });
    setAuthModalOpen(true);
  }, []);

  // Clean up any legacy localStorage Gemini key (now handled server-side)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('gemini_api_key');
    }
  }, []);

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
      } catch {
        // Fallback safely to mock sessions without logging unhandled exceptions
        if (!cancelled) {
          setState(prev => ({ ...prev, isDemoMode: true }));
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
      '10': 'GAS',
      '31': 'OCO',
      '23': 'ALB',
      '43': 'COL',
      '18': 'STR',
      '27': 'HUL',
      '20': 'MAG',
      '77': 'BOT',
      '24': 'ZHO',
      '3': 'RIC',
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

      {/* ── Lap-by-Lap Position Change Chart ── */}
      <PositionChangeChart
        drivers={state.drivers}
        stints={state.stints}
        safetyCarPeriods={state.safetyCarPeriods}
        totalLaps={57}
        selectedDrivers={state.selectedDrivers}
        onDriverSelect={(driverNum) =>
          handleDriverToggle(driverNum, !state.selectedDrivers.includes(driverNum))
        }
      />

      {/* 3-Tier Synchronized Detailed Telemetry (Car Data Comparison) */}
      <section id="detailed-telemetry-section">
        <DetailedTelemetryChart
          initialCircuitId={detailedTelemetryParams.circuitId}
          initialDriver1Code={detailedTelemetryParams.driver1}
          initialDriver2Code={detailedTelemetryParams.driver2}
        />
      </section>

      {/* ── Full-Grid Tyre Stints & Strategy Timeline (Stint Visualizer) ── */}
      <StintVisualizer
        drivers={state.drivers}
        stints={state.stints}
        pitStopsCache={state.pitStopsCache}
        totalLaps={57}
        isLive={!state.isDemoMode}
        isLoading={state.isLoading}
        selectedDrivers={state.selectedDrivers}
        onDriverSelect={(driverNum) =>
          handleDriverToggle(driverNum, !state.selectedDrivers.includes(driverNum))
        }
        onRefresh={() => {
          if (state.selectedSessionKey) {
            handleSessionChange(state.selectedSessionKey);
          }
        }}
      />

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
          onRequireAuth={() => handleRequireAuth('チーム無線 AI解析', 'チーム無線のリアルタイム文字起こしおよびAI戦術要約は認証メンバー専用機能です。')}
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
        onRequireAuth={() => handleRequireAuth('AI 戦略アナリスト', 'AI戦略アナリストによるレース分析・戦略提案は認証メンバー専用機能です。')}
      />
    </div>
  );

  const notebookContent = (
    <div className="flex-1 min-h-0 flex flex-col lg:h-full min-h-[480px] p-3">
      <RaceNotebook ref={notebookRef} sessionTag={sessionTag} />
    </div>
  );

  const mainHubContent = (
    <>
      {activeHub === 'season' && (
        <ErrorBoundary sectionName="2025 シーズン">
          <SeasonHub
            onNavigateToTelemetry={() => {
              setActiveHub('telemetry');
            }}
            onNavigateToTyres={() => {
              setAppMode('library');
              setLibrarySubTab('tyres');
              setActiveHub('knowledge');
            }}
            onNavigateToDrama={() => {
              setAppMode('library');
              setLibrarySubTab('drama');
              setActiveHub('knowledge');
            }}
            onNavigateToGlossary={() => setQuickGlossaryOpen(true)}
            onNavigateToCircuit={(circuitId) => {
              setTargetCircuitId(circuitId);
              setAppMode('library');
              setLibrarySubTab('circuits');
              setActiveHub('knowledge');
            }}
          />
        </ErrorBoundary>
      )}
      {activeHub === 'telemetry' && <ErrorBoundary sectionName="テレメトリー分析">{analysisContent}</ErrorBoundary>}
      {activeHub === 'news' && <ErrorBoundary sectionName="ニュースパドック"><NewsPaddockHub geminiApiKey={state.geminiApiKey} /></ErrorBoundary>}
      {activeHub === 'knowledge' && (
        <ErrorBoundary sectionName="ナレッジ＆ヒストリー">
          <KnowledgeHistoryHub
            activeSubTab={librarySubTab}
            onSubTabChange={setLibrarySubTab}
            targetCircuitId={targetCircuitId}
            initialDramaTab={targetDramaTab}
            onNavigateToTelemetry={(target) => {
              setAppMode('season');
              setActiveHub('telemetry');
              handleNavigateToTelemetry(target);
            }}
          />
        </ErrorBoundary>
      )}
      {activeHub === 'notes' && (
        <ErrorBoundary sectionName="レースノート">
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
        </ErrorBoundary>
      )}
    </>
  );

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="h-screen h-[100dvh] flex flex-col bg-f1-gradient overflow-hidden">

      {/* ── Header (sticky flex flex-col) ── */}
      <header className="flex-shrink-0 sticky top-0 z-30 border-b border-white/10 bg-slate-950/95 backdrop-blur-md shadow-xl flex flex-col">
        {/* Top Global Row */}
        <div className="px-4 py-2.5 flex items-center justify-between gap-3">
        {/* Left: Logo + Title + Mobile Mode Switcher */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {/* Mobile menu toggle */}
          <button
            className="lg:hidden text-slate-400 hover:text-white text-lg"
            onClick={() => setSidebarOpen((v) => !v)}
            aria-label="Toggle sidebar"
          >
            ☰
          </button>

          {/* Logo & Brand Title */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gradient-to-br from-red-600 via-red-500 to-rose-700 rounded flex items-center justify-center flex-shrink-0 shadow-md shadow-red-950/40 border border-red-400/30">
              <span className="font-racing text-white text-xs font-black tracking-tight">P1</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-racing text-sm sm:text-base font-bold text-white tracking-widest leading-tight">
                  PADOROKU
                </h1>
                <span className="hidden xl:inline-block px-1.5 py-0.5 rounded bg-red-950/70 border border-red-500/30 text-[9px] font-mono text-red-300 font-semibold">
                  F1 PORTAL
                </span>
              </div>
              <p className="text-slate-400 text-[10px] font-mono tracking-wider hidden md:block">
                ADVANCED MOTORSPORT INTELLIGENCE
              </p>
            </div>
          </div>

          {/* Mobile Mode Switcher (< md) */}
          <div className="md:hidden flex items-center bg-slate-900 p-0.5 rounded-xl border border-white/10 ml-1">
            <button
              onClick={() => {
                setAppMode('season');
                if (activeHub === 'knowledge') setActiveHub('season');
              }}
              className={`px-2 py-1 rounded-lg text-[10px] font-racing font-bold transition-all ${
                appMode === 'season' ? 'bg-red-600 text-white' : 'text-slate-400'
              }`}
            >
              🏁 観戦
            </button>
            <button
              onClick={() => {
                setAppMode('library');
                setActiveHub('knowledge');
              }}
              className={`px-2 py-1 rounded-lg text-[10px] font-racing font-bold transition-all ${
                appMode === 'library' ? 'bg-blue-600 text-white' : 'text-slate-400'
              }`}
            >
              📚 百科
            </button>
          </div>
        </div>

        {/* Center: Dual-Mode Switcher & Context Navigation (Desktop & Tablet) */}
        <div className="hidden md:flex items-center gap-2">
          {/* Top-Level Mode Switcher */}
          <div className="flex items-center bg-slate-950 p-1 rounded-2xl border border-white/15 shadow-inner">
            <button
              onClick={() => {
                setAppMode('season');
                if (activeHub === 'knowledge') setActiveHub('season');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-racing font-bold transition-all flex items-center gap-1.5 ${
                appMode === 'season'
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>🏁</span>
              <span className="hidden lg:inline">観戦・シーズン</span>
              <span className="lg:hidden">観戦</span>
            </button>
            <button
              onClick={() => {
                setAppMode('library');
                setActiveHub('knowledge');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-racing font-bold transition-all flex items-center gap-1.5 ${
                appMode === 'library'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>📚</span>
              <span className="hidden lg:inline">F1大百科</span>
              <span className="lg:hidden">大百科</span>
            </button>
          </div>

          {/* Context Hub Pills (Shown in Season Mode) */}
          {appMode === 'season' && (
            <nav className="flex items-center bg-slate-900/90 rounded-2xl p-1 border border-white/10 shadow-inner">
              {(
                [
                  ['season', '🏁 2025 シーズン'],
                  ['telemetry', '🏎️ テレメトリー＆Live'],
                  ['news', '📰 ニュース＆パドック'],
                  ['notes', '📝 レースノート＆AI'],
                ] as [ActiveHub, string][]
              ).map(([hub, label]) => (
                <button
                  key={hub}
                  onClick={() => setActiveHub(hub)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-racing font-bold transition-all ${
                    activeHub === hub
                      ? 'bg-red-600 text-white shadow-md shadow-red-500/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  {label}
                </button>
              ))}
            </nav>
          )}
        </div>

        {/* Right: Quick Glossary + Driver Pills + AI Strategist Toggle + Auth */}
        <div className="flex items-center gap-2">
          {/* Global Command Palette / Search Button (Ctrl+K) */}
          <button
            onClick={() => setGlobalSearchOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-racing font-bold bg-slate-800/90 hover:bg-slate-700 text-sky-300 hover:text-white border border-sky-500/30 hover:border-sky-400 shadow-sm transition-all flex-shrink-0 cursor-pointer"
            title="選手・チーム・コース・タイヤ・用語の横断検索 (Ctrl+K)"
          >
            <span>🔍</span>
            <span className="hidden sm:inline">総合検索</span>
            <kbd className="hidden lg:inline-flex items-center px-1.5 py-0.5 rounded bg-black/50 text-[9px] text-slate-400 font-mono border border-white/10 ml-0.5">
              Ctrl K
            </kbd>
          </button>

          {/* Quick Glossary Search Button (Global Action) */}
          <button
            onClick={() => setQuickGlossaryOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-racing font-bold bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-500/40 hover:border-emerald-400 shadow-sm transition-all flex-shrink-0 cursor-pointer"
            title="レース観戦中の用語クイック検索"
          >
            <span>📖</span>
            <span className="hidden sm:inline">用語</span>
          </button>

          {/* F1 Quiz & Trivia Button */}
          <button
            onClick={() => setQuizModalOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-racing font-bold bg-purple-950/40 hover:bg-purple-900/60 text-purple-300 border border-purple-500/40 hover:border-purple-400 shadow-sm transition-all flex-shrink-0 cursor-pointer"
            title="対話型F1クイズ＆トリビア検定"
          >
            <span>🏆</span>
            <span className="hidden sm:inline">クイズ</span>
          </button>

          {/* Selected driver pills (desktop, in telemetry hub) */}
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

          {/* AI Strategist Toggle Button (Header: Desktop & Tablet only) */}
          <button
            onClick={() => setAiDrawerOpen((v) => !v)}
            className={`hidden md:flex px-3 py-1.5 rounded-xl text-xs font-racing font-bold items-center gap-1.5 transition-all shadow-md flex-shrink-0 ${
              aiDrawerOpen
                ? 'bg-blue-600 text-white border border-blue-400 shadow-[0_0_12px_rgba(37,99,235,0.4)]'
                : 'bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-white/10 hover:border-white/25'
            }`}
          >
            <span>🤖</span>
            <span>AI STRATEGIST</span>
            {aiDrawerOpen && <span className="text-[10px] ml-0.5">✕</span>}
          </button>

          {/* Auth Button (Login / User Profile Dropdown) */}
          <AuthButton onOpenAuthModal={() => handleRequireAuth()} />
        </div>
      </div>

      {/* ── Level 2: Persistent Library Sub-Header (Integrated inside Header, permanently fixed!) ── */}
        {appMode === 'library' && (
          <div className="border-t border-white/10 bg-slate-900/95 px-4 py-2 shadow-inner">
            <div className="max-w-6xl mx-auto flex items-center justify-between gap-2">
              {/* Desktop: All 6 Categories in 1 clean row */}
              <div className="hidden lg:flex items-center justify-between gap-1.5 w-full bg-slate-900/90 p-1.5 rounded-2xl border border-white/10 shadow-inner">
                {(
                  [
                    ['drivers', '👤', '選手名鑑'],
                    ['teams', '🏎️', 'チーム名鑑'],
                    ['circuits', '🏁', 'コース解説'],
                    ['tyres', '🛞', 'タイヤ大百科'],
                    ['glossary', '🧠', 'F1用語辞典'],
                    ['drama', '🎬', 'ドラマ・歴史'],
                  ] as [SubTab, string, string][]
                ).map(([tab, icon, label]) => {
                  const isActive = librarySubTab === tab;
                  return (
                    <button
                      key={tab}
                      onClick={() => {
                        setLibrarySubTab(tab);
                        desktopScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
                        mobileScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-racing font-bold transition-all flex items-center justify-center gap-1.5 flex-1 whitespace-nowrap ${
                        isActive
                          ? tab === 'drama'
                            ? 'bg-rose-600 text-white shadow-md shadow-rose-500/30 ring-1 ring-rose-400/40'
                            : tab === 'glossary'
                            ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/30 ring-1 ring-emerald-400/40'
                            : tab === 'tyres'
                            ? 'bg-amber-600 text-white shadow-md shadow-amber-500/30 ring-1 ring-amber-400/40'
                            : 'bg-blue-600 text-white shadow-md shadow-blue-500/30 ring-1 ring-blue-400/40'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                      }`}
                    >
                      <span className="text-sm">{icon}</span>
                      <span>{label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Mobile / Tablet Horizontal Scrollable Pills */}
              <div className="lg:hidden flex items-center gap-1.5 overflow-x-auto w-full py-0.5 no-scrollbar">
                {(
                  [
                    ['drivers', '👤', '選手名鑑'],
                    ['teams', '🏎️', 'チーム名鑑'],
                    ['circuits', '🏁', 'コース解説'],
                    ['tyres', '🛞', 'タイヤ大百科'],
                    ['glossary', '🧠', '用語辞典'],
                    ['drama', '🎬', 'ドラマ・歴史'],
                  ] as [SubTab, string, string][]
                ).map(([tab, icon, label]) => {
                  const isActive = librarySubTab === tab;
                  return (
                    <button
                      key={tab}
                      onClick={() => {
                        setLibrarySubTab(tab);
                        desktopScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
                        mobileScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-racing font-bold transition-all flex items-center gap-1 shrink-0 whitespace-nowrap ${
                        isActive
                          ? tab === 'drama'
                            ? 'bg-rose-600 text-white shadow-md'
                            : tab === 'glossary'
                            ? 'bg-emerald-600 text-white shadow-md'
                            : tab === 'tyres'
                            ? 'bg-amber-600 text-white shadow-md'
                            : 'bg-blue-600 text-white shadow-md'
                          : 'text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-white/5'
                      }`}
                    >
                      <span>{icon}</span>
                      <span>{label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
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
        <main ref={desktopScrollRef} className="flex-1 min-w-0 p-5 overflow-y-auto">
          {mainHubContent}
        </main>
      </div>

      {/* ── MOBILE / TABLET Layout (<lg) ── */}
      <div className="lg:hidden flex flex-1 flex-col min-h-0">
        {/* Mobile sidebar drawer overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-40 flex">
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-xs"
              onClick={() => setSidebarOpen(false)}
            />
            <aside className="relative z-50 w-72 bg-slate-900 border-r border-white/10 p-4 overflow-y-auto h-full">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-racing text-white tracking-widest">RACE SETTINGS</span>
                <button onClick={() => setSidebarOpen(false)} className="text-slate-400 text-lg">✕</button>
              </div>
              {sidebarContent}
            </aside>
          </div>
        )}

        {/* Tab content (with bottom padding pb-20 so fixed navigation doesn't hide content) */}
        <div ref={mobileScrollRef} className="flex-1 min-h-0 overflow-y-auto p-4 pb-20 md:pb-6">
          {mainHubContent}
        </div>

        {/* ── Fixed Mobile Bottom Navigation Bar (< md) ── */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-black/90 backdrop-blur-md border-t border-white/10 flex items-center justify-around safe-bottom shadow-[0_-4px_20px_rgba(0,0,0,0.5)]">
          {appMode === 'season' ? (
            (
              [
                ['season',    '🏁', 'シーズン'],
                ['telemetry', '🏎️', '分析'],
                ['news',      '📰', 'ニュース'],
                ['notes',     '📝', 'ノート'],
                ['ai',        '🤖', 'AI'],
              ] as [string, string, string][]
            ).map(([tab, icon, label]) => {
              const isAiTab = tab === 'ai';
              const isActive = isAiTab ? aiDrawerOpen : activeHub === tab && !aiDrawerOpen;

              return (
                <button
                  key={tab}
                  onClick={() => {
                    if (isAiTab) {
                      setAiDrawerOpen((prev) => !prev);
                    } else {
                      setActiveHub(tab as ActiveHub);
                      setMobileTab(tab as MobileTab);
                      if (aiDrawerOpen) setAiDrawerOpen(false);
                    }
                  }}
                  className={`flex-1 flex flex-col items-center py-2.5 px-1 gap-0.5 text-xs transition-all relative ${
                    isActive
                      ? 'text-red-400 font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span className={`text-base transition-transform ${isActive ? 'scale-110' : ''}`}>{icon}</span>
                  <span className="text-[10px] tracking-tight">{label}</span>
                  {isActive && (
                    <span className="absolute bottom-1 w-6 h-0.5 bg-red-500 rounded-full shadow-[0_0_8px_#ef4444]" />
                  )}
                </button>
              );
            })
          ) : (
            (
              [
                ['drivers',  '👤', '選手'],
                ['teams',    '🏎️', 'チーム'],
                ['circuits', '🏁', 'コース'],
                ['tyres',    '🛞', 'タイヤ'],
                ['glossary', '🧠', '用語'],
                ['drama',    '🎬', 'ドラマ'],
              ] as [SubTab, string, string][]
            ).map(([subTab, icon, label]) => {
              const isActive = activeHub === 'knowledge' && librarySubTab === subTab && !aiDrawerOpen;

              return (
                <button
                  key={subTab}
                  onClick={() => {
                    setActiveHub('knowledge');
                    setLibrarySubTab(subTab);
                    if (aiDrawerOpen) setAiDrawerOpen(false);
                  }}
                  className={`flex-1 flex flex-col items-center py-2.5 px-1 gap-0.5 text-xs transition-all relative ${
                    isActive
                      ? 'text-sky-400 font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span className={`text-base transition-transform ${isActive ? 'scale-110' : ''}`}>{icon}</span>
                  <span className="text-[10px] tracking-tight">{label}</span>
                  {isActive && (
                    <span className="absolute bottom-1 w-6 h-0.5 bg-sky-500 rounded-full shadow-[0_0_8px_#38bdf8]" />
                  )}
                </button>
              );
            })
          )}
        </nav>
      </div>

      {/* ── Slide-over AI Strategist & Notebook Drawer (Desktop, Tablet & Mobile) ── */}
      {aiDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end animate-fade-in">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setAiDrawerOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="relative z-10 w-[88vw] max-w-[440px] sm:w-[420px] md:w-[460px] h-full bg-slate-900/95 border-l border-white/15 shadow-2xl flex flex-col overflow-hidden animate-slide-left">
            {/* Drawer Header & Tabs */}
            <div className="flex items-center justify-between px-4 pt-4 pb-2 border-b border-white/10 bg-slate-950/60 flex-shrink-0">
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
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center text-sm font-bold transition-colors border border-white/10"
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

      {/* ── Auth Modal ── */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        title={authModalConfig.title}
        description={authModalConfig.description}
      />

      {/* ── Quick Glossary Modal (Fast lookup anywhere) ── */}
      <QuickGlossaryModal
        isOpen={quickGlossaryOpen}
        onClose={() => setQuickGlossaryOpen(false)}
      />

      {/* ── Global Search Command Palette (Ctrl+K) ── */}
      <GlobalSearchModal
        isOpen={globalSearchOpen}
        onClose={() => setGlobalSearchOpen(false)}
        onOpenQuiz={() => {
          setGlobalSearchOpen(false);
          setQuizModalOpen(true);
        }}
        onNavigate={(action) => {
          setAppMode(action.appMode);
          setActiveHub(action.hub);
          if (action.subTab) {
            setLibrarySubTab(action.subTab);
          }
          if (action.subTab === 'circuits' && action.targetId) {
            setTargetCircuitId(action.targetId);
          }
          if (action.subTab === 'drama' && action.dramaTab) {
            setTargetDramaTab(action.dramaTab);
          }
        }}
      />

      {/* ── Interactive F1 Quiz Modal (4-B) ── */}
      <F1QuizModal
        isOpen={quizModalOpen}
        onClose={() => setQuizModalOpen(false)}
      />
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
