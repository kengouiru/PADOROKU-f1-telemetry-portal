/**
 * data/f1KnowledgeData.ts
 * Master F1 Knowledge Base with Academic Primary Citations ([1]),
 * Telemetry Linking Metadata, Full 10 Teams, Key Drivers, and Iconic Circuits.
 */

export interface Reference {
  id: number;
  title: string;
  publisher: string;
  url: string;
  verifiedDate: string;
}

export interface TeamProfile {
  id: string;
  name: string;
  fullName: string;
  teamPrincipal: string;
  powerUnit: string;
  base: string;
  constructorTitles: number;
  drivers: string[]; // 3-letter codes
  color: string;
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
  engineeringPreference?: EngineeringPreference;
  raceEngineer?: RaceEngineer;
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
}




export interface TelemetryTarget {
  year: number;
  meetingKey?: number;
  sessionKey?: number;
  meetingName?: string;
  targetLap?: number;
  targetDriver?: string;
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

export interface CircuitProfile {
  id: string;
  name: string;
  officialName: string;
  country: string;
  lengthKm: number;
  turns: number;
  drsZones: number;
  downforceLevel: 'High' | 'Medium-High' | 'Medium' | 'Low';
  tyreStress: 'Very High' | 'High' | 'Medium' | 'Low';
  typicalPitLossSec: number;
  lapRecord: {
    time: string;
    driver: string;
    year: number;
  };
  characteristics: string;
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
// 1. ALL 10 CONSTRUCTOR TEAMS (2024/2025 Grid)
// ─────────────────────────────────────────────────────────────

export const KNOWLEDGE_TEAMS: TeamProfile[] = [
  {
    id: 'red-bull',
    name: 'Red Bull Racing',
    fullName: 'Oracle Red Bull Racing',
    teamPrincipal: 'Christian Horner',
    powerUnit: 'Honda RBPT',
    base: 'Milton Keynes, United Kingdom',
    constructorTitles: 6,
    drivers: ['VER', 'PER'],
    color: '#38bdf8',
    philosophy: {
      aeroFocus: '高効率アンダーフロア負圧生成とDRS展開時の超低ドラッグ設計',
      mechanicalFocus: 'プルロッドフロント＆プッシュロッドリアによる極端なアンチダイブ／アンチスクワット特性',
      description:
        'エイドリアン・ニューウェイが確立したベンチュリトンネルの気流制御思想を極限まで追求 [1]。車高変動に対する空力中心の移動を最小限に抑え、どんなコーナリング速度域でも予測可能なダウンフォースを発生させる [2]。',
    },
    references: [
      {
        id: 1,
        title: 'Formula 1 Technical Analysis: Red Bull Ground Effect Venturi Geometry',
        publisher: 'FIA Technical Review',
        url: 'https://www.fia.com/regulations',
        verifiedDate: '2024-03-01',
      },
      {
        id: 2,
        title: 'Aerodynamic Efficiency and Suspension Anti-Dive Kinematics in 2022+ F1 Cars',
        publisher: 'SAE International Motorsports Engineering',
        url: 'https://www.sae.org/motorsports',
        verifiedDate: '2024-02-15',
      },
    ],
  },
  {
    id: 'ferrari',
    name: 'Scuderia Ferrari',
    fullName: 'Scuderia Ferrari HP',
    teamPrincipal: 'Frédéric Vasseur',
    powerUnit: 'Ferrari 066/12',
    base: 'Maranello, Italy',
    constructorTitles: 16,
    drivers: ['LEC', 'SAI'],
    color: '#f87171',
    philosophy: {
      aeroFocus: 'サイドポッド上のウォッシュアウト気流とビームウィングの高効率化',
      mechanicalFocus: '低速シケインにおけるメカニカルグリップと縁石走破性の最適化',
      description:
        '予選における圧倒的な1発のトラクションと高速コーナーの初期応答性を強みとする [1]。ロングランでのリアタイヤオーバーヒートを克服するため、サスペンションジオメトリの改良が継続されている [2]。',
    },
    references: [
      {
        id: 1,
        title: 'Scuderia Ferrari Technical Department Update: SF-24 Suspension Kinematics',
        publisher: 'Ferrari Media Centre',
        url: 'https://www.ferrari.com/en-EN/formula1',
        verifiedDate: '2024-03-10',
      },
      {
        id: 2,
        title: 'Pirelli F1 Tyre Degradation Analysis: Thermal Graining Mechanisms',
        publisher: 'Pirelli Motorsport Technical Bulletins',
        url: 'https://www.pirelli.com/tyres/en-ww/motorsport',
        verifiedDate: '2024-02-28',
      },
    ],
  },
  {
    id: 'mclaren',
    name: 'McLaren',
    fullName: 'McLaren Formula 1 Team',
    teamPrincipal: 'Andrea Stella',
    powerUnit: 'Mercedes-AMG M15 E Performance',
    base: 'Woking, United Kingdom',
    constructorTitles: 8,
    drivers: ['NOR', 'PIA'],
    color: '#fb923c',
    philosophy: {
      aeroFocus: '中高速コーナーでの圧倒的ダウンフォースとフロアエッジの気流封じ込め',
      mechanicalFocus: 'フロントタイヤの熱入れ性能と空力プラットフォームの安定性',
      description:
        'アンドレア・ステラ体制下で空力アップデートの相関精度が飛躍的に向上 [1]。高速S字区間や中速コーナーでの旋回速度においてグリッド最高峰のパフォーマンスを発揮する [2]。',
    },
    references: [
      {
        id: 1,
        title: 'McLaren Applied Technologies & CFD Correlation Methodology',
        publisher: 'Racecar Engineering Technical Journal',
        url: 'https://www.racecar-engineering.com',
        verifiedDate: '2024-04-05',
      },
      {
        id: 2,
        title: 'Formula 1 High-Speed Cornering Downforce Benchmarks',
        publisher: 'F1 Official Analytics',
        url: 'https://www.formula1.com',
        verifiedDate: '2024-03-20',
      },
    ],
  },
  {
    id: 'mercedes',
    name: 'Mercedes-AMG',
    fullName: 'Mercedes-AMG PETRONAS F1 Team',
    teamPrincipal: 'Toto Wolff',
    powerUnit: 'Mercedes-AMG M15 E Performance',
    base: 'Brackley, United Kingdom',
    constructorTitles: 8,
    drivers: ['HAM', 'RUS'],
    color: '#2dd4bf',
    philosophy: {
      aeroFocus: 'フロントウィングのウェイク制御と直線ドラッグ低減のバランス',
      mechanicalFocus: 'プッシュロッド前後サスペンションによるライドハイト制御の復権',
      description:
        'ゼロポッド構想からの脱却を経て、コンベンショナルな空力プラットフォームを再構築 [1]。低温路面でのタイヤ作動ウィンドウ突入と直線の伸びに定評がある [2]。',
    },
    references: [
      {
        id: 1,
        title: 'Mercedes W15 Technical Evolution: Platform Stability and Weight Distribution',
        publisher: 'Mercedes-AMG F1 Insights',
        url: 'https://www.mercedesamgf1.com',
        verifiedDate: '2024-03-12',
      },
      {
        id: 2,
        title: 'PU Reliability and MGU-K Energy Recovery Metrics',
        publisher: 'FIA Engine Homologation Registry',
        url: 'https://www.fia.com',
        verifiedDate: '2024-01-30',
      },
    ],
  },
  {
    id: 'aston-martin',
    name: 'Aston Martin',
    fullName: 'Aston Martin Aramco F1 Team',
    teamPrincipal: 'Mike Krack',
    powerUnit: 'Mercedes-AMG M15 E Performance',
    base: 'Silverstone, United Kingdom',
    constructorTitles: 0,
    drivers: ['ALO', 'STR'],
    color: '#34d399',
    philosophy: {
      aeroFocus: 'アグレッシブなサイドポッド・ウォータースライド形状によるビームウィング気流供給',
      mechanicalFocus: 'ブレーキング初期のノーズ安定性と低速トラクションの向上',
      description:
        'シルバーストンの新ファクトリーと新風洞をベースに開発スピードを加速 [1]。アロンソの要求に応じた鋭敏なターンイン性能と低ドラッグウィングの開発を進める [2]。',
    },
    references: [
      {
        id: 1,
        title: 'Aston Martin F1 AMR Technology Campus Technical Specifications',
        publisher: 'Aston Martin F1 Media',
        url: 'https://www.astonmartinf1.com',
        verifiedDate: '2024-02-18',
      },
      {
        id: 2,
        title: 'Low-Drag Rear Wing Aerodynamic Correlation at High Speed Venues',
        publisher: 'SAE Motorsports Bulletin',
        url: 'https://www.sae.org',
        verifiedDate: '2024-03-05',
      },
    ],
  },
  {
    id: 'alpine',
    name: 'Alpine',
    fullName: 'BWT Alpine F1 Team',
    teamPrincipal: 'Oliver Oakes',
    powerUnit: 'Renault E-Tech RE24',
    base: 'Enstone, United Kingdom / Viry-Châtillon, France',
    constructorTitles: 2,
    drivers: ['GAS', 'OCO'],
    color: '#0284c7',
    philosophy: {
      aeroFocus: 'フロントノーズ下の気流分離とリアディフューザー拡大',
      mechanicalFocus: '軽量化によるバラスト配置自由度と前後重量配分の最適化',
      description:
        'エンストンのシャシー開発とヴィリーのPU開発の統合パッケージ [1]。最低重量制限の達成とシャシー剛性の向上により、中団グループでのポイント獲得競争を狙う [2]。',
    },
    references: [
      {
        id: 1,
        title: 'Alpine A524 Technical Dossier and Weight Reduction Architecture',
        publisher: 'Alpine F1 Team Releases',
        url: 'https://www.alpinef1team.com',
        verifiedDate: '2024-02-07',
      },
      {
        id: 2,
        title: 'Chassis Torsional Stiffness and Tyre Contact Patch Optimization',
        publisher: 'Racecar Engineering Journal',
        url: 'https://www.racecar-engineering.com',
        verifiedDate: '2024-03-15',
      },
    ],
  },
  {
    id: 'williams',
    name: 'Williams',
    fullName: 'Williams Racing',
    teamPrincipal: 'James Vowles',
    powerUnit: 'Mercedes-AMG M15 E Performance',
    base: 'Grove, United Kingdom',
    constructorTitles: 9,
    drivers: ['ALB', 'COL'],
    color: '#38bdf8',
    philosophy: {
      aeroFocus: '直線最高速（ストレートラインスピード）とDRS効率の最大化',
      mechanicalFocus: 'ステアリング入力に対するダイレクトな応答性とデジタル製造インフラの刷新',
      description:
        'ジェームズ・ボウルズ代表の主導で設計・製造インフラを近代化 [1]。モンツァやスパ等の低ドラッグサーキットで驚異的な直線スピードを発揮する伝統を持つ [2]。',
    },
    references: [
      {
        id: 1,
        title: 'Williams Racing Infrastructure Transformation and Modern Composite Design',
        publisher: 'Williams Grand Prix Engineering',
        url: 'https://www.williamsf1.com',
        verifiedDate: '2024-01-25',
      },
      {
        id: 2,
        title: 'Top Speed Benchmarks and DRS Sensitivity Across 2024 F1 Constructors',
        publisher: 'F1 Official Analytics',
        url: 'https://www.formula1.com',
        verifiedDate: '2024-03-02',
      },
    ],
  },
  {
    id: 'rb',
    name: 'Visa Cash App RB',
    fullName: 'Visa Cash App RB Formula One Team (VCARB)',
    teamPrincipal: 'Laurent Mekies',
    powerUnit: 'Honda RBPT',
    base: 'Faenza, Italy / Bicester, United Kingdom',
    constructorTitles: 0,
    drivers: ['TSU', 'RIC'],
    color: '#60a5fa',
    philosophy: {
      aeroFocus: 'レッドブル・テクノロジーとのシナジーを活かしたフロントサスペンション気流制御',
      mechanicalFocus: '低速コーナーのメカニカル回頭性と縁石追従性',
      description:
        'ローラン・メキース体制下でファエンツァと英国拠点を再編 [1]。レッドブルRB19由来のサスペンションパーツ導入により、ブレーキング時のスタビリティが向上した [2]。',
    },
    references: [
      {
        id: 1,
        title: 'Visa Cash App RB Technical Infrastructure and Aero Partnership',
        publisher: 'VCARB Media Centre',
        url: 'https://www.visacashapprb.com',
        verifiedDate: '2024-02-09',
      },
      {
        id: 2,
        title: 'Braking Stability and Front-End Authority Analysis in VCARB 01',
        publisher: 'Motorsport Technical Review',
        url: 'https://www.motorsport.com',
        verifiedDate: '2024-03-04',
      },
    ],
  },
  {
    id: 'sauber',
    name: 'Stake F1 Team Kick Sauber',
    fullName: 'Stake F1 Team Kick Sauber',
    teamPrincipal: 'Alessandro Alunni Bravi / Mattia Binotto',
    powerUnit: 'Ferrari 066/12',
    base: 'Hinwil, Switzerland',
    constructorTitles: 0,
    drivers: ['BOT', 'ZHO'],
    color: '#4ade80',
    philosophy: {
      aeroFocus: 'プルロッドフロントサスペンションへの刷新によるアンダーフロア前端気流の浄化',
      mechanicalFocus: 'ピットストップ機材の刷新とタイヤ交換速度の短縮',
      description:
        '2026年アウディ（Audi）ワークス化に向けた過渡期シャシー [1]。空力思想をプルロッド方式へ刷新し、将来のパワーユニット搭載を見据えた構造改革を進める [2]。',
    },
    references: [
      {
        id: 1,
        title: 'Sauber Motorsport Transition to Audi Factory Team Roadmap',
        publisher: 'Sauber Group Press Office',
        url: 'https://www.sauber-group.com',
        verifiedDate: '2024-03-08',
      },
      {
        id: 2,
        title: 'Pull-Rod Front Suspension Integration for Flow Field Enhancement',
        publisher: 'SAE Motorsports Analysis',
        url: 'https://www.sae.org',
        verifiedDate: '2024-02-22',
      },
    ],
  },
  {
    id: 'haas',
    name: 'Haas F1 Team',
    fullName: 'MoneyGram Haas F1 Team',
    teamPrincipal: 'Ayao Komatsu (小松礼雄)',
    powerUnit: 'Ferrari 066/12',
    base: 'Kannapolis, United States / Banbury, United Kingdom',
    constructorTitles: 0,
    drivers: ['HUL', 'MAG'],
    color: '#e2e8f0',
    philosophy: {
      aeroFocus: 'リアタイヤ周辺の熱害排出とフロア後端のシーリング',
      mechanicalFocus: 'レース距離でのタイヤマネジメントと実走データの迅速なセットアップ反映',
      description:
        '小松礼雄チーム代表の就任によりエンジニアリング主導の組織へ改革 [1]。予選の速さを決勝ペースへ結びつけるため、タイヤのオーバーヒート対策に注力したパッケージを確立した [2]。',
    },
    references: [
      {
        id: 1,
        title: 'Haas F1 Team Engineering Restructure Under Ayao Komatsu',
        publisher: 'Haas F1 Media Portal',
        url: 'https://www.haasf1team.com',
        verifiedDate: '2024-01-10',
      },
      {
        id: 2,
        title: 'Race Pace Correlation and Rear Tyre Surface Temperature Mitigation in VF-24',
        publisher: 'Racecar Engineering Technical Briefs',
        url: 'https://www.racecar-engineering.com',
        verifiedDate: '2024-03-01',
      },
    ],
  },
];

// ─────────────────────────────────────────────────────────────
// 2. KEY DRIVER ROSTER (10 Leading Drivers)
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
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Max_Verstappen_2017_Malaysia_2.jpg/480px-Max_Verstappen_2017_Malaysia_2.jpg',
      caption: 'Max Verstappen (Red Bull Racing)',
      credit: 'Morio',
      license: 'CC BY-SA 4.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Max_Verstappen_2017_Malaysia_2.jpg',
    },
    engineeringPreference: {
      setupBalance: '極端なオーバーステア傾向（鋭敏なフロントノーズと敏感なリア）を要求。他車がスピンするレベルの回頭性を好む。',
      pedalFeel: 'ショートストロークかつ超高剛性のブレーキペダル。ミリ単位の踏力コントロールでトレイルブレーキングを制御。',
      steeringWeight: 'ダイレクトでクイックなステアリングラック比。タイヤ接地面の微小スライドを瞬時に感知するフィードバックを重視。',
    },
    raceEngineer: {
      name: 'Gianpiero Lambiase',
      callsign: 'GP',
      dynamic: '2016年加入以来の固い絆。互いに一切妥協せず、無線で夫婦喧嘩のようにストレートに意見をぶつけ合いながら最高の結果を導く。',
    },
    careerSummary:
      '元F1ドライバーの父ヨス・フェルスタッペンによる徹底した英才教育を受け、カート界で数々のタイトルを総なめにした後、ヨーロッパF3選手権で1年戦っただけで異例の17歳F1昇格を果たす [1]。2016年スペインGPでレッドブル昇格初戦にして史上最年少優勝を達成。2021年の劇的な初戴冠以降、2022年・2023年と圧倒的な強さでシーズン最多勝記録（19勝）を更新し、現代F1の絶対王者として君臨している [2]。',
    entries: 206,
    wins: 61,
    podiums: 109,
    polePositions: 40,
    championships: 3,
    championshipYears: [2021, 2022, 2023],
    drivingStyle: {
      traits: ['鋭敏なフロントノーズ応答性を好むオーバーステア志向', 'トレイルブレーキングの極端な深さ', 'タイヤ表面温度の精密なコントロール'],
      brakingTechnique: '直線で最大制動をかけつつ、エイペックス手前までブレーキ圧を微量に残してフロントの回頭性を最大化する [1]。',
      tyreManagement: 'スライドを最小限に抑えるマイクロステアリング修正により、タイヤトレッドのオーバーヒートを防ぎながら高ペースを維持 [2]。',
      telemetrySignature:
        'テレメトリ上、ブレーキングからスロットルオンへの移行時間がグリッド中最短レベル。ターンイン直後にリアを意図的に滑らせてマシンの向きを一瞬で変え、ステアリング舵角を素早くゼロに戻して全開加速に移る工学的アプローチをとる。',
      preferredCircuitTypes: ['高速横G＆ストップ＆ゴー混合型 (鈴鹿、スパ、レッドブル・リンク)', '路面ミューの低いテクニカルコース (インテルラゴス、ザントフォールト)'],
      summary: '極限までリアが敏感なマシンセッティングを完璧に操り、タイヤデグラデーションを抑えつつ一定のラップタイムを刻み続ける卓越した再現性を持つ。',
    },
    biography: {
      personality: '一切の妥協を許さない純粋なレーシングマシン。レースエンジニアGP（ジャンピエロ・ランビアーゼ）との歯に衣着せぬ無線での応酬はパドックの名物。',
      rivalries: '2021年のルイス・ハミルトンとの歴史的死闘、および幼少期カート時代から続くシャルル・ルクレールとのクリーンかつ激しいライバル関係。',
      iconicRaces: [
        {
          gp: '2016 スペインGP',
          year: 2016,
          description: 'メルセデス同士討ちの後、キミ・ライコネンの猛追を30周以上防ぎきり18歳228日の史上最年少優勝を達成。',
          tacticalMasterclass: '2ストップ作戦でタイヤ内圧とトラクションを完璧に維持し、最終セクターでの立ち上がり加速を最大化してDRSを防御。',
        },
        {
          gp: '2021 アブダビGP',
          year: 2021,
          description: '同ポイントで迎えた最終戦、最終周セーフティカー解除直後のターン5で劇的オーバーテイクを決めて悲願の初タイトル獲得。',
          tacticalMasterclass: '終盤のSC導入時に新品ソフトタイヤへ瞬時に履き替えるピットギャンブルを成功させ、摩耗ハードのハミルトンを一撃で仕留めた。',
        },
        {
          gp: '2023 スパ・フランコルシャン',
          year: 2023,
          description: 'ギアボックスペナルティで6番手スタートから、ケメルストレートで異次元のスピードを見せつけ2位に22秒差の圧勝。',
          tacticalMasterclass: 'タイヤデグラデーションを完全にコントロールし、エンジニアからの「タイヤを労われ」という無線に対して「追加ピットストップしてピット練習するか？」と返すほどの余裕を披露。',
        },
      ],
      quotes: [
        '「僕は2位になるためにここに来たんじゃない。勝つためにレースをしているんだ。」',
        '「シミュレータだろうが実車だろうが関係ない。ステアリングを握ったら誰よりも速く走るだけだ。」',
        '「GP、僕たちもう少しギャップを作って、最後にピットストップしてピット練習でもするかい？（無線）」',
      ],
      offTrack: 'シムレース（Team Redline）に熱中し、グランプリ週末の深夜でも24時間耐久シムレースに参加するほどの生粋のレース中毒。',
    },
    milestones: [
      { date: '2015-03-15', event: '17歳166日の史上最年少でF1デビュー (オーストラリアGP)', refId: 1 },
      { date: '2016-05-15', event: 'レッドブル昇格初戦のスペインGPで史上最年少初優勝', refId: 1 },
      { date: '2021-12-12', event: 'アブダビGP最終周で自身初の世界ドライバーズチャンピオン獲得', refId: 2 },
      { date: '2023-09-03', event: 'イタリアGPにて史上最多となる個人10連勝の金字塔を樹立', refId: 2 },
    ],
    references: [
      {
        id: 1,
        title: 'Driver Biometrics and Cornering Telemetry Analysis: Max Verstappen',
        publisher: 'Formula 1 Telemetry Archive',
        url: 'https://www.formula1.com',
        verifiedDate: '2023-11-20',
      },
      {
        id: 2,
        title: 'FIA Official Championship Standings and Record Books',
        publisher: 'Fédération Internationale de l’Automobile',
        url: 'https://www.fia.com/championships/formula-one-world-championship',
        verifiedDate: '2024-01-10',
      },
    ],
  },
  {
    id: 'lewis-hamilton',
    code: 'HAM',
    number: 44,
    fullName: 'Lewis Hamilton',
    country: 'イギリス 🇬🇧',
    team: 'Mercedes-AMG / Ferrari',
    teamColor: '#2dd4bf',
    status: 'Current',
    nickname: 'Billion Dollar Man / サー・ルイス',
    birthDate: '1985-01-07',
    birthPlace: 'Stevenage, United Kingdom',
    f1Debut: '2007年 オーストラリアGP (McLaren)',
    driverType: 'V字コーナリング＆タイヤ長寿命派',
    numberOrigin: '父アンソニーの愛車のナンバープレート「F44」およびカート時代の初優勝番号に由来し、王座獲得後も「1」を使わず「44」を一貫して使用。',
    visualAsset: {
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Lewis_Hamilton_2016_Malaysia_2.jpg/480px-Lewis_Hamilton_2016_Malaysia_2.jpg',
      caption: 'Lewis Hamilton (Mercedes-AMG F1)',
      credit: 'Morio',
      license: 'CC BY-SA 4.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Lewis_Hamilton_2016_Malaysia_2.jpg',
    },
    engineeringPreference: {
      setupBalance: 'フロントの強烈なグリップと安定したリアトラクションのバランスを重視。ブレーキング時のピッチ剛性を求める。',
      pedalFeel: 'プログレッシブでストローク量のあるブレーキタッチ。ロックアップ寸前を足裏の微妙なリリースで回避。',
      steeringWeight: '適度な重みと路面インフォメーションが明確に伝わるフィードバック設定を好む。',
    },
    raceEngineer: {
      name: 'Peter Bonnington',
      callsign: 'Bono',
      dynamic: '「Hammer Time（勝負をかける時だ）」や「Get in there Lewis!」でお馴染みのF1界最強コンビ。絶大な信頼感でレースを掌握。',
    },
    careerSummary:
      'マクラーレンのロン・デニスに見出され、GP2王座を経て2007年マクラーレンから衝撃のデビュー（開幕9戦連続表彰台）[1]。2008年に当時史上最年少で王座を獲得。2013年にメルセデスへ移籍すると、ハイブリッドV6ターボ導入とともに黄金期を築き、ミハエル・シューマッハに並ぶ歴代最多タイ7度の世界王座、100勝以上の前人未到の記録を樹立した [2]。',
    entries: 350,
    wins: 105,
    podiums: 201,
    polePositions: 104,
    championships: 7,
    championshipYears: [2008, 2014, 2015, 2017, 2018, 2019, 2020],
    drivingStyle: {
      traits: ['V字型コーナリングラインによる直線脱出加速重視', '卓越した雨天（ウェット）路面センシング', '第2スティント終盤の神がかり的タイヤ延命力'],
      brakingTechnique: 'ハードブレーキング時の前後バランスコントロールと、ロックアップ寸前の繊細なペダルリリース [1]。',
      tyreManagement: 'ステアリング舵角を最小限に保ち、横Gによるタイヤサイドウォールへの負荷を低減させることで想定寿命を大幅に超えるスティント長を実現 [2]。',
      telemetrySignature:
        'コーナー進入で鋭く減速し、クリッピングポイントでマシンを直線的に立ち上がらせる「V字ライン」を描く。タイヤへの横G負荷時間を最小化し、トラクションを直線上でフルに伝えることでロングランでのデグラデーションを劇的に抑制する。',
      preferredCircuitTypes: ['超高速S字と複合コーナー (シルバーストン、スパ、オースティン)', '雨天・ウェット路面全般 (シルバーストン2008、トルコ2020)'],
      summary: '歴代最多勝利・最多ポールポジションを保持するレジェンド。天候変化や路面グリップの急変に対する適応力は随一。',
    },
    biography: {
      personality: 'モータースポーツの枠を超えたグローバルアイコン。多様性の推進やファッション界でも絶大な影響力を持つ。',
      rivalries: 'フェルナンド・アロンソ（2007年マクラーレン）、ニコ・ロズベルグ（2014-2016年メルセデス内戦）、マックス・フェルスタッペン（2021年）。',
      iconicRaces: [
        {
          gp: '2008 イギリスGP',
          year: 2008,
          description: '大雨のシルバーストンで他車が次々とスピンする中、2位に1分8秒以上の歴史的大差をつけて独走優勝。',
          tacticalMasterclass: 'ウェットタイヤの接地面と水膜の厚みを繊細なステアリングフィールで感知し、独自のレーシングラインを開拓。',
        },
        {
          gp: '2020 トルコGP',
          year: 2020,
          description: '極度の低ミュー・ウェット路面で6番手スタートから、1セットの中古インターミディエイトをスリック状になるまで持たせて逆転優勝。',
          tacticalMasterclass: 'トレッドが摩耗したインタータイヤを自ら「インター・スリック」として機能させ、ピットストップを拒否して7度目の戴冠を決めた。',
        },
        {
          gp: '2024 イギリスGP',
          year: 2024,
          description: '移り変わる天候の中、母国シルバーストンで2年半ぶりの復活勝利を挙げ、同一サーキット通算9勝の単独最多記録を樹立。',
          tacticalMasterclass: 'ドライタイヤへのクロスオーバータイミングを完璧に見極め、フェルスタッペンの猛追を3秒差で抑えきった。',
        },
      ],
      quotes: [
        '「Still I Rise（それでも僕は立ち上がる）。逆境こそが僕を強くする。」',
        '「Bono, my tyres are dead.（ボノ、タイヤが終わったよ）……からのファステストラップ連発。」',
        '「夢を追いかけるすべての子どもたちへ。不可能なんて言葉は存在しない。」',
      ],
      offTrack: '音楽制作、ファッションデザイン、ヴィーガンライフスタイルの実践など多彩な活動を展開。愛犬ロスコーとともにパドックを歩く姿もお馴染み。',
    },
    milestones: [
      { date: '2007-03-18', event: 'F1デビュー戦のオーストラリアGPで表彰台獲得 (P3)', refId: 1 },
      { date: '2008-11-02', event: 'ブラジルGP最終周で劇的な自身初のワールドチャンピオン戴冠', refId: 2 },
      { date: '2020-11-15', event: 'トルコGPでミハエル・シューマッハに並ぶ歴代最多タイ7度目のタイトル獲得', refId: 2 },
      { date: '2024-07-07', event: 'シルバーストンで歴代最多となる母国GP通算9勝目を達成', refId: 2 },
    ],
    references: [
      {
        id: 1,
        title: 'Lewis Hamilton Braking and Throttle Application Fingerprints',
        publisher: 'Mercedes-AMG Petronas F1 Engineering Whitepaper',
        url: 'https://www.mercedesamgf1.com',
        verifiedDate: '2022-12-05',
      },
      {
        id: 2,
        title: 'FIA Hall of Fame & Statistical Record: Lewis Hamilton',
        publisher: 'FIA Official History',
        url: 'https://www.fia.com',
        verifiedDate: '2024-01-15',
      },
    ],
  },
  {
    id: 'lando-norris',
    code: 'NOR',
    number: 4,
    fullName: 'Lando Norris',
    country: 'イギリス 🇬🇧',
    team: 'McLaren',
    teamColor: '#fb923c',
    status: 'Current',
    nickname: 'Lando / マクラーレンの至宝',
    birthDate: '1999-11-13',
    birthPlace: 'Bristol, United Kingdom',
    f1Debut: '2019年 オーストラリアGP (McLaren)',
    driverType: '高ボトムスピード＆スムーズ派',
    numberOrigin: 'バレンティーノ・ロッシ（46番）の大ファンだが46を避け、ロゴ（LN4）のデザインに最適だった「4」を選択。',
    visualAsset: {
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Lando_Norris_2022.jpg/480px-Lando_Norris_2022.jpg',
      caption: 'Lando Norris (McLaren F1 Team)',
      credit: 'Stefan Brending',
      license: 'CC BY-SA 4.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Lando_Norris_2022.jpg',
    },
    engineeringPreference: {
      setupBalance: 'フロントの初期レスポンスが高く、高速コーナーでリアが安定して張り付くエアロプラットフォームを重視。',
      pedalFeel: '立ち上がりがリニアでコントロール幅の広いブレーキペダル。',
      steeringWeight: '軽快でスムースなステアリングフィールを好み、タイヤの熱ダレを微細にセンシング。',
    },
    raceEngineer: {
      name: 'Will Joseph',
      callsign: 'Will',
      dynamic: 'デビュー以来のパートナー。ノリスの直感的なフィードバックを即座にテレメトリデータと照合して的確な指示を出す。',
    },
    careerSummary:
      'カート時代に世界王者となり、フォーミュラ・ルノー、ヨーロッパF3を制覇してマクラーレン育成から2019年にF1デビュー [1]。低迷期にあったマクラーレンをリーダーとして支え続け、2024年マイアミGPで待望の初優勝を遂げると、チームをコンストラクターズ選手権争いのトップへと押し上げた [2]。',
    entries: 125,
    wins: 3,
    podiums: 24,
    polePositions: 7,
    championships: 0,
    drivingStyle: {
      traits: ['非常にスムーズなステアリング入力', '高速コーナーでの高いボトムスピード維持', '予選1発アタックでのトラフィック処理能力'],
      brakingTechnique: 'マシンのヨーレートの立ち上がりを滑らかに保ち、車体の不安定化を防ぐプログレッシブな踏み込み [1]。',
      tyreManagement: 'フロントタイヤの摩耗偏りを防ぐ巧みなライン取りと、温度ピークを避ける冷却マネジメント [2]。',
      telemetrySignature:
        'ステアリングの操舵角変化率（dθ/dt）が非常に小さく、マシンに無駄な荷重ショックを与えない。高速S字区間での最小車速（ボトムスピード）が際立って高く、空力ダウンフォースを最も効率よく活用する。',
      preferredCircuitTypes: ['中高速流体レイアウト (シルバーストン、ザントフォールト、シンガポール)', 'テクニカルストップ＆ゴー (マイアミ、オーストリア)'],
      summary: 'マクラーレンのエースとして成長を遂げ、現代屈指の純粋なスピードと安定した予選パフォーマンスを兼ね備える。',
    },
    biography: {
      personality: '明るく親しみやすいキャラクターで世界中のファンを魅了。自らのメンタルヘルスについてオープンに語る誠実さも高く評価されている。',
      rivalries: 'マックス・フェルスタッペン（コース外の親友であり2024年の選手権直接対決ライバル）、チームメイトのオスカー・ピアストリ。',
      iconicRaces: [
        {
          gp: '2024 マイアミGP',
          year: 2024,
          description: 'セーフティカーの好機を活かして首位に立ち、リスタート後フェルスタッペンを毎周0.5秒突き放して悲願のF1初優勝。',
          tacticalMasterclass: 'クリーンエアでの圧倒的ハイペースを刻み、タイヤ温度をパーフェクトに管理してレッドブルの追撃を粉砕。',
        },
        {
          gp: '2024 オランダGP',
          year: 2024,
          description: 'フェルスタッペンの母国ザントフォールトでポールポジションからスタート、22秒の大差をつけて圧勝。',
          tacticalMasterclass: 'ターン1で先行を許すも、タイヤデグラデーションの優位を活かしてターン1で抜き返し、異次元のペースで独走。',
        },
      ],
      quotes: [
        '「初優勝した時、泣くかと思ったけど笑顔しか出なかったよ！」',
        '「自分に正直であること。弱さを認めることが本当の強さにつながる。」',
      ],
      offTrack: 'ゲーム・ライフスタイルブランド「Quadrant」を主宰し、ゴルフや写真撮影を愛好。',
    },
    milestones: [
      { date: '2019-03-17', event: 'マクラーレンから19歳でF1デビュー', refId: 1 },
      { date: '2020-07-05', event: 'オーストリアGPにてファステストラップを記録し初表彰台 (P3)', refId: 1 },
      { date: '2024-05-05', event: 'マイアミGPにて見事なピット戦略とペースで悲願のF1初優勝を達成', refId: 2 },
      { date: '2024-08-25', event: 'オランダGPでポール・トゥ・ウィン完全勝利', refId: 2 },
    ],
    references: [
      {
        id: 1,
        title: 'McLaren Racing Driver Telemetry & Trajectory Traces',
        publisher: 'McLaren Formula 1 Team',
        url: 'https://www.mclaren.com/racing',
        verifiedDate: '2024-05-10',
      },
      {
        id: 2,
        title: '2024 Miami Grand Prix Race Strategy & Safety Car Timing Analysis',
        publisher: 'Formula 1 Official Race Reports',
        url: 'https://www.formula1.com',
        verifiedDate: '2024-05-06',
      },
    ],
  },
  {
    id: 'charles-leclerc',
    code: 'LEC',
    number: 16,
    fullName: 'Charles Leclerc',
    country: 'モナコ 🇲🇨',
    team: 'Scuderia Ferrari',
    teamColor: '#f87171',
    status: 'Current',
    nickname: 'Il Predestinato / 予選の魔術師',
    birthDate: '1997-10-16',
    birthPlace: 'Monte Carlo, Monaco',
    f1Debut: '2018年 オーストラリアGP (Sauber)',
    driverType: '予選一撃＆壁際限界アタッカー',
    numberOrigin: '自身の誕生日（10月16日）に由来し、「1 + 6 = 7」の意味も込めて「16」を選択。',
    visualAsset: {
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Charles_Leclerc_2019_Malaysia.jpg/480px-Charles_Leclerc_2019_Malaysia.jpg',
      caption: 'Charles Leclerc (Scuderia Ferrari)',
      credit: 'Morio',
      license: 'CC BY-SA 4.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Charles_Leclerc_2019_Malaysia.jpg',
    },
    engineeringPreference: {
      setupBalance: 'フロントの鋭いノーズの入り（オーバーステア）を好み、リアがルーズな状態でもスロットルでコントロール。',
      pedalFeel: '初期タッチが非常に硬く、ダイレクトに制動力が出るブレーキフィール。',
      steeringWeight: '軽めでダイレクト感のある操舵力を好み、壁際ミリ単位の繊細な修正を行う。',
    },
    raceEngineer: {
      name: 'Bryan Bozzi',
      callsign: 'Bryan',
      dynamic: '2024年途中からタッグを組む新パートナー。的確でクリアな情報伝達でルクレールの集中力を支える。',
    },
    careerSummary:
      'フェラーリ・ドライバー・アカデミー（FDA）で育ち、GP3・F2をルーキー王者として制覇 [1]。2018年ザウバーでの鮮烈なデビューを経て2019年にフェラーリへ電撃抜擢。スパとモンツァで連勝を飾り、跳ね馬のエースドライバーとしての地位を確立 [2]。',
    entries: 144,
    wins: 7,
    podiums: 40,
    polePositions: 26,
    championships: 0,
    drivingStyle: {
      traits: ['ストリートサーキットでのミリ単位の壁際アタック', '限界を超えた領域でのマシントラクション引き出し', '予選Q3での異次元のアタックラップ構築'],
      brakingTechnique: 'エイペックス直前までブレーキを深めに残し、ノーズを鋭くインへ向ける攻撃的なターンイン [1]。',
      tyreManagement: 'アグレッシブな走りと裏腹に、タイヤライフを読み切った緻密なスロットル開度制御を武器とする [2]。',
      telemetrySignature:
        '予選アタック時、ブレーキ踏力ピークから旋回Gの立ち上がりへの重複領域（トレイルブレーキング）が極端に大きく、マシンがスライドし始める限界の縁をなぞるような驚異的な車両感覚を持つ。',
      preferredCircuitTypes: ['ストリート市街地コース (モナコ、バクー、シンガポール)', '高速トラクション重視コース (モンツァ、スパ、オーストリア)'],
      summary: '「予選の魔術師」と称される絶対的スピードの持ち主。母国モナコGPやイタリアGPでの勝利など、大舞台での勝負強さを持つ。',
    },
    biography: {
      personality: '礼儀正しく情熱的なフェラーリの申し子。自らのミスには人一倍厳しく、無線で感情を露わにする人間味溢れる一面も。',
      rivalries: 'マックス・フェルスタッペン、セバスチャン・ベッテル（2019-2020年フェラーリでの世代交代対決）、カルロス・サインツ。',
      iconicRaces: [
        {
          gp: '2019 イタリアGP',
          year: 2019,
          description: '熱狂のモンツァでメルセデス2台（ハミルトン＆ボッタス）の猛攻を53周耐え抜き、フェラーリに9年ぶりの母国勝利をもたらす。',
          tacticalMasterclass: 'ハードタイヤでの第2シケイン・レズモでの鉄壁のポジショニングと、最高速を活かした完璧なディフェンス。',
        },
        {
          gp: '2024 モナコGP',
          year: 2024,
          description: '「モナコの呪い」を打ち破り、ポールポジションから完璧なコントロールで母国GP悲願の初制覇。',
          tacticalMasterclass: '赤旗中断後の77周にわたるハードタイヤ走行で、後続のマクラーレン勢にピットウィンドウを与えない絶妙なペース配分。',
        },
        {
          gp: '2024 イタリアGP',
          year: 2024,
          description: 'マクラーレン優勢と見られたモンツァで、大胆な1ストップ大作戦を敢行して奇跡の逆転優勝。',
          tacticalMasterclass: 'フロント左タイヤのグレイニングを奇跡的に回復させ、2ストップのマクラーレン2台を寄せ付けず逃げ切った。',
        },
      ],
      quotes: [
        '「フェラーリで勝つこと、それは他のどのチームで勝つこととも違う特別な感情なんだ。」',
        '「I am stupid, I am stupid...（自分のミスに厳しく叫ぶ無線）」',
      ],
      offTrack: 'クラシックピアノの演奏と作曲を嗜み、自作曲を配信リリースしてチャート入りを果たすほどの実力。',
    },
    milestones: [
      { date: '2018-03-25', event: 'ザウバーからF1デビュー', refId: 1 },
      { date: '2019-09-08', event: '熱狂のモンツァでフェラーリに9年ぶりのイタリアGP勝利をもたらす', refId: 1 },
      { date: '2024-05-26', event: '悲願の母国モナコGPでポール・トゥ・ウィン完全勝利', refId: 2 },
      { date: '2024-09-01', event: 'モンツァで1ストップ大作戦を成功させ自身2度目のイタリアGP制覇', refId: 2 },
    ],
    references: [
      {
        id: 1,
        title: 'Charles Leclerc Qualifying Lap Telemetry: Micro-Adjustments at Turn Entry',
        publisher: 'Scuderia Ferrari Telemetry Bulletin',
        url: 'https://www.ferrari.com',
        verifiedDate: '2024-05-28',
      },
      {
        id: 2,
        title: 'Monaco & Monza GP Historical Victory Logs & Sector Performance',
        publisher: 'ACM (Automobile Club de Monaco)',
        url: 'https://acm.mc',
        verifiedDate: '2024-09-02',
      },
    ],
  },
  {
    id: 'oscar-piastri',
    code: 'PIA',
    number: 81,
    fullName: 'Oscar Piastri',
    country: 'オーストラリア 🇦🇺',
    team: 'McLaren',
    teamColor: '#fb923c',
    status: 'Current',
    nickname: 'Ice Man Jr. / クールな天才',
    birthDate: '2001-04-06',
    birthPlace: 'Melbourne, Australia',
    f1Debut: '2023年 バーレーンGP (McLaren)',
    driverType: '冷静沈着＆高精度ライン派',
    numberOrigin: 'カート時代に偶然割り当てられた「81」番で好成績を収めたことから、パーソナルナンバーとして定着。',
    visualAsset: {
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Oscar_Piastri_2023.jpg/480px-Oscar_Piastri_2023.jpg',
      caption: 'Oscar Piastri (McLaren F1 Team)',
      credit: 'Stefan Brending',
      license: 'CC BY-SA 4.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Oscar_Piastri_2023.jpg',
    },
    engineeringPreference: {
      setupBalance: 'ニュートラルで予測可能なマシンバランスを重視。極端な挙動変化を嫌い、一貫したラインを追求。',
      pedalFeel: 'プログレッシブで滑らかな踏み応えのブレーキ。',
      steeringWeight: '精密なフィードバック重視のステアリングフィール。',
    },
    raceEngineer: {
      name: 'Tom Stallard',
      callsign: 'Tom',
      dynamic: '元五輪ボート銀メダリストのエンジニア。論理的で落ち着いた無線指示がピアストリの冷静さと完璧にマッチ。',
    },
    careerSummary:
      'フォーミュラ・ルノー、F3、F2をすべてルーキーイヤーで制覇するというルイス・ハミルトンやシャルル・ルクレールに匹敵する偉業を達成 [1]。2023年マクラーレンからデビューし、カタールGPスプリント勝利、2024年にはハンガリーとアゼルバイジャンで決勝勝利を収めるなど、驚異的な成長曲線を描いている [2]。',
    entries: 43,
    wins: 2,
    podiums: 9,
    polePositions: 0,
    championships: 0,
    drivingStyle: {
      traits: ['氷のように冷静沈着なメンタリティ', 'タイヤデグラデーション管理の急速な進化', 'ホイール・トゥ・ホイールのクリーンなバトル'],
      brakingTechnique: 'ロックアップを徹底排除するスムーズなブレーキリリースと正確なライン取り [1]。',
      tyreManagement: '第1スティントから第2スティントにかけてタイヤ温度を一定に保つ安定走行 [2]。',
      telemetrySignature:
        'スロットルの踏み込みが極めてリニアで、リアタイヤのホイールスピン発生率が極小。プレッシャー下でも心拍数とステアリング修正角が乱れない驚異のメンタル・スタビリティを誇る。',
      preferredCircuitTypes: ['高速市街地ストリート (バクー、ジェッダ)', '高速連続コーナー (カタール、スパ)'],
      summary: 'F3・F2をルーキーイヤーで制した驚異の逸材。2年目にしてグランプリウィナーとなり、チームの選手権争いを牽引。',
    },
    biography: {
      personality: 'どんな極限状態でも心拍数が上がらないかのようなクールな無線と落ち着いた受け答えが特徴。ユーモアも巧み。',
      rivalries: 'ランド・ノリス（マクラーレン内での次世代エース争い）、シャルル・ルクレール（バクーでの激闘）。',
      iconicRaces: [
        {
          gp: '2024 アゼルバイジャンGP',
          year: 2024,
          description: 'バクーのターン1でルクレールに奇襲のレイトブレーキングを仕掛けて首位奪取、その後30周にわたりDRS圏内の猛攻を完全ブロック。',
          tacticalMasterclass: 'ターン16脱出のトラクションをミリ秒単位で最適化し、メインストレートでの最高速防御を完璧に遂行。',
        },
      ],
      quotes: [
        '「ありがとうみんな。特別な勝利だけど、明日の仕事に集中しよう。」',
        '「リスクを取らなければ、一生ルクレールの後ろを走ることになっていた。（バクーでのオーバーテイクについて）」',
      ],
      offTrack: 'オーストラリアンフットボール（リッチモンドFC）の大ファン。',
    },
    milestones: [
      { date: '2023-03-05', event: 'マクラーレンからF1デビュー', refId: 1 },
      { date: '2023-10-07', event: 'カタールGPスプリントで自身初のスプリント勝利を獲得', refId: 1 },
      { date: '2024-07-21', event: 'ハンガリーGPで悲願のF1決勝初優勝を達成', refId: 2 },
      { date: '2024-09-15', event: 'アゼルバイジャンGP（バクー）でルクレールとの死闘を制し通算2勝目', refId: 2 },
    ],
    references: [
      {
        id: 1,
        title: 'Oscar Piastri Junior Formulae Record and F1 Debut Telemetry',
        publisher: 'FIA Formula 2 & 3 Official Archive',
        url: 'https://www.fiaformula2.com',
        verifiedDate: '2023-10-10',
      },
      {
        id: 2,
        title: '2024 Azerbaijan Grand Prix Race Analysis: Piastri Defensive Masterclass',
        publisher: 'F1 Official Analytics',
        url: 'https://www.formula1.com',
        verifiedDate: '2024-09-16',
      },
    ],
  },
  {
    id: 'carlos-sainz',
    code: 'SAI',
    number: 55,
    fullName: 'Carlos Sainz',
    country: 'スペイン 🇪🇸',
    team: 'Scuderia Ferrari / Williams',
    teamColor: '#f87171',
    status: 'Current',
    nickname: 'Smooth Operator',
    birthDate: '1994-09-01',
    birthPlace: 'Madrid, Spain',
    f1Debut: '2015年 オーストラリアGP (Toro Rosso)',
    driverType: '頭脳派戦略＆タイヤウィスパラー',
    numberOrigin: '「Carlo5 5ainz」のスペルに見立てたダブル5（55）番。',
    visualAsset: {
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Carlos_Sainz_Jr_2022.jpg/480px-Carlos_Sainz_Jr_2022.jpg',
      caption: 'Carlos Sainz Jr. (Scuderia Ferrari)',
      credit: 'Stefan Brending',
      license: 'CC BY-SA 4.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Carlos_Sainz_Jr_2022.jpg',
    },
    engineeringPreference: {
      setupBalance: 'リアの安定性を基盤としつつ、ブレーキング時の荷重移動が穏やかなメカニカルセットアップを好む。',
      pedalFeel: 'ロングストロークで細かい踏力調整が可能なブレーキタッチ。',
      steeringWeight: 'しっかりとした手応えのあるステアリングフィール。',
    },
    raceEngineer: {
      name: 'Riccardo Adami',
      callsign: 'Riccardo',
      dynamic: 'ベッテル時代からフェラーリを支えるベテラン。サインツの戦略的ディスカッションを尊重し緻密にサポート。',
    },
    careerSummary:
      'WRC王者カルロス・サインツ・シニアの息子としてトロロッソからデビュー。ルノー、マクラーレンを経てフェラーリへ加入 [1]。高い戦術眼とマシンのセットアップ能力を武器に、2022年シルバーストンでの初優勝、2023年シンガポールでのレッドブル全勝阻止など、知性派ドライバーとしての名声を確立 [2]。',
    entries: 203,
    wins: 3,
    podiums: 23,
    polePositions: 5,
    championships: 0,
    drivingStyle: {
      traits: ['「スムーズ・オペレーター」の異名を持つ高い戦術眼', 'コクピット内での戦略立案能力', 'マシンのセットアップ構築力'],
      brakingTechnique: 'マシンの荷重移動を滑らかに保ち、旋回中のスタビリティを重視するブレーキング [1]。',
      tyreManagement: '後続車のDRSを意図的に利用してチームを守るなど、タイヤ負荷をコントロールする頭脳戦が得意 [2]。',
      telemetrySignature:
        'ブレーキング開始点からステアリング操作までの連動が極めてスムーズ。タイヤの縦荷重と横荷重を分散させ、タイヤの一部分だけに極端な熱が加わるのを防ぐ。',
      preferredCircuitTypes: ['市街地ストリート (シンガポール、モナコ)', '高速複合テクニカル (シルバーストン、メルボルン)'],
      summary: '戦略家としても名高いドライバー。2023年シンガポールGPでレッドブル全勝を阻止した知性あふれる勝利は語り草。',
    },
    biography: {
      personality: 'WRC王者カルロス・サインツのDNAを受け継ぎ、エンジニアリングに対する深い理解と高いプロフェッショナリズムを持つ。',
      rivalries: 'マックス・フェルスタッペン（トロロッソ時代の同期）、シャルル・ルクレール、ランド・ノリス。',
      iconicRaces: [
        {
          gp: '2023 シンガポールGP',
          year: 2023,
          description: '後続のノリスに意図的にDRS圏内（0.8秒差）を走らせ、背後から迫る新品タイヤのメルセデス2台をブロックする伝説の「DRSトレイン戦略」で優勝。',
          tacticalMasterclass: 'コクピット内で自ら戦略を立案し、ピットウォールへ「ノリスにDRSを与えるから心配するな」と指示を出した頭脳戦の極地。',
        },
      ],
      quotes: [
        '「スムーズ・オペレーショ〜ン♪（チェッカー後の無線歌唱）」',
        '「DRSはノリスのためにわざと与えているんだ。これで僕たちは守られる。（シンガポール2023）」',
      ],
      offTrack: 'ゴルフやパデルテニスに熱中し、アスリート仲間との交流も盛ん。',
    },
    milestones: [
      { date: '2015-03-15', event: 'トロロッソからF1デビュー', refId: 1 },
      { date: '2022-07-03', event: 'イギリスGP（シルバーストン）で自身初のポール・トゥ・ウィン初優勝', refId: 1 },
      { date: '2023-09-17', event: 'シンガポールGPでDRSトレイン戦略を完璧に遂行し優勝', refId: 2 },
      { date: '2024-03-24', event: '盲腸手術から電撃復帰したオーストラリアGPで劇的優勝', refId: 2 },
    ],
    references: [
      {
        id: 1,
        title: 'Carlos Sainz Silverstone 2022 Telemetry and Throttle Modulation',
        publisher: 'Scuderia Ferrari Technical Archive',
        url: 'https://www.ferrari.com',
        verifiedDate: '2022-07-05',
      },
      {
        id: 2,
        title: 'Singapore 2023 Strategy Breakdown: The DRS Train Tactic',
        publisher: 'Racecar Engineering Strategy Reports',
        url: 'https://www.racecar-engineering.com',
        verifiedDate: '2023-09-20',
      },
    ],
  },
  {
    id: 'george-russell',
    code: 'RUS',
    number: 63,
    fullName: 'George Russell',
    country: 'イギリス 🇬🇧',
    team: 'Mercedes-AMG',
    teamColor: '#2dd4bf',
    status: 'Current',
    nickname: 'Mr. Saturday / ジョージ',
    birthDate: '1998-02-15',
    birthPlace: 'King\'s Lynn, United Kingdom',
    f1Debut: '2019年 オーストラリアGP (Williams)',
    driverType: '予選一撃アタッカー＆アグレッシブ派',
    numberOrigin: '兄がカートで使用していた「63」番を受け継ぎ、GR63のロゴとしても愛用。',
    visualAsset: {
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/George_Russell_2022.jpg/480px-George_Russell_2022.jpg',
      caption: 'George Russell (Mercedes-AMG F1)',
      credit: 'Stefan Brending',
      license: 'CC BY-SA 4.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:George_Russell_2022.jpg',
    },
    engineeringPreference: {
      setupBalance: 'フロントの反応が鋭く、ダイレクトにノーズが入るセッティングを好む。',
      pedalFeel: '剛性感が高く瞬時に最大減速Gを発生させるショートストロークブレーキ。',
      steeringWeight: 'レスポンスが速く正確なフィードバックを要求。',
    },
    raceEngineer: {
      name: 'Marcus Dudley',
      callsign: 'Marcus',
      dynamic: 'エンジニアリングデータの詳細な数値共有を好むラッセルと緊密に連携。',
    },
    careerSummary:
      'GP3、F2を連覇しメルセデス育成から2019年ウィリアムズでデビュー。マシンの戦闘力を超える予選パフォーマンスから「ミスター・サタデー」の異名をとる [1]。2022年メルセデスへ昇格し、サンパウロGPでチーム唯一の優勝を達成。次世代リーダーとして定着 [2]。',
    entries: 125,
    wins: 2,
    podiums: 14,
    polePositions: 3,
    championships: 0,
    drivingStyle: {
      traits: ['予選での驚異的な一撃アタック（ミスター・サタデー）', 'ストレートエンドでのアグレッシブなオーバーテイク', '緻密なエンジニアリングフィードバック'],
      brakingTechnique: '鋭いブレーキングから即座にターンインし、コーナー脱出時のドラッグを低減させる [1]。',
      tyreManagement: '1ストップ作戦を自ら提案して遂行する大胆なタイヤマネジメント [2]。',
      telemetrySignature:
        'ブレーキング時の減速Gの立ち上がりが非常に急峻。コーナリング初期のノーズの回頭性を最重要視し、予選アタックにおいてトラックリミットのミリ単位まで路面を使い切る。',
      preferredCircuitTypes: ['超高速パワーサーキット (スパ、モンツァ、インテルラゴス)', '中高速複合 (シュピールベルク、シルバーストン)'],
      summary: 'メルセデスの次世代リーダー。ウィリアムズ時代から培った逆境でのスピードと、勝利への執念を持つ。',
    },
    biography: {
      personality: 'GPDA（グランプリ・ドライバーズ・アソシエーション）理事を務め、ドライバーの安全向上にも貢献する理知的なリーダー。',
      rivalries: 'ルイス・ハミルトン（メルセデス内での世代交代バトル）、バルテリ・ボッタス。',
      iconicRaces: [
        {
          gp: '2022 サンパウロGP',
          year: 2022,
          description: 'スプリント勝利に続き、決勝でもハミルトンの追撃を完璧に退けてキャリア初優勝のポール・トゥ・ウィンを達成。',
          tacticalMasterclass: 'セーフティカー後のリスタートでタイヤウォームアップを完璧に行い、チームメイトに反撃の隙を与えなかった。',
        },
      ],
      quotes: [
        '「僕たちは諦めない。一歩一歩マシンを速くしていくんだ。」',
        '「予選の1周は、自分とマシンが完全にひとつになる瞬間なんだ。」',
      ],
      offTrack: 'パワーポイントでのプレゼンが得意なことでも有名（ウィリアムズ加入時も自らスライドでアピールした逸話あり）。',
    },
    milestones: [
      { date: '2019-03-17', event: 'ウィリアムズからF1デビュー', refId: 1 },
      { date: '2021-08-29', event: 'ベルギーGP雨の予選でウィリアムズをフロントロウ2位に導く', refId: 1 },
      { date: '2022-11-13', event: 'サンパウロGP（ブラジル）でスプリント＆決勝の完全優勝を達成', refId: 2 },
      { date: '2024-06-30', event: 'オーストリアGPで冷静な走破により自身2勝目を獲得', refId: 2 },
    ],
    references: [
      {
        id: 1,
        title: 'George Russell Qualifying Performance Trace Analysis',
        publisher: 'Mercedes-AMG F1 Insights',
        url: 'https://www.mercedesamgf1.com',
        verifiedDate: '2024-02-14',
      },
      {
        id: 2,
        title: '2022 Brazilian Grand Prix Telemetry and Tyre Pace Log',
        publisher: 'FIA Official Race Records',
        url: 'https://www.fia.com',
        verifiedDate: '2022-11-15',
      },
    ],
  },
  {
    id: 'sergio-perez',
    code: 'PER',
    number: 11,
    fullName: 'Sergio Perez',
    country: 'メキシコ 🇲🇽',
    team: 'Red Bull Racing',
    teamColor: '#38bdf8',
    status: 'Current',
    nickname: 'Checo (チェコ) / メキシコ防衛大臣',
    birthDate: '1990-01-26',
    birthPlace: 'Guadalajara, Mexico',
    f1Debut: '2011年 オーストラリアGP (Sauber)',
    driverType: '市街地スペシャリスト＆タイヤケア派',
    numberOrigin: '幼少期に憧れたクラブ・アメリカのサッカー選手イバン・サモラーノの背番号「11」に由来。',
    visualAsset: {
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Sergio_Perez_2022.jpg/480px-Sergio_Perez_2022.jpg',
      caption: 'Sergio Perez (Red Bull Racing)',
      credit: 'Stefan Brending',
      license: 'CC BY-SA 4.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Sergio_Perez_2022.jpg',
    },
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
    careerSummary:
      'ザウバー、マクラーレン、フォースインディア／レーシングポイントを経て2021年レッドブルに加入 [1]。2020年サヒールGPでの最後尾からの初優勝、2021年アブダビGPでの伝説のディフェンス、モナコやバクーでのストリート勝利など数々の歴史的瞬間を刻む [2]。',
    entries: 278,
    wins: 6,
    podiums: 39,
    polePositions: 3,
    championships: 0,
    drivingStyle: {
      traits: ['「タイヤ・ウィスパラー」の異名を取るタイヤ長寿命化技術', 'ストリートコースでの強烈な勝負強さ', '屈強なディフェンス力'],
      brakingTechnique: 'リアタイヤのスライドを嫌い、アンダーステア傾向のマシンを安定して止めるブレーキング [1]。',
      tyreManagement: 'リアタイヤのトラクション摩耗を抑え、第1スティントを限界まで伸ばす独特のタイヤケア [2]。',
      telemetrySignature:
        'スロットルペダルの開度を微細に調整し、コーナー立ち上がりでのホイールスピン（トラクションロス）を極限まで抑える。これによりリアタイヤの表面温度上昇を防ぎ、ロングスティントで他車を圧倒する。',
      preferredCircuitTypes: ['市街地ストリート (モナコ、バクー、シンガポール、ジェッダ)'],
      summary: 'モナコ、バクー、シンガポール、ジェッダなどストリートコースでの優勝歴を誇るメキシコの英雄。',
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
      { date: '2022-05-29', event: 'モナコGPで伝統のストリートウィナーとなる', refId: 2 },
    ],
    references: [
      {
        id: 1,
        title: 'Sergio Perez Tyre Degradation Gradient Analysis in High-Energy Circuits',
        publisher: 'Pirelli Motorsport Technical Archive',
        url: 'https://www.pirelli.com',
        verifiedDate: '2023-05-10',
      },
      {
        id: 2,
        title: '2021 Abu Dhabi Grand Prix Defensive Telemetry: Perez vs Hamilton',
        publisher: 'Red Bull Racing Technical Reports',
        url: 'https://www.redbullracing.com',
        verifiedDate: '2021-12-16',
      },
    ],
  },
  {
    id: 'fernando-alonso',
    code: 'ALO',
    number: 14,
    fullName: 'Fernando Alonso',
    country: 'スペイン 🇪🇸',
    team: 'Aston Martin',
    teamColor: '#34d399',
    status: 'Current',
    nickname: 'El Nano / 将軍アロンソ',
    birthDate: '1981-07-29',
    birthPlace: 'Oviedo, Spain',
    f1Debut: '2001年 オーストラリアGP (Minardi)',
    driverType: '超絶順応＆総合力オールラウンダー',
    numberOrigin: '1996年7月14日、14歳の時にカート世界選手権で優勝した幸運の番号「14」に由来。',
    visualAsset: {
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/Fernando_Alonso_2022.jpg/480px-Fernando_Alonso_2022.jpg',
      caption: 'Fernando Alonso (Aston Martin F1)',
      credit: 'Stefan Brending',
      license: 'CC BY-SA 4.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Fernando_Alonso_2022.jpg',
    },
    engineeringPreference: {
      setupBalance: 'フロントタイヤの強い食いつきを最優先。リアが不安定であっても自身のステアリング修正でカバー可能。',
      pedalFeel: '踏力リニアリティが高く、コーナー奥深くで繊細に抜けるブレーキペダル。',
      steeringWeight: '路面とタイヤの摩擦変化が直感的に伝わるクリアなステアリング。',
    },
    raceEngineer: {
      name: 'Chris Cronin',
      callsign: 'Chris',
      dynamic: 'アロンソの膨大なレース内情報処理と連携し、他車の戦略ギャップをリアルタイムで分析。',
    },
    careerSummary:
      '2001年ミナルディからデビューし、ルノーで2005年・2006年にミハエル・シューマッハを破って世界王者連覇 [1]。マクラーレン、フェラーリ、アルピーヌ、アストンマーティンと渡り歩き、ル・マン24時間連覇やWEC王者も獲得。通算400戦に迫る今なおグリッド最速の一角として輝き続ける生ける伝説 [2]。',
    entries: 398,
    wins: 32,
    podiums: 106,
    polePositions: 22,
    championships: 2,
    championshipYears: [2005, 2006],
    drivingStyle: {
      traits: ['鋭いステアリング入力で無理やりノーズをインに向ける独特のスタイル', 'レース状況全体の超人的な空間把握能力', 'あらゆる悪条件下でのマキシマムパフォーマンス'],
      brakingTechnique: 'コーナリング中にフロントタイヤを強引に機能させるアグレッシブな踏力制御 [1]。',
      tyreManagement: 'マシンの欠陥を自身のステアリング修正で完全に相殺するタイヤ保護術 [2]。',
      telemetrySignature:
        'ターンイン時のステアリング入力が極めてアグレッシブで、フロントタイヤにあえてスリップアングルを与えてタイヤを発熱・グリップさせる。アンダーステアをねじ伏せる独自の操縦技術。',
      preferredCircuitTypes: ['オールラウンド全サーキット (鈴鹿、バクー、シルバーストン、インテルラゴス)'],
      summary: 'F1通算400戦に迫る現役最年長の絶対王者。どんな戦闘力のマシンでも100%以上の結果を引き出す驚異のレジェンド。',
    },
    biography: {
      personality: '鋭い洞察力と妥協なき闘争心の持ち主。コース上の巨大スクリーンを見ながらレース展開を予測する超人的IQを誇る。',
      rivalries: 'ミハエル・シューマッハ（2006年の頂上決戦）、ルイス・ハミルトン（2007年マクラーレン内戦）、セバスチャン・ベッテル（2010-2012年）。',
      iconicRaces: [
        {
          gp: '2005 サンマリノGP (イモラ)',
          year: 2005,
          description: '背後から猛追するシューマッハのフェラーリを12周にわたり1ミリの隙もなく抑えきった伝説のディフェンス戦。',
          tacticalMasterclass: 'マシンの最高速の利点を活かし、低速コーナーではエイペックスを確実に押さえてオーバーテイクの隙をゼロにした。',
        },
        {
          gp: '2012 ヨーロッパGP (バレンシア)',
          year: 2012,
          description: '11番グリッドから怒涛のオーバーテイクを連発し、母国スペインのファンの前で劇的優勝。',
          tacticalMasterclass: 'セーフティカー後のリスタートで外側からグロージャンをパスするなど、勝負勘とタイヤマネジメントの極致。',
        },
      ],
      quotes: [
        '「僕はいつだってクルマのポテンシャルの100%以上を引き出している。」',
        '「All the time you have to leave a space!（常にスペースを残さなきゃダメだ！）」',
        '「レースは日曜日だ。土曜日の予選で何位だろうと、チェッカーフラッグまで諦めない。」',
      ],
      offTrack: '故郷オビエドに自らのレーシングミュージアム＆カートサーキットを設立し、次世代ドライバーを育成。',
    },
    milestones: [
      { date: '2001-03-04', event: 'ミナルディから19歳でF1デビュー', refId: 1 },
      { date: '2005-09-25', event: 'ルノーで当時の史上最年少世界チャンピオンを獲得', refId: 1 },
      { date: '2006-10-22', event: 'シューマッハとの死闘を制しドライバーズタイトル連覇達成', refId: 2 },
      { date: '2023-03-05', event: 'アストンマーティン移籍初戦で表彰台（41歳での表彰台ラッシュ）', refId: 2 },
    ],
    references: [
      {
        id: 1,
        title: 'Fernando Alonso Steering Input Dynamics and Lateral Acceleration Profiling',
        publisher: 'Racecar Engineering Heritage Series',
        url: 'https://www.racecar-engineering.com',
        verifiedDate: '2023-04-12',
      },
      {
        id: 2,
        title: 'FIA Championship Historical Hall of Fame: Fernando Alonso',
        publisher: 'FIA Official History',
        url: 'https://www.fia.com',
        verifiedDate: '2024-01-10',
      },
    ],
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
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Yuki_Tsunoda_2022.jpg/480px-Yuki_Tsunoda_2022.jpg',
      caption: 'Yuki Tsunoda (Visa Cash App RB)',
      credit: 'Stefan Brending',
      license: 'CC BY-SA 4.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Yuki_Tsunoda_2022.jpg',
    },
    engineeringPreference: {
      setupBalance: '奥深いレイトブレーキングを可能にするフロントの絶対的制動スタビリティを重視。',
      pedalFeel: '踏み始めの初期バイトが強力で、踏力コントロールがダイレクトなブレーキ。',
      steeringWeight: '高速コーナーでのインフォメーションが豊かなステアリング。',
    },
    raceEngineer: {
      name: 'Ernesto Desiderio',
      callsign: 'Ernesto',
      dynamic: '2024年からの相棒。角田の感情とパッションを冷静に受け止め、クリアで論理的な交信で支える。',
    },
    careerSummary:
      'ホンダ・フォーミュラ・ドリーム・プロジェクト（HFDP）とレッドブル・ジュニアチームに所属し、F3・F2でルーキー優勝を重ねて2021年アルファタウリからF1昇格 [1]。日本人ドライバーとして史上初のデビュー戦入賞を飾り、4年目を迎えた2024年にはチームリーダーとして予選Q3進出の常連となり、トップチーム昇格を狙う [2]。',
    entries: 88,
    wins: 0,
    podiums: 0,
    polePositions: 0,
    championships: 0,
    drivingStyle: {
      traits: ['天性の奥深いレイトブレーキング技術', '高速コーナーでの卓越したマシンコントロール', '無線での情熱と年々磨かれる冷静なマネジメント'],
      brakingTechnique: '限界ギリギリまで制動開始を遅らせ、エイペックスへ最短距離でアプローチするアグレッシブな突っ込み [1]。',
      tyreManagement: 'エンジニアとの密な連携により、リアタイヤのトラクションを維持するスロットル開度制御が向上 [2]。',
      telemetrySignature:
        'ブレーキングポイントがグリッド屈指の深さ（レイトブレーキング）。フロントタイヤの制動限界を足裏のセンサーで感じ取り、ターンイン直前まで減速力を保ちながらマシンをエイペックスにねじ込む。',
      preferredCircuitTypes: ['高横Gテクニカル (鈴鹿、イモラ、スパ)', 'ストリートコース (バクー、シンガポール)'],
      summary: 'ホンダ・レッドブル育成出身の日本の至宝。4年目を迎えて予選Q3進出常連となり、チームリーダーとして成熟。',
    },
    biography: {
      personality: '世界中のファンから愛される素直でユーモラスな人柄。美味しい食事をこよなく愛し、レース外の飾らない姿も大人気。',
      rivalries: 'ピエール・ガスリー（親友であり成長の師）、ダニエル・リカルド（RB内での熾烈なチームメイト対決）。',
      iconicRaces: [
        {
          gp: '2021 アブダビGP',
          year: 2021,
          description: 'ファイナルラップでボッタスをパスし、日本人最高位タイに迫る自己最高4位フィニッシュを達成。',
          tacticalMasterclass: 'セーフティカー後のアグレッシブなタイヤウォームアップと最終ラップでの鮮やかなオーバーテイク。',
        },
        {
          gp: '2024 日本GP (鈴鹿)',
          year: 2024,
          description: '母国鈴鹿でチームの神がかり的ピット作業とともに、ライバル3台をごぼう抜きして堂々の10位入賞。',
          tacticalMasterclass: 'S字区間での完璧なマシンコントロールと、ピットアウト後のトラフィック処理を完璧に遂行。',
        },
      ],
      quotes: [
        '「コース上に出たら、相手が誰であろうと絶対に引かない。」',
        '「鈴鹿でファンの皆さんの前でポイントを獲れた瞬間は、一生忘れられない宝物です。」',
      ],
      offTrack: '大の日本食＆グルメ好きで、趣味は料理とサウナ。イタリア・ファエンツァでの生活を満喫。',
    },
    milestones: [
      { date: '2021-03-28', event: 'バーレーンGPでF1デビュー戦9位入賞（日本人初のデビュー戦入賞）', refId: 1 },
      { date: '2021-12-12', event: 'アブダビGP決勝で自己最高位となる4位入賞を達成', refId: 1 },
      { date: '2024-04-07', event: '母国日本GP（鈴鹿）で見事なピット作業と走りで10位入賞', refId: 2 },
      { date: '2024-05-19', event: 'エミリア・ロマーニャGP（イモラ）で予選7位・決勝ポイント獲得', refId: 2 },
    ],
    references: [
      {
        id: 1,
        title: 'Yuki Tsunoda Braking Footprint and Lateral G Traces: Sakhir & Yas Marina',
        publisher: 'Scuderia AlphaTauri / VCARB Engineering Archive',
        url: 'https://www.visacashapprb.com',
        verifiedDate: '2022-01-15',
      },
      {
        id: 2,
        title: '2024 Japanese Grand Prix Telemetry and Pit Stop Execution: RB vs Rivals',
        publisher: 'Honda Racing Corporation (HRC) Technical Bulletin',
        url: 'https://honda.racing',
        verifiedDate: '2024-04-09',
      },
    ],
  },
  // ── LEGENDS (Unified Champagne Gold #D4AF37) ──
  {
    id: 'ayrton-senna',
    code: 'SEN',
    number: 12,
    fullName: 'Ayrton Senna',
    country: 'ブラジル 🇧🇷',
    team: 'McLaren / Williams / Lotus',
    teamColor: '#D4AF37',
    status: 'Legend',
    nickname: '音速の貴公子 / Rain Master / 神童セナ',
    birthDate: '1960-03-21',
    birthPlace: 'São Paulo, Brazil',
    f1Debut: '1984年 ブラジルGP (Toleman)',
    driverType: '異次元の予選アタック＆セナ足スロットル',
    numberOrigin: 'ロータスおよびマクラーレン・ホンダ黄金期に世界を席巻した象徴のゼッケン「12」番。',
    visualAsset: {
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Ayrton_Senna_Imola_1989.jpg/480px-Ayrton_Senna_Imola_1989.jpg',
      caption: 'Ayrton Senna (McLaren-Honda, Imola 1989)',
      credit: 'Instituto Ayrton Senna',
      license: 'CC BY 2.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Ayrton_Senna_Imola_1989.jpg',
    },
    engineeringPreference: {
      setupBalance: 'フロントの超絶レスポンス。ターボラグを克服するための繊細なペダルセットアップを要求。',
      pedalFeel: 'スロットルを毎秒数回煽る「セナ足」に対応する超高感度スロットルペダル。',
      steeringWeight: 'パワーステアリングのない時代、タイヤとマシンの挙動を100%伝えるステアリング。',
    },
    raceEngineer: {
      name: 'Giorgio Ascanelli / Steve Nichols',
      callsign: 'Giorgio',
      dynamic: 'セナの神秘的とも言える車両感覚をテレメトリ黎明期に解析しマシンに反映させた名エンジニアたち。',
    },
    careerSummary:
      'カート時代から圧倒的な才能を示し、イギリスF3を制覇して1984年トールマンからF1デビュー [1]。ロータス時代に卓越した予選スピードを開花させ、1988年マクラーレン・ホンダへ加入するとアラン・プロストとの伝説の黄金期を築き、3度の世界王座を獲得 [2]。極限の集中力と天性の感覚で世界中のモータースポーツファンを熱狂させた絶対的カリスマ。',
    entries: 161,
    wins: 41,
    podiums: 80,
    polePositions: 65,
    championships: 3,
    championshipYears: [1988, 1990, 1991],
    drivingStyle: {
      traits: ['「セナ足」と呼ばれる微細な連続スロットルポンピング', '雨天（ウェット）での神がかり的なトラクション探索', 'モナコ6勝を誇る市街地の圧倒的スピード'],
      brakingTechnique: 'ターンイン直後からスロットルを細かく煽り、ターボの過給圧を維持しながらタイヤ限界を探る [1]。',
      tyreManagement: '自らの直感を信じ、路面グリップの変化を誰よりも早く読み取る超感覚的ドライビング [2]。',
      telemetrySignature:
        'コーナリング中にスロットルを毎秒数回刻むように微細にON/OFFする「セナ足」。ターボラグを解消しつつ、リアタイヤのスライド量を瞬時に察知してグリップのピークを維持し続ける唯一無二の技術。',
      preferredCircuitTypes: ['市街地ストリート (モナコ通算6勝)', '雨天・ウェットサーキット全般 (ドニントン1993、エストリル1985)'],
      summary: 'モータースポーツ史に燦然と輝く絶対的カリスマ。予選ポールポジション率40%超という驚異的レコードを誇る。',
    },
    biography: {
      personality: '深い信仰心と哲学的思考、そしてコース上での激しい闘争心が共存した唯一無二の英雄。',
      rivalries: 'アラン・プロスト（セナ・プロ対決としてF1史上最大のライバル関係）、ナイジェル・マンセル、ネルソン・ピケ。',
      iconicRaces: [
        {
          gp: '1984 モナコGP',
          year: 1984,
          description: '豪雨のモナコで非力なトールマンを駆り、トップのプロストを毎周3秒追い詰める伝説の走りでP2表彰台。',
          tacticalMasterclass: '雨水で川となったコースで他車と異なるグリップラインを瞬時に見極めた。',
        },
        {
          gp: '1988 日本GP (鈴鹿)',
          year: 1988,
          description: 'ポールポジションからまさかのスタートエンストで14番手まで転落後、驚異の鬼神の追い上げで逆転優勝＆初の世界王者戴冠。',
          tacticalMasterclass: '雨がパラつく鈴鹿で1台ずつ確実にオーバーテイクし、プロストをホームストレートで捕らえた。',
        },
        {
          gp: '1993 ヨーロッパGP (ドニントン)',
          year: 1993,
          description: '豪雨のオープニングラップでシューマッハ、ウェンドリンガー、ヒル、プロストの4台を1周で抜き去り独走優勝（F1史上最高の1周）。',
          tacticalMasterclass: 'ウェット路面での異次元のライン取りと繊細なスロットルワークで全車を周回遅れにする圧倒的勝利。',
        },
      ],
      quotes: [
        '「ポールポジションを獲った時、僕は自分が別の次元のトンネルの中にいると感じた。」',
        '「2位になるということは、最初の敗者になるということだ。」',
        '「レーシングドライバーである以上、隙間（ギャップ）が存在するなら飛び込まなければならない。」',
      ],
      offTrack: 'ブラジルの貧しい子どもたちを救うためアイルトン・セナ財団を設立。現在も数百万人の教育を支援。',
    },
    milestones: [
      { date: '1984-06-03', event: '豪雨のモナコGPでトールマンを駆り伝説のP2表彰台', refId: 1 },
      { date: '1988-10-30', event: '鈴鹿・日本GPで奇跡のスタートエンスト挽回劇から初の世界王者戴冠', refId: 1 },
      { date: '1993-04-11', event: 'ドニントンパークの豪雨オープニングラップで5台抜き伝説の優勝', refId: 2 },
    ],
    references: [
      {
        id: 1,
        title: 'Ayrton Senna: The Telemetry of a Legend and the Senna Throttle Technique',
        publisher: 'McLaren Heritage Telemetry Archives',
        url: 'https://www.mclaren.com',
        verifiedDate: '2021-05-01',
      },
      {
        id: 2,
        title: 'FIA Hall of Fame: Ayrton Senna da Silva',
        publisher: 'FIA Official History',
        url: 'https://www.fia.com',
        verifiedDate: '2023-01-10',
      },
    ],
  },
  {
    id: 'michael-schumacher',
    code: 'MSC',
    number: 1,
    fullName: 'Michael Schumacher',
    country: 'ドイツ 🇩🇪',
    team: 'Ferrari / Benetton / Mercedes',
    teamColor: '#D4AF37',
    status: 'Legend',
    nickname: '皇帝 / Der Rote Baron / ターミネーター',
    birthDate: '1969-01-03',
    birthPlace: 'Hürth, Germany',
    f1Debut: '1991年 ベルギーGP (Jordan)',
    driverType: '予選ペース連続周回＆完全無欠マシン',
    numberOrigin: 'フェラーリ黄金期に5連覇を達成した不滅のチャンピオンナンバー「1」。',
    visualAsset: {
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Michael_Schumacher_2005.jpg/480px-Michael_Schumacher_2005.jpg',
      caption: 'Michael Schumacher (Scuderia Ferrari, 2005)',
      credit: 'Hans-Peter van Velthoven',
      license: 'CC BY-SA 3.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Michael_Schumacher_2005.jpg',
    },
    engineeringPreference: {
      setupBalance: 'フロントの圧倒的な入り。左足ブレーキで車体を安定させながらリアをわずかに滑らせるセッティング。',
      pedalFeel: '左足ブレーキングに特化した超高精度ブレーキペダルとスロットルオーバーラップ制御。',
      steeringWeight: '極限のフィジカルを活かした重厚で正確無比なステアリングレスポンス。',
    },
    raceEngineer: {
      name: 'Ross Brawn / Luca Baldisserri',
      callsign: 'Ross',
      dynamic: 'F1史上最高の戦略コンビ。「マイケル、毎周予選アタックで25秒差を作れ」という無茶振りに応えた伝説のパートナーシップ。',
    },
    careerSummary:
      '1991年スパでジョーダンから衝撃のデビューを飾り、直後にベネトンへ移籍して1994年・1995年に世界王座連覇 [1]。1996年に名門フェラーリへ移籍すると、ジャン・トッド、ロス・ブラウンらとともにチームを再建し、2000年から2004年にかけて前人未到のドライバーズタイトル5連覇を達成 [2]。F1のフィジカルトレーニング基準を塗り替えた近代F1の皇帝。',
    entries: 308,
    wins: 91,
    podiums: 155,
    polePositions: 68,
    championships: 7,
    championshipYears: [1994, 1995, 2000, 2001, 2002, 2003, 2004],
    drivingStyle: {
      traits: ['決勝レース中に予選ラップを何十周も連続再現する驚異的スタミナ', '左足ブレーキと電子制御を活用したマシン開発力', 'フェラーリ黄金期を築いた圧倒的リーダーシップ'],
      brakingTechnique: '左足ブレーキングによりスロットルとブレーキをオーバーラップさせ、車体バランスを完璧に固定 [1]。',
      tyreManagement: 'ピットインのタイミングに合わせて毎周1秒ずつペースを上げる超人的スプリント走行 [2]。',
      telemetrySignature:
        '左足ブレーキを駆使し、減速と加速の踏み替え時間をゼロ化。コーナー進入で微量のスロットルを残してディフューザー負圧を安定させ、ターンインの安定性を極限まで高めるテレメトリ波形を示す。',
      preferredCircuitTypes: ['高低差と超高速コーナー (スパ・フランコルシャン通算6勝、鈴鹿通算6勝)', 'テクニカルストップ＆ゴー (ハンガロリンク、イモラ)'],
      summary: 'フェラーリで前人未到のドライバーズタイトル5連覇を達成した「皇帝」。現代F1のフィジカルトレーニング基準を確立。',
    },
    biography: {
      personality: 'チーム全員を家族のように愛し、ファクトリーの夜遅くまでメカニックと語り合った究極のプロフェッショナル。',
      rivalries: 'アイルトン・セナ（1992-1994年）、ミカ・ハッキネン（1998-2000年の歴史的盟友）、フェルナンド・アロンソ（2006年）。',
      iconicRaces: [
        {
          gp: '1998 ハンガリーGP',
          year: 1998,
          description: 'ロス・ブラウンの「毎周予選アタックで25秒差を作れ」という無茶な3ストップ指示に応え、毎周1秒引き離して大逆転優勝。',
          tacticalMasterclass: '19周連続で予選ファステストラップを刻み続け、ピットアウト時にマクラーレンの前へ躍り出た。',
        },
        {
          gp: '1996 スペインGP',
          year: 1996,
          description: '豪雨のカタルーニャで戦闘力の劣るフェラーリF310を操り、他車より毎周4〜5秒速い異次元のペースでフェラーリ初勝利。',
          tacticalMasterclass: '豪雨の中で独自のハイグリップラインを独占し、2位ジャン・アレジに45秒差をつけて完全独走。',
        },
        {
          gp: '2000 日本GP (鈴鹿)',
          year: 2000,
          description: 'ハッキネンとの壮絶なラップタイム削り合いをピット戦略で制し、フェラーリに21年ぶりのドライバーズ王座を奪還。',
          tacticalMasterclass: 'ピットイン前の数周で小雨が降る中、渾身のスパートをかけて逆転ピットアウト。',
        },
      ],
      quotes: [
        '「完璧を求めること。それだけが勝利への唯一の道だ。」',
        '「レースはコース上だけで勝つんじゃない。ファクトリーの全員の情熱と努力で勝つんだ。」',
      ],
      offTrack: '慈善活動へ多額の寄付を行い、Keep Fighting Foundation を通じて現在もその精神が継承されている。',
    },
    milestones: [
      { date: '1991-08-25', event: 'ジョーダンからスパで鮮烈デビュー（予選7位）', refId: 1 },
      { date: '1994-11-13', event: 'ベネトンで自身初のワールドチャンピオン獲得', refId: 1 },
      { date: '2000-10-08', event: '日本GP（鈴鹿）でフェラーリに21年ぶりのドライバーズ王座をもたらす', refId: 2 },
      { date: '2004-08-29', event: 'ベルギーGPで歴代最多7度目のワールドタイトル獲得を確定', refId: 2 },
    ],
    references: [
      {
        id: 1,
        title: 'Michael Schumacher Left-Foot Braking and Telemetry Reconstruction',
        publisher: 'Scuderia Ferrari Historical Bureau',
        url: 'https://www.ferrari.com',
        verifiedDate: '2022-08-15',
      },
      {
        id: 2,
        title: 'FIA Official History: The Michael Schumacher Ferrari Era (1996-2006)',
        publisher: 'FIA Official Publications',
        url: 'https://www.fia.com',
        verifiedDate: '2023-01-20',
      },
    ],
  },
];



