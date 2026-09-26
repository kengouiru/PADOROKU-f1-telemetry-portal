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
  const d = await fetchJson('https://api.jolpi.ca/ergast/f1/2022/results.json?limit=100');
  console.log('MRData metadata:', {
    limit: d.MRData.limit,
    offset: d.MRData.offset,
    total: d.MRData.total
  });
}

run().catch(console.error);
