'use client';

/**
 * data/f1SeasonData.ts
 * 2025 Formula 1 Season Calendar, Session Timings (JST), and Standings Data.
 */

export interface RaceWeekendSchedule {
  round: number;
  gpName: string;
  country: string;
  flag: string;
  circuitName: string;
  city: string;
  dates: string;
  targetDateUtc: string; // For countdown calculation (Race Day)
  isSprint: boolean;
  lengthKm: number;
  laps: number;
  pirelliCompounds: string; // e.g. "C3 (Hard) / C4 (Med) / C5 (Soft)"
  scheduleJst: {
    session: string;
    dayTime: string;
  }[];
}

export interface DriverStanding {
  position: number;
  driverCode: string;
  driverName: string;
  team: string;
  teamColor: string;
  points: number;
  wins: number;
  podiums: number;
}

export interface ConstructorStanding {
  position: number;
  teamName: string;
  teamColor: string;
  powerUnit: string;
  points: number;
  wins: number;
}

// ─────────────────────────────────────────────────────────────
// 1. 2025 F1 OFFICIAL CALENDAR (ALL 24 ROUNDS)
// ─────────────────────────────────────────────────────────────

export const SEASON_2025_CALENDAR: RaceWeekendSchedule[] = [
  {
    round: 1,
    gpName: 'オーストラリアGP',
    country: 'オーストラリア',
    flag: '🇦🇺',
    circuitName: 'アルバート・パーク・サーキット',
    city: 'メルボルン',
    dates: '2025年 3月14日 - 3月16日',
    targetDateUtc: '2025-03-16T04:00:00Z',
    isSprint: false,
    lengthKm: 5.278,
    laps: 58,
    pirelliCompounds: 'C3 (ハード) / C4 (ミディアム) / C5 (ソフト)',
    scheduleJst: [
      { session: 'FP1 (フリー走行1)', dayTime: '3/14 (金) 10:30 - 11:30' },
      { session: 'FP2 (フリー走行2)', dayTime: '3/14 (金) 14:00 - 15:00' },
      { session: 'FP3 (フリー走行3)', dayTime: '3/15 (土) 10:30 - 11:30' },
      { session: '予選 (Qualifying)', dayTime: '3/15 (土) 14:00 - 15:00' },
      { session: '決勝 (Grand Prix)', dayTime: '3/16 (日) 13:00 スタート' },
    ],
  },
  {
    round: 2,
    gpName: '中国GP',
    country: '中国',
    flag: '🇨🇳',
    circuitName: '上海インターナショナル・サーキット',
    city: '上海',
    dates: '2025年 3月21日 - 3月23日',
    targetDateUtc: '2025-03-23T07:00:00Z',
    isSprint: true,
    lengthKm: 5.451,
    laps: 56,
    pirelliCompounds: 'C2 (ハード) / C3 (ミディアム) / C4 (ソフト)',
    scheduleJst: [
      { session: 'FP1', dayTime: '3/21 (金) 12:30 - 13:30' },
      { session: 'スプリント予選', dayTime: '3/21 (金) 16:30 - 17:14' },
      { session: 'スプリント決勝', dayTime: '3/22 (土) 12:00 - 13:00' },
      { session: '本選予選', dayTime: '3/22 (土) 16:00 - 17:00' },
      { session: '決勝レース', dayTime: '3/23 (日) 16:00 スタート' },
    ],
  },
  {
    round: 3,
    gpName: '日本GP (鈴鹿)',
    country: '日本',
    flag: '🇯🇵',
    circuitName: '鈴鹿サーキット',
    city: '三重県鈴鹿市',
    dates: '2025年 4月4日 - 4月6日',
    targetDateUtc: '2025-04-06T05:00:00Z',
    isSprint: false,
    lengthKm: 5.807,
    laps: 53,
    pirelliCompounds: 'C1 (ハード) / C2 (ミディアム) / C3 (ソフト)',
    scheduleJst: [
      { session: 'FP1 (金曜午前)', dayTime: '4/4 (金) 11:30 - 12:30' },
      { session: 'FP2 (金曜午後)', dayTime: '4/4 (金) 15:00 - 16:00' },
      { session: 'FP3 (土曜午前)', dayTime: '4/5 (土) 11:30 - 12:30' },
      { session: '公式予選', dayTime: '4/5 (土) 15:00 - 16:00' },
      { session: '決勝レース', dayTime: '4/6 (日) 14:00 スタート' },
    ],
  },
  {
    round: 4,
    gpName: 'バーレーンGP',
    country: 'バーレーン',
    flag: '🇧🇭',
    circuitName: 'バーレーン・インターナショナル・サーキット',
    city: 'サヒール',
    dates: '2025年 4月11日 - 4月13日',
    targetDateUtc: '2025-04-13T15:00:00Z',
    isSprint: false,
    lengthKm: 5.412,
    laps: 57,
    pirelliCompounds: 'C1 (ハード) / C2 (ミディアム) / C3 (ソフト)',
    scheduleJst: [
      { session: 'FP1', dayTime: '4/11 (金) 20:30 - 21:30' },
      { session: 'FP2 (ナイトセッション)', dayTime: '4/12 (土) 00:00 - 01:00' },
      { session: 'FP3', dayTime: '4/12 (土) 21:30 - 22:30' },
      { session: '予選', dayTime: '4/13 (日) 01:00 - 02:00' },
      { session: '決勝 (ナイトレース)', dayTime: '4/14 (月) 00:00 スタート' },
    ],
  },
  {
    round: 5,
    gpName: 'サウジアラビアGP',
    country: 'サウジアラビア',
    flag: '🇸🇦',
    circuitName: 'ジェッダ・コーニッシュ・サーキット',
    city: 'ジェッダ',
    dates: '2025年 4月18日 - 4月20日',
    targetDateUtc: '2025-04-20T17:00:00Z',
    isSprint: false,
    lengthKm: 6.174,
    laps: 50,
    pirelliCompounds: 'C2 (ハード) / C3 (ミディアム) / C4 (ソフト)',
    scheduleJst: [
      { session: 'FP1', dayTime: '4/18 (金) 22:30 - 23:30' },
      { session: 'FP2', dayTime: '4/19 (土) 02:00 - 03:00' },
      { session: 'FP3', dayTime: '4/19 (土) 22:30 - 23:30' },
      { session: '予選', dayTime: '4/20 (日) 02:00 - 03:00' },
      { session: '決勝', dayTime: '4/21 (月) 02:00 スタート' },
    ],
  },
  {
    round: 6,
    gpName: 'マイアミGP',
    country: 'アメリカ',
    flag: '🇺🇸',
    circuitName: 'マイアミ・インターナショナル・オートドローム',
    city: 'マイアミ',
    dates: '2025年 5月2日 - 5月4日',
    targetDateUtc: '2025-05-04T20:00:00Z',
    isSprint: true,
    lengthKm: 5.412,
    laps: 57,
    pirelliCompounds: 'C2 / C3 / C4',
    scheduleJst: [{ session: '決勝レース', dayTime: '5/5 (月・祝) 05:00 スタート' }],
  },
  {
    round: 7,
    gpName: 'エミリア・ロマーニャGP (イモラ)',
    country: 'イタリア',
    flag: '🇮🇹',
    circuitName: 'イモラ・サーキット (エンツォ・エ・ディーノ)',
    city: 'イモラ',
    dates: '2025年 5月16日 - 5月18日',
    targetDateUtc: '2025-05-18T13:00:00Z',
    isSprint: false,
    lengthKm: 4.909,
    laps: 63,
    pirelliCompounds: 'C3 / C4 / C5',
    scheduleJst: [{ session: '決勝レース', dayTime: '5/18 (日) 22:00 スタート' }],
  },
  {
    round: 8,
    gpName: 'モナコGP',
    country: 'モナコ',
    flag: '🇲🇨',
    circuitName: 'モンテカルロ市街地コース',
    city: 'モンテカルロ',
    dates: '2025年 5月23日 - 5月25日',
    targetDateUtc: '2025-05-25T13:00:00Z',
    isSprint: false,
    lengthKm: 3.337,
    laps: 78,
    pirelliCompounds: 'C4 / C5 / C6 (超極軟2025新導入)',
    scheduleJst: [{ session: '決勝レース', dayTime: '5/25 (日) 22:00 スタート' }],
  },
  {
    round: 9,
    gpName: 'スペインGP (バルセロナ)',
    country: 'スペイン',
    flag: '🇪🇸',
    circuitName: 'カタルーニャ・サーキット',
    city: 'バルセロナ',
    dates: '2025年 5月30日 - 6月1日',
    targetDateUtc: '2025-06-01T13:00:00Z',
    isSprint: false,
    lengthKm: 4.657,
    laps: 66,
    pirelliCompounds: 'C1 / C2 / C3',
    scheduleJst: [{ session: '決勝レース', dayTime: '6/1 (日) 22:00 スタート' }],
  },
  {
    round: 10,
    gpName: 'カナダGP',
    country: 'カナダ',
    flag: '🇨🇦',
    circuitName: 'ジル・ヴィルヌーヴ・サーキット',
    city: 'モントリオール',
    dates: '2025年 6月13日 - 6月15日',
    targetDateUtc: '2025-06-15T18:00:00Z',
    isSprint: false,
    lengthKm: 4.361,
    laps: 70,
    pirelliCompounds: 'C3 / C4 / C5',
    scheduleJst: [{ session: '決勝レース', dayTime: '6/16 (月) 03:00 スタート' }],
  },
  {
    round: 11,
    gpName: 'オーストリアGP',
    country: 'オーストリア',
    flag: '🇦🇹',
    circuitName: 'レッドブル・リンク',
    city: 'シュピールベルク',
    dates: '2025年 6月27日 - 6月29日',
    targetDateUtc: '2025-06-29T13:00:00Z',
    isSprint: true,
    lengthKm: 4.318,
    laps: 71,
    pirelliCompounds: 'C3 / C4 / C5',
    scheduleJst: [{ session: '決勝レース', dayTime: '6/29 (日) 22:00 スタート' }],
  },
  {
    round: 12,
    gpName: 'イギリスGP (シルバーストーン)',
    country: 'イギリス',
    flag: '🇬🇧',
    circuitName: 'シルバーストーン・サーキット',
    city: 'シルバーストーン',
    dates: '2025年 7月4日 - 7月6日',
    targetDateUtc: '2025-07-06T14:00:00Z',
    isSprint: false,
    lengthKm: 5.891,
    laps: 52,
    pirelliCompounds: 'C1 / C2 / C3',
    scheduleJst: [{ session: '決勝レース', dayTime: '7/6 (日) 23:00 スタート' }],
  },
  {
    round: 13,
    gpName: 'ベルギーGP (スパ)',
    country: 'ベルギー',
    flag: '🇧🇪',
    circuitName: 'スパ・フランコルシャン',
    city: 'スパ',
    dates: '2025年 7月25日 - 7月27日',
    targetDateUtc: '2025-07-27T13:00:00Z',
    isSprint: true,
    lengthKm: 7.004,
    laps: 44,
    pirelliCompounds: 'C2 / C3 / C4',
    scheduleJst: [{ session: '決勝レース', dayTime: '7/27 (日) 22:00 スタート' }],
  },
  {
    round: 14,
    gpName: 'ハンガリーGP',
    country: 'ハンガリー',
    flag: '🇭🇺',
    circuitName: 'ハンガロリンク',
    city: 'ブダペスト',
    dates: '2025年 8月1日 - 8月3日',
    targetDateUtc: '2025-08-03T13:00:00Z',
    isSprint: false,
    lengthKm: 4.381,
    laps: 70,
    pirelliCompounds: 'C3 / C4 / C5',
    scheduleJst: [{ session: '決勝レース', dayTime: '8/3 (日) 22:00 スタート' }],
  },
  {
    round: 15,
    gpName: 'オランダGP (ザントフォールト)',
    country: 'オランダ',
    flag: '🇳🇱',
    circuitName: 'ザントフォールト・サーキット',
    city: 'ザントフォールト',
    dates: '2025年 8月29日 - 8月31日',
    targetDateUtc: '2025-08-31T13:00:00Z',
    isSprint: false,
    lengthKm: 4.259,
    laps: 72,
    pirelliCompounds: 'C1 / C2 / C3',
    scheduleJst: [{ session: '決勝レース', dayTime: '8/31 (日) 22:00 スタート' }],
  },
  {
    round: 16,
    gpName: 'イタリアGP (モンツァ)',
    country: 'イタリア',
    flag: '🇮🇹',
    circuitName: 'モンツァ・サーキット',
    city: 'モンツァ',
    dates: '2025年 9月5日 - 9月7日',
    targetDateUtc: '2025-09-07T13:00:00Z',
    isSprint: false,
    lengthKm: 5.793,
    laps: 53,
    pirelliCompounds: 'C3 / C4 / C5',
    scheduleJst: [{ session: '決勝レース', dayTime: '9/7 (日) 22:00 スタート' }],
  },
  {
    round: 17,
    gpName: 'アゼルバイジャンGP (バクー)',
    country: 'アゼルバイジャン',
    flag: '🇦🇿',
    circuitName: 'バクー市街地コース',
    city: 'バクー',
    dates: '2025年 9月19日 - 9月21日',
    targetDateUtc: '2025-09-21T11:00:00Z',
    isSprint: false,
    lengthKm: 6.003,
    laps: 51,
    pirelliCompounds: 'C3 / C4 / C5',
    scheduleJst: [{ session: '決勝レース', dayTime: '9/21 (日) 20:00 スタート' }],
  },
  {
    round: 18,
    gpName: 'シンガポールGP',
    country: 'シンガポール',
    flag: '🇸🇬',
    circuitName: 'マリーナベイ市街地コース',
    city: 'シンガポール',
    dates: '2025年 10月3日 - 10月5日',
    targetDateUtc: '2025-10-05T12:00:00Z',
    isSprint: false,
    lengthKm: 4.940,
    laps: 62,
    pirelliCompounds: 'C3 / C4 / C5',
    scheduleJst: [{ session: '決勝 (ナイトレース)', dayTime: '10/5 (日) 21:00 スタート' }],
  },
  {
    round: 19,
    gpName: 'アメリカGP (オースティン)',
    country: 'アメリカ',
    flag: '🇺🇸',
    circuitName: 'サーキット・オブ・ジ・アメリカズ (COTA)',
    city: 'オースティン',
    dates: '2025年 10月17日 - 10月19日',
    targetDateUtc: '2025-10-19T19:00:00Z',
    isSprint: true,
    lengthKm: 5.513,
    laps: 56,
    pirelliCompounds: 'C2 / C3 / C4',
    scheduleJst: [{ session: '決勝レース', dayTime: '10/20 (月) 04:00 スタート' }],
  },
  {
    round: 20,
    gpName: 'メキシコシティGP',
    country: 'メキシコ',
    flag: '🇲🇽',
    circuitName: 'エルマノス・ロドリゲス・サーキット',
    city: 'メキシコシティ',
    dates: '2025年 10月24日 - 10月26日',
    targetDateUtc: '2025-10-26T20:00:00Z',
    isSprint: false,
    lengthKm: 4.304,
    laps: 71,
    pirelliCompounds: 'C3 / C4 / C5',
    scheduleJst: [{ session: '決勝レース', dayTime: '10/27 (月) 05:00 スタート' }],
  },
  {
    round: 21,
    gpName: 'サンパウロGP (インテルラゴス)',
    country: 'ブラジル',
    flag: '🇧🇷',
    circuitName: 'インテルラゴス・サーキット',
    city: 'サンパウロ',
    dates: '2025年 11月7日 - 11月9日',
    targetDateUtc: '2025-11-09T17:00:00Z',
    isSprint: true,
    lengthKm: 4.309,
    laps: 71,
    pirelliCompounds: 'C3 / C4 / C5',
    scheduleJst: [{ session: '決勝レース', dayTime: '11/10 (月) 02:00 スタート' }],
  },
  {
    round: 22,
    gpName: 'ラスベガスGP',
    country: 'アメリカ',
    flag: '🇺🇸',
    circuitName: 'ラスベガス・ストリップ・サーキット',
    city: 'ラスベガス',
    dates: '2025年 11月20日 - 11月22日',
    targetDateUtc: '2025-11-23T06:00:00Z',
    isSprint: false,
    lengthKm: 6.201,
    laps: 50,
    pirelliCompounds: 'C4 / C5 / C6 (超低温ナイトレース)',
    scheduleJst: [{ session: '決勝 (土曜夜開催)', dayTime: '11/23 (日) 15:00 スタート' }],
  },
  {
    round: 23,
    gpName: 'カタールGP (ロサイル)',
    country: 'カタール',
    flag: '🇶🇦',
    circuitName: 'ロサイル・インターナショナル・サーキット',
    city: 'ドーハ',
    dates: '2025年 11月28日 - 11月30日',
    targetDateUtc: '2025-11-30T16:00:00Z',
    isSprint: true,
    lengthKm: 5.419,
    laps: 57,
    pirelliCompounds: 'C1 / C2 / C3',
    scheduleJst: [{ session: '決勝 (ナイトレース)', dayTime: '12/1 (月) 01:00 スタート' }],
  },
  {
    round: 24,
    gpName: 'アブダビGP (最終戦)',
    country: 'アラブ首長国連邦',
    flag: '🇦🇪',
    circuitName: 'ヤス・マリーナ・サーキット',
    city: 'アブダビ',
    dates: '2025年 12月5日 - 12月7日',
    targetDateUtc: '2025-12-07T13:00:00Z',
    isSprint: false,
    lengthKm: 5.281,
    laps: 58,
    pirelliCompounds: 'C3 / C4 / C5',
    scheduleJst: [{ session: '決勝 (トワイライトレース)', dayTime: '12/7 (日) 22:00 スタート' }],
  },
];

