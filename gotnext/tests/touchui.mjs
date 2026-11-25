// A phone, real touch taps: the emote and chat buttons, and tapping the ground in build mode. node tests/touchui.mjs
import { createRequire } from 'module'; const { chromium, devices } = createRequire(import.meta.url)(process.env.PLAYWRIGHT || '/opt/node-tools/node_modules/playwright/index.js');
import path from 'path'; import { fileURLToPath } from 'url';
const dir = path.dirname(fileURLToPath(import.meta.url));
const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader'] }); const ctx = await b.newContext({ ...devices['iPhone 13'] });
const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message)); let fails = 0; const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++; };
await p.goto('file://' + (process.env.GN_HTML || path.resolve(dir, '..', 'index.html'))); await p.waitForTimeout(1200);
await p.tap('#titleBtns .btn'); await p.waitForTimeout(400); await p.tap('#panel .pf .btn'); await p.waitForTimeout(1500);
await p.evaluate(() => { __pit.uiClose(); __pit.S.vc = 5000; __pit.enterWorld('crib', -16, 8, Math.PI); }); await p.waitForTimeout(1200);
for (const k of ['wave', 'dance', 'sit', 'cheer', 'celeb']) { await p.tap(`#emobar [data-em="${k}"]`); await p.waitForTimeout(250); ok((await p.evaluate(() => __pit.W.me.emote)) === k, `tap the ${k} button in the crib`); }
await p.tap('#emobar [data-em="chat"]'); await p.waitForTimeout(400); ok(await p.evaluate(() => getComputedStyle(document.getElementById('chatbox')).display === 'block'), 'tap the chat button: the chat line opens');
await p.fill('#chatbox', 'yo'); await p.keyboard.press('Enter'); await p.waitForTimeout(400); ok(await p.evaluate(() => [...document.querySelectorAll('.bub')].some(x => x.textContent === 'yo')), 'send: a bubble appears');
await p.evaluate(() => { __pit.buildEnter(); }); await p.waitForTimeout(600);
await p.tap('#build [data-b="cat"][data-v="seat"]'); await p.waitForTimeout(200); await p.tap('#build [data-b="pick"][data-v="bench"]'); await p.waitForTimeout(300);
const vp = p.viewportSize(); const before = await p.evaluate(() => [__pit.W.build.x, __pit.W.build.z]);
await p.touchscreen.tap(vp.width * 0.72, vp.height * 0.38); await p.waitForTimeout(400); const after = await p.evaluate(() => [__pit.W.build.x, __pit.W.build.z]);
ok(before[0] !== after[0] || before[1] !== after[1], `tap the ground (right half) in build mode: the cursor jumps there (${before} → ${after})`);
await p.tap('#build [data-b="place"]'); await p.waitForTimeout(300); ok((await p.evaluate(() => __pit.S.home.items.length)) === 1, 'tap PLACE: the bench is placed');
await p.tap('#build [data-b="exit"]'); await p.waitForTimeout(300); ok(await p.evaluate(() => !__pit.W.build), 'tap DONE: build mode closes');
console.log(errs.length ? errs.join(' | ') : 'no page errors', fails ? `· ${fails} FAILED` : '· ALL PASS'); await b.close();
