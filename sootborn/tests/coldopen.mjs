// Part Two's cold open: the slice of the Stair, started the way chapter one starts it. node coldopen.mjs
import { chromium } from 'playwright';
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const page = await (await browser.newContext({ viewport: { width: 1280, height: 720 } })).newPage();
const errors = []; page.on('pageerror', e => errors.push(e.message)); const wait = ms => page.waitForTimeout(ms), ev = (f, a) => page.evaluate(f, a);
const shot = n => page.screenshot({ path: `/home/claude/shots/v72/cold-${n}.png` });
await page.goto('file:///home/claude/below-the-sun/dist/index.html'); await wait(600);
for (let i = 0; i < 40 && !(await ev(() => BTS.G.mode === 'title' && BTS.UI.stack.length)); i++) { await page.keyboard.press('Enter'); await wait(250); } await wait(300);
await ev(() => { BTS.UI.clear(); BTS.G.mode = 'cut'; window.__end = 0; BTS.Cutscene.play([{ issue: 'stair', cold: 1, or: [] }, { card: 'PART TWO', sub: 'A B O V E', big: 1, tr: 'wake', min: 3, max: 3 }], () => { window.__end = 1; }); });
await wait(350); await shot('card');
let fr = null; for (let i = 0; i < 80 && !fr; i++) { await wait(250); fr = page.frames().find(f => f !== page.mainFrame()); }
for (let i = 0; i < 80; i++) { await wait(250); if (await fr.evaluate(() => typeof SC !== 'undefined' && SC.state === 'play' && SC.player && SC.player.control).catch(() => 0)) break; }
console.log('level awake, no comic pages, control:', await fr.evaluate(() => [SC.issue, SC.cold, SC.state, SC.player.control, document.querySelector('#objective, .objective') ? document.querySelector('#objective, .objective').textContent : '']));
await wait(1800); await shot('start');
await fr.evaluate(() => { SC.manual = true; });
const tick = n => fr.evaluate(n => { for (let i = 0; i < n; i++) SC.tick(1 / 30); }, n);
// walk onto the first sun, then let the fight begin and clear it
await fr.evaluate(() => { SC.player.place(0, 0, 33.4, Math.PI); }); await tick(40);
for (let i = 0; i < 40; i++) { await tick(10); const st = await fr.evaluate(() => { const U = SC.ui; const b = [...document.querySelectorAll('.choice, .mbtn, button')].find(x => x.offsetParent); return { enc: SC.story.enc && SC.story.enc.id, n: (SC.enemies || []).filter(e => e.alive !== false && !e.dead).length, f: Object.keys(SC.story.flags || {}).join(',') }; }); if (i % 8 === 0) console.log(' ', JSON.stringify(st)); if (st.enc) break; await page.keyboard.press('Enter'); await fr.evaluate(() => { try { window.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyJ', key: 'j' })); window.dispatchEvent(new KeyboardEvent('keyup', { code: 'KeyJ', key: 'j' })); } catch (e) {} }); }
await tick(30); await shot('fight');
console.log('fight on:', await fr.evaluate(() => SC.story.enc && SC.story.enc.id), 'waves in the slice:', await fr.evaluate(() => SC.story.enc && SC.story.enc.waves.length));
for (let i = 0; i < 60; i++) { const left = await fr.evaluate(() => { let n = 0; for (const e of SC.enemies || []) if (e.hp > 0) { e.hp = 0; try { e.die ? e.die() : e.setState && e.setState('dead'); } catch (er) {} n++; } return [n, !!SC.story.enc, Object.keys(SC.story.flags || {}).join(',')]; }); await tick(20); if (!left[1] && /e_alley/.test(left[2])) { console.log('terrace cleared, flags:', left[2]); break; } }
await tick(30); console.log('objective:', await fr.evaluate(() => (document.querySelector('#obj, #objective, .obj') || {}).textContent || ''));
// up the first flight
await fr.evaluate(() => { SC.player.control = true; SC.player.place(0, 6, 16.2, Math.PI); }); await tick(20);
console.log('at the top: cut made:', await fr.evaluate(() => [SC.story.coldDone, SC.player.control]));
await fr.evaluate(() => { SC.manual = false; }); await wait(1500); await shot('cut');
for (let i = 0; i < 30 && fr && !fr.isDetached() && !(await ev(() => !Issue.on)); i++) { await page.keyboard.press('Enter'); await wait(400); }
await wait(700); await shot('after');
console.log('level closed:', await ev(() => !Issue.on), 'flag:', await ev(() => BTS.G.flags.issue_staircold), 'stair itself untouched:', await ev(() => BTS.G.flags.issue_stair), 'saves:', await ev(() => Object.keys(localStorage).filter(k => /issue-stair/.test(k))));
await wait(3600); console.log('cutscene ended:', await ev(() => window.__end), 'errors', errors);
await browser.close();
