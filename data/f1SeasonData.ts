'use client';

/**
 * data/f1SeasonData.ts
 * Formula 1 Season Calendar, Session Timings (JST), Standings Data, and Grid Roster.
 * Includes both 2026 (Active Current Season) and 2025 (Archive Season) with automated rollover detection.
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

export interface GridTeam {
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

// Backward compatibility type alias
export type Grid2025Team = GridTeam;

// ─────────────────────────────────────────────────────────────
// 1. 2026 F1 OFFICIAL CALENDAR (ALL 24 ROUNDS - CURRENT SEASON)
// ─────────────────────────────────────────────────────────────

export const SEASON_2026_CALENDAR: RaceWeekendSchedule[] = [
  {
    round: 1,
    gpName: 'オーストラリアGP',
    country: 'オーストラリア',
    flag: '🇦🇺',
    circuitName: 'アルバート・パーク・サーキット',
    city: 'メルボルン',
    dates: '2026年 3月13日 - 3月15日',
    targetDateUtc: '2026-03-15T04:00:00Z',
    isSprint: false,
    lengthKm: 5.278,
    laps: 58,
    pirelliCompounds: 'C3 (ハード) / C4 (ミディアム) / C5 (ソフト)',
    scheduleJst: [
      { session: 'FP1 (フリー走行1)', dayTime: '3/13 (金) 10:30 - 11:30' },
      { session: 'FP2 (フリー走行2)', dayTime: '3/13 (金) 14:00 - 15:00' },
      { session: 'FP3 (フリー走行3)', dayTime: '3/14 (土) 10:30 - 11:30' },
      { session: '予選 (Qualifying)', dayTime: '3/14 (土) 14:00 - 15:00' },
      { session: '決勝 (Grand Prix)', dayTime: '3/15 (日) 13:00 スタート' },
    ],
  },
  {
    round: 2,
    gpName: '中国GP',
    country: '中国',
    flag: '🇨🇳',
    circuitName: '上海インターナショナル・サーキット',
    city: '上海',
    dates: '2026年 3月20日 - 3月22日',
    targetDateUtc: '2026-03-22T07:00:00Z',
    isSprint: true,
    lengthKm: 5.451,
    laps: 56,
    pirelliCompounds: 'C2 (ハード) / C3 (ミディアム) / C4 (ソフト)',
    scheduleJst: [
      { session: 'FP1', dayTime: '3/20 (金) 12:30 - 13:30' },
      { session: 'スプリント予選', dayTime: '3/20 (金) 16:30 - 17:14' },
      { session: 'スプリント決勝', dayTime: '3/21 (土) 12:00 - 13:00' },
      { session: '本選予選', dayTime: '3/21 (土) 16:00 - 17:00' },
      { session: '決勝レース', dayTime: '3/22 (日) 16:00 スタート' },
    ],
  },
  {
    round: 3,
    gpName: '日本GP (鈴鹿)',
    country: '日本',
    flag: '🇯🇵',
    circuitName: '鈴鹿サーキット',
    city: '三重県鈴鹿市',
    dates: '2026年 4月3日 - 4月5日',
    targetDateUtc: '2026-04-05T05:00:00Z',
    isSprint: false,
    lengthKm: 5.807,
    laps: 53,
    pirelliCompounds: 'C1 (ハード) / C2 (ミディアム) / C3 (ソフト)',
    scheduleJst: [
      { session: 'FP1', dayTime: '4/3 (金) 11:30 - 12:30' },
      { session: 'FP2', dayTime: '4/3 (金) 15:00 - 16:00' },
      { session: 'FP3', dayTime: '4/4 (土) 11:30 - 12:30' },
      { session: '予選', dayTime: '4/4 (土) 15:00 - 16:00' },
      { session: '決勝 (Grand Prix)', dayTime: '4/5 (日) 14:00 スタート' },
    ],
  },
  {
    round: 4,
    gpName: 'バーレーンGP',
    country: 'バーレーン',
    flag: '🇧🇭',
    circuitName: 'バーレーン・インターナショナル・サーキット',
    city: 'サヒール',
    dates: '2026年 4月10日 - 4月12日',
    targetDateUtc: '2026-04-12T15:00:00Z',
    isSprint: false,
    lengthKm: 5.412,
    laps: 57,
    pirelliCompounds: 'C1 / C2 / C3 (高温・高トラクション)',
    scheduleJst: [
      { session: 'FP1', dayTime: '4/10 (金) 20:30 - 21:30' },
      { session: 'FP2 (ナイト)', dayTime: '4/11 (土) 00:00 - 01:00' },
      { session: 'FP3', dayTime: '4/11 (土) 21:30 - 22:30' },
      { session: '予選', dayTime: '4/12 (日) 01:00 - 02:00' },
      { session: '決勝 (ナイトレース)', dayTime: '4/13 (月) 00:00 スタート' },
    ],
  },
  {
    round: 5,
    gpName: 'サウジアラビアGP',
    country: 'サウジアラビア',
    flag: '🇸🇦',
    circuitName: 'ジェッダ・コーニッシュ・サーキット',
    city: 'ジェッダ',
    dates: '2026年 4月17日 - 4月19日',
    targetDateUtc: '2026-04-19T17:00:00Z',
    isSprint: false,
    lengthKm: 6.174,
    laps: 50,
    pirelliCompounds: 'C2 / C3 / C4 (超高速市街地)',
    scheduleJst: [
      { session: 'FP1', dayTime: '4/17 (金) 22:30 - 23:30' },
      { session: 'FP2', dayTime: '4/18 (土) 02:00 - 03:00' },
      { session: 'FP3', dayTime: '4/18 (土) 22:30 - 23:30' },
      { session: '予選', dayTime: '4/19 (日) 02:00 - 03:00' },
      { session: '決勝 (ナイトレース)', dayTime: '4/20 (月) 02:00 スタート' },
    ],
  },
  {
    round: 6,
    gpName: 'マイアミGP',
    country: 'アメリカ',
    flag: '🇺🇸',
    circuitName: 'マイアミ・インターナショナル・オートドローム',
    city: 'マイアミ',
    dates: '2026年 5月1日 - 5月3日',
    targetDateUtc: '2026-05-03T20:00:00Z',
    isSprint: true,
    lengthKm: 5.412,
    laps: 57,
    pirelliCompounds: 'C2 / C3 / C4',
    scheduleJst: [
      { session: 'FP1', dayTime: '5/2 (土) 01:30 - 02:30' },
      { session: 'スプリント予選', dayTime: '5/2 (土) 05:30 - 06:14' },
      { session: 'スプリント決勝', dayTime: '5/3 (日) 01:00 - 02:00' },
      { session: '本選予選', dayTime: '5/3 (日) 05:00 - 06:00' },
      { session: '決勝', dayTime: '5/4 (月) 05:00 スタート' },
    ],
  },
  {
    round: 7,
    gpName: 'エミリア・ロマーニャGP (イモラ)',
    country: 'イタリア',
    flag: '🇮🇹',
    circuitName: 'イモラ・サーキット (アウトドローモ・エンツォ・エ・ディーノ・フェラーリ)',
    city: 'イモラ',
    dates: '2026年 5月15日 - 5月17日',
    targetDateUtc: '2026-05-17T13:00:00Z',
    isSprint: false,
    lengthKm: 4.909,
    laps: 63,
    pirelliCompounds: 'C3 / C4 / C5',
    scheduleJst: [
      { session: 'FP1', dayTime: '5/15 (金) 20:30 - 21:30' },
      { session: 'FP2', dayTime: '5/16 (土) 00:00 - 01:00' },
      { session: 'FP3', dayTime: '5/16 (土) 19:30 - 20:30' },
      { session: '予選', dayTime: '5/16 (土) 23:00 - 00:00' },
      { session: '決勝', dayTime: '5/17 (日) 22:00 スタート' },
    ],
  },
  {
    round: 8,
    gpName: 'モナコGP',
    country: 'モナコ',
    flag: '🇲🇨',
    circuitName: 'モンテカルロ市街地コース',
    city: 'モンテカルロ',
    dates: '2026年 5月22日 - 5月24日',
    targetDateUtc: '2026-05-24T13:00:00Z',
    isSprint: false,
    lengthKm: 3.337,
    laps: 78,
    pirelliCompounds: 'C3 / C4 / C5 (最軟コンパウンド)',
    scheduleJst: [
      { session: 'FP1', dayTime: '5/22 (金) 20:30 - 21:30' },
      { session: 'FP2', dayTime: '5/23 (土) 00:00 - 01:00' },
      { session: 'FP3', dayTime: '5/23 (土) 19:30 - 20:30' },
      { session: '予選 (最重要セッション)', dayTime: '5/23 (土) 23:00 - 00:00' },
      { session: '決勝', dayTime: '5/24 (日) 22:00 スタート' },
    ],
  },
  {
    round: 9,
    gpName: 'スペインGP',
    country: 'スペイン',
    flag: '🇪🇸',
    circuitName: 'カタロニア・サーキット',
    city: 'バルセロナ',
    dates: '2026年 5月29日 - 5月31日',
    targetDateUtc: '2026-05-31T13:00:00Z',
    isSprint: false,
    lengthKm: 4.657,
    laps: 66,
    pirelliCompounds: 'C1 / C2 / C3',
    scheduleJst: [
      { session: 'FP1', dayTime: '5/29 (金) 20:30 - 21:30' },
      { session: 'FP2', dayTime: '5/30 (土) 00:00 - 01:00' },
      { session: 'FP3', dayTime: '5/30 (土) 19:30 - 20:30' },
      { session: '予選', dayTime: '5/30 (土) 23:00 - 00:00' },
      { session: '決勝', dayTime: '5/31 (日) 22:00 スタート' },
    ],
  },
  {
    round: 10,
    gpName: 'カナダGP',
    country: 'カナダ',
    flag: '🇨🇦',
    circuitName: 'ジル・ヴィルヌーヴ・サーキット',
    city: 'モントリオール',
    dates: '2026年 6月12日 - 6月14日',
    targetDateUtc: '2026-06-14T18:00:00Z',
    isSprint: false,
    lengthKm: 4.361,
    laps: 70,
    pirelliCompounds: 'C3 / C4 / C5',
    scheduleJst: [
      { session: 'FP1', dayTime: '6/13 (土) 02:30 - 03:30' },
      { session: 'FP2', dayTime: '6/13 (土) 06:00 - 07:00' },
      { session: 'FP3', dayTime: '6/13 (土) 23:30 - 00:30' },
      { session: '予選', dayTime: '6/14 (日) 03:00 - 04:00' },
      { session: '決勝', dayTime: '6/15 (月) 03:00 スタート' },
    ],
  },
  {
    round: 11,
    gpName: 'オーストリアGP',
    country: 'オーストリア',
    flag: '🇦🇹',
    circuitName: 'レッドブル・リンク',
    city: 'シュピールベルク',
    dates: '2026年 6月26日 - 6月28日',
    targetDateUtc: '2026-06-28T13:00:00Z',
    isSprint: true,
    lengthKm: 4.318,
    laps: 71,
    pirelliCompounds: 'C3 / C4 / C5',
    scheduleJst: [
      { session: 'FP1', dayTime: '6/26 (金) 19:30 - 20:30' },
      { session: 'スプリント予選', dayTime: '6/26 (金) 23:30 - 00:14' },
      { session: 'スプリント決勝', dayTime: '6/27 (土) 19:00 - 20:00' },
      { session: '本選予選', dayTime: '6/27 (土) 23:00 - 00:00' },
      { session: '決勝', dayTime: '6/28 (日) 22:00 スタート' },
    ],
  },
  {
    round: 12,
    gpName: 'イギリスGP (シルバーストン)',
    country: 'イギリス',
    flag: '🇬🇧',
    circuitName: 'シルバーストン・サーキット',
    city: 'シルバーストン',
    dates: '2026年 7月3日 - 7月5日',
    targetDateUtc: '2026-07-05T14:00:00Z',
    isSprint: false,
    lengthKm: 5.891,
    laps: 52,
    pirelliCompounds: 'C1 / C2 / C3 (高速G負荷)',
    scheduleJst: [
      { session: 'FP1', dayTime: '7/3 (金) 20:30 - 21:30' },
      { session: 'FP2', dayTime: '7/4 (土) 00:00 - 01:00' },
      { session: 'FP3', dayTime: '7/4 (土) 19:30 - 20:30' },
      { session: '予選', dayTime: '7/4 (土) 23:00 - 00:00' },
      { session: '決勝', dayTime: '7/5 (日) 23:00 スタート' },
    ],
  },
  {
    round: 13,
    gpName: 'ベルギーGP (スパ)',
    country: 'ベルギー',
    flag: '🇧🇪',
    circuitName: 'スパ・フランコルシャン',
    city: 'スパ / スタヴロ',
    dates: '2026年 7月24日 - 7月26日',
    targetDateUtc: '2026-07-26T13:00:00Z',
    isSprint: true,
    lengthKm: 7.004,
    laps: 44,
    pirelliCompounds: 'C2 / C3 / C4',
    scheduleJst: [
      { session: 'FP1', dayTime: '7/24 (金) 20:30 - 21:30' },
      { session: 'スプリント予選', dayTime: '7/25 (土) 00:30 - 01:14' },
      { session: 'スプリント決勝', dayTime: '7/25 (土) 19:00 - 20:00' },
      { session: '本選予選', dayTime: '7/25 (土) 23:00 - 00:00' },
      { session: '決勝', dayTime: '7/26 (日) 22:00 スタート' },
    ],
  },
  {
    round: 14,
    gpName: 'ハンガリーGP',
    country: 'ハンガリー',
    flag: '🇭🇺',
    circuitName: 'ハンガロリンク',
    city: 'ブダペスト',
    dates: '2026年 7月31日 - 8月2日',
    targetDateUtc: '2026-08-02T13:00:00Z',
    isSprint: false,
    lengthKm: 4.381,
    laps: 70,
    pirelliCompounds: 'C3 / C4 / C5',
    scheduleJst: [
      { session: 'FP1', dayTime: '7/31 (金) 20:30 - 21:30' },
      { session: 'FP2', dayTime: '8/1 (土) 00:00 - 01:00' },
      { session: 'FP3', dayTime: '8/1 (土) 19:30 - 20:30' },
      { session: '予選', dayTime: '8/1 (土) 23:00 - 00:00' },
      { session: '決勝', dayTime: '8/2 (日) 22:00 スタート' },
    ],
  },
  {
    round: 15,
    gpName: 'オランダGP (ザントフォールト)',
    country: 'オランダ',
    flag: '🇳🇱',
    circuitName: 'ザントフォールト・サーキット',
    city: 'ザントフォールト',
    dates: '2026年 8月28日 - 8月30日',
    targetDateUtc: '2026-08-30T13:00:00Z',
    isSprint: false,
    lengthKm: 4.259,
    laps: 72,
    pirelliCompounds: 'C1 / C2 / C3 (バンクコーナー)',
    scheduleJst: [
      { session: 'FP1', dayTime: '8/28 (金) 19:30 - 20:30' },
      { session: 'FP2', dayTime: '8/28 (金) 23:00 - 00:00' },
      { session: 'FP3', dayTime: '8/29 (土) 18:30 - 19:30' },
      { session: '予選', dayTime: '8/29 (土) 22:00 - 23:00' },
      { session: '決勝', dayTime: '8/30 (日) 22:00 スタート' },
    ],
  },
  {
    round: 16,
    gpName: 'イタリアGP (モンツァ)',
    country: 'イタリア',
    flag: '🇮🇹',
    circuitName: 'モンツァ・サーキット',
    city: 'モンツァ',
    dates: '2026年 9月4日 - 9月6日',
    targetDateUtc: '2026-09-06T13:00:00Z',
    isSprint: false,
    lengthKm: 5.793,
    laps: 53,
    pirelliCompounds: 'C3 / C4 / C5 (殿堂の超高速バトル)',
    scheduleJst: [
      { session: 'FP1', dayTime: '9/4 (金) 20:30 - 21:30' },
      { session: 'FP2', dayTime: '9/5 (土) 00:00 - 01:00' },
      { session: 'FP3', dayTime: '9/5 (土) 19:30 - 20:30' },
      { session: '予選', dayTime: '9/5 (土) 23:00 - 00:00' },
      { session: '決勝', dayTime: '9/6 (日) 22:00 スタート' },
    ],
  },
  {
    round: 17,
    gpName: 'アゼルバイジャンGP (バクー)',
    country: 'アゼルバイジャン',
    flag: '🇦🇿',
    circuitName: 'バクー市街地コース',
    city: 'バクー',
    dates: '2026年 9月18日 - 9月20日',
    targetDateUtc: '2026-09-20T11:00:00Z',
    isSprint: false,
    lengthKm: 6.003,
    laps: 51,
    pirelliCompounds: 'C3 / C4 / C5 (超ロングストレート &amp; 旧市街地)',
    scheduleJst: [
      { session: 'FP1', dayTime: '9/18 (金) 18:30 - 19:30' },
      { session: 'FP2', dayTime: '9/18 (金) 22:00 - 23:00' },
      { session: 'FP3', dayTime: '9/19 (土) 17:30 - 18:30' },
      { session: '予選', dayTime: '9/19 (土) 21:00 - 22:00' },
      { session: '決勝', dayTime: '9/20 (日) 20:00 スタート' },
    ],
  },
  {
    round: 18,
    gpName: 'シンガポールGP (マリーナベイ)',
    country: 'シンガポール',
    flag: '🇸🇬',
    circuitName: 'マリーナベイ・ストリート・サーキット',
    city: 'シンガポール',
    dates: '2026年 10月2日 - 10月4日',
    targetDateUtc: '2026-10-04T12:00:00Z',
    isSprint: false,
    lengthKm: 4.940,
    laps: 62,
    pirelliCompounds: 'C3 / C4 / C5 (極限の高温多湿ナイトレース)',
    scheduleJst: [
      { session: 'FP1', dayTime: '10/2 (金) 18:30 - 19:30' },
      { session: 'FP2', dayTime: '10/2 (金) 22:00 - 23:00' },
      { session: 'FP3', dayTime: '10/3 (土) 18:30 - 19:30' },
      { session: '予選', dayTime: '10/3 (土) 22:00 - 23:00' },
      { session: '決勝 (ナイトレース)', dayTime: '10/4 (日) 21:00 スタート' },
    ],
  },
  {
    round: 19,
    gpName: 'アメリカGP (オースティン)',
    country: 'アメリカ',
    flag: '🇺🇸',
    circuitName: 'サーキット・オブ・ジ・アメリカズ (COTA)',
    city: 'オースティン',
    dates: '2026年 10月16日 - 10月18日',
    targetDateUtc: '2026-10-18T19:00:00Z',
    isSprint: true,
    lengthKm: 5.513,
    laps: 56,
    pirelliCompounds: 'C2 / C3 / C4',
    scheduleJst: [
      { session: 'FP1', dayTime: '10/17 (土) 02:30 - 03:30' },
      { session: 'スプリント予選', dayTime: '10/17 (土) 06:30 - 07:14' },
      { session: 'スプリント決勝', dayTime: '10/18 (日) 03:00 - 04:00' },
      { session: '本選予選', dayTime: '10/18 (日) 07:00 - 08:00' },
      { session: '決勝', dayTime: '10/19 (月) 04:00 スタート' },
    ],
  },
  {
    round: 20,
    gpName: 'メキシコGP',
    country: 'メキシコ',
    flag: '🇲🇽',
    circuitName: 'エルマノス・ロドリゲス・サーキット',
    city: 'メキシコシティ',
    dates: '2026年 10月23日 - 10月25日',
    targetDateUtc: '2026-10-25T20:00:00Z',
    isSprint: false,
    lengthKm: 4.304,
    laps: 71,
    pirelliCompounds: 'C3 / C4 / C5 (標高2,200m希薄大気)',
    scheduleJst: [
      { session: 'FP1', dayTime: '10/24 (土) 03:30 - 04:30' },
      { session: 'FP2', dayTime: '10/24 (土) 07:00 - 08:30' },
      { session: 'FP3', dayTime: '10/25 (日) 02:30 - 03:30' },
      { session: '予選', dayTime: '10/25 (日) 06:00 - 07:00' },
      { session: '決勝', dayTime: '10/26 (月) 05:00 スタート' },
    ],
  },
  {
    round: 21,
    gpName: 'サンパウロGP (インテルラゴス)',
    country: 'ブラジル',
    flag: '🇧🇷',
    circuitName: 'アウトドローモ・ホセ・カルロス・パーチェ',
    city: 'サンパウロ',
    dates: '2026年 11月6日 - 11月8日',
    targetDateUtc: '2026-11-08T17:00:00Z',
    isSprint: true,
    lengthKm: 4.309,
    laps: 71,
    pirelliCompounds: 'C2 / C3 / C4',
    scheduleJst: [
      { session: 'FP1', dayTime: '11/6 (金) 23:30 - 00:30' },
      { session: 'スプリント予選', dayTime: '11/7 (土) 03:30 - 04:14' },
      { session: 'スプリント決勝', dayTime: '11/7 (土) 23:00 - 00:00' },
      { session: '本選予選', dayTime: '11/8 (日) 03:00 - 04:00' },
      { session: '決勝', dayTime: '11/9 (月) 02:00 スタート' },
    ],
  },
  {
    round: 22,
    gpName: 'ラスベガスGP',
    country: 'アメリカ',
    flag: '🇺🇸',
    circuitName: 'ラスベガス・ストリップ・サーキット',
    city: 'ラスベガス',
    dates: '2026年 11月19日 - 11月21日',
    targetDateUtc: '2026-11-22T06:00:00Z',
    isSprint: false,
    lengthKm: 6.201,
    laps: 50,
    pirelliCompounds: 'C3 / C4 / C5 (低温ナイトレース)',
    scheduleJst: [
      { session: 'FP1', dayTime: '11/20 (金) 11:30 - 12:30' },
      { session: 'FP2', dayTime: '11/20 (金) 15:00 - 16:00' },
      { session: 'FP3', dayTime: '11/21 (土) 11:30 - 12:30' },
      { session: '予選', dayTime: '11/21 (土) 15:00 - 16:00' },
      { session: '決勝 (土曜深夜開催)', dayTime: '11/22 (日) 15:00 スタート' },
    ],
  },
  {
    round: 23,
    gpName: 'カタールGP (ロサイル)',
    country: 'カタール',
    flag: '🇶🇦',
    circuitName: 'ロサイル・インターナショナル・サーキット',
    city: 'ドーハ',
    dates: '2026年 11月27日 - 11月29日',
    targetDateUtc: '2026-11-29T16:00:00Z',
    isSprint: true,
    lengthKm: 5.419,
    laps: 57,
    pirelliCompounds: 'C1 / C2 / C3',
    scheduleJst: [
      { session: 'FP1', dayTime: '11/27 (金) 22:30 - 23:30' },
      { session: 'スプリント予選', dayTime: '11/28 (土) 02:30 - 03:14' },
      { session: 'スプリント決勝', dayTime: '11/28 (土) 22:00 - 23:00' },
      { session: '本選予選', dayTime: '11/29 (日) 02:00 - 03:00' },
      { session: '決勝 (ナイトレース)', dayTime: '11/30 (月) 01:00 スタート' },
    ],
  },
  {
    round: 24,
    gpName: 'アブダビGP (最終戦)',
    country: 'アラブ首長国連邦',
    flag: '🇦🇪',
    circuitName: 'ヤス・マリーナ・サーキット',
    city: 'アブダビ',
    dates: '2026年 12月4日 - 12月6日',
    targetDateUtc: '2026-12-06T13:00:00Z',
    isSprint: false,
    lengthKm: 5.281,
    laps: 58,
    pirelliCompounds: 'C3 / C4 / C5',
    scheduleJst: [
      { session: 'FP1', dayTime: '12/4 (金) 18:30 - 19:30' },
      { session: 'FP2', dayTime: '12/4 (金) 22:00 - 23:00' },
      { session: 'FP3', dayTime: '12/5 (土) 19:30 - 20:30' },
      { session: '予選', dayTime: '12/5 (土) 23:00 - 00:00' },
      { session: '決勝 (トワイライトレース)', dayTime: '12/6 (日) 22:00 スタート' },
    ],
  },
];

// ─────────────────────────────────────────────────────────────
// 2. 2025 F1 CALENDAR ARCHIVE (ALL 24 ROUNDS)
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
      { session: 'FP1', dayTime: '4/4 (金) 11:30 - 12:30' },
      { session: 'FP2', dayTime: '4/4 (金) 15:00 - 16:00' },
      { session: 'FP3', dayTime: '4/5 (土) 11:30 - 12:30' },
      { session: '予選', dayTime: '4/5 (土) 15:00 - 16:00' },
      { session: '決勝 (Grand Prix)', dayTime: '4/6 (日) 14:00 スタート' },
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
    pirelliCompounds: 'C1 / C2 / C3',
    scheduleJst: [{ session: '決勝 (ナイトレース)', dayTime: '4/14 (月) 00:00 スタート' }],
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
    pirelliCompounds: 'C2 / C3 / C4',
    scheduleJst: [{ session: '決勝 (ナイトレース)', dayTime: '4/21 (月) 02:00 スタート' }],
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
    scheduleJst: [{ session: '決勝', dayTime: '5/5 (月) 05:00 スタート' }],
  },
  {
    round: 7,
    gpName: 'エミリア・ロマーニャGP (イモラ)',
    country: 'イタリア',
    flag: '🇮🇹',
    circuitName: 'イモラ・サーキット',
    city: 'イモラ',
    dates: '2025年 5月16日 - 5月18日',
    targetDateUtc: '2025-05-18T13:00:00Z',
    isSprint: false,
    lengthKm: 4.909,
    laps: 63,
    pirelliCompounds: 'C3 / C4 / C5',
    scheduleJst: [{ session: '決勝', dayTime: '5/18 (日) 22:00 スタート' }],
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
    pirelliCompounds: 'C3 / C4 / C5',
    scheduleJst: [{ session: '決勝', dayTime: '5/25 (日) 22:00 スタート' }],
  },
  {
    round: 9,
    gpName: 'スペインGP',
    country: 'スペイン',
    flag: '🇪🇸',
    circuitName: 'カタロニア・サーキット',
    city: 'バルセロナ',
    dates: '2025年 5月30日 - 6月1日',
    targetDateUtc: '2025-06-01T13:00:00Z',
    isSprint: false,
    lengthKm: 4.657,
    laps: 66,
    pirelliCompounds: 'C1 / C2 / C3',
    scheduleJst: [{ session: '決勝', dayTime: '6/1 (日) 22:00 スタート' }],
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
    scheduleJst: [{ session: '決勝', dayTime: '6/16 (月) 03:00 スタート' }],
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
    scheduleJst: [{ session: '決勝', dayTime: '6/29 (日) 22:00 スタート' }],
  },
  {
    round: 12,
    gpName: 'イギリスGP (シルバーストン)',
    country: 'イギリス',
    flag: '🇬🇧',
    circuitName: 'シルバーストン・サーキット',
    city: 'シルバーストン',
    dates: '2025年 7月4日 - 7月6日',
    targetDateUtc: '2025-07-06T14:00:00Z',
    isSprint: false,
    lengthKm: 5.891,
    laps: 52,
    pirelliCompounds: 'C1 / C2 / C3',
    scheduleJst: [{ session: '決勝', dayTime: '7/6 (日) 23:00 スタート' }],
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
    scheduleJst: [{ session: '決勝', dayTime: '7/27 (日) 22:00 スタート' }],
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
    scheduleJst: [{ session: '決勝', dayTime: '8/3 (日) 22:00 スタート' }],
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
    scheduleJst: [{ session: '決勝', dayTime: '8/31 (日) 22:00 スタート' }],
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
    scheduleJst: [{ session: '決勝', dayTime: '9/7 (日) 22:00 スタート' }],
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
    scheduleJst: [{ session: '決勝', dayTime: '9/21 (日) 20:00 スタート' }],
  },
  {
    round: 18,
    gpName: 'シンガポールGP',
    country: 'シンガポール',
    flag: '🇸🇬',
    circuitName: 'マリーナベイ・ストリート・サーキット',
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
    circuitName: 'サーキット・オブ・ジ・アメリカズ',
    city: 'オースティン',
    dates: '2025年 10月17日 - 10月19日',
    targetDateUtc: '2025-10-19T19:00:00Z',
    isSprint: true,
    lengthKm: 5.513,
    laps: 56,
    pirelliCompounds: 'C2 / C3 / C4',
    scheduleJst: [{ session: '決勝', dayTime: '10/20 (月) 04:00 スタート' }],
  },
  {
    round: 20,
    gpName: 'メキシコGP',
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
    scheduleJst: [{ session: '決勝', dayTime: '10/27 (月) 05:00 スタート' }],
  },
  {
    round: 21,
    gpName: 'サンパウロGP (インテルラゴス)',
    country: 'ブラジル',
    flag: '🇧🇷',
    circuitName: 'アウトドローモ・ホセ・カルロス・パーチェ',
    city: 'サンパウロ',
    dates: '2025年 11月7日 - 11月9日',
    targetDateUtc: '2025-11-09T17:00:00Z',
    isSprint: true,
    lengthKm: 4.309,
    laps: 71,
    pirelliCompounds: 'C2 / C3 / C4',
    scheduleJst: [{ session: '決勝', dayTime: '11/10 (月) 02:00 スタート' }],
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
// 3. 2026 STANDINGS (LIVE FORM THROUGH ROUND 16 MONZA)
// ─────────────────────────────────────────────────────────────

export const DRIVER_STANDINGS_2026: DriverStanding[] = [
  { position: 1, driverCode: 'NOR', driverName: 'ランド・ノリス', team: 'McLaren', teamColor: '#FF8000', points: 295, wins: 6, podiums: 12 },
  { position: 2, driverCode: 'VER', driverName: 'マックス・フェルスタッペン', team: 'Oracle Red Bull Racing', teamColor: '#3671C6', points: 280, wins: 5, podiums: 11 },
  { position: 3, driverCode: 'LEC', driverName: 'シャルル・ルクレール', team: 'Scuderia Ferrari', teamColor: '#E80020', points: 238, wins: 3, podiums: 9 },
  { position: 4, driverCode: 'PIA', driverName: 'オスカー・ピアストリ', team: 'McLaren', teamColor: '#FF8000', points: 215, wins: 2, podiums: 8 },
  { position: 5, driverCode: 'RUS', driverName: 'ジョージ・ラッセル', team: 'Mercedes-AMG', teamColor: '#27F4D2', points: 178, wins: 0, podiums: 5 },
  { position: 6, driverCode: 'HAM', driverName: 'ルイス・ハミルトン', team: 'Scuderia Ferrari', teamColor: '#E80020', points: 156, wins: 0, podiums: 4 },
  { position: 7, driverCode: 'ANT', driverName: 'アンドレア・キミ・アントネッリ', team: 'Mercedes-AMG', teamColor: '#27F4D2', points: 88, wins: 0, podiums: 1 },
  { position: 8, driverCode: 'SAI', driverName: 'カルロス・サインツ', team: 'Williams', teamColor: '#00A0DE', points: 62, wins: 0, podiums: 1 },
  { position: 9, driverCode: 'ALO', driverName: 'フェルナンド・アロンソ', team: 'Aston Martin Honda', teamColor: '#229971', points: 54, wins: 0, podiums: 0 },
  { position: 10, driverCode: 'TSU', driverName: '角田裕毅', team: 'Visa Cash App RB', teamColor: '#6692FF', points: 48, wins: 0, podiums: 0 },
  { position: 11, driverCode: 'ALB', driverName: 'アレクサンダー・アルボン', team: 'Williams', teamColor: '#00A0DE', points: 42, wins: 0, podiums: 0 },
  { position: 12, driverCode: 'LAW', driverName: 'リアム・ローソン', team: 'Oracle Red Bull Racing', teamColor: '#3671C6', points: 38, wins: 0, podiums: 0 },
  { position: 13, driverCode: 'GAS', driverName: 'ピエール・ガスリー', team: 'Alpine', teamColor: '#0093cc', points: 28, wins: 0, podiums: 0 },
  { position: 14, driverCode: 'HUL', driverName: 'ニコ・ヒュルケンベルグ', team: 'Audi F1 Team', teamColor: '#e0001a', points: 24, wins: 0, podiums: 0 },
  { position: 15, driverCode: 'OCO', driverName: 'エステバン・オコン', team: 'Haas F1 Team', teamColor: '#B6BABD', points: 22, wins: 0, podiums: 0 },
  { position: 16, driverCode: 'BEA', driverName: 'オリバー・ベアマン', team: 'Haas F1 Team', teamColor: '#B6BABD', points: 16, wins: 0, podiums: 0 },
  { position: 17, driverCode: 'STR', driverName: 'ランス・ストロール', team: 'Aston Martin Honda', teamColor: '#229971', points: 15, wins: 0, podiums: 0 },
  { position: 18, driverCode: 'HAD', driverName: 'イサック・ハジャー', team: 'Visa Cash App RB', teamColor: '#6692FF', points: 12, wins: 0, podiums: 0 },
  { position: 19, driverCode: 'BOR', driverName: 'ガブリエル・ボルトレート', team: 'Audi F1 Team', teamColor: '#e0001a', points: 8, wins: 0, podiums: 0 },
  { position: 20, driverCode: 'DOO', driverName: 'ジャック・ドゥーハン', team: 'Alpine', teamColor: '#0093cc', points: 6, wins: 0, podiums: 0 },
];

export const CONSTRUCTOR_STANDINGS_2026: ConstructorStanding[] = [
  { position: 1, teamName: 'McLaren', teamColor: '#FF8000', powerUnit: 'Mercedes', points: 510, wins: 8 },
  { position: 2, teamName: 'Scuderia Ferrari', teamColor: '#E80020', powerUnit: 'Ferrari', points: 394, wins: 3 },
  { position: 3, teamName: 'Oracle Red Bull Racing', teamColor: '#3671C6', powerUnit: 'Red Bull Ford', points: 318, wins: 5 },
  { position: 4, teamName: 'Mercedes-AMG', teamColor: '#27F4D2', powerUnit: 'Mercedes', points: 266, wins: 0 },
  { position: 5, teamName: 'Williams', teamColor: '#00A0DE', powerUnit: 'Mercedes', points: 104, wins: 0 },
  { position: 6, teamName: 'Aston Martin Aramco', teamColor: '#229971', powerUnit: 'Honda Works', points: 69, wins: 0 },
  { position: 7, teamName: 'Visa Cash App RB', teamColor: '#6692FF', powerUnit: 'Red Bull Ford', points: 60, wins: 0 },
  { position: 8, teamName: 'Haas F1 Team', teamColor: '#B6BABD', powerUnit: 'Ferrari', points: 38, wins: 0 },
  { position: 9, teamName: 'BWT Alpine', teamColor: '#0093cc', powerUnit: 'Mercedes', points: 34, wins: 0 },
  { position: 10, teamName: 'Audi F1 Team', teamColor: '#e0001a', powerUnit: 'Audi Works', points: 32, wins: 0 },
];

// ─────────────────────────────────────────────────────────────
// 4. 2025 STANDINGS ARCHIVE (FULL SEASON FINAL)
// ─────────────────────────────────────────────────────────────

export const DRIVER_STANDINGS_2025: DriverStanding[] = [
  { position: 1, driverCode: 'NOR', driverName: 'ランド・ノリス', team: 'McLaren', teamColor: '#FF8000', points: 418, wins: 8, podiums: 16 },
  { position: 2, driverCode: 'VER', driverName: 'マックス・フェルスタッペン', team: 'Red Bull Racing', teamColor: '#3671C6', points: 395, wins: 7, podiums: 14 },
  { position: 3, driverCode: 'LEC', driverName: 'シャルル・ルクレール', team: 'Scuderia Ferrari', teamColor: '#E80020', points: 362, wins: 4, podiums: 13 },
  { position: 4, driverCode: 'PIA', driverName: 'オスカー・ピアストリ', team: 'McLaren', teamColor: '#FF8000', points: 312, wins: 3, podiums: 10 },
  { position: 5, driverCode: 'HAM', driverName: 'ルイス・ハミルトン', team: 'Scuderia Ferrari', teamColor: '#E80020', points: 248, wins: 1, podiums: 6 },
  { position: 6, driverCode: 'RUS', driverName: 'ジョージ・ラッセル', team: 'Mercedes-AMG', teamColor: '#27F4D2', points: 236, wins: 1, podiums: 5 },
  { position: 7, driverCode: 'SAI', driverName: 'カルロス・サインツ', team: 'Williams', teamColor: '#00A0DE', points: 84, wins: 0, podiums: 2 },
  { position: 8, driverCode: 'ANT', driverName: 'アンドレア・キミ・アントネッリ', team: 'Mercedes-AMG', teamColor: '#27F4D2', points: 76, wins: 0, podiums: 1 },
  { position: 9, driverCode: 'ALO', driverName: 'フェルナンド・アロンソ', team: 'Aston Martin', teamColor: '#229971', points: 68, wins: 0, podiums: 0 },
  { position: 10, driverCode: 'TSU', driverName: '角田裕毅', team: 'RB', teamColor: '#6692FF', points: 52, wins: 0, podiums: 0 },
  { position: 11, driverCode: 'ALB', driverName: 'アレクサンダー・アルボン', team: 'Williams', teamColor: '#00A0DE', points: 40, wins: 0, podiums: 0 },
  { position: 12, driverCode: 'LAW', driverName: 'リアム・ローソン', team: 'Red Bull Racing', teamColor: '#3671C6', points: 38, wins: 0, podiums: 0 },
  { position: 13, driverCode: 'HUL', driverName: 'ニコ・ヒュルケンベルグ', team: 'Kick Sauber', teamColor: '#52e252', points: 32, wins: 0, podiums: 0 },
  { position: 14, driverCode: 'OCO', driverName: 'エステバン・オコン', team: 'Haas F1 Team', teamColor: '#B6BABD', points: 28, wins: 0, podiums: 0 },
  { position: 15, driverCode: 'GAS', driverName: 'ピエール・ガスリー', team: 'Alpine', teamColor: '#0093cc', points: 26, wins: 0, podiums: 0 },
  { position: 16, driverCode: 'BEA', driverName: 'オリバー・ベアマン', team: 'Haas F1 Team', teamColor: '#B6BABD', points: 18, wins: 0, podiums: 0 },
  { position: 17, driverCode: 'STR', driverName: 'ランス・ストロール', team: 'Aston Martin', teamColor: '#229971', points: 16, wins: 0, podiums: 0 },
  { position: 18, driverCode: 'HAD', driverName: 'イサック・ハジャー', team: 'RB', teamColor: '#6692FF', points: 10, wins: 0, podiums: 0 },
  { position: 19, driverCode: 'BOR', driverName: 'ガブリエル・ボルトレート', team: 'Kick Sauber', teamColor: '#52e252', points: 8, wins: 0, podiums: 0 },
  { position: 20, driverCode: 'DOO', driverName: 'ジャック・ドゥーハン', team: 'Alpine', teamColor: '#0093cc', points: 4, wins: 0, podiums: 0 },
];

export const CONSTRUCTOR_STANDINGS_2025: ConstructorStanding[] = [
  { position: 1, teamName: 'McLaren', teamColor: '#FF8000', powerUnit: 'Mercedes', points: 730, wins: 11 },
  { position: 2, teamName: 'Scuderia Ferrari', teamColor: '#E80020', powerUnit: 'Ferrari', points: 610, wins: 5 },
  { position: 3, teamName: 'Red Bull Racing', teamColor: '#3671C6', powerUnit: 'Honda RBPT', points: 433, wins: 7 },
  { position: 4, teamName: 'Mercedes-AMG', teamColor: '#27F4D2', powerUnit: 'Mercedes', points: 312, wins: 1 },
  { position: 5, teamName: 'Williams', teamColor: '#00A0DE', powerUnit: 'Mercedes', points: 124, wins: 0 },
  { position: 6, teamName: 'Aston Martin', teamColor: '#229971', powerUnit: 'Mercedes', points: 84, wins: 0 },
  { position: 7, teamName: 'RB (Visa Cash App)', teamColor: '#6692FF', powerUnit: 'Honda RBPT', points: 62, wins: 0 },
  { position: 8, teamName: 'Haas F1 Team', teamColor: '#B6BABD', powerUnit: 'Ferrari', points: 46, wins: 0 },
  { position: 9, teamName: 'Kick Sauber', teamColor: '#52e252', powerUnit: 'Ferrari', points: 40, wins: 0 },
  { position: 10, teamName: 'Alpine', teamColor: '#0093cc', powerUnit: 'Renault', points: 30, wins: 0 },
];

// Preserved for backwards compatibility
export const DRIVER_STANDINGS_2024: DriverStanding[] = DRIVER_STANDINGS_2025;
export const CONSTRUCTOR_STANDINGS_2024: ConstructorStanding[] = CONSTRUCTOR_STANDINGS_2025;

// ─────────────────────────────────────────────────────────────
// 5. GRID ROSTERS (2026 & 2025)
// ─────────────────────────────────────────────────────────────

export const GRID_2026_TEAMS: GridTeam[] = [
  {
    teamName: 'McLaren',
    fullName: 'McLaren Formula 1 Team',
    teamColor: '#FF8000',
    powerUnit: 'Mercedes M17 High-Efficiency',
    drivers: [
      { number: 4, code: 'NOR', name: 'ランド・ノリス', country: '英国', flag: '🇬🇧', note: '2025王者として王座防衛に挑む' },
      { number: 81, code: 'PIA', name: 'オスカー・ピアストリ', country: '豪州', flag: '🇦🇺', note: 'トップ争いを牽引する冷静沈着なヤングガン' },
    ],
  },
  {
    teamName: 'Ferrari',
    fullName: 'Scuderia Ferrari HP',
    teamColor: '#E80020',
    powerUnit: 'Ferrari 067/3 Works',
    drivers: [
      { number: 16, code: 'LEC', name: 'シャルル・ルクレール', country: 'モナコ', flag: '🇲🇨', note: '新規定マシンで悲願のチャンピオン獲得へ' },
      { number: 44, code: 'HAM', name: 'ルイス・ハミルトン', country: '英国', flag: '🇬🇧', isTransfer: false, note: '跳ね馬での2年目、8度目の戴冠を狙う伝説' },
    ],
  },
  {
    teamName: 'Red Bull Racing',
    fullName: 'Oracle Red Bull Racing',
    teamColor: '#3671C6',
    powerUnit: 'Red Bull Ford Powertrains',
    drivers: [
      { number: 1, code: 'VER', name: 'マックス・フェルスタッペン', country: 'オランダ', flag: '🇳🇱', note: '新PU規定でも絶対的速さを誇る王者' },
      { number: 30, code: 'LAW', name: 'リアム・ローソン', country: 'NZ', flag: '🇳🇿', note: 'フォード新時代を担う若き実力派' },
    ],
  },
  {
    teamName: 'Mercedes',
    fullName: 'Mercedes-AMG PETRONAS F1 Team',
    teamColor: '#27F4D2',
    powerUnit: 'Mercedes M17 Works',
    drivers: [
      { number: 63, code: 'RUS', name: 'ジョージ・ラッセル', country: '英国', flag: '🇬🇧', note: '名門復活を背負うリーダー' },
      { number: 12, code: 'ANT', name: 'アンドレア・キミ・アントネッリ', country: 'イタリア', flag: '🇮🇹', note: '2年目を迎えたイタリア期待の至宝' },
    ],
  },
  {
    teamName: 'Aston Martin',
    fullName: 'Aston Martin Aramco F1 Team',
    teamColor: '#229971',
    powerUnit: 'Honda Works PU (RA626H)',
    drivers: [
      { number: 14, code: 'ALO', name: 'フェルナンド・アロンソ', country: 'スペイン', flag: '🇪🇸', note: 'ホンダ完全ワークスPUとともに悲願の33勝目へ' },
      { number: 18, code: 'STR', name: 'ランス・ストロール', country: 'カナダ', flag: '🇨🇦', note: '新ファクトリー体制で安定した入賞を狙う' },
    ],
  },
  {
    teamName: 'Audi F1 Team',
    fullName: 'Audi Revolut F1 Team',
    teamColor: '#e0001a',
    powerUnit: 'Audi Works E-Performance',
    drivers: [
      { number: 27, code: 'HUL', name: 'ニコ・ヒュルケンベルグ', country: 'ドイツ', flag: '🇩🇪', isTransfer: true, note: 'ドイツ名門アウディのF1参戦初年度エース' },
      { number: 5, code: 'BOR', name: 'ガブリエル・ボルトレート', country: 'ブラジル', flag: '🇧🇷', note: 'F3・F2王者からアウディワークスドライバーへ' },
    ],
  },
  {
    teamName: 'Williams',
    fullName: 'Williams Racing',
    teamColor: '#00A0DE',
    powerUnit: 'Mercedes',
    drivers: [
      { number: 23, code: 'ALB', name: 'アレクサンダー・アルボン', country: 'タイ', flag: '🇹🇭', note: 'ウィリアムズの躍進を支えるキーマン' },
      { number: 55, code: 'SAI', name: 'カルロス・サインツ', country: 'スペイン', flag: '🇪🇸', note: '中団トップから表彰台常連へチームを引き上げる' },
    ],
  },
  {
    teamName: 'Racing Bulls (RB)',
    fullName: 'Visa Cash App RB Formula One Team',
    teamColor: '#6692FF',
    powerUnit: 'Red Bull Ford Powertrains',
    drivers: [
      { number: 22, code: 'TSU', name: '角田裕毅', country: '日本', flag: '🇯🇵', note: 'F1参戦6年目、成熟のドライビングで毎戦ポイントを争う' },
      { number: 6, code: 'HAD', name: 'イサック・ハジャー', country: 'フランス', flag: '🇫🇷', note: 'アグレッシブな走りで中団を掻き乱す新鋭' },
    ],
  },
  {
    teamName: 'Alpine',
    fullName: 'BWT Alpine F1 Team',
    teamColor: '#0093cc',
    powerUnit: 'Mercedes (新搭載)',
    drivers: [
      { number: 10, code: 'GAS', name: 'ピエール・ガスリー', country: 'フランス', flag: '🇫🇷', note: 'メルセデスPUへ換装しパワー改善を図る' },
      { number: 7, code: 'DOO', name: 'ジャック・ドゥーハン', country: '豪州', flag: '🇦🇺', note: 'チームの信頼を掴む若手スター' },
    ],
  },
  {
    teamName: 'Haas',
    fullName: 'MoneyGram Haas F1 Team',
    teamColor: '#B6BABD',
    powerUnit: 'Ferrari',
    drivers: [
      { number: 31, code: 'OCO', name: 'エステバン・オコン', country: 'フランス', flag: '🇫🇷', note: '卓越したレースクラフトでポイントを死守' },
      { number: 87, code: 'BEA', name: 'オリバー・ベアマン', country: '英国', flag: '🇬🇧', note: 'フェラーリ育成の大器、2年目の飛躍' },
    ],
  },
];

export const GRID_2025_TEAMS: GridTeam[] = [
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

// ─────────────────────────────────────────────────────────────
// 6. SEASON TRANSITION & DYNAMIC RESOLUTION HELPERS
// ─────────────────────────────────────────────────────────────

export type SeasonYear = '2026' | '2025';

/**
 * Automatically determine which season should be actively displayed by default.
 * If current calendar year is 2026 or later, default to 2026.
 */
