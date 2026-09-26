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
  const d2018 = await fetchJson('https://api.jolpi.ca/ergast/f1/2018/1/results.json');
  const r2018 = d2018.MRData.RaceTable.Races[0];
  console.log('2018 R1:', r2018.raceName, 'Winner:', r2018.Results[0].Driver.code, 'Count:', r2018.Results.length);

  const d2019 = await fetchJson('https://api.jolpi.ca/ergast/f1/2019/1/results.json');
  const r2019 = d2019.MRData.RaceTable.Races[0];
  console.log('2019 R1:', r2019.raceName, 'Winner:', r2019.Results[0].Driver.code, 'Count:', r2019.Results.length);

  const d2020 = await fetchJson('https://api.jolpi.ca/ergast/f1/2020/1/results.json');
  const r2020 = d2020.MRData.RaceTable.Races[0];
  console.log('2020 R1:', r2020.raceName, 'Winner:', r2020.Results[0].Driver.code, 'Count:', r2020.Results.length);
}

run().catch(console.error);
