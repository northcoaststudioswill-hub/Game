import { chromium } from 'playwright';
import { mkdirSync } from 'fs'; mkdirSync('shots', { recursive: true });
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || undefined });
const P = process.env.PORTRAIT, page = await (await browser.newContext({ viewport: P ? { width: 390, height: 844 } : { width: 844, height: 390 } })).newPage();
const errors = []; page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
const wait = ms => page.waitForTimeout(ms), ev = (f, a) => page.evaluate(f, a), shot = n => page.screenshot({ path: `shots/${P ? 'p-' : ''}${n}.png` });
await page.goto(new URL('../index.html', import.meta.url).href + ''); await wait(600); await page.keyboard.press('Enter');
// wait for splash to end and the opening to begin
for (let i = 0; i < 100 && !(await ev(() => BTS.G.mode === 'opening')); i++) await wait(100);
const mode = process.env.M || 'opening';
if (mode === 'opening') {
  for (let i = 0; i < 17; i++) { await ev(i => { const B = BTS.Brawl; while (B.cine && B.cine.i < i) B.nextShot(); }, i); await wait(Number(process.env.T || 900)); await shot('open-' + i); }
  await ev(() => { BTS.Brawl.tap = true; }); await wait(1500); await shot('open-title'); console.log('mode', await ev(() => BTS.G.mode));
} else {
  await ev(() => { BTS.Brawl.tap = true; }); await wait(1200);
  await ev(m => { const d = BTS.FF[m](); if (process && 0) 0; window.__r = null; BTS.Brawl.start(d, w => { window.__r = w; }); }, mode).catch(async () => { await ev(m => { window.__r = null; BTS.Brawl.start(BTS.FF[m](), w => { window.__r = w; }); }, mode); });
  const n = await ev(() => BTS.Brawl.cine ? BTS.Brawl.cine.shots.length : 0);
  for (let i = 0; i < n; i++) { await wait(800); await shot(`${mode}-in-${i}`); await ev(() => { BTS.Brawl.cine && BTS.Brawl.nextShot(); }); }
  await wait(1900); await shot(`${mode}-fight-0`);
  // simple bot: chase, strike, dodge on threat, hold for ELEVEN
  const held = new Set(); const hold = async (k, on) => { if (on && !held.has(k)) { held.add(k); await page.keyboard.down(k); } if (!on && held.has(k)) { held.delete(k); await page.keyboard.up(k); } };
  let shots = 0, supShot = 0;
  for (let i = 0; i < 2500; i++) {
    const s = await ev(() => { const B = BTS.Brawl; return B.active && !B.cine ? { ph: B.phase, sup: !!B.sup, supT: B.sup && B.sup.t, fury: B.p.fury, hp: B.p.hp, t: B.t, p: { x: B.p.x, y: B.p.y }, f: B.foes.filter(f => f.st !== 'down' && !f.enter).map(f => ({ x: f.x, y: f.y, st: f.st, t: f.t, w: f.K.wind, mode: f.mode, reach: f.K.reach })) } : null; });
    if (!s) break;
    if (s.sup && supShot < 4 && (supShot === 0 ? s.supT > .5 : s.supT > 1 + supShot * .35)) { await shot(`${mode}-eleven-${supShot++}`); }
    if (i % 60 === 30 && shots < 5) await shot(`${mode}-fight-${++shots}`);
    if (s.ph !== 'fight' || !s.f.length || s.sup) { await wait(50); continue; }
    if (s.fury >= 100) { for (const k of [...held]) await hold(k, false); await page.keyboard.down('KeyE'); await wait(520); await page.keyboard.up('KeyE'); continue; }
    const f = s.f.reduce((a, b) => Math.hypot(a.x - s.p.x, a.y - s.p.y) < Math.hypot(b.x - s.p.x, b.y - s.p.y) ? a : b), dx = f.x - s.p.x, dy = f.y - s.p.y, d = Math.hypot(dx, dy);
    const threat = s.f.find(o => (o.st === 'wind' && o.t > o.w - 0.16 && Math.hypot(o.x - s.p.x, o.y - s.p.y) < (o.mode === 'charge' ? 130 : o.reach + 22)) || (o.st === 'charge' && Math.hypot(o.x - s.p.x, o.y - s.p.y) < 50));
    if (threat && process.env.BOT !== 'mash') { await page.keyboard.press('KeyX'); await wait(120); continue; }
    await hold('ArrowRight', dx > 14); await hold('ArrowLeft', dx < -14); await hold('ArrowDown', dy > 8); await hold('ArrowUp', dy < -8);
    if (d < 30) await page.keyboard.press('KeyE');
    await wait(45);
  }
  for (const k of [...held]) await page.keyboard.up(k);
  console.log('fight over t=', await ev(() => [BTS.Brawl.t, BTS.Brawl.p.hp, BTS.Brawl.phase, 'revived', BTS.Brawl.revived, 'tries', BTS.Brawl.def._tries || 0]));
  const m = await ev(() => BTS.Brawl.cine ? BTS.Brawl.cine.shots.length : 0);
  for (let i = 0; i < m; i++) { await wait(900); await shot(`${mode}-out-${i}`); await ev(() => { BTS.Brawl.cine && BTS.Brawl.nextShot(); }); }
  await wait(500); console.log('result', await ev(() => window.__r), 'active', await ev(() => BTS.Brawl.active));
}
console.log('errors', errors); await browser.close();
