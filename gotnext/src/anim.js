// GOT NEXT — the animation library. Builds on the existing rig and poses (gfx.js), it does not replace them.
//   1. skeleton map        which joints exist, which half of the body they belong to, left/right mirroring
//   2. evaluation          keyframe tracks over a normalised phase, joint rotations as quaternions
//   3. blending            N poses at weights, per joint, quaternion-averaged (no Euler wobble)
//   4. styles              three jump shots and three idles, all phase-synced (the release is always at u = 1)
//   5. profiles            a persistent movement identity per player: style weights, posture, timing, hand
//   6. transitions         how fast to blend out of the pose you are in, per pair of actions
//   7. layers              additive (breathing, weight shift, fatigue, personality) and corrective (landing)
// Gameplay never reads anything in here: release timing, speeds and hit boxes stay where they were.
'use strict';

// ---------------- 1. skeleton map ----------------
const SKEL = {
  joints: ['hips', 'spine', 'chest', 'neck', 'head', 'shR', 'elR', 'wrR', 'shL', 'elL', 'wrL', 'hpR', 'knR', 'anR', 'hpL', 'knL', 'anL'],
  lower: ['hips', 'hpR', 'knR', 'anR', 'hpL', 'knL', 'anL'],
  upper: ['spine', 'chest', 'neck', 'head', 'shR', 'elR', 'wrR', 'shL', 'elL', 'wrL'],
};
// a left-hander: swap the sides and mirror the rotations about the body's midline (y and z flip sign)
function mirrorPose(P) {
  const o = { y: P.y, rate: P.rate };
  for (const k in P) { if (k === 'y' || k === 'rate') continue; const v = P[k]; if (!Array.isArray(v)) { o[k] = v; continue; }
    const m = k.endsWith('R') ? k.slice(0, -1) + 'L' : k.endsWith('L') ? k.slice(0, -1) + 'R' : k; o[m] = [v[0], -v[1], -v[2]]; }
  return o;
}

// ---------------- 2/3. evaluation and blending ----------------
const _aq = new THREE.Quaternion(), _aq2 = new THREE.Quaternion(), _ae = new THREE.Euler(), _acc = {};
// list: [[pose, weight], ...]. Each joint's rotations are turned into quaternions, sign-aligned and averaged.
function blendPoses(list) {
  let wsum = 0; for (const [, w] of list) wsum += Math.max(0, w); if (wsum <= 0) return list[0][0];
  if (list.length === 1 || list.filter(l => l[1] > 0).length === 1) return list.find(l => l[1] > 0)[0];
  const out = { y: 0, rate: 0 }, keys = new Set();
  for (const [P, w] of list) { if (w <= 0) continue; for (const k in P) keys.add(k); out.y += (P.y || 0) * w / wsum; out.rate = Math.max(out.rate, P.rate || 16); }
  for (const k of keys) {
    if (k === 'y' || k === 'rate') continue; let x = 0, y = 0, z = 0, ww = 0, first = null;
    for (const [P, w] of list) { if (w <= 0) continue; const v = P[k] || POSE.zero; _aq.setFromEuler(_ae.set(v[0], v[1], v[2]));
      if (!first) first = _aq2.copy(_aq); else if (first.dot(_aq) < 0) { _aq.x = -_aq.x; _aq.y = -_aq.y; _aq.z = -_aq.z; _aq.w = -_aq.w; }
      x += _aq.x * w; y += _aq.y * w; z += _aq.z * w; ww += _aq.w * w; }
    _aq.set(x, y, z, ww).normalize(); _ae.setFromQuaternion(_aq); out[k] = [_ae.x, _ae.y, _ae.z];
  }
  return out;
}
// two poses, quaternion slerp per joint (the two-way case of blendPoses, kept for transitions and tracks)
function slerpPose(A, B, t) { return t <= 0 ? A : t >= 1 ? B : blendPoses([[A, 1 - t], [B, t]]); }
// a keyframe track: [[u, pose], ...] sorted by u. Smoothstep between neighbouring keys.
function evalTrack(K, u) {
  if (u <= K[0][0]) return K[0][1]; const L = K[K.length - 1]; if (u >= L[0]) return L[1];
  let i = 0; while (K[i + 1][0] < u) i++; const a = K[i], b = K[i + 1], t = (u - a[0]) / (b[0] - a[0]);
  return slerpPose(a[1], b[1], t * t * (3 - 2 * t));
}
// pose builder: the same vocabulary as poseOf (legs, arms), so the styles read like the poses they extend
function mkPose(f) {
  const p = { y: 0, rate: 20 }, S_ = (k, x, y, z) => { p[k] = [x || 0, y || 0, z || 0]; };
  const legs = (hr, kr, hl, kl, spread) => { S_('hpR', hr, 0, -(spread || 0)); S_('knR', kr); S_('hpL', hl, 0, spread || 0); S_('knL', kl); S_('anR', -(hr + kr) * 0.55); S_('anL', -(hl + kl) * 0.55); };
  f(S_, legs, p); return p;
}

