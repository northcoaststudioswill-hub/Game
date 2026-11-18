// Guttercrown — keeping the frame rate: small props stop casting shadows, and a Performance setting for slower machines
(function () {
  const G = window.G, T = THREE, W = G.world, gfx = G.gfx, ui = G.ui;
  // a bottle or a coin does not need its own pass through the shadow map
  const v = new T.Vector3(), done = new WeakSet();
  function trim(scene) {
    if (!scene || done.has(scene)) return; done.add(scene); scene.updateMatrixWorld(true);
    scene.traverse(o => { if (!o.isMesh || !o.castShadow || o.isInstancedMesh || !o.geometry) return; if (!o.geometry.boundingSphere) o.geometry.computeBoundingSphere(); const bs = o.geometry.boundingSphere; if (!bs) return; o.getWorldScale(v); if (bs.radius * Math.max(v.x, v.y, v.z) < 0.2) o.castShadow = false; });
  }
  const get0 = W.get;
  W.get = function (id) { const p = get0.apply(this, arguments); if (p && p.scene && (id === 'hub' || id === 'hideout')) trim(p.scene); return p; };
  const hb0 = W.buildHub; W.buildHub = function () { const h = hb0.apply(this, arguments); done.delete(h.scene); return h; };

  const ap0 = G.applyOpts;
  G.applyOpts = function () { ap0.apply(this, arguments); const o = (G.state && G.state.opt) || {}; if (gfx.setLow && !!o.perf !== gfx.low) gfx.setLow(!!o.perf); };
  const set0 = ui.settings;
  ui.settings = function () {
    set0.apply(this, arguments); const st = G.state, o = st.opt || (st.opt = {}), card = document.querySelector('#panel .card'), end = card && card.querySelector('.row.end'); if (!end) return;
    const row = document.createElement('div'); row.className = 'ab-row';
    row.innerHTML = '<div class="ab-tx"><b>Performance mode</b><p>Draws at a lower resolution with cheaper shadows, for slower machines. Off, the game stays sharp and only softens a little if frames drop badly' + (gfx.scale < 1 && !o.perf ? ' (it has: now at ' + Math.round(gfx.scale * 100) + '%)' : '') + '.</p></div><button class="' + (o.perf ? 'big' : '') + '">' + (o.perf ? 'On' : 'Off') + '</button>';
    row.querySelector('button').onclick = () => { o.perf = !o.perf; G.save(); G.sfx('ui'); G.applyOpts(); ui.settings(); };
    end.parentNode.insertBefore(row, end);
  };
})();
