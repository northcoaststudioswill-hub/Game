// Every menu, driven by a controller: can the d-pad reach every control, and is anything clickable left out? node tests/padmenus.mjs
import { createRequire } from 'module'; const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT || '/opt/node-tools/node_modules/playwright/index.js');
import path from 'path'; import { fileURLToPath } from 'url';
const dir = path.dirname(fileURLToPath(import.meta.url));
const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader'] }); const ctx = await b.newContext({ viewport: { width: 1280, height: 720 } });
await ctx.addInitScript(() => { window.requestAnimationFrame = cb => { window.__raf = cb; return 1; }; window.__now = 0; window.__tick = n => { for (let i = 0; i < n; i++) { window.__now += 16.67; const f = window.__raf; window.__raf = null; if (f) f(window.__now); } }; });
const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message)); let fails = 0; const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++; };
await p.goto('file://' + path.resolve(dir, '..', 'index.html')); await p.evaluate(() => window.__tick(60));
const audit = (name, open) => p.evaluate(([name, open]) => { const P = __pit; try { P.ev(open); } catch (e) { return { name, err: e.message }; } window.__tick(3);
  const f = P.call('focusables'), n = f.length; if (!n) return { name, n: 0 };
  const seen = new Set([0]), q = [0]; while (q.length) { const i = q.shift(); for (const m of ['U', 'D', 'L', 'R']) { const j = P.call('navDir', f, i, m); if (!seen.has(j)) { seen.add(j); q.push(j); } } }
  const root = P.UI.cur ? document.getElementById('panel') : document.getElementById('title');
  const missed = Array.from(root.querySelectorAll('[data-k],select,input,button')).filter(e => e.offsetParent !== null && !f.includes(e) && !e.disabled && (e.dataset.k === undefined || e.dataset.k !== '')).map(e => e.tagName + ':' + (e.textContent || e.type || '').slice(0, 18));
  const unreach = f.map((e, i) => seen.has(i) ? null : (e.textContent || e.type || '').slice(0, 20)).filter(Boolean);
  return { name, n, unreach, missed }; }, [name, open]);
await p.click('#titleBtns .btn'); await p.evaluate(() => window.__tick(5));
const R = [];
R.push(await audit('builder', '0'));
await p.click('#panel .pf .btn'); await p.evaluate(() => { window.__tick(10); __pit.S.vc = 50000; __pit.S.rep = 9000; });
const menus = [['title', "uiClose(); disposeScene(scene); scene = null; W = null; titleScene(); uiTitle()"], ['back to block', "hideTitle && 0; document.getElementById('title').style.display='none'; enterWorld('hub', 0, 9, Math.PI)"]];
for (const t of ['builds', 'attrs', 'badges', 'moves', 'crew', 'ach', 'road', 'opt']) menus.push(['player:' + t, `uiClose(); uiPlayer('${t}')`]);
menus.push(['shop', 'uiClose(); uiShop()'], ['closet', 'uiClose(); uiShop(true)'], ['crib upgrades', 'uiClose(); uiCrib()'], ['mode', 'uiClose(); uiMode(MODES[0])'], ['kiosk', 'uiClose(); uiKiosk()'], ['link', 'uiClose(); uiHomie()'], ['rack', 'uiClose(); uiRack()'], ['pause', 'uiClose(); uiPause()'],
  ['nexx', 'uiClose(); uiNexx()'], ['nexx merch', 'uiClose(); uiNexxMerch()'], ['bones', 'uiClose(); uiBones(false)'], ['book', 'uiClose(); uiBook()'], ['brennick', 'uiClose(); uiKael()'], ['aaron', 'uiClose(); uiErin()'], ['louie', 'uiClose(); uiLouie()'], ['ladder', 'uiClose(); uiLadder(0)'],
  ['drills', "uiClose(); (typeof uiDrills === 'function' ? uiDrills : uiDrillBoard)()"], ['contracts', "uiClose(); (typeof uiContracts === 'function' ? uiContracts : uiDaily)()"], ['home sets', "uiClose(); uiHomeSets()"], ['home lot', "uiClose(); uiHomeLot()"]);
for (const t of ['profile', 'build', 'moves', 'anim', 'play', 'reel']) menus.push(['dev:' + t, `uiClose(); DEV.tab = '${t}'; uiDev('hub')`]);
menus.push(['anim lab', 'uiClose(); alabOpen()']);
for (const [n, o] of menus) R.push(await audit(n, o));
let bad = 0; for (const r of R) { const prob = r.err || (r.unreach && r.unreach.length) || (r.missed && r.missed.length); if (prob) bad++; console.log((prob ? 'ISSUE ' : 'ok    ') + r.name.padEnd(16) + (r.err ? 'ERROR ' + r.err : `${r.n} controls` + (r.unreach && r.unreach.length ? ` · unreachable: ${r.unreach.slice(0, 6).join(' | ')}${r.unreach.length > 6 ? ' +' + (r.unreach.length - 6) : ''}` : '') + (r.missed && r.missed.length ? ` · not focusable: ${r.missed.slice(0, 6).join(' | ')}${r.missed.length > 6 ? ' +' + (r.missed.length - 6) : ''}` : ''))); }
ok(bad === 0, `${R.length} menus audited, ${bad} with controls a controller cannot reach`);
console.log(errs.length ? errs.join(' | ') : 'no page errors', fails ? `· ${fails} FAILED` : '· ALL PASS'); await b.close();
