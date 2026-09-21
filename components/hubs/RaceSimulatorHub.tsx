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

import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Target,
  AlertTriangle,
  Play,
  Pause,
  RotateCcw,
  CloudRain,
  Radio,
  Gamepad2,
  Sparkles,
  Trophy,
  Flag,
  Zap,
  Gauge,
  Flame,
  ShieldAlert,
  Crosshair,
  CheckCircle2,
  XCircle,
  Volume2,
  VolumeX,
  Users,
  Compass,
  BookOpen,
  AlertCircle,
  Award,
  Medal,
  Lock,
  Unlock,
  ExternalLink,
  Dices,
  SlidersHorizontal,
  Shuffle,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Settings,
  LayoutGrid,
  Maximize2,
  Minimize2,
  Map,
  Fuel,
  ArrowLeft,
  HelpCircle,
  Wind,
  TrendingDown,
  Bot,
} from 'lucide-react';
import LiveTrackGpsRadar from '@/components/telemetry/LiveTrackGpsRadar';
import {
  STRATEGIST_ARCHETYPES,
  F1_BADGES_CATALOG,
  FIA_LICENSES,
  diagnoseStrategistProfile,
  loadStrategistCareer,
  saveStrategistCareer,
  determineTrophyTier,
  type DiagnosticResult,
  type SavedCareerData,
  type F1Badge,
  type BadgeCategory,
  type TrophyTier,
  type ScenarioClearRecord,
} from '@/lib/raceDebriefAnalysis';
import {
  SIM_CIRCUITS,
  GRID_DRIVERS,
  TYRE_PROPERTIES,
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
  type CircuitSimProfile,
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
} from '@/lib/raceSimulationEngine';
import {
  playBoxBoxCall,
  playF1IncomingRadioChirp,
  playF1OutgoingRadioBeep,
  ensureAudioContextResumed,
} from '@/lib/radioAudioEffect';
import { GLOSSARY_TERMS, type GlossaryTerm } from '@/data/f1GlossaryData';
import { getGeminiAuthHeaders } from '@/lib/apiKeyService';
import { usePlanTier } from '@/lib/tierService';
import { PaddockLiveAtmosphere } from '@/components/pitwall/PaddockLiveAtmosphere';
import {
  BriefingSettingHelpModal,
  type BriefingHelpTopic,
} from '@/components/pitwall/BriefingSettingHelpModal';

// Pure Pitwall Command Room Game
type PitwallMonitor = 'all' | 'track' | 'timing' | 'thermals' | 'weather' | 'team' | 'radio';
type GameMajorCategory = 'practice' | 'battle';
type ChallengeModeType = 'crisis' | 'scenario' | 'sprint' | 'mission' | 'sandbox' | 'procedural';
export type SimulatorPhase = 'mode_select' | 'briefing' | 'race' | 'debrief';

export interface RivalIntelReport {
  id: string;
  lap: number;
  priority: 'high' | 'medium' | 'low';
  category: 'tyre' | 'telemetry' | 'radio_intercept' | 'ers' | 'pit_stop';
  analystRole: string;
  targetCarCode: string;
  targetCarName: string;
  targetCarPos: number;
  targetCarColor: string;
  headline: string;
  summary: string;
  confidence: 'verified' | 'high' | 'suspect_bluff' | 'low';
  confidenceLabel: string;
  rawTelemetry: {
    lapTimes: string[];
    speedTrapKmh: number;
    playerDeltaSpeedKmh: number;
    tyreCompound: TyreCompound;
    tyreAge: number;
    tyreWearPercent: number;
    ersBatterySoc: number;
    pitStopDuration?: number;
    gapToPlayerSec: number;
    isAhead: boolean;
  };
}

