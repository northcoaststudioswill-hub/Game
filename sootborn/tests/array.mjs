// the Deep Array, end to end, by teleport: intro, the route's ground, the watch lamp, the heart, the brawl, the run
import { chromium } from 'playwright';
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const page = await (await browser.newContext({ viewport: { width: 1280, height: 720 } })).newPage();
const errors = []; page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error' && errors.length < 8) errors.push('console: ' + m.text().slice(0, 140)); });
const wait = ms => page.waitForTimeout(ms), ev = (f, a) => page.evaluate(f, a), shot = n => page.screenshot({ path: '/home/claude/shots/v71/array-' + n + '.png' });
await page.goto('file:///home/claude/below-the-sun/dist/index.html#noff'); await wait(600);
for (let i = 0; i < 40 && !(await ev(() => BTS.G.mode === 'title' && BTS.UI.stack.length)); i++) { await page.keyboard.press('Enter'); await wait(250); } await wait(300);
await ev(() => { BTS.UI.clear(); window.__after = 0; Issue.fresh = 1; BTS.Cutscene.play([{ issue: 'array', or: [{ card: 'FALLBACK', sub: 'x' }] }, { fx: () => { window.__after = 1; } }, { card: 'AFTER', sub: 'array', min: 0.5, max: 30 }], () => {}); });
let fr = null; for (let i = 0; i < 40; i++) { await wait(500); fr = page.frames().find(f => f !== page.mainFrame()); if (fr && await ev(() => Issue.ready)) break; }
await wait(2600); console.log('host', await ev(() => [Issue.on, Issue.ready]), 'frame', await fr.evaluate(() => [SC.issue, SC.state, !!SC.ui.pg])); await shot('0-intro');
for (let i = 0; i < 12; i++) { if (await fr.evaluate(() => SC.player.control && !SC.ui.pg && !SC.ui.dlg)) break; await page.keyboard.press('e'); await wait(450); }
const T = n => fr.evaluate(n => { SC.manual = true; for (let i = 0; i < n; i++) SC.tick(1 / 30); SC.manual = false; }, n);
await T(30); await wait(500); await shot('1-start'); console.log('objective:', await fr.evaluate(() => document.querySelector('#objective, .objective, [id*=obj]') ? (document.querySelector('#objective, .objective, [id*=obj]').textContent || '').slice(0, 80) : '?'));
console.log('route:', await fr.evaluate(() => { const W = SC.world, pts = [[-14, 12, 26], [-14, 12, 22], [-16.3, 12, 20.5], [-16.3, 8, 3], [-16.3, 8, 2], [16.3, 8, 2], [16.3, 8, 0.5], [16.3, 0, -21], [9, 0, -22], [3, 0, -11.6], [0, 0, -12.4]];
  let feet = 12, x = pts[0][0], z = pts[0][2], worst = 0, at = '', blocked = 0; for (let i = 1; i < pts.length; i++) { const tx = pts[i][0], tz = pts[i][2], d = Math.hypot(tx - x, tz - z), n = Math.ceil(d / 0.15); for (let k = 1; k <= n; k++) { const px = x + (tx - x) * k / n, pz = z + (tz - z) * k / n, p = { x: px, y: feet, z: pz }; W.collide(p, 0.35, feet, 1.7); if (Math.hypot(p.x - px, p.z - pz) > 0.05) { blocked++; if (blocked < 4 || blocked % 6 === 0) at += ' push@' + px.toFixed(1) + ',' + pz.toFixed(1); } const g = W.ground(px, pz, feet); if (Math.abs(g - feet) > worst) { worst = Math.abs(g - feet); at = [px.toFixed(1), pz.toFixed(1), feet.toFixed(2), g.toFixed(2)].join('/'); } feet = g; } x = tx; z = tz; }
  return { endHeight: feet, biggestStep: +worst.toFixed(2), at, pushedSteps: blocked }; }));
const go = (x, y, z, yaw) => fr.evaluate(([x, y, z, yaw]) => { SC.player.place(x, y, z, yaw); SC.cam.snapBehind && SC.cam.snapBehind(yaw); }, [x, y, z, yaw]);
const st = () => fr.evaluate(() => { const S = SC.story; return { enc: S.enc && S.enc.id, enemies: SC.enemies.length, ctl: SC.player.control, y: +SC.player.pos.y.toFixed(1), dlg: !!SC.ui.dlg, pg: !!SC.ui.pg, run: S.runT ? Math.ceil(S.runT) : 0, lamp: +(S.lampX || 0).toFixed(1) }; });
const fight = async name => { for (let i = 0; i < 40 && (await st()).enc; i++) { await fr.evaluate(() => SC.clearEnemies()); await T(40); } console.log(name, 'cleared ->', JSON.stringify(await st())); };
const talk = async () => { for (let i = 0; i < 16; i++) { const s = await st(); if (!s.dlg && !s.pg && s.ctl) break; await page.keyboard.press('e'); await wait(350); await T(6); } };
console.log('plain hands:', await fr.evaluate(() => [SC.story.plain(), SC.story.noBoots()]));
await go(-14, 12, 23.6, Math.PI); await T(20); await talk(); await T(40); console.log('first sun ->', JSON.stringify(await st())); await wait(500); await shot('2-gantry');
await go(-16.3, 9, 7, Math.PI); await T(8); await wait(500); await shot('3-stair');
// walk into the lamp on purpose
const lx = (await st()).lamp; await go(lx, 8, 2, -Math.PI / 2); await T(6); console.log('in the lamp ->', JSON.stringify(await st())); await wait(500); await shot('4-seen'); await fight('the watch on the catwalk');
await go(15.6, 8, 2, -Math.PI / 2); await T(10); await talk(); await T(10); await go(16.3, 0, -21, Math.PI); await T(10); await talk(); await T(10); console.log('on the floor ->', JSON.stringify(await st())); await wait(500); await shot('5-floor');
await go(2.4, 0, -6.2, Math.PI / 2); await T(6); await page.keyboard.press('e'); await wait(400); await T(6); console.log('patch find: talking', (await st()).dlg); await talk();
await go(0, 0, -26.2, Math.PI); await T(6); await page.keyboard.press('e'); await wait(400); await T(6); console.log('board find: talking', (await st()).dlg); await shot('6-board'); await talk();
await go(0, 0, -12.2, Math.PI); await T(6); await wait(300); await shot('7-heart'); await page.keyboard.press('e'); await wait(400); await T(6); console.log('heart: talking', (await st()).dlg); await talk(); await T(30); console.log('after the heart ->', JSON.stringify(await st())); await fight('the watch at the heart');
await T(60); console.log('the run ->', JSON.stringify(await st())); await wait(400); await shot('8-run');
await go(-14, 12, 24, 0); await T(12); await wait(900); console.log('at the hatch ->', JSON.stringify(await st())); await shot('9-end');
for (let i = 0; i < 20 && !(await ev(() => window.__after)); i++) { await page.keyboard.press('e'); await wait(500); }
console.log('handed back to the story:', await ev(() => [window.__after, Issue.on, BTS.G.flags.issue_array]), 'errors', errors); await browser.close();
