/**
 * lib/types.ts
 * F1 Telemetry Analyzer - Core TypeScript Type Definitions
 *
 * Mirrors the data shapes returned by the OpenF1 API and consumed
 * by the legacy app.js. Strict types enable safe component props
 * and API response parsing throughout the Next.js migration.
 */

// ─────────────────────────────────────────────────────────────
// OpenF1 API Base Types
// ─────────────────────────────────────────────────────────────

/** A Formula 1 meeting (Grand Prix weekend) */
export interface Meeting {
  meeting_key: number;
  meeting_name: string;
  meeting_official_name: string;
  location: string;
  country_name: string;
  date_start: string; // ISO 8601
  year: number;
  circuit_short_name?: string;
}

/** A session within a meeting (Race, Qualifying, FP1–3, Sprint etc.) */
export interface Session {
  session_key: number;
  session_name: string;
  session_type: string;
  meeting_key: number;
  meeting_name?: string;
  meeting_official_name?: string;
  location?: string;
  date_start: string; // ISO 8601
  date_end?: string;
  year: number;
}

/** A driver entry for a specific session */
export interface Driver {
  driver_number: number;
  name_acronym: string;
  first_name: string;
  last_name: string;
  full_name: string;
  team_name: string;
  team_colour: string; // Hex string without '#' (e.g., "E80020")
  headshot_url?: string;
  country_code?: string;
}

/** A single lap record */
export interface Lap {
  lap_number: number;
  lap_duration: number | null; // seconds
  lap_time?: number | null;    // alias used in some mock data
  date_start: string;          // ISO 8601 timestamp of lap start
  duration_sector_1: number | null;
  duration_sector_2: number | null;
  duration_sector_3: number | null;
  speed_i1?: number | null; // Intermediate 1 speed (km/h)
  speed_i2?: number | null; // Intermediate 2 speed (km/h)
  speed_fl?: number | null; // Finish Line speed (km/h)
  speed_st?: number | null; // Speed Trap speed (km/h)
  is_pit_out_lap?: boolean;
  driver_number: number;
  session_key: number;
  // Merged fields added by enrichLapsWithStints:
  compound?: TyreCompound;
  tyreAge?: number;
  stintNumber?: number | string;
}

/** Sector best status for color highlighting */
export type SectorHighlight = 'purple' | 'green' | 'yellow' | 'none';

/** Driver sector summary metrics */
export interface DriverSectorSummary {
  driverNumber: string;
  driverName: string;
  driverAcronym: string;
  teamColour: string;
  bestS1: number | null;
  bestS2: number | null;
  bestS3: number | null;
  theoreticalBestLap: number | null; // Best S1 + Best S2 + Best S3
  actualBestLap: number | null;
  topSpeedST: number | null;
  topSpeedI1: number | null;
  topSpeedI2: number | null;
  topSpeedFL: number | null;
}

/** A tyre stint record */
export interface Stint {
  driver_number: number;
  stint_number: number;
  lap_start: number;
  lap_end: number | null;
  compound: string;              // Raw string from API (e.g., "SOFT")
  tyre_age_at_start: number;
  session_key?: number;
}

/** A team radio recording */
export interface TeamRadio {
  date: string;                  // ISO 8601
  recording_url: string;
  driver_number: number;
  session_key: number;
  // Pre-populated in mock data, resolved via Gemini in live mode:
  transcript?: string;           // English transcription
  translation?: string;          // Japanese translation
  aiSummary?: string;            // Strategic tactical context summary
  category?: RadioCategory;
  // Merged field added by mapRadioRecordingsToLaps:
  lap_number?: number | null;
}

/** Transcript cache record structure */
export interface RadioTranscriptData {
  transcript: string;
  translation: string;
  aiSummary?: string;
  category: string;
}

/** A pit stop record */
export interface PitStop {
  date: string;                  // ISO 8601
  lap_number: number;
  stop_duration: number;         // seconds stationary
  lane_duration: number;         // seconds total in pit lane
  driver_number: number;
  session_key: number;
}

