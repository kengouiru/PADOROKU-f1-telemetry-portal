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
  await new Promise(r => setTimeout(r, 4000));

  // Inspect the Hero section elements
  const res = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const hero = document.querySelector('.relative.overflow-hidden.rounded-2xl');
        if (!hero) return 'Hero not found';
        const img = hero.querySelector('img');
        const textElements = Array.from(hero.querySelectorAll('h1, button, span, p')).map(el => el.innerText.trim()).filter(Boolean);
        return {
          heroRect: hero.getBoundingClientRect(),
          imgRect: img ? img.getBoundingClientRect() : null,
          imgSrc: img ? img.src : null,
          textCount: textElements.length,
          sampleTexts: textElements.slice(0, 15),
          heroOuterHTML: hero.outerHTML.slice(0, 500)
        };
      })()
    `,
    returnByValue: true
  });

  console.log('Hero inspection result:', JSON.stringify(res.result.value, null, 2));

  ws.close();
  browser.kill();
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
