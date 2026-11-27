/* Lantern menu (console level) for the ALT build: stats pages, achievements, ticket help, with sample saves.
   Run from the repo root:  node alt/tests/lantern_shots.js [build.html]    Shots: alt/playtest/lantern/ */
const { chromium } = require('playwright');
const path = require('path'), fs = require('fs');
const BUILD = path.resolve(process.argv[2] || path.join(__dirname, '../games/pocket-lantern-alt.html'));
const OUT = path.join(__dirname, '../playtest/lantern'); fs.mkdirSync(OUT, { recursive: true });
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 440, height: 956 } });
  const errs = []; page.on('pageerror', e => errs.push(e.message));
  /* sample saves: Patch & Plate file 1 at day 7, Knockout with a survival streak (prefixed keys, as the ALT build stores them) */
  await page.addInitScript(() => {
    const st = {}; for (let d = 0; d < 7; d++) st[d] = d < 5 ? 3 : 2;
    localStorage.setItem('pl-alt:patchplate-v1', JSON.stringify({ v: 1, day: 6, stars: st, served: 84, earned: 1320, crew: ['A', 'B', 'C'], friend: { WILL: 30, MARCUS: 13, LOUIE: 41 } }));
    localStorage.setItem('pl-alt:ncko-v1', JSON.stringify({ diff: 1, clear: { will: 1, erin: 2 }, w: 23, l: 9, surv: 6 }));
  });
  await page.goto('file://' + BUILD + '?dev'); await page.waitForTimeout(800);
  const E = s => page.evaluate(s => __g.ev(s), s);
  const cv = await page.$('#screen');
  const shot = async n => { await page.waitForTimeout(250); await cv.screenshot({ path: path.join(OUT, n + '.png') }); };
  await E("lanOpen('off')"); await page.waitForTimeout(300); await shot('menu');
  for (let p = 0; p < 5; p++) { await E(`state='lanstats';lanPage=${p}`); await shot('stats' + p); }
  await E("state='lanach';uiSel=0"); await shot('achievements');
  const r = await E("JSON.stringify({played:lanPlayedN(),ach:Object.keys(LAN.ach),tix:meta.tix,pp:ppSV(),surv:koSV().surv,s5:LAN.ko.s5})");
  console.log(r);
  await E("state='lancaps';capR={ph:'idle',t:0,it:null,msg:'',msgT:0,pg:3}"); await page.waitForTimeout(100); await E('capR.tut=-1;capR.pg=3'); await shot('caps_tickets');
  console.log('errors:', errs.length ? errs.join(' | ') : 'none');
  await browser.close();
})();
