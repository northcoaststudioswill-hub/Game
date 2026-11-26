// How much do AI teams play together? AI-only games: screens set, rolls that get the ball, passes per trip, assisted makes,
// isolations (one man holds it 3 s and shoots with no pass), and what share of shots come off a pass. node tests/teamplay.mjs [mode] [court]
import { createRequire } from 'module'; const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT || '/opt/node-tools/node_modules/playwright/index.js');
import path from 'path'; import { fileURLToPath } from 'url';
const dir = path.dirname(fileURLToPath(import.meta.url)), MODES = (process.argv[2] || 's2,s3').split(','), COURT = +(process.argv[3] || 2);
const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader'] }); const ctx = await b.newContext({ viewport: { width: 640, height: 360 } });
await ctx.addInitScript(() => { window.requestAnimationFrame = cb => { window.__raf = cb; return 1; }; window.__now = 0; window.__tick = n => { for (let i = 0; i < n; i++) { window.__now += 16.67; const f = window.__raf; window.__raf = null; if (f) f(window.__now); } }; });
const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.goto('file://' + (process.env.GN_HTML || path.resolve(dir, '..', 'index.html'))); await p.evaluate(() => window.__tick(60));
await p.click('#titleBtns .btn'); await p.evaluate(() => window.__tick(5)); await p.click('#panel .pf .btn'); await p.evaluate(() => { window.__tick(10); __pit.S.tut = 1; __pit.ev('renderer.render = function () { }'); });
for (const mode of MODES) {
  const r = await p.evaluate(([mode, COURT]) => { const P = __pit; P.uiClose(); const m = P.MODES.find(x => x.id === mode); P.launchGame(m, P.TIERS_COURT[COURT], { mates: Array(m.size - 1).fill(-1), rival: -1, p2: 'off' }); window.__tick(30); let M = P.MT; M.me.user = false; M.locals = []; for (const q of M.P) q.aiLvl = P.TIERS_COURT[COURT].ai;
    const st = { trips: 0, passes: 0, screens: 0, rolls: 0, rollFed: 0, shots: 0, offPass: 0, iso: 0, makes: 0, assisted: 0, cuts: 0, frames: 0 }; let off = -1, lastHolder = null, holdT = 0, tripPasses = 0, prevB = null, seenScr = new Set(), rolling = new Map();
    for (let f = 0; f < 60 * 240 && P.MT && P.MT.phase !== 'over'; f++) { window.__tick(1); M = P.MT; if (!M) break; st.frames++; const B = M.B;
      if (M.off !== off) { off = M.off; st.trips++; tripPasses = 0; }
      for (const q of M.P) { const s = q.ai && q.ai.scr; if (s && !seenScr.has(s)) { seenScr.add(s); st.screens++; } if (s && s.ph === 2 && !rolling.has(s)) { rolling.set(s, q); st.rolls++; } }
      if (B.state === 'pass' && prevB !== 'pass') { st.passes++; tripPasses++; for (const [s, q] of rolling) if (B.target === q) { st.rollFed++; rolling.delete(s); } }
      if (B.state === 'held' && B.holder) { if (B.holder === lastHolder) holdT += 1 / 60; else { lastHolder = B.holder; holdT = 0; } }
      if (B.state === 'shot' && prevB !== 'shot') { st.shots++; const sh = B.shooter; if (sh && sh.catchT && M.time - sh.catchT < 2.5) st.offPass++; if (tripPasses === 0 && holdT > 3) st.iso++; }
      prevB = B.state; }
    for (const q of P.MT ? P.MT.P : []) { st.makes += q.stats.fgm; st.assisted += 0; st.ast = (st.ast || 0) + q.stats.ast; }
    const sc = P.MT ? P.MT.score.slice() : []; P.call('quitMatch'); window.__tick(5); P.uiClose(); st.score = sc; return st; }, [mode, COURT]);
  const per = n => (n / Math.max(1, r.trips)).toFixed(2), pc = (a, bb) => bb ? Math.round(a / bb * 100) + '%' : '-';
  console.log(`${mode}: ${r.score.join('-')} in ${(r.frames / 60).toFixed(0)} s, ${r.trips} trips · passes/trip ${per(r.passes)} · screens/trip ${per(r.screens)} · rolls fed ${r.rollFed}/${r.rolls} · shots off a pass ${pc(r.offPass, r.shots)} · isolations ${pc(r.iso, r.shots)} of ${r.shots} shots · assisted makes ${pc(r.ast, r.makes)} (${r.ast}/${r.makes})`);
}
console.log(errs.length ? 'PAGE ERRORS: ' + errs.slice(0, 3).join(' | ') : 'no page errors'); await b.close();
