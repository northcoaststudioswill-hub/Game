// The dribble while sprinting forward on a court: node tests/dribrun.mjs [file.html]
// ball in hand %, hand or real bounce %, biggest gap between ball and the dribbling hand at the catch, max ball speed, restarts
import { createRequire } from 'module'; const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT || '/opt/node-tools/node_modules/playwright/index.js');
import path from 'path'; import { fileURLToPath } from 'url';
const dir = path.dirname(fileURLToPath(import.meta.url)), file = path.resolve(process.argv[2] || path.join(dir, '..', 'index.html'));
const b = await chromium.launch({ args: ['--use-gl=swiftshader'] }); const ctx = await b.newContext({ viewport: { width: 300, height: 200 } });
await ctx.addInitScript(() => { window.requestAnimationFrame = cb => { window.__raf = cb; return 1; }; window.__now = 0; window.__tick = n => { for (let i = 0; i < n; i++) { window.__now += 16.67; const f = window.__raf; window.__raf = null; if (f) f(window.__now); } }; });
const p = await ctx.newPage(); p.on('pageerror', e => console.log('ERR', e.message)); await p.goto('file://' + file); await p.evaluate(() => window.__tick(60));
await p.click('#titleBtns .btn'); await p.evaluate(() => window.__tick(5)); await p.click('#panel .pf .btn'); await p.evaluate(() => window.__tick(10));
const r = await p.evaluate(off => { const P = __pit; P.uiClose(); P.startPractice('free'); window.__tick(170); const M = P.MT, me = M.me; M.phase = 'live'; const V = new THREE.Vector3(), rows = []; let dir = 1; me.x = -7; me.z = 8;
  for (let i = 0; i < 420; i++) { const K = P.keys; for (const k in K) K[k] = false; if (me.x > 6.5) dir = -1; else if (me.x < -6.5) dir = 1; K[dir > 0 ? 'KeyD' : 'KeyA'] = true; K.ShiftLeft = true; if (off) me.strideW = 0; window.__tick(1); if (off) me.strideW = 0;
    const D = me.drib, h = me.rig['hand' + (D ? D.hand : 'R')].getWorldPosition(V), B = M.B.pos; rows.push({ ph: D ? D.ph : '', gap: Math.hypot(B.x - h.x, B.y - h.y, B.z - h.z), b: [B.x, B.y, B.z], hy: h.y, sp: me.speed, w: me.strideW || 0, far: Math.hypot(B.x - me.x, B.z - me.z), hold: M.B.holder === me }); }
  return rows; }, process.argv[3] === 'off');
const run = r.filter(x => x.sp > 4 && x.hold), n = run.length, pc = k => Math.round(run.filter(x => x.ph === k).length / n * 100);
let maxV = 0, catchGap = [], handY = []; for (let i = 1; i < r.length; i++) { if (r[i].sp < 4) continue; maxV = Math.max(maxV, Math.hypot(r[i].b[0] - r[i - 1].b[0], r[i].b[1] - r[i - 1].b[1], r[i].b[2] - r[i - 1].b[2]) * 60); if (r[i].ph === 'hand' && r[i - 1].ph !== 'hand') catchGap.push(r[i].gap); if (r[i].ph === 'up') handY.push(r[i].gap); }
const upLen = []; let c = 0; for (const x of run) { if (x.ph === 'up') c++; else if (c) { upLen.push(c); c = 0; } }
console.log(`sprinting with the ball (${n} frames, run blend ${(run.reduce((s, x) => s + x.w, 0) / n).toFixed(2)}): in hand ${pc('hand')}% · down ${pc('down')}% · up ${pc('up')}% · longest wait for the ball to reach the hand ${Math.max(...upLen)} frames (typical ${upLen.sort((a, b) => a - b)[upLen.length >> 1]}) · bounces ${upLen.length} · max ball speed ${maxV.toFixed(1)} m/s · furthest from body ${Math.max(...run.map(x => x.far)).toFixed(2)} m`);
await b.close();
