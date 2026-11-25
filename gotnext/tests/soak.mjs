// Soak: whole games with everything on. AI-only games and games driven by a scripted "person" pressing buttons.
// Counts every new event, watches for page errors, bad numbers, stuck states. node tests/soak.mjs [games]
import { createRequire } from 'module'; const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT || '/opt/node-tools/node_modules/playwright/index.js');
import path from 'path'; import { fileURLToPath } from 'url';
const dir = path.dirname(fileURLToPath(import.meta.url)); const PLAN = (process.argv[2] || 's2:ai,s2:bot,s3:ai,s3:bot,j2:ai,j3:bot,s2:ai,s2:bot').split(',');
const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader'] }); const ctx = await b.newContext({ viewport: { width: 900, height: 520 } });
await ctx.addInitScript(() => { window.requestAnimationFrame = cb => { window.__raf = cb; return 1; }; window.__now = 0; window.__tick = n => { for (let i = 0; i < n; i++) { window.__now += 16.67; const f = window.__raf; window.__raf = null; if (f) f(window.__now); } }; });
const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message + ' @ ' + (e.stack || '').split('\n')[1]));
await p.goto('file://' + (process.env.GN_HTML || path.resolve(dir, '..', 'index.html'))); await p.evaluate(() => window.__tick(60));
await p.click('#titleBtns .btn'); await p.evaluate(() => window.__tick(5)); await p.click('#panel .pf .btn'); await p.evaluate(() => { window.__tick(10); const P = __pit; P.S.vc = 5000;
  window.__ev = {}; const E = window.__ev, c = k => { E[k] = (E[k] || 0) + 1; };
  P.ev(`(function () { const f0 = floatTxt, c0 = call, h0 = highlight, b0 = bubble, s0 = startFinish, sh0 = releaseShot, st0 = startShot;
    floatTxt = function (p, t, col) { const k = String(t).replace(/[0-9]+/g, '#'); window.__ev['f:' + k] = (window.__ev['f:' + k] || 0) + 1; return f0(p, t, col); };
    call = function (big, small, col, d) { const k = String(big).replace(/[0-9]+/g, '#'); window.__ev['c:' + k] = (window.__ev['c:' + k] || 0) + 1; return c0(big, small, col, d); };
    highlight = function (k, p, v) { const was = MT && MT.hl; const r = h0(k, p, v); if (MT && MT.hl && MT.hl !== was) window.__ev['hl:' + k] = (window.__ev['hl:' + k] || 0) + 1; return r; };
    bubble = function (p, l) { window.__ev['bubble'] = (window.__ev['bubble'] || 0) + 1; return b0(p, l); };
    startFinish = function (p, e, f, y, o) { const r = s0(p, e, f, y, o); if (r && p.st === 'finish') { const k = p.finish.type === 'dunk' ? 'dunk:' + p.finish.style : 'lay:' + p.finish.kind + (p.finish.lh ? '(L)' : ''); window.__ev[k] = (window.__ev[k] || 0) + 1; } return r; };
    startShot = function (p, src, fl, o) { const r = st0(p, src, fl, o); if (p.st === 'shoot' && p.shot && p.shot.fade) { const k = 'fade:' + p.shot.fadeK; window.__ev[k] = (window.__ev[k] || 0) + 1; } return r; };
    const l0 = launch, dp0 = doPass, cp0 = changePoss, sc0 = setCheck; window.__sh = []; window.__pace = { pass: 0, poss: 0, live: 0, dead: 0 };
    launch = function (p, make, pts, green, arc, kind) { let c = 0; try { c = contestOn(p); } catch (e) { } window.__sh.push([kind || 'close', make ? 1 : 0, green ? 1 : 0, +c.toFixed(2), p.st === 'finish' ? 1 : 0, +Math.hypot(p.x, p.z).toFixed(1), p.user ? 1 : 0]); return l0(p, make, pts, green, arc, kind); };
    doPass = function (p, to) { window.__pace.pass++; return dp0(p, to); }; changePoss = function (t) { if (MT && MT.off !== t) window.__pace.poss++; return cp0(t); }; setCheck = function (t, f) { window.__pace.poss++; return sc0(t, f); };
    renderer.render = function () { }; })()`); void c; });
