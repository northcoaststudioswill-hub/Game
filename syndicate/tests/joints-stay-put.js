// joints must not wind up (an arm's sideways angle is posed on purpose, so only its twist is checked): a body left on the ground keeps a still sprawl, a fighter who gets up stands straight, and
// flinches and finisher bends never leave a leg or arm turned once they are over
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] }); const errs = [];
  const p = await b.newPage({ viewport: { width: 500, height: 400 } }); p.on('pageerror', e => errs.push(e.message));
  await p.addInitScript(() => { window.requestAnimationFrame = () => 0; }); await p.goto('http://localhost:8765/index.html'); await p.waitForTimeout(900); await p.evaluate(() => { G.bootSkip(); G.bootSkip(); G.muted = true; }); await p.waitForTimeout(300);
  const r = await p.evaluate(() => { const c = G.makeChar({ cls: 'fighter', race: 'human' }), L = c.limbs || {}, out = {};
    const run = (act, n, extra) => { for (let i = 0; i < n; i++) c.pose(Object.assign({ t: i / 60, act, dt: 1 / 60 }, extra || {})); };
    const twist = () => { let m = 0; ['legL', 'legR', 'shinL', 'shinR', 'foreL', 'foreR', 'handL', 'handR'].forEach(k => { const j = L[k]; if (j) m = Math.max(m, Math.abs(j.rotation.y), Math.abs(j.rotation.z)); }); ['armL', 'armR'].forEach(k => { const j = L[k]; if (j) m = Math.max(m, Math.abs(j.rotation.y)); }); return +m.toFixed(3); };
    run('ko', 60); out.ko1s = twist(); run('ko', 240); out.ko5s = twist();          // still the same sprawl after four more seconds
    run('idle', 30); out.upAgain = twist();                                          // stood up: nothing left turned
    c.fl = { t: 0.32, T: 0.32, j: { legL: [0.3, 0.6], armR: [0.4, 0.5] } }; run('idle', 40); out.afterFlinch = twist();
    c.brk = { legL: [0.2, 0.9, 0.7], shinR: [0, 0.8, 0] }; run('swing', 120, { prog: 0.5 }); out.brk2s = twist(); c.brk = null; run('idle', 10); out.afterBrk = twist();
    return out; });
  console.log(JSON.stringify(r));
  const ok = Math.abs(r.ko5s - r.ko1s) < 0.01 && r.upAgain < 0.01 && r.afterFlinch < 0.01 && r.brk2s < 1.2 && r.afterBrk < 0.01;
  console.log(ok ? 'PASS' : 'FAIL', 'ERRORS', errs.length, errs.slice(0, 3).join(' | ')); await b.close(); process.exit(ok && !errs.length ? 0 : 1); })();
