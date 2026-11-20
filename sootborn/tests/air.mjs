import { chromium } from 'playwright';
// how long can a man be kept in the air? Launch him with a heavy blow, then land a light blow every tenth of a second for three seconds, as a masher would.
// BOOTS=1: the player is in the boots and in the air himself (an air combo is allowed there). Stepped by hand, so it is the same on any machine.
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const page = await (await browser.newContext({ viewport: { width: 844, height: 390 } })).newPage();
const errors = []; page.on('pageerror', e => errors.push(e.message)); const wait = ms => page.waitForTimeout(ms), ev = (f, a) => page.evaluate(f, a);
await page.goto((process.env.URL || 'file:///home/claude/below-the-sun/dist/index.html') + '#noff'); await wait(600); await page.keyboard.press('Enter'); await wait(4500);
for (const m of (process.env.M || 'drill,ford,keep').split(',')) {
  await ev(m => { BTS.UI.clear(); DEV.quick = 1; const d = BTS.FF[m](); delete d.arts; delete d.voice; delete d.endAt; delete d.intro; d.foes = [{ id: 'cadt1', name: 'x', kind: 'cadet', hp: 99999 }]; delete d.waves; BTS.Brawl.start(d, () => {}); }, m); await wait(2400);
  const r = await ev(boots => { const B = BTS.Brawl, f = B.foes[0], p = B.p, u = B.update.bind(B); BTS.UI.clear(); B.update = () => {}; B.phase = 'fight'; p.fury = 0; f.cd = 1e9; f.x = 20; f.y = 0; p.x = 0; p.y = 0;
    const out = { first: null, air: 0, max: 0, lands: 0 }; let was = false;
    if (boots) { p.boots = 1; p.z = 40; p.vz = 0; }
    p.heavy = 1; B.hitFoe(f, 1, 1, 0, true); p.heavy = 0;
    for (let i = 0; i < 180; i++) { B.freeze = 0; B.slow = 0; f.cd = 1e9; f.guardT = 0; f.hits = 0; if (boots) { p.z = 40; p.vz = 0; } u(1 / 60); const up = (f.z || 0) > 2; if (up) { out.air++; out.max = Math.max(out.max, f.z); } if (was && !up) { out.lands++; if (out.first === null) out.first = i / 60; } was = up;
      if (i % 6 === 5 && f.st !== 'floor') B.hitFoe(f, .01, 1, 0, false); }
    B.update = u; return { firstLanding: out.first === null ? 'never (3s+)' : +out.first.toFixed(2), secondsInAir: +(out.air / 60).toFixed(2), maxHeight: Math.round(out.max), landings: out.lands }; }, !!process.env.BOOTS);
  console.log(m, process.env.BOOTS ? 'boots' : 'no boots', JSON.stringify(r));
}
console.log('errors', errors); await browser.close();
