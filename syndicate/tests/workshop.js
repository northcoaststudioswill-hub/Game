// the Workshop: the owner edits a character, confirms, and the game changes; the edit comes back on the next load; a
// non-owner never sees the Workshop; "Put back" restores the original; a Ledger fighter's colours change in their record
const { chromium } = require('playwright');
const fake = ([store, owner]) => { window.__store = store; const doc = p => ({ get: async () => { const v = window.__store[p]; return { exists: v != null, data: () => v ? JSON.parse(JSON.stringify(v)) : undefined }; }, set: async d => { if (!window.__owner) { const e = new Error('no'); e.code = 'invalid_argument'; throw e; } window.__store[p] = JSON.parse(JSON.stringify(d)); } });
  window.__owner = owner; window.claude = { use: async n => n === 'db' ? { collection: c => ({ doc: id => doc(c + '/' + id) }), doc } : n === 'user' ? { id: async () => 'u1', isOwner: async () => owner } : null }; };
(async () => { const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] }); const errs = []; const R = {};
  const open = async (store, owner, host) => { const ctx = await b.newContext({ viewport: { width: 1100, height: 700 } }); const p = await ctx.newPage(); p.on('pageerror', e => errs.push(e.message)); await p.addInitScript(fake, [store, owner]);
    await p.goto('http://' + (host || 'localhost') + ':8765/index.html'); for (let i = 0; i < 20; i++) { await p.waitForTimeout(300); if (await p.evaluate(() => { if (window.G) { G.bootSkip && G.bootSkip(); G.bootSkip && G.bootSkip(); G.muted = true; } return !!document.getElementById('bNew'); })) break; } await p.waitForTimeout(800); return { p, ctx }; };
  // owner on the published host: a Workshop button on the title
  let A = await open({}, true, '127.0.0.1'); await A.p.evaluate(() => G.ui.title()); R.button = await A.p.evaluate(() => !!document.getElementById('bShop'));
  await A.p.evaluate(() => document.getElementById('bShop').click()); await A.p.waitForTimeout(800);
  R.listed = await A.p.evaluate(() => document.querySelectorAll('#workshop .ws-i').length);
  R.marcHub = await A.p.evaluate(() => { const hub = G.world.get('hub'); let n = 0; hub.scene.traverse(o => { if (o.isMesh) n++; }); return n > 0; });
  await A.p.screenshot({ path: 'workshop_open.png' });
  // change Marc's cloth and save through the confirmation
  R.saved = await A.p.evaluate(async () => { const i = document.querySelector('#workshop [data-c=cloth]'); i.value = '#11aa33'; i.dispatchEvent(new Event('input')); i.dispatchEvent(new Event('change'));
    document.querySelector('#workshop .ws-save').click(); const rows = [...document.querySelectorAll('#workshop .ws-diff li')].map(l => l.textContent); document.querySelector('#workshop .ws-yes').click(); await new Promise(r => setTimeout(r, 300));
    return { rows, stored: window.__store['edits/looks'] && window.__store['edits/looks'].looks.marc, msg: (document.querySelector('#workshop .ws-modal p') || {}).textContent }; });
  await A.p.screenshot({ path: 'workshop_saved.png' });
  // a Ledger fighter: Hesper's armour
  R.fighter = await A.p.evaluate(async () => { document.querySelector('#workshop .ws-modal button') && document.querySelector('#workshop .ws-modal button').click(); const reg = G.registry(), i = reg.findIndex(r => r.id === 'fighter:vexa'); const pk = document.querySelector('#workshop .ws-pick'); pk.value = String(i); pk.dispatchEvent(new Event('change'));
    const c = document.querySelector('#workshop [data-c=armor]'); c.value = '#aa1122'; c.dispatchEvent(new Event('input')); c.dispatchEvent(new Event('change')); document.querySelector('#workshop .ws-save').click(); document.querySelector('#workshop .ws-yes').click(); await new Promise(r => setTimeout(r, 300));
    return { vexaArmor: (G.OPPONENTS.find(o => o.id === 'vexa') || {}).tint.armor, hasSkin: !!document.querySelector('#workshop [data-c=skin]') }; });
  const store = await A.p.evaluate(() => window.__store); await A.ctx.close();
  // next load: Marc in the market is built with the saved cloth
  let B = await open(store, false); R.reload = await B.p.evaluate(() => { const hub = G.world.get('hub'); let found = false; hub.scene.traverse(o => { if (o.isMesh && o.material && o.material.color && o.material.color.getHexString && o.material.color.getHexString() === '11aa33') found = true; }); return { marcGreen: found, vexa: G.OPPONENTS.find(o => o.id === 'vexa').tint.armor, button: (G.ui.title(), !!document.getElementById('bShop')) }; });
  await B.ctx.close();
  // put Marc back
  let C = await open(store, true, '127.0.0.1'); R.revert = await C.p.evaluate(async () => { G.ui.workshop(); await new Promise(r => setTimeout(r, 300)); document.querySelector('#workshop .ws-revert').click(); document.querySelector('#workshop .ws-yes').click(); await new Promise(r => setTimeout(r, 300)); return !window.__store['edits/looks'].looks.marc; }); await C.ctx.close();
  console.log(JSON.stringify(R, null, 1));
  const ok = R.button && R.listed > 40 && R.saved.rows.some(r => /Cloth/.test(r)) && R.saved.stored && R.saved.stored.tint.cloth === '#11aa33' && /Saved/.test(R.saved.msg) && R.fighter.vexaArmor === '#aa1122' && !R.fighter.hasSkin && R.reload.marcGreen && R.reload.vexa === '#aa1122' && !R.reload.button && R.revert;
  console.log(ok ? 'PASS' : 'FAIL', 'ERRORS', errs.length, errs.slice(0, 3).join(' | ')); await b.close(); process.exit(ok && !errs.length ? 0 : 1); })();
