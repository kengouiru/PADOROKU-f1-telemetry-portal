const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  await page.setViewport({ width: 375, height: 812 });

  page.on('console', msg => console.log('BROWSER_LOG:', msg.text()));
  page.on('pageerror', err => console.log('BROWSER_ERROR:', err.toString()));

  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  
  // Wait for the button
  await page.waitForSelector('button[aria-label="AI Strategist を起動"]');
  console.log('Clicking button...');
  await page.click('button[aria-label="AI Strategist を起動"]');
  
  // Wait a bit to see if errors occur
  await new Promise(r => setTimeout(r, 3000));
  
  await browser.close();
})();
