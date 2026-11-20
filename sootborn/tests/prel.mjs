// stills of the animated intro: node prel.mjs  (VW, VH, TIMES="1.5,4" , TAG)
import { chromium } from 'playwright';
const VW = +(process.env.VW || 1280), VH = +(process.env.VH || 720), TAG = process.env.TAG || 'd';
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const page = await (await browser.newContext({ viewport: { width: VW, height: VH } })).newPage();
const errors = []; page.on('pageerror', e => errors.push(e.message)); const wait = ms => page.waitForTimeout(ms);
await page.goto('file:///home/claude/below-the-sun/dist/index.html#noff'); await wait(600); await page.keyboard.press('Enter'); await wait(1200); await page.keyboard.press('Enter'); await wait(900); await page.keyboard.press('Enter'); await wait(4200);
const info = await page.evaluate(() => { BTS.UI.clear(); Prelude.still(0); const D = Prelude.D, L = Prelude.LEAD; let t = L; return { mid: D.map(d => { const m = t + d * .6; t += d; return m; }), total: Prelude.total(), size: [Prelude.el.width, Prelude.el.height] }; });
const times = process.env.TIMES ? process.env.TIMES.split(',').map(Number) : info.mid;
let i = 0; for (const t of times) { const ms = await page.evaluate(t => { const a = performance.now(); Prelude.still(t); return performance.now() - a; }, t); await wait(60); await page.screenshot({ path: `/home/claude/shots/v68/prel-${TAG}-${String(++i).padStart(2, '0')}.png` }); console.log(i, t.toFixed(2), 'draw ms', ms.toFixed(1)); }
console.log('total', info.total.toFixed(1), 'canvas', info.size, 'errors', errors); await browser.close();
