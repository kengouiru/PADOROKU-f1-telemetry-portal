const https = require('https');

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

async function run() {
  console.log('Fetching 2022 bulk results with limit=1000...');
  const t0 = Date.now();
  const d = await fetchJson('https://api.jolpi.ca/ergast/f1/2022/results.json?limit=1000');
  const races = d.MRData.RaceTable.Races;
  console.log(`Fetched in ${Date.now() - t0}ms. Total races: ${races.length}`);
  console.log('R1 Results count:', races[0].Results.length);
  console.log('R22 Results count:', races[races.length - 1].Results.length);

  console.log('\nFetching 2022 bulk qualifying with limit=1000...');
  const t1 = Date.now();
  const q = await fetchJson('https://api.jolpi.ca/ergast/f1/2022/qualifying.json?limit=1000');
  const qRaces = q.MRData.RaceTable.Races;
  console.log(`Fetched in ${Date.now() - t1}ms. Total quali races: ${qRaces.length}`);
  console.log('R1 Quali count:', qRaces[0].QualifyingResults.length);
}

run().catch(console.error);
