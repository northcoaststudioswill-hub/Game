// the game has no Workshop, for anyone, and applies edits approved into js/look_edits.js; the Workshop is a separate page
// (workshop.html) that opens straight into the editor, saves to its own store, and lists what has not reached the game
const { chromium } = require('playwright');
const fake = ([store, owner]) => { window.__store = store; const doc = p => ({ get: async () => { const v = window.__store[p]; return { exists: v != null, data: () => v ? JSON.parse(JSON.stringify(v)) : undefined }; }, set: async d => { if (!window.__owner) { const e = new Error('no'); e.code = 'invalid_argument'; throw e; } window.__store[p] = JSON.parse(JSON.stringify(d)); } });
  window.__owner = owner; window.claude = { use: async n => n === 'db' ? { collection: c => ({ doc: id => doc(c + '/' + id) }), doc } : n === 'user' ? { id: async () => 'u1', isOwner: async () => owner } : null }; };
(async () => { const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] }); const errs = []; const R = {};
  const page = async (file, store, owner, baked) => { const ctx = await b.newContext({ viewport: { width: 1100, height: 700 } }); const p = await ctx.newPage(); p.on('pageerror', e => errs.push(file + ': ' + e.message)); await p.addInitScript(fake, [store, owner]);
    if (baked) await p.route('**/js/look_edits.js', r => r.fulfill({ contentType: 'application/javascript', body: 'window.G = window.G || {}; window.G.BAKED_LOOKS = ' + JSON.stringify(baked) + ';' }));
    await p.goto('http://localhost:8765/' + file); await p.waitForTimeout(2500); return { p, ctx }; };
  // the game, opened by the owner: no Workshop anywhere, and an approved edit shows on Marc and on Vexa
  let A = await page('index.html', {}, true, { marc: { tint: { cloth: '#11aa33' }, adj: { hat: { y: 0.2, s: 0.6 } } }, 'fighter:vexa': { tint: { armor: '#aa1122' }, adj: { gear: { y: 0.15 } } } });
  R.game = await A.p.evaluate(() => { G.bootSkip && G.bootSkip(); G.bootSkip && G.bootSkip(); G.ui.title(); const hub = G.world.get('hub'); let green = false; hub.scene.traverse(o => { if (o.isMesh && o.material && o.material.color && o.material.color.getHexString() === '11aa33') green = true; });
    const marcC = G.makeChar(G.mark.look); let hatG = null; marcC.root.traverse(o => { if (o.name === 'hat') hatG = o; });
    const st = G.state; st.hero = G.newHero('T', 'human', 'fighter'); Object.assign(st, { kitPicked: 1, toured: 1, tourAsked: 1, firstPath: 9, shownPlaces: { a: 1 } }); G.fight.start(G.OPPONENTS.find(o => o.id === 'vexa')); let vg = null; G.fight.E.vis.c.root.traverse(o => { if (o.name === 'gear') vg = o; }); const vexaGearY = vg && +vg.position.y.toFixed(2); G.fight.active = false;
    return { vexaGearY, hatY: hatG && +hatG.position.y.toFixed(2), hatS: hatG && +hatG.scale.x.toFixed(2), button: !!document.getElementById('bShop') || /Workshop/.test(document.body.innerText), editor: !!document.getElementById('workshop') || !!G.workshop || !!(G.ui && G.ui.workshop), marcGreen: green, vexa: G.OPPONENTS.find(o => o.id === 'vexa').tint.armor }; });
  await A.ctx.close();
  // the Workshop page, owner: opens on its own, shows the game's approved edit, saves to its own store, lists what is waiting
  let B = await page('workshop.html', {}, true, { marc: { tint: { cloth: '#11aa33' } } });
  R.ws = await B.p.evaluate(async () => { await new Promise(r => setTimeout(r, 600)); const open = !!document.getElementById('workshop'); const pk = document.querySelector('#workshop .ws-pick'); const reg = G.registry(); pk.value = String(reg.findIndex(r => r.id === 'marc')); pk.dispatchEvent(new Event('change'));
    const shown = document.querySelector('#workshop [data-c=cloth]').value, waitBefore = document.querySelector('#workshop .ws-wait').textContent;
    const c = document.querySelector('#workshop [data-c=hair]'); c.value = '#ffffff'; c.dispatchEvent(new Event('input')); c.dispatchEvent(new Event('change')); document.querySelector('#workshop .ws-save').click(); document.querySelector('#workshop .ws-yes').click(); await new Promise(r => setTimeout(r, 400));
    return { open, shown, waitBefore, saved: window.__store['edits/looks'] && window.__store['edits/looks'].looks.marc, msg: (document.querySelector('#workshop .ws-modal p') || {}).textContent, waitAfter: document.querySelector('#workshop .ws-wait').textContent, gameDrawn: G.gfx.render.toString().length < 20 }; });
  await B.p.screenshot({ path: 'workshop_sep.png' }); await B.ctx.close();
  // the Workshop page, not the owner: Save is off
  let C = await page('workshop.html', {}, false); R.other = await C.p.evaluate(async () => { await new Promise(r => setTimeout(r, 600)); const s = document.querySelector('#workshop .ws-save'); return s ? s.disabled : 'no editor'; }); await C.ctx.close();
  console.log(JSON.stringify(R, null, 1));
  const ok = !R.game.button && !R.game.editor && R.game.marcGreen && R.game.vexa === '#aa1122' && R.game.hatY === 0.2 && R.game.hatS === 0.6 && R.game.vexaGearY === 0.15 && R.ws.open && R.ws.shown === '#11aa33' && /Everything saved here is in the game/.test(R.ws.waitBefore) && R.ws.saved && R.ws.saved.tint.hair === '#ffffff' && R.ws.saved.tint.cloth === '#11aa33' && /Saved in the Workshop/.test(R.ws.msg) && /1 waiting/.test(R.ws.waitAfter) && R.ws.gameDrawn && R.other === true;
  console.log(ok ? 'PASS' : 'FAIL', 'ERRORS', errs.length, errs.slice(0, 3).join(' | ')); await b.close(); process.exit(ok && !errs.length ? 0 : 1); })();
