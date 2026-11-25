// Renders the player in each pose into tests/shots/poses.png (a contact sheet) to eyeball the animation.
import { createRequire } from 'module'; const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT || 'playwright');
import path from 'path'; import fs from 'fs'; import { fileURLToPath } from 'url';
const dir = path.dirname(fileURLToPath(import.meta.url)); fs.mkdirSync(path.join(dir, 'shots'), { recursive: true });
const browser = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const page = await (await browser.newContext({ viewport: { width: 300, height: 400 } })).newPage(); page.on('pageerror', e => console.log('PAGEERROR', e.message));
await page.goto('file://' + (process.env.GN_HTML || path.join(dir, '..', 'index.html'))); await page.waitForTimeout(1000);
await page.click('#titleBtns .btn'); await page.waitForTimeout(300); await page.click('#panel .pf .btn'); await page.waitForTimeout(500);
const L = [['idle', 0, {}], ['run', 0, { sp: 1, ph: 1.2 }], ['dribble', 0, { sp: 0.5, ph: 0.6, dr: 0.2, hand: 'R' }], ['slide', 0, { ph: 1, up: true, ry: -0.4 }],
  ['shoot', 0.15, { rel: 0.6 }], ['shoot', 0.45, { rel: 0.6 }], ['shoot', 0.8, { rel: 0.6 }], ['floater', 0.25, {}],
  ['layup', 0, { u: 0.6, euro: 1, y: 0.5 }], ['dunk', 0, { u: 0.5, style: 'tomahawk', y: 0.6 }], ['dunk', 0, { u: 0.85, style: 'twohand', y: 0.6 }], ['swat', 0, { y: 0.4 }],
  ['move', 0, { side: 1, kind: 'cross', u: 0.5, ry: -0.3 }], ['move', 0, { side: 1, kind: 'tween', u: 0.5, ry: -0.3 }], ['move', 0, { side: -1, kind: 'behind', u: 0.5, ry: -0.3 }], ['move', 0, { side: 1, kind: 'stepback', u: 0.5 }],
  ['move', 0, { side: 1, kind: 'hesi', u: 0.5 }], ['steal', 0.2, {}], ['pass', 0, { flashy: true, ry: -0.4 }], ['stagger', 0.5, { fall: true, leg: 0.95 }],
  ['celeb', 0.3, { ry: -0.3 }], ['call', 0.2, { ry: -0.3 }], ['dance', 0.4, { ry: -0.3 }], ['sulk', 0, { ry: -0.3 }]];
for (let i = 0; i < L.length; i++) { const d = await page.evaluate(a => window.__poseShot(...a), L[i]); fs.writeFileSync(path.join(dir, 'shots', `pose-${String(i).padStart(2, '0')}.png`), Buffer.from(d.split(',')[1], 'base64')); }
console.log('poses', L.length); await browser.close();
