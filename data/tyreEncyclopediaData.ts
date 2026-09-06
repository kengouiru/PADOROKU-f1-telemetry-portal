'use client';

/**
 * data/tyreEncyclopediaData.ts
 * F1 Tire Complete Encyclopedia (初心者〜玄人・技術考察・シミュレーション)
 * Pirelli F1 Compounds, Thermodynamics, Strategy & Degradation Dynamics.
 */

export interface TyreCompoundInfo {
  id: string;
  name: string;
  code: string;
  color: string;
  textColor: string;
  borderColor: string;
  tag: 'Dry' | 'Wet';
  workingRange: string;
  estimatedLaps: string;
  gripLevel: number; // 1 - 5
  durabilityLevel: number; // 1 - 5
  warmupSpeed: number; // 1 - 5
  description: string;
  idealConditions: string;
  tacticalRole: string;
  telemetrySignature: string;
}

export interface PirelliHardnessLevel {
  code: 'C1' | 'C2' | 'C3' | 'C4' | 'C5' | 'C6';
  name: string;
  hardness: '最も硬い' | '硬め' | '中間 (万能)' | '柔らかめ' | '極軟' | '超極軟 (2025新導入)';
  workingTemp: string;
  suitableCircuits: string[];
  characteristic: string;
  abrasionResistance: string;
}

export interface TyreTroubleGuide {
  id: string;
  name: string;
  englishName: string;
  icon: string;
  severity: '高 (修復不能)' | '中 (回復可能)' | '要注意';
  mechanism: string;
  causes: string[];
  telemetrySymptoms: string[];
  driverRemedy: string;
  visualDescription: string;
}

export interface TeamTyreTendency {
  teamId: string;
  teamName: string;
  tyreAggression: '優しい (低デグラ)' | '標準的' | '攻撃的 (熱入れ速いが摩耗早)';
  suspensionKinematics: string;
  frontRearBalance: string;
  summary: string;
}

// ─────────────────────────────────────────────────────────────
// 1. 5 MAJOR F1 TYRES (COLOR & COMPOUND BASICS)
// ─────────────────────────────────────────────────────────────

export const TYRE_COMPOUNDS: TyreCompoundInfo[] = [
  {
    id: 'soft',
    name: 'ソフト (Soft)',
    code: 'SOFT',
    color: '#ff2e93',
    textColor: 'text-pink-400',
    borderColor: 'border-pink-500',
    tag: 'Dry',
    workingRange: '100℃ 〜 115℃ (高作動温度帯)',
    estimatedLaps: '15 〜 25 周',
    gripLevel: 5,
    durabilityLevel: 2,
    warmupSpeed: 5,
    description: '瞬時に最大グリップを発揮する最速タイヤ。予選Q3のポールポジション争いや、レース終盤のセーフティカー明けスプリント、ファステストラップ奪取に投入される。',
    idealConditions: '短時間でタイムを出したい予選、スタートダッシュでポジションを奪いたいオープニングラップ。',
    tacticalRole: '【一撃必殺】新品アウトラップから強烈なグリップを発揮するが、オーバーヒートさせると数周で急激なグリップ低下（クリフ）に見舞われる。',
    telemetrySignature: 'ステアリング切り始めの初期レスポンスが極めて鋭敏。コーナリング最小半径が小さく、エイペックス速度が最も高い。'
  },
  {
    id: 'medium',
    name: 'ミディアム (Medium)',
    code: 'MED',
    color: '#ffd300',
    textColor: 'text-yellow-400',
    borderColor: 'border-yellow-400',
    tag: 'Dry',
    workingRange: '90℃ 〜 110℃ (中作動温度帯)',
    estimatedLaps: '25 〜 35 周',
    gripLevel: 4,
    durabilityLevel: 3.5,
    warmupSpeed: 4,
    description: '速さと耐久性が最も美しく調和した「現代F1の基準タイヤ」。レーススタート時の第1スティントとして約8割のドライバーが選択する万能コンパウンド。',
    idealConditions: 'レーススタート、路面温度が予測しにくい状況、戦略の自由度を最大に残したい第1スティント。',
    tacticalRole: '【戦略の基盤】ソフトほど垂れず、ハードほど温まりにくくない。ライバルの動きを見てピットストップ時期を柔軟に変更できる。',
    telemetrySignature: 'ラップごとのタイム変動が極めて少なく、安定したフラットなデグラデーション曲線を描く。'
  },
  {
    id: 'hard',
    name: 'ハード (Hard)',
    code: 'HARD',
    color: '#f0f0f0',
    textColor: 'text-slate-100',
    borderColor: 'border-slate-200',
    tag: 'Dry',
    workingRange: '105℃ 〜 125℃ (高負荷耐性帯)',
    estimatedLaps: '35 〜 55 周',
    gripLevel: 3,
    durabilityLevel: 5,
    warmupSpeed: 2,
    description: '極めて強靭な耐摩耗性を誇るロングラン専用タイヤ。1ストップ作戦を完遂するための絶対的支柱であり、路面温度が60℃近くまで達する過酷な真夏レースで真価を発揮する。',
    idealConditions: '真夏の超高温路面、路面研磨性が激しい高速サーキット（鈴鹿、シルバーストーン）、1回ピット完走作戦。',
    tacticalRole: '【鉄壁の防御】温まるまでに1〜2周の我慢（熱入れ）が必要だが、一度適正温度に入れば30周以上同じペースを刻み続けられる。',
    telemetrySignature: 'アウトラップの第1セクターでは摩擦係数が低く滑りやすいが、温度上昇とともにトラクションが均一に維持される。'
  },
  {
    id: 'intermediate',
    name: 'インターミディエイト (Intermediate)',
    code: 'INT',
    color: '#39b54a',
    textColor: 'text-emerald-400',
    borderColor: 'border-emerald-500',
    tag: 'Wet',
    workingRange: '70℃ 〜 95℃ (ウェット路面専用)',
    estimatedLaps: '路面状況に依存 (20〜40周)',
    gripLevel: 3.5,
    durabilityLevel: 3,
    warmupSpeed: 4,
    description: '小雨、水しぶきが上がるウェット路面、または雨が止んでレコードラインが乾き始める「ダンプ（半乾き）路面」をカバーする緑の浅溝タイヤ。時速300km/h走行時に毎秒約30〜35Lの水を排水する。',
    idealConditions: '雨雲が迫る中での濡れた路面、フルウェットから乾きゆく路面、水たまりが深くないコンディション。',
    tacticalRole: '【勝負の分かれ目】ドライタイヤとフルウェットの間の「クロスオーバーポイント（切り替え判断）」の正確さが勝敗を100%決める。',
    telemetrySignature: '乾いたラインを走り続けるとゴムが異常過熱するため、ドライバーがストレートで水たまりを探して冷やす独特の走行ラインをとる。'
  },
  {
    id: 'wet',
    name: 'フルウェット (Full Wet)',
    code: 'WET',
    color: '#00aeef',
    textColor: 'text-sky-400',
    borderColor: 'border-sky-400',
    tag: 'Wet',
    workingRange: '60℃ 〜 85℃ (豪雨路面専用)',
    estimatedLaps: '路面状況に依存',
    gripLevel: 3,
    durabilityLevel: 4,
    warmupSpeed: 4,
    description: '川のような水流や深い水たまりが存在する豪雨専用の青の深溝タイヤ。時速300km/h走行時に毎秒約85Lという驚異的な排水能力を持ち、タイヤが水膜に乗って操縦不能になる「アクアプレーニング現象」を徹底的に防止する。',
    idealConditions: '豪雨、セーフティカー先導走行、コース上に深い水たまり（スタンディングウォーター）が多数存在する状況。',
    tacticalRole: '【命を守るレインタイヤ】圧倒的な排水力を持つ反面、水量が減ると急速にオーバーヒートしてブロックがちぎれ飛ぶ。',
    telemetrySignature: '深い溝（トレッドブロック）の変形が大きいため、ドライ路面のようなクイックなステアリング入力を行うとタイヤが激しくよれる。'
  }
];

