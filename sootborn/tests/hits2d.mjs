import { chromium } from 'playwright';
// 2D fights: what each kind of hit looks like. Slow motion, two frames per case.  K=under|drill
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome' });
const page = await (await browser.newContext({ viewport: { width: 844, height: 390 } })).newPage();
const errors = []; page.on('pageerror', e => errors.push(e.message));
const wait = ms => page.waitForTimeout(ms), ev = (f, a) => page.evaluate(f, a), K = process.env.K || 'under';
await page.goto('file:///home/claude/below-the-sun/dist/index.html#noff'); await wait(600); await page.keyboard.press('Enter'); await wait(6500);
const setup = () => ev(k => { const B = BTS.Brawl; BTS.UI.clear(); DEV.quick = 1; const d = BTS.FF[k](); delete d.arts; delete d.voice; delete d.doomed; d.foes[0].hp = 60; B.start(d, () => {}); B.phase = 'fight'; B.tipT = 0; const f = B.foes[0]; B.p.x = -22; B.p.y = 0; B.p.fx = 1; B.p.fy = 0; f.x = 20; f.y = 0; f.cd = 99; f.fx = -1; window.__slow = 1; if (!B.__u) { B.__u = B.update; B.update = dt => B.__u.call(B, dt * window.__slow); } }, K);
const clip = { x: 250, y: 90, width: 340, height: 230 }, frames = [];
const seq = async (name, act) => { await setup(); await wait(700); await ev(() => { window.__slow = .22; }); await ev(act); for (const ms of (name === 'taken' || name === 'reel' || name === 'edge' ? [230, 330] : [520, 300])) { await wait(ms); const p = `/home/claude/shots/ff/h2-${K}-${name}-${frames.length % 2}.png`; await page.screenshot({ path: p, clip }); frames.push(p); } };
const real = (pre, call) => `(() => { const B = BTS.Brawl, p = B.p, f = B.foes[0]; ${pre}; B.${call}(); })()`;
await seq('jab', real('p.combo = 0', 'strike')); await seq('cross', real('p.combo = 1; p.comboT = 1', 'strike')); await seq('upper', real('p.combo = 2; p.comboT = 1', 'strike')); await seq('kick', real('', 'kick')); await seq('ram', real('p.pcd = 0', 'ram'));
await seq('block', real('f.guardT = 2', 'strike'));
await seq('taken', `(() => { const B = BTS.Brawl, f = B.foes[0]; B.p.inv = 0; B.hurtPlayer(f, 1, -1, 0); })()`);
await seq('reel', `(() => { const B = BTS.Brawl, f = B.foes[0]; f.st = 'hurt'; f.t = -.5; })()`);
await seq('kill', `(() => { const B = BTS.Brawl, f = B.foes[0]; f.hp = 1; B.p.fury = 0; B.p.combo = 0; B.strike(); })()`);
await seq('edge', `(() => { const B = BTS.Brawl, f = B.foes[0]; f.x = 96; f.kx = 420; f.st = 'hurt'; f.t = 0; })()`);
console.log(frames.length, 'errors', errors); await browser.close();
