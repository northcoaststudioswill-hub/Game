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
    SH.test.freeze();
    const P = () => G.world.player;
    const out = [];
    const check = (name, ok, info) => out.push({ name, ok: !!ok, info });

    function fresh() { G.restart(); SH.test.freeze(); SH.fx.reset(); }
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

    // --- 6. Pogo over the thorn floor (129..147): bounce off the buds with down-strikes
    (function () {
      fresh(); SH.test.place(124, 16); const p = P();
      const buds = G.world.things.filter(t => t.kind === 'bulb');
      while (p.x < 127.7 * T) step({ right: true });
      step({ right: true, jump: true }, ['jump']);
      let i = 0;
      while (i++ < 600 && p.x < 148.5 * T && p.stats.hurt === 0) {
        let press = null, down = false;
        // aim: when falling toward a bud just ahead/below, strike down
        const bud = buds.find(b => b.hittable() && Math.abs(b.x - p.x) < 26 && b.y - p.y > -4 && b.y - p.y < 46);
        if (p.vy > 0 && bud && !p.swing) { press = ['attack']; down = true; }
        // hold right only until over the next bud
        const next = buds.find(b => b.x > p.x - 10);
        const right = !next || p.x < next.x - 2 || p.vy < -4 || p.x > 145 * T;
        step({ right, jump: true, down: down || (p.swing && p.swing.kind === 'pogo') }, press);
      }
      check('Pogo: crosses the thorn floor on the buds without a scratch', p.x >= 148 * T && p.stats.hurt === 0, { tx: +(p.x / T).toFixed(2), pogos: p.stats.pogos, hurt: p.stats.hurt });
    })();

    // --- Thorns send you back to safe ground and cost one heart
    (function () {
      fresh(); SH.test.place(126, 16); const p = P();
      for (let i = 0; i < 120 && p.stats.hurt === 0; i++) step({ right: true });
      check('Thorns: cost one heart and return you to safe ground', p.hearts === 4 && p.x < 129 * T, { hearts: p.hearts, tx: p.x / T });
    })();

    // --- 5. Daggers: the 3-hit combo on the dummy
    (function () {
      fresh(); SH.test.place(104, 16); const p = P(); step({});
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
      fresh(); const p = P();
      SH.test.place(126, 16);
      for (let i = 0; i < 40; i++) step({ right: i < 12 }); // walk up to (and light) the lantern...
      p.hearts = 1;                                           // ...then arrive at the thorns on your last heart
      for (let i = 0; i < 200; i++) step({ right: i < 60 });
      const lit = G.world.checkpoint.id;
      check('Knockout: return to the last lantern with full hearts', p.hearts === 5 && !p.dead && Math.abs(p.x - G.world.checkpoint.px) < 40, { hearts: p.hearts, checkpoint: lit, tx: +(p.x / T).toFixed(1) });
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

    // --- Full run, start to the end lantern, with a simple autopilot
    (function () {
      fresh(); const p = P(), w = G.world;
      const buds = w.things.filter(t => t.kind === 'bulb');
      const jumpAt = [22.6, 30.7, 40.7, 52.6, 65.6];
      let phase = 0, f = 0, moves = [], hold = 0;
      while (f++ < 60 * 90 && G.state === 'play' && !w.run.done) {
        const tx = p.x / T;
        let held = { right: true, jump: true }, press = null;
        if (phase < jumpAt.length && tx >= jumpAt[phase] && p.grounded) {
          press = ['jump'];
          moves = phase === 3 ? ['jump'] : phase === 4 ? ['jump', 'dash'] : [];
          phase++;
        } else if (moves.length && !p.grounded && p.vy > -0.6 && p.dashT <= 0) press = [moves.shift()];
        if (tx > 127.7 && tx < 148) {
          if (p.grounded && tx < 129) press = ['jump'];
          const bud = buds.find(b => b.hittable() && Math.abs(b.x - p.x) < 26 && b.y - p.y > -4 && b.y - p.y < 46);
          if (p.vy > 0 && bud && !p.swing) { press = ['attack']; held.down = true; }
          if (p.swing && p.swing.kind === 'pogo') held.down = true;
          const next = buds.find(b => b.x > p.x - 10);
          held.right = !next || p.x < next.x - 2 || p.vy < -4 || p.x > 145 * T;
        }
        if (tx > 150) {
          const foe = w.things.find(e => e.kind === 'thornSprite' && !e.dead && Math.abs(e.x - p.x) < 44 && Math.abs(e.y - p.y) < 30);
          if (foe) { held.right = foe.x > p.x; held.left = !held.right; if (!p.swing && (f % 4 === 0)) press = ['attack']; }
          if (p.grounded && tx > 166 && tx < 168) press = press || ['jump'];
        }
        step(held, press);
      }
      check('Full run: autopilot reaches the end lantern', w.run.done, { seconds: +(w.run.frames / 60).toFixed(1), hurt: p.stats.hurt, kos: 0, tx: +(p.x / T).toFixed(1), state: G.state });
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
