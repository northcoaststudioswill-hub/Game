import { chromium } from 'playwright';
// usage: F=base.html|issue.html JS="..." T=ms TAG=x node iss.mjs ; STEPS = JSON list of [jsString, waitMs, shotName]
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || undefined, args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const page = await (await browser.newContext({ viewport: { width: +(process.env.VW || 844), height: +(process.env.VH || 390) } })).newPage();
const errors = []; page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push('C:' + m.text().slice(0, 200)); });
const wait = ms => page.waitForTimeout(ms);
await page.goto(new URL('../issue/' + (process.env.F || 'issue.html'), import.meta.url).href); await wait(1500);
const steps = JSON.parse(process.env.STEPS || '[]');
for (const [js, ms, shot] of steps) {
  if (js) { try { const r = await page.evaluate(js); if (typeof r === 'string' && r.startsWith('data:image')) { (await import('fs')).writeFileSync(`shots/${shot}.png`, Buffer.from(r.split(',')[1], 'base64')); continue; } if (r !== undefined) console.log('>', shot || '', js.slice(0, 28).replace(/\n/g, ' '), JSON.stringify(r)); } catch (e) { console.log('EVAL ERR', e.message.slice(0, 300)); } }
  await wait(ms || 300);
  if (shot) await page.screenshot({ path: `shots/${shot}.png` });
}
console.log('errors', errors); await browser.close();
