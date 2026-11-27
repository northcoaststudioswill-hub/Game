// The ANIM LAB edit tab: open it, bend a joint on an action, see the left player change and the right stay original,
// see the edit reach the game's own poses, copy and paste the code, clear it.   node tests/animedit.mjs
import { createRequire } from 'module'; const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT || 'playwright');
import path from 'path'; import fs from 'fs'; import { fileURLToPath } from 'url';
const dir = path.dirname(fileURLToPath(import.meta.url)); fs.mkdirSync(path.join(dir, 'shots'), { recursive: true });
const browser = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader'] });
const ctx = await browser.newContext({ viewport: { width: 1100, height: 620 } });
await ctx.addInitScript(() => { window.requestAnimationFrame = cb => { window.__raf = cb; return 1; }; window.__now = 0; window.__tick = (n, ms) => { for (let i = 0; i < n; i++) { window.__now += ms; const f = window.__raf; window.__raf = null; if (f) f(window.__now); } }; });
const page = await ctx.newPage(); let errs = 0; page.on('pageerror', e => { errs++; console.log('PAGEERROR', e.message, (e.stack || '').split('\n')[1]); });
await page.goto('file://' + (process.env.GN_HTML || path.join(dir, '..', 'index.html'))); await page.evaluate(() => window.__tick(60, 16.67));
await page.click('#titleBtns .btn'); await page.evaluate(() => window.__tick(5, 16.67)); await page.click('#panel .pf .btn'); await page.evaluate(() => window.__tick(30, 16.67));
const ok = (n, c, d) => console.log((c ? 'PASS  ' : 'FAIL  ') + n + '  ' + (d || ''));
const r = await page.evaluate(() => {
  const P = __pit, ev = P.ev; P.uiClose(); P.uiDev('title'); window.__tick(3, 16.67);
  ev("ALAB.tab = 'edit'; alabOpen()"); window.__tick(10, 16.67);
  const tabs = [...document.querySelectorAll('#panel .tabs .btn')].map(b => b.textContent);
  // pick the celebration flex, pause half way, bend the right shoulder 60 degrees
  ev("ALAB.act = 'celeb:salute'; ALAB.t = 0; rerender()"); window.__tick(40, 16.67);
  [...document.querySelectorAll('#panel .btn')].find(b => b.textContent.startsWith('R shoulder')).click(); window.__tick(2, 16.67);
  const before = ev("[ALAB.a.R.joints.shR.rotation.x, ALAB.b.R.joints.shR.rotation.x]");
  const key = ev("edCurKey()");
  const sl = document.getElementById('edA0'); sl.value = 60; sl.dispatchEvent(new Event('input', { bubbles: true })); window.__tick(40, 16.67);
  const after = ev("[ALAB.a.R.joints.shR.rotation.x, ALAB.b.R.joints.shR.rotation.x]");
  const stored = JSON.parse(JSON.stringify(P.S.animEd || {}));
  // the game's own pose function now has it
  const g0 = ev("ANIM_ED.skip = true; const a = poseOf('celeb', 1, { style: 'salute' }).shR[0]; ANIM_ED.skip = false; a"), g1 = ev("poseOf('celeb', 1, { style: 'salute' }).shR[0]");
  const code = ev("edCode()"), back = ev("JSON.stringify(edFromCode(edCode()))") === JSON.stringify(P.S.animEd);
  // a second key later on and the curve eases between them
  ev("edGoto(0.9)"); window.__tick(3, 16.67); const s2 = document.getElementById('edA0'); s2.value = -30; s2.dispatchEvent(new Event('input', { bubbles: true })); window.__tick(3, 16.67);
  const nk = P.S.animEd[key].keys.length, mid = ev(`edSample(S.animEd['${key}'], (S.animEd['${key}'].keys[0].u + S.animEd['${key}'].keys[1].u) / 2, false).j.shR[0] * 180 / Math.PI`);
  // a grab edit reaches a grab
  ev("ALAB.act = 'grab:scoop'; ALAB.t = 0; ALAB.edLock = null; ALAB.paused = false; rerender()"); window.__tick(12, 16.67); const gk = ev("edCurKey()");
  const tabTxt = document.getElementById('edNow') && document.getElementById('edNow').textContent;
  return { tabs, key, before, after, stored: Object.keys(stored), g0, g1, code: code.slice(0, 12), back, nk, mid, gk, tabTxt };
});
console.log(JSON.stringify(r));
ok('edit tab', r.tabs.includes('EDIT ANIMATIONS'));
ok('edit key is the action', r.key === 'celeb:salute', r.key);
ok('left bends, right stays', Math.abs((r.after[0] - r.before[0]) - 60 / 57.3) < 0.25 && Math.abs(r.after[1] - r.before[1]) < 0.05, JSON.stringify([r.before, r.after]));
ok('game pose has the edit', Math.abs((r.g1 - r.g0) - 60 / 57.3) < 0.01, r.g0 + ' -> ' + r.g1);
ok('code round trip', r.back && r.code.startsWith('GNANIM1:'));
ok('two keys ease', r.nk === 2 && r.mid < 55 && r.mid > -25, r.nk + ' keys, mid ' + r.mid);
ok('grab overlay key', r.gk === 'grab:scoop', r.gk);
await page.evaluate(() => { const ev = __pit.ev; ev("ALAB.act = 'celeb:salute'; ALAB.edLock = null; ALAB.paused = true; edGoto(0.3); rerender()"); window.__tick(6, 16.67); const c = [...document.querySelectorAll('#panel .cat')].find(e => e.textContent.startsWith('TIMELINE')); if (c) c.scrollIntoView(); window.__tick(2, 16.67); });
await page.screenshot({ path: path.join(dir, 'shots', 'animedit.png') });
// cleared edits leave the game exactly as shipped
const c = await page.evaluate(() => { const ev = __pit.ev; ev("S.animEd = {}"); return ev("JSON.stringify(poseOf('celeb', 1, { style: 'salute' }).shR)") === ev("JSON.stringify(poseOfRaw('celeb', 1, { style: 'salute' }).shR)"); });
ok('cleared = shipped', c);
// every lab action poses without an error
const bad = await page.evaluate(() => { const ev = __pit.ev, out = []; for (const [k] of ev('ALAB_ACTS')) { try { ev(`ALAB.act = '${k}'; ALAB.t = 0`); window.__tick(4, 16.67); const j = ev('ALAB.a.R.joints.shR.rotation.x'); if (!isFinite(j)) out.push(k + ':nan'); } catch (e) { out.push(k + ':' + e.message); } } return out; });
ok('every action runs', !bad.length && !errs, bad.join(', ') + ' errors ' + errs);
await browser.close();
