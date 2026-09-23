'use client';

/**
 * components/hubs/RaceSimulatorHub.tsx
 * 🏎️ World-Class F1 Pitwall Strategy Command Room & Tactical Game Hub
 *
 * Features:
 * 1. 🎯 CHALLENGE (実践司令塔ゲーム):
 *    - 3 Game Modes: Sprint Race (15-19 laps), Crisis Moments (5-8 laps), Procedural Infinite Crisis
 *    - All 24 Official Grand Prix Circuits & Full 11-Team / 22-Driver Roster
 *    - Pro Pitwall Multi-Monitor Console:
 *      [M1] Timing & Pit Exit Window Traffic Radar (Clean Air vs Traffic)
 *      [M2] Car Telemetry & Dual-Layer Tyre Thermals (Surface vs Core, Graining/Blistering, ERS SOC%)
 *      [M3] Weather Doppler Radar & Tyre Crossover Predictor (Slick / Inter / Wet threshold)
 *      [M4] Team Strategy & Teammate Dynamics (Double-stack penalty detection, Team Orders)
 *      [M5] Interactive Driver Radio Comms (Transceiver Beep audio & Decision Dialogues)
 *    - AI 100-Point 4-Axis Tactical Scoring Engine (Pit Timing, Traffic, Thermals, Teamwork)
 *    - Seamless 1-Click Pedagogical Linking to F1 Library & Glossary
 * 2. 🏎️ SANDBOX GP SIM (自由模擬レース)
 * 3. ⏱️ WAR ROOM (作戦司令室)
 * 4. ⚡ 2026 LAB (次世代レギュレーション研究室)
 */

import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import {
  Play,
  Pause,
  Radio,
  Gamepad2,
  Trophy,
  Flag,
  ShieldAlert,
  Volume2,
  VolumeX,
  BookOpen,
  Award,
  Settings,
  ArrowLeft,
} from 'lucide-react';
import {
  F1_BADGES_CATALOG,
  diagnoseStrategistProfile,
  loadStrategistCareer,
  saveStrategistCareer,
  type DiagnosticResult,
  type SavedCareerData,
  type F1Badge,
  type BadgeCategory,
} from '@/lib/raceDebriefAnalysis';
import {
  PRESET_CHALLENGES,
  MISSION_CHALLENGES,
  rerollScenarioWeather,
  generateSandboxScenario,
  calculatePitExitTraffic,
  runFullGrandPrixSimulation,
  formatTimeSeconds,
  playF1RadioChirp,
  generateSprintRaceScenario,
  generateProceduralScenario,
  evaluateTacticalScore,
  type DriverSimConfig,
  type TyreCompound,
  type EnginePUMode,
  type SimSnapshot,
  type PlayerTacticalCommand,
  type ChallengeScenario,
  type TacticalScoreBreakdown,
  type TeamOrderType,
  type IncidentFrequency,
  type WeatherType,
  type DriverRadioOption,
} from '@/lib/raceSimulationEngine';
import {
  ensureAudioContextResumed,
  playBoxBoxCall,
  playF1IncomingRadioChirp,
  playF1OutgoingRadioBeep,
} from '@/lib/radioAudioEffect';
import { GLOSSARY_TERMS, type GlossaryTerm } from '@/data/f1GlossaryData';
import { getGeminiAuthHeaders } from '@/lib/apiKeyService';
import { usePlanTier } from '@/lib/tierService';
import { getUserPreferences, saveUserPreferences } from '@/lib/userPreferences';
import { getUserTitle } from '@/data/userTitlesData';


import type {
  PitwallMonitor,
  GameMajorCategory,
  ChallengeModeType,
  SimulatorPhase,
  MobileConsoleView,
  TacticalTimelineEvent,
  RivalIntelReport,
  RaceSimulatorHubProps,
  BriefingHelpTopic,
} from './race-simulator/types';
import {
  BadgeDetailModal,
  StrategistCareerModal,
  IntelGlossaryModal,
  FullScreenCockpitOverlay,
  TimingTowerPanel,
  CockpitHudDeck,
  TrackMapAndWeatherDeck,
  TacticalDataDeckPanel,
  TacticalCommandsPanel,
  ModeSelectScreen,
  BriefingScreen,
  DebriefScreen,
} from './race-simulator';

export type { SimulatorPhase, TacticalTimelineEvent, RivalIntelReport };