// ─────────────────────────────────────────────────────────────
// 2. PIRELLI C1 〜 C6 COMPOUND SPECTRUM (EXPERT DEEP DIVE)
// ─────────────────────────────────────────────────────────────

export const PIRELLI_COMPOUNDS: PirelliHardnessLevel[] = [
  {
    code: 'C1',
    name: 'ピレリ C1 (Hardest)',
    hardness: '最も硬い',
    workingTemp: '110℃ 〜 140℃ (超高温耐性)',
    suitableCircuits: ['鈴鹿 (日本)', 'シルバーストーン (イギリス)', 'カタール (ロサイル)', 'バルセロナ (スペイン)'],
    characteristic: '最も硬質で変形しにくいポリマー構造。鈴鹿の130Rやエス字、シルバーストーンのコプスなど、タイヤに超強大な横G（5G以上）が持続的にかかる超高負荷サーキット専用。',
    abrasionResistance: '極めて高い。研磨性の高い粗いアスファルトでも表面が削れにくい。'
  },
  {
    code: 'C2',
    name: 'ピレリ C2 (Hard)',
    hardness: '硬め',
    workingTemp: '100℃ 〜 125℃',
    suitableCircuits: ['スパ・フランコルシャン', 'バーレーン', 'オースティン (COTA)', 'ザントフォールト'],
    characteristic: '幅広い温度ウィンドウに対応できる強靭なコンパウンド。スパのオールージュ〜ケメルストレートや、路面が粗くタイヤに厳しいバーレーンなどで主戦力となる。',
    abrasionResistance: '高い。高負荷な中高速サーキットでハードまたはミディアムとして配分される。'
  },
  {
    code: 'C3',
    name: 'ピレリ C3 (Medium / Versatile)',
    hardness: '中間 (万能)',
    workingTemp: '95℃ 〜 115℃',
    suitableCircuits: ['全24サーキット中、ほぼ全てのグランプリに選出される最重要コンパウンド'],
    characteristic: 'ピレリF1レンジの中で「最も万能かつ安定したスイートスポット」を持つ。低負荷サーキットではハード、高負荷サーキットではソフトとして機能する。',
    abrasionResistance: '中程度。熱の出入りがスムーズで、エンジニアにとって最も予測しやすい基準データとなる。'
  },
  {
    code: 'C4',
    name: 'ピレリ C4 (Soft)',
    hardness: '柔らかめ',
    workingTemp: '90℃ 〜 110℃',
    suitableCircuits: ['モンツァ (イタリア)', 'レッドブル・リンク (オーストリア)', 'インテルラゴス (ブラジル)'],
    characteristic: '作動温度への立ち上がりが早く、低・中速コーナーからの脱出トラクションに優れる。ストレートが長くタイヤを冷やしやすいサーキットで抜群のグリップを提供する。',
    abrasionResistance: 'やや低め。横Gの高いロングコーナーが連続すると表面温度がスパイクしやすい。'
  },
  {
    code: 'C5',
    name: 'ピレリ C5 (Super Soft)',
    hardness: '極軟',
    workingTemp: '85℃ 〜 105℃ (低温即効型)',
    suitableCircuits: ['モナコ', 'シンガポール', 'バクー (アゼルバイジャン)', 'ラスベガス'],
    characteristic: '市街地コース専用の極軟コンパウンド。一般公道特有の滑りやすい低グリップなアスファルトに対し、ゴムが路面の微小な凹凸に深く噛み合ってメカニカルグリップを絞り出す。',
    abrasionResistance: '低い。ブレーキロックや激しいホイールスピンを起こすと一瞬でフラットスポットができる。'
  },
  {
    code: 'C6',
    name: 'ピレリ C6 (Ultra Soft / 2025 New)',
    hardness: '超極軟 (2025新導入)',
    workingTemp: '80℃ 〜 95℃ (瞬発グリップ特化)',
    suitableCircuits: ['モナコ (予選特化)', 'ラスベガス (超低温ナイトレース)', '極端にタイヤ熱が上がらないストリートコース'],
    characteristic: '2025年シーズンより導入された史上最も柔らかい新開発コンパウンド。夜間のラスベガスなど路面温度10℃前後の極寒コンディションや、モナコの予選一発アタックでタイヤウォーマー規制下でも瞬時に作動する。',
    abrasionResistance: '極めて繊細。レース距離で持たせることは想定されておらず、アウトラップ＋1フライングラップで性能を使い切る。'
  }
];

