/**
 * lib/f1CalendarService.ts
 * Fetches F1 calendar from Jolpica API (Ergast successor) + OpenF1 API.
 * Provides Japanese-localized race data with cancellation status.
 */

import { type RaceWeekendSchedule, SEASON_2026_CALENDAR } from '@/data/f1SeasonData';

// ─── Jolpica API Types ───────────────────────────────────────

interface JolpicaLocation {
  lat: string;
  long: string;
  locality: string;
  country: string;
}

interface JolpicaCircuit {
  circuitId: string;
  url: string;
  circuitName: string;
  Location: JolpicaLocation;
}

interface JolpicaSession {
  date: string;
  time: string;
}

interface JolpicaRace {
  season: string;
  round: string;
  url: string;
  raceName: string;
  Circuit: JolpicaCircuit;
  date: string;
  time: string;
  FirstPractice?: JolpicaSession;
  SecondPractice?: JolpicaSession;
  ThirdPractice?: JolpicaSession;
  Qualifying?: JolpicaSession;
  Sprint?: JolpicaSession;
  SprintQualifying?: JolpicaSession;
}

interface JolpicaResponse {
  MRData: {
    total: string;
    RaceTable: {
      season: string;
      Races: JolpicaRace[];
    };
  };
}

// ─── OpenF1 API Types ────────────────────────────────────────

interface OpenF1Session {
  session_key: number;
  session_type: string;
  session_name: string;
  date_start: string;
  meeting_key: number;
  circuit_short_name: string;
  country_code: string;
  country_name: string;
  location: string;
  year: number;
  is_cancelled: boolean;
}

// ─── Extended return type (alias for clarity) ───────────────

export type OfficialRaceSchedule = RaceWeekendSchedule;

// ─── Japanese Name Mapping ───────────────────────────────────

interface CircuitJpInfo {
  gpName: string;
  circuitName: string;
  city: string;
  country: string;
  flag: string;
  lengthKm: number;
  laps: number;
  pirelliCompounds: string;
}

