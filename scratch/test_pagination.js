const https = require('https');
const fs = require('fs');
const path = require('path');

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'F1AnalysisApp/1.0' } }, (res) => {
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
    const data = await fetchJson(url);
    const table = data.MRData.RaceTable;
    const races = table.Races || [];
    
    // Merge into allRaces by round
    for (const r of races) {
      let existing = allRaces.find(x => x.round === r.round);
      if (!existing) {
        allRaces.push(r);
      } else {
        if (r.Results) existing.Results = (existing.Results || []).concat(r.Results);
        if (r.QualifyingResults) existing.QualifyingResults = (existing.QualifyingResults || []).concat(r.QualifyingResults);
      }
    }

    const total = parseInt(data.MRData.total, 10);
    offset += limit;
    if (offset >= total) break;
    await sleep(200);
  }

  return allRaces;
}

async function test() {
  console.log('Fetching all 2022 results...');
  const t0 = Date.now();
  const races = await fetchAllPages('https://api.jolpi.ca/ergast/f1/2022/results.json');
  console.log(`Fetched ${races.length} races in ${Date.now() - t0}ms`);
  console.log('Sample R1 results count:', races[0].Results.length);
  console.log('Sample R22 results count:', races[races.length - 1].Results.length);
}

test().catch(console.error);
