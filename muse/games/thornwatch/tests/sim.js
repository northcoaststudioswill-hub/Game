// Balance sim: three kinds of player run garden 1 (or any map) at full speed, headless.
//   node tests/sim.js [crowd] [map]     crowd = price rise per sprout already planted (0 = v3.7 flat prices)
// spam:   plants the cheapest good sprout at the best open spot whenever it can, never grows anything
// grower: plants up to 8, then grows them (fork, then grand), adds keepers
// noob:   one EMBER a dawn, nothing else
const { chromium } = require('playwright');
const path = require('path');
const file = path.resolve(path.join(__dirname, '..', 'Sprouts+Rootdeep+Sproutwild+Thornwatch.html'));
(async () => {
  const b = await chromium.launch(); const p = await (await b.newContext({ viewport: { width: 430, height: 932 } })).newPage();
  p.on('pageerror', e => console.log('PAGEERR', e.message));
  await p.goto('file://' + file); await p.waitForTimeout(400);
  await p.evaluate(() => document.querySelector('.cart[data-i="3"]').dispatchEvent(new PointerEvent('pointerdown', { bubbles: true })));
  await p.waitForTimeout(4300);
  const crowds = process.argv[2] ? [+process.argv[2]] : [0, 0.1, 0.15, 0.2]; const map = +process.argv[3] || 1;
  for (const crowd of crowds) for (const strat of ['spam', 'grower', 'noob']) {
    const res = await p.evaluate(([crowd, strat, map]) => {
      const F = window.__g.TWF(); const M = F.meta(); M.guideDone = true; M.introSeen = true; M.seen = M.seen || {};
      for (const k of ['g1', 'g2', 'g3', 'b1', 'b2', 'b3', 'w1', 'w2', 'w3', 'mote']) M.seen[k] = 1;
      F.setCrowd(crowd); F.newRunAt(map, 's', 1); let R = F.run(); R.card = null; R.guide = 0;
      const L = F.pathLen(), pts = []; for (let d = 0; d < L; d += 6) pts.push(F.pathPos(d));
      const best = () => { let o = null; for (let x = 16; x <= 224; x += 16) for (let y = 40; y <= 260; y += 16) { if (!F.spotOK(x, y)) continue; let c = 0; for (const q of pts) if (Math.hypot(q.x - x, q.y - y) < 34) c++; if (!o || c > o.c) o = { x, y, c }; } return o; };
      const order = [0, 1, 3, 0, 5, 2, 1, 3];
      const sprouts = () => R.towers.filter(t => t.hero < 0);
      const plant = i => { const c = F.sproutCost(i), s = best(); if (!s || R.petals < c) return false; R.petals -= c; F.plantAt(s.x, s.y, i, 1); return true; };
      const spend = dawn => {
        if (strat === 'noob') { if (dawn) plant(0); return; }
        if (strat === 'spam') { for (let k = 0; k < 20; k++) if (!plant(order[sprouts().length % order.length])) break; return; }
        for (let k = 0; k < 20; k++) { // grower
          if (sprouts().length < 8) { if (!plant(order[sprouts().length % order.length])) break; continue; }
          const t1 = sprouts().find(t => t.lv === 1 && t.type !== 4);
          if (t1) { const c = F.forkCost(t1.type, 1); if (R.petals < c) break; R.petals -= c; t1.lv = 2; t1.variant = 1; continue; }
          if (!R.towers.some(t => t.hero === 0)) { const c = F.heroCost(0), s = best(); if (R.petals < c || !s) break; R.petals -= c; F.placeHero(s.x, s.y, 0); continue; }
          const t2 = sprouts().find(t => t.lv === 2);
          if (t2) { const c = F.grandCost(t2.type); if (R.petals < c) break; R.petals -= c; t2.lv = 3; continue; }
          if (!plant(order[sprouts().length % order.length])) break;
        }
      };
      const log = []; let guard = 0;
      while (F.state() === 'g5play' && guard++ < 40) {
        R = F.run(); R.card = null; const night = R.night; spend(true); const h0 = R.heart;
        F.startNight(); F.skipCine(); let t = 0;
        while (F.state() === 'g5play' && F.run().round && t < 600) { F.skipCine(); F.update(1 / 30); t += 1 / 30; if (((t * 30) | 0) % 60 === 0) spend(false); }
        R = F.run(); log.push(night + ':' + (h0 - R.heart) + 'L/' + R.petals + 'p/' + R.towers.length + 't');
        if (F.state() !== 'g5play') break;
      }
      return { end: F.state(), heart: F.run().heart, log: log.join(' ') };
    }, [crowd, strat, map]);
    console.log('crowd', crowd, strat.padEnd(6), res.end === 'g5win' ? 'WON ' : res.end === 'g5over' ? 'LOST' : res.end, 'heart', String(res.heart).padStart(3), '|', res.log);
  }
  await b.close();
})();
