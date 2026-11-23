// Smoke run: title → builder → hub → pit → a game played by a simple bot → results. Screenshots to tests/shots/.
import { createRequire } from 'module'; const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT || 'playwright');
import path from 'path'; import fs from 'fs'; import { fileURLToPath } from 'url';
const dir = path.dirname(fileURLToPath(import.meta.url)); const shots = path.join(dir, 'shots'); fs.mkdirSync(shots, { recursive: true });
const PORTRAIT = !!process.env.PORTRAIT, MODE = process.env.MODE || 's2';
const browser = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const ctx = await browser.newContext(PORTRAIT ? { viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true } : { viewport: { width: 1280, height: 720 } });
const page = await ctx.newPage(); const errs = [];
page.on('pageerror', e => { errs.push(e.message); console.log('PAGEERROR', e.message, (e.stack || '').split('\n').slice(0, 4).join(' | ')); });
page.on('console', m => { if (m.type() === 'error') { errs.push(m.text()); console.log('CONSOLE', m.text()); } });
const tag = PORTRAIT ? 'p-' : 'l-'; const shot = n => page.screenshot({ path: path.join(shots, tag + n + '.png') });
await page.goto('file://' + path.join(dir, '..', 'index.html')); await page.waitForTimeout(1500); await shot('01-title');
await page.click('#titleBtns .btn'); await page.waitForTimeout(800); await page.fill('#bname', 'WILL'); await shot('02-builder');
await page.evaluate(() => { const b = document.querySelector('#panel .pb'); b.scrollTop = b.scrollHeight; }); await page.waitForTimeout(200); await shot('03-builder-caps');
await page.click('#panel .pf .btn'); await page.waitForTimeout(1500); await shot('04-hub');
await page.evaluate(() => __pit.enterWorld('hub', 0, -24, 0)); await page.waitForTimeout(600); await shot('05-hub-statue');
await page.evaluate(() => __pit.enterWorld('hub', 26, -2, Math.PI / 2)); await page.waitForTimeout(500);
await page.evaluate(() => __pit.W.near && __pit.W.near.fn()); await page.waitForTimeout(900); await shot('06-shop');
await page.evaluate(() => { __pit.uiClose(); __pit.enterWorld('crib', 0, 13, Math.PI); }); await page.waitForTimeout(700); await shot('07-crib');
await page.evaluate(() => __pit.enterWorld('pit', 0, 6, Math.PI)); await page.waitForTimeout(700); await shot('08-pit');
await page.evaluate(m => { const P = __pit; P.launchGame(P.MODES.find(x => x.id === m), P.TIERS_COURT[0], { mates: [], rival: -1, p2: 'off' }); }, MODE);
await page.waitForTimeout(3200); await shot('09-check');
// bot: drive at the rim / shoot when open; on defence stay near the man
let n = 0;
for (let i = 0; i < 900; i++) {
  const st = await page.evaluate(() => {
    const P = __pit, M = P.MT; if (!M) return { over: true };
    const me = M.me, K = P.keys; for (const k of ['KeyW', 'KeyA', 'KeyS', 'KeyD', 'ShiftLeft', 'Space', 'KeyE', 'KeyK', 'KeyI', 'KeyJ', 'KeyL']) K[k] = false;
    const go = (x, z) => { const dx = x - me.x, dz = z - me.z; if (dx > 0.4) K.KeyD = true; if (dx < -0.4) K.KeyA = true; if (dz > 0.4) K.KeyS = true; if (dz < -0.4) K.KeyW = true; };
    if (M.phase === 'live') {
      if (M.B.holder === me) {
        if (me.st === 'shoot') { K.Space = me.t < me.shot.rel; }
        else if (M.needClear) go(0, 9);
        else { const d = Math.hypot(me.x, me.z); if (d < 2.6 || (d > 6.9 && d < 7.6 && Math.random() < 0.05)) K.Space = true; else if (Math.random() < 0.03) K.KeyJ = true; else { go(0, 0.5); K.ShiftLeft = true; } }
      } else if (M.off === me.team) go(5, 5);
      else if (me.man) { go(me.man.x * 0.85, me.man.z * 0.85); if (M.B.holder === me.man && Math.random() < 0.03) K.KeyK = true; if (me.man.st === 'shoot') K.Space = true; }
      if (M.B.state === 'loose') go(M.B.pos.x, M.B.pos.z);
    }
    return { score: M.score.slice(), phase: M.phase, t: M.time };
  });
  if (st.over) break; await page.waitForTimeout(100);
  if (i === 25) await shot('10-live'); if (i === 60) await shot('11-live'); if (i === 120) await shot('12-live'); if (i === 250) await shot('13-live');
  if (i % 100 === 0) console.log(i, JSON.stringify(st)); n = i;
}
await page.evaluate(() => { for (const k in __pit.keys) __pit.keys[k] = false; for (let i = 0; i < 60 * 60 * 8 && __pit.MT; i++) __step(1 / 60); });
await page.waitForTimeout(2500); await shot('14-results');
await page.evaluate(() => { const b = [...document.querySelectorAll('#panel .btn')].find(x => /PIT/.test(x.textContent)); if (b) b.click(); __pit.S.vc += 5000; __pit.gainRep(1200); __pit.W.spots.find(s => /LAST CALL/.test(s.label)).fn(); });
await page.waitForTimeout(500); await shot('15-kiosk');
await page.evaluate(() => { __pit.uiClose(); __pit.W.spots.find(s => /LINK/.test(s.label)).fn(); }); await page.waitForTimeout(300);
await page.evaluate(() => { document.querySelector('#impc').value = document.querySelector('#expc').value; [...document.querySelectorAll('#panel .btn')].find(x => /ADD HOMIE/.test(x.textContent)).click(); }); await page.waitForTimeout(300); await shot('16-homie');
await page.evaluate(() => { __pit.uiClose(); __pit.enterWorld('crib', 6, 10, 1); __pit.W.spots.find(s => /UPGRADES/.test(s.label)).fn(); }); await page.waitForTimeout(300);
for (let i = 0; i < 6; i++) { await page.evaluate(() => { const b = [...document.querySelectorAll('#panel .card .btn:not([disabled])')][0]; if (b) b.click(); }); await page.waitForTimeout(250); }
await shot('17-crib-upgrades'); await page.evaluate(() => { __pit.uiClose(); __pit.enterWorld('crib', 0, 14, Math.PI); }); await page.waitForTimeout(600); await shot('18-crib');
await page.evaluate(() => __pit.W.spots.find(s => /SHOOT/.test(s.label)).fn()); await page.waitForTimeout(2500);
await page.evaluate(() => { __pit.keys.Space = true; }); await page.waitForTimeout(700); await shot('19-practice-meter'); await page.evaluate(() => { __pit.keys.Space = false; }); await page.waitForTimeout(900); await shot('20-practice-shot');
await page.evaluate(() => { __pit.keys.KeyP = true; }); await page.waitForTimeout(300); await page.evaluate(() => { __pit.keys.KeyP = false; }); await shot('21-pause');
await page.evaluate(() => { [...document.querySelectorAll('#panel .btn')].find(x => /LEAVE/.test(x.textContent)).click(); }); await page.waitForTimeout(500);
await page.evaluate(() => { const P = __pit; P.W.spots.find(s => /BACK/.test(s.label)).fn(); }); await page.waitForTimeout(300);
await page.evaluate(() => { __pit.keys.KeyP = true; }); await page.waitForTimeout(300); await page.evaluate(() => { __pit.keys.KeyP = false; }); await page.waitForTimeout(200); await shot('22-attrs');
for (const [t, n] of [['BADGES', '23-badges'], ['MOVES', '24-moves'], ['TROPHIES', '25-trophies'], ['RANK ROAD', '26-road']]) { await page.evaluate(t => [...document.querySelectorAll('#panel .tabs .btn')].find(x => x.textContent === t).click(), t); await page.waitForTimeout(200); await shot(n); }
const sum = await page.evaluate(() => ({ vc: __pit.S.vc, rep: __pit.S.rep, life: __pit.S.life, bxp: __pit.S.bxp, ach: Object.keys(__pit.S.ach) }));
console.log('ticks', n, JSON.stringify(sum)); console.log(errs.length ? 'ERRORS ' + errs.length : 'NO ERRORS');
await browser.close(); process.exit(errs.length ? 1 : 0);
