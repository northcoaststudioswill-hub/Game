// Step 10's looks: the coat, the palm, the washer pose, the dock log, the docks hero, the Blade's leg. node step10.mjs
import { chromium } from 'playwright';
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const page = await (await browser.newContext({ viewport: { width: 1280, height: 720 } })).newPage();
const errors = []; page.on('pageerror', e => errors.push(e.message)); const wait = ms => page.waitForTimeout(ms), ev = (f, a) => page.evaluate(f, a);
const shot = n => page.screenshot({ path: `/home/claude/shots/v75/s10-${n}.png` });
await page.goto('file:///home/claude/below-the-sun/dist/index.html#noff'); await wait(600);
for (let i = 0; i < 40 && !(await ev(() => BTS.G.mode === 'title' && BTS.UI.stack.length)); i++) { await page.keyboard.press('Enter'); await wait(250); } await wait(300);
const talk = async () => { for (let i = 0; i < 30 && await ev(() => BTS.Dialogue.active); i++) { await page.keyboard.press('KeyE'); await wait(220); } };
// the ring at five years: the coat, Kestrel's palm on the riser
await ev(() => { BTS.UI.clear(); BTS.G.flags.susp = 2; BTS.Brawl.start(BTS.FF.ring2(), () => {}); BTS.UI.clear(); }); await wait(3600); await talk();
await ev(() => { const p = BTS.Brawl.p; p.x = -40; p.y = -6; p.fx = 1; p.fy = 0; }); await wait(700); await shot('ring'); console.log('hero in the ring:', await ev(() => BTS.Brawl.def.hero.id));
await ev(() => { BTS.Brawl.end(true); BTS.UI.clear(); BTS.Brawl.start(BTS.FF.sstair(), () => {}); BTS.UI.clear(); }); await wait(3600); await talk(); await ev(() => { const p = BTS.Brawl.p; p.x = -40; p.y = 4; }); await wait(600); await shot('sstair');
// Tier Six Stands: the row sways (two frames apart)
await ev(() => { BTS.Brawl.end(true); BTS.UI.clear(); BTS.Brawl.start(Object.assign(BTS.FF.stand(), { intro: null }), () => {}); BTS.UI.clear(); }); await wait(2600); await shot('stand-a'); await wait(1300); await shot('stand-b'); console.log('hum set:', await ev(() => BTS.Brawl.def.hum));
// the hand to the washer: the Son, ELEVEN begun
await ev(() => { BTS.Brawl.end(true); BTS.UI.clear(); BTS.Brawl.start(Object.assign(BTS.FF.son(), { intro: null }), () => {}); BTS.UI.clear(); }); await wait(2600);
await ev(() => { const B = BTS.Brawl; B.phase = 'fight'; B.p.fury = 100; B.foes[0].cd = 99; B.startSuper('rush'); }); await wait(650); await shot('washer'); console.log('ELEVEN winding up:', await ev(() => BTS.Brawl.sup && BTS.Brawl.sup.t));
await ev(() => { BTS.Brawl.end(true); BTS.UI.clear(); Prelude.still(5.5, 'docklog'); }); await wait(300); await shot('docklog'); await ev(() => { Prelude.done = null; Prelude.finish(); });
// the High Docks: the coat. The Stair: the Blade's leg
for (const [key, tag] of [['docks', 'docks'], ['stair', 'blade']]) {
  await ev(k => { BTS.UI.clear(); BTS.G.mode = 'cut'; Issue.fresh = 1; BTS.Cutscene.play([{ issue: k, or: [] }], () => {}); }, key);
  let fr = null; for (let i = 0; i < 80 && !fr; i++) { await wait(250); fr = page.frames().find(f => f !== page.mainFrame()); }
  for (let i = 0; i < 120; i++) { await wait(250); const st = await fr.evaluate(() => typeof SC !== 'undefined' && SC.state).catch(() => 0); if (st === 'play') { const c = await fr.evaluate(() => SC.player.control); if (c) break; await page.keyboard.press('Enter'); } }
  await wait(1500);
  if (key === 'docks') { await fr.evaluate(() => { SC.cam && (SC.manual = true); for (let i = 0; i < 20; i++) SC.tick(1 / 30); }); await shot(tag); console.log('docks hero spec:', await fr.evaluate(() => [SC.SPECS.hero.armor, SC.SPECS.hero.coat, SC.SPECS.hero.pal.top.toString(16)])); }
  else { const r = await fr.evaluate(() => { SC.manual = true; const S = SC.story, pl = SC.player; pl.place(0, 18, -40, Math.PI); for (let i = 0; i < 30; i++) SC.tick(1 / 30); return [typeof SC.limp, !!S.enc]; }); console.log('stair: limp fn, enc', r);
    for (let i = 0; i < 60; i++) { await fr.evaluate(() => { for (let k = 0; k < 10; k++) SC.tick(1 / 30); }); const s2 = await fr.evaluate(() => ({ st: SC.state, boss: (SC.enemies || []).filter(e => e.kind === 'boss').map(e => [e.pos.x.toFixed(1), e.pos.z.toFixed(1), Math.hypot(e.vel.x, e.vel.z).toFixed(1)]) })); if (s2.st !== 'play') { await page.keyboard.press('Enter'); await fr.evaluate(() => { SC.manual = false; }); await wait(400); await fr.evaluate(() => { SC.manual = true; }); continue; } if (s2.boss.length && +s2.boss[0][2] > 1) { console.log('boss walking', JSON.stringify(s2.boss)); break; } }
    await fr.evaluate(() => { const b = SC.enemies.find(e => e.kind === 'boss'), c = SC.camera || (SC.G && SC.G.camera); if (b && c) { c.position.set(b.pos.x + 3.2, b.pos.y + 1.4, b.pos.z + 3.4); c.lookAt(b.pos.x, b.pos.y + 1.0, b.pos.z); SC.render ? SC.render() : 0; } }); await wait(200); await shot(tag); }
  await ev(() => { Issue.finish(false); }); await wait(900);
}
console.log('errors', errors); await browser.close();
