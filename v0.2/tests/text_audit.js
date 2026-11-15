/* Rootdeep / Pocket Lantern v0.2 test: text_audit
   Run from the repo root:  node v0.2/tests/text_audit.js [path/to/build.html]
   Default build: v0.2/games/pocket-lantern_2026-11-14_v20_wip.html. Needs Playwright + Chromium
   (in Claude cloud sessions Chromium is at /opt/pw-browsers/chromium). Screenshots go to v0.2/tests/out/text_audit/. */
const { chromium } = require('playwright');
const BUILD = require('path').resolve(process.argv[2] || require('path').join(__dirname, '..', 'games', 'pocket-lantern_2026-11-14_v20_wip.html'));
const D = require('path').join(__dirname, 'out', 'text_audit') + '/'; require('fs').mkdirSync(D, { recursive: true });
(async () => {
  const browser = await chromium.launch(require('fs').existsSync('/opt/pw-browsers/chromium') ? { executablePath: '/opt/pw-browsers/chromium', args: ['--no-sandbox'] } : {});
  // iPhone 16 Pro Max: 440 x 956 CSS px at 3x
  const page = await browser.newPage({ viewport: { width: 440, height: 956 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
  const errs = []; page.on('pageerror', e => errs.push(e.message + ' @ ' + (e.stack||'').split('\n')[1]));
  await page.goto('file://' + BUILD + '?dev', { waitUntil: 'load' }); await page.waitForTimeout(800);
  await page.evaluate(() => window.__g.tb.on(true));
  const cv = await page.$('canvas');
  const H = await page.evaluate(() => window.__g.ev('H'));
  console.log('logical screen 240 x', H);
  const issues = []; let n = 0;
  const check = async (name, opts = {}) => {
    await page.waitForTimeout(opts.wait || 180);
    const tb = await page.evaluate(() => window.__g.tb.last());
    const st = await page.evaluate(() => window.__g.s.state);
    await cv.screenshot({ path: D + String(++n).padStart(2, '0') + '_' + name + '.png' });
    const out = [];
    for (const b of tb) {
      if (b.x < -0.5 || b.x + b.w > 240.5 || b.y < -0.5 || b.y + b.h > H + 0.5) out.push(`OFF-SCREEN "${b.s}" x${b.x.toFixed(0)} w${b.w.toFixed(0)} y${b.y.toFixed(0)}`);
      if (b.sq) out.push(`SQUASHED "${b.s}"`);
    }
    for (let i = 0; i < tb.length; i++) for (let j = i + 1; j < tb.length; j++) { const a = tb[i], b = tb[j];
      const ox = Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x), oy = Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y);
      if (ox > 2 && oy > 2 && !(a.s === b.s && Math.abs(a.x - b.x) < 1 && Math.abs(a.y - b.y) < 1)) out.push(`OVERLAP "${a.s}" / "${b.s}" (${ox.toFixed(0)}x${oy.toFixed(0)})`); }
    if (out.length) issues.push([name + ' [' + st + ']', out]);
  };
  const E = c => page.evaluate(c => window.__g.ev(c), c);
  const hit = async (key, ms = 160) => { await page.keyboard.down(key); await page.waitForTimeout(70); await page.keyboard.up(key); await page.waitForTimeout(ms); };
  // ---- Sprouts: capsules + settings ----
  await page.evaluate(`document.querySelector('.cart[data-i="0"]').dispatchEvent(new PointerEvent('pointerdown',{bubbles:true}))`); await page.waitForTimeout(1500);
  for (let k = 0; k < 30 && (await page.evaluate('window.__g.s.state')) !== 'menu'; k++) await hit('Enter', 250);
  await check('sprouts_menu');
  await E(`(()=>{meta.tix=20;state='caps';capS={ph:'idle',t:0,it:null}})()`); await check('caps_idle');
  await E(`(()=>{capS={ph:'show',t:1,it:{k:'rd',i:9}};meta.own.rd.push(9)})()`); await check('caps_show_rd_king');
  await E(`(()=>{capS={ph:'show',t:1,it:{k:'rd',i:8}}})()`); await check('caps_show_rd_marcus');
  await E(`(()=>{capS={ph:'show',t:1,it:{k:'rd',i:0}}})()`); await check('caps_show_rd_lantern');
  await E(`(()=>{capS={ph:'show',t:1,it:{k:'cap',i:5}}})()`); await check('caps_show_style');
  await E(`(()=>{capS={ph:'idle',t:0,it:null};state='settings';setFrom='menu';seti=2})()`); await check('sprouts_settings_reset');
  await hit('KeyZ', 200); await check('sprouts_settings_armed');
  await hit('KeyZ', 200); await check('sprouts_settings_done');
  await E(`state='settings';seti=3`); await hit('KeyZ', 200);
  await E(`(()=>{state='menu'})()`); await hit('ArrowUp',100);
  // swap to Rootdeep
  await E(`eject()`);
  await page.evaluate(`document.querySelector('.cart[data-i="2"]').dispatchEvent(new PointerEvent('pointerdown',{bubbles:true}))`); await page.waitForTimeout(1500);
  for (let k = 0; k < 6 && (await page.evaluate('window.__g.s.state')) !== 'g3title'; k++) await hit('Enter', 250);
  await check('rd_title');
  await E(`(()=>{menuSel=0;state='g3menu'})()`); await check('rd_menu');
  for (let i = 0; i < 4; i++) { await E(`(()=>{startCine('hub','intro');rdCineIx=${i};rdCineT=0})()`); await check('cine_intro_' + i);
    await E(`rdCineT=rdCineSeq[${i}].d-.05`); await check('cine_intro_' + i + '_last'); }
  await E(`window.__g.RDF().start()`); await check('hub');
  for (const who of ['ERIN', 'MARCUS', 'SCOUT', 'RANGER', 'LOUIE']) { await E(`window.__g.RDF().talk('${who}')`); await check('talk_' + who); }
  await E(`window.__g.RDF().start()`);
  await E(`(()=>{const RD=window.__g.RD();RD.dew=999;RD.keys=9;RD.honey=9;RD.stats.escapes=1})()`);
  for (const id of ['mirror', 'arm', 'keep', 'heat', 'set']) { await E(`(()=>{uiSel=0;heatSel=0;window.__g.RDF().open('${id}')})()`); for (let s2 = 0; s2 < 8; s2++) { await E(`uiSel=${s2};heatSel=${Math.min(4, s2)}`); await check(id + '_' + s2, { wait: 90 }); } }
  for (let pg = 0; pg < 4; pg++) { await E(`(()=>{codexPage=${pg};window.__g.RDF().open('codex')})()`); await check('codex_' + pg); }
  for (let pg = 0; pg < 2; pg++) for (let s2 = 0; s2 < 8; s2++) { await E(`(()=>{sprPage=${pg};uiSel=${s2};window.__g.RDF().open('sprouts')})()`); await check('ledger_' + pg + '_' + s2, { wait: 90 }); }
  await E(`(()=>{const RD=window.__g.RD();RD.gift.ERIN=0;RD.stats.budsBanked=3;RD.stats.deaths=2;RD.stats.fullString=0;window.__g.RDF().open('chars')})()`);
  for (let s2 = 0; s2 < 5; s2++) { await E(`uiSel=${s2}`); await check('chars_locked_' + s2, { wait: 90 }); }
  await E(`(()=>{const RD=window.__g.RD();RD.gift.ERIN=3;RD.stats.budsBanked=20;RD.stats.deaths=8;RD.stats.fullString=1;RD.flags.cine_king=1})()`);
  for (let s2 = 0; s2 < 5; s2++) { await E(`uiSel=${s2}`); await check('chars_open_' + s2, { wait: 90 }); }
  for (const ch of ['WILL', 'KING']) {
    await E(`(()=>{window.__g.RD().char='${ch}';window.__g.RDF().depart()})()`); await page.waitForTimeout(300); await check('run_ch1_' + ch);
    await E(`window.__g.RDF().clearRoom()`); await page.waitForTimeout(900); await check('run_doors_' + ch);
    for (const god of ['EMBER', 'PEB', 'DEW', 'ZIP', 'LEAF', 'LUCKY']) { await E(`window.__g.RDF().forceBoon('${god}')`); for (let s2 = 0; s2 < 3; s2++) { await E(`uiSel=${s2}`); await check('boon_' + god + '_' + s2 + '_' + ch, { wait: 80 }); } }
    await E(`(()=>{window.__g.RDF().forceShop()})()`); for (let s2 = 0; s2 < 4; s2++) { await E(`uiSel=${s2}`); await check('shop_' + s2, { wait: 80 }); }
    await E(`(()=>{state='g3run';pauseSel=0;pausePage=0;state='g3pause'})()`); await check('pause_' + ch); await E(`pausePage=1`); await check('pause_build_' + ch);
    await E(`(()=>{pausePage=0;state='g3run';window.__g.RDF().superFill()})()`); await hit('KeyX', 30); await page.waitForTimeout(200); await check('cutin_' + ch, { wait: 30 });
    await page.waitForTimeout(900);
  }
  for (const b of [0, 1, 2]) { await E(`window.__g.RDF().goto(${4 * (b + 1)})`); await page.waitForTimeout(150); 
    await E(`(()=>{if(window.__g.s.state!=='g3cine')startCine('run','boss${b}');rdCineIx=0;rdCineT=2})()`); await check('cine_boss' + b + '_a');
    await E(`(()=>{rdCineT=4})()`); await check('cine_boss' + b + '_b'); await E(`(()=>{rdCineIx=1;rdCineT=2})()`); await check('cine_boss' + b + '_c');
    await E(`endCine()`); await page.waitForTimeout(300); await check('boss_fight_' + b); }
  for (const k of ['escape', 'king']) for (let i = 0; i < 2; i++) for (const t of [1, 4]) { await E(`(()=>{startCine('hub','${k}');rdCineIx=${i};rdCineT=${t}})()`); await check(`cine_${k}_${i}_${t}`); }
  await E(`(()=>{window.__g.RDF().start();window.__g.RDF().depart();window.__g.RDF().hurt(9999)})()`); await page.waitForTimeout(1200); await check('dying'); await E('rdDieFinish()'); await page.waitForTimeout(1200); await check('over'); await E(`state='g3menu';menuSel=0;newArm=0`); await check('menu_full'); await E(`menuSel=1;newArm=1`); await check('menu_newarm'); await E(`capR={ph:'idle',t:0,it:null,msg:'',msgT:0};state='g3caps'`); await check('caps'); await E(`capR={ph:'show',t:1,it:{k:'rd',i:8},msg:'',msgT:0}`); await check('caps_show'); await E(`RD.lastRun={chamber:7,kills:80,dew:40,petals:0,heat:2,spr:4,sub:'THE GRUB MOTHER ATE WELL TONIGHT',msgs:['NEW DEEPEST: CHAMBER 7','100 FOES FELLED, EVER','25 SPROUTS FOUND, EVER  +13 DEW']};state='g3over';overT=3`); await check('over_full');
  await E(`(()=>{state='g3win';overT=3})()`); await check('win');
  await E(`RUN=null;hubEnter();eject()`); await page.waitForTimeout(300);
  await E(`lanOpen('off')`); await check('lan_menu');
  for (let pg = 0; pg < 4; pg++) { await E(`lanPage=${pg};state='lanstats'`); await check('lan_stats_' + pg); }
  for (let s2 = 0; s2 < 14; s2 += 4) { await E(`uiSel=${s2};state='lanach'`); await check('lan_ach_' + s2, { wait: 90 }); }
  await E(`capR={ph:'idle',t:0,it:null,msg:'',msgT:0};state='lancaps'`); await check('lan_caps');
  await page.evaluate(`document.querySelector('.cart[data-i="2"]').dispatchEvent(new PointerEvent('pointerdown',{bubbles:true}))`); await page.waitForTimeout(1500);
  for (const k of ['WILL','ERIN','LOUIE','MARCUS','KING']) { await E(`RD.char='${k}';startCine('mirror','burrow');rdCineIx=0;rdCineT=3`); await check('burrow_' + k); }
  await E(`RD.char='WILL';rdStartRun();state='g3run';RUN.surfN=3;RUN.surfT=[0,2,4]`);
  for (const k of ['WILL','ERIN','LOUIE','MARCUS','KING']) { await E(`RUN.char='${k}';startCine('run','surface');rdCineIx=0;rdCineT=2.5`); await check('surface_' + k); }
  await E(`state='g3mirror';uiSel=0`); await check('burrow_screen');
  for (const k of ['WILL','ERIN','LOUIE','MARCUS','KING']) { await E(`RUN.char='${k}';RD.stats.runs=3;rdDescPick();startCine('run','descend');rdCineT=1.2`); await check('descend_' + k); await E('rdCineT=RDCINES.descend[0].d-.5'); await check('descend_fall_' + k); }
  await E(`RD.stats.runs=1;RUN.char='WILL';rdDescPick();startCine('run','descend');rdCineT=4`); await check('descend_first');
  for (const n of [0,1,5]) { await E(`RUN.chamber=5;RUN.surfN=${n};RUN.surfT=[0,1,2,3,4].slice(0,${n});RD.flags.surf_told=0;rdQueueDrop();RUN.cineQ=[];RUN.chamber=6;startCine('run','drop');rdCineT=1.5`); await check('drop_' + n); await E('rdCineT=RDCINES.drop[0].d-.4'); await check('drop_card_' + n); }
  await E(`RUN.chamber=8;RUN.surfN=2;RD.flags.surf_told=1;rdQueueDrop();RUN.cineQ=[];startCine('run','drop');rdCineT=3`); await check('drop_told');
  for (const p of [0,1,2,3]) { await E(`LAN.capTut=1;capR={ph:'idle',t:0,it:null,msg:'',msgT:0,pg:${p}};state='lancaps'`); await check('caps_pg' + p); }
  for (const t of [0,1,2]) { await E(`capR={ph:'idle',t:0,it:null,msg:'',msgT:0,pg:1,tut:${t}};state='lancaps'`); await check('caps_tut' + t); }
  await E(`RUN=null;hubEnter();hpSel=0;hpArm=0;state='g3hpause'`); await check('hpause');
  for (const a of [1,2]) { await E(`hpSel=4;hpArm=${a}`); await check('hpause_arm' + a); }
  await E(`state='g3hub';rdSavedT=1`); await check('hub_saved');
  for (const a of ['met_ERIN','e_fall','e_ledger','r_escape','m_caps','l_unlock']) { await E(`hubEnter();rdApproach(RDAPPR.find(x=>x.id==='${a}'));rdAppr.t=9`); await page.waitForTimeout(80); for (let i = 0; i < 5; i++) { await check('appr_' + a + '_' + i); await E(`if(state==='g3talk'){talkLine++;const L=rdTalkL;if(talkStart+talkLine<L.length)talkTxt=rdLn(L[talkLine])}`); } }
  console.log('screens checked:', n);
  for (const [nm, out] of issues) { console.log('\n## ' + nm); for (const o of [...new Set(out)]) console.log('   ' + o); }
  console.log('\nERRORS:', errs.length ? '\n  ' + errs.join('\n  ') : 'none');
  await browser.close();
})().catch(e => { console.error('HARNESS FAIL', e.message, e.stack); process.exit(1); });
