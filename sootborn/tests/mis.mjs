import { chromium } from 'playwright';
// walks each Assay mission by script (teleports to each objective), screenshots, and checks it hands back
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || undefined });
const page = await (await browser.newContext({ viewport: { width: 960, height: 540 } })).newPage();
const errors = []; page.on('pageerror', e => errors.push(e.stack.split('\n').slice(0,4).join(' | ').slice(0,400)));
const wait = ms => page.waitForTimeout(ms), ev = (f, a) => page.evaluate(f, a);
await page.goto(new URL('../index.html', import.meta.url).href + '#noff'); await wait(600); await page.keyboard.press('Enter'); await wait(6500);
const talk = async () => { for (let i = 0; i < 60; i++) { const s = await ev(() => ({ d: BTS.Dialogue.active, c: !!document.querySelector('.choices button'), p: BTS.Puzzle.active })); if (s.p) { await ev(() => { const P = BTS.Puzzle; for (const row of P.grid) for (const c of row) c.m = c.sol; P.flowR = P.flow(); P.solved = true; P.solveT = 0; }); await wait(2500); await page.keyboard.press('KeyE'); await wait(1500); continue; } if (!s.d) break; if (s.c) await ev(() => document.querySelector('.choices button').click()); else await page.keyboard.press('KeyE'); await wait(140); } };
const at = async (x, y, dir) => { await ev(([x, y, dir]) => { const P = BTS.P; P.x = x * 16 + 8; P.y = y * 16 + 4; P.dir = dir; BTS.World.grace = 9; }, [x, y, dir]); await wait(250); };
const use = async hold => { if (hold) { await page.keyboard.down('KeyE'); await wait(2600); await page.keyboard.up('KeyE'); } else await page.keyboard.press('KeyE'); await wait(400); await talk(); };
const shot = n => page.screenshot({ path: `shots/mis-${n}.png` });
const st = () => ev(() => [BTS.G.heist, BTS.G.mode, BTS.G.mapId, BTS.UI.objectiveText ? '' : '', Object.keys(BTS.G.flags).filter(k => k.startsWith('m_')).join(',')]);
let ended = 0; const run = async (k, steps) => { ended = 0; await ev(k => { BTS.UI.clear(); window.__done = 0; Mission.start(k, () => { window.__done = 1; BTS.Game.toTitle(); }); }, k); await wait(2200); await shot(k + '-0'); console.log(k, 'start', await st());
  let i = 1; for (const [x, y, d, hold] of steps) { await at(x, y, d); await shot(k + '-' + i++); await use(hold); console.log(k, [x, y], await st()); }
  await wait(800); console.log(k, 'done', await ev(() => [window.__done, BTS.G.heist, BTS.G.mode])); };
if (process.env.EVE) { await run('eve', [[10, 7, 1], [14, 10, 0], [19, 8, 2], [20, 7, 3], [12, 10, 1, 1]]); console.log('errors', errors); await browser.close(); process.exit(0); }
await run('count', [[11, 4, 1], [15, 5, 1], [22, 5, 1, 1], [1, 4, 1, 1]]);
await run('sun', [[13, 9, 1, 1]]);
if (!process.env.ALL) { console.log('errors', errors); await browser.close(); process.exit(0); }
await run('camp', [[11, 8, 2], [16, 9, 2], [20, 6, 1], [3, 12, 1], [12, 10, 1, 1]]);
await run('raid', [[14, 5, 1, 1], [26, 7, 3, 1]]);
await run('dais', [[10, 5, 1], [14, 5, 1], [18, 5, 1, 1]]);
console.log('errors', errors); await browser.close();
