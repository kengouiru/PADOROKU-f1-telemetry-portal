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
    { code: 'VET', title: 'Sebastian Vettel', filename: 'sebastian-vettel.jpg' },
    { code: 'RAI', title: 'Kimi Räikkönen', filename: 'kimi-raikkonen.jpg' },
    { code: 'MAN', title: 'Nigel Mansell', filename: 'nigel-mansell.jpg' },
    { code: 'HAK', title: 'Mika Häkkinen', filename: 'mika-hakkinen.jpg' },
    { code: 'BUT', title: 'Jenson Button', filename: 'jenson-button.jpg' },
    { code: 'ROS', title: 'Nico Rosberg', filename: 'nico-rosberg.jpg' },
    { code: 'MAS', title: 'Felipe Massa', filename: 'felipe-massa.jpg' },
    { code: 'GRO', title: 'Romain Grosjean', filename: 'romain-grosjean.jpg' },
    { code: 'KVY', title: 'Daniil Kvyat', filename: 'daniil-kvyat.jpg' },
    { code: 'SAR', title: 'Logan Sargeant', filename: 'logan-sargeant.jpg' },
    { code: 'KUB', title: 'Robert Kubica', filename: 'robert-kubica.jpg' },
    { code: 'GIO', title: 'Antonio Giovinazzi', filename: 'antonio-giovinazzi.jpg' },
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
