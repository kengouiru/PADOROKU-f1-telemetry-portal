import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';

const rootDir = 'C:\\CreationKengo\\F1analyisis-app\\f1-telemetry-next';

const driversDir = path.join(rootDir, 'public', 'images', 'drivers');
const circuitsDir = path.join(rootDir, 'public', 'images', 'circuits');

if (!fs.existsSync(driversDir)) fs.mkdirSync(driversDir, { recursive: true });
if (!fs.existsSync(circuitsDir)) fs.mkdirSync(circuitsDir, { recursive: true });

function fetchJson(url) {
  return new Promise((resolve) => {
    https.get(url, { headers: { 'User-Agent': 'F1TelemetryApp/1.0 (contact: local-dev@example.com)' } }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); } catch (e) { resolve(null); }
      });
    }).on('error', () => resolve(null));
  });
}

// Convert upload.wikimedia.org URL to Wikimedia title and fetch 960px thumb
async function resolveWikimediaThumb(url) {
  try {
    const filenameMatch = url.match(/\/commons\/(?:thumb\/)?(?:[a-f0-9]\/[a-f0-9]{2}\/)?([^\/]+)/);
    if (!filenameMatch) return null;
    let fileName = decodeURIComponent(filenameMatch[1]);
    // remove width prefix if any (e.g. 500px-FileName.jpg -> FileName.jpg)
    fileName = fileName.replace(/^\d+px-/, '');
    
    const apiUrl = `https://commons.wikimedia.org/w/api.php?action=query&titles=File:${encodeURIComponent(fileName)}&prop=imageinfo&iiprop=url&iiurlwidth=960&format=json`;
    const data = await fetchJson(apiUrl);
    const pages = Object.values(data?.query?.pages || {});
    return pages[0]?.imageinfo?.[0]?.thumburl || null;
  } catch (e) {
    return null;
  }
}

function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(destPath) && fs.statSync(destPath).size > 1000) {
      return resolve(true);
    }

    const client = url.startsWith('https') ? https : http;
    const req = client.get(
      url,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) F1Telemetry/1.0',
          'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
        },
      },
      (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          return downloadFile(res.headers.location, destPath).then(resolve).catch(reject);
        }
        if (res.statusCode !== 200) {
          return reject(new Error(`HTTP ${res.statusCode}`));
        }
        const fileStream = fs.createWriteStream(destPath);
        res.pipe(fileStream);
        fileStream.on('finish', () => {
          fileStream.close();
          resolve(true);
        });
      }
    );

    req.on('error', (err) => {
      if (fs.existsSync(destPath)) fs.unlinkSync(destPath);
      reject(err);
    });

    req.setTimeout(12000, () => {
      req.destroy();
      if (fs.existsSync(destPath)) fs.unlinkSync(destPath);
      reject(new Error(`Timeout downloading ${url}`));
    });
  });
}

function getExtension(url) {
  try {
    const cleanUrl = url.split('?')[0];
    const ext = path.extname(cleanUrl).toLowerCase();
    if (ext === '.svg' || ext === '.png' || ext === '.webp') return ext;
    return '.jpg';
  } catch {
    return '.jpg';
  }
}

async function run() {
  const dataPath = path.join(rootDir, 'data', 'f1KnowledgeData.ts');
  let content = fs.readFileSync(dataPath, 'utf8');

  // Extract all wikimedia URLs
  const urlRegex = /https:\/\/(?:upload|thumb)\.wikimedia\.org\/[^\s'"]+/g;
  const matches = [...content.matchAll(urlRegex)];

  console.log(`Found ${matches.length} Wikimedia URLs to download.`);

  const urlMap = new Map();
  let driverIdx = 0;
  let circuitIdx = 0;

  for (const match of matches) {
    const rawUrl = match[0];
    if (urlMap.has(rawUrl)) continue;

    const isCircuit = match.index > content.indexOf('export const KNOWLEDGE_CIRCUITS');
    const ext = getExtension(rawUrl);

    let filename = '';
    let localPath = '';
    let publicUrl = '';

    if (isCircuit) {
      circuitIdx++;
      filename = `circuit_asset_${circuitIdx}${ext}`;
      localPath = path.join(circuitsDir, filename);
      publicUrl = `/images/circuits/${filename}`;
    } else {
      driverIdx++;
      filename = `driver_asset_${driverIdx}${ext}`;
      localPath = path.join(driversDir, filename);
      publicUrl = `/images/drivers/${filename}`;
    }

    let success = false;
    // Attempt 1: Direct download
    try {
      await downloadFile(rawUrl, localPath);
      success = true;
      console.log(`[SUCCESS] ${filename}`);
    } catch (e1) {
      console.log(`[RETRY via API] ${rawUrl}`);
      // Attempt 2: Resolve thumb URL via API
      const thumbUrl = await resolveWikimediaThumb(rawUrl);
      if (thumbUrl) {
        try {
          await downloadFile(thumbUrl, localPath);
          success = true;
          console.log(`[SUCCESS via THUMB] ${filename}`);
        } catch (e2) {
          console.error(`[FAIL] ${filename}: ${e2.message}`);
        }
      } else {
        console.error(`[FAIL to resolve thumb] ${rawUrl}`);
      }
    }

    if (success) {
      urlMap.set(rawUrl, publicUrl);
    }

    await new Promise(r => setTimeout(r, 150));
  }

  console.log(`Successfully downloaded ${urlMap.size} files.`);

  // Update content
  for (const [remoteUrl, localUrl] of urlMap.entries()) {
    content = content.replaceAll(remoteUrl, localUrl);
  }

  fs.writeFileSync(dataPath, content, 'utf8');
  console.log('Successfully updated data/f1KnowledgeData.ts with all local paths!');
}

run().catch(console.error);
