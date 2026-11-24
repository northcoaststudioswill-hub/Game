// A dribble move filmed in real gameplay with a maxed player: node tests/movelook.mjs <moveId> [front|back] [jog]
import { createRequire } from 'module'; const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT || '/opt/node-tools/node_modules/playwright/index.js');
import path from 'path'; import fs from 'fs'; import { fileURLToPath } from 'url';
const dir = path.dirname(fileURLToPath(import.meta.url)), mv = process.argv[2] || 'shammgod', ang = process.argv[3] || 'front', jog = process.argv[4] === 'jog';
const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader'] }); const ctx = await b.newContext({ viewport: { width: 300, height: 340 } });
await ctx.addInitScript(() => { window.requestAnimationFrame = cb => { window.__raf = cb; return 1; }; window.__now = 0;
  window.__tick = n => { if (!window.__patched && window.THREE && THREE.Object3D) { window.__patched = 1; const orig = THREE.Object3D.prototype.lookAt; THREE.Object3D.prototype.lookAt = function (x, y, z) { if (this.isPerspectiveCamera && window.__camFn) { const t = window.__camFn(this); return orig.call(this, t[0], t[1], t[2]); } return orig.call(this, x, y, z); }; }
    for (let i = 0; i < n; i++) { window.__now += 16.67; const f = window.__raf; window.__raf = null; if (f) f(window.__now); } }; });
const p = await ctx.newPage(); p.on('pageerror', e => console.log('ERR', e.message)); await p.goto('file://' + path.resolve(dir, '..', 'index.html')); await p.evaluate(() => window.__tick(60));
await p.click('#titleBtns .btn'); await p.evaluate(() => window.__tick(5)); await p.click('#panel .pf .btn'); await p.evaluate(() => window.__tick(10));
await p.evaluate(([mv, ang]) => { const P = __pit; P.devMax(); P.S.moves.side = mv; P.uiClose(); const st = document.createElement('style'); st.textContent = '#toasts,#call,#fb,#hud,#keys,.flt{display:none!important}'; document.head.appendChild(st);
  P.startPractice('free'); window.__tick(170); const M = P.MT; M.phase = 'live'; M.me.x = 0; M.me.z = 8.5; window.__tick(40);
  window.__camFn = cam => { const m = M.me; if (ang === 'front') cam.position.set(m.x + 0.6, 1.5, m.z - 4.6); else cam.position.set(m.x, 2.4, m.z + 5); if (cam.fov !== 38) { cam.fov = 38; cam.updateProjectionMatrix(); } return [m.x, 0.95, m.z]; }; }, [mv, ang]);
const shots = [], log = [];
for (let i = 0; i < 44; i++) { const s = await p.evaluate(([i, jog]) => { const K = __pit.keys; for (const k in K) K[k] = false; if (jog) K.KeyW = true; if (i === 6) K.KeyL = true; window.__tick(1); const me = __pit.MT.me, B = __pit.MT.B, V = new THREE.Vector3(), h = me.rig['hand' + me.hand].getWorldPosition(V); return [me.st, me.drib ? me.drib.ph : '', me.hand, (B.pos.x - me.x).toFixed(2), B.pos.y.toFixed(2), (B.pos.z - me.z).toFixed(2), (h.x - me.x).toFixed(2), h.y.toFixed(2), me.rig.joints.hips.position.y.toFixed(2)].join(' '); }, [i, jog]); log.push(i + ' ' + s); if (i >= 4 && i % 2 === 0 && shots.length < 16) shots.push(await p.screenshot({ timeout: 120000 })); }
fs.mkdirSync(path.join(dir, 'shots'), { recursive: true }); shots.forEach((s, i) => fs.writeFileSync(path.join(dir, 'shots', `mv-${mv}-${ang}-${String(i).padStart(2, '0')}.png`), s));
console.log('i st phase hand | ball x y z | hand x y | hipsY\n' + log.slice(4, 36).join('\n')); await b.close();
