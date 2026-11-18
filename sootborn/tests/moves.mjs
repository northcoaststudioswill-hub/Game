import { chromium } from 'playwright';
import { mkdirSync } from 'fs'; mkdirSync('shots', { recursive: true });
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || undefined });
const page = await (await browser.newContext({ viewport: { width: 844, height: 390 } })).newPage();
const errors = []; page.on('pageerror', e => errors.push(e.message));
const wait = ms => page.waitForTimeout(ms), ev = (f, a) => page.evaluate(f, a);
await page.goto(new URL('../index.html', import.meta.url).href + '#noff'); await wait(600); await page.keyboard.press('Enter'); await wait(6500);
const setup = kind => ev(kind => { const B = BTS.Brawl; BTS.UI.clear(); const d = BTS.FF.valley(); delete d.intro; delete d.outro; delete d.arts; delete d.voice; d.allies = []; d.waves = [[{ id: 'cadt1', name: 'T', kind, hp: 999 }]]; B.start(d, () => {}); B.phase = 'fight'; B.tipT = 0; const f = B.foes[0]; B.p.x = -14; B.p.y = 0; f.x = 22; f.y = 0; f.cd = 99; f.max = f.hp = 999; B.p.fury = 0;
  window.__slow = 1; B.camFollow = () => {}; B.cam.y = 150; B.cam.h = 64; B.cam.x = 4; B.cam.hor = 50; if (!B.__u) { B.__u = B.update; B.update = dt => B.__u.call(B, dt * window.__slow); } }, kind);
const S = .07, clip = { x: 262, y: 40, width: 320, height: 270 };
const seq = async (name, kind, acts, n = 8, step = 120) => { await setup(kind); await wait(900); await ev(s => { window.__slow = s; }, S);
  for (let i = 0; i < n; i++) { if (acts[i]) await ev(acts[i]); await wait(step); await page.screenshot({ path: `shots/mv-${name}-${i}.png`, clip }); }
  console.log(name, JSON.stringify(await ev(() => { const B = BTS.Brawl, f = B.foes[0]; return { p: B.p.st, z: Math.round(B.p.z), hp: B.p.hp, gd: B.p.gd, fhp: f.hp, fst: f.st, fz: Math.round(f.z || 0), msg: B.msg, d: Math.round(Math.hypot(f.x - B.p.x, f.y - B.p.y)) }; }))); };
const B = 'BTS.Brawl';
await seq('kick', 'cadet', { 0: () => BTS.Brawl.kick() });
await seq('guardbreak', 'cadet', { 0: () => { BTS.Brawl.foes[0].guardT = 2; BTS.Brawl.kick(); } }, 4);
await seq('launch', 'cadet', { 0: () => { BTS.Brawl.p.combo = 2; BTS.Brawl.kick(); }, 3: () => BTS.Brawl.jump(), 5: () => { BTS.Brawl.p.airN++; BTS.Brawl.strike(); }, 7: () => { BTS.Brawl.p.airN++; BTS.Brawl.strike(); }, 9: () => BTS.Brawl.plunge() }, 13);
await seq('dive', 'captain', { 0: () => { BTS.Brawl.p.x = -50; BTS.Brawl.jump(); }, 3: () => BTS.Brawl.dive() }, 9);
await seq('parry', 'cadet', { 0: () => { const B = BTS.Brawl; B.p.st = 'guard'; B.p.gt = 0; B.hurtPlayer(B.foes[0], 1, -1, 0); } }, 3);
await seq('block', 'cadet', { 0: () => { const B = BTS.Brawl; B.p.st = 'guard'; B.p.gt = .5; for (let i = 0; i < 3; i++) { B.p.inv = 0; B.hurtPlayer(B.foes[0], 1, -1, 0); } } }, 2);
await seq('hook', 'cadet', { 0: () => { BTS.Brawl.foes[0].x = 120; BTS.Brawl.hook(); } }, 7);
await seq('zip', 'captain', { 0: () => { BTS.Brawl.foes[0].x = 120; BTS.Brawl.hook(); } }, 7);
// real keys at full speed
await setup('cadet'); await wait(800);
for (const k of ['KeyF', 'KeyE', 'KeyE', 'KeyX']) { await page.keyboard.press(k); await wait(130); } await wait(700);
for (const k of ['KeyC', 'KeyE', 'KeyE', 'KeyC', 'KeyF', 'KeyE', 'KeyC']) { await page.keyboard.press(k); await wait(190); } await wait(900);
await page.keyboard.down('KeyV'); await wait(300); await page.keyboard.up('KeyV'); await page.keyboard.press('KeyQ'); await wait(600);
console.log('keys', JSON.stringify(await ev(() => ({ p: BTS.Brawl.p.st, fhp: BTS.Brawl.foes[0].hp, fight: document.body.classList.contains('fight') }))));
console.log('errors', errors); await browser.close();