/** An FIA Race Control message */
export interface RaceControlMessage {
  date: string;                  // ISO 8601
  lap_number: number | null;
  category: RaceControlCategory;
  message: string;
  flag: FlagColor | null;
  // Derived field:
  eventType?: 'fia';
}

/** A decoded safety car / VSC / red flag period derived from race control messages */
export interface SafetyCarPeriod {
  startLap: number;
  endLap: number | null;
  type: 'SC' | 'VSC' | 'RED';
}

// ─────────────────────────────────────────────────────────────
// Union / Enum-style string literals
// ─────────────────────────────────────────────────────────────

export type TyreCompound = 'SOFT' | 'MEDIUM' | 'HARD' | 'INTERMEDIATE' | 'WET' | 'UNKNOWN';

export type RadioCategory = 'PIT' | 'TYRE' | 'PACE' | 'SAFETY' | 'STRATEGY';

export type RaceControlCategory =
  | 'SafetyCar'
  | 'Drs'
  | 'Flag'
  | 'CarEvent'
  | 'SessionStatus'
  | 'Other';

export type FlagColor =
  | 'YELLOW'
  | 'DOUBLE YELLOW'
  | 'RED'
  | 'GREEN'
  | 'CHEQUERED'
  | 'BLACK AND WHITE'
  | 'BLACK'
  | 'BLUE';

export type ApiStatus = 'live' | 'demo' | 'warning' | 'error';

// ─────────────────────────────────────────────────────────────
// UI / State Types
// ─────────────────────────────────────────────────────────────

/** Aggregated application state shape (for future Zustand / Context migration) */
export interface AppState {
  selectedYear: string;
  selectedMeetingKey: number | null;
  selectedSessionKey: number | null;
  meetings: Meeting[];
  sessions: Session[];
  drivers: Driver[];
  stints: Stint[];
  selectedDrivers: string[];             // driver_number as strings
  lapsCache: Record<string, Lap[]>;
  teamRadioCache: Record<string, TeamRadio[]>;
  pitStopsCache: Record<string, PitStop[]>;
  raceControlMessages: RaceControlMessage[];
  safetyCarPeriods: SafetyCarPeriod[];
  isDemoMode: boolean;
  geminiApiKey?: string;
  activeTimelineFilter: RadioCategory | 'ALL' | 'FIA_EVENT';
  transcriptsCache: Record<string, { transcript: string; translation: string; category: RadioCategory }>;
}

/** Timeline event - union of radio, pit stop, and FIA event used in rendering */
export type TimelineEvent =
  | (TeamRadio & { eventType: 'radio' })
  | (PitStop & { eventType: 'pit' })
  | (RaceControlMessage & { eventType: 'fia' });

/** Chart.js data point shape for telemetry line chart */
export interface ChartDataPoint {
  x: number;   // lap_number
  y: number;   // lap_duration (seconds)
  compound: TyreCompound;
  tyreAge: number;
  s1: number | null;
  s2: number | null;
  s3: number | null;
}

/** Processed transcript result from Gemini or simulation */
export interface TranscriptResult {
  transcript: string;
  translation: string;
  category: RadioCategory;
}

/** Pit Strategy & Undercut Simulation Models */
export interface PitSimulationResult {
  driverNum: string;
  driverName: string;
  driverAcronym: string;
  teamColour: string;
  currentLap: number;
  currentPosition: number;
  predictedExitPosition: number;
  trafficStatus: 'CLEAN_AIR' | 'IN_TRAFFIC' | 'CLOSE_GAP';
  gapAheadSeconds: number | null;
  aheadDriverAcronym: string | null;
  gapBehindSeconds: number | null;
  behindDriverAcronym: string | null;
  undercutSuccessProb: number; // 0 - 100%
  overcutViability: 'HIGH' | 'MEDIUM' | 'LOW';
  freshTyreDeltaPerLap: number; // e.g. +1.4s
  pitLossSeconds: number; // e.g. 22.5s
  currentTyreCompound: TyreCompound;
  currentTyreAge: number;
  targetCompound: TyreCompound;
}