// ─────────────────────────────────────────────────────────────
// 3. TYRE TROUBLE DIAGNOSTICS (GRAINING vs BLISTERING)
// ─────────────────────────────────────────────────────────────

export const TYRE_TROUBLE_GUIDE: TyreTroubleGuide[] = [
  {
    id: 'graining',
    name: 'グレイニング (Graining / ささくれ立ち)',
    englishName: 'Surface Graining (Cold Tear)',
    icon: '🩹',
    severity: '中 (回復可能)',
    mechanism: 'タイヤ表面のゴムが低温のまま硬い状態で強大な横Gやブレーキングを受けると、ゴムが路面にしなやかに追従できずに表面が引きちぎれ、消しゴムの削りカスのような小粒となってトレッド表面に無数に付着する。',
    causes: [
      'タイヤ内部が十分に温まっていないアウトラップでの無理なプッシュ',
      '路面温度が著しく低いコンディションでの強引なコーナリング',
      'フロント荷重が抜けてマシンが外へ滑るアンダーステアの連続'
    ],
    telemetrySymptoms: [
      'ターンイン直後のステアリング舵角が徐々に大きくなる（アンダーステア）',
      'コーナー脱出速度の低下とフロントタイヤ表面温度センサーの局所的低下',
      'ドライバーの無線: 「フロントタイヤが全然入らない！氷の上を走っているようだ」'
    ],
    driverRemedy: '【クリーンアップ走行】数周ステアリング操作を丁寧に緩め、無理なスライドを避けて走ると、削りカスが熱と摩耗で削ぎ落とされ、本来のグリップが回復する。我慢のマネジメントが鍵。',
    visualDescription: 'タイヤのトレッド中央〜ショルダーにかけて、消しゴムのカスを撒き散らしたように白っぽくザラザラした帯状の荒れが発生する。'
  },
  {
    id: 'blistering',
    name: 'ブリスター (Blistering / 水ぶくれ・熱破裂)',
    englishName: 'Internal Thermal Blistering',
    icon: '💥',
    severity: '高 (修復不能)',
    mechanism: 'タイヤ内部のカーカス層（骨格）が摩擦熱と連続過負荷により超高温（130℃以上）に達し、ゴム内部の揮発成分が気化して内部から膨張。水ぶくれのように膨れ上がった箇所が限界を超えて破裂し、表面のゴムがブロックごと吹き飛ぶ。',
    causes: [
      '真夏の猛烈な路面温度下での過剰なホイールスピンと連続フルプッシュ',
      'タイヤ空気圧（内圧）設定のズレや、キャンバー角・トー角による局所的過熱',
      '他車の直後を走り続け、乱気流（ダーティエア）でダウンフォースが抜けて滑る状態'
    ],
    telemetrySymptoms: [
      'リアタイヤのカーカス温度センサーがレッドゾーン（135℃超）を警告',
      'ストレートエンドでホイール回転速度の微振動（バイブレーション）を検知',
      'ドライバーの無線: 「リアが突然死んだ！トラクションが一切かからない！」'
    ],
    driverRemedy: '【即時ピットインが必要】一度ブリスターでゴムが吹き飛ぶと二度と自己修復しない。破裂箇所が広がるとタイヤバースト（破裂パンク）につながるため、即座にピットストップして新品タイヤへ交換する。',
    visualDescription: 'トレッド面にクレーターのような黒い穴や溝がえぐり取られ、下層のベルト構造が露出しそうになる。'
  }
];