// ---------------- 4. styles ----------------
// Shot phases (u = t / release time). Every style hits the same beats, so any blend of them still releases at u = 1.
const SHOT_PH = { gather: 0, dip: 0.4, extend: 0.62, jump: 0.75, set: 0.9, release: 1.0, follow: 1.12, land: 1.42, recover: 1.6 };
const _shotKeys = {};
function shotTrack(style) {
  if (_shotKeys[style]) return _shotKeys[style];
  const H = SHOT_PH; let K;
  if (style === 'trad') {          // the game's original jumper, kept as the foundation (its three poses are the dip, set and follow keys)
    const dip = mkPose((S_, legs, p) => { p.y = -0.13; legs(-0.45, 0.7, -0.45, 0.7, 0.06); S_('spine', 0.12); S_('chest', 0.08); S_('neck', -0.12); S_('shR', -1.0, 0, 0.1); S_('shL', -0.95, 0, -0.3); S_('elR', -2.2); S_('elL', -2.0); S_('wrR', 0.7); S_('wrL', 0.2); });
    const set = mkPose((S_, legs) => { legs(-0.05, 0.12, 0, 0.12, 0.04); S_('anR', 0.7); S_('anL', 0.7); S_('spine', -0.03); S_('chest', -0.06); S_('neck', -0.05); S_('shR', -2.55, 0, 0.05); S_('shL', -2.35, 0, -0.32); S_('elR', -1.55); S_('elL', -1.25); S_('wrR', 0.95); S_('wrL', 0.3); });
    const follow = mkPose((S_, legs) => { legs(0.05, 0.05, 0, 0, 0.03); S_('anR', 0.9); S_('anL', 0.9); S_('spine', -0.05); S_('chest', -0.04); S_('neck', -0.1); S_('shR', -2.95, 0, 0); S_('elR', -0.08); S_('wrR', -1.25); S_('shL', -2.1, 0, -0.4); S_('elL', -0.95); S_('wrL', -0.1); });
    K = [[H.gather, slerpPose(dip, set, 0.0)], [H.dip, dip], [H.extend, slerpPose(dip, set, 0.55)], [H.set, set], [H.release, slerpPose(set, follow, 0.45)], [H.follow, follow], [H.land, slerpPose(follow, dip, 0.2)], [H.recover, slerpPose(follow, dip, 0.65)]];
  } else if (style === 'high') {     // high release: the ball goes up over the head, long arm, big ankle extension
    const dip = mkPose((S_, legs, p) => { p.y = -0.11; legs(-0.4, 0.62, -0.4, 0.62, 0.05); S_('spine', 0.08); S_('chest', 0.04); S_('neck', -0.1); S_('shR', -1.35, 0, 0.08); S_('shL', -1.25, 0, -0.28); S_('elR', -2.1); S_('elL', -1.9); S_('wrR', 0.75); S_('wrL', 0.25); });
    const set = mkPose((S_, legs) => { legs(0, 0.06, 0.02, 0.08, 0.04); S_('anR', 0.95); S_('anL', 0.95); S_('spine', -0.08); S_('chest', -0.1); S_('neck', 0.02); S_('shR', -2.95, 0, 0.02); S_('shL', -2.75, 0, -0.28); S_('elR', -1.05); S_('elL', -0.9); S_('wrR', 1.1); S_('wrL', 0.35); });
    const follow = mkPose((S_, legs) => { legs(0.04, 0.04, 0.02, 0.02, 0.03); S_('anR', 1.0); S_('anL', 1.0); S_('spine', -0.08); S_('chest', -0.06); S_('neck', -0.02); S_('shR', -3.1, 0, 0); S_('elR', 0); S_('wrR', -1.35); S_('shL', -2.5, 0, -0.35); S_('elL', -0.6); S_('wrL', -0.15); });
    K = [[H.gather, slerpPose(dip, set, 0.05)], [H.dip, dip], [H.extend, slerpPose(dip, set, 0.6)], [H.set, set], [H.release, slerpPose(set, follow, 0.4)], [H.follow, follow], [H.land, slerpPose(follow, dip, 0.15)], [H.recover, slerpPose(follow, dip, 0.6)]];
  } else {                           // quick release: compact, the ball never goes behind the forehead, shallow dip
    const dip = mkPose((S_, legs, p) => { p.y = -0.08; legs(-0.32, 0.5, -0.32, 0.5, 0.07); S_('spine', 0.14); S_('chest', 0.1); S_('neck', -0.14); S_('shR', -1.25, 0, 0.12); S_('shL', -1.2, 0, -0.28); S_('elR', -2.1); S_('elL', -1.9); S_('wrR', 0.8); S_('wrL', 0.25); });
    const set = mkPose((S_, legs) => { legs(-0.06, 0.16, -0.04, 0.16, 0.05); S_('anR', 0.6); S_('anL', 0.6); S_('spine', 0.02); S_('chest', -0.02); S_('neck', -0.1); S_('shR', -2.2, 0, 0.1); S_('shL', -2.05, 0, -0.34); S_('elR', -1.75); S_('elL', -1.45); S_('wrR', 0.9); S_('wrL', 0.3); });
    const follow = mkPose((S_, legs) => { legs(0.04, 0.08, 0, 0.06, 0.04); S_('anR', 0.75); S_('anL', 0.75); S_('spine', 0); S_('chest', -0.02); S_('neck', -0.1); S_('shR', -2.7, 0, 0.04); S_('elR', -0.25); S_('wrR', -1.15); S_('shL', -1.8, 0, -0.4); S_('elL', -1.1); S_('wrL', -0.1); });
    K = [[H.gather, slerpPose(dip, set, 0.15)], [H.dip - 0.08, dip], [H.extend - 0.05, slerpPose(dip, set, 0.65)], [H.set - 0.05, set], [H.release, slerpPose(set, follow, 0.5)], [H.follow - 0.02, follow], [H.land - 0.1, slerpPose(follow, dip, 0.3)], [H.recover - 0.1, slerpPose(follow, dip, 0.7)]];
  }
  return (_shotKeys[style] = K);
}
const SHOT_STYLES = [['trad', 'Traditional'], ['high', 'High release'], ['quick', 'Quick release']];
// ---- shot bases: a jumper can also be put together from a lower base (feet, knees, hips) and an upper base (the release).
// '' means "use the blend above" for that half. Every base keeps the same beats, so the release still lands at u = 1.
const LOWER_BASES = [['', 'From the blend'], ['trad', 'Square'], ['high', 'Tall'], ['quick', 'Compact'], ['hop', 'Hop'], ['wide', 'Wide base'], ['stag', 'Staggered'], ['sway', 'Sway'], ['set', 'Set shot']];
const UPPER_BASES = [['', 'From the blend'], ['trad', 'Textbook'], ['high', 'High release'], ['quick', 'Quick release'], ['push', 'Two-hand push'], ['over', 'Over the head'], ['sling', 'Slingshot'], ['flick', 'One-hand flick'], ['ear', 'Cocked by the ear']];
const _TR = {
  dip: (S_, legs, p) => { p.y = -0.13; legs(-0.45, 0.7, -0.45, 0.7, 0.06); S_('spine', 0.12); S_('chest', 0.08); S_('neck', -0.12); S_('shR', -1.0, 0, 0.1); S_('shL', -0.95, 0, -0.3); S_('elR', -2.2); S_('elL', -2.0); S_('wrR', 0.7); S_('wrL', 0.2); },
  set: (S_, legs) => { legs(-0.05, 0.12, 0, 0.12, 0.04); S_('anR', 0.7); S_('anL', 0.7); S_('spine', -0.03); S_('chest', -0.06); S_('neck', -0.05); S_('shR', -2.55, 0, 0.05); S_('shL', -2.35, 0, -0.32); S_('elR', -1.55); S_('elL', -1.25); S_('wrR', 0.95); S_('wrL', 0.3); },
  follow: (S_, legs) => { legs(0.05, 0.05, 0, 0, 0.03); S_('anR', 0.9); S_('anL', 0.9); S_('spine', -0.05); S_('chest', -0.04); S_('neck', -0.1); S_('shR', -2.95, 0, 0); S_('elR', -0.08); S_('wrR', -1.25); S_('shL', -2.1, 0, -0.4); S_('elL', -0.95); S_('wrL', -0.1); },
};
const _BASE = {
  // lower
  hop: { dip: (S_, legs, p) => { p.y = -0.2; legs(-0.62, 0.98, -0.62, 0.98, 0.03); }, set: (S_, legs) => { legs(-0.14, 0.34, -0.14, 0.34, 0.02); S_('anR', 0.95); S_('anL', 0.95); }, follow: (S_, legs) => { legs(0.02, 0.1, 0.02, 0.1, 0.02); S_('anR', 1.0); S_('anL', 1.0); } },
  wide: { dip: (S_, legs, p) => { p.y = -0.15; legs(-0.5, 0.78, -0.5, 0.78, 0.2); }, set: (S_, legs) => { legs(-0.04, 0.12, -0.04, 0.12, 0.16); S_('anR', 0.7); S_('anL', 0.7); }, follow: (S_, legs) => { legs(0.03, 0.05, 0.03, 0.05, 0.14); S_('anR', 0.85); S_('anL', 0.85); } },
  stag: { dip: (S_, legs, p) => { p.y = -0.13; legs(-0.66, 0.78, -0.26, 0.66, 0.07); }, set: (S_, legs) => { legs(-0.2, 0.18, 0.08, 0.1, 0.05); S_('anR', 0.6); S_('anL', 0.8); }, follow: (S_, legs) => { legs(-0.1, 0.06, 0.08, 0.04, 0.04); S_('anR', 0.8); S_('anL', 0.9); } },
  sway: { dip: (S_, legs, p) => { p.y = -0.14; legs(-0.48, 0.72, -0.48, 0.72, 0.06); }, set: (S_, legs) => { legs(-0.3, 0.1, -0.3, 0.1, 0.05); S_('anR', 0.5); S_('anL', 0.5); S_('hips', -0.12); }, follow: (S_, legs) => { legs(-0.44, 0.06, -0.44, 0.06, 0.05); S_('anR', 0.4); S_('anL', 0.4); S_('hips', -0.17); } },
  set: { dip: (S_, legs, p) => { p.y = -0.07; legs(-0.25, 0.4, -0.25, 0.4, 0.08); }, set: (S_, legs) => { legs(-0.03, 0.06, -0.03, 0.06, 0.08); S_('anR', 0.3); S_('anL', 0.3); }, follow: (S_, legs) => { legs(0, 0.02, 0, 0.02, 0.08); S_('anR', 0.45); S_('anL', 0.45); } },
  // upper
  push: { dip: (S_) => { S_('shR', -0.9, 0, 0.15); S_('shL', -0.9, 0, -0.15); S_('elR', -2.15); S_('elL', -2.15); S_('wrR', 0.5); S_('wrL', 0.5); }, set: (S_) => { S_('spine', 0.02); S_('chest', 0); S_('shR', -1.7, 0, 0.16); S_('shL', -1.7, 0, -0.16); S_('elR', -1.95); S_('elL', -1.95); S_('wrR', 0.7); S_('wrL', 0.7); }, follow: (S_) => { S_('shR', -2.6, 0, 0.1); S_('shL', -2.6, 0, -0.1); S_('elR', -0.15); S_('elL', -0.15); S_('wrR', -1.0); S_('wrL', -1.0); } },
  over: { dip: () => { }, set: (S_) => { S_('spine', -0.1); S_('chest', -0.16); S_('neck', 0.05); S_('shR', -3.0, 0, 0.02); S_('elR', -2.0); S_('wrR', 1.1); S_('shL', -2.9, 0, -0.25); S_('elL', -1.8); S_('wrL', 0.4); }, follow: (S_) => { S_('spine', -0.08); S_('chest', -0.08); S_('shR', -3.08, 0, 0); S_('elR', -0.04); S_('wrR', -1.35); S_('shL', -2.4, 0, -0.35); S_('elL', -0.8); } },
  sling: { dip: (S_) => { S_('chest', 0.08, 0.32, 0); S_('shR', -0.35, 0, -0.25); S_('elR', -1.6); S_('wrR', 0.4); S_('shL', -0.75, 0, -0.6); S_('elL', -1.5); }, set: (S_) => { S_('chest', -0.04, 0.16, 0); S_('shR', -1.9, 0, -0.1); S_('elR', -1.7); S_('wrR', 0.9); S_('shL', -1.7, 0, -0.42); S_('elL', -1.4); }, follow: (S_) => { S_('chest', -0.04, -0.06, 0); S_('shR', -2.9, 0, 0); S_('elR', -0.1); S_('wrR', -1.25); S_('shL', -1.6, 0, -0.4); S_('elL', -1.0); } },
  flick: { dip: (S_) => { S_('shR', -1.25, 0, 0.12); S_('elR', -2.1); S_('shL', -1.1, 0, -0.28); S_('elL', -1.9); }, set: (S_) => { S_('shR', -2.45, 0, 0.06); S_('elR', -1.6); S_('wrR', 1.0); S_('shL', -1.2, 0, -0.3); S_('elL', -1.5); S_('wrL', 0.1); }, follow: (S_) => { S_('shR', -3.0, 0, 0); S_('elR', -0.05); S_('wrR', -1.4); S_('shL', -0.5, 0, -0.3); S_('elL', -0.6); S_('wrL', 0); } },
  ear: { dip: () => { }, set: (S_) => { S_('neck', -0.05, 0.12, 0); S_('shR', -2.3, 0, -0.25); S_('elR', -2.25); S_('wrR', 1.1); S_('shL', -2.2, 0, -0.45); S_('elL', -1.5); }, follow: (S_) => { S_('shR', -2.9, 0, -0.05); S_('elR', -0.1); S_('wrR', -1.2); S_('shL', -2.0, 0, -0.4); S_('elL', -1.0); } },
};
const _baseKeys = {};
function baseTrack(id) {
  if (id === 'trad' || id === 'high' || id === 'quick') return shotTrack(id);
  if (_baseKeys[id]) return _baseKeys[id]; const B = _BASE[id]; if (!B) return shotTrack('trad'); const H = SHOT_PH;
  const mk = k => mkPose((S_, legs, p) => { _TR[k](S_, legs, p); B[k](S_, legs, p); }), dip = mk('dip'), set = mk('set'), follow = mk('follow');
  return (_baseKeys[id] = [[H.gather, slerpPose(dip, set, 0.0)], [H.dip, dip], [H.extend, slerpPose(dip, set, 0.55)], [H.set, set], [H.release, slerpPose(set, follow, 0.45)], [H.follow, follow], [H.land, slerpPose(follow, dip, 0.2)], [H.recover, slerpPose(follow, dip, 0.65)]]);
}
function validBase(list, id) { return list.some(b => b[0] === id) ? id : ''; }

