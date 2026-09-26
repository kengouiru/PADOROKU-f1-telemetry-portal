/**
 * data/f1SeasonData.ts
 * Formula 1 Season Calendar, Session Timings (JST), Standings Data, and Grid Roster.
 * Includes 2026 (Active Current Season - 11 Teams, 22 Drivers), 2025 (Archive Season),
 * and 2024 historical standings.
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
  isCancelled?: boolean;       // From OpenF1 API — race was cancelled
  replacementNote?: string;    // e.g. "マレーシア(セパン)で代替開催"
  winnerNote?: string;         // e.g. "🏆 優勝: M.フェルスタッペン (Red Bull)"
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
  teamPrincipal?: string;
  points: number;
  wins: number;
}

export interface GridTeam {
  teamName: string;
  fullName: string;
  teamPrincipal?: string;
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
  reserves?: {
    number?: number;
    code: string;
    name: string;
    country: string;
    flag: string;
    note?: string;
  }[];
}

// Backward compatibility type alias
export type Grid2025Team = GridTeam;

// ─────────────────────────────────────────────────────────────
// 1. 2026 F1 OFFICIAL CALENDAR (ALL 23 ROUNDS (Bahrain cancelled, Saudi Arabia cancelled - Iran conflict) - CURRENT SEASON)
// ─────────────────────────────────────────────────────────────

export const SEASON_2026_CALENDAR: RaceWeekendSchedule[] = [
  {
    "round": 1,
    "gpName": "オーストラリアGP",
    "country": "オーストラリア",
    "flag": "🇦🇺",
    "circuitName": "アルバート・パーク・サーキット",
    "city": "メルボルン",
    "dates": "2026年 3月6日 - 3月8日",
    "targetDateUtc": "2026-03-08T04:00:00Z",
    "isSprint": false,
    "lengthKm": 5.278,
    "laps": 58,
    "pirelliCompounds": "C3 (ハード) / C4 (ミディアム) / C5 (ソフト)",
    "scheduleJst": [
      {
        "session": "FP1",
        "dayTime": "3/7 (金) 10:30"
      },
      {
        "session": "FP2",
        "dayTime": "3/7 (金) 14:00"
      },
      {
        "session": "FP3",
        "dayTime": "3/8 (土) 10:30"
      },
      {
        "session": "予選",
        "dayTime": "3/8 (土) 14:00"
      },
      {
        "session": "決勝",
        "dayTime": "3/8 (日) 13:00 スタート"
      }
    ]
  },
  {
    "round": 2,
    "gpName": "中国GP",
    "country": "中国",
    "flag": "🇨🇳",
    "circuitName": "上海インターナショナル・サーキット",
    "city": "上海",
    "dates": "2026年 3月13日 - 3月15日",
    "targetDateUtc": "2026-03-15T07:00:00Z",
    "isSprint": true,
    "lengthKm": 5.451,
    "laps": 56,
    "pirelliCompounds": "C2 (ハード) / C3 (ミディアム) / C4 (ソフト)",
    "scheduleJst": [
      {
        "session": "FP1",
        "dayTime": "3/13 (金) 12:30"
      },
      {
        "session": "スプリント予選",
        "dayTime": "3/13 (金) 16:30"
      },
      {
        "session": "スプリント決勝",
        "dayTime": "3/14 (土) 12:00"
      },
      {
        "session": "本選予選",
        "dayTime": "3/14 (土) 16:00"
      },
      {
        "session": "決勝レース",
        "dayTime": "3/15 (日) 16:00 スタート"
      }
    ]
  },
  {
    "round": 3,
    "gpName": "日本GP (鈴鹿)",
    "country": "日本",
    "flag": "🇯🇵",
    "circuitName": "鈴鹿サーキット",
    "city": "三重県鈴鹿市",
    "dates": "2026年 3月27日 - 3月29日",
    "targetDateUtc": "2026-03-29T05:00:00Z",
    "isSprint": false,
    "lengthKm": 5.807,
    "laps": 53,
    "pirelliCompounds": "C1 (ハード) / C2 (ミディアム) / C3 (ソフト)",
    "scheduleJst": [
      {
        "session": "FP1",
        "dayTime": "3/27 (金) 11:30"
      },
      {
        "session": "FP2",
        "dayTime": "3/27 (金) 15:00"
      },
      {
        "session": "FP3",
        "dayTime": "3/28 (土) 11:30"
      },
      {
        "session": "予選",
        "dayTime": "3/28 (土) 15:00"
      },
      {
        "session": "決勝",
        "dayTime": "3/29 (日) 14:00 スタート"
      }
    ]
  },
  {
    "round": 4,
    "gpName": "マイアミGP",
    "country": "アメリカ",
    "flag": "🇺🇸",
    "circuitName": "マイアミ・インターナショナル・オートドローム",
    "city": "マイアミ",
    "dates": "2026年 5月1日 - 5月3日",
    "targetDateUtc": "2026-05-03T18:00:00Z",
    "isSprint": true,
    "lengthKm": 5.412,
    "laps": 57,
    "pirelliCompounds": "C2 / C3 / C4",
    "scheduleJst": [
      {
        "session": "FP1",
        "dayTime": "5/2 (金) 02:00"
      },
      {
        "session": "スプリント予選",
        "dayTime": "5/2 (金) 06:30"
      },
      {
        "session": "スプリント決勝",
        "dayTime": "5/3 (土) 02:00"
      },
      {
        "session": "本選予選",
        "dayTime": "5/3 (土) 06:00"
      },
      {
        "session": "決勝レース",
        "dayTime": "5/4 (月) 03:00 スタート"
      }
    ]
  },
  {
    "round": 5,
    "gpName": "カナダGP",
    "country": "カナダ",
    "flag": "🇨🇦",
    "circuitName": "ジル・ヴィルヌーヴ・サーキット",
    "city": "モントリオール",
    "dates": "2026年 5月22日 - 5月24日",
    "targetDateUtc": "2026-05-24T18:00:00Z",
    "isSprint": true,
    "lengthKm": 4.361,
    "laps": 70,
    "pirelliCompounds": "C3 / C4 / C5",
    "scheduleJst": [
      {
        "session": "FP1",
        "dayTime": "5/23 (土) 02:00"
      },
      {
        "session": "スプリント予選",
        "dayTime": "5/23 (土) 06:30"
      },
      {
        "session": "スプリント決勝",
        "dayTime": "5/24 (日) 02:00"
      },
      {
        "session": "本選予選",
        "dayTime": "5/24 (日) 06:00"
      },
      {
        "session": "決勝レース",
        "dayTime": "5/25 (月) 03:00 スタート"
      }
    ]
  },
  {
    "round": 6,
    "gpName": "モナコGP",
    "country": "モナコ",
    "flag": "🇲🇨",
    "circuitName": "モンテカルロ市街地コース",
    "city": "モンテカルロ",
    "dates": "2026年 6月5日 - 6月7日",
    "targetDateUtc": "2026-06-07T13:00:00Z",
    "isSprint": false,
    "lengthKm": 3.337,
    "laps": 78,
    "pirelliCompounds": "C3 / C4 / C5 (最軟コンパウンド)",
    "scheduleJst": [
      {
        "session": "FP1",
        "dayTime": "6/5 (金) 20:30"
      },
      {
        "session": "FP2",
        "dayTime": "6/6 (土) 00:00"
      },
      {
        "session": "FP3",
        "dayTime": "6/6 (土) 19:30"
      },
      {
        "session": "予選",
        "dayTime": "6/6 (土) 23:00"
      },
      {
        "session": "決勝",
        "dayTime": "6/7 (日) 22:00 スタート"
      }
    ]
  },
  {
    "round": 7,
    "gpName": "バルセロナGP",
    "country": "スペイン",
    "flag": "🇪🇸",
    "circuitName": "カタロニア・サーキット",
    "city": "バルセロナ",
    "dates": "2026年 6月12日 - 6月14日",
    "targetDateUtc": "2026-06-14T13:00:00Z",
    "isSprint": false,
    "lengthKm": 4.657,
    "laps": 66,
    "pirelliCompounds": "C1 / C2 / C3 (高ダウンフォース)",
    "scheduleJst": [
      {
        "session": "FP1",
        "dayTime": "6/12 (金) 20:30"
      },
      {
        "session": "FP2",
        "dayTime": "6/13 (土) 00:00"
      },
      {
        "session": "FP3",
        "dayTime": "6/13 (土) 19:30"
      },
      {
        "session": "予選",
        "dayTime": "6/13 (土) 23:00"
      },
      {
        "session": "決勝",
        "dayTime": "6/14 (日) 22:00 スタート"
      }
    ]
  },
  {
    "round": 8,
    "gpName": "オーストリアGP",
    "country": "オーストリア",
    "flag": "🇦🇹",
    "circuitName": "レッドブル・リンク",
    "city": "シュピールベルク",
    "dates": "2026年 6月26日 - 6月28日",
    "targetDateUtc": "2026-06-28T13:00:00Z",
    "isSprint": false,
    "lengthKm": 4.318,
    "laps": 71,
    "pirelliCompounds": "C3 / C4 / C5",
    "scheduleJst": [
      {
        "session": "FP1",
        "dayTime": "6/26 (金) 20:30"
      },
      {
        "session": "FP2",
        "dayTime": "6/27 (土) 00:00"
      },
      {
        "session": "FP3",
        "dayTime": "6/27 (土) 19:30"
      },
      {
        "session": "予選",
        "dayTime": "6/27 (土) 23:00"
      },
      {
        "session": "決勝",
        "dayTime": "6/28 (日) 22:00 スタート"
      }
    ]
  },
  {
    "round": 9,
    "gpName": "イギリスGP (シルバーストン)",
    "country": "イギリス",
    "flag": "🇬🇧",
    "circuitName": "シルバーストン・サーキット",
    "city": "シルバーストン",
    "dates": "2026年 7月3日 - 7月5日",
    "targetDateUtc": "2026-07-05T14:00:00Z",
    "isSprint": true,
    "lengthKm": 5.891,
    "laps": 52,
    "pirelliCompounds": "C1 / C2 / C3 (超高速G負荷)",
    "scheduleJst": [
      {
        "session": "FP1",
        "dayTime": "7/3 (金) 21:30"
      },
      {
        "session": "スプリント予選",
        "dayTime": "7/4 (土) 01:30"
      },
      {
        "session": "スプリント決勝",
        "dayTime": "7/4 (土) 21:00"
      },
      {
        "session": "本選予選",
        "dayTime": "7/5 (日) 01:00"
      },
      {
        "session": "決勝レース",
        "dayTime": "7/5 (日) 23:00 スタート"
      }
    ]
  },
  {
    "round": 10,
    "gpName": "ベルギーGP (スパ)",
    "country": "ベルギー",
    "flag": "🇧🇪",
    "circuitName": "スパ・フランコルシャン",
    "city": "スパ / スタヴロ",
    "dates": "2026年 7月17日 - 7月19日",
    "targetDateUtc": "2026-07-19T13:00:00Z",
    "isSprint": false,
    "lengthKm": 7.004,
    "laps": 44,
    "pirelliCompounds": "C2 / C3 / C4 (最長サーキット)",
    "scheduleJst": [
      {
        "session": "FP1",
        "dayTime": "7/17 (金) 20:30"
      },
      {
        "session": "FP2",
        "dayTime": "7/18 (土) 00:00"
      },
      {
        "session": "FP3",
        "dayTime": "7/18 (土) 19:30"
      },
      {
        "session": "予選",
        "dayTime": "7/18 (土) 23:00"
      },
      {
        "session": "決勝",
        "dayTime": "7/19 (日) 22:00 スタート"
      }
    ]
  },
  {
    "round": 11,
    "gpName": "ハンガリーGP",
    "country": "ハンガリー",
    "flag": "🇭🇺",
    "circuitName": "ハンガロリンク",
    "city": "ブダペスト",
    "dates": "2026年 7月24日 - 7月26日",
    "targetDateUtc": "2026-07-26T13:00:00Z",
    "isSprint": false,
    "lengthKm": 4.381,
    "laps": 70,
    "pirelliCompounds": "C3 / C4 / C5 (ツイスティ・酷暑)",
    "scheduleJst": [
      {
        "session": "FP1",
        "dayTime": "7/24 (金) 20:30"
      },
      {
        "session": "FP2",
        "dayTime": "7/25 (土) 00:00"
      },
      {
        "session": "FP3",
        "dayTime": "7/25 (土) 19:30"
      },
      {
        "session": "予選",
        "dayTime": "7/25 (土) 23:00"
      },
      {
        "session": "決勝",
        "dayTime": "7/26 (日) 22:00 スタート"
      }
    ]
  },
  {
    "round": 12,
    "gpName": "オランダGP (ザントフォールト)",
    "country": "オランダ",
    "flag": "🇳🇱",
    "circuitName": "ザントフォールト・サーキット",
    "city": "ザントフォールト",
    "dates": "2026年 8月21日 - 8月23日",
    "targetDateUtc": "2026-08-23T13:00:00Z",
    "isSprint": true,
    "lengthKm": 4.259,
    "laps": 72,
    "pirelliCompounds": "C1 / C2 / C3 (急バンクコーナー)",
    "scheduleJst": [
      {
        "session": "FP1",
        "dayTime": "8/21 (金) 20:30"
      },
      {
        "session": "スプリント予選",
        "dayTime": "8/22 (土) 00:30"
      },
      {
        "session": "スプリント決勝",
        "dayTime": "8/22 (土) 20:00"
      },
      {
        "session": "本選予選",
        "dayTime": "8/23 (日) 00:00"
      },
      {
        "session": "決勝レース",
        "dayTime": "8/23 (日) 22:00 スタート"
      }
    ]
  },
  {
    "round": 13,
    "gpName": "イタリアGP (モンツァ)",
    "country": "イタリア",
    "flag": "🇮🇹",
    "circuitName": "モンツァ・サーキット",
    "city": "モンツァ",
    "dates": "2026年 9月4日 - 9月6日",
    "targetDateUtc": "2026-09-06T13:00:00Z",
    "isSprint": false,
    "lengthKm": 5.793,
    "laps": 53,
    "pirelliCompounds": "C3 / C4 / C5 (超高速の殿堂)",
    "scheduleJst": [
      {
        "session": "FP1",
        "dayTime": "9/4 (金) 20:30"
      },
      {
        "session": "FP2",
        "dayTime": "9/5 (土) 00:00"
      },
      {
        "session": "FP3",
        "dayTime": "9/5 (土) 19:30"
      },
      {
        "session": "予選",
        "dayTime": "9/5 (土) 23:00"
      },
      {
        "session": "決勝",
        "dayTime": "9/6 (日) 22:00 スタート"
      }
    ]
  },
  {
    "round": 14,
    "gpName": "スペインGP (マドリード)",
    "country": "スペイン",
    "flag": "🇪🇸",
    "circuitName": "マドリング (IFEMAマドリード市街地コース)",
    "city": "マドリード",
    "dates": "2026年 9月11日 - 9月13日",
    "targetDateUtc": "2026-09-13T13:00:00Z",
    "isSprint": false,
    "lengthKm": 5.474,
    "laps": 55,
    "pirelliCompounds": "C3 / C4 / C5 (新設ハイブリッド公道)",
    "scheduleJst": [
      {
        "session": "FP1",
        "dayTime": "9/11 (金) 20:30"
      },
      {
        "session": "FP2",
        "dayTime": "9/12 (土) 00:00"
      },
      {
        "session": "FP3",
        "dayTime": "9/12 (土) 19:30"
      },
      {
        "session": "予選",
        "dayTime": "9/12 (土) 23:00"
      },
      {
        "session": "決勝",
        "dayTime": "9/13 (日) 22:00 スタート"
      }
    ]
  },
  {
    "round": 15,
    "gpName": "アゼルバイジャンGP (バクー)",
    "country": "アゼルバイジャン",
    "flag": "🇦🇿",
    "circuitName": "バクー市街地コース",
    "city": "バクー",
    "dates": "2026年 9月24日 - 9月26日",
    "targetDateUtc": "2026-09-26T11:00:00Z",
    "isSprint": false,
    "lengthKm": 6.003,
    "laps": 51,
    "pirelliCompounds": "C3 / C4 / C5 (最長ストレート & 旧市街地)",
    "scheduleJst": [
      {
        "session": "FP1",
        "dayTime": "9/24 (木) 17:30"
      },
      {
        "session": "FP2",
        "dayTime": "9/24 (木) 21:00"
      },
      {
        "session": "FP3",
        "dayTime": "9/25 (金) 17:30"
      },
      {
        "session": "予選",
        "dayTime": "9/25 (金) 21:00"
      },
      {
        "session": "決勝",
        "dayTime": "9/26 (土) 20:00 スタート"
      }
    ]
  },
  {
    "round": 16,
    "gpName": "マレーシアGP (代替開催)",
    "country": "マレーシア",
    "flag": "🇲🇾",
    "circuitName": "セパン・インターナショナル・サーキット",
    "city": "クアラルンプール",
    "dates": "2026年 10月2日 - 10月4日",
    "targetDateUtc": "2026-10-04T07:00:00Z",
    "isSprint": false,
    "lengthKm": 5.543,
    "laps": 56,
    "pirelliCompounds": "C1 / C2 / C3 (熱帯スコール & 高熱)",
    "scheduleJst": [
      {
        "session": "FP1",
        "dayTime": "10/2 (金) 14:30"
      },
      {
        "session": "FP2",
        "dayTime": "10/2 (金) 18:00"
      },
      {
        "session": "FP3",
        "dayTime": "10/3 (土) 14:30"
      },
      {
        "session": "予選",
        "dayTime": "10/3 (土) 18:00"
      },
      {
        "session": "決勝",
        "dayTime": "10/4 (日) 16:00 スタート"
      }
    ]
  },
  {
    "round": 17,
    "gpName": "シンガポールGP (マリーナベイ)",
    "country": "シンガポール",
    "flag": "🇸🇬",
    "circuitName": "マリーナベイ・ストリート・サーキット",
    "city": "シンガポール",
    "dates": "2026年 10月9日 - 10月11日",
    "targetDateUtc": "2026-10-11T12:00:00Z",
    "isSprint": true,
    "lengthKm": 4.94,
    "laps": 62,
    "pirelliCompounds": "C3 / C4 / C5 (極限ナイトレース)",
    "scheduleJst": [
      {
        "session": "FP1",
        "dayTime": "10/9 (金) 19:30"
      },
      {
        "session": "スプリント予選",
        "dayTime": "10/9 (金) 23:30"
      },
      {
        "session": "スプリント決勝",
        "dayTime": "10/10 (土) 19:00"
      },
      {
        "session": "本選予選",
        "dayTime": "10/10 (土) 23:00"
      },
      {
        "session": "決勝レース",
        "dayTime": "10/11 (日) 21:00 スタート"
      }
    ]
  },
  {
    "round": 18,
    "gpName": "アメリカGP (オースティン)",
    "country": "アメリカ",
    "flag": "🇺🇸",
    "circuitName": "サーキット・オブ・ジ・アメリカズ (COTA)",
    "city": "オースティン",
    "dates": "2026年 10月23日 - 10月25日",
    "targetDateUtc": "2026-10-25T19:00:00Z",
    "isSprint": false,
    "lengthKm": 5.513,
    "laps": 56,
    "pirelliCompounds": "C2 / C3 / C4 (名物ターン1急坂)",
    "scheduleJst": [
      {
        "session": "FP1",
        "dayTime": "10/24 (土) 02:30"
      },
      {
        "session": "FP2",
        "dayTime": "10/24 (土) 06:00"
      },
      {
        "session": "FP3",
        "dayTime": "10/25 (日) 02:30"
      },
      {
        "session": "予選",
        "dayTime": "10/25 (日) 06:00"
      },
      {
        "session": "決勝",
        "dayTime": "10/26 (月) 04:00 スタート"
      }
    ]
  },
  {
    "round": 19,
    "gpName": "メキシコシティGP",
    "country": "メキシコ",
    "flag": "🇲🇽",
    "circuitName": "エルマノス・ロドリゲス・サーキット",
    "city": "メキシコシティ",
    "dates": "2026年 10月30日 - 11月1日",
    "targetDateUtc": "2026-11-01T20:00:00Z",
    "isSprint": false,
    "lengthKm": 4.304,
    "laps": 71,
    "pirelliCompounds": "C3 / C4 / C5 (標高2,200m希薄空気)",
    "scheduleJst": [
      {
        "session": "FP1",
        "dayTime": "10/31 (土) 03:30"
      },
      {
        "session": "FP2",
        "dayTime": "10/31 (土) 07:00"
      },
      {
        "session": "FP3",
        "dayTime": "11/1 (日) 03:30"
      },
      {
        "session": "予選",
        "dayTime": "11/1 (日) 07:00"
      },
      {
        "session": "決勝",
        "dayTime": "11/2 (月) 05:00 スタート"
      }
    ]
  },
  {
    "round": 20,
    "gpName": "サンパウロGP (インテルラゴス)",
    "country": "ブラジル",
    "flag": "🇧🇷",
    "circuitName": "アウトドローモ・ホセ・カルロス・パーチェ",
    "city": "サンパウロ",
    "dates": "2026年 11月6日 - 11月8日",
    "targetDateUtc": "2026-11-08T17:00:00Z",
    "isSprint": false,
    "lengthKm": 4.309,
    "laps": 71,
    "pirelliCompounds": "C2 / C3 / C4 (天候急変インテルラゴス)",
    "scheduleJst": [
      {
        "session": "FP1",
        "dayTime": "11/7 (土) 00:30"
      },
      {
        "session": "FP2",
        "dayTime": "11/7 (土) 04:00"
      },
      {
        "session": "FP3",
        "dayTime": "11/8 (日) 00:30"
      },
      {
        "session": "予選",
        "dayTime": "11/8 (日) 04:00"
      },
      {
        "session": "決勝",
        "dayTime": "11/9 (月) 02:00 スタート"
      }
    ]
  },
  {
    "round": 21,
    "gpName": "ラスベガスGP",
    "country": "アメリカ",
    "flag": "🇺🇸",
    "circuitName": "ラスベガス・ストリップ・サーキット",
    "city": "ラスベガス",
    "dates": "2026年 11月20日 - 11月22日",
    "targetDateUtc": "2026-11-22T06:00:00Z",
    "isSprint": false,
    "lengthKm": 6.201,
    "laps": 50,
    "pirelliCompounds": "C3 / C4 / C5 (極寒ナイトレース)",
    "scheduleJst": [
      {
        "session": "FP1",
        "dayTime": "11/20 (金) 13:30"
      },
      {
        "session": "FP2",
        "dayTime": "11/20 (金) 17:00"
      },
      {
        "session": "FP3",
        "dayTime": "11/21 (土) 13:30"
      },
      {
        "session": "予選",
        "dayTime": "11/21 (土) 17:00"
      },
      {
        "session": "決勝",
        "dayTime": "11/22 (日) 15:00 スタート"
      }
    ]
  },
  {
    "round": 22,
    "gpName": "カタールGP (ルサイル)",
    "country": "カタール",
    "flag": "🇶🇦",
    "circuitName": "ルサイル・インターナショナル・サーキット",
    "city": "ルサイル",
    "dates": "2026年 11月27日 - 11月29日",
    "targetDateUtc": "2026-11-29T14:00:00Z",
    "isSprint": false,
    "lengthKm": 5.419,
    "laps": 57,
    "pirelliCompounds": "C1 / C2 / C3 (高速連続コーナー)",
    "scheduleJst": [
      {
        "session": "FP1",
        "dayTime": "11/27 (金) 21:30"
      },
      {
        "session": "FP2",
        "dayTime": "11/28 (土) 01:00"
      },
      {
        "session": "FP3",
        "dayTime": "11/28 (土) 21:30"
      },
      {
        "session": "予選",
        "dayTime": "11/29 (日) 01:00"
      },
      {
        "session": "決勝",
        "dayTime": "11/29 (日) 23:00 スタート"
      }
    ]
  },
  {
    "round": 23,
    "gpName": "アブダビGP",
    "country": "UAE",
    "flag": "🇦🇪",
    "circuitName": "ヤス・マリーナ・サーキット",
    "city": "アブダビ",
    "dates": "2026年 12月4日 - 12月6日",
    "targetDateUtc": "2026-12-06T13:00:00Z",
    "isSprint": false,
    "lengthKm": 5.281,
    "laps": 58,
    "pirelliCompounds": "C3 / C4 / C5 (トワイライト最終決戦)",
    "scheduleJst": [
      {
        "session": "FP1",
        "dayTime": "12/4 (金) 20:30"
      },
      {
        "session": "FP2",
        "dayTime": "12/5 (土) 00:00"
      },
      {
        "session": "FP3",
        "dayTime": "12/5 (土) 19:30"
      },
      {
        "session": "予選",
        "dayTime": "12/5 (土) 23:00"
      },
      {
        "session": "決勝",
        "dayTime": "12/6 (日) 22:00 スタート"
      }
    ]
  }
];

// ─────────────────────────────────────────────────────────────
// 2. 2025 F1 CALENDAR (ARCHIVE SEASON - COMPLETED)
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
    pirelliCompounds: 'C3 / C4 / C5',
    scheduleJst: [{ session: '決勝', dayTime: '3/16 (日) 13:00 スタート' }],
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
    pirelliCompounds: 'C2 / C3 / C4',
    scheduleJst: [{ session: '決勝', dayTime: '3/23 (日) 16:00 スタート' }],
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
    pirelliCompounds: 'C1 / C2 / C3',
    scheduleJst: [{ session: '決勝', dayTime: '4/6 (日) 14:00 スタート' }],
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
    isSprint: false,
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
    city: 'スパ / スタヴロ',
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
    gpName: 'シンガポールGP (マリーナベイ)',
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
    circuitName: 'サーキット・オブ・ジ・アメリカズ (COTA)',
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
    pirelliCompounds: 'C3 / C4 / C5',
    scheduleJst: [{ session: '決勝 (ナイトレース)', dayTime: '11/23 (日) 15:00 スタート' }],
  },
  {
    round: 23,
    gpName: 'カタールGP (ルサイル)',
    country: 'カタール',
    flag: '🇶🇦',
    circuitName: 'ルサイル・インターナショナル・サーキット',
    city: 'ルサイル',
    dates: '2025年 11月28日 - 11月30日',
    targetDateUtc: '2025-11-30T17:00:00Z',
    isSprint: true,
    lengthKm: 5.419,
    laps: 57,
    pirelliCompounds: 'C1 / C2 / C3',
    scheduleJst: [{ session: '決勝 (ナイトレース)', dayTime: '12/1 (月) 02:00 スタート' }],
  },
  {
    round: 24,
    gpName: 'アブダビGP (ヤス・マリーナ)',
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
// 3. 2026 STANDINGS (OFFICIAL GROUND TRUTH THROUGH ROUND 14 MADRID)
// ─────────────────────────────────────────────────────────────

export const DRIVER_STANDINGS_2026: DriverStanding[] = [
  { position: 1, driverCode: 'ANT', driverName: 'アンドレア・キミ・アントネッリ', team: 'Mercedes', teamColor: '#27F4D2', points: 292, wins: 8, podiums: 12 },
  { position: 2, driverCode: 'RUS', driverName: 'ジョージ・ラッセル', team: 'Mercedes', teamColor: '#27F4D2', points: 211, wins: 2, podiums: 7 },
  { position: 3, driverCode: 'HAM', driverName: 'ルイス・ハミルトン', team: 'Ferrari', teamColor: '#E80020', points: 191, wins: 1, podiums: 5 },
  { position: 4, driverCode: 'NOR', driverName: 'ランド・ノリス', team: 'McLaren', teamColor: '#FF8000', points: 186, wins: 2, podiums: 5 },
  { position: 5, driverCode: 'LEC', driverName: 'シャルル・ルクレール', team: 'Ferrari', teamColor: '#E80020', points: 167, wins: 1, podiums: 4 },
  { position: 6, driverCode: 'VER', driverName: 'マックス・フェルスタッペン', team: 'Red Bull', teamColor: '#3671C6', points: 145, wins: 0, podiums: 6 },
  { position: 7, driverCode: 'PIA', driverName: 'オスカー・ピアストリ', team: 'McLaren', teamColor: '#FF8000', points: 120, wins: 0, podiums: 2 },
  { position: 8, driverCode: 'HAD', driverName: 'イサック・ハジャー', team: 'Red Bull', teamColor: '#3671C6', points: 71, wins: 0, podiums: 1 },
  { position: 9, driverCode: 'LAW', driverName: 'リアム・ローソン', team: 'RB F1 Team', teamColor: '#6692FF', points: 59, wins: 0, podiums: 0 },
  { position: 10, driverCode: 'GAS', driverName: 'ピエール・ガスリー', team: 'Alpine F1 Team', teamColor: '#0093cc', points: 41, wins: 0, podiums: 0 },
  { position: 11, driverCode: 'LIN', driverName: 'アービッド・リンドブラッド', team: 'RB F1 Team', teamColor: '#6692FF', points: 31, wins: 0, podiums: 0 },
  { position: 12, driverCode: 'COL', driverName: 'フランコ・コラピント', team: 'Alpine F1 Team', teamColor: '#0093cc', points: 27, wins: 0, podiums: 0 },
  { position: 13, driverCode: 'BEA', driverName: 'オリバー・ベアマン', team: 'Haas F1 Team', teamColor: '#B6BABD', points: 18, wins: 0, podiums: 0 },
  { position: 14, driverCode: 'BOR', driverName: 'ガブリエル・ボルトレート', team: 'Audi', teamColor: '#e0001a', points: 10, wins: 0, podiums: 0 },
  { position: 15, driverCode: 'HUL', driverName: 'ニコ・ヒュルケンベルグ', team: 'Audi', teamColor: '#e0001a', points: 7, wins: 0, podiums: 0 },
  { position: 16, driverCode: 'SAI', driverName: 'カルロス・サインツ', team: 'Williams', teamColor: '#00A0DE', points: 6, wins: 0, podiums: 0 },
  { position: 17, driverCode: 'ALB', driverName: 'アレクサンダー・アルボン', team: 'Williams', teamColor: '#00A0DE', points: 5, wins: 0, podiums: 0 },
  { position: 18, driverCode: 'OCO', driverName: 'エステバン・オコン', team: 'Haas F1 Team', teamColor: '#B6BABD', points: 3, wins: 0, podiums: 0 },
  { position: 19, driverCode: 'ALO', driverName: 'フェルナンド・アロンソ', team: 'Aston Martin', teamColor: '#229971', points: 3, wins: 0, podiums: 0 },
  { position: 20, driverCode: 'TSU', driverName: '角田裕毅', team: 'RB F1 Team', teamColor: '#6692FF', points: 1, wins: 0, podiums: 0 },
  { position: 21, driverCode: 'STR', driverName: 'ランス・ストロール', team: 'Aston Martin', teamColor: '#229971', points: 0, wins: 0, podiums: 0 },
  { position: 22, driverCode: 'BOT', driverName: 'バルテリ・ボッタス', team: 'Cadillac F1 Team', teamColor: '#D4AF37', points: 0, wins: 0, podiums: 0 },
  { position: 23, driverCode: 'PER', driverName: 'セルジオ・ペレス', team: 'Cadillac F1 Team', teamColor: '#D4AF37', points: 0, wins: 0, podiums: 0 },
];

export const CONSTRUCTOR_STANDINGS_2026: ConstructorStanding[] = [
  { position: 1, teamName: 'Mercedes', teamColor: '#27F4D2', powerUnit: 'Mercedes', teamPrincipal: 'Toto Wolff', points: 503, wins: 10 },
  { position: 2, teamName: 'Ferrari', teamColor: '#E80020', powerUnit: 'Ferrari', teamPrincipal: 'Frédéric Vasseur', points: 358, wins: 2 },
  { position: 3, teamName: 'McLaren', teamColor: '#FF8000', powerUnit: 'Mercedes', teamPrincipal: 'Andrea Stella', points: 306, wins: 2 },
  { position: 4, teamName: 'Red Bull', teamColor: '#3671C6', powerUnit: 'Red Bull Ford', teamPrincipal: 'Christian Horner', points: 230, wins: 0 },
  { position: 5, teamName: 'RB F1 Team', teamColor: '#6692FF', powerUnit: 'Red Bull Ford', teamPrincipal: 'Laurent Mekies', points: 77, wins: 0 },
  { position: 6, teamName: 'Alpine F1 Team', teamColor: '#0093cc', powerUnit: 'Mercedes', teamPrincipal: 'Oliver Oakes', points: 68, wins: 0 },
  { position: 7, teamName: 'Haas F1 Team', teamColor: '#B6BABD', powerUnit: 'Ferrari', teamPrincipal: 'Ayao Komatsu', points: 21, wins: 0 },
  { position: 8, teamName: 'Audi', teamColor: '#e0001a', powerUnit: 'Audi Works', teamPrincipal: 'Mattia Binotto', points: 17, wins: 0 },
  { position: 9, teamName: 'Williams', teamColor: '#00A0DE', powerUnit: 'Mercedes', teamPrincipal: 'James Vowles', points: 11, wins: 0 },
  { position: 10, teamName: 'Aston Martin', teamColor: '#229971', powerUnit: 'Honda Works', teamPrincipal: 'Mike Krack', points: 3, wins: 0 },
  { position: 11, teamName: 'Cadillac F1 Team', teamColor: '#D4AF37', powerUnit: 'Ferrari', teamPrincipal: 'Mario Andretti', points: 0, wins: 0 },
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
  { position: 20, driverCode: 'COL', driverName: 'フランコ・コラピント', team: 'Alpine', teamColor: '#0093cc', points: 5, wins: 0, podiums: 0 },
];

export const CONSTRUCTOR_STANDINGS_2025: ConstructorStanding[] = [
  { position: 1, teamName: 'McLaren', teamColor: '#FF8000', powerUnit: 'Mercedes', points: 730, wins: 11 },
  { position: 2, teamName: 'Scuderia Ferrari', teamColor: '#E80020', powerUnit: 'Ferrari', points: 610, wins: 5 },
  { position: 3, teamName: 'Red Bull Racing', teamColor: '#3671C6', powerUnit: 'Honda RBPT',
    teamPrincipal: 'Laurent Mekies', points: 433, wins: 7 },
  { position: 4, teamName: 'Mercedes-AMG', teamColor: '#27F4D2', powerUnit: 'Mercedes', points: 312, wins: 1 },
  { position: 5, teamName: 'Williams', teamColor: '#00A0DE', powerUnit: 'Mercedes', points: 124, wins: 0 },
  { position: 6, teamName: 'Aston Martin', teamColor: '#229971', powerUnit: 'Mercedes',
    teamPrincipal: 'Adrian Newey', points: 84, wins: 0 },
  { position: 7, teamName: 'RB (Visa Cash App)', teamColor: '#6692FF', powerUnit: 'Honda RBPT', points: 62, wins: 0 },
  { position: 8, teamName: 'Haas F1 Team', teamColor: '#B6BABD', powerUnit: 'Ferrari', points: 46, wins: 0 },
  { position: 9, teamName: 'Kick Sauber', teamColor: '#52e252', powerUnit: 'Ferrari', points: 40, wins: 0 },
  { position: 10, teamName: 'Alpine', teamColor: '#0093cc', powerUnit: 'Renault',
    teamPrincipal: 'Flavio Briatore / Steve Nielsen', points: 31, wins: 0 },
];

// ─────────────────────────────────────────────────────────────
// 5. 2024 STANDINGS ARCHIVE (ACTUAL OFFICIAL RESULTS)
// ─────────────────────────────────────────────────────────────

export const DRIVER_STANDINGS_2024: DriverStanding[] = [
  { position: 1, driverCode: 'VER', driverName: 'マックス・フェルスタッペン', team: 'Red Bull Racing', teamColor: '#3671C6', points: 437, wins: 9, podiums: 14 },
  { position: 2, driverCode: 'NOR', driverName: 'ランド・ノリス', team: 'McLaren', teamColor: '#FF8000', points: 374, wins: 3, podiums: 12 },
  { position: 3, driverCode: 'LEC', driverName: 'シャルル・ルクレール', team: 'Scuderia Ferrari', teamColor: '#E80020', points: 356, wins: 3, podiums: 13 },
  { position: 4, driverCode: 'PIA', driverName: 'オスカー・ピアストリ', team: 'McLaren', teamColor: '#FF8000', points: 292, wins: 2, podiums: 8 },
  { position: 5, driverCode: 'SAI', driverName: 'カルロス・サインツ', team: 'Scuderia Ferrari', teamColor: '#E80020', points: 290, wins: 2, podiums: 9 },
  { position: 6, driverCode: 'RUS', driverName: 'ジョージ・ラッセル', team: 'Mercedes-AMG', teamColor: '#27F4D2', points: 245, wins: 2, podiums: 4 },
  { position: 7, driverCode: 'HAM', driverName: 'ルイス・ハミルトン', team: 'Mercedes-AMG', teamColor: '#27F4D2', points: 223, wins: 2, podiums: 4 },
  { position: 8, driverCode: 'PER', driverName: 'セルジオ・ペレス', team: 'Red Bull Racing', teamColor: '#3671C6', points: 152, wins: 0, podiums: 4 },
  { position: 9, driverCode: 'ALO', driverName: 'フェルナンド・アロンソ', team: 'Aston Martin', teamColor: '#229971', points: 70, wins: 0, podiums: 0 },
  { position: 10, driverCode: 'GAS', driverName: 'ピエール・ガスリー', team: 'Alpine', teamColor: '#0093cc', points: 26, wins: 0, podiums: 1 },
  { position: 11, driverCode: 'HUL', driverName: 'ニコ・ヒュルケンベルグ', team: 'Haas F1 Team', teamColor: '#B6BABD', points: 41, wins: 0, podiums: 0 },
  { position: 12, driverCode: 'TSU', driverName: '角田裕毅', team: 'RB', teamColor: '#6692FF', points: 30, wins: 0, podiums: 0 },
  { position: 13, driverCode: 'STR', driverName: 'ランス・ストロール', team: 'Aston Martin', teamColor: '#229971', points: 24, wins: 0, podiums: 0 },
  { position: 14, driverCode: 'OCO', driverName: 'エステバン・オコン', team: 'Alpine', teamColor: '#0093cc', points: 23, wins: 0, podiums: 1 },
  { position: 15, driverCode: 'MAG', driverName: 'ケビン・マグヌッセン', team: 'Haas F1 Team', teamColor: '#B6BABD', points: 16, wins: 0, podiums: 0 },
  { position: 16, driverCode: 'ALB', driverName: 'アレクサンダー・アルボン', team: 'Williams', teamColor: '#00A0DE', points: 12, wins: 0, podiums: 0 },
  { position: 17, driverCode: 'RIC', driverName: 'ダニエル・リカルド', team: 'RB', teamColor: '#6692FF', points: 12, wins: 0, podiums: 0 },
  { position: 18, driverCode: 'BEA', driverName: 'オリバー・ベアマン', team: 'Scuderia Ferrari / Haas', teamColor: '#E80020', points: 7, wins: 0, podiums: 0 },
  { position: 19, driverCode: 'COL', driverName: 'フランコ・コラピント', team: 'Williams', teamColor: '#00A0DE', points: 5, wins: 0, podiums: 0 },
  { position: 20, driverCode: 'LAW', driverName: 'リアム・ローソン', team: 'RB', teamColor: '#6692FF', points: 4, wins: 0, podiums: 0 },
];

export const CONSTRUCTOR_STANDINGS_2024: ConstructorStanding[] = [
  { position: 1, teamName: 'McLaren', teamColor: '#FF8000', powerUnit: 'Mercedes', points: 666, wins: 5 },
  { position: 2, teamName: 'Scuderia Ferrari', teamColor: '#E80020', powerUnit: 'Ferrari', points: 652, wins: 5 },
  { position: 3, teamName: 'Red Bull Racing', teamColor: '#3671C6', powerUnit: 'Honda RBPT', points: 589, wins: 9 },
  { position: 4, teamName: 'Mercedes-AMG', teamColor: '#27F4D2', powerUnit: 'Mercedes', points: 468, wins: 4 },
  { position: 5, teamName: 'Aston Martin', teamColor: '#229971', powerUnit: 'Mercedes', points: 94, wins: 0 },
  { position: 6, teamName: 'Alpine', teamColor: '#0093cc', powerUnit: 'Renault', points: 49, wins: 0 },
  { position: 7, teamName: 'Haas F1 Team', teamColor: '#B6BABD', powerUnit: 'Ferrari', points: 58, wins: 0 },
  { position: 8, teamName: 'RB (Visa Cash App)', teamColor: '#6692FF', powerUnit: 'Honda RBPT', points: 46, wins: 0 },
  { position: 9, teamName: 'Williams', teamColor: '#00A0DE', powerUnit: 'Mercedes', points: 17, wins: 0 },
  { position: 10, teamName: 'Kick Sauber', teamColor: '#52e252', powerUnit: 'Ferrari', points: 4, wins: 0 },
];

// ─────────────────────────────────────────────────────────────
// 6. GRID ROSTERS (2026: 11 TEAMS / 22 DRIVERS, 2025: 10 TEAMS)
// ─────────────────────────────────────────────────────────────

export const GRID_2026_TEAMS: GridTeam[] = [
  {
    teamName: 'Mercedes',
    fullName: 'Mercedes-AMG PETRONAS F1 Team',
    teamColor: '#27F4D2',
    powerUnit: 'Mercedes M17 Works',
    teamPrincipal: 'Toto Wolff',
    drivers: [
      { number: 63, code: 'RUS', name: 'ジョージ・ラッセル', country: '英国', flag: '🇬🇧', note: '圧倒的スピードで選手権2位につけるリーダー' },
      { number: 12, code: 'ANT', name: 'アンドレア・キミ・アントネッリ', country: 'イタリア', flag: '🇮🇹', note: 'モンツァで19番手から歴史的勝利！選手権首位独走中' },
    ],
  },
  {
    teamName: 'Ferrari',
    fullName: 'Scuderia Ferrari HP',
    teamColor: '#E80020',
    powerUnit: 'Ferrari 067/3 Works',
    teamPrincipal: 'Frédéric Vasseur',
    drivers: [
      { number: 16, code: 'LEC', name: 'シャルル・ルクレール', country: 'モナコ', flag: '🇲🇨', note: '伝統のマラネロを牽引する絶対的エース' },
      { number: 44, code: 'HAM', name: 'ルイス・ハミルトン', country: '英国', flag: '🇬🇧', isTransfer: false, note: '跳ね馬での2年目、通算8冠を射程に捉える' },
    ],
  },
  {
    teamName: 'McLaren',
    teamPrincipal: 'Andrea Stella',
    fullName: 'McLaren Formula 1 Team',
    teamColor: '#FF8000',
    powerUnit: 'Mercedes M17 High-Efficiency',
    drivers: [
      { number: 4, code: 'NOR', name: 'ランド・ノリス', country: '英国', flag: '🇬🇧', note: '2025年王者として王座防衛に挑む' },
      { number: 81, code: 'PIA', name: 'オスカー・ピアストリ', country: '豪州', flag: '🇦🇺', note: '冷静沈着なレース運びで表彰台常連' },
    ],
  },
  {
    teamName: 'Red Bull Racing',
    teamPrincipal: 'Laurent Mekies',
    fullName: 'Oracle Red Bull Racing',
    teamColor: '#3671C6',
    powerUnit: 'Red Bull Ford Powertrains',
    drivers: [
      { number: 1, code: 'VER', name: 'マックス・フェルスタッペン', country: 'オランダ', flag: '🇳🇱', note: '新規定・フォード新時代でも勝利をもぎ取る王者' },
      { number: 6, code: 'HAD', name: 'イサック・ハジャー', country: 'フランス', flag: '🇫🇷', isTransfer: true, note: 'レッドブル昇格を果たしたアグレッシブな新鋭' },
    ],
  },
  {
    teamName: 'Racing Bulls (RB)',
    fullName: 'Visa Cash App RB Formula One Team',
    teamColor: '#6692FF',
    powerUnit: 'Red Bull Ford Powertrains',
    teamPrincipal: 'Alan Permane',
    drivers: [
      { number: 22, code: 'TSU', name: '角田裕毅', country: '日本', flag: '🇯🇵', note: '第12戦より出走。成熟したドライビングでモンツァ10位入賞' },
      { number: 41, code: 'LIN', name: 'アービッド・リンドブラッド', country: '英国', flag: '🇬🇧', isRookie: true, note: 'レッドブル育成の超新星ルーキー。今季31pt獲得' },
      { number: 30, code: 'LAW', name: 'リアム・ローソン', country: 'NZ', flag: '🇳🇿', isTransfer: true, note: '前半戦RBで好走し第12戦よりレッドブル本隊へ昇格' },
    ],
  },
  {
    teamName: 'Williams',
    teamPrincipal: 'James Vowles',
    fullName: 'Williams Racing',
    teamColor: '#00A0DE',
    powerUnit: 'Mercedes',
    drivers: [
      { number: 23, code: 'ALB', name: 'アレクサンダー・アルボン', country: 'タイ', flag: '🇹🇭', note: 'ウィリアムズの躍進を支える大黒柱' },
      { number: 55, code: 'SAI', name: 'カルロス・サインツ', country: 'スペイン', flag: '🇪🇸', note: '卓越した開発力とレースクラフトで中団を席巻' },
    ],
  },
  {
    teamName: 'Alpine',
    teamPrincipal: 'Flavio Briatore / Steve Nielsen',
    fullName: 'BWT Alpine F1 Team',
    teamColor: '#0093cc',
    powerUnit: 'Mercedes (新搭載)',
    drivers: [
      { number: 10, code: 'GAS', name: 'ピエール・ガスリー', country: 'フランス', flag: '🇫🇷', note: 'メルセデスPUへ換装しパワー改善、チームリーダー' },
      { number: 43, code: 'COL', name: 'フランコ・コラピント', country: 'アルゼンチン', flag: '🇦🇷', note: 'アルゼンチンの熱狂を背負う若き天才' },
    ],
  },
  {
    teamName: 'Aston Martin',
    teamPrincipal: 'Adrian Newey',
    fullName: 'Aston Martin Aramco F1 Team',
    teamColor: '#229971',
    powerUnit: 'Honda Works PU (RA626H)',
    drivers: [
      { number: 14, code: 'ALO', name: 'フェルナンド・アロンソ', country: 'スペイン', flag: '🇪🇸', note: 'ホンダ完全ワークスPUとともに悲願の33勝目へ' },
      { number: 18, code: 'STR', name: 'ランス・ストロール', country: 'カナダ', flag: '🇨🇦', note: '新ファクトリー体制で安定した入賞を狙う' },
    ],
  },
  {
    teamName: 'Haas',
    fullName: 'MoneyGram Haas F1 Team',
    teamColor: '#B6BABD',
    powerUnit: 'Ferrari',
    teamPrincipal: 'Ayao Komatsu (小松礼雄)',
    drivers: [
      { number: 31, code: 'OCO', name: 'エステバン・オコン', country: 'フランス', flag: '🇫🇷', note: '堅実なレースクラフトでポイントを死守' },
      { number: 87, code: 'BEA', name: 'オリバー・ベアマン', country: '英国', flag: '🇬🇧', note: 'フェラーリ育成の大器、2年目の大躍進' },
    ],
  },
  {
    teamName: 'Audi F1 Team',
    teamPrincipal: 'Mattia Binotto',
    fullName: 'Audi Revolut F1 Team',
    teamColor: '#e0001a',
    powerUnit: 'Audi Works E-Performance',
    drivers: [
      { number: 27, code: 'HUL', name: 'ニコ・ヒュルケンベルグ', country: 'ドイツ', flag: '🇩🇪', isTransfer: true, note: 'ドイツ名門アウディのF1参戦初年度ワークスエース' },
      { number: 5, code: 'BOR', name: 'ガブリエル・ボルトレート', country: 'ブラジル', flag: '🇧🇷', note: 'F3・F2王者からアウディワークスドライバーへ' },
    ],
  },
  {
    teamName: 'Cadillac',
    fullName: 'Cadillac Formula 1 Team',
    teamColor: '#D4AF37',
    powerUnit: 'Ferrari Works Power Unit',
    teamPrincipal: 'Marcin Budkowski',
    drivers: [
      { number: 11, code: 'PER', name: 'セルジオ・ペレス', country: 'メキシコ', flag: '🇲🇽', isTransfer: true, note: '名門キャデラックの初代エースとして電撃就任' },
      { number: 77, code: 'BOT', name: 'バルテリ・ボッタス', country: 'フィンランド', flag: '🇫🇮', isTransfer: true, note: '豊富な勝利経験で第11の新チームを牽引' },
    ],
  },
];

export const GRID_2025_TEAMS: GridTeam[] = [
  {
    teamName: 'McLaren',
    fullName: 'McLaren Formula 1 Team',
    teamColor: '#FF8000',
    powerUnit: 'Mercedes',
    teamPrincipal: 'Andrea Stella',
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
    teamPrincipal: 'Frédéric Vasseur',
    drivers: [
      { number: 16, code: 'LEC', name: 'シャルル・ルクレール', country: 'モナコ', flag: '🇲🇨' },
      { number: 44, code: 'HAM', name: 'ルイス・ハミルトン', country: '英国', flag: '🇬🇧', isTransfer: true, note: 'メルセデスから電撃移籍！跳ね馬へ' },
    ],
  },
  {
    teamName: 'Red Bull Racing',
    fullName: 'Oracle Red Bull Racing',
    teamColor: '#3671C6',
    powerUnit: 'Honda RBPT',
    teamPrincipal: 'Christian Horner',
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
    teamPrincipal: 'Toto Wolff',
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
    teamPrincipal: 'Mike Krack',
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
    teamPrincipal: 'Oliver Oakes',
    drivers: [
      { number: 10, code: 'GAS', name: 'ピエール・ガスリー', country: 'フランス', flag: '🇫🇷' },
      { number: 43, code: 'COL', name: 'フランコ・コラピント', country: 'アルゼンチン', flag: '🇦🇷', isRookie: true, note: 'シーズン途中昇格の大型ルーキー' },
    ],
  },
  {
    teamName: 'Haas',
    fullName: 'MoneyGram Haas F1 Team',
    teamColor: '#B6BABD',
    powerUnit: 'Ferrari',
    drivers: [
      { number: 31, code: 'OCO', name: 'エステバン・オコン', country: 'フランス', flag: '🇫🇷', isTransfer: true, note: 'アルピーヌから新加入' },
      { number: 87, code: 'BEA', name: 'オリバー・ベアマン', country: '英国', flag: '🇬🇧', isRookie: true, note: 'フェラーリ育成からフル参戦' },
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
    teamPrincipal: 'James Vowles',
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
    teamPrincipal: 'Mattia Binotto',
    drivers: [
      { number: 27, code: 'HUL', name: 'ニコ・ヒュルケンベルグ', country: 'ドイツ', flag: '🇩🇪', isTransfer: true, note: 'アウディワークス化を見据えたベテラン獲得' },
      { number: 5, code: 'BOR', name: 'ガブリエル・ボルトレート', country: 'ブラジル', flag: '🇧🇷', isRookie: true, note: 'F3・F2連続王者の最強大型ルーキー' },
    ],
  },
];

// ─────────────────────────────────────────────────────────────
// 7. SEASON TRANSITION & DYNAMIC RESOLUTION HELPERS
// ─────────────────────────────────────────────────────────────

export type SeasonYear = '2026' | '2025' | '2024' | '2023' | '2022' | '2021' | '2020' | '2019' | '2018';

import { getHistoricalArchive } from './f1HistoricalArchivesData';

const HISTORICAL_TEAM_COLORS: Record<string, string> = {
  'Red Bull': '#3671C6',
  'Red Bull Racing': '#3671C6',
  'Mercedes': '#27F4D2',
  'Mercedes-AMG': '#27F4D2',
  'Ferrari': '#E80020',
  'Scuderia Ferrari': '#E80020',
  'McLaren': '#FF8000',
  'Alpine': '#0093cc',
  'Alpine F1 Team': '#0093cc',
  'Aston Martin': '#229971',
  'Williams': '#00A0DE',
  'Haas': '#B6BABD',
  'Haas F1 Team': '#B6BABD',
  'AlphaTauri': '#5E8FAA',
  'RB': '#6692FF',
  'RB F1 Team': '#6692FF',
  'Alfa Romeo': '#900000',
  'Kick Sauber': '#52e252',
  'Audi': '#e0001a',
  'Cadillac': '#D4AF37',
  'Cadillac F1 Team': '#D4AF37',
};

function resolveHistoricalTeamColor(teamName: string): string {
  for (const [key, color] of Object.entries(HISTORICAL_TEAM_COLORS)) {
    if (teamName.toLowerCase().includes(key.toLowerCase())) return color;
  }
  return '#94A3B8';
}

/**
 * Automatically determine which season should be actively displayed by default.
 * If current calendar year is 2026 or later, default to 2026.
 */