// ─────────────────────────────────────────────────────────────
// 4. UNDERCUT VS OVERCUT STRATEGY MECHANICS
// ─────────────────────────────────────────────────────────────

export interface StrategyConceptDetail {
  id: string;
  name: string;
  badge: string;
  color: string;
  coreRule: string;
  deltaMechanism: string;
  successConditions: string[];
  failureRisks: string[];
  famousExample: string;
}

export const STRATEGY_CONCEPTS: StrategyConceptDetail[] = [
  {
    id: 'undercut',
    name: 'アンダーカット (The Undercut)',
    badge: '先行ピット強襲',
    color: '#38bdf8',
    coreRule: 'ライバルよりも「1〜2周早くピットイン」して新品タイヤを履き、爆発的なアウトラップの速さで相手がピットインした周に逆転する奇襲戦術。',
    deltaMechanism: '【新品タイヤのアウトラップ】 vs 【摩耗した古タイヤのインラップ】。新品タイヤが1周あたり1.5秒速ければ、相手が翌周ピットストップを終えて出てくる間にその差（デルタ）を逆転できる。',
    successConditions: [
      'サーキットのタイヤデグラデーション（劣化率）が大きいこと',
      'ピットアウト直後に前方の遅い車（トラフィック）に引っかからないこと',
      'ピットストップ作業時間が2.3秒前後のノーミスで完了すること',
      '新品タイヤのアウトラップでタイヤを1周目から適正作動域に入れられること'
    ],
    failureRisks: [
      'ピットアウト直後に他車の後ろ（DRSトレイン）に詰まると即失敗',
      '相手がセーフティカー（SC/VSC）の恩恵を受けてピットロスタイムを半減させた場合'
    ],
    famousExample: '2021年フランスGP: フェルスタッペンがハミルトンに対してアンダーカットを仕掛け、アウトラップで驚異的なセクタータイムを叩き出して首位を奪取。'
  },
  {
    id: 'overcut',
    name: 'オーバーカット (The Overcut)',
    badge: '逆張りステイアウト',
    color: '#fb923c',
    coreRule: 'ライバルがピットインした隙に、あえてコース上に留まり（ステイアウト）、クリアエア（前方に車がいない綺麗な空気）の中で限界までプッシュして逆転する戦術。',
    deltaMechanism: '【クリアエアで前が空いた古タイヤのフルアタック】 vs 【アウトラップでタイヤの熱入れに苦しむ相手の低ペース】。相手が冷えた新品タイヤで温まるまでの1〜2周の隙を突く。',
    successConditions: [
      'タイヤのデグラデーションが極めて少なく、古タイヤでもペースが落ちないこと',
      '新品タイヤが冷えていて温まりにくい（ウォームアップに2周以上かかる）環境',
      'コースが狭くオーバーテイクが不可能なサーキット（モナコなど）',
      '前方の車がピットに入ったことで、前が完全に開けて全開走行できること'
    ],
    failureRisks: [
      '予想以上に古タイヤのグリップが崖（クリフ）を迎えてペースが急落すること',
      '自車のピットイン時にピット作業トラブルが発生すること'
    ],
    famousExample: '2021年モナコGP: セルジオ・ペレスがステイアウトを選択。前が空いたモナコで鬼気迫るファステスト連発を叩き出し、ハミルトンとガスリーの2台を一気にオーバーカット。'
  }
];

// ─────────────────────────────────────────────────────────────
// 5. TEAM TYRE AGGRESSION & KINEMATICS (2025 EDITION)
// ─────────────────────────────────────────────────────────────

export const TEAM_TYRE_TENDENCIES: TeamTyreTendency[] = [
  {
    teamId: 'mclaren',
    teamName: 'McLaren',
    tyreAggression: '優しい (低デグラ)',
    suspensionKinematics: 'プルロッドフロント＆高剛性リアフロアシール',
    frontRearBalance: 'リアタイヤ表面温度の均一化に秀でる',
    summary: '2024〜2025年グリッドで最もタイヤデグラデーションが低いマシンの筆頭。スティント終盤でもタイヤ表面温度が上がらず、ノリスとピアストリが終盤にベストラップを連発できる最大の強み。'
  },
  {
    teamId: 'red-bull',
    teamName: 'Red Bull Racing',
    tyreAggression: '標準的',
    suspensionKinematics: '極端なアンチダイブ＆プルロッド幾何構造',
    frontRearBalance: 'フロントの鋭敏さとリアトラクションのバランス',
    summary: 'フェルスタッペンの繊細なステアリング入力と相まってタイヤの温存能力は超一流。ただし2024年後半以降、バランスのピーキーさから一部サーキットで熱ダレに苦しむ場面も。'
  },
  {
    teamId: 'ferrari',
    teamName: 'Scuderia Ferrari',
    tyreAggression: '標準的',
    suspensionKinematics: 'プッシュロッドフロント＆リア冷却流路の最適化',
    frontRearBalance: '低速トラクション重視だがリアのオーバーヒートを大幅改善',
    summary: 'かつて「タイヤを最も早く摩耗させる」と言われた弱点を2024〜2025年で劇的に克服。ルクレールとハミルトンのタイヤマネジメント能力により、1ストップ作戦の完遂率が格段に向上。'
  },
  {
    teamId: 'mercedes',
    teamName: 'Mercedes-AMG',
    tyreAggression: '攻撃的 (熱入れ速いが摩耗早)',
    suspensionKinematics: '高レートフロントサスペンション＆熱入れ重視',
    frontRearBalance: 'フロントタイヤの熱入れに波があり、路面温度の影響を受けやすい',
    summary: '路面温度が低い雨や涼しい天候では他車より圧倒的に早くタイヤを作動温度域に持ち込めるが、猛暑のロングランでは表面温度が上がりやすくマネジメントに神経を使う。'
  },
  {
    teamId: 'haas',
    teamName: 'Haas F1 Team',
    tyreAggression: '標準的',
    suspensionKinematics: '小松代表主導によるリアサスペンション幾何と空力統合',
    frontRearBalance: '予選一発重視からロングランでのリアタイヤ保護へ転換',
    summary: '長年ハースの致命的弱点だった「決勝でタイヤが溶ける」問題を完全解決。2024〜2025年はロングランペースが安定し、中団グループでの入賞常連へ進化を遂げた。'
  }
];

