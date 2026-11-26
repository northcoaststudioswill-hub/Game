// What the eye sees of the dribble in a real game: the user plays a defender for 25 s with changing directions and turbo.
// Per bounce: where it lands against the body, how long each part of the bounce takes, how often the hand changes, sideways
// ball drift against the body, and how far it ever gets from the hips. --shots saves a filmstrip from the game camera.
import { createRequire } from 'module'; const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT || '/opt/node-tools/node_modules/playwright/index.js');
import path from 'path'; import fs from 'fs'; import { fileURLToPath } from 'url';
const dir = path.dirname(fileURLToPath(import.meta.url)), shots = process.argv.includes('--shots'), out = path.join(dir, 'shots', 'feel'); if (shots) { fs.rmSync(out, { recursive: true, force: true }); fs.mkdirSync(out, { recursive: true }); }
const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader'] }); const ctx = await b.newContext({ viewport: { width: 960, height: 540 } });
await ctx.addInitScript(() => { window.requestAnimationFrame = cb => { window.__raf = cb; return 1; }; window.__now = 0; window.__tick = n => { for (let i = 0; i < n; i++) { window.__now += 16.67; const f = window.__raf; window.__raf = null; if (f) f(window.__now); } }; });
const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.goto('file://' + (process.env.GN_HTML || path.resolve(dir, '..', 'index.html'))); await p.evaluate(() => window.__tick(60));
if (process.env.PACK) await p.evaluate((pk) => __pit.ev(`packEquip(PACKS.find(q => q.id === '${pk}'))`), process.env.PACK);
await p.click('#titleBtns .btn'); await p.evaluate(() => window.__tick(5)); await p.click('#panel .pf .btn'); await p.evaluate(() => { window.__tick(10); __pit.S.tut = 1; });
await p.evaluate(() => { const P = __pit; P.uiClose(); P.launchGame(P.MODES.find(m => m.id === 's2'), P.TIERS_COURT[1], { mates: [-1], rival: -1, p2: 'off' }); window.__tick(60); });
const plan = []; { let r = +(process.env.SEED || 7); const rnd = () => (r = (r * 16807) % 2147483647) / 2147483647; for (let t = 0; t < 25; t += 0.5 + rnd() * 0.7) plan.push({ t, k: [['KeyW'], ['KeyW', 'KeyA'], ['KeyW', 'KeyD'], ['KeyA'], ['KeyD'], ['KeyS'], []][Math.floor(rnd() * 7)], spr: rnd() < 0.4 }); }
const rows = []; let shotN = 0;
for (let f = 0; f < 25 * 60; f += 6) {
  const t = f / 60, step = plan.filter(s => s.t <= t).pop();
  const r = await p.evaluate(([keys, spr]) => { const P = __pit, M = P.MT, me = M.me, K = P.keys; for (const c of ['KeyW', 'KeyA', 'KeyS', 'KeyD', 'ShiftLeft']) K[c] = keys.includes(c); K.ShiftLeft = spr && keys.length > 0; const out = [];
    for (let i = 0; i < 6; i++) { if (M.B.holder !== me || M.phase !== 'live') { M.phase = 'live'; M.needClear = false; M.clock = 14; if (M.B.holder !== me) { P.call('give', me); window.__gv = 30; } if (Math.hypot(me.x, me.z) < 3 || Math.hypot(me.x, me.z) > 9) { me.x = 0; me.z = 7; } }
      window.__tick(1); window.__gv = Math.max(0, (window.__gv || 0) - 1); const D = me.drib || {}, B = M.B.mesh.position, fx = Math.sin(me.face), fz = Math.cos(me.face), dx = B.x - me.x, dz = B.z - me.z;
      out.push({ bx: B.x, bz: B.z, px: me.x, pz: me.z, ph: D.ph, hand: D.hand, kind: D.kind || '', st: me.st, fw: dx * fx + dz * fz, lat: dx * fz - dz * fx, y: B.y, sp: Math.hypot(me.avx || 0, me.avz || 0), od: P.call('nearestOpp', me)[1], hold: M.B.holder === me && !window.__gv }); }
    return out; }, [step.k, step.spr]);
  rows.push(...r);
  if (shots && f >= 360 && f < 360 + 120 && f % 6 === 0) { await p.waitForTimeout(250); await p.screenshot({ path: path.join(out, String(++shotN).padStart(3, '0') + '.png') }); }
}
const H = rows.filter(r => r.hold && (r.st === 'free' || r.st === 'move')), secs = H.length / 60;
const bounces = []; let cur = null; for (let i = 1; i < H.length; i++) { const a = H[i - 1], f = H[i]; if (f.ph !== a.ph) { if (cur) cur[a.ph] = (cur[a.ph] || 0) + 1; if (f.ph === 'down') { cur = { down: 0 }; bounces.push(cur); } } else if (cur) cur[f.ph] = (cur[f.ph] || 0) + 1; if (a.ph === 'down' && f.ph === 'up' && cur) { cur.fw = f.fw; cur.lat = f.lat; cur.sp = f.sp; cur.hd = f.hand; } }
const full = bounces.filter(x => x.up && x.hd !== undefined), st = a => { const m = a.reduce((s, x) => s + x, 0) / Math.max(1, a.length); return [m, Math.sqrt(a.reduce((s, x) => s + (x - m) * (x - m), 0) / Math.max(1, a.length))]; };
const dur = full.map(x => ((x.down || 0) + (x.up || 0) + (x.hand || 0)) / 60), [dm, ds] = st(dur);
let sw = 0; for (let i = 1; i < H.length; i++) if (H[i].hand !== H[i - 1].hand) sw++;
let drift = 0, dl = []; for (let i = 1; i < H.length; i++) if (H[i].ph === H[i - 1].ph && (H[i].ph === 'down' || H[i].ph === 'up') && !H[i].kind) { const v = Math.hypot((H[i].bx - H[i - 1].bx) - (H[i].px - H[i - 1].px), (H[i].bz - H[i - 1].bz) - (H[i].pz - H[i - 1].pz)) * 60; dl.push(v); drift = Math.max(drift, v); } dl.sort((x, y) => x - y); const d95 = dl[Math.floor(dl.length * 0.95)] || 0;
const dd = H.filter(r => r.ph === 'down' || r.ph === 'up').map(r => Math.hypot(r.fw, r.lat)).sort((x, y) => x - y), far = dd[Math.floor(dd.length * 0.99)] || 0, far95 = dd[Math.floor(dd.length * 0.95)] || 0, [lm, ls] = st(full.map(x => Math.abs(x.lat))), [fm, fsd] = st(full.map(x => x.fw));
const kinds = {}; for (const r of H) if (r.kind) kinds[r.kind] = (kinds[r.kind] || 0) + 1;
console.log(`${secs.toFixed(1)} s with the ball, ${full.length} full bounces (${(full.length / secs).toFixed(2)}/s)`);
console.log(`bounce length ${dm.toFixed(2)} s ± ${ds.toFixed(2)} (min ${Math.min(...dur).toFixed(2)}, max ${Math.max(...dur).toFixed(2)})`);
console.log(`lands ${lm.toFixed(2)} m to the side ± ${ls.toFixed(2)}, ${fm.toFixed(2)} m ahead ± ${fsd.toFixed(2)}; from the hips p95 ${far95.toFixed(2)} m, p99 ${far.toFixed(2)} m`);
console.log(`hand changes ${sw} (${(sw / secs * 10).toFixed(1)} per 10 s); ball's sideways speed against the body (plain bounces) p95 ${d95.toFixed(1)} m/s, max ${drift.toFixed(1)}; frames in special kinds ${JSON.stringify(kinds)}`);
console.log(errs.length ? 'PAGE ERRORS: ' + errs.slice(0, 3).join(' | ') : 'no page errors'); await b.close();
