import { chromium } from 'playwright';
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome' });
const page = await (await browser.newContext({ viewport: { width: 844, height: 390 } })).newPage();
await page.goto('file:///home/claude/below-the-sun/dist/index.html?'+(process.env.M||'valley')+'#noff'); await page.waitForTimeout(600); await page.keyboard.press('Enter'); await page.waitForTimeout(6500);
const r = await page.evaluate(async () => {
  const B = BTS.Brawl; B.start(BTS.FF.valley(), () => {}); B.cine = null; B.phase = 'fight';
  const g = document.querySelector('canvas').getContext('2d'), orig = g.createRadialGradient.bind(g); let bad = null;
  CanvasRenderingContext2D.prototype.createRadialGradient = function (...a) { if (!a.every(Number.isFinite) && !bad) { bad = { a, stack: new Error().stack.split('\n').slice(2, 5).join('|').replace(/file:[^:]*/g, ''), cam: { ...B.cam }, p: { x: B.p.x, y: B.p.y, fury: B.p.fury, rage: B.p.rage }, shot: B.cine && B.cine.i, sup: B.sup && { t: B.sup.t, n: B.sup.n } }; return orig(0, 0, 0, 0, 0, 1); } return orig(...a); };
  const d = BTS.FF[location.search.slice(1) || 'valley'](); B.playCine(d.intro.concat(d.outro), () => {});
  await new Promise(r => setTimeout(r, 22000)); return bad;
});
console.log(JSON.stringify(r)); await browser.close();