const IDLE_STYLES = [['relaxed', 'Relaxed'], ['athletic', 'Athletic'], ['wide', 'Wide']];
// idles: the original idle is "relaxed"; the others are built in the same terms
function idleBase(style, t) {
  const b = Math.sin(t * 2);
  if (style === 'relaxed') return mkPose((S_, legs, p) => { p.rate = 16; p.y = b * 0.006; S_('shR', 0.05, 0, -0.1); S_('shL', 0.05, 0, 0.1); S_('elR', -0.25); S_('elL', -0.25); S_('wrR', -0.1); S_('wrL', -0.1); S_('spine', 0.03); S_('chest', 0.02 + b * 0.02); S_('neck', -0.03); S_('hips', 0, 0, 0.03); S_('hpR', 0, 0, -0.06); S_('hpL', 0, 0, 0.1); });
  if (style === 'athletic') return mkPose((S_, legs, p) => { p.rate = 16; p.y = -0.07; legs(-0.32, 0.5, -0.3, 0.48, 0.1); S_('spine', 0.16); S_('chest', 0.06); S_('neck', -0.16); S_('shR', -0.3, 0, -0.18); S_('shL', -0.3, 0, 0.18); S_('elR', -0.75); S_('elL', -0.75); S_('wrR', 0.05); S_('wrL', 0.05); });
  return mkPose((S_, legs, p) => { p.rate = 16; p.y = -0.04; legs(-0.12, 0.25, -0.12, 0.25, 0.2); S_('anR', 0.05, 0, 0.12); S_('anL', 0.05, 0, -0.12); S_('hips', -0.02); S_('spine', 0.02); S_('chest', -0.04); S_('neck', -0.02); S_('shR', 0.02, 0, -0.22); S_('shL', 0.02, 0, 0.22); S_('elR', -0.35); S_('elL', -0.35); S_('wrR', -0.12); S_('wrL', -0.12); });
}

