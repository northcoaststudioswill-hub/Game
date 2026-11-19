/* Sprouts TV 2: everything this copy adds to Sprouts TV. Settings (view, import, erase), calmer rewards, the story's
   turns and the people's lines, Ranger's posts, Scout's wisp and notebook, Marcus's key and bet, the wedding book,
   expeditions, night grubs, rain, a second player as Louie, Louie's morning, photo mode, and the stripped console code.
   (The reshaped story itself, midpoint to ending, is walked in sprouts_coast.js.)
   Run from the repo root:  node sprouts-tv2/tests/tv2.js [build.html] [shotsDir]      (about a minute) */
const { chromium } = require('playwright');
const path = require('path'), fs = require('fs');
const BUILD = path.resolve(process.argv[2] || path.join(__dirname, '../games/sprouts-tv2.html'));
const SHOTS = process.argv[3] ? path.resolve(process.argv[3]) : null;
(async () => {
  if (SHOTS) fs.mkdirSync(SHOTS, { recursive: true });
  const browser = await chromium.launch(); let fail = 0; const errs = [];
  const ok = (name, cond, info) => { if (!cond) fail++; console.log((cond ? 'PASS ' : 'FAIL ') + name + (info !== undefined ? '  ' + JSON.stringify(info) : '')); };
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 720 }, acceptDownloads: true });
  const page = await ctx.newPage();
  page.on('pageerror', e => errs.push(e.message)); page.on('console', m => { if (m.type() === 'error' && !/ERR_FILE_NOT_FOUND/.test(m.text())) errs.push(m.text()); });
  /* two controllers the test can press, and a Sprouts TV save sitting in the browser to import */
  await page.addInitScript(() => { const mk = () => ({ connected: true, mapping: 'standard', axes: [0, 0, 0, 0], buttons: Array.from({ length: 17 }, () => ({ pressed: false, value: 0 })) }); window.__pad = mk(); window.__pad2 = mk(); navigator.getGamepads = () => [window.__pad, window.__pad2];
    try { if (!localStorage.getItem('sprouts-tv:sprouts-v2')) localStorage.setItem('sprouts-tv:sprouts-v2', JSON.stringify({ t: 7, meta: { petals: 321, xp: 400, tix: 4 }, run: null })); } catch (e) { } });
  await page.goto('file://' + BUILD + '?dev'); await page.waitForTimeout(600);
  const E = s => page.evaluate(s => __g.ev(s), s);
  const shot = async n => { if (SHOTS) { await E('g.setTransform(K,0,0,K,0,0);draw();void 0'); await page.screenshot({ path: path.join(SHOTS, n + '.png') }); } };
  const step = (n, dt = 1 / 30) => E(`(()=>{for(let i=0;i<${n};i++){__g.update(${dt});for(const k in __g.keys)__g.prev[k]=__g.keys[k]}})()`);
  await E('HOLD=1;void 0'); /* the test owns the clock; only the controller section below lets the page's own loop run */
  const tap = async k => { await E(`keys.${k}=1;void 0`); await step(1); await E(`keys.${k}=0;void 0`); await step(2); };
  const fresh = `init();live=true;state='play';run.egg={sesh:1,job:1,dream:1,zoomies:1,button:1,hottub:1,moon:1,slide:1,bessie:1};ZONES.forEach(z=>run.seen[z[0]]=1);run.pjSeen={ww:1,gh:1,den:1,lo:1,bh:1,lf:1};toasts.length=0;msgT=0;`; /* (project cards would cut in at random) */

  /* ---- nothing of the console is left ---- */
  const html = fs.readFileSync(BUILD, 'utf8'), code = html.slice(html.lastIndexOf('<script>'));
  ok('the cartridge shelf, splash, boot and other cartridges\' hooks are gone from the game', !/cartPick|lanOpen|KO_CART|PP_CART|LS_CART|SPLASHSRC|RDCAP|g3Update|twUpdate/.test(code) && !/id="shelf"|id="dpad"|class="cart/.test(html));

  /* ---- settings ---- */
  await E(`${fresh}state='settings';setFrom='menu';seti=SETROWS.indexOf('VIEW');void 0`); await shot('tv2-settings');
  ok('Settings is one list: music, sound, view, controls, credits, import, reset pulls, erase (B goes back)', await E(`SETROWS.join()==='MUSIC,SOUND FX,VIEW,CONTROLS,CREDITS,IMPORT A SAVE,RESET PULLS,ERASE EVERYTHING'`));
  await E(`state='settings';setFrom='pause';seti=SETROWS.indexOf('CONTROLS');void 0`); await tap('a'); await E('g.setTransform(K,0,0,K,0,0);draw();void 0');
  ok('CONTROLS opens a page of every button, and B comes back to Settings', (await E('state')) === 'controls'); await shot('tv2-controls'); await tap('b'); ok('back in Settings', (await E('state')) === 'settings');
  await E(`seti=SETROWS.indexOf('CREDITS');void 0`); await tap('a'); const cr = JSON.parse(await E(`JSON.stringify([state,crLines().map(q=>q[0]).filter(Boolean),crLines().every(q=>!q[0]||tw(q[0],q[1])<=236),crEnd()])`));
  ok('CREDITS rolls the cast and the songs in the build, each line inside the screen', cr[0] === 'credits' && cr[1].includes('BEAUTIFUL SPROUTS') && cr[1].includes('WILL     ERIN     LOUIE') && cr[2] && cr[3] > 10 && cr[3] < 60, cr);
  await E('g.setTransform(K,0,0,K,0,0);draw();void 0'); await step(30 * 5); await E('g.setTransform(K,0,0,K,0,0);draw();void 0'); await shot('tv2-credits'); await tap('a'); ok('A skips them, back to Settings', (await E('state')) === 'settings'); await E(`seti=SETROWS.indexOf('VIEW');void 0`);
  ok('only the songs Sprouts plays are in the file', await E(`TRACKS.length===2&&TRACKS.every(t=>t.use.includes('game')||t.use.includes('menu'))`), await E('TRACKS.map(t=>t.title)'));
  const v0 = JSON.parse(await E('JSON.stringify([Z,VW,VH])')); await tap('a'); const v1 = JSON.parse(await E('JSON.stringify([Z,VW,VH,meta.view])')); await tap('right'); const v2 = JSON.parse(await E('JSON.stringify([Z,VW,VH,meta.view])'));
  ok('VIEW switches between wide (320 across) and close (the handheld\'s zoom), and back', v0[0] === 1 && v0[1] === 320 && v1[0] === 1.5 && v1[1] === 214 && v1[2] === 120 && v1[3] === 1 && v2[0] === 1 && v2[3] === 0, [v0, v1, v2]);
  await E(`meta.view=1;setView();state='play';P.x=HX;P.y=HY+30;cam.x=P.x-VW/2;cam.y=P.y-VH/2;void 0`); await step(4); await shot('tv2-close-view');
  ok('the close view still fills the screen', await E(`(()=>{g.setTransform(K,0,0,K,0,0);draw();const d=g.getImageData(0,0,cv.width,cv.height).data;let n=0;for(let x=2;x<320;x+=9)for(let y=24;y<150;y+=9){const j=(y*K*cv.width+x*K)*4;if(d[j]+d[j+1]+d[j+2]>60)n++}meta.view=0;setView();return n>450})()`));
  await E(`state='settings';setFrom='menu';seti=SETROWS.indexOf('IMPORT A SAVE');meta.petals=5;void 0`); await tap('a');
  ok('IMPORT A SAVE finds the Sprouts TV save and asks before replacing this game', await E(`impArm===1&&/FOUND SPROUTS TV/.test(flash)&&meta.petals===5`), await E('flash'));
  await tap('a');
  ok('a second press brings it in, as this game\'s own save, and leaves the other game\'s alone', await E(`meta.petals===321&&meta.tix===4&&state==='menu'`) && await page.evaluate(() => { const g = k => window.__rawGet(k); return JSON.parse(g('sprouts-tv2:sprouts-v2')).meta.petals === 321 && JSON.parse(g('sprouts-tv:sprouts-v2')).t === 7; }), await E('[meta.petals,state]'));

  /* ---- calmer rewards ---- */
  const calm = JSON.parse(await E(`(()=>{${fresh}const t0=toasts.length;unlock1(3);unlock1(5);earn(700);gard.open=true;gard.basket=9;P.x=46*16;P.y=7*16+8;__g.update(1/30);const pop=toasts.length-t0,nw=(tod.news||[]).slice();
    return JSON.stringify([pop,nw.filter(l=>/^REWARD/.test(l)).length,nw.filter(l=>/^KEEPER RANK/.test(l)).length,tod.bask,rankOf(975)[0],rankOf(60)[0],LOU_AT[1],LOU_AT[5]])})()`));
  ok('rewards, rank-ups and garden baskets no longer pop up; they are kept as the day\'s news', calm[0] === 0 && calm[1] === 2 && calm[2] >= 1 && calm[3] === 9, calm);
  ok('ranks and Louie\'s levels come slower (975 petals was rank 11; Louie\'s second level was 15 xp)', calm[4] <= 7 && calm[5] === 2 && calm[6] === 30 && calm[7] === 500, calm.slice(4));
  await E(`tod.dq=2;state='play';endDay();void 0`); await step(2); await shot('tv2-report');
  ok('the evening report comes first, then a second page, ALSO TODAY, with the news', await E(`state==='dayend'&&tod.pg===0&&tod.news.some(l=>/GARDEN BASKETS  \\+9/.test(l))&&tod.news.some(l=>/DAILY ASKS DONE: 2/.test(l))`), await E('JSON.stringify(tod.news)'));
  await tap('a'); const pg = await E('tod.pg'); await shot('tv2-also-today'); const d0 = await E('day'); await E(`home.res=[3,2,0,0,0,0];home.jobs=[2,2,1];void 0`); await tap('a'); await step(3);
  ok('A turns to it, A again sleeps, and the night\'s news is one line with the morning greeting', pg === 1 && (await E('day')) === d0 + 1 && await E(`/GOOD MORNING.*HOME:/.test(msg)&&toasts.length===0`), [pg, await E('msg')]);

  /* ---- the story's turns, and what people say about them ---- */
  const turns = JSON.parse(await E(`(()=>{${fresh}const out=[],k=()=>out.push(stageKey());k();won=true;k();run.call=1;k();run.coastScn=1;k();run.leak=1;k();run.lens=1;k();run.fin=1;k();run.rest=1;k();
    const fits=Object.keys(SL).every(n=>Object.values(SL[n]).every(l=>wrapPx(l,178).length<=6));npcs.forEach(n=>n.st='active');run.rest=0;run.fin=0;run.lens=0;run.leak=0;run.coastScn=0;run.call=0;
    const e=npcs[0];P.x=e.x;P.y=e.y+14;talk(e);const a=dlg.pages.flat().join(' ');talk(e);const b=dlg.pages.flat().join(' ');run.call=1;talk(e);const c=dlg.pages.flat().join(' ');state='play';
    return JSON.stringify([out,fits,/still skips/.test(a),/still skips/.test(b),/second lantern/.test(c),Object.keys(SL).map(n=>Object.keys(SL[n]).length)])})()`));
  ok('the story has seven turns after the start: whole, the call, the coast, the leak, the lens, the ending, the light at rest', turns[0].join() === ',mid,call,coast,leak,lens,fin,rest', turns[0]);
  ok('each person says one new thing after each turn, once, and it fits the speech box', turns[1] && turns[2] && !turns[3] && turns[4] && turns[5].every(n => n >= 6), turns.slice(1));
  const asks = JSON.parse(await E(`(()=>{${fresh}const id=n=>npcs[n].ms.map(m=>m.id).join();return JSON.stringify([id(1),id(2),id(3),npcs.every(n=>n.ms.every(m=>wrapPx(m.say,178).length<=9&&tw(m.t,2)<=200)),/Stay on the dirt/.test(npcs[1].intro),/write things down/.test(npcs[2].intro)])})()`));
  ok('Ranger ends on the trail posts, Scout looks for the Lanternwisp before the glimmers, Marcus starts with his lost key and ends on a bet', asks[0] === 'r1,r2,r3,r5,r4,r6' && asks[1] === 's1,s2,s3,s4,s7,s5,s6' && asks[2] === 'm0,m1,m2,m3,m4' && asks[3] && asks[4] && asks[5], asks);
  const posts = JSON.parse(await E(`(()=>{${fresh}const a=postsSeen();PZ.forEach(z=>{const p=postXY(z);P.x=p.x;P.y=p.y+10;postTick()});const b=postsSeen();postTick();return JSON.stringify([a,b,postsSeen(),npcs[1].ms.find(m=>m.id==='r6').get()])})()`));
  ok('standing at a trail post is enough: four posts, each counted once', posts.join() === '0,4,4,4', posts);
  const net = JSON.parse(await E(`(()=>{${fresh}const wild=sprouts.filter(q=>!inSoil(q)).length;buds.length=0;squad.length=0;sprouts=sprouts.filter(q=>!inSoil(q));seeds.length=0;newDay0();const a=sprouts.filter(inSoil).length;newDay0();return JSON.stringify([wild>0,a,sprouts.filter(inSoil).length>=3])})()`));
  ok('with nobody out, nothing in the soil and no seeds, the Lantern grows three Embers by morning (wild sprouts elsewhere do not count as a crew)', net[0] && net[1] === 3 && net[2], net);
  const heart = JSON.parse(await E(`(()=>{${fresh}const e=npcs[0];e.st='active';e.mi=2;DIG.alive=false;items.forEach(i=>i.alive=false);bugs.forEach(q=>q.alive=false);P.x=e.x;P.y=e.y+15;P.dx=0;P.dy=-1;P.mv=false;P.idle=2;LO.x=LO.sx=P.x;LO.y=LO.sy=P.y-9;LO.st='follow';for(let i=0;i<3;i++){__g.update(1/30)}const ok1=petOK;doA(true);const a=[state,run.pets];run.pets=3;for(let i=0;i<3;i++)__g.update(1/30);doA(true);return JSON.stringify([ok1,a,state])})()`));
  ok('during Erin\'s PET LOUIE ask, A with the heart up scratches Louie even standing in front of Erin; once it is done, A talks to her again', heart[0] && heart[1][0] === 'play' && heart[1][1] === 1 && heart[2] === 'talk', heart); await E(`state='play';void 0`);
  const past = JSON.parse(await E(`(()=>{const out=[];for(const berry of [1,0]){${fresh}gates.forEach(g=>{if(g.sub!==4&&g.alive)openGate(g,true)});items.forEach(i=>i.alive=false);bugs.forEach(q=>q.alive=false);DIG.alive=false;const q=postXY(PZ.find(z=>z[0]==='SUNNY ORCHARD'));P.x=q.x;P.y=q.y+18;P.dx=0;P.dy=-1;P.mv=false;LO.x=LO.sx=P.x+50;LO.y=LO.sy=P.y+30;LO.st='sit';LO.t=9;for(let i=0;i<5;i++)mkBud(0,2,P.x,P.y+6);if(berry)mkItem('berry',q.x,q.y-34);for(let i=0;i<6;i++)__g.update(1/30);doA(true);out.push(state,buds.some(b=>b.st==='fly'));state='play'}return JSON.stringify(out)})()`));
  ok('a berry behind a trail post: A throws at the berry; with nothing aimed at, A at the post opens the travel list', past.join() === 'play,true,travel,false', past);
  const postWalk = JSON.parse(await E(`(()=>{${fresh}const r=npcs[1];r.st='active';r.mi=r.ms.findIndex(m=>m.id==='r6');run.trk='RANGER';run.meet=0;npcs[0].st='active';npcs[0].mi=5;run.keep=1;run.pjSeen={};PJ.forEach(p=>run.pjSeen[p.id]=1);gates.forEach(q=>{if(q.id!=='sunDoor'&&q.id!=='northPier'&&q.alive)openGate(q,true)});
    const o=()=>{const q=objective();return q?q.text:''},out=[];for(let k=0;k<3;k++){const q=AT.r6();out.push(/TRAIL POSTS/.test(o())&&!!q&&q!==r);P.x=q.x;P.y=q.y+10;postTick()}
    out.push(postsSeen(),postsWait(),/TRAIL POSTS|RANGER/.test(o()),AT.r6());talk(r);out.push(/stone door/.test(JSON.stringify(dlg.pages)));state='play';
    openGate(coastGate('sunDoor'),false);const q=AT.r6();out.push(postsWait(),/TRAIL POSTS/.test(o()),ZONES.find(z=>z[0]==='NORTH COAST')[5]===(q.x>>4));P.x=q.x;P.y=q.y+10;postTick();out.push(/GO SEE RANGER/.test(o()));return JSON.stringify(out)})()`));
  ok('the arrow leads to each post in turn, found or not; with only the coast\'s post left behind a shut door it lets go of Ranger, and he says where the fourth is', postWalk.join() === 'true,true,true,3,true,false,,true,false,true,true,true', postWalk);
  const bet = JSON.parse(await E(`(()=>{${fresh}run.bet={d:day,b:tod.berries};tod.berries+=5;const a=betGot();newDay0();const b=betGot();tod.berries+=8;const c=betGot();newDay0();return JSON.stringify([a,b,c,betGot(),!!run.bet.won])})()`));
  ok('Marcus\'s bet is eight berries in one day: a short day is nothing and it starts again; a won bet stays won', bet.join() === '5,0,8,8,true', bet);
  ok('"see one, send one" is only the dab now: it is gone from his asks about Dews and sprouts', await E(`npcs[3].ms.every(m=>!/see one, send one/i.test(m.say+(m.late||'')))&&C3SCN.sesh.some(q=>/See one, send one/.test(q.cap[1]))`));
  const rest = JSON.parse(await E(`(()=>{${fresh}run.call=1;run.lit=1;run.fin=1;run.finDay=day;const a=[];for(let k=0;k<4;k++){newDay0();a.push(run.rest|0)}return JSON.stringify(a)})()`));
  ok('three nights after it is answered the North Light banks down to an ember (it is not put out), even for a keeper who sleeps through the dusk', rest.join() === '0,0,0,1' && await E(`run.lit===1`), rest);
  const restScn = JSON.parse(await E(`(()=>{${fresh}run.call=1;run.lit=1;run.fin=1;run.finDay=day;const out=[];day+=2;dayT=DAYLEN*.8;coastTick();out.push(sceneQ.length);day+=1;dayT=DAYLEN*.5;coastTick();out.push(sceneQ.length);dayT=DAYLEN*.8;coastTick();out.push(sceneQ.length&&sceneQ[0][0],run.rest|0);coastTick();out.push(sceneQ.length);return JSON.stringify(out)})()`));
  ok('awake at dusk on the third night, the keeper watches it lower: the scene plays once', restScn.join() === '0,0,3:rest,1,1', restScn);

  /* ---- Scout's notebook ---- */
  const nb = JSON.parse(await E(`(()=>{${fresh}const a=notesHave();run.boss=true;won=true;run.keep=1;run.call=1;run.leak=1;run.lit=1;run.fin=1;run.rest=1;run.wbSeen={LANTERNWISP:1};shards=4;npcs.forEach(n=>{n.st='active';n.mi=3});const b=notesHave();
    state='bugs';colFrom='pause';cpage=3;csel=8;g.setTransform(K,0,0,K,0,0);draw();return JSON.stringify([NOTES.length,a,b,NOTES.every(q=>wrapPx(q[2],132+UX-4-18,1).length<=11),NOTES.every(q=>tw(q[0],1)<=88)])})()`)); await shot('tv2-notebook');
  ok('Scout\'s notebook is the Collection\'s fourth page: sixteen entries that fill in as things are found out, each fitting its page', nb[0] === 16 && nb[1] === 2 && nb[2] === 16 && nb[3] && nb[4], nb);
  await tap('right'); const pgA = await E('cpage'); await tap('left'); await tap('left'); const pgB = await E('cpage'); await E(`state='play';void 0`);
  ok('left and right still go round all four pages', pgA === 0 && pgB === 2, [pgA, pgB]);

  /* ---- the wedding book ---- */
  const wed = JSON.parse(await E(`(()=>{${fresh}enterHome();homeUse(HST.find(h=>h.id==='fire'));const fire=hsel.opts.map(o=>o[0]);hsel.opts[0][2]();const a=[wedN(),hsel.sub.every(l=>wrapPx(l,226,1).length===1),hsel.opts.map(o=>o[0]),run.book,!!wedObj()];
    run.keep=1;run.boss=true;run.fin=1;gard.harv=9999;meta.trs=[0,1,2,3,4,5];meta.dog.xp=LOU_AT[3];npcs.forEach(n=>n.st='active');const ob=wedObj();wedOpen();return JSON.stringify([fire,a,wedN(),hsel.opts.map(o=>o[0]),ob&&ob.text])})()`));
  ok('the wedding book is by the fire; its six pages fill from things done in the valley', wed[0][0] === 'THE WEDDING BOOK' && wed[1][0] === 0 && wed[1][1] && wed[1][2].join() === 'CLOSE THE BOOK' && wed[1][3] === 1 && !wed[1][4] && wed[2] === 6, wed);
  await shot('tv2-wedding-book');
  ok('after the ending the arrow can point at it, and with every page filled the date can be set', /WEDDING BOOK:  6 \/ 6/.test(wed[4]) && wed[3][0] === 'SET THE DATE', wed.slice(3));
  const tx0 = await E('meta.tix'); await E(`hsel.i=0;void 0`); await tap('a'); await step(4);
  ok('setting the date plays SAVE THE DATE in 3D', await E(`state==='c3'&&c3q.key==='book'&&C3SCN.book.every(q=>wrapPx(q.cap[1],228).length<=3)`), await E('state'));
  await tap('start'); await step(6);
  ok('and the date is left open (this is before Sproutwild): a card, three tickets, done once', await E(`run.wed===1&&state==='card'&&/left open/.test(card.sub)&&meta.tix>=${tx0}+3&&!wedObj()&&wrapPx(card.sub,172,1).length<=5`), await E('[state,meta.tix]')); await tap('a'); await step(3);

  /* ---- expeditions ---- */
  const ex = JSON.parse(await E(`(()=>{${fresh}enterHome();homeUse(HST.find(h=>h.id==='fire'));const before=hsel.opts.map(o=>o[0]);run.fin=1;homeUse(HST.find(h=>h.id==='fire'));const after=hsel.opts.map(o=>o[0]);
    home.res=[2,1,0,0,0,0];home.jobs=[1,1,1];state='hsel';expSend();const few=[!!run.exp,flash];home.res=[3,3,1,0,0,0];home.jobs=[3,2,2];expSend();const sent=[homeTotal(),run.exp&&run.exp.back-day,home.jobs.reduce((a,b)=>a+b,0)<=homeTotal(),state];
    expSend();const again=flash;inHome=false;state='play';const p0=meta.petals;day+=1;expBack();const early=!!run.exp;day+=1;expBack();return JSON.stringify([before,after,few,sent,/STILL OUT/.test(again),early,homeTotal(),meta.petals-p0,run.expN])})()`));
  ok('after the ending five sprouts who live in the house can be sent out with a light for two days', !ex[0].includes('SEND AN EXPEDITION') && ex[1].includes('SEND AN EXPEDITION') && !ex[2][0] && /NEEDS 5/.test(ex[2][1]) && ex[3][0] === 2 && ex[3][1] === 2 && ex[3][2] && ex[3][3] === 'play' && ex[4], ex);
  await step(40); /* the postcard arrives on a timer: a second or so of stepped time */
  ok('four come home with a postcard and thirty petals; one stays out to keep the light', ex[5] === true && ex[6] === 6 && ex[7] === 30 && ex[8] === 1 && await E(`state==='card'&&card.title==='A POSTCARD'&&EXPC.every(l=>wrapPx(l+'  +30 and a ticket.',172,1).length<=5)`), [ex.slice(5), await E('state')]); await shot('tv2-postcard'); await tap('a'); await step(2);

  /* ---- night grubs ---- */
  const raid = JSON.parse(await E(`(()=>{${fresh}const out=[];day=2;run.grubs=true;out.push(raidN());day=4;out.push(raidN());day=9;out.push(raidN());tod.rain=1;out.push(raidN());tod.rain=0;run.grubs=false;out.push(raidN());run.grubs=true;
    day=5;sprouts=sprouts.filter(q=>!inSoil(q));for(let i=0;i<6;i++)mkSprout(0,410+i*16,376,0);P.x=HX;P.y=HY-60;dayT=DAYLEN*.73;__g.update(1/30);const n=foes.filter(e=>e.raid&&e.alive).length,tip=msg;
    for(let i=0;i<30*45;i++){if(dayT>DAYLEN-2)dayT=DAYLEN*.8;__g.update(1/30)}return JSON.stringify([out,n,/GRUBS/.test(tip),tod.eaten,sprouts.filter(inSoil).length,foes.filter(e=>e.raid&&e.alive).length])})()`));
  ok('from the third day grubs come at dusk, more as the days go on, never in rain, never before grubs are awake', raid[0].join() === '0,1,3,0,0' && raid[1] === 2 && raid[2], raid);
  ok('left alone, each eats two seedlings from the Lantern\'s soil and burrows off', raid[3] === 4 && raid[4] === 2 && raid[5] === 0, raid.slice(3));
  const watch = JSON.parse(await E(`(()=>{${fresh}day=4;run.grubs=true;run.boss=true;tod.raid=0;raidStart();const a=sceneQ.map(q=>q[0]).join(),n1=foes.filter(e=>e.raid).length;sceneQ.length=0;tod.raid=0;raidStart();return JSON.stringify([a,n1,sceneQ.length,run.wtch])})()`));
  ok('the first dusk Thornback turns a grub away is a scene; after that it is a line over his head', watch.join() === '3:watch,0,0,1', watch);
  const guard = JSON.parse(await E(`(()=>{${fresh}day=4;run.grubs=true;run.boss=true;run.wtch=1;sprouts=sprouts.filter(q=>!inSoil(q));for(let i=0;i<6;i++)mkSprout(0,410+i*16,376,0);P.x=HX;P.y=HY-60;dayT=DAYLEN*.73;__g.update(1/30);const thorn=foes.filter(e=>e.raid).length;
    run.boss=false;tod.raid=0;__g.update(1/30);const e=foes.find(q=>q.raid);for(let i=0;i<5;i++){const b=mkBud(0,2,e.x,e.y);b.tgt=e;b.st='fight';e.on.push(b)}for(let i=0;i<30*12;i++)__g.update(1/30);const beaten=!e.alive&&!tod.eaten;
    endDay();return JSON.stringify([thorn,beaten,tod.news.find(l=>/SOIL|GRUBS GOT/.test(l))])})()`));
  ok('Thornback sees the first one off; sprouts thrown at one stop it; the evening report says how the night went', guard[0] === 0 && guard[1] && /KEPT SAFE/.test(guard[2]), guard);
  ok('sleeping through the dusk still costs a seedling for each grub', await E(`(()=>{${fresh}day=4;run.grubs=true;sprouts=sprouts.filter(q=>!inSoil(q));for(let i=0;i<3;i++)mkSprout(0,410+i*16,376,0);dayT=30;endDay();return tod.eaten===1&&sprouts.filter(inSoil).length===2&&tod.news.some(l=>/GRUBS GOT 1 SEEDLING /.test(l))})()`));

  /* ---- rain ---- */
  const wx = JSON.parse(await E(`(()=>{${fresh}const days=[];for(let d=1;d<=40;d++)if(wxOf(d)==='rain')days.push(d);day=2;gard.open=true;syncBeds();endDay();const fc=tod.news.some(l=>/RAIN TOMORROW/.test(l));newDay();const r=tod.rain,mq=tod.morn.concat(toasts.map(t=>t.s)).join(' ');
    plots.forEach(p=>{p.st=1;p.dry=true;p.t=99});const s=sprouts.find(inSoil)||mkSprout(0,440,376,0);const a0=s.age;__g.update(1/30);return JSON.stringify([days.slice(0,4),days.length,fc,r,/RAIN TODAY/.test(mq),plots.every(p=>!p.dry),+(s.age-a0).toFixed(3),bugs.filter(q=>q.sp===1||q.sp===9).length>=3])})()`));
  ok('about one day in five is a rain day from the third on, the same days every game, and Ranger forecasts it', wx[0].join() === '3,5,8,10' && wx[1] >= 5 && wx[1] <= 12 && wx[2] && wx[3] === 1 && wx[4], wx);
  ok('rain waters the beds, grows seedlings half again as fast, and brings out snails and a frog', wx[5] && Math.abs(wx[6] - 0.05) < 0.002 && wx[7], wx.slice(5));
  await E(`P.x=HX;P.y=HY+40;cam.x=P.x-VW/2;cam.y=P.y-VH/2;void 0`); await step(3); await shot('tv2-rain');
  ok('rain is drawn over the whole screen', await E(`(()=>{const o=g.fillRect.bind(g);let n=0;g.fillRect=(x,y,w,h)=>{if(w===1&&h===5)n++;o(x,y,w,h)};g.setTransform(K,0,0,K,0,0);draw();tod.rain=0;let m=0;g.fillRect=(x,y,w,h)=>{if(w===1&&h===5)m++;o(x,y,w,h)};draw();g.fillRect=o;return n-m>=40})()`));

  /* ---- a second player is Louie ---- */
  /* ---- no dead ends ---- */
  const open = `${fresh}gates.forEach(g=>{if(g.sub!==4&&g.id!=='northPier'&&g.alive)openGate(g,true)});`;
  const night = async () => { await E(`dayT=DAYLEN-.2;void 0`); await step(20); for (let k = 0; k < 40 && ((await E('state')) !== 'play' || (await E('dayT')) > 30); k++) { await tap('a'); await step(4); } };
  await E(open + `const it=items.find(i=>i.sub==='shard'&&!i.isle);window.__it=it;P.x=it.x;P.y=it.y+20;for(let i=0;i<8;i++){const b=mkBud(1,2,it.x,it.y);b.tgt=it;b.st='carry';it.on.push(b)}void 0`); await step(60); await night();
  ok('a shard that was being carried when night fell is lying where it was dropped in the morning, and can be walked to', await E(`day===2&&__it.alive&&items.includes(__it)&&__it.on.length===0&&shards===0&&!!pathTo(P.x,P.y,__it.x,__it.y,false)`), await E('[day,__it.alive,__it.on.length]'));
  await E(open + `run.call=1;run.coastScn=1;run.egg.coast=1;coastOpen();sceneQ.length=0;P.x=80*16;P.y=18*16;for(let i=0;i<6;i++)mkBud(0,2,P.x,P.y+6);void 0`); await night();
  ok('night falling on the coast: Will wakes at the Lantern with his crew', await E(`day===2&&(P.x>>4)<40&&free(P.x,P.y,false)&&buds.length===6`), await E('[P.x>>4,P.y>>4,buds.length]'));
  await E(open + `const it=items.find(i=>i.isle);window.__it=it;it.x=7*16+8;it.y=22*16+8;P.x=4*16+8;P.y=22*16+8;P.dx=1;P.dy=0;for(let i=0;i<6;i++)mkBud(2,2,P.x-4,P.y+4);LO.x=LO.sx=P.x-10;LO.y=LO.sy=P.y+40;LO.st='sit';LO.t=99;void 0`); await step(4);
  for (let k = 0; k < 6; k++) { await tap('a'); await step(8); } await step(30 * 6);
  ok('the island shard dropped in the pond is not lost: Dews thrown in from the nearer bank pick it up again', await E(`str(__it)>=__it.w`), await E('[__it.on.length,__it.w,__it.x|0,__it.y|0]'));

  await E('HOLD=0;void 0'); /* the controller is read by the page's own loop */
  const padSet = (which, o) => page.evaluate(([w, o]) => { const p = window[w]; if (o.ax !== undefined) p.axes[0] = o.ax; if (o.ay !== undefined) p.axes[1] = o.ay; if (o.b !== undefined) p.buttons[o.b] = { pressed: !!o.on, value: o.on ? 1 : 0 }; }, [which, o]);
  await E(`${fresh}meta.p2=0;P.x=HX;P.y=HY+50;LO.x=LO.sx=P.x+20;LO.y=LO.sy=P.y;cam.x=P.x-VW/2;cam.y=P.y-VH/2;void 0`); await page.waitForTimeout(150);
  const lx0 = await E('LO.x'), px0 = await E('P.x'); await padSet('__pad2', { ax: 1 }); await page.waitForTimeout(600); await padSet('__pad2', { ax: 0 }); await page.waitForTimeout(100);
  ok('the second controller walks Louie, not Will, and says so the first time', (await E('LO.x')) > lx0 + 25 && Math.abs((await E('P.x')) - px0) < 1 && await E(`louMan>0&&toasts.concat([]).some(t=>/PLAYER 2 IS LOUIE/.test(t.s))`), [lx0, await E('LO.x')]);
  await E(`const b=mkBud(2,2,LO.x+20,LO.y);b.st='idle';const e=mkFoe(LO.x-30,LO.y,false);void 0`); await padSet('__pad2', { b: 0, on: 1 }); await page.waitForTimeout(150); await padSet('__pad2', { b: 0, on: 0 }); await page.waitForTimeout(100);
  ok('A barks: a stray near him hops on, and a grub near him stops', await E(`LO.riders.length===1&&foes.some(e=>e.scare>0)`), await E('[LO.riders.length,foes.map(e=>e.scare)]'));
  await E('HOLD=1;void 0');
  await E(`LO.x=P.x+10;LO.y=P.y+4;LOK.left=1;louMan=5;void 0`); await step(3); await E('LOK.left=0;void 0');
  ok('back at Will the rider hops off and joins the crew', await E(`LO.riders.length===0&&buds.some(b=>b.type===2&&b.st==='follow')`));
  await E(`foes.length=0;const n0=items.filter(i=>i.alive&&(i.sub==='berry'||i.sub==='big')).length;window.__n0=n0;LOK.b=1;louMan=5;void 0`); await step(2); await E('LOK.b=0;void 0'); await step(70);
  ok('B digs up a berry where he stands', await E(`items.filter(i=>i.alive&&(i.sub==='berry'||i.sub==='big')).length===window.__n0+1`));
  await E(`louMan=.05;void 0`); await step(30); ok('left alone for a few seconds, Louie goes back to looking after himself', await E('louMan<=0'));

  /* ---- Louie's morning ---- */
  await E(`${fresh}enterHome();homeUse(HST.find(h=>h.id==='bed'));void 0`);
  ok('the beds offer Louie\'s morning', await E(`hsel.opts.length===3&&/LOUIE/.test(hsel.opts[2][0])`)); await E(`hsel.i=2;void 0`); await tap('a'); await step(40);
  for (let k = 0; k < 4 && (await E('state')) === 'dayend'; k++) { await tap('a'); await step(3); } await step(10);
  ok('the next day starts with Louie: six snacks, a squirrel, Will asleep', await E(`day===2&&!!LOUM&&LOUM.sn.length===6&&LOUM.sn.every(q=>map[(q.y>>4)*MW+(q.x>>4)]===G)&&LOUM.t>60`), await E('[day,!!LOUM,state]'));
  const w0 = JSON.parse(await E('JSON.stringify([P.x,LO.x])')); await E('keys.left=1;void 0'); await step(30); await E('keys.left=0;void 0'); const w1 = JSON.parse(await E('JSON.stringify([P.x,LO.x,cam.x+VW/2])')); await shot('tv2-louies-morning');
  ok('the controls move Louie, Will stays put, and the camera goes with Louie', w1[1] < w0[1] - 30 && Math.abs(w1[0] - w0[0]) < 1 && Math.abs(w1[2] - w1[1]) < 60, [w0, w1]);
  await E(`LO.x=LOUM.sn[0].x;LO.y=LOUM.sn[0].y;void 0`); await step(2); ok('walking over a snack eats it', await E('LOUM.got===1&&LOUM.sn[0].got===1'));
  const sq = JSON.parse(await E(`(()=>{const M=LOUM,s=M.sq,out=[];for(let k=0;k<3;k++){LO.x=s.x+10;LO.y=s.y+10;s.cd=0;__g.update(1/30);out.push(s.runs)}LO.x=s.x+20;LO.y=s.y;louBark();return JSON.stringify([out,s.treed])})()`));
  ok('the squirrel runs each time Louie gets close; bark at it after the third and it is treed', sq[0][1] === sq[0][0] + 1 && sq[0][2] === sq[0][1] + 1 && sq[0][2] >= 3 && sq[1] === 1, sq);
  const xp0 = await E('meta.dog.xp'); await E('LOUM.t=.05;void 0'); await step(4);
  ok('when the minute is up Will wakes, Louie has earned his breakfast, and the day goes on as usual', await E(`!LOUM&&/WILL IS UP/.test(msg)&&meta.dog.xp>${xp0}&&meta.life.loum===1&&state==='play'`), await E('msg'));
  const pw = await E('P.x'); await E('keys.right=1;void 0'); await step(20); await E('keys.right=0;void 0'); ok('and Will\'s own controls are back', (await E('P.x')) > pw + 10);

  /* ---- photo mode ---- */
  await E(`${fresh}for(let i=0;i<12;i++)mkBud(i%6,2,P.x+i*5,P.y+12);P.x=HX+10;P.y=HY+60;dayT=60;void 0`); await step(3); await tap('y');
  ok('Y opens photo mode', (await E('state')) === 'photo' && await E('!!PH'), await E('state'));
  const a0 = await E('PH.a'); await E('keys.right=1;keys.up=1;void 0'); await step(20); await E('keys.right=0;keys.up=0;void 0'); await tap('sel'); await E('g.setTransform(K,0,0,K,0,0);draw();void 0'); await shot('tv2-photo');
  const ph = JSON.parse(await E(`(()=>{const d=g.getImageData(0,0,cv.width,cv.height).data,s=new Set();for(let i=0;i<d.length;i+=4*211)s.add(d[i]>>4<<8|d[i+1]>>4<<4|d[i+2]>>4);return JSON.stringify([PH.a,PH.h,PH.wave,s.size])})()`));
  ok('the pad turns and lifts the camera, Select makes everyone wave, and it is the valley in 3D', ph[0] > a0 + 0.5 && ph[1] > 2.5 && ph[2] === 1 && ph[3] > 80, ph);
  const dl = page.waitForEvent('download', { timeout: 8000 }).catch(() => null); await tap('a'); await E('g.setTransform(K,0,0,K,0,0);draw();void 0'); const got = await dl;
  ok('A saves the picture as a PNG named for the day', !!got && /^sprouts-day\d+-\d+\.png$/.test(got.suggestedFilename()) && await E('meta.life.photos===1'), got && got.suggestedFilename());
  if (got && SHOTS) await got.saveAs(path.join(SHOTS, 'tv2-photo-saved.png'));
  await tap('b'); ok('B goes back to the valley', (await E('state')) === 'play' && await E('!PH'));

  ok('no page errors', errs.length === 0, errs.slice(0, 3));
  console.log(fail ? fail + ' FAILED' : 'ALL PASS'); await browser.close(); process.exit(fail ? 1 : 0);
})();
