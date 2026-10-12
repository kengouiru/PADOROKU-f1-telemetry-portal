/**
 * data/f1KnowledgeData.ts
 * Master F1 Knowledge Base with Academic Primary Citations ([1]),
 * Telemetry Linking Metadata, Full 10 Teams, Key Drivers, and Iconic Circuits.
 */

export interface TyreKnowledge {
  id: string;
  name: string;
  color: string;
  code: string;
  description: string;
  workingRange: string;
  estimatedLaps: string;
  gripLevel: number;
  durabilityLevel: number;
}

export { TYRE_COMPOUNDS as KNOWLEDGE_TYRES } from './tyreEncyclopediaData';
export type { SeasonStoryline, Rivalry, DramaticMoment, PaddockRelationship } from './f1DramaData';
export {
  SEASON_STORYLINES as KNOWLEDGE_SEASON_STORIES,
  RIVALRIES as KNOWLEDGE_RIVALRIES,
  DRAMATIC_MOMENTS as KNOWLEDGE_DRAMA_MOMENTS,
  PADDOCK_DYNAMICS as KNOWLEDGE_PADDOCK_DYNAMICS,
} from './f1DramaData';
import type { DriverTraitId, DriverTraitDefinition, TraitTier, TraitCategory } from './driverTraitsData';
export type { DriverTraitId, DriverTraitDefinition, TraitTier, TraitCategory } from './driverTraitsData';
export { MASTER_TRAITS, DRIVER_TRAIT_ASSIGNMENTS, getDriverTraits } from './driverTraitsData';



export interface Reference {
  id: number;
  title: string;
  publisher: string;
  url: string;
  verifiedDate: string;
  type?: 'official' | 'press' | 'encyclopedia' | 'other';
  accessedDate?: string;
  archiveUrl?: string;
}

export interface TeamIconicCar {
  model: string;
  year: number;
  achievement: string;
  keyTech: string;
}

export interface TeamProfile {
  statsAsOf?: string;
  id: string;
  name: string;
  fullName: string;
  teamPrincipal: string;
  powerUnit: string;
  base: string;
  constructorTitles: number;
  championshipYears?: number[];
  drivers: string[]; // 3-letter codes
  color: string;
  structure?: {
    technicalDirector: string;
    aeroHead: string;
    facility: string;
  };
  iconicCars?: TeamIconicCar[];
  visualGallery?: VisualGalleryItem[];
  philosophy: {
    aeroFocus: string;
    mechanicalFocus: string;
    description: string;
  };
  references: Reference[];
}


export interface DriverMilestone {
  date: string;
  event: string;
  refId: number;
}

export interface IconicRace {
  gp: string;
  year: number;
  description: string;
  tacticalMasterclass: string;
}


export interface DriverVisualAsset {
  imageUrl: string;
  caption: string;
  credit: string;
  license: string;
  sourceUrl: string;
}

export interface VisualGalleryItem {
  imageUrl: string;
  caption: string;
  tag?: string; // e.g. "Portrait", "Action", "Podium", "Historic", "Track Map", "Panoramic"
  credit: string;
  license: string;
  sourceUrl: string;
}


export interface EngineeringPreference {
  setupBalance: string;
  pedalFeel: string;
  steeringWeight: string;
}

export interface RaceEngineer {
  name: string;
  callsign: string;
  dynamic: string;
}

export interface DriverSocialLinks {
  instagram?: string; // 公式Instagram URL (例: "https://www.instagram.com/maxverstappen1/")
  xTwitter?: string;  // 公式X (旧Twitter) URL
  website?: string;   // 公式個人Webサイト
}

export interface DriverSeasonHistory {
  year: number;             // 西暦 (2016〜2026)
  team: string;             // その年の正式/呼称チーム名 (例: "Scuderia Toro Rosso", "Red Bull Racing")
  teamId?: string;          // チーム系譜ID (例: "toro-rosso-rb", "red-bull", "williams", "alpine-renault", "sauber-audi")
  role: 'Regular' | 'Reserve' | 'Test' | 'Junior' | 'Other'; // レギュラー / リザーブ / テスト / ジュニア / その他（WEC等）
  carNumber?: number;       // その年のゼッケン
  finalPosition?: number;   // 選手権年間順位 (レギュラー時)
  points?: number;          // 獲得ポイント
  wins?: number;            // 勝利数
  podiums?: number;         // 表彰台数
  note?: string;            // 特記事項 (例: "シーズン途中昇格", "代役参戦で入賞")
}

