import { createRequire } from 'module'; const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT || 'playwright');
import path from 'path'; import { fileURLToPath } from 'url';
const dir = path.dirname(fileURLToPath(import.meta.url));
const browser = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const page = await (await browser.newContext({ viewport: { width: 640, height: 360 } })).newPage();
page.on('pageerror', e => console.log('PAGEERROR', e.message, e.stack));
await page.goto('file://' + path.join(dir, '..', 'index.html')); await page.waitForTimeout(800);
await page.click('#titleBtns .btn'); await page.waitForTimeout(300); await page.click('#panel .pf .btn'); await page.waitForTimeout(500);
// all-AI game: the user's player is driven by the AI too, at high speed
const out = await page.evaluate(async (mode) => {
  const P = __pit; const log = [];
  P.launchGame(P.MODES.find(x => x.id === mode), P.TIERS_COURT[+(new URLSearchParams(location.search).get('t') || 0)], { mates: [], rival: -1, p2: 'off' });
  const M = P.MT; M.me.user = false; M.me.aiLvl = 0.5; M.humans = [];
  let last = '', stuck = 0, events = { shots: 0 };
  for (let i = 0; i < 60 * 60 * 6 && P.MT === M && !M.over; i++) {
    __step(1 / 60);
    const s = `${M.phase}|${M.B.state}|${M.B.holder ? M.B.holder.i : '-'}|${M.score}`;
    if (s === last) stuck++; else { if (stuck > 600) log.push('STUCK ' + (stuck / 60).toFixed(1) + 's in ' + last + ' clear=' + M.needClear); stuck = 0; last = s; }
  }
  if (stuck > 600) log.push('STUCK(end) ' + (stuck / 60).toFixed(1) + 's in ' + last + ' clear=' + M.needClear + ' ' + JSON.stringify(M.P.map(p => [p.i, p.team, p.st, +p.x.toFixed(1), +p.z.toFixed(1), p.ai.mode, +p.ai.tx.toFixed(1), +p.ai.tz.toFixed(1)])) + ' clock ' + M.clock);
  return { log, viol: M.viol || 0, score: M.score, time: M.time, box: M.P.map(p => [p.b.name, p.team, p.b.build.style, JSON.stringify(p.stats)]) };
}, process.env.MODE || 's2');
console.log(JSON.stringify(out, null, 1)); await browser.close();
