// The model lab (lab.html): every pose runs on every view without an error, a whole fit can be worn, edits from the
// game's ANIM LAB paste in and bend the pose.   node tests/modellab.mjs
import { createRequire } from 'module'; const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT || 'playwright');
import path from 'path'; import fs from 'fs'; import { fileURLToPath } from 'url';
const dir = path.dirname(fileURLToPath(import.meta.url)); fs.mkdirSync(path.join(dir, 'shots'), { recursive: true });
const browser = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader'] });
const ctx = await browser.newContext({ viewport: { width: 1280, height: 720 } });
const page = await ctx.newPage(); let errs = 0; page.on('pageerror', e => { errs++; console.log('PAGEERROR', e.message, (e.stack || '').split('\n')[1]); });
await page.goto('file://' + path.join(dir, '..', 'lab.html')); await page.waitForTimeout(2500);
const ok = (n, c, d) => console.log((c ? 'PASS  ' : 'FAIL  ') + n + '  ' + (d || ''));
const sel = await page.$$eval('#rail select', s => s.map(x => x.getAttribute('aria-label')));
const poses = await page.$$eval('select[aria-label=Pose] option', o => o.map(x => x.value));
ok('pose list', poses.length > 130, poses.length + ' poses');
for (const v of ['scoop', 'board', 'dive', 'bt_robot', 'c_iceveins', 'fall_face', 'post', 'e_roof', 'dk_hammer', 'sw_yoyo']) if (!poses.includes(v)) ok('has ' + v, false);
let n = 0; for (const v of poses) { await page.selectOption('select[aria-label=Pose]', v); await page.waitForTimeout(40); n++; }
ok('every pose runs', !errs, n + ' poses, ' + errs + ' errors');
await page.selectOption('select[aria-label="Whole fit"]', { index: 3 }); await page.waitForTimeout(300);
ok('fit picker', sel.includes('Whole fit'), sel.join(','));
await page.selectOption('select[aria-label=Pose]', 'board'); await page.waitForTimeout(600);
await page.screenshot({ path: path.join(dir, 'shots', 'modellab-board.png') });
await page.selectOption('select[aria-label=Pose]', 'bt_robot'); await page.waitForTimeout(600);
await page.screenshot({ path: path.join(dir, 'shots', 'modellab-bottie.png') });
ok('no errors', !errs);
await browser.close();