export function getActiveSeasonYear(): SeasonYear {
  const currentYear = new Date().getFullYear();
  if (currentYear >= 2026) return '2026';
  return '2025';
}

const JAPANESE_GP_NAMES_MAP: Record<string, string> = {
  'australian grand prix': 'オーストラリアGP',
  'bahrain grand prix': 'バーレーンGP',
  'chinese grand prix': '中国GP',
  'azerbaijan grand prix': 'アゼルバイジャンGP',
  'spanish grand prix': 'スペインGP',
  'monaco grand prix': 'モナコGP',
  'canadian grand prix': 'カナダGP',
  'french grand prix': 'フランスGP',
  'austrian grand prix': 'オーストリアGP',
  'british grand prix': 'イギリスGP',
  'german grand prix': 'ドイツGP',
  'hungarian grand prix': 'ハンガリーGP',
  'belgian grand prix': 'ベルギーGP',
  'italian grand prix': 'イタリアGP',
  'singapore grand prix': 'シンガポールGP',
  'russian grand prix': 'ロシアGP',
  'japanese grand prix': '日本GP (鈴鹿)',
  'united states grand prix': 'アメリカGP (COTA)',
  'mexican grand prix': 'メキシコGP',
  'mexico city grand prix': 'メキシコシティGP',
  'brazilian grand prix': 'ブラジルGP',
  'são paulo grand prix': 'サンパウロGP',
  'sao paulo grand prix': 'サンパウロGP',
  'abu dhabi grand prix': 'アブダビGP',
  'saudi arabian grand prix': 'サウジアラビアGP',
  'miami grand prix': 'マイアミGP',
  'emilia romagna grand prix': 'エミリア・ロマーニャGP (イモラ)',
  'dutch grand prix': 'オランダGP',
  'qatar grand prix': 'カタールGP',
  'las vegas grand prix': 'ラスベガスGP',
  'portuguese grand prix': 'ポルトガルGP',
  'turkish grand prix': 'トルコGP',
  'styrian grand prix': 'シュタイアーマルクGP',
  '70th anniversary grand prix': '70周年記念GP',
  'tuscan grand prix': 'トスカーナGP',
  'eifel grand prix': 'アイフェルGP',
  'sakhir grand prix': 'サヒールGP',
  'madrid grand prix': 'マドリードGP',
  'malaysian grand prix': 'マレーシアGP',
};

