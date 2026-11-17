/* Patch & Plate + console checks at iPhone 16 Pro Max size (440x956 CSS px).
   ALT copy of v0.3/tests/pp_test.js. Run from the repo root:  node alt/tests/pp_test.js   (screenshots go to alt/playtest/pp/)
   What it checks:
   1. All four cartridges boot from the shelf with no page errors.
   2. A bot plays Patch & Plate days start to finish through the real controls (D-pad, A, B),
      with the game loop stepped by hand so a day takes seconds instead of minutes.
   3. Text on every Patch & Plate screen: inside the screen, not overlapping, not squeezed.
   4. Putting the phone down pauses and saves the day; CONTINUE picks it up after a reload. */
const { chromium } = require('playwright');
const path = require('path'), fs = require('fs');
const FILE = path.resolve(process.argv[2] || path.join(__dirname, '../games/pocket-lantern-alt.html'));
const SHOTS = path.resolve(__dirname, '../playtest/pp');
const URL = 'file://' + FILE + '?dev';
const fails = [], notes = [];
const check = (ok, what) => { (ok ? notes : fails).push((ok ? 'ok   ' : 'FAIL ') + what); };

/* runs inside the page: a hand-cranked game loop and a bot that drives the controls */
const PAGE_KIT = () => {
  __g.ev("window.__step=(dt)=>{update(dt);g.setTransform(2,0,0,2,0,0);g.imageSmoothingEnabled=false;if(TBON)TBX=[];draw();if(TBON){TBL=TBX;TBX=null}for(const k in keys)prev[k]=keys[k]}");
  __g.ev("window.__upd=(dt)=>{update(dt);for(const k in keys)prev[k]=keys[k]}");
  const K = __g.keys, PP = __g.PP._;
  const clear = () => { K.up = K.down = K.left = K.right = 0; };
  window.__tap = (k, n = 1) => { for (let i = 0; i < n; i++) { K[k] = 0; __step(1 / 60); K[k] = 1; __step(1 / 60); K[k] = 0; __step(1 / 60); } };
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
    while ((PP.G.s === 'play' || (PP.G.s === 'cine' && PP.G.cine.from === 'play')) && f < maxSec * 60) { __botTick(); (f % 15 === 0 ? __step : __upd)(1 / 60); f++; }
    for (let k = 0; PP.G.s === 'cine' && k < 60 * 60; k++) __upd(1 / 60);   /* big moments after the day play out before the results */
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
  check(carts.length === 5 && carts.every(c => c.right <= 440), 'shelf shows 5 cartridges inside the screen: ' + carts.map(c => c.t + ' ' + Math.round(c.w) + 'x' + Math.round(c.h)).join(', '));
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
  const shot = async (name) => { await pp('for(let i=0;i<12;i++)__step(1/60)'); await page.screenshot({ path: path.join(SHOTS, name) }); };
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
  check(await pp('__g.PP._.G.s') === 'cine' && await pp('__g.PP._.G.cine.k') === 'open', 'the first day starts with the opening scene');
  await pp('for(let i=0;i<60*1.2;i++)__upd(1/60)');
  await shot('pp_12a_opening_scene.png'); await audit('opening scene');
  await pp('for(let i=0;i<60*18&&__g.PP._.G.s===\'cine\';i++)__upd(1/60)');
  check(await pp('__g.PP._.G.s') === 'intro', 'the opening scene plays itself out, then day 1 opens its intro card');
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
  check((await pp('__g.PP._.SV.seeds')).includes('DEW'), 'day 1 pays the DEW sprout seed');
  await pp('for(let i=0;i<60*2;i++)__upd(1/60)');
  await shot('pp_16_day1_done.png'); await audit('results');

  /* more days: unlock them all and let the bot play a spread */
  await pp('__g.PP._.setDay(12)');
  const results = [];
  for (const d of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]) {
    const r = await page.evaluate(d => { const PP = __g.PP._; PP.startDay(d); PP.G.s = 'play'; const f = __playDay(); const R = PP.G.res; return { d: d + 1, sec: Math.round(f / 60), st: R && R.st, coins: R && R.coins, goal: PP.G.L.goal, served: R && R.served, n: R && R.n, s: PP.G.s }; }, d);
    results.push(r);
    if (d === 1) check((await pp('__g.PP._.SV.crew')).includes('DEW'), 'day 2: the bot plants the DEW seed, plucks it, and DEW joins the crew');
    check(r.s === 'done', `day ${r.d}: bot finished in ${r.sec}s, ${r.st} stars, ${r.coins} coins (goals ${r.goal.join('/')}), served ${r.served}/${r.n}`);
    if (d === 3 || d === 7 || d === 11) {
      await page.evaluate(d => { const PP = __g.PP._; PP.startDay(d); PP.G.s = 'play'; for (let i = 0; i < 60 * 40; i++) { __botTick(); __upd(1 / 60); } }, d);
      await shot(`pp_2${d}_day${d + 1}_playing.png`); await audit('day ' + (d + 1) + ' playing');
      await pp('__playDay()');
    }
  }

  /* the sprout crew: every one does its job, and the hard days with and without them */
  await pp("__g.PP._.SV.crew=[];__g.PP._.SV.seeds=[]");
  const solo = await page.evaluate(() => { const PP = __g.PP._, o = {}; for (const d of [7, 10, 11]) { PP.startDay(d); PP.G.s = 'play'; __playDay(); o[d + 1] = PP.G.res.st + '★ ' + PP.G.res.coins; } return o; });
  await pp("__g.PP._.SV.crew=['DEW','PEB','EMBER','ZIP','LEAF','LUCKY'];__g.PP._.SV.cxp={}");
  const crew = await page.evaluate(() => { const PP = __g.PP._, o = {}, jobs = {}; for (const d of [7, 10, 11]) { PP.startDay(d); PP.G.s = 'play'; __playDay(); o[d + 1] = PP.G.res.st + '★ ' + PP.G.res.coins; for (const k in PP.G.res.jobs) jobs[k] = (jobs[k] | 0) + PP.G.res.jobs[k]; } return { o, jobs, cxp: PP.SV.cxp }; });
  notes.push('note days 8/11/12 without the crew: ' + JSON.stringify(solo) + '   with all six: ' + JSON.stringify(crew.o));
  const idle = ['DEW', 'PEB', 'EMBER', 'ZIP', 'LEAF'].filter(t => !(crew.jobs[t] > 0));
  check(!idle.length, 'every working sprout did its job: ' + JSON.stringify(crew.jobs) + (idle.length ? ' idle: ' + idle : ''));
  check(Object.values(crew.cxp).some(x => x >= 20), 'sprouts level up by working: ' + JSON.stringify(crew.cxp));
  await page.evaluate(() => { const PP = __g.PP._; PP.startDay(9); PP.G.s = 'play'; for (let i = 0; i < 60 * 35; i++) { __botTick(); __upd(1 / 60); } });
  await shot('pp_36_crew_at_work.png'); await audit('day 10 with the crew');
  await pp('__playDay()');
  await pp("__g.PP._.SV.crew=['DEW','PEB','EMBER'];__g.PP._.SV.seeds=['ZIP'];__g.PP._.G.s='crew'");
  await shot('pp_37_sprouts_page.png'); await audit('sprouts page');
  await page.evaluate(() => { const PP = __g.PP._; PP.startDay(4); PP.G.s = 'play'; for (let i = 0; i < 60 * 6; i++) { __botTick(); __upd(1 / 60); } });
  await shot('pp_38_sprout_seed_planting.png');
  await page.evaluate(() => { for (let i = 0; i < 60 * 20; i++) { __botTick(); __upd(1 / 60); } });
  check((await pp('__g.PP._.SV.crew')).includes('ZIP'), 'a seed planted mid-day grows and ZIP joins');
  await pp('__playDay()');

  /* scenes and quips */
  const sc = async (code, name, label, t) => { await page.evaluate(code); await pp(`for(let i=0;i<60*${t};i++)__upd(1/60)`); await shot(name); await audit(label); };
  await sc(() => { const PP = __g.PP._; PP.startDay(4); PP.G.s = 'play'; PP.cine('taste', { who: 'MARCUS', rc: 'deluxe' }, [['MARCUS', "BRO, I'D PUT MY NAME ON THIS."]]); }, 'pp_40_scene_taste.png', 'taste scene', 1);
  await pp("__tap('start')"); check(await pp('__g.PP._.G.s') === 'play', 'Start skips a scene and the day carries on');
  await sc(() => { const PP = __g.PP._; PP.cine('sprout', { T: 'ZIP' }, [['NEW HELPER', 'ZIP JOINED THE CREW! IT RUNS FINISHED FOOD TO THE PLATES.']]); }, 'pp_41_scene_sprout.png', 'sprout scene', 1.4);
  await pp("__tap('start')");
  await page.evaluate(() => { const PP = __g.PP._; PP.SV.hpend = []; PP.G.res = { d: 4, st: 3, coins: 120, tips: 30, served: 6, n: 6, missed: 0 }; PP.G.s = 'done'; PP.G.t = 1; PP.G.ri = 0; });
  await pp("__tap('a')");
  check(await pp('__g.PP._.G.s') === 'cine' && await pp('__g.PP._.G.cine.k') === 'night', 'NEXT DAY plays the night scene');
  await pp('for(let i=0;i<60;i++)__upd(1/60)'); await shot('pp_42_scene_dusk.png'); await audit('night scene (dusk)');
  await pp('for(let i=0;i<60*1.4;i++)__upd(1/60)'); await shot('pp_43_scene_night.png');
  await pp('for(let i=0;i<60*1.6;i++)__upd(1/60)'); await shot('pp_44_scene_dawn.png'); await audit('night scene (dawn)');
  await pp('for(let i=0;i<60*8&&__g.PP._.G.s===\'cine\';i++)__upd(1/60)');
  check(await pp('__g.PP._.G.s') === 'intro' && await pp('__g.PP._.G.L.d') === 5, 'the night scene leads into the next day');
  await page.evaluate(() => { const PP = __g.PP._; PP.G.s = 'play'; PP.G.L.qcd = 0; PP.quip('streak', 1); });
  await pp('for(let i=0;i<20;i++)__upd(1/60)'); await shot('pp_45_quip.png'); await audit('a quip during the day');
  const mus = await pp("__g.ev('musWant()')");
  check(mus === 'pp', 'Patch & Plate asks for its own song (music list: ' + mus + ')');

  /* Louie, hearts, asks (from the days the bot just played) */
  const soc = await pp("({fed:__g.PP._.SV.lou.fed,hearts:{WILL:__g.PP._.heartsOf('WILL'),MARCUS:__g.PP._.heartsOf('MARCUS'),LOUIE:__g.PP._.heartsOf('LOUIE')},pend:__g.PP._.SV.hpend.slice()})");
  check(soc.fed > 0, 'the bot fed Louie ' + soc.fed + ' times across the days');
  check(soc.hearts.MARCUS > 0 && soc.hearts.WILL > 0 && soc.hearts.LOUIE > 0, 'hearts grow for Will, Marcus and Louie: ' + JSON.stringify(soc));
  const mind = await page.evaluate(() => { const PP = __g.PP._; let changed = 0; for (let k = 0; k < 6 && !changed; k++) { PP.startDay(6); PP.G.s = 'play'; for (let i = 0; i < 60 * 90 && PP.G.s !== 'done'; i++) { __botTick(); __upd(1 / 60); if (PP.G.L.lou && PP.G.L.lou.changed) changed = 1; } } return changed; });
  check(mind === 1, 'Louie changes his mind mid-craving (seen within a few days)');
  await page.evaluate(() => { const PP = __g.PP._; PP.startDay(5); PP.G.s = 'play'; const L = PP.G.L; for (let i = 0; i < 60 * 6; i++) { __upd(1 / 60) } L.lou.st = 'want'; L.lou.t = 3; L.lou.want = ['kib', 'let_c']; L.lou.bowl = ['kib']; L.P.x = 9; L.P.y = 3; L.P.fx = -1; L.P.fy = 0; });
  await shot('pp_50_louie_wants.png'); await audit('Louie wants a mix');
  await page.evaluate(() => { const PP = __g.PP._; PP.G.s = 'done'; PP.G.res = { d: 5, st: 2, coins: 90, tips: 20, served: 6, n: 6, missed: 0 }; PP.G.t = 1; PP.G.ri = 0; PP.SV.hpend = ['MARCUS:3']; });
  await pp("__tap('a')");
  check(await pp('__g.PP._.G.s') === 'cine' && await pp('__g.PP._.G.cine.k') === 'heart', 'a waiting heart scene plays after the day, before the night');
  await pp('for(let i=0;i<60*1.2;i++)__upd(1/60)'); await shot('pp_51_heart_scene.png'); await audit('heart scene');
  await pp('for(let i=0;i<60*20&&__g.PP._.G.s===\'cine\'&&__g.PP._.G.cine.k===\'heart\';i++)__upd(1/60)');
  check(await pp('__g.PP._.G.cine&&__g.PP._.G.cine.k') === 'night', 'then the night scene carries on as usual');
  await pp("__tap('start')");
  const ask = await page.evaluate(() => { const PP = __g.PP._; PP.SV.daily = null; const D = PP.asks(), a = D.a[0], c0 = PP.SV.coins; PP.bumpAsk(a.id, a.n, a.id === 'streak'); return { n: D.a.length, done: a.done, gain: PP.SV.coins - c0 }; });
  check(ask.n === 3 && ask.done && ask.gain === 15, "today's asks: three of them, and finishing one pays 15 coins " + JSON.stringify(ask));

  /* the stand hub and the new pages */
  await pp("__g.PP._.G.s='stand';__g.PP._.G.si=0");
  await shot('pp_52_stand_hub.png'); await audit('stand hub');
  await pp("__g.PP._.G.s='days';__g.PP._.G.di=0"); await shot('pp_53_all_days.png'); await audit('all days');
  await pp("__g.PP._.SV.coins=500;__g.PP._.G.s='ward';__g.PP._.G.wi=0;__g.PP._.G.wv=Object.assign({},__g.PP._.SV.look)");
  await pp("__tap('right');__tap('a')");
  check(await pp('__g.PP._.SV.look.dress') === 1, 'wardrobe: buying the SAGE dress puts it on Erin');
  await pp("__tap('down');__tap('down');__tap('right');__tap('right')"); await shot('pp_54_wardrobe.png'); await audit('wardrobe');
  await pp("__g.PP._.G.s='friends'"); await shot('pp_55_friends.png'); await audit('friends');
  await pp("__g.PP._.G.s='book';__g.PP._.G.bookFrom='stand';__g.PP._.G.bp=2"); await shot('pp_56_book_louie.png'); await audit('recipe book: Louie page');

  /* save files: a fresh file 2, file 1 untouched, then erase file 2 */
  const file1 = await pp('({day:__g.PP._.SV.day,coins:__g.PP._.SV.coins})');
  await pp("__g.PP._.G.s='files';__g.PP._.G.fi=0;__g.PP._.G.fa=0;__tap('down');__tap('a')");
  const f2 = await pp('({slot:__g.PP._.SLOT,day:__g.PP._.SV.day,coins:__g.PP._.SV.coins,s:__g.PP._.G.s})');
  check(f2.slot === 1 && f2.day === 0 && f2.coins === 0 && f2.s === 'stand', 'SAVE FILES: file 2 starts a fresh game ' + JSON.stringify(f2));
  await pp("__g.PP._.G.s='files';__g.PP._.G.fi=1;__g.PP._.G.fa=0"); await shot('pp_57_save_files.png'); await audit('save files');
  await pp("__g.PP._.G.fi=0;__tap('a')");
  const back1 = await pp('({slot:__g.PP._.SLOT,day:__g.PP._.SV.day,coins:__g.PP._.SV.coins})');
  check(back1.slot === 0 && back1.day === file1.day && back1.coins === file1.coins, 'file 1 is just as it was ' + JSON.stringify(back1));
  await pp("__g.PP._.G.s='files';__g.PP._.G.fi=1;__g.PP._.G.fa=0;__tap('right');__tap('a')");
  check(await pp('__g.PP._.slotUsed(1)') === true, 'erasing needs more than one press');
  await pp("__tap('a');__tap('a')");
  check(await pp('__g.PP._.slotUsed(1)') === false && await pp('__g.PP._.slotUsed(0)') === true, 'three presses erase file 2, file 1 stays');

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

  /* 4a. v0.4, the Sunkeep update: lore lines, Lantern Town customers, LANTERN NIGHT (day 13) */
  const fit = await page.evaluate(() => {
    const P = __g.PP._, bad = [], W = P.tw;
        const lines = (s, max, sc, n, what) => { const l = P.wrap(s, max, sc); if (l.length > n || l.some(x => W(x, sc) > max)) bad.push(what + ': ' + s); };
    for (const w in P.HI) P.HI[w].forEach(s => lines(s, 206, 1, 2, 'hello'));
    for (const w in P.HURRY) P.HURRY[w].forEach(s => lines(s, 206, 1, 2, 'hurry'));
    for (const k in P.QP) P.QP[k].forEach(q => lines(q[1], 206, 1, 2, 'quip'));
    for (const w in P.WHO) P.WHO[w].yum.concat(P.WHO[w].bye).forEach(s => lines(s, 70, 1, 2, 'order card'));
    const sc = []; for (const k in P.NIGHT) P.NIGHT[k].forEach(e => sc.push(...e)); P.NIGHT_V.forEach(e => sc.push(...e)); for (const w in P.HS) P.HS[w].forEach(e => sc.push(...e));
    for (const k in P.STORY) sc.push(...P.STORY[k][1]); for (const w in P.FAVSAY) lines(P.FAVSAY[w], 70, 1, 2, 'favourite');
    for (const k in P.TASTE) sc.push(['', P.TASTE[k]]); for (const k in P.TASTE_M) sc.push(['', P.TASTE_M[k]]);
    sc.forEach(l => lines(l[1], 210, 2, 3, 'scene')); P.DAYS.forEach(D => lines(D.s, 156, 2, 6, 'day card'));
    return { bad, n: sc.length };
  });
  check(!fit.bad.length, 'every hello, hurry, quip, order card, scene and day line fits the box it is drawn in' + (fit.bad.length ? ': ' + fit.bad.join(' | ') : ''));
  const town = await page.evaluate(() => { const P = __g.PP._, early = P.peopleFor(1), late = P.peopleFor(12); let bad = 0; for (let i = 0; i < 400; i++) { const w = P.nightPick(3, 0)[0][0]; if (w === 'ELDER' || w === 'PIP') bad++; } return { early: early.includes('ELDER') || early.includes('PIP'), late: late.includes('ELDER') && late.includes('PIP'), bad, days: P.DAYS.length, last: P.DAYS[12].n }; });
  check(!town.early && town.late && !town.bad, 'the ELDER and PIP only come by (and only get a night scene) once their day has opened: ' + JSON.stringify(town));
  check(town.days === 13 && town.last === 'LANTERN NIGHT', 'day 13 is LANTERN NIGHT');
  await pp("__g.PP._.setDay(13);__g.PP._.startDay(12)");
  await shot('pp_60_intro_day13.png'); await audit('intro day 13');
  await page.evaluate(() => { const PP = __g.PP._; PP.G.s = 'play'; for (let i = 0; i < 60 * 30; i++) { __botTick(); __upd(1 / 60); } const cu = PP.G.L.cu; let k = 0; for (const c of cu) if (c) c.who = ['ELDER', 'PIP', 'ELDER'][k++]; });
  await shot('pp_61_day13_playing.png'); await audit('day 13 playing, the ELDER and PIP at the windows');
  const d13 = await page.evaluate(() => { const PP = __g.PP._; const f = __playDay(); const R = PP.G.res; return { s: PP.G.s, sec: Math.round(f / 60), st: R && R.st, coins: R && R.coins, served: R && R.served, n: R && R.n, day: PP.SV.day }; });
  check(d13.s === 'done' && d13.served >= 1, `day 13: bot finished in ${d13.sec}s, ${d13.st} stars, ${d13.coins} coins, served ${d13.served}/${d13.n}`);
  let nightBad = 0;
  for (let i = 0; i < 8; i++) {
    await page.evaluate(i => { const PP = __g.PP._, ex = PP.NIGHT_V[i]; PP.G.s = 'stand'; PP.cine('night', { who: ex[0][0], day: 3 }, ex, () => { PP.G.s = 'stand'; }); for (let k = 0; k < 50; k++)__upd(1 / 60); }, i);
    if (i === 6) await shot('pp_62_night_elder.png');
    const before = fails.length; await audit('valley night ' + (i + 1)); if (fails.length > before) nightBad++;
    await pp("__g.PP._.G.cine=null;__g.PP._.G.s='stand'");
  }
  await pp("__g.PP._.startDay(12);__g.PP._.G.s='play';for(let i=0;i<30;i++)__upd(1/60);__g.PP._.G.quip={who:'MARCUS',s:\"I'VE GOT A GUY. THE GUY IS ME. THE GUY IS HUNGRY.\",t:.5}");
  await shot('pp_65_long_quip.png'); await audit('a long quip takes two rows');
  await pp("__g.PP._.G.s='title'"); await shot('pp_63_title_lantern.png'); await audit('title with the Great Lantern');
  await pp("__g.PP._.G.s='friends'"); await shot('pp_64_friends_town.png'); await audit('friends with the ELDER and PIP');
  /* 4a2. v0.5: Bottie and Derek, big moments, kitchen buddies */
  const v5 = await page.evaluate(() => { const P = __g.PP._, a = P.peopleFor(2), b = P.peopleFor(12), n = w => b.filter(x => x === w).length; return { early: a.includes('DEREK') || a.includes('BOTTIE'), late: b.includes('DEREK') && b.includes('BOTTIE'), will: n('WILL'), marcus: n('MARCUS'), scout: n('SCOUT') }; });
  check(!v5.early && v5.late && v5.will > v5.scout && v5.marcus > v5.scout, 'DEREK and BOTTIE join the line on their days; WILL and MARCUS come by most: ' + JSON.stringify(v5));
  const bigFit = await page.evaluate(() => { const P = __g.PP._, bad = []; for (const k in P.BUDLINE) P.BUDLINE[k].forEach(l => { const w = P.wrap(l[1], 210, 2); if (w.length > 3) bad.push(l[1]); }); return bad; });
  check(!bigFit.length, 'buddy scene lines fit' + (bigFit.length ? ': ' + bigFit.join(' | ') : ''));
  /* a fresh file: the buddies move in at 6, 15 and 27 stars, one scene each, and each one helps */
  const bud = await page.evaluate(() => { const P = __g.PP._, out = [], keep = JSON.stringify(P.SV);
    P.SV.stars = {}; P.SV.buds = []; P.SV.big = {};
    for (const [n, want] of [[5, 0], [6, 1], [15, 2], [27, 3], [39, 3]]) { P.SV.stars = {}; for (let i = 0; i < 13; i++) P.SV.stars[i] = Math.min(3, Math.max(0, n - i * 3)); P.dayBigs({ missed: 1 }, 1, 0); out.push([n, P.SV.buds.length, want, P.G.bigQ.length]); }
    P.G.bigQ = []; const res = { out, ok: out.every(o => o[1] === o[2]), names: P.SV.buds.slice() }; P.SV = JSON.parse(keep); P.store(); return res; });
  check(bud.ok && bud.names.join() === 'CUYAPUP,BESSLING,GRASSKIN', 'kitchen buddies move in at 6, 15 and 27 stars, never more than three: ' + JSON.stringify(bud));
  for (const [i, who, title, shotName] of [[0, 'CUYAPUP', 'CUYAPUP|MOVES IN!', 'pp_70_big_buddy.png'], [1, 'BOTTIE', 'BOTTIE IS|IN LINE!', 'pp_71_big_bottie.png'], [2, 'DEREK', 'DEREK|PULLS UP!', 'pp_72_big_derek.png'], [3, 'MARCUS', 'FIVE IN|A ROW!', 'pp_73_big_streak.png'], [4, 'ELDER', 'THE VALLEY|IS FED!', null], [5, 'BESSLING', 'BESSLING|MOVES IN!', null], [6, 'GRASSKIN', 'GRASSKIN|MOVES IN!', 'pp_74_big_grasskin.png'], [7, 'WILL', 'PERFECT|DAY!', null]]) {
    await page.evaluate(([who, title]) => { const P = __g.PP._; P.G.s = 'stand'; P.big(who, title, [[who === 'CUYAPUP' || who === 'BESSLING' || who === 'GRASSKIN' ? 'ERIN' : who, 'YO! THE FLOW PROS TRUCK DIED. AGAIN. GOT FRIES?']], () => { }); for (let k = 0; k < 60; k++)__upd(1 / 60); }, [who, title]);
    if (shotName) await shot(shotName);
    await audit('big moment: ' + title.replace('|', ' '));
    await pp("__g.PP._.G.cine=null;__g.PP._.G.s='stand'");
  }
  await page.evaluate(() => { const P = __g.PP._; P.SV.buds = ['CUYAPUP', 'BESSLING', 'GRASSKIN']; P.startDay(12); P.G.s = 'play'; for (let i = 0; i < 60 * 25; i++) { __botTick(); __upd(1 / 60); } const cu = P.G.L.cu; let k = 0; for (const c of cu) if (c) c.who = ['BOTTIE', 'DEREK', 'BOTTIE'][k++]; });
  await shot('pp_75_three_buddies.png'); await audit('three buddies in the kitchen, BOTTIE and DEREK at the windows');
  const tip = await page.evaluate(() => { const P = __g.PP._, L = P.G.L; P.SV.friend.BOTTIE = 0; L.cu[0] = { who: 'BOTTIE', rc: 'salad', pat: 60, pmax: 60, st: 'wait', x: 40, side: -1, t: 0, say: '', gain: 0 }; const t0 = L.tips; L.held = { k: 'plate', c: ['let_c'] }; const P2 = L.P; P2.x = 2; P2.y = 2; P2.fx = 0; P2.fy = -1; P2.mv = 0; const a = P.act(true); if (a && a.ok) P.act(); return { tipped: L.tips - t0, st: L.cu[0] && L.cu[0].st }; });
  check(tip.st === 'happy' && tip.tipped === 0, 'BOTTIE eats and never tips: ' + JSON.stringify(tip));
  await pp("__g.PP._.G.cine=null;__g.PP._.G.s='friends'"); await shot('pp_76_friends_derek.png'); await audit('friends with DEREK');
  /* 4a3. v0.6: story chapters, a favourite each, heart scenes for everyone */
  const v6 = await page.evaluate(() => { const P = __g.PP._, hs = Object.keys(P.HS).filter(w => P.HS[w].length === 4), favOK = Object.keys(P.FAV).every(w => P.RC[P.FAV[w]] && P.FAVSAY[w] && P.WHO[w]); return { hs, favOK, chapters: Object.keys(P.STORY).length }; });
  check(v6.hs.length === 9 && v6.favOK && v6.chapters === 6, 'nine characters have four heart scenes each, eight have a favourite dish, six story chapters: ' + JSON.stringify(v6));
  for (const d of [0, 3, 6, 9, 11, 12]) {
    await page.evaluate(d => { const P = __g.PP._; P.G.s = 'stand'; P.playStory(d, () => { P.G.s = 'stand'; }); for (let k = 0; k < 50; k++)__upd(1 / 60); }, d);
    if (d === 6) await shot('pp_80_story_robot.png'); if (d === 3) { await page.evaluate(() => { const c = __g.PP._.G.cine; c.li = 1; c.lt = 9; }); await shot('pp_81_story_waterworks.png'); }
    await audit('story chapter after day ' + (d + 1));
    await pp("__g.PP._.G.cine=null;__g.PP._.G.s='stand'");
  }
  const st6 = await page.evaluate(() => { const P = __g.PP._; P.SV.story = {}; P.SV.hpend = []; P.G.res = { d: 3, st: 2, coins: 90, tips: 10, served: 6, n: 6, missed: 0 }; P.G.s = 'done'; P.G.t = 1; P.G.ri = 2; __tap('a'); const a = P.G.s === 'cine' && P.G.cine.k; for (let k = 0; k < 60 * 30 && P.G.s === 'cine'; k++)__upd(1 / 60); const mid = P.G.s; P.G.res = { d: 3, st: 2, coins: 90, tips: 10, served: 6, n: 6, missed: 0 }; P.G.s = 'done'; P.G.t = 1; P.G.ri = 2; __tap('a'); return { a, mid, again: P.G.s, seen: P.SV.story[3] }; });
  check(st6.a === 'story' && st6.mid === 'stand' && st6.again === 'stand' && st6.seen === 1, 'a chapter plays once, the first time its day is cleared, then the stand as usual: ' + JSON.stringify(st6));
  const fav = await page.evaluate(() => { const P = __g.PP._; P.startDay(12); P.G.s = 'play'; P.G.fx.length = 0; const L = P.G.L; P.SV.friend.DEREK = 0; P.SV.fav = {}; L.cu[0] = { who: 'DEREK', rc: 'fries', pat: 60, pmax: 60, st: 'wait', x: 40, side: -1, t: 0, say: '', gain: 0 }; L.held = { k: 'plate', c: ['fry'] }; const Q = L.P; Q.x = 2; Q.y = 2; Q.fx = 0; Q.fy = -1; Q.mv = 0; P.SV.tasted.fries = 1; const a = P.act(true); if (a && a.ok) P.act(); return { say: L.cu[0].say, pts: P.SV.friend.DEREK, known: P.SV.fav.DEREK }; });
  check(fav.say === 'YO. FRIES.' && fav.pts === 12 && fav.known === 1, "DEREK gets his favourite: he says so and the friendship jumps: " + JSON.stringify(fav));
  await pp("for(let i=0;i<20;i++)__upd(1/60)"); await shot('pp_82_favourite.png'); await audit('a favourite served');
  const bt = await page.evaluate(() => { const P = __g.PP._, L = P.G.L; P.SV.friend.BOTTIE = 40; P.SV.hseen = Object.assign(P.SV.hseen, { 'BOTTIE:1': 1, 'BOTTIE:2': 1, 'BOTTIE:3': 1, 'BOTTIE:4': 1 }); L.cu[1] = { who: 'BOTTIE', rc: 'salad', pat: 60, pmax: 60, st: 'wait', x: 120, side: -1, t: 0, say: '', gain: 0 }; const t0 = L.tips; L.held = { k: 'plate', c: ['let_c'] }; const Q = L.P; Q.x = 7; Q.y = 2; Q.fx = 0; Q.fy = -1; Q.mv = 0; P.SV.tasted.salad = 1; const a = P.act(true); if (a && a.ok) P.act(); P.SV.friend.BOTTIE = 0; P.SV.hpend = []; return L.tips - t0; });
  check(bt > 0, 'at four hearts BOTTIE finally tips (' + bt + ')');
  await pp("__g.PP._.G.cine=null;__g.PP._.G.s='friends'"); await shot('pp_83_friends_fav.png'); await audit('friends with a known favourite');
  await pp("__g.PP._.startDay(11)");   /* back to where the reload check below starts from */

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