// ─────────────────────────────────────────────────────────────
// 6. TYRE CROSS-SECTION ANATOMY (タイヤ断面図解剖)
// ─────────────────────────────────────────────────────────────

export interface TyreCrossSectionLayer {
  id: string;
  name: string;
  englishName: string;
  role: string;
  material: string;
  thicknessOrSpec: string;
  engineeringFact: string;
  color: string;
}

export const TYRE_CROSS_SECTION_LAYERS: TyreCrossSectionLayer[] = [
  {
    id: 'tread',
    name: 'トレッドゴム層 (Tread Compound)',
    englishName: 'Tread Layer',
    role: '路面と直接接地し、強大なメカニカルグリップとトラクションを生み出す最外層ゴム。',
    material: '天然ゴム＋合成ポリマー＋高分散シリカ＋カーボンブラック',
    thicknessOrSpec: '新品時厚み 約5mm（摩耗限度 約1.5mm）',
    engineeringFact: 'わずか5mmのゴム層が時速350km/hと5Gを超えるコーナリング負荷を支える。摩耗して薄くなるとゴムの熱容量が減り、オーバーヒートしやすくなる。',
    color: '#ff2e93',
  },
  {
    id: 'belt',
    name: '補強ベルト層 (Crown Belt)',
    englishName: 'Steel & Aramid Belt',
    role: 'トレッドの直下に配置され、遠心力によるタイヤの変形・膨張を抑え込む超剛性帯。',
    material: '高張力スチールコード ＋ アラミド（ケブラー）複合繊維',
    thicknessOrSpec: '2〜3層の交差クロス構造',
    engineeringFact: '時速350km/h走行時、タイヤ外周には1トンを超える猛烈な遠心力が発生する。ベルト層がなければタイヤは風船のように膨らんで破裂する。',
    color: '#f59e0b',
  },
  {
    id: 'carcass',
    name: 'カーカス骨格層 (Carcass Plies)',
    englishName: 'Structural Carcass',
    role: 'タイヤの「骨組み」。内部の高圧窒素ガスを密閉保持し、車重と空力ダウンフォース（最大3トン）を支える。',
    material: '高強度耐熱レーヨンコード ＋ 高弾性ポリエステル',
    thicknessOrSpec: 'ラジアル構造（放射状配置）',
    engineeringFact: 'コーナリング中、カーカスは激しくねじれ変形しながら路面追従性を確保する。2022年以降の18インチ化に伴い、サイドウォールが低くなり剛性が格段に向上。',
    color: '#38bdf8',
  },
  {
    id: 'sidewall',
    name: 'サイドウォール (Sidewall)',
    englishName: 'Sidewall Deflection Zone',
    role: 'タイヤの側面。縁石（ケルブ）への激突時の衝撃吸収と、操舵に対する横方向のダンパーの役割を担う。',
    material: '耐疲労性・屈曲性に優れた特殊合成ゴム',
    thicknessOrSpec: '低偏平率プロファイル (18インチホイール規格)',
    engineeringFact: 'F1マシンには一般的な乗用車のような油圧ダンパーだけでなく、タイヤ自体のたわみ（サイドウォールのばね特性）が第2のサスペンションとして機能している。',
    color: '#10b981',
  },
  {
    id: 'bead',
    name: 'ビード部 (Bead Wire & Core)',
    englishName: 'Bead Ring & Apex',
    role: 'タイヤをマグネシウムホイールのリムに超強固に密着・固定し、エア漏れと空転（リムスリップ）を完全に防ぐ。',
    material: '超高張力スチールワイヤーリング ＋ 高硬度ハードラバーエイペックス',
    thicknessOrSpec: 'ホイール内径18インチ完全嵌合',
    engineeringFact: '1,000馬力の急加速時、ホイールだけが空転してタイヤが置いていかれないよう、リムとビードは極めて高い摩擦力で密着している。',
    color: '#a855f7',
  },
  {
    id: 'gas',
    name: '充填ガス (高純度ドライ窒素)',
    englishName: 'Dry Nitrogen Fill',
    role: 'タイヤ内部を満たす気体。通常の空気ではなく水分ゼロの乾燥窒素を使用。',
    material: '高純度99.9% 窒素ガス (水分・湿気完全除去)',
    thicknessOrSpec: '内圧: フロント 約22〜24 psi / リア 約20〜22 psi',
    engineeringFact: '通常の空気を使うと含まれる水分（水蒸気）が100℃で激しく気化し、走行中に内圧が乱高下してしまう。ドライ窒素なら熱膨張率が完全に予測可能。',
    color: '#06b6d4',
  },
];

