/** Capture just the Alarm Sound picker (05-sounds.png) — fresh page load. */
const puppeteer = require('puppeteer-core');
const path = require('path');

const OUT_DIR = process.argv[2] || path.join(__dirname, 'shots');
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function clickText(page, text) {
  const clicked = await page.evaluate((t) => {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT);
    let node;
    while ((node = walker.nextNode())) {
      if (node.childElementCount === 0 && node.textContent.trim() === t) {
        node.click();
        return true;
      }
    }
    return false;
  }, text);
  if (!clicked) throw new Error(`clickText: "${text}" not found`);
}

async function clickGear(page) {
  const buttons = await page.$$('[role="button"],[tabindex="0"]');
  let best = null;
  for (const b of buttons) {
    const box = await b.boundingBox();
    if (!box || box.y > 200) continue;
    if (!best || box.x > best.box.x) best = { el: b, box };
  }
  if (!best) throw new Error('gear button not found');
  await best.el.click();
}

(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: 'new',
    args: ['--hide-scrollbars', '--force-device-scale-factor=3'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 440, height: 956, deviceScaleFactor: 3 });
  await page.evaluateOnNewDocument(() => {
    localStorage.setItem('@pomodoro/soundId', 'church-bell');
  });
  await page.goto('http://localhost:8085', { waitUntil: 'networkidle2' });
  await sleep(2500);
  await clickGear(page);
  await sleep(800);
  await clickText(page, 'Alarm Sound');
  await sleep(1000);
  await page.screenshot({ path: path.join(OUT_DIR, '05-sounds.png') });
  await browser.close();
  console.log('captured 05-sounds.png');
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