export function toJapaneseGpName(name: string): string {
  if (!name) return '';
  const lower = name.trim().toLowerCase();
  if (JAPANESE_GP_NAMES_MAP[lower]) return JAPANESE_GP_NAMES_MAP[lower];
  return name.replace(/\s+Grand\s+Prix/i, 'GP');
}

export function formatArchiveDates(isoDate: string): string {
  const m = isoDate.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return isoDate;
  const [, y, mo, d] = m;
  return `${y}年 ${parseInt(mo, 10)}月${parseInt(d, 10)}日`;
}

/**
 * Official F1 Sprint Rounds by Season (Ground Truth via FIA & Ergast/Jolpica)
 * - 2018-2020: 0 Sprints (Sprint format introduced in 2021)
 * - 2021: 3 Sprints (R10 Silverstone, R14 Monza, R19 Interlagos)
 * - 2022: 3 Sprints (R4 Imola, R11 Red Bull Ring, R21 Interlagos)
 * - 2023: 6 Sprints (R4 Baku, R9 Red Bull Ring, R12 Spa, R17 Lusail, R18 COTA, R20 Interlagos)
 * - 2024: 6 Sprints (R5 Shanghai, R6 Miami, R11 Red Bull Ring, R19 COTA, R21 Interlagos, R23 Lusail)
 * - 2025: 6 Sprints (R2 Shanghai, R6 Miami, R13 Spa, R19 COTA, R21 Interlagos, R23 Lusail)
 * - 2026: 6 Sprints (R2 Shanghai, R4 Miami, R5 Montreal, R9 Silverstone, R12 Zandvoort, R17 Marina Bay)
 */
