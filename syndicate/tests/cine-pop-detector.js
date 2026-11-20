// steps the intro at 30fps and flags sudden picture changes inside a shot (not at cuts, not during flashes or fades)
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] }); const errs = [];
  const p = await b.newPage({ viewport: { width: 640, height: 360 } }); p.on('pageerror', e => errs.push(e.message));
  await p.addInitScript(() => { window.requestAnimationFrame = () => 0; }); await p.goto('http://localhost:8765/index.html'); await p.waitForTimeout(700); await p.evaluate(() => { G.bootSkip(); G.bootSkip(); }); await p.waitForTimeout(400); await p.click('#bNew');
  const res = await p.evaluate(() => { G.muted = true; const cv = G.gfx.renderer.domElement, sm = document.createElement('canvas'); sm.width = 64; sm.height = 36; const x = sm.getContext('2d', { willReadFrequently: true }); let prev = null, tt = 5, n = 0, lastIdx = -1, sinceCut = 0; const spikes = [];
    while (G.cine.active && n++ < 4000) { tt += 1 / 30; G.cine.update(1 / 30, tt); G.gfx.updateParticles && G.gfx.updateParticles(1 / 30); G.gfx.render(); const w = G.cine.where(); if (w.idx !== lastIdx) { lastIdx = w.idx; sinceCut = 0; prev = null; } sinceCut++;
      x.drawImage(cv, 0, 0, 64, 36); const d = x.getImageData(0, 0, 64, 36).data; if (prev && sinceCut > 4 && w.t < w.dur - 0.7) { let s = 0, big = 0; for (let i = 0; i < d.length; i += 4) { const q = Math.abs(d[i] - prev[i]) + Math.abs(d[i + 1] - prev[i + 1]) + Math.abs(d[i + 2] - prev[i + 2]); s += q; if (q > 90) big++; } const fl = document.querySelector('#cine .c-flash'), fo = fl ? +getComputedStyle(fl).opacity : 0; window._h = window._h || []; const hist = window._h; const med = hist.length >= 4 ? hist.slice(-6).sort((a, b) => a - b)[Math.floor(Math.min(6, hist.length) / 2)] : 999; if (big > 40 && big > med * 3.2 + 15 && fo < 0.05) spikes.push({ idx: w.idx, t: +w.t.toFixed(2), big, med }); hist.push(big); } else { window._h = []; } prev = d.slice(); }
    return spikes; });
  const byShot = {}; res.forEach(s => { (byShot[s.idx] = byShot[s.idx] || []).push(s.t + '(' + s.big + ' vs ' + s.med + ')'); });
  Object.keys(byShot).forEach(k => console.log('shot', k, byShot[k].slice(0, 12).join(' ')));
  console.log('ERRORS', errs.length); await b.close(); })();
