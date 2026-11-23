// Two players in one live room. The artifact platform's "room" is faked with a BroadcastChannel so both pages
// see each other: walk The Pit together, invite, play one shared game (host simulates, guest follows), get paid.
import { createRequire } from 'module'; const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT || 'playwright');
import path from 'path'; import fs from 'fs'; import http from 'http'; import { fileURLToPath } from 'url';
const dir = path.dirname(fileURLToPath(import.meta.url)); fs.mkdirSync(path.join(dir, 'shots'), { recursive: true });
const html = fs.readFileSync(path.join(dir, '..', 'index.html'));
const srv = http.createServer((q, r) => { r.writeHead(200, { 'content-type': 'text/html' }); r.end(html); }).listen(0); const url = 'http://127.0.0.1:' + srv.address().port + '/';
const MOCK = () => {
  const me = Math.random().toString(36).slice(2, 12);
  const mk = name => {
    const bc = new BroadcastChannel('room-' + name), peers = new Map(), hs = new Set(); let mine = {}, gone = false;
    const P = (peer, presence) => Object.freeze({ peer, by: null, isMe: peer === me, sameTab: peer === me, kind: 'viewer', guest: false, presence: Object.freeze(presence), updatedAt: Date.now() });
    const fire = (joined, left, updated) => { const all = Object.freeze([...peers.values()]); for (const h of hs) h({ peers: all, joined, left, updated }); };
    peers.set(me, P(me, {})); bc.onmessage = e => { const d = e.data; if (gone) return;
      if (d.t === 'hello') bc.postMessage({ t: 'p', peer: me, pr: mine });
      if (d.t === 'p') { const had = peers.has(d.peer), p = P(d.peer, d.pr); peers.set(d.peer, p); fire(had ? [] : [p], [], had ? [p] : []); }
      if (d.t === 'bye') { const p = peers.get(d.peer); if (p) { peers.delete(d.peer); fire([], [p], []); } } };
    setTimeout(() => bc.postMessage({ t: 'hello' }), 30); setTimeout(() => fire([peers.get(me)], [], []), 10);
    addEventListener('pagehide', () => bc.postMessage({ t: 'bye', peer: me }));
    return { name, emit: async () => { }, on: () => () => { }, presence: async patch => { if (gone) throw { code: 'invalid_argument' }; mine = Object.assign({}, mine); for (const k in patch) { if (patch[k] === null) delete mine[k]; else mine[k] = JSON.parse(JSON.stringify(patch[k])); } if (JSON.stringify(mine).length > 4096) throw { code: 'invalid_argument', message: 'presence over 4 KiB' }; peers.set(me, P(me, mine)); bc.postMessage({ t: 'p', peer: me, pr: mine }); window.__sent = (window.__sent || 0) + 1; window.__maxP = Math.max(window.__maxP || 0, JSON.stringify(mine).length); },
      peers: () => Object.freeze([...peers.values()]), onPeers: h => { hs.add(h); return () => hs.delete(h); }, connected: () => true, onConnection: h => { setTimeout(() => h(true), 5); return () => { }; },
      leave: async () => { gone = true; bc.postMessage({ t: 'bye', peer: me }); bc.close(); }, join: async n => mk(n) };
  };
  const lobby = mk('lobby'); window.claude = { use: n => Promise.resolve(n === 'room' ? lobby : null) };
};
const browser = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const ctx = await browser.newContext({ viewport: { width: 900, height: 506 } }); await ctx.addInitScript(MOCK);
let errs = 0; const open = async name => { const p = await ctx.newPage(); p.on('pageerror', e => { errs++; console.log(name, 'PAGEERROR', e.message, (e.stack || '').split('\n').slice(1, 3).join(' | ')); }); await p.goto(url); await p.waitForTimeout(900); await p.click('#titleBtns .btn'); await p.waitForTimeout(300); await p.fill('#bname', name); await p.click('#panel .pf .btn'); await p.waitForTimeout(700); return p; };
const A = await open('HOSTY'); await A.evaluate(() => { localStorage.removeItem('gotnext_v1'); });
const B = await open('GUESTY');
const ok = (l, c, x) => console.log(l + ':', x === undefined ? '' : x, c ? 'OK' : 'FAIL');
await A.evaluate(() => __pit.enterWorld('pit', -2, 2, Math.PI)); await B.evaluate(() => __pit.enterWorld('pit', 2, 2, Math.PI)); await A.bringToFront(); await A.waitForTimeout(1500); await B.bringToFront(); await B.waitForTimeout(800); await A.bringToFront(); await A.waitForTimeout(800);
const seeA = await A.evaluate(() => ({ others: __pit.NET.peers.filter(p => !p.sameTab).map(p => p.presence.b && p.presence.b.n), rigs: Object.keys(__pit.W.netRigs || {}).length, chip: document.getElementById('wonline').textContent }));
ok('A sees B in The Pit', seeA.others[0] === 'GUESTY' && seeA.rigs === 1, JSON.stringify(seeA)); await A.screenshot({ path: path.join(dir, 'shots', 'online-1-pit.png') });
// invite from the Street 2v2 door
await A.evaluate(() => { __pit.W.spots.find(s => s.label === 'STREET 2v2').fn(); }); await A.waitForTimeout(300); await A.screenshot({ path: path.join(dir, 'shots', 'online-2-invite.png') });
await A.evaluate(() => [...document.querySelectorAll('#panel .btn')].find(b => b.textContent === 'SAME TEAM').click());
await B.bringToFront(); await B.waitForTimeout(900); await B.screenshot({ path: path.join(dir, 'shots', 'online-3-called.png') });
ok('B got the call', await B.evaluate(() => /CALLED YOU/.test(document.getElementById('panel').textContent)));
await B.evaluate(() => [...document.querySelectorAll('#panel .btn')].find(b => b.textContent === 'Run it').click()); await B.waitForTimeout(600);
await A.bringToFront(); await A.waitForTimeout(1500);
const st = async () => [await A.evaluate(() => __pit.MT && { net: __pit.MT.net, n: __pit.MT.P.map(p => p.b.name + (p.remote ? '*' : '')), ph: __pit.MT.phase, t: __pit.MT.time }), await B.evaluate(() => __pit.MT && { net: __pit.MT.net, n: __pit.MT.P.map(p => p.b.name), me: __pit.MT.me.b.name, q: __pit.NET.game && __pit.NET.game.q })];
let [a, b] = await st(); ok('both in the same game', a && b && a.net === 'host' && b.net === 'guest' && a.n.join().replace('*', '') === b.n.join(), JSON.stringify([a, b]));
// run the host's simulation forward a little (background pages do not animate in a headless test), guest follows
const hostRun = async secs => A.evaluate(async s => { for (let i = 0; i < s * 30 && __pit.MT; i++) { __step(1 / 30); if (i % 3 === 0) await new Promise(r => setTimeout(r, 4)); } }, secs);
await hostRun(4); await B.bringToFront(); await B.waitForTimeout(700);
// guest pushes right and sprints: the host must move the guest's player
const x0 = await A.evaluate(() => __pit.MT.P.find(p => p.remote).x);
await B.evaluate(() => { __pit.keys.KeyD = true; __pit.keys.ShiftLeft = true; }); await B.waitForTimeout(500); await A.bringToFront(); await hostRun(1.5); await B.bringToFront(); await B.waitForTimeout(600);
const x1 = await A.evaluate(() => __pit.MT.P.find(p => p.remote).x); const bx = await B.evaluate(() => ({ x: __pit.MT.me.x, q: __pit.NET.game.q, ph: __pit.MT.phase }));
ok('guest input moves their player on the host', x1 > x0 + 1, x0.toFixed(2) + ' → ' + x1.toFixed(2)); ok('guest sees it too', Math.abs(bx.x - x1) < 1.2 && bx.q > 5, JSON.stringify(bx));
await B.evaluate(() => { __pit.keys.KeyD = false; __pit.keys.ShiftLeft = false; }); await B.screenshot({ path: path.join(dir, 'shots', 'online-4-guest.png') });
// guest shoots when it has the ball: hand it over on the host, guest holds SPACE for the ideal time
await A.bringToFront(); await A.evaluate(() => { const M = __pit.MT, g = M.P.find(p => p.remote); g.x = 3; g.z = 4; g.st = 'free'; M.B.state = 'held'; M.B.holder = g; M.off = g.team; M.needClear = false; M.phase = 'live'; M.P.forEach(p => { if (p.team !== g.team) { p.x = -6; p.z = 11; } }); for (let i = 0; i < 4; i++) __step(1 / 30); });
await B.bringToFront(); await B.waitForTimeout(500); const fga0 = await A.evaluate(() => __pit.MT.P.find(p => p.remote).stats.fga);
await B.evaluate(() => { __pit.keys.Space = true; }); await B.waitForTimeout(600); await B.evaluate(() => { __pit.keys.Space = false; }); await B.waitForTimeout(250);
await A.bringToFront(); await hostRun(1.2); const shot = await A.evaluate(() => { const g = __pit.MT.P.find(p => p.remote); return { fga: g.stats.fga, ballState: __pit.MT.B.state, hold: g.shot && g.shot.hold }; });
ok('guest shot registered on the host with the guest\'s own timing', shot.fga === fga0 + 1 && shot.hold > 0.3, JSON.stringify(shot));
// play it out
await A.evaluate(() => { const M = __pit.MT; M.score = [10, 3]; M.P.find(p => p.remote).stats.pts = 6; M.P.find(p => p.remote).stats.fgm = 6; }); 
for (let i = 0; i < 40 && await A.evaluate(() => !!__pit.MT); i++) { await hostRun(6); }
await A.waitForTimeout(600); await A.screenshot({ path: path.join(dir, 'shots', 'online-5-host-results.png') });
await B.bringToFront(); await B.waitForTimeout(4500); await B.screenshot({ path: path.join(dir, 'shots', 'online-6-guest-results.png') });
const ra = await A.evaluate(() => ({ vc: __pit.S.vc, games: __pit.S.life.games, panel: document.querySelector('#panel h2') && document.querySelector('#panel h2').textContent, sent: window.__sent, maxP: window.__maxP }));
const rb = await B.evaluate(() => ({ vc: __pit.S.vc, games: __pit.S.life.games, pts: __pit.S.life.pts, panel: document.querySelector('#panel h2') && document.querySelector('#panel h2').textContent, sent: window.__sent, maxP: window.__maxP, mt: !!__pit.MT }));
ok('host finished and got paid', ra.games === 1 && ra.vc > 600, JSON.stringify(ra)); ok('guest finished and got paid', rb.games === 1 && rb.vc > 600 && !rb.mt, JSON.stringify(rb));
console.log(errs ? 'ERRORS ' + errs : 'NO ERRORS'); await browser.close(); srv.close();
