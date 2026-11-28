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
    check('3-tile gap: just running falls in, and lands unhurt in the cells below', r.hurt === 0 && r.ty > 20, r);
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
    r = attempt(61, 16, 65.6, ['double']); check('10-tile gap: jump + double jump falls short (into the shaft, unhurt)', r.hurt === 0 && r.ty > 16, r);
    r = attempt(61, 16, 65.6, ['dash']); check('10-tile gap: jump + dash falls short (into the shaft, unhurt)', r.hurt === 0 && r.ty > 16, r);
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
      const q = P(), w0 = G.world, jumps = [18.6, 28.6, 42.9, 53.6, 77.4, 80.2, 108.4];
      G.progress.bonds = {}; G.progress.mem = {}; SH.test.choice = 0;
      const snares = w0.things.filter(e => e.kind === 'snare'), targets = w0.things.filter(e => e.kind === 'target'), wolf = w0.things.find(e => e.kind === 'wolf');
      let k = 0, f = 0, shot = false, jt = -1, effectsSeen = 0;
      const seenHere = new Set();
      while (f++ < 60 * 200 && G.chapter === 0) {
        const tx = q.x / T; let press = null, held = { right: true, jump: true };
        effectsSeen = Math.max(effectsSeen, document.querySelectorAll('#effects .fx-row').length);
        if (G.state === 'play') {
          const sn = snares.find(e => !e.checked && tx >= e.x / T - 0.4);
          const left = targets.filter(e => !e.hit);
          if (sn) { held = {}; if (sn.near && f % 6 === 0) press = ['up']; else if (!sn.near) held = { left: tx > sn.x / T + 0.3, right: tx < sn.x / T - 0.3 }; }
          else if (tx >= 60 && tx < 62 && left.length) {   // Father's targets: two flat shots, then a jump shot for the high one
            held = {}; q.facing = 1;
            if (left.some(e => e.y > 14.5 * T)) { if (f % 40 === 0) press = ['attack']; }
            else if (q.grounded && jt < 0 && f % 50 === 0) { press = ['jump']; held = { jump: true }; jt = f; }
            else if (jt > 0) { held = { jump: true }; if (q.vy > -1.2 || f - jt > 26) { press = ['attack']; jt = -1; } }
          }
          else if (tx >= 92 && wolf && !wolf.gone && !wolf.dead) { held = {}; q.facing = 1; if (wolf.state !== 'hurt' && wolf.state !== 'flee' && f % 40 === 0) press = ['attack']; }   // one arrow, then lower the bow
          else if (tx >= 132) { held = {}; if (!shot || f % 40 === 0) { press = ['attack']; shot = true; } }
          else if (k < jumps.length && tx >= jumps[k] && q.grounded) { press = ['jump']; k++; }
        }
        if (G.script) seenHere.add(G.script.id);
        talk(held, press);
      }
      const mem = Object.keys(G.progress.mem || {}), bd = G.progress.bonds;
      check('Winter Woods, before the stag: firewood, three snares, Father\'s targets, wintergreen, and a wolf that is spared', ['woods_wood', 'woods_snare1', 'woods_snare2', 'woods_snare3', 'woods_targets', 'woods_herb', 'woods_wolf_hurt', 'woods_wolf_spared'].every(x => seenHere.has(x)),
        { scripts: [...seenHere].filter(x => /wood|snare|target|herb|wolf/.test(x)), seconds: +(f / 60).toFixed(1) });
      check('Decisions matter: each one shows who it touched and why, is remembered, and the cottage scene answers it', effectsSeen > 0 && ['wood', 'steady', 'green', 'wolfSpared', 'rabbitHome'].every(m => mem.includes(m)) && bd.nessa && bd.nessa.pts >= 15 && bd.lissa && bd.lissa.pts >= 20,
        { effectsSeen, remembered: mem, nessa: bd.nessa && bd.nessa.pts, lissa: bd.lissa && bd.lissa.pts });
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

    // The Weighing: three altars, three memories. Any one is a valid choice; the dark keeps it, the story remembers it
    (function () {
      SH.test.load(1);
      for (let i = 0; i < 900 && !(G.flags.asked && G.state === 'play'); i++) talk({}, null);
      const w = G.world, alt = k => w.things.find(e => e.kind === 'altar' && e.what === k), gate = w.gates.find(g => g.id === 'riddlegate');
      const useAltar = k => { const a = alt(k); SH.test.place(a.x / T - 0.5, 16); P().x = a.x; for (let i = 0; i < 4; i++) step({}, null); step({}, ['up']); for (let i = 0; i < 600 && (i < 5 || G.state !== 'play'); i++) talk({}, null); };
      const shutBefore = gate.closed;
      useAltar('laugh');
      const others = !alt('voice').near && !alt('paint').near;
      check('The Weighing: give the dark one memory at an altar; it goes dark, the choice is remembered, and the gate to the Climb opens', shutBefore && alt('laugh').broken && G.recalls('gaveLaugh') && G.flags.riddle && G.activeGoal === 'maze' && !gate.closed && others,
        { taken: alt('laugh').broken, remembered: G.recalls('gaveLaugh'), goal: G.activeGoal, gateOpen: !gate.closed });
    })();

    // Prologue part 2: the Deep, including the Wyrm chase
    (function () {
      SH.test.choice = 1;   // the riddle: "A seed"
      SH.test.load(1); const p = P();
      const jumps = [[22.6], [30.7], [40.7], [52.6, 'jump'], [65.6, 'jump', 'dash'], [83.6], [102.8], [116.6], [125.6], [135.6]];
      let k = 0, moves = [], f = 0, sawWyrm = false;
      const seedAltar = G.world.things.find(e => e.kind === 'altar' && e.what === 'paint');
      while (f++ < 60 * 120 && G.chapter === 1) {
        const tx = p.x / T; let press = null;
        if (G.state === 'play' && !G.flags.riddle) { const dx = seedAltar.x - p.x; talk({ right: dx > 6, left: dx < -6 }, Math.abs(dx) <= 10 && f % 8 === 0 ? ['up'] : null); continue; }
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
      const jumps = [21.3, 29.3];
      let k = 0, f = 0, light0 = w.cityLight, painted = false, climbTo = 0;
      while (f++ < 60 * 120 && G.chapter === 2) {
        const tx = p.x / T; let press = null, held = { right: true, jump: true };
        if (G.flags.arrive && !G.flags.painted && tx > 71.5 && tx < 74) held = { up: true };
        if (G.flags.painted) painted = true;
        if (G.state === 'play' && k < jumps.length && tx >= jumps[k] && p.grounded && (k < 2 || G.flags.painted)) { press = ['jump']; k++; }
        if (G.state === 'play' && G.flags.painted && tx > 90 && tx < 104.5 && p.y > 10.5 * T) {   // the climb: crates (row 14), balcony (row 12), eave (row 10)
          const row = Math.round(p.y / T), plan = { 16: [93.0, 95.5], 14: [96.0, 99.0], 12: [100.0, 102.6] };
          if (p.grounded && plan[row]) { const from = plan[row][0]; held = { right: tx < from - 0.15, left: tx > from + 0.6 }; if (!held.right && !held.left) { held = { right: true, jump: true }; press = ['jump']; climbTo = plan[row][1]; } }
          else if (!p.grounded) held = { jump: p.vy < 0, right: tx < climbTo - 0.2, left: tx > climbTo + 0.4 };
        }
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
      let f = 0, swings = 0, waited = 0; const lessons = new Set();
      while (f++ < 60 * 190 && G.chapter === 3) {
        const tx = p.x / T; let press = null, held = { right: true, jump: true };
        if (G.state === 'play') {
          if (!G.flags.combo) {
            const goal = G.activeGoal; lessons.add(goal);
            if (goal === 'rise') { if (tx >= 22.4) { held = {}; p.facing = 1; if (!p.swing && p.grounded && f % 12 === 0) press = ['upstrike']; } }
            else if (goal === 'lunge') {   // back off, dash in, strike mid-dash
              if (p.dashT > 0) { held = { right: true }; press = ['attack']; }
              else if (tx > 21.2) held = { left: true };
              else { held = { right: true }; if (p.grounded && p.dashCd <= 0) press = ['dash']; }
            }
            else if (goal === 'guard') { if (tx >= 22.4) { held = { down: true }; p.facing = 1; } else held = { right: true }; }
            else if (tx >= 22.4) { held = {}; if (!p.swing && f % 9 === 0) press = ['attack']; }
          } else if (!G.flags.pit) {
            if (tx >= 40.7 && p.grounded && tx < 42) press = ["jump"];
            if (tx > 40.7 && tx < 60) press = pogoPolicy(p, held, buds, 57) || press;
          } else {
            // hunt the nearest live sprite; jump up to it if it's on the ledge
            const alive = w.things.filter(e => e.kind === 'thornSprite' && !e.dead).sort((a, b) => Math.abs(a.x - p.x) - Math.abs(b.x - p.x));
            const foe = alive[0];
            if (G.activeGoal === 'report') {   // the level waits for you: walk to Caelum and talk
              const c = w.npcs.find(n => n.id === 'caelum'); waited++;
              held = { right: c.x > p.x + 10, left: c.x < p.x - 10 }; if (Math.abs(c.x - p.x) < 40 && waited > 90) press = ['up'];
            } else if (foe && tx > 62) {
              const dx = foe.x - p.x, dy = foe.y - p.y;
              held.right = dx > 0; held.left = dx < 0;
              if (Math.abs(dx) < 40 && Math.abs(dy) < 30) { held.right = held.left = false; p.facing = dx > 0 ? 1 : -1; if (!p.swing && f % 4 === 0) { press = ['attack']; swings++; } }
              else if (dy < -40 && Math.abs(dx) < 70 && p.grounded) press = ['jump'];
            }
          }
        }
        talk(held, press);
      }
      check('Bram teaches four things on the dummy, one at a time: combo, rising strike, dash strike, guard', ['combo', 'rise', 'lunge', 'guard'].every(x => lessons.has(x)), { lessons: [...lessons] });
      check('Chapter 2 + vision + second evening: the level waits (1.5 s here) until you talk to Caelum, then leads into Chapter 3', G.chapter === 4 && seen.has('ev2_caelum') && waited > 90,
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
      check('Wyrmling: a strike at its charging head is turned (1 gets through, and it says where to hit); a strike while it\'s dazed lands in full', afterFront === hp0 - 1 && wy.hp === hp0 - 3, { hp0, afterFront, afterStun: wy.hp });
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
      let inhales = 0, lastSt = '';
      const moves = new Set(), phases = new Set(); let choked = false, wavesSeen = false, hp0 = boss.hp, waveHits = 0; boss.hp = 42;   // a little extra health for this test only, so every move gets its turn
      const behind = () => { const bx = Math.max(119.6 * T, Math.min(160.4 * T, boss.x - boss.dir * (boss.w / 2 + 14)));   // never outside the hollow
         if (Math.abs(p.x - bx) > 6 || Math.abs(p.y - boss.y) > 4) SH.test.place(bx / T, 14); p.facing = boss.dir; };
      while (f++ < 60 * 240 && G.boss && !boss.dead) {
        p.invuln = 5; p.hearts = 5;   // this test checks the fight can be won and every move happens, not dodging
        if (w.rocks.length) rocksSeen++;
        if (w.waves.length) wavesSeen = true;
        moves.add(boss.state); phases.add(boss.phase());
        let press = null, held = {};
        const st = boss.state;
        if (st === 'stun' || st === 'slamrest' || st === 'breath') { behind(); if (!p.swing && f % 5 === 0) press = ['attack']; }
        else if (st === 'inhale') {   // stand in front and throw fire down its throat
          const fx0 = Math.max(120.5 * T, Math.min(159.5 * T, boss.x + boss.dir * 110));   // in front of it, inside the hollow if (Math.abs(p.x - fx0) > 8) SH.test.place(fx0 / T, 14);
          p.facing = -boss.dir; p.giftCd = Math.min(p.giftCd, 4); if (p.pips < 1) p.pips = 1; if (inhales % 2 === 1 && f % 12 === 0) press = ['gift'];   // choke every other breath, let the rest happen
        }
        else if (st === 'windup' || st === 'charge') {   // stay just behind its tail so it runs on into the cliff
          behind();
        }
        else if (st === 'leap' || st === 'crouch') { if (p.y > 11 * T) SH.test.place(128.5, 10); }
        else if (st === 'rest') {
          if (p.pips >= 2 && Math.abs(p.x - boss.x) > 60) { p.facing = boss.x > p.x ? 1 : -1; held = { gift: f % 60 < 40 }; if (f % 60 === 0) press = ['gift']; }   // charge a flame wave
          else { behind(); if (!p.swing && f % 5 === 0) press = ['attack']; }
        }
        const before = boss.hp, st0 = boss.state; if (st0 === 'inhale' && lastSt !== 'inhale') inhales++; lastSt = st0;
        step(held, press);
        if (st0 === 'inhale' && boss.state === 'stun') choked = true;
        if (before - boss.hp >= 8) waveHits++;
      }
      const won = boss.dead;
      for (let i = 0; i < 4000 && G.chapter !== 5; i++) talk({}, null);
      const allMoves = ['charge', 'leap', 'inhale', 'roar', 'stun', 'slamrest'].every(m => moves.has(m));   // the breath itself may be choked off every time by this bot
      check('Old Wyrm (32 health): three phases; it charges, leaps (shockwaves), breathes frost and roars; fire chokes it mid-breath', hp0 === 32 && phases.size === 3 && allMoves && wavesSeen && choked,
        { hp: hp0, phases: [...phases], moves: [...moves], wavesSeen, choked, flameWaveHits: waveHits });
      check('Old Wyrm: the hollow seals, rocks fall when it hits the cliff, it can be beaten; the peak and the evening follow, then Chapter 4', gateClosed && won && rocksSeen > 0 && seen.has('mtn_peak') && seen.has('evening3') && G.chapter === 5,
        { gateClosed, won, rocksSeen: rocksSeen > 0, fightSeconds: +(f / 60).toFixed(1), peak: seen.has('mtn_peak'), evening: seen.has('evening3'), state: G.state });
    })();

    // Chapter 4: the fae bow, the spies in the courtyard and the stacks, the Spymaster's Shadow, the letter, the evening, the finale
    (function () {
      SH.test.load(5); const p = P(), w = G.world; G.progress.bonds = {}; SH.test.choice = 0;
      let f = 0, shots = 0, pinned = false, bossSeen = false, bossSecs = 0, hurt0 = p.stats.hurt; const seen4 = new Set();
      const bow = () => { if (p.bowCd <= 0 && f % 6 === 0) { shots++; return ['bow']; } return null; };
      while (f++ < 60 * 300 && G.chapter === 5 && G.state !== 'end') {
        if (G.script) seen4.add(G.script.id);
        let held = {}, press = null;
        const tx = p.x / T, spies = w.things.filter(e => e.kind === 'spy' && !e.dead && e.active()), boss = G.boss;
        if (G.state === 'play') {
          if (!G.flags.bow4) held = { right: true };
          else if (boss && !boss.dead) {
            bossSeen = true; bossSecs++;
            const st = boss.state, dx = boss.x - p.x;
            if (st === 'grounded' || st === 'fall') { if (Math.abs(dx) > 30) held[dx > 0 ? 'right' : 'left'] = true; else { p.facing = Math.sign(dx) || 1; if (!p.swing && f % 5 === 0) press = ['attack']; } }
            else if (st === 'volley') { p.facing = Math.sign(dx) || 1; held = { down: true }; }
            else if (st === 'swoop') { if (Math.abs(dx) < 110 && p.grounded && Math.sign(boss.vx) === -Math.sign(dx)) { press = ['jump']; held = { jump: true }; } else if (!p.grounded) held = { jump: true }; }
            else { p.facing = Math.sign(dx) || 1; press = bow(); }
          }
          else {
            const down = spies.find(e => e.state === 'down');
            if (down) { const dx = down.x - p.x; if (Math.abs(dx) > 26) held[dx > 0 ? 'right' : 'left'] = true; else { p.facing = Math.sign(dx) || 1; if (!p.swing && f % 5 === 0) press = ['attack']; } }
            else if (spies.length) { const sp = spies.sort((a, b) => Math.abs(a.x - p.x) - Math.abs(b.x - p.x))[0], dx = sp.x - p.x; if (sp.state === 'mark' || sp.state === 'dive') { p.facing = Math.sign(dx) || 1; held = { down: true }; } else { if (Math.abs(dx) > 150) held[dx > 0 ? 'right' : 'left'] = true; else if (Math.abs(dx) < 40) held[dx > 0 ? 'left' : 'right'] = true; else { p.facing = Math.sign(dx) || 1; press = bow(); } } }
            else held = { right: true };
          }
        }
        if (w.things.some(e => e.kind === 'spy' && e.state === 'falling')) pinned = true;
        talk(held, press);
      }
      const lost = G.flags.pagesLost || 0;
      check('Chapter 4: the fae bow brings spies down from the courtyard sky, the stacks are cleared, and the Spymaster\'s Shadow is shot down and cut on the floor',
        pinned && seen4.has('lib4_sky_done') && seen4.has('lib4_stacks_done') && bossSeen && seen4.has('lib4_end'), { pinned, shots, pagesLost: lost, bossSeconds: +(bossSecs / 60).toFixed(1), hurt: p.stats.hurt - hurt0, scripts: [...seen4].filter(x => /lib4|ev4|evening4|finale/.test(x)), seconds: +(f / 60).toFixed(1), state: G.state });
      check('Chapter 4 ends: the letter with Spring\'s seal, an evening, and the finale points to the Weaver', seen4.has('evening4') && seen4.has('finale') && G.state === 'end' && SH.STORY.END.text.includes('Chapter 5'), { evening: seen4.has('evening4'), finale: seen4.has('finale'), state: G.state });
    })();

    // Bonds give something real, and the journal fills with pages
    (function () {
      SH.test.load(4, { story: false }); const p = P(), w = G.world;
      G.progress.lore = {}; G.loreCheck(true);
      const pages0 = Object.keys(G.progress.lore).length;
      G.meet('bram'); G.meet('thane'); G.meet('caelum');
      const noBoon = !G.boon('bram') && !G.boon('thane');
      p.invuln = 0; p.iframes = 0; p.hearts = 5; p.hurt(p.x + 10, 1, w); const hurtBefore = p.hearts === 4;
      const x0 = SH.xp.total(); SH.xp.gain(10); const plain = SH.xp.total() - x0;
      G.bond('bram', 40, true, 't'); G.bond('thane', 40, true, 't'); G.bond('caelum', 120, true, 't');
      SH.test.load(4, { story: false }); const q = P();
      q.invuln = 0; q.iframes = 0; q.hearts = 5; const blocked = q.hurt(q.x + 10, 1, G.world) === false && q.hearts === 5;
      q.invuln = 0; q.hurt(q.x + 10, 1, G.world); const onlyOnce = q.hearts === 4;
      const x1 = SH.xp.total(); SH.xp.gain(10); const read = SH.xp.total() - x1;
      q.invuln = 0; q.hearts = 2; SH.arts.meter = 0; q.hurt(q.x + 10, 1, G.world); const lastHeart = SH.arts.meter === SH.arts.max;
      check('Bonds give something real: Bram\'s shield takes the first blow once per place, Thane adds a fifth more XP, Caelum fills the Bond Art at the last heart',
        noBoon && hurtBefore && blocked && onlyOnce && plain === 10 && read === 12 && lastHeart, { noBoon, hurtBefore, blocked, onlyOnce, plain, read, lastHeart });
      delete G.progress.lore.c_wolfSpared; if (G.progress.mem) delete G.progress.mem.wolfKilled; delete G.progress.lore.c_wolfKilled;
      G.remember('wolfSpared', 'Let the starving wolf go.', true);
      const fresh = G.loreCheck(true), lore = G.progress.lore;
      G.hud.journal(true, 'pages'); const shown = document.querySelectorAll('#journal .page:not(.blank)').length, blank = document.querySelectorAll('#journal .page.blank').length;
      const unread = G.loreNew();
      G.hud.journal(true, 'bonds'); const ladders = document.querySelectorAll('#journal .ladder').length, active = document.querySelectorAll('#journal .ladder li.got').length;
      G.hud.journal(false);
      check('Journal pages: written by chapters reached, people met, hearts earned and choices made; blank pages say how; reading clears "new"',
        pages0 > 10 && fresh >= 1 && lore.p_bram2 && lore.p_caelum3 && lore.c_wolfSpared && !lore.c_wolfKilled && shown === Object.keys(lore).length && blank > 0 && unread === 0 && ladders >= 3 && active >= 4,
        { pages0, fresh, total: SH.STORY.LORE.length, shown, blank, unread, ladders, active });
    })();

    // Guard and parry; thorns are sunk into the floor; longer safety after a hit
    (function () {
      SH.test.load('mountain', { story: false }); const p = P(), w = G.world;
      SH.test.place(100, 14); for (let i = 0; i < 20; i++) step({}, null);
      p.facing = 1; p.hearts = 5; p.invuln = 0; w.bramUsed = w.caelumUsed = true;   // no bond boons in this check
      for (let i = 0; i < 30; i++) step({ down: true }, null);   // a held guard
      const held = p.guard > 14; const r1 = p.hurt(p.x + 30, 1, w); const blocked = r1 === false && p.hearts === 5 && p.guardCd > 0;
      for (let i = 0; i < 60; i++) step({}, null); p.invuln = 0;
      for (let i = 0; i < 5; i++) step({ down: true }, null);    // raised just in time
      const r2 = p.hurt(p.x + 30, 1, w); const parried = r2 === false && p.hearts === 5 && p.parryT > 0;
      for (let i = 0; i < 60; i++) step({}, null); p.invuln = 0; p.facing = 1;
      for (let i = 0; i < 20; i++) step({ down: true }, null);
      p.hurt(p.x - 30, 1, w); const backHits = p.hearts === 4;   // from behind: no guard
      const safe = p.invuln;
      check('Guard: holding down stops a blow from the front, raising it at the last moment is a parry, a blow from behind still lands; 115 frames of safety after a hit',
        held && blocked && parried && backHits && safe >= 110, { held, blocked, parried, backHits, safe });
      SH.test.load('deep', { story: false }); const q = P(), room = G.world.room;
      const sunk = room.get(86, 16) === SH.T_THORNS && room.get(86, 15) === SH.T_EMPTY && SH.isSolid(room.get(84, 16)) && SH.isSolid(room.get(88, 16));
      SH.test.place(83, 16); q.hearts = 5; q.invuln = 0;
      let lost = false; for (let i = 0; i < 12 && !lost; i++) { step({ right: true }, null); if (q.hearts < 5) lost = true; }
      const walkedUpSafe = !lost && q.x / T > 83.5;
      for (let i = 0; i < 60 && q.hearts === 5; i++) step({ right: true }, null);
      check('Thorns are sunk into the floor: you can stand right at the edge unhurt, and are only hurt by going in', sunk && walkedUpSafe && q.hearts === 4, { sunk, walkedUpSafe, hearts: q.hearts });
    })();

    // The square in depth, the ride to the Wall, and the Deep's prisoners
    (function () {
      const M = SH.modes;
      SH.test.load(3, { story: false, modes: true }); let done = null;
      M.start('city', { spots: [{ who: 'caelum', label: 'a' }, { who: 'bram', label: 'b' }] }, r => { done = r; });
      let read = false, i = 0;
      while (M.cur && i++ < 900) { const st = M.cur.s, held = {}; let press = null;
        if (!st.read.sq_names) { if (st.x > 114) held.left = true; else if (st.x < 108) held.right = true; if (st.y > 232) held.up = true; if (st.lore === 1 && i % 10 === 0) press = ['jump']; }
        else { read = true; const t = st.spots[0]; if (t.x < st.x - 3) held.left = true; else if (t.x > st.x + 3) held.right = true; if (t.y + 34 < st.y - 3) held.up = true; if (st.near === 0) press = ['jump']; }
        step(held, press); }
      G.loreCheck(true);
      check('The Lamp Square: three things to look at, each writes a journal page; then you walk up to someone', read && done === 0 && !!G.progress.seen.sq_names && !!G.progress.lore.sq_names, { read, done, page: !!G.progress.lore.sq_names });
      SH.test.load(0, { story: false, modes: true }); let rode = null;
      M.start('flight', { variant: 'wall' }, r => { rode = r; });
      const v = M.cur.s.v; let f = 0; while (M.cur && f++ < 2200) step({ left: f % 300 < 80, right: f % 300 > 220 }, null);
      check('The ride to the Wall: a second into-the-screen scene with its own lines, about 28 seconds', v === 'wall' && rode && f > 1600 && f < 1800, { v, frames: f, wisps: rode && rode.stars });
      SH.test.load('deep', { story: false }); const w = G.world;
      const who = w.npcs.map(n => n.id), sprites = w.things.filter(e => e.kind === 'thornSprite').length;
      // the cells: drop in, find both things, climb the shaft back to the road
      SH.test.place(32.5, 14); const q = P(); let cf = 0, found = 0, up = false, climbTo = 0;
      while (cf++ < 60 * 90 && !up) {
        const tx = q.x / T, row = Math.round(q.y / T); let held = {}, press = null;
        if (G.state !== 'play') { talk({}, null); continue; }
        found = (G.progress.seen.d_pack ? 1 : 0) + (G.progress.seen.d_tally ? 1 : 0);
        if (q.y < 20 * T && found < 2 && tx < 40) held = {};                                             // falling in
        else if (found < 2) { held = { left: true, jump: true }; if (q.grounded && tx > 24 && tx < 25.2) press = ['jump']; }   // west, over the pillar, to the cages
        else if (tx < 66 || (row >= 30 && tx < 71.5)) { held = { right: true, jump: true }; if (q.grounded && tx > 20.6 && tx < 21.8) press = ['jump']; const foe = w.things.find(e => e.kind === 'thornSprite' && !e.dead && Math.abs(e.x - q.x) < 44 && Math.abs(e.y - q.y) < 30); if (foe) { held = {}; q.facing = foe.x > q.x ? 1 : -1; if (!q.swing && cf % 5 === 0) press = ['attack']; } }
        else {   // the shaft: floor -> 27 -> 24 -> 21 -> 18 -> the road
          const plan = { 30: [72, 72], 27: [70.6, 68], 24: [68.4, 72.5], 21: [73.5, 73.5], 18: [74.2, 76.6] }[row];
          if (q.grounded && plan) { held = { right: tx < plan[0] - 0.2, left: tx > plan[0] + 0.2 }; if (!held.right && !held.left) { press = ['jump']; climbTo = plan[1]; held = { jump: true }; } }
          else if (!q.grounded) held = { jump: q.vy < 0, right: tx < climbTo - 0.2, left: tx > climbTo + 0.3 };
          if (q.grounded && row === 16 && tx > 76) up = true;
        }
        q.invuln = 5; step(held, press);
      }
      check('Under the Deep: falling from the road lands in the cells; a pack and a tally to find (two journal pages); four ledges lead back up', found === 2 && up && !!SH.STORY.LORE.find(l => l.id === 'd_pack'), { found, up, seconds: +(cf / 60).toFixed(1), at: [+(q.x / T).toFixed(1), Math.round(q.y / T)] });
      check('The Deep: Caelum in the dark and Rowan in his cage can be spoken to, and the Queen\'s gardeners are the first fight', who.includes('caelum') && who.includes('rowan') && sprites === 5 && !!SH.STORY.SCRIPTS.deep_rowan && !!SH.STORY.SCRIPTS.deep_caelum, { who, sprites });
    })();

    // New moves: dash strike, rising strike, flame wave
    (function () {
      SH.test.load('mountain', { story: false }); const p = P(), w = G.world;
      const wy = w.things.find(e => e.kind === 'wyrm' && !e.boss);
      const park = () => { wy.state = 'stun'; wy.t = 0; wy.dir = 1; wy.hp = 10; wy.burn = 0; wy.x = 100 * T; wy.y = 14 * T; wy.vx = 0; };
      // dash strike: 3 damage
      park(); SH.test.place(97, 14); p.facing = 1; step({}, null);
      step({ right: true }, ['dash']); step({ right: true }, ['attack']); const kind1 = p.swing && p.swing.kind;
      for (let i = 0; i < 20; i++) { wy.state = 'stun'; wy.t = 0; step({}, null); }
      const thrustDmg = 10 - wy.hp;
      // rising strike: lifts Wren off the ground and hits
      park(); SH.test.place(97.9, 14); p.facing = 1; p.dashCd = 0; for (let i = 0; i < 30; i++) { wy.state = 'stun'; wy.t = 0; wy.x = 100 * T; step({}, null); }
      park(); step({ up: true }, ['attack']); const kind2 = p.swing && p.swing.kind; let top = p.y;
      for (let i = 0; i < 24; i++) { wy.state = 'stun'; wy.t = 0; step({}, null); top = Math.min(top, p.y); }
      const upDmg = 10 - wy.hp, rose = 14 * T - top;
      // flame wave: hold to charge, costs two moons, 8 damage, keeps going
      park(); SH.test.place(95, 14); p.facing = 1; p.pips = 3; p.giftCd = 0; for (let i = 0; i < 30; i++) { wy.state = 'stun'; wy.t = 0; wy.x = 100 * T; step({}, null); }
      park(); p.pips = 3; step({ gift: true }, ['gift']); for (let i = 0; i < 40; i++) { wy.state = 'stun'; wy.t = 0; step({ gift: true }, null); }
      const charging = p.charging; step({}, null); const big = w.fireballs.some(f => f.big), pipsAfter = p.pips;
      let alive = false; for (let i = 0; i < 30; i++) { wy.state = 'stun'; wy.t = 0; step({}, null); if (wy.hp < 10 && w.fireballs.some(f => f.big)) alive = true; }
      const waveDmg = 10 - wy.hp;
      check('New moves: dash strike (3), rising strike (lifts her, 2+), flame wave (hold: two moons, 8, pierces)', kind1 === 'thrust' && thrustDmg === 3 && kind2 === 'up' && upDmg >= 2 && rose > 30 && charging && big && pipsAfter < 1.2 && waveDmg >= 8 && alive,
        { kind1, thrustDmg, kind2, upDmg, rose: Math.round(rose), charging, big, pipsAfter: +pipsAfter.toFixed(2), waveDmg, pierced: alive });
    })();

    // Reimagined: the bond meter, Bond Arts, openings, finisher bands, whispers, the Constellation
    (function () {
      const A = SH.arts;
      SH.test.load('woods', { story: false }); A.meter = 100; step({}, ['art']);
      const mortalNoArt = !A.active() && !A.cutin && document.getElementById('art').style.display === 'none';
      SH.test.load('ring', { story: false }); const p = P(), w = G.world; A.newGame(); G.progress.stars = {};
      const sprites = w.things.filter(e => e.kind === 'thornSprite');
      // hits fill the meter
      const dummy = w.things.find(e => e.kind === 'dummy'); SH.test.place(dummy.x / T - 1.2, 16); p.facing = 1;
      let f = 0; while (A.meter < 100 && f++ < 1500) { if (Math.abs(p.x - (dummy.x - 28)) > 6) { SH.test.place((dummy.x - 28) / T - 0.5, 16); p.facing = 1; } step({}, !p.swing && f % 6 === 0 ? ['attack'] : null); }
      const filledAfter = p.stats.hits, ready = A.ready();
      step({}, null); const btn = document.getElementById('b-art').style.display !== 'none';
      // Starfall: a cut-in that freezes the world, then stars hit everything in sight
      sprites.forEach((e, i) => { e.x = p.x + 90 + i * 30; e.y = 16 * T; e.home.x = e.x; e.hp = 4; });
      const hp0 = sprites.map(e => e.hp), t0 = w.time;
      step({}, ['art']); for (let i = 0; i < 12 && !A.cutin; i++) step({}, null); const cut = !!A.cutin && A.cutin.kind === 'starfall';
      for (let i = 0; i < 30; i++) step({}, null); const frozen = w.time - t0 <= 2 && !!A.cutin;
      for (let i = 0; i < 230; i++) step({}, null);
      const dead = sprites.filter(e => e.dead).length, spent = A.meter < 100 && !A.scene;
      check('Bond Art: no bond while mortal; hits fill the meter; STARFALL cuts in, freezes the world, then clears every sprite in sight', mortalNoArt && ready && btn && cut && frozen && dead === 3 && spent,
        { mortalNoArt, hitsToFill: filledAfter, ready, touchButton: btn, cutin: cut, frozen, spritesDown: dead, hp0 });
      // First Light takes turns with Starfall once the Flame is awake: burns, and mends a heart
      SH.test.load('mountain', { story: false }); const p2 = P(), w2 = G.world; A.newGame(); A.next = 1; A.meter = 100;
      const wy = w2.things.find(e => e.kind === 'wyrm' && !e.boss); wy.x = p2.x + 80; wy.y = p2.y; wy.state = 'stun'; wy.t = 0; p2.hearts = 3;
      const kindNext = A.nextKind(); step({}, ['art']); for (let i = 0; i < 130; i++) { wy.vx = 0; step({}, null); }
      check('Bond Art: FIRST LIGHT (Wren, once the Flame wakes) burns what is near and mends one heart', kindNext === 'firstlight' && wy.dead && p2.hearts === 4, { kindNext, wyrmlingDown: wy.dead, hearts: p2.hearts });
      // An opening: for a moment every cut bites deeper and gets past the armored head
      SH.test.load('mountain', { story: false }); const p3 = P(), w3 = G.world; A.newGame();
      const wz = w3.things.find(e => e.kind === 'wyrm' && !e.boss); const hold = () => { wz.state = 'windup'; wz.t = 0; wz.dir = -1; wz.x = 100 * T; wz.y = 14 * T; wz.vx = 0; };
      hold(); SH.test.place(98.3, 14); p3.facing = 1; step({}, null); hold(); step({}, ['attack']); for (let i = 0; i < 12; i++) { hold(); p3.invuln = 5; step({}, null); }
      const clang = wz.hp === 9;   // the armored head lets 1 through
      w3.onPerfectDodge(); const openOn = A.opening > 0; SH.fx.slowmo = 0;
      for (let i = 0; i < 20; i++) { hold(); p3.invuln = 5; step({}, null); } hold(); step({}, ['attack']); for (let i = 0; i < 12; i++) { hold(); p3.invuln = 5; step({}, null); }
      check('Opening: a perfect dodge opens the foe; the next cut gets past the armored head and does 1 more', clang && openOn && wz.hp === 6, { clangBefore: clang, openOn, hpAfter: wz.hp });
      // finisher band on a dash-strike kill; whispers are queued once each
      hold(); wz.state = 'stun'; wz.hp = 2; SH.test.place(97, 14); p3.facing = 1; p3.dashCd = 0; A.opening = 0; for (let i = 0; i < 20; i++) { wz.state = 'stun'; wz.t = 0; step({}, null); }
      step({ right: true }, ['dash']); step({ right: true }, ['attack']); let band = null; for (let i = 0; i < 30; i++) { SH.fx.hitstop = 0; step({}, null); if (A.band) band = A.band.text; }
      A.said = {}; A.queue.length = 0; A.whisper('dodge'); A.whisper('dodge'); A.whisper('dodge'); const queued = A.queue.length; A.whisperGap = 0; A.whisperT = 0; A.band = null;
      step({}, null); const shown = document.getElementById('whisper').classList.contains('show'), text = document.getElementById('w-text').textContent;
      check('Finisher band on a dash-strike kill; a whisper slides in (each line once per save)', band === 'RUN THROUGH' && wz.dead && queued === 2 && shown && text.length > 10, { band, queued, shown, text });
      // the Constellation: Starlight buys a heart, and it is in the save
      SH.saves.erase(0); G.newGame(0); G.hud.cardGo(); G.progress.motes = { woods: 29, prologue: 20 }; G.base.progress.motes = { woods: 29, prologue: 20 };
      const S = SH.stars, free0 = S.free(), max0 = P().maxHearts, ok = S.buy('heart'), no = S.buy('edge'), max1 = P().maxHearts;
      const saved = SH.saves.all()[0]; const kept = saved && saved.stars && saved.stars.heart === 1;
      G.loadSlot(0); G.hud.cardGo && G.hud.cardGo(); const afterLoad = P().maxHearts;
      check('Constellation: 30 Starlight lights The Huntress (+1 heart), too little is refused, and it survives a reload', free0 === 49 && ok && !no && max1 === max0 + 1 && S.free() === 19 && kept && afterLoad === max0 + 1,
        { free0, bought: ok, refused: !no, hearts: [max0, max1, afterLoad], left: S.free(), inSave: !!kept });
      SH.saves.erase(0);
    })();

    // Other perspectives: the flight (into the screen), the mural (face-on), the city (from above)
    (function () {
      const M = SH.modes;
      SH.test.load(2, { modes: true }); G.progress.bonds = {}; SH.test.choice = 0;
      let f = 0; while (!G.mode && f++ < 3000) talk({}, null);
      const started = G.mode === 'flight', hudHidden = getComputedStyle(document.getElementById('hud')).display === 'none';
      let maxObjs = 0, kinds = new Set(), frames = 0;
      while (G.mode === 'flight' && frames++ < 3000) {
        const s = M.cur.s; s.objs.forEach(o => kinds.add(o.kind)); maxObjs = Math.max(maxObjs, s.objs.length);
        // a simple pilot: go to the nearest star, but get out of the way of anything else that is close
        const close = s.objs.filter(o => o.z < 0.5).sort((a, b) => a.z - b.z), bad = close.find(o => o.kind !== 'star' && Math.abs(o.x - s.x) < 0.34 && Math.abs(o.y - s.y) < 0.4), star = close.find(o => o.kind === 'star');
        const held = {};
        if (bad) { held[bad.x > s.x ? 'left' : 'right'] = true; }
        else if (star) { if (star.x > s.x + 0.05) held.right = true; else if (star.x < s.x - 0.05) held.left = true; if (star.y > s.y + 0.05) held.down = true; else if (star.y < s.y - 0.05) held.up = true; }
        step(held, null);
      }
      const res = { stars: 0 }; const b = G.progress.bonds.caelum || { pts: 0 };
      for (let i = 0; i < 400 && G.activeGoal !== 'arrive'; i++) talk({}, null);
      check('Flight (into the screen): Caelum flies Wren out of Spring; starlight, arrows and storm cloud come at you; it ends on the road to Starhaven', started && hudHidden && kinds.has('star') && kinds.has('arrow') && kinds.has('cloud') && !G.mode && G.activeGoal === 'arrive' && b.pts >= 15,
        { started, hudHidden, kinds: [...kinds], seconds: +(frames / 60).toFixed(1), caelumPoints: b.pts, goal: G.activeGoal });
      // the mural, traced
      for (let i = 0; i < 600 && G.state !== 'play'; i++) talk({}, null);
      G.flags.arrive = true; const m = G.world.room.def.mural; SH.test.place(m.x + m.w / 2, 16);
      for (let i = 0, calm = 0; i < 3000 && calm < 20; i++) { talk({}, null); calm = G.state === 'play' && !G.pending ? calm + 1 : 0; }   // let the walk's scenes play out
      G.flags.arrive = true; SH.test.place(m.x + m.w / 2, 16); step({}, null);
      step({}, ['up']); const inMural = G.mode === 'mural'; let mf = 0;
      while (G.mode === 'mural' && mf++ < 3000) { const s = M.cur.s, p = s.done ? null : [[0.5, 0.14], [0.56, 0.36], [0.74, 0.38], [0.6, 0.5], [0.66, 0.72], [0.5, 0.6], [0.34, 0.72], [0.4, 0.5], [0.26, 0.38], [0.44, 0.36], [0.5, 0.14]][s.i]; const held = {}; if (p) { if (p[0] > s.bx + 0.006) held.right = true; else if (p[0] < s.bx - 0.006) held.left = true; if (p[1] > s.by + 0.01) held.down = true; else if (p[1] < s.by - 0.01) held.up = true; } step(held, null); }
      for (let i = 0; i < 30; i++) step({}, null);
      check('Mural (face to the wall): PAINT opens the wall; tracing all eleven points finishes it and the street wakes', inMural && !G.mode && G.flags.painted && G.world.cityLightTarget === 1, { inMural, seconds: +(mf / 60).toFixed(1), painted: !!G.flags.painted });
      // the city from above: walk to Bram
      SH.test.load(3, { modes: true }); G.progress.bonds = {}; G.runScript('evening2');
      f = 0; while (!G.mode && f++ < 600) talk({}, null);
      const inCity = G.mode === 'city'; let cf = 0, nearWho = null;
      while (G.mode === 'city' && cf++ < 900) { const s = M.cur.s, t = s.spots[1], held = {}; if (t.x < s.x - 3) held.left = true; else if (t.x > s.x + 3) held.right = true; if (t.y + 34 < s.y - 3) held.up = true; else if (t.y + 34 > s.y + 3) held.down = true; if (s.near === 1) nearWho = s.spots[1].who; step(held, s.near === 1 && s.pick < 0 ? ['jump'] : null); }
      for (let i = 0; i < 30 && !seen.has('ev2_bram'); i++) talk({}, null);
      check('City (from above): walking up to Bram in the Lamp Square spends the evening with Bram', inCity && nearWho === 'bram' && !G.mode && seen.has('ev2_bram'), { inCity, nearWho, seconds: +(cf / 60).toFixed(1), withBram: seen.has('ev2_bram') });
      SH.modes.auto = true;
    })();

    // A resident's request: Old Mirelle's cat
    (function () {
      SH.test.load('ashes', { story: false }); G.progress.mem = {}; G.progress.bonus = 0; G.progress.motes = {};
      const cat = G.world.things.find(e => e.kind === 'pickup' && e.what === 'cat'), mir = G.world.npcs.find(n => n.id === 'mirelle');
      const before = SH.stars.gathered();
      SH.test.place(mir.x / T - 0.5, 16); for (let i = 0; i < 5; i++) step({}, null); step({}, ['up']); const asked = G.script && G.script.id === 'ashes_mirelle';
      for (let i = 0; i < 300 && G.state === 'talk'; i++) talk({}, null);
      P().x = cat.x; P().y = cat.y; for (let i = 0; i < 400 && (i < 5 || G.state === 'talk'); i++) talk({}, null);
      check('Errand: Old Mirelle asks after her cat; finding it on the awning is remembered and pays 10 Starlight', !!mir && asked && cat.got && G.recalls('cat') && SH.stars.gathered() === before + 10, { asked, found: cat.got, remembered: G.recalls('cat'), starlight: [before, SH.stars.gathered()] });
    })();

    // Experience: levels are earned by playing, each gives a perk, and they are in the save
    (function () {
      SH.saves.erase(0); G.newGame(0); G.hud.cardGo(); const X = SH.xp, p = P();
      const l0 = X.level(), h0 = p.maxHearts, dash0 = X.dash();
      X.gain(30); const l2 = X.level(), bow = X.quick();
      X.gain(60); const l3 = X.level(), dash = X.dash();
      X.gain(60); const l4 = X.level(), h4 = P().maxHearts, band = SH.arts.band && SH.arts.band.text;
      const chip = document.querySelector('#lvl b').textContent, saved = SH.saves.all()[0];
      // aim assist: an attack with no direction held turns to face the enemy behind her
      SH.test.load('ring', { story: false }); const q = P(), e = G.world.things.find(t => t.kind === 'thornSprite'); e.x = q.x - 30; e.y = q.y; q.facing = 1; step({}, ['attack']); step({}, null);
      check('Experience: 30 XP is level 2 (quicker bow), 90 is level 3 (quicker dash), 150 is level 4 (+1 heart); shown and announced, and saved only from the chapter start (no farming by reload). Aim assist turns an undirected strike to the enemy', l0 === 1 && l2 === 2 && bow < 1 && l3 === 3 && dash < dash0 && l4 === 4 && h4 === h0 + 1 && band === 'LEVEL 4' && chip === 'LV 4' && saved && saved.xp === 0 && q.facing === -1,
        { levels: [l0, l2, l3, l4], hearts: [h0, h4], band, chip, savedXp: saved && saved.xp, turnedToEnemy: q.facing === -1 });
      // No farming: bonds won mid-chapter are undone by Restart chapter and are not in the save; a bad slot loads safely
      SH.saves.erase(0); G.newGame(0); G.hud.cardGo(); G.bond('nessa', 30, false, 'test');
      const mid = (SH.saves.all()[0].bonds.nessa || { pts: 0 }).pts; document.getElementById('m-restart').click();
      const after = (G.progress.bonds.nessa || { pts: 0 }).pts;
      localStorage.setItem('starhaven.slots.v1', JSON.stringify([{ chapter: 'x', bonds: 5, met: 'no', xp: 600, playFrames: null }, { version: 99, chapter: 2 }, null]));
      let d0 = null, d1 = null, err = null; try { d0 = SH.saves.describe(SH.saves.all()[0]); d1 = SH.saves.describe(SH.saves.all()[1]); } catch (e) { err = String(e); }
      check('No farming: Restart chapter undoes bonds won in it, and saves hold the chapter start; a broken or newer save is read safely', mid === 0 && after === 0 && !err && d0 && d0.level === 7 && d1 && d1.future,
        { savedMid: mid, afterRestart: after, err, level: d0 && d0.level, future: d1 && d1.future });
      SH.saves.erase(0); SH.saves.erase(1);
      SH.saves.erase(0);
    })();

    // Chapter 2, more to do: Bram's question, his three rings, plums for Iris
    (function () {
      SH.test.load('ring', { story: false }); G.progress.bonds = {}; G.progress.mem = {}; SH.test.choice = 0; const p = P(), w = G.world;
      const bram = w.npcs.find(n => n.id === 'bram'); SH.test.place(bram.x / T + 1, 16); for (let i = 0; i < 4; i++) step({}, null); step({}, ['up']);
      const asked = G.script && G.script.id === 'ring_bram_talk'; for (let i = 0; i < 400 && G.state === 'talk'; i++) talk({}, null);
      const rings = w.things.filter(e => e.kind === 'target');
      const run = n => { for (let i = 0; i < n; i++) { SH.fx.hitstop = 0; step({}, null); } };
      SH.test.place(rings[0].x / T - 1.3, 16); p.facing = 1; run(3); step({}, ['attack']); run(20);                         // low: from the ground
      SH.test.place(rings[1].x / T - 1.2, 16); p.facing = 1; run(30); step({ up: true }, ['attack']); run(30);              // middle: a rising strike
      SH.test.place(rings[2].x / T - 1.3, 16); p.facing = 1; run(30); step({ jump: true }, ['jump']); let hitAir = false;
      for (let i = 0; i < 40; i++) { const press = !p.swing && p.vy > -3 && !rings[2].hit ? ['attack'] : null; SH.fx.hitstop = 0; step({ jump: true }, press); }
      for (let i = 0; i < 400 && (i < 30 || G.state === 'talk'); i++) talk({}, null);
      const pl = w.things.find(e => e.kind === 'pickup' && e.what === 'plums'); p.x = pl.x; p.y = pl.y; for (let i = 0; i < 300 && (i < 5 || G.state === 'talk'); i++) talk({}, null);
      const b = G.progress.bonds.bram || { pts: 0 };
      check('Chapter 2: Bram asks why she stays (remembered); his three rings fall to a cut, a rising strike and an air strike; plums are found for Iris', asked && rings.every(r => r.hit) && G.recalls('bramTruth') && G.recalls('rings') && G.recalls('plums') && b.pts >= 20,
        { asked, rings: rings.map(r => r.hit), remembered: Object.keys(G.progress.mem), bram: b.pts });
    })();

    // Systems explain themselves the first time, once
    (function () {
      SH.test.load('woods', { story: false, explain: true }); G.progress.seen = {};
      const m = G.world.motes[0]; SH.test.place(m.x / T - 0.5, 16); P().x = m.x; P().y = m.y + 20; step({}, null); step({}, null);
      const notYet = G.state === 'play'; let waited = 0; while (G.state === 'play' && waited++ < 900) step({}, null);   // it waits for a quiet moment (twelve seconds into a new place)
      const shown = G.state === 'explain' && document.getElementById('explain').classList.contains('show'), title = document.getElementById('ex-title').textContent;
      const t0 = G.world.time; for (let i = 0; i < 20; i++) step({}, null); const held = G.world.time === t0;
      G.explainClose(); const closed = G.state === 'play';
      const m2 = G.world.motes[1]; P().x = m2.x; P().y = m2.y + 20; step({}, null); step({}, null);
      const list = Object.keys(SH.STORY.EXPLAIN).length;
      check('Explained once, and not at once: the first Starlight opens a card after a pause, it holds the game; the second does not; ten systems are listed', notYet && waited > 300 && shown && title === 'Starlight' && held && closed && G.state === 'play' && list === 10, { shown, title, held, closed, again: G.state, listed: list });
      G.noExplain = true;
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