// ─────────────────────────────────────────────────────────────
// 2. STANDINGS (2024 FINAL & 2025 GRID FORM)
// ─────────────────────────────────────────────────────────────

export const DRIVER_STANDINGS_2024: DriverStanding[] = [
  { position: 1, driverCode: 'VER', driverName: 'マックス・フェルスタッペン', team: 'Red Bull Racing', teamColor: '#3671C6', points: 437, wins: 9, podiums: 14 },
  { position: 2, driverCode: 'NOR', driverName: 'ランド・ノリス', team: 'McLaren', teamColor: '#FF8000', points: 374, wins: 3, podiums: 12 },
  { position: 3, driverCode: 'LEC', driverName: 'シャルル・ルクレール', team: 'Scuderia Ferrari', teamColor: '#E80020', points: 356, wins: 3, podiums: 13 },
  { position: 4, driverCode: 'PIA', driverName: 'オスカー・ピアストリ', team: 'McLaren', teamColor: '#FF8000', points: 292, wins: 2, podiums: 8 },
  { position: 5, driverCode: 'SAI', driverName: 'カルロス・サインツ', team: 'Scuderia Ferrari', teamColor: '#E80020', points: 290, wins: 2, podiums: 7 },
  { position: 6, driverCode: 'RUS', driverName: 'ジョージ・ラッセル', team: 'Mercedes-AMG', teamColor: '#27F4D2', points: 245, wins: 2, podiums: 4 },
  { position: 7, driverCode: 'HAM', driverName: 'ルイス・ハミルトン', team: 'Mercedes-AMG', teamColor: '#27F4D2', points: 223, wins: 2, podiums: 4 },
  { position: 8, driverCode: 'PER', driverName: 'セルジオ・ペレス', team: 'Red Bull Racing', teamColor: '#3671C6', points: 152, wins: 0, podiums: 4 },
  { position: 9, driverCode: 'ALO', driverName: 'フェルナンド・アロンソ', team: 'Aston Martin', teamColor: '#229971', points: 70, wins: 0, podiums: 0 },
  { position: 10, driverCode: 'GAS', driverName: 'ピエール・ガスリー', team: 'Alpine', teamColor: '#0093cc', points: 42, wins: 0, podiums: 1 },
  { position: 11, driverCode: 'HUL', driverName: 'ニコ・ヒュルケンベルグ', team: 'Haas F1 Team', teamColor: '#B6BABD', points: 41, wins: 0, podiums: 0 },
  { position: 12, driverCode: 'TSU', driverName: '角田裕毅', team: 'RB', teamColor: '#6692FF', points: 30, wins: 0, podiums: 0 },
  { position: 13, driverCode: 'STR', driverName: 'ランス・ストロール', team: 'Aston Martin', teamColor: '#229971', points: 24, wins: 0, podiums: 0 },
  { position: 14, driverCode: 'OCO', driverName: 'エステバン・オコン', team: 'Alpine', teamColor: '#0093cc', points: 23, wins: 0, podiums: 1 },
  { position: 15, driverCode: 'MAG', driverName: 'ケビン・マグヌッセン', team: 'Haas F1 Team', teamColor: '#B6BABD', points: 16, wins: 0, podiums: 0 },
  { position: 16, driverCode: 'ALB', driverName: 'アレクサンダー・アルボン', team: 'Williams', teamColor: '#00A0DE', points: 12, wins: 0, podiums: 0 },
  { position: 17, driverCode: 'RIC', driverName: 'ダニエル・リカルド', team: 'RB', teamColor: '#6692FF', points: 12, wins: 0, podiums: 0 },
  { position: 18, driverCode: 'BEA', driverName: 'オリバー・ベアマン', team: 'Ferrari / Haas', teamColor: '#E80020', points: 7, wins: 0, podiums: 0 },
  { position: 19, driverCode: 'COL', driverName: 'フランコ・コラピント', team: 'Williams', teamColor: '#00A0DE', points: 5, wins: 0, podiums: 0 },
  { position: 20, driverCode: 'LAW', driverName: 'リアム・ローソン', team: 'RB', teamColor: '#6692FF', points: 4, wins: 0, podiums: 0 },
  { position: 21, driverCode: 'ZHO', driverName: '周冠宇', team: 'Sauber', teamColor: '#52e252', points: 4, wins: 0, podiums: 0 },
  { position: 22, driverCode: 'BOT', driverName: 'バルテリ・ボッタス', team: 'Sauber', teamColor: '#52e252', points: 0, wins: 0, podiums: 0 },
];

