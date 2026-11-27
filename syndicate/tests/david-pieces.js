// David's first meeting is short and explains the contract; what he wants comes out a piece at a time, one per later death and per
// new visit to his cellar, in order; once it is all out, he goes back to his usual lines
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] }); const errs = [];
  const p = await b.newPage({ viewport: { width: 900, height: 600 } }); p.on('pageerror', e => errs.push(e.message)); await p.addInitScript(() => { window.requestAnimationFrame = () => 0; });
  await p.goto('http://localhost:8765/index.html'); await p.waitForTimeout(1500);
  const R = await p.evaluate(async () => { G.bootSkip && G.bootSkip(); G.bootSkip && G.bootSkip(); G.muted = true;
    const st = G.state = G.newState(); st.hero = G.newHero('Vey', 'elf', 'rogue'); st.kitPicked = 1; G.scene = 'hub'; G.world.enter('hub');
    const heard = []; G.playScene = o => { heard.push(o.lines.map(l => l.text)); if (o.choices) { const c = o.choices.find(x => /Sign/.test(x.label)); setTimeout(() => { c && c.go(); setTimeout(() => { const x = document.querySelector('#panel #x'); x && x.click(); }, 20); }, 0); } else setTimeout(() => o.done && o.done(false), 0); };
    const revive = () => new Promise(r => G.oracle.revive(() => { G.ui.close(); r(); }));
    st.deaths = 1; await revive(); await new Promise(r => setTimeout(r, 50)); G.ui.close();
    const out = { first: heard[0] };
    for (let i = 0; i < 3; i++) { st.deaths++; await revive(); }
    out.deaths = heard.slice(1).map(h => h.join(' '));
    G.ui.oracle(); out.cellar1 = (document.querySelector('#panel .quote') || {}).textContent.slice(0, 80); G.ui.close();
    G.ui.oracle(); out.cellar2 = (document.querySelector('#panel .quote') || {}).textContent.slice(0, 80); G.ui.close();
    out.lore = st.davidLore; G.ui.oracle(); out.cellarAfter = (document.querySelector('#panel .quote') || {}).textContent.slice(0, 80); G.ui.close();
    return out; });
  console.log(JSON.stringify(R, null, 1));
  const f = R.first || [], all = f.join(' ');
  const ok = f.length <= 8 && /contract/i.test(all) && /soul/i.test(all) && /garden/i.test(all) && /haul you back/.test(all) && !/Eleven years/.test(all) && !/vessel/.test(all)
    && /Hate\? I am ABOVE/.test(R.deaths[0] + ' ' + (R.deaths.join(' '))) && R.lore === 5 && R.deaths.length === 3 && /^“?I tell the family|homeland/.test(R.cellar1) && /throne wants/.test(R.cellar2);
  console.log(ok ? 'PASS' : 'FAIL', 'ERRORS', errs.length, errs.slice(0, 3).join(' | ')); await b.close(); process.exit(ok && !errs.length ? 0 : 1); })();
