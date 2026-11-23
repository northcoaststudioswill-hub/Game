// Input check: real touch events on the twin sticks, and a fake second controller for 2-player.
import { createRequire } from 'module'; const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT || 'playwright');
import path from 'path'; import { fileURLToPath } from 'url';
const dir = path.dirname(fileURLToPath(import.meta.url));
const browser = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const ctx = await browser.newContext({ viewport: { width: 844, height: 390 }, hasTouch: true, isMobile: true });
const page = await ctx.newPage(); let errs = 0; page.on('pageerror', e => { errs++; console.log('PAGEERROR', e.message); });
const cdp = await ctx.newCDPSession(page);
const touch = (type, pts) => cdp.send('Input.dispatchTouchEvent', { type, touchPoints: pts.map((p, i) => ({ x: p[0], y: p[1], id: p[2] ?? i })) });
await page.goto('file://' + path.join(dir, '..', 'index.html')); await page.waitForTimeout(800);
await page.tap('#titleBtns .btn'); await page.waitForTimeout(300); await page.tap('#panel .pf .btn'); await page.waitForTimeout(600);
// hub: push the left stick up, expect the player to walk north (−z)
const z0 = await page.evaluate(() => __pit.W.me.z);
await touch('touchStart', [[150, 280]]); await touch('touchMove', [[150, 200]]); await page.waitForTimeout(1200); await touch('touchEnd', []);
const z1 = await page.evaluate(() => __pit.W.me.z); console.log('hub walk: z', z0.toFixed(1), '→', z1.toFixed(1), z1 < z0 - 1 ? 'OK' : 'FAIL');
// practice court: pull the right stick down = shot starts; let go = ball released
await page.evaluate(() => __pit.startPractice('free')); await page.waitForTimeout(3200);
await touch('touchStart', [[700, 250]]); await touch('touchMove', [[700, 320]]); await page.waitForTimeout(350);
const s1 = await page.evaluate(() => __pit.MT.me.st); await page.screenshot({ path: path.join(dir, 'shots', 'touch-shot.png') }); await page.waitForTimeout(250); await touch('touchEnd', []); await page.waitForTimeout(300);
const s2 = await page.evaluate(() => __pit.MT.B.state); console.log('stick shot:', s1, '→ ball', s2, s1 === 'shoot' && s2 !== 'held' ? 'OK' : 'FAIL');
await page.waitForTimeout(2500);
// flick left = side move
await touch('touchStart', [[700, 250]]); await touch('touchMove', [[630, 250]]); await page.waitForTimeout(120);
const s3 = await page.evaluate(() => __pit.MT.me.st); await touch('touchEnd', []); console.log('stick flick left:', s3, s3 === 'move' ? 'OK' : 'FAIL');
await page.waitForTimeout(600);
await touch('touchStart', [[150, 250], [700, 250]]); await touch('touchMove', [[150, 180], [700, 180]]); await page.waitForTimeout(200); await touch('touchEnd', []);
await page.evaluate(() => __pit.MT && __pit.MT.cfg.onEnd({ practice: 'free', quit: true })); await page.waitForTimeout(300);
// two players: fake pad drives player 2 on the other team
await page.evaluate(() => {
  window.__pad = { connected: true, axes: [0, 0, 0, 0], buttons: Array.from({ length: 16 }, () => ({ pressed: false })) }; navigator.getGamepads = () => [window.__pad];
  const P = __pit; P.launchGame(P.MODES[0], P.TIERS_COURT[0], { mates: [], rival: -1, p2: 'vs' });
});
await page.waitForTimeout(6500);
const a = await page.evaluate(() => { const p2 = __pit.MT.P.find(p => p.ctrl === 1); window.__pad.axes[0] = 1; return { x: p2.x, team: p2.team, user: p2.user }; });
await page.waitForTimeout(2000);
const b = await page.evaluate(() => { const p2 = __pit.MT.P.find(p => p.ctrl === 1); return { x: p2.x, humans: __pit.MT.humans.length, phase: __pit.MT.phase }; });
console.log('player 2 on pad: team', a.team, 'x', a.x.toFixed(1), '→', b.x.toFixed(1), 'humans', b.humans, b.phase, b.x > a.x + 0.5 ? 'OK' : 'FAIL');
await page.screenshot({ path: path.join(dir, 'shots', 'two-player.png') });
console.log(errs ? 'ERRORS ' + errs : 'NO ERRORS'); await browser.close();
