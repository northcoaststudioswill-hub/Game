import { chromium } from 'playwright';
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const page = await (await browser.newContext({ viewport: { width: 844, height: 390 } })).newPage();
const errors = []; page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push('C:' + m.text().slice(0, 200)); });
const ev = (f, a) => page.evaluate(f, a), wait = ms => page.waitForTimeout(ms);
await page.goto('file:///home/claude/below-the-sun/issue/issue.html'); await wait(2500);
await ev(() => { SC.manual = true; window.T = { run(s) { const n = Math.round(s * 30); for (let i = 0; i < n; i++) SC.tick(1 / 30); }, dlg() { let n = 0; while ((SC.ui.dlg || SC.ui.pg || SC.ui.mem) && n++ < 80) { if (SC.ui.mem) SC.ui.memEnd(); else if (SC.ui.pg) { SC.ui.pg.t = 0; SC.ui.tap(); } else { SC.ui.dlg.full = true; SC.ui.tap(); } } } }; SC.story.newGame(); });
for (let i = 0; i < 300 && !(await ev(() => SC.player.control)); i++) { await ev(() => { T.run(0.5); T.dlg(); }); } await ev(() => T.run(1));
const st = () => ev(() => ({ state: SC.state, ctl: SC.player.control, pos: SC.player.pos.toArray().map(v => +v.toFixed(1)), enc: SC.story.enc && SC.story.enc.id, en: SC.enemies.map(e => [e.kind, e.state, e.enc && e.enc.id, +e.pos.x.toFixed(0), +e.pos.y.toFixed(0), +e.pos.z.toFixed(0), e.hp]), flags: Object.keys(SC.flags).join(',') }));
console.log(JSON.stringify(await st()));
await page.screenshot({ path: '/home/claude/shots/issue/post-0.png' });
// stand near the street watch before the alley is done: they must not wake. Then with the alley done: they must.
const g = await ev(() => { const m = SC.enemies.find(e => e.enc && e.enc.id === 'street'); return m ? [m.pos.x, m.pos.y, m.pos.z] : null; });
if (g) { await ev(g => { SC.player.place(g[0] + 5, g[1], g[2] + 4, 0); SC.cam.snapBehind(); T.run(1.2); }, g); console.log('near, alley not done:', JSON.stringify((await st()).en.filter(e => e[2] === 'street').map(e => e[1])));
  await page.screenshot({ path: '/home/claude/shots/issue/post-1.png' });
  await ev(() => { SC.flags.path = 'ember'; SC.player.setPath && SC.player.setPath('ember'); SC.flags.e_alley = 1; SC.story.enc = null; SC.enemies.filter(e => e.enc && e.enc.id === 'alley').forEach(e => e.remove()); T.run(0.6); });
  const s2 = await st(); console.log('alley done:', s2.enc, JSON.stringify(s2.en.filter(e => e[2] === 'street').map(e => e[1])));
  await ev(() => T.run(1.5)); await page.screenshot({ path: '/home/claude/shots/issue/post-2.png' });
  // kill them: does the next wave come, and does the encounter finish
  for (let i = 0; i < 12; i++) await ev(() => { SC.enemies.filter(e => e.enc && e.enc.id === 'street' && e.state !== 'dead').forEach(e => { e.hp = 1; e.hit(50, 0, 1, {}); }); T.run(1.5); T.dlg(); });
  const s3 = await st(); console.log('after:', s3.enc, s3.flags, JSON.stringify(s3.en.map(e => [e[0], e[1], e[2]])));
  // die and come back: are the posts filled again
  await ev(() => { SC.story.load(); T.run(2); T.dlg(); T.run(1); }); const s4 = await st(); console.log('reload:', JSON.stringify(s4.en.map(e => [e[1], e[2]])));
}
// run pose and hover ceiling
const hv = await ev(() => { const p = SC.player; p.place(0, 0, 30, 0); T.run(0.3); SC.input.press('jump'); SC.input.hold = { y: 1 }; let mx = 0; for (let i = 0; i < 150; i++) { SC.tick(1 / 30); mx = Math.max(mx, p.lift); } SC.input.hold = {}; return [+mx.toFixed(2), p.state]; });
console.log('hover max', hv, 'errors', errors.slice(0, 5)); await browser.close();
