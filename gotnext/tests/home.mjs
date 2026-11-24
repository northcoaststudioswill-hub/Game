// The home builder, end to end: node tests/home.mjs [file.html]. Screenshots in tests/shots/home-*.png
import { createRequire } from 'module'; const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT || '/opt/node-tools/node_modules/playwright/index.js');
import path from 'path'; import fs from 'fs'; import { fileURLToPath } from 'url';
const dir = path.dirname(fileURLToPath(import.meta.url)), file = path.resolve(process.argv[2] || path.join(dir, '..', 'index.html'));
const browser = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader'] }); const ctx = await browser.newContext({ viewport: { width: 1000, height: 600 } });
await ctx.addInitScript(() => { window.requestAnimationFrame = cb => { window.__raf = cb; return 1; }; window.__now = 0;
  window.__tick = n => { if (!window.__patched && window.THREE && THREE.Object3D) { window.__patched = 1; const orig = THREE.Object3D.prototype.lookAt; THREE.Object3D.prototype.lookAt = function (x, y, z) { if (this.isPerspectiveCamera && window.__camFn) { const t = window.__camFn(this); return orig.call(this, t[0], t[1], t[2]); } return orig.call(this, x, y, z); }; }
    for (let i = 0; i < n; i++) { window.__now += 16.67; const f = window.__raf; window.__raf = null; if (f) f(window.__now); } }; });