// ---------------- 5. profiles ----------------
// A profile is how a player physically expresses an action. It is cosmetic: it never changes a gameplay number.
// Built-in players get one from their name and build (so the same AI player always moves the same way); your own
// builds keep theirs in the save (S.anim, per build), editable in the Dev Room's ANIM LAB.
const PROF_KEYS = [
  ['knee', 'Knee bend', 0.6, 1.4], ['elbow', 'Elbow flare', -1, 1], ['lean', 'Torso lean', -1, 1], ['stance', 'Stance width', 0.6, 1.5],
  ['follow', 'Follow-through hold', 0.5, 1.6], ['shoulder', 'Shoulder turn', -1, 1], ['cadence', 'Idle tempo', 0.6, 1.5], ['intensity', 'Movement intensity', 0.6, 1.4],
  ['recovery', 'Recovery speed', 0.6, 1.5], ['restless', 'Idle restlessness', 0, 1], ['dribLow', 'Dribble crouch', -1, 1], ['defLow', 'Defensive crouch', -1, 1], ['arms', 'Run arm carry', -1, 1], ['swag', 'Walk swagger', 0, 1],
];
const PROF_DEF = { lower: '', upper: '', shot: { trad: 1, high: 0, quick: 0 }, idle: { relaxed: 1, athletic: 0, wide: 0 }, hand: 'R', knee: 1, elbow: 0, lean: 0, stance: 1, follow: 1, shoulder: 0, cadence: 1, intensity: 1, recovery: 1, restless: 0.4, dribLow: 0, defLow: 0, arms: 0, swag: 0.3 };
function hashStr(s) { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
function seededRnd(seed) { let a = seed || 1; return () => { a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
function normW(o) { let s = 0; for (const k in o) s += Math.max(0, o[k]); if (s <= 0) return o; const r = {}; for (const k in o) r[k] = Math.max(0, o[k]) / s; return r; }
function profileFromBuild(spec) {
  const b = (spec && spec.build) || {}, r = seededRnd(hashStr(((spec && spec.name) || 'X') + '|' + (b.style || '') + '|' + ((b.body && b.body.h) || 0))), j = (a, s) => a + (r() * 2 - 1) * s;
  const P = JSON.parse(JSON.stringify(PROF_DEF)), st = b.style;
  // the build's style leans the defaults: shooters are balanced or high, slashers quick, bigs high and wide
  const shot = { sniper: [0.6, 0.3, 0.1], slasher: [0.3, 0.1, 0.6], general: [0.5, 0.15, 0.35], lockdown: [0.55, 0.15, 0.3], glass: [0.35, 0.55, 0.1], showman: [0.3, 0.3, 0.4] }[st] || [0.6, 0.2, 0.2];
  const idle = { sniper: [0.6, 0.3, 0.1], slasher: [0.3, 0.55, 0.15], general: [0.5, 0.4, 0.1], lockdown: [0.15, 0.6, 0.25], glass: [0.3, 0.2, 0.5], showman: [0.6, 0.15, 0.25] }[st] || [0.6, 0.3, 0.1];
  P.shot = normW({ trad: j(shot[0], 0.25), high: j(shot[1], 0.2), quick: j(shot[2], 0.2) }); P.idle = normW({ relaxed: j(idle[0], 0.25), athletic: j(idle[1], 0.2), wide: j(idle[2], 0.15) });
  P.hand = r() < 0.12 ? 'L' : 'R';
  for (const [k, , lo, hi] of PROF_KEYS) { const d = PROF_DEF[k], span = (hi - lo) * 0.18; P[k] = clamp(j(d, span), lo, hi); }
  if (st === 'glass') { P.stance = clamp(P.stance + 0.15, 0.6, 1.5); P.knee = clamp(P.knee - 0.1, 0.6, 1.4); }
  if (st === 'lockdown') P.defLow = clamp(P.defLow + 0.4, -1, 1); if (st === 'showman') { P.swag = clamp(P.swag + 0.35, 0, 1); P.restless = clamp(P.restless + 0.2, 0, 1); }
  // about half of everybody shoots off a named base instead of the pure blend (drawn last, so nothing above changes for existing players)
  if (!(spec && spec.mine)) { if (r() < 0.5) P.lower = LOWER_BASES[1 + Math.floor(r() * (LOWER_BASES.length - 1))][0]; if (r() < 0.5) P.upper = UPPER_BASES[1 + Math.floor(r() * (UPPER_BASES.length - 1))][0];
  if (st === 'glass' && P.upper === 'sling') P.upper = 'over'; }      /* your own player keeps the blend until you pick a base */
  return P;
}
// anything that arrives from outside (save, another player online) is clamped here
function cleanProfile(a) {
  if (!a || typeof a !== 'object') return null; const P = JSON.parse(JSON.stringify(PROF_DEF));
  for (const g of ['shot', 'idle']) if (a[g] && typeof a[g] === 'object') for (const k in P[g]) { const v = +a[g][k]; if (isFinite(v)) P[g][k] = clamp(v, 0, 1); }
  P.shot = normW(P.shot); P.idle = normW(P.idle); P.hand = a.hand === 'L' ? 'L' : 'R'; P.lower = validBase(LOWER_BASES, a.lower || ''); P.upper = validBase(UPPER_BASES, a.upper || '');
  for (const [k, , lo, hi] of PROF_KEYS) { const v = +a[k]; if (isFinite(v)) P[k] = clamp(v, lo, hi); }
  return P;
}
function animProfile(spec) { return (spec && spec.anim && cleanProfile(spec.anim)) || profileFromBuild(spec); }

// the jump shot of a profile at phase u (u = 1 is the release); n = shot number, a tiny controlled variation per shot
function shotPose(prof, u, n) {
  prof = prof || PROF_DEF; const w = prof.shot, jit = n ? seededRnd(n * 7919 + 13) : null, vj = s => jit ? (jit() * 2 - 1) * s : 0;
  // follow-through hold: past the release the clock slows (or speeds) so the arm stays up longer, landing on the same beat
  let uu = u; if (u > SHOT_PH.release) { const f = prof.follow || 1; uu = SHOT_PH.release + (u - SHOT_PH.release) / f; }
  const list = []; for (const [k] of SHOT_STYLES) if (w[k] > 0.001) list.push([evalTrack(shotTrack(k), uu), Math.max(0, w[k] + vj(0.04))]);
  const P = blendPoses(list), out = {}; for (const k in P) out[k] = Array.isArray(P[k]) ? P[k].slice() : P[k];
  if (prof.lower) { const L = evalTrack(baseTrack(prof.lower), uu); for (const k of SKEL.lower) if (L[k]) out[k] = L[k].slice(); out.y = L.y; }
  if (prof.upper) { const U = evalTrack(baseTrack(prof.upper), uu); for (const k of SKEL.upper) if (U[k]) out[k] = U[k].slice(); }
  // posture on top of the blend: deeper or shallower knees (the dip), elbow in or out, torso lean, stance width
  const dipK = clamp(1 - Math.abs(uu - SHOT_PH.dip) / 0.35, 0, 1), kn = (prof.knee || 1) - 1 + vj(0.04);
  for (const s of ['R', 'L']) { if (out['kn' + s]) out['kn' + s][0] *= 1 + kn * dipK; if (out['hp' + s]) { out['hp' + s][0] *= 1 + kn * dipK; out['hp' + s][2] *= prof.stance || 1; } if (out['an' + s]) out['an' + s][0] *= 1 + kn * dipK * 0.6; }
  if (out.y) out.y *= 1 + kn * dipK;
  const el = (prof.elbow || 0) + vj(0.08); if (out.shR) out.shR[2] += -el * 0.22 * clamp(uu / SHOT_PH.set, 0, 1); if (out.elR) out.elR[1] = (out.elR[1] || 0) + el * 0.25;
  if (out.spine) out.spine[0] += (prof.lean || 0) * 0.08; if (out.chest) out.chest[1] = (out.chest[1] || 0) + (prof.shoulder || 0) * 0.18;
  return prof.hand === 'L' ? mirrorPose(out) : out;
}

// ---------------- 7. layers ----------------
// idle = the three base stances blended, then additive life: breathing, weight shift, shoulders settling, the hands
// finding somewhere to be, fatigue (o.tired 0..1) and readiness (o.alert 0..1 pulls toward the athletic stance)
function idlePose(prof, t, o) {
  prof = prof || PROF_DEF; o = o || {}; const w = Object.assign({}, prof.idle), al = clamp(o.alert || 0, 0, 1);
  if (al > 0) { w.athletic = (w.athletic || 0) + al * 0.8; } const tc = t * (prof.cadence || 1), ph = (o.ph || 0);
  const list = []; for (const [k] of IDLE_STYLES) if (w[k] > 0.001) list.push([idleBase(k, tc + ph), w[k]]);
  const P = blendPoses(list), out = {}; for (const k in P) out[k] = Array.isArray(P[k]) ? P[k].slice() : P[k];
  const add = (k, x, y, z) => { const v = out[k] || (out[k] = [0, 0, 0]); v[0] += x || 0; v[1] += y || 0; v[2] += z || 0; };
  const br = Math.sin(tc * 1.7 + ph), rs = prof.restless || 0, sh = Math.sin(tc * 0.45 + ph * 1.3), sh2 = Math.sin(tc * 0.23 + ph);
  add('chest', -0.018 * br, 0, 0); add('shR', 0, 0, -0.015 * br); add('shL', 0, 0, 0.015 * br); out.y = (out.y || 0) + 0.004 * br;        // breathing
  add('hips', 0, 0.03 * sh2 * rs, 0.05 * sh * (0.4 + rs)); add('hpR', 0, 0, -0.04 * sh * (0.4 + rs)); add('hpL', 0, 0, -0.04 * sh * (0.4 + rs)); add('spine', 0, 0, -0.025 * sh * (0.4 + rs));   // weight shift
  const hand = Math.max(0, Math.sin(tc * 0.31 + ph * 2.1)) * rs; add('elR', -0.35 * hand); add('wrR', 0.15 * hand); add('shR', -0.12 * hand);       // the hand comes up to the waistband, goes back down
  const tr = clamp(o.tired || 0, 0, 1); if (tr) { add('spine', 0.18 * tr); add('chest', 0.06 * tr); add('neck', -0.1 * tr); add('shR', 0, 0, 0.05 * tr); add('shL', 0, 0, -0.05 * tr); out.y -= 0.03 * tr; }
  add('spine', (prof.lean || 0) * 0.05); out.rate = 16;
  return prof.hand === 'L' ? mirrorPose(out) : out;
}
// profile posture on the moving poses (dribble crouch, defensive crouch, how high the arms carry in a run)
function profilePosture(P, an, prof) {
  if (!prof) return P; const add = (k, x, y, z) => { const v = P[k] || (P[k] = [0, 0, 0]); v[0] += x || 0; v[1] += y || 0; v[2] += z || 0; };
  if (an === 'dribble' && prof.dribLow) { const d = prof.dribLow; add('spine', 0.08 * d); add('knR', 0.12 * d); add('knL', 0.12 * d); add('hpR', -0.07 * d); add('hpL', -0.07 * d); P.y = (P.y || 0) - 0.03 * d; }
  if (an === 'slide' && prof.defLow) { const d = prof.defLow; add('knR', 0.14 * d); add('knL', 0.14 * d); add('hpR', -0.1 * d, 0, -0.04 * d); add('hpL', -0.1 * d, 0, 0.04 * d); add('spine', 0.06 * d); P.y = (P.y || 0) - 0.035 * d; }
  if (an === 'run' && prof.arms) { const d = prof.arms; add('elR', -0.2 * d); add('elL', -0.2 * d); add('shR', 0, 0, -0.04 * d); add('shL', 0, 0, 0.04 * d); }
  if ((an === 'run' || an === 'dribble' || an === 'slide') && prof.intensity !== 1) { const k = (prof.intensity || 1) - 1; add('spine', 0.06 * k); add('neck', -0.04 * k); }
  return P;
}
// corrective: a landing soaks up the drop through the knees and hips (deeper the harder the fall, quicker with good recovery)
function landLayer(P, R, p, dt, prof) {
  const air = p.y > 0.04; if (R.wasAir && !air) R.landK = clamp((R.peakY || 0) * 1.6, 0.25, 1); if (air) R.peakY = Math.max(R.peakY || 0, p.y); else R.peakY = 0; R.wasAir = air;
  if (!R.landK) return P; const k = R.landK; R.landK = Math.max(0, k - dt * 4.2 * ((prof && prof.recovery) || 1));
  const add = (j, x) => { const v = P[j] || (P[j] = [0, 0, 0]); v[0] += x; }; const e = Math.sin(Math.min(1, (1 - k) * 1.6) * Math.PI) * k + k * 0.35;
  add('knR', 0.45 * e); add('knL', 0.45 * e); add('hpR', -0.3 * e); add('hpL', -0.3 * e); add('anR', -0.12 * e); add('anL', -0.12 * e); add('spine', 0.1 * e); P.y = (P.y || 0) - 0.07 * e;
  P.rate = Math.max(P.rate || 16, 26); return P;
}

// ---------------- 6. transitions ----------------
// How quickly to blend out of the pose you are in (the rig always blends from its current evaluated pose, never a
// reset). Rates are per second of an exponential ease: 30 ≈ 0.1 s, 18 ≈ 0.17 s, 10 ≈ 0.3 s. Fast reactions are fast.
const TRANS = {
  '*>shoot': 30, '*>fake': 30, '*>pass': 32, '*>steal': 34, '*>jump': 30, '*>swat': 32, '*>stagger': 36, '*>move': 32, '*>catch': 26,
  'idle>run': 12, 'idle>dribble': 14, 'idle>slide': 18, 'run>idle': 10, 'dribble>idle': 12, 'slide>run': 16, 'run>slide': 18, 'run>dribble': 22, 'dribble>run': 18,
  'shoot>idle': 12, 'shoot>run': 14, 'shoot>slide': 16, 'jump>slide': 16, 'jump>idle': 12, 'hold>shoot': 30, 'hold>pass': 32, 'dribble>shoot': 30, 'dribble>pass': 32, 'dribble>hold': 22, 'sulk>idle': 6, 'celeb>idle': 8,
};
function transRate(from, to) { return TRANS[from + '>' + to] || TRANS['*>' + to] || 14; }

// ---------------- 8. crowds ----------------
// People watching a game. Every pose here is joint angles on top of the person's own idle blend (so any body size,
// any profile). Ambient habits: watch, phone, film, talk, clap, bob, arms crossed. Reactions: up (arms up), jump,
// ohh (hands on head), point (pointing and laughing), cover (hand over mouth), boo, count (three fingers), wave.
const CROWD_AMBIENT = ['watch', 'watch', 'watch', 'phone', 'film', 'talk', 'clap', 'bob', 'cross'];
function crowdPose(kind, t, o, prof) {
  o = o || {}; const ph = o.ph || 0, P = idlePose(prof, t, { ph, alert: o.alert || 0 }), S_ = (k, x, y, z) => { P[k] = [x || 0, y || 0, z || 0]; };
  const add = (k, x, y, z) => { const v = P[k] || (P[k] = [0, 0, 0]); v[0] += x || 0; v[1] += y || 0; v[2] += z || 0; };
  const u = o.u === undefined ? 1 : o.u, s = Math.sin(t * 7 + ph), s2 = Math.sin(t * 3.1 + ph), jumpY = (a) => Math.max(0, Math.sin(t * 9 + ph)) * a;
  const legsBend = (k) => { add('hpR', -0.25 * k); add('hpL', -0.25 * k); add('knR', 0.45 * k); add('knL', 0.45 * k); P.y = (P.y || 0) - 0.06 * k; };
  switch (kind) {
    case 'phone': S_('shR', -0.75, 0, 0.25); S_('elR', -2.1); S_('wrR', 0.5); add('neck', 0.35); add('chest', 0.06); break;
    case 'film': S_('shR', -1.45, 0, 0.32); S_('elR', -0.9); S_('wrR', 0.3); S_('shL', -1.45, 0, -0.32); S_('elL', -0.9); S_('wrL', 0.3); add('neck', -0.05); break;
    case 'talk': S_('shR', -0.55 - 0.25 * Math.max(0, s2), 0, -0.1); S_('elR', -1.3 + 0.3 * s2); S_('wrR', 0.3 * s2); add('neck', 0, 0.55, 0); add('chest', 0, 0.2, 0); break;
    case 'clap': { const c = Math.max(0, Math.sin(t * 9 + ph)); S_('shR', -1.0, 0, 0.42 - 0.22 * c); S_('elR', -1.4); S_('wrR', 0.2); S_('shL', -1.0, 0, -0.42 + 0.22 * c); S_('elL', -1.4); S_('wrL', 0.2); break; }
    case 'bob': { const b = Math.sin(t * 5.2 + ph); add('neck', 0.12 * Math.max(0, b)); add('spine', 0.04 * b); add('knR', 0.12 * Math.max(0, -b)); add('knL', 0.12 * Math.max(0, -b)); P.y = (P.y || 0) - 0.015 * Math.max(0, -b); S_('shR', 0.05, 0, -0.12); S_('elR', -0.4 - 0.2 * Math.max(0, b)); break; }
    case 'cross': S_('shR', -0.55, 0, 0.55); S_('elR', -1.9); S_('shL', -0.55, 0, -0.55); S_('elL', -1.9); S_('wrR', 0); S_('wrL', 0); add('chest', -0.04); break;
    case 'up': S_('shR', -2.75, 0, -0.35 + s * 0.15); S_('shL', -2.75, 0, 0.35 - s * 0.15); S_('elR', -0.3); S_('elL', -0.3); S_('wrR', s * 0.4); S_('wrL', -s * 0.4); add('chest', -0.12); add('neck', -0.2); P.y = (P.y || 0) + jumpY(0.05) * u; break;
    case 'jump': legsBend(0.3 * (1 - Math.max(0, Math.sin(t * 9 + ph)))); P.y = (P.y || 0) + jumpY(0.16) * u; S_('shR', -2.2, 0, -0.5); S_('shL', -2.2, 0, 0.5); S_('elR', -1.2); S_('elL', -1.2); S_('wrR', 0.6); S_('wrL', 0.6); add('neck', -0.25); break;
    case 'ohh': S_('shR', -2.6, 0, -0.9); S_('elR', -2.2); S_('shL', -2.6, 0, 0.9); S_('elL', -2.2); S_('wrR', 0.4); S_('wrL', 0.4); add('spine', -0.14 * u); add('chest', -0.12 * u); add('neck', -0.25 * u); legsBend(0.15); break;
    case 'point': { const l = Math.max(0, Math.sin(t * 11 + ph)); S_('shR', -1.55, 0, 0.1); S_('elR', -0.05); S_('wrR', 0); S_('shL', -0.4, 0, -0.3); S_('elL', -1.5); add('spine', 0.25 + 0.12 * l); add('chest', 0.1 * l); add('neck', 0.1 * l); legsBend(0.25); break; }
    case 'cover': S_('shR', -1.25, 0, 0.45); S_('elR', -2.3); S_('wrR', 0.3); S_('shL', -0.6, 0, -0.2); S_('elL', -1.2); add('spine', -0.1 * u); add('neck', -0.1); P.y = (P.y || 0) - 0.02; break;
    case 'boo': S_('shR', -1.3, 0, 0.5); S_('elR', -1.9); S_('wrR', 0.6); S_('shL', -1.3, 0, -0.5); S_('elL', -1.9); S_('wrL', 0.6); add('spine', 0.12); add('neck', -0.15 + 0.08 * s); break;      /* hands cupped round the mouth */
    case 'count': S_('shR', -2.9, 0, -0.15); S_('elR', -0.15); S_('wrR', 0.2 + 0.25 * s); S_('shL', -0.3, 0, 0.3); S_('elL', -1.2); add('neck', -0.2); P.y = (P.y || 0) + jumpY(0.04) * u; break;
    case 'wave': { const a = t * 9 + ph; S_('shR', -2.4 + 0.35 * Math.sin(a), 0, -0.4 + 0.35 * Math.cos(a)); S_('elR', -0.6); S_('wrR', 0.5); S_('shL', -0.9, 0, 0.3); S_('elL', -1.6); P.y = (P.y || 0) + jumpY(0.06) * u; break; }      /* swinging a towel round */
  }
  P.rate = kind === 'watch' || kind === 'bob' ? 14 : 18; return P;
}
// how a person reacts to a play: kind of play, and whether it was their side that did it
function crowdReaction(play, mine) {
  const r = Math.random(), pick = (...a) => a[Math.floor(Math.random() * a.length)];
  if (mine === false) return play === 'ko' || play === 'hit' ? pick('cover', 'ohh') : r < 0.5 ? 'boo' : r < 0.8 ? 'ohh' : 'cross';
  switch (play) {
    case 'dunk': return r < 0.4 ? 'jump' : r < 0.75 ? 'up' : r < 0.9 ? 'ohh' : 'point';
    case 'three': return r < 0.45 ? 'count' : r < 0.85 ? 'up' : 'jump';
    case 'block': return r < 0.5 ? 'ohh' : r < 0.8 ? 'up' : 'point';
    case 'ankles': return r < 0.45 ? 'point' : r < 0.85 ? 'ohh' : 'jump';
    case 'ko': case 'hit': return r < 0.4 ? 'cover' : r < 0.8 ? 'ohh' : 'jump';
    case 'steal': return r < 0.5 ? 'clap' : 'up';
    case 'win': return r < 0.35 ? 'jump' : r < 0.7 ? 'up' : 'wave';
    default: return r < 0.6 ? 'clap' : 'up';
  }
}
