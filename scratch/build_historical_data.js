const https = require('https');
const fs = require('fs');
const path = require('path');

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'F1TelemetryPortal/2.3' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(new Error(`Failed to parse JSON from ${url}: ${e.message}`));
        }
      });
    }).on('error', reject);
  });
}

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function fetchAllPages(baseUrl) {
  let offset = 0;
  const limit = 100;
  let allRaces = [];

  while (true) {
    const url = `${baseUrl}?limit=${limit}&offset=${offset}`;
    console.log(`  Fetching: ${url}`);
    let data;
    try {
      data = await fetchJson(url);
    } catch (e) {
      console.warn(`  Retrying ${url} after error:`, e.message);
      await sleep(1000);
      data = await fetchJson(url);
    }

    const table = data.MRData.RaceTable;
    const races = table.Races || [];

    for (const r of races) {
      let existing = allRaces.find(x => x.round === r.round);
      if (!existing) {
        allRaces.push({
          season: r.season,
          round: parseInt(r.round, 10),
          raceName: r.raceName,
          circuitId: r.Circuit.circuitId,
          circuitName: r.Circuit.circuitName,
          locality: r.Circuit.Location.locality,
          country: r.Circuit.Location.country,
          date: r.date,
          time: r.time,
          Results: r.Results || [],
          QualifyingResults: r.QualifyingResults || []
        });
      } else {
        if (r.Results) existing.Results = existing.Results.concat(r.Results);
        if (r.QualifyingResults) existing.QualifyingResults = existing.QualifyingResults.concat(r.QualifyingResults);
      }
    }

    const total = parseInt(data.MRData.total, 10);
    offset += limit;
    if (offset >= total) break;
    await sleep(150);
  }

  return allRaces;
}

async function main() {
  const years = [2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025];
  const outDir = path.join(__dirname, 'historical_cache');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  for (const year of years) {
    const yearFile = path.join(outDir, `${year}_full.json`);
    if (fs.existsSync(yearFile)) {
      console.log(`[Cache Hit] ${year} already downloaded`);
      continue;
    }

    console.log(`\n=== Downloading data for ${year} ===`);
    // 1. Race results
    console.log(`1. Race results for ${year}...`);
    const raceRaces = await fetchAllPages(`https://api.jolpi.ca/ergast/f1/${year}/results.json`);
    await sleep(200);

    // 2. Qualifying results
    console.log(`2. Qualifying results for ${year}...`);
    const qualiRaces = await fetchAllPages(`https://api.jolpi.ca/ergast/f1/${year}/qualifying.json`);
    await sleep(200);

    // 3. Standings (driver + constructor)
    console.log(`3. Standings for ${year}...`);
    const dStandingsData = await fetchJson(`https://api.jolpi.ca/ergast/f1/${year}/driverStandings.json`);
    const cStandingsData = await fetchJson(`https://api.jolpi.ca/ergast/f1/${year}/constructorStandings.json`);

    // Merge race & quali
    const combinedRaces = raceRaces.map(r => {
      const qMatch = qualiRaces.find(q => q.round === r.round);
      return {
        ...r,
        QualifyingResults: qMatch ? qMatch.QualifyingResults : []
      };
    });

    const yearData = {
      season: year,
      driverStandings: dStandingsData.MRData.StandingsTable.StandingsLists[0]?.DriverStandings || [],
      constructorStandings: cStandingsData.MRData.StandingsTable.StandingsLists[0]?.ConstructorStandings || [],
      races: combinedRaces
    };

    fs.writeFileSync(yearFile, JSON.stringify(yearData, null, 2));
    console.log(`Successfully saved ${yearFile} (${combinedRaces.length} races)`);
    await sleep(300);
  }

  console.log('\nAll years downloaded successfully!');
}

main().catch(console.error);
