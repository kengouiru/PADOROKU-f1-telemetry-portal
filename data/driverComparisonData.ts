/**
 * data/driverComparisonData.ts
 * Driving style ratings (6-axis radar), career highlights, teammate head-to-head battles,
 * and rivalry linkages for the Driver Comparison Tool.
 */

export interface DriverSkills {
  qualifying: number;      // 予選一発 (0-100)
  racePace: number;        // レースペース (0-100)
  tyreManagement: number;  // タイヤ保全 (0-100)
  wetWeather: number;      // 雨天適性 (0-100)
  overtaking: number;      // バトル・仕掛け (0-100)
  consistency: number;     // 安定感 (0-100)
}

export interface TeammateHeadToHead {
  driver1Code: string;
  driver2Code: string;
  teamName: string;
  years: string;
  racesCount: number;
  qualiScore: [number, number];   // [Driver1 wins, Driver2 wins]
  raceScore: [number, number];    // [Driver1 ahead, Driver2 ahead]
  pointsScore?: [number, number]; // [Driver1 points, Driver2 points]
  summary: string;
}

export const DRIVER_SKILL_RATINGS: Record<string, DriverSkills> = {
  VER: { qualifying: 97, racePace: 99, tyreManagement: 95, wetWeather: 98, overtaking: 96, consistency: 95 },
  HAM: { qualifying: 96, racePace: 96, tyreManagement: 98, wetWeather: 97, overtaking: 94, consistency: 96 },
  NOR: { qualifying: 95, racePace: 94, tyreManagement: 92, wetWeather: 88, overtaking: 91, consistency: 90 },
  LEC: { qualifying: 99, racePace: 93, tyreManagement: 89, wetWeather: 90, overtaking: 94, consistency: 87 },
  SAI: { qualifying: 91, racePace: 92, tyreManagement: 93, wetWeather: 89, overtaking: 90, consistency: 93 },
  RUS: { qualifying: 95, racePace: 92, tyreManagement: 90, wetWeather: 91, overtaking: 89, consistency: 91 },
  PIA: { qualifying: 93, racePace: 92, tyreManagement: 88, wetWeather: 89, overtaking: 93, consistency: 94 },
  ALO: { qualifying: 92, racePace: 96, tyreManagement: 96, wetWeather: 96, overtaking: 97, consistency: 95 },
  TSU: { qualifying: 89, racePace: 87, tyreManagement: 86, wetWeather: 88, overtaking: 90, consistency: 85 },
  LAW: { qualifying: 87, racePace: 88, tyreManagement: 86, wetWeather: 89, overtaking: 90, consistency: 86 },
  PER: { qualifying: 85, racePace: 88, tyreManagement: 94, wetWeather: 86, overtaking: 88, consistency: 84 },
  GAS: { qualifying: 89, racePace: 88, tyreManagement: 87, wetWeather: 91, overtaking: 88, consistency: 87 },
  OCO: { qualifying: 88, racePace: 87, tyreManagement: 88, wetWeather: 92, overtaking: 89, consistency: 86 },
  ALB: { qualifying: 90, racePace: 89, tyreManagement: 91, wetWeather: 87, overtaking: 89, consistency: 88 },
  HUL: { qualifying: 92, racePace: 88, tyreManagement: 87, wetWeather: 89, overtaking: 87, consistency: 90 },
  BOT: { qualifying: 92, racePace: 86, tyreManagement: 88, wetWeather: 82, overtaking: 81, consistency: 89 },
  RIC: { qualifying: 88, racePace: 89, tyreManagement: 87, wetWeather: 88, overtaking: 95, consistency: 86 },
  STR: { qualifying: 82, racePace: 84, tyreManagement: 86, wetWeather: 91, overtaking: 84, consistency: 81 },
  ZHO: { qualifying: 82, racePace: 82, tyreManagement: 85, wetWeather: 83, overtaking: 83, consistency: 88 },
  BEA: { qualifying: 87, racePace: 87, tyreManagement: 85, wetWeather: 85, overtaking: 88, consistency: 86 },
  COL: { qualifying: 86, racePace: 86, tyreManagement: 83, wetWeather: 82, overtaking: 87, consistency: 83 },
  ANT: { qualifying: 90, racePace: 88, tyreManagement: 85, wetWeather: 86, overtaking: 89, consistency: 84 },
  BOR: { qualifying: 86, racePace: 86, tyreManagement: 84, wetWeather: 84, overtaking: 86, consistency: 85 },
  DOO: { qualifying: 85, racePace: 85, tyreManagement: 84, wetWeather: 83, overtaking: 85, consistency: 84 },
  HAD: { qualifying: 86, racePace: 85, tyreManagement: 84, wetWeather: 84, overtaking: 87, consistency: 83 },
  // Legends
  SEN: { qualifying: 100, racePace: 98, tyreManagement: 92, wetWeather: 100, overtaking: 98, consistency: 91 },
  PRO: { qualifying: 95, racePace: 99, tyreManagement: 99, wetWeather: 91, overtaking: 93, consistency: 99 },
  MSC: { qualifying: 98, racePace: 100, tyreManagement: 97, wetWeather: 99, overtaking: 98, consistency: 97 },
};