// ─────────────────────────────────────────────────────────────
// 7. PIT STOP ANATOMY & THE 22-SECOND PIT LOSS
// ─────────────────────────────────────────────────────────────

export interface PitStopBreakdown {
  stage: string;
  timeSeconds: number;
  speed: string;
  description: string;
  icon: string;
}

export const PIT_STOP_BREAKDOWN: PitStopBreakdown[] = [
  {
    stage: 'ピットレーン進入＆減速',
    timeSeconds: 2.0,
    speed: '320km/h ➔ 60 or 80km/h',
    description: '本コースからピットエントリーラインへダイブ。ピットリミッターを作動させ、急減速して制限速度ピッタリに合わせる。',
    icon: '⚡',
  },
  {
    stage: 'ピットレーン制限速度走行',
    timeSeconds: 17.5,
    speed: '60km/h (市街地) または 80km/h (常設)',
    description: '約300〜400mのピットロードを低速走行。コース上のライバルは時速300km/h超で駆け抜けているため、ここで約17秒以上の莫大な差（ピットロス）が生まれる。',
    icon: '⏳',
  },
  {
    stage: '静止タイヤ交換作業',
    timeSeconds: 2.1,
    speed: '0 km/h (完全静止)',
    description: '約20名のクルーが4輪の脱着、ジャッキアップ・ダウンを電光石火で完遂。世界記録はマクラーレンの驚異の1.80秒。',
    icon: '🔧',
  },
  {
    stage: 'ピットアウト加速＆コース合流',
    timeSeconds: 2.0,
    speed: '60/80km/h ➔ 300km/h+',
    description: 'ピット出口の白線を跨がないよう注意しながら全開加速。冷えた新品タイヤでコース上のレーススピードへ復帰。',
    icon: '🚀',
  },
];

export const PIT_STOP_FACTS = {
  worldRecord: {
    team: 'McLaren F1 Team',
    time: '1.80 秒',
    grandPrix: '2023年 カタールGP (ランド・ノリス)',
    note: '従来のレッドブル（1.82秒 @ 2019ブラジル）を0.02秒更新した人類史上最速の静止タイヤ交換。',
  },
  averageGreenPitLoss: '約 21 〜 24 秒 (サーキットのピットレーン長による)',
  cheapPitLossSC: '約 9 〜 12 秒 (セーフティカー / VSC中)',
  cheapPitExplanation:
    'セーフティカー中、本コース上のマシンは速度制限（約40%ペースダウン）を受けて周回しています。しかしピットレーン内の制限速度（60/80km/h）は平常時と同じため、ピットインに伴う相対的なタイムロスが約半減（約11秒お得）します。これを通称「チープ・ピットストップ（激安ピット）」と呼びます。',
  crewCount: '約 20 〜 22 名',
  crewBreakdown: [
    'ガンマン 4名 (超高速エアインパクトレンチでセンターロックナットを0.3秒で脱着)',
    'タイヤオフ 4名 (摩耗した古タイヤを横へ引き抜く)',
    'タイヤオン 4名 (約12kgの新品タイヤをミリ単位でシャフトに差し込む)',
    'フロントジャッキ 2名 (メインジャッキ＋緊急バックアップ)',
    'リアジャッキ 2名 (リアディフューザー下から持ち上げる)',
    'サイドスタビライザー 2名 (交換中のマシンの横揺れを抑える)',
    'ピットシグナルマン 1名 (電子シグナルで後方安全確認・発進GOサイン)',
    'フロントウィング調整 2名 (必要に応じてフラップ角度をレンチで修正)',
  ],
};

// ─────────────────────────────────────────────────────────────
// 8. LAYER 2: INTERMEDIATE STRATEGY DATA (中級者向け戦略)
// ─────────────────────────────────────────────────────────────

export interface WarmupPhase {
  title: string;
  action: string;
  reason: string;
  risk: string;
}

export const TYRE_WARMUP_GUIDE = {
  overview: '現代F1ではタイヤウォーマーの上限温度が従来の100℃から「70℃」へと厳格化され、アウトラップ（ピットアウト直後の1周）での熱入れ技術が勝敗を直接分ける死活問題となりました。',
  phases: [
    {
      title: '1. ブレーキ熱のホイール伝播',
      action: 'ストレートや減速時にハードブレーキングを繰り返し、カーボンブレーキディスク（800℃超）の熱をマグネシウムホイール経由でタイヤ内部（カーカス）へ伝える。',
      reason: 'ゴム表面だけ擦っても内部が冷たいと即座にグレイニングが発生する。内部骨格から温めることが絶対条件。',
      risk: 'ブレーキバランスを前後に振りすぎてブレーキロックやフラットスポットを作る危険。',
    },
    {
      title: '2. ウィービング（ジグザグ蛇行）',
      action: '安全なストレートで左右に素早くマシンを振る。',
      reason: 'タイヤトレッドの表面ゴムにしなやかな剪断（せんだん）変形を与え、表面温度を急激に上昇させる。',
      risk: '過度に行うと表面だけが110℃になり、アタック1周目の最終セクターでオーバーヒートを迎える。',
    },
    {
      title: '3. アウトラップ最終コーナーの「ラストチャージ」',
      action: '最終コーナー手前で速度を落として前走車と十分な車間（3〜4秒）を空け、エイペックスからフルスロットルで第1コーナーへ飛び込む。',
      reason: 'リアタイヤに強大なトラクション負荷をかけ、リアの作動温度（105℃）を完璧に揃えてスタートラインを越える。',
      risk: '後ろから迫るアタック中のマシンに追突されるトラフィックトラブル。',
    },
  ],
};

