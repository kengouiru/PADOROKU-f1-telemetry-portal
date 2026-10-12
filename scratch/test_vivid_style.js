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

  await send('Page.navigate', { url: 'http://localhost:3000' });
  await new Promise(r => setTimeout(r, 3000));

  // Let's modify the styles dynamically in the page to make the night view DRAMATICALLY VISIBLE!
  await send('Runtime.evaluate', {
    expression: `
      (() => {
        const hero = document.querySelector('.relative.overflow-hidden.rounded-2xl, .relative.overflow-hidden.rounded-3xl');
        if (!hero) return;
        
        // Remove existing overlays and recreate clean, truly visible photo styling
        const img = hero.querySelector('img');
        if (img) {
          img.style.opacity = '1';
          img.style.filter = 'brightness(1.3) contrast(1.2) saturate(1.3)';
          img.style.objectPosition = 'center 65%';
        }
        
        // Find gradient overlays and lighten them significantly
        const overlays = hero.querySelectorAll('.absolute.inset-0.bg-gradient-to-r, .absolute.inset-0.bg-gradient-to-t');
        overlays.forEach(o => {
          o.style.background = 'linear-gradient(to right, rgba(2,6,23,0.7) 0%, rgba(2,6,23,0.3) 50%, rgba(2,6,23,0.1) 100%)';
        });

        // Make timetable buttons semi-transparent frosted glass so the photo shines through!
        const buttons = hero.querySelectorAll('button');
        buttons.forEach(b => {
          b.style.backgroundColor = 'rgba(0, 0, 0, 0.4)';
          b.style.backdropFilter = 'blur(6px)';
          b.style.borderColor = 'rgba(255, 255, 255, 0.2)';
        });
      })()
    `
  });

  await new Promise(r => setTimeout(r, 1000));

  const screenshot = await send('Page.captureScreenshot', { format: 'png' });
  const outPath = 'C:\\Users\\kengo\\.gemini\\antigravity\\brain\\3ac6e356-95bd-4657-9fa4-8a52393a709c\\season_cinematic_hero.png';
  fs.writeFileSync(outPath, Buffer.from(screenshot.data, 'base64'));
  console.log('Saved dynamic style screenshot to:', outPath);

  ws.close();
  browser.kill();
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
