/**
 * lib/circuitTimezones.ts
 * Formula 1 Circuit Timezone & Local Track Time Engine.
 * Provides accurate time conversions between Japan Standard Time (JST, UTC+9)
 * and the local track time of all 24 Grand Prix circuits worldwide.
 */

export interface CircuitTimezoneInfo {
  circuitId: string;
  country: string;
  city: string;
  tzName: string;         // e.g. "AZT (アゼルバイジャン時間)"
  tzAbbr: string;         // e.g. "AZT"
  utcOffset: number;      // e.g. +4
  diffFromJstHours: number; // e.g. -5 (Baku is 5 hours behind JST)
  diffLabel: string;      // e.g. "日本との時差: -5時間 (現地は5時間遅れ)"
  shortDiffLabel: string; // e.g. "時差 -5h"
  isNightRace?: boolean;
}

export const CIRCUIT_TIMEZONES: Record<string, CircuitTimezoneInfo> = {
  albert_park: {
    circuitId: 'albert_park',
    country: 'オーストラリア',
    city: 'メルボルン',
    tzName: 'AEDT (豪州東部夏時間)',
    tzAbbr: 'AEDT',
    utcOffset: 11,
    diffFromJstHours: 2,
    diffLabel: '日本との時差: +2時間 (現地は2時間進み)',
    shortDiffLabel: '時差 +2h',
  },
  shanghai: {
    circuitId: 'shanghai',
    country: '中国',
    city: '上海',
    tzName: 'CST (中国標準時)',
    tzAbbr: 'CST',
    utcOffset: 8,
    diffFromJstHours: -1,
    diffLabel: '日本との時差: -1時間 (現地は1時間遅れ)',
    shortDiffLabel: '時差 -1h',
  },
  suzuka: {
    circuitId: 'suzuka',
    country: '日本',
    city: '三重県鈴鹿市',
    tzName: 'JST (日本標準時)',
    tzAbbr: 'JST',
    utcOffset: 9,
    diffFromJstHours: 0,
    diffLabel: '日本国内開催 (時差なし)',
    shortDiffLabel: '時差なし',
  },
  miami: {
    circuitId: 'miami',
    country: 'アメリカ',
    city: 'マイアミ',
    tzName: 'EDT (米国東部夏時間)',
    tzAbbr: 'EDT',
    utcOffset: -4,
    diffFromJstHours: -13,
    diffLabel: '日本との時差: -13時間 (現地は13時間遅れ)',
    shortDiffLabel: '時差 -13h',
  },
  villeneuve: {
    circuitId: 'villeneuve',
    country: 'カナダ',
    city: 'モントリオール',
    tzName: 'EDT (東部夏時間)',
    tzAbbr: 'EDT',
    utcOffset: -4,
    diffFromJstHours: -13,
    diffLabel: '日本との時差: -13時間 (現地は13時間遅れ)',
    shortDiffLabel: '時差 -13h',
  },
  monaco: {
    circuitId: 'monaco',
    country: 'モナコ',
    city: 'モンテカルロ',
    tzName: 'CEST (中央ヨーロッパ夏時間)',
    tzAbbr: 'CEST',
    utcOffset: 2,
    diffFromJstHours: -7,
    diffLabel: '日本との時差: -7時間 (現地は7時間遅れ)',
    shortDiffLabel: '時差 -7h',
  },
  catalunya: {
    circuitId: 'catalunya',
    country: 'スペイン',
    city: 'バルセロナ',
    tzName: 'CEST (中央ヨーロッパ夏時間)',
    tzAbbr: 'CEST',
    utcOffset: 2,
    diffFromJstHours: -7,
    diffLabel: '日本との時差: -7時間 (現地は7時間遅れ)',
    shortDiffLabel: '時差 -7h',
  },
  red_bull_ring: {
    circuitId: 'red_bull_ring',
    country: 'オーストリア',
    city: 'シュピールベルク',
    tzName: 'CEST (中央ヨーロッパ夏時間)',
    tzAbbr: 'CEST',
    utcOffset: 2,
    diffFromJstHours: -7,
    diffLabel: '日本との時差: -7時間 (現地は7時間遅れ)',
    shortDiffLabel: '時差 -7h',
  },
  silverstone: {
    circuitId: 'silverstone',
    country: 'イギリス',
    city: 'シルバーストン',
    tzName: 'BST (英国夏時間)',
    tzAbbr: 'BST',
    utcOffset: 1,
    diffFromJstHours: -8,
    diffLabel: '日本との時差: -8時間 (現地は8時間遅れ)',
    shortDiffLabel: '時差 -8h',
  },
  spa: {
    circuitId: 'spa',
    country: 'ベルギー',
    city: 'スパ',
    tzName: 'CEST (中央ヨーロッパ夏時間)',
    tzAbbr: 'CEST',
    utcOffset: 2,
    diffFromJstHours: -7,
    diffLabel: '日本との時差: -7時間 (現地は7時間遅れ)',
    shortDiffLabel: '時差 -7h',
  },
  hungaroring: {
    circuitId: 'hungaroring',
    country: 'ハンガリー',
    city: 'ブダペスト',
    tzName: 'CEST (中央ヨーロッパ夏時間)',
    tzAbbr: 'CEST',
    utcOffset: 2,
    diffFromJstHours: -7,
    diffLabel: '日本との時差: -7時間 (現地は7時間遅れ)',
    shortDiffLabel: '時差 -7h',
  },
  zandvoort: {
    circuitId: 'zandvoort',
    country: 'オランダ',
    city: 'ザントフォールト',
    tzName: 'CEST (中央ヨーロッパ夏時間)',
    tzAbbr: 'CEST',
    utcOffset: 2,
    diffFromJstHours: -7,
    diffLabel: '日本との時差: -7時間 (現地は7時間遅れ)',
    shortDiffLabel: '時差 -7h',
  },
  monza: {
    circuitId: 'monza',
    country: 'イタリア',
    city: 'モンツァ',
    tzName: 'CEST (中央ヨーロッパ夏時間)',
    tzAbbr: 'CEST',
    utcOffset: 2,
    diffFromJstHours: -7,
    diffLabel: '日本との時差: -7時間 (現地は7時間遅れ)',
    shortDiffLabel: '時差 -7h',
  },
  madring: {
    circuitId: 'madring',
    country: 'スペイン',
    city: 'マドリード',
    tzName: 'CEST (中央ヨーロッパ夏時間)',
    tzAbbr: 'CEST',
    utcOffset: 2,
    diffFromJstHours: -7,
    diffLabel: '日本との時差: -7時間 (現地は7時間遅れ)',
    shortDiffLabel: '時差 -7h',
  },
  baku: {
    circuitId: 'baku',
    country: 'アゼルバイジャン',
    city: 'バクー',
    tzName: 'AZT (アゼルバイジャン標準時)',
    tzAbbr: 'AZT',
    utcOffset: 4,
    diffFromJstHours: -5,
    diffLabel: '日本との時差: -5時間 (現地は5時間遅れ)',
    shortDiffLabel: '時差 -5h',
  },
  sepang: {
    circuitId: 'sepang',
    country: 'マレーシア',
    city: 'クアラルンプール',
    tzName: 'MYT (マレーシア標準時)',
    tzAbbr: 'MYT',
    utcOffset: 8,
    diffFromJstHours: -1,
    diffLabel: '日本との時差: -1時間 (現地は1時間遅れ)',
    shortDiffLabel: '時差 -1h',
  },
  marina_bay: {
    circuitId: 'marina_bay',
    country: 'シンガポール',
    city: 'シンガポール',
    tzName: 'SGT (シンガポール標準時)',
    tzAbbr: 'SGT',
    utcOffset: 8,
    diffFromJstHours: -1,
    diffLabel: '日本との時差: -1時間 (現地は1時間遅れ)',
    shortDiffLabel: '時差 -1h',
    isNightRace: true,
  },
  americas: {
    circuitId: 'americas',
    country: 'アメリカ',
    city: 'オースティン',
    tzName: 'CDT (米国中部夏時間)',
    tzAbbr: 'CDT',
    utcOffset: -5,
    diffFromJstHours: -14,
    diffLabel: '日本との時差: -14時間 (現地は14時間遅れ)',
    shortDiffLabel: '時差 -14h',
  },
  rodriguez: {
    circuitId: 'rodriguez',
    country: 'メキシコ',
    city: 'メキシコシティ',
    tzName: 'CST (メキシコ標準時)',
    tzAbbr: 'CST',
    utcOffset: -6,
    diffFromJstHours: -15,
    diffLabel: '日本との時差: -15時間 (現地は15時間遅れ)',
    shortDiffLabel: '時差 -15h',
  },
  interlagos: {
    circuitId: 'interlagos',
    country: 'ブラジル',
    city: 'サンパウロ',
    tzName: 'BRT (ブラジル標準時)',
    tzAbbr: 'BRT',
    utcOffset: -3,
    diffFromJstHours: -12,
    diffLabel: '日本との時差: -12時間 (現地は12時間遅れ)',
    shortDiffLabel: '時差 -12h',
  },
  vegas: {
    circuitId: 'vegas',
    country: 'アメリカ',
    city: 'ラスベガス',
    tzName: 'PST (米国太平洋標準時)',
    tzAbbr: 'PST',
    utcOffset: -8,
    diffFromJstHours: -17,
    diffLabel: '日本との時差: -17時間 (現地は17時間遅れ)',
    shortDiffLabel: '時差 -17h',
    isNightRace: true,
  },
  losail: {
    circuitId: 'losail',
    country: 'カタール',
    city: 'ルサイル',
    tzName: 'AST (アラビア標準時)',
    tzAbbr: 'AST',
    utcOffset: 3,
    diffFromJstHours: -6,
    diffLabel: '日本との時差: -6時間 (現地は6時間遅れ)',
    shortDiffLabel: '時差 -6h',
    isNightRace: true,
  },
  yas_marina: {
    circuitId: 'yas_marina',
    country: 'アラブ首長国連邦',
    city: 'アブダビ',
    tzName: 'GST (湾岸標準時)',
    tzAbbr: 'GST',
    utcOffset: 4,
    diffFromJstHours: -5,
    diffLabel: '日本との時差: -5時間 (現地は5時間遅れ)',
    shortDiffLabel: '時差 -5h',
    isNightRace: true,
  },
  bahrain: {
    circuitId: 'bahrain',
    country: 'バーレーン',
    city: 'サヒール',
    tzName: 'AST (アラビア標準時)',
    tzAbbr: 'AST',
    utcOffset: 3,
    diffFromJstHours: -6,
    diffLabel: '日本との時差: -6時間 (現地は6時間遅れ)',
    shortDiffLabel: '時差 -6h',
    isNightRace: true,
  },
  jeddah: {
    circuitId: 'jeddah',
    country: 'サウジアラビア',
    city: 'ジェッダ',
    tzName: 'AST (アラビア標準時)',
    tzAbbr: 'AST',
    utcOffset: 3,
    diffFromJstHours: -6,
    diffLabel: '日本との時差: -6時間 (現地は6時間遅れ)',
    shortDiffLabel: '時差 -6h',
    isNightRace: true,
  },
};