export default function RaceSimulatorHub({
  onOpenUpgradeModal,
  onNavigateToLibrary,
  onOpenAiStrategist,
  standaloneMode = false,
  onReturnToPortal,
}: RaceSimulatorHubProps) {
  const { isPro } = usePlanTier();
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Full-Screen Pitwall Cockpit Mode (全画面司令塔モード: デフォルトはフルコンソール表示)
  const [isFullScreenCockpit, setIsFullScreenCockpit] = useState<boolean>(false);
  const [selectedCarCode, setSelectedCarCode] = useState<string | null>(null);

  // AI Strategist Difficulty & Incident Risk Tuning
  const [aiDifficulty, setAiDifficulty] = useState<'beginner' | 'standard' | 'master'>('standard');
  const [incidentRiskMultiplier, setIncidentRiskMultiplier] = useState<number>(1.0);

  // Pre-Race Initial Strategy & Setup State
  const [customStartingTyre, setCustomStartingTyre] = useState<TyreCompound | null>(null);
  const [customInitialPuMode, setCustomInitialPuMode] = useState<EnginePUMode | null>(null);
  const [customTargetBoxLap, setCustomTargetBoxLap] = useState<number | null>(null);
  const [customTargetCompound, setCustomTargetCompound] = useState<TyreCompound | null>(null);
  const [isBriefingOpen, setIsBriefingOpen] = useState<boolean>(false);
  const [briefingHelpTopic, setBriefingHelpTopic] = useState<BriefingHelpTopic | null>(null);

  // Audio Sound Effect Mute State (Default: Sound ON as requested by user)
  const [radioAudioEnabled, setRadioAudioEnabled] = useState<boolean>(true);

  // Strategist User Title & Aura
  const [equippedTitleId, setEquippedTitleId] = useState<string>('rookie_tactician');
  useEffect(() => {
    const prefs = getUserPreferences();
    if (prefs.equippedTitleId) {
      setEquippedTitleId(prefs.equippedTitleId);
    }
  }, []);
  const equippedTitle = useMemo(() => getUserTitle(equippedTitleId), [equippedTitleId]);

  // Race Length / Physics Mode: Defaults to authentic 1.0x real physics ('gp_full_100') or 'sprint'
  const [raceLengthMode, setRaceLengthMode] = useState<'gp_short_25' | 'gp_full_100' | 'sprint'>('gp_full_100');

  // ════════════════════════════════════════════════════════════════════════════
  // 🎯 CHALLENGE GAME MODE STATE
  // ════════════════════════════════════════════════════════════════════════════
  const [gameMode, setGameMode] = useState<ChallengeModeType>('crisis');
  const [selectedCircuitId, setSelectedCircuitId] = useState<string>('suzuka');
  const [selectedPlayerCode, setSelectedPlayerCode] = useState<string>('TSU');
  const [selectedCarPackageId, setSelectedCarPackageId] = useState<string>('standard');

  // Active scenario state
  const [majorCategory, setMajorCategory] = useState<GameMajorCategory>('battle');
  const [presetIdx, setPresetIdx] = useState<number>(0);
  const [selectedMissionIdx, setSelectedMissionIdx] = useState<number>(0);
  const [customScenario, setCustomScenario] = useState<ChallengeScenario | null>(null);
  const [isScenarioPickerOpen, setIsScenarioPickerOpen] = useState<boolean>(false);
  const [isScenarioDrawerOpen, setIsScenarioDrawerOpen] = useState<boolean>(false);
  const [mobileConsoleView, setMobileConsoleView] = useState<MobileConsoleView>('integrated');
  const [sandboxLaps, setSandboxLaps] = useState<number>(10);
  const [sandboxWeather, setSandboxWeather] = useState<WeatherType>('dry');
  const [sandboxRainLap, setSandboxRainLap] = useState<number>(4);
  const [sandboxRainIntensity, setSandboxRainIntensity] = useState<number>(2.5);
  const [sandboxIncidentFreq, setSandboxIncidentFreq] = useState<IncidentFrequency>('realistic');
  const [weatherRerollNotification, setWeatherRerollNotification] = useState<string | null>(null);

  const activeScenario = useMemo<ChallengeScenario>(() => {
    if (customScenario) return customScenario;
    return PRESET_CHALLENGES[presetIdx] || PRESET_CHALLENGES[0];
  }, [customScenario, presetIdx]);

  // Automatically align race simulation physics with scenario type:
  // Sprint scenarios use 'sprint', while mid-race takeover scenarios use authentic 1.0x real physics ('gp_full_100').
  useEffect(() => {
    if (activeScenario.gameMode === 'sprint') {
      setRaceLengthMode('sprint');
    } else {
      setRaceLengthMode('gp_full_100');
    }
  }, [activeScenario.gameMode]);

  // 4-Stage Game Cycle Phase: mode_select -> briefing -> race -> debrief
  const [simulatorPhase, setSimulatorPhase] = useState<SimulatorPhase>('mode_select');

  // Current simulation progression
  const [challengeLap, setChallengeLap] = useState<number>(1);
  const [challengePlaying, setChallengePlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1); // 0.5x, 1x, 2x, 5x
  const resumedLapsRef = useRef<Set<number>>(new Set());
  const [userAssistLevel, setUserAssistLevel] = useState<'assisted' | 'expert'>('assisted');
  const [currentProgressPct, setCurrentProgressPct] = useState<number>(0);
  const [lapTimeRemainingMs, setLapTimeRemainingMs] = useState<number>(5500);
  const [isRaceFinished, setIsRaceFinished] = useState<boolean>(false);
  const challengeTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Monitor Deck selection
  const [activeMonitor, setActiveMonitor] = useState<PitwallMonitor>('all');
  const [activeHelpCard, setActiveHelpCard] = useState<'pit_exit' | 'weather' | 'telemetry' | null>(null);
  const [hoveredHelpCard, setHoveredHelpCard] = useState<'pit_exit' | 'weather' | 'telemetry' | null>(null);

  // Player tactical overrides and radio responses
  const [playerTacticalCommands, setPlayerTacticalCommands] = useState<
    Record<number, Partial<PlayerTacticalCommand>>
  >({});
  const [radioResponses, setRadioResponses] = useState<Record<string, string>>({});
  const [nextCompoundChoice, setNextCompoundChoice] = useState<TyreCompound>('INTER');
  const [boxQueuedForNextLap, setBoxQueuedForNextLap] = useState<boolean>(false);
  const [activePuMode, setActivePuMode] = useState<EnginePUMode>('standard');
  const [ersBoostUsedThisLap, setErsBoostUsedThisLap] = useState<boolean>(false);
  const [activeTeamOrder, setActiveTeamOrder] = useState<TeamOrderType>('none');
  const [tacticalEventTimeline, setTacticalEventTimeline] = useState<TacticalTimelineEvent[]>([]);

  // Radio Prompt Tracking (to play audio chirp once per prompt)
  const playedChirpIdsRef = useRef<Set<string>>(new Set());

  // Result & AI Tactical Debrief State
  const [tacticalScore, setTacticalScore] = useState<TacticalScoreBreakdown | null>(null);
  const [selectedIntelTerm, setSelectedIntelTerm] = useState<GlossaryTerm | null>(null);
  const [geminiDebrief, setGeminiDebrief] = useState<string | null>(null);
  const [loadingGeminiDebrief, setLoadingGeminiDebrief] = useState<boolean>(false);

  const [diagnosticResult, setDiagnosticResult] = useState<DiagnosticResult | null>(null);
  const [debriefTab, setDebriefTab] = useState<'score' | 'archetype' | 'badges' | 'knowledge'>('score');
  // SSR-safe initial state to prevent React hydration mismatch between server and client localStorage
  const [careerData, setCareerData] = useState<SavedCareerData>({
    totalCp: 0,
    grade: 'D',
    unlockedBadgeIds: [],
    totalRacesCompleted: 0,
    totalWins: 0,
    highestScore: 0,
  });

  useEffect(() => {
    setCareerData(loadStrategistCareer());
  }, []);

  const [isCareerModalOpen, setIsCareerModalOpen] = useState<boolean>(false);
  const [selectedBadgeForDetail, setSelectedBadgeForDetail] = useState<F1Badge | null>(null);
  const [badgeCategoryFilter, setBadgeCategoryFilter] = useState<'all' | BadgeCategory>('all');
  const [timingTowerMode, setTimingTowerMode] = useState<'gap' | 'int'>('gap');
  const [liveFeedFilter, setLiveFeedFilter] = useState<'all' | 'radio' | 'incident' | 'overtake' | 'broadcast'>('all');
  const [liveFeedExpanded, setLiveFeedExpanded] = useState<boolean>(false);
  const [rivalIntelFilter, setRivalIntelFilter] = useState<
    'all' | 'tyre' | 'telemetry' | 'radio_intercept' | 'ers' | 'pit_stop'
  >('all');
  const [selectedIntelRivalId, setSelectedIntelRivalId] = useState<string | null>(null);
  const [minimizeRadioPrompt, setMinimizeRadioPrompt] = useState<boolean>(false);

  // Synchronize recommended nextCompoundChoice with active scenario context
  useEffect(() => {
    if (activeScenario.id === 'silverstone_drying_gamble') {
      setNextCompoundChoice('MEDIUM');
      return;
    }
    const currentTyre = activeScenario.playerConfig.startTyre;
    if (currentTyre === 'SOFT') setNextCompoundChoice('MEDIUM');
    else if (currentTyre === 'MEDIUM') setNextCompoundChoice('HARD');
    else if (currentTyre === 'HARD') setNextCompoundChoice('MEDIUM');
    else if (currentTyre === 'INTER') {
      setNextCompoundChoice(activeScenario.startWeather === 'monsoon' ? 'WET' : 'MEDIUM');
    } else if (currentTyre === 'WET') {
      setNextCompoundChoice('INTER');
    }
  }, [activeScenario]);

  // Compute effective player config based on pre-race strategy selection
  const effectivePlayerConfig = useMemo<DriverSimConfig>(() => {
    const isCustomTyre = Boolean(customStartingTyre && customStartingTyre !== activeScenario.playerConfig.startTyre);
    return {
      ...activeScenario.playerConfig,
      startTyre: customStartingTyre || activeScenario.playerConfig.startTyre,
      initialTyreAge: isCustomTyre ? 0 : activeScenario.playerConfig.initialTyreAge,
      initialTyreSurfaceTemp: isCustomTyre ? 100 : activeScenario.playerConfig.initialTyreSurfaceTemp,
      initialTyreCoreTemp: isCustomTyre ? 98 : activeScenario.playerConfig.initialTyreCoreTemp,
      machineSetup: {
        ...activeScenario.playerConfig.machineSetup,
        puMode: customInitialPuMode || activeScenario.playerConfig.machineSetup.puMode,
      },
    };
  }, [activeScenario.playerConfig, customStartingTyre, customInitialPuMode]);

  const effectiveTargetBoxLap = useMemo(() => {
    if (effectivePlayerConfig.startTyre === 'INTER' || effectivePlayerConfig.startTyre === 'WET') {
      return Math.max(3, Math.floor(activeScenario.totalLaps * 0.6));
    }
    if (activeScenario.actualRainLap && activeScenario.actualRainLap <= activeScenario.totalLaps) {
      return Math.max(2, activeScenario.actualRainLap);
    }
    return Math.max(3, Math.floor(activeScenario.totalLaps * 0.6));
  }, [activeScenario, effectivePlayerConfig.startTyre]);

  // Player tactical overrides: fully driven by real-time pit wall commands (BOX BOX button or radio prompts).
  // Pre-race scheduled target lap is a tactical reference window, NEVER an unprompted forced pit stop.
  const effectivePlayerTacticalCommands = useMemo(() => {
    return playerTacticalCommands;
  }, [playerTacticalCommands]);

  // Compute snapshots dynamically from engine with AI difficulty & incident risk tuning
  const challengeSnapshots = useMemo<SimSnapshot[]>(() => {
    const rawDrivers = [
      effectivePlayerConfig,
      activeScenario.teammateConfig,
      ...activeScenario.rivals,
    ];
    const seen = new Set<string>();
    const allDrivers: DriverSimConfig[] = [];
    for (const d of rawDrivers) {
      if (!seen.has(d.code)) {
        seen.add(d.code);
        allDrivers.push(d);
      }
    }
    return runFullGrandPrixSimulation({
      circuit: activeScenario.circuit,
      totalLaps: activeScenario.totalLaps,
      drivers: allDrivers,
      weatherType: activeScenario.startWeather === 'dry' ? 'variable' : activeScenario.startWeather,
      rainStartLap: activeScenario.actualRainLap,
      rainIntensityMm: activeScenario.actualRainIntensity,
      incidentFrequency: activeScenario.scProbability > 0.4 ? 'realistic' : 'none',
      scTriggerLap: activeScenario.actualScLap,
      playerOverrides: effectivePlayerTacticalCommands,
      driverRadioResponses: radioResponses,
      aiDifficulty,
      incidentRiskMultiplier,
      raceLengthMode,
      userTitleId: equippedTitleId,
    });
  }, [
    activeScenario,
    effectivePlayerConfig,
    effectivePlayerTacticalCommands,
    radioResponses,
    aiDifficulty,
    incidentRiskMultiplier,
    raceLengthMode,
    equippedTitleId,
  ]);

  // ESC key listener to exit full-screen cockpit mode anytime
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullScreenCockpit) {
        setIsFullScreenCockpit(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullScreenCockpit]);

  const currentSnapshot = useMemo(() => {
    if (!challengeSnapshots.length) return undefined;
    const idx = Math.min(challengeSnapshots.length - 1, Math.max(0, challengeLap - 1));
    return challengeSnapshots[idx];
  }, [challengeSnapshots, challengeLap]);

  const filteredFeed = useMemo(() => {
    const feed = currentSnapshot?.commentaryFeed || [];
    if (liveFeedFilter === 'all') return feed;
    return feed.filter((m) => m.type === liveFeedFilter);
  }, [currentSnapshot?.commentaryFeed, liveFeedFilter]);

  const playerCar = useMemo(() => {
    return currentSnapshot?.cars.find((c) => c.code === activeScenario.playerConfig.code);
  }, [currentSnapshot, activeScenario]);

  const teammateCar = useMemo(() => {
    return currentSnapshot?.cars.find((c) => c.code === activeScenario.teammateConfig.code);
  }, [currentSnapshot, activeScenario]);

  // ── Mission Control Rival Intel Reports (Shared Analytics & Espionage) ──
  const rivalIntelReports = useMemo<RivalIntelReport[]>(() => {
    if (!currentSnapshot || !playerCar) return [];

    const allCars = currentSnapshot.cars;
    const aheadCar = allCars.find((c) => c.position === playerCar.position - 1);
    const behindCar = allCars.find((c) => c.position === playerCar.position + 1);
    const leaderCar = allCars.find((c) => c.position === 1 && c.code !== playerCar.code);
    const pittingCars = allCars.filter((c) => c.isPitting && c.code !== playerCar.code);

    const reports: RivalIntelReport[] = [];

    // 1. Tyre degradation & cliff on direct rival (aheadCar or leaderCar)
    const tyreTarget = aheadCar || leaderCar;
    if (tyreTarget) {
      const degDelta = Math.min(
        1.4,
        Math.max(0.2, (tyreTarget.tyreWearPercent / 100) * 0.9 + (tyreTarget.tyreAge > 15 ? 0.35 : 0.05))
      ).toFixed(2);
      const stPlayer = playerCar.currentSpeedKmH || 328;
      const stTarget = tyreTarget.currentSpeedKmH || 334;
      const deltaSt = stTarget - stPlayer;

      reports.push({
        id: `intel-tyre-${challengeLap}-${tyreTarget.code}`,
        lap: challengeLap,
        priority: tyreTarget.tyreWearPercent >= 60 || tyreTarget.tyreAge >= 16 ? 'high' : 'medium',
        category: 'tyre',
        analystRole: '🛞 タイヤ摩耗監視',
        targetCarCode: tyreTarget.code,
        targetCarName: tyreTarget.name,
        targetCarPos: tyreTarget.position,
        targetCarColor: tyreTarget.color,
        headline: '前走車タレ・クリフ監視',
        summary: `${tyreTarget.name}（P${tyreTarget.position}）のラップタイムが直近2周で+${degDelta}秒悪化。セクター2でリアがスライドしています。なおストレート最高速は相手が依然+${Math.max(3, deltaSt)}km/h優勢です。`,
        confidence: tyreTarget.tyreWearPercent >= 65 ? 'high' : 'verified',
        confidenceLabel: tyreTarget.tyreWearPercent >= 65 ? '確度 92%' : '確度 96%',
        rawTelemetry: {
          lapTimes: [
            `L${Math.max(1, challengeLap - 1)}: ${formatTimeSeconds(tyreTarget.lapTime - parseFloat(degDelta))}`,
            `L${challengeLap}: ${formatTimeSeconds(tyreTarget.lapTime)} (+${degDelta}s)`,
          ],
          speedTrapKmh: stTarget,
          playerDeltaSpeedKmh: deltaSt,
          tyreCompound: tyreTarget.tyreCompound,
          tyreAge: tyreTarget.tyreAge,
          tyreWearPercent: tyreTarget.tyreWearPercent,
          ersBatterySoc: tyreTarget.ersBatterySoc,
          gapToPlayerSec: playerCar.gapToAhead,
          isAhead: true,
        },
      });
    }

    // 2. Telemetry Speed Trap & Micro-sector analysis
    const telemTarget = aheadCar || behindCar || leaderCar;
    if (telemTarget) {
      const stPlayer = playerCar.currentSpeedKmH || 328;
      const stTarget = telemTarget.currentSpeedKmH || (telemTarget.position < playerCar.position ? 336 : 325);
      const deltaSt = stTarget - stPlayer;

      reports.push({
        id: `intel-telem-${challengeLap}-${telemTarget.code}`,
        lap: challengeLap,
        priority: 'medium',
        category: 'telemetry',
        analystRole: '⚡ 最高速解析',
        targetCarCode: telemTarget.code,
        targetCarName: telemTarget.name,
        targetCarPos: telemTarget.position,
        targetCarColor: telemTarget.color,
        headline: '最高速＆マイクロセクター',
        summary: `${telemTarget.code}とのスピードトラップ比較: 相手${stTarget}km/h vs 自車${stPlayer}km/h (${deltaSt >= 0 ? '+' : ''}${deltaSt}km/h)。相手は高速コーナー脱出が強力ですが、シケインの進入で約0.15秒ロスしています。`,
        confidence: 'verified',
        confidenceLabel: '確度 100%',
        rawTelemetry: {
          lapTimes: [`L${challengeLap}: ${formatTimeSeconds(telemTarget.lapTime)}`],
          speedTrapKmh: stTarget,
          playerDeltaSpeedKmh: deltaSt,
          tyreCompound: telemTarget.tyreCompound,
          tyreAge: telemTarget.tyreAge,
          tyreWearPercent: telemTarget.tyreWearPercent,
          ersBatterySoc: telemTarget.ersBatterySoc,
          gapToPlayerSec: telemTarget.position < playerCar.position ? playerCar.gapToAhead : (behindCar?.gapToAhead || 1.8),
          isAhead: telemTarget.position < playerCar.position,
        },
      });
    }

    // 3. Radio Intercept & Bluff Detection
    const radioTarget = aheadCar || leaderCar || behindCar;
    if (radioTarget) {
      const isBluffTrigger = challengeLap % 3 === 0 && radioTarget.position <= 3;
      if (isBluffTrigger) {
        reports.push({
          id: `intel-radio-bluff-${challengeLap}-${radioTarget.code}`,
          lap: challengeLap,
          priority: 'high',
          category: 'radio_intercept',
          analystRole: '📻 敵無線傍受',
          targetCarCode: radioTarget.code,
          targetCarName: radioTarget.name,
          targetCarPos: radioTarget.position,
          targetCarColor: radioTarget.color,
          headline: '敵ピット無線傍受（ブラフ疑い）',
          summary: `${radioTarget.code}に『Box to overtake, box now』の指示を傍受。…しかしピットクルーがガレージから出てきていません。我々を先にピットインさせるダミー無線の疑いがあります。`,
          confidence: 'suspect_bluff',
          confidenceLabel: 'ブラフ疑い 55%',
          rawTelemetry: {
            lapTimes: [`L${challengeLap}: ${formatTimeSeconds(radioTarget.lapTime)}`],
            speedTrapKmh: radioTarget.currentSpeedKmH || 335,
            playerDeltaSpeedKmh: (radioTarget.currentSpeedKmH || 335) - (playerCar.currentSpeedKmH || 328),
            tyreCompound: radioTarget.tyreCompound,
            tyreAge: radioTarget.tyreAge,
            tyreWearPercent: radioTarget.tyreWearPercent,
            ersBatterySoc: radioTarget.ersBatterySoc,
            gapToPlayerSec: radioTarget.position < playerCar.position ? playerCar.gapToAhead : 2.0,
            isAhead: radioTarget.position < playerCar.position,
          },
        });
      } else {
        reports.push({
          id: `intel-radio-comm-${challengeLap}-${radioTarget.code}`,
          lap: challengeLap,
          priority: 'medium',
          category: 'radio_intercept',
          analystRole: '📻 敵無線傍受',
          targetCarCode: radioTarget.code,
          targetCarName: radioTarget.name,
          targetCarPos: radioTarget.position,
          targetCarColor: radioTarget.color,
          headline: '敵ドライバー無線傍受',
          summary: `${radioTarget.code}『フロント左が完全に死んだ！アンダーステアが酷くて曲がれない』と絶叫。フロントタイヤの摩耗限界が近いと推測されます。`,
          confidence: 'high',
          confidenceLabel: '確度 90%',
          rawTelemetry: {
            lapTimes: [`L${challengeLap}: ${formatTimeSeconds(radioTarget.lapTime)}`],
            speedTrapKmh: radioTarget.currentSpeedKmH || 333,
            playerDeltaSpeedKmh: (radioTarget.currentSpeedKmH || 333) - (playerCar.currentSpeedKmH || 328),
            tyreCompound: radioTarget.tyreCompound,
            tyreAge: radioTarget.tyreAge,
            tyreWearPercent: radioTarget.tyreWearPercent,
            ersBatterySoc: radioTarget.ersBatterySoc,
            gapToPlayerSec: radioTarget.position < playerCar.position ? playerCar.gapToAhead : 2.0,
            isAhead: radioTarget.position < playerCar.position,
          },
        });
      }
    }

    // 4. ERS & Clipping Monitor
    const ersTarget = aheadCar || behindCar;
    if (ersTarget) {
      const isAhead = ersTarget.position < playerCar.position;
      reports.push({
        id: `intel-ers-${challengeLap}-${ersTarget.code}`,
        lap: challengeLap,
        priority: 'medium',
        category: 'ers',
        analystRole: '🔋 ERS電力監視',
        targetCarCode: ersTarget.code,
        targetCarName: ersTarget.name,
        targetCarPos: ersTarget.position,
        targetCarColor: ersTarget.color,
        headline: 'クリッピング・電力監視',
        summary: isAhead
          ? `${ersTarget.code}のGPS加速度トレースを解析。メインストレート手前140mで加速が頭打ち（クリッピング発生）。バッテリー残量25%以下と推定されます。`
          : `後続${ersTarget.code}がチャージモードに切り替え。バッテリー残量低下のため、今周のストレートでの仕掛けは困難とみられます。`,
        confidence: 'high',
        confidenceLabel: '確度 88%',
        rawTelemetry: {
          lapTimes: [`L${challengeLap}: ${formatTimeSeconds(ersTarget.lapTime)}`],
          speedTrapKmh: ersTarget.currentSpeedKmH || 331,
          playerDeltaSpeedKmh: (ersTarget.currentSpeedKmH || 331) - (playerCar.currentSpeedKmH || 328),
          tyreCompound: ersTarget.tyreCompound,
          tyreAge: ersTarget.tyreAge,
          tyreWearPercent: ersTarget.tyreWearPercent,
          ersBatterySoc: ersTarget.ersBatterySoc,
          gapToPlayerSec: isAhead ? playerCar.gapToAhead : (behindCar?.gapToAhead || 2.2),
          isAhead,
        },
      });
    }

    // 5. Pit Stop Execution (if any car is pitting or pitted)
    if (pittingCars.length > 0) {
      const pitTarget = pittingCars[0];
      const stopDuration = pitTarget.pitStopDuration
        ? pitTarget.pitStopDuration.toFixed(1)
        : (2.1 + (challengeLap % 2 === 0 ? 0.2 : 1.7)).toFixed(1);
      const isQuick = parseFloat(stopDuration) <= 2.5;

      reports.push({
        id: `intel-pit-${challengeLap}-${pitTarget.code}`,
        lap: challengeLap,
        priority: 'high',
        category: 'pit_stop',
        analystRole: '⏱️ ピット作業速報',
        targetCarCode: pitTarget.code,
        targetCarName: pitTarget.name,
        targetCarPos: pitTarget.position,
        targetCarColor: pitTarget.color,
        headline: 'ライバルピット作業速報',
        summary: isQuick
          ? `${pitTarget.team}（${pitTarget.code}）の静止作業時間は${stopDuration}秒！電光石火の好作業です。アウトラップペースは1分24秒台を刻む見込み。`
          : `${pitTarget.team}（${pitTarget.code}）のピットで左リア交換に手間取り作業時間${stopDuration}秒のタイムロス。コース復帰位置はトラフィックの中です。`,
        confidence: 'verified',
        confidenceLabel: '確定 100%',
        rawTelemetry: {
          lapTimes: [`Pit Lap ${challengeLap}`],
          speedTrapKmh: 80,
          playerDeltaSpeedKmh: -248,
          tyreCompound: pitTarget.tyreCompound,
          tyreAge: 0,
          tyreWearPercent: 0,
          ersBatterySoc: pitTarget.ersBatterySoc,
          pitStopDuration: parseFloat(stopDuration),
          gapToPlayerSec: Math.abs(playerCar.gapToLeader - pitTarget.gapToLeader),
          isAhead: pitTarget.position < playerCar.position,
        },
      });
    }

    return reports;
  }, [currentSnapshot, playerCar, challengeLap]);

  const filteredRivalIntel = useMemo(() => {
    if (rivalIntelFilter === 'all') return rivalIntelReports;
    return rivalIntelReports.filter((r) => r.category === rivalIntelFilter);
  }, [rivalIntelReports, rivalIntelFilter]);

  // Traffic Exit window calculation
  const pitExitTraffic = useMemo(() => {
    if (!currentSnapshot) {
      return {
        predictedExitPosition: 1,
        gapAheadSeconds: 0,
        gapBehindSeconds: 0,
        trafficStatus: 'CLEAN_AIR' as const,
        pitLossSeconds: 22.0,
      };
    }
    return calculatePitExitTraffic(
      currentSnapshot.cars,
      activeScenario.playerConfig.code,
      activeScenario.circuit,
      currentSnapshot.isSC
    );
  }, [currentSnapshot, activeScenario]);

  // Check for incoming radio prompt or new team radio feed messages and play F1 radio chirp
  useEffect(() => {
    if (!currentSnapshot || !radioAudioEnabled) return;

    if (currentSnapshot.activeRadioPrompt) {
      const promptId = currentSnapshot.activeRadioPrompt.id;
      if (!playedChirpIdsRef.current.has(promptId)) {
        playedChirpIdsRef.current.add(promptId);
        ensureAudioContextResumed();
        playF1IncomingRadioChirp();
      }
    }

    if (currentSnapshot.commentaryFeed && currentSnapshot.commentaryFeed.length > 0) {
      const latestRadio = currentSnapshot.commentaryFeed.find((m) => m.type === 'radio');
      if (latestRadio && !playedChirpIdsRef.current.has(latestRadio.id)) {
        playedChirpIdsRef.current.add(latestRadio.id);
        ensureAudioContextResumed();
        playF1IncomingRadioChirp();
      }
    }
  }, [currentSnapshot, radioAudioEnabled]);

  // Pacing interval based on speed:
  // 1x is realistic 1:1 Grand Prix lap time (e.g. 90s for Suzuka, 85s for Melbourne, 104s for Spa)
  // 0.5x: 180s / lap (長考・詳細分析)
  // 1x: baseLapTime (約80〜95秒 / lap, 現実実走スピード)
  // 2x: 約45秒 / lap
  // 5x: 約18秒 / lap
  // 10x: 約9秒 / lap
  // 20x: 約4.5秒 / lap (高速シミュレーション)
  const currentIntervalMs = useMemo(() => {
    const rawBaseSec = activeScenario.circuit.baseLapTime || 90.0;
    const baseLapSec = currentSnapshot?.isSC ? rawBaseSec * 1.42 : rawBaseSec;
    return Math.round((baseLapSec * 1000) / playbackSpeed);
  }, [activeScenario.circuit.baseLapTime, playbackSpeed, currentSnapshot?.isSC]);


  // Reset progress to 0 on new lap start and clear completed pit queue
  useEffect(() => {
    setCurrentProgressPct(0);
    if (challengeLap > 1) {
      const prevLapSnapshot = challengeSnapshots[challengeLap - 2];
      const playerWasPitting = prevLapSnapshot?.cars.find((c) => c.code === activeScenario.playerConfig.code)?.isPitting;
      if (playerWasPitting || !playerTacticalCommands[challengeLap]?.boxNextLap) {
        setBoxQueuedForNextLap(false);
      }
    }
  }, [challengeLap, challengeSnapshots, activeScenario.playerConfig.code, playerTacticalCommands]);

  const lapProgressPct = currentProgressPct;

  // Pit Entry Proximity & Distance Calculation for Tactical Cockpit & BOX BOX button
  const pitProximity = useMemo(() => {
    const circuitLengthM = activeScenario.circuit.circuitLengthM || 5400;
    const baseLapTime = activeScenario.circuit.baseLapTime || 90.0;
    const pitEntryPct = 94.0; // Pit entry is typically at ~94% of the lap
    const playerPct = lapProgressPct;

    let remainingPct = 0;
    if (playerPct <= pitEntryPct) {
      remainingPct = pitEntryPct - playerPct;
    } else {
      remainingPct = (100 - playerPct) + pitEntryPct;
    }

    const distanceMeters = Math.max(0, Math.round((remainingPct / 100) * circuitLengthM));
    const avgSpeedMps = Math.max(30, circuitLengthM / Math.max(60, baseLapTime));
    const secondsToPit = Math.max(0, distanceMeters / avgSpeedMps);

    const isCommitmentZone = distanceMeters < 380;
    const isApproaching = distanceMeters < 1000;
    const isPittingNow = !!playerCar?.isPitting;

    return {
      distanceMeters,
      secondsToPit: secondsToPit.toFixed(1),
      isCommitmentZone,
      isApproaching,
      isPittingNow,
    };
  }, [lapProgressPct, activeScenario.circuit, playerCar?.isPitting]);

  // Player car's real-time pit status and physical track progress
  const playerPitStatus = useMemo(() => {
    const effectiveLapTime = currentSnapshot?.isSC ? Math.max(60, activeScenario.circuit.baseLapTime * 1.42) : Math.max(60, activeScenario.circuit.baseLapTime);
    const pitLossSec = currentSnapshot?.isSC ? 11.5 : 22.0;
    const playerEffectiveGap = playerCar?.isPitting ? Math.max(0, playerCar.gapToLeader - pitLossSec) : (playerCar?.gapToLeader || 0);
    const playerTrackPct = ((lapProgressPct - (playerEffectiveGap / effectiveLapTime) * 100) % 100 + 100) % 100;
    const isPlayerInPit = !!playerCar?.isPitting && (playerTrackPct >= 90.0 || playerTrackPct <= 4.0);
    const isPlayerOut = !!playerCar?.isPitting && (playerTrackPct > 4.0 && playerTrackPct <= 12.0);
    const isPlayerInLap = !!playerCar?.isPitting && (playerTrackPct >= 78.0 && playerTrackPct < 90.0);

    return {
      playerTrackPct,
      isPlayerInPit,
      isPlayerOut,
      isPlayerInLap,
    };
  }, [lapProgressPct, activeScenario.circuit, currentSnapshot?.isSC, playerCar?.isPitting, playerCar?.gapToLeader]);

  // Live intra-lap telemetry physics calculations (dynamic micro-variations based on lapProgressPct and activePuMode)
  const liveTelemetry = useMemo(() => {
    if (!playerCar) return null;
    const currentMode = activePuMode || playerCar.puMode || 'standard';
    const progress = lapProgressPct; // 0 to 100
    const rad = (progress / 100) * Math.PI * 4; // 2 complete cornering/straight cycles per lap

    // Dynamic tyre surface temperature:
    // Corners (lateral load) spike surface temp by +2.5~3.5°C, straights cool down
    const corneringHeat = Math.sin(rad) * 2.8;
    const puModeHeat =
      currentMode === 'push'
        ? 3.5 + (progress / 100) * 2.5
        : currentMode === 'conserve'
        ? -3.0 - (progress / 100) * 1.5
        : 0;

    const baseSurf = playerCar.tyreSurfaceTemp;
    const baseCore = playerCar.tyreCoreTemp;

    // In dirty air behind a rival, front wing loses downforce causing understeer wash and heavy front tyre heating
    const dirtyAirFrontHeat = playerCar.inDirtyAir ? 3.5 : 0;
    const flSurf = Math.round(baseSurf + dirtyAirFrontHeat - 1 + corneringHeat + puModeHeat);
    const frSurf = Math.round(baseSurf + dirtyAirFrontHeat + corneringHeat + puModeHeat);
    const rlSurf = Math.round(baseSurf + 1 + corneringHeat * 0.8 + puModeHeat);
    const rrSurf = Math.round(baseSurf + corneringHeat * 0.8 + puModeHeat);

    // Dynamic brake temp: heavy braking spikes in corners (around 25%, 55%, 85% of lap)
    const brakeSpike = Math.max(0, Math.sin(rad * 1.5)) * 140;
    const liveBrakeTemp = Math.round(
      (playerCar.brakeTemp || 520) +
        brakeSpike -
        (currentMode === 'conserve' ? 60 : 0) +
        (currentMode === 'push' ? 35 : 0)
    );

    // Dynamic ERS SOC: discharges on exit/straights, recharges under braking and during SAVE mode
    const ersOscillation = Math.cos(rad) * 4;
    const puSocDelta =
      currentMode === 'push'
        ? -((progress / 100) * 16) - (ersBoostUsedThisLap ? 12 : 0)
        : currentMode === 'conserve'
        ? +((progress / 100) * 18)
        : 0;
    const liveErsSoc = Math.min(100, Math.max(5, Math.round(playerCar.ersBatterySoc + ersOscillation + puSocDelta)));

    // Dynamic Live Speed (km/h):
    // Replicates corners (~125 km/h) and high-speed straights (~315 km/h)
    const isUnderSC = currentSnapshot?.isSC;
    let baseSpeed = 0;
    if (isUnderSC) {
      baseSpeed = 165 + Math.sin(rad) * 20;
    } else {
      const trackSpeedProfile = 220 + Math.cos(rad) * 95;
      const puSpeedDelta = currentMode === 'push' ? 12 : currentMode === 'conserve' ? -10 : 0;
      const ersSpeedDelta = ersBoostUsedThisLap ? 15 : 0;
      baseSpeed = Math.round(trackSpeedProfile + puSpeedDelta + ersSpeedDelta);
    }
    const liveSpeedKmH = Math.max(80, Math.min(355, Math.round(baseSpeed)));

    // Dynamic Water Depth:
    const baseWater = currentSnapshot?.rainRadar.waterDepthMm ?? 0;
    const isRaining =
      currentSnapshot?.rainRadar.intensity !== 'none' && currentSnapshot?.rainRadar.intensity !== undefined;
    const dryingRate = currentSnapshot?.rainRadar.dryingRateMmPerLap ?? 0.15;
    let liveWater = baseWater;
    if (baseWater > 0) {
      if (isRaining) {
        liveWater = baseWater + (progress / 100) * 0.15;
      } else {
        liveWater = Math.max(0, baseWater - (progress / 100) * (dryingRate * 0.5));
      }
    }

    return {
      tyres: {
        FL: { surf: flSurf, core: baseCore - 1 },
        FR: { surf: frSurf, core: baseCore - 1 },
        RL: { surf: rlSurf, core: baseCore + 2 },
        RR: { surf: rrSurf, core: baseCore + 2 },
      },
      brakeTemp: liveBrakeTemp,
      ersBatterySoc: liveErsSoc,
      waterDepthMm: Number(liveWater.toFixed(1)),
      liveSpeedKmH,
      puMode: currentMode,
      ersDeployStatus: ersBoostUsedThisLap
        ? 'OVERTAKE BOOST (+120kW)'
        : currentMode === 'push'
        ? 'DEPLOY (高出力放電▼)'
        : currentMode === 'conserve'
        ? 'HARVEST (高回生充電▲)'
        : 'BALANCED (均衡 0.0MJ)',
    };
  }, [playerCar, lapProgressPct, currentSnapshot?.rainRadar, currentSnapshot?.isSC, activePuMode, ersBoostUsedThisLap]);

  // Unified Resume / Play handler: single source of truth for resuming playback cleanly
  const handleResumeOrPlay = useCallback(() => {
    ensureAudioContextResumed();
    resumedLapsRef.current.add(challengeLap);

    if (isRaceFinished || challengeLap > activeScenario.totalLaps) {
      resumedLapsRef.current.clear();
      setIsRaceFinished(false);
      setChallengeLap(1);
      setCurrentProgressPct(0);
      setChallengePlaying(true);
    } else {
      setChallengePlaying((prev) => !prev);
    }
  }, [challengeLap, activeScenario.totalLaps, isRaceFinished]);

  // Auto playback loop with high-precision timestamp delta & zero clock drift
  useEffect(() => {
    if (challengePlaying && simulatorPhase === 'race') {
      const stepMs = 30; // 33 FPS continuous smooth progress
      let elapsed = Math.round((currentProgressPct / 100) * currentIntervalMs);
      let lastTime = typeof performance !== 'undefined' ? performance.now() : Date.now();

      const timerId = setInterval(() => {
        const now = typeof performance !== 'undefined' ? performance.now() : Date.now();
        const delta = now - lastTime;
        lastTime = now;
        elapsed += delta;

        if (elapsed >= currentIntervalMs) {
          if (challengeLap >= activeScenario.totalLaps) {
            // Final lap completed! 100% full finish across the S/F line for all cars!
            setCurrentProgressPct(100);
            setLapTimeRemainingMs(0);
            setChallengePlaying(false);
            setIsRaceFinished(true);
          } else {
            // Advance to next lap cleanly
            elapsed = 0;
            setChallengeLap((prev) => prev + 1);
            setLapTimeRemainingMs(currentIntervalMs);
            setCurrentProgressPct(0);
          }
        } else {
          setLapTimeRemainingMs(Math.max(0, currentIntervalMs - elapsed));
          const pct = Math.min(100, Math.max(0, (elapsed / currentIntervalMs) * 100));
          setCurrentProgressPct(pct);
        }
      }, stepMs);

      return () => {
        clearInterval(timerId);
      };
    }
  }, [challengePlaying, simulatorPhase, activeScenario.totalLaps, currentIntervalMs, challengeLap, currentProgressPct]);

  // Evaluate score and diagnose strategist archetype & badges when race completes
  useEffect(() => {
    if (isRaceFinished && challengeSnapshots.length > 0) {
      if (!tacticalScore) {
        const score = evaluateTacticalScore(
          challengeSnapshots,
          activeScenario,
          playerTacticalCommands,
          radioResponses
        );
        setTacticalScore(score);

        const currentCareer = loadStrategistCareer();
        const diagnostic = diagnoseStrategistProfile(
          challengeSnapshots,
          activeScenario,
          playerTacticalCommands,
          radioResponses,
          score,
          currentCareer.unlockedBadgeIds
        );
        setDiagnosticResult(diagnostic);

        const playerCar = challengeSnapshots[challengeSnapshots.length - 1]?.cars.find(
          (c) => c.code === activeScenario.playerConfig.code
        );
        const finalPos = playerCar ? playerCar.position : 99;
        const isWin = finalPos === 1;
        const updatedCareer = saveStrategistCareer(
          diagnostic.totalCpEarnedThisRace,
          diagnostic.unlockedBadgesThisRace.map((b) => b.id),
          score.totalScore,
          isWin,
          diagnostic.archetype.id,
          {
            scenarioId: activeScenario.id,
            finalPos,
            targetPos: activeScenario.targetPosition,
            aiDifficulty,
          }
        );
        setCareerData(updatedCareer);
      }
    } else {
      setTacticalScore(null);
      setDiagnosticResult(null);
    }
  }, [challengeLap, activeScenario, challengeSnapshots, playerTacticalCommands, radioResponses, tacticalScore, aiDifficulty]);

  // Handle player commands
  const handleToggleBoxNextLap = () => {
    const nextState = !boxQueuedForNextLap;
    setBoxQueuedForNextLap(nextState);
    if (radioAudioEnabled) {
      if (nextState) {
        playBoxBoxCall();
      } else {
        playF1OutgoingRadioBeep();
      }
    }
    // If the car has already passed pit entry / commitment zone (>= 90% lap progress),
    // pit stop is scheduled for the NEXT lap (challengeLap + 1), unless it is already the final lap.
    const targetBoxLap = (pitProximity.isCommitmentZone || lapProgressPct >= 90) && challengeLap < activeScenario.totalLaps
      ? challengeLap + 1
      : challengeLap;

    setPlayerTacticalCommands((prev) => ({
      ...prev,
      [targetBoxLap]: {
        ...prev[targetBoxLap],
        boxNextLap: nextState,
        nextCompound: nextCompoundChoice,
      },
    }));

    const currentTimeStr = new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setTacticalEventTimeline((prev) => [
      ...prev,
      {
        id: `box-${challengeLap}-${Date.now()}`,
        lap: challengeLap,
        timestamp: currentTimeStr,
        type: 'pit_stop',
        icon: nextState ? '🛞' : '❌',
        title: nextState ? `BOX 指示 (Lap ${targetBoxLap} ピットイン予定)` : `STAY OUT (ピットキャンセル)`,
        detail: nextState
          ? `Lap ${targetBoxLap} でのピットインを指示。交換予定タイヤ: ${nextCompoundChoice}`
          : `ピットイン指示を取り消し、コース上ステイアウトを選択。`,
      },
    ]);
  };

  const handleCompoundChange = (comp: TyreCompound) => {
    if (radioAudioEnabled) playF1OutgoingRadioBeep();
    setNextCompoundChoice(comp);
    const targetBoxLap = (pitProximity.isCommitmentZone || lapProgressPct >= 90) && challengeLap < activeScenario.totalLaps
      ? challengeLap + 1
      : challengeLap;
    setPlayerTacticalCommands((prev) => {
      const updated = { ...prev };
      if (boxQueuedForNextLap || updated[targetBoxLap]?.boxNextLap) {
        updated[targetBoxLap] = {
          ...updated[targetBoxLap],
          boxNextLap: true,
          nextCompound: comp,
        };
      }
      return updated;
    });

    const currentTimeStr = new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setTacticalEventTimeline((prev) => [
      ...prev,
      {
        id: `comp-${challengeLap}-${Date.now()}`,
        lap: challengeLap,
        timestamp: currentTimeStr,
        type: 'compound',
        icon: '🔄',
        title: `タイヤコンパウンド選択: ${comp}`,
        detail: `次期ピットストップでの装着タイヤを ${comp} に設定。`,
      },
    ]);
  };

  const handlePuModeChange = (mode: EnginePUMode) => {
    if (radioAudioEnabled) playF1OutgoingRadioBeep();
    setActivePuMode(mode);
    // If the race is actively running or already beyond lap 1, applying a mode change to the current in-progress lap
    // would retroactively recalculate that lap's already-elapsed lap time, causing positions to abruptly jump.
    // Therefore, mid-race changes take effect from the upcoming lap (challengeLap + 1).
    // Pre-race or paused at lap 1 before start applies directly to lap 1.
    const targetLap = (challengePlaying || challengeLap > 1)
      ? Math.min(activeScenario.totalLaps, challengeLap + 1)
      : challengeLap;

    if (challengeLap === 1 && !challengePlaying) {
      setCustomInitialPuMode(mode);
    }

    setPlayerTacticalCommands((prev) => {
      const updated = { ...prev };
      // Apply to targetLap AND all subsequent laps until changed!
      for (let l = targetLap; l <= activeScenario.totalLaps; l++) {
        updated[l] = {
          ...updated[l],
          puMode: mode,
        };
      }
      return updated;
    });

    const modeLabels: Record<EnginePUMode, { name: string; desc: string; icon: string }> = {
      push: { name: 'PUSH (全開)', desc: 'ペース最優先。タイヤ摩耗と燃料・バッテリー消費が増大', icon: '⚡' },
      standard: { name: 'STD (標準)', desc: '目標レースデルタを維持する標準マネジメント', icon: '⚖️' },
      conserve: { name: 'SAVE (保護・回生)', desc: 'タイヤ保護・燃料節約・ERSバッテリー回生重視', icon: '🌱' },
    };

    const currentTimeStr = new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setTacticalEventTimeline((prev) => [
      ...prev,
      {
        id: `pu-${challengeLap}-${Date.now()}`,
        lap: challengeLap,
        timestamp: currentTimeStr,
        type: 'pu_mode',
        icon: modeLabels[mode]?.icon || '⚡',
        title: `PUモード切替: ${modeLabels[mode]?.name || mode}`,
        detail: `Lap ${targetLap} 以降: ${modeLabels[mode]?.desc || ''}`,
      },
    ]);
  };

  // ERS Boost eligibility check according to official F1 rules:
  // 1. Must have a car ahead (position > 1)
  // 2. Gap to car ahead <= 1.000s at detection point
  // 3. Not under Safety Car / VSC
  // 4. Lap > 1 (cannot be used on opening lap)
  // 5. Battery SOC >= 15%
  const ersEligibility = useMemo(() => {
    if (!playerCar) {
      return { eligible: false, reason: '車両データなし', label: '🔒 LOCKED' };
    }
    if (playerCar.position === 1) {
      return { eligible: false, reason: '首位走行中（前走車なし）のため使用不可', label: '🔒 LEADER' };
    }
    if (currentSnapshot?.isSC) {
      return { eligible: false, reason: 'セーフティカー中は使用禁止', label: '⚠️ SC規制' };
    }
    if (challengeLap <= 1) {
      return { eligible: false, reason: 'オープニングラップ（Lap 1）は使用禁止', label: '🔒 LAP 1' };
    }
    if ((playerCar.ersBatterySoc ?? 0) < 15) {
      return { eligible: false, reason: `バッテリー残量不足 (${Math.round(playerCar.ersBatterySoc ?? 0)}% < 15%)`, label: '🪫 SOC不足' };
    }
    if (playerCar.gapToAhead > 1.0) {
      return {
        eligible: false,
        reason: `前走車とのギャップが${playerCar.gapToAhead.toFixed(2)}秒（1.0秒以内が必要）`,
        label: `🔒 >1.0s (${playerCar.gapToAhead.toFixed(1)}s)`,
      };
    }
    return {
      eligible: true,
      reason: `前走車との差${playerCar.gapToAhead.toFixed(3)}s（1.0秒以内）。ERSオーバーテイク発動可能！`,
      label: '🟢 READY',
    };
  }, [playerCar, currentSnapshot?.isSC, challengeLap]);

  // Tactical Assist Mode guidance based on situational awareness & instrument prioritization
  const tacticalAssistGuidance = useMemo(() => {
    if (userAssistLevel !== 'assisted' || !currentSnapshot || !playerCar) return null;

    if (currentSnapshot.isSC) {
      return {
        type: 'sc',
        icon: '🚨',
        target: 'M5 トラフィック / ピット戦略',
        message: 'セーフティカー導入中。ピットロスタイムが通常の半分（約11秒）に短縮されます。ピット復帰時のトラフィック予想（M5）を確認してください。',
      };
    }

    // ⚠️ Undercut Threat & Overcut Opportunity Radar
    const prevSnapshot = challengeLap > 1 ? challengeSnapshots[challengeLap - 2] : null;
    if (prevSnapshot) {
      const prevCars = prevSnapshot.cars;
      const prevPlayer = prevCars.find((c) => c.code === playerCar.code);
      const prevActiveCars = [...prevCars].filter((c) => !c.isRetired).sort((a, b) => a.cumulativeTime - b.cumulativeTime);
      const pIdx = prevActiveCars.findIndex((c) => c.code === playerCar.code);

      if (pIdx >= 0 && pIdx < prevActiveCars.length - 1) {
        const rivalCar = prevActiveCars[pIdx + 1];
        const gap = rivalCar.cumulativeTime - (prevPlayer?.cumulativeTime || 0);
        const currentRival = currentSnapshot.cars.find((c) => c.code === rivalCar.code);
        if (currentRival?.isPitting && gap <= 2.8 && !playerCar.isPitting && playerCar.tyreAge >= 4) {
          return {
            type: 'undercut_threat',
            icon: '⚠️',
            target: '⚡ アンダーカット防衛 / BOX BOX!',
            message: `後続の ${currentRival.name} (${currentRival.code}) がピットイン（ギャップ ${gap.toFixed(1)}s）！ニュータイヤの強力なペースで逆転される恐れがあります。今すぐBOX指示を出して防衛してください！`,
          };
        }
      }

      if (pIdx > 0) {
        const rivalAhead = prevActiveCars[pIdx - 1];
        const currentAhead = currentSnapshot.cars.find((c) => c.code === rivalAhead.code);
        if (currentAhead?.isPitting && playerCar.tyreWearPercent < 65 && !playerCar.isPitting) {
          return {
            type: 'overcut_window',
            icon: '⚡',
            target: '🏁 オーバーカット好機 / ステイアウト＆プッシュ',
            message: `前方の ${currentAhead.name} (${currentAhead.code}) がピットイン！前方にクリアエアが広がりました。あと2周プッシュしてアウトラップを上回り、オーバーカットを狙いましょう！`,
          };
        }
      }
    }

    const rainDiff = (activeScenario.actualRainLap || 99) - challengeLap;
    if (rainDiff >= 0 && rainDiff <= 2 && (activeScenario.actualRainIntensity || 0) > 0) {
      return {
        type: 'weather',
        icon: '🌧️',
        target: 'M3 天候レーダー / 路面水量',
        message: `雨雲接近中（約${rainDiff === 0 ? '現在' : `${rainDiff}周後`}）。路面水量モニター（M3）の1.0mmクロスオーバー（スリック限界）推移を注視してください。`,
      };
    }

    if (
      currentSnapshot.rainRadar.waterDepthMm >= 1.0 &&
      (playerCar.tyreCompound === 'SOFT' || playerCar.tyreCompound === 'MEDIUM' || playerCar.tyreCompound === 'HARD')
    ) {
      return {
        type: 'weather_crossover',
        icon: '🌊',
        target: 'ピット指示 (BOX BOX) / M3 天候レーダー',
        message: '路面水量が1.0mm（インターミディエイト境界面）を超過中。ラップタイムの急激な低下（M1）とタイヤ交換指示を確認してください。',
      };
    }

    if (ersEligibility.eligible) {
      return {
        type: 'ers',
        icon: '⚡',
        target: 'OVERTAKE ボタン / M2 テレメトリー',
        message: `前走車との差が${playerCar.gapToAhead.toFixed(2)}秒（1.0秒以内）。ERSオーバーテイク発動可能。相手の最高速（M2）と比較して仕掛けを検討してください。`,
      };
    }

    if (playerCar.tyreWearPercent >= 60 || (playerCar.tyreSurfaceTemp && playerCar.tyreSurfaceTemp > 125)) {
      return {
        type: 'tyre',
        icon: '🛞',
        target: 'M4 タイヤ・デグラデーション',
        message: `タイヤ摩耗${Math.round(playerCar.tyreWearPercent)}%${playerCar.tyreSurfaceTemp ? ` / 表面温度${Math.round(playerCar.tyreSurfaceTemp)}°C` : ''}。グリップ低下によるセクタータイムのタレ（M4）を確認してください。`,
      };
    }

    if (pitProximity.isApproaching && !boxQueuedForNextLap && !playerCar.isPitting) {
      return {
        type: 'pit',
        icon: '🏁',
        target: 'ピット指示 (BOX BOX) / M5 トラフィック',
        message: `ピット入口まで${pitProximity.distanceMeters}m。今周ピットに入る場合はコミットメントライン到達前にBOX指示が必要です。`,
      };
    }

    return {
      type: 'default',
      icon: '🔰',
      target: 'M1 順位タワー / M2 テレメトリー',
      message: '各セクタータイムと前後ギャップの推移を監視中。天候急変やSC出動、接近戦が発生するとここに即時ガイダンスが表示されます。',
    };
  }, [userAssistLevel, currentSnapshot, playerCar, challengeLap, activeScenario, pitProximity, boxQueuedForNextLap, ersEligibility, challengeSnapshots]);

  const handleToggleErs = () => {
    // If activating, user must be eligible
    if (!ersBoostUsedThisLap && !ersEligibility.eligible) {
      return;
    }
    const nextState = !ersBoostUsedThisLap;
    if (radioAudioEnabled) playF1OutgoingRadioBeep();
    setErsBoostUsedThisLap(nextState);
    setPlayerTacticalCommands((prev) => ({
      ...prev,
      [challengeLap]: {
        ...prev[challengeLap],
        ersOvertakeActive: nextState,
      },
    }));

    const currentTimeStr = new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    if (nextState) {
      setTacticalEventTimeline((prev) => [
        ...prev,
        {
          id: `ers-${challengeLap}-${Date.now()}`,
          lap: challengeLap,
          timestamp: currentTimeStr,
          type: 'ers_boost',
          icon: '🔥',
          title: 'ERS オーバーテイクモード発動',
          detail: 'MGU-K 120kW/350kWフルパワー放出。ストレートでの追撃／防衛を実行。',
        },
      ]);
    }
  };

  const handleTeamOrder = (order: TeamOrderType) => {
    if (radioAudioEnabled) playF1OutgoingRadioBeep();
    setActiveTeamOrder(order);
    setPlayerTacticalCommands((prev) => ({
      ...prev,
      [challengeLap]: {
        ...prev[challengeLap],
        teamOrder: order,
      },
    }));

    const orderLabels: Record<TeamOrderType, { name: string; desc: string; icon: string }> = {
      swap: { name: 'SWAP (ポジション入替)', desc: '僚機に前を譲るようピットからチームオーダーを通達', icon: '🔀' },
      defend: { name: 'DEFEND (後続抑え)', desc: '僚機に後続を抑えてギャップを広げる盾の役割を指示', icon: '🛡️' },
      none: { name: 'FREE (自由交戦)', desc: 'チームオーダーを解除し、フェアなフリーバトルを許可', icon: '🏁' },
    };

    const currentTimeStr = new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setTacticalEventTimeline((prev) => [
      ...prev,
      {
        id: `to-${challengeLap}-${Date.now()}`,
        lap: challengeLap,
        timestamp: currentTimeStr,
        type: 'team_order',
        icon: orderLabels[order]?.icon || '📻',
        title: `チームオーダー: ${orderLabels[order]?.name || order}`,
        detail: orderLabels[order]?.desc || '',
      },
    ]);
  };

  // Radio dialogue response
  const handleRadioResponse = (promptId: string, option: DriverRadioOption) => {
    if (radioAudioEnabled) playF1OutgoingRadioBeep();
    setRadioResponses((prev) => ({ ...prev, [promptId]: option.id }));

    // For radio prompts, the user is responding directly to the urgent call generated for this lap (promptTriggerLap).
    // Always target promptTriggerLap (capped at totalLaps) so "BOX NOW!" executes on the intended lap,
    // even if the user took time to read or playback was running at 5x/10x speed.
    const promptTriggerLap = currentSnapshot?.activeRadioPrompt?.triggerLap ?? challengeLap;
    const targetBoxLap = Math.min(activeScenario.totalLaps, promptTriggerLap);

    if (option.actionType === 'box') {
      if (radioAudioEnabled) {
        playBoxBoxCall();
      }
      setBoxQueuedForNextLap(true);
      const chosenCompound = option.targetCompound || nextCompoundChoice;
      if (option.targetCompound) setNextCompoundChoice(option.targetCompound);
      setPlayerTacticalCommands((prev) => ({
        ...prev,
        [targetBoxLap]: {
          ...prev[targetBoxLap],
          boxNextLap: true,
          nextCompound: chosenCompound,
        },
      }));
    } else if (option.actionType === 'stay') {
      setBoxQueuedForNextLap(false);
      setPlayerTacticalCommands((prev) => ({
        ...prev,
        [challengeLap]: {
          ...prev[challengeLap],
          boxNextLap: false,
        },
        [challengeLap + 1]: {
          ...prev[challengeLap + 1],
          boxNextLap: false,
        },
      }));
    } else if (option.actionType === 'pu_mode' && option.targetPUMode) {
      handlePuModeChange(option.targetPUMode);
    }

    const currentTimeStr = new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setTacticalEventTimeline((prev) => [
      ...prev,
      {
        id: `radio-${challengeLap}-${Date.now()}`,
        lap: challengeLap,
        timestamp: currentTimeStr,
        type: 'radio',
        icon: '🎙️',
        title: `無線応答: 「${option.label || '指示応答'}」`,
        detail: `ドライバーの問いかけに対して「${option.effectText || option.label || option.id}」を選択・指示。`,
      },
    ]);
  };

  // Mode Initializers
  // Mode Initializers
  const startSprintRace = (circuitId: string, playerCode: string) => {
    const scenario = generateSprintRaceScenario(circuitId, playerCode);
    setCustomScenario(scenario);
    setGameMode('sprint');
    resetGameState();
    setSimulatorPhase('briefing');
  };

  const startProceduralCrisis = () => {
    const scenario = generateProceduralScenario();
    setCustomScenario(scenario);
    setGameMode('procedural');
    resetGameState();
    setSimulatorPhase('briefing');
  };

  const startPresetCrisis = (idx: number) => {
    setPresetIdx(idx);
    setCustomScenario(null);
    setGameMode('crisis');
    const sc = PRESET_CHALLENGES[idx] || PRESET_CHALLENGES[0];
    if (sc.defaultAiDifficulty) {
      setAiDifficulty(sc.defaultAiDifficulty);
    }
    resetGameState();
    setSimulatorPhase('briefing');
  };

  const startMission = (idx: number) => {
    setSelectedMissionIdx(idx);
    const scenario = MISSION_CHALLENGES[idx] || MISSION_CHALLENGES[0];
    setCustomScenario(scenario);
    setGameMode('mission');
    if (scenario.defaultAiDifficulty) {
      setAiDifficulty(scenario.defaultAiDifficulty);
    }
    resetGameState();
    setSimulatorPhase('briefing');
  };

  const startSandboxMode = (overrides?: {
    circuitId?: string;
    playerCode?: string;
    totalLaps?: number;
    weatherType?: WeatherType;
    rainStartLap?: number;
    rainIntensityMm?: number;
    incidentFrequency?: IncidentFrequency;
    carPackageId?: string;
  }) => {
    const cId = overrides?.circuitId || selectedCircuitId;
    const pCode = overrides?.playerCode || selectedPlayerCode;
    const laps = overrides?.totalLaps || sandboxLaps;
    const weather = overrides?.weatherType || sandboxWeather;
    const rainLap = overrides?.rainStartLap ?? sandboxRainLap;
    const rainMm = overrides?.rainIntensityMm ?? sandboxRainIntensity;
    const incFreq = overrides?.incidentFrequency || sandboxIncidentFreq;
    const carPkg = overrides?.carPackageId !== undefined ? overrides.carPackageId : selectedCarPackageId;

    const scenario = generateSandboxScenario({
      circuitId: cId,
      playerCode: pCode,
      totalLaps: laps,
      weatherType: weather,
      rainStartLap: rainLap,
      rainIntensityMm: rainMm,
      incidentFrequency: incFreq,
      historicCarId: carPkg === 'standard' ? undefined : carPkg,
    });
    setCustomScenario(scenario);
    setGameMode('sandbox');
    resetGameState();
    setSimulatorPhase('briefing');
  };

  const handleRerollWeather = () => {
    const rerolled = rerollScenarioWeather(activeScenario);
    setCustomScenario(rerolled);
    resetGameState();
    setWeatherRerollNotification(
      `🎲 天候・路面再抽選完了: ${rerolled.weatherForecast.radarDesc} (降雨確率 ${rerolled.weatherForecast.rainProbabilityPercent}%)`
    );
    setTimeout(() => setWeatherRerollNotification(null), 5000);
  };

  const resetGameState = () => {
    setChallengeLap(1);
    setChallengePlaying(false);
    setIsRaceFinished(false);
    setCurrentProgressPct(0);
    setPlayerTacticalCommands({});
    setRadioResponses({});
    setBoxQueuedForNextLap(false);
    setActivePuMode('standard');
    setErsBoostUsedThisLap(false);
    setActiveTeamOrder('none');
    setTacticalEventTimeline([]);
    setTacticalScore(null);
    setDiagnosticResult(null);
    setDebriefTab('score');
    setGeminiDebrief(null);
    resumedLapsRef.current.clear();
    setCustomStartingTyre(null);
    setCustomInitialPuMode(null);
    setCustomTargetBoxLap(null);
    setCustomTargetCompound(null);
    playedChirpIdsRef.current.clear();
  };

  // ── Game Cycle Navigation Handlers ──
  const handleStartRace = () => {
    setChallengeLap(1);
    setChallengePlaying(true);
    setIsRaceFinished(false);
    setCurrentProgressPct(0);
    setTacticalEventTimeline([]);
    resumedLapsRef.current.clear();
    setSimulatorPhase('race');
  };

  const handleRestartRace = () => {
    setChallengeLap(1);
    setChallengePlaying(true);
    setIsRaceFinished(false);
    setCurrentProgressPct(0);
    setPlayerTacticalCommands({});
    setRadioResponses({});
    setBoxQueuedForNextLap(false);
    setActivePuMode('standard');
    setErsBoostUsedThisLap(false);
    setActiveTeamOrder('none');
    setTacticalEventTimeline([]);
    setTacticalScore(null);
    setDiagnosticResult(null);
    setDebriefTab('score');
    setGeminiDebrief(null);
    resumedLapsRef.current.clear();
    playedChirpIdsRef.current.clear();
    setSimulatorPhase('race');
  };

  const handleBackToBriefing = () => {
    setChallengeLap(1);
    setChallengePlaying(false);
    setIsRaceFinished(false);
    setCurrentProgressPct(0);
    setPlayerTacticalCommands({});
    setRadioResponses({});
    setBoxQueuedForNextLap(false);
    setActivePuMode('standard');
    setErsBoostUsedThisLap(false);
    setActiveTeamOrder('none');
    setTacticalEventTimeline([]);
    setTacticalScore(null);
    setDiagnosticResult(null);
    setDebriefTab('score');
    setGeminiDebrief(null);
    resumedLapsRef.current.clear();
    playedChirpIdsRef.current.clear();
    setSimulatorPhase('briefing');
  };

  const handleBackToModeSelect = () => {
    resetGameState();
    setSimulatorPhase('mode_select');
  };

  // Gemini AI Debrief request
  const requestGeminiDebrief = async () => {
    if (!tacticalScore) return;
    setLoadingGeminiDebrief(true);
    try {
      const headers = getGeminiAuthHeaders();
      const timelineSummary = tacticalEventTimeline.length > 0
        ? tacticalEventTimeline.map(e => `・Lap ${e.lap}: [${e.title}] ${e.detail}`).join('\n')
        : '・特筆すべき途中指示なし（初期戦略のまま完走）';

      const prompt = `あなたはF1世界選手権のチーフストラテジスト（レース戦略最高責任者）です。
プレイヤーが担当した ${activeScenario.title} のレース結果をプロの視点で徹底総括してください。
- 最終結果: P${playerCar?.position} (目標 P${activeScenario.targetPosition})
- 総合採点: ${tacticalScore.totalScore}点 / 100点 (Rank: ${tacticalScore.rank})
- 判定された司令官タイプ: ${diagnosticResult?.archetype.name || 'ロス・ブラウン型'} (${diagnosticResult?.archetype.catchphrase || ''})
- ピット窓口適正度: ${tacticalScore.pitTimingScore}/25点
- トラフィック管理: ${tacticalScore.trafficScore}/25点
- タイヤ熱管理: ${tacticalScore.tyreEnergyScore}/25点
- チームワーク＆突発対応: ${tacticalScore.chaosTeamScore}/25点
${diagnosticResult?.unlockedBadgesThisRace.length ? `- 今回獲得した称号: ${diagnosticResult.unlockedBadgesThisRace.map(b => b.name).join(', ')}` : ''}

【プレイヤーが実際に下した周回別・戦術指示ログ】:
${timelineSummary}

【チーフストラテジストへの総括指示】:
1. プレイヤーの司令官タイプ（長所・短所）に触れつつ、上記タイムラインの具体的な周回と判断（PUモード切替、ピットイン指示のタイミング、ERS使用、チームオーダー、無線への応答等）を直接引用・評価してください。
2. どこでタイムを得したか、あるいは損したか（アンダーカットの成否、ダーティエア被弾、ダブルスタック遅延、タイヤクリフの回避など）を論理的かつリアルに解説してください。
3. 今後のレースでトップチェッカーを受けるための次なる戦略的アドバイスを一言添えてください。
文体はF1のパドック・ピットウォールにいるベテラン戦略エンジニアらしい、情熱的かつ鋭い口調で論評してください。`;

      const res = await fetch('/api/strategist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...headers },
        body: JSON.stringify({ message: prompt, contextType: 'race_simulation_debrief' }),
      });

      if (!res.ok) throw new Error('API response failed');
      const data = await res.json();
      setGeminiDebrief(data.response || data.text || '総括の生成が完了しました。');
    } catch {
      setGeminiDebrief(
        `チーフストラテジスト総括: 総合評価 ${tacticalScore.totalScore}点 (Rank ${tacticalScore.rank})。\n最終周回まで冷静にタイヤ温度とトラフィック窓を管理し、目標順位への挑戦を完遂しました。特にピットストップのアウトラップでクリーンエアを確保できた周回が最大の好機を生み出しました。`
      );
    } finally {
      setLoadingGeminiDebrief(false);
    }
  };

  // Open Glossary Intel Popup
  const handleOpenIntel = (keywordId: string) => {
    const found = GLOSSARY_TERMS.find(
      (t) =>
        t.id.toLowerCase() === keywordId.toLowerCase() ||
        t.id.replace('-', '_') === keywordId.replace('-', '_') ||
        t.term.toLowerCase().includes(keywordId.toLowerCase())
    );
    if (found) {
      setSelectedIntelTerm(found);
    } else {
      setSelectedIntelTerm({
        id: keywordId,
        term: keywordId.toUpperCase(),
        englishTerm: keywordId,
        category: 'strategy',
        categoryLabel: '⛽ 戦略',
        level: 2,
        summary: 'F1における極めて重要な戦略戦術用語。',
        description: 'レース展開やタイヤ摩耗、ピットストップの損益分岐点を左右する専門概念です。',
        realExample: '「この判断がレースの命運を分けた決定打となりました。」',
      });
    }
  };

  // ──────────────────────────────────────────────────────────────────────────
  // RENDER
  // ──────────────────────────────────────────────────────────────────────────

  if (!isMounted) {
    return (
      <div className="flex h-full min-h-[500px] w-full items-center justify-center bg-slate-950 text-slate-400">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-red-500 border-t-transparent" />
          <span className="font-mono text-xs text-slate-400">PITWALL コックピット起動中...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-1.5 w-full max-w-[1920px] mx-auto pb-12">
      {/* ── Top Header Navigation Bar (Ultra-Compact) ── */}
      <div className="flex items-center justify-between gap-2 bg-slate-950/90 px-2.5 py-1.5 rounded-xl border border-white/10 shadow-md backdrop-blur-md">
        <div className="flex items-center gap-2 min-w-0">
          {onReturnToPortal && (
            <button
              type="button"
              onClick={onReturnToPortal}
              className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/10 text-xs font-mono transition-all cursor-pointer shadow-sm active:scale-95 shrink-0"
              title="F1ポータル（ホーム）に戻る"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">ポータル</span>
            </button>
          )}
          <div className="w-6 h-6 rounded-md bg-gradient-to-br from-red-600 to-rose-700 flex items-center justify-center shadow-sm border border-red-500/30 shrink-0">
            <Gamepad2 className="w-3.5 h-3.5 text-white" />
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="font-racing font-bold text-white text-xs sm:text-sm tracking-wider">
              PITWALL
            </span>
            <span className="px-1.5 py-0.2 rounded bg-red-950 border border-red-500/40 text-[9px] font-mono text-red-300 font-bold hidden sm:inline">
              PRO
            </span>
          </div>

          {/* Active Scenario Quick Indicator */}
          <div className="flex items-center gap-1.5 ml-1 pl-2 border-l border-white/10 text-xs truncate">
            <span className="px-1.5 py-0.2 rounded bg-red-950 border border-red-500/40 text-[9px] font-racing font-bold text-red-300 shrink-0">
              {majorCategory === 'battle' ? '⚔️ 実践' : '🔬 練習'}
            </span>
            <span className="font-racing font-bold text-white text-xs truncate max-w-[180px] xl:max-w-[320px]">
              {activeScenario.title}
            </span>
            <span className="text-slate-400 font-mono text-[10px] hidden md:inline shrink-0">
              ({activeScenario.circuit.name.split(' ')[0]} • 目標P{activeScenario.targetPosition})
            </span>
          </div>
        </div>

        {/* Top Controls: Career, Auto-pause, Audio, Settings Drawer Toggle, Library */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          {/* FIA Career & Badges Museum Button */}
          <button
            type="button"
            onClick={() => setIsCareerModalOpen(true)}
            className="btn-console flex items-center gap-1 text-xs px-2 py-0.5 bg-gradient-to-r from-amber-950/50 via-slate-900 to-red-950/40 border-amber-500/40 text-amber-300 hover:text-white hover:border-amber-400 transition-all shadow-sm group"
            title="FIAライセンス等級・累積CP・全30+称号カタログを開く"
          >
            <Award className="w-3 h-3 text-yellow-400 group-hover:scale-110 transition-transform" />
            <span suppressHydrationWarning className="font-racing text-[10px] font-bold">
              {careerData.grade === 'S' ? '👑 S' : `GRADE ${careerData.grade}`}
            </span>
            <span suppressHydrationWarning className="hidden md:inline px-1 py-0.2 rounded bg-amber-950/80 border border-amber-500/30 text-[9px] font-mono text-amber-200">
              {careerData.unlockedBadgeIds.length}/{F1_BADGES_CATALOG.length}
            </span>
          </button>

          {/* Trophy Count Button */}
          <button
            type="button"
            onClick={() => setIsCareerModalOpen(true)}
            className="btn-console flex items-center gap-1 text-xs px-2 py-0.5 border-amber-500/30 hover:border-amber-400 text-amber-300 hover:text-white transition-all"
            title="獲得トロフィー一覧（クリックでトロフィールーム）"
          >
            <Trophy className="w-3 h-3 text-amber-400" />
            <span suppressHydrationWarning className="px-1 py-0.2 rounded bg-amber-950/80 border border-amber-500/30 text-[9px] font-mono text-amber-200">
              {Object.keys(careerData.clearedScenarios || {}).length}冠
            </span>
          </button>

          {/* Audio Button */}
          <button
            type="button"
            onClick={() => {
              const next = !radioAudioEnabled;
              setRadioAudioEnabled(next);
              if (next) playF1RadioChirp();
            }}
            className={`btn-console flex items-center gap-1 text-xs px-2 py-0.5 ${
              radioAudioEnabled
                ? 'bg-emerald-950/50 border-emerald-500/40 text-emerald-300'
                : 'bg-slate-900 border-white/10 text-slate-500'
            }`}
            title="ドライバー無線の着信音（Web Audioシンセサイザー）"
          >
            {radioAudioEnabled ? (
              <>
                <Volume2 className="w-3 h-3 text-emerald-400 animate-pulse" />
                <span className="font-mono text-[10px] font-bold hidden sm:inline">AUDIO</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3 h-3" />
                <span className="font-mono text-[10px] hidden sm:inline">MUTED</span>
              </>
            )}
          </button>

          {/* Phase Quick Navigation Button */}
          {/* Strategist Equipped Title Badge (Opens Paddock Hall of Fame) */}
          <button
            type="button"
            onClick={() => setIsCareerModalOpen(true)}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/90 hover:bg-slate-850 border border-amber-500/40 text-[10px] font-mono text-amber-300 shadow-sm cursor-pointer transition-all hover:scale-105 active:scale-95"
            title={`軍師称号: ${equippedTitle.name} (${equippedTitle.tacticalPerk.description}) — クリックでパドック殿堂を開く`}
          >
            <span>{equippedTitle.icon}</span>
            <span className="font-bold truncate max-w-[140px]">{equippedTitle.name}</span>
            {equippedTitle.tacticalPerk.probabilisticBonus > 0 && (
              <span className="text-[9px] text-emerald-400 font-bold bg-emerald-950/60 px-1 py-0.2 rounded border border-emerald-500/30">
                +{Math.round(equippedTitle.tacticalPerk.probabilisticBonus * 100)}%
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => {
              if (simulatorPhase === 'race' || simulatorPhase === 'debrief') {
                handleBackToBriefing();
              } else if (simulatorPhase === 'briefing') {
                handleBackToModeSelect();
              } else {
                setSimulatorPhase('briefing');
              }
            }}
            className="btn-console text-[10px] px-2 py-0.5 flex items-center gap-1 font-racing font-bold transition-all text-slate-300 hover:text-white border-white/20"
            title="作戦ブリーフィング / モード選択へ"
          >
            <Settings className="w-3 h-3 text-red-400" />
            <span>
              {simulatorPhase === 'mode_select'
                ? '📋 ブリーフィングへ ➔'
                : simulatorPhase === 'briefing'
                ? '🏁 モード選択へ ➔'
                : '⚙️ 作戦修正'}
            </span>
          </button>

          {simulatorPhase === 'race' && (
            <button
              type="button"
              onClick={() => {
                if (window.confirm('レースを中断してモード選択に戻りますか？')) {
                  handleBackToModeSelect();
                }
              }}
              className="btn-console text-[10px] px-2 py-0.5 flex items-center gap-1 font-racing font-bold transition-all text-rose-400 hover:text-white hover:bg-rose-950/60 border-rose-500/30"
              title="レースを中断してモード選択に戻る"
            >
              <span>🏳️ 中断</span>
            </button>
          )}

          {onNavigateToLibrary && (
            <button
              type="button"
              onClick={() => onNavigateToLibrary('strategy')}
              className="btn-console flex items-center gap-1 text-xs px-2 py-0.5 text-slate-400 hover:text-white hover:border-purple-500/40 transition-colors"
              title="レース戦略公理や2026新技術シミュレーターはF1大百科（Library）で学習できます"
            >
              <BookOpen className="w-3 h-3 text-purple-400" />
              <span className="font-mono text-[10px] font-bold hidden md:inline">大百科 ➔</span>
            </button>
          )}
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════════════
          PHASE 1: 🏁 MODE SELECT & START SCREEN (モード選択・スタート画面)
          ════════════════════════════════════════════════════════════════════════ */}
      {simulatorPhase === 'mode_select' && (
        <ModeSelectScreen
          careerData={careerData}
          majorCategory={majorCategory}
          setMajorCategory={setMajorCategory}
          gameMode={gameMode}
          setGameMode={setGameMode}
          presetIdx={presetIdx}
          selectedMissionIdx={selectedMissionIdx}
          customScenario={customScenario}
          setCustomScenario={setCustomScenario}
          selectedCircuitId={selectedCircuitId}
          setSelectedCircuitId={setSelectedCircuitId}
          selectedPlayerCode={selectedPlayerCode}
          setSelectedPlayerCode={setSelectedPlayerCode}
          sandboxLaps={sandboxLaps}
          setSandboxLaps={setSandboxLaps}
          sandboxWeather={sandboxWeather}
          setSandboxWeather={setSandboxWeather}
          sandboxRainLap={sandboxRainLap}
          setSandboxRainLap={setSandboxRainLap}
          sandboxIncidentFreq={sandboxIncidentFreq}
          setSandboxIncidentFreq={setSandboxIncidentFreq}
          startPresetCrisis={startPresetCrisis}
          startSprintRace={startSprintRace}
          startMission={startMission}
          startProceduralCrisis={startProceduralCrisis}
          selectedCarPackageId={selectedCarPackageId}
          setSelectedCarPackageId={setSelectedCarPackageId}
          startSandboxMode={startSandboxMode}
          onOpenCareerModal={() => setIsCareerModalOpen(true)}
        />
      )}

      {/* ════════════════════════════════════════════════════════════════════════
          PHASE 2: 📋 BRIEFING & SETUP SCREEN (作戦ブリーフィング＆初期設定画面)
          ════════════════════════════════════════════════════════════════════════ */}
      {simulatorPhase === 'briefing' && (
        <BriefingScreen
          gameMode={gameMode}
          activeScenario={activeScenario}
          setCustomScenario={setCustomScenario}
          resetGameState={resetGameState}
          effectivePlayerConfig={effectivePlayerConfig}
          customStartingTyre={customStartingTyre}
          setCustomStartingTyre={setCustomStartingTyre}
          customInitialPuMode={customInitialPuMode}
          setCustomInitialPuMode={setCustomInitialPuMode}
          setActivePuMode={setActivePuMode}
          customTargetBoxLap={customTargetBoxLap}
          setCustomTargetBoxLap={setCustomTargetBoxLap}
          effectiveTargetBoxLap={effectiveTargetBoxLap}
          customTargetCompound={customTargetCompound}
          setCustomTargetCompound={setCustomTargetCompound}
          nextCompoundChoice={nextCompoundChoice}
          setNextCompoundChoice={setNextCompoundChoice}
          raceLengthMode={raceLengthMode}
          setRaceLengthMode={setRaceLengthMode}
          aiDifficulty={aiDifficulty}
          setAiDifficulty={setAiDifficulty}
          userAssistLevel={userAssistLevel}
          setUserAssistLevel={setUserAssistLevel}
          careerData={careerData}
          briefingHelpTopic={briefingHelpTopic}
          setBriefingHelpTopic={setBriefingHelpTopic}
          handleRerollWeather={handleRerollWeather}
          handleBackToModeSelect={handleBackToModeSelect}
          handleStartRace={handleStartRace}
        />
      )}

      {/* ════════════════════════════════════════════════════════════════════════
          PHASE 3: 🏎️ LIVE RACE COCKPIT SCREEN (ピットウォール本番コクピット)
          ════════════════════════════════════════════════════════════════════════ */}
      {simulatorPhase === 'race' && (
        <div className="space-y-3 animate-in fade-in duration-300">
          {/* ════════════════════════════════════════════════════════════════════════
             COCKPIT HUD DECK (Ultra-Compact 2-Tier + Mobile Toggle)
             ════════════════════════════════════════════════════════════════════════ */}
          <CockpitHudDeck
            challengeLap={challengeLap}
            setChallengeLap={setChallengeLap}
            resumedLapsRef={resumedLapsRef}
            challengePlaying={challengePlaying}
            handleResumeOrPlay={handleResumeOrPlay}
            activeScenario={activeScenario}
            playbackSpeed={playbackSpeed}
            setPlaybackSpeed={setPlaybackSpeed}
            resetGameState={resetGameState}
            lapTimeRemainingMs={lapTimeRemainingMs}
            customStartingTyre={customStartingTyre}
            customInitialPuMode={customInitialPuMode}
            currentSnapshot={currentSnapshot}
            playerCar={playerCar}
            aiDifficulty={aiDifficulty}
            userAssistLevel={userAssistLevel}
            setUserAssistLevel={setUserAssistLevel}
            raceLengthMode={raceLengthMode}
            pitExitTraffic={pitExitTraffic}
            weatherRerollNotification={weatherRerollNotification}
            setWeatherRerollNotification={setWeatherRerollNotification}
            mobileConsoleView={mobileConsoleView}
            setMobileConsoleView={setMobileConsoleView}
            radioResponses={radioResponses}
            isRaceFinished={isRaceFinished}
          />

      {/* ── 4-COLUMN PRO PITWALL COMMAND COCKPIT (TOWER | COURSE & COMMS | DATA | COMMANDS) ── */}
      <div className="grid grid-cols-1 landscape:grid-cols-2 lg:grid-cols-[168px_minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,1fr)] xl:grid-cols-[172px_minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,1fr)] 2xl:grid-cols-[176px_minmax(0,1.25fr)_minmax(0,1.05fr)_minmax(0,1.05fr)] gap-2.5 items-start">
        {/* ════════════════════════════════════════════════════════════════════════
           COLUMN 1 (LEFT): Perpetual 1-Column Timing Tower (P1-P22)
           ════════════════════════════════════════════════════════════════════════ */}
        <TimingTowerPanel
          mobileConsoleView={mobileConsoleView}
          timingTowerMode={timingTowerMode}
          setTimingTowerMode={setTimingTowerMode}
          currentSnapshot={currentSnapshot}
          activeScenario={activeScenario}
          lapProgressPct={lapProgressPct}
        />
        {/* ════════════════════════════════════════════════════════════════════════
           COLUMN 2 (CENTER-LEFT): Live Circuit GPS Track Radar (Course) & Doppler Weather Radar
           ════════════════════════════════════════════════════════════════════════ */}
        <TrackMapAndWeatherDeck
          mobileConsoleView={mobileConsoleView}
          activeScenario={activeScenario}
          currentSnapshot={currentSnapshot}
          lapProgressPct={lapProgressPct}
          challengeLap={challengeLap}
          challengePlaying={challengePlaying}
          playbackSpeed={playbackSpeed}
          ersBoostUsedThisLap={ersBoostUsedThisLap}
          activePuMode={activePuMode}
          setIsFullScreenCockpit={setIsFullScreenCockpit}
          activeHelpCard={activeHelpCard}
          setActiveHelpCard={setActiveHelpCard}
          hoveredHelpCard={hoveredHelpCard}
          setHoveredHelpCard={setHoveredHelpCard}
          setActiveMonitor={setActiveMonitor}
          onNavigateToLibrary={onNavigateToLibrary}
          teammateCar={teammateCar}
          activeTeamOrder={activeTeamOrder}
          handleTeamOrder={handleTeamOrder}
        />
        {/* ════════════════════════════════════════════════════════════════════════
           COLUMN 3 (CENTER-RIGHT): Tactical Data Deck (Pit Exit, Weather & Telemetry)
           ════════════════════════════════════════════════════════════════════════ */}
        <TacticalDataDeckPanel
          mobileConsoleView={mobileConsoleView}
          activeMonitor={activeMonitor}
          setActiveMonitor={setActiveMonitor}
          filteredFeed={filteredFeed}
          onOpenAiStrategist={onOpenAiStrategist}
          radioAudioEnabled={radioAudioEnabled}
          setRadioAudioEnabled={setRadioAudioEnabled}
          liveFeedFilter={liveFeedFilter}
          setLiveFeedFilter={setLiveFeedFilter}
          activeHelpCard={activeHelpCard}
          setActiveHelpCard={setActiveHelpCard}
          hoveredHelpCard={hoveredHelpCard}
          setHoveredHelpCard={setHoveredHelpCard}
          onNavigateToLibrary={onNavigateToLibrary}
          playerCar={playerCar}
          liveTelemetry={liveTelemetry}
          currentSnapshot={currentSnapshot}
          activeScenario={activeScenario}
          challengeLap={challengeLap}
          ersBoostUsedThisLap={ersBoostUsedThisLap}
          activePuMode={activePuMode}
          pitExitTraffic={pitExitTraffic}
          raceLengthMode={raceLengthMode}
        />
        {/* ════════════════════════════════════════════════════════════════════════
           COLUMN 4 (RIGHT): Comms, Live Feed & Tactical Commands
           ════════════════════════════════════════════════════════════════════════ */}
        <TacticalCommandsPanel
          mobileConsoleView={mobileConsoleView}
          currentSnapshot={currentSnapshot}
          radioResponses={radioResponses}
          minimizeRadioPrompt={minimizeRadioPrompt}
          setMinimizeRadioPrompt={setMinimizeRadioPrompt}
          handleRadioResponse={handleRadioResponse}
          radioAudioEnabled={radioAudioEnabled}
          rivalIntelFilter={rivalIntelFilter}
          setRivalIntelFilter={setRivalIntelFilter}
          filteredRivalIntel={filteredRivalIntel}
          userAssistLevel={userAssistLevel}
          tacticalAssistGuidance={tacticalAssistGuidance}
          selectedIntelRivalId={selectedIntelRivalId}
          setSelectedIntelRivalId={setSelectedIntelRivalId}
          activeHelpCard={activeHelpCard}
          setActiveHelpCard={setActiveHelpCard}
          hoveredHelpCard={hoveredHelpCard}
          setHoveredHelpCard={setHoveredHelpCard}
          setActiveMonitor={setActiveMonitor}
          pitProximity={pitProximity}
          playerPitStatus={playerPitStatus}
          pitExitTraffic={pitExitTraffic}
          nextCompoundChoice={nextCompoundChoice}
          handleCompoundChange={handleCompoundChange}
          boxQueuedForNextLap={boxQueuedForNextLap}
          handleToggleBoxNextLap={handleToggleBoxNextLap}
          activePuMode={activePuMode}
          handlePuModeChange={handlePuModeChange}
          ersBoostUsedThisLap={ersBoostUsedThisLap}
          ersEligibility={ersEligibility}
          handleToggleErs={handleToggleErs}
          playerCar={playerCar}
          onNavigateToLibrary={onNavigateToLibrary}
        />
      </div>

      {/* Checkered Flag Finish Banner (Appears only after all cars finish across the line) */}
      {isRaceFinished && (
        <div className="p-4 sm:p-6 rounded-2xl bg-gradient-to-r from-red-950 via-slate-900 to-amber-950 border-2 border-red-500 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4 animate-in zoom-in-95 duration-300">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-red-600 flex items-center justify-center text-2xl shadow-lg shrink-0">
              🏁
            </div>
            <div>
              <div className="text-xs font-mono text-amber-400 font-bold">CHECKERED FLAG — ALL CARS FINISHED</div>
              <h3 className="font-racing font-bold text-white text-lg sm:text-xl">
                全{activeScenario.totalLaps}周を完走しました！全車チェッカー！
              </h3>
              <p className="text-xs text-slate-300">
                最終順位: <strong className="text-white font-racing">P{playerCar?.position}</strong> (目標: P{activeScenario.targetPosition})
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setSimulatorPhase('debrief')}
            className="btn-console-primary px-6 py-3 text-sm font-racing font-bold tracking-wider shadow-xl shadow-red-950/80 flex items-center gap-2 hover:scale-105 transition-all shrink-0 cursor-pointer"
          >
            <Trophy className="w-4 h-4 text-yellow-300" />
            <span>📊 リザルト＆総括解説を見る ➔</span>
          </button>
        </div>
      )}
    </div>
  )}

  {/* ════════════════════════════════════════════════════════════════════════
      PHASE 4: 🏆 DEBRIEF & RESULTS SCREEN (リザルト＆戦術総括解説画面)
      ════════════════════════════════════════════════════════════════════════ */}
      {simulatorPhase === 'debrief' && (
        <DebriefScreen
          tacticalScore={tacticalScore}
          diagnosticResult={diagnosticResult}
          activeScenario={activeScenario}
          playerCar={playerCar}
          careerData={careerData}
          debriefTab={debriefTab}
          setDebriefTab={setDebriefTab}
          badgeCategoryFilter={badgeCategoryFilter}
          setBadgeCategoryFilter={setBadgeCategoryFilter}
          geminiDebrief={geminiDebrief}
          loadingGeminiDebrief={loadingGeminiDebrief}
          requestGeminiDebrief={requestGeminiDebrief}
          resetGameState={resetGameState}
          tacticalEventTimeline={tacticalEventTimeline}
          onOpenUpgradeModal={onOpenUpgradeModal}
          handleOpenIntel={handleOpenIntel}
          setSelectedBadgeForDetail={setSelectedBadgeForDetail}
          setIsCareerModalOpen={setIsCareerModalOpen}
          handleRestartRace={handleRestartRace}
          handleBackToBriefing={handleBackToBriefing}
          handleBackToModeSelect={handleBackToModeSelect}
          setSimulatorPhase={setSimulatorPhase}
        />
      )}

          {/* ── BADGE DETAIL MODAL ── */}
          <BadgeDetailModal
            badge={selectedBadgeForDetail}
            onClose={() => setSelectedBadgeForDetail(null)}
          />

          {/* ── CAREER & FIA LICENSE MODAL (Top Header Button) ── */}
          <StrategistCareerModal
            isOpen={isCareerModalOpen}
            onClose={() => setIsCareerModalOpen(false)}
            careerData={careerData}
            onSelectBadge={(badge) => setSelectedBadgeForDetail(badge)}
            equippedTitleId={equippedTitleId}
            onEquipTitle={(newTitleId) => {
              setEquippedTitleId(newTitleId);
              saveUserPreferences({ equippedTitleId: newTitleId });
            }}
          />

          {/* ── INTEL BRIEFING MODAL (F1 大百科・用語集ポップアップ) ── */}
          <IntelGlossaryModal
            selectedIntelTerm={selectedIntelTerm}
            onClose={() => setSelectedIntelTerm(null)}
            onNavigateToLibrary={onNavigateToLibrary}
          />

          {/* ════════════════════════════════════════════════════════════════════════
             FULLSCREEN PITWALL COCKPIT OVERLAY (全画面司令塔モード)
             ════════════════════════════════════════════════════════════════════════ */}
          <FullScreenCockpitOverlay
            isFullScreenCockpit={isFullScreenCockpit}
            setIsFullScreenCockpit={setIsFullScreenCockpit}
            activeScenario={activeScenario}
            challengeLap={challengeLap}
            challengePlaying={challengePlaying}
            handleResumeOrPlay={handleResumeOrPlay}
            playbackSpeed={playbackSpeed}
            setPlaybackSpeed={setPlaybackSpeed}
            radioAudioEnabled={radioAudioEnabled}
            setRadioAudioEnabled={setRadioAudioEnabled}
            careerData={careerData}
            setIsCareerModalOpen={setIsCareerModalOpen}
            setIsScenarioDrawerOpen={setIsScenarioDrawerOpen}
            setChallengePlaying={setChallengePlaying}
            standaloneMode={standaloneMode}
            onNavigateToLibrary={onNavigateToLibrary}
            currentSnapshot={currentSnapshot}
            selectedCarCode={selectedCarCode}
            setSelectedCarCode={setSelectedCarCode}
            ersBoostUsedThisLap={ersBoostUsedThisLap}
            activePuMode={activePuMode}
            lapProgressPct={lapProgressPct}
            pitExitTraffic={pitExitTraffic}
            boxQueuedForNextLap={boxQueuedForNextLap}
            handleToggleBoxNextLap={handleToggleBoxNextLap}
            nextCompoundChoice={nextCompoundChoice}
            handleCompoundChange={handleCompoundChange}
            handleToggleErs={handleToggleErs}
            handlePuModeChange={handlePuModeChange}
            handleRadioResponse={handleRadioResponse}
          />

      {/* ── FOOTER: OFFICIAL DISCLAIMER & RESERVED AD/PARTNER SLOT ── */}
      <div className="pt-6 pb-4 border-t border-white/10 mt-6 space-y-3 text-center">
        {/* Unobtrusive Sponsor / Partner Slot for Free Plan users */}
        {!isPro && (
          <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5 max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-400">
              <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[9px] font-mono uppercase tracking-wider text-slate-400">
                Partner
              </span>
              <span className="font-racing font-bold text-white text-xs">
                F1公式中継・最新ギア
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px] font-mono">
              <span className="text-slate-400">DAZN / F1 TV Pro / F1 Store</span>
              <span className="text-cyan-400 font-bold">
                公式提携リンク ➔
              </span>
            </div>
          </div>
        )}

        {/* Mandatory Unofficial Disclaimer */}
        <p className="text-[10px] text-slate-500 max-w-3xl mx-auto leading-relaxed font-mono">
          ※ 当サービスは非公式（Unofficial）のファン作成テレメトリ分析・シミュレーションツールであり、Formula 1各社（Formula One Licensing B.V.、Formula One Management等）および各チームとは一切関係がありません。
          F1, FORMULA ONE, FORMULA 1, FIA FORMULA ONE WORLD CHAMPIONSHIP, GRAND PRIXおよび関連するマークはFormula One Licensing B.V.の登録商標です。
        </p>
      </div>
    </div>
  );
}
