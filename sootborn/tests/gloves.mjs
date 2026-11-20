// Celestine's gloves: her walking figure, her figure as a young cadet, and the 3D figure in the last fight. node gloves.mjs
import { chromium } from 'playwright';
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const page = await (await browser.newContext({ viewport: { width: 1280, height: 720 } })).newPage();
const errors = []; page.on('pageerror', e => errors.push(e.message)); const wait = ms => page.waitForTimeout(ms), ev = (f, a) => page.evaluate(f, a);
await page.goto('file:///home/claude/below-the-sun/dist/index.html#noff'); await wait(600);
for (let i = 0; i < 40 && !(await ev(() => BTS.G.mode === 'title' && BTS.UI.stack.length)); i++) { await page.keyboard.press('Enter'); await wait(250); } await wait(300);
const info = await ev(() => { const c = document.createElement('canvas'); c.width = 900; c.height = 300; c.style.cssText = 'position:fixed;left:0;top:0;z-index:99999;background:#445;image-rendering:pixelated'; document.body.appendChild(c); const g = c.getContext('2d'); g.imageSmoothingEnabled = false; let x = 10; const out = {};
  for (const id of ['celestine', 'celf', 'cel20', 'voss']) { const s = BTS.World.sheetFor(id); g.drawImage(s, 0, 0, s.width, s.height, x, 10, s.width * 4, s.height * 4); out[id] = [s.width, s.height, CAST[id].look().gloves || 'none']; x += s.width * 4 + 20; } return out; });
console.log(JSON.stringify(info)); await page.screenshot({ path: '/home/claude/shots/v73/gloves-2d.png', clip: { x: 0, y: 0, width: 900, height: 300 } });
await ev(() => { document.querySelectorAll('canvas').forEach(c => { if (c.style.zIndex === '99999') c.remove(); }); const k = Object.keys(BTS.FF).find(k => { try { const d = BTS.FF[k](); return d && d.foes && d.foes[0] && d.foes[0].id === 'celf'; } catch (e) { return false; } }); window.__k = k; BTS.UI.clear(); BTS.Brawl.start(Object.assign(BTS.FF[k](), { intro: null }), () => {}); BTS.UI.clear(); });
await wait(2500); console.log('3D fight:', await ev(() => [window.__k, BTS.Brawl.def.title, BTS.Brawl.g3])); 
await ev(() => { const B = BTS.Brawl, f = B.foes[0], p = B.p; f.x = 10; f.y = 0; p.x = -26; p.y = 4; f.st = 'idle'; f.cd = 99; }); await wait(700);
await page.screenshot({ path: '/home/claude/shots/v73/gloves-3d.png' }); console.log('errors', errors);
await browser.close();
