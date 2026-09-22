'use client';

/**
 * components/hubs/race-simulator/types.ts
 * Type definitions for the Race Simulator Hub
 */

import type { TyreCompound } from '@/lib/raceSimulationEngine';

// Pure Pitwall Command Room Game
export type PitwallMonitor = 'all' | 'track' | 'timing' | 'thermals' | 'weather' | 'team' | 'radio';
export type GameMajorCategory = 'practice' | 'battle';
export type ChallengeModeType = 'crisis' | 'scenario' | 'sprint' | 'mission' | 'sandbox' | 'procedural';
export type SimulatorPhase = 'mode_select' | 'briefing' | 'race' | 'debrief';

export interface TacticalTimelineEvent {
  id: string;
  lap: number;
  timestamp: string;
  type: 'pu_mode' | 'pit_stop' | 'compound' | 'ers_boost' | 'radio' | 'team_order';
  icon: string;
  title: string;
  detail: string;
}

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

export interface RaceSimulatorHubProps {
  onOpenUpgradeModal?: () => void;
  onNavigateToLibrary?: (subTab: string, termId?: string) => void;
  onOpenAiStrategist?: () => void;
  standaloneMode?: boolean;
  onReturnToPortal?: () => void;
}

export type { BriefingHelpTopic } from '@/components/pitwall/BriefingSettingHelpModal';
