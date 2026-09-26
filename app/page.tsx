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
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import dynamic from 'next/dynamic';

import type {
  Session, Driver, Lap, Stint, TeamRadio, PitStop,
  RaceControlMessage, SafetyCarPeriod,
} from '@/lib/types';
import {
  MOCK_SESSIONS, MOCK_DRIVERS, MOCK_STINTS,
  MOCK_TEAM_RADIO, MOCK_PIT_STOPS, MOCK_RACE_CONTROL,
  MOCK_LAPS, generateMockLaps,
  getCatalogSessionsForYear, getDriversForYear,
  generateCatalogStints, generateCatalogRaceControl,
} from '@/lib/mockData';
import { detectSafetyCarPeriods, enrichLapsWithStints } from '@/lib/telemetryUtils';
import { resolveCircuitForSession, type CircuitBenchmark } from '@/lib/circuitResolver';
import {
  fetchSessions, fetchDrivers, fetchStints, fetchRaceControl,
  fetchLaps, fetchTeamRadio, fetchPitStops,
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
const RaceSimulatorHub = dynamic(() => import('@/components/hubs/RaceSimulatorHub'), {
  ssr: false,
  loading: () => (
    <div className="flex h-96 w-full items-center justify-center bg-slate-950/80 rounded-2xl border border-white/10 text-slate-400">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-red-500 border-t-transparent" />
        <span className="font-mono text-xs text-slate-400">PITWALL コックピット起動中...</span>
      </div>
    </div>
  ),
});
import QuickGlossaryModal from '@/components/glossary/QuickGlossaryModal';
import GlobalSearchModal from '@/components/search/GlobalSearchModal';
import F1QuizModal from '@/components/quiz/F1QuizModal';
import FeatureDirectoryModal from '@/components/navigation/FeatureDirectoryModal';
import AppNavigationDrawer from '@/components/navigation/AppNavigationDrawer';
import type { TelemetryTarget } from '@/data/f1KnowledgeData';
import { GLOSSARY_TERMS } from '@/data/f1GlossaryData';
import type { NavAction } from '@/components/AIStrategist';
import AITelemetryInspectorModal from '@/components/telemetry/AITelemetryInspectorModal';
import { Flag, Activity, Newspaper, BookOpen, Gamepad2, Clock } from 'lucide-react';
import { useCurrentJstClock } from '@/lib/systemClock';

import AuthButton from '@/components/auth/AuthButton';
import AuthModal from '@/components/auth/AuthModal';
import PitwallProModal from '@/components/subscription/PitwallProModal';
import { usePlanTier } from '@/lib/tierService';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';

// ── App State ─────────────────────────────────────────────────────────────────

export type AppMode = 'season' | 'library';
export type ActiveHub = 'season' | 'telemetry' | 'simulator' | 'news' | 'knowledge' | 'notes';
export type TelemetrySubTab = 'pace' | 'car_data' | 'strategy' | 'radio' | 'laptable';

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
  transcriptsCache: Record<string, { transcript: string; translation: string; category: string }>;
  isLoading: boolean;
}

// Mobile tab type
type MobileTab = 'season' | 'telemetry' | 'simulator' | 'news' | 'knowledge' | 'notes' | 'ai';
// Desktop right-panel tab
type RightPanelTab = 'ai' | 'notebook';


const GLOBAL_DRIVER_NUM_TO_CODE: Record<string, string> = {
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
  '30': 'LAW',
  '12': 'ANT',
  '87': 'BEA',
  '5': 'BOR',
  '7': 'DOO',
  '6': 'HAD',
};
const DEFAULT_SESSION_KEY = 2026011;
const DEFAULT_MEETING_KEY = 202601;
const DEFAULT_YEAR = '2026';

function buildInitialState(): AppState {
  const currentSession = MOCK_SESSIONS.find(s => s.session_key === DEFAULT_SESSION_KEY) ?? null;
  const drivers = getDriversForYear(2026);
  const benchmark = resolveCircuitForSession(currentSession);
  const stints = generateCatalogStints(drivers, benchmark.totalLaps, benchmark.pit1Lap, benchmark.pit2Lap);
  const raceControlMessages = generateCatalogRaceControl(DEFAULT_SESSION_KEY);
  const selectedDrivers = ['1', '12']; // Max Verstappen (#1, Red Bull Ford) & Andrea Kimi Antonelli (#12, Mercedes)

  const lapsCache: Record<string, Lap[]> = {};
  for (const num of selectedDrivers) {
    const rawLaps = generateMockLaps(parseInt(num), DEFAULT_SESSION_KEY, benchmark);
    lapsCache[num] = enrichLapsWithStints(rawLaps, stints, num);
  }

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

  return {
    selectedYear: DEFAULT_YEAR,
    selectedMeetingKey: DEFAULT_MEETING_KEY,
    selectedSessionKey: DEFAULT_SESSION_KEY,
    sessions: MOCK_SESSIONS,
    currentSession,
    drivers,
    stints,
    selectedDrivers,
    lapsCache,
    teamRadioCache,
    pitStopsCache,
    raceControlMessages,
    safetyCarPeriods,
    isDemoMode: true,
    transcriptsCache: {},
    isLoading: false,
  };
}

