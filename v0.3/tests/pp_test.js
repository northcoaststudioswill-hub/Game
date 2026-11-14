/* Patch & Plate + console checks at iPhone 16 Pro Max size (440x956 CSS px).
   Run from the repo root:  node v0.3/tests/pp_test.js            (screenshots go to v0.3/playtest/)
   What it checks:
   1. All four cartridges boot from the shelf with no page errors.
   2. A bot plays Patch & Plate days start to finish through the real controls (D-pad, A, B),
      with the game loop stepped by hand so a day takes seconds instead of minutes.
   3. Text on every Patch & Plate screen: inside the screen, not overlapping, not squeezed.
   4. Putting the phone down pauses and saves the day; CONTINUE picks it up after a reload. */
const { chromium } = require('playwright');
const path = require('path'), fs = require('fs');
const FILE = path.resolve(__dirname, '../games/pocket-lantern_2026-11-14_v21_wip.html');
const SHOTS = path.resolve(__dirname, '../playtest');
const URL = 'file://' + FILE + '?dev';
const fails = [], notes = [];
const check = (ok, what) => { (ok ? notes : fails).push((ok ? 'ok   ' : 'FAIL ') + what); };

/* runs inside the page: a hand-cranked game loop and a bot that drives the controls */
const PAGE_KIT = () => {
  __g.ev("window.__step=(dt)=>{update(dt);g.setTransform(2,0,0,2,0,0);g.imageSmoothingEnabled=false;if(TBON)TBX=[];draw();if(TBON){TBL=TBX;TBX=null}for(const k in keys)prev[k]=keys[k]}");
  __g.ev("window.__upd=(dt)=>{update(dt);for(const k in keys)prev[k]=keys[k]}");
  const K = __g.keys, PP = __g.PP._;
  const clear = () => { K.up = K.down = K.left = K.right = 0; };
  window.__tap = (k, n = 1) => { for (let i = 0; i < n; i++) { K[k] = 1; __step(1 / 60); K[k] = 0; __step(1 / 60); } };
  const DIRS = [[1, 0, 'right'], [-1, 0, 'left'], [0, 1, 'down'], [0, -1, 'up']];
  function firstStep(L, goals) {
    const P = L.P, key = (x, y) => x + ',' + y, seen = new Map([[key(P.x, P.y), null]]), q = [[P.x, P.y]];
    while (q.length) {
      const [x, y] = q.shift();
      if (goals.some(([gx, gy]) => gx === x && gy === y)) {
        let c = key(x, y), prev = seen.get(c), step = null;
        while (prev) { step = c; c = prev; prev = seen.get(c); }
        if (!step) return 'here';
        const [sx, sy] = step.split(',').map(Number);
        return DIRS.find(d => d[0] === sx - P.x && d[1] === sy - P.y)[2];
      }
      for (const [dx, dy] of DIRS) { const nx = x + dx, ny = y + dy, k2 = key(nx, ny); if (!seen.has(k2) && PP.walkable(nx, ny)) { seen.set(k2, key(x, y)); q.push([nx, ny]); } }
    }
    return null;
  }
  let phase = 0;
  window.__botTick = () => {
    const G = PP.G; if (G.s !== 'play') return;
    const L = G.L, P = L.P;
    if (phase) { K.a = 0; K.b = 0; phase = 0; return; }
    clear();
    if (P.mv > 0) return;
    const t = PP.plan();
    if (!t) return;
    if (t.toss) { K.b = 1; phase = 1; return; }
    const goals = DIRS.map(([dx, dy]) => [t.x - dx, t.y - dy]).filter(([x, y]) => PP.walkable(x, y));
    const s = firstStep(L, goals);
    if (s === 'here') {
      const fx = t.x - P.x, fy = t.y - P.y;
      if (P.fx === fx && P.fy === fy) { K.a = 1; phase = 1; }
      else K[DIRS.find(d => d[0] === fx && d[1] === fy)[2]] = 1;
    } else if (s) K[s] = 1;
  };
  /* play the current day to the results screen; returns frames used */
  window.__playDay = (maxSec = 400) => {
    let f = 0;
    while (PP.G.s === 'play' && f < maxSec * 60) { __botTick(); (f % 15 === 0 ? __step : __upd)(1 / 60); f++; }
    clear(); K.a = K.b = 0;
    return f;
  };
};

