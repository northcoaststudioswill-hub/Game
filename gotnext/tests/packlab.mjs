// Package lab: every dunk, layup, dribble move, post finish and idle-dribble kind from every package, run on a practice court
// and measured frame by frame: joints that snap (a big jump in one frame) or pop (a sudden change of speed), the ball leaving
// the hand that should have it, the ball inside the body or under the floor, and the ball teleporting. With --shots, the worst
// moments are photographed. node tests/packlab.mjs [outdir] [--shots]
import { createRequire } from 'module'; const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT || '/opt/node-tools/node_modules/playwright/index.js');
import path from 'path'; import fs from 'fs'; import { fileURLToPath } from 'url';
const dir = path.dirname(fileURLToPath(import.meta.url)), out = process.argv[2] && !process.argv[2].startsWith('--') ? process.argv[2] : path.join(dir, 'shots', 'packlab'), SHOTS = process.argv.includes('--shots'); fs.mkdirSync(out, { recursive: true });
const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader'] }); const ctx = await b.newContext({ viewport: { width: 800, height: 450 } });
await ctx.addInitScript(() => { window.requestAnimationFrame = cb => { window.__raf = cb; return 1; }; window.__now = 0; window.__tick = n => { for (let i = 0; i < n; i++) { window.__now += 16.67; const f = window.__raf; window.__raf = null; if (f) f(window.__now); } }; });
const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.goto('file://' + (process.env.GN_HTML || path.resolve(dir, '..', 'index.html'))); await p.evaluate(() => window.__tick(60));
await p.click('#titleBtns .btn'); await p.evaluate(() => window.__tick(5)); await p.click('#panel .pf .btn');
await p.evaluate(() => { window.__tick(10); __pit.S.tut = 1; });
await p.evaluate((on) => { window.SHOTS_ON = on; if (!on) __pit.ev('renderer.render = function () { }'); }, SHOTS);
// the cases
const cases = await p.evaluate(() => { const P = __pit, PK = P.ev('PACKS'), MV = P.ev('MOVES'), c = [], seen = {};
  const add = (k, v, pkg, extra) => { const id = k + ':' + v; if (seen[id]) { seen[id].pk.push(pkg); return; } seen[id] = { k, v, pk: [pkg], ...extra }; c.push(seen[id]); };
  for (const pk of PK) { if (pk.slot === 'dunkpk') for (const s of [...(pk.run || []), ...(pk.traffic || [])]) add('dunk', s, pk.id); if (pk.slot === 'laypk') for (const s of [...(pk.open || []), ...(pk.cont || [])]) add('lay', s, pk.id);
    if (pk.slot === 'dribpk') for (const sl of ['side', 'back', 'diag']) for (const s of (pk[sl] || [])) add('move', s, pk.id, { slot: sl }); if (pk.slot === 'postpk') for (const s of (pk.drop || [])) add('drop', s, pk.id); if (pk.slot === 'swagpk') for (const s of (pk.list || [])) add('swag', s, pk.id); }
  for (const m of MV) if (['side', 'back', 'diag'].includes(m.slot)) add('move', m.id, 'single', { slot: m.slot });
  for (const s of ['euro', 'reverse']) add('lay', s, 'stick'); for (const s of ['hop']) add('hop', s, 'stick');
  return c; });
