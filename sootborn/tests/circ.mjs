import { chromium } from 'playwright';
// the Lamp's fire: walk the Circle, say a name, and (right name) fight and hear the rest without leaving the 2.5D place. PICK=0 right, 1 or 2 wrong
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const page = await (await browser.newContext({ viewport: { width: 844, height: 390 } })).newPage();
const errors = []; page.on('pageerror', e => errors.push(e.message)); const wait = ms => page.waitForTimeout(ms), ev = (f, a) => page.evaluate(f, a);
const pick = +(process.env.PICK || 0), shot = n => page.screenshot({ path: '/home/claude/shots/v66/circ' + pick + '-' + n + '.png' });
await page.goto('file:///home/claude/below-the-sun/dist/index.html#noff'); await wait(600); await page.keyboard.press('Enter'); await wait(4500);
await ev(() => { BTS.UI.clear(); window.__done = 0; window.__modes = []; Mission.start('lamp', () => { window.__done = 1; BTS.Game.toTitle(); }); }); await wait(8000); for (let i = 0; i < 6; i++) { await page.keyboard.press('KeyE'); await wait(400); }
await ev(() => { for (const k of ['stores', 'ridge', 'tent']) BTS.G.flags['m_l_' + k] = 1; Mission.def.use({ id: 'fire2' }); }); await wait(1500);
console.log('walk', await ev(() => [BTS.Brawl.active, BTS.Brawl.phase, BTS.Brawl.def.title]));
// from here on, record every frame in which the 2.5D scene is NOT what is on screen
await ev(() => { window.__left = 0; window.__iv2 = setInterval(() => { if (!BTS.Brawl.active && !window.__fin) window.__left++; }, 30); });
await ev(() => { BTS.Brawl.p.x = -18; BTS.Brawl.p.y = 14; }); await wait(700); await page.keyboard.press('KeyE'); await wait(900);
console.log('at fire', await ev(() => [BTS.Brawl.active, BTS.Dialogue.active, document.querySelector('#dlg').innerText.replace(/\s+/g, ' ').slice(0, 60)]));
for (let i = 0; i < 6 && !(await ev(() => !!document.querySelector('.choices button'))); i++) { await page.keyboard.press('KeyE'); await wait(450); }
await shot('choice');
await ev(i => document.querySelectorAll('.choices button')[i].click(), pick); await wait(500);
for (let i = 0; i < 14 && await ev(() => BTS.Dialogue.active); i++) { await page.keyboard.press('KeyE'); await wait(450); }
await wait(600);
console.log('fight', await ev(() => { const B = BTS.Brawl; return [B.active, B.phase, B.def.title, !!B.def.stage, B.props.filter(q => q.t === 'fire').length, B.props.filter(q => q.t === 'crowd').length, B.foes.map(f => f.id + '@' + Math.round(f.x) + ',' + Math.round(f.y)), 'p@' + Math.round(B.p.x) + ',' + Math.round(B.p.y), B.p.blade]; }));
await shot('intro'); await wait(2200); await shot('fight');
// can the fire be walked through? push the player at it
await ev(() => { const B = BTS.Brawl; B.p.x = -30; B.p.y = 0; }); await page.keyboard.down('ArrowRight'); await wait(900); await page.keyboard.up('ArrowRight');
console.log('fire blocks', await ev(() => { const p = BTS.Brawl.p; return [Math.round(p.x), Math.round(p.y), Math.round(Math.hypot(p.x, p.y * 1.4))]; }));
// lose once on purpose: does the place survive the retry?
if (process.env.LOSE) { await ev(() => { const B = BTS.Brawl; B.revived = 1; B.p.inv = 0; B.p.hp = 1; B.hurtPlayer(B.foes[0], 99, 1, 0); }); await wait(4200); console.log('after loss', await ev(() => { const B = BTS.Brawl; return [B.active, B.phase, !!B.def.stage, B.def._tries, B.props.filter(q => q.t === 'fire').length]; })); await shot('retry'); await wait(1800); }
await ev(() => { const B = BTS.Brawl; B.foes.forEach(f => { f.hp = 1; }); });
for (let i = 0; i < 60 && await ev(() => BTS.Brawl.active && BTS.Brawl.phase === 'fight'); i++) { await ev(() => { const B = BTS.Brawl, f = B.foes.find(f => f.hp > 0 && f.st !== 'down'); if (f) { B.p.x = f.x - 16; B.p.y = f.y; B.p.fx = 1; B.p.fy = 0; } }); await page.keyboard.press('KeyE'); await wait(160); }
console.log('won', await ev(() => [BTS.Brawl.active, BTS.Brawl.phase])); await wait(3200);
console.log('outside so far', await ev(() => window.__left)); console.log('aftermath', await ev(() => [BTS.Brawl.active, BTS.Brawl.phase, BTS.Dialogue.active, BTS.G.mode, document.querySelector('#dlg').innerText.replace(/\s+/g, ' ').slice(0, 70)])); await shot('after');
for (let k = 0; k < 40 && !(await ev(() => window.__done)); k++) { if (await ev(() => !!document.querySelector('.choices button'))) await ev(() => document.querySelector('.choices button').click()); else await page.keyboard.press('KeyE'); await wait(400); if (await ev(() => window.__done || BTS.G.mode !== 'world' && !BTS.Brawl.active && !BTS.Dialogue.active)) await ev(() => { window.__fin = 1; }); }
await ev(() => { window.__fin = 1; });
console.log('done', await ev(() => [window.__done, BTS.G.flags.corin, 'frames outside the scene before the end:', window.__left]), 'errors', errors); await browser.close();
