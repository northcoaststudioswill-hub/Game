// Bug hunt: plays every chapter with random inputs (story, modes and explanation cards all on) and reports any error.
// Usage: node starhaven/game/tests/fuzz.js [frames per chapter]
const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const N = +process.argv[2] || 9000, b = await chromium.launch(), errors = [];
  for (const vp of [{ width: 844, height: 390 }, { width: 390, height: 844 }]) {
    const page = await b.newPage({ viewport: vp, hasTouch: true, isMobile: true });
    page.on('pageerror', e => errors.push(vp.width + 'w: ' + String(e.stack || e).split('\n').slice(0, 3).join(' | ')));
    await page.route(/fonts\./, r => r.abort());
    await page.goto('file://' + path.resolve(__dirname, '..', 'starhaven.html')); await page.waitForTimeout(300);
    for (let ch = 0; ch < 5; ch++) {
      const r = await page.evaluate(([ch, N]) => {
        let seed = ch * 7919 + 13; const rnd = () => (seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff;
        SH.front.go(() => { }); SH.test.load(ch, { modes: true, explain: true });
        const G = SH.game, acts = ['jump', 'attack', 'dash', 'up', 'gift', 'art', 'downstrike'], seen = new Set(); let held = { right: true }, far = 0, stuck = 0, lastX = 0;
        try {
          for (let f = 0; f < N; f++) {
            if (f % 90 === 0) SH.test.choice = (rnd() * 3) | 0;   // vary the answers, or the riddle is asked forever
            if (f % 40 === 0) held = { right: rnd() < 0.72, left: rnd() < 0.12, jump: rnd() < 0.5, up: rnd() < 0.15, down: rnd() < 0.1, gift: rnd() < 0.2 };
            const press = rnd() < 0.2 ? [acts[(rnd() * acts.length) | 0]] : null;
            if (G.state === 'explain') G.explainClose();
            if (G.state === 'card') G.hud.cardGo();
            if (G.state === 'end' || G.chapter !== ch) break;
            seen.add(G.state + (G.mode ? ':' + G.mode : ''));
            SH.test.step(1, held, press, G.state === 'talk' && !G.mode);
            const p = G.world.player; far = Math.max(far, p.x / 24);
            if (!isFinite(p.x) || !isFinite(p.y)) return { ch, bad: 'player position is not a number at frame ' + f };
          }
          SH.test.render();
        } catch (e) { return { ch, bad: String(e.stack || e).split('\n').slice(0, 3).join(' | ') }; }
        return { ch, far: Math.round(far), states: [...seen] };
      }, [ch, N]);
      console.log(vp.width + 'x' + vp.height, JSON.stringify(r));
      if (r.bad) errors.push(r.bad);
    }
    await page.close();
  }
  console.log(errors.length ? 'ERRORS\n' + errors.join('\n') : 'no errors');
  await b.close(); process.exit(errors.length ? 1 : 0);
})();
