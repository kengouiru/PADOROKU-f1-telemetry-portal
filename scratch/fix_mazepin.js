const https = require('https');
const fs = require('fs');

function downloadWithRedirect(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'F1TelemetryBot/1.0 (kengo@example.com)' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        let nextUrl = res.headers.location;
        if (nextUrl.startsWith('/')) {
          const u = new URL(url);
          nextUrl = `${u.protocol}//${u.host}${nextUrl}`;
        }
        return downloadWithRedirect(nextUrl, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed with status ${res.statusCode}`));
      }
      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on('finish', () => {
        file.close(() => {
          resolve(fs.statSync(dest).size);
        });
      });
    }).on('error', reject);
  });
}

async function fixMazepin() {
  const url = 'https://commons.wikimedia.org/w/api.php?action=query&titles=File:Nikita_Mazepin_2019.jpg&prop=imageinfo&iiprop=url&iiurlwidth=500&format=json';
  https.get(url, { headers: { 'User-Agent': 'F1TelemetryBot/1.0 (kengo@example.com)' } }, (res) => {
    let d = '';
    res.on('data', c => d += c);
    res.on('end', async () => {
      const j = JSON.parse(d);
      const p = Object.values(j.query.pages)[0];
      const thumbUrl = p.imageinfo[0].thumburl;
      console.log('Resolved thumb URL:', thumbUrl);
      const size = await downloadWithRedirect(thumbUrl, 'public/images/drivers/portraits/nikita-mazepin.jpg');
      console.log('Saved Mazepin:', size, 'bytes');
    });
  });
}

fixMazepin();
