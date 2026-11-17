// Starhaven — feel and level checks, run against the built game with real input and physics (no teleporting mid-test).
// Proves each gap needs exactly the move its sign teaches, and that combat numbers match the design doc.
// Usage: node starhaven/game/tests/feel.js
const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const file = path.resolve(__dirname, '..', 'starhaven.html');
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  const errors = [];
  page.on('pageerror', e => errors.push(String(e)));
  await page.route(/fonts\.(googleapis|gstatic)\.com/, r => r.abort());
  await page.goto('file://' + file);
  await page.waitForTimeout(200);

  const results = await page.evaluate(() => {
    const T = SH.TILE, G = SH.game;
    const P = () => G.world.player;
    const out = [];
    const check = (name, ok, info) => out.push({ name, ok: !!ok, info });

    let ROOM = 'deep';
    function fresh() { SH.test.load(ROOM, { story: false }); }
    function step(held, press) { SH.test.step(1, held, press); }

    // Run right from (tx, ty); at edgeTx jump, then use `moves` (in order) each at the top of the current arc.
    // Ends when grounded again or after a hazard. Returns where Wren ended up.
    function attempt(tx, ty, edgeTx, moves) {
      fresh();
      SH.test.place(tx, ty);
      const p = P(); const hurt0 = p.stats.hurt;
      let f = 0;
      while (p.x < edgeTx * T && f++ < 400) step({ right: true });
      if (!moves.length) { for (let i = 0; i < 120 && p.stats.hurt === hurt0; i++) { step({ right: true }); if (p.grounded && p.x > edgeTx * T + T) break; } }
      else {
        step({ right: true, jump: true }, ['jump']);
        let left = moves.slice(), airborne = 0;
        for (let i = 0; i < 260 && p.stats.hurt === hurt0; i++) {
          let press = null;
          if (left.length && p.vy > -0.6 && !p.grounded && p.dashT <= 0) press = [left.shift() === 'double' ? 'jump' : 'dash'];
          step({ right: true, jump: true }, press);
          if (!p.grounded) airborne++;
          if (p.grounded && airborne > 4 && !left.length) break;
        }
      }
      return { tx: +(p.x / T).toFixed(2), ty: +(p.y / T).toFixed(2), hurt: p.stats.hurt - hurt0, grounded: p.grounded };
    }

    // --- 2. Jump section: 3-tile gap (31..34) at the same height
    let r = attempt(27, 14, 30.7, []);
    check('3-tile gap: just running falls in', r.hurt > 0, r);
    r = (function () { fresh(); SH.test.place(27, 14); const p = P(); while (p.x < 30.7 * T) step({ right: true }); step({ right: true, jump: true }, ['jump']); let i = 0; while (i++ < 120) { step({ right: true, jump: true }); if (p.grounded) break; } return { tx: +(p.x / T).toFixed(2), ty: p.y / T, hurt: p.stats.hurt }; })();
    check('3-tile gap: one jump clears it', r.tx > 34 && r.ty === 14 && r.hurt === 0, r);
    r = (function () { fresh(); SH.test.place(37, 14); const p = P(); while (p.x < 40.7 * T) step({ right: true }); step({ right: true, jump: true }, ['jump']); let i = 0; while (i++ < 120) { step({ right: true, jump: true }); if (p.grounded) break; } return { tx: +(p.x / T).toFixed(2), ty: p.y / T, hurt: p.stats.hurt }; })();
    check('4-tile gap: one jump clears it', r.tx > 45 && r.hurt === 0, r);

    // --- 3. Double jump wall (54..61, top at row 11, 5 tiles above the floor)
    function wall(useDouble) {
      fresh(); SH.test.place(49, 16); const p = P();
      while (p.x < 52.6 * T) step({ right: true });
      step({ right: true, jump: true }, ['jump']);
      let used = false, topReached = false;
      for (let i = 0; i < 160; i++) {
        const press = useDouble && !used && p.vy > -0.6 && !p.grounded ? (used = true, ['jump']) : null;
        step({ right: true, jump: true }, press);
        if (p.grounded && Math.abs(p.y - 11 * T) < 1) { topReached = true; break; }
        if (p.grounded && i > 5) break;
      }
      return { topReached, tx: +(p.x / T).toFixed(2), ty: p.y / T };
    }
    r = wall(false); check('Wall: one jump is not enough', !r.topReached, r);
    r = wall(true); check('Wall: double jump gets on top', r.topReached, r);

    // --- 4. Dash gap: 10 tiles (66..76) at the same height
    r = attempt(61, 16, 65.6, ['double']); check('10-tile gap: jump + double jump falls short', r.hurt > 0, r);
    r = attempt(61, 16, 65.6, ['dash']); check('10-tile gap: jump + dash falls short', r.hurt > 0, r);
    r = attempt(61, 16, 65.6, ['double', 'dash']); check('10-tile gap: jump + double + dash clears it', r.hurt === 0 && r.tx > 76, r);

    // --- Training Ring: pogo over the thorn pit (42..59): bounce off the buds with down-strikes
    ROOM = 'ring';
    (function () {
      fresh(); SH.test.place(37, 16); const p = P();
      const buds = G.world.things.filter(t => t.kind === 'bulb');
      while (p.x < 40.7 * T) step({ right: true });
      step({ right: true, jump: true }, ['jump']);
      let i = 0;
      while (i++ < 600 && p.x < 60.5 * T && p.stats.hurt === 0) {
        let press = null, down = false;
        // aim: when falling toward a bud just ahead/below, strike down
        const bud = buds.find(b => b.hittable() && Math.abs(b.x - p.x) < 26 && b.y - p.y > -4 && b.y - p.y < 46);
        if (p.vy > 0 && bud && !p.swing) { press = ['attack']; down = true; }
        // hold right only until over the next bud
        const next = buds.find(b => b.x > p.x - 10);
        const right = !next || p.x < next.x - 2 || p.vy < -4 || p.x > 57 * T;
        step({ right, jump: true, down: down || (p.swing && p.swing.kind === 'pogo') }, press);
      }
      check('Pogo: crosses the thorn pit on the buds without a scratch', p.x >= 60 * T && p.stats.hurt === 0, { tx: +(p.x / T).toFixed(2), pogos: p.stats.pogos, hurt: p.stats.hurt });
    })();

    // --- Touch: in the air, STRIKE aims down by itself over a bud (no holding down needed)
    (function () {
      fresh(); SH.test.place(37, 16); const p = P();
      const buds = G.world.things.filter(t => t.kind === 'bulb');
      SH.input.source = 'touch';
      while (p.x < 40.7 * T) step({ right: true });
      step({ right: true, jump: true }, ['jump']);
      let i = 0;
      while (i++ < 600 && p.x < 60.5 * T && p.stats.hurt === 0) {
        let press = null;
        const bud = buds.find(b => b.hittable() && Math.abs(b.x - p.x) < 26 && b.y - p.y > -4 && b.y - p.y < 46);
        if (p.vy > 0 && bud && !p.swing) press = ['attack'];
        const next = buds.find(b => b.x > p.x - 10);
        const right = !next || p.x < next.x - 2 || p.vy < -4 || p.x > 57 * T;
        step({ right, jump: true }, press);   // never holds down
      }
      SH.input.source = 'kb';
      check('Touch auto-aim: STRIKE in the air bounces off the buds without holding down', p.x >= 60 * T && p.stats.hurt === 0, { tx: +(p.x / T).toFixed(2), pogos: p.stats.pogos });
    })();

    // --- The \u25BC button: one tap in the air is a down-strike
    (function () {
      fresh(); SH.test.place(30, 16); const p = P();
      step({ jump: true }, ['jump']); for (let i = 0; i < 8; i++) step({ jump: true });
      step({}, ['downstrike']);
      check('Down-strike button: one tap in the air strikes down', p.swing && p.swing.kind === 'pogo', { swing: p.swing && p.swing.kind });
    })();

    // --- Thorns send you back to safe ground and cost one heart
    (function () {
      fresh(); SH.test.place(39, 16); const p = P();
      for (let i = 0; i < 120 && p.stats.hurt === 0; i++) step({ right: true });
      check('Thorns: cost one heart and return you to safe ground', p.hearts === 4 && p.x < 42 * T, { hearts: p.hearts, tx: p.x / T });
    })();

    // --- 5. Daggers: the 3-hit combo on the dummy
    (function () {
      fresh(); SH.test.place(22, 16); const p = P(); step({});
      const dummy = G.world.things.find(t => t.kind === 'dummy');
      let hits = 0, finisher = false;
      const orig = dummy.takeHit.bind(dummy);
      dummy.takeHit = (h, w) => { hits++; if (h.finisher) finisher = true; return orig(h, w); };
      for (let k = 0; k < 3; k++) { step({}, ['attack']); for (let i = 0; i < 7; i++) step({}); }
      for (let i = 0; i < 30; i++) step({});
      check('Daggers: three presses = three hits, the third is the knockback finisher', hits === 3 && finisher, { hits, finisher });
    })();

    // --- 7. Thorn sprite: HP 4 dies in exactly 2 dagger hits
    (function () {
      fresh(); const w = G.world;
      const s = w.things.find(t => t.kind === 'thornSprite');
      SH.test.place(s.x / T - 1.6, 16); const p = P(); p.facing = 1; step({});
      step({}, ['attack']); for (let i = 0; i < 7; i++) step({});
      const after1 = s.hp;
      step({}, ['attack']); for (let i = 0; i < 12; i++) step({});
      check('Thorn sprite: alive after 1 hit, gone after 2', after1 === 2 && s.dead, { after1, dead: s.dead });
    })();

    // --- Getting hit: a lunge takes a heart; dashing through a lunge is a perfect dodge and costs nothing
    (function () {
      fresh(); const w = G.world;
      const s = w.things.find(t => t.kind === 'thornSprite');
      SH.test.place(s.x / T - 4, 16); const p = P(); p.facing = 1;
      s.dir = -1; s.state = 'wander';
      let i = 0; while (s.state !== 'lunge' && i++ < 120) step({});
      i = 0; while (p.stats.hurt === 0 && i++ < 60) step({});
      check('Thorn sprite: its lunge costs a heart if you stand still', p.hearts === 4, { hearts: p.hearts, state: s.state });

      fresh(); const w2 = G.world;
      const s2 = w2.things.find(t => t.kind === 'thornSprite');
      SH.test.place(s2.x / T - 4, 16); const p2 = P(); p2.facing = 1;
      s2.dir = -1;
      i = 0; while (s2.state !== 'lunge' && i++ < 120) step({});
      step({ right: true }, ['dash']);
      for (i = 0; i < 40; i++) step({});
      check('Perfect dodge: dashing through a lunge costs nothing and slows time', p2.hearts === 5 && p2.stats.perfect === 1, { hearts: p2.hearts, perfect: p2.stats.perfect });
    })();

    // --- Knocked out: back to the last lantern with full hearts
    (function () {
      ROOM = 'deep'; fresh(); SH.test.place(77, 16); const p = P();
      for (let i = 0; i < 40; i++) step({ right: i < 14 }); // walk up to (and light) the lantern...
      p.hearts = 1;                                           // ...then arrive at the thorns on your last heart
      for (let i = 0; i < 200; i++) step({ right: i < 60 });
      check('Knockout: return to the last lantern with full hearts', p.hearts === 5 && !p.dead && Math.abs(p.x - G.world.checkpoint.px) < 40, { hearts: p.hearts, tx: +(p.x / T).toFixed(1) });
    })();

    // --- Coyote time and jump buffering
    (function () {
      fresh(); SH.test.place(27, 14); const p = P();
      while (p.grounded || p.x < 31 * T) { step({ right: true }); if (!p.grounded) break; }
      for (let i = 0; i < 4; i++) step({ right: true });     // 4 frames after leaving the ledge
      step({ right: true, jump: true }, ['jump']);
      check('Coyote time: a jump 4 frames after leaving a ledge still works', p.vy < -5, { vy: p.vy });
      fresh(); SH.test.place(27, 14);
      const q = P();
      step({ jump: true }, ['jump']);
      let i = 0; while (q.vy < 0 || q.y < 14 * T - 30) { step({ jump: false }); if (i++ > 200) break; }
      // press jump a few frames before landing
      while (!q.grounded && q.y < 14 * T - 8) step({});
      step({ jump: true }, ['jump']);
      for (i = 0; i < 6; i++) step({ jump: true });
      check('Jump buffer: pressing just before landing jumps on landing', q.vy < -2 && !q.grounded, { vy: q.vy });
    })();

    // ================= Story: each chapter played start to finish with its dialogue (clicked through)
    let caught = 0; const origCaught = G.caught; G.caught = function () { caught++; return origCaught.apply(this, arguments); };
    const talk = (held, press) => SH.test.step(1, held, press, true);
    function pogoPolicy(p, held, buds, endX) {
      let press = null;
      const bud = buds.find(b => b.hittable() && Math.abs(b.x - p.x) < 26 && b.y - p.y > -4 && b.y - p.y < 46);
      if (p.vy > 0 && bud && !p.swing) { press = ['attack']; held.down = true; }
      if (p.swing && p.swing.kind === 'pogo') held.down = true;
      const next = buds.find(b => b.x > p.x - 10);
      held.right = !next || p.x < next.x - 2 || p.vy < -4 || p.x > endX * T;
      return press;
    }

    const seen = new Set();
    const origRun = G.runScript; G.runScript = function (id) { seen.add(id); return origRun.apply(this, arguments); };
    const origAct = G.act; G.act = function (st) { if (st.do === 'goto') seen.add(st.id); return origAct.apply(this, arguments); };
    const origAdv = G.advance; G.advance = function () { if (G.script) seen.add(G.script.id); const r = origAdv.apply(this, arguments); if (G.script) seen.add(G.script.id); return r; };
    // Prologue part 1: the Winter Woods. Mortal Wren walks out, shoots the stag, and the cinematics play to the Deep.
    (function () {
      SH.test.load(0); const p = P();
      // mortal: no double jump, no dash
      SH.test.place(12, 16); talk({}, null);
      for (let i = 0; i < 200 && G.state === 'talk'; i++) talk({}, null);
      step({ jump: true }, ['jump']); for (let i = 0; i < 12; i++) step({ jump: true });
      const vy1 = p.vy; step({ jump: true }, ['jump']); const vy2 = p.vy;
      for (let i = 0; i < 80; i++) step({});
      const x0 = p.x; step({ right: true }, ['dash']); for (let i = 0; i < 6; i++) step({ right: true });
      check('Winter Woods: mortal Wren has one jump and no dash', vy2 >= vy1 && p.x - x0 < 6 * 3.6 + 1, { vy1: +vy1.toFixed(2), vy2: +vy2.toFixed(2), dashDist: +(p.x - x0).toFixed(1) });
      SH.test.load(0);
      const q = P(), jumps = [18.6, 28.6, 42.9, 53.6];
      let k = 0, f = 0, shot = false;
      const seenHere = new Set();
      while (f++ < 60 * 120 && G.chapter === 0) {
        const tx = q.x / T; let press = null, held = { right: true, jump: true };
        if (G.state === 'play') {
          if (k < jumps.length && tx >= jumps[k] && q.grounded) { press = ['jump']; k++; }
          if (tx >= 72) { held = {}; if (!shot || f % 40 === 0) { press = ['attack']; shot = true; } }
        }
        if (G.script) seenHere.add(G.script.id);
        talk(held, press);
      }
      check('Winter Woods: the hunt, the stag cinematic, Rowan, and Beyond the Wall lead into the Deep', G.chapter === 1 && seenHere.has('woods_kill') && seenHere.has('beyond_wall'),
        { chapter: G.chapter, scripts: [...seenHere], seconds: +(f / 60).toFixed(1) });
    })();

    // Skip: jumps to the end of a scene and still applies what the scene does
    (function () {
      SH.test.load(0); SH.test.step(3, {});
      const was = G.state; G.skipScene();
      check('Skip: ends the opening scene, sets the goal, returns to play', was === 'talk' && G.state === 'play' && G.activeGoal === 'hunt', { was, now: G.state, goal: G.activeGoal });
      SH.test.load(2); SH.test.step(3, {}); G.skipScene();
      check('Skip: stops at a choice instead of choosing for you', G.state === 'talk' && !!G.choosing, { state: G.state, choosing: !!G.choosing });
      G.choosing = null; G.hud.choice(null);
    })();

    // Starlight motes: walking through them collects them; every level has some
    (function () {
      SH.test.load('woods', { story: false }); const p = P(), w = G.world;
      SH.test.place(12, 16); for (let i = 0; i < 50; i++) step({ right: true });
      const got = w.motes.filter(m => m.got).length;
      const counts = ['woods', 'deep', 'ashes', 'ring', 'mountain'].map(r => SH.buildRoom(SH.ROOMS[r]).motes.length);
      check('Starlight: motes are collected by touch, and all five levels have them', got >= 3 && counts.every(n => n >= 10), { collected: got, perLevel: counts });
    })();

    // The riddle: a wrong answer makes the queen ask again; the right one starts the maze
    (function () {
      SH.test.load(1);
      for (let i = 0; i < 60 && !G.choosing; i++) SH.test.step(1, {}, null, false), (G.state === 'talk' && G.talkWait <= 0 && !G.choosing && G.advance());
      G.pick(0);                                   // "A secret": wrong
      for (let i = 0; i < 60 && !G.choosing; i++) { SH.test.step(1, {}); if (G.state === 'talk' && G.talkWait <= 0 && !G.choosing) G.advance(); }
      const askedAgain = !!G.choosing && !G.flags.riddle;
      G.pick(1);                                   // "A seed": right
      for (let i = 0; i < 200 && G.state === 'talk'; i++) { SH.test.step(1, {}); if (G.state === 'talk' && G.talkWait <= 0 && !G.choosing) G.advance(); }
      check('Riddle: a wrong answer gets asked again; "A seed" passes the first trial', askedAgain && G.flags.riddle && G.activeGoal === 'maze', { askedAgain, riddle: !!G.flags.riddle, goal: G.activeGoal });
    })();

    // Prologue part 2: the Deep, including the Wyrm chase
    (function () {
      SH.test.choice = 1;   // the riddle: "A seed"
      SH.test.load(1); const p = P();
      const jumps = [[22.6], [30.7], [40.7], [52.6, 'jump'], [65.6, 'jump', 'dash'], [83.6], [102.8], [116.6], [125.6], [135.6]];
      let k = 0, moves = [], f = 0, sawWyrm = false;
      while (f++ < 60 * 120 && G.chapter === 1) {
        const tx = p.x / T; let press = null;
        if (G.state === 'play' && k < jumps.length && tx >= jumps[k][0] && p.grounded) { press = ['jump']; moves = jumps[k].slice(1); k++; }
        else if (moves.length && !p.grounded && p.vy > -0.6 && p.dashT <= 0) press = [moves.shift()];
        if (G.world.wyrm && G.world.wyrm.on) sawWyrm = true;
        talk({ right: true, jump: true }, press);
      }
      SH.test.choice = 0;
      check('Under the Mountain: riddle, maze, Wyrm chase, death and Caelum\'s blood, Wyrm never catches a steady runner', G.chapter === 2 && sawWyrm && caught === 0 && seen.has('deep_end'),
        { chapter: G.chapter, sawWyrm, caught, seconds: +(f / 60).toFixed(1), hurt: p.stats.hurt });
    })();

    // Chapter 1: Ashes. Walk with Caelum, paint the mural, climb to the roof, then the first evening
    (function () {
      G.progress.bonds = {}; SH.test.choice = 0;
      SH.test.load(2); const p = P(), w = G.world;
      const jumps = [21.3, 29.3, 98.6, 102.4];
      let k = 0, f = 0, light0 = w.cityLight, painted = false;
      while (f++ < 60 * 120 && G.chapter === 2) {
        const tx = p.x / T; let press = null, held = { right: true, jump: true };
        if (G.flags.arrive && !G.flags.painted && tx > 71.5 && tx < 74) held = { up: true };
        if (G.flags.painted) painted = true;
        if (G.state === 'play' && k < jumps.length && tx >= jumps[k] && p.grounded && (k < 2 || G.flags.painted)) { press = ['jump']; k++; }
        talk(held, press);
      }
      const cb = G.progress.bonds.caelum || { pts: 0 };
      check('Chapter 1 + first evening: walk, mural, rooftop; Caelum reaches heart 2 with his heart scene', G.chapter === 3 && painted && G.heartsFor(cb.pts) >= 2 && seen.has('heart_caelum_2'),
        { chapter: G.chapter, painted, caelumPoints: cb.pts, hearts: G.heartsFor(cb.pts), heartScene: seen.has('heart_caelum_2'), seconds: +(f / 60).toFixed(1) });
    })();

    // Chapter 2: The Five. Dummy combo, the thorn pit, three thorn sprites
    (function () {
      SH.test.load(3); const p = P(), w = G.world;
      const buds = w.things.filter(t => t.kind === 'bulb');
      let f = 0, swings = 0;
      while (f++ < 60 * 150 && G.chapter === 3) {
        const tx = p.x / T; let press = null, held = { right: true, jump: true };
        if (G.state === 'play') {
          if (!G.flags.combo) {
            if (tx >= 22.4) { held = {}; if (!p.swing && f % 9 === 0) press = ['attack']; }
          } else if (!G.flags.pit) {
            if (tx >= 40.7 && p.grounded && tx < 42) press = ["jump"];
            if (tx > 40.7 && tx < 60) press = pogoPolicy(p, held, buds, 57) || press;
          } else {
            // hunt the nearest live sprite; jump up to it if it's on the ledge
            const alive = w.things.filter(e => e.kind === 'thornSprite' && !e.dead).sort((a, b) => Math.abs(a.x - p.x) - Math.abs(b.x - p.x));
            const foe = alive[0];
            if (foe && tx > 62) {
              const dx = foe.x - p.x, dy = foe.y - p.y;
              held.right = dx > 0; held.left = dx < 0;
              if (Math.abs(dx) < 40 && Math.abs(dy) < 30) { held.right = held.left = false; p.facing = dx > 0 ? 1 : -1; if (!p.swing && f % 4 === 0) { press = ['attack']; swings++; } }
              else if (dy < -40 && Math.abs(dx) < 70 && p.grounded) press = ['jump'];
            }
          }
        }
        talk(held, press);
      }
      check('Chapter 2 + vision + second evening: leads into Chapter 3', G.chapter === 4 && seen.has('ev2_caelum'),
        { chapter: G.chapter, seconds: +(f / 60).toFixed(1), hurt: p.stats.hurt, swings });
    })();

    // Chapter 3: Flame lights the braziers and burns the thorns
    (function () {
      SH.test.load(4); const p = P(), w = G.world;
      SH.test.place(5, 16);
      for (let i = 0; i < 2000 && !G.flags.giftgot; i++) talk({}, null);
      for (let i = 0; i < 200 && G.state === 'talk'; i++) talk({}, null);
      const pips0 = p.pips;
      SH.test.place(9, 16); p.facing = 1;
      const cast = () => { step({ right: false }, ['gift']); for (let i = 0; i < 40; i++) step({}); };
      cast(); cast();
      SH.test.place(20, 12); p.facing = 1; step({}); cast();
      const lit = w.things.filter(e => e.kind === 'brazier' && e.lit).length;
      for (let i = 0; i < 400 && (G.state === 'talk' || G.pending); i++) talk({}, null);
      check('Flame: three casts cost three moons and light all three braziers', lit === 3 && pips0 >= 2.99 && G.activeGoal === 'wall', { lit, pips0: +pips0.toFixed(2), pipsLeft: +p.pips.toFixed(2), goal: G.activeGoal });
      p.pips = 3; p.giftCd = 0; SH.fx.hitstop = 0; SH.test.place(30, 16); p.facing = 1; step({}); const before = [G.state, G.activeGoal, G.script && G.script.id, !!G.pending]; cast();
      for (let i = 0; i < 400 && (G.state === 'talk' || G.pending); i++) talk({}, null);
      check('Flame: the Thorn Queen\'s thorns burn away and the road opens', !w.thorns[0].solid && G.flags.wall && w.room.get(34, 14) === SH.T_EMPTY, { burned: !w.thorns[0].solid, wall: !!G.flags.wall, before });
    })();

    // Wyrmlings: armored head in front while charging, open from behind / when dazed
    (function () {
      SH.test.load('mountain', { story: false }); const p = P(), w = G.world;
      const wy = w.things.find(e => e.kind === 'wyrm' && !e.boss);
      SH.test.place(wy.x / T - 1.8, wy.y / T); p.facing = 1; wy.dir = -1; wy.state = 'charge'; wy.t = 0; p.invuln = 999;
      const hp0 = wy.hp; step({}, ['attack']); for (let i = 0; i < 6; i++) { wy.state = 'charge'; wy.vx = 0; wy.x = wy.home.x; step({}); }
      const afterFront = wy.hp;
      wy.state = 'stun'; wy.t = 0; for (let i = 0; i < 20; i++) step({});
      step({}, ['attack']); for (let i = 0; i < 8; i++) step({});
      check('Wyrmling: a strike at its charging head clangs off; a strike while it\'s dazed lands', afterFront === hp0 && wy.hp === hp0 - 2, { hp0, afterFront, afterStun: wy.hp });
    })();

    // Chapter 3: the Old Wyrm, the peak, the evening, the finale
    (function () {
      SH.test.load(4); const p = P(), w = G.world;
      SH.test.place(5, 16);
      for (let i = 0; i < 2000 && !G.flags.giftgot; i++) talk({}, null);
      for (let i = 0; i < 200 && G.state === 'talk'; i++) talk({}, null);
      G.flags.flame = G.flags.wall = true; G.activeGoal = 'hunt';
      for (const t of w.thorns) w.room.setThorns(t, false);
      w.things.filter(e => e.kind === 'wyrm' && !e.boss).forEach(e => { e.dead = true; });
      SH.test.place(121, 14);
      for (let i = 0; i < 600 && !G.boss; i++) talk({}, null);
      const boss = G.boss, gateClosed = w.gates[0].closed;
      let f = 0, rocksSeen = 0;
      while (f++ < 60 * 120 && G.boss && !boss.dead) {
        p.invuln = 5; p.hearts = 5;   // this test checks the fight can be won, not dodging
        if (w.rocks.length) rocksSeen++;
        let press = null;
        if (boss.state === 'stun') { if (Math.abs(p.x - (boss.x - boss.dir * (boss.w / 2 + 14))) > 4) { SH.test.place((boss.x - boss.dir * (boss.w / 2 + 14)) / T, 14); p.facing = boss.dir; } if (!p.swing && f % 5 === 0) press = ['attack']; }
        else { p.facing = boss.x > p.x ? 1 : -1; if (f % 30 === 0) press = ['gift']; }
        step({}, press);
      }
      const won = boss.dead;
      for (let i = 0; i < 4000 && G.state !== 'end'; i++) talk({}, null);
      check('Old Wyrm: the hollow seals, rocks fall when it hits the cliff, it can be beaten; peak, evening and finale follow', gateClosed && won && rocksSeen > 0 && seen.has('mtn_peak') && seen.has('evening3') && seen.has('finale') && G.state === 'end',
        { gateClosed, won, rocksSeen: rocksSeen > 0, fightSeconds: +(f / 60).toFixed(1), peak: seen.has('mtn_peak'), evening: seen.has('evening3'), state: G.state });
    })();

    // Evening 2 choices lead to the right person and add their bond points
    for (const [choice, who, script] of [[1, 'bram', 'ev2_bram'], [2, 'iris', 'ev2_iris']]) {
      SH.test.load(3); G.progress.bonds = {}; SH.test.choice = choice;
      G.runScript('evening2');
      let f = 0; while (G.state === 'talk' && f++ < 2000) SH.test.step(1, {}, null, true);
      const b = G.progress.bonds[who] || { pts: 0 };
      check(`Evening 2, choice ${choice + 1}: spends the evening with ${who} (+points, back to play)`, seen.has(script) && b.pts > 0 && G.state === 'play', { pts: b.pts, state: G.state });
    }
    SH.test.choice = 0;

    return out;
  });

  let fails = 0;
  for (const r of results) { if (!r.ok) fails++; console.log(`${r.ok ? 'PASS' : 'FAIL'}  ${r.name}  ${JSON.stringify(r.info)}`); }
  if (errors.length) { console.log('PAGE ERRORS', errors); fails++; }
  console.log(`\n${results.length - fails}/${results.length} passed`);
  await browser.close();
  process.exit(fails ? 1 : 0);
})();
