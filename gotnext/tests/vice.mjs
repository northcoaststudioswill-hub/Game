// Trey's Bones, Mark's Book (bets, parlays, watching a game), Bottie at home, home activities, home menus. node tests/vice.mjs
import { createRequire } from 'module'; const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT || '/opt/node-tools/node_modules/playwright/index.js');
import path from 'path'; import { fileURLToPath } from 'url';
const dir = path.dirname(fileURLToPath(import.meta.url));
const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader'] }); const ctx = await b.newContext({ viewport: { width: 960, height: 540 } });
await ctx.addInitScript(() => { window.requestAnimationFrame = cb => { window.__raf = cb; return 1; }; window.__now = 0; window.__tick = n => { for (let i = 0; i < n; i++) { window.__now += 16.67; const f = window.__raf; window.__raf = null; if (f) f(window.__now); } }; });
const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message)); let fails = 0; const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++; };
await p.goto('file://' + (process.env.GN_HTML || path.resolve(dir, '..', 'index.html'))); await p.evaluate(() => window.__tick(60));
await p.click('#titleBtns .btn'); await p.evaluate(() => window.__tick(5)); await p.click('#panel .pf .btn'); await p.evaluate(() => window.__tick(10));
const btn = t => p.evaluate(t => { const b = Array.from(document.querySelectorAll('#panel .btn')).find(b => b.textContent.startsWith(t)); if (b && !b.disabled) { b.click(); window.__tick(2); return true; } return false; }, t);
const btns = () => p.evaluate(() => Array.from(document.querySelectorAll('#panel .btn')).map(b => b.textContent));
// --- the house edge at the bones (pure rules, 40,000 hands each) ---
let r = await p.evaluate(() => { const P = __pit, out = {}; for (const [T, st] of [[13, 9], [13, 10], [13, 11], [13, 12], [21, 17], [21, 18], [21, 19], [21, 20]]) { let s = 0; for (let i = 0; i < 40000; i++) s += P.bonesSim(T, st); out[T + '@' + st] = +(s / 40000 * 100).toFixed(1); } return out; });
ok(Math.max(r['13@10'], r['13@11'], r['13@12']) < 0.5 && Math.max(r['13@12'], r['13@11']) > -7 && Math.max(r['21@19'], r['21@20']) < 0.5 && Math.max(r['21@19'], r['21@20']) > -7, `totals games, your return per 100 HC staked by where you stand: ${JSON.stringify(r)} (negative = house edge)`);
r = await p.evaluate(() => { const P = __pit; return [P.bonesHand([6, 6, 6, 6, 6])[0], P.bonesHand([2, 2, 2, 5, 5])[0], P.bonesHand([1, 2, 3, 4, 5])[0], P.bonesHand([4, 4, 1, 2, 6])[0]]; });
ok(r.join() === '7,5,4,1', `poker bones hands rank: five of a kind ${r[0]}, full house ${r[1]}, straight ${r[2]}, pair ${r[3]}`);
// --- a hand of each game at Trey's ---
r = await p.evaluate(() => { const P = __pit, W = P.W; return { holo: (W.holo || []).length, trey: W.spots.some(s => /TREY/.test(s.label)), aaron: W.spots.some(s => /AARON/.test(s.label)), erin: W.spots.some(s => /ERIN/.test(s.label)) }; });
ok(r.holo === 16 && r.trey && r.aaron && !r.erin, `the Block: ${r.holo} holodice at Trey's table (eight yours, eight his); the stand is AARON'S (no "Erin" on screen: ${!r.erin})`);
await p.evaluate(() => { __pit.S.vc = 5000; __pit.uiBones(false); window.__tick(2); });
const vc0 = await p.evaluate(() => __pit.S.vc);
const table = () => p.evaluate(() => { const T = __pit.W.bones; window.__tick(90); return { on: T.on, you: T.you.filter(h => h.val && h.sp.visible).map(h => h.val), him: T.him.filter(h => h.val && h.sp.visible).map(h => h.val), cam: !!__pit.W.camO, side: document.getElementById('panel').className }; });
await btn('THIRTEEN'); let bl = await btns(); let tb = await table();
ok(bl.includes('ROLL') && bl.some(t => t.startsWith('STAND ON')) && tb.on && tb.you.length === 1 && tb.cam && tb.side === 'clear', `Thirteen is played on the table: your first die shows ${tb.you[0]} on a holodice, the camera is on the table, the menu is a slim bar (${bl.join(' · ')})`);
for (let i = 0; i < 12 && await btn('ROLL'); i++) { const s = await p.evaluate(() => { const m = document.querySelector('#panel h3').textContent.match(/YOU (\d+)/); return m ? +m[1] : 99; }); if (s >= 11) { await btn('STAND ON'); break; } }
tb = await table(); r = await p.evaluate(() => ({ vc: __pit.S.vc, v: __pit.vice().bones, done: /AGAIN/.test(document.querySelector('#panel').textContent) }));
ok(r.done && Math.abs(r.vc - vc0) % 50 === 0 && r.v === r.vc - vc0 && tb.you.length >= 2, `the hand settles on the dice: yours ${tb.you.join('+')}, Trey's ${tb.him.join('+') || '—'} → ${r.vc - vc0 >= 0 ? '+' : ''}${r.vc - vc0} HC`);
await btn('OTHER GAMES'); await btn('POKER BONES'); tb = await table(); bl = await btns();
await p.evaluate(() => { Array.from(document.querySelectorAll('#panel .btn'))[0].click(); window.__tick(2); }); const held = await p.evaluate(() => __pit.W.bones.you.filter(h => h.held).length);
await btn('THROW THE REST'); const pk = await p.evaluate(() => document.querySelector('#panel .card.sel p').textContent); const tb2 = await table();
ok(tb.you.length === 5 && held === 1 && tb2.him.length === 5 && /against/.test(pk), `Poker Bones: five dice on your row, the one you keep lifts and turns green, Trey's five land: "${pk}"`);
await btn('OTHER GAMES'); await btn('HIGH BONES'); bl = await btns(); await btn('PRESS'); const hb = await p.evaluate(() => document.querySelector('#panel .card.sel p').textContent);
ok(bl.some(t => t.startsWith('PRESS')) && /against/.test(hb), `High Bones: stand or press, then "${hb}"`);
await p.evaluate(() => window.__tick(60)); await p.screenshot({ path: path.join(dir, 'shots', 'bones.png'), timeout: 300000 });
r = await p.evaluate(() => { __pit.uiClose(); window.__tick(3); const T = __pit.W.bones; return { on: T.on, cam: !!__pit.W.camO }; }); ok(!r.on && !r.cam, 'leaving the table clears the dice and gives the camera back');
r = await p.evaluate(() => { const P = __pit; P.vice().bones = 1500; P.uiBones(false); window.__tick(2); Array.from(document.querySelectorAll('#panel .btn')).find(b => b.textContent === 'THIRTEEN').click(); window.__tick(2); const t = document.querySelector('#panel .card.sel p').textContent; P.vice().bones = 0; return t; });
ok(/cleaned me out/.test(r), `up 1,500 in a day and Trey closes: "${r.slice(0, 44)}…"`);
// --- the book ---
await p.evaluate(() => { const P = __pit; P.S.vc = 3000; P.uiClose(); P.uiBook(); window.__tick(2); });
r = await p.evaluate(() => { const B = __pit.book(), g = B.slate.games; return { n: g.length, ml: g.map(x => x.ml), sp: g.map(x => x.sp), pr: g.map(x => x.pr), names: g.map(x => x.t[0].n + ' v ' + x.t[1].n) }; });
ok(r.n === 3 && r.ml.every(m => m[0] > 1 && m[1] > 1 && (1 / m[0] + 1 / m[1]) > 1.02), `a slate of ${r.n}: ${r.names[0]} (${r.ml[0].join(' / ')}, spread ${r.sp[0]}), …; the odds carry Mark's cut`);
// a three-leg parlay: winner in game 1, spread in game 2, star's points in game 3
r = await p.evaluate(() => { const c = Array.from(document.querySelectorAll('#panel .card')); c[0].querySelectorAll('.btn')[0].click(); window.__tick(1); const c2 = Array.from(document.querySelectorAll('#panel .card')); c2[1].querySelectorAll('.btn')[2].click(); window.__tick(1); const c3 = Array.from(document.querySelectorAll('#panel .card')); c3[2].querySelectorAll('.btn')[4].click(); window.__tick(1);
  const slip = Array.from(document.querySelectorAll('#panel .card')).find(x => /BET SLIP/.test(x.textContent)).textContent; const vc = __pit.S.vc; Array.from(document.querySelectorAll('#panel .btn')).find(b => b.textContent.startsWith('PLACE IT')).click(); window.__tick(2); const sl = __pit.book().slate.slip; return { slip: slip.slice(0, 60), paid: vc - __pit.S.vc, legs: sl && sl.legs.length, odds: sl && sl.odds }; });
