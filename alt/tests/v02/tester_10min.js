/* Rootdeep: a 10-minute scripted playtest on the main-line (alt) build.
   Run from the repo root:  node alt/tests/v02/tester_10min.js [build.html] [minutes]
   Plays like a player with real key presses: watches the intro, reads every walk-up and talk topic, spends Moondew at the
   Sprout Digs, takes sprouts from the Ledger, uses the Hearth menu and the run pause menu, saves and continues, switches
   keepers when they unlock, fights, takes doors, buys in shops. It logs anything that looks wrong (page errors, stalls,
   foes outside the room, a cleared room that doesn't open, bad numbers, slow frames) and takes screenshots.
   Output: alt/tests/v02/out/tester_10min/ (log.json, shots). */
const { chromium } = require('playwright');
const path = require('path'), fs = require('fs');
const BUILD = path.resolve(process.argv[2] || path.join(__dirname, '..', '..', 'games', 'pocket-lantern-alt.html'));
const MIN = +(process.argv[3] || 10);
const OUT = path.join(__dirname, 'out', 'tester_10min') + '/'; fs.mkdirSync(OUT, { recursive: true });
(async () => {
  const browser = await chromium.launch(fs.existsSync('/opt/pw-browsers/chromium') ? { executablePath: '/opt/pw-browsers/chromium', args: ['--no-sandbox'] } : {});
  const page = await browser.newPage({ viewport: { width: 440, height: 956 }, deviceScaleFactor: 1 });
  const log = { errors: [], issues: [], talk: [], runs: [], events: [], shots: [] };
  const T0 = Date.now(), el = () => +((Date.now() - T0) / 1000).toFixed(1);
  const issue = (k, d) => { if (log.issues.filter(i => i.k === k).length < 6) { log.issues.push({ t: el(), k, d }); console.log('ISSUE', el(), k, d) } };
  page.on('pageerror', e => { log.errors.push(el() + ' ' + e.message + ' @ ' + (e.stack || '').split('\n')[1]); console.log('PAGEERROR', e.message) });
  page.on('console', m => { if (m.type() === 'error' && !/ERR_FILE_NOT_FOUND|net::/.test(m.text())) log.errors.push(el() + ' console: ' + m.text()) });
  await page.goto('file://' + BUILD + '?dev', { waitUntil: 'load' }); await page.waitForTimeout(1500);
  const E = c => page.evaluate(c => window.__g.ev(c), c);
  const J = async c => JSON.parse(await E('JSON.stringify(' + c + ')'));
  const down = new Set();
  const hold = async (k, on) => { if (on && !down.has(k)) { await page.keyboard.down(k); down.add(k) } else if (!on && down.has(k)) { await page.keyboard.up(k); down.delete(k) } };
  const release = async () => { for (const k of [...down]) await hold(k, false) };
  const tap = async (k, ms = 50) => { await release(); await page.keyboard.down(k); await page.waitForTimeout(ms); await page.keyboard.up(k); await page.waitForTimeout(60) };
  const cv = await page.$('canvas');
  const shot = async nm => { const f = String(log.shots.length).padStart(3, '0') + '_' + nm.replace(/[^a-z0-9_]+/gi, '_') + '.png'; log.shots.push({ t: el(), f }); await cv.screenshot({ path: OUT + f }) };
  await page.evaluate(() => { window.__ft = []; let l = performance.now(); const f = t => { window.__ft.push(t - l); l = t; if (window.__ft.length > 40000) window.__ft.shift(); requestAnimationFrame(f) }; requestAnimationFrame(f) });
  // put the Rootdeep cartridge in, with a fresh save
  await page.evaluate(`document.querySelector('.cart[data-i="2"]').dispatchEvent(new PointerEvent('pointerdown',{bubbles:true}))`); await page.waitForTimeout(3500);
  for (let i = 0; i < 10 && !String(await E('state')).startsWith('g3'); i++) { await tap('KeyZ'); await page.waitForTimeout(600) }
  await E(`Object.assign(RD,RDDEF());RD.set={mus:7,sfx:8,shake:true};rdSave();state='g3title'`); await page.waitForTimeout(300);
  await shot('title');
  // the agenda: things a curious player tries once
  const did = {}; let runN = 0, run = null, lastState = '', stateT = Date.now(), sig = '', sigT = Date.now(), cineSeen = {}, lastShot = 0;
  let hubPlan = null, hubPlanT = 0, emptyFightT = 0, lastTalk = '', podKey = '', podT = 0, skipPods = new Set(), stuckN = 0, lastP = [0, 0];
  const walkTo = async (tx, ty, s) => { const dx = tx - s.x, dy = ty - s.y; await hold('ArrowRight', dx > 3); await hold('ArrowLeft', dx < -3); await hold('ArrowDown', dy > 3); await hold('ArrowUp', dy < -3); return Math.abs(dx) <= 3 && Math.abs(dy) <= 3 };
  while (Date.now() - T0 < MIN * 60e3) {
    let st; try { st = await E('state') } catch (e) { issue('eval', e.message); break }
    if (st !== lastState) { log.events.push([el(), st]); lastState = st; stateT = Date.now() }
    // stall watch: nothing about the game changed for 25s
    const sg = await E(`state+'|'+(RUN?RUN.chamber+'|'+RUN.phase+'|'+Math.round(P3.x)+','+Math.round(P3.y)+'|'+RUN.enemies.map(e=>Math.round(e.hp)).join(','):Math.round(P3.x)+','+Math.round(P3.y))+'|'+(typeof talkTxt!=='undefined'?talkTxt:'')+'|'+(typeof uiSel!=='undefined'?uiSel:'')`);
    if (sg !== sig) { sig = sg; sigT = Date.now() } else if (Date.now() - sigT > 25000) { issue('stall', st + ' ' + sg.slice(0, 120) + (st === 'g3run' ? ' ' + await E(`JSON.stringify({p:[Math.round(P3.x),Math.round(P3.y)],pods:RUN.pods.map(q=>[Math.round(q.x),Math.round(q.y)]),doors:RUN.doors.map(d=>[d.x,d.y]),obst:RUN.obst.map(o=>[o.x,o.y,o.w,o.h])})`) : '')); await shot('stall_' + st); await tap('KeyX'); await tap('Enter'); sigT = Date.now() }
    if (Date.now() - lastShot > 30000 && st !== 'g3cine') { lastShot = Date.now(); await shot('every30s_' + st) }
    if (st === 'g3title') { await tap('KeyZ'); await page.waitForTimeout(300); continue }
    if (st === 'g3menu') { const it = await J('rdMenuItems()'); const want = it.indexOf('CONTINUE') >= 0 ? 'CONTINUE' : 'NEW GAME'; await E(`menuSel=${it.indexOf(want)}`); await tap('KeyZ'); log.events.push([el(), 'menu ' + want]); await page.waitForTimeout(400); continue }
    if (st === 'g3cine') { const k = await E('rdCineKey'); if (!cineSeen[k]) { cineSeen[k] = 1; await page.waitForTimeout(900); await shot('cine_' + k) }
      // watch scenes the first time; after that, read at a brisk pace
      await page.waitForTimeout(cineSeen[k] > 3 ? 300 : 1200); cineSeen[k]++; if (cineSeen[k] > 3) await tap('KeyZ'); continue }
    if (st === 'g3appr') { if (!did['appr_' + (await E('rdAppr&&rdAppr.a.id'))]) { did['appr_' + (await E('rdAppr&&rdAppr.a.id'))] = 1; await page.waitForTimeout(800); await shot('walkup') } await page.waitForTimeout(300); continue }
    if (st === 'g3talk') { const t = await J('[talkNPC,talkTxt]'); if (t[1] !== lastTalk) { lastTalk = t[1]; log.talk.push([el(), t[0], t[1]]) } await page.waitForTimeout(700); await tap('KeyZ'); continue }
    if (st === 'g3hpause') { if (!did.hsave) { did.hsave = 1; await shot('hearth_menu'); await E('hpSel=1'); await tap('KeyZ'); await page.waitForTimeout(300); const sv = await E('rdSavedT>0'); if (!sv) issue('save', 'SAVE GAME showed no SAVED mark'); }
      await tap('KeyX'); continue }
    if (st === 'g3mirror') { const r = await J(`MIRROR.map((m,i)=>({i,r:mir(m.id),max:m.max,c:m.cost[mir(m.id)]})).filter(m=>m.r<m.max&&m.c<=RD.dew).sort((a,b)=>a.c-b.c)`);
      if (r.length) { const before = await E('RD.dew'); await E(`uiSel=${r[0].i}`); await tap('KeyZ'); const after = await E('RD.dew'); log.events.push([el(), 'digs bought #' + r[0].i + ' for ' + (before - after)]); if (after !== before - r[0].c) issue('digs', 'paid ' + (before - after) + ' expected ' + r[0].c) }
      else { if (!did.digsShot) { did.digsShot = 1; await shot('digs') } await tap('KeyX') } continue }
    if (st === 'g3sprouts') { const s = await J('{party:RD.party.length,bank:RD.bank}'); const types = Object.keys(s.bank).filter(k => s.bank[k] > 0);
      if (s.party < 3 && types.length) { if (!did.ledgerShot) { did.ledgerShot = 1; await shot('ledger') } await E(`sprPage=0;uiSel=${types[(Math.random() * types.length) | 0]}`); await tap('KeyZ');
        if ((await E('RD.party.length')) === s.party) { await tap('KeyX') } }
      else await tap('KeyX'); continue }
    if (st === 'g3chars') { const u = await J('CHARS.map((c,i)=>charUnlocked(c.id)?i:-1).filter(i=>i>=0)'); await E(`uiSel=${u[runN % u.length]}`); if (!did.chars) { did.chars = 1; await shot('chars') } await tap('KeyZ'); continue }
    if (st === 'g3arm' || st === 'g3keep' || st === 'g3codex' || st === 'g3heat' || st === 'g3set') { if (!did['s_' + st]) { did['s_' + st] = 1; await shot(st) }
      if (st === 'g3keep') { const has = await J('KEEPS.map((k,i)=>RD.keeps[k.id]?i:-1).filter(i=>i>=0)'); if (has.length && !(await E('RD.keepEq'))) { await E(`uiSel=${has[0]}`); await tap('KeyZ') } }
      if (st === 'g3arm') { const can = await J(`Object.keys(WEAPONS).map((id,i)=>!rdOwnsWeapon(id)&&RD.keys>=WEAPONS[id].cost?i:-1).filter(i=>i>=0)`); if (can.length) { await E(`uiSel=${can[0]}`); await tap('KeyZ'); log.events.push([el(), 'bought weapon']) } }
      await tap('KeyX'); continue }
    if (st === 'lancaps' || st === 'lan' || st === 'lanstats' || st === 'lanach') { if (!did['s_' + st]) { did['s_' + st] = 1; await shot(st) } await tap('KeyZ'); await tap('KeyX'); continue }
    if (st === 'g3hub') {
      // pick the next thing to do in the Hearth
      if (!hubPlan || Date.now() - hubPlanT > 15000) {
        const h = await J(`{dew:RD.dew,keys:RD.keys,buy:MIRROR.some(m=>mir(m.id)<m.max&&m.cost[mir(m.id)]<=RD.dew),party:RD.party.length,bank:Object.values(RD.bank).reduce((a,b)=>a+b,0),
          topic:NPCS.filter(w=>HUBNPC[w]&&rdTopic(w)),arm:Object.keys(WEAPONS).some(id=>!rdOwnsWeapon(id)&&RD.keys>=WEAPONS[id].cost),keep:KEEPS.some(k=>RD.keeps[k.id])&&!RD.keepEq,esc:RD.stats.escapes}`);
        if (hubPlan && Date.now() - hubPlanT > 15000) issue('hub_nav', 'could not reach ' + JSON.stringify(hubPlan));
        hubPlan = !did.hpause ? { k: 'start' } : h.topic.length ? { k: 'npc', who: h.topic[0] } : h.buy ? { k: 'st', id: 'mirror' } : h.arm ? { k: 'st', id: 'arm' } : h.keep ? { k: 'st', id: 'keep' }
          : (h.party < 3 && h.bank > h.party) ? { k: 'sprouts' } : !did.codex ? { k: 'st', id: 'codex' } : { k: 'descend' };
        hubPlanT = Date.now()
      }
      if (hubPlan.k === 'start') { did.hpause = 1; await tap('Enter'); hubPlan = null; continue }
      const s = await J(`{x:P3.x,y:P3.y,t:(()=>{const t=hubTarget();return t?(t.kind+':'+(t.id||t.who||'')):''})(),W,H,bed:hubL().bedY+16,npc:${hubPlan.who ? `[HUBNPC['${hubPlan.who}'].x,HUBNPC['${hubPlan.who}'].y]` : 'null'}}`);
      const want = hubPlan.k === 'npc' ? 'npc:' + hubPlan.who : hubPlan.k === 'st' ? 'station:' + hubPlan.id : hubPlan.k === 'sprouts' ? 'sprouts:' : 'descend:';
      if (s.t === want) { await release(); await tap('KeyZ'); if (hubPlan.id === 'codex') did.codex = 1; if (hubPlan.k === 'descend') { runN++; log.events.push([el(), 'went down, run ' + runN]) } hubPlan = null; await page.waitForTimeout(250); continue }
      const tgt = hubPlan.k === 'npc' ? s.npc : hubPlan.k === 'st' ? [(await J('STATIONS')).find(q => q.id === hubPlan.id).x, 72] : hubPlan.k === 'sprouts' ? [41, s.bed] : [s.W / 2, s.H - 13];
      await walkTo(tgt[0], tgt[1], s); await page.waitForTimeout(60); continue }
    if (st === 'g3boon') { const n = await E('boonOffer.length'); await E(`uiSel=${(Math.random() * n) | 0}`); if (!did.boonShot) { did.boonShot = 1; await shot('boon') } await tap('KeyZ'); if (run) run.boons++; continue }
    if (st === 'g3shop') { const it = await J(`shopItems.map((s,i)=>!s.sold&&RUN.petals>=s.p?i:-1).filter(i=>i>=0)`); if (!did.shopShot) { did.shopShot = 1; await shot('shop') }
      if (it.length && Math.random() < .7) { const p0 = await E('RUN.petals'); await E(`uiSel=${it[0]}`); await tap('KeyZ'); if (run) run.bought++; if ((await E('state')) === 'g3shop' && !(await E(`shopItems[${it[0]}].sold`))) issue('shop', 'buying item ' + it[0] + ' did not go through') }
      else await tap('KeyX'); continue }
    if (st === 'g3pause') { if (!did.pauseShot) { did.pauseShot = 1; await shot('run_pause') }
      if (!did.saveQuit && runN >= 2) { did.saveQuit = 1; const ch = await E('RUN.chamber'); log.events.push([el(), 'save & quit in chamber ' + ch]); await E('pauseSel=3'); await tap('KeyZ'); await page.waitForTimeout(500); did.resumeCh = ch; continue }
      await tap('Enter'); continue }
    if (st === 'g3dying') { if (!did.dyingShot) { did.dyingShot = 1; await page.waitForTimeout(1500); await shot('dying') } await page.waitForTimeout(400); continue }
    if (st === 'g3over' || st === 'g3win') { await page.waitForTimeout(1200); await shot(st === 'g3over' ? 'death_screen' : 'escape');
      if (run) { run.end = st === 'g3over' ? await E('RD.lastRun&&RD.lastRun.sub') : 'ESCAPED'; run.dew = await E('RD.lastRun&&RD.lastRun.dew'); run.msgs = await J('(RD.lastRun&&RD.lastRun.msgs)||[]'); run.secs = el() - run.t; log.runs.push(run); console.log('RUN', JSON.stringify(run)); run = null }
      await tap('KeyZ'); await page.waitForTimeout(500); continue }
    if (st === 'g3run') {
      if (did.resumeCh && !did.resumeChecked) { did.resumeChecked = 1; const ch = await E('RUN.chamber'); if (ch !== did.resumeCh) issue('continue', 'saved in chamber ' + did.resumeCh + ', continued in ' + ch); else log.events.push([el(), 'continued in chamber ' + ch]) }
      const s = await J(`{x:P3.x,y:P3.y,hp:RUN.hp,mx:rdStats().maxHp,ch:RUN.chamber,ph:RUN.phase,k:RUN.char,f:RUN.enemies.map(e=>[e.x,e.y,e.kind,e.hp]),pods:(RUN.pods||[]).map(p=>[p.x,p.y]),doors:RUN.doors.map(d=>[d.x,d.y]),buds:RUN.buds.length,sup:RUN.sup||0,xc:RUN.xCd,yc:RUN.yCd,
        ints:(RUN.ints||[]).filter(i=>!i.done&&i.k!=='boom').map(i=>[i.x,i.y,i.k]),w2:!!(RUN.wave2&&RUN.wave2.length),W,H,top:RDA.top,side:RDA.side,bot:RDA.bot,pet:RUN.petals}`);
      if (!run || run.n !== runN) { skipPods = new Set(); run = { n: runN, keeper: s.k, t: el(), chambers: {}, boons: 0, bought: 0, hits: 0, maxBuds: 0, hp0: s.hp }; }
      run.chambers[s.ch] = (run.chambers[s.ch] || 0) + 1; run.maxBuds = Math.max(run.maxBuds, s.buds); if (s.hp < (run.lastHp || 1e9) - .5) run.hits++; run.lastHp = s.hp; run.deep = s.ch;
      // sanity checks a tester would notice
      if (!(s.hp >= 0) || s.hp > s.mx + .5) issue('hp', `hp ${s.hp} of ${s.mx}`);
      if (!(s.pet >= 0)) issue('petals', 'petals ' + s.pet);
      for (const f of s.f) if (!(f[3] > -1e6) || f[0] < 0 || f[0] > s.W || f[1] < 0 || f[1] > s.H) issue('foe_out', JSON.stringify(f) + ' ch ' + s.ch);
      if (s.ph === 'fight' && !s.f.length && !s.w2) { if (!emptyFightT) emptyFightT = Date.now(); else if (Date.now() - emptyFightT > 4000) { issue('no_clear', 'fight phase with no foes for 4s, ch ' + s.ch); emptyFightT = 0 } } else emptyFightT = 0;
      if (s.ph === 'doors' && !s.doors.length) issue('no_doors', 'doors phase, no doors, ch ' + s.ch);
      if (!did.runPause && runN >= 1 && s.ch === 2) { did.runPause = 1; await tap('Enter'); continue }
      if (runN >= 2 && !did.saveQuit && s.ch >= 2 && s.ph === 'fight') { await tap('Enter'); continue }
      let tx = null, ty = null, attack = false;
      const near = s.f.map(f => [f, Math.hypot(f[0] - s.x, f[1] - s.y)]).sort((a, b) => a[1] - b[1])[0];
      const pods = s.pods.filter(q => !skipPods.has(Math.round(q[0]) + ',' + Math.round(q[1])));
      if (pods.length) { const k = Math.round(pods[0][0]) + ',' + Math.round(pods[0][1]); if (k !== podKey) { podKey = k; podT = Date.now() } else if (Date.now() - podT > 5000) { skipPods.add(k); issue('pod_unreachable', 'pod ' + k + ' keeper ' + Math.round(s.x) + ',' + Math.round(s.y) + ' ch ' + s.ch + ' props ' + JSON.stringify(await J('RUN.obst.map(o=>[o.x,o.y,o.w,o.h,o.kind])'))); await shot('pod_unreachable') } }
      if (s.ph === 'doors') { const d = s.doors[runN % 2 ? 0 : s.doors.length - 1] || s.doors[0]; if (pods.length) { tx = pods[0][0]; ty = pods[0][1] } else if (d) { tx = d[0]; ty = d[1] + 6 } }
      else if (near) { const [f, d] = near; if (s.hp < s.mx * .3 && d < 40) { tx = s.x - (f[0] - s.x); ty = s.y - (f[1] - s.y); if (Math.random() < .3) { const k = tx > s.x ? 'ArrowRight' : 'ArrowLeft'; await tap(k, 30); await tap(k, 30) } }
        else { if (d > 22) { tx = f[0]; ty = f[1] } attack = d < 40 } }
      else if (pods.length) { tx = pods[0][0]; ty = pods[0][1] }
      else if (s.ints.length) { const it = s.ints[0]; tx = it[0]; ty = it[1]; if (Math.hypot(it[0] - s.x, it[1] - s.y) < 16) attack = true }
      if (tx !== null) { if (Math.hypot(s.x - lastP[0], s.y - lastP[1]) < .4) stuckN++; else stuckN = 0; lastP = [s.x, s.y];
        if (stuckN > 12) { await release(); const k = ['ArrowLeft', 'ArrowRight', 'ArrowDown', 'ArrowUp'][(Math.random() * 4) | 0]; await page.keyboard.down(k); await page.waitForTimeout(350); await page.keyboard.up(k); stuckN = 0; log.events.push([el(), 'stepped around something']) }
        else await walkTo(tx, ty, s) } else await release();
      if (attack) { await page.keyboard.down('KeyZ'); await page.waitForTimeout(40); await page.keyboard.up('KeyZ') }
      if (near && near[1] < 70) { if (s.xc <= 0 && Math.random() < .3) { await page.keyboard.press('KeyC') } else if (s.yc <= 0 && Math.random() < .25) { await page.keyboard.press('KeyV') } else if (s.sup >= 100) await page.keyboard.press('KeyX'); else if (Math.random() < .08) await page.keyboard.press('KeyX') }
      if (s.ch === 5 && !did.vault) { did.vault = 1; await shot('vault') } if (s.ch === 9 && !did.core) { did.core = 1; await shot('core') }
      await page.waitForTimeout(60); continue }
    // anything else
    if (!did['unk_' + st]) { did['unk_' + st] = 1; issue('unknown_state', st); await shot('unknown_' + st) }
    await tap('KeyX'); await page.waitForTimeout(300);
  }
  await release();
  if (run) { run.secs = el() - run.t; run.end = 'time up'; log.runs.push(run) }
  log.frame = await page.evaluate(() => { const a = window.__ft.slice(120).sort((x, y) => x - y); return { n: a.length, median: +a[a.length >> 1].toFixed(1), p95: +a[(a.length * .95) | 0].toFixed(1), p99: +a[(a.length * .99) | 0].toFixed(1), worst: +a[a.length - 1].toFixed(1) } });
  log.end = await J(`{stats:RD.stats,mirror:RD.mirror,dew:RD.dew,keys:RD.keys,bank:RD.bank,heard:Object.keys(RD.heard||{}),unlocked:CHARS.filter(c=>charUnlocked(c.id)).map(c=>c.id),flags:Object.keys(RD.flags)}`);
  log.minutes = MIN; log.secs = el();
  fs.writeFileSync(OUT + 'log.json', JSON.stringify(log, null, 1));
  console.log('SUMMARY', JSON.stringify({ secs: log.secs, runs: log.runs.length, issues: log.issues.length, errors: log.errors.length, frame: log.frame, talkLines: log.talk.length }));
  await browser.close();
})().catch(e => { console.error('HARNESS FAIL', e.stack); process.exit(1) });
