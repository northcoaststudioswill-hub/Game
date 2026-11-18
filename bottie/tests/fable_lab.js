/* Checks for the FABLE pass on Knockout (parry, wall bounce, K.O. impact frame, stances, rules, Trials).
   Run from the repo root, after `python3 bottie/build.py`:  node bottie/tests/fable_lab.js [build.html] [outDir]
   Output: bottie/playtest/fable/ (PNG sheets). Prints PASS/FAIL per check and exits 1 if any fail.
   The game loop is stepped by hand at 60 fps, like ko_lab.js. */
const { chromium } = require('playwright');
const path = require('path'), fs = require('fs');
const BUILD = path.resolve(process.argv[2] || path.join(__dirname, '../games/pocket-lantern-bottie.html'));
const OUT = path.resolve(process.argv[3] || path.join(__dirname, '../playtest/fable'));

const KIT = () => {
  __g.ev("window.__step=(dt)=>{update(dt);g.setTransform(2,0,0,2,0,0);g.imageSmoothingEnabled=false;draw();for(const k in keys)prev[k]=keys[k]}");
  __g.ev("window.__upd=(dt)=>{update(dt);for(const k in keys)prev[k]=keys[k]}");
  window.KO = __g.KO._; window.K = __g.keys;
  window.clr = () => { for (const k in K) K[k] = 0; };
  window.cv = document.getElementById('screen');
  window.fight = (p1, p2, stage, mode) => {
    const G = KO.G; G.p1 = p1; G.p2 = p2; G.stage = stage; G.mode = mode || 'vs'; KO.startMatch();
    G.f[1].dummy = 1; G.phase = 'go'; G.pT = 0; clr();
    for (let i = 0; i < 20; i++) __step(1 / 60);
    return G.f;
  };
  window.sheet = (frames, cols, scale = 1, label) => {
    const w = frames[0].width, h = frames[0].height, rows = Math.ceil(frames.length / cols);
    const s = document.createElement('canvas'); s.width = cols * w * scale + (cols + 1) * 4; s.height = rows * h * scale + (rows + 1) * 4 + (label ? 22 : 0);
    const x = s.getContext('2d'); x.fillStyle = '#222'; x.fillRect(0, 0, s.width, s.height); x.imageSmoothingEnabled = false;
    if (label) { x.fillStyle = '#fff'; x.font = '16px monospace'; x.fillText(label, 6, 16); }
    frames.forEach((f, i) => { const c = i % cols, r = (i / cols) | 0; x.drawImage(f, 4 + c * (w * scale + 4), (label ? 22 : 0) + 4 + r * (h * scale + 4), w * scale, h * scale); });
    return s.toDataURL('image/png');
  };
  window.grab = (y0f = 0) => { const y0 = Math.round(cv.height * y0f), c = document.createElement('canvas'); c.width = cv.width; c.height = cv.height - y0; c.getContext('2d').drawImage(cv, 0, y0, cv.width, cv.height - y0, 0, 0, cv.width, cv.height - y0); return c; };
  window.kill = (a, v) => { v.inv = 0; if (v.st === 'down' || v.st === 'getup') v.st = 'idle'; KO.tryHit(a, v, { x0: v.x - 6, x1: v.x + 6, y0: v.y + 10, y1: v.y + 40 }, { d: 999, hs: .3, kb: 80, l: 'm', unb: 1 }, a.face); };
  window.audit = (name, bad) => { KO.tb.rec(); __step(1 / 60); const b = KO.tb.get() || [], H = __g.ev('H');
    for (const t of b) if (t.x < -.5 || t.x + t.w > 240.5 || t.y < -.5 || t.y + t.h > H + .5) bad.push(name + ' OFF ' + JSON.stringify(t.s));
    for (let i = 0; i < b.length; i++) for (let j = i + 1; j < b.length; j++) { const p = b[i], q = b[j]; if (p.x < q.x + q.w - .5 && q.x < p.x + p.w - .5 && p.y < q.y + q.h - .5 && q.y < p.y + p.h - .5) bad.push(name + ' OVERLAP ' + JSON.stringify(p.s) + ' / ' + JSON.stringify(q.s)); }
    return b.length; };
};

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 440, height: 956 }, deviceScaleFactor: 1 });
  const errs = [];
  page.on('pageerror', e => errs.push('pageerror: ' + e.message));
  page.on('console', m => { if (m.type() === 'error' && !/blob|Failed to load resource|NotSupported|media/i.test(m.text())) errs.push('console: ' + m.text()); });
  await page.goto('file://' + BUILD + '?dev'); await page.waitForTimeout(700);
  await page.evaluate(() => document.querySelector('.cart[data-i="1"]').dispatchEvent(new PointerEvent('pointerdown', { bubbles: true })));
  for (let i = 0; i < 60 && (await page.evaluate(() => __g.s.state)) !== 'ko'; i++) await page.waitForTimeout(100);
  if ((await page.evaluate(() => __g.s.state)) !== 'ko') throw new Error('Knockout did not boot');
  await page.evaluate(() => { window.requestAnimationFrame = () => 0; });
  await page.waitForTimeout(100);
  await page.evaluate(KIT);
  const E = (fn, ...a) => page.evaluate(fn, ...a);
  const save = (name, dataUrl) => fs.writeFileSync(path.join(OUT, name), Buffer.from(dataUrl.split(',')[1], 'base64'));
  let fails = 0;
  const check = (name, ok, info) => { if (!ok) fails++; console.log((ok ? 'PASS ' : 'FAIL ') + name + (info !== undefined ? '  ' + JSON.stringify(info) : '')); };

  /* ---- 1. stances: every fighter idle, at 2x, plus a walk frame ---- */
  {
    const url = await E(() => {
      const fr = [];
      for (let c = 0; c < 8; c += 2) { const [a, b] = fight(c, c + 1, 0); a.x = 150; b.x = 200; for (let i = 0; i < 12; i++) __step(1 / 60); fr.push(grab(.5));
        K.right = 1; for (let i = 0; i < 9; i++) __step(1 / 60); fr.push(grab(.5)); clr(); }
      return sheet(fr, 4, 1, 'stances: idle | walk (Will/Erin, Louie/Bottie, Bibi/Corbin, Marcus/Mama)');
    });
    save('stances.png', url);
    const d = await E(() => { const S = KO.CH.map(c => c.ps.st.join(',')); return new Set(S).size; });
    check('each fighter has their own idle stance', d === 8, d);
  }

  /* ---- 2. parry ---- */
  {
    const r = await E(() => {
      const out = {}, G = KO.G;
      const hit = (a, b) => KO.tryHit(b, a, { x0: a.x - 4, x1: a.x + 20, y0: 30, y1: 42 }, { d: 8, hs: .3, kb: 110, l: 'm', key: 'k' }, -1);
      /* a) tap back 3 frames before the hit: parry */
      let [a, b] = fight(0, 3, 0); a.x = 150; b.x = 180; __upd(1 / 60);
      K.left = 1; for (let i = 0; i < 3; i++) __upd(1 / 60);
      b.st = 'atk'; const hp0 = a.hp, m0 = a.meter; out.res = hit(a, b); out.hpLost = hp0 - a.hp; out.meter = a.meter - m0; out.attacker = b.st; out.stun = b.stun;
      __step(1 / 60); const f1 = grab(.35); for (let i = 0; i < 6; i++) __step(1 / 60); const f2 = grab(.35); clr();
      /* b) back held for half a second first: an ordinary block */
      [a, b] = fight(0, 3, 0); a.x = 150; b.x = 180; K.left = 1; for (let i = 0; i < 30; i++) __upd(1 / 60); a.x = 150; b.x = 180;
      b.st = 'atk'; out.late = hit(a, b); out.lateSt = a.st; clr();
      /* c) not holding back at all: it lands */
      [a, b] = fight(0, 3, 0); a.x = 150; b.x = 180; __upd(1 / 60); const h1 = a.hp; b.st = 'atk'; out.open = hit(a, b); out.openLost = h1 - a.hp;
      /* d) unblockable can't be parried */
      [a, b] = fight(0, 3, 0); a.x = 150; b.x = 180; __upd(1 / 60); K.left = 1; for (let i = 0; i < 3; i++) __upd(1 / 60); b.st = 'atk';
      out.unb = KO.tryHit(b, a, { x0: a.x - 4, x1: a.x + 20, y0: 30, y1: 42 }, { d: 8, hs: .3, kb: 110, l: 'm', unb: 1 }, -1); clr();
      out.sheet = sheet([f1, f2], 2, 1, 'parry: the frame it happens | 6 frames later');
      return out;
    });
    save('parry.png', r.sheet); delete r.sheet;
    check('tap back just before a hit = parry (no damage, meter, attacker stunned)', r.res === 3 && r.hpLost === 0 && r.meter >= 12 && r.attacker === 'hit', r);
    check('holding back early is still a normal block', r.late === 2 && r.lateSt === 'blk');
    check('not blocking still gets hit', r.open === 1 && r.openLost > 0);
    check('unblockables cannot be parried', r.unb === 1);
  }

  /* ---- 3. wall bounce ---- */
  {
    const r = await E(() => {
      const [a, b] = fight(6, 4, 0); a.x = 250; b.x = 285; __upd(1 / 60); const fr = [];
      KO.tryHit(a, b, { x0: b.x - 6, x1: b.x + 6, y0: 20, y1: 40 }, { d: 10, la: [230, 220], l: 'm', big: 1 }, 1);
      let wb = 0, vxAfter = 0, back = 0;
      for (let i = 0; i < 60; i++) { __step(1 / 60); if (b.wb && !wb) { wb = i; vxAfter = b.vx; } if (i % 6 === 0 && fr.length < 8) fr.push(grab(.35)); if (wb && b.x < 300) back = 1; }
      return { wb, vxAfter: Math.round(vxAfter), back, endSt: b.st, sheet: sheet(fr, 4, .75, 'wall bounce: every 6th frame') };
    });
    save('wall.png', r.sheet); delete r.sheet;
    check('a hard launch into the wall bounces back once', r.wb > 0 && r.vxAfter < 0 && r.back === 1, r);
  }

  /* ---- 4. K.O. impact frame ---- */
  {
    const r = await E(() => {
      const [a, b] = fight(0, 6, 0); a.x = 150; b.x = 176; b.hp = 2; __upd(1 / 60); const fr = [];
      K.a = 1; __upd(1 / 60); K.a = 0; let ko = -1;
      for (let i = 0; i < 70; i++) { __step(1 / 60); if (KO.G.phase === 'ko' && ko < 0) ko = i; if (ko >= 0 && [1, 8, 20, 40].includes(i - ko)) fr.push(grab()); }
      return { ko, phase: KO.G.phase, sheet: sheet(fr, 4, .6, 'K.O.: +1, +8, +20, +40 frames') };
    });
    save('ko.png', r.sheet); delete r.sheet;
    check('K.O. reaches the impact frame and carries on', r.ko >= 0 && r.phase === 'ko', r);
  }

  /* ---- 5. rules ---- */
  {
    const r = await E(() => {
      const G = KO.G, out = {}, jump = () => { const [a] = G.f; let n = 0; K.up = 1; __upd(1 / 60); K.up = 0; for (let i = 0; i < 200; i++) { __upd(1 / 60); n++; if (i > 2 && a.y === 0) break; } return n; };
      KO.SV.rule = 0; fight(0, 2, 0); out.jumpNormal = jump();
      KO.SV.rule = KO.RULES.findIndex(r => r[0] === 'MOON GRAVITY'); fight(0, 2, 0); out.jumpMoon = jump();
      KO.SV.rule = KO.RULES.findIndex(r => r[0] === 'SUDDEN DEATH'); let f = fight(0, 2, 0); out.sdHp = f[0].hp;
      KO.SV.rule = KO.RULES.findIndex(r => r[0] === 'GLASS CANNON'); f = fight(0, 2, 0); f[0].x = 150; f[1].x = 176; __upd(1 / 60); const h = f[1].hp; K.a = 1; __upd(1 / 60); K.a = 0; for (let i = 0; i < 12; i++) __upd(1 / 60); out.glassJab = +(h - f[1].hp).toFixed(1);
      KO.SV.rule = KO.RULES.findIndex(r => r[0] === 'METER MADNESS'); f = fight(0, 2, 0); const m0 = f[0].meter; for (let i = 0; i < 60; i++) __upd(1 / 60); out.meterGain = Math.round(f[0].meter - m0);
      KO.SV.rule = KO.RULES.findIndex(r => r[0] === 'BIG HEADS'); f = fight(3, 6, 0); f[0].x = 150; f[1].x = 200; for (let i = 0; i < 10; i++) __step(1 / 60); const big = grab(.35);
      KO.SV.rule = 0; G.mode = 'arc'; KO.startMatch(); out.arcadeRules = Object.keys(G.mut).length;
      out.sheet = sheet([big], 1, 1, 'BIG HEADS'); return out;
    });
    save('rules.png', r.sheet); delete r.sheet;
    check('moon gravity: longer jump', r.jumpMoon > r.jumpNormal * 1.6, [r.jumpNormal, r.jumpMoon]);
    check('sudden death: 1 health', r.sdHp === 1);
    check('glass cannon: a jab does double (8)', r.glassJab === 8, r.glassJab);
    check('meter madness: meter fills by itself', r.meterGain >= 18, r.meterGain);
    check('arcade ignores house rules', r.arcadeRules === 0);
  }

  /* ---- 6. trials: screens, a clear, a fail, saving ---- */
  {
    const r = await E(() => {
      const G = KO.G, out = {}, bad = [], fr = [];
      KO.SV.tr = {}; G.scr = 'title'; G.mi = 2; G.scrT = 2; audit('title', bad); fr.push(grab());
      for (let i = 0; i < KO.TRIALS.length; i++) { G.scr = 'trials'; G.ti = i; audit('trials' + i, bad); if (i === 0 || i === 13) fr.push(grab()); }
      /* clear trial 1 on full health: gold */
      KO.trStart(0); out.vs = G.scr; audit('trial-vs', bad); for (let i = 0; i < 300 && G.scr !== 'fight'; i++) __step(1 / 60);
      for (let i = 0; i < 120; i++) __step(1 / 60); audit('trial-hud', bad); fr.push(grab());
      kill(G.f[0], G.f[1]); for (let i = 0; i < 900 && G.scr !== 'tres'; i++) __step(1 / 60);
      out.t1 = { scr: G.scr, ok: G.tres && G.tres.ok, gold: G.tres && G.tres.gold, saved: KO.SV.tr.t01 }; G.scrT = 1; audit('tres-gold', bad); fr.push(grab());
      /* trial 2 won without the 4-hit combo: not cleared */
      KO.trStart(1); for (let i = 0; i < 300 && G.scr !== 'fight'; i++) __step(1 / 60); for (let i = 0; i < 120; i++) __step(1 / 60);
      kill(G.f[0], G.f[1]); for (let i = 0; i < 900 && G.scr !== 'tres'; i++) __step(1 / 60);
      out.t2 = { ok: G.tres.ok, won: G.tres.won, saved: KO.SV.tr.t02 || 0 }; G.scrT = 1; audit('tres-fail', bad); fr.push(grab());
      /* trial 1 lost */
      KO.trStart(0); for (let i = 0; i < 300 && G.scr !== 'fight'; i++) __step(1 / 60); for (let i = 0; i < 120; i++) __step(1 / 60);
      kill(G.f[1], G.f[0]); for (let i = 0; i < 900 && G.scr !== 'tres'; i++) __step(1 / 60);
      out.t3 = { ok: G.tres.ok, saved: KO.SV.tr.t01 }; audit('tres-lost', bad);
      /* pause menu in a trial */
      KO.trStart(2); for (let i = 0; i < 300 && G.scr !== 'fight'; i++) __step(1 / 60); for (let i = 0; i < 120; i++) __step(1 / 60); G.scr = 'pause'; G.mi = 0; audit('pause-trial', bad);
      G.scr = 'how'; G.back = 'title'; audit('how', bad); fr.push(grab());
      out.stored = JSON.parse(localStorage.getItem('pl-alt:ncko-v1') || localStorage.getItem('ncko-v1') || '{}').tr;
      out.bad = bad.filter(b => !/KNOCKOUT|ROUND|PAUSED/.test(b)); out.sheet = sheet(fr, 4, .6, 'title | trials | trials (14) | trial HUD | gold | not yet | how to play');
      KO.SV.tr = {}; G.scr = 'title'; return out;
    });
    save('trials.png', r.sheet); delete r.sheet;
    check('trial 1 cleared on full health = gold, saved as 2', r.t1.scr === 'tres' && r.t1.ok && r.t1.gold && r.t1.saved === 2, r.t1);
    check('trial 2 won without its goal = not cleared', r.t2.won && !r.t2.ok && r.t2.saved === 0, r.t2);
    check('losing keeps the earlier star', !r.t3.ok && r.t3.saved === 2, r.t3);
    check('trial stars are in the save', r.stored && r.stored.t01 === 2, r.stored);
    check('text audit of the new screens', r.bad.length === 0, r.bad);
  }

  /* ---- 7. an old save (no rule / tr fields) still loads ---- */
  {
    const r = await E(() => { const s = KO.SV; return { rule: s.rule, tr: typeof s.tr, w: typeof s.w }; });
    check('save has defaults for the new fields', r.rule !== undefined && r.tr === 'object', r);
  }

  /* ---- 8. cpu vs cpu soak: 4 fights at hard, with rules cycling, no errors ---- */
  {
    const r = await E(() => {
      const G = KO.G, out = { fights: 0, parries: 0, walls: 0 };
      for (let n = 0; n < 4; n++) { KO.SV.diff = 2; KO.SV.rule = [0, 1, 2, 7][n]; G.mode = 'vs'; G.p1 = n * 2; G.p2 = n * 2 + 1; G.stage = n; KO.startMatch(); G.f[0].cpu = true;
        for (let i = 0; i < 60 * 280 && G.scr === 'fight'; i++) { __upd(1 / 60); if (i % 30 === 0) __step(0); for (const q of G.pt) { if (q.txt === 'PARRY!' && !q.seen) { q.seen = 1; out.parries++; } if (q.txt === 'WALL!' && !q.seen) { q.seen = 1; out.walls++; } } }
        if (G.scr !== 'fight') out.fights++; }
      KO.SV.diff = 1; KO.SV.rule = 0; return out;
    });
    check('4 cpu-vs-cpu fights finish (hard; normal, turbo, moon, chaos)', r.fights === 4, r);
  }

  /* ---- 9. pass 2: THE FINAL BET, WAR CRIMINAL, IRON DOME as a counter ---- */
  {
    const r = await E(() => {
      const G = KO.G, out = {}, ix = id => KO.CH.findIndex(c => c.id === id);
      const full = (p1, p2, times) => { KO.SV.rule = 0; const [a, v] = fight(ix(p1), ix(p2), 0); a.x = 140; v.x = 200; a.meter = 100; const hp = v.hp; KO.startSuper(a); const kind = G.cine && G.cine.kind, say = G.cine && G.cine.say, fr = []; let t = 0, i = 0;
        while (G.cine && t < 7) { __step(1 / 60); t += 1 / 60; if (i < times.length && t >= times[i]) { fr.push(grab()); i++; } } for (let k = 0; k < 50; k++) __step(1 / 60); return { kind, say, dmg: hp - v.hp, st: a.st, fr }; };
      const half = (p1) => { const [a, v] = fight(ix(p1), ix('will'), 0); a.x = 120; v.x = 190; a.meter = 60; const hp = v.hp; KO.startSuper(a); const cine = !!G.cine; for (let k = 0; k < 240; k++) __step(1 / 60); return { cine, dmg: +(hp - v.hp).toFixed(1), meter: Math.round(a.meter) }; };
      const b1 = full('marcus', 'will', [.3, 1.2, 2.0, 2.3, 2.9, 4.1]), b2 = full('marcus', 'erin', []), w1 = full('bibi', 'will', [.3, 1.4, 2.2, 3.0, 3.3, 4.3]);
      out.bet = { kind: b1.kind, say: b1.say, dmg: b1.dmg, st: b1.st }; out.betOther = b2.say; out.war = { kind: w1.kind, dmg: w1.dmg, st: w1.st };
      out.halfMarcus = half('marcus'); out.halfBibi = half('bibi');
      { const [a, v] = fight(ix('will'), ix('bibi'), 0); a.x = 150; v.x = 178; KO.startSpecial(v, 2); for (let i = 0; i < 10; i++) __step(1 / 60); const h0 = v.hp, a0 = a.hp; K.a = 1; __step(1 / 60); K.a = 0; for (let i = 0; i < 24; i++) __step(1 / 60); out.dome = { bibiLost: h0 - v.hp, willLost: +(a0 - a.hp).toFixed(1), willSt: a.st }; }
      { const [a, v] = fight(ix('will'), ix('bibi'), 0); a.x = 150; v.x = 178; KO.startSpecial(v, 2); for (let i = 0; i < 38; i++) __step(1 / 60); const h1 = v.hp; K.a = 1; __step(1 / 60); K.a = 0; for (let i = 0; i < 14; i++) __step(1 / 60); out.whiff = +(h1 - v.hp).toFixed(1); }
      out.heads = { erin: KO.CH[ix('erin')].head.height, bibi: KO.CH[ix('bibi')].head.width };
      out.sheet = sheet(b1.fr.concat(w1.fr), 6, .5, 'THE FINAL BET (vs Will) | WAR CRIMINAL');
      return out;
    });
    save('supers2.png', r.sheet); delete r.sheet;
    check('THE FINAL BET: full meter, 30 damage, Marcus back to idle', r.bet.kind === 'bet' && r.bet.dmg === 30 && r.bet.st === 'idle', r.bet);
    check('against Will he says TIME TO REMOVE THE J; against others something else', r.bet.say === 'TIME TO REMOVE THE J.' && !!r.betOther && r.betOther !== r.bet.say, [r.bet.say, r.betOther]);
    check('WAR CRIMINAL: full meter, 30 damage, Bibi back to idle', r.war.kind === 'war' && r.war.dmg === 30 && r.war.st === 'idle', r.war);
    check('half meter still plays HYDRO JET and COALITION (no cinematic, 50 meter spent)', !r.halfMarcus.cine && !r.halfBibi.cine && r.halfMarcus.meter === 10 && r.halfBibi.meter === 10 && r.halfMarcus.dmg > 0 && r.halfBibi.dmg > 0, [r.halfMarcus, r.halfBibi]);
    check('IRON DOME counters a jab: Bibi takes nothing, the attacker is hit and launched', r.dome.bibiLost === 0 && r.dome.willLost > 7 && r.dome.willSt === 'knock', r.dome);
    check('IRON DOME whiffed: he can be hit afterwards', r.whiff > 0, r.whiff);
    check('new heads are in (Erin 13 rows, Bibi 16 wide)', r.heads.erin === 13 && r.heads.bibi === 16, r.heads);
  }

  check('no page errors', errs.length === 0, errs);
  await browser.close();
  console.log(fails ? fails + ' FAILED' : 'all passed');
  process.exit(fails ? 1 : 0);
}
main().catch(e => { console.error(e); process.exit(1); });
