const https = require('https');
const fs = require('fs');

async function getWikipediaImageUrl(title) {
  const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=pageimages&format=json&pithumbsize=500`;
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'F1TelemetryBot/1.0 (kengo@example.com)' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const pages = json.query.pages;
          const pageId = Object.keys(pages)[0];
          if (pages[pageId] && pages[pageId].thumbnail) {
            resolve(pages[pageId].thumbnail.source);
          } else {
            resolve(null);
          }
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

async function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, { headers: { 'User-Agent': 'F1TelemetryBot/1.0 (kengo@example.com)' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadFile(res.headers.location, dest).then(resolve).catch(reject);
      }
      res.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', err => {
      fs.unlink(dest, () => reject(err));
    });
  });
}

async function run() {
  const drivers = [
    { code: 'LAT', title: 'Nicholas Latifi', filename: 'nicholas-latifi.jpg' },
    { code: 'MAZ', title: 'Nikita Mazepin', filename: 'nikita-mazepin.jpg' },
    { code: 'DEV', title: 'Nyck de Vries', filename: 'nyck-de-vries.jpg' },
    { code: 'ERI', title: 'Marcus Ericsson', filename: 'marcus-ericsson.jpg' },
    { code: 'WEH', title: 'Pascal Wehrlein', filename: 'pascal-wehrlein.jpg' },
    { code: 'NAS', title: 'Felipe Nasr', filename: 'felipe-nasr.jpg' },
    { code: 'MAL', title: 'Pastor Maldonado', filename: 'pastor-maldonado.jpg' },
    { code: 'PAL', title: 'Jolyon Palmer', filename: 'jolyon-palmer.jpg' },
    { code: 'VAN', title: 'Stoffel Vandoorne', filename: 'stoffel-vandoorne.jpg' },
    { code: 'HAR', title: 'Brendon Hartley', filename: 'brendon-hartley.jpg' },
  ];

  for (const d of drivers) {
    try {
      const imgUrl = await getWikipediaImageUrl(d.title);
      console.log(`${d.code} (${d.title}):`, imgUrl);
      if (imgUrl) {
        const dest = `public/images/drivers/portraits/${d.filename}`;
        await downloadFile(imgUrl, dest);
        console.log(`Saved to ${dest} (${fs.statSync(dest).size} bytes)`);
      }
    } catch (e) {
      console.error(`Error for ${d.title}:`, e.message);
    }
  }
}

run();
