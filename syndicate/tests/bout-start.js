// a bout starts with both fighters on their marks, facing each other, and nobody else standing on the sand
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] }); const errs = []; let ok = true;
  for (const [W, H, tag] of [[1000, 620, 'desktop'], [390, 844, 'phone']]) {
    const p = await b.newPage({ viewport: { width: W, height: H } }); p.on('pageerror', e => errs.push(e.message));
    await p.addInitScript(() => { window.requestAnimationFrame = () => 0; }); await p.goto('http://localhost:8765/index.html'); await p.waitForTimeout(900); await p.evaluate(() => { G.bootSkip(); G.bootSkip(); G.muted = true; }); await p.waitForTimeout(300);
    await p.click('#bNew'); await p.click('.c-skip'); await p.click('#go'); await p.click('#ok'); await p.waitForTimeout(150);
    const r = await p.evaluate(() => { const st = G.state; Object.assign(st, { kitPicked: 1, toured: 1, tourAsked: 1, firstPath: 9, shownPlaces: { a: 1 }, wins: {} }); G.scene = 'hub'; G.fight.active = false; G.ui.hub(); G.ui.close(); if (G.talk) G.talkApi.skip(); G.ui.close(); G.ui.pit(); document.querySelector('[data-under]').click(); for (let i = 0; i < 6 && G.ui.isOpen(); i++) { const q = document.querySelector('#panel #go, #panel .big'); q && q.click(); }
      const F = G.fight, off = e => { const want = Math.atan2(e.foe.y - e.y, e.foe.x - e.x); return Math.abs(Math.atan2(Math.sin(e.aim - want), Math.cos(e.aim - want))); }; const out = { walkIn: [] };
      for (let i = 0; i < 100; i++) { F.update(1 / 60); if (i % 25 === 0) out.walkIn.push(+Math.max(off(F.P), off(F.E)).toFixed(2)); }
      let extra = 0; G.gfx.scene().traverse(o => { if (o.isMesh && o.visible) { const w = o.getWorldPosition(new THREE.Vector3()); if (Math.hypot(w.x, w.z) < 0.9 && w.y > 0.6 && w.y < 2.2) { let r = o; while (r.parent && r.parent.type !== 'Scene') r = r.parent; let vis = true, q = o; while (q) { if (!q.visible) vis = false; q = q.parent; } if (vis && r !== F.P.vis.g && r !== F.E.vis.g && r.children.length === 1 && r.children[0].isGroup) extra++; } } });
      out.extra = extra; out.gap = Math.round(Math.hypot(F.P.x - F.E.x, F.P.y - F.E.y)); return out; });
    const good = r.walkIn.every(a => a < 0.3) && r.extra === 0 && r.gap > 250; ok = ok && good; console.log(tag, JSON.stringify(r), good ? 'ok' : 'BAD'); await p.close(); }
  console.log(ok ? 'PASS' : 'FAIL', 'ERRORS', errs.length, errs.slice(0, 3).join(' | ')); await b.close(); process.exit(ok && !errs.length ? 0 : 1); })();