/**
 * Resolve circuit timezone information safely by circuit ID or country/city fallback.
 */
export function getCircuitTimezoneInfo(
  circuitId?: string,
  country?: string,
  city?: string
): CircuitTimezoneInfo {
  if (circuitId && CIRCUIT_TIMEZONES[circuitId]) {
    return CIRCUIT_TIMEZONES[circuitId];
  }

  // Fallbacks by country/city
  const c = (country || '').toLowerCase();
  const ct = (city || '').toLowerCase();

  if (c.includes('アゼルバイジャン') || ct.includes('バクー') || ct.includes('baku')) {
    return CIRCUIT_TIMEZONES['baku'];
  }
  if (c.includes('日本') || ct.includes('鈴鹿') || ct.includes('suzuka')) {
    return CIRCUIT_TIMEZONES['suzuka'];
  }
  if (c.includes('オーストラリア') || ct.includes('メルボルン')) {
    return CIRCUIT_TIMEZONES['albert_park'];
  }
  if (c.includes('中国') || ct.includes('上海')) {
    return CIRCUIT_TIMEZONES['shanghai'];
  }
  if (c.includes('シンガポール')) {
    return CIRCUIT_TIMEZONES['marina_bay'];
  }
  if (c.includes('マレーシア') || ct.includes('セパン')) {
    return CIRCUIT_TIMEZONES['sepang'];
  }
  if (c.includes('モナコ')) {
    return CIRCUIT_TIMEZONES['monaco'];
  }
  if (c.includes('イギリス') || ct.includes('シルバーストン')) {
    return CIRCUIT_TIMEZONES['silverstone'];
  }
  if (c.includes('ベルギー') || ct.includes('スパ')) {
    return CIRCUIT_TIMEZONES['spa'];
  }
  if (c.includes('イタリア') || ct.includes('モンツァ')) {
    return CIRCUIT_TIMEZONES['monza'];
  }
  if (c.includes('オランダ') || ct.includes('ザントフォールト')) {
    return CIRCUIT_TIMEZONES['zandvoort'];
  }
  if (c.includes('スペイン') || ct.includes('マドリード')) {
    return CIRCUIT_TIMEZONES['madring'];
  }
  if (ct.includes('マイアミ')) {
    return CIRCUIT_TIMEZONES['miami'];
  }
  if (ct.includes('オースティン')) {
    return CIRCUIT_TIMEZONES['americas'];
  }
  if (ct.includes('ラスベガス')) {
    return CIRCUIT_TIMEZONES['vegas'];
  }
  if (c.includes('カナダ') || ct.includes('モントリオール')) {
    return CIRCUIT_TIMEZONES['villeneuve'];
  }
  if (c.includes('メキシコ')) {
    return CIRCUIT_TIMEZONES['rodriguez'];
  }
  if (c.includes('ブラジル') || ct.includes('サンパウロ')) {
    return CIRCUIT_TIMEZONES['interlagos'];
  }
  if (c.includes('カタール')) {
    return CIRCUIT_TIMEZONES['losail'];
  }
  if (c.includes('首長国連邦') || ct.includes('アブダビ')) {
    return CIRCUIT_TIMEZONES['yas_marina'];
  }

  // Default: European Standard time
  return CIRCUIT_TIMEZONES['monza'];
}

