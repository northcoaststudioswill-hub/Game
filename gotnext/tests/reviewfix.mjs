// Fixes from the blind playtests: goal line on the Block, sliding round the statue to the Cages, the results screen
// surviving a press held from the game, team names on streak banners, the meter's real window, and the +5 price.
import { createRequire } from 'module'; const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT || '/opt/node-tools/node_modules/playwright/index.js');
import path from 'path'; import { fileURLToPath } from 'url';
const dir = path.dirname(fileURLToPath(import.meta.url)), shots = process.argv.includes('--shots');
const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader'] }); const ctx = await b.newContext({ viewport: { width: 1280, height: 720 } });
await ctx.addInitScript(() => { window.requestAnimationFrame = cb => { window.__raf = cb; return 1; }; window.__now = 0; window.__tick = n => { for (let i = 0; i < n; i++) { window.__now += 16.67; const f = window.__raf; window.__raf = null; if (f) f(window.__now); } }; });
const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.goto('file://' + (process.env.GN_HTML || path.resolve(dir, '..', 'index.html'))); await p.evaluate(() => window.__tick(60));
await p.click('#titleBtns .btn'); await p.evaluate(() => window.__tick(5)); await p.click('#panel .pf .btn'); await p.evaluate(() => { window.__tick(30); __pit.S.tut = 1; });
let ok = true; const check = (n, c, x) => { console.log((c ? 'PASS ' : 'FAIL ') + n + (x !== undefined ? ' · ' + x : '')); if (!c) ok = false; };
await p.evaluate(() => { __pit.uiClose(); window.__tick(10); });
// 1. goal line
const g1 = await p.evaluate(() => { const g = document.getElementById('goal'); return { on: getComputedStyle(g).display !== 'none', t: g.innerText }; });
check('goal line shows for a new player', g1.on && /coach/i.test(g1.t), g1.t.replace(/\n/g, ' / '));
if (shots) await p.screenshot({ path: path.join(dir, 'shots', 'rf-goal.png') });
// 2. from spawn, hold W (and a touch of D) to the Cages: does the statue stop us?
const walk = await p.evaluate(async () => { const P = __pit, K = P.keys, W = P.ev('W'); if (W.guide) W.guide.st = 'rest'; P.uiClose(); window.__tick(2); W.me.x = 0; W.me.z = 9; W.yaw = Math.PI; W.me.vx = W.me.vz = 0; K.KeyW = true; K.ShiftLeft = true; let minZ = 99; for (let i = 0; i < 60 * 5; i++) { window.__tick(1); minZ = Math.min(minZ, W.me.z); } K.KeyW = false; K.ShiftLeft = false; window.__tick(5); return { z: +W.me.z.toFixed(2), x: +W.me.x.toFixed(2), minZ: +minZ.toFixed(2) }; });
check('straight run from spawn slides past the statue', walk.minZ < -1, JSON.stringify(walk));
const gate = await p.evaluate(() => { let W = __pit.W; const en = W.spots.find(s => /ENTER THE CAGES/.test(s.label)); en.fn(); window.__tick(60); __pit.uiClose(); W = __pit.W; W.me.x = 0; W.me.z = -3.6; window.__tick(3); return document.getElementById('prompt').innerText; });
check('gate prompt reaches between gates', /2v2|3v3/i.test(gate), gate);
// 3. results screen survives an E press held from the game
const res = await p.evaluate(() => { const P = __pit; P.uiClose(); P.launchGame(P.MODES.find(m => m.id === 's2'), P.TIERS_COURT[0], { mates: [-1], rival: -1, p2: 'off' }); window.__tick(30); const M = P.MT; M.score[M.me.team] = 10; P.call('scorePts', M.me, 1, 'j'); let shown = false; for (let i = 0; i < 60 * 8 && !shown; i++) { window.__tick(1); shown = !!document.querySelector('#panel') && /DUB|TOUGH|L ·|W ·/i.test(document.getElementById('panel').innerText) && getComputedStyle(document.getElementById('panel')).display !== 'none'; }
  const first = document.getElementById('panel').innerText.slice(0, 40); P.keys.KeyE = true; window.__tick(3); P.keys.KeyE = false; window.__tick(10); const after = document.getElementById('panel').innerText.slice(0, 40); return { shown, first, after, inGame: !!P.MT && P.MT.phase !== 'over' }; });
check('results screen shown', res.shown, res.first.replace(/\n/g, ' '));
check('E right after the buzzer does not skip it', res.after === res.first && !res.inGame, res.after.replace(/\n/g, ' '));
if (shots) await p.screenshot({ path: path.join(dir, 'shots', 'rf-results.png') });
// 4. streak banner names the team
const st = await p.evaluate(() => { const P = __pit; P.uiClose(); window.__tick(5); P.launchGame(P.MODES.find(m => m.id === 's2'), P.TIERS_COURT[0], { mates: [-1], rival: -1, p2: 'off' }); window.__tick(30); const M = P.MT; M.phase = 'live'; M.stops = [0, 0]; const them = 1 - M.me.team; for (let k = 0; k < 3; k++) { M.off = M.me.team; P.call('changePoss', them); } const L = (M.late || []).find(x => x.big === 'LOCKED IN'); return L ? L.small : ''; });
check('LOCKED IN says whose D', /their d/i.test(st || ''), st);
// 5. meter window follows the real one, and the +5 button has a price
const mz = await p.evaluate(() => { const P = __pit, M = P.MT; const me = M.me; me.shot = me.shot || { j: { win: 0 } }; const open = P.call('shotWin', me, 0, 0.3), hand = P.call('shotWin', me, 0.6, 0.3); return { open: +open.toFixed(3), hand: +hand.toFixed(3) }; });
check('green window narrows with a hand up (floor kept)', mz.hand <= mz.open && mz.hand >= 0.035, JSON.stringify(mz));
const plus = await p.evaluate(() => { const P = __pit; P.call('quitMatch'); window.__tick(10); P.uiClose(); P.uiPlayer('attrs'); window.__tick(3); return [...document.querySelectorAll('#panel button')].map(b => b.textContent).filter(t => /^\+\d/.test(t)).slice(0, 4); });
check('+5 button shows its total price', plus.some(t => /^\+5 · \d+/.test(t)), plus.join(', '));
console.log(errs.length ? 'PAGE ERRORS: ' + errs.slice(0, 3).join(' | ') : 'no page errors'); console.log(ok ? 'ALL PASS' : 'SOME FAILED'); await b.close();
