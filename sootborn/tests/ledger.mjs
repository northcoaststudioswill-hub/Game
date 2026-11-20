// the Count as a puzzle: played by a script that reads the page and the eye, with real key presses. node ledger.mjs
import { chromium } from 'playwright';
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const page = await (await browser.newContext({ viewport: { width: +(process.env.VW || 1280), height: +(process.env.VH || 720) } })).newPage();
const errors = []; page.on('pageerror', e => errors.push(e.message)); const wait = ms => page.waitForTimeout(ms), ev = (f, a) => page.evaluate(f, a);
const shot = n => page.screenshot({ path: `/home/claude/shots/v74/ledger-${process.env.TAG || ''}${n}.png` });
await page.goto('file:///home/claude/below-the-sun/dist/index.html#noff'); await wait(600);
for (let i = 0; i < 40 && !(await ev(() => BTS.G.mode === 'title' && BTS.UI.stack.length)); i++) { await page.keyboard.press('Enter'); await wait(250); } await wait(300);
await ev(() => { BTS.UI.clear(); BTS.G.mode = 'cut'; window.__end = 0; BTS.Cutscene.play([{ ledger: 1 }, { narr: 'after' }], () => { window.__end = 1; }); });
for (let i = 0; i < 30 && !(await ev(() => Prelude.on && Prelude.gm)); i++) await wait(100);
await wait(500); await shot(0);
const S = () => ev(() => { const g = Prelude.gm; return g ? { v: g.rows.map(r => r.v), base: g.rows.map(r => r.base), need: g.rows.map(r => r.need), sel: g.sel, hand: g.hand, from: g.from, eye: g.eye, noted: g.noted, phase: g.phase, t: g.t } : null; });
const press = async k => { await page.keyboard.press(k); await wait(45); };
const goto = async i => { for (let n = 0; n < 12; n++) { const s = await S(); if (!s || s.sel === i) return; await press(((i - s.sel + 7) % 7) <= 3 ? 'KeyS' : 'KeyW'); } };
// 1. do it wrong once on purpose: lift on the line the eye is reading
for (let i = 0; i < 80; i++) { const s = await S(); if (s.eye === 0) { await goto(0); if ((await S()).eye === 0) { await press('KeyE'); break; } } await wait(60); }
console.log('lifted under the eye -> noted', (await S()).noted); await shot(1);
// 2. then play it properly: never act on the eye's line, never move a line more than 4 between readings
const t0 = Date.now(); let moves = 0, snapped = 0;
while (Date.now() - t0 < 75000) { const s = await S(); if (!s || s.phase !== "play") break; if (process.env.DBG && Math.random() < .08) console.log(JSON.stringify(s));
  const safe = i => s.eye !== i && ((s.eye + 1) % 9) !== i;   // not being read, and not the next to be read
  if (s.hand === 0) { const dst = [4, 6, 5, 3, 2, 1, 0].find(i => s.v[i] < s.need[i]), src = [0, 1, 2, 3, 5, 6].find(i => s.v[i] > s.need[i] && safe(i) && s.base[i] - s.v[i] < 4); if (dst === undefined || src === undefined) { await wait(80); continue; }
    await goto(src); const n = Math.min(4, s.v[src] - s.need[src], s.need[dst] - s.v[dst], 4 - (s.base[src] - s.v[src]), 4 - (s.v[dst] - s.base[dst])); for (let k = 0; k < n; k++) { const q = await S(); if (q.eye === src) break; await press('KeyE'); } if (n <= 0) await wait(120); }
  else { const dst = [4, 6, 5, 3, 2, 1, 0].find(i => s.v[i] < s.need[i] && safe(i) && s.v[i] + s.hand - s.base[i] <= 4); if (dst === undefined) { await wait(80); continue; } await goto(dst); const q = await S(); if (q.eye === dst) { await wait(120); continue; } await press('KeyE'); moves++; if (moves === 3 && !snapped) { snapped = 1; await shot(2); } }
}
let s = await S(); console.log('after carrying:', JSON.stringify(s && { v: s.v, noted: s.noted, phase: s.phase }), 'moves', moves, 'seconds', Math.round((Date.now() - t0) / 1000));
await wait(1200); await shot(3);
await page.keyboard.down('KeyE'); await wait(900); await shot(4); await wait(1600); await page.keyboard.up('KeyE'); await wait(600); await shot(5);
s = await S(); console.log('signed:', s && s.phase, 'flags', await ev(() => [BTS.G.flags.countDone, BTS.G.flags.countNoted]));
for (let i = 0; i < 40 && (await ev(() => Prelude.on)); i++) await wait(200);
await wait(600); console.log('handed back to the story:', await ev(() => BTS.Cutscene.active || window.__end), 'errors', errors);
await browser.close();
