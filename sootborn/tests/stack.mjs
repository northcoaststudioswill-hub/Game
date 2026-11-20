// the vent stack, end to end, by teleport: intro, the route's ground, three fights, two finds, the collar, the edge
import { chromium } from 'playwright';
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const page = await (await browser.newContext({ viewport: { width: 1280, height: 720 } })).newPage();
const errors = []; page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error' && errors.length < 8) errors.push('console: ' + m.text().slice(0, 140)); });
const wait = ms => page.waitForTimeout(ms), ev = (f, a) => page.evaluate(f, a), shot = n => page.screenshot({ path: '/home/claude/shots/v70/stack-' + n + '.png' });
await page.goto('file:///home/claude/below-the-sun/dist/index.html#noff'); await wait(600);
for (let i = 0; i < 40 && !(await ev(() => BTS.G.mode === 'title' && BTS.UI.stack.length)); i++) { await page.keyboard.press('Enter'); await wait(250); } await wait(300);
await ev(() => { BTS.UI.clear(); window.__after = 0; Issue.fresh = 1; BTS.Cutscene.play([{ issue: 'stack', or: [{ card: 'FALLBACK', sub: 'x' }] }, { fx: () => { window.__after = 1; } }, { card: 'AFTER', sub: 'stack', min: 0.5, max: 30 }], () => {}); });
let fr = null; for (let i = 0; i < 40; i++) { await wait(500); fr = page.frames().find(f => f !== page.mainFrame()); if (fr && await ev(() => Issue.ready)) break; }
await wait(2600); console.log('host', await ev(() => [Issue.on, Issue.ready]), 'frame', await fr.evaluate(() => [SC.issue, SC.state, !!SC.ui.pg])); await shot('0-intro');
for (let i = 0; i < 12; i++) { if (await fr.evaluate(() => SC.player.control && !SC.ui.pg && !SC.ui.dlg)) break; await page.keyboard.press('e'); await wait(450); }
const T = n => fr.evaluate(n => { SC.manual = true; for (let i = 0; i < n; i++) SC.tick(1 / 30); SC.manual = false; }, n);
await T(30); await wait(500); await shot('1-start'); console.log('objective:', await fr.evaluate(() => document.querySelector('#objective, .objective, [id*=obj]') ? (document.querySelector('#objective, .objective, [id*=obj]').textContent || '').slice(0, 80) : '?'));
// the route: is the ground continuous from the foot to the crown?
console.log('route:', await fr.evaluate(() => { const W = SC.world, C = 5, O = 8.4, m = 6.7, pts = [[-6.5, 17.5], [-6.5, m]]; for (let t = 0; t < 3; t++) pts.push([m, m], [m, -m], [-m, -m], [-m, m]); pts.push([-2, m], [0, 6.4], [0, 3.8]);
  let feet = 0, x = pts[0][0], z = pts[0][1], worst = 0, at = '', blocked = 0, max = 0; for (let i = 1; i < pts.length; i++) { const [tx, tz] = pts[i], d = Math.hypot(tx - x, tz - z), n = Math.ceil(d / 0.15); for (let k = 1; k <= n; k++) { const px = x + (tx - x) * k / n, pz = z + (tz - z) * k / n, p = { x: px, y: feet, z: pz }; W.collide(p, 0.35, feet, 1.7); if (Math.hypot(p.x - px, p.z - pz) > 0.05) blocked++; const g = W.ground(px, pz, feet); if (Math.abs(g - feet) > worst) { worst = Math.abs(g - feet); at = [px.toFixed(1), pz.toFixed(1), feet.toFixed(2), g.toFixed(2)].join('/'); } feet = g; max = Math.max(max, feet); } x = tx; z = tz; }
  return { endHeight: feet, biggestStep: +worst.toFixed(2), at, pushedSteps: blocked }; }));
const go = (x, y, z, yaw) => fr.evaluate(([x, y, z, yaw]) => { SC.player.place(x, y, z, yaw); SC.cam.snapBehind && SC.cam.snapBehind(yaw); }, [x, y, z, yaw]);
const st = () => fr.evaluate(() => { const S = SC.story, F = SC.flags || (S.flags) || {}; return { enc: S.enc && S.enc.id, enemies: SC.enemies.length, ctl: SC.player.control, y: +SC.player.pos.y.toFixed(1), dlg: !!SC.ui.dlg, pg: !!SC.ui.pg }; });
const fight = async name => { for (let i = 0; i < 40 && (await st()).enc; i++) { await fr.evaluate(() => SC.clearEnemies()); await T(40); } console.log(name, 'cleared ->', JSON.stringify(await st())); };
const talk = async () => { for (let i = 0; i < 14; i++) { const s = await st(); if (!s.dlg && !s.pg && s.ctl) break; await page.keyboard.press('e'); await wait(350); await T(6); } };
await go(-6.5, 0, 17.6, Math.PI); await T(20); await talk(); await T(30); console.log('first sun ->', JSON.stringify(await st())); await wait(400); await shot('2-foot'); await fight('pickets');
await go(6.7, 3, 6.7, Math.PI); await T(10); await wait(400); await shot('3-stair');
await go(-9.6, 12, 9.6, Math.PI / 2); await T(30); await talk(); await T(20); console.log('platform one ->', JSON.stringify(await st())); await wait(400); await shot('4-plat1'); await fight('platform one');
await go(-12.4, 12, 9.6, -Math.PI / 2); await T(6); await page.keyboard.press('e'); await wait(400); await T(6); console.log('tag find: talking', (await st()).dlg); await talk();
await go(-9.6, 24, 9.6, Math.PI / 2); await T(30); await talk(); await T(20); console.log('platform two ->', JSON.stringify(await st())); await fight('platform two');
await go(-6.4, 24, 6.8, Math.PI); await T(6); await page.keyboard.press('e'); await wait(400); await T(6); console.log('plate find: talking', (await st()).dlg); await talk();
await go(-6.7, 36, 6.7, -Math.PI / 2); await T(10); await wait(400); await shot('5-top'); console.log('boots before the collar: leap allowed?', await fr.evaluate(() => !(SC.story.noBoots && SC.story.noBoots())));
await go(0, 36, 4.9, Math.PI); await T(6); await page.keyboard.press('e'); await wait(400); await T(6); console.log('collar: talking', (await st()).dlg); await shot('6-collar'); await talk(); await T(10);
console.log('boots after the collar: leap allowed?', await fr.evaluate(() => !(SC.story.noBoots && SC.story.noBoots())));
await go(0, 36, 7.9, 0); await T(12); await wait(900); console.log('at the edge ->', JSON.stringify(await st())); await shot('7-edge');
for (let i = 0; i < 20 && !(await ev(() => window.__after)); i++) { await page.keyboard.press('e'); await wait(500); }
console.log('handed back to the story:', await ev(() => [window.__after, Issue.on, BTS.G.flags.issue_stack]), 'errors', errors); await browser.close();
