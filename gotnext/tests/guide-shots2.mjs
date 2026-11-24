// Screenshots for the game guide: node tests/guide-shots.mjs → tests/shots/guide/*.jpg
import { createRequire } from 'module'; const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT || '/opt/node-tools/node_modules/playwright/index.js');
import path from 'path'; import fs from 'fs'; import { fileURLToPath } from 'url';
const dir = path.dirname(fileURLToPath(import.meta.url)), out = path.join(dir, 'shots', 'guide'); fs.mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader'] }); const ctx = await browser.newContext({ viewport: { width: 1100, height: 640 } });
await ctx.addInitScript(() => { window.requestAnimationFrame = cb => { window.__raf = cb; return 1; }; window.__now = 0;
  window.__tick = n => { if (!window.__patched && window.THREE && THREE.Object3D) { window.__patched = 1; const orig = THREE.Object3D.prototype.lookAt; THREE.Object3D.prototype.lookAt = function (x, y, z) { if (this.isPerspectiveCamera && window.__camFn) { const t = window.__camFn(this); return orig.call(this, t[0], t[1], t[2]); } return orig.call(this, x, y, z); }; }
    for (let i = 0; i < n; i++) { window.__now += 16.67; const f = window.__raf; window.__raf = null; if (f) f(window.__now); } }; });
const page = await ctx.newPage(); const errs = []; page.on('pageerror', e => errs.push(e.message));
const T = n => page.evaluate(n => window.__tick(n), n), shot = async n => { await page.screenshot({ path: path.join(out, n + '.jpg'), type: 'jpeg', quality: 82, timeout: 180000 }); };
await page.goto('file://' + path.resolve(dir, '..', 'index.html')); await T(60);
await page.click('#titleBtns .btn'); await T(30); await page.fill('#bname', 'JAYLO'); await page.click('#panel .pf .btn'); await T(60);
await page.evaluate(() => { const st = document.createElement('style'); st.textContent = '#toasts{display:none!important}'; document.head.appendChild(st); const S = __pit.S; S.vc = 4200; S.rep = 2300; __pit.uiClose(); __pit.enterWorld('crib', 0, 19, Math.PI); });
const step = async (n, fn, ticks) => { if (process.env.ONLY && !process.env.ONLY.split(',').includes(n.slice(0, 2))) return; try { await page.evaluate(fn); await T(ticks || 30); await shot(n); console.log('ok', n); } catch (e) { console.log('FAIL', n, e.message.split('\n')[0]); } };
await step('11-attributes', () => { __pit.uiClose(); __pit.keys.KeyP = true; window.__tick(2); __pit.keys.KeyP = false; }, 10);
await step('12-badges', () => { [...document.querySelectorAll('#panel .tabs .btn')].find(b => b.textContent === 'BADGES').click(); }, 10);
await step('13-moves', () => { [...document.querySelectorAll('#panel .tabs .btn')].find(b => b.textContent === 'MOVES').click(); }, 10);
await step('14-shop', () => { __pit.uiClose(); __pit.enterWorld('hub', 13.6, -5.6, -Math.PI / 2); window.__tick(10); __pit.W.spots.find(s => /PLUG/.test(s.label)).fn(); }, 40);
await step('15-crib', () => { __pit.uiClose(); __pit.devSampleCrib(); __pit.S.homies = [__pit.maxBuild('showman', 'Lil Kickstand'), __pit.maxBuild('glass', 'Two-Ply')]; __pit.enterWorld('crib', -17, 14, Math.PI); __pit.W.yaw = Math.PI; }, 120);
await step('16-crib-wide', () => { window.__camFn = cam => { cam.position.set(0, 26, 40); return [0, 0, 8]; }; }, 30);
await step('17-buildmode', () => { window.__camFn = null; __pit.buildEnter(); __pit.BLD.act.cat('rare'); __pit.BLD.act.pick(__pit.rareToday().id); __pit.W.build.fx = -21; __pit.W.build.fz = 9; }, 60);
await step('18-chat', () => { __pit.buildExit(); __pit.enterWorld('crib', -16, 13, Math.PI); __pit.W.yaw = Math.PI; window.__tick(30); __pit.emote('dance'); __pit.chatSend('my crib go crazy'); }, 40);
await step('19-ladder', () => { __pit.enterWorld('pit', 0, 3.4, Math.PI); __pit.W.yaw = 0.2; }, 60);
await step('20-devroom', () => { __pit.uiClose(); __pit.uiDev('title'); }, 30);
console.log(errs.length ? errs.length + ' ERRORS ' + errs[0] : 'NO ERRORS'); await browser.close();
