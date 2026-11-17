// Starhaven — drawing. Placeholder art with a fixed direction: moody painted-style depth behind,
// a near-black play layer with moonlit edges, and a bright, clearly outlined Wren in front.
(function (SH) {
  const PAL = {
    skyTop: '#090b20', skyMid: '#191a45', skyLow: '#33295c', horizon: '#4d3a72',
    star: '#ffffff', starDim: '#a9b8ff',
    farRidge: '#23275a', nearRidge: '#181b42', ridgeLight: '#3a4088',
    trees: '#11132e', treesLight: '#1f2350',
    ground: '#0a0b17', groundSpeck: '#121430', edgeLight: '#c3cdff', edgeMid: '#56609c', grass: '#5ba39a', grassDark: '#2f6a66',
    plank: '#29233f', plankTop: '#cbb8ff',
    thornDark: '#2a1024', thornMid: '#5a1d3e', thornTip: '#ff5a78',
    gold: '#ffd27a', goldDeep: '#d9973f', warm: '#ffe9a8',
    hair: '#e0703f', hairDark: '#a8452a', skin: '#f6dcc6', tunic: '#2f8f7a', tunicDark: '#1f6656',
    cloak: '#2c3d74', cloakRim: '#9fc2ff', legs: '#3b3150', boots: '#6a4430', blade: '#eef8ff',
    sprite: '#2f5c2b', spriteRim: '#8fd16b', spriteEye: '#ffb057', spriteAngry: '#ff8a3a',
  };
  SH.PAL = PAL;

  // Deterministic random so the art is the same every time.
  function rng(seed) { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }

  const D = {};
  let room, layers = {};

  D.init = function (r, viewW) {
    room = r;
    layers.level = makeLevel(r);
    D.resize(viewW);
    if (!layers.mountains) layers.mountains = makeMountains();
    if (!layers.trees) layers.trees = makeTrees();
    if (!layers.stars) layers.stars = makeStars();
  };
  D.resize = function (viewW) {
    layers.viewW = viewW;
    layers.sky = makeSky(viewW);
    layers.vignette = makeVignette(viewW);
  };

  function canvas(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; }

  function makeSky(w) {
    const c = canvas(w, 360), g = c.getContext('2d');
    const gr = g.createLinearGradient(0, 0, 0, 360);
    gr.addColorStop(0, PAL.skyTop); gr.addColorStop(0.45, PAL.skyMid); gr.addColorStop(0.78, PAL.skyLow); gr.addColorStop(1, PAL.horizon);
    g.fillStyle = gr; g.fillRect(0, 0, w, 360);
    return c;
  }
  function makeStars() {
    const r = rng(7), out = [];
    for (let i = 0; i < 140; i++) out.push({ x: r() * 2400, y: r() * 230, s: r() < 0.12 ? 2 : 1, tw: r() * 6, sp: 0.02 + r() * 0.05 });
    return out;
  }
  function ridge(g, r, w, base, amp, color, light) {
    g.fillStyle = color; g.beginPath(); g.moveTo(0, 360);
    let y = base, pts = [];
    for (let x = 0; x <= w; x += 8) {
      const n = Math.sin(x * 0.004 + 1.3) * amp + Math.sin(x * 0.011) * amp * 0.45 + Math.sin(x * 0.031 + 2) * amp * 0.12;
      y = base - Math.abs(n);
      pts.push([x, y]); g.lineTo(x, y);
    }
    g.lineTo(w, 360); g.closePath(); g.fill();
    if (light) { g.strokeStyle = light; g.globalAlpha = 0.5; g.lineWidth = 1; g.beginPath(); pts.forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); g.stroke(); g.globalAlpha = 1; }
  }
  function makeMountains() {
    const w = 1600, c = canvas(w, 360), g = c.getContext('2d'), r = rng(3);
    ridge(g, r, w, 250, 80, PAL.farRidge, PAL.ridgeLight);
    // a soft mist band between ridges
    const m = g.createLinearGradient(0, 200, 0, 300); m.addColorStop(0, 'rgba(120,110,200,0)'); m.addColorStop(1, 'rgba(120,110,200,0.22)');
    g.fillStyle = m; g.fillRect(0, 200, w, 160);
    ridge(g, r, w, 300, 46, PAL.nearRidge, null);
    return c;
  }
  function makeTrees() {
    const w = 1400, c = canvas(w, 360), g = c.getContext('2d'), r = rng(11);
    for (let i = 0; i < 26; i++) {
      const x = r() * w, top = 70 + r() * 150, tw = 5 + r() * 9;
      g.fillStyle = PAL.trees;
      g.fillRect(x, top, tw, 360 - top);
      // branches and leaf masses
      for (let b = 0; b < 4; b++) {
        const by = top + 10 + r() * 90, dir = r() < 0.5 ? -1 : 1, len = 14 + r() * 26;
        g.save(); g.translate(x + tw / 2, by); g.rotate(dir * (0.5 + r() * 0.5) - Math.PI / 2 * 0);
        g.fillRect(0, -1.5, dir * len, 3); g.restore();
      }
      g.beginPath(); g.ellipse(x + tw / 2, top + 6, 22 + r() * 22, 14 + r() * 12, 0, 0, Math.PI * 2); g.fill();
      g.fillStyle = PAL.treesLight; g.globalAlpha = 0.5; g.fillRect(x + tw - 1, top + 8, 1, 360 - top); g.globalAlpha = 1;
    }
    g.fillStyle = PAL.trees; g.fillRect(0, 330, w, 30);
    return c;
  }
  function makeVignette(w) {
    const VH = SH.VIEW_H, c = canvas(w, VH), g = c.getContext('2d');
    const gr = g.createRadialGradient(w / 2, VH / 2, 120, w / 2, VH / 2, w * 0.62);
    gr.addColorStop(0, 'rgba(0,0,0,0)'); gr.addColorStop(1, 'rgba(3,3,12,0.55)');
    g.fillStyle = gr; g.fillRect(0, 0, w, VH);
    return c;
  }

  function makeLevel(r) {
    const TS = SH.TILE, c = canvas(r.pxW, r.pxH), g = c.getContext('2d'), rand = rng(21);
    const get = (x, y) => r.get(x, y);
    const solid = (x, y) => get(x, y) === SH.T_SOLID;
    for (let ty = 0; ty < r.h; ty++) for (let tx = 0; tx < r.w; tx++) {
      const t = get(tx, ty), x = tx * TS, y = ty * TS;
      if (t === SH.T_SOLID) {
        g.fillStyle = PAL.ground; g.fillRect(x, y, TS, TS);
        for (let i = 0; i < 3; i++) { g.fillStyle = PAL.groundSpeck; g.fillRect(x + ((rand() * TS) | 0), y + ((rand() * TS) | 0), 2, 2); }
        const openUp = !solid(tx, ty - 1), openL = !solid(tx - 1, ty), openR = !solid(tx + 1, ty);
        if (openL) { g.fillStyle = '#20264d'; g.fillRect(x, y, 2, TS); }
        if (openR) { g.fillStyle = '#20264d'; g.fillRect(x + TS - 2, y, 2, TS); }
        if (openUp) {
          g.fillStyle = PAL.edgeMid; g.fillRect(x, y + 2, TS, 2);
          g.fillStyle = PAL.edgeLight; g.fillRect(x, y, TS, 2);
          for (let i = 0; i < 5; i++) {
            const gx = x + ((rand() * TS) | 0), gh = 1 + ((rand() * 4) | 0);
            g.fillStyle = rand() < 0.5 ? PAL.grass : PAL.grassDark; g.fillRect(gx, y - gh, 1, gh);
          }
          // Gold glint on a ledge that drops into a pit: "careful, edge here".
          const pitL = openL && r.groundY(tx - 1, ty) === null, pitR = openR && r.groundY(tx + 1, ty) === null;
          if (pitL) { g.fillStyle = PAL.gold; g.fillRect(x, y, 5, 2); g.fillRect(x, y, 2, 6); }
          if (pitR) { g.fillStyle = PAL.gold; g.fillRect(x + TS - 5, y, 5, 2); g.fillRect(x + TS - 2, y, 2, 6); }
        }
      } else if (t === SH.T_ONEWAY) {
        g.fillStyle = PAL.plank; g.fillRect(x, y, TS, 7);
        g.fillStyle = PAL.plankTop; g.fillRect(x, y, TS, 2);
        g.fillStyle = '#17132a'; g.fillRect(x + 2, y + 7, 2, 4); g.fillRect(x + TS - 4, y + 7, 2, 4);
      } else if (t === SH.T_THORNS) {
        const glow = g.createLinearGradient(0, y - 8, 0, y + TS); glow.addColorStop(0, 'rgba(255,60,100,0)'); glow.addColorStop(1, 'rgba(255,60,100,0.22)');
        g.fillStyle = glow; g.fillRect(x, y - 8, TS, TS + 8);
        g.fillStyle = PAL.thornDark; g.fillRect(x, y + TS - 6, TS, 6);
        for (let i = 0; i < 4; i++) {
          const bx = x + i * 6 + rand() * 3, h = 9 + rand() * 9;
          g.fillStyle = PAL.thornMid; g.beginPath(); g.moveTo(bx, y + TS); g.lineTo(bx + 3, y + TS - h); g.lineTo(bx + 6, y + TS); g.fill();
          g.fillStyle = PAL.thornTip; g.fillRect(bx + 2, y + TS - h, 2, 3);
        }
      }
    }
    return c;
  }

  // ---------------------------------------------------------------- per frame
  D.frame = function (ctx, w) {
    const vw = layers.viewW, cam = w.cam, fx = SH.fx, t = w.time;
    let sx = 0, sy = 0;
    if (fx.shake > 0) { sx = Math.round((Math.random() - 0.5) * fx.shake * 2); sy = Math.round((Math.random() - 0.5) * fx.shake * 2); }
    const cx = Math.round(cam.x), cy = Math.round(cam.y);

    ctx.drawImage(layers.sky, 0, 0);
    // stars
    for (const s of layers.stars) {
      const x = ((s.x - cx * s.sp) % 2400 + 2400) % 2400;
      if (x > vw) continue;
      ctx.globalAlpha = 0.45 + 0.55 * Math.abs(Math.sin(t * 0.03 + s.tw));
      ctx.fillStyle = s.s > 1 ? PAL.star : PAL.starDim; ctx.fillRect(x, s.y - cy * 0.02, s.s, s.s);
    }
    ctx.globalAlpha = 1;
    drawCity(ctx, w, vw, cx, cy);
    tile(ctx, layers.mountains, cx * 0.12, 10 - cy * 0.08, vw);
    ctx.globalAlpha = 0.8; tile(ctx, layers.trees, cx * 0.38, 30 - cy * 0.3, vw); ctx.globalAlpha = 1;
    // mist in front of the trees
    const VH = SH.VIEW_H;
    const mist = ctx.createLinearGradient(0, 180 - cy * 0.3, 0, VH);
    mist.addColorStop(0, 'rgba(110,100,190,0)'); mist.addColorStop(1, 'rgba(110,100,190,0.20)');
    ctx.fillStyle = mist; ctx.fillRect(0, 0, vw, VH);

    ctx.save();
    ctx.translate(-cx + sx, -cy + sy);
    ctx.drawImage(layers.level, cx, cy, vw, VH, cx, cy, vw, VH);
    for (const l of w.lanterns) drawLantern(ctx, l, t);
    for (const s of w.signs) drawSign(ctx, s, t);
    for (const e of w.things) {
      if (e.x < cx - 80 || e.x > cx + vw + 80) continue;
      if (e.kind === 'thornSprite') drawSprite(ctx, e, t);
      else if (e.kind === 'dummy') drawDummy(ctx, e);
      else if (e.kind === 'bulb') drawBulb(ctx, e, t);
    }
    for (const g of fx.ghosts) drawWren(ctx, w.player, { ghost: g });
    drawWren(ctx, w.player, {});
    drawParticles(ctx, fx);
    ctx.restore();

    ctx.drawImage(layers.vignette, 0, 0);
    if (fx.flash > 0) { ctx.fillStyle = fx.flashColor; ctx.globalAlpha = Math.min(1, fx.flash / 6); ctx.fillRect(0, 0, vw, VH); ctx.globalAlpha = 1; }
    if (fx.slowmo > 0) { ctx.fillStyle = 'rgba(120,190,255,0.10)'; ctx.fillRect(0, 0, vw, VH); }
    if (w.fade > 0) { ctx.fillStyle = '#05050d'; ctx.globalAlpha = Math.min(1, w.fade); ctx.fillRect(0, 0, vw, VH); ctx.globalAlpha = 1; }
  };

  function tile(ctx, img, ox, oy, vw) {
    const iw = img.width; let x = -(((ox % iw) + iw) % iw);
    for (; x < vw; x += iw) ctx.drawImage(img, Math.round(x), Math.round(oy));
  }

  function drawCity(ctx, w, vw, cx, cy) {
    // Starhaven on the far horizon: the place you are working toward.
    const worldX = w.room.def.cityGlowX * SH.TILE;
    const x = Math.round(vw * 0.5 + (worldX - cx - vw * 0.5) * 0.06), y = 232 - cy * 0.05;
    if (x < -120 || x > vw + 120) return;
    const glow = ctx.createRadialGradient(x, y, 4, x, y, 110);
    glow.addColorStop(0, 'rgba(255,210,122,0.38)'); glow.addColorStop(1, 'rgba(255,210,122,0)');
    ctx.fillStyle = glow; ctx.fillRect(x - 120, y - 120, 240, 240);
    ctx.fillStyle = '#2a2558';
    const spires = [[-34, 18], [-24, 30], [-14, 22], [-6, 44], [4, 26], [12, 36], [22, 20], [30, 28]];
    for (const [dx, h] of spires) { ctx.fillRect(x + dx, y - h, 6, h + 20); ctx.beginPath(); ctx.moveTo(x + dx, y - h); ctx.lineTo(x + dx + 3, y - h - 8); ctx.lineTo(x + dx + 6, y - h); ctx.fill(); }
    ctx.fillStyle = PAL.gold;
    for (const [dx, h] of spires) for (let k = 6; k < h; k += 8) ctx.fillRect(x + dx + 2, y - h + k, 2, 2);
    // the guiding star above the city
    const tw = 0.7 + 0.3 * Math.sin(w.time * 0.05);
    ctx.globalAlpha = tw; ctx.fillStyle = '#fff6d8';
    ctx.fillRect(x - 1, y - 74, 3, 3); ctx.fillRect(x - 5, y - 73, 11, 1); ctx.fillRect(x, y - 79, 1, 13);
    ctx.globalAlpha = 1;
  }

  function drawParticles(ctx, fx) {
    for (const r of fx.rings) {
      ctx.globalAlpha = r.life / r.max; ctx.strokeStyle = r.color; ctx.lineWidth = r.width;
      ctx.beginPath(); ctx.arc(r.x, r.y, r.r, 0, Math.PI * 2); ctx.stroke();
    }
    for (const p of fx.parts) {
      const a = Math.min(1, p.life / p.max * 1.4);
      if (p.glow) { ctx.globalAlpha = a * 0.3; ctx.fillStyle = p.color; ctx.fillRect(p.x - p.size, p.y - p.size, p.size * 3, p.size * 3); }
      ctx.globalAlpha = a; ctx.fillStyle = p.color; ctx.fillRect(Math.round(p.x), Math.round(p.y), p.size, p.size);
    }
    ctx.globalAlpha = 1;
    ctx.textAlign = 'center'; ctx.font = 'bold 13px system-ui, sans-serif';
    for (const wd of fx.words) {
      ctx.globalAlpha = Math.min(1, wd.life / 15);
      ctx.fillStyle = '#05050d'; ctx.fillText(wd.text, wd.x + 1, wd.y + 1);
      ctx.fillStyle = wd.color; ctx.fillText(wd.text, wd.x, wd.y);
    }
    ctx.globalAlpha = 1;
  }

  // ---------------------------------------------------------------- props
  function drawLantern(ctx, l, t) {
    const x = l.px, y = l.py, big = l.end;
    const h = big ? 58 : 42;
    if (l.lit) {
      const r = (big ? 70 : 46) + Math.sin(t * 0.08 + x) * 3;
      const g = ctx.createRadialGradient(x, y - h, 2, x, y - h, r);
      g.addColorStop(0, 'rgba(255,214,130,0.55)'); g.addColorStop(1, 'rgba(255,214,130,0)');
      ctx.fillStyle = g; ctx.fillRect(x - r, y - h - r, r * 2, r * 2);
    }
    ctx.fillStyle = '#1b1830'; ctx.fillRect(x - 2, y - h + 6, 4, h - 6);
    ctx.fillRect(x - 6, y - 2, 12, 2);
    ctx.fillStyle = '#1b1830'; ctx.fillRect(x - 7, y - h - 8, 14, 16);
    ctx.fillStyle = l.lit ? (Math.sin(t * 0.2 + x) > -0.8 ? PAL.warm : PAL.gold) : '#3a3560';
    ctx.fillRect(x - 5, y - h - 6, 10, 12);
    ctx.fillStyle = '#1b1830'; ctx.fillRect(x - 1, y - h - 6, 2, 12);
    if (big) {
      ctx.fillStyle = l.lit ? '#fff6d8' : '#5a5590';
      ctx.fillRect(x - 1, y - h - 22, 2, 10); ctx.fillRect(x - 5, y - h - 18, 10, 2);
    }
  }

  function drawSign(ctx, s, t) {
    const x = s.px, y = s.py;
    ctx.fillStyle = '#2a2140'; ctx.fillRect(x - 2, y - 24, 4, 24);
    ctx.fillStyle = s.read ? '#3a2f55' : '#4a3a6a'; ctx.fillRect(x - 14, y - 34, 28, 16);
    ctx.fillStyle = s.near ? PAL.gold : '#a99ad8'; ctx.fillRect(x - 14, y - 34, 28, 2);
    ctx.fillStyle = '#d8ccff';
    for (let i = 0; i < 3; i++) ctx.fillRect(x - 9, y - 29 + i * 4, 18 - (i === 2 ? 6 : 0), 1);
    if (!s.read && !s.near) {
      const bob = Math.round(Math.sin(t * 0.1) * 2);
      ctx.fillStyle = PAL.gold; ctx.fillRect(x - 1, y - 48 + bob, 3, 7); ctx.fillRect(x - 1, y - 39 + bob, 3, 3);
    }
  }

  function drawDummy(ctx, d) {
    ctx.save(); ctx.translate(d.x, d.y); ctx.rotate(d.tilt);
    ctx.fillStyle = '#3a2a1e'; ctx.fillRect(-2, -40, 4, 40);
    ctx.fillStyle = d.flash > 0 ? '#ffffff' : '#c89c52'; ctx.fillRect(-10, -36, 20, 22);
    ctx.fillStyle = '#8a6630'; ctx.fillRect(-10, -26, 20, 2); ctx.fillRect(-12, -34, 24, 3);
    ctx.fillStyle = d.flash > 0 ? '#ffffff' : '#e2c48a'; ctx.fillRect(-7, -48, 14, 13);
    ctx.fillStyle = '#5a3f22'; ctx.fillRect(-3, -44, 2, 2); ctx.fillRect(2, -44, 2, 2);
    ctx.restore();
  }

  function drawBulb(ctx, b, t) {
    const y = b.y + Math.sin(b.t) * 3, x = b.x;
    if (b.closed > 0) {
      ctx.fillStyle = '#4a1d3a'; ctx.beginPath(); ctx.arc(x, y, 6, 0, Math.PI * 2); ctx.fill();
      return;
    }
    const g = ctx.createRadialGradient(x, y, 2, x, y, 26); g.addColorStop(0, 'rgba(255,143,184,0.45)'); g.addColorStop(1, 'rgba(255,143,184,0)');
    ctx.fillStyle = g; ctx.fillRect(x - 26, y - 26, 52, 52);
    for (let i = 0; i < 6; i++) {
      const a = i / 6 * Math.PI * 2 + b.t * 0.6;
      ctx.fillStyle = i % 2 ? '#c2477a' : '#ff8fb8';
      ctx.beginPath(); ctx.ellipse(x + Math.cos(a) * 7, y + Math.sin(a) * 7, 7, 4, a, 0, Math.PI * 2); ctx.fill();
    }
    ctx.fillStyle = PAL.gold; ctx.beginPath(); ctx.arc(x, y, 4, 0, Math.PI * 2); ctx.fill();
    // a down-arrow hint above: strike down here
    const bob = Math.round(Math.sin(t * 0.12) * 2);
    ctx.fillStyle = 'rgba(255,233,168,0.8)';
    ctx.fillRect(x - 1, y - 30 + bob, 2, 6); ctx.fillRect(x - 3, y - 25 + bob, 6, 2); ctx.fillRect(x - 1, y - 23 + bob, 2, 2);
  }

  function drawSprite(ctx, e, t) {
    if (e.dead) return;
    const d = e.def, cy = e.y - d.h / 2;
    let x = e.x;
    const angry = e.state === 'windup' || e.state === 'lunge';
    if (e.state === 'windup') x += Math.round(Math.sin(e.t * 1.7) * 1.5);
    if (angry) {
      const k = e.state === 'windup' ? e.t / d.windup : 1;
      const g = ctx.createRadialGradient(x, cy, 2, x, cy, 30);
      g.addColorStop(0, `rgba(255,150,60,${0.55 * k})`); g.addColorStop(1, 'rgba(255,150,60,0)');
      ctx.fillStyle = g; ctx.fillRect(x - 30, cy - 30, 60, 60);
    }
    const spikes = 10, rot = e.wobble * 0.2 * (e.dir || 1);
    const body = e.flash > 0 ? '#ffffff' : angry ? '#6a4a1c' : PAL.sprite;
    const rim = e.flash > 0 ? '#ffffff' : angry ? PAL.spriteAngry : PAL.spriteRim;
    ctx.fillStyle = rim;
    star(ctx, x, cy, 14, 9, spikes, rot);
    ctx.fillStyle = body;
    star(ctx, x, cy + 1, 11.5, 7.5, spikes, rot);
    // eyes look toward where it's going
    ctx.fillStyle = angry ? '#ffe0a0' : PAL.spriteEye;
    const ex = (e.dir || 1) * 3;
    ctx.fillRect(Math.round(x + ex - 4), Math.round(cy - 2), 3, 3);
    ctx.fillRect(Math.round(x + ex + 2), Math.round(cy - 2), 3, 3);
    if (e.state === 'recover' || e.state === 'stagger') { ctx.fillStyle = '#ffffff'; ctx.globalAlpha = 0.6; ctx.fillRect(Math.round(x + ex - 4), Math.round(cy), 3, 1); ctx.fillRect(Math.round(x + ex + 2), Math.round(cy), 3, 1); ctx.globalAlpha = 1; }
    // health pips once it's been hit
    if (e.hp < d.hp) {
      const n = Math.ceil(d.hp / SH.COMBAT.damage), left = Math.ceil(e.hp / SH.COMBAT.damage);
      for (let i = 0; i < n; i++) { ctx.fillStyle = i < left ? '#9be07a' : '#2a2a3a'; ctx.fillRect(Math.round(x - n * 4 + i * 8 + 1), Math.round(e.y - d.h - 12), 6, 3); }
    }
  }
  function star(ctx, x, y, R, r, n, rot) {
    ctx.beginPath();
    for (let i = 0; i < n * 2; i++) { const a = rot + i / (n * 2) * Math.PI * 2, rr = i % 2 ? r : R; i ? ctx.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr) : ctx.moveTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); }
    ctx.closePath(); ctx.fill();
  }

  // ---------------------------------------------------------------- Wren
  function poseOf(p) {
    if (p.dashT > 0) return 'dash';
    if (p.stun > 0) return 'hurt';
    if (p.swing) return p.swing.kind === 'pogo' ? 'pogo' : 'attack';
    if (!p.grounded) return p.vy < -1 ? 'rise' : p.vy > 1.5 ? 'fall' : 'apex';
    if (Math.abs(p.vx) > 0.4) return 'run';
    return 'idle';
  }

  function drawWren(ctx, p, opt) {
    const g = opt.ghost;
    const x = g ? g.x : p.x, y = g ? g.y : p.y, f = g ? g.facing : p.facing;
    const pose = g ? g.pose : poseOf(p);
    const a = p.anim;
    const tint = g ? 'rgba(140,220,255,' + (0.35 * g.life / g.max).toFixed(3) + ')' : null;
    const flicker = !g && p.invuln > 0 && Math.floor(p.invuln / 3) % 2 === 0 && p.stun <= 0;
    if (flicker) return;

    // scarf first (behind the body), in world space
    if (!g) {
      ctx.lineCap = 'round';
      for (let i = 1; i < p.scarf.length; i++) {
        const q0 = p.scarf[i - 1], q1 = p.scarf[i];
        ctx.strokeStyle = i % 2 ? PAL.gold : PAL.goldDeep;
        ctx.lineWidth = Math.max(1.5, 4.5 - i * 0.8);
        ctx.beginPath(); ctx.moveTo(q0.x, q0.y); ctx.lineTo(q1.x, q1.y); ctx.stroke();
      }
      // soft starlight halo so Wren always reads against the dark
      const h = ctx.createRadialGradient(x, y - 22, 4, x, y - 22, 34);
      h.addColorStop(0, 'rgba(200,220,255,0.16)'); h.addColorStop(1, 'rgba(200,220,255,0)');
      ctx.fillStyle = h; ctx.fillRect(x - 34, y - 56, 68, 68);
    }

    ctx.save();
    ctx.translate(Math.round(x), Math.round(y));
    // squash and stretch
    let sxS = 1, syS = 1;
    if (!g) {
      if (a.land > 0) { const k = a.squash * (a.land / 8); sxS = 1 + k * 0.22; syS = 1 - k * 0.2; }
      else if (pose === 'rise') { sxS = 0.92; syS = 1.08; }
      if (pose === 'dash') { sxS = 1.12; syS = 0.9; }
    } else if (pose === 'dash') { sxS = 1.12; syS = 0.9; }
    ctx.scale(f * sxS, syS);

    const C = c => tint || c;
    const breathe = pose === 'idle' ? Math.round(Math.sin(a.t * 0.06) * 0.8) : 0;
    const run = a.run * Math.PI;
    const lean = pose === 'run' ? 0.12 : pose === 'dash' ? 0.25 : 0;

    // legs
    let legA = 0, legB = 0;
    if (pose === 'run') { legA = Math.sin(run) * 0.9; legB = -legA; }
    else if (pose === 'rise') { legA = -0.7; legB = 0.4; }
    else if (pose === 'apex' || pose === 'pogo') { legA = -0.9; legB = 0.6; }
    else if (pose === 'fall') { legA = 0.35; legB = -0.25; }
    else if (pose === 'dash') { legA = 0.9; legB = -1.0; }
    else if (pose === 'hurt') { legA = 0.6; legB = -0.5; }
    else if (pose === 'attack') { legA = 0.55; legB = -0.45; }
    const hipY = -16 + breathe;
    limb(ctx, -1, hipY, legB, 16, 5, C(PAL.legs), C('#2a2238'));
    limb(ctx, 1, hipY, legA, 16, 5, C(PAL.legs), C(PAL.boots));

    ctx.save();
    ctx.rotate(lean);
    // cloak flows behind
    const flow = Math.min(1, Math.abs(p.vx) / 4) * (g ? 1 : 1);
    const lift = pose === 'fall' ? -6 : pose === 'rise' ? 4 : 0;
    ctx.fillStyle = C(PAL.cloak);
    ctx.beginPath();
    ctx.moveTo(-2, -31 + breathe);
    ctx.lineTo(-9 - flow * 8, -6 + lift - flow * 6 + Math.sin(a.t * 0.2) * flow * 2);
    ctx.lineTo(-3, -10 + lift * 0.5);
    ctx.lineTo(3, -30 + breathe);
    ctx.closePath(); ctx.fill();

    // torso
    ctx.fillStyle = C(PAL.tunic); ctx.fillRect(-5, -31 + breathe, 11, 16);
    ctx.fillStyle = C(PAL.tunicDark); ctx.fillRect(-5, -31 + breathe, 3, 16);
    ctx.fillStyle = C('#6a4a2a'); ctx.fillRect(-5, -18 + breathe, 11, 2);

    // head
    const hy = -42 + breathe;
    ctx.fillStyle = C(PAL.skin); ctx.fillRect(-3, hy, 10, 11);
    ctx.fillStyle = C(PAL.hair); ctx.fillRect(-5, hy - 2, 11, 5); ctx.fillRect(-5, hy, 5, 9);
    ctx.fillStyle = C(PAL.hairDark); ctx.fillRect(-5, hy + 6, 3, 4);
    // ponytail swings opposite to motion
    const tail = pose === 'run' ? Math.sin(run * 2) * 2 : pose === 'fall' ? -3 : 0;
    ctx.fillStyle = C(PAL.hair); ctx.fillRect(-9, hy + 1 + Math.round(tail), 5, 4); ctx.fillRect(-11, hy + 3 + Math.round(tail * 1.4), 3, 5);
    // pointed fae ear
    ctx.fillStyle = C(PAL.skin); ctx.fillRect(0, hy + 3, 2, 3); ctx.fillRect(-1, hy + 1, 2, 2); ctx.fillRect(-2, hy - 1, 1, 2);
    if (!tint) { ctx.fillStyle = '#1a1430'; ctx.fillRect(4, hy + 4, 2, 3); ctx.fillStyle = '#ffffff'; ctx.fillRect(5, hy + 4, 1, 1); }

    // arm + dagger
    const sw = p.swing;
    // Arm angle: 0 = hanging down, -1.57 = straight forward, -3.14 = straight up, +1.57 = straight back.
    let armAng = -0.25 + Math.sin(a.t * 0.06) * 0.05, showBlade = true;
    if (pose === 'run') armAng = -0.3 - Math.sin(run) * 0.7;
    if (pose === 'rise' || pose === 'apex') armAng = -1.2;
    if (pose === 'fall') armAng = -2.2;
    if (pose === 'dash') armAng = 1.3;
    if (pose === 'hurt') armAng = 2.4;
    if (!g && sw) {
      const k = Math.min(1, sw.f / Math.max(1, sw.def.active[1]));
      if (sw.def.arc === 'high') armAng = -3.0 + k * 2.5;
      else if (sw.def.arc === 'low') armAng = -0.4 - k * 2.2;
      else if (sw.def.arc === 'big') armAng = -3.4 + k * 3.4;
    }
    if (pose === 'pogo') armAng = 0;
    ctx.save();
    ctx.translate(2, -28 + breathe);
    ctx.rotate(armAng);
    ctx.fillStyle = C(PAL.tunic); ctx.fillRect(-2, 0, 4, 7);
    ctx.fillStyle = C(PAL.skin); ctx.fillRect(-2, 7, 4, 4);
    if (showBlade) { ctx.fillStyle = C(PAL.blade); ctx.fillRect(-1, 10, 2, 9); ctx.fillStyle = C(PAL.gold); ctx.fillRect(-2, 10, 4, 1); }
    ctx.restore();
    ctx.restore(); // lean

    // slash arc
    if (!g && sw && sw.f <= sw.def.active[1] + 3) drawSlash(ctx, sw);
    ctx.restore();
  }

  function limb(ctx, x, y, ang, len, w, col, foot) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(ang * 0.6);
    ctx.fillStyle = col; ctx.fillRect(-w / 2, 0, w, len - 3);
    ctx.fillStyle = foot; ctx.fillRect(-w / 2, len - 4, w + 2, 4);
    ctx.restore();
  }

  function drawSlash(ctx, sw) {
    const d = sw.def, k = (sw.f - d.active[0] + 1) / (d.active[1] - d.active[0] + 4);
    if (sw.f < d.active[0]) return;
    const alpha = Math.max(0, 1 - k);
    ctx.save();
    ctx.globalAlpha = alpha;
    let cx = 6, cy = -21, R = d.reach - 4, a0, a1;
    if (d.arc === 'high') { a0 = -1.9; a1 = 0.9; }
    else if (d.arc === 'low') { a0 = 1.2; a1 = -1.3; }
    else if (d.arc === 'big') { a0 = -2.4; a1 = 1.6; R += 4; }
    else { cx = 0; cy = 2; a0 = 0.3; a1 = Math.PI - 0.3; R = d.reach - 6; }
    const ccw = a1 < a0;
    ctx.lineCap = 'round';
    ctx.strokeStyle = 'rgba(150,220,255,0.7)'; ctx.lineWidth = 7;
    ctx.beginPath(); ctx.arc(cx, cy, R - 3, a0, a1, ccw); ctx.stroke();
    ctx.strokeStyle = '#fff6d8'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(cx, cy, R, a0, a1, ccw); ctx.stroke();
    ctx.restore();
  }

  SH.draw = D;
})(window.SH = window.SH || {});
