// Guttercrown — saves kept in the player's Claude account as well as on the device.
// A phone can empty a page's storage on its own (a Home Screen web app, low space, a browser clearing site data),
// and the fighter went with it. Every save is now also written to the published page's private per-person store,
// and on load the newer of the two copies wins. A fighter erased on purpose is marked erased in both places, so it
// cannot come back. Without the store (signed out, an outside viewer, a copy opened from disk) the game saves on
// the device only, exactly as before.
(function () {
  'use strict';
  const G = window.G;
  const KEY0 = 'underground_syndicate_v2', keyOf = n => n <= 1 ? KEY0 : KEY0 + '_' + n;
  const EXTRA = ['guttercrown_slot', 'guttercrown_intro_seen', 'guttercrown_guests', 'guttercrown_reigns', 'guttercrown_graves'];
  const MAX = 240000;                                                         // a document holds 256 KiB
  const ls = {
    get: k => { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: k => v => { try { localStorage.setItem(k, v); return localStorage.getItem(k) === v; } catch (e) { return false; } },
    del: k => { try { localStorage.removeItem(k); } catch (e) { } }
  };
  const C = G.cloud = { on: false, state: 'device', lastPush: 0, mem: {} };       // mem: the account's copy of a page, for a browser that refuses to store it
  let db = null, uid = null, col = null;
  const atOf = s => { try { const q = JSON.parse(s); return (q && q.savedAt) || 0; } catch (e) { return 0; } };

  // ---------------------------------------------------------------- writing: one write at a time per document, coalesced
  const pend = {}, busy = {};
  function push(name, body) { if (!col) return; pend[name] = body; if (busy[name]) return; flush(name); }
  async function flush(name) {
    const body = pend[name]; if (!body) return; delete pend[name]; busy[name] = 1;
    try { await col.doc(name).set(body); C.lastPush = Date.now(); C.state = 'cloud'; }
    catch (e) { if (e && e.code === 'unavailable') { await new Promise(r => setTimeout(r, 1500 + Math.random() * 1500)); if (!pend[name]) pend[name] = body; } else { C.state = 'device'; if (e && (e.code === 'invalid_argument' || e.code === 'revoked' || e.code === 'not_granted')) { C.on = false; col = null; } } }
    busy[name] = 0; if (pend[name] && col) flush(name);
  }
  const timers = {};
  const later = (name, fn, ms) => { clearTimeout(timers[name]); timers[name] = setTimeout(() => { delete timers[name]; fn(); }, ms); };
  const slotDoc = n => 'slot' + n;
  function pushSlot(n, s) { if (!col) return; if (s && s.length > MAX) return; push(slotDoc(n), { s: s || null, at: s ? atOf(s) || Date.now() : Date.now() }); }
  function pushMeta() { if (!col) return; const m = { at: Date.now() }; EXTRA.forEach(k => { const v = ls.get(k); if (v != null) m[k.replace('guttercrown_', '')] = v; }); push('meta', m); }

  // ---------------------------------------------------------------- hooks on the game's own save, erase and settings
  let warned = false;
  const save0 = G.save;
  G.save = function () {
    if (G.state && !G.guest && !G.spectating) G.state.savedAt = Date.now();
    const r = save0.apply(this, arguments);
    if (G.guest || G.spectating || !G.state || !G.state.hero) return r;
    const n = G.slot, s = JSON.stringify(G.state), kept = ls.get(keyOf(n)) === s; C.mem[n] = s;
    if (!kept && !C.on && !warned) { warned = true; setTimeout(() => G.ui && G.ui.toast && G.ui.toast('This browser is not keeping saves. Sign in to Claude to keep your fighter in your account.'), 600); }
    later(slotDoc(n), () => pushSlot(n, s), 1200);
    return r;
  };
  const wipe0 = G.wipe; G.wipe = function () { const n = G.slot; delete C.mem[n]; const r = wipe0.apply(this, arguments); clearTimeout(timers[slotDoc(n)]); pushSlot(n, null); return r; };
  const wipeSlot0 = G.wipeSlot; G.wipeSlot = function (n) { delete C.mem[n]; const r = wipeSlot0.apply(this, arguments); clearTimeout(timers[slotDoc(n)]); pushSlot(n, null); return r; };
  const setSlot0 = G.setSlot; G.setSlot = function () { const r = setSlot0.apply(this, arguments); later('meta', pushMeta, 1500); return r; };
  // where the browser keeps nothing, the account's copy stands in for it
  const info0 = G.slotInfo; G.slotInfo = function (n) { const q = info0.apply(this, arguments); if (q || !C.mem[n] || ls.get(keyOf(n))) return q; try { const m = JSON.parse(C.mem[n]); return m && m.v === 2 && m.hero ? m : null; } catch (e) { return null; } };
  const load0 = G.load; G.load = function () { const n = G.slot; if (!ls.get(keyOf(n)) && C.mem[n]) { if (!ls.set(keyOf(n))(C.mem[n])) { try { const m = JSON.parse(C.mem[n]); if (m && m.v === 2 && m.hero) { G.state = Object.assign(G.newState(), m); return true; } } catch (e) { } } } return load0.apply(this, arguments); };
  // the small things (intro seen, the Guest List found, past reigns and graves) are written straight to storage elsewhere: copy them now and then
  setInterval(() => { if (col) { const sig = EXTRA.map(k => ls.get(k) || '').join('|'); if (sig !== C.metaSig) { C.metaSig = sig; pushMeta(); } } }, 20000);
  // leaving the page: send anything still waiting
  const bye = () => { Object.keys(timers).forEach(k => { const t = timers[k]; clearTimeout(t); delete timers[k]; if (k === 'meta') pushMeta(); else { const n = +k.replace('slot', ''); if (n) pushSlot(n, ls.get(keyOf(n)) || (G.slot === n && G.state && G.state.hero ? JSON.stringify(G.state) : null)); } }); };
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') bye(); });
  window.addEventListener('pagehide', bye);

  // ---------------------------------------------------------------- reading: on open, the newer copy of each page wins
  async function start() {
    if (!window.claude || !window.claude.use) return;
    let user; try { [db, user] = await Promise.all([window.claude.use('db'), window.claude.use('user')]); } catch (e) { return; }
    if (!db || !user) return;
    try { uid = await user.id(); } catch (e) { uid = null; } if (!uid) return;
    try { col = db.collection('data/users/' + uid); } catch (e) { col = null; return; }
    const got = {}; let ok = false;
    const read = async name => { try { const d = await col.doc(name).get(); got[name] = d.exists ? d.data() : null; ok = true; } catch (e) { got[name] = undefined; } };
    await Promise.race([Promise.all([1, 2, 3].map(n => read(slotDoc(n))).concat(read('meta'))), new Promise(r => setTimeout(r, 10000))]);
    if (!ok) { col = null; return; }
    C.on = true; C.state = 'cloud';
    let restored = 0, changed = false;
    const playing = n => G.slot === n && G.state && G.state.hero && G.scene !== 'title' && G.scene !== 'create';
    for (const n of [1, 2, 3]) {
      const c = got[slotDoc(n)], local = ls.get(keyOf(n)), la = local ? atOf(local) : 0;
      if (c === undefined) continue;
      if (c && c.s && c.at > la && !playing(n)) { C.mem[n] = c.s; ls.set(keyOf(n))(c.s); restored++; changed = true; }
      else if (c && !c.s && local && c.at > la && !playing(n)) { ls.del(keyOf(n)); changed = true; }           // erased on another device after this copy was made
      else if (local && (!c || la > (c.at || 0))) pushSlot(n, local);                                            // this device is newer, or the account has none yet
    }
    const m = got.meta;
    if (m && m.at) EXTRA.forEach(k => { const f = k.replace('guttercrown_', ''); if (m[f] != null && ls.get(k) == null) { ls.set(k)(m[f]); changed = true; } });
    if (m && m.slot && !(G.state && G.state.hero)) { const s = +m.slot; if (s >= 1 && s <= 3) setSlot0(s); }
    C.metaSig = EXTRA.map(k => ls.get(k) || '').join('|'); if (!m) pushMeta();
    if (changed && G.scene === 'title' && G.ui && G.ui.title && !G.talk && (!G.ui.isOpen() || document.querySelector('#panel .title-wrap'))) G.ui.title();       // the title's Continue appears for a fighter just brought back
    if (restored && G.ui && G.ui.toast) G.ui.toast(restored === 1 ? 'Your fighter was brought back from your Claude account.' : restored + ' fighters were brought back from your Claude account.');
  }
  setTimeout(start, 0);

  // ---------------------------------------------------------------- the Settings card says where saves live
  const set0 = G.ui && G.ui.settings;
  if (set0) G.ui.settings = function () {
    const r = set0.apply(this, arguments), card = document.querySelector('#panel .card'), end = card && card.querySelector('.row.end'); if (!end) return r;
    const row = document.createElement('div'); row.className = 'ab-row';
    row.innerHTML = '<div class="ab-tx"><b>Saves</b><p>' + (C.on ? 'Kept on this device and in your Claude account, so clearing this browser or a phone tidying its storage does not lose your fighter.' + (C.lastPush ? ' Last copied ' + Math.max(1, Math.round((Date.now() - C.lastPush) / 60000)) + ' min ago.' : '') : 'Kept on this device only. Open the game signed in to Claude to keep a copy in your account.') + '</p></div>';
    end.parentNode.insertBefore(row, end); return r;
  };
})();