export const HISTORICAL_SPRINT_ROUNDS: Record<number, number[]> = {
  2021: [10, 14, 19],
  2022: [4, 11, 21],
  2023: [4, 9, 12, 17, 18, 20],
  2024: [5, 6, 11, 19, 21, 23],
  2025: [2, 6, 13, 19, 21, 23],
  2026: [2, 4, 5, 9, 12, 17],
};

export function getSeasonCalendar(year: SeasonYear): RaceWeekendSchedule[] {
  if (year === '2026') return SEASON_2026_CALENDAR;
  if (year === '2025') return SEASON_2025_CALENDAR;
  const numYear = parseInt(year, 10);
  const sprintRounds = HISTORICAL_SPRINT_ROUNDS[numYear] || [];
  const archive = getHistoricalArchive(numYear);
  if (archive) {
    return archive.calendar.map((c) => {
      const isSprint = sprintRounds.includes(c.round);
      return {
        round: c.round,
        gpName: toJapaneseGpName(c.raceName),
        country: c.country,
        flag: c.flag,
        circuitName: c.circuitName,
        city: c.city,
        dates: formatArchiveDates(c.date),
        targetDateUtc: `${c.date}T12:00:00Z`,
        isSprint,
        lengthKm: 5.0,
        laps: 50,
        pirelliCompounds: 'Pirelli F1 Archive',
        scheduleJst: isSprint ? [
          { session: 'スプリント予選', dayTime: `${c.date} (公式スプリント予選)` },
          { session: 'スプリント決勝', dayTime: `${c.date} (公式スプリント)` },
          { session: '本選予選', dayTime: `${c.date} (公式予選)` },
          { session: '決勝', dayTime: `${c.date} (公式決勝)` },
        ] : [
          { session: '予選', dayTime: `${c.date} (公式予選)` },
          { session: '決勝', dayTime: `${c.date} (公式決勝)` },
        ],
        winnerNote: c.winner ? `🏆 優勝: ${c.winner.driverName} (${c.winner.constructorName})` : undefined,
      };
    });
  }
  return SEASON_2025_CALENDAR;
}