ok(r.legs === 3 && r.paid === 50 && r.odds > 3, `parlay placed: 3 legs at ${r.odds}, ${r.paid} HC staked ("${r.slip}…")`);
// watch game 1 (an all-AI game in the real engine), sim the other two
await btn('WATCH IT');
r = await p.evaluate(() => { const P = __pit, M = P.MT; if (!M) return { mt: false }; const out = { mt: true, spectate: M.spectate, users: M.P.filter(q => q.user).length, n: M.P.length }; let i = 0; for (; i < 60 * 60 * 6 && P.MT; i += 30) window.__tick(30); out.secs = Math.round(i / 60); out.ended = !P.MT; return out; });
ok(r.mt && r.spectate && r.users === 0 && r.ended, `WATCH IT: an all-AI game (${r.n} players, nobody controlled) played to the end in ${r.secs} s of game time`);
await p.waitForTimeout(500); await p.evaluate(() => window.__tick(30));
r = await p.evaluate(() => { const g = __pit.book().slate.games[0]; return g.res; }); ok(r && Math.max(r.sc[0], r.sc[1]) >= 11 && !r.sim, `the result came from the game you watched: ${r && r.sc.join(' — ')}, stars scored ${r && r.star.join(' and ')}`);
await p.evaluate(() => { if (!document.querySelector('#panel h2') || document.querySelector('#panel h2').textContent !== "MARK'S BOOK") { __pit.uiBook(); window.__tick(2); } });
await btn('SIM IT'); await btn('SIM IT');
await p.screenshot({ path: path.join(dir, 'shots', 'book.png'), timeout: 300000 });
r = await p.evaluate(() => { const B = __pit.book(), sl = B.slate.slip, gs = B.slate.games; const each = sl.legs.map(L => __pit.bkLegWon(gs[L.g], L)); return { done: sl.done, won: sl.won, each, pay: sl.pay, rec: B.w + '-' + B.l, vc: __pit.S.vc }; });
ok(r.done && r.won === r.each.every(Boolean) && (r.won ? r.pay > 150 : r.pay === 0), `ticket settled: legs ${r.each.map(x => x ? 'hit' : 'miss').join(', ')} → ${r.won ? 'cashed ' + r.pay + ' HC' : 'dead'}; record ${r.rec}`);
// --- home: menus, Bottie, activities ---
await p.evaluate(() => { const P = __pit; P.uiClose(); P.S.vc = 20000; P.S.rep = 9000; P.enterWorld('crib', 0, 19.2, Math.PI); window.__tick(30); P.uiCrib(); window.__tick(2); });
r = await p.evaluate(() => { const cards = Array.from(document.querySelectorAll('#panel .card')); const names = cards.map(c => (c.querySelector('h3') || {}).textContent || ''); const bot = cards.find(c => /Lil Bottie/.test(c.textContent)); const buy = bot && bot.querySelector('.btn'); let bought = 0; const vc = __pit.S.vc; if (buy) { buy.click(); window.__tick(2); bought = vc - __pit.S.vc; } let clicks = 0; for (const b of Array.from(document.querySelectorAll('#panel .btn'))) { if (b.textContent !== '✕' && !b.disabled) clicks++; } return { n: names.length, bot: !!bot, bought, clicks, tier: __pit.S.crib.bottie }; });
ok(r.bot && r.bought === 3500 && r.tier === 1, `CRIB UPGRADES menu: ${r.n} cards, ${r.clicks} live buttons; bought Lil Bottie (${r.bought} HC)`);
r = await p.evaluate(() => { const P = __pit; P.uiClose(); P.enterWorld('crib', 0, 19.2, Math.PI); window.__tick(30); const W = P.W, sp = W.spots.find(s => s.label === 'BOTTIE'); const bot = W.npcs.find(n => n.cast === 'bottie'); const vc = P.S.vc, rep = P.S.rep; sp.fn(); window.__tick(2); const menu = Array.from(document.querySelectorAll('#panel .btn')).map(b => b.textContent);
  Array.from(document.querySelectorAll('#panel .btn')).find(b => b.textContent === 'POST TO THE FEED').click(); window.__tick(2); sp.fn(); window.__tick(2); Array.from(document.querySelectorAll('#panel .btn')).find(b => b.textContent === 'DROP A TRACK').click(); window.__tick(2); const bar = document.querySelector('#panel p').textContent; P.uiClose();
  return { bot: !!bot && !!bot.rig.spec.bot, menu, vc: P.S.vc - vc, rep: P.S.rep - rep, bar }; });
