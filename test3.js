const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  await page.setViewport({ width: 375, height: 812 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  
  await page.waitForSelector('button[aria-label="AI Strategist を起動"]');
  await page.click('button[aria-label="AI Strategist を起動"]');
  
  await new Promise(r => setTimeout(r, 1000));
  
  await page.screenshot({ path: 'screenshot.png' });
  console.log('Screenshot taken!');
  
  await browser.close();
})();
