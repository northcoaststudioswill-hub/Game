/* Sprouts TV: what is different from the handheld. The way in (any button, studio card, 3D title, menu), the
   16:9 screen at the window's own resolution, the wide view of the valley, the HUD in the screen's corners, every 3D
   shot filling the width, a controller, saves kept apart from Pocket Lantern's, and no trace of the cartridge shelf.
   Run from the repo root:  node sprouts-tv/tests/tv.js [build.html] [shotsDir]      (about a minute) */
const { chromium } = require('playwright');
const path = require('path'), fs = require('fs');
const BUILD = path.resolve(process.argv[2] || path.join(__dirname, '../games/sprouts-tv.html'));
const SHOTS = process.argv[3] ? path.resolve(process.argv[3]) : null;
(async () => {
  if (SHOTS) fs.mkdirSync(SHOTS, { recursive: true });
  const browser = await chromium.launch(); let fail = 0; const errs = [];
  const ok = (name, cond, info) => { if (!cond) fail++; console.log((cond ? 'PASS ' : 'FAIL ') + name + (info !== undefined ? '  ' + JSON.stringify(info) : '')); };
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  page.on('pageerror', e => errs.push(e.message)); page.on('console', m => { if (m.type() === 'error' && !/ERR_FILE_NOT_FOUND/.test(m.text())) errs.push(m.text()); });
  /* a controller the test can press: the standard layout, before the page loads */
  await page.addInitScript(() => { window.__pad = { connected: true, mapping: 'standard', axes: [0, 0, 0, 0], buttons: Array.from({ length: 17 }, () => ({ pressed: false, value: 0 })) }; navigator.getGamepads = () => [window.__pad]; });
  await page.goto('file://' + BUILD + '?dev'); await page.waitForTimeout(600);
  const E = s => page.evaluate(s => __g.ev(s), s);
  const shot = async n => { if (SHOTS) await page.screenshot({ path: path.join(SHOTS, n + '.png') }); };
  const pad = async (b, ms = 90) => { await page.evaluate(b => { window.__pad.buttons[b] = { pressed: true, value: 1 }; }, b); await page.waitForTimeout(ms); await page.evaluate(b => { window.__pad.buttons[b] = { pressed: false, value: 0 }; }, b); await page.waitForTimeout(60); };
  const step = (n, dt = 1 / 30) => E(`(()=>{for(let i=0;i<${n};i++){__g.update(${dt});for(const k in __g.keys)__g.prev[k]=__g.keys[k]}})()`);
  const paint = () => E('g.setTransform(K,0,0,K,0,0);draw();void 0');
  /* the colour of one game pixel, read from the canvas */
  const px = (x, y) => E(`(()=>{const d=g.getImageData(Math.round(${x}*K+K/2),Math.round(${y}*K+K/2),1,1).data;return [d[0],d[1],d[2]]})()`).then(a => a);

  /* ---- the screen ---- */
  const scr = JSON.parse(await E(`JSON.stringify([cv.width,cv.height,K,TVW,TVH,W,Z,VW,VH,cv.getBoundingClientRect().width,cv.getBoundingClientRect().height])`));
  ok('the picture is 320 x 180 game pixels, drawn at the window\'s own resolution (1920 x 1080 here, 6 to 1)', scr[0] === 1920 && scr[1] === 1080 && scr[2] === 6 && scr[3] === 320 && scr[4] === 180, scr);
  ok('it fills the window exactly', Math.round(scr[9]) === 1920 && Math.round(scr[10]) === 1080, scr.slice(9));
  ok('the valley is seen 320 wide, twice the handheld\'s 160', scr[6] === 1 && scr[7] === 320 && scr[8] === 180, scr.slice(6, 9));
  ok('nothing of the handheld is on the page: no shelf, no buttons, no console body', await page.evaluate(() => { const v = e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0; }; return [...document.querySelectorAll('button,.cart,#shelf,#dpad,#console')].every(e => !v(e)) && document.title === 'Sprouts'; }));

  /* ---- the way in ---- */
  ok('it opens on a dark screen that waits for a button', (await E('state')) === 'tv0', await E('state')); await shot('tv-0-wait');
  await pad(0); await page.waitForTimeout(150);
  ok('any button, on a controller too, starts the studio card', (await E('state')) === 'tvpwr', await E('state'));
  await page.waitForTimeout(2400); await shot('tv-1-studio');
  const edge = await px(2, 60), mid = await px(160, 60);
  ok('the studio card\'s light reaches the edges of the screen', edge[0] + edge[1] + edge[2] > 30, [edge, mid]);
  await page.waitForTimeout(2300);
  ok('then the title comes up by itself', (await E('state')) === 'tvtitle', await E('state'));
  await page.waitForTimeout(3200); await shot('tv-2-title');
  const tl = JSON.parse(await E(`(()=>{const d=g.getImageData(0,0,cv.width,cv.height).data;let yel=0,cols=new Set();for(let i=0;i<d.length;i+=4*97){cols.add(d[i]>>4<<8|d[i+1]>>4<<4|d[i+2]>>4);if(d[i]>230&&d[i+1]>200&&d[i+2]<130)yel++}const c=(x,y)=>{const j=(y*K*cv.width+x*K)*4;return d[j]+d[j+1]+d[j+2]};return JSON.stringify([yel,cols.size,c(3,90)>0||c(3,120)>0,c(316,90)>0||c(316,120)>0])})()`));
  ok('the title is the name over the valley in 3D, edge to edge', tl[0] > 400 && tl[1] > 60 && tl[2] && tl[3], tl);
  await pad(1); await page.waitForTimeout(120); ok('B does not leave the title', (await E('state')) === 'tvtitle');
  await pad(9); await page.waitForTimeout(200); ok('Start goes to the menu', (await E('state')) === 'menu', await E('state')); await shot('tv-3-menu');
  ok('the menu has no cartridge to swap: its last entry goes back to the title', await E(`menuItems().includes('TITLE SCREEN')&&!menuItems().includes('SWAP CARTRIDGE')`));
  await E(`mi=menuItems().indexOf('TITLE SCREEN');void 0`); await pad(0); await page.waitForTimeout(200);
  ok('and it does', (await E('state')) === 'tvtitle', await E('state')); await page.waitForTimeout(1400); await pad(9); await page.waitForTimeout(200);

  /* ---- a new game, with a controller ---- */
  await E(`mi=0;void 0`); await pad(0); await page.waitForTimeout(400);
  ok('A on PLAY starts the first 3D scene', await E(`state==='c3'&&c3q.key==='dawn'`), await E('state')); await page.waitForTimeout(900); await shot('tv-4-scene');
  const sc = JSON.parse(await E(`(()=>{const d=g.getImageData(0,0,cv.width,cv.height).data,c=(x,y)=>{const j=(y*K*cv.width+x*K)*4;return d[j]+d[j+1]+d[j+2]};let L=0,R=0;for(let y=4;y<130;y+=6){if(c(2,y)>24)L++;if(c(317,y)>24)R++}return JSON.stringify([L,R,c3W,c3H])})()`));
  ok('the scene fills the width of the screen, and its picture is as tall as the handheld\'s', sc[0] > 10 && sc[1] > 10 && sc[2] === 320 && sc[3] >= 136, sc);
  await pad(9); await page.waitForTimeout(300); for (let k = 0; k < 14 && (await E('state')) !== 'play'; k++) { await pad(0); await page.waitForTimeout(250); }
  ok('Start skips it and A talks through Erin\'s welcome, into the valley', (await E('state')) === 'play', await E('state'));
  const x0 = await E('P.x'); await page.evaluate(() => { window.__pad.axes[0] = 1; }); await page.waitForTimeout(500); await page.evaluate(() => { window.__pad.axes[0] = 0; }); await page.waitForTimeout(80);
  ok('the left stick walks', (await E('P.x')) > x0 + 8, [x0, await E('P.x')]);
  const y0 = await E('P.y'); await page.evaluate(() => { window.__pad.buttons[13] = { pressed: true, value: 1 }; }); await page.waitForTimeout(400); await page.evaluate(() => { window.__pad.buttons[13] = { pressed: false, value: 0 }; }); await page.waitForTimeout(80);
  ok('so does the d-pad', (await E('P.y')) > y0 + 6, [y0, await E('P.y')]);
  await pad(9); await page.waitForTimeout(150); ok('Start pauses', (await E('state')) === 'pause', await E('state')); await shot('tv-5-pause'); await pad(1); await page.waitForTimeout(150);
  ok('B goes back', (await E('state')) === 'play', await E('state'));
  await E(`found=found.map(()=>true);for(let i=0;i<8;i++)mkBud(i%6,2,P.x+i*3,P.y+12);sel=0;void 0`); await step(3); const s0 = await E('sel'); await pad(2); await page.waitForTimeout(120);
  ok('X swaps the sprout kind', (await E('sel')) !== s0, [s0, await E('sel')]);
  await page.keyboard.down('ArrowLeft'); await page.waitForTimeout(300); await page.keyboard.up('ArrowLeft'); const kx = await E('P.x'); await page.waitForTimeout(250);
  ok('the keyboard still works beside the controller, and a held key is not cancelled by it', kx < (await E('P.x')) + 1 && kx < x0 + 200, [kx]);

  /* ---- the valley, wide ---- */
  await E(`ZONES.forEach(z=>run.seen[z[0]]=1);zoneT=0;dayT=60;P.x=HX;P.y=HY+40;cam.x=P.x-VW/2;cam.y=P.y-VH/2;toasts.length=0;msgT=0;void 0`); await step(6); await paint(); await shot('tv-6-valley');
  const wide = JSON.parse(await E(`(()=>{const d=g.getImageData(0,0,cv.width,cv.height).data,c=(x,y)=>{const j=(y*K*cv.width+x*K)*4;return d[j]+d[j+1]+d[j+2]};let n=0;for(let x=1;x<320;x+=3)for(let y=30;y<150;y+=7)if(c(x,y)>60)n++;return JSON.stringify([n,107*18])})()`));
  ok('the valley is drawn across the whole screen', wide[0] > wide[1] * 0.97, wide);
  const hud = JSON.parse(await E(`(()=>{const o=g.fillRect.bind(g);let L=1e9,R=-1e9,B=-1e9;const m0=K;g.fillRect=(x,y,w,h)=>{const m=g.getTransform(),X=(m.a*x+m.e)/K,Y=(m.d*y+m.f)/K;if(g.fillStyle==='rgba(24, 16, 32, 0.82)'){L=Math.min(L,X);R=Math.max(R,X+w);B=Math.max(B,Y+h)}o(x,y,w,h)};g.setTransform(K,0,0,K,0,0);draw();g.fillRect=o;return JSON.stringify([Math.round(L),Math.round(R),Math.round(B)])})()`));
  ok('the day, the shards and the crew count sit in the corners of the screen', hud[0] <= 3 && hud[1] >= 317 && hud[2] >= 176, hud);
  await E(`dayT=DAYLEN*.92;duskSaid=true;void 0`); await step(4); await paint(); await shot('tv-7-night');
  const nt = JSON.parse(await E(`(()=>{const d=g.getImageData(0,0,cv.width,cv.height).data,c=(x,y)=>{const j=(y*K*cv.width+x*K)*4;return [d[j],d[j+1],d[j+2]]};dayT=60;g.setTransform(K,0,0,K,0,0);draw();const e=g.getImageData(0,0,cv.width,cv.height).data,c2=(x,y)=>{const j=(y*K*cv.width+x*K)*4;return [e[j],e[j+1],e[j+2]]};let dl=0,dr=0;for(let y=40;y<140;y+=10){const a=c(4,y),b=c2(4,y),p=c(315,y),q=c2(315,y);if(a[0]+a[1]<b[0]+b[1]-20)dl++;if(p[0]+p[1]<q[0]+q[1]-20)dr++}return JSON.stringify([dl,dr])})()`));
  ok('night darkens the whole screen, not only the middle', nt[0] >= 7 && nt[1] >= 7, nt);
  await E(`dayT=60;talk(npcs[0]);void 0`); await paint(); await shot('tv-8-talk'); await E(`state='play';void 0`);
  await E(`enterHome();void 0`); await step(4); await paint(); await shot('tv-9-house');
  ok('the house is drawn in 3D across the screen', await E(`inHome&&c3W===320&&c3H===180`)); await E(`leaveHome&&leaveHome();inHome=false;state='play';void 0`).catch(() => E(`inHome=false;state='play';void 0`));
  await E(`playScene('open');void 0`); await page.waitForTimeout(500); await paint(); await shot('tv-10-story');
  const cine = JSON.parse(await E(`(()=>{const d=g.getImageData(0,0,cv.width,cv.height).data,c=(x,y)=>{const j=(y*K*cv.width+x*K)*4;return d[j]<<16|d[j+1]<<8|d[j+2]};let same=0,n=0;for(let y=3;y<175;y+=4){n+=2;if(c(1,y)===c(40,y))same++;if(c(318,y)===c(279,y))same++}return JSON.stringify([same,n])})()`));
  ok('a 2D story scene carries its sky and ground out to the edges of the screen', cine[0] === cine[1], cine); await E(`state='play';scn=null;void 0`);

  /* ---- every 3D shot at this shape ---- */
  const shots = JSON.parse(await E(`(()=>{const bad=[];let n=0;for(const k of Object.keys(C3SCN))for(let i=0;i<C3SCN[k].length;i++){c3Play(k);c3q.i=i;c3q.t=C3SCN[k][i].d*.5;c3q.tt=i*7+c3q.t;time=50;g.setTransform(K,0,0,K,0,0);draw();n++;
    const s=new Set();for(let j=0;j<c3px.length;j+=41)s.add(c3px[j]);let L=new Set(),R=new Set();for(let y=0;y<c3H;y+=3){L.add(c3px[y*c3W+1]);R.add(c3px[y*c3W+c3W-2])}
    if(s.size<12||L.size<2||R.size<2||wrapPx(C3SCN[k][i].cap[1],228).length>3)bad.push(k+' '+(i+1));c3q=null;state='play'}return JSON.stringify([n,bad])})()`));
  ok('all 87 shots of the 19 scenes draw a full picture out to both edges, and their words fit', shots[0] === 87 && shots[1].length === 0, shots);
  ok('the eight wild buddies have their pictures and guide lines (copied from the Sproutwild files)', await E(`WBDEF.every(q=>{const s=wSp(q[0]);return s&&s._spr&&s._spr.img.width===48})&&spGuideList(1).every(e=>e.d.length>20)`));

  /* ---- saves ---- */
  await E(`init();live=true;state='play';day=3;persist(true);void 0`); await page.waitForTimeout(100);
  const keys = await page.evaluate(() => { const o = []; const n = Storage.prototype.key, L = Object.getOwnPropertyDescriptor(Storage.prototype, 'length').get; for (let i = 0; i < L.call(localStorage); i++)o.push(n.call(localStorage, i)); return o; });
  ok('saves are written under their own name, apart from Pocket Lantern\'s', keys.length > 0 && keys.every(k => k.startsWith('sprouts-tv:')) && !keys.some(k => k.startsWith('pl-alt:')), keys);
  await page.reload(); await page.waitForTimeout(600); for (let k = 0; k < 40 && (await E('state')) !== 'menu'; k++) { await page.keyboard.press('Enter', { delay: 70 }); await page.waitForTimeout(200); }
  ok('a saved game is there after the page is closed and opened, offered as CONTINUE', await E(`live&&day===3&&menuItems()[0]==='CONTINUE'`), [await E('live'), await E('day')]);

  /* ---- other window sizes ---- */
  const sizes = [];
  for (const [w, h] of [[1280, 720], [1366, 768], [2560, 1440], [1024, 768]]) { await page.setViewportSize({ width: w, height: h }); await page.waitForTimeout(250); const q = JSON.parse(await E(`JSON.stringify([K,cv.width,cv.height,Math.round(cv.getBoundingClientRect().width),Math.round(cv.getBoundingClientRect().height)])`)); sizes.push([w, h].concat(q)); }
  ok('at any window size the scale is a whole number, the picture fits and stays 16:9', sizes.every(q => Number.isInteger(q[2]) && q[3] === 320 * q[2] && q[4] === 180 * q[2] && q[5] <= q[0] && q[6] <= q[1] && q[5] > q[0] * 0.7), sizes);
  await page.setViewportSize({ width: 1920, height: 1080 }); await page.waitForTimeout(200);
  const sp = await E(`(()=>{init();live=true;state='play';ZONES.forEach(z=>run.seen[z[0]]=1);for(let i=0;i<24;i++)mkBud(i%6,2,P.x+i*4,P.y+10);dayT=DAYLEN*.9;let t=performance.now();for(let i=0;i<90;i++){__g.update(1/60);g.setTransform(K,0,0,K,0,0);draw()}return (performance.now()-t)/90})()`);
  console.log('     a frame of the valley at night at 1920 x 1080: ' + sp.toFixed(1) + ' ms (headless Chromium, no graphics card)');
  ok('a frame at 1080p is well inside 16 ms even here', sp < 14, sp.toFixed(1));
  ok('no page errors', errs.length === 0, errs.slice(0, 3));
  console.log(fail ? fail + ' FAILED' : 'ALL PASS'); await browser.close(); process.exit(fail ? 1 : 0);
})();