const CIRCUIT_JP_NAMES: Record<string, CircuitJpInfo> = {
  albert_park: { gpName: 'オーストラリアGP', circuitName: 'アルバート・パーク・サーキット', city: 'メルボルン', country: 'オーストラリア', flag: '🇦🇺', lengthKm: 5.278, laps: 58, pirelliCompounds: 'C3 (ハード) / C4 (ミディアム) / C5 (ソフト)' },
  shanghai: { gpName: '中国GP', circuitName: '上海インターナショナル・サーキット', city: '上海', country: '中国', flag: '🇨🇳', lengthKm: 5.451, laps: 56, pirelliCompounds: 'C2 (ハード) / C3 (ミディアム) / C4 (ソフト)' },
  suzuka: { gpName: '日本GP (鈴鹿)', circuitName: '鈴鹿サーキット', city: '三重県鈴鹿市', country: '日本', flag: '🇯🇵', lengthKm: 5.807, laps: 53, pirelliCompounds: 'C1 (ハード) / C2 (ミディアム) / C3 (ソフト)' },
  bahrain: { gpName: 'バーレーンGP', circuitName: 'バーレーン・インターナショナル・サーキット', city: 'サヒール', country: 'バーレーン', flag: '🇧🇭', lengthKm: 5.412, laps: 57, pirelliCompounds: 'C1 / C2 / C3 (高温・高トラクション)' },
  jeddah: { gpName: 'サウジアラビアGP', circuitName: 'ジェッダ・コーニッシュ・サーキット', city: 'ジェッダ', country: 'サウジアラビア', flag: '🇸🇦', lengthKm: 6.174, laps: 50, pirelliCompounds: 'C2 / C3 / C4 (超高速市街地)' },
  miami: { gpName: 'マイアミGP', circuitName: 'マイアミ・インターナショナル・オートドローム', city: 'マイアミ', country: 'アメリカ', flag: '🇺🇸', lengthKm: 5.412, laps: 57, pirelliCompounds: 'C2 / C3 / C4' },
  villeneuve: { gpName: 'カナダGP', circuitName: 'ジル・ヴィルヌーヴ・サーキット', city: 'モントリオール', country: 'カナダ', flag: '🇨🇦', lengthKm: 4.361, laps: 70, pirelliCompounds: 'C3 / C4 / C5' },
  monaco: { gpName: 'モナコGP', circuitName: 'モンテカルロ市街地コース', city: 'モンテカルロ', country: 'モナコ', flag: '🇲🇨', lengthKm: 3.337, laps: 78, pirelliCompounds: 'C3 / C4 / C5 (最軟コンパウンド)' },
  catalunya: { gpName: 'バルセロナGP', circuitName: 'カタロニア・サーキット', city: 'バルセロナ', country: 'スペイン', flag: '🇪🇸', lengthKm: 4.657, laps: 66, pirelliCompounds: 'C1 / C2 / C3 (高ダウンフォース)' },
  madring: { gpName: 'スペインGP (マドリード)', circuitName: 'マドリング (IFEMAマドリード市街地コース)', city: 'マドリード', country: 'スペイン', flag: '🇪🇸', lengthKm: 5.474, laps: 55, pirelliCompounds: 'C3 / C4 / C5 (新設ハイブリッド公道)' },
  red_bull_ring: { gpName: 'オーストリアGP', circuitName: 'レッドブル・リンク', city: 'シュピールベルク', country: 'オーストリア', flag: '🇦🇹', lengthKm: 4.318, laps: 71, pirelliCompounds: 'C3 / C4 / C5' },
  silverstone: { gpName: 'イギリスGP (シルバーストン)', circuitName: 'シルバーストン・サーキット', city: 'シルバーストン', country: 'イギリス', flag: '🇬🇧', lengthKm: 5.891, laps: 52, pirelliCompounds: 'C1 / C2 / C3 (超高速G負荷)' },
  spa: { gpName: 'ベルギーGP (スパ)', circuitName: 'スパ・フランコルシャン', city: 'スパ / スタヴロ', country: 'ベルギー', flag: '🇧🇪', lengthKm: 7.004, laps: 44, pirelliCompounds: 'C2 / C3 / C4 (最長サーキット)' },
  hungaroring: { gpName: 'ハンガリーGP', circuitName: 'ハンガロリンク', city: 'ブダペスト', country: 'ハンガリー', flag: '🇭🇺', lengthKm: 4.381, laps: 70, pirelliCompounds: 'C3 / C4 / C5 (ツイスティ・酷暑)' },
  zandvoort: { gpName: 'オランダGP (ザントフォールト)', circuitName: 'ザントフォールト・サーキット', city: 'ザントフォールト', country: 'オランダ', flag: '🇳🇱', lengthKm: 4.259, laps: 72, pirelliCompounds: 'C1 / C2 / C3 (急バンクコーナー)' },
  monza: { gpName: 'イタリアGP (モンツァ)', circuitName: 'モンツァ・サーキット', city: 'モンツァ', country: 'イタリア', flag: '🇮🇹', lengthKm: 5.793, laps: 53, pirelliCompounds: 'C3 / C4 / C5 (超高速の殿堂)' },
  baku: { gpName: 'アゼルバイジャンGP (バクー)', circuitName: 'バクー市街地コース', city: 'バクー', country: 'アゼルバイジャン', flag: '🇦🇿', lengthKm: 6.003, laps: 51, pirelliCompounds: 'C3 / C4 / C5 (最長ストレート & 旧市街地)' },
  sepang: { gpName: 'マレーシアGP (代替開催)', circuitName: 'セパン・インターナショナル・サーキット', city: 'クアラルンプール', country: 'マレーシア', flag: '🇲🇾', lengthKm: 5.543, laps: 56, pirelliCompounds: 'C1 / C2 / C3 (熱帯スコール & 高熱)' },
  marina_bay: { gpName: 'シンガポールGP (マリーナベイ)', circuitName: 'マリーナベイ・ストリート・サーキット', city: 'シンガポール', country: 'シンガポール', flag: '🇸🇬', lengthKm: 4.940, laps: 62, pirelliCompounds: 'C3 / C4 / C5 (極限ナイトレース)' },
  americas: { gpName: 'アメリカGP (オースティン)', circuitName: 'サーキット・オブ・ジ・アメリカズ (COTA)', city: 'オースティン', country: 'アメリカ', flag: '🇺🇸', lengthKm: 5.513, laps: 56, pirelliCompounds: 'C2 / C3 / C4 (名物ターン1急坂)' },
  rodriguez: { gpName: 'メキシコシティGP', circuitName: 'エルマノス・ロドリゲス・サーキット', city: 'メキシコシティ', country: 'メキシコ', flag: '🇲🇽', lengthKm: 4.304, laps: 71, pirelliCompounds: 'C3 / C4 / C5 (標高2,200m希薄空気)' },
  interlagos: { gpName: 'サンパウロGP (インテルラゴス)', circuitName: 'アウトドローモ・ホセ・カルロス・パーチェ', city: 'サンパウロ', country: 'ブラジル', flag: '🇧🇷', lengthKm: 4.309, laps: 71, pirelliCompounds: 'C2 / C3 / C4 (天候急変インテルラゴス)' },
  vegas: { gpName: 'ラスベガスGP', circuitName: 'ラスベガス・ストリップ・サーキット', city: 'ラスベガス', country: 'アメリカ', flag: '🇺🇸', lengthKm: 6.201, laps: 50, pirelliCompounds: 'C3 / C4 / C5 (極寒ナイトレース)' },
  losail: { gpName: 'カタールGP (ルサイル)', circuitName: 'ルサイル・インターナショナル・サーキット', city: 'ルサイル', country: 'カタール', flag: '🇶🇦', lengthKm: 5.419, laps: 57, pirelliCompounds: 'C1 / C2 / C3 (高速連続コーナー)' },
  yas_marina: { gpName: 'アブダビGP', circuitName: 'ヤス・マリーナ・サーキット', city: 'アブダビ', country: 'UAE', flag: '🇦🇪', lengthKm: 5.281, laps: 58, pirelliCompounds: 'C3 / C4 / C5 (トワイライト最終決戦)' },
  imola: { gpName: 'エミリア・ロマーニャGP', circuitName: 'イモラ・サーキット', city: 'イモラ', country: 'イタリア', flag: '🇮🇹', lengthKm: 4.909, laps: 63, pirelliCompounds: 'C2 / C3 / C4' },
};

