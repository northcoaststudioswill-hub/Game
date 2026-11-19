const { chromium, devices } = require('playwright');
(async () => { const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--autoplay-policy=no-user-gesture-required'] });
  for (const mode of ['desktop', 'phone']) { const ctx = await b.newContext(mode === 'phone' ? devices['Pixel 7'] : { viewport: { width: 800, height: 450 } }); const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
    await p.goto('http://localhost:8765/index.html'); await p.waitForTimeout(900);
    const r = await p.evaluate(async () => { G.audioInit(); const ac = G.audioCtx(); await ac.resume(); const names = G.SFX_EXTRA.concat(['hit', 'swing', 'crit', 'clang', 'wall', 'cheer', 'boom']); let peak = 0, calls = 0; const t0 = performance.now();
      for (let round = 0; round < 60; round++) { for (let i = 0; i < 12; i++) { G.sfx(names[Math.floor(Math.random() * names.length)]); calls++; } G.hitSound({ cls: 'fighter', isPlayer: false, arm: 'f_axe' }, { isPlayer: true }, { heavy: 1 }, true); peak = Math.max(peak, G.soundLive()); await new Promise(r => setTimeout(r, 50)); }
      const mid = G.soundLive(); await new Promise(r => setTimeout(r, 4500)); return { lite: G.soundLite(), calls, peakVoices: peak, atEnd: mid, afterQuiet: G.soundLive(), ms: Math.round(performance.now() - t0), state: ac.state }; });
    console.log(mode, JSON.stringify(r), 'ERRORS', errs.length, errs.slice(0, 2).join('|')); await ctx.close(); }
  await b.close(); })();
