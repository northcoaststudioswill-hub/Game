// The free animation set: jump shots from a lower and an upper base, more layups (under, over, reverse, 360) and more dunks. node tests/basics.mjs
import { createRequire } from 'module'; const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT || '/opt/node-tools/node_modules/playwright/index.js');
import path from 'path'; import { fileURLToPath } from 'url';
const dir = path.dirname(fileURLToPath(import.meta.url));
const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader'] }); const ctx = await b.newContext({ viewport: { width: 1100, height: 620 } });
await ctx.addInitScript(() => { window.requestAnimationFrame = cb => { window.__raf = cb; return 1; }; window.__now = 0; window.__tick = n => { for (let i = 0; i < n; i++) { window.__now += 16.67; const f = window.__raf; window.__raf = null; if (f) f(window.__now); } }; });
const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message)); let fails = 0; const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++; };
await p.goto('file://' + (process.env.GN_HTML || path.resolve(dir, '..', 'index.html'))); await p.evaluate(() => window.__tick(60));
await p.click('#titleBtns .btn'); await p.evaluate(() => window.__tick(5)); await p.click('#panel .pf .btn'); await p.evaluate(() => { window.__tick(10); __pit.S.vc = 1000; });
let r = await p.evaluate(() => { const P = __pit, LO = P.ev('LOWER_BASES').slice(1), UP = P.ev('UPPER_BASES').slice(1), D = JSON.parse(JSON.stringify(P.ev('PROF_DEF'))), sp = (pr, u) => P.call('shotPose', pr, u, 0);
  const dif = (A, B, keys) => keys.reduce((s, k) => s + (A[k] && B[k] ? Math.abs(A[k][0] - B[k][0]) + Math.abs(A[k][1] - B[k][1]) + Math.abs(A[k][2] - B[k][2]) : 0), 0), SK = P.ev('SKEL');
  let bad = 0, lowDistinct = 0, upDistinct = 0, cross = 0; const base = [0.4, 0.9, 1.12].map(u => sp(D, u));
  for (const [k] of LO) { const pr = Object.assign({}, D, { lower: k }); let d = 0; [0.4, 0.9, 1.12].forEach((u, i) => { const A = sp(pr, u); for (const j in A) if (Array.isArray(A[j]) && A[j].some(v => !isFinite(v))) bad++; d += dif(A, base[i], SK.lower) + Math.abs((A.y || 0) - (base[i].y || 0)); cross += dif(A, base[i], SK.upper); }); if (d > 0.15 || k === 'trad') lowDistinct++; }
  for (const [k] of UP) { const pr = Object.assign({}, D, { upper: k }); let d = 0; [0.4, 0.9, 1.12].forEach((u, i) => { const A = sp(pr, u); for (const j in A) if (Array.isArray(A[j]) && A[j].some(v => !isFinite(v))) bad++; d += dif(A, base[i], SK.upper); cross += dif(A, base[i], SK.lower); }); if (d > 0.15 || k === 'trad') upDistinct++; }
  // pairs really are different from each other
  const sig = new Set(); for (const [l] of LO) for (const [u] of UP) { const A = sp(Object.assign({}, D, { lower: l, upper: u }), 0.9); sig.add(['knR', 'hpR', 'shR', 'elR', 'shL'].map(k => A[k].map(v => v.toFixed(2)).join()).join('|')); }
  const names = []; for (let i = 0; i < 80; i++) names.push('Bot' + i); const combos = new Set(names.map(n => { const a = P.call('animProfile', { name: n, build: { style: ['sniper', 'slasher', 'glass', 'general'][n.length % 4], body: { h: 190 } } }); return a.lower + '/' + a.upper; }));
  const mine = P.call('animProfile', { mine: true, name: 'ROOKIE', build: P.S.build });
  return { lo: LO.length, up: UP.length, lowDistinct, upDistinct, bad, cross: +cross.toFixed(3), pairs: sig.size, combos: combos.size, mine: [mine.lower, mine.upper] }; });
ok(r.lo === 8 && r.up === 8 && r.lowDistinct === 8 && r.upDistinct === 8 && r.bad === 0 && r.cross < 0.001 && r.pairs >= 60, `${r.lo} lower bases × ${r.up} upper bases: each changes only its own half (bleed ${r.cross}), no bad numbers, ${r.pairs} of 64 pairs give a different set point`);
ok(r.combos >= 15 && r.mine.join('') === '', `80 AI players shoot off ${r.combos} different base pairs; your own player keeps the blend until you pick`);
r = await p.evaluate(() => { const P = __pit; P.ev("uiClose(); uiPlayer('moves')"); window.__tick(3); const cat = [...document.querySelectorAll('#panel .cat')].map(e => e.textContent.split('—')[0].trim()); const click = n => { const bt = [...document.querySelectorAll('#panel .card .btn')].find(e => e.textContent === n); bt.click(); window.__tick(2); };
  click('Hop'); click('Two-hand push'); return { cat: cat[0], a: [P.S.anim.lower, P.S.anim.upper] }; });