export interface DualSessionTime {
  session: string;
  jstDay: string;         // e.g. "9/25 (金)"
  jstTime: string;        // e.g. "18:30"
  localDay: string;       // e.g. "9/25 (金)"
  localTime: string;      // e.g. "13:30"
  tzAbbr: string;         // e.g. "AZT"
  diffLabel: string;      // e.g. "時差 -5h"
  isCrossDay: boolean;    // true if local date differs from JST date
  isFinalRace: boolean;   // true if 決勝
}

const DAY_OF_WEEK_ORDER = ['日', '月', '火', '水', '木', '金', '土'];

/**
 * Given a JST schedule string (e.g. "9/25 (金) 18:30" or "9/27 (日) 20:00 スタート")
 * and circuit timezone info, calculates the exact dual JST and Local track time.
 */
export function formatDualSessionTime(
  sessionName: string,
  dayTimeJst: string,
  tzInfo: CircuitTimezoneInfo
): DualSessionTime {
  const isFinalRace = sessionName.includes('決勝') && !sessionName.includes('スプリント');

  // Strip trailing " スタート"
  const cleanStr = dayTimeJst.replace(/ スタート$/, '').trim();

  // Pattern: "M/D (曜日) HH:mm" or "M/D HH:mm"
  const match = cleanStr.match(/(\d{1,2})\/(\d{1,2})\s*(?:\(([\u4e00-\u9fa5日|月|火|水|木|金|土])\))?\s*(\d{1,2}):(\d{2})/);

  if (!match) {
    return {
      session: sessionName,
      jstDay: cleanStr.split(' ')[0] || '',
      jstTime: cleanStr.split(' ')[1] || '',
      localDay: cleanStr.split(' ')[0] || '',
      localTime: cleanStr.split(' ')[1] || '',
      tzAbbr: tzInfo.tzAbbr,
      diffLabel: tzInfo.shortDiffLabel,
      isCrossDay: false,
      isFinalRace,
    };
  }

  const month = parseInt(match[1], 10);
  const day = parseInt(match[2], 10);
  const jstDow = match[3] || '';
  const hour = parseInt(match[4], 10);
  const minute = parseInt(match[5], 10);

  const jstDay = jstDow ? `${month}/${day} (${jstDow})` : `${month}/${day}`;
  const jstTime = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;

  // Calculate local time
  const diffHours = tzInfo.diffFromJstHours;
  let localHour = hour + diffHours;
  let localDayOffset = 0;

  if (localHour < 0) {
    localHour += 24;
    localDayOffset = -1;
  } else if (localHour >= 24) {
    localHour -= 24;
    localDayOffset = 1;
  }

  const localTime = `${String(localHour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;

  let localDay = jstDay;
  let isCrossDay = false;

  if (localDayOffset !== 0) {
    isCrossDay = true;
    const approxDate = new Date(2026, month - 1, day + localDayOffset);
    const m = approxDate.getMonth() + 1;
    const d = approxDate.getDate();
    const dow = DAY_OF_WEEK_ORDER[approxDate.getDay()];
    localDay = `${m}/${d} (${dow})`;
  }

  return {
    session: sessionName,
    jstDay,
    jstTime,
    localDay,
    localTime,
    tzAbbr: tzInfo.tzAbbr,
    diffLabel: tzInfo.shortDiffLabel,
    isCrossDay,
    isFinalRace,
  };
}
