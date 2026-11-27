// The shootaround by the tracks: grab a ball off the crate with the pad, dribble, shoot jumpers (hold Ⓧ, let go at the
// top) from three ranges, a layup, rebounds that roll and get picked up by walking onto them, and a friend's shot
// flying on your screen. Film strip in tests/shots/shootaround.png.   node tests/shootaround.mjs
import { createRequire } from 'module'; const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT || '/opt/node-tools/node_modules/playwright/index.js');
import path from 'path'; import { fileURLToPath } from 'url';
const dir = path.dirname(fileURLToPath(import.meta.url));
const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader'] }); const ctx = await b.newContext({ viewport: { width: 640, height: 480 } });
await ctx.addInitScript(() => { window.requestAnimationFrame = cb => { window.__raf = cb; return 1; }; window.__now = 0; window.__tick = n => { for (let i = 0; i < n; i++) { window.__now += 16.67; const f = window.__raf; window.__raf = null; if (f) f(window.__now); } }; performance.now = () => window.__now;
  window.__pad = { connected: true, axes: [0, 0, 0, 0], buttons: Array.from({ length: 17 }, () => ({ pressed: false, value: 0 })) }; navigator.getGamepads = () => window.__usePad ? [window.__pad] : []; });
const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message)); let fails = 0; const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++; };
await p.goto('file://' + (process.env.GN_HTML || path.resolve(dir, '..', 'index.html'))); await p.evaluate(() => window.__tick(60));
await p.click('#titleBtns .btn'); await p.evaluate(() => window.__tick(5)); await p.click('#panel .pf .btn'); await p.evaluate(() => window.__tick(10));
await p.evaluate(() => { const P = __pit; P.uiClose(); P.S.tut = 1; P.enterWorld('hub', 5.2, 10.4, Math.PI); window.__tick(30); P.ev('window.__rr = renderer.render.bind(renderer); renderer.render = function () { }'); window.__usePad = true; document.querySelectorAll('.bubble,.bub,#emobar,#whud,#keys,#toasts,#goal,#padhint,#panel').forEach(e => e.style.visibility = 'hidden'); });
// grab: the prompt, then Ⓐ
let r = await p.evaluate(() => { const W = __pit.W; W.me.x = 5.2; W.me.z = 10.5; W.me.face = Math.PI; window.__tick(5); const lab = document.getElementById('prompt').textContent; __pad.buttons[0].pressed = true; window.__tick(2); __pad.buttons[0].pressed = false; window.__tick(5); return { lab, held: !!W.sa.held }; });
ok(/SHOOTAROUND/.test(r.lab) && r.held, `the crate: "${r.lab}", Ⓐ takes a ball`);
// shots from three ranges, released at the top
const shoot = (d, early) => p.evaluate(([d, early]) => { const W = __pit.W, sa = W.sa, me = W.me; if (!sa.held) { const q = sa.balls.find(x => x.st !== 'held'); q.st = 'loose'; q.x = me.x; q.z = me.z; q.y = 0.12; window.__tick(2); if (!sa.held) __pit.call('saHold', q); }
    me.x = sa.rim.x - d * 0.6; me.z = sa.rim.z - d * 0.8; me.vx = me.vz = 0; window.__tick(3);
    __pad.buttons[2].pressed = true; window.__tick(1); const rel = sa.shot ? sa.shot.rel : 0.6; const hold = Math.round((rel + (early ? -0.18 : 0)) * 60); window.__tick(Math.max(1, hold - 1)); __pad.buttons[2].pressed = false;
    const ball = sa.balls.find(x => x.st === 'air') || null; let peak = 0, made = false, frames = 0; for (let f = 0; f < 400; f++) { window.__tick(1); const bb = sa.balls.find(x => x.st === 'air' || (x.st === 'loose' && x.t < 6)) || ball; if (bb) { peak = Math.max(peak, bb.y); if (bb.scored) made = true; } frames++; if (bb && bb.st === 'loose' && Math.hypot(bb.vx, bb.vz) < 0.06 && bb.y < 0.13) break; }
    const bb = ball || sa.balls.find(x => x.st === 'loose'); return { made, peak: +peak.toFixed(2), rest: bb ? bb.st : 'none', y: bb ? +bb.y.toFixed(2) : 0, att: sa.att }; }, [d, !!early]);
