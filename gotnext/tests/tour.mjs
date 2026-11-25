// Playthrough photographer: plays real games with the renderer on and photographs every kind of moment, close up and from the game camera,
// plus The Block, the crib, menus and a replay. For looking at, not pass/fail. node tests/tour.mjs [outdir] [plan]
import { createRequire } from 'module'; const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT || '/opt/node-tools/node_modules/playwright/index.js');
import path from 'path'; import fs from 'fs'; import { fileURLToPath } from 'url';
const dir = path.dirname(fileURLToPath(import.meta.url)), out = process.argv[2] || path.join(dir, 'shots', 'tour'); fs.mkdirSync(out, { recursive: true });
const PLAN = (process.argv[3] || 's2,s3,j2').split(',');
const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader'] }); const ctx = await b.newContext({ viewport: { width: 960, height: 540 } });
await ctx.addInitScript(() => { window.requestAnimationFrame = cb => { window.__raf = cb; return 1; }; window.__now = 0; window.__tick = n => { for (let i = 0; i < n; i++) { window.__now += 16.67; const f = window.__raf; window.__raf = null; if (f) f(window.__now); } }; });
const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.goto('file://' + (process.env.GN_HTML || path.resolve(dir, '..', 'index.html'))); await p.evaluate(() => window.__tick(60));
await p.click('#titleBtns .btn'); await p.evaluate(() => window.__tick(5)); await p.click('#panel .pf .btn'); await p.evaluate(() => { window.__tick(10); __pit.S.tut = 1; __pit.S.vc = 9000; });
let n = 0; const log = [];
const snap = async (name) => { await p.waitForTimeout(1200); const f = path.join(out, String(++n).padStart(3, '0') + '-' + name + '.png'); await p.screenshot({ path: f, timeout: 300000 }); log.push(path.basename(f)); };
// a close-up of one body: camera 3 m off his side at chest height, rendered once, then the game camera
const close = (i, side) => p.evaluate(([i, side]) => { const P = __pit, M = P.MT, q = M.P[i]; const r = q.rig.root.position, f = q.face + side * Math.PI / 2; P.ev(`camera.position.set(${r.x} + Math.sin(${f}) * 3.1, 1.25 + ${r.y}, ${r.z} + Math.cos(${f}) * 3.1); camera.lookAt(${r.x}, 1.0 + ${r.y}, ${r.z}); renderer.render(scene, camera)`); }, [i, side]);
const WANT = { finish: 4, shoot: 3, move: 3, stagger: 3, steal: 2, jump: 2, celeb: 3, hop: 1, fake: 1, pass: 1, screen: 3, post: 2, box: 2, dive: 1 };
for (const mode of PLAN) {
  await p.evaluate((mode) => { const P = __pit; P.uiClose(); const m = P.MODES.find(x => x.id === mode); P.launchGame(m, P.TIERS_COURT[1 + (mode.length % 3)], { mates: Array(m.size - 1).fill(-1), rival: -1, p2: 'off' }); window.__tick(30); const M = P.MT; M.me.user = false; M.locals = []; for (const q of M.P) q.aiLvl = 0.75; window.__got = {}; }, mode);
  await snap(mode + '-tipoff');
  for (let chunk = 0; chunk < 140; chunk++) {
    const ev = await p.evaluate((WANT) => { const P = __pit, G = window.__got; for (let i = 0; i < 400; i++) { const M = P.MT; if (!M || M.phase === 'over') return { done: 1 };
        for (const q of M.P) { const st = q.screen ? 'screen' : q.post ? 'post' : q.box ? 'box' : q.diveT > 0 ? 'dive' : q.st; const key = st + '|' + (q.st === 'finish' && q.finish ? (q.finish.type === 'dunk' ? q.finish.style : q.finish.kind) : q.st === 'move' ? q.mv && q.mv.slot : q.st === 'celeb' ? q.celebStyle : '');
          const at = { finish: 0.45, shoot: 0.5, move: 0.35, stagger: 0.3, steal: 0.2, jump: 0.3, celeb: 0.9, hop: 0.15, fake: 0.12, pass: 0.12, screen: 0.6, post: 0.8, box: 0.4, dive: 0.3 }[st];
          if (at === undefined || (G[st] || 0) >= WANT[st] || (G[key] && st !== 'screen' && st !== 'post' && st !== 'box' && st !== 'dive')) continue; const t = st === q.st && st !== 'dive' ? q.t : (q['_' + st] = (q['_' + st] || 0) + 1 / 60); if (t >= at) { G[st] = (G[st] || 0) + 1; G[key] = 1; return { i: q.i, st, key, name: q.b.name }; } }
        for (const q of M.P) { for (const s of ['screen', 'post', 'box']) if (!q[s]) q['_' + s] = 0; if (!(q.diveT > 0)) q._dive = 0; } window.__tick(1); }
      return null; }, WANT);
    if (!ev) continue; if (ev.done) break;
    const tag = (mode + '-' + ev.key.replace('|', '-').replace(/-$/, '')).replace(/[^a-z0-9-]/gi, '');
    await close(ev.i, ev.st === 'finish' || ev.st === 'stagger' || ev.st === 'celeb' ? 1 : (Math.random() < 0.5 ? 1 : -1)); await snap(tag + '-close'); if (ev.st === 'finish' || ev.st === 'stagger' || ev.st === 'celeb') { await close(ev.i, -1); await snap(tag + '-other-side'); } await p.evaluate(() => __pit.ev('matchCam(0); renderer.render(scene, camera)')); await snap(tag + '-game');
  }
  await p.evaluate(() => { const P = __pit; for (let i = 0; i < 600 && P.MT; i++) window.__tick(1); }); await snap(mode + '-after'); await p.evaluate(() => { __pit.uiClose(); window.__tick(5); });
}
// the world
for (const [w, x, z, a, nm] of [['hub', 0, 9, Math.PI, 'block-front'], ['hub', -6, 2, 0.6, 'block-courts'], ['hub', 8, 12, -2.3, 'block-shops'], ['crib', 0, 19, Math.PI, 'crib-front'], ['crib', 0, 6, Math.PI, 'crib-inside']]) {
  await p.evaluate(([w, x, z, a]) => { const P = __pit; P.uiClose(); P.enterWorld(w, x, z, a); window.__tick(120); }, [w, x, z, a]); await snap(nm); }
for (const tab of ['moves', 'pers', 'mag', 'opt', 'attrs']) { await p.evaluate((t) => { __pit.uiClose(); __pit.ev(`uiPlayer('${t}')`); window.__tick(3); }, tab); await snap('menu-' + tab); }
await p.evaluate(() => __pit.uiClose());
fs.writeFileSync(path.join(out, 'index.txt'), log.join('\n')); console.log(n + ' pictures in ' + out, errs.length ? 'PAGE ERRORS: ' + errs.slice(0, 5).join(' | ') : 'no page errors'); await b.close();