// ── Main Component ─────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const [state, setState] = useState<AppState>(buildInitialState);
  const [appMode, setAppMode] = useState<AppMode>('season');
  const [activeHub, setActiveHub] = useState<ActiveHub>('season');
  const [telemetrySubTab, setTelemetrySubTab] = useState<TelemetrySubTab>('pace');
  const [librarySubTab, setLibrarySubTab] = useState<SubTab>('drivers');
  const [quickGlossaryOpen, setQuickGlossaryOpen] = useState(false);
  const [quickGlossaryQuery, setQuickGlossaryQuery] = useState('');
  const [globalSearchOpen, setGlobalSearchOpen] = useState(false);
  const [targetDramaTab, setTargetDramaTab] = useState<'storylines' | 'moments' | 'rivalries' | 'paddock' | 'radios' | undefined>(undefined);
  const [quizModalOpen, setQuizModalOpen] = useState(false);
  const [featureDirectoryOpen, setFeatureDirectoryOpen] = useState(false);
  const [navigationDrawerOpen, setNavigationDrawerOpen] = useState(false);
  const [detailedTelemetryTab, setDetailedTelemetryTab] = useState<'charts' | 'delta_matrix'>('charts');
  const [pitStrategyViewMode, setPitStrategyViewMode] = useState<'basic' | 'war_room' | 'virtual_gp'>('basic');
  const [proModalOpen, setProModalOpen] = useState(false);
  const { isPro } = usePlanTier();
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
    circuitId: 'albert-park',
    driver1: 'VER',
    driver2: 'ANT',
  });
  const [targetCircuitId, setTargetCircuitId] = useState<string | undefined>(undefined);
  const [targetDriverCode, setTargetDriverCode] = useState<string | undefined>(undefined);
  const [targetTeamId, setTargetTeamId] = useState<string | undefined>(undefined);
  const [targetGlossaryTermId, setTargetGlossaryTermId] = useState<string | null>(null);
  const [activeAiGuidance, setActiveAiGuidance] = useState<{
    title: string;
    content: string;
    sourceAction?: string;
  } | null>(null);
  const [aiInspectorState, setAiInspectorState] = useState<{
    isOpen: boolean;
    circuitId: string;
    driver1Code: string;
    driver2Code: string;
    lapNumber?: number;
    insightNotes?: string;
  }>({
    isOpen: false,
    circuitId: 'bahrain-international',
    driver1Code: 'VER',
    driver2Code: 'NOR',
  });

  // Live System JST Clock
  const jstClock = useCurrentJstClock();

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

  // Re-sync transcriptsCache from localStorage only on client after mount (SSR safe)
  useEffect(() => {
    try {
      const stored = localStorage.getItem('f1_transcripts_cache');
      if (stored) {
        setState((prev) => ({ ...prev, transcriptsCache: JSON.parse(stored) }));
      }
    } catch (_) {}
  }, []);

  const handleRequireAuth = useCallback((title?: string, description?: string) => {
    setAuthModalConfig({
      title: title ?? 'F1 Intelligence メンバー認証',
      description: description ?? 'AI戦略アナリストおよびチーム無線AI解析は認証メンバー専用機能です。',
    });
    setAuthModalOpen(true);
  }, []);

  const handleGoHome = useCallback(() => {
    setNavigationDrawerOpen(false);
    setFeatureDirectoryOpen(false);
    setSidebarOpen(false);
    setAiDrawerOpen(false);
    setQuizModalOpen(false);
    setGlobalSearchOpen(false);
    setQuickGlossaryOpen(false);
    setAuthModalOpen(false);
    setAppMode('season');
    setActiveHub('season');
    setMobileTab('season');
    desktopScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    mobileScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  const handleFeatureJump = useCallback((featureId: string) => {
    setFeatureDirectoryOpen(false);
    setNavigationDrawerOpen(false);
    if (featureId === '2026_regulations') {
      setAppMode('library');
      setLibrarySubTab('regulations');
      setActiveHub('knowledge');
      desktopScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
      mobileScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (featureId === 'season_calendar') {
      setAppMode('season');
      setActiveHub('season');
      desktopScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
      mobileScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (featureId === 'telemetry_delta') {
      setAppMode('season');
      setActiveHub('telemetry');
      setMobileTab('telemetry');
      setTelemetrySubTab('car_data');
      setDetailedTelemetryTab('delta_matrix');
      desktopScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
      mobileScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (featureId === 'war_room' || featureId === 'virtual_gp' || featureId === 'race_simulator') {
      setAppMode('season');
      setActiveHub('simulator');
      setMobileTab('simulator');
      desktopScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
      mobileScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (featureId === 'pitwall_pro') {
      setProModalOpen(true);
    } else if (featureId === 'fod_news') {
      setAppMode('season');
      setActiveHub('news');
      setMobileTab('news');
      desktopScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
      mobileScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (featureId === 'quiz') {
      setQuizModalOpen(true);
    } else if (featureId === 'telemetry_laps') {
      setAppMode('season');
      setActiveHub('telemetry');
      setMobileTab('telemetry');
      setTelemetrySubTab('pace');
      setDetailedTelemetryTab('charts');
      desktopScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
      mobileScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (featureId === 'stint_visualizer') {
      setAppMode('season');
      setActiveHub('telemetry');
      setMobileTab('telemetry');
      setTelemetrySubTab('strategy');
      desktopScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
      mobileScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (featureId === 'position_changes') {
      setAppMode('season');
      setActiveHub('telemetry');
      setMobileTab('telemetry');
      setTelemetrySubTab('pace');
      desktopScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
      mobileScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (featureId === 'sector_analysis') {
      setAppMode('season');
      setActiveHub('telemetry');
      setMobileTab('telemetry');
      setTelemetrySubTab('pace');
      desktopScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
      mobileScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (featureId === 'team_radios') {
      setAppMode('season');
      setActiveHub('telemetry');
      setMobileTab('telemetry');
      setTelemetrySubTab('radio');
      desktopScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
      mobileScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (featureId === 'fia_rules') {
      setAppMode('library');
      setLibrarySubTab('rules');
      setActiveHub('knowledge');
      desktopScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
      mobileScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (featureId === 'race_notes') {
      setActiveHub('notes');
      setMobileTab('notes');
      desktopScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
      mobileScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (featureId === 'library' || featureId === 'knowledge') {
      setAppMode('library');
      setActiveHub('knowledge');
      desktopScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
      mobileScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (
      featureId === 'drivers' ||
      featureId === 'teams' ||
      featureId === 'circuits' ||
      featureId === 'tyres' ||
      featureId === 'drama' ||
      featureId === 'glossary' ||
      featureId === 'rules'
    ) {
      setAppMode('library');
      setLibrarySubTab(featureId as SubTab);
      setActiveHub('knowledge');
      desktopScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
      mobileScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (featureId === 'ai_strategist') {
      setAiDrawerOpen(true);
      setRightPanelTab('ai');
    }
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
      const yrNum = parseInt(year);
      const liveSessions = await fetchSessions(yrNum).catch(() => []);
      const catalogSessions = getCatalogSessionsForYear(yrNum);
      const sessions = (liveSessions && liveSessions.length > 0) ? liveSessions : catalogSessions;
      
      const firstMeeting = sessions[0]?.meeting_key ?? null;
      const meetingSessions = sessions.filter(s => s.meeting_key === firstMeeting);
      const targetSession = meetingSessions.find(s => s.session_name === 'Race' || s.session_type === 'Race')
        ?? meetingSessions[0]
        ?? sessions[0]
        ?? null;

      const sessionKey = targetSession?.session_key ?? null;
      let drivers: Driver[] = [];
      let stints: Stint[] = [];
      let raceControlMessages: RaceControlMessage[] = [];

      if (sessionKey) {
        try {
          const [d, st, rc] = await Promise.all([
            fetchDrivers(sessionKey).catch(() => []),
            fetchStints(sessionKey).catch(() => []),
            fetchRaceControl(sessionKey).catch(() => []),
          ]);
          drivers = d;
          stints = st;
          raceControlMessages = rc;
        } catch {}
      }

      if (!drivers || drivers.length === 0) {
        drivers = (sessionKey && MOCK_DRIVERS[sessionKey]) ? MOCK_DRIVERS[sessionKey] : getDriversForYear(yrNum);
      }
      if (!stints || stints.length === 0) {
        stints = (sessionKey && MOCK_STINTS[sessionKey]) ? MOCK_STINTS[sessionKey] : generateCatalogStints(drivers);
      }
      if (!raceControlMessages || raceControlMessages.length === 0) {
        raceControlMessages = (sessionKey && MOCK_RACE_CONTROL[sessionKey]) ? MOCK_RACE_CONTROL[sessionKey] : generateCatalogRaceControl(sessionKey ?? 0);
      }

      const benchmark = resolveCircuitForSession(targetSession);

      if (!stints || stints.length === 0) {
        stints = (sessionKey && MOCK_STINTS[sessionKey])
          ? MOCK_STINTS[sessionKey]
          : generateCatalogStints(drivers, benchmark.totalLaps, benchmark.pit1Lap, benchmark.pit2Lap);
      }

      const top2Nums = drivers.slice(0, 2).map(d => d.driver_number.toString());
      const selectedDrivers = top2Nums.length > 0 ? top2Nums : ['1', '44'];

      const lapsCache: Record<string, Lap[]> = {};
      for (const num of selectedDrivers) {
        const mk = `${sessionKey}_${num}`;
        const rawLaps = MOCK_LAPS[mk] ?? generateMockLaps(parseInt(num), sessionKey ?? 9161, benchmark);
        lapsCache[num] = enrichLapsWithStints(rawLaps, stints, num);
      }

      const allLaps = Object.values(lapsCache).flat();
      const safetyCarPeriods = detectSafetyCarPeriods(raceControlMessages, allLaps);

      const d1Code = drivers.find(d => d.driver_number.toString() === selectedDrivers[0])?.name_acronym
        ?? GLOBAL_DRIVER_NUM_TO_CODE[selectedDrivers[0]]
        ?? 'VER';
      const d2Code = drivers.find(d => d.driver_number.toString() === selectedDrivers[1])?.name_acronym
        ?? GLOBAL_DRIVER_NUM_TO_CODE[selectedDrivers[1]]
        ?? 'NOR';

      setDetailedTelemetryParams({
        circuitId: benchmark.circuitId,
        driver1: d1Code,
        driver2: d2Code,
      });

      setState(prev => ({
        ...prev,
        selectedYear: year,
        sessions,
        selectedMeetingKey: firstMeeting,
        selectedSessionKey: sessionKey,
        currentSession: targetSession,
        drivers,
        stints,
        selectedDrivers,
        lapsCache,
        teamRadioCache: {},
        pitStopsCache: {},
        raceControlMessages,
        safetyCarPeriods,
        isDemoMode: liveSessions.length === 0,
        isLoading: false,
      }));
    } catch (err) {
      console.error('[handleYearChange error]', err);
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const handleMeetingChange = useCallback(async (key: number) => {
    setState(prev => ({ ...prev, selectedMeetingKey: key, isLoading: true }));

    const meetingSessions = state.sessions.filter(s => s.meeting_key === key);
    const targetSession = meetingSessions.find(s => s.session_name === 'Race' || s.session_type === 'Race')
      ?? meetingSessions[0]
      ?? null;

    const sessionKey = targetSession?.session_key ?? null;
    const yrNum = parseInt(state.selectedYear);

    let drivers: Driver[] = [];
    let stints: Stint[] = [];
    let raceControlMessages: RaceControlMessage[] = [];

    if (sessionKey) {
      try {
        const [d, st, rc] = await Promise.all([
          fetchDrivers(sessionKey).catch(() => []),
          fetchStints(sessionKey).catch(() => []),
          fetchRaceControl(sessionKey).catch(() => []),
        ]);
        drivers = d;
        stints = st;
        raceControlMessages = rc;
      } catch {}
    }

    if (!drivers || drivers.length === 0) {
      drivers = (sessionKey && MOCK_DRIVERS[sessionKey]) ? MOCK_DRIVERS[sessionKey] : getDriversForYear(yrNum);
    }
    if (!stints || stints.length === 0) {
      stints = (sessionKey && MOCK_STINTS[sessionKey]) ? MOCK_STINTS[sessionKey] : generateCatalogStints(drivers);
    }
    if (!raceControlMessages || raceControlMessages.length === 0) {
      raceControlMessages = (sessionKey && MOCK_RACE_CONTROL[sessionKey]) ? MOCK_RACE_CONTROL[sessionKey] : generateCatalogRaceControl(sessionKey ?? 0);
    }

    const benchmark = resolveCircuitForSession(targetSession);

    if (!stints || stints.length === 0) {
      stints = (sessionKey && MOCK_STINTS[sessionKey])
        ? MOCK_STINTS[sessionKey]
        : generateCatalogStints(drivers, benchmark.totalLaps, benchmark.pit1Lap, benchmark.pit2Lap);
    }

    const validSelected = state.selectedDrivers.filter(num => drivers.some(d => d.driver_number.toString() === num));
    const selectedDrivers = validSelected.length > 0 ? validSelected : drivers.slice(0, 2).map(d => d.driver_number.toString());

    const lapsCache: Record<string, Lap[]> = {};
    for (const num of selectedDrivers) {
      const mk = `${sessionKey}_${num}`;
      const rawLaps = MOCK_LAPS[mk] ?? generateMockLaps(parseInt(num), sessionKey ?? 9161, benchmark);
      lapsCache[num] = enrichLapsWithStints(rawLaps, stints, num);
    }

    const allLaps = Object.values(lapsCache).flat();
    const safetyCarPeriods = detectSafetyCarPeriods(raceControlMessages, allLaps);

    const d1Code = drivers.find(d => d.driver_number.toString() === selectedDrivers[0])?.name_acronym
      ?? GLOBAL_DRIVER_NUM_TO_CODE[selectedDrivers[0]]
      ?? 'VER';
    const d2Code = drivers.find(d => d.driver_number.toString() === selectedDrivers[1])?.name_acronym
      ?? GLOBAL_DRIVER_NUM_TO_CODE[selectedDrivers[1]]
      ?? 'NOR';

    setDetailedTelemetryParams({
      circuitId: benchmark.circuitId,
      driver1: d1Code,
      driver2: d2Code,
    });

    setState(prev => ({
      ...prev,
      selectedMeetingKey: key,
      selectedSessionKey: sessionKey,
      currentSession: targetSession,
      drivers,
      stints,
      selectedDrivers,
      lapsCache,
      teamRadioCache: {},
      pitStopsCache: {},
      raceControlMessages,
      safetyCarPeriods,
      isLoading: false,
    }));
  }, [state.sessions, state.selectedYear, state.selectedDrivers]);

  const handleSessionChange = useCallback(async (sessionKey: number) => {
    setState(prev => ({ ...prev, selectedSessionKey: sessionKey, isLoading: true }));

    const targetSession = state.sessions.find(s => s.session_key === sessionKey) ?? null;
    const yrNum = parseInt(state.selectedYear);

    let drivers: Driver[] = [];
    let stints: Stint[] = [];
    let raceControlMessages: RaceControlMessage[] = [];

    try {
      const [d, st, rc] = await Promise.all([
        fetchDrivers(sessionKey).catch(() => []),
        fetchStints(sessionKey).catch(() => []),
        fetchRaceControl(sessionKey).catch(() => []),
      ]);
      drivers = d;
      stints = st;
      raceControlMessages = rc;
    } catch {}

    if (!drivers || drivers.length === 0) {
      drivers = (sessionKey && MOCK_DRIVERS[sessionKey]) ? MOCK_DRIVERS[sessionKey] : getDriversForYear(yrNum);
    }
    if (!stints || stints.length === 0) {
      stints = (sessionKey && MOCK_STINTS[sessionKey]) ? MOCK_STINTS[sessionKey] : generateCatalogStints(drivers);
    }
    if (!raceControlMessages || raceControlMessages.length === 0) {
      raceControlMessages = (sessionKey && MOCK_RACE_CONTROL[sessionKey]) ? MOCK_RACE_CONTROL[sessionKey] : generateCatalogRaceControl(sessionKey);
    }

    const benchmark = resolveCircuitForSession(targetSession);

    if (!stints || stints.length === 0) {
      stints = (sessionKey && MOCK_STINTS[sessionKey])
        ? MOCK_STINTS[sessionKey]
        : generateCatalogStints(drivers, benchmark.totalLaps, benchmark.pit1Lap, benchmark.pit2Lap);
    }

    const validSelected = state.selectedDrivers.filter(num => drivers.some(d => d.driver_number.toString() === num));
    const selectedDrivers = validSelected.length > 0 ? validSelected : drivers.slice(0, 2).map(d => d.driver_number.toString());

    const lapsCache: Record<string, Lap[]> = {};
    for (const num of selectedDrivers) {
      const mk = `${sessionKey}_${num}`;
      const rawLaps = MOCK_LAPS[mk] ?? generateMockLaps(parseInt(num), sessionKey, benchmark);
      lapsCache[num] = enrichLapsWithStints(rawLaps, stints, num);
    }

    const allLaps = Object.values(lapsCache).flat();
    const safetyCarPeriods = detectSafetyCarPeriods(raceControlMessages, allLaps);

    const d1Code = drivers.find(d => d.driver_number.toString() === selectedDrivers[0])?.name_acronym
      ?? GLOBAL_DRIVER_NUM_TO_CODE[selectedDrivers[0]]
      ?? 'VER';
    const d2Code = drivers.find(d => d.driver_number.toString() === selectedDrivers[1])?.name_acronym
      ?? GLOBAL_DRIVER_NUM_TO_CODE[selectedDrivers[1]]
      ?? 'NOR';

    setDetailedTelemetryParams({
      circuitId: benchmark.circuitId,
      driver1: d1Code,
      driver2: d2Code,
    });

    setState(prev => ({
      ...prev,
      selectedSessionKey: sessionKey,
      currentSession: targetSession,
      drivers,
      stints,
      selectedDrivers,
      lapsCache,
      teamRadioCache: {},
      pitStopsCache: {},
      raceControlMessages,
      safetyCarPeriods,
      isLoading: false,
    }));
  }, [state.sessions, state.selectedYear, state.selectedDrivers]);

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
        const rawLaps = (laps && laps.length > 0)
          ? laps
          : (MOCK_LAPS[mk] ?? generateMockLaps(parseInt(driverNum), state.selectedSessionKey!));
        const enriched = enrichLapsWithStints(rawLaps, prev.stints, driverNum);
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
    setTelemetrySubTab('radio');
    setTimeout(() => {
      timelineRef.current?.scrollToLap(driverNum, lapNumber);
    }, 200);
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
    setTelemetrySubTab('car_data');

    if (!target) {
      desktopScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
      mobileScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Helper to resolve input ('VER', '44') to 3-letter driver code
    const resolveDriverCode = (input?: string, fallback: string = 'VER') => {
      if (!input) return fallback;
      if (GLOBAL_DRIVER_NUM_TO_CODE[input]) return GLOBAL_DRIVER_NUM_TO_CODE[input];
      return input.toUpperCase();
    };

    // Helper to resolve input ('VER', '44') to driver number string
    const resolveDriverNumber = (input?: string): string | null => {
      if (!input) return null;
      if (/^\d+$/.test(input)) return input;
      for (const [num, code] of Object.entries(GLOBAL_DRIVER_NUM_TO_CODE)) {
        if (code.toUpperCase() === input.toUpperCase()) return num;
      }
      return null;
    };

    const targetCode = resolveDriverCode(target.targetDriver, 'VER');
    const targetCode2 = target.targetDriver2
      ? resolveDriverCode(target.targetDriver2, targetCode === 'VER' ? 'NOR' : 'VER')
      : (targetCode === 'VER' ? 'NOR' : 'VER');

    let circId = 'bahrain-international';
    if (target.meetingName?.includes('Japan') || target.meetingName?.includes('Suzuka')) circId = 'suzuka';
    else if (target.meetingName?.includes('Belgium') || target.meetingName?.includes('Spa')) circId = 'spa-francorchamps';
    else if (target.meetingName?.includes('Italy') || target.meetingName?.includes('Monza')) circId = 'monza';
    else if (target.meetingName?.includes('Britain') || target.meetingName?.includes('Silverstone')) circId = 'silverstone';
    else if (target.meetingName?.includes('Monaco')) circId = 'monaco';

    setDetailedTelemetryParams({
      circuitId: circId,
      driver1: targetCode,
      driver2: targetCode2,
    });

    // Auto-select drivers in main session state
    const num1 = resolveDriverNumber(target.targetDriver);
    const num2 = resolveDriverNumber(target.targetDriver2);
    if (num1 || num2) {
      setState(prev => {
        const nextSelected = [...prev.selectedDrivers];
        if (num1 && !nextSelected.includes(num1)) nextSelected.unshift(num1);
        if (num2 && !nextSelected.includes(num2)) nextSelected.push(num2);
        return {
          ...prev,
          selectedDrivers: nextSelected.slice(0, 3),
        };
      });
    }

    desktopScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    mobileScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });

    // Scroll & focus timeline / chart to target lap
    if (target.targetLap) {
      const drv = target.targetDriver ?? state.selectedDrivers[0] ?? '1';
      setTimeout(() => {
        timelineRef.current?.scrollToLap(drv, target.targetLap!);
      }, 350);
    }
  }, [state.selectedDrivers]);

  // AI-driven navigation handler:
  // - PC (width >= 1024): Opens independent AITelemetryInspectorModal (main screen state completely preserved!)
  // - Mobile (< 1024): Closes drawer and applies circuit/drivers/laps directly to main telemetry screen
  const handleAiNavigate = useCallback((action: NavAction) => {
    const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 1024;

    if (action.type === 'telemetry') {
      const circuitId = action.circuitId || detailedTelemetryParams.circuitId || 'bahrain-international';
      const d1 = action.driver1 || detailedTelemetryParams.driver1 || 'VER';
      const d2 = action.driver2 || detailedTelemetryParams.driver2 || 'NOR';

      const guidanceText = `【${d1} vs ${d2} ${action.lapNumber ? `(Lap ${action.lapNumber})` : ''} テレメトリー分析ガイド】
1. ストレート区間での最高速とDRS作動効果の差をチェック
2. ターン進入時のブレーキング開始位置と減速Gの立ち上がり比較
3. エイペックスでの最小速度（ボトムスピード）とステアリング回頭性
4. コーナー脱出時のスロットル全開（100%）到達タイミングとトラクション
※グラフ下部のコーナー番号ボタンをクリックして各セクションをズームできます。`;

      setActiveAiGuidance({
        title: `🤖 AI分析ガイド: ${d1} vs ${d2} ${action.lapNumber ? `(Lap ${action.lapNumber})` : ''}`,
        content: guidanceText,
        sourceAction: 'telemetry',
      });

      if (isDesktop) {
        // PC: Open independent inspector modal (main screen state untouched!)
        setAiInspectorState({
          isOpen: true,
          circuitId,
          driver1Code: d1,
          driver2Code: d2,
          lapNumber: action.lapNumber,
          insightNotes: guidanceText,
        });
      } else {
        // Mobile: Close drawer and apply directly to main telemetry screen
        setAiDrawerOpen(false);
        setAppMode('season');
        setActiveHub('telemetry');
        setMobileTab('telemetry');
        setTelemetrySubTab('car_data');
        setDetailedTelemetryParams({
          circuitId,
          driver1: d1,
          driver2: d2,
        });
        desktopScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
        mobileScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }

    // Other tools (PC & Mobile): close AI drawer and jump directly
    setAiDrawerOpen(false);

    if (action.type === 'stints') {
      setAppMode('season');
      setActiveHub('telemetry');
      setMobileTab('telemetry');
      setTelemetrySubTab('strategy');
      desktopScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
      mobileScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (action.type === 'pit_sim') {
      setAppMode('season');
      setActiveHub('telemetry');
      setMobileTab('telemetry');
      setTelemetrySubTab('strategy');
      desktopScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
      mobileScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (action.type === 'radio') {
      setAppMode('season');
      setActiveHub('telemetry');
      setMobileTab('telemetry');
      setTelemetrySubTab('radio');
      desktopScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
      mobileScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
      if (action.lapNumber) {
        const drv = state.selectedDrivers[0] ?? '1';
        setTimeout(() => {
          timelineRef.current?.scrollToLap(drv, action.lapNumber!);
        }, 250);
      }
    } else if (action.type === 'library_tyres') {
      setAppMode('library');
      setLibrarySubTab('tyres');
      setActiveHub('knowledge');
    } else if (action.type === 'library_circuits') {
      if (action.circuitId) setTargetCircuitId(action.circuitId);
      setAppMode('library');
      setLibrarySubTab('circuits');
      setActiveHub('knowledge');
    } else if (action.type === 'library_regulations') {
      setAppMode('library');
      setLibrarySubTab('regulations');
      setActiveHub('knowledge');
    } else if (action.type === 'library_glossary') {
      if (action.termId) {
        setTargetGlossaryTermId(action.termId);
      }
      setAppMode('library');
      setLibrarySubTab('glossary');
      setActiveHub('knowledge');
    } else if (action.type === 'library_drama') {
      setAppMode('library');
      setLibrarySubTab('drama');
      setActiveHub('knowledge');
    } else if (action.type === 'quiz') {
      setQuizModalOpen(true);
    }
  }, [detailedTelemetryParams, state.selectedDrivers]);


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

  const currentBenchmark = useMemo(() => {
    return resolveCircuitForSession(state.currentSession);
  }, [state.currentSession]);

  const analysisContent = (
    <div className="flex flex-col gap-3">
      {/* Persistent AI Guidance Companion Bar if active */}
      {activeAiGuidance && (() => {
        const lower = activeAiGuidance.content.toLowerCase();
        const relevantTerms = GLOSSARY_TERMS.filter((term) => {
          if (lower.includes(term.id.toLowerCase())) return true;
          const cleanTerm = term.term.replace(/\(.*?\)/g, '').trim().toLowerCase();
          if (cleanTerm.length >= 2 && lower.includes(cleanTerm)) return true;
          const cleanEn = term.englishTerm.toLowerCase();
          if (cleanEn.length >= 3 && lower.includes(cleanEn)) return true;
          return false;
        }).slice(0, 6);

        return (
          <div className="rounded-xl bg-gradient-to-r from-blue-950/90 via-slate-900/90 to-indigo-950/90 border border-blue-500/30 p-2.5 sm:p-3 shadow-md space-y-2 animate-fade-in">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-base">🤖</span>
                <h4 className="font-racing font-bold text-xs sm:text-sm text-white flex items-center gap-2">
                  <span>{activeAiGuidance.title}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30">
                    AIアドバイス保持中
                  </span>
                </h4>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setQuickGlossaryQuery('');
                    setQuickGlossaryOpen(true);
                  }}
                  className="text-[11px] font-racing font-bold px-2.5 py-1 rounded-lg bg-emerald-700/80 hover:bg-emerald-600 text-white transition-colors cursor-pointer shadow-sm flex items-center gap-1"
                  title="F1用語クイック検索を開く"
                >
                  <span>📖</span>
                  <span>用語検索</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (typeof window === 'undefined') return;
                    const params = new URLSearchParams();
                    if (detailedTelemetryParams.circuitId) params.set('circuit', detailedTelemetryParams.circuitId);
                    if (detailedTelemetryParams.driver1) params.set('d1', detailedTelemetryParams.driver1);
                    if (detailedTelemetryParams.driver2) params.set('d2', detailedTelemetryParams.driver2);
                    if (activeAiGuidance.content) params.set('notes', activeAiGuidance.content);

                    const url = `/popout/telemetry?${params.toString()}`;
                    const width = 1280;
                    const height = 850;
                    const left = Math.max(0, Math.round((window.screen.width - width) / 2));
                    const top = Math.max(0, Math.round((window.screen.height - height) / 2));

                    window.open(
                      url,
                      'F1TelemetryInspectorPopout',
                      `width=${width},height=${height},left=${left},top=${top},menubar=no,toolbar=no,location=no,status=no,resizable=yes,scrollbars=yes`
                    );
                  }}
                  className="text-[11px] font-racing font-bold px-2.5 py-1 rounded-lg bg-purple-950/80 hover:bg-purple-900 border border-purple-500/40 hover:border-purple-300 text-purple-200 hover:text-white transition-colors cursor-pointer shadow-sm flex items-center gap-1"
                  title="テレメトリーを別ウィンドウで分離して開く（マルチモニター・デュアルディスプレイ対応）"
                >
                  <span>↗</span>
                  <span className="hidden sm:inline">別ウィンドウ</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAiDrawerOpen(true);
                    setRightPanelTab('ai');
                  }}
                  className="text-[11px] font-racing font-bold px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-colors cursor-pointer shadow-sm"
                >
                  AIチャットを開く
                </button>
                <button
                  type="button"
                  onClick={() => setActiveAiGuidance(null)}
                  className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                  title="閉じる"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="text-xs text-slate-200 whitespace-pre-wrap leading-relaxed pl-4 border-l-2 border-blue-400/50">
              {activeAiGuidance.content}
            </div>

            {/* Clickable Relevant Term Chips */}
            {relevantTerms.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 pt-1.5 border-t border-white/10 mt-1">
                <span className="text-[10px] font-racing font-bold text-sky-400 flex items-center gap-1 flex-shrink-0">
                  <span>💡</span>
                  <span>解説内の重要用語:</span>
                </span>
                {relevantTerms.map((term) => (
                  <button
                    key={term.id}
                    type="button"
                    onClick={() => {
                      setQuickGlossaryQuery(term.term.split(' ')[0]);
                      setQuickGlossaryOpen(true);
                    }}
                    className="px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold bg-slate-800/90 hover:bg-emerald-950/90 text-slate-300 hover:text-emerald-300 border border-white/10 hover:border-emerald-500/40 transition-all flex items-center gap-1 cursor-pointer shadow-sm active:scale-95"
                  >
                    <span>🧠</span>
                    <span>{term.term.split(' ')[0]}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        );
      })()}

      {/* ── WORKSPACE 1: PACE & POSITION (ラップタイム推移・累積ギャップ・周回順位・セクター分析) ── */}
      {telemetrySubTab === 'pace' && (
        <div className="space-y-3 sm:space-y-4 animate-fade-in">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="text-base">📈</span>
              <h2 className="f1-card-title text-white">PACE & POSITION ANALYSIS</h2>
              <span className="text-[10px] font-mono text-slate-400 bg-white/5 px-2 py-0.5 rounded border border-white/10">
                ラップタイム推移・累積ギャップ・周回順位変動
              </span>
            </div>
            <div className="text-[11px] font-mono text-slate-400">
              ※グラフ上のラップ番号をクリックすると無線ログへジャンプ
            </div>
          </div>

          <TelemetryChart
            selectedDrivers={state.selectedDrivers}
            lapsCache={state.lapsCache}
            drivers={state.drivers}
            stints={state.stints}
            pitStopsCache={state.pitStopsCache}
            teamRadioCache={state.teamRadioCache}
            safetyCarPeriods={state.safetyCarPeriods}
            onLapClick={handleLapClick}
            transcriptsCache={state.transcriptsCache}
            onTranscriptFetched={handleTranscriptFetched}
          />

          <section id="position-change-section">
            <PositionChangeChart
              drivers={state.drivers}
              stints={state.stints}
              safetyCarPeriods={state.safetyCarPeriods}
              totalLaps={currentBenchmark.totalLaps}
              selectedDrivers={state.selectedDrivers}
              onDriverSelect={(driverNum) =>
                handleDriverToggle(driverNum, !state.selectedDrivers.includes(driverNum))
              }
            />
          </section>

          {state.selectedDrivers.length > 0 && (
            <section id="sector-analysis-section">
              <SectorAnalysis
                selectedDrivers={state.selectedDrivers}
                drivers={state.drivers}
                lapsCache={state.lapsCache}
              />
            </section>
          )}
        </div>
      )}

      {/* ── WORKSPACE 2: COCKPIT CAR TELEMETRY (車速・スロットル・ブレーキ・ギア3連精密比較 ＆ コースマップ) ── */}
      {telemetrySubTab === 'car_data' && (
        <div className="space-y-3 sm:space-y-4 animate-fade-in">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="text-base">⚡</span>
              <h2 className="f1-card-title text-white">COCKPIT CAR TELEMETRY</h2>
              <span className="text-[10px] font-mono text-slate-400 bg-white/5 px-2 py-0.5 rounded border border-white/10">
                車速・ペダル・ギア3連精密比較 ＆ コースマップ・デルタマトリクス
              </span>
            </div>
          </div>

          <section id="detailed-telemetry-section">
            <DetailedTelemetryChart
              initialCircuitId={detailedTelemetryParams.circuitId}
              initialDriver1Code={detailedTelemetryParams.driver1}
              initialDriver2Code={detailedTelemetryParams.driver2}
              initialTab={detailedTelemetryTab}
              onNavigateToCircuit={(circId) => {
                setTargetCircuitId(circId);
                setAppMode('library');
                setLibrarySubTab('circuits');
                setActiveHub('knowledge');
                desktopScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
                mobileScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onNavigateToGlossary={(termId) => {
                setTargetGlossaryTermId(termId);
                setAppMode('library');
                setLibrarySubTab('rules');
                setActiveHub('knowledge');
                desktopScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
                mobileScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </section>
        </div>
      )}

      {/* ── WORKSPACE 3: TYRE STINTS & STRATEGY (全車タイヤ履歴・アンダーカット/オーバーカット戦略シミュレーション) ── */}
      {telemetrySubTab === 'strategy' && (
        <div className="space-y-3 sm:space-y-4 animate-fade-in">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="text-base">🛞</span>
              <h2 className="f1-card-title text-white">TYRE STINTS & PIT STRATEGY</h2>
              <span className="text-[10px] font-mono text-slate-400 bg-white/5 px-2 py-0.5 rounded border border-white/10">
                全車タイヤ履歴 ＆ 戦略シミュレーション
              </span>
            </div>
          </div>

          <section id="stint-visualizer-section">
            <StintVisualizer
              drivers={state.drivers}
              stints={state.stints}
              pitStopsCache={state.pitStopsCache}
              totalLaps={currentBenchmark.totalLaps}
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
          </section>

          {state.selectedDrivers.length > 0 && (
            <section id="pit-strategy-simulator-section">
              <PitStrategySimulator
                selectedDrivers={state.selectedDrivers}
                drivers={state.drivers}
                lapsCache={state.lapsCache}
                stints={state.stints}
                initialViewMode={pitStrategyViewMode}
                onOpenUpgradeModal={() => setProModalOpen(true)}
              />
            </section>
          )}
        </div>
      )}

      {/* ── WORKSPACE 4: TEAM RADIO & RACE CONTROL (チーム無線音声・リアルタイムAI戦術翻訳 ＆ FIA審理速報) ── */}
      {telemetrySubTab === 'radio' && (
        <div className="space-y-3 sm:space-y-4 animate-fade-in">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="text-base">📻</span>
              <h2 className="f1-card-title text-white">TEAM RADIO & RACE CONTROL</h2>
              <span className="text-[10px] font-mono text-slate-400 bg-white/5 px-2 py-0.5 rounded border border-white/10">
                無線音声・リアルタイムAI戦術翻訳 ＆ FIA審理速報
              </span>
            </div>
          </div>

          <section id="team-radio-section">
            <TeamRadioTimeline
              ref={timelineRef}
              selectedDrivers={state.selectedDrivers}
              teamRadioCache={state.teamRadioCache}
              pitStopsCache={state.pitStopsCache}
              raceControlMessages={state.raceControlMessages}
              drivers={state.drivers}
              lapsCache={state.lapsCache}
              transcriptsCache={state.transcriptsCache}
              onTranscriptFetched={handleTranscriptFetched}
              onRequireAuth={() => handleRequireAuth('チーム無線 AI解析', 'チーム無線のリアルタイム文字起こしおよびAI戦術要約は認証メンバー専用機能です。')}
            />
          </section>
        </div>
      )}

      {/* ── WORKSPACE 5: LAP-BY-LAP DATA SHEET (全周回ラップタイム・セクター別スプリット・ピット詳細データ) ── */}
      {telemetrySubTab === 'laptable' && (
        <div className="space-y-3 sm:space-y-4 animate-fade-in">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="text-base">📋</span>
              <h2 className="f1-card-title text-white">LAP-BY-LAP DATA SHEET</h2>
              <span className="text-[10px] font-mono text-slate-400 bg-white/5 px-2 py-0.5 rounded border border-white/10">
                全周回ラップタイム・セクター別スプリット・ピット詳細データ
              </span>
            </div>
          </div>

          {state.selectedDrivers.length > 0 ? (
            <section>
              <SectionTitle>LAP DETAIL TABLE</SectionTitle>
              <LapTable
                selectedDrivers={state.selectedDrivers}
                lapsCache={state.lapsCache}
                drivers={state.drivers}
                stints={state.stints}
              />
            </section>
          ) : (
            <div className="glass-card p-8 text-center text-slate-400 font-mono text-sm">
              左サイドバー（または上部メニュー）からドライバーを選択してください。
            </div>
          )}
        </div>
      )}
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
        session={state.currentSession}
        onAddToNotebook={handleAddToNotebook}
        onRequireAuth={() => handleRequireAuth('AI 戦略アナリスト', 'AI戦略アナリストによるレース分析・戦略提案は認証メンバー専用機能です。')}
        onNavigate={handleAiNavigate}
        onOpenUpgradeModal={() => setProModalOpen(true)}
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
      {/* ── Minimalist Location Breadcrumb (Slim & unobtrusive) ── */}
      <nav aria-label="Breadcrumb" className="mb-3 flex items-center gap-1.5 text-xs text-slate-400 font-mono">
        <button
          type="button"
          onClick={handleGoHome}
          className="text-slate-400 hover:text-white transition-colors cursor-pointer flex items-center gap-1"
          title="ホーム画面に戻る"
        >
          <span>🏠</span>
          <span>ホーム</span>
        </button>
        <span className="text-slate-600">/</span>
        <span className="text-slate-300">
          {appMode === 'season' ? 'レース観戦' : 'F1大百科'}
        </span>
        <span className="text-slate-600">/</span>
        <span className="text-slate-200 font-semibold font-sans">
          {appMode === 'season'
            ? activeHub === 'season'
              ? '2026年レースカレンダー'
              : activeHub === 'telemetry'
              ? telemetrySubTab === 'car_data'
                ? detailedTelemetryTab === 'delta_matrix'
                  ? 'コックピット・タイムデルタ(Δt)解析'
                  : 'コックピット解析 (3連データ＆マップ)'
                : telemetrySubTab === 'strategy'
                ? 'タイヤ戦略・ピットシミュレーター'
                : telemetrySubTab === 'radio'
                ? 'チーム無線＆レースコントロール'
                : telemetrySubTab === 'laptable'
                ? '周回データシート'
                : 'ペース・順位推移'
              : activeHub === 'simulator'
              ? 'グランプリ模擬レース ＆ 作戦司令室'
              : activeHub === 'news'
              ? 'ニュース＆パドック (FOD公式中継)'
              : 'レースノート＆AI'
            : librarySubTab === 'drivers'
            ? '選手名鑑'
            : librarySubTab === 'teams'
            ? 'チーム名鑑'
            : librarySubTab === 'circuits'
            ? 'コース解説'
            : librarySubTab === 'tyres'
            ? 'タイヤ大百科'
            : librarySubTab === 'strategy'
            ? '戦略・作戦室'
            : librarySubTab === 'regulations'
            ? '2026次世代規定'
            : librarySubTab === 'rules'
            ? '規定・用語集'
            : librarySubTab === 'history'
            ? '歴史アーカイブ'
            : 'ドラマ・名場面'}
        </span>
      </nav>

      {activeHub === 'season' && (
        <ErrorBoundary sectionName="F1 シーズン観戦＆カレンダー">
          <SeasonHub
            onNavigateToTelemetry={(gpName) => {
              setActiveHub('telemetry');
              setMobileTab('telemetry');
              setTelemetrySubTab('car_data');
              if (gpName) {
                let circId = 'bahrain-international';
                if (gpName.includes('日本') || gpName.includes('鈴鹿')) circId = 'suzuka';
                else if (gpName.includes('ベルギー') || gpName.includes('スパ')) circId = 'spa-francorchamps';
                else if (gpName.includes('イタリア') || gpName.includes('モンツァ')) circId = 'monza';
                else if (gpName.includes('イギリス') || gpName.includes('シルバーストン')) circId = 'silverstone';
                else if (gpName.includes('モナコ')) circId = 'circuit-de-monaco';
                else if (gpName.includes('オーストラリア') || gpName.includes('メルボルン')) circId = 'albert-park';
                else if (gpName.includes('中国') || gpName.includes('上海')) circId = 'shanghai';
                else if (gpName.includes('サウジ') || gpName.includes('ジェッダ')) circId = 'jeddah';
                else if (gpName.includes('マイアミ')) circId = 'miami';
                else if (gpName.includes('カナダ') || gpName.includes('モントリオール')) circId = 'villeneuve';
                else if (gpName.includes('スペイン') || gpName.includes('カタロニア')) circId = 'catalunya';
                else if (gpName.includes('マドリード') || gpName.includes('マドリング')) circId = 'madrid';
                else if (gpName.includes('オーストリア') || gpName.includes('レッドブル')) circId = 'redbull-ring';
                else if (gpName.includes('ハンガリー') || gpName.includes('ハンガロリンク')) circId = 'hungaroring';
                else if (gpName.includes('オランダ') || gpName.includes('ザントフォールト')) circId = 'zandvoort';
                else if (gpName.includes('アゼルバイジャン') || gpName.includes('バクー')) circId = 'baku';
                else if (gpName.includes('シンガポール')) circId = 'singapore';
                else if (gpName.includes('アメリカ') || gpName.includes('オースティン')) circId = 'cota';
                else if (gpName.includes('メキシコ')) circId = 'mexico';
                else if (gpName.includes('ブラジル') || gpName.includes('サンパウロ') || gpName.includes('インテルラゴス')) circId = 'interlagos';
                else if (gpName.includes('ラスベガス')) circId = 'las-vegas';
                else if (gpName.includes('カタール') || gpName.includes('ルサイル')) circId = 'losail';
                else if (gpName.includes('アブダビ') || gpName.includes('ヤス')) circId = 'yas-marina';

                setDetailedTelemetryParams(prev => ({
                  ...prev,
                  circuitId: circId,
                }));
              }
              desktopScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
              mobileScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
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
              desktopScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
              mobileScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNavigateToDriver={(driverCode) => {
              setTargetDriverCode(driverCode);
              setAppMode('library');
              setLibrarySubTab('drivers');
              setActiveHub('knowledge');
              desktopScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
              mobileScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNavigateToTeam={(teamId) => {
              setTargetTeamId(teamId);
              setAppMode('library');
              setLibrarySubTab('teams');
              setActiveHub('knowledge');
              desktopScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
              mobileScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        </ErrorBoundary>
      )}
      {activeHub === 'telemetry' && <ErrorBoundary sectionName="テレメトリー分析">{analysisContent}</ErrorBoundary>}
      {activeHub === 'simulator' && (
        <ErrorBoundary sectionName="ピットウォール司令塔 (PITWALL)">
          <RaceSimulatorHub
            onOpenUpgradeModal={() => setProModalOpen(true)}
            onOpenAiStrategist={() => setAiDrawerOpen(true)}
            onNavigateToLibrary={(subTab, termId) => {
              setAppMode('library');
              setLibrarySubTab(subTab as SubTab);
              setActiveHub('knowledge');
              if (termId) setTargetGlossaryTermId(termId);
              desktopScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
              mobileScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        </ErrorBoundary>
      )}
      {activeHub === 'news' && <ErrorBoundary sectionName="ニュースパドック"><NewsPaddockHub /></ErrorBoundary>}
      {activeHub === 'knowledge' && (
        <ErrorBoundary sectionName="ナレッジ＆ヒストリー">
          <KnowledgeHistoryHub
            activeSubTab={librarySubTab}
            onSubTabChange={setLibrarySubTab}
            targetCircuitId={targetCircuitId}
            targetDriverCode={targetDriverCode}
            targetTeamId={targetTeamId}
            initialDramaTab={targetDramaTab}
            initialGlossaryTermId={targetGlossaryTermId}
            onNavigateToApp={(action) => {
              if (action.appMode) setAppMode(action.appMode);
              if (action.hub) {
                setActiveHub(action.hub);
                if (action.hub === 'telemetry') setMobileTab('telemetry');
              }
              if (action.subTab) {
                setLibrarySubTab(action.subTab);
              }
              if (action.circuitId) {
                setDetailedTelemetryParams(prev => ({ ...prev, circuitId: action.circuitId! }));
                setTelemetrySubTab('car_data');
              }
              if (action.section) {
                if (action.section.includes('stint')) setTelemetrySubTab('strategy');
                else if (action.section.includes('detailed')) setTelemetrySubTab('car_data');
                else if (action.section.includes('radio')) setTelemetrySubTab('radio');
                else if (action.section.includes('position')) setTelemetrySubTab('pace');
              }
              desktopScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
              mobileScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
            }}
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
          />
        </ErrorBoundary>
      )}
    </>
  );

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="h-screen h-[100dvh] flex flex-col bg-f1-gradient overflow-hidden">

      {/* ── Header: Ultra-Slim Modern Single Bar (h-14 / 56px fixed) ── */}
      <header className="flex-shrink-0 sticky top-0 z-30 border-b border-white/10 bg-slate-950/95 backdrop-blur-md shadow-md">
        {/* Top Row: Exactly 56px, single line, no vertical bloating */}
        <div className="h-14 px-3 sm:px-4 flex items-center justify-between gap-2 sm:gap-4">
          {/* Left: Hamburger (☰) + Clickable Logo */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Standard App Hamburger Menu Button (☰) */}
            <button
              type="button"
              onClick={() => setNavigationDrawerOpen(true)}
              className="flex items-center justify-center w-9 h-9 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/10 hover:border-white/20 transition-all cursor-pointer shadow-sm active:scale-95 group"
              aria-label="全機能メニューを開く"
              title="全機能メニュー (☰)"
            >
              <div className="w-4 h-3.5 flex flex-col justify-between items-center py-0.5">
                <span className="w-4 h-0.5 bg-current rounded-full transition-all group-hover:bg-red-400" />
                <span className="w-4 h-0.5 bg-current rounded-full transition-all group-hover:bg-red-400" />
                <span className="w-4 h-0.5 bg-current rounded-full transition-all group-hover:bg-red-400" />
              </div>
            </button>

            {/* Logo & Brand Title (Clickable Home Link — アプリ名・ロゴクリックでホーム画面へ即時復帰) */}
            <button
              type="button"
              onClick={handleGoHome}
              className="flex items-center gap-2 p-1 rounded-xl text-left cursor-pointer group select-none hover:bg-white/5 active:bg-white/10 transition-all active:scale-98"
              title="ホーム画面（2026年シーズン観戦カレンダー）に戻る"
              aria-label="ホーム画面に戻る"
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-red-600 via-red-500 to-rose-700 rounded-lg flex items-center justify-center shrink-0 shadow-md shadow-red-950/40 border border-red-400/30 group-hover:border-red-300 group-hover:scale-105 transition-all">
                <span className="font-racing text-white text-xs sm:text-sm font-black tracking-tight">P1</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-racing text-sm sm:text-base font-bold text-white tracking-widest leading-none group-hover:text-red-400 transition-colors">
                  PADOROKU
                </span>
                <span className="hidden xl:inline-block px-1.5 py-0.2 rounded bg-red-950/70 border border-red-500/30 text-[9px] font-mono text-red-300 font-semibold">
                  F1 PORTAL
                </span>
              </div>
            </button>
          </div>

          {/* Center: Primary Navigation Tabs (Single clean row, never wraps) */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-white/10 shadow-inner shrink-0">
            <button
              type="button"
              onClick={() => {
                setAppMode('season');
                setActiveHub('season');
              }}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-racing font-bold transition-all whitespace-nowrap cursor-pointer ${
                appMode === 'season' && activeHub === 'season'
                  ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md shadow-red-950/60 border border-red-500/40'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Flag className="w-3.5 h-3.5" /> SEASON
            </button>

            <button
              type="button"
              onClick={() => {
                setAppMode('season');
                setActiveHub('telemetry');
              }}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-racing font-bold transition-all whitespace-nowrap cursor-pointer ${
                appMode === 'season' && activeHub === 'telemetry'
                  ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md shadow-red-950/60 border border-red-500/40'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Activity className="w-3.5 h-3.5" /> TELEMETRY
            </button>

            <button
              type="button"
              onClick={() => {
                setAppMode('season');
                setActiveHub('news');
              }}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-racing font-bold transition-all whitespace-nowrap cursor-pointer ${
                appMode === 'season' && activeHub === 'news'
                  ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md shadow-red-950/60 border border-red-500/40'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Newspaper className="w-3.5 h-3.5" /> NEWS
            </button>

            <button
              type="button"
              onClick={() => {
                setAppMode('library');
                setActiveHub('knowledge');
              }}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-racing font-bold transition-all whitespace-nowrap cursor-pointer ${
                appMode === 'library'
                  ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md shadow-red-950/60 border border-red-500/40'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" /> LIBRARY
            </button>
          </nav>

          {/* Center-Right: Live JST Telemetry Clock */}
          {jstClock.formatted && (
            <div
              className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-900/90 border border-white/10 text-slate-300 font-mono text-[11px] shadow-sm select-none"
              title="FIA公式タイムテーブル基準 日本標準時 (JST)"
            >
              <Clock className="w-3.5 h-3.5 text-red-400 animate-pulse shrink-0" />
              <span className="text-slate-400 text-[10px] font-bold">JST</span>
              <span className="text-white font-medium">{jstClock.formatted}</span>
            </div>
          )}

          {/* Right: Quick Tools (Search, Quiz, AI, Auth + Dedicated PITWALL Game Launcher) */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Special Standalone PITWALL Game Launcher (特別独立起動ボタン) */}
            <button
              type="button"
              onClick={() => {
                const screenW = typeof window !== 'undefined' ? window.screen.availWidth || 1920 : 1920;
                const screenH = typeof window !== 'undefined' ? window.screen.availHeight || 1080 : 1080;
                const win = window.open(
                  '/pitwall',
                  'F1PitwallGame',
                  `width=${screenW},height=${screenH},left=0,top=0,menubar=no,toolbar=no,location=no,status=no,resizable=yes,scrollbars=yes`
                );
                if (!win || win.closed || typeof win.closed === 'undefined') {
                  window.open('/pitwall', '_blank');
                }
              }}
              className="btn-console relative px-3 py-1.5 rounded-xl font-racing font-bold text-xs bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white border border-red-400/60 hover:border-white shadow-lg shadow-red-950/80 hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5 shrink-0 group"
              title="F1 PITWALL 司令塔ゲームを別画面・全画面で起動"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
              <Gamepad2 className="w-4 h-4 text-white group-hover:rotate-12 transition-transform" />
              <span className="tracking-wider">PITWALL</span>
              <span className="hidden xl:inline-block px-1.5 py-0.2 rounded bg-black/40 text-[9px] font-mono text-amber-300 font-semibold border border-amber-400/30">
                GAME
              </span>
            </button>

            {/* Global Command Palette / Search Button (Ctrl+K) */}
            <button
              type="button"
              onClick={() => setGlobalSearchOpen(true)}
              className="btn-console"
              title="選手・チーム・コース・タイヤ・用語の横断検索 (Ctrl+K)"
            >
              <span className="text-xs text-sky-400">🔍</span>
              <span className="hidden sm:inline">検索</span>
              <kbd className="hidden lg:inline-flex items-center px-1.5 py-0.2 rounded bg-black/40 text-[9px] text-slate-400 font-mono border border-white/10 ml-0.5">
                Ctrl K
              </kbd>
            </button>

            {/* F1 Quiz Button */}
            <button
              type="button"
              onClick={() => setQuizModalOpen(true)}
              className="btn-console"
              title="対話型F1クイズ＆トリビア検定"
            >
              <span className="text-amber-400">🏆</span>
              <span className="hidden sm:inline">クイズ</span>
            </button>

            {/* AI Strategist Toggle Button (Desktop & Tablet) */}
            <button
              type="button"
              onClick={() => setAiDrawerOpen((v) => !v)}
              className={`hidden md:inline-flex btn-console shrink-0 ${
                aiDrawerOpen
                  ? 'bg-red-600/20 text-white border-red-500/50 shadow-sm'
                  : ''
              }`}
              title="AIチーフレースストラテジスト"
            >
              <span className={aiDrawerOpen ? 'text-red-400' : 'text-slate-400'}>🤖</span>
              <span className="hidden lg:inline">AI</span>
            </button>

            {/* Auth Button */}
            <AuthButton
              onOpenAuthModal={() => handleRequireAuth()}
              onOpenUpgradeModal={() => setProModalOpen(true)}
            />
          </div>
        </div>

        {/* ── Sub-Header: ONLY shown in Library Mode (Clean horizontal pills) ── */}
        {appMode === 'library' && (
          <div className="h-10 border-t border-white/10 bg-slate-950/90 px-3 sm:px-4 flex items-center justify-between overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-1 w-full max-w-5xl mx-auto py-0.5">
              {(
                [
                  ['drivers', '👤', '選手名鑑'],
                  ['teams', '🏎️', 'チーム名鑑'],
                  ['circuits', '🏁', 'コース解説'],
                  ['tyres', '🛞', 'タイヤ大百科'],
                  ['strategy', '⏱️', '戦略・作戦室'],
                  ['rules', '⚖️', '規定・用語集'],
                  ['drama', '🎬', 'ドラマ・名場面'],
                  ['history', '🏛️', '歴史アーカイブ'],
                ] as [SubTab, string, string][]
              ).map(([tab, icon, label]) => {
                const isActive = librarySubTab === tab || (tab === 'rules' && (librarySubTab === 'rules' || librarySubTab === 'glossary' || librarySubTab === 'regulations'));
                return (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => {
                      setLibrarySubTab(tab);
                      desktopScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
                      mobileScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-racing font-bold transition-all flex items-center gap-1.5 shrink-0 whitespace-nowrap cursor-pointer ${
                      isActive
                        ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md shadow-red-950/40 border border-red-500/40'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                    }`}
                  >
                    <span>{icon}</span>
                    <span>{label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Sub-Header: ONLY shown in Telemetry Hub (Clean horizontal workspace pills) ── */}
        {appMode === 'season' && activeHub === 'telemetry' && (
          <div className="h-10 border-t border-white/10 bg-slate-950/90 px-3 sm:px-4 flex items-center justify-between overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-1 w-full max-w-5xl mx-auto py-0.5">
              {(
                [
                  ['pace', '📈', 'ペース・順位'],
                  ['car_data', '⚡', 'コックピット解析'],
                  ['strategy', '🛞', 'タイヤ戦略・ピット'],
                  ['radio', '📻', 'チーム無線・審理'],
                  ['laptable', '📋', '周回データシート'],
                ] as [TelemetrySubTab, string, string][]
              ).map(([tab, icon, label]) => {
                const isActive = telemetrySubTab === tab;
                return (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => {
                      setTelemetrySubTab(tab);
                      desktopScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
                      mobileScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-racing font-bold transition-all flex items-center gap-1.5 shrink-0 whitespace-nowrap cursor-pointer ${
                      isActive
                        ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md shadow-red-950/40 border border-red-500/40'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                    }`}
                  >
                    <span>{icon}</span>
                    <span>{label}</span>
                  </button>
                );
              })}
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
            <aside className="relative z-50 w-72 bg-slate-900 border-r border-white/10 p-4 overflow-y-auto h-full flex flex-col">
              <div className="flex items-center justify-between mb-3 pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-red-600 rounded flex items-center justify-center font-racing text-white text-xs font-black">
                    P1
                  </div>
                  <span className="text-xs font-racing text-white tracking-widest font-bold">PADOROKU MENU</span>
                </div>
                <button onClick={() => setSidebarOpen(false)} className="text-slate-400 hover:text-white text-lg p-1 cursor-pointer">✕</button>
              </div>

              {/* Quick Tools Navigation */}
              <div className="mb-4 space-y-1.5">
                <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider px-1">各種機能・ツール</span>
                <div className="grid grid-cols-1 gap-1.5">
                  <button
                    onClick={() => {
                      setSidebarOpen(false);
                      setFeatureDirectoryOpen(true);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl bg-red-950/40 hover:bg-red-900/60 border border-red-500/30 text-red-200 text-xs font-racing font-bold text-left transition-all cursor-pointer"
                  >
                    <span className="text-base">🧭</span>
                    <div>
                      <div>全機能マップ ＆ レビューガイド</div>
                      <div className="text-[10px] text-red-400 font-normal">全機能への直通ジャンプと解説</div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setSidebarOpen(false);
                      setQuizModalOpen(true);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl bg-purple-950/40 hover:bg-purple-900/60 border border-purple-500/30 text-purple-200 text-xs font-racing font-bold text-left transition-all cursor-pointer"
                  >
                    <span className="text-base">🏆</span>
                    <div>
                      <div>F1 クイズ＆トリビア検定</div>
                      <div className="text-[10px] text-purple-400 font-normal">全4難易度・対話型クイズ</div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setSidebarOpen(false);
                      setGlobalSearchOpen(true);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-sky-500/30 text-sky-200 text-xs font-racing font-bold text-left transition-all cursor-pointer"
                  >
                    <span className="text-base">🔍</span>
                    <div>
                      <div>総合検索 (Ctrl+K)</div>
                      <div className="text-[10px] text-slate-400 font-normal">選手・チーム・コース・用語</div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setSidebarOpen(false);
                      setQuickGlossaryOpen(true);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-500/30 text-emerald-200 text-xs font-racing font-bold text-left transition-all cursor-pointer"
                  >
                    <span className="text-base">📖</span>
                    <div>
                      <div>レース観戦用語辞典</div>
                      <div className="text-[10px] text-emerald-400 font-normal">アンダーカット、DRSなど</div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setSidebarOpen(false);
                      setAiDrawerOpen(true);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl bg-blue-950/40 hover:bg-blue-900/60 border border-blue-500/30 text-blue-200 text-xs font-racing font-bold text-left transition-all cursor-pointer"
                  >
                    <span className="text-base">🤖</span>
                    <div>
                      <div>AI 戦略アナリスト</div>
                      <div className="text-[10px] text-blue-400 font-normal">AIレース分析・ピット戦略</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Race Settings divider & content */}
              <div className="pt-2 border-t border-white/10">
                <div className="mb-2">
                  <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider px-1">RACE & TELEMETRY SETTINGS</span>
                </div>
                {sidebarContent}
              </div>
            </aside>
          </div>
        )}

        {/* Tab content (with generous bottom padding so fixed navigation doesn't hide content) */}
        <div ref={mobileScrollRef} className="flex-1 min-h-0 overflow-y-auto p-4 pb-[calc(7.5rem+env(safe-area-inset-bottom))] md:pb-6">
          {mainHubContent}

          {/* Global App Footer with Legal Disclaimer & Quick Links */}
          <footer className="mt-12 pt-8 pb-4 border-t border-white/10 text-center text-xs font-mono text-slate-500 space-y-2.5">
            <div className="flex flex-wrap items-center justify-center gap-3 text-slate-400 font-racing text-xs">
              <span className="text-slate-300">🏎️ F1 PADOROKU TELEMETRY PORTAL</span>
              <span className="text-slate-600">•</span>
              <button
                type="button"
                onClick={() => setProModalOpen(true)}
                className="text-amber-400 hover:underline cursor-pointer"
              >
                Pitwall Pro (¥300/月)
              </button>
              <span className="text-slate-600">•</span>
              <button
                type="button"
                onClick={() => setQuizModalOpen(true)}
                className="hover:text-white transition-colors cursor-pointer"
              >
                F1クイズ検定
              </button>
              <span className="text-slate-600">•</span>
              <button
                type="button"
                onClick={() => setFeatureDirectoryOpen(true)}
                className="hover:text-white transition-colors cursor-pointer"
              >
                全機能目次
              </button>
            </div>
            <p className="text-[11px] max-w-2xl mx-auto leading-relaxed text-slate-400">
              ※ 当サイトは非公式ファン分析ポータルであり、FIA（国際自動車連盟）またはFormula Oneグループ各社（Formula One Licensing B.V.等）とは提携・公認関係にありません。
              Formula 1, F1, GRAND PRIX および関連するマークは、Formula One Licensing B.V. の登録商標です。
            </p>
            <p className="text-[10px] text-slate-400">
              © 2026 F1 Padoroku Telemetry Portal. All rights reserved.
            </p>
          </footer>
        </div>

        {/* ── Fixed Mobile Bottom Navigation Bar (< md) ── */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-black/90 backdrop-blur-md border-t border-white/10 flex items-center justify-around safe-bottom shadow-[0_-4px_20px_rgba(0,0,0,0.5)] overflow-x-auto no-scrollbar">
          {appMode === 'season' ? (
            (
              [
                ['season',    <Flag key="s" className="w-5 h-5" />, 'SEASON'],
                ['telemetry', <Activity key="t" className="w-5 h-5" />, 'TELEMETRY'],
                ['simulator', <Gamepad2 key="sim" className="w-5 h-5" />, 'PITWALL'],
                ['news',      <Newspaper key="n" className="w-5 h-5" />, 'NEWS'],
                ['ai',        <span key="a" className="text-xl leading-none">🤖</span>, 'AI'],
              ] as [string, React.ReactNode, string][]
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
                ['strategy', '⏱️', '作戦室'],
                ['rules',    '⚖️', '規定用語'],
                ['drama',    '🎬', 'ドラマ'],
                ['history',  '🏛️', '歴史'],
              ] as [SubTab, string, string][]
            ).map(([subTab, icon, label]) => {
              const isActive = activeHub === 'knowledge' && (librarySubTab === subTab || (subTab === 'rules' && (librarySubTab === 'rules' || librarySubTab === 'glossary' || librarySubTab === 'regulations'))) && !aiDrawerOpen;

              return (
                <button
                  key={subTab}
                  onClick={() => {
                    setActiveHub('knowledge');
                    setLibrarySubTab(subTab);
                    if (aiDrawerOpen) setAiDrawerOpen(false);
                  }}
                  className={`flex-1 min-w-[50px] shrink-0 flex flex-col items-center py-2 px-1 gap-0.5 text-xs transition-all relative ${
                    isActive
                      ? 'text-sky-400 font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span className={`text-base transition-transform ${isActive ? 'scale-110' : ''}`}>{icon}</span>
                  <span className="text-[9px] tracking-tight whitespace-nowrap">{label}</span>
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
        initialQuery={quickGlossaryQuery}
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

      {/* ── Feature Directory & Review Guide Modal ── */}
      <FeatureDirectoryModal
        isOpen={featureDirectoryOpen}
        onClose={() => setFeatureDirectoryOpen(false)}
        onSelectFeature={handleFeatureJump}
      />

      {/* ── Standard App Global Navigation Drawer (☰ 横棒三本メニュー) ── */}
      <AppNavigationDrawer
        isOpen={navigationDrawerOpen}
        onClose={() => setNavigationDrawerOpen(false)}
        activeHub={activeHub}
        appMode={appMode}
        librarySubTab={librarySubTab}
        detailedTelemetryTab={detailedTelemetryTab}
        pitStrategyViewMode={pitStrategyViewMode}
        onSelectFeature={handleFeatureJump}
        onOpenAuthModal={() => handleRequireAuth()}
        onOpenUpgradeModal={() => setProModalOpen(true)}
      />

      {/* ── PC AI Telemetry Inspector Modal (Independent Sandbox) ── */}
      <AITelemetryInspectorModal
        isOpen={aiInspectorState.isOpen}
        onClose={() => setAiInspectorState(prev => ({ ...prev, isOpen: false }))}
        circuitId={aiInspectorState.circuitId}
        driver1Code={aiInspectorState.driver1Code}
        driver2Code={aiInspectorState.driver2Code}
        lapNumber={aiInspectorState.lapNumber}
        insightNotes={aiInspectorState.insightNotes}
        onApplyToMain={({ circuitId, driver1Code, driver2Code }) => {
          setAppMode('season');
          setActiveHub('telemetry');
          setDetailedTelemetryParams({
            circuitId,
            driver1: driver1Code,
            driver2: driver2Code,
          });
          setTimeout(() => {
            document.getElementById('detailed-telemetry-section')?.scrollIntoView({ behavior: 'smooth' });
          }, 150);
        }}
      />

      {/* ── Pitwall Pro Membership & Upgrade Modal ── */}
      <PitwallProModal
        isOpen={proModalOpen}
        onClose={() => setProModalOpen(false)}
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
