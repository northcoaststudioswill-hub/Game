import { chromium } from 'playwright';
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || undefined });
const page = await (await browser.newContext({ viewport: { width: 844, height: 390 } })).newPage();
const errors = []; page.on('pageerror', e => errors.push(e.message));
const wait = ms => page.waitForTimeout(ms), ev = (f, a) => page.evaluate(f, a);
await page.goto(new URL('../index.html', import.meta.url).href + '#noff'); await wait(600); await page.keyboard.press('Enter'); await wait(6500);
await ev(() => { const s = { v: 2, t: 1, name: 'Kael', look: 0, tendency: 'caretaker', day: 2, map: 'square', x: 300, y: 130, dir: 0, flags: { day1Done: 1, d2Tavi: 1 }, trust: {}, scrip: 0, journal: [], log: [], play: 0, talkCount: {} }; BTS.UI.clear(); BTS.Game.loadSave(s); });
await wait(800);
const DEFS = { ivo: [{ id: 'ivo', name: 'Ivo', kind: 'jab', hp: 9 }], garran: [{ id: 'garran', name: 'Garran', kind: 'heavy', hp: 16 }, { id: 'pike', name: 'Pike', kind: 'quick', hp: 8 }], sull: [{ id: 'proctor', name: 'Sull', kind: 'baton', hp: 22 }], mara: [{ id: 'mara', name: 'Mara', kind: 'boss', hp: 39 }] };
async function run(name, bot) {
  await ev(([foes]) => { window.__r = null; BTS.Brawl.start({ title: 'T', foes: JSON.parse(JSON.stringify(foes)) }, w => { window.__r = { win: w, hp: BTS.Brawl.p.hp, t: BTS.Brawl.t }; }); BTS.Brawl.phase = 'fight'; }, [DEFS[name]]);
  const held = new Set(); const hold = async (k, on) => { if (on && !held.has(k)) { held.add(k); await page.keyboard.down(k); } if (!on && held.has(k)) { held.delete(k); await page.keyboard.up(k); } };
  for (let i = 0; i < 1500; i++) {
    const s = await ev(() => BTS.Brawl.active ? { p: { x: BTS.Brawl.p.x, y: BTS.Brawl.p.y, st: BTS.Brawl.p.st }, f: BTS.Brawl.foes.filter(f => f.st !== 'down').map(f => ({ x: f.x, y: f.y, st: f.st, t: f.t, w: f.K.wind, mode: f.mode, reach: f.K.reach })) } : null);
    if (!s) break; if (!s.f.length) { await wait(60); continue; }
    const f = s.f.reduce((a, b) => Math.hypot(a.x - s.p.x, a.y - s.p.y) < Math.hypot(b.x - s.p.x, b.y - s.p.y) ? a : b), dx = f.x - s.p.x, dy = f.y - s.p.y, d = Math.hypot(dx, dy);
    const threat = s.f.find(o => (o.st === 'wind' && o.t > o.w - 0.16 && Math.hypot(o.x - s.p.x, o.y - s.p.y) < (o.mode === 'charge' ? 130 : o.reach + 22)) || (o.st === 'charge' && Math.hypot(o.x - s.p.x, o.y - s.p.y) < 50));
    if (bot === 'dodge' && threat) { await hold('ArrowLeft', false); await hold('ArrowRight', false); await hold('ArrowUp', dy > 0); await hold('ArrowDown', dy <= 0); await page.keyboard.press('KeyX'); await wait(120); await hold('ArrowUp', false); await hold('ArrowDown', false); continue; }
    await hold('ArrowRight', dx > 14); await hold('ArrowLeft', dx < -14); await hold('ArrowDown', dy > 8); await hold('ArrowUp', dy < -8);
    if (d < 26) await page.keyboard.press('KeyE');
    await wait(45);
  }
  for (const k of [...held]) await page.keyboard.up(k);
  for (let i = 0; i < 40 && await ev(() => BTS.Brawl.active); i++) await wait(100);
  return await ev(() => window.__r);
}
for (const n of (process.env.F || 'ivo,garran,sull,mara').split(',')) for (const b of ['mash', 'dodge']) { const r = []; for (let k = 0; k < 2; k++) r.push(await run(n, b)); console.log(n, b, JSON.stringify(r)); }
console.log('errors', errors); await browser.close();
