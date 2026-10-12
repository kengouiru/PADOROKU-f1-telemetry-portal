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

  // Inspect the hero container, image, and overlays
  const result = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const hero = document.querySelector('.relative.overflow-hidden.rounded-2xl, .relative.overflow-hidden.rounded-3xl');
        if (!hero) return 'Hero not found';
        const img = hero.querySelector('img');
        const overlays = Array.from(hero.querySelectorAll('div')).filter(d => d.className.includes('gradient'));
        
        return {
          heroBg: window.getComputedStyle(hero).backgroundColor,
          img: img ? {
            src: img.src,
            naturalWidth: img.naturalWidth,
            naturalHeight: img.naturalHeight,
            complete: img.complete,
            computedOpacity: window.getComputedStyle(img).opacity,
            computedDisplay: window.getComputedStyle(img).display,
            computedVisibility: window.getComputedStyle(img).visibility,
            computedZIndex: window.getComputedStyle(img).zIndex,
            rect: img.getBoundingClientRect()
          } : null,
          overlays: overlays.map(o => ({
            className: o.className,
            bg: window.getComputedStyle(o).backgroundImage,
            opacity: window.getComputedStyle(o).opacity,
            zIndex: window.getComputedStyle(o).zIndex
          }))
        };
      })()
    `,
    returnByValue: true
  });

  console.log('Result:', JSON.stringify(result.result.value, null, 2));

  ws.close();
  browser.kill();
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
