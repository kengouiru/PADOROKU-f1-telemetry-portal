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

function getFlag(country) {
  return COUNTRY_FLAGS[country] || '🏁';
}

const SUMMARIES = {
  2018: 'ハミルトンとベッテルの『5度目の戴冠』を懸けた激闘。シーズン後半にメルセデスが怒涛の連勝劇を演じ、ルイス・ハミルトンが通算5度目のワールドチャンピオンに輝いた。',
  2019: '開幕5戦連続ワンツーフィニッシュを飾ったメルセデスが圧倒。ハミルトンが6度目の王座を獲得し、ホンダがオーストリアGPでフェルスタッペンと共に13年ぶりの歴史的勝利を飾った。',
  2020: '新型コロナ禍による異例の全17戦変則シーズン。ハミルトンがミハエル・シューマッハに並ぶ歴代最多タイ『7度目の世界王者』を達成し、歴代最多勝記録も更新した。'
};

function buildArchives() {
  const cacheDir = path.join(__dirname, 'historical_cache');
  const archivesFile = path.join(__dirname, '..', 'data', 'f1HistoricalArchivesData.ts');
  let currentContent = fs.readFileSync(archivesFile, 'utf8');

  for (const year of [2018, 2019, 2020]) {
    const raw = JSON.parse(fs.readFileSync(path.join(cacheDir, `${year}_full.json`), 'utf8'));
    const dStandings = raw.driverStandings.map(d => ({
      position: parseInt(d.position, 10),
      driverCode: d.Driver.code || d.Driver.driverId.slice(0, 3).toUpperCase(),
      driverName: `${d.Driver.givenName} ${d.Driver.familyName}`,
      team: d.Constructors[0]?.name || 'F1 Team',
      points: parseFloat(d.points),
      wins: parseInt(d.wins, 10),
    }));

    const cStandings = raw.constructorStandings.map(c => ({
      position: parseInt(c.position, 10),
      teamName: c.Constructor.name,
      points: parseFloat(c.points),
      wins: parseInt(c.wins, 10),
    }));

    const calendar = raw.races.map(r => {
      const winnerRes = (r.Results || [])[0];
      return {
        round: r.round,
        raceName: r.raceName,
        circuitName: r.circuitName,
        city: r.locality,
        country: r.country,
        flag: getFlag(r.country),
        date: r.date,
        winner: winnerRes ? {
          driverCode: winnerRes.Driver.code || winnerRes.Driver.driverId.slice(0, 3).toUpperCase(),
          driverName: `${winnerRes.Driver.givenName} ${winnerRes.Driver.familyName}`,
          constructorName: winnerRes.Constructor.name,
          time: winnerRes.Time?.time || 'Winner',
        } : undefined,
      };
    });

    const champD = dStandings[0];
    const champC = cStandings[0];

    const yearEntry = `
  // ── ${year} SEASON ARCHIVE ──
  ${year}: {
    year: ${year},
    racesCount: ${calendar.length},
    championDriver: {
      name: '${champD.driverName}',
      code: '${champD.driverCode}',
      team: '${champD.team}',
      points: ${champD.points},
      wins: ${champD.wins},
    },
    championConstructor: {
      name: '${champC.teamName}',
      points: ${champC.points},
      wins: ${champC.wins},
    },
    seasonSummary: '${SUMMARIES[year]}',
    driverStandings: ${JSON.stringify(dStandings, null, 6)},
    constructorStandings: ${JSON.stringify(cStandings, null, 6)},
    calendar: ${JSON.stringify(calendar, null, 6)},
  },`;

    // Insert yearEntry right after "export const HISTORICAL_ARCHIVES: Record<number, HistoricalSeasonArchive> = {"
    const marker = 'export const HISTORICAL_ARCHIVES: Record<number, HistoricalSeasonArchive> = {';
    currentContent = currentContent.replace(marker, marker + yearEntry);
  }

  // Update AVAILABLE_ARCHIVE_YEARS
  currentContent = currentContent.replace(
    /export const AVAILABLE_ARCHIVE_YEARS = \[.*?\] as const;/,
    'export const AVAILABLE_ARCHIVE_YEARS = [2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018] as const;'
  );

  fs.writeFileSync(archivesFile, currentContent, 'utf8');
  console.log('Successfully updated f1HistoricalArchivesData.ts with 2018-2020 data!');
}

buildArchives();