const totals = {}, games = []; let seed = 7;
for (const plan of PLAN) { const [mode, who] = plan.split(':');
  await p.evaluate(([mode, who]) => { const P = __pit; P.uiClose(); const m = P.MODES.find(x => x.id === mode); window.__ev = {}; window.__g = { t0: 0, flags: [], last: { t: 0, k: '' }, done: false, res: null };
    P.launchGame(m, P.TIERS_COURT[1], { mates: Array(m.size - 1).fill(-1), rival: -1, p2: 'off' }); window.__tick(30); const M = P.MT; if (who === 'ai') { M.me.user = false; M.locals = []; }
    for (const q of M.P) q.aiLvl = 0.45 + 0.4 * ((q.i * 7) % 5) / 4; }, [mode, who]);
  let out = null;
  for (let chunk = 0; chunk < 80 && !out; chunk++) {
    out = await p.evaluate(([who, sd]) => { const P = __pit, G = window.__g; let r = sd; const rnd = () => { r = (r * 1664525 + 1013904223) >>> 0; return r / 4294967296; };
      for (let i = 0; i < 900; i++) { const M = P.MT; if (!M) { G.done = true; break; } const me = M.me;
        if (who === 'bot' && i % 9 === 0) { const K = P.keys, B = M.B, has = B.holder === me; for (const k of ['KeyW', 'KeyA', 'KeyS', 'KeyD', 'KeyE', 'KeyQ', 'KeyR', 'KeyI', 'KeyJ', 'KeyK', 'KeyL', 'ShiftLeft']) K[k] = false;
          // head somewhere sensible: the rim with the ball, your man without it; then mash a bit of everything
          let tx = 0, tz = 1; if (!has) { const g = M.off === me.team ? null : me.man; if (g) { tx = g.x * 0.85; tz = g.z * 0.85; } else { tx = (rnd() - 0.5) * 10; tz = 2 + rnd() * 6; } } if (B.state === 'loose') { tx = B.pos.x; tz = B.pos.z; }
          const dx = tx - me.x, dz = tz - me.z; if (rnd() < 0.85) { if (dx > 0.4) K.KeyD = true; else if (dx < -0.4) K.KeyA = true; if (dz > 0.4) K.KeyS = true; else if (dz < -0.4) K.KeyW = true; }
          const a = rnd(); if (a < 0.10) K.KeyE = true; else if (a < 0.2) K.Space = !K.Space; else if (a < 0.3) K.KeyQ = true; else if (a < 0.36) K.KeyR = true; else if (a < 0.5) K[['KeyI', 'KeyJ', 'KeyK', 'KeyL'][Math.floor(rnd() * 4)]] = true; else if (a < 0.62) K.ShiftLeft = true; else K.Space = false; if (rnd() < 0.3) K.KeyQ = true; }
        window.__tick(1); const M2 = P.MT; if (!M2) { G.done = true; break; }
        if (M2.phase === 'live') window.__pace.live++; else window.__pace.dead++;
        // health: numbers, bounds, progress
        for (const q of M2.P) { if (!isFinite(q.x) || !isFinite(q.z) || !isFinite(q.y)) { if (G.flags.length < 20) G.flags.push('NaN player ' + q.b.name + ' st=' + q.st); q.x = 0; q.z = 5; q.y = 0; } if (Math.abs(q.x) > 11 || q.z < -4 || q.z > 16) { if (G.flags.length < 20) G.flags.push('out of bounds ' + q.b.name + ' ' + q.x.toFixed(1) + ',' + q.z.toFixed(1) + ' st=' + q.st); } if (q.y < -0.6 || q.y > 4) { if (G.flags.length < 20) G.flags.push('height ' + q.b.name + ' y=' + q.y.toFixed(2) + ' st=' + q.st); } }
        const B2 = M2.B; if (!isFinite(B2.pos.x) || !isFinite(B2.pos.y) || !isFinite(B2.pos.z)) { if (G.flags.length < 20) G.flags.push('NaN ball state=' + B2.state); B2.pos.set(0, 1, 5); }
        const key = M2.score.join('-') + '|' + (B2.holder ? B2.holder.i : B2.state) + '|' + M2.phase; if (key !== G.last.k) { G.last.k = key; G.last.t = M2.time; } else if (M2.time - G.last.t > 30) { if (G.flags.length < 20) G.flags.push('STUCK 30s at ' + key + ' holder st=' + (B2.holder ? B2.holder.st + '/' + B2.holder.live : '-') + ' clock=' + M2.clock.toFixed(1)); G.last.t = M2.time; }
        if (M2.phase === 'over' && !G.res) G.res = { score: M2.score.slice(), time: Math.round(M2.time), stats: M2.P.map(q => ({ n: q.b.name, t: q.team, u: q.user, pts: q.stats.pts, fga: q.stats.fga, fgm: q.stats.fgm, reb: q.stats.reb, ast: q.stats.ast, stl: q.stats.stl, blk: q.stats.blk, fouls: q.stats.fouls || 0, chg: q.stats.chg || 0, dive: q.stats.dive || 0, scr: q.stats.scr || 0, touch: q.stats.touch || 0 })) };
        if (M2.time > 600) { G.flags.push('TIMEOUT 10 min, score ' + M2.score.join('-')); G.res = G.res || { score: M2.score.slice(), time: 600, stats: [] }; P.call('quitMatch'); G.done = true; break; } }
      for (const k of ['KeyW', 'KeyA', 'KeyS', 'KeyD', 'KeyE', 'KeyQ', 'KeyR', 'Space', 'ShiftLeft']) if (!P.MT) P.keys[k] = false;
      return G.done ? { res: G.res, flags: G.flags, ev: window.__ev } : null; }, [who, seed++]); }
  if (!out) out = { res: null, flags: ['never finished (harness limit)'], ev: await p.evaluate(() => window.__ev) };
  await p.evaluate(() => { for (const k in __pit.keys) __pit.keys[k] = false; window.__tick(20); __pit.uiClose(); window.__tick(5); });
  for (const k in out.ev) totals[k] = (totals[k] || 0) + out.ev[k]; games.push({ plan, res: out.res, flags: out.flags });
  const s = out.res; console.log(`${plan}: ${s ? s.score.join('-') + ' in ' + s.time + ' s' : 'no result'}${out.flags.length ? '  FLAGS: ' + out.flags.slice(0, 4).join(' ; ') : ''}`);
  if (s && s.stats.length) { const tm = [0, 1].map(t => s.stats.filter(x => x.t === t)), fg = t => { const a = tm[t].reduce((x, y) => x + y.fga, 0), m = tm[t].reduce((x, y) => x + y.fgm, 0); return m + '/' + a; }; console.log(`   FG ${fg(0)} v ${fg(1)} · fouls ${s.stats.reduce((x, y) => x + y.fouls, 0)} · steals ${s.stats.reduce((x, y) => x + y.stl, 0)} · blocks ${s.stats.reduce((x, y) => x + y.blk, 0)} · boards ${s.stats.reduce((x, y) => x + y.reb, 0)} · assists ${s.stats.reduce((x, y) => x + y.ast, 0)}`); }
}
const show = pre => Object.keys(totals).filter(k => k.startsWith(pre)).sort((a, c) => totals[c] - totals[a]).map(k => `${k.slice(pre.length)} ${totals[k]}`).join(' · ');
console.log('\nOVER ' + games.length + ' GAMES'); console.log('calls: ' + show('c:')); console.log('floats: ' + show('f:')); console.log('highlights: ' + show('hl:')); console.log('dunks: ' + show('dunk:')); console.log('layups: ' + show('lay:')); console.log('fades: ' + show('fade:')); console.log('bubbles: ' + (totals.bubble || 0));
{ const sh = await p.evaluate(() => window.__sh), pace = await p.evaluate(() => window.__pace); const ai = sh.filter(x => !x[6]);
  const pct = (L) => L.length ? Math.round(100 * L.filter(x => x[1]).length / L.length) + '% of ' + L.length : 'none';
  const by = (f) => pct(ai.filter(f)); console.log('\nSHOTS (AI only): three ' + by(x => x[0] === 'three') + ' · mid ' + by(x => x[0] === 'mid') + ' · layups ' + by(x => x[4]) + ' · other close ' + by(x => x[0] === 'close' && !x[4]));
  console.log('  jumpers open (<15% contested) ' + by(x => !x[4] && x[3] < 0.15) + ' · contested (15–40%) ' + by(x => !x[4] && x[3] >= 0.15 && x[3] < 0.4) + ' · smothered (40%+) ' + by(x => !x[4] && x[3] >= 0.4) + ' · greens ' + Math.round(100 * ai.filter(x => x[2]).length / Math.max(1, ai.filter(x => !x[4]).length)) + '% of jumpers');
  console.log('  threes from ' + (ai.filter(x => x[0] === 'three').reduce((a, x) => a + x[5], 0) / Math.max(1, ai.filter(x => x[0] === 'three').length)).toFixed(1) + ' m on average');
  console.log('PACE: ' + (pace.live / 60 / Math.max(1, pace.poss)).toFixed(1) + ' s of live play per possession · ' + (pace.pass / Math.max(1, pace.poss)).toFixed(1) + ' passes per possession · ' + Math.round(100 * pace.dead / Math.max(1, pace.live + pace.dead)) + '% of the time the ball is dead'); }
console.log(errs.length ? 'PAGE ERRORS (' + errs.length + '): ' + [...new Set(errs)].slice(0, 6).join(' | ') : 'no page errors'); const flagged = games.filter(g => g.flags.length).length; console.log(flagged ? flagged + ' games flagged' : 'no flags'); await b.close(); process.exit(errs.length ? 1 : 0);