export const CONSTRUCTOR_STANDINGS_2024: ConstructorStanding[] = [
  { position: 1, teamName: 'McLaren', teamColor: '#FF8000', powerUnit: 'Mercedes', points: 666, wins: 5 },
  { position: 2, teamName: 'Scuderia Ferrari', teamColor: '#E80020', powerUnit: 'Ferrari', points: 652, wins: 5 },
  { position: 3, teamName: 'Red Bull Racing', teamColor: '#3671C6', powerUnit: 'Honda RBPT', points: 589, wins: 9 },
  { position: 4, teamName: 'Mercedes-AMG', teamColor: '#27F4D2', powerUnit: 'Mercedes', points: 468, wins: 4 },
  { position: 5, teamName: 'Aston Martin', teamColor: '#229971', powerUnit: 'Mercedes', points: 94, wins: 0 },
  { position: 6, teamName: 'Alpine', teamColor: '#0093cc', powerUnit: 'Renault', points: 65, wins: 0 },
  { position: 7, teamName: 'Haas F1 Team', teamColor: '#B6BABD', powerUnit: 'Ferrari', points: 58, wins: 0 },
  { position: 8, teamName: 'RB (Visa Cash App)', teamColor: '#6692FF', powerUnit: 'Honda RBPT', points: 46, wins: 0 },
  { position: 9, teamName: 'Williams', teamColor: '#00A0DE', powerUnit: 'Mercedes', points: 17, wins: 0 },
  { position: 10, teamName: 'Kick Sauber', teamColor: '#52e252', powerUnit: 'Ferrari', points: 4, wins: 0 },
];