console.log(cases.length + ' moves to run');
await p.evaluate(() => { const P = __pit; P.uiClose(); P.startPractice('free'); window.__tick(180); });
const run = (cs, snapAt) => p.evaluate(([cs, snapAt]) => { const P = __pit, M = P.MT, me = M.me, B = M.B, R = me.rig, J = R.joints, names = Object.keys(J);
  // reset: the ball in his hands at the top of the key, everything settled
  for (const k in P.keys) P.keys[k] = false; M.phase = 'live'; M.clock = 20; me.st = 'free'; me.t = 0; me.y = 0; me.vx = me.vz = 0; me.stam = 100; me.moveCool = 0; me.cool = 0; me.slowT = 0; me.post = false;
  const pos = { dunk: [0.6, 4.8], lay: [1.2, 4.2], move: [0, 6.6], drop: [1.4, 2.6], swag: [0, 6.6], hop: [0.8, 4.6] }[cs.k]; me.x = pos[0]; me.z = pos[1]; me.face = Math.PI; B.state = 'held'; B.holder = me; P.call('give', me); me.live = 'drib';
  me.b.moves.dunkpk = 'dk_base'; me.b.moves.laypk = 'lp_base'; me.b.moves.dribpk = 'dr_base'; me.b.moves.swagpk = 'sw_all';
  window.__tick(40);
  const V = new THREE.Vector3(), W = new THREE.Vector3(), H1 = new THREE.Vector3(), H2 = new THREE.Vector3(), rows = []; let started = false;
  const go = () => { const opp = { x: 0, z: 0 };
    if (cs.k === 'dunk') { me.vx = -me.x * 1.6; me.vz = -me.z * 1.2; return P.call('startFinish', me, 0, true, 0, { style: cs.v }); }
    if (cs.k === 'lay') { me.vx = -me.x * 1.4; me.vz = -me.z * 1.0; return cs.v === 'euro' ? P.call('startFinish', me, 1, false, 0, { layup: 1, euro: 1 }) : cs.v === 'reverse' ? P.call('startFinish', me, 0, false, 0, { layup: 1, rev: 1 }) : P.call('startFinish', me, 0, false, 0, { layup: 1, kind: cs.v }); }
    if (cs.k === 'hop') { me.vx = -me.x * 1.4; me.vz = -me.z * 1.1; return P.call('startHop', me, 'finish'); }
    if (cs.k === 'drop') { me.b.moves.postpk = cs.v === 'under' ? 'po_old' : cs.v === 'spin' ? 'po_fin' : 'po_base'; return P.call('dropStep', me, 1); }
    if (cs.k === 'move') { me.b.moves[cs.slot] = cs.v; me.b.moves.dribpk = 'dr_base'; P.call('startMove', me, cs.slot, cs.slot === 'side' ? 1 : cs.slot === 'back' ? 0 : 0.8, cs.slot === 'back' ? 1 : -0.6); return me.st === 'move'; }
    if (cs.k === 'swag') { M.practice = false; return true; } };
  window.__endF = -99; const n = cs.k === 'swag' ? 600 : 110; let prev = null, prev2 = null, worst = { step: 0, pop: 0, joint: '', fs: -1, fp: -1 }, off = 0, offF = -1, inBody = 0, under = 0, tele = 0, teleF = -1, lastB = null, sawKind = 0;
  for (let f = 0; f < n; f++) {
    if (f === 4) started = !!go();
    if (cs.k === 'swag') { M.clock = 20; me.x = pos[0]; me.z = pos[1]; me.vx = me.vz = 0; }
    window.__tick(1); if (P.MT !== M) break; P.ev('scene.updateMatrixWorld()');
    if (snapAt && snapAt.includes(f)) { P.ev('renderer.render(scene, camera)'); window.__snapReq = (window.__snapReq || []).concat([f]); }
    const act = cs.k === 'swag' ? true : (me.st === { dunk: 'finish', lay: 'finish', drop: 'finish', hop: 'hop', move: 'move' }[cs.k] || (cs.k === 'hop' && me.st === 'finish'));
    if (act) window.__endF = f; const live = f > 4 && (act || f - (window.__endF || -99) <= 12); if (!live) { prev = null; prev2 = null; lastB = null; continue; }
    // joints
    const cur = names.map(k => [J[k].rotation.x, J[k].rotation.y, J[k].rotation.z]);
    if (prev && f > 5) for (let i = 0; i < cur.length; i++) for (let a = 0; a < 3; a++) { const wr = x => Math.atan2(Math.sin(x), Math.cos(x)), d1 = wr(cur[i][a] - prev[i][a]); if (Math.abs(d1) > worst.step) { worst.step = Math.abs(d1); worst.joint = names[i] + 'xyz'[a]; worst.fs = f; }
      if (prev2) { const d0 = wr(prev[i][a] - prev2[i][a]), pop = Math.abs(d1 - d0); if (pop > worst.pop) { worst.pop = pop; worst.popJ = names[i] + 'xyz'[a]; worst.fp = f; } } }
    prev2 = prev; prev = cur;
    // the ball
    const held = B.holder === me && B.state === 'held'; if (cs.k === 'swag' && me.swag === cs.v) sawKind++;
    if (held && act && (me.st === 'hop' || (me.st === 'finish' && !me.finish.done))) { R.handR.getWorldPosition(H1); R.handL.getWorldPosition(H2); const dh = Math.min(H1.distanceTo(B.pos), H2.distanceTo(B.pos)); if (dh > off) { off = dh; offF = f; } }
    J.chest.getWorldPosition(V); J.neck.getWorldPosition(W); V.add(W).multiplyScalar(0.5); if ((held || B.state === 'pass') && V.distanceTo(B.pos) < 0.15) inBody++;
    if (B.pos.y < 0.1) under++;
    if (lastB && held) { const sp = B.pos.distanceTo(lastB) * 60; if (sp > 16 && sp > tele) { tele = sp; teleF = f; } } lastB = B.pos.clone();
    rows.push(f); }
  M.practice = 'free';
  return { started, frames: rows.length, step: +(worst.step * 180 / Math.PI).toFixed(0), joint: worst.joint, fs: worst.fs, pop: +(worst.pop * 180 / Math.PI).toFixed(0), popJ: worst.popJ, fp: worst.fp, off: +off.toFixed(2), offF, inBody, under, tele: +tele.toFixed(0), teleF, sawKind }; }, [cs, snapAt || null]);
