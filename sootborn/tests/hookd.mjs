import { chromium } from 'playwright';
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const page = await (await browser.newContext({ viewport: { width: 844, height: 390 } })).newPage();
const errors = []; page.on('pageerror', e => errors.push(e.message)); const wait = ms => page.waitForTimeout(ms), ev = (f, a) => page.evaluate(f, a);
await page.goto('file:///home/claude/below-the-sun/dist/index.html#noff'); await wait(600); await page.keyboard.press('Enter'); await wait(4500);
await ev(() => { BTS.UI.clear(); BTS.G.mode = 'world'; const f = (typeof HOT !== 'undefined' && HOT.ksuns) || TALK.ksuns; BTS.Dialogue.start(f()); });
for (let i = 0; i < 9; i++) { console.log(i, await ev(() => ({ t: document.querySelector('#dlg').innerText.replace(/\s+/g, ' ').slice(0, 60), ch: !!BTS.Dialogue.choices, n: BTS.Dialogue.choices && BTS.Dialogue.choices.length, b: BTS.Brawl.active, btn: document.querySelectorAll('#dlg button').length, mode: BTS.G.mode }))); await page.keyboard.press('KeyE'); await wait(450); }
console.log('errors', errors); await browser.close();