const page = await ctx.newPage(); const errs = []; page.on('pageerror', e => errs.push(e.message));
const T = n => page.evaluate(n => window.__tick(n), n), shot = n => page.screenshot({ path: path.join(dir, 'shots', `home-${n}.png`) });
let fails = 0; const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++; };
fs.mkdirSync(path.join(dir, 'shots'), { recursive: true });
await page.goto('file://' + file); await T(60);
await page.click('#titleBtns .btn'); await T(5); await page.click('#panel .pf .btn'); await T(30);
await page.evaluate(() => { const st = document.createElement('style'); st.textContent = '#toasts{display:none!important}'; document.head.appendChild(st); });
await page.evaluate(() => { __pit.uiClose(); __pit.enterWorld('crib', 0, 19.2, Math.PI); }); await T(60); await shot('empty');
// build mode: place a bench in the side yard
let r = await page.evaluate(() => { const P = __pit, S = P.S; S.vc = 5000; P.buildEnter(); const B = P.W.build; window.__tick(5); P.BLD.act.pick('bench'); B.fx = -16; B.fz = 5; window.__tick(3); const vc0 = S.vc; P.buildPlace(); return { n: S.home.items.length, paid: vc0 - S.vc, ui: getComputedStyle(document.getElementById('build')).display }; });
ok(r.n === 1 && r.paid === 120 && r.ui === 'block', `place a Park Bench in the side yard: ${r.n} piece, paid ${r.paid} VC, build bar ${r.ui}`);
r = await page.evaluate(() => { const P = __pit, B = P.W.build; B.fx = 0; B.fz = 5; window.__tick(3); const n0 = P.S.home.items.length; P.buildPlace(); return { n: P.S.home.items.length - n0, why: P.buildFits('bench', 0, 5, 0) }; });
ok(r.n === 0 && /Outside/.test(r.why), `refused on the court: "${r.why}"`);
r = await page.evaluate(() => { const P = __pit, B = P.W.build; B.fx = -16; B.fz = 5.5; window.__tick(3); return P.buildFits('bench', -16, 5.5, 0); });
ok(/Overlaps/.test(r), `refused on top of the bench: "${r}"`);
r = await page.evaluate(() => { const P = __pit, B = P.W.build; P.BLD.act.pick('rug'); B.fx = -16; B.fz = 5; window.__tick(3); const why = P.buildFits('rug', -16, 5, 0); P.buildPlace(); return { why, n: P.S.home.items.length }; });
ok(r.why === '' && r.n === 2, `a rug can go under the bench (floor layer): ${r.n} pieces`);
// pick up, rotate, move, store, sell
r = await page.evaluate(() => { const P = __pit, B = P.W.build; P.buildCancel(); B.fx = -16; B.fz = 5; window.__tick(3); const k = P.buildItemAt(-16, 5); P.buildPlace(); const picked = B.pick && B.pick.i; P.buildRotate(); B.fx = -20; B.fz = 10; window.__tick(3); P.buildPlace(); const it = P.S.home.items.find(i => i.i === 'bench'); return { k, picked, x: it.x, z: it.z, r: it.r }; });
ok(r.picked === 'bench' && r.x === -20 && r.z === 10 && r.r === 1, `pick up the bench (not the rug under it), turn it, move it: ${JSON.stringify(r)}`);
r = await page.evaluate(() => { const P = __pit, B = P.W.build, S = P.S; B.fx = -20; B.fz = 10; window.__tick(3); P.buildStore(); const st = S.home.store.bench, n = S.home.items.length; P.BLD.act.pick('bench'); B.fx = -14; B.fz = 2; window.__tick(3); const vc0 = S.vc; P.buildPlace(); const free = vc0 === S.vc; B.fx = -14; B.fz = 2; window.__tick(3); const vc1 = S.vc; P.buildSell(); return { st, n, free, back: S.store, refund: S.vc - vc1, left: S.home.items.length }; });
ok(r.st === 1 && r.free && r.refund === 60 && r.left === 1, `store it (storage 1), place it back for free, sell it for half (${r.refund} VC)`);
// stacking: small things stand on table tops; picking up the table clears it into storage
r = await page.evaluate(() => { const P = __pit, B = P.W.build, S = P.S; S.vc = 9000; P.BLD.act.pick('ctable'); B.fx = -18; B.fz = 2; window.__tick(3); P.buildPlace(); P.BLD.act.pick('trophy'); B.fx = -18.25; B.fz = 2; window.__tick(3); P.buildPlace(); const t = S.home.items.find(i => i.i === 'trophy'); P.BLD.act.pick('console'); B.fx = -17.75; B.fz = 2; window.__tick(3); const why = P.buildFits('console', -17.75, 2, 0); P.buildPlace(); const c = S.home.items.find(i => i.i === 'console'); P.buildCancel(); B.fx = -18.4; B.fz = 2.2; window.__tick(3); const k = P.buildItemAt(-17.75, 2); const top = S.home.items[k].i; return { ty: t && t.y, cy: c && c.y, why, top }; });
ok(r.ty > 0.4 && r.cy > 0.4 && r.why === '' && r.top !== 'ctable', `a trophy and a console stand on the coffee table (heights ${r.ty}, ${r.cy}); pointing there picks the small thing first`);
r = await page.evaluate(() => { const P = __pit, S = P.S; const ks = S.home.items.findIndex(i => i.i === 'ctable'); P.buildPickUpIdx(ks); return { onTop: S.home.items.filter(i => i.y).length, store: (S.home.store.trophy || 0) + (S.home.store.console || 0), moving: P.W.build.pick && P.W.build.pick.i }; });
ok(r.onTop === 0 && r.store === 2 && r.moving === 'ctable', `picking up the table puts what was on it in storage (${r.store}) and the table in your hands`);
r = await page.evaluate(() => { const P = __pit, S = P.S, B = P.W.build; P.buildCancel(); S.vc = 20000; S.rep = 20000; const today = P.rareToday(), other = P.RARES().find(x => x.id !== today.id); P.BLD.act.pick(other.id); B.fx = -21; B.fz = 9; window.__tick(3); const n0 = S.home.items.length; P.buildPlace(); const refused = S.home.items.length === n0; P.buildCancel(); P.BLD.act.pick(today.id); B.fx = -21; B.fz = 9; window.__tick(3); P.buildPlace(); const got = S.home.items.some(i => i.i === today.id); P.buildCancel(); return { today: today.n, refused, got }; });
ok(r.refused && r.got, `rare of the day (${r.today}) can be bought today; other rares are refused`);
// the lot: buying land needs rank and VC; the yard opens
r = await page.evaluate(() => { const P = __pit, S = P.S; const before = P.buildFits('weights', 15, 10, 0); S.rep = 2000; S.vc = 9000; P.uiHomeLot(); window.__tick(3); const b = [...document.querySelectorAll('#panel .btn')].find(x => /2500/.test(x.textContent)); b.click(); window.__tick(60); P.BLD.act.pick('weights'); const after = P.buildFits('weights', 15, 10, 0); return { before, after, lot: S.home.lot, vc: S.vc, building: !!P.W.build }; });
ok(/Outside/.test(r.before) && r.after === '' && r.lot === 1 && r.vc === 6500 && r.building, `buy The East Yard: before "${r.before}", after it fits; builder still open`);
// the sample crib: every piece in a legal spot; levels, sets and perks
r = await page.evaluate(() => { const P = __pit, S = P.S; P.buildExit(); P.devSampleCrib(); const H = S.home, bad = []; H.items.forEach((it, k) => { const why = P.buildFits(it.i, it.x, it.z, it.r, k); if (why) bad.push(it.i + ': ' + why); }); return { n: H.items.length, bad, lvl: P.homeLevel(), sets: P.homeSets().filter(s => s.done).map(s => s.s.n), stam: P.homeFx('a_stam'), vc: P.homeFx('vc') }; });
ok(r.bad.length === 0, `sample crib: ${r.n} pieces, all legal${r.bad.length ? ' — ' + r.bad.join('; ') : ''}`);
console.log(`     crib level ${r.lvl.lvl} (vibe ${r.lvl.tot}), sets done: ${r.sets.join(', ')}; perks: +${r.stam} Stamina, +${Math.round(r.vc * 100)}% VC`);
await page.evaluate(() => { const P = __pit; P.S.homies = [P.maxBuild('showman', 'Lil Kickstand'), P.maxBuild('glass', 'Two-Ply')]; P.enterWorld('crib', -17, 14, Math.PI); P.W.yaw = Math.PI; }); await T(120);
r = await page.evaluate(() => { const P = __pit; return { vis: P.W.npcs.filter(n => n.visitor).map(n => n.anim), sits: P.W.npcs.filter(n => n.visitor && n.anim === 'sit').length }; });
ok(r.vis.length >= 2 && r.sits >= 1, `homies came over: ${JSON.stringify(r.vis)}`);
await shot('built-walk');
await page.evaluate(() => { window.__camFn = cam => { cam.position.set(0, 26, 40); return [0, 0, 8]; }; }); await T(30); await shot('built-wide');
await page.evaluate(() => { window.__camFn = cam => { cam.position.set(-8, 7, 20); return [-17, 1, 6]; }; }); await T(30); await shot('built-side');
await page.evaluate(() => { window.__camFn = cam => { cam.position.set(9, 6, 25); return [15, 1, 12]; }; }); await T(30); await shot('built-east');
await page.evaluate(() => { window.__camFn = null; }); 
// sit on the sofa; the fridge once a day
r = await page.evaluate(() => { const P = __pit, W = P.W; const s = W.spots.find(x => x.label === 'SIT DOWN'); s.fn(); window.__tick(40); const sat = !!W.me.sit; return { sat }; });
ok(r.sat, 'sit down on a seat');
await page.evaluate(() => { const P = __pit; P.S.home.items.push({ i: 'fridge', x: -13, z: 13, r: 3 }); P.enterWorld('crib', -14, 13, -Math.PI / 2); }); await T(20);
r = await page.evaluate(() => { const P = __pit, W = P.W, S = P.S; const s = W.spots.find(x => /SNACK/.test(x.label)); const b0 = S.boosts.length; s.fn(); s.fn(); return { got: S.boosts.length - b0 }; });
ok(r.got === 1, `yard fridge: one free snack a day (${r.got})`);
// build mode screenshot
await page.evaluate(() => { const P = __pit; P.enterWorld('crib', 0, 19.2, Math.PI); window.__tick(20); P.buildEnter(); P.BLD.act.cat('tech'); P.BLD.act.pick('dj'); P.W.build.fx = -16; P.W.build.fz = 10; }); await T(60); await shot('buildmode');
console.log(errs.length ? errs.length + ' PAGE ERRORS: ' + errs.slice(0, 3).join(' | ') : 'no page errors', fails ? `· ${fails} FAILED` : '· ALL PASS'); await browser.close();