export interface DriverProfile {
  statsAsOf?: string;
  id: string;
  code: string; // 3-letter e.g. "VER"
  number: number;
  fullName: string;
  country: string;
  team: string;
  teamColor: string;
  status: 'Current' | 'Legend' | 'Reserve';
  nickname: string;
  birthDate: string;
  birthPlace: string;
  f1Debut: string;
  driverType: string;
  numberOrigin: string;
  visualAsset?: DriverVisualAsset;
  visualGallery?: VisualGalleryItem[];
  engineeringPreference?: EngineeringPreference;
  raceEngineer?: RaceEngineer;
  socialLinks?: DriverSocialLinks;
  careerSummary: string;
  entries: number;
  wins: number;
  podiums: number;
  polePositions: number;
  championships: number;
  championshipYears?: number[];
  drivingStyle: {
    traits: string[];
    brakingTechnique: string;
    tyreManagement: string;
    telemetrySignature: string;
    preferredCircuitTypes: string[];
    summary: string;
  };
  biography: {
    personality: string;
    rivalries: string;
    iconicRaces: IconicRace[];
    quotes: string[];
    offTrack: string;
  };
  milestones: DriverMilestone[];
  references: Reference[];
  traitIds?: DriverTraitId[];
  seasonHistory?: DriverSeasonHistory[];
}

export interface TelemetryTarget {
  year: number;
  meetingKey?: number;
  sessionKey?: number;
  meetingName?: string;
  targetLap?: number;
  targetDriver?: string;
  targetDriver2?: string;
}

export interface EmbeddedRadio {
  id: string;
  lap: string;
  speaker: 'DRIVER' | 'PIT WALL';
  speakerName: string;
  transcript: string;
  translation: string;
  strategicContext: string;
  audioUrl?: string;
}

export interface KeyCorner {
  number: string;
  name: string;
  characteristic: string;
}

export interface CircuitCornerDetail {
  number: string;
  name: string;
  gearEstimated: string;
  speedEstimated: string;
  engineeringTip: string;
}

export interface TrackGeometry {
  elevationChangeMeters: number;
  longestStraightMeters: number;
  gForceMax: { lateral: number; longitudinal: number };
  keyCorners: KeyCorner[];
}

export interface CircuitVisualAsset {
  imageUrl: string;
  credit: string;
  license: string;
  sourceUrl: string;
  caption?: string;
}

export interface CircuitHistoricalMoment {
  year: number;
  title: string;
  description: string;
  detailedStory?: string;
  significance: string;
  historicalImpact?: string;
  momentImage?: CircuitVisualAsset;
}

export interface CircuitOfficialLinks {
  website?: string;     // 公式サーキットWebサイト
  f1Official?: string;  // Formula1.com 公式サーキットガイド
  googleMaps?: string;  // Googleマップ 所在地
  xTwitter?: string;    // 公式X (旧Twitter)
  instagram?: string;   // 公式Instagram
}

export interface CircuitVisualMap {
  imageUrl: string;
  credit: string;
  license: string;
  sourceUrl: string;
}

export interface CircuitProfile {
  id: string;
  name: string;
  officialName: string;
  country: string;
  lengthKm: number;
  turns: number;
  drsZones: number;
  downforceLevel: 'High' | 'Medium-High' | 'Medium' | 'Low';
  tyreStress: 'Very High' | 'High' | 'Medium-High' | 'Medium' | 'Low';
  typicalPitLossSec: number;
  safetyCarProbability?: string;
  undercutImpact?: string;
  lapRecord: {
    time: string;
    driver: string;
    year: number;
  };
  characteristics: string;
  officialLinks?: CircuitOfficialLinks;
  visualMap?: CircuitVisualMap;
  visualAssets?: {
    trackMap: CircuitVisualAsset;
    atmosphereImage?: CircuitVisualAsset;
  };
  visualGallery?: VisualGalleryItem[];
  trackGeometry?: TrackGeometry;
  allCorners?: CircuitCornerDetail[];
  historicalMoments?: CircuitHistoricalMoment[];
  setupNotes?: {
    aeroTradeoff: string;
    kerbUsage: string;
    brakeDemands: string;
  };
  telemetrySession?: TelemetryTarget;
  references: Reference[];
}




export interface StrategyConcept {
  id: string;
  title: string;
  category: 'TIRE_DEG' | 'PIT_STRATEGY' | 'AERO_GROUND_EFFECT' | 'FIA_SAFETY_CAR';
  subtitle: string;
  description: string;
  keyTakeaways: string[];
  keyRadios?: EmbeddedRadio[];
  telemetrySession?: TelemetryTarget;
  references: Reference[];
}

export interface HistoryArchive {
  id: string;
  year: number;
  grandPrix: string;
  title: string;
  subtitle: string;
  strategicNarrative: string;
  outcome: string;
  keyRadios?: EmbeddedRadio[];
  telemetrySession?: TelemetryTarget;
  references: Reference[];
}

// ─────────────────────────────────────────────────────────────
// 1. ALL 11 CONSTRUCTOR TEAMS (2026 Grid)
// ─────────────────────────────────────────────────────────────
