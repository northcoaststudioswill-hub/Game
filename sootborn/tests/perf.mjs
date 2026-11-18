import { chromium } from 'playwright';
import { mkdirSync } from 'fs'; mkdirSync('shots', { recursive: true });
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || undefined });
const page = await (await browser.newContext({ viewport: { width: 844, height: 390 } })).newPage();
const errors = []; page.on('pageerror', e => errors.push(e.message));
const wait = ms => page.waitForTimeout(ms), ev = (f, a) => page.evaluate(f, a);
await page.goto(new URL('../index.html', import.meta.url).href + '#noff'); await wait(600); await page.keyboard.press('Enter'); await wait(6500);
await ev(() => { const s = { v: 2, t: 1, name: 'Kael', look: 0, tendency: 'caretaker', day: 2, map: 'apt', x: 88, y: 92, dir: 0, flags: { day1Done: 1, d2Tavi: 1, talkedTavi: 1, interacted: 1, puzzleDone: 1, proctorDone: 1, sull2Done: 1, fuseOrder: 1, journalHint: 1 }, trust: {}, scrip: 12, journal: [], log: [], play: 0, talkCount: {} }; BTS.UI.clear(); BTS.Game.loadSave(s); });
await wait(600);
const cdp = await page.context().newCDPSession(page); await cdp.send('Emulation.setCPUThrottlingRate', { rate: 6 });
const fps = async () => ev(() => new Promise(r => { let n = 0, t0 = performance.now(), worst = 0, last = t0; const f = t => { n++; worst = Math.max(worst, t - last); last = t; if (t - t0 > 3000) r([Math.round(n / (t - t0) * 1000), Math.round(worst)]); else requestAnimationFrame(f); }; requestAnimationFrame(f); }));
for (const m of ['apt', 'square', 'bay', 'clinic', 'tunnel', 'fuse']) { await ev(m => { BTS.World.load(m); BTS.P.x = BTS.World.map.w * 8; BTS.P.y = BTS.World.map.h * 8; }, m); await wait(500); console.log(m, await fps()); }
await ev(() => BTS.Game.startFestStealth()); await wait(1500); console.log('fest stealth', await fps());
await ev(() => { BTS.G.heist = 0; BTS.World.load('square'); BTS.Brawl.start({ title: 'B', foes: [{ id: 'garran', name: 'G', kind: 'heavy', hp: 99 }, { id: 'pike', name: 'P', kind: 'quick', hp: 99 }] }, () => {}); BTS.Brawl.phase = 'fight'; }); await wait(500); console.log('brawl', await fps());
for (const m of ['valley', 'ford', 'keep']) { await ev(m => { const d = BTS.FF[m](); delete d.intro; BTS.Brawl.start(d, () => {}); BTS.Brawl.phase = 'fight'; BTS.Brawl.p.fury = 100; }, m); await wait(500); console.log('assay ' + m, await fps()); }
await ev(() => { BTS.Brawl.playCine(BTS.FF.valley().intro.concat(BTS.FF.valley().outro, BTS.FF.valley().intro), () => {}); }); await wait(300); console.log('assay cine', await fps());
await ev(() => { BTS.Brawl.cine = null; BTS.Brawl.p.fury = 100; BTS.Brawl.startSuper(); }); console.log('eleven', await fps());
await ev(() => { BTS.Brawl.active = false; BTS.Cutscene.play([{ panel: 'world', stage: 3 }, { wait: 60 }], () => {}); }); await wait(500); console.log('panel world', await fps());
await ev(() => { BTS.Cutscene.play([{ panel: 'furnace', stage: 0 }, { wait: 60 }], () => {}); }); await wait(500); console.log('panel furnace', await fps());
await ev(() => { BTS.Cutscene.play([{ panel: 'hands', stage: 0 }, { wait: 60 }], () => {}); }); await wait(500); console.log('panel hands', await fps());
console.log(errors); await browser.close();
