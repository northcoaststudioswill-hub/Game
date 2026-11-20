import { chromium } from 'playwright';
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome' });
const page = await (await browser.newContext({ viewport: { width: 844, height: 390 } })).newPage();
const errors = []; page.on('pageerror', e => errors.push(e.message));
await page.goto('file:///home/claude/below-the-sun/dist/index.html#noff'); await page.waitForTimeout(600); await page.keyboard.press('Enter'); await page.waitForTimeout(4000);
const scenes = [['rings', 1, 'PART TWO', 16, 0], ['table', 2, 'DOCKMASTER', 20, 0], ['lucan-friend', 4, 'second winter', 6, 1], ['lucan-not', 4, 'second winter', 6, 0], ['before', 4, 'NIGHT BEFORE', 16, 0]];
for (const [label, ch, key, n, fr] of scenes) {
  const got = await page.evaluate(([ch, key, n, fr]) => { BTS.G.flags.lucanFriend = fr; const all = P2[ch](); const i = all.findIndex(s => (s.card || s.narr || '').includes(key)); window.SEEN = []; BTS.UI.clear(); BTS.Cutscene.play(all.slice(Math.max(0, i - 1), i + n).concat([{ wait: 999 }]), () => {}); return i; }, [ch, key, n, fr]);
  let lines = 0; for (let i = 0; i < 44; i++) { await page.keyboard.press('e'); await page.waitForTimeout(260); const t = await page.evaluate(() => (document.querySelector('#dlg .tx') || {}).textContent || ''); if (t) lines++; if (i === 9) await page.screenshot({ path: `/home/claude/shots/issue/story-${label}.png` }); }
  console.log(label, 'found at', got, 'dialogue ticks', lines); await page.evaluate(() => BTS.Cutscene.skip(true)); await page.waitForTimeout(300); }
console.log('errors', errors); await browser.close();
