import { chromium } from 'playwright';
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome' });
const page = await (await browser.newContext({ viewport: { width: 844, height: 390 } })).newPage();
const errors = []; page.on('pageerror', e => errors.push(e.message));
const wait = ms => page.waitForTimeout(ms), ev = (f, a) => page.evaluate(f, a);
await page.goto('file:///home/claude/below-the-sun/dist/index.html#noff'); await wait(600); await page.keyboard.press('Enter'); await wait(6500);
const setup = kind => ev(kind => { const B = BTS.Brawl; BTS.UI.clear(); const d = BTS.FF.valley(); delete d.intro; delete d.outro; delete d.arts; delete d.voice; d.allies = []; d.waves = [[{ id: 'cadt1', name: 'T', kind, hp: 999 }]]; B.start(d, () => {}); B.phase = 'fight'; B.tipT = 0; const f = B.foes[0]; B.p.x = -14; B.p.y = 0; f.x = 22; f.y = 0; f.cd = 99; f.max = f.hp = 999; B.p.fury = 0;
  window.__slow = 1; B.camFollow = () => {}; B.cam.y = 150; B.cam.h = 64; B.cam.x = 4; B.cam.hor = 50; if (!B.__u) { B.__u = B.update; B.update = dt => B.__u.call(B, dt * window.__slow); } }, kind);
const S = .07, clip = { x: 262, y: 40, width: 320, height: 270 };
const seq = async (name, kind, acts, n = 8, step = 120) => { await setup(kind); await wait(900); await ev(s => { window.__slow = s; }, S);
  for (let i = 0; i < n; i++) { if (acts[i]) await ev(acts[i]); await wait(step); await page.screenshot({ path: `/home/claude/shots/ff/mv-${name}-${i}.png`, clip }); }
  console.log(name, JSON.stringify(await ev(() => { const B = BTS.Brawl, f = B.foes[0]; return { p: B.p.st, z: Math.round(B.p.z), hp: B.p.hp, gd: B.p.gd, fhp: f.hp, fst: f.st, fz: Math.round(f.z || 0), msg: B.msg, d: Math.round(Math.hypot(f.x - B.p.x, f.y - B.p.y)) }; }))); };
const B = 'BTS.Brawl';
await seq('chain', 'cadet', { 0: () => BTS.Brawl.kick(), 3: () => BTS.Brawl.kick(), 6: () => BTS.Brawl.kick() }, 11);
await seq('boot', 'cadet', { 0: () => BTS.Brawl.skick() }, 7);
await seq('ram', 'cadet', { 0: () => BTS.Brawl.ram() }, 8);
await seq('ramboss', 'captain', { 0: () => BTS.Brawl.ram() }, 5);
await seq('fly', 'captain', { 0: () => { BTS.Brawl.p.boots = 1; BTS.Brawl.p.x = -50; BTS.Brawl.jump(); BTS.Input.held.Y = true; }, 6: () => { BTS.Brawl.airB(1, 0); }, 9: () => { BTS.Input.held.Y = false; BTS.Brawl.p.airN++; BTS.Brawl.strike(); }, 12: () => BTS.Brawl.slam() }, 18);
// real keys: kick chain, hold kick, ram, boots hover
await setup('cadet'); await wait(800);
for (const k of ['KeyC', 'KeyC', 'KeyC']) { await page.keyboard.press(k); await wait(170); } await wait(600); console.log('chain', JSON.stringify(await ev(() => [BTS.Brawl.p.kn, BTS.Brawl.msg, BTS.Brawl.foes[0].hp])));
await setup('cadet'); await wait(800); await page.keyboard.down('KeyC'); await wait(700); await page.keyboard.up('KeyC'); await wait(300); console.log('hold kick', JSON.stringify(await ev(() => [BTS.Brawl.msg, BTS.Brawl.foes[0].hp])));
await setup('cadet'); await wait(800); await page.keyboard.press('KeyQ'); await wait(700); console.log('ram', JSON.stringify(await ev(() => [BTS.Brawl.msg, BTS.Brawl.foes[0].hp])));
await setup('cadet'); await wait(800); await ev(() => { BTS.Brawl.p.boots = 1; }); await page.keyboard.down('KeyF'); await wait(900); const zz = await ev(() => [Math.round(BTS.Brawl.p.z), +BTS.Brawl.p.fu.toFixed(2)]); await page.keyboard.up('KeyF'); await page.keyboard.press('KeyX'); await wait(150); await page.keyboard.press('KeyV'); await wait(900); console.log('boots', JSON.stringify(zz), JSON.stringify(await ev(() => [BTS.Brawl.msg, Math.round(BTS.Brawl.p.z), BTS.Brawl.p.st])));
// real keys at full speed
await setup('cadet'); await wait(800);
for (const k of ['KeyF', 'KeyE', 'KeyE', 'KeyX']) { await page.keyboard.press(k); await wait(130); } await wait(700);
for (const k of ['KeyC', 'KeyE', 'KeyE', 'KeyC', 'KeyF', 'KeyE', 'KeyC']) { await page.keyboard.press(k); await wait(190); } await wait(900);
await page.keyboard.down('KeyV'); await wait(200); await page.keyboard.press('KeyE'); await wait(600); await page.keyboard.press('KeyC'); await wait(600); await page.keyboard.press('KeyQ'); await wait(700); await page.keyboard.up('KeyV'); await page.keyboard.down('KeyC'); await wait(500); await page.keyboard.up('KeyC'); await wait(600); await page.keyboard.press('KeyF'); await wait(150); await page.keyboard.press('KeyF'); await wait(1400); await page.keyboard.press('KeyQ'); await wait(600);
console.log('keys', JSON.stringify(await ev(() => ({ p: BTS.Brawl.p.st, fhp: BTS.Brawl.foes[0].hp, fight: document.body.classList.contains('fight') }))));
console.log('errors', errors); await browser.close();
