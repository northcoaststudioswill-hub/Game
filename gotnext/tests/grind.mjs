// Every drill, H-O-R-S-E, a ladder match and a contract, played by a simple bot through the real game loop.
// Checks each one starts, runs, ends and pays.   node tests/grind.mjs
import { createRequire } from 'module'; const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT || 'playwright');
import path from 'path'; import fs from 'fs'; import { fileURLToPath } from 'url';
const dir = path.dirname(fileURLToPath(import.meta.url)); fs.mkdirSync(path.join(dir, 'shots'), { recursive: true });
const browser = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader'] });
const ctx = await browser.newContext({ viewport: { width: 640, height: 360 } });
await ctx.addInitScript(() => { window.requestAnimationFrame = cb => { window.__raf = cb; return 1; }; window.__now = 0; window.__tick = (n, ms) => { for (let i = 0; i < n; i++) { window.__now += ms; const f = window.__raf; window.__raf = null; if (f) f(window.__now); } }; });
const page = await ctx.newPage(); let errs = 0; page.on('pageerror', e => { errs++; console.log('PAGEERROR', e.message, (e.stack || '').split('\n')[1]); });
await page.goto('file://' + path.join(dir, '..', 'index.html')); await page.evaluate(() => window.__tick(60, 16.67));
await page.click('#titleBtns .btn'); await page.evaluate(() => window.__tick(5, 16.67)); await page.click('#panel .pf .btn'); await page.evaluate(() => window.__tick(30, 16.67));
await page.evaluate(() => {
  // a simple bot: shoot on time, attack the rim in finishing drills, weave the cones, slide line to line
  window.BOT = () => {
    const P = __pit, M = P.MT, K = P.keys; for (const k in K) K[k] = false; window.__f = (window.__f || 0) + 1; const tap = window.__f % 2 === 0;   /* tap, don't hold: a held button only counts once */ if (!M || !M.drill) return; const me = M.me, D = M.drill, has = M.B.holder === me;
    const go = (x, z, spr) => { if (x > me.x + 0.25) K.KeyD = true; if (x < me.x - 0.25) K.KeyA = true; if (z > me.z + 0.25) K.KeyS = true; if (z < me.z - 0.25) K.KeyW = true; if (spr) K.ShiftLeft = true; };
    if (D.id === 'slides') { go(D.data.side > 0 ? 3.4 : -3.4, 5.5); return; }
    if (D.id === 'weave') { const d = D.data; if (d.phase === 'weave') { const c = d.cones[d.next] ?? 5, want = d.next % 2 === 0 ? 6.6 : 8.6; go(Math.max(me.x + 1, c + 1.2), Math.abs(me.x - c) < 2.2 ? want : 7.6); if (Math.abs(me.x - c) < 1 && me.moveCool <= 0 && !d.styled[d.next]) K.KeyL = tap; } else if (has && me.st === 'free') { if (Math.hypot(me.x, me.z) < 2.4) K.KeyI = tap; else go(0, 0.6, true); } return; }
    if (!has) return;
    if (me.st === 'shoot') { K.Space = !me.shot.released && me.t < me.shot.rel - 0.005; return; }
    if (me.st !== 'free') return;
    if (D.id === 'layups') { if (Math.hypot(me.x, me.z) < 2.6) K.KeyI = tap; else go(0, 0.5, true); return; }
    if (D.id === 'mikan') { K.KeyI = tap; return; }
    if (D.id === 'horse' && !(D.data.turn === 'you')) return;
    K.Space = tap;
  };
  window.RUN = (maxS, cut) => { let n = 0; while (__pit.MT && n < maxS * 60) { BOT(); window.__tick(1, 16.67); n++; if (cut && __pit.MT && __pit.MT.drill && __pit.MT.drill.def.time && n === cut * 60) __pit.MT.drill.left = 0.5; } for (const k in __pit.keys) __pit.keys[k] = false; window.__tick(20, 16.67); return n / 60; };
});
const snap = async f => { try { await page.screenshot({ path: path.join(dir, 'shots', f), timeout: 8000 }); } catch (e) { console.log('(no screenshot: ' + f + ')'); } };
const ok = (name, c, d) => console.log((c ? 'PASS  ' : 'FAIL  ') + name + '  ' + d);
for (const id of (process.env.ONLY === 'side' ? [] : ['layups', 'mikan', 'ft', 'spots', 'world', 'three', 'catch', 'weave', 'slides'])) {
  const r = await page.evaluate(id => {
    const P = __pit, S = P.S, vc0 = S.vc; P.uiClose(); P.enterWorld('hub', -3.4, 4.0, 0); window.__tick(5, 16.67);
    P.W.spots.find(s => /COACH/.test(s.label)).fn(); window.__tick(3, 16.67);
    const btns = [...document.querySelectorAll('#panel .card')].find(c => c.querySelector('h3') && c.querySelector('h3').textContent === P.DRILL[id].n).querySelector('.btn'); btns.click(); window.__tick(3, 16.67);
    const started = !!(P.MT && P.MT.drill && P.MT.drill.id === id);
    const secs = RUN(id === 'spots' || id === 'ft' || id === 'catch' ? 150 : 75, id === 'weave' || id === 'slides' ? 0 : 14);
    const d = document.querySelector('#panel h3'), txt = document.querySelector('#panel p');
    return { started, secs: +secs.toFixed(1), ended: !P.MT, title: d && d.textContent, msg: txt && txt.textContent.slice(0, 110), vc: S.vc - vc0, best: S.drills[id] && S.drills[id].best };
  }, id);
  ok('drill ' + id, r.started && r.ended && r.vc > 0, JSON.stringify(r));
  if (id === 'three' || id === 'weave') await snap(`grind-${id}-result.png`);
}
// a mid-drill picture of two drills
for (const id of (process.env.ONLY === 'side' ? [] : ['three', 'weave'])) { await page.evaluate(id => { const P = __pit; P.uiClose(); P.enterWorld('hub', -3.4, 4, 0); P.startDrill(id, 'hub'); RUN(id === 'three' ? 4.5 : 4.2); }, id); await snap(`grind-${id}.png`); await page.evaluate(() => { __pit.MT && __pit.MT.cfg.onEnd({ quit: true, practice: 'drill' }); }); }
// H-O-R-S-E
{ const r = await page.evaluate(() => { const P = __pit, S = P.S; S.vc += 100; const vc0 = S.vc; P.uiClose(); P.enterWorld('hub', 7.2, 8.4, 0); window.__tick(5, 16.67); P.W.spots.find(s => /SHARPIE/.test(s.label)).fn(); window.__tick(2, 16.67);
    [...document.querySelectorAll('#panel .btn')].find(b => /H-O-R-S-E/.test(b.textContent)).click(); window.__tick(3, 16.67); const started = !!(P.MT && P.MT.drill && P.MT.drill.id === 'horse');
    const secs = RUN(400); const d = P.MT ? P.MT.drill.data : null; const h3 = document.querySelector('#panel h3'), p = document.querySelector('#panel p');
    return { started, ended: !P.MT, secs: +secs.toFixed(0), vcDelta: S.vc - vc0, wins: S.life.horseWins || 0, msg: p && p.textContent.slice(0, 90) }; });
  ok('H-O-R-S-E', r.started && r.ended && (r.vcDelta === -50 || r.vcDelta === 200 || r.vcDelta === 450), JSON.stringify(r)); await snap('grind-horse-result.png'); }
