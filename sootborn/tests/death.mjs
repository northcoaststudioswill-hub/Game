import { chromium } from 'playwright';
// stills of a death: M=fight, BIG=1 for a heavy blow. Logs the body's height and how far it turned
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const page = await (await browser.newContext({ viewport: { width: 844, height: 390 } })).newPage();
const errors = []; page.on('pageerror', e => errors.push(e.message)); const wait = ms => page.waitForTimeout(ms), ev = (f, a) => page.evaluate(f, a);
const m = process.env.M || 'ford', big = !!process.env.BIG, tag = (process.env.OLD ? 'old-' : '') + m + (big ? '-heavy' : '-light');
await page.goto((process.env.URL || 'file:///home/claude/below-the-sun/dist/index.html') + '#noff'); await wait(600); await page.keyboard.press('Enter'); await wait(4500);
await ev(m => { BTS.UI.clear(); DEV.quick = 1; const d = BTS.FF[m](); delete d.arts; delete d.voice; delete d.endAt; d.foes = (d.foes || d.waves[0]).slice(0, 1).concat([{ id: 'cadt1', name: 'x', kind: 'cadet', hp: 999 }]); delete d.waves; BTS.Brawl.start(d, () => {}); }, m); await wait(2600);
await ev(() => { const B = BTS.Brawl, f = B.foes[0], o = B.foes[1]; B.p.fury = 0; o.x = 90; o.y = 40; o.cd = 99; f.cd = 99; B.p.x = f.x - 22; B.p.y = f.y; B.p.fx = 1; B.p.fy = 0; clearInterval(window.__iv); window.__iv = setInterval(() => { B.foes.forEach(q => { q.cd = 99; }); }, 20); }); await wait(700);
await ev(big => { const B = BTS.Brawl, f = B.foes[0], u = B.update.bind(B); window.__z = []; window.__f = f; BTS.UI.clear(); B.update = () => {}; window.__to = t => { for (let i = 0; i < 600 && f.t < t; i++) { B.freeze = 0; B.slow = 0; u(1 / 60); window.__z.push([+f.t.toFixed(2), Math.round(f.z || 0), f.dk, f.st]); } }; B.hitFoe(f, 999, 1, 0, big); }, big);
for (const [i, t] of [[0, .12], [1, .3], [2, .5], [3, .9]]) { await ev(t => window.__to(t), t); await wait(process.env.M === 'drill' ? 250 : 1500); await page.screenshot({ path: '/home/claude/shots/v66/death-' + tag + '-' + i + '.png' }); }
const z = await ev(() => window.__z);
if (process.env.DBG) console.log(JSON.stringify(z.slice(0, 14))); console.log(tag, 'g3', await ev(() => BTS.Brawl.g3), 'kind', z[0] && z[0][2], 'max height', Math.max(...z.map(a => a[1])), 'in the air until t=', (z.filter(a => a[1] > 2).pop() || [0])[0], 'errors', errors); await browser.close();