export const TYRE_CLIFF_GUIDE = {
  title: 'タイヤの「崖」（ザ・クリフ）のメカニズムと予兆',
  description:
    'ゴムが摩耗して薄くなると、ゴム自体が持っていた熱を蓄える能力（熱容量）が低下します。これによりタイヤ表面の温度が暴走し、ある特定の1周でグリップが崖から落ちるように急激に消失（1周で2〜3秒ドロップ）します。',
  symptoms: [
    {
      sign: 'ステアリング舵角の異常な肥大化',
      detail: '前周と同じコーナー速度を維持するために、ドライバーは20%以上ステアリングを深く切り込む必要が生じる（重度のアンダーステア）。',
    },
    {
      sign: 'テレメトリーのスロットル開度遅延',
      detail: 'コーナー脱出時にリアタイヤが滑り出し、100%フルスロットルに踏み込める地点がコーナー出口より30m以上後退する。',
    },
    {
      sign: '急激なストレートエンド最高速の低下',
      detail: '前のコーナー脱出速度（エイペックス速度）が落ちるため、続くストレートエンドでの最高速度が時速5〜8km/hも落ちる。',
    },
  ],
};

export const TRACK_TEMP_STRATEGY = {
  title: '気温・路面温度とタイヤ選択：デイ vs ナイトレース',
  dayRaces: {
    title: '☀️ デイレース（真夏・炎天下）',
    examples: ['ハンガリー (ハンガロリンク)', 'オーストリア (レッドブル・リンク)', 'スペイン (バルセロナ)'],
    trackTemp: '路面温度 45℃ 〜 60℃',
    dynamics: '太陽光の直射熱によりアスファルト自体が超高温。タイヤ表面が熱せられ続けるため「オーバーヒート」と「リアタイヤの熱ダレ」が最大の敵。ハードタイヤ（C1/C2）が戦略の中心となる。',
  },
  nightRaces: {
    title: '🌙 ナイトレース（夕暮れ〜夜間）',
    examples: ['バーレーン (サヒール)', 'シンガポール (マリーナベイ)', 'ラスベガス (ストリップ)'],
    trackTemp: '路面温度 15℃ 〜 28℃ (レース進行とともに急低下)',
    dynamics: '日没とともに路面温度が毎周0.5℃ずつ下がり続ける特異な環境。タイヤに熱が入りにくく、走行風で冷えるため「ソフトやミディアムが長持ちする」逆転現象が発生。ピット時期を遅らせるオーバーカットが有効になる。',
  },
};

export const SAFETY_CAR_DECISION_MATRIX = {
  title: 'セーフティカー（SC/VSC）中 ピットイン判断マトリクス',
  description:
    'SCが導入された瞬間、ピットウォールのストラテジストは5秒以内に「BOX（ピットイン）」か「STAY OUT（ステイ）」かを下さなければなりません。',
  rules: [
    {
      scenario: '残り周回が15周以上 ＆ 古タイヤが20周以上経過',
      action: '即時ピットイン (BOX NOW)',
      reason: 'SC中のピットロスは通常（22秒）の約半分（約11秒）。再開後に新品ソフト/ミディアムを履いていれば、1周あたり1.5秒速いペースでコース上のステイ組を容易にゴボウ抜きできる。',
    },
    {
      scenario: 'トップ快走中 ＆ 2位との差が10秒未満 ＆ 追い抜き不能サーキット (モナコ等)',
      action: 'ステイアウト (STAY OUT)',
      reason: 'ピットに入ると確実に2位のマシンに首位（トラックポジション）を明け渡す。モナコやハンガリーではタイヤ差があってもオーバーテイクが極めて困難なため、コース上の順位を死守する方が勝率が高い。',
    },
    {
      scenario: '残り周回が5周未満',
      action: 'ステイアウト推奨 (博打ピットのみ)',
      reason: 'SC解除後の周回数が少なすぎると、新品タイヤの速さがあっても順位を取り戻す時間が足りない。前が崩れるのを待つ方が堅実。',
    },
  ],
};

// ─────────────────────────────────────────────────────────────
// 9. LAYER 3: EXPERT DATA & HISTORIC DRAMAS (玄人向けデータ＆歴史)
// ─────────────────────────────────────────────────────────────

export interface DriverTyreStyle {
  driver: string;
  team: string;
  styleCategory: '超温存・省エネ型' | 'フロント鋭敏・精密微修正型' | 'リア温度コントロール型' | 'アグレッシブ・短期決戦型';
  technique: string;
  secret: string;
}