export const TEAMMATE_HEAD_TO_HEAD_DATA: TeammateHeadToHead[] = [
  {
    driver1Code: 'VER',
    driver2Code: 'PER',
    teamName: 'Red Bull Racing',
    years: '2021 - 2024',
    racesCount: 88,
    qualiScore: [68, 20],
    raceScore: [62, 16],
    pointsScore: [1685, 932],
    summary: 'フェルスタッペンが予選・決勝ともに圧倒的な勝率を記録。ペレスはタイヤマネジメントとディフェンス（2021アブダビの大臣）でタイトル獲得を強力に支援。',
  },
  {
    driver1Code: 'HAM',
    driver2Code: 'RUS',
    teamName: 'Mercedes',
    years: '2022 - 2024',
    racesCount: 66,
    qualiScore: [34, 32],
    raceScore: [35, 31],
    pointsScore: [665, 612],
    summary: 'F1史上屈指のハイレベルな英国対決。若きラッセルの予選スピードに対し、ハミルトンは決勝レースペースとタイヤマネジメントで互角以上の戦いを展開。',
  },
  {
    driver1Code: 'NOR',
    driver2Code: 'PIA',
    teamName: 'McLaren',
    years: '2023 - 2024',
    racesCount: 46,
    qualiScore: [30, 16],
    raceScore: [29, 17],
    pointsScore: [579, 359],
    summary: 'ノリスがエースとしてリードしつつも、ピアストリはルーキー時代から驚異的な冷静さと勝負強さを発揮。パパイヤ・ルール下での緊迫したチームメイト関係。',
  },
  {
    driver1Code: 'LEC',
    driver2Code: 'SAI',
    teamName: 'Ferrari',
    years: '2021 - 2024',
    racesCount: 88,
    qualiScore: [53, 35],
    raceScore: [48, 40],
    pointsScore: [948, 860],
    summary: 'ポールポジション数と一発の爆発力でルクレールが先行し、戦略眼とレース判断力でサインツが肉薄したフェラーリの黄金期ペア。',
  },
  {
    driver1Code: 'TSU',
    driver2Code: 'RIC',
    teamName: 'RB / AlphaTauri',
    years: '2023 - 2024',
    racesCount: 25,
    qualiScore: [17, 8],
    raceScore: [14, 11],
    pointsScore: [28, 12],
    summary: '8勝のベテラン・リカルドに対し、角田裕毅が予選・決勝ともに上回るパフォーマンスを証明。Red Bull昇格候補としての評価を決定づけた。',
  },
  {
    driver1Code: 'TSU',
    driver2Code: 'LAW',
    teamName: 'RB / AlphaTauri',
    years: '2023, 2024',
    racesCount: 11,
    qualiScore: [6, 5],
    raceScore: [6, 5],
    pointsScore: [11, 8],
    summary: 'レッドブル育成の頂点を争う緊迫の直接対決。予選一発・レースペースともにコンマ数秒を競い合う緊迫したライバル関係。',
  },
  {
    driver1Code: 'VER',
    driver2Code: 'SAI',
    teamName: 'Toro Rosso',
    years: '2015 - 2016',
    racesCount: 23,
    qualiScore: [11, 12],
    raceScore: [11, 8],
    pointsScore: [62, 22],
    summary: '2015年の同時デビュー戦。予選ではサインツが競り勝ち、決勝ではフェルスタッペンがアグレッシブなオーバーテイクでポイントを稼ぎ出した伝説のルーキー対決。',
  },
  {
    driver1Code: 'HAM',
    driver2Code: 'ALO',
    teamName: 'McLaren',
    years: '2007',
    racesCount: 17,
    qualiScore: [8, 9],
    raceScore: [10, 7],
    pointsScore: [109, 109],
    summary: 'F1史上最大の衝撃をもたらした2007年。2連覇王者アロンソにルーキーのハミルトンが互角に対峙し、同点（109点）でシーズンを終えた伝説の内戦。',
  },
  {
    driver1Code: 'SEN',
    driver2Code: 'PRO',
    teamName: 'McLaren Honda',
    years: '1988 - 1989',
    racesCount: 32,
    qualiScore: [28, 4],
    raceScore: [14, 12],
    pointsScore: [150, 163],
    summary: 'ポールポジション28回と圧倒的スピードのセナに対し、教授プロストがレース知略で対抗。1988年・1989年の鈴鹿での激突は今も語り継がれる歴史の頂点。',
  },
];

export const DRIVER_RIVALRY_MAPPING: Record<string, string> = {
  'VER-NOR': 'verstappen-vs-norris',
  'NOR-VER': 'verstappen-vs-norris',
  'LEC-SAI': 'leclerc-vs-sainz',
  'SAI-LEC': 'leclerc-vs-sainz',
  'HAM-RUS': 'hamilton-vs-russell',
  'RUS-HAM': 'hamilton-vs-russell',
  'PIA-NOR': 'piastri-vs-norris',
  'NOR-PIA': 'piastri-vs-norris',
  'HAM-VER': 'hamilton-vs-verstappen-2021',
  'VER-HAM': 'hamilton-vs-verstappen-2021',
  'SEN-PRO': 'senna-vs-prost',
  'PRO-SEN': 'senna-vs-prost',
};
