import { mkdirSync } from 'fs'; mkdirSync('shots', { recursive: true });
import { chromium } from 'playwright';
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || undefined });
const page = await (await browser.newContext({ viewport: { width: 844, height: 390 } })).newPage();
const errors = []; page.on('pageerror', e => errors.push(e.message));
const wait = ms => page.waitForTimeout(ms), ev = (f, a) => page.evaluate(f, a);
await page.goto(new URL('../index.html', import.meta.url).href + '#noff'); await wait(600); await page.keyboard.press('Enter'); await wait(6500);
await ev(() => { const s = { v: 2, t: 1, name: 'Kael', look: 0, tendency: 'caretaker', day: 2, map: 'apt', x: 56, y: 76, dir: 0, flags: { day1Done: 1, d2Tavi: 1, lanternBuilt: 1 }, trust: {}, scrip: 0, journal: [], log: [], play: 0, talkCount: {} }; BTS.UI.clear(); BTS.Game.loadSave(s); BTS.Game.startFestStealth(); });
await wait(1500);
const st = () => ev(() => ({ p: [BTS.P.x, BTS.P.y], g: BTS.World.npcs.filter(n => n.patrol).map(n => ({ id: n.id, x: n.x, y: n.y, dir: n.dir, wait: n.wait, wi: n.wi })), caught: BTS.G.flags.caught2 | 0, dlg: BTS.Dialogue.active, heist: BTS.G.heist, cine: BTS.Cutscene.active }));
async function walk(k, until, max = 6000) { await page.keyboard.down(k); const t0 = Date.now(); while (Date.now() - t0 < max) { const s = await st(); if (until(s)) break; await wait(30); } await page.keyboard.up(k); }
const t0 = Date.now();
// 1) up the west side behind the lantern stacks to row 7
await walk('ArrowUp', s => s.p[1] < 9 * 16 + 14);
// wait for Sull to be heading down the east leg
for (let i = 0; i < 400; i++) { const s = await st(), sull = s.g[0]; if (sull.x > 16.5 * 16 && sull.y > 6.5 * 16 + 12) break; await wait(50); }
await walk('ArrowUp', s => s.p[1] < 7 * 16 + 13);
await walk('ArrowRight', s => s.p[0] > 11 * 16 + 6);
// wait until the north sentry is not looking down
for (let i = 0; i < 200; i++) { const s = await st(), n = s.g[2]; if (n.dir !== 0 && n.wait > 1.2) break; await wait(40); }
await walk('ArrowRight', s => s.p[0] > 13 * 16 + 4, 1500);
await page.keyboard.down('ArrowDown'); await wait(90); await page.keyboard.up('ArrowDown'); await page.keyboard.down('KeyE'); await wait(2300); await page.keyboard.up('KeyE'); await wait(500);
const s = await st(); console.log('took', ((Date.now() - t0) / 1000).toFixed(1) + 's', 'caught', s.caught, 'finale', s.cine, 'pos', s.p.map(v => (v / 16).toFixed(1)));
await page.screenshot({ path: 'shots/sneak.png' }); console.log(errors); await browser.close();