ok(r.cat === 'JUMP SHOT BASES' && r.a.join() === 'hop,push', `MOVES has a free JUMP SHOT BASES picker: chose ${r.a.join(' + ')} and it is saved on the build`);
await p.screenshot({ path: path.join(dir, 'shots', 'bases-menu.png'), timeout: 300000 });
// finishes
r = await p.evaluate(() => { const P = __pit; P.uiClose(); P.launchGame(P.MODES.find(m => m.size === 2 && !m.arcade), P.TIERS_COURT[1], { mates: [-1], rival: -1, p2: 'off' }); window.__tick(200); const M = P.MT, me = M.me, d = M.P.find(q => q.team !== me.team); var g = 0; while (M.phase !== 'live' && g++ < 600) window.__tick(1);
  const set = () => { P.call('give', me); P.call('changePoss', me.team); M.needClear = false; M.phase = 'live'; me.st = 'free'; me.y = 0; me.live = 'drib'; me.putT = 0; for (const q of M.P) { q.ai.tick = 99; if (q !== me) { q.st = 'free'; q.x = 7.5; q.z = 11 + q.i * 0.4; q.vx = q.vz = 0; } } };
  me.A.dunk = 92; me.A.vert = 90; me.A.layup = 78; me.A.speed = 60; me.b.moves.dunk = 'twohand'; const out = { open: {}, cont: {}, lay: {}, layOpen: {}, base: 0, put: {} };
  for (let i = 0; i < 300; i++) { set(); me.x = 0.4; me.z = 3.2; me.vx = -0.4; me.vz = -4.6; P.call('startFinish', me, 0, true); const s = me.finish.style; out.open[s] = (out.open[s] || 0) + 1; }
  for (let i = 0; i < 200; i++) { set(); me.x = 0.3; me.z = 2.6; me.vx = 0; me.vz = -1; d.x = 0.2; d.z = 1.8; P.call('startFinish', me, 0, true); const s = me.finish.style; out.cont[s] = (out.cont[s] || 0) + 1; }
  for (let i = 0; i < 100; i++) { set(); me.putT = 2; me.x = 0.3; me.z = 1.6; me.vx = 0; me.vz = 0; P.call('startFinish', me, 0, true); const s = me.finish.style; out.put[s] = (out.put[s] || 0) + 1; }
  for (let i = 0; i < 400; i++) { set(); me.x = 0.3; me.z = 3.0; me.vx = 0; me.vz = -4.5; d.x = 0.2; d.z = 2.1; P.call('startFinish', me, 0, false, 0, { layup: 1 }); const k = me.finish.kind; out.lay[k] = (out.lay[k] || 0) + 1; }
  for (let i = 0; i < 300; i++) { set(); me.x = 0.3; me.z = 3.0; me.vx = 0; me.vz = -4.5; P.call('startFinish', me, 0, false, 0, { layup: 1 }); const k = me.finish.kind; out.layOpen[k] = (out.layOpen[k] || 0) + 1; }
  const ai = M.P.find(q => q.team !== me.team); for (let i = 0; i < 200; i++) { P.call('give', ai); P.call('changePoss', ai.team); M.needClear = false; M.phase = 'live'; ai.st = 'free'; ai.y = 0; ai.live = 'drib'; for (const q of M.P) if (q !== ai) { q.x = 7.5; q.z = 11 + q.i * 0.4; } ai.A.dunk = 30; ai.x = 2.2; ai.z = 0.7; ai.vx = -3.5; ai.vz = 0; P.call('startFinish', ai); if (ai.st === 'finish' && ai.finish.kind === 'reverse') out.base++; ai.st = 'free'; }
  // every new pose is made of finite numbers
  let bad = 0; for (const k of ['under', 'over', 'spin', 'quick']) for (let u = 0; u <= 1; u += 0.1) { const A = P.call('poseOf', 'layup', u, { kind: k, u }); for (const j in A) if (Array.isArray(A[j]) && A[j].some(v => !isFinite(v))) bad++; }
  for (const k of ['onehand', 'cock', 'hammer', 'lean', 'hangtwo', 'tip']) for (let u = 0; u <= 1; u += 0.1) { const A = P.call('poseOf', 'dunk', u, { style: k, u }); for (const j in A) if (Array.isArray(A[j]) && A[j].some(v => !isFinite(v))) bad++; }
  out.bad = bad; out.lab = P.ev('ALAB_ACTS').filter(a => /^(layup|dunk):/.test(a[0])).length; return out; });
ok(Object.keys(r.open).length >= 4 && r.open.hammer > 20 && r.open.lean > 8 && r.cont.hangtwo > 20 && r.cont.twohand > 20 && r.put.tip > 55, `free dunks: off the run ${JSON.stringify(r.open)}; in traffic ${JSON.stringify(r.cont)}; a putback is usually a tip slam (${r.put.tip}/100)`);
ok(r.lay.under > 20 && r.lay.over > 20 && r.lay.spin > 10 && r.layOpen.over > 10 && r.base > 40, `free layups against a defender: ${JSON.stringify(r.lay)}; alone: ${JSON.stringify(r.layOpen)}; along the baseline ${r.base}/200 go reverse`);
ok(r.bad === 0 && r.lab >= 14, `every new pose is clean; ${r.lab} layup and dunk entries in the Anim Lab`);
console.log(errs.length ? 'PAGE ERRORS: ' + errs.join(' | ') : 'no page errors', '·', fails ? fails + ' FAILED' : 'ALL PASS'); await b.close(); process.exit(fails || errs.length ? 1 : 0);