const res = {};
for (const [nm, d] of [['mid 4 m', 4], ['elbow 5.5 m', 5.5], ['three 7.3 m', 7.3]]) { let m = 0, n = 0, rested = 0, arc = 0; for (let i = 0; i < 12; i++) { const s = await shoot(d); n++; if (s.made) m++; if (s.rest === 'loose' && s.y < 0.13) rested++; arc = Math.max(arc, s.peak); } res[nm] = { m, n, rested, arc }; }
for (const [k, v] of Object.entries(res)) ok(v.m > 0 && v.m < v.n + 1 && v.rested >= v.n - 1 && v.arc > 3.5, `${k}: ${v.m}/${v.n} in, ${v.rested} balls came to rest on the ground, peak ${v.arc} m`);
let early = 0; for (let i = 0; i < 12; i++) early += (await shoot(5.5, true)).made ? 1 : 0;
ok(early < res['elbow 5.5 m'].m + 3, `let go early from 5.5 m: ${early}/12 (on time: ${res['elbow 5.5 m'].m}/12)`);
// a rebound: walk onto a loose ball
r = await p.evaluate(() => { const W = __pit.W, sa = W.sa, me = W.me; if (sa.held) __pit.call('saGrab'); const q = sa.balls.find(x => x.st === 'loose') || sa.balls[0]; q.st = 'loose'; q.x = 3; q.z = 6; q.y = 0.12; q.vx = q.vz = q.vy = 0; me.x = 3; me.z = 7.2; window.__tick(2); __pad.axes[1] = -1; for (let i = 0; i < 60 && !sa.held; i++) window.__tick(1); __pad.axes[1] = 0; window.__tick(2); return !!sa.held; });
ok(r, 'walk onto a loose ball and it is yours');
// a layup from close
r = await p.evaluate(() => { const W = __pit.W, sa = W.sa, me = W.me; me.x = sa.rim.x - 1.2; me.z = sa.rim.z - 1.0; window.__tick(2); __pad.buttons[2].pressed = true; window.__tick(2); const lay = sa.shot && sa.shot.lay; __pad.buttons[2].pressed = false; let made = false; for (let f = 0; f < 200; f++) { window.__tick(1); if (sa.balls.some(x => x.scored && x.t < 3)) made = true; } return { lay, made }; });
ok(r.lay, `close in it is a layup (${r.made ? 'in' : 'missed'})`);
// a friend's shot plays on your screen
r = await p.evaluate(() => { const P = __pit, W = P.W, sa = W.sa; const rig = P.call('makeRig', P.call('myBuild')); P.ev('scene').add(rig.root); const g = { rig, x: 6, z: 7, f: Math.PI, ph: 0 };
  P.call('saPeer', g, { sas: { i: 1, x: 6, y: 2.4, z: 7, vx: 0, vy: 0, vz: 0 } }, 0.016);
  const L = { x: 6, y: 2.4, z: 7, vx: (sa.rim.x - 6) / 1.1, vy: (sa.rim.y - 2.4 + 0.5 * 9.8 * 1.21) / 1.1, vz: (sa.rim.z - 7) / 1.1 };
  P.call('saPeer', g, { sas: Object.assign({ i: 2 }, L), sahb: 0 }, 0.016); const n = sa.ghosts.length; let made = false; for (let f = 0; f < 120; f++) { window.__tick(1); if (sa.ghosts.some(q => q.scored)) made = true; } return { n, made, shootT: g.shootT !== undefined }; });
ok(r.n === 1 && r.made && r.shootT, `a friend's shot: their ball flies on your screen (${r.made ? 'and drops' : 'misses'}), their jumper plays`);
// film a jumper from the elbow
const shots = [];
await p.evaluate(() => __pit.ev('renderer.render = window.__rr'));
await p.evaluate(() => { const W = __pit.W, sa = W.sa, me = W.me; if (!sa.held) __pit.call('saHold', sa.balls.find(x => x.st !== 'held')); me.x = sa.rim.x - 3.5; me.z = sa.rim.z - 4.2; window.__tick(20); __pad.buttons[2].pressed = true; window.__tick(1); });
for (let i = 0; i < 8; i++) { await p.evaluate((i) => { const sa = __pit.W.sa; if (i === 3) __pad.buttons[2].pressed = false; window.__tick(i < 3 ? 12 : 9); __pit.ev(`(() => { camera.position.set(1.6, 3.2, 3.6); camera.lookAt(6.6, 2.0, 9.4); renderer.render(scene, camera); })()`); }, i); shots.push((await p.screenshot()).toString('base64')); }
const q = await ctx.newPage(); await q.setViewportSize({ width: 4 * 320, height: 2 * 240 }); await q.setContent('<body style="margin:0;background:#111;display:flex;flex-wrap:wrap">' + shots.map(s => `<img style="width:320px;height:240px" src="data:image/png;base64,${s}">`).join('') + '</body>'); await q.screenshot({ path: path.join(dir, 'shots', 'shootaround.png') });
console.log(errs.length ? errs.join(' | ') : 'no page errors', fails ? `· ${fails} FAILED` : '· ALL PASS'); await b.close(); process.exit(fails ? 1 : 0);
