const { spawn } = require('child_process');
const fs = require('fs');
const http = require('http');

async function main() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const browser = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9222',
    '--disable-gpu',
    '--window-size=1400,950',
    'about:blank'
  ]);

  await new Promise(r => setTimeout(r, 2000));

  const targets = await new Promise((resolve, reject) => {
    http.get('http://127.0.0.1:9222/json', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });

  const page = targets.find(t => t.type === 'page');
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((resolve) => ws.onopen = resolve);

  let id = 1;
  function send(method, params = {}) {
    return new Promise((resolve) => {
      const msgId = id++;
      const handler = (event) => {
        const data = JSON.parse(event.data);
        if (data.id === msgId) {
          ws.removeEventListener('message', handler);
          resolve(data.result);
        }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({ id: msgId, method, params }));
    });
  }

  await send('Page.enable');
  await send('Runtime.enable');

  console.log('Navigating to http://localhost:3000 ...');
  await send('Page.navigate', { url: 'http://localhost:3000' });

  // Wait 12 seconds for Next.js to compile and CSS to load
  console.log('Waiting 12s for compilation and hydration...');
  await new Promise(r => setTimeout(r, 12000));

  const doc = await send('Runtime.evaluate', { expression: 'document.title + " | " + document.body.innerText.slice(0, 100)' });
  console.log('Rendered page snippet:', doc.result.value);

  console.log('Capturing screenshot...');
  const screenshot = await send('Page.captureScreenshot', { format: 'png' });

  const artifactDir = 'C:\\Users\\kengo\\.gemini\\antigravity\\brain\\3ac6e356-95bd-4657-9fa4-8a52393a709c';
  const outPath = artifactDir + '\\season_cinematic_vivid.png';
  fs.writeFileSync(outPath, Buffer.from(screenshot.data, 'base64'));

  console.log('Saved screenshot to:', outPath);

  ws.close();
  browser.kill();
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
