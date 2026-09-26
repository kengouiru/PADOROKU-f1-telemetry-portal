const https = require('https');

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'F1AnalysisApp/1.0' } }, (res) => {
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
  const years = [2021, 2022, 2023, 2024, 2025];
  for (const y of years) {
    try {
      const data = await fetchJson(`https://api.jolpi.ca/ergast/f1/${y}/sprint.json?limit=100`);
      const races = data.MRData.RaceTable.Races || [];
      console.log(`\nOfficial Sprints for ${y} (${races.length} races):`);
      for (const r of races) {
        console.log(`  Round ${r.round}: ${r.raceName} (${r.date})`);
      }
    } catch (e) {
      console.error(`Error for ${y}:`, e.message);
    }
  }
}

run();