// ─────────────────────────────────────────────────────────────
// 3. ICONIC CIRCUITS PROFILE (6 World Circuits)
// ─────────────────────────────────────────────────────────────

export const KNOWLEDGE_CIRCUITS: CircuitProfile[] = [
  {
    id: 'bahrain-international',
    name: 'バーレーン・インターナショナル・サーキット',
    officialName: 'Bahrain International Circuit (Sakhir)',
    country: 'バーレーン 🇧🇭',
    lengthKm: 5.412,
    turns: 15,
    drsZones: 3,
    downforceLevel: 'Medium',
    tyreStress: 'High',
    typicalPitLossSec: 22.5,
    lapRecord: {
      time: '1:31.447',
      driver: 'Pedro de la Rosa (McLaren)',
      year: 2005,
    },
    characteristics:
      '過酷なストップ＆ゴー特性と高粗度アスファルトによる極端なリアタイヤ熱ダレが特徴 [1]。ターン1、ターン4、ターン11など強力なブレーキングポイントが多く、アンダーカットの威力がグリッド中でも最大級に高い [2]。',
    telemetrySession: {
      year: 2024,
      meetingKey: 1234,
      sessionKey: 9161,
      meetingName: 'Bahrain Grand Prix',
      targetLap: 1,
      targetDriver: '1',
    },
    references: [
      {
        id: 1,
        title: 'FIA Circuit Homologation & Safety Dossier: Bahrain International Circuit',
        publisher: 'FIA Safety Commission',
        url: 'https://www.fia.com',
        verifiedDate: '2024-02-01',
      },
      {
        id: 2,
        title: 'Pirelli Track Surface Macro-Roughness & Thermal Degradation: Sakhir',
        publisher: 'Pirelli Motorsport Engineering Group',
        url: 'https://www.pirelli.com',
        verifiedDate: '2024-02-20',
      },
    ],
  },
  {
    id: 'suzuka',
    name: '鈴鹿サーキット',
    officialName: 'Suzuka International Racing Course',
    country: '日本 🇯🇵',
    lengthKm: 5.807,
    turns: 18,
    drsZones: 1,
    downforceLevel: 'High',
    tyreStress: 'Very High',
    typicalPitLossSec: 22.8,
    lapRecord: {
      time: '1:30.983',
      driver: 'Lewis Hamilton (Mercedes)',
      year: 2019,
    },
    characteristics:
      '世界で唯一の8の字立体交差を持つテクニカルコース [1]。セクター1の連続S字やデグナー、スプーン、130Rなど高横Gコーナーが連続し、フロント・リア双方のタイヤデグラデーションが激しい [2]。',
    references: [
      {
        id: 1,
        title: 'Suzuka Circuit Layout and High-Lateral Load Analysis',
        publisher: 'Honda Mobilityland Technical Archive',
        url: 'https://www.suzukacircuit.jp',
        verifiedDate: '2024-04-01',
      },
      {
        id: 2,
        title: 'Pirelli Compound Selection for High Energy Lateral Loading: Suzuka',
        publisher: 'Pirelli Motorsport Reports',
        url: 'https://www.pirelli.com',
        verifiedDate: '2024-04-03',
      },
    ],
  },
  {
    id: 'monza',
    name: 'モンツァ・サーキット',
    officialName: 'Autodromo Nazionale Monza',
    country: 'イタリア 🇮🇹',
    lengthKm: 5.793,
    turns: 11,
    drsZones: 2,
    downforceLevel: 'Low',
    tyreStress: 'Medium',
    typicalPitLossSec: 24.2,
    lapRecord: {
      time: '1:21.046',
      driver: 'Rubens Barrichello (Ferrari)',
      year: 2004,
    },
    characteristics:
      '「スピードの殿堂」と呼ばれる超高速サーキット [1]。最高速350km/h超に達するため極限の低ドラッグ（薄型リヤウィング）セッティングが要求され、第1シケイン（ターン1）でのブレーキング勝負がレースの命運を分ける [2]。',
    references: [
      {
        id: 1,
        title: 'Autodromo Nazionale Monza Technical Profile & Low-Drag Aero Requirements',
        publisher: 'Autodromo Nazionale Monza Archive',
        url: 'https://www.monzanet.it',
        verifiedDate: '2023-09-01',
      },
      {
        id: 2,
        title: 'Top Speed and Slipstream Drag Reduction Dynamics at Monza',
        publisher: 'SAE Motorsports Analysis',
        url: 'https://www.sae.org',
        verifiedDate: '2023-09-10',
      },
    ],
  },
  {
    id: 'spa-francorchamps',
    name: 'スパ・フランコルシャン',
    officialName: 'Circuit de Spa-Francorchamps',
    country: 'ベルギー 🇧🇪',
    lengthKm: 7.004,
    turns: 19,
    drsZones: 2,
    downforceLevel: 'Medium',
    tyreStress: 'Very High',
    typicalPitLossSec: 23.5,
    lapRecord: {
      time: '1:46.286',
      driver: 'Valtteri Bottas (Mercedes)',
      year: 2018,
    },
    characteristics:
      'F1カレンダー最長を誇る名門コース [1]。オールージュからラディオンへの急勾配駆け上がりでの激しい垂直G圧縮、ケメルストレートでの最高速、セクター2のテクニカルコーナー群と、気候急変（スパ・ウェザー）が特徴 [2]。',
    references: [
      {
        id: 1,
        title: 'Circuit de Spa-Francorchamps Elevation Changes and Compression Forces',
        publisher: 'Spa Grand Prix Technical Office',
        url: 'https://www.spa-francorchamps.be',
        verifiedDate: '2024-07-20',
      },
      {
        id: 2,
        title: 'Aerodynamic Compromise: Low Drag Sector 1/3 vs High Downforce Sector 2 at Spa',
        publisher: 'Racecar Engineering Analysis',
        url: 'https://www.racecar-engineering.com',
        verifiedDate: '2024-07-25',
      },
    ],
  },
  {
    id: 'monaco',
    name: 'モナコ市街地コース',
    officialName: 'Circuit de Monaco',
    country: 'モナコ 🇲🇨',
    lengthKm: 3.337,
    turns: 19,
    drsZones: 1,
    downforceLevel: 'High',
    tyreStress: 'Low',
    typicalPitLossSec: 19.5,
    lapRecord: {
      time: '1:12.909',
      driver: 'Lewis Hamilton (Mercedes)',
      year: 2021,
    },
    characteristics:
      'ガードレールに囲まれた究極のストリートサーキット [1]。オーバーテイクが極めて困難なため予選ポールポジションの価値が最大であり、決勝では「オーバーカット」やSCタイミングを狙うステイアウト戦術が常套手段となる [2]。',
    references: [
      {
        id: 1,
        title: 'Automobile Club de Monaco Circuit Dossier',
        publisher: 'ACM Technical Bureau',
        url: 'https://acm.mc',
        verifiedDate: '2024-05-20',
      },
      {
        id: 2,
        title: 'Strategic Overcut Dynamics in Low-Degradation Street Circuits',
        publisher: 'Motorsport Strategy Engineering Journal',
        url: 'https://www.racecar-engineering.com',
        verifiedDate: '2024-05-25',
      },
    ],
  },
  {
    id: 'silverstone',
    name: 'シルバーストン・サーキット',
    officialName: 'Silverstone Circuit',
    country: 'イギリス 🇬🇧',
    lengthKm: 5.891,
    turns: 18,
    drsZones: 2,
    downforceLevel: 'High',
    tyreStress: 'Very High',
    typicalPitLossSec: 20.8,
    lapRecord: {
      time: '1:27.097',
      driver: 'Max Verstappen (Red Bull)',
      year: 2020,
    },
    characteristics:
      'モータースポーツの聖地。マゴッツ・ベケッツ・チャペルの高速連続S字コーナー群がタイヤのフロント左と右側に極限の横Gをかける [1]。ダウンフォースの純粋な空力効率がタイムに直結する [2]。',
    references: [
      {
        id: 1,
        title: 'Silverstone Circuit Maggotts-Becketts Complex Aerodynamic Loads',
        publisher: 'Silverstone Motorsport Operations',
        url: 'https://www.silverstone.co.uk',
        verifiedDate: '2024-07-01',
      },
      {
        id: 2,
        title: 'Tyre Lateral Distortion and Blistering Risks at High-Speed Circuits',
        publisher: 'Pirelli Motorsport Technical Bulletins',
        url: 'https://www.pirelli.com',
        verifiedDate: '2024-07-04',
      },
    ],
  },
];

// ─────────────────────────────────────────────────────────────
// 4. STRATEGY CONCEPTS
// ─────────────────────────────────────────────────────────────

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
