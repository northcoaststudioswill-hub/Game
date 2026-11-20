// Celestine's own Assay: walked by script (caught once, then the wheel), with stills. node ember.mjs
import { chromium } from 'playwright';
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const page = await (await browser.newContext({ viewport: { width: 1280, height: 720 } })).newPage();
const errors = []; page.on('pageerror', e => errors.push(e.message)); const wait = ms => page.waitForTimeout(ms), ev = (f, a) => page.evaluate(f, a);
const shot = n => page.screenshot({ path: `/home/claude/shots/v73/ember-${n}.png` });
await page.goto('file:///home/claude/below-the-sun/dist/index.html#noff'); await wait(600);
for (let i = 0; i < 40 && !(await ev(() => BTS.G.mode === 'title' && BTS.UI.stack.length)); i++) { await page.keyboard.press('Enter'); await wait(250); } await wait(300);
const said = []; await ev(() => { window.__said = []; const o = BTS.Dialogue.start.bind(BTS.Dialogue); BTS.Dialogue.start = (steps, cb) => { for (const s of steps || []) if (s && s.t) window.__said.push((s.s || '') + ': ' + String(s.t).slice(0, 60)); return o(steps, cb); }; });
await ev(() => { BTS.UI.clear(); window.__done = 0; Mission.start('ember', () => { window.__done = 1; }); });
await wait(2400); await shot(0);
console.log('start', await ev(() => [BTS.G.heist, BTS.G.mapId, document.querySelector('#game').style.filter, Mission.obj(), BTS.World.npcs.map(n => n.id).join(',')]));
const talk = async () => { for (let i = 0; i < 40 && await ev(() => BTS.Dialogue.active); i++) { await page.keyboard.press('KeyE'); await wait(260); } };
const at = async (x, y, dir) => { await ev(([x, y, dir]) => { const P = BTS.P; P.x = x * 16 + 8; P.y = y * 16 + 4; P.dir = dir; BTS.World.grace = 9; }, [x, y, dir]); await wait(300); };
// stand in front of a Proctor with no grace: seen
await ev(() => { const n = BTS.World.npcs[0], P = BTS.P; P.x = n.x + [0, 0, -20, 20][n.dir]; P.y = n.y + [20, -20, 0, 0][n.dir] - 8; BTS.World.grace = 0; }); for (let i = 0; i < 30 && !(await ev(() => BTS.Dialogue.active)); i++) await wait(200);
console.log('seen by a Proctor:', await ev(() => BTS.Dialogue.active), 'caught', await ev(() => BTS.G.flags.mCaught)); await shot(1); await talk(); await wait(600);
console.log('put back at', await ev(() => [Math.round(BTS.P.x / 16), Math.round(BTS.P.y / 16)]));
await at(27, 7, 3); await page.keyboard.press('KeyE'); await wait(400); await talk();
await at(14, 5, 1); await shot(2); await page.keyboard.down('KeyE'); await wait(2800); await page.keyboard.up('KeyE'); await wait(500); await shot(3);
for (let i = 0; i < 50 && await ev(() => BTS.Dialogue.active); i++) { if (i === 9) await shot(4); await page.keyboard.press('KeyE'); await wait(300); }
await wait(900); console.log('done', await ev(() => [window.__done, BTS.G.heist, document.querySelector('#game').style.filter, BTS.G.flags.emberSeen, MAPS.raid.lights.length, MAPS.raid.lights0.length]), 'errors', errors);
console.log((await ev(() => window.__said)).join('\n'));
await browser.close();
