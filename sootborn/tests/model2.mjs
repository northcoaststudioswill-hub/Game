// close-up pose sheet of the two fighters in a duel (F=fight, HASH=extra url flags)
import { chromium } from 'playwright'; import { execSync } from 'child_process';
const F = process.env.F || 'ford', HASH = process.env.HASH || '', OUT = process.env.OUT || 'model2';
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome' });
const page = await (await browser.newContext({ viewport: { width: 1280, height: 720 } })).newPage();
const errors = []; page.on('pageerror', e => errors.push(e.message));
const wait = ms => page.waitForTimeout(ms), ev = (f, a) => page.evaluate(f, a);
await page.goto('file:///home/claude/below-the-sun/dist/index.html#noff' + HASH); await wait(600); await page.keyboard.press('Enter'); await wait(6500);
await ev(f => { const B = BTS.Brawl; BTS.UI.clear(); DEV.quick = 1; B.start(BTS.FF[f](), () => {}); B.cine = null; B.phase = 'fight'; B.tipT = 0; B.def.arts = null; B.vq = []; B.voice = () => {}; B.quip = () => {}; B.camFollow = () => {}; B.separate = () => {};
  const p = B.p, f0 = B.foes[0]; window.__pose = (px, fxp, cam) => { p.x = -14; p.y = 0; f0.x = 16; f0.y = 0; f0.cd = 99; f0.st = 'approach'; f0.t = 0; f0.kx = f0.ky = 0; p.kx = p.ky = 0; p.fx = px[0]; p.fy = px[1]; f0.fx = fxp[0]; f0.fy = fxp[1]; p.hp = p.max; Object.assign(B.cam, cam); }; }, F);
execSync('mkdir -p /tmp/m2 && rm -f /tmp/m2/*.png'); let n = 0;
const R = await ev(() => { const r = document.querySelector('#game').getBoundingClientRect(); return { x: r.x, y: r.y, width: r.width, height: r.height }; });
const shot = async () => { await page.screenshot({ clip: R, path: `/tmp/m2/${String(n++).padStart(2, '0')}.png` }); };
const CAM = { x: 1, y: 190, h: 44, f: 300, hor: 96, roll: 0 }, hold = async (ms, fn) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { await ev(fn || (() => window.__pose([.5, .86], [-.5, .86], window.__cam))); await wait(30); } };
await ev(c => { window.__cam = c; }, CAM);
await hold(900); await shot();                                                                   // front three-quarter, idle
await hold(500, () => window.__pose([1, 0], [-1, 0], window.__cam)); await shot();              // profile, facing each other
await ev(() => { const B = BTS.Brawl; window.__pose([1, 0], [-1, 0], window.__cam); B.strike(); }); await wait(140); await shot();   // strike
await wait(500); await ev(() => { const B = BTS.Brawl; window.__pose([1, 0], [-1, 0], window.__cam); B.kick(); }); await wait(160); await shot(); // kick
await wait(600); await ev(() => { const B = BTS.Brawl, p = B.p; window.__pose([1, 0], [-1, 0], window.__cam); p.st = 'guard'; p.gt = 1; B.foes[0].st = 'wind'; B.foes[0].t = .2; B.foes[0].mode = 'sweep'; }); await wait(260); await shot(); // guard vs wind-up
await ev(() => { const B = BTS.Brawl, p = B.p; window.__pose([1, 0], [-1, 0], window.__cam); p.st = 'hurt'; p.t = 0; B.foes[0].st = 'hurt'; B.foes[0].t = 0; }); await wait(200); await shot(); // both hurt
await ev(() => { window.__cam = { x: -14, y: 110, h: 38, f: 520, hor: 96, roll: 0 }; }); await hold(700, () => window.__pose([0, 1], [0, 1], window.__cam)); await shot();   // Kael's face
await ev(() => { window.__cam = { x: 16, y: 110, h: 38, f: 520, hor: 96, roll: 0 }; }); await hold(700, () => window.__pose([0, 1], [0, 1], window.__cam)); await shot();   // the other face
await ev(() => { window.__cam = { x: 1, y: 190, h: 44, f: 300, hor: 96, roll: 0 }; }); await hold(700, () => window.__pose([0, -1], [.3, -.95], window.__cam)); await shot(); // backs
console.log(F, 'tris', await ev(() => [G3.tris, G3.dyn.n / 3 | 0, G3.ol.n / 3 | 0, +Perf.build.toFixed(2)]), 'errors', errors.slice(0, 3)); await browser.close();
execSync(`python3 - <<'PY'
from PIL import Image; import glob
fs=sorted(glob.glob('/tmp/m2/*.png')); cols=3; im0=Image.open(fs[0]); tw=562; th=int(tw*im0.height/im0.width)
rows=(len(fs)+cols-1)//cols; sh=Image.new('RGB',(cols*tw,rows*th))
for i,f in enumerate(fs): sh.paste(Image.open(f).convert('RGB').resize((tw,th)),((i%cols)*tw,(i//cols)*th))
sh.save('/home/claude/shots/ff/${OUT}.png')
PY`);
