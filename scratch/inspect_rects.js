const { spawn } = require('child_process');
const fs = require('fs');
const http = require('http');

async function main() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const browser = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9222',
    '--disable-gpu',
    '--window-size=1400,1050',
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

  await send('Page.navigate', { url: 'http://localhost:3000' });
  await new Promise(r => setTimeout(r, 4000));

  const rects = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const hero = document.querySelector('.relative.overflow-hidden.rounded-2xl');
        if (!hero) return 'Hero not found';
        const img = hero.querySelector('img');
        const r = hero.getBoundingClientRect();
        const ir = img ? img.getBoundingClientRect() : null;
        return {
          hero: { top: r.top, left: r.left, width: r.width, height: r.height },
          img: ir ? { top: ir.top, left: ir.left, width: ir.width, height: ir.height, position: window.getComputedStyle(img).position } : null,
          imgParent: img && img.parentElement ? { position: window.getComputedStyle(img.parentElement).position, width: img.parentElement.getBoundingClientRect().width, height: img.parentElement.getBoundingClientRect().height } : null
        };
      })()
    `,
    returnByValue: true
  });

  console.log('Rects:', JSON.stringify(rects.result.value, null, 2));

  // Take full screenshot
  const screenshot = await send('Page.captureScreenshot', { format: 'png' });
  const outPath = 'C:\\Users\\kengo\\.gemini\\antigravity\\brain\\3ac6e356-95bd-4657-9fa4-8a52393a709c\\season_cinematic_hero.png';
  fs.writeFileSync(outPath, Buffer.from(screenshot.data, 'base64'));

  ws.close();
  browser.kill();
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
