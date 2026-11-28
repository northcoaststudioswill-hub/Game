// Lucky 7, win by 2, and the review fixes that go with it: grade reasons, first-time tips, rank label, starting HC,
// HOW IT WORKS per device, the finishing ring in Layup Lines.   node tests/lucky7.mjs
import { createRequire } from 'module'; const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT || 'playwright');
import path from 'path'; import { fileURLToPath } from 'url';
const dir = path.dirname(fileURLToPath(import.meta.url));
const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader'] }); const ctx = await b.newContext({ viewport: { width: 1280, height: 720 } });
await ctx.addInitScript(() => { window.requestAnimationFrame = cb => { window.__raf = cb; return 1; }; window.__now = 0; window.__tick = n => { for (let i = 0; i < n; i++) { window.__now += 16.67; const f = window.__raf; window.__raf = null; if (f) f(window.__now); } }; });
const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message)); let fails = 0; const ok = (c, m, d) => { console.log((c ? 'PASS ' : 'FAIL ') + m + (d !== undefined ? '  ' + d : '')); if (!c) fails++; };
await p.goto('file://' + path.resolve(dir, '..', 'index.html')); await p.evaluate(() => window.__tick(60));
await p.click('#titleBtns .btn'); await p.evaluate(() => window.__tick(5));
const startHc = await p.evaluate(() => { const e = [...document.querySelectorAll('#panel .pf span')].find(x => /START WITH/.test(x.textContent)); return e && e.textContent; });
ok(/START WITH/.test(startHc || ''), 'builder shows the starting HC', startHc);
await p.click('#panel .pf .btn'); await p.evaluate(() => window.__tick(30));
ok(await p.evaluate(() => /^RANK · /.test(document.getElementById('wrank').textContent)), 'HUD says RANK', await p.evaluate(() => document.getElementById('wrank').textContent));
const how = await p.evaluate(() => { const kb = __pit.ev("howKeys(HOWTO[1].b)"); __pit.IN[0].hasPad = true; __pit.IN[0].padAt = 1e12; const pad = __pit.ev("howKeys(HOWTO[1].b)"); __pit.IN[0].hasPad = false; return [kb.slice(0, 40), pad.slice(0, 40)]; });
ok(/Space/.test(how[0]) && !/\bX\b/.test(how[0]) && /\bX\b/.test(how[1]) && !/Space/.test(how[1]), 'HOW IT WORKS names one device', JSON.stringify(how));
// win by 2
const g = await p.evaluate(() => { const P = __pit; P.uiClose(); P.launchGame(P.MODES[0], P.TIERS_COURT[0], { mates: [-1], rival: -1, p2: 'off' }); window.__tick(200); const M = P.MT; const lbl = document.getElementById('modeTag').textContent;
  M.score = [6, 6]; M.phase = 'live'; P.scorePts(M.me, 1, 'jumper'); window.__tick(5); const at76 = M.phase; M.phase = 'live'; P.scorePts(M.me, 1, 'jumper'); window.__tick(5); return { lbl, at76, at86: M.phase, sc: M.score.slice() }; });
ok(/LUCKY 7 · WIN BY 2/.test(g.lbl), 'HUD says lucky 7, win by 2', g.lbl);
ok(g.at76 !== 'over' && g.at86 === 'over', '7-6 plays on, 8-6 wins', JSON.stringify(g));
const res = await p.evaluate(() => { const P = __pit; let n = 0; while (P.MT && n++ < 600) window.__tick(1); window.__tick(60); return document.getElementById('panel').innerText; });
ok(/TEAMMATE GRADE [A-F] · ?[^\n]*\(/.test(res) || /TEAMMATE GRADE [A-F][^\n]*\(/.test(res), 'grade gives its reasons', (res.match(/TEAMMATE GRADE[^\n]*/) || [''])[0]);
// tips once
const tip = await p.evaluate(() => { const P = __pit; P.uiClose(); P.ev("firstTip('back', 'TAKE IT BACK', 'x')"); const n1 = document.querySelectorAll('#toasts .toast').length; P.ev("firstTip('back', 'TAKE IT BACK', 'x')"); const n2 = document.querySelectorAll('#toasts .toast').length; return [n1, n2, !!P.S.tips.back]; });
ok(tip[0] >= 1 && tip[1] === tip[0] && tip[2], 'a tip shows once', JSON.stringify(tip));
// book sims end two clear
const bk = await p.evaluate(() => { const out = []; for (let k = 0; k < 40; k++) out.push(__pit.ev(`bkSim({ to: 7, n: 'T', t: [bkTeam('A', ${72 + (k % 9)}, 2, ${100 + k}), bkTeam('B', 76, 2, ${900 + k})] }).sc`)); return out.filter(s => Math.max(...s) < 7 || Math.abs(s[0] - s[1]) < 2).length; });
ok(bk === 0, 'book games end lucky 7, two clear', bk + ' bad');
// finishing ring
const ring = await p.evaluate(() => { const P = __pit; P.uiClose(); P.enterWorld('hub', -3.4, 4, 0); window.__tick(5); P.startDrill('layups', 'hub'); window.__tick(220); const D = P.MT.drill; const r = !!(D.data.ring && D.data.ringR > 2.5); P.MT.cfg.onEnd({ quit: true, practice: 'drill' }); return [r, D.data.ringR]; });
ok(ring[0], 'Layup Lines draws the finishing ring', ring[1]);
ok(!errs.length, 'no page errors', errs.join(' | ')); console.log(fails ? fails + ' FAILED' : 'ALL PASS'); await b.close();