const res = [];
for (const cs of cases) { let r; try { r = await run(cs); } catch (e) { r = { err: e.message.slice(0, 120) }; } res.push({ cs, r });
  const flags = r.err ? ['ERROR ' + r.err] : [!r.started && 'did not start', r.step > 26 && `snap ${r.step}° in one frame (${r.joint}, f${r.fs})`, r.pop > 32 && `pop ${r.pop}°/frame² (${r.popJ}, f${r.fp})`, r.off > 0.3 && `ball ${r.off} m off the hand (f${r.offF})`, r.inBody > 2 && `ball inside the body ${r.inBody} frames`, r.tele > 0 && `ball jumps at ${r.tele} m/s (f${r.teleF})`, cs.k === 'swag' && r.sawKind === 0 && 'never shown'].filter(Boolean);
  r.flags = flags; console.log(`${flags.length ? 'FLAG' : 'ok  '} ${cs.k} ${cs.v} [${cs.pk.join(',')}]  step ${r.step}° pop ${r.pop}° off ${r.off} m${flags.length ? '  — ' + flags.join('; ') : ''}`); }
fs.writeFileSync(path.join(out, 'packlab.json'), JSON.stringify(res, null, 1));
if (SHOTS) for (const { cs, r } of res.filter(x => x.r.flags && x.r.flags.length && !x.r.err)) {
  const fr = [...new Set([r.fs, r.fp, r.offF, r.teleF].filter(f => f > 0))].slice(0, 2);
  for (const f of fr) { for (const g of [f - 2, f]) { await run(cs, [g]).catch(() => {}); await p.evaluate(() => __pit.ev('renderer.render(scene, camera)')); await p.waitForTimeout(1200); await p.screenshot({ path: path.join(out, `${cs.k}-${cs.v}-f${g}.png`), timeout: 300000 }); } } }
const nf = res.filter(x => x.r.flags && x.r.flags.length).length; console.log(`\n${nf} of ${res.length} flagged`, errs.length ? 'PAGE ERRORS: ' + errs.slice(0, 3).join(' | ') : 'no page errors'); await b.close();