export interface Grid2025Team {
  teamName: string;
  fullName: string;
  teamColor: string;
  powerUnit: string;
  drivers: {
    number: number;
    code: string;
    name: string;
    country: string;
    flag: string;
    isTransfer?: boolean;
    isRookie?: boolean;
    note?: string;
  }[];
}

export const GRID_2025_TEAMS: Grid2025Team[] = [
  {
    teamName: 'McLaren',
    fullName: 'McLaren Formula 1 Team',
    teamColor: '#FF8000',
    powerUnit: 'Mercedes',
    drivers: [
      { number: 4, code: 'NOR', name: 'ランド・ノリス', country: '英国', flag: '🇬🇧' },
      { number: 81, code: 'PIA', name: 'オスカー・ピアストリ', country: '豪州', flag: '🇦🇺' },
    ],
  },
  {
    teamName: 'Ferrari',
    fullName: 'Scuderia Ferrari HP',
    teamColor: '#E80020',
    powerUnit: 'Ferrari',
    drivers: [
      { number: 16, code: 'LEC', name: 'シャルル・ルクレール', country: 'モナコ', flag: '🇲🇨' },
      { number: 44, code: 'HAM', name: 'ルイス・ハミルトン', country: '英国', flag: '🇬🇧', isTransfer: true, note: 'メルセデスから電撃移籍！赤い跳ね馬へ' },
    ],
  },
  {
    teamName: 'Red Bull Racing',
    fullName: 'Oracle Red Bull Racing',
    teamColor: '#3671C6',
    powerUnit: 'Honda RBPT',
    drivers: [
      { number: 1, code: 'VER', name: 'マックス・フェルスタッペン', country: 'オランダ', flag: '🇳🇱' },
      { number: 30, code: 'LAW', name: 'リアム・ローソン', country: 'NZ', flag: '🇳🇿', isTransfer: true, note: 'トップチーム昇格の勝負年' },
    ],
  },
  {
    teamName: 'Mercedes',
    fullName: 'Mercedes-AMG PETRONAS F1 Team',
    teamColor: '#27F4D2',
    powerUnit: 'Mercedes',
    drivers: [
      { number: 63, code: 'RUS', name: 'ジョージ・ラッセル', country: '英国', flag: '🇬🇧' },
      { number: 12, code: 'ANT', name: 'アンドレア・キミ・アントネッリ', country: 'イタリア', flag: '🇮🇹', isRookie: true, note: '18歳の超新星ルーキー！' },
    ],
  },
  {
    teamName: 'Aston Martin',
    fullName: 'Aston Martin Aramco F1 Team',
    teamColor: '#229971',
    powerUnit: 'Mercedes',
    drivers: [
      { number: 14, code: 'ALO', name: 'フェルナンド・アロンソ', country: 'スペイン', flag: '🇪🇸' },
      { number: 18, code: 'STR', name: 'ランス・ストロール', country: 'カナダ', flag: '🇨🇦' },
    ],
  },
  {
    teamName: 'Alpine',
    fullName: 'BWT Alpine F1 Team',
    teamColor: '#0093cc',
    powerUnit: 'Renault',
    drivers: [
      { number: 10, code: 'GAS', name: 'ピエール・ガスリー', country: 'フランス', flag: '🇫🇷' },
      { number: 7, code: 'DOO', name: 'ジャック・ドゥーハン', country: '豪州', flag: '🇦🇺', isRookie: true, note: 'ミック・ドゥーハンの愛息ルーキー' },
    ],
  },
  {
    teamName: 'Haas',
    fullName: 'MoneyGram Haas F1 Team',
    teamColor: '#B6BABD',
    powerUnit: 'Ferrari',
    drivers: [
      { number: 31, code: 'OCO', name: 'エステバン・オコン', country: 'フランス', flag: '🇫🇷', isTransfer: true, note: 'アルピーヌから新加入' },
      { number: 87, code: 'BEA', name: 'オリバー・ベアマン', country: '英国', flag: '🇬🇧', isRookie: true, note: '代役デビューで鮮烈印象を残した新鋭' },
    ],
  },
  {
    teamName: 'Racing Bulls (RB)',
    fullName: 'Visa Cash App RB Formula One Team',
    teamColor: '#6692FF',
    powerUnit: 'Honda RBPT',
    drivers: [
      { number: 22, code: 'TSU', name: '角田裕毅', country: '日本', flag: '🇯🇵', note: 'F1参戦5年目、エースとして飛躍の年' },
      { number: 6, code: 'HAD', name: 'イサック・ハジャー', country: 'フランス', flag: '🇫🇷', isRookie: true, note: 'F2準優勝のレッドブル育成ルーキー' },
    ],
  },
  {
    teamName: 'Williams',
    fullName: 'Williams Racing',
    teamColor: '#00A0DE',
    powerUnit: 'Mercedes',
    drivers: [
      { number: 23, code: 'ALB', name: 'アレクサンダー・アルボン', country: 'タイ', flag: '🇹🇭' },
      { number: 55, code: 'SAI', name: 'カルロス・サインツ', country: 'スペイン', flag: '🇪🇸', isTransfer: true, note: 'フェラーリから電撃加入！' },
    ],
  },
  {
    teamName: 'Kick Sauber',
    fullName: 'Stake F1 Team Kick Sauber',
    teamColor: '#52e252',
    powerUnit: 'Ferrari',
    drivers: [
      { number: 27, code: 'HUL', name: 'ニコ・ヒュルケンベルグ', country: 'ドイツ', flag: '🇩🇪', isTransfer: true, note: 'アウディワークス化を見据えたベテラン獲得' },
      { number: 5, code: 'BOR', name: 'ガブリエル・ボルトレート', country: 'ブラジル', flag: '🇧🇷', isRookie: true, note: 'F3・F2連続王者の最強大型ルーキー' },
    ],
  },
];
