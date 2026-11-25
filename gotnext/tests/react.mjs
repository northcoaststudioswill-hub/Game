// Ankle-break and fall reactions, filmed in a game: node tests/react.mjs → tests/shots/react-<kind>.png
import { createRequire } from 'module'; const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT || '/opt/node-tools/node_modules/playwright/index.js');
import path from 'path'; import fs from 'fs'; import { fileURLToPath } from 'url';
const dir = path.dirname(fileURLToPath(import.meta.url));
const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader'] }); const ctx = await b.newContext({ viewport: { width: 280, height: 320 } });
await ctx.addInitScript(() => { window.requestAnimationFrame = cb => { window.__raf = cb; return 1; }; window.__now = 0;
  window.__tick = n => { if (!window.__patched && window.THREE && THREE.Object3D) { window.__patched = 1; const orig = THREE.Object3D.prototype.lookAt; THREE.Object3D.prototype.lookAt = function (x, y, z) { if (this.isPerspectiveCamera && window.__camFn) { const t = window.__camFn(this); return orig.call(this, t[0], t[1], t[2]); } return orig.call(this, x, y, z); }; }
    for (let i = 0; i < n; i++) { window.__now += 16.67; const f = window.__raf; window.__raf = null; if (f) f(window.__now); } }; });
const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message)); await p.goto('file://' + (process.env.GN_HTML || path.resolve(dir, '..', 'index.html'))); await p.evaluate(() => window.__tick(60));
await p.click('#titleBtns .btn'); await p.evaluate(() => window.__tick(5)); await p.click('#panel .pf .btn'); await p.evaluate(() => window.__tick(10));
await p.evaluate(() => { const P = __pit; P.uiClose(); const st = document.createElement('style'); st.textContent = '#toasts,#call,#fb,#hud,#keys,.flt{display:none!important}'; document.head.appendChild(st); P.launchGame(P.MODES[0], P.TIERS_COURT[0], { mates: [-1], rival: -1, p2: 'off' }); window.__tick(220); });
const out = {};
for (const [kind, fall, side] of [['ankles', false, 1], ['ankles-fall', true, 1], ['poster', true, 0]]) {
  await p.evaluate(([fall, side]) => { const P = __pit, M = P.MT, me = M.me, o = M.P.find(q => q.team !== me.team); M.phase = 'live'; for (const q of M.P) { if (q !== o) { q.x = 7.5; q.z = 12.5; q.st = 'stagger'; q.stg = { dur: 99, fall: false }; q.t = 0; } q.ai.tick = 999; }
    me.x = 7.5; me.z = 12.5; o.x = 0; o.z = 6; o.face = Math.PI; o.st = 'free'; o.vx = o.vz = 0; o.y = 0; window.__tick(30); window.__o = o;
    window.__camFn = cam => { cam.position.set(o.x + 0.2, 1.5, o.z - 4.2); if (cam.fov !== 40) { cam.fov = 40; cam.updateProjectionMatrix(); } return [o.x, 0.8, o.z]; };
    const fx = Math.sin(o.face), fz = Math.cos(o.face); o.st = 'stagger'; o.t = 0; o.stg = side ? { dur: fall ? 1.6 : 0.85, fall, side, dir: [Math.cos(o.face) * side, -Math.sin(o.face) * side], push: fall ? 2 : 1.5 } : { dur: 1.5, fall: true, side: 0, dir: [-fx, -fz], push: 2.2 }; }, [fall, side]);
  const shots = [], ys = [];
  for (let i = 0; i < (fall ? 108 : 66); i++) { const y = await p.evaluate(() => { window.__tick(1); const o = window.__o, V = new THREE.Vector3(); o.rig.joints.hips.getWorldPosition(V); const bad = Object.values(o.rig.joints).some(j => !isFinite(j.rotation.x + j.rotation.y + j.rotation.z)); return [V.y, bad, o.st]; }); ys.push(y); if (i % (fall ? 9 : 6) === 0) shots.push(await p.screenshot({ timeout: 120000 })); }
  out[kind] = { lowest: Math.min(...ys.map(y => y[0])).toFixed(2), end: ys[ys.length - 1][0].toFixed(2), nan: ys.some(y => y[1]), state: ys[ys.length - 1][2] };
  fs.mkdirSync(path.join(dir, 'shots'), { recursive: true });
  const { execSync } = await import('child_process'); shots.forEach((s, i) => fs.writeFileSync(path.join(dir, 'shots', `react-${kind}-${String(i).padStart(2, '0')}.png`), s));
}
console.log(JSON.stringify(out)); console.log(errs.length ? errs.join(' | ') : 'no page errors'); await b.close();
