import { chromium } from 'playwright';
// the hook shot in the arena fights, used on purpose: from 100 away, on the fight's own first man. Stepped by hand; stills at line out, bite, arrival
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const page = await (await browser.newContext({ viewport: { width: 844, height: 390 } })).newPage();
const errors = []; page.on('pageerror', e => errors.push(e.message)); const wait = ms => page.waitForTimeout(ms), ev = (f, a) => page.evaluate(f, a);
await page.goto('file:///home/claude/below-the-sun/dist/index.html#noff'); await wait(600); await page.keyboard.press('Enter'); await wait(4500);
for (const m of (process.env.M || 'ford,proctor,valley,keep').split(',')) {
  await ev(m => { BTS.UI.clear(); DEV.quick = 1; const d = BTS.FF[m](); delete d.arts; delete d.voice; delete d.intro; BTS.Brawl.start(d, () => {}); }, m); await wait(2600);
  const r0 = await ev(() => { const B = BTS.Brawl, p = B.p, f = B.foes[0], u = B.update.bind(B); BTS.UI.clear(); window.__u = u; B.update = () => {}; B.phase = 'fight'; B.foes.forEach((q, i) => { q.cd = 1e9; if (i) { q.x = 60 + i * 12; q.y = 50; } }); f.x = 50; f.y = 0; p.x = -50; p.y = 0; p.fx = 1; p.fy = 0; p.hcd = 0; p.fury = 0; const c = B.cam; c.x = 0;
    window.__to = t => { for (let i = 0; i < 200 && B.t < t; i++) { B.freeze = 0; B.slow = 0; B.foes.forEach(q => { q.cd = 1e9; }); u(1 / 60); } }; window.__t0 = B.t; window.__d0 = Math.hypot(f.x - p.x, f.y - p.y);
    B.hook(); return { g3: !!B.g3, era: B.era, hookedBlade: B.hooked(), st: p.st, foe: f.name, poise: !!f.K.poise, d0: Math.round(window.__d0) }; });
  for (const [i, t] of [[0, .09], [1, .17], [2, .42]]) { await ev(t => window.__to(window.__t0 + t), t); await wait(1500); await page.screenshot({ path: '/home/claude/shots/v66/hook-' + m + '-' + i + '.png' }); }
  const r1 = await ev(() => { const B = BTS.Brawl, p = B.p, f = B.foes[0]; const r = { d1: Math.round(Math.hypot(f.x - p.x, f.y - p.y)), kaelMoved: Math.round(p.x + 50), manMoved: Math.round(50 - f.x), said: B.msg, open: +(p.open || 0).toFixed(2), foeSt: f.st }; B.update = window.__u; return r; });
  console.log(m, JSON.stringify(r0), JSON.stringify(r1));
}
console.log('errors', errors); await browser.close();
