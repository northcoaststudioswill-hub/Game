/* Knockout lab for the ALT build: measures how the fighting feels and saves frame sheets.
   Run from the repo root:  node alt/tests/ko_lab.js [build.html] [outDir]
   Default build: alt/games/pocket-lantern-alt.html. Output: alt/playtest/ko/ (PNG sheets + metrics.json)

   What it does, with the game loop stepped by hand at 60 fps (deterministic, no real-time waits):
   1. Metrics: jump airtime/apex, attack startup, hit slide distance, launcher height/airtime,
      how many frames a pose takes to settle (pose tween), camera.
   2. Sheets: every Nth frame of a move or a CPU-vs-CPU fight laid out in a grid, so motion can be judged by eye.
   3. Page errors. */
const { chromium } = require('playwright');
const path = require('path'), fs = require('fs');
const BUILD = path.resolve(process.argv[2] || path.join(__dirname, '../games/pocket-lantern-alt.html'));
const OUT = path.resolve(process.argv[3] || path.join(__dirname, '../playtest/ko'));
const ONLY = process.env.ONLY || ''; // comma list of sections to run: metrics,moves,fight,screens

const KIT = () => {
  __g.ev("window.__step=(dt)=>{update(dt);g.setTransform(2,0,0,2,0,0);g.imageSmoothingEnabled=false;draw();for(const k in keys)prev[k]=keys[k]}");
  __g.ev("window.__upd=(dt)=>{update(dt);for(const k in keys)prev[k]=keys[k]}");
  window.KO = __g.KO._; window.K = __g.keys;
  window.clr = () => { for (const k in K) K[k] = 0; };
  window.cv = document.getElementById('screen');
  window.fight = (p1, p2, stage, both) => {
    const G = KO.G; G.p1 = p1; G.p2 = p2; G.stage = stage; G.mode = 'vs'; KO.startMatch();
    G.f[0].cpu = !!both; if (!both) G.f[1].dummy = 1; G.phase = 'go'; G.pT = 0; clr();
    for (let i = 0; i < 20; i++) __step(1 / 60);
    return G.f;
  };
  /* sheet: capture frames into a grid canvas, return a PNG data URL */
  window.sheet = (frames, cols, scale = 1, label) => {
    const w = cv.width, h = cv.height, rows = Math.ceil(frames.length / cols);
    const s = document.createElement('canvas'); s.width = cols * w * scale + (cols + 1) * 4; s.height = rows * h * scale + (rows + 1) * 4 + (label ? 22 : 0);
    const x = s.getContext('2d'); x.fillStyle = '#222'; x.fillRect(0, 0, s.width, s.height); x.imageSmoothingEnabled = false;
    if (label) { x.fillStyle = '#fff'; x.font = '16px monospace'; x.fillText(label, 6, 16); }
    frames.forEach((f, i) => { const c = i % cols, r = (i / cols) | 0; x.drawImage(f, 4 + c * (w * scale + 4), (label ? 22 : 0) + 4 + r * (h * scale + 4), w * scale, h * scale); });
    return s.toDataURL('image/png');
  };
  window.grab = () => { const c = document.createElement('canvas'); c.width = cv.width; c.height = cv.height; c.getContext('2d').drawImage(cv, 0, 0); return c; };
  /* crop around the fighters: the bottom part of the screen */
  window.grabCrop = (y0f = .35) => { const y0 = Math.round(cv.height * y0f), c = document.createElement('canvas'); c.width = cv.width; c.height = cv.height - y0; c.getContext('2d').drawImage(cv, 0, y0, cv.width, cv.height - y0, 0, 0, cv.width, cv.height - y0); return c; };
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
  if ((await page.evaluate(() => __g.s.state)) !== 'ko') throw new Error('Knockout did not boot: ' + await page.evaluate(() => __g.s.state));
  await page.evaluate(() => { window.requestAnimationFrame = () => 0; });
  await page.waitForTimeout(100);
  await page.evaluate(KIT);
  const E = (fn, ...a) => page.evaluate(fn, ...a);
  const save = async (name, dataUrl) => fs.writeFileSync(path.join(OUT, name), Buffer.from(dataUrl.split(',')[1], 'base64'));
  const want = s => !ONLY || ONLY.split(',').includes(s);
  const metrics = {};

  if (want('metrics')) {
    /* jump: neutral jump from idle */
    metrics.jump = await E(() => {
      const [a] = fight(0, 2, 0); a.x = 100; a.o.x = 260; a.o.cpu = 0; a.o.I = { l: 0, r: 0, u: 0, d: 0, pa: 0, pb: 0, px: 0, py: 0, ps: 0 };
      a.o.cpu = true; KO.G.f[1].cpu = true; // cpu flag but we zero its brain below
      const ys = []; K.up = 1; __upd(1 / 60); K.up = 0;
      for (let i = 0; i < 120; i++) { a.o.st = 'idle'; ys.push(+a.y.toFixed(1)); __upd(1 / 60); if (i > 2 && a.y === 0) break; }
      return { frames: ys.length, apex: Math.max(...ys), ys };
    });
    /* pose settle: frames for the drawn pose to get within 1px of the attack pose after it starts */
    metrics.poseSettle = await E(() => {
      const [a] = fight(0, 2, 0); a.o.x = a.x + 200; KO.G.f[1].cpu = false;
      K.a = 1; __upd(1 / 60); K.a = 0; const T = KO.PS.p1, out = [];
      for (let i = 0; i < 30; i++) { const d = Math.max(...a.pose.map((v, k) => Math.abs(v - T[k]))); out.push(+d.toFixed(1)); __upd(1 / 60); }
      return out;
    });
    /* hit slide + hitstun: P1 jab on idle P2 */
    metrics.hit = await E(() => {
      const [a, b] = fight(0, 2, 0); b.cpu = false; a.x = 150; b.x = 172; const x0 = b.x;
      K.a = 1; __upd(1 / 60); K.a = 0; let f = 0, hitF = -1, endF = -1;
      for (; f < 90; f++) { __upd(1 / 60); if (hitF < 0 && b.st === 'hit') hitF = f; if (hitF >= 0 && b.st !== 'hit') { endF = f; break; } }
      return { startupFrames: hitF, stunFrames: endF - hitF, slidePx: +(b.x - x0).toFixed(1) };
    });
    /* launcher: down+A */
    metrics.launch = await E(() => {
      const [a, b] = fight(0, 2, 0); b.cpu = false; a.x = 150; b.x = 172;
      K.down = 1; __upd(1 / 60); __upd(1 / 60); K.a = 1; __upd(1 / 60); K.a = 0; for (let i = 0; i < 6; i++) __upd(1 / 60); K.down = 0;
      let apex = 0, f = 0, air = 0, x0 = b.x;
      for (; f < 240; f++) { __upd(1 / 60); apex = Math.max(apex, b.y); if (b.y > 0) air++; if (air && b.st === 'down') break; }
      return { apex: Math.round(apex), airFrames: air, travel: Math.round(b.x - x0) };
    });
    /* juggle: launcher, then jump forward + B. Does the air hit connect? Tries a few jump delays. */
    metrics.juggle = await E(() => {
      const res = [];
      for (const wait of [0, 2, 4, 6]) {
        const [a, b] = fight(0, 2, 0); a.x = 150; b.x = 172;
        K.down = 1; __upd(1 / 60); __upd(1 / 60); K.a = 1; __upd(1 / 60); K.a = 0;
        let f = 0; while (b.st !== 'knock' && f < 30) { __upd(1 / 60); f++; } K.down = 0;
        for (let i = 0; i < wait; i++) __upd(1 / 60);
        const hp = b.hp; K.up = 1; K.right = 1; for (let i = 0; i < 40 && a.st !== 'jump'; i++) __upd(1 / 60); K.up = 0;
        let hit = 0; for (let i = 0; i < 40; i++) { if (a.st === 'jump' && a.y > 10 && !a.mv) K.b = 1; __upd(1 / 60); K.b = 0; if (b.hp < hp) { hit = 1; break; } }
        K.right = 0; res.push(wait + ':' + (hit ? 'HIT' : 'miss'));
      }
      return res.join(' ');
    });
    metrics.walkPxPerSec = await E(() => { const [a] = fight(0, 2, 0); KO.G.f[1].cpu = false; a.o.x = 320; const x0 = a.x; K.right = 1; for (let i = 0; i < 60; i++) __upd(1 / 60); K.right = 0; return Math.round(a.x - x0); });
    fs.writeFileSync(path.join(OUT, 'metrics.json'), JSON.stringify(metrics, null, 1));
    console.log(JSON.stringify({ jump: { frames: metrics.jump.frames, apex: metrics.jump.apex }, poseSettle: metrics.poseSettle.slice(0, 10), hit: metrics.hit, launch: metrics.launch, juggle: metrics.juggle, walk: metrics.walkPxPerSec }));
  }

  if (want('moves')) {
    /* each move of one fighter, every 2nd frame */
    for (const [ci, name] of [[0, 'will'], [6, 'marcus'], [2, 'louie']]) {
      const url = await E(ci => {
        const frames = [];
        const run = (keysDown, n, every = 2) => { const [a, b] = fight(ci, 1, 0); b.cpu = false; a.x = 150; b.x = 178; for (const k of keysDown) K[k] = 1; __step(1 / 60); for (const k of keysDown) if (k !== 'down') K[k] = 0; for (let i = 0; i < n; i++) { __step(1 / 60); if (i % every === 0) frames.push(grabCrop(.45)); } clr(); };
        run(['a'], 16); run(['b'], 16); run(['down', 'a'], 30); run(['up'], 36, 3);
        return sheet(frames, 8, 1, 'moves: jab | heavy | launcher | jump (every 2nd/3rd frame)');
      }, ci);
      await save(`moves_${name}.png`, url);
    }
  }

  if (want('zoom')) {
    /* close-ups: every frame of a heavy kick, cropped to the fighters and scaled up */
    const url = await E(() => {
      const frames = []; const [a, b] = fight(0, 6, 0); a.x = 150; b.x = 182;
      const crop = () => { const z = cv.width / 240, c = document.createElement('canvas'), x0 = Math.round((a.x - KO.cam - 60) * z), y0 = Math.round(cv.height * .5); c.width = 160 * z; c.height = cv.height - y0 - 30 * z; c.getContext('2d').drawImage(cv, Math.max(0, x0), y0, c.width, c.height, 0, 0, c.width, c.height); return c; };
      K.b = 1; __step(1 / 60); K.b = 0; for (let i = 0; i < 18; i++) { __step(1 / 60); frames.push(crop()); }
      return sheet(frames, 6, 1, 'heavy kick, every frame');
    });
    await save('zoom_kick.png', url);
  }

  if (want('stages')) {
    const url = await E(() => { const fr = []; for (let st = 0; st < KO.ST.length; st++) { fight(0, 2, st); for (let i = 0; i < 30; i++) __step(1 / 60); fr.push(grab()); } return sheet(fr, 4, .75, 'all stages'); });
    await save('stages.png', url);
  }

  if (want('modes')) {
    const r = await E(() => {
      const G = KO.G, out = {}, frames = [];
      const run = (cond, max = 60 * 30) => { let i = 0; while (!cond() && i < max) { __step(1 / 60); i++; } return i; };
      /* title shows the new modes */
      G.scr = 'title'; G.mi = 1; G.scrT = 2; __step(1 / 60); frames.push(grab());
      /* survival: win one fight (cpu at 1 hp), health carries over */
      G.mode = 'surv'; G.p1 = 0; G.surv = { n: 0, hp: 100 }; KO.nextSurv(); run(() => G.scr === 'fight');
      const ko = (att, vic) => { vic.hp = .5; KO.tryHit(att, vic, { x0: vic.x - 6, x1: vic.x + 6, y0: 0, y1: 50 }, { d: 10, hs: .3, kb: 60, l: 'm', unb: 1 }, att.x < vic.x ? 1 : -1); };
      G.phase = 'go'; G.f[0].hp = 70; ko(G.f[0], G.f[1]);
      run(() => G.scr !== 'fight'); out.afterWin = { scr: G.scr, n: G.surv.n, carryHp: G.surv.hp };
      run(() => G.scr === 'fight'); G.phase = 'go'; out.nextFightHp = Math.round(G.f[0].hp); out.opponent = G.f[1].c.n;
      ko(G.f[1], G.f[0]); run(() => G.scr !== 'fight'); out.afterLoss = { scr: G.scr, best: KO.SV.surv };
      for (let i = 0; i < 20; i++) __step(1 / 60); frames.push(grab());
      /* training */
      G.mode = 'train'; G.p1 = 0; G.p2 = 6; G.dmy = 0; KO.startMatch(); G.phase = 'go'; G.pT = 0;
      const [a, b] = G.f; a.x = 150; b.x = 172;
      for (const k of ['a', 'a', 'a']) { K[k] = 1; __step(1 / 60); K[k] = 0; for (let i = 0; i < 9; i++) __step(1 / 60); }
      for (let i = 0; i < 6; i++) __step(1 / 60);
      out.train = { hpAfterCombo: Math.round(b.hp), combo: a.combo, cdmg: Math.round(a.cdmg || 0), timer: G.timer };
      frames.push(grab());
      run(() => false, 60 * 3); out.train.hpAfterRest = Math.round(b.hp);
      b.hp = 1; a.x = 150; b.x = 172; K.b = 1; __step(1 / 60); K.b = 0; run(() => false, 60); out.train.minHp = Math.round(b.hp);
      /* pause: switch dummy to BLOCK, then a jab is blocked */
      K.start = 1; __step(1 / 60); K.start = 0; __step(1 / 60); G.mi = 1; K.a = 1; __step(1 / 60); K.a = 0; __step(1 / 60); frames.push(grab());
      out.train.dummyMode = G.dmy; K.start = 1; __step(1 / 60); K.start = 0; __step(1 / 60);
      a.x = 150; b.x = 172; run(() => false, 30); K.a = 1; __step(1 / 60); K.a = 0; let blocked = 0; for (let i = 0; i < 20; i++) { __step(1 / 60); if (b.st === 'blk') blocked = 1; } out.train.blocked = blocked;
      out.sheet = sheet(frames, 4, .75, 'title | survival result | training combo | training pause');
      return out;
    });
    await save('modes.png', r.sheet); delete r.sheet; console.log('modes', JSON.stringify(r));
  }

  if (want('text')) {
    /* every menu screen at this phone size: text inside the screen, no two boxes overlapping */
    const r = await E(() => {
      const G = KO.G, bad = [], seen = [];
      const audit = (name) => { KO.tb.rec(); __step(1 / 60); const b = KO.tb.get() || []; seen.push(name + ':' + b.length);
        for (const t of b) if (t.x < -.5 || t.x + t.w > 240.5 || t.y < -.5 || t.y + t.h > KO.G.H + .5) bad.push(name + ' OFF ' + JSON.stringify(t.s) + ' x' + t.x.toFixed(0) + ' w' + t.w.toFixed(0));
        for (let i = 0; i < b.length; i++) for (let j = i + 1; j < b.length; j++) { const p = b[i], q = b[j]; if (p.x < q.x + q.w - .5 && q.x < p.x + p.w - .5 && p.y < q.y + q.h - .5 && q.y < p.y + p.h - .5) bad.push(name + ' OVERLAP ' + JSON.stringify(p.s) + ' / ' + JSON.stringify(q.s)); } };
      G.H = __g.ev('H');
      for (let d = 0; d < 3; d++) { KO.SV.diff = d; G.scr = 'title'; G.mi = 0; G.scrT = 2; KO.SV.surv = 12; audit('title' + d); }
      G.scr = 'how'; audit('how');
      G.scr = 'sel'; G.pick = 0; for (let c = 0; c < 8; c++) { G.cur = c; audit('sel' + c); } G.pick = 1; audit('sel-opp');
      for (let c = 0; c < 8; c++) { G.mc = c; G.scr = 'moves'; G.scrT = 1; audit('moves' + c); }
      G.mode = 'vs'; G.p1 = 0; G.p2 = 6; G.scr = 'stage'; for (let st = 0; st < KO.ST.length; st++) { G.stage = st; audit('stage' + st); }
      G.scr = 'vs'; G.scrT = 1; audit('vs');
      KO.startMatch(); G.scr = 'pause'; G.mi = 0; audit('pause');
      G.mode = 'train'; KO.startMatch(); G.scr = 'pause'; audit('pause-train');
      for (const [m, w] of [['vs', true], ['vs', false], ['arc', false]]) { G.mode = m; G.won = w; G.scr = 'res'; G.cont = 9; audit('res-' + m + w); }
      G.mode = 'surv'; G.surv = { n: 7, hp: 50 }; G.won = false; G.scr = 'res'; audit('res-surv');
      for (let c = 0; c < 8; c++) { G.p1 = c; G.scr = 'ending'; G.scrT = 3; audit('ending' + c); }
      return { bad, n: seen.length };
    });
    console.log('text audit:', r.n, 'screens,', r.bad.length ? r.bad.join('\n  ') : 'all clear');
  }

  if (want('drama')) {
    const url = await E(() => {
      const G = KO.G, fr = [];
      G.mode = 'vs'; G.p1 = 6; G.p2 = 0; G.stage = 0; G.scr = 'vs'; G.scrT = 0; for (let i = 0; i < 40; i++) __step(1 / 60); fr.push(grab());
      KO.startMatch(); G.phase = 'go'; const [a, b] = G.f; b.dummy = 1; a.x = 150; b.x = 176; a.wins = 1;
      b.hp = 3; K.b = 1; __step(1 / 60); K.b = 0;
      for (let i = 0; i < 360; i++) { __step(1 / 60); if ([10, 40, 110, 200, 300].includes(i)) fr.push(grab()); }
      a.wantFin = 1; for (let i = 0; i < 260; i++) { __step(1 / 60); if (G.phase === 'finish' && !G.fin) { K.x = 1; __step(1 / 60); K.x = 0; } if ([60, 140, 230].includes(i)) fr.push(grab()); }
      return sheet(fr, 5, .6, 'vs | KO hit | slowmo | KO | finish em | ... finisher');
    });
    await save('drama.png', url);
  }

  if (want('heads')) {
    /* every fighter's head at 8x, and the select screen, for likeness work */
    const url = await E(() => {
      const c = document.createElement('canvas'), S = 8, n = KO.CH.length; c.width = n * (18 * S) + 10; c.height = 22 * S; const x = c.getContext('2d'); x.imageSmoothingEnabled = false;
      x.fillStyle = '#3a3a48'; x.fillRect(0, 0, c.width, c.height);
      KO.CH.forEach((ch, i) => { x.fillStyle = ch.bg; x.fillRect(5 + i * 18 * S, 5, 17 * S, 17 * S); x.drawImage(ch.head, 5 + i * 18 * S + S, 5 + S, ch.head.width * S, ch.head.height * S); x.fillStyle = '#fff'; x.font = '20px monospace'; x.fillText(ch.n, 8 + i * 18 * S, 20 * S + 8); });
      return c.toDataURL('image/png');
    });
    await save('heads.png', url);
    const sel = await E(() => { KO.G.scr = 'sel'; KO.G.pick = 0; KO.G.cur = 0; KO.G.scrT = 2; for (let i = 0; i < 3; i++) __step(1 / 60); return sheet([grab()], 1, 1); });
    await save('select.png', sel);
  }

  if (want('supers')) {
    /* HASBARA cinematic, Bike Lane, King Bibi's specials and super: frame sheets + damage numbers */
    const r = await E(() => {
      const G = KO.G, out = {};
      const shoot = (setup, frames, every, label, cols = 6, sc = .6) => { const fr = []; setup(); for (let i = 0; i < frames; i++) { __step(1 / 60); if (i % every === 0) fr.push(grab()); } return sheet(fr, cols, sc, label); };
      /* HASBARA */
      let hp0;
      out.hasbara = shoot(() => { const [a, b] = fight(0, 4, 0); a.x = 140; b.x = 190; hp0 = b.hp; a.meter = 100; K.sel = 1; __step(1 / 60); K.sel = 0; }, 260, 8, 'HASBARA: every 8th frame', 6, .55);
      out.hasbaraDmg = Math.round(hp0 - G.f[1].hp);
      { const keys = [20, 60, 104, 124, 160, 196], fr = []; const [a, b] = fight(0, 4, 0); a.x = 140; b.x = 190; a.meter = 100; K.sel = 1; __step(1 / 60); K.sel = 0;
        for (let i = 0; i <= 200; i++) { __step(1 / 60); if (keys.includes(i)) fr.push(grab()); } out.hasbaraKeys = sheet(fr, 3, 1, 'HASBARA key frames: cut-in | desk | sent | mind | self-hit | final'); } out.cineDone = !G.cine; out.vSt = G.f[1].st; out.willMeter = G.f[0].meter;
      /* Bike Lane at half meter */
      out.bike = shoot(() => { const [a, b] = fight(0, 6, 0); a.x = 110; b.x = 200; hp0 = b.hp; a.meter = 60; K.sel = 1; __step(1 / 60); K.sel = 0; }, 90, 6, 'BIKE LANE (half meter): every 6th frame', 5, .6);
      out.bikeDmg = Math.round(hp0 - G.f[1].hp); out.bikeMeterLeft = Math.round(G.f[0].meter); out.willBack = !G.f[0].hide && G.f[0].st;
      /* King Bibi: X red line (low), Y iron dome (eats a projectile), super coalition */
      out.bibiX = shoot(() => { const [a, b] = fight(4, 0, 8); a.x = 120; b.x = 190; hp0 = b.hp; K.x = 1; __step(1 / 60); K.x = 0; }, 48, 6, 'KING BIBI X: RED LINE', 4, .6);
      out.redLineDmg = Math.round(hp0 - G.f[1].hp);
      out.bibiY = shoot(() => { const [a, b] = fight(4, 2, 8); a.x = 150; b.x = 220; b.dummy = 0; b.cpu = true; KO.startSpecial(b, 1); b.dummy = 1; for (let i = 0; i < 6; i++) __step(1 / 60); K.y = 1; __step(1 / 60); K.y = 0; }, 48, 6, 'KING BIBI Y: IRON DOME vs ZOOM', 4, .6);
      out.bibiSuper = shoot(() => { const [a, b] = fight(4, 0, 8); a.x = 90; b.x = 190; hp0 = b.hp; a.meter = 100; K.sel = 1; __step(1 / 60); K.sel = 0; }, 150, 10, 'KING BIBI SUPER: COALITION', 5, .6);
      out.coalitionDmg = Math.round(hp0 - G.f[1].hp);
      return out;
    });
    for (const k of ['hasbara', 'hasbaraKeys', 'bike', 'bibiX', 'bibiY', 'bibiSuper']) { await save('super_' + k + '.png', r[k]); delete r[k]; }
    console.log('supers', JSON.stringify(r));
  }

  if (want('lineup')) {
    /* every fighter standing, at 2x, in idle / walk / jab / heavy / fwd+B poses */
    const url = await E(() => {
      const g = cv.getContext('2d'), n = KO.CH.length, rows = ['st', 'w2', 'p1', 'k', 'fk'], out = [];
      for (const pose of rows) {
        g.setTransform(2, 0, 0, 2, 0, 0); g.imageSmoothingEnabled = false; g.fillStyle = '#cfc8b8'; g.fillRect(0, 0, 240, 400); g.fillStyle = '#a89c84'; g.fillRect(0, 150, 240, 4);
        g.fillRect(0, 290, 240, 4); KO.CH.forEach((c, i) => { const P = (c.ps && c.ps[pose]) || KO.PS[pose] || KO.PS.st; KO.poser(i, 30 + (i % 4) * 58, i < 4 ? 150 : 290, 1, P, 2); });
        g.setTransform(1, 0, 0, 1, 0, 0); const c2 = document.createElement('canvas'); c2.width = cv.width; c2.height = 300 * 2; c2.getContext('2d').drawImage(cv, 0, 0); out.push(c2);
      }
      return sheet(out, 5, .9, 'lineup at 2x: idle | walk | jab | heavy | fwd+B');
    });
    await save('lineup.png', url);
  }

  if (want('fk')) {
    const r = await E(() => {
      const out = {}, fr = [];
      for (const ci of [0, 1, 2, 3, 6]) {
        const [a, b] = fight(ci, 4, 0); a.x = 140; b.x = 186; const hp = b.hp;
        K.right = 1; __step(1 / 60); K.b = 1; __step(1 / 60); K.b = 0;
        for (let i = 0; i < 30; i++) { __step(1 / 60); if (i === 6 || i === 12 || i === 20) fr.push(grabCrop(.45)); }
        K.right = 0; out[KO.CH[ci].n] = { move: a.c.mn.fk, dmg: Math.round(hp - b.hp), victim: b.st };
      }
      out.sheet = sheet(fr, 6, 1, 'FWD+B for Will, Erin, Louie, Bottie, Marcus (3 frames each)'); return out;
    });
    await save('fk.png', r.sheet); delete r.sheet; console.log('fk', JSON.stringify(r));
  }

  if (want('fight')) {
    const url = await E(() => {
      fight(6, 0, 0, true); const frames = [];
      for (let i = 0; i < 60 * 14; i++) { __step(1 / 60); if (i % 20 === 0) frames.push(grab()); }
      return sheet(frames, 7, .5, 'cpu vs cpu, every 1/3 s');
    });
    await save('fight_sheet.png', url);
  }

  if (want('screens')) {
    const shots = [
      ['title', () => { KO.G.scr = 'title'; KO.G.scrT = 2; }],
      ['select', () => { KO.G.scr = 'sel'; KO.G.pick = 0; KO.G.scrT = 2; }],
      ['fight', () => { fight(0, 2, 0); for (let i = 0; i < 40; i++) __step(1 / 60); }],
    ];
    for (const [n, fn] of shots) {
      const url = await E(src => { eval('(' + src + ')')(); for (let i = 0; i < 4; i++) __step(1 / 60); return sheet([grab()], 1, 1); }, fn.toString());
      await save('screen_' + n + '.png', url);
    }
  }
  console.log('errors:', errs.length ? errs.join(' | ') : 'none');
  await browser.close();
}
main().catch(e => { console.error(e); process.exit(1); });
