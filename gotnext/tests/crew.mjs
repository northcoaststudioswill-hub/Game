// Three people in one live room: A calls B and C into a crew, they pull up, A runs STREET 3v3 with B on A's team and C on the other.
import { createRequire } from 'module'; const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT || 'playwright');
import path from 'path'; import fs from 'fs'; import http from 'http'; import { fileURLToPath } from 'url';
import { MOCK } from './room-mock.mjs';
const dir = path.dirname(fileURLToPath(import.meta.url)); fs.mkdirSync(path.join(dir, 'shots'), { recursive: true });
const html = fs.readFileSync(path.join(dir, '..', 'index.html'));
const srv = http.createServer((q, r) => { r.writeHead(200, { 'content-type': 'text/html' }); r.end(html); }).listen(0); const url = 'http://127.0.0.1:' + srv.address().port + '/';
const browser = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const ctx = await browser.newContext({ viewport: { width: 800, height: 450 } }); await ctx.addInitScript(MOCK);   // one context: BroadcastChannel only reaches pages in the same one
let errs = 0; const ok = (l, c, x) => console.log(l + ':', x === undefined ? '' : x, c ? 'OK' : 'FAIL');
const open = async name => { const p = await ctx.newPage(); p.on('pageerror', e => { errs++; console.log(name, 'PAGEERROR', e.message, (e.stack || '').split('\n').slice(1, 3).join(' | ')); }); await p.goto(url); await p.waitForTimeout(900); await p.click('#titleBtns .btn'); await p.waitForTimeout(300); await p.fill('#bname', name); await p.click('#panel .pf .btn'); await p.waitForTimeout(600); await p.evaluate(() => { localStorage.clear(); __pit.S.tut = 1; if (__pit.W && __pit.W.guide) __pit.W.guide.st = 'rest'; __pit.uiClose(); }); return p; };
const A = await open('ALPHA'), B = await open('BRAVO'), C = await open('CHUCK');
const tick = async (pg, ms) => { await pg.bringToFront(); await pg.waitForTimeout(ms || 500); };
const click = (pg, re) => pg.evaluate(r => { const b = [...document.querySelectorAll('#panel .btn')].find(x => new RegExp(r).test(x.textContent) && !x.disabled); if (b) b.click(); return !!b; }, re);
await B.evaluate(() => __pit.enterWorld('hub', 6, 4, 0)); await C.evaluate(() => __pit.enterWorld('hub', -6, 4, 0));
for (const pg of [A, B, C, A]) await tick(pg, 600);
// A opens My Player → CREW and calls B, then C
await A.evaluate(() => { __pit.keys.KeyP = true; }); await A.waitForTimeout(120); await A.evaluate(() => { __pit.keys.KeyP = false; [...document.querySelectorAll('#panel .tabs .btn')].find(b => b.textContent === 'CREW').click(); });
await A.waitForTimeout(300); await A.screenshot({ path: path.join(dir, 'shots', 'crew-1-tab.png') });
for (const [pg, nm] of [[B, 'BRAVO'], [C, 'CHUCK']]) {
  await A.evaluate(n => { const card = [...document.querySelectorAll('#panel .card')].find(c => c.textContent.includes(n)); card.querySelector('.btn').click(); }, nm);
  await tick(pg, 900); const got = await pg.evaluate(() => /CREW/.test(document.getElementById('panel').textContent)); ok(nm + ' got the crew call', got);
  await click(pg, '^Pull up$'); await tick(A, 900);
}
await tick(B, 400); await tick(C, 400); await tick(A, 600);
const crew = await A.evaluate(() => ({ crew: __pit.NET.crew && __pit.NET.crew.m.length, chip: document.getElementById('wonline').textContent }));
ok('crew of three formed', crew.crew === 2, JSON.stringify(crew));
const pos = await Promise.all([A, B, C].map(pg => pg.evaluate(() => ({ k: __pit.W.kind, x: +__pit.W.me.x.toFixed(1), z: +__pit.W.me.z.toFixed(1) }))));
ok('members pulled up next to the leader', pos.every(p => p.k === 'hub') && Math.hypot(pos[1].x - pos[0].x, pos[1].z - pos[0].z) < 3, JSON.stringify(pos));
// A walks into The Cages; members follow
await A.evaluate(() => { __pit.uiClose(); __pit.enterWorld('pit', 0, 3, Math.PI); }); for (const pg of [A, B, C, A]) await tick(pg, 600);
const kinds = await Promise.all([B, C].map(pg => pg.evaluate(() => __pit.W.kind))); ok('crew followed into The Cages', kinds.every(k => k === 'pit'), kinds.join());
await A.screenshot({ path: path.join(dir, 'shots', 'crew-2-cages.png') });
// STREET 3v3 gate: CHUCK on the other team
await A.evaluate(() => __pit.W.spots.find(s => s.label === 'STREET 3v3').fn()); await A.waitForTimeout(300);
await A.evaluate(() => { const row = [...document.querySelectorAll('#panel .row')].find(r => r.textContent.includes('CHUCK')); [...row.querySelectorAll('.btn')].find(b => b.textContent === 'MY TEAM').click(); });
await A.waitForTimeout(200); await A.screenshot({ path: path.join(dir, 'shots', 'crew-3-gate.png') });
await click(A, 'RUN IT WITH THE CREW'); await tick(B, 900); await tick(C, 900); await tick(A, 900);
const rs = await Promise.all([A, B, C].map(pg => pg.evaluate(() => __pit.MT && { net: __pit.MT.net, me: __pit.MT.me.b.name, team: __pit.MT.me.team, n: __pit.MT.P.map(p => p.b.name + ':' + p.team).join(' ') })));
ok('all three in one 3v3', rs.every(Boolean) && rs[0].net === 'host' && rs[1].net === 'guest' && rs[2].net === 'guest' && rs[0].n === rs[1].n && rs[1].n === rs[2].n, JSON.stringify(rs));
ok('teams as called', rs[0] && rs[0].team === 0 && rs[1].team === 0 && rs[2].team === 1, rs.map(r => r && r.me + ':' + r.team).join(' '));
// the host's game is stepped from here in small slices, so presence goes out between them and background-tab timers don't matter
const hostRun = async secs => { for (let k = 0; k < secs * 10; k++) { if (!await A.evaluate(() => { for (let i = 0; i < 3 && __pit.MT; i++) __step(1 / 30); return !!__pit.MT; })) break; } };
await hostRun(4);
// both guests push: BRAVO right, CHUCK left
const x0 = await A.evaluate(() => __pit.MT.P.filter(p => p.remote).map(p => p.x));
await B.evaluate(() => { __pit.keys.KeyD = true; }); await C.evaluate(() => { __pit.keys.KeyA = true; }); await tick(B, 400); await tick(C, 400); await hostRun(1.5);
const x1 = await A.evaluate(() => __pit.MT.P.filter(p => p.remote).map(p => p.x)); await B.evaluate(() => { __pit.keys.KeyD = false; }); await C.evaluate(() => { __pit.keys.KeyA = false; });
ok('both guests drive their own players', x1[0] > x0[0] + 0.8 && x1[1] < x0[1] - 0.8, JSON.stringify([x0, x1].map(a => a.map(v => +v.toFixed(1)))));
await tick(C, 600); await C.screenshot({ path: path.join(dir, 'shots', 'crew-4-chuck.png') });
await A.evaluate(() => { const M = __pit.MT; M.score = [10, 9]; M.me.user = false; M.me.aiLvl = 0.5; M.humans = M.P.filter(p => p.user); });   // host hands its own player to the AI; idle guests go AUTO after 6 s
for (let i = 0; i < 40 && await A.evaluate(() => !!__pit.MT); i++) { await hostRun(6); if (i % 5 === 0) console.log('  host', JSON.stringify(await A.evaluate(() => { const M = __pit.MT; return M && [M.phase, M.score.join('-'), M.time | 0, M.B.holder ? M.B.holder.b.name + ':' + M.B.holder.st + (M.B.holder.user ? 'U' : '') + (M.B.holder.afk ? 'A' : '') : M.B.state, M.paused]; }))); }
console.log('play-out done');
await tick(B, 4000); await tick(C, 4000); await tick(A, 600);
const fin = await Promise.all([A, B, C].map(pg => pg.evaluate(() => ({ games: __pit.S.life.games || 0, vc: __pit.S.vc, h: document.querySelector('#panel h2') && document.querySelector('#panel h2').textContent, homies: __pit.S.homies.map(h => h.name).join() }))));
ok('everyone finished, paid, and kept each other as homies', fin.every(f => f.games === 1 && f.vc > 600 && f.homies.split(',').length === 2), JSON.stringify(fin));
await C.screenshot({ path: path.join(dir, 'shots', 'crew-5-results.png') });
console.log(errs ? 'ERRORS ' + errs : 'NO ERRORS'); await browser.close(); srv.close();
