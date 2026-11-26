// Strategy hunt: a scripted player commits to one plan for a whole 2v2 on Main Court (perfect shot timing, like a good
// player) and we see whether any one plan breaks the game. node tests/strategies.mjs [plans] [court]
import { createRequire } from 'module'; const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT || '/opt/node-tools/node_modules/playwright/index.js');
import path from 'path'; import { fileURLToPath } from 'url';
const dir = path.dirname(fileURLToPath(import.meta.url)), PLANS = (process.argv[2] || 'drive,three,post,steal,pass').split(','), COURT = +(process.argv[3] || 1);
const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader'] }); const ctx = await b.newContext({ viewport: { width: 640, height: 360 } });
await ctx.addInitScript(() => { window.requestAnimationFrame = cb => { window.__raf = cb; return 1; }; window.__now = 0; window.__tick = n => { for (let i = 0; i < n; i++) { window.__now += 16.67; const f = window.__raf; window.__raf = null; if (f) f(window.__now); } }; });
const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.goto('file://' + (process.env.GN_HTML || path.resolve(dir, '..', 'index.html'))); await p.evaluate(() => window.__tick(60));
await p.click('#titleBtns .btn'); await p.evaluate(() => window.__tick(5)); await p.click('#panel .pf .btn'); await p.evaluate(() => { window.__tick(10); __pit.S.tut = 1; __pit.ev('renderer.render = function () { }'); });
for (const plan of PLANS) {
  const r = await p.evaluate(([plan, COURT]) => { const P = __pit; P.uiClose(); P.launchGame(P.MODES.find(m => m.id === 's2'), P.TIERS_COURT[COURT], { mates: [-1], rival: -1, p2: 'off' }); window.__tick(30); const M = P.MT, me = M.me; for (const q of M.P) if (q !== me) q.aiLvl = P.TIERS_COURT[COURT].ai;
    const K = P.keys, st = { shots: 0, makes: 0, steals: 0, reach: 0, tos: 0, poss: 0, fouls: 0 }; let lastOff = null, f = 0, shootHold = 0, wasHolder = false;
    const go = (tx, tz, spr) => { const dx = tx - me.x, dz = tz - me.z, l = Math.hypot(dx, dz); for (const k of ['KeyW', 'KeyA', 'KeyS', 'KeyD', 'ShiftLeft']) K[k] = false; if (l < 0.3) return l; if (dx / l > 0.35) K.KeyD = true; if (dx / l < -0.35) K.KeyA = true; if (dz / l > 0.35) K.KeyS = true; if (dz / l < -0.35) K.KeyW = true; K.ShiftLeft = !!spr; return l; };
    while (P.MT === M && M.phase !== 'over' && f < 60 * 600) { f++; const B = M.B, has = B.holder === me;
      for (const k of ['KeyE', 'KeyQ', 'KeyR']) K[k] = false;
      if (M.phase === 'live') {
        if (has && !wasHolder) st.poss++;
        if (has && me.st === 'free') {
          if (M.needClear) go(me.x * 1.4 || 0.2, Math.max(me.z * 1.4, 8), false);
          else if (plan === 'drive') { const d = go(0, 0.5, true); if (Math.hypot(me.x, me.z) < 2.3) { K.Space = true; shootHold = 2; } }
          else if (plan === 'three') { const l = go(me.x > 0 ? 5.6 : -5.6, 5.4, false); if (l < 0.6) { K.Space = true; shootHold = 1; } }
          else if (plan === 'post') { if (Math.hypot(me.x, me.z) > 3.4) { go(1.6, 3.0, false); K.KeyQ = true; } else { K.KeyQ = true; K.Space = true; shootHold = 1; } }
          else if (plan === 'pass') { if (f % 50 === 0) K.KeyE = true; else go(me.x > 0 ? 4.5 : -4.5, 4.5, false); if (f % 200 === 0) { K.Space = true; shootHold = 1; } }
          else if (plan === 'steal') { const d = go(0, 0.5, true); if (Math.hypot(me.x, me.z) < 2.3) { K.Space = true; shootHold = 2; } }
        } else if (me.st === 'shoot' && K.Space) { if (me.shot && me.t >= me.shot.rel) { K.Space = false; st.shots++; const dd = Math.min(...M.P.filter(q => q.team !== me.team).map(q => Math.hypot(q.x - me.x, q.z - me.z))); (st.cs = st.cs || []).push(P.call('contestOn', me).toFixed(2) + '@' + dd.toFixed(1)); } }
        else if (me.st === 'finish') { K.Space = false; }
        else if (!has && M.off !== me.team && B.holder) { const h = me.man || B.holder; go(h.x * 0.86, h.z * 0.86, Math.hypot(h.x - me.x, h.z - me.z) > 2); if (plan === 'steal' && f % 8 === 0 && Math.hypot(h.x - me.x, h.z - me.z) < 1.6) { K.KeyE = true; st.reach++; } if (h.st === 'shoot' && Math.hypot(h.x - me.x, h.z - me.z) < 1.8) K.Space = f % 30 < 3; else if (K.Space && me.st !== 'shoot') K.Space = false; }
        else if (!has && M.off === me.team) { K.Space = false; go(me.x > 0 ? 6 : -6, 2, false); if (f % 120 === 0) K.KeyE = true; }
        else if (B.state === 'loose') go(B.pos.x, B.pos.z, true);
      } else { for (const k in K) K[k] = false; }
      wasHolder = has; window.__tick(1); }
    for (const k in K) K[k] = false; const s = me.stats || {}, mate = M.P.find(q => q.team === me.team && q !== me), opp = M.P.filter(q => q.team !== me.team);
    const out = { plan, score: M.score.slice(), myTeam: me.team, secs: Math.round(M.time), me: { pts: s.pts, fgm: s.fgm, fga: s.fga, stl: s.stl, fouls: s.fouls || 0, ast: s.ast }, mate: mate && { pts: mate.stats.pts, fga: mate.stats.fga }, opp: opp.map(q => ({ pts: q.stats.pts, fgm: q.stats.fgm, fga: q.stats.fga, stl: q.stats.stl })), reach: st.reach, cs: st.cs };
    P.call('quitMatch'); window.__tick(10); P.uiClose(); return out; }, [plan, COURT]);
  const us = r.score[r.myTeam], them = r.score[1 - r.myTeam];
  if (r.cs) console.log('   contest at release @ nearest defender m: ' + r.cs.join(' ')); console.log(`${r.plan.padEnd(6)} ${us}-${them} in ${r.secs}s · me ${r.me.pts} pts ${r.me.fgm}/${r.me.fga} FG, ${r.me.stl} stl${r.reach ? ' (' + r.reach + ' reaches)' : ''}, ${r.me.fouls} fouls · mate ${r.mate ? r.mate.pts + ' pts on ' + r.mate.fga : '-'} · them ${r.opp.map(o => o.pts + 'pts ' + o.fgm + '/' + o.fga + ' ' + o.stl + 'stl').join(', ')}`);
}
console.log(errs.length ? 'PAGE ERRORS: ' + errs.slice(0, 3).join(' | ') : 'no page errors'); await b.close();
