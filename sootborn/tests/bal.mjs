import { chromium } from 'playwright';
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome' });
const page = await (await browser.newContext({ viewport: { width: 844, height: 390 } })).newPage();
const ev = (f, a) => page.evaluate(f, a), wait = ms => page.waitForTimeout(ms);
await page.goto('file:///home/claude/below-the-sun/dist/index.html#noff'); await wait(600); await page.keyboard.press('Enter'); await wait(6000);
// an in-page bot that plays at 60 Hz with human-ish limits: reacts ~0.18s before a hit, uses the kit
for (const m of (process.env.M || 'ford,proctor,keep').split(',')) for (const diff of [1]) {
  const r = await ev(async ([m, diff]) => { const B = BTS.Brawl, I = BTS.Input; BTS.UI.clear(); DEV.quick = 1; Settings.d.diff = diff; const d = BTS.FF[m](); delete d.outro; delete d.arts; let done = false; B.start(d, () => { done = true; });
    const log = { deaths: 0, t: 0 }; let last = 0;
    return await new Promise(res => { const press = k => { I.queued.add(k); }; const iv = setInterval(() => { log.t += 1 / 30; if (done || !B.active || log.t > 170) { clearInterval(iv); res({ m, diff, t: +log.t.toFixed(0), won: done || B.phase === 'win', tries: d._tries || 0, revived: B.revived, hp: B.p.hp, foe: B.foes.map(f => Math.round(f.hp)) }); return; }
      if (B.phase !== 'fight' || B.art || B.sup) return; const p = B.p, f = B.nearest(p); if (!f) return; const dd = Math.hypot(f.x - p.x, f.y - p.y);
      for (const k of ['left', 'right', 'up', 'down']) I.kb[k] = false; I.kb.A = false;
      const threat = B.foes.find(o => (o.st === 'wind' && o.t > (o.second ? B.D.w2 : o.K.wind) - .2 && Math.hypot(o.x - p.x, o.y - p.y) < o.K.reach + 26) || (o.st === 'charge' && Math.hypot(o.x - p.x, o.y - p.y) < 60));
      if (threat && Math.random() < .8) { press(Math.random() < .3 ? 'R' : 'B'); if (Math.random() < .3) I.kb.R = true; return; } I.kb.R = false;
      if (p.fury >= 100) { I.kb.A = true; return; }
      if (dd > 34) { I.kb[f.x > p.x ? 'right' : 'left'] = true; if (Math.abs(f.y - p.y) > 6) I.kb[f.y > p.y ? 'down' : 'up'] = true; if (dd > 80 && Math.random() < .1) press('L'); return; }
      const r = Math.random(); if (r < .5) press('A'); else if (r < .65) press('X'); else if (r < .75) press('L'); else if (r < .8) press('Y');
    }, 33); }); }, [m, diff]);
  console.log(JSON.stringify(r));
}
await browser.close();
