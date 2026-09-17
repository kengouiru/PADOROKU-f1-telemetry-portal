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
} from 'lucide-react';
import {
  STRATEGIST_ARCHETYPES,
  F1_BADGES_CATALOG,
  FIA_LICENSES,
  diagnoseStrategistProfile,
  loadStrategistCareer,
  saveStrategistCareer,
  type DiagnosticResult,
  type SavedCareerData,
  type F1Badge,
  type BadgeCategory,
} from '@/lib/raceDebriefAnalysis';
import {
  SIM_CIRCUITS,
  GRID_DRIVERS,
  TYRE_PROPERTIES,
  PRESET_CHALLENGES,
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
} from '@/lib/raceSimulationEngine';
import { GLOSSARY_TERMS, type GlossaryTerm } from '@/data/f1GlossaryData';
// War Room & 2026 Regulations are now in Library (KnowledgeHistoryHub)
import { getGeminiAuthHeaders } from '@/lib/apiKeyService';
import { usePlanTier } from '@/lib/tierService';

// Pure Pitwall Command Room Game
type PitwallMonitor = 'timing' | 'thermals' | 'weather' | 'team' | 'radio';
type ChallengeModeType = 'crisis' | 'sprint' | 'procedural';

interface RaceSimulatorHubProps {
  onOpenUpgradeModal?: () => void;
  onNavigateToLibrary?: (subTab: string, termId?: string) => void;
}

