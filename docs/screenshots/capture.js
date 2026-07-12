/**
 * Capture App Store screenshots from the Sacred Focus web build.
 * Viewport 440x956 (iPhone 16 Pro Max points) at deviceScaleFactor 3
 * => exact 1320x2868 px PNGs, the required 6.9" size.
 */
const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const APP_URL = 'http://localhost:8085';
const OUT_DIR = process.argv[2] || path.join(__dirname, 'shots');
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** Build ~3 weeks of plausible session history, ending today. */
function buildHistory(now) {
  const dayMs = 24 * 60 * 60 * 1000;
  const records = [];
  // counts per day, oldest -> newest (21 days, all >=1 so streak = 21)
  const counts = [3, 4, 2, 5, 4, 3, 6, 4, 5, 3, 4, 6, 5, 2, 4, 5, 3, 7, 5, 4, 6];
  counts.forEach((count, i) => {
    const dayStart = now - (counts.length - 1 - i) * dayMs;
    for (let s = 0; s < count; s++) {
      // spread sessions across a working day: 9:00 + ~90min apart
      const d = new Date(dayStart);
      d.setHours(9 + Math.floor(s * 1.5), (s * 37) % 60, 0, 0);
      records.push({ completedAt: d.getTime(), durationSec: 1500 });
    }
  });
  return records.sort((a, b) => a.completedAt - b.completedAt);
}

async function seed(page, timerState) {
  const history = buildHistory(Date.now());
  await page.evaluateOnNewDocument(
    (state, hist) => {
      localStorage.setItem('@pomodoro/timerState', JSON.stringify(state));
      localStorage.setItem('@pomodoro/sessionHistory', JSON.stringify(hist));
      localStorage.setItem('@pomodoro/soundId', 'church-bell');
    },
    timerState,
    history
  );
}

/** Click the element whose visible text matches exactly. */
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

/** Click the top-right [role=button] (the settings gear). */
async function clickGear(page) {
  const buttons = await page.$$('[role="button"],[tabindex="0"]');
  let best = null;
  for (const b of buttons) {
    const box = await b.boundingBox();
    if (!box || box.y > 200) continue; // header area only
    if (!best || box.x > best.box.x) best = { el: b, box };
  }
  if (!best) throw new Error('gear button not found');
  await best.el.click();
}

async function shot(page, name) {
  await sleep(700); // let animations settle
  await page.screenshot({ path: path.join(OUT_DIR, name) });
  console.log('captured', name);
}

(async () => {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: 'new',
    args: ['--hide-scrollbars', '--force-device-scale-factor=3'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 440, height: 956, deviceScaleFactor: 3 });

  // ---- 1. Focus session in progress (session 3 of 4, 14:37 left, running)
  await seed(page, {
    phase: 'work',
    timeRemaining: 14 * 60 + 37,
    currentSession: 3,
    phaseDuration: 1500,
    isRunning: true,
    savedAt: Date.now(),
  });
  await page.goto(APP_URL, { waitUntil: 'networkidle2' });
  await sleep(2500); // fonts + restore + ring animation
  await shot(page, '01-focus.png');

  // ---- 2. Break with Scripture verse (short break, 4:12 left)
  await seed(page, {
    phase: 'shortBreak',
    timeRemaining: 4 * 60 + 12,
    currentSession: 3,
    phaseDuration: 300,
    isRunning: true,
    savedAt: Date.now(),
  });
  await page.goto(APP_URL, { waitUntil: 'networkidle2' });
  await sleep(2500);
  await shot(page, '02-break-verse.png');

  // ---- 3. Stats sheet (via gear -> Stats)
  await clickGear(page);
  await sleep(800);
  await clickText(page, 'Stats');
  await sleep(800);
  await shot(page, '03-stats.png');
  await clickText(page, 'Done').catch(() => {});
  await sleep(500);

  // ---- 4. Durations sheet — reload into a work phase first
  await seed(page, {
    phase: 'work',
    timeRemaining: 1500,
    currentSession: 1,
    phaseDuration: 1500,
    isRunning: false,
    savedAt: Date.now(),
  });
  await page.goto(APP_URL, { waitUntil: 'networkidle2' });
  await sleep(2000);
  await clickGear(page);
  await sleep(800);
  await clickText(page, 'Durations');
  await sleep(800);
  await shot(page, '04-durations.png');
  await clickText(page, 'Done').catch(() => {});
  await sleep(500);

  // ---- 5. Alarm sound picker
  await clickGear(page);
  await sleep(800);
  await clickText(page, 'Alarm Sound');
  await sleep(800);
  await shot(page, '05-sounds.png');

  await browser.close();
  console.log('done ->', OUT_DIR);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
