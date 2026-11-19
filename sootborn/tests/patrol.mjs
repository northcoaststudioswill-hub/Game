import { chromium } from 'playwright';
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || undefined });
const page = await (await browser.newContext({ viewport: { width: 960, height: 540 } })).newPage();
const errors = []; page.on('pageerror', e => errors.push(e.message));
const wait = ms => page.waitForTimeout(ms), ev = (f, a) => page.evaluate(f, a);
await page.goto(new URL('../index.html', import.meta.url).href + '#noff'); await wait(600); await page.keyboard.press('Enter'); await wait(6500);
for (const [k, dark] of [['raid', 0], ['raid', 1], ['dais', 0]]) {
  await ev(([k, dark]) => { BTS.UI.clear(); Mission.start(k, () => BTS.Game.toTitle()); if (dark) { BTS.G.flags.m_dark = 1; Mission.resetNPCs(); } window.__w = {}; }, [k, dark]);
  for (let i = 0; i < 44; i++) { await ev(() => { BTS.World.grace = 9; BTS.World.npcs.forEach((n, j) => { if (n.patrol) { (window.__w[j] = window.__w[j] || new Set()).add(n.wi); } }); }); await wait(500); if (i === 20) await page.screenshot({ path: `shots/patrol-${k}${dark}.png` }); }
  console.log(k, dark, await ev(() => Object.entries(window.__w).map(([j, s]) => j + ':' + [...s].sort().join('')).join(' ')), await ev(() => BTS.World.npcs.filter(n => n.patrol).map(n => n.wander.length)));
  await ev(() => Mission.finish()); await wait(400);
}
console.log(errors); await browser.close();