export function getActiveSeasonYear(): SeasonYear {
  const currentYear = new Date().getFullYear();
  if (currentYear >= 2026) return '2026';
  return '2025';
}

export function getSeasonCalendar(year: SeasonYear): RaceWeekendSchedule[] {
  return year === '2026' ? SEASON_2026_CALENDAR : SEASON_2025_CALENDAR;
}

export function getSeasonGrid(year: SeasonYear): GridTeam[] {
  return year === '2026' ? GRID_2026_TEAMS : GRID_2025_TEAMS;
}

export function getDriverStandings(year: SeasonYear): DriverStanding[] {
  return year === '2026' ? DRIVER_STANDINGS_2026 : DRIVER_STANDINGS_2025;
}

export function getConstructorStandings(year: SeasonYear): ConstructorStanding[] {
  return year === '2026' ? CONSTRUCTOR_STANDINGS_2026 : CONSTRUCTOR_STANDINGS_2025;
}

/**
 * Determine the next upcoming round in a given season calendar.
 * Finds the earliest race where targetDateUtc is still in the future.
 * If all races have concluded, returns the final round (Round 24) or Round 1.
 */
export function getNextUpcomingRound(calendar: RaceWeekendSchedule[]): number {
  const now = new Date().getTime();
  const upcoming = calendar.find((r) => new Date(r.targetDateUtc).getTime() > now);
  if (upcoming) return upcoming.round;
  return calendar[calendar.length - 1]?.round || 1;
}

/**
 * Check if an entire season has ended (all rounds completed in the past).
 */
export function isSeasonConcluded(calendar: RaceWeekendSchedule[]): boolean {
  const now = new Date().getTime();
  return calendar.every((r) => new Date(r.targetDateUtc).getTime() <= now);
}