// ─── Helpers ─────────────────────────────────────────────────

function utcToJstString(dateStr: string, timeStr: string): string {
  const isoStr = timeStr.endsWith('Z') ? `${dateStr}T${timeStr}` : `${dateStr}T${timeStr}Z`;
  const d = new Date(isoStr);
  const formatter = new Intl.DateTimeFormat('ja-JP', {
    timeZone: 'Asia/Tokyo',
    month: 'numeric',
    day: 'numeric',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  const parts = formatter.formatToParts(d);
  const m = parts.find((p) => p.type === 'month')?.value || '';
  const day = parts.find((p) => p.type === 'day')?.value || '';
  const weekday = parts.find((p) => p.type === 'weekday')?.value || '';
  const hour = parts.find((p) => p.type === 'hour')?.value || '00';
  const minute = parts.find((p) => p.type === 'minute')?.value || '00';
  return `${m}/${day} (${weekday}) ${hour}:${minute}`;
}

function formatDateRange(race: JolpicaRace): string {
  const raceDate = new Date(`${race.date}T${race.time}`);
  const year = raceDate.getFullYear();

  // Find earliest session date
  const sessionDates = [
    race.FirstPractice?.date,
    race.SprintQualifying?.date,
    race.SecondPractice?.date,
    race.ThirdPractice?.date,
    race.Qualifying?.date,
    race.Sprint?.date,
    race.date,
  ].filter(Boolean) as string[];

  const earliest = sessionDates.sort()[0];
  const startDate = new Date(earliest + 'T00:00:00Z');
  const endDate = new Date(race.date + 'T00:00:00Z');

  const startM = startDate.getMonth() + 1;
  const startD = startDate.getDate();
  const endM = endDate.getMonth() + 1;
  const endD = endDate.getDate();

  return `${year}年 ${startM}月${startD}日 - ${endM}月${endD}日`;
}

function buildScheduleJst(race: JolpicaRace): { session: string; dayTime: string }[] {
  const isSprint = !!race.Sprint;
  const schedule: { session: string; dayTime: string }[] = [];

  if (isSprint) {
    // Sprint weekend: FP1 → SQ → Sprint → Quali → Race
    if (race.FirstPractice) {
      schedule.push({ session: 'FP1', dayTime: utcToJstString(race.FirstPractice.date, race.FirstPractice.time) });
    }
    if (race.SprintQualifying) {
      schedule.push({ session: 'スプリント予選', dayTime: utcToJstString(race.SprintQualifying.date, race.SprintQualifying.time) });
    }
    if (race.Sprint) {
      schedule.push({ session: 'スプリント決勝', dayTime: utcToJstString(race.Sprint.date, race.Sprint.time) });
    }
    if (race.Qualifying) {
      schedule.push({ session: '本選予選', dayTime: utcToJstString(race.Qualifying.date, race.Qualifying.time) });
    }
    schedule.push({ session: '決勝レース', dayTime: `${utcToJstString(race.date, race.time)} スタート` });
  } else {
    // Normal weekend: FP1 → FP2 → FP3 → Quali → Race
    if (race.FirstPractice) {
      schedule.push({ session: 'FP1', dayTime: utcToJstString(race.FirstPractice.date, race.FirstPractice.time) });
    }
    if (race.SecondPractice) {
      schedule.push({ session: 'FP2', dayTime: utcToJstString(race.SecondPractice.date, race.SecondPractice.time) });
    }
    if (race.ThirdPractice) {
      schedule.push({ session: 'FP3', dayTime: utcToJstString(race.ThirdPractice.date, race.ThirdPractice.time) });
    }
    if (race.Qualifying) {
      schedule.push({ session: '予選', dayTime: utcToJstString(race.Qualifying.date, race.Qualifying.time) });
    }
    schedule.push({ session: '決勝', dayTime: `${utcToJstString(race.date, race.time)} スタート` });
  }

  return schedule;
}

// ─── Main Fetch Function ────────────────────────────────────

export async function fetchOfficialCalendar(year: number): Promise<OfficialRaceSchedule[]> {
  // Fetch both APIs in parallel
  const [jolpicaResult, openf1Result] = await Promise.allSettled([
    fetch(`https://api.jolpi.ca/ergast/f1/${year}.json`, {
      signal: AbortSignal.timeout(10000),
      headers: { 'Accept': 'application/json', 'User-Agent': 'PADOROKU-F1App/1.0' },
    }).then(res => {
      if (!res.ok) throw new Error(`Jolpica HTTP ${res.status}`);
      return res.json() as Promise<JolpicaResponse>;
    }),
    fetch(`https://api.openf1.org/v1/sessions?year=${year}`, {
      signal: AbortSignal.timeout(10000),
      headers: { 'Accept': 'application/json', 'User-Agent': 'PADOROKU-F1App/1.0' },
    }).then(res => {
      if (!res.ok) throw new Error(`OpenF1 HTTP ${res.status}`);
      return res.json() as Promise<OpenF1Session[]>;
    }),
  ]);

  // --- Process Jolpica data ---
  if (jolpicaResult.status !== 'fulfilled') {
    throw new Error(`Failed to fetch calendar from Jolpica: ${jolpicaResult.reason}`);
  }

  const races = jolpicaResult.value.MRData.RaceTable.Races;

  // --- Process OpenF1 cancellation data ---
  const cancelledCircuits = new Set<string>();
  if (openf1Result.status === 'fulfilled') {
    const sessions = openf1Result.value;
    // Find Race sessions that are cancelled
    for (const s of sessions) {
      if (s.is_cancelled && s.session_name === 'Race') {
        cancelledCircuits.add(s.circuit_short_name.toLowerCase());
      }
    }
  }

  // For 2026, SEASON_2026_CALENDAR contains verified authoritative schedules & compounds.
  // Jolpica has preliminary stubs (e.g. Baku Thursday FP1).
  if (year === 2026) {
    return SEASON_2026_CALENDAR.map((race) => ({
      ...race,
      isCancelled:
        cancelledCircuits.has(race.city.toLowerCase()) ||
        cancelledCircuits.has(race.country.toLowerCase()) ||
        race.isCancelled ||
        false,
    }));
  }

  // --- Transform to app format ---
  const calendar: OfficialRaceSchedule[] = races.map((race) => {
    const circuitId = race.Circuit.circuitId;
    const jp = CIRCUIT_JP_NAMES[circuitId];
    const isSprint = !!race.Sprint;

    // Check if this race's circuit is cancelled in OpenF1 data
    const circuitShortName = race.Circuit.Location.locality.toLowerCase();
    const isCancelled = cancelledCircuits.has(circuitShortName) ||
      cancelledCircuits.has(race.Circuit.circuitName.toLowerCase().split(' ')[0]);

    return {
      round: parseInt(race.round, 10),
      gpName: jp?.gpName || race.raceName,
      country: jp?.country || race.Circuit.Location.country,
      flag: jp?.flag || '🏁',
      circuitName: jp?.circuitName || race.Circuit.circuitName,
      city: jp?.city || race.Circuit.Location.locality,
      dates: formatDateRange(race),
      targetDateUtc: `${race.date}T${race.time}`,
      isSprint,
      lengthKm: jp?.lengthKm || 0,
      laps: jp?.laps || 0,
      pirelliCompounds: jp?.pirelliCompounds || '',
      scheduleJst: buildScheduleJst(race),
      isCancelled,
    };
  });

  return calendar;
}
