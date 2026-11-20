import { chromium } from 'playwright';
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome' });
const page = await (await browser.newContext({ viewport: { width: 844, height: 390 } })).newPage();
const errors = []; page.on('pageerror', e => errors.push(e.message));
const wait = ms => page.waitForTimeout(ms), ev = (f, a) => page.evaluate(f, a);
await page.goto('file:///home/claude/below-the-sun/dist/index.html#noff'); await wait(600); await page.keyboard.press('Enter'); await wait(6500);
const SLOW = Number(process.env.SLOW || .06), mode = process.env.A || 'combo';
await ev(([SLOW, mode]) => { const B = BTS.Brawl; BTS.UI.clear(); const d = BTS.FF.valley(); delete d.intro; delete d.outro; delete d.arts; delete d.voice; d.allies = []; d.waves = [[{ id: 'cadt1', name: 'T', kind: mode === 'lance' ? 'lancer' : 'cadet', hp: 999 }]]; B.start(d, () => {}); B.phase = 'fight'; B.tipT = 0; const f = B.foes[0]; B.p.x = -14; B.p.y = 0; f.x = 22; f.y = 0; f.cd = mode === 'foe' || mode === 'lance' ? 0 : 99; B.p.fury = 0; B.cam.x = 0; B.cam.y = 120; B.cam.h = 60; B.cam.hor = 50;
  window.__slow = 1; B.camFollow = () => {}; B.cam.y = 150; B.cam.h = 64; B.cam.x = 4; B.cam.hor = 50; const u = B.update; B.update = dt => u.call(B, dt * window.__slow); }, [SLOW, mode]);
await wait(1500); await ev(s => { window.__slow = s; }, SLOW);
const N = Number(process.env.N || 16), step = Number(process.env.STEP || 130);
if (mode === 'combo') { await ev(() => BTS.Brawl.strike()); }
for (let i = 0; i < N; i++) { await page.screenshot({ path: `/home/claude/shots/ff/anim-${mode}-${i}.png`, clip: { x: 282, y: 70, width: 280, height: 230 } }); if (mode === 'combo' && (i === 4 || i === 9)) await ev(() => { const B = BTS.Brawl; B.p.st = 'idle'; B.strike(); }); if (mode === 'hurt' && i === 1) await ev(() => { const B = BTS.Brawl; B.hurtPlayer(B.foes[0], 1, -1, 0); B.hitFoe(B.foes[0], 1, 1, 0, true); }); if (mode === 'run' && i === 0) await page.keyboard.down('ArrowLeft'); await wait(step); }
console.log('errors', errors); await browser.close();
