import { chromium } from 'playwright';
const PORT = !!process.env.PORTRAIT, tag = PORT ? 'rvp' : 'rv';
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome' });
const ctx = await browser.newContext({ viewport: PORT ? { width: 390, height: 844 } : { width: 844, height: 390 }, hasTouch: PORT });
const page = await ctx.newPage();
const errors = []; page.on('pageerror', e => errors.push(e.message + (e.stack || '').split('\n').slice(0, 3).join(' | ')));
const wait = ms => page.waitForTimeout(ms), ev = (f, a) => page.evaluate(f, a);
const key = async (k, n = 1, gap = 120) => { for (let i = 0; i < n; i++) { await page.keyboard.press(k); await wait(gap); } };
await page.goto('file:///home/claude/below-the-sun/dist/index.html#noff'); await wait(600); await key('Enter', 1, 400); await wait(6500);
await page.locator('.mi', { hasText: 'New game' }).click(); await wait(500);
let n = 0; const shot = () => page.screenshot({ path: `/home/claude/shots/${tag}-${String(n++).padStart(3, '0')}.png` });
async function cine(every) { let g = 0; while (await ev(() => BTS.Cutscene.active) && g++ < 1200) { if (g % every === 0) await shot(); const ch = await ev(() => !!BTS.Dialogue.choices); await key('Enter', 1, ch ? 260 : 300); } }
await cine(PORT ? 9 : 4);
console.log('A frames', n);
// skip heist quickly
await wait(1200); await shot();
await ev(() => { BTS.G.flags.relayCut = 1; BTS.World.npcs.forEach(q => { if (q.patrol) { q.x = 4 * 16; q.y = 12 * 16; q.wait = 99; } }); BTS.P.x = 10 * 16 + 8; BTS.P.y = 2 * 16 + 12; BTS.P.dir = 1; }); await key('KeyE', 1, 500);
await ev(() => { const Pz = BTS.Puzzle; for (const row of Pz.grid) for (const c of row) if (c.kind === 'pipe') c.m = c.sol; Pz.flowR = Pz.flow(); Pz.solved = true; Pz.solveT = 0; }); await wait(2300);
const a0 = n; await cine(PORT ? 9 : 4); console.log('B frames', n - a0, 'errors', errors);
await browser.close();
