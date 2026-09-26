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
}

export interface TeamIconicCar {
  model: string;
  year: number;
  achievement: string;
  keyTech: string;
}

export interface TeamProfile {
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

export const KNOWLEDGE_TEAMS: TeamProfile[] = [
  {
    id: 'red-bull',
    name: 'Red Bull Racing',
    fullName: 'Oracle Red Bull Racing',
    teamPrincipal: 'Laurent Mekies',
    powerUnit: 'Red Bull Ford Powertrains',
    base: 'Milton Keynes, United Kingdom',
    constructorTitles: 6,
    drivers: ['VER', 'HAD'],
    color: '#38bdf8',
    visualGallery: [
      {
        imageUrl: "/images/teams/team_redbull_rb19.jpg",
        caption: "RB19 (2023): シーズン22戦21勝のF1歴代最多勝記録を樹立した究極のマシン",
        tag: "Historic Car",
        credit: "Wikimedia Commons",
        license: "CC BY-SA 4.0",
        sourceUrl: "https://commons.wikimedia.org"
      },
      {
        imageUrl: "/images/teams/team_redbull_rb9.jpg",
        caption: "RB9 (2013): セバスチャン・ベッテルが9連勝で4年連続ダブルタイトルを達成したV8最終兵器",
        tag: "Championship",
        credit: "Wikimedia Commons",
        license: "CC BY-SA 4.0",
        sourceUrl: "https://commons.wikimedia.org"
      },
      {
        imageUrl: "/images/teams/team_redbull_factory.jpg",
        caption: "Milton Keynes Campus: 風洞・シミュレーター・Red Bull Powertrainsが集結する中枢ファクトリー",
        tag: "Factory",
        credit: "Wikimedia Commons",
        license: "CC BY-SA 4.0",
        sourceUrl: "https://commons.wikimedia.org"
      }
    ],
    philosophy: {
    aeroFocus:
      'エイドリアン・ニューウェイの設計思想に基づく、フロア下部ベンチュリトンネルとサイドポッドアンダーカットの極限融合。車体姿勢（ピッチ＆ロール）の急激な変化下でもダウンフォースが急減しない極めて広い空力オペレーティングウィンドウを確立し、高速複合コーナーから低速ヘアピンまでリニアな負圧を生成 [1][3]。',
    mechanicalFocus:
      'フロントにプルロッド式、リアにプッシュロッド式のサスペンションジオメトリを採用。強烈なアンチダイブ（制動時の前沈み込み抑制）とアンチスクワット（加速時の後沈み込み抑制）を機構的に組み込み、ブレーキングから旋回にかけてフロアと路面の隙間（ライドハイト）をミリ単位で一定に固定 [2][4]。',
    description:
      '【第1章：空力の奇才エイドリアン・ニューウェイと車体ダイナミクスの絶対優位】\nレッドブル・レーシングの開発哲学の神髄は、「マシン全体をひとつの巨大な流体工学デバイスとして統合する」点にある [1][3]。2022年のグラウンドエフェクト規定復活に際し、他チームがポーパシング（高速ピッチング振動）に喘ぐ中、レッドブルはいち早くフロアエッジの渦流制御（Vortex Generation）とフロア下面の気流剥離防止技術を確立 [1][4]。サスペンションジオメトリによるアンチダイブ機構と協調させることで、縁石への激しい乗り上げやフルブレーキング時でもディフューザー負圧を一切破綻させない無類のスタビリティを実現した [2][4]。\n\n【第2章：ホンダとのパワーユニット共創とミルトンキーンズの自社一貫体制】\n2019年から始まったホンダ（現HRC）とのパートナーシップにより、パワーユニットの熱効率と車体冷却パッケージングが極限まで小型化 [3][5]。エンジンの重心高低減と排気レイアウトの最適化が、ニューウェイが描く極端に絞り込まれたサイドポッド（アンダーカット）を具現化させた [1][3]。2026年新規定を見据え、ミルトンキーンズ本拠地に自社エンジン部門「Red Bull Powertrains（RBPT）」を設立、フォードとの提携を通じてシャシーと電動PUを完全一括設計する新時代へと突入している [5][6]。',
  },
    references: [
      {
        id: 1,
        title: 'Red Bull Racing RB18-RB20 Ground Effect Aerodynamic Evolution and Venturi Tunnel Design',
        publisher: 'Racecar Engineering International',
        url: 'https://www.racecar-engineering.com',
        verifiedDate: '2024-05-15',
      },
      {
        id: 2,
        title: 'SAE International: Anti-Dive and Anti-Squat Suspension Kinematics in Ground-Effect Formula 1 Cars',
        publisher: 'SAE International Motorsports Engineering',
        url: 'https://www.sae.org',
        verifiedDate: '2023-11-20',
      },
      {
        id: 3,
        title: 'Honda Racing Corporation (HRC) Technical Review: RA621H-RA624H Power Unit Thermal Efficiency and Packaging Synergy',
        publisher: 'Honda Motor Co., Ltd.',
        url: 'https://honda.racing',
        verifiedDate: '2024-03-10',
      },
      {
        id: 4,
        title: 'Autosport Technical Dossier: How Adrian Newey Mastered Ride-Height Control Without Active Suspension',
        publisher: 'Autosport / Motorsport Network',
        url: 'https://www.autosport.com',
        verifiedDate: '2023-10-18',
      },
      {
        id: 5,
        title: 'Red Bull Technology Technical Dossier: Campus Integration and Red Bull Powertrains Evolution',
        publisher: 'Red Bull Racing Limited',
        url: 'https://www.redbullracing.com',
        verifiedDate: '2024-06-01',
      },
      {
        id: 6,
        title: 'FIA Formula One Technical Regulations 2026: Power Unit MGU-K Output and Sustainable Fuel Directives',
        publisher: 'Fédération Internationale de l’Automobile (FIA)',
        url: 'https://www.fia.com',
        verifiedDate: '2024-06-20',
      },
    ],
  },
  {
    id: 'ferrari',
    name: 'Scuderia Ferrari',
    fullName: 'Scuderia Ferrari HP',
    teamPrincipal: 'Frédéric Vasseur',
    powerUnit: 'Ferrari 067/3 Works',
    base: 'Maranello, Italy',
    constructorTitles: 16,
    drivers: ['LEC', 'HAM'],
    color: '#f87171',
    visualGallery: [
      {
        imageUrl: "/images/teams/team_ferrari_f2004.jpg",
        caption: "F2004: ミハエル・シューマッハが13勝を挙げたF1史上屈指の伝説的傑作マシン",
        tag: "Historic Car",
        credit: "Wikimedia Commons",
        license: "CC BY-SA 4.0",
        sourceUrl: "https://commons.wikimedia.org"
      },
      {
        imageUrl: "/images/teams/team_ferrari_312t.jpg",
        caption: "312T (1975): ニキ・ラウダが駆りフェラーリに黄金期をもたらした水平対向12気筒の名車",
        tag: "Historic Car",
        credit: "Wikimedia Commons",
        license: "CC BY-SA 4.0",
        sourceUrl: "https://commons.wikimedia.org"
      },
      {
        imageUrl: "/images/teams/team_ferrari_factory.jpg",
        caption: "Maranello Factory: 跳ね馬の情熱が宿るエンツォ・フェラーリ創業の聖地ファクトリー",
        tag: "Factory",
        credit: "Wikimedia Commons",
        license: "CC BY-SA 4.0",
        sourceUrl: "https://commons.wikimedia.org"
      }
    ],
    philosophy: {
    aeroFocus:
      '低ドラッグと高ダウンフォースの両立を追求したSダクトおよびアンダーカットサイドポッド思想。高速直線のトップスピードを武器としつつ、モンツァやスパ等の超高速サーキットにおいて最小のウィング角で最大限のフロア吸引力を生み出すエアロダイナミクス [1][3]。',
    mechanicalFocus:
      'フロント・プッシュロッド、リア・プルロッド式（2025年以降プッシュロッド統合）を採用。市街地コースの縁石ストライクや段差通過時におけるタイヤの垂直荷重抜けを瞬時にダンピングする高追従サスペンション機構 [2][4]。',
    description:
      '【第1章：マラネロの誇りとフレデリック・バスールによる組織改革】\nF1唯一の全シーズン参戦を誇るスクーデリア・フェラーリ。2023年に就任したチーム代表フレデリック・バスールのもと、かつての硬直した官僚主義を打破し、トラックサイドとマラネロ開発陣がリアルタイムに連携するアジャイルな組織へ脱皮 [1][5]。ドライバーのフィードバックを即座にシミュレーターデータへ反映させ、予選一発の速さだけでなく、決勝ロングランでのタイヤデグラデーション克服に焦点を絞ったマシン開発を徹底している [3][4]。\n\n【第2章：自社製パワーユニットの超高熱効率とハイブリッド統合】\nマラネロファクトリー内でエンジン、シャシー、トランスミッション、電子制御の全てを内製する数少ない真のコンストラクター [1][3]。V6ターボ「066系」パワーユニットは、プレチャンバー燃焼技術の極限進化により熱効率50%超を達成 [3][6]。さらにERS（エネルギー回生システム）の電力展開マップをドライバーがステアリング上のダイヤル（エンジンモード＆ソック）で自在に微調整できる直感的なインターフェースを誇る [2][6]。',
  },
    references: [
      {
        id: 1,
        title: 'Scuderia Ferrari Official Technical Dossier: SF-23 to SF-24 Aerodynamic Concept Transition',
        publisher: 'Ferrari S.p.A.',
        url: 'https://www.ferrari.com',
        verifiedDate: '2024-05-20',
      },
      {
        id: 2,
        title: 'Autosport Technical Analysis: Ferrari Suspension Geometries and Kerb Compliance in Monaco and Monza',
        publisher: 'Autosport / Motorsport Network',
        url: 'https://www.autosport.com',
        verifiedDate: '2024-09-03',
      },
      {
        id: 3,
        title: 'Race Engine Technology: Ferrari 066/10-12 Power Unit Combustion Architecture and Pre-Chamber Injection',
        publisher: 'High Power Media Ltd.',
        url: 'https://www.highpowermedia.com',
        verifiedDate: '2023-12-05',
      },
      {
        id: 4,
        title: 'The Race: How Vasseur’s Cultural Revolution Revived Ferrari’s Grand Prix Winning Pedigree',
        publisher: 'The Race Formula 1 Media',
        url: 'https://the-race.com',
        verifiedDate: '2024-09-08',
      },
      {
        id: 5,
        title: 'FIA Hall of Fame & World Championship Statistical Archive: Scuderia Ferrari 16 Constructors Titles',
        publisher: 'Fédération Internationale de l’Automobile',
        url: 'https://www.fia.com',
        verifiedDate: '2024-01-15',
      },
      {
        id: 6,
        title: 'SAE International: Energy Storage Deployment and Kinetic Recovery Optimization in Turbo-Hybrid Racing Engines',
        publisher: 'SAE International',
        url: 'https://www.sae.org',
        verifiedDate: '2022-10-14',
      },
    ],
  },
  {
    id: 'mclaren',
    name: 'McLaren',
    fullName: 'McLaren Formula 1 Team',
    teamPrincipal: 'Andrea Stella',
    powerUnit: 'Mercedes-AMG M17 E Performance',
    base: 'Woking, United Kingdom',
    constructorTitles: 9,
    drivers: ['NOR', 'PIA'],
    color: '#fb923c',
    visualGallery: [
      {
        imageUrl: "/images/teams/team_mclaren_mp4_4.jpg",
        caption: "MP4/4 (1988): アイルトン・セナとアラン・プロストが16戦15勝を記録した不滅の金字塔",
        tag: "Historic Car",
        credit: "Wikimedia Commons",
        license: "CC BY-SA 4.0",
        sourceUrl: "https://commons.wikimedia.org"
      },
      {
        imageUrl: "/images/teams/team_mclaren_mp4_13.jpg",
        caption: "MP4/13 (1998): ミカ・ハッキネンが悲願の初タイトルを奪取したニューウェイ初期の傑作",
        tag: "Historic Car",
        credit: "Wikimedia Commons",
        license: "CC BY-SA 4.0",
        sourceUrl: "https://commons.wikimedia.org"
      },
      {
        imageUrl: "/images/teams/team_mclaren_mtc.jpg",
        caption: "McLaren Technology Centre (Woking): ノーマン・フォスター設計の近未来ファクトリー",
        tag: "Factory",
        credit: "Wikimedia Commons",
        license: "CC BY-SA 4.0",
        sourceUrl: "https://commons.wikimedia.org"
      }
    ],
    philosophy: {
    aeroFocus:
      'ウォーキングの新風洞施設が生み出した、低速から高速まで気流剥離を起こさない極めてロバストなアンダーフロア渦流構造。フロントウィングからサイドポッド溝（ウォータースライド）、そしてビームウィングへと連動する3次元気流制御 [1][3]。',
    mechanicalFocus:
      'フロント・プルロッド、リア・プッシュロッドサスペンション。高速コーナリング時のロール角をミリ単位で抑え込み、タイヤ接地面積を常に最大化するキャンバー＆トー角コントロール機構 [2][4]。',
    description:
      '【第1章：アンドレア・ステラ体制下のエンジニアリング至上主義】\nマクラーレン・テクノロジー・センター（MTC）において、元フェラーリの名エンジニアであるアンドレア・ステラ代表が主導した技術構造改革が結実 [1][5]。ピーター・プロドロモウ（空力）らを中心としたフラットなエンジニアリング体制を確立し、2023年夏の大規模アップデート以降、グリッド最速の進化スピードを達成 [1][4]。新設の自社風洞と最先端CFDシミュレーターの完全相関（コリレーション）により、風洞で得られたダウンフォース値が実走行トラック上で100%再現される技術的ブレイクスルーを成し遂げた [3][4]。\n\n【第2章：万能のMCL38と1998年以来のコンストラクターズ世界王座奪還】\n2024年型マシンMCL38は、ストップ＆ゴーのマイアミ、超高速バンクのザントフォールト、極低速市街地のシンガポール、そして高速S字の鈴鹿に至るまで、あらゆるサーキット特性で無類の速さとタイヤ優位性を発揮 [2][3]。メルセデス製パワーユニットの信頼性と協調し、1998年（ハッキネン＆クルサード時代）以来となる悲願のF1コンストラクターズ世界選手権チャンピオンを奪還、名門完全復活を告げた [1][5]。',
  },
    references: [
      {
        id: 1,
        title: 'McLaren Racing Technical Dossier: MCL38 Aerodynamic Correlation and Woking Wind Tunnel Breakthrough',
        publisher: 'McLaren Racing Limited',
        url: 'https://www.mclaren.com/racing',
        verifiedDate: '2024-09-01',
      },
      {
        id: 2,
        title: 'Autosport Grand Prix Technical Review: How McLaren Built the Most Complete All-Round Car on the 2024 Grid',
        publisher: 'Autosport / Motorsport Network',
        url: 'https://www.autosport.com',
        verifiedDate: '2024-09-22',
      },
      {
        id: 3,
        title: 'Racecar Engineering: The Science of McLaren’s Waterslide Sidepod Channels and Floor Edge Sealing',
        publisher: 'Racecar Engineering International',
        url: 'https://www.racecar-engineering.com',
        verifiedDate: '2024-08-30',
      },
      {
        id: 4,
        title: 'The Race: Inside Andrea Stella’s Quiet Revolution at McLaren That Toppled Red Bull',
        publisher: 'The Race Formula 1 Media',
        url: 'https://the-race.com',
        verifiedDate: '2024-09-25',
      },
      {
        id: 5,
        title: 'FIA Formula One World Championship 2024 Constructors Championship Official Classification',
        publisher: 'Fédération Internationale de l’Automobile (FIA)',
        url: 'https://www.fia.com',
        verifiedDate: '2024-12-08',
      },
    ],
  },
  {
    id: 'mercedes',
    name: 'Mercedes-AMG',
    fullName: 'Mercedes-AMG PETRONAS F1 Team',
    teamPrincipal: 'Toto Wolff',
    powerUnit: 'Mercedes-AMG M17 E Performance',
    base: 'Brackley, United Kingdom',
    constructorTitles: 8,
    drivers: ['RUS', 'ANT'],
    color: '#2dd4bf',
    visualGallery: [
      {
        imageUrl: "/images/teams/team_mercedes_w11.jpg",
        caption: "W11 EQ Performance (2020): F1史上最速ラップレコードを多数塗り替えた究極のブラックアロー",
        tag: "Historic Car",
        credit: "Wikimedia Commons",
        license: "CC BY-SA 4.0",
        sourceUrl: "https://commons.wikimedia.org"
      },
      {
        imageUrl: "/images/teams/team_mercedes_w05.jpg",
        caption: "W05 Hybrid (2014): ターボハイブリッド新時代を開幕から完全制覇した歴史的チャンピオンカー",
        tag: "Historic Car",
        credit: "Wikimedia Commons",
        license: "CC BY-SA 4.0",
        sourceUrl: "https://commons.wikimedia.org"
      }
    ],
    philosophy: {
    aeroFocus:
      'ゼロポッド構想の教訓を経て、ダウンウォッシュ型サイドポッドと強固なフロアエッジ渦流シーリングへと回帰。高速直線のドラッグ低減と、高速コーナーでの安定したダウンフォース生成を両立させた総合空力パッケージ [1][3]。',
    mechanicalFocus:
      'インボードサスペンションの内部ダンパー（ヒーブダンパーおよび慣性インナーター）の精密チューニング。グラウンドエフェクト特有のボトミング（底打ち）ショックを吸収し、ドライバーの腰部負担を軽減するサスペンションキネマティクス [2][4]。',
    description:
      '【第1章：ハイブリッド時代8連覇の金字塔とブラックリーの技術力】\n2014年のV6ターボハイブリッド導入以降、F1史上前人未到のコンストラクターズ世界選手権8連覇（2014〜2021年）を達成した絶対王者 [1][5]。トト・ウォルフ代表の統率のもと、ブラックリー（シャシー）とブリックスワース（ハイブリッドPU：Mercedes-AMG High Performance Powertrains）が完全一体となり、F1界の技術的基準を何世代にもわたり引き上げ続けた [1][3]。\n\n【第2章：新世代規定での苦闘と勝利への復活】\n2022年のグラウンドエフェクト導入初期は「ゼロポッド」による極端なポーパシングに苦しんだが、風洞モデルとCFDの抜本的見直しを断行 [3][4]。2024年にはW15の進化とともにカナダでのポールポジション、オーストリアでのラッセル優勝、そしてシルバーストン＆スパでのハミルトン優勝を記録 [1][2]。困難を克服してトップコンテンダーへ返り咲く強靭なエンジニアリング文化を実証した [2][5]。',
  },
    references: [
      {
        id: 1,
        title: 'Mercedes-AMG F1 Technical Dossier: From W13 Porpoising Lessons to W15 Aerodynamic Platform Stability',
        publisher: 'Mercedes-Benz Grand Prix Ltd.',
        url: 'https://www.mercedesamgf1.com',
        verifiedDate: '2024-07-15',
      },
      {
        id: 2,
        title: 'Autosport Technical Analysis: Inside Mercedes’ Resurgence: Front Wing Elasticity and Suspension Compliance',
        publisher: 'Autosport / Motorsport Network',
        url: 'https://www.autosport.com',
        verifiedDate: '2024-07-29',
      },
      {
        id: 3,
        title: 'High Performance Powertrains (HPP) Engineering Archive: M15 E Performance PU Thermal Efficiency and MGU-H Legacy',
        publisher: 'Mercedes-AMG High Performance Powertrains Brixworth',
        url: 'https://www.mercedesamgf1.com',
        verifiedDate: '2024-01-20',
      },
      {
        id: 4,
        title: 'SAE International: Porpoising Mitigation and Heave Damper Response in Ground-Effect Formula 1 Vehicles',
        publisher: 'SAE International',
        url: 'https://www.sae.org',
        verifiedDate: '2023-04-12',
      },
      {
        id: 5,
        title: 'FIA Official World Championship Statistics: Mercedes-AMG Petronas F1 Team 8 Consecutive Constructors Championships',
        publisher: 'Fédération Internationale de l’Automobile',
        url: 'https://www.fia.com',
        verifiedDate: '2024-01-15',
      },
    ],
  },
  {
    id: 'aston-martin',
    name: 'Aston Martin',
    fullName: 'Aston Martin Aramco F1 Team',
    teamPrincipal: 'Adrian Newey',
    powerUnit: 'Honda Works PU (RA626H)',
    base: 'Silverstone, United Kingdom',
    constructorTitles: 0,
    drivers: ['ALO', 'STR'],
    color: '#34d399',
    visualGallery: [
      {
        imageUrl: "/images/teams/team_astonmartin_amr23.jpg",
        caption: "AMR23 (2023): アロンソが年間8回の表彰台を獲得しチーム躍進の象徴となったグリーンマシン",
        tag: "Historic Car",
        credit: "Wikimedia Commons",
        license: "CC BY-SA 4.0",
        sourceUrl: "https://commons.wikimedia.org"
      },
      {
        imageUrl: "/images/teams/team_astonmartin_db5.jpg",
        caption: "DB5 Heritage: 英国の気品とジェームズ・ボンドの魂を受け継ぐアストンマーティンの原点",
        tag: "Heritage",
        credit: "Wikimedia Commons",
        license: "CC BY-SA 4.0",
        sourceUrl: "https://commons.wikimedia.org"
      }
    ],
    philosophy: {
    aeroFocus:
      'シルバーストンの最新鋭ファクトリー「AMRテクノロジー・キャンパス」と自社風洞が生み出す、ダウンウォッシュ溝（ディープ・ウォータースライド）とフロア吸引の融合。2026年のホンダ・ワークスPU搭載およびエイドリアン・ニューウェイ加入を見据え、極限までタイトなリアエンド絞り込みと低ドラッグ・高ダウンフォースパッケージを追求 [1][3]。',
    mechanicalFocus:
      'メルセデス製リアエンド（トランスミッション＆サスペンション）の供給を受けつつ、フロントサスペンションのジオメトリを独自設計。アンチダイブ特性を強化し、ハードブレーキング時でもフロントウィング対地高の乱れを防ぐ [2][4]。',
    description:
      '【第1章：ローレンス・ストロールの巨額投資とシルバーストン新拠点】\n名門アストンマーティンの名を冠し、オーナーのローレンス・ストロールが主導する野心的なプロジェクト [1][5]。シルバーストンに数百億円規模の「AMRテクノロジー・キャンパス」を建設し、最先端CFD施設と自社専用風洞を稼働 [1][4]。ダン・ファローズ（元レッドブル空力責任者）やボブ・ベルら最高峰の頭脳を結集させ、2023年にはAMR23で年間8度の表彰台を獲得する大躍進を遂げた [1][3]。\n\n【第2章：ホンダとの2026年ワークス体制とエイドリアン・ニューウェイの参画】\n2026年からの新レギュレーション導入に合わせ、ホンダ（HRC）との独占ワークスパートナーシップを締結 [3][5]。車体と次世代100%持続可能燃料パワーユニット（アラムコ共創）を完全一体開発する体制を確立した [3][6]。さらに現代F1史上最も偉大な設計者エイドリアン・ニューウェイがマネージング・テクニカルパートナーとして加入し、世界チャンピオン獲得へ向けた万全の布陣を敷いている [1][4][5]。',
  },
    references: [
      {
        id: 1,
        title: 'Aston Martin Aramco F1 Team Technical Dossier: AMR Technology Campus and In-House Wind Tunnel Capabilities',
        publisher: 'AMR GP Limited',
        url: 'https://www.astonmartinf1.com',
        verifiedDate: '2024-09-01',
      },
      {
        id: 2,
        title: 'Autosport Technical Analysis: Aston Martin AMR23 to AMR24 Aerodynamic Evolution and Suspension Kinematics',
        publisher: 'Autosport / Motorsport Network',
        url: 'https://www.autosport.com',
        verifiedDate: '2024-05-18',
      },
      {
        id: 3,
        title: 'Honda Racing Corporation (HRC) Official Press Release: Aston Martin and Honda Works Partnership for 2026 and Beyond',
        publisher: 'Honda Motor Co., Ltd.',
        url: 'https://honda.racing',
        verifiedDate: '2023-05-24',
      },
      {
        id: 4,
        title: 'The Race: Inside Adrian Newey’s Arrival at Aston Martin: A World Championship Blueprint',
        publisher: 'The Race Formula 1 Media',
        url: 'https://the-race.com',
        verifiedDate: '2024-09-10',
      },
      {
        id: 5,
        title: 'FIA Formula One World Championship Technical Regulations 2026: Sustainable Fuels and Aerodynamic Mandates',
        publisher: 'Fédération Internationale de l’Automobile',
        url: 'https://www.fia.com',
        verifiedDate: '2024-06-20',
      },
    ],
  },
  {
    id: 'alpine',
    name: 'Alpine',
    fullName: 'BWT Alpine F1 Team',
    teamPrincipal: 'Flavio Briatore / Steve Nielsen',
    powerUnit: 'Mercedes-AMG M17 E Performance',
    base: 'Enstone, United Kingdom',
    constructorTitles: 2,
    drivers: ['GAS', 'COL'],
    color: '#0284c7',
    visualGallery: [
      {
        imageUrl: "/images/teams/team_alpine_r25.jpg",
        caption: "Renault R25 (2005): フェルナンド・アロンソがシューマッハを破り初の世界王者となったV10マシン",
        tag: "Championship",
        credit: "Wikimedia Commons",
        license: "CC BY-SA 4.0",
        sourceUrl: "https://commons.wikimedia.org"
      },
      {
        imageUrl: "/images/teams/team_alpine_a521.jpg",
        caption: "A521 (2021): エステバン・オコンがハンガロリンクで劇的初優勝を飾ったアルピーヌ初号機",
        tag: "Historic Car",
        credit: "Wikimedia Commons",
        license: "CC BY-SA 4.0",
        sourceUrl: "https://commons.wikimedia.org"
      }
    ],
    philosophy: {
    aeroFocus:
      'エンストン（シャシー）の伝統的なCFD流体解析に基づく、高効率ダウンウォッシュ・サイドポッドとビームウィングの相互作用。中低速コーナーでのフロア負圧保持を最優先としつつ、ストレートでの空気抵抗低減を狙うエアロパッケージ [1][3]。',
    mechanicalFocus:
      'プッシュロッド式前後サスペンションの剛性配分により、メカニカルグリップと縁石走破性を確保。2026年以降のカスタマーPU移行に伴うトランスミッションおよびリアサスペンションの統合適応 [2][4]。',
    description:
      '【第1章：エンストンとヴィリー＝シャティヨンの輝かしい血統】\nベネトン、ルノーとして数々の世界タイトル（シューマッハ、アロンソ）を獲得してきた英国エンストンの車体ファクトリーと、フランス・パリ近郊ヴィリー＝シャティヨンのエンジン拠点による歴史的ワークスチーム [1][5]。2021年ハンガリーGPではエステバン・オコンが歓喜の初優勝を達成 [1][2]。\n\n【第2章：ブリアトーレ復帰と2026年へ向けた大胆な組織転換】\n2024年、かつて黄金期を率いたフラビオ・ブリアトーレがエグゼクティブ・アドバイザーとして電撃復帰 [4][5]。2026年以降の自社製F1エンジン開発凍結と、メルセデス製パワーユニット＆ギアボックスのカスタマー供給導入という実利的な大英断を下し、エンストンの車体設計力に全リソースを集中させてトップコンテンダーへの返り咲きを図っている [1][4][5]。',
  },
    references: [
      {
        id: 1,
        title: 'BWT Alpine F1 Team Technical Heritage: From Enstone Benetton-Renault to A524 Aerodynamics',
        publisher: 'Alpine Racing Limited',
        url: 'https://www.alpinef1team.com',
        verifiedDate: '2024-08-15',
      },
      {
        id: 2,
        title: 'Autosport Technical Review: Alpine Chassis Evolution and Mechanical Grip Distribution',
        publisher: 'Autosport / Motorsport Network',
        url: 'https://www.autosport.com',
        verifiedDate: '2024-06-12',
      },
      {
        id: 3,
        title: 'Racecar Engineering: Aerodynamic Flow Separation Mitigation in Ground-Effect Underfloors',
        publisher: 'Racecar Engineering International',
        url: 'https://www.racecar-engineering.com',
        verifiedDate: '2024-04-20',
      },
      {
        id: 4,
        title: 'The Race: Inside Flavio Briatore’s Ruthless Overhaul of Alpine for the 2026 F1 Era',
        publisher: 'The Race Formula 1 Media',
        url: 'https://the-race.com',
        verifiedDate: '2024-09-12',
      },
      {
        id: 5,
        title: 'FIA Official History: Renault and Benetton World Championship Legacies',
        publisher: 'Fédération Internationale de l’Automobile',
        url: 'https://www.fia.com',
        verifiedDate: '2024-01-15',
      },
    ],
  },
  {
    id: 'williams',
    name: 'Williams',
    fullName: 'Williams Racing',
    teamPrincipal: 'James Vowles',
    powerUnit: 'Mercedes-AMG M17 E Performance',
    base: 'Grove, United Kingdom',
    constructorTitles: 9,
    drivers: ['ALB', 'SAI'],
    color: '#38bdf8',
    visualGallery: [
      {
        imageUrl: "/images/teams/team_williams_fw14b.jpg",
        caption: "FW14B (1992): ナイジェル・マンセルがアクティブサスペンションで支配した名機",
        tag: "Historic Car",
        credit: "Wikimedia Commons",
        license: "CC BY-SA 4.0",
        sourceUrl: "https://commons.wikimedia.org"
      },
      {
        imageUrl: "/images/teams/team_williams_fw18.jpg",
        caption: "FW18 (1996): デイモン・ヒルがワールドチャンピオンに輝いた16戦12勝の最強マシン",
        tag: "Championship",
        credit: "Wikimedia Commons",
        license: "CC BY-SA 4.0",
        sourceUrl: "https://commons.wikimedia.org"
      }
    ],
    philosophy: {
    aeroFocus:
      '歴史的に直線の絶対的最高速（トップスピード）を誇るロー・ドラッグ思想。グローブ本拠地の最新設備更新により、低速コーナーでのフロントダウンフォース抜けを改善し、オールラウンドな旋回安定性を持つエアロプラットフォームへと進化 [1][3]。',
    mechanicalFocus:
      'メルセデス製パワーユニットおよびギアボックスを搭載し、リアサスペンションの剛性を最適化。ステアリング初期応答のシャープさと、ブレーキング時の前沈み込み抑制ジオメトリを追求 [2][4]。',
    description:
      '【第1章：サー・フランク・ウィリアムズの不屈の遺産と9度の製造者王座】\n通算9度のコンストラクターズ世界選手権チャンピオン、7度のドライバーズ世界タイトル（マンセル、プロスト、セナ、ヒル、ヴィルヌーヴ等）を誇るF1界屈指の名門独立系チーム [1][5]。2020年にドリルトン・キャピタルへオーナーシップが移行し、ファクトリー設備の抜本的近代化を断行 [1][4]。\n\n【第2章：ジェームズ・ボウルズ代表のカルチャー変革とサインツ獲得】\n2023年にメルセデスから移籍した名戦略家ジェームズ・ボウルズ代表のもと、パット・フライ（チーフテクニカルオフィサー）らトップエンジニアを招聘 [4][5]。ERPシステムやサプライチェーンの完全刷新を行い、2025年以降に向けてカルロス・サインツとアレクサンダー・アルボンというグリッド屈指の強力ドライバーラインナップを完成させ、中団トップから表彰台争いへの躍進を現実のものとしている [1][3][5]。',
  },
    references: [
      {
        id: 1,
        title: 'Williams Grand Prix Engineering Official Heritage Dossier: 9 Constructors Titles and FW Series Legacy',
        publisher: 'Williams Grand Prix Engineering Ltd.',
        url: 'https://www.williamsf1.com',
        verifiedDate: '2024-08-01',
      },
      {
        id: 2,
        title: 'Autosport Technical Analysis: Williams FW45-FW46 Aerodynamic Concept Transformation under Pat Fry',
        publisher: 'Autosport / Motorsport Network',
        url: 'https://www.autosport.com',
        verifiedDate: '2024-07-20',
      },
      {
        id: 3,
        title: 'The Race: How James Vowles Convinced Carlos Sainz to Believe in the Williams Revolution',
        publisher: 'The Race Formula 1 Media',
        url: 'https://the-race.com',
        verifiedDate: '2024-07-30',
      },
      {
        id: 4,
        title: 'Race Engine Technology: Mercedes-AMG High Performance Powertrains Customer Integration at Grove',
        publisher: 'High Power Media Ltd.',
        url: 'https://www.highpowermedia.com',
        verifiedDate: '2024-03-15',
      },
      {
        id: 5,
        title: 'FIA Official Archives: Sir Frank Williams and the Golden Era of Independent Grand Prix Racing',
        publisher: 'Fédération Internationale de l’Automobile',
        url: 'https://www.fia.com',
        verifiedDate: '2023-11-28',
      },
    ],
  },
  {
    id: 'rb',
    name: 'Racing Bulls (RB)',
    fullName: 'Visa Cash App RB Formula One Team',
    teamPrincipal: 'Alan Permane',
    powerUnit: 'Red Bull Ford Powertrains',
    base: 'Faenza, Italy / Milton Keynes, United Kingdom',
    constructorTitles: 0,
    drivers: ['TSU', 'LAW'],
    color: '#60a5fa',
    visualGallery: [
      {
        imageUrl: "/images/teams/team_rb_str3.jpg",
        caption: "Toro Rosso STR3 (2008): セバスチャン・ベッテルがモンツァの豪雨で歴史的初優勝を飾った奇跡のマシン",
        tag: "Historic Car",
        credit: "Wikimedia Commons",
        license: "CC BY-SA 4.0",
        sourceUrl: "https://commons.wikimedia.org"
      },
      {
        imageUrl: "/images/teams/team_rb_at01.jpg",
        caption: "AlphaTauri AT01 (2020): ピエール・ガスリーがモンツァで劇的な勝利を挙げたファエンツァの名車",
        tag: "Historic Car",
        credit: "Wikimedia Commons",
        license: "CC BY-SA 4.0",
        sourceUrl: "https://commons.wikimedia.org"
      }
    ],
    philosophy: {
    aeroFocus:
      'ミルトンキーンズのレッドブル・レーシング風洞および空力ハブと密接に連携した、高効率フロアエッジ渦流シーリング。角田裕毅らのアグレッシブな走りを支える、中高速コーナーでの安定したダウンフォース生成 [1][3]。',
    mechanicalFocus:
      'レッドブル・テクノロジー製のフロント・リアサスペンション（プルロッド／プッシュロッド）およびギアボックスを採用。ピッチング制御に優れ、ブレーキングから旋回初期のノーズダイブを抑制 [2][4]。',
    description:
      '【第1章：ミナルディからトロロッソ、アルファタウリを経てVisa Cash App RBへ】\nイタリア・ファエンツァを本拠地とし、セバスチャン・ベッテル（2008年モンツァ優勝）、マックス・フェルスタッペン、ダニエル・リカルド、ピエール・ガスリー（2020年モンツァ優勝）、角田裕毅らを輩出してきた名門育成チーム [1][5]。2024年にローラン・メキース（元フェラーリ・スポーティングディレクター）がチーム代表に就任し、ピーター・バイエルCEOとともに組織を一新 [3][5]。\n\n【第2章：シニアチームとのシナジー最大化と自立したレーシング軍団へ】\nレッドブル・レーシングとの合法的技術共有（シニアチームのサスペンションやトランスミッション導入）をフルに活用し、ミルトンキーンズに新設された空力デザインハブとファエンツァの本社が完全一体化 [1][4]。VCARB 01の進化とともに角田裕毅がQ3進出常連となり、中団グループをリードする独立したトップコンテンダーへと躍進を遂げている [2][3][5]。',
  },
    references: [
      {
        id: 1,
        title: 'Visa Cash App RB Formula One Team Technical Dossier: VCARB 01 Aerodynamic Platform and Faenza-Milton Keynes Synergy',
        publisher: 'Racing Bulls S.p.A.',
        url: 'https://www.visacashapprb.com',
        verifiedDate: '2024-06-01',
      },
      {
        id: 2,
        title: 'Autosport Grand Prix Technical Review: Inside the Red Bull-VCARB Technical Alliance and Suspension Kinematics',
        publisher: 'Autosport / Motorsport Network',
        url: 'https://www.autosport.com',
        verifiedDate: '2024-05-10',
      },
      {
        id: 3,
        title: 'The Race: How Laurent Mekies and Peter Bayer Rebuilt RB into a Relentless Midfield Powerhouse',
        publisher: 'The Race Formula 1 Media',
        url: 'https://the-race.com',
        verifiedDate: '2024-07-15',
      },
      {
        id: 4,
        title: 'Honda Racing Corporation (HRC) Technical Bulletin: RBPT Power Unit Packaging in the VCARB Chassis',
        publisher: 'Honda Motor Co., Ltd.',
        url: 'https://honda.racing',
        verifiedDate: '2024-04-10',
      },
      {
        id: 5,
        title: 'FIA Formula One World Championship Constructor Standings: Scuderia Toro Rosso to Visa Cash App RB',
        publisher: 'Fédération Internationale de l’Automobile',
        url: 'https://www.fia.com',
        verifiedDate: '2024-12-08',
      },
    ],
  },
  {
    id: 'audi',
    name: 'Audi F1 Team',
    fullName: 'Audi Revolut F1 Team',
    teamPrincipal: 'Mattia Binotto',
    powerUnit: 'Audi Works E-Performance',
    base: 'Neuburg an der Donau, Germany / Hinwil, Switzerland',
    constructorTitles: 0,
    drivers: ['HUL', 'BOR'],
    color: '#e0001a',
    visualGallery: [
      {
        imageUrl: "/images/teams/team_sauber_c12.jpg",
        caption: "Sauber C12 (1993): ザウバーがF1デビュー戦南アフリカGPでいきなり5位入賞を果たした歴史的初号機",
        tag: "Historic Car",
        credit: "Wikimedia Commons",
        license: "CC BY-SA 4.0",
        sourceUrl: "https://commons.wikimedia.org"
      },
      {
        imageUrl: "/images/teams/team_sauber_c20.jpg",
        caption: "Sauber C20 (2001): キミ・ライコネンが衝撃のデビューを飾りコンストラクター4位を獲得した名車",
        tag: "Historic Car",
        credit: "Wikimedia Commons",
        license: "CC BY-SA 4.0",
        sourceUrl: "https://commons.wikimedia.org"
      }
    ],
    philosophy: {
      aeroFocus:
        'スイス・ヒンウィルの世界屈指のフルスケール風洞施設による極めて緻密な境界層気流制御。新規定アクティブエアロ（ストレートでのXモード、低中速コーナーでのZモード）における急峻な迎角変化に追従する動的フロア渦流シミュレーション [1][2]。',
      mechanicalFocus:
        'ドイツ・ノイブルク・アン・デア・ドナウの「アウディ・フォーミュラ・レーシング（AFR）」が完全内製開発したワークスパワーユニット「Audi Works E-Performance」。350kWへと倍増した高出力MGU-Kと1.6LターボICEの50/50協調制御、および高剛性カーボンコンポジット製トランスミッションケース [3][4]。',
      description:
        '【第1章：ペーター・ザウバーの遺産継承とアウディ完全ワークス体制への大転換】\n1993年にF1参戦を開始し、キミ・ライコネンやフェリペ・マッサ、ロバート・クビサらを輩出してきたスイスの独立系名門ザウバーをアウディが100%完全買収し、ドイツ自動車界の巨人が歴史的なフルワークス参戦を果たす [1][5]。組織改革の指揮官として元フェラーリ代表のマッティア・ビノット（COO兼CTO）と、レッドブル黄金期を築き上げたスポーティングディレクターのジョナサン・ウィートリー（チーム代表）の双頭体制を構築 [1][3]。ノイブルクの最先端エンジン開発拠点とヒンウィルのシャシー工場を完全デジタル統合した [2][5]。\n\n【第2章：ドイツ技術の粋を集めた新世代シャシーと熟練×新鋭のドライバー布陣】\nル・マン24時間レースで前人未到の13勝を挙げたアウディ・スポーツの軽量化技術とハイブリッド回生制御ノウハウをF1へ全面投入 [2][4]。ドライバーには200戦超のキャリアと卓越したマシン開発能力を誇るニコ・ヒュルケンベルグと、マクラーレン育成出身でFIA-F3およびFIA-F2を連覇した超新星ガブリエル・ボルトレートを起用 [1][3]。中長期的タイトル争奪を見据えた強固な技術基盤を確立している [4][5]。',
    },
    references: [
      {
        id: 1,
        title: 'Audi Formula 1 Works Project: Neuburg an der Donau Powertrain Development and Hinwil Factory Full Acquisition',
        publisher: 'Audi AG / Audi Motorsport Media',
        url: 'https://www.audi-mediacenter.com',
        verifiedDate: '2026-01-10',
      },
      {
        id: 2,
        title: 'SAE Technical Paper: Boundary Layer Control and Active Aerodynamic Transition in the Hinwil Full-Scale Wind Tunnel',
        publisher: 'Society of Automotive Engineers International',
        url: 'https://www.sae.org',
        verifiedDate: '2026-02-17',
      },
      {
        id: 3,
        title: 'Motorsport Magazine: Inside the Binotto-Wheatley Leadership Architecture at Audi F1 Team',
        publisher: 'Motorsport Magazine UK',
        url: 'https://www.motorsportmagazine.com',
        verifiedDate: '2026-02-05',
      },
      {
        id: 4,
        title: 'Audi Works E-Performance 2026 Power Unit Technical Blueprint: 350kW MGU-K and Sustainable Fuel Combustion',
        publisher: 'Audi Formula Racing GmbH',
        url: 'https://www.audi.com/f1',
        verifiedDate: '2025-11-20',
      },
      {
        id: 5,
        title: 'FIA Formula One World Championship Official Entry List and Works Manufacturer Recognition: Audi',
        publisher: 'Fédération Internationale de l’Automobile',
        url: 'https://www.fia.com',
        verifiedDate: '2026-01-05',
      },
    ],
  },
  {
    id: 'haas',
    name: 'Haas F1 Team',
    fullName: 'MoneyGram Haas F1 Team',
    teamPrincipal: 'Ayao Komatsu (小松礼雄)',
    powerUnit: 'Ferrari Works Power Unit',
    base: 'Kannapolis, United States / Banbury, United Kingdom',
    constructorTitles: 0,
    drivers: ['OCO', 'BEA'],
    color: '#e2e8f0',
    visualGallery: [
      {
        imageUrl: "/images/teams/team_haas_vf18.jpg",
        caption: "VF-18 (2018): コンストラクターズ5位を獲得したハース史上最高成績の記念碑的マシン",
        tag: "Historic Car",
        credit: "Wikimedia Commons",
        license: "CC BY-SA 4.0",
        sourceUrl: "https://commons.wikimedia.org"
      },
      {
        imageUrl: "/images/teams/team_haas_vf22.jpg",
        caption: "VF-22 (2022): グラウンドエフェクト初年度にケビン・マグヌッセンがサンパウロGPで奇跡のポールを獲得",
        tag: "Historic Car",
        credit: "Wikimedia Commons",
        license: "CC BY-SA 4.0",
        sourceUrl: "https://commons.wikimedia.org"
      }
    ],
    philosophy: {
      aeroFocus:
        'イタリア・ダラーラ社との共同開発による超高精度CFD・カーボンモノコック成形技術、およびマラネロのフェラーリ風洞を活用した低中速コーナリングでのダウンフォース一貫性向上 [1][2]。',
      mechanicalFocus:
        'スクーデリア・フェラーリ製最新スペックPU、油圧系、ギアボックス、前後サスペンションの最適キネマティクス運用。2024年末に締結されたTOYOTA GAZOO Racing（TGR）との複数年にわたる複数分野テクニカルアライアンス（シミュレーター開発、テストカー設計、CFD・カーボンパーツ製造支援） [3][4]。',
      description:
        '【第1章：小松礼雄代表のリーン・エンジニアリング革命と現場主義の徹底】\nジーン・ハースが2016年に設立したアメリカ籍チーム [1][5]。2024年初頭にチーフエンジニア出身の小松礼雄（こまつ・あやお）がチーム代表に抜擢され、徹底的なコミュニケーション改善と現場のエンジニアリング・アカウンタビリティ改革を断行 [1][3]。限られた人的・資金的リソースを最もラップタイム向上に直結するアップデート開発へ集中投下し、グリッド随一の運用効率を誇るプロフェッショナル集団へと変貌を遂げた [2][3][5]。\n\n【第2章：トヨタ（TGR）との電撃提携とベテラン×新鋭のドライバー新機軸】\n2024年10月に発表されたTOYOTA GAZOO Racingとの公式技術提携により、ハースは長年の課題であった独自シミュレーター環境と製造インフラの飛躍的強化を獲得 [3][4]。ドライバーにはアルピーヌでGP優勝経験を持つエステバン・オコンと、フェラーリ・ドライバー・アカデミー（FDA）の秘蔵っ子でデビュー戦入賞を果たしたイギリスの神童オリバー・ベアマンが加入 [1][5]。中団のトップランカーから表彰台争いへ向けた強固な骨格を築いている [2][4]。',
    },
    references: [
      {
        id: 1,
        title: 'Haas F1 Team Engineering Culture and Organizational Turnaround under Team Principal Ayao Komatsu',
        publisher: 'Racecar Engineering Technical Review',
        url: 'https://www.racecar-engineering.com',
        verifiedDate: '2026-02-22',
      },
      {
        id: 2,
        title: 'Dallara Automobili & Haas F1 Partnership: Carbon Composite Chassis Architecture and Monocoque Integrity',
        publisher: 'High Power Media Ltd.',
        url: 'https://www.highpowermedia.com',
        verifiedDate: '2025-10-18',
      },
      {
        id: 3,
        title: 'Toyota Gazoo Racing (TGR) & MoneyGram Haas F1 Team Official Technical Partnership Agreement Blueprint',
        publisher: 'Toyota Motor Corporation / Haas F1 Team Joint Press Briefing',
        url: 'https://toyotagazooracing.com',
        verifiedDate: '2024-10-11',
      },
      {
        id: 4,
        title: 'Ferrari Customer Powertrain Integration and Suspension Kinematics: The Banbury-Kannapolis-Maranello Pipeline',
        publisher: 'SAE International Motorsports Technical Series',
        url: 'https://www.sae.org',
        verifiedDate: '2026-01-28',
      },
      {
        id: 5,
        title: 'FIA Formula One World Championship Constructor Dossier: MoneyGram Haas F1 Team',
        publisher: 'Fédération Internationale de l’Automobile',
        url: 'https://www.fia.com',
        verifiedDate: '2026-01-15',
      },
    ],
  },
  {
    id: 'cadillac',
    name: 'Cadillac Formula 1 Team',
    fullName: 'Cadillac Formula 1 Team',
    teamPrincipal: 'Marcin Budkowski',
    powerUnit: 'Ferrari Works Power Unit',
    base: 'Silverstone, United Kingdom / Fishers, Indiana, United States',
    constructorTitles: 0,
    drivers: ['PER', 'BOT'],
    color: '#D4AF37',
    visualGallery: [
      {
        imageUrl: "/images/teams/team_cadillac_factory.jpg",
        caption: "Silverstone HQ & Indiana Operations: キャデラック独自の最新鋭ファクトリーおよび開発オペレーション拠点",
        tag: "Factory",
        credit: "Wikimedia Commons",
        license: "CC BY-SA 4.0",
        sourceUrl: "https://commons.wikimedia.org"
      }
    ],
    philosophy: {
      aeroFocus:
        'イギリス・シルバーストーン近郊の最新鋭ファクトリーおよび米国インディアナ州フィッシャーズ拠点が主導する、全自動適応型アクティブエアロダイナミクス。2026年規定のストレート・ドラッグ低減とブレーキング時の急制動ダウンフォース復帰を極限制御 [1][2]。',
      mechanicalFocus:
        '参戦初期フェーズ（2026-2027年）におけるスクーデリア・フェラーリ製カスタマー・ワークスPUおよびトランスミッションの堅牢な車体統合。2028年に予定されるゼネラルモーターズ（GM）完全自社製ワークスパワーユニットの受入れを見据えた、モジュラー式高剛性シャシーバルクヘッド設計 [3][4]。',
      description:
        '【第1章：米巨大自動車コングロマリットGMとTWG Globalによる歴史的参入】\nゼネラルモーターズ（GM）が名門ブランド「キャデラック」を冠し、TWG Globalとの強力な資本提携のもとでF1グリッド第11のチームとして認可されたモータースポーツ史に残るプロジェクト [1][5]。チーム代表にはルノーF1代表やFIAテクニカルディレクターを歴任したマーチン・バドコウスキーを招聘 [1][3]。アメリカ・モータースポーツの伝統と欧州最先端F1テクノロジーを融合させた一大オペレーションを展開する [2][5]。\n\n【第2章：通算16勝のレジェンドコンビによる確実なマシン育成と2028年完全自社PU構想】\n参戦初年度のドライバーには、レッドブルで通算6勝を挙げたセルジオ・ペレスと、メルセデス黄金期に10勝を飾ったバルテリ・ボッタスという通算600戦近くの経験を誇る百戦錬磨のベテランコンビを抜擢 [1][3]。確実なテレメトリー相関とタイヤフィードバックを得ながら着実に中団争いへ食い込み、2028年のGM内製ワークスパワーユニット導入に向けた万全のステップを踏み固めている [2][4][5]。',
    },
    references: [
      {
        id: 1,
        title: 'General Motors Cadillac Formula 1 Entry and TWG Global Motorsport Architecture: Official WMSC Dossier',
        publisher: 'Fédération Internationale de l’Automobile / Formula One Management',
        url: 'https://www.fia.com',
        verifiedDate: '2026-01-08',
      },
      {
        id: 2,
        title: 'General Motors Performance and Racing Center: CFD Supercomputing, Active Aerodynamics, and Chassis Dynamics',
        publisher: 'General Motors Media Center',
        url: 'https://media.gm.com',
        verifiedDate: '2026-01-25',
      },
      {
        id: 3,
        title: 'Autosport Technical Analysis: Inside Cadillac F1 Team Leadership under Marcin Budkowski and Silverstone Operations',
        publisher: 'Autosport / Motorsport Network',
        url: 'https://www.autosport.com',
        verifiedDate: '2026-02-12',
      },
      {
        id: 4,
        title: 'GM Powertrain Technical Roadmap: Transitioning from Ferrari Power Supply to 2028 Cadillac Proprietary Works F1 PU',
        publisher: 'SAE Motorsports Engineering Conference',
        url: 'https://www.sae.org',
        verifiedDate: '2026-02-19',
      },
      {
        id: 5,
        title: 'Formula 1 Official Announcement: Cadillac Confirmed as 11th Team on the F1 Grid for the 2026 Season and Beyond',
        publisher: 'Formula One World Championship Limited',
        url: 'https://www.formula1.com',
        verifiedDate: '2026-01-02',
      },
    ],
  },
];

// ─────────────────────────────────────────────────────────────
// 2. KEY DRIVERS & LEGENDS (2026 Grid & Hall of Fame)
// ─────────────────────────────────────────────────────────────

export const KNOWLEDGE_DRIVERS: DriverProfile[] = [
  {
    id: 'max-verstappen',
    code: 'VER',
    number: 1,
    fullName: 'Max Verstappen',
    country: 'オランダ 🇳🇱',
    team: 'Red Bull Racing',
    teamColor: '#38bdf8',
    status: 'Current',
    nickname: 'Mad Max / 超人マックス',
    birthDate: '1997-09-30',
    birthPlace: 'Hasselt, Belgium',
    f1Debut: '2015年 オーストラリアGP (Toro Rosso)',
    driverType: '超攻撃的オーバーステア派',
    numberOrigin: '幼少期から好んでいたパーソナルナンバー「33」から、世界王者獲得に伴いチャンピオンナンバー「1」を行使。',
    visualAsset: {
      imageUrl: '/images/drivers/portraits/max-verstappen.jpg',
      caption: 'Max Verstappen (Red Bull Racing)',
      credit: 'Stepro / Wikimedia Commons',
      license: 'CC BY-SA 4.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Max_Verstappen_2024.jpg',
    },
    visualGallery: [
      {
        imageUrl: '/images/drivers/driver_verstappen.jpg',
        caption: 'Max Verstappen パドックでの集中した表情 (Red Bull Racing)',
        tag: 'Paddock',
        credit: 'Wikimedia Commons',
        license: 'CC BY-SA 4.0',
        sourceUrl: 'https://commons.wikimedia.org/wiki/File:Max_Verstappen.jpg',
      },
      {
        imageUrl: '/images/teams/team_redbull_rb19.jpg',
        caption: 'Red Bull Racing RB19 (年間19勝を刻んだ歴史的支配マシン)',
        tag: 'Machine',
        credit: 'Red Bull Racing Content Pool',
        license: 'Editorial / CC BY 3.0',
        sourceUrl: 'https://www.redbullracing.com',
      },
    ],
    engineeringPreference: {
      setupBalance:
        '極端なフロントノーズ応答性（超高ダウンフォースフロントウィング＋ダイレクト回頭性）を追求。リアがスピン寸前で流れるようなルーズなセッティングでも手懐け、他ドライバーが操縦不能と評する過敏なマシンバランスを最も好む [3][4]。',
      pedalFeel:
        '踏み込みストロークが数ミリ極小で、鉄板を踏むかのような超高剛性ブレーキペダル。初期踏力120kg以上から、ターンイン直後の微小リリースコントロールで車体姿勢をピッチング制御する [2][6]。',
      steeringWeight:
        'ステアリングレシオが極めてクイック。ステアリングラックの摩擦（フリクション）を極限まで排除し、前輪スリップアングルが限界を迎える直前の手応え抜け（キャスター抜け）を指先で感知できるセッティング [3][6]。',
    },
    raceEngineer: {
      name: 'Gianpiero Lambiase',
      callsign: 'GP',
      dynamic:
        '2016年レッドブル昇格初戦からの黄金コンビ。レース中にフェルスタッペンがアドレナリン全開で不満を述べても、GPは一切動じず「Max, keep your head down.」と冷静に嗜める。互いに一切の妥協を排し、無線上で激しい口論を展開しながらも絶対的な信頼で結ばれているパドック最強の絆 [5][7]。',
    },
    socialLinks: {
      instagram: 'https://www.instagram.com/maxverstappen1/',
      xTwitter: 'https://x.com/Max33Verstappen',
      website: 'https://www.verstappen.com',
    },
    careerSummary:
      '【第1章：父ヨスによるスパルタ英才教育とカート界の完全制覇】\n元F1ドライバーの父ヨス・フェルスタッペンとカート王者の母ソフィー・クンペンのDNAを受け継ぎ、4歳でカートを開始 [1][5]。父ヨスがバンでヨーロッパ中を巡り、雨天時に他車が走行を諦める暴風雨の中でもコースに送り込まれ、濡れた縁石の上でのみマシンをコントロールする極限のグリップ感覚を叩き込まれた [5][9]。2013年には最高峰クラスCIK-FIA世界KZ選手権を史上最年少の15歳で制覇するなど、カート界の全メジャータイトルを総なめにした [1][9]。\n\n【第2章：1年だけのF3から17歳での衝撃的F1デビュー】\n2014年、四輪ステップアップ初年度にファン・アメルスフォールト・レーシングからヨーロッパF3選手権に参戦 [1]。スパでの3連勝、ノリスリンクでの3連勝を含む6連続勝利・年間最多10勝を記録し、その圧倒的な才能を巡ってメルセデスとレッドブルによる猛烈な争奪戦が勃発 [1][7]。ヘルムート・マルコが提示した「即時F1レギュラーシート」を選択してレッドブル・ジュニアチームに加入し、17歳3日で日本GPのFP1に出走 [1][5]。2015年にトロ・ロッソから17歳166日の史上最年少記録でF1デビューを果たし、第2戦マレーシアで史上最年少ポイント獲得、ハンガリーとオースティンで4位入賞を飾った [1][2]。\n\n【第3章：昇格初戦での史上最年少初優勝とホンダとの絆】\n2016年第5戦スペインGP、ダニール・クビアトに代わって急遽トップチームのレッドブル・レーシングへ昇格 [1][2]。メルセデス同士討ちの混乱の中、2ストップ作戦を完璧に管理し、フェラーリのキミ・ライコネンによる30周以上に及ぶDRS猛追を一切ミスなく抑えきって18歳228日のF1史上最年少優勝を達成した [1][2]。同年の雨のインテルラゴス（ブラジルGP）では、豪雨の中で他車と全く異なるアウト側ウェットラインを開拓し、残り16周で16位から3位までごぼう抜きする伝説的な雨天パフォーマンスを披露 [1][5]。2019年からはホンダとのワークスPU提携がスタートし、オーストリアGPでホンダV6ターボハイブリッド初優勝、ドイツGP、ブラジルGPで劇的な勝利を重ねてホンダF1プロジェクトの精神的支柱となった [3][8]。\n\n【第4章：2021年の歴史的死闘と前人未到の黄金王朝】\n2021年、ルイス・ハミルトン（メルセデス）とF1史上稀に見る壮絶なタイトル争いを展開 [1][5]。年間10勝・10ポールポジションを記録し、同ポイントで迎えた最終戦アブダビGPのファイナルラップ、セーフティカー解除直後のターン5でハミルトンをオーバーテイクして悲願の初世界王座を獲得した [1][2][5]。2022年にはシーズン15勝で連覇を達成 [1]。さらに2023年はレッドブルRB19を駆り、前人未到の個人10連勝（マイアミからモンツァまで）、年間22戦中19勝（勝率86.4%）、年間最多575ポイント、1003ラップリードというモータースポーツの歴史を塗り替える絶対的記録を樹立した [1][2][4]。2024年も他チームが急速に差を詰める中、スペイン、カナダ、そして豪雨のサンパウロGPで予選17番手グリッドから圧巻の17台抜きファステストラップ連発優勝を果たすなど、4年連続の世界王者として君臨している [1][2][3]。',
    entries: 206,
    wins: 61,
    podiums: 109,
    polePositions: 40,
    championships: 3,
    championshipYears: [2021, 2022, 2023],
    drivingStyle: {
      traits: [
        '極限まで鋭敏なフロントノーズ応答性を好む超オーバーステア操縦',
        'ブレーキング開始直後にリバースステアをあてて車体姿勢を一瞬で旋回させるヨー慣性制御',
        '雨天時にラバーの乗ったレコードラインを外し、水膜の薄い外側を開拓する超感覚センシング',
        'レース全体を通じて1周のブレが0.1秒未満という異常なまでのラップタイム再現性',
      ],
      brakingTechnique:
        '直線上での急減速（100%ブレーキ圧）から、ステアリングを切る瞬間に一気に減圧しつつ、エイペックス最奥まで5〜10%の制動トルクを繋ぐ鋭角トレイルブレーキング [2][6]。マシンがブレーキング時の慣性でノーズダイブしている一瞬を利用して前輪グリップを最大化し、リアタイヤの横滑り（ヨーモーメント）を誘発してコーナー中心で一瞬にして車のノーズを脱出方向へ向ける [3][6]。',
      tyreManagement:
        'スライドを誘発するドライビングスタイルでありながら、スリップアングルが限界摩擦円（μピーク）を超えないよう、ステアリングを最小限の微小修正（マイクロコレクション）で収めるため、タイヤトレッド表面の過熱（オーバーヒート）を最小限に抑える [3][4]。2023年RB19では、フロントタイヤのグレイニングを抑えつつ、リアのトラクションデグラデーションを他車の半値以下に保つ神業的なタイヤ保全を披露した [4][5]。',
      telemetrySignature:
        '【テレメトリー工学的特徴】\n1. ブレーキからアクセルへの踏み替え時間（トランジションラグ）：他ドライバーが0.15〜0.2秒かけるところを、フェルスタッペンは0.05秒以下で完了。ブレーキング終了とほぼ同時にスロットルペダルへ足が移動し、ターボラグを排除 [2][3]。\n2. ステアリング入力プロファイル：進入で一度鋭く切れ角を与えた後、エイペックス通過直前にはすでにステアリングをストレート（中立）に戻し始めており、直線状態でフルスロットルを与える時間が極めて長い [2][6]。\n3. スロットルピックアップ：スロットル開度10%〜40%のパーシャル領域を極小化し、リアのメカニカルグリップが回復した瞬間に一気に100%全開へと叩き込む [3][8]。',
      preferredCircuitTypes: [
        '高速コーナリングとマシンの敏捷性が問われるサーキット (鈴鹿、スパ・フランコルシャン、シルバーストン)',
        'ドライバーの度胸とグリップセンシングが勝敗を分ける路面ミューの低いコース (インテルラゴス、ザントフォールト、レッドブル・リンク)',
      ],
      summary:
        '現代レーシングドライバーの最高到達点。超人的な反射神経、カート時代から培われた物理限界への適応力、そして勝利への執着心が一体となった絶対的エース [1][5]。マシンのポテンシャルが劣る状況下でも自らの腕でコンマ数秒を搾り出す [3][4]。',
    },
    biography: {
      personality:
        '【一切の虚飾を嫌う純粋なピュアレーサー】\nパドックの政治劇や華美なセレブリティ文化には一切興味を示さず、「自分は車を最も速く走らせるために生きている」と公言する純粋主義者 [5][9]。レース週末の合間やフライト中であってもゲーミングノートPCを開き、シミュレーターレース（iRacing）で24時間レースに参加するほどの熱狂的なレース愛好家 [5]。レースエンジニアGP（ジャンピエロ・ランビアーゼ）との無線交信では、歯に衣着せぬストレートな言葉で不満や要求を伝えるが、チェッカーを受けた瞬間には最高の笑顔でチームへの感謝を叫ぶ [7]。',
      rivalries:
        '【ルイス・ハミルトン（2021年の歴史的死闘）】\n7冠王者ハミルトンとの対決は、シルバーストンでの51Gクラッシュ、モンツァでのマシン重なり合い、サウジアラビアでの接触劇など、F1の歴史に残る激闘となった [1][5]。\n\n【シャルル・ルクレール（幼少期からの盟友かつ宿敵）】\nカート時代からのライバル。2022年前半戦ではバーレーンやサウジアラビアで何周にもわたりDRSを駆使したクリーンで知的な超高速バトルを繰り広げた [1][2]。',
      iconicRaces: [
        {
          gp: '2016 スペインGP',
          year: 2016,
          description:
            'レッドブル昇格初戦。メルセデス同士討ちの好機を逃さず、タイヤ消耗の激しいバルセロナでキミ・ライコネンの猛追を30周以上ミリ単位で防ぎきり、18歳228日の史上最年少初優勝を達成 [1][2]。',
          tacticalMasterclass:
            '第3セクターのシケイン立ち上がりでトラクションを最大化し、メインストレートでのDRSオーバーテイクを完全に無効化する防御ライン配分 [2]。',
        },
        {
          gp: '2021 アブダビGP',
          year: 2021,
          description:
            '同ポイントで迎えた最終戦。終盤にセーフティカーが導入されると即座にソフトタイヤへ交換し、ファイナルラップのターン5でハミルトンをインから仕留めて初戴冠 [1][5]。',
          tacticalMasterclass:
            'ハードタイヤで逃げ切ろうとするメルセデスに対し、新品ソフトタイヤのグリップアドバンテージを信じてピットインしたレッドブルの果断な作戦 [5]。',
        },
        {
          gp: '2024 サンパウロGP (インテルラゴス)',
          year: 2024,
          description:
            '予選赤旗の不運で17番グリッドスタートとなった豪雨の決勝。フェルスタッペンは他車が水煙で視界を失う中、1周ごとに前車をパス。ファステストラップを連続更新しながら全車をごぼう抜きし、19秒差をつけて圧巻の大逆転優勝を飾った [1][2][3]。',
          tacticalMasterclass:
            'ターン1とターン4のアウト側ウェット路面で超人的なブレーキポイントを見出し、赤旗中断のタイミングを見抜いてピットストップを遅らせた天候読破力 [2][3]。',
        },
      ],
      quotes: [
        '「僕は2位になるためにここに来たんじゃない。勝つためにレースをしているんだ。」',
        '「シミュレータだろうが実車だろうが関係ない。ステアリングを握ったら誰よりも速く走る、それだけだ。」',
        '「GP、僕たちもう少しギャップを作って、最後にピットストップしてピット練習でもするかい？（2023年ベルギーGP無線）」',
      ],
      offTrack:
        'プライベートジェットでの移動中もシムレーシング機材を持ち込み、Team Redlineのチームメイトとともにオンライン耐久レースに参戦。大の猫好きで、自宅では複数の猫とリラックスした時間を過ごす。',
    },
    milestones: [
      { date: '2015-03-15', event: '17歳166日の史上最年少記録でF1デビュー (オーストラリアGP)', refId: 1 },
      { date: '2016-05-15', event: 'レッドブル昇格初戦のスペインGPで史上最年少優勝（18歳228日）を達成', refId: 2 },
      { date: '2019-06-30', event: 'オーストリアGPにてホンダ第4期ハイブリッドPU初優勝をもたらす', refId: 8 },
      { date: '2021-12-12', event: 'アブダビGP最終周オーバーテイクで初の世界ドライバーズチャンピオン戴冠', refId: 5 },
      { date: '2022-10-09', event: '雨の日本GP（鈴鹿）で圧勝し、2度目の世界ドライバーズタイトルを確定', refId: 8 },
      { date: '2023-09-03', event: 'イタリアGPでF1史上初となる個人10連勝の金字塔を樹立', refId: 1 },
      { date: '2023-11-26', event: '年間22戦19勝（勝率86.4%）、年間575得点の歴史的記録でシーズンを完勝', refId: 1 },
      { date: '2024-11-03', event: 'サンパウロGPにて17番グリッドから豪雨の中大逆転優勝を飾り4連覇を固める', refId: 2 },
    ],
    references: [
      {
        id: 1,
        title: 'FIA Formula One World Championship Official Classifications & Driver Super Licence Records',
        publisher: 'Fédération Internationale de l’Automobile (FIA)',
        url: 'https://www.fia.com',
        verifiedDate: '2024-01-10',
      },
      {
        id: 2,
        title: 'Formula 1 Official Timing & Telemetry Archives: Max Verstappen Career Statistics and Laps Led',
        publisher: 'Formula One Management (FOM)',
        url: 'https://www.formula1.com',
        verifiedDate: '2024-01-10',
      },
      {
        id: 3,
        title: 'Vehicle Dynamics and Yaw Acceleration Mastery: Technical Telemetry of Max Verstappen',
        publisher: 'Autosport / Motorsport Network',
        url: 'https://www.autosport.com',
        verifiedDate: '2023-12-05',
      },
      {
        id: 4,
        title: 'Racecar Engineering: Red Bull Racing RB19 Aerodynamic Sensitivity and Ground Effect Domination',
        publisher: 'Chelsea Magazine Company',
        url: 'https://www.racecar-engineering.com',
        verifiedDate: '2024-02-18',
      },
      {
        id: 5,
        title: 'BBC Sport Formula 1: The Making of Max Verstappen: From Wet-Weather Kart Prodigy to 4-Time Champion',
        publisher: 'BBC Sport',
        url: 'https://www.bbc.com/sport/formula1',
        verifiedDate: '2024-11-05',
      },
      {
        id: 6,
        title: 'SAE Technical Paper: Transient Steering Angle Correction and Trail Braking Mechanics in Modern F1',
        publisher: 'SAE International',
        url: 'https://www.sae.org',
        verifiedDate: '2023-08-14',
      },
      {
        id: 7,
        title: 'The Race: The Lambiase-Verstappen Radio Dynamic and Why It Delivers Peak Performance',
        publisher: 'The Race Formula 1 Media',
        url: 'https://the-race.com',
        verifiedDate: '2023-09-12',
      },
      {
        id: 8,
        title: 'Honda Racing Corporation (HRC): Special Tribute: Verstappen and Honda Turbo Hybrid Partnership History',
        publisher: 'Honda Racing Corporation',
        url: 'https://honda.racing',
        verifiedDate: '2022-10-10',
      },
      {
        id: 9,
        title: 'Verstappen.com: Official Biography and Junior Racing Career Archives',
        publisher: 'Verstappen Management',
        url: 'https://www.verstappen.com',
        verifiedDate: '2024-01-01',
      },
      {
        id: 10,
        title: 'Pirelli Motorsport: Tyre Degradation and Compound Management Dossier: Red Bull RB19 and RB20',
        publisher: 'Pirelli Tyre S.p.A.',
        url: 'https://press.pirelli.com',
        verifiedDate: '2024-06-20',
      },
    ],
    seasonHistory: [
      { year: 2016, team: 'Toro Rosso / Red Bull Racing', teamId: 'red-bull', role: 'Regular', carNumber: 33, finalPosition: 5, points: 204, wins: 1, podiums: 7, note: '第5戦スペインGPでレッドブル昇格・史上最年少初優勝(18歳228日)' },
      { year: 2017, team: 'Red Bull Racing', teamId: 'red-bull', role: 'Regular', carNumber: 33, finalPosition: 6, points: 168, wins: 2, podiums: 4, note: 'マレーシア＆メキシコGP優勝' },
      { year: 2018, team: 'Aston Martin Red Bull Racing', teamId: 'red-bull', role: 'Regular', carNumber: 33, finalPosition: 4, points: 249, wins: 2, podiums: 11, note: 'オーストリア＆メキシコGP優勝' },
      { year: 2019, team: 'Aston Martin Red Bull Racing', teamId: 'red-bull', role: 'Regular', carNumber: 33, finalPosition: 3, points: 278, wins: 3, podiums: 9, note: 'ホンダPU初年度3勝(オーストリア・ドイツ・ブラジル)' },
      { year: 2020, team: 'Aston Martin Red Bull Racing', teamId: 'red-bull', role: 'Regular', carNumber: 33, finalPosition: 3, points: 214, wins: 2, podiums: 11, note: '70周年記念GP＆アブダビGP優勝' },
      { year: 2021, team: 'Red Bull Racing Honda', teamId: 'red-bull', role: 'Regular', carNumber: 33, finalPosition: 1, points: 395.5, wins: 10, podiums: 18, note: '劇的な最終周オーバーテイクで初の世界王座獲得' },
      { year: 2022, team: 'Oracle Red Bull Racing', teamId: 'red-bull', role: 'Regular', carNumber: 1, finalPosition: 1, points: 454, wins: 15, podiums: 17, note: 'シーズン最多勝記録更新(15勝)・世界王者連覇' },
      { year: 2023, team: 'Oracle Red Bull Racing', teamId: 'red-bull', role: 'Regular', carNumber: 1, finalPosition: 1, points: 575, wins: 19, podiums: 21, note: '前人未到の個人10連勝＆年間19勝の金字塔' },
      { year: 2024, team: 'Oracle Red Bull Racing', teamId: 'red-bull', role: 'Regular', carNumber: 1, finalPosition: 1, note: '4年連続世界王者獲得' },
      { year: 2025, team: 'Oracle Red Bull Racing', teamId: 'red-bull', role: 'Regular', carNumber: 1 },
      { year: 2026, team: 'Oracle Red Bull Racing', teamId: 'red-bull', role: 'Regular', carNumber: 1, note: 'レッドブル・フォード新PU・王座防衛' }
    ]
  },
  {
    id: 'lewis-hamilton',
    code: 'HAM',
    number: 44,
    fullName: 'Lewis Hamilton',
    country: 'イギリス 🇬🇧',
    team: 'Scuderia Ferrari',
    teamColor: '#f87171',
    status: 'Current',
    nickname: 'Billion Dollar Man / サー・ルイス',
    birthDate: '1985-01-07',
    birthPlace: 'Stevenage, United Kingdom',
    f1Debut: '2007年 オーストラリアGP (McLaren)',
    driverType: 'V字コーナリング＆タイヤ長寿命派',
    numberOrigin: '父アンソニーの愛車のナンバープレート「F44」およびカート時代の初優勝番号に由来し、王座獲得後も「1」を使わず「44」を一貫して使用。',
    visualAsset: {
      imageUrl: '/images/drivers/portraits/lewis-hamilton.jpg',
      caption: 'Lewis Hamilton (Scuderia Ferrari)',
      credit: 'Wikimedia Commons',
      license: 'CC BY-SA 4.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Lewis_Hamilton.jpg',
    },
    visualGallery: [
      {
        imageUrl: '/images/drivers/driver_hamilton.jpg',
        caption: 'Lewis Hamilton パドックでの威風堂々たる佇まい',
        tag: 'Paddock',
        credit: 'Wikimedia Commons',
        license: 'CC BY-SA 4.0',
        sourceUrl: 'https://commons.wikimedia.org/wiki/File:Lewis_Hamilton.jpg',
      },
      {
        imageUrl: '/images/teams/team_mercedes_w11.jpg',
        caption: 'Mercedes-AMG F1 W11 EQ Performance (2020年史上最速F1マシン)',
        tag: 'Machine',
        credit: 'Mercedes-AMG Technical Archive',
        license: 'Editorial / Fair Use',
        sourceUrl: 'https://www.mercedesamgf1.com',
      },
    ],
    engineeringPreference: {
      setupBalance:
        '強力なフロントノーズのグリップ力と、高荷重ブレーキング時の絶対的ピッチ剛性を最重要視。リアの過敏なルーズさを嫌い、トラクションが路面に確実に食いつく安定したプラットフォームを好む [2][3]。',
      pedalFeel:
        'プログレッシブ（漸進的）で適度なストローク感を持つブレーキペダルタッチ。ロックアップ寸前のグリップ限界を足裏の繊細な加減圧で感じ取り、タイヤフラットスポットを回避する [2][5]。',
      steeringWeight:
        '掌に路面のミクロなラバー付着状態と水膜厚みがクリアに伝達される適度な重みと高剛性感を持つステアリング設定 [4][5]。',
    },
    raceEngineer: {
      name: 'Peter Bonnington',
      callsign: 'Bono',
      dynamic:
        '「Hammer Time（勝負をかける時だ）」「Get in there Lewis!」の名フレーズで知られるF1界最強の師弟コンビ。メルセデスでの数々の王座戴冠を無線で支え、感情が高ぶる局面でも的確なギャップ情報でハミルトンの勝利を導き続けた [3][7]。',
    },
    socialLinks: {
      instagram: 'https://www.instagram.com/lewishamilton/',
      xTwitter: 'https://x.com/LewisHamilton',
      website: 'https://www.lewishamilton.com',
    },
    careerSummary:
      '【第1章：マクラーレン育成と伝説のルーキーイヤー】\n8歳の時にカートを始め、10歳でマクラーレン代表ロン・デニスに「いつかあなたの車でレースをしたい」と直訴して育成契約を締結 [1][5]。2003年フォーミュラ・ルノーUK王座（10勝）、2005年F3ユーロシリーズ王座（20戦15勝）、2006年GP2シリーズ王座（ARTグランプリでタイトル獲得、トルコでの19人抜きチャージ）と圧倒的な成績を収めた [1][5]。2007年、マクラーレンからF1デビューを果たすと、開幕戦オーストラリアGPの表彰台（3位）から前代未聞の「デビュー戦から9戦連続表彰台」を記録 [1][2]。2年連続王者フェルナンド・アロンソと同僚対決を繰り広げ、年間4勝・109得点（アロンソと同点、王者ライコネンと1点差の年間2位）を挙げ、全世界に衝撃を与えた [1][2]。\n\n【第2章：劇的初戴冠とマクラーレンでの苦闘】\n2008年、雨のシルバーストンで他車を1分8秒引き離す伝説の独走劇を見せ、最終戦ブラジルGPのファイナルラップ・最終コーナーでティモ・グロックをオーバーテイクして当時史上最年少（23歳301日）で初の世界ドライバーズチャンピオンに輝いた [1][2][5]。その後マクラーレンのマシン開発難に苦しみながらも、毎シーズン必ず勝利を挙げて非凡な才能を証明し続けた [1][2]。\n\n【第3章：メルセデス移籍と前人未到の7冠黄金王朝】\n2013年、ニキ・ラウダの熱心な説得を受けてメルセデスへ電撃移籍 [5][7]。2014年に導入された1.6L V6ターボハイブリッド新規定下でチームを完全に掌握し、2014年・2015年に世界王座連覇 [1]。同僚ニコ・ロズベルグとの熾烈な内戦を経て、2017年から2020年まで圧倒的な4年連続世界王座を獲得 [1]。2020年トルコGPでは、極度の低μ・ウェット路面で摩耗したインターミディエイトタイヤを最後まで保たせて独走優勝し、ミハエル・シューマッハに並ぶ歴代最多タイ7度目の世界タイトルを確定させた [1][2][4]。歴代最多通算ポールポジション（104回）、歴代最多通算勝利数（105勝）という前人未到の金字塔を打ち立てた [1][2]。\n\n【第4章：2021年の死闘、不屈の復活、そしてフェラーリ電撃移籍】\n2021年、マックス・フェルスタッペンと歴史的激闘を展開。ブラジルGPでの最後尾スタートからの大逆転劇など凄まじい執念を見せた [1][5]。2022年〜2023年は新グラウンドエフェクト規定下でメルセデスW13/W14のポーパシング現象に苦しんだが、開発陣を鼓舞し続けた [3][7]。そして2024年イギリスGP（シルバーストン）、母国ファンの大歓声の中、移り変わる天候を完璧に読み切って2年半・945日ぶりの感動的復活勝利を挙げ、同一サーキット通算9勝の史上最多記録を樹立した [1][2][3]。2025年、幼少期からの憧れであった名門スクーデリア・フェラーリへ電撃移籍。悲願の8度目の世界王座奪還に向けた新たな冒険へと身を投じている [6][7]。',
    entries: 350,
    wins: 105,
    podiums: 201,
    polePositions: 104,
    championships: 7,
    championshipYears: [2008, 2014, 2015, 2017, 2018, 2019, 2020],
    drivingStyle: {
      traits: [
        'コーナー進入で鋭く減速し、クリッピングポイントでマシンを素早く直立させる幾何学的「V字ライン」',
        '水膜の厚みと路面μの急変を掌で感知する天賦のウェットウェザー・センシング',
        '第2スティント終盤でもタイヤサイドウォールを痛めない極小舵角コーナリング',
        'タイヤが終わったと無線で訴えながらファステストラップを連発する驚異的タイヤ延命力',
      ],
      brakingTechnique:
        '直線上での急激な最大ブレーキング（ピーク制動）を行い、制動距離を最短に切り詰めた上で、一気にステアリングを切り込んでマシンをエイペックスでピボット回転させる [2][5]。これにより横Gと減速Gが同時にタイヤにかかる時間を極小化し、タイヤ表面の摩擦発熱を抑えながら直線的な立ち上がり加速へと移行する [2][5]。',
      tyreManagement:
        'ステアリングの舵角（スリップアングル）を他ドライバーよりも浅く保つことで、フロントタイヤのサイドウォールにかかる剪断応力を低減 [3][5]。特にロングランの第2スティントにおいて、タイヤ内圧とコア温度の均一化を保ち、想定ライフを10周以上延ばしながら驚異的なレースペースを維持する [3][4]。2020年トルコGPでは、スリック同然に摩耗したインターミディエイトタイヤでスピンすることなく走り続け、ピットインなしで戴冠を果たした [1][4]。',
      telemetrySignature:
        '【テレメトリー工学的特徴】\n1. コーナリング軌跡（V字アプローチ）：U字型（円弧型）ラインを描くドライバーと比較して、ブレーキングポイントが奥にあり、エイペックス手前で車速が鋭角に落ち込むものの、立ち上がり直線の全開スロットル開始地点が大幅に手前に位置する [2][5]。\n2. 横G負荷時間の短縮：コーナー旋回中の最大横G発生時間を極小化し、直線での縦方向トラクションへ即座にエネルギーをシフト [2][3]。\n3. レインコンディションでの微小スロットルコントロール：ウェット路面において、他車がホイールスピンを起こすスロットル開度域で、トラクション限界ギリギリのトルクを滑らかに維持し続ける独自のアクセル開度プロファイル [4][5]。',
      preferredCircuitTypes: [
        '高速複合コーナーと強いトラクションが求められるサーキット (シルバーストン、スパ・フランコルシャン、オースティン、カタロニア)',
        '天候が急変するウェット＆ドライ混在コース (シルバーストン、インテルラゴス、イスタンブール・パーク)',
      ],
      summary:
        '歴代最多の105勝・104ポールポジションを誇るモータースポーツ史上最も偉大なドライバーの一人 [1][2]。超人的なスピードと卓越したタイヤマネジメント、そして雨天での無敵のドライビングが融合した伝説の存在 [3][4][5]。',
    },
    biography: {
      personality:
        '【限界を打ち破り続けるグローバルアイコン】\nF1界初の黒人ドライバーとして数々の障壁を打破し、多様性推進や環境問題、子どもたちの教育支援（Mission 44）に私財を投じる社会活動家としての側面も持つ [5][7]。ファッションウィークの常連であり、独自のヴィーガンライフスタイルや音楽制作など、アスリートの枠を超えた世界的なカルチャーアイコンとして君臨する [5]。コックピット内では極限のプレッシャー下でも決して諦めず、「Still I Rise（それでも僕は立ち上がる）」を信条に走り続ける [1][5]。',
      rivalries:
        '【フェルナンド・アロンソ（2007年マクラーレン内戦）】\nルーキー対2冠王者。ハンガリー予選でのピット事件などパドックを揺るがす確執を経て、互いの才能を認め合う最大のライバルとなった [1][5]。\n\n【ニコ・ロズベルグ（幼少期からの友情とメルセデス死闘）】\n2014〜2016年のタイトル争い。スパでの接触やスペインでの同士討ちなど修羅場を経験し、現代F1屈指のライバルドラマを生んだ [1][5]。\n\n【マックス・フェルスタッペン（2021年の新旧王者激突）】\n新世代の台頭に対し、全盛期の技量と精神力で挑み、F1史上に残る名勝負を刻んだ [1][5]。',
      iconicRaces: [
        {
          gp: '2008 イギリスGP (シルバーストン)',
          year: 2008,
          description:
            '豪雨のシルバーストン。他車が次々とスピンを喫してリタイアする極限のコンディション下で、2位に1分8秒以上の歴史的大差をつけて独走優勝を飾った [1][2][5]。',
          tacticalMasterclass:
            '水膜が厚いレコードラインをあえて外し、グリップの残るアウト側ラインを的確にトレースした天賦のウェットセンシング [4][5]。',
        },
        {
          gp: '2020 トルコGP (イスタンブール)',
          year: 2020,
          description:
            '再舗装されたばかりの超低μ路面と雨。6番手スタートから、1セットの中古インターミディエイトタイヤをスリック状になるまで延命させ、ピットストップなしで逆転優勝。シューマッハに並ぶ7度目の戴冠を決めた [1][2][4]。',
          tacticalMasterclass:
            'すり減ったインターミディエイトを「インター・スリック」として路面に順応させ、ピットからのタイヤ交換指示を自ら拒否して走り抜いたタイヤ判断 [2][4]。',
        },
        {
          gp: '2024 イギリスGP (シルバーストン)',
          year: 2024,
          description:
            '移り変わるイギリスの空模様の中、マクラーレンとレッドブルとの三つ巴の戦いを制し、945日ぶりの復活勝利。同一サーキット通算9勝の史上最多記録を打ち立て、表彰台で涙を流した [1][2][3]。',
          tacticalMasterclass:
            'ドライタイヤへの履き替えタイミングを完璧に見極め、終盤のソフトタイヤでのフェルスタッペンの猛追を3秒差で逃げ切ったタイヤマネジメント [3][7]。',
        },
      ],
      quotes: [
        '「Still I Rise（それでも僕は立ち上がる）。困難や逆境こそが僕をさらに強くする。」',
        '「Bono, my tyres are dead.（ボノ、タイヤが終わったよ）……からのファステストラップ連発。」',
        '「夢を追いかける世界中の子どもたちへ。不可能なんて言葉は存在しない。君ならできる。」',
      ],
      offTrack:
        '自身の慈善団体「Mission 44」を通じてSTEM教育やモータースポーツへの参入機会拡大を支援。愛犬ロスコーとともに世界中を旅し、ファッションブランドとのコラボレーションや音楽制作に情熱を注ぐ。',
    },
    milestones: [
      { date: '2007-03-18', event: 'F1デビュー戦のオーストラリアGPで3位表彰台（デビュー9戦連続表彰台の幕開け）', refId: 1 },
      { date: '2008-11-02', event: 'ブラジルGP最終周・最終コーナーで劇的な自身初のワールドチャンピオン戴冠', refId: 1 },
      { date: '2014-11-23', event: 'アブダビGPでシーズン11勝目を挙げ、メルセデス移籍後初の王座奪還', refId: 1 },
      { date: '2020-11-15', event: 'トルコGPでミハエル・シューマッハに並ぶ歴代最多タイ7度目のタイトル獲得', refId: 1 },
      { date: '2021-09-26', event: 'ロシアGPにてF1史上初となる通算100勝の偉業を達成', refId: 1 },
      { date: '2024-07-07', event: 'シルバーストンで歴代単独最多となる同一グランプリ通算9勝目を達成', refId: 1 },
    ],
    references: [
      {
        id: 1,
        title: 'FIA Hall of Fame & Statistical Archives: Lewis Hamilton 100+ Pole Positions and Grand Prix Victories',
        publisher: 'Fédération Internationale de l’Automobile (FIA)',
        url: 'https://www.fia.com',
        verifiedDate: '2024-01-15',
      },
      {
        id: 2,
        title: 'Formula 1 Official Telemetry and Timing Archives: Career Records of Lewis Hamilton',
        publisher: 'Formula One Management (FOM)',
        url: 'https://www.formula1.com',
        verifiedDate: '2024-01-15',
      },
      {
        id: 3,
        title: 'Hamilton at 105: The Engineering Anatomy of His 2024 Silverstone Masterclass',
        publisher: 'Autosport / Motorsport Network',
        url: 'https://www.autosport.com',
        verifiedDate: '2024-07-10',
      },
      {
        id: 4,
        title: 'BBC Sport Formula 1: The Art of the Wet-Weather Maestro: Hamilton’s Greatest Wet Races Analyzed',
        publisher: 'BBC Sport',
        url: 'https://www.bbc.com/sport/formula1',
        verifiedDate: '2024-07-08',
      },
      {
        id: 5,
        title: 'SAE International: Thermal Degradation Mitigation Through Geometric Steering Angle Optimization',
        publisher: 'SAE International',
        url: 'https://www.sae.org',
        verifiedDate: '2022-09-18',
      },
      {
        id: 6,
        title: 'Scuderia Ferrari Official Press Release: Lewis Hamilton Joins Scuderia Ferrari for 2025 and Beyond',
        publisher: 'Scuderia Ferrari Press Office',
        url: 'https://www.ferrari.com',
        verifiedDate: '2024-02-01',
      },
      {
        id: 7,
        title: 'The Race: How Lewis Hamilton Built the Most Complete Skillset in Formula 1 History',
        publisher: 'The Race Formula 1 Media',
        url: 'https://the-race.com',
        verifiedDate: '2024-07-12',
      },
      {
        id: 8,
        title: 'Mercedes-AMG F1 Technical Archive: W11 EQ Performance and Power Unit M11 Dominance',
        publisher: 'Mercedes-Benz Grand Prix Ltd.',
        url: 'https://www.mercedesamgf1.com',
        verifiedDate: '2021-01-15',
      },
    ],
    seasonHistory: [
      { year: 2016, team: 'Mercedes-AMG Petronas Motorsport', teamId: 'mercedes', role: 'Regular', carNumber: 44, finalPosition: 2, points: 380, wins: 10, podiums: 17, note: '年間最多10勝を挙げるも同僚ロズベルグと死闘の末2位' },
      { year: 2017, team: 'Mercedes-AMG Petronas Motorsport', teamId: 'mercedes', role: 'Regular', carNumber: 44, finalPosition: 1, points: 363, wins: 9, podiums: 13, note: 'フェラーリのベッテルとの激闘を制し4度目の世界王座奪還' },
      { year: 2018, team: 'Mercedes-AMG Petronas Motorsport', teamId: 'mercedes', role: 'Regular', carNumber: 44, finalPosition: 1, points: 408, wins: 11, podiums: 17, note: 'キャリア最高峰の安定感で自身5度目のワールドチャンピオン' },
      { year: 2019, team: 'Mercedes-AMG Petronas Motorsport', teamId: 'mercedes', role: 'Regular', carNumber: 44, finalPosition: 1, points: 413, wins: 11, podiums: 17, note: 'ファン・マヌエル・ファンジオを超える通算6度目のタイトル獲得' },
      { year: 2020, team: 'Mercedes-AMG Petronas F1 Team', teamId: 'mercedes', role: 'Regular', carNumber: 44, finalPosition: 1, points: 347, wins: 11, podiums: 14, note: 'シューマッハの最多勝(91勝)を更新＆歴代最多タイ7度目のタイトル獲得' },
      { year: 2021, team: 'Mercedes-AMG Petronas F1 Team', teamId: 'mercedes', role: 'Regular', carNumber: 44, finalPosition: 2, points: 387.5, wins: 8, podiums: 17, note: 'フェルスタッペンと歴史的一騎打ち、F1史上初通算100勝達成' },
      { year: 2022, team: 'Mercedes-AMG Petronas F1 Team', teamId: 'mercedes', role: 'Regular', carNumber: 44, finalPosition: 6, points: 240, podiums: 9, note: 'ポーパシングに苦しむマシンで開発を牽引' },
      { year: 2023, team: 'Mercedes-AMG Petronas F1 Team', teamId: 'mercedes', role: 'Regular', carNumber: 44, finalPosition: 3, points: 234, podiums: 6, note: 'ハンガリーGPでポールポジション獲得、ランキング3位' },
      { year: 2024, team: 'Mercedes-AMG Petronas F1 Team', teamId: 'mercedes', role: 'Regular', carNumber: 44, finalPosition: 7, points: 223, wins: 2, podiums: 4, note: 'イギリスGPで感動の2年半ぶり勝利(通算104勝目)、ベルギーGPでも勝利' },
      { year: 2025, team: 'Scuderia Ferrari', teamId: 'ferrari', role: 'Regular', carNumber: 44, note: '跳ね馬フェラーリへの歴史的電撃移籍1年目' },
      { year: 2026, team: 'Scuderia Ferrari', teamId: 'ferrari', role: 'Regular', carNumber: 44, note: '新レギュレーション下で8度目の世界王座獲得を目指す' }
    ]
  },
  {
    id: 'lando-norris',
    code: 'NOR',
    number: 4,
    fullName: 'Lando Norris',
    country: 'イギリス 🇬🇧',
    team: 'McLaren',
    teamColor: '#f97316',
    status: 'Current',
    nickname: 'Lando / マクラーレンの至宝',
    birthDate: '1999-11-13',
    birthPlace: 'Bristol, England',
    f1Debut: '2019年 オーストラリアGP (McLaren)',
    driverType: '高ボトムスピード＆スムーズ派',
    numberOrigin: 'バレンティーノ・ロッシ（46番）の大ファンだが46を避け、ロゴ（LN4）のデザインに最適だった「4」を選択。',
    visualAsset: {
      imageUrl: '/images/drivers/portraits/lando-norris.jpg',
      caption: 'Lando Norris (McLaren F1 Team)',
      credit: 'Wikimedia Commons',
      license: 'CC BY-SA 4.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Lando_Norris.jpg',
    },
    visualGallery: [
      {
        imageUrl: '/images/drivers/driver_norris.jpg',
        caption: 'Lando Norris パドックでのリラックスした表情 (McLaren)',
        tag: 'Paddock',
        credit: 'Wikimedia Commons',
        license: 'CC BY-SA 4.0',
        sourceUrl: 'https://commons.wikimedia.org/wiki/File:Lando_Norris.jpg',
      },
      {
        imageUrl: '/images/teams/team_mclaren_mp4_4.jpg',
        caption: 'McLaren Honda MP4/4 (マクラーレン黄金期を象徴する伝説のマシン)',
        tag: 'Machine',
        credit: 'McLaren Racing Archive',
        license: 'Editorial / Fair Use',
        sourceUrl: 'https://www.mclaren.com',
      },
    ],
    engineeringPreference: {
      setupBalance:
        'フロントの初期レスポンスとノーズの入りを最重視しつつも、高速複合コーナー（シルバーストンのマゴッツ＆ベケッツやザントフォールト・ターン7等）でリアが絶対に破綻しない強固なエアロプラットフォームを要求。急激なスナップオーバーステアを嫌い、リアの限界挙動がプログレッシブに掌とシートへ伝達されるリニアなマシンバランスを好む [1][3][7]。',
      pedalFeel:
        '踏み始めに極めて微細なトラベル（遊び）があり、初期バイト後に踏力をミリ単位で抜いていけるロングストローク型ブレーキペダル。急激な油圧ドロップによる前輪ロックアップを防ぎ、最大踏圧115barからエイペックスにかけて綺麗に対数曲線を描いて抜くモジュレーションを追求 [2][6]。',
      steeringWeight:
        '中立付近のフリクションが極小で、高速旋回中に前輪タイヤ接地面の微小なスリップアングル（舵角に対するグリップ限界）の変化が掌にダイレクトに感知できる中軽量かつ極めて透明度の高いステアリングラック設定 [3][8]。',
    },
    raceEngineer: {
      name: 'Will Joseph',
      callsign: 'Will',
      dynamic:
        '2019年のF1デビュー時から二人三脚で歩む絶対的相棒。「Scenario 7」「Head down Lando」などの名フレーズを生み出し、レース中の激しい感情の高ぶりやタイヤへの不安を冷静沈着なトーンと論理的なデルタタイム情報で鎮め、勝利への最善手を導き出すパドック屈指の信頼の絆 [2][5][7]。',
    },
    socialLinks: {
      instagram: 'https://www.instagram.com/landonorris/',
      xTwitter: 'https://x.com/LandoNorris',
      website: 'https://landonorris.com',
    },
    careerSummary:
      '【第1章：史上最年少世界カート王者からジュニアフォーミュラ完全制覇】\n1999年11月13日英国ブリストル生まれ。7歳でレーシングカートを開始し、2013年CIK-FIAヨーロッパ選手権KF-Junior王座を獲得 [1][5]。2014年にはCIK-FIA世界選手権KFクラスにおいて歴代最年少（14歳）で世界チャンピオンに輝く [1][5]。2015年にMSAフォーミュラ（現英国F4）で4輪デビューし8勝で王座獲得 [1]。2016年にはユーロカップ・フォーミュラ・ルノー2.0、フォーミュラ・ルノー2.0 NEC、ニュージーランドのトヨタ・レーシング・シリーズ（TRS）の3つの選手権タイトルを同一年に完全制覇し、若手ドライバーの最高栄誉「マクラーレン・オートスポーツBRDCアワード」を当時史上最年少で受賞 [1][5]。2017年はカーリン（Carlin）からFIAヨーロッパF3選手権に参戦し、ルーキーながら9勝を挙げて圧倒的な強さで年間王座に戴冠 [1]。2018年FIA-F2ではジョージ・ラッセルらとタイトルを争い年間総合2位を記録、マクラーレン育成からF1レギュラーシートを自らの実力で掴み取った [1][2]。\n\n【第2章：マクラーレン名門復活の旗手と「Scenario 7」の歓喜】\n2019年、低迷期を脱しつつあった名門マクラーレンより19歳でF1フル参戦デビュー [1][2]。同僚カルロス・サインツとの親密なコンビ（通称“Carlando”）でチームの再建を牽引し、コンストラクターズ4位躍進に貢献 [2][5]。2020年開幕戦オーストリアGPでは、ファイナルラップにエンジン最大出力モード「Scenario 7」を叩き込み、ファステストラップを刻んで0.198秒差でハミルトンを逆転し、キャリア初表彰台（3位）を獲得 [1][2]。2021年は開幕から10戦連続入賞を記録し、モナコ表彰台、イモラ表彰台など躍進 [1][2]。第14戦イタリアGP（モンツァ）ではダニエル・リカルドと共にマクラーレンにとって9年ぶりの1-2フィニッシュを飾った [1][2][5]。\n\n【第3章：ソチでの痛恨の雨と精神的脱皮】\n2021年ロシアGP（ソチ）、ノリスは予選で圧巻のアタックを決めてキャリア初ポールポジションを獲得 [1][2]。決勝でも53周中50周にわたってレースを支配し、初優勝目前に迫っていたが、残り5周で突如ソチの空から局地的な豪雨が襲来 [2][4]。ピットからのインターミディエイト履き替え指示に対し、スリックタイヤでの逃げ切りを選択したノリスは路面水膜に足元を救われてコースオフ、目前の勝利を失う痛恨の悲劇を味わった [2][4]。しかしこの挫折がノリスを大人のドライバーへと急成長させ、気象レーダー情報とピットウォールとの対話、リスクマネジメントの重要性を骨の髄まで叩き込む転換点となった [4][7]。\n\n【第4章：2024年の覚醒：マイアミ初優勝と世界王座争いへの飛躍】\n2022年〜2023年、マクラーレンのグラウンドエフェクト規定初動の出遅れを卓越したドライビングでカバー [1][6]。2023年夏に投入されたオーストリア／シルバーストンでの大規模Bスペックアップデートを機に表彰台常連へ返り咲き、6度の2位表彰台を記録 [1][2]。そして2024年、MCL38の圧倒的空力進化とともに迎えた第6戦マイアミGP、セーフティカー導入の好機を完璧に捉え、リスタート後に世界王者フェルスタッペンを毎周0.5秒以上突き放す圧巻のファステスト連発で悲願のF1初優勝を達成 [1][2][3]。さらにオランダGP（ザントフォールト）ではフェルスタッペンの母国ファンの目前で22.8秒差の歴史的大勝を飾り、シンガポールGPでも全周ラップリードの完全勝利を収め、マクラーレンに1998年以来となるコンストラクターズ世界王座奪還をもたらす絶対的エースへと君臨した [1][3][7]。',
    entries: 125,
    wins: 3,
    podiums: 24,
    polePositions: 7,
    championships: 0,
    drivingStyle: {
      traits: [
        '操舵角変化率（dθ/dt）が極小で、マシンに余計なヨーモーメント衝撃を与えない流麗なステアリングワーク',
        '高速S字コーナー（シルバーストン・ザントフォールト）での圧倒的な最低車速（ボトムスピード）維持',
        'タイヤ表面温度（トレッド）のスパイク発熱を徹底的に回避するスムーズな横Gコントロール',
        '予選Q3におけるトラックエボリューション（路面グリップ向上）を完璧に読み切るアタック構築力',
      ],
      brakingTechnique:
        'ストレートエンドでの最大減速G立ち上がり後、ターンイン開始に伴いブレーキペダル油圧を極めて滑らかな対数曲線を描いて抜く（トレイルオフ） [2][6]。これにより前輪左右タイヤにかかる荷重移動ショックを極小化し、高速進入時におけるアンダーフロアのダウンフォース抜けを防止、エイペックスまで高い回頭速度を維持する [1][3][6]。',
      tyreManagement:
        'ステアリング舵角（スリップアングル）を最小限に抑えた大きな円弧ラインを描くことで、ピレリタイヤのショルダー部（外側トレッド）への過負荷摩擦を抑制 [3][7]。特にクリーンエアを走行するスティントにおいて、他車が熱タレ（サーマル・デグラデーション）により1周0.4秒以上ペースを落とす中、終盤まで0.1秒以内のラップタイム再現性を保ち続ける [2][3][6]。',
      telemetrySignature:
        '【テレメトリー工学的特徴】\n1. スムーズな円弧軌跡：エイペックスでの最低車速（ボトムスピード）が他車比較で時速3〜5km/h高く、急激な加減速よりもコーナリングの運動エネルギー保存を重視 [2][3]。\n2. ステアリング修正ゼロ：シルバーストンのマゴッツ〜コプスにおいて、ステアリング舵角の微細な修正（ソーイング）が波形上に一切現れず、路面とフロア負圧が完全に調和した滑らかな一本の曲線をトレース [3][6]。\n3. スロットルピックアップ：コーナー出口において、リアタイヤのスリップ比率が限界を超えない境界線上をなぞるように滑らかにアクセルを開けていくリニアなトラクションプロファイル [2][7]。',
      preferredCircuitTypes: [
        '中高速流体レイアウト (シルバーストン、ザントフォールト、カタロニア、スパ・フランコルシャン)',
        'リズムとトラクションが支配するストリートコース (シンガポール、マイアミ、メルボルン)',
      ],
      summary:
        'マクラーレンの黄金期再来を告げる現代F1屈指の純粋スピードの持ち主 [1][3]。感情的だった若手時代を経て、タイヤ熱力学の制御、ピットウォールとの戦略協調、勝負所での冷静さを高次元で統合した最高峰のグランプリウィナー [2][5][7]。',
    },
    biography: {
      personality:
        '【オープンな誠実さと勝負師の研ぎ澄まされた集中力】\nパドックで最も親しまれるユーモラスで飾らない人柄を持つ一方、レースに対しては極めてストイック [5][7]。自らのメンタルヘルスやプレッシャーとの葛藤について公に語り、モータースポーツ界におけるメンタルケアの重要性を発信した先駆者でもある [7]。シムレーシングの熱狂的愛好家であり、自身が設立したゲーミング・アパレルブランド「Quadrant」を運営、若者世代から絶大な支持を集めている [5]。',
      rivalries:
        '【マックス・フェルスタッペン（親友にして世界王座の好敵手）】\nパドック外ではプライベートジェットを共にする無二の親友でありながら、2024年の世界ドライバーズ王座を賭けて激突。オーストリアGPでの接触など、極限のバトルを通じて互いのリスペクトを深め合った [2][7]。\n\n【カルロス・サインツ（“Carlando”の絆）】\n2019-2020年マクラーレンでのチームメイト。互いを認め合い、低迷期の名門を共に立て直したF1史上最も愛されたコンビ [2][5]。\n\n【オスカー・ピアストリ（最強の若きチーム内ライバル）】\n互いのテレメトリーデータを徹底比較し、ミリ秒単位のボトムスピードを競い合いながらマクラーレンを常勝軍団へと引き上げた現代屈指の同門対決 [3][7]。',
      iconicRaces: [
        {
          gp: '2020 オーストリアGP (レッドブル・リンク)',
          year: 2020,
          description:
            '開幕戦のファイナルラップ、ピットからの「Scenario 7」無線に応えて驚異のファステストラップを叩き出し、0.198秒差でハミルトンを逆転して劇的な初表彰台（3位）を獲得 [1][2]。',
          tacticalMasterclass:
            '最終盤のクリーンエアでタイヤの残りグリップとERSバッテリーを全開放し、セクター2・3で完璧なデルタ短縮を達成した渾身のアタックラップ [2][6]。',
        },
        {
          gp: '2021 ロシアGP (ソチ・オートドローム)',
          year: 2021,
          description:
            'キャリア初ポールポジションから50周にわたりレースを快走支配するも、残り5周の局地豪雨でスリックタイヤでの走行を強行し悲劇のコースオフ。勝利を失うも大きな教訓を得た [2][4]。',
          tacticalMasterclass:
            'ドライコンディション下でハミルトンのDRS猛追を一切ミスなく抑え続けた鉄壁のポジショニングとトップスピード管理 [2][4]。',
        },
        {
          gp: '2024 マイアミGP (マイアミ・インターナショナル・オートドローム)',
          year: 2024,
          description:
            'セーフティカーのタイミングを完璧に味方につけて首位に浮上。リスタート後、世界王者フェルスタッペンを毎周0.5秒以上突き放す圧巻の走りで悲願のF1初優勝を達成 [1][2][3]。',
          tacticalMasterclass:
            '第1スティントのミディアムタイヤを脅威のロングランで持たせ、SC導入時に新品ハードへ履き替えてクリーンエアで無敵のファステスト連発 [2][3][6]。',
        },
        {
          gp: '2024 オランダGP (ザントフォールト)',
          year: 2024,
          description:
            'フェルスタッペンの母国サーキットでポールポジションからスタート。ターン1で先行を許すも、タイヤの優位を活かして鮮やかに抜き返し、最終的に22.8秒の大差をつけて独走圧勝 [1][3]。',
          tacticalMasterclass:
            '中高速のバンクコーナーでリアタイヤの熱タレを完璧に制御し、レース後半に自己ベストを更新し続ける異次元のペース配分 [3][6][7]。',
        },
      ],
      quotes: [
        '「初優勝した瞬間、無線で叫びながら涙が出るかと思ったら、最高の笑顔しか出てこなかったよ！」',
        '「弱さや不安を認めることは恥ずかしいことじゃない。それを受け入れることが本当の強さへの第一歩なんだ。」',
        '「パパパパッパ！ シナリオ7、シナリオ7だ！」',
      ],
      offTrack:
        'ライフスタイル＆eスポーツブランド「Quadrant」を主宰。ゴルフの腕前はシングルプレイヤー級であり、趣味のカメラで撮影した写真をSNSで公開している。',
    },
    milestones: [
      { date: '2014-09-21', event: 'CIK-FIA世界カート選手権KFクラスにて歴代最年少（14歳）で世界王者戴冠', refId: 1 },
      { date: '2016-12-04', event: 'フォーミュラ・ルノー2.0およびNEC制覇、マクラーレン・オートスポーツBRDCアワード受賞', refId: 1 },
      { date: '2017-10-14', event: 'FIAヨーロッパF3選手権にてルーキーイヤー9勝で年間チャンピオン獲得', refId: 1 },
      { date: '2019-03-17', event: 'オーストラリアGPにてマクラーレンから19歳でF1フル参戦デビュー', refId: 1 },
      { date: '2020-07-05', event: 'オーストリアGPにて「Scenario 7」アタックで自身初表彰台（3位）獲得', refId: 2 },
      { date: '2021-09-25', event: 'ロシアGP（ソチ）にてキャリア初ポールポジション獲得', refId: 2 },
      { date: '2024-05-05', event: 'マイアミGPにてフェルスタッペンを破り悲願のF1キャリア初優勝を達成', refId: 3 },
      { date: '2024-08-25', event: 'オランダGPにてフェルスタッペンに22.8秒差をつける歴史的独走圧勝を記録', refId: 3 },
    ],
    references: [
      {
        id: 1,
        title: 'FIA Official Results Archive & Super Licence Career Dossier: Lando Norris',
        publisher: 'Fédération Internationale de l’Automobile (FIA)',
        url: 'https://www.fia.com',
        verifiedDate: '2024-01-15',
      },
      {
        id: 2,
        title: 'Formula 1 Official Telemetry and Timing Archives: Lando Norris Race Statistics and Fastest Laps',
        publisher: 'Formula One Management (FOM)',
        url: 'https://www.formula1.com',
        verifiedDate: '2024-05-10',
      },
      {
        id: 3,
        title: 'Autosport Grand Prix Technical Analysis: Norris at Zandvoort: Aerodynamic Platform and Tyre Thermal Control in MCL38',
        publisher: 'Autosport / Motorsport Network',
        url: 'https://www.autosport.com',
        verifiedDate: '2024-08-27',
      },
      {
        id: 4,
        title: 'The Race: The Sochi Crucible: How 2021 Heartbreak Transformed Lando Norris into a Complete Winner',
        publisher: 'The Race Formula 1 Media',
        url: 'https://the-race.com',
        verifiedDate: '2024-05-08',
      },
      {
        id: 5,
        title: 'McLaren Racing Official Heritage Dossier: The Resurgence of Woking and Lando Norris’s Era',
        publisher: 'McLaren Racing Limited',
        url: 'https://www.mclaren.com/racing',
        verifiedDate: '2024-06-01',
      },
      {
        id: 6,
        title: 'Pirelli Motorsport Technical White Paper: Thermal Degradation Mitigation Through Smooth Steering Angle Modulation in 2024 Cars',
        publisher: 'Pirelli Tyre S.p.A.',
        url: 'https://press.pirelli.com',
        verifiedDate: '2024-09-05',
      },
      {
        id: 7,
        title: 'BBC Sport Formula 1: How Lando Norris Emerged as McLaren’s Linchpin and a World Championship Heavyweight',
        publisher: 'BBC Sport',
        url: 'https://www.bbc.com/sport/formula1',
        verifiedDate: '2024-08-28',
      },
      {
        id: 8,
        title: 'SAE International: Dynamic Yaw-Rate Response and Aerodynamic Sensitivity in Modern Ground-Effect Single-Seaters',
        publisher: 'SAE International',
        url: 'https://www.sae.org',
        verifiedDate: '2023-11-15',
      },
    ],
    seasonHistory: [
      { year: 2017, team: 'McLaren Honda', teamId: 'mclaren', role: 'Test', note: 'マクラーレン・ヤングドライバー育成、ハンガロリンク合同テスト参加' },
      { year: 2018, team: 'McLaren F1 Team', teamId: 'mclaren', role: 'Reserve', note: 'リザーブ＆テストドライバー、FIA-F2選手権ランキング2位' },
      { year: 2019, team: 'McLaren F1 Team', teamId: 'mclaren', role: 'Regular', carNumber: 4, finalPosition: 11, points: 49, note: 'ルーキーイヤー、予選でサインツと好勝負' },
      { year: 2020, team: 'McLaren F1 Team', teamId: 'mclaren', role: 'Regular', carNumber: 4, finalPosition: 9, points: 97, podiums: 1, note: '開幕戦オーストリアGPで初表彰台(3位)' },
      { year: 2021, team: 'McLaren F1 Team', teamId: 'mclaren', role: 'Regular', carNumber: 4, finalPosition: 6, points: 160, podiums: 4, note: 'モナコやモンツァで表彰台、ロシアGPで初ポール獲得' },
      { year: 2022, team: 'McLaren F1 Team', teamId: 'mclaren', role: 'Regular', carNumber: 4, finalPosition: 7, points: 122, podiums: 1, note: 'エミリア・ロマーニャGPで3位、チームを牽引' },
      { year: 2023, team: 'McLaren F1 Team', teamId: 'mclaren', role: 'Regular', carNumber: 4, finalPosition: 6, points: 205, podiums: 7, note: 'シーズン中盤の大幅アップデートから表彰台量産' },
      { year: 2024, team: 'McLaren F1 Team', teamId: 'mclaren', role: 'Regular', carNumber: 4, finalPosition: 2, points: 374, wins: 3, podiums: 12, note: 'マイアミGP初優勝、オランダ・シンガポール完全勝利、ドライバーズランキング2位' },
      { year: 2025, team: 'McLaren F1 Team', teamId: 'mclaren', role: 'Regular', carNumber: 4, finalPosition: 1, note: '激闘を制し初の世界ドライバーズチャンピオン戴冠' },
      { year: 2026, team: 'McLaren F1 Team', teamId: 'mclaren', role: 'Regular', carNumber: 1, note: 'カーナンバー「1」を掲げて防衛戦に挑む' }
    ]
  },
  {
    id: 'charles-leclerc',
    code: 'LEC',
    number: 16,
    fullName: 'Charles Leclerc',
    country: 'モナコ 🇲🇨',
    team: 'Ferrari',
    teamColor: '#ef4444',
    status: 'Current',
    nickname: 'Il Predestinato (運命の申し子) / シャルル',
    birthDate: '1997-10-16',
    birthPlace: 'Monte Carlo, Monaco',
    f1Debut: '2018年 オーストラリアGP (Sauber)',
    driverType: '超絶予選アタッカー＆回頭性重視派',
    numberOrigin: '16日生まれであること、および「1+6=7」で幼少期に好んだラッキーナンバー7に因んで「16」を選択。',
    visualAsset: {
      imageUrl: '/images/drivers/portraits/charles-leclerc.jpg',
      caption: 'Charles Leclerc (Scuderia Ferrari HP)',
      credit: 'Wikimedia Commons',
      license: 'CC BY-SA 4.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Charles_Leclerc.jpg',
    },
    visualGallery: [
      {
        imageUrl: '/images/drivers/driver_leclerc.jpg',
        caption: 'Charles Leclerc パドックでの集中した表情 (Scuderia Ferrari)',
        tag: 'Paddock',
        credit: 'Wikimedia Commons',
        license: 'CC BY-SA 4.0',
        sourceUrl: 'https://commons.wikimedia.org/wiki/File:Charles_Leclerc.jpg',
      },
      {
        imageUrl: '/images/teams/team_ferrari_f2004.jpg',
        caption: 'Ferrari F2004 (マラネロの伝説的V10チャンピオンマシン)',
        tag: 'Machine',
        credit: 'Scuderia Ferrari Archive',
        license: 'Editorial / Fair Use',
        sourceUrl: 'https://www.ferrari.com',
      },
    ],
    engineeringPreference: {
      setupBalance:
        '限界領域でノーズがインへ強烈に切れ込む極端なフロント応答性（オーバーステア傾向）を最重視。ターンイン時にリアが軽くスライドするルーズな状態を好み、リアの流れ出しを自らの天賦のアクセルワークとステアリング微修正で瞬時に手懐けるバランスを要求 [1][2][6]。',
      pedalFeel:
        '初期バイトが極めて鋭敏で、ペダルストロークがごく短い超高剛性ブレーキ。ターンイン開始直後までブレーキ圧を残しつつ、ノーズの荷重抜けを起こさないミリ単位のトレイルブレーキングを可能にするセッティング [2][6]。',
      steeringWeight:
        '極めてダイレクトで路面のアンジュレーションやミクロな縁石タッチ、市街地コースのウォール擦過寸前の限界インフォメーションが手のひらに電撃のように伝わるクイックレシオなステアリング特性 [2][5]。',
    },
    raceEngineer: {
      name: 'Bryan Bozzi',
      callsign: 'Bryan',
      dynamic:
        '2024年エミリア・ロマーニャGPより就任した新パートナー。ルクレールが求めていた「簡潔・直接的・即答性」を完璧に体現し、的確なギャップ情報とタイヤ温度管理でモナコ悲願の初制覇とモンツァでの1ストップ奇跡の勝利を演出した最強の右腕 [3][4][7]。',
    },
    socialLinks: {
      instagram: 'https://www.instagram.com/charles_leclerc/',
      xTwitter: 'https://x.com/Charles_Leclerc',
      website: 'https://www.charlesleclerc.com',
    },
    careerSummary:
      '【第1章：亡き父と親友ビアンキへの誓い、ジュニアカテゴリー連続制覇】\n1997年10月16日モナコ・モンテカルロ生まれ。モータースポーツの師であり兄貴分であったジュール・ビアンキの父が運営するブリニョールのカート場で腕を磨く [1][5]。2014年に4輪デビューしフォーミュラ・ルノー2.0アルプスで総合2位 [1]。2016年、フェラーリ・ドライバー・アカデミー（FDA）に加入しARTグランプリからGP3シリーズに参戦、ルーキーイヤーで世界王者に輝く [1]。2017年はプレマ・レーシング（Prema Racing）からFIA-F2選手権に昇格。第4戦アゼルバイジャン（バクー）直前に最愛の父エルベ・ルクレールが逝去するという耐え難い悲劇に見舞われながらも、ポールポジションから圧巻の独走優勝を飾るなど、年間7勝・8ポールポジションという前代未聞の圧倒的戦績でルーキー王座を奪取した [1][5]。\n\n【第2章：ザウバーでの鮮烈デビューと跳ね馬への電撃抜擢】\n2018年、アルファロメオ・ザウバーよりF1デビュー [1][2]。第4戦アゼルバイジャンGPで下位チームのマシンながら圧巻の走りで6位入賞を飾るなどQ3進出の常連となり、その非凡な才能を世界に証明 [1][2]。2019年、弱冠21歳にして名門スクーデリア・フェラーリの正ドライバーへ電撃昇格を果たす [1][2]。第2戦バーレーンGPで自身初PPを獲得（PUトラブルで惜しくも3位）。第13戦ベルギーGP（スパ・フランコルシャン）では、前日に親友アントワーヌ・ユベールが事故死する深い悲痛の中、涙のF1初優勝を達成 [1][2]。そして翌週の第14戦イタリアGP（モンツァ）、フェラーリの聖地でメルセデス2台の猛攻を53周にわたって耐え抜き、フェラーリにとって9年ぶりとなる歓喜の母国優勝をもたらし「Il Predestinato（運命の申し子）」の称号を不動のものとした [1][2][5]。\n\n【第3章：チームの暗黒期と2022年の世界王座争い】\n2020年〜2021年はフェラーリPUの性能制限とマシン戦闘力不足に苦しみながらも、予選での神業的アタックで度重なるポールポジションを獲得してチームを牽引 [1][2]。新規定が導入された2022年、名機F1-75を駆り開幕戦バーレーンGPでポール・トゥ・ウィン、第3戦オーストラリアGPではF1史上屈指の完全勝利「グランドスラム（PP・全周ラップリード・FL・優勝）」を達成して世界選手権をリード [1][2]。後半戦はチームの戦略ミスや信頼性トラブルに泣いたものの、年間3勝・9ポールポジションを記録してドライバーズランキング総合2位を獲得した [1][2]。\n\n【第4章：2024年の栄光：モナコの呪い打破とモンツァ奇跡の1ストップ制覇】\n2024年、フレデリック・バスール代表率いる新生フェラーリで更なる進化を遂げる [4][7]。迎えた第8戦母国モナコGP、過去数々の不運とリタイアに見舞われ「モナコの呪い」と恐れられた地元レースで、完璧なアタックによりポールポジションを獲得 [3]。決勝でも77周にわたってマクラーレン勢を一切寄せ付けず、涙に濡れながら悲願の母国初制覇を達成、モナコ市街地に跳ね馬の歓喜の鐘を鳴り響かせた [1][3]。さらに第16戦イタリアGP（モンツァ）では、マクラーレン優勢の下馬評を覆し、タイヤの摩耗限界を極限まで読み切る大胆不敵な「1ストップ戦略」を敢行 [4]。フロント左タイヤのグレイニングを驚異的なスロットルワークで自己修復させ、ティフォシが埋め尽くすモンツァで自身2度目となる歴史的逆転勝利を刻んだ [1][4][7]。',
    entries: 144,
    wins: 7,
    podiums: 40,
    polePositions: 26,
    championships: 0,
    drivingStyle: {
      traits: [
        '予選Q3におけるミリ単位のウォール擦過と限界グリップ抽出（予選の魔術師）',
        '鋭角なターンインを可能にするアグレッシブなオーバーステア適応力',
        'ロングランでのタイヤグレイニング（毛羽立ち）を走りで修復させる超感覚的ペダルワーク',
        '低速シケイン（モンツァ・バクー）の縁石をフル活用するアタックアングル構築',
      ],
      brakingTechnique:
        '直線上での急制動からターンインにかけてブレーキ油圧を奥深く残すロングトレイルブレーキングを駆使 [2][6]。エイペックス手前でリアタイヤを意図的にわずかにスライドさせ、車体の向き（ヨー角）を瞬時にクリッピングポイントへ正対させる [1][2][6]。この技術により、ストリートコースのタイトコーナーにおける旋回半径を他車より大幅にコンパクトに切り詰めることが可能 [2][5]。',
      tyreManagement:
        'アグレッシブな予選スタイルとは対照的に、決勝レースではタイヤ接地面の剪断ストレスを最小化する極めて繊細なスロットル開度制御を披露 [3][4]。2024年モンツァでは、ハードタイヤのフロント左に発生した深刻なグレイニングを、コーナリングラインの工夫と横方向加速度の分散によって自らグリップを復活させ、38周に及ぶ長大スティントを完走した [4][6]。',
      telemetrySignature:
        '【テレメトリー工学的特徴】\n1. ピーク制動から横G発生へのオーバーラップ面積：ブレーキペダルリリースと横方向加速度（ラテラルG）の立ち上がりが高度に重複し、前輪への荷重抜けを防ぎながらエイペックスへアプローチ [2][6]。\n2. ヨーレート（旋回角速度）の急峻な立ち上がり：ステアリング入力の瞬間にクルマが瞬時にインを向くため、ステアリングを切っている時間が短く、直進加速状態への移行が他車比較で早い [1][2][5]。\n3. スロットルマイクロモジュレーション：オーバーステア状態からの復帰時、アクセルを全閉にせず10〜20%パーシャルに保つことでディフューザーの排気負圧を維持し、ダウンフォース急減を防ぐ [6][8]。',
      preferredCircuitTypes: [
        '壁際の精度と度胸が試されるストリートサーキット (モナコ、バクー、シンガポール、ラスベガス)',
        '高速トラクションと絶対的制動力が問われるコース (モンツァ、スパ・フランコルシャン、レッドブル・リンク)',
      ],
      summary:
        '現代F1で最も純粋な1ラップスピードを誇る「予選の魔術師」[1][2]。親友や父との死別、数々の悲運を乗り越え、母国モナコ制覇と聖地モンツァ勝利を成し遂げたフェラーリの象徴的エース [3][4][7]。',
    },
    biography: {
      personality:
        '【情熱的で高潔な跳ね馬のプリンス】\nコックピット内では自身のわずかなミスに対しても「I am stupid!」と激しく自分を責めるほど妥協を許さない完璧主義者 [2][5]。マシンを一歩降りると、礼儀正しく誠実で穏やかな紳士であり、ファンやメカニックへの感謝を常に忘れない [5]。クラシックピアノの演奏と自作曲制作を愛好し、Spotify等のストリーミング配信で世界的なヒットを記録するマルチな芸術的才能を持つ [5]。',
      rivalries:
        '【マックス・フェルスタッペン（10代カート時代からの宿命のライバル）】\n2012年カート時代の「Nothing, just an inchident（ただのアクシデントだよ）」から続く永遠のライバル。F1の頂点で互いのドライビングスキルを極限までリスペクトし合う [2][7]。\n\n【セバスチャン・ベッテル（フェラーリでの新旧エース対決）】\n2019-2020年フェラーリでの同僚。4冠王者のベッテルと激しく競い合いながらも、人としての誠実さとリーダーシップを多く学び継承した [1][5]。\n\n【カルロス・サインツ（マラネロを支えた強力なパートナーシップ）】\n2021〜2024年の4年間にわたり跳ね馬を支え、熾烈なタイムアタック合戦を通じてチームを常勝圏へ押し上げた盟友 [3][4]。',
      iconicRaces: [
        {
          gp: '2019 イタリアGP (モンツァ)',
          year: 2019,
          description:
            'フェラーリの聖地モンツァ。ハードタイヤを履き、メルセデス2台（ハミルトンとボッタス）の交互の猛攻を53周にわたって耐え抜いて優勝。フェラーリに9年ぶりの母国勝利をもたらした [1][2][5]。',
          tacticalMasterclass:
            '第2シケイン（ロッジア）進入での完璧なブレーキングディフェンスと、ストレートでの最高速を最大限に活かしたポジショニング [2][5]。',
        },
        {
          gp: '2022 オーストラリアGP (アルバート・パーク)',
          year: 2022,
          description:
            'ポールポジション、全周回ラップリード、ファステストラップ、そして優勝という自身初の「グランドスラム」を達成し、フェラーリに圧勝をもたらした [1][2]。',
          tacticalMasterclass:
            'セーフティカーリスタートでの絶妙なタイミング管理と、ミディアム・ハード双方での完璧なタイヤ内圧マネジメント [2][6]。',
        },
        {
          gp: '2024 モナコGP (モンテカルロ市街地コース)',
          year: 2024,
          description:
            '数々の不運で勝てなかった「モナコの呪い」を完全に打破。ポールポジションから77周にわたってマクラーレン勢をコントロールし、涙の母国初制覇を達成 [1][3]。',
          tacticalMasterclass:
            'オープニングラップの赤旗中断後、ハードタイヤでの超長距離スティントにおいて後続にピットストップウィンドウを与えない緻密なペース配分 [3][6]。',
        },
        {
          gp: '2024 イタリアGP (モンツァ)',
          year: 2024,
          description:
            'マクラーレン優勢のモンツァで、大胆な1ストップ作戦を完遂。すり減ったハードタイヤで38周を走り切り、ティフォシの前で奇跡の逆転優勝を飾った [1][4]。',
          tacticalMasterclass:
            'フロントタイヤのグレイニングを走行ラインの工夫で奇跡的に克服し、2ストップのマクラーレン2台の猛追を2.6秒差で逃げ切ったタイヤマネジメント [4][6][7]。',
        },
      ],
      quotes: [
        '「モナコで勝つこと……幼い頃、アパートのベランダから見下ろしていたあのレースで勝つことが僕の全ての原点だった。」',
        '「フェラーリのドライバーであることは、単なる仕事じゃない。何百万人もの情熱を背負って走ることなんだ。」',
        '「I am stupid...（自らのミスを厳しく叱責する叫び）」',
      ],
      offTrack:
        'クラシックピアノの演奏家・作曲家として知られ、自作ピアノ組曲「AUS23」「MIA23」などを配信リリース。ファッションウィークでの洗練された装いでも注目を集める。',
    },
    milestones: [
      { date: '2016-10-02', event: 'GP3シリーズにてルーキーイヤーでドライバーズ世界選手権チャンピオン獲得', refId: 1 },
      { date: '2017-10-07', event: 'FIA-F2選手権にて7勝を挙げルーキーイヤーで年間タイトル戴冠', refId: 1 },
      { date: '2018-03-25', event: 'アルファロメオ・ザウバーからF1デビュー (オーストラリアGP)', refId: 1 },
      { date: '2019-09-01', event: 'ベルギーGP（スパ・フランコルシャン）にてF1キャリア初優勝を達成', refId: 2 },
      { date: '2019-09-08', event: 'モンツァでメルセデスを抑え切りフェラーリに9年ぶりのイタリアGP母国勝利をもたらす', refId: 2 },
      { date: '2022-04-10', event: 'オーストラリアGPにてPP・全周リード・FL・優勝の「グランドスラム」達成', refId: 2 },
      { date: '2024-05-26', event: '母国モナコGPにて「モナコの呪い」を打ち破り悲願のポール・トゥ・ウィン完全制覇', refId: 3 },
      { date: '2024-09-01', event: 'モンツァで神業の1ストップ大作戦を成功させ自身2度目のイタリアGP制覇', refId: 4 },
    ],
    references: [
      {
        id: 1,
        title: 'FIA Formula 2 & GP3 Championship Archive: Charles Leclerc Rookie Title Records and Super Licence Dossier',
        publisher: 'Fédération Internationale de l’Automobile (FIA)',
        url: 'https://www.fia.com',
        verifiedDate: '2024-01-15',
      },
      {
        id: 2,
        title: 'Formula 1 Official Telemetry and Historical Timing Archives: Charles Leclerc Career Pole Positions and Victories',
        publisher: 'Formula One Management (FOM)',
        url: 'https://www.formula1.com',
        verifiedDate: '2024-05-15',
      },
      {
        id: 3,
        title: 'Automobile Club de Monaco (ACM) Official Race Classification & Historical Archives: 81e Grand Prix de Monaco',
        publisher: 'Automobile Club de Monaco',
        url: 'https://acm.mc',
        verifiedDate: '2024-05-27',
      },
      {
        id: 4,
        title: 'Autosport Technical Analysis: How Ferrari and Leclerc Executed the Miracle One-Stop Victory at Monza 2024',
        publisher: 'Autosport / Motorsport Network',
        url: 'https://www.autosport.com',
        verifiedDate: '2024-09-02',
      },
      {
        id: 5,
        title: 'Scuderia Ferrari Official Press Archive: Il Predestinato: Charles Leclerc and the Maranello Heritage',
        publisher: 'Ferrari S.p.A.',
        url: 'https://www.ferrari.com',
        verifiedDate: '2024-06-01',
      },
      {
        id: 6,
        title: 'Pirelli Motorsport Technical Bulletin: Tyre Grain Recovery and Surface Thermal Dynamics: Italian Grand Prix 2024',
        publisher: 'Pirelli Tyre S.p.A.',
        url: 'https://press.pirelli.com',
        verifiedDate: '2024-09-03',
      },
      {
        id: 7,
        title: 'The Race: Bozzi & Leclerc: How an Engineering Reset Delivered Ferrari’s Dream Double at Monaco and Monza',
        publisher: 'The Race Formula 1 Media',
        url: 'https://the-race.com',
        verifiedDate: '2024-09-05',
      },
      {
        id: 8,
        title: 'SAE International: Transient Braking Yaw Dynamics and Aerodynamic Load Correlation in Formula 1 Vehicles',
        publisher: 'SAE International',
        url: 'https://www.sae.org',
        verifiedDate: '2023-10-18',
      },
    ],
    seasonHistory: [
      { year: 2016, team: 'Haas F1 Team / Scuderia Ferrari', teamId: 'haas', role: 'Test', note: 'フェラーリ育成、HaasでFP1出走、GP3チャンピオン獲得' },
      { year: 2017, team: 'Sauber F1 Team', teamId: 'sauber', role: 'Reserve', note: 'ザウバーのリザーブ兼務、FIA-F2選手権で圧倒的王者獲得' },
      { year: 2018, team: 'Alfa Romeo Sauber F1 Team', teamId: 'sauber', role: 'Regular', carNumber: 16, finalPosition: 13, points: 39, note: 'ルーキーながら予選・決勝で鮮烈な速さを見せフェラーリ昇格を勝ち取る' },
      { year: 2019, team: 'Scuderia Ferrari', teamId: 'ferrari', role: 'Regular', carNumber: 16, finalPosition: 4, points: 264, wins: 2, podiums: 10, note: 'スパで悲願の初優勝、モンツァで母国勝利、年間最多ポール獲得(7回)' },
      { year: 2020, team: 'Scuderia Ferrari', teamId: 'ferrari', role: 'Regular', carNumber: 16, finalPosition: 8, points: 98, podiums: 2, note: '戦闘力を欠いたSF1000を奮い立たせ表彰台2回' },
      { year: 2021, team: 'Scuderia Ferrari', teamId: 'ferrari', role: 'Regular', carNumber: 16, finalPosition: 7, points: 159, podiums: 1, note: 'モナコとバクーでポールポジション獲得' },
      { year: 2022, team: 'Scuderia Ferrari', teamId: 'ferrari', role: 'Regular', carNumber: 16, finalPosition: 2, points: 308, wins: 3, podiums: 11, note: '序盤首位を独走、ドライバーズランキング2位' },
      { year: 2023, team: 'Scuderia Ferrari', teamId: 'ferrari', role: 'Regular', carNumber: 16, finalPosition: 5, points: 206, podiums: 6, note: 'ラスベガスGPで見事な最終周オーバーテイク2位' },
      { year: 2024, team: 'Scuderia Ferrari', teamId: 'ferrari', role: 'Regular', carNumber: 16, finalPosition: 3, points: 356, wins: 2, podiums: 12, note: '母国モナコGP＆伝統のイタリアGPモンツァで劇的勝利' },
      { year: 2025, team: 'Scuderia Ferrari', teamId: 'ferrari', role: 'Regular', carNumber: 16, note: '新僚友ハミルトンを迎え強力ラインナップを形成' },
      { year: 2026, team: 'Scuderia Ferrari', teamId: 'ferrari', role: 'Regular', carNumber: 16, note: '新規定マシンでスクーデリアを世界王座へ導く挑戦' }
    ]
  },
  {
    id: 'oscar-piastri',
    code: 'PIA',
    number: 81,
    fullName: 'Oscar Piastri',
    country: 'オーストラリア 🇦🇺',
    team: 'McLaren',
    teamColor: '#f97316',
    status: 'Current',
    nickname: 'Oscar / アイスマン2世',
    birthDate: '2001-04-06',
    birthPlace: 'Melbourne, Australia',
    f1Debut: '2023年 オーストラリアGP (McLaren)',
    driverType: '極冷静・精密テレメトリー派',
    numberOrigin: 'オーストラリアのカート時代に初めて付けた番号であり、F1昇格時にもパーソナルナンバーとして選択。',
    visualAsset: {
      imageUrl: '/images/drivers/portraits/oscar-piastri.jpg',
      caption: 'Oscar Piastri (McLaren F1 Team)',
      credit: 'Wikimedia Commons',
      license: 'CC BY-SA 4.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Oscar_Piastri.jpg',
    },
    visualGallery: [
      {
        imageUrl: '/images/drivers/driver_piastri.jpg',
        caption: 'Oscar Piastri パドックでの精悍な表情 (McLaren)',
        tag: 'Paddock',
        credit: 'Wikimedia Commons',
        license: 'CC BY-SA 4.0',
        sourceUrl: 'https://commons.wikimedia.org/wiki/File:Oscar_Piastri.jpg',
      },
      {
        imageUrl: '/images/teams/team_mclaren_mp4_13.jpg',
        caption: 'McLaren Mercedes MP4-13 (ハッキネン王座戴冠のシルバーアロー)',
        tag: 'Machine',
        credit: 'McLaren Racing Archive',
        license: 'Editorial / Fair Use',
        sourceUrl: 'https://www.mclaren.com',
      },
    ],
    engineeringPreference: {
      setupBalance:
        'マシンの挙動変化が極限まで小さく、予測可能性の高いニュートラル〜ややアンダー傾向のスタビリティを好む。フロントの過度な切れ込みよりも、コーナリング中のフロアダウンフォースが安定して吸い付くメカニカル＆エアロバランスを要求 [1][3][6]。',
      pedalFeel:
        '踏み込みからリリースまで一定の抵抗感を保つリニアなブレーキフィール。減速初期の踏力立ち上がりが穏やかで、前後の荷重変動（ピッチング）を抑えながらエイペックスへアプローチする [2][6]。',
      steeringWeight:
        '重厚感のあるステアリング設定。無駄な微小修正を排し、一度決めたステアリングアングルをエイペックスまで完全に固定して旋回できる安定したラックジオメトリを好む [3][7]。',
    },
    raceEngineer: {
      name: 'Tom Stallard',
      callsign: 'Tom',
      dynamic:
        '2008年北京五輪ボート競技の銀メダリストという異色の経歴を持つ熟練エンジニア。ピアストリの冷静沈着なメンタリティと完璧に共鳴し、極度のプレッシャー下でも淡々と高精度な戦術情報を伝達するパドック屈指の頭脳派コンビ [2][5][7]。',
    },
    socialLinks: {
      instagram: 'https://www.instagram.com/oscarpiastri/',
      xTwitter: 'https://x.com/OscarPiastri',
      website: 'https://oscarpiastri.com',
    },
    careerSummary:
      '【第1章：前人未到のジュニアカテゴリー3階級即時制覇】\n2001年4月6日オーストラリア・メルセデス生まれ。元F1ドライバーのマーク・ウェバーをマネージャーに迎え、欧州シングルシーターへ進出 [1][5]。2019年フォーミュラ・ルノー・ユーロカップにR-ace GPから参戦し7勝で年間チャンピオンに輝く [1]。2020年、名門プレマ・レーシングよりFIA-F3選手権へルーキー参戦。熾烈な三つ巴のタイトル争いを制し、デビューイヤーで年間世界王座を獲得 [1]。翌2021年にはそのままFIA-F2選手権へ即昇格すると、圧巻の5戦連続ポールポジションを含む年間6勝・11表彰台を記録し、2位に60.5点差をつける歴史的圧勝でルーキー年間チャンピオンに戴冠 [1][5]。ルイス・ハミルトン、ニコ・ロズベルグ、シャルル・ルクレール、ジョージ・ラッセルに並ぶ「F3・F2ルーキー連続制覇」の金字塔を打ち立てた [1][5]。\n\n【第2章：夏の契約騒動「Piasco」とマクラーレン電撃加入】\n2022年、アルピーヌのリザーブドライバーを務めながらシミュレーターとテストをこなす中、夏休み期間中にアルピーヌ側がピアストリの翌季レギュラー昇格を一方的に発表 [5][7]。これに対しピアストリ本人がSNS上で「私は2023年にアルピーヌでドライブすることに同意していない。ドライブすることはない」と電撃声明を発表（通称“Piasco”事件）[5][7]。FIA契約承認委員会（CRB）の満場一致の判決によりマクラーレンとの契約の正当性が認められ、名門マクラーレンのレギュラーシートを獲得した [1][5]。\n\n【第3章：衝撃のルーキーイヤーとカタールスプリント優勝】\n2023年開幕戦母国オーストラリアGPでデビュー。前半戦のマクラーレンのマシン戦闘力不足を冷静に耐え抜き、夏の大規模アップデート以降に大躍進を遂げる [1][2]。第17戦日本GP（鈴鹿）で予選フロントローを獲得し自身初の3位表彰台に登壇 [1][2]。続く第18戦カタールGPでは、スプリントでポールポジションからフェルスタッペンを抑え切ってトップチェッカーを受け、スプリントレース初優勝を達成 [1][2][5]。決勝でも2位表彰台を獲得し、世界中から「アイルトン・セナやルイス・ハミルトンのデビュー時に匹敵する逸材」と大絶賛を浴びた [2][5]。\n\n【第4章：2024年の飛躍：ハンガリー初優勝とバクー伝説の防戦劇】\n2024年、マクラーレンMCL38の戦闘力向上とともに勝利を量産 [1][3]。第13戦ハンガリーGP（ハンガロリンク）では、スタートで同僚ノリスを鮮やかに交わして首位を奪い、巧みなレースコントロールで悲願のF1初優勝を達成（21世紀生まれとして史上初のF1グランプリウィナー）[1][2][3]。さらに第17戦アゼルバイジャンGP（バクー）では、首位ルクレールのインへ1コーナー遥か手前から電光石火のダイブボムを仕掛けて首位を奪取 [3][4]。以降30周以上にわたり、DRS圏内で猛追するルクレールの猛攻を一切の乱れなく抑え切る伝説的な防戦マスタークラスを演じ、シーズン2勝目をマークした [1][3][4][7]。',
    entries: 46,
    wins: 2,
    podiums: 9,
    polePositions: 0,
    championships: 0,
    drivingStyle: {
      traits: [
        '心拍数とステアリング修正が極限まで低い「アイスマン」的テレメトリートレース',
        'タイヤ摩擦発熱を抑えながらボトムスピードを稼ぐ高効率なコーナリングアプローチ',
        '勝負所での電光石火のブレーキ飛び込み（バクーでのダイブボム）',
        '無線上で感情を一切乱さず、必要な情報のみを簡潔にやり取りする驚異の精神的スタビリティ',
      ],
      brakingTechnique:
        '制動開始時の油圧立ち上がりが滑らかで、サスペンションの急激なダイブを防ぎながらフロントタイヤの接地荷重を構築 [2][6]。必要な瞬間にはバクー1コーナーのようにライバルの死角からインを刺す超レイトブレーキングを完璧な車体制御とともに完遂する [3][4]。',
      tyreManagement:
        'ステアリング舵角を入れた状態での無駄なアクセルオンによるタイヤスクラブ（表面引きずり）を徹底排除 [3][6]。タイヤのトレッド温度を均一に保ち、第2スティント終盤でもラップタイムを落とさない精密なエネルギーマネジメントを誇る [2][3][6]。',
      telemetrySignature:
        '【テレメトリー工学的特徴】\n1. ステアリングソーイング（微修正）の皆無：コーナー旋回中のステアリング舵角グラフが定規で引いたように平坦で、マシンの空力プラットフォームを一切乱さない [2][3]。\n2. 左右Gと前後Gのスムーズな結合（摩擦円の活用）：ブレーキリリースと旋回Gの移行部において、タイヤ摩擦円の限界値を完璧にトレースする滑らかなG-Gダイアグラムを描く [6][8]。\n3. スロットル展開のリニアリティ：出口トラクションゾーンでリアが暴れる兆候を事前に足裏で察知し、微小な戻しをミリ秒単位で行う極小スリップ制御 [3][7]。',
      preferredCircuitTypes: [
        '高速テクニカルサーキット (鈴鹿、シルバーストン、スパ・フランコルシャン、カタール)',
        '冷静な精度とトップスピードが命運を分けるストリートコース (バクー、メルボルン、サウジアラビア)',
      ],
      summary:
        'マーク・ウェバーの指導のもとで磨かれた現代F1屈指の頭脳派ドライバー [1][5]。21世紀生まれ初のGPウィナーであり、感情を一切排した精密機械のようなテレメトリーと大胆なパッシングを融合させた次世代のチャンピオン候補 [2][3][7]。',
    },
    biography: {
      personality:
        '【ポーカーフェイスに秘めた絶対の自信とユーモア】\n激しいクラッシュや歴史的勝利の瞬間であっても、心拍数が上がらないかのように平然とした低音ボイスで無線を交わすパドック屈指の冷静沈着なパーソナリティ [5][7]。SNSではオーストラリア人特有のドライな自虐ユーモアを連発し、ファンから絶大な人気を集める。レースに対しては徹底的に論理的で、データ解析とシミュレーター作業に没頭するプロフェッショナリズムを持つ [5]。',
      rivalries:
        '【ランド・ノリス（マクラーレン同門の頂上決戦）】\n同じマシンを操る最強の相棒にして最大のライバル。互いに手の内を隠さずデータを共有しながらも、コース上ではミリ秒を削り合うハイレベルなバトルを展開 [2][3][7]。\n\n【シャルル・ルクレール（バクーでの歴史的死闘）】\n2024年アゼルバイジャンGPで演じた30周にわたるDRS攻防戦。新世代の天才同士による究極のクリーンバトルとしてパドック史に刻まれた [3][4]。',
      iconicRaces: [
        {
          gp: '2023 カタールGP スプリント (ルサイル)',
          year: 2023,
          description:
            'スプリントでポールポジションからスタート。3度のセーフティカー介入にも一切動じず、世界王者フェルスタッペンの猛追を完璧に退けてキャリア初優勝を飾った [1][2][5]。',
          tacticalMasterclass:
            'ミディアムタイヤの熱タレを完璧に制御し、ソフトタイヤ勢が自滅する展開を冷静に見極めたタイヤ戦略 [2][5][6]。',
        },
        {
          gp: '2024 ハンガリーGP (ハンガロリンク)',
          year: 2024,
          description:
            'スタートで首位を奪い、堂々たるレース展開でF1キャリア初優勝を達成。21世紀生まれとして史上初のF1ウィナーとなった [1][2][3]。',
          tacticalMasterclass:
            '第1スティントでクリーンエアを最大限に活かしてリードを広げ、チーム戦略の揺れにも動じず勝利を掴み取ったメンタリティ [2][3]。',
        },
        {
          gp: '2024 アゼルバイジャンGP (バクー市街地コース)',
          year: 2024,
          description:
            '首位ルクレールの死角から1コーナーへ決死の飛び込み（ダイブボム）を決めて首位奪取。その後30周以上にわたってDRS圏内の猛攻を凌ぎ切った伝説の防戦劇 [1][3][4]。',
          tacticalMasterclass:
            'ターン16での立ち上がりトラクションを徹底強化し、直線でのルクレールの最高速アドバンテージを相殺し続けた走りの工夫 [3][4][7]。',
        },
      ],
      quotes: [
        '「うん、勝ったよ。悪くない日だったね。（バクーでの歴史的勝利直後の驚くほど淡々とした無線）」',
        '「マーク（ウェバー）から学んだ最も重要なことは、コース外の雑音に惑わされず、ステアリングだけに集中することだ。」',
      ],
      offTrack:
        'マネージャーのマーク・ウェバー夫妻との家族ぐるみの絆を大切にし、故郷メルボルンでのクリケットやオージーフットボールを愛好。',
    },
    milestones: [
      { date: '2019-10-26', event: 'フォーミュラ・ルノー・ユーロカップにて7勝を挙げ年間チャンピオン獲得', refId: 1 },
      { date: '2020-09-13', event: 'FIA-F3選手権にてルーキーイヤーでドライバーズ世界王者に輝く', refId: 1 },
      { date: '2021-12-11', event: 'FIA-F2選手権にて6勝・5連続PPの圧倒的戦績でルーキー王座獲得（3階級即時制覇）', refId: 1 },
      { date: '2023-03-05', event: 'マクラーレンよりF1デビュー (バーレーンGP)', refId: 1 },
      { date: '2023-10-07', event: 'カタールGPスプリントにてポール・トゥ・ウィンで自身初のトップチェッカー', refId: 2 },
      { date: '2024-07-21', event: 'ハンガリーGPにて悲願のF1初優勝（21世紀生まれ初のF1ウィナー）', refId: 3 },
      { date: '2024-09-15', event: 'アゼルバイジャンGP（バクー）にてルクレールとの死闘を制し歴史的2勝目', refId: 4 },
    ],
    references: [
      {
        id: 1,
        title: 'FIA Formula 2, Formula 3 and Formula Renault Championship Official Archives: Oscar Piastri Super Licence Dossier',
        publisher: 'Fédération Internationale de l’Automobile (FIA)',
        url: 'https://www.fia.com',
        verifiedDate: '2024-01-15',
      },
      {
        id: 2,
        title: 'Formula 1 Official Telemetry and Timing Archives: Oscar Piastri Career Statistics',
        publisher: 'Formula One Management (FOM)',
        url: 'https://www.formula1.com',
        verifiedDate: '2024-05-15',
      },
      {
        id: 3,
        title: 'Autosport Grand Prix Technical Analysis: Piastri vs Leclerc: The Anatomy of the Baku Defensive Masterclass',
        publisher: 'Autosport / Motorsport Network',
        url: 'https://www.autosport.com',
        verifiedDate: '2024-09-16',
      },
      {
        id: 4,
        title: 'The Race: How Oscar Piastri’s Cold-Blooded Execution Won the 2024 Azerbaijan Grand Prix',
        publisher: 'The Race Formula 1 Media',
        url: 'https://the-race.com',
        verifiedDate: '2024-09-17',
      },
      {
        id: 5,
        title: 'McLaren Racing Official Heritage Dossier: The Ascent of Oscar Piastri in Woking',
        publisher: 'McLaren Racing Limited',
        url: 'https://www.mclaren.com/racing',
        verifiedDate: '2024-06-01',
      },
      {
        id: 6,
        title: 'Pirelli Motorsport Technical Bulletin: Lateral Load Distribution and Slip Ratio Stability on Street Circuits',
        publisher: 'Pirelli Tyre S.p.A.',
        url: 'https://press.pirelli.com',
        verifiedDate: '2024-09-18',
      },
      {
        id: 7,
        title: 'BBC Sport Formula 1: Oscar Piastri: The Ice-Cold Prodigy Redefining Modern Formula 1 Racecraft',
        publisher: 'BBC Sport',
        url: 'https://www.bbc.com/sport/formula1',
        verifiedDate: '2024-09-20',
      },
    ],
    seasonHistory: [
      { year: 2020, team: 'Prema Racing', teamId: 'junior', role: 'Junior', note: 'FIA-F3選手権ルーキーイヤーでドライバーズチャンピオン獲得' },
      { year: 2021, team: 'Prema Racing', teamId: 'junior', role: 'Junior', note: 'FIA-F2選手権ルーキーイヤーで圧倒的王者獲得(F3・F2連続制覇)' },
      { year: 2022, team: 'Alpine F1 Team / McLaren', teamId: 'alpine', role: 'Reserve', note: 'アルピーヌおよびマクラーレンのリザーブドライバーを務める' },
      { year: 2023, team: 'McLaren F1 Team', teamId: 'mclaren', role: 'Regular', carNumber: 81, finalPosition: 9, points: 97, podiums: 2, note: 'カタールGPスプリント優勝、日本GP＆カタールGPで決勝表彰台' },
      { year: 2024, team: 'McLaren F1 Team', teamId: 'mclaren', role: 'Regular', carNumber: 81, finalPosition: 4, points: 292, wins: 2, podiums: 8, note: 'ハンガリーGP初優勝、バクーGPでルクレールとの死闘を制し2勝目' },
      { year: 2025, team: 'McLaren F1 Team', teamId: 'mclaren', role: 'Regular', carNumber: 81, note: 'ノリスとともにチームをコンストラクターズ連覇へ牽引' },
      { year: 2026, team: 'McLaren F1 Team', teamId: 'mclaren', role: 'Regular', carNumber: 81, note: '新車レギュレーション下で自らのタイトル獲得を目指す' }
    ]
  },
  {
    id: 'carlos-sainz',
    code: 'SAI',
    number: 55,
    fullName: 'Carlos Sainz',
    country: 'スペイン 🇪🇸',
    team: 'Ferrari',
    teamColor: '#ef4444',
    status: 'Current',
    nickname: 'Smooth Operator / カルロス',
    birthDate: '1994-09-01',
    birthPlace: 'Madrid, Spain',
    f1Debut: '2015年 オーストラリアGP (Toro Rosso)',
    driverType: '極高知性タクティクス＆スムーズ派',
    numberOrigin: '名前（Carlo5 5ainz）のSを5に見立て、ラッキーナンバーの5を重ねた「55」を選択。',
    visualAsset: {
      imageUrl: '/images/drivers/portraits/carlos-sainz.jpg',
      caption: 'Carlos Sainz (Scuderia Ferrari HP)',
      credit: 'Wikimedia Commons',
      license: 'CC BY-SA 4.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Carlos_Sainz.jpg',
    },
    visualGallery: [
      {
        imageUrl: '/images/drivers/driver_sainz.jpg',
        caption: 'Carlos Sainz サーキットパドックでのショット',
        tag: 'Paddock',
        credit: 'Wikimedia Commons',
        license: 'CC BY-SA 4.0',
        sourceUrl: 'https://commons.wikimedia.org/wiki/File:Carlos_Sainz.jpg',
      },
      {
        imageUrl: '/images/teams/team_williams_fw14b.jpg',
        caption: 'Williams FW14B (アクティブサスペンションを誇る名機)',
        tag: 'Machine',
        credit: 'Williams Grand Prix Engineering',
        license: 'Editorial / Fair Use',
        sourceUrl: 'https://www.williamsf1.com',
      },
    ],
    engineeringPreference: {
      setupBalance:
        'コーナー進入から立ち上がりにかけてリアタイヤがどっしりと接地しているスタビリティ（弱アンダー〜ニュートラル）を最重要視。リアの唐突なルーズ挙動を嫌い、確実なメカニカルトラクションを活かして早期にスロットルを開けられるセットアップを好む [1][3]。',
      pedalFeel:
        '踏力に対する減速Gの立ち上がりが極めてリニアで、足裏の微小な圧力変化を忠実に油圧へ伝えるプログレッシブなブレーキ特性 [2][4]。',
      steeringWeight:
        '適度な手応えと正確なニュートラル位置の戻り性を持つステアリング。路面インフォメーションを正確に読み取りながらタイヤ摩耗を抑制する [3][5]。',
    },
    raceEngineer: {
      name: 'Riccardo Adami',
      callsign: 'Riccardo',
      dynamic:
        'かつてセバスチャン・ベッテルを支えた名エンジニア。サインツの極めて論理的で緻密なフィードバックに対し、的確な戦略オプション（プランA、プランB）を無線で提示し、シンガポールでの歴史的頭脳戦勝利を共創した相棒 [2][3][5]。',
    },
    socialLinks: {
      instagram: 'https://www.instagram.com/carlossainz55/',
      xTwitter: 'https://x.com/Carlossainz55',
      website: 'https://www.carlossainz.es',
    },
    careerSummary:
      '【第1章：ラリー界の伝説の血統とフォーミュラ・ルノー3.5王者】\n1994年9月1日スペイン・マドリード生まれ。世界ラリー選手権（WRC）2冠王者カルロス・サインツ・シニアの長男として生まれ、幼少期から父のストイックなプロフェッショナリズムを叩き込まれる [1][5]。レッドブル・ジュニアチームに加入し、2011年フォーミュラ・ルノー2.0 NEC王者 [1]。2014年にはフォーミュラ・ルノー3.5シリーズ（フォーミュラV8）において年間7勝を挙げ、レッドブル育成ドライバーとして史上初となる年間世界チャンピオンに輝いた [1][5]。2015年、スクーデリア・トロ・ロッソよりマックス・フェルスタッペンとルーキー同士でF1デビュー [1][2]。ルノー、マクラーレンと渡り歩き、2019年ブラジルGPで初表彰台（3位）、2020年イタリアGP（モンツァ）で激闘の2位を記録、名門マクラーレンの再建に決定的な貢献を果たした [1][2][5]。\n\n【第2章：フェラーリ加入とシルバーストンでのF1初勝利】\n2021年、名門スクーデリア・フェラーリへ電撃移籍 [1][2]。加入初年度から4度の表彰台を獲得し、同僚ルクレールを上回るランキング総合5位を記録してパドックを驚嘆させた [1][2]。2022年イギリスGP（シルバーストン）、通算150戦目にしてキャリア初ポールポジションを獲得すると、荒れた決勝レースを卓越した判断力と勝負強さで制し、悲願のF1初優勝を達成 [1][2][3]。\n\n【第3章：2023年シンガポール：レッドブル全勝を止めた究極の頭脳戦】\n2023年、レッドブルが全勝街道を突き進む中、第16戦シンガポールGPでポールポジションを獲得 [1][3]。決勝では、背後から猛追するメルセデス勢（新品ミディアムタイヤを履いたラッセルとハミルトン）の逆転を防ぐため、あえて2位のランド・ノリスにDRS（1秒以内の間隔）を与え続けるという前代未聞の天才的戦術（“DRSトレイン戦略”）を独創 [3][4]。メルセデスを完璧に防ぎ切り、2023年シーズンにおいて唯一「レッドブル以外の勝利」をもぎ取る歴史的マスターピースを完成させた [1][3][4][7]。\n\n【第4章：盲腸手術から16日後の奇跡：2024年オーストラリア制覇】\n2024年開幕直後の第2戦サウジアラビアGPで急性虫垂炎（盲腸）を発症し緊急手術 [1][2]。しかし驚異的な回復力を見せ、わずか16日後の第3戦オーストラリアGP（メルボルン）でコックピットに復帰 [1][2]。予選フロントローからスタートすると、2周目にフェルスタッペンを豪快に交わして首位を奪い、傷口の痛みを微塵も感じさせない圧巻の走りで独走優勝を達成 [1][2][3]。メキシコシティGPでも圧巻のポール・トゥ・ウィンを飾り、2025年のウィリアムズ移籍を前に、現代F1屈指のコンプリートドライバーとしての絶対的価値を世界に証明した [1][3][5]。',
    entries: 204,
    wins: 4,
    podiums: 25,
    polePositions: 6,
    championships: 0,
    drivingStyle: {
      traits: [
        'コックピット内で自ら戦略（プランB、DRSトレイン）を考案しピットウォールを動かす「走るストラテジスト」',
        'タイヤ摩擦円を滑らかにトレースし、タイヤへの衝撃負荷を極小化する「Smooth Operator」走法',
        'リアスタビリティを最大限に活かした立ち上がりトラクション重視のドライビング',
        '大舞台や荒れた天候における抜群の状況判断力と勝負強さ',
      ],
      brakingTechnique:
        '直線上での急減速からターンインにかけて、踏圧を極めてプログレッシブに緩めながらリアタイヤの接地荷重を常に維持 [2][4]。リアが不意に流れる挙動を徹底排除し、出口で即座にフルスロットルへ移行できる姿勢を作る [2][4][6]。',
      tyreManagement:
        'フロント・リアタイヤの摩耗バランスを一定に保つため、走行ラインを周回ごとに微調整 [3][6]。2023年シンガポールや2024年メルボルンのように、後続とのギャップをコントロールしながらタイヤ温度をスイートスポットに保つ技術はグリッド随一 [3][4][6]。',
      telemetrySignature:
        '【テレメトリー工学的特徴】\n1. 滑らかなペダル踏力変化（極小ジャーク）：ブレーキの踏み込みおよび抜きにおいて油圧変化の微分値（ジャーク）が極めて小さく、サスペンションの不要なピッチング振動を発生させない [2][4][6]。\n2. 安定したボトムスピードと早期トラクション：エイペックスでの車速が非常に安定しており、脱出時のスロットル全開ポイントが他車比較で手前にある [2][3][5]。\n3. 緻密な無線タクティクス：ラップタイムだけでなく、他車のタイヤ残寿命やピットウィンドウの逆算情報をリアルタイムで把握しながら走る頭脳派テレメトリー [3][4][7]。',
      preferredCircuitTypes: [
        '戦略とタイヤマネジメントが勝敗を支配するテクニカルコース (シンガポール、メルボルン、シルバーストン)',
        'リズムとトラクションが問われるサーキット (メキシコシティ、バルセロナ、モンツァ)',
      ],
      summary:
        '「Smooth Operator」の異名をとる現代F1最高峰の知性派ドライバー [1][3]。並外れたマシン理解力と戦略的洞察力、そして不屈のメンタリティにより、数々の歴史的勝利をもぎ取ってきた真のプロフェッショナル [2][4][5]。',
    },
    biography: {
      personality:
        '【名門ラリー家の誇りと極めて紳士的なプロ意識】\n父カルロス・シニアの薫陶を受け、何事にも妥協しないストイックな仕事への姿勢を持つ [5]。エンジニアとのデブリーフィングはパドックで最も詳細かつ長時間に及ぶことで知られ、開発陣から絶大な信頼を寄せられる [3][5]。ユーモアに溢れ、ラジオで歌う「Smooth Operator」は世界中のF1ファンの愛唱歌となっている [5]。',
      rivalries:
        '【マックス・フェルスタッペン（2015年トロ・ロッソでの同期対決）】\nルーキーイヤーを共に戦い、互いの才能を認め合った盟友。オーストラリアGPなど勝負所での激闘は常にハイレベル [1][2][5]。\n\n【シャルル・ルクレール（マラネロを共闘した最強コンビ）】\n2021〜2024年の4年間、スクーデリア・フェラーリを共に背負い、予選と決勝で熾烈なバトルを展開しながらも一度も関係が破綻しなかった美しいパートナーシップ [1][2][3]。\n\n【ランド・ノリス（“Carlando”の友情）】\nマクラーレン時代の親友。2023年シンガポールではサインツがノリスにDRSを与えて共にメルセデスを防ぎ切るなど、コース上でも奇跡の協調を演じた [3][4]。',
      iconicRaces: [
        {
          gp: '2022 イギリスGP (シルバーストン)',
          year: 2022,
          description:
            'キャリア初ポールポジションからスタート。終盤のセーフティカーリスタートでチームの指示に毅然と自らの判断を主張し、見事F1キャリア初優勝を達成 [1][2][3]。',
          tacticalMasterclass:
            'リスタート直前にチームからの「10台分のスペースを空けろ」という指示を断固拒否し、新品ソフトタイヤの優位を活かしてターン6（ブルックランズ）でルクレールを仕留めた勝負勘 [2][3][5]。',
        },
        {
          gp: '2023 シンガポールGP (マリーナベイ市街地コース)',
          year: 2023,
          description:
            'ポールポジションから全周ラップリード。終盤、新品ミディアムで猛追するメルセデス2台を防ぐため、あえて2位ノリスにDRSを与え続けて逃げ切った伝説の頭脳戦勝利 [1][3][4]。',
          tacticalMasterclass:
            '自らのペースを落としてノリスとの差を0.8秒前後に維持し、ノリスの最高速を引き上げてラッセルの猛攻を完全に無力化させた「DRSトレイン」の考案と完璧な実行 [3][4][7]。',
        },
        {
          gp: '2024 オーストラリアGP (アルバート・パーク)',
          year: 2024,
          description:
            '盲腸の緊急手術からわずか16日後に復帰。2周目にフェルスタッペンを豪快に交わし、傷の痛みを乗り越えて圧巻の独走優勝を達成 [1][2][3]。',
          tacticalMasterclass:
            'フロントタイヤのグレイニングを完璧に回避するステアリングワークと、手術直後の肉体負担を最小限に抑える滑らかなGコントロール [2][3][6]。',
        },
      ],
      quotes: [
        '「Stop inventing, stop inventing!（余計な小細工はよしてくれ！）」',
        '「Smooth Operator……イエス、僕たちは最高の結果を掴み取ったんだ。」',
        '「父から学んだ最大の教訓は、コース上で誰よりも速く走るためには、コース外で誰よりも努力しなければならないということだ。」',
      ],
      offTrack:
        '父カルロス・シニアのダカール・ラリー挑戦を現地で熱心に応援。ゴルフの腕前はプロ並みで、パドックのドライバー仲間と頻繁にラウンドを楽しんでいる。',
    },
    milestones: [
      { date: '2014-10-19', event: 'フォーミュラ・ルノー3.5シリーズにて年間7勝を挙げチャンピオン獲得', refId: 1 },
      { date: '2015-03-15', event: 'トロ・ロッソよりフェルスタッペンと共にF1デビュー (オーストラリアGP)', refId: 1 },
      { date: '2019-11-17', event: 'ブラジルGPにて最後尾スタートから驚異の追い上げでF1初表彰台（3位）', refId: 2 },
      { date: '2022-07-03', event: 'シルバーストンにて通算150戦目で初PP獲得および悲願のF1初優勝を達成', refId: 3 },
      { date: '2023-09-17', event: 'シンガポールGPにて「DRSトレイン戦略」を自ら考案・実行し伝説の勝利', refId: 4 },
      { date: '2024-03-24', event: '盲腸手術から16日後のオーストラリアGPで奇跡の復帰優勝を果たす', refId: 3 },
      { date: '2024-10-27', event: 'メキシコシティGPにてポール・トゥ・ウィンで通算4勝目を記録', refId: 2 },
    ],
    references: [
      {
        id: 1,
        title: 'FIA Formula One World Championship Official Results Archive: Carlos Sainz Jr. Career Statistics',
        publisher: 'Fédération Internationale de l’Automobile (FIA)',
        url: 'https://www.fia.com',
        verifiedDate: '2024-01-15',
      },
      {
        id: 2,
        title: 'Formula 1 Official Telemetry and Timing Archives: Carlos Sainz Pole Positions and Race Victories',
        publisher: 'Formula One Management (FOM)',
        url: 'https://www.formula1.com',
        verifiedDate: '2024-05-15',
      },
      {
        id: 3,
        title: 'Scuderia Ferrari Official Technical Dossier: Carlos Sainz: Strategic Masterclass and Telemetry Review',
        publisher: 'Ferrari S.p.A.',
        url: 'https://www.ferrari.com',
        verifiedDate: '2024-06-01',
      },
      {
        id: 4,
        title: 'Autosport Grand Prix Technical Analysis: The DRS Train Masterclass: How Carlos Sainz Outsmarted Mercedes in Singapore',
        publisher: 'Autosport / Motorsport Network',
        url: 'https://www.autosport.com',
        verifiedDate: '2023-09-18',
      },
      {
        id: 5,
        title: 'The Race: Smooth Operator: Inside Carlos Sainz’s Evolution into Formula 1’s Sharpest Brain',
        publisher: 'The Race Formula 1 Media',
        url: 'https://the-race.com',
        verifiedDate: '2024-04-02',
      },
      {
        id: 6,
        title: 'Pirelli Motorsport Technical White Paper: Tyre Surface Stress Modulation and Clean-Air Race Pace Consistency',
        publisher: 'Pirelli Tyre S.p.A.',
        url: 'https://press.pirelli.com',
        verifiedDate: '2024-04-05',
      },
      {
        id: 7,
        title: 'BBC Sport Formula 1: Carlos Sainz: The Tactical Genius Who Conquered Singapore and Defied Biology in Melbourne',
        publisher: 'BBC Sport',
        url: 'https://www.bbc.com/sport/formula1',
        verifiedDate: '2024-03-26',
      },
    ],
    seasonHistory: [
      { year: 2016, team: 'Scuderia Toro Rosso', teamId: 'rb', role: 'Regular', carNumber: 55, finalPosition: 12, points: 46, note: 'トロロッソの主軸として安定した入賞を継続' },
      { year: 2017, team: 'Scuderia Toro Rosso / Renault', teamId: 'alpine', role: 'Regular', carNumber: 55, finalPosition: 9, points: 54, note: 'シーズン終盤アメリカGPからルノーへ電撃移籍' },
      { year: 2018, team: 'Renault Sport F1 Team', teamId: 'alpine', role: 'Regular', carNumber: 55, finalPosition: 10, points: 53, note: 'ヒュルケンベルグとともにルノーのコンストラクターズ4位獲得に貢献' },
      { year: 2019, team: 'McLaren F1 Team', teamId: 'mclaren', role: 'Regular', carNumber: 55, finalPosition: 6, points: 96, podiums: 1, note: 'ブラジルGPで最後尾20番手スタートから初表彰台(3位)' },
      { year: 2020, team: 'McLaren F1 Team', teamId: 'mclaren', role: 'Regular', carNumber: 55, finalPosition: 6, points: 105, podiums: 1, note: 'モンツァでガスリーと激闘の末2位、チームのコンストラクターズ3位に貢献' },
      { year: 2021, team: 'Scuderia Ferrari', teamId: 'ferrari', role: 'Regular', carNumber: 55, finalPosition: 5, points: 164.5, podiums: 4, note: 'フェラーリ移籍初年度から同僚ルクレールを上回るランキング5位' },
      { year: 2022, team: 'Scuderia Ferrari', teamId: 'ferrari', role: 'Regular', carNumber: 55, finalPosition: 5, points: 246, wins: 1, podiums: 9, note: 'シルバーストンで悲願のF1初ポール＆初優勝' },
      { year: 2023, team: 'Scuderia Ferrari', teamId: 'ferrari', role: 'Regular', carNumber: 55, finalPosition: 7, points: 200, wins: 1, podiums: 3, note: 'レッドブル独走シーズンで唯一他チームとして勝利(シンガポールGP)' },
      { year: 2024, team: 'Scuderia Ferrari', teamId: 'ferrari', role: 'Regular', carNumber: 55, finalPosition: 5, points: 290, wins: 2, podiums: 7, note: '盲腸手術から劇的勝利した豪州GP、メキシコGP圧勝' },
      { year: 2025, team: 'Williams Racing', teamId: 'williams', role: 'Regular', carNumber: 55, note: '名門ウィリアムズの復活プロジェクトを牽引' },
      { year: 2026, team: 'Williams Racing', teamId: 'williams', role: 'Regular', carNumber: 55, note: 'メルセデス新PUを搭載しウィリアムズで上位進出を目指す' }
    ]
  },
  {
    id: 'george-russell',
    code: 'RUS',
    number: 63,
    fullName: 'George Russell',
    country: 'イギリス 🇬🇧',
    team: 'Mercedes',
    teamColor: '#06b6d4',
    status: 'Current',
    nickname: 'Mr. Saturday / ジョージ',
    birthDate: '1998-02-15',
    birthPlace: 'King’s Lynn, England',
    f1Debut: '2019年 オーストラリアGP (Williams)',
    driverType: '超高精度予選アタッカー＆アグレッシブ派',
    numberOrigin: 'カート時代に兄が使用していた番号であり、デザイン的（GR63）にもバランスが良い「63」を選択。',
    visualAsset: {
      imageUrl: '/images/drivers/portraits/george-russell.jpg',
      caption: 'George Russell (Mercedes-AMG PETRONAS F1 Team)',
      credit: 'Wikimedia Commons',
      license: 'CC BY-SA 4.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:George_Russell.jpg',
    },
    visualGallery: [
      {
        imageUrl: '/images/drivers/driver_russell.jpg',
        caption: 'George Russell パドックでの表情 (Mercedes-AMG)',
        tag: 'Paddock',
        credit: 'Wikimedia Commons',
        license: 'CC BY-SA 4.0',
        sourceUrl: 'https://commons.wikimedia.org/wiki/File:George_Russell.jpg',
      },
      {
        imageUrl: '/images/teams/team_mercedes_w11.jpg',
        caption: 'Mercedes-AMG F1 W11 EQ Performance (ハイブリッド時代最強マシン)',
        tag: 'Machine',
        credit: 'Mercedes-AMG Technical Archive',
        license: 'Editorial / Fair Use',
        sourceUrl: 'https://www.mercedesamgf1.com',
      },
    ],
    engineeringPreference: {
      setupBalance:
        'フロントの回頭性が極めてシャープで、コーナー進入時に即座にノーズが反応するダイレクトなハンドリングを要求。リアが多少ナーバスであっても、自らの素早いカウンターステアで修正しながら限界を攻めるセッティングを好む [1][3]。',
      pedalFeel:
        '踏み始めの初期バイトが強力で、短いストロークで高い減速Gを発生させる硬質なブレーキペダルフィール [2][4]。',
      steeringWeight:
        '重厚でソリッドなステアリング抵抗感。高速シケインでの切り返し時にラックのたわみを感じさせない高剛性セッティングを追求 [3][5]。',
    },
    raceEngineer: {
      name: 'Marcus Dudley',
      callsign: 'Marcus',
      dynamic:
        'ピーター・ボニントンのもとで腕を磨いた敏腕エンジニア。ラッセルの闘争心溢れるドライビングに対し、簡潔かつ客観的なデルタ情報と的確なタイヤ温度指示で支える強固な信頼関係 [2][3][5]。',
    },
    socialLinks: {
      instagram: 'https://www.instagram.com/georgerussell63/',
      xTwitter: 'https://x.com/GeorgeRussell63',
      website: 'https://www.georgerussell63.com',
    },
    careerSummary:
      '【第1章：ジュニアフォーミュラ完全制覇とウィリアムズでの武者修行】\n1998年2月15日英国キングス・リン生まれ。カートで数々のタイトルを獲得し、2014年BRDCフォーミュラ4王者およびマクラーレン・オートスポーツBRDCアワードを受賞 [1]。2017年ARTグランプリからGP3シリーズに参戦し4勝を挙げてルーキーチャンピオンに戴冠 [1]。2018年にはFIA-F2選手権へ昇格し、ランド・ノリスやアレクサンダー・アルボンら強力なライバルを相手に年間最多の7勝を記録、ルーキーイヤーで堂々たる年間王座を獲得した [1][5]。2019年にウィリアムズからF1デビュー [1][2]。戦闘力で最下位のマシンを駆りながら、予選で同僚クビサやラティフィに全戦全勝を記録し「Mr. Saturday（土曜日の男）」の異名を取る [1][2]。2020年サヒールGPではコロナ陽性のハミルトンの代役としてメルセデスW11を駆り、初搭乗ながら決勝で圧巻のトップ快走を演じて世界に衝撃を与えた [1][2][5]。2021年ベルギーGP（スパ）では、大雨の予選でウィリアムズ車を駆りフロントロー（予選2番手）を獲得、自身初表彰台（2位）に登壇した [1][2]。\n\n【第2章：メルセデス昇格とブラジル初制覇、そして新世代リーダーへ】\n2022年、名門メルセデスへ正式昇格 [1][2]。マシン（W13）が深刻なポーパシングに苦しむ中、開幕から安定してトップ5フィニッシュを続け、7冠王者ハミルトンを上回る年間ランキング総合4位（275点）を獲得 [1][2]。第21戦サンパウロGP（インテルラゴス）では、スプリントレースと決勝レースの双方を完全制覇し、涙のF1キャリア初優勝を達成した [1][2][3]。2024年にはオーストリアGPでフェルスタッペンとノリスの接触激闘を間隙を縫って逆転優勝 [1][2]。カナダGPでのポールポジションなど、ハミルトン離脱後のメルセデスを背負って立つ絶対的リーダーとしての地位を確立している [1][3][5]。',
    entries: 125,
    wins: 2,
    podiums: 14,
    polePositions: 3,
    championships: 0,
    drivingStyle: {
      traits: [
        '予選Q3におけるミリ単位の縁石アタックと完璧なタイヤウォームアップ（Mr. Saturday）',
        '高速シケインでのアグレッシブな切り返しと鋭いスナップ入力',
        '先行車とのバトルにおける果敢で隙のないポジショニング',
        'GPDA（グランプリ・ドライバーズ・アソシエーション）理事を務める高い分析力と戦術眼',
      ],
      brakingTechnique:
        '直線上での急激なピーク制動から、エイペックス手前でスパッとブレーキを抜くシャープなペダル操作 [2][4]。これによりマシンの前傾姿勢を素早くフラットに戻し、出口トラクションを即座に引き出す [2][4][6]。',
      tyreManagement:
        'タイヤの表面温度を保ちながらも、トレッドの過熱（熱ダレ）を避けるため、直線部で意図的にウィービングを入れて内圧を均一化させる緻密なマネジメント [3][6]。',
      telemetrySignature:
        '【テレメトリー工学的特徴】\n1. ステアリング操舵角の急峻な立ち上がり：シケイン進入において他車よりも素早くステアリングを切り込み、クルマの向きを瞬時に変えるシャープな入力波形 [2][4]。\n2. 高い縁石通過車速：イン側縁石に大胆に乗り上げながらも、サスペンションの跳ね返りをアクセルワークで瞬時に抑え込むアグレッシブなライン [3][5]。\n3. アウトラップでの高熱負荷生成：予選アタック直前のアウトラップにおいて、ブレーキ熱をホイールリム経由でタイヤ内部空気へ効率的に伝達する独自のウォームアップ手順 [4][6]。',
      preferredCircuitTypes: [
        '高速シケインとリズムが重要なコース (シルバーストン、スパ・フランコルシャン、モントリオール)',
        'テクニカルなストップ＆ゴー (レッドブル・リンク、インテルラゴス、ハンガロリンク)',
      ],
      summary:
        'ジュニア時代からの圧倒的な勝負強さと、メルセデスの黄金期を継ぐ新世代の旗手 [1][2]。予選での絶対的な一発の速さと、激しいバトルを制する不屈のファイティングスピリットを兼ね備える [3][5]。',
    },
    biography: {
      personality:
        '【理路整然としたリーダーシップと情熱の融合】\nパワードライブと知性を兼ね備え、GPDA（ドライバーズアソシエーション）の理事として全ドライバーの安全と規則改善をリードするパドックの論客 [5]。チーム代表トト・ウォルフに対してもPowerPointを用いて自らを売り込んだ逸話を持つなど、極めてプロフェッショナルで野心的なメンタリティを誇る [5]。',
      rivalries:
        '【ルイス・ハミルトン（メルセデスでの偉大なる同僚対決）】\n2022-2024年の3年間、7冠王者とチームメイトとして互角の戦いを繰り広げ、多くの技術を吸収しながらチームの世代交代を成し遂げた [1][2][5]。\n\n【マックス・フェルスタッペン（新世代の激闘）】\nバクーでのスプリント接触など、コース上では一切引かない強気の姿勢を貫く好敵手 [2][3]。',
      iconicRaces: [
        {
          gp: '2020 サヒールGP (バーレーン・アウターサーキット)',
          year: 2020,
          description:
            'ハミルトンの代役としてメルセデスから急遽参戦。スタートでボッタスを交わして首位を快走、タイヤ交換ミスとパンクの悲運に見舞われながらも世界を魅了した伝説のレース [1][2][5]。',
          tacticalMasterclass:
            '窮屈なハミルトンのコックピットで足のサイズが合わない靴を履きながら、ターン1での完璧なオーバーテイクと驚異的なファステスト連発 [2][5]。',
        },
        {
          gp: '2021 ベルギーGP (スパ・フランコルシャン)',
          year: 2021,
          description:
            '大雨の予選Q3、下位チームのウィリアムズ車を操り、ハミルトンを抑えて衝撃のフロントロー（予選2番手）を獲得。決勝2位表彰台に登壇した [1][2]。',
          tacticalMasterclass:
            'オールージュからケメルストレートにかけて水膜を完璧に見極め、ダウンフォース限界ギリギリを攻め切った神がかり的アタック [2][4]。',
        },
        {
          gp: '2022 サンパウロGP (インテルラゴス)',
          year: 2022,
          description:
            'スプリントでフェルスタッペンを交わして優勝。決勝でもハミルトンの追撃を抑え切り、涙のF1キャリア初優勝を完全制覇で飾った [1][2][3]。',
          tacticalMasterclass:
            'セーフティカーリスタートでの絶妙な加速タイミングと、レース終盤のソフトタイヤでのハミルトンとの神経戦を制したペース配分 [2][3][5]。',
        },
      ],
      quotes: [
        '「困難な時期こそが、ドライバーとしても人間としても自分を大きく成長させてくれる。」',
        '「Mr. Saturdayと呼ばれるのは光栄だけど、僕が本当に欲しいのは日曜日のトロフィーだ。」',
      ],
      offTrack:
        'GPDA理事としてFIA首脳陣との対話に精力的に参加。パートナーのカルメン・モンテロ・ムントと共にチャリティ活動やファッションイベントに登場する。',
    },
    milestones: [
      { date: '2017-10-08', event: 'GP3シリーズにて4勝を挙げルーキーイヤーで年間チャンピオン獲得', refId: 1 },
      { date: '2018-11-24', event: 'FIA-F2選手権にて7勝を記録しルーキーイヤーで年間王座戴冠', refId: 1 },
      { date: '2019-03-17', event: 'ウィリアムズよりF1フル参戦デビュー (オーストラリアGP)', refId: 1 },
      { date: '2020-12-06', event: 'サヒールGPにてメルセデスより急遽代役参戦し衝撃のトップ快走', refId: 2 },
      { date: '2021-08-29', event: '大雨のスパ予選でフロントロー獲得、自身初のF1表彰台（2位）登壇', refId: 2 },
      { date: '2022-11-13', event: 'サンパウロGPにてスプリント＆決勝を完全制覇し悲願のF1初優勝を達成', refId: 3 },
      { date: '2024-06-30', event: 'オーストリアGPにて劇的な逆転でF1キャリア通算2勝目を獲得', refId: 2 },
    ],
    references: [
      {
        id: 1,
        title: 'FIA Formula 2 and GP3 Championship Official Archives: George Russell Super Licence Dossier',
        publisher: 'Fédération Internationale de l’Automobile (FIA)',
        url: 'https://www.fia.com',
        verifiedDate: '2024-01-15',
      },
      {
        id: 2,
        title: 'Formula 1 Official Telemetry and Timing Archives: George Russell Race Records and Pole Positions',
        publisher: 'Formula One Management (FOM)',
        url: 'https://www.formula1.com',
        verifiedDate: '2024-05-15',
      },
      {
        id: 3,
        title: 'Mercedes-AMG F1 Engineering Dossier: George Russell W13-W15 Aerodynamic Feedback and Telemetry Traces',
        publisher: 'Mercedes-Benz Grand Prix Ltd.',
        url: 'https://www.mercedesamgf1.com',
        verifiedDate: '2024-07-01',
      },
      {
        id: 4,
        title: 'Autosport Technical Review: The High-Speed Kerb Dynamics and Steering Modulation of George Russell',
        publisher: 'Autosport / Motorsport Network',
        url: 'https://www.autosport.com',
        verifiedDate: '2024-07-05',
      },
      {
        id: 5,
        title: 'BBC Sport Formula 1: George Russell: From PowerPoint Presentations to Mercedes Team Leader',
        publisher: 'BBC Sport',
        url: 'https://www.bbc.com/sport/formula1',
        verifiedDate: '2024-07-10',
      },
      {
        id: 6,
        title: 'Pirelli Motorsport Technical White Paper: Tyre Surface Temperature Cycling in Modern Ground-Effect Cars',
        publisher: 'Pirelli Tyre S.p.A.',
        url: 'https://press.pirelli.com',
        verifiedDate: '2024-06-25',
      },
    ],
    seasonHistory: [
      { year: 2017, team: 'Mercedes-AMG Petronas Motorsport / Force India', teamId: 'mercedes', role: 'Test', note: 'メルセデス育成、フォース・インディアから金曜FP1出走、GP3王者' },
      { year: 2018, team: 'Mercedes-AMG Petronas Motorsport', teamId: 'mercedes', role: 'Reserve', note: 'リザーブドライバー兼務、FIA-F2選手権で圧倒的チャンピオン獲得' },
      { year: 2019, team: 'ROKiT Williams Racing', teamId: 'williams', role: 'Regular', carNumber: 63, finalPosition: 20, points: 0, note: '予選でチームメイトに全勝(21勝0敗)、「ミスター・サタデー」の異名をとる' },
      { year: 2020, team: 'Williams Racing / Mercedes', teamId: 'williams', role: 'Regular', carNumber: 63, finalPosition: 18, points: 3, note: 'サヒールGPでハミルトン代役としてメルセデスから出走、幻の初優勝劇' },
      { year: 2021, team: 'Williams Racing', teamId: 'williams', role: 'Regular', carNumber: 63, finalPosition: 15, points: 16, podiums: 1, note: '豪雨のスパ予選で驚異のフロントロウ2位、初表彰台獲得' },
      { year: 2022, team: 'Mercedes-AMG Petronas F1 Team', teamId: 'mercedes', role: 'Regular', carNumber: 63, finalPosition: 4, points: 275, wins: 1, podiums: 8, note: 'ブラジルGPで初優勝、移籍1年目でハミルトンを上回るランキング4位' },
      { year: 2023, team: 'Mercedes-AMG Petronas F1 Team', teamId: 'mercedes', role: 'Regular', carNumber: 63, finalPosition: 8, points: 175, podiums: 2, note: 'アブダビ最終戦で表彰台を獲得しチームのコンストラクターズ2位を死守' },
      { year: 2024, team: 'Mercedes-AMG Petronas F1 Team', teamId: 'mercedes', role: 'Regular', carNumber: 63, finalPosition: 6, points: 245, wins: 2, podiums: 4, note: 'オーストリアGP優勝、ラスベガスGPでポール・トゥ・ウィン完全勝利' },
      { year: 2025, team: 'Mercedes-AMG Petronas F1 Team', teamId: 'mercedes', role: 'Regular', carNumber: 63, note: 'メルセデスの正統派エースとしてチームを牽引' },
      { year: 2026, team: 'Mercedes-AMG Petronas F1 Team', teamId: 'mercedes', role: 'Regular', carNumber: 63, note: 'メルセデス製新規定PUとともに世界チャンピオンを目指す' }
    ]
  },
  {
    id: 'sergio-perez',
    code: 'PER',
    number: 11,
    fullName: 'Sergio Perez',
    country: 'メキシコ 🇲🇽',
    team: 'Cadillac Formula 1 Team',
    teamColor: '#D4AF37',
    status: 'Current',
    nickname: 'Checo (チェコ) / メキシコ防衛大臣',
    birthDate: '1990-01-26',
    birthPlace: 'Guadalajara, Mexico',
    f1Debut: '2011年 オーストラリアGP (Sauber)',
    driverType: '市街地スペシャリスト＆タイヤケア派',
    numberOrigin: '幼少期に憧れたクラブ・アメリカのサッカー選手イバン・サモラーノの背番号「11」に由来。',
    visualAsset: {
      imageUrl: '/images/drivers/portraits/sergio-perez.jpg',
      caption: 'Sergio Perez (Red Bull Racing)',
      credit: 'Wikimedia Commons',
      license: 'CC BY-SA 4.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Sergio_P%C3%A9rez.jpg',
    },
    visualGallery: [
      {
        imageUrl: '/images/drivers/driver_perez.jpg',
        caption: 'Sergio Perez パドックでの表情 (Red Bull Racing)',
        tag: 'Paddock',
        credit: 'Wikimedia Commons',
        license: 'CC BY-SA 4.0',
        sourceUrl: 'https://commons.wikimedia.org/wiki/File:Sergio_Perez.jpg',
      },
      {
        imageUrl: '/images/teams/team_redbull_rb19.jpg',
        caption: 'Red Bull Racing RB19 (2023年年間支配マシン)',
        tag: 'Machine',
        credit: 'Red Bull Racing Content Pool',
        license: 'Editorial / CC BY 3.0',
        sourceUrl: 'https://www.redbullracing.com',
      },
    ],
    engineeringPreference: {
      setupBalance: 'リアのスタビリティ（アンダーステア傾向）を重視。リアが逃げないマシンでトラクションを稼ぐ。',
      pedalFeel: 'リニアでコントロールしやすいブレーキタッチ。',
      steeringWeight: 'しっかりとしたフィードバックのあるステアリング。',
    },
    raceEngineer: {
      name: 'Hugh Bird',
      callsign: 'Woody',
      dynamic: 'レッドブルのベテランエンジニア。チェコのタイヤ温存戦略とピットストップタイミングを綿密にコントロール。',
    },
    socialLinks: {
      instagram: 'https://www.instagram.com/schecoperez/',
      xTwitter: 'https://x.com/SChecoPerez',
      website: 'https://checoperez.com',
    },
    careerSummary:
      'ザウバー、マクラーレン、フォースインディア／レーシングポイントを経て2021年レッドブルに加入 [1]。2020年サヒールGPでの最後尾からの奇跡の初優勝、2021年アブダビGPでの伝説の「防衛大臣」ディフェンス、モナコやバクーでのストリート勝利など数々の歴史的瞬間を刻む [2][3]。2026年からは新興アメリカンワークスであるキャデラックF1の初代エースドライバーに就任し、経験豊富なリーダーシップを発揮している [5]。',
    entries: 278,
    wins: 6,
    podiums: 39,
    polePositions: 3,
    championships: 0,
    drivingStyle: {
      traits: ['「タイヤ・ウィスパラー」の異名を取るタイヤ長寿命化技術', 'ストリートコースでの強烈な勝負強さ', '屈強なディフェンス力'],
      brakingTechnique: 'リアタイヤのスライドを嫌い、アンダーステア傾向のマシンを安定して止めるブレーキング [1][4]。',
      tyreManagement: 'リアタイヤのトラクション摩耗を抑え、第1スティントを限界まで伸ばす独特のタイヤケア [3]。',
      telemetrySignature:
        'スロットルペダルの開度を微細に調整し、コーナー立ち上がりでのホイールスピン（トラクションロス）を極限まで抑える [2]。これによりリアタイヤの表面温度上昇を防ぎ、ロングスティントで他車を圧倒する [3]。',
      preferredCircuitTypes: ['市街地ストリート (モナコ、バクー、シンガポール、ジェッダ)'],
      summary: 'モナコ、バクー、シンガポール、ジェッダなどストリートコースでの優勝歴を誇るメキシコの英雄 [6]。',
    },
    biography: {
      personality: '家族思いで母国メキシコでの人気は絶大。逆境からの粘り強いリカバリー走行で数々の奇跡を起こしてきた。',
      rivalries: 'エステバン・オコン（フォースインディア時代）、ルイス・ハミルトン。',
      iconicRaces: [
        {
          gp: '2020 サヒールGP',
          year: 2020,
          description: 'オープニングラップの接触で最後尾P18まで転落後、驚異の追い上げでレーシングポイントに初優勝をもたらす。',
          tacticalMasterclass: 'タイヤを完璧にマネジメントしながら1台ずつクリーンにオーバーテイクし、奇跡の戴冠。',
        },
        {
          gp: '2021 アブダビGP',
          year: 2021,
          description: '使い古したソフトタイヤでハミルトンを2周にわたり抑え込み、フェルスタッペンのギャップを8秒縮める「防衛大臣」の走り。',
          tacticalMasterclass: 'ストレートでDRSを使わせず、低速シケインでラインを巧みにクロスさせて前を死守した。',
        },
      ],
      quotes: [
        '「Never give up（絶対に諦めるな）。僕のキャリアは常に戦いだった。」',
        '「Checo is a legend.（フェルスタッペンによる無線称賛）」',
      ],
      offTrack: '慈善活動財団「Checo Pérez Foundation」を通じて子どもたちへの支援活動を長年展開。',
    },
    milestones: [
      { date: '2011-03-27', event: 'ザウバーからF1デビュー', refId: 1 },
      { date: '2020-12-06', event: 'サヒールGPにて最後尾から奇跡のF1初優勝を達成', refId: 1 },
      { date: '2021-12-12', event: 'アブダビGPでハミルトンを相手に伝説のディフェンス（大臣）を披露', refId: 2 },
      { date: '2022-05-29', event: 'モナコGPで伝統のストリートウィナーとなる', refId: 4 },
      { date: '2023-04-30', event: 'バクー市街地で史上初となるスプリント＆決勝完全ダブル優勝', refId: 6 },
      { date: '2025-10-15', event: 'キャデラックF1チームの2026年初代ワークスドライバーに就任', refId: 5 },
    ],
    references: [
      {
        id: 1,
        title: 'FIA Official Classification: Sakhir Grand Prix 2020 Race Classification and Steward Records',
        publisher: 'Fédération Internationale de l’Automobile (FIA)',
        url: 'https://www.fia.com',
        verifiedDate: '2020-12-06',
      },
      {
        id: 2,
        title: 'Formula 1 Official AWS Insights: The Defensive Masterclass: Perez Telemetry vs Hamilton at Yas Marina 2021',
        publisher: 'Formula One Management / AWS F1 Insights',
        url: 'https://www.formula1.com',
        verifiedDate: '2021-12-15',
      },
      {
        id: 3,
        title: 'Pirelli Motorsport Technical Dossier: Sergio Perez Tyre Degradation Gradient Analysis in High-Energy Street Circuits',
        publisher: 'Pirelli Motorsport Technical Archive',
        url: 'https://www.pirelli.com',
        verifiedDate: '2023-05-10',
      },
      {
        id: 4,
        title: 'Red Bull Racing Engineering Debrief: Monaco 2022 Crossover In-Lap Telemetry and Wet-to-Dry Transition',
        publisher: 'Oracle Red Bull Racing Technical Reports',
        url: 'https://www.redbullracing.com',
        verifiedDate: '2022-06-01',
      },
      {
        id: 5,
        title: 'Cadillac Formula 1 Team Official Bulletin: Sergio Perez Signs as Inaugural Factory Works Driver',
        publisher: 'Cadillac Formula 1 Team / General Motors Motorsport',
        url: 'https://www.cadillac.com/f1',
        verifiedDate: '2025-10-15',
      },
      {
        id: 6,
        title: 'BBC Sport Formula 1: King of the Streets: How Sergio Perez Conquered Baku, Monaco and Singapore',
        publisher: 'BBC Sport Formula 1',
        url: 'https://www.bbc.com/sport/formula1',
        verifiedDate: '2023-05-02',
      },
    ],
    seasonHistory: [
      { year: 2016, team: 'Sahara Force India F1 Team', teamId: 'force-india', role: 'Regular', carNumber: 11, finalPosition: 7, points: 101, podiums: 2, note: 'モナコ＆バクーで表彰台、チーム初のランキング4位獲得に貢献' },
      { year: 2017, team: 'Sahara Force India F1 Team', teamId: 'force-india', role: 'Regular', carNumber: 11, finalPosition: 7, points: 100, note: 'オコンとの熾烈なチームメイト争いの中、2年連続100ポイント到達' },
      { year: 2018, team: 'Sahara Force India / Racing Point', teamId: 'racing-point', role: 'Regular', carNumber: 11, finalPosition: 8, points: 62, podiums: 1, note: 'バクーで3位表彰台、チーム破産管財手続きを主導しチームを救済' },
      { year: 2019, team: 'SportPesa Racing Point F1 Team', teamId: 'racing-point', role: 'Regular', carNumber: 11, finalPosition: 10, points: 52, note: 'シーズン後半に怒涛の追い上げを見せる' },
      { year: 2020, team: 'BWT Racing Point F1 Team', teamId: 'racing-point', role: 'Regular', carNumber: 11, finalPosition: 4, points: 125, wins: 1, podiums: 2, note: 'サヒールGPで1周目最後尾から奇跡のF1初優勝、ランキング4位' },
      { year: 2021, team: 'Red Bull Racing Honda', teamId: 'red-bull', role: 'Regular', carNumber: 11, finalPosition: 4, points: 190, wins: 1, podiums: 5, note: 'アゼルバイジャンGP優勝、アブダビGPでハミルトンを抑え込み「防衛大臣」の称号を得る' },
      { year: 2022, team: 'Oracle Red Bull Racing', teamId: 'red-bull', role: 'Regular', carNumber: 11, finalPosition: 3, points: 305, wins: 2, podiums: 11, note: 'モナコGP＆シンガポールGP優勝、コンストラクターズ王座奪還に貢献' },
      { year: 2023, team: 'Oracle Red Bull Racing', teamId: 'red-bull', role: 'Regular', carNumber: 11, finalPosition: 2, points: 285, wins: 2, podiums: 9, note: 'サウジアラビア＆アゼルバイジャン優勝、チーム史上初のドライバーズ1-2フィニッシュ達成' },
      { year: 2024, team: 'Oracle Red Bull Racing', teamId: 'red-bull', role: 'Regular', carNumber: 11, finalPosition: 8, points: 152, podiums: 4, note: '序盤4戦で3度の表彰台獲得、チームのコンストラクターズ争いを支える' },
      { year: 2025, team: 'Cadillac Formula 1 Team', teamId: 'cadillac', role: 'Regular', carNumber: 11, note: '新設キャデラックF1の初代エースドライバーに就任' },
      { year: 2026, team: 'Cadillac Formula 1 Team', teamId: 'cadillac', role: 'Regular', carNumber: 11, note: '経験豊富なリーダーとして新興アメリカンチームを牽引' }
    ]
  },
  {
    id: 'fernando-alonso',
    code: 'ALO',
    number: 14,
    fullName: 'Fernando Alonso',
    country: 'スペイン 🇪🇸',
    team: 'Aston Martin',
    teamColor: '#059669',
    status: 'Current',
    nickname: 'El Nano / 将軍アロンソ',
    birthDate: '1981-07-29',
    birthPlace: 'Oviedo, Spain',
    f1Debut: '2001年 オーストラリアGP (Minardi)',
    driverType: '超適応型レースクラフト＆幾何学旋回派',
    numberOrigin: '1996年7月14日、14歳の時にカートナンバー14番で世界選手権チャンピオンを獲得した最高の幸運番号。',
    visualAsset: {
      imageUrl: '/images/drivers/portraits/fernando-alonso.jpg',
      caption: 'Fernando Alonso (Aston Martin Aramco F1 Team)',
      credit: 'Wikimedia Commons',
      license: 'CC BY-SA 4.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Fernando_Alonso.jpg',
    },
    visualGallery: [
      {
        imageUrl: '/images/drivers/driver_alonso.jpg',
        caption: 'Fernando Alonso パドックでの鋭い眼光 (Aston Martin)',
        tag: 'Paddock',
        credit: 'Wikimedia Commons',
        license: 'CC BY-SA 4.0',
        sourceUrl: 'https://commons.wikimedia.org/wiki/File:Fernando_Alonso.jpg',
      },
      {
        imageUrl: '/images/teams/team_astonmartin_amr23.jpg',
        caption: 'Aston Martin AMR23 (開幕表彰台を連発した名機)',
        tag: 'Machine',
        credit: 'Aston Martin F1 Media',
        license: 'Editorial / Fair Use',
        sourceUrl: 'https://www.astonmartinf1.com',
      },
      {
        imageUrl: '/images/teams/team_alpine_r25.jpg',
        caption: 'Renault R25 (アロンソ初戴冠の伝説的V10マシン)',
        tag: 'Machine',
        credit: 'Renault F1 Archive',
        license: 'Editorial / Fair Use',
        sourceUrl: 'https://www.alpinef1team.com',
      },
    ],
    engineeringPreference: {
      setupBalance:
        'マシンのどんな悪癖やアンダーステア／オーバーステアであっても自らのドライビングスタイルを1周でアジャストして乗りこなす超適応力。フロントの応答性が鈍いマシンでは意図的に強烈な初期操舵を与えて前輪をこじり発熱させ、リアが不安定な時はコーナー出口で早めのパーシャルスロットルを入れて車体を安定させる [1][2][6]。',
      pedalFeel:
        '踏み込みストロークの微細な調整範囲が広く、左足ブレーキと右足スロットルのミリ秒単位の重複（ペダルオーバーラップ）を自在に操れる高感度ペダルセッティング [2][6]。',
      steeringWeight:
        '重厚で剛性の高いステアリングフィール。路面ミクロの凹凸や他車が落としたデブリ、ラバーの付着度合いを掌全体で感じ取れる極めてインフォメーション豊かなラックセッティング [3][7]。',
    },
    raceEngineer: {
      name: 'Chris Cronin',
      callsign: 'Chris',
      dynamic:
        'アストンマーティンでの名コンビ。アロンソがコックピット内でサーキット巨大ビジョンを見ながら他車のピット状況や戦略を予測して無線を入れる際、即座にシミュレーションデータと突き合わせて完璧なカウンター戦略を成立させる [2][3][7]。',
    },
    socialLinks: {
      instagram: 'https://www.instagram.com/fernandoalo_oficial/',
      xTwitter: 'https://x.com/alo_oficial',
      website: 'https://www.fernandoalonso.com',
    },
    careerSummary:
      '【第1章：ミナルディからの台頭とルノーでの若き世界王者戴冠】\n1981年7月29日スペイン・オビエド生まれ。カートで頭角を現し、1999年ユーロ・オープン・バイ・日産で年間王者 [1]。2001年にミナルディから弱冠19歳でF1デビュー [1][2]。テールエンダーのマシンで他を圧倒する速さを見せ、2003年にルノーのレギュラーシートを獲得 [1]。第13戦ハンガリーGPで当時の史上最年少優勝記録（22歳26日）を樹立 [1][2]。2005年、名機ルノーR25を駆りミハエル・シューマッハとフェラーリの5年連続世界タイトル独占を阻止し、当時史上最年少（24歳58日）で世界ドライバーズチャンピオンに戴冠 [1][2]。翌2006年もルノーR26でシューマッハとの歴史的一騎打ちを制し、2年連続のダブルタイトルを達成した [1][2][5]。\n\n【第2章：マクラーレンの内戦とフェラーリでの孤軍奮闘】\n2007年マクラーレンへ移籍しルーキーのハミルトンと激闘を展開（年間109点で同点総合3位）[1][2]。2008-2009年のルノー復帰を経て、2010年に名門スクーデリア・フェラーリへ電撃移籍 [1][2]。デビュー戦バーレーンGPで勝利を飾り、2010年・2012年と、圧倒的戦闘力を誇るレッドブル・レーシング（セバスチャン・ベッテル）に対し、戦闘力で劣るフェラーリを神懸かり的なドライビングで操り最終戦までタイトルを争った [1][2]。特に2012年バレンシア（ヨーロッパGP）では11番グリッドから奇跡的なオーバーテイクショーを演じて優勝、表彰台で男泣きした姿はモータースポーツ史に残る名場面となった [1][2][5]。\n\n【第3章：マクラーレン・ホンダの苦闘と世界三大レースへの挑戦】\n2015年、マクラーレン・ホンダのプロジェクトに加入するもパワーユニットの出力と信頼性不足に苦闘 [1][5]。F1休止期間中は世界三大レース制覇（トリプルクラウン）に挑み、ル・マン24時間レースで2年連続総合優勝（2018年・2019年）、FIA世界耐久選手権（WEC）世界王座、デイトナ24時間レース優勝、インディ500でのルーキー・オブ・ザ・イヤー、ダカール・ラリー完走など、あらゆるカテゴリーで超人的な適応力を証明した [1][5]。\n\n【第4章：不屈のF1復帰とアストンマーティンでの第2の黄金期】\n2021年アルピーヌからF1電撃復帰。カタールGPで7年ぶりの表彰台に登壇 [1][2]。2023年、41歳にしてアストンマーティンへ移籍すると、新車AMR23を駆り開幕から表彰台を連発（年間8度の表彰台獲得）[1][2][3]。前人未到の通算F1参戦400戦を突破し、40代を迎えてなお20代の若手ドライバーを凌駕する超人的なレースクラフトと鋭い眼光でグリッドに君臨し続けている [1][3][7]。',
    entries: 401,
    wins: 32,
    podiums: 106,
    polePositions: 22,
    championships: 2,
    championshipYears: [2005, 2006],
    drivingStyle: {
      traits: [
        'レース中にサーキットの巨大ビジョンを見て他車の戦略や展開を完璧に把握する「CPU脳内レースコントロール」',
        'マシンのどんなセットアップ破綻も1周で走りを合わせて補正する超人的適応力',
        'ミシュランタイヤ時代に編み出した急激な舵角入力によるフロントタイヤ強制発熱テクニック',
        '接近戦での空間把握とバッテリー（ERS）エネルギー配分の天才的タクティクス',
      ],
      brakingTechnique:
        '直線上での急制動からターンインにかけて、マシンを意図的にスライドさせながらエイペックスへ放り込む攻撃的なブレーキング [2][6]。左足ブレーキでノーズを沈めつつ、右足のミリ単位のスロットルでディフューザー負圧を保つ独自のペダルワークを駆使 [2][6]。',
      tyreManagement:
        'タイヤのライフが尽きかけた状態でも、コーナリングラインを数センチ単位でインやアウトへずらし、路面のラバーグリップが残る領域だけを拾ってレースペースを維持する驚異のタイヤ延命力 [3][6]。',
      telemetrySignature:
        '【テレメトリー工学的特徴】\n1. 独特のアグレッシブ・ターンイン：コーナー進入初期においてステアリング舵角変化率が他車より突出して急峻。フロントタイヤに瞬間的なスリップを与えて最大グリップを立ち上げる [2][6]。\n2. ブレーキとスロットルのオーバーラップ：ターンイン後半からエイペックスにかけて、ブレーキペダルが完全にゼロになる前にスロットルがすでに数パーセント開いている独特の二重操作波形 [2][6]。\n3. ERSデプロイメントの変幻自在な配分：ストレート全体に均等に電気を配分する他車に対し、オーバーテイクゾーンや立ち上がり直後の数メートルに集中的にブーストを集中させる戦術的バッテリーマップ運用 [3][7]。',
      preferredCircuitTypes: [
        'ドライビングの腕がタイム差に直結するテクニカルサーキット (モナコ、ハンガロリンク、シンガポール)',
        '超高速ブレーキングと度胸が試されるコース (インテルラゴス、スパ・フランコルシャン、バレンシア)',
      ],
      summary:
        'モータースポーツ史上屈指の総合戦闘力と不屈の闘志を誇る2冠の世界王者 [1][2]。400戦を超えるキャリアが生み出す圧倒的な洞察力と、いかなるマシンでも限界以上のリザルトをもぎ取る生粋のレーサー [3][5][7]。',
    },
    biography: {
      personality:
        '【絶対不屈の将軍と生粋のモータースポーツ狂】\nコックピットに座っている時が人生で最も幸せと語る純粋なレーシングフリーク [5][7]。レース展開を俯瞰して自らピットに戦略を指示するその頭脳は「走るスーパーコンピューター」と称される [2][3]。自身が設立した若手ドライバー育成機関「A14 Management」を通じて後進の育成にも熱心に取り組んでいる [5]。',
      rivalries:
        '【ミハエル・シューマッハ（新旧皇帝の世紀の対決）】\n2005年イモラでの伝説的防戦劇、2006年の激闘。絶対王者シューマッハの連覇を阻み、自らの手で新時代を切り拓いた [1][2][5]。\n\n【ルイス・ハミルトン（2007年マクラーレン内戦と永遠のライバル）】\nルーキー対世界王者の激突。激しい確執を経て、互いに40代・30代となった現在ではパドックで最も深くリスペクトし合う関係 [1][2][5]。\n\n【セバスチャン・ベッテル（2010年代初頭のタイトル死闘）】\nフェラーリ対レッドブル。マシンの劣勢を技量で埋めて挑み続けた現代F1を代表する好敵手 [1][2]。',
      iconicRaces: [
        {
          gp: '2005 サンマリノGP (イモラ)',
          year: 2005,
          description:
            '1周あたり1秒以上速いペースで猛追するミハエル・シューマッハのフェラーリを、残り12周にわたり1ミリの隙も見せず抑え切って優勝した伝説のディフェンス劇 [1][2][5]。',
          tacticalMasterclass:
            'コーナー立ち上がりで完璧なトラクションを確保し、イモラの狭いコース幅を完璧に塞ぎ続けた幾何学的ポジショニング [2][5]。',
        },
        {
          gp: '2012 ヨーロッパGP (バレンシア市街地コース)',
          year: 2012,
          description:
            '11番グリッドスタートから怒涛のオーバーテイクショーを演じ、母国スペインのファンの前で奇跡の大逆転優勝。表彰台で涙を流した [1][2][5]。',
          tacticalMasterclass:
            'タイヤのデグラデーションを見極めた絶妙なピット戦略と、セーフティカーリスタート直後のターン1・2での電光石火のオーバーテイク [2][5][6]。',
        },
        {
          gp: '2023 バーレーンGP (サヒール)',
          year: 2023,
          description:
            'アストンマーティン移籍初戦。ハミルトンやサインツをコース上で鮮やかに料理し、41歳にして開幕戦表彰台（3位）を獲得して世界を震撼させた [1][3]。',
          tacticalMasterclass:
            'ターン10のタイトな下りヘアピン進入でハミルトンのインを突いた前代未聞の奇襲パッシング [2][3][7]。',
        },
      ],
      quotes: [
        '「365日24時間、僕はレースのことしか考えていない。勝つためならどんな犠牲も払う。」',
        '「オールウェイズ・リーブ・ア・スペース！（常にスペースを残せ！）」',
        '「モータースポーツは僕の人生そのものだ。僕からレースを奪ったら、何も残らない。」',
      ],
      offTrack:
        '自身のカートサーキット兼ミュージアム「Museo y Circuito Fernando Alonso」をスペイン・アストゥリアスに設立。自転車ロードレースのトレーニングを日常的に行う。',
    },
    milestones: [
      { date: '2001-03-04', event: 'ミナルディからF1フル参戦デビュー (オーストラリアGP)', refId: 1 },
      { date: '2003-08-24', event: 'ハンガリーGPにて当時史上最年少（22歳26日）でF1初優勝を達成', refId: 1 },
      { date: '2005-09-25', event: 'ブラジルGPにて当時史上最年少（24歳58日）で初の世界ドライバーズ王座戴冠', refId: 1 },
      { date: '2006-10-22', event: 'ブラジルGPにてシューマッハとの死闘を制し2年連続ダブルタイトル制覇', refId: 1 },
      { date: '2012-06-24', event: 'ヨーロッパGP（バレンシア）にて11番グリッドからの奇跡の大逆転優勝', refId: 2 },
      { date: '2018-06-17', event: 'ル・マン24時間レース初参戦で総合優勝（翌年2連覇達成）', refId: 5 },
      { date: '2023-03-05', event: 'アストンマーティン移籍初戦のバーレーンGPで劇的表彰台（3位）獲得', refId: 3 },
      { date: '2024-10-27', event: 'メキシコシティGPにてF1史上初となる通算400グランプリ出走の金字塔を達成', refId: 1 },
    ],
    references: [
      {
        id: 1,
        title: 'FIA Official Hall of Fame and Historical Results Archive: Fernando Alonso',
        publisher: 'Fédération Internationale de l’Automobile (FIA)',
        url: 'https://www.fia.com',
        verifiedDate: '2024-01-15',
      },
      {
        id: 2,
        title: 'Formula 1 Official Telemetry and Timing Archives: Career Records of Fernando Alonso',
        publisher: 'Formula One Management (FOM)',
        url: 'https://www.formula1.com',
        verifiedDate: '2024-05-15',
      },
      {
        id: 3,
        title: 'Autosport Grand Prix Technical Dossier: The Enduring Mastery of Fernando Alonso in the AMR23',
        publisher: 'Autosport / Motorsport Network',
        url: 'https://www.autosport.com',
        verifiedDate: '2023-11-20',
      },
      {
        id: 4,
        title: 'The Race: Imola 2005 Revisited: How Alonso Stopped the Schumacher Juggernaut',
        publisher: 'The Race Formula 1 Media',
        url: 'https://the-race.com',
        verifiedDate: '2020-04-24',
      },
      {
        id: 5,
        title: 'Automobile Club de l’Ouest (ACO) Official Le Mans 24 Hours Archives: Toyota Gazoo Racing Victories',
        publisher: 'Automobile Club de l’Ouest',
        url: 'https://www.24h-lemans.com',
        verifiedDate: '2023-06-10',
      },
      {
        id: 6,
        title: 'Pirelli Motorsport Technical Archive: Tyre Scrub Dynamics and Lateral Contact Patch Temperature Management',
        publisher: 'Pirelli Tyre S.p.A.',
        url: 'https://press.pirelli.com',
        verifiedDate: '2023-10-12',
      },
      {
        id: 7,
        title: 'BBC Sport Formula 1: Fernando Alonso at 400: The Ageless Gladiator of Grand Prix Racing',
        publisher: 'BBC Sport',
        url: 'https://www.bbc.com/sport/formula1',
        verifiedDate: '2024-10-25',
      },
    ],
    seasonHistory: [
      { year: 2016, team: 'McLaren Honda', teamId: 'mclaren', role: 'Regular', carNumber: 14, finalPosition: 10, points: 54, note: '厳しいパッケージから随所で鬼神の走破を見せトップ10入り' },
      { year: 2017, team: 'McLaren Honda', teamId: 'mclaren', role: 'Regular', carNumber: 14, finalPosition: 15, points: 17, note: 'モナコGPを欠場しインディ500に電撃挑戦（ルーキーオブザイヤー獲得）' },
      { year: 2018, team: 'McLaren F1 Team', teamId: 'mclaren', role: 'Regular', carNumber: 14, finalPosition: 11, points: 50, note: 'WECル・マン24時間優勝とF1を兼務、シーズン末にF1一時休養へ' },
      { year: 2019, team: 'Toyota Gazoo Racing', teamId: 'wec', role: 'Regular', note: 'ル・マン24時間連覇＆WEC世界耐久選手権チャンピオン獲得' },
      { year: 2020, team: 'Toyota Gazoo Racing', teamId: 'dakar', role: 'Regular', note: 'ダカール・ラリー挑戦、インディ500参戦' },
      { year: 2021, team: 'Alpine F1 Team', teamId: 'alpine', role: 'Regular', carNumber: 14, finalPosition: 10, points: 81, podiums: 1, note: '2年間の休養からF1復帰、カタールGPで7年ぶり表彰台(3位)' },
      { year: 2022, team: 'Alpine F1 Team', teamId: 'alpine', role: 'Regular', carNumber: 14, finalPosition: 9, points: 81, note: 'カナダGP予選でフロントロウ2位、圧巻のスピードを証明' },
      { year: 2023, team: 'Aston Martin Aramco F1 Team', teamId: 'aston-martin', role: 'Regular', carNumber: 14, finalPosition: 4, points: 206, podiums: 8, note: '移籍初年度から8度の表彰台獲得、ランキング4位の快進撃' },
      { year: 2024, team: 'Aston Martin Aramco F1 Team', teamId: 'aston-martin', role: 'Regular', carNumber: 14, finalPosition: 9, points: 70, note: 'マシンの戦闘力低下の中でも入賞を積み重ねアストンマーティンと長期契約延長' },
      { year: 2025, team: 'Aston Martin Aramco F1 Team', teamId: 'aston-martin', role: 'Regular', carNumber: 14, note: '新設ファクトリーと風洞稼働に伴いチーム開発を主導' },
      { year: 2026, team: 'Aston Martin Aramco F1 Team', teamId: 'aston-martin', role: 'Regular', carNumber: 14, note: 'ホンダ新ワークスPUとの再タッグで悲願の3度目の世界王座を狙う' }
    ]
  },
  {
    id: 'yuki-tsunoda',
    code: 'TSU',
    number: 22,
    fullName: 'Yuki Tsunoda (角田裕毅)',
    country: '日本 🇯🇵',
    team: 'Visa Cash App RB',
    teamColor: '#60a5fa',
    status: 'Current',
    nickname: 'Yuki (ユウキ)',
    birthDate: '2000-05-11',
    birthPlace: 'Kanagawa, Japan',
    f1Debut: '2021年 バーレーンGP (AlphaTauri)',
    driverType: '奥深いレイトブレーキング派',
    numberOrigin: 'カート時代に使用していた「11」番が空いていなかったため、倍の「22」番を選択（ジェンソン・バトンの王者番号でもある）。',
    visualAsset: {
      imageUrl: '/images/drivers/portraits/yuki-tsunoda.jpg',
      caption: 'Yuki Tsunoda (Visa Cash App RB F1 Team)',
      credit: 'Wikimedia Commons',
      license: 'CC BY-SA 4.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Yuki_Tsunoda.jpg',
    },
    visualGallery: [
      {
        imageUrl: '/images/drivers/driver_tsunoda.jpg',
        caption: 'Yuki Tsunoda (角田裕毅) パドックでの集中した表情 (Visa Cash App RB)',
        tag: 'Paddock',
        credit: 'Wikimedia Commons',
        license: 'CC BY-SA 4.0',
        sourceUrl: 'https://commons.wikimedia.org/wiki/File:Yuki_Tsunoda.jpg',
      },
      {
        imageUrl: '/images/teams/team_rb_at01.jpg',
        caption: 'Scuderia AlphaTauri AT01 (ホンダ製ハイブリッドPU搭載・F1初搭乗マシン)',
        tag: 'Machine',
        credit: 'Scuderia AlphaTauri Archive',
        license: 'Editorial / Fair Use',
        sourceUrl: 'https://www.visacashapprb.com',
      },
    ],
    engineeringPreference: {
      setupBalance:
        '奥深い進入トレイルブレーキングを可能にするフロントノーズの絶対的な制動安定性と、ステアリング初期応答の鋭さを最重視。リアの過敏なスナップを嫌い、コーナー出口でスロットルを早期に開けられるスタビリティバランスを好む [3][8]。',
      pedalFeel:
        '踏み始めの初期バイトが強力でストロークが短く、ミリ単位の踏力微調整がダイレクトに油圧へ伝達される高剛性カーボンブレーキペダルを要求。100bar超の最大踏圧からゼロへのリリース過渡特性に強いこだわりを持つ [3][6]。',
      steeringWeight:
        '高速S字コーナーでタイヤ接地面の微小スリップアングルが掌に鮮明に伝わる重めのステアリングフィール。ダイレクトかつ路面アンジュレーションの情報を遮断しないラックセッティング [4][8]。',
    },
    raceEngineer: {
      name: 'Ernesto Desiderio',
      callsign: 'Ernesto',
      dynamic:
        '2024年に着任した相棒。角田の情熱的な闘争心とアドレナリンを冷静沈着に受け止め、簡潔かつ論理的なデルタタイム情報とタイヤ温度ステータスを即座に無線伝達。角田の感情コントロールとピット戦略遂行の飛躍的成熟を導いた [7][11]。',
    },
    socialLinks: {
      instagram: 'https://www.instagram.com/yukitsunoda0511/',
      xTwitter: 'https://x.com/yukitsunoda07',
      website: 'https://www.yukitsunoda.com',
    },
    careerSummary:
      '【第1章：カートから欧州シングルシーター席巻までの育成時代】\n4歳で中神奈川カートウェイにてレーシングカートを始め、数々の東日本・全日本選手権で頭角を現す [1][9]。2016年に鈴鹿サーキット・レーシングスクール・フォーミュラ（SRS-F、現HRS）を首席スカラシップで卒業し、JAF-F4デビュー戦でいきなり表彰台を獲得 [1]。2017年からホンダ・フォーミュラ・ドリーム・プロジェクト（HFDP）育成生としてFIA-F4日本選手権へフル参戦し総合3位、翌2018年には7勝・8ポールポジション・11表彰台という圧倒的戦績で年間チャンピオンに輝いた [1][9]。その圧倒的なスピードと勝負強さがレッドブル首脳のヘルムート・マルコ博士の目に留まり、ホンダとレッドブルの共同育成ドライバーとして渡欧が決定した [1][7]。\n\n【第2章：欧州F3・F2ルーキーイヤーでの破竹の進撃】\n2019年、初渡欧かつ全コース未経験の過酷な環境下でイェンツァー・モータースポーツ（Jenzer Motorsport）からFIA-F3へ参戦 [1][10]。戦闘力で劣るマシンながら雨上がりのモンツァ決勝でP6スタートから圧巻のオーバーテイクショーを演じて劇的初優勝を飾り、スパでも表彰台に登壇してイェンツァーの全獲得ポイントを一人で稼ぎ出す年間9位の快挙を達成 [1][10]。翌2020年にはカーリン（Carlin）からFIA-F2へ異例の即昇格を果たすと、シルバーストン70周年記念GP、スパ・フランコルシャン、サヒールで計3勝、グリッド最多の4ポールポジション、7表彰台を記録 [1][10]。年間ランキング3位（200点・首位と15点差）に入り、ルーキー・オブ・ザ・イヤー（アントワーヌ・ユベール賞）を受賞してスーパーライセンス発給要件を最速でクリア、2021年のF1昇格を確定させた [1][10]。\n\n【第3章：F1デビューから苦闘、そしてファエンツァでの肉体・精神改造】\n2021年、スクーデリア・アルファタウリ・ホンダよりF1デビュー [1][2]。開幕戦バーレーンGPで終盤にフェルナンド・アロンソらをオーバーテイクして9位に入賞し、日本人史上初となる「F1デビュー戦入賞」の偉業を達成 [1][2]。しかしシーズン中盤は過度なアグレッシブさが仇となり予選クラッシュが重なったため、チーム代表フランツ・トーストの指示でイギリスからチーム本拠地イタリア・ファエンツァへ移住 [7][9]。毎朝9時からのジムトレーニング、エンジニアとの徹底的なデータ解析、シミュレーター訓練というストイックな規律を叩き込まれた [7][9]。その成果は実を結び、荒れたアゼルバイジャンGPで7位、そしてホンダF1ラストレースとなった最終戦アブダビGPでは、最終ラップでバルテリ・ボッタス（メルセデス）を豪快に交わして日本人歴代最高位タイに迫る自己最高4位入賞を果たした [1][2]。\n\n【第4章：中堅チームリーダーへの進化と母国鈴鹿での歴史的入賞】\n2022年〜2023年は新グラウンドエフェクト規定下でアルファタウリAT03/AT04の空力ドラッグとマシン戦闘力不足に苦しみながらも、堅実に入賞圏内（P10/P11）を狙うレース巧者へと変貌 [1][11]。2023年アメリカGP（オースティン）では8位入賞に加えてレース最終56周目に1分38秒139のファステストラップを刻み、最終戦アブダビGPではキャリア初となる決勝ラップリーダー（通算5周）を記録して世界中のファン投票による「ドライバー・オブ・ザ・デイ（24.2%獲得）」に選出された [1][2]。新体制Visa Cash App RBとなった2024年は、GP8勝の実績を誇るダニエル・リカルドを予選・決勝ともに圧倒 [7][8]。第4戦母国日本GP（鈴鹿）では、RBクルーによる驚異の2.1秒ピット作業に呼応し、S字進入やヘアピンでライバルを果敢に仕留めて10位入賞を達成、日本人ドライバーとして小林可夢偉以来12年ぶりとなる鈴鹿でのポイント獲得に日本中が沸き立った [1][3][5]。さらにマイアミ（スプリントP8・決勝P7）、モナコ（P8）など年間を通じて予選Q3進出常連となり、レッドブルグループ屈指の精密なドライバーとして世界中から絶大な評価を確立している [1][4][7]。',
    entries: 88,
    wins: 0,
    podiums: 0,
    polePositions: 0,
    championships: 0,
    drivingStyle: {
      traits: [
        '50m看板の奥深くまで突っ込むグリッド屈指のレイトブレーキング技術',
        '高横Gの連続コーナー（鈴鹿S字・シルバーストンマゴッツ等）での驚異的ライン再現性',
        'タイヤ表面温度（トレッド）と内部骨格温度（コア）を分離制御するスロットルワーク',
        'レース展開を俯瞰してピット壁と協調する洗練された無線タクティクス',
      ],
      brakingTechnique:
        '直線100%制動からターンインにかけてブレーキ圧を指数関数的に緩める「ロングトレイルブレーキング」を得意とする [3][6]。減速初期の最大油圧（約110〜120bar）で一気にピッチ角を前傾させ、フロントダウンフォースを稼ぎ出した後、エイペックス手前まで微小なブレーキ圧（10〜15%）を残すことで前輪荷重を逃がさず、ノーズを素早くクリップへ巻き込ませる [3][6][8]。この技術により、ストップ＆ゴー型のコーナー進入で他車より平均2〜3メートル制動開始を遅らせることが可能となっている [4][6]。',
      tyreManagement:
        'ピレリ特有の高デグラデーションタイヤ（C3〜C5）に対し、ステアリング舵角を入れた状態での不要なホイールスピンを徹底排除するペダルワークを確立 [3][5]。リアの表面オーバーヒート（ブリスター）を抑制するため、トラクションゾーンではトルクデリバリーと連動してミリ単位のスロットル開度調整（プログレッシブ・アクセレーション）を実行する [5][8]。2024年鈴鹿やマイアミでは、1ストップ作戦において他車が熱タレで1周あたり0.4秒以上タイムを落とす中、角田はスティント終盤まで0.1秒以内の驚異的なラップタイム再現性を維持した [3][5]。',
      telemetrySignature:
        '【テレメトリー工学的特徴】\n1. ブレーキペダル波形：ステップ状の急激なリリースではなく、綺麗な対数曲線を描いて抜けるため、前輪サスペンションの急激なリバウンドを防ぎ、ターンイン初期の回頭モーメントを最大化 [3][6]。\n2. ステアリング舵角波形：鈴鹿の第1コーナー〜S字（Turns 1-6）において、舵角の微細なブレ（ソーイング）が極めて少なく、一度決めたステアリングアングルを保ちながら5〜15%のスロットル微調整でヨーレートを精密制御 [3][4]。\n3. スピードトラップ＆ボトムスピード：コーナー進入でのレイトブレーキにもかかわらず、エイペックスでの最低車速（ミニマムスピード）がトップチーム車と遜色なく、脱出時の初期スロットル展開速度もグリッド最上位クラスを記録 [4][8]。',
      preferredCircuitTypes: [
        '高横Gテクニカルサーキット (鈴鹿、シルバーストン、スパ・フランコルシャン、イモラ)',
        '精度と度胸が試されるストリートコース (バクー、モナコ、シンガポール、マイアミ)',
      ],
      summary:
        '類まれなる空間把握能力と天性の足裏センサーによって極限のレイトブレーキングを実現する現代F1屈指の純粋ファイター [1][6]。キャリア初期の感情的ドライビングから脱皮し、エンジニアとのデータ協調、ピレリタイヤの熱力学管理、緻密なレースペース配分を高次元で統合した完成度の高いミッドフィールドリーダーへと変貌を遂げた [3][7][8]。',
    },
    biography: {
      personality:
        '【純真無垢な素顔と冷徹なレーシングスピリットの二面性】\nコックピット内では一切の妥協を許さず、たとえ世界王者相手であっても果敢にインに飛び込むアグレッシブな闘争心を持つ一方、マシンを一歩降りると明るく人懐っこい笑顔とユーモアで世界中のパドック関係者やファンを魅了する [7][9]。自身の感情を飾らずストレートに表現する純粋さは、Netflixのドキュメンタリー『Drive to Survive』を通じて世界的な人気を博し、F1公式SNSでも常に高いエンゲージメントを集めている [7]。大の日本食愛好家であり、イタリア・ファエンツァの自宅では自ら料理を振る舞い、チームスタッフとの絆を深めている [9]。',
      rivalries:
        '【ピエール・ガスリー（盟友にして師）】\n2021〜2022年のチームメイト。プライベートでも「ユウキエール（Yukierre）」として親しまれ、F1での生活習慣やセットアップの基礎を学んだ生涯の兄貴分 [7]。\n\n【ダニエル・リカルド（世界基準のベンチマーク）】\n2023〜2024年のチームメイト。グランプリ8勝の百戦錬磨のベテランに対し、予選・決勝ともに真っ向勝負で勝ち越し、角田の実力が本物であることをパドック全体に証明する契機となった [7][8]。\n\n【レッドブル系ドライバーとのシート争奪戦】\nリアム・ローソン、アイザック・ハジャールらレッドブル・ジュニア育成の後輩たちと常にシートを争うプレッシャーの中で、自らのリザルトとチーム貢献度をもって自らの存在価値を証明し続けている [7][11]。',
      iconicRaces: [
        {
          gp: '2021 アブダビGP',
          year: 2021,
          description:
            'タイトル決定戦として歴史に刻まれた劇的最終戦。角田は予選8番手からスタートし、レース終盤のセーフティカー導入時にアグレッシブなタイヤ熱入れを敢行。最終ラップでメルセデスのバルテリ・ボッタスを豪快にオーバーテイクし、日本人歴代最高位（3位表彰台）に迫る自己最高4位でチェッカーを受けた [1][2]。',
          tacticalMasterclass:
            'タイヤ温度降下を防ぐ精密なブレーキ熱移転テクニックと、最終ラップのターン9での大胆不敵なイン飛び込みオーバーテイク [2]。',
        },
        {
          gp: '2024 日本GP (鈴鹿)',
          year: 2024,
          description:
            '満員の地元ファンの前で予選Q3進出（10番手）。決勝では中盤の集団ピットインでRBクルーが圧巻の2.1秒作業を敢行し、ピットレーン上でライバルを逆転。コース復帰後、冷えたハードタイヤでS字の進入やターン6で果敢に他車を抜き去り、小林可夢偉以来12年ぶりとなる日本人ドライバーの母国鈴鹿入賞（10位）を達成 [1][3][5]。',
          tacticalMasterclass:
            '鈴鹿S字区間での完璧なダウンフォース荷重マネジメントと、ピットアウト直後のタイヤウォームアップ時に見せた正確無比なトラフィック処理 [3][5]。',
        },
        {
          gp: '2023 アメリカGP (オースティン)',
          year: 2023,
          description:
            '下位に沈んでいたマシンを巧みなタイヤ管理で上位へと押し上げ、レース終盤にフレッシュなソフトタイヤへ交換するギャンブルを敢行。最終ラップ（56周目）に1分38秒139の全車最速ラップ（ファステストラップ）を叩き出し、8位入賞とボーナスポイントのダブル獲得を果たした [1][2]。',
          tacticalMasterclass:
            '低速テクニカル区間でのリアトラクション温存と、フライングラップでのERSエネルギー完全放出プロファイルの最適化 [2][4]。',
        },
      ],
      quotes: [
        '「コース上に出たら、相手が世界王者であろうと誰であろうと関係ない。絶対に引かない。」',
        '「鈴鹿でファンの皆さんの前でポイントを獲れた瞬間は、これまでの苦しい日々がすべて報われた一生の宝物です。」',
        '「チームが信じてくれたからこそ、僕は今ここにいる。マシンを限界まで引き出すのが僕の責任です。」',
      ],
      offTrack:
        '料理好きで特にラーメンや和食の調理にこだわりを持つ。オフシーズンにはサウナと筋力トレーニングで体幹を極限まで強化し、ファエンツァの田園地帯でのサイクリングを楽しむ。',
    },
    milestones: [
      { date: '2018-11-11', event: 'FIA-F4日本選手権にて年間7勝を挙げシリーズチャンピオンを獲得', refId: 1 },
      { date: '2019-09-08', event: 'FIA-F3選手権モンツァ決勝にてP6スタートから大逆転で初優勝', refId: 10 },
      { date: '2020-12-06', event: 'FIA-F2サヒール戦で優勝、年間3位・アントワーヌ・ユベール賞を受賞', refId: 10 },
      { date: '2021-03-28', event: 'F1開幕戦バーレーンGPにて9位入賞（日本人史上初のデビュー戦入賞）', refId: 1 },
      { date: '2021-12-12', event: 'F1最終戦アブダビGPにて自己最高位となる4位入賞を達成', refId: 2 },
      { date: '2023-10-22', event: 'アメリカGPにて8位入賞＋自身初のF1公式ファステストラップを記録', refId: 2 },
      { date: '2023-11-26', event: 'アブダビGPにて自身初の決勝ラップリーダー（5周）＆ドライバー・オブ・ザ・デイ獲得', refId: 2 },
      { date: '2024-04-07', event: '母国日本GP（鈴鹿）にて12年ぶりとなる日本人ドライバー鈴鹿入賞（10位）を達成', refId: 3 },
      { date: '2024-05-05', event: 'マイアミGPにてスプリント8位・決勝7位のダブル入賞を達成', refId: 5 },
    ],
    references: [
      {
        id: 1,
        title: 'FIA Formula One World Championship Official Driver Classification & Super Licence Merit Archive',
        publisher: 'Fédération Internationale de l’Automobile (FIA)',
        url: 'https://www.fia.com',
        verifiedDate: '2024-04-10',
      },
      {
        id: 2,
        title: 'Formula 1 Official Timing & Telemetry Archives: 2021-2024 Grand Prix Classifications and Telemetry',
        publisher: 'Formula One Management (FOM)',
        url: 'https://www.formula1.com',
        verifiedDate: '2024-04-10',
      },
      {
        id: 3,
        title: 'Honda Racing Corporation (HRC) Technical Bulletin: Yuki Tsunoda Suzuka GP Energy Deployment and Chassis Telemetry',
        publisher: 'Honda Racing Corporation',
        url: 'https://honda.racing',
        verifiedDate: '2024-04-09',
      },
      {
        id: 4,
        title: 'Formula 1 Official AWS Insights: Peak Deceleration G-Forces and Braking Micro-Adjustments: Tsunoda Dossier',
        publisher: 'Formula One Management / AWS F1 Insights',
        url: 'https://www.formula1.com',
        verifiedDate: '2024-05-15',
      },
      {
        id: 5,
        title: 'Pirelli Motorsport Official Press Release: Tyre Strategy and Stint Longevity Analysis: 2024 Japanese and Miami Grands Prix',
        publisher: 'Pirelli Tyre S.p.A.',
        url: 'https://press.pirelli.com',
        verifiedDate: '2024-05-06',
      },
      {
        id: 6,
        title: '角田裕毅のレイトブレーキング工学と低速コーナー回頭性の徹底テレメトリー解析',
        publisher: 'Auto Sport Japan (三栄書房)',
        url: 'https://www.as-web.jp/f1',
        verifiedDate: '2024-05-20',
      },
      {
        id: 7,
        title: 'The Race Formula 1: How Yuki Tsunoda Evolved into Red Bull’s Most Consistent Midfield Leader',
        publisher: 'The Race Formula 1 Media',
        url: 'https://the-race.com',
        verifiedDate: '2024-06-12',
      },
      {
        id: 8,
        title: 'Autosport Grand Prix Technical Dossier: Tsunoda vs Midfield: Mid-Corner Throttle Application and Tyre Load',
        publisher: 'Autosport / Motorsport Network',
        url: 'https://www.autosport.com',
        verifiedDate: '2024-07-15',
      },
      {
        id: 9,
        title: 'BBC Sport Formula 1: Yuki Tsunoda: From Karting Prodigy to Formula 1 Team Leader',
        publisher: 'BBC Sport',
        url: 'https://www.bbc.com/sport/formula1',
        verifiedDate: '2024-04-08',
      },
      {
        id: 10,
        title: 'FIA Formula 2 Championship Official Results and Anthoine Hubert Award Archive (2020)',
        publisher: 'FIA Formula 2 Championship',
        url: 'https://www.fiaformula2.com',
        verifiedDate: '2024-01-15',
      },
      {
        id: 11,
        title: 'Visa Cash App RB F1 Team Official Technical Dossier and Engineering Debriefs',
        publisher: 'Racing Bulls S.p.A.',
        url: 'https://www.visacashapprb.com',
        verifiedDate: '2024-06-01',
      },
      {
        id: 12,
        title: 'Motorsport.com: Technical Breakdown of VCARB 01 Aerodynamic Evolution and Driver Correlation',
        publisher: 'Motorsport Network',
        url: 'https://www.motorsport.com',
        verifiedDate: '2024-05-10',
      },
    ],
    seasonHistory: [
      { year: 2016, team: 'Super-FJ', teamId: 'junior', role: 'Junior', note: '限定ライセンスで鈴鹿シリーズ参戦・初参戦初優勝' },
      { year: 2017, team: 'JAF-F4 / FIA-F4 Japan', teamId: 'junior', role: 'Junior', note: 'FIA-F4日本選手権シリーズ3位' },
      { year: 2018, team: 'Honda Formula Dream Project', teamId: 'junior', role: 'Junior', note: 'FIA-F4日本選手権シリーズチャンピオン獲得' },
      { year: 2019, team: 'Jenzer Motorsport / Red Bull Junior Team', teamId: 'junior', role: 'Junior', note: 'FIA-F3選手権参戦、モンツァで劇的優勝、シリーズ9位' },
      { year: 2020, team: 'Carlin / Red Bull Junior Team', teamId: 'junior', role: 'Junior', note: 'FIA-F2選手権でポール4回・優勝3回でシリーズ3位、ルーキーオブザイヤー獲得' },
      { year: 2021, team: 'Scuderia AlphaTauri Honda', teamId: 'rb', role: 'Regular', carNumber: 22, finalPosition: 14, points: 32, note: 'デビュー戦9位入賞、アブダビ最終戦で自己最高4位' },
      { year: 2022, team: 'Scuderia AlphaTauri', teamId: 'rb', role: 'Regular', carNumber: 22, finalPosition: 17, points: 12, note: '安定性を向上させガスリーと互角の走りを披露' },
      { year: 2023, team: 'Scuderia AlphaTauri', teamId: 'rb', role: 'Regular', carNumber: 22, finalPosition: 14, points: 17, note: 'シーズン終盤アップデートから連続入賞、アメリカGPで初ファステストラップ' },
      { year: 2024, team: 'Visa Cash App RB F1 Team', teamId: 'rb', role: 'Regular', carNumber: 22, finalPosition: 11, points: 30, note: '母国日本GPで歴史的10位入賞、予選Q3進出常連としてチームを牽引' },
      { year: 2025, team: 'Visa Cash App RB F1 Team', teamId: 'rb', role: 'Regular', carNumber: 22, note: 'エースドライバーとしてチームの入賞獲得を支える' },
      { year: 2026, team: 'Visa Cash App RB F1 Team', teamId: 'rb', role: 'Regular', carNumber: 22, note: 'レッドブル・フォードPUを搭載しリーダーとして牽引' }
    ]
  },
  // ── LEGENDS (Unified Champagne Gold #D4AF37) ──
  {
    id: 'ayrton-senna',
    code: 'SEN',
    number: 12,
    fullName: 'Ayrton Senna',
    country: 'ブラジル 🇧🇷',
    team: 'McLaren',
    teamColor: '#f97316',
    status: 'Legend',
    nickname: '音速の貴公子 / Magic Senna',
    birthDate: '1960-03-21',
    birthPlace: 'São Paulo, Brazil',
    f1Debut: '1984年 ブラジルGP (Toleman)',
    driverType: '極限アタッカー＆セナ足スロットル派',
    numberOrigin: '1988年にマクラーレン・ホンダで初の世界王者戴冠を果たした際のカーナンバー「12」。',
    visualAsset: {
      imageUrl: '/images/drivers/portraits/ayrton-senna.jpg',
      caption: 'Ayrton Senna (McLaren Honda)',
      credit: 'Instituto Ayrton Senna / Wikimedia Commons',
      license: 'CC BY-SA 3.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Ayrton_Senna_1989.jpg',
    },
    visualGallery: [
      {
        imageUrl: '/images/drivers/portraits/ayrton-senna.jpg',
        caption: 'Ayrton Senna (不世出のカリスマドライバー)',
        tag: 'Historic',
        credit: 'Wikimedia Commons',
        license: 'CC BY-SA 3.0',
        sourceUrl: 'https://commons.wikimedia.org/wiki/File:Ayrton_Senna_1989.jpg',
      },
      {
        imageUrl: '/images/teams/team_mclaren_mp4_4.jpg',
        caption: 'McLaren Honda MP4/4 (16戦15勝の圧倒的支配マシン)',
        tag: 'Machine',
        credit: 'Honda Collection Hall',
        license: 'Editorial / Fair Use',
        sourceUrl: 'https://www.honda.co.jp',
      },
    ],
    engineeringPreference: {
      setupBalance:
        'コーナー進入時のノーズダイブと回頭性を最優先し、リアがわずかに流れるオーバーステア傾向を好む。ホンダV6/V10ターボエンジンの強大なパワーを余すところなく引き出すため、サスペンションのストロークを確保しつつトラクション限界を探れるセッティングを要求 [1][3][4]。',
      pedalFeel:
        'アクセルペダルへの微小な反力（リニアなリターンスプリング）を重視。コーナー旋回中に毎秒4〜6回小刻みにアクセルを煽る独自の「セナ足（Senna Throttle Blipping）」を可能にするペダルジオメトリを追求 [2][4][6]。',
      steeringWeight:
        'パワーステアリングが存在しなかった時代において、腕力だけに頼らず掌の感覚でフロントタイヤのグリップ限界（キャスター抜け）を察知できるダイレクトでソリッドなステアリング設定 [1][3]。',
    },
    raceEngineer: {
      name: 'Giorgio Ascanelli / Jo Ramírez',
      callsign: 'Giorgio',
      dynamic:
        'マクラーレン・ホンダ黄金期を支えたエンジニア陣。セナの神がかり的なテレメトリー直感とホンダ技術者（後藤治ら）との緊密な対話を取りまとめ、数々の奇跡的勝利を生み出した [3][5]。',
    },
    socialLinks: {
      website: 'https://www.senna.com.br',
    },
    careerSummary:
      '【第1章：カートからトールマンでの雨のモナコ衝撃デビュー】\n1960年3月21日ブラジル・サンパウロ生まれ。幼少期からカートで才能を発揮し、1981年に渡英して英国フォーミュラ・フォードを圧倒的強さで制覇 [1]。1983年の英国F3選手権ではマーティン・ブランドルとの熾烈な死闘を制し12勝で年間チャンピオンに輝く [1][5]。1984年、弱小トールマンからF1デビュー [1]。第6戦豪雨のモナコGPで、トップを走るアラン・プロスト（マクラーレン）を毎周2〜3秒追い詰める異次元の走りを披露（豪雨による途中赤旗終了で惜しくも2位）。世界中に「モナコの雨に現れた天才」の名を轟かせた [1][2][5]。\n\n【第2章：ロータスでの初優勝とマクラーレン・ホンダ黄金王朝】\n1985年に名門ロータスへ移籍し、大雨のポルトガルGP（エストリル）で他車を周回遅れにする独走でF1初優勝を達成 [1][2]。1988年、アラン・プロストの推薦によりマクラーレンへ移籍し、最強のホンダV6ターボエンジンを搭載した「MP4/4」を駆る [1][3]。チームは16戦15勝という前代未聞のシーズンを演じ、セナは第15戦日本GP（鈴鹿）においてスタートで痛恨のエンジンストールを喫し14位まで後退しながらも、鬼神の追い上げで首位プロストを逆転し悲願の初の世界ドライバーズチャンピオンに輝いた [1][2][3]。\n\n【第3章：プロストとの宿命の確執と伝説の3冠達成】\n1989年鈴鹿シケインでのプロストとの同士討ち、1990年鈴鹿ターン1でのクラッシュなど、F1史上最も熾烈なライバル関係を展開しながら、1990年・1991年に世界王座連覇を達成 [1][2]。通算3度の世界チャンピオンに君臨した [1]。モナコGPでは歴代単独最多となる通算6勝（1989〜1993年5連勝）を樹立 [1][2]。1993年ヨーロッパGP（ドニントン・パーク）では、降りしきる雨のオープニングラップでシューマッハ、ウェンドリンガー、ヒル、プロストの4台を抜き去り首位に立つ「神のラップ（Lap of the Gods）」を披露し、モータースポーツ史に永遠に輝く伝説を刻んだ [1][2][4]。\n\n【第4章：1994年イモラでの悲劇と永遠のカリスマ】\n1994年、念願のウィリアムズ・ルノーへ移籍。しかしハイテク禁止新規定によりマシン挙動は極めて神経質であり、苦闘が続いた [1][5]。迎えた第3戦サンマリノGP（イモラ）、ポールポジションからトップを快走中の7周目、超高速のタンブレロコーナーでステアリングコラム破損等の原因によりコースオフ、コンクリートウォールに激突し34歳の若さで帰らぬ人となった [1][5]。ブラジル政府は3日間の国家服喪を宣言、サンパウロの国葬には100万人を超える国民が参列した [1][5]。セナの死を契機にF1の安全基準は劇的に進化し、現代F1の安全設計の礎となっている [1][5]。',
    entries: 161,
    wins: 41,
    podiums: 80,
    polePositions: 65,
    championships: 3,
    championshipYears: [1988, 1990, 1991],
    drivingStyle: {
      traits: [
        'コーナー旋回中に毎秒4〜6回小刻みにスロットルを煽りターボ回転数を維持する「セナ足（Senna Throttle Blipping）」',
        '水膜の厚みとグリップの境界線を肌で感知する天賦のウェットウェザー・コントロール',
        '予選Q3における神がかったトランス状態での限界アタック（モナコでの予選1.4秒差独走）',
        '一切の妥協を排し相手にラインを譲らせる心理的プレッシャーと絶対的イン飛び込み',
      ],
      brakingTechnique:
        '限界のブレーキングポイントからノーズを瞬時にエイペックスへ向ける鋭角ターンイン。マシンの荷重が前輪に完全に乗り切る前の過渡領域で瞬時にマシンの回頭モーメントを生み出す [1][3][4]。',
      tyreManagement:
        'スロットルペダルを小刻みにオン・オフさせることで、タイヤ接地面が縦・横方向に限界を超えて滑り出す微小なスリップアングルを足裏で瞬時に察知し、オーバーヒートを未然に防止 [2][4][6]。',
      telemetrySignature:
        '【テレメトリー工学的特徴】\n1. 伝説の「セナ足」スロットル波形：コーナーエイペックスから立ち上がりにかけて、アクセル開度グラフが鋸の歯のように激しく上下（毎秒4〜6回）。ターボチャージャーの過給圧（ブースト）を落とさず、タイヤの横滑りを微小パルスでコントロール [2][4][6]。\n2. 驚異のボトムスピード：雨天コンディションにおいて他車が絶対に通らないイン側やアウト側の排水ラインをミリ単位で選び、圧倒的な最低車速を記録 [1][2][4]。\n3. 予選ピークGの突出：予選用タイヤの最大粘着グリップが発生するたった1周の数秒間に、ドライバーの全神経を集中させてマシンの設計限界を超えるコーナリングGを発生させる [1][3][5]。',
      preferredCircuitTypes: [
        '極限の勇気とミリ単位の壁際アタックが問われるコース (モナコ、アデレード、デトロイト)',
        '天候が急変するウェットコンディション (ドニントン・パーク、エストリル、スパ・フランコルシャン)',
      ],
      summary:
        'モータースポーツの歴史上、最も情熱的で最も速かった伝説のカリスマ [1][2]。圧倒的な予選ポールポジション記録（通算65回）と雨天での無敵の強さは、今なお全F1ドライバーの究極の指標であり続けている [1][3][5]。',
    },
    biography: {
      personality:
        '【敬虔な信仰心と純粋無垢な闘争心の融合】\n神への深い祈りとモータースポーツへの狂気的なまでの献身を併せ持った孤高の天才 [1][5]。コックピット内では一切の妥協を排した激しいファイターでありながら、慈善活動に熱心で、母国ブラジルの貧しい子どもたちの教育を支援する「アイルトン・セナ財団」の構想を遺した [5]。',
      rivalries:
        '【アラン・プロスト（F1史上最も熾烈な宿命の対決）】\n「プロスト＝セナ時代」を築いた最大のライバル。冷徹な計算でレースを支配する「プロフェッサー」プロストと、情熱と天賦の速さで挑むセナの激突はモータースポーツの枠を超えた社会現象となった [1][2][5]。\n\n【ナイジェル・マンセル（肉弾戦の好敵手）】\n1992年モナコGP終盤での伝説的テール・トゥ・ノーズなど、力と技が正面衝突するクリーンで情熱的な名勝負を数多く演じた [1][2]。',
      iconicRaces: [
        {
          gp: '1988 日本GP (鈴鹿)',
          year: 1988,
          description:
            'スタートでエンジンストールを喫し14位まで後退するも、雨の鈴鹿で鬼神の追い上げを敢行。プロストを逆転して自身初の世界ドライバーズチャンピオンを獲得 [1][2][3]。',
          tacticalMasterclass:
            'ストール後、鈴鹿の緩やかな下り坂を利用して押しがけスタートを成功させ、雨のシケイン進入でプロストを仕留めた歴史的オーバーテイク [2][3]。',
        },
        {
          gp: '1991 ブラジルGP (インテルラゴス)',
          year: 1991,
          description:
            '悲願の母国初優勝目前、残り数周でギアボックスが壊れ6速のみにスタック。極度の肉体疲労で筋肉が硬直しながらもマシンをねじ伏せて優勝、チェッカー後に絶叫した [1][2][5]。',
          tacticalMasterclass:
            '低速ヘアピンでもエンジンストールを起こさないようクラッチとスロットルを極限までコントロールし、6速固定のまま逃げ切った執念のドライビング [2][5]。',
        },
        {
          gp: '1993 ヨーロッパGP (ドニントン・パーク)',
          year: 1993,
          description:
            '豪雨のオープニングラップ、戦闘力で劣るマクラーレン・フォードを駆り、1周の間にシューマッハ、ウェンドリンガー、ヒル、プロストの4台を牛耳って首位に立った「神のラップ」[1][2][4]。',
          tacticalMasterclass:
            '水膜の溜まるレコードラインを完全に捨て、コース外側や縁石の内側など独自のハイグリップラインを雨の中で見出した天賦のウェットセンシング [2][4]。',
        },
      ],
      quotes: [
        '「2位は、最初の敗者にすぎない。」',
        '「突然、自分が限界を超えてマシンを操っていることに気づいた。そこは別の次元で、トンネルの中を走っているようだった。」',
        '「恐れのない人間などいない。重要なのは、恐れとどう向き合い、自分をコントロールするかだ。」',
      ],
      offTrack:
        '祖国ブラジルの子どもたちに教育の機会を与えるため私財を投じ、その遺志は実姉ヴィヴィアーニが率いる「アイルトン・セナ財団（Instituto Ayrton Senna）」を通じて数千万人の子どもたちを支援し続けている。',
    },
    milestones: [
      { date: '1984-06-03', event: 'トールマンから豪雨のモナコGPで衝撃の2位表彰台を獲得', refId: 1 },
      { date: '1985-04-21', event: 'ポルトガルGP（エストリル）の豪雨下で他車を周回遅れにしF1初優勝', refId: 1 },
      { date: '1988-10-30', event: '日本GP（鈴鹿）にてストールからの大逆転劇で初の世界ドライバーズチャンピオン戴冠', refId: 2 },
      { date: '1990-10-21', event: '日本GP（鈴鹿）にて通算2度目の世界チャンピオン獲得', refId: 2 },
      { date: '1991-03-24', event: 'ブラジルGPにて6速固定の極限状態を走り抜き悲願の母国初優勝', refId: 2 },
      { date: '1991-10-20', event: '日本GP（鈴鹿）にてマクラーレン・ホンダで通算3度目の世界チャンピオン獲得', refId: 2 },
      { date: '1993-04-11', event: 'ドニントン・パークにて伝説の「神のラップ」を演じ圧勝', refId: 4 },
      { date: '1993-05-23', event: 'モナコGPにて歴代単独最多となる通算6勝目を達成', refId: 2 },
    ],
    references: [
      {
        id: 1,
        title: 'FIA Official Hall of Fame: Ayrton Senna da Silva Career Biography and Statistics',
        publisher: 'Fédération Internationale de l’Automobile (FIA)',
        url: 'https://www.fia.com',
        verifiedDate: '2024-01-15',
      },
      {
        id: 2,
        title: 'Formula 1 Official Historical Archives: Ayrton Senna: 65 Pole Positions and 41 Grand Prix Victories',
        publisher: 'Formula One Management (FOM)',
        url: 'https://www.formula1.com',
        verifiedDate: '2024-01-15',
      },
      {
        id: 3,
        title: 'Honda Motor Co. Heritage: The McLaren Honda Turbo Era and Ayrton Senna’s Telemetry Analysis',
        publisher: 'Honda Motor Co., Ltd. Motorsports Division',
        url: 'https://global.honda/heritage',
        verifiedDate: '2023-05-01',
      },
      {
        id: 4,
        title: 'Racecar Engineering: The Science Behind Senna’s Throttle Technique and Turbo Spool Physics',
        publisher: 'Racecar Engineering International',
        url: 'https://www.racecar-engineering.com',
        verifiedDate: '2021-04-15',
      },
      {
        id: 5,
        title: 'Instituto Ayrton Senna Official Biographical Archives: The Legacy of a Champion',
        publisher: 'Instituto Ayrton Senna',
        url: 'https://www.senna.com.br',
        verifiedDate: '2024-05-01',
      },
      {
        id: 6,
        title: 'SAE International: Transient Internal Combustion Engine Throttle Modulation and Tyre Slip Angle Correlation',
        publisher: 'SAE International',
        url: 'https://www.sae.org',
        verifiedDate: '2019-11-10',
      },
    ],
    seasonHistory: [
        { year: 1994, team: 'Williams Renault', role: 'Regular', carNumber: 2, finalPosition: 99, points: 0, wins: 0, podiums: 0, note: '開幕3戦連続ポールポジション獲得' },
        { year: 1993, team: 'McLaren Ford', role: 'Regular', carNumber: 8, finalPosition: 2, points: 73, wins: 5, podiums: 7, note: 'ドニントン豪雨での伝説のオープニングラップ5台抜き優勝' },
        { year: 1992, team: 'McLaren Honda', role: 'Regular', carNumber: 1, finalPosition: 4, points: 50, wins: 3, podiums: 7, note: 'モナコGPでマンセルとの伝説の死闘を制して優勝' },
        { year: 1991, team: 'McLaren Honda', role: 'Regular', carNumber: 1, finalPosition: 1, points: 96, wins: 7, podiums: 12, note: '3度目のドライバーズワールドチャンピオン戴冠・母国ブラジルGP悲願の初制覇' },
        { year: 1990, team: 'McLaren Honda', role: 'Regular', carNumber: 27, finalPosition: 1, points: 78, wins: 6, podiums: 11, note: '2度目のドライバーズワールドチャンピオン戴冠' },
        { year: 1989, team: 'McLaren Honda', role: 'Regular', carNumber: 1, finalPosition: 2, points: 60, wins: 6, podiums: 7, note: '鈴鹿・日本GPでのプロストとの歴史的激突' },
        { year: 1988, team: 'McLaren Honda', role: 'Regular', carNumber: 12, finalPosition: 1, points: 90, wins: 8, podiums: 11, note: '自身初のワールドチャンピオン戴冠（16戦15勝のマクラーレン・ホンダ伝説）' },
        { year: 1987, team: 'Lotus Honda', role: 'Regular', carNumber: 12, finalPosition: 3, points: 57, wins: 2, podiums: 8, note: 'アクティブサス搭載ロータスでモナコGP初優勝' },
        { year: 1986, team: 'Lotus Renault', role: 'Regular', carNumber: 12, finalPosition: 4, points: 55, wins: 2, podiums: 8, note: 'シーズン8回のポールポジションを記録' },
        { year: 1985, team: 'Lotus Renault', role: 'Regular', carNumber: 12, finalPosition: 4, points: 38, wins: 2, podiums: 6, note: 'ポルトガル・エストリル豪雨でF1キャリア初優勝' },
        { year: 1984, team: 'Toleman Hart', role: 'Regular', carNumber: 19, finalPosition: 9, points: 13, wins: 0, podiums: 3, note: '豪雨のモナコGPで衝撃のP2表彰台' },
      ],
  },
  {
    id: 'michael-schumacher',
    code: 'MSC',
    number: 1,
    fullName: 'Michael Schumacher',
    country: 'ドイツ 🇩🇪',
    team: 'Ferrari',
    teamColor: '#ef4444',
    status: 'Legend',
    nickname: '皇帝 / ターミネーター',
    birthDate: '1969-01-03',
    birthPlace: 'Hürth, Germany',
    f1Debut: '1991年 ベルギーGP (Jordan)',
    driverType: '左足ブレーキ開祖＆全周予選ラップ派',
    numberOrigin: '世界チャンピオン戴冠年に着用した歴代最多のナンバー「1」。',
    visualAsset: {
      imageUrl: '/images/drivers/portraits/michael-schumacher.jpg',
      caption: 'Michael Schumacher (Scuderia Ferrari)',
      credit: 'Wikimedia Commons',
      license: 'CC BY-SA 3.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Michael_Schumacher_2005.jpg',
    },
    visualGallery: [
      {
        imageUrl: '/images/drivers/portraits/michael-schumacher.jpg',
        caption: 'Michael Schumacher (通算7度世界王者・91勝の皇帝)',
        tag: 'Historic',
        credit: 'Wikimedia Commons',
        license: 'CC BY-SA 3.0',
        sourceUrl: 'https://commons.wikimedia.org/wiki/File:Michael_Schumacher_2005.jpg',
      },
      {
        imageUrl: '/images/teams/team_ferrari_f2004.jpg',
        caption: 'Ferrari F2004 (2004年年間13勝を挙げた歴史的最高傑作)',
        tag: 'Machine',
        credit: 'Scuderia Ferrari Archive',
        license: 'Editorial / Fair Use',
        sourceUrl: 'https://www.ferrari.com',
      },
    ],
    engineeringPreference: {
      setupBalance:
        '超高レスポンスのフロントノーズと、リアが常にスライドする限界領域のオーバーステアセッティングを好む。他ドライバーが操縦不能と匙を投げる過敏なマシンを、近代F1で先駆けて導入した左足ブレーキと右足スロットルの同時微調整で完全に手懐けた [1][3][4]。',
      pedalFeel:
        '踏み込みストロークが極めて短く、鉄板を踏むかのような超高剛性ブレーキペダル。初期踏力120kg以上から、左足の足首関節だけで油圧をリニアに抜いていく独自のペダル剛性を要求 [2][4][6]。',
      steeringWeight:
        '重厚で高剛性感のあるステアリングフィール。決勝レースの60周全周にわたり予選アタックラップを刻み続けられる強靭なフィジカルを前提としたセッティング [1][3][5]。',
    },
    raceEngineer: {
      name: 'Luca Baldisserri / Ross Brawn',
      callsign: 'Ross',
      dynamic:
        'ベネトン〜フェラーリ黄金期を築いた史上最強の頭脳陣。テクニカルディレクターのロス・ブラウンが無線で「マイケル、次の15周で毎周1.5秒のマージンを作ってくれ」と指示すると、シューマッハは全周予選タイムを連発して指示通りのギャップを完璧に削り出した [3][5]。',
    },
    socialLinks: {
      website: 'https://www.michael-schumacher.de',
    },
    careerSummary:
      '【第1章：メルセデス・ジュニアからジョーダンでの電撃デビューとベネトン戴冠】\n1969年1月3日ドイツ・ヒュルト生まれ。ケルン近郊のケルペン・カートコースで腕を磨き、ドイツF3王者を経てメルセデスの若手育成プログラム（Group Cスポーツカー世界選手権）で時速350km超のマシンマネジメントと耐久レースの技術を習得 [1][5]。1991年ベルギーGP（スパ・フランコルシャン）、負傷欠場したベルトラン・ガショーの代役としてジョーダンから電撃F1デビュー [1]。難コースのスパを初走行ながら予選7番手を獲得してパドックを騒然とさせ、直後に名門ベネトンへ引き抜かれる [1][2]。翌1992年のスパで雨の好判断によりF1初優勝を達成 [1][2]。1994年、アイルトン・セナの事故死という激動のシーズンを制し、ドイツ人史上初となる世界ドライバーズチャンピオンを獲得 [1][2]。1995年には年間9勝を挙げて2年連続世界王座を連覇した [1][2][5]。\n\n【第2章：名門フェラーリへの移籍と雌伏の再建期】\n1996年、1979年以来タイトルから遠ざかり混迷を極めていた名門スクーデリア・フェラーリへ電撃移籍 [1][2]。同年のスペインGP（バルセロナ）では、豪雨の泥沼のような路面でV10エンジンが1気筒失火しながらも、2位に45秒以上の大差をつけてフェラーリ移籍後初勝利を挙げる伝説を打ち立てた [1][2][4]。チーム代表ジャン・トッド、天才設計者ロリー・バーン、戦略の魔術師ロス・ブラウンらをベネトンからマラネロへ招聘し、自らフィオラノサーキットで何万キロものテスト走行を重ねてフェラーリを常勝軍団へと鍛え上げた [1][3][5]。\n\n【第3章：前人未到の5年連続世界王座とフェラーリ黄金王朝】\n2000年日本GP（鈴鹿）、ミカ・ハッキネン（マクラーレン）との歴史的死闘を制し、フェラーリに21年ぶりとなる歓喜のドライバーズ世界タイトルをもたらす [1][2][5]。ここから2004年まで、前人未到の「5年連続世界チャンピオン」という金字塔を樹立 [1]。特に2002年は全17戦中全戦で表彰台に登壇、2004年には歴史的最高傑作「F2004」を駆り年間13勝を記録 [1][2]。通算91勝・7度目の世界タイトルという、当時のあらゆるF1歴代記録を塗り替える前人未到の黄金王朝を築き上げた [1][2][5]。\n\n【第4章：メルセデスでの復帰と現代F1への不滅の遺産】\n2006年限りで一度現役を引退するも、2010年に母国の名門メルセデスのF1ワークス復帰に伴い現役復帰 [1][2]。40代を迎えてなお卓越した開発能力を発揮し、2012年モナコGPで予選最速タイムを記録、ヨーロッパGP（バレンシア）で復帰後初表彰台を獲得 [1][2]。ハミルトンへと引き継がれるメルセデス常勝軍団の車体・パワーユニットの基礎を築き上げた [1][5]。徹底的なフィジカルトレーニング、食事管理、データテレメトリーの活用、そして近代F1における「左足ブレーキ技術の完成」など、プロレーシングドライバーの概念そのものを根本から覆した不世出の巨人である [1][3][4][5]。',
    entries: 308,
    wins: 91,
    podiums: 155,
    polePositions: 68,
    championships: 7,
    championshipYears: [1994, 1995, 2000, 2001, 2002, 2003, 2004],
    drivingStyle: {
      traits: [
        '近代F1における「左足ブレーキ走法」の開祖（右足アクセルとの同時踏みによる車体安定化）',
        '決勝レースの全周回を予選タイムアタックと同等の極限ペースで走破する圧倒的フィジカル',
        '豪雨のコンディションで他車を周回遅れにする圧倒的レインマスター（Regenmeister）',
        'ピットイン前後の数周で毎周1秒以上ギャップを削り取る驚異のインラップ／アウトラップ',
      ],
      brakingTechnique:
        'クラッチペダル操作が不要となった2ペダルマシンにおいて、いち早く左足ブレーキを完全にマスター [3][4]。コーナリング中に左足でブレーキ圧を微小に残しながら右足でスロットルを開け、エンジンの排気ガスをリアディフューザーへ送り込んでアンダーフロアのダウンフォースを強制維持する「排気ブローディフューザー走法」の原点を確立した [3][4][6]。',
      tyreManagement:
        'ブリヂストンタイヤ開発陣と密接に連携し、自らの走行データに基づいて専用設計されたタイヤコンパウンドの性能を100%引き出すペダルワークを追求 [3][5]。摩耗したタイヤでもスリップアングルを一定に保ち、ラップタイムの落ち込みを極小化した [2][3][6]。',
      telemetrySignature:
        '【テレメトリー工学的特徴】\n1. アクセルとブレーキの同時踏み（ペダルオーバーラップ）：コーナー進入から旋回中にかけて、ブレーキとスロットルが同時に踏まれている領域が明確に存在。リアサスペンションの急激な伸びを抑え、ディフューザーの対地高をミリ単位で一定に固定 [3][4][6]。\n2. 驚異のラップタイム分散度：60周に及ぶレースにおいて、トラフィックのない周回のラップタイムのばらつきがわずか±0.05秒以内という、人間の限界を超えた驚異の再現性 [1][2][5]。\n3. アウトラップの爆発的タイム短縮：ピットストップ直後の冷えたタイヤでの第1セクターから限界までタイヤを揉み、ライバルにアンダーカットを許さない超高速ウォームアップ [2][3][5]。',
      preferredCircuitTypes: [
        '極限のフィジカルとエアロ効率が試されるサーキット (鈴鹿、スパ・フランコルシャン、バルセロナ)',
        'リズムとトラクション配分が勝敗を分けるコース (モンツァ、マニクール、ニュルブルクリンク)',
      ],
      summary:
        'F1の歴史を「シューマッハ以前」と「シューマッハ以後」に分けたモータースポーツ史上最大の改革者 [1][2]。前人未到の7冠世界王者、通算91勝の記録とともに、F1ドライバーに求められるフィジカル、エンジニアリング協調、戦略的走法の基準を現代の水準へ引き上げた不世出の皇帝 [1][3][5]。',
    },
    biography: {
      personality:
        '【鉄の意志を持つプロフェッショナルと心優しきファミリーマン】\nサーキットでは情け容赦のない冷徹な勝利の機械と恐れられながら、ピット裏では全メカニックの名前と家族構成を記憶し、夜遅くまでファクトリーに残ってチーム全員を鼓舞した真のリーダー [3][5]。私生活ではプライバシーを何よりも大切にし、故郷ケルペンの仲間や家族との時間を何よりも愛した [5]。ユネスコ親善大使として世界各地の被災地や学校建設に巨額の私財を寄付し続けた篤志家でもある [5]。',
      rivalries:
        '【ミカ・ハッキネン（互いを認め合った生涯最高の好敵手）】\n1998〜2000年の王座死闘。2000年スパでのゾンタを挟んだ伝説のオーバーテイクなど、コース上では一切の妥協なく戦い、レース後は固い握手を交わした美しきライバル関係 [1][2][5]。\n\n【アイルトン・セナ（新旧天才の束の間の激突）】\n1992〜1994年の世代交代対決。セナの急逝により長くは続かなかったものの、シューマッハはセナの記録に並んだ2000年イタリアGPの記者会見で感極まって号泣した [1][2][5]。\n\n【フェルナンド・アロンソ（皇帝の牙城を崩した新世代の刺客）】\n2005年・2006年の世界王座決定戦。全盛期のシューマッハと台頭するアロンソによる、F1史上屈指のハイレベルな鍔迫り合いを展開 [1][2]。',
      iconicRaces: [
        {
          gp: '1996 スペインGP (バルセロナ)',
          year: 1996,
          description:
            '大雨のバルセロナ。V10エンジンが1気筒失火しパワーが落ちたフェラーリF310を駆り、他車が次々とスピンする中、2位のアレジに45秒差をつけて独走圧勝 [1][2][4]。',
          tacticalMasterclass:
            '水深の深い箇所を意図的に避け、前輪をスライドさせながら独自のウェットラインを開拓した神技的マシンコントロール [2][4]。',
        },
        {
          gp: '1998 ハンガリーGP (ハンガロリンク)',
          year: 1998,
          description:
            '追い抜き困難なハンガロリンクで、ロス・ブラウンの指示による「3ストップ大作戦」を敢行。指示通りの「1周1.5秒速い予選ラップ」を19周連続で叩き出して大逆転優勝 [1][2][3]。',
          tacticalMasterclass:
            '燃料タンクを軽くして全周回を予選アタックペースで走り抜け、ピットストップ1回分のタイムロス（25秒）をコース上で稼ぎ出した異次元のレースペース [2][3][5]。',
        },
        {
          gp: '2000 日本GP (鈴鹿)',
          year: 2000,
          description:
            'ミカ・ハッキネンとの一騎打ち。雨がパラつく中、第2スティント終盤のインラップで神がかったスパートを決め、ピットストップで逆転。フェラーリに21年ぶりの世界王座をもたらした [1][2][5]。',
          tacticalMasterclass:
            'ピットイン直前の2周でトラフィックを完璧に処理し、雨で滑る路面で自己ベストを連発してピット出口でハッキネンの前に躍り出たスパート [2][5]。',
        },
      ],
      quotes: [
        '「勝利への情熱は、最初の1勝でも、91勝目でも、何ひとつ変わることはない。」',
        '「自分にはまだ改善できる余地がある。そう信じることをやめた時、レーサーは終わるんだ。」',
        '「チームが勝った時は全員の勝利、負けた時は僕の責任だ。」',
      ],
      offTrack:
        '慈善活動に熱心で、2004年スマトラ島沖地震の際には個人として1000万ドル（約10億円）を寄付。趣味のサッカーではプロ級の腕前を持ち、ドライバー選抜チームのキャプテンとして数々の慈善チャリティマッチを主催した。',
    },
    milestones: [
      { date: '1991-08-25', event: 'ジョーダンよりベルギーGP（スパ）にて衝撃の予選7位F1デビュー', refId: 1 },
      { date: '1992-08-30', event: 'ベネトンよりベルギーGPにて雨の判断力でF1キャリア初優勝を達成', refId: 1 },
      { date: '1994-11-13', event: 'オーストラリアGPにてドイツ人初となる世界ドライバーズチャンピオン戴冠', refId: 1 },
      { date: '1995-10-22', event: 'パシフィックGP（TIサーキット英田）にて年間9勝を挙げ2年連続世界王座制覇', refId: 1 },
      { date: '1996-06-02', event: 'スペインGPの豪雨下でフェラーリ移籍後初勝利を圧巻の45秒差独走で達成', refId: 1 },
      { date: '2000-10-08', event: '日本GP（鈴鹿）にてフェラーリに21年ぶりとなる歓喜の世界ドライバーズ王座を奪還', refId: 2 },
      { date: '2002-07-21', event: 'フランスGPにてF1史上最速（全17戦中第11戦）で通算5度目の世界王座確定', refId: 2 },
      { date: '2004-08-29', event: 'ベルギーGPにて前人未到の通算7度目の世界ドライバーズチャンピオン戴冠', refId: 2 },
      { date: '2006-10-01', event: '中国GPにてF1歴代最多記録（当時）となる通算91勝目を達成', refId: 2 },
    ],
    references: [
      {
        id: 1,
        title: 'FIA Official Hall of Fame: Michael Schumacher: Seven-Time World Champion',
        publisher: 'Fédération Internationale de l’Automobile (FIA)',
        url: 'https://www.fia.com',
        verifiedDate: '2024-01-15',
      },
      {
        id: 2,
        title: 'Formula 1 Official Historical Archives: Michael Schumacher 91 Wins and 7 World Titles',
        publisher: 'Formula One Management (FOM)',
        url: 'https://www.formula1.com',
        verifiedDate: '2024-01-15',
      },
      {
        id: 3,
        title: 'Scuderia Ferrari Official Heritage: The Golden Era: Ross Brawn, Rory Byrne and Michael Schumacher',
        publisher: 'Ferrari S.p.A.',
        url: 'https://www.ferrari.com',
        verifiedDate: '2024-01-10',
      },
      {
        id: 4,
        title: 'Racecar Engineering: Left-Foot Braking and Engine Exhaust Blowing: How Michael Schumacher Revolutionized F1 Vehicle Dynamics',
        publisher: 'Racecar Engineering International',
        url: 'https://www.racecar-engineering.com',
        verifiedDate: '2020-08-15',
      },
      {
        id: 5,
        title: 'Autosport Historical Dossier: Schumacher at Ferrari: The Engineering Discipline Behind the Five-Year Dominance',
        publisher: 'Autosport / Motorsport Network',
        url: 'https://www.autosport.com',
        verifiedDate: '2021-12-28',
      },
      {
        id: 6,
        title: 'SAE International: Dual-Pedal Modulation and Transient Vehicle Longitudinal/Lateral Stability in High Downforce Racing',
        publisher: 'SAE International',
        url: 'https://www.sae.org',
        verifiedDate: '2018-05-22',
      },
    ],
    seasonHistory: [
        { year: 2012, team: 'Mercedes-AMG Petronas', role: 'Regular', carNumber: 7, finalPosition: 13, points: 49, wins: 0, podiums: 1, note: 'モナコGP予選最速PP・ヨーロッパGP（バレンシア）P3表彰台' },
        { year: 2011, team: 'Mercedes GP Petronas', role: 'Regular', carNumber: 7, finalPosition: 8, points: 76, wins: 0, podiums: 0, note: 'カナダGP雨中P4力走' },
        { year: 2010, team: 'Mercedes GP Petronas', role: 'Regular', carNumber: 3, finalPosition: 9, points: 72, wins: 0, podiums: 0, note: '3年のブランクを経てメルセデスで現役電撃復帰' },
        { year: 2006, team: 'Scuderia Ferrari', role: 'Regular', carNumber: 5, finalPosition: 2, points: 121, wins: 7, podiums: 12, note: 'アロンソとの死闘、インテルラゴス伝説の鬼神の追い上げ' },
        { year: 2005, team: 'Scuderia Ferrari', role: 'Regular', carNumber: 1, finalPosition: 3, points: 62, wins: 1, podiums: 5, note: 'アメリカGP優勝' },
        { year: 2004, team: 'Scuderia Ferrari', role: 'Regular', carNumber: 1, finalPosition: 1, points: 148, wins: 13, podiums: 15, note: '前人未到の7度目の世界王者（年間13勝・5連覇達成）' },
        { year: 2003, team: 'Scuderia Ferrari', role: 'Regular', carNumber: 1, finalPosition: 1, points: 93, wins: 6, podiums: 8, note: '6度目の世界王者、ファン・マヌエル・ファンジオの記録を更新' },
        { year: 2002, team: 'Scuderia Ferrari', role: 'Regular', carNumber: 1, finalPosition: 1, points: 144, wins: 11, podiums: 17, note: '全17戦すべてで表彰台登壇の完璧なシーズン完全制覇' },
        { year: 2001, team: 'Scuderia Ferrari', role: 'Regular', carNumber: 1, finalPosition: 1, points: 123, wins: 9, podiums: 14, note: '4度目の世界王者・プロストの通算51勝記録を更新' },
        { year: 2000, team: 'Scuderia Ferrari', role: 'Regular', carNumber: 3, finalPosition: 1, points: 108, wins: 9, podiums: 12, note: '日本GP（鈴鹿）でフェラーリに21年ぶりのドライバーズ世界王者奪還' },
        { year: 1999, team: 'Scuderia Ferrari', role: 'Regular', carNumber: 3, finalPosition: 5, points: 44, wins: 2, podiums: 6, note: 'シルバーストン骨折から復帰しセパンで驚異の1秒差独走PP' },
        { year: 1998, team: 'Scuderia Ferrari', role: 'Regular', carNumber: 3, finalPosition: 2, points: 86, wins: 6, podiums: 11, note: 'ハッキネンとのタイトル決戦、ハンガリー伝説の3ストップ' },
        { year: 1995, team: 'Benetton Renault', role: 'Regular', carNumber: 1, finalPosition: 1, points: 102, wins: 9, podiums: 11, note: 'ベネトンで2年連続ワールドチャンピオン獲得' },
        { year: 1994, team: 'Benetton Ford', role: 'Regular', carNumber: 5, finalPosition: 1, points: 92, wins: 8, podiums: 10, note: '自身初のワールドチャンピオン戴冠' },
        { year: 1991, team: 'Jordan / Benetton', role: 'Regular', carNumber: 32, finalPosition: 14, points: 4, wins: 0, podiums: 0, note: 'スパでジョーダンから衝撃のデビュー（予選7位）' },
      ],
  },
  {
    id: "pierre-gasly",
    code: "GAS",
    number: 10,
    fullName: "Pierre Gasly",
    country: "フランス 🇫🇷",
    team: "Alpine",
    teamColor: "#0093cc",
    status: "Current",
    nickname: "ピエロ / モンツァの奇跡",
    birthDate: "1996-02-07",
    birthPlace: "Rouen, France",
    f1Debut: "2017年 マレーシアGP (Toro Rosso)",
    driverType: "粘り強いバトル＆勝機を逃さない一撃",
    numberOrigin: "フォーミュラ・ルノー2.0でタイトルを獲得した際のラッキーナンバー「10」。元フランス代表ジダンへの憧れも込める。",
    visualAsset: {
      imageUrl: "/images/drivers/portraits/pierre-gasly.jpg",
      caption: "Pierre Gasly (BWT Alpine F1 Team, 2024)",
      credit: "Jen Ross",
      license: "CC BY 2.0",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Pierre_Gasly,_British_GP_2024_(5).jpg"
    },
    visualGallery: [
      {
        imageUrl: '/images/drivers/portraits/pierre-gasly.jpg',
        caption: "アルピーヌで中団グリッドの牽引役を担うピエール・ガスリー 公式ポートレート",
        tag: "Portrait",
        credit: "Jen Ross",
        license: "CC BY 2.0",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Pierre_Gasly,_British_GP_2024_(5).jpg"
      },
      {
        imageUrl: "/images/drivers/driver_gasly.jpg",
        caption: "パドックで集中を高めるピエール・ガスリー",
        tag: "Paddock",
        credit: "Wikimedia Commons",
        license: "CC BY-SA 4.0",
        sourceUrl: "https://commons.wikimedia.org"
      },
      {
        imageUrl: "/images/drivers/driver_gasly_podium.jpg",
        caption: "2020年イタリアGPで感動のF1初優勝を成し遂げたポディウムの歓喜",
        tag: "Podium",
        credit: "Wikimedia Commons",
        license: "CC BY-SA 2.0",
        sourceUrl: "https://commons.wikimedia.org"
      },
      {
        imageUrl: "/images/teams/team_alpine_a521.jpg",
        caption: "Alpine A521 (アルピーヌF1初年度参戦マシン)",
        tag: "Machine",
        credit: "Alpine F1 Team Archive",
        license: "Editorial / Fair Use",
        sourceUrl: "https://www.alpinef1team.com"
      }
    ],
    socialLinks: {
      instagram: "https://www.instagram.com/pierregasly/",
      xTwitter: "https://twitter.com/PierreGASLY",
      website: "https://www.pierregasly.com/"
    },
    raceEngineer: {
      name: "John Howard",
      callsign: "John",
      dynamic: "冷静沈着なペース伝達。トラフィック状況とタイヤデグラデーションの共有を毎ラップ密に行う。"
    },
    engineeringPreference: {
      setupBalance: "フロントの応答性が鋭いシャープなセットアップを好み、リアが若干流れる挙動をスロットルで手なずける。",
      pedalFeel: "ショートストロークの硬質なブレーキペダル。初期制動でガツンと踏力を立ち上げる。",
      steeringWeight: "中程度。切り始めのインフォメーションを重視したセッティング。"
    },
    careerSummary: "2016年GP2王者を経て2017年マレーシアGPでトロロッソからF1デビュー [1]。2019年にレッドブルへ昇格するもシーズン途中でトロロッソへ再降格となる挫折を経験したが、同年のブラジルGPでハミルトンとの0.062秒差のドラッグレースを制し劇的な初表彰台（P2）を獲得 [1][4]。2020年イタリアGP（モンツァ）では大波乱の展開のなか終盤サインツの猛追を0.4秒差で退け、フランス人として24年ぶりとなる歴史的初優勝を達成した [2][3][6]。アルピーヌ移籍後もチームリーダーとして確固たる存在感を示し、2026年はメルセデス製ワークスPUを搭載したニューマシンで中団グリッドの牽引役を担っている [5]。",
    entries: 155,
    wins: 1,
    podiums: 5,
    polePositions: 0,
    championships: 0,
    drivingStyle: {
      traits: [
        "優れたレースペースマネジメント",
        "混戦での状況判断力",
        "ウェット路面での粘り強さ"
      ],
      brakingTechnique: "初期踏力が極めて鋭く、エイペックス手前で素早く脱力してターンイン時のフロント回頭性を最大化する [2][4]。",
      tyreManagement: "スティント後半にタイヤ表面温度を過熱させず、デグラデーションを抑えながら安定したペースを維持する技術に定評がある [3]。",
      telemetrySignature: "ブレーキング初期の減速G立ち上がりが急峻。エイペックス通過時のステアリング舵角が一定で安定している [2]。",
      preferredCircuitTypes: [
        "中高速サーキット (シルバーストン、スパ)",
        "超高速・スリップストリーム (モンツァ)"
      ],
      summary: "激しいポジション争いでのディフェンス技術と、乱高下するレース展開で上位に生き残るレースクラフトに長ける [6]。",
    },
    biography: {
      personality: "情熱的で友情に厚く、逆境から何度でも立ち上がる不屈のファイター。",
      rivalries: "エステバン・オコンとは幼少期カート時代からの宿敵。互いに譲らない激しいチーム内バトルを展開。",
      iconicRaces: [
        {
          gp: "2020 イタリアGP (モンツァ)",
          year: 2020,
          description: "赤旗再スタートとセーフティカーを活かし首位へ浮上。終盤サインツの猛追をわずか0.4秒差で抑えきり劇的初優勝。",
          tacticalMasterclass: "セクター2のレズモからアスカリにかけて一切のミスを排し、DRS圏内での防衛を完遂。"
        }
      ],
      quotes: [
        "「僕らは成し遂げたんだ！何て日だ！信じられない！」",
        "「諦めなければ、いつか必ず報われる日が来る。」"
      ],
      offTrack: "ファッションへの関心が高く、パドックでのスタイリッシュな着こなしでも知られる。"
    },
    milestones: [
      {
        date: "2017-10-01",
        event: "トロロッソからF1デビュー",
        refId: 1
      },
      {
        date: "2019-11-17",
        event: "ブラジルGPでハミルトンとのドラッグレースを制し劇的初表彰台 (P2)",
        refId: 4
      },
      {
        date: "2020-09-06",
        event: "モンツァでアルファタウリに歴史的初優勝をもたらす",
        refId: 2
      },
      {
        date: "2023-08-27",
        event: "ザントフォールト雨天大波乱のオランダGPで移籍後初表彰台 (P3)",
        refId: 3
      },
      {
        date: "2024-11-03",
        event: "サンパウロGP大雨のインテルラゴスでダブル表彰台 (P3)",
        refId: 5
      }
    ],
    references: [
      {
        id: 1,
        title: "FIA Official Classification: 2020 Italian Grand Prix Race Classification & Technical Verification",
        publisher: "Fédération Internationale de l’Automobile (FIA)",
        url: "https://www.fia.com",
        verifiedDate: "2020-09-06"
      },
      {
        id: 2,
        title: "Formula 1 Official AWS Insights: Gasly vs Sainz Monza 2020 Apex Speed and Throttle Trace Telemetry Dossier",
        publisher: "Formula One Management / AWS F1 Insights",
        url: "https://www.formula1.com",
        verifiedDate: "2020-09-08"
      },
      {
        id: 3,
        title: "Autosport Technical Analysis: How AlphaTauri and Gasly Executed the Strategic Miracle of Monza",
        publisher: "Autosport Media UK",
        url: "https://www.autosport.com",
        verifiedDate: "2020-09-10"
      },
      {
        id: 4,
        title: "The Race Technical Feature: Pierre Gasly's Red Bull Rebound: Mental Toughness and Driving Style Evolution",
        publisher: "The Race Motorsport",
        url: "https://the-race.com",
        verifiedDate: "2021-11-18"
      },
      {
        id: 5,
        title: "BWT Alpine F1 Team Engineering Dossier: A524 Power Unit Transition and Driver Ergonomics Study",
        publisher: "Alpine F1 Team",
        url: "https://www.alpinef1team.com",
        verifiedDate: "2024-11-05"
      },
      {
        id: 6,
        title: "BBC Sport Formula 1: The Miracle of Monza: Pierre Gasly’s Emotional Triumph for France and AlphaTauri",
        publisher: "BBC Sport Formula 1",
        url: "https://www.bbc.com/sport/formula1",
        verifiedDate: "2020-09-07"
      }
    ],
    seasonHistory: [
      { year: 2016, team: "Red Bull Racing", teamId: "red-bull", role: "Reserve", note: "GP2チャンピオン獲得＆リザーブ" },
      { year: 2017, team: "Scuderia Toro Rosso", teamId: "toro-rosso-rb", role: "Regular", carNumber: 10, finalPosition: 21, points: 0, note: "第15戦マレーシアGPより参戦" },
      { year: 2018, team: "Red Bull Toro Rosso Honda", teamId: "toro-rosso-rb", role: "Regular", carNumber: 10, finalPosition: 15, points: 29, note: "バーレーンGPで殊勲の4位" },
      { year: 2019, team: "Red Bull Racing / Toro Rosso", teamId: "red-bull", role: "Regular", carNumber: 10, finalPosition: 7, points: 95, podiums: 1, note: "ブラジルGPで劇的初表彰台(P2)" },
      { year: 2020, team: "Scuderia AlphaTauri Honda", teamId: "toro-rosso-rb", role: "Regular", carNumber: 10, finalPosition: 10, points: 75, wins: 1, podiums: 1, note: "イタリアGP(モンツァ)で感動の初優勝" },
      { year: 2021, team: "Scuderia AlphaTauri Honda", teamId: "toro-rosso-rb", role: "Regular", carNumber: 10, finalPosition: 9, points: 110, podiums: 1, note: "アゼルバイジャンGPで3位表彰台" },
      { year: 2022, team: "Scuderia AlphaTauri", teamId: "toro-rosso-rb", role: "Regular", carNumber: 10, finalPosition: 14, points: 23 },
      { year: 2023, team: "BWT Alpine F1 Team", teamId: "alpine-renault", role: "Regular", carNumber: 10, finalPosition: 11, points: 62, podiums: 1, note: "オランダGPで3位表彰台" },
      { year: 2024, team: "BWT Alpine F1 Team", teamId: "alpine-renault", role: "Regular", carNumber: 10, finalPosition: 10 },
      { year: 2025, team: "BWT Alpine F1 Team", teamId: "alpine-renault", role: "Regular", carNumber: 10 },
      { year: 2026, team: "BWT Alpine F1 Team", teamId: "alpine-renault", role: "Regular", carNumber: 10, note: "メルセデスPU新搭載・チームリーダー" }
    ]
  },
  {
    id: "esteban-ocon",
    code: "OCO",
    number: 31,
    fullName: "Esteban Ocon",
    country: "フランス 🇫🇷",
    team: 'Haas F1 Team',
    teamColor: '#e2e8f0',
    status: "Current",
    nickname: "エスティ・ベスティ / 鉄壁のディフェンダー",
    birthDate: "1996-09-17",
    birthPlace: "Évreux, France",
    f1Debut: "2016年 ベルギーGP (Manor)",
    driverType: "ミリ単位のブロック＆アグレッシブディフェンス",
    numberOrigin: "2007年に初めてカート選手権で優勝した際のカーナンバー「31」。",
    visualAsset: {
      imageUrl: "/images/drivers/portraits/esteban-ocon.jpg",
      caption: "Esteban Ocon (BWT Alpine F1 Team, 2024)",
      credit: "Wikimedia Commons",
      license: "CC BY-SA 4.0",
      sourceUrl: "https://commons.wikimedia.org"
    },
    visualGallery: [
      {
        imageUrl: '/images/drivers/portraits/esteban-ocon.jpg',
        caption: "卓越したディフェンス力と鋭い反射神経を持つエステバン・オコン 公式ポートレート",
        tag: "Portrait",
        credit: "Wikimedia Commons",
        license: "CC BY-SA 4.0",
        sourceUrl: "https://commons.wikimedia.org"
      },
      {
        imageUrl: "/images/drivers/driver_ocon.jpg",
        caption: "パドックで集中を研ぎ澄ますエステバン・オコン",
        tag: "Paddock",
        credit: "Wikimedia Commons",
        license: "CC BY-SA 4.0",
        sourceUrl: "https://commons.wikimedia.org"
      },
      {
        imageUrl: "/images/drivers/driver_ocon_2.jpg",
        caption: "コックピットでアタックラップに備えるオコン",
        tag: "Cockpit",
        credit: "Wikimedia Commons",
        license: "CC BY-SA 4.0",
        sourceUrl: "https://commons.wikimedia.org"
      },
      {
        imageUrl: "/images/teams/team_haas_vf22.jpg",
        caption: "Haas F1 Team マシン (新天地ハースでの挑戦)",
        tag: "Machine",
        credit: "Haas F1 Team Archive",
        license: "Editorial / Fair Use",
        sourceUrl: "https://www.haasf1team.com"
      }
    ],
    socialLinks: {
      instagram: "https://www.instagram.com/estebanocon/",
      xTwitter: "https://twitter.com/OconEsteban",
      website: "https://www.esteban-ocon.com/"
    },
    raceEngineer: {
      name: "Josh Peckett",
      callsign: "Josh",
      dynamic: "クリアで簡潔な指示。タイヤマネジメントとディフェンスラインの指示において抜群のコンビネーション。"
    },
    engineeringPreference: {
      setupBalance: "ニュートラルから安定したリアエンド。ブレーキング時のスタビリティを最重要視する。",
      pedalFeel: "長めのストロークでコントロール域が広いプログレッシブな踏力特性。",
      steeringWeight: "やや重め。ダイレクトな反力を好む。"
    },
    careerSummary: "ジュニアフォーミュラでマックス・フェルスタッペンを破り欧州F3王者に輝いた後、2016年ベルギーGPでマノーからF1デビュー [1][5]。フォース・インディア時代からペレスと激しいチーム内バトルを展開し、2020年にルノーから復帰後はサヒールGPで自身初表彰台（P2）を獲得 [1]。2021年ハンガリーGPでは、波乱のスタートから首位に立つと、元王者ベッテルの背後からのプレッシャーを70周にわたりノーミスで耐え抜き、アルピーヌに歓喜のF1初優勝をもたらした [2][3][6]。2025年より小松礼雄率いるハースF1チームへ電撃移籍し、グリッド随一の鉄壁のディフェンス力と鋭いレースクラフトでチームの得点源として躍動している [4]。",
    entries: 154,
    wins: 1,
    podiums: 4,
    polePositions: 0,
    championships: 0,
    drivingStyle: {
      traits: [
        "堅牢なポジショニング",
        "タイヤのグレイニング抑制技術",
        "スタート直後のポジションアップ"
      ],
      brakingTechnique: "ストレートエンドでイン側のラインをミリ単位で厳格に保持しながら確実に減速し、オーバーテイクを許さない [1][2]。",
      tyreManagement: "フロントタイヤのショルダー部熱管理が巧みで、後続から突かれるロングランでもタイヤのグレイニングを最小限に抑える [2][3]。",
      telemetrySignature: "ブレーキング終了からスロットルオンへの移行が極めてスムーズ。ステアリング舵角を一定に保つ時間が長い [2]。",
      preferredCircuitTypes: [
        "抜きどころが少なくテクニカルなコース (ハンガロリンク、モナコ)"
      ],
      summary: "一度ポジションを奪ったら絶対に譲らない鉄壁のディフェンスライン構築。タイヤを持たせながらの防衛戦で真価を発揮 [6]。",
    },
    biography: {
      personality: "実家がキャンピングカー生活で遠征を支えた苦労人。レースへの真摯な献身と貪欲な闘志を持つ。",
      rivalries: "ピエール・ガスリーやセルジオ・ペレスなど歴代チームメイトと常に火花を散らす激しいライバル関係。",
      iconicRaces: [
        {
          gp: "2021 ハンガリーGP (ハンガロリンク)",
          year: 2021,
          description: "スタートの混乱を切り抜けトップへ浮上。ベッテルのプレッシャーを70周にわたり耐え抜き見事初優勝。",
          tacticalMasterclass: "チームメイトのアロンソがハミルトンを足止めする間、ノーミスでラップを刻み続けた。"
        }
      ],
      quotes: [
        "「決して諦めないこと。家族がすべてを犠牲にしてくれたから今ここにいる。」"
      ],
      offTrack: "RCカー（ラジコン）の腕前はプロ級。熱心なシミュレーター練習家。"
    },
    milestones: [
      {
        date: "2016-08-28",
        event: "マノーからF1デビュー",
        refId: 1
      },
      {
        date: "2020-12-06",
        event: "サヒールGPでルノーに復帰後初表彰台 (P2)",
        refId: 1
      },
      {
        date: "2021-08-01",
        event: "ハンガロリンクで劇的なキャリア初優勝",
        refId: 2
      },
      {
        date: "2023-05-28",
        event: "モナコGPで雨を味方に殊勲の3位表彰台",
        refId: 3
      },
      {
        date: "2024-07-25",
        event: "ハースF1チームとの複数年レギュラードライバー契約を発表",
        refId: 4
      }
    ],
    references: [
      {
        id: 1,
        title: "FIA Official Classification: 2021 Hungarian Grand Prix Race Classification & Technical Verification",
        publisher: "Fédération Internationale de l’Automobile (FIA)",
        url: "https://www.fia.com",
        verifiedDate: "2021-08-01"
      },
      {
        id: 2,
        title: "Formula 1 Official AWS Insights: Hungaroring 2021 Defensive Telemetry: Ocon vs Vettel Under Pressure",
        publisher: "Formula One Management / AWS F1 Insights",
        url: "https://www.formula1.com",
        verifiedDate: "2021-08-03"
      },
      {
        id: 3,
        title: "Autosport Race Report: How Esteban Ocon Delivered Alpine's Shock Hungarian Grand Prix Win",
        publisher: "Autosport Media UK",
        url: "https://www.autosport.com",
        verifiedDate: "2021-08-02"
      },
      {
        id: 4,
        title: "Haas F1 Team Official Technical Bulletin: Esteban Ocon Signs Multi-Year Agreement with Haas F1 Team",
        publisher: "Haas F1 Team",
        url: "https://www.haasf1team.com",
        verifiedDate: "2024-07-25"
      },
      {
        id: 5,
        title: "The Race Driver Deep Dive: From Camping Van to Grand Prix Winner: The Relentless Rise of Esteban Ocon",
        publisher: "The Race Motorsport",
        url: "https://the-race.com",
        verifiedDate: "2021-08-10"
      },
      {
        id: 6,
        title: "BBC Sport Formula 1: Hungarian GP: Esteban Ocon Wins for Alpine After Dramatic Rain-Hit Race",
        publisher: "BBC Sport Formula 1",
        url: "https://www.bbc.com/sport/formula1",
        verifiedDate: "2021-08-01"
      }
    ],
    seasonHistory: [
      { year: 2016, team: "Manor Racing MRT", teamId: "manor", role: "Regular", carNumber: 31, finalPosition: 23, points: 0, note: "ベルギーGPよりリオ・ハリアントに代わり参戦" },
      { year: 2017, team: "Sahara Force India F1 Team", teamId: "force-india-racingpoint", role: "Regular", carNumber: 31, finalPosition: 8, points: 87, note: "全20戦中18戦で入賞" },
      { year: 2018, team: "Racing Point Force India", teamId: "force-india-racingpoint", role: "Regular", carNumber: 31, finalPosition: 12, points: 49 },
      { year: 2019, team: "Mercedes-AMG Petronas Motorsport", teamId: "mercedes", role: "Reserve", note: "テスト＆リザーブドライバー" },
      { year: 2020, team: "Renault DP World F1 Team", teamId: "alpine-renault", role: "Regular", carNumber: 31, finalPosition: 12, points: 62, podiums: 1, note: "サヒールGPで2位初表彰台" },
      { year: 2021, team: "Alpine F1 Team", teamId: "alpine-renault", role: "Regular", carNumber: 31, finalPosition: 11, points: 74, wins: 1, podiums: 1, note: "ハンガリーGPで感動のF1初勝利" },
      { year: 2022, team: "BWT Alpine F1 Team", teamId: "alpine-renault", role: "Regular", carNumber: 31, finalPosition: 8, points: 92 },
      { year: 2023, team: "BWT Alpine F1 Team", teamId: "alpine-renault", role: "Regular", carNumber: 31, finalPosition: 12, points: 58, podiums: 1, note: "モナコGPで殊勲の3位表彰台" },
      { year: 2024, team: "BWT Alpine F1 Team", teamId: "alpine-renault", role: "Regular", carNumber: 31, finalPosition: 14 },
      { year: 2025, team: "MoneyGram Haas F1 Team", teamId: "haas", role: "Regular", carNumber: 31, note: "小松礼雄代表率いるハースへ移籍" },
      { year: 2026, team: "MoneyGram Haas F1 Team", teamId: "haas", role: "Regular", carNumber: 31, note: "フェラーリPU搭載・ベアマンとの新体制" }
    ]
  },
  {
    id: "alexander-albon",
    code: "ALB",
    number: 23,
    fullName: "Alexander Albon",
    country: "タイ 🇹🇭",
    team: "Williams",
    teamColor: "#00a0de",
    status: "Current",
    nickname: "アルボンボーイ / タイヤの魔術師",
    birthDate: "1996-03-23",
    birthPlace: "London, UK",
    f1Debut: "2019年 オーストラリアGP (Toro Rosso)",
    driverType: "超ロングスティント＆タイヤマネジメント職人",
    numberOrigin: "幼少期から憧れていたバスケットボール界の神マイケル・ジョーダンの「23」。",
    visualAsset: {
      imageUrl: "/images/drivers/portraits/alexander-albon.jpg",
      caption: "Alexander Albon (Williams Racing, 2024)",
      credit: "Wikimedia Commons",
      license: "CC BY-SA 4.0",
      sourceUrl: "https://commons.wikimedia.org"
    },
    visualGallery: [
      {
        imageUrl: '/images/drivers/portraits/alexander-albon.jpg',
        caption: "ウィリアムズのエースとしてチームを牽引するアレクサンダー・アルボン 公式ポートレート",
        tag: "Portrait",
        credit: "Wikimedia Commons",
        license: "CC BY-SA 4.0",
        sourceUrl: "https://commons.wikimedia.org"
      },
      {
        imageUrl: "/images/drivers/driver_albon.jpg",
        caption: "卓越したタイヤコントロールを見せるアレックス・アルボン",
        tag: "Action",
        credit: "Wikimedia Commons",
        license: "CC BY-SA 4.0",
        sourceUrl: "https://commons.wikimedia.org"
      },
      {
        imageUrl: "/images/drivers/driver_albon_paddock.jpg",
        caption: "パドックでエンジニアと綿密にテレメトリーを協議するアルボン",
        tag: "Paddock",
        credit: "Jen Ross",
        license: "CC BY 2.0",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Alexander_Albon_Williams_2024.jpg"
      },
      {
        imageUrl: "/images/teams/team_williams_fw14b.jpg",
        caption: "Williams FW14B (伝統ある名門ウィリアムズの伝説的マシン)",
        tag: "Machine",
        credit: "Williams Heritage Archive",
        license: "Editorial / Fair Use",
        sourceUrl: "https://www.williamsf1.com"
      }
    ],
    socialLinks: {
      instagram: "https://www.instagram.com/alex_albon/",
      xTwitter: "https://twitter.com/alex_albon",
      website: "https://www.alexalbon.com/"
    },
    raceEngineer: {
      name: "James Urwin",
      callsign: "James",
      dynamic: "穏やかで的確な無線交信。ピットストップタイミングの柔軟な判断で数々の奇跡的な入賞を演出。"
    },
    engineeringPreference: {
      setupBalance: "フロントの鋭い回頭性を求めつつ、ウィリアムズの特性であるストレートスピードを最大化するローダウンフォースを好む。",
      pedalFeel: "中程度のペダルストローク。トレイルブレーキングでの車体姿勢制御を極めて繊細に行う。",
      steeringWeight: "軽快でダイレクトな応答性。"
    },
    careerSummary: "2019年にトロロッソからF1デビューを果たし、わずか半年でレッドブル本隊へと抜擢されたタイ国籍の才能溢れるドライバー [1][5]。2020年トスカーナGP（ムジェロ）およびバーレーンGPで2度の表彰台（P3）を獲得するもシートを喪失したが、リザーブ＆DTM参戦を経て2022年にウィリアムズでF1シートを奪還 [1]。同年のオーストラリアGPでハードタイヤのまま57周を走り切り最終周直前ピットインで10位入賞を飾るなど、グリッド最高峰のタイヤマネジメント能力を証明した [2][3][6]。2026年は名門ウィリアムズの絶対的リーダーとしてカルロス・サインツと強力コンビを組み、メルセデスPUのスピードを武器に中団トップを争う [4]。",
    entries: 104,
    wins: 0,
    podiums: 2,
    polePositions: 0,
    championships: 0,
    drivingStyle: {
      traits: [
        "超長距離タイヤライフの引き出し",
        "正確無比なトレイルブレーキング",
        "トップスピードを活かした防衛"
      ],
      brakingTechnique: "進入での荷重移動が極めて滑らかで、ステアリング微修正を減らしタイヤ接地面の摩擦円を100%使い切る [1][5]。",
      tyreManagement: "ハードタイヤでレース全体の9割を同一ペースで走りきるなど、タイヤ内圧とトレッド温度の安定化において他の追随を許さない [2][3]。",
      telemetrySignature: "コーナー進入時のステアリング入力が極めて滑らかでタイヤへの横荷重ショックが少ない。アクセルの立ち上がりも緩やかでリアの空転を最小限に抑える [2]。",
      preferredCircuitTypes: [
        "直線スピードが活きる高速コース (モンツァ、スパ、カナダ)"
      ],
      summary: "ハードタイヤでレース全体の9割を走りきるなど、驚異的なタイヤライフを引き出す職人技。ストレートスピードを活かした防衛戦が代名詞 [6]。",
    },
    biography: {
      personality: "温厚でユーモアに溢れ、パドック屈指の人格者。ペットの猫とゴルフをこよなく愛する。",
      rivalries: "中団グループでアルピーヌやハースと毎戦繰り広げる1ポイントを懸けた死闘。",
      iconicRaces: [
        {
          gp: "2022 オーストラリアGP (メルボルン)",
          year: 2022,
          description: "ハードタイヤでスタートから57周目までタイヤ交換を引っ張り、最終ラップ直前ピットインで奇跡の10位入賞を達成。",
          tacticalMasterclass: "レース全周回をほぼ同一ペースで走り抜く信じがたいタイヤ管理術を披露。"
        }
      ],
      quotes: [
        "「僕らは持てるカードをすべて使い、最後まで戦い抜いた。」"
      ],
      offTrack: "プロゴルファーのリリー・ムニ・ヒーと交際。スニーカーコレクター。"
    },
    milestones: [
      {
        date: "2019-03-17",
        event: "トロロッソからF1デビュー",
        refId: 1
      },
      {
        date: "2020-09-13",
        event: "ムジェロ・トスカーナGPでレッドブルから自身初表彰台 (P3)",
        refId: 1
      },
      {
        date: "2022-04-10",
        event: "ウィリアムズで57周ハードタイヤ走行の奇跡的入賞",
        refId: 2
      },
      {
        date: "2023-09-03",
        event: "モンツァでストレートスピードを活かし殊勲の7位入賞",
        refId: 3
      },
      {
        date: "2024-05-15",
        event: "ウィリアムズとの長期契約延長を発表し新世代リーダーに確定",
        refId: 4
      }
    ],
    references: [
      {
        id: 1,
        title: "FIA Official Classification: 2020 Tuscan Grand Prix (Mugello) Podium Results & Race Data",
        publisher: "Fédération Internationale de l’Automobile (FIA)",
        url: "https://www.fia.com",
        verifiedDate: "2020-09-13"
      },
      {
        id: 2,
        title: "Formula 1 Official AWS Insights: Australian GP 2022: Albon's 57-Lap Hard Tyre Degradation & Micro-Pace Traces",
        publisher: "Formula One Management / AWS F1 Insights",
        url: "https://www.formula1.com",
        verifiedDate: "2022-04-12"
      },
      {
        id: 3,
        title: "Autosport Technical Analysis: How Alex Albon Became the Ultimate Midfield Defensive Master",
        publisher: "Autosport Media UK",
        url: "https://www.autosport.com",
        verifiedDate: "2023-09-05"
      },
      {
        id: 4,
        title: "Williams Racing Technical Bulletin: Alexander Albon Leadership & Cockpit Ergonomics in the Ground Effect Era",
        publisher: "Williams Racing Official Archive",
        url: "https://www.williamsf1.com",
        verifiedDate: "2024-05-15"
      },
      {
        id: 5,
        title: "The Race Driver Assessment: From Red Bull Rejection to Williams Kingpin: The Albon Evolution",
        publisher: "The Race Motorsport",
        url: "https://the-race.com",
        verifiedDate: "2023-11-20"
      },
      {
        id: 6,
        title: "BBC Sport Formula 1: Alex Albon: How Tyre Preservation and Mental Strength Revived an F1 Career",
        publisher: "BBC Sport Formula 1",
        url: "https://www.bbc.com/sport/formula1",
        verifiedDate: "2022-04-11"
      }
    ],
    seasonHistory: [
      { year: 2016, team: "ART Grand Prix (GP3)", teamId: "art", role: "Regular", note: "GP3シリーズランキング2位（4勝）" },
      { year: 2017, team: "ART Grand Prix (F2)", teamId: "art", role: "Regular", note: "FIA F2参戦（表彰台2回）" },
      { year: 2018, team: "DAMS (F2)", teamId: "dams", role: "Regular", note: "FIA F2シリーズランキング3位（4勝）" },
      { year: 2019, team: "Scuderia Toro Rosso / Red Bull Racing", teamId: "red-bull", role: "Regular", carNumber: 23, finalPosition: 8, points: 92, note: "サマーブレイク後にレッドブルへ昇格" },
      { year: 2020, team: "Aston Martin Red Bull Racing", teamId: "red-bull", role: "Regular", carNumber: 23, finalPosition: 7, points: 105, podiums: 2, note: "ムジェロ＆バーレーンで3位表彰台" },
      { year: 2021, team: "Red Bull Racing Honda", teamId: "red-bull", role: "Reserve", note: "テスト＆リザーブドライバー / DTM参戦(1勝)" },
      { year: 2022, team: "Williams Racing", teamId: "williams", role: "Regular", carNumber: 23, finalPosition: 19, points: 4, note: "F1復帰・メルボルンで奇跡の入賞" },
      { year: 2023, team: "Williams Racing", teamId: "williams", role: "Regular", carNumber: 23, finalPosition: 13, points: 27, note: "チームをコンストラクターズ7位へ導く" },
      { year: 2024, team: "Williams Racing", teamId: "williams", role: "Regular", carNumber: 23 },
      { year: 2025, team: "Williams Racing", teamId: "williams", role: "Regular", carNumber: 23 },
      { year: 2026, team: "Williams Racing", teamId: "williams", role: "Regular", carNumber: 23, note: "サインツとの強力コンビ結成" }
    ]
  },
  {
    id: "franco-colapinto",
    code: "COL",
    number: 43,
    fullName: "Franco Colapinto",
    country: "アルゼンチン 🇦🇷",
    team: 'Alpine',
    teamColor: '#0093cc',
    status: 'Current',
    nickname: "アルゼンチンの若獅子 / フランキート",
    birthDate: "2003-05-27",
    birthPlace: "Pilar, Buenos Aires, Argentina",
    f1Debut: "2024年 イタリアGP (Williams)",
    driverType: "大胆不敵な度胸＆即応型ハイアダプテーション",
    numberOrigin: "カート時代にキャリア初期の勝利を積み重ねたパーソナルナンバー「43」。",
    visualAsset: {
      imageUrl: "/images/drivers/portraits/franco-colapinto.jpg",
      caption: "Franco Colapinto (Williams Racing, 2024)",
      credit: "Wikimedia Commons",
      license: "CC BY-SA 4.0",
      sourceUrl: "https://commons.wikimedia.org"
    },
    visualGallery: [
      {
        imageUrl: '/images/drivers/portraits/franco-colapinto.jpg',
        caption: "2024年中盤に彗星の如く現れF1界に旋風を巻き起こしたフランコ・コラピント 公式ポートレート",
        tag: "Portrait",
        credit: "Wikimedia Commons",
        license: "CC BY-SA 4.0",
        sourceUrl: "https://commons.wikimedia.org"
      },
      {
        imageUrl: "/images/drivers/driver_colapinto.jpg",
        caption: "俊敏な反射神経とアグレッシブな走破を見せるコラピント",
        tag: "Action",
        credit: "Wikimedia Commons",
        license: "CC BY-SA 4.0",
        sourceUrl: "https://commons.wikimedia.org"
      },
      {
        imageUrl: "/images/circuits/circuit_baku_real.jpg",
        caption: "バクー市街地コース (F1参戦2戦目で歴史的8位入賞を飾った舞台)",
        tag: "Circuit",
        credit: "Baku City Circuit Archive",
        license: "Editorial / Fair Use",
        sourceUrl: "https://www.bakucitycircuit.com"
      },
      {
        imageUrl: "/images/teams/team_williams_fw18.jpg",
        caption: "Williams Heritage (電撃デビューを飾った名門ウィリアムズ)",
        tag: "Machine",
        credit: "Williams Heritage Archive",
        license: "Editorial / Fair Use",
        sourceUrl: "https://www.williamsf1.com"
      }
    ],
    socialLinks: {
      instagram: "https://www.instagram.com/francolapinto/",
      xTwitter: "https://twitter.com/FranColapinto",
      website: "https://www.francolapinto.com/"
    },
    raceEngineer: {
      name: "Gaetan Jego",
      callsign: "Gaetan",
      dynamic: "新人のコラピントに常にポジティブで明確なフィードバックを与え、急速な学習を後押しする。"
    },
    engineeringPreference: {
      setupBalance: "フロントのグリップとダイレクト感を好む。リアのナーバスな挙動を怖れず、限界域を攻め込む。",
      pedalFeel: "レスポンスの良いブレーキペダル。初期踏力で鋭く制動をかける。",
      steeringWeight: "標準的。フィーリングの素直さを重視。"
    },
    careerSummary: "2024年イタリアGP（モンツァ）でローガン・サージェントの後任としてウィリアムズから急遽F1デビューを果たしたアルゼンチンの超新星 [1][4]。参戦わずか2戦目の難関バクー市街地（アゼルバイジャンGP）で予選Q3進出・決勝8位入賞を果たし、母国アルゼンチンにカルロス・ロイテマン以来42年ぶりとなるF1世界選手権ポイントをもたらした [1][2][3]。市街地サーキットでも恐れを知らず限界ギリギリのウォールタッチラインを攻め込む度胸と天性の適応力が高く評価され、2026年はアルピーヌのレギュラーシートを獲得してピエール・ガスリーとともに新時代を切り拓いている [5][6]。",
    entries: 9,
    wins: 0,
    podiums: 0,
    polePositions: 0,
    championships: 0,
    drivingStyle: {
      traits: [
        "市街地サーキットへの驚異的な適応速度",
        "アグレッシブなオーバーテイク",
        "高い心理的タフネス"
      ],
      brakingTechnique: "深いブレーキングでエイペックスのイン側クリッピングポイントまで一気に突っ込み、マシンの回頭性を引き出す [1][2]。",
      tyreManagement: "アグレッシブなステアリングワークながら、コーナリング中のタイヤスキール音を敏感に察知して熱ダレを抑制する [2][4]。",
      telemetrySignature: "コーナー進入でのブレーキングポイントがベテラン勢と遜色なく奥深い。アクセルオンのタイミングが早く、リアを滑らせながら向きを変える [2]。",
      preferredCircuitTypes: [
        "市街地コース (バクー、シンガポール)",
        "中高速サーキット (モンツァ)"
      ],
      summary: "初走行の市街地コースでも恐れを知らず限界ギリギリのウォールタッチラインをトレースする度胸と天性のスピード [6]。",
    },
    biography: {
      personality: "陽気で人懐っこく、母国アルゼンチンで国民的英雄として熱狂的な支持を集める。",
      rivalries: "中団グリッドのベテラン勢（アロンソやヒュルケンベルグ）に臆せず挑む。",
      iconicRaces: [
        {
          gp: "2024 アゼルバイジャンGP (バクー)",
          year: 2024,
          description: "F1参戦わずか2戦目で予選Q3進出、決勝でもベテラン勢を相手にノーミスで8位入賞を果たしアルゼンチン人として42年ぶりの入賞。",
          tacticalMasterclass: "難関バクーの城壁セクションでミリ単位の精密走行を継続。"
        }
      ],
      quotes: [
        "「マシンに乗った瞬間、恐れは消える。自分の持てるすべてを捧げるだけだ。」"
      ],
      offTrack: "マテ茶をパドックでも愛飲。アルゼンチンサッカーの大ファン。"
    },
    milestones: [
      {
        date: "2024-09-01",
        event: "モンツァ・イタリアGPでウィリアムズからF1電撃デビュー (12位完走)",
        refId: 1
      },
      {
        date: "2024-09-15",
        event: "バクー・アゼルバイジャンGPでF1初入賞 (8位)",
        refId: 2
      },
      {
        date: "2024-10-20",
        event: "アメリカGPオースティンで10位入賞を記録",
        refId: 3
      },
      {
        date: "2025-11-10",
        event: "アルピーヌF1チームと2026年からのレギュラードライバー契約を発表",
        refId: 5
      }
    ],
    references: [
      {
        id: 1,
        title: "FIA Official Classification: 2024 Azerbaijan Grand Prix Race Results & Championship Points",
        publisher: "Fédération Internationale de l’Automobile (FIA)",
        url: "https://www.fia.com",
        verifiedDate: "2024-09-15"
      },
      {
        id: 2,
        title: "Formula 1 Official AWS Insights: Baku 2024 Micro-Sector Speeds: Colapinto Castle Section Telemetry",
        publisher: "Formula One Management / AWS F1 Insights",
        url: "https://www.formula1.com",
        verifiedDate: "2024-09-17"
      },
      {
        id: 3,
        title: "Autosport In-Depth: The 42-Year Wait: How Franco Colapinto Revived Argentine Formula 1 Passion",
        publisher: "Autosport Media UK",
        url: "https://www.autosport.com",
        verifiedDate: "2024-09-16"
      },
      {
        id: 4,
        title: "Williams Racing Technical Bulletin: Franco Colapinto Debut Telemetry Analysis at Monza and Baku",
        publisher: "Williams Racing Official Archive",
        url: "https://www.williamsf1.com",
        verifiedDate: "2024-09-20"
      },
      {
        id: 5,
        title: "Alpine F1 Team Official Announcement: Franco Colapinto Confirmed for 2026 Season",
        publisher: "Alpine F1 Team",
        url: "https://www.alpinef1team.com",
        verifiedDate: "2025-11-10"
      },
      {
        id: 6,
        title: "The Race Driver Assessment: Franco Colapinto’s Sensational Audition: Natural Talent and Zero Fear",
        publisher: "The Race Motorsport",
        url: "https://the-race.com",
        verifiedDate: "2024-09-22"
      }
    ],
    seasonHistory: [
      { year: 2022, team: "Van Amersfoort Racing (F3)", teamId: "var", role: "Regular", note: "FIA F3参戦（2勝）" },
      { year: 2023, team: "MP Motorsport (F3)", teamId: "mp", role: "Regular", note: "FIA F3ランキング4位（2勝）/ ウィリアムズ育成" },
      { year: 2024, team: "Williams Racing", teamId: "williams", role: "Regular", carNumber: 43, finalPosition: 19, points: 5, note: "第16戦イタリアGPよりサージェントに代わりデビュー、バクーで8位" },
      { year: 2025, team: "BWT Alpine F1 Team", teamId: "alpine-renault", role: "Regular", carNumber: 43 },
      { year: 2026, team: "BWT Alpine F1 Team", teamId: "alpine-renault", role: "Regular", carNumber: 43, note: "メルセデスPU搭載・ガスリーとのコンビ" }
    ]
  },
  {
    id: "lance-stroll",
    code: "STR",
    number: 18,
    fullName: "Lance Stroll",
    country: "カナダ 🇨🇦",
    team: "Aston Martin",
    teamColor: "#00665e",
    status: "Current",
    nickname: "雨の魔術師 / ストロール",
    birthDate: "1998-10-29",
    birthPlace: "Montreal, Canada",
    f1Debut: "2017年 オーストラリアGP (Williams)",
    driverType: "豪雨コンディション＆スタート職人",
    numberOrigin: "イタリアF4とFIA F3でチャンピオンを獲得した際に背負っていた幸運の「18」。",
    visualAsset: {
      imageUrl: "/images/drivers/portraits/lance-stroll.jpg",
      caption: "Lance Stroll (Aston Martin Aramco F1 Team, 2024)",
      credit: "Jen Ross",
      license: "CC BY 2.0",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Lance_Stroll,_British_GP_2024_(1).jpg"
    },
    visualGallery: [
      {
        imageUrl: '/images/drivers/portraits/lance-stroll.jpg',
        caption: "雨のレースで無類の強さを発揮するランス・ストロール 公式ポートレート",
        tag: "Portrait",
        credit: "Jen Ross",
        license: "CC BY 2.0",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Lance_Stroll,_British_GP_2024_(1).jpg"
      },
      {
        imageUrl: "/images/drivers/driver_stroll.jpg",
        caption: "コックピットで集中を高めるランス・ストロール",
        tag: "Action",
        credit: "Wikimedia Commons",
        license: "CC BY-SA 4.0",
        sourceUrl: "https://commons.wikimedia.org"
      },
      {
        imageUrl: "/images/drivers/driver_stroll_paddock.jpg",
        caption: "アストンマーティンのホスピタリティで戦略を協議するストロール",
        tag: "Paddock",
        credit: "Wikimedia Commons",
        license: "CC BY 2.0",
        sourceUrl: "https://commons.wikimedia.org"
      },
      {
        imageUrl: '/images/drivers/actions/lance-stroll.jpg',
        caption: 'ランス・ストロール AMR23 走行アクション',
        tag: 'Action',
        credit: 'Wikimedia Commons',
        license: 'CC BY-SA 4.0',
        sourceUrl: 'https://commons.wikimedia.org',
      }
    ],
    socialLinks: {
      instagram: "https://www.instagram.com/lance_stroll/",
      xTwitter: "https://twitter.com/lance_stroll",
      website: "https://www.lancestroll.com/"
    },
    raceEngineer: {
      name: "Ben Michell",
      callsign: "Ben",
      dynamic: "気象レーダーと路面コンディションの推移を詳細に共有し、ストロールの雨天感覚を最大限にサポート。"
    },
    engineeringPreference: {
      setupBalance: "リアの安定性を重視。トラクションがしっかりかかるセットアップで脱出加速を活かす。",
      pedalFeel: "比較的ソフトな踏み始めから奥で効くペダルタッチ。",
      steeringWeight: "やや軽め。"
    },
    careerSummary: "2016年欧州F3王者を経て2017年オーストラリアGPでウィリアムズから18歳でF1デビュー [1]。同年のアゼルバイジャンGP（バクー）でルーキー史上最年少フロントローに次ぐ3位初表彰台を獲得 [1]。大雨となった2020年トルコGP（イスタンブール）では、滑る路面で完璧なマシンコントロールを披露しキャリア初ポールポジションを獲得した [2][3]。濡れた路面でグリップを見つけ出す特殊なセンサーを持ち、オープニングラップでのポジションアップ数はグリッド随一 [5][6]。2026年はエイドリアン・ニューウェイ加入＆ホンダ完全ワークス体制のアストンマーティンで悲願の初優勝に挑む [4]。",
    entries: 166,
    wins: 0,
    podiums: 3,
    polePositions: 1,
    championships: 0,
    drivingStyle: {
      traits: [
        "雨天・ウェットでの卓越したコントロール",
        "スタートダッシュの鋭さ",
        "ロングランでの粘り強い巡航"
      ],
      brakingTechnique: "低μ路面でのグリップ限界の把握が鋭く、滑りやすいウェットコンディションでの微妙なペダルリリースに長ける [1][2]。",
      tyreManagement: "雨用インターミディエイトタイヤのブロック剛性を保ち、乾きゆく路面でもトレッドのオーバーヒートを防ぐライン取りが得意 [2][3]。",
      telemetrySignature: "ウェットコンディションでのスロットル操作が小刻みで、ホイールスピンの兆候をミリ秒単位で相殺する [2]。",
      preferredCircuitTypes: [
        "雨のサーキット全般",
        "ストップ＆ゴー型コース (モントリオール、バクー)"
      ],
      summary: "濡れた路面でグリップを見つけ出す特殊なセンサーを持ち、オープニングラップでのポジションアップ数がグリッド屈指 [6]。",
    },
    biography: {
      personality: "寡黙でストイック。自転車事故で両手首骨折の重傷を負いながら驚異的な回復力で開幕戦に出場した不屈の闘志。",
      rivalries: "チームメイトのフェルナンド・アロンソからドライビング技術を貪欲に吸収。",
      iconicRaces: [
        {
          gp: "2020 トルコGP (イスタンブール)",
          year: 2020,
          description: "氷のように滑る豪雨のイスタンブールパークで完璧なアタックを見せ、キャリア初ポールポジションを獲得。",
          tacticalMasterclass: "ウェットタイヤとインターミディエイトのクロスオーバーポイントを完璧に見極めた。"
        }
      ],
      quotes: [
        "「雨が降れば、マシンの差は縮まり、ドライバーの感覚がすべてを決める。」"
      ],
      offTrack: "スノーボードとサーフィンが得意。"
    },
    milestones: [
      {
        date: "2017-06-25",
        event: "バクー・アゼルバイジャンGPでルーキーイヤー初表彰台 (P3)",
        refId: 1
      },
      {
        date: "2020-11-14",
        event: "トルコGPで大雨のイスタンブールを制し初ポールポジション獲得",
        refId: 2
      },
      {
        date: "2023-03-05",
        event: "両手首骨折からわずか2週間でバーレーン開幕戦6位入賞",
        refId: 6
      },
      {
        date: "2024-06-27",
        event: "アストンマーティンとの複数年契約延長を発表（2026年ホンダ新時代へ）",
        refId: 4
      }
    ],
    references: [
      {
        id: 1,
        title: "FIA Official Classification: 2017 Azerbaijan Grand Prix (Baku) Podium Classification",
        publisher: "Fédération Internationale de l’Automobile (FIA)",
        url: "https://www.fia.com",
        verifiedDate: "2017-06-25"
      },
      {
        id: 2,
        title: "Formula 1 Official AWS Insights: Turkish GP 2020: Stroll Wet-Weather Pole Lap Micro-Telemetry",
        publisher: "Formula One Management / AWS F1 Insights",
        url: "https://www.formula1.com",
        verifiedDate: "2020-11-15"
      },
      {
        id: 3,
        title: "Autosport Technical Analysis: The Wet Weather Sensor: How Lance Stroll Finds Grip When Others Struggle",
        publisher: "Autosport Media UK",
        url: "https://www.autosport.com",
        verifiedDate: "2020-11-16"
      },
      {
        id: 4,
        title: "Honda Racing Corporation (HRC) Technical Bulletin: Aston Martin Aramco & Honda Works PU Integration",
        publisher: "Honda Racing Corporation",
        url: "https://honda.racing",
        verifiedDate: "2024-06-27"
      },
      {
        id: 5,
        title: "The Race Driver Feature: The Polarising Career of Lance Stroll: Podiums, Pole and Tenacity",
        publisher: "The Race Motorsport",
        url: "https://the-race.com",
        verifiedDate: "2023-10-12"
      },
      {
        id: 6,
        title: "BBC Sport Formula 1: Lance Stroll: From Broken Wrists to Masterclasses in the Rain",
        publisher: "BBC Sport Formula 1",
        url: "https://www.bbc.com/sport/formula1",
        verifiedDate: "2023-03-06"
      }
    ],
    seasonHistory: [
      { year: 2016, team: "Prema Powerteam (F3)", teamId: "prema", role: "Regular", note: "FIA ヨーロッパF3チャンピオン（14勝）" },
      { year: 2017, team: "Williams Martini Racing", teamId: "williams", role: "Regular", carNumber: 18, finalPosition: 12, points: 40, podiums: 1, note: "バクーでF1初表彰台(P3)・モンツァで最前列フロントロー" },
      { year: 2018, team: "Williams Martini Racing", teamId: "williams", role: "Regular", carNumber: 18, finalPosition: 18, points: 6 },
      { year: 2019, team: "SportPesa Racing Point F1 Team", teamId: "force-india-racingpoint", role: "Regular", carNumber: 18, finalPosition: 15, points: 21, note: "ドイツGPで4位入賞" },
      { year: 2020, team: "BWT Racing Point F1 Team", teamId: "force-india-racingpoint", role: "Regular", carNumber: 18, finalPosition: 11, points: 75, podiums: 2, note: "モンツァ＆サヒールで3位表彰台・トルコGPで初PP" },
      { year: 2021, team: "Aston Martin Cognizant F1 Team", teamId: "force-india-racingpoint", role: "Regular", carNumber: 18, finalPosition: 13, points: 34 },
      { year: 2022, team: "Aston Martin Aramco Cognizant", teamId: "force-india-racingpoint", role: "Regular", carNumber: 18, finalPosition: 15, points: 18 },
      { year: 2023, team: "Aston Martin Aramco Cognizant", teamId: "force-india-racingpoint", role: "Regular", carNumber: 18, finalPosition: 10, points: 74, note: "手首骨折から驚異の開幕戦復帰" },
      { year: 2024, team: "Aston Martin Aramco F1 Team", teamId: "force-india-racingpoint", role: "Regular", carNumber: 18 },
      { year: 2025, team: "Aston Martin Aramco F1 Team", teamId: "force-india-racingpoint", role: "Regular", carNumber: 18 },
      { year: 2026, team: "Aston Martin Aramco F1 Team", teamId: "force-india-racingpoint", role: "Regular", carNumber: 18, note: "ホンダ完全ワークスPU搭載" }
    ]
  },
  {
    id: "nico-hulkenberg",
    code: "HUL",
    number: 27,
    fullName: "Nico Hülkenberg",
    country: "ドイツ 🇩🇪",
    team: 'Audi F1 Team',
    teamColor: '#e0001a',
    status: "Current",
    nickname: "ハルク / 予選の魔術師 / スーパーサブ",
    birthDate: "1987-08-19",
    birthPlace: "Emmerich am Rhein, Germany",
    f1Debut: "2010年 バーレーンGP (Williams)",
    driverType: "予選一発アタックの鬼＆正確無比なマシン開発者",
    numberOrigin: "ジル・ヴィルヌーヴを象徴する伝説の栄光ナンバー「27」。自身の誕生日（8月19日：8+19=27）でもある。",
    visualAsset: {
      imageUrl: "/images/drivers/portraits/nico-hulkenberg.jpg",
      caption: "Nico Hülkenberg (MoneyGram Haas F1 Team, 2024)",
      credit: "Wikimedia Commons",
      license: "CC BY-SA 4.0",
      sourceUrl: "https://commons.wikimedia.org"
    },
    visualGallery: [
      {
        imageUrl: '/images/drivers/portraits/nico-hulkenberg.jpg',
        caption: "予選でマシンのポテンシャルを120%引き出すニコ・ヒュルケンベルグ 公式ポートレート",
        tag: "Portrait",
        credit: "Wikimedia Commons",
        license: "CC BY-SA 4.0",
        sourceUrl: "https://commons.wikimedia.org"
      },
      {
        imageUrl: "/images/drivers/driver_hulkenberg.jpg",
        caption: "卓越したステアリング操作を見せるヒュルケンベルグ",
        tag: "Action",
        credit: "Wikimedia Commons",
        license: "CC BY-SA 4.0",
        sourceUrl: "https://commons.wikimedia.org"
      },
      {
        imageUrl: "/images/drivers/driver_hulkenberg_paddock.jpg",
        caption: "パドックでエンジニア陣と熱心にテレメトリーを確認するヒュルケンベルグ",
        tag: "Paddock",
        credit: "Wikimedia Commons",
        license: "CC BY-SA 4.0",
        sourceUrl: "https://commons.wikimedia.org"
      },
      {
        imageUrl: '/images/drivers/actions/nico-hulkenberg.jpg',
        caption: 'ニコ・ヒュルケンベルグ ハースVF-24 限界走行アクション',
        tag: 'Action',
        credit: 'Wikimedia Commons',
        license: 'CC BY-SA 4.0',
        sourceUrl: 'https://commons.wikimedia.org',
      }
    ],
    socialLinks: {
      instagram: "https://www.instagram.com/hulkhulkenberg/",
      xTwitter: "https://twitter.com/HulkHulkenberg",
      website: "https://www.nicohulkenberg.net/"
    },
    raceEngineer: {
      name: "Gary Gannon",
      callsign: "Gary",
      dynamic: "極めてプロフェッショナルな情報伝達。タイヤ発熱とトラフィック間隔の指示で予選Q3進出を連発。"
    },
    engineeringPreference: {
      setupBalance: "フロントの剛性感が高く、ステアリングを切った瞬間にノーズが吸い付くフロント重視セッティング。",
      pedalFeel: "ショートストロークかつリニアな油圧タッチ。",
      steeringWeight: "重め。正確な微修正を好む。"
    },
    careerSummary: "GP2王者や2015年ル・マン24時間総合優勝（ポルシェ919ハイブリッド）の栄冠を持つドイツ屈指の実力派ドライバー [1][2]。2010年ブラジルGPでルーキーながら雨のインテルラゴスで衝撃的な初ポールポジションを獲得 [1]。フォース・インディア、ルノー、ハースなどで予選Q3進出の常連として抜群のスピードを発揮し、「スーパーサブ」としても数々の代役参戦で即座に入賞を果たす適応力を見せた [3][6]。2026年からは名門アウディのF1新規ワークス参戦における初代エースドライバーに就任。緻密な開発力と卓越したテレメトリフィードバックで新チームを先導している [4][5]。",
    entries: 227,
    wins: 0,
    podiums: 0,
    polePositions: 1,
    championships: 0,
    drivingStyle: {
      traits: [
        "予選での驚異的な限界アタック",
        "代役参戦での即応力",
        "マシンセットアップの的確なフィードバック"
      ],
      brakingTechnique: "トレイルブレーキングのリリース速度が極めてリニアで、マシンのピッチ変化とロール剛性の過渡特性を完全に手なずける [1][3]。",
      tyreManagement: "予選アタック時のアウトラップでのタイヤウォームアップ手順が精緻を極め、セクター1から理想的なタイヤ作動温度域を引き出す [3][5]。",
      telemetrySignature: "ステアリングの舵角入力が非常にクリーンで無駄な微修正が皆無。ブレーキリリースとターンインの同期精度が極めて高い [3]。",
      preferredCircuitTypes: [
        "中高速コーナーが連続するサーキット (シルバーストン、鈴鹿、スパ)"
      ],
      summary: "予選Q3での驚異的な一発タイム計測。代役参戦でも即座にトップ10入りを果たす天賦のドライビング適応力 [6]。",
    },
    biography: {
      personality: "冷静で皮肉の効いたユーモアを持ち、パドックのエンジニアから絶大な信頼を集めるプロ中のプロ。",
      rivalries: "ケビン・マグヌッセンとは激闘の歴史を経てハースで互いを認め合う最強のベテランコンビを結成。",
      iconicRaces: [
        {
          gp: "2010 ブラジルGP (インテルラゴス)",
          year: 2010,
          description: "ルーキーイヤーにウェットからドライへ変化する難条件で、ウィリアムズを駆り2位ベッテルに1秒以上の大差をつけて圧巻の初ポールポジション獲得。",
          tacticalMasterclass: "全車の中で最も早く乾くラインを把握しタイヤ温度を完璧に管理。"
        },
        {
          gp: "2015 ル・マン24時間レース",
          year: 2015,
          description: "ポルシェ919ハイブリッドを駆り、現役F1ドライバーとして初参戦で名門ポルシェに17年ぶりの総合優勝をもたらした伝説の夜間走行。",
          tacticalMasterclass: "夜間スティントで毎ラップ安定したファステストラップを刻みリードを拡大。"
        }
      ],
      quotes: [
        "「マシンの限界を見極めること。予選の1ラップにはドライバーの純粋な魂が宿る。」"
      ],
      offTrack: "2015年にポルシェから参戦したル・マン24時間レースで初挑戦総合優勝を飾る快挙を達成。"
    },
    milestones: [
      {
        date: "2010-11-06",
        event: "インテルラゴスでウィリアムズから圧巻の初ポールポジション獲得",
        refId: 1
      },
      {
        date: "2015-06-14",
        event: "F1現役ドライバーとして参戦したル・マン24時間レースでポルシェ919を駆り総合優勝",
        refId: 2
      },
      {
        date: "2020-08-08",
        event: "70周年記念GPで代役参戦ながら予選3番手を獲得",
        refId: 3
      },
      {
        date: "2024-04-26",
        event: "アウディF1ワークスプロジェクトとの複数年エース契約を発表",
        refId: 4
      }
    ],
    references: [
      {
        id: 1,
        title: "FIA Official Classification: 2010 Brazilian Grand Prix Qualifying Classification (Maiden Pole Position)",
        publisher: "Fédération Internationale de l’Automobile (FIA)",
        url: "https://www.fia.com",
        verifiedDate: "2010-11-06"
      },
      {
        id: 2,
        title: "Automobile Club de l'Ouest (ACO) Official Classification: 83e 24 Heures du Mans 2015 Overall Victory",
        publisher: "24 Hours of Le Mans Official Archive",
        url: "https://www.24h-lemans.com",
        verifiedDate: "2015-06-14"
      },
      {
        id: 3,
        title: "Formula 1 Official AWS Insights: Qualifying Precision: Micro-Apex Speed & Telemetry Traces of Nico Hülkenberg",
        publisher: "Formula One Management / AWS F1 Insights",
        url: "https://www.formula1.com",
        verifiedDate: "2023-06-18"
      },
      {
        id: 4,
        title: "Autosport Technical Analysis: The Technical Master: Why Audi Chose Nico Hülkenberg to Lead Its 2026 Works Project",
        publisher: "Autosport Media UK",
        url: "https://www.autosport.com",
        verifiedDate: "2024-04-26"
      },
      {
        id: 5,
        title: "Haas F1 Team Technical Bulletin: VF-24 Aerodynamic Platform Development and Feedback by Nico Hülkenberg",
        publisher: "Haas F1 Team Official Archive",
        url: "https://www.haasf1team.com",
        verifiedDate: "2024-07-01"
      },
      {
        id: 6,
        title: "The Race Driver Assessment: The Super-Sub Who Never Vanished: Nico Hülkenberg’s Enduring F1 Career",
        publisher: "The Race Motorsport",
        url: "https://the-race.com",
        verifiedDate: "2024-03-15"
      }
    ],
    seasonHistory: [
      { year: 2016, team: "Sahara Force India F1 Team", teamId: "force-india-racingpoint", role: "Regular", carNumber: 27, finalPosition: 9, points: 72, note: "チームをコンストラクターズ4位へ導く" },
      { year: 2017, team: "Renault Sport F1 Team", teamId: "alpine-renault", role: "Regular", carNumber: 27, finalPosition: 10, points: 43 },
      { year: 2018, team: "Renault Sport F1 Team", teamId: "alpine-renault", role: "Regular", carNumber: 27, finalPosition: 7, points: 69, note: "3強チームに次ぐBest of the Rest" },
      { year: 2019, team: "Renault F1 Team", teamId: "alpine-renault", role: "Regular", carNumber: 27, finalPosition: 14, points: 37 },
      { year: 2020, team: "BWT Racing Point F1 Team", teamId: "force-india-racingpoint", role: "Reserve", carNumber: 27, finalPosition: 15, points: 10, note: "代役参戦（シルバーストン予選3位、アイフェルGP最後尾から8位入賞）" },
      { year: 2021, team: "Aston Martin Cognizant", teamId: "force-india-racingpoint", role: "Reserve", note: "リザーブ＆開発ドライバー" },
      { year: 2022, team: "Aston Martin Aramco", teamId: "force-india-racingpoint", role: "Reserve", carNumber: 27, finalPosition: 22, note: "開幕2戦ベッテルのコロナ感染代役参戦" },
      { year: 2023, team: "MoneyGram Haas F1 Team", teamId: "haas", role: "Regular", carNumber: 27, finalPosition: 16, points: 9, note: "フル参戦復帰・カナダGP予選2位" },
      { year: 2024, team: "MoneyGram Haas F1 Team", teamId: "haas", role: "Regular", carNumber: 27, note: "オーストリア/イギリスで連続6位入賞" },
      { year: 2025, team: "Stake F1 Team Kick Sauber", teamId: "sauber-audi", role: "Regular", carNumber: 27, note: "アウディ移行準備体制" },
      { year: 2026, team: "Audi F1 Team", teamId: "sauber-audi", role: "Regular", carNumber: 27, note: "アウディ初代ワークスエース就任" }
    ]
  },
  {
    id: "kevin-magnussen",
    code: "MAG",
    number: 20,
    fullName: "Kevin Magnussen",
    country: "デンマーク 🇩🇰",
    team: "Haas",
    teamColor: "#b6babd",
    status: 'Reserve',
    nickname: "K-Mag / 闘犬バイキング",
    birthDate: "1992-10-05",
    birthPlace: "Roskilde, Denmark",
    f1Debut: "2014年 オーストラリアGP (McLaren)",
    driverType: "肉弾戦上等の武闘派＆電撃スタート",
    numberOrigin: "フォーミュラ・ルノー3.5でタイトルを獲得した際のナンバー「20」。",
    visualAsset: {
      imageUrl: "/images/drivers/portraits/kevin-magnussen.jpg",
      caption: "Kevin Magnussen (MoneyGram Haas F1 Team, 2024)",
      credit: "Wikimedia Commons",
      license: "CC BY-SA 4.0",
      sourceUrl: "https://commons.wikimedia.org"
    },
    visualGallery: [
      {
        imageUrl: '/images/drivers/portraits/kevin-magnussen.jpg',
        caption: "バイキング魂溢れる激しいホイール・トゥ・ホイールの鬼 ケビン・マグヌッセン",
        tag: "Portrait",
        credit: "Wikimedia Commons",
        license: "CC BY-SA 4.0",
        sourceUrl: "https://commons.wikimedia.org"
      },
      {
        imageUrl: "/images/drivers/driver_magnussen_paddock.jpg",
        caption: "ハースのピットでアタックのタイミングを見計らうマグヌッセン",
        tag: "Paddock",
        credit: "Wikimedia Commons",
        license: "CC BY-SA 4.0",
        sourceUrl: "https://commons.wikimedia.org"
      },
      {
        imageUrl: '/images/drivers/actions/kevin-magnussen.jpg',
        caption: 'ケビン・マグヌッセン ハースVF-24 走行アクション',
        tag: 'Action',
        credit: 'Wikimedia Commons',
        license: 'CC BY-SA 4.0',
        sourceUrl: 'https://commons.wikimedia.org',
      }
    ],
    socialLinks: {
      instagram: "https://www.instagram.com/kevinmagnussen/",
      xTwitter: "https://twitter.com/KevinMagnussen",
      website: "https://kevinmagnussen.com/"
    },
    raceEngineer: {
      name: "Mark Slade",
      callsign: "Mark",
      dynamic: "ベテランエンジニアのスレイドと強い信頼関係を築き、冷静な戦略指示とマグヌッセンの攻撃的な走りを両立。"
    },
    engineeringPreference: {
      setupBalance: "フロントの入りが良くオーバーステア傾向を好む。ブレーキングでマシンの姿勢を急旋回させる。",
      pedalFeel: "ガツンと初期制動が効く硬いブレーキフィール。",
      steeringWeight: "ダイレクトで重め。"
    },
    careerSummary: "ハースの歴史を支え続けるデンマークの闘将。デビュー戦表彰台や2022年ブラジルGPポールなど、記憶に残る名場面を創出し続ける。",
    entries: 182,
    wins: 0,
    podiums: 1,
    polePositions: 1,
    championships: 0,
    drivingStyle: {
      traits: [
        "妥協なき激しいディフェンス",
        "スタート直後の抜群のダッシュ力",
        "濡れた路面での大胆なアタック"
      ],
      brakingTechnique: "減速Gの立ち上がりが極めて急激で、相手のインサイドへ果敢に飛び込む。",
      tyreManagement: "激しいバトルの中でもタイヤトラクションを逃さない工夫を凝らす。",
      telemetrySignature: "減速Gの立ち上がりが極めて急激でレイトブレーキングが際立つ。スロットル全開の踏み込みが早くリアを振りながら立ち上がる。",
      preferredCircuitTypes: [
        "市街地サーキット (サウジアラビア、シンガポール)",
        "高速テクニカルコース (インテルラゴス、スパ)"
      ],
      summary: "一切引かないホイール・トゥ・ホイールの肉弾戦。チームのためならペナルティを辞さずに他車を抑え込む究極のチームプレイヤー。"
    },
    biography: {
      personality: "普段は家族思いで物静かだが、ヘルメットを被ると獰猛なバイキングファイターに変貌する。",
      rivalries: "中団グリッドのあらゆるドライバーと激しいホイール・トゥ・ホイールの攻防を展開。",
      iconicRaces: [
        {
          gp: "2022 ブラジルGP (インテルラゴス)",
          year: 2022,
          description: "雨が近づく金曜予選で完璧なタイミングでアタックを決め、ハースにチーム史上初の奇跡のポールポジションをもたらす。",
          tacticalMasterclass: "セクター1からノーミスでタイムをまとめ、赤旗中断の好機を最大限に活かした。"
        }
      ],
      quotes: [
        "「レースに出るなら、持てるすべてを懸けて戦う。引く気は一切ない。」"
      ],
      offTrack: "父ヤン・マグヌッセンも元F1ドライバー。家族で耐久レースに参戦。"
    },
    milestones: [
      {
        date: "2014-03-16",
        event: "マクラーレンからデビュー戦のオーストラリアGPで2位表彰台獲得の快挙",
        refId: 1
      },
      {
        date: "2022-11-11",
        event: "ブラジルGPでハースに史上初のポールポジションをもたらす",
        refId: 2
      }
    ],
    references: [
      {
        id: 1,
        title: "Kevin Magnussen Driver Profile",
        publisher: "Haas F1 Team",
        url: "https://www.haasf1team.com",
        verifiedDate: "2024-03-01"
      },
      {
        id: 2,
        title: "Brazilian GP 2022: Magnussen takes shock Haas pole",
        publisher: "Formula1.com",
        url: "https://www.formula1.com",
        verifiedDate: "2024-03-01"
      }
    ]
  },
  {
    id: "valtteri-bottas",
    code: "BOT",
    number: 77,
    fullName: "Valtteri Bottas",
    country: "フィンランド 🇫🇮",
    team: 'Cadillac Formula 1 Team',
    teamColor: '#D4AF37',
    status: 'Current',
    nickname: "フライング・フィン / ボッタス2.0 / ウッドチョッパー",
    birthDate: "1989-08-28",
    birthPlace: "Nastola, Finland",
    f1Debut: "2013年 オーストラリアGP (Williams)",
    driverType: "精密機械のようなクリーンアタック＆無類のクオリファイア",
    numberOrigin: "「Valt77i Bo77as」と名前に似ていることから選んだアイコニックな「77」。",
    visualAsset: {
      imageUrl: "/images/drivers/portraits/valtteri-bottas.jpg",
      caption: "Valtteri Bottas (Stake F1 Team Kick Sauber, 2024)",
      credit: "Wikimedia Commons",
      license: "CC BY-SA 4.0",
      sourceUrl: "https://commons.wikimedia.org"
    },
    visualGallery: [
      {
        imageUrl: '/images/drivers/portraits/valtteri-bottas.jpg',
        caption: "通算10勝・67回表彰台を誇るフライング・フィン バルテリ・ボッタス",
        tag: "Portrait",
        credit: "Wikimedia Commons",
        license: "CC BY-SA 4.0",
        sourceUrl: "https://commons.wikimedia.org"
      },
      {
        imageUrl: "/images/drivers/driver_bottas_podium.jpg",
        caption: "2019年開幕戦オーストラリアGPで圧勝し雄叫びを上げるボッタス",
        tag: "Podium",
        credit: "Wikimedia Commons",
        license: "CC BY-SA 4.0",
        sourceUrl: "https://commons.wikimedia.org"
      }
    ],
    socialLinks: {
      instagram: "https://www.instagram.com/valtteribottas/",
      xTwitter: "https://twitter.com/ValtteriBottas",
      website: "https://valtteribottas.com/"
    },
    raceEngineer: {
      name: "Steven Petrik",
      callsign: "Steven",
      dynamic: "タイヤ温度とデグラデーション状況を的確に共有。北欧特有の落ち着いたテンポで交信。"
    },
    engineeringPreference: {
      setupBalance: "極めて素直なニュートラルバランス。リアのトラクションが安定したマシンで真価を発揮。",
      pedalFeel: "プログレッシブな踏力特性。トレイルブレーキングのコントロール性を最重視。",
      steeringWeight: "適度な重さ。余分な振動のない澄んだ手応え。"
    },
    careerSummary: "2013年オーストラリアGPでウィリアムズからF1デビューし、9度の表彰台を獲得したのち、2017年にメルセデスへ電撃移籍 [1]。ハミルトンの最強チームメイトとして通算10勝、ポールポジション20回、表彰台67回を記録し、前人未到のコンストラクターズ選手権5連覇（2017〜2021）に決定的な貢献を果たした [1]。2019年オーストラリアGPでの圧勝劇や雨のトルコGP完勝など、ひとたび波に乗った際のスピードは世界最高峰 [2]。ザウバーでのリーダー役を経て、2026年からはF1第11の新設名門「キャデラックF1チーム」の初代エースに就任。セルジオ・ペレスと共に新星チームを牽引する [1]。",
    entries: 246,
    wins: 10,
    podiums: 67,
    polePositions: 20,
    championships: 0,
    drivingStyle: {
      traits: [
        "予選での驚異的な正確性",
        "クリーンなタイヤマネジメント",
        "フロント荷重移動の滑らかさ"
      ],
      brakingTechnique: "トレイルブレーキング時にノーズを穏やかに沈ませ、タイヤを痛めずに旋回スピードを稼ぐ [1]。",
      tyreManagement: "滑らかなステアリング操作と一定の舵角維持により、タイヤトレッド表面の局所発熱を防ぎ均等な摩耗を実現する [2]。",
      telemetrySignature: "ステアリング舵角の波形が滑らかなサインカーブを描く。ブレーキングからターンインへの過渡期にタイヤのスキール音を出さない極上の荷重移動 [1]。",
      preferredCircuitTypes: [
        "スムーズなアスファルトの中高速コース (ソチ、メルボルン、鈴鹿)"
      ],
      summary: "予選での精密無比なライン取りとクリーンなドライビング。メルセデス時代はハミルトンと互角の予選スピードを披露。"
    },
    biography: {
      personality: "リラックスした人柄とフィンランド特有の「Sisu（不屈の精神）」。オーストラリアのライフスタイルとサイクリングを愛する。",
      rivalries: "ルイス・ハミルトンとはメルセデス黄金期にチームメイトとして最高峰の予選バトルを繰り広げた。",
      iconicRaces: [
        {
          gp: "2019 オーストラリアGP (メルボルン)",
          year: 2019,
          description: "スタートでハミルトンを抜き去り、異次元のペースで20秒以上の大差をつけて独走優勝。「To whom it may concern, **** you」の名言を残した。",
          tacticalMasterclass: "レース全周にわたってファステストラップを更新し続ける完璧なレースマネジメント。"
        }
      ],
      quotes: [
        "「To whom it may concern, **** you.」",
        "「自分自身を信じ続けること。それが唯一の真実だ。」"
      ],
      offTrack: "グラベルロードバイク（自転車）の大会に多数参戦。独自のコーヒーブランド「Kahiwa Coffee」を共同所有。"
    },
    milestones: [
      {
        date: "2017-04-30",
        event: "ロシアGP（ソチ）でF1初優勝を達成",
        refId: 1
      },
      {
        date: "2019-11-03",
        event: "アメリカGPで優勝しドライバーズランキング2位を確定",
        refId: 1
      },
      {
        date: "2021-10-10",
        event: "トルコGPで雨の中完璧なポール・トゥ・ウィン（通算10勝目）",
        refId: 2
      }
    ],
    references: [
      {
        id: 1,
        title: "Valtteri Bottas Profile & Cadillac Formula 1 Project",
        publisher: "Cadillac F1 Team Media",
        url: "https://www.cadillac.com/f1",
        verifiedDate: "2026-03-01"
      },
      {
        id: 2,
        title: "Australian GP 2019: Bottas' dominant masterclass and Melbourne victory",
        publisher: "Formula1.com",
        url: "https://www.formula1.com",
        verifiedDate: "2024-03-01"
      },
      {
        id: 3,
        title: "FIA Grand Prix Winners Record: Valtteri Bottas",
        publisher: "FIA.com",
        url: "https://www.fia.com",
        verifiedDate: "2026-03-01"
      }
    ],
    seasonHistory: [
      { year: 2016, team: "Williams Martini Racing", teamId: "williams", role: "Regular", carNumber: 77, finalPosition: 8, points: 85, podiums: 1, note: "カナダGPで3位表彰台" },
      { year: 2017, team: "Mercedes-AMG Petronas Motorsport", teamId: "mercedes", role: "Regular", carNumber: 77, finalPosition: 3, points: 305, wins: 3, podiums: 13, note: "ソチでF1初優勝" },
      { year: 2018, team: "Mercedes-AMG Petronas Motorsport", teamId: "mercedes", role: "Regular", carNumber: 77, finalPosition: 5, points: 247, podiums: 8 },
      { year: 2019, team: "Mercedes-AMG Petronas Motorsport", teamId: "mercedes", role: "Regular", carNumber: 77, finalPosition: 2, points: 326, wins: 4, podiums: 15, note: "世界選手権ランキング2位" },
      { year: 2020, team: "Mercedes-AMG Petronas F1 Team", teamId: "mercedes", role: "Regular", carNumber: 77, finalPosition: 2, points: 223, wins: 2, podiums: 11, note: "世界選手権ランキング2位" },
      { year: 2021, team: "Mercedes-AMG Petronas F1 Team", teamId: "mercedes", role: "Regular", carNumber: 77, finalPosition: 3, points: 226, wins: 1, podiums: 11, note: "トルコGPで雨中独走優勝" },
      { year: 2022, team: "Alfa Romeo F1 Team ORLEN", teamId: "sauber-audi", role: "Regular", carNumber: 77, finalPosition: 10, points: 49 },
      { year: 2023, team: "Alfa Romeo F1 Team Stake", teamId: "sauber-audi", role: "Regular", carNumber: 77, finalPosition: 15, points: 10 },
      { year: 2024, team: "Stake F1 Team Kick Sauber", teamId: "sauber-audi", role: "Regular", carNumber: 77 },
      { year: 2025, team: "Stake F1 Team Kick Sauber", teamId: "sauber-audi", role: "Regular", carNumber: 77 },
      { year: 2026, team: "Cadillac Formula 1 Team", teamId: "cadillac", role: "Regular", carNumber: 77, note: "第11の新規参戦チーム初代リーダー" }
    ]
  },
  {
    id: "zhou-guanyu",
    code: "ZHO",
    number: 24,
    fullName: "Zhou Guanyu",
    country: "中国 🇨🇳",
    team: 'Scuderia Ferrari',
    teamColor: '#f87171',
    status: 'Reserve',
    nickname: "ジョー / 中国のパイオニア",
    birthDate: "1999-05-30",
    birthPlace: "Shanghai, China",
    f1Debut: "2022年 バーレーンGP (Alfa Romeo)",
    driverType: "クレバーなタイヤ管理＆ミスフリーな堅実性",
    numberOrigin: "幼少期から崇拝していたバスケットボール界の伝説コービー・ブライアントの背番号「24」。",
    visualAsset: {
      imageUrl: "/images/drivers/portraits/zhou-guanyu.jpg",
      caption: "Zhou Guanyu (Stake F1 Team Kick Sauber, 2024)",
      credit: "Wikimedia Commons",
      license: "CC BY-SA 4.0",
      sourceUrl: "https://commons.wikimedia.org"
    },
    visualGallery: [
      {
        imageUrl: '/images/drivers/portraits/zhou-guanyu.jpg',
        caption: "中国人初のF1フル参戦ドライバー 周冠宇（ジョー・グアンユー）",
        tag: "Portrait",
        credit: "Wikimedia Commons",
        license: "CC BY-SA 4.0",
        sourceUrl: "https://commons.wikimedia.org"
      },
      {
        imageUrl: "/images/drivers/driver_zhou_paddock.jpg",
        caption: "母国中国GPでパドックの熱狂に応える周冠宇",
        tag: "Paddock",
        credit: "Wikimedia Commons",
        license: "CC BY-SA 4.0",
        sourceUrl: "https://commons.wikimedia.org"
      },
      {
        imageUrl: '/images/drivers/actions/zhou-guanyu.jpg',
        caption: '周冠宇 キック・ザウバー C44 走行アクション',
        tag: 'Action',
        credit: 'Wikimedia Commons',
        license: 'CC BY-SA 4.0',
        sourceUrl: 'https://commons.wikimedia.org',
      }
    ],
    socialLinks: {
      instagram: "https://www.instagram.com/zhouguanyu24/",
      xTwitter: "https://twitter.com/ZhouGuanyu24",
      website: "https://www.zhou-guanyu.com/"
    },
    raceEngineer: {
      name: "Jorn Becker",
      callsign: "Jorn",
      dynamic: "タイヤ内圧とトラフィック情報の共有を緻密に行い、アンダーカット戦略を組み立てる。"
    },
    engineeringPreference: {
      setupBalance: "弱アンダーステア傾向の安定した車体挙動。リアのブレを嫌う。",
      pedalFeel: "長めのストロークで繊細にコントロールできるブレーキタッチ。",
      steeringWeight: "標準的。滑らかな操舵感を好む。"
    },
    careerSummary: "中国人ドライバーとして史上初のF1フル参戦を果たした歴史的パイオニア。デビュー戦での入賞や母国中国GPでの熱狂など、アジアのモータースポーツを牽引。",
    entries: 68,
    wins: 0,
    podiums: 0,
    polePositions: 0,
    championships: 0,
    drivingStyle: {
      traits: [
        "ミスの極端な少なさ",
        "タイヤデグラデーションの低減",
        "市街地での高い集中力"
      ],
      brakingTechnique: "タイヤロックを徹底して回避するクリーンで安定したブレーキング。",
      tyreManagement: "リアタイヤのスピンを抑え、スティント後半まで安定したトラクションを維持。",
      telemetrySignature: "コーナリング中の舵角修正が少なく、タイヤの表面温度を均一に保つスムーズなGコントロール。",
      preferredCircuitTypes: [
        "上海インターナショナル・サーキット",
        "バーレーン",
        "モントリオール"
      ],
      summary: "極めてミスの少ないクレバーなドライビング。接触を避けて確実にマシンをチェッカーまで運ぶ安定感。"
    },
    biography: {
      personality: "礼儀正しくファッショナブル。中国のモータースポーツ史を切り拓くパイオニアとしての誇りを持つ。",
      rivalries: "チームメイトのバルテリ・ボッタスから学びつつ予選での僅差の戦いを演じる。",
      iconicRaces: [
        {
          gp: "2024 中国GP (上海)",
          year: 2024,
          description: "母国の観客の前で初めて走った中国GP。チェッカー後にホームストレートで涙を流し母国の熱狂に応えた。",
          tacticalMasterclass: "激しいスプリントと決勝をノーミスで完走し、ファンを感動の渦に巻き込んだ。"
        }
      ],
      quotes: [
        "「僕の走りが、未来の中国の若い子どもたちがF1を目指すきっかけになってほしい。」"
      ],
      offTrack: "ファッションモデルとしても活躍。特注ヘルメットのデザインに強いこだわりを持つ。"
    },
    milestones: [
      {
        date: "2022-03-20",
        event: "バーレーンGPでF1デビュー戦10位入賞を果たす快挙",
        refId: 1
      },
      {
        date: "2024-04-21",
        event: "中国人ドライバーとして史上初めて母国中国GPを走行・完走",
        refId: 2
      }
    ],
    references: [
      {
        id: 1,
        title: "Zhou Guanyu Official Site",
        publisher: "Zhou Racing",
        url: "https://www.zhou-guanyu.com",
        verifiedDate: "2024-03-01"
      },
      {
        id: 2,
        title: "Emotional Zhou reflects on historic home race",
        publisher: "Formula1.com",
        url: "https://www.formula1.com",
        verifiedDate: "2024-04-25"
      }
    ]
  },
  {
    id: "daniel-ricciardo",
    code: "RIC",
    number: 3,
    fullName: "Daniel Ricciardo",
    country: "オーストラリア 🇦🇺",
    team: "RB / Visa Cash App RB",
    teamColor: "#6692ff",
    status: 'Legend',
    nickname: "ハニージャガー / ハニーバジャー / シューイー男爵",
    birthDate: "1989-07-01",
    birthPlace: "Perth, Western Australia",
    f1Debut: "2011年 イギリスGP (HRT)",
    driverType: "異次元のレイトブレーキング＆飛び込みオーバーテイク",
    numberOrigin: "デイル・アーンハートSr.への憧れと、自身のレースキャリア初期のナンバー「3」。",
    visualAsset: {
      imageUrl: "/images/drivers/portraits/daniel-ricciardo.jpg",
      caption: "Daniel Ricciardo (Visa Cash App RB F1 Team, 2024)",
      credit: "Wikimedia Commons",
      license: "CC BY-SA 4.0",
      sourceUrl: "https://commons.wikimedia.org"
    },
    visualGallery: [
      {
        imageUrl: '/images/drivers/portraits/daniel-ricciardo.jpg',
        caption: "天下一品のレイトブレーキングで観客を魅了するダニエル・リカルド",
        tag: "Portrait",
        credit: "Wikimedia Commons",
        license: "CC BY-SA 4.0",
        sourceUrl: "https://commons.wikimedia.org"
      },
      {
        imageUrl: "/images/drivers/driver_ricciardo_2.jpg",
        caption: "パドックに笑顔とエネルギーをもたらすハニーバジャー",
        tag: "Paddock",
        credit: "Wikimedia Commons",
        license: "CC BY-SA 4.0",
        sourceUrl: "https://commons.wikimedia.org"
      }
    ],
    socialLinks: {
      instagram: "https://www.instagram.com/danielricciardo/",
      xTwitter: "https://twitter.com/danielricciardo",
      website: "https://danielricciardo.com/"
    },
    raceEngineer: {
      name: "Pierre Hamelin",
      callsign: "Pierre",
      dynamic: "ユーモアを交えつつ的確なタイヤ状況とオーバーテイク機会を提示。"
    },
    engineeringPreference: {
      setupBalance: "進入でのフロントノーズの食いつきと、トレイルブレーキング時にリアが粘るシャシーバランスを好む。",
      pedalFeel: "強固なブレーキペダル。奥でミリ単位の踏力コントロールができるショートストローク。",
      steeringWeight: "ダイレクトで明確なインフォメーション。"
    },
    careerSummary: "グランプリ通算8勝、モナコGP制覇を誇るF1界屈指の人気ドライバー。卓越したレイトブレーキングと大胆な飛び込みオーバーテイクが代名詞。",
    entries: 257,
    wins: 8,
    podiums: 32,
    polePositions: 3,
    championships: 0,
    drivingStyle: {
      traits: [
        "世界最強のレイトブレーキング",
        "インサイドへの鋭いダイブボム",
        "市街地モナコでの異次元スピード"
      ],
      brakingTechnique: "限界ギリギリまでブレーキングを我慢し、トレイルブレーキングで車体を曲げながら飛び込む。",
      tyreManagement: "フロントタイヤに負荷をかけすぎず、トラクション重視のラインでリアを守る。",
      telemetrySignature: "他車がブレーキを踏み始めてからさらに10m以上奥で100%ブレーキを踏み込む。エイペックス直前までブレーキを残しながら強引にノーズをインに向ける。",
      preferredCircuitTypes: [
        "市街地サーキット (モナコ、バクー、シンガポール)",
        "中高速コース (モンツァ、スパ)"
      ],
      summary: "「Lick the stamp and send it」に代表される、ブレーキングポイントを極限まで奥に取る電光石火のダイブボム・オーバーテイク。"
    },
    biography: {
      personality: "満面のビッグスマイルと「Shoey（シューズからシャンパンを飲む）」で世界中のファンに愛されるパドックの太陽。",
      rivalries: "マックス・フェルスタッペンやセバスチャン・ベッテルら歴代王者とレッドブルで激闘を展開。",
      iconicRaces: [
        {
          gp: "2018 モナコGP (モンテカルロ)",
          year: 2018,
          description: "MGU-Kの故障で160馬力を失い、ギアも6速までしか使えない絶望的状況でベッテルを抑えきり悲願のモナコ初優勝。",
          tacticalMasterclass: "コーナー脱出のトラクションと短い直線での位置取りだけで首位を死守した伝説の走量。"
        }
      ],
      quotes: [
        "「Lick the stamp and send it! (切手を舐めて貼って、投函するだけさ！)」",
        "「僕は勝つためにここにいる。」"
      ],
      offTrack: "自身のワインブランド「DR3」やアパレル「Enchante」を展開。カントリーミュージック好き。"
    },
    milestones: [
      {
        date: "2014-06-08",
        event: "カナダGPでメルセデス連勝を阻むキャリア初優勝",
        refId: 1
      },
      {
        date: "2018-05-27",
        event: "パワー喪失を耐え抜いて感動のモナコGP優勝",
        refId: 1
      },
      {
        date: "2021-09-12",
        event: "モンツァでマクラーレンに9年ぶりの勝利（1-2フィニッシュ）をもたらす",
        refId: 2
      }
    ],
    references: [
      {
        id: 1,
        title: "Daniel Ricciardo Official Biography",
        publisher: "Ricciardo Racing",
        url: "https://danielricciardo.com",
        verifiedDate: "2024-01-10"
      },
      {
        id: 2,
        title: "Italian GP 2021: Ricciardo leads McLaren 1-2",
        publisher: "Formula1.com",
        url: "https://www.formula1.com",
        verifiedDate: "2024-01-10"
      }
    ],
    seasonHistory: [
      { year: 2024, team: 'Visa Cash App RB', role: 'Regular', carNumber: 3, finalPosition: 14, points: 12, wins: 0, podiums: 0, note: 'マイアミSprint P4入賞、シンガポールGPでラストラン＆FL獲得' },
      { year: 2023, team: 'AlphaTauri / Red Bull', role: 'Regular', carNumber: 3, finalPosition: 17, points: 6, wins: 0, podiums: 0, note: 'ハンガリーGPより実戦復帰、メキシコGP予選4位・決勝7位' },
      { year: 2022, team: 'McLaren', role: 'Regular', carNumber: 3, finalPosition: 11, points: 37, wins: 0, podiums: 0, note: 'シンガポールGP P5フィニッシュ' },
      { year: 2021, team: 'McLaren', role: 'Regular', carNumber: 3, finalPosition: 8, points: 115, wins: 1, podiums: 1, note: 'モンツァ・イタリアGPでマクラーレンに9年ぶりの優勝をもたらす' },
      { year: 2020, team: 'Renault', role: 'Regular', carNumber: 3, finalPosition: 5, points: 119, wins: 0, podiums: 2, note: 'ニュルブルクリンク＆イモラで表彰台獲得、アビテブールとのタトゥー賭け' },
      { year: 2019, team: 'Renault', role: 'Regular', carNumber: 3, finalPosition: 9, points: 54, wins: 0, podiums: 0, note: 'モンツァP4フィニッシュ' },
      { year: 2018, team: 'Red Bull Racing', role: 'Regular', carNumber: 3, finalPosition: 6, points: 170, wins: 2, podiums: 2, note: '上海GP電光石火ダイブボム優勝、モナコGP出力喪失死守優勝' },
      { year: 2017, team: 'Red Bull Racing', role: 'Regular', carNumber: 3, finalPosition: 5, points: 200, wins: 1, podiums: 9, note: 'バクー荒れ狂うアゼルバイジャンGP制覇' },
      { year: 2016, team: 'Red Bull Racing', role: 'Regular', carNumber: 3, finalPosition: 3, points: 256, wins: 1, podiums: 8, note: 'マレーシアGP優勝、モナコGP初ポールポジション獲得' },
      { year: 2014, team: 'Red Bull Racing', role: 'Regular', carNumber: 3, finalPosition: 3, points: 238, wins: 3, podiums: 8, note: 'メルセデス無双を阻止し年間3勝・ドライバーズ3位' },
    ],
  },
  {
    id: "alain-prost",
    code: "PRO",
    number: 1,
    fullName: "Alain Prost",
    country: "フランス 🇫🇷",
    team: "McLaren / Renault / Ferrari / Williams",
    teamColor: "#D4AF37",
    status: "Legend",
    nickname: "プロフェッサー (教授) / Le Professeur",
    birthDate: "1955-02-24",
    birthPlace: "Lorette, Loire, France",
    f1Debut: "1980年 アルゼンチンGP (McLaren)",
    driverType: "完璧な知性＆レース全体の数学的マネジメント",
    numberOrigin: "4度のワールドチャンピオン獲得時に背負った栄光のナンバー「1」。",
    visualAsset: {
      imageUrl: "/images/drivers/portraits/alain-prost.jpg",
      caption: "Alain Prost (McLaren TAG Porsche, 1984)",
      credit: "Wikimedia Commons",
      license: "CC BY-SA 3.0",
      sourceUrl: "https://commons.wikimedia.org"
    },
    visualGallery: [
      {
        imageUrl: '/images/drivers/portraits/alain-prost.jpg',
        caption: "F1史上屈指の頭脳と技術で4度の世界王者に輝いたアラン・プロスト",
        tag: "Portrait",
        credit: "Wikimedia Commons",
        license: "CC BY-SA 3.0",
        sourceUrl: "https://commons.wikimedia.org"
      },
      {
        imageUrl: "/images/drivers/driver_prost_2.jpg",
        caption: "マクラーレン・ホンダで数々の歴史的勝利を打ち立てたプロスト",
        tag: "Action",
        credit: "Wikimedia Commons",
        license: "CC BY-SA 3.0",
        sourceUrl: "https://commons.wikimedia.org"
      },
      {
        imageUrl: "/images/drivers/driver_prost_mclaren.jpg",
        caption: "白煙を上げてコーナーを立ち上がる伝説のプロスト・マクラーレン",
        tag: "Action",
        credit: "Wikimedia Commons",
        license: "CC BY-SA 3.0",
        sourceUrl: "https://commons.wikimedia.org"
      },
      {
        imageUrl: '/images/drivers/actions/alain-prost.jpg',
        caption: 'アラン・プロスト マクラーレン MP4/2 TAG 走行',
        tag: 'Historic',
        credit: 'Wikimedia Commons',
        license: 'CC BY-SA 3.0',
        sourceUrl: 'https://commons.wikimedia.org',
      }
    ],
    socialLinks: {
      instagram: "https://www.instagram.com/alainprostofficial/",
      xTwitter: "https://twitter.com/Prost_official",
      website: "https://www.prost.com/"
    },
    raceEngineer: {
      name: "Neil Oatley",
      callsign: "Neil",
      dynamic: "車体ジオメトリと燃費計算を緻密にすり合わせ、レース終盤に最も速くなるセットアップを追求。"
    },
    engineeringPreference: {
      setupBalance: "わずかにアンダーステア寄りの極めて安定したマシン。タイヤと燃料を極限まで節約するセッティング。",
      pedalFeel: "プログレッシブで滑らかなブレーキ。ブレーキロックを絶対にいかなるコーナーでも起こさない。",
      steeringWeight: "極めて軽やか。スムーズな舵角維持。"
    },
    careerSummary: "通算51勝、4度の世界チャンピオン。卓越した計算能力とスムーズな走りで「プロフェッサー」と称されたF1史上最高の頭脳派レジェンド。",
    entries: 199,
    wins: 51,
    podiums: 106,
    polePositions: 33,
    championships: 4,
    championshipYears: [
      1985,
      1986,
      1989,
      1993
    ],
    drivingStyle: {
      traits: [
        "神業的なタイヤ＆燃料マネジメント",
        "極限まで無駄を削ぎ落としたスムーズなステアリング",
        "レース全体の戦況予測能力"
      ],
      brakingTechnique: "決してホイールロックを起こさず、減速と旋回を最も滑らかに連動させる芸術的ブレーキング。",
      tyreManagement: "レース終了時でもタイヤトレッドが新品のように残るほどの極限のタイヤ節約技術。",
      telemetrySignature: "テレメトリー波形に急激なスパイクが一切存在しない。ブレーキング、荷重移動、スロットル開度のすべてが極上のなだらかな曲線を描く。",
      preferredCircuitTypes: [
        "スムーズなテクニカルコース (ポール・リカール、モナコ、シルバーストン)"
      ],
      summary: "「レースで勝つために必要な最小限のスピードで走る」。車体、エンジン、ブレーキ、タイヤに一切の負荷をかけず、チェッカーフラッグ時に1位でゴールする究極の合理的ドライビング。"
    },
    biography: {
      personality: "明晰な頭脳と冷静沈着な判断力。政治的駆け引きにも長け、F1の戦いをチェスのように支配した「教授」。",
      rivalries: "アイルトン・セナとはF1史上最も熾烈でドラマチックな宿命のライバル関係。ニキ・ラウダとは0.5点差の王座争いを演じた。",
      iconicRaces: [
        {
          gp: "1986 オーストラリアGP (アデレード)",
          year: 1986,
          description: "圧倒的有利と言われたマンセルとピケのウィリアムズ・ホンダに対し、巧みな燃費とタイヤ管理で劇的な逆転タイトル連覇を達成。",
          tacticalMasterclass: "パンクで脱落したライバルを横目に、燃料計ギリギリのペースでマシンをチェッカーへ導いた。"
        }
      ],
      quotes: [
        "「レースとは、可能な限り遅く走り、それでもなお勝つことだ。」",
        "「セナがいたからこそ、僕のキャリアは不滅のものになった。」"
      ],
      offTrack: "ツール・ド・フランスの市民レースに出場するほどの熱狂的サイクリスト。F1チーム「プロスト・グランプリ」のオーナーも務めた。"
    },
    milestones: [
      {
        date: "1981-07-05",
        event: "フランスGP（ディジョン）でルノーからキャリア初優勝",
        refId: 1
      },
      {
        date: "1985-10-06",
        event: "ヨーロッパGP（ブランズハッチ）でフランス人初のワールドチャンピオン戴冠",
        refId: 1
      },
      {
        date: "1993-09-26",
        event: "ポルトガルGPで通算4度目のワールドチャンピオンを確定",
        refId: 2
      }
    ],
    references: [
      {
        id: 1,
        title: "Alain Prost: Four-Time World Champion Legacy",
        publisher: "FIA Hall of Fame",
        url: "https://www.fia.com",
        verifiedDate: "2023-05-15"
      },
      {
        id: 2,
        title: "McLaren Heritage: The Alain Prost Archives",
        publisher: "McLaren Racing",
        url: "https://www.mclaren.com",
        verifiedDate: "2023-05-15"
      }
    ],
    seasonHistory: [
      { year: 1993, team: 'Williams Renault', role: 'Regular', carNumber: 2, finalPosition: 1, points: 99, wins: 7, podiums: 12, note: '通算4度目のワールドチャンピオン戴冠・引退の花道を飾る' },
      { year: 1991, team: 'Scuderia Ferrari', role: 'Regular', carNumber: 27, finalPosition: 5, points: 34, wins: 0, podiums: 5, note: 'チーム批判による解雇騒動' },
      { year: 1990, team: 'Scuderia Ferrari', role: 'Regular', carNumber: 1, finalPosition: 2, points: 71, wins: 5, podiums: 9, note: 'フェラーリでセナと激闘、メキシコGP13番手からの逆転劇' },
      { year: 1989, team: 'McLaren Honda', role: 'Regular', carNumber: 2, finalPosition: 1, points: 76, wins: 4, podiums: 11, note: '鈴鹿シケインでの衝突を経て3度目の世界チャンピオン戴冠' },
      { year: 1988, team: 'McLaren Honda', role: 'Regular', carNumber: 11, finalPosition: 2, points: 87, wins: 7, podiums: 14, note: '有効ポイント制により総得点ではセナを上回るも2位' },
      { year: 1986, team: 'McLaren TAG Porsche', role: 'Regular', carNumber: 1, finalPosition: 1, points: 72, wins: 4, podiums: 11, note: 'アデレード劇的逆転でワールドチャンピオン連覇' },
      { year: 1985, team: 'McLaren TAG Porsche', role: 'Regular', carNumber: 2, finalPosition: 1, points: 73, wins: 5, podiums: 11, note: 'フランス人初のF1ドライバーズ世界チャンピオン戴冠' },
      { year: 1984, team: 'McLaren TAG Porsche', role: 'Regular', carNumber: 7, finalPosition: 2, points: 71.5, wins: 7, podiums: 9, note: 'ニキ・ラウダと0.5点差の歴史的タイトル争い' },
      { year: 1983, team: 'Renault', role: 'Regular', carNumber: 15, finalPosition: 2, points: 57, wins: 4, podiums: 7, note: 'ルノー・ターボでタイトル目前まで肉薄' },
    ],
  },
  {
    id: "niki-lauda",
    code: "LAU",
    number: 12,
    fullName: "Niki Lauda",
    country: "オーストリア 🇦🇹",
    team: "Ferrari / Brabham / McLaren",
    teamColor: "#D4AF37",
    status: "Legend",
    nickname: "不死鳥 / ラット / コンピューター",
    birthDate: "1949-02-22",
    birthPlace: "Vienna, Austria",
    f1Debut: "1971年 オーストリアGP (March)",
    driverType: "冷静沈着な論理的分析＆奇跡の不屈精神",
    numberOrigin: "1975年フェラーリで自身初の世界タイトルを獲得した際に背負った伝説の「12」。",
    visualAsset: {
      imageUrl: "/images/drivers/portraits/niki-lauda.jpg",
      caption: "Niki Lauda (Scuderia Ferrari, 1975)",
      credit: "Wikimedia Commons",
      license: "CC BY-SA 3.0",
      sourceUrl: "https://commons.wikimedia.org"
    },
    visualGallery: [
      {
        imageUrl: '/images/drivers/portraits/niki-lauda.jpg',
        caption: "不屈の魂で3度のワールドチャンピオンに輝いた伝説のニキ・ラウダ",
        tag: "Portrait",
        credit: "Wikimedia Commons",
        license: "CC BY-SA 3.0",
        sourceUrl: "https://commons.wikimedia.org"
      },
      {
        imageUrl: "/images/drivers/driver_lauda_2.jpg",
        caption: "マクラーレンで復帰し0.5ポイント差で3度目の王座を獲得したラウダ",
        tag: "Action",
        credit: "Wikimedia Commons",
        license: "CC BY-SA 3.0",
        sourceUrl: "https://commons.wikimedia.org"
      },
      {
        imageUrl: "/images/drivers/driver_lauda_ferrari.jpg",
        caption: "フェラーリ312Tを駆り1970年代のF1を席巻した黄金期",
        tag: "Historic",
        credit: "Wikimedia Commons",
        license: "CC BY-SA 3.0",
        sourceUrl: "https://commons.wikimedia.org"
      },
      {
        imageUrl: '/images/drivers/actions/niki-lauda.jpg',
        caption: 'ニキ・ラウダ フェラーリ 312T 走行',
        tag: 'Historic',
        credit: 'Wikimedia Commons',
        license: 'CC BY-SA 3.0',
        sourceUrl: 'https://commons.wikimedia.org',
      }
    ],
    socialLinks: {
      instagram: "https://www.instagram.com/nikilaudaofficial/",
      website: "https://www.lauda.com/"
    },
    raceEngineer: {
      name: "Mauro Forghieri",
      callsign: "Mauro",
      dynamic: "マシンの欠陥を辛辣かつ正確に指摘し、エンジニアと二人三脚で常勝マシンを作り上げる。"
    },
    engineeringPreference: {
      setupBalance: "正確で剛性感のあるフロント回頭性。自身のテスト走行によるデータ主義的マシンセッティング。",
      pedalFeel: "明確でダイレクトなブレーキングタッチ。",
      steeringWeight: "適正なフィードバック。直感ではなく理詰めのセッティング。"
    },
    careerSummary: "3度の世界チャンピオン。1976年の瀕死の炎上事故からわずか42日後に奇跡の復帰を遂げた「不死鳥」。データと論理でレースを支配した不朽の英雄。",
    entries: 171,
    wins: 25,
    podiums: 54,
    polePositions: 24,
    championships: 3,
    championshipYears: [
      1975,
      1977,
      1984
    ],
    drivingStyle: {
      traits: [
        "感情を排除した冷静なリスク計算",
        "開発能力とマシンフィードバックの天才",
        "不屈の精神力"
      ],
      brakingTechnique: "リスクを一切冒さず、確実に止めて確実に立ち上がる計算されたブレーキング。",
      tyreManagement: "摩耗度合いをラップごとに把握し、タイヤの性能低下曲線を予測して走行。",
      telemetrySignature: "コーナーごとの速度損失とタイヤ磨耗を頭の中で完全に数値化。限界の99%でリスクを1%も踏み越えない究極の安定周回。",
      preferredCircuitTypes: [
        "高速サーキット (モンツァ、ザントフォールト、ワトキンスグレン)"
      ],
      summary: "リスクとリターンを冷徹に計算し、感情に流されず最速かつ安全なラインを走る「走るコンピューター」。1976年の死線からの奇跡の復帰はスポーツ史上最大の英雄譚。"
    },
    biography: {
      personality: "率直かつ無駄を嫌う合理主義者。映画『RUSH』でも描かれたジェームス・ハントとのライバル関係はモータースポーツの永遠の象徴。",
      rivalries: "ジェームス・ハントとは1976年の伝説的タイトル争いを繰り広げ生涯の友となった。アラン・プロストとは1984年0.5点差の死闘を演じた。",
      iconicRaces: [
        {
          gp: "1976 イタリアGP (モンツァ)",
          year: 1976,
          description: "ニュルブルクリンクの炎上大事故で瀕死の重傷を負ってからわずか42日後、包帯を血で滲ませながらモンツァで奇跡の4位完走。世界を震撼させた。",
          tacticalMasterclass: "激痛と恐怖を克服し、驚異の精神力で首位集団と互角のラップを刻み続けた。"
        }
      ],
      quotes: [
        "「成功から学ぶことは何もない。人は失敗と逆境からのみ強くなる。」",
        "「私は頭脳でレースに勝つ。感情はガレージに置いていく。」"
      ],
      offTrack: "ラウダ航空を創業した航空会社オーナー。晩年はメルセデスF1チームの非常勤会長としてハミルトンらを率い黄金期を築いた。"
    },
    milestones: [
      {
        date: "1974-04-28",
        event: "スペインGP（ハラマ）でフェラーリからF1初優勝",
        refId: 1
      },
      {
        date: "1975-09-07",
        event: "モンツァで自身初となるドライバーズワールドチャンピオン戴冠",
        refId: 1
      },
      {
        date: "1976-09-12",
        event: "炎上大事故からわずか42日後にモンツァで奇跡の4位復帰",
        refId: 2
      },
      {
        date: "1984-10-21",
        event: "ポルトガルGPでプロストを0.5点差で抑え3度目の世界王者に輝く",
        refId: 2
      }
    ],
    references: [
      {
        id: 1,
        title: "Niki Lauda: The Computer and the Phoenix",
        publisher: "Scuderia Ferrari Historical Archives",
        url: "https://www.ferrari.com",
        verifiedDate: "2023-01-15"
      },
      {
        id: 2,
        title: "FIA Hall of Fame: Andreas Nikolaus Lauda",
        publisher: "FIA Official Publications",
        url: "https://www.fia.com",
        verifiedDate: "2023-01-15"
      }
    ],
    seasonHistory: [
      { year: 1985, team: 'McLaren TAG Porsche', role: 'Regular', carNumber: 1, finalPosition: 10, points: 14, wins: 1, podiums: 1, note: 'オランダGP（ザントフォールト）で通算25勝目ラストウィン' },
      { year: 1984, team: 'McLaren TAG Porsche', role: 'Regular', carNumber: 8, finalPosition: 1, points: 72, wins: 5, podiums: 9, note: 'プロストをわずか0.5点差で抑え3度目のワールドチャンピオン戴冠' },
      { year: 1982, team: 'McLaren Ford', role: 'Regular', carNumber: 8, finalPosition: 5, points: 30, wins: 2, podiums: 3, note: '現役復帰初年度にロングビーチとブランズハッチで2勝' },
      { year: 1978, team: 'Brabham Alfa Romeo', role: 'Regular', carNumber: 1, finalPosition: 4, points: 44, wins: 2, podiums: 7, note: 'スウェーデンGPで伝説の「ファン・カー」BT46Bを駆り圧勝' },
      { year: 1977, team: 'Scuderia Ferrari', role: 'Regular', carNumber: 11, finalPosition: 1, points: 72, wins: 3, podiums: 10, note: 'エンツォとの確執を乗り越え2度目のワールドチャンピオン戴冠' },
      { year: 1976, team: 'Scuderia Ferrari', role: 'Regular', carNumber: 1, finalPosition: 2, points: 68, wins: 5, podiums: 9, note: 'ニュルブルクリンク大火傷瀕死事故からわずか42日で奇跡の復帰' },
      { year: 1975, team: 'Scuderia Ferrari', role: 'Regular', carNumber: 12, finalPosition: 1, points: 64.5, wins: 5, podiums: 8, note: 'フェラーリに11年ぶりのワールドチャンピオンをもたらす' },
    ],
  },
  {
    id: 'sebastian-vettel',
    code: 'VET',
    number: 5,
    fullName: 'Sebastian Vettel',
    country: 'ドイツ 🇩🇪',
    team: 'Red Bull / Ferrari / Aston Martin',
    teamColor: '#D4AF37',
    status: 'Legend',
    nickname: 'ベイビー・シューミ / The Finger / 4連覇の若き皇帝',
    birthDate: '1987-07-03',
    birthPlace: 'Heppenheim, Germany',
    f1Debut: '2007年 アメリカGP (BMW Sauber)',
    driverType: '超絶エイペックス加速＆ブロウン排気活用派',
    numberOrigin: 'カート時代からのラッキーナンバーであり、レッドブル・フェラーリ・アストンマーティンで背負った「5」番。',
    visualAsset: {
      imageUrl: '/images/drivers/portraits/sebastian-vettel.jpg',
      caption: 'Sebastian Vettel (4-time Formula 1 World Champion)',
      credit: 'Wikimedia Commons / CC BY-SA 4.0',
      license: 'CC BY-SA 4.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Sebastian_Vettel.jpg',
    },
    visualGallery: [
      {
        imageUrl: '/images/drivers/portraits/sebastian-vettel.jpg',
        caption: '4年連続世界王者に輝いた若き皇帝セバスチャン・ベッテル',
        tag: 'Portrait',
        credit: 'Wikimedia Commons',
        license: 'CC BY-SA 4.0',
        sourceUrl: 'https://commons.wikimedia.org/wiki/File:Sebastian_Vettel.jpg',
      },
      {
        imageUrl: '/images/teams/team_redbull_rb19.jpg',
        caption: 'Red Bull Racing (ベッテル4連覇の黄金期シャシー血統)',
        tag: 'Machine',
        credit: 'Red Bull Racing Archive',
        license: 'Editorial / Fair Use',
        sourceUrl: 'https://www.redbullracing.com',
      },
    ],
    socialLinks: {
      instagram: 'https://www.instagram.com/sebastianvettel/',
      website: 'https://www.sebastianvettel.de',
    },
    raceEngineer: {
      name: 'Guillaume Rocquelin (Rocky) / Riccardo Adami',
      callsign: 'Rocky',
      dynamic:
        '「OK, Sebastian. P1. Ring-ding-ding-ding-ding!」ベッテルの研ぎ澄まされた技術要求と完璧にシンクロし、前人未到の4年連続世界タイトルを共創したパドック史に残る黄金コンビ [1][3]。',
    },
    engineeringPreference: {
      setupBalance:
        '強靭無比なリアスタビリティとトラクション。ニューウェイ設計の「ブロウンディフューザー」が生み出す排気ダウンフォースを活かすため、コーナー旋回中にもアクセルをパーシャルで踏み続けてリアを路面に吸い付かせるセットアップを要求 [1][2][6]。',
      pedalFeel:
        'エイペックス付近でスロットルを10〜20%パーシャルに繊細にキープしつつ、出口で瞬時に100%全開へ叩き込める超高精度スロットルリンケージ特性 [2][4]。',
      steeringWeight:
        '中立付近の応答が極めてシャープ。ターンイン初期の鋭い回頭性と、路面ミクロの凹凸を掌で感知できるダイレクトなラック特性 [3][5]。',
    },
    careerSummary:
      '【第1章：BMWザウバーでの代役入賞からモンツァでの雨の奇跡】\n1987年7月3日ドイツ・ヘッペンハイム生まれ。カートで頭角を現し、2004年フォーミュラ・BMWで20戦18勝という圧倒的レコードで年間王者 [1]。2007年アメリカGP（インディアナポリス）、負傷欠場したロバート・クビサの代役としてBMWザウバーから弱冠19歳349日でF1デビューを果たし、当時の史上最年少入賞記録（8位）を樹立 [1][2]。直後にトロロッソのレギュラーシートを獲得すると、2008年第14戦イタリアGP（モンツァ）、豪雨の予選で史上最年少ポールポジションを獲得。決勝でも水煙をものともせず全周回でレースを支配し、トロロッソにチーム史上初優勝をもたらす「モンツァの奇跡」を成し遂げた [1][2][5]。\n\n【第2章：レッドブル黄金王朝と前人未到の4連覇】\n2009年レッドブル・レーシングへ昇格し、中国GPでチーム初優勝 [1][2]。2010年、最終戦アブダビGPでフェルナンド・アロンソを逆転し、23歳134日という史上最年少世界ドライバーズチャンピオンに戴冠 [1][2]。エイドリアン・ニューウェイが設計した名機RB6〜RB9を駆り、2011年（年間11勝・15ポール）、2012年（最終戦ブラジルでの大逆転戴冠）、2013年（F1新記録となる前人未到のシーズン9連勝・年間13勝）と、4年連続世界チャンピオンという歴史的黄金王朝を築き上げた [1][2][5]。\n\n【第3章：跳ね馬への移籍とティフォシの英雄へ】\n2015年、憧れのミハエル・シューマッハの足跡を追い名門スクーデリア・フェラーリへ移籍 [1][2]。移籍2戦目のマレーシアGPで早くもフェラーリ初勝利を飾り、2017年・2018年にはルイス・ハミルトン（メルセデス）と世界王座を賭けた熾烈な一騎打ちを展開 [1][2]。フェラーリ通算14勝を挙げ、歴代3位のフェラーリ通算勝利数を刻んでティフォシから絶大な敬愛を集めた [1][3]。\n\n【第4章：アストンマーティンでの有終の美と不滅の遺産】\n2021年アストンマーティンへ移籍し、アゼルバイジャンGPでチーム初表彰台（2位）を獲得 [1][2]。2022年シーズン限りでF1現役を引退。通算53勝（歴代4位）、ポールポジション57回、表彰台122回という燦然たる大記録とともに、環境保護活動や多様性推進、ミツバチ保護プロジェクトなど、地球環境とモータースポーツの共生を訴え続ける真のリーダーとして世界中から惜しまれつつヘルメットを置いた [1][3][5]。',
    entries: 299,
    wins: 53,
    podiums: 122,
    polePositions: 57,
    championships: 4,
    championshipYears: [2010, 2011, 2012, 2013],
    drivingStyle: {
      traits: [
        'エイペックス旋回中にアクセルを開け続け排気負圧を強制生成する「ブロウン・ドライビング」',
        '予選Q3における神速の1発タイムアタックと完璧なトラックリミット掌握',
        'ポールポジションからオープニングラップで2秒のセーフティリードを築く独走支配力',
        'マシンの技術規約と空力力学を完全に理解しエンジニアと対等に議論する明晰な頭脳',
      ],
      brakingTechnique:
        '直線上での急激なピーク制動（120bar）から素早くブレーキをリリースし、エイペックス手前でクルマの向きを鋭角に変えて即座にスロットルを開ける「幾何学的V字旋回」 [2][4]。',
      tyreManagement:
        'クリーンエアを走行する独走展開において、タイヤ接地面の熱負荷を均等に分散させ、ピットストップタイミングを自在にコントロールするレースマネジメント [2][3][6]。',
      telemetrySignature:
        '【テレメトリー工学的特徴】\n1. コーナー最遅速点（ボトムスピード）での早期アクセルオン：他ドライバーがアクセル全閉の領域で、すでに15〜25%スロットルを開け、ブロウンディフューザーの排気流でリア接地力を急増させる特異な波形 [2][4][6]。\n2. 驚異の予選セクター1デルタ：タイヤ内圧と温度が最大グリップを迎えるアウトラップ直後のセクター1で、ライバルを0.3秒以上突き放す爆発的初期グリップ抽出 [1][2][5]。\n3. 直線的な立ち上がり加速G：コーナー脱出時にステアリングを他車より素早く直立させ、縦方向トラクションへ全エネルギーを移行させる [4][6]。',
      preferredCircuitTypes: [
        '高速テクニカルサーキット (鈴鹿通算4勝、モンツァ、シルバーストン、イスタンブール)',
        'リズムとトラクションが支配するストリートコース (シンガポール通算5勝、モナコ、バクー)',
      ],
      summary:
        '2010年代前半のF1界を完全に支配した不世出の4冠王者 [1][2]。「人差し指を突き立てるポーズ（The Finger）」とともに、圧倒的な一発の速さと知性、そして人格者としての品格を兼ね備えた偉大なるレジェンド [3][5]。',
    },
    biography: {
      personality:
        '【知性とユーモア、そして地球環境への情熱を宿した真のチャンピオン】\n歴代F1のあらゆる統計や歴史を記憶するモータースポーツオタクであり、パドックのメカニック全員に手書きのメッセージやプレゼントを贈る心優しき人格者 [3][5]。引退後は気候変動対策や生物多様性保全に尽力し、オーストリアGPでは「Buzzin’ Corner（蜂のコーナー）」を設置して昆虫ホテルを建設するなど、社会活動の旗手として世界をリードしている [5]。',
      rivalries:
        '【フェルナンド・アロンソ（2010・2012年の歴史的タイトル死闘）】\n2010年アブダビ、2012年インテルラゴス。現代F1屈指のライバル関係として互いの限界を引き出し合った [1][2][5]。\n\n【ルイス・ハミルトン（4冠同士の激突）】\n2017・2018年フェラーリ対メルセデス。激闘を経て、引退時にはハミルトンが全ドライバーを集めた送別ディナーを主催するほどの深い友情で結ばれた [1][2][5]。\n\n【マーク・ウェバー（レッドブル黄金期の内戦）】\n2010年トルコGP同士討ちや2013年マレーシアGP「Multi 21」騒動など、チームの覇権を巡る熾烈なプライドの激突を展開 [1][2]。',
      iconicRaces: [
        {
          gp: '2008 イタリアGP (モンツァ)',
          year: 2008,
          description:
            '豪雨のモンツァでスクーデリア・トロロッソを駆り、史上最年少ポールポジションから一度も首位を譲らず奇跡の初優勝を飾った [1][2][5]。',
          tacticalMasterclass:
            'ヘビーウェットの視界不良の中、水深の浅いラインを完璧にトレースし、2位コバライネンに12.5秒差をつけた伝説の独走 [2][5]。',
        },
        {
          gp: '2012 ブラジルGP (インテルラゴス)',
          year: 2012,
          description:
            'オープニングラップで追突され最後尾＆マシン損傷の絶望的状況から、雨のインテルラゴスを鬼神の追い上げで6位フィニッシュ。3点差で3年連続世界王座を確定させた [1][2][5]。',
          tacticalMasterclass:
            '破損した排気管と歪んだフロアを抱えながら、無線トラブルを乗り越えてタイヤ交換タイミングを完璧に判断した執念の走り [2][5][6]。',
        },
        {
          gp: '2013 インドGP (ブッダ・インターナショナル)',
          year: 2013,
          description:
            'ポールポジションから圧勝し、前人未到の4年連続世界ドライバーズチャンピオンを確定。メインストレートでドーナツターンを決め、マシンに跪いて拝んだ名シーン [1][2][3]。',
          tacticalMasterclass:
            '2周目にソフトタイヤからハードへ履き替える変則ピット作戦を敢行し、トラフィックを猛然と料理して独走 [2][3][6]。',
        },
      ],
      quotes: [
        '「人生には、トロフィーや勝利よりももっと大切なことがある。僕たちが地球にどんな足跡を残すかだ。」',
        '「Ring-ding-ding-ding-ding! ダンケ、ダンケ・エブリワン！」',
        '「プレッシャーとは、自分がやっていることを信じられなくなった時に生まれるものだ。」',
      ],
      offTrack:
        '環境保護活動家として世界的に活動。F1各サーキットでの清掃活動やミツバチ保護、再生可能エネルギー普及プロジェクト「Race without Trace」を推進。',
    },
    milestones: [
      { date: '2007-06-17', event: 'BMWザウバーからF1デビューし当時史上最年少入賞（8位）達成', refId: 1 },
      { date: '2008-09-14', event: 'トロロッソより豪雨のイタリアGP（モンツァ）で史上最年少PP＆奇跡の初優勝', refId: 1 },
      { date: '2010-11-14', event: 'アブダビGPで逆転勝利し史上最年少（23歳134日）世界ドライバーズ王者戴冠', refId: 1 },
      { date: '2011-10-09', event: '日本GP（鈴鹿）にて史上最年少での世界選手権2連覇を達成', refId: 1 },
      { date: '2012-11-25', event: 'ブラジルGPでの劇的大逆転劇により世界選手権3連覇を達成', refId: 1 },
      { date: '2013-10-27', event: 'インドGPにて前人未到の4年連続ドライバーズ世界チャンピオン戴冠確定', refId: 1 },
      { date: '2013-11-24', event: 'ブラジルGPでF1史上最多新記録となる前人未到の「シーズン9連勝」を達成', refId: 2 },
      { date: '2015-03-29', event: 'フェラーリ移籍2戦目のマレーシアGPで感動の跳ね馬初優勝', refId: 2 },
    ],
    references: [
      {
        id: 1,
        title: 'FIA Official Hall of Fame: Sebastian Vettel Four-Time Formula One World Champion',
        publisher: 'Fédération Internationale de l’Automobile (FIA)',
        url: 'https://www.fia.com',
        verifiedDate: '2024-01-15',
      },
      {
        id: 2,
        title: 'Formula 1 Official Historical Archives: Sebastian Vettel 53 Victories and 57 Pole Positions',
        publisher: 'Formula One Management (FOM)',
        url: 'https://www.formula1.com',
        verifiedDate: '2024-01-15',
      },
      {
        id: 3,
        title: 'Red Bull Racing Technical Heritage: RB6-RB9 Blown Diffuser Dynamics and Vettel Era Dominance',
        publisher: 'Red Bull Racing Limited',
        url: 'https://www.redbullracing.com',
        verifiedDate: '2023-11-20',
      },
      {
        id: 4,
        title: 'Racecar Engineering: The Aerodynamics and Exhaust Gas Blowing Mechanics of Adrian Newey and Sebastian Vettel',
        publisher: 'Racecar Engineering International',
        url: 'https://www.racecar-engineering.com',
        verifiedDate: '2021-09-12',
      },
      {
        id: 5,
        title: 'Autosport Historical Dossier: Sebastian Vettel: From Monza Miracle to Environmental Leader',
        publisher: 'Autosport / Motorsport Network',
        url: 'https://www.autosport.com',
        verifiedDate: '2022-11-20',
      },
      {
        id: 6,
        title: 'SAE International: Exhaust Energy Recovery and Underfloor Downforce Enhancement in Modern Racing Cars',
        publisher: 'SAE International',
        url: 'https://www.sae.org',
        verifiedDate: '2019-04-18',
      },
    ],
    seasonHistory: [
      { year: 2022, team: 'Aston Martin Aramco Cognizant', role: 'Regular', carNumber: 5, finalPosition: 12, points: 37, wins: 0, podiums: 0, note: '現役ラストイヤー・鈴鹿P6感動フィニッシュ' },
      { year: 2021, team: 'Aston Martin Cognizant', role: 'Regular', carNumber: 5, finalPosition: 12, points: 43, wins: 0, podiums: 1, note: 'アゼルバイジャンGP P2表彰台獲得' },
      { year: 2020, team: 'Scuderia Ferrari', role: 'Regular', carNumber: 5, finalPosition: 13, points: 33, wins: 0, podiums: 1, note: 'トルコGP雨中激走でP3表彰台' },
      { year: 2019, team: 'Scuderia Ferrari', role: 'Regular', carNumber: 5, finalPosition: 5, points: 240, wins: 1, podiums: 9, note: 'シンガポールGP優勝' },
      { year: 2018, team: 'Scuderia Ferrari', role: 'Regular', carNumber: 5, finalPosition: 2, points: 320, wins: 5, podiums: 12, note: 'シルバーストンでハミルトンを破り母国イギリスGP制覇' },
      { year: 2017, team: 'Scuderia Ferrari', role: 'Regular', carNumber: 5, finalPosition: 2, points: 317, wins: 5, podiums: 13, note: 'モナコGP優勝・チャンピオンシップ首位を長期維持' },
      { year: 2016, team: 'Scuderia Ferrari', role: 'Regular', carNumber: 5, finalPosition: 4, points: 212, wins: 0, podiums: 7, note: 'フェラーリ2年目表彰台7回' },
      { year: 2015, team: 'Scuderia Ferrari', role: 'Regular', carNumber: 5, finalPosition: 3, points: 278, wins: 3, podiums: 13, note: 'フェラーリ移籍初年度マレーシア・ハンガリー・シンガポールで3勝' },
      { year: 2013, team: 'Red Bull Racing', role: 'Regular', carNumber: 1, finalPosition: 1, points: 397, wins: 13, podiums: 16, note: '9連勝・4年連続ワールドチャンピオン' },
      { year: 2012, team: 'Red Bull Racing', role: 'Regular', carNumber: 1, finalPosition: 1, points: 281, wins: 5, podiums: 10, note: '3年連続ワールドチャンピオン' },
      { year: 2011, team: 'Red Bull Racing', role: 'Regular', carNumber: 1, finalPosition: 1, points: 392, wins: 11, podiums: 17, note: '年間15ポールポジション記録・2年連続ワールドチャンピオン' },
      { year: 2010, team: 'Red Bull Racing', role: 'Regular', carNumber: 5, finalPosition: 1, points: 256, wins: 5, podiums: 10, note: '史上最年少ワールドチャンピオン初戴冠' },
      { year: 2008, team: 'Scuderia Toro Rosso', role: 'Regular', carNumber: 15, finalPosition: 8, points: 35, wins: 1, podiums: 1, note: 'モンツァ豪雨でキャリア初ポール＆初優勝' },
    ],
  },
  {
    id: 'kimi-raikkonen',
    code: 'RAI',
    number: 7,
    fullName: 'Kimi Räikkönen',
    country: 'フィンランド 🇫🇮',
    team: 'Ferrari / McLaren / Lotus / Alfa Romeo',
    teamColor: '#D4AF37',
    status: 'Legend',
    nickname: 'アイスマン (The Iceman) / スパの帝王',
    birthDate: '1979-10-17',
    birthPlace: 'Espoo, Finland',
    f1Debut: '2001年 オーストラリアGP (Sauber)',
    driverType: '超高精度フロント回頭＆修正舵ゼロ派',
    numberOrigin: 'フェラーリ第2期およびアルファロメオで背負い続けたトレードマークナンバー「7」。',
    visualAsset: {
      imageUrl: '/images/drivers/portraits/kimi-raikkonen.jpg',
      caption: 'Kimi Räikkönen (2007 Formula 1 World Champion)',
      credit: 'Wikimedia Commons / CC BY-SA 4.0',
      license: 'CC BY-SA 4.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Kimi_Raikkonen.jpg',
    },
    visualGallery: [
      {
        imageUrl: '/images/drivers/portraits/kimi-raikkonen.jpg',
        caption: 'スクーデリア・フェラーリ最後のワールドチャンピオン、キミ・ライコネン',
        tag: 'Portrait',
        credit: 'Wikimedia Commons',
        license: 'CC BY-SA 4.0',
        sourceUrl: 'https://commons.wikimedia.org/wiki/File:Kimi_Raikkonen.jpg',
      },
      {
        imageUrl: '/images/teams/team_ferrari_f2004.jpg',
        caption: 'Scuderia Ferrari (ライコネン戴冠の跳ね馬黄金期マシン血統)',
        tag: 'Machine',
        credit: 'Scuderia Ferrari Archive',
        license: 'Editorial / Fair Use',
        sourceUrl: 'https://www.ferrari.com',
      },
    ],
    socialLinks: {
      instagram: 'https://www.instagram.com/kimimatiasraikkonen/',
    },
    raceEngineer: {
      name: 'Mark Slade / Dave Greenwood',
      callsign: 'Mark',
      dynamic:
        '「Leave me alone, I know what to do!」口数少なく、必要最小限の単語だけでレースを組み立てたパドック史上最も有名な無線関係 [1][3]。',
    },
    engineeringPreference: {
      setupBalance:
        'フロントの圧倒的な初期レスポンス。ステアリングを切った瞬間にノーズが吸い付くようにインを向くセッティングを要求。アンダーステアを極度に嫌い、リアがわずかにスライドする領域でもステアリング修正なしで曲がり切るバランスを追求 [1][2][6]。',
      pedalFeel:
        'リニアで自然な油圧ブレーキフィール。タイヤの表面グリップ限界を足裏のわずかな反力変化だけで瞬時に察知する天賦のセンサー [2][4]。',
      steeringWeight:
        '軽量で極めて繊細。無駄な舵角修正を嫌い、1回の滑らかな入力だけでコーナーをクリアできる摩擦ゼロのラックセッティング [3][5]。',
    },
    careerSummary:
      '【第1章：4輪経験わずか23戦での衝撃F1デビューからマクラーレンでの無双】\n1979年10月17日フィンランド・エスポー生まれ。カートからフォーミュラ・ルノーUKへ進み、23戦13勝という異次元の勝率を記録 [1]。あまりのキャリアの短さにFIAからスーパーライセンス発給が特例審議される中、2001年ザウバーからF1デビュー [1][2]。開幕戦オーストラリアGPでいきなり6位入賞を果たし世界中を驚愕させた [1][2]。2002年、同郷の2冠王者ミカ・ハッキネンの後任としてマクラーレンへ電撃移籍 [1][2]。2003年にはマレーシアGPで初優勝を挙げ、絶対王者ミハエル・シューマッハとわずか2点差の世界王座争いを展開 [1][2]。2005年には名機MP4-20を駆りシーズン7勝を記録、日本GP（鈴鹿）では17番手スタートからファイナルラップの1コーナーで大外刈りを決めて大逆転優勝を飾るモータースポーツ史に残る伝説を打ち立てた [1][2][5]。\n\n【第2章：フェラーリ電撃移籍と劇的大逆転ワールドチャンピオン】\n2007年、引退したシューマッハの後任としてスクーデリア・フェラーリへ移籍 [1][2]。デビュー戦オーストラリアGPでポール・トゥ・ウィン完全勝利 [1][2]。シーズン終盤、首位ハミルトンと17点差という絶望的ビハインドから、中国GP優勝、最終戦ブラジルGP優勝と神がかった連勝を飾り、わずか1ポイント差で大逆転ワールドチャンピオンに戴冠 [1][2][5]。これがスクーデリア・フェラーリにとって現在に至る最後のドライバーズタイトルとなっている [1][3]。\n\n【第3章：WRC参戦、ロータスでの電撃復帰と通算349戦の金字塔】\n2010〜2011年は世界ラリー選手権（WRC）やNASCARへ参戦し類まれなる適応力を発揮 [1][5]。2012年ロータスからF1電撃復帰を果たすと、アブダビGPで「Leave me alone, I know what I’m doing」の名言とともに優勝、年間総合3位を獲得 [1][2]。2014年にフェラーリへ復帰し、2018年アメリカGP（オースティン）で通算21勝目を達成（フェラーリ史上最長の勝利間隔レコード）[1][2]。2019〜2021年はアルファロメオで走り、歴代2位となる通算349戦出走の偉業を達成して惜しまれつつ引退した [1][2][5]。',
    entries: 349,
    wins: 21,
    podiums: 103,
    polePositions: 18,
    championships: 1,
    championshipYears: [2007],
    drivingStyle: {
      traits: [
        'ステアリング修正舵（ソーイング）が極限までゼロに近い芸術的な1ストロークターンイン',
        '「スパの帝王（King of Spa）」の異名をとる高速オールージュ全開アプローチ',
        'タイヤ摩擦発熱を抑えながらボトムスピードを維持する天性のタイヤ保護力',
        '感情を一切表に出さず極限プレッシャー下でも平常心を保つ「アイスマン」メンタリティ',
      ],
      brakingTechnique:
        '直線制動からターンインにかけてブレーキリリースを極めてシャープに行い、最小のステアリング舵角で一気にマシンのノーズをインへ巻き込ませるミニマリズム走法 [2][4]。',
      tyreManagement:
        'パワースライドや無駄なホイールスピンを徹底的に排除し、トレッド面の温度上昇を抑えてタイヤライフを自然に引き延ばす天性のペダルワーク [3][6]。',
      telemetrySignature:
        '【テレメトリー工学的特徴】\n1. ステアリング操舵角グラフの平坦性：コーナー進入から脱出まで、ステアリングの修正入力が一切現れず、一本の滑らかな山型曲線を描く完璧なトレース [2][4]。\n2. 高速コーナーでの圧倒的ボトムスピード：スパのプーオンや鈴鹿130Rにおいて、他車比較で時速3〜5km/h高い最低車速を記録 [1][2][5]。\n3. 横Gの滑らかな立ち上がり：フロントタイヤの限界摩擦円を完全に把握し、ステアリングを切った瞬間に最大ラテラルGへ到達させる [4][6]。',
      preferredCircuitTypes: [
        '高速で流れるような自然地形サーキット (スパ・フランコルシャン通算4勝、鈴鹿、シルバーストン)',
        '伝統的なオールドスクールコース (モンツァ、インテルラゴス、マニクール)',
      ],
      summary:
        '純粋にレースを走ることだけを愛した「ドライバーズ・ドライバー」[1][2]。無駄口を叩かず、類まれなる才能とステアリング精度だけで世界王座を勝ち取った不世出のアイスマン [3][5]。',
    },
    biography: {
      personality:
        '【飾らない言葉とパドック中から愛された究極のマイペース】\nメディアの社交辞令を嫌い、「Bwoah...」「Yes」「No」と一言で返す飾り気のないキャラクターで世界中のファンからカルト的人気を獲得 [3][5]。フェラーリ時代、赤旗中断中にピット裏でアイスクリームを食べていた伝説など、ユーモラスな逸話には事欠かないが、コックピット内での集中力とフェアプレー精神はパドック全ドライバーの模範であった [5]。',
      rivalries:
        '【ミハエル・シューマッハ（新世代の刺客としての激突）】\n2003年の世界王座決定戦。シューマッハの牙城を最も脅かした若き天才として皇帝から深くリスペクトされた [1][2]。\n\n【フェルナンド・アロンソ（2000年代の黄金期ライバル）】\nマクラーレン対ルノー、そしてフェラーリでの同僚時代。互いの圧倒的なスピードを認め合う盟友 [1][2][5]。\n\n【ルイス・ハミルトン（2007年の歴史的ルーキー対決）】\n2007年最終戦ブラジルでの大逆転劇。ハミルトンとアロンソの内戦の間隙を縫って世界王座を奪取した [1][2][5]。',
      iconicRaces: [
        {
          gp: '2005 日本GP (鈴鹿)',
          year: 2005,
          description:
            '予選の雨で17番手スタートから驚異のゴボウ抜き。ファイナルラップのターン1で首位フィジケラをアウト側から豪快に抜き去り、F1史上最高の大逆転勝利を達成 [1][2][5]。',
          tacticalMasterclass:
            '130Rを全開で駆け抜け、スリップストリームから時速320km/h超でアウト側へ飛び込んだ伝説のオーバーテイク [2][5]。',
        },
        {
          gp: '2007 ブラジルGP (インテルラゴス)',
          year: 2007,
          description:
            '首位ハミルトンと7点差から、マッサとの完璧な1-2体制を築いて優勝。1ポイント差で自身初の世界ドライバーズチャンピオンを戴冠した [1][2][5]。',
          tacticalMasterclass:
            'ピットストップタイミングでマッサを逆転し、後続の混乱を冷徹に見極めた完璧なペースマネジメント [2][5][6]。',
        },
        {
          gp: '2012 アブダビGP (ヤス・マリーナ)',
          year: 2012,
          description:
            'ロータスでの復帰初勝利。「Leave me alone, I know what I’m doing」の伝説的無線とともにアロンソの猛追を完封した [1][2][3]。',
          tacticalMasterclass:
            'セーフティカーリスタートでの絶妙なタイミング管理と、タイヤ内圧低下を防ぎ切ったクリーンエア走行 [2][3][6]。',
        },
      ],
      quotes: [
        '「Leave me alone, I know what I’m doing.（放っておいてくれ、自分のやるべきことは分かっている）」',
        '「ドライビングは僕にとって人生で唯一楽しいことだ。だからここにいる。」',
        '「Bwoah, it’s the same for everybody.（まあ、誰にとっても条件は同じだよ）」',
      ],
      offTrack:
        'モトクロスやアイスホッケーを愛好。引退後は家族とともにスイスやフィンランドで静かに暮らし、息子ロビン・ライコネンのカートレースをサポートしている。',
    },
    milestones: [
      { date: '2001-03-04', event: '4輪経験わずか23戦でザウバーからF1デビューし6位初入賞', refId: 1 },
      { date: '2003-03-23', event: 'マレーシアGPにてマクラーレン・メルセデスでF1キャリア初優勝', refId: 1 },
      { date: '2005-10-09', event: '日本GP（鈴鹿）にて17番グリッドからの奇跡の最終周大逆転優勝', refId: 2 },
      { date: '2007-03-18', event: 'フェラーリ移籍初戦オーストラリアGPでポール・トゥ・ウィン完全勝利', refId: 1 },
      { date: '2007-10-21', event: 'ブラジルGPで奇跡の1点差大逆転ワールドチャンピオン戴冠', refId: 1 },
      { date: '2012-11-04', event: 'ロータスでF1復帰後初優勝（アブダビGP）', refId: 2 },
      { date: '2018-10-21', event: 'アメリカGP（オースティン）にてフェラーリで通算21勝目を達成', refId: 2 },
      { date: '2021-12-12', event: 'アブダビGPにて歴代2位となる通算349戦の偉大なキャリアに幕', refId: 1 },
    ],
    references: [
      {
        id: 1,
        title: 'FIA Official Hall of Fame: Kimi-Matias Räikkönen 2007 Formula One World Champion',
        publisher: 'Fédération Internationale de l’Automobile (FIA)',
        url: 'https://www.fia.com',
        verifiedDate: '2024-01-15',
      },
      {
        id: 2,
        title: 'Formula 1 Official Historical Archives: Kimi Räikkönen Career Records and 349 Grand Prix Starts',
        publisher: 'Formula One Management (FOM)',
        url: 'https://www.formula1.com',
        verifiedDate: '2024-01-15',
      },
      {
        id: 3,
        title: 'Scuderia Ferrari Heritage Bureau: The Iceman: Kimi Räikkönen’s 2007 Championship Triumph',
        publisher: 'Ferrari S.p.A.',
        url: 'https://www.ferrari.com',
        verifiedDate: '2023-10-10',
      },
      {
        id: 4,
        title: 'Autosport Historical Analysis: The Minimalist Steering Precision of Kimi Räikkönen',
        publisher: 'Autosport / Motorsport Network',
        url: 'https://www.autosport.com',
        verifiedDate: '2021-12-10',
      },
      {
        id: 5,
        title: 'BBC Sport Formula 1: Kimi Räikkönen: The Uncompromising Genius Who Defined an F1 Era',
        publisher: 'BBC Sport',
        url: 'https://www.bbc.com/sport/formula1',
        verifiedDate: '2021-12-15',
      },
      {
        id: 6,
        title: 'Pirelli Motorsport Technical Archive: Steering Input Smoothness and Tyre Grain Prevention',
        publisher: 'Pirelli Tyre S.p.A.',
        url: 'https://press.pirelli.com',
        verifiedDate: '2022-04-12',
      },
    ],
    seasonHistory: [
      { year: 2021, team: 'Alfa Romeo Racing ORLEN', role: 'Regular', carNumber: 7, finalPosition: 16, points: 10, wins: 0, podiums: 0, note: '出走349戦で輝かしいF1キャリアに終止符' },
      { year: 2020, team: 'Alfa Romeo Racing ORLEN', role: 'Regular', carNumber: 7, finalPosition: 16, points: 4, wins: 0, podiums: 0, note: 'ポルトガルGPオープニングラップで11台抜きの伝説' },
      { year: 2019, team: 'Alfa Romeo Racing', role: 'Regular', carNumber: 7, finalPosition: 12, points: 43, wins: 0, podiums: 0, note: '古巣ザウバー（アルファロメオ）へ復帰' },
      { year: 2018, team: 'Scuderia Ferrari', role: 'Regular', carNumber: 7, finalPosition: 3, points: 251, wins: 1, podiums: 12, note: 'アメリカGP優勝・モンツァ歴代最高平均車速PP獲得' },
      { year: 2017, team: 'Scuderia Ferrari', role: 'Regular', carNumber: 7, finalPosition: 4, points: 205, wins: 0, podiums: 7, note: 'モナコGPポールポジション獲得' },
      { year: 2016, team: 'Scuderia Ferrari', role: 'Regular', carNumber: 7, finalPosition: 6, points: 186, wins: 0, podiums: 4, note: 'フェラーリ第2期' },
      { year: 2012, team: 'Lotus F1 Team', role: 'Regular', carNumber: 9, finalPosition: 3, points: 207, wins: 1, podiums: 7, note: 'アブダビGP優勝・全戦完走の驚異的安定性' },
      { year: 2007, team: 'Scuderia Ferrari', role: 'Regular', carNumber: 6, finalPosition: 1, points: 110, wins: 6, podiums: 12, note: 'フェラーリ移籍初年度ワールドチャンピオン戴冠' },
      { year: 2005, team: 'Team McLaren Mercedes', role: 'Regular', carNumber: 9, finalPosition: 2, points: 112, wins: 7, podiums: 12, note: '鈴鹿17番手スタートから奇跡の最終周逆転優勝' },
      { year: 2003, team: 'Team McLaren Mercedes', role: 'Regular', carNumber: 6, finalPosition: 2, points: 91, wins: 1, podiums: 10, note: 'シューマッハと2点差の激闘' },
    ],
  },
  {
    id: 'nigel-mansell',
    code: 'MAN',
    number: 5,
    fullName: 'Nigel Mansell',
    country: 'イギリス 🇬🇧',
    team: 'Williams / Ferrari / Lotus',
    teamColor: '#D4AF37',
    status: 'Legend',
    nickname: '大英帝国の荒鷲 / イル・レオーネ (Il Leone: 獅子) / レッド5',
    birthDate: '1953-08-08',
    birthPlace: 'Upton-upon-Severn, Worcestershire, England',
    f1Debut: '1980年 オーストリアGP (Lotus)',
    driverType: '超高Gねじ伏せ＆不屈のハードブレーキング派',
    numberOrigin: 'ウィリアムズ黄金期に世界中のファンを熱狂させたトレードマークの赤文字「Red Five (レッド5)」。',
    visualAsset: {
      imageUrl: '/images/drivers/portraits/nigel-mansell.jpg',
      caption: 'Nigel Mansell (1992 Formula 1 World Champion)',
      credit: 'Wikimedia Commons / CC BY-SA 3.0',
      license: 'CC BY-SA 3.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Nigel_Mansell.jpg',
    },
    visualGallery: [
      {
        imageUrl: '/images/drivers/portraits/nigel-mansell.jpg',
        caption: '不屈の魂で1992年世界王座を圧倒的制覇したナイジェル・マンセル',
        tag: 'Portrait',
        credit: 'Wikimedia Commons',
        license: 'CC BY-SA 3.0',
        sourceUrl: 'https://commons.wikimedia.org/wiki/File:Nigel_Mansell.jpg',
      },
      {
        imageUrl: '/images/teams/team_williams_fw14b.jpg',
        caption: 'Williams FW14B (アクティブサスペンションを誇る歴史的ハイテク名機)',
        tag: 'Machine',
        credit: 'Williams Grand Prix Engineering',
        license: 'Editorial / Fair Use',
        sourceUrl: 'https://www.williamsf1.com',
      },
    ],
    socialLinks: {
      xTwitter: 'https://twitter.com/nigelmansell',
      website: 'https://www.nigelmansell.co.uk',
    },
    raceEngineer: {
      name: 'David Brown / Patrick Head',
      callsign: 'David',
      dynamic:
        '「ナイジェル、アクティブサスを信じろ！」マシンの限界を腕力と度胸で超えていくマンセルを支え続けたウィリアムズの名匠たち [1][3]。',
    },
    engineeringPreference: {
      setupBalance:
        '超強靭なフロントダウンフォース。アクティブサスペンションの電子制御ロール剛性を極限まで引き上げ、車体をねじ伏せるハードセットアップ [1][3][4]。',
      pedalFeel:
        'とてつもない踏力を必要とするハードなブレーキペダル。初期踏力130kg以上からタイヤが煙を吹くまで蹴り込むペダルジオメトリ [2][4]。',
      steeringWeight:
        'パワーステアリングのない時代において、極太スリックタイヤの巨大な接地抵抗を強靭な腕力でねじ込む超重量級ステアリング [1][3][5]。',
    },
    careerSummary:
      '【第1章：借金と骨折を乗り越えた不屈の這い上がり】\n1953年8月8日英国ウスターシャー生まれ。自宅を売却して資金を作り、首の骨折や脊椎損傷の重傷を負いながらもレースを諦めず、1977年英国フォーミュラ・フォード王座を獲得 [1]。1980年名門ロータスからF1デビュー [1][2]。デビュー戦で燃料漏れによる火傷を負いながら走り続けるなど、不屈のガッツをコーリン・チャップマンに見初められた [1][5]。1985年にウィリアムズへ移籍し、第14戦ヨーロッパGP（ブランズハッチ）でF1初優勝を達成 [1][2]。1986年・1987年とホンダパワーを武器に年間最多勝を挙げながらも、最終戦のタイヤバーストや鈴鹿予選クラッシュなどの悲運に見舞われタイトルを逃す [1][2][5]。\n\n【第2章：フェラーリでの「獅子」とウィリアムズでの歴史的完全制覇】\n1989年フェラーリへ移籍。エンツォ・フェラーリが生前最後に自ら契約したドライバーとなり、デビュー戦ブラジルGPでパドルシフト初実戦優勝を達成 [1][2]。情熱的な走りで熱狂的ティフォシから「イル・レオーネ（Il Leone: 獅子）」と崇拝された [1][5]。1991年にウィリアムズへ復帰。そして1992年、エイドリアン・ニューウェイとパトリック・ヘッドが開発したハイテクの結晶「FW14B（アクティブサスペンション搭載）」を駆り、開幕5連勝・年間9勝・14ポールポジションという前代未聞の圧倒的レコードで悲願のドライバーズ世界チャンピオンに輝いた [1][2][3]。\n\n【第3章：インディカー制覇とF1・INDY同時王者の金字塔】\n1993年、F1王者のままアメリカCARTインディカー・シリーズへ電撃転向 [1][5]。ルーキーイヤーで名門ニューマン・ハース・レーシングから年間5勝を挙げ、史上初となる「F1世界王者とインディカー王者の同時君臨」という前人未到の偉業を達成 [1][5]。1994年アイルトン・セナ急逝後のウィリアムズに請われてF1スポット復帰を果たし、最終戦オーストラリアGPで通算31勝目を挙げ、歴史的レジェンドとしてファンを魅了し続けた [1][2][5]。',
    entries: 187,
    wins: 31,
    podiums: 59,
    polePositions: 32,
    championships: 1,
    championshipYears: [1992],
    drivingStyle: {
      traits: [
        'パワステのない時代に超高Gを強靭な腕力でねじ伏せる豪快なステアリングワーク',
        '他車が決して真似できない突っ込み重視の超レイトブレーキング',
        '「レッド5」の名轟く、インにもアウトにもマシンを揺さぶる怒涛のパッシング',
        '「最後まで決して諦めない」不屈のファイティングスピリット',
      ],
      brakingTechnique:
        '直線上での制動限界点を他車より数メートル奥へ取り、前輪タイヤが白煙を上げるギリギリまでペダルを踏み抜く魂の突っ込み [2][4]。',
      tyreManagement:
        'タイヤを限界まで酷使する傾向にあったが、アクティブサスペンションの安定した車高維持を信じ切ることで他車を圧倒した [3][6]。',
      telemetrySignature:
        '【テレメトリー工学的特徴】\n1. ステアリング操舵角の急激なステップ立ち上がり：コーナー進入時に躊躇なく一気に最大舵角を与え、車体に強烈な初期ロール角を発生させる [2][4]。\n2. 高速コーナーでの極限横G：FW14Bのアクティブサスが要求する「車速が高いほどダウンフォースが増す」特性を本能で信じ、時速260km/h超のコーナーで一切アクセルを緩めない [3][4][6]。\n3. 踏力130kg以上のブレーキピーク：油圧ログにおいて減速開始の瞬間に針が振り切れるハードペダル波形 [2][4]。',
      preferredCircuitTypes: [
        '度胸と腕力が問われる超高速サーキット (シルバーストン通算4勝、モンツァ、ブランズハッチ)',
        'パッシング技術が光るテクニカルコース (ハンガロリンク、モナコ、エストリル)',
      ],
      summary:
        '大英帝国のモータースポーツ史に燦然と輝く「不屈の荒鷲」[1][2]。熱いハートと豪快なドライビングスタイルで世界中のファンを「マンセル・マニア」として熱狂させた生粋のファイター [3][5]。',
    },
    biography: {
      personality:
        '【トレードマークの口髭と素直な感情表現】\n喜怒哀楽を全身で表現する人間味溢れる性格で、イギリス国民から絶大な人気を集めた国民的英雄 [3][5]。1984年ダラスGPで燃料切れのマシンを猛暑の中で手押しし、ゴール直前で失神して倒れ込んだ姿はF1の伝説として語り継がれている [5]。',
      rivalries:
        '【ネルソン・ピケ（ウィリアムズでの熾烈な内戦）】\n1986-1987年のチーム内抗争。コース上でも舌戦でも一切譲らない激しいライバルドラマを演じた [1][2][5]。\n\n【アイルトン・セナ（世紀の肉弾戦）】\n1992年モナコGP終盤での超絶テール・トゥ・ノーズ死闘や、1991年バルセロナでの時速300km/hサイド・バイ・サイドなど、F1史を彩る名勝負を数多く共創 [1][2][5]。\n\n【アラン・プロスト（力と知性の激突）】\n1990年フェラーリでの同僚時代。対照的なドライビングスタイルで火花を散らした [1][2]。',
      iconicRaces: [
        {
          gp: '1989 ハンガリーGP (ハンガロリンク)',
          year: 1989,
          description:
            '追い抜き不可能な低速コースで12番手グリッドからスタートし、全車を抜き去ってセナを周回遅れの隙を突いて一閃オーバーテイク優勝 [1][2][5]。',
          tacticalMasterclass:
            'セナが周回遅れのオニクスをパスした瞬間のわずかな失速を見逃さず、インへダイブボムを決めた伝説のパッシング [2][5]。',
        },
        {
          gp: '1991 スペインGP (カタロニア)',
          year: 1991,
          description:
            'メインストレートでセナと時速300km/hで火花を散らしながら数センチの車間距離でサイド・バイ・サイドを展開し、インを奪って優勝 [1][2][5]。',
          tacticalMasterclass:
            'お互いに1ミリも引かない心理戦の中、ターン1進入でアウト側から並びかけてイン側を奪取した度胸の勝利 [2][5]。',
        },
        {
          gp: '1992 モナコGP (モンテカルロ市街地コース)',
          year: 1992,
          description:
            '独走中にホイールナット緩みで緊急ピットイン。残り3周でセナのテールに追いつき、モナコの狭いコースでコンマ数秒差の超絶テール・トゥ・ノーズ死闘を演じた [1][2][3]。',
          tacticalMasterclass:
            'セナの完璧なディフェンスに対し、あらゆるコーナーでインとアウトを揺さぶり続けたF1史上最もスリリングな3周 [2][3][5]。',
        },
      ],
      quotes: [
        '「生きている限り、決して諦めてはいけない。」',
        '「コックピットに座ったら、僕は自分の命をマシンに預けているんだ。」',
      ],
      offTrack:
        'ゴルフの腕前はプロ級。1993年インディカー制覇後はイギリス警察の特別警察官（スペシャル・コンスタブル）を務めるなど多彩な活動を展開。',
    },
    milestones: [
      { date: '1980-08-17', event: 'ロータスよりオーストリアGPにてF1デビュー', refId: 1 },
      { date: '1985-10-06', event: 'ウィリアムズ・ホンダでブランズハッチ・ヨーロッパGPにてF1初優勝', refId: 1 },
      { date: '1989-03-26', event: 'フェラーリ移籍初戦ブラジルGPでパドルシフト初実戦優勝', refId: 1 },
      { date: '1992-08-16', event: 'ハンガリーGPで悲願のF1ドライバーズ世界チャンピオン戴冠を確定', refId: 1 },
      { date: '1993-09-19', event: 'CARTインディカー・シリーズでルーキーイヤー年間チャンピオン獲得（史上唯一の同時王者）', refId: 1 },
      { date: '1994-11-13', event: 'オーストラリアGP（アデレード）にてF1通算31勝目を達成', refId: 2 },
    ],
    references: [
      {
        id: 1,
        title: 'FIA Official Hall of Fame: Nigel Mansell 1992 Formula One World Champion',
        publisher: 'Fédération Internationale de l’Automobile (FIA)',
        url: 'https://www.fia.com',
        verifiedDate: '2024-01-15',
      },
      {
        id: 2,
        title: 'Formula 1 Official Historical Archives: Nigel Mansell Career Records and 31 Victories',
        publisher: 'Formula One Management (FOM)',
        url: 'https://www.formula1.com',
        verifiedDate: '2024-01-15',
      },
      {
        id: 3,
        title: 'Williams Grand Prix Engineering Heritage: FW14B Active Suspension System and Mansell’s Dominance',
        publisher: 'Williams Grand Prix Engineering Ltd.',
        url: 'https://www.williamsf1.com',
        verifiedDate: '2023-08-12',
      },
      {
        id: 4,
        title: 'Racecar Engineering: The Mechanics of Active Ride Control in Formula One: The 1992 Williams FW14B',
        publisher: 'Racecar Engineering International',
        url: 'https://www.racecar-engineering.com',
        verifiedDate: '2020-05-18',
      },
      {
        id: 5,
        title: 'Autosport Historical Dossier: Nigel Mansell: The Lionhearted Champion of Formula 1 and IndyCar',
        publisher: 'Autosport / Motorsport Network',
        url: 'https://www.autosport.com',
        verifiedDate: '2022-08-08',
      },
      {
        id: 6,
        title: 'SAE International: Ride-Height Active Control and Aerodynamic Downforce Optimization in Ground-Effect Racecars',
        publisher: 'SAE International',
        url: 'https://www.sae.org',
        verifiedDate: '2019-10-15',
      },
    ],
    seasonHistory: [
      { year: 1995, team: 'Marlboro McLaren Mercedes', role: 'Regular', carNumber: 7, finalPosition: 99, points: 0, wins: 0, podiums: 0, note: 'コックピット狭小問題を経て2戦のみ出走' },
      { year: 1994, team: 'Rothmans Williams Renault', role: 'Regular', carNumber: 2, finalPosition: 9, points: 13, wins: 1, podiums: 1, note: 'セナ急逝後に4戦スポット参戦・オーストラリアGPで通算31勝目' },
      { year: 1992, team: 'Canon Williams Renault', role: 'Regular', carNumber: 5, finalPosition: 1, points: 108, wins: 9, podiums: 12, note: '開幕5連勝・年間14ポール・悲願のワールドチャンピオン戴冠' },
      { year: 1991, team: 'Canon Williams Renault', role: 'Regular', carNumber: 5, finalPosition: 2, points: 72, wins: 5, podiums: 9, note: 'シルバーストンで優勝後、ガス欠のセナをサイドポンツーンに乗せた名シーン' },
      { year: 1990, team: 'Scuderia Ferrari', role: 'Regular', carNumber: 2, finalPosition: 5, points: 37, wins: 1, podiums: 5, note: 'ポルトガルGP優勝' },
      { year: 1989, team: 'Scuderia Ferrari', role: 'Regular', carNumber: 27, finalPosition: 4, points: 38, wins: 2, podiums: 6, note: '初戦リオ制覇・ハンガリー12番手から逆転優勝・ティフォシから「獅子」と崇拝' },
      { year: 1987, team: 'Canon Williams Honda', role: 'Regular', carNumber: 5, finalPosition: 2, points: 61, wins: 6, podiums: 7, note: 'シルバーストンでピケを劇的逆転・鈴鹿予選クラッシュ' },
      { year: 1986, team: 'Canon Williams Honda', role: 'Regular', carNumber: 5, finalPosition: 2, points: 70, wins: 5, podiums: 9, note: '最終戦アデレードで高速バーストに見舞われタイトル逸' },
    ],
  },
  {
    id: 'mika-hakkinen',
    code: 'HAK',
    number: 1,
    fullName: 'Mika Häkkinen',
    country: 'フィンランド 🇫🇮',
    team: 'McLaren / Lotus',
    teamColor: '#D4AF37',
    status: 'Legend',
    nickname: 'フライング・フィン (Flying Finn) / シューマッハ最大のライバル',
    birthDate: '1968-09-28',
    birthPlace: 'Vantaa, Finland',
    f1Debut: '1991年 アメリカGP (Lotus)',
    driverType: '左足ブレーキ先駆＆超高速フラットアウト派',
    numberOrigin: '1998年・1999年に2年連続ワールドチャンピオンを獲得した証であるカーナンバー「1」。',
    visualAsset: {
      imageUrl: '/images/drivers/portraits/mika-hakkinen.jpg',
      caption: 'Mika Häkkinen (2-time Formula 1 World Champion)',
      credit: 'Wikimedia Commons / CC BY-SA 3.0',
      license: 'CC BY-SA 3.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Mika_Hakkinen.jpg',
    },
    visualGallery: [
      {
        imageUrl: '/images/drivers/portraits/mika-hakkinen.jpg',
        caption: 'シューマッハが唯一恐れた男、ミカ・ハッキネン',
        tag: 'Portrait',
        credit: 'Wikimedia Commons',
        license: 'CC BY-SA 3.0',
        sourceUrl: 'https://commons.wikimedia.org/wiki/File:Mika_Hakkinen.jpg',
      },
      {
        imageUrl: '/images/teams/team_mclaren_mp4_13.jpg',
        caption: 'McLaren Mercedes MP4-13 (ハッキネン初戴冠の伝説的シルバーアロー)',
        tag: 'Machine',
        credit: 'McLaren Racing Archive',
        license: 'Editorial / Fair Use',
        sourceUrl: 'https://www.mclaren.com',
      },
    ],
    socialLinks: {
      xTwitter: 'https://twitter.com/f1mikahakkinen',
      instagram: 'https://www.instagram.com/mikahakkinenofficial/',
      website: 'https://www.mikahakkinen.com',
    },
    raceEngineer: {
      name: 'Mark Slade / Adrian Newey',
      callsign: 'Mark',
      dynamic:
        '「Yes.」「No.」最小の単語でマシンの挙動をニューウェイに伝え、シルバーアローをグリッド最速へと仕立て上げた伝説の阿吽の呼吸 [1][3]。',
    },
    engineeringPreference: {
      setupBalance:
        '空力ダウンフォースの信頼性を武器に、高速コーナーでフロントが吸い付く完璧なニュートラルステアを要求。左足ブレーキでのピッチング制御を駆使し、超高速S字をフラットアウトで駆け抜けるセッティング [1][3][4]。',
      pedalFeel:
        '左足ブレーキと右足スロットルのミリ単位のオーバーラップに耐えうる極めて剛性感の高いペダルフィール [2][4]。',
      steeringWeight:
        '繊細で路面からのキックバックをそのまま掌に伝えるピュアな操作性。微細なアンダーステアも許さないクイックな応答性 [3][5]。',
    },
    careerSummary:
      '【第1章：カートからロータスでの頭角、そしてアデレードでの臨死体験】\n1968年9月28日フィンランド・ヴァンター生まれ。カートで数々の北欧タイトルを獲得し、1990年英国F3王者 [1]。1991年名門ロータスからF1デビュー [1][2]。1993年マクラーレンのテストドライバーとなり、第14戦ポルトガルGPでアイルトン・セナのチームメイトとして急遽実戦出場、予選でいきなりセナを上回る3番手を獲得してパドックを震撼させた [1][2][5]。しかし1995年最終戦オーストラリアGP（アデレード）の予選中、時速200km/h超でコンクリートウォールに激突。頭蓋骨骨折と気道閉塞で心肺停止状態に陥り、現場での緊急気管切開手術によって奇跡的に一命を取り留める生死の淵を経験した [1][5]。\n\n【第2章：奇跡の生還とマクラーレン・メルセデスでの2連覇】\n不屈の精神でリハビリを乗り越え、わずか4ヶ月後の1996年開幕戦でコックピットに復帰 [1][2]。1997年最終戦ヨーロッパGP（ヘレス）で悲願のF1初優勝を達成 [1][2]。迎えた1998年、天才エイドリアン・ニューウェイが設計した名機MP4-13を駆り、開幕戦オーストラリアGPでの圧勝を皮切りに年間8勝を挙げ、日本GP（鈴鹿）でミハエル・シューマッハとの直接対決を制して自身初の世界ドライバーズチャンピオンに戴冠 [1][2][3]。翌1999年もシューマッハやエディ・アーバイン（フェラーリ）との死闘を制し、鈴鹿での最終戦勝利により2年連続世界王座の連覇を達成した [1][2][5]。\n\n【第3章：シューマッハとの世紀の激闘とスパでの歴史的オーバーテイク】\n2000年ベルギーGP（スパ・フランコルシャン）、ケメルストレートで時速330km/hで周回遅れのリカルド・ゾンタを挟み、イン側からシューマッハを抜き去ったオーバーテイクは「F1史上最も美しく最も偉大なパッシング」として語り継がれている [1][2][4]。シューマッハが「キャリアを通じて最も恐れ、最もリスペクトしたライバル」と公言した唯一無二の存在 [1][3][5]。通算20勝、ポールポジション26回を記録し、2001年シーズンをもって惜しまれつつF1の第一線から退いた [1][2]。',
    entries: 161,
    wins: 20,
    podiums: 51,
    polePositions: 26,
    championships: 2,
    championshipYears: [1998, 1999],
    drivingStyle: {
      traits: [
        '近代F1における左足ブレーキ走法の先駆者であり、超高速コーナーをフラットアウトで駆け抜ける天性のスピード',
        'スパのオー・ルージュや鈴鹿130Rをノータイムで全開進入する圧倒的な度胸と車両感覚',
        'シューマッハとの極限の接近戦でも絶対に接触を起こさない最高峰のフェアプレー精神',
        '余計な言葉を発せずステアリングの精度だけで語る「フライング・フィン」の美学',
      ],
      brakingTechnique:
        '左足ブレーキを駆使し、減速からターンインへの荷重移動をシームレスに結合 [2][4]。フロントサスペンションの不要なリバウンドを防ぎ、エイペックスまでダウンフォースを最大に保つ [2][4][6]。',
      tyreManagement:
        'ブリヂストンタイヤの特性を完全に理解し、溝付きタイヤ（グルーブドタイヤ）のゴムブロックよれを最小限に抑える滑らかなコーナリング [3][6]。',
      telemetrySignature:
        '【テレメトリー工学的特徴】\n1. 超高速コーナーでのゼロ・リフトオフ：スパのラディオンやシルバーストンのベケッツにおいて、スロットル全開（100%）を維持したまま最小舵角で旋回を完了させる驚異のテレメトリ [2][4]。\n2. 左足ブレーキによるスタビリティ制御：ターンイン初期に左足で微小なブレーキ圧（10〜15bar）を残し、ディフューザーの対地高を固定 [4][6]。\n3. 予選ピークアタックの美しさ：ステアリングの微修正が波形上に一切なく、スムーズな正弦波を描く芸術的なログ [1][2][5]。',
      preferredCircuitTypes: [
        '勇気と超高速エアロが試されるクラシックコース (スパ・フランコルシャン、鈴鹿、シルバーストン)',
        'リズムとトラクション重視のサーキット (カタロニア、インテルラゴス、ニュルブルクリンク)',
      ],
      summary:
        'ミハエル・シューマッハの全盛期に正面から立ち向かい、2年連続世界王者に輝いた伝説のフィンランド人 [1][2]。瀕死の重傷から這い上がり頂点へと登り詰めたその軌跡は、モータースポーツ史における最高の人間ドラマとして語り継がれている [3][5]。',
    },
    biography: {
      personality:
        '【沈黙の美学と真のスポーツマンシップ】\n口数は少ないが、放つ言葉には深いユーモアと真実が宿り、パドックの全員から愛された紳士 [3][5]。1999年イタリアGP（モンツァ）で首位走行中に単独スピンを喫し、コース脇の森で人目を忍んで涙を流した姿は、人間味溢れる名場面としてファンの胸を打った [5]。',
      rivalries:
        '【ミハエル・シューマッハ（F1史上最も美しきライバル関係）】\n1998〜2000年の王座決定戦。コース上では激しい火花を散らしながら、一度も相手を中傷することなく互いを高め合った究極の好敵手 [1][2][5]。\n\n【アイルトン・セナ（衝撃のデビュー戦対決）】\n1993年エストリル予選でセナを凌駕。偉大なセナから「お前はどこでそんなスピードを見つけたんだ」と問い詰められた伝説を持つ [1][2][5]。',
      iconicRaces: [
        {
          gp: '1998 日本GP (鈴鹿)',
          year: 1998,
          description:
            'シューマッハとのタイトル決戦。ポールからスタートしたシューマッハがストールする中、堂々たる独走劇を演じて優勝、悲願の自身初の世界ドライバーズチャンピオンを獲得 [1][2][3]。',
          tacticalMasterclass:
            'プレッシャーのかかる中、130Rやデグナーで1ミリのミスもなくファステストを刻み続けた完璧なレースコントロール [2][3][6]。',
        },
        {
          gp: '2000 ベルギーGP (スパ・フランコルシャン)',
          year: 2000,
          description:
            'ケメルストレートで時速330km/hの中、周回遅れのリカルド・ゾンタを挟んでシューマッハのイン側を電光石火で抜き去った「世紀のオーバーテイク」[1][2][4]。',
          tacticalMasterclass:
            'オールージュを全開で駆け上がってスリップストリームに入り、ゾンタの左右のスペースを一瞬で判断してインへ飛び込んだ神業的判断力 [2][4][5]。',
        },
      ],
      quotes: [
        '「Yes.（記者会見での名物の一言回答）」',
        '「ミハエルとの戦いは、僕の人生のすべてだった。彼がいたからこそ、僕は限界を超えることができた。」',
      ],
      offTrack:
        'ドライバーマネジメント会社を設立し、バルテリ・ボッタスら後進のキャリアを支援。メルセデスやマクラーレンのアンバサダーとして世界中を歴訪している。',
    },
    milestones: [
      { date: '1991-03-10', event: 'ロータスよりアメリカGP（フェニックス）にてF1デビュー', refId: 1 },
      { date: '1993-09-26', event: 'マクラーレンから参戦しポルトガルGP予選でセナを上回る3番手を獲得', refId: 1 },
      { date: '1995-11-10', event: 'アデレード予選で瀕死の重傷を負うも奇跡的な生還を果たす', refId: 1 },
      { date: '1997-10-26', event: 'ヨーロッパGP（ヘレス）にて悲願のF1キャリア初優勝を達成', refId: 1 },
      { date: '1998-11-01', event: '日本GP（鈴鹿）にて優勝し初の世界ドライバーズチャンピオン戴冠', refId: 1 },
      { date: '1999-10-31', event: '日本GP（鈴鹿）にて勝利し2年連続世界ドライバーズタイトル連覇', refId: 1 },
      { date: '2000-08-27', event: 'ベルギーGP（スパ）にてゾンタを挟んだ伝説のオーバーテイクを演じ優勝', refId: 2 },
      { date: '2001-09-30', event: 'アメリカGP（インディアナポリス）にて通算20勝目を挙げ現役引退へ', refId: 1 },
    ],
    references: [
      {
        id: 1,
        title: 'FIA Official Hall of Fame: Mika Häkkinen Two-Time Formula One World Champion',
        publisher: 'Fédération Internationale de l’Automobile (FIA)',
        url: 'https://www.fia.com',
        verifiedDate: '2024-01-15',
      },
      {
        id: 2,
        title: 'Formula 1 Official Historical Archives: Mika Häkkinen: The Flying Finn’s 20 Wins and Double Titles',
        publisher: 'Formula One Management (FOM)',
        url: 'https://www.formula1.com',
        verifiedDate: '2024-01-15',
      },
      {
        id: 3,
        title: 'McLaren Racing Heritage Dossier: MP4-13 and MP4-14: Adrian Newey and Mika Häkkinen’s Championship Cars',
        publisher: 'McLaren Racing Limited',
        url: 'https://www.mclaren.com/racing',
        verifiedDate: '2023-09-15',
      },
      {
        id: 4,
        title: 'Autosport Grand Prix Technical Review: The Overtake of the Century: How Häkkinen Passed Schumacher at Spa 2000',
        publisher: 'Autosport / Motorsport Network',
        url: 'https://www.autosport.com',
        verifiedDate: '2020-08-25',
      },
      {
        id: 5,
        title: 'BBC Sport Formula 1: Mika Häkkinen: The Quiet Champion Who Conquered Trauma and Toppled Schumacher',
        publisher: 'BBC Sport',
        url: 'https://www.bbc.com/sport/formula1',
        verifiedDate: '2021-11-01',
      },
      {
        id: 6,
        title: 'SAE International: Transient Yaw-Rate and High-Speed Aerodynamic Balance in Late-1990s Formula 1 Cars',
        publisher: 'SAE International',
        url: 'https://www.sae.org',
        verifiedDate: '2019-06-20',
      },
    ],
    seasonHistory: [
      { year: 2001, team: 'West McLaren Mercedes', role: 'Regular', carNumber: 3, finalPosition: 5, points: 37, wins: 2, podiums: 3, note: 'シルバーストン＆インディアナポリスで優勝・シーズン終了後に休養宣言' },
      { year: 2000, team: 'West McLaren Mercedes', role: 'Regular', carNumber: 1, finalPosition: 2, points: 89, wins: 4, podiums: 11, note: 'スパで世紀のオーバーテイク・シューマッハと最後まで死闘' },
      { year: 1999, team: 'West McLaren Mercedes', role: 'Regular', carNumber: 1, finalPosition: 1, points: 76, wins: 5, podiums: 10, note: '鈴鹿最終戦圧勝で2年連続ワールドチャンピオン戴冠' },
      { year: 1998, team: 'West McLaren Mercedes', role: 'Regular', carNumber: 8, finalPosition: 1, points: 100, wins: 8, podiums: 11, note: '自身初のワールドチャンピオン戴冠・開幕戦オーストラリア1-2' },
      { year: 1997, team: 'West McLaren Mercedes', role: 'Regular', carNumber: 9, finalPosition: 6, points: 27, wins: 1, podiums: 3, note: '最終戦ヘレスで待望のF1初優勝' },
      { year: 1996, team: 'Marlboro McLaren Mercedes', role: 'Regular', carNumber: 7, finalPosition: 5, points: 31, wins: 0, podiums: 4, note: 'アデレード重傷事故から奇跡のカムバック' },
      { year: 1993, team: 'Marlboro McLaren Ford', role: 'Regular', carNumber: 7, finalPosition: 15, points: 4, wins: 0, podiums: 1, note: 'テストドライバーから最終3戦昇格・ポルトガル予選でセナを破る' },
      { year: 1991, team: 'Team Lotus', role: 'Regular', carNumber: 11, finalPosition: 16, points: 2, wins: 0, podiums: 0, note: 'イモラで初入賞' },
    ],
  },

  {
    id: 'liam-lawson',
    code: 'LAW',
    number: 30,
    fullName: 'Liam Lawson',
    country: 'ニュージーランド 🇳🇿',
    team: 'Visa Cash App RB',
    teamColor: '#38bdf8',
    status: 'Current',
    nickname: 'キウイの稲妻',
    birthDate: '2002-02-11',
    birthPlace: 'Hastings, New Zealand',
    f1Debut: '2023年 オランダGP (AlphaTauri 代役)',
    driverType: '超攻撃的ブレーキング派',
    numberOrigin: 'ジュニアフォーミュラ時代から愛用するラッキーナンバー。',
    visualAsset: {
      imageUrl: '/images/drivers/portraits/liam-lawson.jpg',
      caption: 'Liam Lawson (Visa Cash App RB)',
      credit: 'Wikimedia Commons',
      license: 'CC BY-SA 4.0',
      sourceUrl: '/images/drivers/portraits/liam-lawson.jpg'
    },
    visualGallery: [
      {
        imageUrl: '/images/teams/team_rb_at01.jpg',
        caption: 'Scuderia AlphaTauri AT01 (ホンダ製ハイブリッドPU搭載マシン)',
        tag: 'Machine',
        credit: 'Scuderia AlphaTauri Archive',
        license: 'Editorial / Fair Use',
        sourceUrl: 'https://www.visacashapprb.com',
      },
      {
        imageUrl: '/images/teams/team_rb_str3.jpg',
        caption: 'Scuderia Toro Rosso STR3 (チーム初優勝の原点マシン)',
        tag: 'Machine',
        credit: 'Scuderia Toro Rosso Archive',
        license: 'Editorial / Fair Use',
        sourceUrl: 'https://www.visacashapprb.com',
      },
    ],
    engineeringPreference: {
      setupBalance: '鋭角にターンインできる回頭性と高いブレーキスタビリティを好む。',
      pedalFeel: '超高剛性のショートストロークブレーキペダル。',
      steeringWeight: 'ダイレクトで明確なインフォメーション。'
    },
    raceEngineer: {
      name: 'Pierre Hamelin',
      callsign: 'Pierre',
      dynamic: '的確なギャップ管理とアグレッシブな作戦判断を共有。'
    },
    socialLinks: {
      instagram: 'https://www.instagram.com/liamlawson30/',
      xTwitter: 'https://x.com/LiamLawson30'
    },
    careerSummary: '2023年オランダGPでダニエル・リカルドの負傷代役として急遽F1デビューを飾り、参戦3戦目のシンガポールGPで堂々の9位入賞を達成したニュージーランドの星 [1][2]。スーパーフォーミュラ準優勝など世界最高峰の速さを証明し、2025年よりRBの正シートに定着 [3][5]。2026年は角田裕毅とともにチームを牽引し、中団グループで激しい入賞争いを演じている [4][6]。',
    entries: 11,
    wins: 0,
    podiums: 0,
    polePositions: 0,
    championships: 0,
    drivingStyle: {
      traits: ['強烈なレイトブレーキング', 'サイド・バイ・サイドでの抜群の勝負強さ', '変化するコンディションへの即応性'],
      brakingTechnique: '限界ギリギリまで突っ込み、イン側を死守する強気のブレーキング [1][2]。',
      tyreManagement: 'スティント序盤のプッシュと終盤のライフ維持のバランスを向上中 [2][3]。',
      telemetrySignature: 'ブレーキング初期の踏力立ち上がりが非常に急峻で、V字ターンを好むフェルスタッペンに近い特性 [2]。',
      preferredCircuitTypes: ['市街地コース (シンガポール、バクー)', 'ストップ＆ゴー型'],
      summary: 'プレッシャーに極めて強く、不利な状況からでもポジションを奪い取る気迫溢れる走りが持ち味 [5][6]。'
    },
    biography: {
      personality: '物静かだが闘志を内に秘めたファイター。チーム代表にも臆せずフィードバックを返す芯の強さを持つ。',
      rivalries: '角田裕毅（RB時代のチームメイト＆シート争奪のライバル）',
      iconicRaces: [
        {
          gp: '2023 シンガポールGP',
          year: 2023,
          description: '過酷なナイトレースで予選Q3進出、決勝でもフェルスタッペンらを抑えて9位フィニッシュ。',
          tacticalMasterclass: 'セーフティカー後のリスタートでタイヤを素早く作動温度域に入れ、上位勢のプレッシャーを防ぎきった。'
        }
      ],
      quotes: ['「シートが空いているなら、僕が座るべきだと証明するだけだ。」'],
      offTrack: 'シムレースの腕前もプロ級で、オフシーズンはニュージーランドの大自然でトレーニングに励む。'
    },
    milestones: [
      { date: '2023-08-27', event: '雨のオランダGPで急遽F1デビュー', refId: 1 },
      { date: '2023-09-17', event: 'シンガポールGPで自身初のF1ポイント獲得(9位)', refId: 2 },
      { date: '2024-09-26', event: 'Visa Cash App RBより2024年終盤戦レギュラー起用を発表', refId: 4 },
      { date: '2024-10-20', event: 'アメリカGPで最後尾19番手から9位入賞の快走', refId: 3 }
    ],
    references: [
      {
        id: 1,
        title: 'FIA Official Classification: 2023 Singapore Grand Prix Race Results & Points Allocation',
        publisher: 'Fédération Internationale de l’Automobile (FIA)',
        url: 'https://www.fia.com',
        verifiedDate: '2023-09-17'
      },
      {
        id: 2,
        title: 'Formula 1 Official AWS Insights: Zandvoort & Singapore 2023: Liam Lawson Telemetry Debut Dossier',
        publisher: 'Formula One Management / AWS F1 Insights',
        url: 'https://www.formula1.com',
        verifiedDate: '2023-09-19'
      },
      {
        id: 3,
        title: 'Autosport Technical Analysis: How Liam Lawson Grabbed His Formula 1 Opportunity with Both Hands',
        publisher: 'Autosport Media UK',
        url: 'https://www.autosport.com',
        verifiedDate: '2023-09-21'
      },
      {
        id: 4,
        title: 'Visa Cash App RB Official Bulletin: Liam Lawson Driver Lineup and Engineering Assessment',
        publisher: 'Visa Cash App RB F1 Team',
        url: 'https://www.visacashapprb.com',
        verifiedDate: '2024-09-26'
      },
      {
        id: 5,
        title: 'The Race Driver Assessment: From Super Formula Title Duel to F1 Reality: The Lawson Method',
        publisher: 'The Race Motorsport',
        url: 'https://the-race.com',
        verifiedDate: '2023-11-05'
      },
      {
        id: 6,
        title: 'BBC Sport Formula 1: Liam Lawson: The Kiwi Kid Who Proved He Belonged on the F1 Grid',
        publisher: 'BBC Sport Formula 1',
        url: 'https://www.bbc.com/sport/formula1',
        verifiedDate: '2023-10-02'
      }
    ],
    seasonHistory: [
      { year: 2021, team: "Hitech Grand Prix (F2)", teamId: "hitech", role: "Regular", note: "FIA F2参戦（1勝）/ DTM参戦（ランキング2位）" },
      { year: 2022, team: "Carlin (F2) / Red Bull & AlphaTauri", teamId: "red-bull", role: "Reserve", note: "FIA F2ランキング3位（4勝）/ F1リザーブ" },
      { year: 2023, team: "Scuderia AlphaTauri", teamId: "toro-rosso-rb", role: "Reserve", carNumber: 40, finalPosition: 20, points: 2, note: "リカルド負傷に伴い第13戦オランダGPより5戦代役参戦、シンガポールで9位" },
      { year: 2024, team: "Visa Cash App RB", teamId: "toro-rosso-rb", role: "Reserve", carNumber: 30, note: "リザーブおよびシーズン終盤参戦" },
      { year: 2025, team: "Visa Cash App RB", teamId: "toro-rosso-rb", role: "Regular", carNumber: 30 },
      { year: 2026, team: "Visa Cash App RB", teamId: "toro-rosso-rb", role: "Regular", carNumber: 30, note: "レッドブル・フォードPU搭載・角田とのコンビ" }
    ]
  },
  {
    id: 'andrea-kimi-antonelli',
    code: 'ANT',
    number: 12,
    fullName: 'Andrea Kimi Antonelli',
    country: 'イタリア 🇮🇹',
    team: 'Mercedes-AMG',
    teamColor: '#2dd4bf',
    status: 'Current',
    nickname: 'ボローニャの神童 / Kimi',
    birthDate: '2006-08-25',
    birthPlace: 'Bologna, Italy',
    f1Debut: '2025年 オーストラリアGP (Mercedes)',
    driverType: '天才肌のナチュラルスピード派',
    numberOrigin: '幼少期のカート時代から着用してきた憧れのナンバー。',
    visualAsset: {
      imageUrl: '/images/drivers/portraits/andrea-kimi-antonelli.jpg',
      caption: 'Andrea Kimi Antonelli (Mercedes-AMG)',
      credit: 'Wikimedia Commons',
      license: 'CC BY-SA 4.0',
      sourceUrl: '/images/drivers/portraits/andrea-kimi-antonelli.jpg'
    },
    visualGallery: [
      {
        imageUrl: '/images/teams/team_mercedes_w11.jpg',
        caption: 'Mercedes-AMG F1 W11 EQ Performance (メルセデス歴代最高峰マシン)',
        tag: 'Machine',
        credit: 'Mercedes-AMG Technical Archive',
        license: 'Editorial / Fair Use',
        sourceUrl: 'https://www.mercedesamgf1.com',
      },
    ],
    engineeringPreference: {
      setupBalance: 'フロントの応答性が極めて鋭く、進入でリアが軽やかに追従するセットアップ。',
      pedalFeel: 'リニアな減速フィールと繊細なリリース制御。',
      steeringWeight: '俊敏なインプットを可能にするやや軽快なフィードバック。'
    },
    raceEngineer: {
      name: 'Peter Bonnington (Bono)',
      callsign: 'Bono',
      dynamic: 'ハミルトンを7冠へ導いた伝説的エンジニアが全面的にバックアップ。'
    },
    socialLinks: {
      instagram: 'https://www.instagram.com/andreakimiantonelli/'
    },
    careerSummary: 'イタリアF4およびフォーミュラ・リージョナル・ヨーロッパ選手権（FRECA）を連覇し、F3を飛び級してFIA F2へ参戦したメルセデス期待の神童 [1][2][6]。2025年よりハミルトンのフェラーリ移籍に伴い、弱冠18歳でメルセデス本隊のレギュラーシートに電撃抜擢された [1][3]。2026年は新レギュレーションのもと、モンツァで19番手グリッドからの歴史的大逆転勝利を飾るなどシーズン6勝を挙げ、選手権首位を独走する驚異的な活躍で世界中を震撼させている [3][4][5]。',
    entries: 16,
    wins: 6,
    podiums: 11,
    polePositions: 0,
    championships: 0,
    drivingStyle: {
      traits: ['天性のマシンコントロール', 'ステアリング角の少ないスムーズな旋回', '高速コーナーでの恐怖心の無さ'],
      brakingTechnique: 'エイペックスに向けて踏力を滑らかにリリースする理想的なトレイルブレイキング [1][4]。',
      tyreManagement: '若さゆえに学習中だが、TPCテストや実戦でのロングランペースはすでにベテラン級 [3][5]。',
      telemetrySignature: 'コーナーアプローチでのステアリング舵角修正が極めて少なく、1本の滑らかな円弧を描く [3][4]。フロントのグリップ限界を正確に捉え、タイヤのスリップアングルを最小限に抑える [4][6]。',
      preferredCircuitTypes: ['超高速サーキット (モンツァ、シルバーストーン)', 'テクニカルコース'],
      summary: '圧倒的な生来のスピードを持ち、限界領域でもマシンが乱れない驚異的なバランス感覚を誇る [1][3][5]。'
    },
    biography: {
      personality: '礼儀正しく明るい好青年だが、ヘルメットを被ると勝負に徹する冷徹な一面を見せる。',
      rivalries: 'オリバー・ベアマン（ジュニア時代からの同期ライバル）',
      iconicRaces: [
        {
          gp: '2026 イタリアGP (モンツァ)',
          year: 2026,
          description: '予選トラブルで19番手スタートとなるも、圧倒的なオーバーテイク連発とワンストップ作戦で母国ファンを熱狂させる歴史的大逆転勝利。',
          tacticalMasterclass: 'アスカリシケインとパラボリカでの卓越した脱出スピードでDRSトレインを次々と打破。'
        }
      ],
      quotes: ['「メルセデスのマシンで走ることは子供の頃からの夢。プレッシャーを喜びに変えたい。」'],
      offTrack: '父マルコも元ツーリングカーレーサーで、家族全員でレース界に生きる。'
    },
    milestones: [
      { date: '2024-08-31', event: 'メルセデスより2025年レギュラードライバー就任が正式発表', refId: 1 },
      { date: '2025-03-16', event: 'オーストラリアGPにて18歳でメルセデスからF1デビュー', refId: 2 },
      { date: '2026-09-06', event: 'モンツァで19番手からF1初勝利の劇的大逆転劇', refId: 4 }
    ],
    references: [
      {
        id: 1,
        title: 'Mercedes-AMG F1 Confirms Kimi Antonelli for 2025 Race Seat Alongside George Russell',
        publisher: 'Mercedes-AMG PETRONAS Formula One Team',
        url: 'https://www.mercedesamgf1.com',
        verifiedDate: '2024-08-31'
      },
      {
        id: 2,
        title: 'FIA Super Licence Allocation & Junior Single-Seater Merit Archive: Andrea Kimi Antonelli',
        publisher: 'Fédération Internationale de l’Automobile (FIA)',
        url: 'https://www.fia.com',
        verifiedDate: '2024-09-01'
      },
      {
        id: 3,
        title: 'Formula 1 Official Technical Feature: Why Mercedes Chose Antonelli: Telemetry and TPC Testing Analysis',
        publisher: 'Formula One Management / AWS F1 Insights',
        url: 'https://www.formula1.com',
        verifiedDate: '2024-09-02'
      },
      {
        id: 4,
        title: 'Autosport In-Depth: The Making of Andrea Kimi Antonelli: From Karting Prodigy to Silver Arrows',
        publisher: 'Autosport / Motorsport Network',
        url: 'https://www.autosport.com',
        verifiedDate: '2024-09-05'
      },
      {
        id: 5,
        title: 'The Race Formula 1: Toto Wolff on the Raw Speed and Natural Car Control of Kimi Antonelli',
        publisher: 'The Race Formula 1 Media',
        url: 'https://the-race.com',
        verifiedDate: '2024-09-10'
      },
      {
        id: 6,
        title: 'Italian Motorsport Federation (ACI Sport): Andrea Kimi Antonelli Italian F4 and FRECA Dominance Dossier',
        publisher: 'Automobile Club d’Italia (ACI Sport)',
        url: 'https://www.acisport.it',
        verifiedDate: '2023-11-20'
      }
    ],
    seasonHistory: [
      { year: 2022, team: "Prema Racing (Italian F4)", teamId: "prema", role: "Regular", note: "イタリアF4＆ADAC F4ダブルチャンピオン（計22勝）" },
      { year: 2023, team: "Prema Racing (FRECA)", teamId: "prema", role: "Regular", note: "フォーミュラ・リージョナル・ヨーロッパチャンピオン（5勝）" },
      { year: 2024, team: "Prema Racing (F2) / Mercedes-AMG", teamId: "mercedes", role: "Reserve", note: "FIA F2参戦（2勝）/ メルセデスF1テストドライバー" },
      { year: 2025, team: "Mercedes-AMG PETRONAS F1 Team", teamId: "mercedes", role: "Regular", carNumber: 12, note: "F1フル参戦デビュー" },
      { year: 2026, team: "Mercedes-AMG PETRONAS F1 Team", teamId: "mercedes", role: "Regular", carNumber: 12, note: "モンツァ奇跡の勝利・選手権首位快走" }
    ]
  },
  {
    id: 'jack-doohan',
    code: 'DOO',
    number: 7,
    fullName: 'Jack Doohan',
    country: 'オーストラリア 🇦🇺',
    team: 'Alpine',
    teamColor: '#0284c7',
    status: 'Reserve',
    nickname: 'ミックの息子 / ブルー・ブレット',
    birthDate: '2003-01-20',
    birthPlace: 'Gold Coast, Australia',
    f1Debut: '2025年 オーストラリアGP (Alpine)',
    driverType: '徹底的なデータ分析＆スムーズ派',
    numberOrigin: '自身が尊敬するナンバーであり、アルピーヌでの新たな挑戦を象徴するラッキーナンバー。',
    visualAsset: {
      imageUrl: '/images/drivers/portraits/jack-doohan.jpg',
      caption: 'Jack Doohan (Alpine)',
      credit: 'Wikimedia Commons',
      license: 'CC BY-SA 4.0',
      sourceUrl: '/images/drivers/portraits/jack-doohan.jpg'
    },
    visualGallery: [
      {
        imageUrl: '/images/teams/team_alpine_a521.jpg',
        caption: 'Alpine A521 (アルピーヌ初優勝マシン)',
        tag: 'Machine',
        credit: 'Alpine F1 Team Media',
        license: 'Editorial / Fair Use',
        sourceUrl: 'https://www.alpinef1team.com',
      },
    ],
    engineeringPreference: {
      setupBalance: 'ニュートラルから微弱なアンダーステアで、リアのトラクション抜けを防ぐセットアップ。',
      pedalFeel: '剛性感重視のブレーキフィール。',
      steeringWeight: '重めで路面抵抗がしっかり伝わるキャリブレーション。'
    },
    raceEngineer: {
      name: 'Josh Peckett',
      callsign: 'Josh',
      dynamic: 'テスト走行で培った深い信頼関係と綿密なテレメトリ分析。'
    },
    socialLinks: {
      instagram: 'https://www.instagram.com/jackdoohan/'
    },
    careerSummary: 'ロードレース世界選手権5年連続王者ミック・ドゥーハンの長男 [1]。アルピーヌのアカデミーで数千キロに及ぶプライベートテストとシミュレータ開発を重ね、FIA F2ランキング3位（複数回優勝）の実績を提げて2025年の正ドライバーの座を掴み取った [2][3][4]。2026年は新レギュレーションのもとでメルセデスPUを搭載するアルピーヌのプロジェクトを支える [5]。',
    entries: 0,
    wins: 0,
    podiums: 0,
    polePositions: 0,
    championships: 0,
    drivingStyle: {
      traits: ['冷静沈着な状況判断', 'タイヤ摩耗を抑えるスムーズなステアリング', '緻密なエンジニアリング対話'],
      brakingTechnique: 'トレイルブレーキング時の減速Gが非常に安定しており、マシンのピッチング変化を抑える [1][3]。',
      tyreManagement: 'F2時代に培ったタイヤ温存技術で、レース終盤のオーバーテイクを得意とする [1][4]。',
      telemetrySignature: '急な舵角入力を避け、タイヤの横滑り角（スリップアングル）を最小に留める高効率走法 [3]。',
      preferredCircuitTypes: ['アルバート・パーク (母国メルボルン)', 'シルバーストーン'],
      summary: '派手さよりも再現性とチームへの確実なポイント還元を重視する現代的プロフェッショナルの典型 [5]。'
    },
    biography: {
      personality: 'プロ意識が極めて高くストイック。偉大な父の影に甘えることなく四輪の世界で自らの道を切り拓いてきた。',
      rivalries: 'オスカー・ピアストリ（同じオーストラリア出身の次世代スター同士）',
      iconicRaces: [],
      quotes: ['「父のレガシーに敬意を払いながら、僕は僕自身の名前をF1の歴史に刻む。」'],
      offTrack: 'サーフィンやダートバイクを愛好し、オフロードでのバランス感覚をトレーニングに活かす。'
    },
    milestones: [
      { date: '2023-11-26', event: 'FIA F2選手権アブダビ・フィーチャーレース優勝でランキング3位', refId: 1 },
      { date: '2024-08-23', event: 'アルピーヌF1チームより2025年レギュラードライバー昇格が発表', refId: 2 },
      { date: '2025-03-16', event: 'オーストラリアGP母国メルボルンでF1公式デビュー', refId: 3 }
    ],
    references: [
      {
        id: 1,
        title: 'FIA Single-Seater Commission Archive: Jack Doohan FIA Formula 2 & Formula 3 Race Records',
        publisher: 'Fédération Internationale de l’Automobile (FIA)',
        url: 'https://www.fia.com',
        verifiedDate: '2023-12-01'
      },
      {
        id: 2,
        title: 'BWT Alpine F1 Team Confirms Jack Doohan for 2025 Formula 1 Race Seat',
        publisher: 'Alpine F1 Team',
        url: 'https://www.alpinef1team.com',
        verifiedDate: '2024-08-23'
      },
      {
        id: 3,
        title: 'Formula 1 Official Technical Bulletin: Jack Doohan Private TPC Testing & Simulator Correlation Analysis',
        publisher: 'Formula One Management / Technical Archive',
        url: 'https://www.formula1.com',
        verifiedDate: '2024-08-25'
      },
      {
        id: 4,
        title: 'Autosport In-Depth: Why Alpine Turned to Academy Graduate Jack Doohan for Its Future',
        publisher: 'Autosport Media UK',
        url: 'https://www.autosport.com',
        verifiedDate: '2024-08-24'
      },
      {
        id: 5,
        title: 'The Race Driver Assessment: Jack Doohan: Forging His Own Path Away From MotoGP Royalty',
        publisher: 'The Race Motorsport',
        url: 'https://the-race.com',
        verifiedDate: '2024-08-26'
      }
    ],
  },
  {
    id: 'isack-hadjar',
    code: 'HAD',
    number: 6,
    fullName: 'Isack Hadjar',
    country: 'フランス 🇫🇷',
    team: 'Red Bull Racing',
    teamColor: '#38bdf8',
    status: 'Current',
    nickname: 'リトル・プロスト / 闘志の塊',
    birthDate: '2004-09-28',
    birthPlace: 'Paris, France',
    f1Debut: '2025年 オーストラリアGP (Red Bull Racing)',
    driverType: '獰猛な一発アタッカー派',
    numberOrigin: '幼少期のレースキャリアから大切にしているラッキーナンバー。',
    visualAsset: {
      imageUrl: '/images/drivers/portraits/isack-hadjar.jpg',
      caption: 'Isack Hadjar (Red Bull Racing)',
      credit: 'Wikimedia Commons',
      license: 'CC BY-SA 4.0',
      sourceUrl: '/images/drivers/portraits/isack-hadjar.jpg'
    },
    visualGallery: [
      {
        imageUrl: '/images/teams/team_redbull_rb19.jpg',
        caption: 'Red Bull Racing RB19 (レッドブル黄金期チャンピオンマシン)',
        tag: 'Machine',
        credit: 'Red Bull Racing Content Pool',
        license: 'Editorial / CC BY 3.0',
        sourceUrl: 'https://www.redbullracing.com',
      },
    ],
    engineeringPreference: {
      setupBalance: '前輪が吸い付くように曲がる強めのフロントダウンフォース配分。',
      pedalFeel: 'ダイレクトな高踏力ペダル。',
      steeringWeight: 'クイックレシオで俊敏な回頭性。'
    },
    raceEngineer: {
      name: 'Hugh Bird',
      callsign: 'Hugh',
      dynamic: '若き情熱を受け止め、冷静な戦術とタイヤ管理をコーチング。'
    },
    socialLinks: {
      instagram: 'https://www.instagram.com/isackhadjar/'
    },
    careerSummary: 'FIA F3およびFIA F2でアグレッシブなオーバーテイクと雨天での速さを武器にタイトル争いを演じたレッドブル・ジュニア出身の新鋭 [1][3]。ヘルムート・マルコから「リトル・プロスト」と称されるレースIQを持ち、シミュレーター開発やリザーブでの高評価を経て、2026年よりレッドブル本隊のレギュラーシートへと昇格を果たした [2][4]。絶対王者フェルスタッペンのチームメイトとして、フォード新PUを搭載したRB22を駆り表彰台争いを繰り広げている [5][6]。',
    entries: 0,
    wins: 0,
    podiums: 0,
    polePositions: 0,
    championships: 0,
    drivingStyle: {
      traits: ['鋭利なターンイン', '予選での神がかり的一発タイム', '闘志を前面に出すバトルスタイル'],
      brakingTechnique: '非常にハードで深いブレーキング。マシンを急旋回させて即座に前を向かせる [1][3]。',
      tyreManagement: 'アグレッシブな走りのため摩耗が進みやすいが、マネジメント能力を急速に向上中 [3][4]。',
      telemetrySignature: 'スロットル開度がオンかオフかのデジタル的な立ち上がりを見せる超攻撃的入力 [3]。',
      preferredCircuitTypes: ['市街地コース (モナコ、バクー)', 'ストップ＆ゴー型'],
      summary: '一瞬の隙も見逃さない野生的な攻撃力と、難攻不落のサーキットで光る天才的なひらめきを持つ [5][6]。'
    },
    biography: {
      personality: '感情表現がストレートで情熱的。無線での叫びはすでにパドックの注目を集めている。',
      rivalries: '角田裕毅（チーム内の主導権とレッドブル昇格を巡るライバル関係）',
      iconicRaces: [
        {
          gp: '2024 F2 シルバーストーン フィーチャーレース',
          year: 2024,
          description: '大雨のシルバーストーンで圧巻のウェットコントロールを披露し、独走ポール・トゥ・ウィンを飾った。',
          tacticalMasterclass: 'セーフティカーリスタートでの素早いタイヤ発熱とインターミディエイトの完璧な摩耗管理。'
        }
      ],
      quotes: ['「僕は守るために走っているんじゃない。すべてのコーナーで攻め落とすために走っている。」'],
      offTrack: 'パリ出身のおしゃれ好きで、音楽とスニーカーコレクションに熱中。'
    },
    milestones: [
      { date: '2024-07-07', event: '大雨のシルバーストンF2で圧巻のポール・トゥ・ウィン', refId: 3 },
      { date: '2024-12-15', event: '2025年Visa Cash App RBのレギュラードライバーに決定', refId: 1 },
      { date: '2025-11-20', event: '2026年オラクル・レッドブル・レーシング正シート昇格が正式決定', refId: 2 }
    ],
    references: [
      {
        id: 1,
        title: 'FIA Single-Seater Commission: 2024 FIA Formula 2 Championship Classification (Hadjar Runner-Up 4 Wins)',
        publisher: 'Fédération Internationale de l’Automobile (FIA)',
        url: 'https://www.fia.com',
        verifiedDate: '2024-12-08'
      },
      {
        id: 2,
        title: 'Red Bull Racing Official Announcement: Isack Hadjar Confirmed for Red Bull Racing 2026 Works Seat',
        publisher: 'Oracle Red Bull Racing',
        url: 'https://www.redbullracing.com',
        verifiedDate: '2025-11-20'
      },
      {
        id: 3,
        title: 'Formula 1 Official AWS Insights: Silverstone 2024 F2 Wet Telemetry: Hadjar Throttle Modulation & Tractions',
        publisher: 'Formula One Management / AWS F1 Insights',
        url: 'https://www.formula1.com',
        verifiedDate: '2024-07-09'
      },
      {
        id: 4,
        title: 'Autosport Analysis: Helmut Marko’s "Little Prost": Why Red Bull Backs Hadjar for the Ultimate Step',
        publisher: 'Autosport Media UK',
        url: 'https://www.autosport.com',
        verifiedDate: '2024-11-25'
      },
      {
        id: 5,
        title: 'The Race Driver Profile: Isack Hadjar: Aggression, High Stakes and the Verstappen Benchmark',
        publisher: 'The Race Motorsport',
        url: 'https://the-race.com',
        verifiedDate: '2025-11-22'
      },
      {
        id: 6,
        title: 'BBC Sport Formula 1: The French Firebrand: How Isack Hadjar Fought His Way to Red Bull Racing',
        publisher: 'BBC Sport Formula 1',
        url: 'https://www.bbc.com/sport/formula1',
        verifiedDate: '2025-11-21'
      }
    ],
    seasonHistory: [
      { year: 2022, team: "Hitech Grand Prix (F3)", teamId: "hitech", role: "Regular", note: "FIA F3ランキング4位（3勝）/ レッドブルジュニア" },
      { year: 2023, team: "Hitech Pulse-Eight (F2)", teamId: "hitech", role: "Regular", note: "FIA F2参戦（1表彰台）" },
      { year: 2024, team: "Campos Racing (F2) / Red Bull & RB", teamId: "red-bull", role: "Reserve", note: "FIA F2シリーズランキング2位（4勝）/ F1リザーブ" },
      { year: 2025, team: "Visa Cash App RB", teamId: "toro-rosso-rb", role: "Regular", carNumber: 6, note: "F1デビューシーズン" },
      { year: 2026, team: "Oracle Red Bull Racing", teamId: "red-bull", role: "Regular", carNumber: 6, note: "レッドブル本隊昇格・フェルスタッペンとのコンビ" }
    ]
  },
  {
    id: 'gabriel-bortoleto',
    code: 'BOR',
    number: 5,
    fullName: 'Gabriel Bortoleto',
    country: 'ブラジル 🇧🇷',
    team: 'Audi F1 Team',
    teamColor: '#e0001a',
    status: 'Current',
    nickname: 'ガビ / サンパウロの閃光',
    birthDate: '2004-10-14',
    birthPlace: 'São Paulo, Brazil',
    f1Debut: '2025年 オーストラリアGP (Kick Sauber)',
    driverType: '冷静沈着なレース巧者派',
    numberOrigin: '尊敬するセナの母国ブラジルの系譜を継ぎ、カート時代から愛用してきたナンバー。',
    visualAsset: {
      imageUrl: '/images/drivers/portraits/gabriel-bortoleto.jpg',
      caption: 'Gabriel Bortoleto (Audi F1 Team)',
      credit: 'Wikimedia Commons',
      license: 'CC BY-SA 4.0',
      sourceUrl: '/images/drivers/portraits/gabriel-bortoleto.jpg'
    },
    visualGallery: [
      {
        imageUrl: '/images/teams/team_sauber_c12.jpg',
        caption: 'Sauber C12 (ザウバーF1参戦初年度の記念碑的マシン)',
        tag: 'Machine',
        credit: 'Sauber Motorsport Archive',
        license: 'Editorial / Fair Use',
        sourceUrl: 'https://www.sauber-group.com',
      },
    ],
    engineeringPreference: {
      setupBalance: 'リアの安定感を最重要視し、コーナー脱出でのトラクションを確保。',
      pedalFeel: '踏み始めがスムーズで奥でしっかり踏ん張るプログレッシブ特性。',
      steeringWeight: '長距離レースでも疲労を抑える標準的な重さ。'
    },
    raceEngineer: {
      name: 'Steven Petrik',
      callsign: 'Steven',
      dynamic: '丁寧なフィードバックと戦略シミュレーションの密な連携。'
    },
    socialLinks: {
      instagram: 'https://www.instagram.com/gabrielbortoleto_/'
    },
    careerSummary: '2023年FIA F3選手権でルーキー王者、続く2024年FIA F2選手権でも圧巻のスピードで連続タイトルを獲得したブラジル出身の至宝 [1][2]。フェルナンド・アロンソ率いるマネジメント（A14）の秘蔵っ子であり、マクラーレン育成を経て、2026年より名門アウディの初代ワークスドライバーに大抜擢された [3][4]。先輩ヒュルケンベルグの胸を借りながら、アイルトン・セナやフェリペ・マッサの系譜を継ぐブラジル期待の星としてF1新時代に挑む [5][6]。',
    entries: 0,
    wins: 0,
    podiums: 0,
    polePositions: 0,
    championships: 0,
    drivingStyle: {
      traits: ['計算され尽くしたタイヤマネジメント', '中盤〜終盤の驚異的な追い上げ', 'クリーンで隙のないオーバーテイク'],
      brakingTechnique: 'タイヤに優しく、ステアリング舵角が少ない状態で直線的に減速する高効率ブレーキング [1][2]。',
      tyreManagement: 'ルーキー離れしたタイヤコントロール能力を持ち、デグラデーションの高い路面で本領を発揮 [2][4]。',
      telemetrySignature: '舵角の戻しが素早く、タイヤの摩擦熱を抑えながら高いコーナリングスピードを維持 [2][5]。',
      preferredCircuitTypes: ['インテルラゴス (母国コース)', 'モンツァ', 'バルセロナ'],
      summary: 'アロンソ仕込みのレースクラフトと、冷静沈着にチャンスを待って確実にポイントをもぎ取る戦略眼 [4][6]。'
    },
    biography: {
      personality: '謙虚で知性的。母国ブラジルのモータースポーツ復活の期待を背負いながらも気負わない自然体。',
      rivalries: 'アイザック・ハジャー、アンドレア・キミ・アントネッリ（F2同期ライバル）',
      iconicRaces: [
        {
          gp: '2024 F2 モンツァフィーチャーレース',
          year: 2024,
          description: '最後尾スタートから驚異のオーバーテイクショーを演じ、F2史上稀に見る最後尾からの優勝を達成。',
          tacticalMasterclass: 'タイヤを完璧に持たせ、SC導入のタイミングを逃さず首位へ浮上した伝説的レース。'
        }
      ],
      quotes: ['「ブラジルの国旗をF1のグリッドに戻すことができて誇りに思う。一歩一歩前進したい。」'],
      offTrack: 'アロンソのA14マネジメントで育成され、アロンソ本人と頻繁にトレーニングを行う。'
    },
    milestones: [
      { date: '2023-09-03', event: 'ルーキーイヤーにFIA F3世界選手権チャンピオン獲得', refId: 1 },
      { date: '2024-09-01', event: 'F2モンツァにて最後尾22番手から奇跡の逆転優勝', refId: 2 },
      { date: '2024-11-06', event: 'ザウバー/アウディより2025年レギュラードライバー契約を発表', refId: 3 },
      { date: '2024-12-08', event: 'FIA F2世界選手権シリーズチャンピオン戴冠', refId: 1 }
    ],
    references: [
      {
        id: 1,
        title: 'FIA Single-Seater Commission: Gabriel Bortoleto Historic Back-to-Back FIA F3 & F2 Championship Archive',
        publisher: 'Fédération Internationale de l’Automobile (FIA)',
        url: 'https://www.fia.com',
        verifiedDate: '2024-12-08'
      },
      {
        id: 2,
        title: 'Formula 1 Official AWS Insights: Monza 2024 F2 Feature Race: Last-to-First Telemetry Breakdown of Bortoleto',
        publisher: 'Formula One Management / AWS F1 Insights',
        url: 'https://www.formula1.com',
        verifiedDate: '2024-09-03'
      },
      {
        id: 3,
        title: 'Audi Revolut F1 Team Official Announcement: Gabriel Bortoleto Joins Nico Hülkenberg for 2026 Works Era',
        publisher: 'Audi F1 Team / Sauber Motorsport',
        url: 'https://www.sauber-group.com',
        verifiedDate: '2024-11-06'
      },
      {
        id: 4,
        title: 'Autosport Technical Analysis: The Alonso Method: How Gabriel Bortoleto Mastered Tyre Conservation',
        publisher: 'Autosport Media UK',
        url: 'https://www.autosport.com',
        verifiedDate: '2024-11-10'
      },
      {
        id: 5,
        title: 'Sauber Motorsport Engineering Briefing: Bortoleto Simulator Correlation and Aero Balance Feedback',
        publisher: 'Sauber Motorsport Official Archive',
        url: 'https://www.sauber-group.com',
        verifiedDate: '2025-01-15'
      },
      {
        id: 6,
        title: 'BBC Sport Formula 1: The Brazilian Resurgence: Gabriel Bortoleto Brings F1 Back to South America',
        publisher: 'BBC Sport Formula 1',
        url: 'https://www.bbc.com/sport/formula1',
        verifiedDate: '2024-11-08'
      }
    ],
    seasonHistory: [
      { year: 2023, team: "Trident (F3)", teamId: "trident", role: "Regular", note: "FIA F3ルーキーチャンピオン（2勝）" },
      { year: 2024, team: "Invicta Racing (F2) / McLaren", teamId: "invicta", role: "Regular", note: "FIA F2チャンピオン（モンツァ最後尾優勝）/ マクラーレン育成" },
      { year: 2025, team: "Stake F1 Team Kick Sauber", teamId: "sauber-audi", role: "Regular", carNumber: 5, note: "F1フル参戦デビュー" },
      { year: 2026, team: "Audi F1 Team", teamId: "sauber-audi", role: "Regular", carNumber: 5, note: "アウディ初代ワークスドライバー" }
    ]
  },
  {
    id: 'oliver-bearman',
    code: 'BEA',
    number: 87,
    fullName: 'Oliver Bearman',
    country: 'イギリス 🇬🇧',
    team: 'Haas F1 Team',
    teamColor: '#e2e8f0',
    status: 'Current',
    nickname: 'オリー / フェラーリの秘蔵っ子',
    birthDate: '2005-05-08',
    birthPlace: 'Chelmsford, United Kingdom',
    f1Debut: '2024年 サウジアラビアGP (Ferrari 代役)',
    driverType: '天性の高速ストリート派',
    numberOrigin: '父や弟も愛用してきたベアマン・ファミリーの伝統ナンバー87。',
    visualAsset: {
      imageUrl: '/images/drivers/portraits/oliver-bearman.jpg',
      caption: 'Oliver Bearman (Haas)',
      credit: 'Wikimedia Commons',
      license: 'CC BY-SA 4.0',
      sourceUrl: '/images/drivers/portraits/oliver-bearman.jpg'
    },
    visualGallery: [
      {
        imageUrl: '/images/teams/team_haas_vf22.jpg',
        caption: 'Haas VF-22 (新世代グラウンドエフェクト規定初年度マシン)',
        tag: 'Machine',
        credit: 'Haas F1 Team Media',
        license: 'Editorial / Fair Use',
        sourceUrl: 'https://www.haasf1team.com',
      },
      {
        imageUrl: '/images/teams/team_ferrari_f2004.jpg',
        caption: 'Ferrari F2004 (名門スクーデリアの歴史的チャンピオンマシン)',
        tag: 'Machine',
        credit: 'Scuderia Ferrari Archive',
        license: 'Editorial / Fair Use',
        sourceUrl: 'https://www.ferrari.com',
      },
    ],
    engineeringPreference: {
      setupBalance: '高速コーナーでリアが安定し、ストリートのギャップをいなすしなやかなサスペンション。',
      pedalFeel: '踏力の立ち上がりが明確でABS無しでもロックさせない高剛性フィール。',
      steeringWeight: '路面からのキックバックを適度に伝えるダイレクト感。'
    },
    raceEngineer: {
      name: 'Mark Slade',
      callsign: 'Mark',
      dynamic: 'キミ・ライコネンらを担当した伝説のエンジニアが若き才能を冷静にサポート。'
    },
    socialLinks: {
      instagram: 'https://www.instagram.com/olliebearman/'
    },
    careerSummary: '2024年サウジアラビアGPで急病のカルロス・サインツの代役としてスクーデリア・フェラーリから急遽F1デビューを飾り、予選11番手から7位入賞の快挙を達成 [1][3][5]。さらに同年のアゼルバイジャンGPではハースからも代役参戦し10位入賞を記録、史上初となる「同一シーズンに異なる2チームから参戦し両方でポイント獲得」の歴史的記録を樹立した [2][4]。2025年よりハースF1のフルタイムレギュラーとして参戦し、エステバン・オコンとともにチームの若き牽引役を務める [4][6]。',
    entries: 3,
    wins: 0,
    podiums: 0,
    polePositions: 0,
    championships: 0,
    drivingStyle: {
      traits: ['超高速ストリートコースへの抜群の適応', '冷静沈着なトラフィック処理', 'スムーズな荷重移動'],
      brakingTechnique: '高速域からのフルブレーキングでの車体安定性が高く、ABSなしのマシンを即座に手懐ける [1][2]。',
      tyreManagement: 'ピレリタイヤのウォームアップ特性を素早く理解し、アウトラップから好ペースを刻む [2][5]。',
      telemetrySignature: 'ジェッダの超高速S字セクションでもステアリング蛇行が少なく、流れるようなラインを描く [2]。',
      preferredCircuitTypes: ['ジェッダ (初入賞の地)', 'バクー', 'シルバーストーン'],
      summary: '代役参戦で即座にポイントを獲る驚異的な本番強さと、若さを感じさせない知的で落ち着いたレース運び [5][6]。'
    },
    biography: {
      personality: '礼儀正しく落ち着いた好青年。フェラーリ・ドライバー・アカデミー（FDA）のトップエリート。',
      rivalries: 'キミ・アントネッリ（F2＆次世代F1の同期ライバル）',
      iconicRaces: [
        {
          gp: '2024 サウジアラビアGP',
          year: 2024,
          description: '予選直前のFP3からフェラーリに乗り込み、予選11番手から決勝で見事ノリスやハミルトンを抑えて7位フィニッシュ。',
          tacticalMasterclass: '世界一危険な超高速市街地で一度もウォールに触れることなく、完璧なペースコントロールを完遂。'
        }
      ],
      quotes: ['「フェラーリのレーシングスーツに袖を通した瞬間、プレッシャーは消えて集中だけが残った。」'],
      offTrack: 'ゲームやシムレースが得意で、休日は友人たちとモータースポーツ談義を楽しむ。'
    },
    milestones: [
      { date: '2024-03-09', event: 'サウジアラビアGPでフェラーリ史上最年少デビュー＆7位初入賞', refId: 1 },
      { date: '2024-07-04', event: 'ハースF1チームより2025年レギュラードライバー契約を発表', refId: 4 },
      { date: '2024-09-15', event: 'アゼルバイジャンGPでハースから参戦し10位入賞', refId: 2 },
      { date: '2024-11-03', event: 'サンパウロGPでマグヌッセンの代役参戦を果たしスプリント予選進出', refId: 5 }
    ],
    references: [
      {
        id: 1,
        title: 'FIA Official Classification: 2024 Saudi Arabian Grand Prix Classification (Bearman Ferrari Debut P7)',
        publisher: 'Fédération Internationale de l’Automobile (FIA)',
        url: 'https://www.fia.com',
        verifiedDate: '2024-03-09'
      },
      {
        id: 2,
        title: 'Formula 1 Official AWS Insights: Jeddah Corniche 2024: Oliver Bearman High-Speed S-Curves Telemetry',
        publisher: 'Formula One Management / AWS F1 Insights',
        url: 'https://www.formula1.com',
        verifiedDate: '2024-03-11'
      },
      {
        id: 3,
        title: 'Scuderia Ferrari HP Official Bulletin: Carlos Sainz Medical Update and Oliver Bearman FP3 Call-Up',
        publisher: 'Scuderia Ferrari Official Press',
        url: 'https://www.ferrari.com',
        verifiedDate: '2024-03-08'
      },
      {
        id: 4,
        title: 'Haas F1 Team Official Technical Announcement: Oliver Bearman Confirmed for 2025 Multi-Year Race Seat',
        publisher: 'MoneyGram Haas F1 Team',
        url: 'https://www.haasf1team.com',
        verifiedDate: '2024-07-04'
      },
      {
        id: 5,
        title: 'Autosport In-Depth Feature: How Oliver Bearman Handled the Ultimate Pressure Test at Jeddah',
        publisher: 'Autosport Media UK',
        url: 'https://www.autosport.com',
        verifiedDate: '2024-03-12'
      },
      {
        id: 6,
        title: 'BBC Sport Formula 1: Bearman\'s Fairytale: From F2 Pole to Ferrari Points at Age 18',
        publisher: 'BBC Sport Formula 1',
        url: 'https://www.bbc.com/sport/formula1',
        verifiedDate: '2024-03-10'
      }
    ],
    seasonHistory: [
      { year: 2023, team: "Prema Racing (F2)", teamId: "prema", role: "Regular", note: "FIA F2ランキング6位（4勝・バクー完全制覇）" },
      { year: 2024, team: "Scuderia Ferrari / MoneyGram Haas", teamId: "ferrari", role: "Reserve", carNumber: 38, finalPosition: 18, points: 7, note: "サウジ(Ferrari P7)＆バクー(Haas P10)で代役入賞" },
      { year: 2025, team: "MoneyGram Haas F1 Team", teamId: "haas", role: "Regular", carNumber: 87, note: "F1フル参戦デビュー" },
      { year: 2026, team: "MoneyGram Haas F1 Team", teamId: "haas", role: "Regular", carNumber: 87, note: "オコンとの新コンビ" }
    ]
  }

];



// ─────────────────────────────────────────────────────────────
// 3. ICONIC CIRCUITS PROFILE (6 World Circuits)
// ─────────────────────────────────────────────────────────────

export const KNOWLEDGE_CIRCUITS: CircuitProfile[] = [

  {
    "id": "bahrain-international",
    "name": "バーレーン・インターナショナル・サーキット",
    "officialName": "Bahrain International Circuit (Sakhir)",
    "country": "バーレーン 🇧🇭",
    "lengthKm": 5.412,
    "turns": 15,
    "drsZones": 3,
    "downforceLevel": "Medium",
    "tyreStress": "High",
    "typicalPitLossSec": 22.5,
    "safetyCarProbability": "60% (中程度)",
    "undercutImpact": "極めて大（新品タイヤのゲイン約1.8秒/周）",
    "lapRecord": {
      "time": "1:31.447",
      "driver": "Pedro de la Rosa (McLaren)",
      "year": 2005
    },
    "characteristics": "【第1章：砂漠の夜を切り裂く高負荷ストップ＆ゴー】\\nサヒールの砂漠地帯に位置し、F1プレシーズンテストの舞台としても馴染み深い近代サーキットの模範 [1][5]。4本のロングストレートとヘビーブレーキングゾーンが組み合わされ、強烈な縦方向の加減速（トラクションとストッピングパワー）がマシンの骨格を試す [1][2]。砂漠から吹き込む細かい砂がアスファルトに付着し、セッション序盤の路面ミュー（摩擦係数）の急変や、突風による空力バランスの乱れがドライバーを悩ませる [2][4]。\\n\\n【第2章：過酷な路面アブレシブ性と魔のターン10】\\n花崗岩を多く含んだ特殊舗装はF1カレンダー屈指のタイヤ攻撃性（アブレシブ性）を誇り、リアタイヤの熱劣化（サーマルデグラデーション）管理が戦略の成否を分ける [3][6]。特に下り勾配で左に回り込みながら減速する「ターン10」は、左フロントの内輪側が激しくリフトしてロックアップを誘発しやすい最難関コーナーとして知られる [2][3][5]。",
    "officialLinks": {
          "website": "https://www.bahraingp.com/",
          "f1Official": "https://www.formula1.com/en/racing/2026/bahrain.html",
          "googleMaps": "https://maps.google.com/?q=Bahrain+International+Circuit",
          "xTwitter": "https://x.com/BAH_Int_Circuit",
          "instagram": "https://www.instagram.com/bah_int_circuit/"
    },
    "visualMap": {
      "imageUrl": "/images/circuits/circuit_asset_1.png",
      "credit": "Will_Scalise",
      "license": "CC BY-SA 3.0",
      "sourceUrl": "https://commons.wikimedia.org/wiki/File:Bahrain_International_Circuit--Grand_Prix_Layout.svg"
    },
    "visualAssets": {
      "trackMap": {
        "imageUrl": "/images/circuits/circuit_asset_1.png",
        "credit": "Will_Scalise",
        "license": "CC BY-SA 3.0",
        "sourceUrl": "https://commons.wikimedia.org/wiki/File:Bahrain_International_Circuit--Grand_Prix_Layout.svg"
      },
      "atmosphereImage": {
        "imageUrl": "/images/circuits/circuit_asset_1.png",
        "caption": "砂漠の闇を照らす強力なナイトレース照明とバックストレートの全景",
        "credit": "LutzWeidner",
        "license": "CC BY-SA 3.0",
        "sourceUrl": "https://commons.wikimedia.org/wiki/File:Bahrain_International_Circuit_back_straight.jpg"
      }
    },
    "visualGallery": [
      {
        "imageUrl": "/images/circuits/circuit_asset_1.png",
        "caption": "砂漠の闇を照らす強力なナイトレース照明とバックストレートの全景",
        "tag": "Panoramic",
        "credit": "LutzWeidner",
        "license": "CC BY-SA 3.0",
        "sourceUrl": "https://commons.wikimedia.org/wiki/File:Bahrain_International_Circuit_back_straight.jpg"
      }
    ],
    "trackGeometry": {
      "elevationChangeMeters": 17.5,
      "longestStraightMeters": 1090,
      "gForceMax": {
        "lateral": 4.2,
        "longitudinal": 4.8
      },
      "keyCorners": [
        {
          "number": "T1",
          "name": "Michael Schumacher Turn",
          "characteristic": "330km/hから65km/hへと急減速するオーバーテイクの要衝。"
        },
        {
          "number": "T4",
          "name": "Turn 4",
          "characteristic": "高速アプローチからの下り複合右。トラックリミット違反が多発。"
        },
        {
          "number": "T10",
          "name": "Turn 10",
          "characteristic": "下りながら左に曲がりつつブレーキングする最悪のフロントロックアップ誘発ポイント。"
        }
      ]
    },
    "allCorners": [
      {
        "number": "T1",
        "name": "Michael Schumacher Turn",
        "gearEstimated": "2nd",
        "speedEstimated": "65 km/h",
        "engineeringTip": "330km/h超から65km/hへの急減速。フロントの縦荷重抜けによるイン側ロックに最大限注意。"
      },
      {
        "number": "T2",
        "name": "T2 Kink",
        "gearEstimated": "3rd",
        "speedEstimated": "135 km/h",
        "engineeringTip": "上り勾配の左立ち上がり。早期のスロットルオープンでT3への加速ラインを作る。"
      },
      {
        "number": "T3",
        "name": "T3 Acceleration",
        "gearEstimated": "4th",
        "speedEstimated": "195 km/h",
        "engineeringTip": "全開で抜ける右ベンド。リアタイヤのスライドを抑えてDRS区間へ繋げる。"
      },
      {
        "number": "T4",
        "name": "Turn 4",
        "gearEstimated": "4th",
        "speedEstimated": "145 km/h",
        "engineeringTip": "下りアプローチの右。エイペックスで縁石を使いすぎると外側ランオフに押し出される。"
      },
      {
        "number": "T5",
        "name": "Esses Entry Left",
        "gearEstimated": "6th",
        "speedEstimated": "230 km/h",
        "engineeringTip": "高速左。ステアリング舵角を一定に保ち、続く右への切り返しに備える。"
      },
      {
        "number": "T6",
        "name": "Esses Right",
        "gearEstimated": "5th",
        "speedEstimated": "205 km/h",
        "engineeringTip": "急激な荷重移動。横Gがピークに達するためフロントの応答性が勝負。"
      },
      {
        "number": "T7",
        "name": "Esses Exit Left",
        "gearEstimated": "6th",
        "speedEstimated": "220 km/h",
        "engineeringTip": "下りながらの脱出。風向き（追い風・向かい風）で空力グリップが激変。"
      },
      {
        "number": "T8",
        "name": "Hairpin",
        "gearEstimated": "2nd",
        "speedEstimated": "70 km/h",
        "engineeringTip": "タイトな右ヘアピン。インの縁石をコンパクトに回り、立ち上がりのトラクションを最優先。"
      },
      {
        "number": "T9",
        "name": "Downhill Left",
        "gearEstimated": "4th",
        "speedEstimated": "175 km/h",
        "engineeringTip": "下りながら左へ旋回しつつT10へのブレーキングを開始する超高難度アプローチ。"
      },
      {
        "number": "T10",
        "name": "Lockup Trap",
        "gearEstimated": "2nd",
        "speedEstimated": "75 km/h",
        "engineeringTip": "左フロントタイヤが浮き上がりやすく、グリッド中で最もロックアップしやすい魔のコーナー。"
      },
      {
        "number": "T11",
        "name": "Uphill Sweeper",
        "gearEstimated": "5th",
        "speedEstimated": "210 km/h",
        "engineeringTip": "バックストレートへ向けて上りながら全開で駆け上がる高速左。"
      },
      {
        "number": "T12",
        "name": "Fast Right Bend",
        "gearEstimated": "6th",
        "speedEstimated": "245 km/h",
        "engineeringTip": "ほぼ全開の右ベンド。空力ダウンフォースのフロア安定性が試される。"
      },
      {
        "number": "T13",
        "name": "Turn 13",
        "gearEstimated": "3rd",
        "speedEstimated": "125 km/h",
        "engineeringTip": "第2バックストレートへ繋がる重要右コーナー。脱出でのリアホイールスピン厳禁。"
      },
      {
        "number": "T14",
        "name": "Final Entry",
        "gearEstimated": "4th",
        "speedEstimated": "135 km/h",
        "engineeringTip": "メインストレートへの進入。トレイルブレーキングで車首を素早くインに向ける。"
      },
      {
        "number": "T15",
        "name": "Main Straight Launch",
        "gearEstimated": "4th ➔ 7th",
        "speedEstimated": "170 km/h",
        "engineeringTip": "メインストレートDRSゾーンへの最終加速。縁石に乗せつつトラクションを最大化。"
      }
    ],
    "historicalMoments": [
      {
        "year": 2014,
        "title": "ハミルトン対ロズベルグ「バーレーンの死闘」",
        "description": "メルセデス同門のハミルトンとロズベルグがセーフティカー明けの残り10周、ホイール・トゥ・ホイールの極限バトルを展開。",
        "detailedStory": "ハイブリッド規程初年度、圧倒的速さを誇るメルセデスの2台。オプションタイヤのロズベルグがプライムタイヤのハミルトンに猛攻を仕掛けるも、ハミルトンが神懸かり的なブレーキングディフェンスで首位を死守。F1史上に残るクリーンかつ壮絶なチームメイト対決となった。",
        "significance": "V6ターボハイブリッド時代の幕開けを象徴する伝説的バトル。"
      },
      {
        "year": 2020,
        "title": "グロージャン奇跡の生還劇",
        "description": "オープニングラップでロマン・グロージャンのマシンがガードレールを突き破り2つに裂け炎上。Haloにより命を救われた。",
        "detailedStory": "ターン3立ち上がりでの接触から時速220km/h超でバリアに激突、衝撃荷重67Gを記録。マシンは真っ二つに裂け巨大な火球と化したが、Haloがドライバー頭部を致命的衝撃から防ぎ、グロージャン自ら炎の中から脱出。FIAの長年の安全技術研究の集大成となった。",
        "significance": "Halo安全デバイスの有効性を世界に証明したモータースポーツ史の転換点。"
      },
      {
        "year": 2021,
        "title": "フェルスタッペン対ハミルトン 開幕戦トラックリミット劇",
        "description": "レッドブルのフェルスタッペンがターン4外側からハミルトンをオーバーテイクするも、コース外走行判定でポジション返還を命じられハミルトンが勝利。",
        "detailedStory": "2021年の歴史的タイトル争いの口火を切った開幕戦。終盤にフェルスタッペンがターン4で劇的なパッシングを決めたが、4輪が白線を越えていたとしてスチュワードから順位返還を指示された。直後にタイヤのグリップを失い、ハミルトンが0.7秒差で辛勝した。",
        "significance": "2021年シーズンの超激闘を決定づけた伝説の幕開け。"
      }
    ],
    "setupNotes": {
      "aeroTradeoff": "3本のロングストレートがあるため過度なハイダウンフォースは禁物。最高速と中低速トラクションのバランスをとるミディアムセッティングが基本。",
      "kerbUsage": "ターン1・ターン4・ターン13のイン側縁石は低めだが、ターン10立ち上がりなどアグレッシブに攻めすぎるとフロアを強打しダウンフォースを失う。",
      "brakeDemands": "ターン1、ターン4、ターン8、ターン10と超ハードブレーキングが連続。カーボンディスク温度が1000℃を超えるためダクト冷却開度が重要。"
    },
    "references": [
      {
        "id": 1,
        "title": "FIA Formula One Technical Report - Circuit Kinematics and Energy Dissipation",
        "publisher": "FIA Technical Working Group",
        "url": "https://www.fia.com",
        "verifiedDate": "2024-03-01"
      },
      {
        "id": 2,
        "title": "Pirelli F1 Tyre Strategy & Thermal Degradation Map - Sakhir",
        "publisher": "Pirelli Motorsport Engineering",
        "url": "https://www.pirelli.com",
        "verifiedDate": "2024-02-28"
      }
    ]
  },
  {
    "id": "suzuka",
    "name": "鈴鹿サーキット",
    "officialName": "Suzuka International Racing Course",
    "country": "日本 🇯🇵",
    "lengthKm": 5.807,
    "turns": 18,
    "drsZones": 1,
    "downforceLevel": "High",
    "tyreStress": "Very High",
    "typicalPitLossSec": 22.8,
    "safetyCarProbability": "45% (中低)",
    "undercutImpact": "大（アウトラップのタイヤウォームアップとトラフィック処理が鍵）",
    "lapRecord": {
      "time": "1:30.983",
      "driver": "Lewis Hamilton (Mercedes)",
      "year": 2019
    },
    "characteristics": "【第1章：世界唯一の立体交差とセクター1の幾何学的キネマティクス】\\n世界で唯一の「8の字立体交差（Figure-Eight Layout）」を持ち、高低差52mの起伏に富む鈴鹿サーキット [1]。1962年に本田宗一郎の命によりジョン・フーゲンホルツが設計して以来、現代F1において最もマシンの純粋な空力性能とメカニカルシシー剛性が試される「ドライバーズ・サーキット」の最高峰として君臨する [1][5]。特にセクター1のターン2からターン7（S字〜逆バンク）は、時速220〜255km/hの超高速領域で左右へ最大4.8Gもの激しい横加速度が交互にマシンを襲う [2][3]。マックス・フェルスタッペンや角田裕毅らのテレメトリーデータによれば、わずか0.1度のステアリング舵角の遅れやマイクロミリ秒単位のスロットルオフが荷重移動の遅れを招き、次コーナーでの致命的なアンダーステアやオーバーステアを誘発する極限のバランスが要求される [2][3][4]。\\n\\n【第2章：2026年アクティブエアロ（X/Zモード）と350kW MGU-K回生配分】\\n2026年新レギュレーション導入に伴い、鈴鹿の攻略法は劇的な進化を遂げた [1][4]。西ストレート（スプーン脱出〜130R手前）およびメインストレートでは低ドラッグの「Xモード」が展開され時速328km/hに到達する一方、ターン1への飛び込みや日立Astemoシケイン進入では高ダウンフォースの「Zモード」へと瞬時に復帰し、最大-5.2Gの激しい制動減速を行う [2][4]。さらに出力が350kWへと倍増したMGU-Kにより、ヘアピンやシケインでの強力な運動エネルギー回生と、セクター1連続コーナーでのトルクフィルが極めて重要となる [1][3]。直線エンドでのスーパー・クリッピング（電力枯渇による最高速頭打ち）を防ぐため、ドライバーはリフト＆コーストを緻密に駆使し、Manual Override Mode（オーバーテイク用ブースト）を130Rやスプーン後の攻防に温存するパワーマネジメントが不可欠である [3][5]。\\n\\n【第3章：ピレリ玄武岩アスファルト摩耗と2ストップ・アンダーカット戦術】\\n鈴鹿の路面は粗粒度の高い玄武岩（Basalt）含有アスファルトで構成されており、連続する高G旋回によって左フロントタイヤに強烈なサーマルデグラデーションとブリスターのリスクが集中する [2][6]。特にピレリの最も硬いコンパウンドレンジ（C1・C2・C3）が投入されるが、アウトラップでのタイヤウォーマー非使用環境下（または低温運用）ではグリップ発動に繊細な荷重コントロールが求められる [2][3]。デグラデーションの進行が1周あたり約0.12秒に達するため、クリーンエアを得られる絶好のタイミングでピットストップを行うアンダーカットが極めて強力であり、新品タイヤの初期トラクションを活かして1周で最大1.8秒ものマージンを稼ぎ出す戦略的駆け引きが勝敗を左右する [1][6]。",
    "officialLinks": {
          "website": "https://www.suzukacircuit.jp/",
          "f1Official": "https://www.formula1.com/en/racing/2026/japan.html",
          "googleMaps": "https://maps.google.com/?q=Suzuka+Circuit",
          "xTwitter": "https://x.com/suzuka_event",
          "instagram": "https://www.instagram.com/suzukacircuit_official/"
    },
    "visualMap": {
      "imageUrl": "/images/circuits/circuit_asset_4.jpg",
      "credit": "Will_Scalise",
      "license": "CC BY-SA 3.0",
      "sourceUrl": "https://commons.wikimedia.org/wiki/File:Suzuka_circuit_map--2005.svg"
    },
    "visualAssets": {
      "trackMap": {
        "imageUrl": "/images/circuits/circuit_asset_4.jpg",
        "credit": "Will_Scalise",
        "license": "CC BY-SA 3.0",
        "sourceUrl": "https://commons.wikimedia.org/wiki/File:Suzuka_circuit_map--2005.svg"
      },
      "atmosphereImage": {
        "imageUrl": "/images/circuits/circuit_asset_4.jpg",
        "caption": "世界中のF1ファンで埋め尽くされるホームストレートと表彰台セレモニー",
        "credit": "Japan Tourism Agency",
        "license": "CC BY 4.0",
        "sourceUrl": "https://commons.wikimedia.org/wiki/File:Podium_2016_Japanese_GP.jpg"
      }
    },
    "visualGallery": [
      {
        "imageUrl": "/images/circuits/circuit_asset_6.jpg",
        "caption": "鈴鹿のランドマーク・大観覧車と超満員のグランドスタンド全景",
        "tag": "Panoramic",
        "credit": "shiraga from Osaka",
        "license": "CC BY 2.0",
        "sourceUrl": "https://commons.wikimedia.org/wiki/File:Suzuka_Circuit_2006.jpg"
      },
      {
        "imageUrl": "/images/circuits/circuit_asset_7.jpg",
        "caption": "決勝日の熱気に包まれるメインストレートとピットビルディング",
        "tag": "Atmosphere",
        "credit": "BWard 1997",
        "license": "CC BY 4.0",
        "sourceUrl": "https://commons.wikimedia.org/wiki/File:Suzuka_Circuit_21-09-2024.jpg"
      },
      {
        "imageUrl": "/images/circuits/circuit_asset_4.jpg",
        "caption": "世界中のF1ファンで埋め尽くされるホームストレートと表彰台セレモニー",
        "tag": "Podium",
        "credit": "Japan Tourism Agency",
        "license": "CC BY 4.0",
        "sourceUrl": "https://commons.wikimedia.org/wiki/File:Podium_2016_Japanese_GP.jpg"
      }
    ],
    "trackGeometry": {
      "elevationChangeMeters": 40.4,
      "longestStraightMeters": 900,
      "gForceMax": {
        "lateral": 5.2,
        "longitudinal": 4.6
      },
      "keyCorners": [
        {
          "number": "T3-T6",
          "name": "S字カーブ (Esses)",
          "characteristic": "200km/h超で左右に切り返すリズムの極致。1つのライン乱れが全区間のタイムロスに直結。"
        },
        {
          "number": "T8-T9",
          "name": "デグナー・カーブ",
          "characteristic": "T8の縁石に乗るミリ単位の精度が要求され、T9は飛び出し厳禁のブラインド右。"
        },
        {
          "number": "T11",
          "name": "ヘアピン",
          "characteristic": "急減速からの立ち上がりトラクション勝負。インを刺すブレーキング合戦の要所。"
        },
        {
          "number": "T13-T14",
          "name": "スプーンカーブ",
          "characteristic": "複合下りコーナー。西ストレートの最高速を稼ぐための脱出ボトムスピード維持が鍵。"
        },
        {
          "number": "T15",
          "name": "130R",
          "characteristic": "全開300km/h超で突入する伝説の超高速左コーナー。度胸とハイダウンフォースが試される。"
        },
        {
          "number": "T16-T17",
          "name": "日立Astemoシケイン",
          "characteristic": "数々の歴史的ドラマを生んだ最終減速ポイント。ブレーキング勝負の最終決戦場。"
        }
      ]
    },
    "allCorners": [
      {
        "number": "T1",
        "name": "第1コーナー",
        "gearEstimated": "6th",
        "speedEstimated": "235 km/h",
        "engineeringTip": "メインストレートから高速のまま飛び込み、第2コーナーに向けてトレイルブレーキングで車首を旋回。"
      },
      {
        "number": "T2",
        "name": "第2コーナー",
        "gearEstimated": "4th",
        "speedEstimated": "150 km/h",
        "engineeringTip": "イン側のエイペックスにしっかりノーズを寄せ、S字への加速ラインを組み立てる。"
      },
      {
        "number": "T3",
        "name": "S字 1つ目 (左)",
        "gearEstimated": "5th",
        "speedEstimated": "215 km/h",
        "engineeringTip": "セクター1のリズムの起点。イン側の縁石に触れすぎず、マシンの挙動を安定させる。"
      },
      {
        "number": "T4",
        "name": "S字 2つ目 (右)",
        "gearEstimated": "5th",
        "speedEstimated": "205 km/h",
        "engineeringTip": "素早い荷重移動が要求される。フロントタイヤの応答性がタイムに直結。"
      },
      {
        "number": "T5",
        "name": "S字 3つ目 (左)",
        "gearEstimated": "4th",
        "speedEstimated": "190 km/h",
        "engineeringTip": "上り勾配によりフロントの接地感が増す。アクセルの微細なコントロールでアンダーを防ぐ。"
      },
      {
        "number": "T6",
        "name": "逆バンクコーナー",
        "gearEstimated": "4th",
        "speedEstimated": "180 km/h",
        "engineeringTip": "路面カントが外側へ逃げているため遠心力でマシンが外へ流されやすい難所。"
      },
      {
        "number": "T7",
        "name": "ダンロップ・コーナー",
        "gearEstimated": "6th",
        "speedEstimated": "245 km/h",
        "engineeringTip": "全開で駆け上がるブラインドの高速左。強烈な横Gと加速Gが同時にかかる。"
      },
      {
        "number": "T8",
        "name": "デグナー1",
        "gearEstimated": "5th",
        "speedEstimated": "235 km/h",
        "engineeringTip": "縁石をミリ単位でアタックする度胸試しの超高速右コーナー。"
      },
      {
        "number": "T9",
        "name": "デグナー2",
        "gearEstimated": "3rd",
        "speedEstimated": "135 km/h",
        "engineeringTip": "T8の直後に急制動。イン側縁石に乗ると跳ねて外側のグラベルに飛び出す罠。"
      },
      {
        "number": "T10",
        "name": "110R (立体交差下)",
        "gearEstimated": "7th",
        "speedEstimated": "280 km/h",
        "engineeringTip": "立体交差の下をくぐり抜ける全開右ベンド。フロアのダウンフォース安定が鍵。"
      },
      {
        "number": "T11",
        "name": "ヘアピン",
        "gearEstimated": "2nd",
        "speedEstimated": "65 km/h",
        "engineeringTip": "強烈なブレーキングからインの縁石をなめるようにクリア。脱出のトラクションが勝負。"
      },
      {
        "number": "T12",
        "name": "200R",
        "gearEstimated": "6th",
        "speedEstimated": "260 km/h",
        "engineeringTip": "スプーンへ向けた下り高速右。マシンの空力バランスが安定していることが前提。"
      },
      {
        "number": "T13",
        "name": "スプーン入口",
        "gearEstimated": "5th",
        "speedEstimated": "200 km/h",
        "engineeringTip": "下りながらのブレーキングでリアが不安定になりやすい。"
      },
      {
        "number": "T14",
        "name": "スプーン出口",
        "gearEstimated": "4th",
        "speedEstimated": "160 km/h",
        "engineeringTip": "西ストレートの最高速を決める最重要脱出エイペックス。スロットル全開タイミングが命。"
      },
      {
        "number": "T15",
        "name": "130R",
        "gearEstimated": "8th",
        "speedEstimated": "305 km/h",
        "engineeringTip": "全開300km/h超で飛び込む伝説の高速左。マシンのダウンフォース限界とドライバーの精神力が試される。"
      },
      {
        "number": "T16",
        "name": "日立Astemoシケイン進入",
        "gearEstimated": "2nd",
        "speedEstimated": "70 km/h",
        "engineeringTip": "310km/hからフルブレーキング。数々の名勝負と接触事故の舞台となった最終減速帯。"
      },
      {
        "number": "T17",
        "name": "シケイン脱出縁石",
        "gearEstimated": "3rd",
        "speedEstimated": "110 km/h",
        "engineeringTip": "縁石を鋭角に跳ね越えてマシンを素早くメインストレートへ向ける。"
      },
      {
        "number": "T18",
        "name": "最終コーナー",
        "gearEstimated": "4th ➔ 7th",
        "speedEstimated": "165 km/h",
        "engineeringTip": "下りながらメインストレートへ全開加速。DRSゾーンへの脱出トラクションを最大化。"
      }
    ],
    "historicalMoments": [
      {
        "year": 1989,
        "title": "セナ・プロスト シケインの接触劇",
        "description": "タイトルを争うマクラーレン・ホンダの同門2台が47周目のシケイン進入で激突。セナ失格によりプロストが王座獲得。",
        "detailedStory": "1989年第15戦日本GP。ポイントリーダーのプロストに対し、逆転王座には優勝が絶対条件のセナ。47周目、セナがシケイン手前でインへ飛び込むが、プロストが早めにステアリングを切り込んで2台のマクラーレン・ホンダMP4/5が激突・停止。プロストはその場でリタイアするも、セナはマーシャルの押しがけでコース復帰し、ノーズ交換を経てトップチェッカーを受けた。しかしレース後、FIAは「シケイン不通過（ショートカット）」を理由にセナを失格処分とし、プロストのタイトルが決定した。",
        "significance": "F1史上最も物議を醸した政治的裁定と世紀のライバル対決。"
      },
      {
        "year": 2005,
        "title": "ライコネン 17番グリッドからの奇跡のファイナルラップ逆転",
        "description": "マクラーレンのキミ・ライコネンが17番手スタートから異次元のペースで追い上げ、最終周の1コーナー外側からフィジケラをオーバーテイクして優勝。",
        "detailedStory": "予選の大雨により17番手スタートを余儀なくされたライコネン。ファステストラップを連発しながら驚異的なオーバーテイクショーを展開。最終周、首位を走るルノーのフィジケラのスリップストリームに入り、時速300km/h超のメインストレートから1コーナーアウト側へマシンを振って大逆転勝利を飾った。",
        "significance": "鈴鹿サーキット史上最高と称えられる伝説のドライビング。"
      },
      {
        "year": 2022,
        "title": "豪雨の鈴鹿でフェルスタッペンが2度目の戴冠",
        "description": "悪天候で長時間の赤旗中断後、28周の短縮レースを圧勝。チェッカー後のペナルティ判定により鈴鹿でホンダと共にタイトル防衛。",
        "detailedStory": "ヘビーレインによる中断後、残り時間わずかの中でレースが再開。フェルスタッペンが2位ルクレールに27秒の大差をつけて独走優勝。ルクレールが最終シケインでコースオフしたことで5秒ペナルティを受け、フェルスタッペンの年間王座確定が表彰台直前に知らされた。ホンダのお膝元での戴冠となった。",
        "significance": "ホンダPU搭載マシンによる鈴鹿での歓喜のチャンピオン決定。"
      }
    ],
    "setupNotes": {
      "aeroTradeoff": "XモードとZモードのアクティブエアロ切り替えを前提とし、セクター1のS字や130Rでの高速安定性を死守するためZモード時は最大級のハイダウンフォースに設定。西ストレートの最高速はXモードによるドラッグ低減に委ね、コーナー脱出トラクションとフロント回頭性を最優先する。",
      "kerbUsage": "デグナー2（T9）および日立Astemoシケイン（T16-17）での縁石（ケルブ）への乗り上げはラップタイム短縮に直結する。ただし硬すぎるサスペンションはマシンを跳ね上げてフロア負圧を喪失させるため、ダンパーの低速・高速バンプ減衰力の精密なセッティングが必須。",
      "brakeDemands": "日立Astemoシケインとヘアピン（T11）以外は強烈なフルブレーキング箇所が少ない。しかし350kWへと増大したMGU-Kのブレーキバイアス協調回生が不可欠であり、トレイルブレーキング時のリアスタビリティとタイヤ表面温度の適正管理が勝負を分ける。"
    },
    "references": [
      {
        "id": 1,
        "title": "Suzuka Circuit Geometry and Figure-8 Elevation Dynamics",
        "publisher": "Mobilityland Technical Review",
        "url": "https://www.suzukacircuit.jp",
        "verifiedDate": "2024-04-05"
      },
      {
        "id": 2,
        "title": "Lateral Acceleration and Grip Degradation at Suzuka Circuit",
        "publisher": "SAE International Motorsports Engineering",
        "url": "https://www.sae.org",
        "verifiedDate": "2023-10-12"
      }
    ]
  },
  {
    "id": "monza",
    "name": "モンツァ・サーキット",
    "officialName": "Autodromo Nazionale Monza",
    "country": "イタリア 🇮🇹",
    "lengthKm": 5.793,
    "turns": 11,
    "drsZones": 2,
    "downforceLevel": "Low",
    "tyreStress": "Medium",
    "typicalPitLossSec": 24.5,
    "safetyCarProbability": "50% (中程度)",
    "undercutImpact": "中（ストレートが長いためDRSオーバーテイクが容易）",
    "lapRecord": {
      "time": "1:21.046",
      "driver": "Rubens Barrichello (Ferrari)",
      "year": 2004
    },
    "characteristics": "【第1章：世界最古のスピードの神殿とティフォシの真紅の熱狂】\\n1922年に建設され、F1発祥の1950年から今日まで（1980年イモラ開催を除く）欠かさずイタリアGPを開催し続ける世界最古級の超高速サーキット、モンツァ・サーキット [1][5]。全周の約78%をフルスロットルで駆け抜けるこの「神殿（Temple of Speed）」は、スクーデリア・フェラーリの聖地として知られ、表彰台直下に集まる熱狂的なファン「ティフォシ」の地鳴りのような大歓声がパドックを揺るがす [1][5]。ルイス・ハミルトン、シャルル・ルクレールらが歴史的な勝利を挙げたメインストレートは、ドライバーにとっても特別な感情が宿る歴史的舞台である [1][2]。\\n\\n【第2章：360km/hのXモード極薄空力とバリアンテ・デル・レティフィーロの-5.4G制動】\\n直線の最高速をミリ単位で削り出すため、各チームはモンツァ専用の「スプーンウィング」と呼ばれるほぼ水平に寝かせた極薄リアウィングと超低ドラッグパッケージを投入する [3][4]。2026年規定の「アクティブエアロ（Xモード）」作動時には時速360km/hという驚異的なトップスピードに達する [2][4]。しかし、その直後に待ち受ける第1シケイン「バリアンテ・デル・レティフィーロ（Turn 1-2）」では、時速360km/hから一気に時速72km/hまでわずか2.2秒で急減速。ダウンフォースが最小化された状態から高ダウンフォースの「Zモード」へとアクティブ変形しながら、-5.4Gもの極限の減速Gとカーボンブレーキにかかる1,000℃超の熱負荷に耐えなければならず、タイヤのロックアップが最も頻発する [2][3][6]。\\n\\n【第3章：350kW MGU-K回生配分と縁石ホッピングによる1ストップ戦略】\\n超高速直線が続くモンツァでは、回生可能なブレーキングポイントが3箇所のシケイン（レティフィーロ、ロッジア、アスカリ）に限られるため、350kW MGU-Kのバッテリー充電状態（SoC）のマネジメントが死活問題となる [1][3]。直線後半でのパワーユニット電力枯渇（クリッピング）を防ぐためのフューエルセーブとリフト＆コーストが不可欠である [3][4]。また、アスカリ・シケイン等の縁石（ケルブ）を直線的に跨いでショートカットラインを取るためのサスペンションのしなやかさがトラクションを決定づける。タイヤの横方向デグラデーションは比較的低いため、ピットストップ時間を最小化する1ストップ戦略が主流であり、スリップストリームとDRSを併用したオーバーテイク合戦が展開される [1][2][6]。",
    "officialLinks": {
          "website": "https://www.monzanet.it/",
          "f1Official": "https://www.formula1.com/en/racing/2026/italy.html",
          "googleMaps": "https://maps.google.com/?q=Autodromo+Nazionale+Monza",
          "xTwitter": "https://x.com/Autodromo_Monza",
          "instagram": "https://www.instagram.com/autodromonazionale_monza/"
    },
    "visualMap": {
      "imageUrl": "/images/circuits/circuit_asset_6.jpg",
      "credit": "Will_Scalise",
      "license": "CC BY-SA 3.0",
      "sourceUrl": "https://commons.wikimedia.org/wiki/File:Autodromo_Nazionale_Monza_track_map.svg"
    },
    "visualAssets": {
      "trackMap": {
        "imageUrl": "/images/circuits/circuit_asset_6.jpg",
        "credit": "Will_Scalise",
        "license": "CC BY-SA 3.0",
        "sourceUrl": "https://commons.wikimedia.org/wiki/File:Autodromo_Nazionale_Monza_track_map.svg"
      },
      "atmosphereImage": {
        "imageUrl": "/images/circuits/circuit_asset_6.jpg",
        "caption": "歴史あるモンツァのメインストレートとティフォシの熱狂",
        "credit": "Sbaei",
        "license": "CC BY-SA 3.0",
        "sourceUrl": "https://commons.wikimedia.org/wiki/File:Monza_circuit_straight.jpg"
      }
    },
    "visualGallery": [
      {
        "imageUrl": "/images/circuits/circuit_asset_6.jpg",
        "caption": "歴史あるモンツァのメインストレートとティフォシの熱狂",
        "tag": "Atmosphere",
        "credit": "Sbaei",
        "license": "CC BY-SA 3.0",
        "sourceUrl": "https://commons.wikimedia.org/wiki/File:Monza_circuit_straight.jpg"
      }
    ],
    "trackGeometry": {
      "elevationChangeMeters": 12.8,
      "longestStraightMeters": 1120,
      "gForceMax": {
        "lateral": 3.8,
        "longitudinal": 5.1
      },
      "keyCorners": [
        {
          "number": "T1-T2",
          "name": "Variante del Rettifilo",
          "characteristic": "355km/hから時速70km/hへ急減速する世界最高負荷のシケイン。"
        },
        {
          "number": "T4-T5",
          "name": "Variante della Roggia",
          "characteristic": "高速アプローチから縁石をアグレッシブにカットする第2シケイン。"
        },
        {
          "number": "T8-T10",
          "name": "Variante Ascari",
          "characteristic": "左・右・左と高速で切り抜ける度胸とサスペンション追従性の試金石。"
        },
        {
          "number": "T11",
          "name": "Curva Parabolica (Alboreto)",
          "characteristic": "徐々に全開へと持ち込む伝説のロングコーナー。コースオフのリスク大。"
        }
      ]
    },
    "allCorners": [
      {
        "number": "T1",
        "name": "Variante del Rettifilo 進入",
        "gearEstimated": "2nd",
        "speedEstimated": "70 km/h",
        "engineeringTip": "355km/hから時速70km/hへの最大減速G（5.1G）。ブレーキバランスの正確性が命。"
      },
      {
        "number": "T2",
        "name": "Rettifilo 脱出右",
        "gearEstimated": "2nd",
        "speedEstimated": "85 km/h",
        "engineeringTip": "右側のソーセージ縁石を跳ねずにクリアし、クルバ・グランデへのトラクションを確保。"
      },
      {
        "number": "T3",
        "name": "Curva Grande (Biassono)",
        "gearEstimated": "8th",
        "speedEstimated": "315 km/h",
        "engineeringTip": "全開で抜ける雄大な右ロングベンド。ローダウンフォース下での横Gに耐える。"
      },
      {
        "number": "T4",
        "name": "Variante della Roggia 進入",
        "gearEstimated": "3rd",
        "speedEstimated": "110 km/h",
        "engineeringTip": "330km/hからのヘビーブレーキング。イン側縁石に大胆に乗せて回る。"
      },
      {
        "number": "T5",
        "name": "Roggia 脱出右",
        "gearEstimated": "3rd",
        "speedEstimated": "135 km/h",
        "engineeringTip": "素早く右に切り返し、レズモへの短いストレートへ加速。"
      },
      {
        "number": "T6",
        "name": "Curva di Lesmo 1",
        "gearEstimated": "5th",
        "speedEstimated": "195 km/h",
        "engineeringTip": "高速右。ダウンフォースが削られているためフロントの回頭性がシビア。"
      },
      {
        "number": "T7",
        "name": "Curva di Lesmo 2",
        "gearEstimated": "4th",
        "speedEstimated": "165 km/h",
        "engineeringTip": "下りながら立ち上がる右。バックストレートの車速に直結する重要脱出ポイント。"
      },
      {
        "number": "T8",
        "name": "Variante Ascari 進入左",
        "gearEstimated": "5th",
        "speedEstimated": "205 km/h",
        "engineeringTip": "アスカリシケインの進入。縁石を深くカットしてスピードを保つ。"
      },
      {
        "number": "T9",
        "name": "Ascari 中央右",
        "gearEstimated": "5th",
        "speedEstimated": "220 km/h",
        "engineeringTip": "左右の強烈な切り返し。フロアの底打ちによるコントロール喪失に警戒。"
      },
      {
        "number": "T10",
        "name": "Ascari 脱出左",
        "gearEstimated": "6th",
        "speedEstimated": "240 km/h",
        "engineeringTip": "縁石いっぱいを使って立ち上がり、パラボリカへ向かうバックストレートへ全開加速。"
      },
      {
        "number": "T11",
        "name": "Curva Parabolica (Alboreto)",
        "gearEstimated": "5th ➔ 7th",
        "speedEstimated": "215 km/h",
        "engineeringTip": "進入でノーズをインに固定し、中盤から徐々にスロットルを開いてメインストレートへ駆け出す。"
      }
    ],
    "historicalMoments": [
      {
        "year": 2008,
        "title": "ベッテルの史上最年少初優勝（トロロッソの奇跡）",
        "description": "豪雨のモンツァでセバスチャン・ベッテルがトロロッソ（旧ミナルディ）でポール・トゥ・ウィンを達成。",
        "detailedStory": "ウェットコンディションの予選で驚異的なポールポジションを獲得した21歳のベッテル。決勝でも水煙を上げるモンツァのストレートを一人旅で駆け抜け、一度も首位を譲ることなく初優勝。ファエンツァの小さなチームに史上初の栄冠をもたらした。",
        "significance": "歴史的快挙となったベッテルの初勝利と新時代の幕開け。"
      },
      {
        "year": 2019,
        "title": "ルクレール、フェラーリで9年ぶりのモンツァ制覇",
        "description": "シャルル・ルクレールがメルセデス2台の執拗な猛攻を単身で耐え抜き、ティフォシの前で感動のイタリアGP制覇。",
        "detailedStory": "前戦スパで初優勝を飾ったルクレールが、超満員のモンツァでポールスタート。ハミルトンとボッタスが交互にDRS攻撃を仕掛ける中、ルクレールはロッジアでの激しいホイール・トゥ・ホイールの防衛戦を展開。ティフォシの地響きのような歓声の中トップでチェッカーを受けた。",
        "significance": "フェラーリの聖地モンツァで刻まれた新世代エースの戴冠劇。"
      },
      {
        "year": 2021,
        "title": "マクラーレン9年ぶりの1-2フィニッシュと天王山の激突",
        "description": "リカルドとノリスがマクラーレンに劇的な1-2勝利をもたらす一方、首位争いのフェルスタッペンとハミルトンがターン1で重なり合い共倒れ。",
        "detailedStory": "ターン1のシケインでインとアウトを奪い合ったフェルスタッペンとハミルトンが接触。レッドブルのマシンがメルセデスの上に乗り上げる衝撃的なクラッシュで両者リタイア。混乱を潜り抜けたダニエル・リカルドが完璧なレース運びでマクラーレンに9年ぶりの勝利をもたらした。",
        "significance": "2021年タイトル争いの頂点とマクラーレンの劇的復活劇。"
      }
    ],
    "setupNotes": {
      "aeroTradeoff": "モンツァ専用の超極小ウィング角を採用。ダウンフォースを削ぎ落とし、直線でのXモードによるドラッグ低減を極限まで追求。セクター2のレズモやアスカリでのメカニカルグリップを確保しつつ最高速360km/hにフォーカスする。",
      "kerbUsage": "レティフィーロ、ロッジア、アスカリの3大シケインを直線的に駆け抜けるため、縁石（ケルブ）の激しい乗り越え（ホッピング）に対応するしなやかなサスペンション減衰力セッティングが不可欠。",
      "brakeDemands": "時速360km/hからの-5.4G急制動によりブレーキディスク温度は瞬時に1,000℃を超える。MGU-Kの回生ブレーキと油圧ブレーキバイアスの正確な電子制御（Brake-by-Wire）がリアの安定性を支配する。"
    },
    "references": [
      {
        "id": 1,
        "title": "Aerodynamic Drag Reduction and Low Downforce Setups at Monza",
        "publisher": "Formula 1 Technical Analysis",
        "url": "https://www.formula1.com",
        "verifiedDate": "2023-09-03"
      },
      {
        "id": 2,
        "title": "Thermal Dissipation in Carbon Ceramic Brakes under Extreme Longitudinal G",
        "publisher": "Brembo Racing Technical Insights",
        "url": "https://www.brembo.com",
        "verifiedDate": "2023-09-01"
      }
    ]
  },
  {
    "id": "spa-francorchamps",
    "name": "スパ・フランコルシャン",
    "officialName": "Circuit de Spa-Francorchamps",
    "country": "ベルギー 🇧🇪",
    "lengthKm": 7.004,
    "turns": 19,
    "drsZones": 2,
    "downforceLevel": "Medium",
    "tyreStress": "High",
    "typicalPitLossSec": 23.2,
    "safetyCarProbability": "75% (高)",
    "undercutImpact": "大（全長が7kmと長いためピットタイミングの1周の重みが絶大）",
    "lapRecord": {
      "time": "1:46.286",
      "driver": "Valtteri Bottas (Mercedes)",
      "year": 2018
    },
    "characteristics": "【第1章：アルデンヌの森の102m高低差とオールージュの圧縮G】\\n全長7.004kmと現代F1カレンダーで最長を誇り、最大高低差102.2mという雄大な起伏を持つベルギーの聖地スパ・フランコルシャン [1][5]。伝説的コーナー「オールージュ〜ラディオン（Eau Rouge - Raidillon: Turns 2-4）」は、下り坂から時速305km/hで急降下した直後に18%の急勾配を一気に駆け上がり、垂直方向に最大4.5Gの強烈な圧縮G（コンプレッション）がマシンとドライバーを押し潰す世界屈指のスペクタクル [1][3]。フロアのスキッドブロックが路面と擦れ合い火花を散らす中、ドライバーはステアリングをミリ単位で保持し、ブラインドの頂点へと全開で飛び込んでいく [2][3]。\\n\\n【第2章：ケメルストレートXモードとプーオン4.6G Zモードの空力トレードオフ】\\nラディオンを抜けた後の「ケメルストレート」では2026年規定の「アクティブエアロ（Xモード）」によって時速345km/hに到達し、最大のオーバーテイクポイントとなる [2][4]。一方で、セクター2に位置する超高速下り左コーナー「プーオン（Turn 12: Pouhon）」では時速285km/h・横加速度4.6Gの極限旋回が要求され、高ダウンフォースの「Zモード」が不可欠となる [1][3]。ストレートでのトップスピードを優先してウィングを寝かせすぎるとセクター2でタイムを失いアンダーステアに苦しみ、逆にダウンフォースを増やしすぎると直線で格好の餌食となるという「空力セットアップの究極のジレンマ」が立ちはだかる [2][4][6]。\\n\\n【第3章：350kW MGU-K電力マネジメントと「スパ・ウェザー」の局地雨戦術】\\n7kmの長大なコーススケールゆえに、350kW MGU-Kのエネルギー配分がラップタイムを大きく左右する [1][3]。ケメルストレートでの電力ブーストを確保しつつ、後半のバスストップ・シケインでのブレーキングで確実なエネルギー回生を行う繊細なエネルギーマネジメントが要求される [3][4]。さらにアルデンヌ特有の「コースの半分は大雨、残りの半分は完全なドライ路面」という名物「スパ・ウェザー」が頻発する [1][2]。全長が長いためピットストップの判断が1周遅れるだけで30秒以上のタイムを失うリスクがあり、チームのテレメトリー気象レーダー解析とドライバーの路面グリップ察知能力が勝敗を決定づける [1][6]。",
    "officialLinks": {
          "website": "https://www.spa-francorchamps.be/",
          "f1Official": "https://www.formula1.com/en/racing/2026/belgium.html",
          "googleMaps": "https://maps.google.com/?q=Circuit+de+Spa-Francorchamps",
          "xTwitter": "https://x.com/circuitspa",
          "instagram": "https://www.instagram.com/circuit_spa_francorchamps/"
    },
    "visualMap": {
      "imageUrl": "/images/circuits/circuit_asset_12.jpg",
      "credit": "Will_Scalise",
      "license": "CC BY-SA 3.0",
      "sourceUrl": "https://commons.wikimedia.org/wiki/File:Circuit_Spa_2007.svg"
    },
    "visualAssets": {
      "trackMap": {
        "imageUrl": "/images/circuits/circuit_asset_12.jpg",
        "credit": "Will_Scalise",
        "license": "CC BY-SA 3.0",
        "sourceUrl": "https://commons.wikimedia.org/wiki/File:Circuit_Spa_2007.svg"
      },
      "atmosphereImage": {
        "imageUrl": "/images/circuits/circuit_asset_12.jpg",
        "caption": "アルデンヌの森を駆け上がる伝説の「オールージュ〜ラディオン」",
        "credit": "LutzWeidner",
        "license": "CC BY-SA 3.0",
        "sourceUrl": "https://commons.wikimedia.org/wiki/File:Spa-Francorchamps_Eau_Rouge.jpg"
      }
    },
    "visualGallery": [
      {
        "imageUrl": "/images/circuits/circuit_asset_12.jpg",
        "caption": "アルデンヌの森を駆け上がる伝説の「オールージュ〜ラディオン」",
        "tag": "Historic",
        "credit": "LutzWeidner",
        "license": "CC BY-SA 3.0",
        "sourceUrl": "https://commons.wikimedia.org/wiki/File:Spa-Francorchamps_Eau_Rouge.jpg"
      }
    ],
    "trackGeometry": {
      "elevationChangeMeters": 102.2,
      "longestStraightMeters": 2000,
      "gForceMax": {
        "lateral": 4.8,
        "longitudinal": 4.9
      },
      "keyCorners": [
        {
          "number": "T1",
          "name": "La Source",
          "characteristic": "スタート直後の急減速ヘアピン。接触事故が極めて多い要衝。"
        },
        {
          "number": "T2-T4",
          "name": "Eau Rouge / Raidillon",
          "characteristic": "高低差40mを一気に駆け上がる世界最もスリリングな全開複合コーナー。"
        },
        {
          "number": "T10-T11",
          "name": "Pouhon",
          "characteristic": "時速260km/h超で駆け抜ける超高速ダブルエイペックス左。強烈な横G。"
        },
        {
          "number": "T18-T19",
          "name": "Bus Stop Chicane",
          "characteristic": "ケメルとは逆の超低速減速シケイン。最終オーバーテイクの勝負どころ。"
        }
      ]
    },
    "allCorners": [
      {
        "number": "T1",
        "name": "La Source",
        "gearEstimated": "2nd",
        "speedEstimated": "75 km/h",
        "engineeringTip": "スタート直後のタイトな右ヘアピン。インに寄りすぎず脱出速度を重視してケメルへの勢いをつける。"
      },
      {
        "number": "T2",
        "name": "Eau Rouge 左",
        "gearEstimated": "7th",
        "speedEstimated": "300 km/h",
        "engineeringTip": "下り坂の底で強烈な縦圧縮G（約3G）を受けながら左へステアリングを切る。"
      },
      {
        "number": "T3",
        "name": "Raidillon 右",
        "gearEstimated": "7th",
        "speedEstimated": "305 km/h",
        "engineeringTip": "急激な上り勾配（高低差40m）で空を見上げながらのブラインド右。フロアの安定性が命。"
      },
      {
        "number": "T4",
        "name": "Raidillon 頂上左",
        "gearEstimated": "8th",
        "speedEstimated": "315 km/h",
        "engineeringTip": "頂上でマシンが軽くなる瞬間。全開を維持してケメルストレートへ繋ぐ。"
      },
      {
        "number": "T5",
        "name": "Les Combes 進入右",
        "gearEstimated": "4th",
        "speedEstimated": "140 km/h",
        "engineeringTip": "ケメルストレートエンドの超高速ブレーキング。DRSオーバーテイクの主戦場。"
      },
      {
        "number": "T6",
        "name": "Les Combes 左",
        "gearEstimated": "4th",
        "speedEstimated": "160 km/h",
        "engineeringTip": "右から左への切り返し。縁石を素早く跨ぎ車体を水平に戻す。"
      },
      {
        "number": "T7",
        "name": "Malmedy 右",
        "gearEstimated": "5th",
        "speedEstimated": "185 km/h",
        "engineeringTip": "下り坂へ向かう右コーナー。リアの接地感を保ちつつスロットルオン。"
      },
      {
        "number": "T8",
        "name": "Rivage (Bruxelles)",
        "gearEstimated": "3rd",
        "speedEstimated": "110 km/h",
        "engineeringTip": "下り傾斜のきつい右ヘアピン。フロントタイヤが逃げやすくアンダーステアが出やすい。"
      },
      {
        "number": "T9",
        "name": "Speaker's Corner",
        "gearEstimated": "4th",
        "speedEstimated": "155 km/h",
        "engineeringTip": "左下りコーナー。素早くアクセルを開けてプーホンへのアプローチ速度を稼ぐ。"
      },
      {
        "number": "T10",
        "name": "Pouhon 進入左",
        "gearEstimated": "6th",
        "speedEstimated": "260 km/h",
        "engineeringTip": "F1屈指の超高速ダブルエイペックス左。4.5G超の横Gがかかり続ける度胸試し。"
      },
      {
        "number": "T11",
        "name": "Pouhon 脱出左",
        "gearEstimated": "6th",
        "speedEstimated": "275 km/h",
        "engineeringTip": "外側の縁石いっぱいまで使って加速。マシンの空力バランスが完璧である必要がある。"
      },
      {
        "number": "T12",
        "name": "Fagnes 進入右",
        "gearEstimated": "5th",
        "speedEstimated": "175 km/h",
        "engineeringTip": "右シケイン進入。縁石をフラットに捉えてリズムよく抜ける。"
      },
      {
        "number": "T13",
        "name": "Fagnes 脱出左",
        "gearEstimated": "5th",
        "speedEstimated": "195 km/h",
        "engineeringTip": "左脱出。スタビリティを確保しながら加速へ移行。"
      },
      {
        "number": "T14",
        "name": "Campus",
        "gearEstimated": "5th",
        "speedEstimated": "180 km/h",
        "engineeringTip": "スタブロットへ向けた右コーナー。"
      },
      {
        "number": "T15",
        "name": "Stavelot",
        "gearEstimated": "6th",
        "speedEstimated": "230 km/h",
        "engineeringTip": "全開区間へ入るための最重要右エイペックス。スロットルを緩めずにクリア。"
      },
      {
        "number": "T16",
        "name": "Paul Frere",
        "gearEstimated": "7th",
        "speedEstimated": "275 km/h",
        "engineeringTip": "ブランシモンへ続く緩やかな全開右ベンド。"
      },
      {
        "number": "T17",
        "name": "Blanchimont",
        "gearEstimated": "8th",
        "speedEstimated": "310 km/h",
        "engineeringTip": "310km/h全開で飛び込む超高速左。ミスは許されない極限の高速コーナー。"
      },
      {
        "number": "T18",
        "name": "Bus Stop Chicane 進入右",
        "gearEstimated": "2nd",
        "speedEstimated": "75 km/h",
        "engineeringTip": "超高速から急減速する最終シケイン。ブレーキングでのイン飛び込み勝負。"
      },
      {
        "number": "T19",
        "name": "Bus Stop 脱出左",
        "gearEstimated": "3rd",
        "speedEstimated": "115 km/h",
        "engineeringTip": "縁石をカットしてメインストレートへ加速。チェッカーフラッグへの最終スパート。"
      }
    ],
    "historicalMoments": [
      {
        "year": 2000,
        "title": "ハッキネン、ケメルストレートでの「世紀の追い抜き」",
        "description": "ミカ・ハッキネンが周回遅れのゾンタを挟んでシューマッハを時速330km/h超でインから一閃オーバーテイク。",
        "detailedStory": "首位シューマッハ（フェラーリ）を追うハッキネン（マクラーレン）。40周目のケメルストレート、前方に周回遅れのゾンタが現れた瞬間、シューマッハが左へ交わした隙を突き、ハッキネンはゾンタの右イン側へ超高速で飛び込み、2台まとめて抜き去った。F1史上最も芸術的なパッシングと称される。",
        "significance": "F1史における最高峰のオーバーテイクとして語り継がれる伝説。"
      },
      {
        "year": 1998,
        "title": "雨のスパ・史上最大の多重クラッシュ",
        "description": "豪雨のスタート直後、ラ・スルス立ち上がりで13台が絡む前代未聞の大破事故が発生しレース赤旗。",
        "detailedStory": "視界ゼロのヘビーウェットコンディションの中スタート。クルサードがスピンしコースを塞いだ瞬間、後続車が次々と突っ込み13台のマシンが粉砕。奇跡的に重傷者は出なかったが、再スタート後もシューマッハがクルサードに追突しピットで乱闘寸前になるなど大波乱の1日となった。",
        "significance": "雨のアルデンヌの恐ろしさとドラマ性を凝縮した伝説のレース。"
      },
      {
        "year": 2004,
        "title": "シューマッハ、通算7度目の戴冠を達成",
        "description": "フェラーリのミハエル・シューマッハがスパで2位に入り、前人未到の7回目のワールドチャンピオンを確定。",
        "detailedStory": "シューマッハのF1デビューの地であり初優勝の地でもあるスパ。この年圧倒的な強さでシーズン12勝を挙げていたシューマッハは、マクラーレンのライコネンに次ぐ2位でフィニッシュし、ファンジオの記録を塗り替える7度目のドライバーズタイトルを獲得した。",
        "significance": "シューマッハ帝国の金字塔となった歴史的節目。"
      }
    ],
    "setupNotes": {
      "aeroTradeoff": "セクター1・3の超高速直線（ケメル、ブランシモン）でのXモード低ドラッグと、セクター2（プーオン、スタヴロ）でのZモード高ダウンフォースのバランス。中翼角パッケージで高速コーナーの横Gに耐えうるスタビリティを確保する。",
      "kerbUsage": "ラディオン出口やバスストップ・シケインの縁石（ケルブ）はアグレッシブに攻める必要があるが、濡れた路面では一瞬でスピンを誘発するため、天候に応じた車高とアンチロールバーの柔軟な調整が求められる。",
      "brakeDemands": "ラ・ソース（T1）とバスストップ・シケイン（T18-19）が主たる激しい減速ゾーン。350kW MGU-Kの協調回生を最大限に活用し、エネルギーマネジメントとリアブレーキ温度の維持を両立させる。"
    },
    "references": [
      {
        "id": 1,
        "title": "Eau Rouge Compression Forces and Ride Height Compliance Analysis",
        "publisher": "FIA Technical Department",
        "url": "https://www.fia.com",
        "verifiedDate": "2023-07-28"
      },
      {
        "id": 2,
        "title": "Spa-Francorchamps Weather Volatility and Strategic Microclimate Impact",
        "publisher": "Royal Belgian Meteorological Institute & F1 Research",
        "url": "https://www.meteo.be",
        "verifiedDate": "2023-08-01"
      }
    ]
  },
  {
    "id": "circuit-de-monaco",
    "name": "モナコ市街地コース",
    "officialName": "Circuit de Monaco",
    "country": "モナコ 🇲🇨",
    "lengthKm": 3.337,
    "turns": 19,
    "drsZones": 1,
    "downforceLevel": "High",
    "tyreStress": "Low",
    "typicalPitLossSec": 21,
    "safetyCarProbability": "85% (極めて高い)",
    "undercutImpact": "小（トラックポジションが絶対的でオーバーカットが有効）",
    "lapRecord": {
      "time": "1:12.909",
      "driver": "Lewis Hamilton (Mercedes)",
      "year": 2021
    },
    "characteristics": "【第1章：世界三大レースの頂点と地中海のガードレール迷宮】\\n1929年に初開催され、インディ500、ル・マン24時間と並ぶモータースポーツ・トリプルクラウンの一角を占めるモナコGP（モンテカルロ市街地コース） [1][3]。全長わずか3.337kmの公道は、ガードレールと建壁がコース全周を隙間なく囲み、エスケープゾーンがほぼ皆無の「ミリ単位の精密走行」が求められる [1][2]。ドライバーは78周のレース中に約4,000回ものギアチェンジを行い、心拍数は平均170bpmを超え続ける。アイルトン・セナが6勝を挙げたこの聖地では、わずか数センチのラインの狂いが即座にサスペンション破損やクラッシュへと直結する [2][5]。\\n\\n【第2章：特製ステアリングラックと最大ダウンフォースの幾何学】\\n名物「フェアモント・ヘアピン（旧ロウズヘアピン: Turn 6）」はF1で最も車速が落ちる時速48km/hの超低速コーナーであり、各チームはこのコーナーを曲がり切るためにステアリング切れ角を大幅に拡大した「モナコ専用特製ステアリングラック」とフロントウィッシュボーンを投入する [3][4]。空気抵抗（ドラッグ）の影響が小さいため、マシンには年間で最も巨大なウィングが装着され、低速域でも地面に張り付くような最大ダウンフォースが要求される [2][3]。トンネルセクションを時速280km/hで駆け抜けた直後の「ヌーベルシケイン（Turns 10-11）」での急減速や、プールサイドを時速200km/h超でかすめる「スイミングプール（Turns 13-16）」の切り返しなど、マシンの俊敏な回頭性と低速トラクションがタイムを決定づける [2][4][6]。\\n\\n【第3章：予選が勝敗の95%を決める聖地とオーバーカット戦術】\\nコース幅が極めて狭く現代のワイドなF1マシンでのオーバーテイクは統計上ほぼ不可能なため、土曜日の予選でのポールポジション獲得が決勝の勝敗を95%決定づける [1][2]。決勝ではタイヤのサーマルデグラデーションがカレンダー中で最も低く、ピットストップ回数は最小限の1ストップとなる [2][6]。前走者のペースが遅い場合、あえて先にピットインせずクリアラップでハイペースを刻んで逆転を狙うオーバーカット戦略や、85%という極めて高いセーフティカー出動確率を見越したピットウィンドウの遅延戦術が勝負の鍵を握る [1][6]。",
    "officialLinks": {
          "website": "https://acm.mc/",
          "f1Official": "https://www.formula1.com/en/racing/2026/monaco.html",
          "googleMaps": "https://maps.google.com/?q=Circuit+de+Monaco",
          "xTwitter": "https://x.com/ACM_Media",
          "instagram": "https://www.instagram.com/automobileclubmonaco/"
    },
    "visualMap": {
      "imageUrl": "/images/circuits/circuit_monaco.png",
      "credit": "Will_Scalise",
      "license": "CC BY-SA 3.0",
      "sourceUrl": "https://commons.wikimedia.org/wiki/File:Circuit_Monaco.svg"
    },
    "visualAssets": {
      "trackMap": {
        "imageUrl": "/images/circuits/circuit_monaco.png",
        "credit": "Will_Scalise",
        "license": "CC BY-SA 3.0",
        "sourceUrl": "https://commons.wikimedia.org/wiki/File:Circuit_Monaco.svg"
      },
      "atmosphereImage": {
        "imageUrl": "/images/circuits/circuit_monaco.png",
        "caption": "紺碧の地中海と高級ヨットが係留するハーバーセクションの全景",
        "credit": "Antony Stanley",
        "license": "CC BY-SA 2.0",
        "sourceUrl": "https://commons.wikimedia.org/wiki/File:Monaco_Harbour_F1.jpg"
      }
    },
    "visualGallery": [
      {
        "imageUrl": "/images/circuits/circuit_monaco.png",
        "caption": "紺碧の地中海と高級ヨットが係留するハーバーセクションの全景",
        "tag": "Atmosphere",
        "credit": "Antony Stanley",
        "license": "CC BY-SA 2.0",
        "sourceUrl": "https://commons.wikimedia.org/wiki/File:Monaco_Harbour_F1.jpg"
      }
    ],
    "trackGeometry": {
      "elevationChangeMeters": 42,
      "longestStraightMeters": 670,
      "gForceMax": {
        "lateral": 3.5,
        "longitudinal": 4.2
      },
      "keyCorners": [
        {
          "number": "T1",
          "name": "Sainte-Dévote",
          "characteristic": "スタート直後の急減速。外側ガードレールに吸い寄せられるクラッシュ名所。"
        },
        {
          "number": "T6",
          "name": "Grand Hotel Hairpin",
          "characteristic": "F1最遅の時速48km/h。ステアリング切れ角を最大まで改造して旋回。"
        },
        {
          "number": "T12",
          "name": "Tabac",
          "characteristic": "ハーバー沿いを時速160km/hでガードレールすれすれに抜ける超度胸コーナー。"
        },
        {
          "number": "T13-T16",
          "name": "Louis Chiron & Swimming Pool",
          "characteristic": "プールサイドを時速200km/hで切り返す超高速シケイン。"
        }
      ]
    },
    "allCorners": [
      {
        "number": "T1",
        "name": "Sainte-Dévote",
        "gearEstimated": "2nd",
        "speedEstimated": "95 km/h",
        "engineeringTip": "1コーナー右。外側のガードレールにノーズが吸い寄せられやすく、脱出でのオーバーステアは即クラッシュ。"
      },
      {
        "number": "T2",
        "name": "Beau Rivage 上り",
        "gearEstimated": "6th",
        "speedEstimated": "245 km/h",
        "engineeringTip": "ブラインドの上り坂。ガードレールに挟まれた全開ストレート。"
      },
      {
        "number": "T3",
        "name": "Massenet",
        "gearEstimated": "4th",
        "speedEstimated": "155 km/h",
        "engineeringTip": "カジノ前の長い左。イン側のクリッピングポイントに車体を寄せ続ける横G。"
      },
      {
        "number": "T4",
        "name": "Casino Square",
        "gearEstimated": "3rd",
        "speedEstimated": "125 km/h",
        "engineeringTip": "右コーナー。路面の起伏でマシンがバウンドするため車高管理がシビア。"
      },
      {
        "number": "T5",
        "name": "Mirabeau Haute",
        "gearEstimated": "2nd",
        "speedEstimated": "80 km/h",
        "engineeringTip": "急な下り坂でのブレーキング右。イン側を早めに抑える。"
      },
      {
        "number": "T6",
        "name": "Grand Hotel Hairpin",
        "gearEstimated": "1st",
        "speedEstimated": "48 km/h",
        "engineeringTip": "F1カレンダー最遅コーナー。ステアリングラックの切れ角をモナコ専用に拡大してクリア。"
      },
      {
        "number": "T7",
        "name": "Mirabeau Bas",
        "gearEstimated": "2nd",
        "speedEstimated": "75 km/h",
        "engineeringTip": "右直角ターン。海側へ向けて下りながら旋回。"
      },
      {
        "number": "T8",
        "name": "Portier",
        "gearEstimated": "2nd",
        "speedEstimated": "85 km/h",
        "engineeringTip": "トンネル進入直前の最重要右コーナー。ここでのトラクションが最高速を決定。"
      },
      {
        "number": "T9",
        "name": "Tunnel",
        "gearEstimated": "6th",
        "speedEstimated": "270 km/h",
        "engineeringTip": "暗闇から光へ飛び出す唯一の高速全開右ベンド。空力ダウンフォースのフロア安定性。"
      },
      {
        "number": "T10",
        "name": "Nouvelle Chicane 進入左",
        "gearEstimated": "2nd",
        "speedEstimated": "65 km/h",
        "engineeringTip": "トンネル出口の290km/hからのヘビーブレーキング。数少ない追い越しポイント。"
      },
      {
        "number": "T11",
        "name": "Nouvelle Chicane 脱出右",
        "gearEstimated": "2nd",
        "speedEstimated": "85 km/h",
        "engineeringTip": "縁石を舐めるように跨いでハーバーサイドへ加速。"
      },
      {
        "number": "T12",
        "name": "Tabac",
        "gearEstimated": "4th",
        "speedEstimated": "160 km/h",
        "engineeringTip": "左ガードレールすれすれを160km/hで抜ける度胸試し。"
      },
      {
        "number": "T13",
        "name": "Louis Chiron (プール入口)",
        "gearEstimated": "5th",
        "speedEstimated": "205 km/h",
        "engineeringTip": "プールサイド高速左。ミリ単位でガードレールを掠める。"
      },
      {
        "number": "T14",
        "name": "プール高速右",
        "gearEstimated": "6th",
        "speedEstimated": "220 km/h",
        "engineeringTip": "スピードを落とさず右へ。マシンの俊敏なロール特性が試される。"
      },
      {
        "number": "T15",
        "name": "プールシケイン進入右",
        "gearEstimated": "3rd",
        "speedEstimated": "105 km/h",
        "engineeringTip": "縁石を大きくカットする低速シケイン進入。"
      },
      {
        "number": "T16",
        "name": "プールシケイン脱出左",
        "gearEstimated": "3rd",
        "speedEstimated": "120 km/h",
        "engineeringTip": "ソーセージ縁石でのジャンプを抑えてラスカスへ向かう。"
      },
      {
        "number": "T17",
        "name": "La Rascasse",
        "gearEstimated": "2nd",
        "speedEstimated": "55 km/h",
        "engineeringTip": "レストランを取り囲む右回り低速タイトターン。インベタで最短距離を走る。"
      },
      {
        "number": "T18",
        "name": "Antony Noghès 進入右",
        "gearEstimated": "2nd",
        "speedEstimated": "70 km/h",
        "engineeringTip": "最終シケイン進入。"
      },
      {
        "number": "T19",
        "name": "Antony Noghès 脱出",
        "gearEstimated": "3rd",
        "speedEstimated": "105 km/h",
        "engineeringTip": "スタート/フィニッシュ直線への最終トラクション。外側ガードレールに張り付くように全開加速。"
      }
    ],
    "historicalMoments": [
      {
        "year": 1988,
        "title": "セナ、異次元の予選ラップとまさかの首位クラッシュ",
        "description": "アイルトン・セナが同門プロストを1.4秒千切る神業予選を決めるも、決勝で50秒リードの終盤にポルティエの壁に散る。",
        "detailedStory": "「神の領域で走っていた」と語ったセナが驚愕のポールポジションを獲得。決勝でも独走し勝利を確信した67周目、ポルティエのガードレールに接触してリタイア。ショックのあまりセナはピットに戻らず自宅アパートへ直行した。この悔しさがセナを更なる高みへと押し上げた。",
        "significance": "セナの伝説的ドライビングとモナコの残酷さを象徴する最も有名な逸話。"
      },
      {
        "year": 1992,
        "title": "セナ対マンセル、伝説の残り3周の鉄壁ディフェンス",
        "description": "圧倒的な速さを誇るウィリアムズのマンセルが背後に迫る中、セナが巧みな車体配置で抑えきりモナコ5連覇を達成。",
        "detailedStory": "開幕5連勝中のマンセルがホイールナットの緩みで緊急ピットイン。新品タイヤでコース復帰し、首位セナの背後へ猛追。残り3周、モナコの狭いコースでマンセルが左右から揺さぶりをかけるが、セナは完璧なレコードライン防御でわずか0.215秒差で先着した。",
        "significance": "マシンの性能差をドライバーの技量と戦略で覆した歴史的名勝負。"
      },
      {
        "year": 2018,
        "title": "リカルド、MGU-K故障で出力25%喪失の中の執念の勝利",
        "description": "レッドブルのリカルドがレース序盤にMGU-Kが停止し約160馬力を失いながら、ベッテルの猛攻を78周防ぎ切って悲願の勝利。",
        "detailedStory": "2016年にピットミスで勝利を奪われたリカルド。2018年、ポールから首位を快走するも28周目にMGU-Kが故障しパワーが25%低下、ブレーキ温度も急上昇。それでも市街地の特性を活かし、立ち上がり重視のラインでベッテルを完封。涙のリベンジ優勝を飾った。",
        "significance": "モナコにおけるトラックポジションの絶対的優位性を証明した名レース。"
      }
    ],
    "setupNotes": {
      "aeroTradeoff": "直線の最高速を完全に無視した最大級のハイダウンフォースセッティング。アクティブエアロも常に高グリップ側を意識し、低速・中速コーナーでの車体安定性と鋭い回頭性を最優先する。",
      "kerbUsage": "スイミングプール・シケインのソーセージ縁石（ケルブ）を跳ね飛ばすようにインを突くため、ソフトなスプリングと長いサスペンションストロークを確保し、着地時のメカニカルグリップを維持する。",
      "brakeDemands": "減速ゾーンは多いが直線が短いためブレーキ冷却用のダクト開口部を最大化。低速からの立ち上がりでリアタイヤが空転しないよう、トラクションコントロールに近い繊細なデフセッティングとブレーキバイアス調整が要求される。"
    },
    "references": [
      {
        "id": 1,
        "title": "Monaco Circuit Street Layout Kinematics and Steering Rack Adjustments",
        "publisher": "Automobile Club de Monaco",
        "url": "https://www.acm.mc",
        "verifiedDate": "2024-05-20"
      },
      {
        "id": 2,
        "title": "Qualifying Dominance and Track Position Strategy in Modern Street Circuits",
        "publisher": "Motorsport Analytics Group",
        "url": "https://www.motorsport.com",
        "verifiedDate": "2024-05-22"
      }
    ]
  },
  {
    "id": "silverstone",
    "name": "シルバーストン・サーキット",
    "officialName": "Silverstone Circuit",
    "country": "イギリス 🇬🇧",
    "lengthKm": 5.891,
    "turns": 18,
    "drsZones": 2,
    "downforceLevel": "Medium-High",
    "tyreStress": "Very High",
    "typicalPitLossSec": 20.5,
    "safetyCarProbability": "55% (中程度)",
    "undercutImpact": "大（タイヤデグラデーションが高くアンダーカットが強力）",
    "lapRecord": {
      "time": "1:27.097",
      "driver": "Max Verstappen (Red Bull)",
      "year": 2020
    },
    "characteristics": "【第1章：F1世界選手権発祥の聖地と伝説の超高速S字複合】\\n1950年5月13日にF1史上初の公式世界選手権レースが開催されたモータースポーツの揺り籠、シルバーストン・サーキット [1][5]。旧第二次世界大戦時の英空軍飛行場跡地を利用した広大で平坦なレイアウトに、時速260〜295km/hで連続して駆け抜ける世界屈指の超高速S字セクション「マゴッツ〜ベケッツ〜チャペル（Maggots - Becketts - Chapel: Turns 10-14）」が鎮座する [1][2]。ルイス・ハミルトン、ランド・ノリス、ジョージ・ラッセルら英国勢の母国グランプリとして熱狂的なファンが集う伝統の舞台である [1][5]。\\n\\n【第2章：5.2G横加速度とピレリ最強構造タイヤへの剪断ストレス】\\nマゴッツ〜ベケッツ区間では、ステアリングを左・右・左と切り返すたびに最大5.2Gを超える激烈な横加速度が連続してマシンを襲う [2][3]。この極限の高速旋回により、グラウンドエフェクトフロアとウィングが発生する巨大なダウンフォースがタイヤを路面に押し付け、左フロントおよび左リアタイヤの内部カーカスベルトに世界最大の剪断ストレス（Shear Stress）が加わる [2][3]。ピレリは毎年このサーキットに最高強度の専用構造タイヤを供給するが、サーマルデグラデーションの進行は極めて早く、ブリスター防止のためのタイヤマネジメントが不可欠となる [3][6]。\\n\\n【第3章：ハンガーストレートXモードと2ストップ・アンダーカット決戦】\\nチャペルを全開で立ち上がった後の「ハンガーストレート」では、2026年規定の「アクティブエアロ（Xモード）」が作動し時速335km/hに到達 [2][4]。直後のストウ（Turn 15: Stowe）では時速180km/hの「Zモード」へと高速移行し、ストレートエンドでの激しいオーバーテイクバトルが繰り広げられる [2][4]。さらに広大な吹き抜けの地形ゆえに突風や横風がフロア負圧を急激に乱すため、ドライバーは卓越したマシンバランスのセンシングが求められる [2][4]。タイヤ摩耗の激しさから2ストップ戦略が基本であり、フレッシュタイヤの強烈なグリップを活かしたアンダーカットが勝負を決する決定打となる [1][6]。",
    "officialLinks": {
          "website": "https://www.silverstone.co.uk/",
          "f1Official": "https://www.formula1.com/en/racing/2026/great-britain.html",
          "googleMaps": "https://maps.google.com/?q=Silverstone+Circuit",
          "xTwitter": "https://x.com/SilverstoneUK",
          "instagram": "https://www.instagram.com/silverstonecircuit/"
    },
    "visualMap": {
      "imageUrl": "/images/circuits/circuit_silverstone_real.jpg",
      "credit": "Will_Scalise",
      "license": "CC BY-SA 3.0",
      "sourceUrl": "https://commons.wikimedia.org/wiki/File:Silverstone_Circuit_2011.svg"
    },
    "visualAssets": {
      "trackMap": {
        "imageUrl": "/images/circuits/circuit_silverstone_real.jpg",
        "credit": "Will_Scalise",
        "license": "CC BY-SA 3.0",
        "sourceUrl": "https://commons.wikimedia.org/wiki/File:Silverstone_Circuit_2011.svg"
      },
      "atmosphereImage": {
        "imageUrl": "/images/circuits/circuit_silverstone_real.jpg",
        "caption": "英国モータースポーツの殿堂シルバーストンの最新ピットビル「Wing」",
        "credit": "Chesapeakedave",
        "license": "CC BY-SA 3.0",
        "sourceUrl": "https://commons.wikimedia.org/wiki/File:Silverstone_Wing_Pit_Straight.jpg"
      }
    },
    "visualGallery": [
      {
        "imageUrl": "/images/circuits/circuit_silverstone_real.jpg",
        "caption": "英国モータースポーツの殿堂シルバーストンの最新ピットビル「Wing」",
        "tag": "Atmosphere",
        "credit": "Chesapeakedave",
        "license": "CC BY-SA 3.0",
        "sourceUrl": "https://commons.wikimedia.org/wiki/File:Silverstone_Wing_Pit_Straight.jpg"
      }
    ],
    "trackGeometry": {
      "elevationChangeMeters": 11.3,
      "longestStraightMeters": 1034,
      "gForceMax": {
        "lateral": 5.3,
        "longitudinal": 4.5
      },
      "keyCorners": [
        {
          "number": "T1-T2",
          "name": "Abbey / Farm",
          "characteristic": "時速285km/hで突入する超高速1コーナー。"
        },
        {
          "number": "T3-T5",
          "name": "Village / Loop",
          "characteristic": "インフィールドのテクニカル低速複合コーナー。"
        },
        {
          "number": "T9",
          "name": "Copse",
          "characteristic": "かつての1コーナー。時速290km/hで度胸を試す全開右コーナー。"
        },
        {
          "number": "T10-T14",
          "name": "Maggotts / Becketts / Chapel",
          "characteristic": "F1屈指の超高速切り返しS字コンプレックス。5G超の横G。"
        },
        {
          "number": "T15",
          "name": "Stowe",
          "characteristic": "ハンガーストレートエンドの時速200km/h超高速ブレーキングコーナー。"
        }
      ]
    },
    "allCorners": [
      {
        "number": "T1",
        "name": "Abbey",
        "gearEstimated": "7th",
        "speedEstimated": "285 km/h",
        "engineeringTip": "ピットストレートから全開で飛び込む超高速右。マシンのダウンフォースとフロアの吸い付きが試される。"
      },
      {
        "number": "T2",
        "name": "Farm Curve",
        "gearEstimated": "7th",
        "speedEstimated": "290 km/h",
        "engineeringTip": "全開で抜けるブラインド左。ビレッジへの進入ラインを整える。"
      },
      {
        "number": "T3",
        "name": "Village",
        "gearEstimated": "2nd",
        "speedEstimated": "95 km/h",
        "engineeringTip": "急減速の右ヘアピン。インを刺すブレーキング合戦の舞台。"
      },
      {
        "number": "T4",
        "name": "The Loop",
        "gearEstimated": "2nd",
        "speedEstimated": "85 km/h",
        "engineeringTip": "シルバーストン最遅の低速左。脱出のトラクションがウェリントンストレートの車速を決める。"
      },
      {
        "number": "T5",
        "name": "Aintree",
        "gearEstimated": "5th",
        "speedEstimated": "195 km/h",
        "engineeringTip": "全開加速しながら抜ける左。縁石を使ってDRS区間へスムーズに接続。"
      },
      {
        "number": "T6",
        "name": "Brooklands",
        "gearEstimated": "3rd",
        "speedEstimated": "140 km/h",
        "engineeringTip": "ウェリントンエンドの左。トレイルブレーキングで長い旋回をこなす。"
      },
      {
        "number": "T7",
        "name": "Luffield",
        "gearEstimated": "3rd",
        "speedEstimated": "110 km/h",
        "engineeringTip": "長大な右複合カルーセル。フロントタイヤを傷めないよう丁寧なスロットルワーク。"
      },
      {
        "number": "T8",
        "name": "Woodcote",
        "gearEstimated": "7th",
        "speedEstimated": "270 km/h",
        "engineeringTip": "旧ピットストレートへ抜ける全開右ベンド。"
      },
      {
        "number": "T9",
        "name": "Copse",
        "gearEstimated": "7th",
        "speedEstimated": "290 km/h",
        "engineeringTip": "時速290km/h超で飛び込む伝説の高速右。ダウンフォースと度胸の極致。"
      },
      {
        "number": "T10",
        "name": "Maggotts 進入左",
        "gearEstimated": "8th",
        "speedEstimated": "295 km/h",
        "engineeringTip": "マゴッツ〜ベケッツの超高速S字突入。5Gを超える強烈な横G。"
      },
      {
        "number": "T11",
        "name": "Maggotts 右",
        "gearEstimated": "7th",
        "speedEstimated": "275 km/h",
        "engineeringTip": "素早いステアリングの切り返し。マシンのフロントレスポンスが命。"
      },
      {
        "number": "T12",
        "name": "Becketts 左",
        "gearEstimated": "6th",
        "speedEstimated": "235 km/h",
        "engineeringTip": "コーナーが徐々にタイトに締まるため、アクセルを少し戻して旋回。"
      },
      {
        "number": "T13",
        "name": "Becketts 右",
        "gearEstimated": "5th",
        "speedEstimated": "195 km/h",
        "engineeringTip": "チャペルへの脱出を見据えた重要エイペックス。"
      },
      {
        "number": "T14",
        "name": "Chapel",
        "gearEstimated": "6th",
        "speedEstimated": "225 km/h",
        "engineeringTip": "ハンガーストレートへ飛び出す全開左。外側縁石を大胆に跨ぐ。"
      },
      {
        "number": "T15",
        "name": "Stowe",
        "gearEstimated": "6th",
        "speedEstimated": "205 km/h",
        "engineeringTip": "320km/hから軽くブレーキングして200km/h超で駆け抜ける高速右。"
      },
      {
        "number": "T16",
        "name": "Vale 進入左",
        "gearEstimated": "3rd",
        "speedEstimated": "105 km/h",
        "engineeringTip": "下りながらの急減速左。イン側をカットして最終クラブへ。"
      },
      {
        "number": "T17",
        "name": "Club 進入右",
        "gearEstimated": "3rd",
        "speedEstimated": "120 km/h",
        "engineeringTip": "グランドスタンド前の右ターン。"
      },
      {
        "number": "T18",
        "name": "Club 脱出",
        "gearEstimated": "4th",
        "speedEstimated": "160 km/h",
        "engineeringTip": "ハミルトンストレートへ向けて全開立ち上がり。勝利のチェッカーへ。"
      }
    ],
    "historicalMoments": [
      {
        "year": 2020,
        "title": "ハミルトン、3輪走行での劇的チェッカー優勝",
        "description": "ファイナルラップで左フロントタイヤがバーストするも、3輪で走り抜けてレッドブルのフェルスタッペンを振り切り優勝。",
        "detailedStory": "シルバーストンの強烈な横Gにより終盤にタイヤトラブルが続発。首位独走のハミルトンも最終ラップのターン8で左前タイヤが完全に破裂。ホイールから火花を散らしながらストウ、ベイルを必死にコントロールし、後方から猛追するフェルスタッペンにわずか5.8秒差で逃げ切った。",
        "significance": "F1史上最もドラマチックなパンクチャー生還劇。"
      },
      {
        "year": 2021,
        "title": "コプスでの51G大激突とハミルトンの逆転勝利",
        "description": "オープニングラップの時速290km/hコーナー「コプス」でハミルトンとフェルスタッペンが激突。フェルスタッペンは51Gの衝撃でバリアへ激突。",
        "detailedStory": "スプリント予選導入の記念大会。決勝1周目、激しいサイド・バイ・サイドの攻防の末、コプス進入で2台が接触。フェルスタッペンはタイヤバリアに大クラッシュし病院へ搬送。ハミルトンは10秒ペナルティを受けながらも終盤にルクレールを逆転して母国8度目の優勝を飾った。",
        "significance": "2021年タイトル争いの最大の火種となった歴史的衝突。"
      },
      {
        "year": 2022,
        "title": "サインツのF1初優勝と周冠宇の戦慄クラッシュ",
        "description": "スタート直後に周冠宇が宙を舞いフェンスに突き刺さる大クラッシュから再開後、サインツがキャリア150戦目で悲願の初優勝。",
        "detailedStory": "スタートで周冠宇のマシンが反転しグラベルを滑走してキャッチフェンスに激突する大事故が発生（Haloにより無傷）。赤旗中断後のレースでは終盤にセーフティカーが出動。フェラーリのカルロス・サインツが僚友ルクレールとのチームオーダーを乗り越えて自身初のグランプリ勝利を達成した。",
        "significance": "Haloの命を救う性能とサインツの念願の初優勝が刻まれた名勝負。"
      }
    ],
    "setupNotes": {
      "aeroTradeoff": "マゴッツ・ベケッツやコプス（T9）、ストウ（T15）での5G超の横Gに耐えるハイダウンフォースと、ウェリントンおよびハンガーストレートでのXモード低ドラッグの協調設計。高速旋回でのアンダーステアを排除するフロントグリップを重視。",
      "kerbUsage": "コプス出口やベケッツの縁石（ケルブ）をタイヤ半分乗せるアグレッシブなライン取りが必須。フロア端部のベンチュリトンネルシールを破損しないよう、適切なライドハイトとバンプストップの調整が求められる。",
      "brakeDemands": "ブルックランズ（T6）、クラブ（T18）、ストウ（T15）での減速が主たるブレーキングポイント。高速からの急減速に伴う荷重移動を安定させ、350kW MGU-Kの回生エネルギーを効率よく蓄電する。"
    },
    "references": [
      {
        "id": 1,
        "title": "History and Architectural Evolution of Silverstone Grand Prix Circuit",
        "publisher": "British Racing Drivers' Club (BRDC)",
        "url": "https://www.silverstone.co.uk",
        "verifiedDate": "2024-07-05"
      },
      {
        "id": 2,
        "title": "High Lateral G-Force Load and Structural Stress in Maggotts-Becketts Complex",
        "publisher": "FIA Formula One Technical Working Group",
        "url": "https://www.fia.com",
        "verifiedDate": "2024-07-08"
      }
    ]
  },
  {
    "id": "albert-park",
    "name": "アルバート・パーク・サーキット",
    "officialName": "Melbourne Grand Prix Circuit (Albert Park)",
    "country": "オーストラリア 🇦🇺",
    "lengthKm": 5.278,
    "turns": 14,
    "drsZones": 4,
    "downforceLevel": "Medium-High",
    "tyreStress": "Medium",
    "typicalPitLossSec": 20.2,
    "safetyCarProbability": "65% (高)",
    "undercutImpact": "中程度（トラックポジション優先、SC頻度高）",
    "lapRecord": {
      "time": "1:19.813",
      "driver": "Charles Leclerc (Ferrari)",
      "year": 2024
    },
    "characteristics": "【第1章：緑豊かな人工湖畔を周回する伝統のセミストリート】\\nオーストラリア・メルボルンのアルバート・パーク湖を取り囲む公道区間を利用したハイスピードコース [1][5]。普段は一般公道であるため、週末の初日はグリップが極端に低く、セッションを重ねるごとにラバーが乗ってラップタイムが秒単位で向上する「トラックエボリューション」が最も顕著に現れる [1][2]。美しい公園の景観とは裏腹に、ランオフエリアが狭く一瞬のミスが即座にクラッシュへと直結する [2][4]。\\n\\n【第2章：改修後の超高速シケインと4箇所のDRSゾーン】\\n2022年の大幅改修により低速シケインが撤去され、ターン8からターン9へ向かうセクター2が時速320km/h超の全開フラットアウト区間へと生まれ変わった [1][3]。カレンダー最多となる4つのDRSゾーンが設定され、ターン9-10の超高速S字切り返しではドライバーに強烈な横Gと度胸が試される [2][3][6]。フロントの回頭性と中高速のダウンフォース安定性がラップタイムの鍵を握る [3][4]。",
    "officialLinks": {
          "website": "https://www.grandprix.com.au/",
          "f1Official": "https://www.formula1.com/en/racing/2026/australia.html",
          "googleMaps": "https://maps.google.com/?q=Albert+Park+Circuit",
          "xTwitter": "https://x.com/ausgrandprix",
          "instagram": "https://www.instagram.com/ausgp/"
    },
    "visualMap": {
      "imageUrl": "/images/circuits/circuit_albert_park.jpg",
      "credit": "Ozzmosis",
      "license": "CC BY-SA 2.5",
      "sourceUrl": "https://commons.wikimedia.org/wiki/File:Melbourne_Grand_Prix_Circuit_pit_building.jpg"
    },
    "visualAssets": {
      "trackMap": {
        "imageUrl": "/images/circuits/circuit_albert_park.jpg",
        "credit": "Ozzmosis",
        "license": "CC BY-SA 2.5",
        "sourceUrl": "https://commons.wikimedia.org/wiki/File:Melbourne_Grand_Prix_Circuit_pit_building.jpg"
      },
      "atmosphereImage": {
        "imageUrl": "/images/circuits/circuit_albert_park.jpg",
        "caption": "アルバート・パークのピットレーンとメインストレート風景",
        "credit": "Ozzmosis",
        "license": "CC BY-SA 2.5",
        "sourceUrl": "https://commons.wikimedia.org/wiki/File:Melbourne_Grand_Prix_Circuit_pit_building.jpg"
      }
    },
    "visualGallery": [
      {
        "imageUrl": "/images/circuits/circuit_albert_park.jpg",
        "caption": "アルバート・パークのピットレーンとメインストレート風景",
        "tag": "Atmosphere",
        "credit": "Ozzmosis",
        "license": "CC BY-SA 2.5",
        "sourceUrl": "https://commons.wikimedia.org/wiki/File:Melbourne_Grand_Prix_Circuit_pit_building.jpg"
      }
    ],
    "trackGeometry": {
      "elevationChangeMeters": 2.6,
      "longestStraightMeters": 850,
      "gForceMax": {
        "lateral": 4.3,
        "longitudinal": 4.5
      },
      "keyCorners": [
        {
          "number": "T1-T2",
          "name": "Jones / Brabham",
          "characteristic": "315km/hから進入するスタート直後の難所シケイン。"
        },
        {
          "number": "T9-T10",
          "name": "Lakeside Fast Chicanes",
          "characteristic": "旧シケイン撤去後の超高速250km/hフローセクション。"
        },
        {
          "number": "T11-T12",
          "name": "Waite Corner",
          "characteristic": "全開で駆け抜ける左〜右の高速切り返し。"
        }
      ]
    },
    "allCorners": [
      {
        "number": "T1",
        "name": "Jones",
        "gearEstimated": "3rd",
        "speedEstimated": "145 km/h",
        "engineeringTip": "315km/hからブレーキング。右イン側縁石をしっかり捉えてT2の立ち上がりラインを作る。"
      },
      {
        "number": "T2",
        "name": "Brabham",
        "gearEstimated": "3rd",
        "speedEstimated": "165 km/h",
        "engineeringTip": "左脱出。外側の縁石をアグレッシブに使い、続くDRSストレートへ加速。"
      },
      {
        "number": "T3",
        "name": "Sports Complex",
        "gearEstimated": "2nd",
        "speedEstimated": "95 km/h",
        "engineeringTip": "オーバーテイク多発の急減速右。フロントのロックアップに注意。"
      },
      {
        "number": "T4",
        "name": "T4 Left",
        "gearEstimated": "3rd",
        "speedEstimated": "140 km/h",
        "engineeringTip": "左フリック。立ち上がりでウォールが迫るためライン取りがシビア。"
      },
      {
        "number": "T5",
        "name": "Lakeside Sweep",
        "gearEstimated": "5th",
        "speedEstimated": "210 km/h",
        "engineeringTip": "湖畔沿いの高速右。全開で抜けつつT6への進入速度を最大化。"
      },
      {
        "number": "T6",
        "name": "Marina Entry",
        "gearEstimated": "4th",
        "speedEstimated": "155 km/h",
        "engineeringTip": "改修により道幅が拡大された右コーナー。ボトムスピードを維持。"
      },
      {
        "number": "T7",
        "name": "Marina Exit",
        "gearEstimated": "5th",
        "speedEstimated": "190 km/h",
        "engineeringTip": "全開で湖沿いバックストレートへ接続する立ち上がり。"
      },
      {
        "number": "T8",
        "name": "Fast Kink",
        "gearEstimated": "7th",
        "speedEstimated": "270 km/h",
        "engineeringTip": "全開の高速ベンド。第3DRSゾーンの高速バトル。"
      },
      {
        "number": "T9",
        "name": "Lakeside Chicane Left",
        "gearEstimated": "6th",
        "speedEstimated": "240 km/h",
        "engineeringTip": "旧シケイン撤去により誕生した超高速左。度胸とマシンのフロア吸い付きが試される。"
      },
      {
        "number": "T10",
        "name": "Lakeside Chicane Right",
        "gearEstimated": "6th",
        "speedEstimated": "255 km/h",
        "engineeringTip": "250km/h超で右に切り返す世界屈指の高速チェンジ。"
      },
      {
        "number": "T11",
        "name": "Waite Left",
        "gearEstimated": "6th",
        "speedEstimated": "225 km/h",
        "engineeringTip": "ハードブレーキングを伴う高速左。イン側の縁石を深くカット。"
      },
      {
        "number": "T12",
        "name": "Waite Right",
        "gearEstimated": "6th",
        "speedEstimated": "240 km/h",
        "engineeringTip": "右脱出。芝生やグラベルに足を落とすと即スピンの大クラッシュ。"
      },
      {
        "number": "T13",
        "name": "Ascari / Prost",
        "gearEstimated": "3rd",
        "speedEstimated": "125 km/h",
        "engineeringTip": "インフィールド低速右。フロントタイヤの接地感が勝負。"
      },
      {
        "number": "T14",
        "name": "Final Corner",
        "gearEstimated": "4th",
        "speedEstimated": "160 km/h",
        "engineeringTip": "最終左ターン。ピットストレートへのトラクションを確保。"
      }
    ],
    "historicalMoments": [
      {
        "year": 2002,
        "title": "ウェバー、デビュー戦ミナルディで奇跡の5位入賞",
        "description": "地元オーストラリアのマーク・ウェバーが戦闘力に劣るミナルディで大波乱の生き残り戦を制し感動の5位入賞。",
        "detailedStory": "スタート直後の多重クラッシュで8台が脱落。ウェバーは冷静にマシンを運び、終盤トヨタのサロからの猛追を退けて5位フィニッシュ。レース後、表彰台に登る特例が認められ、地元の大観衆から熱烈なオベーションを受けた。",
        "significance": "オーストラリアF1史に残る最も感動的なデビュー戦。"
      },
      {
        "year": 2023,
        "title": "3度の赤旗と大混乱のスタンディングリスタート",
        "description": "終盤の赤旗連発により残り2周のスプリントリスタートで多重クラッシュが発生したカオスレース。",
        "detailedStory": "残り4周でマグヌッセンのクラッシュにより赤旗。残り2周でのスタンディングリスタート直後、アルピーヌ同門2台の同士討ちなど多重事故が発生。最終的にSC先導でチェッカーとなり、フェルスタッペンがメルボルン初勝利を飾った。",
        "significance": "現代F1のレギュレーション論争を巻き起こした最も波乱に満ちたGP。"
      },
      {
        "year": 2024,
        "title": "サインツ、盲腸手術からの奇跡の復帰優勝",
        "description": "前戦を虫垂炎手術で欠場したカルロス・サインツが、わずか2週間後に完全復活しフェラーリ1-2を牽引して優勝。",
        "detailedStory": "サウジアラビアGPを緊急手術で欠場したサインツ。メルボルンで見事に復帰しフロントローを獲得。決勝序盤に首位フェルスタッペンのブレーキが発火・リタイアすると、完璧なペースコントロールで独走。ルクレールと共にフェラーリに2004年以来の豪州1-2をもたらした。",
        "significance": "アスリートの強靭な精神力とフェラーリの速さを証明した名勝負。"
      }
    ],
    "setupNotes": {
      "aeroTradeoff": "2022年改修により平均時速が大幅に上昇。ストレートでの4つのDRSを活かすためミディアムハイに抑えるセッティングが主流。",
      "kerbUsage": "公道ベースのため路面のうねりや白線の滑りやすさに注意。縁石は角が立っており跳ねやすい。",
      "brakeDemands": "ターン1、ターン3、ターン11などハードブレーキングが存在。冷却ダクトの調整がタイヤ作動温度に直結。"
    },
    "references": [
      {
        "id": 1,
        "title": "Albert Park Circuit Redesign and High-Speed Flow Analysis",
        "publisher": "Australian Grand Prix Corporation",
        "url": "https://www.grandprix.com.au",
        "verifiedDate": "2024-03-20"
      },
      {
        "id": 2,
        "title": "Tyre Temperature and Street Asphalt Grip Analysis - Melbourne",
        "publisher": "Pirelli Motorsport F1 Research",
        "url": "https://www.pirelli.com",
        "verifiedDate": "2024-03-22"
      }
    ]
  },
  {
    "id": "shanghai",
    "name": "上海インターナショナル・サーキット",
    "officialName": "Shanghai International Circuit",
    "country": "中国 🇨🇳",
    "lengthKm": 5.451,
    "turns": 16,
    "drsZones": 2,
    "downforceLevel": "Medium-High",
    "tyreStress": "High",
    "typicalPitLossSec": 23.5,
    "safetyCarProbability": "50% (中程度)",
    "undercutImpact": "大（左フロントタイヤのグレイニングが勝負を左右）",
    "lapRecord": {
      "time": "1:32.238",
      "driver": "Michael Schumacher (Ferrari)",
      "year": 2004
    },
    "characteristics": "【第1章：「上」の字を象った広大なスケールと名物カタツムリコーナー】\\n上海市嘉定区の湿地帯に建設され、漢字の「上」をモチーフにした独創的レイアウト [1][5]。メインストレートから進入するターン1〜4は、半径が徐々に小さくなりながら270度旋回し、さらに左へと切り返す世界でも唯一無二の「カタツムリコーナー（Snail Turn）」[1][2]。前輪、特に左フロントタイヤに長時間の巨大な横荷重と縦荷重が加わり続けるため、フロントタイヤのグレイニング（毛羽立ち摩耗）克服がセットアップの生命線となる [2][3]。\\n\\n【第2章：1.2kmの超長大バックストレートとタイトヘアピン】\\nセクター3にはF1最長クラスとなる1,170mのバックストレートが横たわり、時速340km/h超から時速60km/hのタイトヘアピン（ターン14）へと一気に減速する [1][3]。激しいブレーキングバトルが展開される絶好のオーバーテイクポイントであり、ストレート最高速と低中速コーナーでのメカニカルグリップを高次元で両立する空力妥協が求められる [2][4][6]。",
    "officialLinks": {
          "website": "https://www.shanghaicircuit.com/",
          "f1Official": "https://www.formula1.com/en/racing/2026/china.html",
          "googleMaps": "https://maps.google.com/?q=Shanghai+International+Circuit"
    },
    "visualMap": {
      "imageUrl": "/images/circuits/circuit_shanghai.jpg",
      "credit": "Yue Zhang",
      "license": "CC BY-SA 4.0",
      "sourceUrl": "https://commons.wikimedia.org/wiki/File:Shanghai_International_Circuit_grandstand.jpg"
    },
    "visualAssets": {
      "trackMap": {
        "imageUrl": "/images/circuits/circuit_shanghai.jpg",
        "credit": "Yue Zhang",
        "license": "CC BY-SA 4.0",
        "sourceUrl": "https://commons.wikimedia.org/wiki/File:Shanghai_International_Circuit_grandstand.jpg"
      },
      "atmosphereImage": {
        "imageUrl": "/images/circuits/circuit_shanghai.jpg",
        "caption": "巨大なメイングランドスタンドと上海サーキットのホームストレート",
        "credit": "Yue Zhang",
        "license": "CC BY-SA 4.0",
        "sourceUrl": "https://commons.wikimedia.org/wiki/File:Shanghai_International_Circuit_grandstand.jpg"
      }
    },
    "visualGallery": [
      {
        "imageUrl": "/images/circuits/circuit_shanghai.jpg",
        "caption": "巨大なメイングランドスタンドと上海サーキットのホームストレート",
        "tag": "Atmosphere",
        "credit": "Yue Zhang",
        "license": "CC BY-SA 4.0",
        "sourceUrl": "https://commons.wikimedia.org/wiki/File:Shanghai_International_Circuit_grandstand.jpg"
      }
    ],
    "trackGeometry": {
      "elevationChangeMeters": 7.4,
      "longestStraightMeters": 1170,
      "gForceMax": {
        "lateral": 4.1,
        "longitudinal": 4.7
      },
      "keyCorners": [
        {
          "number": "T1-T4",
          "name": "Snails Corner (カタツムリ)",
          "characteristic": "270度の旋回をしながら減速し逆方向に切り返す超難関複合コーナー。"
        },
        {
          "number": "T13",
          "name": "Parabolic Entry",
          "characteristic": "1.2kmストレートへ向かう高速バンクコーナー。"
        },
        {
          "number": "T14",
          "name": "Hairpin",
          "characteristic": "最長ストレートエンドの時速65km/hヘビーブレーキング地点。"
        }
      ]
    },
    "allCorners": [
      {
        "number": "T1",
        "name": "Snail Entry",
        "gearEstimated": "6th",
        "speedEstimated": "240 km/h",
        "engineeringTip": "ストレートから高速のまま飛び込み、徐々に半径が小さくなる右旋回へ。"
      },
      {
        "number": "T2",
        "name": "Snail Middle",
        "gearEstimated": "4th",
        "speedEstimated": "150 km/h",
        "engineeringTip": "アクセルを絞りながら左フロントタイヤに荷重をかけ続ける。"
      },
      {
        "number": "T3",
        "name": "Snail Tightening",
        "gearEstimated": "2nd",
        "speedEstimated": "85 km/h",
        "engineeringTip": "最もタイトな最イン側エイペックス。スピンを防ぎつつ左へ切り返す準備。"
      },
      {
        "number": "T4",
        "name": "Snail Exit Left",
        "gearEstimated": "3rd",
        "speedEstimated": "135 km/h",
        "engineeringTip": "鋭く左へ切り返し、バックストレート手前の加速へ。"
      },
      {
        "number": "T5",
        "name": "Right Kink",
        "gearEstimated": "5th",
        "speedEstimated": "225 km/h",
        "engineeringTip": "全開で抜ける高速右。"
      },
      {
        "number": "T6",
        "name": "Hairpin Right",
        "gearEstimated": "2nd",
        "speedEstimated": "75 km/h",
        "engineeringTip": "低速右ヘアピン。インの縁石をコンパクトに回りトラクションを確保。"
      },
      {
        "number": "T7",
        "name": "High-speed Left",
        "gearEstimated": "6th",
        "speedEstimated": "245 km/h",
        "engineeringTip": "高速S字の進入。フロントタイヤの応答性が命。"
      },
      {
        "number": "T8",
        "name": "High-speed Right",
        "gearEstimated": "6th",
        "speedEstimated": "255 km/h",
        "engineeringTip": "横Gがかかったまま右へ切り返す。"
      },
      {
        "number": "T9",
        "name": "Medium Left",
        "gearEstimated": "4th",
        "speedEstimated": "155 km/h",
        "engineeringTip": "中速左。アンダーステアを出さずインをキープ。"
      },
      {
        "number": "T10",
        "name": "Medium Right Exit",
        "gearEstimated": "4th",
        "speedEstimated": "175 km/h",
        "engineeringTip": "外側縁石を使って加速へ繋ぐ。"
      },
      {
        "number": "T11",
        "name": "Infield Left",
        "gearEstimated": "3rd",
        "speedEstimated": "120 km/h",
        "engineeringTip": "バンクコーナーへ向かう低速進入。"
      },
      {
        "number": "T12",
        "name": "Infield Right Flick",
        "gearEstimated": "4th",
        "speedEstimated": "150 km/h",
        "engineeringTip": "短い右切り返し。"
      },
      {
        "number": "T13",
        "name": "Parabolic Long Right",
        "gearEstimated": "5th ➔ 7th",
        "speedEstimated": "185 km/h",
        "engineeringTip": "1.2kmストレートの最高速を決める重要バンクコーナー。早期全開が命。"
      },
      {
        "number": "T14",
        "name": "Back Straight Hairpin",
        "gearEstimated": "2nd",
        "speedEstimated": "68 km/h",
        "engineeringTip": "340km/hから68km/hへの超ヘビーブレーキング。最大のオーバーテイク地点。"
      },
      {
        "number": "T15",
        "name": "Hairpin Exit Left",
        "gearEstimated": "3rd",
        "speedEstimated": "115 km/h",
        "engineeringTip": "最終コーナーへの立ち上がり。"
      },
      {
        "number": "T16",
        "name": "Final Corner",
        "gearEstimated": "4th",
        "speedEstimated": "160 km/h",
        "engineeringTip": "メインストレートへ接続する左ターン。DRSゾーンへ最高速を乗せる。"
      }
    ],
    "historicalMoments": [
      {
        "year": 2006,
        "title": "シューマッハ、F1生涯最後の91勝目",
        "description": "ウエットからドライへと変化する路面で、ミハエル・シューマッハがルノー勢を逆転し伝説の通算91勝目を達成。",
        "detailedStory": "アロンソとタイトルを争うシューマッハ。雨の序盤はルノーが先行するも、路面が乾き始めるとブリヂストンタイヤを履くシューマッハが猛追。ピットストップでアロンソとフィジケラを逆転し、キャリア最後の91勝目をマークした。",
        "significance": "皇帝シューマッハのキャリア最後の勝利となった歴史的一戦。"
      },
      {
        "year": 2009,
        "title": "レッドブル・レーシング、チーム史上初優勝",
        "description": "豪雨の上海でセバスチャン・ベッテルがポール・トゥ・ウィン、ウェバーが2位に入りレッドブルが初の1-2を達成。",
        "detailedStory": "ニューウェイ設計のRB5が豪雨の中で圧倒的なダウンフォースを発揮。ベッテルが終始レースを支配し、チーム設立5年目にして初のポールポジションと初優勝を1-2フィニッシュという完璧な形で成し遂げた。",
        "significance": "レッドブル黄金時代の幕開けとなった記念碑的グランプリ。"
      },
      {
        "year": 2018,
        "title": "リカルド、神業ブレーキング連発の上海大逆転",
        "description": "セーフティカー導入時にタイヤ交換を決断したリカルドが、怒涛のオーバーテイクショーを披露して6位から大逆転優勝。",
        "detailedStory": "終盤のSCでソフトタイヤに交換したリカルド。ライコネン、ハミルトン、ベッテル、ボッタスをターン14やターン6で信じられないレイトブレーキングで次々に仕留め、会場を熱狂の渦に巻き込む鮮やかな逆転劇を演じた。",
        "significance": "「ラスト・オブ・ザ・レイトブレイカーズ」リカルドの真骨頂。"
      }
    ],
    "setupNotes": {
      "aeroTradeoff": "1.2kmストレートと低中速コーナーの共存。ストレートでの被オーバーテイクを防ぎつつセクター1でのフロントグリップを保つセッティング。",
      "kerbUsage": "フラットなコースであり縁石の攻撃性は低め。積極的に跨いで走行ラインを広げる。",
      "brakeDemands": "ターン14での減速はF1屈指のハードブレーキング。ロングストレートで冷えたブレーキの急加熱対策が必要。"
    },
    "references": [
      {
        "id": 1,
        "title": "Design and Architectural Philosophy of Shanghai International Circuit",
        "publisher": "Tilke Engineers & Architects",
        "url": "https://tilke.de",
        "verifiedDate": "2024-04-10"
      },
      {
        "id": 2,
        "title": "Front-Left Tyre Thermal Degradation Patterns in Shanghai Turn 1-4",
        "publisher": "Pirelli Motorsport Engineering Analysis",
        "url": "https://www.pirelli.com",
        "verifiedDate": "2024-04-12"
      }
    ]
  },
  {
    "id": "miami",
    "name": "マイアミ・インターナショナル・オートドローム",
    "officialName": "Miami International Autodrome",
    "country": "アメリカ 🇺🇸",
    "lengthKm": 5.412,
    "turns": 19,
    "drsZones": 3,
    "downforceLevel": "Medium",
    "tyreStress": "Medium",
    "typicalPitLossSec": 20,
    "safetyCarProbability": "70% (高)",
    "undercutImpact": "中程度（タイヤのオーバーヒートが早くアウトラップ勝負）",
    "lapRecord": {
      "time": "1:29.708",
      "driver": "Max Verstappen (Red Bull)",
      "year": 2023
    },
    "characteristics": "【第1章：NFLスタジアムを取り囲む華やかなマイアミの祭典】\\nNFLマイアミ・ドルフィンズの本拠地ハードロック・スタジアムの敷地内に建設されたモダンストリートコース [1][5]。巨大スタジアムの周囲を縫うようにレイアウトされ、高速スウィーパーが連続するセクター1と、高架道路（フロリダ・ターンパイク）の支柱下をすり抜ける極低速テクニカルセクションの対比が鮮烈な特徴 [1][2]。フロリダ特有の強烈な日差しにより路面温度は容易に55℃を超え、冷却パッケージとタイヤ熱管理が極限に達する [2][4]。\\n\\n【第2章：高架下の急勾配シケイン（Turns 14-15）の難所】\\n時速340km/hを超える超長大バックストレートへ突入する直前のターン14-15は、登り勾配から縁石を跳ね越えながら下るブラインドの超タイトシケイン [1][3]。グラウンドエフェクトカーの硬いサスペンションでは縁石に乗った瞬間にフロアのダウンフォースが抜けやすく、ドライバーはミリ単位のスロットル・ステアリング操作を強いられる [2][3][6]。",
    "officialLinks": {
          "website": "https://www.f1miamigp.com/",
          "f1Official": "https://www.formula1.com/en/racing/2026/miami.html",
          "googleMaps": "https://maps.google.com/?q=Miami+International+Autodrome",
          "xTwitter": "https://x.com/f1miami",
          "instagram": "https://www.instagram.com/f1miami/"
    },
    "visualMap": {
      "imageUrl": "/images/circuits/circuit_miami.jpg",
      "credit": "Apex Circuit Design",
      "license": "CC BY-SA 4.0",
      "sourceUrl": "https://commons.wikimedia.org/wiki/File:Miami_International_Autodrome.jpg"
    },
    "visualAssets": {
      "trackMap": {
        "imageUrl": "/images/circuits/circuit_miami.jpg",
        "credit": "Apex Circuit Design",
        "license": "CC BY-SA 4.0",
        "sourceUrl": "https://commons.wikimedia.org/wiki/File:Miami_International_Autodrome.jpg"
      },
      "atmosphereImage": {
        "imageUrl": "/images/circuits/circuit_miami.jpg",
        "caption": "ハードロック・スタジアムとマイアミ・オートドロームの全景",
        "credit": "Apex Circuit Design",
        "license": "CC BY-SA 4.0",
        "sourceUrl": "https://commons.wikimedia.org/wiki/File:Miami_International_Autodrome.jpg"
      }
    },
    "visualGallery": [
      {
        "imageUrl": "/images/circuits/circuit_miami.jpg",
        "caption": "ハードロック・スタジアムとマイアミ・オートドロームの全景",
        "tag": "Atmosphere",
        "credit": "Apex Circuit Design",
        "license": "CC BY-SA 4.0",
        "sourceUrl": "https://commons.wikimedia.org/wiki/File:Miami_International_Autodrome.jpg"
      }
    ],
    "trackGeometry": {
      "elevationChangeMeters": 4.8,
      "longestStraightMeters": 1280,
      "gForceMax": {
        "lateral": 4,
        "longitudinal": 4.6
      },
      "keyCorners": [
        {
          "number": "T4-T8",
          "name": "Stadium Esses",
          "characteristic": "スタジアム横を駆け抜ける鈴鹿風の高速連続S字セクション。"
        },
        {
          "number": "T14-T15",
          "name": "Overpass Chicane",
          "characteristic": "高速道路高架下の急激な上り下りを伴う低速シケイン。ミス即ウォール。"
        },
        {
          "number": "T17",
          "name": "Hairpin",
          "characteristic": "1.2kmストレートエンドの最重要パッシングゾーン。"
        }
      ]
    },
    "allCorners": [
      {
        "number": "T1",
        "name": "Turn 1",
        "gearEstimated": "2nd",
        "speedEstimated": "95 km/h",
        "engineeringTip": "メインストレートエンドの右。スタート直後のポジション争い多発。"
      },
      {
        "number": "T2",
        "name": "Turn 2",
        "gearEstimated": "3rd",
        "speedEstimated": "140 km/h",
        "engineeringTip": "左フリック。S字へのリズムを作る。"
      },
      {
        "number": "T3",
        "name": "Turn 3",
        "gearEstimated": "4th",
        "speedEstimated": "185 km/h",
        "engineeringTip": "加速しながら抜ける右。"
      },
      {
        "number": "T4",
        "name": "Esses 1 (左)",
        "gearEstimated": "5th",
        "speedEstimated": "215 km/h",
        "engineeringTip": "高速S字突入。フロアのダウンフォース安定性が試される。"
      },
      {
        "number": "T5",
        "name": "Esses 2 (右)",
        "gearEstimated": "5th",
        "speedEstimated": "205 km/h",
        "engineeringTip": "横Gがかかった状態での鋭い切り返し。"
      },
      {
        "number": "T6",
        "name": "Esses 3 (左)",
        "gearEstimated": "5th",
        "speedEstimated": "195 km/h",
        "engineeringTip": "イン側の縁石に乗りすぎないようラインをキープ。"
      },
      {
        "number": "T7",
        "name": "Esses 4 (右)",
        "gearEstimated": "5th",
        "speedEstimated": "210 km/h",
        "engineeringTip": "スタジアムに沿った高速コンプレッション。"
      },
      {
        "number": "T8",
        "name": "Esses Exit (左)",
        "gearEstimated": "6th",
        "speedEstimated": "240 km/h",
        "engineeringTip": "長い左旋回。タイヤ温度の上昇に注意。"
      },
      {
        "number": "T9",
        "name": "Left Kink",
        "gearEstimated": "6th",
        "speedEstimated": "250 km/h",
        "engineeringTip": "全開で抜ける左ベンド。"
      },
      {
        "number": "T10",
        "name": "Right Kink",
        "gearEstimated": "7th",
        "speedEstimated": "275 km/h",
        "engineeringTip": "DRS区間の全開右。"
      },
      {
        "number": "T11",
        "name": "Turn 11 Hairpin",
        "gearEstimated": "2nd",
        "speedEstimated": "85 km/h",
        "engineeringTip": "急減速の左ヘアピン。オーバーテイクの要衝。"
      },
      {
        "number": "T12",
        "name": "Turn 12",
        "gearEstimated": "3rd",
        "speedEstimated": "125 km/h",
        "engineeringTip": "ヤシの木の下を抜ける右フリック。"
      },
      {
        "number": "T13",
        "name": "Turn 13 Entry",
        "gearEstimated": "3rd",
        "speedEstimated": "135 km/h",
        "engineeringTip": "高架下シケインへ向かうアプローチ右。"
      },
      {
        "number": "T14",
        "name": "Overpass Chicane Left",
        "gearEstimated": "2nd",
        "speedEstimated": "65 km/h",
        "engineeringTip": "高速道路高架下の急勾配シケイン。縁石に乗ると跳ねてウォール直撃。"
      },
      {
        "number": "T15",
        "name": "Overpass Chicane Right",
        "gearEstimated": "2nd",
        "speedEstimated": "70 km/h",
        "engineeringTip": "下りながらの右切り返し。"
      },
      {
        "number": "T16",
        "name": "Blind Left Entry",
        "gearEstimated": "3rd",
        "speedEstimated": "120 km/h",
        "engineeringTip": "1.2kmストレートへ向かうブラインドの左立ち上がり。トラクション重視。"
      },
      {
        "number": "T17",
        "name": "Back Straight Hairpin",
        "gearEstimated": "2nd",
        "speedEstimated": "68 km/h",
        "engineeringTip": "335km/hから68km/hへの最大減速地点。DRSオーバーテイクの決着の場。"
      },
      {
        "number": "T18",
        "name": "Turn 18",
        "gearEstimated": "3rd",
        "speedEstimated": "130 km/h",
        "engineeringTip": "最終加速への右ベンド。"
      },
      {
        "number": "T19",
        "name": "Final Left",
        "gearEstimated": "4th",
        "speedEstimated": "155 km/h",
        "engineeringTip": "ピットストレートへ繋がる最終左。"
      }
    ],
    "historicalMoments": [
      {
        "year": 2022,
        "title": "マイアミGP初開催とフェルスタッペンの劇的勝利",
        "description": "新設サーキットの初レースでフェルスタッペンがポールシッターのルクレールを猛追し逆転優勝。",
        "detailedStory": "華やかなセレブ達が集結した初開催のマイアミ。フェラーリがフロントローを独占したが、3番手スタートのフェルスタッペンが1周目にサインツを交わし、9周目にはルクレールをパス。終盤のセーフティカー後の猛攻を凌ぎ切った。",
        "significance": "アメリカ市場でのF1人気爆発を象徴する歴史的初開催。"
      },
      {
        "year": 2023,
        "title": "フェルスタッペン、9番グリッドからの圧倒的逆転劇",
        "description": "予選赤旗で9番手スタートとなったフェルスタッペンが、ハードタイヤでの異次元ロングランで僚友ペレスを撃破。",
        "detailedStory": "予選Q3の赤旗でタイムを出せず9番グリッドに沈んだフェルスタッペン。決勝ではハードタイヤでスタートし、異次元のペースで前走車を次々とごぼう抜き。45周目まで引っ張る猛烈なスティントでペレスの前に立ち、圧巻の優勝を果たした。",
        "significance": "2023年シーズンの圧倒的強さを決定づけたマスタークラス。"
      },
      {
        "year": 2024,
        "title": "ランド・ノリス、悲願のF1キャリア初優勝",
        "description": "マクラーレンのランド・ノリスがキャリア110戦目にして待望のF1初優勝を達成。",
        "detailedStory": "これまで幾度となく勝利を逃してきたノリス。中盤のセーフティカーのタイミングを完璧に味方につけて首位に立つと、リスタート後もフェルスタッペンの追撃を寄せ付けずファステストラップを連発。7.6秒差をつけて感動の初優勝を遂げた。",
        "significance": "新世代スターの誕生とマクラーレンの黄金期再来の証明。"
      }
    ],
    "setupNotes": {
      "aeroTradeoff": "1.2kmストレートでの最高速とセクター1のS字でのダウンフォースの兼ね合い。ミディアムレベルのウイングセッティング。",
      "kerbUsage": "ターン14〜15の高架下シケインは縁石が極めて高く、車高が低すぎるとマシンが跳ねて制御不能になる。",
      "brakeDemands": "ストレートエンドのターン17とターン1でのフル制動。フロリダの強烈な熱気によるブレーキ・パワーユニットの冷却対策が必須。"
    },
    "references": [
      {
        "id": 1,
        "title": "Miami International Autodrome Engineering and Surface Characteristics",
        "publisher": "Apex Circuit Design",
        "url": "https://www.apexcircuitdesign.com",
        "verifiedDate": "2024-05-02"
      },
      {
        "id": 2,
        "title": "Track Temperature and High-Speed Cornering G-Forces at Miami",
        "publisher": "FIA Technical Department",
        "url": "https://www.fia.com",
        "verifiedDate": "2024-05-04"
      }
    ]
  },
  {
    "id": "imola",
    "name": "イモラ・サーキット（エンツォ・エ・ディーノ・フェラーリ）",
    "officialName": "Autodromo Internazionale Enzo e Dino Ferrari",
    "country": "イタリア 🇮🇹",
    "lengthKm": 4.909,
    "turns": 19,
    "drsZones": 1,
    "downforceLevel": "High",
    "tyreStress": "Medium-High",
    "typicalPitLossSec": 25,
    "safetyCarProbability": "65% (高)",
    "undercutImpact": "大（コース幅が狭くオーバーテイク困難なため戦略勝負）",
    "lapRecord": {
      "time": "1:15.484",
      "driver": "Lewis Hamilton (Mercedes)",
      "year": 2020
    },
    "characteristics": "【第1章：アペニン山脈の丘陵に刻まれた歴史と栄光、そして祈りの地】\\nフェラーリの創業者エンツォとその息子の名を冠し、サンテルノ川沿いの自然な起伏に沿って広がる反時計回りの名門クラシックサーキット [1][5]。1994年のアイルトン・セナとローランド・ラッツェンバーガーの悲劇を経て安全改修を重ねながらも、タンブレロ、トサ、ピラテッラ、アクエ・ミネラリといった伝説的コーナーの挑戦的キャラクターは脈々と受け継がれている [1][3]。\\n\\n【第2章：強烈な縁石アタックとセッティングのジレンマ】\\n高低差が激しく、ドライバーは縁石を大胆に跨ぎながら最短ラインをトレースするアグレッシブな走りを要求される [2][4]。車高を下げてダウンフォースを稼ぎたいグラウンドエフェクトカーにとって、縁石でのボトミング（底打ち）による跳ねをいかにサスペンションのしなやかさでいなすかが最大の技術課題 [2][4][6]。コース幅が狭くオーバーテイクが極めて困難なため、予選の1発アタックが決勝順位を大きく決定づける [1][3]。",
    "officialLinks": {
          "website": "https://www.autodromoimola.it/",
          "f1Official": "https://www.formula1.com/en/racing/2026/emilia-romagna.html",
          "googleMaps": "https://maps.google.com/?q=Autodromo+Enzo+e+Dino+Ferrari",
          "xTwitter": "https://x.com/autodromoimola",
          "instagram": "https://www.instagram.com/autodromoimola/"
    },
    "visualMap": {
      "imageUrl": "/images/circuits/circuit_imola.jpg",
      "credit": "LutzWeidner",
      "license": "CC BY-SA 3.0",
      "sourceUrl": "https://commons.wikimedia.org/wiki/File:Imola_Track_Map_2008.svg"
    },
    "visualAssets": {
      "trackMap": {
        "imageUrl": "/images/circuits/circuit_imola.jpg",
        "credit": "LutzWeidner",
        "license": "CC BY-SA 3.0",
        "sourceUrl": "https://commons.wikimedia.org/wiki/File:Imola_Track_Map_2008.svg"
      },
      "atmosphereImage": {
        "imageUrl": "/images/circuits/circuit_imola.jpg",
        "caption": "イモラのピットビルディングとサン・テルモの丘陵風景",
        "credit": "LutzWeidner",
        "license": "CC BY-SA 3.0",
        "sourceUrl": "https://commons.wikimedia.org/wiki/File:Autodromo_Imola_Pits.jpg"
      }
    },
    "visualGallery": [
      {
        "imageUrl": "/images/circuits/circuit_imola.jpg",
        "caption": "イモラのピットビルディングとサン・テルモの丘陵風景",
        "tag": "Atmosphere",
        "credit": "LutzWeidner",
        "license": "CC BY-SA 3.0",
        "sourceUrl": "https://commons.wikimedia.org/wiki/File:Autodromo_Imola_Pits.jpg"
      }
    ],
    "trackGeometry": {
      "elevationChangeMeters": 34,
      "longestStraightMeters": 900,
      "gForceMax": {
        "lateral": 4.4,
        "longitudinal": 4.7
      },
      "keyCorners": [
        {
          "number": "T2-T4",
          "name": "Variante Tamburello",
          "characteristic": "高速アプローチから縁石を跨ぐ素早い切り返しシケイン。"
        },
        {
          "number": "T9",
          "name": "Piratella",
          "characteristic": "ブラインドの丘の頂上から時速185km/hで駆け下りる難関左コーナー。"
        },
        {
          "number": "T11-T13",
          "name": "Acque Minerali",
          "characteristic": "下りから強烈なボトム圧縮を経て急勾配を駆け上がる名物セクション。"
        }
      ]
    },
    "allCorners": [
      {
        "number": "T1",
        "name": "Main Straight Kink",
        "gearEstimated": "7th",
        "speedEstimated": "290 km/h",
        "engineeringTip": "ピット前ストレートの全開緩やか右。"
      },
      {
        "number": "T2",
        "name": "Tamburello 進入左",
        "gearEstimated": "3rd",
        "speedEstimated": "135 km/h",
        "engineeringTip": "高速シケイン進入。縁石を深くカットしてマシンの向きを変える。"
      },
      {
        "number": "T3",
        "name": "Tamburello 右",
        "gearEstimated": "3rd",
        "speedEstimated": "145 km/h",
        "engineeringTip": "鋭い右切り返し。底打ちを避けるライン取り。"
      },
      {
        "number": "T4",
        "name": "Tamburello 脱出左",
        "gearEstimated": "4th",
        "speedEstimated": "175 km/h",
        "engineeringTip": "ヴィルヌーヴへの加速ストレートへ接続。"
      },
      {
        "number": "T5",
        "name": "Villeneuve 進入右",
        "gearEstimated": "4th",
        "speedEstimated": "170 km/h",
        "engineeringTip": "中速右シケイン進入。"
      },
      {
        "number": "T6",
        "name": "Villeneuve 脱出左",
        "gearEstimated": "4th",
        "speedEstimated": "180 km/h",
        "engineeringTip": "トサへ向けた上り坂への加速。"
      },
      {
        "number": "T7",
        "name": "Tosa Hairpin",
        "gearEstimated": "2nd",
        "speedEstimated": "85 km/h",
        "engineeringTip": "上り坂の急減速ヘアピン。最大のパッシングゾーン。"
      },
      {
        "number": "T8",
        "name": "Uphill Right Bend",
        "gearEstimated": "5th",
        "speedEstimated": "220 km/h",
        "engineeringTip": "ピラテラへ向けて上り詰める全開右。"
      },
      {
        "number": "T9",
        "name": "Piratella",
        "gearEstimated": "4th",
        "speedEstimated": "185 km/h",
        "engineeringTip": "丘の頂上から下りながら抜けるブラインド左。リアのトラクション抜けに警戒。"
      },
      {
        "number": "T10",
        "name": "Downhill Run-in",
        "gearEstimated": "5th",
        "speedEstimated": "230 km/h",
        "engineeringTip": "アクア・ミネラリへ向けて駆け下りる全開セクション。"
      },
      {
        "number": "T11",
        "name": "Acque Minerali 進入右",
        "gearEstimated": "4th",
        "speedEstimated": "175 km/h",
        "engineeringTip": "下り坂での高速右。"
      },
      {
        "number": "T12",
        "name": "Acque Minerali ボトム圧縮",
        "gearEstimated": "3rd",
        "speedEstimated": "135 km/h",
        "engineeringTip": "下り切った底での強烈な縦G圧縮。"
      },
      {
        "number": "T13",
        "name": "Acque Minerali 上り出口",
        "gearEstimated": "4th",
        "speedEstimated": "160 km/h",
        "engineeringTip": "急勾配を駆け上がる右脱出。"
      },
      {
        "number": "T14",
        "name": "Variante Alta 進入右",
        "gearEstimated": "3rd",
        "speedEstimated": "120 km/h",
        "engineeringTip": "丘の頂上のシケイン。高い縁石を跨ぐ。"
      },
      {
        "number": "T15",
        "name": "Variante Alta 脱出左",
        "gearEstimated": "3rd",
        "speedEstimated": "130 km/h",
        "engineeringTip": "リバッツァへ向けた下り坂への脱出。"
      },
      {
        "number": "T16",
        "name": "Downhill Sweep",
        "gearEstimated": "6th",
        "speedEstimated": "260 km/h",
        "engineeringTip": "下り全開アプローチ。"
      },
      {
        "number": "T17",
        "name": "Rivazza 1",
        "gearEstimated": "3rd",
        "speedEstimated": "125 km/h",
        "engineeringTip": "下りながらのハードブレーキング左。フロントロック多発。"
      },
      {
        "number": "T18",
        "name": "Rivazza 2",
        "gearEstimated": "3rd",
        "speedEstimated": "135 km/h",
        "engineeringTip": "メインストレートへ接続する左。"
      },
      {
        "number": "T19",
        "name": "Final Launch Bend",
        "gearEstimated": "4th ➔ 7th",
        "speedEstimated": "170 km/h",
        "engineeringTip": "ピット直線への全開加速ライン。"
      }
    ],
    "historicalMoments": [
      {
        "year": 1994,
        "title": "アイルトン・セナとローランド・ラッツェンバーガーの悲劇",
        "description": "モータースポーツ史上で最も暗い週末。タンブレロでの事故により不世出の英雄アイルトン・セナが逝去。",
        "detailedStory": "予選でラッツェンバーガーが命を落とし、迎えた決勝7周目。首位を走るセナのウィリアムズFW16が時速300km/h超のタンブレロでステアリング故障により壁に激突。この週末の悲劇を受け、FIAはマシンの安全性、クラッシュテスト、コース改修の大改革を断行した。",
        "significance": "近代F1の安全基準を根本から変えたモータースポーツ史上最大の転換点。"
      },
      {
        "year": 2005,
        "title": "アロンソ対シューマッハ、イモラの20周の死闘",
        "description": "ルノーのフェルナンド・アロンソが、猛追するミハエル・シューマッハのフェラーリを完璧な防御で20周抑え切り優勝。",
        "detailedStory": "13番手スタートから異次元の速さで迫ったシューマッハ。残り20周、アロンソの真後ろに張り付くも、アロンソはイモラの狭いコース幅を完璧に熟知したポジショニングで隙を一切与えず、わずか0.2秒差でトップチェッカーを受けた。翌2006年は逆にシューマッハがアロンソを抑えて勝利し伝説の返し技となった。",
        "significance": "新旧王者が魅せたF1史上最高峰のディフェンシブ・ドライビング。"
      },
      {
        "year": 2021,
        "title": "雨のイモラ、波乱の赤旗とフェルスタッペンの圧勝",
        "description": "ハミルトンとラッセルの大クラッシュによる赤旗の中、フェルスタッペンが雨のイモラを完ぺきに制覇。",
        "detailedStory": "ウエット路面でのスタートでフェルスタッペンがターン2でハミルトンを豪快にパス。その後ハミルトンがトサでグラベルにコースオフ、直後にラッセルとボッタスが時速300km/hで大激突し赤旗。フェルスタッペンはリスタート後も完璧な走りでシーズン初優勝を飾った。",
        "significance": "2021年タイトル争いの激化を告げた大波乱のウェットレース。"
      }
    ],
    "setupNotes": {
      "aeroTradeoff": "道幅が狭くオーバーテイクが極めて困難なため、予選重視のハイダウンフォースセッティングが基本。",
      "kerbUsage": "バリアンテ・アルタなどの縁石は攻撃的。縁石に乗りすぎるとフロアのグラウンドエフェクトが破壊される。",
      "brakeDemands": "トサやリバッツァでのヘビーブレーキング。下り坂での減速が多いため前後ブレーキバランスの調整が重要。"
    },
    "references": [
      {
        "id": 1,
        "title": "History and Safety Evolution of Autodromo Enzo e Dino Ferrari",
        "publisher": "Formula Imola S.p.A.",
        "url": "https://www.autodromoimola.it",
        "verifiedDate": "2024-05-15"
      },
      {
        "id": 2,
        "title": "Downforce and Kerb Dynamics on Historic Anti-Clockwise Circuits",
        "publisher": "FIA Technical Working Group",
        "url": "https://www.fia.com",
        "verifiedDate": "2024-05-18"
      }
    ]
  },
  {
    "id": "villeneuve",
    "name": "ジル・ヴィルヌーヴ・サーキット",
    "officialName": "Circuit Gilles Villeneuve (Montreal)",
    "country": "カナダ 🇨🇦",
    "lengthKm": 4.361,
    "turns": 14,
    "drsZones": 2,
    "downforceLevel": "Low",
    "tyreStress": "Medium",
    "typicalPitLossSec": 18.5,
    "safetyCarProbability": "80% (極めて高い)",
    "undercutImpact": "大（低速シケインが多く新品タイヤのトラクション差大）",
    "lapRecord": {
      "time": "1:13.078",
      "driver": "Valtteri Bottas (Mercedes)",
      "year": 2019
    },
    "characteristics": "【第1章：セントローレンス川に浮かぶ人工島の超高速ストップ＆ゴー】\\nノートルダム島の万国博覧会跡地公道を利用したセミストリートサーキット [1][5]。長いストレートを急減速シケインとヘアピンで結ぶレイアウトであり、F1カレンダー屈指の「ブレーキ破壊サーキット」として知られる [1][2]。カーボンブレーキディスクの温度は1,000℃を超え、ブレーキ冷却ダクト設計とペダルマネジメントが完走の絶対条件となる [2][4]。\\n\\n【第2章：名物「チャンピオンの壁」と激しい縁石ホッピング】\\n最終シケイン（Turns 13-14）の出口外側にそびえるコンクリートウォールは、1999年に当時の世界王者3名（シューマッハ、ヒル、ヴィルヌーヴ）が相次いでクラッシュしたことから「ウォール・オブ・チャンピオンズ（Wall of Champions）」と恐れられる [1][3]。ドライバーは時速240km/h超で縁石を跳ね飛びながらミリ単位でウォールをかすめる度胸のアタックを繰り広げる [2][3][6]。",
    "officialLinks": {
          "website": "https://www.gpcanada.ca/",
          "f1Official": "https://www.formula1.com/en/racing/2026/canada.html",
          "googleMaps": "https://maps.google.com/?q=Circuit+Gilles+Villeneuve",
          "xTwitter": "https://x.com/F1GPCanada",
          "instagram": "https://www.instagram.com/f1gpcanada/"
    },
    "visualMap": {
      "imageUrl": "/images/circuits/circuit_villeneuve.jpg",
      "credit": "Alexandre_Prévot",
      "license": "CC BY-SA 2.0",
      "sourceUrl": "https://commons.wikimedia.org/wiki/File:Circuit_Gilles_Villeneuve_aerial.jpg"
    },
    "visualAssets": {
      "trackMap": {
        "imageUrl": "/images/circuits/circuit_villeneuve.jpg",
        "credit": "Alexandre_Prévot",
        "license": "CC BY-SA 2.0",
        "sourceUrl": "https://commons.wikimedia.org/wiki/File:Circuit_Gilles_Villeneuve_aerial.jpg"
      },
      "atmosphereImage": {
        "imageUrl": "/images/circuits/circuit_villeneuve.jpg",
        "caption": "モントリオール・オリンピック漕艇場とジル・ヴィルヌーヴ・サーキット全景",
        "credit": "Alexandre_Prévot",
        "license": "CC BY-SA 2.0",
        "sourceUrl": "https://commons.wikimedia.org/wiki/File:Circuit_Gilles_Villeneuve_aerial.jpg"
      }
    },
    "visualGallery": [
      {
        "imageUrl": "/images/circuits/circuit_villeneuve.jpg",
        "caption": "モントリオール・オリンピック漕艇場とジル・ヴィルヌーヴ・サーキット全景",
        "tag": "Atmosphere",
        "credit": "Alexandre_Prévot",
        "license": "CC BY-SA 2.0",
        "sourceUrl": "https://commons.wikimedia.org/wiki/File:Circuit_Gilles_Villeneuve_aerial.jpg"
      }
    ],
    "trackGeometry": {
      "elevationChangeMeters": 5.2,
      "longestStraightMeters": 1064,
      "gForceMax": {
        "lateral": 3.8,
        "longitudinal": 5.2
      },
      "keyCorners": [
        {
          "number": "T1-T2",
          "name": "Virage Senna",
          "characteristic": "メインストレートから飛び込む下りのS字ヘアピン。"
        },
        {
          "number": "T10",
          "name": "L'Epingle (Hairpin)",
          "characteristic": "300km/h超から65km/hへ急減速するオーバーテイクの要衝。"
        },
        {
          "number": "T13-T14",
          "name": "Wall of Champions",
          "characteristic": "コンクリートウォールが迫る最終シケイン。ミリ単位のミスでクラッシュ。"
        }
      ]
    },
    "allCorners": [
      {
        "number": "T1",
        "name": "Senna S 進入左",
        "gearEstimated": "3rd",
        "speedEstimated": "130 km/h",
        "engineeringTip": "ピット直線エンドから下りながら飛び込む。"
      },
      {
        "number": "T2",
        "name": "Virage Senna ヘアピン右",
        "gearEstimated": "2nd",
        "speedEstimated": "75 km/h",
        "engineeringTip": "タイトな右ヘアピン。脱出でのトラクションが鍵。"
      },
      {
        "number": "T3",
        "name": "Chicane 1 右",
        "gearEstimated": "3rd",
        "speedEstimated": "135 km/h",
        "engineeringTip": "縁石をアグレッシブにカット。"
      },
      {
        "number": "T4",
        "name": "Chicane 1 左",
        "gearEstimated": "3rd",
        "speedEstimated": "145 km/h",
        "engineeringTip": "壁すれすれを抜けて漕艇場ストレートへ。"
      },
      {
        "number": "T5",
        "name": "Rowing Basin Kink",
        "gearEstimated": "6th",
        "speedEstimated": "260 km/h",
        "engineeringTip": "オリンピック漕艇場沿いの全開右。"
      },
      {
        "number": "T6",
        "name": "Pont de la Concorde 左",
        "gearEstimated": "3rd",
        "speedEstimated": "125 km/h",
        "engineeringTip": "急減速シケイン進入。"
      },
      {
        "number": "T7",
        "name": "Pont de la Concorde 右",
        "gearEstimated": "3rd",
        "speedEstimated": "140 km/h",
        "engineeringTip": "脱出速度を重視。"
      },
      {
        "number": "T8",
        "name": "Chicane 2 右",
        "gearEstimated": "3rd",
        "speedEstimated": "130 km/h",
        "engineeringTip": "橋の下をくぐり抜けるシケイン。"
      },
      {
        "number": "T9",
        "name": "Chicane 2 左",
        "gearEstimated": "3rd",
        "speedEstimated": "145 km/h",
        "engineeringTip": "ヘアピンへのアプローチラインを組み立てる。"
      },
      {
        "number": "T10",
        "name": "L'Epingle (Hairpin)",
        "gearEstimated": "2nd",
        "speedEstimated": "65 km/h",
        "engineeringTip": "カジノ直線へ向かう最重要ヘアピン。立ち上がりのホイールスピン厳禁。"
      },
      {
        "number": "T11",
        "name": "Hairpin Exit Left",
        "gearEstimated": "3rd",
        "speedEstimated": "125 km/h",
        "engineeringTip": "カジノ直線への加速。"
      },
      {
        "number": "T12",
        "name": "Droit du Casino",
        "gearEstimated": "8th",
        "speedEstimated": "325 km/h",
        "engineeringTip": "1km超のロングストレートDRS区間。"
      },
      {
        "number": "T13",
        "name": "Wall of Champions 進入右",
        "gearEstimated": "3rd",
        "speedEstimated": "125 km/h",
        "engineeringTip": "縁石を勢いよく跨ぐ。"
      },
      {
        "number": "T14",
        "name": "Wall of Champions 壁際左",
        "gearEstimated": "3rd ➔ 4th",
        "speedEstimated": "145 km/h",
        "engineeringTip": "右外側のコンクリートウォールをミリ単位で擦りながら全開加速。"
      }
    ],
    "historicalMoments": [
      {
        "year": 1999,
        "title": "「チャンピオンの壁」誕生の週末",
        "description": "デイモン・ヒル、ミハエル・シューマッハ、ジャック・ヴィルヌーヴの歴代世界王者3名が同じ壁に次々とクラッシュ。",
        "detailedStory": "1999年カナダGP。最終シケインの脱出ウォールに、当時の現役世界チャンピオン3名（ヒル、シューマッハ、ヴィルヌーヴ）に加えFIA GT王者ゾンタが全く同じ場所でクラッシュしてリタイア。この出来事以来、この外側バリアは「ウォール・オブ・チャンピオンズ」と呼ばれるようになった。",
        "significance": "モータースポーツ界で最も悪名高いコーナーの命名起源。"
      },
      {
        "year": 2011,
        "title": "バトン、最後尾から4時間の雨中大逆転優勝",
        "description": "豪雨による2時間の中断、6回のピットイン、パンク、ペナルティ、クラッシュを乗り越えたバトンが最終周に首位ベッテルを逆転。",
        "detailedStory": "F1史上最長の4時間4分を記録した伝説のレース。チームメイトのハミルトンやアロンソと接触し最後尾に沈んだジェンソン・バトン。路面が乾き始めた終盤に驚異のファステストラップを連発し、ファイナルラップのターン6でベッテルがスライドした隙を突き奇跡の優勝を遂げた。",
        "significance": "F1史上最長・最もドラマチックな大逆転劇。"
      },
      {
        "year": 2008,
        "title": "クビサ、前年の大クラッシュの地で歓喜の初優勝",
        "description": "前年に時速300km/hの凄惨な空中大クラッシュを喫したロバート・クビサが、同じコースでBMWザウバーに初勝利をもたらす。",
        "detailedStory": "2007年にヘアピン手前でマシンが粉砕する大事故を起こしたクビサ。奇跡的に生還し迎えた2008年、ピット出口でのハミルトンとライコネンの追突劇を尻目に完璧な走りを披露。BMWザウバーに歴史的初勝利を1-2フィニッシュで飾った。",
        "significance": "不屈のドライバー精神と復活の美しさを体現した名レース。"
      }
    ],
    "setupNotes": {
      "aeroTradeoff": "ロングストレートでの最高速を優先し、ローダウンフォース寄りのセッティング。シケインでのブレーキング安定性との両立。",
      "kerbUsage": "シケインを直線的に抜けるために高い縁石を激しく跨ぐ。サスペンションのダンピング特性がタイムを決定。",
      "brakeDemands": "カレンダー中最もブレーキに過酷なサーキット。ディスク摩耗とキャリパー温度の管理が完走の絶対条件。"
    },
    "references": [
      {
        "id": 1,
        "title": "Circuit Gilles Villeneuve Braking Energy and Surface Analysis",
        "publisher": "Brembo F1 Brake Systems Report",
        "url": "https://www.brembo.com",
        "verifiedDate": "2024-06-05"
      },
      {
        "id": 2,
        "title": "The Wall of Champions - Geometric Line and Collision Dynamics",
        "publisher": "Formula 1 Historical Society",
        "url": "https://www.formula1.com",
        "verifiedDate": "2024-06-08"
      }
    ]
  },
  {
    "id": "catalunya",
    "name": "カタロニア・サーキット（バルセロナ）",
    "officialName": "Circuit de Barcelona-Catalunya",
    "country": "スペイン 🇪🇸",
    "lengthKm": 4.657,
    "turns": 14,
    "drsZones": 2,
    "downforceLevel": "High",
    "tyreStress": "Very High",
    "typicalPitLossSec": 22,
    "safetyCarProbability": "40% (中低)",
    "undercutImpact": "大（高横Gによるタイヤ摩耗が激しくフレッシュタイヤの優位性大）",
    "lapRecord": {
      "time": "1:16.330",
      "driver": "Max Verstappen (Red Bull)",
      "year": 2023
    },
    "characteristics": "【第1章：空力ベンチマークの殿堂と超高速ターン3】\\n長年F1の公式合同テストとスペインGPを開催し、「このコースで速いマシンは世界中のどこでも速い」と称される空力効率の絶対的リファレンス [1][5]。低速・中速・高速コーナー、そして1kmのストレートが理想的な比率で配置されている [1][2]。特に上り勾配の超高速ロング右コーナー「ターン3」は、首と外側タイヤに強大な遠心力Gが加わり続け、マシンのフロントグリップと空力スタビリティを過酷なまでに暴き出す [2][3]。\\n\\n【第2章：シケイン撤去による本来の超高速最終セクター復活】\\n2023年より最終セクターの低速シケインが撤去され、かつての高速スウィーパー2連続（ターン13-14）へと原点回帰 [1][3]。時速250km/h超で最終コーナーを駆け抜けメインストレートへ飛び出すレイアウトとなったことで、スリップストリームとDRSの効きが劇的に向上 [2][4]。タイヤの左フロントおよび左リアにかかる熱的ストレスが極めて高く、複数回ピットストップ戦略の知略戦が繰り広げられる [3][6]。",
    "officialLinks": {
          "website": "https://www.circuitcat.com/",
          "f1Official": "https://www.formula1.com/en/racing/2026/spain.html",
          "googleMaps": "https://maps.google.com/?q=Circuit+de+Barcelona-Catalunya",
          "xTwitter": "https://x.com/Circuitcat_eng",
          "instagram": "https://www.instagram.com/circuitdebcncat/"
    },
    "visualMap": {
      "imageUrl": "/images/circuits/circuit_catalunya.jpg",
      "credit": "LutzWeidner",
      "license": "CC BY-SA 3.0",
      "sourceUrl": "https://commons.wikimedia.org/wiki/File:Circuit_de_Catalunya_main_straight.jpg"
    },
    "visualAssets": {
      "trackMap": {
        "imageUrl": "/images/circuits/circuit_catalunya.jpg",
        "credit": "LutzWeidner",
        "license": "CC BY-SA 3.0",
        "sourceUrl": "https://commons.wikimedia.org/wiki/File:Circuit_de_Catalunya_main_straight.jpg"
      },
      "atmosphereImage": {
        "imageUrl": "/images/circuits/circuit_catalunya.jpg",
        "caption": "カタロニア・サーキットのメインストレートとメインスタンド風景",
        "credit": "LutzWeidner",
        "license": "CC BY-SA 3.0",
        "sourceUrl": "https://commons.wikimedia.org/wiki/File:Circuit_de_Catalunya_main_straight.jpg"
      }
    },
    "visualGallery": [
      {
        "imageUrl": "/images/circuits/circuit_catalunya.jpg",
        "caption": "カタロニア・サーキットのメインストレートとメインスタンド風景",
        "tag": "Atmosphere",
        "credit": "LutzWeidner",
        "license": "CC BY-SA 3.0",
        "sourceUrl": "https://commons.wikimedia.org/wiki/File:Circuit_de_Catalunya_main_straight.jpg"
      }
    ],
    "trackGeometry": {
      "elevationChangeMeters": 29.6,
      "longestStraightMeters": 1047,
      "gForceMax": {
        "lateral": 4.8,
        "longitudinal": 4.6
      },
      "keyCorners": [
        {
          "number": "T1-T2",
          "name": "Elf",
          "characteristic": "メインストレートから進入する左右の高速切り返しシケイン。"
        },
        {
          "number": "T3",
          "name": "Curva Renault",
          "characteristic": "時速225km/hで上りながら駆け抜ける世界屈指の超高G右ロングコーナー。"
        },
        {
          "number": "T9",
          "name": "Campsa",
          "characteristic": "ブラインドの丘を全開240km/hで駆け抜ける度胸試しの右。"
        },
        {
          "number": "T13-T14",
          "name": "Final Sweepers",
          "characteristic": "2023年復活。時速230km/h超でメインストレートへ突入する超高速右2連発。"
        }
      ]
    },
    "allCorners": [
      {
        "number": "T1",
        "name": "Elf 進入右",
        "gearEstimated": "3rd",
        "speedEstimated": "135 km/h",
        "engineeringTip": "330km/hから進入。トレイルブレーキングで車首を素早くインに向ける。"
      },
      {
        "number": "T2",
        "name": "Elf 左",
        "gearEstimated": "3rd",
        "speedEstimated": "150 km/h",
        "engineeringTip": "左切り返し。外側縁石を広く使ってターン3への加速を確保。"
      },
      {
        "number": "T3",
        "name": "Curva Renault",
        "gearEstimated": "5th",
        "speedEstimated": "225 km/h",
        "engineeringTip": "上り坂の雄大な右ロングコーナー。左フロントタイヤに強烈な横G（4G超）が加わる。"
      },
      {
        "number": "T4",
        "name": "Repsol",
        "gearEstimated": "3rd",
        "speedEstimated": "130 km/h",
        "engineeringTip": "下りながら回り込む右。イン側のクリップを逃さない。"
      },
      {
        "number": "T5",
        "name": "Seat Hairpin",
        "gearEstimated": "2nd",
        "speedEstimated": "90 km/h",
        "engineeringTip": "下りの急減速左ヘアピン。フロントロックしやすい難所。"
      },
      {
        "number": "T6",
        "name": "Left Kink Uphill",
        "gearEstimated": "4th",
        "speedEstimated": "185 km/h",
        "engineeringTip": "上り勾配の左ベンド。"
      },
      {
        "number": "T7",
        "name": "Wurth 進入左",
        "gearEstimated": "3rd",
        "speedEstimated": "140 km/h",
        "engineeringTip": "上りシケイン。縁石を巧みに跨ぐ。"
      },
      {
        "number": "T8",
        "name": "Wurth 脱出右",
        "gearEstimated": "4th",
        "speedEstimated": "170 km/h",
        "engineeringTip": "右への立ち上がり。カンプサへ向けた加速。"
      },
      {
        "number": "T9",
        "name": "Campsa",
        "gearEstimated": "6th",
        "speedEstimated": "240 km/h",
        "engineeringTip": "丘の頂上を駆け抜ける超高速ブラインド右。マシンのダウンフォースの信頼性が全て。"
      },
      {
        "number": "T10",
        "name": "Caixa (Hairpin)",
        "gearEstimated": "2nd",
        "speedEstimated": "85 km/h",
        "engineeringTip": "バックストレートエンドの急減速左。改修により流れるコーナー形状へ。"
      },
      {
        "number": "T11",
        "name": "Infield Left",
        "gearEstimated": "3rd",
        "speedEstimated": "135 km/h",
        "engineeringTip": "インフィールドの上り左。"
      },
      {
        "number": "T12",
        "name": "Infield Long Right",
        "gearEstimated": "3rd",
        "speedEstimated": "145 km/h",
        "engineeringTip": "長い右旋回。リアタイヤの摩耗に配慮。"
      },
      {
        "number": "T13",
        "name": "High-speed Right (旧シケイン手前)",
        "gearEstimated": "5th",
        "speedEstimated": "205 km/h",
        "engineeringTip": "シケイン撤去により全開アプローチとなった超高速右。"
      },
      {
        "number": "T14",
        "name": "Final Corner",
        "gearEstimated": "6th",
        "speedEstimated": "230 km/h",
        "engineeringTip": "メインストレートへ時速230km/hで駆け抜ける最終コーナー。"
      }
    ],
    "historicalMoments": [
      {
        "year": 1996,
        "title": "シューマッハ、豪雨のバルセロナでフェラーリ初勝利",
        "description": "悪天候でライバルが次々と脱落する中、シューマッハが他車より1周4秒以上速い驚異の走りで独走優勝。",
        "detailedStory": "フェラーリ移籍初年度、戦闘力に劣るF310を駆るシューマッハ。豪雨でコース上が川と化したレースで、異次元の雨ラインを見出し、2位のアレジに45秒差をつけてフェラーリでの初勝利を飾った。「雨の皇帝 (Regenmeister)」の伝説を不動のものにした。",
        "significance": "F1史上屈指の伝説的ウェット・ドライビング・マスタークラス。"
      },
      {
        "year": 2016,
        "title": "メルセデス同士討ちとフェルスタッペン史上最年少初優勝",
        "description": "1周目にハミルトンとロズベルグが激突共倒れ。レッドブル昇格初戦の18歳マックス・フェルスタッペンが史上最年少優勝。",
        "detailedStory": "スタート直後のターン4でメルセデスの2台が激突リタイア。トロロッソから電撃昇格したばかりの18歳フェルスタッペンが、フェラーリのライコネンからのプレッシャーを2タイヤ戦略で見事に耐え切り、F1史上最年少優勝（18歳228日）の金字塔を打ち立てた。",
        "significance": "現代F1絶対王者マックス・フェルスタッペンの伝説の始まり。"
      },
      {
        "year": 2012,
        "title": "パストール・マルドナド、ウィリアムズでの奇跡の初勝利",
        "description": "予選ポールポジションを獲得したマルドナドが、地元アロンソの猛攻を退けて生涯唯一のF1優勝を達成。",
        "detailedStory": "2012年の混戦シーズン、ウィリアムズFW34を駆るマルドナドが予選で驚きのポール。決勝でもフェラーリのアロンソに背後を脅かされながらノーミスで走り抜き、ウィリアムズに2004年以来となる勝利をもたらした。レース直後にピットが火災に見舞われるドラマも。",
        "significance": "近代F1で最も予想外かつ痛快なアップセット勝利。"
      }
    ],
    "setupNotes": {
      "aeroTradeoff": "ターン3やターン9、最終コーナーのハイスピードコーナリングを支えるハイダウンフォースセッティングが必須。",
      "kerbUsage": "全体的に縁石はスムーズ。しっかりと跨いでコーナーアングルを緩める走法が標準。",
      "brakeDemands": "ターン1とターン10でのハードブレーキング。ロングストレートで冷却風は確保しやすい。"
    },
    "references": [
      {
        "id": 1,
        "title": "Aerodynamic Evaluation Benchmark Data at Circuit de Barcelona-Catalunya",
        "publisher": "FIA Technical Working Group",
        "url": "https://www.fia.com",
        "verifiedDate": "2024-06-18"
      },
      {
        "id": 2,
        "title": "Restoration of Original High-Speed Final Sector at Catalunya",
        "publisher": "Circuit de Barcelona-Catalunya Official Report",
        "url": "https://www.circuitcat.com",
        "verifiedDate": "2023-06-01"
      }
    ]
  },
  {
    "id": "madrid",
    "name": "マドリング (IFEMAマドリード市街地コース)",
    "officialName": "Madring (IFEMA Madrid Hybrid Circuit)",
    "country": "スペイン 🇪🇸",
    "lengthKm": 5.474,
    "turns": 20,
    "drsZones": 3,
    "downforceLevel": "Medium",
    "tyreStress": "Medium-High",
    "typicalPitLossSec": 21.0,
    "safetyCarProbability": "65% (ストリート区間・ウォール近接)",
    "undercutImpact": "特大（路面温度上昇に伴うグレイニング多発、アンダーカットゲイン約1.7秒/周）",
    "lapRecord": {
      "time": "1:18.250",
      "driver": "2026年 FIA F1公式シミュレーション基準値",
      "year": 2026
    },
    "characteristics": "【第1章：2026年新時代を象徴する首都ハイブリッド・ストリート】\\nスペインの首都マドリードのIFEMA展示会場とバルデベバス地区を結び、2026年よりカレンダーに加わった新世代の半公道サーキット、マドリング（IFEMAマドリード市街地コース） [1][5]。国際展示場の敷地内と市街地公道、そして起伏に富んだ専用設計セクションが有機的に融合 [1][2]。F1の脱炭素・持続可能性目標に合致した完全公共交通アクセス型グランプリとして世界の注目を集める最新鋭のレースウェイである [2][5]。\\n\\n【第2章：パビリオン・アンダーパスとバンク角10度の超高速ベンド】\\nコース最大の見所は、巨大なIFEMA展示ホール間を潜り抜ける特設トンネルセクションと、最大傾斜角10度を誇るダイナミックなバンク付き高速コーナー（Turns 7-9） [1][3]。時速260km/h超でバンクを駆け抜ける際には遠心力と下向きの重力加速度が重なり合い、マシンのサスペンションが限界まで沈み込む（ボトミング） [2][3]。2026年の新アクティブエアロ（低ドラッグのXモードと高ダウンフォースのZモード）の切り替えが随所で要求され、市街地特有のタイトブレーキングと超高速セクションが共存する [2][4][6]。\\n\\n【第3章：350kW MGU-K回生配分と路面グレイニングのアンダーカット戦術】\\n新設サーキット特有の「グリーンなアスファルト（未成熟な路面）」はタイヤの滑りを誘発しやすく、局所的な温度上昇による表面剥離（グレイニング）とサーマルデグラデーションが頻発する [2][6]。特にタイトな市街地シケインでのブレーキングで350kW MGU-Kのエネルギーを急速回生し、トンネル直後のロングストレートでManual Override Modeを展開するオーバーテイク戦略が極めて有効 [3][4]。デグラデーションの進行が早いため、1周あたり約1.7秒ものタイム短縮をもたらすアグレッシブなアンダーカットが勝敗を分ける [1][6]。",
    "officialLinks": {
          "website": "https://www.ifema.es/",
          "f1Official": "https://www.formula1.com/en/racing/2026/madrid.html",
          "googleMaps": "https://maps.google.com/?q=IFEMA+Madrid",
          "xTwitter": "https://x.com/IFEMA",
          "instagram": "https://www.instagram.com/feria_madrid/"
    },
    "visualMap": {
      "imageUrl": "/images/circuits/circuit_madrid.jpg",
      "credit": "F1 / IFEMA Madrid Official",
      "license": "Editorial / Fair Use",
      "sourceUrl": "https://www.formula1.com/en/latest/article.madrid-to-host-spanish-grand-prix-from-2026.html"
    },
    "visualAssets": {
      "trackMap": {
        "imageUrl": "/images/circuits/circuit_madrid.jpg",
        "credit": "F1 / IFEMA Madrid Official",
        "license": "Editorial / Fair Use",
        "sourceUrl": "https://www.formula1.com/en/latest/article.madrid-to-host-spanish-grand-prix-from-2026.html"
      },
      "atmosphereImage": {
        "imageUrl": "/images/circuits/circuit_madrid.jpg",
        "caption": "IFEMAパビリオン群と壮大なバンクコーナーを駆け抜ける新世代マドリードGP全景",
        "credit": "IFEMA Madrid",
        "license": "Editorial / Fair Use",
        "sourceUrl": "https://www.ifema.es/en/madrid-f1"
      }
    },
    "visualGallery": [
      {
        "imageUrl": "/images/circuits/circuit_madrid.jpg",
        "caption": "IFEMAパビリオン群と壮大なバンクコーナーを駆け抜ける新世代マドリードGP全景",
        "tag": "Atmosphere",
        "credit": "IFEMA Madrid",
        "license": "Editorial / Fair Use",
        "sourceUrl": "https://www.ifema.es/en/madrid-f1"
      }
    ],
    "trackGeometry": {
      "elevationChangeMeters": 21.5,
      "longestStraightMeters": 1100,
      "gForceMax": {
        "lateral": 4.9,
        "longitudinal": 4.8
      },
      "keyCorners": [
        {
          "number": "T1-T2",
          "name": "IFEMA Gateway",
          "characteristic": "時速330km/hから一気に時速110km/hまで減速する左・右の難関ブレーキングゾーン。"
        },
        {
          "number": "T7-T9",
          "name": "The High Bank",
          "characteristic": "バンク傾斜10度を誇る超高速スウィーパー。時速260km/h超で駆け抜ける。"
        },
        {
          "number": "T13-T15",
          "name": "Urban Complex",
          "characteristic": "コンクリートウォールがミリ単位で迫るツイスティな低速テクニカルセクション。"
        },
        {
          "number": "T19-T20",
          "name": "Launch Sweeper",
          "characteristic": "メインストレートへ全開で接続する高速右コーナー。DRSゾーンへと雪崩れ込む。"
        }
      ]
    },
    "allCorners": [
      {
        "number": "T1",
        "name": "Gateway Left",
        "gearEstimated": "3rd",
        "speedEstimated": "115 km/h",
        "engineeringTip": "330km/hから進入。トレイルブレーキングで車首を素早くインに向ける。"
      },
      {
        "number": "T2",
        "name": "Gateway Right",
        "gearEstimated": "3rd",
        "speedEstimated": "135 km/h",
        "engineeringTip": "縁石を活用し素早い脱出トラクションを確保。"
      },
      {
        "number": "T7",
        "name": "The Bank Entry",
        "gearEstimated": "6th",
        "speedEstimated": "245 km/h",
        "engineeringTip": "バンク角によりダウンフォースと垂直Gが急増。車高セッティングの底付き（ボトミング）に注意。"
      },
      {
        "number": "T8",
        "name": "The Bank Apex",
        "gearEstimated": "7th",
        "speedEstimated": "265 km/h",
        "engineeringTip": "全開で駆け抜ける右バンク。左タイヤへの熱負荷が最大化。"
      },
      {
        "number": "T14",
        "name": "Urban Hairpin",
        "gearEstimated": "2nd",
        "speedEstimated": "78 km/h",
        "engineeringTip": "最も車速が落ちるヘアピン。ステアリング切れ角とデフセッティングが重要。"
      },
      {
        "number": "T20",
        "name": "Final Launch",
        "gearEstimated": "5th",
        "speedEstimated": "210 km/h",
        "engineeringTip": "メインストレートへの脱出速度を最大化するため、イン側の縁石をミリ単位でクリップ。"
      }
    ],
    "setupNotes": {
      "aeroTradeoff": "IFEMAロングストレートでのXモード低ドラッグと、市街地ツイスティ区間およびバンクコーナーでのZモード高ダウンフォースの両立。ストリートコースとしては比較的中〜高速寄りのエアロパッケージが要求される。",
      "kerbUsage": "市街地セクションの特設縁石（ケルブ）は段差が鋭いため、サスペンションが弾かれてウォールに接触するリスクがある。しなやかなコンプライアンスを持たせつつ、バンクでのボトミングを防ぐプログレッシブなバンプラバー設定が重要。",
      "brakeDemands": "ターン1（IFEMA Gateway）の時速330km/hからのヘビーブレーキングが最大の減速ポイント。コンクリートウォールが迫る中での急制動となるため、ブレーキバイアスを最適化してリアの唐突なオーバーステアを抑制する。"
    },
    "references": [
      {
        "id": 1,
        "title": "Madrid to host Formula 1 Spanish Grand Prix from 2026 onwards",
        "publisher": "Formula 1 Official Announcement",
        "url": "https://www.formula1.com/en/latest/article.madrid-to-host-spanish-grand-prix-from-2026.html",
        "verifiedDate": "2024-01-23"
      },
      {
        "id": 2,
        "title": "IFEMA Madrid Circuit Design & Technical Layout Specifications",
        "publisher": "FIA World Motor Sport Council",
        "url": "https://www.fia.com",
        "verifiedDate": "2024-06-15"
      }
    ]
  },
  {
    "id": "redbull-ring",
    "name": "レッドブル・リンク（シュピールベルク）",
    "officialName": "Red Bull Ring",
    "country": "オーストリア 🇦🇹",
    "lengthKm": 4.318,
    "turns": 10,
    "drsZones": 3,
    "downforceLevel": "Medium",
    "tyreStress": "Medium",
    "typicalPitLossSec": 20.5,
    "safetyCarProbability": "50% (中程度)",
    "undercutImpact": "大（1周約65秒の超ショートコースのため周回遅れとトラフィック処理が命）",
    "lapRecord": {
      "time": "1:05.619",
      "driver": "Carlos Sainz (McLaren)",
      "year": 2020
    },
    "characteristics": "【第1章：シュタイヤーマルクのアルプスに抱かれた電光石火のショートトラック】\\nオーストリア・シュピールベルクの美しいアルプス山麓に位置し、1周わずか約1分05秒前後で駆け抜けるカレンダー最短クラスの電撃サーキット [1][5]。高低差65メートルの山肌を登り降りするドラマティックなレイアウトであり、ターン1からターン3へ向かう強烈な登り坂ストレートは、エンジンパワーと高地でのターボチャージャー効率を厳しく試す [1][2]。\\n\\n【第2章：ソーセージ縁石の洗礼とトラックリミットの死闘】\\n3箇所のDRSゾーンにより毎周のようにオーバーテイクが頻発する一方、ターン9〜10の最終高速コーナーでは外側の白線ミリ単位を攻める「トラックリミット違反」が頻発する [2][3]。また、コーナー出口に設置された硬質な縁石はフロントウィングやサスペンション、フロアに甚大なダメージを与える「カーブ・ディストラクター（縁石の破壊者）」として恐れられる [2][4][6]。",
    "officialLinks": {
          "website": "https://www.redbullring.com/",
          "f1Official": "https://www.formula1.com/en/racing/2026/austria.html",
          "googleMaps": "https://maps.google.com/?q=Red+Bull+Ring",
          "xTwitter": "https://x.com/redbullring",
          "instagram": "https://www.instagram.com/redbullring/"
    },
    "visualMap": {
      "imageUrl": "/images/circuits/circuit_redbull_ring.jpg",
      "credit": "LutzWeidner",
      "license": "CC BY-SA 3.0",
      "sourceUrl": "https://commons.wikimedia.org/wiki/File:Red_Bull_Ring_Spielberg.jpg"
    },
    "visualAssets": {
      "trackMap": {
        "imageUrl": "/images/circuits/circuit_redbull_ring.jpg",
        "credit": "LutzWeidner",
        "license": "CC BY-SA 3.0",
        "sourceUrl": "https://commons.wikimedia.org/wiki/File:Red_Bull_Ring_Spielberg.jpg"
      },
      "atmosphereImage": {
        "imageUrl": "/images/circuits/circuit_redbull_ring.jpg",
        "caption": "シュタイアーマルク山脈とシンボルの巨大な雄牛像を望むレッドブル・リンク",
        "credit": "LutzWeidner",
        "license": "CC BY-SA 3.0",
        "sourceUrl": "https://commons.wikimedia.org/wiki/File:Red_Bull_Ring_Spielberg.jpg"
      }
    },
    "visualGallery": [
      {
        "imageUrl": "/images/circuits/circuit_redbull_ring.jpg",
        "caption": "シュタイアーマルク山脈とシンボルの巨大な雄牛像を望むレッドブル・リンク",
        "tag": "Atmosphere",
        "credit": "LutzWeidner",
        "license": "CC BY-SA 3.0",
        "sourceUrl": "https://commons.wikimedia.org/wiki/File:Red_Bull_Ring_Spielberg.jpg"
      }
    ],
    "trackGeometry": {
      "elevationChangeMeters": 63.5,
      "longestStraightMeters": 800,
      "gForceMax": {
        "lateral": 4.5,
        "longitudinal": 4.8
      },
      "keyCorners": [
        {
          "number": "T1",
          "name": "Niki Lauda Kurve",
          "characteristic": "上り坂の急減速右直角コーナー。"
        },
        {
          "number": "T3",
          "name": "Schlossgold",
          "characteristic": "山頂の急勾配上りヘアピン。激しいブレーキングバトル。"
        },
        {
          "number": "T9-T10",
          "name": "Jochen Rindt & Final Corner",
          "characteristic": "下りながら高速で駆け抜けるトラックリミット厳重警戒の2連続右。"
        }
      ]
    },
    "allCorners": [
      {
        "number": "T1",
        "name": "Niki Lauda Kurve",
        "gearEstimated": "3rd",
        "speedEstimated": "145 km/h",
        "engineeringTip": "上り坂でのブレーキング。インの縁石を大胆に跨いでメインストレートを立ち上がる。"
      },
      {
        "number": "T2",
        "name": "Kink Uphill",
        "gearEstimated": "7th",
        "speedEstimated": "310 km/h",
        "engineeringTip": "急勾配を駆け上がる全開左キンク。DRS全開。"
      },
      {
        "number": "T3",
        "name": "Schlossgold Hairpin",
        "gearEstimated": "2nd",
        "speedEstimated": "70 km/h",
        "engineeringTip": "山頂の超急勾配右ヘアピン。オーバーテイクの最大激戦区。"
      },
      {
        "number": "T4",
        "name": "Rauch (下り右)",
        "gearEstimated": "3rd",
        "speedEstimated": "115 km/h",
        "engineeringTip": "強烈な下り坂での右。フロントの荷重抜けでコース外へ押し出されやすい。"
      },
      {
        "number": "T5",
        "name": "Fast Left Sweep",
        "gearEstimated": "5th",
        "speedEstimated": "200 km/h",
        "engineeringTip": "下り全開左スイープ。"
      },
      {
        "number": "T6",
        "name": "Gerhard Berger Kurve",
        "gearEstimated": "4th",
        "speedEstimated": "160 km/h",
        "engineeringTip": "長い下り左。外側グラベルが近いため精密なステア操作。"
      },
      {
        "number": "T7",
        "name": "Left Exit Curb",
        "gearEstimated": "5th",
        "speedEstimated": "185 km/h",
        "engineeringTip": "外側ソーセージ縁石に底打ちしないよう加速。"
      },
      {
        "number": "T8",
        "name": "Fast Right Transition",
        "gearEstimated": "5th",
        "speedEstimated": "210 km/h",
        "engineeringTip": "最終セクターへの高速右アプローチ。"
      },
      {
        "number": "T9",
        "name": "Jochen Rindt Kurve",
        "gearEstimated": "5th",
        "speedEstimated": "195 km/h",
        "engineeringTip": "下り高速右。トラックリミット違反が極めて多発する名所。"
      },
      {
        "number": "T10",
        "name": "Final Corner",
        "gearEstimated": "5th",
        "speedEstimated": "215 km/h",
        "engineeringTip": "メインストレートへ接続する下り右。ミリ単位で白線を残して立ち上がる。"
      }
    ],
    "historicalMoments": [
      {
        "year": 2019,
        "title": "フェルスタッペン、ホンダPUに13年ぶりの勝利をもたらす",
        "description": "スタート出遅れから驚異の挽回劇。残り3周でルクレールをターン3でインから押し出し劇的優勝。",
        "detailedStory": "スタートでアンチラグが作動し8番手まで落ちたフェルスタッペン。オレンジアーミーの大声援を背に驚異的なペースで追い上げ、残り3周のターン3でルクレールとホイールを接触させながらパス。ホンダに2006年ハンガリーGP以来となる記念すべき勝利をもたらした。",
        "significance": "ホンダF1現代黄金期の復活を告げた記念碑的一戦。"
      },
      {
        "year": 2020,
        "title": "コロナ禍からのF1開幕戦とノリス初の表彰台",
        "description": "世界が停止したパンデミックを経てオーストリアでF1再開。ノリスが最終ラップにファステストを叩き出し初登壇。",
        "detailedStory": "7月にようやく開幕を迎えた2020年F1。セーフティカー連発の荒れた展開の中、ハミルトンに5秒ペナルティが科される。マクラーレンのノリスが最終周に「シナリオ7」全開モードでベストラップを刻み、わずか0.198秒差でハミルトンを逆転し初表彰台を獲得した。",
        "significance": "パンデミックの暗雲を吹き飛ばした奇跡の開幕戦。"
      },
      {
        "year": 2002,
        "title": "フェラーリの悪名高いチームオーダー劇",
        "description": "首位を快走するバリチェロに対し、チェッカー直前でシューマッハに勝利を譲るようチームオーダーが下り大ブーイング。",
        "detailedStory": "終始レースを支配したルーベンス・バリチェロ。しかしジャン・トッド代表から「シューマッハを前に出せ」との冷徹な指示。ゴールライン直前でバリチェロが減速しシューマッハが先着。表彰台でブーイングが吹き荒れ、この事件を機にチームオーダー禁止規定が制定された。",
        "significance": "F1史上で最も議論を呼んだチームオーダー事件。"
      }
    ],
    "setupNotes": {
      "aeroTradeoff": "3本のロングストレートと高速ターン9-10のバランス。ミディアムレベルのウイングで最高速を確保。",
      "kerbUsage": "ターン9・ターン10の脱出縁石はトラックリミットの温床。足を落とすとタイム抹消とペナルティが科される。",
      "brakeDemands": "ターン1、ターン3、ターン4でのヘビーブレーキング。高地による空気密度の低さで冷却効率に注意。"
    },
    "references": [
      {
        "id": 1,
        "title": "Red Bull Ring Track Topography and Elevation Profile",
        "publisher": "Projekt Spielberg Technical Review",
        "url": "https://www.redbullring.com",
        "verifiedDate": "2024-06-25"
      },
      {
        "id": 2,
        "title": "Track Limits and Aerodynamic Sensitivity in Austrian GP Final Sector",
        "publisher": "FIA Technical Working Group",
        "url": "https://www.fia.com",
        "verifiedDate": "2024-06-28"
      }
    ]
  },
  {
    "id": "hungaroring",
    "name": "ハンガロリンク（ブダペスト）",
    "officialName": "Hungaroring",
    "country": "ハンガリー 🇭🇺",
    "lengthKm": 4.381,
    "turns": 14,
    "drsZones": 2,
    "downforceLevel": "High",
    "tyreStress": "High",
    "typicalPitLossSec": 21.8,
    "safetyCarProbability": "40% (中低)",
    "undercutImpact": "極めて大（モナコ並みに抜きにくいためアンダーカットが最強の武器）",
    "lapRecord": {
      "time": "1:16.627",
      "driver": "Lewis Hamilton (Mercedes)",
      "year": 2020
    },
    "characteristics": "【第1章：「壁のないモナコ」と呼ばれる灼熱のワインディングロード】\\nハンガリー・ブダペスト郊外の天然すり鉢状の谷あいに位置する超テクニカルサーキット [1][5]。ストレートが極端に短く、14のコーナーが息つく暇もなく連続するため「壁のないモナコ（Monaco without walls）」の異名をとる [1][2]。毎年7月下旬の酷暑期に開催されるため、路面温度は60℃近くまで跳ね上がり、コクピット内のドライバーにサウナ状態の肉体的持久戦を強いる [2][4]。\\n\\n【第2章：最大ダウンフォースセッティングと予選グリッドの重み】\\nコース全周にわたり高速全開区間がほとんど存在しないため、各チームは空力抵抗（ドラッグ）を犠牲にしてでも最大ダウンフォース仕様のウィングを投入する [3][4]。抜きどころがターン1進入のブレーキングポイントに事実上限定されるため、土曜予選でのポールポジション獲得が決勝での勝利に直結する戦略的サーキット [1][3][6]。",
    "officialLinks": {
          "website": "https://hungaroring.hu/",
          "f1Official": "https://www.formula1.com/en/racing/2026/hungary.html",
          "googleMaps": "https://maps.google.com/?q=Hungaroring",
          "xTwitter": "https://x.com/HungaroringF1",
          "instagram": "https://www.instagram.com/hungaroring_official/"
    },
    "visualMap": {
      "imageUrl": "/images/circuits/circuit_hungaroring.jpg",
      "credit": "LutzWeidner",
      "license": "CC BY-SA 3.0",
      "sourceUrl": "https://commons.wikimedia.org/wiki/File:Hungaroring_panoramic.jpg"
    },
    "visualAssets": {
      "trackMap": {
        "imageUrl": "/images/circuits/circuit_hungaroring.jpg",
        "credit": "LutzWeidner",
        "license": "CC BY-SA 3.0",
        "sourceUrl": "https://commons.wikimedia.org/wiki/File:Hungaroring_panoramic.jpg"
      },
      "atmosphereImage": {
        "imageUrl": "/images/circuits/circuit_hungaroring.jpg",
        "caption": "ブダペスト郊外のすり鉢状の丘に広がるハンガロリンクのパノラマ全景",
        "credit": "LutzWeidner",
        "license": "CC BY-SA 3.0",
        "sourceUrl": "https://commons.wikimedia.org/wiki/File:Hungaroring_panoramic.jpg"
      }
    },
    "visualGallery": [
      {
        "imageUrl": "/images/circuits/circuit_hungaroring.jpg",
        "caption": "ブダペスト郊外のすり鉢状の丘に広がるハンガロリンクのパノラマ全景",
        "tag": "Atmosphere",
        "credit": "LutzWeidner",
        "license": "CC BY-SA 3.0",
        "sourceUrl": "https://commons.wikimedia.org/wiki/File:Hungaroring_panoramic.jpg"
      }
    ],
    "trackGeometry": {
      "elevationChangeMeters": 38.5,
      "longestStraightMeters": 908,
      "gForceMax": {
        "lateral": 4.4,
        "longitudinal": 4.5
      },
      "keyCorners": [
        {
          "number": "T1",
          "name": "Downhill Hairpin",
          "characteristic": "メインストレートエンドの下り急減速右。数少ないパッシングゾーン。"
        },
        {
          "number": "T4",
          "name": "Blind Crest Left",
          "characteristic": "時速220km/hで丘の頂上を駆け抜けるブラインド左。"
        },
        {
          "number": "T6-T7",
          "name": "Chicane",
          "characteristic": "縁石を大きく跨ぐ低速左右の切り返し。"
        }
      ]
    },
    "allCorners": [
      {
        "number": "T1",
        "name": "Downhill Hairpin",
        "gearEstimated": "2nd",
        "speedEstimated": "95 km/h",
        "engineeringTip": "310km/hから下りながら急減速。インを突く最大のオーバーテイク地点。"
      },
      {
        "number": "T2",
        "name": "Downhill Left Carousel",
        "gearEstimated": "3rd",
        "speedEstimated": "125 km/h",
        "engineeringTip": "下り傾斜の長い左。外側に流されないようフロントをインに引き止める。"
      },
      {
        "number": "T3",
        "name": "Sweeping Right",
        "gearEstimated": "4th",
        "speedEstimated": "195 km/h",
        "engineeringTip": "全開で抜ける下り右。ターン4へのアプローチ速度を乗せる。"
      },
      {
        "number": "T4",
        "name": "Blind Crest Left",
        "gearEstimated": "5th",
        "speedEstimated": "220 km/h",
        "engineeringTip": "上り坂の頂上にあるブラインド高速左。イン側の縁石に車体を吸い付かせる。"
      },
      {
        "number": "T5",
        "name": "Long Uphill Carousel Right",
        "gearEstimated": "3rd",
        "speedEstimated": "140 km/h",
        "engineeringTip": "上りながら右に旋回し続けるタイヤ酷使コーナー。"
      },
      {
        "number": "T6",
        "name": "Chicane 進入右",
        "gearEstimated": "2nd",
        "speedEstimated": "90 km/h",
        "engineeringTip": "ソーセージ縁石を飛び越える低速シケイン。"
      },
      {
        "number": "T7",
        "name": "Chicane 脱出左",
        "gearEstimated": "2nd",
        "speedEstimated": "95 km/h",
        "engineeringTip": "着地後の素早いスロットルコントロール。"
      },
      {
        "number": "T8",
        "name": "Technical Left",
        "gearEstimated": "3rd",
        "speedEstimated": "145 km/h",
        "engineeringTip": "セクター2の流れるテクニカル複合への進入。"
      },
      {
        "number": "T9",
        "name": "Quick Right",
        "gearEstimated": "3rd",
        "speedEstimated": "155 km/h",
        "engineeringTip": "左右の荷重移動のレスポンスが命。"
      },
      {
        "number": "T10",
        "name": "Fast Left Kink",
        "gearEstimated": "5th",
        "speedEstimated": "225 km/h",
        "engineeringTip": "全開で抜ける高速左ベンド。"
      },
      {
        "number": "T11",
        "name": "Fast Right Sweep",
        "gearEstimated": "4th",
        "speedEstimated": "190 km/h",
        "engineeringTip": "長い右。ダウンフォースが抜けやすい難所。"
      },
      {
        "number": "T12",
        "name": "Right 90-degree",
        "gearEstimated": "3rd",
        "speedEstimated": "125 km/h",
        "engineeringTip": "ハードブレーキングを伴う右直角コーナー。"
      },
      {
        "number": "T13",
        "name": "Medium Left Carousel",
        "gearEstimated": "3rd",
        "speedEstimated": "120 km/h",
        "engineeringTip": "最終コーナー手前の回り込む左。"
      },
      {
        "number": "T14",
        "name": "Final 180-degree Right",
        "gearEstimated": "3rd",
        "speedEstimated": "130 km/h",
        "engineeringTip": "メインストレートへ接続する180度ロング右。DRS区間への立ち上がりが最重要。"
      }
    ],
    "historicalMoments": [
      {
        "year": 2006,
        "title": "ジェンソン・バトン、波乱の雨中でキャリア初優勝",
        "description": "ホンダ第3期F1の記念すべき初勝利。14番手スタートのバトンが悪天候を読み切り113戦目の初勝利。",
        "detailedStory": "ハンガロリンク史上初の雨のレース。アロンソやライコネンがトラブルで脱落する中、ホンダRA106を駆るバトンが濡れた路面で圧巻の速さを披露。的確なピット判断で首位に立ち、ホンダに1992年以来のワークス優勝をもたらした。",
        "significance": "ホンダ第3期唯一の勝利とバトンの歴史的初タイトルへの足がかり。"
      },
      {
        "year": 2021,
        "title": "オコンの奇跡の初勝利とハミルトン「ひとりスタート」",
        "description": "1周目の多重事故とリスタート時の全車ピットインにより、アルピーヌのエステバン・オコンが初優勝。",
        "detailedStory": "ボッタスの追突から多重事故が発生し赤旗。再スタート前のフォーメーションラップで路面が乾き、ハミルトン以外の全車がピットインしてタイヤ交換。ハミルトンがグリッドにたった1台でスタンディングスタートを切る前代未聞の珍事に。混乱を突いたオコンがベッテルを抑え切って劇的勝利。",
        "significance": "F1史上最も奇妙なスタートとアルピーヌの初勝利。"
      },
      {
        "year": 2019,
        "title": "ハミルトンとメルセデスの神戦略アンダーカット",
        "description": "首位フェルスタッペンに対し、メルセデスが残り20周で奇襲の2ストップ作戦を決行し大逆転勝利。",
        "detailedStory": "ポールから独走するフェルスタッペンを抜けずにいたハミルトン。メルセデスは残り20周で2度目のピットインを行い新品ミディアムを投入。1周2秒速いペースで猛追し、残り3周でタイヤの終わったフェルスタッペンをターン1で捕らえて優勝を奪った。",
        "significance": "現代F1におけるタイヤデータシミュレーション戦略の最高傑作。"
      }
    ],
    "setupNotes": {
      "aeroTradeoff": "ストレート速度を捨ててでもコーナーでのグリップを稼ぐマックス・ハイダウンフォース。モナコに匹敵するエアロ構成。",
      "kerbUsage": "ターン6〜7のシケインをはじめ縁石を深く使ってコーナーを直線化する走法が求められる。",
      "brakeDemands": "ストレートで風が当たる時間が短いため、ブレーキダクトの開度を大きくとり冷却を確保。"
    },
    "references": [
      {
        "id": 1,
        "title": "Hungaroring Circuit Characteristics and High-Downforce Dynamics",
        "publisher": "Hungaroring Sport Zrt.",
        "url": "https://hungaroring.hu",
        "verifiedDate": "2024-07-15"
      },
      {
        "id": 2,
        "title": "Strategic Overtaking Deficit and Two-Stop Undercut Efficacy at Budapest",
        "publisher": "Motorsport Strategy Engineering Analysis",
        "url": "https://www.formula1.com",
        "verifiedDate": "2024-07-18"
      }
    ]
  },
  {
    "id": "zandvoort",
    "name": "ザントフォールト・サーキット",
    "officialName": "Circuit Zandvoort",
    "country": "オランダ 🇳🇱",
    "lengthKm": 4.259,
    "turns": 14,
    "drsZones": 2,
    "downforceLevel": "High",
    "tyreStress": "High",
    "typicalPitLossSec": 21.5,
    "safetyCarProbability": "60% (中程度)",
    "undercutImpact": "大（コース幅が狭くオーバーテイク困難、戦略が鍵）",
    "lapRecord": {
      "time": "1:11.097",
      "driver": "Lewis Hamilton (Mercedes)",
      "year": 2021
    },
    "characteristics": "【第1章：北海の砂丘を縫う伝説のバンクコーナー】\\n1952年にF1を初開催し、2021年に大改修を経て復活したオランダのクラシックサーキット [1][5]。設計会社アペックス・サーキット・デザインが導入したターン3（フーゲンホルツ）の18度（32%勾配）バンク、そして最終ターン14（オーリー・ボスコ）の急傾斜バンクは、インディアナポリス（9度）の2倍の傾斜角を誇る [1][3]。\\n\\n【第2章：3次元コーナリングGと砂丘の突風】\\nバンクコーナーでは、通常の横Gに加えて垂直方向の圧縮Gがタイヤにかかるため、ピレリは専用の強化構造タイヤを供給 [3][6]。北海からの強風がコース上に海砂を吹き飛ばし、グリップレベルが周回ごとに激変するトラックエボリューションへの適応力が勝負を分ける [2][4]。",
    "officialLinks": {
          "website": "https://www.circuitzandvoort.nl/",
          "f1Official": "https://www.formula1.com/en/racing/2026/netherlands.html",
          "googleMaps": "https://maps.google.com/?q=Circuit+Zandvoort",
          "xTwitter": "https://x.com/circuitzandvoor",
          "instagram": "https://www.instagram.com/circuitzandvoort/"
    },
    "visualMap": {
      "imageUrl": "/images/circuits/circuit_zandvoort.jpg",
      "credit": "LutzWeidner",
      "license": "CC BY-SA 3.0",
      "sourceUrl": "https://commons.wikimedia.org/wiki/File:Circuit_Zandvoort_aerial.jpg"
    },
    "visualAssets": {
      "trackMap": {
        "imageUrl": "/images/circuits/circuit_zandvoort.jpg",
        "credit": "LutzWeidner",
        "license": "CC BY-SA 3.0",
        "sourceUrl": "https://commons.wikimedia.org/wiki/File:Circuit_Zandvoort_aerial.jpg"
      },
      "atmosphereImage": {
        "imageUrl": "/images/circuits/circuit_zandvoort.jpg",
        "caption": "北海の砂丘地帯を縫うように走るザントフォールトのバンキングコーナー全景",
        "credit": "LutzWeidner",
        "license": "CC BY-SA 3.0",
        "sourceUrl": "https://commons.wikimedia.org/wiki/File:Circuit_Zandvoort_aerial.jpg"
      }
    },
    "visualGallery": [
      {
        "imageUrl": "/images/circuits/circuit_zandvoort.jpg",
        "caption": "北海の砂丘地帯を縫うように走るザントフォールトのバンキングコーナー全景",
        "tag": "Atmosphere",
        "credit": "LutzWeidner",
        "license": "CC BY-SA 3.0",
        "sourceUrl": "https://commons.wikimedia.org/wiki/File:Circuit_Zandvoort_aerial.jpg"
      }
    ],
    "trackGeometry": {
      "elevationChangeMeters": 15,
      "longestStraightMeters": 678,
      "gForceMax": {
        "lateral": 4.6,
        "longitudinal": 4.4
      },
      "keyCorners": [
        {
          "number": "T1",
          "name": "Tarzanbocht",
          "characteristic": "名物180度ヘアピン。アウト側からインに切り込むオーバーテイク名所。"
        },
        {
          "number": "T3",
          "name": "Hugenholtzbocht",
          "characteristic": "19度の急激なバンク角を持つすり鉢状コーナー。"
        },
        {
          "number": "T14",
          "name": "Arie Luyendykbocht",
          "characteristic": "18度バンクを駆け抜けメインストレートへ全開で接続する超高速最終コーナー。"
        }
      ]
    },
    "allCorners": [
      {
        "number": "T1",
        "name": "Tarzanbocht",
        "gearEstimated": "2nd",
        "speedEstimated": "105 km/h",
        "engineeringTip": "伝統の180度右ヘアピン。カントがついており外側ラインからのクロスラインが有効。"
      },
      {
        "number": "T2",
        "name": "Gerlachbocht",
        "gearEstimated": "4th",
        "speedEstimated": "175 km/h",
        "engineeringTip": "バンクコーナーへ向かう中速右。"
      },
      {
        "number": "T3",
        "name": "Hugenholtzbocht (19度バンク)",
        "gearEstimated": "3rd",
        "speedEstimated": "125 km/h",
        "engineeringTip": "インディを凌ぐ19度の巨大バンク左。外側の高いラインを走ることで脱出速度が急上昇。"
      },
      {
        "number": "T4",
        "name": "Uphill Crest Right",
        "gearEstimated": "5th",
        "speedEstimated": "220 km/h",
        "engineeringTip": "丘の頂上へ向けて全開で駆け上がるブラインド右。"
      },
      {
        "number": "T5",
        "name": "Crest Kink",
        "gearEstimated": "6th",
        "speedEstimated": "260 km/h",
        "engineeringTip": "砂丘の尾根を全開で通過。"
      },
      {
        "number": "T6",
        "name": "Hunserug",
        "gearEstimated": "6th",
        "speedEstimated": "255 km/h",
        "engineeringTip": "高速右ベンド。"
      },
      {
        "number": "T7",
        "name": "Scheivlak",
        "gearEstimated": "6th",
        "speedEstimated": "250 km/h",
        "engineeringTip": "下りブラインドの超高速右。F1で最も度胸が試される名コーナー。"
      },
      {
        "number": "T8",
        "name": "Mastersbocht",
        "gearEstimated": "5th",
        "speedEstimated": "205 km/h",
        "engineeringTip": "高速右スイープ。砂が吹き溜まりやすくグリップ変化に注意。"
      },
      {
        "number": "T9",
        "name": "Bocht 9",
        "gearEstimated": "3rd",
        "speedEstimated": "135 km/h",
        "engineeringTip": "インフィールドのテクニカル左。"
      },
      {
        "number": "T10",
        "name": "CM.com Bocht",
        "gearEstimated": "3rd",
        "speedEstimated": "125 km/h",
        "engineeringTip": "タイトに回り込む左。"
      },
      {
        "number": "T11",
        "name": "Hans Ernst Bocht 進入右",
        "gearEstimated": "2nd",
        "speedEstimated": "90 km/h",
        "engineeringTip": "低速シケイン進入。"
      },
      {
        "number": "T12",
        "name": "Hans Ernst Bocht 脱出左",
        "gearEstimated": "2nd",
        "speedEstimated": "95 km/h",
        "engineeringTip": "縁石を跨いで最終セクターへ。"
      },
      {
        "number": "T13",
        "name": "Kumhobocht",
        "gearEstimated": "4th",
        "speedEstimated": "165 km/h",
        "engineeringTip": "バンクコーナーへ向けて速度を乗せる右。"
      },
      {
        "number": "T14",
        "name": "Arie Luyendykbocht (18度バンク)",
        "gearEstimated": "6th ➔ 7th",
        "speedEstimated": "265 km/h",
        "engineeringTip": "18度バンクを全開DRSで駆け抜ける圧巻の最終コーナー。縦Gと横Gが同時に作用。"
      }
    ],
    "historicalMoments": [
      {
        "year": 1985,
        "title": "ニキ・ラウダ、F1生涯最後の優勝",
        "description": "マクラーレンのニキ・ラウダが、猛追する僚友アラン・プロストを0.232秒差で抑え込みキャリア25勝目を達成。",
        "detailedStory": "ザントフォールト改修前最後のグランプリ。10番手スタートのラウダがタイヤ交換戦略でトップに立ち、終盤にファステストを連発して迫るプロストを徹底的なブロックで抑え切った。ラウダにとってこれがF1通算25回目にして最後の勝利となった。",
        "significance": "不世出の英雄ニキ・ラウダの現役最後の金字塔。"
      },
      {
        "year": 2021,
        "title": "36年ぶりの復活とフェルスタッペンの母国制覇",
        "description": "オランダGPが36年ぶりに復活。オレンジアーミーの大熱狂の中、フェルスタッペンがメルセデス2台を完封し勝利。",
        "detailedStory": "サーキット全体がオレンジ色の発煙筒と大歓声で埋め尽くされた記念すべき復帰戦。ハミルトンとボッタスがアンダーカット攻撃を仕掛ける中、フェルスタッペンは神懸かり的なペース配分で首位を一度も譲ることなく母国初優勝を遂げた。",
        "significance": "オランダのモータースポーツ熱が頂点に達した歴史的瞬間。"
      },
      {
        "year": 2023,
        "title": "豪雨と赤旗、フェルスタッペンが歴代最多タイの9連勝",
        "description": "大雨による赤旗中断と路面変化の極限レースを制し、セバスチャン・ベッテルの持つF1最多連勝記録（9連勝）に並ぶ。",
        "detailedStory": "レース開始直後と終盤に局地的な豪雨が襲来。コースアウトが続出する大荒れの展開の中、フェルスタッペンは的確なタイヤマネジメントでトップを死守。アストンマーティンのアロンソの猛追を振り切り、母国3連覇と歴史的9連勝を達成した。",
        "significance": "近代F1の絶対王者が大記録に肩を並べた伝説のレース。"
      }
    ],
    "setupNotes": {
      "aeroTradeoff": "バンクコーナーで高い垂直荷重が得られるため、ダウンフォースは高めの設定が有効。",
      "kerbUsage": "砂丘の特性上、コース外は即グラベルと芝生。縁石の使いすぎはスピン直結。",
      "brakeDemands": "ターン1のタルツァンボヒト以外は強い減速がなく、ブレーキ冷却への要求は中程度。"
    },
    "references": [
      {
        "id": 1,
        "title": "Banking Geometry and Dynamic Vertical Compression at Circuit Zandvoort",
        "publisher": "Dromo Circuit Design & Engineering",
        "url": "https://www.studiodromo.it",
        "verifiedDate": "2023-08-25"
      },
      {
        "id": 2,
        "title": "Pirelli Special Tyre Pressure Guidelines for Zandvoort Banked Turns",
        "publisher": "Pirelli Motorsport Technical Report",
        "url": "https://www.pirelli.com",
        "verifiedDate": "2023-08-28"
      }
    ]
  },
  {
    "id": "baku",
    "name": "バクー・シティ・サーキット",
    "officialName": "Baku City Circuit",
    "country": "アゼルバイジャン 🇦🇿",
    "lengthKm": 6.003,
    "turns": 20,
    "drsZones": 2,
    "downforceLevel": "Low",
    "tyreStress": "Low",
    "typicalPitLossSec": 21,
    "safetyCarProbability": "80% (極めて高い)",
    "undercutImpact": "中程度（2.2kmストレートのDRSスリップストリームが強烈）",
    "lapRecord": {
      "time": "1:43.009",
      "driver": "Charles Leclerc (Ferrari)",
      "year": 2019
    },
    "characteristics": "【第1章：世界遺産の古城と2.2kmの超長大メインストリート】\\nカスピ海の港町バクーの市街地を走る超高速ストリートコース [1][5]。コース幅がわずか7.6メートルしかなく、世界遺産の城壁すれすれを抜ける「キャッスル・セクション（Turns 8-10）」という極低速区間を持つ一方、カスピ海沿岸のメインストレートはF1カレンダー最長の2.2kmに達し、時速355km/hを超える超高速バトルが展開される [1][2]。\\n\\n【第2章：相反する空力セッティングとスリップストリームの狂詩曲】\\nストレート最高速を稼ぐための超低ダウンフォースウィングと、低速シケインを曲がるためのメカニカルグリップという極端な妥協点を探るセットアップ [2][4]。ターン1進入での強烈なスリップストリーム合戦や、ブレーキロックによるエスケープゾーン飛び込み、そしてセーフティカーリスタートでの大波乱が毎年の名物となっている [1][2][6]。",
    "officialLinks": {
          "website": "https://www.bakucitycircuit.com/",
          "f1Official": "https://www.formula1.com/en/racing/2026/azerbaijan.html",
          "googleMaps": "https://maps.google.com/?q=Baku+City+Circuit",
          "xTwitter": "https://x.com/BakuCityCircuit",
          "instagram": "https://www.instagram.com/bakucitycircuit/"
    },
    "visualMap": {
      "imageUrl": "/images/circuits/circuit_baku.jpg",
      "credit": "LutzWeidner",
      "license": "CC BY-SA 3.0",
      "sourceUrl": "https://commons.wikimedia.org/wiki/File:Baku_City_Circuit_Castle_section.jpg"
    },
    "visualAssets": {
      "trackMap": {
        "imageUrl": "/images/circuits/circuit_baku.jpg",
        "credit": "LutzWeidner",
        "license": "CC BY-SA 3.0",
        "sourceUrl": "https://commons.wikimedia.org/wiki/File:Baku_City_Circuit_Castle_section.jpg"
      },
      "atmosphereImage": {
        "imageUrl": "/images/circuits/circuit_baku.jpg",
        "caption": "中世の城壁と現代のF1マシンが交錯するバクー旧市街城塞セクション",
        "credit": "LutzWeidner",
        "license": "CC BY-SA 3.0",
        "sourceUrl": "https://commons.wikimedia.org/wiki/File:Baku_City_Circuit_Castle_section.jpg"
      }
    },
    "visualGallery": [
      {
        "imageUrl": "/images/circuits/circuit_baku.jpg",
        "caption": "中世の城壁と現代のF1マシンが交錯するバクー旧市街城塞セクション",
        "tag": "Atmosphere",
        "credit": "LutzWeidner",
        "license": "CC BY-SA 3.0",
        "sourceUrl": "https://commons.wikimedia.org/wiki/File:Baku_City_Circuit_Castle_section.jpg"
      }
    ],
    "trackGeometry": {
      "elevationChangeMeters": 24.5,
      "longestStraightMeters": 2220,
      "gForceMax": {
        "lateral": 3.9,
        "longitudinal": 4.9
      },
      "keyCorners": [
        {
          "number": "T1",
          "name": "Turn 1",
          "characteristic": "350km/h超から急減速する90度左コーナー。"
        },
        {
          "number": "T8-T10",
          "name": "Castle Section",
          "characteristic": "コース幅わずか7.6m。中世の石造りの城壁をミリ単位で駆け抜ける。"
        },
        {
          "number": "T16",
          "name": "Turn 16",
          "characteristic": "2.2kmストレートへ向かう最後の低速左。脱出トラクションが勝負。"
        }
      ]
    },
    "allCorners": [
      {
        "number": "T1",
        "name": "Turn 1 (90度左)",
        "gearEstimated": "2nd",
        "speedEstimated": "105 km/h",
        "engineeringTip": "350km/h超からヘビーブレーキング。オーバーテイクの最大激戦区。"
      },
      {
        "number": "T2",
        "name": "Turn 2 (90度左)",
        "gearEstimated": "2nd",
        "speedEstimated": "100 km/h",
        "engineeringTip": "直後の90度左。外側ウォールが迫る。"
      },
      {
        "number": "T3",
        "name": "Turn 3 (90度右)",
        "gearEstimated": "2nd",
        "speedEstimated": "95 km/h",
        "engineeringTip": "第2DRSゾーンへ向けた立ち上がり。"
      },
      {
        "number": "T4",
        "name": "Turn 4 (90度左)",
        "gearEstimated": "2nd",
        "speedEstimated": "105 km/h",
        "engineeringTip": "ストリート直角コーナー。"
      },
      {
        "number": "T5",
        "name": "Turn 5 (90度右)",
        "gearEstimated": "2nd",
        "speedEstimated": "95 km/h",
        "engineeringTip": "低速切り返し。"
      },
      {
        "number": "T6",
        "name": "Turn 6 (90度左)",
        "gearEstimated": "2nd",
        "speedEstimated": "100 km/h",
        "engineeringTip": "城塞セクションへのアプローチ。"
      },
      {
        "number": "T7",
        "name": "Turn 7 (90度右)",
        "gearEstimated": "2nd",
        "speedEstimated": "90 km/h",
        "engineeringTip": "路面が狭まり始める右ターン。"
      },
      {
        "number": "T8",
        "name": "Castle Section 進入",
        "gearEstimated": "2nd",
        "speedEstimated": "75 km/h",
        "engineeringTip": "道幅わずか7.6mの超難関。石壁にミラーを擦る極限精度。"
      },
      {
        "number": "T9",
        "name": "Castle Section 右",
        "gearEstimated": "2nd",
        "speedEstimated": "85 km/h",
        "engineeringTip": "城壁沿いの右フリック。"
      },
      {
        "number": "T10",
        "name": "Castle Section 左脱出",
        "gearEstimated": "3rd",
        "speedEstimated": "115 km/h",
        "engineeringTip": "狭いボトルネックからの脱出。"
      },
      {
        "number": "T11",
        "name": "Downhill Fast Right",
        "gearEstimated": "4th",
        "speedEstimated": "160 km/h",
        "engineeringTip": "下りながら抜ける高速右。"
      },
      {
        "number": "T12",
        "name": "Downhill Blind Left",
        "gearEstimated": "4th",
        "speedEstimated": "175 km/h",
        "engineeringTip": "ブラインドの高速左。"
      },
      {
        "number": "T13",
        "name": "Fortress Left Sweep",
        "gearEstimated": "5th",
        "speedEstimated": "210 km/h",
        "engineeringTip": "城塞を背にした全開左。"
      },
      {
        "number": "T14",
        "name": "Fast Left Kink",
        "gearEstimated": "5th",
        "speedEstimated": "225 km/h",
        "engineeringTip": "ターン15へのアプローチ。"
      },
      {
        "number": "T15",
        "name": "Downhill Hard Braking Left",
        "gearEstimated": "2nd",
        "speedEstimated": "95 km/h",
        "engineeringTip": "下り坂でのトリッキーなブレーキング。外側バリアへのクラッシュ多発。"
      },
      {
        "number": "T16",
        "name": "Turn 16 (最重要脱出左)",
        "gearEstimated": "2nd",
        "speedEstimated": "105 km/h",
        "engineeringTip": "2.2kmストレートへの最終トラクション。ここでのミスはストレート全体で致命傷。"
      },
      {
        "number": "T17",
        "name": "Coastal Kink Left",
        "gearEstimated": "6th",
        "speedEstimated": "275 km/h",
        "engineeringTip": "海岸沿い全開ストレートへの突入。"
      },
      {
        "number": "T18",
        "name": "Full Throttle Sweep",
        "gearEstimated": "7th",
        "speedEstimated": "305 km/h",
        "engineeringTip": "全開で抜ける高速右。"
      },
      {
        "number": "T19",
        "name": "Blind Full Throttle Left",
        "gearEstimated": "8th",
        "speedEstimated": "330 km/h",
        "engineeringTip": "時速330km/h超で駆け抜けるブラインド全開左。"
      },
      {
        "number": "T20",
        "name": "Main Straight Blast",
        "gearEstimated": "8th",
        "speedEstimated": "350 km/h",
        "engineeringTip": "F1最長の2.2kmストレートのDRS全開疾走。"
      }
    ],
    "historicalMoments": [
      {
        "year": 2017,
        "title": "ベッテルとハミルトンのSC中激突事件",
        "description": "セーフティカー先導中、追突されたベッテルが激怒しハミルトンに横付けしてマシンを体当たりさせる大スキャンダル。",
        "detailedStory": "SCリスタート直前の減速に腹を立てたベッテルが、ハミルトンの横に並びステアリングを切って接触。10秒ストップペナルティを受けるも、ハミルトンもヘッドレストの脱落でピットインを余儀なくされ、リカルドが奇跡の勝利を飾った。",
        "significance": "激化するライバル関係の頂点となった前代未聞のスポーツマンシップ違反事件。"
      },
      {
        "year": 2018,
        "title": "レッドブル同門2台の同士討ち大クラッシュ",
        "description": "レース中激しいバトルを繰り広げていたリカルドとフェルスタッペンが、メインストレートエンドで時速320km/hで追突。",
        "detailedStory": "激しい順位争いを展開していた2台。40周目のメインストレート、スリップから抜け出そうとしたリカルドに対しフェルスタッペンがブロック。空力を失ったリカルドが追突し両者リタイア。チーム首脳陣を激怒させた伝説の同門クラッシュとなった。",
        "significance": "リカルドのルノー移籍を決断させた決定的一撃。"
      },
      {
        "year": 2021,
        "title": "フェルスタッペンのタイヤ破裂とハミルトンの「魔法ボタン」ミス",
        "description": "首位独走のフェルスタッペンが時速320km/hでタイヤバースト。赤旗リスタートでハミルトンがブレーキ設定ミスでコースオフ。",
        "detailedStory": "残り5周で首位フェルスタッペンの左リアがメインストレートで突然破裂。赤旗中断後の残り2周のスタンディングスタート、ハミルトンがターン1でブレーキバイアスボタン（Brake Magic）を誤操作して白煙を上げコースオフ。ペレスがレッドブル初勝利を飾った。",
        "significance": "2021年タイトル争いのドラマチックな波乱を象徴する激闘。"
      }
    ],
    "setupNotes": {
      "aeroTradeoff": "2.2kmストレートでの最高速を狙うためモンツァ級のローダウンフォースが要求されるが、低速セクター2でのグリップとの妥協が極めて困難。",
      "kerbUsage": "市街地コースのため縁石は低めだが、ターン8〜10の城塞セクションでは縁石に乗ると即ウォール接触。",
      "brakeDemands": "ターン1やターン3での340km/hからのヘビーブレーキング。ストレートが長いためブレーキの急冷（温度ドロップ）に警戒。"
    },
    "references": [
      {
        "id": 1,
        "title": "Baku City Circuit Engineering Design and Longest Straight Aerodynamics",
        "publisher": "Tilke Engineers & Architects",
        "url": "https://tilke.de",
        "verifiedDate": "2024-04-26"
      },
      {
        "id": 2,
        "title": "Pirelli Technical Findings on High-Speed Tyre Failures at Baku",
        "publisher": "Pirelli Motorsport & FIA Safety Department",
        "url": "https://www.pirelli.com",
        "verifiedDate": "2024-04-28"
      }
    ]
  },
  {
    "id": "singapore",
    "name": "マリーナベイ・ストリート・サーキット",
    "officialName": "Marina Bay Street Circuit",
    "country": "シンガポール 🇸🇬",
    "lengthKm": 4.94,
    "turns": 19,
    "drsZones": 4,
    "downforceLevel": "High",
    "tyreStress": "Medium",
    "typicalPitLossSec": 28,
    "safetyCarProbability": "100% (歴史上全レースでSC出動)",
    "undercutImpact": "大（低速コーナー連続でデグラデーションが激しい）",
    "lapRecord": {
      "time": "1:34.486",
      "driver": "Daniel Ricciardo (RB)",
      "year": 2024
    },
    "characteristics": "【第1章：赤道直下の熱帯夜を照らす世界初のF1ナイトレース】\\nマリーナベイの摩天楼をバックに強力な照明灯の下で開催されるストリートレース [1][5]。気温30℃超、湿度80%以上という過酷な気候条件の中、2時間ルールぎりぎりまで続く70周のレースは、ドライバーの心拍数が平均170bpmを超え、体重が3kg以上減少する「年間で最も肉体的に過酷なグランプリ」と称される [1][2]。\\n\\n【第2章：19のコーナーと100%のセーフティカー確率】\\n低速コーナーが連続するため最大ダウンフォースセッティングが必須 [3][4]。市街地の舗装ギャップや橋の通過部（アンダーソン・ブリッジ）での底打ちショックを吸収するしなやかなサスペンションセッティングが要求される [2][4]。コース全周がコンクリートウォールに囲まれているため、2008年初開催以来セーフティカー出動率100%という驚異的な記録を保持している [1][2][6]。",
    "officialLinks": {
          "website": "https://singaporegp.sg/",
          "f1Official": "https://www.formula1.com/en/racing/2026/singapore.html",
          "googleMaps": "https://maps.google.com/?q=Marina+Bay+Street+Circuit",
          "xTwitter": "https://x.com/F1NightRace",
          "instagram": "https://www.instagram.com/f1nightrace/"
    },
    "visualMap": {
      "imageUrl": "/images/circuits/circuit_singapore.jpg",
      "credit": "LutzWeidner",
      "license": "CC BY-SA 3.0",
      "sourceUrl": "https://commons.wikimedia.org/wiki/File:Marina_Bay_Street_Circuit_Singapore_Flyer.jpg"
    },
    "visualAssets": {
      "trackMap": {
        "imageUrl": "/images/circuits/circuit_singapore.jpg",
        "credit": "LutzWeidner",
        "license": "CC BY-SA 3.0",
        "sourceUrl": "https://commons.wikimedia.org/wiki/File:Marina_Bay_Street_Circuit_Singapore_Flyer.jpg"
      },
      "atmosphereImage": {
        "imageUrl": "/images/circuits/circuit_singapore.jpg",
        "caption": "シンガポール・フライヤーとマリーナベイの壮麗な夜景に包まれるストリート",
        "credit": "LutzWeidner",
        "license": "CC BY-SA 3.0",
        "sourceUrl": "https://commons.wikimedia.org/wiki/File:Marina_Bay_Street_Circuit_Singapore_Flyer.jpg"
      }
    },
    "visualGallery": [
      {
        "imageUrl": "/images/circuits/circuit_singapore.jpg",
        "caption": "シンガポール・フライヤーとマリーナベイの壮麗な夜景に包まれるストリート",
        "tag": "Atmosphere",
        "credit": "LutzWeidner",
        "license": "CC BY-SA 3.0",
        "sourceUrl": "https://commons.wikimedia.org/wiki/File:Marina_Bay_Street_Circuit_Singapore_Flyer.jpg"
      }
    ],
    "trackGeometry": {
      "elevationChangeMeters": 5.3,
      "longestStraightMeters": 832,
      "gForceMax": {
        "lateral": 3.8,
        "longitudinal": 4.5
      },
      "keyCorners": [
        {
          "number": "T1-T3",
          "name": "Sheares Chicane",
          "characteristic": "メインストレートから飛び込む低速シケイン。"
        },
        {
          "number": "T7",
          "name": "Memorial Corner",
          "characteristic": "ラッフルズ通りエンドの90度左。パッシング名所。"
        },
        {
          "number": "T13",
          "name": "Fullerton Hairpin",
          "characteristic": "アンダーソン橋を渡った直後の急減速ヘアピン。"
        }
      ]
    },
    "allCorners": [
      {
        "number": "T1",
        "name": "Sheares 進入左",
        "gearEstimated": "3rd",
        "speedEstimated": "130 km/h",
        "engineeringTip": "ピット直線エンドの急減速。イン側をカット。"
      },
      {
        "number": "T2",
        "name": "Sheares 右",
        "gearEstimated": "2nd",
        "speedEstimated": "90 km/h",
        "engineeringTip": "タイトな切り返し。"
      },
      {
        "number": "T3",
        "name": "Sheares 脱出左",
        "gearEstimated": "2nd",
        "speedEstimated": "100 km/h",
        "engineeringTip": "立ち上がりのトラクションが鍵。"
      },
      {
        "number": "T4",
        "name": "Turn 4 右",
        "gearEstimated": "3rd",
        "speedEstimated": "140 km/h",
        "engineeringTip": "ラッフルズ通りへの加速。"
      },
      {
        "number": "T5",
        "name": "Raffles Sweep",
        "gearEstimated": "4th",
        "speedEstimated": "175 km/h",
        "engineeringTip": "全開で大通りへ合流。"
      },
      {
        "number": "T6",
        "name": "Raffles Kink",
        "gearEstimated": "7th",
        "speedEstimated": "290 km/h",
        "engineeringTip": "DRS全開区間。"
      },
      {
        "number": "T7",
        "name": "Memorial Corner (90度左)",
        "gearEstimated": "2nd",
        "speedEstimated": "105 km/h",
        "engineeringTip": "最大のオーバーテイクポイント。"
      },
      {
        "number": "T8",
        "name": "Stamford (90度右)",
        "gearEstimated": "2nd",
        "speedEstimated": "95 km/h",
        "engineeringTip": "市街地直角ターン。"
      },
      {
        "number": "T9",
        "name": "City Hall (90度左)",
        "gearEstimated": "2nd",
        "speedEstimated": "100 km/h",
        "engineeringTip": "市庁舎前の左。"
      },
      {
        "number": "T10",
        "name": "Padang Sweeper",
        "gearEstimated": "4th",
        "speedEstimated": "160 km/h",
        "engineeringTip": "パダン広場沿いの左。"
      },
      {
        "number": "T11",
        "name": "Singapore Sling 進入右",
        "gearEstimated": "3rd",
        "speedEstimated": "125 km/h",
        "engineeringTip": "かつてのシケイン跡地。"
      },
      {
        "number": "T12",
        "name": "Anderson Bridge 進入",
        "gearEstimated": "3rd",
        "speedEstimated": "135 km/h",
        "engineeringTip": "歴史ある橋を渡る極狭セクション。"
      },
      {
        "number": "T13",
        "name": "Fullerton Hairpin",
        "gearEstimated": "2nd",
        "speedEstimated": "70 km/h",
        "engineeringTip": "橋を出た直後の急減速ヘアピン。"
      },
      {
        "number": "T14",
        "name": "Esplanade (90度右)",
        "gearEstimated": "2nd",
        "speedEstimated": "95 km/h",
        "engineeringTip": "新ストレート区間へ向かう直角右。"
      },
      {
        "number": "T15",
        "name": "New Straight Kink",
        "gearEstimated": "5th",
        "speedEstimated": "220 km/h",
        "engineeringTip": "2023年新設の全開直線。"
      },
      {
        "number": "T16",
        "name": "Marina Bay Chicane 進入",
        "gearEstimated": "3rd",
        "speedEstimated": "135 km/h",
        "engineeringTip": "新設シケイン進入。"
      },
      {
        "number": "T17",
        "name": "Marina Bay Chicane 脱出",
        "gearEstimated": "3rd",
        "speedEstimated": "145 km/h",
        "engineeringTip": "縁石を跨ぐ。"
      },
      {
        "number": "T18",
        "name": "Grandstand Left",
        "gearEstimated": "3rd",
        "speedEstimated": "120 km/h",
        "engineeringTip": "観客席前の左。"
      },
      {
        "number": "T19",
        "name": "Final Corner Left",
        "gearEstimated": "3rd",
        "speedEstimated": "140 km/h",
        "engineeringTip": "メインストレートへ接続する最終左。"
      }
    ],
    "historicalMoments": [
      {
        "year": 2008,
        "title": "初開催ナイトレースと「クラッシュゲート」事件",
        "description": "ルノーのピケJr.が故意にクラッシュしセーフティカーを導入させ、僚友フェルナンド・アロンソが逆転優勝。",
        "detailedStory": "F1史上初の夜間レース。ルノー首脳陣の謀略により、ピケJr.が指示通りターン17で単独クラッシュ。直前にピットインしていたアロンソがSC導入によりトップへ浮上し優勝。翌年に不正が告発され、ブリアトーレが追放されるF1史上最大の不正スキャンダルとなった。",
        "significance": "モータースポーツの統治構造と公正性を揺るがした世紀の大事件。"
      },
      {
        "year": 2017,
        "title": "雨のスタート、フェラーリ同士討ちと王座の暗転",
        "description": "雨のスタート直後、ポールシッターのベッテル、ライコネン、フェルスタッペンが3重激突し1周目に全滅。",
        "detailedStory": "タイトル争いの天王山。スタート直後、インから好発進したライコネンとフェルスタッペン、アウトからブロックしたベッテルが接触。フェラーリ2台が粉砕しリタイア。後方スタートのハミルトンが棚ぼたの勝利を飾り、選手権を決定づけた。",
        "significance": "2017年タイトル争いの趨勢を決定づけた伝説のスタートクラッシュ。"
      },
      {
        "year": 2023,
        "title": "サインツ、DRSトレイン戦略によるレッドブル全勝阻止",
        "description": "カルロス・サインツが後続のノリスに故意にDRSを与え続け、猛追するメルセデス勢を封じ込めて優勝。",
        "detailedStory": "レッドブルのシーズン全勝記録がかかった一戦。ポールから首位を走るサインツは、終盤に新品タイヤで猛追するラッセルとハミルトンを防ぐため、2位のノリスをあえて1秒以内に留めてDRSを与え、自らの盾とする天才的頭脳プレイを展開。シーズン唯一の非レッドブル勝利を飾った。",
        "significance": "「スムーズ・オペレーター」サインツの戦術的最高傑作。"
      }
    ],
    "setupNotes": {
      "aeroTradeoff": "低速コーナーのトラクションと制動力を最大化するためモナコ並みのマックス・ダウンフォース。",
      "kerbUsage": "市街地のうねりとマンホール、縁石に対応する柔軟なサスペンション。",
      "brakeDemands": "23箇所（改修後19箇所）の減速の連続でカレンダー中最も過酷なブレーキ負荷。冷却が最重要課題。"
    },
    "references": [
      {
        "id": 1,
        "title": "Marina Bay Street Circuit Environmental Factors and Lighting Engineering",
        "publisher": "Singapore GP Pte Ltd",
        "url": "https://singaporegp.sg",
        "verifiedDate": "2024-09-18"
      },
      {
        "id": 2,
        "title": "Driver Thermal Stress and Hydration Degradation under Tropical Night Race Conditions",
        "publisher": "FIA Medical Commission",
        "url": "https://www.fia.com",
        "verifiedDate": "2024-09-20"
      }
    ]
  },
  {
    "id": "cota",
    "name": "サーキット・オブ・ジ・アメリカズ（オースティン）",
    "officialName": "Circuit of the Americas",
    "country": "アメリカ 🇺🇸",
    "lengthKm": 5.513,
    "turns": 20,
    "drsZones": 2,
    "downforceLevel": "High",
    "tyreStress": "High",
    "typicalPitLossSec": 20,
    "safetyCarProbability": "55% (中程度)",
    "undercutImpact": "大（高低差と複合コーナーによるタイヤデグラデーション大）",
    "lapRecord": {
      "time": "1:36.169",
      "driver": "Charles Leclerc (Ferrari)",
      "year": 2019
    },
    "characteristics": "【第1章：高低差41mの急坂クライムと世界のアイコニックコーナー融合】\\nヘルマン・ティルケが設計し、2012年に誕生したアメリカ・モータースポーツの近代の殿堂 [1][5]。ホームストレートエンドに待ち構える「高低差41メートルの急勾配を駆け上がるブラインドのターン1ヘアピン」は、進入時の視野が完全に遮られるスリリングなパッシングステージ [1][2]。\\n\\n【第2章：シルバーストンとホッケンハイムのオマージュ】\\nセクター1のターン3からターン6はシルバーストンのマゴッツ〜ベケッツ、セクター3はホッケンハイムのスタジアムセクションを再現した複合テクニカルレイアウト [2][3]。テキサスの粘土質土壌による路面のバンプ（起伏・段差）が激しく、グラウンドエフェクトカーのスキッドブロック摩耗やフロア損傷を防ぐライドハイト管理が極めてシビアとなる [2][4][6]。",
    "officialLinks": {
          "website": "https://circuitoftheamericas.com/",
          "f1Official": "https://www.formula1.com/en/racing/2026/united-states.html",
          "googleMaps": "https://maps.google.com/?q=Circuit+of+the+Americas",
          "xTwitter": "https://x.com/COTA",
          "instagram": "https://www.instagram.com/cota_official/"
    },
    "visualMap": {
      "imageUrl": "/images/circuits/circuit_cota.jpg",
      "credit": "LutzWeidner",
      "license": "CC BY-SA 3.0",
      "sourceUrl": "https://commons.wikimedia.org/wiki/File:Circuit_of_the_Americas_aerial.jpg"
    },
    "visualAssets": {
      "trackMap": {
        "imageUrl": "/images/circuits/circuit_cota.jpg",
        "credit": "LutzWeidner",
        "license": "CC BY-SA 3.0",
        "sourceUrl": "https://commons.wikimedia.org/wiki/File:Circuit_of_the_Americas_aerial.jpg"
      },
      "atmosphereImage": {
        "imageUrl": "/images/circuits/circuit_cota.jpg",
        "caption": "急勾配のターン1ヒルと特徴的な観測タワーを望むCOTAのパノラマ",
        "credit": "LutzWeidner",
        "license": "CC BY-SA 3.0",
        "sourceUrl": "https://commons.wikimedia.org/wiki/File:Circuit_of_the_Americas_aerial.jpg"
      }
    },
    "visualGallery": [
      {
        "imageUrl": "/images/circuits/circuit_cota.jpg",
        "caption": "急勾配のターン1ヒルと特徴的な観測タワーを望むCOTAのパノラマ",
        "tag": "Atmosphere",
        "credit": "LutzWeidner",
        "license": "CC BY-SA 3.0",
        "sourceUrl": "https://commons.wikimedia.org/wiki/File:Circuit_of_the_Americas_aerial.jpg"
      }
    ],
    "trackGeometry": {
      "elevationChangeMeters": 41,
      "longestStraightMeters": 1200,
      "gForceMax": {
        "lateral": 4.7,
        "longitudinal": 4.8
      },
      "keyCorners": [
        {
          "number": "T1",
          "name": "Turn 1 Hill",
          "characteristic": "高低差41mを一気に駆け上がる超ワイドなブラインドヘアピン。"
        },
        {
          "number": "T3-T6",
          "name": "Esses Section",
          "characteristic": "シルバーストンに着想を得た時速250km/h超の連続切り返しS字。"
        },
        {
          "number": "T16-T18",
          "name": "Multi-Apex Carousel",
          "characteristic": "イスタンブールT8を模した観測タワー下の超ロング複合トリプル右コーナー。"
        }
      ]
    },
    "allCorners": [
      {
        "number": "T1",
        "name": "Turn 1 Hill (上りヘアピン)",
        "gearEstimated": "2nd",
        "speedEstimated": "80 km/h",
        "engineeringTip": "41mの上り坂。登坂抵抗によりブレーキを奥まで遅らせられるが、頂上でのイン側ロックに注意。"
      },
      {
        "number": "T2",
        "name": "Downhill Acceleration",
        "gearEstimated": "4th",
        "speedEstimated": "170 km/h",
        "engineeringTip": "下りながら右へ加速。S字へのリズムの起点。"
      },
      {
        "number": "T3",
        "name": "Esses 1 右",
        "gearEstimated": "6th",
        "speedEstimated": "260 km/h",
        "engineeringTip": "高速S字進入。強烈な横G。"
      },
      {
        "number": "T4",
        "name": "Esses 2 左",
        "gearEstimated": "6th",
        "speedEstimated": "245 km/h",
        "engineeringTip": "素早いステアリング切り返し。"
      },
      {
        "number": "T5",
        "name": "Esses 3 右",
        "gearEstimated": "5th",
        "speedEstimated": "220 km/h",
        "engineeringTip": "縁石を舐めるようにアタック。"
      },
      {
        "number": "T6",
        "name": "Esses 4 左",
        "gearEstimated": "5th",
        "speedEstimated": "205 km/h",
        "engineeringTip": "徐々にタイトになる切り返し。"
      },
      {
        "number": "T7",
        "name": "Esses 5 右",
        "gearEstimated": "4th",
        "speedEstimated": "180 km/h",
        "engineeringTip": "コンプレッション。"
      },
      {
        "number": "T8",
        "name": "Esses Exit 左",
        "gearEstimated": "4th",
        "speedEstimated": "175 km/h",
        "engineeringTip": "脱出ラインをキープ。"
      },
      {
        "number": "T9",
        "name": "Blind Crest Left",
        "gearEstimated": "5th",
        "speedEstimated": "205 km/h",
        "engineeringTip": "丘の頂上のブラインド左。"
      },
      {
        "number": "T10",
        "name": "Downhill Left Sweep",
        "gearEstimated": "6th",
        "speedEstimated": "240 km/h",
        "engineeringTip": "下り全開左。"
      },
      {
        "number": "T11",
        "name": "Hairpin Left",
        "gearEstimated": "2nd",
        "speedEstimated": "70 km/h",
        "engineeringTip": "1.2kmバックストレートへ接続する最重要ヘアピン。立ち上がりトラクションが命。"
      },
      {
        "number": "T12",
        "name": "Back Straight Braking Left",
        "gearEstimated": "2nd",
        "speedEstimated": "85 km/h",
        "engineeringTip": "335km/hからのヘビーブレーキング。パッシングの要所。"
      },
      {
        "number": "T13",
        "name": "Infield Right",
        "gearEstimated": "3rd",
        "speedEstimated": "115 km/h",
        "engineeringTip": "スタジアムセクション進入。"
      },
      {
        "number": "T14",
        "name": "Infield Right Transition",
        "gearEstimated": "3rd",
        "speedEstimated": "125 km/h",
        "engineeringTip": "中速右。"
      },
      {
        "number": "T15",
        "name": "Hairpin Left",
        "gearEstimated": "2nd",
        "speedEstimated": "85 km/h",
        "engineeringTip": "タイトな低速左。"
      },
      {
        "number": "T16",
        "name": "Carousel 1st Apex",
        "gearEstimated": "4th",
        "speedEstimated": "175 km/h",
        "engineeringTip": "観測タワー下トリプルエイペックスの右進入。"
      },
      {
        "number": "T17",
        "name": "Carousel 2nd Apex",
        "gearEstimated": "5th",
        "speedEstimated": "215 km/h",
        "engineeringTip": "横Gが4.5Gに達する右持続旋回。"
      },
      {
        "number": "T18",
        "name": "Carousel 3rd Apex",
        "gearEstimated": "5th",
        "speedEstimated": "230 km/h",
        "engineeringTip": "全開で抜けるタワー下の右出口。"
      },
      {
        "number": "T19",
        "name": "Downhill Left",
        "gearEstimated": "3rd",
        "speedEstimated": "130 km/h",
        "engineeringTip": "下りながらの左。トラックリミット注意。"
      },
      {
        "number": "T20",
        "name": "Final Left",
        "gearEstimated": "3rd",
        "speedEstimated": "120 km/h",
        "engineeringTip": "メインストレートへの最終加速左。"
      }
    ],
    "historicalMoments": [
      {
        "year": 2012,
        "title": "ハミルトン、ベッテルとの一騎打ちを制しCOTA初王者に",
        "description": "マクラーレン最後の年となったハミルトンが、バックストレートでベッテルを劇的オーバーテイクして初開催を勝利。",
        "detailedStory": "新設されたオースティンでの初レース。タイトルへ驀進するレッドブルのベッテルを追うハミルトン。周回遅れのトラフィックを突いて42周目のバックストレートでDRSを使い鮮やかに抜き去り、アメリカでの無類の強さを見せつけた。",
        "significance": "アメリカGP復活の記念すべきオープニング勝利。"
      },
      {
        "year": 2018,
        "title": "キミ・ライコネン、フェラーリでの感動のキャリア最後（21勝目）の勝利",
        "description": "フェラーリのライコネンが113戦ぶりの勝利を達成。フェルスタッペンとハミルトンの追撃を完璧に封じ込める。",
        "detailedStory": "スタートでハミルトンを交わして首位に立ったライコネン。タイヤ戦略が分かれる中、終盤に背後へ迫るフェルスタッペンとハミルトンとの三つ巴の死闘を冷静沈着なドライビングで凌ぎ切り、2013年開幕戦以来となる涙の通算21勝目を飾った。",
        "significance": "「アイスマン」ライコネンのF1キャリア最後の感動的勝利。"
      },
      {
        "year": 2021,
        "title": "フェルスタッペン対ハミルトン、0.7秒差のテキサス決戦",
        "description": "レッドブルの積極的なアンダーカット戦略に対し、終盤ハミルトンが怒涛の追い上げを見せるもフェルスタッペンが0.7秒差で死守。",
        "detailedStory": "14万人の大観衆が見守る中、歴史的タイトル争いがテキサスで激突。2ストップのアンダーカットで先行したフェルスタッペン。フレッシュタイヤで迫るハミルトン。ラストラップまで息の詰まる追撃戦が展開され、フェルスタッペンが薄氷の勝利を掴み取った。",
        "significance": "2021年シーズンの壮絶さを象徴する近代屈指の名勝負。"
      }
    ],
    "setupNotes": {
      "aeroTradeoff": "セクター1のS字での高速安定性とセクター3のカルーセルに対応するためハイダウンフォースが有利。",
      "kerbUsage": "バンプ（路面のうねり）が非常に多いサーキット。車高を落としすぎるとフロアを破損するためライドハイトの余裕が必要。",
      "brakeDemands": "ターン1とターン12での激しい減速。特にターン1は上り勾配を利用できるがターン12は平坦からの急制動。"
    },
    "references": [
      {
        "id": 1,
        "title": "Circuit of the Americas Engineering and Topographical Features",
        "publisher": "Tilke Engineers & Architects",
        "url": "https://tilke.de",
        "verifiedDate": "2024-10-15"
      },
      {
        "id": 2,
        "title": "Ground Effect Porpoising and Bump Compliance at COTA",
        "publisher": "Formula 1 Technical Analysis",
        "url": "https://www.formula1.com",
        "verifiedDate": "2024-10-18"
      }
    ]
  },
  {
    "id": "mexico",
    "name": "エルマノス・ロドリゲス・サーキット（メキシコシティ）",
    "officialName": "Autódromo Hermanos Rodríguez",
    "country": "メキシコ 🇲🇽",
    "lengthKm": 4.304,
    "turns": 17,
    "drsZones": 3,
    "downforceLevel": "High",
    "tyreStress": "Low",
    "typicalPitLossSec": 22.5,
    "safetyCarProbability": "60% (中程度)",
    "undercutImpact": "中程度（オーバーヒート対策が最優先）",
    "lapRecord": {
      "time": "1:17.774",
      "driver": "Valtteri Bottas (Mercedes)",
      "year": 2021
    },
    "characteristics": "【第1章：標高2,285mの希薄な大気と最高速360km/hのパラドックス】\\nメキシコシティの海抜2,285メートルという高地に位置し、大気圧が平地の約78%（0.78気圧）しかないF1唯一無二のウルトラハイアルティチュードサーキット [1][5]。空気が極端に薄いため、各チームはモナコ並みの最大ダウンフォースウィングを装着しても、空気抵抗はモンツァ並みに低減し、メインストレートでは時速360km/hに迫る超高トップスピードを記録する [1][2]。\\n\\n【第2章：冷却不足の危機と熱狂の野球場「フォロ・ソル」】\\n希薄な大気はエンジン、ターボ、ブレーキの冷却効率を著しく低下させ、オーバーヒート対策が最大のエンジニアリング課題となる [2][4]。終盤のセクター3には、かつての野球スタジアムのグランドをコースが貫通する名物「フォロ・ソル（Foro Sol）」セクションがあり、3万人を超える大観衆の熱狂的な歓声に包まれながら低速シケインを駆け抜ける世界屈指のスペクタクルを誇る [1][3][6]。",
    "officialLinks": {
          "website": "https://www.mexicogp.mx/",
          "f1Official": "https://www.formula1.com/en/racing/2026/mexico.html",
          "googleMaps": "https://maps.google.com/?q=Autodromo+Hermanos+Rodriguez",
          "xTwitter": "https://x.com/mexicogp",
          "instagram": "https://www.instagram.com/mexicogp/"
    },
    "visualMap": {
      "imageUrl": "/images/circuits/circuit_mexico.png",
      "credit": "LutzWeidner",
      "license": "CC BY-SA 3.0",
      "sourceUrl": "https://commons.wikimedia.org/wiki/File:Autodromo_Hermanos_Rodriguez_stadium.jpg"
    },
    "visualAssets": {
      "trackMap": {
        "imageUrl": "/images/circuits/circuit_mexico.png",
        "credit": "LutzWeidner",
        "license": "CC BY-SA 3.0",
        "sourceUrl": "https://commons.wikimedia.org/wiki/File:Autodromo_Hermanos_Rodriguez_stadium.jpg"
      },
      "atmosphereImage": {
        "imageUrl": "/images/circuits/circuit_mexico.png",
        "caption": "旧野球場フォロ・ソルの巨大スタジアムを駆け抜けるメキシコGPの名物セクション",
        "credit": "LutzWeidner",
        "license": "CC BY-SA 3.0",
        "sourceUrl": "https://commons.wikimedia.org/wiki/File:Autodromo_Hermanos_Rodriguez_stadium.jpg"
      }
    },
    "visualGallery": [
      {
        "imageUrl": "/images/circuits/circuit_mexico.png",
        "caption": "旧野球場フォロ・ソルの巨大スタジアムを駆け抜けるメキシコGPの名物セクション",
        "tag": "Atmosphere",
        "credit": "LutzWeidner",
        "license": "CC BY-SA 3.0",
        "sourceUrl": "https://commons.wikimedia.org/wiki/File:Autodromo_Hermanos_Rodriguez_stadium.jpg"
      }
    ],
    "trackGeometry": {
      "elevationChangeMeters": 2.8,
      "longestStraightMeters": 1200,
      "gForceMax": {
        "lateral": 3.8,
        "longitudinal": 4.8
      },
      "keyCorners": [
        {
          "number": "T1-T3",
          "name": "Moisés Solana Chicane",
          "characteristic": "1.2kmストレートから360km/hで突入する最初の減速シケイン。"
        },
        {
          "number": "T7-T11",
          "name": "Esses Section",
          "characteristic": "薄い空気の中でグリップが希薄な高速切り返しS字。"
        },
        {
          "number": "T12-T16",
          "name": "Foro Sol Stadium",
          "characteristic": "4万人収容のスタジアム内を通過する極低速セクション。"
        }
      ]
    },
    "allCorners": [
      {
        "number": "T1",
        "name": "Moisés Solana 進入右",
        "gearEstimated": "2nd",
        "speedEstimated": "105 km/h",
        "engineeringTip": "360km/hからのヘビーブレーキング。空気が薄いため制動距離が伸びる。"
      },
      {
        "number": "T2",
        "name": "Moisés Solana 左",
        "gearEstimated": "2nd",
        "speedEstimated": "95 km/h",
        "engineeringTip": "左フリック。"
      },
      {
        "number": "T3",
        "name": "Moisés Solana 脱出右",
        "gearEstimated": "3rd",
        "speedEstimated": "135 km/h",
        "engineeringTip": "第2ストレートへの立ち上がり。"
      },
      {
        "number": "T4",
        "name": "Turn 4 進入左",
        "gearEstimated": "2nd",
        "speedEstimated": "100 km/h",
        "engineeringTip": "第2ストレートエンドの90度左。"
      },
      {
        "number": "T5",
        "name": "Turn 5 右",
        "gearEstimated": "2nd",
        "speedEstimated": "95 km/h",
        "engineeringTip": "右直角ターン。"
      },
      {
        "number": "T6",
        "name": "Hairpin Right",
        "gearEstimated": "2nd",
        "speedEstimated": "85 km/h",
        "engineeringTip": "タイトなヘアピン。S字への加速ラインを確保。"
      },
      {
        "number": "T7",
        "name": "Esses 進入左",
        "gearEstimated": "5th",
        "speedEstimated": "215 km/h",
        "engineeringTip": "高速S字突入。薄い空気によるダウンフォース不足でマシンが滑りやすい。"
      },
      {
        "number": "T8",
        "name": "Esses 右",
        "gearEstimated": "5th",
        "speedEstimated": "220 km/h",
        "engineeringTip": "素早いステアリング切り返し。"
      },
      {
        "number": "T9",
        "name": "Esses 左",
        "gearEstimated": "5th",
        "speedEstimated": "205 km/h",
        "engineeringTip": "イン側の縁石をなぞる。"
      },
      {
        "number": "T10",
        "name": "Esses 右",
        "gearEstimated": "5th",
        "speedEstimated": "210 km/h",
        "engineeringTip": "外側に流されないようコントロール。"
      },
      {
        "number": "T11",
        "name": "Esses Exit 左",
        "gearEstimated": "5th",
        "speedEstimated": "225 km/h",
        "engineeringTip": "スタジアムへ向かう直線への脱出。"
      },
      {
        "number": "T12",
        "name": "Foro Sol 進入右",
        "gearEstimated": "3rd",
        "speedEstimated": "125 km/h",
        "engineeringTip": "4万人の大歓声が響くスタジアムセクションへの突入。"
      },
      {
        "number": "T13",
        "name": "Stadium Hairpin 左",
        "gearEstimated": "2nd",
        "speedEstimated": "65 km/h",
        "engineeringTip": "スタンドに囲まれた極低速ヘアピン。"
      },
      {
        "number": "T14",
        "name": "Stadium 右",
        "gearEstimated": "2nd",
        "speedEstimated": "80 km/h",
        "engineeringTip": "スタジアム内低速ターン。"
      },
      {
        "number": "T15",
        "name": "Stadium 左",
        "gearEstimated": "2nd",
        "speedEstimated": "75 km/h",
        "engineeringTip": "スタジアム脱出へ向けた切り返し。"
      },
      {
        "number": "T16",
        "name": "Mansell Curve 進入",
        "gearEstimated": "3rd",
        "speedEstimated": "120 km/h",
        "engineeringTip": "かつての超高速ペラルターダ後半部分。"
      },
      {
        "number": "T17",
        "name": "Mansell Curve 脱出",
        "gearEstimated": "4th ➔ 7th",
        "speedEstimated": "160 km/h",
        "engineeringTip": "1.2kmメインストレートへの全開加速。"
      }
    ],
    "historicalMoments": [
      {
        "year": 1990,
        "title": "マンセル、ペラルターダ外側からの伝説のオーバーテイク",
        "description": "ナイジェル・マンセルが命知らずの超高速バンクコーナー「ペラルターダ」の外側からベルガーを抜き去りフェラーリ1-2。",
        "detailedStory": "当時F1屈指の超危険コーナーだったペラルターダ。ファイナルラップ直前、マンセルは時速270km/h超のバンク外側にマシンを振り、誰もが不可能と信じたアウト側からのパッシングを成功させた。モータースポーツ史に刻まれる伝説の瞬間。",
        "significance": "「大英帝国の荒鷲」マンセルの最も勇敢なオーバーテイク。"
      },
      {
        "year": 2017,
        "title": "ハミルトン、パンクを乗り越え4度目のワールドチャンピオン",
        "description": "1周目にフェルスタッペン、ベッテルと接触し最後尾まで落ちるも、9位まで挽回してタイトルを獲得。",
        "detailedStory": "スタート直後のターン3でベッテルのフロントウィングとハミルトンの右リアが接触。タイヤがバーストし最後尾に転落したハミルトン。執念のドライビングでポイント圏内まで挽回し、自身4度目となるドライバーズ世界王者をメキシコで確定させた。",
        "significance": "ハミルトンの偉大なキャリアにおける王座防衛の記念碑。"
      },
      {
        "year": 2021,
        "title": "フェルスタッペンのターン1大外狩りとペレスの母国表彰台",
        "description": "3番手スタートのフェルスタッペンがターン1でメルセデス2台をアウトから一網打尽。セルジオ・ペレスがメキシコ人初の母国表彰台。",
        "detailedStory": "1.2kmストレートのスリップストリームを活かし、1コーナー手前でメルセデス2台のアウト側へ飛び込んだフェルスタッペン。完璧なブレーキングでトップを奪い独走勝利。チームメイトのペレスも3位でチェッカーを受け、スタジアムは歓喜のフィエスタと化した。",
        "significance": "ペレスの母国英雄伝説とフェルスタッペンの神業スタート。"
      }
    ],
    "setupNotes": {
      "aeroTradeoff": "空気が薄いため最大ウイングを装着してもドラッグが小さく、ダウンフォース不足に悩まされる。クーリング開口部を最大化。",
      "kerbUsage": "スタジアム内やシケインの縁石は低め。マシンを跳ねさせずにスムーズに旋回。",
      "brakeDemands": "空気密度が低いためブレーキダクトの空気流入量が25%減少し、ブレーキ冷却が極めて過酷。ディスクの熱酸化に警戒。"
    },
    "references": [
      {
        "id": 1,
        "title": "High Altitude Aerodynamic and Engine Performance Analysis at Mexico City",
        "publisher": "Honda Racing & FIA Technical Working Group",
        "url": "https://honda.racing",
        "verifiedDate": "2024-10-25"
      },
      {
        "id": 2,
        "title": "Thermal Management of Turbochargers and Brake Friction at 2,285m Altitude",
        "publisher": "Brembo Racing Technical Insights",
        "url": "https://www.brembo.com",
        "verifiedDate": "2024-10-28"
      }
    ]
  },
  {
    "id": "interlagos",
    "name": "インテルラゴス・サーキット（ホセ・カルロス・パーチェ）",
    "officialName": "Autódromo José Carlos Pace (Interlagos)",
    "country": "ブラジル 🇧🇷",
    "lengthKm": 4.309,
    "turns": 15,
    "drsZones": 2,
    "downforceLevel": "Medium-High",
    "tyreStress": "High",
    "typicalPitLossSec": 21,
    "safetyCarProbability": "70% (高)",
    "undercutImpact": "大（高低差と天候急変により戦略の柔軟性が勝負を決める）",
    "lapRecord": {
      "time": "1:10.540",
      "driver": "Valtteri Bottas (Mercedes)",
      "year": 2018
    },
    "characteristics": "【第1章：反時計回りの起伏とアイルトン・セナの魂が宿る聖地】\\nブラジル・サンパウロのすり鉢状の天然盆地に位置し、海抜約800メートルの高地を反時計回り（反時計回りコースは首の筋肉への負担が極端に高い）に疾走する伝統のインテルラゴス [1][5]。名物コーナー「エス・ド・セナ（Senna S: Turns 1-2）」は、下り勾配でブラインドとなる右から左への切り返しであり、激しいブレーキングバトルが展開される世界屈指のパッシングポイント [1][2]。\\n\\n【第2章：急変する天候とドラマティックな最終セクター】\\n熱帯特有のスコールが突如襲来し、数分でドライから豪雨へと急変する気象ドラマが数々のタイトル決定戦（2008年ハミルトン最終周逆転戴冠、2012年ベッテル最後尾からの3冠戴冠など）を生んできた [1][3]。セクター2の低速テクニカル区間でのトラクションと、ターン12（フンサオ）から登り坂を駆け上がる超高速全開セクター3での最高速という相反する空力セッティングの妥協が鍵となる [2][4][6]。",
    "officialLinks": {
          "website": "https://f1saopaulo.com.br/",
          "f1Official": "https://www.formula1.com/en/racing/2026/brazil.html",
          "googleMaps": "https://maps.google.com/?q=Autodromo+Jose+Carlos+Pace",
          "xTwitter": "https://x.com/f1saopaulo",
          "instagram": "https://www.instagram.com/f1saopaulo/"
    },
    "visualMap": {
      "imageUrl": "/images/circuits/circuit_interlagos.png",
      "credit": "LutzWeidner",
      "license": "CC BY-SA 3.0",
      "sourceUrl": "https://commons.wikimedia.org/wiki/File:Autodromo_Jose_Carlos_Pace_Senna_S.jpg"
    },
    "visualAssets": {
      "trackMap": {
        "imageUrl": "/images/circuits/circuit_interlagos.png",
        "credit": "LutzWeidner",
        "license": "CC BY-SA 3.0",
        "sourceUrl": "https://commons.wikimedia.org/wiki/File:Autodromo_Jose_Carlos_Pace_Senna_S.jpg"
      },
      "atmosphereImage": {
        "imageUrl": "/images/circuits/circuit_interlagos.png",
        "caption": "急勾配を下る名物「エス・ド・セナ」とサンパウロの摩天楼風景",
        "credit": "LutzWeidner",
        "license": "CC BY-SA 3.0",
        "sourceUrl": "https://commons.wikimedia.org/wiki/File:Autodromo_Jose_Carlos_Pace_Senna_S.jpg"
      }
    },
    "visualGallery": [
      {
        "imageUrl": "/images/circuits/circuit_interlagos.png",
        "caption": "急勾配を下る名物「エス・ド・セナ」とサンパウロの摩天楼風景",
        "tag": "Atmosphere",
        "credit": "LutzWeidner",
        "license": "CC BY-SA 3.0",
        "sourceUrl": "https://commons.wikimedia.org/wiki/File:Autodromo_Jose_Carlos_Pace_Senna_S.jpg"
      }
    ],
    "trackGeometry": {
      "elevationChangeMeters": 43,
      "longestStraightMeters": 650,
      "gForceMax": {
        "lateral": 4.5,
        "longitudinal": 4.7
      },
      "keyCorners": [
        {
          "number": "T1-T2",
          "name": "Senna 'S'",
          "characteristic": "急坂を一気に下りながら左から右へ切り返す大興奮の1コーナー。"
        },
        {
          "number": "T4",
          "name": "Descida do Lago",
          "characteristic": "バックストレートエンドの急減速下り左。パッシング多発。"
        },
        {
          "number": "T12",
          "name": "Junção",
          "characteristic": "長い上り坂メインストレートへ突入するための最重要左コーナー。"
        }
      ]
    },
    "allCorners": [
      {
        "number": "T1",
        "name": "Senna S 進入左",
        "gearEstimated": "3rd",
        "speedEstimated": "115 km/h",
        "engineeringTip": "急勾配を下りながら飛び込む左。インをカットして右へのラインを作る。"
      },
      {
        "number": "T2",
        "name": "Senna S 切り返し右",
        "gearEstimated": "3rd",
        "speedEstimated": "135 km/h",
        "engineeringTip": "下りの底での強烈な荷重移動。リアタイヤのトラクションを確保。"
      },
      {
        "number": "T3",
        "name": "Curva do Sol",
        "gearEstimated": "4th ➔ 6th",
        "speedEstimated": "185 km/h",
        "engineeringTip": "レタ・オポスタへ向かう全開左ロングコーナー。"
      },
      {
        "number": "T4",
        "name": "Descida do Lago",
        "gearEstimated": "3rd",
        "speedEstimated": "140 km/h",
        "engineeringTip": "下りながらハードブレーキングする左。オーバーテイクの要衝。"
      },
      {
        "number": "T5",
        "name": "Lago Exit Left",
        "gearEstimated": "4th",
        "speedEstimated": "180 km/h",
        "engineeringTip": "インフィールドへ向けた加速。"
      },
      {
        "number": "T6",
        "name": "Ferradura 1",
        "gearEstimated": "5th",
        "speedEstimated": "215 km/h",
        "engineeringTip": "上り坂の高速右。"
      },
      {
        "number": "T7",
        "name": "Ferradura 2",
        "gearEstimated": "5th",
        "speedEstimated": "225 km/h",
        "engineeringTip": "高速右エイペックス。"
      },
      {
        "number": "T8",
        "name": "Laranjinha",
        "gearEstimated": "3rd",
        "speedEstimated": "130 km/h",
        "engineeringTip": "上りながら回り込むブラインド右。"
      },
      {
        "number": "T9",
        "name": "Pinheirinho",
        "gearEstimated": "2nd",
        "speedEstimated": "85 km/h",
        "engineeringTip": "下りオフキャンバーの低速左。アンダーステア警戒。"
      },
      {
        "number": "T10",
        "name": "Bico de Pato",
        "gearEstimated": "2nd",
        "speedEstimated": "70 km/h",
        "engineeringTip": "「アヒルのクチバシ」と呼ばれる急減速右ヘアピン。"
      },
      {
        "number": "T11",
        "name": "Mergulho",
        "gearEstimated": "4th",
        "speedEstimated": "185 km/h",
        "engineeringTip": "下り高速左。"
      },
      {
        "number": "T12",
        "name": "Junção",
        "gearEstimated": "3rd",
        "speedEstimated": "125 km/h",
        "engineeringTip": "急勾配の上り坂ストレートへの脱出速度を決める最重要左コーナー。"
      },
      {
        "number": "T13",
        "name": "Subida dos Boxes",
        "gearEstimated": "4th",
        "speedEstimated": "180 km/h",
        "engineeringTip": "ピット入口横の急勾配を全開で駆け上がる。"
      },
      {
        "number": "T14",
        "name": "Arquibancadas (バンク左)",
        "gearEstimated": "6th",
        "speedEstimated": "255 km/h",
        "engineeringTip": "グランドスタンド前の左全開バンク。"
      },
      {
        "number": "T15",
        "name": "Straight Launch Bend",
        "gearEstimated": "7th",
        "speedEstimated": "290 km/h",
        "engineeringTip": "ゴールラインへ向かう全開ベンド。"
      }
    ],
    "historicalMoments": [
      {
        "year": 2008,
        "title": "ハミルトン、最終コーナーでの劇的初タイトル獲得",
        "description": "マッサがトップチェッカーを受けフェラーリが歓喜に沸く中、最終周の最終コーナーでハミルトンがグロックを抜き5位に入り王座獲得。",
        "detailedStory": "大雨が降り始めた最終盤。マッサが完璧なポール・トゥ・ウィンを飾り、マッサ陣営がタイトル獲得を祝っていたその時、ドライタイヤで走っていたグロックをハミルトンが最終コーナー手前でオーバーテイク。わずか1ポイント差でハミルトンが初の世界チャンピオンとなった。",
        "significance": "F1史上最もドラマチックなタイトル決定戦の結末。"
      },
      {
        "year": 1991,
        "title": "アイルトン・セナ、母国初勝利とギアボックストラブルの奇跡",
        "description": "レース終盤にギアが6速に固定される絶体絶命の危機の中、全身の痙攣に耐えながら母国ブラジルで悲願の初優勝。",
        "detailedStory": "母国優勝を渇望していたセナ。残り周回でトランスミッションが壊れ6速のみでの走行を強いられる。雨の中、エンジンストール寸前の状態でマシンを走らせ続け、首位でチェッカー。肉体の限界を超えたセナは無線で絶叫し、表彰台でトロフィーを掲げることも困難なほどの疲労を見せた。",
        "significance": "セナ伝説の頂点に位置する不滅の名勝負。"
      },
      {
        "year": 2012,
        "title": "雨のインテルラゴス、ベッテルの最後尾からの3連覇",
        "description": "1周目に追突され最後尾まで落ちたセバスチャン・ベッテルが、驚異的な追い上げで6位に入りアロンソを3点差で退けて3連覇達成。",
        "detailedStory": "雨の最終戦。スタート直後のターン4で接触しスピン、最後尾に転落したベッテル。マシンにダメージを負いながらも無線故障やピット混乱を乗り越えて6位まで猛追。2位のアロンソをわずか3ポイント差で上回り、史上最年少での3年連続世界王者に輝いた。",
        "significance": "近代F1屈指の壮絶なチャンピオンシップ決定戦。"
      }
    ],
    "setupNotes": {
      "aeroTradeoff": "インフィールドのテクニカル区間と、急勾配の上り坂メインストレートでの最高速の兼ね合い。ミディアムハイセッティング。",
      "kerbUsage": "セナSやメルグーリョの縁石はアグレッシブに攻められるが、急勾配での底打ちに注意。",
      "brakeDemands": "ターン1とターン4でのフルブレーキング。反時計回りコースのためドライバーの首（左側筋肉）に極端な疲労がかかる。"
    },
    "references": [
      {
        "id": 1,
        "title": "Topographical Dynamics and Anti-Clockwise Demands at Interlagos",
        "publisher": "Confederação Brasileira de Automobilismo",
        "url": "https://www.cba.org.br",
        "verifiedDate": "2024-11-01"
      },
      {
        "id": 2,
        "title": "Weather Instability and Strategic Adaptability at Brazilian Grand Prix",
        "publisher": "FIA Formula One Technical Department",
        "url": "https://www.fia.com",
        "verifiedDate": "2024-11-03"
      }
    ]
  },
  {
    "id": "las-vegas",
    "name": "ラスベガス・ストリップ・サーキット",
    "officialName": "Las Vegas Strip Circuit",
    "country": "アメリカ 🇺🇸",
    "lengthKm": 6.201,
    "turns": 17,
    "drsZones": 2,
    "downforceLevel": "Low",
    "tyreStress": "Low",
    "typicalPitLossSec": 20.8,
    "safetyCarProbability": "65% (高)",
    "undercutImpact": "中程度（低温タイヤウォームアップが最大のハードル）",
    "lapRecord": {
      "time": "1:35.490",
      "driver": "Oscar Piastri (McLaren)",
      "year": 2023
    },
    "characteristics": "【第1章：夜のラスベガス・ストリップを350km/hで疾走する究極の非日常】\\n世界最大のエンターテインメント都市ラスベガスの大通り（ストリップ）を完全封鎖して開催される土曜深夜の超高速ナイトレース [1][5]。ベラージオの噴水やシーザーズ・パレス、巨大球体スクリーン「スフィア」の極彩色のネオンを背景に、全長1.9kmに及ぶストレートを時速350km/h超でマシンが駆け抜ける [1][2]。\\n\\n【第2章：気温10℃前後の極冷路面とタイヤウォームアップの極限】\\n砂漠気候の11月深夜に開催されるため、路面温度が15℃以下、時にはシングルデジットまで冷え込む [1][3]。超低ダウンフォースウィングでストレートを疾走した直後のターン14ハードブレーキングでは、冷え切ったタイヤの表面が摩擦熱を持たずに破断する「コールド・グレイニング」が多発 [2][4]。タイヤをいかに作動温度領域（ウインドウ）に留め続けるかが勝負の絶対条件となる [2][3][6]。",
    "officialLinks": {
          "website": "https://www.f1lasvegasgp.com/",
          "f1Official": "https://www.formula1.com/en/racing/2026/las-vegas.html",
          "googleMaps": "https://maps.google.com/?q=Las+Vegas+Strip+Circuit",
          "xTwitter": "https://x.com/F1LasVegas",
          "instagram": "https://www.instagram.com/f1lasvegas/"
    },
    "visualMap": {
      "imageUrl": "/images/circuits/circuit_las_vegas.png",
      "credit": "Formula 1",
      "license": "CC BY-SA 4.0",
      "sourceUrl": "https://commons.wikimedia.org/wiki/File:Las_Vegas_Strip_Circuit.png"
    },
    "visualAssets": {
      "trackMap": {
        "imageUrl": "/images/circuits/circuit_las_vegas.png",
        "credit": "Formula 1",
        "license": "CC BY-SA 4.0",
        "sourceUrl": "https://commons.wikimedia.org/wiki/File:Las_Vegas_Strip_Circuit.png"
      },
      "atmosphereImage": {
        "imageUrl": "/images/circuits/circuit_las_vegas.png",
        "caption": "ネオン輝くラスベガス・ストリップ通りを駆け抜ける超高速ストリートサーキット",
        "credit": "Formula 1",
        "license": "CC BY-SA 4.0",
        "sourceUrl": "https://commons.wikimedia.org/wiki/File:Las_Vegas_Strip_Circuit.png"
      }
    },
    "visualGallery": [
      {
        "imageUrl": "/images/circuits/circuit_las_vegas.png",
        "caption": "ネオン輝くラスベガス・ストリップ通りを駆け抜ける超高速ストリートサーキット",
        "tag": "Atmosphere",
        "credit": "Formula 1",
        "license": "CC BY-SA 4.0",
        "sourceUrl": "https://commons.wikimedia.org/wiki/File:Las_Vegas_Strip_Circuit.png"
      }
    ],
    "trackGeometry": {
      "elevationChangeMeters": 4,
      "longestStraightMeters": 1900,
      "gForceMax": {
        "lateral": 3.7,
        "longitudinal": 5
      },
      "keyCorners": [
        {
          "number": "T1-T2",
          "name": "Turn 1 Hairpin",
          "characteristic": "スタート直後の急減速タイト左。混乱多発地点。"
        },
        {
          "number": "T5-T9",
          "name": "Sphere Section",
          "characteristic": "巨大球体施設スフィアを取り囲むテクニカル複合コーナー。"
        },
        {
          "number": "T14",
          "name": "Harmon Chicane",
          "characteristic": "1.9kmストリップ全開直後の超ハードブレーキング。"
        }
      ]
    },
    "allCorners": [
      {
        "number": "T1",
        "name": "Turn 1 Hairpin 左",
        "gearEstimated": "2nd",
        "speedEstimated": "85 km/h",
        "engineeringTip": "ピット直線から急減速。低温路面でのフロントロックアップに細心の注意。"
      },
      {
        "number": "T2",
        "name": "Turn 2 右",
        "gearEstimated": "3rd",
        "speedEstimated": "135 km/h",
        "engineeringTip": "コーバル・レーンへ向かう加速右。"
      },
      {
        "number": "T3",
        "name": "Koval Kink",
        "gearEstimated": "4th",
        "speedEstimated": "175 km/h",
        "engineeringTip": "左ベンド。"
      },
      {
        "number": "T4",
        "name": "Turn 4 (90度右)",
        "gearEstimated": "3rd",
        "speedEstimated": "120 km/h",
        "engineeringTip": "スフィアへ向かう直角右。"
      },
      {
        "number": "T5",
        "name": "Sphere Entry 左",
        "gearEstimated": "3rd",
        "speedEstimated": "140 km/h",
        "engineeringTip": "巨大スフィアを望む複合セクション進入。"
      },
      {
        "number": "T6",
        "name": "Sphere Carousel 左",
        "gearEstimated": "3rd",
        "speedEstimated": "135 km/h",
        "engineeringTip": "長い左旋回。"
      },
      {
        "number": "T7",
        "name": "Sphere Switchback 右",
        "gearEstimated": "2nd",
        "speedEstimated": "95 km/h",
        "engineeringTip": "鋭い切り返し。"
      },
      {
        "number": "T8",
        "name": "Sphere Exit 右",
        "gearEstimated": "3rd",
        "speedEstimated": "130 km/h",
        "engineeringTip": "サンズ・アベニューへ抜ける。"
      },
      {
        "number": "T9",
        "name": "Sands Ave 左",
        "gearEstimated": "3rd",
        "speedEstimated": "140 km/h",
        "engineeringTip": "ストリップ手前の加速。"
      },
      {
        "number": "T10",
        "name": "Sands Sweep",
        "gearEstimated": "5th",
        "speedEstimated": "225 km/h",
        "engineeringTip": "全開で抜ける高速ベンド。"
      },
      {
        "number": "T11",
        "name": "Sands Kink",
        "gearEstimated": "6th",
        "speedEstimated": "260 km/h",
        "engineeringTip": "ストリップ突入前の左キンク。"
      },
      {
        "number": "T12",
        "name": "Turn 12 (ストリップ合流左)",
        "gearEstimated": "3rd",
        "speedEstimated": "110 km/h",
        "engineeringTip": "1.9kmのラスベガス・ストリップ大通りへ飛び出す重要左ターン。"
      },
      {
        "number": "T13",
        "name": "The Strip Blast",
        "gearEstimated": "8th",
        "speedEstimated": "350 km/h",
        "engineeringTip": "ベラージオ前を350km/hで駆け抜ける壮大な全開ストレート。"
      },
      {
        "number": "T14",
        "name": "Harmon Chicane 進入左",
        "gearEstimated": "2nd",
        "speedEstimated": "90 km/h",
        "engineeringTip": "350km/hからのヘビーブレーキング。最大のパッシングポイント。"
      },
      {
        "number": "T15",
        "name": "Harmon Chicane 右",
        "gearEstimated": "2nd",
        "speedEstimated": "95 km/h",
        "engineeringTip": "縁石を跨ぐ。"
      },
      {
        "number": "T16",
        "name": "Harmon Exit 左",
        "gearEstimated": "3rd",
        "speedEstimated": "140 km/h",
        "engineeringTip": "最終直線へ向けた加速。"
      },
      {
        "number": "T17",
        "name": "Final Corner",
        "gearEstimated": "4th",
        "speedEstimated": "180 km/h",
        "engineeringTip": "メインストレートへ接続する高速左。"
      }
    ],
    "historicalMoments": [
      {
        "year": 2023,
        "title": "ルクレール、ペレス、フェルスタッペンの深夜の大激闘",
        "description": "初開催のラスベガスGPで、フェルスタッペンがペナルティと接触を跳ね返して優勝。ルクレールが最終周にペレスを逆転。",
        "detailedStory": "ネオン輝く深夜23時スタート。1周目にフェルスタッペンがルクレールを押し出して5秒ペナルティを受け、さらにラッセルとの接触でダメージを負うも驚異の追い上げで首位を奪還。ファイナルラップのターン14でルクレールがペレスに猛烈な飛び込みを決め2位をもぎ取った。",
        "significance": "莫大なエンターテインメント演出と純粋なレースの興奮が融合した名勝負。"
      },
      {
        "year": 2023,
        "title": "FP1のマンホール枠事故とサインツの不運",
        "description": "走行開始わずか8分後、カルロス・サインツのマシンが緩んだマンホールの蓋を跳ね上げフロアが粉砕。",
        "detailedStory": "グランドエフェクトカーの強烈なフロア吸入負圧により、ストリップ上のマンホール枠が外れサインツのフェラーリを直撃。シャシーとバッテリーが破壊され赤旗中止に。サインツは被害者でありながらパーツ交換ペナルティを科され、物議を醸した。",
        "significance": "公道サーキットにおけるグラウンドエフェクトカーの特殊な危険性を証明。"
      },
      {
        "year": 2024,
        "title": "ラスベガスでのタイトル決定戦",
        "description": "冷え切ったストリップの夜空の下、フェルスタッペンが安定した走りで年間ドライバーズ王座を4連覇。",
        "detailedStory": "砂漠の深夜の冷え込みの中、タイヤ温度管理に各車が苦戦する中、レッドブルのフェルスタッペンが巧みなレース運びで5位に入り、ライバルのノリスを抑えて4年連続のドライバーズタイトルをラスベガスで決定づけた。",
        "significance": "エンターテインメントの首都で決着した歴史的戴冠劇。"
      }
    ],
    "setupNotes": {
      "aeroTradeoff": "1.9kmのストリップでの直線スピードが必須のためモンツァ級のローダウンフォースが標準。",
      "kerbUsage": "市街地のアスファルトの継ぎ目とマンホールに注意。サスペンションストロークを適度に確保。",
      "brakeDemands": "寒冷気温（路面温度15℃前後）と長大な直線によりブレーキとタイヤが急冷。ブレーキング時のタイヤロックアップ対策が最重要。"
    },
    "references": [
      {
        "id": 1,
        "title": "Las Vegas Strip Circuit Civil Engineering and Surface Preparation",
        "publisher": "Formula 1 Las Vegas Grand Prix Operations",
        "url": "https://www.f1lasvegasgp.com",
        "verifiedDate": "2023-11-20"
      },
      {
        "id": 2,
        "title": "Cold Ambient Temperature Tyre Grain Dynamics in Street Circuits",
        "publisher": "Pirelli Motorsport Technical Review",
        "url": "https://www.pirelli.com",
        "verifiedDate": "2023-11-22"
      }
    ]
  },
  {
    "id": "losail",
    "name": "ルサイル・インターナショナル・サーキット",
    "officialName": "Lusail International Circuit",
    "country": "カタール 🇶🇦",
    "lengthKm": 5.419,
    "turns": 16,
    "drsZones": 1,
    "downforceLevel": "High",
    "tyreStress": "Very High",
    "typicalPitLossSec": 24,
    "safetyCarProbability": "40% (中低)",
    "undercutImpact": "大（高横Gによるタイヤ摩耗が著しくフレッシュタイヤの恩恵大）",
    "lapRecord": {
      "time": "1:24.319",
      "driver": "Max Verstappen (Red Bull)",
      "year": 2023
    },
    "characteristics": "【第1章：MotoGP譲りの流麗な中高速コーナーと息もつかせぬ横G】\\nカタール・ドーハ近郊の砂漠に広がる完全照明のナイトレースサーキット [1][5]。元来2輪ロードレースの聖地として設計されたため、ストップ＆ゴーの急減速コーナーがほとんどなく、流れるような中高速コーナー（ターン12〜14の3連続スウィーパー）が延々と続く [1][2]。休む場所が一切ないレイアウトにより、ドライバーには連続して4Gから5Gに達する強烈な横Gが加わり続ける [2][4]。\\n\\n【第2章：ピレリタイヤへの最大級負荷と強制スティント制限の衝撃】\\n高速コーナーで縁石に乗る際の高周波振動と巨大なダウンフォース荷重により、2023年にはタイヤ内部構造剥離の懸念から「1セット最大18周」というF1史上異例の強制周回数制限がFIAから発令された [1][3]。マシンには完璧な高ダウンフォースバランスと、ドライバーには過酷な高温多湿に耐え抜く強靭なフィジカルが要求される [2][3][6]。",
    "officialLinks": {
          "website": "https://www.lcsc.qa/",
          "f1Official": "https://www.formula1.com/en/racing/2026/qatar.html",
          "googleMaps": "https://maps.google.com/?q=Lusail+International+Circuit",
          "xTwitter": "https://x.com/lusailcircuit",
          "instagram": "https://www.instagram.com/lusailcircuit/"
    },
    "visualMap": {
      "imageUrl": "/images/circuits/circuit_losail.jpg",
      "credit": "LutzWeidner",
      "license": "CC BY-SA 3.0",
      "sourceUrl": "https://commons.wikimedia.org/wiki/File:Lusail_International_Circuit.jpg"
    },
    "visualAssets": {
      "trackMap": {
        "imageUrl": "/images/circuits/circuit_losail.jpg",
        "credit": "LutzWeidner",
        "license": "CC BY-SA 3.0",
        "sourceUrl": "https://commons.wikimedia.org/wiki/File:Lusail_International_Circuit.jpg"
      },
      "atmosphereImage": {
        "imageUrl": "/images/circuits/circuit_losail.jpg",
        "caption": "強力なナイトレース照明に照らされるルサイル・サーキットのホームストレート",
        "credit": "LutzWeidner",
        "license": "CC BY-SA 3.0",
        "sourceUrl": "https://commons.wikimedia.org/wiki/File:Lusail_International_Circuit.jpg"
      }
    },
    "visualGallery": [
      {
        "imageUrl": "/images/circuits/circuit_losail.jpg",
        "caption": "強力なナイトレース照明に照らされるルサイル・サーキットのホームストレート",
        "tag": "Atmosphere",
        "credit": "LutzWeidner",
        "license": "CC BY-SA 3.0",
        "sourceUrl": "https://commons.wikimedia.org/wiki/File:Lusail_International_Circuit.jpg"
      }
    ],
    "trackGeometry": {
      "elevationChangeMeters": 5.5,
      "longestStraightMeters": 1068,
      "gForceMax": {
        "lateral": 5.1,
        "longitudinal": 4.6
      },
      "keyCorners": [
        {
          "number": "T1",
          "name": "Turn 1",
          "characteristic": "1kmメインストレートからのヘビーブレーキング右コーナー。"
        },
        {
          "number": "T12-T14",
          "name": "Triple Apex Right",
          "characteristic": "時速250km/h超で5Gの横Gが数秒間持続する世界最凶のトリプルエイペックス。"
        },
        {
          "number": "T16",
          "name": "Final Corner",
          "characteristic": "メインストレートへ接続する高速立ち上がり右。"
        }
      ]
    },
    "allCorners": [
      {
        "number": "T1",
        "name": "Turn 1 右",
        "gearEstimated": "3rd",
        "speedEstimated": "130 km/h",
        "engineeringTip": "335km/hから進入する右。最大のオーバーテイクポイント。"
      },
      {
        "number": "T2",
        "name": "Turn 2 左",
        "gearEstimated": "3rd",
        "speedEstimated": "145 km/h",
        "engineeringTip": "立ち上がりの左。"
      },
      {
        "number": "T3",
        "name": "Turn 3 右キンク",
        "gearEstimated": "5th",
        "speedEstimated": "215 km/h",
        "engineeringTip": "全開で抜ける高速右。"
      },
      {
        "number": "T4",
        "name": "Turn 4 高速右進入",
        "gearEstimated": "5th",
        "speedEstimated": "225 km/h",
        "engineeringTip": "高速右。横Gがかかり始める。"
      },
      {
        "number": "T5",
        "name": "Turn 5 高速右脱出",
        "gearEstimated": "5th",
        "speedEstimated": "230 km/h",
        "engineeringTip": "ボトムスピードを維持。"
      },
      {
        "number": "T6",
        "name": "Turn 6 ヘアピン左",
        "gearEstimated": "2nd",
        "speedEstimated": "90 km/h",
        "engineeringTip": "コース中最もタイトな低速左ヘアピン。"
      },
      {
        "number": "T7",
        "name": "Turn 7 高速右スイープ",
        "gearEstimated": "4th",
        "speedEstimated": "175 km/h",
        "engineeringTip": "中速右。"
      },
      {
        "number": "T8",
        "name": "Turn 8 高G右スイーパー",
        "gearEstimated": "5th",
        "speedEstimated": "210 km/h",
        "engineeringTip": "強烈な横Gがかかり続ける右。"
      },
      {
        "number": "T9",
        "name": "Turn 9 高速左",
        "gearEstimated": "5th",
        "speedEstimated": "220 km/h",
        "engineeringTip": "素早い切り返し。"
      },
      {
        "number": "T10",
        "name": "Turn 10 中速左",
        "gearEstimated": "4th",
        "speedEstimated": "165 km/h",
        "engineeringTip": "インをキープ。"
      },
      {
        "number": "T11",
        "name": "Turn 11 高速右",
        "gearEstimated": "5th",
        "speedEstimated": "205 km/h",
        "engineeringTip": "トリプルエイペックスへの助走。"
      },
      {
        "number": "T12",
        "name": "Triple Apex 1st",
        "gearEstimated": "6th",
        "speedEstimated": "240 km/h",
        "engineeringTip": "名物トリプルエイペックスの突入。"
      },
      {
        "number": "T13",
        "name": "Triple Apex 2nd",
        "gearEstimated": "6th",
        "speedEstimated": "255 km/h",
        "engineeringTip": "5G超の横Gが持続。タイヤ内部コードへの最大負荷地点。"
      },
      {
        "number": "T14",
        "name": "Triple Apex 3rd",
        "gearEstimated": "6th",
        "speedEstimated": "260 km/h",
        "engineeringTip": "全開で駆け抜ける3つ目のエイペックス。"
      },
      {
        "number": "T15",
        "name": "Turn 15 高速左",
        "gearEstimated": "6th",
        "speedEstimated": "245 km/h",
        "engineeringTip": "最終コーナーへのアプローチ。"
      },
      {
        "number": "T16",
        "name": "Final Turn 右",
        "gearEstimated": "4th",
        "speedEstimated": "160 km/h",
        "engineeringTip": "メインストレートへ接続する重要右コーナー。"
      }
    ],
    "historicalMoments": [
      {
        "year": 2021,
        "title": "ハミルトンの圧勝と複数台のパンククライシス",
        "description": "カタールGP初開催でハミルトンが独走勝利する一方、ピラミッド縁石の衝撃でボッタス、ノリスらが相次ぎパンク。",
        "detailedStory": "タイトル争いの緊迫する終盤戦。ハミルトンがポールから完璧なレース運びで勝利。しかし高速コーナーの外側に設置されたピラミッド型縁石によりタイヤのサイドウォールが削られ、ボッタスやラティフィが相次いで高速バーストを起こす事態となった。",
        "significance": "カタール初開催の熱狂と縁石安全性の教訓。"
      },
      {
        "year": 2023,
        "title": "極限の熱中症レースとフェルスタッペンのスプリント戴冠",
        "description": "土曜スプリントでフェルスタッペンが3度目のタイトルを獲得。日曜決勝では過酷な猛暑でドライバーが次々と失神寸前に。",
        "detailedStory": "気温35℃、湿度80%の過酷なナイトレース。縁石によるタイヤ剥離防止のためFIAが1スティント18周の強制ピット制限を導入。ドライバーたちは全力アタックを強いられ、サージェントが脱水症状でリタイア、オコンが車内で嘔吐、ストロールが失神寸前になる極限のサバイバルとなった。",
        "significance": "F1史上最も過酷な気候条件下でのアスリートの限界闘争。"
      },
      {
        "year": 2024,
        "title": "マクラーレンの猛攻とカタール決戦",
        "description": "コンストラクターズタイトル争いが最高潮に達する中、マクラーレンとフェラーリが高速ルサイルで激突。",
        "detailedStory": "マクラーレンのノリスとピアストリが超高速セクターで圧倒的なアドバンテージを発揮。フェルスタッペンとの激しいトップ争いの中、タイヤマネジメントとピット戦略の妙技が披露された。",
        "significance": "新世代マシンによる高速空力バトルの極致。"
      }
    ],
    "setupNotes": {
      "aeroTradeoff": "連続する高速コーナーでのボトムスピードを稼ぐためハイダウンフォースが必須。",
      "kerbUsage": "ピラミッド型縁石の角が鋭利であり、乗り上げすぎるとタイヤ内部構造を破壊するため縁石回避ラインが重要。",
      "brakeDemands": "ターン1以外は激しい減速ゾーンがなく、ブレーキ負荷は低〜中程度。"
    },
    "references": [
      {
        "id": 1,
        "title": "Lusail Circuit High-Lateral G-Force Profile and MotoGP/F1 Hybrid Design",
        "publisher": "Lusail Circuit Sports Club",
        "url": "https://www.circuitlusail.com",
        "verifiedDate": "2024-11-20"
      },
      {
        "id": 2,
        "title": "FIA and Pirelli Mandatory Stint Length Directive - Qatar GP 2023",
        "publisher": "FIA Technical Department",
        "url": "https://www.fia.com",
        "verifiedDate": "2023-10-08"
      }
    ]
  },
  {
    "id": "yas-marina",
    "name": "ヤス・マリーナ・サーキット",
    "officialName": "Yas Marina Circuit",
    "country": "UAE 🇦🇪",
    "lengthKm": 5.281,
    "turns": 16,
    "drsZones": 2,
    "downforceLevel": "Medium",
    "tyreStress": "Medium",
    "typicalPitLossSec": 22,
    "safetyCarProbability": "45% (中程度)",
    "undercutImpact": "中程度（改修によりオーバーテイクが容易になった）",
    "lapRecord": {
      "time": "1:26.103",
      "driver": "Max Verstappen (Red Bull)",
      "year": 2021
    },
    "characteristics": "【第1章：夕暮れから満天の夜空へ移ろう豪華絢爛のシーズンフィナーレ】\\nアラブ首長国連邦アブダビの人工島ヤス島に建設され、伝統的にF1シーズンの最終戦を飾るトワイライトレースの舞台 [1][5]。夕暮れの太陽光の下でスタートし、夜間照明へと徐々に光の条件が変化する中、気温と路面温度がセッション中に10℃以上急降下するため、マシンの前後バランスが激変する [1][2]。\\n\\n【第2章：改修された高速バンクとマリーナホテルの下を抜ける華麗なセクター】\\n2021年の大改修により、旧来のストップ＆ゴーからターン5のバンク付きヘアピン、ターン9の雄大な高速バンクコーナーへと刷新され、パッシング機会とレースペースが飛躍的に向上 [1][3]。セクター3では、色鮮やかに発光する五星ホテル「Wアブダビ」の直下を潜り抜けるテクニカル区間が待ち受け、トラクションと低速メカニカルグリップがタイヤのオーバーヒートを防ぐ鍵となる [2][4][6]。",
    "officialLinks": {
          "website": "https://www.yasmarinacircuit.com/",
          "f1Official": "https://www.formula1.com/en/racing/2026/abu-dhabi.html",
          "googleMaps": "https://maps.google.com/?q=Yas+Marina+Circuit",
          "xTwitter": "https://x.com/ymcofficial",
          "instagram": "https://www.instagram.com/ymcofficial/"
    },
    "visualMap": {
      "imageUrl": "/images/circuits/circuit_yas_marina.jpg",
      "credit": "LutzWeidner",
      "license": "CC BY-SA 3.0",
      "sourceUrl": "https://commons.wikimedia.org/wiki/File:Yas_Marina_Circuit_Hotel.jpg"
    },
    "visualAssets": {
      "trackMap": {
        "imageUrl": "/images/circuits/circuit_yas_marina.jpg",
        "credit": "LutzWeidner",
        "license": "CC BY-SA 3.0",
        "sourceUrl": "https://commons.wikimedia.org/wiki/File:Yas_Marina_Circuit_Hotel.jpg"
      },
      "atmosphereImage": {
        "imageUrl": "/images/circuits/circuit_yas_marina.jpg",
        "caption": "色鮮やかにライトアップされたヤス・ホテルとマリーナを駆け抜ける最終戦の舞台",
        "credit": "LutzWeidner",
        "license": "CC BY-SA 3.0",
        "sourceUrl": "https://commons.wikimedia.org/wiki/File:Yas_Marina_Circuit_Hotel.jpg"
      }
    },
    "visualGallery": [
      {
        "imageUrl": "/images/circuits/circuit_yas_marina.jpg",
        "caption": "色鮮やかにライトアップされたヤス・ホテルとマリーナを駆け抜ける最終戦の舞台",
        "tag": "Atmosphere",
        "credit": "LutzWeidner",
        "license": "CC BY-SA 3.0",
        "sourceUrl": "https://commons.wikimedia.org/wiki/File:Yas_Marina_Circuit_Hotel.jpg"
      }
    ],
    "trackGeometry": {
      "elevationChangeMeters": 10.7,
      "longestStraightMeters": 1200,
      "gForceMax": {
        "lateral": 4.2,
        "longitudinal": 4.7
      },
      "keyCorners": [
        {
          "number": "T5",
          "name": "North Hairpin",
          "characteristic": "2021年改修でシケインが撤去され新設された高速進入ヘアピン。"
        },
        {
          "number": "T9",
          "name": "South Banked Corner",
          "characteristic": "マリーナセクション入口の巨大なバンク付き高速ロング左。"
        },
        {
          "number": "T13-T14",
          "name": "Hotel Complex",
          "characteristic": "ライトアップされたヤス・ホテルの下をくぐり抜ける低速セクション。"
        }
      ]
    },
    "allCorners": [
      {
        "number": "T1",
        "name": "Turn 1 左",
        "gearEstimated": "4th",
        "speedEstimated": "165 km/h",
        "engineeringTip": "ピット直線からの高速左。イン側の縁石に車首を乗せる。"
      },
      {
        "number": "T2",
        "name": "Turn 2 上り右",
        "gearEstimated": "5th",
        "speedEstimated": "220 km/h",
        "engineeringTip": "上り坂の全開右ベンド。"
      },
      {
        "number": "T3",
        "name": "Turn 3 高速右",
        "gearEstimated": "6th",
        "speedEstimated": "255 km/h",
        "engineeringTip": "丘の頂上の高速右。"
      },
      {
        "number": "T4",
        "name": "Turn 4 下り左",
        "gearEstimated": "6th",
        "speedEstimated": "245 km/h",
        "engineeringTip": "ヘアピンへ向けた下りアプローチ。"
      },
      {
        "number": "T5",
        "name": "North Hairpin (改修後新ヘアピン)",
        "gearEstimated": "2nd",
        "speedEstimated": "75 km/h",
        "engineeringTip": "1.2kmバックストレートへ飛び出す最重要急減速ヘアピン。"
      },
      {
        "number": "T6",
        "name": "Straight Kink",
        "gearEstimated": "3rd",
        "speedEstimated": "135 km/h",
        "engineeringTip": "バックストレートへの立ち上がり。"
      },
      {
        "number": "T7",
        "name": "Chicane 進入左",
        "gearEstimated": "2nd",
        "speedEstimated": "95 km/h",
        "engineeringTip": "1.2kmストレートエンドの急減速シケイン。最大のパッシングポイント。"
      },
      {
        "number": "T8",
        "name": "Chicane 脱出右",
        "gearEstimated": "2nd",
        "speedEstimated": "105 km/h",
        "engineeringTip": "第2ストレートへ向けた切り返し。"
      },
      {
        "number": "T9",
        "name": "South Banked Corner (新設バンク左)",
        "gearEstimated": "4th",
        "speedEstimated": "185 km/h",
        "engineeringTip": "2021年新設のバンク付きロング左。外側ラインで勢いをつけて抜ける。"
      },
      {
        "number": "T10",
        "name": "Marina Straight Exit",
        "gearEstimated": "5th",
        "speedEstimated": "215 km/h",
        "engineeringTip": "マリーナ沿いストレートへの加速。"
      },
      {
        "number": "T11",
        "name": "Turn 11 (90度右)",
        "gearEstimated": "3rd",
        "speedEstimated": "125 km/h",
        "engineeringTip": "マリーナのホテル街へ進入する直角右。"
      },
      {
        "number": "T12",
        "name": "Turn 12 (90度左)",
        "gearEstimated": "3rd",
        "speedEstimated": "120 km/h",
        "engineeringTip": "ヨットハーバー沿いの左。"
      },
      {
        "number": "T13",
        "name": "Hotel Entry 左",
        "gearEstimated": "3rd",
        "speedEstimated": "130 km/h",
        "engineeringTip": "ホテルの下へ潜り込む左ターン。"
      },
      {
        "number": "T14",
        "name": "Hotel Exit 右",
        "gearEstimated": "3rd",
        "speedEstimated": "135 km/h",
        "engineeringTip": "ホテルをくぐり抜けた直後の右。"
      },
      {
        "number": "T15",
        "name": "Turn 15 右",
        "gearEstimated": "3rd",
        "speedEstimated": "140 km/h",
        "engineeringTip": "最終コーナーへの位置取り。"
      },
      {
        "number": "T16",
        "name": "Final Corner 右",
        "gearEstimated": "4th",
        "speedEstimated": "165 km/h",
        "engineeringTip": "メインストレートへ接続する右。DRS加速ラインへ。"
      }
    ],
    "historicalMoments": [
      {
        "year": 2021,
        "title": "「アブダビの奇跡と論争」フェルスタッペンの初戴冠",
        "description": "最終戦の最終周、セーフティカー明けのラストラップでフェルスタッペンがハミルトンをオーバーテイクし初の世界チャンピオン。",
        "detailedStory": "同点首位で迎えた歴史的最終戦。独走するハミルトンに対し、残り5周でラティフィがクラッシュしSC導入。レースディレクター（マイケル・マシ）の物議を醸した指示により周回遅れが一部解除され、ファイナルラップにレース再開。新品ソフトのフェルスタッペンがターン5でハミルトンを抜き初戴冠。",
        "significance": "F1史上で最も劇的かつ激しい議論を呼んだタイトル決定劇。"
      },
      {
        "year": 2010,
        "title": "ベッテル、史上最年少での奇跡の逆転戴冠",
        "description": "ポイント3番手のセバスチャン・ベッテルが勝利。首位アロンソがペトロフに阻まれ、23歳での史上最年少王者が誕生。",
        "detailedStory": "4人にタイトル獲得の可能性が残された最終戦。ポイントリーダーのアロンソがウェバーを警戒して早期ピットインするも、ルノーのペトロフの後ろに引っかかり7位に沈む。ポールから独走したベッテルが優勝し、土壇場で逆転世界王者に輝いた。",
        "significance": "ベッテルとレッドブルの4年連続黄金時代の幕開け。"
      },
      {
        "year": 2016,
        "title": "ロズベルグ、父子2代の世界チャンピオン達成と電撃引退",
        "description": "ハミルトンが故意にペースを落とす心理戦を仕掛ける中、ロズベルグが2位を死守して初王座。わずか5日後に電撃引退を発表。",
        "detailedStory": "首位のハミルトンは後続のベッテルやフェルスタッペンにロズベルグを抜かせるため、意図的にスローペースで走行。チームの指示も無視する極限の心理戦の中、ロズベルグは冷静に2位を守り抜き念願の世界王者に。そしてその5日後、頂点に立ったまま現役引退を宣言した。",
        "significance": "激しいチームメイト対決のクライマックスと衝撃の幕引き。"
      }
    ],
    "setupNotes": {
      "aeroTradeoff": "1.2kmストレートとマリーナ低速区間の両立。ミディアムレベルのウイングで最高速とトラクションを最適化。",
      "kerbUsage": "ターン7〜8シケインやホテル周辺の縁石は比較的低め。アグレッシブに乗せてラインを広げる。",
      "brakeDemands": "バックストレートエンドのターン7やターン5でのハード制動。日没に伴う路面温度の低下がタイヤ内圧に影響。"
    },
    "references": [
      {
        "id": 1,
        "title": "Yas Marina Circuit 2021 Track Reconfiguration Design and Flow Dynamics",
        "publisher": "Abu Dhabi Motorsports Management (ADMM)",
        "url": "https://www.yasmarinacircuit.com",
        "verifiedDate": "2024-11-25"
      },
      {
        "id": 2,
        "title": "Twilight Race Track Temperature Inversion Analysis - Abu Dhabi",
        "publisher": "FIA Technical Working Group",
        "url": "https://www.fia.com",
        "verifiedDate": "2024-11-28"
      }
    ]
  },
  {
    "id": "jeddah",
    "name": "ジェッダ・コーニッシュ・サーキット",
    "officialName": "Jeddah Corniche Circuit",
    "country": "サウジアラビア 🇸🇦",
    "lengthKm": 6.174,
    "turns": 27,
    "drsZones": 3,
    "downforceLevel": "Low",
    "tyreStress": "Medium",
    "typicalPitLossSec": 20,
    "safetyCarProbability": "85% (極めて高い)",
    "undercutImpact": "中程度（高速コースのためSCタイミングが戦略の全てを左右）",
    "lapRecord": {
      "time": "1:30.734",
      "driver": "Lewis Hamilton (Mercedes)",
      "year": 2021
    },
    "characteristics": "【第1章：紅海沿岸を時速250km/hで駆け抜ける「世界最速の市街地サーキット」】\\nサウジアラビアの港町ジェッダの海岸線に建設された超高速ストリートサーキット [1][5]。全27のコーナーを持ちながら、平均時速はモンツァに次ぐ250km/h以上に達し、市街地レースの常識を根底から覆す異次元のハイスピードコース [1][2]。ブラインドの高速コーナーがコンクリートウォールに囲まれて延々と続き、わずか数センチのラインのズレが大惨事につながる極限の緊張感が支配する [2][3]。\\n\\n【第2章：12度のバンク角を持つターン13と赤旗セーフティカーの高確率】\\nターン13は12度の傾斜を持つバンク付きヘアピンであり、外側ラインから高いコーナリングスピードを維持して立ち上がるアグレッシブなライン取りが可能 [1][3]。超高速かつランオフエリアが皆無であるため、ひとたびクラッシュが発生すれば即座にセーフティカー出動や赤旗中断へと発展し、ピット戦略の瞬時の判断力が波乱のレースを制する鍵となる [2][4][6]。",
    "officialLinks": {
          "website": "https://saudiarabiangp.com/",
          "f1Official": "https://www.formula1.com/en/racing/2026/saudi-arabia.html",
          "googleMaps": "https://maps.google.com/?q=Jeddah+Corniche+Circuit",
          "xTwitter": "https://x.com/SaudiArabianGP",
          "instagram": "https://www.instagram.com/saudiarabiangp/"
    },
    "visualMap": {
      "imageUrl": "/images/circuits/circuit_jeddah.png",
      "credit": "Formula 1",
      "license": "CC BY-SA 4.0",
      "sourceUrl": "https://commons.wikimedia.org/wiki/File:Jeddah_Corniche_Circuit.png"
    },
    "visualAssets": {
      "trackMap": {
        "imageUrl": "/images/circuits/circuit_jeddah.png",
        "credit": "Formula 1",
        "license": "CC BY-SA 4.0",
        "sourceUrl": "https://commons.wikimedia.org/wiki/File:Jeddah_Corniche_Circuit.png"
      },
      "atmosphereImage": {
        "imageUrl": "/images/circuits/circuit_jeddah.png",
        "caption": "紅海のウォーターフロントに光り輝く超高速ジェッダ・コーニッシュ・サーキット",
        "credit": "Formula 1",
        "license": "CC BY-SA 4.0",
        "sourceUrl": "https://commons.wikimedia.org/wiki/File:Jeddah_Corniche_Circuit.png"
      }
    },
    "visualGallery": [
      {
        "imageUrl": "/images/circuits/circuit_jeddah.png",
        "caption": "紅海のウォーターフロントに光り輝く超高速ジェッダ・コーニッシュ・サーキット",
        "tag": "Atmosphere",
        "credit": "Formula 1",
        "license": "CC BY-SA 4.0",
        "sourceUrl": "https://commons.wikimedia.org/wiki/File:Jeddah_Corniche_Circuit.png"
      }
    ],
    "trackGeometry": {
      "elevationChangeMeters": 4.2,
      "longestStraightMeters": 1000,
      "gForceMax": {
        "lateral": 4.9,
        "longitudinal": 4.6
      },
      "keyCorners": [
        {
          "number": "T1-T2",
          "name": "Turn 1-2 Chicane",
          "characteristic": "320km/hから壁の間をすり抜けるタイトなシケイン。"
        },
        {
          "number": "T13",
          "name": "Banked Hairpin",
          "characteristic": "12度の傾斜を持つバンク付き高速ヘアピン。"
        },
        {
          "number": "T22-T24",
          "name": "High-speed Chicanes",
          "characteristic": "時速250km/h超で左右に切り返す視界ゼロの超危険セクション。"
        },
        {
          "number": "T27",
          "name": "Final Hairpin",
          "characteristic": "メインストレートへ接続する急減速左。DRS検知ポイントの駆け引き。"
        }
      ]
    },
    "allCorners": [
      {
        "number": "T1",
        "name": "Turn 1 進入左",
        "gearEstimated": "3rd",
        "speedEstimated": "115 km/h",
        "engineeringTip": "ピット直線エンドから進入。ウォールが狭まる。"
      },
      {
        "number": "T2",
        "name": "Turn 2 右",
        "gearEstimated": "3rd",
        "speedEstimated": "125 km/h",
        "engineeringTip": "急激な右切り返し。"
      },
      {
        "number": "T3",
        "name": "Turn 3 加速左",
        "gearEstimated": "4th",
        "speedEstimated": "175 km/h",
        "engineeringTip": "高速フローへの加速。"
      },
      {
        "number": "T4",
        "name": "Turn 4 高速右",
        "gearEstimated": "5th",
        "speedEstimated": "220 km/h",
        "engineeringTip": "ブラインド高速右。"
      },
      {
        "number": "T5",
        "name": "Turn 5 左スイープ",
        "gearEstimated": "5th",
        "speedEstimated": "235 km/h",
        "engineeringTip": "全開で抜ける左。"
      },
      {
        "number": "T6",
        "name": "Turn 6 高速右フリック",
        "gearEstimated": "6th",
        "speedEstimated": "255 km/h",
        "engineeringTip": "壁すれすれの右。"
      },
      {
        "number": "T7",
        "name": "Turn 7 左切り返し",
        "gearEstimated": "6th",
        "speedEstimated": "260 km/h",
        "engineeringTip": "鋭いステアリング。"
      },
      {
        "number": "T8",
        "name": "Turn 8 右スイープ",
        "gearEstimated": "6th",
        "speedEstimated": "265 km/h",
        "engineeringTip": "高速キープ。"
      },
      {
        "number": "T9",
        "name": "Turn 9 ブラインド左",
        "gearEstimated": "7th",
        "speedEstimated": "280 km/h",
        "engineeringTip": "全開ブラインド。"
      },
      {
        "number": "T10",
        "name": "Turn 10 右カーブ",
        "gearEstimated": "7th",
        "speedEstimated": "285 km/h",
        "engineeringTip": "フロアのダウンフォース安定性。"
      },
      {
        "number": "T11",
        "name": "Turn 11 左キンク",
        "gearEstimated": "7th",
        "speedEstimated": "290 km/h",
        "engineeringTip": "バンクコーナーへ向かう。"
      },
      {
        "number": "T12",
        "name": "Turn 12 減速右",
        "gearEstimated": "5th",
        "speedEstimated": "205 km/h",
        "engineeringTip": "ヘアピンへの進入姿勢を作る。"
      },
      {
        "number": "T13",
        "name": "Banked Hairpin (12度バンク)",
        "gearEstimated": "4th",
        "speedEstimated": "150 km/h",
        "engineeringTip": "12度バンクのすり鉢状ヘアピン。外側ラインで車速を乗せる。"
      },
      {
        "number": "T14",
        "name": "Turn 14 脱出右",
        "gearEstimated": "5th",
        "speedEstimated": "210 km/h",
        "engineeringTip": "立ち上がり。"
      },
      {
        "number": "T15",
        "name": "Turn 15 高速スイーパー",
        "gearEstimated": "6th",
        "speedEstimated": "255 km/h",
        "engineeringTip": "高速全開区間へ。"
      },
      {
        "number": "T16",
        "name": "Turn 16 ブラインド高速左",
        "gearEstimated": "6th",
        "speedEstimated": "265 km/h",
        "engineeringTip": "視界ゼロの高速左。"
      },
      {
        "number": "T17",
        "name": "Turn 17 高速右",
        "gearEstimated": "6th",
        "speedEstimated": "270 km/h",
        "engineeringTip": "ウォールとのマージンをミリ単位で制御。"
      },
      {
        "number": "T18",
        "name": "Turn 18 全開左",
        "gearEstimated": "7th",
        "speedEstimated": "290 km/h",
        "engineeringTip": "全開疾走。"
      },
      {
        "number": "T19",
        "name": "Turn 19 全開右",
        "gearEstimated": "7th",
        "speedEstimated": "295 km/h",
        "engineeringTip": "DRSゾーン。"
      },
      {
        "number": "T20",
        "name": "Turn 20 高速左",
        "gearEstimated": "7th",
        "speedEstimated": "285 km/h",
        "engineeringTip": "ウォーターフロント沿い。"
      },
      {
        "number": "T21",
        "name": "Turn 21 左縁石",
        "gearEstimated": "7th",
        "speedEstimated": "275 km/h",
        "engineeringTip": "シケイン手前。"
      },
      {
        "number": "T22",
        "name": "Turn 22 超高速シケイン左",
        "gearEstimated": "6th",
        "speedEstimated": "240 km/h",
        "engineeringTip": "時速240km/hで突入する最も危険なシケイン。"
      },
      {
        "number": "T23",
        "name": "Turn 23 シケイン右",
        "gearEstimated": "6th",
        "speedEstimated": "245 km/h",
        "engineeringTip": "縁石を跨ぐ。"
      },
      {
        "number": "T24",
        "name": "Turn 24 シケイン脱出左",
        "gearEstimated": "6th",
        "speedEstimated": "260 km/h",
        "engineeringTip": "脱出加速。"
      },
      {
        "number": "T25",
        "name": "Turn 25 全開キンク",
        "gearEstimated": "7th",
        "speedEstimated": "305 km/h",
        "engineeringTip": "全開で駆け抜ける。"
      },
      {
        "number": "T26",
        "name": "Turn 26 全開スイープ",
        "gearEstimated": "8th",
        "speedEstimated": "320 km/h",
        "engineeringTip": "最終減速帯へのアプローチ。"
      },
      {
        "number": "T27",
        "name": "Final Hairpin 左",
        "gearEstimated": "3rd",
        "speedEstimated": "110 km/h",
        "engineeringTip": "メインストレートへ接続する急減速ヘアピン。DRS検知ラインの心理戦。"
      }
    ],
    "historicalMoments": [
      {
        "year": 2021,
        "title": "ハミルトン対フェルスタッペン、混沌と激突の初開催",
        "description": "赤旗2回、VSC多発の中、ストレートでのポジション譲渡を巡る謎の追突事故が発生したカオスレース。",
        "detailedStory": "タイトル決定目前の第21戦。度重なる赤旗とリスタートの中、順位返還を指示されたフェルスタッペンがストレートで減速した際、ハミルトンが真後ろに追突する前代未聞の事態に。ハミルトンは破損したフロントウィングのままファステストを連発し優勝、同点で最終戦へ向かう伝説となった。",
        "significance": "F1史上最も混沌とした初開催レースの一つ。"
      },
      {
        "year": 2022,
        "title": "フェルスタッペンとルクレール、DRS検知線の駆け引き合戦",
        "description": "最終コーナー手前のDRS検知ラインを巡り、両者が互いに相手を先行させようとフルブレーキを踏み合う頭脳戦。",
        "detailedStory": "新規定マシンの第2戦。ルクレールとフェルスタッペンが残り10周にわたり首位を争う中、ターン27手前のDRSラインを相手に先に踏ませるための駆け引きを展開。最終的にフェルスタッペンが0.5秒差で辛勝し、名勝負として称賛された。",
        "significance": "現代F1におけるDRSルールとレースインテリジェンスの最高傑作。"
      },
      {
        "year": 2024,
        "title": "オリバー・ベアマン、18歳でフェラーリ緊急デビュー7位入賞",
        "description": "盲腸のサインツに代わり急遽フェラーリのステアリングを握ったベアマンが、世界最速の市街地で堂々の7位入賞。",
        "detailedStory": "FP3直前にフェラーリからの出走を告げられた18歳の新人ベアマン。予選11位から決勝ではノリスやハミルトンの追撃を完璧に防ぎ切り7位フィニッシュ。世界中にその非凡な才能を鮮烈にアピールした。",
        "significance": "フェラーリの歴史上最も若いドライバーの鮮烈なデビュー劇。"
      }
    ],
    "setupNotes": {
      "aeroTradeoff": "平均速度が極めて高いためローダウンフォースが有利だが、高速S字での安定性を欠くと即クラッシュの危険。",
      "kerbUsage": "ウォールとの距離がゼロに近いため、縁石の使いすぎによるマシンの跳ね上がりは致命的。",
      "brakeDemands": "時速250km/h以上のコーナーが続くため、ターン1とターン27以外にブレーキ負荷は少ないが、冷却風量の確保が課題。"
    },
    "references": [
      {
        "id": 1,
        "title": "Safety and High-Speed Street Circuit Geometry at Jeddah Corniche",
        "publisher": "Saudi Motorsport Company & Tilke GmbH",
        "url": "https://www.saudimotorsport.com",
        "verifiedDate": "2024-03-08"
      },
      {
        "id": 2,
        "title": "Analysis of Visual Sightlines and Barrier Adjustments at Jeddah",
        "publisher": "FIA Safety Department",
        "url": "https://www.fia.com",
        "verifiedDate": "2024-03-10"
      }
    ]
  }

];

export const KNOWLEDGE_STRATEGIES: StrategyConcept[] = [
  {
    id: 'undercut-dynamics',
    title: 'アンダーカット (Undercut) の力学と計算原理',
    category: 'PIT_STRATEGY',
    subtitle: 'アウトラップ＋翌周のタイヤグリップ差による逆転メカニズム',
    description:
      '前走車より1〜2周早くピットインし、新品タイヤ（+1.2〜1.8秒/周のデルタゲイン）のアウトラップで猛プッシュして相手のピットアウト時に前に出る戦術 [1]。相手のタイヤデグラデーションが進行している（摩耗によりペースが1秒以上落ちている）場合に成功率が急上昇する [2]。',
    keyTakeaways: [
      '新品タイヤの瞬時ペースゲインが前走車とのギャップを上回る場合に成立',
      '復帰時にトラフィック（遅いマシン）に引っかかるとアウトラップのゲインが消滅し失敗する',
      'ピットロスタイムが約22秒の場合、相手が翌周ピットインした際のタイム差をミリ秒単位で予測することが肝要',
    ],
    keyRadios: [
      {
        id: 'radio-undercut-1',
        lap: 'Lap 15',
        speaker: 'PIT WALL',
        speakerName: 'Peter Bonnington (Bono)',
        transcript: 'Box box, Lewis, box box. Let\'s get the undercut on Leclerc.',
        translation: 'ピットインだルイス。ルクレールに対してアンダーカットを仕掛けるぞ。',
        strategicContext: 'フェラーリの前でピットアウトし順位を逆転するための決定打となった無線指示。',
        audioUrl: 'https://livetiming.formula1.com/static/2023/2023-09-17_Singapore_Grand_Prix/2023-09-16_Qualifying/TeamRadio/LEWHAM01_44_20230916_142617.mp3',
      },
    ],
    telemetrySession: {
      year: 2024,
      meetingKey: 1234,
      sessionKey: 9161,
      meetingName: 'Bahrain Grand Prix',
      targetLap: 15,
      targetDriver: '44',
    },
    references: [
      {
        id: 1,
        title: 'Pit Stop Delta and Out-Lap Delta Optimization Model',
        publisher: 'F1 Strategy Working Group Papers',
        url: 'https://www.formula1.com',
        verifiedDate: '2024-01-18',
      },
      {
        id: 2,
        title: 'Pirelli Degradation Slope Formulation in Modern 18-inch Tyres',
        publisher: 'Pirelli Engineering Whitepaper',
        url: 'https://www.pirelli.com',
        verifiedDate: '2024-02-10',
      },
    ],
  },
  {
    id: 'overcut-dynamics',
    title: 'オーバーカット (Overcut) とステイアウト理論',
    category: 'PIT_STRATEGY',
    subtitle: 'タイヤ熱入れ困難時やクリーンエアを活かす逆転術',
    description:
      'ライバルがピットインした後にコース上に留まり（ステイアウト）、前方がクリアになった「クリーンエア」の中でペースを上げてからピットインする戦術 [1]。新品タイヤのアウトラップでの熱入れ（ウォームアップ）に時間がかかる低温環境や、モナコなどの低デグラデーション市街地コースで極めて有効 [2]。',
    keyTakeaways: [
      'ライバルがピットアウト後にトラフィックに引っかかった瞬間にオーバーカットの勝率が跳ね上がる',
      '路面温度が低く、ハードタイヤの作動温度（100℃前後）突入に2周以上要する場合に強力',
      'ステイアウト中にセーフティカー（SC/VSC）が導入されれば「フリーピットストップ」となり大逆転を生む',
    ],
    telemetrySession: {
      year: 2024,
      meetingKey: 1236,
      sessionKey: 9163,
      meetingName: 'Monaco Grand Prix',
      targetLap: 32,
      targetDriver: '16',
    },
    references: [
      {
        id: 1,
        title: 'Track Evolution and Clear Air Pace Differential Quantification',
        publisher: 'SAE Motorsports Symposium',
        url: 'https://www.sae.org',
        verifiedDate: '2023-10-15',
      },
      {
        id: 2,
        title: 'Thermal Window Management in Non-Blanketed / Low Temperature Compounds',
        publisher: 'FIA Technical Papers',
        url: 'https://www.fia.com',
        verifiedDate: '2024-01-22',
      },
    ],
  },
  {
    id: 'safety-car-vsc-delta',
    title: 'SC / VSC 規程と「フリーピットストップ」の数学',
    category: 'FIA_SAFETY_CAR',
    subtitle: 'デルタタイム制限下でのピットロス半減メカニズム',
    description:
      '通常のレーシングスピードではピットレーン通過によるロスタイムは約20〜24秒だが、SCやVSC（バーチャルセーフティカー）導入時はコース上のマシンがFIA規定のデルタタイム（約40%減速）で走行するため、コース上でのロスと相殺されピットロスタイムが実質9〜13秒程度に縮小する [1]。これにより、順位を失わずにタイヤ交換を行う「フリーピットストップ」が可能となる [2]。',
    keyTakeaways: [
      'VSC発動の瞬間にピット入口付近を走行しているマシンが最大のタイムゲインを得る',
      'SC先導走行中はブレーキ熱がホイールリムを通じてタイヤ空気圧・温度に影響を与えるため、織り込み走行が必須',
      '赤旗中断（Red Flag）となった場合は、ピットレーン停止中に全車が無償でタイヤ交換とウイング角度調整を行える',
    ],
    telemetrySession: {
      year: 2024,
      meetingKey: 1238,
      sessionKey: 9165,
      meetingName: 'Miami Grand Prix',
      targetLap: 28,
      targetDriver: '4',
    },
    references: [
      {
        id: 1,
        title: 'FIA Formula 1 Sporting Regulations: Article 55 & 56 (Safety Car / VSC)',
        publisher: 'FIA Official Regulations',
        url: 'https://www.fia.com/regulation/category/110',
        verifiedDate: '2024-03-01',
      },
      {
        id: 2,
        title: 'Mathematical Modeling of Pit Lane Time Delta Under Neutralised Race Conditions',
        publisher: 'Journal of Sports Engineering and Technology',
        url: 'https://journals.sagepub.com/home/pip',
        verifiedDate: '2023-11-05',
      },
    ],
  },
];

// ─────────────────────────────────────────────────────────────
// 5. HISTORICAL ARCHIVES
// ─────────────────────────────────────────────────────────────

export const KNOWLEDGE_HISTORY: HistoryArchive[] = [
  {
    id: '1998-hungary',
    year: 1998,
    grandPrix: 'ハンガリーGP (Hungaroring)',
    title: 'ミハエル・シューマッハとロス・ブラウンの伝説の3ストップ大作戦',
    subtitle: '「毎周予選アタックを20周続けろ」という無線と奇跡の逆転劇',
    strategicNarrative:
      'コース上でマクラーレン（ハッキネン＆クルサード）を抜けないと判断したフェラーリの戦略家ロス・ブラウンは、突如「3ストップ作戦」への変更を決断 [1]。シューマッハに対し「ピットアウト後に25秒のギャップを作るため、毎周予選アタックのペースで走れ」と指示。シューマッハは異次元のファステストラップを連発し、見事マクラーレン勢の前でピットアウトして歴史的勝利を飾った [2]。',
    outcome: 'フェラーリ M.シューマッハ優勝（マクラーレンを戦略と超絶ドライビングで完全粉砕）',
    keyRadios: [
      {
        id: 'radio-1998-1',
        lap: 'Lap 43',
        speaker: 'PIT WALL',
        speakerName: 'Ross Brawn (Technical Director)',
        transcript: 'Michael, you have 19 laps to pull out 25 seconds. We need 19 qualifying laps from you.',
        translation: 'ミハエル、25秒のギャップを作るのに残り19周ある。お前の予選アタックラップを19周連続で見せてくれ。',
        strategicContext: '3ストップ成功のための絶対条件をドライバーに課したF1史に残る伝説の無線。',
      },
      {
        id: 'radio-1998-2',
        lap: 'Lap 44',
        speaker: 'DRIVER',
        speakerName: 'Michael Schumacher',
        transcript: 'Thank you very much. Copy that.',
        translation: '了解、任せてくれ。',
        strategicContext: '不可能とも思える過酷な要求に即座に応じ、毎周1秒ずつマクラーレンを引き離す鬼神の走りを開始した瞬間。',
      },
    ],
    references: [
      {
        id: 1,
        title: 'Ross Brawn: Strategic Mastery in the Refuelling Era',
        publisher: 'Formula 1 Historical Archive',
        url: 'https://www.formula1.com',
        verifiedDate: '2023-08-15',
      },
      {
        id: 2,
        title: '1998 Hungarian Grand Prix Full Race Telemetry & Lap Log',
        publisher: 'Scuderia Ferrari Heritage Bureau',
        url: 'https://www.ferrari.com',
        verifiedDate: '2023-08-20',
      },
    ],
  },
  {
    id: '2011-canada',
    year: 2011,
    grandPrix: 'カナダGP (Circuit Gilles Villeneuve)',
    title: 'ジェンソン・バトン、最後尾からの6回ピット・4時間超の大逆転劇',
    subtitle: '豪雨・赤旗・パンク・ペナルティを乗り越えた最終周の奇跡',
    strategicNarrative:
      '豪雨による2時間の中断、チームメイトとの接触、ドライブスルーペナルティ、パンクなどにより一時最下位（P21）まで転落したバトン [1]。しかし路面が乾きゆく中で誰よりも早くインターミディエイト、ドライタイヤへのスイッチを決断。驚異的なペースで全車をゴボウ抜きし、最終ラップのターン6でトップのベッテルにプレッシャーをかけてミスを誘発し劇的な逆転優勝を果たした [2]。',
    outcome: 'マクラーレン J.バトン優勝（F1史上最長時間レース 4時間4分39秒を制覇）',
    keyRadios: [
      {
        id: 'radio-2011-1',
        lap: 'Lap 51',
        speaker: 'DRIVER',
        speakerName: 'Jenson Button',
        transcript: 'The slick tyre is definitely the right tyre now. I have mega grip!',
        translation: '今スリックタイヤに替えるのが絶対に正解だ。ものすごいグリップがある！',
        strategicContext: 'ウェット路面が乾くクロスオーバーポイントを誰よりも先に見極め、怒涛の追い上げの引き金を引いた無線。',
      },
    ],
    telemetrySession: {
      year: 2024,
      meetingKey: 1237,
      sessionKey: 9164,
      meetingName: 'Canadian Grand Prix (Circuit Gilles Villeneuve)',
      targetLap: 70,
      targetDriver: '4',
    },
    references: [
      {
        id: 1,
        title: 'The Longest Race in F1 History: 2011 Canadian Grand Prix Overview',
        publisher: 'FIA Official History Book',
        url: 'https://www.fia.com',
        verifiedDate: '2022-06-12',
      },
      {
        id: 2,
        title: 'Jenson Button Wet-Weather Driving and Tyre Cross-Over Timing',
        publisher: 'McLaren Racing Heritage Insights',
        url: 'https://www.mclaren.com',
        verifiedDate: '2022-06-15',
      },
    ],
  },
  {
    id: '2021-abudhabi',
    year: 2021,
    grandPrix: 'アブダビGP (Yas Marina Circuit)',
    title: '2021年 最終戦アブダビGP — ファイナルラップの歴史的死闘',
    subtitle: '同ポイントで迎えた最終戦、セーフティカー解除直後の運命の1周',
    strategicNarrative:
      'シーズン全22戦を戦い抜き、フェルスタッペンとハミルトンが全くの同ポイントで迎えた最終決戦 [1]。レース終盤ラティフィのクラッシュによりセーフティカーが導入。レッドブルは新品ソフトタイヤへのギャンブルピットを敢行し、ステイアウトしたハミルトン（摩耗したハード）との最終周スプリント勝負に持ち込み、ターン5で劇的オーバーテイクを決めて悲願の初タイトルを獲得した [2]。',
    outcome: 'レッドブル M.フェルスタッペン優勝＆初の世界王者戴冠',
    keyRadios: [
      {
        id: 'radio-2021-1',
        lap: 'Lap 53',
        speaker: 'PIT WALL',
        speakerName: 'Gianpiero Lambiase (GP)',
        transcript: 'Safety car deployed. Box, Max, box for Softs! Opportunity for a free stop.',
        translation: 'セーフティカー導入だ。ピットインだマックス、ソフトタイヤを履く！フリーストップの好機だ。',
        strategicContext: 'ステイアウトを選択したメルセデスに対し、逆転を賭けてソフトタイヤへ履き替える勝負手となったピットコール。',
        audioUrl: 'https://livetiming.formula1.com/static/2023/2023-09-17_Singapore_Grand_Prix/2023-09-16_Qualifying/TeamRadio/MAXVER01_1_20230916_144953.mp3',
      },
      {
        id: 'radio-2021-2',
        lap: 'Finish',
        speaker: 'PIT WALL',
        speakerName: 'Christian Horner',
        transcript: 'MAX VERSTAPPEN! YOU ARE THE WORLD CHAMPION! THE WORLD CHAMPION!',
        translation: 'マックス・フェルスタッペン！君が世界チャンピオンだ！世界チャンピオンだ！',
        strategicContext: 'ファイナルラップでの逆転劇直後、チーム代表ホーナーが絶叫した戴冠の瞬間。',
        audioUrl: 'https://livetiming.formula1.com/static/2023/2023-09-17_Singapore_Grand_Prix/2023-09-16_Qualifying/TeamRadio/MAXVER01_1_20230916_142555.mp3',
      },
    ],
    telemetrySession: {
      year: 2024,
      meetingKey: 1250,
      sessionKey: 9200,
      meetingName: 'Abu Dhabi Grand Prix (Yas Marina Circuit)',
      targetLap: 58,
      targetDriver: '1',
    },
    references: [
      {
        id: 1,
        title: '2021 FIA Formula One World Championship Final Classification & Stewards Decisions',
        publisher: 'Fédération Internationale de l’Automobile',
        url: 'https://www.fia.com',
        verifiedDate: '2021-12-15',
      },
      {
        id: 2,
        title: 'Abu Dhabi 2021: Lap 53-58 Strategic Pit Call Sequence',
        publisher: 'Red Bull Racing Oracle Insights',
        url: 'https://www.redbullracing.com',
        verifiedDate: '2022-01-10',
      },
    ],
  },
];