export default function RaceSimulatorHub({
  onOpenUpgradeModal,
  onNavigateToLibrary,
}: RaceSimulatorHubProps) {
  const { isPro } = usePlanTier();

  // Pre-Race Initial Strategy & Setup State
  const [customStartingTyre, setCustomStartingTyre] = useState<TyreCompound | null>(null);
  const [customInitialPuMode, setCustomInitialPuMode] = useState<EnginePUMode | null>(null);
  const [customTargetBoxLap, setCustomTargetBoxLap] = useState<number | null>(null);
  const [customTargetCompound, setCustomTargetCompound] = useState<TyreCompound | null>(null);
  const [isBriefingOpen, setIsBriefingOpen] = useState<boolean>(true);

  // Audio Sound Effect Mute State (Default: Sound ON as requested by user)
  const [radioAudioEnabled, setRadioAudioEnabled] = useState<boolean>(true);

  // ════════════════════════════════════════════════════════════════════════════
  // 🎯 CHALLENGE GAME MODE STATE
  // ════════════════════════════════════════════════════════════════════════════
  const [gameMode, setGameMode] = useState<ChallengeModeType>('crisis');
  const [selectedCircuitId, setSelectedCircuitId] = useState<string>('suzuka');
  const [selectedPlayerCode, setSelectedPlayerCode] = useState<string>('TSU');

  // Active scenario state
  const [presetIdx, setPresetIdx] = useState<number>(0);
  const [customScenario, setCustomScenario] = useState<ChallengeScenario | null>(null);

  const activeScenario = useMemo<ChallengeScenario>(() => {
    if (customScenario) return customScenario;
    return PRESET_CHALLENGES[presetIdx] || PRESET_CHALLENGES[0];
  }, [customScenario, presetIdx]);

  // Current simulation progression
  const [challengeLap, setChallengeLap] = useState<number>(1);
  const [challengePlaying, setChallengePlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1); // 0.5x, 1x, 2x, 5x
  const [autoPauseEnabled, setAutoPauseEnabled] = useState<boolean>(true);
  const [autoPauseAlert, setAutoPauseAlert] = useState<string | null>(null);
  const [lapTimeRemainingMs, setLapTimeRemainingMs] = useState<number>(5500);
  const challengeTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Monitor Deck selection
  const [activeMonitor, setActiveMonitor] = useState<PitwallMonitor>('timing');

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

  // Phase 1 Debrief: Personality Archetype & Badges State
  const [diagnosticResult, setDiagnosticResult] = useState<DiagnosticResult | null>(null);
  const [debriefTab, setDebriefTab] = useState<'score' | 'archetype' | 'badges' | 'knowledge'>('score');
  const [careerData, setCareerData] = useState<SavedCareerData>(() => loadStrategistCareer());
  const [isCareerModalOpen, setIsCareerModalOpen] = useState<boolean>(false);
  const [selectedBadgeForDetail, setSelectedBadgeForDetail] = useState<F1Badge | null>(null);
  const [badgeCategoryFilter, setBadgeCategoryFilter] = useState<'all' | BadgeCategory>('all');

  // Compute effective player config based on pre-race strategy selection
  const effectivePlayerConfig = useMemo<DriverSimConfig>(() => {
    return {
      ...activeScenario.playerConfig,
      startTyre: customStartingTyre || activeScenario.playerConfig.startTyre,
      machineSetup: {
        ...activeScenario.playerConfig.machineSetup,
        puMode: customInitialPuMode || activeScenario.playerConfig.machineSetup.puMode,
      },
    };
  }, [activeScenario.playerConfig, customStartingTyre, customInitialPuMode]);

  const effectiveTargetBoxLap = useMemo(() => {
    if (activeScenario.actualRainLap && activeScenario.actualRainLap <= activeScenario.totalLaps) {
      return activeScenario.actualRainLap;
    }
    return Math.max(2, Math.floor(activeScenario.totalLaps * 0.6));
  }, [activeScenario]);

  // Merge pre-race target pit stop with real-time tactical overrides
  const effectivePlayerTacticalCommands = useMemo(() => {
    const commands = { ...playerTacticalCommands };
    const boxLap = customTargetBoxLap || effectiveTargetBoxLap;
    const boxCmp = customTargetCompound || nextCompoundChoice;
    if (boxLap && boxCmp && !commands[boxLap]?.boxNextLap && Object.keys(playerTacticalCommands).length === 0) {
      commands[boxLap] = {
        ...commands[boxLap],
        boxNextLap: true,
        nextCompound: boxCmp,
      };
    }
    return commands;
  }, [playerTacticalCommands, customTargetBoxLap, effectiveTargetBoxLap, customTargetCompound, nextCompoundChoice]);

  // Compute snapshots dynamically from engine
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
    });
  }, [activeScenario, effectivePlayerConfig, effectivePlayerTacticalCommands, radioResponses]);

  const currentSnapshot = useMemo(() => {
    if (!challengeSnapshots.length) return undefined;
    const idx = Math.min(challengeSnapshots.length - 1, Math.max(0, challengeLap - 1));
    return challengeSnapshots[idx];
  }, [challengeSnapshots, challengeLap]);

  const playerCar = useMemo(() => {
    return currentSnapshot?.cars.find((c) => c.code === activeScenario.playerConfig.code);
  }, [currentSnapshot, activeScenario]);

  const teammateCar = useMemo(() => {
    return currentSnapshot?.cars.find((c) => c.code === activeScenario.teammateConfig.code);
  }, [currentSnapshot, activeScenario]);

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
  // 0.5x: 8.5s / lap (長考・詳細分析)
  // 1x: 5.5s / lap (標準司令塔ペース)
  // 2x: 2.8s / lap (テンポ進行)
  // 5x: 1.2s / lap (ファストフォワード)
  const currentIntervalMs = useMemo(() => {
    if (playbackSpeed === 0.5) return 8500;
    if (playbackSpeed === 1) return 5500;
    if (playbackSpeed === 2) return 2800;
    return 1200;
  }, [playbackSpeed]);

  // Auto-pause triggers on critical tactical events
  useEffect(() => {
    if (!autoPauseEnabled || !challengePlaying) return;

    // 1. Radio Prompt arrived and not yet answered
    if (currentSnapshot?.activeRadioPrompt && !radioResponses[currentSnapshot.activeRadioPrompt.id]) {
      setChallengePlaying(false);
      setAutoPauseAlert(
        `📻 ${currentSnapshot.activeRadioPrompt.speaker} から緊急無線着信！指示を選択してください。`
      );
      return;
    }

    // 2. Safety Car deployed (dynamically triggers on any lap when an incident happens)
    const isPrevLapSc = challengeLap > 1 && !!challengeSnapshots[challengeLap - 2]?.isSC;
    if (currentSnapshot?.isSC && !isPrevLapSc) {
      setChallengePlaying(false);
      setAutoPauseAlert('🚨 セーフティカー出動！通常22秒のピットロスが11秒に半減するチープピットの好機です。');
      return;
    }

    // 3. Rain Crossover reached (Slick -> Inter)
    if (
      currentSnapshot &&
      currentSnapshot.rainRadar.waterDepthMm >= 1.0 &&
      challengeLap === activeScenario.actualRainLap
    ) {
      setChallengePlaying(false);
      setAutoPauseAlert(
        '🌧️ 路面水量が1.0mm突破！インターミディエイトへのクロスオーバー（履き替え分岐点）に到達しました。'
      );
      return;
    }

    // 4. Drying Track Crossover reached (Inter -> Slick decision)
    if (
      currentSnapshot &&
      currentSnapshot.rainRadar.trackPhase === 'DRYING_LINE' &&
      currentSnapshot.rainRadar.waterDepthMm <= 0.85 &&
      (playerCar?.tyreCompound === 'INTER' || playerCar?.tyreCompound === 'WET') &&
      !radioResponses[`radio-drying-${challengeLap}`]
    ) {
      setChallengePlaying(false);
      setAutoPauseAlert(
        '⚡ ドライライン形成中！レコードラインが乾燥しスリックへのクロスオーバー（履き替え分岐点）に到達しました。'
      );
      return;
    }
  }, [
    challengePlaying,
    autoPauseEnabled,
    currentSnapshot,
    radioResponses,
    challengeLap,
    activeScenario,
  ]);

  // Auto playback loop with countdown
  useEffect(() => {
    if (challengePlaying) {
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
  }, [challengePlaying, activeScenario.totalLaps, currentIntervalMs]);

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
        const isWin = playerCar?.position === 1;
        const updatedCareer = saveStrategistCareer(
          diagnostic.totalCpEarnedThisRace,
          diagnostic.unlockedBadgesThisRace.map((b) => b.id),
          score.totalScore,
          isWin,
          diagnostic.archetype.id
        );
        setCareerData(updatedCareer);
      }
    } else {
      setTacticalScore(null);
      setDiagnosticResult(null);
    }
  }, [challengeLap, activeScenario, challengeSnapshots, playerTacticalCommands, radioResponses, tacticalScore]);

  // Handle player commands
  const handleToggleBoxNextLap = () => {
    const nextState = !boxQueuedForNextLap;
    setBoxQueuedForNextLap(nextState);
    setPlayerTacticalCommands((prev) => ({
      ...prev,
      [challengeLap]: {
        ...prev[challengeLap],
        boxNextLap: nextState,
        nextCompound: nextCompoundChoice,
      },
    }));
  };

  const handleCompoundChange = (comp: TyreCompound) => {
    setNextCompoundChoice(comp);
    if (boxQueuedForNextLap) {
      setPlayerTacticalCommands((prev) => ({
        ...prev,
        [challengeLap]: {
          ...prev[challengeLap],
          boxNextLap: true,
          nextCompound: comp,
        },
      }));
    }
  };

  const handlePuModeChange = (mode: EnginePUMode) => {
    setActivePuMode(mode);
    setPlayerTacticalCommands((prev) => ({
      ...prev,
      [challengeLap]: {
        ...prev[challengeLap],
        puMode: mode,
      },
    }));
  };

  const handleToggleErs = () => {
    const nextState = !ersBoostUsedThisLap;
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
    if (radioAudioEnabled) playF1RadioChirp();
    setRadioResponses((prev) => ({ ...prev, [promptId]: option.id }));

    if (option.actionType === 'box') {
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
  const startSprintRace = (circuitId: string, playerCode: string) => {
    const scenario = generateSprintRaceScenario(circuitId, playerCode);
    setCustomScenario(scenario);
    setGameMode('sprint');
    resetGameState();
  };

  const startProceduralCrisis = () => {
    const scenario = generateProceduralScenario();
    setCustomScenario(scenario);
    setGameMode('procedural');
    resetGameState();
  };

  const startPresetCrisis = (idx: number) => {
    setPresetIdx(idx);
    setCustomScenario(null);
    setGameMode('crisis');
    resetGameState();
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

  return (
    <div className="space-y-4 max-w-7xl mx-auto pb-16">
      {/* ── Top Header Navigation Bar ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-950/80 p-3 sm:p-4 rounded-2xl border border-white/10 shadow-xl backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-rose-700 flex items-center justify-center shadow-lg shadow-red-950/50 border border-red-500/30">
            <Gamepad2 className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-racing font-bold text-white text-base sm:text-lg tracking-wider">
                F1 PITWALL STRATEGY COMMAND ROOM
              </span>
              <span className="px-2 py-0.5 rounded-full bg-red-950 border border-red-500/40 text-[10px] font-mono text-red-300 font-bold">
                PRO CONSOLE
              </span>
            </div>
            <p className="text-xs text-slate-400">
              世界最高峰のF1レース司令塔体験 — 24戦・全11チーム・リアルタイムテレメトリー＆双方向無線
            </p>
          </div>
        </div>

        {/* Top Controls: Sound Toggle & SubHub switcher */}
        <div className="flex items-center gap-2">
          {/* FIA Career & Badges Museum Button */}
          <button
            type="button"
            onClick={() => setIsCareerModalOpen(true)}
            className="btn-console flex items-center gap-1.5 text-xs px-3 py-1.5 bg-gradient-to-r from-amber-950/50 via-slate-900 to-red-950/40 border-amber-500/40 text-amber-300 hover:text-white hover:border-amber-400 transition-all shadow-sm group"
            title="FIAライセンス等級・累積CP・全30+称号カタログを開く"
          >
            <Award className="w-3.5 h-3.5 text-yellow-400 group-hover:scale-110 transition-transform" />
            <span className="font-racing text-[11px] font-bold">
              {careerData.grade === 'S' ? '👑 SUPER S' : `GRADE ${careerData.grade}`}
            </span>
            <span className="hidden md:inline px-1 py-0.2 rounded bg-amber-950/80 border border-amber-500/30 text-[9px] font-mono text-amber-200">
              {careerData.unlockedBadgeIds.length}/{F1_BADGES_CATALOG.length}称号
            </span>
          </button>

          {/* Auto Pause Toggle Button */}
          <button
            type="button"
            onClick={() => setAutoPauseEnabled(!autoPauseEnabled)}
            className={`btn-console flex items-center gap-1.5 text-xs px-3 py-1.5 ${
              autoPauseEnabled
                ? 'bg-amber-950/50 border-amber-500/40 text-amber-300'
                : 'bg-slate-900 border-white/10 text-slate-500'
            }`}
            title="緊急無線やSC出動時に自動で一時停止し、長考・確認できるようにします"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span className="font-mono text-[11px] font-bold">
              AUTO-PAUSE: {autoPauseEnabled ? 'ON' : 'OFF'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              const next = !radioAudioEnabled;
              setRadioAudioEnabled(next);
              if (next) playF1RadioChirp();
            }}
            className={`btn-console flex items-center gap-1.5 text-xs px-3 py-1.5 ${
              radioAudioEnabled
                ? 'bg-emerald-950/50 border-emerald-500/40 text-emerald-300'
                : 'bg-slate-900 border-white/10 text-slate-500'
            }`}
            title="ドライバー無線の着信音（Web Audioシンセサイザー）"
          >
            {radioAudioEnabled ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                <span className="font-mono text-[11px] font-bold">RADIO AUDIO: ON</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5" />
                <span className="font-mono text-[11px]">MUTED</span>
              </>
            )}
          </button>

          {onNavigateToLibrary && (
            <button
              type="button"
              onClick={() => onNavigateToLibrary('strategy')}
              className="btn-console flex items-center gap-1.5 text-xs px-3 py-1.5 text-slate-400 hover:text-white hover:border-purple-500/40 transition-colors"
              title="レース戦略公理や2026新技術シミュレーターはF1大百科（Library）で学習できます"
            >
              <BookOpen className="w-3.5 h-3.5 text-purple-400" />
              <span className="font-mono text-[11px] font-bold">大百科・規定ラボ ➔</span>
            </button>
          )}
        </div>
      </div>

      <div className="space-y-4">
          {/* ── Mission Mode Selector & Setup Deck ── */}
          <div className="glass-card-premium p-3 sm:p-4 rounded-2xl border border-white/10">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
              {/* Left: 3 Game Modes */}
              <div className="flex items-center gap-1.5 bg-slate-900/80 p-1 rounded-xl border border-white/10 shrink-0">
                <button
                  type="button"
                  onClick={() => startPresetCrisis(0)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-racing font-bold transition-all ${
                    gameMode === 'crisis' && !customScenario
                      ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md shadow-red-950'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Zap className="w-3.5 h-3.5 text-amber-400" /> クライマックス決断 (5-8周)
                </button>
                <button
                  type="button"
                  onClick={() => startSprintRace(selectedCircuitId, selectedPlayerCode)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-racing font-bold transition-all ${
                    gameMode === 'sprint'
                      ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md shadow-red-950'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Trophy className="w-3.5 h-3.5 text-yellow-400" /> スプリント全周回 (15-19周)
                </button>
                <button
                  type="button"
                  onClick={startProceduralCrisis}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-racing font-bold transition-all ${
                    gameMode === 'procedural'
                      ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md shadow-red-950'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Compass className="w-3.5 h-3.5 text-purple-400" /> 無限ランダム危機 (一期一会)
                </button>
              </div>

              {/* Center: Circuit & Driver Dropdowns (24 Circuits) */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1.5 bg-slate-900 px-2.5 py-1.5 rounded-xl border border-white/10">
                  <Flag className="w-3.5 h-3.5 text-red-400" />
                  <span className="text-[10px] font-mono text-slate-400">サーキット:</span>
                  <select
                    value={selectedCircuitId}
                    onChange={(e) => {
                      setSelectedCircuitId(e.target.value);
                      if (gameMode === 'sprint') {
                        startSprintRace(e.target.value, selectedPlayerCode);
                      }
                    }}
                    className="bg-transparent text-xs text-white font-racing font-bold focus:outline-none cursor-pointer"
                  >
                    {SIM_CIRCUITS.map((c) => (
                      <option key={c.id} value={c.id} className="bg-slate-900 text-white">
                        {c.flag} {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-1.5 bg-slate-900 px-2.5 py-1.5 rounded-xl border border-white/10">
                  <Gauge className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="text-[10px] font-mono text-slate-400">担当ドライバー:</span>
                  <select
                    value={selectedPlayerCode}
                    onChange={(e) => {
                      setSelectedPlayerCode(e.target.value);
                      if (gameMode === 'sprint') {
                        startSprintRace(selectedCircuitId, e.target.value);
                      }
                    }}
                    className="bg-transparent text-xs text-white font-racing font-bold focus:outline-none cursor-pointer"
                  >
                    {GRID_DRIVERS.slice(0, 10).map((d) => (
                      <option key={d.code} value={d.code} className="bg-slate-900 text-white">
                        #{d.number} {d.name} ({d.team})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Re-roll button for procedural */}
                {gameMode === 'procedural' && (
                  <button
                    type="button"
                    onClick={startProceduralCrisis}
                    className="btn-console flex items-center gap-1.5 text-xs text-purple-300 border-purple-500/30 hover:bg-purple-950/40"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> 次の突発危機へ
                  </button>
                )}
              </div>
            </div>

            {/* Scenario Briefing Banner */}
            <div className="mt-3 p-3 rounded-xl bg-slate-900/90 border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-racing font-bold text-white text-sm">
                    {activeScenario.title}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-red-950/80 border border-red-500/30 text-[10px] font-mono text-red-300">
                    目標: P{activeScenario.targetPosition}以内
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-mono text-slate-300">
                    全{activeScenario.totalLaps}周
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1">{activeScenario.description}</p>
              </div>

              {/* Weather forecast ticker */}
              <div className="p-2 rounded-lg bg-slate-950 border border-white/10 flex items-center gap-2 text-xs shrink-0">
                <CloudRain className="w-4 h-4 text-sky-400 shrink-0" />
                <span className="font-mono text-slate-300 text-[11px]">
                  {activeScenario.weatherForecast.radarDesc}
                </span>
              </div>
            </div>

            {/* ── Pre-Race Strategic Briefing & Initial Setup Deck ── */}
            <div className="mt-3 p-3.5 rounded-xl bg-slate-900/95 border border-white/10 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="text-base">📋</span>
                  <span className="font-racing font-bold text-white text-xs tracking-wider uppercase">
                    PRE-RACE STRATEGY BRIEFING & INITIAL SETUP / レース前戦略ブリーフィング
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {gameMode === 'crisis' ? (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-950/80 text-amber-300 border border-amber-500/30">
                      🏁 途中参戦シナリオ (プリセット初期設定)
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950/80 text-emerald-300 border border-emerald-500/30">
                      ⚙️ 司令塔カスタム戦略設定可能
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => setIsBriefingOpen(!isBriefingOpen)}
                    className="text-[10px] font-mono text-slate-400 hover:text-white px-2 py-0.5 rounded bg-slate-800"
                  >
                    {isBriefingOpen ? '▲ 閉じる' : '▼ 展開'}
                  </button>
                </div>
              </div>

              {isBriefingOpen && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1 text-xs">
                  {/* 1. Starting Tyre Selector */}
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-white/10 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-racing text-slate-300 font-bold text-[11px] flex items-center gap-1.5">
                        <Gauge className="w-3.5 h-3.5 text-red-400" /> スタート装着タイヤ
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        {gameMode === 'crisis' ? 'プリセット' : '選択可能'}
                      </span>
                    </div>

                    <div className="grid grid-cols-5 gap-1 pt-1">
                      {(['SOFT', 'MEDIUM', 'HARD', 'INTER', 'WET'] as TyreCompound[]).map((cmp) => {
                        const isSelected = effectivePlayerConfig.startTyre === cmp;
                        const prop = TYRE_PROPERTIES[cmp];
                        return (
                          <button
                            key={cmp}
                            type="button"
                            onClick={() => {
                              setCustomStartingTyre(cmp);
                            }}
                            className={`p-1.5 rounded-lg flex flex-col items-center gap-1 border transition-all text-center ${
                              isSelected
                                ? 'bg-red-950 border-red-500 text-white shadow-lg ring-1 ring-red-500'
                                : 'bg-slate-900 border-white/10 text-slate-400 hover:text-white hover:bg-slate-800'
                            }`}
                            title={`${cmp} (${prop.label}): 適正水深 ${prop.optimalWaterRange[0]}〜${prop.optimalWaterRange[1]}mm`}
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
                    <div className="text-[10px] text-slate-400 font-mono leading-tight pt-1">
                      現在: <span className="font-bold text-white">{effectivePlayerConfig.startTyre}</span> ({TYRE_PROPERTIES[effectivePlayerConfig.startTyre].label}) —
                      {effectivePlayerConfig.startTyre === 'SOFT'
                        ? ' 序盤急襲・ハイペースだが摩耗大'
                        : effectivePlayerConfig.startTyre === 'MEDIUM'
                        ? ' バランス最善・天候変化への対応力◎'
                        : effectivePlayerConfig.startTyre === 'HARD'
                        ? ' 長寿スティント・雨待ちステイアウト'
                        : effectivePlayerConfig.startTyre === 'INTER'
                        ? ' 降雨・ダンプ路面用 (水深0.8〜4.0mm)'
                        : ' 豪雨用 (水深3.5mm以上)'}
                    </div>
                  </div>

                  {/* 2. Target Box Strategy */}
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-white/10 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-racing text-slate-300 font-bold text-[11px] flex items-center gap-1.5">
                        <Target className="w-3.5 h-3.5 text-amber-400" /> 予定ピット戦略
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        目標LAP & タイヤ
                      </span>
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
                        className="bg-slate-900 border border-white/10 rounded-lg px-2 py-1 text-xs text-white font-mono"
                      >
                        {(['SOFT', 'MEDIUM', 'HARD', 'INTER', 'WET'] as TyreCompound[]).map((cmp) => (
                          <option key={cmp} value={cmp}>
                            {cmp}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="text-[10px] text-slate-400 font-mono leading-tight pt-1">
                      💡 ピット窓口: 通常ロス {activeScenario.circuit.pitLaneLoss}s（SC出動時は約半減の11s）。レース中いつでも手動BOXに変更可能です。
                    </div>
                  </div>

                  {/* 3. Machine Setup: PU Mode & Downforce */}
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-white/10 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-racing text-slate-300 font-bold text-[11px] flex items-center gap-1.5">
                        <Gauge className="w-3.5 h-3.5 text-cyan-400" /> 初期PUモード ＆ ダウンフォース
                      </span>
                      <span className="text-[10px] font-mono text-cyan-400 font-bold">
                        {effectivePlayerConfig.machineSetup.downforce.toUpperCase()} DF
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-1 pt-1">
                      {[
                        { id: 'push', label: 'PUSH ⚡', desc: '序盤ダッシュ' },
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
                            className={`p-1.5 rounded-lg text-center border transition-all ${
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

                    <div className="text-[10px] text-slate-400 font-mono leading-tight pt-1">
                      サーキット特性: 抜きにくさ {activeScenario.circuit.overtakeDifficulty} / タイヤ攻撃性 {activeScenario.circuit.tyreAggression}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── Auto Pause Event Alert Banner ── */}
          {autoPauseAlert && (
            <div className="p-3 rounded-xl bg-gradient-to-r from-amber-950 via-slate-900 to-slate-950 border-2 border-amber-500/80 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-lg animate-in fade-in duration-200">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
                <span className="font-racing font-bold text-amber-300 tracking-wider">
                  ⏸️ 自動一時停止中
                </span>
                <span className="text-white font-mono">{autoPauseAlert}</span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[10px] text-slate-400">
                  各モニター（M1〜M5）をじっくり確認して指示を下せます
                </span>
                <button
                  type="button"
                  onClick={() => setAutoPauseAlert(null)}
                  className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-[10px] text-slate-300 font-mono"
                >
                  ✕ 閉じる
                </button>
              </div>
            </div>
          )}

          {/* ── Pro Pitwall Multi-Monitor Deck Switcher ── */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1">
            <button
              type="button"
              onClick={() => setActiveMonitor('timing')}
              className={`btn-console flex items-center gap-2 text-xs py-2 px-3.5 ${
                activeMonitor === 'timing' ? 'btn-console-primary' : ''
              }`}
            >
              <Target className="w-3.5 h-3.5" />
              <span>[M1] TIMING & TRAFFIC</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveMonitor('thermals')}
              className={`btn-console flex items-center gap-2 text-xs py-2 px-3.5 ${
                activeMonitor === 'thermals' ? 'btn-console-primary' : ''
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>[M2] CAR & THERMALS</span>
              {playerCar?.thermalWarning !== 'OPTIMAL' && (
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveMonitor('weather')}
              className={`btn-console flex items-center gap-2 text-xs py-2 px-3.5 ${
                activeMonitor === 'weather' ? 'btn-console-primary' : ''
              }`}
            >
              <CloudRain className="w-3.5 h-3.5 text-sky-400" />
              <span>[M3] WEATHER & DRYING</span>
              {currentSnapshot?.rainRadar.trackPhase === 'DRYING_LINE' ? (
                <span className="px-1.5 py-0.2 rounded bg-amber-500 text-[9px] font-bold text-slate-950 animate-pulse">
                  DRYING
                </span>
              ) : currentSnapshot?.rainRadar.waterDepthMm! > 0.8 ? (
                <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping" />
              ) : null}
            </button>

            <button
              type="button"
              onClick={() => setActiveMonitor('team')}
              className={`btn-console flex items-center gap-2 text-xs py-2 px-3.5 ${
                activeMonitor === 'team' ? 'btn-console-primary' : ''
              }`}
            >
              <Users className="w-3.5 h-3.5 text-emerald-400" />
              <span>[M4] TEAM & DOUBLE-STACK</span>
              {currentSnapshot?.teammateStatus?.doubleStackRisk && (
                <span className="px-1.5 py-0.2 rounded bg-red-600 text-[9px] font-bold text-white animate-pulse">
                  RISK
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveMonitor('radio')}
              className={`btn-console flex items-center gap-2 text-xs py-2 px-3.5 relative ${
                activeMonitor === 'radio' ? 'btn-console-primary' : ''
              }`}
            >
              <Radio className="w-3.5 h-3.5 text-rose-400" />
              <span>[M5] DRIVER RADIO</span>
              {currentSnapshot?.activeRadioPrompt && !radioResponses[currentSnapshot.activeRadioPrompt.id] && (
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
              )}
            </button>
          </div>

          {/* ── Active Interactive Radio Prompt (Prominent Pop-Up if Active) ── */}
          {currentSnapshot?.activeRadioPrompt && !radioResponses[currentSnapshot.activeRadioPrompt.id] && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-red-950 via-slate-900 to-slate-950 border-2 border-red-500/80 shadow-2xl shadow-red-950/80 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="flex items-center justify-between pb-2 border-b border-red-500/30">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
                  <span className="font-racing font-bold text-red-300 text-xs tracking-widest uppercase">
                    📻 INCOMING TEAM RADIO TRANSMISSION ({currentSnapshot.activeRadioPrompt.urgency})
                  </span>
                </div>
                <span className="text-xs font-racing font-bold text-white">
                  {currentSnapshot.activeRadioPrompt.speaker}
                </span>
              </div>

              <div className="py-3 text-sm text-white font-mono leading-relaxed">
                {currentSnapshot.activeRadioPrompt.message}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 pt-2">
                {currentSnapshot.activeRadioPrompt.options.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleRadioResponse(currentSnapshot.activeRadioPrompt!.id, opt)}
                    className="p-3 rounded-xl bg-slate-900/90 hover:bg-red-900/40 border border-white/20 hover:border-red-400/60 text-left transition-all cursor-pointer group shadow-md"
                  >
                    <div className="text-xs font-racing font-bold text-white group-hover:text-red-300">
                      {opt.label}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1">{opt.effectText}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── MONITOR DISPLAY AREA ── */}
          <div className="grid grid-cols-1 gap-4">
            {/* ══ MONITOR 1: TIMING & TRAFFIC REJOIN WINDOW ══ */}
            {activeMonitor === 'timing' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Left 2 Cols: Timing Tower */}
                <div className="lg:col-span-2 glass-card-premium p-4 rounded-2xl border border-white/10 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <span className="font-racing text-sm font-bold text-white flex items-center gap-2">
                      <Target className="w-4 h-4 text-red-500" /> LIVE TIMING TOWER
                    </span>
                    <div className="flex items-center gap-2">
                      {currentSnapshot?.rainRadar && (
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold flex items-center gap-1 border ${
                            currentSnapshot.rainRadar.incidentRiskLevel === 'CRITICAL'
                              ? 'bg-red-950/80 border-red-500/60 text-red-300 animate-pulse'
                              : currentSnapshot.rainRadar.incidentRiskLevel === 'HIGH'
                              ? 'bg-amber-950/80 border-amber-500/60 text-amber-300'
                              : currentSnapshot.rainRadar.incidentRiskLevel === 'ELEVATED'
                              ? 'bg-yellow-950/60 border-yellow-500/40 text-yellow-300'
                              : 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                          }`}
                          title="現在の路面状況・タイヤ適合・コース特性によるインシデント/SC発生確率"
                        >
                          <AlertTriangle className="w-3 h-3" />
                          <span>
                            SC RISK: {currentSnapshot.rainRadar.incidentRiskPercent}% ({currentSnapshot.rainRadar.incidentRiskLevel})
                          </span>
                        </span>
                      )}
                      <span className="text-xs font-mono text-slate-400">
                        LAP {challengeLap} / {activeScenario.totalLaps}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    {currentSnapshot?.cars.map((car) => {
                      const isTarget = car.code === activeScenario.playerConfig.code;
                      const isTeammate = car.code === activeScenario.teammateConfig.code;
                      const tyreProp = TYRE_PROPERTIES[car.tyreCompound];
                      return (
                        <div
                          key={car.code}
                          className={`p-2.5 rounded-xl flex items-center justify-between text-xs transition-all ${
                            isTarget
                              ? 'bg-red-950/60 border-2 border-red-500/70 shadow-lg'
                              : isTeammate
                              ? 'bg-emerald-950/40 border border-emerald-500/40'
                              : 'bg-slate-900/70 border border-white/5'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-5 text-center font-racing font-black text-slate-300">
                              P{car.position}
                            </span>
                            <div
                              className="w-1 h-5 rounded-full"
                              style={{ backgroundColor: car.color }}
                            />
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="font-racing font-bold text-white">{car.name}</span>
                                <span className="font-mono text-[10px] text-slate-400">#{car.number}</span>
                                {isTarget && (
                                  <span className="px-1.5 py-0.2 rounded bg-red-600 text-[9px] font-bold text-white">
                                    YOU
                                  </span>
                                )}
                                {isTeammate && (
                                  <span className="px-1.5 py-0.2 rounded bg-emerald-600 text-[9px] font-bold text-white">
                                    TEAMMATE
                                  </span>
                                )}
                              </div>
                              <div className="text-[10px] text-slate-400 font-mono">
                                {car.team} • {formatTimeSeconds(car.lapTime)}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 font-mono">
                            {/* Tyre Badge */}
                            <div className="flex items-center gap-1">
                              <span
                                className="px-2 py-0.5 rounded text-[10px] font-bold"
                                style={{
                                  backgroundColor: `${tyreProp.color}25`,
                                  color: tyreProp.color,
                                  border: `1px solid ${tyreProp.color}50`,
                                }}
                              >
                                {car.tyreCompound[0]} (L{car.tyreAge})
                              </span>
                              {/* Wear Bar */}
                              <div className="w-12 h-1.5 bg-slate-800 rounded-full overflow-hidden hidden sm:block">
                                <div
                                  className={`h-full ${
                                    car.tyreWearPercent > 80
                                      ? 'bg-red-500'
                                      : car.tyreWearPercent > 50
                                      ? 'bg-yellow-500'
                                      : 'bg-emerald-500'
                                  }`}
                                  style={{ width: `${car.tyreWearPercent}%` }}
                                />
                              </div>
                            </div>

                            {/* Gap */}
                            <span className="w-16 text-right font-bold text-slate-300">
                              {car.position === 1 ? 'LEADER' : `+${car.gapToLeader.toFixed(1)}s`}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Right Col: Pit Exit Traffic Window Radar */}
                <div className="glass-card-premium p-4 rounded-2xl border border-white/10 space-y-4">
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
              </div>
            )}

            {/* ══ MONITOR 2: CAR TELEMETRY & DUAL-LAYER TYRE THERMALS ══ */}
            {activeMonitor === 'thermals' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* 4 Tyre Cards with Surface vs Core Temps */}
                {['フロント左 (FL)', 'フロント右 (FR)', 'リア左 (RL)', 'リア右 (RR)'].map(
                  (tyreName, idx) => {
                    const isFront = idx < 2;
                    const surf = playerCar ? playerCar.tyreSurfaceTemp + (isFront ? -2 : +3) : 100;
                    const core = playerCar ? playerCar.tyreCoreTemp + (isFront ? -1 : +2) : 98;
                    const isOverheat = surf > 125;
                    const isCold = surf < 88;
                    return (
                      <div
                        key={tyreName}
                        className={`glass-card-premium p-4 rounded-2xl border ${
                          isOverheat
                            ? 'border-red-500/60 bg-red-950/20'
                            : isCold
                            ? 'border-cyan-500/60 bg-cyan-950/20'
                            : 'border-white/10'
                        }`}
                      >
                        <div className="flex justify-between items-center text-xs text-slate-300 pb-2 border-b border-white/10">
                          <span className="font-racing font-bold">{tyreName}</span>
                          <span
                            className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                              isOverheat
                                ? 'bg-red-600 text-white animate-pulse'
                                : isCold
                                ? 'bg-cyan-600 text-white'
                                : 'bg-emerald-950 text-emerald-300'
                            }`}
                          >
                            {isOverheat ? 'BLISTER RISK' : isCold ? 'GRAINING RISK' : 'OPTIMAL'}
                          </span>
                        </div>

                        <div className="mt-3 space-y-2">
                          <div className="flex justify-between text-xs">
                            <span className="text-slate-400">表面温度 (Surface):</span>
                            <span
                              className={`font-mono font-bold text-sm ${
                                isOverheat ? 'text-red-400' : isCold ? 'text-cyan-400' : 'text-emerald-400'
                              }`}
                            >
                              {surf}°C
                            </span>
                          </div>

                          <div className="flex justify-between text-xs">
                            <span className="text-slate-400">内部コア (Bulk Core):</span>
                            <span className="font-mono font-bold text-sm text-slate-200">{core}°C</span>
                          </div>

                          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mt-1">
                            <div
                              className={`h-full ${
                                isOverheat ? 'bg-red-500' : isCold ? 'bg-cyan-500' : 'bg-emerald-500'
                              }`}
                              style={{ width: `${Math.min(100, (surf / 140) * 100)}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  }
                )}

                {/* Additional Cockpit Metrics */}
                <div className="lg:col-span-4 glass-card-premium p-4 rounded-2xl border border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                  <div className="p-3 rounded-xl bg-slate-900 border border-white/10">
                    <span className="text-[10px] font-mono text-slate-400">ブレーキ平均温度</span>
                    <div className="font-racing font-bold text-lg text-amber-400 mt-1">
                      {playerCar?.brakeTemp || 580}°C
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900 border border-white/10">
                    <span className="text-[10px] font-mono text-slate-400">ERS バッテリー SOC</span>
                    <div className="font-racing font-bold text-lg text-cyan-400 mt-1">
                      {playerCar?.ersBatterySoc || 85}%
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900 border border-white/10">
                    <span className="text-[10px] font-mono text-slate-400">残燃料搭載量</span>
                    <div className="font-racing font-bold text-lg text-emerald-400 mt-1">
                      {playerCar?.fuelRemainingKg || 25.0} kg
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900 border border-white/10">
                    <span className="text-[10px] font-mono text-slate-400">ドライバー信頼度</span>
                    <div className="font-racing font-bold text-lg text-white mt-1">
                      {playerCar?.driverConfidence || 90}%
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ══ MONITOR 3: WEATHER, TRACK DRYING & INCIDENT RISK PREDICTOR ══ */}
            {activeMonitor === 'weather' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1. Doppler Rain Radar */}
                <div className="glass-card-premium p-4 rounded-2xl border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-racing text-sm font-bold text-white flex items-center gap-2">
                      <CloudRain className="w-4 h-4 text-sky-400" /> DOPPLER RAIN RADAR
                    </span>
                    <span className="px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-500/30 text-[10px] font-mono font-bold uppercase">
                      {currentSnapshot?.rainRadar.intensity || 'DRY'}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900 border border-white/10 space-y-2.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">雨雲までの直線距離:</span>
                      <span className="font-mono font-bold text-white">
                        {currentSnapshot?.rainRadar.distanceKm! > 10
                          ? '10km以上先 (安全圏)'
                          : currentSnapshot?.rainRadar.distanceKm! === 0
                          ? '現在サーキット頭上 (降雨中)'
                          : `あと ${currentSnapshot?.rainRadar.distanceKm} km`}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-slate-400">雨雲移動速度:</span>
                      <span className="font-mono font-bold text-slate-300">
                        {currentSnapshot?.rainRadar.speedKmH} km/h (南西方向)
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-slate-400">路面水量 (Standing Water):</span>
                      <span className="font-mono font-bold text-sky-400 text-sm">
                        {currentSnapshot?.rainRadar.waterDepthMm} mm
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-slate-400">路面温度 (Track Surface Temp):</span>
                      <span className="font-mono font-bold text-amber-400">
                        {currentSnapshot?.rainRadar.trackTempC || 30}°C
                      </span>
                    </div>
                  </div>
                </div>

                {/* 2. Track Drying Evolution & Racing Line Formation */}
                <div className="glass-card-premium p-4 rounded-2xl border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-racing text-sm font-bold text-white flex items-center gap-2">
                      <Zap className="w-4 h-4 text-amber-400" /> TRACK DRYING EVOLUTION
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-racing font-bold uppercase border ${
                        currentSnapshot?.rainRadar.trackPhase === 'FLOODED'
                          ? 'bg-red-950 border-red-500/50 text-red-300'
                          : currentSnapshot?.rainRadar.trackPhase === 'WET'
                          ? 'bg-blue-950 border-blue-500/50 text-blue-300'
                          : currentSnapshot?.rainRadar.trackPhase === 'DAMP'
                          ? 'bg-sky-950 border-sky-500/50 text-sky-300'
                          : currentSnapshot?.rainRadar.trackPhase === 'DRYING_LINE'
                          ? 'bg-amber-950 border-amber-500/50 text-amber-300 animate-pulse'
                          : 'bg-emerald-950 border-emerald-500/50 text-emerald-300'
                      }`}
                    >
                      {currentSnapshot?.rainRadar.trackPhase === 'DRYING_LINE'
                        ? '⚡ DRYING LINE'
                        : currentSnapshot?.rainRadar.trackPhase}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900 border border-white/10 space-y-2.5 text-xs">
                    {/* Dry line formation gauge */}
                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-slate-400">レコードライン乾燥度:</span>
                        <span className="font-mono font-bold text-white">
                          {currentSnapshot?.rainRadar.dryLineWidthPercent || 100}%
                        </span>
                      </div>
                      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-sky-500 via-amber-400 to-emerald-400 transition-all duration-300"
                          style={{
                            width: `${currentSnapshot?.rainRadar.dryLineWidthPercent || 100}%`,
                          }}
                        />
                      </div>
                    </div>

                    <div className="flex justify-between pt-1">
                      <span className="text-slate-400">蒸発＆走行排水レート:</span>
                      <span className="font-mono text-slate-200">
                        {currentSnapshot?.rainRadar.dryingRateMmPerLap! > 0
                          ? `-${currentSnapshot?.rainRadar.dryingRateMmPerLap} mm/lap (走行20台)`
                          : '0.00 mm/lap (降雨中またはドライ)'}
                      </span>
                    </div>

                    <p className="text-[11px] font-mono leading-relaxed pt-1 text-slate-300 border-t border-white/5">
                      {currentSnapshot?.rainRadar.trackPhase === 'DRYING_LINE'
                        ? '⚠️ レコードラインのみ急速乾燥中。インターの熱ダレに注意。スリック履き替えはオーバーテイク時のオフライン濡れスリップとトレードオフ。'
                        : currentSnapshot?.rainRadar.trackPhase === 'WET' || currentSnapshot?.rainRadar.trackPhase === 'FLOODED'
                        ? '🌊 全面ウェット。アクアプレーニング多発。レコードライン外も大量の水たまりが存在。'
                        : currentSnapshot?.rainRadar.trackPhase === 'DAMP'
                        ? '🌧️ ダンプ路面。インターミディエイトが最も安定してラップタイムを刻める状態。'
                        : '☀️ 完全ドライ。スリックタイヤのグリップが100%発揮されます。'}
                    </p>
                  </div>
                </div>

                {/* 3. Real-time Incident & Safety Car Dynamic Risk Gauge */}
                <div className="glass-card-premium p-4 rounded-2xl border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-racing text-sm font-bold text-white flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 text-rose-400" /> INCIDENT & SC RISK GAUGE
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        currentSnapshot?.rainRadar.incidentRiskLevel === 'CRITICAL'
                          ? 'bg-red-600 text-white animate-pulse'
                          : currentSnapshot?.rainRadar.incidentRiskLevel === 'HIGH'
                          ? 'bg-amber-600 text-white'
                          : currentSnapshot?.rainRadar.incidentRiskLevel === 'ELEVATED'
                          ? 'bg-yellow-500 text-slate-950 font-bold'
                          : 'bg-emerald-950 text-emerald-300'
                      }`}
                    >
                      {currentSnapshot?.rainRadar.incidentRiskLevel}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900 border border-white/10 space-y-2.5 text-xs">
                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-slate-400">リアルタイム SC出動確率:</span>
                        <span
                          className={`font-mono font-bold ${
                            currentSnapshot?.rainRadar.incidentRiskPercent! > 30 ? 'text-red-400' : 'text-emerald-400'
                          }`}
                        >
                          {currentSnapshot?.rainRadar.incidentRiskPercent}% / lap
                        </span>
                      </div>
                      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${
                            currentSnapshot?.rainRadar.incidentRiskPercent! >= 50
                              ? 'bg-red-500 animate-pulse'
                              : currentSnapshot?.rainRadar.incidentRiskPercent! >= 25
                              ? 'bg-amber-500'
                              : 'bg-emerald-500'
                          }`}
                          style={{
                            width: `${currentSnapshot?.rainRadar.incidentRiskPercent || 5}%`,
                          }}
                        />
                      </div>
                    </div>

                    <div className="space-y-1 text-[11px] text-slate-300">
                      <div className="flex justify-between">
                        <span className="text-slate-400">路面悪化ハザード:</span>
                        <span className="font-mono">
                          {currentSnapshot?.rainRadar.waterDepthMm! > 3.0
                            ? '🚨 ハイドロプレーニング危険極大'
                            : currentSnapshot?.rainRadar.waterDepthMm! > 1.0
                            ? '⚠️ 制動距離増大・スリップ注意'
                            : '🟢 通常制動グリップ'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">タイヤ不適合車リスク:</span>
                        <span className="font-mono">
                          {currentSnapshot?.rainRadar.waterDepthMm! >= 1.0 &&
                          currentSnapshot?.cars.some((c) => c.tyreCompound === 'SOFT' || c.tyreCompound === 'MEDIUM')
                            ? '🚨 スリック装着車走行中 (高スピン率)'
                            : '🟢 全車天候適合タイヤ'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 4. Compound Crossover Predictor */}
                <div className="glass-card-premium p-4 rounded-2xl border border-white/10 space-y-3">
                  <span className="font-racing text-sm font-bold text-white flex items-center gap-2">
                    <Gauge className="w-4 h-4 text-emerald-400" /> TYRE CROSSOVER BENCHMARK
                  </span>

                  <div className="space-y-2 text-xs">
                    {/* Slick */}
                    <div
                      className={`p-2 rounded-xl border flex justify-between items-center ${
                        currentSnapshot?.rainRadar.crossover.slickViable
                          ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                          : 'bg-slate-900/50 border-white/5 text-slate-500'
                      }`}
                    >
                      <span className="font-racing font-bold">SLICK (0.0〜0.8mm)</span>
                      <span className="font-mono text-[11px]">
                        {currentSnapshot?.rainRadar.crossover.slickViable ? '✅ 推奨・最速' : '❌ スピン危機'}
                      </span>
                    </div>

                    {/* Inter */}
                    <div
                      className={`p-2 rounded-xl border flex justify-between items-center ${
                        currentSnapshot?.rainRadar.crossover.interViable
                          ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                          : 'bg-slate-900/50 border-white/5 text-slate-500'
                      }`}
                    >
                      <span className="font-racing font-bold">INTERMEDIATE (0.8〜4.0mm)</span>
                      <span className="font-mono text-[11px]">
                        {currentSnapshot?.rainRadar.crossover.interViable ? '✅ 推奨・最適' : '未達/熱ダレ'}
                      </span>
                    </div>

                    {/* Full Wet */}
                    <div
                      className={`p-2 rounded-xl border flex justify-between items-center ${
                        currentSnapshot?.rainRadar.crossover.wetViable
                          ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                          : 'bg-slate-900/50 border-white/5 text-slate-500'
                      }`}
                    >
                      <span className="font-racing font-bold">FULL WET (4.0mm以上)</span>
                      <span className="font-mono text-[11px]">
                        {currentSnapshot?.rainRadar.crossover.wetViable ? '✅ 推奨・最速' : '未達'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ══ MONITOR 4: TEAM STRATEGY & DOUBLE-STACK DYNAMICS ══ */}
            {activeMonitor === 'team' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Teammate Status Card */}
                <div className="glass-card-premium p-4 rounded-2xl border border-white/10 space-y-3">
                  <div className="flex justify-between items-center pb-2 border-b border-white/10">
                    <span className="font-racing text-sm font-bold text-white flex items-center gap-2">
                      <Users className="w-4 h-4 text-emerald-400" /> TEAMMATE OVERVIEW
                    </span>
                    <span className="text-xs font-racing font-bold text-emerald-400">
                      {activeScenario.teammateConfig.name} (#{activeScenario.teammateConfig.number})
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900 border border-white/10 space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">チームメイト順位:</span>
                      <span className="font-racing font-bold text-white">
                        P{teammateCar?.position || 4}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-slate-400">あなたとのタイム差:</span>
                      <span className="font-mono font-bold text-white">
                        {teammateCar && playerCar
                          ? `${(teammateCar.cumulativeTime - playerCar.cumulativeTime).toFixed(1)}秒`
                          : '0.0s'}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-slate-400">タイヤ装着状況:</span>
                      <span className="font-mono font-bold text-amber-400">
                        {teammateCar?.tyreCompound} (摩耗 {teammateCar?.tyreWearPercent}%)
                      </span>
                    </div>
                  </div>

                  {/* Double Stack Risk Warning */}
                  {currentSnapshot?.teammateStatus?.doubleStackRisk && (
                    <div className="p-3 rounded-xl bg-red-950/80 border-2 border-red-500/70 text-xs text-red-200 space-y-1">
                      <div className="font-racing font-bold flex items-center gap-1.5 text-white">
                        <AlertCircle className="w-4 h-4 text-red-400" /> ダブルスタック待機リスク警告！
                      </div>
                      <p className="text-[11px] leading-relaxed">
                        今周回で2台同時にピットインした場合、後続車に約+4.5秒のピットボックス待機ロスが発生します。ピットを1周ずらすか、順位を考慮して優先順位を決断してください！
                      </p>
                    </div>
                  )}
                </div>

                {/* Team Orders Command Panel */}
                <div className="glass-card-premium p-4 rounded-2xl border border-white/10 space-y-3">
                  <span className="font-racing text-sm font-bold text-white flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-yellow-400" /> チームオーダー指示 (TEAM ORDERS)
                  </span>

                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={() => handleTeamOrder('swap')}
                      className={`w-full p-3 rounded-xl border text-left text-xs transition-all flex justify-between items-center ${
                        activeTeamOrder === 'swap'
                          ? 'bg-emerald-950/80 border-emerald-500 text-white shadow-lg'
                          : 'bg-slate-900 hover:bg-slate-800 border-white/10 text-slate-300'
                      }`}
                    >
                      <div>
                        <div className="font-racing font-bold">🔄 順位入替 (Swap Positions)</div>
                        <div className="text-[10px] text-slate-400">
                          タイヤ戦略が有利なドライバーを先行させる
                        </div>
                      </div>
                      {activeTeamOrder === 'swap' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleTeamOrder('defend')}
                      className={`w-full p-3 rounded-xl border text-left text-xs transition-all flex justify-between items-center ${
                        activeTeamOrder === 'defend'
                          ? 'bg-amber-950/80 border-amber-500 text-white shadow-lg'
                          : 'bg-slate-900 hover:bg-slate-800 border-white/10 text-slate-300'
                      }`}
                    >
                      <div>
                        <div className="font-racing font-bold">🛡️ 後続ブロック (Hold Up Rival)</div>
                        <div className="text-[10px] text-slate-400">
                          相方に後続ライバルを抑え込ませ、タイム差を広げる
                        </div>
                      </div>
                      {activeTeamOrder === 'defend' && <CheckCircle2 className="w-4 h-4 text-amber-400" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleTeamOrder('none')}
                      className={`w-full p-3 rounded-xl border text-left text-xs transition-all flex justify-between items-center ${
                        activeTeamOrder === 'none'
                          ? 'bg-slate-800 border-white/30 text-white'
                          : 'bg-slate-900 hover:bg-slate-800 border-white/10 text-slate-400'
                      }`}
                    >
                      <div>
                        <div className="font-racing font-bold">🏁 自由競争 (Normal Racing)</div>
                        <div className="text-[10px] text-slate-400">チームオーダーなしで自由に競わせる</div>
                      </div>
                      {activeTeamOrder === 'none' && <CheckCircle2 className="w-4 h-4 text-slate-300" />}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ══ MONITOR 5: DRIVER RADIO & COMMS TIMELINE ══ */}
            {activeMonitor === 'radio' && (
              <div className="glass-card-premium p-4 rounded-2xl border border-white/10 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-racing text-sm font-bold text-white flex items-center gap-2">
                    <Radio className="w-4 h-4 text-rose-400" /> LIVE TEAM RADIO & BROADCAST LOGS
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    最新 {currentSnapshot?.commentaryFeed.length || 0} 件
                  </span>
                </div>

                <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                  {currentSnapshot?.commentaryFeed.map((msg) => (
                    <div
                      key={msg.id}
                      className={`p-2.5 rounded-xl text-xs font-mono leading-relaxed ${
                        msg.type === 'incident'
                          ? 'bg-red-950/60 border border-red-500/40 text-red-200'
                          : msg.type === 'radio'
                          ? 'bg-amber-950/40 border border-amber-500/30 text-amber-200'
                          : 'bg-slate-900/80 border border-white/5 text-slate-300'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1 text-[10px] text-slate-400 font-racing">
                        <span>{msg.speaker}</span>
                        <span>LAP {msg.lap}</span>
                      </div>
                      <div>{msg.text}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── BOTTOM TACTICAL COMMAND DOCK (Always Visible) ── */}
          <div className="p-3 sm:p-4 rounded-2xl bg-slate-950/90 border border-white/10 shadow-2xl backdrop-blur-md space-y-3">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              {/* Lap playback controls */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setChallengeLap((l) => Math.max(1, l - 1))}
                  disabled={challengeLap <= 1}
                  className="btn-console text-xs px-2.5 py-1.5 disabled:opacity-30"
                >
                  ◀ 1周戻る
                </button>

                <button
                  type="button"
                  onClick={() => setChallengePlaying(!challengePlaying)}
                  className={`btn-console px-4 py-1.5 text-xs flex items-center gap-1.5 font-racing font-bold ${
                    challengePlaying ? 'bg-amber-600 text-white' : 'btn-console-primary'
                  }`}
                >
                  {challengePlaying ? (
                    <>
                      <Pause className="w-3.5 h-3.5" /> PAUSE
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5" /> {challengeLap >= activeScenario.totalLaps ? 'REPLAY' : 'AUTO PLAY'}
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setAutoPauseAlert(null);
                    setChallengeLap((l) => Math.min(activeScenario.totalLaps, l + 1));
                  }}
                  disabled={challengeLap >= activeScenario.totalLaps}
                  className="btn-console-primary text-xs px-3.5 py-1.5 font-racing font-bold flex items-center gap-1.5 disabled:opacity-30 shadow-md"
                  title="自分のペースで1周ずつ確認しながら進めます"
                >
                  1周進める ▶
                </button>

                {/* Playback speed */}
                <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-lg border border-white/10 text-[10px] font-racing">
                  {[
                    { val: 0.5, label: '🐢 0.5x (8秒)' },
                    { val: 1, label: '🏎️ 1x (5.5秒)' },
                    { val: 2, label: '⚡ 2x (2.8秒)' },
                    { val: 5, label: '⏩ 5x (1.2秒)' },
                  ].map((spd) => (
                    <button
                      key={spd.val}
                      type="button"
                      onClick={() => setPlaybackSpeed(spd.val)}
                      className={`px-2 py-1 rounded ${
                        playbackSpeed === spd.val
                          ? 'bg-red-600 text-white font-bold'
                          : 'text-slate-400 hover:text-white'
                      }`}
                      title={`1周あたりの自動進行時間: ${spd.label}`}
                    >
                      {spd.label}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={resetGameState}
                  className="btn-console text-xs px-2 py-1.5 text-slate-400 hover:text-white"
                  title="リセット"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Lap Progress bar */}
              <div className="flex-1 max-w-xs hidden md:block">
                <div className="flex justify-between text-[10px] font-mono text-slate-400 mb-1">
                  <span>START</span>
                  <span className="text-white font-bold flex items-center gap-1.5">
                    <span>LAP {challengeLap} / {activeScenario.totalLaps}</span>
                    {challengePlaying && (
                      <span className="text-[10px] text-amber-300 font-mono">
                        (次周まで {(lapTimeRemainingMs / 1000).toFixed(1)}s)
                      </span>
                    )}
                  </span>
                  <span>FLAG</span>
                </div>
                <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-white/10">
                  <div
                    className="h-full bg-gradient-to-r from-red-600 to-rose-500 transition-all duration-300"
                    style={{
                      width: `${(challengeLap / activeScenario.totalLaps) * 100}%`,
                    }}
                  />
                </div>
              </div>

              {/* Action Buttons: BOX NOW, PU MODE, ERS */}
              <div className="flex flex-wrap items-center gap-2">
                {/* Compound choice dropdown */}
                <select
                  value={nextCompoundChoice}
                  onChange={(e) => handleCompoundChange(e.target.value as TyreCompound)}
                  className="bg-slate-900 border border-white/20 text-white text-xs font-racing font-bold px-2 py-1.5 rounded-xl cursor-pointer"
                >
                  <option value="SOFT">🔴 SOFT</option>
                  <option value="MEDIUM">🟡 MEDIUM</option>
                  <option value="HARD">⚪ HARD</option>
                  <option value="INTER">🟢 INTER</option>
                  <option value="WET">🔵 WET</option>
                </select>

                {/* BOX NOW Toggle */}
                <button
                  type="button"
                  onClick={handleToggleBoxNextLap}
                  className={`px-4 py-1.5 rounded-xl text-xs font-racing font-bold transition-all shadow-md ${
                    boxQueuedForNextLap
                      ? 'bg-gradient-to-r from-emerald-600 to-green-600 text-white border border-emerald-400 ring-2 ring-emerald-500/50'
                      : 'bg-gradient-to-r from-red-600 to-rose-600 text-white border border-red-500/50 hover:brightness-110'
                  }`}
                >
                  {boxQueuedForNextLap ? '✅ BOX ORDERED' : '🛞 BOX THIS LAP'}
                </button>

                {/* PU Mode Toggle */}
                <button
                  type="button"
                  onClick={() => {
                    const next =
                      activePuMode === 'push'
                        ? 'standard'
                        : activePuMode === 'standard'
                        ? 'conserve'
                        : 'push';
                    handlePuModeChange(next);
                  }}
                  className={`btn-console text-xs px-3 py-1.5 ${
                    activePuMode === 'push'
                      ? 'bg-rose-950 border-rose-500 text-rose-300'
                      : activePuMode === 'conserve'
                      ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                      : ''
                  }`}
                >
                  PU: {activePuMode.toUpperCase()}
                </button>

                {/* ERS Boost Toggle */}
                <button
                  type="button"
                  onClick={handleToggleErs}
                  className={`btn-console text-xs px-3 py-1.5 ${
                    ersBoostUsedThisLap
                      ? 'bg-cyan-950 border-cyan-500 text-cyan-300 ring-1 ring-cyan-500'
                      : ''
                  }`}
                >
                  🚀 ERS BOOST
                </button>
              </div>
            </div>
          </div>

          {/* ── RESULT & FULL F1 DEBRIEF CONSOLE (SCORE + ARCHETYPE + BADGES + LIBRARY) ── */}
          {tacticalScore && (
            <div className="p-5 rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-red-950/50 border-2 border-red-500/60 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-400">
              
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
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                  <div className="p-3 rounded-2xl bg-slate-900 border border-white/10 text-center">
                    <div className="text-slate-400 text-[10px] font-mono">ライセンス等級</div>
                    <div className="font-racing font-bold text-amber-300 text-sm mt-0.5">
                      GRADE {careerData.grade}
                    </div>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-900 border border-white/10 text-center">
                    <div className="text-slate-400 text-[10px] font-mono">累積 Command Points</div>
                    <div className="font-racing font-bold text-white text-sm mt-0.5">
                      {careerData.totalCp} CP
                    </div>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-900 border border-white/10 text-center">
                    <div className="text-slate-400 text-[10px] font-mono">総参戦レース / 勝利</div>
                    <div className="font-racing font-bold text-emerald-400 text-sm mt-0.5">
                      {careerData.totalRacesCompleted}戦 / {careerData.totalWins}勝
                    </div>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-900 border border-white/10 text-center">
                    <div className="text-slate-400 text-[10px] font-mono">獲得称号</div>
                    <div className="font-racing font-bold text-rose-400 text-sm mt-0.5">
                      {careerData.unlockedBadgeIds.length} / {F1_BADGES_CATALOG.length}
                    </div>
                  </div>
                </div>

                {/* All Badges Museum list */}
                <div className="space-y-2 pt-2">
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
        </div>
    </div>
  );
}
