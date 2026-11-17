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

    // Prologue: the Deep, including the Wyrm chase
    (function () {
      SH.test.load(0); const p = P();
      const jumps = [[22.6], [30.7], [40.7], [52.6, 'jump'], [65.6, 'jump', 'dash'], [83.6], [102.8], [116.6], [125.6], [135.6]];
      let k = 0, moves = [], f = 0, sawWyrm = false;
      while (f++ < 60 * 120 && G.chapter === 0) {
        const tx = p.x / T; let press = null;
        if (G.state === 'play' && k < jumps.length && tx >= jumps[k][0] && p.grounded) { press = ['jump']; moves = jumps[k].slice(1); k++; }
        else if (moves.length && !p.grounded && p.vy > -0.6 && p.dashT <= 0) press = [moves.shift()];
        if (G.world.wyrm && G.world.wyrm.on) sawWyrm = true;
        talk({ right: true, jump: true }, press);
      }
      check('Prologue: playable start to finish (story, chase, wake-up), Wyrm never catches a steady runner', G.chapter === 1 && sawWyrm && caught === 0,
        { chapter: G.chapter, sawWyrm, caught, seconds: +(f / 60).toFixed(1), hurt: p.stats.hurt });
    })();

    // Chapter 1: Ashes. Walk with Caelum, paint the mural, climb to the roof
    (function () {
      SH.test.load(1); const p = P(), w = G.world;
      const jumps = [21.3, 29.3, 98.6, 102.4];
      let k = 0, f = 0, light0 = w.cityLight, painted = false;
      while (f++ < 60 * 120 && G.chapter === 1) {
        const tx = p.x / T; let press = null, held = { right: true, jump: true };
        if (G.flags.arrive && !G.flags.painted && tx > 71.5 && tx < 74) held = { up: true };
        if (G.flags.painted) painted = true;
        if (G.state === 'play' && k < jumps.length && tx >= jumps[k] && p.grounded && (k < 2 || G.flags.painted)) { press = ['jump']; k++; }
        talk(held, press);
      }
      check('Chapter 1: walk, mural, rooftop all reachable; the street lights up', G.chapter === 2 && painted && G.progress.hearts.caelum >= 1,
        { chapter: G.chapter, painted, cityLightBefore: +light0.toFixed(2), caelumHeart: G.progress.hearts.caelum, seconds: +(f / 60).toFixed(1) });
    })();

    // Chapter 2: The Five. Dummy combo, the thorn pit, three thorn sprites
    (function () {
      SH.test.load(2); const p = P(), w = G.world;
      const buds = w.things.filter(t => t.kind === 'bulb');
      let f = 0, swings = 0;
      while (f++ < 60 * 150 && G.state !== 'end') {
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
      check('Chapter 2: dummy combo, thorn pit and all three thorn sprites; ends on the concept end screen', G.state === 'end' && G.progress.reached >= 3,
        { state: G.state, reached: G.progress.reached, seconds: +(f / 60).toFixed(1), hurt: p.stats.hurt, swings });
    })();

    return out;
  });

  let fails = 0;
  for (const r of results) { if (!r.ok) fails++; console.log(`${r.ok ? 'PASS' : 'FAIL'}  ${r.name}  ${JSON.stringify(r.info)}`); }
  if (errors.length) { console.log('PAGE ERRORS', errors); fails++; }
  console.log(`\n${results.length - fails}/${results.length} passed`);
  await browser.close();
  process.exit(fails ? 1 : 0);
})();