async function main() {
  fs.mkdirSync(SHOTS, { recursive: true });
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 440, height: 956 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', e => errs.push('pageerror: ' + e.message));
  page.on('console', m => { if (m.type() === 'error') errs.push('console: ' + m.text()); });
  await page.goto(URL); await page.waitForTimeout(800);
  const ev = s => page.evaluate(s => window.__g.ev(s), s);
  const press = async k => { await page.keyboard.down(k); await page.waitForTimeout(90); await page.keyboard.up(k); await page.waitForTimeout(60); };

  /* 1. the shelf and all four cartridges */
  const H = await ev('H'); notes.push('note screen height (logical): ' + H);
  await page.screenshot({ path: path.join(SHOTS, 'pp_00_shelf.png') });
  const carts = await page.$$eval('.cart', b => b.map(x => { const r = x.getBoundingClientRect(); return { t: x.textContent.trim(), w: r.width, h: r.height, right: r.right }; }));
  check(carts.length === 4 && carts.every(c => c.right <= 440), 'shelf shows 4 cartridges inside the screen: ' + carts.map(c => c.t + ' ' + Math.round(c.w) + 'x' + Math.round(c.h)).join(', '));
  const want = ['intro', 'ko', 'g3', 'pp'];
  for (let i = 0; i < 4; i++) {
    const before = errs.length;
    await ev(`cartPick(${i})`); await page.waitForTimeout(2000); await press('z'); await page.waitForTimeout(900);
    const st = await ev('state');
    const newErr = errs.slice(before).filter(e => !/ERR_FILE_NOT_FOUND|Failed to load resource/.test(e));
    check(String(st).startsWith(want[i]) && !newErr.length, `cartridge ${i + 1} boots (state ${st})` + (newErr.length ? ' errors: ' + newErr.join(' | ') : ''));
    await page.screenshot({ path: path.join(SHOTS, `pp_0${i + 1}_boot_cart${i + 1}.png`) });
    if (i < 3) { await ev('eject()'); await page.waitForTimeout(300); }
  }

  /* 2. take over the loop, then walk the menus to day 1 */
  await page.evaluate(() => { window.requestAnimationFrame = () => 0; });
  await page.waitForTimeout(100);
  await page.evaluate(PAGE_KIT);
  const pp = s => page.evaluate(s => eval(s), s);
  const shot = async (name) => { await pp('__step(1/60)'); await page.screenshot({ path: path.join(SHOTS, name) }); };
  /* text audit: every text box drawn this frame must sit inside the screen, not overlap another, not be squeezed */
  const audit = async (label) => {
    const r = await page.evaluate(() => { __g.tb.on(true); __step(1 / 60); const b = __g.tb.last(); __g.tb.on(false); return { b, H: __g.ev('H') }; });
    const bad = [];
    for (const t of r.b) {
      if (t.x < -0.5 || t.y < -0.5 || t.x + t.w > 240.5 || t.y + t.h > r.H + .5) bad.push('off-screen "' + t.s + '"');
      if (t.sq) bad.push('squeezed "' + t.s + '"');
    }
    for (let i = 0; i < r.b.length; i++) for (let j = i + 1; j < r.b.length; j++) {
      const a = r.b[i], c = r.b[j], ox = Math.min(a.x + a.w, c.x + c.w) - Math.max(a.x, c.x), oy = Math.min(a.y + a.h, c.y + c.h) - Math.max(a.y, c.y);
      if (ox > 1 && oy > 1) bad.push('overlap "' + a.s + '" / "' + c.s + '"');
    }
    check(!bad.length, `text audit: ${label} (${r.b.length} boxes)` + (bad.length ? ': ' + bad.join('; ') : ''));
  };
  await shot('pp_10_title.png'); await audit('title');
  await pp("__tap('a')");
  check(await pp('__g.PP._.G.s') === 'stand', 'title PLAY opens the stand');
  await shot('pp_11_stand.png'); await audit('stand (new save)');
  await pp("__tap('a')");
  check(await pp('__g.PP._.G.s') === 'intro', 'day 1 opens its intro card');
  await shot('pp_12_intro_day1.png'); await audit('intro day 1');
  await pp("__tap('a')");
  check(await pp('__g.PP._.G.s') === 'play', 'A opens the stand for the day');

  /* a little play, then screenshots of a working day */
  await pp('for(let i=0;i<60*14;i++){__botTick();__upd(1/60)}');
  await shot('pp_13_day1_playing.png'); await audit('day 1 playing');
  await pp('for(let i=0;i<60*12;i++){__botTick();__upd(1/60)}');
  await shot('pp_14_day1_later.png');

  /* 4. put the phone down mid-day */
  await page.evaluate(() => { Object.defineProperty(document, 'hidden', { configurable: true, get: () => true }); document.dispatchEvent(new Event('visibilitychange')); });
  const afterHide = await pp("({s:__g.PP._.G.s,run:!!JSON.parse(localStorage.getItem('patchplate-v1')).run,coins:__g.PP._.G.L.coins,t:__g.PP._.G.L.t})");
  check(afterHide.s === 'pause' && afterHide.run, 'phone put down: the day pauses and saves (' + JSON.stringify(afterHide) + ')');
  await page.evaluate(() => { Object.defineProperty(document, 'hidden', { configurable: true, get: () => false }); });
  await shot('pp_15_pause.png'); await audit('pause');
  await pp("__tap('a')");
  const f1 = await pp('__playDay()');
  const r1 = await pp('__g.PP._.G.res');
  check(r1 && r1.st >= 1, `day 1 finished by the bot in ${(f1 / 60).toFixed(0)}s of game time: ${r1 && r1.st} stars, ${r1 && r1.coins} coins, served ${r1 && r1.served}/${r1 && r1.n}`);
  await pp('for(let i=0;i<60*2;i++)__upd(1/60)');
  await shot('pp_16_day1_done.png'); await audit('results');

  /* more days: unlock them all and let the bot play a spread */
  await pp('__g.PP._.setDay(12)');
  const results = [];
  for (const d of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]) {
    const r = await page.evaluate(d => { const PP = __g.PP._; PP.startDay(d); PP.G.s = 'play'; const f = __playDay(); const R = PP.G.res; return { d: d + 1, sec: Math.round(f / 60), st: R && R.st, coins: R && R.coins, goal: PP.G.L.goal, served: R && R.served, n: R && R.n, s: PP.G.s }; }, d);
    results.push(r);
    check(r.s === 'done', `day ${r.d}: bot finished in ${r.sec}s, ${r.st} stars, ${r.coins} coins (goals ${r.goal.join('/')}), served ${r.served}/${r.n}`);
    if (d === 3 || d === 7 || d === 11) {
      await page.evaluate(d => { const PP = __g.PP._; PP.startDay(d); PP.G.s = 'play'; for (let i = 0; i < 60 * 40; i++) { __botTick(); __upd(1 / 60); } }, d);
      await shot(`pp_2${d}_day${d + 1}_playing.png`); await audit('day ' + (d + 1) + ' playing');
      await pp('__playDay()');
    }
  }

  /* the other screens */
  await pp("__g.PP._.G.s='stand';__g.PP._.G.si=0");
  await shot('pp_30_stand_all_days.png'); await audit('stand (all days)');
  await pp("__g.PP._.SV.coins=500;__g.PP._.G.s='shop';__g.PP._.G.ui=0");
  await pp("__tap('a')");
  check(await pp('__g.PP._.SV.up.plots') === 1, 'upgrades: buying MORE PLOTS works');
  await shot('pp_31_shop.png'); await audit('upgrades');
  await pp("__g.PP._.G.s='book';__g.PP._.G.bookFrom='stand';__g.PP._.G.bp=0");
  await shot('pp_32_recipes.png'); await audit('recipes');
  await pp("__g.PP._.G.bp=1");
  await shot('pp_33_kitchen.png'); await audit('kitchen page');
  await pp("__g.PP._.startDay(11)");
  await shot('pp_34_intro_day12.png'); await audit('intro day 12');

  /* 4b. CONTINUE after a reload */
  await pp("__g.PP._.G.s='play';for(let i=0;i<60*20;i++){__botTick();__upd(1/60)};__g.PP._.snap()");
  const mid = await pp('({d:__g.PP._.G.L.d,coins:__g.PP._.G.L.coins,t:Math.round(__g.PP._.G.L.t)})');
  await page.reload(); await page.waitForTimeout(800);
  await ev('cartPick(3)'); await page.waitForTimeout(2000); await press('z'); await page.waitForTimeout(600);
  await page.evaluate(() => { window.requestAnimationFrame = () => 0; }); await page.waitForTimeout(100);
  await page.evaluate(PAGE_KIT);
  const items = await pp('__g.PP._.G.s');
  await shot('pp_35_title_continue.png'); await audit('title with CONTINUE');
  await pp("__tap('a')");
  const back = await pp('({s:__g.PP._.G.s,d:__g.PP._.G.L&&__g.PP._.G.L.d,coins:__g.PP._.G.L&&__g.PP._.G.L.coins,t:__g.PP._.G.L&&Math.round(__g.PP._.G.L.t)})');
  check(items === 'title' && back.s === 'pause' && back.d === mid.d && back.coins === mid.coins, 'after a reload, CONTINUE DAY picks the day back up: ' + JSON.stringify({ mid, back }));

  check(!errs.filter(e => !/_blob|ERR_FILE_NOT_FOUND|Failed to load resource/.test(e)).length, 'no page errors' + (errs.length ? ' (all: ' + errs.join(' | ') + ')' : ''));
  await browser.close();
  console.log(notes.join('\n')); if (fails.length) console.log('\n' + fails.join('\n'));
  console.log(`\n${notes.filter(n => n.startsWith('ok')).length} passed, ${fails.length} failed`);
  process.exit(fails.length ? 1 : 0);
}
main().catch(e => { console.error(e); process.exit(2); });
