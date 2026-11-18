/* lil Bottie lab. Run from the repo root, after `python3 bottie/build.py`:
     node bottie/tests/bottie_lab.js [build.html]
   1. Boots the page the way a phone does (440x956) and checks it lands on the Bottie title with no errors.
   2. Plays the intro and the first seconds of Boot Up with real key presses.
   3. Lets an autopilot play every track to the end through the game's own update loop (same inputs a player has:
      D-pad, A, B, Select) and reports time, rank and what happened.
   4. Checks the crib console opens the cartridge shelf and B brings you back.
   Screenshots go to bottie/playtest/. Exits 1 if any check fails. */
const { chromium } = require('playwright');
const path = require('path'), fs = require('fs');
const BUILD = path.resolve(process.argv[2] || 'bottie/games/pocket-lantern-bottie.html');
const OUT = path.resolve('bottie/playtest'); fs.mkdirSync(OUT, { recursive: true }); for (const f of fs.readdirSync(OUT)) if (/\.png$/.test(f)) fs.unlinkSync(path.join(OUT, f));
let fails = 0; const check = (ok, name, extra) => { console.log((ok ? 'PASS ' : 'FAIL ') + name + (extra ? '  ' + extra : '')); if (!ok) fails++; };

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 440, height: 956 }, deviceScaleFactor: 2 });
  const errs = []; page.on('pageerror', e => errs.push(String(e))); /* resource 404s (web font, the Sprouts mp3s that only exist on claude.ai) are not game errors */
  page.on('console', m => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) errs.push(m.text()); });
  await page.goto('file://' + BUILD); await page.waitForTimeout(600);
  const shot = n => page.screenshot({ path: path.join(OUT, n + '.png') });
  const tap = async (k, ms = 70) => { await page.keyboard.down(k); await page.waitForTimeout(ms); await page.keyboard.up(k); await page.waitForTimeout(90); };
  const st = () => page.evaluate(() => { const B = __g.BT._; return { s: B.G.s, lvl: B.L && B.L.id, spawns: B.L ? B.L.spawns.length : 0 }; });

  check(await page.evaluate(() => !!(window.__g && __g.BT)), 'page boots with the Bottie cartridge');
  check((await st()).s === 'title', 'lands on the title, not the shelf');
  check(await page.evaluate(() => document.getElementById('shelf').hidden), 'cartridge shelf is hidden at boot');
  await shot('01-title');
  await page.evaluate(() => { localStorage.clear(); });
  await tap('z'); let s = await st(); check(s.s === 'cine', 'A on the title starts the intro', s.s); await shot('02-intro-1');
  for (let i = 0; i < 2; i++) await tap('z'); await shot('03-intro-2');
  for (let i = 0; i < 2; i++) await tap('z'); await shot('04-intro-3');
  for (let i = 0; i < 3; i++) await tap('z');
  s = await st(); check(s.s === 'card' && s.lvl === 'boot', 'intro leads to the Boot Up card', JSON.stringify(s)); await shot('05-card-boot');
  await page.waitForTimeout(700); await tap('z'); await page.waitForTimeout(300);
  s = await st(); check(s.s === 'play', 'card leads to play', s.s); await shot('06-boot-start');
  /* real inputs: hold A from the start spot (the nearest rack is auto-aimed), then walk */
  await page.keyboard.down('z'); await page.waitForTimeout(500); await shot('07-boot-throwing'); await page.waitForTimeout(4200); await page.keyboard.up('z');
  await page.keyboard.down('ArrowRight'); await page.waitForTimeout(300); await page.keyboard.up('ArrowRight');
  await shot('08-boot-owned');
  const own1 = await page.evaluate(() => { const L = __g.BT._.L; return { owned: L.devs.filter(d => d.owned).length, spawns: L.spawns.length }; });
  check(own1.owned >= 1 && own1.spawns > 2, 'real key presses own a rack and it spits out spawns', JSON.stringify(own1));

  await tap('Enter'); s = await st(); check(s.s === 'pause', 'Start pauses', s.s); await shot('09a-pause'); await tap('Enter');
  await page.evaluate(() => { const L = __g.BT._.L, d = L.doors[0]; L.P.x = d.x - 14; L.P.y = d.y + 2; }); await page.waitForTimeout(150); await shot('09b-captcha-door'); await tap('z');
  s = await st(); check(s.s === 'captcha', 'A at a captcha door opens the captcha', s.s); await tap('z'); await tap('ArrowRight'); await shot('09c-captcha'); await tap('x');
  /* ---- autopilot: plays through update() with only the player's inputs ---- */
  await page.evaluate(() => {
    window.__bot = function (id, maxT, shots) {
      const B = __g.BT._, K = __g.keys, PV = __g.prev, G = B.G; B.startLevel(id); let L = B.L, tick = 0, t = 0; const log = [], dt = 1 / 30;
      const snaps = {}; let cooled = 0, capt = 0, oc = 0, tools = 0, quips = 0, lastCap = null, clover = 0, supers = 0, inSup = false, slams = 0, lastSlam = null;
      const tileOf = e => [Math.max(0, Math.min(L.w - 1, Math.floor(e.x / 16))), Math.max(0, Math.min(L.h - 1, Math.floor((e.y - 2) / 16)))];
      const pathTo = (tx, ty, adj) => { const s = tileOf(L.P); return B.bfs(s[0], s[1], (x, y) => adj ? Math.abs(x - tx) + Math.abs(y - ty) <= 1 : (x === tx && y === ty)); };
      const go = (px, py) => { const dx = px - L.P.x, dy = py - L.P.y; if (Math.abs(dx) > 1.5) K[dx > 0 ? 'right' : 'left'] = 1; if (Math.abs(dy) > 1.5) K[dy > 0 ? 'down' : 'up'] = 1; };
      const follow = p => { if (!p || !p.length) return; const P = L.P; const i = p.length > 1 ? 1 : 0; /* p[0] is the tile he is already on */ const ax = Math.abs(p[i][0] - P.x), ay = Math.abs(p[i][1] - P.y); if (i && ax > 2 && ay > 2 && Math.abs(p[0][0] - P.x) + Math.abs(p[0][1] - P.y) > 6) go(p[0][0], p[0][1]); else go(p[i][0], p[i][1]); };
      while (t < maxT) {
        for (const k in K) K[k] = 0; tick++;
        if (G.s === 'card') { K.a = tick % 2; }
        else if (G.s === 'captcha') { const c = G.cp; capt = 1; if (tick % 2) { let want = -1; for (let i = 0; i < 9; i++) if ((c.cells[i] === c.kind) !== !!c.sel[i]) { want = i; break; }
            if (want < 0) { if (c.cur === 9) K.a = 1; else K.down = 1; }
            else if (c.cur === 9) K.up = 1; else if (c.cur === want) K.a = 1; else if (c.cur % 3 !== want % 3) K.right = 1; else K[(c.cur / 3 | 0) < (want / 3 | 0) ? 'down' : 'up'] = 1; } }
        else if (G.s === 'clear' || G.s === 'end' || G.s === 'cine') break;
        else if (G.s === 'play') {
          L = B.L; const P = L.P, fo = L.spawns.filter(s => s.st === 'follow').length;
          if (shots && shots[0] && t >= shots[0]) { shots.shift(); __g.draw(); snaps[Math.round(t)] = document.getElementById('screen').toDataURL(); }
          let goal = null;
          if (L.heat > 72 && L.vents.length) { let bp = null; for (const v of L.vents) { const p = pathTo(Math.floor(v.x / 16), Math.floor(v.y / 16)); if (p && (!bp || p.length < bp.length)) bp = p; } if (bp) { goal = 'vent'; if (bp.length > 1 || Math.hypot(bp[0][0] - P.x, bp[0][1] - 2 - P.y) > 4) follow(bp); cooled = 1; } }
          if (!goal && L.open && L.exit && !L.def.final) { const p = pathTo(Math.floor(L.exit.x / 16), Math.floor(L.exit.y / 16)); if (p) { goal = 'exit'; if (p.length > 1) follow(p); else go(L.exit.x, L.exit.y + 4); } }
          if (!goal) {
            const door = L.doors.find(d => !d.open && Math.hypot(d.x - P.x, d.y - (P.y - 4)) < 20);
            if (door) { K.a = tick % 2; goal = 'door'; }
            else {
              let best = null, bl = 1e9; const cands = B.targets().filter(q => q.type !== 'gen').concat(L.doors.filter(d => !d.open));
              for (const q of cands) { const tx = q.k === 'foe' ? Math.floor(q.x / 16) : q.tx, ty = q.k === 'foe' ? Math.floor((q.y - 2) / 16) : q.ty; const p = pathTo(tx, ty, true); if (!p) continue; let len = p.length + (q.k === 'dev' && q.core ? 0 : 1) + (q.type === 'civ' && !L.def.npc ? 6 : 0); if (len < bl) { bl = len; best = { q, p }; } }
              if (best) { goal = best.q.k; const q = best.q, d = Math.hypot(q.x - P.x, (q.k === 'foe' ? q.y - 8 : q.y) - (P.y - 6));
                if (q.k === 'door') follow(best.p.length > 1 ? best.p : [[q.x, q.y + 2]]);
                else if (d > 44 || best.p.length > 4) follow(best.p);
                else { const a = B.aim(); if (a.t !== q && tick % 6 < 2) go(q.x, (q.k === 'foe' ? q.y : q.y + 4)); if (fo > 0) K.a = 1; else if (q.workers === 0 && L.spawns.some(s => s.st === 'work') && tick % 40 === 0) K.b = 1;
                  if (L.heat < 40 && q.need >= 7 && fo === 0 && L.oc <= 0 && tick % 2) { K.y = 1; oc++; } } }
            }
          }
          /* use the arsenal the way a player would: whatever is in hand when there are tokens for it, swapping now and then */
          if (L.sup >= 100 && tick % 2) { K.y = 1; }
          const tl = B.curTool(); if (tl && L.tok >= tl.cost && tick % 90 === 1) { K.x = 1; tools++; } else if (tick % 400 === 201) K.sel = 1;
          if (tick % 300 === 0) log.push(Math.round(t) + 's ' + goal + ' gang ' + L.spawns.length + ' heat ' + Math.round(L.heat));
        }
        __g.update(dt); for (const k in K) PV[k] = K[k]; t += dt; if (G.cap && G.cap !== lastCap) { lastCap = G.cap; quips++; } if (G.s === 'super' && !inSup) supers++; inSup = G.s === 'super'; if (B.L.slam && B.L.slam !== lastSlam) { lastSlam = B.L.slam; slams++; }
      }
      for (const k in K) K[k] = 0; __g.draw();
      const gs = B.goalState(); return { id, state: G.s, t: Math.round(L.time), res: G.res && G.res.id === id ? G.res : null, own: L.devs.filter(d => d.owned).length, all: L.devs.length, gs, zapped: L.stats.zapped, unplug: L.stats.unplug, gang: L.spawns.length, cooled, capt, oc, tools, supers, slams, quips, combo: L.best, npcWork: L.foes.filter(f => f.npc && (f.st === 'npcwork' || f.st === 'npcgo')).length, log, snaps };
    };
  });
  const order = await page.evaluate(() => __g.BT._.ORDER);
  for (const id of order) {
    const res = await page.evaluate(([id]) => __bot(id, 900, [6, 14, 24, 40, 60, 90]), [id]);
    for (const k in res.snaps) fs.writeFileSync(path.join(OUT, 'auto-' + id + '-' + String(k).padStart(3, '0') + 's.png'), Buffer.from(res.snaps[k].split(',')[1], 'base64'));
    check(res.state === 'clear' && res.res, 'autopilot clears ' + id, 'time ' + res.t + 's rank ' + (res.res ? res.res.rank : '-') + ' devices ' + res.own + '/' + res.all + ' npcs ' + res.gs.npc + ' lost ' + res.zapped + ' unplugged ' + res.unplug + ' gang ' + res.gang + (res.cooled ? ' cooled' : '') + (res.capt ? ' captcha' : '') + (res.oc ? ' overclock x' + res.oc : '') + (res.tools ? ' tools x' + res.tools : '') + ' supers x' + res.supers + ' finishers x' + res.slams + ' quips ' + res.quips + ' (' + (res.quips / Math.max(1, res.t) * 60).toFixed(1) + '/min) best combo x' + res.combo);
    /* two big-moment lines per track (the hook, the port opening) plus at most one ordinary line every 16 s */
    check(res.quips <= 3 + Math.ceil(res.t / 16), 'quips stay rare on ' + id, res.quips + ' in ' + res.t + ' s');
    if (res.state !== 'clear') console.log('   log: ' + res.log.slice(-8).join(' | '));
    await page.waitForTimeout(150); await shot('10-clear-' + id);
  }
  /* ---- the arsenal: each tool does its job (all unlocked, plenty of tokens) ---- */
  const tl = await page.evaluate(() => { const B = __g.BT._, G = B.G, out = {}; B.SV.un = 5; B.startLevel('born'); G.s = 'play'; let L = B.L; L.tok = 50;
    const use = id => { G.tool = B.haveTools().findIndex(t => t.id === id); B.useTool(); };
    const n0 = L.spawns.length; use('fork'); out.fork = L.spawns.length - n0;
    const nerd = L.foes.find(f => f.type === 'nerd'); L.P.x = nerd.x + 20; L.P.y = nerd.y; use('bsod'); out.bsod = nerd.frz > 0;
    nerd.frz = 0; use('popup'); out.popup = !!L.pop && L.foes.some(f => f.st === 'lure');
    const fw = L.fws[0]; L.P.x = fw.x - 20; L.P.y = fw.y + 2; L.P.dx = 1; L.P.dy = 0; L.aim = B.aim(); out.aimed = L.aim.t && L.aim.t.k; use('rm'); out.rm = fw.dead;
    out.tok = L.tok; L.tok = 0; const n1 = L.spawns.length; use('fork'); out.broke = L.spawns.length === n1; return out; });
  check(tl.fork === 5, 'FORK BOMB adds five spawns', JSON.stringify(tl)); check(tl.bsod, 'BLUE SCREEN freezes a nearby nerd'); check(tl.popup, 'POP-UP lures humans');
  check(tl.rm, 'RM -RF deletes the aimed firewall', 'aimed ' + tl.aimed); check(tl.tok === 50 - 5 - 5 - 3 - 6 && tl.broke, 'tools cost tokens and refuse without them', 'left ' + tl.tok);
  await page.evaluate(() => { const B = __g.BT._, L = B.L; L.tok = 9; B.G.cap = { s: "Fork bomb gang, we multiply on sight (sight)", t: 4 }; L.P.face = 'd'; }); await page.waitForTimeout(250); await shot('11-bubble-and-arsenal');
  await page.keyboard.down('v'); await page.waitForTimeout(80); await page.keyboard.up('v'); await page.waitForTimeout(200);
  check(await page.evaluate(() => __g.BT._.L.oc > 0), 'Y overclocks'); await shot('12-overclocked');
  check(await page.evaluate(() => getComputedStyle(document.getElementById('bX')).display !== 'none' && document.querySelector('#bY span').textContent === 'clock'), 'X and Y buttons show for Bottie');

  /* ---- finishers and supers ---- */
  const fin = await page.evaluate(() => { const B = __g.BT._, G = B.G, K = __g.keys, PV = __g.prev, out = {}; const step = n => { for (let i = 0; i < n; i++) { __g.update(1 / 30); for (const k in K) PV[k] = K[k]; } };
    for (const k in K) K[k] = 0; B.startLevel('over'); G.s = 'play'; let L = B.L; step(2);
    const opp = L.foes.find(f => f.type === 'opp'); B.complete(opp); out.slam = L.slam && L.slam.s; out.stop = L.stop > 0; const t0 = L.time; step(3); out.held = Math.abs(L.time - t0) < 1e-6; step(20);
    B.say('x', 2); out.quipSecs = G.cap.t;
    out.names = []; out.ok = [];
    for (let i = 0; i < 3; i++) { B.startLevel('born'); G.s = 'play'; L = B.L; G.supI = i; L.sup = 100; step(2); const fw = L.fws[0]; L.P.x = fw.x - 30; L.P.y = fw.y + 2; const gang0 = L.spawns.length, opps = L.foes.filter(f => f.type === 'opp').length;
      K.y = 1; step(1); K.y = 0; out.names.push(G.s === 'super' ? G.sup.S.id : 'none'); step(50); const id = B.SUPERS[i].id;
      out.ok.push(G.s === 'play' && L.sup === 0 && (id === 'cad' ? L.foes.filter(f => f.type === 'opp' && !f.dead).length === 0 && opps > 0 : id === 'copy' ? L.spawns.length === L.def.cap && L.spawns.length > gang0 && L.fire > 0 : fw.dead && L.fire > 0 && L.mode === 'fire')); }
    return out; });
  check(!!fin.slam && fin.stop && fin.held, 'crashing an opp bot lands a finisher with a hit-stop', JSON.stringify(fin));
  check(fin.quipSecs <= 2.5, 'a quip stays up about two seconds', fin.quipSecs + ' s');
  check(fin.names.join() === 'cad,copy,fire' && fin.ok.every(Boolean), 'all three supers fire from Y and do their job', fin.names.join() + ' ' + fin.ok.join());
  for (const [i, nm] of [[0, 'cad'], [1, 'copy'], [2, 'fire']]) { await page.evaluate(i => { const B = __g.BT._; B.startLevel('born'); B.G.s = 'play'; B.G.supI = i; B.L.sup = 100; B.L.P.x = B.L.fws[0].x - 30; B.L.P.y = B.L.fws[0].y + 2; }, i); await page.waitForTimeout(120);
    await page.keyboard.down('v'); await page.waitForTimeout(60); await page.keyboard.up('v'); await page.waitForTimeout(800); await shot('17-super-' + nm); await page.waitForTimeout(1000); await shot('18-after-' + nm); }
  await page.evaluate(() => { const B = __g.BT._; B.startLevel('over'); B.G.s = 'play'; }); await page.waitForTimeout(150); await page.evaluate(() => { const B = __g.BT._; B.complete(B.L.foes.find(f => f.type === 'opp')); }); await page.waitForTimeout(260); await shot('19-finisher');

  /* ---- fun elements ---- */
  const fun = await page.evaluate(() => { const B = __g.BT._, G = B.G, K = __g.keys, PV = __g.prev, out = {}; const step = n => { for (let i = 0; i < n; i++) { __g.update(1 / 30); for (const k in K) PV[k] = K[k]; } };
    for (const k in K) K[k] = 0; B.SV.clover = {}; B.startLevel('born'); G.s = 'play'; let L = B.L;
    /* fiber port */ const a = L.ports[0], b = L.ports[1]; L.P.x = a.x; L.P.y = a.y + 2; step(2); out.port = Math.hypot(L.P.x - b.x, L.P.y - 2 - b.y) < 4; step(30); out.portStays = Math.hypot(L.P.x - b.x, L.P.y - 2 - b.y) < 4;
    /* clover */ L.P.x = L.clover.x; L.P.y = L.clover.y + 4; step(2); out.clover = L.clover.got && !!B.SV.clover.born;
    /* combo */ const a0 = L.aura; const ds = L.devs.filter(d => !d.core).slice(0, 3); ds.forEach(d => B.complete(d)); out.combo = L.combo; out.comboAura = L.aura - a0; out.plain = ds.reduce((n, d) => n + d.need * 100, 0);
    /* NPC army */ const nerd = L.foes.find(f => f.type === 'nerd'); L.foes.forEach(f => { if (f !== nerd) f.dead = true; }); B.complete(nerd); const owned0 = L.devs.filter(d => d.owned).length; L.P.x = 24; L.P.y = 24 * 16; for (const s of L.spawns) s.st = 'idle', s.t = 999; step(30 * 60); out.npcOwned = L.devs.filter(d => d.owned).length - owned0;
    /* quip throttle */ G.cap = null; let n = 0, last = null; for (let i = 0; i < 20; i++) { B.say('x' + i); if (G.cap !== last) { last = G.cap; n++; } step(15); } out.quips10s = n;
    /* finale countdown */ B.startLevel('nuke'); G.s = 'play'; L = B.L; L.time = L.def.limit - 0.5; step(70); out.fail = G.s; K.a = 1; step(2); K.a = 0; step(2); out.retry = G.s + ':' + B.L.id + ':' + Math.round(B.L.time);
    /* closet */ B.goCrib(); L = B.L; B.SV.aura = 30000; B.SV.drip = 0; B.useThing({ use: 'closet' }); out.drip = B.DRIPS[B.SV.drip].n; B.useThing({ use: 'closet' }); out.drip2 = B.SV.drip; return out; });
  check(fun.port && fun.portStays, 'a fiber port sends Bottie to the other one and does not bounce him back', JSON.stringify(fun));
  check(fun.clover, 'walking onto the iced clover collects and saves it');
  check(fun.combo === 4 && fun.comboAura > fun.plain, 'takes in a row build a combo worth more aura', 'combo ' + fun.combo + ' aura ' + fun.comboAura + ' vs plain ' + fun.plain);
  check(fun.npcOwned >= 1, 'an NPC owns a device by himself within a minute', 'owned ' + fun.npcOwned);
  check(fun.quips10s <= 2, 'ordinary quips are throttled', fun.quips10s + ' shown of 20 asked in 10 s');
  check(fun.fail === 'fail' && /^(card|play):nuke:[0-3]$/.test(fun.retry), 'the finale clock runs out, and A runs it back', fun.fail + ' -> ' + fun.retry);
  check(fun.drip === 'ICE PUFFER' && fun.drip2 === 0, 'the closet changes drip when there is enough aura, and says what the next one needs', fun.drip + ' then ' + fun.drip2);
  await page.evaluate(() => { const B = __g.BT._; B.SV.drip = 2; B.startLevel('algo'); B.G.s = 'play'; const L = B.L; L.P.x = L.ports[1].x + 30; L.P.y = L.ports[1].y + 2; L.devs.slice(0, 2).forEach(d => B.complete(d)); }); await page.waitForTimeout(300); await shot('14-port-combo-gold-drip');
  await page.evaluate(() => { const B = __g.BT._; B.SV.drip = 0; B.startLevel('nuke'); B.G.s = 'play'; B.L.time = 255; }); await page.waitForTimeout(400); await shot('15-finale-last-minute');
  await page.evaluate(() => { __g.BT._.L.time = 299.8; }); await page.waitForTimeout(1800); await shot('16-finale-fail');

  /* ending -> crib -> console -> shelf -> back */
  await page.evaluate(() => { const B = __g.BT._; B.startLevel('nuke'); B.G.s = 'play'; B.L.devs.forEach(d => { if (d.core) B.complete(d); }); }); await page.waitForTimeout(3200); await shot('13-nuke-clear');
  await page.waitForTimeout(1000); await tap('z'); s = await st(); check(s.s === 'cine', 'clearing Nuke starts the ending', s.s); await shot('20-ending-1');
  for (let i = 0; i < 20 && (await st()).s === 'cine'; i++) { if (i === 3) await shot('21-ending-2'); if (i === 6) await shot('22-ending-3'); if (i === 9) await shot('23-ending-4'); await tap('z'); }
  s = await st(); check(s.s === 'end', 'ending reaches the credits', s.s); await page.waitForTimeout(1700); await shot('24-credits'); await tap('z');
  s = await st(); check(s.s === 'play' && s.lvl === 'crib', 'credits lead to the crib', JSON.stringify(s)); await page.waitForTimeout(400); await shot('30-crib');
  /* walk to the console: it is up and to the left of the start */
  await page.evaluate(() => { const L = __g.BT._.L, u = L.uses.find(u => u.use === 'console'); L.P.x = u.x; L.P.y = u.y + 20; });
  await page.waitForTimeout(200); await shot('31-crib-console'); await tap('z'); await page.waitForTimeout(400);
  check(await page.evaluate(() => !document.getElementById('shelf').hidden), 'A at the console opens the cartridge shelf'); await shot('32-shelf');
  await tap('x'); await page.waitForTimeout(300); s = await st();
  check(await page.evaluate(() => document.getElementById('shelf').hidden) && s.s === 'play' && s.lvl === 'crib', 'B on the shelf goes back to the crib', JSON.stringify(s));
  /* a cartridge still boots from the shelf */
  await page.evaluate(() => { const L = __g.BT._.L, u = L.uses.find(u => u.use === 'console'); L.P.x = u.x; L.P.y = u.y + 20; }); await tap('z'); await page.waitForTimeout(300);
  await tap('z'); await page.waitForTimeout(4200); await shot('33-sprouts-from-shelf');
  check(await page.evaluate(() => document.getElementById('shelf').hidden), 'Sprouts boots from Bottie\'s console');
  /* tracklist */
  await page.reload(); await page.waitForTimeout(500); await tap('z'); await page.waitForTimeout(300);
  await page.evaluate(() => { const L = __g.BT._.L, u = L.uses.find(u => u.use === 'booth'); L.P.x = u.x; L.P.y = u.y + 20; }); await page.waitForTimeout(200); await tap('z'); await page.waitForTimeout(200);
  s = await st(); check(s.s === 'tracks', 'the booth opens the tracklist', s.s); await shot('34-tracklist');
  check(errs.length === 0, 'no page errors', errs.slice(0, 5).join(' || '));
  await browser.close(); console.log(fails ? fails + ' FAILED' : 'ALL PASS'); process.exit(fails ? 1 : 0);
})();
