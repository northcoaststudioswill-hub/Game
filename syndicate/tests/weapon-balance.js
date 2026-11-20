// the balance pass from the weapon tournament is applied once (not stacked) and the named fighters who carry those weapons are offset
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] }); const errs = [];
  const p = await b.newPage({ viewport: { width: 800, height: 500 } }); p.on('pageerror', e => errs.push(e.message));
  await p.goto('http://localhost:8765/index.html'); await p.waitForTimeout(1500);
  const r = await p.evaluate(() => { const A = G.ABILITIES, o = id => G.OPPONENTS.find(x => x.id === id) || G.ascent.FOES.find(x => x.id === id);
    return { ham: A.c_hammer.dmg.join('d'), pick: A.c_pick.dmg.join('d'), frost: A.s_frost.dmg.join('d'), acid: A.w_acid.dmg.join('d'), hamFaster: A.c_hammer.wind < A.c_basic.wind * 1.4, bea: +o('beatrix').dmgMul.toFixed(3), queen: +o('asc_queen').dmgMul.toFixed(3) }; });
  console.log(JSON.stringify(r));
  const ok = r.ham === '2d8' && r.pick === '2d6' && r.frost === '1d8' && r.acid === '1d8' && r.hamFaster && r.bea < 0.95 && r.queen < 1;
  console.log(ok ? 'PASS' : 'FAIL', 'ERRORS', errs.length, errs.slice(0, 3).join(' | ')); await b.close(); process.exit(ok && !errs.length ? 0 : 1); })();