ok(r.bot && r.vc === 80 && r.rep >= 20, `Bottie is at your crib in his own body: ${r.menu.join(' · ')}; the feed paid ${r.vc} HC; his track: "${r.bar}"`);
r = await p.evaluate(() => { const P = __pit, S = P.S, out = {}; const L = P.homeLevelN(); const t0 = document.querySelectorAll('.toast').length; P.homeUse('grill', {}); out.lockedAtL1 = L < 3 && !P.W.party;
  S.home.items = []; for (let i = 0; i < 12; i++) S.home.items.push({ i: ['sofa', 'tv', 'arcade', 'grill', 'dj', 'fire', 'statue', 'car', 'holo', 'case', 'kicks', 'pool'][i], x: -20 + i * 0.1, z: 5, r: 0 }); out.lvl = P.homeLevelN();
  const rep = S.rep; P.homeUse('grill', {}); out.cook = S.rep - rep; P.homeUse('bed', {}); out.nap = S.boosts.includes('nap'); const bx = S.bxp.P + S.bp.P * 100; P.homeUse('bag', {}); out.bag = S.bxp.P + S.bp.P * 100 - bx; P.homeUse('minihoop', {}); window.__tick(2); out.trick = (document.querySelector('#panel p') || {}).textContent; P.uiClose();
  const rep2 = S.rep; P.homeUse('grill', {}); out.again = S.rep - rep2; P.homeUse('holodice', {}); window.__tick(2); out.bones = (document.querySelector('#panel h2') || {}).textContent; P.uiClose(); return out; });
ok(r.lockedAtL1 && r.lvl >= 4 && r.cook >= 20 && r.nap && r.bag === 25 && /Off the fence/.test(r.trick || '') && r.again === 0 && r.bones === 'BONES AT HOME', `home activities: cookout locked at level 1, open at level ${r.lvl} (+${r.cook} Respect, once a day), nap boost, bag +${r.bag} XP, trick shot ("${(r.trick || '').slice(0, 50)}…"), ${r.bones}`);
await p.evaluate(() => { const P = __pit; P.uiClose(); P.enterWorld('hub', -9.2, 8.6, Math.PI); window.__tick(40); P.W.me.face = Math.PI; window.__tick(20); });
await p.screenshot({ path: path.join(dir, 'shots', 'trey.png'), timeout: 300000 });
await p.evaluate(() => { const P = __pit; P.W.me.x = 3.6; P.W.me.z = -8.2; P.W.me.face = Math.PI; window.__tick(40); });
await p.screenshot({ path: path.join(dir, 'shots', 'bottie.png'), timeout: 300000 });
console.log(errs.length ? errs.join(' | ') : 'no page errors', fails ? `· ${fails} FAILED` : '· ALL PASS'); await b.close();