export function getSeasonGrid(year: SeasonYear): GridTeam[] {
  if (year === '2026') return GRID_2026_TEAMS;
  return GRID_2025_TEAMS;
}

export function getDriverStandings(year: SeasonYear): DriverStanding[] {
  if (year === '2026') return DRIVER_STANDINGS_2026;
  if (year === '2025') return DRIVER_STANDINGS_2025;
  if (year === '2024') return DRIVER_STANDINGS_2024;
  const archive = getHistoricalArchive(parseInt(year, 10));
  if (archive) {
    return archive.driverStandings.map((d) => ({
      position: d.position,
      driverCode: d.driverCode,
      driverName: d.driverName,
      team: d.team,
      teamColor: resolveHistoricalTeamColor(d.team),
      points: d.points,
      wins: d.wins,
      podiums: 0,
    }));
  }
  return DRIVER_STANDINGS_2025;
}

export function getConstructorStandings(year: SeasonYear): ConstructorStanding[] {
  if (year === '2026') return CONSTRUCTOR_STANDINGS_2026;
  if (year === '2025') return CONSTRUCTOR_STANDINGS_2025;
  if (year === '2024') return CONSTRUCTOR_STANDINGS_2024;
  const archive = getHistoricalArchive(parseInt(year, 10));
  if (archive) {
    return archive.constructorStandings.map((c) => ({
      position: c.position,
      teamName: c.teamName,
      teamColor: resolveHistoricalTeamColor(c.teamName),
      powerUnit: 'Historical PU',
      points: c.points,
      wins: c.wins,
    }));
  }
  return CONSTRUCTOR_STANDINGS_2025;
}

