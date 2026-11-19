/* Sprouts Pocket: the phone build made from the same source as Sprouts TV 2 (build.py writes both). A smoke test: it
   loads at a phone's shape, is 240 wide with the handheld's zoom, its touch buttons drive the game from the first
   screen to the valley, and the valley, a 3D scene, the house, photo mode and the notebook all draw.
   Run from the repo root:  node sprouts-tv2/tests/pocket.js [build.html] [shotsDir] */
const { chromium } = require('playwright');
const path = require('path'), fs = require('fs');
const BUILD = path.resolve(process.argv[2] || path.join(__dirname, '../games/sprouts-pocket.html'));
const SHOTS = process.argv[3] ? path.resolve(process.argv[3]) : null;
(async () => {
  if (SHOTS) fs.mkdirSync(SHOTS, { recursive: true });
  const browser = await chromium.launch(); let fail = 0; const errs = [];
  const ok = (name, cond, info) => { if (!cond) fail++; console.log((cond ? 'PASS ' : 'FAIL ') + name + (info !== undefined ? '  ' + JSON.stringify(info) : '')); };
  const page = await browser.newPage({ viewport: { width: 440, height: 956 }, hasTouch: true });
  page.on('pageerror', e => errs.push(e.message)); page.on('console', m => { if (m.type() === 'error' && !/ERR_FILE_NOT_FOUND/.test(m.text())) errs.push(m.text()); });
  await page.goto('file://' + BUILD + '?dev'); await page.waitForTimeout(600);
  const E = s => page.evaluate(s => __g.ev(s), s);
  const shot = async n => { if (SHOTS) await page.screenshot({ path: path.join(SHOTS, n + '.png') }); };
  const btn = async (id, ms = 120) => { await page.evaluate(id => document.getElementById(id).dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, pointerId: 1 })), id); await page.waitForTimeout(ms); await page.evaluate(id => document.getElementById(id).dispatchEvent(new PointerEvent('pointerup', { bubbles: true, pointerId: 1 })), id); await page.waitForTimeout(140); };
  const full = () => E(`(()=>{const d=g.getImageData(0,0,cv.width,cv.height).data;let n=0,t=0;for(let x=4;x<cv.width;x+=17)for(let y=44;y<cv.height-44;y+=17){t++;const j=(y*cv.width+x)*4;if(d[j]+d[j+1]+d[j+2]>40)n++}return n/t})()`);
  const sz = JSON.parse(await E('JSON.stringify([POCKET,TVW,H,K,Z,VW,cv.width,cv.height,c3W,UX,SETROWS.includes("VIEW")])'));
  ok('the phone build is 240 wide, as tall as the phone allows, with the handheld\'s 1.5x zoom', sz[0] === true && sz[1] === 240 && sz[2] >= 160 && sz[2] <= 304 && sz[3] === 2 && sz[4] === 1.5 && sz[5] === 160 && sz[6] === 480 && sz[7] === sz[2] * 2 && sz[8] === 240 && sz[9] === 0 && !sz[10], sz);
  ok('it has a pad and five buttons, and the television build has none of them', await page.evaluate(() => ['dpad', 'bA', 'bB', 'bSel', 'bY', 'bSta'].every(id => { const e = document.getElementById(id); return e && e.getBoundingClientRect().width > 20; })) && !/id="dpad"/.test(fs.readFileSync(path.join(path.dirname(BUILD), 'sprouts-tv2.html'), 'utf8').slice(0, 4000)));
  ok('it opens on the dark screen', (await E('state')) === 'tv0'); await btn('bA'); await page.waitForTimeout(200);
  ok('the A button starts the studio card', (await E('state')) === 'tvpwr', await E('state'));
  for (let i = 0; i < 30 && (await E('state')) !== 'tvtitle'; i++) await btn('bA'); await page.waitForTimeout(3000); await shot('pocket-1-title');
  ok('then the title, filling the tall screen', (await E('state')) === 'tvtitle' && (await full()) > 0.9, await full());
  await btn('bSta'); ok('Start goes to the menu', (await E('state')) === 'menu', await E('state'));
  await E('mi=0;void 0'); await btn('bA'); await page.waitForTimeout(500); ok('A starts a new game on the 3D opening', await E(`state==='c3'&&c3q.key==='dawn'`), await E('state')); await shot('pocket-2-scene');
  ok('the scene is drawn 240 wide and fills the picture', await E('c3W===240&&c3H>=100') && (await full()) > 0.5, await E('[c3W,c3H]'));
  await btn('bSta'); await page.waitForTimeout(300); for (let i = 0; i < 40 && (await E('state')) !== 'play'; i++) await btn('bA'); await page.waitForTimeout(300); await shot('pocket-3-valley');
  ok('into the valley, drawn across the whole screen', (await E('state')) === 'play' && (await full()) > 0.95, await full());
  const x0 = await E('P.x'); await page.evaluate(() => { const d = document.getElementById('dpad'), b = d.getBoundingClientRect(); d.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, pointerId: 2, clientX: b.right - 8, clientY: b.top + b.height / 2 })); }); await page.waitForTimeout(500);
  await page.evaluate(() => document.getElementById('dpad').dispatchEvent(new PointerEvent('pointerup', { bubbles: true, pointerId: 2 }))); await page.waitForTimeout(100);
  ok('the pad walks Will', (await E('P.x')) > x0 + 10, [x0, await E('P.x')]);
  await btn('bSta'); ok('Start pauses', (await E('state')) === 'pause'); await shot('pocket-4-pause'); await btn('bB'); ok('B goes back', (await E('state')) === 'play');
  await E(`enterHome();void 0`); await page.waitForTimeout(300); await shot('pocket-5-house'); ok('the house is drawn in 3D at this shape', await E('inHome&&c3W===240') && (await full()) > 0.5);
  await E(`exitHome();state='play';P.x=HX+10;P.y=HY+50;void 0`); await page.waitForTimeout(200); await btn('bY'); await page.waitForTimeout(300); await shot('pocket-6-photo');
  ok('the Photo button opens photo mode', (await E('state')) === 'photo' && (await full()) > 0.9, await E('state')); await btn('bB');
  await E(`state='bugs';colFrom='pause';cpage=3;csel=8;run.wbSeen={LANTERNWISP:1};void 0`); await page.waitForTimeout(300); await shot('pocket-7-notebook');
  ok('a long notebook page turns over with A on the narrow screen', await E(`wrapPx(NOTES[8][2],132+UX-4-18,1).length>11`) && await (async () => { await btn('bA'); return (await E('notePg')) === 1; })());
  ok('no page errors', errs.length === 0, errs.slice(0, 3));
  console.log(fail ? fail + ' FAILED' : 'ALL PASS'); await browser.close(); process.exit(fail ? 1 : 0);
})();