export const DRIVER_TYRE_STYLES: DriverTyreStyle[] = [
  {
    driver: 'マックス・フェルスタッペン',
    team: 'Red Bull Racing',
    styleCategory: 'フロント鋭敏・精密微修正型',
    technique: 'ステアリング切り始めの無駄な舵角（舵角の当てすぎ）がグリッド上で最も少ない。フロントタイヤに一瞬で荷重を乗せ、最小限のスライドで旋回を終える。',
    secret: 'リアが少しでも流れる（オーバーステア）のを極めて細やかなステアリング微修正で瞬時に受け止めるため、タイヤ表面の摩擦発熱が最小限に抑えられる。',
  },
  {
    driver: 'ルイス・ハミルトン',
    team: 'Scuderia Ferrari (元Mercedes)',
    styleCategory: 'リア温度コントロール型',
    technique: 'コーナー脱出時のスロットルコントロールが極めてシルキー。ホイールスピンを電子制御並みに人間の足技で防ぎ、リアタイヤの内圧・表面温度を完璧に管理する。',
    secret: '「タイヤがもう死んだ（My tyres are gone）」と無線で訴えた直後に平気でファステストラップを連発する伝説のタイヤマネジメント能力。',
  },
  {
    driver: 'ランド・ノリス',
    team: 'McLaren',
    styleCategory: '超温存・省エネ型',
    technique: 'マクラーレンの低デグラ特性を最大限に活かし、スティント序盤に無理なプッシュをせずタイヤを「育てる」走法。',
    secret: 'レース終盤、他車がクリフを迎えてペースダウンする中で、予選並みのタイムをスティント35周目以降に叩き出す終盤スプリントの鬼。',
  },
  {
    driver: 'セルジオ・ペレス',
    team: 'Red Bull Racing',
    styleCategory: '超温存・省エネ型',
    technique: '元祖「タイヤ・ウィスパー（タイヤと対話する男）」。縁石を舐めるようなスムーズな荷重移動と滑らかなブレーキングで、他車が2ストップのレースを1ストップで完走する。',
    secret: 'フロントタイヤに無理な横Gを残したままブレーキを踏まない「トレイルブレーキングの極致」。',
  },
];

export interface HistoricTyreDrama {
  id: string;
  year: number;
  grandPrix: string;
  title: string;
  hero: string;
  outcome: string;
  summary: string;
  engineeringLesson: string;
}

export const HISTORIC_TYRE_DRAMAS: HistoricTyreDrama[] = [
  {
    id: 'turkey-2020',
    year: 2020,
    grandPrix: 'トルコGP (イスタンブール・パーク)',
    title: 'ハミルトン「溝のないインターミディエイト」奇跡の7度目王者',
    hero: 'ルイス・ハミルトン',
    outcome: '6番グリッドから大逆転優勝 ＆ 7度目のワールドチャンピオン獲得',
    summary: '再舗装されたばかりのツルツルの路面に冷たい雨が降る極限のサバイバル。他車が新品インターに交換して熱入れできずに滑る中、ハミルトンは50周以上同じインターミディエイトでステイアウト。すり減って溝が完全に消え「擬似スリックタイヤ」となったタイヤで乾きゆく路面を激走し、歴史的勝利を飾った。',
    engineeringLesson: '雨が止んで路面が乾き始めた際、新品インターはブロックのヨレで熱ダレするが、すり減ったインターはブロックが寝ず、スリックのように機能する（通称「インター・スリック」現象）。',
  },
  {
    id: 'indy-2005',
    year: 2005,
    grandPrix: 'アメリカGP (インディアナポリス)',
    title: 'ミシュランタイヤ崩壊：わずか6台でスタートした史上最大の悪夢',
    hero: 'ミハエル・シューマッハ (Ferrari)',
    outcome: 'ブリヂストン勢6台のみが決勝出走、ミシュラン勢14台がフォーメーションラップで全車ピット棄権',
    summary: '高速インディアナポリスのすり鉢状バンク（ターン13）で、ミシュランタイヤを履くラルフ・シューマッハらが高速バースト事故を起こす。調査の結果、バンクの特殊なダイヤモンド研磨路面と強大な垂直Gにミシュランのサイドウォールが耐えられないことが判明。安全を保証できないとして、ミシュランユーザー全7チーム（ルノー、マクラーレン等）がフォーメーションラップ終了と同時に一斉にピットインして棄権した。',
    engineeringLesson: 'サーキット舗装の特殊性（バンク角と研磨溝）とタイヤ構造設計の安全マージンの極限を痛感させた事件。現在の単一タイヤサプライヤー制（ピレリ独占）へ移行する大きな契機となった。',
  },
  {
    id: 'silverstone-2013',
    year: 2013,
    grandPrix: 'イギリスGP (シルバーストーン)',
    title: 'シルバーストーン連続爆裂：時速300km/hの左リアタイヤ連続パンク事件',
    hero: 'ニコ・ロズベルグ (Mercedes)',
    outcome: 'ピレリが緊急で2012年型ケブラーベルト構造へ設計変更',
    summary: 'ハミルトン、マッサ、ベルニュ、ペレスらトップドライバーの左リアタイヤが、300km/hを超える超高速コーナー走行中に次々と大爆発（デラミネーション）。サーキット全体に破片が飛び散り、赤旗寸前のパニックに。原因は各チームがタイヤのキャンバー角を攻めすぎたことと、なんと「左右非対称タイヤをあえて逆左右（左用を右へ、右用を左へ）に装着していた」という禁断の裏技だった。',
    engineeringLesson: 'チームの過激なセットアップ（極端な低内圧と逆履き）に対し、FIAとピレリが「推奨内圧・最大キャンバー角の遵守義務化」という厳格な技術指令（TD）を出すきっかけとなった。',
  },
];