/**
 * Determine the active / next upcoming round in a given season calendar.
 * Considers a round active if:
 * 1. The race start time is still in the future, OR
 * 2. The race has started but official results/classification are not yet finalized:
 *    - In-race & post-race grace period (up to 6 hours after race start covers race runtime + steward deliberations)
 *    - No official winner/result recorded yet (up to 24 hours after race start)
 * Does NOT advance to the next round until the current round's race is truly concluded and official results are in.
 */
export function getNextUpcomingRound(calendar: RaceWeekendSchedule[]): number {
  const now = new Date().getTime();
  const MAX_RESULT_PENDING_MS = 24 * 60 * 60 * 1000; // Up to 24 hours while waiting for official classification

  const activeOrUpcoming = calendar.find((r) => {
    // Skip cancelled races that have no replacement
    if (r.isCancelled && !r.replacementNote) return false;

    const startTime = new Date(r.targetDateUtc).getTime();
    if (isNaN(startTime)) return false;

    // 1. Race is in the future
    if (startTime > now) return true;

    // If official result/winner is already recorded, this round is concluded
    if (r.winnerNote) return false;

    // 2. Race has started, but official results/rankings are not yet obtained (up to 24 hours)
    const elapsedSinceStart = now - startTime;
    if (elapsedSinceStart >= 0 && elapsedSinceStart < MAX_RESULT_PENDING_MS) {
      return true;
    }

    return false;
  });

  if (activeOrUpcoming) return activeOrUpcoming.round;
  return calendar[calendar.length - 1]?.round || 1;
}

/**
 * Check if an entire season has ended (all rounds completed in the past and concluded).
 */
export function isSeasonConcluded(calendar: RaceWeekendSchedule[]): boolean {
  const now = new Date().getTime();
  const POST_RACE_GRACE_MS = 6 * 60 * 60 * 1000;
  return calendar.every((r) => {
    const startTime = new Date(r.targetDateUtc).getTime();
    if (isNaN(startTime)) return true;
    // If future or within grace period without winner, season is not concluded
    if (startTime > now) return false;
    if (now - startTime < POST_RACE_GRACE_MS) return false;
    return true;
  });
}