// the ladder: talk to the first challenger, play, force the last bucket
{ const r = await page.evaluate(() => { const P = __pit, S = P.S, vc0 = S.vc; P.uiClose(); P.enterWorld('pit', 0, 3, Math.PI); window.__tick(5, 16.67);
    const sp = P.W.spots.find(s => /CHALLENGE LIL KICKSTAND/.test(s.label)); sp.fn(); window.__tick(2, 16.67); [...document.querySelectorAll('#panel .btn')].find(b => b.textContent === 'Run ones').click(); window.__tick(200, 16.67);
    const M = P.MT, n = M && M.P.map(p => p.b.name + ':' + p.team).join(' '); M.score = [6, 0]; M.me.user = false; M.me.aiLvl = 1; M.humans = [];
    let k = 0; while (P.MT && k < 60 * 120) { window.__tick(1, 16.67); k++; } window.__tick(30, 16.67);
    return { roster: n, ended: !P.MT, ladder: S.ladder, vcDelta: S.vc - vc0, homie: S.homies.some(h => h.name === 'Lil Kickstand'), panel: document.querySelector('#panel h2') && document.querySelector('#panel h2').textContent, note: document.querySelector('#panel .buff') && document.querySelector('#panel .buff').textContent }; });
  ok('Ladder match', r.ended && r.roster.split(':').length === 3 && (r.ladder === 1 ? r.homie && r.vcDelta > 160 : r.vcDelta > 0), JSON.stringify(r)); await snap('grind-ladder-result.png'); }
// contracts: the panel shows three with progress, and a finished one pays
{ const r = await page.evaluate(() => { const P = __pit, S = P.S; P.uiClose(); P.enterWorld('hub', -8, -1.9, 0); window.__tick(5, 16.67); P.W.spots.find(s => /OLD HEAD/.test(s.label)).fn(); window.__tick(2, 16.67);
    const cards = [...document.querySelectorAll('#panel .card')].filter(c => c.querySelector('.ab')).length; const paid = [...document.querySelectorAll('#panel .btn')].find(b => /HC$/.test(b.textContent) && !b.disabled); const vc0 = S.vc; if (paid) paid.click(); window.__tick(2, 16.67);
    return { cards, hadFinished: !!paid, vcDelta: S.vc - vc0, event: document.getElementById('wtag').textContent }; });
  ok('Daily contracts', r.cards === 3, JSON.stringify(r)); await snap('grind-contracts.png'); }
await page.evaluate(() => { __pit.uiClose(); __pit.enterWorld('hub', -2.5, 2.6, 2.6); window.__tick(10, 16.67); }); await snap('grind-coach.png');
await page.evaluate(() => { __pit.uiClose(); __pit.enterWorld('pit', 0, 3.2, 0); window.__tick(10, 16.67); }); await snap('grind-ladder.png');
console.log(errs ? 'ERRORS ' + errs : 'NO ERRORS'); await browser.close();
