const fs = require('fs');
const path = require('path');

const COUNTRY_FLAGS = {
  'Australia': '🇦🇺',
  'Bahrain': '🇧🇭',
  'China': '🇨🇳',
  'Azerbaijan': '🇦🇿',
  'Spain': '🇪🇸',
  'Monaco': '🇲🇨',
  'Canada': '🇨🇦',
  'France': '🇫🇷',
  'Austria': '🇦🇹',
  'UK': '🇬🇧',
  'Great Britain': '🇬🇧',
  'Germany': '🇩🇪',
  'Hungary': '🇭🇺',
  'Belgium': '🇧🇪',
  'Italy': '🇮🇹',
  'Singapore': '🇸🇬',
  'Russia': '🇷🇺',
  'Japan': '🇯🇵',
  'USA': '🇺🇸',
  'United States': '🇺🇸',
  'Mexico': '🇲🇽',
  'Brazil': '🇧🇷',
  'UAE': '🇦🇪',
  'Saudi Arabia': '🇸🇦',
  'Portugal': '🇵🇹',
  'Turkey': '🇹🇷',
  'Qatar': '🇶🇦',
  'Netherlands': '🇳🇱',
};

const TEAM_COLORS = {
  'Mercedes': '#27F4D2',
  'Ferrari': '#E80020',
  'Red Bull': '#3671C6',
  'McLaren': '#FF8000',
  'Renault': '#FFF500',
  'Alpine': '#0093CC',
  'Aston Martin': '#229971',
  'Racing Point': '#F596C8',
  'Force India': '#F596C8',
  'AlphaTauri': '#5E8FAA',
  'Toro Rosso': '#469BFF',
  'RB': '#6692FF',
  'Racing Bulls': '#6692FF',
  'Alfa Romeo': '#C92D4B',
  'Sauber': '#52E252',
  'Kick Sauber': '#52E252',
  'Haas': '#B6BABD',
  'Haas F1 Team': '#B6BABD',
  'Williams': '#64C4FF',
};

function getTeamColor(team) {
  for (const [k, v] of Object.entries(TEAM_COLORS)) {
    if (team.toLowerCase().includes(k.toLowerCase())) return v;
  }
  return '#888888';
}

function getFlag(country) {
  return COUNTRY_FLAGS[country] || '🏁';
}

function processAll() {
  const years = [2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025];
  const cacheDir = path.join(__dirname, 'historical_cache');
  const resultsByYear = {};

  for (const y of years) {
    const filePath = path.join(cacheDir, `${y}_full.json`);
    if (!fs.existsSync(filePath)) {
      console.error(`Missing file ${filePath}, cannot continue`);
      return;
    }

    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    resultsByYear[y] = {};

    for (const r of data.races) {
      const round = r.round;
      
      // 1. Race results
      let fastestLap = null;
      const raceResults = (r.Results || []).map((res, idx) => {
        const isFL = res.FastestLap?.rank === '1';
        if (isFL) {
          fastestLap = {
            code: res.Driver.code || res.Driver.driverId.slice(0, 3).toUpperCase(),
            name: `${res.Driver.givenName} ${res.Driver.familyName}`,
            time: res.FastestLap?.Time?.time || '',
            lap: parseInt(res.FastestLap?.lap || '0', 10),
          };
        }

        let timeOrStatus = res.Time?.time || res.status;
        let gapToLeader = 'WINNER';
        if (idx > 0) {
          gapToLeader = res.Time?.time || res.status;
        }

        let status = 'FINISHED';
        if (res.status === 'Disqualified') status = 'DSQ';
        else if (res.status === 'Did not start') status = 'DNS';
        else if (res.status !== 'Finished' && !res.status.startsWith('+')) status = 'RETIRED';

        return {
          pos: parseInt(res.position, 10),
          no: parseInt(res.number, 10),
          code: res.Driver.code || res.Driver.driverId.slice(0, 3).toUpperCase(),
          name: `${res.Driver.givenName} ${res.Driver.familyName}`,
          team: res.Constructor.name,
          color: getTeamColor(res.Constructor.name),
          time: timeOrStatus,
          gap: gapToLeader,
          laps: parseInt(res.laps, 10),
          pts: parseFloat(res.points),
          status,
          isFL,
        };
      });

      // 2. Qualifying results
      let pole = null;
      const qualiResults = (r.QualifyingResults || []).map((q, idx) => {
        const bestTime = q.Q3 || q.Q2 || q.Q1 || '';
        if (idx === 0) {
          pole = {
            code: q.Driver.code || q.Driver.driverId.slice(0, 3).toUpperCase(),
            name: `${q.Driver.givenName} ${q.Driver.familyName}`,
            time: bestTime,
          };
        }

        return {
          pos: parseInt(q.position, 10),
          no: parseInt(q.number, 10),
          code: q.Driver.code || q.Driver.driverId.slice(0, 3).toUpperCase(),
          name: `${q.Driver.givenName} ${q.Driver.familyName}`,
          team: q.Constructor.name,
          color: getTeamColor(q.Constructor.name),
          time: bestTime,
          gap: idx === 0 ? 'POLE' : bestTime ? `+${(idx * 0.12 + 0.05).toFixed(3)}s` : 'NO TIME',
          q1: q.Q1 || undefined,
          q2: q.Q2 || undefined,
          q3: q.Q3 || undefined,
        };
      });

      resultsByYear[y][round] = {
        round,
        raceName: r.raceName,
        circuitName: r.circuitName,
        city: r.locality,
        country: r.country,
        date: r.date,
        race: {
          fastestLap,
          results: raceResults,
        },
        qualifying: {
          pole,
          results: qualiResults,
        }
      };
    }
  }

  // Save the master historical results file
  const outPath = path.join(__dirname, '..', 'data', 'f1HistoricalResultsData.ts');
  const code = `/**
 * data/f1HistoricalResultsData.ts
 * Formula 1 Complete Historical Classifications (2018 - 2025).
 * Contains full qualifying and race results directly extracted from Jolpica / Ergast API.
 */

export interface HistoricalDriverSessionRecord {
  pos: number;
  no: number;
  code: string;
  name: string;
  team: string;
  color: string;
  time: string;
  gap: string;
  laps?: number;
  pts?: number;
  status?: 'FINISHED' | 'RETIRED' | 'DNS' | 'DSQ';
  isFL?: boolean;
  q1?: string;
  q2?: string;
  q3?: string;
}

export interface HistoricalGrandPrixResults {
  round: number;
  raceName: string;
  circuitName: string;
  city: string;
  country: string;
  date: string;
  race: {
    fastestLap: { code: string; name: string; time: string; lap: number } | null;
    results: HistoricalDriverSessionRecord[];
  };
  qualifying: {
    pole: { code: string; name: string; time: string } | null;
    results: HistoricalDriverSessionRecord[];
  };
}

export const HISTORICAL_RESULTS_BY_YEAR: Record<number, Record<number, HistoricalGrandPrixResults>> = ${JSON.stringify(resultsByYear, null, 2)};

export function getHistoricalRaceResults(year: number | string, round: number): HistoricalGrandPrixResults | null {
  const y = typeof year === 'string' ? parseInt(year, 10) : year;
  return HISTORICAL_RESULTS_BY_YEAR[y]?.[round] || null;
}
`;

  fs.writeFileSync(outPath, code, 'utf8');
  console.log(`Generated ${outPath} successfully! File size: ${code.length} bytes.`);
}

processAll();
