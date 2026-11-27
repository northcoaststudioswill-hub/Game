// saves are copied to the player's Claude account and come back when the device has lost them; an erase stays erased;
// a browser that refuses storage still continues from the account; with no account the game saves locally as before
const { chromium } = require('playwright');
const fake = store => { window.__store = store; const doc = p => ({ get: async () => { const v = window.__store[p]; return { exists: v != null, data: () => v ? JSON.parse(JSON.stringify(v)) : undefined }; }, set: async d => { window.__store[p] = JSON.parse(JSON.stringify(d)); } });
  window.claude = { use: async n => n === 'db' ? { collection: c => ({ doc: id => doc(c + '/' + id) }), doc } : n === 'user' ? { id: async () => 'u1' } : null }; window.requestAnimationFrame = () => 0; };
(async () => { const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] }); const errs = []; const R = {};
  const device = async (store, opts) => { const ctx = await b.newContext({ viewport: { width: 900, height: 600 } }); const p = await ctx.newPage(); p.on('pageerror', e => errs.push(e.message));
    if (store) await p.addInitScript(fake, store); else await p.addInitScript(() => { window.requestAnimationFrame = () => 0; });
    if (opts && opts.noStorage) await p.addInitScript(() => { Storage.prototype.setItem = function () { throw new Error('QuotaExceededError'); }; });
    await p.goto('http://localhost:8765/index.html'); await p.waitForTimeout(1200); await p.evaluate(() => { G.bootSkip && G.bootSkip(); G.bootSkip && G.bootSkip(); G.muted = true; }); await p.waitForTimeout(500); return { p, ctx }; };
  const make = p => p.evaluate(() => { G.setSlot(1); const st = G.state = G.newState(); st.hero = G.newHero('Vellis', 'elf', 'rogue'); st.kitPicked = 1; st.coin = 321; G.save(); });
  const wait = ms => new Promise(r => setTimeout(r, ms));
  // phone A makes a fighter; it reaches the account
  let A = await device({}); await make(A.p); await wait(1800); const store = await A.p.evaluate(() => window.__store); R.pushed = !!(store['data/users/u1/slot1'] && store['data/users/u1/slot1'].s); R.settings = await A.p.evaluate(() => { G.ui.settings(); return /Claude account/.test(document.querySelector('#panel').innerText); }); await A.ctx.close();
  // the same phone after it emptied its storage: the fighter comes back, Continue works
  let B = await device(store); R.restored = await B.p.evaluate(() => { const q = G.slotInfo(1); return q && q.hero.name; }); R.cont = await B.p.evaluate(() => { const c = document.getElementById('bCont'); if (!c) return 'no continue'; G.load(); return G.state.hero && G.state.coin; });
  R.toast = await B.p.evaluate(() => (document.getElementById('toast') || {}).textContent || ''); await B.ctx.close();
  // a browser that refuses all storage still continues from the account
  let D = await device(store, { noStorage: true }); R.noStorage = await D.p.evaluate(() => { const ok = G.load(); return ok && G.state.hero && G.state.hero.name; }); await D.ctx.close();
  // erase it on one device: another device's old copy does not bring it back
  let E1 = await device(store); await E1.p.evaluate(() => { G.setSlot(1); G.load(); G.wipe(); }); await wait(1800); const store2 = await E1.p.evaluate(() => window.__store); R.tomb = store2['data/users/u1/slot1'] && store2['data/users/u1/slot1'].s === null; await E1.ctx.close();
  let E2 = await device(store2); R.stayedErased = await E2.p.evaluate(() => !G.slotInfo(1)); await E2.ctx.close();
  // no account at all: plays and saves on the device, no errors
  let N = await device(null); await make(N.p); R.local = await N.p.evaluate(() => !!G.slotInfo(1) && !G.cloud.on); await N.ctx.close();
  console.log(JSON.stringify(R));
  const ok = R.pushed && R.settings && R.restored === 'Vellis' && R.cont === 321 && /brought back/.test(R.toast) && R.noStorage === 'Vellis' && R.tomb && R.stayedErased && R.local;
  console.log(ok ? 'PASS' : 'FAIL', 'ERRORS', errs.length, errs.slice(0, 3).join(' | ')); await b.close(); process.exit(ok && !errs.length ? 0 : 1); })();
