// Guttercrown — a tidy-up pass over the busiest cards: say it once, show what matters now, and leave the rest to the codex and the pause menu.
(function () {
  'use strict';
  const G = window.G, ui = G.ui;
  const wrap = (fn, post) => { const f0 = ui[fn]; if (f0) ui[fn] = function () { const r = f0.apply(this, arguments); try { post(G.state); } catch (e) { console.error(e); } return r; }; };

  // the Ledger: the dead become one line, the far-off names wait their turn, and the undercard is explained once
  wrap('pit', st => { const lad = document.querySelector('#panel .ladder'); if (!lad) return;
    const dead = [...lad.querySelectorAll('.opp.beaten')], names = dead.map(el => (el.querySelector('b') || {}).textContent).filter(Boolean); dead.forEach(el => el.remove());
    if (names.length) { const d = document.createElement('div'); d.className = 'ruled'; d.innerHTML = '<small>RULED THROUGH</small> ' + names.map(n => '<s>' + n + '</s>').join(' · '); lad.insertBefore(d, lad.querySelector('.tier') || lad.firstChild); }
    const why = lad.querySelector('.uc-why'); if (why) { if ((st.boutN || 0) >= 3 || names.length) why.remove(); else why.innerHTML = 'Nobody is handed a name. Win the <b>undercard</b> bouts below and the Keeper writes you in against the next one.'; }
    const sealed = [...lad.querySelectorAll('.opp.locked')]; if (sealed.length > 2) { sealed.slice(2).forEach(el => el.remove()); const m = document.createElement('p'); m.className = 'dim more'; m.textContent = (sealed.length - 2) + ' more name' + (sealed.length - 2 === 1 ? '' : 's') + ' above these, and the Pale Queen at the top.'; lad.appendChild(m); }
    const intro = document.querySelector('#panel .card > p.dim'); if (intro && (st.boutN || 0) >= 1) intro.remove(); });

  // before a bout: the controls belong to the pause menu once you have fought twice
  wrap('prefight', st => { const card = document.querySelector('#panel .card'); if (!card) return;
    const seen = (st.boutN || 0) >= 2 || (G.input && G.input.touch); card.querySelectorAll('.keys').forEach(k => { if (seen) k.remove(); });
    card.querySelectorAll('p.dim').forEach(p => { if (/is on the undercard|fights on the lower card/.test(p.textContent)) p.remove(); });
    if (!seen && !card.querySelector('.keys-note')) { const ks = card.querySelectorAll('.keys'); if (ks.length > 1) { ks[ks.length - 1].remove(); } } });

  // the line at the top of the market: one thing to do, and at most one reminder
  if (G.objective) { const ob0 = G.objective; G.objective = function () { const s = ob0.apply(this, arguments); if (!s) return s; const parts = s.split(' · '); return parts.length > 2 ? parts.slice(0, 2).join(' · ') : s; }; }
  // a long card keeps its closing buttons in reach: the last row sticks to the bottom while the rest scrolls
  { const panel = document.getElementById('panel'); let q = 0;
    const pin = () => { q = 0; const c = panel && panel.querySelector('.card'); if (!c || c.querySelector(':scope > .foot')) return; const rows = c.querySelectorAll(':scope > .row.end'), e = rows[rows.length - 1]; if (e && e === c.lastElementChild && c.scrollHeight > c.clientHeight + 60) e.classList.add('foot'); };
    if (panel && window.MutationObserver) new MutationObserver(() => { if (!q) q = setTimeout(pin, 0); }).observe(panel, { childList: true, subtree: true }); window.addEventListener('resize', () => { if (!q) q = setTimeout(pin, 0); }); }
})();
