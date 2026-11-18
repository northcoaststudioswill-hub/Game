/* Lightswarm lab: boots cartridge 6, checks the rules step by step, then lets a simple bot play whole expeditions
   (it walks away from the crowd, drifts to motes, uses CHARGE and WHISTLE, takes a card) and prints how they went.
   Run from the repo root:  node alt/tests/lightswarm_lab.js [build.html] [runs]
   Screenshots land in alt/playtest/lightswarm/. */
const { chromium } = require('playwright');
const path = require('path');
const BUILD = path.resolve(process.argv[2] || path.join(__dirname, '../games/pocket-lantern-alt.html'));
const RUNS = +(process.argv[3] || 3), OUT = path.join(__dirname, '../playtest/lightswarm');
(async () => {
  const browser = await chromium.launch(); const page = await browser.newPage({ viewport: { width: 440, height: 956 }, deviceScaleFactor: 2 });
  const errs = []; page.on('pageerror', e => errs.push(e.message)); page.on('console', m => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) errs.push(m.text()); });
  await page.goto('file://' + BUILD + '?dev'); await page.waitForTimeout(500);
  let fail = 0; const ok = (name, cond, info) => { if (!cond) fail++; console.log((cond ? 'PASS ' : 'FAIL ') + name + (info !== undefined ? '  ' + JSON.stringify(info) : '')); };
  const E = s => page.evaluate(s => __g.ev(s), s), L = s => page.evaluate(s => eval(s), s);
  const shot = n => page.screenshot({ path: path.join(OUT, n + '.png') });
  ok('six cartridges on the shelf', (await L(`document.querySelectorAll('.cart').length`)) === 6);
  await shot('00-shelf');
  await L(`localStorage.removeItem('lightswarm-v1');void 0`);
  await page.evaluate(() => document.querySelector('.cart[data-i="5"]').dispatchEvent(new PointerEvent('pointerdown', { bubbles: true })));
  for (let i = 0; i < 40 && (await E('state')) !== 'ls'; i++) { await page.keyboard.press('z'); await page.waitForTimeout(150); }
  ok('the cartridge boots to its title', (await E('state')) === 'ls' && (await L('__g.LS._.G.s')) === 'title');
  ok('the pad is labelled for it', (await L(`document.querySelector('#bA span').textContent`)) === 'charge');
  await page.waitForTimeout(300); await shot('01-title');
  /* from here the game is stepped by hand so results do not depend on the machine */
  await L(`window.__st=(n,k)=>{const g=__g;for(let i=0;i<n;i++){if(k)k(i);g.update(1/30);for(const q in g.keys)g.prev[q]=g.keys[q]}g.draw()};
    window.__tap=k=>{__g.keys[k]=1;__st(1);__g.keys[k]=0;__st(2)};void 0`);
  const tap = k => L(`__tap('${k}')`), G = s => L('(()=>{const X=__g.LS._,G=X.G,N=X.RN,SV=X.SV;return ' + s + '})()');
  await tap('a'); ok('first start shows the story', (await G('G.s')) === 'story'); await page.waitForTimeout(80); await shot('02-story');
  for (let i = 0; i < 5; i++) await tap('a');
  ok('then asks who leads the swarm', (await G('G.s')) === 'pick'); await shot('03-pick');
  await tap('right'); await tap('a'); ok('a locked kind cannot lead without seeds', (await G('G.s')) === 'pick' && (await G('G.noteT>0')));
  await tap('left'); await tap('a'); ok('an Ember-led expedition starts', await G(`G.s==='play'&&N.w[0]===1&&N.sw.length===2`));
  await L('__st(30)'); await shot('04-start');
  /* rules */
  await G(`(X.spawn('CINDERCAP',N.P.x+40,N.P.y),0)`); await L('__st(60)');
  ok('an ember lights a buddy and it leaves a mote', await G('N.calm>=1'), await G('[N.calm,N.mo.length,N.xp]'));
  await G(`(N.en.length=0,N.mo.length=0,X.gain(N.need),0)`); await L('__st(2)');
  ok('enough motes deal three cards', await G(`G.s==='cards'&&G.cards.length===3`), await G('G.cards.map(c=>c.k)')); await L('__st(20)'); await shot('05-cards');
  const lv0 = await G('N.w.reduce((a,b)=>a+b,0)+Object.values(N.p).reduce((a,b)=>a+b,0)'); await tap('a');
  ok('taking a card adds one level of something and play goes on', await G(`G.s==='play'`) && (await G('N.w.reduce((a,b)=>a+b,0)+Object.values(N.p).reduce((a,b)=>a+b,0)')) === lv0 + 1);
  const hp0 = await G('N.hp'); await G(`(N.P.inv=0,N.en.length=0,X.spawn('PEBBLIT',N.P.x,N.P.y+2),0)`); await L('__st(3)');
  ok('a dim buddy that reaches you dims your light', (await G('N.hp')) < hp0, [hp0, await G('N.hp')]);
  await G(`(N.en.length=0,N.bCd=0,X.ring('CINDERCAP',8,50),N.mo.push(window.__far={x:N.P.x+150,y:N.P.y,v:1,pull:0,a:0}),0)`); await L(`__g.keys.b=1;__st(1);__g.keys.b=0`);
  ok('WHISTLE calls far motes and shoves the ring back', await G(`(__far.pull>0||__far.done)&&N.en.length>0&&N.en.every(e=>e.stun>0)&&N.bCd>5`));
  await G(`(N.en.length=0,N.aCd=0,N.P.fx=1,N.P.fy=0,X.spawn('CINDERCAP',N.P.x+50,N.P.y),0)`); const c0 = await G('N.calm'); await tap('a'); await L('__st(12)');
  ok('CHARGE surges the swarm through what is ahead', (await G('N.calm')) > c0 && (await G('N.aCd>3')));
  await G(`(N.en.length=0,X.spawn('BOULDERHOUND',N.P.x+60,N.P.y).hp=1,0)`); await L('__st(50)');
  ok('a calmed big one walks with you and leaves a gift', await G(`N.fr.length===1&&(N.it.some(i=>i.k==='chest')||N.queue>0||G.s==='cards')`));
  for (let i = 0; i < 6 && (await G('G.s')) === 'cards'; i++) { await L('__st(16)'); await tap('a'); }
  await G(`(N.t=X.BOSS_AT-.1,N.en.length=0,0)`); await L('__st(6)');
  ok('the Guardian wakes at five minutes', await G(`!!N.boss&&N.boss.id==='PYTHORN'`)); await L('__st(40)'); await shot('06-guardian');
  await G(`(N.boss.hp=1,N.boss.x=N.P.x+40,N.boss.y=N.P.y,N.wt[0]=0,0)`); await L('__st(40)');
  for (let i = 0; i < 6 && (await G('G.s')) === 'cards'; i++) { await L('__st(16)'); await tap('a'); }
  ok('lighting it wins the expedition', await G('N.won>0'), await G('[N.won,G.s,N.boss&&N.boss.hp]')); await L('__st(60)'); await shot('07-win');
  await L('__st(400)'); ok('the report pays seeds and counts the win', await G(`G.s==='report'&&G.rep.won&&G.rep.seeds>=30&&SV.wins===1`), await G('G.rep')); await shot('08-report');
  await L('__st(40)'); await tap('b'); ok('B opens Sunkeep', (await G('G.s')) === 'shop'); const s0 = await G('SV.seeds'); await tap('a');
  ok('seeds buy a lasting upgrade', (await G('SV.up.glass')) === 1 && (await G('SV.seeds')) === s0 - 12); await shot('09-sunkeep');
  ok('the save is written under its own key', await L(`JSON.parse(localStorage.getItem('lightswarm-v1')).up.glass===1`));
  await G(`(X.newRun(0),G.s='play',0)`); ok('the upgrade shows in the next run', (await G('N.max')) === 115);
  await G(`(N.hp=1,N.P.inv=0,X.hurt(5),0)`); await L('__st(100)'); ok('when the light goes out the run ends with a report', await G(`G.s==='report'&&!G.rep.won`));
  /* the bot: whole expeditions */
  await L(`window.__bot=(st,seedUp)=>{const X=__g.LS._,G=X.G,K=__g.keys;X.newRun(st);G.s='play';const log=[];let fr=0,minHp=1e9;
   while(fr<30*60*8){const N=X.RN;if(G.s==='report')break;
    for(const q of['up','down','left','right','a','b'])K[q]=0;
    if(G.s==='cards'){if(G.lock<=0){const c=G.cards,pr=c.findIndex(q=>q.k==='w');G.ci=pr>=0?pr:0;K.a=1}}
    else if(G.s==='play'&&!N.dead&&!N.won){const P=N.P;let ax=0,ay=0,close=0;
     for(const e of N.en){const dx=P.x-e.x,dy=P.y-e.y,d=Math.hypot(dx,dy)||1;if(d<75){const w=(75-d)/75*(e.D.boss?4:1);ax+=dx/d*w;ay+=dy/d*w;if(d<34)close++}}
     for(const q of N.ep){const dx=P.x-q.x,dy=P.y-q.y,d=Math.hypot(dx,dy)||1;if(d<40){ax+=dx/d*2;ay+=dy/d*2}}
     if(Math.hypot(ax,ay)<.6){let b=null,bd=160*160;for(const m of N.mo){const d=(m.x-P.x)**2+(m.y-P.y)**2;if(d<bd){bd=d;b=m}}for(const it of N.it){b=it;break}if(b){ax+=(b.x-P.x)/100;ay+=(b.y-P.y)/100}}
     if(ax>.15)K.right=1;if(ax<-.15)K.left=1;if(ay>.15)K.down=1;if(ay<-.15)K.up=1;
     if(close>=3&&N.bCd<=0&&fr%2)K.b=1;else if(close>=2&&N.aCd<=0&&fr%2)K.a=1;
     minHp=Math.min(minHp,N.hp);if(fr%900===0)log.push([N.t|0,N.lv,N.calm,N.en.length,N.hp|0])}
    __g.update(1/30);for(const q in K)__g.prev[q]=K[q];fr++}
   const N=X.RN,r=G.rep||{};return{won:!!r.won,t:Math.round(N.t),lv:N.lv,calm:N.calm,seeds:r.seeds,w:N.w.join(''),p:Object.values(N.p).join(''),dmg:N.dmgTaken|0,log:log.map(q=>q.join('/')).join(' ')}};void 0`);
  const res = [];
  for (let i = 0; i < RUNS; i++) { const r0 = await L(`__bot(${[0, 2, 3][i % 3]})`); res.push(r0); console.log('bot run ' + (i + 1) + ': ' + JSON.stringify(r0)); }
  ok('the bot lasts at least a minute every time', res.every(q => q.t >= 60), res.map(q => q.t));
  ok('the bot levels up at least four times every time', res.every(q => q.lv >= 5), res.map(q => q.lv));
  ok('no page errors', !errs.length, errs.slice(0, 5));
  console.log(fail ? fail + ' FAILED' : 'ALL PASS'); await browser.close(); process.exit(fail ? 1 : 0);
})();