interface RaceSimulatorHubProps {
  onOpenUpgradeModal?: () => void;
  onNavigateToLibrary?: (subTab: string, termId?: string) => void;
  onOpenAiStrategist?: () => void;
  standaloneMode?: boolean;
  onReturnToPortal?: () => void;
}

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

  // Race Length Mode: 'gp_short_25' (25% Distance with 3.2x scaled wear), 'gp_full_100' (100% full GP), 'sprint'
  const [raceLengthMode, setRaceLengthMode] = useState<'gp_short_25' | 'gp_full_100' | 'sprint'>('gp_short_25');

  // ════════════════════════════════════════════════════════════════════════════
  // 🎯 CHALLENGE GAME MODE STATE
  // ════════════════════════════════════════════════════════════════════════════
  const [gameMode, setGameMode] = useState<ChallengeModeType>('crisis');
  const [selectedCircuitId, setSelectedCircuitId] = useState<string>('suzuka');
  const [selectedPlayerCode, setSelectedPlayerCode] = useState<string>('TSU');

  // Active scenario state
  const [majorCategory, setMajorCategory] = useState<GameMajorCategory>('battle');
  const [presetIdx, setPresetIdx] = useState<number>(0);
  const [selectedMissionIdx, setSelectedMissionIdx] = useState<number>(0);
  const [customScenario, setCustomScenario] = useState<ChallengeScenario | null>(null);
  const [isScenarioPickerOpen, setIsScenarioPickerOpen] = useState<boolean>(false);
  const [isScenarioDrawerOpen, setIsScenarioDrawerOpen] = useState<boolean>(false);
  const [mobileConsoleView, setMobileConsoleView] = useState<'tower' | 'monitor' | 'comms'>('monitor');
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

  // 4-Stage Game Cycle Phase: mode_select -> briefing -> race -> debrief
  const [simulatorPhase, setSimulatorPhase] = useState<SimulatorPhase>('mode_select');

  // Current simulation progression
  const [challengeLap, setChallengeLap] = useState<number>(1);
  const [challengePlaying, setChallengePlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1); // 0.5x, 1x, 2x, 5x
  const [autoPauseEnabled, setAutoPauseEnabled] = useState<boolean>(true);
  const [autoPauseAlert, setAutoPauseAlert] = useState<string | null>(null);
  const [triggeredAutoPauseEvents, setTriggeredAutoPauseEvents] = useState<Set<string>>(new Set());
  const [userAssistLevel, setUserAssistLevel] = useState<'assisted' | 'expert'>('assisted');
  const [currentProgressPct, setCurrentProgressPct] = useState<number>(0);
  const [lapTimeRemainingMs, setLapTimeRemainingMs] = useState<number>(5500);
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

  // Merge pre-race target pit stop with real-time tactical overrides
  const effectivePlayerTacticalCommands = useMemo(() => {
    const commands = { ...playerTacticalCommands };
    const boxLap = customTargetBoxLap || effectiveTargetBoxLap;
    const boxCmp = customTargetCompound || nextCompoundChoice;
    // CRITICAL: NEVER automatically schedule a pit stop on Lap 1! Pit stops happen from Lap 2 onwards.
    // Ensure the pre-race scheduled pit stop persists unless the user explicitly queued/issued a pit stop command (boxNextLap)
    const hasExplicitPitCommand = Object.values(commands).some((c) => c?.boxNextLap);
    if (boxLap && boxLap > 1 && boxCmp && !hasExplicitPitCommand) {
      commands[boxLap] = {
        ...commands[boxLap],
        boxNextLap: true,
        nextCompound: boxCmp,
      };
    }
    return commands;
  }, [playerTacticalCommands, customTargetBoxLap, effectiveTargetBoxLap, customTargetCompound, nextCompoundChoice]);

  // Compute snapshots dynamically from engine with AI difficulty & incident risk tuning
  const challengeSnapshots = useMemo<SimSnapshot[]>(() => {
    const allDrivers = [
      effectivePlayerConfig,
      activeScenario.teammateConfig,
      ...activeScenario.rivals,
    ];
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
    });
  }, [
    activeScenario,
    effectivePlayerConfig,
    effectivePlayerTacticalCommands,
    radioResponses,
    aiDifficulty,
    incidentRiskMultiplier,
    raceLengthMode,
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

  // Check for incoming radio prompt and play audio beep
  useEffect(() => {
    if (currentSnapshot?.activeRadioPrompt) {
      const promptId = currentSnapshot.activeRadioPrompt.id;
      if (!playedChirpIdsRef.current.has(promptId)) {
        playedChirpIdsRef.current.add(promptId);
        if (radioAudioEnabled) {
          playF1RadioChirp();
        }
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
    const baseLapSec = activeScenario.circuit.baseLapTime || 90.0;
    return Math.round((baseLapSec * 1000) / playbackSpeed);
  }, [activeScenario.circuit.baseLapTime, playbackSpeed]);

  // Real-time lap progress percentage (0% to 100%) for live track GPS motion
  useEffect(() => {
    if (challengePlaying) {
      const elapsed = Math.max(0, currentIntervalMs - lapTimeRemainingMs);
      const pct = Math.min(100, Math.max(0, (elapsed / currentIntervalMs) * 100));
      setCurrentProgressPct(pct);
    }
  }, [challengePlaying, currentIntervalMs, lapTimeRemainingMs]);

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

  // Live intra-lap telemetry physics calculations (dynamic micro-variations based on lapProgressPct)
  const liveTelemetry = useMemo(() => {
    if (!playerCar) return null;
    const progress = lapProgressPct; // 0 to 100
    const rad = (progress / 100) * Math.PI * 4; // 2 complete cornering/straight cycles per lap

    // Dynamic tyre surface temperature:
    // Corners (lateral load) spike surface temp by +2.5~3.5°C, straights cool down
    const corneringHeat = Math.sin(rad) * 2.8;
    const puModeHeat =
      playerCar.puMode === 'push'
        ? (progress / 100) * 3.5
        : playerCar.puMode === 'conserve'
        ? -(progress / 100) * 2.0
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
      (playerCar.brakeTemp || 520) + brakeSpike - (playerCar.puMode === 'conserve' ? 60 : 0)
    );

    // Dynamic ERS SOC: discharges on exit/straights, recharges under braking
    const ersOscillation = Math.cos(rad) * 3;
    const liveErsSoc = Math.min(100, Math.max(5, Math.round(playerCar.ersBatterySoc + ersOscillation)));

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
    };
  }, [playerCar, lapProgressPct, currentSnapshot?.rainRadar]);

  // Auto-pause triggers on critical tactical events (Each event triggers at most once to allow PLAY resume)
  useEffect(() => {
    if (!autoPauseEnabled || !challengePlaying) return;

    // 1. Radio Prompt arrived and not yet answered
    if (currentSnapshot?.activeRadioPrompt && !radioResponses[currentSnapshot.activeRadioPrompt.id]) {
      const eventKey = `radio-${currentSnapshot.activeRadioPrompt.id}`;
      if (!triggeredAutoPauseEvents.has(eventKey)) {
        setTriggeredAutoPauseEvents((prev) => new Set(prev).add(eventKey));
        setChallengePlaying(false);
        setAutoPauseAlert(
          `📻 ${currentSnapshot.activeRadioPrompt.speaker} から緊急無線着信！指示を選択してください。`
        );
        return;
      }
    }

    // 2. Safety Car deployed
    const isPrevLapSc = challengeLap > 1 && !!challengeSnapshots[challengeLap - 2]?.isSC;
    if (currentSnapshot?.isSC && !isPrevLapSc) {
      const eventKey = `sc-${challengeLap}`;
      if (!triggeredAutoPauseEvents.has(eventKey)) {
        setTriggeredAutoPauseEvents((prev) => new Set(prev).add(eventKey));
        setChallengePlaying(false);
        setAutoPauseAlert('🚨 セーフティカー出動！通常22秒のピットロスが11秒に半減するチープピットの好機です。');
        return;
      }
    }

    // 3. Rain Crossover reached (Slick -> Inter)
    if (
      currentSnapshot &&
      currentSnapshot.rainRadar.waterDepthMm >= 1.0 &&
      challengeLap === activeScenario.actualRainLap
    ) {
      const eventKey = `rain-crossover-lap-${challengeLap}`;
      if (!triggeredAutoPauseEvents.has(eventKey)) {
        setTriggeredAutoPauseEvents((prev) => new Set(prev).add(eventKey));
        setChallengePlaying(false);
        setAutoPauseAlert(
          '🌧️ 路面水量が1.0mm突破！インターミディエイトへのクロスオーバー（履き替え分岐点）に到達しました。'
        );
        return;
      }
    }

    // 4. Drying Track Crossover reached (Inter -> Slick decision)
    if (
      currentSnapshot &&
      currentSnapshot.rainRadar.trackPhase === 'DRYING_LINE' &&
      currentSnapshot.rainRadar.waterDepthMm <= 0.85 &&
      (playerCar?.tyreCompound === 'INTER' || playerCar?.tyreCompound === 'WET')
    ) {
      const eventKey = `drying-crossover-lap-${challengeLap}`;
      if (!triggeredAutoPauseEvents.has(eventKey)) {
        setTriggeredAutoPauseEvents((prev) => new Set(prev).add(eventKey));
        setChallengePlaying(false);
        setAutoPauseAlert(
          '⚡ ドライライン形成中！レコードラインが乾燥しスリックへのクロスオーバー（履き替え分岐点）に到達しました。'
        );
        return;
      }
    }
  }, [
    challengePlaying,
    autoPauseEnabled,
    currentSnapshot,
    radioResponses,
    challengeLap,
    activeScenario,
    triggeredAutoPauseEvents,
    playerCar?.tyreCompound,
    challengeSnapshots,
  ]);

  // Auto playback loop with countdown (only runs when simulatorPhase === 'race')
  useEffect(() => {
    if (challengePlaying && simulatorPhase === 'race') {
      setLapTimeRemainingMs(currentIntervalMs);
      const stepMs = 100;
      let elapsed = 0;

      const progressInterval = setInterval(() => {
        elapsed += stepMs;
        setLapTimeRemainingMs(Math.max(0, currentIntervalMs - elapsed));
      }, stepMs);

      challengeTimerRef.current = setInterval(() => {
        setChallengeLap((prev) => {
          if (prev >= activeScenario.totalLaps) {
            setChallengePlaying(false);
            return prev;
          }
          return prev + 1;
        });
        elapsed = 0;
        setLapTimeRemainingMs(currentIntervalMs);
      }, currentIntervalMs);

      return () => {
        clearInterval(progressInterval);
        if (challengeTimerRef.current) clearInterval(challengeTimerRef.current);
      };
    } else {
      if (challengeTimerRef.current) {
        clearInterval(challengeTimerRef.current);
        challengeTimerRef.current = null;
      }
    }
  }, [challengePlaying, simulatorPhase, activeScenario.totalLaps, currentIntervalMs]);

  // Evaluate score and diagnose strategist archetype & badges when race completes
  useEffect(() => {
    if (challengeLap >= activeScenario.totalLaps && challengeSnapshots.length > 0) {
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
    // pit stop must be scheduled for the NEXT lap (challengeLap + 1).
    const targetBoxLap = pitProximity.isCommitmentZone || lapProgressPct >= 90
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
  };

  const handleCompoundChange = (comp: TyreCompound) => {
    if (radioAudioEnabled) playF1OutgoingRadioBeep();
    setNextCompoundChoice(comp);
    const targetBoxLap = pitProximity.isCommitmentZone || lapProgressPct >= 90
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

    setPlayerTacticalCommands((prev) => ({
      ...prev,
      [targetLap]: {
        ...prev[targetLap],
        puMode: mode,
      },
    }));
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
  }, [userAssistLevel, currentSnapshot, playerCar, challengeLap, activeScenario, pitProximity, boxQueuedForNextLap, ersEligibility]);

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
  };

  // Radio dialogue response
  const handleRadioResponse = (promptId: string, option: any) => {
    if (radioAudioEnabled) playF1OutgoingRadioBeep();
    setRadioResponses((prev) => ({ ...prev, [promptId]: option.id }));

    if (option.actionType === 'box') {
      if (radioAudioEnabled) {
        playBoxBoxCall();
      }
      setBoxQueuedForNextLap(true);
      if (option.targetCompound) setNextCompoundChoice(option.targetCompound);
      setPlayerTacticalCommands((prev) => ({
        ...prev,
        [challengeLap]: {
          ...prev[challengeLap],
          boxNextLap: true,
          nextCompound: option.targetCompound || nextCompoundChoice,
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
      }));
    } else if (option.actionType === 'pu_mode' && option.targetPUMode) {
      handlePuModeChange(option.targetPUMode);
    }
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
  }) => {
    const cId = overrides?.circuitId || selectedCircuitId;
    const pCode = overrides?.playerCode || selectedPlayerCode;
    const laps = overrides?.totalLaps || sandboxLaps;
    const weather = overrides?.weatherType || sandboxWeather;
    const rainLap = overrides?.rainStartLap ?? sandboxRainLap;
    const rainMm = overrides?.rainIntensityMm ?? sandboxRainIntensity;
    const incFreq = overrides?.incidentFrequency || sandboxIncidentFreq;

    const scenario = generateSandboxScenario({
      circuitId: cId,
      playerCode: pCode,
      totalLaps: laps,
      weatherType: weather,
      rainStartLap: rainLap,
      rainIntensityMm: rainMm,
      incidentFrequency: incFreq,
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
    setPlayerTacticalCommands({});
    setRadioResponses({});
    setBoxQueuedForNextLap(false);
    setActivePuMode('standard');
    setErsBoostUsedThisLap(false);
    setActiveTeamOrder('none');
    setTacticalScore(null);
    setDiagnosticResult(null);
    setDebriefTab('score');
    setGeminiDebrief(null);
    setAutoPauseAlert(null);
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
    setAutoPauseAlert(null);
    setSimulatorPhase('race');
  };

  const handleRestartRace = () => {
    setChallengeLap(1);
    setChallengePlaying(true);
    setPlayerTacticalCommands({});
    setRadioResponses({});
    setBoxQueuedForNextLap(false);
    setActivePuMode('standard');
    setErsBoostUsedThisLap(false);
    setActiveTeamOrder('none');
    setTacticalScore(null);
    setDiagnosticResult(null);
    setDebriefTab('score');
    setGeminiDebrief(null);
    setAutoPauseAlert(null);
    playedChirpIdsRef.current.clear();
    setSimulatorPhase('race');
  };

  const handleBackToBriefing = () => {
    setChallengeLap(1);
    setChallengePlaying(false);
    setPlayerTacticalCommands({});
    setRadioResponses({});
    setBoxQueuedForNextLap(false);
    setActivePuMode('standard');
    setErsBoostUsedThisLap(false);
    setActiveTeamOrder('none');
    setTacticalScore(null);
    setDiagnosticResult(null);
    setDebriefTab('score');
    setGeminiDebrief(null);
    setAutoPauseAlert(null);
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

司令官タイプの特徴（長所・短所）にも触れつつ、具体的な周回と判断を挙げながら、どこでタイムを得した／損したのか（アンダーカット、ダーティエア、ダブルスタック、タイヤクリフ等）を熱く分かりやすく論評してください。`;

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

          {/* Auto Pause Toggle Button */}
          <button
            type="button"
            onClick={() => setAutoPauseEnabled(!autoPauseEnabled)}
            className={`btn-console flex items-center gap-1 text-xs px-2 py-0.5 ${
              autoPauseEnabled
                ? 'bg-amber-950/50 border-amber-500/40 text-amber-300'
                : 'bg-slate-900 border-white/10 text-slate-500'
            }`}
            title="緊急無線やSC出動時に自動で一時停止し、長考・確認できるようにします"
          >
            <ShieldAlert className="w-3 h-3" />
            <span className="font-mono text-[10px] font-bold hidden sm:inline">
              PAUSE: {autoPauseEnabled ? 'ON' : 'OFF'}
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
        <div className="space-y-4 animate-in fade-in zoom-in-95 duration-300">
          {/* 1. Strategist Career Status Hero Card */}
          <div className="glass-card-premium p-4 sm:p-5 rounded-3xl border-2 border-red-500/40 shadow-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-red-950/30">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-600 via-rose-600 to-amber-600 flex items-center justify-center text-3xl shadow-xl shadow-red-950/60 border border-red-400/40 shrink-0">
                  🏆
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-amber-400 font-bold tracking-wider uppercase">
                      FIA STRATEGIST LICENSE
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-red-600 text-white font-racing font-black text-xs shadow-md">
                      GRADE {careerData.grade}
                    </span>
                  </div>
                  <h2 className="font-racing font-black text-white text-xl sm:text-2xl tracking-wide">
                    F1 ピットウォール司令塔シミュレーター
                  </h2>
                  <p className="text-xs text-slate-300 mt-0.5">
                    レース戦略の最高責任者として、22台が凌ぎを削る過酷なグランプリで栄冠を勝ち取れ。
                  </p>
                </div>
              </div>

              {/* Career Stats Grid */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 shrink-0">
                <div className="px-3 py-2 rounded-xl bg-slate-950/80 border border-white/10 text-center min-w-[75px]">
                  <div className="text-[10px] font-mono text-slate-400">累計CP</div>
                  <div className="font-racing font-bold text-amber-400 text-sm sm:text-base">
                    {careerData.totalCp.toLocaleString()}
                  </div>
                </div>
                <div className="px-3 py-2 rounded-xl bg-slate-950/80 border border-amber-500/30 text-center min-w-[75px] shadow-sm">
                  <div className="text-[10px] font-mono text-amber-400 font-bold">トロフィー</div>
                  <div className="font-racing font-bold text-amber-300 text-sm sm:text-base flex items-center justify-center gap-1">
                    <span>🏆</span>
                    <span>{Object.keys(careerData.clearedScenarios || {}).length}</span>
                    <span className="text-[10px] text-slate-400 font-normal">
                      ({Object.values(careerData.clearedScenarios || {}).filter(c => c.trophy === 'gold').length}金)
                    </span>
                  </div>
                </div>
                <div className="px-3 py-2 rounded-xl bg-slate-950/80 border border-white/10 text-center min-w-[75px]">
                  <div className="text-[10px] font-mono text-slate-400">戦術バッジ</div>
                  <div className="font-racing font-bold text-cyan-300 text-sm sm:text-base">
                    {careerData.unlockedBadgeIds.length} / 25
                  </div>
                </div>
                <div className="px-3 py-2 rounded-xl bg-slate-950/80 border border-white/10 text-center min-w-[75px]">
                  <div className="text-[10px] font-mono text-slate-400">通算戦績</div>
                  <div className="font-racing font-bold text-white text-sm sm:text-base">
                    {careerData.totalWins}勝 / {careerData.totalRacesCompleted}戦
                  </div>
                </div>
                <div className="px-3 py-2 rounded-xl bg-slate-950/80 border border-white/10 text-center min-w-[75px]">
                  <div className="text-[10px] font-mono text-slate-400">最高得点</div>
                  <div className="font-racing font-bold text-emerald-400 text-sm sm:text-base">
                    {careerData.highestScore}点
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsCareerModalOpen(true)}
                  className="btn-console px-3.5 py-2.5 text-xs font-racing font-bold text-amber-300 border-amber-500/40 hover:bg-amber-950/60 flex items-center gap-1.5 shadow-lg shadow-amber-950/30"
                >
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>キャリア手帳 ➔</span>
                </button>
              </div>
            </div>
          </div>

          {/* 2. Major Category Selector (実践 vs 自由練習) */}
          <div className="glass-card-premium p-4 rounded-2xl border border-white/10 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
              <div>
                <span className="text-xs font-mono text-slate-400 font-bold uppercase tracking-wider block">
                  SELECT GAME MODE / ゲームモード選択
                </span>
                <p className="text-xs text-slate-300">
                  挑戦したいカテゴリーを選択してください。
                </p>
              </div>

              <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-white/10">
                <button
                  type="button"
                  onClick={() => {
                    setMajorCategory('battle');
                    if (gameMode === 'sandbox') {
                      startPresetCrisis(presetIdx);
                    }
                  }}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-racing font-bold transition-all cursor-pointer ${
                    majorCategory === 'battle'
                      ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md shadow-red-950 ring-1 ring-red-400/50'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Trophy className="w-3.5 h-3.5 text-yellow-400" />
                  <span>⚔️ 実践モード (本番チャレンジ)</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMajorCategory('practice');
                    startSandboxMode();
                  }}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-racing font-bold transition-all cursor-pointer ${
                    majorCategory === 'practice'
                      ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-950 ring-1 ring-cyan-400/50'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-300" />
                  <span>🔬 自由練習 (Sandbox Lab)</span>
                </button>
              </div>
            </div>

            {/* Sub-modes for Battle */}
            {majorCategory === 'battle' ? (
              <div className="space-y-4">
                {/* Sub-mode Tab Buttons */}
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setGameMode('crisis');
                      setCustomScenario(null);
                    }}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-racing font-bold transition-all border cursor-pointer ${
                      gameMode === 'crisis' || gameMode === 'scenario'
                        ? 'bg-red-950/80 border-red-500 text-white shadow-lg shadow-red-950/50'
                        : 'bg-slate-900/80 border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    <span>📜 名場面シナリオ (5-9周)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setGameMode('sprint');
                      startSprintRace(selectedCircuitId, selectedPlayerCode);
                    }}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-racing font-bold transition-all border cursor-pointer ${
                      gameMode === 'sprint'
                        ? 'bg-red-950/80 border-red-500 text-white shadow-lg shadow-red-950/50'
                        : 'bg-slate-900/80 border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Flag className="w-3.5 h-3.5 text-yellow-400" />
                    <span>🏆 スプリント全周回 (15-20周)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setGameMode('mission');
                      startMission(selectedMissionIdx);
                    }}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-racing font-bold transition-all border cursor-pointer ${
                      gameMode === 'mission'
                        ? 'bg-purple-950/80 border-purple-500 text-white shadow-lg shadow-purple-950/50'
                        : 'bg-slate-900/80 border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    <ShieldAlert className="w-3.5 h-3.5 text-purple-400" />
                    <span>🎯 特務ミッション (特殊指令)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setGameMode('procedural');
                      startProceduralCrisis();
                    }}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-racing font-bold transition-all border cursor-pointer ${
                      gameMode === 'procedural'
                        ? 'bg-pink-950/80 border-pink-500 text-white shadow-lg shadow-pink-950/50'
                        : 'bg-slate-900/80 border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Compass className="w-3.5 h-3.5 text-pink-400" />
                    <span>🎲 突発クライシス (一期一会)</span>
                  </button>
                </div>

                {/* Sub-mode 1: Preset Scenarios Grid */}
                {(gameMode === 'crisis' || gameMode === 'scenario') && (
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-racing text-slate-300 font-bold">
                        シナリオを選択してブリーフィングへ進む:
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        全{PRESET_CHALLENGES.length}シナリオ収録
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {PRESET_CHALLENGES.map((sc, idx) => {
                        const isActive = presetIdx === idx && !customScenario;
                        const clearRecord = careerData.clearedScenarios?.[sc.id];
                        return (
                          <button
                            key={sc.id}
                            type="button"
                            onClick={() => startPresetCrisis(idx)}
                            className={`text-left p-3.5 rounded-2xl border transition-all relative overflow-hidden flex flex-col justify-between gap-2.5 group cursor-pointer ${
                              isActive
                                ? 'bg-gradient-to-br from-red-950/80 to-slate-900 border-red-500 ring-2 ring-red-500 shadow-xl shadow-red-950/60'
                                : 'bg-slate-900/90 border-white/10 hover:border-red-500/60 hover:bg-slate-850'
                            }`}
                          >
                            <div className="space-y-1.5">
                              <div className="flex items-center justify-between gap-1">
                                <span className="text-xs font-mono text-slate-300 flex items-center gap-1.5">
                                  <span className="text-base">{sc.circuit.flag}</span>
                                  <span className="font-bold">{sc.circuit.name}</span>
                                </span>
                                <div className="flex items-center gap-1">
                                  {clearRecord && (
                                    <span
                                      className={`px-1.5 py-0.5 rounded text-[10px] font-racing font-bold flex items-center gap-0.5 shadow-sm ${
                                        clearRecord.trophy === 'gold'
                                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50'
                                          : clearRecord.trophy === 'silver'
                                          ? 'bg-slate-300/20 text-slate-200 border border-slate-400/50'
                                          : 'bg-amber-800/30 text-amber-400 border border-amber-700/50'
                                      }`}
                                    >
                                      <span>{clearRecord.trophy === 'gold' ? '🏆 GOLD' : clearRecord.trophy === 'silver' ? '🥈 SILVER' : '🥉 BRONZE'}</span>
                                    </span>
                                  )}
                                  <span
                                    className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold ${
                                      sc.difficulty === 'hard'
                                        ? 'bg-red-900/60 text-red-300 border border-red-500/30'
                                        : sc.difficulty === 'normal'
                                        ? 'bg-amber-900/60 text-amber-300 border border-amber-500/30'
                                        : 'bg-emerald-900/60 text-emerald-300 border border-emerald-500/30'
                                    }`}
                                  >
                                    {sc.difficulty}
                                  </span>
                                </div>
                              </div>
                              <h4 className="font-racing font-bold text-white text-sm group-hover:text-red-400 transition-colors">
                                {sc.title}
                              </h4>
                              <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                                {sc.description}
                              </p>
                            </div>

                            <div className="flex items-center justify-between text-xs font-mono pt-2 border-t border-white/10 text-slate-400">
                              <span className="text-red-400 font-bold">目標: P{sc.targetPosition}以内</span>
                              <span>全{sc.totalLaps}周</span>
                              <span className="text-amber-300 flex items-center gap-1">
                                {clearRecord ? (
                                  <span className="text-emerald-400 font-bold flex items-center gap-0.5">
                                    <CheckCircle2 className="w-3 h-3 text-emerald-400" /> 制覇済
                                  </span>
                                ) : (
                                  <span>作戦室へ ➔</span>
                                )}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Sub-mode 2: Sprint Race Setup */}
                {gameMode === 'sprint' && (
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-950 to-red-950/40 border border-red-500/30 space-y-4">
                    <div className="flex items-center gap-2">
                      <Flag className="w-5 h-5 text-yellow-400" />
                      <div>
                        <h4 className="font-racing font-bold text-white text-sm sm:text-base">
                          スプリントレース (15〜20周・本格周回バトル)
                        </h4>
                        <p className="text-xs text-slate-300">
                          サーキットと担当ドライバーを選択し、フルグリッド22台との戦略戦に挑みます。
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="p-3 rounded-xl bg-slate-900 border border-white/10 space-y-1">
                        <label className="text-xs font-mono text-slate-400 block">開催サーキット</label>
                        <select
                          value={selectedCircuitId}
                          onChange={(e) => setSelectedCircuitId(e.target.value)}
                          className="w-full bg-slate-950 text-white font-racing font-bold text-sm p-2 rounded-lg border border-white/10 cursor-pointer focus:outline-none"
                        >
                          {SIM_CIRCUITS.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.flag} {c.name} ({c.country})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-900 border border-white/10 space-y-1">
                        <label className="text-xs font-mono text-slate-400 block">担当自車ドライバー</label>
                        <select
                          value={selectedPlayerCode}
                          onChange={(e) => setSelectedPlayerCode(e.target.value)}
                          className="w-full bg-slate-950 text-white font-racing font-bold text-sm p-2 rounded-lg border border-white/10 cursor-pointer focus:outline-none"
                        >
                          {GRID_DRIVERS.map((d) => (
                            <option key={d.code} value={d.code}>
                              #{d.number} {d.name} ({d.team})
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => startSprintRace(selectedCircuitId, selectedPlayerCode)}
                        className="btn-console-primary px-6 py-2.5 text-xs font-racing font-bold flex items-center gap-2 shadow-xl shadow-red-950"
                      >
                        <span>🚀 スプリントレース作戦室へ進む ➔</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Sub-mode 3: Grand Missions Grid */}
                {gameMode === 'mission' && (
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-racing text-slate-300 font-bold">
                        特務ミッションを選択してブリーフィングへ進む:
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        全{MISSION_CHALLENGES.length}ミッション収録
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                      {MISSION_CHALLENGES.map((m, idx) => {
                        const isActive = selectedMissionIdx === idx && gameMode === 'mission';
                        const clearRecord = careerData.clearedScenarios?.[m.id];
                        return (
                          <button
                            key={m.id}
                            type="button"
                            onClick={() => startMission(idx)}
                            className={`text-left p-3.5 rounded-2xl border transition-all relative overflow-hidden flex flex-col justify-between gap-2.5 group cursor-pointer ${
                              isActive
                                ? 'bg-gradient-to-br from-purple-950/80 to-slate-900 border-purple-500 ring-2 ring-purple-500 shadow-xl shadow-purple-950/60'
                                : 'bg-slate-900/90 border-white/10 hover:border-purple-500/60 hover:bg-slate-850'
                            }`}
                          >
                            <div className="space-y-1.5">
                              <div className="flex items-center justify-between gap-1">
                                <span className="text-xs font-mono text-purple-300 font-bold flex items-center gap-1">
                                  <span>#{m.playerConfig.number} {m.playerConfig.code}</span>
                                </span>
                                <div className="flex items-center gap-1">
                                  {clearRecord && (
                                    <span
                                      className={`px-1.5 py-0.5 rounded text-[10px] font-racing font-bold flex items-center gap-0.5 shadow-sm ${
                                        clearRecord.trophy === 'gold'
                                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50'
                                          : clearRecord.trophy === 'silver'
                                          ? 'bg-slate-300/20 text-slate-200 border border-slate-400/50'
                                          : 'bg-amber-800/30 text-amber-400 border border-amber-700/50'
                                      }`}
                                    >
                                      <span>{clearRecord.trophy === 'gold' ? '🏆 GOLD' : clearRecord.trophy === 'silver' ? '🥈 SILVER' : '🥉 BRONZE'}</span>
                                    </span>
                                  )}
                                  <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold bg-purple-900/60 text-purple-300 border border-purple-500/30">
                                    {m.difficulty}
                                  </span>
                                </div>
                              </div>
                              <h4 className="font-racing font-bold text-white text-sm group-hover:text-purple-400 transition-colors">
                                {m.title}
                              </h4>
                              <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                                {m.description}
                              </p>
                            </div>

                            <div className="flex items-center justify-between text-xs font-mono pt-2 border-t border-white/10 text-slate-400">
                              <span className="text-purple-300 font-bold">目標: P{m.targetPosition}以内</span>
                              <span>全{m.totalLaps}周</span>
                              <span className="text-purple-300">
                                {clearRecord ? (
                                  <span className="text-emerald-400 font-bold flex items-center gap-0.5">
                                    <CheckCircle2 className="w-3 h-3 text-emerald-400" /> 制覇済
                                  </span>
                                ) : (
                                  <span>作戦室へ ➔</span>
                                )}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Sub-mode 4: Procedural Crisis */}
                {gameMode === 'procedural' && (
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-950 to-pink-950/40 border border-pink-500/30 space-y-4">
                    <div className="flex items-center gap-2">
                      <Compass className="w-5 h-5 text-pink-400" />
                      <div>
                        <h4 className="font-racing font-bold text-white text-sm sm:text-base">
                          突発クライシス (一期一会のランダム危機脱出)
                        </h4>
                        <p className="text-xs text-slate-300">
                          サーキット、天候急変、セーフティカー出動、前後のライバル状況がすべてランダムに生成される無限のシナリオです。
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={startProceduralCrisis}
                        className="btn-console px-6 py-2.5 text-xs font-racing font-bold text-pink-300 border-pink-500/40 hover:bg-pink-950/60 flex items-center gap-2 shadow-xl shadow-pink-950"
                      >
                        <RotateCcw className="w-4 h-4" />
                        <span>🎲 新しい突発危機を生成して作戦室へ ➔</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Practice / Sandbox Setup Panel */
              <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-950 to-cyan-950/30 border border-cyan-500/30 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-cyan-500/20">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🧪</span>
                    <div>
                      <h4 className="font-racing font-bold text-white text-sm sm:text-base">
                        FREE PRACTICE & STRATEGY SANDBOX / 自由練習シミュレーション
                      </h4>
                      <p className="text-xs text-slate-300">
                        コース、自車、周回数、天候条件、SC頻度を完全自由にカスタムして検証できます。
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 text-xs">
                  {/* Track */}
                  <div className="p-2.5 rounded-xl bg-slate-900/90 border border-white/10 space-y-1">
                    <label className="text-[10px] font-mono text-slate-400 block">サーキット</label>
                    <select
                      value={selectedCircuitId}
                      onChange={(e) => {
                        setSelectedCircuitId(e.target.value);
                        startSandboxMode({ circuitId: e.target.value });
                      }}
                      className="w-full bg-transparent text-xs text-white font-racing font-bold focus:outline-none cursor-pointer"
                    >
                      {SIM_CIRCUITS.map((c) => (
                        <option key={c.id} value={c.id} className="bg-slate-900 text-white">
                          {c.flag} {c.name.split(' ')[0]}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Driver */}
                  <div className="p-2.5 rounded-xl bg-slate-900/90 border border-white/10 space-y-1">
                    <label className="text-[10px] font-mono text-slate-400 block">自車ドライバー</label>
                    <select
                      value={selectedPlayerCode}
                      onChange={(e) => {
                        setSelectedPlayerCode(e.target.value);
                        startSandboxMode({ playerCode: e.target.value });
                      }}
                      className="w-full bg-transparent text-xs text-white font-racing font-bold focus:outline-none cursor-pointer"
                    >
                      {GRID_DRIVERS.map((d) => (
                        <option key={d.code} value={d.code} className="bg-slate-900 text-white">
                          #{d.number} {d.code} ({d.team.split(' ')[0]})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Laps */}
                  <div className="p-2.5 rounded-xl bg-slate-900/90 border border-white/10 space-y-1">
                    <label className="text-[10px] font-mono text-slate-400 block">周回数: {sandboxLaps}周</label>
                    <select
                      value={sandboxLaps}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setSandboxLaps(val);
                        startSandboxMode({ totalLaps: val });
                      }}
                      className="w-full bg-transparent text-xs text-white font-mono focus:outline-none cursor-pointer"
                    >
                      {[5, 8, 10, 15, 20].map((l) => (
                        <option key={l} value={l} className="bg-slate-900 text-white">
                          全{l}周
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Weather */}
                  <div className="p-2.5 rounded-xl bg-slate-900/90 border border-white/10 space-y-1">
                    <label className="text-[10px] font-mono text-slate-400 block">天候</label>
                    <select
                      value={sandboxWeather}
                      onChange={(e) => {
                        const val = e.target.value as WeatherType;
                        setSandboxWeather(val);
                        startSandboxMode({ weatherType: val });
                      }}
                      className="w-full bg-transparent text-xs text-white font-racing font-bold focus:outline-none cursor-pointer"
                    >
                      <option value="dry" className="bg-slate-900 text-white">☀️ 快晴ドライ</option>
                      <option value="variable" className="bg-slate-900 text-white">⛅ 急変警戒</option>
                      <option value="drizzle" className="bg-slate-900 text-white">🌤️ 雨上がり</option>
                      <option value="monsoon" className="bg-slate-900 text-white">🌊 豪雨</option>
                    </select>
                  </div>

                  {/* Rain Lap */}
                  <div className="p-2.5 rounded-xl bg-slate-900/90 border border-white/10 space-y-1">
                    <label className="text-[10px] font-mono text-slate-400 block">降雨周回</label>
                    <select
                      value={sandboxRainLap}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setSandboxRainLap(val);
                        startSandboxMode({ rainStartLap: val });
                      }}
                      disabled={sandboxWeather === 'dry'}
                      className="w-full bg-transparent text-xs text-white font-mono focus:outline-none cursor-pointer disabled:opacity-40"
                    >
                      {Array.from({ length: sandboxLaps }, (_, i) => i + 1).map((l) => (
                        <option key={l} value={l} className="bg-slate-900 text-white">
                          Lap {l}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Incident */}
                  <div className="p-2.5 rounded-xl bg-slate-900/90 border border-white/10 space-y-1">
                    <label className="text-[10px] font-mono text-slate-400 block">SC発生頻度</label>
                    <select
                      value={sandboxIncidentFreq}
                      onChange={(e) => {
                        const val = e.target.value as IncidentFrequency;
                        setSandboxIncidentFreq(val);
                        startSandboxMode({ incidentFrequency: val });
                      }}
                      className="w-full bg-transparent text-xs text-white font-mono focus:outline-none cursor-pointer"
                    >
                      <option value="none" className="bg-slate-900 text-white">OFF (なし)</option>
                      <option value="realistic" className="bg-slate-900 text-white">標準 (路面連動)</option>
                      <option value="high_chaos" className="bg-slate-900 text-white">カオス (多発)</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => startSandboxMode()}
                    className="btn-console px-6 py-2.5 text-xs font-racing font-bold text-cyan-300 border-cyan-500/40 hover:bg-cyan-950/60 flex items-center gap-2 shadow-xl shadow-cyan-950"
                  >
                    <span>🔬 自由シミュレーション作戦室へ進む ➔</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════════════
          PHASE 2: 📋 BRIEFING & SETUP SCREEN (作戦ブリーフィング＆初期設定画面)
          ════════════════════════════════════════════════════════════════════════ */}
      {simulatorPhase === 'briefing' && (
        <div className="space-y-4 animate-in fade-in zoom-in-95 duration-300">
          {/* Briefing Header Banner */}
          <div className="glass-card-premium p-4 rounded-2xl border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-slate-950 via-slate-900 to-red-950/40">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base">📋</span>
                <span className="font-racing font-black text-white text-base sm:text-lg tracking-wider">
                  TACTICAL BRIEFING & MACHINE SETUP / 作戦ブリーフィング
                </span>
                <span className="px-2 py-0.5 rounded bg-red-600 text-white text-[10px] font-racing font-bold uppercase">
                  {gameMode.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                レース前の作戦会議。コース特性と天候レーダーを精査し、初期タイヤ・PUモード・ピット戦略を策定してください。
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleBackToModeSelect}
                className="btn-console px-3.5 py-2 text-xs font-racing font-bold text-slate-300 hover:text-white flex items-center gap-1.5"
              >
                <span>◀</span>
                <span>モード選択へ戻る</span>
              </button>
            </div>
          </div>

          {/* 🏎️ Paddock Live Cam & Garage Bay Atmosphere */}
          <PaddockLiveAtmosphere
            teamName={effectivePlayerConfig.team}
            driverCode={effectivePlayerConfig.code}
            circuitName={activeScenario.circuit.name}
            startTyre={effectivePlayerConfig.startTyre}
            puMode={effectivePlayerConfig.machineSetup.puMode}
          />

          {/* Two-Column Briefing & Setup Deck */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Left Column: Circuit Specs, Objectives & Weather Radar */}
            <div className="lg:col-span-5 space-y-3">
              {/* Mission Target & Circuit Overview */}
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{activeScenario.circuit.flag}</span>
                    <div>
                      <h3 className="font-racing font-bold text-white text-base">
                        {activeScenario.circuit.name}
                      </h3>
                      <div className="text-[11px] font-mono text-slate-400">
                        {activeScenario.circuit.country} • 全長 {(activeScenario.circuit.circuitLengthM / 1000).toFixed(3)}km
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="px-2.5 py-1 rounded-xl bg-red-950/80 border border-red-500/40 text-red-300 font-racing font-bold text-xs">
                      目標: P{activeScenario.targetPosition} 以内
                    </span>
                    <div className="flex items-center gap-1">
                      {careerData.clearedScenarios?.[activeScenario.id] && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-racing font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1 shadow-sm">
                          <span>
                            {careerData.clearedScenarios[activeScenario.id].trophy === 'gold'
                              ? '🏆 GOLD'
                              : careerData.clearedScenarios[activeScenario.id].trophy === 'silver'
                              ? '🥈 SILVER'
                              : '🥉 BRONZE'}
                          </span>
                          <span>獲得済</span>
                        </span>
                      )}
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold ${
                          activeScenario.difficulty === 'hard'
                            ? 'bg-red-900/60 text-red-300 border border-red-500/30'
                            : activeScenario.difficulty === 'normal'
                            ? 'bg-amber-900/60 text-amber-300 border border-amber-500/30'
                            : 'bg-emerald-900/60 text-emerald-300 border border-emerald-500/30'
                        }`}
                      >
                        難易度: {activeScenario.difficulty}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-white/10 space-y-1">
                  <div className="text-[11px] font-racing font-bold text-amber-300">
                    {activeScenario.title}
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {activeScenario.description}
                  </p>
                </div>

                {/* Circuit Specs Matrix */}
                <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
                  <div className="p-2 rounded-lg bg-slate-950/60 border border-white/5">
                    <div className="text-[10px] text-slate-400">ピットロスタイム</div>
                    <div className="text-cyan-300 font-bold">{activeScenario.circuit.pitLaneLoss}s</div>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-950/60 border border-white/5">
                    <div className="text-[10px] text-slate-400">オーバーテイク</div>
                    <div className="text-amber-300 font-bold capitalize">{activeScenario.circuit.overtakeDifficulty}</div>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-950/60 border border-white/5">
                    <div className="text-[10px] text-slate-400">タイヤ攻撃性</div>
                    <div className="text-rose-300 font-bold capitalize">{activeScenario.circuit.tyreAggression}</div>
                  </div>
                </div>
              </div>

              {/* Weather Radar & SC Risk Forecast */}
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-racing font-bold text-white text-xs flex items-center gap-1.5">
                      <CloudRain className="w-4 h-4 text-sky-400" /> 天候ドップラーレーダー予報
                    </span>
                    {activeScenario.lockedSettings?.weather && (
                      <span className="px-1.5 py-0.2 rounded bg-amber-950/80 border border-amber-500/40 text-[9px] font-mono text-amber-300 flex items-center gap-0.5">
                        <Lock className="w-2.5 h-2.5" /> シナリオ固定
                      </span>
                    )}
                  </div>
                  {!activeScenario.lockedSettings?.weather && (
                    <button
                      type="button"
                      onClick={handleRerollWeather}
                      className="btn-console px-2 py-1 text-[11px] text-cyan-300 border-cyan-500/30 hover:bg-cyan-950/50 flex items-center gap-1"
                      title="天候やSC確率を再抽選"
                    >
                      <Dices className="w-3.5 h-3.5 text-cyan-400" />
                      <span>🎲 天候再抽選</span>
                    </button>
                  )}
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-white/10 space-y-2">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="w-2.5 h-2.5 rounded-full bg-sky-400 animate-ping" />
                    <span className="text-slate-200 font-mono text-[11px] leading-relaxed">
                      {activeScenario.weatherForecast.radarDesc}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-mono text-slate-400">
                      <span>降水確率: {activeScenario.weatherForecast.rainProbabilityPercent}%</span>
                      <span>
                        {activeScenario.actualRainLap
                          ? `Lap ${activeScenario.actualRainLap} 前後に雨雲到達`
                          : 'セッション中の降雨なし'}
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-sky-500 to-blue-600 transition-all duration-500"
                        style={{ width: `${activeScenario.weatherForecast.rainProbabilityPercent}%` }}
                      />
                    </div>
                  </div>
                </div>

                {activeScenario.lockedSettings?.weather && activeScenario.lockedSettings.lockReason && (
                  <div className="p-2 rounded-lg bg-amber-950/40 border border-amber-500/30 text-[10px] font-mono text-amber-300/90 flex items-start gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <span>{activeScenario.lockedSettings.lockReason}</span>
                  </div>
                )}

                {/* Weather Customizer Controls */}
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className={`p-2 rounded-lg bg-slate-950/80 border border-white/5 space-y-1 ${activeScenario.lockedSettings?.weather ? 'opacity-60' : ''}`}>
                    <span className="text-[10px] font-mono text-slate-400 block flex items-center justify-between">
                      <span>天候タイプ</span>
                      {activeScenario.lockedSettings?.weather && <Lock className="w-2.5 h-2.5 text-amber-400" />}
                    </span>
                    <select
                      value={activeScenario.startWeather}
                      disabled={Boolean(activeScenario.lockedSettings?.weather)}
                      onChange={(e) => {
                        const newWeather = e.target.value as WeatherType;
                        const hasRain = newWeather !== 'dry';
                        const rainLap = hasRain ? Math.max(2, Math.floor(activeScenario.totalLaps * 0.4)) : undefined;
                        const intensity = newWeather === 'monsoon' ? 4.5 : newWeather === 'drizzle' ? 1.5 : hasRain ? 2.5 : 0;
                        const updated: ChallengeScenario = {
                          ...activeScenario,
                          id: `${activeScenario.id}_custom_${Date.now()}`,
                          startWeather: newWeather,
                          weatherForecast: {
                            radarDesc: newWeather === 'monsoon'
                              ? '豪雨モンスーン警戒。路面水量4.5mm到達予想。'
                              : newWeather === 'drizzle'
                              ? '雨上がりダンプ路面。急速ドライライン形成予想。'
                              : hasRain
                              ? `雨雲接近中。Lap ${rainLap}前後に降雨予想。`
                              : '快晴ドライコンディション。天候安定。',
                            estimatedLapMin: rainLap ? Math.max(1, rainLap - 1) : 99,
                            estimatedLapMax: rainLap ? Math.min(activeScenario.totalLaps, rainLap + 2) : 99,
                            rainProbabilityPercent: hasRain ? 85 : 5,
                          },
                          actualRainLap: rainLap,
                          actualRainIntensity: intensity,
                        };
                        setCustomScenario(updated);
                        resetGameState();
                      }}
                      className="w-full bg-transparent text-xs text-white font-racing font-bold focus:outline-none cursor-pointer disabled:cursor-not-allowed"
                    >
                      <option value="dry" className="bg-slate-900 text-white">☀️ 快晴</option>
                      <option value="variable" className="bg-slate-900 text-white">⛅ 急変</option>
                      <option value="drizzle" className="bg-slate-900 text-white">🌤️ ダンプ</option>
                      <option value="monsoon" className="bg-slate-900 text-white">🌊 豪雨</option>
                    </select>
                  </div>

                  <div className={`p-2 rounded-lg bg-slate-950/80 border border-white/5 space-y-1 ${activeScenario.lockedSettings?.rainLap || activeScenario.lockedSettings?.weather ? 'opacity-60' : ''}`}>
                    <span className="text-[10px] font-mono text-slate-400 block flex items-center justify-between">
                      <span>降雨周回</span>
                      {(activeScenario.lockedSettings?.rainLap || activeScenario.lockedSettings?.weather) && <Lock className="w-2.5 h-2.5 text-amber-400" />}
                    </span>
                    <select
                      value={activeScenario.actualRainLap || 99}
                      disabled={Boolean(activeScenario.lockedSettings?.rainLap || activeScenario.lockedSettings?.weather)}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        const updated: ChallengeScenario = {
                          ...activeScenario,
                          id: `${activeScenario.id}_custom_${Date.now()}`,
                          actualRainLap: val === 99 ? undefined : val,
                          actualRainIntensity: val === 99 ? 0 : (activeScenario.actualRainIntensity || 2.5),
                        };
                        setCustomScenario(updated);
                        resetGameState();
                      }}
                      className="w-full bg-transparent text-xs text-white font-mono focus:outline-none cursor-pointer disabled:cursor-not-allowed"
                    >
                      <option value={99}>降雨なし</option>
                      {Array.from({ length: activeScenario.totalLaps }, (_, i) => i + 1).map((l) => (
                        <option key={l} value={l} className="bg-slate-900 text-white">
                          Lap {l}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="p-2 rounded-lg bg-slate-950/80 border border-white/5 space-y-1">
                    <span className="text-[10px] font-mono text-slate-400 block">SC危険度</span>
                    <select
                      value={activeScenario.scProbability > 0.7 ? 'high' : activeScenario.scProbability > 0.3 ? 'normal' : 'low'}
                      onChange={(e) => {
                        const prob = e.target.value === 'high' ? 0.85 : e.target.value === 'normal' ? 0.45 : 0.1;
                        const updated: ChallengeScenario = {
                          ...activeScenario,
                          id: `${activeScenario.id}_custom_${Date.now()}`,
                          scProbability: prob,
                          actualScLap: prob > 0.4 ? Math.max(2, Math.floor(activeScenario.totalLaps * 0.5)) : undefined,
                        };
                        setCustomScenario(updated);
                        resetGameState();
                      }}
                      className="w-full bg-transparent text-xs text-white font-mono focus:outline-none cursor-pointer"
                    >
                      <option value="low" className="bg-slate-900 text-white">低 (安全)</option>
                      <option value="normal" className="bg-slate-900 text-white">中 (標準)</option>
                      <option value="high" className="bg-slate-900 text-white">高 (波乱)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Machine Strategy & Difficulty Setup */}
            <div className="lg:col-span-7 space-y-3">
              {/* Machine Initial Setup Deck */}
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-white/10 space-y-3">
                <span className="font-racing font-bold text-white text-xs flex items-center gap-1.5">
                  <Gauge className="w-4 h-4 text-red-400" /> マシン初期戦術セットアップ
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {/* Starting Tyre Selector */}
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-white/10 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-racing text-slate-300 font-bold text-[11px] flex items-center gap-1">
                        <span>スタート装着タイヤ</span>
                        {activeScenario.lockedSettings?.startTyre && (
                          <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-amber-950/80 border border-amber-500/40 text-amber-300 flex items-center gap-0.5">
                            <Lock className="w-2.5 h-2.5" /> 固定
                          </span>
                        )}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-mono text-emerald-400 font-bold">
                          {effectivePlayerConfig.startTyre}
                        </span>
                        <button
                          type="button"
                          onClick={() => setBriefingHelpTopic('start_tyre')}
                          className="p-0.5 rounded text-slate-400 hover:text-cyan-300 hover:bg-slate-800 transition-all cursor-pointer"
                          title="スタートタイヤの戦術・ルール解説"
                        >
                          <HelpCircle className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-5 gap-1 pt-1">
                      {(['SOFT', 'MEDIUM', 'HARD', 'INTER', 'WET'] as TyreCompound[]).map((cmp) => {
                        const isSelected = effectivePlayerConfig.startTyre === cmp;
                        const isLocked = Boolean(activeScenario.lockedSettings?.startTyre);
                        const prop = TYRE_PROPERTIES[cmp];
                        return (
                          <button
                            key={cmp}
                            type="button"
                            disabled={isLocked}
                            onClick={() => !isLocked && setCustomStartingTyre(cmp)}
                            className={`p-2 rounded-lg flex flex-col items-center gap-1 border transition-all text-center ${
                              isSelected
                                ? 'bg-red-950 border-red-500 text-white shadow-lg ring-1 ring-red-500'
                                : isLocked
                                ? 'bg-slate-950/40 border-white/5 text-slate-600 opacity-30 cursor-not-allowed'
                                : 'bg-slate-900 border-white/10 text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer'
                            }`}
                            title={
                              isLocked
                                ? `${cmp} (シナリオ前提条件として固定されています)`
                                : `${cmp} (${prop.label}): 適正水深 ${prop.optimalWaterRange[0]}〜${prop.optimalWaterRange[1]}mm`
                            }
                          >
                            <span
                              className="w-2.5 h-2.5 rounded-full"
                              style={{ backgroundColor: prop.color }}
                            />
                            <span className="font-racing font-bold text-[10px]">{cmp}</span>
                          </button>
                        );
                      })}
                    </div>

                    {activeScenario.lockedSettings?.startTyre && activeScenario.lockedSettings.lockReason ? (
                      <div className="p-2 rounded-lg bg-amber-950/40 border border-amber-500/30 text-[10px] font-mono text-amber-300/90 flex items-start gap-1.5">
                        <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                        <span>{activeScenario.lockedSettings.lockReason}</span>
                      </div>
                    ) : (
                      <p className="text-[10px] text-slate-400 font-mono leading-tight">
                        {effectivePlayerConfig.startTyre === 'SOFT'
                          ? '序盤ハイペースだがデグラ大。アンダーカット推奨。'
                          : effectivePlayerConfig.startTyre === 'MEDIUM'
                          ? '最善のバランス。天候変化への柔軟性が高い。'
                          : effectivePlayerConfig.startTyre === 'HARD'
                          ? '長寿スティント。雨待ちステイアウトに適す。'
                          : effectivePlayerConfig.startTyre === 'INTER'
                          ? '降雨・ダンプ路面用 (水深0.8〜4.0mm)。'
                          : '豪雨用 (水深3.5mm以上)。'}
                      </p>
                    )}
                  </div>

                  {/* Target Pit Stop Strategy */}
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-white/10 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-racing text-slate-300 font-bold text-[11px]">
                        予定ピット戦略
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-mono text-amber-400 font-bold">
                          LAP {customTargetBoxLap || effectiveTargetBoxLap} ➔ {customTargetCompound || nextCompoundChoice}
                        </span>
                        <button
                          type="button"
                          onClick={() => setBriefingHelpTopic('pit_strategy')}
                          className="p-0.5 rounded text-slate-400 hover:text-cyan-300 hover:bg-slate-800 transition-all cursor-pointer"
                          title="ピットストップ・アンダーカット戦術解説"
                        >
                          <HelpCircle className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <span className="text-[10px] text-slate-400 shrink-0">目標周回:</span>
                      <select
                        value={customTargetBoxLap || effectiveTargetBoxLap}
                        onChange={(e) => setCustomTargetBoxLap(Number(e.target.value))}
                        className="bg-slate-900 border border-white/10 rounded-lg px-2 py-1 text-xs text-white font-mono"
                      >
                        {Array.from({ length: activeScenario.totalLaps }, (_, i) => i + 1).map((l) => (
                          <option key={l} value={l}>
                            LAP {l} {l === activeScenario.actualRainLap ? '(雨予想)' : ''}
                          </option>
                        ))}
                      </select>

                      <span className="text-[10px] text-slate-400 shrink-0">➔</span>
                      <select
                        value={customTargetCompound || nextCompoundChoice}
                        onChange={(e) => {
                          setCustomTargetCompound(e.target.value as TyreCompound);
                          setNextCompoundChoice(e.target.value as TyreCompound);
                        }}
                        className="bg-slate-900 border border-white/10 rounded-lg px-2 py-1 text-xs text-white font-racing font-bold"
                      >
                        {(['SOFT', 'MEDIUM', 'HARD', 'INTER', 'WET'] as TyreCompound[]).map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>

                    <p className="text-[10px] text-slate-400 font-mono leading-tight">
                      ※レース中いつでもリアルタイムにBOX指示・タイヤ変更が可能です。
                    </p>
                  </div>

                  {/* Initial PU Mode */}
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-white/10 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-racing text-slate-300 font-bold text-[11px]">
                        初期PUモード
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">
                          {effectivePlayerConfig.machineSetup.puMode}
                        </span>
                        <button
                          type="button"
                          onClick={() => setBriefingHelpTopic('pu_mode')}
                          className="p-0.5 rounded text-slate-400 hover:text-cyan-300 hover:bg-slate-800 transition-all cursor-pointer"
                          title="PUモード・電力マネジメント解説"
                        >
                          <HelpCircle className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-1 pt-1">
                      {[
                        { id: 'push', label: 'PUSH ⚡', desc: '序盤猛攻' },
                        { id: 'standard', label: 'STD 🏎️', desc: '巡航標準' },
                        { id: 'conserve', label: 'SAVE 🌱', desc: 'タイヤ温存' },
                      ].map((mode) => {
                        const isCurrent = effectivePlayerConfig.machineSetup.puMode === mode.id;
                        return (
                          <button
                            key={mode.id}
                            type="button"
                            onClick={() => {
                              setCustomInitialPuMode(mode.id as EnginePUMode);
                              setActivePuMode(mode.id as EnginePUMode);
                            }}
                            className={`p-2 rounded-lg text-center border transition-all cursor-pointer ${
                              isCurrent
                                ? 'bg-cyan-950 border-cyan-500 text-cyan-200 shadow-md font-bold'
                                : 'bg-slate-900 border-white/10 text-slate-400 hover:text-white'
                            }`}
                          >
                            <div className="font-racing text-[10px]">{mode.label}</div>
                            <div className="text-[9px] text-slate-400">{mode.desc}</div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Downforce & Driver Info */}
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-white/10 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-racing text-slate-300 font-bold text-[11px]">
                        自車セッティング情報
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        {effectivePlayerConfig.team}
                      </span>
                    </div>

                    <div className="space-y-1 pt-1 text-xs font-mono">
                      <div className="flex justify-between">
                        <span className="text-slate-400">ドライバー:</span>
                        <span className="text-white font-bold">#{effectivePlayerConfig.number} {effectivePlayerConfig.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">ダウンフォース:</span>
                        <span className="text-cyan-300 font-bold">{effectivePlayerConfig.machineSetup.downforce.toUpperCase()} DF</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">クリア目標:</span>
                        <span className="text-amber-400 font-bold">P{activeScenario.targetPosition} 以内</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 🏁 Race Distance & Regulation Mode Selector */}
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-racing font-bold text-white text-xs flex items-center gap-1.5">
                    <Flag className="w-4 h-4 text-red-500" /> レース距離 ＆ FIAレギュレーション
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-cyan-400 font-bold">
                      {raceLengthMode === 'gp_short_25'
                        ? '短縮GP (25%距離・ピット戦略必須)'
                        : raceLengthMode === 'gp_full_100'
                        ? 'フルGP (100%距離・本格リアル物理)'
                        : 'スプリント (無交換スプリント)'}
                    </span>
                    <button
                      type="button"
                      onClick={() => setBriefingHelpTopic('race_distance')}
                      className="p-0.5 rounded text-slate-400 hover:text-cyan-300 hover:bg-slate-800 transition-all cursor-pointer"
                      title="レース距離とレギュレーション解説"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  {/* Option 1: 25% Short GP (Recommended) */}
                  <button
                    type="button"
                    onClick={() => setRaceLengthMode('gp_short_25')}
                    className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                      raceLengthMode === 'gp_short_25'
                        ? 'bg-red-950/80 border-red-500 text-white shadow-lg ring-1 ring-red-400/50'
                        : 'bg-slate-950/80 border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center justify-between pb-1">
                      <span className="font-racing font-bold text-xs text-red-400">
                        🏁 短縮グランプリ (25%)
                      </span>
                      <span className="px-1.5 py-0.2 rounded bg-red-600/80 text-[9px] font-mono font-bold text-white">
                        オススメ
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-300 font-mono">
                      周回: 約14〜18周 (所要5〜8分)
                    </div>
                    <div className="text-[9px] text-slate-400 mt-1 leading-tight">
                      🛞 スケール摩耗 3.2倍 ＆ <strong>2種ドライタイヤ義務</strong>。短時間でアンダーカットやピットウィンドウの戦略駆け引きを凝縮！
                    </div>
                  </button>

                  {/* Option 2: 100% Full GP */}
                  <button
                    type="button"
                    onClick={() => setRaceLengthMode('gp_full_100')}
                    className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                      raceLengthMode === 'gp_full_100'
                        ? 'bg-purple-950/80 border-purple-500 text-white shadow-lg ring-1 ring-purple-400/50'
                        : 'bg-slate-950/80 border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center justify-between pb-1">
                      <span className="font-racing font-bold text-xs text-purple-400">
                        🏆 フルグランプリ (100%)
                      </span>
                      <span className="px-1.5 py-0.2 rounded bg-purple-600/80 text-[9px] font-mono font-bold text-white">
                        本格派
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-300 font-mono">
                      周回: 50〜78周 (10x速で約8分)
                    </div>
                    <div className="text-[9px] text-slate-400 mt-1 leading-tight">
                      🏎️ リアル1.0倍摩耗 ＆ 燃料減衰（100kg→0kg）。5x/10x/20xの高速シミュレーションと自動ポーズで完全なF1司令塔を体験！
                    </div>
                  </button>

                  {/* Option 3: Sprint Race */}
                  <button
                    type="button"
                    onClick={() => setRaceLengthMode('sprint')}
                    className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                      raceLengthMode === 'sprint'
                        ? 'bg-amber-950/80 border-amber-500 text-white shadow-lg ring-1 ring-amber-400/50'
                        : 'bg-slate-950/80 border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center justify-between pb-1">
                      <span className="font-racing font-bold text-xs text-amber-400">
                        ⚡ スプリントレース
                      </span>
                      <span className="px-1.5 py-0.2 rounded bg-amber-600/80 text-[9px] font-mono font-bold text-white">
                        超接近戦
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-300 font-mono">
                      周回: 15〜19周 (所要4〜6分)
                    </div>
                    <div className="text-[9px] text-slate-400 mt-1 leading-tight">
                      🔥 ピット義務なし ＆ 1.0倍摩耗。全車フラットアウトでタイヤクリフとDRSトレインを防衛する超接近バトル！
                    </div>
                  </button>
                </div>
              </div>

              {/* AI Difficulty & User Assist Deck */}
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-white/10 space-y-3">
                <span className="font-racing font-bold text-white text-xs flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-amber-400" /> 難易度 ＆ 操作アシスト設定
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {/* AI Difficulty */}
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-white/10 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-racing text-slate-300 font-bold text-[11px]">
                        AIライバル難易度
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-mono text-amber-400 font-bold">
                          {aiDifficulty === 'master' ? '🏆 金トロフィー確定' : aiDifficulty === 'standard' ? '🥈 銀トロフィー狙い' : '🥉 銅トロフィー狙い'}
                        </span>
                        <button
                          type="button"
                          onClick={() => setBriefingHelpTopic('ai_difficulty')}
                          className="p-0.5 rounded text-slate-400 hover:text-cyan-300 hover:bg-slate-800 transition-all cursor-pointer"
                          title="AI難易度とトロフィー解説"
                        >
                          <HelpCircle className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-1">
                      {[
                        { id: 'beginner', label: '初級', icon: '🌱', desc: '🥉 銅狙い' },
                        { id: 'standard', label: '標準', icon: '🏎️', desc: '🥈 銀狙い' },
                        { id: 'master', label: '達人', icon: '🏆', desc: '🏆 金確定' },
                      ].map((lvl) => (
                        <button
                          key={lvl.id}
                          type="button"
                          onClick={() => setAiDifficulty(lvl.id as any)}
                          className={`p-2 rounded-lg text-center border font-racing font-bold transition-all cursor-pointer ${
                            aiDifficulty === lvl.id
                              ? lvl.id === 'master'
                                ? 'bg-purple-950 border-purple-500 text-white shadow-md ring-1 ring-purple-400'
                                : lvl.id === 'standard'
                                ? 'bg-blue-950 border-blue-500 text-white shadow-md ring-1 ring-blue-400'
                                : 'bg-emerald-950 border-emerald-500 text-white shadow-md ring-1 ring-emerald-400'
                              : 'bg-slate-900 border-white/10 text-slate-400 hover:text-white'
                          }`}
                        >
                          <div className="text-base">{lvl.icon}</div>
                          <div className="text-[10px]">{lvl.label}</div>
                          <div className="text-[8px] text-slate-400 font-normal mt-0.5">{lvl.desc}</div>
                        </button>
                      ))}
                    </div>
                    <p className="text-[9px] text-slate-400 font-mono leading-tight">
                      ※クリア時の順位（P1優勝で🏆金）または達人AIクリアで金トロフィーを獲得できます。
                    </p>
                  </div>

                  {/* Assist Mode */}
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-white/10 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-racing text-slate-300 font-bold text-[11px]">
                        操作アシストモード
                      </span>
                      <button
                        type="button"
                        onClick={() => setBriefingHelpTopic('user_assist')}
                        className="p-0.5 rounded text-slate-400 hover:text-cyan-300 hover:bg-slate-800 transition-all cursor-pointer"
                        title="操作アシストモード解説"
                      >
                        <HelpCircle className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        type="button"
                        onClick={() => setUserAssistLevel('assisted')}
                        className={`p-2 rounded-lg text-left border font-racing font-bold transition-all cursor-pointer ${
                          userAssistLevel === 'assisted'
                            ? 'bg-emerald-950 border-emerald-500 text-emerald-300 shadow-md'
                            : 'bg-slate-900 border-white/10 text-slate-400 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-1 text-[11px]">
                          <span>🔰</span>
                          <span>アシストあり</span>
                        </div>
                        <div className="text-[9px] text-slate-400 font-normal mt-0.5">
                          計器注視点のガイダンス表示
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setUserAssistLevel('expert')}
                        className={`p-2 rounded-lg text-left border font-racing font-bold transition-all cursor-pointer ${
                          userAssistLevel === 'expert'
                            ? 'bg-cyan-950 border-cyan-500 text-cyan-300 shadow-md'
                            : 'bg-slate-900 border-white/10 text-slate-400 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-1 text-[11px]">
                          <span>🎯</span>
                          <span>エキスパート</span>
                        </div>
                        <div className="text-[9px] text-slate-400 font-normal mt-0.5">
                          助言なし・生計器データ勝負
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Action Bar: Start Race Button */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-red-950 border border-red-500/40 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-xl">
                🏁
              </div>
              <div>
                <div className="text-white font-racing font-bold text-sm">
                  作戦策定完了 — ピットウォール司令室へ
                </div>
                <div className="text-xs text-slate-400 font-mono">
                  全{activeScenario.totalLaps}周 • 目標順位 P{activeScenario.targetPosition} • スタートタイヤ {effectivePlayerConfig.startTyre} • 初期PU {effectivePlayerConfig.machineSetup.puMode.toUpperCase()}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={handleBackToModeSelect}
                className="btn-console px-4 py-2.5 text-xs font-racing font-bold text-slate-300 hover:text-white"
              >
                ◀ モード選択へ戻る
              </button>

              <button
                type="button"
                onClick={handleStartRace}
                className="btn-console-primary px-8 py-3 text-sm font-racing font-black tracking-wider flex items-center gap-2 shadow-2xl shadow-red-950 hover:scale-105 transition-all animate-pulse"
              >
                <span>🚀 ピットウォールへ着席 (レース開始) ▶</span>
              </button>
            </div>
          </div>

          {/* ℹ️ Briefing Setting Interactive Help Modal */}
          <BriefingSettingHelpModal
            topic={briefingHelpTopic}
            onClose={() => setBriefingHelpTopic(null)}
          />
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════════════
          PHASE 3: 🏎️ LIVE RACE COCKPIT SCREEN (ピットウォール本番コクピット)
          ════════════════════════════════════════════════════════════════════════ */}
      {simulatorPhase === 'race' && (
        <div className="space-y-3 animate-in fade-in duration-300">
          {/* ── UNIFIED TACTICAL COMMAND & FIA HUD DECK (Ultra-Compact 2-Tier) ── */}
          <div className="px-2.5 py-1.5 rounded-xl bg-slate-950/95 border border-white/10 shadow-lg backdrop-blur-md space-y-1.5">
            {/* Tier 1: Playback Controls, Lap Progress, Car Status, Flags & Toggles */}
            <div className="flex flex-wrap items-center justify-between gap-1.5 text-xs">
              {/* Left: Lap Controls & Speed */}
              <div className="flex items-center gap-1 flex-wrap">
                <button
                  type="button"
                  onClick={() => setChallengeLap((l) => Math.max(1, l - 1))}
                  disabled={challengeLap <= 1}
                  className="btn-console text-[11px] px-1.5 py-0.5 disabled:opacity-30"
                  title="1周戻る"
                >
                  ◀
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setAutoPauseAlert(null);
                    setChallengePlaying(!challengePlaying);
                  }}
                  className={`px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-xl text-xs flex items-center gap-1.5 font-racing font-bold shadow-md cursor-pointer transition-all ${
                    challengePlaying
                      ? 'bg-amber-600 hover:bg-amber-500 text-white ring-2 ring-amber-400/60 shadow-amber-950/60'
                      : 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white shadow-red-950/60 ring-1 ring-red-400/50'
                  }`}
                >
                  {challengePlaying ? (
                    <>
                      <Pause className="w-3.5 h-3.5 fill-current" /> PAUSE
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" /> {challengeLap >= activeScenario.totalLaps ? 'REPLAY' : 'PLAY'}
                    </>
                  )}
                </button>

                {/* Speed Selector */}
                <div className="flex items-center gap-0.5 bg-slate-900 p-0.5 rounded-lg border border-white/10 text-[9px] font-racing">
                  {[
                    { val: 0.5, label: '0.5x' },
                    { val: 1, label: '1x' },
                    { val: 2, label: '2x' },
                    { val: 5, label: '5x' },
                    { val: 10, label: '10x' },
                    { val: 20, label: '20x' },
                  ].map((spd) => (
                    <button
                      key={spd.val}
                      type="button"
                      onClick={() => setPlaybackSpeed(spd.val)}
                      className={`px-1 py-0.2 rounded ${
                        playbackSpeed === spd.val
                          ? 'bg-red-600 text-white font-bold'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {spd.label}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={resetGameState}
                  className="btn-console text-xs px-1.5 py-0.5 text-slate-400 hover:text-white"
                  title="リセット"
                >
                  <RotateCcw className="w-3 h-3" />
                </button>
              </div>

              {/* Center: Lap Progress + Driver/Tyre/PU Badges */}
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="font-racing font-bold text-white text-[11px]">
                  LAP {challengeLap}/{activeScenario.totalLaps}
                </span>
                {challengePlaying && (
                  <span className="text-[10px] text-amber-300 font-mono">
                    ({(lapTimeRemainingMs / 1000).toFixed(1)}s)
                  </span>
                )}
                <div className="w-16 sm:w-20 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-red-600 to-rose-500 transition-all duration-300"
                    style={{ width: `${(challengeLap / activeScenario.totalLaps) * 100}%` }}
                  />
                </div>
                {/* Quick Car Info */}
                <div className="hidden sm:flex items-center gap-1 text-[10px]">
                  <span className="px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 font-mono">
                    🏎️ {activeScenario.playerConfig.code}
                  </span>
                  <span className="px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 font-mono">
                    🛞 {customStartingTyre || activeScenario.playerConfig.startTyre}
                  </span>
                  <span className="px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 font-mono">
                    🔥 {(customInitialPuMode || activeScenario.playerConfig.machineSetup.puMode).toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Right: Race Control Status, Weather Reroll, AI Difficulty, Assist */}
              <div className="flex items-center gap-1.5 text-[10px] font-mono flex-wrap">
                {/* Safety Car status */}
                <span
                  className={`px-1.5 py-0.5 rounded font-bold font-racing ${
                    currentSnapshot?.isSC
                      ? 'bg-yellow-500 text-slate-950 animate-pulse'
                      : currentSnapshot?.isVSC
                      ? 'bg-amber-600 text-white'
                      : 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                  }`}
                >
                  {currentSnapshot?.isSC ? '🟡 SC' : currentSnapshot?.isVSC ? '🟠 VSC' : '🟢 GREEN'}
                </span>

                {/* SC risk */}
                {currentSnapshot?.rainRadar && (
                  <span
                    className={`px-1.5 py-0.5 rounded text-[9px] font-bold border ${
                      currentSnapshot.rainRadar.incidentRiskLevel === 'CRITICAL'
                        ? 'bg-red-950 text-red-300 border-red-500 animate-pulse'
                        : currentSnapshot.rainRadar.incidentRiskLevel === 'HIGH'
                        ? 'bg-amber-950 text-amber-300 border-amber-500'
                        : 'bg-slate-900 text-slate-400 border-white/10'
                    }`}
                  >
                    SC {currentSnapshot.rainRadar.incidentRiskPercent}%
                  </span>
                )}

                {/* Weather Reroll Button */}
                <button
                  type="button"
                  onClick={handleRerollWeather}
                  className="btn-console text-[10px] px-1.5 py-0.5 flex items-center gap-1 text-sky-300 hover:text-white border-sky-500/30"
                  title="天候や雨雲の到達ラップ・SC発生リスクをランダム再抽選"
                >
                  <Dices className="w-3 h-3 text-sky-400" />
                  <span className="hidden sm:inline font-racing font-bold">天候再抽選</span>
                </button>

                {/* AI Difficulty Status Tag */}
                <span
                  className="px-1.5 py-0.5 rounded text-[10px] font-racing font-bold bg-slate-900 border border-white/10 text-slate-300 flex items-center gap-1"
                  title="AIライバル難易度"
                >
                  <Bot className="w-3 h-3 text-cyan-400" />
                  <span>
                    {aiDifficulty === 'master' ? '🏆 達人' : aiDifficulty === 'standard' ? '🏎️ 標準' : '🌱 初級'}
                  </span>
                </span>

                {/* User Tactical Assist Mode */}
                <div className="flex items-center gap-0.5 bg-slate-900/90 px-1 py-0.5 rounded-lg border border-white/10 shadow-inner text-[9.5px] font-racing">
                  <button
                    type="button"
                    onClick={() => setUserAssistLevel('assisted')}
                    className={`px-1 py-0.2 rounded font-bold transition-all flex items-center gap-0.5 cursor-pointer ${
                      userAssistLevel === 'assisted'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/50 shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                    title="🔰 アシストあり"
                  >
                    <span>🔰</span>
                    <span className="hidden sm:inline">アシスト</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setUserAssistLevel('expert')}
                    className={`px-1 py-0.2 rounded font-bold transition-all flex items-center gap-0.5 cursor-pointer ${
                      userAssistLevel === 'expert'
                        ? 'bg-slate-800 text-cyan-300 border border-cyan-500/50 shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                    title="🎯 エキスパート"
                  >
                    <span>🎯</span>
                    <span className="hidden sm:inline">エキスパート</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Tier 2: FIA Sporting Regulations & Pit Window Prediction (Slim Sub-Strip) */}
            {currentSnapshot && playerCar && (
              <div className="pt-1 border-t border-white/10 flex flex-wrap items-center justify-between gap-1.5 text-[10.5px] font-mono">
                {/* Left: FIA Art. 30.5 Mandatory 2 Compounds Rule Status & Track Limits */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="font-racing text-[10px] font-bold text-slate-300 flex items-center gap-1">
                    <ShieldAlert className="w-3 h-3 text-cyan-400" /> FIA規則:
                  </span>
                  {(() => {
                    const fia = currentSnapshot.fiaRuleStatus;
                    const isMet = fia?.mandatoryDryTireMet;
                    const used = fia?.compoundsUsed || [playerCar.tyreCompound];
                    const isSprint = raceLengthMode === 'sprint';
                    return (
                      <div className="flex flex-wrap items-center gap-1">
                        {!isSprint ? (
                          <span
                            className={`px-1.5 py-0.2 rounded text-[9.5px] font-bold flex items-center gap-1 ${
                              isMet
                                ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40'
                                : 'bg-amber-950/80 text-amber-300 border border-amber-500/40 animate-pulse'
                            }`}
                          >
                            <span>🛞 2種ドライタイヤ義務 (Art. 30.5):</span>
                            <span className="font-mono font-black">{used.join(' ➔ ')}</span>
                            <span>{isMet ? '【達成済 ✅】' : '【ピット必須 ⚠️】'}</span>
                          </span>
                        ) : (
                          <span className="px-1.5 py-0.2 rounded text-[9.5px] font-bold bg-amber-950/80 text-amber-300 border border-amber-500/40">
                            ⚡ スプリント (ピット義務なし)
                          </span>
                        )}

                        {/* DRS Status */}
                        <span
                          className={`px-1.5 py-0.2 rounded text-[9.5px] font-bold ${
                            playerCar.drsAvailable
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40 animate-pulse'
                              : 'bg-slate-900 text-slate-500 border border-white/5'
                          }`}
                        >
                          ⚡ DRS: {playerCar.drsAvailable ? 'OPEN (<1.0s) 🟢' : 'DISABLED 🔒'}
                        </span>

                        {/* Track Limits */}
                        <span
                          className={`px-1.5 py-0.2 rounded text-[9.5px] ${
                            (fia?.trackLimitsCount || 0) >= 3
                              ? 'bg-red-950 text-red-300 border border-red-500/50 animate-pulse'
                              : (fia?.trackLimitsCount || 0) > 0
                              ? 'bg-yellow-950 text-yellow-300 border border-yellow-500/40'
                              : 'bg-slate-900 text-slate-400'
                          }`}
                        >
                          TL: {fia?.trackLimitsCount || 0}/3
                          {(fia?.pendingPenalties || 0) > 0 && ` (+${fia?.pendingPenalties}s)`}
                        </span>
                      </div>
                    );
                  })()}
                </div>

                {/* Right: Pit Window & Traffic Predictor (Clean Air Finder) */}
                {pitExitTraffic && (
                  <div className="flex items-center gap-1.5 bg-slate-900/90 px-2 py-0.5 rounded-lg border border-white/10 text-[10px]">
                    <span className="text-slate-400 font-racing font-bold">
                      🚪 ピット出口予測:
                    </span>
                    <span className="font-bold text-white">
                      P{pitExitTraffic.predictedExitPosition} 復帰
                    </span>
                    <span
                      className={`px-1 py-0.2 rounded text-[9px] font-bold ${
                        pitExitTraffic.trafficStatus === 'CLEAN_AIR'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                          : pitExitTraffic.trafficStatus === 'IN_TRAFFIC'
                          ? 'bg-red-950 text-red-300 border border-red-500/50 animate-pulse'
                          : 'bg-yellow-950 text-yellow-300 border border-yellow-500/40'
                      }`}
                    >
                      {pitExitTraffic.trafficStatus === 'CLEAN_AIR'
                        ? '🟢 クリーンエア'
                        : pitExitTraffic.trafficStatus === 'IN_TRAFFIC'
                        ? `⚠️ 混戦 (+${pitExitTraffic.gapAheadSeconds}s ${pitExitTraffic.aheadCarCode || ''})`
                        : `🟡 要注意 (+${pitExitTraffic.gapAheadSeconds}s)`}
                    </span>
                    <span className="text-[9px] text-slate-400">
                      (ロス約{pitExitTraffic.pitLossSeconds}s)
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Weather Flash Notification */}
          {weatherRerollNotification && (
            <div className="px-3 py-1.5 rounded-xl bg-sky-950/80 border border-sky-500/50 text-sky-200 text-xs font-mono flex items-center justify-between animate-in fade-in duration-200 shadow-sm">
              <div className="flex items-center gap-1.5">
                <CloudRain className="w-3.5 h-3.5 text-sky-400 animate-bounce" />
                <span>{weatherRerollNotification}</span>
              </div>
              <button
                type="button"
                onClick={() => setWeatherRerollNotification(null)}
                className="text-sky-400 hover:text-white text-xs px-1 font-bold"
              >
                ✕
              </button>
            </div>
          )}

          {/* Auto-pause banner with explicit Resume (PLAY) button */}
          {autoPauseAlert && (
            <div className="p-2 sm:p-2.5 rounded-xl bg-gradient-to-r from-amber-950 via-slate-900 to-slate-950 border-2 border-amber-500/80 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-lg animate-in fade-in duration-200">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
                <span className="font-racing font-bold text-amber-300 tracking-wider shrink-0">
                  ⏸️ 自動一時停止中
                </span>
                <span className="text-white font-mono text-[11px]">{autoPauseAlert}</span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setAutoPauseAlert(null);
                    setChallengePlaying(true);
                  }}
                  className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-racing font-bold text-xs flex items-center gap-1 shadow-md cursor-pointer transition-all active:scale-95"
                >
                  <Play className="w-3 h-3 fill-current" /> レース再開 (PLAY)
                </button>
                <button
                  type="button"
                  onClick={() => setAutoPauseAlert(null)}
                  className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[10px] text-slate-300 font-mono"
                >
                  ✕ 閉じる
                </button>
              </div>
            </div>
          )}

          {/* ── Mobile View Toggle (screens < lg) ── */}
          <div className="grid grid-cols-3 lg:hidden gap-1 p-1 rounded-xl bg-slate-900 border border-white/10 text-xs font-racing font-bold">
            <button
              type="button"
              onClick={() => setMobileConsoleView('tower')}
              className={`py-1.5 rounded-lg text-center transition-all ${
                mobileConsoleView === 'tower' ? 'bg-red-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              🏁 順位タワー
            </button>
            <button
              type="button"
              onClick={() => setMobileConsoleView('monitor')}
              className={`py-1.5 rounded-lg text-center transition-all ${
                mobileConsoleView === 'monitor' ? 'bg-red-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              🖥️ コース・データ
            </button>
            <button
              type="button"
              onClick={() => setMobileConsoleView('comms')}
              className={`py-1.5 rounded-lg text-center transition-all relative ${
                mobileConsoleView === 'comms' ? 'bg-red-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>📻 無線・BOX</span>
              {currentSnapshot?.activeRadioPrompt && !radioResponses[currentSnapshot.activeRadioPrompt.id] && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500 animate-ping" />
              )}
            </button>
          </div>

      {/* ── 4-COLUMN PRO PITWALL COMMAND COCKPIT (TOWER | COURSE & COMMS | DATA | COMMANDS) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[168px_minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,1fr)] xl:grid-cols-[172px_minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,1fr)] 2xl:grid-cols-[176px_minmax(0,1.25fr)_minmax(0,1.05fr)_minmax(0,1.05fr)] gap-2.5 items-start">
        {/* ── COLUMN 1 (LEFT): Perpetual 1-Column Timing Tower (P1-P22) ── */}
        <div className={`w-full ${mobileConsoleView === 'tower' ? 'block' : 'hidden lg:block'}`}>
          <div className="glass-card-premium p-1.5 sm:p-2 rounded-xl border border-white/10 space-y-1">
            <div className="flex items-center justify-between gap-1 pb-1 border-b border-white/10">
              <div className="flex items-center gap-1.5 shrink-0">
                <Target className="w-3 h-3 text-red-500 shrink-0" />
                <span className="font-racing text-[11px] font-bold text-white tracking-wide">
                  TOWER
                </span>
                {/* Mode Switcher: GAP vs INT */}
                <div className="flex items-center bg-slate-900/90 p-0.5 rounded border border-white/10 text-[8px] font-racing ml-0.5">
                  <button
                    type="button"
                    onClick={() => setTimingTowerMode('gap')}
                    className={`px-1.5 py-0.2 rounded font-bold transition-all cursor-pointer ${
                      timingTowerMode === 'gap'
                        ? 'bg-red-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                    title="首位とのタイム差 (GAP TO LEADER)"
                  >
                    GAP
                  </button>
                  <button
                    type="button"
                    onClick={() => setTimingTowerMode('int')}
                    className={`px-1.5 py-0.2 rounded font-bold transition-all cursor-pointer ${
                      timingTowerMode === 'int'
                        ? 'bg-red-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                    title="前走車とのインターバル (INTERVAL / Δ)"
                  >
                    INT
                  </button>
                </div>
              </div>
            </div>

            {/* 22-Car Timing Rows: Clean Professional Column */}
            {(() => {
              const allCars = currentSnapshot?.cars || [];
              const renderCarCard = (car: typeof allCars[0]) => {
                const isTarget = car.code === activeScenario.playerConfig.code;
                const isTeammate = car.code === activeScenario.teammateConfig.code;
                const tyreProp = TYRE_PROPERTIES[car.tyreCompound];
                const isOvrWindow = car.position > 1 && car.gapToAhead <= 1.0;
                const isRetired = !!car.isRetired;

                return (
                  <div
                    key={car.code}
                    className={`px-1.5 py-1 rounded-lg flex items-center justify-between text-xs transition-all ${
                      isRetired
                        ? 'opacity-40 bg-slate-950/40 text-slate-500 border border-transparent'
                        : isTarget
                        ? 'bg-gradient-to-r from-red-950/90 via-red-900/30 to-slate-900 border border-red-500 shadow-sm ring-1 ring-red-400/40'
                        : isTeammate
                        ? 'bg-gradient-to-r from-emerald-950/70 via-emerald-900/20 to-slate-900 border border-emerald-500/50 shadow-sm'
                        : 'bg-slate-900/80 hover:bg-slate-800/80 border border-white/5'
                    }`}
                  >
                    {/* Left: Position, Team Stripe, Driver Code (Large), Target/Teammate Tag */}
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="w-[18px] text-right font-racing font-bold text-[10px] text-slate-400 tracking-tight shrink-0">
                        {isRetired ? '-' : car.position}
                      </span>
                      <div
                        className="w-0.5 h-3.5 rounded-full shrink-0"
                        style={{ backgroundColor: isRetired ? '#475569' : car.color }}
                      />
                      <div className="flex items-center gap-1 flex-nowrap shrink-0">
                        <span className={`font-mono font-black text-[12px] tracking-tight ${isRetired ? 'text-slate-500 line-through' : 'text-white'}`}>
                          {car.code}
                        </span>
                      </div>
                    </div>

                    {/* Right: OVR, Tyre Compound, Gap / PIT / OUT */}
                    <div className="flex items-center gap-1 font-mono shrink-0">
                      {/* 2026 Manual Override Mode (OVR) Indicator */}
                      {!isRetired && isOvrWindow && !car.isPitting && (
                        <span
                          className="text-[7px] font-mono font-bold text-cyan-400/80 shrink-0 leading-none"
                          title="Manual Override Mode (2026年規定: 1秒以内追従時の350kW電力ブースト)"
                        >
                          OVR
                        </span>
                      )}

                      {/* Official Pirelli Tyre Badge & Age */}
                      {!isRetired && (
                        <div className="flex items-center gap-0.5 shrink-0 font-mono">
                          <span
                            className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[7.5px] font-black leading-none shadow-sm ${
                              car.tyreCompound === 'SOFT'
                                ? 'bg-[#FF1801] text-white'
                                : car.tyreCompound === 'MEDIUM'
                                ? 'bg-[#FFF500] text-black font-black'
                                : car.tyreCompound === 'HARD'
                                ? 'bg-[#FFFFFF] text-black font-black'
                                : car.tyreCompound === 'INTER'
                                ? 'bg-[#39B54A] text-white font-black'
                                : 'bg-[#00A0DE] text-white font-black'
                            }`}
                            title={`${car.tyreCompound} - Lap ${car.tyreAge} (${car.tyreWearPercent}% wear)`}
                          >
                            {car.tyreCompound[0]}
                          </span>
                          <span className="text-[8px] text-slate-400 font-bold tabular-nums">
                            {car.tyreAge}
                          </span>
                        </div>
                      )}

                      {/* Gap / Interval / PIT / OUT Column */}
                      <div className="text-right min-w-[36px]">
                        {isRetired ? (
                          <span className="px-1.5 py-0.2 rounded bg-rose-950/80 border border-rose-500/40 text-rose-300 text-[7.5px] font-mono font-extrabold tracking-wider inline-block">
                            OUT
                          </span>
                        ) : car.isPitting ? (
                          <span className="px-1 py-0.2 rounded bg-amber-500 text-slate-950 text-[7.5px] font-mono font-extrabold tracking-wider animate-pulse inline-block">
                            PIT
                          </span>
                        ) : timingTowerMode === 'gap' ? (
                          <span className="font-bold text-white text-[10.5px] sm:text-[11px] tabular-nums font-mono tracking-tight leading-none">
                            {car.position === 1 ? 'LEAD' : `+${car.gapToLeader.toFixed(1)}`}
                          </span>
                        ) : (
                          <span className="font-bold text-white text-[10.5px] sm:text-[11px] tabular-nums font-mono tracking-tight leading-none">
                            {car.position === 1 ? 'LEAD' : `Δ${car.gapToAhead.toFixed(1)}`}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              };

              return (
                <div className="space-y-0.5 max-h-[580px] overflow-y-auto pr-0.5">
                  {allCars.map((car) => (
                    <React.Fragment key={car.code}>
                      {renderCarCard(car)}
                      {car.position === 10 && (
                        <div className="py-0.5 px-1.5 rounded bg-gradient-to-r from-amber-950/70 to-slate-900 border-dashed border border-amber-500/50 flex items-center justify-between text-[8px] font-racing font-bold text-amber-300 my-0.5 shadow-sm">
                          <span>🏁 P10 CUTOFF</span>
                          <span className="font-mono text-[7.5px] text-slate-400">入賞枠</span>
                        </div>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              );
            })()}
          </div>
        </div>

        {/* ── COLUMN 2 (CENTER-LEFT): Live Circuit GPS Track Radar (Course) & Doppler Weather Radar ── */}
        <div className={`w-full min-w-0 space-y-2.5 ${mobileConsoleView === 'monitor' ? 'block' : 'hidden lg:block'}`}>
          <LiveTrackGpsRadar
            circuitId={activeScenario.circuit.id}
            circuitName={activeScenario.circuit.name}
            circuitLengthM={5400}
            baseLapTime={activeScenario.circuit.baseLapTime}
            cars={currentSnapshot?.cars || []}
            playerCarCode={activeScenario.playerConfig.code}
            teammateCarCode={activeScenario.teammateConfig.code}
            lapProgressPct={lapProgressPct}
            currentLap={challengeLap}
            totalLaps={activeScenario.totalLaps}
            isPlaying={challengePlaying}
            playbackSpeed={playbackSpeed}
            isSC={currentSnapshot?.isSC}
            isScEnding={currentSnapshot?.isScEnding}
            isOvertakeActive={ersBoostUsedThisLap || activePuMode === 'push'}
            showLeaderboard={false}
            onMaximize={() => setIsFullScreenCockpit(true)}
          />

          {/* ── LOWER DECK: WEATHER (LEFT) & TEAM ORDERS (RIGHT) ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {/* 1. WEATHER (Balanced Fit - No Clipping) */}
            <div className={`glass-card-premium p-2.5 rounded-xl border border-white/10 space-y-2 flex flex-col justify-start transition-all ${
              activeHelpCard === 'weather' || hoveredHelpCard === 'weather' ? 'relative z-50' : 'relative z-10 hover:z-40'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="font-racing text-xs font-bold text-white flex items-center gap-1.5">
                    <CloudRain className="w-3.5 h-3.5 text-sky-400" /> WEATHER
                  </span>
                  {/* Help button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveHelpCard(activeHelpCard === 'weather' ? null : 'weather');
                    }}
                    onMouseEnter={() => setHoveredHelpCard('weather')}
                    onMouseLeave={() => setHoveredHelpCard(null)}
                    className={`w-3.5 h-3.5 rounded-full border text-[9px] font-mono font-bold flex items-center justify-center transition-all shadow-sm ${
                      activeHelpCard === 'weather' || hoveredHelpCard === 'weather'
                        ? 'bg-sky-400 text-slate-950 border-sky-300 ring-2 ring-sky-400/50'
                        : 'bg-slate-800 hover:bg-sky-950 border-white/20 hover:border-sky-400 text-slate-400 hover:text-sky-300'
                    }`}
                    title="クリックで解説を固定表示 / ホバーで確認"
                  >
                    ?
                  </button>
                </div>
                <div className="flex items-center gap-1">
                  {(() => {
                    const rawIntensity = currentSnapshot?.rainRadar.intensity || 'DRY';
                    const intensity = String(rawIntensity).toLowerCase();
                    const isMonsoon = intensity === 'monsoon' || intensity === 'heavy';
                    const isWet = intensity === 'heavy' || intensity === 'wet';
                    const isDamp = intensity === 'moderate' || intensity === 'light' || intensity === 'drizzle';
                    const icon = isMonsoon ? '🌊' : isWet ? '🌧️' : isDamp ? '☁️' : '☀️';
                    const badgeColor = isMonsoon
                      ? 'bg-blue-950 text-blue-300 border-blue-500/40'
                      : isWet
                      ? 'bg-sky-950 text-sky-300 border-sky-500/40'
                      : isDamp
                      ? 'bg-cyan-950 text-cyan-300 border-cyan-500/40'
                      : 'bg-emerald-950 text-emerald-300 border-emerald-500/40';
                    return (
                      <span className={`px-1.5 py-0.2 rounded-full border text-[8.5px] font-mono font-bold whitespace-nowrap uppercase ${badgeColor}`}>
                        {icon} {rawIntensity}
                      </span>
                    );
                  })()}
                  <button
                    type="button"
                    onClick={() => setActiveMonitor('weather')}
                    className="p-0.5 rounded text-slate-400 hover:text-white hover:bg-slate-800"
                    title="拡大フォーカス"
                  >
                    <Maximize2 className="w-3 h-3" />
                  </button>
                </div>
              </div>

              <div className="p-1.5 rounded-lg bg-slate-950 border border-white/10 flex items-center gap-2.5">
                {/* Circular animated radar scope (48px) with concentric distance rings */}
                <div className="relative w-12 h-12 sm:w-13 sm:h-13 shrink-0 rounded-full border border-sky-500/40 bg-radial from-sky-950/50 via-slate-950 to-slate-950 overflow-hidden flex items-center justify-center">
                  <div className="absolute inset-1 rounded-full border border-sky-500/20 border-dashed" title="15km レンジ" />
                  <div className="absolute inset-2.5 rounded-full border border-sky-500/25" title="10km レンジ" />
                  <div className="absolute inset-4 rounded-full border border-sky-500/30" title="5km レンジ" />
                  <div className="absolute inset-x-0 top-1/2 h-px bg-sky-500/20" />
                  <div className="absolute inset-y-0 left-1/2 w-px bg-sky-500/20" />
                  <span className="absolute top-0 text-[5px] font-mono font-bold text-sky-400">N</span>
                  <div className="absolute inset-0 rounded-full animate-[spin_3.5s_linear_infinite] pointer-events-none origin-center opacity-40 bg-[conic-gradient(from_0deg,transparent_0_300deg,rgba(56,189,248,0.4)_360deg)]" />
                  <div className="relative z-10 w-1.5 h-1.5 rounded-full bg-red-500 shadow-sm shadow-red-500/80 ring-1 ring-red-400 animate-pulse" title="現在地（サーキット）" />
                  {(() => {
                    const radar = currentSnapshot?.rainRadar;
                    if (!radar || radar.distanceKm === undefined) return null;
                    if (radar.distanceKm === 0) {
                      return <div className="absolute inset-1 rounded-full bg-sky-500/20 border border-sky-400/50 animate-ping pointer-events-none" />;
                    }
                    const maxDist = 15;
                    const norm = Math.min(1, radar.distanceKm / maxDist);
                    const radiusPx = 16;
                    const xOffset = -norm * radiusPx * 0.707;
                    const yOffset = norm * radiusPx * 0.707;
                    return (
                      <div
                        className="absolute z-10 flex flex-col items-center justify-center transition-all duration-700"
                        style={{ transform: `translate(${xOffset}px, ${yOffset}px)` }}
                      >
                        <div className="w-2 h-2 rounded-full bg-sky-400/30 border border-sky-400 flex items-center justify-center animate-pulse">
                          <CloudRain className="w-1.5 h-1.5 text-sky-300" />
                        </div>
                        <span className="text-[5.5px] font-mono font-bold text-sky-300 whitespace-nowrap bg-slate-900/90 px-0.5 rounded leading-none">
                          {radar.distanceKm}km
                        </span>
                      </div>
                    );
                  })()}
                </div>

                {/* Radar Stats (Compact & clear with Rain Countdown) */}
                <div className="flex-1 min-w-0 space-y-1 text-[9.5px] sm:text-[10px] font-mono leading-none">
                  {/* Lap Countdown to Rain */}
                  <div className="flex justify-between items-center pb-0.5 border-b border-white/10">
                    <span className="text-slate-400">降雨予測:</span>
                    <span className="font-bold font-racing text-[10px] text-amber-300">
                      {(() => {
                        const rainLap = activeScenario.actualRainLap;
                        if (!rainLap || rainLap > activeScenario.totalLaps) return '降雨なし (DRY)';
                        const diff = rainLap - challengeLap;
                        if (diff < 0) return '通過中 (降雨中)';
                        if (diff === 0) return '🚨 今周回到達！';
                        return `LAP ${rainLap} (あと${diff}周)`;
                      })()}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">雨雲距離:</span>
                    <span className="font-bold text-white text-[10px] sm:text-[10.5px]">
                      {currentSnapshot?.rainRadar.distanceKm! > 10
                        ? '>10km'
                        : currentSnapshot?.rainRadar.distanceKm === 0
                        ? '頭上 (降雨中)'
                        : `${currentSnapshot?.rainRadar.distanceKm} km`}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">到達予測:</span>
                    <span className="font-bold text-amber-400 text-[10px] sm:text-[10.5px]">
                      {currentSnapshot?.rainRadar.etaMinutes! > 0
                        ? `約${currentSnapshot?.rainRadar.etaMinutes}分後`
                        : currentSnapshot?.rainRadar.distanceKm === 0
                        ? '現在通過中'
                        : '接近中'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">路面水量:</span>
                    <span className="font-bold text-sky-400 text-[10px] sm:text-[10.5px]">
                      {(liveTelemetry?.waterDepthMm ?? currentSnapshot?.rainRadar.waterDepthMm ?? 0).toFixed(1)} mm
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">路面温度:</span>
                    <span className="font-bold text-amber-400 text-[10px] sm:text-[10.5px]">
                      {currentSnapshot?.rainRadar.trackTempC || 30}°C
                    </span>
                  </div>
                </div>
              </div>

              {/* Compound Crossover Spectrum Bar (Tightly fit) */}
              <div className="space-y-0.5 pt-1">
                <div className="flex justify-between text-[9px] font-mono text-slate-400 leading-none">
                  <span>水深交差スペクトラム</span>
                  <span className="text-sky-300 font-bold text-[9.5px]">{(liveTelemetry?.waterDepthMm ?? currentSnapshot?.rainRadar.waterDepthMm ?? 0).toFixed(1)}mm</span>
                </div>
                <div className="relative pt-1.5 pb-0.5">
                  {(() => {
                    const depth = liveTelemetry?.waterDepthMm ?? currentSnapshot?.rainRadar.waterDepthMm ?? 0;
                    const maxScale = 5.0;
                    const pct = Math.min(100, Math.max(0, (depth / maxScale) * 100));
                    return (
                      <div
                        className="absolute top-0 -translate-x-1/2 flex flex-col items-center transition-all duration-300 z-10"
                        style={{ left: `${pct}%` }}
                      >
                        <span className="text-[6.5px] font-mono font-black text-white bg-red-600 px-0.5 rounded leading-none shadow-sm">
                          {depth.toFixed(1)}
                        </span>
                        <span className="text-red-500 text-[4px] -mt-0.5 leading-none">▼</span>
                      </div>
                    );
                  })()}
                  <div className="w-full h-1.5 rounded-full overflow-hidden flex shadow-inner border border-white/10">
                    <div className="h-full bg-gradient-to-r from-red-500 via-amber-400 to-yellow-300" style={{ width: '16%' }} title="SLICK: 0.0〜0.8mm" />
                    <div className="h-full bg-gradient-to-r from-emerald-500 via-green-400 to-teal-400" style={{ width: '64%' }} title="INTER: 0.8〜4.0mm" />
                  </div>
                </div>
              </div>

              {/* Popover overlay: positioned relative to card, elevated to z-50 */}
              {(activeHelpCard === 'weather' || hoveredHelpCard === 'weather') && (
                <div
                  style={{ backgroundColor: '#020617' }}
                  className="absolute inset-x-1 top-8 p-3 rounded-2xl bg-slate-950 border border-sky-500/80 shadow-[0_25px_60px_rgba(0,0,0,1)] z-50 text-left max-h-[380px] overflow-y-auto scrollbar-thin transition-all duration-150 animate-in fade-in zoom-in-95 ring-1 ring-sky-500/50"
                  onMouseEnter={() => setHoveredHelpCard('weather')}
                  onMouseLeave={() => setHoveredHelpCard(null)}
                >
                  <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-white/10">
                    <div className="flex items-center gap-1.5">
                      <HelpCircle className="w-4 h-4 text-sky-400" />
                      <span className="font-racing text-xs font-bold text-sky-300">WEATHER 戦術判断ガイド</span>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveHelpCard(null);
                        setHoveredHelpCard(null);
                      }}
                      className="text-slate-400 hover:text-white text-xs px-1.5 py-0.5 rounded hover:bg-slate-800"
                      title="閉じる"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="space-y-2 text-[10px] text-slate-300 leading-relaxed">
                    <div>
                      <div className="font-bold text-amber-300 flex items-center gap-1 mb-0.5">
                        <span>🎯</span> <span>このデータは何を見るのか？</span>
                      </div>
                      <p className="text-slate-400">
                        雨雲の接近距離・到達予想時間と、<strong className="text-white">路面の「水量（mm）」によるタイヤの性能限界（クロスオーバーポイント）</strong>を監視する計器です。
                      </p>
                    </div>

                    <div>
                      <div className="font-bold text-emerald-300 flex items-center gap-1 mb-0.5">
                        <span>📊</span> <span>各指標の見方と判断基準</span>
                      </div>
                      <ul className="space-y-1 text-slate-400">
                        <li>
                          <strong className="text-white">・雨雲距離 &amp; 到達予測:</strong> F1の1周は約1分30秒前後。「約2〜3分後」と出たら、<strong className="text-amber-200">次の周でピットに入る準備（タイヤ選択）</strong>を完了させる必要があります。
                        </li>
                        <li>
                          <strong className="text-sky-300">・0.0 〜 0.8 mm【スリック適正域 (S/M/H)】:</strong> 水深0.8mm未満はスリックタイヤが最速。小雨が降り始めても0.8mmまではスリックで我慢（ステイアウト）するのが最善です。
                        </li>
                        <li>
                          <strong className="text-emerald-300">・0.8 〜 4.0 mm【インターミディエイト適正域 (🟢 INTER)】:</strong> 水深0.8mmを超えるとスリックは排水できずスピン・大幅タイム低下。<strong className="text-emerald-200">「0.8mmを超えた瞬間」にインターへ履き替えたドライバーが最大のタイムゲイン（1周で5秒以上逆転）を得られます。</strong>
                        </li>
                        <li>
                          <strong className="text-blue-300">・4.0 mm 以上【フルウェット適正域 (🔵 WET)】:</strong> 4.0mmを超えるとインターでもハイドロプレーニング（水膜浮上）が発生。フルWETへの交換が必須となります。
                        </li>
                        <li>
                          <strong className="text-amber-300">・路面温度 (°C):</strong> 降雨時は路面温度が急低下しタイヤが冷えます。雨雲通過後は、路面温度が高いほど急速にレコードラインが乾いていきます。
                        </li>
                      </ul>
                    </div>

                    <div className="pt-1 border-t border-white/10">
                      <div className="font-bold text-sky-300 flex items-center gap-1 mb-0.5">
                        <span>⚡</span> <span>推奨アクション</span>
                      </div>
                      <p className="text-slate-300">
                        雨雲接近中かつ水深が0.8mmに近づいたら ➔ タイヤ選択を <span className="px-1 py-0.2 rounded bg-emerald-950 border border-emerald-500/50 text-emerald-300 font-mono font-bold">🟢 I</span> に切り替えて <span className="px-1 py-0.2 rounded bg-red-900/60 border border-red-500/50 text-white font-mono font-bold">BOX BOX</span>！<br />
                        雨が止み、水深が0.8mmを下回ってきたら ➔ タイヤ選択を <span className="px-1 py-0.2 rounded bg-red-950 border border-red-500/50 text-red-300 font-mono font-bold">🔴 S</span> または <span className="px-1 py-0.2 rounded bg-amber-950 border border-amber-500/50 text-amber-300 font-mono font-bold">🟡 M</span> にしてスリックへ戻す！
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 2. TEAM ORDERS (Compact) */}
            <div className="glass-card-premium p-2.5 rounded-xl border border-white/10 space-y-2 flex flex-col justify-start transition-all">
              <div className="flex items-center justify-between pb-1 border-b border-white/10">
                <span className="font-racing text-xs font-bold text-white flex items-center gap-1.5 tracking-wide">
                  <ShieldAlert className="w-3.5 h-3.5 text-yellow-400" /> TEAM ORDERS
                </span>
                <span className="text-[9px] font-mono text-emerald-400 font-bold">
                  TM: {activeScenario.teammateConfig.code} ({teammateCar ? `P${teammateCar.position}` : ''})
                </span>
              </div>

              {/* Double Stack Risk Warning (if active) */}
              {currentSnapshot?.teammateStatus?.doubleStackRisk && (
                <div className="p-1 px-1.5 rounded bg-red-950/80 border border-red-500/70 text-[8.5px] text-red-200 flex items-center justify-between">
                  <span className="flex items-center gap-1 font-bold text-red-300">
                    <AlertCircle className="w-3 h-3 text-red-400 shrink-0" /> ダブルスタック待機リスク！
                  </span>
                  <span className="text-[8px] font-mono text-red-400">+4.5s ロス</span>
                </div>
              )}

              <div className="space-y-1.5">
                <button
                  type="button"
                  onClick={() => handleTeamOrder('swap')}
                  className={`w-full py-1.5 px-2.5 rounded-lg border text-left transition-all flex justify-between items-center cursor-pointer ${
                    activeTeamOrder === 'swap'
                      ? 'bg-emerald-950/80 border-emerald-500 text-white shadow-sm'
                      : 'bg-slate-900 hover:bg-slate-800 border-white/10 text-slate-300'
                  }`}
                  title="タイヤ戦略が有利な側を先行させる"
                >
                  <span className="font-racing font-bold text-[10.5px]">🔄 順位入替 (Swap Positions)</span>
                  {activeTeamOrder === 'swap' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                </button>

                <button
                  type="button"
                  onClick={() => handleTeamOrder('defend')}
                  className={`w-full py-1.5 px-2.5 rounded-lg border text-left transition-all flex justify-between items-center cursor-pointer ${
                    activeTeamOrder === 'defend'
                      ? 'bg-amber-950/80 border-amber-500 text-white shadow-sm'
                      : 'bg-slate-900 hover:bg-slate-800 border-white/10 text-slate-300'
                  }`}
                  title="相方に後続を抑え込ませタイム差拡大"
                >
                  <span className="font-racing font-bold text-[10.5px]">🛡️ 後続ブロック (Hold Up Rival)</span>
                  {activeTeamOrder === 'defend' && <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                </button>

                <button
                  type="button"
                  onClick={() => handleTeamOrder('none')}
                  className={`w-full py-1.5 px-2.5 rounded-lg border text-left transition-all flex justify-between items-center cursor-pointer ${
                    activeTeamOrder === 'none'
                      ? 'bg-slate-800 border-white/30 text-white'
                      : 'bg-slate-900 hover:bg-slate-800 border-white/10 text-slate-400'
                  }`}
                  title="チームオーダーなしで自由に競わせる"
                >
                  <span className="font-racing font-bold text-[10.5px]">🏁 自由競争 (Normal Racing)</span>
                  {activeTeamOrder === 'none' && <CheckCircle2 className="w-3.5 h-3.5 text-slate-300 shrink-0" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── COLUMN 3 (CENTER-RIGHT): Tactical Data Deck (Pit Exit, Weather & Telemetry) ── */}
        <div className={`w-full min-w-0 space-y-2.5 ${mobileConsoleView === 'monitor' ? 'block' : 'hidden lg:block'}`}>
          {/* Back button only when a monitor is maximized */}
          {activeMonitor !== 'all' && (
            <div className="flex items-center justify-between bg-slate-950/90 p-1.5 rounded-xl border border-white/10 shadow-sm">
              <button
                type="button"
                onClick={() => setActiveMonitor('all')}
                className="btn-console text-[10px] font-mono text-cyan-300 hover:text-white py-1 px-2 border-cyan-500/30 flex items-center gap-1 cursor-pointer"
              >
                ◀ 全データ表示に戻る
              </button>
            </div>
          )}

          {/* Active Data Display Area */}
          <div className="space-y-2.5">
            {/* ── INTEGRATED TACTICAL DATA (Default: Traffic, Weather, and Telemetry All Visible) ── */}
            {(activeMonitor === 'all' || activeMonitor === 'track') && (
              <div className="space-y-2.5">
                {/* 1. LIVE RACE FEED & TEAM RADIO (Positioned side-by-side with MISSION CONTROL INTEL in Column 4) */}
                <div className="glass-card-premium p-2.5 sm:p-3 rounded-2xl border border-white/10 shadow-lg backdrop-blur-md flex flex-col h-[388px]">
                  <div className="flex flex-wrap items-center justify-between gap-1.5 pb-2 border-b border-white/10 shrink-0">
                    <div className="flex items-center gap-2">
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
                      </span>
                      <span className="font-racing text-xs font-bold text-white flex items-center gap-1 tracking-wider">
                        <Radio className="w-3.5 h-3.5 text-rose-400" /> LIVE RACE &amp; RADIO
                      </span>
                      <span className="text-[9px] font-mono text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded border border-white/10">
                        L{challengeLap}/{activeScenario.totalLaps}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      {/* AI Strategist Trigger */}
                      {onOpenAiStrategist && (
                        <button
                          type="button"
                          onClick={onOpenAiStrategist}
                          className="p-1 px-1.5 rounded-lg border text-[10px] bg-sky-950/40 border-sky-500/30 text-sky-300 hover:text-white hover:border-sky-400 flex items-center gap-1 transition-all cursor-pointer"
                          title="AI STRATEGY (AIストラテジスト軍師を開く)"
                        >
                          <span className="text-[10px]">🤖</span>
                          <span className="font-racing font-bold text-[9px] hidden sm:inline">AI</span>
                        </button>
                      )}

                      {/* Audio Toggle */}
                      <button
                        type="button"
                        onClick={() => {
                          const next = !radioAudioEnabled;
                          setRadioAudioEnabled(next);
                          if (next) playF1RadioChirp();
                        }}
                        className={`p-1 rounded-lg border text-[10px] transition-all cursor-pointer ${
                          radioAudioEnabled
                            ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300'
                            : 'bg-slate-900 border-white/10 text-slate-500'
                        }`}
                        title={radioAudioEnabled ? '無線音: ON' : '無線音: 消音中'}
                      >
                        {radioAudioEnabled ? <Volume2 className="w-3 h-3 text-slate-200" /> : <VolumeX className="w-3 h-3 text-slate-500" />}
                      </button>

                      {/* Filter Chips */}
                      <div className="flex items-center bg-slate-900/90 p-0.5 rounded-lg border border-white/10 text-[8.5px] font-racing">
                        {(['all', 'radio', 'incident', 'overtake', 'broadcast'] as const).map((filter) => (
                          <button
                            key={filter}
                            type="button"
                            onClick={() => setLiveFeedFilter(filter)}
                            className={`px-1.5 py-0.5 rounded font-bold transition-all cursor-pointer ${
                              liveFeedFilter === filter
                                ? 'bg-slate-700 text-white border border-white/20 shadow-sm'
                                : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            {filter === 'all'
                              ? 'ALL'
                              : filter === 'radio'
                              ? '📻 無線'
                              : filter === 'incident'
                              ? '⚠️ 警告'
                              : filter === 'overtake'
                              ? '⚔️ 追越'
                              : '🏁 FIA'}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Streaming Feed List */}
                  <div className="space-y-1.5 overflow-y-auto pr-1 flex-1 min-h-0 pt-1.5">
                    {filteredFeed.length === 0 ? (
                      <div className="py-4 text-center text-xs font-mono text-slate-500">
                        交信・実況ログはありません
                      </div>
                    ) : (
                      filteredFeed.map((msg, idx) => {
                        const isLatest = idx === 0;
                        const isRadio = msg.type === 'radio';
                        const isIncident = msg.type === 'incident';
                        const isOvertake = msg.type === 'overtake';

                        return (
                          <div
                            key={msg.id}
                            className={`p-2 sm:p-2.5 rounded-xl transition-all border ${
                              isIncident
                                ? 'border-white/10 border-l-[3px] border-l-rose-500 bg-slate-900/90'
                                : isRadio
                                ? 'border-white/10 border-l-[3px] border-l-amber-400 bg-slate-900/90'
                                : isOvertake
                                ? 'border-white/10 border-l-[3px] border-l-sky-400 bg-slate-900/90'
                                : 'border-white/10 border-l-[3px] border-l-slate-400 bg-slate-900/90'
                            } ${isLatest ? 'ring-1 ring-white/20 shadow-md' : 'hover:border-white/20'}`}
                          >
                            <div className="flex items-center justify-between mb-1 text-[9px] font-racing">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span
                                  className={`px-1.5 py-0.2 rounded font-mono font-bold uppercase tracking-wider text-[8px] ${
                                    isIncident
                                      ? 'bg-rose-950 text-rose-300 border border-rose-500/40'
                                      : isRadio
                                      ? 'bg-amber-950 text-amber-300 border border-amber-500/40'
                                      : isOvertake
                                      ? 'bg-sky-950 text-sky-300 border border-sky-500/40'
                                      : 'bg-slate-800 text-slate-300 border border-white/10'
                                  }`}
                                >
                                  {isIncident
                                    ? '⚠️ INCIDENT'
                                    : isRadio
                                    ? '📻 RADIO'
                                    : isOvertake
                                    ? '⚔️ OVERTAKE'
                                    : '🏁 FIA BROADCAST'}
                                </span>
                                <span className="font-racing font-bold text-white text-[11px]">{msg.speaker}</span>
                                {isLatest && (
                                  <span className="px-1 py-0.2 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[7.5px] font-mono font-bold animate-pulse">
                                    LATEST
                                  </span>
                                )}
                              </div>
                              <span className="text-slate-400 font-mono text-[9px]">L{msg.lap}</span>
                            </div>
                            <div className={`text-xs font-sans leading-relaxed ${isRadio ? 'text-amber-100/90 italic font-medium' : 'text-slate-100'}`}>
                              {msg.text}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* 2. Bottom Deck: CAR TELEMETRY & 4-TYRE THERMALS (Compact & Actionable) */}
                <div className={`glass-card-premium p-2 sm:p-2.5 rounded-xl border border-white/10 space-y-2 transition-all min-h-[238px] flex flex-col justify-between ${
                  activeHelpCard === 'telemetry' || hoveredHelpCard === 'telemetry' ? 'relative z-50' : 'relative z-0 hover:z-30'
                }`}>
                  <div className="flex items-center justify-between gap-1 overflow-visible">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <Flame className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span className="font-racing text-xs font-bold text-white truncate" title="CAR TELEMETRY & TYRE THERMALS">
                        CAR TELEMETRY
                      </span>
                      {/* Help button (shrink-0 ensures it is NEVER pushed off or hidden) */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveHelpCard(activeHelpCard === 'telemetry' ? null : 'telemetry');
                        }}
                        onMouseEnter={() => setHoveredHelpCard('telemetry')}
                        onMouseLeave={() => setHoveredHelpCard(null)}
                        className={`w-3.5 h-3.5 rounded-full border text-[9px] font-mono font-bold flex items-center justify-center transition-all shadow-sm shrink-0 ${
                          activeHelpCard === 'telemetry' || hoveredHelpCard === 'telemetry'
                            ? 'bg-amber-400 text-slate-950 border-amber-300 ring-2 ring-amber-400/50'
                            : 'bg-slate-800 hover:bg-amber-950 border-white/20 hover:border-amber-400 text-slate-400 hover:text-amber-300'
                        }`}
                        title="クリックで解説を固定表示 / ホバーで確認"
                      >
                        ?
                      </button>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      {(() => {
                        const warning = playerCar?.thermalWarning;
                        const isBlistering = warning === 'BLISTERING_WARNING';
                        const isGraining = warning === 'GRAINING_RISK';
                        return (
                          <span
                            className={`px-1.5 py-0.2 rounded-full text-[8.5px] font-mono font-bold whitespace-nowrap shrink-0 ${
                              isBlistering
                                ? 'bg-red-950 text-red-300 border border-red-500/40 animate-pulse'
                                : isGraining
                                ? 'bg-amber-950 text-amber-300 border border-amber-500/40'
                                : 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                            }`}
                          >
                            {isBlistering
                              ? '🔴 BLISTERING'
                              : isGraining
                              ? '🟡 GRAINING'
                              : '🟢 OPTIMAL'}
                          </span>
                        );
                      })()}
                      <button
                        type="button"
                        onClick={() => setActiveMonitor('thermals')}
                        className="p-0.5 rounded text-slate-400 hover:text-white hover:bg-slate-800 shrink-0"
                        title="拡大フォーカス"
                      >
                        <Maximize2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* 4 Tyre Cards with Surface vs Core Temps (Live Real-time Dynamic Feedback) */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                    {[
                      { code: 'FL' as const, label: '前左' },
                      { code: 'FR' as const, label: '前右' },
                      { code: 'RL' as const, label: '後左' },
                      { code: 'RR' as const, label: '後右' },
                    ].map((tyre) => {
                      const liveData = liveTelemetry?.tyres[tyre.code];
                      const surf = liveData ? liveData.surf : (playerCar?.tyreSurfaceTemp || 100);
                      const core = liveData ? liveData.core : (playerCar?.tyreCoreTemp || 98);
                      const isOverheat = surf > 125;
                      const isCold = surf < 88;
                      return (
                        <div
                          key={tyre.code}
                          className={`p-1.5 sm:p-2 rounded-xl border transition-all ${
                            isOverheat
                              ? 'border-red-500/60 bg-red-950/20'
                              : isCold
                              ? 'border-cyan-500/60 bg-cyan-950/20'
                              : 'border-white/10 bg-slate-900/90'
                          }`}
                        >
                          <div className="flex justify-between items-center pb-1 border-b border-white/10">
                            <div className="flex items-baseline gap-1 min-w-0">
                              <span className="font-racing font-bold text-white text-[11px] leading-none">{tyre.code}</span>
                              <span className="text-[8px] text-slate-400 font-mono leading-none">({tyre.label})</span>
                            </div>
                            <span
                              className={`px-1 py-0.2 rounded text-[7.5px] font-bold shrink-0 ${
                                isOverheat
                                  ? 'bg-red-600 text-white animate-pulse'
                                  : isCold
                                  ? 'bg-cyan-600 text-white'
                                  : 'bg-emerald-600 text-white'
                              }`}
                            >
                              {isOverheat ? 'HOT' : isCold ? 'COLD' : 'OPT'}
                            </span>
                          </div>
                          <div className="mt-1 space-y-0.5 text-[10px] sm:text-[10.5px] font-mono leading-tight">
                            <div className="flex justify-between items-center">
                              <span className="text-slate-400 text-[9.5px]">表面:</span>
                              <span className={`font-bold transition-all ${isOverheat ? 'text-red-400' : isCold ? 'text-cyan-400' : 'text-emerald-400'}`}>
                                {surf.toFixed(0)}°C
                              </span>
                            </div>
                            <div className="flex justify-between items-center text-slate-300">
                              <span className="text-slate-400 text-[9.5px]">内部:</span>
                              <span className="font-bold">{core.toFixed(0)}°C</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Aero Wake (Dirty Air) & Tyre Degradation Metrics */}
                  {(() => {
                    const gapAhead = playerCar?.gapToAhead ?? 99;
                    const isLeader = playerCar?.position === 1;
                    const isDirtyAir = !isLeader && gapAhead > 0 && gapAhead <= 1.2;
                    const downforceLossPercent = isDirtyAir ? Math.min(24, Math.max(12, Math.round(15 + (1.2 - gapAhead) * 10))) : 0;

                    const compound = playerCar?.tyreCompound || 'MEDIUM';
                    const baseDegMap: Record<string, number> = {
                      SOFT: 0.18,
                      MEDIUM: 0.12,
                      HARD: 0.08,
                      INTER: 0.15,
                      WET: 0.14,
                    };
                    const baseDeg = baseDegMap[compound] || 0.12;
                    const ageFactor = 1 + (playerCar?.tyreAge || 0) * 0.035;
                    const tempFactor = (playerCar?.tyreSurfaceTemp || 100) > 125 ? 1.4 : 1.0;
                    const degRatePerLap = (baseDeg * ageFactor * tempFactor).toFixed(2);

                    const wearPerLapMap: Record<string, number> = {
                      SOFT: 4.8,
                      MEDIUM: 3.2,
                      HARD: 2.2,
                      INTER: 3.5,
                      WET: 3.0,
                    };
                    const wearRate = wearPerLapMap[compound] || 3.0;
                    const currentWear = playerCar?.tyreWearPercent || 15;
                    const lapsToCliff = Math.max(0, Math.round((75 - currentWear) / wearRate));
                    const isAtCliff = currentWear >= 75;

                    return (
                      <div className="p-1.5 rounded-xl bg-slate-950/80 border border-white/10 text-xs font-mono space-y-1">
                        {/* Row 1: Aero Wake / Dirty Air */}
                        <div className="flex items-center justify-between text-[10px]">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <Wind className={`w-3.5 h-3.5 shrink-0 ${isDirtyAir ? 'text-amber-400 animate-pulse' : 'text-sky-400'}`} />
                            <span className="text-slate-400 shrink-0">空力気流:</span>
                            <span
                              className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                                isDirtyAir
                                  ? 'bg-amber-950 text-amber-300 border border-amber-500/50'
                                  : 'bg-emerald-950 text-emerald-300 border border-emerald-500/50'
                              }`}
                              title={isDirtyAir ? `前走車直後（${gapAhead.toFixed(1)}s）の乱気流によりダウンフォースが低下` : '理想的なクリーンエア環境'}
                            >
                              {isDirtyAir ? `⚠️ DIRTY AIR (-${downforceLossPercent}% DF)` : '🟢 CLEAN AIR (理想空力)'}
                            </span>
                          </div>
                          <span className="text-[9px] text-slate-400 font-mono shrink-0 ml-1">
                            {isDirtyAir ? `前走差 +${gapAhead.toFixed(1)}s` : isLeader ? '首位独走' : `前走差 +${gapAhead.toFixed(1)}s`}
                          </span>
                        </div>

                        {/* Row 2: Tyre Degradation & Cliff Prediction */}
                        <div className="flex items-center justify-between text-[10px] pt-1 border-t border-white/5">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <TrendingDown className={`w-3.5 h-3.5 shrink-0 ${isAtCliff ? 'text-red-400' : 'text-amber-400'}`} />
                            <span className="text-slate-400 shrink-0">デグラデーション:</span>
                            <span className="font-mono font-bold text-white text-[10.5px] shrink-0">
                              +{degRatePerLap}s<span className="text-[8.5px] text-slate-400">/周</span>
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0 ml-1">
                            <span className="text-[9.5px] text-slate-400">クリフ:</span>
                            <span
                              className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                                isAtCliff
                                  ? 'bg-red-950 text-red-300 border border-red-500/80 animate-pulse'
                                  : lapsToCliff <= 2
                                  ? 'bg-amber-950 text-amber-300 border border-amber-500/50'
                                  : 'bg-slate-800 text-emerald-300'
                              }`}
                              title={isAtCliff ? 'タイヤ性能が急激に失われるクリフに突入。直ちにBOX推奨' : `摩耗75%のクリフまであと約${lapsToCliff}周`}
                            >
                              {isAtCliff ? '🚨 限界 (要BOX)' : `約 ${lapsToCliff} 周`}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  {/* 4 Sub-system Telemetry Readouts */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 pt-0.5">
                    <div className="p-1.5 sm:p-2 rounded-xl bg-slate-900 border border-white/10">
                      <span className="text-[8.5px] font-mono text-slate-400 block truncate">ブレーキ温度 (4輪)</span>
                      <span className="font-racing font-bold text-xs sm:text-sm text-amber-400 mt-0.5 block transition-all">
                        {liveTelemetry?.brakeTemp ?? (playerCar?.brakeTemp || 540)}°C
                      </span>
                    </div>

                    <div className="p-1.5 sm:p-2 rounded-xl bg-slate-900 border border-white/10">
                      <span className="text-[8.5px] font-mono text-slate-400 block truncate">ERS バッテリー SOC</span>
                      <span className="font-racing font-bold text-xs sm:text-sm text-cyan-400 mt-0.5 block transition-all">
                        {liveTelemetry?.ersBatterySoc ?? (playerCar?.ersBatterySoc || 85)}%
                      </span>
                    </div>

                    <div className="p-1.5 sm:p-2 rounded-xl bg-slate-900 border border-white/10">
                      <span className="text-[8.5px] font-mono text-slate-400 block truncate">残燃料搭載量</span>
                      <span className="font-racing font-bold text-xs sm:text-sm text-emerald-400 mt-0.5 block">
                        {playerCar?.fuelRemainingKg || 25.0} kg
                      </span>
                    </div>

                    <div className="p-1.5 sm:p-2 rounded-xl bg-slate-900 border border-white/10">
                      <span className="text-[8.5px] font-mono text-slate-400 block truncate">ドライバー信頼度</span>
                      <span className="font-racing font-bold text-xs sm:text-sm text-white mt-0.5 block">
                        {playerCar?.driverConfidence || 90}%
                      </span>
                    </div>
                  </div>

                  {/* Popover overlay for Telemetry: positioned relative to card, elevated to z-50, expands upwards from bottom-2 */}
                  {(activeHelpCard === 'telemetry' || hoveredHelpCard === 'telemetry') && (
                    <div
                      style={{ backgroundColor: '#020617' }}
                      className="absolute inset-x-1 bottom-2 p-3 rounded-2xl bg-slate-950 border border-amber-500/80 shadow-[0_25px_60px_rgba(0,0,0,1)] z-50 text-left max-h-[380px] overflow-y-auto scrollbar-thin transition-all duration-150 animate-in fade-in zoom-in-95 ring-1 ring-amber-500/50"
                      onMouseEnter={() => setHoveredHelpCard('telemetry')}
                      onMouseLeave={() => setHoveredHelpCard(null)}
                    >
                      <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-white/10">
                        <div className="flex items-center gap-1.5">
                          <HelpCircle className="w-4 h-4 text-amber-400" />
                          <span className="font-racing text-xs font-bold text-amber-300">TELEMETRY &amp; THERMALS 戦術判断ガイド</span>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveHelpCard(null);
                            setHoveredHelpCard(null);
                          }}
                          className="text-slate-400 hover:text-white text-xs px-1.5 py-0.5 rounded hover:bg-slate-800"
                          title="閉じる"
                        >
                          ✕
                        </button>
                      </div>
                      <div className="space-y-2 text-[10px] text-slate-300 leading-relaxed">
                        <div>
                          <div className="font-bold text-amber-300 flex items-center gap-1 mb-0.5">
                            <span>🎯</span> <span>このデータは何を見るのか？</span>
                          </div>
                          <p className="text-slate-400">
                            4輪タイヤの「表面温度」と「内部温度」、およびブレーキ・ERS（電気エネルギー）・燃料の健全性をリアルタイムに監視する計器です。
                          </p>
                        </div>

                        <div>
                          <div className="font-bold text-emerald-300 flex items-center gap-1 mb-0.5">
                            <span>📊</span> <span>各指標の見方と判断基準</span>
                          </div>
                          <ul className="space-y-1 text-slate-400">
                            <li>
                              <strong className="text-emerald-300">・88°C 〜 125°C【OPT (最適作動域)】:</strong> タイヤのゴムが路面に最も食いつく状態。全力アタックやオーバーテイクが可能です。
                            </li>
                            <li>
                              <strong className="text-red-400">・125°C 超【HOT (過熱警告・ブリスターリスク)】:</strong> 表面が溶け始め、熱ダレ（Overheating）でグリップが急低下。ゴム内部に気泡が生じる「ブリスター」が発生しタイヤ寿命が削られます。直ちにペースを落とし、スライドを抑えて冷却が必要です。
                            </li>
                            <li>
                              <strong className="text-cyan-300">・88°C 未満【COLD (温度低下・グレイニングリスク)】:</strong> 冷えたゴムが路面に引き裂かれ、表面がささくれ立つ「グレイニング」が発生。アンダーステアやロックアップが多発します。
                            </li>
                            <li>
                              <strong className="text-amber-300">・💨 ダーティエア (DIRTY AIR / 乱流):</strong> 前走車の1.2秒以内を追従すると、前走車の乱気流によりダウンフォースが約15〜22%低下。前輪が滑りやすくなり表面温度が急上昇します。オーバーテイクを仕掛ける時以外は、少し間隔（1.5秒以上）を空けてクリーンエアを吸わせるか、直ちに <span className="text-purple-300 font-bold">ERS BOOST</span> を使って一気に抜き去る判断が必要です。
                            </li>
                            <li>
                              <strong className="text-sky-300">・📉 デグラデーション (秒/周) ＆ クリフ:</strong> タイヤゴムの摩耗に伴う1周あたりのペース低下値。摩耗率が約75%に達すると「クリフ（崖）」に落ち、1周あたり1〜2秒以上急落します。<span className="text-amber-300 font-bold">「クリフまであと2周」</span>に達したら、次周の <span className="text-red-300 font-bold">BOX BOX</span> を準備してください。
                            </li>
                            <li>
                              <strong className="text-cyan-400">・ERS バッテリー SOC (%):</strong> ハイブリッドの蓄電量（0〜100%）。<strong className="text-cyan-200">80%以上</strong>あればストレートで「ERS BOOST」を全開投入してオーバーテイクや防衛が可能。30%以下ならチャージ優先。
                            </li>
                            <li>
                              <strong className="text-amber-300">・ブレーキ温度 (°C):</strong> 400〜800°Cが適正。900°Cを超えるとフェード（制動力喪失）、400°C未満は効きが悪化。
                            </li>
                          </ul>
                        </div>

                        <div className="pt-1 border-t border-white/10">
                          <div className="font-bold text-sky-300 flex items-center gap-1 mb-0.5">
                            <span>⚡</span> <span>推奨アクション</span>
                          </div>
                          <p className="text-slate-300">
                            前走車の直後で <strong className="text-amber-300">DIRTY AIR</strong> ➔ 抜くなら <span className="px-1 py-0.2 rounded bg-purple-950 border border-purple-500/50 text-purple-300 font-mono font-bold">ERS BOOST</span> で即座に仕留める。抜けないなら1.5s離してタイヤ冷却！<br />
                            タイヤが <strong className="text-red-400">HOT</strong> または <strong className="text-red-400">BLISTERING</strong> ➔ PUモードを <span className="px-1 py-0.2 rounded bg-emerald-950 border border-emerald-500/50 text-emerald-300 font-mono font-bold">CONSERVE</span> にしてタイヤ保護・冷却！<br />
                            タイヤ <strong className="text-red-400">CLIFF限界</strong> ➔ 次のタイヤを決めて <span className="px-1 py-0.2 rounded bg-red-900/60 border border-red-500/50 text-white font-mono font-bold">BOX BOX</span>！
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Monitor 1: Pit Exit Traffic Window Radar */}
            {activeMonitor === 'timing' && (
              <div className="glass-card-premium p-3 sm:p-4 rounded-2xl border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-racing text-sm font-bold text-white flex items-center gap-2">
                    <Crosshair className="w-4 h-4 text-cyan-400" /> PIT EXIT WINDOW RADAR
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                      pitExitTraffic.trafficStatus === 'CLEAN_AIR'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                        : pitExitTraffic.trafficStatus === 'CAUTION'
                        ? 'bg-amber-950 text-amber-300 border border-amber-500/40'
                        : 'bg-red-950 text-red-300 border border-red-500/40'
                    }`}
                  >
                    {pitExitTraffic.trafficStatus === 'CLEAN_AIR'
                      ? '🟢 CLEAN AIR (クリアエア)'
                      : pitExitTraffic.trafficStatus === 'CAUTION'
                      ? '🟡 CAUTION (接戦)'
                      : '🔴 IN TRAFFIC (乱気流渋滞)'}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-white/10 space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">想定復帰順位:</span>
                    <span className="font-racing font-bold text-lg text-white">
                      P{pitExitTraffic.predictedExitPosition}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">ピット所要ロス:</span>
                    <span className="font-mono font-bold text-amber-400">
                      {pitExitTraffic.pitLossSeconds}秒 (
                      {currentSnapshot?.isSC ? 'SCチープピット' : '通常ピット'})
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">前走車とのギャップ:</span>
                    <span className="font-mono font-bold text-white">
                      {pitExitTraffic.aheadCarCode
                        ? `+${pitExitTraffic.gapAheadSeconds}s (${pitExitTraffic.aheadCarCode}の後方)`
                        : '前走車なし (首位復帰)'}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">後続車とのギャップ:</span>
                    <span className="font-mono font-bold text-white">
                      {pitExitTraffic.behindCarCode
                        ? `+${pitExitTraffic.gapBehindSeconds}s (${pitExitTraffic.behindCarCode}の前方)`
                        : '後続車なし'}
                    </span>
                  </div>
                </div>

                {/* Tactical Hint */}
                <div className="p-2.5 rounded-xl bg-slate-950/90 border border-white/5 text-[11px] text-slate-300 leading-relaxed">
                  💡 <span className="font-bold text-white">ストラテジストのアドバイス:</span>{' '}
                  {pitExitTraffic.trafficStatus === 'CLEAN_AIR'
                    ? 'ピットアウト後は前後に2秒以上のクリアエアがあります。新品タイヤのアウトラップで爆発的なアンダーカットが期待できます！'
                    : '中団グループのダーティエアに復帰するリスク大。タイヤが熱ダレする恐れがあるため、ステイアウトでオーバーカットを狙う手もあります。'}
                </div>
              </div>
            )}

            {/* MONITOR 2: CAR TELEMETRY & DUAL-LAYER TYRE THERMALS */}
            {activeMonitor === 'thermals' && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {/* 4 Tyre Cards with Surface vs Core Temps */}
                  {[
                    { code: 'FL' as const, label: '前左' },
                    { code: 'FR' as const, label: '前右' },
                    { code: 'RL' as const, label: '後左' },
                    { code: 'RR' as const, label: '後右' },
                  ].map((tyre) => {
                    const liveData = liveTelemetry?.tyres[tyre.code];
                    const surf = liveData ? liveData.surf : (playerCar?.tyreSurfaceTemp || 100);
                    const core = liveData ? liveData.core : (playerCar?.tyreCoreTemp || 98);
                    const isOverheat = surf > 125;
                    const isCold = surf < 88;
                    return (
                      <div
                        key={tyre.code}
                        className={`glass-card-premium p-2.5 sm:p-3 rounded-2xl border ${
                          isOverheat
                            ? 'border-red-500/60 bg-red-950/20'
                            : isCold
                            ? 'border-cyan-500/60 bg-cyan-950/20'
                            : 'border-white/10'
                        }`}
                      >
                        <div className="flex justify-between items-center text-[10px] sm:text-xs text-slate-300 pb-1.5 border-b border-white/10">
                          <div className="flex items-baseline gap-1.5">
                            <span className="font-racing font-bold text-white text-sm leading-none">{tyre.code}</span>
                            <span className="text-[10px] text-slate-400 font-mono leading-none">({tyre.label})</span>
                          </div>
                          <span
                            className={`px-1 py-0.2 rounded text-[9px] font-bold ${
                                isOverheat
                                  ? 'bg-red-600 text-white animate-pulse'
                                  : isCold
                                  ? 'bg-cyan-600 text-white'
                                  : 'bg-emerald-600 text-white'
                              }`}
                            >
                              {isOverheat ? 'OVERHEAT' : isCold ? 'COLD' : 'OPT'}
                            </span>
                          </div>

                          <div className="mt-2 space-y-1 text-xs">
                            <div className="flex justify-between text-[11px]">
                              <span className="text-slate-400">表面温度:</span>
                              <span
                                className={`font-mono font-bold ${
                                  isOverheat
                                    ? 'text-red-400'
                                    : isCold
                                    ? 'text-cyan-400'
                                    : 'text-emerald-400'
                                }`}
                              >
                                {surf.toFixed(0)}°C
                              </span>
                            </div>
                            <div className="flex justify-between text-[11px]">
                              <span className="text-slate-400">内部コア:</span>
                              <span className="font-mono text-slate-300">{core.toFixed(0)}°C</span>
                            </div>
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>

                {/* Sub-system Telemetry Readouts */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-white/10">
                    <span className="text-[10px] font-mono text-slate-400">ブレーキ温度 (4輪)</span>
                    <div className="font-racing font-bold text-base text-amber-400 mt-0.5">
                      {playerCar?.brakeTemp || 540}°C
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-900 border border-white/10">
                    <span className="text-[10px] font-mono text-slate-400">ERS バッテリー SOC</span>
                    <div className="font-racing font-bold text-base text-cyan-400 mt-0.5">
                      {playerCar?.ersBatterySoc || 85}%
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-900 border border-white/10">
                    <span className="text-[10px] font-mono text-slate-400">残燃料搭載量</span>
                    <div className="font-racing font-bold text-base text-emerald-400 mt-0.5">
                      {playerCar?.fuelRemainingKg || 25.0} kg
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-900 border border-white/10">
                    <span className="text-[10px] font-mono text-slate-400">ドライバー信頼度</span>
                    <div className="font-racing font-bold text-base text-white mt-0.5">
                      {playerCar?.driverConfidence || 90}%
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* MONITOR 3: WEATHER, TRACK DRYING & INCIDENT RISK */}
            {activeMonitor === 'weather' && (
              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Doppler Radar */}
                  <div className="glass-card-premium p-3.5 rounded-2xl border border-white/10 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="font-racing text-sm font-bold text-white flex items-center gap-1.5">
                        <CloudRain className="w-4 h-4 text-sky-400" /> DOPPLER RAIN RADAR
                      </span>
                      <span className="px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-500/30 text-[10px] font-mono font-bold uppercase">
                        {currentSnapshot?.rainRadar.intensity || 'DRY'}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-950 border border-white/10 flex flex-col sm:flex-row items-center gap-3">
                      {/* Animated Circular Radar Screen */}
                      <div className="relative w-28 h-28 shrink-0 rounded-full border-2 border-sky-500/30 bg-radial from-sky-950/40 via-slate-950 to-slate-950 overflow-hidden shadow-inner flex items-center justify-center">
                        <div className="absolute inset-1.5 rounded-full border border-sky-500/20 border-dashed" />
                        <div className="absolute inset-4 rounded-full border border-sky-500/25 border-dashed" />
                        <div className="absolute inset-x-0 top-1/2 h-px bg-sky-500/20" />
                        <div className="absolute inset-y-0 left-1/2 w-px bg-sky-500/20" />
                        <span className="absolute top-0.5 text-[7px] font-mono font-bold text-slate-500">N</span>
                        <div className="absolute inset-0 rounded-full animate-[spin_3.5s_linear_infinite] pointer-events-none origin-center opacity-40 bg-[conic-gradient(from_0deg,transparent_0_300deg,rgba(56,189,248,0.4)_360deg)]" />
                        <div className="relative z-10 w-2 h-2 rounded-full bg-red-500 shadow-md shadow-red-500/80 ring-2 ring-red-400 animate-pulse" />
                        {(() => {
                          const radar = currentSnapshot?.rainRadar;
                          if (!radar || radar.distanceKm === undefined) return null;
                          if (radar.distanceKm === 0) {
                            return <div className="absolute inset-2 rounded-full bg-sky-500/20 border-2 border-sky-400/50 animate-ping pointer-events-none" />;
                          }
                          const maxDist = 15;
                          const norm = Math.min(1, radar.distanceKm / maxDist);
                          const radiusPx = 40;
                          const xOffset = -norm * radiusPx * 0.707;
                          const yOffset = norm * radiusPx * 0.707;
                          return (
                            <div
                              className="absolute z-10 flex flex-col items-center justify-center transition-all duration-700"
                              style={{ transform: `translate(${xOffset}px, ${yOffset}px)` }}
                            >
                              <div className="w-4 h-4 rounded-full bg-sky-400/30 border border-sky-400 flex items-center justify-center animate-pulse shadow-sm shadow-sky-400/50">
                                <CloudRain className="w-2.5 h-2.5 text-sky-300" />
                              </div>
                              <span className="text-[7px] font-mono font-bold text-sky-300 whitespace-nowrap bg-slate-900/90 px-1 rounded mt-0.5">
                                {radar.distanceKm}km
                              </span>
                            </div>
                          );
                        })()}
                      </div>

                      {/* Radar Stats */}
                      <div className="flex-1 min-w-0 space-y-1 text-xs w-full">
                        <div className="flex justify-between">
                          <span className="text-slate-400">雨雲距離:</span>
                          <span className="font-mono font-bold text-white">
                            {currentSnapshot?.rainRadar.distanceKm! > 10
                              ? '>10km'
                              : currentSnapshot?.rainRadar.distanceKm === 0
                              ? '頭上 (降雨中)'
                              : `${currentSnapshot?.rainRadar.distanceKm} km`}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">到達予測 (ETA):</span>
                          <span className="font-mono font-bold text-amber-400">
                            {currentSnapshot?.rainRadar.etaMinutes! > 0
                              ? `約${currentSnapshot?.rainRadar.etaMinutes}分後`
                              : currentSnapshot?.rainRadar.distanceKm === 0
                              ? '現在通過中'
                              : '接近中'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">路面水量:</span>
                          <span className="font-mono font-bold text-sky-400">
                            {currentSnapshot?.rainRadar.waterDepthMm} mm
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">路面温度:</span>
                          <span className="font-mono font-bold text-amber-400">
                            {currentSnapshot?.rainRadar.trackTempC || 30}°C
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Compound Crossover Spectrum */}
                  <div className="glass-card-premium p-3.5 rounded-2xl border border-white/10 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="font-racing text-sm font-bold text-white flex items-center gap-1.5">
                        <Gauge className="w-4 h-4 text-emerald-400" /> TYRE CROSSOVER
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        SLICK ⇄ INTER ⇄ WET
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-900 border border-white/10 space-y-2 text-xs">
                      <div>
                        <div className="flex justify-between text-[11px] mb-1 font-mono">
                          <span className="text-slate-400">水深スペクトラム</span>
                          <span className="font-bold text-sky-300">
                            {currentSnapshot?.rainRadar.waterDepthMm.toFixed(1)} mm
                          </span>
                        </div>

                        <div className="relative pt-3 pb-1">
                          {(() => {
                            const depth = currentSnapshot?.rainRadar.waterDepthMm || 0;
                            const maxScale = 5.0;
                            const pct = Math.min(100, Math.max(0, (depth / maxScale) * 100));
                            return (
                              <div
                                className="absolute top-0 -translate-x-1/2 flex flex-col items-center transition-all duration-500 z-10"
                                style={{ left: `${pct}%` }}
                              >
                                <span className="text-[8px] font-mono font-black text-white bg-red-600 px-1 py-0.2 rounded shadow-md ring-1 ring-white/50">
                                  {depth.toFixed(1)}mm
                                </span>
                                <span className="text-red-500 text-[8px] -mt-0.5 leading-none">▼</span>
                              </div>
                            );
                          })()}

                          <div className="w-full h-2.5 rounded-full overflow-hidden flex shadow-inner border border-white/10">
                            <div className="h-full bg-gradient-to-r from-red-500 via-amber-400 to-yellow-300" style={{ width: '16%' }} title="SLICK: 0.0〜0.8mm" />
                            <div className="h-full bg-gradient-to-r from-emerald-500 via-green-400 to-teal-400" style={{ width: '64%' }} title="INTER: 0.8〜4.0mm" />
                            <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-600" style={{ width: '20%' }} title="WET: 4.0mm+" />
                          </div>
                        </div>
                      </div>

                      {/* Strategic Crossover Recommendation */}
                      <div className="p-2 rounded-lg bg-slate-950 border border-white/5 text-[11px] font-mono leading-relaxed text-slate-300">
                        {(() => {
                          const depth = currentSnapshot?.rainRadar.waterDepthMm || 0;
                          const currentTyre = playerCar?.tyreCompound || 'MEDIUM';
                          if (depth > 4.0) {
                            return <p className="text-blue-300 font-bold">🚨 ヘビーウェット（水深4.0mm突破）。フルウェット（🔵 WET）必須。</p>;
                          }
                          if (depth >= 0.8) {
                            if (currentTyre === 'SOFT' || currentTyre === 'MEDIUM' || currentTyre === 'HARD') {
                              return <p className="text-emerald-300 font-bold">⚡ スリックからインターミディエイト（🟢 INTER）への履き替え推奨！</p>;
                            }
                            return <p className="text-emerald-300">🟢 インターミディエイト最適ウィンドウ。安定してラップを刻めます。</p>;
                          }
                          if (depth < 0.8 && depth > 0.3) {
                            if (currentTyre === 'INTER' || currentTyre === 'WET') {
                              return <p className="text-amber-300 font-bold">⚡ スリックタイヤへのクロスオーバー境界。アンダーカット決断の好機！</p>;
                            }
                            return <p className="text-slate-200">☀️ スリックタイヤ適合域。レコードラインは十分なグリップがあります。</p>;
                          }
                          return <p className="text-slate-300">☀️ 完全ドライ。スリックタイヤのグリップが100%発揮されます。</p>;
                        })()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── COLUMN 4 (RIGHT): Comms, Live Feed & Tactical Commands ── */}
        <div className={`w-full min-w-0 space-y-2.5 ${mobileConsoleView === 'comms' ? 'block' : 'hidden lg:block'}`}>
          {/* ── MISSION CONTROL INTEL (Rival Espionage & Shared Analytics) ── */}
          <div className="glass-card-premium p-2.5 sm:p-3 rounded-2xl border border-white/10 shadow-lg backdrop-blur-md flex flex-col h-[388px] relative overflow-hidden">
            {/* 1. Active Radio Prompt Overlay (Tactical Override - Covers Intel without breaking layout) */}
            {currentSnapshot?.activeRadioPrompt && !radioResponses[currentSnapshot.activeRadioPrompt.id] && !minimizeRadioPrompt && (
              <div className="absolute inset-0 z-30 rounded-2xl bg-gradient-to-b from-red-950/98 via-slate-950/98 to-slate-950/98 border-2 border-red-500/90 p-3 sm:p-3.5 flex flex-col justify-between backdrop-blur-xl shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between pb-1.5 border-b border-red-500/40 shrink-0">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                    <span className="font-racing font-bold text-red-300 text-xs tracking-wider uppercase flex items-center gap-1.5">
                      <Radio className="w-3.5 h-3.5 text-red-400" />
                      緊急戦略判断 // {currentSnapshot.activeRadioPrompt.urgency.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-racing font-bold text-white px-2 py-0.5 rounded bg-red-900/60 border border-red-400/40">
                      {currentSnapshot.activeRadioPrompt.speaker}
                    </span>
                    <button
                      type="button"
                      onClick={() => setMinimizeRadioPrompt(true)}
                      className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
                      title="インテル情報を一時確認（プロンプトを最小化）"
                    >
                      📊 INTEL確認
                    </button>
                  </div>
                </div>

                {/* Message Body */}
                <div className="py-2.5 px-3 rounded-xl bg-black/60 border border-red-500/20 text-xs sm:text-sm text-white font-mono leading-relaxed my-auto shadow-inner">
                  <p className="text-slate-100">{currentSnapshot.activeRadioPrompt.message}</p>
                </div>

                {/* Option Buttons */}
                <div className="grid grid-cols-1 gap-1.5 pt-1.5 border-t border-red-500/30 shrink-0">
                  {currentSnapshot.activeRadioPrompt.options.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => {
                        handleRadioResponse(currentSnapshot.activeRadioPrompt!.id, opt);
                        setMinimizeRadioPrompt(false);
                      }}
                      className="p-2 sm:p-2.5 rounded-xl bg-slate-900/90 hover:bg-red-900/50 border border-red-500/40 hover:border-red-400 text-left transition-all cursor-pointer group shadow-md active:scale-[0.98]"
                    >
                      <div className="text-xs font-racing font-bold text-white group-hover:text-red-200 flex items-center justify-between">
                        <span>{opt.label}</span>
                        <span className="text-[10px] text-red-400 group-hover:text-white font-mono">選択 ▶</span>
                      </div>
                      <div className="text-[10px] text-slate-300 mt-0.5 font-sans">{opt.effectText}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Minimized Banner if user wants to peek at Intel data */}
            {currentSnapshot?.activeRadioPrompt && !radioResponses[currentSnapshot.activeRadioPrompt.id] && minimizeRadioPrompt && (
              <div className="mb-1.5 p-1.5 rounded-lg bg-red-950/90 border border-red-500 flex items-center justify-between text-xs animate-pulse shrink-0">
                <span className="text-[10px] font-racing text-red-200 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                  🚨 緊急判断待機中: {currentSnapshot.activeRadioPrompt.speaker}
                </span>
                <button
                  type="button"
                  onClick={() => setMinimizeRadioPrompt(false)}
                  className="px-2 py-0.5 rounded bg-red-600 hover:bg-red-500 text-white text-[9.5px] font-racing font-bold shadow cursor-pointer transition-colors"
                >
                  判断画面を開く ▶
                </button>
              </div>
            )}

            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-1.5 pb-1.5 border-b border-white/10 shrink-0">
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                </span>
                <span className="font-racing text-xs font-bold text-white flex items-center gap-1 tracking-wider">
                  <ShieldAlert className="w-3.5 h-3.5 text-cyan-400" /> MISSION CONTROL INTEL
                </span>
                <span className="text-[8px] font-mono text-cyan-300 bg-cyan-950/60 border border-cyan-500/30 px-1 py-0.2 rounded">
                  分析班共有
                </span>
              </div>

              {/* Filter Chips */}
              <div className="flex items-center bg-slate-900/90 p-0.5 rounded-lg border border-white/10 text-[8.5px] font-racing">
                {(['all', 'tyre', 'telemetry', 'radio_intercept', 'ers', 'pit_stop'] as const).map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setRivalIntelFilter(filter)}
                    className={`px-1.5 py-0.5 rounded font-bold transition-all cursor-pointer ${
                      rivalIntelFilter === filter
                        ? 'bg-cyan-950 text-cyan-200 border border-cyan-500/50 shadow-sm font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                    title={
                      filter === 'all'
                        ? '全インテル表示'
                        : filter === 'tyre'
                        ? 'ライバルタイヤ監視'
                        : filter === 'telemetry'
                        ? '最高速・セクター解析'
                        : filter === 'radio_intercept'
                        ? '敵無線傍受・ブラフ看破'
                        : filter === 'ers'
                        ? 'ERS・クリッピング監視'
                        : 'ピット作業速報'
                    }
                  >
                    {filter === 'all'
                      ? 'ALL'
                      : filter === 'tyre'
                      ? '🛞 タイヤ'
                      : filter === 'telemetry'
                      ? '⚡ 最高速'
                      : filter === 'radio_intercept'
                      ? '📻 傍受'
                      : filter === 'ers'
                      ? '🔋 ERS'
                      : '⏱️ PIT'}
                  </button>
                ))}
              </div>
            </div>

            {/* Tactical Assist Mode Guidance Banner */}
            {userAssistLevel === 'assisted' && tacticalAssistGuidance && (
              <div className="mt-1.5 p-2 rounded-xl bg-gradient-to-r from-cyan-950/90 via-slate-900 to-cyan-950/70 border border-cyan-500/40 text-xs shadow-sm shrink-0 animate-in fade-in duration-200">
                <div className="flex items-center justify-between text-[10px] font-racing text-cyan-300 pb-1 border-b border-cyan-500/20">
                  <div className="flex items-center gap-1.5 font-bold">
                    <span>{tacticalAssistGuidance.icon}</span>
                    <span>TACTICAL ASSIST GUIDE (計器確認ガイダンス)</span>
                  </div>
                  <span className="font-mono text-[8.5px] text-cyan-400 bg-cyan-950 px-1.5 py-0.5 rounded border border-cyan-500/30">
                    {tacticalAssistGuidance.target}
                  </span>
                </div>
                <div className="text-[10px] text-slate-200 mt-1 leading-relaxed font-sans">
                  {tacticalAssistGuidance.message}
                </div>
              </div>
            )}

            {/* Reports Stream */}
            <div className="space-y-1.5 overflow-y-auto pr-1 flex-1 min-h-0 pt-1.5">
              {filteredRivalIntel.length === 0 ? (
                <div className="py-4 text-center text-xs font-mono text-slate-500">
                  現在このカテゴリの共有インテルはありません
                </div>
              ) : (
                filteredRivalIntel.map((report) => {
                  const isExpanded = selectedIntelRivalId === report.id;
                  const isHigh = report.priority === 'high';
                  const isTyre = report.category === 'tyre';
                  const isTelem = report.category === 'telemetry';
                  const isRadio = report.category === 'radio_intercept';
                  const isErs = report.category === 'ers';

                  const borderAccentColor = isHigh
                    ? 'border-l-rose-500'
                    : isTyre
                    ? 'border-l-emerald-400'
                    : isTelem
                    ? 'border-l-cyan-400'
                    : isRadio
                    ? 'border-l-amber-400'
                    : isErs
                    ? 'border-l-purple-400'
                    : 'border-l-sky-400';

                  return (
                    <div
                      key={report.id}
                      className={`p-2 rounded-xl bg-slate-900/90 border border-white/10 border-l-[3px] ${borderAccentColor} hover:border-white/20 transition-all shadow-sm`}
                    >
                      <div className="flex items-center justify-between text-[9px] mb-0.5">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {/* Role Title */}
                          <span className="font-racing font-bold text-white text-[10.5px]">
                            {report.analystRole}
                          </span>
                          {/* Target Car Badge */}
                          <span
                            className="px-1.5 py-0.2 rounded font-mono font-bold text-[8.5px] border bg-slate-800/80 text-white flex items-center gap-1"
                            style={{ borderColor: `${report.targetCarColor}60` }}
                          >
                            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: report.targetCarColor }} />
                            <span>{report.targetCarCode} (P{report.targetCarPos})</span>
                          </span>
                        </div>

                        {/* Subtle Monochrome Lap & Confidence Meta (No colorful pills) */}
                        <div className="flex items-center gap-1.5 text-[9px] font-mono text-slate-400">
                          <span>L{report.lap}</span>
                          <span className="text-slate-600">·</span>
                          <span className={report.confidence === 'suspect_bluff' ? 'text-amber-400 font-bold' : 'text-slate-400'}>
                            {report.confidenceLabel}
                          </span>
                        </div>
                      </div>

                      {/* Summary Text (Enhanced font-sans with bold numbers) */}
                      <div className="text-[11.5px] font-sans text-slate-100 leading-snug">
                        {report.summary}
                      </div>

                      {/* Action / Detail Strip: Sleek ghost link */}
                      <div className="flex items-center justify-end pt-1 border-t border-white/5 text-[9px] mt-1">
                        <button
                          type="button"
                          onClick={() => setSelectedIntelRivalId(isExpanded ? null : report.id)}
                          className="text-slate-400 hover:text-cyan-300 font-mono transition-colors flex items-center gap-1 cursor-pointer py-0.5 text-[9px]"
                        >
                          <span>詳細データ</span>
                          <span className="text-[8px]">{isExpanded ? '▲' : '▼'}</span>
                        </button>
                      </div>

                      {/* Expanded Raw Telemetry Drawer */}
                      {isExpanded && (
                        <div className="p-2 mt-1.5 rounded-lg bg-slate-950/90 border border-cyan-500/30 space-y-1 text-[9.5px] font-mono text-slate-300 animate-in fade-in duration-200">
                          <div className="flex items-center justify-between pb-1 border-b border-white/10 font-racing font-bold text-cyan-400">
                            <span>{report.targetCarName} ({report.targetCarCode}) 生データ解析</span>
                            <span>P{report.targetCarPos}</span>
                          </div>
                          <div className="grid grid-cols-2 gap-1.5 pt-0.5">
                            <div>
                              <span className="text-slate-400">直近ラップ: </span>
                              <span className="text-white font-bold">{report.rawTelemetry.lapTimes.join(' ➔ ')}</span>
                            </div>
                            <div>
                              <span className="text-slate-400">最高速 (ST): </span>
                              <span className="text-white font-bold">{report.rawTelemetry.speedTrapKmh} km/h</span>
                              <span className={report.rawTelemetry.playerDeltaSpeedKmh > 0 ? 'text-rose-400 ml-1' : 'text-emerald-400 ml-1'}>
                                (自車比 {report.rawTelemetry.playerDeltaSpeedKmh > 0 ? '+' : ''}{report.rawTelemetry.playerDeltaSpeedKmh}km/h)
                              </span>
                            </div>
                            <div>
                              <span className="text-slate-400">タイヤ: </span>
                              <span className="text-amber-300 font-bold">
                                {report.rawTelemetry.tyreCompound} ({report.rawTelemetry.tyreAge}周 / 摩耗{report.rawTelemetry.tyreWearPercent}%)
                              </span>
                            </div>
                            <div>
                              <span className="text-slate-400">ERS残量: </span>
                              <span className={report.rawTelemetry.ersBatterySoc < 30 ? 'text-rose-400 font-bold' : 'text-cyan-300 font-bold'}>
                                {report.rawTelemetry.ersBatterySoc}% {report.rawTelemetry.ersBatterySoc < 30 ? '(クリッピング注意)' : ''}
                              </span>
                            </div>
                          </div>
                          <div className="text-[8.5px] text-slate-400 pt-0.5 flex justify-between items-center border-t border-white/5">
                            <span>自車との差: <strong className="text-white">{report.rawTelemetry.gapToPlayerSec.toFixed(1)}秒</strong> ({report.rawTelemetry.isAhead ? '前走' : '後続'})</span>
                            {report.rawTelemetry.pitStopDuration && (
                              <span className="text-amber-300 font-bold">ピット静止: {report.rawTelemetry.pitStopDuration}s</span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* ── DOCKED PIT STRATEGY & TACTICAL COMMANDS (Unified Single Card) ── */}
          <div className={`glass-card-premium p-2 sm:p-2.5 rounded-xl border border-white/10 space-y-2 shadow-lg backdrop-blur-md transition-all min-h-[238px] flex flex-col justify-between ${
            activeHelpCard === 'pit_exit' || hoveredHelpCard === 'pit_exit' ? 'relative z-50' : 'relative z-20 hover:z-40'
          }`}>
            {/* Header */}
            <div className="flex items-center justify-between pb-1 border-b border-white/10">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="font-racing text-xs font-bold text-white flex items-center gap-1.5 whitespace-nowrap">
                  <Crosshair className="w-3.5 h-3.5 text-cyan-400 shrink-0" /> PIT STRATEGY &amp; COMMANDS
                </span>
                {/* Help button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveHelpCard(activeHelpCard === 'pit_exit' ? null : 'pit_exit');
                  }}
                  onMouseEnter={() => setHoveredHelpCard('pit_exit')}
                  onMouseLeave={() => setHoveredHelpCard(null)}
                  className={`w-3.5 h-3.5 rounded-full border text-[9px] font-mono font-bold flex items-center justify-center transition-all shadow-sm shrink-0 ${
                    activeHelpCard === 'pit_exit' || hoveredHelpCard === 'pit_exit'
                      ? 'bg-cyan-400 text-slate-950 border-cyan-300 ring-2 ring-cyan-400/50'
                      : 'bg-slate-800 hover:bg-cyan-950 border-white/20 hover:border-cyan-400 text-slate-400 hover:text-cyan-300'
                  }`}
                  title="クリックで解説を固定表示 / ホバーで確認"
                >
                  ?
                </button>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[8.5px] font-mono font-bold whitespace-nowrap ${
                    pitExitTraffic.trafficStatus === 'CLEAN_AIR'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                      : pitExitTraffic.trafficStatus === 'CAUTION'
                      ? 'bg-amber-950 text-amber-300 border border-amber-500/40'
                      : 'bg-red-950 text-red-300 border border-red-500/40'
                  }`}
                >
                  {pitExitTraffic.trafficStatus === 'CLEAN_AIR'
                    ? '🟢 CLEAR AIR'
                    : pitExitTraffic.trafficStatus === 'CAUTION'
                    ? '🟡 CAUTION'
                    : '🔴 TRAFFIC'}
                </span>
                <button
                  type="button"
                  onClick={() => setActiveMonitor('timing')}
                  className="p-0.5 rounded text-slate-400 hover:text-white hover:bg-slate-800"
                  title="拡大フォーカス"
                >
                  <Maximize2 className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Pit Entry Proximity Strip (Relocated to Pit Strategy Command Center) */}
            <div className="flex items-center justify-between gap-1 px-2 py-1 rounded-lg bg-slate-900/90 border border-white/10 text-[10.5px] font-mono whitespace-nowrap overflow-hidden">
              <div className="flex items-center gap-1.5 min-w-0">
                <Fuel className="w-3 h-3 text-amber-400 shrink-0" />
                <span className="text-slate-400 text-[10px] shrink-0">ピット入口まで:</span>
                <span className="font-bold text-white text-xs tabular-nums shrink-0">
                  {pitProximity.distanceMeters.toLocaleString()} m
                </span>
                <span className="text-slate-400 text-[9.5px] shrink-0">
                  (約{pitProximity.secondsToPit}秒)
                </span>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                {playerCar?.isPitting ? (
                  <span className="px-1.5 py-0.2 rounded-full bg-amber-950/80 text-amber-300 border border-amber-500/60 text-[9px] font-racing font-bold flex items-center gap-1">
                    <span>🛞 IN PIT LANE (作業中)</span>
                  </span>
                ) : pitProximity.isCommitmentZone ? (
                  <span className="px-1.5 py-0.2 rounded-full bg-red-950 text-red-200 border border-red-500/80 text-[9px] font-racing font-bold animate-pulse flex items-center gap-1 shadow-md shadow-red-950">
                    <AlertTriangle className="w-2.5 h-2.5 text-red-400" />
                    <span>🚨 COMMITMENT (限界点)</span>
                  </span>
                ) : pitProximity.isApproaching ? (
                  <span className="px-1.5 py-0.2 rounded-full bg-amber-950/80 text-amber-300 border border-amber-500/60 text-[9px] font-racing font-bold flex items-center gap-1">
                    <span>🟡 APPROACHING PIT</span>
                  </span>
                ) : (
                  <span className="px-1.5 py-0.2 rounded-full bg-emerald-950/60 text-emerald-300 border border-emerald-500/40 text-[9px] font-mono font-bold flex items-center gap-1">
                    <span>🟢 ON TRACK (巡航中)</span>
                  </span>
                )}
              </div>
            </div>

            {/* 1. Pit Exit Traffic Window (Concise F1 Timing) */}
            <div className="grid grid-cols-2 gap-1 p-1.5 rounded-lg bg-slate-900/90 border border-white/10 text-xs font-mono">
              <div className="flex items-baseline justify-between pr-1">
                <span className="text-[9.5px] text-slate-400 font-bold">EXIT:</span>
                <span className="font-racing font-bold text-sm text-white">
                  P{pitExitTraffic.predictedExitPosition}
                </span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-[9.5px] text-slate-400 font-bold">LOSS:</span>
                <span className="font-mono font-bold text-xs text-amber-400">
                  {pitExitTraffic.pitLossSeconds}s <span className="text-[8px] text-slate-400 font-normal">({currentSnapshot?.isSC ? 'SC' : 'NORM'})</span>
                </span>
              </div>
              <div className="flex items-baseline justify-between pr-1">
                <span className="text-[9.5px] text-slate-400 font-bold">AHEAD:</span>
                <span className="font-mono font-bold text-[10px] text-white truncate max-w-[100px]">
                  {pitExitTraffic.aheadCarCode
                    ? `+${pitExitTraffic.gapAheadSeconds}s (${pitExitTraffic.aheadCarCode})`
                    : 'LEADER'}
                </span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-[9.5px] text-slate-400 font-bold">BEHIND:</span>
                <span className="font-mono font-bold text-[10px] text-white truncate max-w-[100px]">
                  {pitExitTraffic.behindCarCode
                    ? `+${pitExitTraffic.gapBehindSeconds}s (${pitExitTraffic.behindCarCode})`
                    : 'CLEAR'}
                </span>
              </div>
            </div>

            {/* 2. 1-Click Tyre Compound Switcher (Changeable right up until Pit In) */}
            <div className="flex items-center justify-between gap-1.5 bg-slate-900/90 p-1.5 rounded-xl border border-white/10">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="text-[9px] font-mono text-slate-400 shrink-0">次タイヤ:</span>
                <div className="flex items-center gap-1">
                  {(['SOFT', 'MEDIUM', 'HARD', 'INTER', 'WET'] as TyreCompound[]).map((cmp) => {
                    const isSelected = nextCompoundChoice === cmp;
                    const color =
                      cmp === 'SOFT'
                        ? '#ef4444'
                        : cmp === 'MEDIUM'
                        ? '#eab308'
                        : cmp === 'HARD'
                        ? '#f8fafc'
                        : cmp === 'INTER'
                        ? '#10b981'
                        : '#3b82f6';
                    const label = cmp === 'SOFT' ? 'S' : cmp === 'MEDIUM' ? 'M' : cmp === 'HARD' ? 'H' : cmp === 'INTER' ? 'I' : 'W';
                    return (
                      <button
                        key={cmp}
                        type="button"
                        disabled={playerCar?.isPitting}
                        onClick={() => handleCompoundChange(cmp)}
                        className={`px-2 py-0.5 rounded text-[10px] font-racing font-bold border transition-all cursor-pointer flex items-center gap-1 ${
                          isSelected
                            ? 'bg-white/15 border-white text-white shadow-sm ring-1 ring-white/50 scale-105'
                            : 'bg-slate-950/60 border-white/10 text-slate-400 hover:text-white hover:border-white/30'
                        } ${playerCar?.isPitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                        title={`${cmp}: クリックで即座に交換タイヤを変更 (PIT IN直前まで変更可能)`}
                      >
                        <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: color }} />
                        <span>{label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
              <span className="text-[9px] font-mono text-slate-400 shrink-0 font-bold">
                {nextCompoundChoice}
              </span>
            </div>

            {/* 3. Quick Action Command Grid: BOX BOX / PU MODE / ERS BOOST */}
            <div className="grid grid-cols-3 gap-1.5">
              {/* 1. BOX BOX Pit Call Button */}
              <button
                type="button"
                disabled={playerCar?.isPitting}
                onClick={() => {
                  handleToggleBoxNextLap();
                  if (radioAudioEnabled) playF1RadioChirp();
                }}
                className={`p-1.5 rounded-xl border text-left cursor-pointer transition-all shadow-sm ${
                  playerCar?.isPitting
                    ? 'bg-amber-950/70 border-amber-500/50 text-amber-200 cursor-not-allowed'
                    : boxQueuedForNextLap
                    ? 'bg-gradient-to-r from-emerald-600 to-green-600 text-white border-emerald-400 ring-2 ring-emerald-500/50 shadow-emerald-950/50'
                    : pitProximity.isCommitmentZone
                    ? 'bg-red-950/90 hover:bg-red-900 border-red-500 text-white ring-2 ring-red-500/60 animate-pulse'
                    : 'bg-slate-900 hover:bg-red-950/60 border-white/10 hover:border-red-500/40 text-slate-300 hover:text-white'
                }`}
                title={
                  playerCar?.isPitting
                    ? '現在ピット作業中'
                    : boxQueuedForNextLap
                    ? 'ピット指示済み（クリックでキャンセル）'
                    : 'ピットイン指示を出す (BOX BOX)'
                }
              >
                <div className="text-[8px] font-mono opacity-80">
                  {playerCar?.isPitting
                    ? 'IN PIT'
                    : boxQueuedForNextLap
                    ? 'ORDERED'
                    : pitProximity.isCommitmentZone
                    ? '⚠️ COMMIT!'
                    : 'PIT IN'}
                </div>
                <div className="text-[10.5px] font-racing font-bold truncate">
                  {playerCar?.isPitting
                    ? '🛞 PITTING'
                    : boxQueuedForNextLap
                    ? '✅ BOX BOX'
                    : '🛞 "BOX BOX"'}
                </div>
              </button>

              {/* 2. PU Mode Switcher */}
              <button
                type="button"
                onClick={() => {
                  const next =
                    activePuMode === 'push'
                      ? 'conserve'
                      : activePuMode === 'conserve'
                      ? 'standard'
                      : 'push';
                  handlePuModeChange(next);
                  if (radioAudioEnabled) playF1RadioChirp();
                }}
                className={`p-1.5 rounded-xl border text-left cursor-pointer transition-all ${
                  activePuMode === 'push'
                    ? 'bg-rose-950 border-rose-500 text-rose-200 ring-1 ring-rose-500'
                    : activePuMode === 'conserve'
                    ? 'bg-emerald-950 border-emerald-500 text-emerald-200 ring-1 ring-emerald-500'
                    : 'bg-slate-900 hover:bg-slate-800 border-white/10 text-slate-300'
                }`}
                title="PUモード切替 (PUSH ⚡ / SAVE 🌱 / STD 🏎️)"
              >
                <div className="text-[8px] font-mono text-slate-400">ENGINE</div>
                <div className="text-[10.5px] font-racing font-bold truncate">
                  {activePuMode === 'push' ? '⚡ PUSH' : activePuMode === 'conserve' ? '🌱 SAVE' : '🏎️ STD'}
                </div>
              </button>

              {/* 3. ERS Boost Overtake Toggle */}
              <button
                type="button"
                disabled={!ersBoostUsedThisLap && !ersEligibility.eligible}
                onClick={() => {
                  if (ersBoostUsedThisLap || ersEligibility.eligible) {
                    handleToggleErs();
                    if (radioAudioEnabled) playF1RadioChirp();
                  }
                }}
                className={`p-1.5 rounded-xl border text-left transition-all ${
                  ersBoostUsedThisLap
                    ? 'bg-cyan-950 border-cyan-400 text-cyan-200 ring-2 ring-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.5)] cursor-pointer animate-pulse'
                    : ersEligibility.eligible
                    ? 'bg-emerald-950/90 hover:bg-emerald-900 border-emerald-400 text-emerald-200 ring-1 ring-emerald-500/50 cursor-pointer animate-pulse'
                    : 'bg-slate-900/60 border-white/5 text-slate-500 cursor-not-allowed opacity-60'
                }`}
                title={
                  ersBoostUsedThisLap
                    ? 'ERSオーバーテイク稼働中（クリックで解除）'
                    : ersEligibility.reason
                }
              >
                <div className="text-[8px] font-mono opacity-80 flex items-center justify-between">
                  <span>OVERTAKE</span>
                  {ersBoostUsedThisLap ? (
                    <span className="text-cyan-300 font-bold">ON</span>
                  ) : ersEligibility.eligible ? (
                    <span className="text-emerald-400 font-bold">&le;1.0s</span>
                  ) : null}
                </div>
                <div className="text-[10px] font-racing font-bold truncate">
                  {ersBoostUsedThisLap
                    ? '⚡ BOOST ON'
                    : ersEligibility.eligible
                    ? '🟢 READY'
                    : ersEligibility.label}
                </div>
              </button>
            </div>

            {/* Popover overlay: positioned relative to card, elevated to z-50 */}
            {(activeHelpCard === 'pit_exit' || hoveredHelpCard === 'pit_exit') && (
              <div
                style={{ backgroundColor: '#020617' }}
                className="absolute inset-x-1 bottom-2 p-3 rounded-2xl bg-slate-950 border border-cyan-500/80 shadow-[0_25px_60px_rgba(0,0,0,1)] z-50 text-left max-h-[380px] overflow-y-auto scrollbar-thin transition-all duration-150 animate-in fade-in zoom-in-95 ring-1 ring-cyan-500/50"
                onMouseEnter={() => setHoveredHelpCard('pit_exit')}
                onMouseLeave={() => setHoveredHelpCard(null)}
              >
                <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-white/10">
                  <div className="flex items-center gap-1.5">
                    <HelpCircle className="w-4 h-4 text-cyan-400" />
                    <span className="font-racing text-xs font-bold text-cyan-300">PIT STRATEGY &amp; COMMANDS 戦術判断ガイド</span>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveHelpCard(null);
                      setHoveredHelpCard(null);
                    }}
                    className="text-slate-400 hover:text-white text-xs px-1.5 py-0.5 rounded hover:bg-slate-800"
                    title="閉じる"
                  >
                    ✕
                  </button>
                </div>
                <div className="space-y-2 text-[10px] text-slate-300 leading-relaxed">
                  <div>
                    <div className="font-bold text-amber-300 flex items-center gap-1 mb-0.5">
                      <span>🎯</span> <span>このデータは何を見るのか？</span>
                    </div>
                    <p className="text-slate-400">
                      ピットインを行った場合、<strong className="text-white">「コース復帰時に何位・誰の前後何秒差で戻るか」</strong>をリアルタイムにシミュレーション予測し、即座にタイヤ選択とピット指示（BOX BOX）を実行する計器です。
                    </p>
                  </div>

                  <div>
                    <div className="font-bold text-emerald-300 flex items-center gap-1 mb-0.5">
                      <span>📊</span> <span>各指標の見方と判断基準</span>
                    </div>
                    <ul className="space-y-1 text-slate-400">
                      <li>
                        <strong className="text-white">・EXIT (想定復帰 P○):</strong> ピットアウト直後に合流する予測順位。「手前の集団に呑まれるか、単独で走れるか」を見極めます。
                      </li>
                      <li>
                        <strong className="text-amber-300">・LOSS (所要ロス / 通常22s前後・SC時14s前後):</strong> ピット制限速度走行とタイヤ交換作業で失うタイム。<strong className="text-amber-200">セーフティカー（SC）中はコース上の全車が減速するため、ピットロスが約8〜10秒短縮（チープピット）</strong>されます。SC導入時に即ピットに入るのが圧倒的に有利な理由です。
                      </li>
                      <li>
                        <strong className="text-emerald-300">・CLEAR AIR (緑):</strong> 前走車との差が十分（+3.0秒以上）ある状態。新品タイヤの強力なグリップを邪魔されずに100%発揮し、前を走るライバルを「アンダーカット」で逆転できます。
                      </li>
                      <li>
                        <strong className="text-red-300">・TRAFFIC (赤) / CAUTION (黄):</strong> 遅いバックマーカーや中団集団の真後ろ（+1.0秒以内）に復帰してしまう状態。新品タイヤでも抜けずにタイムを失うため、<strong className="text-amber-200">「ステイアウト」して前が開くまで引っ張る（オーバーカット）</strong>のが定石です。
                      </li>
                      <li>
                        <strong className="text-cyan-300">・AHEAD / BEHIND (前走車差 / 後続車差):</strong> ピットアウト直後の前走車・後続車とのタイム差。相手ドライバーの略称（例: VER, HAM）も表示されます。
                      </li>
                    </ul>
                  </div>

                  <div className="pt-1 border-t border-white/10">
                    <div className="font-bold text-sky-300 flex items-center gap-1 mb-0.5">
                      <span>⚡</span> <span>推奨アクション</span>
                    </div>
                    <p className="text-slate-300">
                      <strong className="text-emerald-300">CLEAR AIR</strong> または <strong className="text-amber-300">SC導入</strong> ➔ 次タイヤを選んで即座に <span className="px-1 py-0.2 rounded bg-red-900/60 border border-red-500/50 text-white font-mono font-bold">BOX BOX</span> を押す！<br />
                      <strong className="text-red-400">TRAFFIC</strong> ➔ ピットインを1〜2周遅らせ、コース上のギャップが開くのを待つ。
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Checkered Flag Finish Banner */}
      {challengeLap >= activeScenario.totalLaps && (
        <div className="p-4 sm:p-6 rounded-2xl bg-gradient-to-r from-red-950 via-slate-900 to-amber-950 border-2 border-red-500 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4 animate-in zoom-in-95 duration-300">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-red-600 flex items-center justify-center text-2xl shadow-lg shrink-0">
              🏁
            </div>
            <div>
              <div className="text-xs font-mono text-amber-400 font-bold">CHECKERED FLAG — RACE FINISHED</div>
              <h3 className="font-racing font-bold text-white text-lg sm:text-xl">
                全{activeScenario.totalLaps}周を完走しました！
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
    <div className="space-y-4 animate-in fade-in zoom-in-95 duration-300">
      {tacticalScore ? (
        <>
          <div className="p-5 rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-red-950/50 border-2 border-red-500/60 shadow-2xl space-y-4">
              
              {/* 1. Header Banner: Mission Result & FIA Rank */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-red-600 via-rose-600 to-amber-600 flex items-center justify-center shadow-xl shadow-red-950/60 border border-red-400/40 shrink-0">
                    <Trophy className="w-7 h-7 text-yellow-300 animate-bounce" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-racing font-black text-white text-lg sm:text-2xl tracking-wider">
                        {playerCar && playerCar.position <= activeScenario.targetPosition
                          ? '🏆 MISSION ACCOMPLISHED'
                          : '⚠️ MISSION FAILED'}
                      </span>
                      <span className="px-3 py-0.5 rounded-full bg-red-600 font-racing font-black text-white text-xs tracking-widest shadow-md">
                        RANK {tacticalScore.rank}
                      </span>
                      {diagnosticResult && (
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[11px] font-racing font-bold flex items-center gap-1">
                          <span>{diagnosticResult.archetype.icon}</span>
                          <span>{diagnosticResult.archetype.name.split('】')[1] || diagnosticResult.archetype.name}</span>
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-300 mt-1 flex flex-wrap items-center gap-2">
                      <span>
                        最終順位: <strong className="text-white font-racing text-sm font-bold">P{playerCar?.position}</strong> (目標 P{activeScenario.targetPosition})
                      </span>
                      <span>•</span>
                      <span>
                        総合得点: <strong className="text-red-400 font-racing text-sm font-bold">{tacticalScore.totalScore}点</strong> / 100
                      </span>
                      <span>•</span>
                      <span className="text-amber-300 font-mono">
                        +{diagnosticResult?.totalCpEarnedThisRace || 100} CP 獲得
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={requestGeminiDebrief}
                    disabled={loadingGeminiDebrief}
                    className="btn-console-primary px-4 py-2 text-xs flex items-center gap-2 shadow-lg"
                  >
                    <Sparkles className="w-4 h-4 text-yellow-300" />
                    {loadingGeminiDebrief ? 'AI軍師が総括作成中...' : '🤖 AI軍師の総括解説'}
                  </button>
                  <button
                    type="button"
                    onClick={resetGameState}
                    className="btn-console px-3 py-2 text-xs text-slate-300 hover:text-white"
                    title="レースをリセットして再挑戦"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* 1.5 Trophy Award Celebration Banner */}
              {careerData.clearedScenarios?.[activeScenario.id] && playerCar && playerCar.position <= activeScenario.targetPosition && (
                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-950/90 via-yellow-950/80 to-slate-900 border-2 border-amber-400/80 shadow-xl shadow-amber-950/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in zoom-in-95 duration-300">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center text-3xl shadow-lg shrink-0">
                      {careerData.clearedScenarios[activeScenario.id].trophy === 'gold'
                        ? '🏆'
                        : careerData.clearedScenarios[activeScenario.id].trophy === 'silver'
                        ? '🥈'
                        : '🥉'}
                    </div>
                    <div>
                      <div className="text-xs font-racing font-bold text-amber-300 tracking-wider">
                        SCENARIO TROPHY EARNED! (シナリオ制覇トロフィー獲得)
                      </div>
                      <div className="text-sm font-racing font-black text-white flex items-center gap-2 mt-0.5">
                        <span className="uppercase text-amber-200 font-bold">
                          {careerData.clearedScenarios[activeScenario.id].trophy === 'gold'
                            ? '🏆 GOLD TROPHY'
                            : careerData.clearedScenarios[activeScenario.id].trophy === 'silver'
                            ? '🥈 SILVER TROPHY'
                            : '🥉 BRONZE TROPHY'}
                        </span>
                        <span className="text-xs text-slate-300 font-mono">
                          (最終順位: P{careerData.clearedScenarios[activeScenario.id].finalPosition} / 目標: P{activeScenario.targetPosition}以内)
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsCareerModalOpen(true)}
                    className="px-3.5 py-2 rounded-xl bg-amber-400 text-slate-950 font-racing font-black text-xs hover:bg-amber-300 transition-colors shrink-0 cursor-pointer shadow-md flex items-center gap-1.5"
                  >
                    <Trophy className="w-3.5 h-3.5" />
                    <span>トロフィールームを見る ➔</span>
                  </button>
                </div>
              )}

              {/* 2. New Badges Alert Banner (if any newly unlocked this race) */}
              {diagnosticResult && diagnosticResult.unlockedBadgesThisRace.length > 0 && (
                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-950/80 via-red-950/80 to-slate-900 border-2 border-amber-500/60 shadow-lg shadow-amber-950/50 animate-pulse flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">🎉</span>
                    <div>
                      <div className="text-xs font-racing font-bold text-amber-300 tracking-wider">
                        NEW TITLES UNLOCKED! (新規称号 {diagnosticResult.unlockedBadgesThisRace.length}件 獲得)
                      </div>
                      <div className="flex flex-wrap items-center gap-1.5 mt-1">
                        {diagnosticResult.unlockedBadgesThisRace.map((badge) => (
                          <span
                            key={badge.id}
                            onClick={() => {
                              setSelectedBadgeForDetail(badge);
                              setDebriefTab('badges');
                            }}
                            className="px-2 py-0.5 rounded-lg bg-black/60 border border-amber-400/40 text-[11px] font-racing font-bold text-amber-200 cursor-pointer hover:bg-amber-950 transition-colors"
                          >
                            {badge.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setDebriefTab('badges')}
                    className="px-3 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-racing font-black text-xs hover:bg-amber-400 transition-colors shrink-0 cursor-pointer"
                  >
                    称号コレクションを見る ➔
                  </button>
                </div>
              )}

              {/* 3. Debrief Navigation Tabs */}
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900/90 border border-white/10 overflow-x-auto text-xs font-racing">
                <button
                  type="button"
                  onClick={() => setDebriefTab('score')}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-bold whitespace-nowrap transition-all ${
                    debriefTab === 'score'
                      ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Target className="w-3.5 h-3.5" />
                  <span>🎯 総合採点 ＆ 勝敗分岐</span>
                </button>

                <button
                  type="button"
                  onClick={() => setDebriefTab('archetype')}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-bold whitespace-nowrap transition-all ${
                    debriefTab === 'archetype'
                      ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span>🧠 司令官性格診断</span>
                  {diagnosticResult && (
                    <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[10px]">
                      {diagnosticResult.archetype.icon}
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setDebriefTab('badges')}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-bold whitespace-nowrap transition-all ${
                    debriefTab === 'badges'
                      ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>🎖️ 称号 ＆ 絶望バッジ</span>
                  <span className="px-1.5 py-0.2 rounded bg-white/10 text-[10px] font-mono">
                    {careerData.unlockedBadgeIds.length}/{F1_BADGES_CATALOG.length}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setDebriefTab('knowledge')}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-bold whitespace-nowrap transition-all ${
                    debriefTab === 'knowledge'
                      ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>📚 大百科スマート学習</span>
                </button>
              </div>

              {/* ── TAB 1: 総合採点 ＆ 勝敗分岐 (Score & Key Decisions) ── */}
              {debriefTab === 'score' && (
                <div className="space-y-4">
                  {/* 4-Axis Tactical Breakdown Bars */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-white/10 shadow-sm">
                      <div className="flex justify-between text-xs text-slate-300">
                        <span>ピット窓口適正度</span>
                        <span className="font-racing font-bold text-red-400">
                          {tacticalScore.pitTimingScore} / 25
                        </span>
                      </div>
                      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden mt-2.5">
                        <div
                          className="h-full bg-gradient-to-r from-red-600 to-rose-500 transition-all duration-500"
                          style={{ width: `${(tacticalScore.pitTimingScore / 25) * 100}%` }}
                        />
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1.5 font-mono">アンダーカット・SCチープピット活用</div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-white/10 shadow-sm">
                      <div className="flex justify-between text-xs text-slate-300">
                        <span>トラフィック回避度</span>
                        <span className="font-racing font-bold text-amber-400">
                          {tacticalScore.trafficScore} / 25
                        </span>
                      </div>
                      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden mt-2.5">
                        <div
                          className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 transition-all duration-500"
                          style={{ width: `${(tacticalScore.trafficScore / 25) * 100}%` }}
                        />
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1.5 font-mono">クリーンエア合流窓の確保</div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-white/10 shadow-sm">
                      <div className="flex justify-between text-xs text-slate-300">
                        <span>タイヤ・熱管理</span>
                        <span className="font-racing font-bold text-emerald-400">
                          {tacticalScore.tyreEnergyScore} / 25
                        </span>
                      </div>
                      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden mt-2.5">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-500 to-green-400 transition-all duration-500"
                          style={{ width: `${(tacticalScore.tyreEnergyScore / 25) * 100}%` }}
                        />
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1.5 font-mono">表層・内部コア二層熱制御</div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-white/10 shadow-sm">
                      <div className="flex justify-between text-xs text-slate-300">
                        <span>突発適応・チームワーク</span>
                        <span className="font-racing font-bold text-cyan-400">
                          {tacticalScore.chaosTeamScore} / 25
                        </span>
                      </div>
                      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden mt-2.5">
                        <div
                          className="h-full bg-gradient-to-r from-cyan-500 to-blue-400 transition-all duration-500"
                          style={{ width: `${(tacticalScore.chaosTeamScore / 25) * 100}%` }}
                        />
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1.5 font-mono">無線対応・ダブルスタック回避</div>
                    </div>
                  </div>

                  {/* Key Decisions Delta list */}
                  {tacticalScore.keyDecisions.length > 0 && (
                    <div className="space-y-2">
                      <span className="font-racing font-bold text-xs text-white flex items-center gap-2">
                        <span>🎯 勝敗を分けた主要な戦術判断（タイム損得 Delta）</span>
                      </span>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                        {tacticalScore.keyDecisions.map((dec, i) => (
                          <div
                            key={i}
                            className={`p-3.5 rounded-2xl border text-xs space-y-1.5 transition-all ${
                              dec.verdict === 'optimal'
                                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                                : 'bg-red-950/40 border-red-500/40 text-red-200'
                            }`}
                          >
                            <div className="flex justify-between items-center font-racing font-bold">
                              <span className="flex items-center gap-1.5">
                                <span>{dec.verdict === 'optimal' ? '✅' : '⚠️'}</span>
                                <span>LAP {dec.lap}: {dec.title}</span>
                              </span>
                              <span
                                className={`font-mono font-black text-sm ${
                                  dec.impactSeconds > 0 ? 'text-emerald-400' : 'text-red-400'
                                }`}
                              >
                                {dec.impactSeconds > 0 ? '+' : ''}
                                {dec.impactSeconds}s
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
                              {dec.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Gemini AI Debrief Display */}
                  {geminiDebrief && (
                    <div className="p-4 rounded-2xl bg-slate-900/90 border border-white/10 text-xs leading-relaxed space-y-2 text-slate-200 shadow-inner">
                      <div className="flex items-center gap-2 font-racing font-bold text-red-400">
                        <Sparkles className="w-4 h-4 text-yellow-400" /> チーフストラテジストの総括レポート
                      </div>
                      <div className="whitespace-pre-wrap font-mono text-[11px] leading-relaxed">
                        {geminiDebrief}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ── TAB 2: 司令官性格診断 (F1 Archetype Profile) ── */}
              {debriefTab === 'archetype' && diagnosticResult && (
                <div className="space-y-4 animate-in fade-in duration-300">
                  {/* Archetype Main Card */}
                  <div className="glass-card-premium p-5 rounded-3xl border border-white/15 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 shadow-xl space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
                      <div className="flex items-center gap-3">
                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${diagnosticResult.archetype.badgeColor} flex items-center justify-center text-3xl shadow-lg border border-white/20`}>
                          {diagnosticResult.archetype.icon}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-racing font-black text-white text-lg sm:text-xl">
                              {diagnosticResult.archetype.name}
                            </span>
                          </div>
                          <div className="text-xs text-slate-400 font-mono">
                            {diagnosticResult.archetype.englishTitle}
                          </div>
                        </div>
                      </div>

                      <div className="p-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-right">
                        <div className="text-[10px] text-slate-400 font-mono">現在のライセンス格付け</div>
                        <div className="font-racing font-bold text-amber-300 text-xs mt-0.5">
                          {diagnosticResult.license.badge}
                        </div>
                      </div>
                    </div>

                    {/* Catchphrase & Historical Lore */}
                    <div className="p-3.5 rounded-2xl bg-black/40 border border-amber-500/20 text-xs space-y-1.5">
                      <div className="text-amber-300 font-racing font-bold text-sm italic">
                        {diagnosticResult.archetype.catchphrase}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {diagnosticResult.archetype.historicalContext}
                      </div>
                    </div>

                    {/* 5-Axis Radar Diagnostic Bars */}
                    <div className="space-y-2.5 pt-2">
                      <div className="text-xs font-racing font-bold text-slate-300">
                        📊 司令官レーダー特性（あなたの5大戦術パラメーター）
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        {/* 1. 決断速度 */}
                        <div className="p-3 rounded-xl bg-slate-900 border border-white/10 space-y-1.5">
                          <div className="flex justify-between font-racing">
                            <span className="text-slate-300">⚡ 決断速度 (Decision Speed)</span>
                            <span className="font-bold text-amber-400">{diagnosticResult.radar.decisionSpeed}%</span>
                          </div>
                          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-amber-500 transition-all duration-700" style={{ width: `${diagnosticResult.radar.decisionSpeed}%` }} />
                          </div>
                        </div>

                        {/* 2. リスク選好度 */}
                        <div className="p-3 rounded-xl bg-slate-900 border border-white/10 space-y-1.5">
                          <div className="flex justify-between font-racing">
                            <span className="text-slate-300">🎲 ギャンブル性 (Risk Appetite)</span>
                            <span className="font-bold text-rose-400">{diagnosticResult.radar.riskAppetite}%</span>
                          </div>
                          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-rose-500 transition-all duration-700" style={{ width: `${diagnosticResult.radar.riskAppetite}%` }} />
                          </div>
                        </div>

                        {/* 3. データ忠実度 */}
                        <div className="p-3 rounded-xl bg-slate-900 border border-white/10 space-y-1.5">
                          <div className="flex justify-between font-racing">
                            <span className="text-slate-300">📐 データ忠実度 (Data Adherence)</span>
                            <span className="font-bold text-cyan-400">{diagnosticResult.radar.dataAdherence}%</span>
                          </div>
                          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-cyan-500 transition-all duration-700" style={{ width: `${diagnosticResult.radar.dataAdherence}%` }} />
                          </div>
                        </div>

                        {/* 4. ドライバー共感 */}
                        <div className="p-3 rounded-xl bg-slate-900 border border-white/10 space-y-1.5">
                          <div className="flex justify-between font-racing">
                            <span className="text-slate-300">🎙️ ドライバー信頼 (Driver Empathy)</span>
                            <span className="font-bold text-emerald-400">{diagnosticResult.radar.driverEmpathy}%</span>
                          </div>
                          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500 transition-all duration-700" style={{ width: `${diagnosticResult.radar.driverEmpathy}%` }} />
                          </div>
                        </div>

                        {/* 5. 盤面支配力 */}
                        <div className="p-3 rounded-xl bg-slate-900 border border-white/10 space-y-1.5 sm:col-span-2">
                          <div className="flex justify-between font-racing">
                            <span className="text-slate-300">♟️ 盤面支配力 (Board Control & DRS Train)</span>
                            <span className="font-bold text-purple-400">{diagnosticResult.radar.boardControl}%</span>
                          </div>
                          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-purple-500 transition-all duration-700" style={{ width: `${diagnosticResult.radar.boardControl}%` }} />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Strengths & Weaknesses */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                      <div className="p-3 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 space-y-1.5 text-xs">
                        <div className="font-racing font-bold text-emerald-300 flex items-center gap-1.5">
                          <span>💪</span> 司令官としての最大の強み
                        </div>
                        <ul className="space-y-1 text-slate-300 text-[11px] list-disc list-inside">
                          {diagnosticResult.archetype.strengths.map((str, idx) => (
                            <li key={idx}>{str}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="p-3 rounded-2xl bg-red-950/30 border border-red-500/30 space-y-1.5 text-xs">
                        <div className="font-racing font-bold text-red-300 flex items-center gap-1.5">
                          <span>⚠️</span> 気をつけるべき落とし穴
                        </div>
                        <ul className="space-y-1 text-slate-300 text-[11px] list-disc list-inside">
                          {diagnosticResult.archetype.weaknesses.map((wk, idx) => (
                            <li key={idx}>{wk}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Mentor Tactical Advice */}
                    <div className="p-3.5 rounded-2xl bg-slate-900 border border-white/10 text-xs space-y-1">
                      <div className="font-racing font-bold text-white flex items-center gap-1.5">
                        <span>💡</span> 次戦へのアドバイス
                      </div>
                      <p className="text-slate-300 text-[11px] leading-relaxed">
                        {diagnosticResult.archetype.tacticalAdvice}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* ── TAB 3: 称号 ＆ 絶望バッジ (Titles & Badges Collection) ── */}
              {debriefTab === 'badges' && (
                <div className="space-y-3.5 animate-in fade-in duration-300">
                  {/* Category filter buttons */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-white/10">
                    <div className="flex flex-wrap items-center gap-1.5 text-xs">
                      {[
                        { key: 'all', label: `すべて (${F1_BADGES_CATALOG.length})` },
                        { key: 'masterstroke', label: '🏆 神采配' },
                        { key: 'quote_meme', label: '📻 名言・無線' },
                        { key: 'despair_trauma', label: '💀 絶望トラウマ' },
                      ].map((tab) => (
                        <button
                          key={tab.key}
                          type="button"
                          onClick={() => setBadgeCategoryFilter(tab.key as any)}
                          className={`px-3 py-1.5 rounded-xl font-racing font-bold text-xs transition-all cursor-pointer ${
                            badgeCategoryFilter === tab.key
                              ? 'bg-red-600 text-white shadow-md'
                              : 'bg-slate-900 hover:bg-slate-800 text-slate-400 border border-white/10'
                          }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>

                    <div className="text-xs font-mono text-slate-400">
                      解放済み: <strong className="text-amber-300 font-bold">{careerData.unlockedBadgeIds.length}</strong> / {F1_BADGES_CATALOG.length}
                    </div>
                  </div>

                  {/* Badges Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
                    {F1_BADGES_CATALOG
                      .filter((b) => badgeCategoryFilter === 'all' || b.category === badgeCategoryFilter)
                      .map((badge) => {
                        const isUnlocked = careerData.unlockedBadgeIds.includes(badge.id);
                        const isNewlyUnlocked = diagnosticResult?.unlockedBadgesThisRace.some((b) => b.id === badge.id);

                        return (
                          <div
                            key={badge.id}
                            onClick={() => setSelectedBadgeForDetail(badge)}
                            className={`p-3 rounded-2xl border text-xs flex flex-col justify-between transition-all cursor-pointer select-none group ${
                              isUnlocked
                                ? `${badge.rarityColor} hover:brightness-125 shadow-md`
                                : 'bg-slate-950/70 border-white/5 text-slate-600 opacity-60 hover:opacity-80'
                            } ${isNewlyUnlocked ? 'ring-2 ring-amber-400 animate-pulse' : ''}`}
                          >
                            <div>
                              <div className="flex items-center justify-between pb-1.5">
                                <span className="text-xl">{badge.icon}</span>
                                <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded ${
                                  isUnlocked ? 'bg-black/50 text-white font-bold' : 'bg-slate-900 text-slate-500'
                                }`}>
                                  {badge.rarity}
                                </span>
                              </div>
                              <div className={`font-racing font-bold text-xs mt-1 ${
                                isUnlocked ? 'text-white' : 'text-slate-500'
                              }`}>
                                {badge.name}
                              </div>
                              <div className="text-[10px] text-slate-400 line-clamp-2 mt-1">
                                {isUnlocked ? badge.historicalQuote : '🔒 ' + badge.unlockConditionText}
                              </div>
                            </div>

                            <div className="pt-2 text-[9px] font-mono flex items-center justify-between text-slate-400 mt-2 border-t border-white/5">
                              <span>{badge.categoryLabel}</span>
                              <span className="text-amber-400/80 group-hover:text-amber-300">詳細 ➔</span>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}

              {/* ── TAB 4: 大百科スマート学習 (Pedagogical Links) ── */}
              {debriefTab === 'knowledge' && (
                <div className="space-y-3 animate-in fade-in duration-300">
                  <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-white/10 text-xs leading-relaxed space-y-1.5">
                    <span className="text-xs font-racing font-bold text-slate-200 flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4 text-red-400" />
                      戦術理解を深めて次戦へ活かす — 関連F1大百科・工学解説:
                    </span>
                    <p className="text-slate-400 text-[11px]">
                      今回のレース展開や失着・成功に関係する戦術理論です。タップするとF1大百科の解説ポップアップを開きます。
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    {tacticalScore.linkedKeywords.map((kw) => (
                      <button
                        key={kw}
                        type="button"
                        onClick={() => handleOpenIntel(kw)}
                        className="p-3 rounded-2xl bg-red-950/40 hover:bg-red-900/60 border border-red-500/40 text-left transition-all cursor-pointer group shadow-sm flex items-center justify-between"
                      >
                        <div>
                          <div className="font-racing font-bold text-white text-xs group-hover:text-red-300 flex items-center gap-1.5">
                            <span>💡</span>
                            <span>{kw.replace('-', ' ').toUpperCase()}</span>
                          </div>
                          <div className="text-[10px] text-slate-400 mt-0.5">
                            F1大百科で理論・数式・実戦例を読む
                          </div>
                        </div>
                        <ExternalLink className="w-3.5 h-3.5 text-red-400 opacity-60 group-hover:opacity-100" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ── Debrief Action Bar (Restart, Tweak Strategy, Change Mode) ── */}
            <div className="p-4 rounded-2xl bg-slate-900/95 border border-white/15 shadow-xl flex flex-wrap items-center justify-between gap-3 backdrop-blur-md">
              <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                <span>レース総括完了</span>
                <span className="text-slate-600">•</span>
                <span>獲得CP: <strong className="text-amber-400 font-racing">+{diagnosticResult?.totalCpEarnedThisRace || 0} CP</strong></span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleRestartRace}
                  className="btn-console px-3.5 py-2 text-xs font-racing font-bold text-cyan-300 border-cyan-500/40 hover:bg-cyan-950/60 flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>🔄 同じ設定でリスタート</span>
                </button>

                <button
                  type="button"
                  onClick={handleBackToBriefing}
                  className="btn-console px-3.5 py-2 text-xs font-racing font-bold text-amber-300 border-amber-500/40 hover:bg-amber-950/60 flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>⚙️ 作戦を修正して再挑戦</span>
                </button>

                <button
                  type="button"
                  onClick={handleBackToModeSelect}
                  className="btn-console-primary px-4 py-2 text-xs font-racing font-bold flex items-center gap-1.5 transition-all shadow-md shadow-red-950 cursor-pointer"
                >
                  <Trophy className="w-3.5 h-3.5 text-yellow-300" />
                  <span>🏆 モード選択に戻る</span>
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="p-8 rounded-3xl bg-slate-950/90 border border-white/10 text-center space-y-4">
            <div className="text-5xl">🏁</div>
            <h3 className="text-xl font-racing font-bold text-white">まだレース結果がありません</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              レースを完走すると、ここにFIA戦術評価、判断タイムライン、司令官アーキタイプ診断、AI軍師の総括解説が表示されます。
            </p>
            <div className="flex justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setSimulatorPhase('race')}
                className="btn-console px-5 py-2.5 text-xs font-racing font-bold text-cyan-300 border-cyan-500/40 cursor-pointer"
              >
                ピットウォールに戻る
              </button>
              <button
                type="button"
                onClick={handleBackToModeSelect}
                className="btn-console-primary px-5 py-2.5 text-xs font-racing font-bold cursor-pointer"
              >
                モード選択に戻る
              </button>
            </div>
          </div>
        )}
      </div>
    )}

          {/* ── BADGE DETAIL MODAL ── */}
          {selectedBadgeForDetail && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
              <div className="max-w-md w-full glass-card-premium p-5 rounded-3xl border-2 border-amber-500/60 shadow-2xl space-y-3.5">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-white/20 flex items-center justify-center text-2xl shadow-md">
                      {selectedBadgeForDetail.icon}
                    </div>
                    <div>
                      <span className="px-2 py-0.5 rounded bg-amber-950 border border-amber-500/40 text-[10px] font-mono text-amber-300">
                        {selectedBadgeForDetail.categoryLabel} • {selectedBadgeForDetail.rarity}
                      </span>
                      <h3 className="font-racing font-bold text-white text-base mt-1">
                        {selectedBadgeForDetail.name}
                      </h3>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedBadgeForDetail(null)}
                    className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10"
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                </div>

                {/* Quote Box */}
                <div className="p-3 rounded-2xl bg-black/60 border border-amber-500/30 text-xs">
                  <div className="text-amber-300 font-racing font-bold italic">
                    {selectedBadgeForDetail.historicalQuote}
                  </div>
                </div>

                {/* Lore Box */}
                <div className="space-y-1 text-xs">
                  <div className="font-racing font-bold text-slate-300">📖 歴史的背景・エピソード:</div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    {selectedBadgeForDetail.lore}
                  </p>
                </div>

                {/* Unlock condition */}
                <div className="p-3 rounded-2xl bg-slate-900 border border-white/10 space-y-1 text-xs">
                  <div className="font-racing font-bold text-slate-400">🎯 アンロック獲得条件:</div>
                  <p className="text-white text-[11px] font-mono">
                    {selectedBadgeForDetail.unlockConditionText}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedBadgeForDetail(null)}
                  className="btn-console w-full py-2 text-xs font-racing font-bold text-white text-center"
                >
                  閉じる
                </button>
              </div>
            </div>
          )}

          {/* ── CAREER & FIA LICENSE MODAL (Top Header Button) ── */}
          {isCareerModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
              <div className="max-w-2xl w-full glass-card-premium p-6 rounded-3xl border-2 border-red-500/60 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-start pb-3 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-red-600 flex items-center justify-center text-2xl shadow-lg">
                      🏆
                    </div>
                    <div>
                      <div className="text-xs font-mono text-amber-300 font-bold">FIA STRATEGIST CAREER</div>
                      <h3 className="font-racing font-bold text-white text-lg sm:text-xl">
                        司令官ライセンス ＆ 獲得称号ミュージアム
                      </h3>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsCareerModalOpen(false)}
                    className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-white/10"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>

                {/* Career Stats Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
                  <div className="p-2.5 rounded-2xl bg-slate-900 border border-white/10 text-center">
                    <div className="text-slate-400 text-[10px] font-mono">ライセンス等級</div>
                    <div className="font-racing font-bold text-amber-300 text-sm mt-0.5">
                      GRADE {careerData.grade}
                    </div>
                  </div>
                  <div className="p-2.5 rounded-2xl bg-slate-900 border border-white/10 text-center">
                    <div className="text-slate-400 text-[10px] font-mono">累積 Command Points</div>
                    <div className="font-racing font-bold text-white text-sm mt-0.5">
                      {careerData.totalCp} CP
                    </div>
                  </div>
                  <div className="p-2.5 rounded-2xl bg-slate-900 border border-amber-500/30 text-center shadow-sm">
                    <div className="text-amber-400 text-[10px] font-mono font-bold">トロフィー</div>
                    <div className="font-racing font-bold text-amber-300 text-sm mt-0.5">
                      🏆 {Object.keys(careerData.clearedScenarios || {}).length}冠
                    </div>
                  </div>
                  <div className="p-2.5 rounded-2xl bg-slate-900 border border-white/10 text-center">
                    <div className="text-slate-400 text-[10px] font-mono">総参戦 / 勝利</div>
                    <div className="font-racing font-bold text-emerald-400 text-sm mt-0.5">
                      {careerData.totalRacesCompleted}戦 / {careerData.totalWins}勝
                    </div>
                  </div>
                  <div className="p-2.5 rounded-2xl bg-slate-900 border border-white/10 text-center">
                    <div className="text-slate-400 text-[10px] font-mono">獲得称号</div>
                    <div className="font-racing font-bold text-rose-400 text-sm mt-0.5">
                      {careerData.unlockedBadgeIds.length} / {F1_BADGES_CATALOG.length}
                    </div>
                  </div>
                </div>

                {/* Trophy Room Section */}
                <div className="space-y-2 pt-2 border-t border-white/10">
                  <div className="font-racing font-bold text-xs text-white flex justify-between items-center">
                    <span className="flex items-center gap-1.5 text-amber-300">
                      <Trophy className="w-4 h-4 text-amber-400" />
                      トロフィールーム ({Object.keys(careerData.clearedScenarios || {}).length}冠 達成)
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      金: {Object.values(careerData.clearedScenarios || {}).filter((c) => c.trophy === 'gold').length} / 
                      銀: {Object.values(careerData.clearedScenarios || {}).filter((c) => c.trophy === 'silver').length} / 
                      銅: {Object.values(careerData.clearedScenarios || {}).filter((c) => c.trophy === 'bronze').length}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                    {[...PRESET_CHALLENGES, ...MISSION_CHALLENGES].map((sc) => {
                      const clear = careerData.clearedScenarios?.[sc.id];
                      return (
                        <div
                          key={sc.id}
                          className={`p-2.5 rounded-2xl border text-xs flex items-center justify-between transition-all ${
                            clear
                              ? clear.trophy === 'gold'
                                ? 'bg-amber-950/40 border-amber-500/50 text-amber-200 shadow-sm'
                                : clear.trophy === 'silver'
                                ? 'bg-slate-800/60 border-slate-400/50 text-slate-200'
                                : 'bg-amber-900/30 border-amber-700/40 text-amber-300'
                              : 'bg-slate-950/60 border-white/5 text-slate-500 opacity-50'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-xl">
                              {clear
                                ? clear.trophy === 'gold'
                                  ? '🏆'
                                  : clear.trophy === 'silver'
                                  ? '🥈'
                                  : '🥉'
                                : '🔒'}
                            </span>
                            <div>
                              <div className="font-racing font-bold text-xs line-clamp-1">
                                {sc.title.replace(/^[^a-zA-Z0-9\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]+/, '')}
                              </div>
                              <div className="text-[10px] font-mono text-slate-400">
                                {clear
                                  ? `P${clear.finalPosition}達成 (${clear.score}点 / AI:${
                                      clear.aiDifficulty === 'master'
                                        ? '達人'
                                        : clear.aiDifficulty === 'standard'
                                        ? '標準'
                                        : '初級'
                                    })`
                                  : '未クリア (CHALLENGE)'}
                              </div>
                            </div>
                          </div>
                          {clear && (
                            <span
                              className={`text-[9px] font-racing font-bold px-1.5 py-0.5 rounded uppercase ${
                                clear.trophy === 'gold'
                                  ? 'bg-amber-500/30 text-amber-300 border border-amber-500/50'
                                  : clear.trophy === 'silver'
                                  ? 'bg-slate-400/30 text-slate-200 border border-slate-400/50'
                                  : 'bg-amber-800/40 text-amber-400 border border-amber-700/50'
                              }`}
                            >
                              {clear.trophy}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* All Badges Museum list */}
                <div className="space-y-2 pt-2 border-t border-white/10">
                  <div className="font-racing font-bold text-xs text-white flex justify-between items-center">
                    <span>🎖️ 全称号コレクション ({careerData.unlockedBadgeIds.length}/{F1_BADGES_CATALOG.length})</span>
                    <span className="text-[10px] text-slate-400 font-mono">タップで名言と歴史背景を表示</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-72 overflow-y-auto pr-1">
                    {F1_BADGES_CATALOG.map((badge) => {
                      const isUnlocked = careerData.unlockedBadgeIds.includes(badge.id);
                      return (
                        <div
                          key={badge.id}
                          onClick={() => setSelectedBadgeForDetail(badge)}
                          className={`p-2.5 rounded-2xl border text-xs flex items-center justify-between cursor-pointer transition-all ${
                            isUnlocked
                              ? `${badge.rarityColor} hover:brightness-125`
                              : 'bg-slate-950/60 border-white/5 text-slate-600 opacity-60'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="text-xl">{badge.icon}</span>
                            <div>
                              <div className={`font-racing font-bold text-xs ${isUnlocked ? 'text-white' : 'text-slate-500'}`}>
                                {badge.name}
                              </div>
                              <div className="text-[10px] text-slate-400 font-mono">
                                {isUnlocked ? badge.historicalQuote.slice(0, 24) + '...' : '🔒 未獲得'}
                              </div>
                            </div>
                          </div>
                          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-black/40 text-slate-300">
                            {badge.rarity}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsCareerModalOpen(false)}
                  className="btn-console w-full py-2.5 text-xs font-racing font-bold text-white text-center"
                >
                  閉じる
                </button>
              </div>
            </div>
          )}

          {/* ── INTEL BRIEFING MODAL (F1 大百科・用語集ポップアップ) ── */}
          {selectedIntelTerm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
              <div className="max-w-lg w-full glass-card-premium p-5 rounded-2xl border-2 border-red-500/60 shadow-2xl space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-red-950 border border-red-500/40 text-[10px] font-mono text-red-300">
                        {selectedIntelTerm.categoryLabel || '⛽ 戦略'}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        {selectedIntelTerm.englishTerm}
                      </span>
                    </div>
                    <h3 className="font-racing font-bold text-white text-lg mt-1">
                      {selectedIntelTerm.term}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedIntelTerm(null)}
                    className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10"
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-white/10 text-xs leading-relaxed space-y-2">
                  <p className="font-bold text-white">{selectedIntelTerm.summary}</p>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    {selectedIntelTerm.description}
                  </p>
                  {selectedIntelTerm.realExample && (
                    <div className="p-2 rounded bg-slate-950 text-[11px] text-amber-300 font-mono">
                      実例: {selectedIntelTerm.realExample}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedIntelTerm(null)}
                    className="btn-console text-xs px-3 py-1.5 text-slate-300"
                  >
                    閉じる
                  </button>
                  {onNavigateToLibrary && (
                    <button
                      type="button"
                      onClick={() => {
                        const termId = selectedIntelTerm.id;
                        setSelectedIntelTerm(null);
                        onNavigateToLibrary('glossary', termId);
                      }}
                      className="btn-console-primary text-xs px-3 py-1.5 flex items-center gap-1.5"
                    >
                      <BookOpen className="w-3.5 h-3.5" /> F1大百科で詳しく学ぶ
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ── FULLSCREEN PITWALL COCKPIT OVERLAY (全画面司令塔モード) ── */}
          {isFullScreenCockpit && (
            <div className="fixed inset-0 z-50 bg-slate-950/98 backdrop-blur-3xl p-3 sm:p-4 flex flex-col overflow-y-auto lg:overflow-hidden text-slate-100 animate-in fade-in duration-200">
              {/* Cockpit Top Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-2.5 border-b border-white/10 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-cyan-950 border border-cyan-500/50 flex items-center justify-center">
                      <Gamepad2 className="w-4 h-4 text-cyan-400 animate-pulse" />
                    </div>
                    <span className="font-racing font-bold text-sm sm:text-base text-white tracking-wider">
                      F1 PITWALL COCKPIT
                    </span>
                  </div>
                  <span className="text-xs font-mono text-cyan-300 font-bold px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/40">
                    {activeScenario.circuit.name}
                  </span>
                  <span className="text-xs font-mono text-slate-300">
                    LAP {challengeLap} / {activeScenario.totalLaps}
                  </span>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {/* Play / Pause */}
                  <button
                    type="button"
                    onClick={() => {
                      setAutoPauseAlert(null);
                      setChallengePlaying(!challengePlaying);
                    }}
                    className={`btn-console px-3 py-1 text-xs font-racing font-bold flex items-center gap-1.5 ${
                      challengePlaying
                        ? 'bg-amber-950 text-amber-300 border-amber-500/60'
                        : 'bg-emerald-950 text-emerald-300 border-emerald-500/60'
                    }`}
                  >
                    {challengePlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    <span>{challengePlaying ? 'PAUSE' : 'PLAY'}</span>
                  </button>

                  {/* Playback Speed */}
                  <div className="flex items-center gap-0.5 bg-slate-900 px-1 py-0.5 rounded-lg border border-white/10 text-[10px] font-mono">
                    {[0.5, 1, 2, 5, 10].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setPlaybackSpeed(s)}
                        className={`px-1.5 py-0.5 rounded font-bold ${
                          playbackSpeed === s ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {s}x
                      </button>
                    ))}
                  </div>

                  {/* Radio Audio Toggle */}
                  <button
                    type="button"
                    onClick={() => setRadioAudioEnabled(!radioAudioEnabled)}
                    className="p-1.5 rounded-lg bg-slate-900 border border-white/10 text-slate-300 hover:text-white"
                    title={radioAudioEnabled ? '無線音声を消音' : '無線音声を有効化'}
                  >
                    {radioAudioEnabled ? (
                      <Volume2 className="w-4 h-4 text-cyan-400" />
                    ) : (
                      <VolumeX className="w-4 h-4 text-slate-500" />
                    )}
                  </button>

                  {/* Native Fullscreen Toggle Button (F11) */}
                  <button
                    type="button"
                    onClick={() => {
                      if (!document.fullscreenElement) {
                        document.documentElement.requestFullscreen().catch(() => {});
                      } else {
                        if (document.exitFullscreen) {
                          document.exitFullscreen().catch(() => {});
                        }
                      }
                    }}
                    className="btn-console px-2.5 py-1 text-xs font-mono font-bold bg-slate-900 border border-white/10 text-cyan-300 hover:text-white flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
                    title="PC画面全体のネイティブ全画面表示 (F11)"
                  >
                    <Maximize2 className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="hidden sm:inline">全画面 (F11)</span>
                  </button>

                  {/* Career & Badges Museum Button */}
                  <button
                    type="button"
                    onClick={() => setIsCareerModalOpen(true)}
                    className="btn-console flex items-center gap-1 text-xs px-2.5 py-1 bg-amber-950/60 border-amber-500/40 text-amber-300 hover:text-white transition-all shadow-sm"
                    title="FIAライセンス等級・累積CP・称号カタログを開く"
                  >
                    <Award className="w-3.5 h-3.5 text-yellow-400" />
                    <span suppressHydrationWarning className="font-racing text-[10px] font-bold">
                      {careerData.grade === 'S' ? '👑 S' : `GRADE ${careerData.grade}`}
                    </span>
                  </button>

                  {/* Mode & Strategy Settings Button */}
                  <button
                    type="button"
                    onClick={() => {
                      setIsFullScreenCockpit(false);
                      setIsScenarioDrawerOpen(true);
                    }}
                    className="btn-console flex items-center gap-1 text-xs px-2.5 py-1 bg-slate-900 border border-white/20 text-cyan-300 hover:text-white hover:border-cyan-400 transition-all shadow-sm"
                    title="全24コース・全22ドライバー選択・サンドボックス・作戦設定を開く"
                  >
                    <Settings className="w-3.5 h-3.5 text-cyan-400" />
                    <span>⚙️ モード・作戦設定</span>
                  </button>

                  {/* F1 Library / Tyres Knowledge Research Button (一時停止して大百科へ) */}
                  <button
                    type="button"
                    onClick={() => {
                      setChallengePlaying(false);
                      if (standaloneMode) {
                        window.open('/?hub=knowledge&subTab=tyres', '_blank');
                      } else {
                        setIsFullScreenCockpit(false);
                        onNavigateToLibrary?.('tyres');
                      }
                    }}
                    className="btn-console px-3 py-1 text-xs font-mono font-bold bg-indigo-950/80 border-indigo-500/60 text-indigo-200 hover:bg-indigo-900 hover:text-white flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
                    title="レースを一時停止してF1大百科（タイヤ特性・用語）を調べる"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                    <span className="hidden sm:inline">📚 F1大百科</span>
                  </button>

                  {/* Return to Full Command Console Button */}
                  <button
                    type="button"
                    onClick={() => {
                      setIsFullScreenCockpit(false);
                    }}
                    className="btn-console px-3 py-1 text-xs font-mono font-bold bg-slate-900 border border-white/20 text-slate-200 hover:text-white flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
                    title="全モニター（熱解析・チームオーダー・無線・詳細設定）が揃ったフル作戦室に戻る"
                  >
                    <Minimize2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>🎛️ フル作戦室 (ESC)</span>
                  </button>
                </div>
              </div>

              {/* Cockpit 3-Column Command Center */}
              <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-3 pt-3 overflow-hidden min-h-0">
                {/* Left: Timing Tower (lg:col-span-3) */}
                <div className="lg:col-span-3 flex flex-col gap-2 overflow-hidden h-full">
                  <div className="flex-1 bg-slate-900/90 rounded-2xl border border-white/10 p-3 flex flex-col overflow-hidden shadow-xl">
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10 text-xs font-mono font-bold text-slate-400">
                      <span className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-cyan-400" />
                        <span>FIA TIMING TOWER</span>
                      </span>
                      <span>GAP / 速度</span>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 scrollbar-thin">
                      {currentSnapshot?.cars.map((car) => {
                        const isPlayer = car.code === activeScenario.playerConfig.code;
                        const isTeammate = car.code === activeScenario.teammateConfig.code;
                        const isSelected = selectedCarCode === car.code;
                        const displaySpeed =
                          car.currentSpeedKmH ||
                          Math.round((5400 / Math.max(60, car.lapTime || 90)) * 3.6);

                        return (
                          <div
                            key={car.code}
                            onClick={() => setSelectedCarCode(selectedCarCode === car.code ? null : car.code)}
                            className={`w-full px-2.5 py-1.5 rounded-xl text-left text-xs font-mono flex items-center justify-between transition-all border cursor-pointer ${
                              car.isRetired
                                ? 'bg-red-950/20 border-red-900/40 text-slate-500 opacity-60'
                                : isPlayer
                                ? ersBoostUsedThisLap || activePuMode === 'push'
                                  ? 'bg-purple-950/60 border-purple-500 text-purple-200 font-bold shadow-sm'
                                  : 'bg-red-950/50 border-red-500/80 text-white font-bold shadow-sm'
                                : isTeammate
                                ? 'bg-emerald-950/40 border-emerald-500/60 text-emerald-200'
                                : isSelected
                                ? 'bg-sky-950/60 border-sky-400 text-sky-200 font-bold'
                                : 'bg-slate-900/60 border-white/5 text-slate-300 hover:bg-slate-800/80 hover:text-white'
                            }`}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <span
                                className={`w-6 text-[11px] font-racing font-bold shrink-0 ${
                                  car.isRetired ? 'text-red-400' : 'text-slate-400'
                                }`}
                              >
                                {car.isRetired ? 'DNF' : `P${car.position}`}
                              </span>
                              <span
                                className="w-2.5 h-2.5 rounded-full shrink-0"
                                style={{ backgroundColor: car.isRetired ? '#64748b' : car.color }}
                              />
                              <span className="font-bold text-xs truncate">{car.code}</span>
                              <span className="px-1.5 py-0.2 rounded bg-slate-800 text-[9px] font-bold text-amber-300 shrink-0">
                                {car.tyreCompound} ({car.tyreAge}L)
                              </span>
                              {isPlayer && (
                                <span
                                  className={`px-1 py-0.2 rounded text-[8px] font-black ${
                                    ersBoostUsedThisLap || activePuMode === 'push'
                                      ? 'bg-purple-600 text-white'
                                      : 'bg-red-600 text-white'
                                  }`}
                                >
                                  {ersBoostUsedThisLap || activePuMode === 'push' ? 'YOU⚡OT' : 'YOU'}
                                </span>
                              )}
                              {car.isPitting && (
                                <span className="px-1 py-0.2 rounded bg-amber-500 text-slate-950 text-[8px] font-black animate-pulse">
                                  PIT
                                </span>
                              )}
                            </div>

                            <div className="text-right shrink-0">
                              {car.isRetired ? (
                                <span className="text-[9px] text-red-400 font-bold">
                                  {car.retirementReason || 'リタイア'}
                                </span>
                              ) : (
                                <div className="flex flex-col items-end leading-none">
                                  <span className="text-[11px] text-slate-200 font-bold">
                                    {car.position === 1 ? 'LEAD' : `+${car.gapToLeader.toFixed(1)}s`}
                                  </span>
                                  <span className="text-[9px] text-slate-400">{displaySpeed} km/h</span>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Pit Exit Window Mini Card */}
                  <div className="bg-slate-900/90 rounded-xl border border-white/10 p-2.5 text-xs font-mono shrink-0">
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="text-slate-400">想定復帰順位:</span>
                      <span className="font-racing font-bold text-sm text-cyan-300">
                        P{pitExitTraffic.predictedExitPosition}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span>前方ギャップ: +{pitExitTraffic.gapAheadSeconds.toFixed(1)}s</span>
                      <span>後方ギャップ: +{pitExitTraffic.gapBehindSeconds.toFixed(1)}s</span>
                    </div>
                  </div>
                </div>

                {/* Center: Huge Circuit Radar (lg:col-span-6) */}
                <div className="lg:col-span-6 flex flex-col h-full overflow-hidden">
                  <LiveTrackGpsRadar
                    circuitId={activeScenario.circuit.id}
                    circuitName={activeScenario.circuit.name}
                    circuitLengthM={5400}
                    baseLapTime={activeScenario.circuit.baseLapTime}
                    cars={currentSnapshot?.cars || []}
                    playerCarCode={activeScenario.playerConfig.code}
                    teammateCarCode={activeScenario.teammateConfig.code}
                    lapProgressPct={lapProgressPct}
                    currentLap={challengeLap}
                    totalLaps={activeScenario.totalLaps}
                    isPlaying={challengePlaying}
                    playbackSpeed={playbackSpeed}
                    isSC={currentSnapshot?.isSC}
                    isScEnding={currentSnapshot?.isScEnding}
                    isOvertakeActive={ersBoostUsedThisLap || activePuMode === 'push'}
                    showLeaderboard={false}
                    className="h-full border-cyan-500/30 shadow-2xl"
                  />
                </div>

                {/* Right: Tactical Command & Telemetry Deck (lg:col-span-3) */}
                <div className="lg:col-span-3 flex flex-col gap-2 overflow-y-auto pr-1 scrollbar-thin h-full">
                  {/* Box Call Action Button (with Speech Audio!) */}
                  <div className="bg-slate-900/90 rounded-2xl border border-white/10 p-3 space-y-2.5 shadow-xl">
                    <div className="flex items-center justify-between">
                      <span className="font-racing font-bold text-xs text-white flex items-center gap-1.5">
                        <Radio className="w-3.5 h-3.5 text-amber-400" /> PIT STRATEGY
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold ${
                          boxQueuedForNextLap
                            ? 'bg-amber-500 text-slate-950 animate-pulse'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {boxQueuedForNextLap ? 'BOX QUEUED' : 'STAY OUT'}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={handleToggleBoxNextLap}
                      className={`w-full py-2.5 px-3 rounded-xl font-racing font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg ${
                        boxQueuedForNextLap
                          ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/30 animate-pulse'
                          : 'bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white shadow-red-950/50'
                      }`}
                    >
                      <Fuel className="w-4 h-4" />
                      <span>{boxQueuedForNextLap ? '⚠️ CANCEL BOX CALL' : '🚨 BOX THIS / NEXT LAP'}</span>
                    </button>

                    {/* Tyre Compound Selector */}
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-slate-400 block">交換予定タイヤ:</span>
                      <div className="grid grid-cols-4 gap-1">
                        {(['SOFT', 'MEDIUM', 'HARD', 'INTER'] as const).map((comp) => (
                          <button
                            key={comp}
                            type="button"
                            onClick={() => handleCompoundChange(comp)}
                            className={`py-1 rounded-lg text-xs font-racing font-bold border transition-all ${
                              nextCompoundChoice === comp
                                ? comp === 'SOFT'
                                  ? 'bg-red-950 text-red-300 border-red-500'
                                  : comp === 'MEDIUM'
                                  ? 'bg-yellow-950 text-yellow-300 border-yellow-500'
                                  : comp === 'HARD'
                                  ? 'bg-slate-800 text-white border-white'
                                  : 'bg-emerald-950 text-emerald-300 border-emerald-500'
                                : 'bg-slate-950 text-slate-400 border-white/5 hover:text-white'
                            }`}
                          >
                            {comp}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* ERS & PU Mode Buttons */}
                    <div className="grid grid-cols-2 gap-1.5 pt-1">
                      <button
                        type="button"
                        onClick={handleToggleErs}
                        className={`py-1.5 px-2 rounded-lg text-xs font-racing font-bold flex items-center justify-center gap-1 border transition-all ${
                          ersBoostUsedThisLap
                            ? 'bg-purple-950 text-purple-300 border-purple-500 shadow-md shadow-purple-950 animate-pulse'
                            : 'bg-slate-950 text-slate-400 border-white/10 hover:text-white'
                        }`}
                      >
                        <Zap className="w-3.5 h-3.5 text-purple-400" />
                        <span>{ersBoostUsedThisLap ? 'ERS BOOST ON' : 'ERS OVERTAKE'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handlePuModeChange(activePuMode === 'push' ? 'standard' : 'push')}
                        className={`py-1.5 px-2 rounded-lg text-xs font-racing font-bold flex items-center justify-center gap-1 border transition-all ${
                          activePuMode === 'push'
                            ? 'bg-red-950 text-red-300 border-red-500 shadow-md shadow-red-950 animate-pulse'
                            : 'bg-slate-950 text-slate-400 border-white/10 hover:text-white'
                        }`}
                      >
                        <Flame className="w-3.5 h-3.5 text-red-400" />
                        <span>{activePuMode === 'push' ? 'PU: PUSH' : 'PU: STD'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Rain Radar & Crossover in Fullscreen */}
                  <div className="bg-slate-900/90 rounded-2xl border border-white/10 p-3 space-y-2 text-xs font-mono shadow-xl">
                    <div className="flex items-center justify-between">
                      <span className="font-racing font-bold text-white flex items-center gap-1.5">
                        <CloudRain className="w-3.5 h-3.5 text-cyan-400" /> WEATHER DOPPLER
                      </span>
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-cyan-300 font-bold text-[10px]">
                        {currentSnapshot?.rainRadar.waterDepthMm.toFixed(2)} mm
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span>路面状態:</span>
                      <span className="font-bold text-slate-200">
                        {currentSnapshot?.rainRadar.trackPhase === 'DRY'
                          ? '☀️ 完全ドライ'
                          : currentSnapshot?.rainRadar.trackPhase === 'DAMP'
                          ? '🌦️ ダンプ (滑りやすい)'
                          : currentSnapshot?.rainRadar.trackPhase === 'WET'
                          ? '🌧️ ウェット (水膜)'
                          : '⚡ ドライライン形成中'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span>推奨タイヤ:</span>
                      <span className="font-bold text-amber-300">
                        {currentSnapshot?.rainRadar.crossover.currentBestCompound}
                      </span>
                    </div>
                  </div>

                  {/* Live Radio Dialogue in Fullscreen */}
                  {currentSnapshot?.activeRadioPrompt && (
                    <div className="bg-gradient-to-br from-amber-950/60 to-slate-900 rounded-2xl border border-amber-500/50 p-3 space-y-2 shadow-xl animate-in fade-in">
                      <div className="flex items-center gap-2 text-xs font-racing font-bold text-amber-300">
                        <Radio className="w-4 h-4 text-amber-400 animate-pulse" />
                        <span>{currentSnapshot.activeRadioPrompt.speaker} からの緊急無線</span>
                      </div>
                      <p className="text-xs text-slate-200 bg-black/40 p-2 rounded-lg border border-white/5 font-mono">
                        &quot;{currentSnapshot.activeRadioPrompt.message}&quot;
                      </p>
                      <div className="space-y-1">
                        {currentSnapshot.activeRadioPrompt.options.map((opt) => (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() =>
                              handleRadioResponse(currentSnapshot.activeRadioPrompt!.id, opt)
                            }
                            className="w-full text-left p-2 rounded-lg text-xs font-mono bg-slate-800/80 hover:bg-amber-600 hover:text-slate-950 text-slate-200 border border-white/10 transition-all"
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

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
