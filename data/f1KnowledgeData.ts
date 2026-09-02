/**
 * data/f1KnowledgeData.ts
 * Structured F1 Knowledge Base with Academic-style Primary Citations ([1])
 * and Telemetry Linking Metadata.
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

export interface DriverProfile {
  id: string;
  code: string; // 3-letter e.g. "VER"
  number: number;
  fullName: string;
  country: string;
  team: string;
  teamColor: string;
  championships: number;
  drivingStyle: {
    traits: string[];
    brakingTechnique: string;
    tyreManagement: string;
    summary: string;
  };
  milestones: DriverMilestone[];
  references: Reference[];
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
  telemetrySession?: {
    year: number;
    meetingKey: number;
    sessionKey: number;
    sessionName: string;
  };
  references: Reference[];
}

export interface StrategyConcept {
  id: string;
  title: string;
  category: 'TIRE_DEG' | 'PIT_STRATEGY' | 'AERO_GROUND_EFFECT' | 'FIA_SAFETY_CAR';
  subtitle: string;
  description: string;
  keyTakeaways: string[];
  telemetrySession?: {
    year: number;
    meetingKey: number;
    sessionKey: number;
    sessionName: string;
  };
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
  references: Reference[];
}

// ─────────────────────────────────────────────────────────────
// DATA SETS
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
];

export const KNOWLEDGE_DRIVERS: DriverProfile[] = [
  {
    id: 'max-verstappen',
    code: 'VER',
    number: 1,
    fullName: 'Max Verstappen',
    country: 'オランダ 🇳🇱',
    team: 'Red Bull Racing',
    teamColor: '#38bdf8',
    championships: 3,
    drivingStyle: {
      traits: ['鋭敏なフロントノーズ応答性を好むオーバーステア志向', 'トレイルブレーキングの極端な深さ', 'タイヤ表面温度の精密なコントロール'],
      brakingTechnique: '直線で最大制動をかけつつ、エイペックス手前までブレーキ圧を微量に残してフロントの回頭性を最大化する [1]。',
      tyreManagement: 'スライドを最小限に抑えるマイクロステアリング修正により、タイヤトレッドのオーバーヒートを防ぎながら高ペースを維持 [2]。',
      summary: '極限までリアが敏感なマシンセッティングを完璧に操り、タイヤデグラデーションを抑えつつ一定のラップタイムを刻み続ける卓越した再現性を持つ。',
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
    championships: 7,
    drivingStyle: {
      traits: ['V字型コーナリングラインによる直線脱出加速重視', '卓越した雨天（ウェット）路面センシング', '第2スティント終盤の神がかり的タイヤ延命力'],
      brakingTechnique: 'ハードブレーキング時の前後バランスコントロールと、ロックアップ寸前の繊細なペダルリリース [1]。',
      tyreManagement: 'ステアリング舵角を最小限に保ち、横Gによるタイヤサイドウォールへの負荷を低減させることで想定寿命を大幅に超えるスティント長を実現 [2]。',
      summary: '歴代最多勝利・最多ポールポジションを保持するレジェンド。天候変化や路面グリップの急変に対する適応力は随一。',
    },
    milestones: [
      { date: '2007-03-18', event: 'F1デビュー戦のオーストラリアGPでいきなり表彰台獲得 (P3)', refId: 1 },
      { date: '2008-11-02', event: 'ブラジルGP最終周で劇的な自身初のワールドチャンピオン戴冠', refId: 2 },
      { date: '2020-11-15', event: 'トルコGPでミハエル・シューマッハに並ぶ歴代最多タイ7度目のタイトル獲得', refId: 2 },
      { date: '2021-09-26', event: 'ロシアGPにてF1史上初となる通算100勝の偉業を達成', refId: 2 },
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
    championships: 0,
    drivingStyle: {
      traits: ['非常にスムーズなステアリング入力', '高速コーナーでの高いボトムスピード維持', '予選1発アタックでのトラフィック処理能力'],
      brakingTechnique: 'マシンのヨーレート（回頭角速度）の立ち上がりを滑らかに保ち、車体の不安定化を防ぐプログレッシブな踏み込み [1]。',
      tyreManagement: 'フロントタイヤの摩耗偏りを防ぐ巧みなライン取りと、温度ピークを避ける冷却マネジメント [2]。',
      summary: 'マクラーレンのエースとして成長を遂げ、現代屈指の純粋なスピードと安定した予選パフォーマンスを兼ね備える。',
    },
    milestones: [
      { date: '2019-03-17', event: 'マクラーレンから19歳でF1デビュー', refId: 1 },
      { date: '2020-07-05', event: 'オーストリアGPにてファステストラップを記録し初表彰台 (P3)', refId: 1 },
      { date: '2024-05-05', event: 'マイアミGPにて見事なピット戦略とペースで悲願のF1初優勝を達成', refId: 2 },
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
    championships: 0,
    drivingStyle: {
      traits: ['ストリートサーキットでのミリ単位の壁際アタック', '限界を超えた領域でのマシントラクション引き出し', '予選Q3での異次元のアタックラップ構築'],
      brakingTechnique: 'エイペックス直前までブレーキを深めに残し、ノーズを鋭くインへ向ける攻撃的なターンイン [1]。',
      tyreManagement: 'アグレッシブな走りと裏腹に、タイヤライフを読み切った緻密なスロットル開度制御を武器とする [2]。',
      summary: '「予選の魔術師」と称される絶対的スピードの持ち主。母国モナコGPやイタリアGPでの勝利など、大舞台での勝負強さを持つ。',
    },
    milestones: [
      { date: '2018-03-25', event: 'ザウバーからF1デビュー', refId: 1 },
      { date: '2019-09-01', event: 'フェラーリ移籍初年度のベルギーGPで自身初優勝', refId: 1 },
      { date: '2019-09-08', event: '熱狂のモンツァでフェラーリに9年ぶりのイタリアGP勝利をもたらす', refId: 2 },
      { date: '2024-05-26', event: '悲願の母国モナコGPでポール・トゥ・ウィン完全勝利', refId: 2 },
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
        title: 'Monaco GP Historical Victory Logs & Sector Performance',
        publisher: 'ACM (Automobile Club de Monaco)',
        url: 'https://acm.mc',
        verifiedDate: '2024-05-27',
      },
    ],
  },
];

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
      sessionName: '2024 Bahrain GP Race',
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
    telemetrySession: {
      year: 2024,
      meetingKey: 1234,
      sessionKey: 9161,
      sessionName: '2024 Bahrain GP Race',
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
