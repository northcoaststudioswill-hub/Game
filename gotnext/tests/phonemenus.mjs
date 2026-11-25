// Every menu on a phone, portrait and landscape: nothing off screen, every button big enough to tap. node tests/phonemenus.mjs
import { createRequire } from 'module'; const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT || '/opt/node-tools/node_modules/playwright/index.js');
import path from 'path'; import { fileURLToPath } from 'url';
const dir = path.dirname(fileURLToPath(import.meta.url));
const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader'] }); const VP = process.argv[2] === 'land' ? { width: 844, height: 390 } : { width: 390, height: 844 }; const ctx = await b.newContext({ viewport: VP, hasTouch: true, isMobile: true, deviceScaleFactor: 1 });
await ctx.addInitScript(() => { window.requestAnimationFrame = cb => { window.__raf = cb; return 1; }; window.__now = 0; window.__tick = n => { for (let i = 0; i < n; i++) { window.__now += 16.67; const f = window.__raf; window.__raf = null; if (f) f(window.__now); } }; });
const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message)); let fails = 0; const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++; };
await p.goto('file://' + (process.env.GN_HTML || path.resolve(dir, '..', 'index.html'))); await p.evaluate(() => window.__tick(60));
const audit = (name, open) => p.evaluate(([name, open]) => { const P = __pit; try { P.ev(open); } catch (e) { return { name, err: e.message }; } window.__tick(3);
  const root = P.UI.cur ? document.getElementById('panel') : document.getElementById('title'), W_ = innerWidth, out = { name, small: [], off: [], n: 0 };
  const pb = root.querySelector('.pb'); out.hscroll = document.documentElement.scrollWidth > W_ + 1 || (pb && pb.scrollWidth > pb.clientWidth + 2);
  for (const e of root.querySelectorAll('.btn, input[type=range], select, .card[data-k], .sw[data-k]')) { if (e.offsetParent === null) continue; const r = e.getBoundingClientRect(); if (!r.width) continue; out.n++; const t = (e.textContent || e.type || '').trim().slice(0, 16);
    if (r.height < 30 || (r.width < 30 && e.type !== 'range')) out.small.push(t + ' ' + Math.round(r.width) + 'x' + Math.round(r.height)); if (r.left < -1 || r.right > W_ + 1) out.off.push(t + ' ' + Math.round(r.left) + '..' + Math.round(r.right)); }
  out.scrolls = !pb || getComputedStyle(pb).overflowY !== 'visible' || pb.scrollHeight <= innerHeight; return out; }, [name, open]);
await p.tap('#titleBtns .btn'); await p.evaluate(() => window.__tick(5));
const R = [];
R.push(await audit('builder', '0'));
await p.tap('#panel .pf .btn'); await p.evaluate(() => { window.__tick(10); __pit.S.vc = 50000; __pit.S.rep = 9000; });
const menus = [['title', "uiClose(); disposeScene(scene); scene = null; W = null; titleScene(); uiTitle()"], ['back to block', "hideTitle && 0; document.getElementById('title').style.display='none'; enterWorld('hub', 0, 9, Math.PI)"]];
for (const t of ['builds', 'attrs', 'badges', 'moves', 'crew', 'ach', 'road', 'opt']) menus.push(['player:' + t, `uiClose(); uiPlayer('${t}')`]);
menus.push(['shop', 'uiClose(); uiShop()'], ['closet', 'uiClose(); uiShop(true)'], ['crib upgrades', 'uiClose(); uiCrib()'], ['mode', 'uiClose(); uiMode(MODES[0])'], ['kiosk', 'uiClose(); uiKiosk()'], ['link', 'uiClose(); uiHomie()'], ['rack', 'uiClose(); uiRack()'], ['pause', 'uiClose(); uiPause()'],
  ['nexx', 'uiClose(); uiNexx()'], ['nexx merch', 'uiClose(); uiNexxMerch()'], ['bones', 'uiClose(); uiBones(false)'], ['book', 'uiClose(); uiBook()'], ['brennick', 'uiClose(); uiKael()'], ['aaron', 'uiClose(); uiErin()'], ['louie', 'uiClose(); uiLouie()'], ['ladder', 'uiClose(); uiLadder(0)'],
  ['drills', "uiClose(); (typeof uiDrills === 'function' ? uiDrills : uiDrillBoard)()"], ['contracts', "uiClose(); (typeof uiContracts === 'function' ? uiContracts : uiDaily)()"], ['home sets', "uiClose(); uiHomeSets()"], ['home lot', "uiClose(); uiHomeLot()"]);
for (const t of ['profile', 'build', 'moves', 'anim', 'play', 'reel']) menus.push(['dev:' + t, `uiClose(); DEV.tab = '${t}'; uiDev('hub')`]);
menus.push(['anim lab', 'uiClose(); alabOpen()']);
for (const [n, o] of menus) R.push(await audit(n, o));
let bad = 0; for (const r of R) { const prob = r.err || r.hscroll || (r.small && r.small.length) || (r.off && r.off.length) || r.scrolls === false; if (prob) bad++; if (prob) console.log('ISSUE ' + r.name.padEnd(16) + (r.err ? 'ERROR ' + r.err : `${r.n} controls` + (r.hscroll ? ' · scrolls sideways' : '') + (r.scrolls === false ? ' · cannot scroll' : '') + (r.small.length ? ` · small: ${r.small.slice(0, 5).join(' | ')}${r.small.length > 5 ? ' +' + (r.small.length - 5) : ''}` : '') + (r.off.length ? ` · off screen: ${r.off.slice(0, 4).join(' | ')}` : ''))); }
ok(bad === 0, `${VP.width}x${VP.height}: ${R.length} menus, ${bad} with a layout problem`);
console.log(errs.length ? errs.join(' | ') : 'no page errors', fails ? `· ${fails} FAILED` : '· ALL PASS'); await b.close();
