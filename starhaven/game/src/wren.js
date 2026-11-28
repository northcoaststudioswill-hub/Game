// Starhaven — Wren's body: a small jointed figure (knees, elbows, two daggers) posed per move, drawn with a dark
// outline so she reads on any background, plus the tapered slash crescents her blades leave.
// Angles: 0 = pointing down, -1.57 = straight forward, -3.14 = straight up, +1.57 = straight back.
(function (SH) {
  const W = SH.wren = {};
  const OX = 64, OY = 96;                       // where her feet sit on the sprite canvas
  let cv = null, mask = null;
  function ensure() {
    if (cv) return;
    cv = document.createElement('canvas'); cv.width = 128; cv.height = 116;
    mask = document.createElement('canvas'); mask.width = 128; mask.height = 116;
  }
  const lerp = (a, b, k) => a + (b - a) * k;
  const easeOut = k => 1 - Math.pow(1 - Math.max(0, Math.min(1, k)), 3);
  const mix = (A, B, k) => { const o = {}; for (const key in A) { const a = A[key], b = B[key] !== undefined ? B[key] : a; o[key] = Array.isArray(a) ? [lerp(a[0], b[0], k), lerp(a[1], b[1], k)] : typeof a === 'number' ? lerp(a, b, k) : (k < 0.5 ? a : b); } return o; };

  // ---------------------------------------------------------------- poses
  const BASE = { grip: 0, lean: 0, crouch: 0, ox: 0, legF: [0.06, 0], legB: [-0.08, 0.05], armF: [-0.2, -0.35], armB: [0.28, -0.2], cloak: 0, lift: 0, sx: 1, sy: 1 };
  const P = (o) => Object.assign({}, BASE, o);
  const POSES = {
    rise: P({ legF: [-0.9, 1.1], legB: [0.35, 0.7], armF: [-2.3, -0.3], armB: [1.0, -0.4], lift: 4, sx: 0.93, sy: 1.08 }),
    apex: P({ legF: [-1.0, 1.4], legB: [-0.3, 1.2], armF: [-1.6, -0.5], armB: [1.2, -0.5] }),
    fall: P({ legF: [0.35, 0.25], legB: [-0.45, 0.6], armF: [-2.7, 0.1], armB: [2.5, -0.1], lift: -7 }),
    dash: P({ grip: 1, lean: 0.62, legF: [1.0, 0.25], legB: [1.25, 0.35], armF: [1.45, 0.1], armB: [1.7, 0.1], cloak: 1, sx: 1.1, sy: 0.92 }),
    hurt: P({ lean: -0.4, legF: [-0.6, 0.6], legB: [0.5, 0.4], armF: [-2.4, -0.5], armB: [2.2, 0.4] }),
    cast: P({ lean: 0.08, legF: [-0.35, 0.1], legB: [0.4, 0.1], armF: [-1.5, 0], armB: [0.7, -0.3] }),
    charge: P({ lean: -0.06, crouch: 2, legF: [-0.3, 0.3], legB: [0.45, 0.3], armF: [-1.15, -0.7], armB: [0.2, -1.0] }),
    bow: P({ lean: -0.04, legF: [-0.3, 0.1], legB: [0.4, 0.1], armF: [-1.52, 0], armB: [-1.0, -1.3] }),
  };
  // attacks: a wind-up pose and a strike pose; the swing eases from one to the other
  const SWINGS = {
    high: [P({ lean: -0.12, legF: [-0.2, 0.2], legB: [0.3, 0.1], armF: [-3.3, -0.5], armB: [0.9, -0.5] }),
           P({ lean: 0.32, ox: 3, legF: [-0.7, 0.35], legB: [0.6, 0.1], armF: [-0.75, 0.05], armB: [1.3, -0.3], cloak: 0.5 })],
    low: [P({ lean: 0.25, ox: 3, legF: [-0.6, 0.3], legB: [0.55, 0.1], armF: [-0.6, 0], armB: [0.5, 0.2] }),
          P({ lean: 0.05, ox: 4, legF: [-0.5, 0.2], legB: [0.6, 0.15], armF: [1.0, -0.8], armB: [-2.6, -0.2], cloak: 0.6 })],
    big: [P({ lean: -0.2, crouch: 3, legF: [-0.3, 0.5], legB: [0.3, 0.5], armF: [-3.5, -0.2], armB: [1.4, -0.6] }),
          P({ lean: 0.45, crouch: 2, ox: 7, legF: [-0.95, 0.5], legB: [0.85, 0.05], armF: [-0.35, 0.1], armB: [-2.7, -0.1], cloak: 1 })],
    down: [P({ legF: [-1.0, 1.5], legB: [-0.4, 1.4], armF: [-0.5, -0.4], armB: [0.5, 0.4] }),
           P({ legF: [-1.1, 1.6], legB: [-0.5, 1.5], armF: [0.12, 0], armB: [-0.12, 0], sx: 0.92, sy: 1.08 })],
    thrust: [P({ lean: 0.5, legF: [0.8, 0.2], legB: [1.1, 0.3], armF: [-0.4, -1.2], armB: [1.4, 0] }),
             P({ lean: 0.7, ox: 4, legF: [1.0, 0.2], legB: [1.3, 0.3], armF: [-1.52, 0], armB: [1.7, 0.1], cloak: 1, sx: 1.12, sy: 0.9 })],
    up: [P({ lean: 0.2, crouch: 4, legF: [-0.4, 0.8], legB: [0.3, 0.8], armF: [-0.2, -0.2], armB: [0.6, -0.4] }),
         P({ lean: -0.18, legF: [0.25, 0.1], legB: [-0.3, 0.7], armF: [-3.05, 0], armB: [1.1, -0.2], sx: 0.92, sy: 1.1, lift: 5 })],
  };

  W.poseOf = function (p) {
    if (p.dashT > 0 && !(p.swing && p.swing.kind === 'thrust')) return 'dash';
    if (p.stun > 0) return 'hurt';
    if (p.swing) return 'swing';
    if (p.bowT > 0) return 'bow';
    if (p.castT > 0) return 'cast';
    if (p.chargeT > 6) return 'charge';
    if (!p.grounded) return p.vy < -1 ? 'rise' : p.vy > 1.5 ? 'fall' : 'apex';
    if (Math.abs(p.vx) > 0.4) return 'run';
    return 'idle';
  };

  function buildPose(p, name, ghost) {
    const a = p.anim;
    if (name === 'run') {
      const ph = a.run * Math.PI, s = Math.sin(ph), c = Math.cos(ph);
      const sp = Math.min(1, Math.abs(p.vx) / 3.2), sw = 0.55 + 0.45 * sp;   // a walk at low speed, a full run at speed
      // each leg: the thigh swings; the knee folds as the leg comes forward and straightens to meet the ground
      const leg = (sn, cs) => [sn * 0.95 * sw - 0.08, 0.12 + Math.max(0, -cs) * 1.25 * sw + Math.max(0, cs) * 0.25];
      return P({ lean: 0.08 + 0.12 * sp, crouch: 0.4 + Math.abs(c) * 1.5 * sw, legF: leg(s, c), legB: leg(-s, -c),
        // arms pump close to the body, elbows bent; the blades lie back along her forearms (grip 1) so they do not wave about
        armF: [-s * 0.5 * sw + 0.1, -1.25 - 0.25 * Math.max(0, s)], armB: [s * 0.5 * sw + 0.25, -1.25 - 0.25 * Math.max(0, -s)], grip: 1, cloak: 0.25 + 0.5 * sp, lift: Math.abs(s) * 1.5 * sp });
    }
    if (name === 'idle') { const b = Math.sin(a.t * 0.06), b2 = Math.sin(a.t * 0.023); return P({ crouch: b * 0.6 + 0.6, lean: b2 * 0.012, armF: [-0.2 + b * 0.05, -0.35 + b2 * 0.04], armB: [0.28 - b * 0.05, -0.2], cloak: 0.06 + b2 * 0.05, sy: 1 + b * 0.008 }); }
    if (name === 'rise' || name === 'apex' || name === 'fall') {   // one continuous arc through the air, by how fast she is rising or falling
      const k = Math.max(0, Math.min(1, (p.vy + 5) / 10));
      return k < 0.5 ? mix(POSES.rise, POSES.apex, k * 2) : mix(POSES.apex, POSES.fall, (k - 0.5) * 2);
    }
    if (name === 'swing' && !ghost) {
      const s = p.swing, d = s.def, pair = SWINGS[d.arc] || SWINGS.high;
      const k = easeOut((s.f - 0.5) / Math.max(1, d.active[0] + 2));
      let pose = mix(pair[0], pair[1], k);
      // in the air the legs stay tucked
      if (!p.grounded && d.arc !== 'down' && d.arc !== 'thrust' && d.arc !== 'up') { pose.legF = [-0.9, 1.2]; pose.legB = [0.2, 0.9]; pose.crouch = 0; }
      return pose;
    }
    if (name === 'bow') { const a = p.aim || 0; return Object.assign({}, POSES.bow, { armF: [-1.52 - a, 0], armB: [-1.0 - a * 0.85, -1.3], lean: -0.04 - a * 0.08 }); }
    return POSES[name] || BASE;
  }

  // ---------------------------------------------------------------- drawing the figure (facing right, feet at 0,0)
  const COL = { skin: '#f6dcc6', hair: '#e0703f', hairD: '#a8452a', tunic: '#2f8f7a', tunicD: '#1f6656', tunicL: '#49b39a', cloak: '#2c3d74', cloakD: '#1c2850', cloakL: '#4a62a8', legs: '#3b3150', legsD: '#2a2238', boots: '#6a4430', belt: '#7a5632', blade: '#f2fbff', bladeD: '#9fc0d8', gold: '#ffd27a', goldD: '#d9973f' };

  function seg(g, len, w, col, round) { g.fillStyle = col; g.fillRect(-w / 2, 0, w, len); if (round) g.fillRect(-w / 2 + 0.5, len - 1, w - 1, 1.5); }
  function limb2(g, x, y, a1, a2, l1, l2, w, c1, c2, hand) {
    g.save(); g.translate(x, y); g.rotate(a1); seg(g, l1, w, c1);
    g.fillStyle = c1; g.beginPath(); g.arc(0, 0.5, w / 2, 0, 6.3); g.fill();                       // a rounded shoulder or hip
    g.translate(0, l1 - 1); g.beginPath(); g.arc(0, 0, w / 2, 0, 6.3); g.fill(); g.rotate(a2); seg(g, l2, w - 0.5, c2);   // and elbow or knee
    if (hand) { g.translate(0, l2); hand(g); }
    g.restore();
  }
  function dagger(g) { g.fillStyle = COL.goldD; g.fillRect(-2.5, 1, 5, 1.5); g.fillStyle = COL.blade; g.fillRect(-1, 2, 2, 9); g.fillStyle = COL.bladeD; g.fillRect(0, 2, 1, 9); g.fillStyle = COL.blade; g.fillRect(-0.5, 11, 1, 1.5); }

  function figure(g, p, S, o) {
    const mortal = SH.game.mortal, t = p.anim.t;
    const hip = -17 + S.crouch;
    g.save();
    g.translate(S.ox, 0);
    // back arm and its dagger (behind everything)
    g.save(); g.translate(0, hip); g.rotate(S.lean);
    limb2(g, -1, -13, S.armB[0], S.armB[1], 6, 6, 3.5, COL.tunicD, '#5a3e2a', gg => { gg.fillStyle = '#d9b89c'; gg.fillRect(-1.5, -1.5, 3, 3); if (o.blades) { gg.rotate(S.grip * 2.75); dagger(gg); } });
    g.restore();
    // back leg
    limb2(g, -1.5, hip, S.legB[0], S.legB[1], 9, 9, 4.5, COL.legsD, COL.legsD, gg => { gg.fillStyle = '#3a2618'; gg.fillRect(-2.2, -7, 4.4, 5); gg.fillRect(-2.5, -3, 6.5, 3.5); });
    // cloak
    g.save(); g.translate(0, hip); g.rotate(S.lean);
    const fl = S.cloak, lf = S.lift, wav = Math.sin(t * 0.25) * fl * 2;
    g.fillStyle = COL.cloakD; g.beginPath(); g.moveTo(-3, -15); g.lineTo(-10 - fl * 9, 6 + lf - fl * 9 + wav); g.lineTo(-4 - fl * 4, 9 + lf * 0.6 - fl * 5); g.lineTo(2, -13); g.fill();
    g.fillStyle = COL.cloak; g.beginPath(); g.moveTo(-3, -15); g.lineTo(-8 - fl * 8, 3 + lf - fl * 8 + wav); g.lineTo(-2, 2 + lf * 0.4); g.lineTo(3, -14); g.fill();
    g.restore();
    // front leg
    limb2(g, 1.5, hip, S.legF[0], S.legF[1], 9, 9, 5, COL.legs, COL.legs, gg => { gg.fillStyle = COL.boots; gg.fillRect(-2.6, -8, 5.2, 6); gg.fillRect(-2.5, -3.5, 7, 4); gg.fillStyle = '#8a5a3c'; gg.fillRect(-2.6, -8, 5.2, 1.2); gg.fillRect(2.5, -3.5, 2, 1); gg.fillStyle = '#3a2618'; gg.fillRect(-2.5, -0.6, 7, 1.1); });
    // torso and head lean together
    g.save(); g.translate(0, hip); g.rotate(S.lean);
    g.fillStyle = COL.tunic; g.fillRect(-5, -15, 10.5, 16);
    g.fillStyle = COL.tunicD; g.fillRect(-5, -15, 3, 16);
    g.fillStyle = COL.tunicL; g.fillRect(3.5, -14, 2, 9);
    g.fillStyle = COL.tunic; g.beginPath(); g.moveTo(-5, 0); g.lineTo(5.5, 0); g.lineTo(6.5, 4.5); g.lineTo(-6, 4.5); g.fill();                 // the tunic's skirt, flaring over the hips
    g.fillStyle = COL.tunicD; g.fillRect(-6, 0, 3, 4.5); g.fillStyle = COL.gold; g.fillRect(-6, 3.8, 12.5, 0.9);
    g.strokeStyle = '#5a3e2a'; g.lineWidth = 1.6; g.beginPath(); g.moveTo(-4.5, -14); g.lineTo(5, -3); g.stroke();                              // a strap across the chest
    g.fillStyle = COL.skin; g.beginPath(); g.moveTo(-0.5, -15); g.lineTo(3.5, -15); g.lineTo(1.5, -11.5); g.fill();                              // the open collar
    g.fillStyle = COL.tunicL; g.fillRect(-0.8, -15, 0.8, 3.5); g.fillRect(3.3, -15, 0.8, 3);
    g.fillStyle = COL.belt; g.fillRect(-5, -2, 10.5, 2.5); g.fillStyle = COL.gold; g.fillRect(1, -2, 2.5, 2.5); g.fillStyle = '#5a3e2a'; g.fillRect(-4.5, 0, 3.2, 3.2);
    // scarf knot at the neck (the tail is drawn in the world so it can trail)
    g.fillStyle = COL.gold; g.fillRect(-4, -17, 9, 3); g.fillStyle = COL.goldD; g.fillRect(-4, -15, 9, 1);
    // head
    const hy = -28;
    const tail = S.cloak * 3 + Math.sin(t * 0.2) * S.cloak;
    // the braid, in knots, swinging behind her; tied with gold
    for (let i = 0; i < 4; i++) { const bx = -7.5 - i * 2.2 - tail * 0.25 * i, by = hy + 3 + i * 3 + S.lift * 0.3 * i - tail * 0.35 * i; g.fillStyle = i % 2 ? COL.hairD : COL.hair; g.beginPath(); g.arc(bx, by, 2.5 - i * 0.25, 0, 6.3); g.fill(); if (i === 3) { g.fillStyle = COL.gold; g.fillRect(bx - 1.5, by + 1, 3, 1.4); } }
    // the head: a soft jaw, not a box
    g.fillStyle = COL.skin; g.beginPath(); g.moveTo(-3, hy); g.lineTo(6.5, hy); g.lineTo(6.8, hy + 6); g.lineTo(5, hy + 10.5); g.lineTo(0, hy + 11); g.lineTo(-3.5, hy + 8); g.fill();
    g.fillStyle = '#e2b89c'; g.beginPath(); g.moveTo(-3.5, hy + 7.5); g.lineTo(0, hy + 11); g.lineTo(5, hy + 10.5); g.lineTo(5.6, hy + 9); g.lineTo(0.5, hy + 9.5); g.fill();   // shade under the jaw
    g.fillStyle = COL.skin; g.fillRect(-0.5, hy + 10, 3, 3.5);                                                                                  // neck
    if (!mortal) { g.fillStyle = '#ffe9a8'; g.fillRect(2.4, hy + 7.2, 0.9, 0.9); g.fillRect(4.2, hy + 7.6, 0.9, 0.9); g.fillRect(3.2, hy + 8.4, 0.9, 0.9); g.globalAlpha = 0.25 + 0.15 * Math.sin(t * 0.05); g.fillRect(1.8, hy + 6.6, 4, 3); g.globalAlpha = 1; }  // her freckles glow: she is Lit
    // hair: a full crown swept back, a fringe over the brow, one bright strand
    g.fillStyle = COL.hair; g.beginPath(); g.moveTo(-5.5, hy + 7); g.quadraticCurveTo(-7.5, hy - 2, -2, hy - 4); g.quadraticCurveTo(4, hy - 5, 7.5, hy - 1); g.lineTo(7.2, hy + 2.2); g.lineTo(4.5, hy + 0.6); g.lineTo(1.5, hy + 2.6); g.lineTo(-1.5, hy + 1); g.lineTo(-2.5, hy + 7.5); g.fill();
    g.fillStyle = COL.hairD; g.beginPath(); g.moveTo(-5.5, hy + 7); g.quadraticCurveTo(-6.5, hy + 2, -4, hy - 1); g.lineTo(-3, hy + 7.5); g.fill();
    g.strokeStyle = '#f7a878'; g.lineWidth = 1; g.beginPath(); g.moveTo(-2, hy - 2.6); g.quadraticCurveTo(2.5, hy - 3.8, 6, hy - 0.8); g.stroke();
    if (o.face) {
      g.fillStyle = COL.hairD; g.fillRect(3.2, hy + 3.2, 3, 0.8);                                                                                // brow
      if (o.blink) { g.fillStyle = '#b08a72'; g.fillRect(3.5, hy + 5.2, 2.6, 0.9); }
      else { g.fillStyle = '#ffffff'; g.fillRect(3.3, hy + 4.4, 3, 2.4); g.fillStyle = mortal ? '#4a6a3a' : '#2f8f7a'; g.fillRect(4.3, hy + 4.4, 1.8, 2.4); g.fillStyle = '#1a1430'; g.fillRect(4.8, hy + 4.8, 1, 1.6); g.fillStyle = '#ffffff'; g.fillRect(5.3, hy + 4.5, 0.7, 0.7); }
      g.fillStyle = '#e2b89c'; g.fillRect(6.6, hy + 6.2, 1, 1.4);                                                                               // nose
      g.fillStyle = '#c8806a'; g.fillRect(4.6, hy + 8.6, 1.9, 0.8);                                                                             // mouth
      g.globalAlpha = 0.3; g.fillStyle = '#ff7a8a'; g.fillRect(2.2, hy + 6.6, 2.2, 1.6); g.globalAlpha = 1;                                      // a little colour in the cheek
    }
    // front arm, its dagger, and anything in the hand
    limb2(g, 1.5, -13, S.armF[0], S.armF[1], 6.5, 6.5, 4, COL.tunic, '#7a5636', gg => { gg.fillStyle = '#c8a878'; gg.fillRect(-2.2, -6.5, 4.4, 1); gg.fillStyle = COL.skin; gg.fillRect(-1.7, -1.6, 3.4, 3.2); const h = o.hand || (o.blades ? dagger : null); if (h) { if (!o.hand) gg.rotate(S.grip * 2.75); h(gg); } });
    g.restore();
    g.restore();
  }

  function fireHand(size) { return g => { g.fillStyle = 'rgba(255,150,60,0.45)'; g.fillRect(-size, 0, size * 2, size * 2); g.fillStyle = '#ff8a3a'; g.fillRect(-size * 0.6, size * 0.3, size * 1.2, size * 1.2); g.fillStyle = '#ffe08a'; g.fillRect(-size * 0.25, size * 0.5, size * 0.6, size * 0.8); }; }
  function bowHand(pull) { return g => {
    const H = Math.PI / 2;
    g.strokeStyle = '#8a5a2a'; g.lineWidth = 2; g.beginPath(); g.arc(0, -6, 10, H - 1.25, H + 1.25); g.stroke();
    g.strokeStyle = '#e8e0c8'; g.lineWidth = 1; g.beginPath(); g.moveTo(9.5, -2.8); g.lineTo(0, pull ? -11 : -2.8); g.lineTo(-9.5, -2.8); g.stroke();
  }; }

  // ---------------------------------------------------------------- the public draw
  W.draw = function (ctx, p, opt) {
    ensure();
    const gh = opt.ghost;
    if (!gh && p.hidden) return;
    let x = gh ? gh.x : p.x, y = gh ? gh.y : p.y; const f = gh ? gh.facing : p.facing;
    const name = gh ? gh.pose : W.poseOf(p);
    let S = buildPose(p, name, !!gh);
    const a = p.anim;
    if (!gh) {
      // ease from the last pose into this one, so she never snaps between standing, running, jumping and striking
      if (a.pose && a.poseF === f) {
        if (a.poseT === a.t) S = a.pose;
        else if (a.t - a.poseT <= 2) S = mix(a.pose, S, name === 'swing' ? 0.75 : name === 'dash' || name === 'hurt' ? 0.6 : name === 'run' ? 0.45 : 0.3);
      }
      a.pose = S; a.poseT = a.t; a.poseF = f;
      // the world is drawn on whole pixels; she is drawn exactly where she is, so she glides instead of ticking
      const cam = SH.game.world && SH.game.world.cam;
      if (cam) { x += Math.round(cam.x) - cam.x; y += Math.round(cam.y) - cam.y; }
    }

    if (!gh) {
      // the scarf's tail trails in the world
      ctx.lineCap = 'round';
      for (let i = 1; i < p.scarf.length; i++) {
        const q0 = p.scarf[i - 1], q1 = p.scarf[i];
        ctx.strokeStyle = i % 2 ? COL.gold : COL.goldD; ctx.lineWidth = Math.max(1.5, 4.5 - i * 0.8);
        ctx.beginPath(); ctx.moveTo(q0.x, q0.y); ctx.lineTo(q1.x, q1.y); ctx.stroke();
      }
    }

    // draw the figure onto its own small canvas, then stamp a dark outline and the figure into the world
    const g = cv.getContext('2d');
    g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, cv.width, cv.height);
    let sx = S.sx, sy = S.sy;
    if (!gh && a.land > 0) { const k = a.squash * (a.land / 8); sx = 1 + k * 0.22; sy = 1 - k * 0.2; }
    g.translate(OX, OY); g.scale(sx, sy);
    const bowMode = SH.game.can('bow') && !SH.game.can('daggers');
    const o = { face: true, blink: name === 'idle' && a.t % 230 < 7, blades: !bowMode && name !== 'cast' && name !== 'charge' };
    if (bowMode || (name === 'bow' && SH.game.can('fbow'))) o.hand = bowHand(p.bowT > 8);
    if (name === 'cast') o.hand = fireHand(5);
    if (name === 'charge') o.hand = fireHand(3 + Math.min(6, p.chargeT / 6));
    figure(g, p, S, o);
    if (!gh) {   // form light over the whole figure: warm from above, cool shadow toward her feet, a rim on her leading edge
      g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = 'source-atop';
      const lg = g.createLinearGradient(0, OY - 46, 0, OY); lg.addColorStop(0, 'rgba(255,240,205,0.22)'); lg.addColorStop(0.5, 'rgba(255,240,205,0)'); lg.addColorStop(1, 'rgba(24,16,70,0.30)'); g.fillStyle = lg; g.fillRect(0, 0, cv.width, cv.height);
      const rg = g.createLinearGradient(OX - 2, 0, OX + 12, 0); rg.addColorStop(0, 'rgba(200,214,255,0)'); rg.addColorStop(1, 'rgba(200,214,255,0.16)'); g.fillStyle = rg; g.fillRect(0, 0, cv.width, cv.height);
      g.globalCompositeOperation = 'source-over';
    }

    const m = mask.getContext('2d');
    m.globalCompositeOperation = 'source-over'; m.clearRect(0, 0, mask.width, mask.height); m.drawImage(cv, 0, 0);
    m.globalCompositeOperation = 'source-in';
    m.fillStyle = gh ? '#8cdcff' : p.hitFlash > 0 ? '#ffffff' : '#0a0818'; m.fillRect(0, 0, mask.width, mask.height);

    ctx.save();
    if (gh) ctx.translate(Math.round(x), Math.round(y)); else { ctx.translate(x, y); ctx.imageSmoothingEnabled = true; }
    ctx.scale(f, 1);
    if (!gh && p.invuln > 0 && p.stun <= 0) ctx.globalAlpha = 0.5 + 0.4 * Math.abs(Math.sin(p.invuln * 0.3));   // safe after a hit: she shimmers, she does not vanish
    if (gh) { ctx.globalAlpha = 0.4 * gh.life / gh.max; ctx.drawImage(mask, -OX, -OY); }
    else {
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) ctx.drawImage(mask, -OX + dx, -OY + dy);
      ctx.drawImage(cv, -OX, -OY);
      ctx.globalAlpha = 1;
      if (p.swing && p.swing.f <= p.swing.def.frames) slash(ctx, p.swing);
    }
    ctx.restore(); ctx.imageSmoothingEnabled = false;
  };

  // ---------------------------------------------------------------- slash crescents
  // A crescent is a tapered arc: thick in the middle, pointed at both ends, swept from a0 to a1.
  function crescent(ctx, cx, cy, R, a0, a1, u0, u1, thick, alpha, core) {
    if (u1 - u0 < 0.02 || alpha <= 0) return;
    const N = 12, pts = [];
    for (let i = 0; i <= N; i++) { const u = u0 + (u1 - u0) * i / N, ang = a0 + (a1 - a0) * u; pts.push([cx + Math.cos(ang) * R, cy + Math.sin(ang) * R]); }
    for (let i = N; i >= 0; i--) { const u = u0 + (u1 - u0) * i / N, ang = a0 + (a1 - a0) * u, r = R - thick * Math.sin(Math.PI * (i / N)); pts.push([cx + Math.cos(ang) * r, cy + Math.sin(ang) * r]); }
    ctx.globalAlpha = alpha;
    ctx.fillStyle = core; ctx.beginPath(); pts.forEach((q, i) => i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1])); ctx.closePath(); ctx.fill();
    ctx.globalAlpha = 1;
  }
  const ARCS = {
    high: [{ cx: 3, cy: -26, R: 32, a0: -2.3, a1: 0.75, th: 11 }],
    low: [{ cx: 3, cy: -22, R: 32, a0: 1.35, a1: -1.6, th: 11 }],
    big: [{ cx: 4, cy: -24, R: 40, a0: -2.6, a1: 1.0, th: 14 }, { cx: 6, cy: -24, R: 36, a0: 1.5, a1: -2.0, th: 11 }],
    down: [{ cx: 0, cy: -8, R: 30, a0: 0.15, a1: Math.PI - 0.15, th: 11 }, { cx: 0, cy: -8, R: 24, a0: Math.PI - 0.3, a1: 0.3, th: 7 }],
    up: [{ cx: 4, cy: -28, R: 38, a0: 1.0, a1: -2.2, th: 13 }],
  };
  function slash(ctx, s) {
    const d = s.def, st = d.active[0], en = d.active[1];
    if (s.f < st) return;
    const k = Math.min(1, (s.f - st + 1) / Math.max(2, (en - st) * 0.6));     // the head of the cut races ahead
    const fade = s.f > en ? Math.max(0, 1 - (s.f - en) / 5) : 1;
    const tail = s.f > en ? Math.min(1, (s.f - en) / 4) : Math.max(0, k - 0.8);
    if (d.arc === 'thrust') {
      // a lance of light straight ahead
      const len = 26 + 34 * easeOut(k);
      ctx.globalAlpha = fade * 0.5; ctx.fillStyle = '#9fe8ff'; ctx.beginPath(); ctx.moveTo(8, -30); ctx.lineTo(8 + len + 8, -24); ctx.lineTo(8, -18); ctx.fill();
      ctx.globalAlpha = fade; ctx.fillStyle = '#fffbe8'; ctx.beginPath(); ctx.moveTo(10, -27); ctx.lineTo(10 + len, -24); ctx.lineTo(10, -21); ctx.fill();
      ctx.globalAlpha = 1; return;
    }
    for (const A of ARCS[d.arc] || ARCS.high) {
      crescent(ctx, A.cx, A.cy, A.R + 3, A.a0, A.a1, tail, k, A.th + 5, fade * 0.45, '#8fdcff');
      crescent(ctx, A.cx, A.cy, A.R, A.a0, A.a1, tail, k, A.th, fade, '#fffbe8');
      crescent(ctx, A.cx, A.cy, A.R - 1, A.a0, A.a1, Math.max(tail, k - 0.35), k, A.th * 0.45, fade, '#ffe9a8');
    }
  }
})(window.SH = window.SH || {});
